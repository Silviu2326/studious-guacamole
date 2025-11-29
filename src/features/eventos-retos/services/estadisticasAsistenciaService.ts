/**
 * Servicio para estadísticas de asistencia de eventos
 * 
 * Este servicio se utiliza para:
 * - DashboardMetricasGenerales.tsx: Para calcular y mostrar métricas agregadas de eventos
 * - DashboardProgresoRetos.tsx: Para calcular estadísticas de asistencia en retos
 * - ClientEventHistory.tsx: Para mostrar estadísticas de asistencia por cliente
 */

import { Evento, Participante } from '../api/events';
import { EventMetrics } from '../types';
import { getEventById, getEvents } from '../api/events';

export interface EstadisticasAsistenciaEvento {
  eventoId: string;
  eventoNombre: string;
  eventoTipo: string;
  fechaInicio: Date;
  inscritos: number;
  asistentes: number;
  porcentajeAsistencia: number;
  noAsistentes: number;
  participantesDetalle: Array<{
    participanteId: string;
    participanteNombre: string;
    inscrito: boolean;
    asistio: boolean;
  }>;
}

export interface ComparativaEventos {
  eventoActual: EstadisticasAsistenciaEvento;
  eventosAnteriores: EstadisticasAsistenciaEvento[];
  promedioAsistencia: number;
  tendencia: 'mejorando' | 'empeorando' | 'estable';
  diferenciaVsPromedio: number;
}

export interface PatronAsistencia {
  tipoEvento: string;
  promedioAsistencia: number;
  eventosAnalizados: number;
  recomendaciones?: string[];
}

/**
 * Calcula estadísticas agregadas de asistencia para un evento
 * 
 * Devuelve métricas completas incluyendo asistencia, inscripciones, no-shows,
 * cancelaciones, ingresos y tasas calculadas.
 * 
 * @param eventId ID del evento
 * @returns Métricas del evento (EventMetrics)
 */
export const calcularEstadisticasEvento = async (eventId: string): Promise<EventMetrics> => {
  const evento = await getEventById(eventId);
  
  if (!evento) {
    // Retornar métricas vacías si el evento no existe
    return {
      asistenciaTotal: 0,
      inscritos: 0,
      noShows: 0,
      cancelaciones: 0,
      ingresosTotales: 0,
      ingresosProyectados: 0,
      tasaAsistencia: 0,
      tasaCancelacion: 0,
      tasaNoShow: 0,
    };
  }

  return calcularEstadisticasEventoFromData(evento);
};

/**
 * Calcula estadísticas de asistencia para un evento (versión con objeto Evento)
 * 
 * Función helper que calcula métricas a partir de un objeto Evento.
 * 
 * @param evento Objeto Evento
 * @returns Métricas del evento (EventMetrics)
 */
export const calcularEstadisticasEventoFromData = (evento: Evento): EventMetrics => {
  const participantes = evento.participantesDetalle || [];
  
  // Filtrar participantes que realmente se inscribieron (excluir cancelados antes del evento)
  const inscritos = participantes.filter(p => {
    // Si tiene fecha de cancelación, verificar si fue antes o después del evento
    if (p.fechaCancelacion) {
      const fechaCancelacion = new Date(p.fechaCancelacion);
      const fechaEvento = new Date(evento.fechaInicio);
      // Solo contar como inscrito si canceló después del evento (asistió y luego canceló)
      return fechaCancelacion > fechaEvento;
    }
    return true;
  });

  // Contar asistentes (tienen asistencia = true o fueron marcados como asistieron)
  const asistenciaTotal = inscritos.filter(p => p.asistencia === true).length;
  const noShows = inscritos.length - asistenciaTotal;
  
  // Contar cancelaciones (participantes que cancelaron antes del evento)
  const cancelaciones = participantes.filter(p => {
    if (p.fechaCancelacion) {
      const fechaCancelacion = new Date(p.fechaCancelacion);
      const fechaEvento = new Date(evento.fechaInicio);
      return fechaCancelacion <= fechaEvento;
    }
    return false;
  }).length;

  // Calcular ingresos
  // Ingresos proyectados: suma de precios de todos los inscritos
  let ingresosProyectados = 0;
  inscritos.forEach(p => {
    // Obtener precio según tipo de cliente o precio general
    // Nota: tipoCliente puede no estar en Participante, usar 'regular' por defecto
    const tipoCliente = (p as any).tipoCliente || 'regular';
    const precio = evento.preciosPorTipoCliente?.[tipoCliente] || evento.precio || 0;
    if (!evento.esGratuito && precio > 0) {
      ingresosProyectados += precio;
    }
  });

  // Ingresos totales: solo de los que asistieron
  let ingresosTotales = 0;
  inscritos.filter(p => p.asistencia === true).forEach(p => {
    // Nota: tipoCliente puede no estar en Participante, usar 'regular' por defecto
    const tipoCliente = (p as any).tipoCliente || 'regular';
    const precio = evento.preciosPorTipoCliente?.[tipoCliente] || evento.precio || 0;
    if (!evento.esGratuito && precio > 0) {
      ingresosTotales += precio;
    }
  });

  // Calcular tasas
  const tasaAsistencia = inscritos.length > 0
    ? Math.round((asistenciaTotal / inscritos.length) * 100 * 10) / 10
    : 0;
  
  const totalInscripciones = participantes.length;
  const tasaCancelacion = totalInscripciones > 0
    ? Math.round((cancelaciones / totalInscripciones) * 100 * 10) / 10
    : 0;
  
  const tasaNoShow = inscritos.length > 0
    ? Math.round((noShows / inscritos.length) * 100 * 10) / 10
    : 0;

  return {
    asistenciaTotal,
    inscritos: inscritos.length,
    noShows,
    cancelaciones,
    ingresosTotales,
    ingresosProyectados,
    tasaAsistencia,
    tasaCancelacion,
    tasaNoShow,
  };
};

