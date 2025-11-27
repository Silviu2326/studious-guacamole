import {
  ProyeccionesYRetencionRequest,
  ProyeccionesYRetencionResponse,
  ProyeccionIngresos,
  AnalisisRetencion,
  Suscripcion,
  ProyeccionRetencion,
  EscenarioProyeccion,
  ParametrosProyeccion,
} from '../types';
import { getSuscripciones } from './suscripciones';
import { getCuotas } from './cuotas';

/**
 * Calcula proyecciones de ingresos recurrentes y análisis de retención
 */
export const getProyeccionesYRetencion = async (
  request: ProyeccionesYRetencionRequest
): Promise<ProyeccionesYRetencionResponse> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const mesesProyeccion = request.mesesProyeccion || 12;
  const mesesAnalisis = request.mesesAnalisis || 6;
  const entrenadorId = request.entrenadorId;

  // Obtener suscripciones
  const todasSuscripciones = await getSuscripciones('entrenador', entrenadorId);
  const suscripcionesActivas = todasSuscripciones.filter(s => s.estado === 'activa');
  const suscripcionesCanceladas = todasSuscripciones.filter(s => s.estado === 'cancelada');
  const todasCuotas = await getCuotas();

  // Calcular proyecciones mensuales
  const proyecciones: ProyeccionIngresos[] = [];
  const fechaActual = new Date();
  
  for (let i = 0; i < mesesProyeccion; i++) {
    const fechaProyeccion = new Date(fechaActual);
    fechaProyeccion.setMonth(fechaActual.getMonth() + i);
    
    const mes = fechaProyeccion.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
    const fechaInicio = new Date(fechaProyeccion.getFullYear(), fechaProyeccion.getMonth(), 1);
    const fechaFin = new Date(fechaProyeccion.getFullYear(), fechaProyeccion.getMonth() + 1, 0);

    // Calcular suscripciones activas en este mes
    const suscripcionesEnMes = suscripcionesActivas.filter(s => {
      const fechaInicioSub = new Date(s.fechaInicio);
      const fechaVencimientoSub = new Date(s.fechaVencimiento);
      return fechaInicioSub <= fechaFin && fechaVencimientoSub >= fechaInicio;
    });

    // Calcular ingresos confirmados (suscripciones activas)
    // Nota: Los descuentos ya están aplicados en s.precio, por lo que se reflejan automáticamente
    const ingresosConfirmados = suscripcionesEnMes.reduce((sum, s) => {
      // Ajustar según frecuencia de pago
      // Usar precio con descuento aplicado (s.precio ya incluye descuentos)
      let montoMensual = s.precio;
      if (s.frecuenciaPago === 'trimestral') {
        montoMensual = s.precio / 3;
      } else if (s.frecuenciaPago === 'semestral') {
        montoMensual = s.precio / 6;
      } else if (s.frecuenciaPago === 'anual') {
        montoMensual = s.precio / 12;
      }
      return sum + montoMensual;
    }, 0);

    // Calcular renovaciones esperadas (suscripciones que vencen en este mes)
    const renovaciones = suscripcionesActivas.filter(s => {
      const fechaVencimiento = new Date(s.fechaVencimiento);
      return fechaVencimiento.getMonth() === fechaProyeccion.getMonth() &&
             fechaVencimiento.getFullYear() === fechaProyeccion.getFullYear();
    });

    // Calcular cancelaciones esperadas (basado en tasa histórica)
    const tasaCancelacionHistorica = calcularTasaCancelacionHistorica(todasSuscripciones);
    const cancelacionesEsperadas = Math.round(suscripcionesEnMes.length * tasaCancelacionHistorica / 100);

    // Calcular ingresos proyectados (considerando renovaciones y cancelaciones)
    // Los descuentos se reflejan en s.precio (precio con descuento aplicado)
    const ingresosRenovaciones = renovaciones.reduce((sum, s) => {
      let montoMensual = s.precio; // Precio ya incluye descuentos aplicados
      if (s.frecuenciaPago === 'trimestral') {
        montoMensual = s.precio / 3;
      } else if (s.frecuenciaPago === 'semestral') {
        montoMensual = s.precio / 6;
      } else if (s.frecuenciaPago === 'anual') {
        montoMensual = s.precio / 12;
      }
      return sum + montoMensual;
    }, 0);

    const ingresosPerdidosPorCancelacion = cancelacionesEsperadas * (ingresosConfirmados / suscripcionesEnMes.length);
    const ingresosProyectados = ingresosConfirmados + ingresosRenovaciones - ingresosPerdidosPorCancelacion;

    // Calcular ingresos potenciales (suscripciones en riesgo)
    const ingresosPotenciales = ingresosPerdidosPorCancelacion;

    // Tasa de retención esperada
    const tasaRetencionEsperada = suscripcionesEnMes.length > 0
      ? ((suscripcionesEnMes.length - cancelacionesEsperadas) / suscripcionesEnMes.length) * 100
      : 100;

    proyecciones.push({
      periodo: mes,
      fechaInicio: fechaInicio.toISOString().split('T')[0],
      fechaFin: fechaFin.toISOString().split('T')[0],
      ingresosProyectados: Math.max(0, ingresosProyectados),
      ingresosConfirmados,
      ingresosPotenciales,
      numeroSuscripciones: suscripcionesEnMes.length,
      numeroRenovaciones: renovaciones.length,
      numeroCancelaciones: cancelacionesEsperadas,
      tasaRetencionEsperada,
    });
  }

  // Calcular análisis de retención
  const fechaInicioAnalisis = new Date(fechaActual);
  fechaInicioAnalisis.setMonth(fechaActual.getMonth() - mesesAnalisis);
  
  const suscripcionesEnPeriodo = todasSuscripciones.filter(s => {
    const fechaInicioSub = new Date(s.fechaInicio);
    return fechaInicioSub >= fechaInicioAnalisis;
  });

  const tasaRetencionGeneral = calcularTasaRetencionGeneral(suscripcionesEnPeriodo);
  
  // Análisis por plan
  const planes = Array.from(new Set(suscripcionesEnPeriodo.map(s => s.planId)));
  const tasaRetencionPorPlan = planes.map(planId => {
    const suscripcionesPlan = suscripcionesEnPeriodo.filter(s => s.planId === planId);
    const canceladasPlan = suscripcionesPlan.filter(s => s.estado === 'cancelada');
    const plan = suscripcionesPlan[0];
    
    return {
      planId,
      planNombre: plan?.planNombre || planId,
      tasaRetencion: calcularTasaRetencionGeneral(suscripcionesPlan),
      numeroClientes: suscripcionesPlan.length,
      numeroCancelaciones: canceladasPlan.length,
    };
  });

  // Análisis por antigüedad
  const tasaRetencionPorAntiguedad = [
    { rango: '0-3 meses', meses: [0, 3] },
    { rango: '3-6 meses', meses: [3, 6] },
    { rango: '6-12 meses', meses: [6, 12] },
    { rango: '12+ meses', meses: [12, Infinity] },
  ].map(rango => {
    const suscripcionesRango = suscripcionesEnPeriodo.filter(s => {
      const fechaInicioSub = new Date(s.fechaInicio);
      const mesesAntiguedad = (fechaActual.getTime() - fechaInicioSub.getTime()) / (1000 * 60 * 60 * 24 * 30);
      return mesesAntiguedad >= rango.meses[0] && mesesAntiguedad < rango.meses[1];
    });

    return {
      rango: rango.rango,
      tasaRetencion: calcularTasaRetencionGeneral(suscripcionesRango),
      numeroClientes: suscripcionesRango.length,
    };
  });

  // Razones de cancelación
  const razonesCancelacion = extraerRazonesCancelacion(suscripcionesCanceladas);

  // Clientes en riesgo (suscripciones activas con riesgo de cancelación)
  const clientesEnRiesgo = suscripcionesActivas.filter(s => {
    // Considerar en riesgo si está cerca de vencer o tiene pagos fallidos
    const fechaVencimiento = new Date(s.fechaVencimiento);
    const diasHastaVencimiento = (fechaVencimiento.getTime() - fechaActual.getTime()) / (1000 * 60 * 60 * 24);
    return diasHastaVencimiento < 7;
  }).length;

  // Valor de vida del cliente (CLV)
  const valorVidaCliente = calcularValorVidaCliente(suscripcionesEnPeriodo, todasCuotas);

  // Tiempo promedio de retención
  const tiempoPromedioRetencion = calcularTiempoPromedioRetencion(suscripcionesCanceladas);

  // Tendencia de retención mensual
  const tendenciaRetencion = calcularTendenciaRetencion(suscripcionesEnPeriodo, mesesAnalisis);

  const analisisRetencion: AnalisisRetencion = {
    periodo: `Últimos ${mesesAnalisis} meses`,
    fechaInicio: fechaInicioAnalisis.toISOString().split('T')[0],
    fechaFin: fechaActual.toISOString().split('T')[0],
    tasaRetencionGeneral,
    tasaRetencionPorPlan,
    tasaRetencionPorAntiguedad,
    razonesCancelacion,
    clientesEnRiesgo,
    valorVidaCliente,
    tiempoPromedioRetencion,
    tendenciaRetencion,
  };

  // Resumen
  const ingresosTotalesProyectados = proyecciones.reduce((sum, p) => sum + p.ingresosProyectados, 0);
  const ingresosTotalesConfirmados = proyecciones.reduce((sum, p) => sum + p.ingresosConfirmados, 0);
  const tasaRetencionPromedio = proyecciones.reduce((sum, p) => sum + p.tasaRetencionEsperada, 0) / proyecciones.length;

  // Calcular MRR (Monthly Recurring Revenue)
  const mrr = suscripcionesActivas.reduce((sum, s) => {
    let montoMensual = s.precio; // Precio ya incluye descuentos aplicados
    if (s.frecuenciaPago === 'trimestral') {
      montoMensual = s.precio / 3;
    } else if (s.frecuenciaPago === 'semestral') {
      montoMensual = s.precio / 6;
    } else if (s.frecuenciaPago === 'anual') {
      montoMensual = s.precio / 12;
    }
    return sum + montoMensual;
  }, 0);

  // Calcular MRR sin descuentos
  const mrrSinDescuentos = suscripcionesActivas.reduce((sum, s) => {
    const precioBase = s.precioOriginal || s.precio;
    let montoMensual = precioBase;
    if (s.frecuenciaPago === 'trimestral') {
      montoMensual = precioBase / 3;
    } else if (s.frecuenciaPago === 'semestral') {
      montoMensual = precioBase / 6;
    } else if (s.frecuenciaPago === 'anual') {
      montoMensual = precioBase / 12;
    }
    return sum + montoMensual;
  }, 0);

  const impactoDescuentosMRR = mrrSinDescuentos - mrr;

  return {
    proyecciones,
    analisisRetencion,
    resumen: {
      ingresosTotalesProyectados,
      ingresosTotalesConfirmados,
      tasaRetencionPromedio,
      clientesTotales: suscripcionesActivas.length,
      clientesEnRiesgo,
      valorVidaClientePromedio: valorVidaCliente,
      // Métricas de MRR con descuentos
      mrr,
      mrrSinDescuentos,
      impactoDescuentosMRR,
    },
  };
};

