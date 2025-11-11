// Servicio para gestión de encuestas post-evento y feedback

import { Evento, Participante } from '../api/events';

export interface PreguntaEncuesta {
  id: string;
  texto: string;
  tipo: 'texto' | 'rating' | 'opcion';
  orden: number;
  requerida: boolean;
}

export interface RespuestaEncuesta {
  participanteId: string;
  participanteNombre: string;
  participanteEmail?: string;
  preguntaId: string;
  respuesta: string | number; // Texto, rating (1-5), o índice de opción
  fechaRespuesta: Date;
}

export interface EncuestaPostEvento {
  id: string;
  eventoId: string;
  eventoNombre: string;
  preguntas: PreguntaEncuesta[];
  fechaCreacion: Date;
  fechaEnvio?: Date;
  fechaCierre?: Date;
  estado: 'pendiente' | 'enviada' | 'cerrada';
  respuestas: RespuestaEncuesta[];
  participantesNotificados: string[]; // IDs de participantes a quienes se envió
  enviarAutomaticamente: boolean;
  horasDespuesEvento: number; // Horas después de que termine el evento para enviar
}

export interface EstadisticasFeedback {
  totalParticipantes: number;
  totalRespuestas: number;
  tasaRespuesta: number; // Porcentaje
  satisfaccionPromedio: number; // Promedio de ratings (1-5)
  distribucionRatings: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  comentariosDestacados: Array<{
    participanteNombre: string;
    comentario: string;
    rating?: number;
    fecha: Date;
  }>;
  comentariosNegativos: Array<{
    participanteNombre: string;
    comentario: string;
    rating?: number;
    fecha: Date;
  }>;
  preguntasConMejoresRespuestas: Array<{
    preguntaId: string;
    preguntaTexto: string;
    promedio: number;
  }>;
  preguntasConPeoresRespuestas: Array<{
    preguntaId: string;
    preguntaTexto: string;
    promedio: number;
  }>;
}

// Preguntas predeterminadas para encuestas post-evento
const PREGUNTAS_PREDETERMINADAS: PreguntaEncuesta[] = [
  {
    id: 'q1',
    texto: '¿Cómo calificarías tu experiencia general en este evento?',
    tipo: 'rating',
    orden: 1,
    requerida: true,
  },
  {
    id: 'q2',
    texto: '¿Qué te gustó más del evento?',
    tipo: 'texto',
    orden: 2,
    requerida: false,
  },
  {
    id: 'q3',
    texto: '¿Qué mejorarías o cambiarías?',
    tipo: 'texto',
    orden: 3,
    requerida: false,
  },
  {
    id: 'q4',
    texto: '¿Recomendarías este evento a otros?',
    tipo: 'rating',
    orden: 4,
    requerida: true,
  },
];

/**
 * Crea una encuesta post-evento para un evento
 */
export const crearEncuestaPostEvento = (
  evento: Evento,
  preguntasPersonalizadas?: PreguntaEncuesta[],
  enviarAutomaticamente: boolean = true,
  horasDespuesEvento: number = 24
): EncuestaPostEvento => {
  const preguntas = preguntasPersonalizadas || PREGUNTAS_PREDETERMINADAS;

  return {
    id: `encuesta_${evento.id}_${Date.now()}`,
    eventoId: evento.id,
    eventoNombre: evento.nombre,
    preguntas,
    fechaCreacion: new Date(),
    estado: 'pendiente',
    respuestas: [],
    participantesNotificados: [],
    enviarAutomaticamente,
    horasDespuesEvento,
  };
};

/**
 * Guarda una encuesta en localStorage
 */
export const guardarEncuesta = (encuesta: EncuestaPostEvento): void => {
  const encuestas = obtenerTodasLasEncuestas();
  const index = encuestas.findIndex(e => e.id === encuesta.id);
  
  if (index >= 0) {
    encuestas[index] = encuesta;
  } else {
    encuestas.push(encuesta);
  }
  
  localStorage.setItem('encuestas-post-evento', JSON.stringify(encuestas));
};

/**
 * Obtiene todas las encuestas
 */
export const obtenerTodasLasEncuestas = (): EncuestaPostEvento[] => {
  const encuestasStorage = localStorage.getItem('encuestas-post-evento');
  if (!encuestasStorage) {
    return [];
  }

  try {
    return JSON.parse(encuestasStorage).map((e: any) => ({
      ...e,
      fechaCreacion: new Date(e.fechaCreacion),
      fechaEnvio: e.fechaEnvio ? new Date(e.fechaEnvio) : undefined,
      fechaCierre: e.fechaCierre ? new Date(e.fechaCierre) : undefined,
      respuestas: e.respuestas?.map((r: any) => ({
        ...r,
        fechaRespuesta: new Date(r.fechaRespuesta),
      })) || [],
    }));
  } catch (error) {
    console.error('Error cargando encuestas:', error);
    return [];
  }
};

