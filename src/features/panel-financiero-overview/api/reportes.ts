/**
 * API service para Reportes Personalizados
 * 
 * NOTA: Este es un servicio mock que simula la generación y listado de reportes financieros.
 * En un entorno real, estas funciones se conectarían a un servicio backend que:
 * - Generaría reportes en formato PDF/Excel usando bibliotecas como jsPDF, ExcelJS, o servicios cloud
 * - Almacenaría los reportes generados en un sistema de almacenamiento (S3, Google Cloud Storage, etc.)
 * - Proporcionaría URLs de descarga reales para los archivos generados
 * 
 * Los datos mock generados por estas funciones son utilizados en el componente
 * ReportesPersonalizados.tsx para mostrar la lista de reportes y permitir su descarga.
 */

import { 
  ReportePersonalizado, 
  ConfigGeneracionReporte, 
  FiltrosReportesGenerados,
  FormatoReporte 
} from '../types';

const API_BASE_URL = '/api/finanzas';

// Mock delay para simular llamadas API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Almacenamiento mock en memoria para simular persistencia de reportes
let reportesMockStorage: ReportePersonalizado[] = [
  {
    id: '1',
    nombre: 'Resumen Mensual Octubre 2024',
    tipo: 'entrenador',
    filtrosAplicados: { tipoReporte: 'resumen', periodo: '2024-10' },
    generadoEn: '2024-10-01T10:30:00Z',
    formato: 'PDF',
    urlDescargaMock: '/mock-downloads/reporte-1.pdf',
    fechaGeneracion: '2024-10-01T10:30:00Z'
  },
  {
    id: '2',
    nombre: 'Análisis de Ingresos Q3 2024',
    tipo: 'gimnasio',
    filtrosAplicados: { tipoReporte: 'ingresos', periodo: '2024-Q3' },
    generadoEn: '2024-09-15T14:20:00Z',
    formato: 'Excel',
    urlDescargaMock: '/mock-downloads/reporte-2.xlsx',
    fechaGeneracion: '2024-09-15T14:20:00Z'
  },
  {
    id: '3',
    nombre: 'Rendimiento Mensual Septiembre',
    tipo: 'entrenador',
    filtrosAplicados: { tipoReporte: 'rendimiento', mes: 9, anio: 2024 },
    generadoEn: '2024-09-30T16:45:00Z',
    formato: 'PDF',
    urlDescargaMock: '/mock-downloads/reporte-3.pdf',
    fechaGeneracion: '2024-09-30T16:45:00Z'
  }
];

/**
 * Genera un reporte financiero personalizado
 * 
 * En producción, esta función:
 * - Se conectaría a un servicio backend que procesaría la configuración
 * - Generaría el reporte en el formato solicitado (PDF/Excel/CSV) usando bibliotecas especializadas
 * - Almacenaría el archivo generado en un sistema de almacenamiento cloud
 * - Retornaría una URL real de descarga del archivo
 * 
 * @param config - Configuración del reporte a generar
 * @returns Promise con el reporte generado incluyendo urlDescargaMock
 */
export async function generarReporteFinanciero(
  config: ConfigGeneracionReporte
): Promise<ReportePersonalizado> {
  await delay(1500); // Simula tiempo de procesamiento de generación
  
  // En producción: POST ${API_BASE_URL}/reportes/generar
  // const response = await fetch(`${API_BASE_URL}/reportes/generar`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(config)
  // });
  // return await response.json();

  const reporteId = `reporte-${Date.now()}`;
  const formato = config.formato || 'PDF';
  const extension = formato === 'Excel' ? 'xlsx' : formato === 'CSV' ? 'csv' : 'pdf';
  
  const nuevoReporte: ReportePersonalizado = {
    id: reporteId,
    nombre: config.nombre,
    tipo: config.rol,
    filtrosAplicados: {
      tipoReporte: config.tipoReporte,
      descripcion: config.descripcion,
      ...config.filtrosAdicionales
    },
    generadoEn: new Date().toISOString(),
    formato: formato as FormatoReporte,
    urlDescargaMock: `/mock-downloads/${reporteId}.${extension}`,
    // Campos legacy para compatibilidad
    fechaGeneracion: new Date().toISOString(),
    datos: {
      rol: config.rol,
      tipoReporte: config.tipoReporte,
      nombre: config.nombre,
      descripcion: config.descripcion
    }
  };

  // Agregar a almacenamiento mock
  reportesMockStorage.unshift(nuevoReporte);
  
  return nuevoReporte;
}

