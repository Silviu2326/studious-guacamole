import { ExportFormat, ExportOptions, Metric, PerformanceData, RawDataExport, RawObjectiveData, ExtendedComparisonData, AIComparisonAnalysis, ComparisonExportData, ComparisonExportOptions } from '../types';

/**
 * User Story: Utilidades para exportar datos y gráficos en distintos formatos
 */

/**
 * Exporta datos a CSV
 */
export const exportToCSV = (data: any[], filename: string = 'export'): void => {
  if (!data || data.length === 0) {
    alert('No hay datos para exportar');
    return;
  }

  // Obtener headers del primer objeto
  const headers = Object.keys(data[0]);
  
  // Crear contenido CSV
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escapar comillas y envolver en comillas si contiene comas
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? '';
      }).join(',')
    )
  ].join('\n');

  // Crear blob y descargar
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Exporta métricas a CSV
 */
export const exportMetricsToCSV = (metrics: Metric[], filename: string = 'metricas'): void => {
  const csvData = metrics.map(metric => ({
    'Nombre': metric.name,
    'Valor': metric.value,
    'Unidad': metric.unit,
    'Objetivo': metric.target ?? '',
    'Progreso (%)': metric.target ? ((metric.value / metric.target) * 100).toFixed(2) : '',
    'Variación (%)': metric.variation?.toFixed(2) ?? '',
    'Tendencia': metric.trend?.direction ?? '',
    'Categoría': metric.category,
  }));

  exportToCSV(csvData, filename);
};

/**
 * Exporta gráfico como imagen usando html2canvas (simulado)
 */
