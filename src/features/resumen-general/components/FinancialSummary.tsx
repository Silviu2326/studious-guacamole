import React from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { TrendingUp, TrendingDown, AlertCircle, RefreshCw } from 'lucide-react';
import { FinancialSummary as FinancialSummaryType } from '../api';
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

interface FinancialSummaryProps {
  data: FinancialSummaryType | null;
  role: 'entrenador' | 'gimnasio';
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
}

// Formatea moneda en euros
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

// Formatea porcentaje
const formatPercentage = (value: number): string => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
};

// Componente para badge de variación
const VariationBadge: React.FC<{ value: number }> = ({ value }) => {
  const isPositive = value >= 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;
  const colorClass = isPositive
    ? 'bg-green-100 text-green-700 border-green-200'
    : 'bg-red-100 text-red-700 border-red-200';

  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold border ${colorClass}`}
    >
      <Icon className="w-3 h-3" />
      <span>{formatPercentage(value)}</span>
    </div>
  );
};

export const FinancialSummary: React.FC<FinancialSummaryProps> = ({
  data,
  role,
  loading = false,
  error,
  onRetry,
}) => {
  if (error) {
    return (
      <Card className="p-5 bg-white shadow-sm">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="p-3 bg-red-100 rounded-full mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            Error al cargar el resumen financiero
          </h3>
          <p className="text-sm text-gray-600 text-center mb-4 max-w-xs">
            {error}
          </p>
          {onRetry && (
            <Button 
              variant="primary" 
              size="sm"
              onClick={onRetry}
              className="bg-red-600 hover:bg-red-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </Button>
          )}
        </div>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="p-5 bg-white shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  // Calcular variación de gastos si tenemos datos históricos
  const expensesVariation = (() => {
    if (!data.lastMonths || data.lastMonths.length < 2) return null;
    const previousExpenses = data.lastMonths[data.lastMonths.length - 2].expenses;
    if (previousExpenses === 0) return null;
    const variation = ((data.expensesMonth - previousExpenses) / previousExpenses) * 100;
    return isFinite(variation) ? variation : null;
  })();

  // Preparar datos para el gráfico (si existe lastMonths)
  const chartData = data.lastMonths?.map((month) => ({
    mes: month.monthLabel,
    ingresos: month.revenue,
    gastos: month.expenses,
    beneficio: month.revenue - month.expenses,
  }));

  return (
    <Card className="p-5 bg-white shadow-sm">
      {/* Header */}
      <div className="mb-5">
        <h3 className="text-xl font-bold text-gray-900 mb-1">
          Resumen Financiero
        </h3>
        <p className="text-sm text-gray-500">
          {role === 'entrenador' ? 'Estado de tu negocio' : 'Estado financiero del centro'}
        </p>
      </div>

      <div className="space-y-4">
        {/* Ingresos del Mes */}
        <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 ring-1 ring-blue-200">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                Ingresos del Mes
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(data.revenueMonth)}
              </p>
            </div>
            {data.revenueVariation !== undefined && (
              <VariationBadge value={data.revenueVariation} />
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            vs mes anterior
          </p>
        </div>

        {/* Gastos y Beneficio en grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Gastos */}
          <div className="p-4 rounded-lg bg-gray-50 ring-1 ring-gray-200">
            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
              Gastos
            </p>
            <p className="text-xl font-bold text-gray-900 mb-2">
              {formatCurrency(data.expensesMonth)}
            </p>
            {expensesVariation !== null && (
              <VariationBadge value={expensesVariation} />
            )}
          </div>

          {/* Beneficio */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 ring-1 ring-green-200">
            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
              Beneficio
            </p>
            <p className="text-xl font-bold text-green-700 mb-2">
              {formatCurrency(data.profitMonth)}
            </p>
            {data.profitVariation !== undefined && (
              <VariationBadge value={data.profitVariation} />
            )}
          </div>
        </div>

        {/* Gráfico de últimos meses (si existe) */}
        {chartData && chartData.length > 0 && (
          <div className="mt-5 pt-5 border-t border-gray-200">
            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-3">
              Evolución (últimos {chartData.length} meses)
            </p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="mes"
                  tick={{ fill: '#6B7280', fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  tick={{ fill: '#6B7280', fontSize: 11 }}
                  tickFormatter={(value) => {
                    if (value >= 1000) {
                      return `€${(value / 1000).toFixed(1)}k`;
                    }
                    return `€${value}`;
                  }}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                />
                <Bar
                  dataKey="ingresos"
                  fill="#3B82F6"
                  name="Ingresos"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="gastos"
                  fill="#EF4444"
                  name="Gastos"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="beneficio"
                  fill="#10B981"
                  name="Beneficio"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </Card>
  );
};
