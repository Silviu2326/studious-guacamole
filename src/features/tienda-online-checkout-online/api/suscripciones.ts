import { Suscripcion, MetodoPago, Pedido } from '../types';

// Mock storage para suscripciones (en producción sería una base de datos)
let suscripciones: Suscripcion[] = [];

/**
 * Crea una nueva suscripción
 */
export async function crearSuscripcion(
  suscripcion: Omit<Suscripcion, 'id'>
): Promise<Suscripcion> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const nuevaSuscripcion: Suscripcion = {
    ...suscripcion,
    id: `SUB-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };

  suscripciones.push(nuevaSuscripcion);
  return nuevaSuscripcion;
}

/**
 * Obtiene todas las suscripciones activas de un cliente
 */
export async function getSuscripcionesPorCliente(
  clienteEmail: string
): Promise<Suscripcion[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  return suscripciones.filter(
    (s) => s.clienteEmail === clienteEmail && s.estado === 'activa'
  );
}

/**
 * Obtiene una suscripción por ID
 */
export async function getSuscripcion(id: string): Promise<Suscripcion | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  return suscripciones.find((s) => s.id === id) || null;
}

/**
 * Actualiza el estado de una suscripción
 */
export async function actualizarEstadoSuscripcion(
  id: string,
  estado: Suscripcion['estado']
): Promise<Suscripcion | null> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const suscripcion = suscripciones.find((s) => s.id === id);
  if (!suscripcion) {
    return null;
  }

  suscripcion.estado = estado;
  return suscripcion;
}

/**
 * Calcula la fecha del próximo cargo según el ciclo de facturación
 */
export function calcularFechaProximoCargo(
  fechaInicio: Date,
  cicloFacturacion: Suscripcion['cicloFacturacion']
): Date {
  const fecha = new Date(fechaInicio);

  switch (cicloFacturacion) {
    case 'mensual':
      fecha.setMonth(fecha.getMonth() + 1);
      break;
    case 'trimestral':
      fecha.setMonth(fecha.getMonth() + 3);
      break;
    case 'semestral':
      fecha.setMonth(fecha.getMonth() + 6);
      break;
    case 'anual':
      fecha.setFullYear(fecha.getFullYear() + 1);
      break;
  }

  return fecha;
}

// ============================================================================
// API MOCK DE COMPRA DE SUSCRIPCIONES DESDE LA TIENDA
// ============================================================================

/**
 * Compra una suscripción desde la tienda online
 * 
 * Esta función procesa la compra de una suscripción desde la tienda, creando:
 * - Un pedido asociado a la suscripción
 * - La suscripción con el estado inicial correspondiente
 * - La relación entre el pedido y la suscripción
 * 
 * NOTA: Esta es una implementación mock simplificada. En producción, esto se integraría con:
 * - El sistema completo de suscripciones (src/features/suscripciones-cuotas-recurrentes)
 * - Procesamiento de pago real a través de la pasarela de pago
 * - Validación de métodos de pago que soporten cargos recurrentes
 * - Creación de registros de pago recurrente para cobros automáticos
 * 
 * @param payload - Datos de la compra de suscripción
 * @param payload.planSuscripcionId - ID del plan de suscripción a comprar
 * @param payload.metodoPago - Método de pago seleccionado (debe soportar cargos recurrentes)
 * @param payload.emailCliente - Email del cliente que compra la suscripción
 * @returns Objeto con el ID de la suscripción creada y el pedido asociado
 * 
 * @example
 * ```ts
 * const resultado = await comprarSuscripcionDesdeTienda({
 *   planSuscripcionId: 'plan-premium-pt',
 *   metodoPago: 'tarjeta',
 *   emailCliente: 'cliente@example.com'
 * });
 * // resultado = {
 * //   suscripcionId: 'SUB-123456789',
 * //   pedido: { id: 'pedido-123', ... }
 * // }
 * ```
 * 
 * @future-integration
 * Esta función se conectará en el futuro con:
 * - src/features/suscripciones-cuotas-recurrentes/api/suscripciones.ts
 * - Para crear suscripciones completas con toda la funcionalidad (sesiones, cuotas, etc.)
 * - Sistema de gestión de pagos recurrentes para configurar cargos automáticos
 * - Validación y procesamiento de métodos de pago que soporten cargos recurrentes
 * - Integración con pasarelas de pago (Stripe, PayPal, etc.) para suscripciones reales
 * 
 * IMPORTANTE: Esta implementación actual utiliza IDs y estructuras simplificadas
 * que se pueden conectar más adelante con el sistema completo de suscripciones.
 * No está acoplada a la implementación interna de la feature de Suscripciones.
 */
export async function comprarSuscripcionDesdeTienda(payload: {
  planSuscripcionId: string;
  metodoPago: MetodoPago;
  emailCliente: string;
}): Promise<{ suscripcionId: string; pedido: Pedido }> {
  // Simular delay de procesamiento
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Validaciones básicas
  if (!payload.planSuscripcionId || payload.planSuscripcionId.trim() === '') {
    throw new Error('El ID del plan de suscripción es obligatorio');
  }

  if (!payload.emailCliente || payload.emailCliente.trim() === '') {
    throw new Error('El email del cliente es obligatorio');
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(payload.emailCliente)) {
    throw new Error('El email proporcionado no es válido');
  }

  // Validar que el método de pago soporte cargos recurrentes
  const metodosSoportanRecurrente: MetodoPago[] = ['tarjeta', 'paypal'];
  const metodoPagoStr = payload.metodoPago as string;
  if (!metodosSoportanRecurrente.includes(metodoPagoStr as MetodoPago)) {
    throw new Error(
      `El método de pago "${metodoPagoStr}" no soporta cargos recurrentes. Use tarjeta o paypal.`
    );
  }

  // Crear un ID único para la suscripción
  const suscripcionId = `SUB-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

  // Crear un pedido mock asociado a la suscripción
  // NOTA: En producción, esto se obtendría del sistema de pedidos real
  const pedidoId = `pedido-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const numeroPedido = `PED-${Date.now().toString().slice(-6)}`;

  // Crear pedido simplificado para la respuesta
  // En producción, esto vendría del sistema de pedidos completo
  const pedido: Pedido = {
    id: pedidoId,
    numeroPedido,
    emailCliente: payload.emailCliente,
    items: [], // Items vacíos en esta implementación simplificada
    importeProductos: 0, // Se calcularía en producción
    impuestos: 0,
    gastosEnvio: 0,
    descuentosTotales: 0,
    importeTotal: 0, // Se calcularía en producción según el plan
    moneda: 'EUR',
    estado: 'pagado',
    metodoPago: payload.metodoPago,
    createdAt: new Date(),
    updatedAt: new Date(),
    notasOpcionales: `Suscripción: ${payload.planSuscripcionId}`,
  };

  // Crear suscripción básica en el sistema mock
  // NOTA: Esta es una estructura simplificada que se conectará con el sistema completo más adelante
  const nuevaSuscripcion: Suscripcion = {
    id: suscripcionId,
    ventaId: pedidoId,
    productoId: payload.planSuscripcionId, // El planSuscripcionId se usa como productoId temporalmente
    clienteId: `cliente-${payload.emailCliente.replace('@', '-').replace('.', '-')}`, // ID simplificado
    clienteEmail: payload.emailCliente,
    fechaInicio: new Date(),
    fechaProximoCargo: calcularFechaProximoCargo(new Date(), 'mensual'), // Por defecto mensual
    cicloFacturacion: 'mensual', // Por defecto mensual
    precio: 0, // Se calcularía en producción según el plan
    estado: 'activa',
    metodoPagoId: payload.metodoPago,
    cargoAutomatico: true,
  };

  // Guardar la suscripción en el mock storage
  suscripciones.push(nuevaSuscripcion);

  return {
    suscripcionId,
    pedido,
  };
}

/**
 * Obtiene todas las suscripciones compradas por un cliente desde la tienda
 * 
 * Esta función retorna un resumen simplificado de las suscripciones compradas
 * por un cliente específico, incluyendo el ID de la suscripción, el plan y el estado.
 * 
 * NOTA: Esta es una implementación mock simplificada. En producción, esto se integraría con:
 * - El sistema completo de suscripciones (src/features/suscripciones-cuotas-recurrentes)
 * - Para obtener información detallada de cada suscripción (sesiones, cuotas, etc.)
 * - Filtrado y ordenamiento avanzado
 * - Información adicional como fecha de renovación, historial de pagos, etc.
 * 
 * @param emailCliente - Email del cliente del cual obtener las suscripciones
 * @returns Array de objetos con información básica de cada suscripción
 * 
 * @example
 * ```ts
 * const suscripciones = await getSuscripcionesCompradasPorCliente('cliente@example.com');
 * // suscripciones = [
 * //   {
 * //     suscripcionId: 'SUB-123456789',
 * //     planSuscripcionId: 'plan-premium-pt',
 * //     estado: 'activa'
 * //   }
 * // ]
 * ```
 * 
 * @future-integration
 * Esta función se conectará en el futuro con:
 * - src/features/suscripciones-cuotas-recurrentes/api/suscripciones.ts
 * - Para obtener información completa de las suscripciones del cliente
 * - Incluir detalles como sesiones incluidas/usadas, próximas cuotas, historial, etc.
 * - Filtrar por estado, plan, rango de fechas, etc.
 * 
 * IMPORTANTE: Esta implementación actual retorna solo información básica
 * con IDs y estados simplificados que se pueden conectar más adelante.
 * No está acoplada a la implementación interna de la feature de Suscripciones.
 */
export async function getSuscripcionesCompradasPorCliente(
  emailCliente: string
): Promise<Array<{ suscripcionId: string; planSuscripcionId: string; estado: string }>> {
  // Simular delay de consulta
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Validación básica
  if (!emailCliente || emailCliente.trim() === '') {
    throw new Error('El email del cliente es obligatorio');
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailCliente)) {
    throw new Error('El email proporcionado no es válido');
  }

  // Buscar todas las suscripciones del cliente (sin filtrar por estado)
  const suscripcionesCliente = suscripciones.filter(
    (s) => s.clienteEmail.toLowerCase() === emailCliente.toLowerCase()
  );

  // Mapear a formato simplificado
  // NOTA: En producción, esto incluiría más información del plan
  return suscripcionesCliente.map((suscripcion) => ({
    suscripcionId: suscripcion.id,
    planSuscripcionId: suscripcion.productoId, // Usamos productoId como planSuscripcionId temporalmente
    estado: suscripcion.estado,
  }));
}

