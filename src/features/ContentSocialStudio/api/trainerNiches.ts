import type { TrainerNichesConfig, TrainerNiche, NicheAngle } from '../types';

// Mock storage - en producción vendría del backend
let trainerNichesConfig: TrainerNichesConfig | null = null;

/**
 * Obtiene la configuración de nichos del entrenador
 */
export const getTrainerNichesConfig = async (): Promise<TrainerNichesConfig | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Mock data - en producción vendría del backend
  if (!trainerNichesConfig) {
    return null;
  }

  return trainerNichesConfig;
};

/**
 * Guarda o actualiza la configuración de nichos
 */
export const saveTrainerNichesConfig = async (
  config: Omit<TrainerNichesConfig, 'trainerId' | 'updatedAt'>
): Promise<TrainerNichesConfig> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const now = new Date().toISOString();
  const trainerId = 'trn_current'; // En producción vendría del contexto de autenticación

  trainerNichesConfig = {
    ...config,
    trainerId,
    updatedAt: now,
  };

  return trainerNichesConfig;
};

/**
 * Obtiene los nichos disponibles
 */
export const getAvailableNiches = (): Array<{ value: TrainerNiche; label: string; description: string }> => {
  return [
    { 
      value: 'ejecutivos', 
      label: 'Ejecutivos', 
      description: 'Profesionales con poco tiempo, alto estrés, necesitan eficiencia' 
    },
    { 
      value: 'postparto', 
      label: 'Postparto', 
      description: 'Mujeres recuperándose del embarazo, enfoque en recuperación y bienestar' 
    },
    { 
      value: 'alto-rendimiento', 
      label: 'Alto Rendimiento', 
      description: 'Atletas y deportistas que buscan optimizar su rendimiento' 
    },
    { 
      value: 'rehabilitacion', 
      label: 'Rehabilitación', 
      description: 'Personas recuperándose de lesiones o cirugías' 
    },
    { 
      value: 'perdida-peso', 
      label: 'Pérdida de Peso', 
      description: 'Enfoque en pérdida de grasa y transformación corporal' 
    },
    { 
      value: 'ganancia-masa', 
      label: 'Ganancia de Masa', 
      description: 'Hipertrofia y construcción muscular' 
    },
    { 
      value: 'bienestar-general', 
      label: 'Bienestar General', 
      description: 'Enfoque holístico en salud y bienestar integral' 
    },
    { 
      value: 'deportistas-amateur', 
      label: 'Deportistas Amateur', 
      description: 'Personas que practican deporte como hobby o pasión' 
    },
  ];
};

/**
 * Genera ángulos adaptados para un nicho específico
 */
