import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ReferralStatsCardProps {
  title: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  tooltipText?: string;
}

export const ReferralStatsCard: React.FC<ReferralStatsCardProps> = ({ title, value, trend }) => {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-600" />;
    return null;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {getTrendIcon()}
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
};













