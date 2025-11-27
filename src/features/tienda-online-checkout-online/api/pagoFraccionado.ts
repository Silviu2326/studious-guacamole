import { PlanPagoFraccionado, PagoFraccionadoSeleccionado, Carrito } from '../types';

// Planes de pago fraccionado predefinidos
const PLANES_PAGO_FRACCIONADO: PlanPagoFraccionado[] = [
  {
    id: '2-cuotas',
    numeroCuotas: 2,
    porcentajeInteres: 0,
    descripcion: '2 cuotas sin intereses',
    disponible: true,
    montoMinimo: 100,
  },
  {
    id: '3-cuotas',
    numeroCuotas: 3,
    porcentajeInteres: 0,
    descripcion: '3 cuotas sin intereses',
    disponible: true,
    montoMinimo: 150,
  },
  {
    id: '4-cuotas',
    numeroCuotas: 4,
    porcentajeInteres: 0,
    descripcion: '4 cuotas sin intereses',
    disponible: true,
    montoMinimo: 200,
  },
  {
    id: '6-cuotas',
    numeroCuotas: 6,
    porcentajeInteres: 2.5,
    descripcion: '6 cuotas con 2.5% de interés',
    disponible: true,
    montoMinimo: 300,
  },
  {
    id: '12-cuotas',
    numeroCuotas: 12,
    porcentajeInteres: 5,
    descripcion: '12 cuotas con 5% de interés',
    disponible: true,
    montoMinimo: 500,
  },
];

/**
 * Obtiene los planes de pago fraccionado disponibles para un monto
 */
export async function getPlanesPagoFraccionado(
  montoTotal: number
): Promise<PlanPagoFraccionado[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  
  return PLANES_PAGO_FRACCIONADO.filter(
    (plan) => plan.disponible && (!plan.montoMinimo || montoTotal >= plan.montoMinimo)
  );
}

/**
 * Calcula el plan de pago fraccionado seleccionado
 */
export function calcularPagoFraccionado(
  montoTotal: number,
  plan: PlanPagoFraccionado
): PagoFraccionadoSeleccionado {
  // Calcular monto con interés si aplica
  const montoConInteres = plan.porcentajeInteres
    ? montoTotal * (1 + plan.porcentajeInteres / 100)
    : montoTotal;

  // Calcular monto por cuota (redondeado a 2 decimales)
  const montoPorCuota = Math.round((montoConInteres / plan.numeroCuotas) * 100) / 100;

  // Ajustar la última cuota para compensar redondeos
  const montoTotalAjustado = montoPorCuota * (plan.numeroCuotas - 1);
  const ultimaCuota = montoConInteres - montoTotalAjustado;

  // Calcular fechas de las cuotas (mensuales)
  const fechaPrimeraCuota = new Date();
  fechaPrimeraCuota.setMonth(fechaPrimeraCuota.getMonth() + 1);
  fechaPrimeraCuota.setDate(1); // Primer día del mes

  const fechasCuotas: Date[] = [];
  for (let i = 0; i < plan.numeroCuotas; i++) {
    const fecha = new Date(fechaPrimeraCuota);
    fecha.setMonth(fecha.getMonth() + i);
    fechasCuotas.push(fecha);
  }

  return {
    planId: plan.id,
    numeroCuotas: plan.numeroCuotas,
    montoPorCuota, // Monto por cuota (la última se ajustará en el frontend si es necesario)
    montoTotal: montoConInteres,
    porcentajeInteres: plan.porcentajeInteres,
    fechaPrimeraCuota,
    fechasCuotas,
  };
}

/**
 * Verifica si un carrito es elegible para pago fraccionado
 */
export function esElegibleParaPagoFraccionado(carrito: Carrito): boolean {
  // Verificar si algún producto permite pago fraccionado
  const tieneProductoElegible = carrito.items.some(
    (item) => item.producto.metadatos?.permitePagoFraccionado === true
  );

  if (!tieneProductoElegible) {
    return false;
  }

  // Verificar monto mínimo
  const montoMinimoGlobal = 100; // Monto mínimo global
  return carrito.total >= montoMinimoGlobal;
}

