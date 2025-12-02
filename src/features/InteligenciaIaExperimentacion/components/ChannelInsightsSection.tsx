import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Tooltip } from '../../../components/componentsreutilizables';
import { ChannelInsight, ChannelType, ChannelRecommendation } from '../types';
import { getChannelInsightsService } from '../services/intelligenceService';
import { useAuth } from '../../../context/AuthContext';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Loader2,
  Target,
  Zap,
  Clock,
  ArrowRight,
  BarChart3,
  Sparkles,
} from 'lucide-react';

interface ChannelInsightsSectionProps {
  period?: '7d' | '30d' | '90d';
  onPeriodChange?: (period: '7d' | '30d' | '90d') => void;
  trainerId?: string;
}

const channelLabels: Record<ChannelType, string> = {
  ads: 'Ads',
  organico: 'Orgánico',
  referidos: 'Referidos',
};

const channelColors: Record<ChannelType, { bg: string; text: string; border: string }> = {
  ads: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  organico: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  referidos: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
};

const priorityColors: Record<ChannelInsight['priority'], string> = {
  high: 'red',
  medium: 'yellow',
  low: 'blue',
};

const effortColors: Record<ChannelRecommendation['effort'], string> = {
  bajo: 'green',
  medio: 'yellow',
  alto: 'red',
};

const impactColors: Record<ChannelRecommendation['impact'], string> = {
  alto: 'red',
  medio: 'yellow',
  bajo: 'blue',
};

