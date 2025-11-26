import { Factura, Cobro } from '../types';
import jsPDF from 'jspdf';

export interface ReciboPDF {
  factura: Factura;
  cobro: Cobro;
  pdfBlob: Blob;
}

/**
 * Genera un PDF de recibo de pago
 */
export async function generarReciboPDF(factura: Factura, cobro: Cobro): Promise<Blob> {
  return new Promise((resolve) => {
    const doc = new jsPDF();
    
    const formatearMoneda = (valor: number) => {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
      }).format(valor);
    };

    // Título
    doc.setFontSize(20);
    doc.setTextColor(79, 70, 229);
    doc.text('RECIBO DE PAGO', 105, 20, { align: 'center' });
    
    // Línea separadora
    doc.setDrawColor(79, 70, 229);
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);
    
    // Información de la empresa (simulada)
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('ENTRENAMIENTO PERSONAL', 20, 35);
    doc.text('Nit: 123456789-1', 20, 40);
    doc.text('Email: contacto@entrenamiento.com', 20, 45);
    
    // Información del recibo
    doc.setFontSize(12);
    doc.text(`Recibo No: ${cobro.id}`, 150, 35);
    doc.text(`Fecha: ${cobro.fechaCobro.toLocaleDateString('es-ES')}`, 150, 40);
    
    // Información del cliente
    doc.setFontSize(11);
    doc.text('CLIENTE:', 20, 55);
    doc.setFontSize(10);
    doc.text(`Nombre: ${factura.cliente.nombre}`, 20, 62);
    if (factura.cliente.nit) {
      doc.text(`Nit: ${factura.cliente.nit}`, 20, 68);
    }
    if (factura.cliente.direccion) {
      doc.text(`Dirección: ${factura.cliente.direccion}`, 20, 74);
    }
    doc.text(`Email: ${factura.cliente.email}`, 20, 80);
    
    // Información de la factura
    doc.setFontSize(11);
    doc.text('INFORMACIÓN DE FACTURA:', 20, 90);
    doc.setFontSize(10);
    doc.text(`Factura No: ${factura.numeroFactura}`, 20, 97);
    doc.text(`Fecha Emisión: ${factura.fechaEmision.toLocaleDateString('es-ES')}`, 20, 103);
    doc.text(`Fecha Vencimiento: ${factura.fechaVencimiento.toLocaleDateString('es-ES')}`, 20, 109);
    
    // Detalles del pago
    doc.setFontSize(11);
    doc.text('DETALLES DEL PAGO:', 20, 120);
    doc.setFontSize(10);
    doc.text(`Monto Pagado: ${formatearMoneda(cobro.monto)}`, 20, 127);
    
    const metodoPagoLabels: Record<string, string> = {
      efectivo: 'Efectivo',
      tarjeta: 'Tarjeta',
      transferencia: 'Transferencia',
      cheque: 'Cheque',
      online: 'Online'
    };
    doc.text(`Método de Pago: ${metodoPagoLabels[cobro.metodoPago] || cobro.metodoPago}`, 20, 133);
    
    if (cobro.referencia) {
      doc.text(`Referencia: ${cobro.referencia}`, 20, 139);
    }
    
    // Items de la factura (resumen)
    doc.setFontSize(11);
    doc.text('ITEMS FACTURADOS:', 20, 150);
    doc.setFontSize(9);
    let yPos = 157;
    factura.items.forEach((item, index) => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(`${item.descripcion}`, 20, yPos);
      doc.text(`${formatearMoneda(item.subtotal)}`, 180, yPos, { align: 'right' });
      yPos += 7;
    });
    
    // Totales
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    } else {
      yPos += 10;
    }
    
    doc.setFontSize(10);
    doc.text(`Subtotal: ${formatearMoneda(factura.subtotal)}`, 150, yPos, { align: 'right' });
    yPos += 7;
    if (factura.descuentos > 0) {
      doc.text(`Descuentos: ${formatearMoneda(factura.descuentos)}`, 150, yPos, { align: 'right' });
      yPos += 7;
    }
    if (factura.impuestos > 0) {
      doc.text(`Impuestos: ${formatearMoneda(factura.impuestos)}`, 150, yPos, { align: 'right' });
      yPos += 7;
    }
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Factura: ${formatearMoneda(factura.total)}`, 150, yPos + 5, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    
    yPos += 15;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`MONTO PAGADO: ${formatearMoneda(cobro.monto)}`, 150, yPos, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    
    // Saldo pendiente si aplica
    const saldoPendiente = factura.montoPendiente - cobro.monto;
    if (saldoPendiente > 0) {
      yPos += 7;
      doc.setFontSize(10);
      doc.text(`Saldo Pendiente: ${formatearMoneda(saldoPendiente)}`, 150, yPos, { align: 'right' });
    }
    
    // Notas si existen
    if (cobro.notas) {
      yPos += 15;
      doc.setFontSize(10);
      doc.text('NOTAS:', 20, yPos);
      doc.setFontSize(9);
      const notasLines = doc.splitTextToSize(cobro.notas, 170);
      doc.text(notasLines, 20, yPos + 7);
    }
    
    // Pie de página
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(
        'Este es un comprobante de pago generado automáticamente.',
        105,
        285,
        { align: 'center' }
      );
      doc.text(`Página ${i} de ${pageCount}`, 105, 290, { align: 'center' });
    }
    
    // Generar blob
    const pdfBlob = doc.output('blob');
    resolve(pdfBlob);
  });
}

/**
 * Envía el recibo PDF por email al cliente
 */
export async function enviarReciboPorEmail(
  factura: Factura,
  cobro: Cobro
): Promise<{ enviado: boolean; error?: string }> {
  try {
    // Generar PDF del recibo
    const pdfBlob = await generarReciboPDF(factura, cobro);
    
    // Preparar mensaje de email
    const formatearMoneda = (valor: number) => {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
      }).format(valor);
    };

    const metodoPagoLabels: Record<string, string> = {
      efectivo: 'Efectivo',
      tarjeta: 'Tarjeta',
      transferencia: 'Transferencia',
      cheque: 'Cheque',
      online: 'Online'
    };

    const mensajeEmail = `
