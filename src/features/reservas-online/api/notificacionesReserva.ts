import { Reserva } from '../types';
import { ReprogramacionReserva } from './reservas';

/**
 * Interfaz para notificaciones de reserva creada
 */
export interface NotificacionReservaCreada {
  reservaId: string;
  clienteId: string;
  clienteNombre: string;
  clienteEmail?: string;
  clienteTelefono?: string;
  fecha: Date;
  horaInicio: string;
  horaFin: string;
  tipoSesion: string;
  tipo?: string;
  precio?: number;
  enviado: boolean;
  fechaEnvio: Date;
  canal: 'email' | 'sms' | 'push' | 'whatsapp' | 'todos';
}

/**
 * Genera el mensaje de notificación para una reserva creada
 * 
 * Este mensaje se envía al cliente cuando se crea una nueva reserva.
 * Incluye toda la información relevante sobre la reserva.
 */
export const generarMensajeReservaCreada = (reserva: Reserva): string => {
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

¡Tu reserva ha sido creada exitosamente!

📅 Fecha: ${fechaStr}
⏰ Hora: ${horaInicio} - ${horaFin}
📋 Tipo: ${tipoSesionStr}
`;

  if (reserva.precio) {
    mensaje += `💶 Precio: €${reserva.precio.toFixed(2)}\n`;
  }

  // Incluir enlace de videollamada si está disponible
  if (reserva.tipoSesion === 'videollamada' && reserva.enlaceVideollamada) {
    mensaje += `
🎥 Enlace de videollamada: ${reserva.enlaceVideollamada}

Haz clic en el enlace para unirte a la sesión en el momento programado.
`;
  }

  if (reserva.estado === 'pendiente') {
    mensaje += `
⏳ Estado: Pendiente de aprobación

Te notificaremos cuando tu reserva sea confirmada.
`;
  } else if (reserva.estado === 'confirmada') {
    mensaje += `
✅ Estado: Confirmada

¡Nos vemos en la sesión!
`;
  }

  mensaje += `
Si tienes alguna pregunta o necesitas modificar tu reserva, no dudes en contactarnos.

Saludos,
Equipo de Entrenamiento`;

  return mensaje;
};

/**
 * Envía notificación al cliente cuando se crea una nueva reserva
 * 
 * Esta función se debe llamar después de crear una reserva exitosamente.
 * En un entorno real, esto se integraría con:
 * - Colas de mensajería (RabbitMQ, AWS SQS, Redis Queue) para procesamiento asíncrono
 * - Servicios de email (SendGrid, AWS SES, Mailgun)
 * - Servicios de SMS (Twilio, AWS SNS)
 * - Servicios de push notifications (Firebase Cloud Messaging, OneSignal)
 * - WhatsApp Business API para mensajes de WhatsApp
 * 
 * @param reserva - La reserva que se acaba de crear
 * @param canal - Canal de notificación a usar ('todos' envía por todos los canales disponibles)
 * @returns Información sobre la notificación enviada
 */
export const enviarNotificacionReservaCreada = async (
  reserva: Reserva,
  canal: 'email' | 'sms' | 'push' | 'whatsapp' | 'todos' = 'todos'
): Promise<NotificacionReservaCreada> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const mensaje = generarMensajeReservaCreada(reserva);

  const notificacion: NotificacionReservaCreada = {
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
    tipo: reserva.tipo,
    precio: reserva.precio,
    enviado: true,
    fechaEnvio: new Date(),
    canal,
  };

  // Simular envío de notificaciones
  console.log('[NotificacionesReserva] Enviando notificación de reserva creada:', {
    cliente: notificacion.clienteNombre,
    reservaId: reserva.id,
    estado: reserva.estado,
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
  //    - RabbitMQ: Publicar mensaje a cola 'notificaciones.reserva-creada'
  //    - AWS SQS: Enviar mensaje a cola SQS
  //    - Redis Queue (Bull): Agregar job a cola de notificaciones
  //    - Google Cloud Pub/Sub: Publicar evento de reserva creada
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
  //    - Socket.io: io.to(`entrenador-${entrenadorId}`).emit('nueva-reserva', reserva)
  //    - WebSocket nativo: ws.send(JSON.stringify({ type: 'nueva-reserva', data: reserva }))
  //    - Pusher: await pusher.trigger('canal-entrenador', 'nueva-reserva', reserva)
  //    - Ably: await channel.publish('nueva-reserva', reserva)
  //
  // Ejemplo de integración con cola de mensajería (RabbitMQ):
  // ```typescript
  // import amqp from 'amqplib';
  // const connection = await amqp.connect('amqp://localhost');
  // const channel = await connection.createChannel();
  // await channel.assertQueue('notificaciones.reserva-creada', { durable: true });
  // await channel.sendToQueue('notificaciones.reserva-creada', 
  //   Buffer.from(JSON.stringify({ reserva, canal, mensaje })), 
  //   { persistent: true }
  // );
  // ```
  //
  // Ejemplo de integración con WebSocket (Socket.io):
  // ```typescript
  // import { io } from 'socket.io-client';
  // const socket = io('https://api.example.com');
  // socket.emit('nueva-reserva', { reserva, entrenadorId: reserva.entrenadorId });
  // ```
  // ============================================================================

  if (canal === 'email' || canal === 'todos') {
    // Simular envío de email
    console.log('[NotificacionesReserva] Email enviado a:', notificacion.clienteEmail);
    console.log('[NotificacionesReserva] Asunto: Reserva creada exitosamente');
    console.log('[NotificacionesReserva] Mensaje:', mensaje);
  }

  if (canal === 'sms' || canal === 'todos') {
    // Para SMS, usar una versión más corta del mensaje
    const mensajeSMS = `Reserva creada: ${notificacion.fecha.toLocaleDateString('es-ES')} a las ${notificacion.horaInicio}. ${reserva.estado === 'pendiente' ? 'Pendiente de aprobación.' : 'Confirmada.'}`;
    console.log('[NotificacionesReserva] SMS enviado a:', notificacion.clienteTelefono);
    console.log('[NotificacionesReserva] Mensaje SMS:', mensajeSMS);
  }

  if (canal === 'push' || canal === 'todos') {
    // Simular envío de push notification
    console.log('[NotificacionesReserva] Push notification enviada a cliente:', reserva.clienteId);
    console.log('[NotificacionesReserva] Título: Reserva creada');
    console.log('[NotificacionesReserva] Cuerpo:', `Tu reserva del ${notificacion.fecha.toLocaleDateString('es-ES')} a las ${notificacion.horaInicio} ha sido creada`);
  }

  if (canal === 'whatsapp' || canal === 'todos') {
    // Simular envío de WhatsApp
    console.log('[NotificacionesReserva] WhatsApp enviado a:', notificacion.clienteTelefono);
    console.log('[NotificacionesReserva] Mensaje WhatsApp:', mensaje);
    // En producción, aquí se enviarían botones interactivos de WhatsApp
    console.log('[NotificacionesReserva] Botones WhatsApp: Ver detalles de reserva, Modificar reserva');
  }

  return notificacion;
};

