import { CategoriaReceta } from '../types';

const API_BASE = '/api/nutricion/recetas/categorias';

const categoriasMock: CategoriaReceta[] = [
  'desayuno',
  'almuerzo',
  'cena',
  'snack',
  'postre',
  'bebida',
  'smoothie',
  'ensalada',
  'sopa',
  'plato-principal',
  'acompanamiento',
  'personalizada',
];

export async function getCategorias(): Promise<CategoriaReceta[]> {
  try {
    // En producción: const response = await fetch(API_BASE);
    // return await response.json();
    
    return categoriasMock;
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    throw error;
  }
}

export async function getEstadisticasCategoria(): Promise<Record<CategoriaReceta, number>> {
  try {
    // En producción: const response = await fetch(`${API_BASE}/estadisticas`);
    
    const stats: Record<string, number> = {
      'desayuno': 12,
      'almuerzo': 15,
      'cena': 10,
      'snack': 8,
      'postre': 5,
      'bebida': 4,
      'smoothie': 6,
      'ensalada': 9,
      'sopa': 7,
      'plato-principal': 14,
      'acompanamiento': 6,
      'personalizada': 3,
    };
    
    return stats as Record<CategoriaReceta, number>;
  } catch (error) {
    console.error('Error obteniendo estadísticas de categorías:', error);
    throw error;
  }
}

