import React from 'react';
import { TrendingUp, DollarSign, Users, MousePointerClick, Target, BarChart3 } from 'lucide-react';

interface PerformanceMetricsGridProps {
  metrics: {
    cpl: number;
    roas: number;
    ctr: string;
    spend: number;
    conversions: number;
    clicks?: number;
  };
  isLoading?: boolean;
}

export const PerformanceMetricsGrid: React.FC<PerformanceMetricsGridProps> = ({
  metrics,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  const metricCards = [
    {
      label: 'Gasto Total',
      value: `€${metrics.spend.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      label: 'Coste por Lead (CPL)',
      value: `€${metrics.cpl.toFixed(2)}`,
      icon: Target,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      label: 'Retorno (ROAS)',
      value: `${metrics.roas.toFixed(1)}:1`,
      icon: TrendingUp,
      color: 'bg-green-100 text-green-600'
    },
    {
      label: 'Conversiones',
      value: metrics.conversions.toString(),
      icon: Users,
      color: 'bg-orange-100 text-orange-600'
    },
    {
      label: 'Tasa de Clics (CTR)',
      value: metrics.ctr,
      icon: MousePointerClick,
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      label: 'Total Clics',
      value: (metrics.clicks || 0).toString(),
      icon: BarChart3,
      color: 'bg-pink-100 text-pink-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {metricCards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2 rounded-lg ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">{card.label}</h3>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          </div>
        );
      })}
    </div>
  );
};
















