import { addDays, startOfWeek, endOfWeek, format, parseISO } from 'date-fns';
import type { WeeklyAICalendar, WeeklyCalendarPost, TrainerNiche, SocialPlatform } from '../types';
import { getTrainerNichesConfig } from './trainerNiches';

// Mock storage - en producción vendría del backend
let weeklyCalendars: WeeklyAICalendar[] = [];

/**
 * Genera un calendario semanal con contenido IA
 */
export const generateWeeklyAICalendar = async (
  weekStart?: string
): Promise<WeeklyAICalendar> => {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const startDate = weekStart ? parseISO(weekStart) : new Date();
  const weekStartDate = startOfWeek(startDate, { weekStartsOn: 1 }); // Lunes
  const weekEndDate = endOfWeek(startDate, { weekStartsOn: 1 }); // Domingo

  // Obtener configuración de nichos
  const nichesConfig = await getTrainerNichesConfig();
  const primaryNiches = nichesConfig?.primaryNiches || ['bienestar-general'];

  // Generar posts para la semana
  const posts: WeeklyCalendarPost[] = [];
  const platforms: SocialPlatform[] = ['instagram', 'facebook', 'tiktok'];
  const contentTypes: Array<'post' | 'reel' | 'carousel' | 'story'> = ['post', 'reel', 'carousel'];
  const times = ['08:00', '12:00', '18:00', '20:00'];

  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  let postIndex = 0;
  for (let i = 0; i < 7; i++) {
    const currentDate = addDays(weekStartDate, i);
    const dayOfWeek = daysOfWeek[i];
    const niche = primaryNiches[postIndex % primaryNiches.length] as TrainerNiche;
    const platform = platforms[postIndex % platforms.length];
    const contentType = contentTypes[postIndex % contentTypes.length];
    const time = times[postIndex % times.length];

    // Generar contenido adaptado al nicho
    const content = generateContentForNiche(niche, contentType, dayOfWeek, postIndex);

    posts.push({
      id: `weekly-post-${i}-${Date.now()}`,
      date: format(currentDate, 'yyyy-MM-dd'),
      dayOfWeek,
      time,
      platform,
      contentType,
      hook: content.hook,
      copy: content.copy,
      cta: content.cta,
      audiovisualHook: content.audiovisualHook,
      hashtags: content.hashtags,
      suggestedMedia: content.suggestedMedia,
      niche,
      status: 'draft',
    });

    postIndex++;
  }

  const calendar: WeeklyAICalendar = {
    id: `weekly-calendar-${Date.now()}`,
    weekStart: format(weekStartDate, 'yyyy-MM-dd'),
    weekEnd: format(weekEndDate, 'yyyy-MM-dd'),
    posts,
    generatedAt: new Date().toISOString(),
    trainerId: 'trn_current',
  };

  // Guardar en mock storage
  weeklyCalendars.push(calendar);

  return calendar;
};

/**
 * Genera contenido adaptado a un nicho específico
 */
