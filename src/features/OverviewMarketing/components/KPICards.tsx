import React from 'react';
import { BarChart3, LineChart, MailOpen, Rocket, Users, Lightbulb, AlertTriangle, TrendingUp } from 'lucide-react';
import { MetricCards, MetricCardData, Badge } from '../../../components/componentsreutilizables';
import { MarketingKPI } from '../types';
import { MarketingOverviewService } from '../services/marketingOverviewService';
import { ds } from '../../adherencia/ui/ds';

interface KPICardsProps {
  kpis: MarketingKPI[];
  loading?: boolean;
}

const periodLabel: Record<MarketingKPI['period'], string> = {
  '7d': 'Últimos 7 días',
  '30d': 'Últimos 30 días',
  '90d': 'Últimos 90 días',
};

const iconMap: Record<string, React.ReactNode> = {
  leads: <Users className="w-5 h-5" />,
  'funnel-revenue': <BarChart3 className="w-5 h-5" />,
  'email-ctr': <MailOpen className="w-5 h-5" />,
  roas: <Rocket className="w-5 h-5" />,
  'social-growth': <LineChart className="w-5 h-5" />,
  estimatedROI: <TrendingUp className="w-5 h-5" />,
};

const trendColorMap: Record<string, MetricCardData['color']> = {
  up: 'success',
  neutral: 'info',
  down: 'warning',
};

// Función para detectar si un KPI está fuera de rango
function isOutOfRange(kpi: MarketingKPI): { isOut: boolean; severity: 'critical' | 'warning' | 'info' | null } {
  if (!kpi.expectedRange) {
    return { isOut: false, severity: null };
  }

  const { min, max } = kpi.expectedRange;
  const value = kpi.value;

  if (min !== undefined && value < min) {
    const diff = ((min - value) / min) * 100;
    return {
      isOut: true,
      severity: diff > 30 ? 'critical' : 'warning',
    };
  }

  if (max !== undefined && value > max) {
    const diff = ((value - max) / max) * 100;
    return {
      isOut: true,
      severity: diff > 30 ? 'warning' : 'info',
    };
  }

  return { isOut: false, severity: null };
}

