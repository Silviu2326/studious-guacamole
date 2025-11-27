/**
 * API Mock de Cobros - Sistema de Facturación y Cobros
 * 
 * Este archivo implementa la lógica mock de gestión de cobros y pagos asociados a facturas.
 * Incluye:
 * - Registro de nuevos cobros
 * - Eliminación de cobros
 * - Consulta de cobros por factura
 * - Historial de pagos por cliente
 * - Recalculación automática de saldo pendiente y estado de factura
 * 
 * NOTA: En producción, las llamadas a backend reales irían en endpoints como:
 * - GET /api/cobros?facturaId={facturaId} - Obtener cobros de una factura
 * - GET /api/cobros?clienteId={clienteId} - Obtener historial de pagos de un cliente
 * - POST /api/cobros - Registrar nuevo cobro
 * - DELETE /api/cobros/:id - Eliminar cobro
 * 
 * INTEGRACIÓN CON COMPONENTES:
 * 
 * 1. GestorCobros.tsx:
 *    - Utiliza `getCobrosPorFactura()` para mostrar el historial de pagos de una factura
 *    - Utiliza `registrarCobro()` cuando el usuario registra un nuevo pago parcial o completo
 *    - Utiliza `eliminarCobro()` para permitir eliminar pagos registrados por error
 *    - El componente se actualiza automáticamente cuando se registra/elimina un cobro,
 *      ya que estos métodos retornan la factura actualizada con el nuevo saldo y estado
 * 
 * 2. HistorialPagosCliente.tsx:
 *    - Utiliza `getHistorialPagosCliente()` para mostrar todos los pagos realizados por un cliente
 *    - Muestra un timeline combinado de facturas y pagos para dar contexto completo
 *    - Calcula métricas como total pagado, total pendiente, etc. basándose en los cobros
 */

import { Cobro, Factura, EstadoFactura } from '../types';
import { getFacturaById, actualizarFactura } from './facturas';

// ============================================================================
// DATOS MOCK
// ============================================================================

/**
 * Almacenamiento mock de cobros en memoria
 * En producción, esto sería una base de datos (PostgreSQL, MongoDB, etc.)
 * con una tabla/colección de cobros relacionada con facturas
 */
const mockCobros: Cobro[] = [
  {
    id: 'cobro_001',
    facturaId: '2',
    fechaCobro: new Date('2025-01-12'),
    importe: 357000,
    metodoPago: 'transferencia',
    referenciaExternaOpcional: 'TXN-123456',
    observacionesOpcional: 'Pago completo recibido',
    esCobroRecurrente: false
  },
  {
    id: 'cobro_002',
    facturaId: '4',
    fechaCobro: new Date('2025-01-22'),
    importe: 238000,
    metodoPago: 'tarjeta',
    referenciaExternaOpcional: 'CARD-789012',
    observacionesOpcional: 'Primer pago parcial',
    esCobroRecurrente: false
  }
];

// Contador para IDs únicos (simula secuencia de base de datos)
let contadorCobros = 2;

// ============================================================================
// HELPERS INTERNOS - CÁLCULO DE ESTADO Y SALDO
// ============================================================================

/**
 * Recalcula el saldo pendiente de una factura basándose en los cobros asociados
 * 
 * Lógica:
 * - Suma todos los importes de los cobros de la factura
 * - Calcula saldo pendiente = total factura - total cobrado
 * - El saldo nunca puede ser negativo (mínimo 0)
 * 
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
 * 
 * Lógica de estados:
 * - 'cancelada': Si la factura ya está cancelada, mantener el estado
 * - 'pagada': Si saldo pendiente <= 0 (todo pagado)
 * - 'parcialmentePagada': Si hay saldo pendiente pero menor que el total (pago parcial)
 * - 'vencida': Si hay saldo pendiente y la fecha de vencimiento ya pasó
 * - 'pendiente': Si hay saldo pendiente y no está vencida
 * 
 * NOTA: Esta función será movida a un archivo paymentStatus.ts en el futuro
 * para centralizar toda la lógica de cálculo de estados de factura.
 * 
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
 * 
 * Este método:
 * 1. Obtiene todos los cobros de la factura
 * 2. Recalcula el saldo pendiente
 * 3. Determina el nuevo estado
 * 4. Actualiza la factura en el sistema
 * 
 * @param facturaId - ID de la factura a actualizar
 * @returns La factura actualizada con estado y saldo recalculados
 */
