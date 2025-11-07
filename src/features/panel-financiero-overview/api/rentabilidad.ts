// API service para Análisis de Rentabilidad
// En producción, estas llamadas se harían a un backend real

import { AnalisisRentabilidad } from '../types';

const API_BASE_URL = '/api/finanzas';

// Mock delay para simular llamadas API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const rentabilidadApi = {
  // Obtener análisis de rentabilidad (solo gimnasios)
  async obtenerAnalisisRentabilidad(): Promise<AnalisisRentabilidad> {
    await delay(600);
    return {
      ingresosTotales: 187500,
      costesTotales: 32400,
      beneficioNeto: 155100,
      margenRentabilidad: 82.72,
      estado: 'saludable'
    };
  },

  // Obtener rentabilidad por línea de negocio
  async obtenerRentabilidadPorLinea(linea: string): Promise<number> {
    await delay(400);
    const rentabilidades: Record<string, number> = {
      cuotas: 88,
      entrenamientoPersonal: 78,
      tienda: 42,
      serviciosAdicionales: 65
    };
    return rentabilidades[linea] || 0;
  },
};