const generateContentForNiche = (
  niche: TrainerNiche,
  contentType: 'post' | 'reel' | 'carousel' | 'story',
  dayOfWeek: string,
  index: number = 0
): {
  hook: string;
  copy: string;
  cta: string;
  audiovisualHook?: string;
  hashtags: string[];
  suggestedMedia?: string[];
} => {
  const contentTemplates: Record<TrainerNiche, Record<string, any>> = {
    'ejecutivos': {
      hooks: [
        '¿Solo tienes 30 minutos? Esto es todo lo que necesitas para mantenerte en forma',
        'El secreto de los CEO más exitosos: entrenar antes de las 7 AM',
        'Cómo transformar tu oficina en un gimnasio (sin que nadie se dé cuenta)',
      ],
      copies: [
        'Los ejecutivos más productivos no sacrifican su salud. Con solo 30 minutos al día, puedes mantener tu energía alta, reducir el estrés y mejorar tu concentración. La clave está en entrenamientos de alta intensidad que maximizan resultados en mínimo tiempo.',
        'El ejercicio matutino no es solo para "early birds". Es una estrategia probada para aumentar la productividad, mejorar la toma de decisiones y mantener la energía durante todo el día. ¿Listo para cambiar tu rutina?',
      ],
      ctas: [
        'Reserva tu sesión de 30 minutos y descubre cómo encajar el ejercicio en tu agenda',
        'Descarga mi guía gratuita: "Entrenamientos Express para Ejecutivos"',
        'Agenda una consulta gratuita para diseñar tu plan personalizado',
      ],
      audiovisualHooks: [
        'Time-lapse de un entrenamiento completo de 30 minutos',
        'Antes y después: ejecutivo que transformó su energía en 3 meses',
        'Rutina de ejercicios que puedes hacer en tu oficina',
      ],
      hashtags: ['#ejecutivosfit', '#productividad', '#entrenamientoexpress', '#saludlaboral', '#fitnessejecutivo'],
    },
    'postparto': {
      hooks: [
        'Tu cuerpo hizo algo increíble. Ahora es momento de recuperarlo con amor',
        'Mamá, no tienes que elegir entre cuidar a tu bebé y cuidarte a ti',
        'La recuperación postparto no es una carrera. Es un viaje de autocuidado',
      ],
      copies: [
        'Ser mamá es agotador, pero tu bienestar también importa. La recuperación postparto requiere paciencia, ejercicios específicos y mucho autocuidado. Empezar con ejercicios suaves para el suelo pélvico y la fuerza abdominal es el primer paso hacia tu recuperación.',
        'Cada cuerpo es diferente y cada recuperación es única. No te compares con otras mamás. Tu viaje es tuyo. Con el apoyo adecuado y ejercicios seguros, puedes recuperar tu fuerza, energía y confianza.',
      ],
      ctas: [
        'Únete a mi programa de recuperación postparto diseñado específicamente para mamás',
        'Descarga mi guía gratuita: "Primeros pasos en tu recuperación postparto"',
        'Agenda una consulta para evaluar tu situación y crear un plan personalizado',
      ],
      audiovisualHooks: [
        'Ejercicios suaves de suelo pélvico para mamás recientes',
        'Testimonio de mamá que recuperó su fuerza en 6 meses',
        'Rutina de 15 minutos que puedes hacer mientras tu bebé duerme',
      ],
      hashtags: ['#postparto', '#mamás', '#recuperación', '#suelopélvico', '#bienestarmaternal'],
    },
    'alto-rendimiento': {
      hooks: [
        'El 1% que separa a los buenos atletas de los grandes campeones',
        'No es solo entrenar duro. Es entrenar inteligente',
        'La diferencia entre el talento y la excelencia está en los detalles',
      ],
      copies: [
        'El alto rendimiento no se trata solo de entrenar más horas. Se trata de optimizar cada aspecto: periodización, nutrición, recuperación y mentalidad. Los atletas de élite entienden que el progreso viene de la consistencia y la precisión en cada detalle.',
        'Si buscas llevar tu rendimiento al siguiente nivel, necesitas un enfoque científico y personalizado. Cada movimiento, cada repetición, cada día de descanso cuenta. La excelencia se construye día a día con disciplina y estrategia.',
      ],
      ctas: [
        'Descubre mi metodología de entrenamiento para atletas de alto rendimiento',
        'Agenda una evaluación de rendimiento y diseño de plan personalizado',
        'Únete a mi programa de optimización deportiva',
      ],
      audiovisualHooks: [
        'Análisis de técnica: cómo mejorar tu forma para máximo rendimiento',
        'Comparativa: entrenamiento tradicional vs. entrenamiento optimizado',
        'Rutina de activación pre-competición',
      ],
      hashtags: ['#altorendimiento', '#atletas', '#optimización', '#rendimientodeportivo', '#deportedeélite'],
    },
    'rehabilitacion': {
      hooks: [
        'La lesión no es el final. Es el comienzo de una recuperación más fuerte',
        'Cada ejercicio es un paso hacia tu recuperación completa',
        'Tu cuerpo tiene la capacidad de sanar. Solo necesita el enfoque correcto',
      ],
      copies: [
        'La rehabilitación no es solo sobre recuperar lo que perdiste. Es sobre construir algo más fuerte. Con ejercicios terapéuticos específicos, progresión adecuada y paciencia, puedes no solo recuperarte, sino prevenir futuras lesiones.',
        'Cada lesión es una oportunidad de aprender sobre tu cuerpo y fortalecer tus debilidades. La clave está en la progresión gradual, el movimiento correcto y la consistencia. Tu recuperación es posible.',
      ],
      ctas: [
        'Agenda una evaluación de tu lesión y diseño de plan de rehabilitación',
        'Descarga mi guía: "Ejercicios terapéuticos para recuperación"',
        'Únete a mi programa de rehabilitación funcional',
      ],
      audiovisualHooks: [
        'Ejercicios de movilidad para recuperación de lesión',
        'Progresión de ejercicios: de básico a avanzado',
        'Testimonio: de lesión a más fuerte que antes',
      ],
      hashtags: ['#rehabilitación', '#recuperación', '#lesiones', '#terapia', '#fisioterapia'],
    },
    'perdida-peso': {
      hooks: [
        'La pérdida de peso real no viene de dietas extremas. Viene de cambios sostenibles',
        'Olvídate de las dietas milagro. Esto es lo que realmente funciona',
        'Tu transformación no empieza el lunes. Empieza ahora',
      ],
      copies: [
        'La pérdida de peso sostenible no es sobre restricción extrema. Es sobre crear hábitos que puedas mantener a largo plazo. Combinando ejercicio estratégico con nutrición adecuada, puedes lograr resultados reales sin sacrificar tu bienestar mental.',
        'Cada cuerpo es diferente y cada viaje de transformación es único. No hay atajos, pero hay un camino claro: consistencia, paciencia y el enfoque correcto. Tu transformación es posible cuando combinas movimiento, nutrición y mentalidad.',
      ],
      ctas: [
        'Descubre mi programa de pérdida de peso sostenible',
        'Agenda una consulta gratuita para evaluar tu situación',
        'Descarga mi guía: "Pérdida de peso sin dietas extremas"',
      ],
      audiovisualHooks: [
        'Transformación real: antes y después de 6 meses',
        'Rutina de ejercicios para acelerar la pérdida de grasa',
        'Errores comunes que impiden la pérdida de peso',
      ],
      hashtags: ['#pérdidadepeso', '#transformación', '#salud', '#fitness', '#bienestar'],
    },
    'ganancia-masa': {
      hooks: [
        'Construir músculo no es solo levantar pesas. Es ciencia aplicada',
        'El secreto de la hipertrofia: no es lo que haces, es cómo lo haces',
        'De flaco a fuerte: el plan real para ganar masa muscular',
      ],
      copies: [
        'La ganancia de masa muscular requiere más que solo entrenar duro. Necesitas periodización adecuada, nutrición estratégica, descanso suficiente y progresión constante. La hipertrofia es un proceso que requiere paciencia y el enfoque correcto.',
        'Cada repetición cuenta cuando buscas construir músculo. Pero no se trata solo de volumen. Se trata de intensidad, técnica, nutrición y recuperación. Con el plan adecuado, puedes maximizar tu potencial de crecimiento.',
      ],
      ctas: [
        'Descubre mi programa de hipertrofia y ganancia de masa',
        'Agenda una consulta para diseñar tu plan de entrenamiento y nutrición',
        'Descarga mi guía: "Guía completa de ganancia muscular"',
      ],
      audiovisualHooks: [
        'Rutina de hipertrofia: ejercicios clave para ganar masa',
        'Progresión de fuerza: cómo aumentar tus pesos de forma segura',
        'Antes y después: transformación de ganancia de masa en 1 año',
      ],
      hashtags: ['#hipertrofia', '#gananciademasa', '#fuerza', '#musculación', '#crecimientomuscular'],
    },
    'bienestar-general': {
      hooks: [
        'El bienestar no es un destino. Es un estilo de vida',
        'Salud no es solo ausencia de enfermedad. Es vitalidad y energía',
        'Pequeños cambios, grandes resultados en tu bienestar',
      ],
      copies: [
        'El bienestar integral va más allá del ejercicio. Es sobre encontrar el equilibrio entre movimiento, nutrición, descanso y bienestar mental. Cuando todos estos aspectos trabajan juntos, experimentas una transformación real en tu calidad de vida.',
        'No necesitas cambios drásticos para mejorar tu bienestar. Pequeños hábitos consistentes crean grandes resultados a largo plazo. El secreto está en la sostenibilidad y el enfoque holístico.',
      ],
      ctas: [
        'Descubre mi programa de bienestar integral',
        'Agenda una consulta para evaluar tu bienestar actual',
        'Descarga mi guía: "7 hábitos para un bienestar real"',
      ],
      audiovisualHooks: [
        'Rutina de bienestar: ejercicio, estiramiento y mindfulness',
        'Día completo de hábitos saludables',
        'Testimonio: transformación de bienestar en 90 días',
      ],
      hashtags: ['#bienestar', '#salud', '#vidasaludable', '#equilibrio', '#holístico'],
    },
    'deportistas-amateur': {
      hooks: [
        'Ser amateur no significa entrenar como principiante',
        'Tu pasión por el deporte merece un entrenamiento serio',
        'Mejora tu rendimiento sin sacrificar tu vida personal',
      ],
      copies: [
        'Ser deportista amateur no significa conformarse con menos. Puedes mejorar tu rendimiento, prevenir lesiones y disfrutar más de tu deporte con un entrenamiento específico y bien planificado. La clave está en la especificidad y la progresión adecuada.',
        'Equilibrar tu pasión deportiva con tu vida personal es posible. Con un plan de entrenamiento inteligente que respete tus responsabilidades, puedes mejorar tu rendimiento sin sacrificar lo que más importa.',
      ],
      ctas: [
        'Descubre mi programa de entrenamiento para deportistas amateur',
        'Agenda una consulta para diseñar tu plan específico para tu deporte',
        'Descarga mi guía: "Entrenamiento específico para tu deporte"',
      ],
      audiovisualHooks: [
        'Entrenamiento específico para corredores amateur',
        'Prevención de lesiones en deportistas recreativos',
        'Testimonio: de amateur a competidor',
      ],
      hashtags: ['#deportistas', '#amateur', '#rendimiento', '#deporte', '#pasión'],
    },
  };

  const template = contentTemplates[niche];
  const hookIndex = index % template.hooks.length;
  const copyIndex = index % template.copies.length;
  const ctaIndex = index % template.ctas.length;

  return {
    hook: template.hooks[hookIndex],
    copy: template.copies[copyIndex],
    cta: template.ctas[ctaIndex],
    audiovisualHook: template.audiovisualHooks?.[hookIndex],
    hashtags: template.hashtags,
    suggestedMedia: contentType === 'reel' ? ['Video de ejercicios', 'Time-lapse de entrenamiento'] : undefined,
  };
};

