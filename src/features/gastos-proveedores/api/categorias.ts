import { CategoriaGasto } from '../types';

// Simulación de datos para desarrollo
let categoriasMock: CategoriaGasto[] = [
  {
    id: '1',
    nombre: 'Servicios Públicos',
    tipo: 'operativo',
    descripcion: 'Luz, agua, gas, internet',
    presupuestoMensual: 500000,
    color: '#3B82F6',
    icono: 'Zap',
    activa: true,
  },
  {
    id: '2',
    nombre: 'Suplementos',
    tipo: 'operativo',
    descripcion: 'Proteínas, vitaminas, etc.',
    presupuestoMensual: 2000000,
    color: '#10B981',
    icono: 'Package',
    activa: true,
  },
  {
    id: '3',
    nombre: 'Mantenimiento',
    tipo: 'mantenimiento',
    descripcion: 'Mantenimiento de máquinas y equipos',
    presupuestoMensual: 1500000,
    color: '#F59E0B',
    icono: 'Wrench',
    activa: true,
  },
  {
    id: '4',
    nombre: 'Nóminas Externas',
    tipo: 'operativo',
    descripcion: 'Limpieza, seguridad, etc.',
    presupuestoMensual: 3000000,
    color: '#8B5CF6',
    icono: 'Users',
    activa: true,
  },
  {
    id: '5',
    nombre: 'Equipos Nuevos',
    tipo: 'inversion',
    descripcion: 'Compra de nuevos equipos',
    presupuestoMensual: 5000000,
    color: '#EF4444',
    icono: 'Dumbbell',
    activa: true,
  },
];

export const getCategorias = async (): Promise<CategoriaGasto[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...categoriasMock].filter(c => c.activa);
};

export const getCategoria = async (id: string): Promise<CategoriaGasto | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return categoriasMock.find(c => c.id === id) || null;
};

export const createCategoria = async (categoria: Omit<CategoriaGasto, 'id'>): Promise<CategoriaGasto> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const nuevaCategoria: CategoriaGasto = {
    ...categoria,
    id: Date.now().toString(),
    activa: true,
  };
  categoriasMock.push(nuevaCategoria);
  return nuevaCategoria;
};

export const updateCategoria = async (id: string, updates: Partial<CategoriaGasto>): Promise<CategoriaGasto> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = categoriasMock.findIndex(c => c.id === id);
  if (index === -1) {
    throw new Error('Categoría no encontrada');
  }
  categoriasMock[index] = { ...categoriasMock[index], ...updates };
  return categoriasMock[index];
};

export const deleteCategoria = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const index = categoriasMock.findIndex(c => c.id === id);
  if (index !== -1) {
    categoriasMock[index].activa = false;
  }
};