export interface NotificacionReprogramacion {
  reservaId: string;
  clienteId: string;
  clienteNombre: string;
  clienteEmail?: string;
  clienteTelefono?: string;
  fechaAnterior: Date;
  horaInicioAnterior: string;
  horaFinAnterior: string;
  fechaNueva: Date;
  horaInicioNueva: string;
  horaFinNueva: string;
  tipoSesion: string;
  motivo?: string;
  enviado: boolean;
  fechaEnvio?: Date;
  canal: 'email' | 'sms' | 'push' | 'whatsapp' | 'todos';
}

/**
 * Genera el mensaje de notificación para reprogramación de reserva
 */
export const generarMensajeReprogramacion = (
  reserva: Reserva,
  reprogramacion: ReprogramacionReserva,
  motivo?: string
): string => {
  const fechaAnteriorStr = reserva.fecha.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const fechaNuevaStr = reprogramacion.fecha.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const tipoSesionStr = reserva.tipoSesion === 'presencial' 
    ? 'Presencial' 
    : reserva.tipoSesion === 'videollamada' 
    ? 'Videollamada' 
    : 'Sesión';

  let mensaje = `Hola ${reserva.clienteNombre},

Te informamos que tu sesión ha sido reprogramada.

Datos anteriores:
- Fecha: ${fechaAnteriorStr}
- Hora: ${reserva.horaInicio} - ${reserva.horaFin}
- Tipo: ${tipoSesionStr}

Nuevos datos:
- Fecha: ${fechaNuevaStr}
- Hora: ${reprogramacion.horaInicio} - ${reprogramacion.horaFin}
- Tipo: ${tipoSesionStr}
`;

  // Incluir enlace de videollamada si está disponible (puede haber cambiado si se regeneró)
  if (reserva.tipoSesion === 'videollamada' && reserva.enlaceVideollamada) {
    mensaje += `
🎥 Enlace de videollamada: ${reserva.enlaceVideollamada}
`;
  }

  mensaje += `
${motivo ? `Motivo del cambio: ${motivo}\n\n` : ''}Por favor, confirma si esta nueva fecha y hora te convienen. Si tienes alguna pregunta o no puedes asistir, contáctanos.

Saludos,
Equipo de Entrenamiento`;

  return mensaje;
};

