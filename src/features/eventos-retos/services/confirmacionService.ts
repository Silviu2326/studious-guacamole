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
 * Genera un token único para confirmación de asistencia
 */
export const generarTokenConfirmacion = (eventoId: string, participanteId: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `${eventoId}-${participanteId}-${timestamp}-${random}`;
};

/**
 * Valida un token de confirmación y extrae información
 */
export const validarTokenConfirmacion = (token: string): { eventoId: string; participanteId: string } | null => {
  try {
    const partes = token.split('-');
    if (partes.length < 4) {
      return null;
    }
    // El token tiene formato: eventoId-participanteId-timestamp-random
    const eventoId = partes[0];
    const participanteId = partes[1];
    return { eventoId, participanteId };
  } catch (error) {
    return null;
  }
};

/**
 * Envía solicitud de confirmación a participantes específicos con tokens únicos
 * 
 * NOTA: En producción, esto se conectaría a proveedores de email (SendGrid, Mailgun, etc.)
 * o WhatsApp API (Twilio, WhatsApp Business API) para el envío real de mensajes.
 * Los tokens se incluirían en los links de confirmación dentro de los mensajes.
 * 
 * @param eventId ID del evento
 * @param participantes Array de IDs de participantes a notificar
 * @returns Resultado del envío con tokens generados
 */