/**
 * Calcula estadísticas de asistencia para un evento (versión legacy)
 * @deprecated Usar calcularEstadisticasEvento o calcularEstadisticasEventoFromData
 */
export const calcularEstadisticasEventoLegacy = (evento: Evento): EstadisticasAsistenciaEvento => {
  const participantes = evento.participantesDetalle || [];
  
  // Filtrar participantes que realmente se inscribieron (excluir cancelados antes del evento)
  const inscritos = participantes.filter(p => {
    // Si tiene fecha de cancelación, verificar si fue antes o después del evento
    if (p.fechaCancelacion) {
      const fechaCancelacion = new Date(p.fechaCancelacion);
      const fechaEvento = new Date(evento.fechaInicio);
      // Solo contar como inscrito si canceló después del evento (asistió y luego canceló)
      return fechaCancelacion > fechaEvento;
    }
    return true;
  });

  // Contar asistentes (tienen asistencia = true o fueron marcados como asistieron)
  const asistentes = inscritos.filter(p => p.asistencia === true).length;
  const noAsistentes = inscritos.length - asistentes;

  // Calcular porcentaje
  const porcentajeAsistencia = inscritos.length > 0
    ? Math.round((asistentes / inscritos.length) * 100 * 10) / 10
    : 0;

  return {
    eventoId: evento.id,
    eventoNombre: evento.nombre,
    eventoTipo: evento.tipo,
    fechaInicio: evento.fechaInicio,
    inscritos: inscritos.length,
    asistentes,
    porcentajeAsistencia,
    noAsistentes,
    participantesDetalle: inscritos.map(p => ({
      participanteId: p.id,
      participanteNombre: p.nombre,
      inscrito: true,
      asistio: p.asistencia === true,
    })),
  };
};

/**
 * Calcula estadísticas de asistencia por cliente
 * 
 * Devuelve estadísticas agregadas de todos los eventos en los que el cliente
 * ha participado, incluyendo número de eventos asistidos, no-shows, cancelaciones, etc.
 * 
 * @param clienteId ID del cliente
 * @returns Estadísticas de asistencia del cliente
 */
