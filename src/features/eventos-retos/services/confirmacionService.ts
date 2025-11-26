// Servicio para gestión de solicitudes de confirmación de asistencia
import { Evento, Participante, SolicitudConfirmacion, RespuestaConfirmacion } from '../api/events';

/**
 * Personaliza el mensaje de confirmación con datos del evento y participante
 */
export const personalizarMensajeConfirmacion = (
  mensaje: string,
  evento: Evento,
  participante: Participante
): string => {
  const fechaInicio = new Date(evento.fechaInicio);
  const fechaFormateada = fechaInicio.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const horaFormateada = fechaInicio.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  let mensajePersonalizado = mensaje
    .replace(/{nombre}/g, participante.nombre)
    .replace(/{eventoNombre}/g, evento.nombre)
    .replace(/{eventoDescripcion}/g, evento.descripcion || '')
    .replace(/{fecha}/g, fechaFormateada)
    .replace(/{hora}/g, horaFormateada)
    .replace(/{ubicacion}/g, evento.ubicacion || evento.plataforma || evento.linkAcceso || 'Por confirmar')
    .replace(/{tipoEvento}/g, evento.tipo === 'presencial' ? 'evento presencial' : evento.tipo === 'virtual' ? 'webinar virtual' : 'reto');

  return mensajePersonalizado;
};

/**
 * Crea una solicitud de confirmación de asistencia
 */
