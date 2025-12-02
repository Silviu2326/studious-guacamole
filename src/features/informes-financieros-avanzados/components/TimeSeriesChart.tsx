import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../../../components/componentsreutilizables';
import { MRREvolutionData } from '../types';
import { TrendingUp, Loader2 } from 'lucide-react';

interface TimeSeriesChartProps {
  data: MRREvolutionData[];
  dataKey: string;
  title?: string;
  isLoading?: boolean;
  formatValue?: (value: number) => string;
}

export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  data,
  dataKey,
  title = 'Evolución Temporal',
  isLoading = false,
  formatValue = (value) => `€${value.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
}) => {
  if (isLoading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <TrendingUp size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin datos disponibles</h3>
        <p className="text-gray-600">No hay datos disponibles para mostrar en este período</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white shadow-sm">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            {title}
          </h3>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#64748B', fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            tick={{ fill: '#64748B', fontSize: 12 }}
            tickFormatter={(value) => formatValue(value)}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '8px',
            }}
            formatter={(value: number) => [formatValue(value), 'Valor']}
            labelFormatter={(label) => `Fecha: ${label}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="#2563EB"
            strokeWidth={3}
            name={title}
            dot={{ fill: '#2563EB', r: 5 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

