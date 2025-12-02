import React from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { ChannelData } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { BarChart3 } from 'lucide-react';

interface AcquisitionChannelChartProps {
  data: ChannelData[];
  chartType: 'bar' | 'pie' | 'line';
  title?: string;
  metric?: 'leads' | 'conversions' | 'cpa' | 'revenue';
}

const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'];

export const AcquisitionChannelChart: React.FC<AcquisitionChannelChartProps> = ({
  data,
  chartType,
  title,
  metric = 'leads',
}) => {
  if (!data || data.length === 0) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay datos disponibles</h3>
        <p className="text-gray-600">No se encontraron datos para el período seleccionado</p>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    name: item.channel.split(' / ')[0] || item.channel,
    fullChannel: item.channel,
    leads: item.leads,
    conversions: item.conversions,
    cpa: item.cpa,
    revenue: item.revenue || 0,
    conversionRate: item.conversionRate ? (item.conversionRate * 100).toFixed(1) : 0,
  }));

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
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
              />
              <Legend />
              <Bar dataKey={metric} fill="#6366F1" name={getMetricLabel(metric)} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey={metric}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
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
              />
              <Legend />
              <Line
                type="monotone"
                dataKey={metric}
                stroke="#6366F1"
                strokeWidth={2}
                name={getMetricLabel(metric)}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="bg-white shadow-sm">
      {title && (
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            {title}
          </h3>
        </div>
      )}
      {renderChart()}
    </Card>
  );
};

function getMetricLabel(metric: string): string {
  const labels: Record<string, string> = {
    leads: 'Leads',
    conversions: 'Conversiones',
    cpa: 'CPA (€)',
    revenue: 'Ingresos (€)',
  };
  return labels[metric] || metric;
}

