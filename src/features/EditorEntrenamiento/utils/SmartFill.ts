import { Day, Exercise, Set } from '../types/training';

export interface Restricciones {
  tiempoDisponible?: number;
  materialDisponible?: string[];
  molestias?: string[];
}

export interface SmartFillResult {
  day: Day;
  cambios: string[];
  estimadoTiempo: number;
}

export class SmartFillSolver {
  static resolver(
    dayOriginal: Day,
    restricciones: Restricciones
  ): SmartFillResult {
    // Deep copy to avoid mutating original
    const newDay: Day = JSON.parse(JSON.stringify(dayOriginal));
    const cambios: string[] = [];
    let tiempoEstimado = 0;

    // 1. Time Constraint
    if (restricciones.tiempoDisponible) {
      let tiempoRestante = restricciones.tiempoDisponible;
      
      // Strategy: Iterate through blocks. Prioritize compounds.
      // Note: This simple strategy might be too aggressive per block, 
      // but ensures structure is kept.
      
      for (const block of newDay.blocks) {
        if (tiempoRestante <= 0 && block.type !== 'warmup') {
             // If no time left, empty non-warmup blocks? 
             // Or maybe we should have prioritized warmup?
             block.exercises = [];
             continue;
        }

        const exercises = block.exercises;
        const compuestos = exercises.filter(ej => this.esCompuesto(ej.name));
        const accesorios = exercises.filter(ej => !this.esCompuesto(ej.name));
        
        const newExercises: Exercise[] = [];
        
        // Function to try adding exercise
        const tryAdd = (ej: Exercise) => {
            const time = this.calcularTiempoEjercicio(ej);
            if (tiempoRestante >= time) {
                newExercises.push(ej);
                tiempoRestante -= time;
                tiempoEstimado += time;
                return true;
            } else {
                // Try reducing sets
                const reduced = this.reducirSeries(ej, tiempoRestante);
                if (reduced) {
                    newExercises.push(reduced);
                    const reducedTime = this.calcularTiempoEjercicio(reduced);
                    tiempoRestante -= reducedTime;
                    tiempoEstimado += reducedTime;
                    cambios.push(`Reducidas series de ${ej.name} (tiempo)`);
                    return true;
                }
            }
            return false;
        };

        // Prioritize compounds
        for (const comp of compuestos) {
            tryAdd(comp);
        }
        
        // Then accessories
        for (const acc of accesorios) {
            tryAdd(acc);
        }
        
        if (newExercises.length < exercises.length) {
             // If we removed exercises, log it (once per block to avoid clutter?)
             // Or maybe just generic log at end?
        }
        
        block.exercises = newExercises;
      }
      
      if (this.calcularTiempoTotalDay(dayOriginal) > restricciones.tiempoDisponible) {
          cambios.push(`Tiempo ajustado a ${restricciones.tiempoDisponible} min`);
      }
      
    } else {
      tiempoEstimado = this.calcularTiempoTotalDay(newDay);
    }

    // 2. Material Constraint
    if (restricciones.materialDisponible && restricciones.materialDisponible.length > 0) {
      const materialDisponible = restricciones.materialDisponible.map(m => m.toLowerCase());
      
      newDay.blocks.forEach(block => {
        block.exercises.forEach((ej, index) => {
          const requiere = this.requiereMaterial(ej.name);
          // If requires material AND that material is NOT in available list
          if (requiere && !materialDisponible.includes(requiere)) {
            const sustituto = this.buscarSustituto(ej, materialDisponible);
            if (sustituto) {
              block.exercises[index] = sustituto;
              cambios.push(`${ej.name} -> ${sustituto.name} (material)`);
            }
          }
        });
      });
    }

    // 3. Injuries Constraint
    if (restricciones.molestias && restricciones.molestias.length > 0) {
      newDay.blocks.forEach(block => {
        block.exercises.forEach((ej, index) => {
          const sustituto = this.buscarSustitutoPorLesion(ej, restricciones.molestias!);
          if (sustituto) {
            block.exercises[index] = sustituto;
            cambios.push(`${ej.name} -> ${sustituto.name} (lesión)`);
          }
        });
      });
    }

    return {
      day: newDay,
      cambios,
      estimadoTiempo: tiempoEstimado
    };
  }

