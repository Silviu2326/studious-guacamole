import React, { useState, useEffect } from 'react';
import { Card, Button, MetricCards, MetricCardData } from '../../../components/componentsreutilizables';
import { getResumenFiscalAnual } from '../api';
import { ResumenFiscalAnual } from '../api/types';
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
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight
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
  const [summary, setSummary] = useState<ResumenFiscalAnual | null>(null);
  const [previousYearSummary, setPreviousYearSummary] = useState<ResumenFiscalAnual | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadAnnualSummary();
  }, [currentYear]);

  const loadAnnualSummary = async () => {
    setLoading(true);
    try {
      const [currentData, previousData] = await Promise.all([
        getResumenFiscalAnual(currentYear),
        getResumenFiscalAnual(currentYear - 1).catch(() => null) // Si no hay datos del año anterior, continuar
      ]);
      setSummary(currentData);
      setPreviousYearSummary(previousData);
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
      // Simular descarga (en producción, esto iniciaría la descarga real)
      const link = document.createElement('a');
      link.href = `#`; // URL mock
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
      currency: 'EUR'
    }).format(amount);
  };

  // Calcular comparativa con año anterior
  const calculateComparison = (current: number, previous: number | null): { value: number; percentage: number; isPositive: boolean } => {
    if (!previous || previous === 0) {
      return { value: current, percentage: 0, isPositive: true };
    }
    const diff = current - previous;
    const percentage = (diff / previous) * 100;
    return { value: diff, percentage, isPositive: diff >= 0 };
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

  // Calcular comparativas
  const ingresosComp = calculateComparison(summary.ingresosTotales, previousYearSummary?.ingresosTotales || null);
  const gastosComp = calculateComparison(summary.gastosTotales, previousYearSummary?.gastosTotales || null);
  const beneficioComp = calculateComparison(summary.beneficio, previousYearSummary?.beneficio || null);
  const ivaComp = calculateComparison(summary.ivaRepercutido, previousYearSummary?.ivaRepercutido || null);
  const irpfComp = calculateComparison(summary.irpfEstimado, previousYearSummary?.irpfEstimado || null);

  // Preparar datos para gráficos de comparativa anual
  const comparisonData = [
    {
      concepto: 'Ingresos',
      actual: summary.ingresosTotales,
      anterior: previousYearSummary?.ingresosTotales || 0
    },
    {
      concepto: 'Gastos',
      actual: summary.gastosTotales,
      anterior: previousYearSummary?.gastosTotales || 0
    },
    {
      concepto: 'Beneficio',
      actual: summary.beneficio,
      anterior: previousYearSummary?.beneficio || 0
    },
    {
      concepto: 'IVA',
      actual: summary.ivaRepercutido,
      anterior: previousYearSummary?.ivaRepercutido || 0
    }
  ];

  const pieData = [
    { name: 'Ingresos', value: summary.ingresosTotales },
    { name: 'Gastos', value: summary.gastosTotales },
    { name: 'IVA', value: summary.ivaRepercutido },
    { name: 'IRPF', value: summary.irpfEstimado }
  ];

  // Función helper para mostrar comparativa
  const renderComparison = (comp: { value: number; percentage: number; isPositive: boolean }) => {
    if (!previousYearSummary) return null;
    const Icon = comp.isPositive ? ArrowUpRight : ArrowDownRight;
    const colorClass = comp.isPositive ? 'text-green-600' : 'text-red-600';
    return (
      <div className={`flex items-center gap-1 text-xs mt-1 ${colorClass}`}>
        <Icon className="w-3 h-3" />
        <span>
          {comp.isPositive ? '+' : ''}{formatCurrency(comp.value)} ({comp.isPositive ? '+' : ''}{comp.percentage.toFixed(1)}%)
        </span>
      </div>
    );
  };

  // Métricas principales con comparativa
  const metrics: MetricCardData[] = [
    {
      id: 'ingresosTotales',
      title: 'Ingresos Totales',
      value: formatCurrency(summary.ingresosTotales),
      subtitle: previousYearSummary 
        ? `vs ${currentYear - 1}: ${formatCurrency(previousYearSummary.ingresosTotales)}`
        : 'Año base',
      icon: <DollarSign />,
      color: 'primary',
      loading: false
    },
    {
      id: 'gastosTotales',
      title: 'Gastos Totales',
      value: formatCurrency(summary.gastosTotales),
      subtitle: previousYearSummary 
        ? `vs ${currentYear - 1}: ${formatCurrency(previousYearSummary.gastosTotales)}`
        : 'Año base',
      icon: <TrendingDown />,
      color: 'warning',
      loading: false
    },
    {
      id: 'beneficio',
      title: 'Beneficio Neto',
      value: formatCurrency(summary.beneficio),
      subtitle: summary.beneficio >= 0 ? 'Ganancia' : 'Pérdida',
      icon: <TrendingUp />,
      color: summary.beneficio >= 0 ? 'success' : 'error',
      loading: false
    },
    {
      id: 'impuestos',
      title: 'Impuestos Totales',
      value: formatCurrency(summary.ivaRepercutido + summary.irpfEstimado),
      subtitle: `IVA: ${formatCurrency(summary.ivaRepercutido)} | IRPF: ${formatCurrency(summary.irpfEstimado)}`,
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

      {/* Comparativa con año anterior */}
      {previousYearSummary && (
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Comparativa con {currentYear - 1}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <div className="text-sm text-gray-600">Ingresos</div>
              <div className="text-xl font-bold text-gray-900">{formatCurrency(summary.ingresosTotales)}</div>
              {renderComparison(ingresosComp)}
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-sm text-gray-600">Gastos</div>
              <div className="text-xl font-bold text-gray-900">{formatCurrency(summary.gastosTotales)}</div>
              {renderComparison(gastosComp)}
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-sm text-gray-600">Beneficio</div>
              <div className={`text-xl font-bold ${summary.beneficio >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(summary.beneficio)}
              </div>
              {renderComparison(beneficioComp)}
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-sm text-gray-600">Impuestos</div>
              <div className="text-xl font-bold text-gray-900">
                {formatCurrency(summary.ivaRepercutido + summary.irpfEstimado)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                IVA: {formatCurrency(summary.ivaRepercutido)} | IRPF: {formatCurrency(summary.irpfEstimado)}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de barras: Comparativa anual */}
        <Card className="p-6 print:break-inside-avoid">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Comparativa Anual: {currentYear} vs {currentYear - 1}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="concepto" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb' }}
              />
              <Legend />
              <Bar dataKey="actual" fill="#3B82F6" name={`${currentYear}`} />
              <Bar dataKey="anterior" fill="#94A3B8" name={`${currentYear - 1}`} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Gráfico de pastel: Distribución fiscal */}
        <Card className="p-6 print:break-inside-avoid">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Distribución Fiscal {currentYear}
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

        {/* Gráfico de barras: Ingresos vs Gastos */}
        <Card className="p-6 print:break-inside-avoid">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Ingresos vs Gastos {currentYear}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { concepto: 'Ingresos', valor: summary.ingresosTotales },
              { concepto: 'Gastos', valor: summary.gastosTotales },
              { concepto: 'Beneficio', valor: summary.beneficio }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="concepto" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb' }}
              />
              <Legend />
              <Bar dataKey="valor" fill="#10B981" name="Importe" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Gráfico de barras: Desglose de impuestos */}
        <Card className="p-6 print:break-inside-avoid">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Desglose de Impuestos {currentYear}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { tipo: 'IVA Repercutido', valor: summary.ivaRepercutido },
              { tipo: 'IVA Soportado', valor: summary.ivaSoportado },
              { tipo: 'IRPF Estimado', valor: summary.irpfEstimado }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tipo" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb' }}
              />
              <Legend />
              <Bar dataKey="valor" fill="#8B5CF6" name="Importe" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Tabla de resumen fiscal anual */}
      <Card className="p-6 print:break-inside-avoid">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Resumen Fiscal Anual {currentYear}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm print:text-xs">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Concepto</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">{currentYear}</th>
                {previousYearSummary && (
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">{currentYear - 1}</th>
                )}
                {previousYearSummary && (
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Variación</th>
                )}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-900">Ingresos Totales</td>
                <td className="py-3 px-4 text-right text-gray-900">
                  {formatCurrency(summary.ingresosTotales)}
                </td>
                {previousYearSummary && (
                  <td className="py-3 px-4 text-right text-gray-600">
                    {formatCurrency(previousYearSummary.ingresosTotales)}
                  </td>
                )}
                {previousYearSummary && (
                  <td className={`py-3 px-4 text-right font-semibold ${ingresosComp.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {ingresosComp.isPositive ? '+' : ''}{formatCurrency(ingresosComp.value)} ({ingresosComp.isPositive ? '+' : ''}{ingresosComp.percentage.toFixed(1)}%)
                  </td>
                )}
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-900">Gastos Totales</td>
                <td className="py-3 px-4 text-right text-gray-900">
                  {formatCurrency(summary.gastosTotales)}
                </td>
                {previousYearSummary && (
                  <td className="py-3 px-4 text-right text-gray-600">
                    {formatCurrency(previousYearSummary.gastosTotales)}
                  </td>
                )}
                {previousYearSummary && (
                  <td className={`py-3 px-4 text-right font-semibold ${gastosComp.isPositive ? 'text-red-600' : 'text-green-600'}`}>
                    {gastosComp.isPositive ? '+' : ''}{formatCurrency(gastosComp.value)} ({gastosComp.isPositive ? '+' : ''}{gastosComp.percentage.toFixed(1)}%)
                  </td>
                )}
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-900">Base Imponible</td>
                <td className="py-3 px-4 text-right text-gray-900">
                  {formatCurrency(summary.baseImponible)}
                </td>
                {previousYearSummary && (
                  <td className="py-3 px-4 text-right text-gray-600">
                    {formatCurrency(previousYearSummary.baseImponible)}
                  </td>
                )}
                {previousYearSummary && (
                  <td className="py-3 px-4 text-right text-gray-600">
                    {formatCurrency(summary.baseImponible - (previousYearSummary.baseImponible || 0))}
                  </td>
                )}
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-900">IVA Repercutido</td>
                <td className="py-3 px-4 text-right text-gray-900">
                  {formatCurrency(summary.ivaRepercutido)}
                </td>
                {previousYearSummary && (
                  <td className="py-3 px-4 text-right text-gray-600">
                    {formatCurrency(previousYearSummary.ivaRepercutido)}
                  </td>
                )}
                {previousYearSummary && (
                  <td className={`py-3 px-4 text-right font-semibold ${ivaComp.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {ivaComp.isPositive ? '+' : ''}{formatCurrency(ivaComp.value)} ({ivaComp.isPositive ? '+' : ''}{ivaComp.percentage.toFixed(1)}%)
                  </td>
                )}
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-900">IVA Soportado</td>
                <td className="py-3 px-4 text-right text-gray-900">
                  {formatCurrency(summary.ivaSoportado)}
                </td>
                {previousYearSummary && (
                  <td className="py-3 px-4 text-right text-gray-600">
                    {formatCurrency(previousYearSummary.ivaSoportado)}
                  </td>
                )}
                {previousYearSummary && (
                  <td className="py-3 px-4 text-right text-gray-600">
                    {formatCurrency(summary.ivaSoportado - (previousYearSummary.ivaSoportado || 0))}
                  </td>
                )}
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium text-gray-900">IRPF Estimado</td>
                <td className="py-3 px-4 text-right text-gray-900">
                  {formatCurrency(summary.irpfEstimado)}
                </td>
                {previousYearSummary && (
                  <td className="py-3 px-4 text-right text-gray-600">
                    {formatCurrency(previousYearSummary.irpfEstimado)}
                  </td>
                )}
                {previousYearSummary && (
                  <td className={`py-3 px-4 text-right font-semibold ${irpfComp.isPositive ? 'text-red-600' : 'text-green-600'}`}>
                    {irpfComp.isPositive ? '+' : ''}{formatCurrency(irpfComp.value)} ({irpfComp.isPositive ? '+' : ''}{irpfComp.percentage.toFixed(1)}%)
                  </td>
                )}
              </tr>
              <tr className="bg-gray-50 font-semibold">
                <td className="py-3 px-4 text-gray-900">Beneficio Neto</td>
                <td className={`py-3 px-4 text-right ${summary.beneficio >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(summary.beneficio)}
                </td>
                {previousYearSummary && (
                  <td className={`py-3 px-4 text-right ${previousYearSummary.beneficio >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(previousYearSummary.beneficio)}
                  </td>
                )}
                {previousYearSummary && (
                  <td className={`py-3 px-4 text-right font-semibold ${beneficioComp.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {beneficioComp.isPositive ? '+' : ''}{formatCurrency(beneficioComp.value)} ({beneficioComp.isPositive ? '+' : ''}{beneficioComp.percentage.toFixed(1)}%)
                  </td>
                )}
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Resumen de insights */}
      <Card className="p-6 bg-blue-50 border-blue-200 print:break-inside-avoid">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Resumen del Año {currentYear}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-900">
          <div>
            <strong>Ingresos totales:</strong> {formatCurrency(summary.ingresosTotales)}
          </div>
          <div>
            <strong>Gastos totales:</strong> {formatCurrency(summary.gastosTotales)}
          </div>
          <div>
            <strong>Base imponible:</strong> {formatCurrency(summary.baseImponible)}
          </div>
          <div>
            <strong>Ratio de deducibilidad:</strong> {summary.ratioDeducibilidad.toFixed(1)}%
          </div>
          <div>
            <strong>IVA neto:</strong> {formatCurrency(summary.ivaRepercutido - summary.ivaSoportado)}
          </div>
          <div>
            <strong>Beneficio neto:</strong> {formatCurrency(summary.beneficio)}
          </div>
          {previousYearSummary && (
            <>
              <div>
                <strong>Variación de ingresos:</strong> {ingresosComp.isPositive ? '+' : ''}{ingresosComp.percentage.toFixed(1)}%
              </div>
              <div>
                <strong>Variación de beneficio:</strong> {beneficioComp.isPositive ? '+' : ''}{beneficioComp.percentage.toFixed(1)}%
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};


