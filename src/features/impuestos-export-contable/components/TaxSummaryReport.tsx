import React, { useState } from 'react';
import { MetricCards, MetricCardData, Tooltip, Card } from '../../../components/componentsreutilizables';
import { TaxSummary } from '../api/types';
import { DollarSign, TrendingUp, Receipt, FileText, TrendingDown, Calculator, Info, BarChart3, Calendar } from 'lucide-react';
import { DateRangePicker } from './DateRangePicker';
import { incomeExpenseChartApi } from '../api';
import { IncomeExpenseChartData } from '../api/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface TaxSummaryReportProps {
  summaryData: TaxSummary;
  isLoading?: boolean;
  dateRange?: {
    from: Date;
    to: Date;
  };
  onDateRangeChange?: (range: { from: Date; to: Date }) => void;
}

// Componente helper para términos con tooltip y lenguaje claro
interface TermWithTooltipProps {
  simpleTerm: string;
  technicalTerm?: string;
  tooltip: string;
}

const TermWithTooltip: React.FC<TermWithTooltipProps> = ({
  simpleTerm,
  technicalTerm,
  tooltip
}) => {
  return (
    <span className="flex items-center gap-1.5">
      <span>{simpleTerm}</span>
      {technicalTerm && (
        <span className="text-xs text-gray-500 font-normal">({technicalTerm})</span>
      )}
      <Tooltip content={tooltip} position="top">
        <Info size={12} className="text-gray-400 hover:text-gray-600 cursor-help" />
      </Tooltip>
    </span>
  );
};

