import React from 'react';
import { MetricCards } from '../../../components/componentsreutilizables';
import { KPI } from '../types';

interface KPIGridProps {
  kpis: KPI[];
  loading?: boolean;
}

export const KPIGrid: React.FC<KPIGridProps> = ({ kpis, loading = false }) => {
  const metricsData = kpis.map((kpi, index) => ({
    id: `kpi-${index}`,
    title: kpi.title,
    value: typeof kpi.value === 'number' && kpi.value <= 1 
      ? `${(kpi.value * 100).toFixed(0)}%` 
      : kpi.value,
    change: kpi.change,
    loading,
    color: (index % 4 === 0 ? 'primary' : 
            index % 4 === 1 ? 'success' : 
            index % 4 === 2 ? 'info' : 
            'warning') as 'primary' | 'success' | 'warning' | 'info',
  }));

  return <MetricCards data={metricsData} columns={4} />;
};

