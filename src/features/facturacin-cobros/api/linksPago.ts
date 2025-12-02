import { LinkPago, EstadoLinkPago, PagoOnline, Factura } from '../types';
import { facturasAPI } from './facturas';
import { cobrosAPI } from './cobros';

// Mock data para desarrollo
const mockLinksPago: LinkPago[] = [];
const mockPagosOnline: PagoOnline[] = [];

// Generar token único para el link de pago
function generarToken(): string {
  return `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Generar URL del link de pago
function generarUrlPago(token: string): string {
  // En producción, esto sería la URL real de la aplicación
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'https://app.example.com';
  return `${baseUrl}/pagar/${token}`;
}

export const linksPagoAPI = {
  // Crear link de pago para una factura
  async crearLinkPago(
    facturaId: string,
    datos?: {
      diasExpiracion?: number;
      metodoPagoPermitido?: ('tarjeta' | 'transferencia')[];
      notas?: string;
      creadoPor?: string;
    }
  ): Promise<LinkPago> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const factura = await facturasAPI.obtenerFactura(facturaId);
    if (!factura) {
      throw new Error('Factura no encontrada');
    }
    
    // Verificar si ya existe un link activo
    const linkExistente = mockLinksPago.find(
      l => l.facturaId === facturaId && l.estado === 'activo'
    );
    
    if (linkExistente) {
      // Si el link no ha expirado, retornar el existente
      if (linkExistente.fechaExpiracion > new Date()) {
        return linkExistente;
      } else {
        // Marcar como expirado
        linkExistente.estado = 'expirado';
      }
    }
    
    const diasExpiracion = datos?.diasExpiracion || 30;
    const fechaCreacion = new Date();
    const fechaExpiracion = new Date();
    fechaExpiracion.setDate(fechaExpiracion.getDate() + diasExpiracion);
    
    const token = generarToken();
    const url = generarUrlPago(token);
    
    const nuevoLink: LinkPago = {
      id: `link-${Date.now()}`,
      facturaId,
      token,
      url,
      monto: factura.montoPendiente || factura.total,
      estado: 'activo',
      fechaCreacion,
      fechaExpiracion,
      metodoPagoPermitido: datos?.metodoPagoPermitido || ['tarjeta', 'transferencia'],
      notas: datos?.notas,
      creadoPor: datos?.creadoPor || 'sistema',
    };
    
    mockLinksPago.push(nuevoLink);
    
    // Actualizar factura con el link de pago
    await facturasAPI.actualizarFactura(facturaId, {
      linkPagoId: nuevoLink.id,
    });
    
    return nuevoLink;
  },

  // Obtener link de pago por ID
  async obtenerLinkPago(id: string): Promise<LinkPago | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockLinksPago.find(l => l.id === id) || null;
  },

  // Obtener link de pago por token
  async obtenerLinkPagoPorToken(token: string): Promise<LinkPago | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const link = mockLinksPago.find(l => l.token === token);
    
    if (!link) {
      return null;
    }
    
    // Verificar si está expirado
    if (link.fechaExpiracion < new Date() && link.estado === 'activo') {
      link.estado = 'expirado';
    }
    
    return link;
  },

  // Obtener link de pago de una factura
  async obtenerLinkPagoFactura(facturaId: string): Promise<LinkPago | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const link = mockLinksPago.find(l => l.facturaId === facturaId);
    
    if (link && link.fechaExpiracion < new Date() && link.estado === 'activo') {
      link.estado = 'expirado';
    }
    
    return link || null;
  },

  // Obtener todos los links de pago
  async obtenerLinksPago(filtros?: {
    facturaId?: string;
    estado?: EstadoLinkPago;
  }): Promise<LinkPago[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let links = [...mockLinksPago];
    
    if (filtros?.facturaId) {
      links = links.filter(l => l.facturaId === filtros.facturaId);
    }
    
    if (filtros?.estado) {
      links = links.filter(l => l.estado === filtros.estado);
    }
    
    // Verificar expiraciones
    links.forEach(link => {
      if (link.fechaExpiracion < new Date() && link.estado === 'activo') {
        link.estado = 'expirado';
      }
    });
    
    return links.sort((a, b) => b.fechaCreacion.getTime() - a.fechaCreacion.getTime());
  },

  // Cancelar link de pago
  async cancelarLinkPago(id: string): Promise<LinkPago> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const link = mockLinksPago.find(l => l.id === id);
    if (!link) {
      throw new Error('Link de pago no encontrado');
    }
    
    if (link.estado === 'usado') {
      throw new Error('No se puede cancelar un link de pago que ya fue usado');
    }
    
    link.estado = 'cancelado';
    return link;
  },

  // Renovar link de pago (crear nuevo si el anterior expiró)
  async renovarLinkPago(facturaId: string, diasExpiracion?: number): Promise<LinkPago> {
    // Cancelar link anterior si existe
    const linkAnterior = await this.obtenerLinkPagoFactura(facturaId);
    if (linkAnterior && linkAnterior.estado === 'activo') {
      await this.cancelarLinkPago(linkAnterior.id);
    }
    
    // Crear nuevo link
    return this.crearLinkPago(facturaId, { diasExpiracion });
  },

  // Procesar pago online
  async procesarPagoOnline(
    linkPagoId: string,
    datos: {
      metodoPago: 'tarjeta' | 'transferencia';
      datosPago?: {
        ultimos4Digitos?: string;
        nombreTitular?: string;
        banco?: string;
        numeroCuenta?: string;
      };
      referencia?: string;
    }
  ): Promise<PagoOnline> {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simular procesamiento
    
    const link = await this.obtenerLinkPago(linkPagoId);
    if (!link) {
      throw new Error('Link de pago no encontrado');
    }
    
    if (link.estado !== 'activo') {
      throw new Error(`El link de pago no está activo (estado: ${link.estado})`);
    }
    
    if (link.fechaExpiracion < new Date()) {
      link.estado = 'expirado';
      throw new Error('El link de pago ha expirado');
    }
    
    if (!link.metodoPagoPermitido.includes(datos.metodoPago)) {
      throw new Error(`Método de pago no permitido. Métodos permitidos: ${link.metodoPagoPermitido.join(', ')}`);
    }
    
    const factura = await facturasAPI.obtenerFactura(link.facturaId);
    if (!factura) {
      throw new Error('Factura no encontrada');
    }
    
    // Crear pago online
    const pagoOnline: PagoOnline = {
      id: `pago-online-${Date.now()}`,
      linkPagoId,
      facturaId: link.facturaId,
      monto: link.monto,
      metodoPago: datos.metodoPago,
      estado: 'procesando',
      referencia: datos.referencia || `REF-${Date.now()}`,
      datosPago: datos.datosPago,
      fechaCreacion: new Date(),
      fechaProcesamiento: new Date(),
    };
    
    mockPagosOnline.push(pagoOnline);
    
    // Simular procesamiento (en producción esto se haría con un gateway de pagos)
    // Por ahora, asumimos que el pago se completa exitosamente
    setTimeout(async () => {
      pagoOnline.estado = 'completado';
      pagoOnline.fechaCompletado = new Date();
      
      // Registrar el pago en la factura
      await cobrosAPI.registrarCobro({
        facturaId: link.facturaId,
        fechaCobro: new Date(),
        monto: link.monto,
        metodoPago: datos.metodoPago === 'tarjeta' ? 'tarjeta' : 'transferencia',
        referencia: pagoOnline.referencia,
        estado: 'confirmado',
        usuario: 'sistema',
        notas: `Pago online procesado - ${datos.metodoPago}`,
      });
      
      // Actualizar estado del link
      link.estado = 'usado';
      link.fechaUso = new Date();
      link.referenciaPago = pagoOnline.referencia;
      
      // Actualizar factura
      const facturaActualizada = await facturasAPI.obtenerFactura(link.facturaId);
      if (facturaActualizada) {
        const montoPendiente = facturaActualizada.total - facturaActualizada.pagos.reduce((sum, p) => sum + p.monto, 0);
        if (montoPendiente <= 0) {
          await facturasAPI.actualizarFactura(link.facturaId, {
            estado: 'pagada',
            montoPendiente: 0,
          });
        } else {
          await facturasAPI.actualizarFactura(link.facturaId, {
            estado: montoPendiente < facturaActualizada.total ? 'parcial' : 'pendiente',
            montoPendiente,
          });
        }
      }
    }, 2000);
    
    return pagoOnline;
  },

  // Obtener pago online por ID
  async obtenerPagoOnline(id: string): Promise<PagoOnline | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockPagosOnline.find(p => p.id === id) || null;
  },

  // Obtener pagos online de una factura
  async obtenerPagosOnlineFactura(facturaId: string): Promise<PagoOnline[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockPagosOnline.filter(p => p.facturaId === facturaId);
  },
};