/**
 * Envía notificación de reprogramación al cliente
 */
export const enviarNotificacionReprogramacion = async (
  reserva: Reserva,
  reprogramacion: ReprogramacionReserva,
  motivo?: string,
  canal: 'email' | 'sms' | 'push' | 'whatsapp' | 'todos' = 'todos'
): Promise<NotificacionReprogramacion> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const mensaje = generarMensajeReprogramacion(reserva, reprogramacion, motivo);

  const notificacion: NotificacionReprogramacion = {
    reservaId: reserva.id,
    clienteId: reserva.clienteId,
    clienteNombre: reserva.clienteNombre,
    clienteEmail: `cliente-${reserva.clienteId}@example.com`, // En producción, obtener del sistema de clientes
    clienteTelefono: `+34 600 000 000`, // En producción, obtener del sistema de clientes
    fechaAnterior: reserva.fecha,
    horaInicioAnterior: reserva.horaInicio,
    horaFinAnterior: reserva.horaFin,
    fechaNueva: reprogramacion.fecha,
    horaInicioNueva: reprogramacion.horaInicio,
    horaFinNueva: reprogramacion.horaFin,
    tipoSesion: reserva.tipoSesion || 'Sesión',
    motivo,
    enviado: true,
    fechaEnvio: new Date(),
    canal,
  };

  // Simular envío de notificaciones
  console.log('[NotificacionesReserva] Enviando notificación de reprogramación:', {
    cliente: reserva.clienteNombre,
    reservaId: reserva.id,
    canal,
    mensaje: mensaje.substring(0, 100) + '...',
  });

  // En producción, aquí se enviarían las notificaciones reales:
  // - Email: usar servicio de email (SendGrid, AWS SES, etc.)
  // - SMS: usar servicio de SMS (Twilio, AWS SNS, etc.)
  // - Push: usar servicio de push notifications (Firebase, OneSignal, etc.)

  if (canal === 'email' || canal === 'todos') {
    // Simular envío de email
    console.log('[NotificacionesReserva] Email enviado a:', notificacion.clienteEmail);
  }

  if (canal === 'sms' || canal === 'todos') {
    // Simular envío de SMS
    console.log('[NotificacionesReserva] SMS enviado a:', notificacion.clienteTelefono);
  }

  if (canal === 'push' || canal === 'todos') {
    // Simular envío de push notification
    console.log('[NotificacionesReserva] Push notification enviada a cliente:', reserva.clienteId);
  }

  if (canal === 'whatsapp' || canal === 'todos') {
    // Simular envío de WhatsApp
    console.log('[NotificacionesReserva] WhatsApp enviado a:', notificacion.clienteTelefono);
  }

  return notificacion;
};

/**
 * Genera el mensaje de recordatorio para una reserva
 * Incluye el enlace de videollamada si la reserva es de tipo videollamada
 * Incluye enlaces de confirmación/cancelación si se proporciona token
 */
