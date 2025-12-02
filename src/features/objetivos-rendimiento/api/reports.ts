/**
 * API Mock para el sistema de generación de reportes
 * 
 * Este módulo proporciona funciones mock para la gestión de reportes de rendimiento,
 * incluyendo creación de reportes periódicos y simulación de descarga en PDF/Excel.
 * 
 * NOTA: En producción, este módulo se conectaría con:
 * - Un servicio backend (REST API) para la generación de reportes
 * - Un servicio de cola de trabajos (ej: Bull, RabbitMQ) para procesamiento asíncrono
 * - Un servicio de almacenamiento (S3, Azure Blob) para guardar archivos generados
 * - Un servicio de generación de PDFs (ej: Puppeteer, PDFKit, jsPDF)
 * - Un servicio de generación de Excel (ej: ExcelJS, xlsx)
 * - Endpoints como:
 *   - POST /api/reports/generate - Iniciar generación de reporte
 *   - GET /api/reports - Listar reportes históricos
 *   - GET /api/reports/:id - Obtener detalles de un reporte
 *   - GET /api/reports/:id/download - Descargar archivo del reporte
 *   - GET /api/reports/:id/status - Consultar estado de generación
 */

import {
  Report,
  ReportType,
  ReportFormat,
  ReportStatus,
  ReportFilters,
  GenerateReportParams,
  PerformanceData,
  Metric,
  Objective,
  ObjectiveStatus,
  MetricCategory,
} from '../types';

// ============================================================================
// UTILIDADES Y HELPERS
// ============================================================================

/**
 * Calcula el rango de fechas por defecto según el tipo de reporte
 * 
 * @param tipo - Tipo de reporte (daily, weekly, monthly, etc.)
 * @returns Rango de fechas con desde y hasta
 */
const getDefaultDateRange = (tipo: ReportType | string): { desde: string; hasta: string } => {
  const ahora = new Date();
  const desde = new Date();
  const hasta = new Date();

  switch (tipo) {
    case ReportType.DAILY:
      // Reporte del día anterior
      desde.setDate(ahora.getDate() - 1);
      hasta.setDate(ahora.getDate() - 1);
      break;
    
    case ReportType.WEEKLY:
      // Última semana completa (lunes a domingo)
      const diasDesdeLunes = ahora.getDay() === 0 ? 6 : ahora.getDay() - 1;
      desde.setDate(ahora.getDate() - diasDesdeLunes - 7);
      hasta.setDate(desde.getDate() + 6);
      break;
    
    case ReportType.MONTHLY:
      // Mes anterior completo
      desde.setMonth(ahora.getMonth() - 1, 1);
      hasta.setMonth(ahora.getMonth(), 0);
      break;
    
    case ReportType.QUARTERLY:
      // Trimestre anterior
      const trimestreActual = Math.floor(ahora.getMonth() / 3);
      const trimestreAnterior = trimestreActual === 0 ? 3 : trimestreActual - 1;
      desde.setMonth(trimestreAnterior * 3, 1);
      hasta.setMonth((trimestreAnterior + 1) * 3, 0);
      break;
    
    case ReportType.YEARLY:
      // Año anterior completo
      desde.setFullYear(ahora.getFullYear() - 1, 0, 1);
      hasta.setFullYear(ahora.getFullYear() - 1, 11, 31);
      break;
    
    case ReportType.CUSTOM:
    default:
      // Por defecto, último mes
      desde.setMonth(ahora.getMonth() - 1, 1);
      hasta.setMonth(ahora.getMonth(), 0);
      break;
  }

  return {
    desde: desde.toISOString().split('T')[0],
    hasta: hasta.toISOString().split('T')[0],
  };
};

/**
 * Genera un nombre de reporte basado en el tipo y rango de fechas
 */
const generateReportName = (
  tipo: ReportType | string,
  rangoFechas: { desde: string; hasta: string },
  nombrePersonalizado?: string
): string => {
  if (nombrePersonalizado) {
    return nombrePersonalizado;
  }

  const tipoNombres: Record<string, string> = {
    [ReportType.DAILY]: 'Diario',
    [ReportType.WEEKLY]: 'Semanal',
    [ReportType.MONTHLY]: 'Mensual',
    [ReportType.QUARTERLY]: 'Trimestral',
    [ReportType.YEARLY]: 'Anual',
    [ReportType.CUSTOM]: 'Personalizado',
  };

  const tipoNombre = tipoNombres[tipo] || 'Personalizado';
  const desdeFormato = new Date(rangoFechas.desde).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const hastaFormato = new Date(rangoFechas.hasta).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return `Reporte ${tipoNombre} - ${desdeFormato} a ${hastaFormato}`;
};

