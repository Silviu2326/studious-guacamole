// API service para Ingresos
// En producción, estas llamadas se harían a un backend real

import { IngresosEntrenador, FacturacionGimnasio } from '../types';

const API_BASE_URL = '/api/finanzas';

// Mock delay para simular llamadas API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const ingresosApi = {
  // Ingresos detallados para entrenadores
  async obtenerIngresosDetalladosEntrenador(): Promise<IngresosEntrenador> {
    await delay(500);
    return {
      sesiones1a1: 3420,
      paquetesEntrenamiento: 1500,
      consultasOnline: 500,
      total: 5420
    };
  },

  // Facturación detallada para gimnasios
  async obtenerFacturacionDetalladaGimnasio(): Promise<FacturacionGimnasio> {
    await delay(500);
    return {
      total: 187500,
      cuotasSocios: 128000,
      entrenamientoPersonal: 35000,
      tienda: 18500,
      serviciosAdicionales: 6000
    };
  },

  // Obtener ingresos por período
  async obtenerIngresosPorPeriodo(
    rol: 'entrenador' | 'gimnasio',
    periodo: string
  ): Promise<number> {
    await delay(400);
    return rol === 'entrenador' ? 5420 : 187500;
  },
};

