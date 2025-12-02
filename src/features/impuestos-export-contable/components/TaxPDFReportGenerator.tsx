import React, { useState } from 'react';
import { Card, Button, Select, SelectOption } from '../../../components/componentsreutilizables';
import { FileText, Download, Loader2, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import { generateTaxPDFReport } from '../utils/pdfGenerator';
import { FiscalProfile, TaxSummary, TaxCalculation } from '../api/types';
import { GastoDeducible } from '../types/expenses';
import { expensesAPI } from '../api/expenses';
import { fiscalProfileApi, taxSummaryApi } from '../api';
import { incomeExpenseChartApi } from '../api/api';

interface TaxPDFReportGeneratorProps {
  dateRange: {
    from: Date;
    to: Date;
  };
  onGenerateComplete?: () => void;
}

export const TaxPDFReportGenerator: React.FC<TaxPDFReportGeneratorProps> = ({
  dateRange,
  onGenerateComplete
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [reportOptions, setReportOptions] = useState({
    includeCharts: true,
    includeDetailedExpenses: true,
    includeMonthlyBreakdown: true,
  });

  const handleGeneratePDF = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Cargar datos necesarios
      const [fiscalProfile, taxSummary, expenses] = await Promise.all([
        fiscalProfileApi.getProfile(),
        taxSummaryApi.getSummary(
          dateRange.from.toISOString().split('T')[0],
          dateRange.to.toISOString().split('T')[0]
        ),
        expensesAPI.obtenerGastos({
          fechaInicio: dateRange.from,
          fechaFin: dateRange.to
        })
      ]);

      // Obtener desglose mensual si está habilitado
      let monthlyBreakdown: Array<{
        month: string;
        income: number;
        expenses: number;
        balance: number;
      }> | undefined = undefined;

      if (reportOptions.includeMonthlyBreakdown) {
        try {
          const chartData = await incomeExpenseChartApi.getChartData(
            dateRange.from.toISOString().split('T')[0],
            dateRange.to.toISOString().split('T')[0]
          );
          
          monthlyBreakdown = chartData.monthlyData.map(data => ({
            month: data.month,
            income: data.income,
            expenses: data.expenses,
            balance: data.balance,
          }));
        } catch (err) {
          console.warn('Error al cargar desglose mensual:', err);
          // Continuar sin desglose mensual
        }
      }

      // Calcular impuestos (simulado, en producción vendría de la API)
      const taxCalculation: TaxCalculation | undefined = taxSummary
        ? {
            grossIncome: taxSummary.totalGross,
            deductibleExpenses: taxSummary.totalExpenses,
            vatToPay: taxSummary.totalVat,
            vatCollected: taxSummary.totalVat,
            vatDeductible: 0,
            vatNet: taxSummary.totalVat,
            taxableBase: taxSummary.totalGross - taxSummary.totalExpenses,
            irpfAmount: (taxSummary.totalGross - taxSummary.totalExpenses) * 0.15,
            netIncome: taxSummary.netProfit,
            totalTaxes: taxSummary.totalVat + ((taxSummary.totalGross - taxSummary.totalExpenses) * 0.15),
            settings: {
              vatRate: 21,
              vatEnabled: true,
              irpfRate: 15,
              irpfEnabled: true,
              taxRegime: fiscalProfile.taxRegime as any,
            }
          }
        : undefined;

      // Generar PDF
      const pdfBlob = await generateTaxPDFReport({
        fiscalProfile,
        taxSummary,
        taxCalculation,
        expenses: reportOptions.includeDetailedExpenses ? expenses : [],
        dateRange,
        monthlyBreakdown: reportOptions.includeMonthlyBreakdown ? monthlyBreakdown : undefined,
      });

      // Descargar PDF
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `informe-fiscal-${dateRange.from.toISOString().split('T')[0]}-${dateRange.to.toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setSuccess(true);
      if (onGenerateComplete) {
        onGenerateComplete();
      }

      // Resetear éxito después de 3 segundos
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar el informe PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-white shadow-sm">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
            <FileText size={24} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Generar Informe PDF Fiscal
            </h3>
            <p className="text-sm text-gray-600">
              Genera un informe PDF completo y profesional con todos tus datos fiscales
            </p>
          </div>
        </div>

        {/* Información del período */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={18} className="text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Período del Informe</span>
          </div>
          <p className="text-sm text-blue-700">
            Desde: {dateRange.from.toLocaleDateString('es-ES')} - Hasta: {dateRange.to.toLocaleDateString('es-ES')}
          </p>
        </div>

        {/* Opciones del informe */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-900">Opciones del Informe</h4>
          
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={reportOptions.includeCharts}
                onChange={(e) => setReportOptions({ ...reportOptions, includeCharts: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Incluir gráficos explicativos</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={reportOptions.includeDetailedExpenses}
                onChange={(e) => setReportOptions({ ...reportOptions, includeDetailedExpenses: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Incluir lista detallada de gastos</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={reportOptions.includeMonthlyBreakdown}
                onChange={(e) => setReportOptions({ ...reportOptions, includeMonthlyBreakdown: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Incluir desglose mensual</span>
            </label>
          </div>
        </div>

        {/* Contenido del informe */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">El informe incluirá:</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
              <span>Resumen ejecutivo con indicadores principales</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
              <span>Información fiscal (razón social, NIF, dirección)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
              <span>Cálculos fiscales detallados (IVA, IRPF)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
              <span>Ingresos detallados con estadísticas</span>
            </li>
            {reportOptions.includeMonthlyBreakdown && (
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                <span>Desglose mensual de ingresos y gastos</span>
              </li>
            )}
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
              <span>Gastos deducibles agrupados por categoría</span>
            </li>
            {reportOptions.includeDetailedExpenses && (
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                <span>Lista detallada de gastos con fechas y conceptos</span>
              </li>
            )}
            {reportOptions.includeCharts && (
              <li className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                <span>Gráficos visuales (ingresos vs gastos, distribución por categoría)</span>
              </li>
            )}
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
              <span>Notas y observaciones importantes</span>
            </li>
          </ul>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle size={20} className="text-red-600" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle size={20} className="text-green-600" />
            <p className="text-sm text-green-600">
              ¡Informe PDF generado y descargado correctamente!
            </p>
          </div>
        )}

        {/* Botón de generación */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button
            variant="primary"
            size="lg"
            onClick={handleGeneratePDF}
            disabled={loading}
            loading={loading}
          >
            <Download size={20} className="mr-2" />
            {loading ? 'Generando PDF...' : 'Generar y Descargar PDF'}
          </Button>
        </div>

        {/* Información adicional */}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle size={20} className="text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-900 mb-1">
                Información Importante
              </p>
              <p className="text-xs text-yellow-700">
                El informe PDF generado es un documento completo y profesional listo para enviar a tu gestor. 
                Asegúrate de revisar todos los datos antes de utilizarlo para declaraciones fiscales oficiales.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

