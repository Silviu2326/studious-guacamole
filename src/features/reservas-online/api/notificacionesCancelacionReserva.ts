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

/**
 * Interfaz para notificaciones de cancelación enviadas al cliente
 */
export interface NotificacionCancelacionEnviada {
  reservaId: string;
  clienteId: string;
  clienteNombre: string;
  clienteEmail?: string;
  clienteTelefono?: string;
  fecha: Date;
  horaInicio: string;
  horaFin: string;
  tipoSesion: string;
  motivo?: string;
  enviado: boolean;
  fechaEnvio: Date;
  canal: 'email' | 'sms' | 'push' | 'whatsapp' | 'todos';
}

/**
 * Genera el mensaje de notificación para una cancelación de reserva
 * 
 * Este mensaje se envía al cliente cuando se cancela una reserva.
 */
export const generarMensajeCancelacion = (reserva: Reserva, motivo?: string): string => {
  const fechaStr = reserva.fecha?.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) || reserva.fechaInicio?.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) || 'Fecha no disponible';

  const tipoSesionStr = reserva.tipoSesion === 'presencial' 
    ? 'Presencial' 
    : reserva.tipoSesion === 'videollamada' 
    ? 'Videollamada' 
    : 'Sesión';

  const horaInicio = reserva.horaInicio || (reserva.fechaInicio ? 
    reserva.fechaInicio.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : 
    'Hora no disponible');
  const horaFin = reserva.horaFin || (reserva.fechaFin ? 
    reserva.fechaFin.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : 
    'Hora no disponible');

  let mensaje = `Hola ${reserva.clienteNombre || 'Cliente'},

Te informamos que tu reserva ha sido cancelada.

📅 Fecha: ${fechaStr}
⏰ Hora: ${horaInicio} - ${horaFin}
📋 Tipo: ${tipoSesionStr}
`;

  if (motivo) {
    mensaje += `
📝 Motivo: ${motivo}
`;
  }

  if (reserva.precio && reserva.pagado) {
    mensaje += `
💶 Reembolso: Se procesará el reembolso del importe de €${reserva.precio.toFixed(2)} según nuestra política de cancelación.
`;
  }

  mensaje += `
Si tienes alguna pregunta o deseas reprogramar tu sesión, no dudes en contactarnos.

Saludos,
Equipo de Entrenamiento`;

  return mensaje;
};

/**
 * Envía notificación de cancelación al cliente
 * 
 * Esta función se debe llamar cuando se cancela una reserva para notificar
 * al cliente. En un entorno real, esto se integraría con:
 * - Colas de mensajería (RabbitMQ, AWS SQS, Redis Queue) para procesamiento asíncrono
 * - Servicios de email (SendGrid, AWS SES, Mailgun)
 * - Servicios de SMS (Twilio, AWS SNS)
 * - Servicios de push notifications (Firebase, OneSignal)
 * - WhatsApp Business API para mensajes de WhatsApp
 * 
 * @param reserva - La reserva que se ha cancelado
 * @param motivo - Motivo de la cancelación (opcional)
 * @param canal - Canal de notificación a usar ('todos' envía por todos los canales disponibles)
 * @returns Información sobre la notificación enviada
 */