async function actualizarEstadoYSaldoFactura(facturaId: string): Promise<Factura> {
  // Obtener la factura actual
  const factura = await getFacturaById(facturaId);
  if (!factura) {
    throw new Error(`Factura con ID ${facturaId} no encontrada`);
  }

  // Obtener todos los cobros de la factura
  const cobros = mockCobros.filter(c => c.facturaId === facturaId);

  // Recalcular saldo pendiente
  const saldoPendiente = recalcularSaldoPendiente(factura, cobros);

  // Determinar nuevo estado
  const estado = determinarEstadoFactura(factura, saldoPendiente);

  // Actualizar factura
  const facturaActualizada = await actualizarFactura(facturaId, {
    saldoPendiente,
    estado,
    actualizadaEn: new Date()
  });

  return facturaActualizada;
}

// ============================================================================
// FUNCIONES PRINCIPALES DE LA API
// ============================================================================

/**
 * Obtiene todos los cobros asociados a una factura específica
 * 
 * Endpoint real: GET /api/cobros?facturaId={facturaId}
 * 
 * USO EN COMPONENTES:
 * - GestorCobros.tsx: Muestra el historial de pagos de una factura cuando
 *   el usuario abre el modal de registro de cobros. Permite ver qué pagos
 *   ya se han registrado antes de agregar uno nuevo.
 * 
 * @param facturaId - ID de la factura
 * @returns Promise con array de cobros ordenados por fecha (más recientes primero)
 */
export async function getCobrosPorFactura(facturaId: string): Promise<Cobro[]> {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 200));

  // Filtrar cobros de la factura
  const cobros = mockCobros.filter(c => c.facturaId === facturaId);

  // Ordenar por fecha de cobro descendente (más recientes primero)
  cobros.sort((a, b) => {
    const fechaA = new Date(a.fechaCobro).getTime();
    const fechaB = new Date(b.fechaCobro).getTime();
    return fechaB - fechaA;
  });

  return cobros;
}

/**
 * Registra un nuevo cobro asociado a una factura
 * 
 * Este método:
 * 1. Valida que la factura exista
 * 2. Valida que el importe no exceda el saldo pendiente
 * 3. Crea el nuevo cobro
 * 4. Recalcula el saldo pendiente y estado de la factura
 * 5. Actualiza la factura con los nuevos valores
 * 
 * Endpoint real: POST /api/cobros
 * Body: { facturaId, fechaCobro, importe, metodoPago, referenciaExternaOpcional, observacionesOpcional, esCobroRecurrente }
 * 
 * USO EN COMPONENTES:
 * - GestorCobros.tsx: Se llama cuando el usuario confirma el registro de uno o más
 *   pagos parciales. El componente recibe la factura actualizada y puede mostrar
 *   inmediatamente el nuevo saldo pendiente y estado. Si el saldo llega a 0,
 *   el componente puede cerrar automáticamente el modal y refrescar la lista.
 * 
 * @param facturaId - ID de la factura a la que se asocia el cobro
 * @param datosCobro - Datos del cobro (sin id, que se genera automáticamente)
 * @returns Promise con la factura actualizada y el cobro creado
 */
export async function registrarCobro(
  facturaId: string,
  datosCobro: Omit<Cobro, 'id' | 'facturaId'>
): Promise<{ facturaActualizada: Factura; cobro: Cobro }> {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 400));

  // Validar que la factura exista
  const factura = await getFacturaById(facturaId);
  if (!factura) {
    throw new Error(`Factura con ID ${facturaId} no encontrada`);
  }

  // Validar que la factura no esté cancelada
  if (factura.estado === 'cancelada') {
    throw new Error('No se puede registrar un cobro en una factura cancelada');
  }

  // Obtener cobros existentes para calcular el saldo actual
  const cobrosExistentes = mockCobros.filter(c => c.facturaId === facturaId);
  const totalCobrado = cobrosExistentes.reduce((suma, cobro) => suma + cobro.importe, 0);
  const saldoPendienteActual = factura.total - totalCobrado;

  // Validar que el importe no exceda el saldo pendiente
  if (datosCobro.importe > saldoPendienteActual) {
    throw new Error(
      `El importe del cobro (${datosCobro.importe}) excede el saldo pendiente (${saldoPendienteActual})`
    );
  }

  // Validar que el importe sea positivo
  if (datosCobro.importe <= 0) {
    throw new Error('El importe del cobro debe ser mayor a 0');
  }

  // Generar ID único para el cobro
  contadorCobros += 1;
  const id = `cobro_${String(contadorCobros).padStart(3, '0')}`;

  // Crear el nuevo cobro
  const nuevoCobro: Cobro = {
    ...datosCobro,
    id,
    facturaId
  };

  // Agregar a la lista mock
  mockCobros.push(nuevoCobro);

  // Recalcular saldo pendiente y estado de la factura
  const facturaActualizada = await actualizarEstadoYSaldoFactura(facturaId);

  return {
    facturaActualizada,
    cobro: nuevoCobro
  };
}

