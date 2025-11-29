import React, { useState, useEffect } from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { incomeBySourceApi } from '../api';
import { IncomeBySourceSummary, IncomeBySource } from '../api/types';
import { DateRangePicker } from './DateRangePicker';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from 'recharts';
import { TrendingUp, PieChart as PieChartIcon, BarChart3, Download } from 'lucide-react';

interface IncomeBySourceChartProps {
  userId?: string;
}

// Colores para cada tipo de fuente de ingresos
const COLORS = {
  'sesiones-presenciales': '#3B82F6',
  'sesiones-online': '#6366F1',
  'planes-nutricionales': '#8B5CF6',
  'consultas': '#EC4899',
  'membresias': '#F59E0B',
  'productos': '#10B981',
  'otros': '#64748B'
};

const CHART_COLORS = [
  '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#64748B'
];

export const IncomeBySourceChart: React.FC<IncomeBySourceChartProps> = ({ userId }) => {
  const [summary, setSummary] = useState<IncomeBySourceSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    return { from: firstDay, to: today };
  });

  useEffect(() => {
    loadData();
  }, [dateRange.from, dateRange.to]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await incomeBySourceApi.getIncomeBySource(
        dateRange.from.toISOString().split('T')[0],
        dateRange.to.toISOString().split('T')[0]
      );
      setSummary(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los datos de ingresos por fuente');
      console.error('Error loading income by source:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: summary?.currency || 'EUR',
      minimumFractionDigits: 2
    }).format(valor);
  };

  const predefinedRanges = [
    {
      label: 'Mes Actual',
      getDates: () => {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        return { from: firstDay, to: today };
      }
    },
    {
      label: 'Mes Anterior',
      getDates: () => {
        const today = new Date();
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        return { from: lastMonth, to: lastDayOfLastMonth };
      }
    },
    {
      label: 'Últimos 3 Meses',
      getDates: () => {
        const today = new Date();
        const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, 1);
        return { from: threeMonthsAgo, to: today };
      }
    },
    {
      label: 'Últimos 6 Meses',
      getDates: () => {
        const today = new Date();
        const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 6, 1);
        return { from: sixMonthsAgo, to: today };
      }
    },
    {
      label: 'Año Actual',
      getDates: () => {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), 0, 1);
        return { from: firstDay, to: today };
      }
    }
  ];

  // Preparar datos para gráfico de pie
  const pieData = summary?.sources.map((source, index) => ({
    name: source.sourceName,
    value: source.totalIncome,
    percentage: source.percentage,
    color: CHART_COLORS[index % CHART_COLORS.length]
  })) || [];

  // Preparar datos para gráfico de barras
  const barData = summary?.sources.map(source => ({
    name: source.sourceName,
    'Ingresos': source.totalIncome,
    'Transacciones': source.transactionCount,
    'Promedio': source.averageAmount
  })) || [];

  // Tooltip personalizado para pie chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-blue-600 font-medium">{formatearMoneda(data.value)}</p>
          <p className="text-sm text-gray-600">{data.payload.percentage.toFixed(1)}% del total</p>
        </div>
      );
    }
    return null;
  };

  // Tooltip personalizado para bar chart
  const BarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{payload[0].payload.name}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name === 'Ingresos' && `${entry.name}: ${formatearMoneda(entry.value)}`}
              {entry.name === 'Transacciones' && `${entry.name}: ${entry.value}`}
              {entry.name === 'Promedio' && `Promedio: ${formatearMoneda(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleExport = () => {
    if (!summary) return;
    
    // Crear CSV
    const headers = ['Fuente de Ingreso', 'Total Ingresos', 'Porcentaje', 'Nº Transacciones', 'Promedio'];
    const rows = summary.sources.map(source => [
      source.sourceName,
      source.totalIncome.toFixed(2),
      `${source.percentage.toFixed(2)}%`,
      source.transactionCount.toString(),
      source.averageAmount.toFixed(2)
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `ingresos_por_fuente_${dateRange.from.toISOString().split('T')[0]}_${dateRange.to.toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 print:space-y-4">
      <Card className="p-0 bg-white shadow-sm print:shadow-none print:border print:border-gray-300">
        <div className="space-y-6 p-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
                <TrendingUp size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Ingresos por Tipo de Servicio
                </h3>
                <p className="text-sm text-gray-600">
                  Visualiza de dónde provienen tus ingresos para entender qué servicios generan más dinero
                </p>
              </div>
            </div>
            {summary && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleExport}
              >
                <Download size={16} className="mr-2" />
                Exportar
              </Button>
            )}
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              predefinedRanges={predefinedRanges}
            />
            
            <div className="flex items-end gap-2">
              <Button
                variant={chartType === 'pie' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setChartType('pie')}
              >
                <PieChartIcon size={16} className="mr-2" />
                Circular
              </Button>
              <Button
                variant={chartType === 'bar' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setChartType('bar')}
              >
                <BarChart3 size={16} className="mr-2" />
                Barras
              </Button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
              <TrendingUp size={20} className="text-red-600" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Resumen Total */}
          {summary && !loading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">Ingresos Totales</div>
                <div className="text-2xl font-bold text-blue-900">
                  {formatearMoneda(summary.totalIncome)}
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  {summary.sources.length} fuentes de ingreso
                </div>
              </div>
              
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-sm text-green-600 font-medium">Total Transacciones</div>
                <div className="text-2xl font-bold text-green-900">
                  {summary.sources.reduce((sum, source) => sum + source.transactionCount, 0)}
                </div>
                <div className="text-xs text-green-600 mt-1">
                  En el período seleccionado
                </div>
              </div>
              
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="text-sm text-purple-600 font-medium">Fuente Principal</div>
                <div className="text-xl font-bold text-purple-900">
                  {summary.sources[0]?.sourceName || 'N/A'}
                </div>
                <div className="text-xs text-purple-600 mt-1">
                  {summary.sources[0]?.percentage.toFixed(1) || '0'}% del total
                </div>
              </div>
            </div>
          )}

          {/* Gráfico */}
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-gray-500">Cargando datos...</div>
            </div>
          ) : summary && summary.sources.length > 0 ? (
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Distribución de Ingresos por Tipo de Servicio
              </h4>
              <ResponsiveContainer width="100%" height={400}>
                {chartType === 'pie' ? (
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      formatter={(value) => value}
                    />
                  </PieChart>
                ) : (
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis 
                      yAxisId="left"
                      tickFormatter={(value) => {
                        if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
                        return value.toString();
                      }}
                    />
                    <Tooltip content={<BarTooltip />} />
                    <Legend />
                    <Bar 
                      yAxisId="left"
                      dataKey="Ingresos" 
                      fill="#3B82F6" 
                      name="Ingresos (€)"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
              <div className="text-center text-gray-500">
                <TrendingUp size={48} className="mx-auto mb-4 opacity-50" />
                <p>No hay datos de ingresos disponibles para el período seleccionado</p>
              </div>
            </div>
          )}

          {/* Tabla de Detalles */}
          {summary && summary.sources.length > 0 && (
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Desglose Detallado por Fuente
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Fuente de Ingreso</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Total</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Porcentaje</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Transacciones</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Promedio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.sources.map((source, index) => (
                      <tr 
                        key={source.sourceType} 
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                            />
                            <span className="font-medium text-gray-900">{source.sourceName}</span>
                          </div>
                        </td>
                        <td className="text-right py-3 px-4 font-semibold text-gray-900">
                          {formatearMoneda(source.totalIncome)}
                        </td>
                        <td className="text-right py-3 px-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {source.percentage.toFixed(1)}%
                          </span>
                        </td>
                        <td className="text-right py-3 px-4 text-gray-600">
                          {source.transactionCount}
                        </td>
                        <td className="text-right py-3 px-4 text-gray-600">
                          {formatearMoneda(source.averageAmount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50 font-semibold">
                      <td className="py-3 px-4 text-gray-900">Total</td>
                      <td className="text-right py-3 px-4 text-gray-900">
                        {formatearMoneda(summary.totalIncome)}
                      </td>
                      <td className="text-right py-3 px-4 text-gray-900">100%</td>
                      <td className="text-right py-3 px-4 text-gray-900">
                        {summary.sources.reduce((sum, source) => sum + source.transactionCount, 0)}
                      </td>
                      <td className="text-right py-3 px-4 text-gray-900">
                        {formatearMoneda(
                          summary.totalIncome / summary.sources.reduce((sum, source) => sum + source.transactionCount, 0)
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};


