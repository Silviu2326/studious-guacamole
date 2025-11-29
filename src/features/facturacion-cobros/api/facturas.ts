/**
 * API Mock de Facturas - Sistema de Facturación y Cobros
 * 
 * Este archivo implementa la lógica mock del CRUD de facturas, incluyendo:
 * - Gestión de estados y saldo pendiente
 * - Numeración automática de facturas
 * - Filtros avanzados para consultas
 * 
 * NOTA: En producción, las llamadas a backend reales irían en endpoints como:
 * - GET /api/facturas - Obtener listado con filtros
 * - GET /api/facturas/:id - Obtener factura por ID
 * - POST /api/facturas - Crear nueva factura
 * - PUT /api/facturas/:id - Actualizar factura
 * - PATCH /api/facturas/:id/cancelar - Cancelar factura
 */

import { Factura, FiltroFacturas, EstadoFactura, Cobro, LineaFactura } from '../types';

// ============================================================================
// DATOS MOCK
// ============================================================================

/**
 * Almacenamiento mock de facturas en memoria
 * En producción, esto sería una base de datos (PostgreSQL, MongoDB, etc.)
 */
const mockFacturas: Factura[] = [
  {
    id: '1',
    numero: 'F-2025-0001',
    clienteId: 'cliente_001',
    nombreCliente: 'Juan Pérez',
    fechaEmision: new Date('2025-01-15'),
    fechaVencimiento: new Date('2025-01-30'),
    estado: 'pendiente',
    lineas: [
      {
        id: 'linea_1_1',
        descripcion: 'Entrenamiento Personal - Enero',
        servicioIdOpcional: 'servicio_001',
        cantidad: 8,
        precioUnitario: 25000,
        descuentoOpcional: 0,
        impuestoOpcional: 4750,
        totalLinea: 204750
      }
    ],
    subtotal: 200000,
    impuestos: 38000,
    total: 238000,
    saldoPendiente: 238000,
    moneda: 'EUR',
    notasInternas: 'Cliente nuevo, primer entrenamiento',
    origen: 'manual',
    creadaEn: new Date('2025-01-15T10:00:00'),
    actualizadaEn: new Date('2025-01-15T10:00:00')
  },
  {
    id: '2',
    numero: 'F-2025-0002',
    clienteId: 'cliente_002',
    nombreCliente: 'María García',
    fechaEmision: new Date('2025-01-10'),
    fechaVencimiento: new Date('2025-01-25'),
    estado: 'pagada',
    lineas: [
      {
        id: 'linea_2_1',
        descripcion: 'Plan Nutricional Premium',
        servicioIdOpcional: 'servicio_002',
        cantidad: 1,
        precioUnitario: 150000,
        descuentoOpcional: 0,
        impuestoOpcional: 28500,
        totalLinea: 178500
      },
      {
        id: 'linea_2_2',
        descripcion: 'Consulta Nutricional',
        servicioIdOpcional: 'servicio_003',
        cantidad: 2,
        precioUnitario: 80000,
        descuentoOpcional: 10000,
        impuestoOpcional: 28500,
        totalLinea: 166500
      }
    ],
    subtotal: 310000,
    impuestos: 57000,
    total: 357000,
    saldoPendiente: 0,
    moneda: 'EUR',
    origen: 'manual',
    creadaEn: new Date('2025-01-10T09:00:00'),
    actualizadaEn: new Date('2025-01-12T14:30:00')
  },
  {
    id: '3',
    numero: 'F-2025-0003',
    clienteId: 'cliente_003',
    nombreCliente: 'Carlos López',
    fechaEmision: new Date('2025-01-05'),
    fechaVencimiento: new Date('2025-01-20'),
    estado: 'vencida',
    lineas: [
      {
        id: 'linea_3_1',
        descripcion: 'Membresía Mensual',
        servicioIdOpcional: 'servicio_004',
        cantidad: 1,
        precioUnitario: 80000,
        descuentoOpcional: 0,
        impuestoOpcional: 15200,
        totalLinea: 95200
      }
    ],
    subtotal: 80000,
    impuestos: 15200,
    total: 95200,
    saldoPendiente: 95200,
    moneda: 'EUR',
    origen: 'suscripcion',
    creadaEn: new Date('2025-01-05T08:00:00'),
    actualizadaEn: new Date('2025-01-21T10:00:00')
  },
  {
    id: '4',
    numero: 'F-2025-0004',
    clienteId: 'cliente_001',
    nombreCliente: 'Juan Pérez',
    fechaEmision: new Date('2025-01-20'),
    fechaVencimiento: new Date('2025-02-04'),
    estado: 'parcialmentePagada',
    lineas: [
      {
        id: 'linea_4_1',
        descripcion: 'Paquete de 10 sesiones',
        servicioIdOpcional: 'servicio_005',
        cantidad: 1,
        precioUnitario: 450000,
        descuentoOpcional: 50000,
        impuestoOpcional: 76000,
        totalLinea: 476000
      }
    ],
    subtotal: 450000,
    impuestos: 76000,
    total: 476000,
    saldoPendiente: 238000,
    moneda: 'EUR',
    origen: 'paquete',
    creadaEn: new Date('2025-01-20T11:00:00'),
    actualizadaEn: new Date('2025-01-22T16:00:00')
  }
];

