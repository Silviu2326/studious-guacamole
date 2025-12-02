import { Factura, LinkPago, SuscripcionFacturacion } from '../types';

export type CanalNotificacion = 'email' | 'whatsapp' | 'ambos';

export interface NotificacionFactura {
  id: string;
  facturaId: string;
  canal: CanalNotificacion;
  destinatario: string;
  enviado: boolean;
  fechaEnvio: Date;
  error?: string;
  linkPagoIncluido?: boolean;
}

export interface NotificacionLinkPago {
  id: string;
  linkPagoId: string;
  facturaId: string;
  canal: CanalNotificacion;
  destinatario: string;
  enviado: boolean;
  fechaEnvio: Date;
  error?: string;
}

// Generar mensaje de email para factura
function generarMensajeEmailFactura(factura: Factura, linkPago?: LinkPago): string {
  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(valor);
  };

  let mensaje = `
Hola ${factura.cliente.nombre},

Te enviamos la factura ${factura.numeroFactura} por los servicios contratados.

Detalles de la factura:
- Número: ${factura.numeroFactura}
- Fecha de emisión: ${factura.fechaEmision.toLocaleDateString('es-ES')}
- Fecha de vencimiento: ${factura.fechaVencimiento.toLocaleDateString('es-ES')}
- Total: ${formatearMoneda(factura.total)}

Items:
${factura.items.map(item => `- ${item.descripcion}: ${formatearMoneda(item.subtotal)}`).join('\n')}

`;

  if (linkPago && linkPago.estado === 'activo') {
    mensaje += `
Puedes pagar esta factura online usando el siguiente link:
${linkPago.url}

Este link expira el ${linkPago.fechaExpiracion.toLocaleDateString('es-ES')}.
`;
  } else {
    mensaje += `
Por favor, realiza el pago antes de la fecha de vencimiento.
`;
  }

  mensaje += `
Si tienes alguna pregunta, no dudes en contactarnos.

Saludos,
Equipo de Facturación
`;

  return mensaje;
}

// Generar mensaje de WhatsApp para factura
function generarMensajeWhatsAppFactura(factura: Factura, linkPago?: LinkPago): string {
  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(valor);
  };

  let mensaje = `📄 *Factura ${factura.numeroFactura}*

Hola ${factura.cliente.nombre},

Te enviamos tu factura:
• Total: ${formatearMoneda(factura.total)}
• Vencimiento: ${factura.fechaVencimiento.toLocaleDateString('es-ES')}

`;

  if (linkPago && linkPago.estado === 'activo') {
    mensaje += `💳 Puedes pagar online:
${linkPago.url}

⏰ Válido hasta: ${linkPago.fechaExpiracion.toLocaleDateString('es-ES')}
`;
  }

  mensaje += `
Gracias por tu confianza.`;

  return mensaje;
}

// Generar mensaje de email para link de pago
function generarMensajeEmailLinkPago(factura: Factura, linkPago: LinkPago): string {
  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(valor);
  };

  return `
Hola ${factura.cliente.nombre},

Tienes una factura pendiente de pago:
- Factura: ${factura.numeroFactura}
- Monto: ${formatearMoneda(linkPago.monto)}
- Vencimiento: ${factura.fechaVencimiento.toLocaleDateString('es-ES')}

Puedes pagar esta factura online usando el siguiente link:
${linkPago.url}

Métodos de pago disponibles: ${linkPago.metodoPagoPermitido.map(m => m === 'tarjeta' ? 'Tarjeta' : 'Transferencia').join(', ')}

Este link expira el ${linkPago.fechaExpiracion.toLocaleDateString('es-ES')}.

Si tienes alguna pregunta, no dudes en contactarnos.

Saludos,
Equipo de Facturación
`;
}

// Generar mensaje de WhatsApp para link de pago
function generarMensajeWhatsAppLinkPago(factura: Factura, linkPago: LinkPago): string {
  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(valor);
  };

  return `💳 *Link de Pago - Factura ${factura.numeroFactura}*

Hola ${factura.cliente.nombre},

Tienes una factura pendiente:
• Monto: ${formatearMoneda(linkPago.monto)}
• Vencimiento: ${factura.fechaVencimiento.toLocaleDateString('es-ES')}

Paga online aquí:
${linkPago.url}

💳 Métodos: ${linkPago.metodoPagoPermitido.map(m => m === 'tarjeta' ? 'Tarjeta' : 'Transferencia').join(', ')}
⏰ Válido hasta: ${linkPago.fechaExpiracion.toLocaleDateString('es-ES')}

Gracias!`;
}

