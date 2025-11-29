import { Bono } from '../../catalogo-planes/types';
import { Bono as BonoCheckout } from '../types';

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

// ============================================================================
// API MOCK DE BONOS PARA CLIENTES FINALES (CHECKOUT)
// ============================================================================

// Mock data para bonos de checkout (tipo BonoCheckout)
interface BonoConCliente extends BonoCheckout {
  clienteIdOpcional?: string;
  empresaOpcional?: string;
  fechaCreacion?: Date;
}

const BONOS_CHECKOUT_MOCK: BonoConCliente[] = [
  {
    id: 'bono-checkout-1',
    codigo: 'BONO-ABC123',
    tipo: 'regalo',
    saldoInicial: 100,
    saldoRestante: 100,
    fechaCaducidadOpcional: new Date('2024-12-31'),
    esB2BOpcional: false,
    clienteIdOpcional: 'client_1',
    fechaCreacion: new Date('2024-01-15'),
  },
  {
    id: 'bono-checkout-2',
    codigo: 'BONO-XYZ789',
    tipo: 'prepago',
    saldoInicial: 250,
    saldoRestante: 150,
    fechaCaducidadOpcional: new Date('2024-11-30'),
    esB2BOpcional: false,
    clienteIdOpcional: 'client_1',
    fechaCreacion: new Date('2024-02-01'),
  },
  {
    id: 'bono-checkout-3',
    codigo: 'BONO-DEF456',
    tipo: 'regalo',
    saldoInicial: 50,
    saldoRestante: 0,
    fechaCaducidadOpcional: new Date('2024-10-15'),
    esB2BOpcional: false,
    clienteIdOpcional: 'client_2',
    fechaCreacion: new Date('2024-01-20'),
  },
  {
    id: 'bono-checkout-4',
    codigo: 'B2B-COMPANY1-001',
    tipo: 'regalo',
    saldoInicial: 500,
    saldoRestante: 500,
    fechaCaducidadOpcional: new Date('2025-06-30'),
    esB2BOpcional: true,
    empresaOpcional: 'Empresa ABC S.L.',
    fechaCreacion: new Date('2024-03-01'),
  },
  {
    id: 'bono-checkout-5',
    codigo: 'B2B-COMPANY1-002',
    tipo: 'regalo',
    saldoInicial: 500,
    saldoRestante: 200,
    fechaCaducidadOpcional: new Date('2025-06-30'),
    esB2BOpcional: true,
    empresaOpcional: 'Empresa ABC S.L.',
    fechaCreacion: new Date('2024-03-01'),
  },
];

/**
 * Crea un nuevo bono
 */
export async function crearBono(data: Omit<BonoCheckout, "id">): Promise<BonoCheckout> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Generar código único si no se proporciona
  let codigo = data.codigo;
  if (!codigo || codigo.trim() === '') {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9).toUpperCase();
    codigo = `BONO-${timestamp}-${random}`;
  }

  // Verificar que el código no exista
  const codigoExiste = BONOS_CHECKOUT_MOCK.some(b => b.codigo === codigo);
  if (codigoExiste) {
    throw new Error('El código del bono ya existe');
  }

  const nuevoBono: BonoConCliente = {
    id: `bono-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    codigo,
    tipo: data.tipo,
    saldoInicial: data.saldoInicial,
    saldoRestante: data.saldoRestante,
    fechaCaducidadOpcional: data.fechaCaducidadOpcional,
    esB2BOpcional: data.esB2BOpcional || false,
    fechaCreacion: new Date(),
  };

  BONOS_CHECKOUT_MOCK.push(nuevoBono);
  return nuevoBono;
}

/**
 * Obtiene todos los bonos de un cliente específico
 */
export async function getBonosCliente(clienteId: string): Promise<BonoCheckout[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return BONOS_CHECKOUT_MOCK
    .filter((b) => b.clienteIdOpcional === clienteId && !b.esB2BOpcional)
    .map(({ clienteIdOpcional, empresaOpcional, fechaCreacion, ...bono }) => bono);
}

/**
 * Canjea un bono aplicando un importe
 */
export async function canjearBono(
  codigo: string,
  importe: number
): Promise<{ bonoActualizado: BonoCheckout; importeCubierto: number; importeRestante: number }> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const bono = BONOS_CHECKOUT_MOCK.find((b) => b.codigo === codigo);
  
  if (!bono) {
    throw new Error('Bono no encontrado');
  }

  // Validar que el bono no esté vencido
  if (bono.fechaCaducidadOpcional && new Date() > bono.fechaCaducidadOpcional) {
    throw new Error('El bono ha caducado');
  }

  // Validar que tenga saldo suficiente
  if (bono.saldoRestante <= 0) {
    throw new Error('El bono no tiene saldo disponible');
  }

  // Calcular importe cubierto y restante
  const importeCubierto = Math.min(bono.saldoRestante, importe);
  const nuevoSaldoRestante = bono.saldoRestante - importeCubierto;
  const importeRestante = Math.max(0, importe - importeCubierto);

  // Actualizar el bono
  bono.saldoRestante = nuevoSaldoRestante;

  const bonoActualizado: BonoCheckout = {
    id: bono.id,
    codigo: bono.codigo,
    tipo: bono.tipo,
    saldoInicial: bono.saldoInicial,
    saldoRestante: bono.saldoRestante,
    fechaCaducidadOpcional: bono.fechaCaducidadOpcional,
    esB2BOpcional: bono.esB2BOpcional,
  };

  return {
    bonoActualizado,
    importeCubierto,
    importeRestante,
  };
}

/**
 * Valida un bono por su código
 */
export async function validarBono(codigo: string): Promise<BonoCheckout | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const bono = BONOS_CHECKOUT_MOCK.find((b) => b.codigo === codigo);
  
  if (!bono) {
    return null;
  }

  // Validar que no esté vencido
  if (bono.fechaCaducidadOpcional && new Date() > bono.fechaCaducidadOpcional) {
    return null;
  }

  // Validar que tenga saldo
  if (bono.saldoRestante <= 0) {
    return null;
  }

  return {
    id: bono.id,
    codigo: bono.codigo,
    tipo: bono.tipo,
    saldoInicial: bono.saldoInicial,
    saldoRestante: bono.saldoRestante,
    fechaCaducidadOpcional: bono.fechaCaducidadOpcional,
    esB2BOpcional: bono.esB2BOpcional,
  };
}

/**
 * Función auxiliar para obtener todos los bonos (para uso interno de otras APIs)
 */
export async function getAllBonosCheckout(): Promise<BonoConCliente[]> {
  return BONOS_CHECKOUT_MOCK;
}