export const generarMensajeRecordatorio = (reserva: Reserva, tokenConfirmacion?: string, baseUrl?: string): string => {
  const fechaStr = reserva.fecha.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const tipoSesionStr = reserva.tipoSesion === 'presencial' 
    ? 'Presencial' 
    : reserva.tipoSesion === 'videollamada' 
    ? 'Videollamada' 
    : 'Sesión';

  let mensaje = `Hola ${reserva.clienteNombre},

Te recordamos que tienes una sesión programada:

📅 Fecha: ${fechaStr}
⏰ Hora: ${reserva.horaInicio} - ${reserva.horaFin}
📋 Tipo: ${tipoSesionStr}
`;

  // Incluir enlace de videollamada si está disponible
  if (reserva.tipoSesion === 'videollamada' && reserva.enlaceVideollamada) {
    mensaje += `
🎥 Enlace de videollamada: ${reserva.enlaceVideollamada}

Haz clic en el enlace para unirte a la sesión en el momento programado.
`;
  }

  // Incluir enlaces de confirmación si se proporciona token
  if (tokenConfirmacion && baseUrl) {
    const urlConfirmar = `${baseUrl}/confirmar-reserva/${tokenConfirmacion}?accion=confirmar`;
    const urlCancelar = `${baseUrl}/confirmar-reserva/${tokenConfirmacion}?accion=cancelar`;
    
    mensaje += `
    
✅ Confirmar asistencia: ${urlConfirmar}
❌ Cancelar sesión: ${urlCancelar}

Por favor, confirma tu asistencia o cancela si no puedes asistir.
`;
  } else {
    mensaje += `
Por favor, confirma tu asistencia o contáctanos si necesitas reprogramar.
`;
  }

  mensaje += `
Saludos,
Equipo de Entrenamiento`;

  return mensaje;
};

/**
 * Envía recordatorio de reserva al cliente
 * Incluye automáticamente el enlace de videollamada si la reserva es de tipo videollamada
 */
export const enviarRecordatorioReserva = async (
  reserva: Reserva,
  canal: 'email' | 'sms' | 'push' | 'whatsapp' | 'todos' = 'email',
  tokenConfirmacion?: string
): Promise<{
  reservaId: string;
  clienteId: string;
  clienteNombre: string;
  enviado: boolean;
  fechaEnvio: Date;
  canal: 'email' | 'sms' | 'push' | 'whatsapp' | 'todos';
  incluyeEnlaceVideollamada: boolean;
}> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  // Obtener URL base para los enlaces de confirmación
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://app.example.com';
  const mensaje = generarMensajeRecordatorio(reserva, tokenConfirmacion, baseUrl);
  const incluyeEnlaceVideollamada = reserva.tipoSesion === 'videollamada' && !!reserva.enlaceVideollamada;

  const resultado = {
    reservaId: reserva.id,
    clienteId: reserva.clienteId,
    clienteNombre: reserva.clienteNombre,
    enviado: true,
    fechaEnvio: new Date(),
    canal,
    incluyeEnlaceVideollamada,
  };

  // Simular envío de notificaciones
  console.log('[NotificacionesReserva] Enviando recordatorio:', {
    cliente: reserva.clienteNombre,
    reservaId: reserva.id,
    canal,
    incluyeEnlaceVideollamada,
    mensaje: mensaje.substring(0, 100) + '...',
  });

  // En producción, aquí se enviarían las notificaciones reales:
  // - Email: usar servicio de email (SendGrid, AWS SES, etc.)
  // - SMS: usar servicio de SMS (Twilio, AWS SNS, etc.)
  // - Push: usar servicio de push notifications (Firebase, OneSignal, etc.)

  if (canal === 'email' || canal === 'todos') {
    // Simular envío de email con el mensaje que incluye el enlace de videollamada
    console.log('[NotificacionesReserva] Email de recordatorio enviado a:', `cliente-${reserva.clienteId}@example.com`);
    console.log('[NotificacionesReserva] Mensaje:', mensaje);
  }

  if (canal === 'sms' || canal === 'todos') {
    // Para SMS, usar una versión más corta del mensaje
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://app.example.com';
    let mensajeSMS = `Recordatorio: Sesión ${reserva.fecha.toLocaleDateString('es-ES')} a las ${reserva.horaInicio}`;
    if (incluyeEnlaceVideollamada && reserva.enlaceVideollamada) {
      mensajeSMS += `. Enlace: ${reserva.enlaceVideollamada}`;
    }
    if (tokenConfirmacion) {
      const urlConfirmar = `${baseUrl}/confirmar-reserva/${tokenConfirmacion}?accion=confirmar`;
      mensajeSMS += ` Confirmar: ${urlConfirmar}`;
    }
    console.log('[NotificacionesReserva] SMS de recordatorio enviado a:', `+34 600 000 000`);
    console.log('[NotificacionesReserva] Mensaje SMS:', mensajeSMS);
  }

  if (canal === 'whatsapp' || canal === 'todos') {
    // Para WhatsApp, usar el mensaje completo con botones interactivos (en producción)
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://app.example.com';
    console.log('[NotificacionesReserva] WhatsApp de recordatorio enviado a:', `+34 600 000 000`);
    console.log('[NotificacionesReserva] Mensaje WhatsApp:', mensaje);
    if (tokenConfirmacion) {
      // En producción, aquí se enviarían botones interactivos de WhatsApp
      console.log('[NotificacionesReserva] Botones WhatsApp: Confirmar asistencia, Cancelar sesión');
    }
  }

  if (canal === 'push' || canal === 'todos') {
    // Simular envío de push notification
    console.log('[NotificacionesReserva] Push notification de recordatorio enviada a cliente:', reserva.clienteId);
  }

  return resultado;
};