/**
 * Genera proyecciones de retención con escenarios optimista, realista y pesimista
 */
export const getProyeccionesRetencionEscenarios = async (
  parametros: ParametrosProyeccion,
  entrenadorId?: string
): Promise<ProyeccionRetencion[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const { churnEsperado, crecimientoAltas, mesesProyeccion } = parametros;
  const todasSuscripciones = await getSuscripciones('entrenador', entrenadorId);
  const suscripcionesActivas = todasSuscripciones.filter(s => s.estado === 'activa');
  
  // Calcular valores base
  const numeroSuscripcionesActual = suscripcionesActivas.length;
  const mrrActual = suscripcionesActivas.reduce((sum, s) => {
    let montoMensual = s.precio;
    if (s.frecuenciaPago === 'trimestral') {
      montoMensual = s.precio / 3;
    } else if (s.frecuenciaPago === 'semestral') {
      montoMensual = s.precio / 6;
    } else if (s.frecuenciaPago === 'anual') {
      montoMensual = s.precio / 12;
    }
    return sum + montoMensual;
  }, 0);
  const precioPromedio = numeroSuscripcionesActual > 0 ? mrrActual / numeroSuscripcionesActual : 0;

  const escenarios: EscenarioProyeccion[] = ['optimista', 'realista', 'pesimista'];
  const fechaActual = new Date();

  return escenarios.map(escenario => {
    // Factores de ajuste según escenario
    let factorChurn = 1;
    let factorCrecimiento = 1;
    
    if (escenario === 'optimista') {
      factorChurn = 0.7; // 30% menos churn
      factorCrecimiento = 1.3; // 30% más crecimiento
    } else if (escenario === 'pesimista') {
      factorChurn = 1.5; // 50% más churn
      factorCrecimiento = 0.7; // 30% menos crecimiento
    }

    const churnAjustado = churnEsperado * factorChurn;
    const crecimientoAjustado = crecimientoAltas * factorCrecimiento;

    const meses: ProyeccionRetencion['meses'] = [];
    let suscripcionesActuales = numeroSuscripcionesActual;
    let ingresosActuales = mrrActual;

    for (let i = 0; i < mesesProyeccion; i++) {
      const fechaProyeccion = new Date(fechaActual);
      fechaProyeccion.setMonth(fechaActual.getMonth() + i);
      
      const mes = fechaProyeccion.toLocaleString('es-ES', { month: 'short', year: 'numeric' });
      const fechaInicio = new Date(fechaProyeccion.getFullYear(), fechaProyeccion.getMonth(), 1);
      const fechaFin = new Date(fechaProyeccion.getFullYear(), fechaProyeccion.getMonth() + 1, 0);

      // Calcular churn y crecimiento para este mes
      const cancelaciones = Math.round(suscripcionesActuales * (churnAjustado / 100));
      const nuevasAltas = Math.round(crecimientoAjustado);
      
      // Actualizar suscripciones
      suscripcionesActuales = Math.max(0, suscripcionesActuales - cancelaciones + nuevasAltas);
      ingresosActuales = suscripcionesActuales * precioPromedio;

      meses.push({
        mes,
        fechaInicio: fechaInicio.toISOString().split('T')[0],
        fechaFin: fechaFin.toISOString().split('T')[0],
        ingresos: ingresosActuales,
        numeroSuscripciones: suscripcionesActuales,
        churnEsperado: churnAjustado,
        crecimientoEsperado: nuevasAltas,
      });
    }

    return {
      escenario,
      meses,
      parametros: {
        churnBase: churnEsperado,
        crecimientoBase: crecimientoAltas,
        factorOptimista: escenario === 'optimista' ? 1.3 : undefined,
        factorPesimista: escenario === 'pesimista' ? 1.5 : undefined,
      },
    };
  });
};