/**
 * Obtiene el calendario semanal actual o genera uno nuevo
 */
export const getWeeklyAICalendar = async (weekStart?: string): Promise<WeeklyAICalendar | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (weekStart) {
    const existing = weeklyCalendars.find((cal) => cal.weekStart === weekStart);
    if (existing) {
      return existing;
    }
  }

  // Si no existe, generar uno nuevo
  return generateWeeklyAICalendar(weekStart);
};

/**
 * Obtiene todos los calendarios semanales guardados
 */
export const getAllWeeklyCalendars = async (): Promise<WeeklyAICalendar[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return weeklyCalendars;
};

/**
 * Actualiza un post del calendario semanal
 */
export const updateWeeklyCalendarPost = async (
  calendarId: string,
  postId: string,
  updates: Partial<WeeklyCalendarPost>
): Promise<WeeklyCalendarPost> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const calendar = weeklyCalendars.find((cal) => cal.id === calendarId);
  if (!calendar) {
    throw new Error('Calendario no encontrado');
  }

  const postIndex = calendar.posts.findIndex((p) => p.id === postId);
  if (postIndex === -1) {
    throw new Error('Post no encontrado');
  }

  calendar.posts[postIndex] = {
    ...calendar.posts[postIndex],
    ...updates,
  };

  return calendar.posts[postIndex];
};

