import { useState } from 'react';
import { accountingExportApi, ExportRequest } from '../api';
import { saveAs } from 'file-saver';

export const useAccountingExport = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateExport = async (request: ExportRequest) => {
    setIsGenerating(true);
    setError(null);

    try {
      // Simular la generación de exportación
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

