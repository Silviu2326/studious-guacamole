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

// ============================================================================
// BUS MOCK DE NOTIFICACIONES EN TIEMPO REAL
// ============================================================================
// 
// Este es un bus de eventos mock que simula un sistema de notificaciones
// en tiempo real. En producción, esto se reemplazaría por:
//
// 1. WEBSOCKETS:
//    - Socket.io: io.to(`entrenador-${entrenadorId}`).emit('nueva-reserva', reserva)
//    - WebSocket nativo: ws.send(JSON.stringify({ type: 'nueva-reserva', data: reserva }))
//    - Pusher: await pusher.trigger('canal-entrenador', 'nueva-reserva', reserva)
//    - Ably: await channel.publish('nueva-reserva', reserva)
//    - AWS API Gateway WebSocket: await apigateway.postToConnection({ ConnectionId, Data })
//
// 2. SERVER-SENT EVENTS (SSE):
//    - Express: res.write(`data: ${JSON.stringify({ type: 'nueva-reserva', data: reserva })}\n\n`)
//    - Fastify: reply.raw.write(`data: ${JSON.stringify(event)}\n\n`)
//
// 3. COLAS DE MENSAJERÍA (para notificaciones push):
//    - RabbitMQ: Publicar a exchange 'notificaciones' con routing key 'nueva-reserva'
//    - AWS SNS: await sns.publish({ TopicArn, Message: JSON.stringify(reserva) })
//    - Google Cloud Pub/Sub: await pubsub.topic('nueva-reserva').publish(Buffer.from(JSON.stringify(reserva)))
//    - Redis Pub/Sub: await redis.publish('nueva-reserva', JSON.stringify(reserva))
//
// 4. SERVICIOS DE NOTIFICACIONES EN TIEMPO REAL:
//    - Firebase Realtime Database: ref('notificaciones').push(reserva)
//    - Firebase Cloud Firestore: await db.collection('notificaciones').add(reserva)
//    - Supabase Realtime: await supabase.from('notificaciones').insert(reserva)
//
// Ejemplo de integración con Socket.io:
// ```typescript
// import { Server } from 'socket.io';
// const io = new Server(server);
// 
// export const emitirNuevaReserva = (reserva: Reserva, entrenadorId: string) => {
//   io.to(`entrenador-${entrenadorId}`).emit('nueva-reserva', {
//     type: 'nueva-reserva',
//     data: reserva,
//     timestamp: new Date()
//   });
// };
// ```
//
// Ejemplo de integración con Redis Pub/Sub:
// ```typescript
// import Redis from 'ioredis';
// const redis = new Redis();
// 
// export const emitirNuevaReserva = async (reserva: Reserva, entrenadorId: string) => {
//   await redis.publish(`entrenador:${entrenadorId}:nueva-reserva`, JSON.stringify(reserva));
// };
// ```
// ============================================================================

/**
 * Tipo de callback para suscripciones a nuevas reservas
 */
export type CallbackNuevaReserva = (reserva: Reserva, notificacion: NotificacionNuevaReserva) => void;

/**
 * Almacenamiento de suscripciones por entrenador
 * En producción, esto se manejaría con WebSockets o Server-Sent Events
 */
const suscripciones: Map<string, Set<CallbackNuevaReserva>> = new Map();

/**
 * Suscribe un callback para recibir notificaciones de nuevas reservas en tiempo real
 * 
 * Este es un bus mock que simula notificaciones en tiempo real. En producción,
 * esto se reemplazaría por WebSockets, Server-Sent Events, o colas de mensajería.
 * 
 * @param entrenadorId - ID del entrenador que quiere recibir notificaciones
 * @param callback - Función que se ejecutará cuando se cree una nueva reserva
 * @returns Función para cancelar la suscripción
 * 
 * Ejemplo de uso:
 * ```typescript
 * const unsubscribe = subscribeNuevasReservas('entrenador-123', (reserva, notificacion) => {
 *   console.log('Nueva reserva recibida:', reserva);
 *   // Actualizar UI, mostrar notificación, etc.
 * });
 * 
 * // Más tarde, para cancelar la suscripción:
 * unsubscribe();
 * ```
 */
