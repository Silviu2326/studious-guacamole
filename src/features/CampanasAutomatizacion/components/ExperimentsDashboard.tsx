import React, { useMemo } from 'react';
import { Badge, Button, Card, MetricCards } from '../../../components/componentsreutilizables';
import type { MetricCardData } from '../../../components/componentsreutilizables';
import {
  FlaskConical,
  Sparkles,
  User,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Mail,
  MessageCircle,
  Smartphone,
  BarChart3,
  Target,
  CheckCircle2,
  XCircle,
  Clock,
  Play,
  Pause,
  Eye,
} from 'lucide-react';
import { ds } from '../../adherencia/ui/ds';
import {
  ExperimentsDashboard as ExperimentsDashboardType,
  Experiment,
  ExperimentVersionType,
  MessagingChannel,
  ExperimentStatus,
} from '../types';

const channelLabel: Record<MessagingChannel, { label: string; variant: React.ComponentProps<typeof Badge>['variant']; icon: React.ReactNode }> = {
  email: { label: 'Email', variant: 'blue', icon: <Mail className="w-3.5 h-3.5" /> },
  whatsapp: { label: 'WhatsApp', variant: 'green', icon: <MessageCircle className="w-3.5 h-3.5" /> },
  sms: { label: 'SMS', variant: 'purple', icon: <Smartphone className="w-3.5 h-3.5" /> },
  push: { label: 'Push', variant: 'orange', icon: <Smartphone className="w-3.5 h-3.5" /> },
  'in-app': { label: 'In-App', variant: 'gray', icon: <MessageCircle className="w-3.5 h-3.5" /> },
};

const statusLabels: Record<ExperimentStatus, { label: string; variant: React.ComponentProps<typeof Badge>['variant']; icon: React.ReactNode }> = {
  draft: { label: 'Borrador', variant: 'gray', icon: <Eye className="w-3.5 h-3.5" /> },
  running: { label: 'En curso', variant: 'blue', icon: <Play className="w-3.5 h-3.5" /> },
  completed: { label: 'Completado', variant: 'green', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  paused: { label: 'Pausado', variant: 'yellow', icon: <Pause className="w-3.5 h-3.5" /> },
  cancelled: { label: 'Cancelado', variant: 'red', icon: <XCircle className="w-3.5 h-3.5" /> },
};

interface ExperimentsDashboardProps {
  dashboard?: ExperimentsDashboardType;
  loading?: boolean;
  className?: string;
  onExperimentCreate?: () => void;
  onExperimentEdit?: (experiment: Experiment) => void;
  onExperimentView?: (experimentId: string) => void;
  onExperimentToggle?: (experimentId: string, status: ExperimentStatus) => void;
}

const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: value < 100 ? 1 : 0,
  }).format(value);
};