/**
 * Genera datos mock de rendimiento para un reporte
 * 
 * En producción, estos datos vendrían de:
 * - Agregaciones de métricas en la base de datos
 * - Cálculos de objetivos y progreso
 * - Series temporales para gráficos
 */
const generateMockPerformanceData = (
  rangoFechas: { desde: string; hasta: string }
): PerformanceData => {
  const metrics: Metric[] = [
    {
      id: 'metric-001',
      name: 'Facturación Total',
      nombre: 'Facturación Total',
      value: 45230,
      valorActual: 45230,
      unit: '€',
      unidad: '€',
      category: MetricCategory.FINANZAS,
      categoria: MetricCategory.FINANZAS,
      trend: {
        value: 8.5,
        direction: 'up',
        period: 'vs período anterior',
      },
    },
    {
      id: 'metric-002',
      name: 'Tasa de Retención',
      nombre: 'Tasa de Retención',
      value: 87.5,
      valorActual: 87.5,
      unit: '%',
      unidad: '%',
      category: MetricCategory.CLIENTES,
      categoria: MetricCategory.CLIENTES,
      trend: {
        value: 2.3,
        direction: 'up',
        period: 'vs período anterior',
      },
    },
    {
      id: 'metric-003',
      name: 'Adherencia a Planes',
      nombre: 'Adherencia a Planes',
      value: 76.2,
      valorActual: 76.2,
      unit: '%',
      unidad: '%',
      category: MetricCategory.OPERACIONES,
      categoria: MetricCategory.OPERACIONES,
      trend: {
        value: -1.2,
        direction: 'down',
        period: 'vs período anterior',
      },
    },
  ];

  const objectives: Objective[] = [
    {
      id: 'obj-001',
      title: 'Aumentar facturación mensual',
      nombre: 'Aumentar facturación mensual',
      metric: 'facturacion',
      tipo: 'facturacion',
      targetValue: 50000,
      valorObjetivo: 50000,
      currentValue: 45230,
      valorActual: 45230,
      unit: '€',
      deadline: rangoFechas.hasta,
      status: ObjectiveStatus.ON_TRACK,
      progress: 90.5,
      progreso: 90.5,
      createdAt: rangoFechas.desde,
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'obj-002',
      title: 'Mejorar tasa de retención',
      nombre: 'Mejorar tasa de retención',
      metric: 'retencion',
      tipo: 'retencion',
      targetValue: 90,
      valorObjetivo: 90,
      currentValue: 87.5,
      valorActual: 87.5,
      unit: '%',
      deadline: rangoFechas.hasta,
      status: ObjectiveStatus.AT_RISK,
      progress: 97.2,
      progreso: 97.2,
      createdAt: rangoFechas.desde,
      updatedAt: new Date().toISOString(),
    },
  ];

  return {
    period: `${rangoFechas.desde} a ${rangoFechas.hasta}`,
    periodo: `${rangoFechas.desde} a ${rangoFechas.hasta}`,
    metrics,
    metricas: metrics,
    objectives,
    objetivos: objectives,
    summary: {
      totalObjectives: 5,
      totalObjetivos: 5,
      achievedObjectives: 2,
      objetivosAlcanzados: 2,
      inProgressObjectives: 2,
      objetivosEnProgreso: 2,
      atRiskObjectives: 1,
      objetivosEnRiesgo: 1,
    },
  };
};

// ============================================================================
// DATOS MOCK - REPORTES HISTÓRICOS
// ============================================================================

/**
 * Almacenamiento mock de reportes históricos
 * 
 * En producción, estos datos estarían en una base de datos y se consultarían
 * mediante queries SQL/NoSQL con filtros, paginación, etc.
 */
