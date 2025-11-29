import { Venta, Pedido, ItemCarrito } from '../types';

// Mock data para ventas
const VENTAS_MOCK: Venta[] = [
  {
    id: 'VENTA-1',
    fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    cliente: {
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
    },
    productos: [
      {
        producto: {
          id: '1',
          nombre: 'Plan Mensual de Entrenamiento',
          descripcion: '',
          precio: 89.99,
          categoria: 'Entrenamiento',
          tipo: 'servicio',
          disponible: true,
          rolPermitido: 'entrenador',
        },
        cantidad: 1,
        subtotal: 89.99,
      },
    ],
    subtotal: 89.99,
    impuestos: 18.90,
    total: 108.89,
    metodoPago: 'tarjeta',
    estado: 'completada',
    facturaId: 'FAC-1',
  },
  {
    id: 'VENTA-2',
    fecha: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    cliente: {
      nombre: 'María García',
      email: 'maria@example.com',
    },
    productos: [
      {
        producto: {
          id: '4',
          nombre: 'Camiseta Oficial del Gimnasio',
          descripcion: '',
          precio: 24.99,
          categoria: 'Merchandising',
          tipo: 'producto-fisico',
          disponible: true,
          rolPermitido: 'gimnasio',
        },
        cantidad: 2,
        subtotal: 49.98,
      },
    ],
    subtotal: 49.98,
    impuestos: 10.50,
    total: 60.48,
    metodoPago: 'paypal',
    estado: 'completada',
    facturaId: 'FAC-2',
    tracking: 'TRACK-123456',
  },
];

export async function getVentas(rol: 'entrenador' | 'gimnasio'): Promise<Venta[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  // Filtrar ventas según el rol
  return VENTAS_MOCK.filter((venta) => {
    const primerProducto = venta.productos[0]?.producto;
    if (!primerProducto) return false;

    if (rol === 'entrenador') {
      return primerProducto.rolPermitido === 'entrenador' || primerProducto.rolPermitido === 'ambos';
    } else {
      return primerProducto.rolPermitido === 'gimnasio' || primerProducto.rolPermitido === 'ambos';
    }
  });
}

export async function getVenta(id: string): Promise<Venta | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  return VENTAS_MOCK.find((v) => v.id === id) || null;
}

