import type { VideoScriptPrompt, GeneratedVideoScript, VideoStyle } from '../types';
import { getCreativeVoiceConfig } from './creativeVoice';

// Prompts rápidos predefinidos para scripts de video
export const VIDEO_SCRIPT_PROMPTS: VideoScriptPrompt[] = [
  {
    id: 'prompt-tip-energetico-1',
    title: 'Tip Rápido - Estilo Energético',
    description: 'Tip de entrenamiento con energía y dinamismo',
    category: 'tip',
    estimatedDuration: '30s',
    style: 'energetico',
    template: {
      hook: '¡Hola! ¿Sabías que...?',
      body: [
        'Este simple cambio puede transformar tu entrenamiento',
        'Te voy a mostrar cómo hacerlo correctamente',
        'Presta atención porque esto es clave',
      ],
      cta: '¡Pruébalo y cuéntame cómo te va!',
      visualCues: ['Primer plano del entrenador', 'Demostración del ejercicio', 'Close-up de la técnica'],
    },
  },
  {
    id: 'prompt-tip-calmado-1',
    title: 'Tip Rápido - Estilo Calmado',
    description: 'Tip educativo con tono sereno y profesional',
    category: 'tip',
    estimatedDuration: '45s',
    style: 'calmado',
    template: {
      hook: 'Hoy quiero compartir contigo un consejo importante',
      body: [
        'Muchas personas cometen este error común',
        'La forma correcta es hacerlo de esta manera',
        'Esto te ayudará a evitar lesiones y mejorar tus resultados',
      ],
      cta: 'Si tienes dudas, déjame un comentario',
      visualCues: ['Entrenador en ambiente tranquilo', 'Demostración pausada', 'Enfoque en la técnica'],
    },
  },
  {
    id: 'prompt-tutorial-energetico-1',
    title: 'Tutorial de Ejercicio - Energético',
    description: 'Tutorial paso a paso con energía y motivación',
    category: 'tutorial',
    estimatedDuration: '60s',
    style: 'energetico',
    template: {
      hook: '¡Vamos a aprender este ejercicio juntos!',
      body: [
        'Paso 1: Posición inicial',
        'Paso 2: Ejecución del movimiento',
        'Paso 3: Puntos clave a recordar',
        'Errores comunes que debes evitar',
      ],
      cta: '¡Pruébalo y etiquétame en tus stories!',
      visualCues: ['Vista completa del ejercicio', 'Close-up de cada paso', 'Comparación correcto vs incorrecto'],
    },
  },
  {
    id: 'prompt-tutorial-calmado-1',
    title: 'Tutorial de Ejercicio - Calmado',
    description: 'Tutorial educativo con explicación detallada',
    category: 'tutorial',
    estimatedDuration: '90s',
    style: 'calmado',
    template: {
      hook: 'En este video te explico cómo realizar correctamente este ejercicio',
      body: [
        'Primero, vamos a ver la posición inicial',
        'Ahora, el movimiento principal',
        'Es importante mantener esta técnica',
        'Veamos los errores más comunes',
      ],
      cta: 'Si te sirvió, comparte este video',
      visualCues: ['Vista lateral del ejercicio', 'Demostración lenta', 'Enfoque en la postura'],
    },
  },
  {
    id: 'prompt-motivacion-energetico-1',
    title: 'Motivación - Estilo Energético',
    description: 'Mensaje motivacional con alta energía',
    category: 'motivacion',
    estimatedDuration: '30s',
    style: 'energetico',
    template: {
      hook: '¡Tú puedes hacerlo!',
      body: [
        'Cada día es una nueva oportunidad',
        'El progreso no es lineal, pero es constante',
        'Confía en el proceso y en ti mismo',
      ],
      cta: '¡Vamos, tú puedes! 💪',
      visualCues: ['Entrenador motivando', 'Imágenes de progreso', 'Energía positiva'],
    },
  },
  {
    id: 'prompt-motivacion-calmado-1',
    title: 'Motivación - Estilo Calmado',
    description: 'Mensaje inspirador con tono sereno',
    category: 'motivacion',
    estimatedDuration: '45s',
    style: 'calmado',
    template: {
      hook: 'Quiero recordarte algo importante hoy',
      body: [
        'Tu viaje es único y valioso',
        'Cada pequeño paso cuenta',
        'La consistencia es más poderosa que la perfección',
      ],
      cta: 'Sigue adelante, estás en el camino correcto',
      visualCues: ['Ambiente tranquilo', 'Naturaleza o espacio sereno', 'Enfoque en el mensaje'],
    },
  },
  {
    id: 'prompt-nutricion-energetico-1',
    title: 'Tip de Nutrición - Energético',
    description: 'Consejo nutricional con energía',
    category: 'nutricion',
    estimatedDuration: '30s',
    style: 'energetico',
    template: {
      hook: '¡Este alimento va a cambiar tu día!',
      body: [
        'Te explico por qué es tan importante',
        'Cómo incluirlo en tu dieta diaria',
        'Los beneficios que vas a notar',
      ],
      cta: '¡Pruébalo y me cuentas!',
      visualCues: ['Alimento en primer plano', 'Preparación rápida', 'Resultado visual'],
    },
  },
  {
    id: 'prompt-nutricion-calmado-1',
    title: 'Tip de Nutrición - Calmado',
    description: 'Consejo nutricional educativo',
    category: 'nutricion',
    estimatedDuration: '45s',
    style: 'calmado',
    template: {
      hook: 'Hablemos de nutrición hoy',
      body: [
        'Este nutriente es esencial para tu objetivo',
        'Te muestro cómo incorporarlo de forma práctica',
        'Los beneficios a largo plazo',
      ],
      cta: 'Si tienes preguntas, escríbeme',
      visualCues: ['Alimento preparado', 'Explicación visual', 'Información clara'],
    },
  },
];