/**
 * Obtiene una encuesta por ID de evento
 */
export const obtenerEncuestaPorEvento = (eventoId: string): EncuestaPostEvento | null => {
  const encuestas = obtenerTodasLasEncuestas();
  return encuestas.find(e => e.eventoId === eventoId) || null;
};

/**
 * Envía la encuesta a los participantes del evento
 */
export const enviarEncuestaPostEvento = async (
  encuesta: EncuestaPostEvento,
  participantes: Participante[]
): Promise<{ success: boolean; mensaje: string; participantesNotificados: number }> => {
  try {
    // Filtrar participantes que asistieron o estuvieron inscritos
    const participantesActivos = participantes.filter(
      p => !p.fechaCancelacion && (p.asistencia || p.confirmado)
    );

    // Simular envío de encuestas (en producción, esto enviaría emails/WhatsApp)
    const participantesNotificados = participantesActivos.map(p => p.id);

    encuesta.participantesNotificados = participantesNotificados;
    encuesta.fechaEnvio = new Date();
    encuesta.estado = 'enviada';

    guardarEncuesta(encuesta);

    return {
      success: true,
      mensaje: `Encuesta enviada a ${participantesNotificados.length} participantes`,
      participantesNotificados: participantesNotificados.length,
    };
  } catch (error) {
    console.error('Error enviando encuesta:', error);
    return {
      success: false,
      mensaje: 'Error al enviar la encuesta',
      participantesNotificados: 0,
    };
  }
};

/**
 * Procesa una respuesta de encuesta
 */
export const procesarRespuestaEncuesta = (
  encuesta: EncuestaPostEvento,
  participanteId: string,
  participanteNombre: string,
  participanteEmail: string | undefined,
  respuestas: Array<{ preguntaId: string; respuesta: string | number }>
): void => {
  const nuevasRespuestas: RespuestaEncuesta[] = respuestas.map(resp => ({
    participanteId,
    participanteNombre,
    participanteEmail,
    preguntaId: resp.preguntaId,
    respuesta: resp.respuesta,
    fechaRespuesta: new Date(),
  }));

  encuesta.respuestas = [...encuesta.respuestas, ...nuevasRespuestas];
  guardarEncuesta(encuesta);
};

/**
 * Calcula estadísticas de feedback para una encuesta
 */
