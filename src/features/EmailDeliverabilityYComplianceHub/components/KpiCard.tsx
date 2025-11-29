import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  tooltipText?: string;
  icon?: React.ReactNode;
  bgColor?: string;
  textColor?: string;
}

/**
 * Tarjeta reutilizable para mostrar una métrica clave (KPI) con su valor,
 * título, ícono y un indicador de tendencia.
 */
export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  trend,
  tooltipText,
  icon,
  bgColor = 'bg-blue-100',
  textColor = 'text-blue-600'
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${bgColor}`}>
          {icon || (
            <div className={`w-6 h-6 ${textColor}`} />
          )}
        </div>
      </div>
      
      {trend && (
        <div className="flex items-center gap-1 text-xs">
          {getTrendIcon()}
          <span className={
            trend === 'up' ? 'text-green-600' :
            trend === 'down' ? 'text-red-600' :
            'text-gray-500'
          }>
            {trend === 'up' ? 'Mejora' : trend === 'down' ? 'Baja' : 'Estable'}
          </span>
        </div>
      )}
      
      {tooltipText && (
        <div className="mt-2 text-xs text-slate-500">
          {tooltipText}
        </div>
      )}
    </div>
  );
};