// ============================================================================
// API MOCK DE PLANES DE PAGO FRACCIONADO PARA PEDIDOS
// ============================================================================

/**
 * Simula un plan de pago fraccionado calculando el importe por cuota y el calendario de pagos
 * 
 * Esta función calcula:
 * - El importe de cada cuota (distribuyendo el importe total entre las cuotas)
 * - Un calendario de pagos con fechas mensuales
 * 
 * NOTA: Esta es una implementación mock. En producción, esto se integraría con:
 * - El sistema de gestión de pagos fraccionados
 * - Cálculo de intereses reales según políticas de la entidad financiera
 * - Validación de límites de crédito del cliente
 * 
 * @param importe - Importe total a fraccionar
 * @param numeroCuotas - Número de cuotas (2, 3, 4, 6, 12, etc.)
 * @returns Objeto con el importe por cuota y el calendario completo de pagos
 * 
 * @example
 * ```ts
 * const plan = await simularPlanPago(1000, 3);
 * // plan = {
 * //   importeCuota: 333.33,
 * //   calendario: [
 * //     { numeroCuota: 1, fecha: "2024-11-01", importe: 333.33 },
 * //     { numeroCuota: 2, fecha: "2024-12-01", importe: 333.33 },
 * //     { numeroCuota: 3, fecha: "2025-01-01", importe: 333.34 }
 * //   ]
 * // }
 * ```
 */
export async function simularPlanPago(
  importe: number,
  numeroCuotas: number
): Promise<{
  importeCuota: number;
  calendario: Array<{ numeroCuota: number; fecha: string; importe: number }>;
}> {
  // Simular delay de procesamiento
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Validaciones básicas
  if (importe <= 0) {
    throw new Error('El importe debe ser mayor que cero');
  }

  if (numeroCuotas < 2 || numeroCuotas > 24) {
    throw new Error('El número de cuotas debe estar entre 2 y 24');
  }

  // Calcular importe por cuota (dividir equitativamente)
  // Redondear a 2 decimales
  const importePorCuota = Math.round((importe / numeroCuotas) * 100) / 100;

  // Calcular el ajuste para la última cuota para compensar redondeos
  const totalSinAjuste = importePorCuota * (numeroCuotas - 1);
  const ultimaCuota = importe - totalSinAjuste;

  // Generar calendario de pagos (mensual, empezando el próximo mes)
  const calendario: Array<{ numeroCuota: number; fecha: string; importe: number }> = [];
  const fechaBase = new Date();
  
  // Primera cuota el primer día del próximo mes
  fechaBase.setMonth(fechaBase.getMonth() + 1);
  fechaBase.setDate(1);

  for (let i = 0; i < numeroCuotas; i++) {
    const fechaCuota = new Date(fechaBase);
    fechaCuota.setMonth(fechaBase.getMonth() + i);

    const importeCuota = i === numeroCuotas - 1 ? ultimaCuota : importePorCuota;

    calendario.push({
      numeroCuota: i + 1,
      fecha: fechaCuota.toISOString().split('T')[0], // Formato YYYY-MM-DD
      importe: Math.round(importeCuota * 100) / 100, // Redondear a 2 decimales
    });
  }

  return {
    importeCuota: importePorCuota,
    calendario,
  };
}

// Mock storage para planes de pago asociados a pedidos
// En producción, esto sería una base de datos
const planesPagoPorPedido: Array<{ planId: string; pedidoId: string; fechaCreacion: Date }> = [];

