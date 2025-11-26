// Servicio para analytics y ranking de eventos

import { Evento, TipoEvento } from '../api/events';
import { calcularEstadisticasFeedback, obtenerEncuestaPorEvento } from './feedbackService';

export interface RankingEvento {
  eventoId: string;
  eventoNombre: string;
  tipo: TipoEvento;
  fechaInicio: Date;
  participacion: number; // Número de inscripciones
  asistencia: number; // Número de asistencias
  tasaAsistencia: number; // Porcentaje de asistencia vs participación
  valoracionPromedio: number; // Promedio de ratings (1-5)
  totalValoraciones: number;
  capacidad: number;
  porcentajeOcupacion: number; // Porcentaje de capacidad utilizada
}

export interface ComparativaTipoEvento {
  tipo: TipoEvento;
  totalEventos: number;
  promedioParticipacion: number;
  promedioAsistencia: number;
  promedioTasaAsistencia: number;
  promedioValoracion: number;
  totalParticipantes: number;
  totalAsistentes: number;
}

export interface AnalisisHorarios {
  mejorDiaSemana: {
    dia: string;
    promedioParticipacion: number;
    promedioAsistencia: number;
    promedioValoracion: number;
    totalEventos: number;
  };
  mejorHora: {
    hora: number;
    promedioParticipacion: number;
    promedioAsistencia: number;
    promedioValoracion: number;
    totalEventos: number;
  };
  mejoresHorarios: Array<{
    dia: string;
    hora: number;
    promedioParticipacion: number;
    promedioAsistencia: number;
    promedioValoracion: number;
    totalEventos: number;
  }>;
}

export interface InsightsEventos {
  eventosMasExitosos: RankingEvento[];
  eventosMenosExitosos: RankingEvento[];
  tendencias: {
    participacion: 'aumentando' | 'disminuyendo' | 'estable';
    asistencia: 'aumentando' | 'disminuyendo' | 'estable';
    valoracion: 'aumentando' | 'disminuyendo' | 'estable';
  };
  recomendaciones: string[];
  tipoEventoMasPopular: TipoEvento;
  mejorMomentoParaEventos: {
    dia: string;
    hora: number;
  };
}

/**
 * Calcula el ranking de eventos por diferentes métricas
 */
export const calcularRankingEventos = (
  eventos: Evento[],
  ordenPor: 'participacion' | 'asistencia' | 'valoracion' | 'tasaAsistencia' = 'valoracion'
): RankingEvento[] => {
  const rankings: RankingEvento[] = [];

  eventos.forEach(evento => {
    // Solo considerar eventos finalizados para el ranking
    if (evento.estado !== 'finalizado') {
      return;
    }

    const participantes = evento.participantesDetalle || [];
    const participacion = participantes.filter(p => !p.fechaCancelacion).length;
    const asistencia = participantes.filter(p => p.asistencia).length;
    const tasaAsistencia = participacion > 0 ? (asistencia / participacion) * 100 : 0;
    const porcentajeOcupacion = evento.capacidad > 0 
      ? (participacion / evento.capacidad) * 100 
      : 0;

    // Obtener valoración del evento desde la encuesta
    let valoracionPromedio = 0;
    let totalValoraciones = 0;

    const encuesta = obtenerEncuestaPorEvento(evento.id);
    if (encuesta) {
      const estadisticas = calcularEstadisticasFeedback(encuesta);
      valoracionPromedio = estadisticas.satisfaccionPromedio;
      totalValoraciones = estadisticas.totalRespuestas;
    }

    rankings.push({
      eventoId: evento.id,
      eventoNombre: evento.nombre,
      tipo: evento.tipo,
      fechaInicio: evento.fechaInicio,
      participacion,
      asistencia,
      tasaAsistencia: Math.round(tasaAsistencia * 10) / 10,
      valoracionPromedio: Math.round(valoracionPromedio * 100) / 100,
      totalValoraciones,
      capacidad: evento.capacidad,
      porcentajeOcupacion: Math.round(porcentajeOcupacion * 10) / 10,
    });
  });

  // Ordenar según el criterio seleccionado
  rankings.sort((a, b) => {
    switch (ordenPor) {
      case 'participacion':
        return b.participacion - a.participacion;
      case 'asistencia':
        return b.asistencia - a.asistencia;
      case 'valoracion':
        return b.valoracionPromedio - a.valoracionPromedio;
      case 'tasaAsistencia':
        return b.tasaAsistencia - a.tasaAsistencia;
      default:
        return b.valoracionPromedio - a.valoracionPromedio;
    }
  });

  return rankings;
};

