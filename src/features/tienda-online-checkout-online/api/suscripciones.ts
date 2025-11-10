import { Suscripcion } from '../types';

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

