import type { CreativeVoiceConfig, CreativeTone, ThematicPillar } from '../types';

// Mock storage - en producción vendría del backend
let creativeVoiceConfig: CreativeVoiceConfig | null = null;

/**
 * Obtiene la configuración de voz creativa del entrenador
 */
export const getCreativeVoiceConfig = async (): Promise<CreativeVoiceConfig | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Mock data - en producción vendría del backend
  if (!creativeVoiceConfig) {
    return null;
  }

  return creativeVoiceConfig;
};

/**
 * Guarda o actualiza la configuración de voz creativa
 */
export const saveCreativeVoiceConfig = async (
  config: Omit<CreativeVoiceConfig, 'trainerId' | 'updatedAt'>
): Promise<CreativeVoiceConfig> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const now = new Date().toISOString();
  const trainerId = 'trn_current'; // En producción vendría del contexto de autenticación

  creativeVoiceConfig = {
    ...config,
    trainerId,
    updatedAt: now,
  };

  return creativeVoiceConfig;
};

/**
 * Obtiene los tonos creativos disponibles
 */
export const getAvailableCreativeTones = (): Array<{ value: CreativeTone; label: string; description: string }> => {
  return [
    { value: 'motivacional', label: 'Motivacional', description: 'Enérgico, inspirador y positivo' },
    { value: 'tecnico', label: 'Técnico', description: 'Preciso, basado en evidencia científica' },
    { value: 'cercano', label: 'Cercano', description: 'Amigable, empático y personal' },
    { value: 'profesional', label: 'Profesional', description: 'Formal, confiable y estructurado' },
    { value: 'energico', label: 'Enérgico', description: 'Dinámico, entusiasta y activo' },
    { value: 'empatico', label: 'Empático', description: 'Comprensivo, cálido y comprensivo' },
    { value: 'educativo', label: 'Educativo', description: 'Informativo, didáctico y claro' },
    { value: 'directo', label: 'Directo', description: 'Claro, conciso y al grano' },
    { value: 'humoristico', label: 'Humorístico', description: 'Divertido, ligero y entretenido' },
    { value: 'inspirador', label: 'Inspirador', description: 'Elevador, transformador y visionario' },
  ];
};

/**
 * Obtiene ejemplos de pilares temáticos sugeridos
 */
export const getSuggestedThematicPillars = (): Omit<ThematicPillar, 'id'>[] => {
  return [
    {
      name: 'Transformación Personal',
      description: 'Historias de cambio y superación personal',
      keywords: ['transformación', 'cambio', 'superación', 'progreso', 'resultados'],
      priority: 'high',
    },
    {
      name: 'Educación en Nutrición',
      description: 'Consejos y tips sobre alimentación saludable',
      keywords: ['nutrición', 'alimentación', 'dieta', 'saludable', 'macros'],
      priority: 'high',
    },
    {
      name: 'Técnicas de Entrenamiento',
      description: 'Ejercicios, rutinas y metodologías de entrenamiento',
      keywords: ['ejercicio', 'rutina', 'técnica', 'entrenamiento', 'fuerza'],
      priority: 'medium',
    },
    {
      name: 'Motivación y Mentalidad',
      description: 'Contenido para mantener la motivación y mentalidad positiva',
      keywords: ['motivación', 'mentalidad', 'disciplina', 'consistencia', 'hábitos'],
      priority: 'medium',
    },
    {
      name: 'Bienestar Integral',
      description: 'Salud física, mental y emocional',
      keywords: ['bienestar', 'salud', 'equilibrio', 'descanso', 'recuperación'],
      priority: 'low',
    },
  ];
};