let mockReportsStore: Report[] = [
  {
    id: 'report-001',
    title: 'Reporte Mensual - Noviembre 2024',
    titulo: 'Reporte Mensual - Noviembre 2024',
    nombre: 'Reporte Mensual - Noviembre 2024',
    type: ReportType.MONTHLY,
    tipo: ReportType.MONTHLY,
    period: '2024-11',
    periodo: '2024-11',
    rangoFechas: {
      desde: '2024-11-01',
      hasta: '2024-11-30',
    },
    estado: ReportStatus.COMPLETED,
    status: ReportStatus.COMPLETED,
    formato: ReportFormat.PDF,
    format: ReportFormat.PDF,
    urlDescarga: 'https://mock-storage.example.com/reports/report-001.pdf',
    downloadUrl: 'https://mock-storage.example.com/reports/report-001.pdf',
    data: generateMockPerformanceData({ desde: '2024-11-01', hasta: '2024-11-30' }),
    generatedAt: '2024-12-01T08:00:00Z',
  },
  {
    id: 'report-002',
    title: 'Reporte Semanal - Semana 46',
    titulo: 'Reporte Semanal - Semana 46',
    nombre: 'Reporte Semanal - Semana 46',
    type: ReportType.WEEKLY,
    tipo: ReportType.WEEKLY,
    period: '2024-11-11 a 2024-11-17',
    periodo: '2024-11-11 a 2024-11-17',
    rangoFechas: {
      desde: '2024-11-11',
      hasta: '2024-11-17',
    },
    estado: ReportStatus.COMPLETED,
    status: ReportStatus.COMPLETED,
    formato: ReportFormat.EXCEL,
    format: ReportFormat.EXCEL,
    urlDescarga: 'https://mock-storage.example.com/reports/report-002.xlsx',
    downloadUrl: 'https://mock-storage.example.com/reports/report-002.xlsx',
    data: generateMockPerformanceData({ desde: '2024-11-11', hasta: '2024-11-17' }),
    generatedAt: '2024-11-18T09:15:00Z',
  },
  {
    id: 'report-003',
    title: 'Reporte Diario - 15 de Diciembre 2024',
    titulo: 'Reporte Diario - 15 de Diciembre 2024',
    nombre: 'Reporte Diario - 15 de Diciembre 2024',
    type: ReportType.DAILY,
    tipo: ReportType.DAILY,
    period: '2024-12-15',
    periodo: '2024-12-15',
    rangoFechas: {
      desde: '2024-12-15',
      hasta: '2024-12-15',
    },
    estado: ReportStatus.COMPLETED,
    status: ReportStatus.COMPLETED,
    formato: ReportFormat.PDF,
    format: ReportFormat.PDF,
    urlDescarga: 'https://mock-storage.example.com/reports/report-003.pdf',
    downloadUrl: 'https://mock-storage.example.com/reports/report-003.pdf',
    data: generateMockPerformanceData({ desde: '2024-12-15', hasta: '2024-12-15' }),
    generatedAt: '2024-12-16T07:30:00Z',
  },
  {
    id: 'report-004',
    title: 'Reporte Trimestral - Q3 2024',
    titulo: 'Reporte Trimestral - Q3 2024',
    nombre: 'Reporte Trimestral - Q3 2024',
    type: ReportType.QUARTERLY,
    tipo: ReportType.QUARTERLY,
    period: '2024-Q3',
    periodo: '2024-Q3',
    rangoFechas: {
      desde: '2024-07-01',
      hasta: '2024-09-30',
    },
    estado: ReportStatus.COMPLETED,
    status: ReportStatus.COMPLETED,
    formato: ReportFormat.EXCEL,
    format: ReportFormat.EXCEL,
    urlDescarga: 'https://mock-storage.example.com/reports/report-004.xlsx',
    downloadUrl: 'https://mock-storage.example.com/reports/report-004.xlsx',
    data: generateMockPerformanceData({ desde: '2024-07-01', hasta: '2024-09-30' }),
    generatedAt: '2024-10-01T10:00:00Z',
  },
];

// ============================================================================
// FUNCIONES DE API
// ============================================================================

/**
 * Obtiene la lista de reportes históricos con filtros opcionales
 * 
 * En producción, esta función haría una llamada a:
 * GET /api/reports?type=monthly&status=completed&format=pdf
 * 
 * El backend realizaría:
 * - Query a la base de datos con filtros aplicados
 * - Paginación si hay muchos resultados
 * - Ordenamiento por fecha de generación (más recientes primero)
 * 
 * @param filter - Filtros opcionales para la búsqueda
 * @returns Promise con array de reportes que coinciden con los filtros
 * 
 * @example
 * // Obtener todos los reportes
 * const todos = await getReports();
 * 
 * // Filtrar por tipo
 * const mensuales = await getReports({ tipo: ReportType.MONTHLY });
 * 
 * // Filtrar por estado y formato
 * const pdfsCompletados = await getReports({
 *   estado: ReportStatus.COMPLETED,
 *   formato: ReportFormat.PDF
 * });
 */
