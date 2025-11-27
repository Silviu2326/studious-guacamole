import { useState } from 'react';
import { accountingExportApi, ExportRequest, taxSummaryApi, fiscalProfileApi, generarExportContable, ExportContableFiltros } from '../api';
import { expensesAPI } from '../api/expenses';
import { saveAs } from 'file-saver';
import { generateExcelExport } from '../utils/excelExport';
import { CategoriaGasto } from '../types/expenses';

/**
 * Estado de los filtros de exportación
 */
export interface ExportFilters {
  dateFrom: Date;
  dateTo: Date;
  format: 'csv' | 'pdf' | 'a3' | 'sage50' | 'xlsx' | 'excel' | 'contaplus';
  categories?: CategoriaGasto[];
  includeIncome?: boolean;
  includeExpenses?: boolean;
  includeBankTransactions?: boolean;
  reportType?: 'simple' | 'detailedVat';
}

/**
 * Resultado de la exportación
 */
export interface ExportResult {
  id: string;
  downloadUrl?: string;
  format: string;
  date: string;
}

/**
 * Hook para gestionar exportaciones contables
 * 
 * Gestiona:
 * - Estado de los filtros de exportación (rango de fechas, categorías, formato)
 * - Llamada a generarExportContable
 * - Manejo de loading, error y resultado (URL de descarga o id de exportación)
 */
export const useAccountingExport = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExportResult | null>(null);

  /**
   * Genera una exportación contable con los filtros especificados
   */
  const generateExport = async (filters: ExportFilters) => {
    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const dateFromStr = filters.dateFrom.toISOString().split('T')[0];
      const dateToStr = filters.dateTo.toISOString().split('T')[0];

      // Si es Excel, usar la función de exportación Excel existente
      if (filters.format === 'xlsx' || filters.format === 'excel') {
        // Obtener datos necesarios para el Excel
        const [taxSummary, allExpenses, fiscalProfile] = await Promise.all([
          taxSummaryApi.getSummary(dateFromStr, dateToStr),
          expensesAPI.obtenerGastos({
            fechaInicio: filters.dateFrom,
            fechaFin: filters.dateTo
          }),
          fiscalProfileApi.getProfile().catch(() => null)
        ]);

        // Filtrar gastos por categorías si se especificaron
        const expenses = filters.categories && filters.categories.length > 0
          ? allExpenses.filter(expense => filters.categories!.includes(expense.categoria))
          : allExpenses;

        // Generar el archivo Excel
        await generateExcelExport({
          taxSummary,
          expenses,
          dateFrom: filters.dateFrom,
          dateTo: filters.dateTo,
          fiscalProfile: fiscalProfile || undefined
        });

        // Crear resultado simulado
        const exportResult: ExportResult = {
          id: `export-excel-${Date.now()}`,
          format: 'xlsx',
          date: new Date().toISOString()
        };
        setResult(exportResult);
        console.log('Excel export generated successfully');
        return exportResult;
      }

      // Para otros formatos, usar generarExportContable
      const formato = filters.format === 'excel' ? 'excel' : 
                     filters.format === 'contaplus' ? 'contaplus' :
                     filters.format === 'a3' ? 'a3' :
                     filters.format === 'csv' ? 'csv' : 'csv';

      // Preparar filtros para generarExportContable
      const exportFiltros: ExportContableFiltros = {
        fechaInicio: filters.dateFrom,
        fechaFin: filters.dateTo,
        incluirIngresos: filters.includeIncome ?? true,
        incluirGastos: filters.includeExpenses ?? true,
        categoriaGastos: filters.categories,
        formatoDetalle: filters.reportType === 'detailedVat' ? 'detallado' : 'simple'
      };

      // Llamar a generarExportContable
      const exportacion = await generarExportContable(formato, exportFiltros);

      // Si hay URL de descarga, intentar descargar
      if (exportacion.urlDescarga) {
        // Simular descarga del archivo
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Crear un blob con contenido mock basado en el formato
        let content = '';
        let mimeType = 'text/plain';
        
        if (formato === 'pdf' || filters.format === 'pdf') {
          content = 'PDF export content mock...';
          mimeType = 'application/pdf';
        } else if (formato === 'csv') {
          content = 'CSV export content mock...';
          mimeType = 'text/csv';
        } else {
          content = 'Export content mock...';
        }
        
        const blob = new Blob([content], { type: mimeType });
        const fileName = `export-${dateFromStr}-${dateToStr}.${exportacion.formato}`;
        saveAs(blob, fileName);
      }

      const exportResult: ExportResult = {
        id: exportacion.id,
        downloadUrl: exportacion.urlDescarga,
        format: exportacion.formato,
        date: exportacion.fecha
      };
      
      setResult(exportResult);
      console.log('Export generated:', exportResult);
      return exportResult;
    } catch (err: any) {
      const errorMessage = err.message || 'Error al generar la exportación';
      setError(errorMessage);
      console.error('Export error:', err);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateExport,
    isGenerating,
    error,
    result
  };
};