// Funciones auxiliares
function calcularTasaCancelacionHistorica(suscripciones: Suscripcion[]): number {
  if (suscripciones.length === 0) return 0;
  const canceladas = suscripciones.filter(s => s.estado === 'cancelada').length;
  return (canceladas / suscripciones.length) * 100;
}

function calcularTasaRetencionGeneral(suscripciones: Suscripcion[]): number {
  if (suscripciones.length === 0) return 100;
  const activas = suscripciones.filter(s => s.estado === 'activa').length;
  return (activas / suscripciones.length) * 100;
}

function extraerRazonesCancelacion(suscripcionesCanceladas: Suscripcion[]): Array<{
  motivo: string;
  frecuencia: number;
  porcentaje: number;
}> {
  const razones: Record<string, number> = {};
  
  suscripcionesCanceladas.forEach(s => {
    const motivo = s.motivoCancelacion || 'No especificado';
    razones[motivo] = (razones[motivo] || 0) + 1;
  });

  const total = suscripcionesCanceladas.length;
  return Object.entries(razones)
    .map(([motivo, frecuencia]) => ({
      motivo,
      frecuencia,
      porcentaje: total > 0 ? (frecuencia / total) * 100 : 0,
    }))
    .sort((a, b) => b.frecuencia - a.frecuencia);
}

