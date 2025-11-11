import { useState } from 'react';
import { accountingExportApi, ExportRequest, taxSummaryApi, fiscalProfileApi } from '../api';
import { expensesAPI } from '../api/expenses';
import { saveAs } from 'file-saver';
import { generateExcelExport } from '../utils/excelExport';

export const useAccountingExport = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateExport = async (request: ExportRequest) => {
    setIsGenerating(true);
    setError(null);

    try {
      // Si es Excel, usar la función de exportación Excel
      if (request.format === 'xlsx') {
        // Obtener datos necesarios para el Excel
        const [taxSummary, expenses, fiscalProfile] = await Promise.all([
          taxSummaryApi.getSummary(request.dateFrom, request.dateTo),
          expensesAPI.obtenerGastos({
            fechaInicio: new Date(request.dateFrom),
            fechaFin: new Date(request.dateTo)
          }),
          fiscalProfileApi.getProfile().catch(() => null)
        ]);

        // Generar el archivo Excel
        await generateExcelExport({
          taxSummary,
          expenses,
          dateFrom: new Date(request.dateFrom),
          dateTo: new Date(request.dateTo),
          fiscalProfile: fiscalProfile || undefined
        });

        console.log('Excel export generated successfully');
        return;
      }

      // Para otros formatos, usar el flujo original
      const response = await accountingExportApi.createExport(request);

      // Simular descarga de archivo
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Crear un blob con contenido mock basado en el formato
      const content = request.format === 'pdf' 
        ? 'PDF export content mock...'
        : 'CSV export content mock...';
      
      const blob = new Blob([content], { type: 'text/plain' });
      const fileName = `export-${request.dateFrom}-${request.dateTo}.${request.format}`;
      
      saveAs(blob, fileName);

      console.log('Export generated:', response);
    } catch (err: any) {
      setError(err.message || 'Error al generar la exportación');
      console.error('Export error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateExport,
    isGenerating,
    error
  };
};

