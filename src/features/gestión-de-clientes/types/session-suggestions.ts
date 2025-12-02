/**
 * Tipos para el sistema de sugerencias automáticas de sesiones
 */

export interface SessionSuggestion {
  id: string;
  clienteId: string;
  entrenadorId: string;
  tipo: 'fuerza' | 'cardio' | 'hiit' | 'flexibilidad' | 'mixto' | 'recuperacion';
  nombre: string;
  descripcion: string;
  duracionMinutos: number;
  ejercicios: Array<{
    nombre: string;
    series?: number;
    repeticiones?: number;
    peso?: number;
    duracion?: number; // Para ejercicios de tiempo
    descanso?: number; // Segundos de descanso
    notas?: string;
  }>;
  razon: string; // Por qué se sugiere esta sesión
  prioridad: 'alta' | 'media' | 'baja';
  confianza: number; // Porcentaje de confianza en la sugerencia (0-100)
  factores: Array<{
    tipo: 'progreso' | 'descanso' | 'objetivo' | 'historial' | 'preferencias' | 'lesion';
    descripcion: string;
    impacto: 'alto' | 'medio' | 'bajo';
  }>;
  fechaSugerida: string; // Fecha recomendada para la sesión
  fechaCreacion: string;
  fechaExpiracion?: string;
  aceptada?: boolean;
  fechaAceptacion?: string;
  rechazada?: boolean;
  fechaRechazo?: string;
  sesionCreadaId?: string; // ID de la sesión creada a partir de esta sugerencia
}

export interface SessionSuggestionFactors {
  clienteId: string;
  ultimaSesion?: {
    fecha: string;
    tipo: string;
    ejercicios: string[];
    intensidad: number; // 1-10
  };
  historialReciente: Array<{
    fecha: string;
    tipo: string;
    completada: boolean;
  }>;
  progreso: {
    mejoraFuerza: number; // Porcentaje de mejora
    mejoraCardio: number;
    mejoraFlexibilidad: number;
    tendencia: 'mejorando' | 'estable' | 'empeorando';
  };
  objetivos: Array<{
    id: string;
    nombre: string;
    tipo: 'fuerza' | 'cardio' | 'flexibilidad' | 'perdida-peso' | 'ganancia-masa';
    prioridad: number;
    progreso: number; // 0-100
  }>;
  preferencias: {
    tiposPreferidos: string[];
    ejerciciosFavoritos: string[];
    ejerciciosEvitados: string[];
    horariosPreferidos: string[];
  };
  restricciones: {
    lesiones: Array<{
      tipo: string;
      severidad: 'leve' | 'moderada' | 'grave';
      fechaInicio: string;
      fechaFin?: string;
    }>;
    limitaciones: string[];
  };
  descanso: {
    diasDesdeUltimaSesion: number;
    fatigaEstimada: number; // 1-10
    necesitaRecuperacion: boolean;
  };
  frecuencia: {
    sesionesEstaSemana: number;
    sesionesObjetivoSemana: number;
    promedioSemanal: number;
  };
}

export interface SessionSuggestionConfig {
  entrenadorId: string;
  activarSugerenciasAutomaticas: boolean;
  frecuenciaSugerencias: 'diaria' | 'semanal' | 'manual';
  considerarProgreso: boolean;
  considerarDescanso: boolean;
  considerarObjetivos: boolean;
  considerarLesiones: boolean;
  considerarPreferencias: boolean;
  nivelVariedad: 'bajo' | 'medio' | 'alto'; // Qué tan variadas deben ser las sugerencias
  nivelProgresion: 'conservador' | 'moderado' | 'agresivo'; // Qué tan agresiva debe ser la progresión
}

export interface SessionSuggestionResponse {
  sugerencias: SessionSuggestion[];
  factores: SessionSuggestionFactors;
  configuracion: SessionSuggestionConfig;
  resumen: {
    totalSugerencias: number;
    prioridadAlta: number;
    prioridadMedia: number;
    prioridadBaja: number;
    proximaSugerencia?: SessionSuggestion;
  };
}

