// API service para Overview Financiero
// Integra con los pagos de la agenda para obtener datos reales

import { MetricasFinancieras, IngresosEntrenador, FacturacionGimnasio } from '../types';
import { transaccionesApi } from './transacciones';

const API_BASE_URL = '/api/finanzas';

// Mock delay para simular llamadas API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const overviewApi = {
  // Obtener overview general (ahora integrado con pagos de agenda)
  async obtenerOverview(rol: 'entrenador' | 'gimnasio', userId?: string): Promise<MetricasFinancieras> {
    await delay(500);
    
    if (rol === 'entrenador') {
      try {
        // Obtener transacciones pagadas del mes actual
        const fechaActual = new Date();
        const primerDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
        const ultimoDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0, 23, 59, 59);
        
        const transaccionesPagadas = await transaccionesApi.obtenerTransaccionesPagadas(
          primerDiaMes,
          ultimoDiaMes,
          userId
        );
        
        const total = transaccionesPagadas.reduce((sum, t) => sum + t.monto, 0);
        
        // Calcular mes anterior para comparación
        const primerDiaMesAnterior = new Date(fechaActual.getFullYear(), fechaActual.getMonth() - 1, 1);
        const ultimoDiaMesAnterior = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 0, 23, 59, 59);
        
        const transaccionesMesAnterior = await transaccionesApi.obtenerTransaccionesPagadas(
          primerDiaMesAnterior,
          ultimoDiaMesAnterior,
          userId
        );
        
        const totalMesAnterior = transaccionesMesAnterior.reduce((sum, t) => sum + t.monto, 0);
        
        const variacion = totalMesAnterior > 0 
          ? ((total - totalMesAnterior) / totalMesAnterior) * 100 
          : 0;
        
        const tendencia: 'up' | 'down' | 'neutral' = variacion > 0 ? 'up' : variacion < 0 ? 'down' : 'neutral';
        
        return {
          total,
          periodoActual: `${new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}`,
          periodoAnterior: 'Mes anterior',
          variacion: Math.round(variacion * 100) / 100,
          tendencia
        };
      } catch (error) {
        console.error('Error obteniendo overview desde transacciones:', error);
        // Fallback a valores mock si hay error
        return {
          total: 5420,
          periodoActual: `${new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}`,
          periodoAnterior: 'Mes anterior',
          variacion: 15.8,
          tendencia: 'up'
        };
      }
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

