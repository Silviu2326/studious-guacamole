// API service para Rendimiento
// En producción, estas llamadas se harían a un backend real

import { RendimientoEntrenador, MetricasFinancieras } from '../types';

const API_BASE_URL = '/api/finanzas';

// Mock delay para simular llamadas API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const rendimientoApi = {
  // Rendimiento mensual para entrenadores
  async obtenerRendimientoEntrenador(): Promise<RendimientoEntrenador> {
    await delay(500);
    return {
      mesActual: 5420,
      mesAnterior: 4680,
      variacion: 15.8,
      tendencia: 'up'
    };
  },

  // Rendimiento mensual para gimnasios
  async obtenerRendimientoGimnasio(): Promise<MetricasFinancieras> {
    await delay(500);
    return {
      total: 187500,
      periodoActual: `${new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}`,
      periodoAnterior: 'Mes anterior',
      variacion: 11.2,
      tendencia: 'up'
    };
  },

  // Comparación con meses anteriores
  async obtenerComparacionMeses(
    rol: 'entrenador' | 'gimnasio',
    meses: number = 6
  ): Promise<Array<{ mes: string; valor: number }>> {
    await delay(600);
    const base = rol === 'entrenador' ? 4680 : 168500;
    const nombresMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const ahora = new Date();
    
    return Array.from({ length: meses }, (_, i) => {
      const indice = (ahora.getMonth() - meses + i + 1 + 12) % 12;
      const factorCrecimiento = 1 + (meses - i - 1) * 0.03;
      return {
        mes: nombresMeses[indice],
        valor: Math.round(base * factorCrecimiento * (0.9 + Math.random() * 0.2))
      };
    });
  },
};

