import React from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { PriceComparisonData } from '../api/marketSummary';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface PriceComparisonChartProps {
  data: PriceComparisonData[];
}

/**
 * Componente presentacional que muestra un gráfico de barras comparando precios
 */
export const PriceComparisonChart: React.FC<PriceComparisonChartProps> = ({ data }) => {
  const getBarColor = (type: PriceComparisonData['type']) => {
    switch (type) {
      case 'user':
        return '#2563eb'; // blue-600
      case 'market':
        return '#3b82f6'; // blue-500
      case 'competitor':
        return '#10b981'; // green
      default:
        return '#6b7280'; // gray
    }
  };

  const chartData = data.map(item => ({
    name: item.name,
    precio: item.price,
    tipo: item.type,
    color: getBarColor(item.type)
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{payload[0].payload.name}</p>
          <p className="text-blue-600 font-medium">
            €{payload[0].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Comparativa de Precios
        </h3>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              label={{ value: 'Precio (€)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#6b7280' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Bar 
              dataKey="precio" 
              name="Precio por Sesión"
              radius={[8, 8, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Leyenda personalizada */}
        <div className="mt-4 flex flex-wrap gap-4 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-600"></div>
            <span className="text-gray-600">Mi Precio</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-500"></div>
            <span className="text-gray-600">Promedio Mercado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500"></div>
            <span className="text-gray-600">Competidores</span>
          </div>
        </div>
      </div>
    </Card>
  );
};


