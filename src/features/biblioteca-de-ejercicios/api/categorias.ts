import { Categoria, GrupoMuscular } from '../types';
import { ejerciciosMock } from '../data/ejerciciosMock';

const iconosPorGrupo: Record<string, string> = {
  'pecho': '💪',
  'espalda': '🔷',
  'hombros': '⚡',
  'brazos': '💥',
  'piernas': '🏃',
  'gluteos': '🔥',
  'core': '⚡',
  'cardio': '❤️',
  'full-body': '🌟'
};

export async function getCategorias(): Promise<Categoria[]> {
  try {
    // Simular un pequeño delay de red
    await new Promise(resolve => setTimeout(resolve, 200));

    // Contar ejercicios por grupo muscular
    const gruposCount: Record<string, number> = {};
    ejerciciosMock.forEach(ej => {
      ej.grupoMuscular.forEach(grupo => {
        gruposCount[grupo] = (gruposCount[grupo] || 0) + 1;
      });
    });

    // Crear categorías basadas en grupos musculares
    const categorias: Categoria[] = Object.entries(gruposCount).map(([grupo, cantidad]) => ({
      id: `cat-${grupo}`,
      nombre: grupo.charAt(0).toUpperCase() + grupo.slice(1),
      grupoMuscular: grupo as GrupoMuscular,
      icono: iconosPorGrupo[grupo] || '🎯',
      descripcion: `Ejercicios para desarrollar ${grupo}`,
      cantidadEjercicios: cantidad
    }));

    return categorias;
  } catch (error) {
    console.error('Error fetching categorias:', error);
    return [];
  }
}

export async function getCategoriaPorGrupoMuscular(grupo: GrupoMuscular): Promise<Categoria | null> {
  try {
    // Simular un pequeño delay de red
    await new Promise(resolve => setTimeout(resolve, 200));

    const ejerciciosEnGrupo = ejerciciosMock.filter(ej =>
      ej.grupoMuscular.includes(grupo)
    );

    if (ejerciciosEnGrupo.length === 0) {
      return null;
    }

    const categoria: Categoria = {
      id: `cat-${grupo}`,
      nombre: grupo.charAt(0).toUpperCase() + grupo.slice(1),
      grupoMuscular: grupo,
      icono: iconosPorGrupo[grupo] || '🎯',
      descripcion: `Ejercicios para desarrollar ${grupo}`,
      cantidadEjercicios: ejerciciosEnGrupo.length
    };

    return categoria;
  } catch (error) {
    console.error('Error fetching categoria:', error);
    return null;
  }
}