  private static calcularTiempoEjercicio(ejercicio: Exercise): number {
    const tiempoPorSerie = 2; // minutos por serie (estimado)
    const series = ejercicio.sets || [];
    
    // Sum rests if available, otherwise estimate
    let totalSeconds = 0;
    series.forEach(s => {
        if (s.rest) totalSeconds += s.rest;
        else totalSeconds += 90; // default 90s rest
        totalSeconds += 45; // work time approx
    });
    
    // Return minutes
    return Math.round(totalSeconds / 60);
  }

  private static calcularTiempoTotalDay(day: Day): number {
    let total = 0;
    day.blocks.forEach(b => {
        b.exercises.forEach(e => {
            total += this.calcularTiempoEjercicio(e);
        });
    });
    return total;
  }

  private static esCompuesto(nombre: string): boolean {
      return ['sentadilla', 'prensa', 'peso muerto', 'press banca', 'remo', 'press hombro', 'dominadas', 'fondos'].some(
          n => nombre.toLowerCase().includes(n)
      );
  }

  private static reducirSeries(
    ejercicio: Exercise,
    tiempoDisponible: number
  ): Exercise | null {
    if (!ejercicio.sets || ejercicio.sets.length === 0) return null;

    // Calculate how many sets fit
    // Approx time per set = 2 min (120s)
    const timePerSet = 2; 
    const maxSets = Math.floor(tiempoDisponible / timePerSet);
    
    if (maxSets < 1) return null;
    
    if (maxSets >= ejercicio.sets.length) return ejercicio; // No reduction needed actually

    const seriesReducidas = ejercicio.sets.slice(0, maxSets);

    return {
      ...ejercicio,
      sets: seriesReducidas,
    };
  }

  private static requiereMaterial(nombreEjercicio: string): string | null {
    const nombre = nombreEjercicio.toLowerCase();
    if (nombre.includes('mancuerna') || nombre.includes('dumbbell')) return 'mancuernas';
    if (nombre.includes('barra') || nombre.includes('barbell')) return 'barra';
    if (nombre.includes('máquina') || nombre.includes('machine') || nombre.includes('polea')) return 'maquinas';
    if (nombre.includes('bodyweight') || nombre.includes('peso corporal')) return 'bodyweight';
    if (nombre.includes('kettlebell')) return 'kettlebell';
    if (nombre.includes('banda')) return 'bandas';
    return null;
  }

  private static buscarSustituto(
    ejercicio: Exercise,
    materialDisponible: string[]
  ): Exercise | null {
    const sustituciones: Record<string, { nombre: string; material: string }> = {
      'sentadilla': { nombre: 'Sentadilla con peso corporal', material: 'bodyweight' },
      'press banca': { nombre: 'Flexiones', material: 'bodyweight' },
      'remo': { nombre: 'Remo con mancuernas', material: 'mancuernas' },
      'peso muerto': { nombre: 'Puente de glúteo', material: 'bodyweight' },
      'press militar': { nombre: 'Flexiones pica', material: 'bodyweight' },
      'jalón': { nombre: 'Dominadas', material: 'bodyweight' },
    };

    const nombreEjercicio = ejercicio.name.toLowerCase();
    for (const [ejOriginal, sustituto] of Object.entries(sustituciones)) {
      if (nombreEjercicio.includes(ejOriginal) && materialDisponible.includes(sustituto.material)) {
        return {
          ...ejercicio,
          name: sustituto.nombre,
          // Could update tags or type here if needed
        };
      }
    }
    return null;
  }

  private static buscarSustitutoPorLesion(
    ejercicio: Exercise,
    molestias: string[]
  ): Exercise | null {
    const nombreEjercicio = ejercicio.name.toLowerCase();
    
    const sustitucionesPorLesion: Record<string, Record<string, string>> = {
      'rodilla': {
        'sentadilla': 'Sentadilla en caja',
        'prensa': 'Extensión de rodilla isométrica',
        'zancada': 'Puente de glúteo',
      },
      'hombro': {
        'press': 'Press con inclinación',
        'press banca': 'Press con agarre neutro',
        'fondos': 'Press banca cerrado',
      },
      'espalda baja': {
        'peso muerto': 'Peso muerto rumano',
        'sentadilla': 'Sentadilla frontal',
        'remo con barra': 'Remo en máquina',
      },
    };

    for (const lesion of molestias) {
      const lesionLower = lesion.toLowerCase();
      if (sustitucionesPorLesion[lesionLower]) {
        for (const [ejOriginal, sustituto] of Object.entries(sustitucionesPorLesion[lesionLower])) {
          if (nombreEjercicio.includes(ejOriginal)) {
            return {
              ...ejercicio,
              name: sustituto,
            };
          }
        }
      }
    }

    return null;
  }
}
