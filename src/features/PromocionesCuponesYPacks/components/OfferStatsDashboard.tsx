import React from 'react';
import { OfferStats } from '../api/offers';
import { TrendingUp, DollarSign, Users, BarChart3, Award } from 'lucide-react';

interface OfferStatsDashboardProps {
  stats: OfferStats | null;
  isLoading: boolean;
}

export const OfferStatsDashboard: React.FC<OfferStatsDashboardProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    {
      icon: TrendingUp,
      label: 'Tasa de Redención',
      value: `${stats.redemptionRate.toFixed(1)}%`,
      color: 'green'
    },
    {
      icon: DollarSign,
      label: 'Ingresos Totales',
      value: `€${stats.totalRevenue.toLocaleString()}`,
      color: 'purple'
    },
    {
      icon: Users,
      label: 'Nuevos Clientes',
      value: stats.newClientsAcquired.toString(),
      color: 'blue'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          const bgColors = {
            green: 'bg-green-100 text-green-600',
            purple: 'bg-purple-100 text-purple-600',
            blue: 'bg-blue-100 text-blue-600'
          };
          return (
            <div key={idx} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${bgColors[card.color as keyof typeof bgColors]}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{card.label}</h3>
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Top Offers */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Award className="w-5 h-5 text-purple-600" />
          <h3 className="text-xl font-bold text-gray-900">Top 5 Ofertas Más Utilizadas</h3>
        </div>
        {stats.topOffers.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No hay ofertas aún</p>
        ) : (
          <div className="space-y-4">
            {stats.topOffers.map((offer, idx) => (
              <div key={offer.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-purple-100 text-purple-700 rounded-full font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{offer.name}</div>
                    <div className="text-sm text-gray-600">
                      {offer.usageCount} usos · €{offer.revenue.toLocaleString()} en ingresos
                    </div>
                  </div>
                </div>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  {offer.type}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Valor Promedio de Compra</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Con Descuento</span>
              <span className="text-xl font-bold text-purple-600">
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
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Resumen</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Ofertas Activas</span>
              <span className="text-lg font-bold text-gray-900">{stats.totalActiveOffers}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

