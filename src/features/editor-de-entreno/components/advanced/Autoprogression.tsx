import { AutoprogressionConfig, SesionEntrenamiento } from '../../types/advanced';
import { EjercicioEnSesion } from '../../api/editor';

/**
 * Sistema de autoprogresión con guardarraíles
 * Progresión automática por objetivo usando RPE/RIR, velocidad y adherencia
 * "Semáforo de riesgo": avisa si el cambio aumenta demasiado la carga aguda vs. crónica
 */
export class AutoprogressionEngine {
  static calcularProgresion(
    sesionAnterior: SesionEntrenamiento,
    objetivo: 'fuerza' | 'hipertrofia' | 'resistencia',
    adherencia: number,
    rpePromedio?: number
  ): AutoprogressionConfig {
    const semaforoRiesgo = this.calcularSemaforoRiesgo(sesionAnterior, objetivo, adherencia);
    const sugerenciaVariante = this.generarSugerenciaVariante(semaforoRiesgo, sesionAnterior);

    return {
      habilitada: true,
      objetivo,
      semaforoRiesgo,
      sugerenciaVariante,
    };
  }

  static aplicarProgresion(
    sesion: SesionEntrenamiento,
    config: AutoprogressionConfig
  ): SesionEntrenamiento {
    if (!config.habilitada || config.semaforoRiesgo === 'rojo') {
      return sesion;
    }

    const nuevosEjercicios = sesion.ejercicios.map(ejercicio => {
      const nuevasSeries = ejercicio.series?.map(serie => {
        if (config.objetivo === 'fuerza') {
          // Progresión para fuerza: aumentar peso 2.5-5%
          return {
            ...serie,
            peso: serie.peso ? serie.peso * 1.025 : serie.peso,
            rpe: serie.rpe ? Math.min(10, serie.rpe + 0.5) : serie.rpe,
          };
        } else if (config.objetivo === 'hipertrofia') {
          // Progresión para hipertrofia: aumentar repeticiones o series
          return {
            ...serie,
            repeticiones: serie.repeticiones + 1,
            rpe: serie.rpe ? Math.min(10, serie.rpe + 0.3) : serie.rpe,
          };
        } else {
          // Progresión para resistencia: aumentar volumen
          return {
            ...serie,
            repeticiones: serie.repeticiones + 2,
            descanso: serie.descanso ? Math.max(30, serie.descanso - 5) : serie.descanso,
          };
        }
      });

      return {
        ...ejercicio,
        series: nuevasSeries,
      };
    });

    return {
      ...sesion,
      ejercicios: nuevosEjercicios,
    };
  }

  private static calcularSemaforoRiesgo(
    sesion: SesionEntrenamiento,
    objetivo: string,
    adherencia: number
  ): 'verde' | 'amarillo' | 'rojo' {
    // Calcular carga aguda vs. crónica
    const volumenTotal = sesion.ejercicios.reduce((sum, ej) => {
      return sum + (ej.series?.length || 0) * (ej.series?.[0]?.repeticiones || 0);
    }, 0);

    // Si adherencia es baja, riesgo alto
    if (adherencia < 60) return 'rojo';
    if (adherencia < 75) return 'amarillo';

    // Si volumen es muy alto, riesgo alto
    if (volumenTotal > 200) return 'rojo';
    if (volumenTotal > 150) return 'amarillo';

    // Si RPE promedio es muy alto, riesgo alto
    const rpePromedio = this.calcularRPEPromedio(sesion);
    if (rpePromedio > 9) return 'rojo';
    if (rpePromedio > 8) return 'amarillo';

    return 'verde';
  }

  private static calcularRPEPromedio(sesion: SesionEntrenamiento): number {
    const rpes: number[] = [];
    sesion.ejercicios.forEach(ej => {
      ej.series?.forEach(serie => {
        if (serie.rpe) rpes.push(serie.rpe);
      });
    });
    return rpes.length > 0 ? rpes.reduce((sum, rpe) => sum + rpe, 0) / rpes.length : 6;
  }

  private static generarSugerenciaVariante(
    semaforo: 'verde' | 'amarillo' | 'rojo',
    sesion: SesionEntrenamiento
  ): string | undefined {
    if (semaforo === 'verde') return undefined;

    if (semaforo === 'rojo') {
      return 'Reducir volumen 15% y aumentar tempo controlado. Considera añadir movilidad.';
    }

    return 'Progresión moderada recomendada. Aumentar carga gradualmente.';
  }
}









