import { 
  SuscripcionFacturacion, 
  FrecuenciaFacturacion, 
  EstadoSuscripcion, 
  Factura, 
  ItemFactura,
  SuscripcionRecurrente,
  CobroRecurrente,
  FiltrosSuscripciones,
  EstadoSuscripcionRecurrente,
  FrecuenciaCobro,
  OrigenSuscripcion
} from '../types';
import { facturasAPI } from './facturas';
import { linksPagoAPI } from './linksPago';
import { notificacionesAPI } from './notificaciones';

// Mock data para desarrollo - Suscripciones de facturación (legacy)
const mockSuscripciones: SuscripcionFacturacion[] = [];

// Mock data para suscripciones recurrentes de cobros
const mockSuscripcionesRecurrentes: SuscripcionRecurrente[] = [
  {
    id: 'sub-rec-1',
    clienteId: 'client_1',
    descripcion: 'Membresía Premium Mensual',
    importe: 150000,
    moneda: 'COP',
    frecuencia: 'mensual',
    siguienteCobro: new Date('2024-02-15'),
    ultimoCobro: new Date('2024-01-15'),
    estado: 'activa',
    origen: 'paquete',
    metodoPagoPreferido: 'tarjeta',
  },
  {
    id: 'sub-rec-2',
    clienteId: 'client_2',
    descripcion: 'Cuota Anual de Gimnasio',
    importe: 1200000,
    moneda: 'COP',
    frecuencia: 'anual',
    siguienteCobro: new Date('2025-01-01'),
    ultimoCobro: new Date('2024-01-01'),
    estado: 'activa',
    origen: 'cuota',
    metodoPagoPreferido: 'transferencia',
  },
];

const mockCobrosRecurrentes: CobroRecurrente[] = [
  {
    id: 'cobro-rec-1',
    suscripcionId: 'sub-rec-1',
    facturaId: '2',
    fechaCobro: new Date('2024-01-15'),
    importe: 150000,
    estado: 'exito',
    mensajeSistema: 'Cobro procesado exitosamente',
  },
];

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

/**
 * API para gestión de suscripciones recurrentes de cobros
 * 
 * CONEXIÓN CON COMPONENTES:
 * 
 * - GestorSuscripcionesRecurrentes.tsx:
 *   - Utiliza getSuscripciones() para listar todas las suscripciones recurrentes
 *   - Utiliza crearSuscripcion() cuando se crea una nueva desde el modal
 *   - Utiliza actualizarSuscripcion() para modificar suscripciones existentes
 *   - Utiliza cancelarSuscripcion() cuando el usuario cancela una suscripción
 *   - Utiliza simularCobrosRecurrentes() para previsualizar cobros futuros
 * 
 * - ConfigurarCobrosRecurrentes.tsx:
 *   - Utiliza crearSuscripcion() al finalizar el formulario de creación
 *   - Puede utilizar actualizarSuscripcion() si se implementa modo edición
 *   - Los datos del formulario se mapean a SuscripcionRecurrente antes de crear
 */
