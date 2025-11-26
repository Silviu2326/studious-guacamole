// Servicio para estadísticas de asistencia de eventos

import { Evento, Participante } from '../api/events';

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
 * Calcula estadísticas de asistencia para un evento
 */
export const calcularEstadisticasEvento = (evento: Evento): EstadisticasAsistenciaEvento => {
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
    .map(calcularEstadisticasEvento)
    .sort((a, b) => b.fechaInicio.getTime() - a.fechaInicio.getTime());
};

/**
 * Obtiene comparativa de un evento con eventos anteriores
 */
export const obtenerComparativaEvento = (
  evento: Evento,
  todosEventos: Evento[]
): ComparativaEventos => {
  const estadisticasActual = calcularEstadisticasEvento(evento);
  
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
    .map(calcularEstadisticasEvento)
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
    const estadisticas = eventosTipo.map(calcularEstadisticasEvento);
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
    const estadisticas = calcularEstadisticasEvento(evento);
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


