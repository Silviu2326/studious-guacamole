import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Eye,
  Sparkles,
  Lightbulb,
  BarChart3,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Info,
} from 'lucide-react';
import {
  Button,
  Card,
  Badge,
  Select,
} from '../../../components/componentsreutilizables';
import type {
  VisualStyleLearningSnapshot,
  VisualStylePerformance,
  VisualStyleRecommendation,
  ContentFormat,
  SocialPlatform,
  TrainerNiche,
} from '../types';
import {
  getVisualStyleLearningSnapshot,
  getVisualStyleRecommendations,
  updateVisualStyleLearning,
  updateVisualStyleLearningConfig,
} from '../api/visualStyleLearning';

interface VisualStyleLearningProps {
  loading?: boolean;
}

export function VisualStyleLearning({ loading: externalLoading }: VisualStyleLearningProps) {
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [snapshot, setSnapshot] = useState<VisualStyleLearningSnapshot | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<ContentFormat | ''>('');
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | ''>('');
  const [filteredRecommendations, setFilteredRecommendations] = useState<VisualStyleRecommendation[]>([]);

  useEffect(() => {
    loadSnapshot();
  }, []);

  useEffect(() => {
    if (snapshot) {
      loadFilteredRecommendations();
    }
  }, [selectedFormat, selectedPlatform, snapshot]);

  const loadSnapshot = async () => {
    setLoading(true);
    try {
      const data = await getVisualStyleLearningSnapshot();
      setSnapshot(data);
      setFilteredRecommendations(data.recommendations);
    } catch (error) {
      console.error('Error loading visual style learning snapshot:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFilteredRecommendations = async () => {
    if (!snapshot) return;

    try {
      const response = await getVisualStyleRecommendations({
        contentType: selectedFormat || undefined,
        platform: selectedPlatform || undefined,
        limit: 5,
      });
      setFilteredRecommendations(response.recommendations);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }
  };

  const handleUpdateLearning = async () => {
    setUpdating(true);
    try {
      const updated = await updateVisualStyleLearning();
      setSnapshot(updated);
      setFilteredRecommendations(updated.recommendations);
    } catch (error) {
      console.error('Error updating learning:', error);
      alert('Error al actualizar el aprendizaje. Intenta nuevamente.');
    } finally {
      setUpdating(false);
    }
  };

  const toggleAutoRecommendations = async () => {
    if (!snapshot) return;

    try {
      const updated = await updateVisualStyleLearningConfig({
        autoRecommendations: !snapshot.config.autoRecommendations,
      });
      setSnapshot({
        ...snapshot,
        config: updated,
      });
    } catch (error) {
      console.error('Error updating config:', error);
    }
  };

  if (externalLoading || loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-1/3 bg-slate-200 rounded" />
          <div className="h-24 bg-slate-100 rounded-2xl" />
        </div>
      </Card>
    );
  }

  if (!snapshot) {
    return (
      <Card className="p-6">
        <div className="text-center py-12">
          <Eye className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No hay datos de aprendizaje disponibles</p>
        </div>
      </Card>
    );
  }

  const formatEngagement = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default:
        return <BarChart3 className="w-4 h-4 text-slate-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'yellow';
      default:
        return 'blue';
    }
  };

  return (
    <Card className="p-0 shadow-sm border border-slate-100">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <Eye className="w-5 h-5 text-indigo-500" />
            Aprendizaje de Estilos Visuales
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            La IA aprende qué estilos visuales obtienen más engagement para recomendarte formatos similares
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleUpdateLearning}
            disabled={updating}
            leftIcon={<RefreshCw className={`w-4 h-4 ${updating ? 'animate-spin' : ''}`} />}
          >
            {updating ? 'Actualizando...' : 'Actualizar'}
          </Button>
          <Button
            variant={snapshot.config.autoRecommendations ? 'primary' : 'secondary'}
            size="sm"
            onClick={toggleAutoRecommendations}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            {snapshot.config.autoRecommendations ? 'Auto-activo' : 'Activar Auto'}
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Insights */}
        {snapshot.insights.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              <h3 className="text-lg font-semibold text-slate-900">Insights Clave</h3>
            </div>
            <div className="space-y-3">
              {snapshot.insights.map((insight) => {
                const Icon =
                  insight.type === 'trend'
                    ? TrendingUp
                    : insight.type === 'pattern'
                    ? BarChart3
                    : insight.type === 'recommendation'
                    ? CheckCircle2
                    : AlertCircle;
                const iconColor =
                  insight.type === 'trend'
                    ? 'text-blue-500'
                    : insight.type === 'pattern'
                    ? 'text-purple-500'
                    : insight.type === 'recommendation'
                    ? 'text-green-500'
                    : 'text-yellow-500';

                return (
                  <div
                    key={insight.id}
                    className="p-4 border border-slate-200 rounded-lg bg-slate-50"
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`w-5 h-5 ${iconColor} mt-0.5`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-slate-900">{insight.title}</h4>
                          <Badge variant={getPriorityColor(insight.priority) as any} size="sm">
                            {insight.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600">{insight.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Filtros de Recomendaciones */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <h3 className="text-lg font-semibold text-slate-900">Recomendaciones de Estilos</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Filtrar por Formato
              </label>
              <Select
                options={[
                  { value: '', label: 'Todos los formatos' },
                  { value: 'reel', label: 'Reel' },
                  { value: 'post', label: 'Post' },
                  { value: 'carousel', label: 'Carousel' },
                  { value: 'story', label: 'Story' },
                ]}
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value as ContentFormat | '')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Filtrar por Plataforma
              </label>
              <Select
                options={[
                  { value: '', label: 'Todas las plataformas' },
                  { value: 'instagram', label: 'Instagram' },
                  { value: 'facebook', label: 'Facebook' },
                  { value: 'tiktok', label: 'TikTok' },
                  { value: 'linkedin', label: 'LinkedIn' },
                ]}
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value as SocialPlatform | '')}
              />
            </div>
          </div>

          {/* Recomendaciones */}
          <div className="space-y-4">
            {filteredRecommendations.length > 0 ? (
              filteredRecommendations.map((recommendation) => (
                <div
                  key={recommendation.id}
                  className="p-5 border border-slate-200 rounded-lg bg-white hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-slate-900">
                          {recommendation.recommendedStyle.description}
                        </h4>
                        <Badge variant="green" size="sm">
                          {recommendation.confidence}% confianza
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{recommendation.reason}</p>
                    </div>
                  </div>

                  {/* Atributos del Estilo */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-slate-500 mb-2">Atributos del Estilo:</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(recommendation.recommendedStyle.attributes).map(
                        ([key, value]) => (
                          <Badge key={key} variant="gray" size="sm">
                            {key}: {value}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>

                  {/* Engagement Esperado */}
                  {recommendation.expectedEngagement && (
                    <div className="mb-4 p-3 bg-indigo-50 rounded-lg">
                      <p className="text-xs font-semibold text-indigo-900 mb-1">
                        Engagement Esperado:
                      </p>
                      <p className="text-sm text-indigo-700">
                        {formatEngagement(recommendation.expectedEngagement.min)} -{' '}
                        {formatEngagement(recommendation.expectedEngagement.max)} interacciones
                        (promedio: {formatEngagement(recommendation.expectedEngagement.average)})
                      </p>
                    </div>
                  )}

                  {/* Formatos Sugeridos */}
                  <div>
                    <p className="text-xs font-semibold text-slate-500 mb-2">Formatos Sugeridos:</p>
                    <div className="space-y-2">
                      {recommendation.suggestedFormats.map((format, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 bg-slate-50 rounded"
                        >
                          <div>
                            <span className="text-sm font-medium text-slate-900">
                              {format.format} - {format.platform}
                            </span>
                            <p className="text-xs text-slate-500">{format.reason}</p>
                          </div>
                          <Badge
                            variant={format.priority === 'high' ? 'red' : format.priority === 'medium' ? 'yellow' : 'blue'}
                            size="sm"
                          >
                            {format.priority}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Estilos Similares */}
                  {recommendation.similarHighPerformingStyles.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <p className="text-xs font-semibold text-slate-500 mb-2">
                        Estilos Similares con Alto Rendimiento:
                      </p>
                      <div className="space-y-1">
                        {recommendation.similarHighPerformingStyles.map((similar) => (
                          <div
                            key={similar.styleId}
                            className="text-xs text-slate-600 flex items-center gap-2"
                          >
                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                            <span>{similar.style.description}</span>
                            <span className="text-slate-400">
                              ({formatEngagement(similar.performance.engagement)} interacciones,{' '}
                              {similar.performance.engagementRate}% tasa)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                <Info className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p>No hay recomendaciones disponibles con los filtros seleccionados</p>
              </div>
            )}
          </div>
        </div>

        {/* Estilos Aprendidos */}
        {snapshot.learnedStyles.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-indigo-500" />
              <h3 className="text-lg font-semibold text-slate-900">Estilos Aprendidos</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {snapshot.learnedStyles
                .sort((a, b) => b.score - a.score)
                .map((stylePerf) => (
                  <div
                    key={stylePerf.styleId}
                    className="p-4 border border-slate-200 rounded-lg bg-white"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 mb-1">
                          {stylePerf.style.description}
                        </h4>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {stylePerf.style.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="gray" size="sm">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(stylePerf.trend.direction)}
                        <span className="text-xs font-semibold text-slate-600">
                          {stylePerf.trend.changePercentage > 0 ? '+' : ''}
                          {stylePerf.trend.changePercentage}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Score:</span>
                        <span className="font-semibold text-slate-900">{stylePerf.score}/100</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Engagement Promedio:</span>
                        <span className="font-semibold text-slate-900">
                          {formatEngagement(stylePerf.metrics.averageEngagement)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Tasa de Engagement:</span>
                        <span className="font-semibold text-slate-900">
                          {stylePerf.metrics.averageEngagementRate}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Posts Analizados:</span>
                        <span className="font-semibold text-slate-900">
                          {stylePerf.metrics.totalPosts}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <Badge
                        variant={getPriorityColor(stylePerf.priority) as any}
                        size="sm"
                      >
                        {stylePerf.priority} priority
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Configuración */}
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-slate-500" />
            <h4 className="text-sm font-semibold text-slate-900">Configuración Actual</h4>
          </div>
          <div className="text-xs text-slate-600 space-y-1">
            <p>Período de aprendizaje: {snapshot.config.learningPeriod}</p>
            <p>Mínimo de posts para aprendizaje: {snapshot.config.minPostsForLearning}</p>
            <p>Recomendaciones automáticas: {snapshot.config.autoRecommendations ? 'Activadas' : 'Desactivadas'}</p>
            <p>Frecuencia: {snapshot.config.recommendationFrequency}</p>
            <p className="text-slate-400 mt-2">
              Última actualización: {new Date(snapshot.lastUpdated).toLocaleString('es-ES')}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

