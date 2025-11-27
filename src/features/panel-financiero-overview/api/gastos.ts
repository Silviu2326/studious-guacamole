// API service para Gastos
// En producción, estas llamadas se harían a un backend real

import { 
  CostesEstructurales, 
  MetricasFinancieras, 
  TendenciaFinanciera,
  FiltrosHistoricoIngresos 
} from '../types';

const API_BASE_URL = '/api/finanzas';

// Mock delay para simular llamadas API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Obtiene el nombre del mes en español
 */
const obtenerNombreMes = (mes: number): string => {
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return meses[mes - 1] || '';
};

/**
 * Calcula la tendencia financiera basada en la variación porcentual
 */
const calcularTendencia = (variacionPorcentual: number): TendenciaFinanciera => {
  if (variacionPorcentual > 2) return 'up';
  if (variacionPorcentual < -2) return 'down';
  return 'neutral';
};

/**
 * Genera datos mock de costes estructurales con variación realista
 * Los costes estructurales son relativamente estables pero pueden tener pequeñas variaciones
 * según el mes (ej: servicios básicos más altos en verano/invierno)
 */
const generarCostesEstructuralesMock = (mes: number, anio: number): CostesEstructurales => {
  // Los costes estructurales son más estables que los ingresos
  // Pequeña variación estacional en servicios básicos (climatización)
  const factorServiciosBasicos = (mes >= 6 && mes <= 8) || (mes >= 12 || mes <= 2) ? 1.1 : 1.0;
  
  // Base de costes estructurales (valores típicos de un gimnasio)
  const baseAlquiler = 3500;
  const baseSalarios = 24500;
  const baseEquipamiento = 3200;
  const baseServiciosBasicos = 1200;
  
  // Aplicar pequeña variación aleatoria (costes son más estables)
  const variacionAleatoria = 0.98 + Math.random() * 0.04; // Entre 0.98 y 1.02
  const alquiler = Math.round(baseAlquiler * variacionAleatoria);
  const salarios = Math.round(baseSalarios * variacionAleatoria);
  const equipamiento = Math.round(baseEquipamiento * variacionAleatoria);
  const serviciosBasicos = Math.round(baseServiciosBasicos * factorServiciosBasicos * variacionAleatoria);
  const otros = Math.round((alquiler + salarios + equipamiento + serviciosBasicos) * 0.05);
  const total = alquiler + salarios + equipamiento + serviciosBasicos + otros;
  
  return {
    alquiler,
    salarios,
    equipamiento,
    serviciosBasicos,
    otros,
    total,
    periodo: `${obtenerNombreMes(mes)} ${anio}`
  };
};