export const calcularEstadisticasFeedback = (encuesta: EncuestaPostEvento): EstadisticasFeedback => {
  const totalParticipantes = encuesta.participantesNotificados.length;
  const respuestasPorParticipante = new Map<string, RespuestaEncuesta[]>();
  
  // Agrupar respuestas por participante
  encuesta.respuestas.forEach(resp => {
    const respuestas = respuestasPorParticipante.get(resp.participanteId) || [];
    respuestas.push(resp);
    respuestasPorParticipante.set(resp.participanteId, respuestas);
  });

  const totalRespuestas = respuestasPorParticipante.size;
  const tasaRespuesta = totalParticipantes > 0 
    ? (totalRespuestas / totalParticipantes) * 100 
    : 0;

  // Calcular ratings (solo preguntas de tipo rating)
  const ratings: number[] = [];
  const distribucionRatings = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  
  encuesta.respuestas.forEach(resp => {
    const pregunta = encuesta.preguntas.find(p => p.id === resp.preguntaId);
    if (pregunta?.tipo === 'rating' && typeof resp.respuesta === 'number') {
      const rating = resp.respuesta;
      ratings.push(rating);
      if (rating >= 1 && rating <= 5) {
        distribucionRatings[rating as keyof typeof distribucionRatings]++;
      }
    }
  });

  const satisfaccionPromedio = ratings.length > 0
    ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
    : 0;

  // Obtener comentarios (preguntas de tipo texto)
  const comentarios: Array<{
    participanteNombre: string;
    comentario: string;
    rating?: number;
    fecha: Date;
  }> = [];

  encuesta.respuestas.forEach(resp => {
    const pregunta = encuesta.preguntas.find(p => p.id === resp.preguntaId);
    if (pregunta?.tipo === 'texto' && typeof resp.respuesta === 'string' && resp.respuesta.trim()) {
      // Buscar rating del mismo participante
      const ratingResp = encuesta.respuestas.find(
        r => r.participanteId === resp.participanteId && 
        encuesta.preguntas.find(p => p.id === r.preguntaId)?.tipo === 'rating'
      );
      
      comentarios.push({
        participanteNombre: resp.participanteNombre,
        comentario: resp.respuesta,
        rating: typeof ratingResp?.respuesta === 'number' ? ratingResp.respuesta : undefined,
        fecha: resp.fechaRespuesta,
      });
    }
  });

  // Separar comentarios destacados (rating >= 4) y negativos (rating <= 2)
  const comentariosDestacados = comentarios.filter(c => !c.rating || c.rating >= 4);
  const comentariosNegativos = comentarios.filter(c => c.rating && c.rating <= 2);

  // Calcular promedios por pregunta
  const promediosPorPregunta: Array<{
    preguntaId: string;
    preguntaTexto: string;
    promedio: number;
    totalRespuestas: number;
  }> = [];

  encuesta.preguntas.forEach(pregunta => {
    if (pregunta.tipo === 'rating') {
      const respuestasPregunta = encuesta.respuestas.filter(r => r.preguntaId === pregunta.id);
      const ratingsPregunta = respuestasPregunta
        .filter(r => typeof r.respuesta === 'number')
        .map(r => r.respuesta as number);
      
      if (ratingsPregunta.length > 0) {
        const promedio = ratingsPregunta.reduce((sum, r) => sum + r, 0) / ratingsPregunta.length;
        promediosPorPregunta.push({
          preguntaId: pregunta.id,
          preguntaTexto: pregunta.texto,
          promedio,
          totalRespuestas: ratingsPregunta.length,
        });
      }
    }
  });

  // Ordenar por promedio (mejores primero, luego peores)
  const preguntasConMejoresRespuestas = [...promediosPorPregunta]
    .sort((a, b) => b.promedio - a.promedio)
    .slice(0, 3);
  
  const preguntasConPeoresRespuestas = [...promediosPorPregunta]
    .sort((a, b) => a.promedio - b.promedio)
    .slice(0, 3);

  return {
    totalParticipantes,
    totalRespuestas,
    tasaRespuesta: Math.round(tasaRespuesta * 10) / 10,
    satisfaccionPromedio: Math.round(satisfaccionPromedio * 100) / 100,
    distribucionRatings,
    comentariosDestacados: comentariosDestacados.slice(0, 10), // Top 10
    comentariosNegativos: comentariosNegativos.slice(0, 10), // Top 10
    preguntasConMejoresRespuestas,
    preguntasConPeoresRespuestas,
  };
};

/**
 * Verifica y envía encuestas automáticamente para eventos finalizados
 */
export const verificarYEnviarEncuestasAutomaticas = async (eventos: Evento[]): Promise<void> => {
  const ahora = new Date();
  const encuestas = obtenerTodasLasEncuestas();

  eventos.forEach(evento => {
    // Solo procesar eventos finalizados
    if (evento.estado !== 'finalizado') {
      return;
    }

    // Verificar si ya existe una encuesta para este evento
    let encuesta = encuestas.find(e => e.eventoId === evento.id);
    
    // Si no existe y el evento tiene participantes, crear encuesta automática
    if (!encuesta && evento.participantesDetalle && evento.participantesDetalle.length > 0) {
      encuesta = crearEncuestaPostEvento(evento, undefined, true, 24);
      guardarEncuesta(encuesta);
    }

    // Si la encuesta existe y está configurada para envío automático
    if (encuesta && encuesta.enviarAutomaticamente && encuesta.estado === 'pendiente') {
      // Calcular cuándo debe enviarse (horas después de que termine el evento)
      const fechaFinEvento = evento.fechaFin || evento.fechaInicio;
      const fechaEnvio = new Date(fechaFinEvento);
      fechaEnvio.setHours(fechaEnvio.getHours() + encuesta.horasDespuesEvento);

      // Si ya pasó el tiempo de envío, enviar la encuesta
      if (ahora >= fechaEnvio) {
        enviarEncuestaPostEvento(encuesta, evento.participantesDetalle || []);
      }
    }
  });
};

/**
 * Inicia la verificación periódica de encuestas automáticas
 */
export const iniciarVerificacionEncuestasAutomaticas = (): NodeJS.Timeout => {
  // Verificar cada hora
  return setInterval(() => {
    const eventosStorage = localStorage.getItem('eventos');
    if (eventosStorage) {
      try {
        const eventos: Evento[] = JSON.parse(eventosStorage).map((e: any) => ({
          ...e,
          fechaInicio: new Date(e.fechaInicio),
          fechaFin: e.fechaFin ? new Date(e.fechaFin) : undefined,
          createdAt: new Date(e.createdAt),
        }));
        verificarYEnviarEncuestasAutomaticas(eventos);
      } catch (error) {
        console.error('Error verificando encuestas automáticas:', error);
      }
    }
  }, 60 * 60 * 1000); // Cada hora
};


