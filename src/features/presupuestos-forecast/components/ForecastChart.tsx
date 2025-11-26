import React from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { ChartData } from '../types';
import { LineChart as LucideLineChart } from 'lucide-react';

interface ForecastChartProps {
  chartData: ChartData;
  type: 'income' | 'expense' | 'profit';
  title?: string;
}

export const ForecastChart: React.FC<ForecastChartProps> = ({
  chartData,
  type,
  title
}) => {
  const getTypeColor = () => {
    switch (type) {
      case 'income':
        return 'from-green-500 to-emerald-600';
      case 'expense':
        return 'from-red-500 to-rose-600';
      case 'profit':
        return 'from-blue-500 to-indigo-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'income':
        return 'Ingresos';
      case 'expense':
        return 'Gastos';
      case 'profit':
        return 'Beneficio Neto';
      default:
        return '';
    }
  };

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-4 space-y-4">
        {title && (
          <h3 className="text-lg font-semibold text-gray-900">
            {title}
          </h3>
        )}

        {/* Chart visualization placeholder */}
        <div className="relative h-64 bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className={`w-16 h-16 bg-gradient-to-br ${getTypeColor()} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <LucideLineChart className="w-8 h-8 text-white" />
              </div>
              <p className="text-gray-600">
                Gráfico de {getTypeLabel()}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Chart.js se integrará aquí con datos reales
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-4">
            {chartData.datasets.map((dataset, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: dataset.backgroundColor }}
                />
                <span className="text-xs text-gray-600">
                  {dataset.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Data summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          {chartData.datasets.map((dataset, index) => {
            const total = dataset.data.reduce((sum, val) => sum + val, 0);
            const avg = total / dataset.data.length || 0;

            return (
              <div key={index} className="text-center">
                <p className="text-xs text-gray-500 mb-1">
                  {dataset.label}
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  €{Math.round(total).toLocaleString('es-ES')}
                </p>
                <p className="text-sm text-gray-600">
                  Promedio: €{Math.round(avg).toLocaleString('es-ES')}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

