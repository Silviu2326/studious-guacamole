import {
  CommunityManagerAITemplate,
  CommunityManagerGuidelines,
  TemplateCategory,
  TemplateFormat,
  TemplateStatus,
} from '../types';

// Mock data de plantillas
const mockTemplates: CommunityManagerAITemplate[] = [
  {
    id: 'tpl_001',
    name: 'Solicitud de Testimonio Personalizada',
    description: 'Plantilla para solicitar testimonios a clientes de forma personalizada y cercana',
    category: 'testimonial',
    format: 'message',
    template: {
      structure: ['greeting', 'context', 'request', 'cta'],
      content: {
        greeting: '¡Hola {nombre}! 👋',
        context: 'Me encantaría saber cómo ha sido tu experiencia con {programa}.',
        request: '¿Te gustaría compartir tu testimonio? Puede ser un mensaje de texto, audio o video.',
        cta: '¡Tu opinión es muy valiosa para nosotros!',
      },
      variables: [
        {
          key: 'nombre',
          label: 'Nombre del cliente',
          type: 'text',
          required: true,
          placeholder: 'Ej: María',
        },
        {
          key: 'programa',
          label: 'Programa o servicio',
          type: 'text',
          required: true,
          placeholder: 'Ej: Programa de pérdida de peso',
        },
      ],
      example:
        '¡Hola María! 👋 Me encantaría saber cómo ha sido tu experiencia con el Programa de pérdida de peso. ¿Te gustaría compartir tu testimonio? Puede ser un mensaje de texto, audio o video. ¡Tu opinión es muy valiosa para nosotros!',
    },
    guidelines: {
      tone: 'Cercano y empático',
      do: [
        'Personalizar el mensaje con el nombre del cliente',
        'Mencionar el programa o servicio específico',
        'Ser claro sobre qué tipo de testimonio se busca',
        'Mostrar aprecio por su tiempo',
      ],
      dont: [
        'Usar mensajes genéricos sin personalizar',
        'Presionar si el cliente no quiere participar',
        'Olvidar agradecer su tiempo',
      ],
      keyPoints: [
        'El momento ideal es después de un logro o hito',
        'Ofrecer múltiples formatos aumenta la participación',
        'Seguir el tono de voz de la marca',
      ],
      brandVoice: 'Motivacional pero cercano',
      examples: [
        'Usar emojis de forma moderada',
        'Mantener un tono positivo y entusiasta',
      ],
    },
    aiConfig: {
      enabled: true,
      personalizationLevel: 'advanced',
      adaptToClient: true,
      adaptToContext: true,
      useCommunityVoice: true,
    },
    assignedTo: ['tm_004', 'tm_005'],
    status: 'active',
    usageCount: 23,
    lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'trainer_1',
  },
  {
    id: 'tpl_002',
    name: 'Post de Redes Sociales - Logro de Cliente',
    description: 'Plantilla para celebrar logros de clientes en redes sociales',
    category: 'social-post',
    format: 'post',
    template: {
      structure: ['hook', 'story', 'celebration', 'cta'],
      content: {
        hook: '🎉 ¡Increíble logro de {nombre}!',
        story: '{nombre} ha logrado {logro} después de {tiempo}.',
        celebration: 'Estamos muy orgullosos de tu dedicación y esfuerzo. ¡Sigue así! 💪',
        cta: '¿Quieres ser el próximo en alcanzar tus objetivos? ¡Contáctanos!',
      },
      variables: [
        {
          key: 'nombre',
          label: 'Nombre del cliente',
          type: 'text',
          required: true,
        },
        {
          key: 'logro',
          label: 'Logro alcanzado',
          type: 'text',
          required: true,
          placeholder: 'Ej: Perder 10kg',
        },
        {
          key: 'tiempo',
          label: 'Tiempo invertido',
          type: 'text',
          required: true,
          placeholder: 'Ej: 3 meses',
        },
      ],
      example:
        '🎉 ¡Increíble logro de María! María ha logrado perder 10kg después de 3 meses. Estamos muy orgullosos de tu dedicación y esfuerzo. ¡Sigue así! 💪 ¿Quieres ser el próximo en alcanzar tus objetivos? ¡Contáctanos!',
    },
    guidelines: {
      tone: 'Celebratorio y motivacional',
      do: [
        'Destacar el logro específico del cliente',
        'Usar emojis de celebración',
        'Incluir una llamada a la acción',
        'Mantener un tono positivo y energético',
      ],
      dont: [
        'Comparar con otros clientes',
        'Usar un tono competitivo',
        'Olvidar pedir permiso antes de publicar',
      ],
      keyPoints: [
        'Siempre pedir permiso antes de publicar',
        'Incluir foto si el cliente lo autoriza',
        'Usar hashtags relevantes',
      ],
      brandVoice: 'Motivacional y celebratorio',
    },
    aiConfig: {
      enabled: true,
      personalizationLevel: 'full',
      adaptToClient: true,
      adaptToContext: true,
      useCommunityVoice: true,
    },
    assignedTo: ['tm_004'],
    status: 'active',
    usageCount: 15,
    lastUsed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'trainer_1',
  },
];