export const calcularEstadisticasAsistenciaPorCliente = async (clienteId: string): Promise<{
  clienteId: string;
  totalEventos: number;
  eventosInscritos: number;
  eventosAsistidos: number;
  eventosNoAsistidos: number;
  eventosCancelados: number;
  porcentajeAsistencia: number;
  porcentajeNoShow: number;
  porcentajeCancelacion: number;
  eventosPorTipo: {
    presencial: { inscritos: number; asistidos: number; noShows: number };
    virtual: { inscritos: number; asistidos: number; noShows: number };
    reto: { inscritos: number; asistidos: number; noShows: number };
  };
  ultimaAsistencia?: Date;
  primeraAsistencia?: Date;
}> => {
  // Obtener todos los eventos
  const eventos = await getEvents();
  
  // Filtrar eventos donde el cliente es participante
  const eventosCliente = eventos.filter(evento => {
    const participantes = evento.participantesDetalle || [];
    return participantes.some(p => p.id === clienteId);
  });

  let eventosInscritos = 0;
  let eventosAsistidos = 0;
  let eventosNoAsistidos = 0;
  let eventosCancelados = 0;
  
  const eventosPorTipo = {
    presencial: { inscritos: 0, asistidos: 0, noShows: 0 },
    virtual: { inscritos: 0, asistidos: 0, noShows: 0 },
    reto: { inscritos: 0, asistidos: 0, noShows: 0 },
  };

  const fechasAsistencia: Date[] = [];

  eventosCliente.forEach(evento => {
    const participante = evento.participantesDetalle?.find(p => p.id === clienteId);
    if (!participante) return;

    // Verificar si canceló antes del evento
    const canceloAntes = participante.fechaCancelacion 
      ? new Date(participante.fechaCancelacion) <= new Date(evento.fechaInicio)
      : false;

    if (canceloAntes) {
      eventosCancelados++;
      return;
    }

    // Contar como inscrito
    eventosInscritos++;
    eventosPorTipo[evento.tipo as 'presencial' | 'virtual' | 'reto'].inscritos++;

    // Verificar asistencia
    if (participante.asistencia === true) {
      eventosAsistidos++;
      eventosPorTipo[evento.tipo as 'presencial' | 'virtual' | 'reto'].asistidos++;
      fechasAsistencia.push(new Date(evento.fechaInicio));
    } else {
      // Solo contar como no-show si el evento ya pasó
      const ahora = new Date();
      if (new Date(evento.fechaInicio) < ahora) {
        eventosNoAsistidos++;
        eventosPorTipo[evento.tipo as 'presencial' | 'virtual' | 'reto'].noShows++;
      }
    }
  });

  // Calcular porcentajes
  const porcentajeAsistencia = eventosInscritos > 0
    ? Math.round((eventosAsistidos / eventosInscritos) * 100 * 10) / 10
    : 0;
  
  const porcentajeNoShow = eventosInscritos > 0
    ? Math.round((eventosNoAsistidos / eventosInscritos) * 100 * 10) / 10
    : 0;
  
  const porcentajeCancelacion = eventosInscritos > 0
    ? Math.round((eventosCancelados / eventosInscritos) * 100 * 10) / 10
    : 0;

  // Ordenar fechas de asistencia
  fechasAsistencia.sort((a, b) => b.getTime() - a.getTime());

  return {
    clienteId,
    totalEventos: eventosCliente.length,
    eventosInscritos,
    eventosAsistidos,
    eventosNoAsistidos,
    eventosCancelados,
    porcentajeAsistencia,
    porcentajeNoShow,
    porcentajeCancelacion,
    eventosPorTipo,
    ultimaAsistencia: fechasAsistencia.length > 0 ? fechasAsistencia[0] : undefined,
    primeraAsistencia: fechasAsistencia.length > 0 ? fechasAsistencia[fechasAsistencia.length - 1] : undefined,
  };
};

/**
 * Calcula estadísticas para todos los eventos finalizados
 */
export const calcularEstadisticasTodosEventos = (eventos: Evento[]): EstadisticasAsistenciaEvento[] => {
  // Filtrar solo eventos finalizados o cancelados (que ya pasaron)
  const ahora = new Date();
  const eventosFinalizados = eventos.filter(e => {
    if (e.estado === 'finalizado') return true;
    if (e.estado === 'cancelado') return true;
    // También incluir eventos programados que ya pasaron
    return new Date(e.fechaInicio) < ahora;
  });

  return eventosFinalizados
    .map(calcularEstadisticasEventoLegacy)
    .sort((a, b) => b.fechaInicio.getTime() - a.fechaInicio.getTime());
};

/**
 * Obtiene comparativa de un evento con eventos anteriores
 */