/**
 * Compara eventos por tipo
 */
export const compararTiposEvento = (eventos: Evento[]): ComparativaTipoEvento[] => {
  const tipos: TipoEvento[] = ['presencial', 'virtual', 'reto'];
  const comparativas: ComparativaTipoEvento[] = [];

  tipos.forEach(tipo => {
    const eventosTipo = eventos.filter(
      e => e.tipo === tipo && e.estado === 'finalizado'
    );

    if (eventosTipo.length === 0) {
      comparativas.push({
        tipo,
        totalEventos: 0,
        promedioParticipacion: 0,
        promedioAsistencia: 0,
        promedioTasaAsistencia: 0,
        promedioValoracion: 0,
        totalParticipantes: 0,
        totalAsistentes: 0,
      });
      return;
    }

    let totalParticipacion = 0;
    let totalAsistencia = 0;
    let totalParticipantes = 0;
    let totalAsistentes = 0;
    let sumaValoraciones = 0;
    let eventosConValoracion = 0;

    eventosTipo.forEach(evento => {
      const participantes = evento.participantesDetalle || [];
      const participacion = participantes.filter(p => !p.fechaCancelacion).length;
      const asistencia = participantes.filter(p => p.asistencia).length;

      totalParticipacion += participacion;
      totalAsistencia += asistencia;
      totalParticipantes += participacion;
      totalAsistentes += asistencia;

      // Obtener valoración
      const encuesta = obtenerEncuestaPorEvento(evento.id);
      if (encuesta) {
        const estadisticas = calcularEstadisticasFeedback(encuesta);
        if (estadisticas.satisfaccionPromedio > 0) {
          sumaValoraciones += estadisticas.satisfaccionPromedio;
          eventosConValoracion++;
        }
      }
    });

    const promedioParticipacion = totalParticipacion / eventosTipo.length;
    const promedioAsistencia = totalAsistencia / eventosTipo.length;
    const promedioTasaAsistencia = totalParticipacion > 0
      ? (totalAsistencia / totalParticipacion) * 100
      : 0;
    const promedioValoracion = eventosConValoracion > 0
      ? sumaValoraciones / eventosConValoracion
      : 0;

    comparativas.push({
      tipo,
      totalEventos: eventosTipo.length,
      promedioParticipacion: Math.round(promedioParticipacion * 10) / 10,
      promedioAsistencia: Math.round(promedioAsistencia * 10) / 10,
      promedioTasaAsistencia: Math.round(promedioTasaAsistencia * 10) / 10,
      promedioValoracion: Math.round(promedioValoracion * 100) / 100,
      totalParticipantes,
      totalAsistentes,
    });
  });

  return comparativas;
};

/**
 * Analiza los mejores horarios y días para eventos
 */
