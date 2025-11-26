import React from 'react';
import { ReferralStats } from '../api/referrals';
import { Users, DollarSign, Award, Target, Clock, Loader2 } from 'lucide-react';
import { MetricCards, Card } from '../../../components/componentsreutilizables';

interface ReferralStatsDashboardProps {
  stats: ReferralStats;
  isLoading?: boolean;
}

export const ReferralStatsDashboard: React.FC<ReferralStatsDashboardProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </Card>
    );
  }

  const mainMetrics = [
    {
      id: 'revenue',
      title: 'Ingresos por Referidos',
      value: `$${stats.totalRevenueFromReferrals.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`,
      color: 'info' as const,
      icon: <DollarSign size={24} />,
    },
    {
      id: 'conversions',
      title: 'Conversiones Totales',
      value: stats.totalConversions.toString(),
      color: 'success' as const,
      icon: <Users size={24} />,
    },
    {
      id: 'conversion-rate',
      title: 'Tasa de Conversión',
      value: `${(stats.conversionRate * 100).toFixed(1)}%`,
      color: 'info' as const,
      icon: <Target size={24} />,
    },
    {
      id: 'avg-cycle',
      title: 'Ciclo Promedio',
      value: `${stats.kpis.avgConversionCycle.toFixed(1)} días`,
      color: 'warning' as const,
      icon: <Clock size={24} />,
    },
  ];

  const additionalMetrics = [
    {
      id: 'participation-rate',
      title: 'Tasa de Participación',
      value: `${stats.kpis.participationRate.toFixed(1)}%`,
      subtitle: 'Clientes que comparten',
      color: 'info' as const,
    },
    {
      id: 'cac',
      title: 'CAC por Referido',
      value: `$${stats.kpis.cacPerReferral.toFixed(2)}`,
      subtitle: 'Costo de adquisición',
      color: 'info' as const,
    },
    {
      id: 'top-referrer',
      title: 'Top Embajador',
      value: stats.topReferrers[0]?.name || 'N/A',
      subtitle: `${stats.topReferrers[0]?.conversions || 0} conversiones`,
      color: 'info' as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards Principales */}
      <MetricCards data={mainMetrics} columns={4} />

      {/* KPIs Adicionales */}
      <MetricCards data={additionalMetrics} columns={3} />

      {/* Top Referrers Leaderboard */}
      <Card className="bg-white shadow-sm">
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Ranking de Embajadores</h2>
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {stats.topReferrers.map((referrer, index) => (
              <div
                key={referrer.clientId}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{referrer.name}</p>
                    <p className="text-sm text-gray-600">
                      {referrer.referrals} referidos · {referrer.conversions} conversiones
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">{referrer.conversions}</p>
                  <p className="text-xs text-gray-600">conversiones</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