export const enviarNotificacionCancelacion = async (
  reserva: Reserva,
  motivo?: string,
  canal: 'email' | 'sms' | 'push' | 'whatsapp' | 'todos' = 'todos'
): Promise<NotificacionCancelacionEnviada> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const mensaje = generarMensajeCancelacion(reserva, motivo);

  const notificacion: NotificacionCancelacionEnviada = {
    reservaId: reserva.id,
    clienteId: reserva.clienteId,
    clienteNombre: reserva.clienteNombre || 'Cliente',
    clienteEmail: `cliente-${reserva.clienteId}@example.com`, // En producción, obtener del sistema de clientes
    clienteTelefono: `+34 600 000 000`, // En producción, obtener del sistema de clientes
    fecha: reserva.fecha || reserva.fechaInicio,
    horaInicio: reserva.horaInicio || (reserva.fechaInicio ? 
      reserva.fechaInicio.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : 
      ''),
    horaFin: reserva.horaFin || (reserva.fechaFin ? 
      reserva.fechaFin.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : 
      ''),
    tipoSesion: reserva.tipoSesion || 'Sesión',
    motivo,
    enviado: true,
    fechaEnvio: new Date(),
    canal,
  };

  // Simular envío de notificaciones
  console.log('[NotificacionesCancelacionReserva] Enviando notificación de cancelación:', {
    cliente: notificacion.clienteNombre,
    reservaId: reserva.id,
    motivo,
    canal,
    mensaje: mensaje.substring(0, 100) + '...',
  });

  // ============================================================================
  // INTEGRACIÓN CON SERVICIOS REALES (COMENTARIOS PARA PRODUCCIÓN)
  // ============================================================================
  // 
  // En un entorno de producción, aquí se integrarían los siguientes servicios:
  //
  // 1. COLAS DE MENSAJERÍA (para procesamiento asíncrono):
  //    - RabbitMQ: Publicar mensaje a cola 'notificaciones.cancelacion'
  //    - AWS SQS: Enviar mensaje a cola SQS
  //    - Redis Queue (Bull): Agregar job a cola de notificaciones
  //    - Google Cloud Pub/Sub: Publicar evento de cancelación
  //
  // 2. SERVICIOS DE EMAIL:
  //    - SendGrid: await sgMail.send({ to, from, subject, html })
  //    - AWS SES: await ses.sendEmail({ Destination, Message, Source })
  //    - Mailgun: await mailgun.messages().send({ from, to, subject, html })
  //    - Nodemailer: await transporter.sendMail({ from, to, subject, html })
  //
  // 3. SERVICIOS DE SMS:
  //    - Twilio: await twilioClient.messages.create({ to, from, body })
  //    - AWS SNS: await sns.publish({ PhoneNumber, Message })
  //    - MessageBird: await messagebird.messages.create({ recipients, body })
  //
  // 4. PUSH NOTIFICATIONS:
  //    - Firebase Cloud Messaging: await admin.messaging().send({ token, notification })
  //    - OneSignal: await oneSignal.createNotification({ contents, include_player_ids })
  //    - Pusher Beams: await beamsClient.publishToInterests(['user-123'], { web, fcm })
  //
  // 5. WHATSAPP BUSINESS API:
  //    - Twilio WhatsApp: await twilioClient.messages.create({ from: 'whatsapp:+...', to, body })
  //    - WhatsApp Business API: POST a /messages endpoint con template o mensaje libre
  //
  // 6. WEBSOCKETS (para notificaciones en tiempo real):
  //    - Socket.io: io.to(`cliente-${clienteId}`).emit('reserva-cancelada', reserva)
  //    - WebSocket nativo: ws.send(JSON.stringify({ type: 'reserva-cancelada', data: reserva }))
  //    - Pusher: await pusher.trigger('canal-cliente', 'reserva-cancelada', reserva)
  //    - Ably: await channel.publish('reserva-cancelada', reserva)
  //
  // Ejemplo de integración con cola de mensajería (RabbitMQ):
  // ```typescript
  // import amqp from 'amqplib';
  // const connection = await amqp.connect('amqp://localhost');
  // const channel = await connection.createChannel();
  // await channel.assertQueue('notificaciones.cancelacion', { durable: true });
  // await channel.sendToQueue('notificaciones.cancelacion', 
  //   Buffer.from(JSON.stringify({ reserva, motivo, canal, mensaje })), 
  //   { persistent: true }
  // );
  // ```
  //
  // Ejemplo de integración con WebSocket (Socket.io):
  // ```typescript
  // import { io } from 'socket.io-client';
  // const socket = io('https://api.example.com');
  // socket.emit('reserva-cancelada', { reserva, motivo, clienteId: reserva.clienteId });
  // ```
  // ============================================================================

  if (canal === 'email' || canal === 'todos') {
    // Simular envío de email
    console.log('[NotificacionesCancelacionReserva] Email enviado a:', notificacion.clienteEmail);
    console.log('[NotificacionesCancelacionReserva] Asunto: Reserva cancelada');
    console.log('[NotificacionesCancelacionReserva] Mensaje:', mensaje);
  }

  if (canal === 'sms' || canal === 'todos') {
    // Para SMS, usar una versión más corta del mensaje
    const mensajeSMS = `Reserva cancelada: ${notificacion.fecha.toLocaleDateString('es-ES')} a las ${notificacion.horaInicio}.${motivo ? ` Motivo: ${motivo}` : ''}`;
    console.log('[NotificacionesCancelacionReserva] SMS enviado a:', notificacion.clienteTelefono);
    console.log('[NotificacionesCancelacionReserva] Mensaje SMS:', mensajeSMS);
  }

  if (canal === 'push' || canal === 'todos') {
    // Simular envío de push notification
    console.log('[NotificacionesCancelacionReserva] Push notification enviada a cliente:', reserva.clienteId);
    console.log('[NotificacionesCancelacionReserva] Título: Reserva cancelada');
    console.log('[NotificacionesCancelacionReserva] Cuerpo:', `Tu reserva del ${notificacion.fecha.toLocaleDateString('es-ES')} a las ${notificacion.horaInicio} ha sido cancelada`);
  }

  if (canal === 'whatsapp' || canal === 'todos') {
    // Simular envío de WhatsApp
    console.log('[NotificacionesCancelacionReserva] WhatsApp enviado a:', notificacion.clienteTelefono);
    console.log('[NotificacionesCancelacionReserva] Mensaje WhatsApp:', mensaje);
    // En producción, aquí se enviarían botones interactivos de WhatsApp
    console.log('[NotificacionesCancelacionReserva] Botones WhatsApp: Reprogramar reserva, Contactar soporte');
  }

  return notificacion;
};


