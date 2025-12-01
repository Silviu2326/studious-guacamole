// API service para Overview Financiero
// En producción, estas llamadas se harían a un backend real

import { MetricasFinancieras, IngresosEntrenador, FacturacionGimnasio, RolFinanciero, TendenciaFinanciera } from '../types';

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

/**
 * Obtiene el resumen financiero general con métricas clave adaptadas al rol
 * 
 * @param rol - Rol financiero del usuario ('entrenador' | 'gimnasio')
 * @returns Promise con array de métricas financieras (4-6 tarjetas clave)
 * 
 * @remarks
 * En producción, esta función realizaría una llamada GET a:
 * - Entrenador: GET /api/finanzas/overview/entrenador/metricas
 * - Gimnasio: GET /api/finanzas/overview/gimnasio/metricas
 */
export async function getResumenFinancieroGeneral(rol: RolFinanciero): Promise<MetricasFinancieras[]> {
  await delay(600);
  
  const ahora = new Date();
  const mesAnterior = new Date(ahora.getFullYear(), ahora.getMonth() - 1);
  const periodoActual = ahora.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  const periodoAnterior = mesAnterior.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  
  if (rol === 'entrenador') {
    // Métricas enfocadas en ingresos personales del entrenador
    return [
      {
        valorActual: 5420,
        valorAnterior: 4680,
        variacionAbsoluta: 740,
        variacionPorcentual: 15.8,
        tendencia: 'up' as TendenciaFinanciera,
        etiqueta: 'Ingresos Totales',
        descripcionOpcional: `Total de ingresos del ${periodoActual.toLowerCase()}`,
        periodoActual,
        periodoAnterior
      },
      {
        valorActual: 3420,
        valorAnterior: 3100,
        variacionAbsoluta: 320,
        variacionPorcentual: 10.3,
        tendencia: 'up' as TendenciaFinanciera,
        etiqueta: 'Sesiones 1 a 1',
        descripcionOpcional: 'Ingresos por entrenamiento personalizado'
      },
      {
        valorActual: 180.67,
        valorAnterior: 156.00,
        variacionAbsoluta: 24.67,
        variacionPorcentual: 15.8,
        tendencia: 'up' as TendenciaFinanciera,
        etiqueta: 'Ticket Medio',
        descripcionOpcional: 'Ingreso promedio por cliente'
      },
      {
        valorActual: 28,
        valorAnterior: 25,
        variacionAbsoluta: 3,
        variacionPorcentual: 12.0,
        tendencia: 'up' as TendenciaFinanciera,
        etiqueta: 'Clientes Activos',
        descripcionOpcional: 'Número de clientes con actividad este mes'
      },
      {
        valorActual: 36,
        valorAnterior: 34,
        variacionAbsoluta: 2,
        variacionPorcentual: 5.9,
        tendencia: 'up' as TendenciaFinanciera,
        etiqueta: 'Sesiones Realizadas',
        descripcionOpcional: 'Total de sesiones completadas'
      },
      {
        valorActual: 150.56,
        valorAnterior: 137.65,
        variacionAbsoluta: 12.91,
        variacionPorcentual: 9.4,
        tendencia: 'up' as TendenciaFinanciera,
        etiqueta: 'Ingreso Promedio por Sesión',
        descripcionOpcional: 'Ingreso promedio por sesión individual'
      }
    ];
  } else {
    // Métricas enfocadas en facturación total, margen y costes del gimnasio
    const ingresosTotales = 187500;
    const ingresosAnteriores = 168750;
    const costesTotales = 124500;
    const costesAnteriores = 115200;
    const beneficioNeto = ingresosTotales - costesTotales;
    const beneficioAnterior = ingresosAnteriores - costesAnteriores;
    const margen = (beneficioNeto / ingresosTotales) * 100;
    const margenAnterior = (beneficioAnterior / ingresosAnteriores) * 100;
    
    return [
      {
        valorActual: ingresosTotales,
        valorAnterior: ingresosAnteriores,
        variacionAbsoluta: ingresosTotales - ingresosAnteriores,
        variacionPorcentual: ((ingresosTotales - ingresosAnteriores) / ingresosAnteriores) * 100,
        tendencia: 'up' as TendenciaFinanciera,
        etiqueta: 'Facturación Total',
        descripcionOpcional: `Total facturado en ${periodoActual.toLowerCase()}`,
        periodoActual,
        periodoAnterior
      },
      {
        valorActual: beneficioNeto,
        valorAnterior: beneficioAnterior,
        variacionAbsoluta: beneficioNeto - beneficioAnterior,
        variacionPorcentual: ((beneficioNeto - beneficioAnterior) / beneficioAnterior) * 100,
        tendencia: 'up' as TendenciaFinanciera,
        etiqueta: 'Beneficio Neto',
        descripcionOpcional: 'Ingresos menos costes totales'
      },
      {
        valorActual: margen,
        valorAnterior: margenAnterior,
        variacionAbsoluta: margen - margenAnterior,
        variacionPorcentual: ((margen - margenAnterior) / margenAnterior) * 100,
        tendencia: margen >= margenAnterior ? 'up' as TendenciaFinanciera : 'down' as TendenciaFinanciera,
        etiqueta: 'Margen de Rentabilidad',
        descripcionOpcional: 'Porcentaje de beneficio sobre ingresos'
      },
      {
        valorActual: 156.25,
        valorAnterior: 146.25,
        variacionAbsoluta: 10.00,
        variacionPorcentual: 6.8,
        tendencia: 'up' as TendenciaFinanciera,
        etiqueta: 'Ticket Medio',
        descripcionOpcional: 'Ingreso promedio por socio/cliente'
      },
      {
        valorActual: costesTotales,
        valorAnterior: costesAnteriores,
        variacionAbsoluta: costesTotales - costesAnteriores,
        variacionPorcentual: ((costesTotales - costesAnteriores) / costesAnteriores) * 100,
        tendencia: 'down' as TendenciaFinanciera,
        etiqueta: 'Costes Estructurales',
        descripcionOpcional: 'Costes fijos del gimnasio (alquiler, salarios, servicios)'
      },
      {
        valorActual: 1200,
        valorAnterior: 1150,
        variacionAbsoluta: 50,
        variacionPorcentual: 4.3,
        tendencia: 'up' as TendenciaFinanciera,
        etiqueta: 'Socios Activos',
        descripcionOpcional: 'Total de socios con membresía activa'
      }
    ];
  }
}

