import { CategoriaNutricional } from '../types';

const API_BASE = '/api/nutricion/plantillas/categorias';

export interface CategoriaInfo {
  id: CategoriaNutricional;
  nombre: string;
  descripcion: string;
  icono?: string;
  color?: string;
}

const categoriasMock: CategoriaInfo[] = [
  {
    id: 'vegetariana',
    nombre: 'Vegetariana',
    descripcion: 'Planes sin carne ni pescado',
  },
  {
    id: 'vegana',
    nombre: 'Vegana',
    descripcion: 'Planes sin productos de origen animal',
  },
  {
    id: 'keto',
    nombre: 'Ketogénica',
    descripcion: 'Alta en grasas, baja en carbohidratos',
  },
  {
    id: 'paleo',
    nombre: 'Paleolítica',
    descripcion: 'Basada en alimentos naturales',
  },
  {
    id: 'mediterranea',
    nombre: 'Mediterránea',
    descripcion: 'Rica en frutas, verduras y grasas saludables',
  },
  {
    id: 'baja-carbohidratos',
    nombre: 'Baja en Carbohidratos',
    descripcion: 'Reducción controlada de carbohidratos',
  },
  {
    id: 'alta-proteina',
    nombre: 'Alta Proteína',
    descripcion: 'Optimizada para ganancia muscular',
  },
  {
    id: 'balanceada',
    nombre: 'Balanceada',
    descripcion: 'Equilibrio de todos los macronutrientes',
  },
  {
    id: 'personalizada',
    nombre: 'Personalizada',
    descripcion: 'Planes adaptados a necesidades específicas',
  },
];

export async function getCategorias(): Promise<CategoriaInfo[]> {
  await new Promise(resolve => setTimeout(resolve, 150));
  return categoriasMock;
}

export async function getCategoria(id: CategoriaNutricional): Promise<CategoriaInfo | null> {
  await new Promise(resolve => setTimeout(resolve, 150));
  return categoriasMock.find(c => c.id === id) || null;
}