// Contador para numeración automática (simula secuencia de base de datos)
// En producción, esto se manejaría con un generador de secuencias o un campo auto-incremental
let contadorFacturas = 4;

// ============================================================================
// HELPERS INTERNOS
// ============================================================================

/**
 * Obtiene todos los cobros asociados a una factura
 * NOTA: En producción, esto se haría consultando el módulo cobros.ts o la API de cobros
 * Endpoint real: GET /api/cobros?facturaId={facturaId}
 */
async function obtenerCobrosDeFactura(facturaId: string): Promise<Cobro[]> {
  // Integración con cobros.ts - importación dinámica para evitar dependencias circulares
  try {
    const { getCobrosPorFactura } = await import('./cobros');
    return await getCobrosPorFactura(facturaId);
  } catch (error) {
    // Si cobros.ts no está disponible aún, retornar array vacío
    console.warn('No se pudo obtener cobros de factura (módulo cobros.ts no disponible):', error);
    return [];
  }
}

/**
 * Recalcula el saldo pendiente de una factura basándose en los cobros asociados
 * @param factura - La factura a recalcular
 * @param cobros - Array de cobros asociados a la factura
 * @returns Nuevo saldo pendiente calculado
 */
function recalcularSaldoPendiente(factura: Factura, cobros: Cobro[]): number {
  const totalCobrado = cobros.reduce((suma, cobro) => suma + cobro.importe, 0);
  const saldoPendiente = Math.max(0, factura.total - totalCobrado);
  return saldoPendiente;
}

/**
 * Determina el estado de la factura basándose en el saldo pendiente y fecha de vencimiento
 * @param factura - La factura a evaluar
 * @param saldoPendiente - El saldo pendiente calculado
 * @returns El estado actualizado de la factura
 */
function determinarEstadoFactura(factura: Factura, saldoPendiente: number): EstadoFactura {
  // Si está cancelada, mantener el estado cancelada
  if (factura.estado === 'cancelada') {
    return 'cancelada';
  }

  // Si no hay saldo pendiente, está pagada
  if (saldoPendiente <= 0) {
    return 'pagada';
  }

  // Si hay saldo pendiente pero menor que el total, está parcialmente pagada
  if (saldoPendiente < factura.total) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaVencimiento = new Date(factura.fechaVencimiento);
    fechaVencimiento.setHours(0, 0, 0, 0);

    // Si está vencida y no pagada completamente, está vencida
    if (fechaVencimiento < hoy) {
      return 'vencida';
    }
    return 'parcialmentePagada';
  }

  // Si no está pagada y está vencida, está vencida
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fechaVencimiento = new Date(factura.fechaVencimiento);
  fechaVencimiento.setHours(0, 0, 0, 0);

  if (fechaVencimiento < hoy) {
    return 'vencida';
  }

  // Por defecto, está pendiente
  return 'pendiente';
}

/**
 * Actualiza el estado y saldo pendiente de una factura basándose en sus cobros
 * @param factura - La factura a actualizar
 * @returns La factura actualizada con estado y saldo recalculados
 */
