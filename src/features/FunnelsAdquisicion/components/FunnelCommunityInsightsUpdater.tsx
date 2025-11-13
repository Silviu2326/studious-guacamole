import { useState, useEffect, useCallback } from 'react';
import {
  Star,
  MessageSquare,
  TrendingUp,
  Check,
  X,
  Loader2,
  Sparkles,
  AlertCircle,
  Users,
  Award,
} from 'lucide-react';
import { Button, Card, Badge, Input, Select } from '../../../components/componentsreutilizables';
import { FunnelsAdquisicionService } from '../services/funnelsAdquisicionService';
import {
  CommunityInsight,
  FunnelCommunityInsightsStatus,
  FunnelCommunityInsightsUpdate,
  FunnelCommunityInsightsUpdateResponse,
  CommunityInsightsRecommendation,
  AcquisitionFunnelPerformance,
} from '../types';

interface FunnelCommunityInsightsUpdaterProps {
  funnel: AcquisitionFunnelPerformance;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (response: FunnelCommunityInsightsUpdateResponse) => void;
}

const placementOptions: { value: 'hero' | 'social_proof' | 'testimonials' | 'features' | 'cta' | 'sidebar' | 'footer'; label: string }[] = [
  { value: 'hero', label: 'Hero (Principal)' },
  { value: 'social_proof', label: 'Prueba Social' },
  { value: 'testimonials', label: 'Testimonios' },
  { value: 'features', label: 'Características' },
  { value: 'cta', label: 'Call to Action' },
  { value: 'sidebar', label: 'Barra Lateral' },
  { value: 'footer', label: 'Footer' },
];

