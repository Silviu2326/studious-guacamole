import React from 'react';
import { Badge } from '../../../components/componentsreutilizables';
import { CampaignPerformanceMetric } from '../types';
import { TrendingUp, TrendingDown, DollarSign, Users } from 'lucide-react';

interface HighlightedMetricProps {
  metric: CampaignPerformanceMetric;
}

export const HighlightedMetric: React.FC<HighlightedMetricProps> = ({ metric }) => {
  const isPositive = metric.percentageChange >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  const trendColor = isPositive ? 'text-green-600' : 'text-red-600';
  const trendBgColor = isPositive ? 'bg-green-50' : 'bg-red-50';
  const borderColor = isPositive ? 'border-green-200' : 'border-red-200';

  const formatValue = (value: number): string => {
    if (metric.type === 'roi') {
      return `${value.toFixed(1)}${metric.unit || 'x'}`;
    } else {
      return `${Math.round(value).toLocaleString('es-ES')} ${metric.unit || ''}`;
    }
  };

  const formatPercentage = (value: number): string => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  return (
    <div
      className={`p-4 rounded-xl border-2 ${borderColor} shadow-sm ${
        isPositive ? 'bg-gradient-to-br from-white to-green-50' : 'bg-gradient-to-br from-white to-red-50'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {metric.type === 'roi' ? (
              <DollarSign size={20} className="text-indigo-600" />
            ) : (
              <Users size={20} className="text-indigo-600" />
            )}
            <span className="text-sm font-medium text-slate-600">{metric.label}</span>
            <Badge variant="blue" size="sm">
              Último mes
            </Badge>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold text-slate-900">{formatValue(metric.value)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 ${trendColor}`}>
              <TrendIcon size={16} />
              <span className="text-sm font-semibold">{formatPercentage(metric.percentageChange)}</span>
            </div>
            <span className="text-xs text-slate-500">
              vs mes anterior ({formatValue(metric.previousMonthValue)})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HighlightedMetric;