export const ChannelInsightsSection: React.FC<ChannelInsightsSectionProps> = ({
  period = '30d',
  onPeriodChange,
  trainerId,
}) => {
  const { user } = useAuth();
  const [insights, setInsights] = useState<ChannelInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState<ChannelType | 'all'>('all');
  const [expandedInsightId, setExpandedInsightId] = useState<string | null>(null);

  useEffect(() => {
    loadInsights();
  }, [period, trainerId || user?.id]);

  const loadInsights = async () => {
    setIsLoading(true);
    try {
      const response = await getChannelInsightsService({
        trainerId: trainerId || user?.id,
        period,
      });
      if (response.success && response.insights) {
        setInsights(response.insights);
      }
    } catch (error) {
      console.error('Error cargando insights por canal', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredInsights = selectedChannel === 'all'
    ? insights
    : insights.filter((insight) => insight.channel === selectedChannel);

  const getTrendIcon = (direction: 'up' | 'down' | 'neutral') => {
    switch (direction) {
      case 'up':
        return <TrendingUp size={16} className="text-green-600" />;
      case 'down':
        return <TrendingDown size={16} className="text-red-600" />;
      default:
        return <Minus size={16} className="text-slate-400" />;
    }
  };

  const formatMetricValue = (value: number, metric: string) => {
    if (metric.toLowerCase().includes('rate') || metric.toLowerCase().includes('porcentaje')) {
      return `${value.toFixed(1)}%`;
    }
    if (metric.toLowerCase().includes('roas') || metric.toLowerCase().includes('roi')) {
      return value.toFixed(2);
    }
    return value.toLocaleString('es-ES');
  };

  return (
    <div className="space-y-6">
      {/* Header con filtros */}
      <Card className="p-6 bg-white shadow-sm border border-slate-200/70">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
              <BarChart3 size={20} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-slate-900">Insights IA por Canal</h2>
              <p className="text-sm text-slate-600 mt-1">
                Recomendaciones concretas para optimizar cada frente (Ads, Orgánico, Referidos)
              </p>
            </div>
          </div>
          {onPeriodChange && (
            <div className="flex items-center gap-2">
              <select
                value={period}
                onChange={(e) => onPeriodChange(e.target.value as '7d' | '30d' | '90d')}
                className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="7d">7 días</option>
                <option value="30d">30 días</option>
                <option value="90d">90 días</option>
              </select>
            </div>
          )}
        </div>

        {/* Filtros por canal */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant={selectedChannel === 'all' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setSelectedChannel('all')}
          >
            Todos
          </Button>
          {(['ads', 'organico', 'referidos'] as ChannelType[]).map((channel) => {
            const channelInsights = insights.filter((i) => i.channel === channel);
            return (
              <Button
                key={channel}
                variant={selectedChannel === channel ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setSelectedChannel(channel)}
              >
                {channelLabels[channel]} ({channelInsights.length})
              </Button>
            );
          })}
        </div>
      </Card>

      {/* Loading state */}
      {isLoading ? (
        <Card className="p-12 flex items-center justify-center bg-white shadow-sm border border-slate-200/70">
          <div className="flex items-center gap-3 text-slate-500">
            <Loader2 className="animate-spin" size={24} />
            <span>Cargando insights por canal...</span>
          </div>
        </Card>
      ) : filteredInsights.length === 0 ? (
        <Card className="p-8 bg-white shadow-sm border border-slate-200/70">
          <p className="text-center text-slate-500">
            No se encontraron insights para los filtros seleccionados.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredInsights.map((insight) => {
            const channelColor = channelColors[insight.channel];
            const isExpanded = expandedInsightId === insight.id;

            return (
              <Card
                key={insight.id}
                className={`p-6 bg-white shadow-sm border ${channelColor.border} transition-all`}
              >
                <div className="space-y-4">
                  {/* Header del insight */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={channelColor.text.includes('blue') ? 'blue' : channelColor.text.includes('green') ? 'green' : 'purple'} size="sm">
                          {channelLabels[insight.channel]}
                        </Badge>
                        <Badge variant={priorityColors[insight.priority] as any} size="sm">
                          Prioridad {insight.priority === 'high' ? 'Alta' : insight.priority === 'medium' ? 'Media' : 'Baja'}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">{insight.title}</h3>
                      <p className="text-sm text-slate-600">{insight.description}</p>
                    </div>
                  </div>

                  {/* Performance actual */}
                  <div className={`p-4 rounded-lg ${channelColor.bg} border ${channelColor.border}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Rendimiento Actual</p>
                        <p className="text-sm font-medium text-slate-900">
                          {insight.currentPerformance.metric}: {formatMetricValue(insight.currentPerformance.value, insight.currentPerformance.metric)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(insight.currentPerformance.trendDirection)}
                        <span
                          className={`text-sm font-semibold ${
                            insight.currentPerformance.changePercentage >= 0
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {insight.currentPerformance.changePercentage >= 0 ? '+' : ''}
                          {insight.currentPerformance.changePercentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Impacto estimado */}
                  <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Target size={16} className="text-indigo-600" />
                      <span className="text-xs text-slate-600">Impacto Estimado:</span>
                      <span className="text-sm font-semibold text-slate-900">
                        +{insight.estimatedImpact.expectedImprovement}% en {insight.estimatedImpact.metric}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-600">Confianza:</span>
                      <span className="text-sm font-semibold text-slate-900">{insight.estimatedImpact.confidence}%</span>
                    </div>
                  </div>

                  {/* Recomendaciones */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-slate-900">
                        Recomendaciones ({insight.recommendations.length})
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setExpandedInsightId(isExpanded ? null : insight.id)
                        }
                      >
                        {isExpanded ? 'Ocultar' : 'Ver todas'}
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {insight.recommendations
                        .slice(0, isExpanded ? undefined : 2)
                        .map((recommendation) => (
                          <div
                            key={recommendation.id}
                            className="p-4 border border-slate-200 rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h5 className="font-semibold text-slate-900 mb-1">
                                  {recommendation.title}
                                </h5>
                                <p className="text-sm text-slate-600 mb-2">
                                  {recommendation.description}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <Tooltip content={`Esfuerzo: ${recommendation.effort}`}>
                                  <Badge variant={effortColors[recommendation.effort] as any} size="sm">
                                    <Zap size={12} className="mr-1" />
                                    {recommendation.effort}
                                  </Badge>
                                </Tooltip>
                                <Tooltip content={`Impacto: ${recommendation.impact}`}>
                                  <Badge variant={impactColors[recommendation.impact] as any} size="sm">
                                    <Target size={12} className="mr-1" />
                                    {recommendation.impact}
                                  </Badge>
                                </Tooltip>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-start gap-2">
                                <ArrowRight size={14} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-slate-700 flex-1">
                                  <strong>Acción:</strong> {recommendation.action}
                                </p>
                              </div>

                              <div className="flex items-center gap-4 text-xs text-slate-600">
                                <div className="flex items-center gap-1">
                                  <Clock size={12} />
                                  <span>{recommendation.timeframe}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Sparkles size={12} />
                                  <span>Prioridad: {recommendation.priority}/10</span>
                                </div>
                              </div>

                              {recommendation.resources && recommendation.resources.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs text-slate-600 mb-1">Recursos necesarios:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {recommendation.resources.map((resource, idx) => (
                                      <Badge key={idx} variant="blue" size="sm">
                                        {resource}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div className="mt-2 p-2 bg-indigo-50 rounded text-xs text-indigo-700">
                                <strong>Resultado esperado:</strong> {recommendation.expectedOutcome}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChannelInsightsSection;