/**
 * Crea un plan de pago fraccionado para un pedido específico
 * 
 * Esta función:
 * - Crea un registro del plan de pago asociado al pedido
 * - Genera un ID único para el plan
 * - Establece la relación entre el pedido y el plan de pago
 * 
 * NOTA: Esta es una implementación mock. En producción, esto se integraría con:
 * - El sistema de gestión de pagos fraccionados (src/features/suscripciones-cuotas-recurrentes)
 * - Base de datos para almacenar los planes y su relación con pedidos
 * - Sistema de facturación para generar cuotas periódicas
 * - Notificaciones al cliente sobre fechas de pago
 * 
 * @param pedidoId - ID del pedido al que se asocia el plan de pago
 * @param cuotas - Número de cuotas del plan
 * @returns Objeto con el ID del pedido y el ID del plan de pago creado
 * 
 * @example
 * ```ts
 * const resultado = await crearPlanPagoParaPedido('pedido-123', 3);
 * // resultado = { pedidoId: 'pedido-123', planId: 'PLAN-123456789' }
 * ```
 * 
 * @future-integration
 * Esta función se conectará en el futuro con:
 * - src/features/suscripciones-cuotas-recurrentes/api/suscripciones.ts
 * - Sistema de gestión de cuotas recurrentes para crear automáticamente las cuotas
 * - Integración con pasarelas de pago para programar cargos automáticos
 */
export async function crearPlanPagoParaPedido(
  pedidoId: string,
  cuotas: number
): Promise<{ pedidoId: string; planId: string }> {
  // Simular delay de procesamiento
  await new Promise((resolve) => setTimeout(resolve, 400));

  // Validaciones básicas
  if (!pedidoId || pedidoId.trim() === '') {
    throw new Error('El ID del pedido es obligatorio');
  }

  if (cuotas < 2 || cuotas > 24) {
    throw new Error('El número de cuotas debe estar entre 2 y 24');
  }

  // Generar ID único para el plan de pago
  const planId = `PLAN-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

  // Guardar la relación entre el pedido y el plan de pago
  planesPagoPorPedido.push({
    planId,
    pedidoId,
    fechaCreacion: new Date(),
  });

  return {
    pedidoId,
    planId,
  };
}

/**
 * Obtiene todos los planes de pago asociados a un pedido
 * 
 * Esta función retorna todos los planes de pago que están asociados a un pedido específico.
 * Un pedido puede tener múltiples planes de pago si se ha modificado o refinanciado.
 * 
 * NOTA: Esta es una implementación mock. En producción, esto se integraría con:
 * - El sistema de gestión de pagos fraccionados (src/features/suscripciones-cuotas-recurrentes)
 * - Base de datos para consultar los planes asociados
 * - Filtrado y ordenamiento por fecha de creación (más recientes primero)
 * 
 * @param pedidoId - ID del pedido del cual obtener los planes de pago
 * @returns Array de objetos con el planId y pedidoId de cada plan asociado
 * 
 * @example
 * ```ts
 * const planes = await getPlanesPagoPorPedido('pedido-123');
 * // planes = [
 * //   { planId: 'PLAN-123456789', pedidoId: 'pedido-123' },
 * //   { planId: 'PLAN-987654321', pedidoId: 'pedido-123' }
 * // ]
 * ```
 * 
 * @future-integration
 * Esta función se conectará en el futuro con:
 * - src/features/suscripciones-cuotas-recurrentes/api/suscripciones.ts
 * - Para obtener información detallada de cada plan (cuotas, estado, fechas, etc.)
 * - Para consultar el estado de las cuotas individuales (pagadas, pendientes, vencidas)
 */
export async function getPlanesPagoPorPedido(
  pedidoId: string
): Promise<Array<{ planId: string; pedidoId: string }>> {
  // Simular delay de consulta
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Validación básica
  if (!pedidoId || pedidoId.trim() === '') {
    throw new Error('El ID del pedido es obligatorio');
  }

  // Buscar todos los planes asociados al pedido
  const planes = planesPagoPorPedido
    .filter((plan) => plan.pedidoId === pedidoId)
    .sort((a, b) => b.fechaCreacion.getTime() - a.fechaCreacion.getTime()) // Más recientes primero
    .map((plan) => ({
      planId: plan.planId,
      pedidoId: plan.pedidoId,
    }));

  return planes;
}

