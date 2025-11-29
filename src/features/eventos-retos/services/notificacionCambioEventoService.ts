/**
 * Servicio para notificaciones automáticas cuando se cancela o reprograma un evento
 * 
 * Este servicio se utiliza para:
 * - DashboardMetricasGenerales.tsx: Para mostrar notificaciones de cambios en eventos
 * - DashboardProgresoRetos.tsx: Para notificar cambios en retos
 * - ClientEventHistory.tsx: Para mostrar historial de cambios de eventos a clientes
 */

import { Evento, Participante } from '../api/events';
import { enviarMensajeGrupal } from './mensajesGrupalesService';

/**
 * Tipo de cambio detectado en un evento
 */
export type TipoCambio = 'fecha' | 'hora' | 'ubicacion' | 'precio' | 'estado' | 'cancelacion' | 'reprogramacion';

/**
 * Cambio relevante detectado en un evento
 */
export interface CambioRelevante {
  tipo: TipoCambio;
  campo: string; // Nombre del campo que cambió
  valorAnterior: any;
  valorNuevo: any;
  descripcion: string; // Descripción legible del cambio
}

/**
 * Cambio de evento con lista de cambios relevantes
 */
export interface CambioEvento {
  tipo: TipoCambio;
  eventoAnterior: Evento;
  eventoNuevo: Evento;
  cambios: CambioRelevante[]; // Lista de cambios importantes detectados
  motivo?: string;
  fechaAnterior?: Date;
  fechaNueva?: Date;
  estadoAnterior?: string;
  estadoNuevo?: string;
}

/**
 * Detecta cambios relevantes que requieren notificación a participantes
 * 
 * Detecta cambios en:
 * - Fecha: cambio en fechaInicio
 * - Hora: cambio en la hora de fechaInicio
 * - Ubicación: cambio en ubicacion o ubicacionId
 * - Precio: cambio en precio o preciosPorTipoCliente
 * - Estado: cambio en estado del evento
 * 
 * @param eventoAntes Evento antes del cambio
 * @param eventoDespues Evento después del cambio
 * @returns Lista de cambios relevantes detectados, o null si no hay cambios relevantes
 */
export const detectarCambiosRelevantes = (
  eventoAntes: Evento,
  eventoDespues: Evento
): CambioRelevante[] => {
  const cambios: CambioRelevante[] = [];

  // Detectar cambio de fecha (día diferente)
  const fechaAntes = new Date(eventoAntes.fechaInicio);
  const fechaDespues = new Date(eventoDespues.fechaInicio);
  const diaAntes = fechaAntes.toDateString();
  const diaDespues = fechaDespues.toDateString();
  
  if (diaAntes !== diaDespues) {
    cambios.push({
      tipo: 'fecha',
      campo: 'fechaInicio',
      valorAnterior: fechaAntes,
      valorNuevo: fechaDespues,
      descripcion: `Fecha cambió de ${fechaAntes.toLocaleDateString('es-ES')} a ${fechaDespues.toLocaleDateString('es-ES')}`,
    });
  }

  // Detectar cambio de hora (mismo día pero hora diferente)
  const horaAntes = fechaAntes.getHours() * 60 + fechaAntes.getMinutes();
  const horaDespues = fechaDespues.getHours() * 60 + fechaDespues.getMinutes();
  
  if (diaAntes === diaDespues && Math.abs(horaDespues - horaAntes) > 0) {
    cambios.push({
      tipo: 'hora',
      campo: 'fechaInicio',
      valorAnterior: fechaAntes,
      valorNuevo: fechaDespues,
      descripcion: `Hora cambió de ${fechaAntes.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} a ${fechaDespues.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`,
    });
  }

  // Detectar cambio de ubicación
  const ubicacionAntes = eventoAntes.ubicacion || eventoAntes.ubicacionId || '';
  const ubicacionDespues = eventoDespues.ubicacion || eventoDespues.ubicacionId || '';
  
  if (ubicacionAntes !== ubicacionDespues) {
    cambios.push({
      tipo: 'ubicacion',
      campo: 'ubicacion',
      valorAnterior: ubicacionAntes,
      valorNuevo: ubicacionDespues,
      descripcion: `Ubicación cambió de "${ubicacionAntes || 'No especificada'}" a "${ubicacionDespues || 'No especificada'}"`,
    });
  }

  // Detectar cambio de precio
  const precioAntes = eventoAntes.precio || 0;
  const precioDespues = eventoDespues.precio || 0;
  
  if (precioAntes !== precioDespues) {
    cambios.push({
      tipo: 'precio',
      campo: 'precio',
      valorAnterior: precioAntes,
      valorNuevo: precioDespues,
      descripcion: `Precio cambió de ${precioAntes}€ a ${precioDespues}€`,
    });
  }

  // Detectar cambio en precios por tipo de cliente
  const preciosTipoAntes = JSON.stringify(eventoAntes.preciosPorTipoCliente || {});
  const preciosTipoDespues = JSON.stringify(eventoDespues.preciosPorTipoCliente || {});
  
  if (preciosTipoAntes !== preciosTipoDespues) {
    cambios.push({
      tipo: 'precio',
      campo: 'preciosPorTipoCliente',
      valorAnterior: eventoAntes.preciosPorTipoCliente,
      valorNuevo: eventoDespues.preciosPorTipoCliente,
      descripcion: 'Los precios por tipo de cliente han cambiado',
    });
  }

  // Detectar cambio de estado
  if (eventoAntes.estado !== eventoDespues.estado) {
    cambios.push({
      tipo: 'estado',
      campo: 'estado',
      valorAnterior: eventoAntes.estado,
      valorNuevo: eventoDespues.estado,
      descripcion: `Estado cambió de "${eventoAntes.estado}" a "${eventoDespues.estado}"`,
    });
  }

  return cambios;
};