export const TaxSummaryReport: React.FC<TaxSummaryReportProps> = ({
  summaryData,
  isLoading = false,
  dateRange: externalDateRange,
  onDateRangeChange
}) => {
  const [internalDateRange, setInternalDateRange] = useState<{ from: Date; to: Date }>(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    return { from: firstDay, to: today };
  });
  const [chartData, setChartData] = useState<IncomeExpenseChartData | null>(null);
  const [loadingChart, setLoadingChart] = useState(false);

  const dateRange = externalDateRange || internalDateRange;
  const handleDateRangeChange = onDateRangeChange || setInternalDateRange;

  React.useEffect(() => {
    loadChartData();
  }, [dateRange.from, dateRange.to]);

  const loadChartData = async () => {
    setLoadingChart(true);
    try {
      const data = await incomeExpenseChartApi.getChartData(
        dateRange.from.toISOString().split('T')[0],
        dateRange.to.toISOString().split('T')[0]
      );
      setChartData(data);
    } catch (error) {
      console.error('Error loading chart data:', error);
    } finally {
      setLoadingChart(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: summaryData.currency
    }).format(amount);
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

  // Preparar datos para gráficos
  const monthlyChartData = chartData?.monthlyData.map(item => ({
    mes: item.month.split(' ')[0],
    ingresos: item.income,
    gastos: item.expenses,
    balance: item.balance
  })) || [];

  const pieData = [
    { name: 'Ingresos', value: summaryData.totalGross },
    { name: 'Gastos', value: summaryData.totalExpenses },
    { name: 'IVA', value: summaryData.totalVat }
  ];

  const COLORS = ['#3B82F6', '#EF4444', '#8B5CF6'];

  const metrics: MetricCardData[] = [
    {
      id: 'totalGross',
      title: (
        <TermWithTooltip
          simpleTerm="Total de Ingresos"
          technicalTerm="Ingresos Brutos"
          tooltip="Total de dinero que has recibido por tus servicios antes de descontar gastos e impuestos. Es la suma de todas tus ventas o facturas."
        />
      ),
      value: formatCurrency(summaryData.totalGross),
      subtitle: 'Antes de gastos e impuestos',
      icon: <DollarSign />,
      color: 'primary',
      loading: isLoading
    },
    {
      id: 'totalExpenses',
      title: (
        <TermWithTooltip
          simpleTerm="Total de Gastos"
          technicalTerm="Gastos Deducibles"
          tooltip="Gastos relacionados con tu actividad profesional que puedes descontar de tus ingresos para reducir el pago de impuestos. Ejemplos: material, desplazamientos, formación, etc."
        />
      ),
      value: formatCurrency(summaryData.totalExpenses),
      subtitle: 'Gastos que puedes descontar',
      icon: <TrendingDown />,
      color: 'warning',
      loading: isLoading
    },
    {
      id: 'netProfit',
      title: (
        <TermWithTooltip
          simpleTerm="Ganancia Neta"
          technicalTerm="Beneficio Neto"
          tooltip="Lo que realmente has ganado: ingresos menos gastos. Esta es la cantidad sobre la que se calcularán los impuestos."
        />
      ),
      value: formatCurrency(summaryData.netProfit),
      subtitle: summaryData.netProfit >= 0 ? 'Ingresos menos gastos' : 'Pérdida',
      icon: <Calculator />,
      color: summaryData.netProfit >= 0 ? 'success' : 'error',
      loading: isLoading
    },
    {
      id: 'totalNet',
      title: (
        <TermWithTooltip
          simpleTerm="Base para Calcular Impuestos"
          technicalTerm="Base Imponible"
          tooltip="Cantidad sobre la que se calculan los impuestos (IRPF). Normalmente son tus ingresos menos tus gastos. En algunos regímenes fiscales se aplican coeficientes reductores."
        />
      ),
      value: formatCurrency(summaryData.totalNet),
      subtitle: 'Después de descontar IVA',
      icon: <TrendingUp />,
      color: 'info',
      loading: isLoading
    },
    {
      id: 'totalVat',
      title: (
        <TermWithTooltip
          simpleTerm="IVA que Cobraste"
          technicalTerm="IVA Repercutido"
          tooltip="IVA que has incluido en tus facturas y que has cobrado a tus clientes. Este dinero debes ingresarlo a Hacienda, pero puedes descontar el IVA que has pagado en tus gastos."
        />
      ),
      value: formatCurrency(summaryData.totalVat),
      subtitle: 'IVA cobrado a clientes',
      icon: <Receipt />,
      color: 'info',
      loading: isLoading
    },
    {
      id: 'transactions',
      title: (
        <TermWithTooltip
          simpleTerm="Número de Transacciones"
          tooltip="Cantidad total de operaciones (ventas, pagos, etc.) realizadas en el periodo seleccionado."
        />
      ),
      value: summaryData.transactionCount.toLocaleString('es-ES'),
      subtitle: 'Total en el periodo',
      icon: <FileText />,
      color: 'warning',
      loading: isLoading
    }
  ];

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Header con selector de periodo */}
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Resumen Fiscal del Periodo
            </h3>
            <p className="text-sm text-gray-600">
              Resumen completo de ingresos, gastos e impuestos. Selecciona el periodo a analizar.
            </p>
          </div>
        </div>
      </div>

      {/* Selector de periodo */}
      <Card className="p-4 print:hidden">
        <div className="flex items-center gap-3 mb-3">
          <Calendar className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Periodo de Análisis</span>
        </div>
        <DateRangePicker
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          predefinedRanges={predefinedRanges}
        />
      </Card>

      {/* Métricas principales */}
      <div>
        <p className="text-sm text-gray-600 mb-4 print:hidden">
          Pasa el cursor sobre los términos para ver más información.
        </p>
        <MetricCards data={metrics} columns={3} />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4">
        {/* Gráfico de barras: Ingresos vs Gastos mensual */}
        <Card className="p-6 print:break-inside-avoid print:p-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 print:text-base">
            Evolución Mensual: Ingresos vs Gastos
          </h4>
          {loadingChart ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Cargando datos...</div>
            </div>
          ) : monthlyChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="mes"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <RechartsTooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb' }}
                />
                <Legend />
                <Bar dataKey="ingresos" fill="#3B82F6" name="Ingresos" />
                <Bar dataKey="gastos" fill="#EF4444" name="Gastos" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
              <div className="text-center text-gray-500">
                <BarChart3 size={48} className="mx-auto mb-4 opacity-50" />
                <p>No hay datos disponibles para el período seleccionado</p>
              </div>
            </div>
          )}
        </Card>

        {/* Gráfico de pastel: Distribución */}
        <Card className="p-6 print:break-inside-avoid print:p-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 print:text-base">
            Distribución Fiscal
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Tabla de resumen detallado */}
      <Card className="p-6 print:break-inside-avoid print:p-4">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 print:text-base">
          Desglose Detallado del Periodo
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm print:text-xs">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Concepto</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Importe</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Porcentaje</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-900">Ingresos Brutos</td>
                <td className="py-3 px-4 text-right text-gray-900">
                  {formatCurrency(summaryData.totalGross)}
                </td>
                <td className="py-3 px-4 text-right text-gray-600">100%</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-900">Gastos Deducibles</td>
                <td className="py-3 px-4 text-right text-gray-900">
                  {formatCurrency(summaryData.totalExpenses)}
                </td>
                <td className="py-3 px-4 text-right text-gray-600">
                  {((summaryData.totalExpenses / summaryData.totalGross) * 100).toFixed(1)}%
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-900">Base Imponible</td>
                <td className="py-3 px-4 text-right text-gray-900">
                  {formatCurrency(summaryData.totalNet)}
                </td>
                <td className="py-3 px-4 text-right text-gray-600">
                  {((summaryData.totalNet / summaryData.totalGross) * 100).toFixed(1)}%
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-900">IVA Repercutido</td>
                <td className="py-3 px-4 text-right text-gray-900">
                  {formatCurrency(summaryData.totalVat)}
                </td>
                <td className="py-3 px-4 text-right text-gray-600">
                  {((summaryData.totalVat / summaryData.totalGross) * 100).toFixed(1)}%
                </td>
              </tr>
              <tr className="bg-gray-50 font-semibold">
                <td className="py-3 px-4 text-gray-900">Beneficio Neto</td>
                <td className={`py-3 px-4 text-right ${summaryData.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(summaryData.netProfit)}
                </td>
                <td className={`py-3 px-4 text-right ${summaryData.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {((summaryData.netProfit / summaryData.totalGross) * 100).toFixed(1)}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

