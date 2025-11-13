import React, { useMemo } from 'react';
import { Badge, Button, Card, MetricCards } from '../../../components/componentsreutilizables';
import type { MetricCardData } from '../../../components/componentsreutilizables';
import {
  Lightbulb,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  Target,
  Zap,
  Settings,
  BarChart3,
  Calendar,
  MessageSquare,
  DollarSign,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { ds } from '../../adherencia/ui/ds';
import {
  WeeklyAIInsightsDashboard,
  WeeklyImprovement,
  ImprovementType,
  ImprovementPriority,
  ImprovementStatus,
} from '../types';

const improvementTypeLabels: Record<ImprovementType, { label: string; icon: React.ReactNode; color: string }> = {
  cta: { label: 'CTA', icon: <Target className="w-4 h-4" />, color: 'blue' },
  delay: { label: 'Delay', icon: <Clock className="w-4 h-4" />, color: 'purple' },
  tone: { label: 'Tono', icon: <MessageSquare className="w-4 h-4" />, color: 'yellow' },
  content: { label: 'Contenido', icon: <MessageSquare className="w-4 h-4" />, color: 'green' },
  channel: { label: 'Canal', icon: <MessageSquare className="w-4 h-4" />, color: 'indigo' },
  timing: { label: 'Timing', icon: <Clock className="w-4 h-4" />, color: 'orange' },
  personalization: { label: 'Personalización', icon: <Sparkles className="w-4 h-4" />, color: 'pink' },
  other: { label: 'Otro', icon: <Settings className="w-4 h-4" />, color: 'gray' },
};

const priorityLabels: Record<ImprovementPriority, { label: string; variant: React.ComponentProps<typeof Badge>['variant']; icon: React.ReactNode }> = {
  high: { label: 'Alta', variant: 'red', icon: <AlertCircle className="w-3.5 h-3.5" /> },
  medium: { label: 'Media', variant: 'yellow', icon: <Target className="w-3.5 h-3.5" /> },
  low: { label: 'Baja', variant: 'blue', icon: <Zap className="w-3.5 h-3.5" /> },
};

const statusLabels: Record<ImprovementStatus, { label: string; variant: React.ComponentProps<typeof Badge>['variant']; icon: React.ReactNode }> = {
  pending: { label: 'Pendiente', variant: 'gray', icon: <Clock className="w-3.5 h-3.5" /> },
  applied: { label: 'Aplicada', variant: 'green', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  dismissed: { label: 'Descartada', variant: 'red', icon: <XCircle className="w-3.5 h-3.5" /> },
  testing: { label: 'Probando', variant: 'blue', icon: <BarChart3 className="w-3.5 h-3.5" /> },
};

interface WeeklyAIInsightsProps {
  dashboard?: WeeklyAIInsightsDashboard;
  loading?: boolean;
  className?: string;
  onImprovementApply?: (improvementId: string) => void;
  onImprovementDismiss?: (improvementId: string) => void;
  onImprovementView?: (improvementId: string) => void;
  onGenerateInsights?: () => void;
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

export const WeeklyAIInsights: React.FC<WeeklyAIInsightsProps> = ({
  dashboard,
  loading = false,
  className = '',
  onImprovementApply,
  onImprovementDismiss,
  onImprovementView,
  onGenerateInsights,
}) => {
  const metricCardsData = useMemo<MetricCardData[]>(() => {
    if (!dashboard?.currentWeek) return [];
    const { metrics } = dashboard.currentWeek;
    return [
      {
        id: 'total-messages',
        title: 'Mensajes Enviados',
        value: metrics.totalMessagesSent.toLocaleString('es-ES'),
        icon: <MessageSquare className="w-5 h-5 text-white" />,
        color: 'info',
      },
      {
        id: 'average-open-rate',
        title: 'Tasa de Apertura',
        value: formatPercentage(metrics.averageOpenRate),
        subtitle: `vs. período anterior: ${formatPercentage(Math.abs(metrics.trends.changePercentage.openRate))}`,
        icon: <TrendingUp className="w-5 h-5 text-white" />,
        color: metrics.trends.openRate === 'up' ? 'success' : metrics.trends.openRate === 'down' ? 'error' : 'info',
        trend: {
          value: Math.abs(metrics.trends.changePercentage.openRate),
          direction: metrics.trends.openRate,
          label: 'vs. período anterior',
        },
      },
      {
        id: 'average-reply-rate',
        title: 'Tasa de Respuesta',
        value: formatPercentage(metrics.averageReplyRate),
        subtitle: `vs. período anterior: ${formatPercentage(Math.abs(metrics.trends.changePercentage.replyRate))}`,
        icon: <MessageSquare className="w-5 h-5 text-white" />,
        color: metrics.trends.replyRate === 'up' ? 'success' : metrics.trends.replyRate === 'down' ? 'error' : 'info',
        trend: {
          value: Math.abs(metrics.trends.changePercentage.replyRate),
          direction: metrics.trends.replyRate,
          label: 'vs. período anterior',
        },
      },
      {
        id: 'total-revenue',
        title: 'Ingresos Totales',
        value: formatCurrency(metrics.totalRevenue),
        icon: <DollarSign className="w-5 h-5 text-white" />,
        color: 'success',
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

  const currentWeek = dashboard.currentWeek;
  const pendingImprovements = currentWeek?.improvements.filter((imp) => imp.status === 'pending') || [];
  const appliedImprovements = currentWeek?.improvements.filter((imp) => imp.status === 'applied') || [];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card padding="lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/40 dark:to-orange-900/40">
                <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-300" />
              </div>
              <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Insights IA Semanales
              </h2>
            </div>
            <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              Mejoras concretas sugeridas por IA para iterar sin analizar a mano: cambiar CTA, ajustar delay, optimizar contenido
            </p>
          </div>
          <Button size="sm" leftIcon={<Sparkles size={16} />} onClick={onGenerateInsights}>
            Generar Insights
          </Button>
        </div>

        {/* Summary Metrics */}
        {currentWeek && <MetricCards data={metricCardsData} columns={4} />}

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-[#0f1828]">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                Mejoras Totales
              </span>
            </div>
            <p className={`${ds.typography.h3} font-bold text-yellow-600 dark:text-yellow-400`}>
              {dashboard.totalImprovements}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-[#0f1828]">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                Aplicadas
              </span>
            </div>
            <p className={`${ds.typography.h3} font-bold text-green-600 dark:text-green-400`}>
              {dashboard.appliedImprovements}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-[#0f1828]">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                Pendientes
              </span>
            </div>
            <p className={`${ds.typography.h3} font-bold text-blue-600 dark:text-blue-400`}>
              {dashboard.pendingImprovements}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-[#0f1828]">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                Mejora Promedio
              </span>
            </div>
            <p className={`${ds.typography.h3} font-bold text-purple-600 dark:text-purple-400`}>
              {formatPercentage(dashboard.averageImprovement)}
            </p>
          </div>
        </div>
      </Card>

      {/* Current Week Summary */}
      {currentWeek && (
        <Card padding="lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Resumen Semanal
              </h3>
              <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mt-1`}>
                {new Date(currentWeek.weekStartDate).toLocaleDateString('es-ES')} -{' '}
                {new Date(currentWeek.weekEndDate).toLocaleDateString('es-ES')}
              </p>
            </div>
            <Badge variant="blue">
              {new Date(currentWeek.generatedAt).toLocaleDateString('es-ES')}
            </Badge>
          </div>

          <p className={`${ds.typography.body} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-4`}>
            {currentWeek.summary}
          </p>

          {/* AI Recommendations */}
          {currentWeek.aiRecommendations.length > 0 && (
            <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h4 className={`${ds.typography.bodySmall} font-semibold text-indigo-800 dark:text-indigo-300`}>
                  Recomendaciones IA
                </h4>
              </div>
              <ul className="space-y-2">
                {currentWeek.aiRecommendations.map((recommendation, index) => (
                  <li
                    key={index}
                    className={`${ds.typography.bodySmall} text-indigo-700 dark:text-indigo-300 flex items-start gap-2`}
                  >
                    <ArrowRight className="w-3 h-3 mt-1 flex-shrink-0" />
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}

      {/* Pending Improvements */}
      {pendingImprovements.length > 0 && (
        <Card padding="lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Mejoras Pendientes
            </h3>
            <Badge variant="blue">{pendingImprovements.length}</Badge>
          </div>
          <div className="space-y-4">
            {pendingImprovements.map((improvement) => (
              <ImprovementCard
                key={improvement.id}
                improvement={improvement}
                onApply={() => onImprovementApply?.(improvement.id)}
                onDismiss={() => onImprovementDismiss?.(improvement.id)}
                onView={() => onImprovementView?.(improvement.id)}
              />
            ))}
          </div>
        </Card>
      )}

      {/* Applied Improvements */}
      {appliedImprovements.length > 0 && (
        <Card padding="lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Mejoras Aplicadas
            </h3>
            <Badge variant="green">{appliedImprovements.length}</Badge>
          </div>
          <div className="space-y-4">
            {appliedImprovements.map((improvement) => (
              <ImprovementCard
                key={improvement.id}
                improvement={improvement}
                onApply={() => onImprovementApply?.(improvement.id)}
                onDismiss={() => onImprovementDismiss?.(improvement.id)}
                onView={() => onImprovementView?.(improvement.id)}
              />
            ))}
          </div>
        </Card>
      )}

      {/* All Improvements by Type */}
      {currentWeek && currentWeek.improvements.length > 0 && (
        <Card padding="lg">
          <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-4`}>
            Todas las Mejoras
          </h3>
          <div className="space-y-4">
            {currentWeek.improvements.map((improvement) => (
              <ImprovementCard
                key={improvement.id}
                improvement={improvement}
                onApply={() => onImprovementApply?.(improvement.id)}
                onDismiss={() => onImprovementDismiss?.(improvement.id)}
                onView={() => onImprovementView?.(improvement.id)}
              />
            ))}
          </div>
        </Card>
      )}

      {/* Footer */}
      <div className="text-center text-xs text-slate-500 dark:text-slate-400">
        Última actualización: {new Date(dashboard.lastUpdated).toLocaleString('es-ES')}
        {dashboard.lastGenerated && (
          <span className="ml-2">
            • Última generación: {new Date(dashboard.lastGenerated).toLocaleString('es-ES')}
          </span>
        )}
      </div>
    </div>
  );
};

interface ImprovementCardProps {
  improvement: WeeklyImprovement;
  onApply?: () => void;
  onDismiss?: () => void;
  onView?: () => void;
}

const ImprovementCard: React.FC<ImprovementCardProps> = ({ improvement, onApply, onDismiss, onView }) => {
  const typeInfo = improvementTypeLabels[improvement.type];
  const priorityInfo = priorityLabels[improvement.priority];
  const statusInfo = statusLabels[improvement.status];

  // Map colors to Tailwind classes
  const typeColorClasses: Record<string, { bg: string; icon: string }> = {
    blue: { bg: 'bg-blue-100 dark:bg-blue-900/40', icon: 'text-blue-600 dark:text-blue-400' },
    purple: { bg: 'bg-purple-100 dark:bg-purple-900/40', icon: 'text-purple-600 dark:text-purple-400' },
    yellow: { bg: 'bg-yellow-100 dark:bg-yellow-900/40', icon: 'text-yellow-600 dark:text-yellow-400' },
    green: { bg: 'bg-green-100 dark:bg-green-900/40', icon: 'text-green-600 dark:text-green-400' },
    indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/40', icon: 'text-indigo-600 dark:text-indigo-400' },
    orange: { bg: 'bg-orange-100 dark:bg-orange-900/40', icon: 'text-orange-600 dark:text-orange-400' },
    pink: { bg: 'bg-pink-100 dark:bg-pink-900/40', icon: 'text-pink-600 dark:text-pink-400' },
    gray: { bg: 'bg-gray-100 dark:bg-gray-900/40', icon: 'text-gray-600 dark:text-gray-400' },
  };

  const typeColorClass = typeColorClasses[typeInfo.color] || typeColorClasses.gray;

  return (
    <div
      className={`rounded-lg border-2 p-4 ${
        improvement.status === 'applied'
          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
          : improvement.status === 'dismissed'
          ? 'border-red-500 bg-red-50 dark:bg-red-900/20 opacity-60'
          : improvement.priority === 'high'
          ? 'border-red-300 bg-red-50 dark:bg-red-900/20'
          : improvement.priority === 'medium'
          ? 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20'
          : 'border-blue-300 bg-blue-50 dark:bg-blue-900/20'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <div className={`p-1.5 rounded-lg ${typeColorClass.bg}`}>
              {React.cloneElement(typeInfo.icon as React.ReactElement, {
                className: `w-3.5 h-3.5 ${typeColorClass.icon}`,
              })}
            </div>
            <h4 className={`${ds.typography.h4} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {improvement.title}
            </h4>
            <Badge variant={priorityInfo.variant} leftIcon={priorityInfo.icon} size="sm">
              {priorityInfo.label}
            </Badge>
            <Badge variant={statusInfo.variant} leftIcon={statusInfo.icon} size="sm">
              {statusInfo.label}
            </Badge>
            <Badge variant="outline" size="sm">
              {improvement.typeLabel}
            </Badge>
          </div>
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-3`}>
            {improvement.description}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {improvement.status === 'pending' && (
            <>
              <Button size="sm" variant="success" onClick={onApply}>
                Aplicar
              </Button>
              <Button size="sm" variant="ghost" onClick={onDismiss}>
                Descartar
              </Button>
            </>
          )}
          <Button size="sm" variant="ghost" onClick={onView}>
            Ver detalles
          </Button>
        </div>
      </div>

      {/* Current vs Suggested State */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 bg-white dark:bg-[#0f1828]">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-3.5 h-3.5 text-slate-500" />
            <span className={`${ds.typography.caption} font-medium ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
              Estado Actual
            </span>
          </div>
          <p className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
            {improvement.currentState.label}: {improvement.currentState.value}
          </p>
        </div>
        <div className="rounded-lg border border-green-300 dark:border-green-700 p-3 bg-green-50 dark:bg-green-900/20">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
            <span className={`${ds.typography.caption} font-medium text-green-700 dark:text-green-300`}>
              Estado Sugerido
            </span>
          </div>
          <p className={`${ds.typography.bodySmall} font-semibold text-green-800 dark:text-green-300`}>
            {improvement.suggestedState.label}: {improvement.suggestedState.value}
          </p>
        </div>
      </div>

      {/* Expected Impact */}
      <div className="mb-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
        <div className="flex items-center justify-between mb-2">
          <span className={`${ds.typography.bodySmall} font-medium text-indigo-800 dark:text-indigo-300`}>
            Impacto Esperado
          </span>
          <Badge
            variant={improvement.expectedImpact.impact === 'high' ? 'red' : improvement.expectedImpact.impact === 'medium' ? 'yellow' : 'blue'}
            size="sm"
          >
            {improvement.expectedImpact.impact === 'high' ? 'Alto' : improvement.expectedImpact.impact === 'medium' ? 'Medio' : 'Bajo'}
          </Badge>
        </div>
        <p className={`${ds.typography.bodySmall} text-indigo-700 dark:text-indigo-300 mb-2`}>
          {improvement.expectedImpact.metric}: {improvement.expectedImpact.currentValue} →{' '}
          {improvement.expectedValue} (
          <span className="font-semibold text-green-600 dark:text-green-400">
            +{formatPercentage(improvement.expectedImpact.improvementPercentage)}
          </span>
          )
        </p>
        <p className={`${ds.typography.caption} text-indigo-600 dark:text-indigo-400`}>
          {improvement.rationale}
        </p>
      </div>

      {/* Affected Automations/Campaigns */}
      {(improvement.affectedAutomations.length > 0 || improvement.affectedCampaigns.length > 0) && (
        <div className="mb-3">
          <p className={`${ds.typography.caption} font-medium ${ds.color.textMuted} ${ds.color.textMutedDark} mb-2`}>
            Afecta:
          </p>
          <div className="flex flex-wrap gap-2">
            {improvement.affectedAutomations.map((automation) => (
              <Badge key={automation.automationId} variant="outline" size="sm">
                {automation.automationName}
              </Badge>
            ))}
            {improvement.affectedCampaigns.map((campaign) => (
              <Badge key={campaign.campaignId} variant="outline" size="sm">
                {campaign.campaignName}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Test Results */}
      {improvement.testResults && (
        <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
            <span className={`${ds.typography.bodySmall} font-medium text-green-800 dark:text-green-300`}>
              Resultados de Prueba
            </span>
          </div>
          <p className={`${ds.typography.bodySmall} text-green-700 dark:text-green-300 mb-1`}>
            Mejora lograda: <span className="font-semibold">+{formatPercentage(improvement.testResults.improvementAchieved)}</span>
          </p>
          <p className={`${ds.typography.caption} text-green-600 dark:text-green-400`}>
            {improvement.testResults.actualImpact}
          </p>
          <p className={`${ds.typography.caption} text-green-600 dark:text-green-400 mt-1`}>
            Probado el: {new Date(improvement.testResults.testedAt).toLocaleDateString('es-ES')}
          </p>
        </div>
      )}

      {/* Effort */}
      <div className="flex items-center gap-2 mt-3">
        <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
          Esfuerzo:
        </span>
        <Badge
          variant={
            improvement.effort === 'low' ? 'green' : improvement.effort === 'medium' ? 'yellow' : 'red'
          }
          size="sm"
        >
          {improvement.effort === 'low' ? 'Bajo' : improvement.effort === 'medium' ? 'Medio' : 'Alto'}
        </Badge>
      </div>
    </div>
  );
};