export const ExperimentsDashboard: React.FC<ExperimentsDashboardProps> = ({
  dashboard,
  loading = false,
  className = '',
  onExperimentCreate,
  onExperimentEdit,
  onExperimentView,
  onExperimentToggle,
}) => {
  const metricCardsData = useMemo<MetricCardData[]>(() => {
    if (!dashboard) return [];
    return [
      {
        id: 'total-experiments',
        title: 'Total Experimentos',
        value: dashboard.totalExperiments.toString(),
        icon: <FlaskConical className="w-5 h-5 text-white" />,
        color: 'info',
      },
      {
        id: 'active-experiments',
        title: 'Activos',
        value: dashboard.activeExperiments.toString(),
        icon: <Play className="w-5 h-5 text-white" />,
        color: 'success',
      },
      {
        id: 'ai-wins',
        title: 'Victorias IA',
        value: dashboard.summary.aiWins.toString(),
        subtitle: `${formatPercentage((dashboard.summary.aiWins / dashboard.summary.totalExperiments) * 100)} de los experimentos`,
        icon: <Sparkles className="w-5 h-5 text-white" />,
        color: 'purple',
      },
      {
        id: 'human-wins',
        title: 'Victorias Humana',
        value: dashboard.summary.humanWins.toString(),
        subtitle: `${formatPercentage((dashboard.summary.humanWins / dashboard.summary.totalExperiments) * 100)} de los experimentos`,
        icon: <User className="w-5 h-5 text-white" />,
        color: 'blue',
      },
    ];
  }, [dashboard]);

  if (loading || !dashboard) {
    return (
      <Card className={className} padding="lg">
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={`${ds.shimmer} h-32`} />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/40 dark:to-indigo-900/40">
                <FlaskConical className="w-5 h-5 text-purple-600 dark:text-purple-300" />
              </div>
              <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Tablero de Experimentos
              </h2>
            </div>
            <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              Compara versiones IA vs edición humana para elegir mejor copy y optimizar tus mensajes
            </p>
          </div>
          <Button size="sm" leftIcon={<FlaskConical size={16} />} onClick={onExperimentCreate}>
            Nuevo Experimento
          </Button>
        </div>

        {/* Summary Metrics */}
        <MetricCards data={metricCardsData} columns={4} />

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-[#0f1828]">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                Mejora Promedio
              </span>
            </div>
            <p className={`${ds.typography.h3} font-bold text-purple-600 dark:text-purple-400`}>
              {formatPercentage(dashboard.summary.averageImprovement)}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-[#0f1828]">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                Completados
              </span>
            </div>
            <p className={`${ds.typography.h3} font-bold text-green-600 dark:text-green-400`}>
              {dashboard.completedExperiments}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-[#0f1828]">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                En Curso
              </span>
            </div>
            <p className={`${ds.typography.h3} font-bold text-blue-600 dark:text-blue-400`}>
              {dashboard.activeExperiments}
            </p>
          </div>
        </div>
      </Card>

      {/* Recent Experiments */}
      {dashboard.recentExperiments.length > 0 && (
        <Card padding="lg">
          <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-4`}>
            Experimentos Recientes
          </h3>
          <div className="space-y-4">
            {dashboard.recentExperiments.map((experiment) => {
              const channelInfo = channelLabel[experiment.channel];
              const statusInfo = statusLabels[experiment.status];
              const aiVersion = experiment.versions.find((v) => v.type === 'ai');
              const humanVersion = experiment.versions.find((v) => v.type === 'human');
              const aiMetric = experiment.metrics.find((m) => m.versionType === 'ai');
              const humanMetric = experiment.metrics.find((m) => m.versionType === 'human');

              return (
                <div
                  key={experiment.id}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 p-6 bg-white dark:bg-[#0f1828] hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h4 className={`${ds.typography.h4} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                          {experiment.name}
                        </h4>
                        <Badge variant={statusInfo.variant} leftIcon={statusInfo.icon}>
                          {statusInfo.label}
                        </Badge>
                        <Badge variant={channelInfo.variant} leftIcon={channelInfo.icon}>
                          {channelInfo.label}
                        </Badge>
                      </div>
                      <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-2`}>
                        {experiment.description}
                      </p>
                      <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                        Objetivo: {experiment.objective}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" onClick={() => onExperimentView?.(experiment.id)}>
                        Ver detalles
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => onExperimentEdit?.(experiment)}>
                        Editar
                      </Button>
                    </div>
                  </div>

                  {/* Versions Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {/* AI Version */}
                    {aiVersion && aiMetric && (
                      <div
                        className={`rounded-lg border-2 p-4 ${
                          experiment.winner?.versionType === 'ai'
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f1828]'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                            Versión IA
                          </span>
                          {experiment.winner?.versionType === 'ai' && (
                            <Badge variant="purple" size="sm">
                              Ganador
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className={ds.color.textMuted}>Apertura:</span>
                            <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                              {formatPercentage(aiMetric.openRate)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className={ds.color.textMuted}>Respuesta:</span>
                            <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                              {formatPercentage(aiMetric.replyRate)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className={ds.color.textMuted}>Conversión:</span>
                            <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                              {formatPercentage(aiMetric.conversionRate)}
                            </span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                            <span className={`${ds.typography.bodySmall} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                              Engagement Score:
                            </span>
                            <span className={`${ds.typography.bodySmall} font-bold text-purple-600 dark:text-purple-400`}>
                              {aiMetric.engagementScore.toFixed(1)}
                            </span>
                          </div>
                          {aiMetric.revenue && (
                            <div className="flex justify-between">
                              <span className={ds.color.textMuted}>Ingresos:</span>
                              <span className={`${ds.typography.bodySmall} font-semibold text-green-600 dark:text-green-400`}>
                                {formatCurrency(aiMetric.revenue)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="mt-3 p-2 bg-slate-50 dark:bg-slate-800 rounded text-xs">
                          <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} line-clamp-2`}>
                            {aiVersion.content.message}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Human Version */}
                    {humanVersion && humanMetric && (
                      <div
                        className={`rounded-lg border-2 p-4 ${
                          experiment.winner?.versionType === 'human'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0f1828]'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                            Versión Humana
                          </span>
                          {experiment.winner?.versionType === 'human' && (
                            <Badge variant="blue" size="sm">
                              Ganador
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className={ds.color.textMuted}>Apertura:</span>
                            <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                              {formatPercentage(humanMetric.openRate)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className={ds.color.textMuted}>Respuesta:</span>
                            <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                              {formatPercentage(humanMetric.replyRate)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className={ds.color.textMuted}>Conversión:</span>
                            <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                              {formatPercentage(humanMetric.conversionRate)}
                            </span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                            <span className={`${ds.typography.bodySmall} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                              Engagement Score:
                            </span>
                            <span className={`${ds.typography.bodySmall} font-bold text-blue-600 dark:text-blue-400`}>
                              {humanMetric.engagementScore.toFixed(1)}
                            </span>
                          </div>
                          {humanMetric.revenue && (
                            <div className="flex justify-between">
                              <span className={ds.color.textMuted}>Ingresos:</span>
                              <span className={`${ds.typography.bodySmall} font-semibold text-green-600 dark:text-green-400`}>
                                {formatCurrency(humanMetric.revenue)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="mt-3 p-2 bg-slate-50 dark:bg-slate-800 rounded text-xs">
                          <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} line-clamp-2`}>
                            {humanVersion.content.message}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Winner Info */}
                  {experiment.winner && (
                    <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5" />
                        <div className="flex-1">
                          <p className={`${ds.typography.bodySmall} font-medium text-green-800 dark:text-green-300`}>
                            Ganador: Versión {experiment.winner.versionType === 'ai' ? 'IA' : 'Humana'}
                          </p>
                          <p className={`${ds.typography.caption} text-green-700 dark:text-green-400 mt-1`}>
                            {experiment.winner.reason}
                          </p>
                          <p className={`${ds.typography.caption} text-green-600 dark:text-green-500 mt-1`}>
                            Confianza: {experiment.winner.confidence}%
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Insights */}
                  {experiment.insights.length > 0 && (
                    <div className="mt-4">
                      <h5 className={`${ds.typography.bodySmall} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
                        Insights:
                      </h5>
                      <ul className="space-y-1">
                        {experiment.insights.map((insight, index) => (
                          <li key={index} className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} flex items-start gap-2`}>
                            <ArrowRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Dates */}
                  <div className="mt-4 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Inicio: {new Date(experiment.startDate).toLocaleDateString('es-ES')}</span>
                    </div>
                    {experiment.endDate && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Fin: {new Date(experiment.endDate).toLocaleDateString('es-ES')}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Insights */}
      {dashboard.insights.length > 0 && (
        <Card padding="lg">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Insights Generales
            </h3>
          </div>
          <div className="space-y-2">
            {dashboard.insights.map((insight, index) => (
              <div
                key={index}
                className="flex items-start gap-2 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800"
              >
                <ArrowRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                <p className={`${ds.typography.bodySmall} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                  {insight}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Footer */}
      <div className="text-center text-xs text-slate-500 dark:text-slate-400">
        Última actualización: {new Date(dashboard.lastUpdated).toLocaleString('es-ES')}
      </div>
    </div>
  );
};