// Mock data de guidelines
let guidelines: CommunityManagerGuidelines | null = {
  id: 'guidelines_001',
  trainerId: 'trainer_1',
  general: {
    tone: 'Motivacional pero cercano',
    voice: 'Somos un equipo que cree en el poder de la comunidad y el apoyo mutuo. Nuestro tono es positivo, empático y siempre busca inspirar sin presionar.',
    values: ['Disciplina', 'Apoyo mutuo', 'Progreso constante', 'Comunidad'],
    keywords: ['logro', 'progreso', 'comunidad', 'dedicación', 'esfuerzo', 'transformación'],
    preferredEmojis: ['💪', '🎉', '🔥', '✨', '👏'],
    avoidWords: ['fácil', 'rápido', 'sin esfuerzo', 'milagro'],
  },
  categoryGuidelines: {
    testimonial: {
      tone: 'Cercano y empático',
      specificRules: [
        'Siempre personalizar con el nombre del cliente',
        'Mencionar el contexto específico (programa, logro, etc.)',
        'Ofrecer múltiples formatos (texto, audio, video)',
      ],
    },
    'social-post': {
      tone: 'Celebratorio y motivacional',
      specificRules: [
        'Siempre pedir permiso antes de publicar',
        'Incluir foto si está autorizada',
        'Usar hashtags relevantes',
      ],
    },
  },
  platformGuidelines: {
    instagram: {
      tone: 'Visual y energético',
      format: 'Post con imagen o reel',
      bestPractices: [
        'Usar imágenes de alta calidad',
        'Incluir hashtags relevantes (5-10)',
        'Publicar en horarios de mayor engagement',
      ],
    },
    whatsapp: {
      tone: 'Personal y directo',
      format: 'Mensaje de texto con emojis moderados',
      bestPractices: [
        'Mantener mensajes concisos',
        'Usar emojis de forma moderada',
        'Responder rápidamente',
      ],
    },
  },
  dos: [
    'Personalizar siempre los mensajes',
    'Pedir permiso antes de publicar contenido de clientes',
    'Mantener un tono positivo y motivacional',
    'Celebrar los logros de los clientes',
    'Responder rápidamente a mensajes',
  ],
  donts: [
    'Usar mensajes genéricos sin personalizar',
    'Publicar contenido sin permiso',
    'Comparar clientes entre sí',
    'Usar un tono competitivo o presionante',
    'Olvidar agradecer a los clientes',
  ],
  goodExamples: [
    {
      id: 'ex_001',
      title: 'Testimonio personalizado',
      content:
        '¡Hola María! 👋 Me encantaría saber cómo ha sido tu experiencia con el Programa de pérdida de peso. ¿Te gustaría compartir tu testimonio?',
      category: 'testimonial',
      whyGood: 'Personalizado, claro y con tono cercano',
    },
  ],
  badExamples: [
    {
      id: 'ex_002',
      title: 'Mensaje genérico',
      content: 'Hola, queremos tu testimonio. Por favor envíalo.',
      category: 'testimonial',
      whyBad: 'Demasiado genérico, sin personalización ni contexto',
      howToFix: 'Agregar nombre del cliente, contexto específico y tono más cercano',
    },
  ],
  approvalConfig: {
    requireApproval: true,
    autoApprove: false,
    approvers: ['trainer_1'],
  },
  createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  lastReviewed: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  version: 2,
};

