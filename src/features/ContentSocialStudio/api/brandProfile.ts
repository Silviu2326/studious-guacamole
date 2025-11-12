import type { BrandProfileConfig, Specialization, ToneOfVoice } from '../types';

// Mock storage - en producción vendría del backend
let brandProfileConfig: BrandProfileConfig | null = null;

/**
 * Obtiene la configuración del perfil de marca del entrenador
 */
export const getBrandProfileConfig = async (): Promise<BrandProfileConfig | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Mock data - en producción vendría del backend
  if (!brandProfileConfig) {
    return null;
  }

  return brandProfileConfig;
};

/**
 * Guarda o actualiza la configuración del perfil de marca
 */
export const saveBrandProfileConfig = async (
  config: Omit<BrandProfileConfig, 'trainerId' | 'updatedAt'>
): Promise<BrandProfileConfig> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const now = new Date().toISOString();
  const trainerId = 'trn_current'; // En producción vendría del contexto de autenticación

  brandProfileConfig = {
    ...config,
    trainerId,
    updatedAt: now,
  };

  return brandProfileConfig;
};

/**
 * Obtiene las especializaciones disponibles
 */
export const getAvailableSpecializations = (): Array<{ value: Specialization; label: string }> => {
  return [
    { value: 'hipertrofia', label: 'Hipertrofia' },
    { value: 'perdida-peso', label: 'Pérdida de peso' },
    { value: 'rehabilitacion', label: 'Rehabilitación' },
    { value: 'fuerza', label: 'Fuerza' },
    { value: 'resistencia', label: 'Resistencia' },
    { value: 'flexibilidad', label: 'Flexibilidad' },
    { value: 'funcional', label: 'Entrenamiento funcional' },
    { value: 'deportivo', label: 'Rendimiento deportivo' },
    { value: 'nutricion', label: 'Nutrición' },
    { value: 'bienestar-general', label: 'Bienestar general' },
  ];
};

/**
 * Obtiene los tonos de voz disponibles
 */
export const getAvailableTones = (): Array<{ value: ToneOfVoice; label: string; description: string }> => {
  return [
    { value: 'motivacional', label: 'Motivacional', description: 'Enérgico, inspirador y positivo' },
    { value: 'tecnico', label: 'Técnico', description: 'Preciso, basado en evidencia científica' },
    { value: 'cercano', label: 'Cercano', description: 'Amigable, empático y personal' },
    { value: 'profesional', label: 'Profesional', description: 'Formal, confiable y estructurado' },
    { value: 'energico', label: 'Enérgico', description: 'Dinámico, entusiasta y activo' },
    { value: 'empatico', label: 'Empático', description: 'Comprensivo, cálido y comprensivo' },
    { value: 'educativo', label: 'Educativo', description: 'Informativo, didáctico y claro' },
    { value: 'directo', label: 'Directo', description: 'Claro, conciso y al grano' },
  ];
};