// Mock data para pedidos (historial de ventas)
const PEDIDOS_MOCK: Pedido[] = [
  {
    id: 'PED-001',
    numeroPedido: 'ORD-2024-001',
    clienteIdOpcional: 'cliente-1',
    emailCliente: 'juan@example.com',
    items: [
      {
        id: 'item-1',
        productoId: 'prod-1',
        nombreProducto: 'Plan Mensual de Entrenamiento',
        cantidad: 1,
        precioUnitario: 89.99,
        importeSubtotal: 89.99,
      },
      {
        id: 'item-2',
        productoId: 'prod-2',
        nombreProducto: 'Sesión Personalizada',
        cantidad: 2,
        precioUnitario: 45.00,
        importeSubtotal: 90.00,
      },
    ],
    importeProductos: 179.99,
    impuestos: 37.80,
    gastosEnvio: 0,
    descuentosTotales: 0,
    importeTotal: 217.79,
    moneda: 'EUR',
    estado: 'pagado',
    metodoPago: 'tarjeta',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'PED-002',
    numeroPedido: 'ORD-2024-002',
    clienteIdOpcional: 'cliente-2',
    emailCliente: 'maria@example.com',
    items: [
      {
        id: 'item-3',
        productoId: 'prod-3',
        nombreProducto: 'Camiseta Oficial del Gimnasio',
        cantidad: 2,
        precioUnitario: 24.99,
        importeSubtotal: 49.98,
      },
    ],
    importeProductos: 49.98,
    impuestos: 10.50,
    gastosEnvio: 5.00,
    descuentosTotales: 5.00,
    importeTotal: 60.48,
    moneda: 'EUR',
    estado: 'pagado',
    metodoPago: 'paypal',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'PED-003',
    numeroPedido: 'ORD-2024-003',
    clienteIdOpcional: 'cliente-1',
    emailCliente: 'juan@example.com',
    items: [
      {
        id: 'item-4',
        productoId: 'prod-1',
        nombreProducto: 'Plan Mensual de Entrenamiento',
        cantidad: 1,
        precioUnitario: 89.99,
        importeSubtotal: 89.99,
      },
    ],
    importeProductos: 89.99,
    impuestos: 18.90,
    gastosEnvio: 0,
    descuentosTotales: 10.00,
    importeTotal: 98.89,
    moneda: 'EUR',
    estado: 'pagado',
    metodoPago: 'tarjeta',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'PED-004',
    numeroPedido: 'ORD-2024-004',
    clienteIdOpcional: 'cliente-3',
    emailCliente: 'carlos@example.com',
    items: [
      {
        id: 'item-5',
        productoId: 'prod-4',
        nombreProducto: 'Bono 10 Sesiones',
        cantidad: 1,
        precioUnitario: 350.00,
        importeSubtotal: 350.00,
      },
    ],
    importeProductos: 350.00,
    impuestos: 73.50,
    gastosEnvio: 0,
    descuentosTotales: 0,
    importeTotal: 423.50,
    moneda: 'EUR',
    estado: 'pagado',
    metodoPago: 'transferencia',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'PED-005',
    numeroPedido: 'ORD-2024-005',
    clienteIdOpcional: 'cliente-4',
    emailCliente: 'ana@example.com',
    items: [
      {
        id: 'item-6',
        productoId: 'prod-2',
        nombreProducto: 'Sesión Personalizada',
        cantidad: 1,
        precioUnitario: 45.00,
        importeSubtotal: 45.00,
      },
    ],
    importeProductos: 45.00,
    impuestos: 9.45,
    gastosEnvio: 0,
    descuentosTotales: 0,
    importeTotal: 54.45,
    moneda: 'EUR',
    estado: 'pendiente_pago',
    metodoPago: 'tarjeta',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
];

/**
 * Obtiene el historial de ventas (pedidos) con filtros opcionales
 */
export async function getHistorialVentas(
  filtros?: { desde?: string; hasta?: string; productoId?: string }
): Promise<Pedido[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  let pedidos = [...PEDIDOS_MOCK];

  // Aplicar filtros
  if (filtros) {
    if (filtros.desde) {
      const fechaDesde = new Date(filtros.desde);
      pedidos = pedidos.filter((p) => p.createdAt >= fechaDesde);
    }

    if (filtros.hasta) {
      const fechaHasta = new Date(filtros.hasta);
      // Añadir un día completo para incluir todo el día hasta
      fechaHasta.setHours(23, 59, 59, 999);
      pedidos = pedidos.filter((p) => p.createdAt <= fechaHasta);
    }

    if (filtros.productoId) {
      pedidos = pedidos.filter((p) =>
        p.items.some((item) => item.productoId === filtros.productoId)
      );
    }
  }

  // Ordenar por fecha más reciente primero
  return pedidos.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

/**
 * Obtiene métricas de ventas para un período específico
 */
export async function getMetricasVentas(periodo: {
  desde: string;
  hasta: string;
}): Promise<{
  totalVentas: number;
  totalIngresos: number;
  ticketMedio: number;
  productosMasVendidos: Array<{ productoId: string; unidades: number }>;
}> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const fechaDesde = new Date(periodo.desde);
  const fechaHasta = new Date(periodo.hasta);
  fechaHasta.setHours(23, 59, 59, 999);

  // Filtrar pedidos pagados en el período
  const pedidosPeriodo = PEDIDOS_MOCK.filter(
    (p) =>
      p.estado === 'pagado' &&
      p.createdAt >= fechaDesde &&
      p.createdAt <= fechaHasta
  );

  // Calcular métricas
  const totalVentas = pedidosPeriodo.length;
  const totalIngresos = pedidosPeriodo.reduce(
    (sum, p) => sum + p.importeTotal,
    0
  );
  const ticketMedio = totalVentas > 0 ? totalIngresos / totalVentas : 0;

  // Calcular productos más vendidos
  const productosVendidos: Record<string, number> = {};
  pedidosPeriodo.forEach((pedido) => {
    pedido.items.forEach((item) => {
      if (!productosVendidos[item.productoId]) {
        productosVendidos[item.productoId] = 0;
      }
      productosVendidos[item.productoId] += item.cantidad;
    });
  });

  const productosMasVendidos = Object.entries(productosVendidos)
    .map(([productoId, unidades]) => ({ productoId, unidades }))
    .sort((a, b) => b.unidades - a.unidades);

  return {
    totalVentas,
    totalIngresos,
    ticketMedio,
    productosMasVendidos,
  };
}

