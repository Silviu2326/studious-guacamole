// Servicio para notificaciones automáticas cuando se cancela o reprograma un evento

import { Evento, Participante } from '../api/events';
import { enviarMensajeGrupal } from './mensajesGrupalesService';

export interface CambioEvento {
  tipo: 'cancelacion' | 'reprogramacion' | 'estado';
  eventoAnterior: Evento;
  eventoNuevo: Evento;
  motivo?: string;
  fechaAnterior?: Date;
  fechaNueva?: Date;
  estadoAnterior?: string;
  estadoNuevo?: string;
}

/**
 * Detecta si hubo cambios relevantes que requieren notificación
 */
export const detectarCambiosRelevantes = (
  eventoAnterior: Evento,
  eventoNuevo: Evento
): CambioEvento | null => {
  const cambios: CambioEvento = {
    tipo: 'estado',
    eventoAnterior,
    eventoNuevo,
  };

  // Detectar cancelación (prioritario)
  if (eventoAnterior.estado !== 'cancelado' && eventoNuevo.estado === 'cancelado') {
    return {
      ...cambios,
      tipo: 'cancelacion',
      estadoAnterior: eventoAnterior.estado,
      estadoNuevo: eventoNuevo.estado,
    };
  }

  // Detectar reprogramación (cambio de fecha) - solo si no se canceló
  const fechaAnterior = new Date(eventoAnterior.fechaInicio).getTime();
  const fechaNueva = new Date(eventoNuevo.fechaInicio).getTime();
  
  // Considerar cambio de fecha si la diferencia es mayor a 1 minuto
  // y el evento no fue cancelado
  if (eventoNuevo.estado !== 'cancelado' && Math.abs(fechaNueva - fechaAnterior) > 60000) {
    return {
      ...cambios,
      tipo: 'reprogramacion',
      fechaAnterior: eventoAnterior.fechaInicio,
      fechaNueva: eventoNuevo.fechaInicio,
    };
  }

  // Detectar cambio de estado relevante (solo si no es cancelación ni reprogramación)
  if (
    eventoAnterior.estado !== eventoNuevo.estado &&
    eventoAnterior.estado !== 'cancelado' &&
    eventoNuevo.estado !== 'cancelado' &&
    (eventoAnterior.estado === 'programado' || eventoAnterior.estado === 'en-curso') &&
    (eventoNuevo.estado === 'finalizado' || eventoNuevo.estado === 'en-curso')
  ) {
    return {
      ...cambios,
      tipo: 'estado',
      estadoAnterior: eventoAnterior.estado,
      estadoNuevo: eventoNuevo.estado,
    };
  }

  return null;
};

/**
 * Genera plantilla de notificación automática según el tipo de cambio
 */
