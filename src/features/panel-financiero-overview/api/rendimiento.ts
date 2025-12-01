// API service para Rendimiento
// En producción, estas llamadas se harían a un backend real

import { RendimientoEntrenador, MetricasFinancieras, RolFinanciero, FiltrosComparativaMensual } from '../types';

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

  /**
   * Obtiene el rendimiento de un entrenador para un período específico
   * 
   * Esta función retorna métricas completas de rendimiento incluyendo:
   * - Ingresos totales del mes
   * - Número de clientes activos
   * - Ticket medio
   * - Variación vs mes anterior
   * 
   * Los datos retornados se utilizan en el componente RendimientoMensual.tsx
   * para visualización en gráficos de barras o líneas.
   * 
   * @param periodo - Objeto con mes (1-12) y año del período a consultar
   * @returns Promise con el rendimiento del entrenador para el período especificado
   */
  async getRendimientoEntrenador(
    periodo: { mes: number; anio: number }
  ): Promise<RendimientoEntrenador> {
    await delay(500);
    
    const ahora = new Date();
    const mesActual = ahora.getMonth() + 1;
    const anioActual = ahora.getFullYear();
    
    // Determinar si es el mes actual o un mes anterior
    const esMesActual = periodo.mes === mesActual && periodo.anio === anioActual;
    
    // Calcular mes anterior
    let mesAnterior = periodo.mes - 1;
    let anioAnterior = periodo.anio;
    if (mesAnterior < 1) {
      mesAnterior = 12;
      anioAnterior -= 1;
    }
    
    // Valores base para el mes solicitado
    const baseIngresos = 4500 + (periodo.mes * 200) + (Math.random() * 1000);
    const baseClientes = 25 + (periodo.mes * 2) + Math.floor(Math.random() * 10);
    
    // Valores del mes anterior para comparación
    const ingresosMesAnterior = baseIngresos * (0.85 + Math.random() * 0.15);
    const clientesMesAnterior = Math.max(1, baseClientes - Math.floor(Math.random() * 5));
    
    const ingresosTotales = Math.round(baseIngresos);
    const numeroClientesActivos = baseClientes;
    const ticketsMedio = Math.round(ingresosTotales / numeroClientesActivos);
    
    const variacionVsMesAnterior = ((ingresosTotales - ingresosMesAnterior) / ingresosMesAnterior) * 100;
    const tendenciaGlobal: 'up' | 'down' | 'neutral' = 
      variacionVsMesAnterior > 2 ? 'up' : 
      variacionVsMesAnterior < -2 ? 'down' : 
      'neutral';
    
    return {
      ingresosTotales,
      numeroClientesActivos,
      ticketsMedio,
      variacionVsMesAnterior: Math.round(variacionVsMesAnterior * 10) / 10,
      tendenciaGlobal,
      mes: periodo.mes,
      anio: periodo.anio,
      // Campos legacy para compatibilidad
      mesActual: ingresosTotales,
      mesAnterior: Math.round(ingresosMesAnterior),
      variacion: Math.round(variacionVsMesAnterior * 10) / 10,
      tendencia: tendenciaGlobal
    };
  },

  /**
   * Obtiene comparativa mensual de métricas financieras
   * 
   * Esta función retorna un array de métricas financieras comparativas que incluyen:
   * - Ingresos (siempre incluido)
   * - Beneficio (solo si rol es 'gimnasio')
   * - Número de clientes activos
   * - Ticket medio
   * 
   * Cada métrica incluye valores del mes actual y anterior, con variaciones
   * absolutas y porcentuales, y tendencia.
   * 
   * Los datos retornados se utilizan en el componente RendimientoMensual.tsx
   * para visualización en gráficos de barras o líneas comparativos.
   * 
   * @param rol - Rol financiero del usuario ('entrenador' o 'gimnasio')
   * @param filtros - Filtros opcionales para personalizar la comparativa
   * @returns Promise con array de métricas financieras comparativas
   */
  async getComparativaMensual(
    rol: RolFinanciero,
    filtros?: FiltrosComparativaMensual
  ): Promise<MetricasFinancieras[]> {
    await delay(600);
    
    const ahora = new Date();
    const mesActual = filtros?.mesInicio || ahora.getMonth() + 1;
    const anioActual = filtros?.anioInicio || ahora.getFullYear();
    const cantidadMeses = filtros?.cantidadMeses || 2;
    
    // Calcular mes anterior
    let mesAnterior = mesActual - 1;
    let anioAnterior = anioActual;
    if (mesAnterior < 1) {
      mesAnterior = 12;
      anioAnterior -= 1;
    }
    
    // Valores base según el rol
    const baseIngresos = rol === 'entrenador' ? 5420 : 187500;
    const baseIngresosAnterior = baseIngresos * (0.85 + Math.random() * 0.1);
    const baseClientes = rol === 'entrenador' ? 28 : 450;
    const baseClientesAnterior = baseClientes * (0.9 + Math.random() * 0.1);
    
    // Calcular ticket medio
    const ticketMedioActual = Math.round(baseIngresos / baseClientes);
    const ticketMedioAnterior = Math.round(baseIngresosAnterior / baseClientesAnterior);
    
    // Calcular beneficio (solo para gimnasio)
    const costesActuales = rol === 'gimnasio' ? baseIngresos * 0.65 : 0;
    const costesAnteriores = rol === 'gimnasio' ? baseIngresosAnterior * 0.68 : 0;
    const beneficioActual = rol === 'gimnasio' ? baseIngresos - costesActuales : 0;
    const beneficioAnterior = rol === 'gimnasio' ? baseIngresosAnterior - costesAnteriores : 0;
    
    const metricas: MetricasFinancieras[] = [
      // Métrica: Ingresos
      {
        valorActual: Math.round(baseIngresos),
        valorAnterior: Math.round(baseIngresosAnterior),
        variacionAbsoluta: Math.round(baseIngresos - baseIngresosAnterior),
        variacionPorcentual: Math.round(((baseIngresos - baseIngresosAnterior) / baseIngresosAnterior) * 100 * 10) / 10,
        tendencia: baseIngresos > baseIngresosAnterior ? 'up' : baseIngresos < baseIngresosAnterior ? 'down' : 'neutral',
        etiqueta: 'Ingresos',
        descripcionOpcional: 'Ingresos totales del período'
      },
      // Métrica: Beneficio (solo para gimnasio)
      ...(rol === 'gimnasio' ? [{
        valorActual: Math.round(beneficioActual),
        valorAnterior: Math.round(beneficioAnterior),
        variacionAbsoluta: Math.round(beneficioActual - beneficioAnterior),
        variacionPorcentual: Math.round(((beneficioActual - beneficioAnterior) / beneficioAnterior) * 100 * 10) / 10,
        tendencia: beneficioActual > beneficioAnterior ? 'up' : beneficioActual < beneficioAnterior ? 'down' : 'neutral',
        etiqueta: 'Beneficio',
        descripcionOpcional: 'Beneficio neto (ingresos - costes)'
      } as MetricasFinancieras] : []),
      // Métrica: Número de clientes activos
      {
        valorActual: Math.round(baseClientes),
        valorAnterior: Math.round(baseClientesAnterior),
        variacionAbsoluta: Math.round(baseClientes - baseClientesAnterior),
        variacionPorcentual: Math.round(((baseClientes - baseClientesAnterior) / baseClientesAnterior) * 100 * 10) / 10,
        tendencia: baseClientes > baseClientesAnterior ? 'up' : baseClientes < baseClientesAnterior ? 'down' : 'neutral',
        etiqueta: 'Clientes Activos',
        descripcionOpcional: 'Número total de clientes activos'
      },
      // Métrica: Ticket medio
      {
        valorActual: ticketMedioActual,
        valorAnterior: ticketMedioAnterior,
        variacionAbsoluta: ticketMedioActual - ticketMedioAnterior,
        variacionPorcentual: Math.round(((ticketMedioActual - ticketMedioAnterior) / ticketMedioAnterior) * 100 * 10) / 10,
        tendencia: ticketMedioActual > ticketMedioAnterior ? 'up' : ticketMedioActual < ticketMedioAnterior ? 'down' : 'neutral',
        etiqueta: 'Ticket Medio',
        descripcionOpcional: 'Ingresos promedio por cliente'
      }
    ];
    
    return metricas;
  },

  /**
   * Obtiene datos de evolución mensual para gráficos
   * 
   * Esta función retorna datos mensuales de ingresos y beneficio (si aplica)
   * para visualización en gráficos de evolución temporal.
   * 
   * Utilizado en RendimientoMensual.tsx para mostrar la evolución en gráficos
   * de barras o líneas.
   * 
   * @param rol - Rol financiero del usuario ('entrenador' o 'gimnasio')
   * @param filtros - Filtros opcionales para personalizar el período
   * @returns Promise con array de datos mensuales para el gráfico
   */
  async getEvolucionMensual(
    rol: RolFinanciero,
    filtros?: FiltrosComparativaMensual
  ): Promise<Array<{ mes: string; ingresos: number; beneficio?: number }>> {
    await delay(600);
    
    const ahora = new Date();
    const cantidadMeses = filtros?.cantidadMeses || 6;
    const nombresMeses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    const base = rol === 'entrenador' ? 4500 : 168500;
    const baseBeneficio = rol === 'gimnasio' ? base * 0.35 : undefined;
    
    return Array.from({ length: cantidadMeses }, (_, i) => {
      const mesIndex = (ahora.getMonth() - cantidadMeses + i + 1 + 12) % 12;
      const factorCrecimiento = 1 + (cantidadMeses - i - 1) * 0.03;
      const ingresos = Math.round(base * factorCrecimiento * (0.9 + Math.random() * 0.2));
      const beneficio = baseBeneficio ? Math.round(baseBeneficio * factorCrecimiento * (0.9 + Math.random() * 0.2)) : undefined;
      
      return {
        mes: nombresMeses[mesIndex],
        ingresos,
        ...(beneficio !== undefined && { beneficio })
      };
    });
  },
};

