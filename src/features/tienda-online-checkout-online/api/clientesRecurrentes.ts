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

// Mock data para clientes recurrentes
const CLIENTES_RECURRENTES_MOCK: Array<{
  clienteId: string;
  email: string;
  numeroPedidos: number;
  ultimoPedido: string;
  valorTotal: number;
}> = [
  {
    clienteId: 'cliente-1',
    email: 'juan@example.com',
    numeroPedidos: 8,
    ultimoPedido: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    valorTotal: 1250.50,
  },
  {
    clienteId: 'cliente-2',
    email: 'maria@example.com',
    numeroPedidos: 5,
    ultimoPedido: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    valorTotal: 680.25,
  },
  {
    clienteId: 'cliente-3',
    email: 'carlos@example.com',
    numeroPedidos: 12,
    ultimoPedido: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    valorTotal: 2450.75,
  },
  {
    clienteId: 'cliente-4',
    email: 'ana@example.com',
    numeroPedidos: 3,
    ultimoPedido: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    valorTotal: 320.00,
  },
  {
    clienteId: 'cliente-5',
    email: 'pedro@example.com',
    numeroPedidos: 15,
    ultimoPedido: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    valorTotal: 3890.50,
  },
  {
    clienteId: 'cliente-6',
    email: 'laura@example.com',
    numeroPedidos: 6,
    ultimoPedido: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    valorTotal: 890.00,
  },
  {
    clienteId: 'cliente-7',
    email: 'miguel@example.com',
    numeroPedidos: 4,
    ultimoPedido: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    valorTotal: 550.75,
  },
  {
    clienteId: 'cliente-8',
    email: 'sofia@example.com',
    numeroPedidos: 9,
    ultimoPedido: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    valorTotal: 1520.25,
  },
];

/**
 * Obtiene la lista de clientes recurrentes con sus estadísticas
 */
export async function getClientesRecurrentes(): Promise<
  Array<{
    clienteId: string;
    email: string;
    numeroPedidos: number;
    ultimoPedido: string;
    valorTotal: number;
  }>
> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Ordenar por valor total descendente (clientes más valiosos primero)
  return [...CLIENTES_RECURRENTES_MOCK].sort(
    (a, b) => b.valorTotal - a.valorTotal
  );
}