export const analizarMejoresHorarios = (eventos: Evento[]): AnalisisHorarios => {
  const eventosFinalizados = eventos.filter(e => e.estado === 'finalizado');

  if (eventosFinalizados.length === 0) {
    return {
      mejorDiaSemana: {
        dia: 'N/A',
        promedioParticipacion: 0,
        promedioAsistencia: 0,
        promedioValoracion: 0,
        totalEventos: 0,
      },
      mejorHora: {
        hora: 0,
        promedioParticipacion: 0,
        promedioAsistencia: 0,
        promedioValoracion: 0,
        totalEventos: 0,
      },
      mejoresHorarios: [],
    };
  }

  // Agrupar por día de la semana
  const eventosPorDia: Record<string, Evento[]> = {};
  const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  eventosFinalizados.forEach(evento => {
    const dia = diasSemana[evento.fechaInicio.getDay()];
    if (!eventosPorDia[dia]) {
      eventosPorDia[dia] = [];
    }
    eventosPorDia[dia].push(evento);
  });

  // Calcular promedios por día
  const promediosPorDia: Array<{
    dia: string;
    promedioParticipacion: number;
    promedioAsistencia: number;
    promedioValoracion: number;
    totalEventos: number;
  }> = [];

  Object.entries(eventosPorDia).forEach(([dia, eventos]) => {
    let totalParticipacion = 0;
    let totalAsistencia = 0;
    let sumaValoraciones = 0;
    let eventosConValoracion = 0;

    eventos.forEach(evento => {
      const participantes = evento.participantesDetalle || [];
      const participacion = participantes.filter(p => !p.fechaCancelacion).length;
      const asistencia = participantes.filter(p => p.asistencia).length;

      totalParticipacion += participacion;
      totalAsistencia += asistencia;

      const encuesta = obtenerEncuestaPorEvento(evento.id);
      if (encuesta) {
        const estadisticas = calcularEstadisticasFeedback(encuesta);
        if (estadisticas.satisfaccionPromedio > 0) {
          sumaValoraciones += estadisticas.satisfaccionPromedio;
          eventosConValoracion++;
        }
      }
    });

    promediosPorDia.push({
      dia,
      promedioParticipacion: totalParticipacion / eventos.length,
      promedioAsistencia: totalAsistencia / eventos.length,
      promedioValoracion: eventosConValoracion > 0
        ? sumaValoraciones / eventosConValoracion
        : 0,
      totalEventos: eventos.length,
    });
  });

  // Encontrar mejor día (mayor promedio de valoración y participación)
  const mejorDiaSemana = promediosPorDia.reduce((mejor, actual) => {
    const scoreMejor = mejor.promedioValoracion * 0.6 + (mejor.promedioParticipacion / 10) * 0.4;
    const scoreActual = actual.promedioValoracion * 0.6 + (actual.promedioParticipacion / 10) * 0.4;
    return scoreActual > scoreMejor ? actual : mejor;
  }, promediosPorDia[0] || {
    dia: 'N/A',
    promedioParticipacion: 0,
    promedioAsistencia: 0,
    promedioValoracion: 0,
    totalEventos: 0,
  });

  // Agrupar por hora
  const eventosPorHora: Record<number, Evento[]> = {};

  eventosFinalizados.forEach(evento => {
    const hora = evento.fechaInicio.getHours();
    if (!eventosPorHora[hora]) {
      eventosPorHora[hora] = [];
    }
    eventosPorHora[hora].push(evento);
  });

  // Calcular promedios por hora
  const promediosPorHora: Array<{
    hora: number;
    promedioParticipacion: number;
    promedioAsistencia: number;
    promedioValoracion: number;
    totalEventos: number;
  }> = [];

  Object.entries(eventosPorHora).forEach(([horaStr, eventos]) => {
    const hora = parseInt(horaStr);
    let totalParticipacion = 0;
    let totalAsistencia = 0;
    let sumaValoraciones = 0;
    let eventosConValoracion = 0;

    eventos.forEach(evento => {
      const participantes = evento.participantesDetalle || [];
      const participacion = participantes.filter(p => !p.fechaCancelacion).length;
      const asistencia = participantes.filter(p => p.asistencia).length;

      totalParticipacion += participacion;
      totalAsistencia += asistencia;

      const encuesta = obtenerEncuestaPorEvento(evento.id);
      if (encuesta) {
        const estadisticas = calcularEstadisticasFeedback(encuesta);
        if (estadisticas.satisfaccionPromedio > 0) {
          sumaValoraciones += estadisticas.satisfaccionPromedio;
          eventosConValoracion++;
        }
      }
    });

    promediosPorHora.push({
      hora,
      promedioParticipacion: totalParticipacion / eventos.length,
      promedioAsistencia: totalAsistencia / eventos.length,
      promedioValoracion: eventosConValoracion > 0
        ? sumaValoraciones / eventosConValoracion
        : 0,
      totalEventos: eventos.length,
    });
  });

  // Encontrar mejor hora
  const mejorHora = promediosPorHora.reduce((mejor, actual) => {
    const scoreMejor = mejor.promedioValoracion * 0.6 + (mejor.promedioParticipacion / 10) * 0.4;
    const scoreActual = actual.promedioValoracion * 0.6 + (actual.promedioParticipacion / 10) * 0.4;
    return scoreActual > scoreMejor ? actual : mejor;
  }, promediosPorHora[0] || {
    hora: 0,
    promedioParticipacion: 0,
    promedioAsistencia: 0,
    promedioValoracion: 0,
    totalEventos: 0,
  });

  // Calcular mejores horarios (combinación día + hora)
  const eventosPorHorario: Record<string, Evento[]> = {};

  eventosFinalizados.forEach(evento => {
    const dia = diasSemana[evento.fechaInicio.getDay()];
    const hora = evento.fechaInicio.getHours();
    const clave = `${dia}-${hora}`;

    if (!eventosPorHorario[clave]) {
      eventosPorHorario[clave] = [];
    }
    eventosPorHorario[clave].push(evento);
  });

  const mejoresHorarios: Array<{
    dia: string;
    hora: number;
    promedioParticipacion: number;
    promedioAsistencia: number;
    promedioValoracion: number;
    totalEventos: number;
  }> = [];

  Object.entries(eventosPorHorario).forEach(([clave, eventos]) => {
    if (eventos.length < 2) return; // Solo considerar horarios con al menos 2 eventos

    const [dia, horaStr] = clave.split('-');
    const hora = parseInt(horaStr);

    let totalParticipacion = 0;
    let totalAsistencia = 0;
    let sumaValoraciones = 0;
    let eventosConValoracion = 0;

    eventos.forEach(evento => {
      const participantes = evento.participantesDetalle || [];
      const participacion = participantes.filter(p => !p.fechaCancelacion).length;
      const asistencia = participantes.filter(p => p.asistencia).length;

      totalParticipacion += participacion;
      totalAsistencia += asistencia;

      const encuesta = obtenerEncuestaPorEvento(evento.id);
      if (encuesta) {
        const estadisticas = calcularEstadisticasFeedback(encuesta);
        if (estadisticas.satisfaccionPromedio > 0) {
          sumaValoraciones += estadisticas.satisfaccionPromedio;
          eventosConValoracion++;
        }
      }
    });

    mejoresHorarios.push({
      dia,
      hora,
      promedioParticipacion: totalParticipacion / eventos.length,
      promedioAsistencia: totalAsistencia / eventos.length,
      promedioValoracion: eventosConValoracion > 0
        ? sumaValoraciones / eventosConValoracion
        : 0,
      totalEventos: eventos.length,
    });
  });

  // Ordenar por score combinado
  mejoresHorarios.sort((a, b) => {
    const scoreA = a.promedioValoracion * 0.6 + (a.promedioParticipacion / 10) * 0.4;
    const scoreB = b.promedioValoracion * 0.6 + (b.promedioParticipacion / 10) * 0.4;
    return scoreB - scoreA;
  });

  return {
    mejorDiaSemana,
    mejorHora,
    mejoresHorarios: mejoresHorarios.slice(0, 5), // Top 5
  };
};

