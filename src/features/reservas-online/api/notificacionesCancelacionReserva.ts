import { Reserva } from '../types';

export interface NotificacionCancelacionReserva {
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
  motivo?: string;
  leida: boolean;
  createdAt: Date;
}

// Almacenamiento en memoria para simular notificaciones (en producción sería en base de datos)
const notificaciones: Map<string, NotificacionCancelacionReserva[]> = new Map();

/**
 * Crea una notificación cuando un cliente cancela una reserva
 * Esta notificación alerta al entrenador de que tiene un hueco libre disponible
 */
export const crearNotificacionCancelacionReserva = async (
  reserva: Reserva,
  entrenadorId: string,
  motivo?: string
): Promise<NotificacionCancelacionReserva> => {
  const notificacion: NotificacionCancelacionReserva = {
    id: `notif-cancel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    reservaId: reserva.id,
    entrenadorId,
    clienteNombre: reserva.clienteNombre,
    fecha: reserva.fecha,
    horaInicio: reserva.horaInicio,
    horaFin: reserva.horaFin,
    tipo: reserva.tipo,
    tipoSesion: reserva.tipoSesion,
    precio: reserva.precio,
    motivo,
    leida: false,
    createdAt: new Date(),
  };

  // Agregar a la lista de notificaciones del entrenador
  const notificacionesEntrenador = notificaciones.get(entrenadorId) || [];
  notificacionesEntrenador.unshift(notificacion); // Agregar al inicio
  notificaciones.set(entrenadorId, notificacionesEntrenador);

  console.log('[NotificacionesCancelacionReserva] Notificación creada:', {
    entrenadorId,
    reservaId: reserva.id,
    cliente: reserva.clienteNombre,
    fecha: reserva.fecha.toLocaleDateString('es-ES'),
    hora: reserva.horaInicio,
    motivo,
  });

  // En producción, aquí se enviarían notificaciones push, email, etc.
  // Por ahora solo guardamos en memoria y logueamos
  console.log('[NotificacionesCancelacionReserva] ⚠️ HUECO LIBRE DISPONIBLE:', {
    fecha: reserva.fecha.toLocaleDateString('es-ES'),
    hora: `${reserva.horaInicio} - ${reserva.horaFin}`,
    tipo: reserva.tipo,
    cliente: reserva.clienteNombre,
  });

  return notificacion;
};

/**
 * Obtiene las notificaciones de cancelaciones de reservas para un entrenador
 */
export const getNotificacionesCancelacionReserva = async (
  entrenadorId: string,
  opciones?: {
    noLeidas?: boolean;
    limite?: number;
  }
): Promise<NotificacionCancelacionReserva[]> => {
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
export const marcarNotificacionCancelacionComoLeida = async (
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
 * Marca todas las notificaciones de cancelación como leídas
 */
export const marcarTodasNotificacionesCancelacionComoLeidas = async (
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
 * Obtiene el número de notificaciones de cancelación no leídas
 */
export const getNumeroNotificacionesCancelacionNoLeidas = async (
  entrenadorId: string
): Promise<number> => {
  const notificacionesEntrenador = notificaciones.get(entrenadorId) || [];
  return notificacionesEntrenador.filter(n => !n.leida).length;
};

/**
 * Elimina una notificación de cancelación
 */
export const eliminarNotificacionCancelacion = async (
  notificacionId: string,
  entrenadorId: string
): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 100));

  const notificacionesEntrenador = notificaciones.get(entrenadorId) || [];
  const filtradas = notificacionesEntrenador.filter(n => n.id !== notificacionId);
  notificaciones.set(entrenadorId, filtradas);
};