export const gastosApi = {
  // Obtener costes estructurales (solo gimnasios)
  async obtenerCostesEstructurales(): Promise<CostesEstructurales> {
    await delay(500);
    return {
      alquiler: 3500,
      salarios: 24500,
      equipamiento: 3200,
      serviciosBasicos: 1200,
      otros: 1620,
      total: 32400,
      periodo: `${obtenerNombreMes(new Date().getMonth() + 1)} ${new Date().getFullYear()}`
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

  /**
   * Obtiene los costes estructurales de un gimnasio para un período específico (mes/año)
   * 
   * Esta función alimenta el componente de Costes Estructurales mostrando:
   * - Desglose por categorías: alquiler, salarios, equipamiento, serviciosBasicos, otros
   * - Total de costes estructurales del período
   * - Gráficos de distribución (pie chart) y comparación (bar chart)
   * 
   * Nota: Estos datos se usan principalmente para el rol "gimnasio" en el tab de Costes Estructurales.
   * 
   * @param periodo - Objeto con mes (1-12) y anio
   * @returns Promise con los costes estructurales desglosados del gimnasio
   */
  async getCostesEstructurales(periodo: { mes: number; anio: number }): Promise<CostesEstructurales> {
    await delay(500);
    
    // Validar período
    if (periodo.mes < 1 || periodo.mes > 12) {
      throw new Error('El mes debe estar entre 1 y 12');
    }
    
    return generarCostesEstructuralesMock(periodo.mes, periodo.anio);
  },

  /**
   * Obtiene el histórico de costes estructurales de un gimnasio por meses o semanas
   * 
   * Esta función alimenta los gráficos de tendencia en el componente de Costes Estructurales:
   * - Gráficos de línea mostrando la evolución temporal de los costes
   * - Comparativas mes a mes o semana a semana
   * - Cálculo de tendencias (up/down/neutral) basadas en variaciones
   * - Análisis de evolución de costes por categoría
   * 
   * Nota: Estos datos se usan principalmente para el rol "gimnasio" en el tab de Costes Estructurales.
   * 
   * @param filtros - Filtros opcionales para el histórico
   * @returns Promise con array de métricas financieras históricas
   */
  async getHistoricoCostesEstructurales(
    filtros?: FiltrosHistoricoIngresos
  ): Promise<MetricasFinancieras[]> {
    await delay(600);
    
    const tipoPeriodo = filtros?.tipoPeriodo || 'meses';
    const cantidadPeriodos = filtros?.cantidadPeriodos || 12;
    const ahora = new Date();
    
    const metricas: MetricasFinancieras[] = [];
    
    if (tipoPeriodo === 'meses') {
      // Generar datos mensuales
      for (let i = cantidadPeriodos - 1; i >= 0; i--) {
        const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
        const mes = fecha.getMonth() + 1;
        const anio = fecha.getFullYear();
        
        // Aplicar filtros de fecha si existen
        if (filtros?.fechaInicio && fecha < filtros.fechaInicio) continue;
        if (filtros?.fechaFin && fecha > filtros.fechaFin) continue;
        
        const costesActual = generarCostesEstructuralesMock(mes, anio);
        // Calcular mes anterior para comparación
        const fechaAnterior = new Date(fecha);
        fechaAnterior.setMonth(fechaAnterior.getMonth() - 1);
        const mesAnterior = fechaAnterior.getMonth() + 1;
        const anioAnterior = fechaAnterior.getFullYear();
        const costesAnterior = i > 0 
          ? generarCostesEstructuralesMock(mesAnterior, anioAnterior)
          : { total: costesActual.total * 0.99 }; // Simular mes anterior (costes más estables)
        
        const valorActual = costesActual.total;
        const valorAnterior = costesAnterior.total;
        const variacionAbsoluta = valorActual - valorAnterior;
        const variacionPorcentual = valorAnterior > 0 
          ? (variacionAbsoluta / valorAnterior) * 100 
          : 0;
        
        metricas.push({
          valorActual,
          valorAnterior,
          variacionAbsoluta,
          variacionPorcentual: Math.round(variacionPorcentual * 100) / 100,
          tendencia: calcularTendencia(variacionPorcentual),
          etiqueta: `${obtenerNombreMes(mes)} ${anio}`,
          descripcionOpcional: `Costes estructurales totales del mes`,
          // Campos legacy para compatibilidad
          total: valorActual,
          periodoActual: `${obtenerNombreMes(mes)} ${anio}`,
          periodoAnterior: i > 0 ? `${obtenerNombreMes(mesAnterior)} ${anioAnterior}` : 'N/A',
          variacion: variacionPorcentual
        });
      }
    } else {
      // Generar datos semanales
      const semanas = cantidadPeriodos;
      for (let i = semanas - 1; i >= 0; i--) {
        const fecha = new Date(ahora);
        fecha.setDate(fecha.getDate() - (i * 7));
        
        // Aplicar filtros de fecha si existen
        if (filtros?.fechaInicio && fecha < filtros.fechaInicio) continue;
        if (filtros?.fechaFin && fecha > filtros.fechaFin) continue;
        
        const mes = fecha.getMonth() + 1;
        const anio = fecha.getFullYear();
        
        // Para semanas, usar una fracción mensual con variación mínima (costes son más estables)
        const costesMensuales = generarCostesEstructuralesMock(mes, anio);
        const factorSemanal = 0.25; // Aproximadamente 1/4 del mes
        const valorActual = Math.round(costesMensuales.total * factorSemanal);
        const valorAnterior = i > 0 
          ? Math.round(costesMensuales.total * factorSemanal)
          : Math.round(valorActual * 0.99);
        
        const variacionAbsoluta = valorActual - valorAnterior;
        const variacionPorcentual = valorAnterior > 0 
          ? (variacionAbsoluta / valorAnterior) * 100 
          : 0;
        
        const semanaNum = Math.ceil(fecha.getDate() / 7);
        metricas.push({
          valorActual,
          valorAnterior,
          variacionAbsoluta,
          variacionPorcentual: Math.round(variacionPorcentual * 100) / 100,
          tendencia: calcularTendencia(variacionPorcentual),
          etiqueta: `Semana ${semanaNum} - ${obtenerNombreMes(mes)} ${anio}`,
          descripcionOpcional: `Costes estructurales de la semana`,
          // Campos legacy para compatibilidad
          total: valorActual,
          periodoActual: `Semana ${semanaNum} - ${obtenerNombreMes(mes)} ${anio}`,
          periodoAnterior: i > 0 ? `Semana anterior` : 'N/A',
          variacion: variacionPorcentual
        });
      }
    }
    
    return metricas;
  },
};

