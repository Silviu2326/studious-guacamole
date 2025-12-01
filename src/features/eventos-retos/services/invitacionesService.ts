// Servicio para gestión de invitaciones a eventos
import { Evento, InvitacionEvento } from '../api/events';
import { Client } from '../../gestión-de-clientes/types';
import { ClientSegment } from '../../gestión-de-clientes/types';

/**
 * Genera un link único de invitación para tracking
 */
export const generarLinkInvitacion = (eventoId: string, destinatarioId: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `${window.location.origin}/eventos/invitacion/${eventoId}/${destinatarioId}-${timestamp}-${random}`;
};

/**
 * Personaliza la plantilla de invitación con datos del evento y destinatario
 */
export const personalizarPlantillaInvitacion = (
  plantilla: string,
  evento: Evento,
  destinatario: { nombre: string; email?: string }
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
    .replace(/{nombre}/g, destinatario.nombre)
    .replace(/{eventoNombre}/g, evento.nombre)
    .replace(/{eventoDescripcion}/g, evento.descripcion || '')
    .replace(/{fecha}/g, fechaFormateada)
    .replace(/{hora}/g, horaFormateada)
    .replace(/{ubicacion}/g, evento.ubicacion || evento.plataforma || 'Por confirmar')
    .replace(/{tipoEvento}/g, evento.tipo === 'presencial' ? 'evento presencial' : evento.tipo === 'virtual' ? 'webinar virtual' : 'reto');

  // Agregar información adicional según el tipo de evento
  if (evento.tipo === 'presencial' && evento.requisitosFisicos) {
    mensaje += `\n\nRequisitos: ${evento.requisitosFisicos}`;
  }
  if (evento.tipo === 'virtual' && evento.linkAcceso) {
    mensaje += `\n\nLink de acceso: ${evento.linkAcceso}`;
  }
  if (evento.precio !== undefined && !evento.esGratuito) {
    mensaje += `\n\nPrecio: €${evento.precio}`;
  } else if (evento.esGratuito) {
    mensaje += `\n\n¡Este evento es gratuito!`;
  }

  return mensaje;
};

/**
 * Envía invitaciones a clientes o grupos
 */
export const enviarInvitaciones = async (
  evento: Evento,
  destinatarios: Array<{ id: string; nombre: string; email?: string; telefono?: string; tipo: 'cliente' | 'grupo' }>,
  plantilla: string,
  canal: 'email' | 'whatsapp' | 'ambos'
): Promise<InvitacionEvento[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const invitaciones: InvitacionEvento[] = destinatarios.map(destinatario => {
    const linkInvitacion = generarLinkInvitacion(evento.id, destinatario.id);
    const mensajePersonalizado = personalizarPlantillaInvitacion(plantilla, evento, destinatario);

    const invitacion: InvitacionEvento = {
      id: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      destinatarioId: destinatario.id,
      destinatarioNombre: destinatario.nombre,
      destinatarioTipo: destinatario.tipo,
      email: destinatario.email,
      telefono: destinatario.telefono,
      canal,
      plantilla,
      mensajePersonalizado,
      fechaEnvio: new Date(),
      estado: 'enviada',
      abierta: false,
      linkInvitacion,
    };

    // Simular envío (en producción, aquí se enviaría el mensaje real)
    console.log('[InvitacionesService] Enviando invitación:', {
      destinatario: destinatario.nombre,
      canal,
      mensaje: mensajePersonalizado.substring(0, 100) + '...',
    });

    // Simular tracking de apertura (en producción, esto se haría cuando el usuario abra el link)
    // Por ahora, simulamos que algunas invitaciones se abren después de un tiempo
    if (Math.random() > 0.7) {
      setTimeout(() => {
        marcarInvitacionComoAbierta(evento.id, invitacion.id);
      }, 5000 + Math.random() * 10000);
    }

    return invitacion;
  });

  return invitaciones;
};

/**
 * Marca una invitación como abierta (se llama cuando el usuario accede al link)
 */
