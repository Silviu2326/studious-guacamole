import React, { useState, useMemo } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { BarChart3 } from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export type MetricType = 'sessions' | 'occupancy';

export interface WeeklyDataPoint {
  /** Día de la semana (ej: 'Lun', 'Mar', etc.) o fecha abreviada */
  day: string;
  /** Número de sesiones para ese día */
  sessions: number;
  /** Porcentaje de ocupación para ese día (0-100) */
  occupancy: number;
}

interface MetricsChartProps {
  /** Título del gráfico */
  title?: string;
  /** Datos semanales (7 puntos, uno por día) */
  weeklyData: WeeklyDataPoint[];
  /** Tipo de métrica a mostrar por defecto */
  defaultMetric?: MetricType;
  /** Estado de carga */
  loading?: boolean;
  /** Tipo de gráfico a mostrar */
  chartType?: 'bar' | 'line';
}

export const MetricsChart: React.FC<MetricsChartProps> = ({
  title,
  weeklyData = [],
  defaultMetric = 'sessions',
  loading = false,
  chartType = 'bar',
}) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>(defaultMetric);

  // Preparar datos para el gráfico
  const chartData = useMemo(() => {
    return weeklyData.map((point) => ({
      day: point.day,
      sessions: point.sessions,
      occupancy: point.occupancy,
      // Formatear para mostrar en tooltip
      sessionsLabel: `${point.sessions} sesiones`,
      occupancyLabel: `${point.occupancy}%`,
    }));
  }, [weeklyData]);

  // Configuración del gráfico según la métrica seleccionada
  const metricConfig = useMemo(() => {
    if (selectedMetric === 'sessions') {
      return {
        dataKey: 'sessions',
        label: 'Sesiones',
        color: '#3B82F6',
        yAxisLabel: 'Número de sesiones',
        formatter: (value: number) => `${value} sesiones`,
      };
    } else {
      return {
        dataKey: 'occupancy',
        label: 'Ocupación',
        color: '#10B981',
        yAxisLabel: 'Porcentaje (%)',
        formatter: (value: number) => `${value}%`,
      };
    }
  }, [selectedMetric]);

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-semibold text-gray-900 mb-1">{data.day}</p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">{metricConfig.label}:</span>{' '}
            <span className="text-gray-900 font-semibold">
              {selectedMetric === 'sessions' ? data.sessions : `${data.occupancy}%`}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card className="p-6 bg-white shadow-sm">
        <div className="h-80 bg-gray-200 rounded-lg animate-pulse" />
      </Card>
    );
  }

  if (!weeklyData || weeklyData.length === 0) {
    return (
      <Card className="p-6 bg-white shadow-sm">
        <div className="text-center py-12">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">No hay datos disponibles</p>
        </div>
      </Card>
    );
  }

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
    };

    if (chartType === 'line') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis
              dataKey="day"
              tick={{ fill: '#64748B', fontSize: 12 }}
              stroke="#9CA3AF"
            />
            <YAxis
              tick={{ fill: '#64748B', fontSize: 12 }}
              stroke="#9CA3AF"
              label={{
                value: metricConfig.yAxisLabel,
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: '#64748B', fontSize: 12 },
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey={metricConfig.dataKey}
              stroke={metricConfig.color}
              strokeWidth={3}
              dot={{ fill: metricConfig.color, r: 5 }}
              activeDot={{ r: 7 }}
              name={metricConfig.label}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    } else {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis
              dataKey="day"
              tick={{ fill: '#64748B', fontSize: 12 }}
              stroke="#9CA3AF"
            />
            <YAxis
              tick={{ fill: '#64748B', fontSize: 12 }}
              stroke="#9CA3AF"
              label={{
                value: metricConfig.yAxisLabel,
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: '#64748B', fontSize: 12 },
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey={metricConfig.dataKey}
              fill={metricConfig.color}
              name={metricConfig.label}
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      );
    }
  };

  return (
    <Card className="p-6 bg-white shadow-sm">
      {/* Header con título y selector */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <h3 className="text-xl font-bold text-gray-900">
          {title || 'Tendencias Semanales'}
        </h3>
        
        {/* Selector de métrica */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setSelectedMetric('sessions')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              selectedMetric === 'sessions'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Sesiones
          </button>
          <button
            onClick={() => setSelectedMetric('occupancy')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              selectedMetric === 'occupancy'
                ? 'bg-white text-green-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Ocupación
          </button>
        </div>
      </div>

      {/* Gráfico */}
      {renderChart()}
    </Card>
  );
};
