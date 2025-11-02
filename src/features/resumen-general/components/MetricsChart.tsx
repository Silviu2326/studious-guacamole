import React from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricsChartProps {
  title: string;
  data: { label: string; value: number; trend?: number }[];
  loading?: boolean;
}

export const MetricsChart: React.FC<MetricsChartProps> = ({
  title,
  data,
  loading = false,
}) => {
  if (loading) {
    return (
      <Card className="p-4 bg-white shadow-sm">
        <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
      </Card>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <Card className="p-4 bg-white shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {title}
        </h3>
      </div>

      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">
                {item.label}
              </span>
              <div className="flex items-center gap-2">
                {item.trend !== undefined && (
                  <div className={`flex items-center gap-1 ${item.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.trend >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="text-xs font-medium">
                      {Math.abs(item.trend)}%
                    </span>
                  </div>
                )}
                <span className="text-sm font-semibold text-gray-900">
                  {item.value}
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {data.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">
            No hay datos disponibles
          </p>
        </div>
      )}
    </Card>
  );
};
