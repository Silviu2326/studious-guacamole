import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, MetricCards, Button } from '../../../components/componentsreutilizables';
import { getChurnStats } from '../api/churnStats';
import { ChurnStats } from '../types';
import { UserType } from '../types';
import { 
  TrendingDown, 
  DollarSign, 
  Users, 
  BarChart3,
  Download,
  Filter,
  Calendar
} from 'lucide-react';
import { ChurnedClientsTable } from './ChurnedClientsTable';

interface ChurnedClientsDashboardProps {
  userType: UserType;
}

export const ChurnedClientsDashboard: React.FC<ChurnedClientsDashboardProps> = ({ userType }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<ChurnStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>(() => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 1);
    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    };
  });

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const statsData = await getChurnStats({
        startDate: new Date(dateRange.start).toISOString(),
        endDate: new Date(dateRange.end).toISOString(),
      });
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const metrics = useMemo(() => {
    if (!stats) return [];
    
    return [
      {
        id: 'churn-rate',
        title: 'Tasa de Churn',
        value: `${stats.customerChurnRate.toFixed(1)}%`,
        subtitle: 'Clientes perdidos',
        trend: {
          value: 0,
          direction: stats.customerChurnRate > 5 ? 'down' : 'up',
        },
        icon: <TrendingDown className="w-5 h-5" />,
        color: stats.customerChurnRate > 5 ? 'error' : 'success' as const,
      },
      {
        id: 'mrr-churn',
        title: 'Churn de Ingresos (MRR)',
        value: `${stats.mrrChurnRate.toFixed(1)}%`,
        subtitle: 'Ingresos perdidos',
        trend: {
          value: 0,
          direction: stats.mrrChurnRate > 4 ? 'down' : 'up',
        },
        icon: <DollarSign className="w-5 h-5" />,
        color: stats.mrrChurnRate > 4 ? 'error' : 'warning' as const,
      },
      {
        id: 'total-cancellations',
        title: 'Total de Bajas',
        value: stats.totalCancellations.toString(),
        subtitle: 'En el período',
        icon: <Users className="w-5 h-5" />,
        color: 'info' as const,
      },
      {
        id: 'avg-ltv',
        title: 'LTV Promedio',
        value: `€${stats.averageLtvOfChurned.toFixed(0)}`,
        subtitle: 'Clientes perdidos',
        icon: <BarChart3 className="w-5 h-5" />,
        color: 'primary' as const,
      },
    ];
  }, [stats]);

  const reasonsDistribution = useMemo(() => {
    if (!stats?.reasonsDistribution) return null;
    return stats.reasonsDistribution;
  }, [stats]);

  return (
    <div className="space-y-6">
      {/* Filtros de fecha */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4">
              <div className="flex items-center gap-2 flex-1">
                <Calendar className="w-4 h-4 text-slate-600" />
                <label className="block text-sm font-medium text-slate-700">
                  Desde:
                </label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="flex-1 rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
                />
              </div>
              <div className="flex items-center gap-2 flex-1">
                <Calendar className="w-4 h-4 text-slate-600" />
                <label className="block text-sm font-medium text-slate-700">
                  Hasta:
                </label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="flex-1 rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
                />
              </div>
              <Button
                variant="secondary"
                onClick={loadStats}
                disabled={loading}
              >
                <Filter size={20} className="mr-2" />
                Actualizar
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* KPIs */}
      {loading && !stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-8 text-center bg-white shadow-sm">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <p className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button
            variant="primary"
            onClick={loadStats}
          >
            Reintentar
          </Button>
        </Card>
      ) : (
        metrics.length > 0 && <MetricCards data={metrics} columns={4} />
      )}

      {/* Gráfico de distribución de motivos */}
      {stats && reasonsDistribution && reasonsDistribution.length > 0 && (
        <Card className="p-4 bg-white shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Distribución de Motivos de Baja
          </h3>
          <div className="space-y-3">
            {reasonsDistribution
              .sort((a, b) => b.count - a.count)
              .map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      {item.reason}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {item.count} ({((item.count / stats.totalCancellations) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${(item.count / stats.totalCancellations) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </Card>
      )}

      {/* Top planes con mayor churn (solo para gimnasios) */}
      {userType === 'gym' && stats?.topPlansByChurn && stats.topPlansByChurn.length > 0 && (
        <Card className="p-4 bg-white shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Planes con Mayor Tasa de Abandono
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                    Plan
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">
                    Bajas
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">
                    Tasa de Churn
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.topPlansByChurn.map((plan, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {plan.plan}
                    </td>
                    <td className="text-right py-3 px-4 text-sm text-gray-900">
                      {plan.cancellations}
                    </td>
                    <td className={`text-right py-3 px-4 text-sm font-semibold ${
                      plan.churnRate > 10 ? 'text-red-600' : plan.churnRate > 5 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {plan.churnRate.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Tabla de clientes */}
      <ChurnedClientsTable userType={userType} />
    </div>
  );
};

