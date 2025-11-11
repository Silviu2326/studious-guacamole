import { Reserva } from '../types';

export interface NotificacionNuevaReserva {
  id: string;
  reservaId: string;
  entrenadorId: string;
  clienteNombre: string;
  fecha: Date;
  horaInicio: string;
  horaFin: string;
  tipo: string;
  tipoSesion?: 'presencial' | 'videollamada';
  precio: number;
  leida: boolean;
  createdAt: Date;
  reserva?: Reserva; // Reserva completa (opcional, para evitar buscar)
}

// Almacenamiento en memoria para simular notificaciones (en producción sería en base de datos)
const notificaciones: Map<string, NotificacionNuevaReserva[]> = new Map();
const ultimaReservaVerificada: Map<string, string> = new Map();

/**
 * Crea una notificación cuando se realiza una nueva reserva
 */
export const crearNotificacionNuevaReserva = async (
  reserva: Reserva,
  entrenadorId: string
): Promise<NotificacionNuevaReserva> => {
  const notificacion: NotificacionNuevaReserva = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    reservaId: reserva.id,
    entrenadorId,
    clienteNombre: reserva.clienteNombre,
    fecha: reserva.fecha,
    horaInicio: reserva.horaInicio,
    horaFin: reserva.horaFin,
    tipo: reserva.tipo,
    tipoSesion: reserva.tipoSesion,
    precio: reserva.precio,
    leida: false,
    createdAt: new Date(),
    reserva: reserva, // Almacenar la reserva completa
  };

  // Agregar a la lista de notificaciones del entrenador
  const notificacionesEntrenador = notificaciones.get(entrenadorId) || [];
  notificacionesEntrenador.unshift(notificacion); // Agregar al inicio
  notificaciones.set(entrenadorId, notificacionesEntrenador);

  // Actualizar la última reserva verificada
  ultimaReservaVerificada.set(entrenadorId, reserva.id);

  console.log('[NotificacionesNuevasReservas] Notificación creada:', {
    entrenadorId,
    reservaId: reserva.id,
    cliente: reserva.clienteNombre,
  });

  return notificacion;
};

/**
 * Obtiene las notificaciones de nuevas reservas para un entrenador
 */
export const getNotificacionesNuevasReservas = async (
  entrenadorId: string,
  opciones?: {
    noLeidas?: boolean;
    limite?: number;
  }
): Promise<NotificacionNuevaReserva[]> => {
  await new Promise(resolve => setTimeout(resolve, 100));

  const notificacionesEntrenador = notificaciones.get(entrenadorId) || [];

  let filtradas = [...notificacionesEntrenador];

  // Filtrar por no leídas si se especifica
  if (opciones?.noLeidas) {
    filtradas = filtradas.filter(n => !n.leida);
  }

  // Limitar resultados si se especifica
  if (opciones?.limite) {
    filtradas = filtradas.slice(0, opciones.limite);
  }

  return filtradas;
};

/**
 * Marca una notificación como leída
 */
export const marcarNotificacionComoLeida = async (
  notificacionId: string,
  entrenadorId: string
): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 100));

  const notificacionesEntrenador = notificaciones.get(entrenadorId) || [];
  const notificacion = notificacionesEntrenador.find(n => n.id === notificacionId);

  if (notificacion) {
    notificacion.leida = true;
    notificaciones.set(entrenadorId, notificacionesEntrenador);
  }
};

/**
 * Marca todas las notificaciones como leídas
 */
export const marcarTodasNotificacionesComoLeidas = async (
  entrenadorId: string
): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 100));

  const notificacionesEntrenador = notificaciones.get(entrenadorId) || [];
  notificacionesEntrenador.forEach(n => {
    n.leida = true;
  });
  notificaciones.set(entrenadorId, notificacionesEntrenador);
};

/**
 * Obtiene el número de notificaciones no leídas
 */
export const getNumeroNotificacionesNoLeidas = async (
  entrenadorId: string
): Promise<number> => {
  const notificacionesEntrenador = notificaciones.get(entrenadorId) || [];
  return notificacionesEntrenador.filter(n => !n.leida).length;
};

/**
 * Elimina una notificación
 */
export const eliminarNotificacion = async (
  notificacionId: string,
  entrenadorId: string
): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 100));

  const notificacionesEntrenador = notificaciones.get(entrenadorId) || [];
  const filtradas = notificacionesEntrenador.filter(n => n.id !== notificacionId);
  notificaciones.set(entrenadorId, filtradas);
};

/**
 * Verifica si hay nuevas reservas desde la última verificación
 * Esta función se puede llamar periódicamente para detectar nuevas reservas
 */
export const verificarNuevasReservas = async (
  entrenadorId: string,
  ultimaReservaId?: string
): Promise<{
  hayNuevas: boolean;
  nuevaReserva?: Reserva;
}> => {
  // En producción, aquí se consultaría la base de datos para ver si hay nuevas reservas
  // Por ahora, simulamos que no hay nuevas reservas a menos que se haya creado una notificación
  
  const notificacionesEntrenador = notificaciones.get(entrenadorId) || [];
  
  // Buscar la primera notificación no leída que no sea la última verificada
  const ultimaNotificacion = notificacionesEntrenador.find(n => {
    if (n.leida) return false;
    if (ultimaReservaId && n.reservaId === ultimaReservaId) return false;
    return true;
  });

  if (ultimaNotificacion) {
    // Si la notificación tiene la reserva almacenada, usarla directamente
    if (ultimaNotificacion.reserva) {
      return {
        hayNuevas: true,
        nuevaReserva: ultimaNotificacion.reserva,
      };
    }

    // Si no, intentar obtenerla (fallback)
    try {
      const { getReservas } = await import('./reservas');
      const ahora = new Date();
      const en30Dias = new Date(ahora.getTime() + 30 * 24 * 60 * 60 * 1000);
      const reservas = await getReservas(ahora, en30Dias, 'entrenador');
      const reserva = reservas.find(r => r.id === ultimaNotificacion.reservaId);

      if (reserva) {
        // Actualizar la notificación con la reserva completa
        ultimaNotificacion.reserva = reserva;
        notificaciones.set(entrenadorId, notificacionesEntrenador);

        return {
          hayNuevas: true,
          nuevaReserva: reserva,
        };
      }
    } catch (error) {
      console.error('Error obteniendo reserva para notificación:', error);
    }
  }

  return {
    hayNuevas: false,
  };
};

