import React, { useState, useEffect } from 'react';
import { Card, Select, MetricCards } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { SegmentAnalytics } from '../types';
import { getSegmentAnalytics } from '../api/analytics';
import { BarChart3, TrendingUp, DollarSign, Users, Percent } from 'lucide-react';

export const SegmentAnalyticsComponent: React.FC = () => {
  const [analytics, setAnalytics] = useState<SegmentAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSegment, setSelectedSegment] = useState('1');
  const [period, setPeriod] = useState('30');

  useEffect(() => {
    loadAnalytics();
  }, [selectedSegment, period]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const days = parseInt(period);
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
      const data = await getSegmentAnalytics(selectedSegment, startDate);
      setAnalytics(data);
    } catch (error) {
      console.error('Error cargando analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const metrics = analytics ? [
    {
      id: 'total-members',
      title: 'Total Miembros',
      value: analytics.totalMembers.toLocaleString(),
      subtitle: 'En el segmento',
      icon: <Users className="w-5 h-5" />,
      color: 'primary' as const
    },
    {
      id: 'engagement-rate',
      title: 'Tasa de Compromiso',
      value: `${(analytics.engagementRate * 100).toFixed(1)}%`,
      subtitle: 'Nivel de participación',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'success' as const
    },
    {
      id: 'conversion-rate',
      title: 'Tasa de Conversión',
      value: `${(analytics.conversionRate * 100).toFixed(1)}%`,
      subtitle: 'Conversiones realizadas',
      icon: <Percent className="w-5 h-5" />,
      color: 'info' as const
    },
    {
      id: 'revenue',
      title: 'Ingresos',
      value: `$${analytics.revenue.toLocaleString()}`,
      subtitle: 'Total generado',
      icon: <DollarSign className="w-5 h-5" />,
      color: 'warning' as const
    },
    {
      id: 'avg-ltv',
      title: 'LTV Promedio',
      value: `$${analytics.avgLifetimeValue.toLocaleString()}`,
      subtitle: 'Valor de por vida',
      icon: <DollarSign className="w-5 h-5" />,
      color: 'success' as const
    },
    {
      id: 'churn-rate',
      title: 'Tasa de Abandono',
      value: `${(analytics.churnRate * 100).toFixed(1)}%`,
      subtitle: 'Clientes perdidos',
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'error' as const
    }
  ] : [];

  return (
    <div className="space-y-6">
      <Card padding="md">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Analytics de Segmento
            </h3>
            <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mt-1`}>
              Métricas y tendencias de efectividad por segmento
            </p>
          </div>
          <div className="flex gap-3">
            <Select
              options={[
                { value: '1', label: 'Segmento 1' },
                { value: '2', label: 'Segmento 2' },
                { value: '3', label: 'Segmento 3' }
              ]}
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              className="w-48"
              fullWidth={false}
            />
            <Select
              options={[
                { value: '7', label: 'Últimos 7 días' },
                { value: '30', label: 'Últimos 30 días' },
                { value: '90', label: 'Últimos 90 días' },
                { value: '365', label: 'Último año' }
              ]}
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-40"
              fullWidth={false}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mt-4`}>
              Cargando analytics...
            </p>
          </div>
        ) : analytics ? (
          <>
            <MetricCards data={metrics} columns={3} />

            <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-4`}>
                Tendencias
              </h4>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                      Número de Miembros
                    </span>
                    <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                      {analytics.trends.memberCount.length} puntos de datos
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-600 rounded-full"
                      style={{ width: `${Math.min(100, (analytics.trends.memberCount.length / 30) * 100)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                      Tasa de Compromiso
                    </span>
                    <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                      {(analytics.engagementRate * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-600 rounded-full"
                      style={{ width: `${analytics.engagementRate * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                      Ingresos Generados
                    </span>
                    <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                      ${analytics.revenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${Math.min(100, (analytics.revenue / 50000) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              No se encontraron datos de analytics
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