/**
 * Genera insights y recomendaciones basados en los eventos
 */
export const generarInsightsEventos = (eventos: Evento[]): InsightsEventos => {
  const rankings = calcularRankingEventos(eventos, 'valoracion');
  const comparativas = compararTiposEvento(eventos);
  const analisisHorarios = analizarMejoresHorarios(eventos);

  // Eventos más exitosos (top 5)
  const eventosMasExitosos = rankings
    .filter(r => r.totalValoraciones > 0)
    .slice(0, 5);

  // Eventos menos exitosos (bottom 5)
  const eventosMenosExitosos = rankings
    .filter(r => r.totalValoraciones > 0)
    .slice(-5)
    .reverse();

  // Determinar tipo de evento más popular
  const tipoEventoMasPopular = comparativas.reduce((mejor, actual) => {
    return actual.totalParticipantes > mejor.totalParticipantes ? actual : mejor;
  }, comparativas[0] || { tipo: 'presencial' as TipoEvento, totalParticipantes: 0 }).tipo;

  // Generar recomendaciones
  const recomendaciones: string[] = [];

  if (analisisHorarios.mejorDiaSemana.dia !== 'N/A') {
    recomendaciones.push(
      `Los eventos programados los ${analisisHorarios.mejorDiaSemana.dia}s tienden a tener mayor participación y valoración.`
    );
  }

  if (analisisHorarios.mejorHora.hora > 0) {
    recomendaciones.push(
      `La hora ${analisisHorarios.mejorHora.hora}:00 es la mejor para programar eventos según el historial.`
    );
  }

  if (comparativas.length > 0) {
    const mejorTipo = comparativas.reduce((mejor, actual) => {
      return actual.promedioValoracion > mejor.promedioValoracion ? actual : mejor;
    }, comparativas[0]);

    if (mejorTipo.promedioValoracion > 0) {
      recomendaciones.push(
        `Los eventos ${mejorTipo.tipo} tienen la mayor valoración promedio (${mejorTipo.promedioValoracion.toFixed(1)}/5).`
      );
    }
  }

  if (eventosMasExitosos.length > 0) {
    const eventoTop = eventosMasExitosos[0];
    recomendaciones.push(
      `El evento "${eventoTop.eventoNombre}" ha sido el más exitoso. Considera repetir eventos similares.`
    );
  }

  // Calcular tendencias (simplificado - comparar últimos eventos con anteriores)
  const eventosOrdenados = eventos
    .filter(e => e.estado === 'finalizado')
    .sort((a, b) => b.fechaInicio.getTime() - a.fechaInicio.getTime());

  const mitad = Math.floor(eventosOrdenados.length / 2);
  const eventosRecientes = eventosOrdenados.slice(0, mitad);
  const eventosAntiguos = eventosOrdenados.slice(mitad);

  const calcularPromedio = (eventos: Evento[], metrica: 'participacion' | 'asistencia' | 'valoracion') => {
    if (eventos.length === 0) return 0;

    let suma = 0;
    eventos.forEach(evento => {
      const participantes = evento.participantesDetalle || [];
      switch (metrica) {
        case 'participacion':
          suma += participantes.filter(p => !p.fechaCancelacion).length;
          break;
        case 'asistencia':
          suma += participantes.filter(p => p.asistencia).length;
          break;
        case 'valoracion':
          const encuesta = obtenerEncuestaPorEvento(evento.id);
          if (encuesta) {
            const estadisticas = calcularEstadisticasFeedback(encuesta);
            suma += estadisticas.satisfaccionPromedio;
          }
          break;
      }
    });

    return suma / eventos.length;
  };

  const participacionReciente = calcularPromedio(eventosRecientes, 'participacion');
  const participacionAntigua = calcularPromedio(eventosAntiguos, 'participacion');
  const tendenciaParticipacion = participacionReciente > participacionAntigua * 1.1
    ? 'aumentando'
    : participacionReciente < participacionAntigua * 0.9
    ? 'disminuyendo'
    : 'estable';

  const asistenciaReciente = calcularPromedio(eventosRecientes, 'asistencia');
  const asistenciaAntigua = calcularPromedio(eventosAntiguos, 'asistencia');
  const tendenciaAsistencia = asistenciaReciente > asistenciaAntigua * 1.1
    ? 'aumentando'
    : asistenciaReciente < asistenciaAntigua * 0.9
    ? 'disminuyendo'
    : 'estable';

  const valoracionReciente = calcularPromedio(eventosRecientes, 'valoracion');
  const valoracionAntigua = calcularPromedio(eventosAntiguos, 'valoracion');
  const tendenciaValoracion = valoracionReciente > valoracionAntigua + 0.2
    ? 'aumentando'
    : valoracionReciente < valoracionAntigua - 0.2
    ? 'disminuyendo'
    : 'estable';

  return {
    eventosMasExitosos,
    eventosMenosExitosos,
    tendencias: {
      participacion: tendenciaParticipacion,
      asistencia: tendenciaAsistencia,
      valoracion: tendenciaValoracion,
    },
    recomendaciones,
    tipoEventoMasPopular,
    mejorMomentoParaEventos: {
      dia: analisisHorarios.mejorDiaSemana.dia,
      hora: analisisHorarios.mejorHora.hora,
    },
  };
};


