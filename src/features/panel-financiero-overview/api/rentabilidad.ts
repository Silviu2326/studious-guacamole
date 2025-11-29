/**
 * API service para Análisis de Rentabilidad
 * 
 * Este módulo proporciona funciones para calcular y obtener análisis de rentabilidad
 * principalmente para gimnasios. Los datos se utilizan en el componente 
 * AnalisisRentabilidad.tsx para mostrar métricas financieras, estado de salud
 * y comentarios sobre la rentabilidad del negocio.
 * 
 * En producción, estas llamadas se harían a un backend real.
 */

import { AnalisisRentabilidad, EstadoSaludFinanciera } from '../types';

const API_BASE_URL = '/api/finanzas';

// Mock delay para simular llamadas API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Obtiene datos mock de ingresos y costes basados en el período
 * En producción, estos datos vendrían de una base de datos real
 */
const obtenerDatosMockPorPeriodo = (mes: number, anio: number): { ingresos: number; costes: number } => {
  // Variación estacional: meses de verano (6-8) tienen mayores ingresos
  const factorEstacional = mes >= 6 && mes <= 8 ? 1.15 : mes >= 12 || mes === 1 ? 1.08 : 1.0;
  
  // Base de ingresos y costes
  const baseIngresos = 150000;
  const baseCostes = 45000;
  
  // Aplicar variación estacional y pequeña variación aleatoria
  const variacionAleatoria = 0.9 + Math.random() * 0.2; // Entre 0.9 y 1.1
  const ingresos = Math.round(baseIngresos * factorEstacional * variacionAleatoria);
  const costes = Math.round(baseCostes * (0.95 + Math.random() * 0.1)); // Costes más estables
  
  return { ingresos, costes };
};

/**
 * Determina el estado de salud financiera basado en el margen porcentual
 */
const determinarEstadoSalud = (margenPorcentual: number): EstadoSaludFinanciera => {
  if (margenPorcentual > 25) {
    return 'saludable';
  } else if (margenPorcentual >= 10) {
    return 'advertencia';
  } else {
    return 'critico';
  }
};

/**
 * Genera un comentario resumen basado en el estado de salud y las métricas
 */
const generarComentarioResumen = (
  estadoSalud: EstadoSaludFinanciera,
  margenPorcentual: number,
  beneficioNeto: number,
  ingresosTotales: number
): string => {
  const nombresMeses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  
  switch (estadoSalud) {
    case 'saludable':
      return `Excelente rendimiento financiero. El margen de rentabilidad del ${margenPorcentual.toFixed(1)}% indica una gestión eficiente de los recursos. El beneficio neto de €${beneficioNeto.toLocaleString()} refleja una operación sólida y sostenible. Se recomienda mantener las estrategias actuales y considerar inversiones para crecimiento.`;
    
    case 'advertencia':
      return `Rentabilidad en rango de advertencia. El margen del ${margenPorcentual.toFixed(1)}% sugiere que es necesario revisar costes operativos o estrategias de ingresos. Con un beneficio neto de €${beneficioNeto.toLocaleString()} sobre ingresos de €${ingresosTotales.toLocaleString()}, se recomienda identificar oportunidades de optimización para mejorar la rentabilidad.`;
    
    case 'critico':
      return `Atención requerida: el margen de rentabilidad del ${margenPorcentual.toFixed(1)}% está por debajo del umbral recomendado. El beneficio neto de €${beneficioNeto.toLocaleString()} indica que se deben implementar medidas inmediatas de control de costes y/o estrategias para aumentar ingresos. Se recomienda un análisis detallado de la estructura de costes.`;
    
    default:
      return `Análisis de rentabilidad completado. Margen: ${margenPorcentual.toFixed(1)}%, Beneficio neto: €${beneficioNeto.toLocaleString()}.`;
  }
};

/**
 * Calcula y obtiene el análisis de rentabilidad para un período específico
 * 
 * Esta función implementa la lógica mock de cálculo de rentabilidad:
 * - Calcula beneficioNeto = ingresosTotales - costesTotales
 * - Calcula margenPorcentual = beneficioNeto / ingresosTotales (maneja caso de ingresosTotales = 0)
 * - Determina estadoSalud en función del margenPorcentual:
 *   * >25%: saludable
 *   * 10-25%: advertencia
 *   * <10%: crítico
 * - Genera un comentarioResumen acorde al estado
 * 
 * Estos datos se utilizan en el componente AnalisisRentabilidad.tsx,
 * principalmente para gimnasios, donde se muestran las métricas financieras,
 * el estado de salud del negocio y recomendaciones.
 * 
 * @param periodo - Objeto con mes (1-12) y año para el cual calcular la rentabilidad
 * @returns Promise con el análisis completo de rentabilidad
 */
export const getAnalisisRentabilidad = async (
  periodo: { mes: number; anio: number }
): Promise<AnalisisRentabilidad> => {
  await delay(600);
  
  // Obtener datos mock de ingresos y costes para el período
  const { ingresos, costes } = obtenerDatosMockPorPeriodo(periodo.mes, periodo.anio);
  
  const ingresosTotales = ingresos;
  const costesTotales = costes;
  
  // Calcular beneficio neto: ingresosTotales - costesTotales
  const beneficioNeto = ingresosTotales - costesTotales;
  
  // Calcular margen porcentual: beneficioNeto / ingresosTotales
  // Manejar el caso cuando ingresosTotales = 0 para evitar división por cero
  const margenPorcentual = ingresosTotales > 0 
    ? (beneficioNeto / ingresosTotales) * 100 
    : 0;
  
  // Determinar estado de salud basado en el margen porcentual
  const estadoSalud = determinarEstadoSalud(margenPorcentual);
  
  // Generar comentario resumen acorde al estado
  const comentarioResumen = generarComentarioResumen(
    estadoSalud,
    margenPorcentual,
    beneficioNeto,
    ingresosTotales
  );
  
  return {
    ingresosTotales,
    costesTotales,
    beneficioNeto,
    margenPorcentual,
    estadoSalud,
    comentarioResumen,
    // Campos legacy para compatibilidad hacia atrás
    margenRentabilidad: margenPorcentual,
    estado: estadoSalud,
  };
};

export const rentabilidadApi = {
  // Obtener análisis de rentabilidad (solo gimnasios)
  // Función legacy - mantiene compatibilidad hacia atrás
  async obtenerAnalisisRentabilidad(): Promise<AnalisisRentabilidad> {
    const fechaActual = new Date();
    return getAnalisisRentabilidad({
      mes: fechaActual.getMonth() + 1,
      anio: fechaActual.getFullYear()
    });
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