export const getReports = async (filter?: ReportFilters): Promise<Report[]> => {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 300));

  let filteredReports = [...mockReportsStore];

  if (!filter) {
    return filteredReports;
  }

  // Aplicar filtros
  const tipo = filter.tipo || filter.type;
  const estado = filter.estado || filter.status;
  const formato = filter.formato || filter.format;
  const fechaDesde = filter.fechaDesde || filter.generatedFrom;
  const fechaHasta = filter.fechaHasta || filter.generatedTo;
  const rangoDesde = filter.rangoDesde || filter.periodFrom;
  const rangoHasta = filter.rangoHasta || filter.periodTo;

  if (tipo) {
    filteredReports = filteredReports.filter(
      r => r.type === tipo || r.tipo === tipo
    );
  }

  if (estado) {
    filteredReports = filteredReports.filter(
      r => r.estado === estado || r.status === estado
    );
  }

  if (formato) {
    filteredReports = filteredReports.filter(
      r => r.formato === formato || r.format === formato
    );
  }

  if (fechaDesde) {
    filteredReports = filteredReports.filter(
      r => r.generatedAt >= fechaDesde
    );
  }

  if (fechaHasta) {
    filteredReports = filteredReports.filter(
      r => r.generatedAt <= fechaHasta
    );
  }

  if (rangoDesde) {
    filteredReports = filteredReports.filter(
      r => r.rangoFechas && r.rangoFechas.desde >= rangoDesde
    );
  }

  if (rangoHasta) {
    filteredReports = filteredReports.filter(
      r => r.rangoFechas && r.rangoFechas.hasta <= rangoHasta
    );
  }

  // Ordenar por fecha de generación (más recientes primero)
  return filteredReports.sort(
    (a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
  );
};

/**
 * Genera un nuevo reporte con los parámetros especificados
 * 
 * En producción, esta función haría una llamada a:
 * POST /api/reports/generate
 * Body: { type, format, dateRange, role, name }
 * 
 * El backend realizaría:
 * 1. Validar parámetros y permisos del usuario
 * 2. Crear registro en BD con estado "pending" o "generating"
 * 3. Encolar trabajo asíncrono en cola de trabajos (Bull, RabbitMQ, etc.)
 * 4. El worker procesaría:
 *    - Obtener datos de métricas y objetivos del rango de fechas
 *    - Generar archivo PDF usando Puppeteer/PDFKit o Excel usando ExcelJS
 *    - Subir archivo a almacenamiento (S3, Azure Blob)
 *    - Actualizar registro en BD con estado "completed" y URL de descarga
 * 5. Notificar al usuario cuando esté listo (WebSocket, email, etc.)
 * 
 * En este mock, simulamos que el reporte se genera inmediatamente.
 * 
 * @param params - Parámetros para generar el reporte
 * @returns Promise con el reporte generado
 * 
 * @example
 * // Generar reporte mensual en PDF
 * const reporte = await generateReport({
 *   tipo: ReportType.MONTHLY,
 *   formato: ReportFormat.PDF
 * });
 * 
 * // Generar reporte personalizado en Excel
 * const reporteCustom = await generateReport({
 *   tipo: ReportType.CUSTOM,
 *   formato: ReportFormat.EXCEL,
 *   rangoFechas: {
 *     desde: '2024-11-01',
 *     hasta: '2024-11-30'
 *   },
 *   nombre: 'Análisis Especial Noviembre'
 * });
 */