/**
 * Obtiene la lista de reportes generados aplicando filtros opcionales
 * 
 * En producción, esta función:
 * - Se conectaría a un servicio backend que consultaría una base de datos
 * - Aplicaría los filtros proporcionados en la consulta
 * - Retornaría los reportes ordenados por fecha de generación (más recientes primero)
 * 
 * Los datos retornados son utilizados en el componente ReportesPersonalizados.tsx
 * para mostrar la tabla de reportes disponibles.
 * 
 * @param filtros - Filtros opcionales para filtrar los reportes
 * @returns Promise con array de reportes personalizados
 */
export async function getReportesGenerados(
  filtros?: FiltrosReportesGenerados
): Promise<ReportePersonalizado[]> {
  await delay(800); // Simula tiempo de consulta
  
  // En producción: GET ${API_BASE_URL}/reportes?filtros...
  // const queryParams = new URLSearchParams();
  // if (filtros?.rol) queryParams.append('rol', filtros.rol);
  // if (filtros?.tipoReporte) queryParams.append('tipoReporte', filtros.tipoReporte);
  // if (filtros?.formato) queryParams.append('formato', filtros.formato);
  // if (filtros?.fechaGeneracionDesde) queryParams.append('fechaDesde', filtros.fechaGeneracionDesde);
  // if (filtros?.fechaGeneracionHasta) queryParams.append('fechaHasta', filtros.fechaGeneracionHasta);
  // if (filtros?.nombre) queryParams.append('nombre', filtros.nombre);
  // 
  // const response = await fetch(`${API_BASE_URL}/reportes?${queryParams.toString()}`);
  // return await response.json();

  let reportesFiltrados = [...reportesMockStorage];

  // Aplicar filtros
  if (filtros) {
    if (filtros.rol) {
      reportesFiltrados = reportesFiltrados.filter(r => r.tipo === filtros.rol);
    }
    
    if (filtros.tipoReporte) {
      reportesFiltrados = reportesFiltrados.filter(
        r => r.filtrosAplicados?.tipoReporte === filtros.tipoReporte
      );
    }
    
    if (filtros.formato) {
      reportesFiltrados = reportesFiltrados.filter(r => r.formato === filtros.formato);
    }
    
    if (filtros.fechaGeneracionDesde) {
      const fechaDesde = new Date(filtros.fechaGeneracionDesde);
      reportesFiltrados = reportesFiltrados.filter(
        r => new Date(r.generadoEn || r.fechaGeneracion || '') >= fechaDesde
      );
    }
    
    if (filtros.fechaGeneracionHasta) {
      const fechaHasta = new Date(filtros.fechaGeneracionHasta);
      reportesFiltrados = reportesFiltrados.filter(
        r => new Date(r.generadoEn || r.fechaGeneracion || '') <= fechaHasta
      );
    }
    
    if (filtros.nombre) {
      const nombreBusqueda = filtros.nombre.toLowerCase();
      reportesFiltrados = reportesFiltrados.filter(
        r => r.nombre.toLowerCase().includes(nombreBusqueda)
      );
    }
  }

  // Ordenar por fecha de generación (más recientes primero)
  reportesFiltrados.sort((a, b) => {
    const fechaA = new Date(a.generadoEn || a.fechaGeneracion || '').getTime();
    const fechaB = new Date(b.generadoEn || b.fechaGeneracion || '').getTime();
    return fechaB - fechaA;
  });

  return reportesFiltrados;
}

// Exportar objeto de compatibilidad con código existente
export const reportesApi = {
  // Generar reporte personalizado (método legacy - mantiene compatibilidad)
  async generarReporte(
    rol: 'entrenador' | 'gimnasio',
    tipo: string,
    parametros: Record<string, any>
  ): Promise<ReportePersonalizado> {
    return generarReporteFinanciero({
      rol,
      tipoReporte: tipo,
      nombre: parametros.nombre || `Reporte ${tipo}`,
      descripcion: parametros.descripcion,
      formato: 'PDF'
    });
  },

  // Obtener reportes guardados (método legacy - mantiene compatibilidad)
  async obtenerReportesGuardados(): Promise<ReportePersonalizado[]> {
    return getReportesGenerados();
  },

  // Eliminar reporte
  async eliminarReporte(id: string): Promise<void> {
    await delay(300);
    // En producción: DELETE ${API_BASE_URL}/reportes/${id}
    reportesMockStorage = reportesMockStorage.filter(r => r.id !== id);
  },
};

