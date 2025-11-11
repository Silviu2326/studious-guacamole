import React, { useState, useEffect } from 'react';
import { Card, Button, MetricCards, MetricCardData } from '../../../components/componentsreutilizables';
import { annualSummaryApi } from '../api';
import { AnnualSummary } from '../api/types';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Receipt,
  Download,
  Calendar,
  BarChart3,
  FileText,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface AnnualSummaryProps {
  userId?: string;
}

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'];

export const AnnualSummaryComponent: React.FC<AnnualSummaryProps> = ({ userId }) => {
  const [summary, setSummary] = useState<AnnualSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadAnnualSummary();
  }, [currentYear]);

  const loadAnnualSummary = async () => {
    setLoading(true);
    try {
      const data = await annualSummaryApi.getAnnualSummary(currentYear);
      setSummary(data);
    } catch (error) {
      console.error('Error loading annual summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'csv' | 'excel') => {
    if (!summary) return;
    
    setExporting(true);
    try {
      const result = await annualSummaryApi.exportAnnualReport(currentYear, format);
      // Simular descarga (en producción, esto iniciaría la descarga real)
      const link = document.createElement('a');
      link.href = result.downloadUrl;
      link.download = `resumen-anual-${currentYear}.${format === 'excel' ? 'xlsx' : format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Error al exportar el informe. Por favor, inténtalo de nuevo.');
    } finally {
      setExporting(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: summary?.currency || 'EUR'
    }).format(amount);
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center gap-3 text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Cargando resumen anual...</span>
        </div>
      </Card>
    );
  }

  if (!summary) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">
          No hay datos disponibles para el año {currentYear}
        </div>
      </Card>
    );
  }

  // Preparar datos para gráficos
  const quarterlyChartData = summary.quarterlyBreakdown.map(q => ({
    trimestre: `T${q.quarter} ${q.year}`,
    ingresos: q.totalGross,
    gastos: q.totalExpenses,
    beneficios: q.netProfit,
    iva: q.totalVat
  }));

  const incomeExpenseData = summary.quarterlyBreakdown.map(q => ({
    trimestre: `T${q.quarter}`,
    ingresos: q.totalGross,
    gastos: q.totalExpenses
  }));

  const profitData = summary.quarterlyBreakdown.map(q => ({
    trimestre: `T${q.quarter}`,
    beneficios: q.netProfit
  }));

  const pieData = [
    { name: 'Ingresos', value: summary.totalGross },
    { name: 'Gastos', value: summary.totalExpenses },
    { name: 'Impuestos', value: summary.totalTaxes }
  ];

  // Métricas principales
  const metrics: MetricCardData[] = [
    {
      id: 'totalGross',
      title: 'Ingresos Totales',
      value: formatCurrency(summary.totalGross),
      subtitle: `Promedio mensual: ${formatCurrency(summary.averageMonthlyIncome)}`,
      icon: <DollarSign />,
      color: 'primary',
      loading: false
    },
    {
      id: 'totalExpenses',
      title: 'Gastos Totales',
      value: formatCurrency(summary.totalExpenses),
      subtitle: `Promedio mensual: ${formatCurrency(summary.averageMonthlyExpenses)}`,
      icon: <TrendingDown />,
      color: 'warning',
      loading: false
    },
    {
      id: 'netProfit',
      title: 'Beneficio Neto',
      value: formatCurrency(summary.netProfit),
      subtitle: summary.netProfit >= 0 ? 'Ganancia' : 'Pérdida',
      icon: <TrendingUp />,
      color: summary.netProfit >= 0 ? 'success' : 'error',
      loading: false
    },
    {
      id: 'totalTaxes',
      title: 'Impuestos Totales',
      value: formatCurrency(summary.totalTaxes),
      subtitle: `IVA: ${formatCurrency(summary.totalVat)}`,
      icon: <Receipt />,
      color: 'info',
      loading: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <BarChart3 className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Resumen Anual</h2>
            <p className="text-sm text-gray-600">
              Visión completa de ingresos, gastos, beneficios e impuestos del año
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentYear(currentYear - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="px-4 py-2 font-semibold text-gray-900">{currentYear}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentYear(currentYear + 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Métricas principales */}
      <MetricCards data={metrics} columns={4} />

      {/* Botones de exportación */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Exportar Informe Anual</h3>
            <p className="text-sm text-gray-600">
              Descarga el resumen completo en PDF, CSV o Excel para tu gestoría
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handleExport('pdf')}
              disabled={exporting}
            >
              {exporting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <FileText className="w-4 h-4 mr-2" />
              )}
              PDF
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExport('csv')}
              disabled={exporting}
            >
              {exporting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              CSV
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExport('excel')}
              disabled={exporting}
            >
              {exporting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Excel
            </Button>
          </div>
        </div>
      </Card>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de barras: Ingresos vs Gastos por trimestre */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Ingresos vs Gastos por Trimestre
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={incomeExpenseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="trimestre" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb' }}
              />
              <Legend />
              <Bar dataKey="ingresos" fill="#3B82F6" name="Ingresos" />
              <Bar dataKey="gastos" fill="#EF4444" name="Gastos" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Gráfico de líneas: Beneficios por trimestre */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Evolución de Beneficios
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={profitData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="trimestre" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="beneficios"
                stroke="#10B981"
                strokeWidth={2}
                name="Beneficios Netos"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Gráfico de barras: Desglose completo por trimestre */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Desglose Completo por Trimestre
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={quarterlyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="trimestre" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb' }}
              />
              <Legend />
              <Bar dataKey="ingresos" fill="#3B82F6" name="Ingresos" />
              <Bar dataKey="gastos" fill="#EF4444" name="Gastos" />
              <Bar dataKey="beneficios" fill="#10B981" name="Beneficios" />
              <Bar dataKey="iva" fill="#8B5CF6" name="IVA" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Gráfico de pastel: Distribución de ingresos */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Distribución de Ingresos
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Tabla de resumen trimestral */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Desglose Trimestral Detallado
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Trimestre</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Ingresos</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Gastos</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">IVA</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Beneficios</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Transacciones</th>
              </tr>
            </thead>
            <tbody>
              {summary.quarterlyBreakdown.map((quarter) => (
                <tr
                  key={quarter.quarter}
                  className={`border-b border-gray-100 ${
                    quarter.quarter === summary.bestQuarter
                      ? 'bg-green-50'
                      : quarter.quarter === summary.worstQuarter
                      ? 'bg-red-50'
                      : ''
                  }`}
                >
                  <td className="py-3 px-4 font-medium text-gray-900">
                    T{quarter.quarter} {quarter.year}
                    {quarter.quarter === summary.bestQuarter && (
                      <span className="ml-2 text-xs text-green-600 font-semibold">Mejor</span>
                    )}
                    {quarter.quarter === summary.worstQuarter && (
                      <span className="ml-2 text-xs text-red-600 font-semibold">Peor</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-900">
                    {formatCurrency(quarter.totalGross)}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-900">
                    {formatCurrency(quarter.totalExpenses)}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-900">
                    {formatCurrency(quarter.totalVat)}
                  </td>
                  <td
                    className={`py-3 px-4 text-right font-semibold ${
                      quarter.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {formatCurrency(quarter.netProfit)}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-600">
                    {quarter.transactionCount}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-semibold">
                <td className="py-3 px-4 text-gray-900">TOTAL {currentYear}</td>
                <td className="py-3 px-4 text-right text-gray-900">
                  {formatCurrency(summary.totalGross)}
                </td>
                <td className="py-3 px-4 text-right text-gray-900">
                  {formatCurrency(summary.totalExpenses)}
                </td>
                <td className="py-3 px-4 text-right text-gray-900">
                  {formatCurrency(summary.totalVat)}
                </td>
                <td
                  className={`py-3 px-4 text-right ${
                    summary.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {formatCurrency(summary.netProfit)}
                </td>
                <td className="py-3 px-4 text-right text-gray-900">
                  {summary.transactionCount}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Resumen de insights */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Insights del Año</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-900">
          <div>
            <strong>Mejor trimestre:</strong> T{summary.bestQuarter} con{' '}
            {formatCurrency(
              summary.quarterlyBreakdown.find(q => q.quarter === summary.bestQuarter)?.netProfit || 0
            )}{' '}
            de beneficio neto
          </div>
          <div>
            <strong>Peor trimestre:</strong> T{summary.worstQuarter} con{' '}
            {formatCurrency(
              summary.quarterlyBreakdown.find(q => q.quarter === summary.worstQuarter)?.netProfit || 0
            )}{' '}
            de beneficio neto
          </div>
          <div>
            <strong>Promedio mensual de ingresos:</strong>{' '}
            {formatCurrency(summary.averageMonthlyIncome)}
          </div>
          <div>
            <strong>Promedio mensual de gastos:</strong>{' '}
            {formatCurrency(summary.averageMonthlyExpenses)}
          </div>
        </div>
      </Card>
    </div>
  );
};