export const marcarInvitacionComoAbierta = async (eventoId: string, invitacionId: string): Promise<void> => {
  const eventosStorage = localStorage.getItem('eventos');
  if (!eventosStorage) return;

  try {
    const eventos: Evento[] = JSON.parse(eventosStorage).map((e: any) => ({
      ...e,
      fechaInicio: new Date(e.fechaInicio),
      fechaFin: e.fechaFin ? new Date(e.fechaFin) : undefined,
      createdAt: new Date(e.createdAt),
      invitaciones: e.invitaciones?.map((inv: any) => ({
        ...inv,
        fechaEnvio: new Date(inv.fechaEnvio),
        fechaApertura: inv.fechaApertura ? new Date(inv.fechaApertura) : undefined,
      })) || [],
    }));

    const evento = eventos.find(e => e.id === eventoId);
    if (!evento) return;

    const invitaciones = evento.invitaciones || [];
    const invitacionIndex = invitaciones.findIndex(inv => inv.id === invitacionId);
    if (invitacionIndex !== -1) {
      invitaciones[invitacionIndex] = {
        ...invitaciones[invitacionIndex],
        abierta: true,
        fechaApertura: new Date(),
        estado: 'entregada',
      };

      evento.invitaciones = invitaciones;
      localStorage.setItem('eventos', JSON.stringify(eventos));
    }
  } catch (error) {
    console.error('Error marcando invitación como abierta:', error);
  }
};

/**
 * Obtiene el estado de las invitaciones de un evento
 */
export const obtenerEstadisticasInvitaciones = (evento: Evento): {
  total: number;
  enviadas: number;
  abiertas: number;
  tasaApertura: number;
} => {
  const invitaciones = evento.invitaciones || [];
  const enviadas = invitaciones.filter(inv => inv.estado === 'enviada' || inv.estado === 'entregada').length;
  const abiertas = invitaciones.filter(inv => inv.abierta).length;
  const tasaApertura = enviadas > 0 ? (abiertas / enviadas) * 100 : 0;

  return {
    total: invitaciones.length,
    enviadas,
    abiertas,
    tasaApertura: Math.round(tasaApertura * 10) / 10,
  };
};

/**
 * Obtiene clientes de un grupo/segmento
 */
export const obtenerClientesDeGrupo = async (grupoId: string): Promise<Client[]> => {
  // Importar dinámicamente para evitar dependencias circulares
  const { getSegments } = await import('../../gestión-de-clientes/api/segmentation');
  const { getActiveClients } = await import('../../gestión-de-clientes/api/clients');
  
  const segmentos = await getSegments('entrenador');
  const segmento = segmentos.find(s => s.id === grupoId);
  
  if (!segmento) {
    return [];
  }

  const todosLosClientes = await getActiveClients('entrenador');
  return todosLosClientes.filter(c => segmento.clientIds.includes(c.id));
};

/**
 * Plantilla de invitación con asunto y cuerpo
 */
export interface PlantillaInvitacion {
  id: string;
  nombre: string;
  asunto: string;
  cuerpo: string;
  variables: string[]; // Variables disponibles como {nombre}, {eventoNombre}, etc.
  creadoPor: string;
  createdAt: Date;
}

/**
 * Plantillas predefinidas de invitación
 */
const PLANTILLAS_INVITACION: PlantillaInvitacion[] = [
  {
    id: 'plantilla-invitacion-estandar',
    nombre: 'Invitación Estándar',
    asunto: 'Invitación al evento: {eventoNombre}',
    cuerpo: 'Hola {nombre},\n\nTe invitamos cordialmente a participar en nuestro evento "{eventoNombre}" que se realizará el {fecha} a las {hora}.\n\n{eventoDescripcion}\n\nUbicación: {ubicacion}\n\nEsperamos contar con tu presencia.\n\nSaludos,\nEquipo de Entrenamiento',
    variables: ['nombre', 'eventoNombre', 'eventoDescripcion', 'fecha', 'hora', 'ubicacion'],
    creadoPor: 'sistema',
    createdAt: new Date(),
  },
  {
    id: 'plantilla-invitacion-formal',
    nombre: 'Invitación Formal',
    asunto: 'Invitación formal: {eventoNombre}',
    cuerpo: 'Estimado/a {nombre},\n\nNos complace invitarle formalmente al evento "{eventoNombre}" programado para el {fecha} a las {hora}.\n\nDetalles del evento:\n{eventoDescripcion}\n\nLugar: {ubicacion}\n\nAgradecemos su confirmación de asistencia.\n\nAtentamente,\nEquipo de Entrenamiento',
    variables: ['nombre', 'eventoNombre', 'eventoDescripcion', 'fecha', 'hora', 'ubicacion'],
    creadoPor: 'sistema',
    createdAt: new Date(),
  },
  {
    id: 'plantilla-invitacion-casual',
    nombre: 'Invitación Casual',
    asunto: '¡Te esperamos en {eventoNombre}!',
    cuerpo: '¡Hola {nombre}!\n\n¿Qué tal? Te queríamos invitar a "{eventoNombre}" el {fecha} a las {hora}.\n\n{eventoDescripcion}\n\nNos vemos en {ubicacion}.\n\n¡No faltes!\n\nUn saludo,\nEquipo de Entrenamiento',
    variables: ['nombre', 'eventoNombre', 'eventoDescripcion', 'fecha', 'hora', 'ubicacion'],
    creadoPor: 'sistema',
    createdAt: new Date(),
  },
];

