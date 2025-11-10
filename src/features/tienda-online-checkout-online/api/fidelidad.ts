import { DescuentoFidelidad } from '../types';
import { getVentas } from './ventas';

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

