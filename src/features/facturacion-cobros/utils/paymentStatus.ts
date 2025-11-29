/**
 * Utilidades reutilizables para gestión de estados de pago y transiciones
 * 
 * Este archivo centraliza la lógica de cálculo de estados de factura para mantener
 * consistencia en todo el sistema de facturación y cobros.
 * 
 * IMPORTANTE: Estas funciones deben ser usadas desde:
 * - `src/features/facturacion-cobros/api/facturas.ts` - Para calcular estados al crear/actualizar facturas
 * - `src/features/facturacion-cobros/api/cobros.ts` - Para recalcular estados después de registrar/eliminar cobros
 * 
 * Esto garantiza que la lógica de determinación de estados sea consistente en ambos módulos
 * y evita duplicación de código.
 */

import { EstadoFactura } from '../types';

// ============================================================================
// FUNCIONES PRINCIPALES
// ============================================================================

/**
 * Calcula el estado de una factura basándose en el saldo pendiente, total y fecha de vencimiento
 * 
 * Lógica de estados:
 * - 'cancelada': Si el estado actual es 'cancelada', se mantiene (no se recalcula)
 * - 'pagada': Si saldoPendiente <= 0 (todo pagado)
 * - 'parcialmentePagada': Si hay saldo pendiente pero menor que el total (pago parcial) y no está vencida
 * - 'vencida': Si hay saldo pendiente y la fecha de vencimiento ya pasó
 * - 'pendiente': Si hay saldo pendiente y no está vencida
 * 
 * @param saldoPendiente - Monto aún pendiente de pago
 * @param total - Total de la factura
 * @param fechaVencimiento - Fecha límite de pago
 * @param estadoActual - Estado actual de la factura (opcional, para preservar 'cancelada')
 * @returns El estado calculado de la factura
 * 
 * @example
 * ```typescript
 * const estado = calcularEstadoFactura(50000, 100000, new Date('2025-01-20'));
 * // Retorna 'parcialmentePagada' si hoy es antes del 20/01/2025
 * // Retorna 'vencida' si hoy es después del 20/01/2025
 * ```
 */
export function calcularEstadoFactura(
  saldoPendiente: number,
  total: number,
  fechaVencimiento: Date,
  estadoActual?: EstadoFactura
): EstadoFactura {
  // Si está cancelada, mantener el estado cancelada
  if (estadoActual === 'cancelada') {
    return 'cancelada';
  }

  // Si no hay saldo pendiente, está pagada
  if (saldoPendiente <= 0) {
    return 'pagada';
  }

  // Normalizar fechas para comparación (solo día, sin hora)
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fechaVenc = new Date(fechaVencimiento);
  fechaVenc.setHours(0, 0, 0, 0);

  const estaVencida = fechaVenc < hoy;

  // Si hay saldo pendiente pero menor que el total, está parcialmente pagada
  if (saldoPendiente < total) {
    // Si está vencida y no pagada completamente, está vencida
    if (estaVencida) {
      return 'vencida';
    }
    return 'parcialmentePagada';
  }

  // Si no está pagada y está vencida, está vencida
  if (estaVencida) {
    return 'vencida';
  }

  // Por defecto, está pendiente
  return 'pendiente';
}

/**
 * Determina si una factura está vencida basándose en su estado y fecha de vencimiento
 * 
 * Una factura se considera vencida si:
 * - Su estado es 'vencida', O
 * - Tiene saldo pendiente y la fecha de vencimiento ya pasó
 * 
 * @param estado - Estado actual de la factura
 * @param fechaVencimiento - Fecha límite de pago
 * @returns true si la factura está vencida, false en caso contrario
 * 
 * @example
 * ```typescript
 * const vencida = esFacturaVencida('pendiente', new Date('2025-01-15'));
 * // Retorna true si hoy es después del 15/01/2025
 * // Retorna false si hoy es antes o igual al 15/01/2025
 * ```
 */
export function esFacturaVencida(
  estado: EstadoFactura,
  fechaVencimiento: Date
): boolean {
  // Si el estado ya indica que está vencida
  if (estado === 'vencida') {
    return true;
  }

  // Si está cancelada o pagada, no está vencida
  if (estado === 'cancelada' || estado === 'pagada') {
    return false;
  }

  // Para estados 'pendiente' o 'parcialmentePagada', verificar fecha
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fechaVenc = new Date(fechaVencimiento);
  fechaVenc.setHours(0, 0, 0, 0);

  return fechaVenc < hoy;
}

/**
 * Determina si una factura tiene un pago parcial (está parcialmente pagada)
 * 
 * @param estado - Estado actual de la factura
 * @returns true si la factura está parcialmente pagada, false en caso contrario
 * 
 * @example
 * ```typescript
 * const parcial = esPagoParcial('parcialmentePagada');
 * // Retorna true
 * 
 * const parcial2 = esPagoParcial('pagada');
 * // Retorna false
 * ```
 */
export function esPagoParcial(estado: EstadoFactura): boolean {
  return estado === 'parcialmentePagada';
}

