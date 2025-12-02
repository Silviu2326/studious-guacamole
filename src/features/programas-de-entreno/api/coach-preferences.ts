import type { PreferenciasCoachExcel, MetricasClave, FrecuenciaRevision, NivelDetalle } from '../types';

// Mock storage - en producción esto vendría de una API
let coachPreferences: PreferenciasCoachExcel | null = null;

const DEFAULT_METRICAS: MetricasClave = {
  volumen: true,
  intensidad: true,
  duracion: true,
  calorias: true,
  series: false,
  repeticiones: false,
  peso: false,
  rpe: false,
  frecuencia: true,
  adherencia: false,
  progreso: false,
};

/**
 * Obtiene las preferencias del coach para la vista Excel
 */
export async function obtenerPreferenciasCoach(coachId: string): Promise<PreferenciasCoachExcel | null> {
  // Intentar cargar desde localStorage primero
  try {
    const saved = localStorage.getItem(`coach_preferences_${coachId}`);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // Ignore errors
  }

  // Si no hay preferencias guardadas, retornar null (se mostrará el cuestionario)
  return coachPreferences;
}

/**
 * Guarda las preferencias del coach
 */
export async function guardarPreferenciasCoach(
  coachId: string,
  preferencias: Omit<PreferenciasCoachExcel, 'id' | 'coachId' | 'fechaCreacion' | 'fechaActualizacion'>
): Promise<PreferenciasCoachExcel> {
  const now = new Date().toISOString();
  
  const preferenciasCompletas: PreferenciasCoachExcel = {
    id: `pref_${Date.now()}`,
    coachId,
    ...preferencias,
    fechaCreacion: coachPreferences?.fechaCreacion || now,
    fechaActualizacion: now,
  };

  // Guardar en localStorage
  try {
    localStorage.setItem(`coach_preferences_${coachId}`, JSON.stringify(preferenciasCompletas));
  } catch {
    // Ignore errors
  }

  coachPreferences = preferenciasCompletas;
  return preferenciasCompletas;
}

/**
 * Verifica si el coach ya completó el cuestionario inicial
 */
export async function tienePreferenciasGuardadas(coachId: string): Promise<boolean> {
  try {
    const saved = localStorage.getItem(`coach_preferences_${coachId}`);
    return !!saved;
  } catch {
    return false;
  }
}

/**
 * Obtiene las métricas clave por defecto
 */
export function getDefaultMetricas(): MetricasClave {
  return { ...DEFAULT_METRICAS };
}

