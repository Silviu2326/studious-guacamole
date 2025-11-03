import React from 'react';
import { CampaignAnalytics } from '../api/campaigns';
import { Mail, MousePointerClick, XCircle, UserMinus, TrendingUp, DollarSign } from 'lucide-react';

interface CampaignAnalyticsDashboardProps {
  analytics: CampaignAnalytics;
}

/**
 * Dashboard de analíticas para una campaña de email
 */
export const CampaignAnalyticsDashboard: React.FC<CampaignAnalyticsDashboardProps> = ({
  analytics
}) => {
  return (
    <div className="space-y-6">
      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Emails Enviados</span>
            <Mail className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{analytics.totalSent.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Tasa de Apertura</span>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{(analytics.opens.rate * 100).toFixed(1)}%</p>
          <p className="text-xs text-gray-500 mt-1">{analytics.opens.total} aperturas</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Tasa de Clics (CTR)</span>
            <MousePointerClick className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{(analytics.clicks.rate * 100).toFixed(1)}%</p>
          <p className="text-xs text-gray-500 mt-1">{analytics.clicks.total} clics</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Tasa de Rebote</span>
            <XCircle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{(analytics.bounces.rate * 100).toFixed(2)}%</p>
          <p className="text-xs text-gray-500 mt-1">{analytics.bounces.total} rebotes</p>
        </div>
      </div>

      {/* Conversiones si están disponibles */}
      {analytics.conversions && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Conversiones</h3>
              <p className="text-sm text-gray-600 mb-3">
                Acciones realizadas después de hacer clic en el email
              </p>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-sm text-gray-600">Total Conversiones</p>
                  <p className="text-2xl font-bold text-green-600">{analytics.conversions.total}</p>
                </div>
                {analytics.conversions.revenue && (
                  <div>
                    <p className="text-sm text-gray-600">Ingresos Generados</p>
                    <p className="text-2xl font-bold text-green-600">
                      {analytics.conversions.revenue.toLocaleString()}€
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 bg-green-100 rounded-lg">
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
      )}

      {/* Bajas */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Tasa de Bajas</p>
            <p className="text-xl font-bold text-gray-900">
              {(analytics.unsubscribes.rate * 100).toFixed(2)}%
            </p>
          </div>
          <div className="p-3 bg-gray-100 rounded-lg">
            <UserMinus className="w-6 h-6 text-gray-600" />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {analytics.unsubscribes.total} {analytics.unsubscribes.total === 1 ? 'baja' : 'bajas'}
        </p>
      </div>
    </div>
  );
};


