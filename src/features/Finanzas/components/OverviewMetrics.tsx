import { MetricCards, type MetricCardData } from '../../../components/componentsreutilizables';
import type { FinancialMetric } from '../api';

interface OverviewMetricsProps {
  metrics: FinancialMetric[];
}

export function OverviewMetrics({ metrics }: OverviewMetricsProps) {
  const metricCards: MetricCardData[] = metrics.map(metric => ({
    id: metric.id,
    title: metric.label,
    value:
      typeof metric.value === 'number'
        ? metric.value.toLocaleString('es-ES', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 0,
          })
        : metric.value,
    trend: metric.delta
      ? {
          value: metric.delta,
          direction: metric.trend ?? 'neutral',
        }
      : undefined,
  }));

  return <MetricCards data={metricCards} columns={4} />;
}



