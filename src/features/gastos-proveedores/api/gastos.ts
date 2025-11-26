import { Gasto, FiltroGastos } from '../types';

// Simulación de datos para desarrollo
let gastosMock: Gasto[] = [
  {
    id: '1',
    fecha: new Date('2024-01-15'),
    proveedorId: '1',
    proveedor: 'Proveedor Eléctrico S.A.',
    categoria: 'Servicios Públicos',
    concepto: 'Factura de luz - Enero',
    monto: 450000,
    tipo: 'operativo',
    metodoPago: 'transferencia',
    estado: 'pagado',
    factura: 'FAC-2024-001',
    usuario: 'admin',
    fechaPago: new Date('2024-01-20'),
  },
  {
    id: '2',
    fecha: new Date('2024-01-20'),
    proveedorId: '2',
    proveedor: 'Suplementos Fitness Pro',
    categoria: 'Suplementos',
    concepto: 'Lote de proteína en polvo',
    monto: 1200000,
    tipo: 'operativo',
    metodoPago: 'tarjeta',
    estado: 'aprobado',
    factura: 'FAC-2024-002',
    usuario: 'admin',
    fechaAprobacion: new Date('2024-01-21'),
  },
  {
    id: '3',
    fecha: new Date('2024-01-10'),
    proveedorId: '3',
    proveedor: 'Mantenimiento Equipos GYM',
    categoria: 'Mantenimiento',
    concepto: 'Mantenimiento preventivo máquinas',
    monto: 800000,
    tipo: 'mantenimiento',
    metodoPago: 'transferencia',
    estado: 'pagado',
    factura: 'FAC-2024-003',
    usuario: 'admin',
    fechaPago: new Date('2024-01-12'),
  },
];

export const getGastos = async (filtros?: FiltroGastos): Promise<Gasto[]> => {
  // Simular llamada API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let gastos = [...gastosMock];
  
  if (filtros) {
    if (filtros.fechaInicio) {
      gastos = gastos.filter(g => g.fecha >= filtros.fechaInicio!);
    }
    if (filtros.fechaFin) {
      gastos = gastos.filter(g => g.fecha <= filtros.fechaFin!);
    }
    if (filtros.categoria) {
      gastos = gastos.filter(g => g.categoria === filtros.categoria);
    }
    if (filtros.tipo) {
      gastos = gastos.filter(g => g.tipo === filtros.tipo);
    }
    if (filtros.proveedorId) {
      gastos = gastos.filter(g => g.proveedorId === filtros.proveedorId);
    }
    if (filtros.estado) {
      gastos = gastos.filter(g => g.estado === filtros.estado);
    }
    if (filtros.montoMin) {
      gastos = gastos.filter(g => g.monto >= filtros.montoMin!);
    }
    if (filtros.montoMax) {
      gastos = gastos.filter(g => g.monto <= filtros.montoMax!);
    }
  }
  
  return gastos.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
};

export const getGasto = async (id: string): Promise<Gasto | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return gastosMock.find(g => g.id === id) || null;
};

export const createGasto = async (gasto: Omit<Gasto, 'id'>): Promise<Gasto> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const nuevoGasto: Gasto = {
    ...gasto,
    id: Date.now().toString(),
  };
  gastosMock.push(nuevoGasto);
  return nuevoGasto;
};

export const updateGasto = async (id: string, updates: Partial<Gasto>): Promise<Gasto> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = gastosMock.findIndex(g => g.id === id);
  if (index === -1) {
    throw new Error('Gasto no encontrado');
  }
  gastosMock[index] = { ...gastosMock[index], ...updates };
  return gastosMock[index];
};

export const deleteGasto = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  gastosMock = gastosMock.filter(g => g.id !== id);
};

export const aprobarGasto = async (id: string): Promise<Gasto> => {
  return updateGasto(id, {
    estado: 'aprobado',
    fechaAprobacion: new Date(),
  });
};

export const pagarGasto = async (id: string): Promise<Gasto> => {
  return updateGasto(id, {
    estado: 'pagado',
    fechaPago: new Date(),
  });
};

