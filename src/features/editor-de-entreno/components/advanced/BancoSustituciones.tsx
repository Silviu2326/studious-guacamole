import { EjercicioEnSesion } from '../../api/editor';

export interface Sustitucion {
  ejercicioOriginal: string;
  patron: string;
  lesion?: string;
  sustitutos: Array<{
    nombre: string;
    razon: string;
    equipo?: string[];
  }>;
}

/**
 * Banco de sustituciones seguras por patrón/lesión (editable por el entrenador)
 */
export class BancoSustituciones {
  private static sustituciones: Sustitucion[] = [
    {
      ejercicioOriginal: 'Sentadilla barra',
      patron: 'rodilla',
      lesion: 'dolor anterior rodilla',
      sustitutos: [
        { nombre: 'Goblet squat', razon: 'Menor carga anterior', equipo: ['mancuernas'] },
        { nombre: 'Split-squat isométrico', razon: 'ROM controlado', equipo: ['bodyweight'] },
        { nombre: 'Box squat', razon: 'Profundidad controlada', equipo: ['barra', 'caja'] },
      ],
    },
    {
      ejercicioOriginal: 'Press banca barra',
      patron: 'empuje',
      lesion: 'dolor hombro',
      sustitutos: [
        { nombre: 'Press mancuernas neutro', razon: 'Menor estrés en hombro', equipo: ['mancuernas'] },
        { nombre: 'Floor press', razon: 'ROM limitado', equipo: ['barra'] },
        { nombre: 'Push-up con inclinación', razon: 'Sin carga externa', equipo: ['bodyweight'] },
      ],
    },
    {
      ejercicioOriginal: 'Sentadilla barra',
      patron: 'rodilla',
      sustitutos: [
        { nombre: 'Goblet squat', razon: 'Variante más segura', equipo: ['mancuernas'] },
        { nombre: 'Split-squat', razon: 'Unilateral', equipo: ['bodyweight', 'mancuernas'] },
      ],
    },
    {
      ejercicioOriginal: 'Press banca barra',
      patron: 'empuje',
      sustitutos: [
        { nombre: 'Press mancuernas', razon: 'Mayor libertad de movimiento', equipo: ['mancuernas'] },
        { nombre: 'Push-up', razon: 'Sin equipo', equipo: ['bodyweight'] },
      ],
    },
  ];

  static obtenerSustitutos(
    ejercicio: EjercicioEnSesion,
    lesion?: string,
    materialDisponible?: string[]
  ): Sustitucion['sustitutos'] {
    const nombreEj = ejercicio.ejercicio.nombre.toLowerCase();
    
    // Buscar sustituciones por nombre
    const sustitucion = this.sustituciones.find(
      s => nombreEj.includes(s.ejercicioOriginal.toLowerCase().split(' ')[0]) // Match parcial
    );

    if (!sustitucion) return [];

    // Filtrar por lesión si se especifica
    let sustitutos = sustitucion.sustitutos;
    if (lesion && sustitucion.lesion) {
      // Solo retornar si la lesión coincide
      if (lesion.toLowerCase().includes(sustitucion.lesion.toLowerCase())) {
        sustitutos = sustitucion.sustitutos;
      } else {
        return sustitucion.sustitutos.filter(s => !s.equipo || s.equipo.includes('bodyweight'));
      }
    }

    // Filtrar por material disponible
    if (materialDisponible && materialDisponible.length > 0) {
      sustitutos = sustitutos.filter(s => 
        !s.equipo || s.equipo.some(eq => materialDisponible.includes(eq))
      );
    }

    return sustitutos;
  }

  static agregarSustitucion(sustitucion: Sustitucion): void {
    this.sustituciones.push(sustitucion);
    // En producción, guardar en localStorage o API
    try {
      localStorage.setItem('banco-sustituciones', JSON.stringify(this.sustituciones));
    } catch (error) {
      console.warn('Error guardando sustituciones:', error);
    }
  }

  static obtenerTodasSustituciones(): Sustitucion[] {
    // Cargar desde localStorage si existe
    try {
      const stored = localStorage.getItem('banco-sustituciones');
      if (stored) {
        this.sustituciones = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando sustituciones:', error);
    }
    return this.sustituciones;
  }
}












