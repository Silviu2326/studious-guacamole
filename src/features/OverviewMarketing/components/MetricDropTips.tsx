import { AlertTriangle, TrendingDown, Lightbulb, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { Badge, Button } from '../../../../components/componentsreutilizables';
import { MetricDropTipsSnapshot, MetricDropTip, MetricDropSeverity } from '../types';

interface MetricDropTipsProps {
  snapshot: MetricDropTipsSnapshot | null;
  loading: boolean;
  onApplyTip?: (tipId: string) => Promise<void>;
  className?: string;
}

export function MetricDropTips({ snapshot, loading, onApplyTip, className = '' }: MetricDropTipsProps) {
  const getSeverityIcon = (severity: MetricDropSeverity) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'moderate':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSeverityBadge = (severity: MetricDropSeverity) => {
    const variants: Record<MetricDropSeverity, { variant: 'danger' | 'warning' | 'blue'; label: string }> = {
      critical: { variant: 'danger', label: 'Crítico' },
      warning: { variant: 'warning', label: 'Advertencia' },
      moderate: { variant: 'blue', label: 'Moderado' },
    };

    const config = variants[severity];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getImpactBadge = (impact: 'high' | 'medium' | 'low') => {
    const variants = {
      high: { variant: 'success' as const, label: 'Alto Impacto' },
      medium: { variant: 'blue' as const, label: 'Impacto Medio' },
      low: { variant: 'secondary' as const, label: 'Bajo Impacto' },
    };

    const config = variants[impact];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className={`bg-white dark:bg-[#0f172a] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!snapshot || snapshot.tips.length === 0) {
    return (
      <div className={`bg-white dark:bg-[#0f172a] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
            <Lightbulb className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">Tips IA para Métricas</h2>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Tips específicos cuando una métrica cae, adaptados a tu estilo
            </p>
          </div>
        </div>
        <div className="text-center py-8">
          <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-slate-400">Todas tus métricas están en buen estado</p>
        </div>
      </div>
    );
  }

  // Ordenar tips por prioridad (1 = más urgente)
  const sortedTips = [...snapshot.tips].sort((a, b) => a.priority - b.priority);

  return (
    <div className={`bg-white dark:bg-[#0f172a] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
            <Lightbulb className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">Tips IA para Métricas</h2>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Tips específicos cuando una métrica cae, adaptados a tu estilo
            </p>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">{snapshot.criticalCount}</div>
          <div className="text-sm text-gray-600 dark:text-slate-400">Críticos</div>
        </div>
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{snapshot.warningCount}</div>
          <div className="text-sm text-gray-600 dark:text-slate-400">Advertencias</div>
        </div>
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{snapshot.moderateCount}</div>
          <div className="text-sm text-gray-600 dark:text-slate-400">Moderados</div>
        </div>
        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{snapshot.totalCount}</div>
          <div className="text-sm text-gray-600 dark:text-slate-400">Total</div>
        </div>
      </div>

      {/* Lista de Tips */}
      <div className="space-y-4">
        {sortedTips.map((tip) => (
          <div
            key={tip.id}
            className={`p-5 rounded-lg border-2 ${
              tip.severity === 'critical'
                ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                : tip.severity === 'warning'
                ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3 flex-1">
                {getSeverityIcon(tip.severity)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-slate-100">{tip.kpiLabel}</h3>
                    {getSeverityBadge(tip.severity)}
                    {getImpactBadge(tip.expectedImpact)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-slate-400 mb-2">
                    <span>
                      <TrendingDown className="w-4 h-4 inline mr-1 text-red-500" />
                      {tip.dropPercentage.toFixed(1)}% de caída
                    </span>
                    <span>
                      {tip.previousValue.toFixed(1)} → {tip.currentValue.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tip Principal */}
            <div className="mb-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-slate-100 mb-1">Tip de IA:</p>
                  <p className="text-sm text-gray-700 dark:text-slate-300">{tip.tip}</p>
                </div>
              </div>
            </div>

            {/* Acciones */}
            {tip.actionItems.length > 0 && (
              <div className="mb-4">
                <p className="font-medium text-gray-900 dark:text-slate-100 mb-2 text-sm">Acciones a realizar:</p>
                <ul className="space-y-1">
                  {tip.actionItems.map((action, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Adaptación al Estilo */}
            {(tip.adaptedToStyle.tone || tip.adaptedToStyle.specialty || tip.adaptedToStyle.strengths) && (
              <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <p className="font-medium text-gray-900 dark:text-slate-100 mb-1 text-sm">Adaptado a tu estilo:</p>
                <div className="flex flex-wrap gap-2">
                  {tip.adaptedToStyle.tone && (
                    <Badge variant="blue" size="sm">
                      Tono: {tip.adaptedToStyle.tone}
                    </Badge>
                  )}
                  {tip.adaptedToStyle.specialty && (
                    <Badge variant="blue" size="sm">
                      Especialidad: {tip.adaptedToStyle.specialty}
                    </Badge>
                  )}
                  {tip.adaptedToStyle.strengths && tip.adaptedToStyle.strengths.length > 0 && (
                    <Badge variant="blue" size="sm">
                      Fortalezas: {tip.adaptedToStyle.strengths.join(', ')}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Rationale */}
            <div className="mb-3">
              <p className="text-xs text-gray-600 dark:text-slate-400 italic">
                <strong>Por qué funciona:</strong> {tip.rationale}
              </p>
            </div>

            {/* Experimentos Relacionados */}
            {tip.relatedExperiments && tip.relatedExperiments.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-gray-600 dark:text-slate-400">
                  <strong>Basado en experimentos exitosos:</strong> {tip.relatedExperiments.length} experimento(s)
                  relacionado(s)
                </p>
              </div>
            )}

            {/* Botón de Acción */}
            {onApplyTip && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onApplyTip(tip.id)}
                  className="w-full sm:w-auto"
                >
                  Aplicar este Tip
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Insights */}
      {snapshot.insights.length > 0 && (
        <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
          <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">Insights</h3>
          <ul className="space-y-1">
            {snapshot.insights.map((insight, idx) => (
              <li key={idx} className="text-sm text-gray-700 dark:text-slate-300">
                • {insight}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

