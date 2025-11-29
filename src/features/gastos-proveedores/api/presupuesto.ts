import { Presupuesto } from '../types';

// Simulación de datos para desarrollo
let presupuestosMock: Presupuesto[] = [
  {
    id: '1',
    periodo: 'mensual',
    año: 2024,
    mes: 1,
    categoriaId: '1',
    categoria: 'Servicios Públicos',
    montoAsignado: 500000,
    montoGastado: 450000,
    montoDisponible: 50000,
    porcentajeUsado: 90,
    alertas: true,
    limiteAlerta: 80,
  },
  {
    id: '2',
    periodo: 'mensual',
    año: 2024,
    mes: 1,
    categoriaId: '2',
    categoria: 'Suplementos',
    montoAsignado: 2000000,
    montoGastado: 1200000,
    montoDisponible: 800000,
    porcentajeUsado: 60,
    alertas: false,
    limiteAlerta: 80,
  },
  {
    id: '3',
    periodo: 'mensual',
    año: 2024,
    mes: 1,
    categoriaId: '3',
    categoria: 'Mantenimiento',
    montoAsignado: 1500000,
    montoGastado: 800000,
    montoDisponible: 700000,
    porcentajeUsado: 53.33,
    alertas: false,
    limiteAlerta: 80,
  },
  {
    id: '4',
    periodo: 'mensual',
    año: 2024,
    mes: 1,
    categoriaId: '4',
    categoria: 'Nóminas Externas',
    montoAsignado: 3000000,
    montoGastado: 3000000,
    montoDisponible: 0,
    porcentajeUsado: 100,
    alertas: true,
    limiteAlerta: 80,
  },
];

export const getPresupuestos = async (año?: number, mes?: number): Promise<Presupuesto[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  let presupuestos = [...presupuestosMock];
  
  if (año !== undefined) {
    presupuestos = presupuestos.filter(p => p.año === año);
  }
  if (mes !== undefined) {
    presupuestos = presupuestos.filter(p => p.mes === mes);
  }
  
  return presupuestos;
};

export const getPresupuesto = async (id: string): Promise<Presupuesto | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return presupuestosMock.find(p => p.id === id) || null;
};

export const getPresupuestoByCategoria = async (categoriaId: string, año: number, mes?: number): Promise<Presupuesto | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  let presupuestos = presupuestosMock.filter(p => p.categoriaId === categoriaId && p.año === año);
  if (mes !== undefined) {
    presupuestos = presupuestos.filter(p => p.mes === mes);
  }
  return presupuestos[0] || null;
};

export const createPresupuesto = async (presupuesto: Omit<Presupuesto, 'id' | 'montoDisponible' | 'porcentajeUsado'>): Promise<Presupuesto> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const montoDisponible = presupuesto.montoAsignado - presupuesto.montoGastado;
  const porcentajeUsado = (presupuesto.montoGastado / presupuesto.montoAsignado) * 100;
  
  const nuevoPresupuesto: Presupuesto = {
    ...presupuesto,
    id: Date.now().toString(),
    montoDisponible,
    porcentajeUsado,
  };
  presupuestosMock.push(nuevoPresupuesto);
  return nuevoPresupuesto;
};

export const updatePresupuesto = async (id: string, updates: Partial<Presupuesto>): Promise<Presupuesto> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = presupuestosMock.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error('Presupuesto no encontrado');
  }
  
  const presupuestoActualizado = { ...presupuestosMock[index], ...updates };
  
  // Recalcular monto disponible y porcentaje usado si cambió monto asignado o gastado
  if (updates.montoAsignado !== undefined || updates.montoGastado !== undefined) {
    const montoAsignado = updates.montoAsignado ?? presupuestoActualizado.montoAsignado;
    const montoGastado = updates.montoGastado ?? presupuestoActualizado.montoGastado;
    presupuestoActualizado.montoDisponible = montoAsignado - montoGastado;
    presupuestoActualizado.porcentajeUsado = (montoGastado / montoAsignado) * 100;
  }
  
  presupuestosMock[index] = presupuestoActualizado;
  return presupuestoActualizado;
};

export const deletePresupuesto = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  presupuestosMock = presupuestosMock.filter(p => p.id !== id);
};