export const exportChartAsImage = async (
  chartElement: HTMLElement | null,
  format: 'png' | 'jpg' | 'svg' = 'png',
  filename: string = 'grafico'
): Promise<void> => {
  if (!chartElement) {
    alert('No se encontró el elemento del gráfico');
    return;
  }

  try {
    // En producción, usar html2canvas o similar
    // Por ahora, simulamos la exportación creando un canvas básico
    const canvas = document.createElement('canvas');
    canvas.width = chartElement.offsetWidth || 800;
    canvas.height = chartElement.offsetHeight || 600;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Fondo blanco
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Texto indicativo (en producción se renderizaría el gráfico real)
      ctx.fillStyle = '#000000';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Gráfico Exportado', canvas.width / 2, canvas.height / 2);
      ctx.font = '14px Arial';
      ctx.fillText(`Exportado el ${new Date().toLocaleString('es-ES')}`, canvas.width / 2, canvas.height / 2 + 30);
    }

    // Convertir a blob y descargar
    canvas.toBlob((blob) => {
      if (!blob) {
        alert('Error al generar la imagen');
        return;
      }

      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      const extension = format === 'svg' ? 'svg' : format;
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.${extension}`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, format === 'png' ? 'image/png' : format === 'jpg' ? 'image/jpeg' : 'image/svg+xml');
  } catch (error) {
    console.error('Error exporting chart:', error);
    alert('Error al exportar el gráfico');
  }
};

/**
 * Genera código embed para un gráfico
 */
export const generateEmbedCode = (
  chartId: string,
  width: number = 800,
  height: number = 600
): string => {
  // En producción, esto generaría una URL real del gráfico
  const baseUrl = window.location.origin;
  const embedUrl = `${baseUrl}/api/charts/${chartId}/embed`;
  
  return `<iframe src="${embedUrl}" width="${width}" height="${height}" frameborder="0" allowfullscreen></iframe>`;
};

/**
 * Copia código embed al portapapeles
 */
export const copyEmbedCode = async (embedCode: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(embedCode);
    return true;
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    // Fallback para navegadores antiguos
    const textArea = document.createElement('textarea');
    textArea.value = embedCode;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};

/**
 * Exporta datos y gráficos según las opciones especificadas
 */
export const exportDataAndCharts = async (
  options: ExportOptions,
  data?: PerformanceData,
  chartElements?: Map<string, HTMLElement>
): Promise<void> => {
  const { format, includeCharts, includeData, chartIds, filename = 'export' } = options;

  if (format === 'csv') {
    if (includeData && data) {
      exportMetricsToCSV(data.metrics, filename);
    }
  } else if (format === 'png' || format === 'jpg' || format === 'svg') {
    if (includeCharts && chartElements) {
      const idsToExport = chartIds || Array.from(chartElements.keys());
      for (const chartId of idsToExport) {
        const element = chartElements.get(chartId);
        if (element) {
          await exportChartAsImage(element, format, `${filename}_${chartId}`);
        }
      }
    }
  } else if (format === 'embed') {
    if (includeCharts && chartElements) {
      const idsToExport = chartIds || Array.from(chartElements.keys());
      const embedCodes = idsToExport.map(chartId => 
        generateEmbedCode(chartId)
      );
      const allEmbedCode = embedCodes.join('\n\n');
      const success = await copyEmbedCode(allEmbedCode);
      if (success) {
        alert('Código embed copiado al portapapeles');
      } else {
        alert('Error al copiar el código embed');
      }
    }
  }
};

/**
 * User Story 2: Exporta datos en bruto a CSV con etiquetas
 */
export const exportRawDataToCSV = (rawData: RawDataExport, filename: string = 'datos-en-bruto'): void => {
  if (!rawData || !rawData.objectives || rawData.objectives.length === 0) {
    alert('No hay datos para exportar');
    return;
  }

  // Headers con etiquetas principales
  const headers = [
    'ID Objetivo',
    'Objetivo',
    'Descripción',
    'Etiqueta Objetivo',
    'Etiqueta Equipo',
    'Etiqueta Responsable',
    'ID Responsable',
    'Métrica',
    'Valor Objetivo',
    'Valor Actual',
    'Unidad',
    'Progreso (%)',
    'Estado',
    'Categoría',
    'Fecha Límite',
    'Fecha Creación',
    'Fecha Actualización',
    'Tipo Objetivo',
    'Horizonte',
    'Tipo Asignación',
    'ID Asignación',
    'Nombre Asignación',
  ];

  // Crear contenido CSV
  const csvContent = [
    headers.join(','),
    ...rawData.objectives.map((obj: RawObjectiveData) => {
      const row = [
        obj.objectiveId,
        obj.objectiveTitle,
        obj.objectiveDescription || '',
        obj.objetivo,
        obj.equipo,
        obj.responsable,
        obj.responsableId || '',
        obj.metric,
        obj.targetValue,
        obj.currentValue,
        obj.unit,
        obj.progress,
        obj.status,
        obj.category,
        obj.deadline,
        obj.createdAt,
        obj.updatedAt,
        obj.objectiveType || '',
        obj.horizon || '',
        obj.assignmentType || '',
        obj.assignmentId || '',
        obj.assignmentName || '',
      ];
      
      // Escapar valores que contengan comas o comillas
      return row.map(value => {
        const stringValue = String(value ?? '');
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',');
    }),
  ].join('\n');

  // Crear blob y descargar
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * User Story 2: Exporta datos en bruto a JSON
 */
export const exportRawDataToJSON = (rawData: RawDataExport, filename: string = 'datos-en-bruto'): void => {
  if (!rawData || !rawData.objectives || rawData.objectives.length === 0) {
    alert('No hay datos para exportar');
    return;
  }

  const jsonContent = JSON.stringify(rawData, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * User Story 2: Exporta datos en bruto a Excel (simulado como CSV con extensión .xlsx)
 * Nota: En producción, usar una librería como xlsx para generar archivos Excel reales
 */
export const exportRawDataToExcel = (rawData: RawDataExport, filename: string = 'datos-en-bruto'): void => {
  // Por ahora, exportamos como CSV pero con extensión .xlsx
  // En producción, usar librería xlsx para generar archivos Excel reales
  exportRawDataToCSV(rawData, filename);
  
  // Nota: Para implementación real de Excel, usar:
  // import * as XLSX from 'xlsx';
  // const ws = XLSX.utils.json_to_sheet(rawData.objectives);
  // const wb = XLSX.utils.book_new();
  // XLSX.utils.book_append_sheet(wb, ws, 'Datos');
  // XLSX.writeFile(wb, `${filename}.xlsx`);
};

/**
 * User Story: Exporta datos de comparación a CSV
 */
export const exportComparisonToCSV = (
  comparisonData: ExtendedComparisonData,
  currentPeriod: string,
  previousPeriod: string,
  filename: string = 'comparacion'
): void => {
  const csvData = comparisonData.changes.map(change => ({
    'Métrica': change.metric,
    'Período Anterior': change.previous.toFixed(2),
    'Período Actual': change.current.toFixed(2),
    'Cambio': change.change.toFixed(2),
    'Cambio %': `${change.changePercent > 0 ? '+' : ''}${change.changePercent.toFixed(2)}%`,
  }));

  exportToCSV(csvData, `${filename}_${currentPeriod}_vs_${previousPeriod}`);
};

/**
 * User Story: Exporta datos de comparación a JSON
 */
export const exportComparisonToJSON = (
  exportData: ComparisonExportData,
  filename: string = 'comparacion'
): void => {
  const jsonContent = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * User Story: Genera código embed para comparación
 */
export const generateComparisonEmbedCode = (
  comparisonId: string,
  width: number = 800,
  height: number = 600
): string => {
  const baseUrl = window.location.origin;
  const embedUrl = `${baseUrl}/api/comparisons/${comparisonId}/embed`;
  
  return `<iframe src="${embedUrl}" width="${width}" height="${height}" frameborder="0" allowfullscreen></iframe>`;
};

/**
 * User Story: Exporta comparación completa según opciones
 */
export const exportComparison = async (
  comparisonData: ExtendedComparisonData,
  currentPeriod: string,
  previousPeriod: string,
  options: ComparisonExportOptions,
  aiAnalysis?: AIComparisonAnalysis,
  chartElement?: HTMLElement | null,
  userId: string = 'current-user',
  userName: string = 'Usuario'
): Promise<void> => {
  const { format, includeCharts, includeAIAnalysis, includeRawData, chartFormat = 'png' } = options;
  const filename = `comparacion_${currentPeriod}_vs_${previousPeriod}`;

  if (format === 'csv') {
    exportComparisonToCSV(comparisonData, currentPeriod, previousPeriod, filename);
  } else if (format === 'json') {
    const exportData: ComparisonExportData = {
      currentPeriod,
      previousPeriod,
      comparisonData,
      aiAnalysis: includeAIAnalysis ? aiAnalysis : undefined,
      exportedAt: new Date().toISOString(),
      exportedBy: userId,
      exportedByName: userName,
    };
    exportComparisonToJSON(exportData, filename);
  } else if (format === 'excel') {
    // Por ahora exportamos como CSV (en producción usar librería xlsx)
    exportComparisonToCSV(comparisonData, currentPeriod, previousPeriod, filename);
  } else if (format === 'pdf') {
    // En producción, usar librería como jsPDF o pdfmake
    alert('Exportación a PDF próximamente disponible. Por ahora, puedes exportar como CSV o JSON.');
  } else if (format === 'embed') {
    const comparisonId = `comp-${Date.now()}`;
    const embedCode = generateComparisonEmbedCode(comparisonId, 800, 600);
    const success = await copyEmbedCode(embedCode);
    if (success) {
      alert('Código embed copiado al portapapeles. Puedes pegarlo en tu dashboard ejecutivo.');
    } else {
      alert('Error al copiar el código embed');
    }
  }

  // Exportar gráficos si se solicita
  if (includeCharts && chartElement && (format === 'png' || format === 'jpg' || format === 'svg')) {
    await exportChartAsImage(chartElement, chartFormat, filename);
  }
};