/**
 * Obtiene todas las plantillas IA disponibles
 */
export const getCommunityManagerTemplates = async (
  category?: TemplateCategory,
  assignedTo?: string
): Promise<CommunityManagerAITemplate[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  let filtered = [...mockTemplates];

  if (category) {
    filtered = filtered.filter((t) => t.category === category);
  }

  if (assignedTo) {
    filtered = filtered.filter((t) => t.assignedTo?.includes(assignedTo));
  }

  return filtered;
};

/**
 * Obtiene una plantilla por ID
 */
export const getTemplateById = async (
  templateId: string
): Promise<CommunityManagerAITemplate | null> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return mockTemplates.find((t) => t.id === templateId) || null;
};

/**
 * Crea una nueva plantilla IA
 */
export const createTemplate = async (
  template: Omit<CommunityManagerAITemplate, 'id' | 'createdAt' | 'updatedAt'>
): Promise<CommunityManagerAITemplate> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const newTemplate: CommunityManagerAITemplate = {
    ...template,
    id: `tpl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockTemplates.push(newTemplate);
  return newTemplate;
};

/**
 * Actualiza una plantilla existente
 */
export const updateTemplate = async (
  templateId: string,
  updates: Partial<CommunityManagerAITemplate>
): Promise<CommunityManagerAITemplate> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const index = mockTemplates.findIndex((t) => t.id === templateId);
  if (index === -1) {
    throw new Error('Plantilla no encontrada');
  }

  mockTemplates[index] = {
    ...mockTemplates[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  return mockTemplates[index];
};

/**
 * Elimina una plantilla
 */
export const deleteTemplate = async (templateId: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const index = mockTemplates.findIndex((t) => t.id === templateId);
  if (index === -1) {
    throw new Error('Plantilla no encontrada');
  }

  mockTemplates.splice(index, 1);
};

/**
 * Asigna una plantilla a uno o más community managers
 */
export const assignTemplateToManagers = async (
  templateId: string,
  managerIds: string[]
): Promise<CommunityManagerAITemplate> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const template = mockTemplates.find((t) => t.id === templateId);
  if (!template) {
    throw new Error('Plantilla no encontrada');
  }

  template.assignedTo = managerIds;
  template.updatedAt = new Date().toISOString();

  return template;
};

/**
 * Obtiene los guidelines para community managers
 */
export const getCommunityManagerGuidelines = async (): Promise<CommunityManagerGuidelines | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return guidelines;
};

/**
 * Actualiza los guidelines para community managers
 */
export const updateCommunityManagerGuidelines = async (
  updates: Partial<CommunityManagerGuidelines>
): Promise<CommunityManagerGuidelines> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (!guidelines) {
    throw new Error('Guidelines no encontrados');
  }

  guidelines = {
    ...guidelines,
    ...updates,
    updatedAt: new Date().toISOString(),
    lastReviewed: new Date().toISOString(),
    version: (guidelines.version || 1) + 1,
  };

  return guidelines;
};

/**
 * Genera guidelines automáticamente basados en la voz de comunidad configurada
 */
export const generateGuidelinesFromCommunityVoice = async (
  communityVoiceConfig: any
): Promise<CommunityManagerGuidelines> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // En producción, esto usaría IA para generar guidelines basados en la voz de comunidad
  const generatedGuidelines: CommunityManagerGuidelines = {
    id: `guidelines_${Date.now()}`,
    trainerId: 'trainer_1',
    general: {
      tone: communityVoiceConfig?.tone || 'Motivacional pero cercano',
      voice: communityVoiceConfig?.description || 'Voz de comunidad generada automáticamente',
      values: communityVoiceConfig?.values || [],
      keywords: communityVoiceConfig?.keywords || [],
      preferredEmojis: communityVoiceConfig?.preferredEmojis || [],
      avoidWords: [],
    },
    dos: [
      'Personalizar siempre los mensajes',
      'Mantener el tono de voz de la marca',
      'Celebrar los logros de los clientes',
    ],
    donts: [
      'Usar mensajes genéricos',
      'Desviarse del tono de voz',
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1,
  };

  guidelines = generatedGuidelines;
  return generatedGuidelines;
};

