import React, { useState, useEffect } from 'react';
import { Card, MetricCards } from '../../../components/componentsreutilizables';
import { PipelineMetrics as PipelineMetricsType, BusinessType } from '../types';
import { getPipelineMetrics } from '../api/metrics';
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Target,
  Loader2
} from 'lucide-react';

interface PipelineMetricsProps {
  businessType: BusinessType;
  userId?: string;
}

export const PipelineMetrics: React.FC<PipelineMetricsProps> = ({
  businessType,
  userId,
}) => {
  const [metrics, setMetrics] = useState<PipelineMetricsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, [businessType, userId]);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const data = await getPipelineMetrics(businessType, userId);
      setMetrics(data);
    } catch (error) {
      console.error('Error cargando métricas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando métricas...</p>
      </Card>
    );
  }

  if (!metrics) {
    return null;
  }

  const metricCards = [
    {
      id: 'total',
      title: 'Total Ventas',
      value: metrics.totalSales,
      subtitle: 'En pipeline',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'primary' as const,
    },
    {
      id: 'value',
      title: 'Valor Total',
      value: `${metrics.totalValue.toLocaleString('es-ES')}€`,
      subtitle: 'Valor potencial',
      icon: <DollarSign className="w-5 h-5" />,
      color: 'success' as const,
    },
    {
      id: 'conversion',
      title: 'Tasa Conversión',
      value: `${metrics.conversionRate.toFixed(1)}%`,
      subtitle: 'Ventas cerradas',
      icon: <Target className="w-5 h-5" />,
      color: 'warning' as const,
    },
    {
      id: 'time',
      title: 'Tiempo Promedio',
      value: `${Math.round(metrics.averageConversionTime)} días`,
      subtitle: 'Hasta el cierre',
      icon: <Clock className="w-5 h-5" />,
      color: 'info' as const,
    },
  ];

  return (
    <div className="space-y-6">
      <MetricCards data={metricCards} columns={4} />

      {/* Métricas por fase */}
      <Card className="p-4 bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Métricas por Fase
        </h3>
        <div className="space-y-4">
          {metrics.byPhase.map((phaseMetric, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900">
                    Fase {index + 1}
                  </span>
                  <span className="text-sm text-slate-600">
                    {phaseMetric.total} ventas
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  {phaseMetric.value > 0 && (
                    <span>{phaseMetric.value.toLocaleString('es-ES')}€</span>
                  )}
                  <span>{Math.round(phaseMetric.averageProbability)}% prob. promedio</span>
                  <span>{Math.round(phaseMetric.averageDaysInPhase)} días promedio</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