async function actualizarEstadoYSaldo(factura: Factura): Promise<Factura> {
  // En producción: GET /api/cobros?facturaId={factura.id}
  const cobros = await obtenerCobrosDeFactura(factura.id);
  
  const saldoPendiente = recalcularSaldoPendiente(factura, cobros);
  const estado = determinarEstadoFactura(factura, saldoPendiente);

  return {
    ...factura,
    saldoPendiente,
    estado,
    actualizadaEn: new Date()
  };
}

/**
 * Genera el próximo número de factura automáticamente
 * Formato: F-{AÑO}-{NÚMERO_SECUENCIAL}
 * 
 * NOTA: En producción, esto se haría con:
 * - Un generador de secuencias en la base de datos
 * - Un servicio que garantice la unicidad del número
 * - Considerando series de facturación por sede/entidad
 * - Endpoint real: POST /api/facturas/siguiente-numero
 */
function generarNumeroFactura(): string {
  const año = new Date().getFullYear();
  contadorFacturas += 1;
  const numeroSecuencial = String(contadorFacturas).padStart(4, '0');
  return `F-${año}-${numeroSecuencial}`;
}

// ============================================================================
// FUNCIONES CRUD
// ============================================================================

/**
 * Obtiene todas las facturas con filtros opcionales
 * 
 * Endpoint real: GET /api/facturas
 * Query params: clienteId, estado, fechaInicio, fechaFin, rol, origen, etc.
 * 
 * @param filtros - Filtros opcionales para la consulta
 * @returns Promise con array de facturas que cumplen los filtros
 */
export async function getFacturas(filtros?: FiltroFacturas): Promise<Factura[]> {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 300));

  let facturas = [...mockFacturas];

  // Aplicar filtros si existen
  if (filtros) {
    // Filtro por cliente
    if (filtros.clienteId) {
      facturas = facturas.filter(f => f.clienteId === filtros.clienteId);
    }

    // Filtro por estado
    if (filtros.estado) {
      facturas = facturas.filter(f => f.estado === filtros.estado);
    }

    // Filtro por rango de fecha de emisión
    if (filtros.fechaInicio) {
      const fechaInicio = new Date(filtros.fechaInicio);
      fechaInicio.setHours(0, 0, 0, 0);
      facturas = facturas.filter(f => {
        const fechaEmision = new Date(f.fechaEmision);
        fechaEmision.setHours(0, 0, 0, 0);
        return fechaEmision >= fechaInicio;
      });
    }

    if (filtros.fechaFin) {
      const fechaFin = new Date(filtros.fechaFin);
      fechaFin.setHours(23, 59, 59, 999);
      facturas = facturas.filter(f => {
        const fechaEmision = new Date(f.fechaEmision);
        fechaEmision.setHours(0, 0, 0, 0);
        return fechaEmision <= fechaFin;
      });
    }

    // Filtro por rango de fecha de vencimiento
    if (filtros.fechaVencimientoInicio) {
      const fechaInicio = new Date(filtros.fechaVencimientoInicio);
      fechaInicio.setHours(0, 0, 0, 0);
      facturas = facturas.filter(f => {
        const fechaVencimiento = new Date(f.fechaVencimiento);
        fechaVencimiento.setHours(0, 0, 0, 0);
        return fechaVencimiento >= fechaInicio;
      });
    }

    if (filtros.fechaVencimientoFin) {
      const fechaFin = new Date(filtros.fechaVencimientoFin);
      fechaFin.setHours(23, 59, 59, 999);
      facturas = facturas.filter(f => {
        const fechaVencimiento = new Date(f.fechaVencimiento);
        fechaVencimiento.setHours(0, 0, 0, 0);
        return fechaVencimiento <= fechaFin;
      });
    }

    // Filtro por origen
    if (filtros.origen) {
      facturas = facturas.filter(f => f.origen === filtros.origen);
    }

    // Búsqueda por número de factura (búsqueda parcial, case-insensitive)
    if (filtros.numeroFactura) {
      const busqueda = filtros.numeroFactura.toLowerCase().trim();
      facturas = facturas.filter(f =>
        f.numero.toLowerCase().includes(busqueda)
      );
    }

    // Filtro por monto mínimo
    if (filtros.montoMinimo !== undefined) {
      facturas = facturas.filter(f => f.total >= filtros.montoMinimo!);
    }

    // Filtro por monto máximo
    if (filtros.montoMaximo !== undefined) {
      facturas = facturas.filter(f => f.total <= filtros.montoMaximo!);
    }

    // Filtro por saldo pendiente mínimo
    if (filtros.saldoPendienteMinimo !== undefined) {
      facturas = facturas.filter(f => f.saldoPendiente >= filtros.saldoPendienteMinimo!);
    }

    // Filtro por saldo pendiente máximo
    if (filtros.saldoPendienteMaximo !== undefined) {
      facturas = facturas.filter(f => f.saldoPendiente <= filtros.saldoPendienteMaximo!);
    }

    // NOTA: El filtro por rol se implementaría en el backend con permisos
    // Endpoint real aplicaría filtros de autorización basados en el rol del usuario
    // Por ahora, en el mock no lo aplicamos ya que no tenemos contexto de usuario
  }

  // Ordenar por fecha de emisión descendente (más recientes primero)
  facturas.sort((a, b) => {
    const fechaA = new Date(a.fechaEmision).getTime();
    const fechaB = new Date(b.fechaEmision).getTime();
    return fechaB - fechaA;
  });

  return facturas;
}

