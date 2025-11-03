import React from 'react';
import { ReferralStats } from '../api/referrals';
import { TrendingUp, Users, DollarSign, Award, Target, Clock } from 'lucide-react';

interface ReferralStatsDashboardProps {
  stats: ReferralStats;
  isLoading?: boolean;
}

export const ReferralStatsDashboard: React.FC<ReferralStatsDashboardProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Ingresos por Referidos</h3>
          <p className="text-2xl font-bold text-gray-900">
            ${stats.totalRevenueFromReferrals.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Conversiones Totales</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.totalConversions}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Tasa de Conversión</h3>
          <p className="text-2xl font-bold text-gray-900">{(stats.conversionRate * 100).toFixed(1)}%</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Ciclo Promedio</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.kpis.avgConversionCycle.toFixed(1)} días</p>
        </div>
      </div>

      {/* Additional KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Tasa de Participación</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.kpis.participationRate.toFixed(1)}%</p>
          <p className="text-xs text-gray-500 mt-1">Clientes que comparten</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-1">CAC por Referido</h3>
          <p className="text-3xl font-bold text-blue-600">${stats.kpis.cacPerReferral.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">Costo de adquisición</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-1">Top Embajador</h3>
          <p className="text-lg font-bold text-gray-900">{stats.topReferrers[0]?.name || 'N/A'}</p>
          <p className="text-sm text-purple-600 mt-1">{stats.topReferrers[0]?.conversions || 0} conversiones</p>
        </div>
      </div>

      {/* Top Referrers Leaderboard */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Award className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900">Ranking de Embajadores</h2>
        </div>

        <div className="space-y-3">
          {stats.topReferrers.map((referrer, index) => (
            <div
              key={referrer.clientId}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 text-purple-700 font-bold">
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
                <p className="text-lg font-bold text-purple-600">{referrer.conversions}</p>
                <p className="text-xs text-gray-600">conversiones</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

