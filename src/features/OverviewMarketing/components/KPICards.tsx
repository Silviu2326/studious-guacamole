import React from 'react';
import { BarChart3, LineChart, MailOpen, Rocket, Users } from 'lucide-react';
import { MetricCards, MetricCardData } from '../../../components/componentsreutilizables';
import { MarketingKPI } from '../types';
import { MarketingOverviewService } from '../services/marketingOverviewService';

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
};

const trendColorMap: Record<string, MetricCardData['color']> = {
  up: 'success',
  neutral: 'info',
  down: 'warning',
};

export const KPICards: React.FC<KPICardsProps> = ({ kpis, loading = false }) => {
  const basePlaceholders: MetricCardData[] = Array.from({ length: 4 }).map((_, index) => ({
    id: `placeholder-${index}`,
    title: 'Cargando métricas',
    value: '0',
    icon: <BarChart3 className="w-5 h-5" />,
    loading: true,
  }));

  const cards: MetricCardData[] =
    kpis.length === 0 && loading
      ? basePlaceholders
      : kpis.map((kpi) => {
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

  return <MetricCards data={cards} columns={4} />;
};









