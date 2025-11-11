import { Restricciones, SmartFillResult, SesionEntrenamiento } from '../../types/advanced';
import { EjercicioEnSesion } from '../../api/editor';

/**
 * Solver de restricciones: tiempo, material, nivel, molestias, objetivo
 * Crea una versión equivalente del día manteniendo estímulo (series efectivas, patrones)
 * sin romper la periodización
 */
export class SmartFillSolver {
  static resolver(
    sesionOriginal: SesionEntrenamiento,
    restricciones: Restricciones
  ): SmartFillResult {
    const ejerciciosModificados: EjercicioEnSesion[] = [];
    const cambios: string[] = [];
    let tiempoEstimado = 0;

    // Si hay restricción de tiempo, priorizar ejercicios compuestos
    if (restricciones.tiempoDisponible) {
      const tiempoDisponible = restricciones.tiempoDisponible;
      const ejerciciosOriginales = sesionOriginal.ejercicios || [];

      // Priorizar ejercicios compuestos
      const compuestos = ejerciciosOriginales.filter(ej =>
        ['sentadilla', 'prensa', 'peso muerto', 'press banca', 'remo', 'press hombro'].some(
          nombre => ej.ejercicio.nombre.toLowerCase().includes(nombre)
        )
      );
      const accesorios = ejerciciosOriginales.filter(ej => !compuestos.includes(ej));

      // Ajustar ejercicios según tiempo disponible
      let tiempoRestante = tiempoDisponible;
      const ejerciciosFinales: EjercicioEnSesion[] = [];

      // Incluir compuestos primero
      for (const compuesto of compuestos) {
        const tiempoEjercicio = this.calcularTiempoEjercicio(compuesto);
        if (tiempoRestante >= tiempoEjercicio) {
          ejerciciosFinales.push(compuesto);
          tiempoRestante -= tiempoEjercicio;
          tiempoEstimado += tiempoEjercicio;
        } else {
          // Reducir series del compuesto
          const ejercicioModificado = this.reducirSeries(compuesto, tiempoRestante);
          if (ejercicioModificado) {
            ejerciciosFinales.push(ejercicioModificado);
            cambios.push(`Reducidas series de ${compuesto.ejercicio.nombre} para ajustar tiempo`);
            tiempoEstimado += this.calcularTiempoEjercicio(ejercicioModificado);
          }
          break;
        }
      }

      // Agregar accesorios si hay tiempo
      for (const accesorio of accesorios) {
        const tiempoEjercicio = this.calcularTiempoEjercicio(accesorio);
        if (tiempoRestante >= tiempoEjercicio) {
          ejerciciosFinales.push(accesorio);
          tiempoRestante -= tiempoEjercicio;
          tiempoEstimado += tiempoEjercicio;
        }
      }

      ejerciciosModificados.push(...ejerciciosFinales);
      cambios.push(`Tiempo ajustado a ${tiempoDisponible} minutos`);
    }

    // Si hay restricción de material
    if (restricciones.materialDisponible && restricciones.materialDisponible.length > 0) {
      const materialDisponible = restricciones.materialDisponible.map(m => m.toLowerCase());
      
      ejerciciosModificados.forEach((ej, index) => {
        // Verificar si el ejercicio requiere material no disponible
        const requiereMaterial = this.requiereMaterial(ej.ejercicio.nombre);
        if (requiereMaterial && !materialDisponible.includes(requiereMaterial)) {
          // Buscar sustituto equivalente
          const sustituto = this.buscarSustituto(ej, materialDisponible);
          if (sustituto) {
            ejerciciosModificados[index] = sustituto;
            cambios.push(
              `${ej.ejercicio.nombre} reemplazado por ${sustituto.ejercicio.nombre} (material disponible)`
            );
          }
        }
      });
    }

    // Si hay molestias, buscar sustitutos seguros
    if (restricciones.molestias && restricciones.molestias.length > 0) {
      ejerciciosModificados.forEach((ej, index) => {
        const sustituto = this.buscarSustitutoPorLesion(ej, restricciones.molestias || []);
        if (sustituto) {
          ejerciciosModificados[index] = sustituto;
          cambios.push(
            `${ej.ejercicio.nombre} reemplazado por ${sustituto.ejercicio.nombre} (evitar molestias)`
          );
        }
      });
    }

    return {
      ejercicios: ejerciciosModificados.length > 0 ? ejerciciosModificados : sesionOriginal.ejercicios,
      cambios,
      estimadoTiempo: tiempoEstimado || this.calcularTiempoTotal(sesionOriginal.ejercicios),
    };
  }

