// API service para Gastos
// En producción, estas llamadas se harían a un backend real

import { CostesEstructurales } from '../types';

const API_BASE_URL = '/api/finanzas';

// Mock delay para simular llamadas API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const gastosApi = {
  // Obtener costes estructurales (solo gimnasios)
  async obtenerCostesEstructurales(): Promise<CostesEstructurales> {
    await delay(500);
    return {
      alquiler: 3500,
      salarios: 24500,
      equipamiento: 3200,
      serviciosBasicos: 1200,
      total: 32400
    };
  },

  // Obtener gastos por categoría
  async obtenerGastosPorCategoria(categoria: string): Promise<number> {
    await delay(400);
    const gastos: Record<string, number> = {
      alquiler: 3500,
      salarios: 24500,
      equipamiento: 3200,
      serviciosBasicos: 1200
    };
    return gastos[categoria] || 0;
  },
};

