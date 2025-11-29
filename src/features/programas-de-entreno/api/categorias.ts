export interface Categoria {
  id: string;
  nombre: string;
  descripcion?: string;
  color?: string;
  icono?: string;
  tipo: 'personalizado' | 'grupal' | 'plan-sala';
}

// Mock data para desarrollo
const mockCategorias: Categoria[] = [
  {
    id: '1',
    nombre: 'Fuerza',
    descripcion: 'Entrenamientos enfocados en ganancia de fuerza',
    color: '#3b82f6',
    tipo: 'personalizado'
  },
  {
    id: '2',
    nombre: 'Hipertrofia',
    descripcion: 'Programas para crecimiento muscular',
    color: '#8b5cf6',
    tipo: 'personalizado'
  },
  {
    id: '3',
    nombre: 'Cardio',
    descripcion: 'Entrenamientos cardiovasculares',
    color: '#ef4444',
    tipo: 'personalizado'
  },
  {
    id: '4',
    nombre: 'Rehabilitación',
    descripcion: 'Programas terapéuticos y de recuperación',
    color: '#10b981',
    tipo: 'personalizado'
  },
  {
    id: '5',
    nombre: 'General',
    descripcion: 'Rutinas generales y completas',
    color: '#6b7280',
    tipo: 'personalizado'
  },
  {
    id: '6',
    nombre: 'Combat',
    descripcion: 'Boxeo, kickboxing y artes marciales',
    color: '#f59e0b',
    tipo: 'grupal'
  },
  {
    id: '7',
    nombre: 'Functional',
    descripcion: 'Entrenamiento funcional y movilidad',
    color: '#06b6d4',
    tipo: 'grupal'
  },
  {
    id: '8',
    nombre: 'Plan Sala',
    descripcion: 'Rutinas estándar para sala de máquinas',
    color: '#84cc16',
    tipo: 'plan-sala'
  }
];

let categoriasData = [...mockCategorias];

export async function getCategorias(tipo?: string): Promise<Categoria[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  if (tipo) {
    return categoriasData.filter(c => c.tipo === tipo);
  }
  
  return [...categoriasData];
}

export async function crearCategoria(data: Omit<Categoria, 'id'>): Promise<Categoria | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const nuevaCategoria: Categoria = {
    ...data,
    id: `cat-${Date.now()}`
  };
  
  categoriasData.push(nuevaCategoria);
  return nuevaCategoria;
}

export async function actualizarCategoria(id: string, data: Partial<Categoria>): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const index = categoriasData.findIndex(c => c.id === id);
  if (index === -1) return false;
  
  categoriasData[index] = {
    ...categoriasData[index],
    ...data
  };
  
  return true;
}

export async function eliminarCategoria(id: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 200));
  const index = categoriasData.findIndex(c => c.id === id);
  if (index === -1) return false;
  categoriasData.splice(index, 1);
  return true;
}

