import { SuscripcionFacturacion, FrecuenciaFacturacion, EstadoSuscripcion, Factura, ItemFactura } from '../types';
import { facturasAPI } from './facturas';
import { linksPagoAPI } from './linksPago';
import { notificacionesAPI } from './notificaciones';

// Mock data para desarrollo
const mockSuscripciones: SuscripcionFacturacion[] = [];

// Calcular la próxima fecha de facturación según la frecuencia
function calcularProximaFacturacion(
  fechaActual: Date,
  frecuencia: FrecuenciaFacturacion,
  diaFacturacion: number
): Date {
  const proxima = new Date(fechaActual);
  
  switch (frecuencia) {
    case 'semanal':
      // Sumar días hasta llegar al día de la semana (1 = lunes, 7 = domingo)
      const diaActual = proxima.getDay() === 0 ? 7 : proxima.getDay();
      const diasHastaDia = diaFacturacion - diaActual;
      if (diasHastaDia <= 0) {
        proxima.setDate(proxima.getDate() + 7 + diasHastaDia);
      } else {
        proxima.setDate(proxima.getDate() + diasHastaDia);
      }
      break;
    case 'quincenal':
      proxima.setDate(proxima.getDate() + 15);
      break;
    case 'mensual':
      proxima.setMonth(proxima.getMonth() + 1);
      proxima.setDate(diaFacturacion);
      break;
    case 'trimestral':
      proxima.setMonth(proxima.getMonth() + 3);
      proxima.setDate(diaFacturacion);
      break;
    case 'anual':
      proxima.setFullYear(proxima.getFullYear() + 1);
      proxima.setMonth(0); // Enero
      proxima.setDate(diaFacturacion);
      break;
  }
  
  return proxima;
}

// Generar factura desde una suscripción
async function generarFacturaDesdeSuscripcion(
  suscripcion: SuscripcionFacturacion
): Promise<Factura> {
  const fechaEmision = new Date();
  const fechaVencimiento = new Date();
  fechaVencimiento.setDate(fechaVencimiento.getDate() + 30); // 30 días para pagar
  
  const subtotal = suscripcion.monto;
  const impuestos = subtotal * 0.19; // IVA 19%
  const total = subtotal + impuestos;
  
  const nuevaFactura: Omit<Factura, 'id' | 'numeroFactura' | 'fechaCreacion' | 'fechaActualizacion'> = {
    fechaEmision,
    fechaVencimiento,
    cliente: {
      id: suscripcion.clienteId,
      nombre: suscripcion.clienteNombre,
      email: suscripcion.clienteEmail,
      telefono: suscripcion.clienteTelefono,
    },
    items: suscripcion.items,
    subtotal,
    descuentos: 0,
    impuestos,
    total,
    tipo: 'recurrente',
    estado: 'pendiente',
    pagos: [],
    montoPendiente: total,
    recordatoriosEnviados: 0,
    notas: `Factura generada automáticamente desde suscripción: ${suscripcion.descripcion}`,
    usuarioCreacion: suscripcion.usuarioCreacion,
    suscripcionId: suscripcion.id,
  };
  
  const factura = await facturasAPI.crearFactura(nuevaFactura);
  return factura;
}

