import React from 'react';
import { BarChart3 } from 'lucide-react';

interface StatisticalSignificanceIndicatorProps {
  confidenceLevel: number; // 0-1
}

export const StatisticalSignificanceIndicator: React.FC<StatisticalSignificanceIndicatorProps> = ({
  confidenceLevel
}) => {
  const percentage = (confidenceLevel * 100).toFixed(1);
  const getColor = () => {
    if (confidenceLevel >= 0.95) return 'text-green-600 bg-green-100';
    if (confidenceLevel >= 0.80) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getLabel = () => {
    if (confidenceLevel >= 0.95) return 'Muy Confiable';
    if (confidenceLevel >= 0.80) return 'Moderadamente Confiable';
    return 'Poco Confiable';
  };

  const colors = getColor();
  const colorClasses = colors.split(' ');

  return (
    <div className="flex items-center gap-3">
      <BarChart3 size={16} className={colorClasses[0]} />
      <div className="flex flex-col min-w-0">
        <span className={`text-xs font-medium ${colorClasses[0]}`}>
          {getLabel()}
        </span>
        <span className="text-xs text-gray-600">
          {percentage}% confianza
        </span>
      </div>
      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colorClasses[1]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};


