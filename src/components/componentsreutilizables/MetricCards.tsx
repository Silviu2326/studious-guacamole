import React from 'react';
import { ds } from '../../features/adherencia/ui/ds';
import { BarChart3, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

export interface MetricCardData {
  id: string;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  icon?: React.ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  loading?: boolean;
}

export interface MetricCardsProps {
  data: MetricCardData[];
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  data,
  columns = 4,
  className = '',
}) => {
  const getColorClasses = (color: MetricCardData['color']) => {
    switch (color) {
      case 'success':
        return {
          bg: 'bg-[#D1FAE5] dark:bg-[#064E3B]',
          icon: 'bg-[#10B981] dark:bg-[#34D399]',
          text: 'text-[#10B981] dark:text-[#34D399]',
        };
      case 'warning':
        return {
          bg: 'bg-[#FEF3C7] dark:bg-[#78350F]',
          icon: 'bg-[#F59E0B] dark:bg-[#FBBF24]',
          text: 'text-[#F59E0B] dark:text-[#FBBF24]',
        };
      case 'error':
        return {
          bg: 'bg-[#FEE2E2] dark:bg-[#7F1D1D]',
          icon: 'bg-[#EF4444] dark:bg-[#F87171]',
          text: 'text-[#EF4444] dark:text-[#F87171]',
        };
      case 'info':
        return {
          bg: 'bg-[#DBEAFE] dark:bg-[#1E3A8A]',
          icon: 'bg-[#3B82F6] dark:bg-[#60A5FA]',
          text: 'text-[#3B82F6] dark:text-[#60A5FA]',
        };
      case 'primary':
      default:
        return {
          bg: 'bg-[#EEF2FF] dark:bg-[#312E81]',
          icon: 'bg-[#6366F1] dark:bg-[#818CF8]',
          text: 'text-[#6366F1] dark:text-[#818CF8]',
        };
    }
  };

  const getTrendIcon = (direction: 'up' | 'down' | 'neutral') => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />;
      case 'down':
        return <TrendingDown className="w-4 h-4" />;
      case 'neutral':
      default:
        return <ArrowRight className="w-4 h-4" />;
    }
  };

  const getTrendColor = (direction: 'up' | 'down' | 'neutral') => {
    switch (direction) {
      case 'up':
        return 'text-[#10B981] dark:text-[#34D399]';
      case 'down':
        return 'text-[#EF4444] dark:text-[#F87171]';
      case 'neutral':
      default:
        return 'text-[#64748B] dark:text-[#94A3B8]';
    }
  };

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
  };

  if (data.length === 0) {
    return (
      <div className={`${ds.card} ${ds.cardPad} ${className}`}>
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-[#64748B] to-[#94A3B8] rounded-full flex items-center justify-center mx-auto mb-6">
            <BarChart3 className="w-10 h-10 text-white" />
          </div>
          <p className={`${ds.typography.bodyLarge} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            No hay métricas disponibles
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-6 ${className}`}>
      {data.map((metric) => {
        const colors = getColorClasses(metric.color);
        
        if (metric.loading) {
          return (
            <div key={metric.id} className={`${ds.shimmer} rounded-2xl p-6 h-32`} />
          );
        }

        return (
          <div
            key={metric.id}
            className={`${colors.bg} rounded-2xl p-6 ${ds.animation.normal} hover:scale-105`}
          >
            <div className="flex items-center">
              {metric.icon && (
                <div className={`w-12 h-12 ${colors.icon} rounded-xl flex items-center justify-center mr-4 flex-shrink-0`}>
                  <div className="text-white text-xl">
                    {metric.icon}
                  </div>
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${colors.text} mb-1`}>
                  {metric.title}
                </p>
                
                <p className="text-2xl font-semibold text-gray-900 dark:text-[#F1F5F9] mb-1">
                  {metric.value}
                </p>
                
                {metric.subtitle && (
                  <p className="text-xs text-gray-500 dark:text-[#64748B]">
                    {metric.subtitle}
                  </p>
                )}
                
                {metric.trend && (
                  <div className="flex items-center space-x-1 mt-2">
                    <div className={`${getTrendColor(metric.trend.direction)}`}>
                      {getTrendIcon(metric.trend.direction)}
                    </div>
                    <span className={`${ds.typography.caption} ${getTrendColor(metric.trend.direction)}`}>
                      {Math.abs(metric.trend.value)}%
                    </span>
                    {metric.trend.label && (
                      <span className="text-xs text-gray-500 dark:text-[#64748B]">
                        {metric.trend.label}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
