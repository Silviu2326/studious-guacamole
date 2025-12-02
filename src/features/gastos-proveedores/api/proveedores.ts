import { Proveedor, FiltroProveedores } from '../types';

// Simulación de datos para desarrollo
let proveedoresMock: Proveedor[] = [
  {
    id: '1',
    nombre: 'Proveedor Eléctrico S.A.',
    contacto: 'Juan Pérez',
    email: 'contacto@electrico-sa.com',
    telefono: '+57 300 123 4567',
    direccion: 'Calle 123 #45-67, Bogotá',
    tipo: 'servicios_generales',
    calificacion: 4.5,
    numeroOrdenes: 12,
    montoTotal: 5400000,
    fechaUltimaOrden: new Date('2024-01-15'),
    activo: true,
    categorias: ['Servicios Públicos'],
    condicionesPago: '30 días',
    descuentosAplicables: 5,
  },
  {
    id: '2',
    nombre: 'Suplementos Fitness Pro',
    contacto: 'María González',
    email: 'ventas@fitnesspro.com',
    telefono: '+57 300 987 6543',
    direccion: 'Av. Principal 789, Medellín',
    tipo: 'productos',
    calificacion: 4.8,
    numeroOrdenes: 8,
    montoTotal: 9600000,
    fechaUltimaOrden: new Date('2024-01-20'),
    activo: true,
    categorias: ['Suplementos', 'Productos Fitness'],
    condicionesPago: '15 días',
    descuentosAplicables: 10,
  },
  {
    id: '3',
    nombre: 'Mantenimiento Equipos GYM',
    contacto: 'Carlos Ramírez',
    email: 'servicio@mantenimiento-gym.com',
    telefono: '+57 300 555 1234',
    direccion: 'Carrera 10 #20-30, Cali',
    tipo: 'mantenimiento',
    calificacion: 4.2,
    numeroOrdenes: 15,
    montoTotal: 12000000,
    fechaUltimaOrden: new Date('2024-01-10'),
    activo: true,
    categorias: ['Mantenimiento', 'Reparaciones'],
    condicionesPago: 'Contra entrega',
    descuentosAplicables: 0,
  },
];

export const getProveedores = async (filtros?: FiltroProveedores): Promise<Proveedor[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let proveedores = [...proveedoresMock];
  
  if (filtros) {
    if (filtros.tipo) {
      proveedores = proveedores.filter(p => p.tipo === filtros.tipo);
    }
    if (filtros.calificacionMin) {
      proveedores = proveedores.filter(p => p.calificacion >= filtros.calificacionMin!);
    }
    if (filtros.activo !== undefined) {
      proveedores = proveedores.filter(p => p.activo === filtros.activo);
    }
    if (filtros.categoria) {
      proveedores = proveedores.filter(p => p.categorias.includes(filtros.categoria!));
    }
    if (filtros.busqueda) {
      const busqueda = filtros.busqueda.toLowerCase();
      proveedores = proveedores.filter(p =>
        p.nombre.toLowerCase().includes(busqueda) ||
        p.contacto.toLowerCase().includes(busqueda) ||
        p.email.toLowerCase().includes(busqueda)
      );
    }
  }
  
  return proveedores.sort((a, b) => b.calificacion - a.calificacion);
};

export const getProveedor = async (id: string): Promise<Proveedor | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return proveedoresMock.find(p => p.id === id) || null;
};

export const createProveedor = async (proveedor: Omit<Proveedor, 'id' | 'numeroOrdenes' | 'montoTotal' | 'fechaUltimaOrden'>): Promise<Proveedor> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const nuevoProveedor: Proveedor = {
    ...proveedor,
    id: Date.now().toString(),
    numeroOrdenes: 0,
    montoTotal: 0,
    activo: true,
  };
  proveedoresMock.push(nuevoProveedor);
  return nuevoProveedor;
};

export const updateProveedor = async (id: string, updates: Partial<Proveedor>): Promise<Proveedor> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = proveedoresMock.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error('Proveedor no encontrado');
  }
  proveedoresMock[index] = { ...proveedoresMock[index], ...updates };
  return proveedoresMock[index];
};

export const deleteProveedor = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  proveedoresMock = proveedoresMock.filter(p => p.id !== id);
};

