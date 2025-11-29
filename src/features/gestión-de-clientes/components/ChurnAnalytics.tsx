import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, MetricCards } from '../../../components/componentsreutilizables';
import { ChurnAnalytics } from '../types';
import { getChurnAnalytics } from '../api/analytics';
import { TrendingDown, TrendingUp, Users, AlertTriangle, BarChart3, Loader2 } from 'lucide-react';

export const ChurnAnalyticsComponent: React.FC = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<ChurnAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await getChurnAnalytics(user?.role || 'entrenador', user?.id);
      setAnalytics(data);
    } catch (error) {
      console.error('Error cargando analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analytics) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando analytics...</p>
      </Card>
    );
  }

  const metrics = [
    {
      id: 'active',
      title: 'Clientes Activos',
      value: analytics.activeClients.toString(),
      subtitle: `${analytics.totalClients} total`,
      icon: <Users className="w-5 h-5" />,
      color: 'success' as const,
    },
    {
      id: 'risk',
      title: 'En Riesgo',
      value: analytics.riskClients.toString(),
      subtitle: `${((analytics.riskClients / analytics.totalClients) * 100).toFixed(1)}% del total`,
      icon: <AlertTriangle className="w-5 h-5" />,
      color: 'warning' as const,
    },
    {
      id: 'churn-rate',
      title: 'Tasa de Churn',
      value: `${analytics.churnRate.toFixed(1)}%`,
      subtitle: 'Último mes',
      icon: <TrendingDown className="w-5 h-5" />,
      color: 'error' as const,
    },
    {
      id: 'retention',
      title: 'Tasa de Retención',
      value: `${analytics.retentionRate.toFixed(1)}%`,
      subtitle: 'Promedio',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'success' as const,
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-xl ring-1 ring-purple-200/70">
              <BarChart3 size={20} className="text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Análisis de Churn
              </h3>
              <p className="text-sm text-gray-600">
                Métricas de retención y pérdida de clientes
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <MetricCards data={metrics} columns={4} />
        </div>
      </Card>

      <Card variant="hover" className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Principales Motivos de Baja
        </h3>
        <div className="space-y-3">
          {analytics.topChurnReasons.map((reason, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-900">
                    {reason.reason.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {reason.count} ({reason.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full"
                    style={{ width: `${reason.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card variant="hover" className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Tiempo Promedio de Vida
        </h3>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
            {analytics.averageLifetime}
          </div>
          <div>
            <p className="text-base font-medium text-gray-900">
              {analytics.averageLifetime} meses
            </p>
            <p className="text-sm text-gray-600">
              Tiempo promedio antes de la baja
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