/**
 * Obtiene una factura por su ID
 * 
 * Endpoint real: GET /api/facturas/:id
 * 
 * @param id - ID de la factura a buscar
 * @returns Promise con la factura encontrada o null si no existe
 */
export async function getFacturaById(id: string): Promise<Factura | null> {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 200));

  const factura = mockFacturas.find(f => f.id === id);

  if (!factura) {
    return null;
  }

  // Actualizar estado y saldo pendiente antes de retornar
  // En producción, esto se haría automáticamente con triggers o al consultar
  return await actualizarEstadoYSaldo(factura);
}

/**
 * Crea una nueva factura con numeración automática
 * 
 * Endpoint real: POST /api/facturas
 * Body: { clienteId, nombreCliente, fechaEmision, fechaVencimiento, lineas, ... }
 * 
 * @param dataParcial - Datos parciales de la factura (sin id, numero, timestamps)
 * @returns Promise con la factura creada
 */
export async function crearFactura(
  dataParcial: Omit<
    Factura,
    'id' | 'numero' | 'creadaEn' | 'actualizadaEn' | 'saldoPendiente' | 'estado'
  >
): Promise<Factura> {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 400));

  // Validar que tenga al menos una línea
  if (!dataParcial.lineas || dataParcial.lineas.length === 0) {
    throw new Error('La factura debe tener al menos una línea');
  }

  // Calcular subtotal, impuestos y total desde las líneas
  const subtotal = dataParcial.lineas.reduce((suma, linea) => {
    const totalLineaSinImpuesto = linea.cantidad * linea.precioUnitario - (linea.descuentoOpcional || 0);
    return suma + totalLineaSinImpuesto;
  }, 0);

  const impuestos = dataParcial.lineas.reduce((suma, linea) => {
    return suma + (linea.impuestoOpcional || 0);
  }, 0);

  const total = subtotal + impuestos;

  // Generar ID único (en producción, lo generaría la base de datos)
  const id = `factura_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Generar número de factura automáticamente
  const numero = generarNumeroFactura();

  // Crear fecha de creación
  const creadaEn = new Date();
  const actualizadaEn = new Date();

  // Estado inicial siempre es 'pendiente' (saldo pendiente = total)
  const nuevaFactura: Factura = {
    ...dataParcial,
    id,
    numero,
    subtotal,
    impuestos,
    total,
    saldoPendiente: total, // Inicialmente todo está pendiente
    estado: 'pendiente',
    creadaEn,
    actualizadaEn
  };

  // Agregar a la lista mock
  mockFacturas.push(nuevaFactura);

  return nuevaFactura;
}

/**
 * Actualiza una factura existente
 * 
 * Endpoint real: PUT /api/facturas/:id
 * Body: { campos a actualizar }
 * 
 * @param id - ID de la factura a actualizar
 * @param cambios - Campos a actualizar (parcial)
 * @returns Promise con la factura actualizada
 */
export async function actualizarFactura(
  id: string,
  cambios: Partial<Omit<Factura, 'id' | 'numero' | 'creadaEn'>> & {
    lineas?: LineaFactura[];
  }
): Promise<Factura> {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 300));

  const index = mockFacturas.findIndex(f => f.id === id);

  if (index === -1) {
    throw new Error(`Factura con ID ${id} no encontrada`);
  }

  const facturaExistente = mockFacturas[index];

  // Si se canceló, no permitir más cambios (excepto notas)
  if (facturaExistente.estado === 'cancelada' && cambios.estado !== 'cancelada') {
    const tieneCambiosProhibidos = Object.keys(cambios).some(
      key => key !== 'notasInternas' && key !== 'actualizadaEn'
    );
    if (tieneCambiosProhibidos) {
      throw new Error('No se pueden modificar facturas canceladas');
    }
  }

  // Si se actualizan las líneas, recalcular subtotal, impuestos y total
  let subtotal = facturaExistente.subtotal;
  let impuestos = facturaExistente.impuestos;
  let total = facturaExistente.total;
  let saldoPendiente = facturaExistente.saldoPendiente;

  if (cambios.lineas) {
    subtotal = cambios.lineas.reduce((suma, linea) => {
      const totalLineaSinImpuesto =
        linea.cantidad * linea.precioUnitario - (linea.descuentoOpcional || 0);
      return suma + totalLineaSinImpuesto;
    }, 0);

    impuestos = cambios.lineas.reduce((suma, linea) => {
      return suma + (linea.impuestoOpcional || 0);
    }, 0);

    total = subtotal + impuestos;

    // Si cambió el total, ajustar saldo pendiente proporcionalmente
    // (mantener el mismo porcentaje pagado)
    const porcentajePagado = facturaExistente.total > 0
      ? (facturaExistente.total - facturaExistente.saldoPendiente) / facturaExistente.total
      : 0;
    saldoPendiente = total * (1 - porcentajePagado);
  }

  // Actualizar factura
  const facturaActualizada: Factura = {
    ...facturaExistente,
    ...cambios,
    subtotal,
    impuestos,
    total,
    saldoPendiente,
    actualizadaEn: new Date()
  };

  // Si se actualizó algo que afecta el estado, recalcularlo
  if (cambios.lineas || cambios.total || cambios.fechaVencimiento) {
    // Recalcular estado basándose en saldo y vencimiento
    facturaActualizada.estado = determinarEstadoFactura(facturaActualizada, saldoPendiente);
  }

  // Guardar cambios
  mockFacturas[index] = facturaActualizada;

  // Actualizar estado y saldo pendiente basándose en cobros
  return await actualizarEstadoYSaldo(facturaActualizada);
}

/**
 * Cancela una factura
 * 
 * Endpoint real: PATCH /api/facturas/:id/cancelar
 * Body: { motivo?: string }
 * 
 * @param id - ID de la factura a cancelar
 * @param motivo - Motivo opcional de la cancelación
 * @returns Promise con la factura cancelada
 */
export async function cancelarFactura(
  id: string,
  motivo?: string
): Promise<Factura> {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 300));

  const index = mockFacturas.findIndex(f => f.id === id);

  if (index === -1) {
    throw new Error(`Factura con ID ${id} no encontrada`);
  }

  const factura = mockFacturas[index];

  // Validar que no esté ya cancelada
  if (factura.estado === 'cancelada') {
    throw new Error('La factura ya está cancelada');
  }

  // Validar que no esté completamente pagada (según reglas de negocio)
  // En producción, esto podría ser configurable
  if (factura.estado === 'pagada') {
    throw new Error('No se puede cancelar una factura completamente pagada');
  }

  // Actualizar factura
  const facturaCancelada: Factura = {
    ...factura,
    estado: 'cancelada',
    notasInternas: motivo
      ? `${factura.notasInternas || ''}\n[Cancelada] ${motivo}`.trim()
      : `${factura.notasInternas || ''}\n[Cancelada]`.trim(),
    actualizadaEn: new Date()
  };

  // Guardar cambios
  mockFacturas[index] = facturaCancelada;

  return facturaCancelada;
}

