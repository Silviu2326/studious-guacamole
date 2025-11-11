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