/**
 * Obtiene los prompts de video disponibles filtrados por estilo
 */
export const getVideoScriptPrompts = async (
  style?: VideoStyle
): Promise<VideoScriptPrompt[]> => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  if (style) {
    return VIDEO_SCRIPT_PROMPTS.filter((prompt) => prompt.style === style);
  }

  return VIDEO_SCRIPT_PROMPTS;
};

/**
 * Genera un script de video basado en un prompt y estilo
 */
export const generateVideoScript = async (
  promptId: string,
  customTopic?: string,
  styleOverride?: VideoStyle
): Promise<GeneratedVideoScript> => {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const prompt = VIDEO_SCRIPT_PROMPTS.find((p) => p.id === promptId);
  if (!prompt) {
    throw new Error('Prompt no encontrado');
  }

  // Obtener configuración de voz creativa si existe
  const creativeVoice = await getCreativeVoiceConfig().catch(() => null);

  // Determinar el estilo a usar
  const finalStyle = styleOverride || prompt.style;

  // Ajustar el contenido según el estilo
  const styleAdjustments = {
    energetico: {
      hookPrefix: '¡',
      hookSuffix: '!',
      bodyIntensity: 'alto',
      ctaEnthusiasm: 'alto',
      pacing: 'rápido',
    },
    calmado: {
      hookPrefix: '',
      hookSuffix: '.',
      bodyIntensity: 'bajo',
      ctaEnthusiasm: 'bajo',
      pacing: 'pausado',
    },
    motivacional: {
      hookPrefix: '💪 ',
      hookSuffix: '!',
      bodyIntensity: 'medio-alto',
      ctaEnthusiasm: 'alto',
      pacing: 'medio-rápido',
    },
    educativo: {
      hookPrefix: '',
      hookSuffix: '.',
      bodyIntensity: 'bajo',
      ctaEnthusiasm: 'bajo',
      pacing: 'pausado',
    },
    personalizado: {
      hookPrefix: '',
      hookSuffix: '.',
      bodyIntensity: 'medio',
      ctaEnthusiasm: 'medio',
      pacing: 'medio',
    },
  };

  const adjustments = styleAdjustments[finalStyle] || styleAdjustments.personalizado;

  // Generar el hook
  const hookText = customTopic
    ? `${adjustments.hookPrefix}${customTopic}${adjustments.hookSuffix}`
    : `${adjustments.hookPrefix}${prompt.template.hook}${adjustments.hookSuffix}`;

  // Generar el cuerpo del script
  const bodyScript = prompt.template.body.map((line, index) => {
    let adjustedLine = line;
    if (customTopic && index === 0) {
      adjustedLine = customTopic;
    }
    return {
      text: adjustedLine,
      timing: `${index * 5 + 5}s-${index * 5 + 10}s`,
      visualCue: prompt.template.visualCues?.[index] || undefined,
    };
  });

  // Generar el CTA
  const ctaText = prompt.template.cta;

  // Generar hashtags según la categoría
  const categoryHashtags: Record<string, string[]> = {
    tip: ['#tipfitness', '#consejofitness', '#entrenamientopersonal', '#fitness'],
    tutorial: ['#tutorialfitness', '#ejercicios', '#rutina', '#entrenamiento'],
    motivacion: ['#motivacion', '#fitnessmotivation', '#mindset', '#disciplina'],
    transformacion: ['#transformacion', '#progreso', '#resultados', '#fitness'],
    nutricion: ['#nutricion', '#alimentacionsaludable', '#dieta', '#salud'],
    ejercicio: ['#ejercicio', '#fitness', '#entrenamiento', '#gym'],
    bienestar: ['#bienestar', '#salud', '#vidasaludable', '#fitness'],
  };

  const hashtags = categoryHashtags[prompt.category] || ['#fitness', '#entrenamientopersonal'];

  // Añadir hashtag de estilo si es relevante
  if (finalStyle === 'energetico') {
    hashtags.push('#energia', '#motivacion');
  } else if (finalStyle === 'calmado') {
    hashtags.push('#calma', '#bienestar');
  }

  return {
    id: `script_${Date.now()}`,
    promptId: prompt.id,
    title: customTopic || prompt.title,
    style: finalStyle,
    duration: prompt.estimatedDuration,
    script: {
      hook: {
        text: hookText,
        timing: '0s-5s',
        visualCue: prompt.template.visualCues?.[0] || undefined,
      },
      body: bodyScript,
      cta: {
        text: ctaText,
        timing: `${bodyScript.length * 5 + 10}s-${bodyScript.length * 5 + 15}s`,
        visualCue: prompt.template.visualCues?.[prompt.template.visualCues.length - 1] || undefined,
      },
    },
    hashtags,
    notes: `Estilo: ${finalStyle} | Duración estimada: ${prompt.estimatedDuration} | Pacing: ${adjustments.pacing}`,
    createdAt: new Date().toISOString(),
  };
};

/**
 * Obtiene los estilos de video disponibles
 */
export const getAvailableVideoStyles = (): Array<{ value: VideoStyle; label: string; description: string }> => {
  return [
    {
      value: 'energetico',
      label: 'Energético',
      description: 'Dinámico, entusiasta y de ritmo rápido. Perfecto para captar atención inmediata.',
    },
    {
      value: 'calmado',
      label: 'Calmado',
      description: 'Sereno, profesional y pausado. Ideal para contenido educativo y reflexivo.',
    },
    {
      value: 'motivacional',
      label: 'Motivacional',
      description: 'Inspirador y positivo. Combina energía con mensajes transformadores.',
    },
    {
      value: 'educativo',
      label: 'Educativo',
      description: 'Claro, didáctico y estructurado. Enfocado en enseñar y explicar.',
    },
    {
      value: 'personalizado',
      label: 'Personalizado',
      description: 'Basado en tu voz creativa configurada. Adaptado a tu estilo único.',
    },
  ];
};

