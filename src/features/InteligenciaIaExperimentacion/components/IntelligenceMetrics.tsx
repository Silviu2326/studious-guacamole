import React from 'react';
import { MetricCards } from '../../../components/componentsreutilizables';
import { IntelligenceMetric } from '../types';
import { BrainCircuit, FlaskConical, Gauge, Radar } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  playbooks: <BrainCircuit size={24} />,
  experiments: <FlaskConical size={24} />,
  personalization: <Gauge size={24} />,
  insights: <Radar size={24} />,
};

const colorMap = {
  primary: 'primary',
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'error',
} as const;

interface IntelligenceMetricsProps {
  metrics: IntelligenceMetric[];
}

export const IntelligenceMetrics: React.FC<IntelligenceMetricsProps> = ({ metrics }) => {
  const cards = metrics.map((metric) => ({
    id: metric.id,
    title: metric.title,
    value: metric.value,
    subtitle: metric.subtitle,
    icon: iconMap[metric.id] ?? <BrainCircuit size={24} />,
    color: colorMap[metric.color],
    trend: metric.trend
      ? {
          value: metric.trend.value,
          direction: metric.trend.direction,
          label: metric.trend.label,
        }
      : undefined,
  }));

  return <MetricCards data={cards} columns={4} />;
};

export default IntelligenceMetrics;

