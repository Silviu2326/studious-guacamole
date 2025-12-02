// API service para Ingresos
// En producción, estas llamadas se harían a un backend real

import { 
  IngresosEntrenador, 
  FacturacionGimnasio, 
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
 * Genera datos mock de ingresos para entrenadores con variación realista
 * Los datos varían según el mes para simular estacionalidad
 */
const generarIngresosEntrenadorMock = (mes: number, anio: number): IngresosEntrenador => {
  // Base de ingresos con variación estacional
  // Los meses de verano (junio-agosto) y enero tienen más ingresos
  const factorEstacional = mes >= 6 && mes <= 8 ? 1.2 : mes === 1 ? 1.15 : mes >= 11 && mes <= 12 ? 1.1 : 0.95;
  
  // Base de ingresos por categoría
  const baseSesiones1a1 = 3000;
  const basePaquetes = 1200;
  const baseConsultasOnline = 400;
  
  // Aplicar variación estacional y pequeña variación aleatoria
  const variacionAleatoria = 0.9 + Math.random() * 0.2; // Entre 0.9 y 1.1
  const sesiones1a1 = Math.round(baseSesiones1a1 * factorEstacional * variacionAleatoria);
  const paquetes = Math.round(basePaquetes * factorEstacional * variacionAleatoria);
  const consultasOnline = Math.round(baseConsultasOnline * factorEstacional * variacionAleatoria);
  const otros = Math.round((sesiones1a1 + paquetes + consultasOnline) * 0.05);
  const total = sesiones1a1 + paquetes + consultasOnline + otros;
  
  return {
    sesiones1a1,
    paquetes,
    consultasOnline,
    otros,
    total,
    periodo: `${obtenerNombreMes(mes)} ${anio}`,
    // Campos legacy para compatibilidad
    paquetesEntrenamiento: paquetes
  };
};

/**
 * Genera datos mock de facturación para gimnasios con variación realista
 * Los datos varían según el mes para simular estacionalidad
 */
const generarFacturacionGimnasioMock = (mes: number, anio: number): FacturacionGimnasio => {
  // Base de facturación con variación estacional
  // Enero y septiembre (vuelta al gimnasio) tienen más ingresos
  const factorEstacional = mes === 1 ? 1.25 : mes === 9 ? 1.2 : mes >= 11 && mes <= 12 ? 1.1 : 0.95;
  
  // Base de facturación por categoría
  const baseCuotasSocios = 120000;
  const baseEntrenamientoPersonal = 30000;
  const baseTienda = 15000;
  const baseServiciosAdicionales = 5000;
  
  // Aplicar variación estacional y pequeña variación aleatoria
  const variacionAleatoria = 0.9 + Math.random() * 0.2; // Entre 0.9 y 1.1
  const cuotasSocios = Math.round(baseCuotasSocios * factorEstacional * variacionAleatoria);
  const entrenamientoPersonal = Math.round(baseEntrenamientoPersonal * factorEstacional * variacionAleatoria);
  const tienda = Math.round(baseTienda * factorEstacional * variacionAleatoria);
  const serviciosAdicionales = Math.round(baseServiciosAdicionales * factorEstacional * variacionAleatoria);
  const otros = Math.round((cuotasSocios + entrenamientoPersonal + tienda + serviciosAdicionales) * 0.03);
  const total = cuotasSocios + entrenamientoPersonal + tienda + serviciosAdicionales + otros;
  
  return {
    cuotasSocios,
    entrenamientoPersonal,
    tienda,
    serviciosAdicionales,
    otros,
    total,
    periodo: `${obtenerNombreMes(mes)} ${anio}`
  };
};

/**
 * Calcula la tendencia financiera basada en la variación porcentual
 */
const calcularTendencia = (variacionPorcentual: number): TendenciaFinanciera => {
  if (variacionPorcentual > 2) return 'up';
  if (variacionPorcentual < -2) return 'down';
  return 'neutral';
};

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

  /**
   * Obtiene los ingresos de un entrenador para un período específico (mes/año)
   * 
   * Esta función alimenta el componente MetricasIngresos.tsx mostrando:
   * - Desglose por categorías: sesiones1a1, paquetes, consultasOnline
   * - Total de ingresos del período
   * - Gráficos de distribución (pie chart) y comparación (bar chart)
   * 
   * @param periodo - Objeto con mes (1-12) y anio
   * @returns Promise con los ingresos desglosados del entrenador
   */
  async getIngresosEntrenador(periodo: { mes: number; anio: number }): Promise<IngresosEntrenador> {
    await delay(500);
    
    // Validar período
    if (periodo.mes < 1 || periodo.mes > 12) {
      throw new Error('El mes debe estar entre 1 y 12');
    }
    
    return generarIngresosEntrenadorMock(periodo.mes, periodo.anio);
  },

  /**
   * Obtiene el histórico de ingresos de un entrenador por meses o semanas
   * 
   * Esta función alimenta los gráficos de tendencia en MetricasIngresos.tsx:
   * - Gráficos de línea mostrando la evolución temporal
   * - Comparativas mes a mes o semana a semana
   * - Cálculo de tendencias (up/down/neutral) basadas en variaciones
   * 
   * @param filtros - Filtros opcionales para el histórico
   * @returns Promise con array de métricas financieras históricas
   */
  async getHistoricoIngresosEntrenador(
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
        
        const ingresosActual = generarIngresosEntrenadorMock(mes, anio);
        // Calcular mes anterior para comparación
        const fechaAnterior = new Date(fecha);
        fechaAnterior.setMonth(fechaAnterior.getMonth() - 1);
        const mesAnterior = fechaAnterior.getMonth() + 1;
        const anioAnterior = fechaAnterior.getFullYear();
        const ingresosAnterior = i > 0 
          ? generarIngresosEntrenadorMock(mesAnterior, anioAnterior)
          : { total: ingresosActual.total * 0.95 }; // Simular mes anterior
        
        const valorActual = ingresosActual.total;
        const valorAnterior = ingresosAnterior.total;
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
          descripcionOpcional: `Ingresos totales del mes`,
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
        
        // Para semanas, usar una fracción mensual con variación
        const ingresosMensuales = generarIngresosEntrenadorMock(mes, anio);
        const factorSemanal = 0.25 + (Math.random() * 0.1); // Entre 0.25 y 0.35 del mes
        const valorActual = Math.round(ingresosMensuales.total * factorSemanal);
        const valorAnterior = i > 0 
          ? Math.round(ingresosMensuales.total * (factorSemanal - 0.02))
          : Math.round(valorActual * 0.95);
        
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
          descripcionOpcional: `Ingresos de la semana`,
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

  /**
   * Obtiene la facturación de un gimnasio para un período específico (mes/año)
   * 
   * Esta función alimenta el componente MetricasIngresos.tsx mostrando:
   * - Desglose por líneas de negocio: cuotasSocios, entrenamientoPersonal (PT), tienda, serviciosAdicionales
   * - Total de facturación del período
   * - Gráficos de distribución (pie chart) y comparación (bar chart)
   * 
   * @param periodo - Objeto con mes (1-12) y anio
   * @returns Promise con la facturación desglosada del gimnasio
   */
  async getFacturacionGimnasio(periodo: { mes: number; anio: number }): Promise<FacturacionGimnasio> {
    await delay(500);
    
    // Validar período
    if (periodo.mes < 1 || periodo.mes > 12) {
      throw new Error('El mes debe estar entre 1 y 12');
    }
    
    return generarFacturacionGimnasioMock(periodo.mes, periodo.anio);
  },

  /**
   * Obtiene el histórico de facturación de un gimnasio por meses o semanas
   * 
   * Esta función alimenta los gráficos de tendencia en MetricasIngresos.tsx:
   * - Gráficos de línea mostrando la evolución temporal de la facturación
   * - Comparativas mes a mes o semana a semana
   * - Cálculo de tendencias (up/down/neutral) basadas en variaciones
   * - Análisis de crecimiento por líneas de negocio
   * 
   * @param filtros - Filtros opcionales para el histórico
   * @returns Promise con array de métricas financieras históricas
   */
  async getHistoricoFacturacionGimnasio(
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
        
        const facturacionActual = generarFacturacionGimnasioMock(mes, anio);
        // Calcular mes anterior para comparación
        const fechaAnterior = new Date(fecha);
        fechaAnterior.setMonth(fechaAnterior.getMonth() - 1);
        const mesAnterior = fechaAnterior.getMonth() + 1;
        const anioAnterior = fechaAnterior.getFullYear();
        const facturacionAnterior = i > 0 
          ? generarFacturacionGimnasioMock(mesAnterior, anioAnterior)
          : { total: facturacionActual.total * 0.95 }; // Simular mes anterior
        
        const valorActual = facturacionActual.total;
        const valorAnterior = facturacionAnterior.total;
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
          descripcionOpcional: `Facturación total del mes`,
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
        
        // Para semanas, usar una fracción mensual con variación
        const facturacionMensual = generarFacturacionGimnasioMock(mes, anio);
        const factorSemanal = 0.25 + (Math.random() * 0.1); // Entre 0.25 y 0.35 del mes
        const valorActual = Math.round(facturacionMensual.total * factorSemanal);
        const valorAnterior = i > 0 
          ? Math.round(facturacionMensual.total * (factorSemanal - 0.02))
          : Math.round(valorActual * 0.95);
        
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
          descripcionOpcional: `Facturación de la semana`,
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

