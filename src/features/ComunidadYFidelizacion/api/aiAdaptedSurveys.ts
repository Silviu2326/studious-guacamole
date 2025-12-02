import {
  AIAdaptedSurvey,
  AIAdaptedSurveyTemplate,
  AIAdaptedSurveyResponse,
  AIAdaptedSurveyStats,
  ExperienceType,
  CustomerSegmentType,
  ReferralImpactPeriod,
} from '../types';

const MOCK_AI_ADAPTED_SURVEY_TEMPLATES: AIAdaptedSurveyTemplate[] = [
  {
    id: 'template_001',
    name: 'Encuesta Post-Sesión 1:1',
    experienceType: 'sesion-1-1',
    description: 'Encuesta adaptada para sesiones individuales de entrenamiento',
    baseQuestions: [
      {
        id: 'q1',
        type: 'rating',
        question: '¿Cómo calificarías tu sesión de entrenamiento hoy?',
        description: 'Evalúa la calidad general de la sesión',
        required: true,
        order: 1,
        scale: {
          min: 1,
          max: 5,
          labels: {
            min: 'Muy pobre',
            max: 'Excelente',
          },
        },
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        question: '¿Qué aspecto de la sesión te gustó más?',
        options: ['Ejercicios', 'Motivación del entrenador', 'Progreso personal', 'Ambiente', 'Otro'],
        required: false,
        order: 2,
      },
      {
        id: 'q3',
        type: 'text',
        question: '¿Hay algo que mejorarías en futuras sesiones?',
        description: 'Tu feedback es valioso para mejorar',
        required: false,
        order: 3,
      },
      {
        id: 'q4',
        type: 'yes-no',
        question: '¿Recomendarías esta sesión a un amigo?',
        required: true,
        order: 4,
      },
    ],
    defaultConfig: {
      delayHours: 2,
      channel: 'whatsapp',
      autoSend: true,
    },
    adaptationRules: {
      segmentRules: [
        {
          segmentType: 'embajador',
          additionalQuestions: [
            {
              id: 'q5',
              type: 'text',
              question: '¿Te gustaría compartir tu experiencia en redes sociales?',
              required: false,
              order: 5,
            },
          ],
        },
      ],
    },
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'template_002',
    name: 'Encuesta Post-Reto',
    experienceType: 'reto',
    description: 'Encuesta adaptada para retos y desafíos comunitarios',
    baseQuestions: [
      {
        id: 'q1',
        type: 'rating',
        question: '¿Cómo calificarías tu experiencia en el reto?',
        required: true,
        order: 1,
        scale: {
          min: 1,
          max: 5,
        },
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        question: '¿Qué te motivó a participar en el reto?',
        options: ['Desafío personal', 'Comunidad', 'Premio', 'Apoyo del entrenador', 'Otro'],
        required: true,
        order: 2,
      },
      {
        id: 'q3',
        type: 'text',
        question: '¿Qué logros alcanzaste durante el reto?',
        required: false,
        order: 3,
      },
      {
        id: 'q4',
        type: 'scale',
        question: '¿Qué tan probable es que participes en otro reto?',
        required: true,
        order: 4,
        scale: {
          min: 1,
          max: 10,
          labels: {
            min: 'Muy poco probable',
            max: 'Muy probable',
          },
        },
      },
    ],
    defaultConfig: {
      delayHours: 24,
      channel: 'email',
      autoSend: true,
    },
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'template_003',
    name: 'Encuesta Post-Evento',
    experienceType: 'evento',
    description: 'Encuesta adaptada para eventos y workshops',
    baseQuestions: [
      {
        id: 'q1',
        type: 'rating',
        question: '¿Cómo calificarías el evento?',
        required: true,
        order: 1,
        scale: {
          min: 1,
          max: 5,
        },
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        question: '¿Qué aspectos del evento fueron más valiosos?',
        options: ['Contenido', 'Expositor', 'Interacción', 'Networking', 'Organización', 'Otro'],
        required: true,
        order: 2,
      },
      {
        id: 'q3',
        type: 'text',
        question: '¿Qué aprendiste o qué insight te llevas del evento?',
        required: false,
        order: 3,
      },
      {
        id: 'q4',
        type: 'yes-no',
        question: '¿Asistirías a un evento similar en el futuro?',
        required: true,
        order: 4,
      },
      {
        id: 'q5',
        type: 'text',
        question: '¿Qué temas te gustaría ver en futuros eventos?',
        required: false,
        order: 5,
      },
    ],
    defaultConfig: {
      delayHours: 4,
      channel: 'email',
      autoSend: true,
    },
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

const MOCK_AI_ADAPTED_SURVEYS: AIAdaptedSurvey[] = [
  {
    id: 'survey_001',
    name: 'Encuesta Sesión 1:1 - Laura Méndez',
    experienceType: 'sesion-1-1',
    description: 'Encuesta adaptada para la sesión individual de Laura Méndez',
    questions: [
      {
        id: 'q1',
        type: 'rating',
        question: '¿Cómo calificarías tu sesión de entrenamiento hoy?',
        description: 'Evalúa la calidad general de la sesión',
        required: true,
        order: 1,
        scale: {
          min: 1,
          max: 5,
          labels: {
            min: 'Muy pobre',
            max: 'Excelente',
          },
        },
        aiReasoning: 'Pregunta adaptada para medir satisfacción inmediata post-sesión',
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        question: '¿Qué aspecto de la sesión te gustó más?',
        options: ['Ejercicios', 'Motivación del entrenador', 'Progreso personal', 'Ambiente', 'Otro'],
        required: false,
        order: 2,
        aiReasoning: 'Adaptada para identificar qué elementos resuenan mejor con el cliente',
      },
      {
        id: 'q3',
        type: 'text',
        question: 'Laura, como cliente VIP, ¿hay algo específico que mejorarías?',
        description: 'Tu feedback es valioso para personalizar aún más tus sesiones',
        required: false,
        order: 3,
        aiReasoning: 'Personalizada para segmento VIP con nombre del cliente',
      },
      {
        id: 'q4',
        type: 'yes-no',
        question: '¿Recomendarías esta sesión a un amigo?',
        required: true,
        order: 4,
        aiReasoning: 'Adaptada para medir probabilidad de referidos',
      },
    ],
    adaptationLevel: 'personalized',
    personalization: {
      adaptedToClient: {
        clientId: 'client_001',
        clientName: 'Laura Méndez',
        clientSegment: 'vip',
        clientHistory: {
          previousSurveys: 12,
          averageSatisfaction: 4.8,
          lastInteraction: new Date().toISOString(),
        },
      },
      adaptedToExperience: {
        experienceId: 'session_001',
        experienceName: 'Sesión de fuerza',
        experienceDate: new Date().toISOString(),
        experienceDuration: 60,
      },
      adaptedToContext: {
        timing: 'post-experience',
        channel: 'whatsapp',
        language: 'es',
      },
    },
    sendConfig: {
      delayHours: 2,
      channel: 'whatsapp',
      autoSend: true,
      reminderEnabled: true,
      reminderDelayHours: 24,
    },
    aiMetadata: {
      generatedAt: new Date().toISOString(),
      model: 'gpt-4',
      adaptationReasons: [
        'Cliente VIP con historial de alta satisfacción',
        'Personalización con nombre del cliente',
        'Adaptación de preguntas según segmento',
        'Optimización para canal WhatsApp',
      ],
      expectedResponseRate: 85,
      expectedActionableFeedback: 3,
    },
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'survey_002',
    name: 'Encuesta Reto 30 Días - Carlos Ortega',
    experienceType: 'reto',
    description: 'Encuesta adaptada para el reto de 30 días',
    questions: [
      {
        id: 'q1',
        type: 'rating',
        question: '¿Cómo calificarías tu experiencia en el reto de 30 días?',
        required: true,
        order: 1,
        scale: {
          min: 1,
          max: 5,
        },
        aiReasoning: 'Pregunta principal para medir satisfacción con el reto',
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        question: '¿Qué te motivó a participar en el reto?',
        options: ['Desafío personal', 'Comunidad', 'Premio', 'Apoyo del entrenador', 'Otro'],
        required: true,
        order: 2,
        aiReasoning: 'Adaptada para entender motivaciones del cliente',
      },
      {
        id: 'q3',
        type: 'text',
        question: 'Carlos, ¿qué logros alcanzaste durante el reto?',
        required: false,
        order: 3,
        aiReasoning: 'Personalizada con nombre para fomentar respuesta detallada',
      },
      {
        id: 'q4',
        type: 'scale',
        question: '¿Qué tan probable es que participes en otro reto?',
        required: true,
        order: 4,
        scale: {
          min: 1,
          max: 10,
          labels: {
            min: 'Muy poco probable',
            max: 'Muy probable',
          },
        },
        aiReasoning: 'Adaptada para medir intención de participación futura',
      },
    ],
    adaptationLevel: 'personalized',
    personalization: {
      adaptedToClient: {
        clientId: 'client_002',
        clientName: 'Carlos Ortega',
        clientSegment: 'regular',
        clientHistory: {
          previousSurveys: 5,
          averageSatisfaction: 4.2,
        },
      },
      adaptedToExperience: {
        experienceId: 'challenge_001',
        experienceName: 'Reto 30 Días',
        experienceDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        experienceDuration: 30,
        experienceParticipants: 45,
      },
      adaptedToContext: {
        timing: 'post-experience',
        channel: 'email',
        language: 'es',
      },
    },
    sendConfig: {
      delayHours: 24,
      channel: 'email',
      autoSend: true,
      reminderEnabled: true,
      reminderDelayHours: 48,
    },
    aiMetadata: {
      generatedAt: new Date().toISOString(),
      model: 'gpt-4',
      adaptationReasons: [
        'Personalización con nombre del cliente',
        'Adaptación para reto comunitario',
        'Optimización para canal email',
        'Preguntas específicas para medir logros',
      ],
      expectedResponseRate: 70,
      expectedActionableFeedback: 2,
    },
    status: 'sent',
    createdAt: new Date().toISOString(),
  },
];

const MOCK_AI_ADAPTED_SURVEY_STATS: AIAdaptedSurveyStats[] = [
  {
    surveyId: 'survey_001',
    surveyName: 'Encuesta Post-Sesión 1:1',
    experienceType: 'sesion-1-1',
    totalSent: 45,
    totalResponses: 38,
    responseRate: 84.4,
    averageSatisfaction: 4.7,
    actionableFeedbackCount: 32,
    actionableFeedbackRate: 84.2,
    topInsights: [
      'Los clientes valoran mucho la personalización de ejercicios',
      'La motivación del entrenador es clave para la satisfacción',
      'Los clientes VIP requieren más seguimiento personalizado',
    ],
    sentimentDistribution: {
      positive: 35,
      neutral: 3,
      negative: 0,
    },
    period: '30d',
  },
  {
    surveyId: 'survey_002',
    surveyName: 'Encuesta Post-Reto',
    experienceType: 'reto',
    totalSent: 30,
    totalResponses: 22,
    responseRate: 73.3,
    averageSatisfaction: 4.5,
    actionableFeedbackCount: 18,
    actionableFeedbackRate: 81.8,
    topInsights: [
      'Los retos generan alto engagement en la comunidad',
      'Los participantes valoran el aspecto comunitario',
      'Se necesita más seguimiento durante el reto',
    ],
    sentimentDistribution: {
      positive: 20,
      neutral: 2,
      negative: 0,
    },
    period: '30d',
  },
];

export const AIAdaptedSurveysAPI = {
  async getTemplates(): Promise<AIAdaptedSurveyTemplate[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_AI_ADAPTED_SURVEY_TEMPLATES;
  },

  async getTemplateById(templateId: string): Promise<AIAdaptedSurveyTemplate | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_AI_ADAPTED_SURVEY_TEMPLATES.find((t) => t.id === templateId) || null;
  },

  async getTemplatesByExperienceType(experienceType: ExperienceType): Promise<AIAdaptedSurveyTemplate[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_AI_ADAPTED_SURVEY_TEMPLATES.filter((t) => t.experienceType === experienceType);
  },

  async generateAdaptedSurvey(
    templateId: string,
    clientId: string,
    experienceId: string,
    experienceType: ExperienceType,
  ): Promise<AIAdaptedSurvey> {
    // Simular generación de encuesta adaptada con IA
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const template = MOCK_AI_ADAPTED_SURVEY_TEMPLATES.find((t) => t.id === templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    // Simular encuesta adaptada
    return {
      id: `survey_${Date.now()}`,
      name: `Encuesta ${template.name} - Cliente ${clientId}`,
      experienceType,
      description: `Encuesta adaptada para ${experienceType}`,
      questions: template.baseQuestions.map((q, index) => ({
        ...q,
        aiReasoning: `Pregunta adaptada por IA para optimizar feedback accionable (${index + 1})`,
      })),
      adaptationLevel: 'personalized',
      personalization: {
        adaptedToClient: {
          clientId,
          clientSegment: 'regular',
        },
        adaptedToExperience: {
          experienceId,
          experienceType,
        },
        adaptedToContext: {
          timing: 'post-experience',
          channel: template.defaultConfig.channel,
          language: 'es',
        },
      },
      sendConfig: {
        ...template.defaultConfig,
        autoSend: true,
        reminderEnabled: true,
      },
      aiMetadata: {
        generatedAt: new Date().toISOString(),
        model: 'gpt-4',
        adaptationReasons: [
          'Adaptación basada en historial del cliente',
          'Optimización para tipo de experiencia',
          'Personalización para máximo feedback accionable',
        ],
        expectedResponseRate: 80,
        expectedActionableFeedback: 3,
      },
      status: 'draft',
      createdAt: new Date().toISOString(),
    };
  },

  async getSurveys(): Promise<AIAdaptedSurvey[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_AI_ADAPTED_SURVEYS;
  },

  async getSurveyById(surveyId: string): Promise<AIAdaptedSurvey | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_AI_ADAPTED_SURVEYS.find((s) => s.id === surveyId) || null;
  },

  async getSurveysByExperienceType(experienceType: ExperienceType): Promise<AIAdaptedSurvey[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_AI_ADAPTED_SURVEYS.filter((s) => s.experienceType === experienceType);
  },

  async sendSurvey(surveyId: string): Promise<AIAdaptedSurvey> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const survey = MOCK_AI_ADAPTED_SURVEYS.find((s) => s.id === surveyId);
    if (!survey) {
      throw new Error('Survey not found');
    }
    return {
      ...survey,
      status: 'sent',
      updatedAt: new Date().toISOString(),
    };
  },

  async getSurveyStats(period: ReferralImpactPeriod = '30d'): Promise<AIAdaptedSurveyStats[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_AI_ADAPTED_SURVEY_STATS;
  },

  async getSurveyResponses(surveyId: string): Promise<AIAdaptedSurveyResponse[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    // Simular respuestas
    return [];
  },

  async updateTemplate(templateId: string, updates: Partial<AIAdaptedSurveyTemplate>): Promise<AIAdaptedSurveyTemplate> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const template = MOCK_AI_ADAPTED_SURVEY_TEMPLATES.find((t) => t.id === templateId);
    if (!template) {
      throw new Error('Template not found');
    }
    return {
      ...template,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
  },
};