  private static calcularTiempoEjercicio(ejercicio: EjercicioEnSesion): number {
    const tiempoPorSerie = 2; // minutos por serie
    const tiempoDescanso = ejercicio.series?.reduce((sum, s) => sum + (s.descanso || 0), 0) || 0;
    const tiempoTotal = (ejercicio.series?.length || 0) * tiempoPorSerie + tiempoDescanso / 60;
    return Math.round(tiempoTotal);
  }

  private static calcularTiempoTotal(ejercicios: EjercicioEnSesion[]): number {
    return ejercicios.reduce((sum, ej) => sum + this.calcularTiempoEjercicio(ej), 0);
  }

  private static reducirSeries(
    ejercicio: EjercicioEnSesion,
    tiempoDisponible: number
  ): EjercicioEnSesion | null {
    if (!ejercicio.series || ejercicio.series.length === 0) return null;

    const seriesNecesarias = Math.max(1, Math.floor(tiempoDisponible / 2));
    const seriesReducidas = ejercicio.series.slice(0, seriesNecesarias);

    return {
      ...ejercicio,
      series: seriesReducidas,
    };
  }

  private static requiereMaterial(nombreEjercicio: string): string | null {
    const nombre = nombreEjercicio.toLowerCase();
    if (nombre.includes('mancuerna') || nombre.includes('dumbbell')) return 'mancuernas';
    if (nombre.includes('barra') || nombre.includes('barbell')) return 'barra';
    if (nombre.includes('máquina') || nombre.includes('machine')) return 'maquinas';
    if (nombre.includes('bodyweight') || nombre.includes('peso corporal')) return 'bodyweight';
    return null;
  }

  private static buscarSustituto(
    ejercicio: EjercicioEnSesion,
    materialDisponible: string[]
  ): EjercicioEnSesion | null {
    // Catálogo básico de sustituciones
    const sustituciones: Record<string, { nombre: string; material: string }> = {
      'sentadilla': { nombre: 'Sentadilla con peso corporal', material: 'bodyweight' },
      'press banca': { nombre: 'Flexiones', material: 'bodyweight' },
      'remo': { nombre: 'Remo con mancuernas', material: 'mancuernas' },
    };

    const nombreEjercicio = ejercicio.ejercicio.nombre.toLowerCase();
    for (const [ejOriginal, sustituto] of Object.entries(sustituciones)) {
      if (nombreEjercicio.includes(ejOriginal) && materialDisponible.includes(sustituto.material)) {
        return {
          ...ejercicio,
          ejercicio: {
            ...ejercicio.ejercicio,
            nombre: sustituto.nombre,
          },
        };
      }
    }

    return null;
  }

  private static buscarSustitutoPorLesion(
    ejercicio: EjercicioEnSesion,
    molestias: string[]
  ): EjercicioEnSesion | null {
    const nombreEjercicio = ejercicio.ejercicio.nombre.toLowerCase();
    
    // Catálogo de sustituciones seguras por lesión
    const sustitucionesPorLesion: Record<string, Record<string, string>> = {
      'rodilla': {
        'sentadilla': 'Sentadilla en caja',
        'prensa': 'Extensión de rodilla isométrica',
      },
      'hombro': {
        'press': 'Press con inclinación',
        'press banca': 'Press con agarre neutro',
      },
      'espalda baja': {
        'peso muerto': 'Peso muerto rumano',
        'sentadilla': 'Sentadilla frontal',
      },
    };

    for (const lesion of molestias) {
      const lesionLower = lesion.toLowerCase();
      if (sustitucionesPorLesion[lesionLower]) {
        for (const [ejOriginal, sustituto] of Object.entries(sustitucionesPorLesion[lesionLower])) {
          if (nombreEjercicio.includes(ejOriginal)) {
            return {
              ...ejercicio,
              ejercicio: {
                ...ejercicio.ejercicio,
                nombre: sustituto,
              },
            };
          }
        }
      }
    }

    return null;
  }
}











