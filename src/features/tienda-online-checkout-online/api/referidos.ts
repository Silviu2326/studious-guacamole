import { ValidacionCodigoReferido, Referido, ProgramaReferidos, Carrito } from '../types';

// Mock data para desarrollo
let mockProgramaReferidos: ProgramaReferidos | null = {
  id: 'prog-ref-1',
  entrenadorId: 'entrenador-1',
  activo: true,
  descuentoReferido: {
    tipo: 'porcentual',
    valor: 10, // 10% de descuento para el referido
  },
  descuentoReferente: {
    tipo: 'porcentual',
    valor: 15, // 15% de descuento para el referente en su próxima compra
  },
  fechaCreacion: new Date(),
  fechaActualizacion: new Date(),
};

const mockReferidos: Referido[] = [
  {
    id: 'ref-1',
    codigoReferido: 'JUAN123',
    referenteId: 'cliente-1',
    referenteEmail: 'juan@example.com',
    referenteNombre: 'Juan Pérez',
    estado: 'pendiente',
    fechaCreacion: new Date('2024-01-15'),
  },
];

/**
 * Obtener el programa de referidos activo
 */
export async function obtenerProgramaReferidos(entrenadorId: string): Promise<ProgramaReferidos | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  
  if (!mockProgramaReferidos || mockProgramaReferidos.entrenadorId !== entrenadorId) {
    return null;
  }
  
  return mockProgramaReferidos;
}

/**
 * Validar un código de referido
 */
export async function validarCodigoReferido(
  codigo: string,
  carrito: Carrito
): Promise<ValidacionCodigoReferido> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  // Buscar el referido por código
  const referido = mockReferidos.find((r) => r.codigoReferido.toUpperCase() === codigo.toUpperCase());
  
  if (!referido) {
    return {
      valido: false,
      error: 'Código de referido no válido',
    };
  }
  
  // Verificar que el programa esté activo
  if (!mockProgramaReferidos || !mockProgramaReferidos.activo) {
    return {
      valido: false,
      error: 'El programa de referidos no está activo',
    };
  }
  
  // Verificar que el referido no haya sido usado ya por este cliente
  // (en producción, verificaríamos por email del cliente actual)
  
  return {
    valido: true,
    codigo: referido.codigoReferido,
    referenteNombre: referido.referenteNombre,
    descuento: mockProgramaReferidos.descuentoReferido,
  };
}

/**
 * Registrar un referido cuando se completa una compra
 */
export async function registrarReferido(
  codigoReferido: string,
  referidoEmail: string,
  referidoNombre: string,
  ventaId: string,
  descuentoAplicado: number
): Promise<Referido> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  
  const referido = mockReferidos.find((r) => r.codigoReferido.toUpperCase() === codigoReferido.toUpperCase());
  
  if (!referido) {
    throw new Error('Código de referido no encontrado');
  }
  
  // Actualizar el referido con la información del nuevo cliente
  referido.referidoEmail = referidoEmail;
  referido.referidoNombre = referidoNombre;
  referido.ventaId = ventaId;
  referido.descuentoAplicadoReferido = descuentoAplicado;
  referido.estado = 'convertido';
  referido.fechaConversion = new Date();
  
  // Calcular descuento para el referente
  if (mockProgramaReferidos) {
    const subtotal = 100; // En producción, obtener del carrito de la venta
    if (mockProgramaReferidos.descuentoReferente.tipo === 'porcentual') {
      referido.descuentoAplicadoReferente = (subtotal * mockProgramaReferidos.descuentoReferente.valor) / 100;
    } else {
      referido.descuentoAplicadoReferente = mockProgramaReferidos.descuentoReferente.valor;
    }
  }
  
  return referido;
}

/**
 * Obtener referidos de un cliente (referente)
 */
export async function obtenerReferidosCliente(clienteId: string): Promise<Referido[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  
  return mockReferidos.filter((r) => r.referenteId === clienteId);
}

/**
 * Obtener estadísticas del programa de referidos
 */
