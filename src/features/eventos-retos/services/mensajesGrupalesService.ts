// Servicio para gestión de mensajes grupales a participantes de eventos
import { Evento, Participante, MensajeGrupal, DestinatarioMensajeGrupal, PlantillaMensajeGrupal } from '../api/events';

/**
 * Plantillas predefinidas de mensajes grupales
 */
export const PLANTILLAS_PREDEFINIDAS: PlantillaMensajeGrupal[] = [
  {
    id: 'plantilla-cambio-fecha',
    nombre: 'Cambio de Fecha/Hora',
    categoria: 'cambio',
    mensaje: 'Hola {nombre},\n\nTe informamos que el evento "{eventoNombre}" ha cambiado su fecha/hora.\n\nNueva fecha: {fecha} a las {hora}\n\nLugar: {ubicacion}\n\nPor favor, confirma tu asistencia. Si tienes alguna pregunta, no dudes en contactarnos.\n\nSaludos,\nEquipo de Entrenamiento',
    variables: ['nombre', 'eventoNombre', 'fecha', 'hora', 'ubicacion'],
    creadoPor: 'sistema',
    createdAt: new Date(),
  },
  {
    id: 'plantilla-cambio-ubicacion',
    nombre: 'Cambio de Ubicación',
    categoria: 'cambio',
    mensaje: 'Hola {nombre},\n\nTe informamos que el evento "{eventoNombre}" ha cambiado de ubicación.\n\nNueva ubicación: {ubicacion}\n\nFecha y hora se mantienen: {fecha} a las {hora}\n\nPor favor, ten en cuenta este cambio.\n\nSaludos,\nEquipo de Entrenamiento',
    variables: ['nombre', 'eventoNombre', 'ubicacion', 'fecha', 'hora'],
    creadoPor: 'sistema',
    createdAt: new Date(),
  },
  {
    id: 'plantilla-instrucciones',
    nombre: 'Instrucciones de Último Momento',
    categoria: 'instrucciones',
    mensaje: 'Hola {nombre},\n\nTe enviamos algunas instrucciones importantes para el evento "{eventoNombre}" que se realizará el {fecha} a las {hora}:\n\n{instrucciones}\n\nPor favor, lee atentamente estas instrucciones antes del evento.\n\nSaludos,\nEquipo de Entrenamiento',
    variables: ['nombre', 'eventoNombre', 'fecha', 'hora', 'instrucciones'],
    creadoPor: 'sistema',
    createdAt: new Date(),
  },
  {
    id: 'plantilla-motivacion',
    nombre: 'Mensaje Motivacional',
    categoria: 'motivacion',
    mensaje: 'Hola {nombre},\n\n¡Estamos emocionados de verte en "{eventoNombre}" el {fecha}!\n\nEste evento será una excelente oportunidad para {objetivo}.\n\n¡Vamos a darlo todo juntos!\n\nSaludos,\nEquipo de Entrenamiento',
    variables: ['nombre', 'eventoNombre', 'fecha', 'objetivo'],
    creadoPor: 'sistema',
    createdAt: new Date(),
  },
  {
    id: 'plantilla-recordatorio',
    nombre: 'Recordatorio Final',
    categoria: 'recordatorio',
    mensaje: 'Hola {nombre},\n\nTe recordamos que el evento "{eventoNombre}" es mañana a las {hora} en {ubicacion}.\n\n¡No olvides asistir!\n\nSaludos,\nEquipo de Entrenamiento',
    variables: ['nombre', 'eventoNombre', 'hora', 'ubicacion'],
    creadoPor: 'sistema',
    createdAt: new Date(),
  },
  {
    id: 'plantilla-general',
    nombre: 'Mensaje General',
    categoria: 'general',
    mensaje: 'Hola {nombre},\n\nTe contactamos respecto al evento "{eventoNombre}" que se realizará el {fecha} a las {hora}.\n\n{mensaje}\n\nSaludos,\nEquipo de Entrenamiento',
    variables: ['nombre', 'eventoNombre', 'fecha', 'hora', 'mensaje'],
    creadoPor: 'sistema',
    createdAt: new Date(),
  },
];

/**
 * Personaliza el mensaje con datos del evento y participante
 */
export const personalizarMensajeGrupal = (
  plantilla: string,
  evento: Evento,
  participante: Participante,
  variablesAdicionales?: Record<string, string>
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

  let mensaje = plantilla
    .replace(/{nombre}/g, participante.nombre)
    .replace(/{eventoNombre}/g, evento.nombre)
    .replace(/{eventoDescripcion}/g, evento.descripcion || '')
    .replace(/{fecha}/g, fechaFormateada)
    .replace(/{hora}/g, horaFormateada)
    .replace(/{ubicacion}/g, evento.ubicacion || evento.plataforma || evento.linkAcceso || 'Por confirmar')
    .replace(/{tipoEvento}/g, evento.tipo === 'presencial' ? 'evento presencial' : evento.tipo === 'virtual' ? 'webinar virtual' : 'reto');

  // Reemplazar variables adicionales
  if (variablesAdicionales) {
    Object.keys(variablesAdicionales).forEach(key => {
      mensaje = mensaje.replace(new RegExp(`{${key}}`, 'g'), variablesAdicionales[key]);
    });
  }

  return mensaje;
};