/**
 * Verifica si el cliente debe recibir notificación (por ejemplo, según preferencias)
 */
export const debeEnviarNotificacion = async (
  clienteId: string,
  tipoNotificacion: 'reprogramacion' | 'cancelacion' | 'recordatorio'
): Promise<boolean> => {
  // En producción, aquí se verificarían las preferencias del cliente
  // Por ahora, siempre retornamos true
  await new Promise(resolve => setTimeout(resolve, 100));
  return true;
};

/**
 * Genera el mensaje de recordatorio de pago pendiente
 */
export const generarMensajeRecordatorioPago = (reserva: Reserva): string => {
  const fechaStr = reserva.fecha.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const tipoSesionStr = reserva.tipoSesion === 'presencial' 
    ? 'Presencial' 
    : reserva.tipoSesion === 'videollamada' 
    ? 'Videollamada' 
    : 'Sesión';

  let mensaje = `Hola ${reserva.clienteNombre},

Te recordamos que tienes un pago pendiente por la siguiente reserva:

📅 Fecha: ${fechaStr}
⏰ Hora: ${reserva.horaInicio} - ${reserva.horaFin}
📋 Tipo: ${tipoSesionStr}
💶 Importe: €${reserva.precio.toFixed(2)}
`;

  // Incluir enlace de videollamada si está disponible
  if (reserva.tipoSesion === 'videollamada' && reserva.enlaceVideollamada) {
    mensaje += `
🎥 Enlace de videollamada: ${reserva.enlaceVideollamada}
`;
  }

  mensaje += `
Por favor, realiza el pago antes de la sesión. Puedes pagar en efectivo o mediante transferencia bancaria.

Si ya realizaste el pago, por favor contacta con nosotros para actualizar el estado.

Saludos,
Equipo de Entrenamiento`;

  return mensaje;
};

/**
 * Envía recordatorio de pago pendiente al cliente
 */
export const enviarRecordatorioPagoPendiente = async (
  reserva: Reserva,
  canal: 'email' | 'sms' | 'push' | 'todos' = 'email'
): Promise<{
  reservaId: string;
  clienteId: string;
  clienteNombre: string;
  enviado: boolean;
  fechaEnvio: Date;
  canal: 'email' | 'sms' | 'push' | 'todos';
}> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const mensaje = generarMensajeRecordatorioPago(reserva);

  const resultado = {
    reservaId: reserva.id,
    clienteId: reserva.clienteId,
    clienteNombre: reserva.clienteNombre,
    enviado: true,
    fechaEnvio: new Date(),
    canal,
  };

  // Simular envío de notificaciones
  console.log('[NotificacionesReserva] Enviando recordatorio de pago pendiente:', {
    cliente: reserva.clienteNombre,
    reservaId: reserva.id,
    precio: reserva.precio,
    canal,
    mensaje: mensaje.substring(0, 100) + '...',
  });

  // En producción, aquí se enviarían las notificaciones reales:
  // - Email: usar servicio de email (SendGrid, AWS SES, etc.)
  // - SMS: usar servicio de SMS (Twilio, AWS SNS, etc.)
  // - Push: usar servicio de push notifications (Firebase, OneSignal, etc.)

  if (canal === 'email' || canal === 'todos') {
    // Simular envío de email
    console.log('[NotificacionesReserva] Email de recordatorio de pago enviado a:', `cliente-${reserva.clienteId}@example.com`);
    console.log('[NotificacionesReserva] Mensaje:', mensaje);
  }

  if (canal === 'sms' || canal === 'todos') {
    // Para SMS, usar una versión más corta del mensaje
    const mensajeSMS = `Recordatorio de pago pendiente: €${reserva.precio.toFixed(2)} por sesión del ${reserva.fecha.toLocaleDateString('es-ES')} a las ${reserva.horaInicio}`;
    console.log('[NotificacionesReserva] SMS de recordatorio de pago enviado a:', `+34 600 000 000`);
    console.log('[NotificacionesReserva] Mensaje SMS:', mensajeSMS);
  }

  if (canal === 'push' || canal === 'todos') {
    // Simular envío de push notification
    console.log('[NotificacionesReserva] Push notification de recordatorio de pago enviada a cliente:', reserva.clienteId);
  }

  return resultado;
};

