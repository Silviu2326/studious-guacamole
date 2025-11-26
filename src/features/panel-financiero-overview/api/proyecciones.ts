// API service para Proyecciones Financieras
// En producción, estas llamadas se harían a un backend real

import { ProyeccionFinanciera } from '../types';

const API_BASE_URL = '/api/finanzas';

// Mock delay para simular llamadas API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const proyeccionesApi = {
  // Obtener proyecciones futuras
  async obtenerProyecciones(
    rol: 'entrenador' | 'gimnasio',
    meses: number = 6
  ): Promise<ProyeccionFinanciera[]> {
    await delay(700);
    const baseIngresos = rol === 'entrenador' ? 5420 : 187500;
    const baseGastos = rol === 'entrenador' ? 0 : 32400;
    const nombresMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const ahora = new Date();
    
    return Array.from({ length: meses }, (_, i) => {
      const indice = (ahora.getMonth() + i + 1) % 12;
      const factorCrecimiento = 1 + i * 0.03; // Crecimiento del 3% por mes
      const variacion = (Math.random() * 0.1 - 0.05); // Variación de ±5%
      const ingresos = baseIngresos * factorCrecimiento * (1 + variacion);
      const gastos = baseGastos * (1 + variacion * 0.5); // Gastos más estables
      return {
        periodo: nombresMeses[indice],
        ingresos: Math.round(ingresos),
        gastos: Math.round(gastos),
        beneficio: Math.round(ingresos - gastos),
        confianza: 75 + Math.random() * 20 // 75-95%
      };
    });
  },

  // Generar proyección personalizada
  async generarProyeccion(
    rol: 'entrenador' | 'gimnasio',
    parametros: Record<string, any>
  ): Promise<ProyeccionFinanciera> {
    await delay(800);
    const baseIngresos = rol === 'entrenador' ? 5420 : 187500;
    const baseGastos = rol === 'entrenador' ? 0 : 32400;
    
    return {
      periodo: parametros.periodo || 'Próximo mes',
      ingresos: baseIngresos,
      gastos: baseGastos,
      beneficio: baseIngresos - baseGastos,
      confianza: 80
    };
  },
};

