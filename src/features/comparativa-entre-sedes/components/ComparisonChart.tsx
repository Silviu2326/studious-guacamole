import React from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { ComparisonData, KPI_DEFINITIONS, KPI } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { BarChart3, TrendingUp } from 'lucide-react';

interface ComparisonChartProps {
  data: ComparisonData[];
  kpiLabel: string;
  kpiId: KPI;
  chartType?: 'bar' | 'line';
}

const COLORS = ['#3B82F6', '#6366F1', '#2563EB', '#1E40AF', '#10B981', '#F59E0B', '#EF4444'];

export const ComparisonChart: React.FC<ComparisonChartProps> = ({
  data,
  kpiLabel,
  kpiId,
  chartType = 'bar',
}) => {
  if (!data || data.length === 0) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin Datos</h3>
        <p className="text-gray-600 mb-4">
          No hay datos disponibles para mostrar
        </p>
      </Card>
    );
  }

  const kpiDefinition = KPI_DEFINITIONS.find((k) => k.id === kpiId);
  const format = kpiDefinition?.format || 'number';

  const formatValue = (value: number): string => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('es-ES', {
          style: 'currency',
          currency: 'EUR',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(value);
      case 'percentage':
        return `${(value * 100).toFixed(2)}%`;
      default:
        return new Intl.NumberFormat('es-ES').format(value);
    }
  };

  const chartData = data.map((item) => ({
    name: item.locationName,
    locationId: item.locationId,
    value: item.value,
    formattedValue: formatValue(item.value),
  }));

  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <Card className="p-4 bg-white shadow-sm">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp size={20} className="text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            {kpiLabel}
          </h3>
        </div>
        {kpiDefinition && (
          <p className="text-sm text-gray-600 mt-1">
            {kpiDefinition.description}
          </p>
        )}
      </div>

      {chartType === 'bar' ? (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fill: '#64748B', fontSize: 12 }}
            />
            <YAxis tick={{ fill: '#64748B', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '8px',
              }}
              formatter={(value: number) => formatValue(value)}
            />
            <Bar dataKey="value" fill="#3B82F6" name={kpiLabel} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fill: '#64748B', fontSize: 12 }}
            />
            <YAxis tick={{ fill: '#64748B', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '8px',
              }}
              formatter={(value: number) => formatValue(value)}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
              strokeWidth={3}
              name={kpiLabel}
              dot={{ fill: '#3B82F6', r: 5 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      {/* Tabla de datos detallada */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-sm font-medium text-slate-700 text-left py-3 px-4">
                Sede
              </th>
              <th className="text-sm font-medium text-slate-700 text-right py-3 px-4">
                Valor
              </th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((item, index) => (
              <tr key={item.locationId} className="border-b border-gray-100 hover:bg-gray-50 transition">
                <td className="text-sm text-gray-900 py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    {item.name}
                  </div>
                </td>
                <td className="text-sm text-gray-900 font-semibold text-right py-3 px-4">
                  {item.formattedValue}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