export const crearSolicitudConfirmacion = async (
  evento: Evento,
  diasAnticipacion: number,
  mensaje: string,
  canal: 'email' | 'whatsapp' | 'ambos'
): Promise<SolicitudConfirmacion> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const fechaEvento = new Date(evento.fechaInicio);
  const fechaSolicitud = new Date();
  const fechaLimite = new Date(fechaEvento);
  fechaLimite.setDate(fechaLimite.getDate() - diasAnticipacion);

  const participantes = evento.participantesDetalle || [];
  const participantesActivos = participantes.filter(p => !p.fechaCancelacion);

  const solicitud: SolicitudConfirmacion = {
    id: `solicitud-conf-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    eventoId: evento.id,
    diasAnticipacion,
    fechaSolicitud,
    fechaLimite,
    mensaje,
    canal,
    estado: 'pendiente',
    participantesNotificados: participantesActivos.map(p => p.id),
    respuestas: [],
  };

  return solicitud;
};

/**
 * Envía la solicitud de confirmación a todos los participantes
 */
export const enviarSolicitudConfirmacion = async (
  evento: Evento,
  solicitud: SolicitudConfirmacion
): Promise<{ success: boolean; participantesNotificados: number }> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const participantes = evento.participantesDetalle || [];
  const participantesActivos = participantes.filter(p => !p.fechaCancelacion);

  let participantesNotificados = 0;

  // Enviar a cada participante
  for (const participante of participantesActivos) {
    const mensajePersonalizado = personalizarMensajeConfirmacion(
      solicitud.mensaje,
      evento,
      participante
    );

    // Marcar que se envió la solicitud
    participante.solicitudConfirmacionEnviada = true;
    participante.fechaSolicitudConfirmacion = new Date();
    participante.confirmacionAsistencia = 'pendiente';

    // Simular envío (en producción, aquí se enviaría el mensaje real)
    console.log('[ConfirmacionService] Enviando solicitud de confirmación:', {
      participante: participante.nombre,
      canal: solicitud.canal,
      mensaje: mensajePersonalizado.substring(0, 100) + '...',
    });

    participantesNotificados++;
  }

  solicitud.estado = 'enviada';

  return {
    success: true,
    participantesNotificados,
  };
};

/**
 * Procesa una respuesta de confirmación de un participante
 */
export const procesarRespuestaConfirmacion = async (
  evento: Evento,
  participanteId: string,
  respuesta: 'confirmado' | 'no-puede',
  motivo?: string
): Promise<{ success: boolean; mensaje: string }> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const participantes = evento.participantesDetalle || [];
  const participante = participantes.find(p => p.id === participanteId);

  if (!participante) {
    return { success: false, mensaje: 'Participante no encontrado' };
  }

  if (!evento.solicitudConfirmacion) {
    return { success: false, mensaje: 'No hay una solicitud de confirmación activa' };
  }

  // Actualizar estado del participante
  participante.confirmacionAsistencia = respuesta;
  participante.fechaConfirmacionAsistencia = new Date();

  if (respuesta === 'confirmado') {
    participante.confirmado = true;
  } else if (respuesta === 'no-puede') {
    participante.confirmado = false;
  }

  // Agregar respuesta a la solicitud
  const respuestaConfirmacion: RespuestaConfirmacion = {
    participanteId: participante.id,
    participanteNombre: participante.nombre,
    respuesta,
    fechaRespuesta: new Date(),
    motivo,
  };

  evento.solicitudConfirmacion.respuestas.push(respuestaConfirmacion);

  // Verificar si todas las respuestas fueron recibidas
  const totalParticipantes = evento.solicitudConfirmacion.participantesNotificados.length;
  const respuestasRecibidas = evento.solicitudConfirmacion.respuestas.length;

  if (respuestasRecibidas >= totalParticipantes) {
    evento.solicitudConfirmacion.estado = 'finalizada';
  }

  return {
    success: true,
    mensaje: respuesta === 'confirmado' 
      ? 'Confirmación recibida. ¡Te esperamos en el evento!'
      : 'Tu respuesta ha sido registrada. Gracias por avisar.',
  };
};

/**
 * Obtiene las estadísticas de confirmación de un evento
 */
export const obtenerEstadisticasConfirmacion = (evento: Evento): {
  total: number;
  confirmados: number;
  noPueden: number;
  pendientes: number;
  porcentajeConfirmados: number;
  porcentajeRespuestas: number;
} => {
  const participantes = evento.participantesDetalle || [];
  const participantesActivos = participantes.filter(p => !p.fechaCancelacion);

  const total = participantesActivos.length;
  const confirmados = participantesActivos.filter(
    p => p.confirmacionAsistencia === 'confirmado' || (p.confirmacionAsistencia === undefined && p.confirmado)
  ).length;
  const noPueden = participantesActivos.filter(
    p => p.confirmacionAsistencia === 'no-puede'
  ).length;
  const pendientes = participantesActivos.filter(
    p => p.confirmacionAsistencia === 'pendiente' || p.confirmacionAsistencia === undefined
  ).length;

  const porcentajeConfirmados = total > 0 ? (confirmados / total) * 100 : 0;
  const porcentajeRespuestas = total > 0 ? ((confirmados + noPueden) / total) * 100 : 0;

  return {
    total,
    confirmados,
    noPueden,
    pendientes,
    porcentajeConfirmados: Math.round(porcentajeConfirmados * 10) / 10,
    porcentajeRespuestas: Math.round(porcentajeRespuestas * 10) / 10,
  };
};

/**
 * Verifica si se puede enviar una solicitud de confirmación (X días antes del evento)
 */
export const puedeEnviarSolicitudConfirmacion = (
  evento: Evento,
  diasAnticipacion: number
): { puede: boolean; razon?: string } => {
  const fechaEvento = new Date(evento.fechaInicio);
  const ahora = new Date();
  const diasHastaEvento = Math.floor(
    (fechaEvento.getTime() - ahora.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diasHastaEvento < diasAnticipacion) {
    return {
      puede: false,
      razon: `El evento es en menos de ${diasAnticipacion} días. No se puede enviar la solicitud con ${diasAnticipacion} días de anticipación.`,
    };
  }

  if (evento.estado !== 'programado') {
    return {
      puede: false,
      razon: 'Solo se pueden enviar solicitudes de confirmación a eventos programados.',
    };
  }

  const participantes = evento.participantesDetalle || [];
  const participantesActivos = participantes.filter(p => !p.fechaCancelacion);

  if (participantesActivos.length === 0) {
    return {
      puede: false,
      razon: 'El evento no tiene participantes inscritos.',
    };
  }

  return { puede: true };
};