export const obtenerComparativaEvento = (
  evento: Evento,
  todosEventos: Evento[]
): ComparativaEventos => {
  const estadisticasActual = calcularEstadisticasEventoLegacy(evento);
  
  // Obtener eventos anteriores del mismo tipo
  const eventosAnteriores = todosEventos
    .filter(e => {
      // Eventos del mismo tipo
      if (e.tipo !== evento.tipo) return false;
      // Eventos que ya finalizaron
      const ahora = new Date();
      if (e.estado === 'finalizado') return true;
      if (e.estado === 'cancelado') return true;
      return new Date(e.fechaInicio) < ahora;
      // Eventos anteriores a este
    })
    .filter(e => new Date(e.fechaInicio) < new Date(evento.fechaInicio))
    .map(calcularEstadisticasEventoLegacy)
    .sort((a, b) => b.fechaInicio.getTime() - a.fechaInicio.getTime());

  // Calcular promedio de asistencia de eventos anteriores
  const promedioAsistencia = eventosAnteriores.length > 0
    ? eventosAnteriores.reduce((sum, e) => sum + e.porcentajeAsistencia, 0) / eventosAnteriores.length
    : 0;

  // Determinar tendencia (comparar con los últimos 3 eventos)
  const ultimosEventos = eventosAnteriores.slice(0, 3);
  let tendencia: 'mejorando' | 'empeorando' | 'estable' = 'estable';
  
  if (ultimosEventos.length >= 2) {
    const promedioUltimos = ultimosEventos.reduce((sum, e) => sum + e.porcentajeAsistencia, 0) / ultimosEventos.length;
    const diferencia = estadisticasActual.porcentajeAsistencia - promedioUltimos;
    
    if (diferencia > 5) {
      tendencia = 'mejorando';
    } else if (diferencia < -5) {
      tendencia = 'empeorando';
    }
  }

  const diferenciaVsPromedio = estadisticasActual.porcentajeAsistencia - promedioAsistencia;

  return {
    eventoActual: estadisticasActual,
    eventosAnteriores,
    promedioAsistencia: Math.round(promedioAsistencia * 10) / 10,
    tendencia,
    diferenciaVsPromedio: Math.round(diferenciaVsPromedio * 10) / 10,
  };
};

/**
 * Identifica patrones de asistencia
 */
export const identificarPatronesAsistencia = (
  eventos: Evento[]
): PatronAsistencia[] => {
  const eventosFinalizados = eventos.filter(e => {
    const ahora = new Date();
    if (e.estado === 'finalizado') return true;
    if (e.estado === 'cancelado') return true;
    return new Date(e.fechaInicio) < ahora;
  });

  // Agrupar por tipo de evento
  const eventosPorTipo = eventosFinalizados.reduce((acc, evento) => {
    if (!acc[evento.tipo]) {
      acc[evento.tipo] = [];
    }
    acc[evento.tipo].push(evento);
    return acc;
  }, {} as Record<string, Evento[]>);

  // Calcular estadísticas por tipo
  const patrones: PatronAsistencia[] = Object.entries(eventosPorTipo).map(([tipo, eventosTipo]) => {
    const estadisticas = eventosTipo.map(calcularEstadisticasEventoLegacy);
    const promedioAsistencia = estadisticas.length > 0
      ? estadisticas.reduce((sum, e) => sum + e.porcentajeAsistencia, 0) / estadisticas.length
      : 0;

    // Generar recomendaciones
    const recomendaciones: string[] = [];
    if (promedioAsistencia < 50) {
      recomendaciones.push('Considera enviar recordatorios más frecuentes');
      recomendaciones.push('Revisa si el horario es conveniente para los participantes');
      recomendaciones.push('Evalúa si el precio o formato del evento es adecuado');
    } else if (promedioAsistencia < 70) {
      recomendaciones.push('La asistencia es aceptable, pero hay margen de mejora');
      recomendaciones.push('Considera mejorar la comunicación previa al evento');
    } else {
      recomendaciones.push('¡Excelente tasa de asistencia!');
      recomendaciones.push('Mantén este nivel de engagement con tus participantes');
    }

    return {
      tipoEvento: tipo,
      promedioAsistencia: Math.round(promedioAsistencia * 10) / 10,
      eventosAnalizados: eventosTipo.length,
      recomendaciones,
    };
  });

  return patrones;
};

/**
 * Obtiene datos para gráfico de tendencia de asistencia
 */
export const obtenerDatosGraficoTendencia = (
  eventos: Evento[],
  tipoEvento?: string,
  limiteEventos: number = 10
): Array<{ fecha: string; porcentaje: number; eventoNombre: string }> => {
  const eventosFiltrados = eventos
    .filter(e => {
      if (tipoEvento && e.tipo !== tipoEvento) return false;
      const ahora = new Date();
      if (e.estado === 'finalizado') return true;
      if (e.estado === 'cancelado') return true;
      return new Date(e.fechaInicio) < ahora;
    })
    .sort((a, b) => new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime())
    .slice(-limiteEventos); // Últimos N eventos

  return eventosFiltrados.map(evento => {
    const estadisticas = calcularEstadisticasEventoLegacy(evento);
    return {
      fecha: evento.fechaInicio.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      porcentaje: estadisticas.porcentajeAsistencia,
      eventoNombre: evento.nombre,
    };
  });
};