export function FunnelCommunityInsightsUpdater({
  funnel,
  isOpen,
  onClose,
  onSuccess,
}: FunnelCommunityInsightsUpdaterProps) {
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [insights, setInsights] = useState<CommunityInsight[]>([]);
  const [status, setStatus] = useState<FunnelCommunityInsightsStatus | null>(null);
  const [recommendations, setRecommendations] = useState<CommunityInsightsRecommendation[]>([]);
  const [selectedInsights, setSelectedInsights] = useState<Map<string, { placement: string; stageId?: string }>>(new Map());
  const [error, setError] = useState<string | null>(null);
  const [minScore, setMinScore] = useState<number>(4);
  const [minNps, setMinNps] = useState<number>(70);

  useEffect(() => {
    if (isOpen) {
      loadInsights();
      loadStatus();
    }
  }, [isOpen, funnel.id]);

  const loadInsights = useCallback(async () => {
    setLoading(true);
    try {
      const data = await FunnelsAdquisicionService.getCommunityInsights(20, minScore, minNps);
      setInsights(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar insights');
    } finally {
      setLoading(false);
    }
  }, [minScore, minNps]);

  const loadStatus = useCallback(async () => {
    setLoadingStatus(true);
    try {
      const data = await FunnelsAdquisicionService.getFunnelCommunityInsightsStatus(funnel.id);
      setStatus(data);
      setRecommendations(data.recommendations);
    } catch (err: any) {
      console.error('Error cargando estado:', err);
    } finally {
      setLoadingStatus(false);
    }
  }, [funnel.id]);

  const handleToggleInsight = useCallback((insightId: string, placement: string, stageId?: string) => {
    setSelectedInsights((prev) => {
      const newMap = new Map(prev);
      if (newMap.has(insightId)) {
        newMap.delete(insightId);
      } else {
        newMap.set(insightId, { placement, stageId });
      }
      return newMap;
    });
  }, []);

  const handleSelectRecommendations = useCallback(() => {
    const topRecommendations = recommendations.slice(0, 5);
    const newMap = new Map<string, { placement: string; stageId?: string }>();
    topRecommendations.forEach((rec) => {
      newMap.set(rec.insightId, {
        placement: rec.suggestedPlacement,
      });
    });
    setSelectedInsights(newMap);
  }, [recommendations]);

  const handleUpdate = useCallback(async () => {
    if (selectedInsights.size === 0) {
      setError('Selecciona al menos un insight para actualizar el funnel');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const request: FunnelCommunityInsightsUpdate = {
        funnelId: funnel.id,
        insights: Array.from(selectedInsights.entries()).map(([insightId, config]) => ({
          insightId,
          placement: config.placement as any,
          stageId: config.stageId,
        })),
        criteria: {
          minScore,
          minNps,
        },
      };

      const response = await FunnelsAdquisicionService.updateFunnelWithCommunityInsights(request);
      if (onSuccess) {
        onSuccess(response);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el funnel');
    } finally {
      setLoading(false);
    }
  }, [selectedInsights, funnel.id, minScore, minNps, onSuccess, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white dark:bg-slate-900 shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
                Actualizar Funnel con Insights de Comunidad
              </h2>
              <p className="text-sm text-gray-600 dark:text-slate-400">{funnel.name}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-140px)] px-6 py-4 space-y-6">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
              </div>
            </div>
          )}

          {/* Estado actual */}
          {status && (
            <div className="rounded-lg border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 p-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-3">Estado Actual</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-600 dark:text-slate-400">Total Insights</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-slate-100">{status.totalInsights}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-slate-400">Activos</p>
                  <p className="text-lg font-semibold text-green-600 dark:text-green-400">{status.activeInsights}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-slate-400">Score Promedio</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                    {status.averageScore?.toFixed(1) || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-slate-400">NPS Promedio</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                    {status.averageNps || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Filtros */}
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Score Mínimo
              </label>
              <Input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={minScore}
                onChange={(e) => setMinScore(parseFloat(e.target.value) || 4)}
                className="w-full"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">NPS Mínimo</label>
              <Input
                type="number"
                min="-100"
                max="100"
                value={minNps}
                onChange={(e) => setMinNps(parseInt(e.target.value) || 70)}
                className="w-full"
              />
            </div>
            <Button variant="secondary" size="sm" onClick={loadInsights} disabled={loading}>
              <Sparkles className="w-4 h-4 mr-2" />
              Filtrar
            </Button>
          </div>

          {/* Recomendaciones */}
          {recommendations.length > 0 && (
            <div className="rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-100">
                  Recomendaciones IA
                </h3>
                <Button variant="ghost" size="sm" onClick={handleSelectRecommendations}>
                  Seleccionar Todas
                </Button>
              </div>
              <div className="space-y-2">
                {recommendations.slice(0, 3).map((rec) => (
                  <div
                    key={rec.insightId}
                    className="flex items-start gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg"
                  >
                    <input
                      type="checkbox"
                      checked={selectedInsights.has(rec.insightId)}
                      onChange={() => handleToggleInsight(rec.insightId, rec.suggestedPlacement)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="blue" size="sm">
                          Score: {rec.recommendationScore}
                        </Badge>
                        <Badge variant="green" size="sm">
                          {rec.estimatedImpact === 'high' ? 'Alto Impacto' : rec.estimatedImpact === 'medium' ? 'Medio Impacto' : 'Bajo Impacto'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-slate-300">{rec.reason}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                        Colocación sugerida: {placementOptions.find((p) => p.value === rec.suggestedPlacement)?.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lista de Insights */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-3">
              Insights Disponibles ({insights.length})
            </h3>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
              </div>
            ) : insights.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-slate-400">
                No hay insights disponibles con los filtros seleccionados
              </div>
            ) : (
              <div className="space-y-3">
                {insights.map((insight) => {
                  const isSelected = selectedInsights.has(insight.id);
                  const config = selectedInsights.get(insight.id);

                  return (
                    <div
                      key={insight.id}
                      className={`rounded-lg border p-4 transition-all ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                          : 'border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleInsight(insight.id, 'testimonials')}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {insight.type === 'testimonial' && (
                              <Badge variant="blue" size="sm">
                                <Star className="w-3 h-3 mr-1" />
                                Testimonio
                              </Badge>
                            )}
                            {insight.type === 'nps' && (
                              <Badge variant="green" size="sm">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                NPS
                              </Badge>
                            )}
                            {insight.type === 'review' && (
                              <Badge variant="purple" size="sm">
                                <MessageSquare className="w-3 h-3 mr-1" />
                                Review
                              </Badge>
                            )}
                            {insight.score && (
                              <Badge variant="yellow" size="sm">
                                {insight.score} ⭐
                              </Badge>
                            )}
                            {insight.npsValue !== undefined && (
                              <Badge variant="green" size="sm">
                                NPS: {insight.npsValue}
                              </Badge>
                            )}
                            <span className="text-xs text-gray-500 dark:text-slate-400">{insight.source}</span>
                          </div>
                          <p className="text-sm text-gray-900 dark:text-slate-100 mb-2">{insight.content}</p>
                          {insight.customerName && (
                            <p className="text-xs text-gray-600 dark:text-slate-400">— {insight.customerName}</p>
                          )}
                          {insight.metrics && (
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-slate-400">
                              <span className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                {insight.metrics.conversions} conversiones
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {insight.metrics.views} vistas
                              </span>
                            </div>
                          )}
                          {isSelected && (
                            <div className="mt-3 pt-3 border-t border-indigo-200 dark:border-indigo-800">
                              <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 mb-1">
                                Colocación
                              </label>
                              <Select
                                value={config?.placement || 'testimonials'}
                                onChange={(e) => {
                                  const newMap = new Map(selectedInsights);
                                  newMap.set(insight.id, {
                                    placement: e.target.value,
                                    stageId: config?.stageId,
                                  });
                                  setSelectedInsights(newMap);
                                }}
                                className="w-full"
                              >
                                {placementOptions.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </Select>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-200 dark:border-slate-800 px-6 py-4">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdate}
            disabled={loading || selectedInsights.size === 0}
            className="inline-flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Actualizando...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Actualizar Funnel ({selectedInsights.size})
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}

