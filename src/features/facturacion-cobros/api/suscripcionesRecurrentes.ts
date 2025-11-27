/**
 * API Mock de Suscripciones Recurrentes - Sistema de Facturación y Cobros
 * 
 * Este archivo implementa la lógica mock de gestión de suscripciones recurrentes.
 * Incluye:
 * - Crear nuevas suscripciones
 * - Actualizar suscripciones existentes
 * - Pausar/Reanudar suscripciones
 * - Cancelar suscripciones
 * - Obtener lista de suscripciones con filtros
 * - Calcular próxima fecha de cobro
 * 
 * NOTA: En producción, las llamadas a backend reales irían en endpoints como:
 * - GET /api/suscripciones - Obtener suscripciones con filtros
 * - GET /api/suscripciones/:id - Obtener suscripción por ID
 * - POST /api/suscripciones - Crear nueva suscripción
 * - PUT /api/suscripciones/:id - Actualizar suscripción
 * - POST /api/suscripciones/:id/pausar - Pausar suscripción
 * - POST /api/suscripciones/:id/reanudar - Reanudar suscripción
 * - DELETE /api/suscripciones/:id - Cancelar suscripción
 * 
 * INTEGRACIÓN FUTURA CON PASARELAS DE PAGO:
 * 
 * Este módulo está diseñado para conectarse en el futuro con pasarelas de pago reales
 * como Stripe, PayPal, Wompi, PayU, etc. La integración incluiría:
 * 
 * 1. Creación de suscripciones en la pasarela:
 *    - Al crear una suscripción, se registraría también en la pasarela de pago
 *    - Se almacenaría el ID de suscripción de la pasarela para referencia
 * 
 * 2. Webhooks de la pasarela:
 *    - Recibir notificaciones de cobros exitosos/fallidos
 *    - Actualizar estado de suscripciones automáticamente
 *    - Generar facturas automáticamente cuando se procesa un pago
 * 
 * 3. Procesamiento automático de cobros:
 *    - La pasarela se encargaría de intentar cobrar según la frecuencia configurada
 *    - En caso de fallo, se notificaría al sistema para tomar acciones (pausar, notificar, etc.)
 * 
 * INTEGRACIÓN CON COMPONENTES:
 * 
 * 1. GestorSuscripcionesRecurrentes.tsx:
 *    - Utiliza `obtenerSuscripciones()` para mostrar el listado
 *    - Utiliza `pausarSuscripcion()` y `cancelarSuscripcion()` para gestionar estados
 *    - Muestra próxima fecha de cobro y estado de cada suscripción
 * 
 * 2. ConfigurarCobrosRecurrentes.tsx:
 *    - Utiliza `crearSuscripcion()` para crear nuevas suscripciones
 *    - Utiliza `actualizarSuscripcion()` para editar existentes
 *    - Permite configurar cliente, importe, frecuencia, método de pago
 */

import { 
  SuscripcionRecurrente, 
  FiltroSuscripciones, 
  FrecuenciaFacturacion,
  EstadoSuscripcion 
} from '../types';

// ============================================================================
// DATOS MOCK
// ============================================================================

/**
 * Almacenamiento mock de suscripciones en memoria
 * En producción, esto sería una base de datos (PostgreSQL, MongoDB, etc.)
 * con una tabla/colección de suscripciones relacionada con clientes y facturas
 */
