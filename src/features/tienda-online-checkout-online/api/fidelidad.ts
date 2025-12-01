import { DescuentoFidelidad } from '../types';
import { getVentas } from './ventas';

// Tipos adicionales para puntos de fidelidad
export interface PuntosCliente {
  puntosActuales: number;
  nivel: string;
}

export interface HistorialPuntos {
  fecha: string;
  cambio: number;
  motivo: string;
}

/**
 * Calcula el descuento de fidelidad para un cliente basándose en su historial de compras
 * @param email Email del cliente
 * @returns Descuento de fidelidad aplicable o null si no aplica
 */
export async function calcularDescuentoFidelidad(
  email: string
): Promise<DescuentoFidelidad | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  try {
    // Obtener todas las ventas (en producción esto se filtraría por entrenador/gimnasio)
    const ventas = await getVentas('entrenador');
    
    // Buscar ventas del cliente
    const ventasCliente = ventas.filter(
      (v) => v.cliente.email.toLowerCase() === email.toLowerCase()
    );
    
    if (ventasCliente.length === 0) {
      return null;
    }

    const numeroCompras = ventasCliente.length;
    let nivelFidelidad: 'nuevo' | 'recurrente' | 'vip' | 'premium';
    let porcentajeDescuento: number;
    let descripcion: string;

    // Definir niveles de fidelidad y descuentos
    if (numeroCompras >= 10) {
      nivelFidelidad = 'premium';
      porcentajeDescuento = 15;
      descripcion = 'Cliente Premium - 15% de descuento por fidelidad';
    } else if (numeroCompras >= 5) {
      nivelFidelidad = 'vip';
      porcentajeDescuento = 10;
      descripcion = 'Cliente VIP - 10% de descuento por fidelidad';
    } else if (numeroCompras >= 2) {
      nivelFidelidad = 'recurrente';
      porcentajeDescuento = 5;
      descripcion = 'Cliente Recurrente - 5% de descuento por fidelidad';
    } else {
      // Primera compra, no hay descuento
      return null;
    }

    return {
      porcentajeDescuento,
      descripcion,
      nivelFidelidad,
      numeroCompras,
    };
  } catch (error) {
    console.error('Error calculando descuento de fidelidad:', error);
    return null;
  }
}

// Mock data para puntos de fidelidad
const PUNTOS_CLIENTES_MOCK: Record<string, { puntos: number; nivel: string }> = {
  'cliente-1': { puntos: 1250, nivel: 'vip' },
  'cliente-2': { puntos: 450, nivel: 'recurrente' },
  'cliente-3': { puntos: 3200, nivel: 'premium' },
  'cliente-4': { puntos: 150, nivel: 'nuevo' },
};

const HISTORIAL_PUNTOS_MOCK: Record<string, HistorialPuntos[]> = {
  'cliente-1': [
    {
      fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      cambio: 100,
      motivo: 'Compra realizada - Plan Mensual de Entrenamiento',
    },
    {
      fecha: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      cambio: 50,
      motivo: 'Compra realizada - Sesión Personalizada',
    },
    {
      fecha: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      cambio: -200,
      motivo: 'Canje de puntos - Descuento aplicado',
    },
    {
      fecha: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      cambio: 100,
      motivo: 'Compra realizada - Plan Mensual de Entrenamiento',
    },
  ],
  'cliente-2': [
    {
      fecha: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      cambio: 50,
      motivo: 'Compra realizada - Camiseta Oficial',
    },
    {
      fecha: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      cambio: 100,
      motivo: 'Compra realizada - Plan Mensual',
    },
  ],
  'cliente-3': [
    {
      fecha: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      cambio: 350,
      motivo: 'Compra realizada - Bono 10 Sesiones',
    },
    {
      fecha: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      cambio: 200,
      motivo: 'Bono de bienvenida - Cliente Premium',
    },
  ],
  'cliente-4': [
    {
      fecha: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      cambio: 50,
      motivo: 'Compra realizada - Sesión Personalizada',
    },
    {
      fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      cambio: 100,
      motivo: 'Bono de bienvenida - Nuevo cliente',
    },
  ],
};

/**
 * Obtiene los puntos actuales y nivel de fidelidad de un cliente
 */
export async function getPuntosCliente(
  clienteId: string
): Promise<{ puntosActuales: number; nivel: string }> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const datosCliente = PUNTOS_CLIENTES_MOCK[clienteId];

  if (!datosCliente) {
    // Cliente nuevo sin puntos
    return {
      puntosActuales: 0,
      nivel: 'nuevo',
    };
  }

  return {
    puntosActuales: datosCliente.puntos,
    nivel: datosCliente.nivel,
  };
}

/**
 * Obtiene el historial de cambios de puntos de un cliente
 */
export async function getHistorialPuntos(
  clienteId: string
): Promise<Array<{ fecha: string; cambio: number; motivo: string }>> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const historial = HISTORIAL_PUNTOS_MOCK[clienteId] || [];

  // Ordenar por fecha más reciente primero
  return historial.sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );
}

