import React from 'react';
import { OfferStats } from '../api/offers';
import { TrendingUp, DollarSign, Users, Award, Package } from 'lucide-react';
import { MetricCards, MetricCardData } from '../../../components/componentsreutilizables';
import { Card } from '../../../components/componentsreutilizables';

interface OfferStatsDashboardProps {
  stats: OfferStats | null;
  isLoading: boolean;
}

export const OfferStatsDashboard: React.FC<OfferStatsDashboardProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    const loadingMetrics: MetricCardData[] = [
      { id: '1', title: 'Cargando...', value: '', color: 'info', loading: true },
      { id: '2', title: 'Cargando...', value: '', color: 'info', loading: true },
      { id: '3', title: 'Cargando...', value: '', color: 'info', loading: true }
    ];
    return <MetricCards data={loadingMetrics} columns={3} />;
  }

  if (!stats) return null;

  const metricCards: MetricCardData[] = [
    {
      id: 'redemption',
      title: 'Tasa de Redención',
      value: `${stats.redemptionRate.toFixed(1)}%`,
      color: 'success',
      icon: <TrendingUp size={20} />
    },
    {
      id: 'revenue',
      title: 'Ingresos Totales',
      value: `€${stats.totalRevenue.toLocaleString()}`,
      color: 'info',
      icon: <DollarSign size={20} />
    },
    {
      id: 'clients',
      title: 'Nuevos Clientes',
      value: stats.newClientsAcquired.toString(),
      color: 'info',
      icon: <Users size={20} />
    }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <MetricCards data={metricCards} columns={3} />

      {/* Top Offers */}
      <Card className="p-6 bg-white shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Award className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">Top 5 Ofertas Más Utilizadas</h3>
        </div>
        {stats.topOffers.length === 0 ? (
          <div className="text-center py-8">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No hay ofertas aún</p>
          </div>
        ) : (
          <div className="space-y-4">
            {stats.topOffers.map((offer, idx) => (
              <div key={offer.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-700 rounded-full font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{offer.name}</div>
                    <div className="text-sm text-gray-600">
                      {offer.usageCount} usos · €{offer.revenue.toLocaleString()} en ingresos
                    </div>
                  </div>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {offer.type}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-white shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Valor Promedio de Compra</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Con Descuento</span>
              <span className="text-xl font-bold text-blue-600">
                €{stats.avgOrderValueWithDiscount.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Sin Descuento</span>
              <span className="text-xl font-bold text-gray-900">
                €{stats.avgOrderValueWithoutDiscount.toFixed(2)}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Resumen</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Ofertas Activas</span>
              <span className="text-lg font-bold text-gray-900">{stats.totalActiveOffers}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