const mockSuscripciones: SuscripcionRecurrente[] = [
  {
    id: 'sub_001',
    clienteId: 'cliente_001',
    nombreCliente: 'Juan Pérez',
    descripcion: 'Membresía Mensual - Plan Premium',
    importe: 80000,
    moneda: 'COP',
    frecuencia: 'mensual',
    diaFacturacion: 1,
    metodoPagoPreferido: 'tarjeta',
    estado: 'activa',
    fechaInicio: new Date('2024-01-01'),
    fechaProximoCobro: new Date('2024-12-01'),
    numeroCobrosRealizados: 11,
    numeroCobrosFallidos: 0,
    notas: 'Cliente preferido - pago automático configurado',
    creadaEn: new Date('2024-01-01'),
    actualizadaEn: new Date('2024-11-01')
  },
  {
    id: 'sub_002',
    clienteId: 'cliente_002',
    nombreCliente: 'María García',
    descripcion: 'Entrenamiento Personal Semanal',
    importe: 250000,
    moneda: 'COP',
    frecuencia: 'semanal',
    diaFacturacion: 1, // Lunes
    metodoPagoPreferido: 'transferencia',
    estado: 'activa',
    fechaInicio: new Date('2024-10-01'),
    fechaProximoCobro: new Date('2024-12-02'),
    numeroCobrosRealizados: 8,
    numeroCobrosFallidos: 1,
    notas: 'Último pago fallido el 15/11 - verificar cuenta',
    creadaEn: new Date('2024-10-01'),
    actualizadaEn: new Date('2024-11-15')
  },
  {
    id: 'sub_003',
    clienteId: 'cliente_003',
    nombreCliente: 'Carlos López',
    descripcion: 'Plan Nutricional Trimestral',
    importe: 450000,
    moneda: 'COP',
    frecuencia: 'trimestral',
    diaFacturacion: 15,
    metodoPagoPreferido: 'paypal',
    estado: 'pausada',
    fechaInicio: new Date('2024-06-15'),
    fechaProximoCobro: new Date('2025-03-15'),
    fechaFin: undefined,
    numeroCobrosRealizados: 2,
    numeroCobrosFallidos: 0,
    notas: 'Pausada temporalmente por solicitud del cliente',
    creadaEn: new Date('2024-06-15'),
    actualizadaEn: new Date('2024-11-20')
  },
  {
    id: 'sub_004',
    clienteId: 'cliente_004',
    nombreCliente: 'Ana Martínez',
    descripcion: 'Membresía Anual - Plan Básico',
    importe: 900000,
    moneda: 'COP',
    frecuencia: 'anual',
    diaFacturacion: 1,
    metodoPagoPreferido: 'tarjeta',
    estado: 'activa',
    fechaInicio: new Date('2024-01-01'),
    fechaProximoCobro: new Date('2025-01-01'),
    numeroCobrosRealizados: 1,
    numeroCobrosFallidos: 0,
    notas: '',
    creadaEn: new Date('2024-01-01'),
    actualizadaEn: new Date('2024-01-01')
  }
];

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

/**
 * Calcula la próxima fecha de facturación basándose en la frecuencia y día configurado
 */
function calcularProximaFacturacion(
  fechaActual: Date,
  frecuencia: FrecuenciaFacturacion,
  diaFacturacion: number
): Date {
  const proxima = new Date(fechaActual);
  
  switch (frecuencia) {
    case 'diaria':
      proxima.setDate(proxima.getDate() + 1);
      break;
    
    case 'semanal':
      // diaFacturacion: 1 = Lunes, 7 = Domingo
      const diaSemanaActual = proxima.getDay(); // 0 = Domingo, 6 = Sábado
      const diasHastaProximo = (diaFacturacion - 1 - diaSemanaActual + 7) % 7 || 7;
      proxima.setDate(proxima.getDate() + diasHastaProximo);
      break;
    
    case 'quincenal':
      proxima.setDate(proxima.getDate() + 15);
      break;
    
    case 'mensual':
      proxima.setMonth(proxima.getMonth() + 1);
      proxima.setDate(Math.min(diaFacturacion, new Date(proxima.getFullYear(), proxima.getMonth() + 1, 0).getDate()));
      break;
    
    case 'bimestral':
      proxima.setMonth(proxima.getMonth() + 2);
      proxima.setDate(Math.min(diaFacturacion, new Date(proxima.getFullYear(), proxima.getMonth() + 1, 0).getDate()));
      break;
    
    case 'trimestral':
      proxima.setMonth(proxima.getMonth() + 3);
      proxima.setDate(Math.min(diaFacturacion, new Date(proxima.getFullYear(), proxima.getMonth() + 1, 0).getDate()));
      break;
    
    case 'semestral':
      proxima.setMonth(proxima.getMonth() + 6);
      proxima.setDate(Math.min(diaFacturacion, new Date(proxima.getFullYear(), proxima.getMonth() + 1, 0).getDate()));
      break;
    
    case 'anual':
      proxima.setFullYear(proxima.getFullYear() + 1);
      proxima.setDate(Math.min(diaFacturacion, new Date(proxima.getFullYear(), proxima.getMonth() + 1, 0).getDate()));
      break;
  }
  
  return proxima;
}