export const generarPlantillaNotificacion = (
  cambio: CambioEvento,
  motivo?: string
): string => {
  const evento = cambio.eventoNuevo;
  const fechaFormateada = (fecha: Date) => {
    return fecha.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  switch (cambio.tipo) {
    case 'cancelacion':
      return `Hola {nombre},

Lamentamos informarte que el evento "{eventoNombre}" ha sido cancelado.

${motivo ? `Motivo: ${motivo}\n\n` : ''}Si tenías alguna pregunta o necesitas más información, no dudes en contactarnos.

Sentimos las molestias y esperamos verte en futuros eventos.

Saludos,
Equipo de Entrenamiento`;

    case 'reprogramacion':
      const fechaAnteriorStr = cambio.fechaAnterior
        ? fechaFormateada(cambio.fechaAnterior)
        : 'la fecha original';
      const fechaNuevaStr = cambio.fechaNueva
        ? fechaFormateada(cambio.fechaNueva)
        : 'nueva fecha';

      return `Hola {nombre},

Te informamos que el evento "{eventoNombre}" ha sido reprogramado.

Fecha anterior: ${fechaAnteriorStr}
Nueva fecha: ${fechaNuevaStr}

${motivo ? `Motivo del cambio: ${motivo}\n\n` : ''}${evento.ubicacion ? `Ubicación: ${evento.ubicacion}\n\n` : ''}${evento.plataforma ? `Plataforma: ${evento.plataforma}\n${evento.linkAcceso ? `Link de acceso: ${evento.linkAcceso}\n\n` : '\n'}` : ''}Esperamos verte en la nueva fecha.

Si tienes alguna pregunta o no puedes asistir, por favor contáctanos.

Saludos,
Equipo de Entrenamiento`;

    case 'estado':
      if (cambio.estadoNuevo === 'finalizado') {
        return `Hola {nombre},

El evento "{eventoNombre}" ha finalizado.

Esperamos que hayas disfrutado la experiencia. Si tienes algún comentario o sugerencia, no dudes en compartirlo con nosotros.

¡Gracias por tu participación!

Saludos,
Equipo de Entrenamiento`;
      }
      return `Hola {nombre},

Te informamos sobre un cambio en el evento "{eventoNombre}".

Estado anterior: ${cambio.estadoAnterior}
Nuevo estado: ${cambio.estadoNuevo}

${motivo ? `Motivo: ${motivo}\n\n` : ''}Si tienes alguna pregunta, no dudes en contactarnos.

Saludos,
Equipo de Entrenamiento`;

    default:
      return `Hola {nombre},

Te informamos sobre un cambio en el evento "{eventoNombre}".

${motivo ? `Motivo: ${motivo}\n\n` : ''}Si tienes alguna pregunta, no dudes en contactarnos.

Saludos,
Equipo de Entrenamiento`;
  }
};

/**
 * Personaliza el mensaje de notificación para un participante
 */
export const personalizarNotificacionCambio = (
  plantilla: string,
  evento: Evento,
  participante: Participante,
  cambio: CambioEvento
): string => {
  let mensaje = plantilla;

  // Reemplazar variables
  mensaje = mensaje.replace(/{nombre}/g, participante.nombre || 'Participante');
  mensaje = mensaje.replace(/{eventoNombre}/g, evento.nombre);
  mensaje = mensaje.replace(/{fecha}/g, evento.fechaInicio.toLocaleDateString('es-ES'));
  mensaje = mensaje.replace(/{hora}/g, evento.fechaInicio.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
  mensaje = mensaje.replace(/{ubicacion}/g, evento.ubicacion || 'No especificada');
  mensaje = mensaje.replace(/{eventoDescripcion}/g, evento.descripcion || '');

  return mensaje;
};

/**
 * Envía notificaciones a todos los participantes sobre el cambio
 */
export const enviarNotificacionCambioEvento = async (
  cambio: CambioEvento,
  motivo?: string,
  canal: 'email' | 'whatsapp' | 'ambos' = 'ambos',
  enviadoPor: string = '',
  enviadoPorNombre: string = 'Sistema'
): Promise<{
  success: boolean;
  participantesNotificados: number;
  mensaje?: any;
}> => {
  const evento = cambio.eventoNuevo;
  const participantes = evento.participantesDetalle || [];
  
  // Filtrar solo participantes activos (no cancelados)
  const participantesActivos = participantes.filter(p => !p.fechaCancelacion);

  if (participantesActivos.length === 0) {
    return {
      success: false,
      participantesNotificados: 0,
    };
  }

  // Generar plantilla
  const plantilla = generarPlantillaNotificacion(cambio, motivo);

  // Determinar título del mensaje
  let titulo = '';
  switch (cambio.tipo) {
    case 'cancelacion':
      titulo = `Evento Cancelado: ${evento.nombre}`;
      break;
    case 'reprogramacion':
      titulo = `Evento Reprogramado: ${evento.nombre}`;
      break;
    case 'estado':
      titulo = `Cambio en Evento: ${evento.nombre}`;
      break;
  }

  // Personalizar mensaje para cada participante
  const variablesAdicionales: Record<string, string> = {};
  if (cambio.tipo === 'reprogramacion' && cambio.fechaAnterior && cambio.fechaNueva) {
    variablesAdicionales.fechaAnterior = cambio.fechaAnterior.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    variablesAdicionales.fechaNueva = cambio.fechaNueva.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Enviar mensaje grupal usando el servicio existente
  try {
    const mensajeGrupal = await enviarMensajeGrupal(
      evento,
      plantilla,
      canal,
      enviadoPor || evento.creadoPor,
      enviadoPorNombre,
      undefined,
      titulo,
      variablesAdicionales
    );

    return {
      success: true,
      participantesNotificados: participantesActivos.length,
      mensaje: mensajeGrupal,
    };
  } catch (error) {
    console.error('Error enviando notificación de cambio de evento:', error);
    return {
      success: false,
      participantesNotificados: 0,
    };
  }
};

