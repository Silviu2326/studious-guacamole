// API service para Overview Financiero
// En producción, estas llamadas se harían a un backend real

import { MetricasFinancieras, IngresosEntrenador, FacturacionGimnasio } from '../types';

const API_BASE_URL = '/api/finanzas';

// Mock delay para simular llamadas API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const overviewApi = {
  // Obtener overview general
  async obtenerOverview(rol: 'entrenador' | 'gimnasio'): Promise<MetricasFinancieras> {
    await delay(500);
    
    if (rol === 'entrenador') {
      return {
        total: 5420,
        periodoActual: `${new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}`,
        periodoAnterior: 'Mes anterior',
        variacion: 15.8,
        tendencia: 'up'
      };
    } else {
      return {
        total: 187500,
        periodoActual: `${new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}`,
        periodoAnterior: 'Mes anterior',
        variacion: 11.2,
        tendencia: 'up'
      };
    }
  },

  // Obtener ingresos de entrenador
  async obtenerIngresosEntrenador(): Promise<IngresosEntrenador> {
    await delay(500);
    return {
      sesiones1a1: 3420,
      paquetesEntrenamiento: 1500,
      consultasOnline: 500,
      total: 5420
    };
  },

  // Obtener facturación de gimnasio
  async obtenerFacturacionGimnasio(): Promise<FacturacionGimnasio> {
    await delay(500);
    return {
      total: 187500,
      cuotasSocios: 128000,
      entrenamientoPersonal: 35000,
      tienda: 18500,
      serviciosAdicionales: 6000
    };
  },
};