export async function obtenerEstadisticasReferidos(entrenadorId: string): Promise<{
  totalReferidos: number;
  referidosConvertidos: number;
  tasaConversion: number;
  descuentosAplicados: number;
  ingresosGenerados: number;
}> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  const referidos = mockReferidos.filter((r) => {
    // En producción, filtrar por entrenadorId
    return true;
  });
  
  const convertidos = referidos.filter((r) => r.estado === 'convertido');
  const descuentosAplicados = referidos.reduce((sum, r) => sum + (r.descuentoAplicadoReferido || 0), 0);
  
  return {
    totalReferidos: referidos.length,
    referidosConvertidos: convertidos.length,
    tasaConversion: referidos.length > 0 ? (convertidos.length / referidos.length) * 100 : 0,
    descuentosAplicados,
    ingresosGenerados: 0, // En producción, calcular desde las ventas
  };
}

// Mock data adicional para resumen y detalle de referidos
const RESUMEN_REFERIDOS_MOCK: Record<string, {
  codigoReferido: string;
  referidosTotales: number;
  comprasReferidos: number;
  recompensasAcumuladas: number;
}> = {
  'cliente-1': {
    codigoReferido: 'JUAN123',
    referidosTotales: 5,
    comprasReferidos: 3,
    recompensasAcumuladas: 45.00,
  },
  'cliente-2': {
    codigoReferido: 'MARIA456',
    referidosTotales: 2,
    comprasReferidos: 1,
    recompensasAcumuladas: 15.00,
  },
  'cliente-3': {
    codigoReferido: 'CARLOS789',
    referidosTotales: 8,
    comprasReferidos: 6,
    recompensasAcumuladas: 120.00,
  },
};

const REFERIDOS_DETALLE_MOCK: Record<string, Array<{
  referidoEmail: string;
  fechaAlta: string;
  haComprado: boolean;
}>> = {
  'cliente-1': [
    {
      referidoEmail: 'pedro@example.com',
      fechaAlta: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      haComprado: true,
    },
    {
      referidoEmail: 'laura@example.com',
      fechaAlta: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      haComprado: true,
    },
    {
      referidoEmail: 'miguel@example.com',
      fechaAlta: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      haComprado: true,
    },
    {
      referidoEmail: 'sofia@example.com',
      fechaAlta: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      haComprado: false,
    },
    {
      referidoEmail: 'david@example.com',
      fechaAlta: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      haComprado: false,
    },
  ],
  'cliente-2': [
    {
      referidoEmail: 'ana@example.com',
      fechaAlta: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      haComprado: true,
    },
    {
      referidoEmail: 'luis@example.com',
      fechaAlta: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      haComprado: false,
    },
  ],
  'cliente-3': [
    {
      referidoEmail: 'jose@example.com',
      fechaAlta: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      haComprado: true,
    },
    {
      referidoEmail: 'carmen@example.com',
      fechaAlta: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
      haComprado: true,
    },
    {
      referidoEmail: 'pablo@example.com',
      fechaAlta: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
      haComprado: true,
    },
    {
      referidoEmail: 'elena@example.com',
      fechaAlta: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      haComprado: true,
    },
    {
      referidoEmail: 'roberto@example.com',
      fechaAlta: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
      haComprado: true,
    },
    {
      referidoEmail: 'isabel@example.com',
      fechaAlta: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
      haComprado: true,
    },
    {
      referidoEmail: 'fernando@example.com',
      fechaAlta: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      haComprado: false,
    },
    {
      referidoEmail: 'patricia@example.com',
      fechaAlta: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      haComprado: false,
    },
  ],
};

/**
 * Obtiene el resumen de referidos de un cliente
 */
export async function getResumenReferidos(
  clienteId: string
): Promise<{
  codigoReferido: string;
  referidosTotales: number;
  comprasReferidos: number;
  recompensasAcumuladas: number;
}> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const resumen = RESUMEN_REFERIDOS_MOCK[clienteId];

  if (!resumen) {
    // Cliente sin referidos
    const referido = mockReferidos.find((r) => r.referenteId === clienteId);
    return {
      codigoReferido: referido?.codigoReferido || 'N/A',
      referidosTotales: 0,
      comprasReferidos: 0,
      recompensasAcumuladas: 0,
    };
  }

  return resumen;
}

/**
 * Obtiene el detalle de referidos de un cliente
 */
export async function getReferidosDetalle(
  clienteId: string
): Promise<Array<{ referidoEmail: string; fechaAlta: string; haComprado: boolean }>> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const detalle = REFERIDOS_DETALLE_MOCK[clienteId] || [];

  // Ordenar por fecha de alta más reciente primero
  return detalle.sort(
    (a, b) => new Date(b.fechaAlta).getTime() - new Date(a.fechaAlta).getTime()
  );
}

