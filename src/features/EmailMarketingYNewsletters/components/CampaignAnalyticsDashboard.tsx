import React from 'react';
import { CampaignAnalytics } from '../api/campaigns';
import { Mail, MousePointerClick, XCircle, UserMinus, TrendingUp, DollarSign } from 'lucide-react';
import { MetricCards, MetricCardData } from '../../../components/componentsreutilizables';
import { Card } from '../../../components/componentsreutilizables';

interface CampaignAnalyticsDashboardProps {
  analytics: CampaignAnalytics;
}

/**
 * Dashboard de analíticas para una campaña de email
 */
export const CampaignAnalyticsDashboard: React.FC<CampaignAnalyticsDashboardProps> = ({
  analytics
}) => {
  const metrics: MetricCardData[] = [
    {
      id: 'sent',
      title: 'Emails Enviados',
      value: analytics.totalSent.toLocaleString(),
      icon: <Mail size={20} />,
      color: 'info'
    },
    {
      id: 'opens',
      title: 'Tasa de Apertura',
      value: `${(analytics.opens.rate * 100).toFixed(1)}%`,
      subtitle: `${analytics.opens.total} aperturas`,
      icon: <TrendingUp size={20} />,
      color: 'success'
    },
    {
      id: 'clicks',
      title: 'Tasa de Clics (CTR)',
      value: `${(analytics.clicks.rate * 100).toFixed(1)}%`,
      subtitle: `${analytics.clicks.total} clics`,
      icon: <MousePointerClick size={20} />,
      color: 'info'
    },
    {
      id: 'bounces',
      title: 'Tasa de Rebote',
      value: `${(analytics.bounces.rate * 100).toFixed(2)}%`,
      subtitle: `${analytics.bounces.total} rebotes`,
      icon: <XCircle size={20} />,
      color: 'error'
    }
  ];

  return (
    <div className="space-y-6">
      {/* KPIs principales */}
      <MetricCards data={metrics} columns={4} />

      {/* Conversiones si están disponibles */}
      {analytics.conversions && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
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
        </Card>
      )}

      {/* Bajas */}
      <Card className="bg-white shadow-sm">
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
      </Card>
    </div>
  );
};