// ============================================================================
// API PÚBLICA
// ============================================================================

export const suscripcionesRecurrentesAPI = {
  /**
   * Obtener todas las suscripciones con filtros opcionales
   */
  async obtenerSuscripciones(filtros?: FiltroSuscripciones): Promise<SuscripcionRecurrente[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let suscripciones = [...mockSuscripciones];
    
    if (filtros) {
      if (filtros.clienteId) {
        suscripciones = suscripciones.filter(s => s.clienteId === filtros.clienteId);
      }
      if (filtros.estado) {
        suscripciones = suscripciones.filter(s => s.estado === filtros.estado);
      }
      if (filtros.frecuencia) {
        suscripciones = suscripciones.filter(s => s.frecuencia === filtros.frecuencia);
      }
      if (filtros.metodoPago) {
        suscripciones = suscripciones.filter(s => s.metodoPagoPreferido === filtros.metodoPago);
      }
      if (filtros.fechaProximoCobroInicio) {
        suscripciones = suscripciones.filter(s => 
          s.fechaProximoCobro >= filtros.fechaProximoCobroInicio!
        );
      }
      if (filtros.fechaProximoCobroFin) {
        suscripciones = suscripciones.filter(s => 
          s.fechaProximoCobro <= filtros.fechaProximoCobroFin!
        );
      }
    }
    
    return suscripciones.sort((a, b) => 
      a.fechaProximoCobro.getTime() - b.fechaProximoCobro.getTime()
    );
  },

  /**
   * Obtener una suscripción por ID
   */
  async obtenerSuscripcion(id: string): Promise<SuscripcionRecurrente | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockSuscripciones.find(s => s.id === id) || null;
  },

  /**
   * Crear una nueva suscripción
   */
  async crearSuscripcion(
    datos: Omit<SuscripcionRecurrente, 'id' | 'creadaEn' | 'actualizadaEn' | 'numeroCobrosRealizados' | 'numeroCobrosFallidos' | 'fechaProximoCobro'>
  ): Promise<SuscripcionRecurrente> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const ahora = new Date();
    const fechaProximoCobro = calcularProximaFacturacion(
      ahora,
      datos.frecuencia,
      datos.diaFacturacion
    );
    
    const nuevaSuscripcion: SuscripcionRecurrente = {
      ...datos,
      id: `sub_${Date.now()}`,
      estado: 'activa' as EstadoSuscripcion,
      fechaProximoCobro,
      numeroCobrosRealizados: 0,
      numeroCobrosFallidos: 0,
      creadaEn: ahora,
      actualizadaEn: ahora
    };
    
    mockSuscripciones.push(nuevaSuscripcion);
    
    // TODO: En producción, aquí se registraría la suscripción en la pasarela de pago
    // Ejemplo: await stripe.subscriptions.create({ ... })
    
    return nuevaSuscripcion;
  },

  /**
   * Actualizar una suscripción existente
   */
  async actualizarSuscripcion(
    id: string,
    datos: Partial<Omit<SuscripcionRecurrente, 'id' | 'creadaEn' | 'numeroCobrosRealizados' | 'numeroCobrosFallidos'>>
  ): Promise<SuscripcionRecurrente> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const indice = mockSuscripciones.findIndex(s => s.id === id);
    if (indice === -1) {
      throw new Error(`Suscripción con ID ${id} no encontrada`);
    }
    
    const suscripcionActual = mockSuscripciones[indice];
    
    // Si cambió la frecuencia o día de facturación, recalcular próxima fecha
    let fechaProximoCobro = suscripcionActual.fechaProximoCobro;
    if (datos.frecuencia || datos.diaFacturacion) {
      const frecuencia = datos.frecuencia || suscripcionActual.frecuencia;
      const diaFacturacion = datos.diaFacturacion ?? suscripcionActual.diaFacturacion;
      fechaProximoCobro = calcularProximaFacturacion(
        new Date(),
        frecuencia,
        diaFacturacion
      );
    }
    
    const suscripcionActualizada: SuscripcionRecurrente = {
      ...suscripcionActual,
      ...datos,
      fechaProximoCobro,
      actualizadaEn: new Date()
    };
    
    mockSuscripciones[indice] = suscripcionActualizada;
    
    // TODO: En producción, aquí se actualizaría la suscripción en la pasarela de pago
    // Ejemplo: await stripe.subscriptions.update(id, { ... })
    
    return suscripcionActualizada;
  },

  /**
   * Pausar una suscripción
   */
  async pausarSuscripcion(id: string): Promise<SuscripcionRecurrente> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const indice = mockSuscripciones.findIndex(s => s.id === id);
    if (indice === -1) {
      throw new Error(`Suscripción con ID ${id} no encontrada`);
    }
    
    const suscripcion = mockSuscripciones[indice];
    if (suscripcion.estado !== 'activa') {
      throw new Error(`Solo se pueden pausar suscripciones activas. Estado actual: ${suscripcion.estado}`);
    }
    
    suscripcion.estado = 'pausada';
    suscripcion.actualizadaEn = new Date();
    
    // TODO: En producción, aquí se pausaría la suscripción en la pasarela de pago
    // Ejemplo: await stripe.subscriptions.update(id, { pause_collection: { behavior: 'keep_as_draft' } })
    
    return suscripcion;
  },

  /**
   * Reanudar una suscripción pausada
   */
  async reanudarSuscripcion(id: string): Promise<SuscripcionRecurrente> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const indice = mockSuscripciones.findIndex(s => s.id === id);
    if (indice === -1) {
      throw new Error(`Suscripción con ID ${id} no encontrada`);
    }
    
    const suscripcion = mockSuscripciones[indice];
    if (suscripcion.estado !== 'pausada') {
      throw new Error(`Solo se pueden reanudar suscripciones pausadas. Estado actual: ${suscripcion.estado}`);
    }
    
    // Recalcular próxima fecha de cobro desde hoy
    suscripcion.fechaProximoCobro = calcularProximaFacturacion(
      new Date(),
      suscripcion.frecuencia,
      suscripcion.diaFacturacion
    );
    
    suscripcion.estado = 'activa';
    suscripcion.actualizadaEn = new Date();
    
    // TODO: En producción, aquí se reanudaría la suscripción en la pasarela de pago
    // Ejemplo: await stripe.subscriptions.update(id, { pause_collection: null })
    
    return suscripcion;
  },

  /**
   * Cancelar una suscripción
   */
  async cancelarSuscripcion(id: string): Promise<SuscripcionRecurrente> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const indice = mockSuscripciones.findIndex(s => s.id === id);
    if (indice === -1) {
      throw new Error(`Suscripción con ID ${id} no encontrada`);
    }
    
    const suscripcion = mockSuscripciones[indice];
    if (suscripcion.estado === 'cancelada') {
      throw new Error('La suscripción ya está cancelada');
    }
    
    suscripcion.estado = 'cancelada';
    suscripcion.fechaFin = new Date();
    suscripcion.actualizadaEn = new Date();
    
    // TODO: En producción, aquí se cancelaría la suscripción en la pasarela de pago
    // Ejemplo: await stripe.subscriptions.cancel(id)
    
    return suscripcion;
  }
};

