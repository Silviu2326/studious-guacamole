// API service para Reportes Personalizados
// En producción, estas llamadas se harían a un backend real

import { ReportePersonalizado } from '../types';

const API_BASE_URL = '/api/finanzas';

// Mock delay para simular llamadas API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const reportesApi = {
  // Generar reporte personalizado
  async generarReporte(
    rol: 'entrenador' | 'gimnasio',
    tipo: string,
    parametros: Record<string, any>
  ): Promise<ReportePersonalizado> {
    await delay(1000);
    // En producción: POST ${API_BASE_URL}/reportes
    return {
      id: `reporte-${Date.now()}`,
      nombre: `Reporte ${tipo}`,
      tipo,
      datos: {
        rol,
        parametros,
        generado: new Date().toISOString()
      },
      fechaGeneracion: new Date().toISOString()
    };
  },

  // Obtener reportes guardados
  async obtenerReportesGuardados(): Promise<ReportePersonalizado[]> {
    await delay(500);
    // En producción: GET ${API_BASE_URL}/reportes
    return [
      {
        id: '1',
        nombre: 'Resumen Mensual',
        tipo: 'resumen',
        datos: {},
        fechaGeneracion: '2024-10-01T00:00:00Z'
      },
      {
        id: '2',
        nombre: 'Análisis de Ingresos',
        tipo: 'ingresos',
        datos: {},
        fechaGeneracion: '2024-09-15T00:00:00Z'
      }
    ];
  },

  // Eliminar reporte
  async eliminarReporte(id: string): Promise<void> {
    await delay(300);
    // En producción: DELETE ${API_BASE_URL}/reportes/${id}
    // throw new Error('Not implemented');
  },
};

