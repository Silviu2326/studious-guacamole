import { Ejercicio, FiltrosEjercicios } from '../types';
import { ejerciciosMock, filtrarEjercicios } from '../data/ejerciciosMock';

// Función para obtener favoritos del localStorage
function obtenerFavoritosLocalStorage(): string[] {
  try {
    const favoritos = localStorage.getItem('biblioteca_ejercicios_favoritos');
    return favoritos ? JSON.parse(favoritos) : [];
  } catch {
    return [];
  }
}

// Función para actualizar el estado de favoritos en los ejercicios
function aplicarFavoritosLocalStorage(ejercicios: Ejercicio[]): Ejercicio[] {
  const favoritosIds = obtenerFavoritosLocalStorage();
  return ejercicios.map(ej => ({
    ...ej,
    esFavorito: favoritosIds.includes(ej.id)
  }));
}

export async function getEjercicios(filtros?: FiltrosEjercicios): Promise<Ejercicio[]> {
  try {
    // Simular un pequeño delay de red
    await new Promise(resolve => setTimeout(resolve, 300));

    // Obtener todos los ejercicios y aplicar favoritos
    let ejercicios = aplicarFavoritosLocalStorage([...ejerciciosMock]);

    // Aplicar filtros
    if (filtros) {
      ejercicios = filtrarEjercicios(ejercicios, {
        busqueda: filtros.busqueda,
        gruposMusculares: filtros.gruposMusculares,
        equipamiento: filtros.equipamiento,
        dificultad: filtros.dificultad,
        excluirLesiones: filtros.excluirLesiones,
        soloFavoritos: filtros.soloFavoritos,
        ordenarPor: filtros.ordenarPor,
        orden: filtros.orden
      });
    }

    return ejercicios;
  } catch (error) {
    console.error('Error fetching ejercicios:', error);
    return [];
  }
}

export async function getEjercicioPorId(id: string): Promise<Ejercicio | null> {
  try {
    // Simular un pequeño delay de red
    await new Promise(resolve => setTimeout(resolve, 200));

    const ejercicios = aplicarFavoritosLocalStorage(ejerciciosMock);
    const ejercicio = ejercicios.find(ej => ej.id === id);
    
    return ejercicio || null;
  } catch (error) {
    console.error('Error fetching ejercicio:', error);
    return null;
  }
}

export async function buscarEjercicios(termino: string): Promise<Ejercicio[]> {
  try {
    // Simular un pequeño delay de red
    await new Promise(resolve => setTimeout(resolve, 200));

    const ejercicios = aplicarFavoritosLocalStorage(ejerciciosMock);
    return filtrarEjercicios(ejercicios, { busqueda: termino });
  } catch (error) {
    console.error('Error searching ejercicios:', error);
    return [];
  }
}

export async function usarEjercicio(ejercicioId: string, contexto?: {
  programaId?: string;
  sesionId?: string;
  clienteId?: string;
}): Promise<boolean> {
  try {
    // Simular un pequeño delay de red
    await new Promise(resolve => setTimeout(resolve, 300));

    // Actualizar el contador de veces usado en localStorage
    const ejerciciosUsados = JSON.parse(
      localStorage.getItem('biblioteca_ejercicios_usados') || '{}'
    );
    ejerciciosUsados[ejercicioId] = (ejerciciosUsados[ejercicioId] || 0) + 1;
    localStorage.setItem('biblioteca_ejercicios_usados', JSON.stringify(ejerciciosUsados));

    // Simular éxito
    return true;
  } catch (error) {
    console.error('Error usando ejercicio:', error);
    return false;
  }
}

export async function getAnalyticsEjercicios(): Promise<{
  totalEjercicios: number;
  ejerciciosMasUsados: Array<{ ejercicio: Ejercicio; vecesUsado: number }>;
  gruposMuscularesPopulares: Array<{ grupo: string; cantidad: number }>;
  equipamientoMasUsado: Array<{ equipamiento: string; cantidad: number }>;
}> {
  try {
    // Simular un pequeño delay de red
    await new Promise(resolve => setTimeout(resolve, 200));

    const ejercicios = aplicarFavoritosLocalStorage(ejerciciosMock);
    const ejerciciosUsados = JSON.parse(
      localStorage.getItem('biblioteca_ejercicios_usados') || '{}'
    );

    // Ejercicios más usados
    const ejerciciosMasUsados = ejercicios
      .map(ej => ({
        ejercicio: ej,
        vecesUsado: ejerciciosUsados[ej.id] || ej.vecesUsado || 0
      }))
      .sort((a, b) => b.vecesUsado - a.vecesUsado)
      .slice(0, 5);

    // Grupos musculares populares
    const gruposCount: Record<string, number> = {};
    ejercicios.forEach(ej => {
      ej.grupoMuscular.forEach(grupo => {
        gruposCount[grupo] = (gruposCount[grupo] || 0) + (ejerciciosUsados[ej.id] || ej.vecesUsado || 0);
      });
    });
    const gruposMuscularesPopulares = Object.entries(gruposCount)
      .map(([grupo, cantidad]) => ({ grupo, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5);

    // Equipamiento más usado
    const equiposCount: Record<string, number> = {};
    ejercicios.forEach(ej => {
      ej.equipamiento.forEach(equipo => {
        equiposCount[equipo] = (equiposCount[equipo] || 0) + (ejerciciosUsados[ej.id] || ej.vecesUsado || 0);
      });
    });
    const equipamientoMasUsado = Object.entries(equiposCount)
      .map(([equipamiento, cantidad]) => ({ equipamiento, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5);

    return {
      totalEjercicios: ejercicios.length,
      ejerciciosMasUsados,
      gruposMuscularesPopulares,
      equipamientoMasUsado,
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return {
      totalEjercicios: 0,
      ejerciciosMasUsados: [],
      gruposMuscularesPopulares: [],
      equipamientoMasUsado: [],
    };
  }
}