/**
 * Envía recordatorios de pago pendiente a múltiples clientes
 */
export const enviarRecordatoriosPagosPendientes = async (
  reservas: Reserva[],
  canal: 'email' | 'sms' | 'push' | 'todos' = 'email'
): Promise<{
  totalEnviados: number;
  totalFallidos: number;
  resultados: Array<{
    reservaId: string;
    clienteNombre: string;
    enviado: boolean;
    error?: string;
  }>;
}> => {
  const resultados: Array<{
    reservaId: string;
    clienteNombre: string;
    enviado: boolean;
    error?: string;
  }> = [];

  let totalEnviados = 0;
  let totalFallidos = 0;

  for (const reserva of reservas) {
    try {
      await enviarRecordatorioPagoPendiente(reserva, canal);
      resultados.push({
        reservaId: reserva.id,
        clienteNombre: reserva.clienteNombre,
        enviado: true,
      });
      totalEnviados++;
    } catch (error) {
      resultados.push({
        reservaId: reserva.id,
        clienteNombre: reserva.clienteNombre,
        enviado: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
      totalFallidos++;
    }
  }

  return {
    totalEnviados,
    totalFallidos,
    resultados,
  };
};

/**
 * Genera el mensaje de recordatorio para entrenadores sobre sus sesiones del día
 */
export const generarMensajeRecordatorioEntrenador = (reservas: Reserva[], fecha: Date): string => {
  const fechaStr = fecha.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let mensaje = `Hola,

Te recordamos tus sesiones programadas para hoy (${fechaStr}):

`;

  if (reservas.length === 0) {
    mensaje += 'No tienes sesiones programadas para hoy.';
  } else {
    reservas.forEach((reserva, index) => {
      const tipoSesionStr = reserva.tipoSesion === 'presencial' 
        ? 'Presencial' 
        : reserva.tipoSesion === 'videollamada' 
        ? 'Videollamada' 
        : 'Sesión';
      
      mensaje += `${index + 1}. ${reserva.clienteNombre}\n`;
      mensaje += `   ⏰ Hora: ${reserva.horaInicio} - ${reserva.horaFin}\n`;
      mensaje += `   📋 Tipo: ${tipoSesionStr}\n`;
      
      if (reserva.tipoSesion === 'videollamada' && reserva.enlaceVideollamada) {
        mensaje += `   🎥 Enlace: ${reserva.enlaceVideollamada}\n`;
      }
      
      if (reserva.observaciones) {
        mensaje += `   📝 Notas: ${reserva.observaciones}\n`;
      }
      
      mensaje += `\n`;
    });
    
    mensaje += `Total de sesiones: ${reservas.length}\n\n`;
    mensaje += `¡Que tengas un excelente día de entrenamientos!`;
  }

  return mensaje;
};

/**
 * Envía recordatorio de sesiones del día al entrenador
 */
export const enviarRecordatorioEntrenador = async (
  reservas: Reserva[],
  fecha: Date,
  entrenadorId: string,
  entrenadorEmail?: string,
  entrenadorTelefono?: string,
  canal: 'email' | 'sms' | 'push' | 'whatsapp' | 'todos' = 'email'
): Promise<{
  entrenadorId: string;
  fecha: Date;
  totalSesiones: number;
  enviado: boolean;
  fechaEnvio: Date;
  canal: 'email' | 'sms' | 'push' | 'whatsapp' | 'todos';
}> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const mensaje = generarMensajeRecordatorioEntrenador(reservas, fecha);

  const resultado = {
    entrenadorId,
    fecha,
    totalSesiones: reservas.length,
    enviado: true,
    fechaEnvio: new Date(),
    canal,
  };

  // Simular envío de notificaciones
  console.log('[NotificacionesReserva] Enviando recordatorio a entrenador:', {
    entrenadorId,
    fecha: fecha.toLocaleDateString('es-ES'),
    totalSesiones: reservas.length,
    canal,
    mensaje: mensaje.substring(0, 100) + '...',
  });

  // En producción, aquí se enviarían las notificaciones reales:
  // - Email: usar servicio de email (SendGrid, AWS SES, etc.)
  // - SMS: usar servicio de SMS (Twilio, AWS SNS, etc.)
  // - Push: usar servicio de push notifications (Firebase, OneSignal, etc.)
  // - WhatsApp: usar servicio de WhatsApp Business API

  if (canal === 'email' || canal === 'todos') {
    // Simular envío de email
    console.log('[NotificacionesReserva] Email de recordatorio enviado a entrenador:', entrenadorEmail || `entrenador-${entrenadorId}@example.com`);
    console.log('[NotificacionesReserva] Mensaje:', mensaje);
  }

  if (canal === 'sms' || canal === 'todos') {
    // Para SMS, usar una versión más corta del mensaje
    let mensajeSMS = `Recordatorio: Tienes ${reservas.length} sesión${reservas.length !== 1 ? 'es' : ''} hoy.`;
    if (reservas.length > 0) {
      mensajeSMS += ` Primera sesión: ${reservas[0].horaInicio} con ${reservas[0].clienteNombre}.`;
    }
    console.log('[NotificacionesReserva] SMS de recordatorio enviado a entrenador:', entrenadorTelefono || `+34 600 000 000`);
    console.log('[NotificacionesReserva] Mensaje SMS:', mensajeSMS);
  }

  if (canal === 'whatsapp' || canal === 'todos') {
    // Para WhatsApp, usar el mensaje completo con formato
    console.log('[NotificacionesReserva] WhatsApp de recordatorio enviado a entrenador:', entrenadorTelefono || `+34 600 000 000`);
    console.log('[NotificacionesReserva] Mensaje WhatsApp:', mensaje);
  }

  if (canal === 'push' || canal === 'todos') {
    // Simular envío de push notification
    console.log('[NotificacionesReserva] Push notification de recordatorio enviada a entrenador:', entrenadorId);
  }

  return resultado;
};

/**
 * Obtiene las reservas del día para un entrenador
 */
export const getReservasDelDiaEntrenador = async (
  fecha: Date,
  entrenadorId: string
): Promise<Reserva[]> => {
  // En producción, esto obtendría las reservas del entrenador para el día específico
  // Por ahora, usamos getReservas y filtramos
  const fechaInicio = new Date(fecha);
  fechaInicio.setHours(0, 0, 0, 0);
  const fechaFin = new Date(fecha);
  fechaFin.setHours(23, 59, 59, 999);
  
  const { getReservas } = await import('./reservas');
  const reservas = await getReservas(fechaInicio, fechaFin, 'entrenador');
  
  // Filtrar reservas confirmadas o pendientes del día
  return reservas.filter(r => {
    const fechaReserva = new Date(r.fecha);
    fechaReserva.setHours(0, 0, 0, 0);
    const fechaComparar = new Date(fecha);
    fechaComparar.setHours(0, 0, 0, 0);
    
    return fechaReserva.getTime() === fechaComparar.getTime() &&
      (r.estado === 'confirmada' || r.estado === 'pendiente');
  }).sort((a, b) => {
    // Ordenar por hora de inicio
    const horaA = a.horaInicio.split(':').map(Number);
    const horaB = b.horaInicio.split(':').map(Number);
    const tiempoA = horaA[0] * 60 + horaA[1];
    const tiempoB = horaB[0] * 60 + horaB[1];
    return tiempoA - tiempoB;
  });
};