/**
 * Elimina un cobro y recalcula el saldo pendiente y estado de la factura
 * 
 * Este método:
 * 1. Valida que el cobro exista
 * 2. Elimina el cobro
 * 3. Recalcula el saldo pendiente y estado de la factura
 * 4. Actualiza la factura con los nuevos valores
 * 
 * Endpoint real: DELETE /api/cobros/:id
 * 
 * USO EN COMPONENTES:
 * - GestorCobros.tsx: Permite al usuario eliminar un pago registrado por error.
 *   Después de eliminar, el componente recibe la factura actualizada con el
 *   saldo pendiente incrementado y el estado posiblemente cambiado (de 'pagada'
 *   a 'parcialmentePagada' o 'pendiente', por ejemplo).
 * 
 * @param cobroId - ID del cobro a eliminar
 * @returns Promise con la factura actualizada después de eliminar el cobro
 */
export async function eliminarCobro(cobroId: string): Promise<Factura> {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 300));

  // Buscar el cobro
  const index = mockCobros.findIndex(c => c.id === cobroId);
  if (index === -1) {
    throw new Error(`Cobro con ID ${cobroId} no encontrado`);
  }

  const cobro = mockCobros[index];
  const facturaId = cobro.facturaId;

  // Eliminar el cobro
  mockCobros.splice(index, 1);

  // Recalcular saldo pendiente y estado de la factura
  const facturaActualizada = await actualizarEstadoYSaldoFactura(facturaId);

  return facturaActualizada;
}

/**
 * Obtiene el historial completo de pagos (cobros) de un cliente
 * 
 * Este método:
 * 1. Filtra todos los cobros asociados a facturas del cliente
 * 2. Ordena por fecha descendente (más recientes primero)
 * 
 * Endpoint real: GET /api/cobros?clienteId={clienteId}
 * 
 * NOTA: En producción, esto se haría con una query SQL/NoSQL que una las tablas
 * de facturas y cobros, o con un índice que permita buscar cobros por clienteId.
 * 
 * USO EN COMPONENTES:
 * - HistorialPagosCliente.tsx: Muestra todos los pagos realizados por un cliente
 *   en orden cronológico. El componente puede combinar esta información con las
 *   facturas del cliente para crear un timeline completo de transacciones
 *   (facturas emitidas y pagos recibidos). Esto permite al usuario ver:
 *   - Cuánto ha pagado el cliente en total
 *   - Qué facturas están pagadas, parcialmente pagadas o pendientes
 *   - El historial de métodos de pago utilizados
 *   - Referencias de transacciones para auditoría
 * 
 * @param clienteId - ID del cliente
 * @returns Promise con array de cobros ordenados por fecha (más recientes primero)
 */
export async function getHistorialPagosCliente(clienteId: string): Promise<Cobro[]> {
  // Simular latencia de red
  await new Promise(resolve => setTimeout(resolve, 300));

  // En producción, esto se haría con una query que una facturas y cobros:
  // SELECT c.* FROM cobros c
  // INNER JOIN facturas f ON c.facturaId = f.id
  // WHERE f.clienteId = ?
  // ORDER BY c.fechaCobro DESC

  // Para el mock, necesitamos obtener las facturas del cliente primero
  // y luego filtrar los cobros de esas facturas
  const { getFacturas } = await import('./facturas');
  const facturasCliente = await getFacturas({ clienteId });
  const facturaIds = facturasCliente.map(f => f.id);

  // Filtrar cobros de las facturas del cliente
  const cobrosCliente = mockCobros.filter(c => facturaIds.includes(c.facturaId));

  // Ordenar por fecha de cobro descendente (más recientes primero)
  cobrosCliente.sort((a, b) => {
    const fechaA = new Date(a.fechaCobro).getTime();
    const fechaB = new Date(b.fechaCobro).getTime();
    return fechaB - fechaA;
  });

  return cobrosCliente;
}

// ============================================================================
// EXPORTACIÓN DE API
// ============================================================================

/**
 * Objeto API que agrupa todas las funciones de cobros
 * Similar a facturasAPI en facturas.ts
 * 
 * USO:
 * import { cobrosAPI } from './api/cobros';
 * 
 * const cobros = await cobrosAPI.getCobrosPorFactura('factura_123');
 * const resultado = await cobrosAPI.registrarCobro('factura_123', datosCobro);
 */
export const cobrosAPI = {
  getCobrosPorFactura,
  registrarCobro,
  eliminarCobro,
  getHistorialPagosCliente
};