export const generateReport = async (params: GenerateReportParams): Promise<Report> => {
  // Simular tiempo de procesamiento (en producción sería asíncrono)
  await new Promise(resolve => setTimeout(resolve, 800));

  const tipo = params.tipo || params.type || ReportType.MONTHLY;
  const formato = params.formato || params.format || ReportFormat.PDF;
  const nombrePersonalizado = params.nombre || params.name;

  // Obtener rango de fechas
  let rangoFechas: { desde: string; hasta: string };
  if (params.rangoFechas) {
    rangoFechas = params.rangoFechas;
  } else if (params.dateRange) {
    rangoFechas = {
      desde: params.dateRange.from,
      hasta: params.dateRange.to,
    };
  } else {
    rangoFechas = getDefaultDateRange(tipo);
  }

  // Generar nombre del reporte
  const nombre = generateReportName(tipo, rangoFechas, nombrePersonalizado);

  // Generar datos de rendimiento
  const data = generateMockPerformanceData(rangoFechas);

  // Crear ID único
  const id = `report-${Date.now()}`;

  // Generar URL mock de descarga
  // En producción, esta URL sería generada por el servicio de almacenamiento
  const extension = formato === ReportFormat.PDF ? 'pdf' : 
                   formato === ReportFormat.EXCEL ? 'xlsx' :
                   formato === ReportFormat.CSV ? 'csv' : 'json';
  const downloadUrl = `https://mock-storage.example.com/reports/${id}.${extension}`;

  // Crear reporte
  const nuevoReporte: Report = {
    id,
    title: nombre,
    titulo: nombre,
    nombre: nombre,
    type: tipo as ReportType,
    tipo: tipo as ReportType,
    period: `${rangoFechas.desde} a ${rangoFechas.hasta}`,
    periodo: `${rangoFechas.desde} a ${rangoFechas.hasta}`,
    rangoFechas,
    estado: ReportStatus.COMPLETED, // En mock, completado inmediatamente
    status: ReportStatus.COMPLETED,
    formato: formato as ReportFormat,
    format: formato as ReportFormat,
    urlDescarga: downloadUrl,
    downloadUrl,
    data,
    generatedAt: new Date().toISOString(),
  };

  // Guardar en almacenamiento mock
  mockReportsStore.unshift(nuevoReporte);

  return nuevoReporte;
};

/**
 * Simula la descarga de un reporte generado
 * 
 * En producción, esta función haría una llamada a:
 * GET /api/reports/:id/download
 * 
 * El backend realizaría:
 * 1. Verificar que el reporte existe y está completado
 * 2. Verificar permisos del usuario
 * 3. Obtener URL firmada del almacenamiento (S3 signed URL, Azure SAS, etc.)
 * 4. Redirigir o devolver la URL para descarga
 * 5. Registrar evento de descarga en analytics
 * 
 * Alternativamente, podría servir el archivo directamente:
 * - Leer archivo del almacenamiento
 * - Stream al cliente con headers apropiados (Content-Type, Content-Disposition)
 * 
 * @param reportId - ID del reporte a descargar
 * @returns Promise con la URL de descarga o indicador de éxito
 * 
 * @example
 * // Simular descarga
 * const url = await simulateDownload('report-001');
 * // En una app real, abrirías esta URL o iniciarías la descarga
 * window.open(url, '_blank');
 */
export const simulateDownload = async (reportId: string): Promise<string> => {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 200));

  // Buscar reporte en almacenamiento mock
  const reporte = mockReportsStore.find(r => r.id === reportId);

  if (!reporte) {
    throw new Error(`Reporte con ID ${reportId} no encontrado`);
  }

  if (reporte.estado !== ReportStatus.COMPLETED && reporte.status !== ReportStatus.COMPLETED) {
    throw new Error(`El reporte ${reportId} aún no está listo para descargar`);
  }

  // En producción, aquí se generaría una URL firmada con expiración
  // Ejemplo para S3:
  // const signedUrl = await s3.getSignedUrl('getObject', {
  //   Bucket: 'reports-bucket',
  //   Key: `reports/${reportId}.${extension}`,
  //   Expires: 3600 // 1 hora
  // });

  const downloadUrl = reporte.downloadUrl || reporte.urlDescarga;

  if (!downloadUrl) {
    throw new Error(`El reporte ${reportId} no tiene URL de descarga disponible`);
  }

  // En producción, aquí podrías:
  // - Registrar evento de descarga en analytics
  // - Incrementar contador de descargas
  // - Enviar notificación al usuario

  return downloadUrl;
};

/**
 * Obtiene un reporte específico por su ID
 * 
 * En producción, esta función haría una llamada a:
 * GET /api/reports/:id
 * 
 * @param id - ID del reporte
 * @returns Promise con el reporte o null si no existe
 */
export const getReport = async (id: string): Promise<Report | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  const reporte = mockReportsStore.find(r => r.id === id);
  return reporte || null;
};

/**
 * Obtiene el estado de generación de un reporte
 * 
 * Útil para reportes que se generan de forma asíncrona.
 * En producción, consultaría el estado en la base de datos.
 * 
 * @param reportId - ID del reporte
 * @returns Promise con el estado del reporte
 */
export const getReportStatus = async (reportId: string): Promise<ReportStatus> => {
  await new Promise(resolve => setTimeout(resolve, 150));

  const reporte = mockReportsStore.find(r => r.id === reportId);

  if (!reporte) {
    throw new Error(`Reporte con ID ${reportId} no encontrado`);
  }

  return (reporte.estado || reporte.status || ReportStatus.PENDING) as ReportStatus;
};