/**
 * Obtiene las plantillas predefinidas
 */
export const obtenerPlantillas = (): PlantillaMensajeGrupal[] => {
  return PLANTILLAS_PREDEFINIDAS;
};

/**
 * Obtiene todas las plantillas de mensajes disponibles
 * 
 * Alias de obtenerPlantillas() para mantener consistencia con la API requerida
 * 
 * @returns Array de plantillas de mensajes grupales
 */
export const obtenerPlantillasMensajes = (): PlantillaMensajeGrupal[] => {
  return PLANTILLAS_PREDEFINIDAS;
};

/**
 * Obtiene una plantilla por ID
 */
export const obtenerPlantillaPorId = (plantillaId: string): PlantillaMensajeGrupal | null => {
  return PLANTILLAS_PREDEFINIDAS.find(p => p.id === plantillaId) || null;
};

/**
 * Obtiene plantillas por categoría
 */
export const obtenerPlantillasPorCategoria = (
  categoria: PlantillaMensajeGrupal['categoria']
): PlantillaMensajeGrupal[] => {
  return PLANTILLAS_PREDEFINIDAS.filter(p => p.categoria === categoria);
};

/**
 * Filtros para seleccionar participantes en mensajes grupales
 */
export interface FiltrosParticipantes {
  confirmados?: boolean; // Solo participantes confirmados
  noConfirmados?: boolean; // Solo participantes no confirmados
  asistieron?: boolean; // Solo participantes que asistieron
  noAsistieron?: boolean; // Solo participantes que no asistieron
  participantesIds?: string[]; // IDs específicos de participantes
  excluirParticipantesIds?: string[]; // IDs de participantes a excluir
}

/**
 * Envía un mensaje grupal a participantes del evento con filtros opcionales
 * 
 * NOTA: En producción, esto se conectaría a proveedores de email (SendGrid, Mailgun, etc.)
 * o WhatsApp API (Twilio, WhatsApp Business API) para el envío real de mensajes.
 * 
 * @param eventId ID del evento
 * @param tipoPlantilla Tipo de plantilla a usar (opcional, si no se proporciona mensaje personalizado)
 * @param filtrosParticipantes Filtros para seleccionar qué participantes recibirán el mensaje
 * @param mensaje Mensaje personalizado (opcional, si no se usa plantilla)
 * @param canal Canal de comunicación
 * @param enviadoPor ID del usuario que envía
 * @param enviadoPorNombre Nombre del usuario que envía
 * @param titulo Título del mensaje (opcional)
 * @param variablesAdicionales Variables adicionales para personalizar el mensaje
 * @returns Mensaje grupal enviado
 */