export const KPICards: React.FC<KPICardsProps> = ({ kpis, loading = false }) => {
  const basePlaceholders: MetricCardData[] = Array.from({ length: 4 }).map((_, index) => ({
    id: `placeholder-${index}`,
    title: 'Cargando métricas',
    value: '0',
    icon: <BarChart3 className="w-5 h-5" />,
    loading: true,
  }));

  // Orden de prioridad para KPIs: métricas de negocio primero, Crecimiento Redes al final
  const kpiPriorityOrder: Record<string, number> = {
    'roas': 1,              // ROAS - Primera prioridad
    'funnel-revenue': 2,     // Ventas/Revenue - Segunda prioridad
    'estimatedROI': 3,       // ROI Estimado - Tercera prioridad
    'email-ctr': 4,          // CTR Email - Cuarta prioridad
    'leads': 5,              // Leads Generados - Quinta prioridad
    'social-growth': 6,      // Crecimiento Redes - Última prioridad (secundario)
  };

  // Ordenar KPIs según prioridad de negocio
  const sortedKpis = [...kpis].sort((a, b) => {
    const priorityA = kpiPriorityOrder[a.id] ?? 999; // KPIs no definidos al final
    const priorityB = kpiPriorityOrder[b.id] ?? 999;
    return priorityA - priorityB;
  });

  const cards: MetricCardData[] =
    sortedKpis.length === 0 && loading
      ? basePlaceholders
      : sortedKpis.map((kpi) => {
          const trend =
            typeof kpi.changePercentage === 'number'
              ? {
                  value: Math.abs(kpi.changePercentage),
                  direction: kpi.trendDirection,
                  label: 'vs. periodo anterior',
                }
              : undefined;

          const color = trendColorMap[kpi.trendDirection] ?? 'primary';

          const subtitle =
            typeof kpi.target === 'number'
              ? `Objetivo ${MarketingOverviewService.formatKpiValue({
                  ...kpi,
                  value: kpi.target,
                })}`
              : periodLabel[kpi.period] ?? 'Periodo actual';

          return {
            id: kpi.id,
            title: kpi.label,
            value: MarketingOverviewService.formatKpiValue(kpi),
            subtitle,
            trend,
            icon: iconMap[kpi.id] ?? <BarChart3 className="w-5 h-5" />,
            color,
            loading,
          };
        });

  // If we have contextual narratives, render custom cards with narratives
  const hasNarratives = sortedKpis.some((kpi) => kpi.contextualNarrative);

  if (hasNarratives && !loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sortedKpis.map((kpi, index) => {
          const card = cards[index];
          if (!card) return null;

          const colors = {
            success: {
              bg: `${ds.color.successBg} ${ds.color.successBgDark}`,
              icon: 'bg-[#10B981] dark:bg-[#34D399]',
              text: ds.color.success,
            },
            warning: {
              bg: `${ds.color.warningBg} ${ds.color.warningBgDark}`,
              icon: 'bg-[#F59E0B] dark:bg-[#FBBF24]',
              text: ds.color.warning,
            },
            info: {
              bg: `${ds.color.infoBg} ${ds.color.infoBgDark}`,
              icon: 'bg-[#3B82F6] dark:bg-[#60A5FA]',
              text: ds.color.info,
            },
            primary: {
              bg: `${ds.color.primaryLight} dark:bg-[#312E81]`,
              icon: 'bg-[#6366F1] dark:bg-[#818CF8]',
              text: ds.color.primary,
            },
          };

          const cardColors = colors[card.color || 'primary'];

          const rangeStatus = isOutOfRange(kpi);
          const alertBorderColor =
            rangeStatus.severity === 'critical'
              ? 'border-red-500 border-2'
              : rangeStatus.severity === 'warning'
              ? 'border-yellow-500 border-2'
              : rangeStatus.severity === 'info'
              ? 'border-blue-500 border-2'
              : '';

          return (
            <div key={kpi.id} className="space-y-3">
              {/* Metric Card */}
              <div
                className={`${cardColors.bg} rounded-2xl p-6 ${ds.animation.normal} hover:scale-105 relative ${alertBorderColor}`}
              >
                {/* Alert Badge */}
                {rangeStatus.isOut && rangeStatus.severity && (
                  <div className="absolute top-3 right-3">
                    <Badge
                      variant={rangeStatus.severity === 'critical' ? 'error' : rangeStatus.severity === 'warning' ? 'warning' : 'info'}
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <AlertTriangle className="w-3 h-3" />
                      Fuera de rango
                    </Badge>
                  </div>
                )}

                <div className="flex items-center">
                  {card.icon && (
                    <div className={`w-12 h-12 ${cardColors.icon} rounded-xl flex items-center justify-center mr-4 flex-shrink-0`}>
                      <div className="text-white text-xl">
                        {card.icon}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={`${ds.typography.bodySmall} font-semibold ${cardColors.text}`}>
                        {card.title}
                      </p>
                    </div>
                    
                    <p className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-1`}>
                      {card.value}
                    </p>
                    
                    {card.subtitle && (
                      <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                        {card.subtitle}
                      </p>
                    )}

                    {/* Expected Range Info */}
                    {kpi.expectedRange && (
                      <p className={`text-xs ${ds.color.textMuted} ${ds.color.textMutedDark} mt-1`}>
                        Rango esperado:{' '}
                        {kpi.expectedRange.min !== undefined && `Min: ${kpi.expectedRange.min}`}
                        {kpi.expectedRange.min !== undefined && kpi.expectedRange.max !== undefined && ' - '}
                        {kpi.expectedRange.max !== undefined && `Max: ${kpi.expectedRange.max}`}
                      </p>
                    )}
                    
                    {card.trend && (
                      <div className="flex items-center space-x-1 mt-2">
                        <span className={`${ds.typography.caption} ${card.trend.direction === 'up' ? 'text-[#10B981]' : card.trend.direction === 'down' ? 'text-[#EF4444]' : 'text-[#64748B]'}`}>
                          {card.trend.direction === 'up' ? '↑' : card.trend.direction === 'down' ? '↓' : '→'} {Math.abs(card.trend.value)}%
                        </span>
                        {card.trend.label && (
                          <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                            {card.trend.label}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Contextual Narrative */}
              {kpi.contextualNarrative && (
                <div className="rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-900/10 p-4">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                    <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} leading-relaxed`}>
                      {kpi.contextualNarrative}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Fallback to standard MetricCards if no narratives
  return <MetricCards data={cards} columns={4} />;
};