export const subscribeNuevasReservas = (
  entrenadorId: string,
  callback: CallbackNuevaReserva
): (() => void) => {
  if (!suscripciones.has(entrenadorId)) {
    suscripciones.set(entrenadorId, new Set());
  }
  
  const callbacks = suscripciones.get(entrenadorId)!;
  callbacks.add(callback);
  
  console.log('[NotificacionesNuevasReservas] Suscripción agregada para entrenador:', entrenadorId);
  console.log('[NotificacionesNuevasReservas] Total de suscripciones:', callbacks.size);
  
  // Retornar función para cancelar la suscripción
  return () => {
    const callbacks = suscripciones.get(entrenadorId);
    if (callbacks) {
      callbacks.delete(callback);
      console.log('[NotificacionesNuevasReservas] Suscripción cancelada para entrenador:', entrenadorId);
      if (callbacks.size === 0) {
        suscripciones.delete(entrenadorId);
      }
    }
  };
};

/**
 * Emite un evento de nueva reserva a todos los suscriptores del entrenador
 * 
 * Esta función se debe llamar cuando se crea una nueva reserva para notificar
 * en tiempo real a los suscriptores (por ejemplo, el entrenador que está viendo
 * su panel de control).
 * 
 * En producción, esto se reemplazaría por:
 * - WebSocket: io.to(`entrenador-${entrenadorId}`).emit('nueva-reserva', reserva)
 * - Server-Sent Events: res.write(`data: ${JSON.stringify({ type: 'nueva-reserva', data: reserva })}\n\n`)
 * - Redis Pub/Sub: await redis.publish(`entrenador:${entrenadorId}:nueva-reserva`, JSON.stringify(reserva))
 * - RabbitMQ: Publicar a exchange 'notificaciones' con routing key `entrenador.${entrenadorId}.nueva-reserva`
 * 
 * @param reserva - La reserva que se acaba de crear
 * @param entrenadorId - ID del entrenador que debe recibir la notificación
 * @param notificacion - La notificación asociada (opcional, se creará si no se proporciona)
 */
export const emitirNuevaReserva = async (
  reserva: Reserva,
  entrenadorId: string,
  notificacion?: NotificacionNuevaReserva
): Promise<void> => {
  // Crear notificación si no se proporciona
  const notif = notificacion || await crearNotificacionNuevaReserva(reserva, entrenadorId);
  
  // Obtener todos los callbacks suscritos para este entrenador
  const callbacks = suscripciones.get(entrenadorId);
  
  if (callbacks && callbacks.size > 0) {
    console.log('[NotificacionesNuevasReservas] Emitiendo nueva reserva a', callbacks.size, 'suscriptores');
    
    // Ejecutar todos los callbacks suscritos
    callbacks.forEach(callback => {
      try {
        callback(reserva, notif);
      } catch (error) {
        console.error('[NotificacionesNuevasReservas] Error ejecutando callback:', error);
      }
    });
  } else {
    console.log('[NotificacionesNuevasReservas] No hay suscriptores para entrenador:', entrenadorId);
  }
  
  // ============================================================================
  // INTEGRACIÓN CON SERVICIOS REALES (COMENTARIOS PARA PRODUCCIÓN)
  // ============================================================================
  // 
  // En producción, aquí se emitiría el evento a través de WebSockets o SSE:
  //
  // Ejemplo con Socket.io:
  // ```typescript
  // import { Server } from 'socket.io';
  // const io = new Server(server);
  // io.to(`entrenador-${entrenadorId}`).emit('nueva-reserva', {
  //   type: 'nueva-reserva',
  //   data: reserva,
  //   notificacion: notif,
  //   timestamp: new Date()
  // });
  // ```
  //
  // Ejemplo con Redis Pub/Sub:
  // ```typescript
  // import Redis from 'ioredis';
  // const redis = new Redis();
  // await redis.publish(
  //   `entrenador:${entrenadorId}:nueva-reserva`,
  //   JSON.stringify({ reserva, notificacion: notif })
  // );
  // ```
  //
  // Ejemplo con AWS API Gateway WebSocket:
  // ```typescript
  // import { ApiGatewayManagementApi } from 'aws-sdk';
  // const apiGateway = new ApiGatewayManagementApi({ endpoint: 'wss://...' });
  // const connectionIds = await obtenerConnectionIds(entrenadorId);
  // await Promise.all(connectionIds.map(connectionId =>
  //   apiGateway.postToConnection({
  //     ConnectionId: connectionId,
  //     Data: JSON.stringify({ type: 'nueva-reserva', data: reserva })
  //   }).promise()
  // ));
  // ```
  // ============================================================================
};

/**
 * Crea una notificación cuando se realiza una nueva reserva
 * 
 * Esta función crea la notificación y automáticamente emite el evento
 * a todos los suscriptores del bus de notificaciones en tiempo real.
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

  // Emitir evento a todos los suscriptores del bus de notificaciones
  await emitirNuevaReserva(reserva, entrenadorId, notificacion);

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

