import { Ejercicio } from '../types';
import { ejerciciosMock } from '../data/ejerciciosMock';

// Obtener favoritos del localStorage
function obtenerFavoritosIds(): string[] {
  try {
    const favoritos = localStorage.getItem('biblioteca_ejercicios_favoritos');
    return favoritos ? JSON.parse(favoritos) : [];
  } catch {
    return [];
  }
}

// Guardar favoritos en localStorage
function guardarFavoritosIds(ids: string[]): void {
  try {
    localStorage.setItem('biblioteca_ejercicios_favoritos', JSON.stringify(ids));
  } catch (error) {
    console.error('Error guardando favoritos:', error);
  }
}

export async function getFavoritos(usuarioId?: string): Promise<Ejercicio[]> {
  try {
    // Simular un pequeño delay de red
    await new Promise(resolve => setTimeout(resolve, 200));

    const favoritosIds = obtenerFavoritosIds();
    const ejercicios = ejerciciosMock.filter(ej => favoritosIds.includes(ej.id));
    
    return ejercicios.map(ej => ({ ...ej, esFavorito: true }));
  } catch (error) {
    console.error('Error fetching favoritos:', error);
    return [];
  }
}

export async function agregarFavorito(ejercicioId: string, notas?: string): Promise<boolean> {
  try {
    // Simular un pequeño delay de red
    await new Promise(resolve => setTimeout(resolve, 200));

    const favoritosIds = obtenerFavoritosIds();
    if (!favoritosIds.includes(ejercicioId)) {
      favoritosIds.push(ejercicioId);
      guardarFavoritosIds(favoritosIds);
    }

    return true;
  } catch (error) {
    console.error('Error agregando favorito:', error);
    return false;
  }
}

export async function eliminarFavorito(ejercicioId: string): Promise<boolean> {
  try {
    // Simular un pequeño delay de red
    await new Promise(resolve => setTimeout(resolve, 200));

    const favoritosIds = obtenerFavoritosIds();
    const nuevosFavoritos = favoritosIds.filter(id => id !== ejercicioId);
    guardarFavoritosIds(nuevosFavoritos);

    return true;
  } catch (error) {
    console.error('Error eliminando favorito:', error);
    return false;
  }
}

export async function esFavorito(ejercicioId: string): Promise<boolean> {
  try {
    // Simular un pequeño delay de red
    await new Promise(resolve => setTimeout(resolve, 100));

    const favoritosIds = obtenerFavoritosIds();
    return favoritosIds.includes(ejercicioId);
  } catch (error) {
    console.error('Error verificando favorito:', error);
    return false;
  }
}