Hola ${factura.cliente.nombre},

Te confirmamos el recibo de pago por la factura ${factura.numeroFactura}.

Detalles del pago:
- Recibo No: ${cobro.id}
- Fecha de pago: ${cobro.fechaCobro.toLocaleDateString('es-ES')}
- Monto pagado: ${formatearMoneda(cobro.monto)}
- Método de pago: ${metodoPagoLabels[cobro.metodoPago] || cobro.metodoPago}
${cobro.referencia ? `- Referencia: ${cobro.referencia}` : ''}
${factura.montoPendiente - cobro.monto > 0 ? `- Saldo pendiente: ${formatearMoneda(factura.montoPendiente - cobro.monto)}` : ''}

El recibo en formato PDF se encuentra adjunto a este correo.

Si tienes alguna pregunta, no dudes en contactarnos.

Saludos,
Equipo de Facturación
    `.trim();

    // Simular envío de email (en producción, esto llamaría a un servicio de email real)
    console.log('[RecibosEmail] Enviando recibo por email:', {
      destinatario: factura.cliente.email,
      facturaId: factura.id,
      cobroId: cobro.id,
      asunto: `Recibo de Pago - ${factura.numeroFactura}`,
      mensaje: mensajeEmail.substring(0, 100) + '...',
      pdfSize: pdfBlob.size
    });

    // En producción, aquí se enviaría el email real con el PDF adjunto
    // await emailService.sendEmail({
    //   to: factura.cliente.email,
    //   subject: `Recibo de Pago - ${factura.numeroFactura}`,
    //   body: mensajeEmail,
    //   attachments: [{
    //     filename: `recibo-${cobro.id}.pdf`,
    //     content: pdfBlob
    //   }]
    // });

    return { enviado: true };
  } catch (error) {
    console.error('[RecibosEmail] Error al enviar recibo por email:', error);
    return {
      enviado: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}

