import { Venta } from '../types';

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

