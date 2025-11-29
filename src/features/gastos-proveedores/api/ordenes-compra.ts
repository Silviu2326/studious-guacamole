import { OrdenCompra, FiltroOrdenesCompra } from '../types';

// Simulación de datos para desarrollo
let ordenesMock: OrdenCompra[] = [
  {
    id: '1',
    numero: 'OC-2024-001',
    fecha: new Date('2024-01-15'),
    proveedorId: '2',
    proveedor: 'Suplementos Fitness Pro',
    items: [
      {
        id: '1',
        producto: 'Proteína en Polvo - 5kg',
        cantidad: 10,
        precioUnitario: 120000,
        subtotal: 1200000,
      },
    ],
    subtotal: 1200000,
    impuestos: 228000,
    total: 1428000,
    estado: 'recibida',
    fechaEntregaEsperada: new Date('2024-01-20'),
    fechaEntregaReal: new Date('2024-01-19'),
    metodoPago: 'transferencia',
    usuario: 'admin',
    fechaAprobacion: new Date('2024-01-15'),
  },
  {
    id: '2',
    numero: 'OC-2024-002',
    fecha: new Date('2024-01-20'),
    proveedorId: '3',
    proveedor: 'Mantenimiento Equipos GYM',
    items: [
      {
        id: '2',
        producto: 'Servicio Mantenimiento Preventivo',
        descripcion: 'Mantenimiento completo de 15 máquinas',
        cantidad: 1,
        precioUnitario: 800000,
        subtotal: 800000,
      },
    ],
    subtotal: 800000,
    impuestos: 0,
    total: 800000,
    estado: 'enviada',
    fechaEntregaEsperada: new Date('2024-01-25'),
    metodoPago: 'transferencia',
    usuario: 'admin',
  },
];

let contadorOrdenes = 3;

export const getOrdenesCompra = async (filtros?: FiltroOrdenesCompra): Promise<OrdenCompra[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let ordenes = [...ordenesMock];
  
  if (filtros) {
    if (filtros.fechaInicio) {
      ordenes = ordenes.filter(o => o.fecha >= filtros.fechaInicio!);
    }
    if (filtros.fechaFin) {
      ordenes = ordenes.filter(o => o.fecha <= filtros.fechaFin!);
    }
    if (filtros.proveedorId) {
      ordenes = ordenes.filter(o => o.proveedorId === filtros.proveedorId);
    }
    if (filtros.estado) {
      ordenes = ordenes.filter(o => o.estado === filtros.estado);
    }
    if (filtros.numero) {
      ordenes = ordenes.filter(o => o.numero.toLowerCase().includes(filtros.numero!.toLowerCase()));
    }
  }
  
  return ordenes.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
};

export const getOrdenCompra = async (id: string): Promise<OrdenCompra | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return ordenesMock.find(o => o.id === id) || null;
};

export const createOrdenCompra = async (orden: Omit<OrdenCompra, 'id' | 'numero'>): Promise<OrdenCompra> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const año = new Date().getFullYear();
  const numero = `OC-${año}-${String(contadorOrdenes).padStart(3, '0')}`;
  contadorOrdenes++;
  
  const nuevaOrden: OrdenCompra = {
    ...orden,
    id: Date.now().toString(),
    numero,
    estado: 'pendiente',
  };
  ordenesMock.push(nuevaOrden);
  return nuevaOrden;
};

export const updateOrdenCompra = async (id: string, updates: Partial<OrdenCompra>): Promise<OrdenCompra> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = ordenesMock.findIndex(o => o.id === id);
  if (index === -1) {
    throw new Error('Orden de compra no encontrada');
  }
  ordenesMock[index] = { ...ordenesMock[index], ...updates };
  return ordenesMock[index];
};

export const deleteOrdenCompra = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  ordenesMock = ordenesMock.filter(o => o.id !== id);
};

export const aprobarOrdenCompra = async (id: string): Promise<OrdenCompra> => {
  return updateOrdenCompra(id, {
    estado: 'aprobada',
    fechaAprobacion: new Date(),
  });
};

export const recibirOrdenCompra = async (id: string): Promise<OrdenCompra> => {
  return updateOrdenCompra(id, {
    estado: 'recibida',
    fechaEntregaReal: new Date(),
  });
};

export const pagarOrdenCompra = async (id: string): Promise<OrdenCompra> => {
  return updateOrdenCompra(id, {
    estado: 'pagada',
  });
};