export const enviarMensajeGrupal = async (
  eventId: string,
  tipoPlantilla?: 'general' | 'cambio' | 'instrucciones' | 'motivacion' | 'recordatorio',
  filtrosParticipantes?: FiltrosParticipantes,
  mensaje?: string,
  canal: 'email' | 'whatsapp' | 'ambos' = 'ambos',
  enviadoPor?: string,
  enviadoPorNombre?: string,
  titulo?: string,
  variablesAdicionales?: Record<string, string>
): Promise<MensajeGrupal> => {
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

  // Obtener plantilla si se especificó tipoPlantilla
  let plantillaId: string | undefined;
  let mensajeFinal: string;
  let plantillaNombre: string | undefined;

  if (tipoPlantilla && !mensaje) {
    const plantilla = obtenerPlantillasPorCategoria(tipoPlantilla)[0];
    if (plantilla) {
      plantillaId = plantilla.id;
      plantillaNombre = plantilla.nombre;
      mensajeFinal = plantilla.mensaje;
    } else {
      throw new Error(`No se encontró plantilla de tipo: ${tipoPlantilla}`);
    }
  } else if (mensaje) {
    mensajeFinal = mensaje;
  } else {
    throw new Error('Debe proporcionar tipoPlantilla o mensaje');
  }

  // Filtrar participantes según filtros
  let participantes = evento.participantesDetalle || [];
  participantes = participantes.filter(p => !p.fechaCancelacion);

  if (filtrosParticipantes) {
    if (filtrosParticipantes.confirmados !== undefined) {
      participantes = participantes.filter(p => 
        filtrosParticipantes.confirmados ? p.confirmado : !p.confirmado
      );
    }

    if (filtrosParticipantes.asistieron !== undefined) {
      participantes = participantes.filter(p => 
        filtrosParticipantes.asistieron ? p.asistencia : !p.asistencia
      );
    }

    if (filtrosParticipantes.participantesIds && filtrosParticipantes.participantesIds.length > 0) {
      participantes = participantes.filter(p => 
        filtrosParticipantes.participantesIds!.includes(p.id)
      );
    }

    if (filtrosParticipantes.excluirParticipantesIds && filtrosParticipantes.excluirParticipantesIds.length > 0) {
      participantes = participantes.filter(p => 
        !filtrosParticipantes.excluirParticipantesIds!.includes(p.id)
      );
    }
  }

  const participantesActivos = participantes;

  const destinatarios: DestinatarioMensajeGrupal[] = [];
  let totalEnviados = 0;
  let totalEntregados = 0;
  let totalFallidos = 0;

  // Determinar qué canal usar para cada participante
  const determinarCanal = (participante: Participante): ('email' | 'whatsapp')[] => {
    if (canal === 'ambos') {
      const canales: ('email' | 'whatsapp')[] = [];
      if (participante.email) canales.push('email');
      if (participante.telefono) canales.push('whatsapp');
      return canales.length > 0 ? canales : ['email']; // Fallback a email
    }
    return [canal];
  };

  // Enviar a cada participante
  for (const participante of participantesActivos) {
    const canales = determinarCanal(participante);
    const mensajePersonalizado = personalizarMensajeGrupal(
      mensaje,
      evento,
      participante,
      variablesAdicionales
    );

    for (const canalEnvio of canales) {
      const destinatario: DestinatarioMensajeGrupal = {
        participanteId: participante.id,
        participanteNombre: participante.nombre,
        email: participante.email,
        telefono: participante.telefono,
        canal: canalEnvio,
        estado: 'pendiente',
        fechaEnvio: new Date(),
      };

      // Simular envío (en producción, aquí se enviaría el mensaje real)
      console.log('[MensajesGrupalesService] Enviando mensaje grupal:', {
        participante: participante.nombre,
        canal: canalEnvio,
        mensaje: mensajePersonalizado.substring(0, 100) + '...',
      });

      // Simular éxito/fallo aleatorio (90% éxito)
      if (Math.random() > 0.1) {
        destinatario.estado = 'enviado';
        totalEnviados++;
        
        // Simular entrega después de un tiempo
        setTimeout(() => {
          destinatario.estado = 'entregado';
          destinatario.fechaEntrega = new Date();
          totalEntregados++;
        }, 1000);
      } else {
        destinatario.estado = 'fallido';
        destinatario.error = 'Error al enviar el mensaje';
        totalFallidos++;
      }

      destinatarios.push(destinatario);
    }
  }

  const mensajeGrupal: MensajeGrupal = {
    id: `msg-grupal-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    eventoId: evento.id,
    titulo,
    mensaje: mensajeFinal,
    plantillaId,
    plantillaNombre,
    canal,
    fechaEnvio: new Date(),
    enviadoPor: enviadoPor || 'sistema',
    enviadoPorNombre: enviadoPorNombre || 'Sistema',
    destinatarios,
    estado: totalFallidos === 0 ? 'enviado' : totalFallidos < destinatarios.length ? 'en-proceso' : 'fallido',
    estadisticas: {
      total: destinatarios.length,
      enviados: totalEnviados,
      entregados: totalEntregados,
      fallidos: totalFallidos,
      tasaEntrega: destinatarios.length > 0 
        ? Math.round((totalEntregados / destinatarios.length) * 100 * 10) / 10 
        : 0,
    },
  };

  // Guardar mensaje grupal en el evento
  evento.mensajesGrupales = [...(evento.mensajesGrupales || []), mensajeGrupal];
  const eventosActualizados = eventos.map(e => (e.id === eventId ? evento : e));
  localStorage.setItem('eventos', JSON.stringify(eventosActualizados));

  return mensajeGrupal;
};

/**
 * Obtiene el historial de mensajes grupales de un evento
 */
export const obtenerHistorialMensajesGrupales = (evento: Evento): MensajeGrupal[] => {
  return evento.mensajesGrupales || [];
};

/**
 * Obtiene estadísticas de mensajes grupales
 */
export const obtenerEstadisticasMensajesGrupales = (evento: Evento): {
  totalMensajes: number;
  totalEnviados: number;
  totalEntregados: number;
  totalFallidos: number;
  tasaEntregaPromedio: number;
} => {
  const mensajes = evento.mensajesGrupales || [];
  
  let totalEnviados = 0;
  let totalEntregados = 0;
  let totalFallidos = 0;

  mensajes.forEach(mensaje => {
    if (mensaje.estadisticas) {
      totalEnviados += mensaje.estadisticas.enviados;
      totalEntregados += mensaje.estadisticas.entregados;
      totalFallidos += mensaje.estadisticas.fallidos;
    }
  });

  const total = totalEnviados + totalFallidos;
  const tasaEntregaPromedio = total > 0 
    ? Math.round((totalEntregados / total) * 100 * 10) / 10 
    : 0;

  return {
    totalMensajes: mensajes.length,
    totalEnviados,
    totalEntregados,
    totalFallidos,
    tasaEntregaPromedio,
  };
};


