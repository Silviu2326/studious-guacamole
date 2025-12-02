import { Receta } from '../types';
import { getRecetas, actualizarReceta } from './recetas';

const API_BASE = '/api/nutricion/recetas/favoritos';

export async function getRecetasFavoritas(): Promise<Receta[]> {
  try {
    // En producción: const response = await fetch(API_BASE);
    // return await response.json();
    
    const recetas = await getRecetas({ favoritas: true });
    return recetas;
  } catch (error) {
    console.error('Error obteniendo recetas favoritas:', error);
    throw error;
  }
}

export async function agregarFavorito(recetaId: string): Promise<boolean> {
  try {
    // En producción: const response = await fetch(API_BASE, { 
    //   method: 'POST', 
    //   body: JSON.stringify({ recetaId }) 
    // });
    
    await actualizarReceta(recetaId, { esFavorita: true });
    return true;
  } catch (error) {
    console.error('Error agregando favorito:', error);
    throw error;
  }
}

export async function eliminarFavorito(recetaId: string): Promise<boolean> {
  try {
    // En producción: const response = await fetch(`${API_BASE}/${recetaId}`, { method: 'DELETE' });
    
    await actualizarReceta(recetaId, { esFavorita: false });
    return true;
  } catch (error) {
    console.error('Error eliminando favorito:', error);
    throw error;
  }
}

export async function toggleFavorito(recetaId: string): Promise<boolean> {
  try {
    const { getReceta } = await import('./recetas');
    const receta = await getReceta(recetaId);
    if (!receta) return false;
    
    return await (receta.esFavorita 
      ? eliminarFavorito(recetaId) 
      : agregarFavorito(recetaId));
  } catch (error) {
    console.error('Error toggleando favorito:', error);
    throw error;
  }
}

