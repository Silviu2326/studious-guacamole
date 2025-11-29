import React, { useState, useEffect } from 'react';
import { Card, Button, Select, SelectOption } from '../../../components/componentsreutilizables';
import { incomeExpenseChartApi } from '../api';
import { IncomeExpenseChartData, MonthlyIncomeExpense } from '../api/types';
import { CategoriaGasto, CATEGORIAS_GASTO } from '../types/expenses';
import { DateRangePicker } from './DateRangePicker';
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
  Cell
} from 'recharts';
import { TrendingUp, TrendingDown, Filter, BarChart3, LineChart as LineChartIcon } from 'lucide-react';

interface IncomeExpensesChartProps {
  userId?: string;
}

export const IncomeExpensesChart: React.FC<IncomeExpensesChartProps> = ({ userId }) => {
  const [chartData, setChartData] = useState<IncomeExpenseChartData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [selectedCategory, setSelectedCategory] = useState<CategoriaGasto | 'all'>('all');
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>(() => {
    const today = new Date();
    const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 6, 1);
    return { from: sixMonthsAgo, to: today };
  });

  // Cargar datos cuando cambien los filtros
  useEffect(() => {
    loadChartData();
  }, [dateRange.from, dateRange.to, selectedCategory]);

  const loadChartData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await incomeExpenseChartApi.getChartData(
        dateRange.from.toISOString().split('T')[0],
        dateRange.to.toISOString().split('T')[0],
        selectedCategory === 'all' ? undefined : selectedCategory
      );
      setChartData(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los datos del gráfico');
      console.error('Error loading chart data:', err);
    } finally {
      setLoading(false);
    }
  };

  const predefinedRanges = [
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
    },
    {
      label: 'Último Año',
      getDates: () => {
        const today = new Date();
        const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), 1);
        return { from: oneYearAgo, to: today };
      }
    }
  ];

  // Preparar datos para el gráfico
  const chartDataFormatted = chartData?.monthlyData.map(item => ({
    mes: item.month.split(' ')[0], // Solo el nombre del mes
    'Ingresos': item.income,
    'Gastos': item.expenses,
    'Balance': item.balance,
    fullMonth: item.month
  })) || [];

  // Calcular estadísticas
  const stats = chartData?.monthlyData.reduce((acc, item) => {
    acc.totalIncome += item.income;
    acc.totalExpenses += item.expenses;
    acc.monthsWithLoss += item.balance < 0 ? 1 : 0;
    return acc;
  }, { totalIncome: 0, totalExpenses: 0, monthsWithLoss: 0 }) || { totalIncome: 0, totalExpenses: 0, monthsWithLoss: 0 };

  const netBalance = stats.totalIncome - stats.totalExpenses;
  const averageMonthlyIncome = chartData?.monthlyData.length 
    ? stats.totalIncome / chartData.monthlyData.length 
    : 0;
  const averageMonthlyExpenses = chartData?.monthlyData.length 
    ? stats.totalExpenses / chartData.monthlyData.length 
    : 0;

  // Colores para las barras (rojo si gastos > ingresos)
  const getBarColor = (entry: any) => {
    return entry.Balance < 0 ? '#ef4444' : '#10b981';
  };

  // Opciones de categorías
  const categoryOptions: SelectOption[] = [
    { value: 'all', label: 'Todas las categorías' },
    ...Object.values(CATEGORIAS_GASTO).map(cat => ({
      value: cat.id,
      label: cat.nombre
    }))
  ];

  return (
    <div className="space-y-6 print:space-y-4">
      <Card className="p-0 bg-white shadow-sm print:shadow-none print:border print:border-gray-300">
        <div className="space-y-6 p-4">
          {/* Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
            <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
              <BarChart3 size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Gráficos de Ingresos vs Gastos
              </h3>
              <p className="text-sm text-gray-600">
                Visualiza la evolución mensual de tus ingresos y gastos para identificar tendencias
              </p>
            </div>
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <DateRangePicker
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                predefinedRanges={predefinedRanges}
              />
            </div>
            
            <Select
              label="Categoría"
              options={categoryOptions}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as CategoriaGasto | 'all')}
            />
          </div>

          {/* Selector de tipo de gráfico */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Tipo de gráfico:</span>
            <Button
              variant={chartType === 'bar' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setChartType('bar')}
            >
              <BarChart3 size={16} className="mr-2" />
              Barras
            </Button>
            <Button
              variant={chartType === 'line' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setChartType('line')}
            >
              <LineChartIcon size={16} className="mr-2" />
              Líneas
            </Button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
              <TrendingDown size={20} className="text-red-600" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Estadísticas Resumen */}
          {chartData && !loading && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-sm text-green-600 font-medium">Ingresos Totales</div>
                <div className="text-2xl font-bold text-green-900">
                  {stats.totalIncome.toFixed(2)} €
                </div>
                <div className="text-xs text-green-600 mt-1">
                  Promedio: {averageMonthlyIncome.toFixed(2)} €/mes
                </div>
              </div>
              
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-sm text-red-600 font-medium">Gastos Totales</div>
                <div className="text-2xl font-bold text-red-900">
                  {stats.totalExpenses.toFixed(2)} €
                </div>
                <div className="text-xs text-red-600 mt-1">
                  Promedio: {averageMonthlyExpenses.toFixed(2)} €/mes
                </div>
              </div>
              
              <div className={`p-4 border rounded-lg ${
                netBalance >= 0 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className={`text-sm font-medium ${
                  netBalance >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  Balance Neto
                </div>
                <div className={`text-2xl font-bold ${
                  netBalance >= 0 ? 'text-green-900' : 'text-red-900'
                }`}>
                  {netBalance >= 0 ? '+' : ''}{netBalance.toFixed(2)} €
                </div>
                <div className={`text-xs mt-1 ${
                  netBalance >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {netBalance >= 0 ? 'Beneficio' : 'Pérdida'}
                </div>
              </div>
              
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="text-sm text-yellow-600 font-medium">Meses con Pérdida</div>
                <div className="text-2xl font-bold text-yellow-900">
                  {stats.monthsWithLoss}
                </div>
                <div className="text-xs text-yellow-600 mt-1">
                  de {chartData.monthlyData.length} meses
                </div>
              </div>
            </div>
          )}

          {/* Gráfico */}
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-gray-500">Cargando datos...</div>
            </div>
          ) : chartDataFormatted.length > 0 ? (
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Evolución Mensual: Ingresos vs Gastos
              </h4>
              <ResponsiveContainer width="100%" height={400}>
                {chartType === 'bar' ? (
                  <BarChart data={chartDataFormatted}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="mes" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => `${value.toFixed(2)} €`}
                      labelFormatter={(label) => `Mes: ${label}`}
                    />
                    <Legend />
                    <Bar dataKey="Ingresos" fill="#10b981" name="Ingresos" />
                    <Bar dataKey="Gastos" fill="#ef4444" name="Gastos" />
                  </BarChart>
                ) : (
                  <LineChart data={chartDataFormatted}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="mes" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => `${value.toFixed(2)} €`}
                      labelFormatter={(label) => `Mes: ${label}`}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="Ingresos" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      name="Ingresos"
                      dot={{ fill: '#10b981', r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Gastos" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      name="Gastos"
                      dot={{ fill: '#ef4444', r: 4 }}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
              <div className="text-center text-gray-500">
                <BarChart3 size={48} className="mx-auto mb-4 opacity-50" />
                <p>No hay datos disponibles para el período seleccionado</p>
              </div>
            </div>
          )}

          {/* Gráfico de Balance */}
          {chartDataFormatted.length > 0 && (
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Balance Mensual (Ingresos - Gastos)
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartDataFormatted}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="mes" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(2)} €`}
                    labelFormatter={(label) => `Mes: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="Balance" name="Balance">
                    {chartDataFormatted.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getBarColor(entry)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 text-sm text-gray-600">
                <span className="inline-flex items-center gap-2 mr-4">
                  <span className="w-4 h-4 bg-green-500 rounded"></span>
                  Meses con beneficio
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 bg-red-500 rounded"></span>
                  Meses con pérdida
                </span>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};


