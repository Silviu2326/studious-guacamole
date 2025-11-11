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


