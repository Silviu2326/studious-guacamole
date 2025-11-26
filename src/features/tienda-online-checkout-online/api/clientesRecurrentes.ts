import { DatosCheckoutGuardados, Venta } from '../types';
import { getVentas } from './ventas';

/**
 * Obtiene los datos guardados de checkout para un cliente recurrente
 * basándose en su historial de compras
 */
export async function getDatosCheckoutGuardados(
  email: string
): Promise<DatosCheckoutGuardados | null> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  try {
    // Obtener todas las ventas (en producción esto se filtraría por entrenador/gimnasio)
    const ventas = await getVentas('entrenador');
    
    // Buscar ventas del cliente
    const ventasCliente = ventas.filter((v) => v.cliente.email.toLowerCase() === email.toLowerCase());
    
    if (ventasCliente.length === 0) {
      return null;
    }

    // Ordenar por fecha (más reciente primero)
    ventasCliente.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
    
    const ultimaVenta = ventasCliente[0];
    
    return {
      clienteEmail: email,
      nombre: ultimaVenta.cliente.nombre,
      telefono: '', // En producción se obtendría de la base de datos de clientes
      metodoPago: ultimaVenta.metodoPago,
      fechaUltimaCompra: ultimaVenta.fecha,
      numeroCompras: ventasCliente.length,
    };
  } catch (error) {
    console.error('Error obteniendo datos guardados:', error);
    return null;
  }
}

/**
 * Verifica si un cliente es recurrente (tiene al menos una compra previa)
 */
export async function esClienteRecurrente(email: string): Promise<boolean> {
  const datos = await getDatosCheckoutGuardados(email);
  return datos !== null && datos.numeroCompras > 0;
}

/**
 * Guarda los datos de checkout para un cliente (para futuras compras)
 */
export async function guardarDatosCheckout(
  email: string,
  datos: Omit<DatosCheckoutGuardados, 'clienteEmail' | 'fechaUltimaCompra' | 'numeroCompras'>
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  
  // En producción, esto guardaría en la base de datos
  // Por ahora solo simulamos el guardado
  console.log('Guardando datos de checkout para:', email, datos);
}