export const notificacionesAPI = {
  // Enviar factura por email/WhatsApp
  async enviarFactura(
    factura: Factura,
    canal: CanalNotificacion = 'ambos',
    linkPago?: LinkPago
  ): Promise<NotificacionFactura> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const destinatario = canal === 'email' || canal === 'ambos' 
      ? factura.cliente.email 
      : factura.cliente.telefono || factura.cliente.email;

    try {
      if (canal === 'email' || canal === 'ambos') {
        const mensajeEmail = generarMensajeEmailFactura(factura, linkPago);
        console.log('[Notificaciones] Enviando email de factura:', {
          destinatario: factura.cliente.email,
          facturaId: factura.id,
          asunto: `Factura ${factura.numeroFactura}`,
          mensaje: mensajeEmail.substring(0, 100) + '...',
        });
        // En producción, aquí se enviaría el email real
      }

      if (canal === 'whatsapp' || canal === 'ambos') {
        const mensajeWhatsApp = generarMensajeWhatsAppFactura(factura, linkPago);
        const telefono = factura.cliente.telefono || factura.cliente.email;
        console.log('[Notificaciones] Enviando WhatsApp de factura:', {
          destinatario: telefono,
          facturaId: factura.id,
          mensaje: mensajeWhatsApp.substring(0, 100) + '...',
        });
        // En producción, aquí se enviaría el WhatsApp real
      }

      const notificacion: NotificacionFactura = {
        id: `notif-${Date.now()}`,
        facturaId: factura.id,
        canal,
        destinatario,
        enviado: true,
        fechaEnvio: new Date(),
        linkPagoIncluido: !!linkPago,
      };

      return notificacion;
    } catch (error) {
      const notificacion: NotificacionFactura = {
        id: `notif-${Date.now()}`,
        facturaId: factura.id,
        canal,
        destinatario,
        enviado: false,
        fechaEnvio: new Date(),
        error: error instanceof Error ? error.message : 'Error desconocido',
        linkPagoIncluido: !!linkPago,
      };
      throw notificacion;
    }
  },

  // Enviar link de pago por email/WhatsApp
  async enviarLinkPago(
    factura: Factura,
    linkPago: LinkPago,
    canal: CanalNotificacion = 'ambos'
  ): Promise<NotificacionLinkPago> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const destinatario = canal === 'email' || canal === 'ambos' 
      ? factura.cliente.email 
      : factura.cliente.telefono || factura.cliente.email;

    try {
      if (canal === 'email' || canal === 'ambos') {
        const mensajeEmail = generarMensajeEmailLinkPago(factura, linkPago);
        console.log('[Notificaciones] Enviando email con link de pago:', {
          destinatario: factura.cliente.email,
          facturaId: factura.id,
          linkPagoId: linkPago.id,
          asunto: `Link de Pago - Factura ${factura.numeroFactura}`,
          mensaje: mensajeEmail.substring(0, 100) + '...',
        });
        // En producción, aquí se enviaría el email real
      }

      if (canal === 'whatsapp' || canal === 'ambos') {
        const mensajeWhatsApp = generarMensajeWhatsAppLinkPago(factura, linkPago);
        const telefono = factura.cliente.telefono || factura.cliente.email;
        console.log('[Notificaciones] Enviando WhatsApp con link de pago:', {
          destinatario: telefono,
          facturaId: factura.id,
          linkPagoId: linkPago.id,
          mensaje: mensajeWhatsApp.substring(0, 100) + '...',
        });
        // En producción, aquí se enviaría el WhatsApp real
      }

      const notificacion: NotificacionLinkPago = {
        id: `notif-link-${Date.now()}`,
        linkPagoId: linkPago.id,
        facturaId: factura.id,
        canal,
        destinatario,
        enviado: true,
        fechaEnvio: new Date(),
      };

      return notificacion;
    } catch (error) {
      const notificacion: NotificacionLinkPago = {
        id: `notif-link-${Date.now()}`,
        linkPagoId: linkPago.id,
        facturaId: factura.id,
        canal,
        destinatario,
        enviado: false,
        fechaEnvio: new Date(),
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
      throw notificacion;
    }
  },

  // Enviar notificación de factura generada automáticamente desde suscripción
  async enviarFacturaRecurrente(
    factura: Factura,
    suscripcion: SuscripcionFacturacion,
    linkPago?: LinkPago
  ): Promise<NotificacionFactura> {
    const canal: CanalNotificacion = suscripcion.mediosEnvio.length === 2 
      ? 'ambos' 
      : suscripcion.mediosEnvio[0] === 'email' 
        ? 'email' 
        : 'whatsapp';

    return this.enviarFactura(factura, canal, linkPago);
  },
};