export const suscripcionesRecurrentesAPI = {
  // Obtener todas las suscripciones
  async obtenerSuscripciones(filtroEstado?: EstadoSuscripcion): Promise<SuscripcionFacturacion[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let suscripciones = [...mockSuscripciones];
    
    if (filtroEstado) {
      suscripciones = suscripciones.filter(s => s.estado === filtroEstado);
    }
    
    return suscripciones.sort((a, b) => b.fechaCreacion.getTime() - a.fechaCreacion.getTime());
  },

  // Obtener una suscripción por ID
  async obtenerSuscripcion(id: string): Promise<SuscripcionFacturacion | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockSuscripciones.find(s => s.id === id) || null;
  },

  // Crear nueva suscripción
  async crearSuscripcion(
    datos: Omit<SuscripcionFacturacion, 'id' | 'fechaCreacion' | 'fechaActualizacion' | 'facturasGeneradas'>
  ): Promise<SuscripcionFacturacion> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const fechaInicio = datos.fechaInicio || new Date();
    const fechaProximaFacturacion = calcularProximaFacturacion(
      fechaInicio,
      datos.frecuencia,
      datos.diaFacturacion
    );
    
    const nuevaSuscripcion: SuscripcionFacturacion = {
      ...datos,
      id: `sub-${Date.now()}`,
      fechaInicio,
      fechaProximaFacturacion,
      estado: datos.estado || 'activa',
      facturasGeneradas: [],
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    };
    
    mockSuscripciones.push(nuevaSuscripcion);
    
    // Si la fecha de inicio es hoy, generar la primera factura
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const inicio = new Date(fechaInicio);
    inicio.setHours(0, 0, 0, 0);
    
    if (inicio.getTime() === hoy.getTime()) {
      await this.procesarFacturacionRecurrente(nuevaSuscripcion.id);
    }
    
    return nuevaSuscripcion;
  },

  // Actualizar suscripción
  async actualizarSuscripcion(
    id: string,
    datos: Partial<SuscripcionFacturacion>
  ): Promise<SuscripcionFacturacion> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockSuscripciones.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Suscripción no encontrada');
    }
    
    // Si se cambia la frecuencia o el día, recalcular próxima facturación
    if (datos.frecuencia || datos.diaFacturacion) {
      const suscripcion = mockSuscripciones[index];
      datos.fechaProximaFacturacion = calcularProximaFacturacion(
        new Date(),
        datos.frecuencia || suscripcion.frecuencia,
        datos.diaFacturacion || suscripcion.diaFacturacion
      );
    }
    
    mockSuscripciones[index] = {
      ...mockSuscripciones[index],
      ...datos,
      fechaActualizacion: new Date(),
    };
    
    return mockSuscripciones[index];
  },

  // Pausar suscripción
  async pausarSuscripcion(id: string): Promise<SuscripcionFacturacion> {
    return this.actualizarSuscripcion(id, { estado: 'pausada' });
  },

  // Reactivar suscripción
  async reactivarSuscripcion(id: string): Promise<SuscripcionFacturacion> {
    return this.actualizarSuscripcion(id, { estado: 'activa' });
  },

  // Cancelar suscripción
  async cancelarSuscripcion(id: string): Promise<SuscripcionFacturacion> {
    return this.actualizarSuscripcion(id, { estado: 'cancelada' });
  },

  // Eliminar suscripción
  async eliminarSuscripcion(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockSuscripciones.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Suscripción no encontrada');
    }
    
    mockSuscripciones.splice(index, 1);
  },

  // Procesar facturación recurrente (generar factura si es la fecha)
  async procesarFacturacionRecurrente(suscripcionId: string): Promise<Factura | null> {
    const suscripcion = await this.obtenerSuscripcion(suscripcionId);
    if (!suscripcion || suscripcion.estado !== 'activa') {
      return null;
    }
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaProxima = new Date(suscripcion.fechaProximaFacturacion);
    fechaProxima.setHours(0, 0, 0, 0);
    
    // Si no es la fecha de facturación, no hacer nada
    if (fechaProxima.getTime() > hoy.getTime()) {
      return null;
    }
    
    // Generar factura
    const factura = await generarFacturaDesdeSuscripcion(suscripcion);
    
    // Si la suscripción está configurada para enviar automáticamente
    if (suscripcion.enviarAutomaticamente && suscripcion.mediosEnvio.length > 0) {
      try {
        // Generar link de pago si está configurado
        let linkPago = null;
        try {
          linkPago = await linksPagoAPI.crearLinkPago(factura.id, {
            creadoPor: 'sistema',
          });
        } catch (error) {
          console.error('Error al crear link de pago:', error);
        }
        
        // Enviar notificación
        await notificacionesAPI.enviarFacturaRecurrente(factura, suscripcion, linkPago || undefined);
      } catch (error) {
        console.error('Error al enviar notificación de factura recurrente:', error);
        // No fallar la generación de la factura si falla el envío de notificación
      }
    }
    
    // Actualizar suscripción
    const nuevaFechaProxima = calcularProximaFacturacion(
      hoy,
      suscripcion.frecuencia,
      suscripcion.diaFacturacion
    );
    
    await this.actualizarSuscripcion(suscripcionId, {
      fechaProximaFacturacion: nuevaFechaProxima,
      facturasGeneradas: [...suscripcion.facturasGeneradas, factura.id],
    });
    
    return factura;
  },

  // Procesar todas las suscripciones activas que deben facturarse hoy
  async procesarFacturacionesPendientes(): Promise<Factura[]> {
    const suscripcionesActivas = await this.obtenerSuscripciones('activa');
    const facturasGeneradas: Factura[] = [];
    
    for (const suscripcion of suscripcionesActivas) {
      const factura = await this.procesarFacturacionRecurrente(suscripcion.id);
      if (factura) {
        facturasGeneradas.push(factura);
      }
    }
    
    return facturasGeneradas;
  },

  // Obtener suscripciones de un cliente
  async obtenerSuscripcionesCliente(clienteId: string): Promise<SuscripcionFacturacion[]> {
    const suscripciones = await this.obtenerSuscripciones();
    return suscripciones.filter(s => s.clienteId === clienteId);
  },
};

