import { Bono } from '../../catalogo-planes/types';

// Mock data para bonos de clientes
const BONOS_MOCK: Bono[] = [
  {
    id: 'b1',
    planId: '2',
    clienteId: 'client_1',
    sesionesTotal: 5,
    sesionesUsadas: 2,
    sesionesRestantes: 3,
    fechaCompra: new Date('2024-01-20'),
    fechaVencimiento: new Date('2024-04-20'),
    estado: 'activo',
    precio: 225.00,
  },
  {
    id: 'b2',
    planId: '3',
    clienteId: 'client_1',
    sesionesTotal: 10,
    sesionesUsadas: 7,
    sesionesRestantes: 3,
    fechaCompra: new Date('2024-01-15'),
    fechaVencimiento: new Date('2024-07-15'),
    estado: 'activo',
    precio: 425.00,
  },
  {
    id: 'b3',
    planId: '2',
    clienteId: 'client_2',
    sesionesTotal: 5,
    sesionesUsadas: 0,
    sesionesRestantes: 5,
    fechaCompra: new Date('2024-02-01'),
    fechaVencimiento: new Date('2024-05-01'),
    estado: 'activo',
    precio: 225.00,
  },
  {
    id: 'b4',
    planId: '3',
    clienteId: 'client_3',
    sesionesTotal: 10,
    sesionesUsadas: 10,
    sesionesRestantes: 0,
    fechaCompra: new Date('2024-01-10'),
    fechaVencimiento: new Date('2024-04-10'),
    estado: 'agotado',
    precio: 425.00,
  },
  {
    id: 'b5',
    planId: '2',
    clienteId: 'client_4',
    sesionesTotal: 5,
    sesionesUsadas: 3,
    sesionesRestantes: 2,
    fechaCompra: new Date('2023-11-15'),
    fechaVencimiento: new Date('2024-02-15'),
    estado: 'vencido',
    precio: 225.00,
  },
];

export interface ClienteBonoInfo {
  clienteId: string;
  clienteNombre: string;
  clienteEmail: string;
  bonos: Bono[];
  totalSesiones: number;
  sesionesUsadas: number;
  sesionesRestantes: number;
}

export interface CreateBonoFromCheckoutRequest {
  clienteId: string;
  clienteNombre: string;
  clienteEmail: string;
  productoId: string;
  productoNombre: string;
  sesionesTotal: number;
  precio: number;
  fechaVencimiento: Date;
  ventaId: string;
}

/**
 * Obtiene todos los bonos de un cliente específico
 */
export async function getBonosByCliente(clienteId: string): Promise<Bono[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return BONOS_MOCK.filter((b) => b.clienteId === clienteId);
}

/**
 * Obtiene todos los bonos agrupados por cliente
 */
export async function getBonosByClientes(
  entrenadorId?: string
): Promise<ClienteBonoInfo[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  // Importar getClients para obtener información de clientes
  const { getClients } = await import('../../gestión-de-clientes/api/clients');
  const clientes = await getClients('entrenador', entrenadorId);

  // Agrupar bonos por cliente
  const bonosPorCliente = new Map<string, Bono[]>();
  BONOS_MOCK.forEach((bono) => {
    if (!bonosPorCliente.has(bono.clienteId)) {
      bonosPorCliente.set(bono.clienteId, []);
    }
    bonosPorCliente.get(bono.clienteId)!.push(bono);
  });

  // Crear array de ClienteBonoInfo
  const resultado: ClienteBonoInfo[] = [];
  bonosPorCliente.forEach((bonos, clienteId) => {
    const cliente = clientes.find((c) => c.id === clienteId);
    if (cliente) {
      const totalSesiones = bonos.reduce((sum, b) => sum + b.sesionesTotal, 0);
      const sesionesUsadas = bonos.reduce((sum, b) => sum + b.sesionesUsadas, 0);
      const sesionesRestantes = bonos.reduce(
        (sum, b) => sum + b.sesionesRestantes,
        0
      );

      resultado.push({
        clienteId,
        clienteNombre: cliente.name,
        clienteEmail: cliente.email,
        bonos,
        totalSesiones,
        sesionesUsadas,
        sesionesRestantes,
      });
    }
  });

  return resultado;
}

/**
 * Crea un nuevo bono desde el checkout
 */
export async function createBonoFromCheckout(
  request: CreateBonoFromCheckoutRequest
): Promise<Bono> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const nuevoBono: Bono = {
    id: `bono-${Date.now()}`,
    planId: request.productoId,
    clienteId: request.clienteId,
    sesionesTotal: request.sesionesTotal,
    sesionesUsadas: 0,
    sesionesRestantes: request.sesionesTotal,
    fechaCompra: new Date(),
    fechaVencimiento: request.fechaVencimiento,
    estado: 'activo',
    precio: request.precio,
  };

  BONOS_MOCK.push(nuevoBono);
  return nuevoBono;
}

/**
 * Obtiene un bono por ID
 */
export async function getBonoById(bonoId: string): Promise<Bono | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return BONOS_MOCK.find((b) => b.id === bonoId) || null;
}

/**
 * Actualiza las sesiones usadas de un bono
 */
export async function updateBonoSesiones(
  bonoId: string,
  sesionesUsadas: number
): Promise<Bono> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const bono = BONOS_MOCK.find((b) => b.id === bonoId);
  if (!bono) {
    throw new Error('Bono no encontrado');
  }

  bono.sesionesUsadas = sesionesUsadas;
  bono.sesionesRestantes = bono.sesionesTotal - sesionesUsadas;
  bono.estado =
    bono.sesionesRestantes === 0
      ? 'agotado'
      : new Date() > bono.fechaVencimiento
      ? 'vencido'
      : 'activo';

  return bono;
}