export const enviarSolicitudConfirmacion = async (
  eventId: string,
  participantes: string[]
): Promise<{
  success: boolean;
  participantesNotificados: number;
  tokensGenerados: Array<{ participanteId: string; token: string }>;
}> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  // Obtener el evento
  const eventosStorage = localStorage.getItem('eventos');
  if (!eventosStorage) {
    throw new Error('No se encontraron eventos');
  }

  const eventos: Evento[] = JSON.parse(eventosStorage).map((e: any) => ({
    ...e,
    fechaInicio: new Date(e.fechaInicio),
    fechaFin: e.fechaFin ? new Date(e.fechaFin) : undefined,
    createdAt: new Date(e.createdAt),
    participantesDetalle: e.participantesDetalle?.map((p: any) => ({
      ...p,
      fechaInscripcion: new Date(p.fechaInscripcion),
      fechaCancelacion: p.fechaCancelacion ? new Date(p.fechaCancelacion) : undefined,
    })) || [],
  }));

  const evento = eventos.find(e => e.id === eventId);
  if (!evento) {
    throw new Error('Evento no encontrado');
  }

  const participantesDetalle = evento.participantesDetalle || [];
  const participantesActivos = participantesDetalle.filter(
    p => participantes.includes(p.id) && !p.fechaCancelacion
  );

  let participantesNotificados = 0;
  const tokensGenerados: Array<{ participanteId: string; token: string }> = [];

  // Crear o actualizar solicitud de confirmación
  if (!evento.solicitudConfirmacion) {
    const fechaEvento = new Date(evento.fechaInicio);
    const fechaSolicitud = new Date();
    const fechaLimite = new Date(fechaEvento);
    fechaLimite.setDate(fechaLimite.getDate() - 1); // Por defecto 1 día antes

    evento.solicitudConfirmacion = {
      id: `solicitud-conf-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      eventoId: evento.id,
      diasAnticipacion: 1,
      fechaSolicitud,
      fechaLimite,
      mensaje: 'Por favor, confirma tu asistencia al evento {eventoNombre} el {fecha} a las {hora}.',
      canal: 'ambos',
      estado: 'pendiente',
      participantesNotificados: [],
      respuestas: [],
    };
  }

  // Enviar a cada participante
  for (const participante of participantesActivos) {
    // Generar token único
    const token = generarTokenConfirmacion(eventoId, participante.id);
    tokensGenerados.push({ participanteId: participante.id, token });

    const mensajePersonalizado = personalizarMensajeConfirmacion(
      evento.solicitudConfirmacion.mensaje,
      evento,
      participante
    );

    // Agregar link de confirmación con token al mensaje
    const linkConfirmacion = `${window.location.origin}/eventos/confirmar/${token}`;
    const mensajeConLink = `${mensajePersonalizado}\n\nConfirma tu asistencia aquí: ${linkConfirmacion}`;

    // Marcar que se envió la solicitud
    participante.solicitudConfirmacionEnviada = true;
    participante.fechaSolicitudConfirmacion = new Date();
    participante.confirmacionAsistencia = 'pendiente';

    // Simular envío (en producción, aquí se enviaría el mensaje real)
    console.log('[ConfirmacionService] Enviando solicitud de confirmación:', {
      participante: participante.nombre,
      token,
      linkConfirmacion,
      mensaje: mensajeConLink.substring(0, 100) + '...',
    });

    participantesNotificados++;
  }

  // Actualizar solicitud
  evento.solicitudConfirmacion.participantesNotificados = [
    ...new Set([...evento.solicitudConfirmacion.participantesNotificados, ...participantesActivos.map(p => p.id)]),
  ];
  evento.solicitudConfirmacion.estado = 'enviada';

  // Guardar evento actualizado
  const eventosActualizados = eventos.map(e => (e.id === eventId ? evento : e));
  localStorage.setItem('eventos', JSON.stringify(eventosActualizados));

  return {
    success: true,
    participantesNotificados,
    tokensGenerados,
  };
};

/**
 * Procesa una respuesta de confirmación usando un token único
 * 
 * NOTA: En producción, esto se llamaría desde una página pública donde el participante
 * hace clic en el link de confirmación que contiene el token. El token se validaría
 * y se actualizaría el estado de asistencia del participante.
 * 
 * @param token Token único de confirmación
 * @param respuesta Respuesta del participante: 'confirmado' o 'no-puede'
 * @param motivo Motivo opcional si no puede asistir
 * @returns Resultado del procesamiento
 */
export const procesarRespuestaConfirmacion = async (
  token: string,
  respuesta: 'confirmado' | 'no-puede',
  motivo?: string
): Promise<{ success: boolean; mensaje: string }> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  // Validar token
  const tokenInfo = validarTokenConfirmacion(token);
  if (!tokenInfo) {
    return { success: false, mensaje: 'Token inválido o expirado' };
  }

  const { eventoId, participanteId } = tokenInfo;

  // Obtener el evento
  const eventosStorage = localStorage.getItem('eventos');
  if (!eventosStorage) {
    return { success: false, mensaje: 'Evento no encontrado' };
  }

  const eventos: Evento[] = JSON.parse(eventosStorage).map((e: any) => ({
    ...e,
    fechaInicio: new Date(e.fechaInicio),
    fechaFin: e.fechaFin ? new Date(e.fechaFin) : undefined,
    createdAt: new Date(e.createdAt),
    participantesDetalle: e.participantesDetalle?.map((p: any) => ({
      ...p,
      fechaInscripcion: new Date(p.fechaInscripcion),
      fechaCancelacion: p.fechaCancelacion ? new Date(p.fechaCancelacion) : undefined,
    })) || [],
    solicitudConfirmacion: e.solicitudConfirmacion ? {
      ...e.solicitudConfirmacion,
      fechaSolicitud: new Date(e.solicitudConfirmacion.fechaSolicitud),
      fechaLimite: new Date(e.solicitudConfirmacion.fechaLimite),
      respuestas: e.solicitudConfirmacion.respuestas?.map((r: any) => ({
        ...r,
        fechaRespuesta: new Date(r.fechaRespuesta),
      })) || [],
    } : undefined,
  }));

  const evento = eventos.find(e => e.id === eventoId);
  if (!evento) {
    return { success: false, mensaje: 'Evento no encontrado' };
  }

  const participantes = evento.participantesDetalle || [];
  const participante = participantes.find(p => p.id === participanteId);

  if (!participante) {
    return { success: false, mensaje: 'Participante no encontrado' };
  }

  if (!evento.solicitudConfirmacion) {
    return { success: false, mensaje: 'No hay una solicitud de confirmación activa' };
  }

  // Verificar si ya respondió
  const yaRespondio = evento.solicitudConfirmacion.respuestas.some(
    r => r.participanteId === participanteId
  );

  if (yaRespondio) {
    return { success: false, mensaje: 'Ya has respondido a esta solicitud de confirmación' };
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

  // Guardar evento actualizado
  const eventosActualizados = eventos.map(e => (e.id === eventoId ? evento : e));
  localStorage.setItem('eventos', JSON.stringify(eventosActualizados));

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