/**
 * Envía invitaciones masivas a múltiples destinatarios
 * 
 * NOTA: En producción, esto se conectaría a proveedores de email (SendGrid, Mailgun, etc.)
 * o WhatsApp API (Twilio, WhatsApp Business API) para el envío real de mensajes.
 * 
 * @param eventId ID del evento
 * @param destinatarios Array de destinatarios con id, nombre, email y/o teléfono
 * @param canal Canal de comunicación: 'email', 'whatsapp' o 'ambos'
 * @returns Array de invitaciones enviadas
 */
export const enviarInvitacionesMasivas = async (
  eventId: string,
  destinatarios: Array<{ id: string; nombre: string; email?: string; telefono?: string }>,
  canal: 'email' | 'whatsapp' | 'ambos'
): Promise<InvitacionEvento[]> => {
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
  }));

  const evento = eventos.find(e => e.id === eventId);
  if (!evento) {
    throw new Error('Evento no encontrado');
  }

  // Usar plantilla por defecto
  const plantilla = PLANTILLAS_INVITACION[0];
  const invitaciones: InvitacionEvento[] = [];

  for (const destinatario of destinatarios) {
    // Personalizar mensaje
    const mensajePersonalizado = personalizarPlantillaInvitacion(
      plantilla.cuerpo,
      evento,
      destinatario
    );

    // Determinar canales de envío
    const canalesEnvio: ('email' | 'whatsapp')[] = [];
    if (canal === 'ambos') {
      if (destinatario.email) canalesEnvio.push('email');
      if (destinatario.telefono) canalesEnvio.push('whatsapp');
    } else if (canal === 'email' && destinatario.email) {
      canalesEnvio.push('email');
    } else if (canal === 'whatsapp' && destinatario.telefono) {
      canalesEnvio.push('whatsapp');
    }

    // Si no hay canales disponibles, usar email como fallback
    if (canalesEnvio.length === 0) {
      canalesEnvio.push('email');
    }

    // Crear invitación por cada canal
    for (const canalEnvio of canalesEnvio) {
      const linkInvitacion = generarLinkInvitacion(eventId, destinatario.id);
      
      const invitacion: InvitacionEvento = {
        id: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        destinatarioId: destinatario.id,
        destinatarioNombre: destinatario.nombre,
        destinatarioTipo: 'cliente',
        email: destinatario.email,
        telefono: destinatario.telefono,
        canal: canalesEnvio.length > 1 ? 'ambos' : canalEnvio,
        plantilla: plantilla.cuerpo,
        mensajePersonalizado,
        fechaEnvio: new Date(),
        estado: 'enviada',
        abierta: false,
        linkInvitacion,
      };

      // Simular envío (en producción, aquí se enviaría el mensaje real)
      console.log('[InvitacionesService] Enviando invitación masiva:', {
        destinatario: destinatario.nombre,
        canal: canalEnvio,
        asunto: plantilla.asunto.replace(/{eventoNombre}/g, evento.nombre),
        mensaje: mensajePersonalizado.substring(0, 100) + '...',
      });

      invitaciones.push(invitacion);
    }
  }

  // Guardar invitaciones en el evento
  evento.invitaciones = [...(evento.invitaciones || []), ...invitaciones];
  const eventosActualizados = eventos.map(e => (e.id === eventId ? evento : e));
  localStorage.setItem('eventos', JSON.stringify(eventosActualizados));

  return invitaciones;
};

/**
 * Obtiene todas las plantillas de invitación disponibles
 * 
 * @returns Array de plantillas de invitación con asunto y cuerpo
 */
export const obtenerPlantillasInvitacion = (): PlantillaInvitacion[] => {
  return PLANTILLAS_INVITACION;
};