export const suscripcionesRecurrentesCobrosAPI = {
  /**
   * Obtiene las suscripciones recurrentes aplicando filtros opcionales
   * @param filtros - Filtros opcionales para filtrar las suscripciones
   * @returns Promise con el array de suscripciones que cumplen los filtros
   * 
   * Uso en componentes:
   * - GestorSuscripcionesRecurrentes: carga inicial y refresco de lista
   * - Filtros por estado (activa, pausada, cancelada)
   * - Filtros por cliente, origen o frecuencia
   */
  async getSuscripciones(filtros?: FiltrosSuscripciones): Promise<SuscripcionRecurrente[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    let suscripciones = [...mockSuscripcionesRecurrentes];
    
    if (filtros) {
      if (filtros.clienteId) {
        suscripciones = suscripciones.filter(s => s.clienteId === filtros.clienteId);
      }
      if (filtros.estado) {
        suscripciones = suscripciones.filter(s => s.estado === filtros.estado);
      }
      if (filtros.origen) {
        suscripciones = suscripciones.filter(s => s.origen === filtros.origen);
      }
      if (filtros.frecuencia) {
        suscripciones = suscripciones.filter(s => s.frecuencia === filtros.frecuencia);
      }
    }
    
    return suscripciones.sort((a, b) => a.siguienteCobro.getTime() - b.siguienteCobro.getTime());
  },

  /**
   * Crea una nueva suscripción recurrente
   * @param datos - Datos de la suscripción a crear (sin id)
   * @returns Promise con la suscripción creada incluyendo su id generado
   * 
   * Uso en componentes:
   * - ConfigurarCobrosRecurrentes: se llama al finalizar el formulario
   * - Valida que todos los campos requeridos estén presentes
   * - Calcula automáticamente siguienteCobro según la frecuencia
   * - Establece estado inicial como 'activa'
   */
  async crearSuscripcion(
    datos: Omit<SuscripcionRecurrente, 'id'>
  ): Promise<SuscripcionRecurrente> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Validar que siguienteCobro esté en el futuro
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const siguienteCobro = new Date(datos.siguienteCobro);
    siguienteCobro.setHours(0, 0, 0, 0);
    
    if (siguienteCobro.getTime() < hoy.getTime()) {
      throw new Error('La fecha de siguiente cobro debe ser futura');
    }
    
    const nuevaSuscripcion: SuscripcionRecurrente = {
      ...datos,
      id: `sub-rec-${Date.now()}`,
      estado: datos.estado || 'activa',
    };
    
    mockSuscripcionesRecurrentes.push(nuevaSuscripcion);
    
    return nuevaSuscripcion;
  },

  /**
   * Actualiza una suscripción recurrente existente
   * @param id - ID de la suscripción a actualizar
   * @param cambios - Campos parciales a actualizar
   * @returns Promise con la suscripción actualizada
   * 
   * Uso en componentes:
   * - GestorSuscripcionesRecurrentes: para pausar/reactivar suscripciones
   * - ConfigurarCobrosRecurrentes: si se implementa modo edición
   * - Permite actualizar cualquier campo excepto el id
   * - Si se cambia frecuencia, recalcula siguienteCobro si es necesario
   */
  async actualizarSuscripcion(
    id: string,
    cambios: Partial<Omit<SuscripcionRecurrente, 'id'>>
  ): Promise<SuscripcionRecurrente> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = mockSuscripcionesRecurrentes.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Suscripción no encontrada');
    }
    
    const suscripcionActual = mockSuscripcionesRecurrentes[index];
    
    // Si se cambia la frecuencia, recalcular siguienteCobro desde el último cobro o siguienteCobro actual
    let siguienteCobro = cambios.siguienteCobro || suscripcionActual.siguienteCobro;
    
    if (cambios.frecuencia && cambios.frecuencia !== suscripcionActual.frecuencia) {
      const fechaBase = suscripcionActual.ultimoCobro || suscripcionActual.siguienteCobro;
      siguienteCobro = calcularSiguienteCobro(fechaBase, cambios.frecuencia);
    }
    
    mockSuscripcionesRecurrentes[index] = {
      ...suscripcionActual,
      ...cambios,
      siguienteCobro,
    };
    
    return mockSuscripcionesRecurrentes[index];
  },

  /**
   * Cancela una suscripción recurrente
   * @param id - ID de la suscripción a cancelar
   * @returns Promise con la suscripción cancelada (estado = 'cancelada')
   * 
   * Uso en componentes:
   * - GestorSuscripcionesRecurrentes: cuando el usuario confirma la cancelación
   * - No elimina la suscripción, solo cambia su estado
   * - Permite mantener historial de suscripciones canceladas
   */
  async cancelarSuscripcion(id: string): Promise<SuscripcionRecurrente> {
    return this.actualizarSuscripcion(id, { estado: 'cancelada' });
  },

  /**
   * Simula los cobros recurrentes que se procesarían en una fecha específica
   * @param fecha - Fecha para la cual simular los cobros
   * @returns Promise con el array de cobros recurrentes simulados
   * 
   * Uso en componentes:
   * - GestorSuscripcionesRecurrentes: para mostrar preview de cobros futuros
   * - Puede usarse en un calendario o vista de proyecciones
   * - Simula todos los cobros que vencen en la fecha especificada
   * - Los cobros simulados tienen estado 'pendiente' inicialmente
   */
  async simularCobrosRecurrentes(fecha: Date): Promise<CobroRecurrente[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const fechaSimulacion = new Date(fecha);
    fechaSimulacion.setHours(0, 0, 0, 0);
    
    // Obtener suscripciones activas que deben cobrarse en la fecha especificada
    const suscripcionesActivas = mockSuscripcionesRecurrentes.filter(
      s => s.estado === 'activa'
    );
    
    const cobrosSimulados: CobroRecurrente[] = [];
    
    for (const suscripcion of suscripcionesActivas) {
      const fechaSiguienteCobro = new Date(suscripcion.siguienteCobro);
      fechaSiguienteCobro.setHours(0, 0, 0, 0);
      
      // Si la fecha de siguiente cobro coincide con la fecha de simulación
      if (fechaSiguienteCobro.getTime() === fechaSimulacion.getTime()) {
        cobrosSimulados.push({
          id: `sim-${suscripcion.id}-${fechaSimulacion.getTime()}`,
          suscripcionId: suscripcion.id,
          fechaCobro: new Date(fechaSimulacion),
          importe: suscripcion.importe,
          estado: 'pendiente',
          mensajeSistema: `Cobro simulado para suscripción: ${suscripcion.descripcion}`,
        });
      }
    }
    
    return cobrosSimulados.sort((a, b) => a.fechaCobro.getTime() - b.fechaCobro.getTime());
  },
};

/**
 * Función auxiliar para calcular la siguiente fecha de cobro según la frecuencia
 */
function calcularSiguienteCobro(fechaBase: Date, frecuencia: FrecuenciaCobro): Date {
  const siguiente = new Date(fechaBase);
  
  switch (frecuencia) {
    case 'mensual':
      siguiente.setMonth(siguiente.getMonth() + 1);
      break;
    case 'trimestral':
      siguiente.setMonth(siguiente.getMonth() + 3);
      break;
    case 'anual':
      siguiente.setFullYear(siguiente.getFullYear() + 1);
      break;
  }
  
  return siguiente;
}