function calcularValorVidaCliente(
  suscripciones: Suscripcion[],
  cuotas: any[]
): number {
  if (suscripciones.length === 0) return 0;

  const valoresVida = suscripciones.map(s => {
    const cuotasCliente = cuotas.filter(c => c.suscripcionId === s.id && c.estado === 'pagada');
    const totalPagado = cuotasCliente.reduce((sum, c) => sum + (c.importe || c.monto || 0), 0);
    return totalPagado;
  });

  return valoresVida.reduce((sum, v) => sum + v, 0) / valoresVida.length;
}

function calcularTiempoPromedioRetencion(suscripcionesCanceladas: Suscripcion[]): number {
  if (suscripcionesCanceladas.length === 0) return 0;

  const tiempos = suscripcionesCanceladas
    .filter(s => s.fechaInicio && s.fechaCancelacion)
    .map(s => {
      const inicio = new Date(s.fechaInicio);
      const cancelacion = new Date(s.fechaCancelacion!);
      return (cancelacion.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24 * 30); // Meses
    });

  return tiempos.length > 0
    ? tiempos.reduce((sum, t) => sum + t, 0) / tiempos.length
    : 0;
}

function calcularTendenciaRetencion(
  suscripciones: Suscripcion[],
  meses: number
): Array<{
  mes: string;
  tasaRetencion: number;
  numeroClientes: number;
}> {
  const tendencia: Array<{
    mes: string;
    tasaRetencion: number;
    numeroClientes: number;
  }> = [];

  const fechaActual = new Date();
  
  for (let i = meses - 1; i >= 0; i--) {
    const fechaMes = new Date(fechaActual);
    fechaMes.setMonth(fechaActual.getMonth() - i);
    
    const mes = fechaMes.toLocaleString('es-ES', { month: 'short', year: 'numeric' });
    const fechaInicio = new Date(fechaMes.getFullYear(), fechaMes.getMonth(), 1);
    const fechaFin = new Date(fechaMes.getFullYear(), fechaMes.getMonth() + 1, 0);

    const suscripcionesEnMes = suscripciones.filter(s => {
      const fechaInicioSub = new Date(s.fechaInicio);
      return fechaInicioSub <= fechaFin;
    });

    const activasEnMes = suscripcionesEnMes.filter(s => {
      if (s.estado === 'cancelada' && s.fechaCancelacion) {
        const fechaCancelacion = new Date(s.fechaCancelacion);
        return fechaCancelacion > fechaFin;
      }
      return s.estado === 'activa' || s.estado === 'pausada';
    });

    const tasaRetencion = suscripcionesEnMes.length > 0
      ? (activasEnMes.length / suscripcionesEnMes.length) * 100
      : 100;

    tendencia.push({
      mes,
      tasaRetencion,
      numeroClientes: suscripcionesEnMes.length,
    });
  }

  return tendencia;
}