/**
 * Obtiene el resumen de alertas de pagos adaptado al rol
 * 
 * @param rol - Rol financiero del usuario ('entrenador' | 'gimnasio')
 * @returns Promise con objeto conteniendo:
 *   - totalPendiente: Monto total en pagos pendientes
 *   - numeroClientesRiesgoAlto: Número de clientes con riesgo alto de impago
 *   - proximosVencimientos: Número de pagos que vencen en los próximos 7 días
 * 
 * @remarks
 * En producción, esta función realizaría una llamada GET a:
 * - Entrenador: GET /api/finanzas/overview/entrenador/alertas-pagos
 * - Gimnasio: GET /api/finanzas/overview/gimnasio/alertas-pagos
 */
export async function getResumenAlertasPagos(rol: RolFinanciero): Promise<{
  totalPendiente: number;
  numeroClientesRiesgoAlto: number;
  proximosVencimientos: number;
}> {
  await delay(500);
  
  if (rol === 'entrenador') {
    // Enfocado en clientes personales del entrenador con pagos pendientes
    return {
      totalPendiente: 870, // Total en pagos pendientes de clientes personales
      numeroClientesRiesgoAlto: 3, // Clientes con pagos vencidos > 15 días
      proximosVencimientos: 5 // Pagos que vencen en próximos 7 días
    };
  } else {
    // Enfocado en facturación total del gimnasio y pagos pendientes masivos
    return {
      totalPendiente: 12450, // Total en cuotas y pagos pendientes del gimnasio
      numeroClientesRiesgoAlto: 12, // Socios/clientes con riesgo alto de impago
      proximosVencimientos: 28 // Cuotas y pagos que vencen en próximos 7 días
    };
  }
}