/**
 * Función legacy para compatibilidad - detecta cambios y retorna CambioEvento
 * @deprecated Usar detectarCambiosRelevantes directamente
 */
export const detectarCambiosRelevantesLegacy = (
  eventoAnterior: Evento,
  eventoNuevo: Evento
): CambioEvento | null => {
  const cambiosDetectados = detectarCambiosRelevantes(eventoAnterior, eventoNuevo);
  
  if (cambiosDetectados.length === 0) {
    return null;
  }

  // Determinar tipo principal de cambio
  let tipoPrincipal: TipoCambio = 'estado';
  
  // Prioridad: cancelación > reprogramación > otros cambios
  const tieneCancelacion = cambiosDetectados.some(c => c.tipo === 'estado' && eventoNuevo.estado === 'cancelado');
  const tieneReprogramacion = cambiosDetectados.some(c => c.tipo === 'fecha' || c.tipo === 'hora');
  
  if (tieneCancelacion) {
    tipoPrincipal = 'cancelacion';
  } else if (tieneReprogramacion) {
    tipoPrincipal = 'reprogramacion';
  } else {
    // Usar el primer tipo de cambio relevante
    tipoPrincipal = cambiosDetectados[0].tipo;
  }

  return {
    tipo: tipoPrincipal,
    eventoAnterior,
    eventoNuevo,
    cambios: cambiosDetectados,
    fechaAnterior: eventoAnterior.fechaInicio,
    fechaNueva: eventoNuevo.fechaInicio,
    estadoAnterior: eventoAnterior.estado,
    estadoNuevo: eventoNuevo.estado,
  };
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
 * Notifica cambios a participantes de un evento
 * 
 * Simula el envío de notificaciones a todos los participantes con un mensaje resumen
 * de los cambios detectados.
 * 
 * @param eventId ID del evento
 * @param cambios Lista de cambios relevantes detectados
 * @param motivo Motivo opcional del cambio
 * @param canal Canal de comunicación ('email', 'whatsapp', 'ambos')
 * @param enviadoPor ID del usuario que realizó el cambio
 * @param enviadoPorNombre Nombre del usuario que realizó el cambio
 * @returns Resultado de la notificación con número de participantes notificados
 */
export const notificarCambiosAparticipantes = async (
  eventId: string,
  cambios: CambioRelevante[],
  motivo?: string,
  canal: 'email' | 'whatsapp' | 'ambos' = 'ambos',
  enviadoPor: string = '',
  enviadoPorNombre: string = 'Sistema'
): Promise<{
  success: boolean;
  participantesNotificados: number;
  mensaje?: any;
}> => {
  // Obtener el evento actualizado
  const { getEventById } = await import('../api/events');
  const evento = await getEventById(eventId);
  
  if (!evento) {
    return {
      success: false,
      participantesNotificados: 0,
    };
  }

  const participantes = evento.participantesDetalle || [];
  const participantesActivos = participantes.filter(p => !p.fechaCancelacion);

  if (participantesActivos.length === 0) {
    return {
      success: false,
      participantesNotificados: 0,
    };
  }

  // Generar mensaje resumen de cambios
  const cambiosTexto = cambios.map(c => `• ${c.descripcion}`).join('\n');
  const mensajeResumen = `Hola {nombre},

Te informamos sobre cambios importantes en el evento "${evento.nombre}":

${cambiosTexto}

${motivo ? `Motivo: ${motivo}\n\n` : ''}Si tienes alguna pregunta o no puedes asistir con los nuevos detalles, por favor contáctanos.

Saludos,
Equipo de Entrenamiento`;

  // Determinar título del mensaje
  const tieneCancelacion = cambios.some(c => c.tipo === 'estado' && evento.estado === 'cancelado');
  const tieneReprogramacion = cambios.some(c => c.tipo === 'fecha' || c.tipo === 'hora');
  
  let titulo = 'Cambio en Evento';
  if (tieneCancelacion) {
    titulo = `Evento Cancelado: ${evento.nombre}`;
  } else if (tieneReprogramacion) {
    titulo = `Evento Reprogramado: ${evento.nombre}`;
  } else {
    titulo = `Cambio en Evento: ${evento.nombre}`;
  }

  // Enviar mensaje grupal usando el servicio existente
  try {
    const mensajeGrupal = await enviarMensajeGrupal(
      eventId,
      undefined, // tipoPlantilla - no usar plantilla, usar mensaje personalizado
      undefined, // filtrosParticipantes - enviar a todos los participantes activos
      mensajeResumen,
      canal,
      enviadoPor || evento.creadoPor,
      enviadoPorNombre,
      titulo
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

/**
 * Envía notificaciones a todos los participantes sobre el cambio (función legacy)
 * @deprecated Usar notificarCambiosAparticipantes directamente
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
  // Usar la nueva función con los cambios detectados
  return await notificarCambiosAparticipantes(
    cambio.eventoNuevo.id,
    cambio.cambios,
    motivo,
    canal,
    enviadoPor,
    enviadoPorNombre
  );
};

