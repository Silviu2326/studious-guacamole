import React from 'react';
import { LocationSummary } from '../types';
import { Card } from '../../../components/componentsreutilizables';
import { BarChart3, TrendingUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface KPIComparisonChartProps {
  data: LocationSummary[];
  kpiKey: keyof LocationSummary;
  chartTitle: string;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
};

const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(1)}%`;
};

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('es-ES', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
};

export const KPIComparisonChart: React.FC<KPIComparisonChartProps> = ({
  data,
  kpiKey,
  chartTitle,
}) => {
  // Preparar datos para el gráfico
  const chartData = data.map((location) => ({
    name: location.locationName.length > 15 
      ? `${location.locationName.substring(0, 15)}...`
      : location.locationName,
    fullName: location.locationName,
    value: location[kpiKey] as number,
  }));

  // Determinar formato según el tipo de KPI
  const isCurrency = kpiKey === 'totalRevenue' || kpiKey === 'arpu';
  const isPercentage = kpiKey === 'churnRate' || kpiKey === 'facilityOccupancyRate';

  const formatTooltipValue = (value: number) => {
    if (isCurrency) return formatCurrency(value);
    if (isPercentage) return formatPercentage(value);
    return formatNumber(value);
  };

  const formatYAxis = (value: number) => {
    if (isCurrency) return formatCurrency(value);
    if (isPercentage) return formatPercentage(value);
    return formatNumber(value);
  };

  const getUnit = () => {
    if (isCurrency) return '€';
    if (isPercentage) return '%';
    return '';
  };

  return (
    <Card className="bg-white shadow-sm">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            {chartTitle}
          </h3>
        </div>
        <p className="text-sm text-gray-600">
          Comparativa visual de {chartTitle.toLowerCase()} entre todas las sedes
        </p>
      </div>

      {chartData.length === 0 ? (
        <div className="py-12 text-center">
          <TrendingUp size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">
            No hay datos disponibles para mostrar
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tickFormatter={formatYAxis}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value: number) => [formatTooltipValue(value), kpiKey]}
              labelFormatter={(label, payload) => {
                const item = payload?.[0];
                return item ? (item.payload as any).fullName : label;
              }}
            />
            <Legend />
            <Bar
              dataKey="value"
              fill="#2563EB"
              radius={[8, 8, 0, 0]}
              name={chartTitle}
            />
          </BarChart>
        </ResponsiveContainer>
      )}

      {chartData.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-600">
              Total de sedes mostradas: {chartData.length}
            </p>
            {getUnit() && (
              <p className="text-xs text-slate-600">
                Unidad: {getUnit()}
              </p>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

