import React, { useCallback, useEffect, useState } from 'react';
import { Beaker, TrendingUp, BarChart3, Sparkles, Play, Pause, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { FunnelsAdquisicionService } from '../services/funnelsAdquisicionService';
import { FunnelExperiment, FunnelExperimentStatus, FunnelExperimentType, FunnelExperimentVariant } from '../types';

interface FunnelExperimentsProps {
  funnelId?: string;
  className?: string;
}

const statusColors = {
  draft: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  running: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  paused: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  archived: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

const statusLabels = {
  draft: 'Borrador',
  running: 'En ejecución',
  paused: 'Pausado',
  completed: 'Completado',
  archived: 'Archivado',
};

const typeLabels = {
  copy: 'Copy',
  offer: 'Oferta',
  format: 'Formato',
  cta: 'CTA',
  headline: 'Headline',
  image: 'Imagen',
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
};

export const FunnelExperiments: React.FC<FunnelExperimentsProps> = ({
  funnelId,
  className = '',
}) => {
  const [experiments, setExperiments] = useState<FunnelExperiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExperiment, setSelectedExperiment] = useState<FunnelExperiment | null>(null);

  const loadExperiments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await FunnelsAdquisicionService.getFunnelExperimentsList(funnelId);
      setExperiments(data);
    } catch (error) {
      console.error('[FunnelExperiments] Error cargando experimentos:', error);
    } finally {
      setLoading(false);
    }
  }, [funnelId]);

  useEffect(() => {
    loadExperiments();
  }, [loadExperiments]);

  const handleToggleStatus = async (experimentId: string, currentStatus: FunnelExperimentStatus) => {
    try {
      const newStatus = currentStatus === 'running' ? 'paused' : 'running';
      await FunnelsAdquisicionService.updateFunnelExperimentStatusData(experimentId, newStatus);
      await loadExperiments();
    } catch (error) {
      console.error('[FunnelExperiments] Error actualizando estado:', error);
    }
  };

  if (loading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Beaker className="w-5 h-5 text-indigo-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
            A/B Tests Guiados por IA
          </h2>
        </div>
        <Badge variant="blue" size="md">
          {experiments.length} experimentos
        </Badge>
      </div>

      {experiments.length === 0 ? (
        <div className="text-center py-8">
          <Beaker className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-1">
            No hay experimentos activos
          </h3>
          <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">
            Crea tu primer A/B test para mejorar las conversiones de tu funnel
          </p>
          <Button variant="primary" size="sm" className="inline-flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Crear experimento con IA
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {experiments.map((experiment) => (
            <div
              key={experiment.id}
              className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                      {experiment.name}
                    </h3>
                    <Badge
                      variant={experiment.status === 'running' ? 'success' : experiment.status === 'completed' ? 'info' : 'secondary'}
                      size="sm"
                    >
                      {statusLabels[experiment.status]}
                    </Badge>
                    <Badge variant="secondary" size="sm">
                      {typeLabels[experiment.type]}
                    </Badge>
                  </div>
                  {experiment.description && (
                    <p className="text-sm text-gray-600 dark:text-slate-400 mb-2">
                      {experiment.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-slate-400">
                    <span>Objetivo: {experiment.objective}</span>
                    {experiment.startDate && (
                      <span>
                        Inicio: {new Date(experiment.startDate).toLocaleDateString('es-ES')}
                      </span>
                    )}
                    {experiment.confidence && (
                      <span className="flex items-center gap-1">
                        <BarChart3 className="w-4 h-4" />
                        Confianza: {experiment.confidence}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {experiment.status === 'running' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleToggleStatus(experiment.id, experiment.status)}
                      className="inline-flex items-center gap-2"
                    >
                      <Pause className="w-4 h-4" />
                      Pausar
                    </Button>
                  )}
                  {experiment.status === 'paused' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleToggleStatus(experiment.id, experiment.status)}
                      className="inline-flex items-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Reanudar
                    </Button>
                  )}
                </div>
              </div>

              {/* Variantes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {experiment.variants.map((variant) => (
                  <VariantCard
                    key={variant.id}
                    variant={variant}
                    isWinner={experiment.winner === variant.id}
                    experimentStatus={experiment.status}
                  />
                ))}
              </div>

              {/* Resultados */}
              {experiment.status === 'completed' && experiment.winner && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="font-semibold text-gray-900 dark:text-slate-100">
                      Ganador: {experiment.variants.find((v) => v.id === experiment.winner)?.name}
                    </span>
                    {experiment.lift && (
                      <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                        <TrendingUp className="w-4 h-4" />
                        +{experiment.lift}% mejora
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Sugerencias IA */}
              {experiment.aiSuggestions && experiment.aiSuggestions.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                      Sugerencias IA
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {experiment.aiSuggestions.map((suggestion) => (
                      <div
                        key={suggestion.id}
                        className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="text-sm font-medium text-gray-900 dark:text-slate-100 mb-1">
                              {suggestion.title}
                            </h5>
                            <p className="text-xs text-gray-600 dark:text-slate-400 mb-2">
                              {suggestion.description}
                            </p>
                            {suggestion.estimatedLift && (
                              <p className="text-xs text-indigo-600 dark:text-indigo-400">
                                Impacto esperado: +{suggestion.estimatedLift}%
                              </p>
                            )}
                          </div>
                          <Button variant="ghost" size="sm" className="text-indigo-600">
                            Aplicar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

interface VariantCardProps {
  variant: FunnelExperimentVariant;
  isWinner: boolean;
  experimentStatus: FunnelExperimentStatus;
}

const VariantCard: React.FC<VariantCardProps> = ({ variant, isWinner, experimentStatus }) => {
  return (
    <div
      className={`rounded-lg border-2 p-4 ${
        isWinner && experimentStatus === 'completed'
          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
          : variant.isControl
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/60'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-gray-900 dark:text-slate-100">{variant.name}</h4>
          {variant.isControl && (
            <Badge variant="info" size="sm">
              Control
            </Badge>
          )}
          {isWinner && experimentStatus === 'completed' && (
            <Badge variant="success" size="sm">
              Ganador
            </Badge>
          )}
          {variant.content.aiGenerated && (
            <Badge variant="secondary" size="sm" className="inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              IA
            </Badge>
          )}
        </div>
      </div>

      {/* Contenido de la variante */}
      <div className="space-y-2 mb-3">
        {variant.content.headline && (
          <div>
            <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">Headline:</p>
            <p className="text-sm font-medium text-gray-900 dark:text-slate-100">
              {variant.content.headline}
            </p>
          </div>
        )}
        {variant.content.ctaText && (
          <div>
            <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">CTA:</p>
            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
              {variant.content.ctaText}
            </p>
          </div>
        )}
        {variant.content.offerTitle && (
          <div>
            <p className="text-xs text-gray-500 dark:text-slate-400 mb-1">Oferta:</p>
            <p className="text-sm font-medium text-gray-900 dark:text-slate-100">
              {variant.content.offerTitle}
            </p>
          </div>
        )}
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-xs text-gray-500 dark:text-slate-400">Visitantes</p>
          <p className="font-semibold text-gray-900 dark:text-slate-100">
            {variant.visitors.toLocaleString('es-ES')}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-slate-400">Conversiones</p>
          <p className="font-semibold text-gray-900 dark:text-slate-100">
            {variant.conversions.toLocaleString('es-ES')}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-slate-400">Tasa de conversión</p>
          <p className="font-semibold text-indigo-600 dark:text-indigo-400">
            {variant.conversionRate.toFixed(2)}%
          </p>
        </div>
        {variant.revenue && (
          <div>
            <p className="text-xs text-gray-500 dark:text-slate-400">Revenue</p>
            <p className="font-semibold text-green-600 dark:text-green-400">
              {formatCurrency(variant.revenue)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