export const generateNicheAngles = (niche: TrainerNiche): NicheAngle => {
  const anglesMap: Record<TrainerNiche, NicheAngle> = {
    'ejecutivos': {
      niche: 'ejecutivos',
      angles: [
        'Entrenamientos de 30 minutos para ejecutivos ocupados',
        'Gestión del estrés a través del ejercicio',
        'Productividad y energía para reuniones',
        'Rutinas que se adaptan a viajes de trabajo',
      ],
      keywords: ['ejecutivos', 'productividad', 'estrés', 'tiempo limitado', 'eficiencia'],
      painPoints: ['Falta de tiempo', 'Estrés laboral', 'Fatiga mental', 'Sedentarismo'],
      benefits: ['Mayor energía', 'Mejor concentración', 'Reducción de estrés', 'Mejor rendimiento laboral'],
    },
    'postparto': {
      niche: 'postparto',
      angles: [
        'Recuperación del suelo pélvico postparto',
        'Ejercicios seguros para mamás recientes',
        'Recuperación de la fuerza abdominal',
        'Bienestar emocional y físico en el postparto',
      ],
      keywords: ['postparto', 'recuperación', 'mamás', 'suelo pélvico', 'bienestar'],
      painPoints: ['Falta de tiempo', 'Cansancio extremo', 'Cambios corporales', 'Baja autoestima'],
      benefits: ['Recuperación física', 'Mayor energía', 'Mejor estado de ánimo', 'Conexión con el cuerpo'],
    },
    'alto-rendimiento': {
      niche: 'alto-rendimiento',
      angles: [
        'Optimización del rendimiento deportivo',
        'Periodización y planificación avanzada',
        'Recuperación y prevención de lesiones',
        'Nutrición para máximo rendimiento',
      ],
      keywords: ['alto rendimiento', 'atletas', 'optimización', 'rendimiento', 'competición'],
      painPoints: ['Estancamiento', 'Lesiones recurrentes', 'Fatiga', 'Presión competitiva'],
      benefits: ['Mejor rendimiento', 'Menos lesiones', 'Mayor resistencia', 'Resultados medibles'],
    },
    'rehabilitacion': {
      niche: 'rehabilitacion',
      angles: [
        'Recuperación funcional después de lesiones',
        'Ejercicios terapéuticos personalizados',
        'Prevención de recaídas',
        'Fortalecimiento progresivo',
      ],
      keywords: ['rehabilitación', 'lesiones', 'recuperación', 'terapia', 'funcional'],
      painPoints: ['Dolor crónico', 'Limitaciones físicas', 'Miedo a lesionarse', 'Progreso lento'],
      benefits: ['Recuperación completa', 'Menos dolor', 'Mayor movilidad', 'Confianza renovada'],
    },
    'perdida-peso': {
      niche: 'perdida-peso',
      angles: [
        'Pérdida de peso sostenible y saludable',
        'Combinación de ejercicio y nutrición',
        'Superar mesetas de pérdida de peso',
        'Transformación corporal real',
      ],
      keywords: ['pérdida de peso', 'transformación', 'grasa', 'salud', 'resultados'],
      painPoints: ['Dietas fallidas', 'Falta de motivación', 'Mesetas', 'Baja autoestima'],
      benefits: ['Pérdida de peso real', 'Más energía', 'Mejor salud', 'Confianza'],
    },
    'ganancia-masa': {
      niche: 'ganancia-masa',
      angles: [
        'Hipertrofia efectiva y progresiva',
        'Nutrición para ganancia muscular',
        'Rutinas de fuerza optimizadas',
        'Supercompensación y crecimiento',
      ],
      keywords: ['hipertrofia', 'masa muscular', 'fuerza', 'crecimiento', 'volumen'],
      painPoints: ['Ganancia lenta', 'Falta de fuerza', 'Nutrición inadecuada', 'Estancamiento'],
      benefits: ['Mayor masa muscular', 'Más fuerza', 'Mejor composición corporal', 'Resultados visibles'],
    },
    'bienestar-general': {
      niche: 'bienestar-general',
      angles: [
        'Enfoque holístico en salud y bienestar',
        'Equilibrio entre ejercicio, nutrición y descanso',
        'Bienestar mental y físico',
        'Hábitos saludables sostenibles',
      ],
      keywords: ['bienestar', 'salud', 'holístico', 'equilibrio', 'hábitos'],
      painPoints: ['Falta de equilibrio', 'Estrés', 'Falta de energía', 'Hábitos poco saludables'],
      benefits: ['Mejor salud general', 'Más energía', 'Mejor estado de ánimo', 'Calidad de vida'],
    },
    'deportistas-amateur': {
      niche: 'deportistas-amateur',
      angles: [
        'Mejora del rendimiento sin comprometer la vida personal',
        'Entrenamiento específico para tu deporte',
        'Prevención de lesiones en deportistas',
        'Equilibrio entre pasión y responsabilidades',
      ],
      keywords: ['deportistas', 'amateur', 'rendimiento', 'pasión', 'deporte'],
      painPoints: ['Tiempo limitado', 'Lesiones', 'Falta de progreso', 'Equilibrio vida-deporte'],
      benefits: ['Mejor rendimiento', 'Menos lesiones', 'Más disfrute', 'Progreso constante'],
    },
  };

  return anglesMap[niche];
};

