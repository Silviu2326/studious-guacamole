import { EnlacePagoDirecto, Producto, OpcionesSeleccionadas } from '../types';
import { getProducto } from './productos';

// Mock data para enlaces de pago
const ENLACES_PAGO_MOCK: EnlacePagoDirecto[] = [];

/**
 * Genera un token único para un enlace de pago
 */
function generarToken(): string {
  return `pay_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Crea un nuevo enlace de pago directo
 */
export async function crearEnlacePago(
  entrenadorId: string,
  productoId: string,
  opciones?: {
    cantidad?: number;
    opcionesSeleccionadas?: OpcionesSeleccionadas;
    descripcion?: string;
    fechaExpiracion?: Date;
    vecesMaximas?: number;
  }
): Promise<EnlacePagoDirecto> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const producto = await getProducto(productoId);
  if (!producto) {
    throw new Error('Producto no encontrado');
  }

  const token = generarToken();
  const baseUrl = window.location.origin;
  const url = `${baseUrl}/checkout/${token}`;

  const enlace: EnlacePagoDirecto = {
    id: `enlace_${Date.now()}`,
    token,
    entrenadorId,
    productoId,
    producto,
    cantidad: opciones?.cantidad || 1,
    opcionesSeleccionadas: opciones?.opcionesSeleccionadas,
    descripcion: opciones?.descripcion,
    fechaCreacion: new Date(),
    fechaExpiracion: opciones?.fechaExpiracion,
    activo: true,
    vecesUsado: 0,
    vecesMaximas: opciones?.vecesMaximas,
    url,
  };

  ENLACES_PAGO_MOCK.push(enlace);
  return enlace;
}

/**
 * Obtiene un enlace de pago por su token
 */
export async function getEnlacePagoPorToken(token: string): Promise<EnlacePagoDirecto | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const enlace = ENLACES_PAGO_MOCK.find((e) => e.token === token);
  
  if (!enlace) {
    return null;
  }

  // Verificar si está activo
  if (!enlace.activo) {
    return null;
  }

  // Verificar expiración
  if (enlace.fechaExpiracion && new Date() > enlace.fechaExpiracion) {
    return null;
  }

  // Verificar límite de usos
  if (enlace.vecesMaximas && enlace.vecesUsado >= enlace.vecesMaximas) {
    return null;
  }

  return enlace;
}

/**
 * Obtiene todos los enlaces de pago de un entrenador
 */
export async function getEnlacesPagoEntrenador(
  entrenadorId: string
): Promise<EnlacePagoDirecto[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return ENLACES_PAGO_MOCK.filter((e) => e.entrenadorId === entrenadorId);
}

/**
 * Incrementa el contador de usos de un enlace
 */
export async function incrementarUsoEnlace(token: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const enlace = ENLACES_PAGO_MOCK.find((e) => e.token === token);
  if (enlace) {
    enlace.vecesUsado += 1;
  }
}

/**
 * Desactiva un enlace de pago
 */
export async function desactivarEnlacePago(enlaceId: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const enlace = ENLACES_PAGO_MOCK.find((e) => e.id === enlaceId);
  if (enlace) {
    enlace.activo = false;
  }
}

/**
 * Elimina un enlace de pago
 */
export async function eliminarEnlacePago(enlaceId: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const index = ENLACES_PAGO_MOCK.findIndex((e) => e.id === enlaceId);
  if (index !== -1) {
    ENLACES_PAGO_MOCK.splice(index, 1);
  }
}

