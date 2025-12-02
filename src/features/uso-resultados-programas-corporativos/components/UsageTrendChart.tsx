import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../../../components/componentsreutilizables';
import { TimeSeriesData } from '../types';
import { TrendingUp, BarChart3, Loader2 } from 'lucide-react';

// Extender Date prototype para getWeek (si no existe)
if (!Date.prototype.getWeek) {
  Date.prototype.getWeek = function() {
    const date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    const week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  };
}

interface UsageTrendChartProps {
  data: TimeSeriesData[];
  timeUnit: 'day' | 'week' | 'month';
  chartType?: 'line' | 'bar';
  title?: string;
  isLoading?: boolean;
}

export const UsageTrendChart: React.FC<UsageTrendChartProps> = ({
  data,
  timeUnit,
  chartType = 'line',
  title = 'Tendencia de Uso',
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <Card className="bg-white shadow-sm">
        <div className="p-8 text-center">
          <Loader2 className="w-12 h-12 mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="bg-white shadow-sm">
        <div className="p-8 text-center">
          <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin datos disponibles</h3>
          <p className="text-gray-600">No hay datos para mostrar en el período seleccionado</p>
        </div>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    switch (timeUnit) {
      case 'day':
        return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
      case 'week':
        return `Sem ${date.getWeek()}`;
      case 'month':
        return date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
      default:
        return dateString;
    }
  };

  const chartData = data.map(item => ({
    ...item,
    formattedDate: formatDate(item.date),
  }));

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              {title}
            </h3>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          {chartType === 'line' ? (
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis
                dataKey="formattedDate"
                tick={{ fill: '#64748B', fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                tick={{ fill: '#64748B', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '12px',
                }}
                formatter={(value: number) => [`${value} visitas`, 'Check-ins']}
                labelFormatter={(label) => `Fecha: ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="checkIns"
                stroke="#2563EB"
                strokeWidth={3}
                name="Check-ins"
                dot={{ fill: '#2563EB', r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis
                dataKey="formattedDate"
                tick={{ fill: '#64748B', fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                tick={{ fill: '#64748B', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '12px',
                }}
                formatter={(value: number) => [`${value} visitas`, 'Check-ins']}
                labelFormatter={(label) => `Fecha: ${label}`}
              />
              <Legend />
              <Bar
                dataKey="checkIns"
                fill="#2563EB"
                name="Check-ins"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

