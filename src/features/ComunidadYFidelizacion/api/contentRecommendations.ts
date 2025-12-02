import {
  ContentRecommendationsConfig,
  FeedbackAnalysis,
  ContentRecommendation,
  CommunicationRecommendation,
  FeedbackSource,
  Testimonial,
  FeedbackInsight,
} from '../types';

// Mock data para recomendaciones
const MOCK_CONTENT_RECOMMENDATIONS_CONFIG: ContentRecommendationsConfig = {
  id: 'content_recommendations_config_001',
  trainerId: 'trainer_001',
  enabled: true,
  feedbackAnalysis: {
    enabled: true,
    frequency: 'weekly',
    sources: ['survey', 'testimonial', 'review', 'nps', 'csat', 'feedback-form'],
    minFeedbackCount: 10,
  },
  contentRecommendations: {
    enabled: true,
    autoGenerate: true,
    minConfidence: 70,
    maxRecommendations: 10,
  },
  communicationRecommendations: {
    enabled: true,
    autoGenerate: true,
    minConfidence: 70,
    maxRecommendations: 5,
  },
  stats: {
    totalRecommendationsGenerated: 45,
    totalRecommendationsAccepted: 32,
    totalRecommendationsImplemented: 28,
    averageImpact: 78,
  },
  createdAt: '2025-09-01T00:00:00Z',
  updatedAt: '2025-10-15T10:00:00Z',
};

const MOCK_FEEDBACK_ANALYSIS: FeedbackAnalysis = {
  id: 'feedback_analysis_001',
  period: '30d',
  analyzedAt: '2025-10-15T10:00:00Z',
  sources: [
    {
      source: 'survey',
      count: 45,
      sentiment: 'positive',
      keyTopics: ['satisfacción', 'motivación', 'progreso'],
    },
    {
      source: 'testimonial',
      count: 23,
      sentiment: 'positive',
      keyTopics: ['transformación', 'comunidad', 'apoyo'],
    },
    {
      source: 'review',
      count: 18,
      sentiment: 'positive',
      keyTopics: ['resultados', 'profesionalismo', 'ambiente'],
    },
    {
      source: 'nps',
      count: 32,
      sentiment: 'positive',
      keyTopics: ['recomendación', 'valor', 'experiencia'],
    },
  ],
  keyTopics: [
    {
      topic: 'transformación personal',
      frequency: 28,
      sentiment: 'positive',
      impact: 'high',
      relatedFeedback: [
        'He logrado transformar mi cuerpo y mi mente',
        'La transformación ha sido increíble',
        'Me siento transformado física y mentalmente',
      ],
    },
    {
      topic: 'comunidad y apoyo',
      frequency: 22,
      sentiment: 'positive',
      impact: 'high',
      relatedFeedback: [
        'La comunidad es increíble y me apoya mucho',
        'Me encanta el apoyo mutuo en la comunidad',
        'La comunidad es lo mejor del entrenamiento',
      ],
    },
    {
      topic: 'progreso y resultados',
      frequency: 35,
      sentiment: 'positive',
      impact: 'high',
      relatedFeedback: [
        'He visto un progreso increíble en poco tiempo',
        'Los resultados son visibles y motivadores',
        'Mi progreso ha superado mis expectativas',
      ],
    },
    {
      topic: 'disciplina y consistencia',
      frequency: 19,
      sentiment: 'positive',
      impact: 'medium',
      relatedFeedback: [
        'La disciplina es clave para el éxito',
        'La consistencia me ha ayudado mucho',
        'He aprendido a ser más disciplinado',
      ],
    },
  ],
  aiInsights: {
    trends: [
      'Los clientes valoran mucho la transformación personal',
      'La comunidad es un factor clave de satisfacción',
      'El progreso visible motiva a los clientes',
    ],
    opportunities: [
      'Crear más contenido sobre transformación personal',
      'Destacar historias de éxito de la comunidad',
      'Compartir más testimonios de progreso',
    ],
    risks: [
      'Algunos clientes mencionan falta de variedad en ejercicios',
      'Algunos clientes piden más flexibilidad en horarios',
    ],
    recommendations: [
      'Crear contenido sobre transformación personal',
      'Comunicar más sobre la comunidad y el apoyo mutuo',
      'Destacar más historias de progreso y resultados',
    ],
  },
  overallSentiment: {
    positive: 85,
    neutral: 12,
    negative: 3,
    score: 91,
  },
};

const MOCK_CONTENT_RECOMMENDATIONS: ContentRecommendation[] = [
  {
    id: 'content_rec_001',
    type: 'content',
    title: 'Crear contenido sobre transformación personal',
    description: 'Basado en feedback positivo sobre transformación personal, crea contenido que inspire y motive a los clientes',
    basedOnFeedback: {
      feedbackIds: ['feedback_001', 'feedback_002', 'feedback_003'],
      topics: ['transformación personal', 'progreso', 'resultados'],
      sentiment: 'positive',
      keyInsights: [
        'Los clientes valoran mucho la transformación personal',
        'El progreso visible motiva a los clientes',
        'Las historias de éxito inspiran a otros',
      ],
    },
    recommendation: {
      contentType: 'video',
      topic: 'Transformación personal: historias de éxito',
      suggestedTitle: 'Transformaciones Reales: Historias de Éxito de Nuestra Comunidad',
      suggestedContent: 'Crea un video destacando 3-5 historias de transformación de clientes, mostrando su progreso y los valores que los llevaron al éxito. Incluye testimonios en video y métricas de progreso.',
      suggestedCTA: '¿Listo para tu propia transformación? Únete a nuestra comunidad',
      targetAudience: ['embajador', 'regular', 'nuevo'],
      platform: 'instagram',
      timing: 'Publicar durante la semana en horarios de mayor engagement (19:00-21:00)',
    },
    priority: 'high',
    expectedImpact: {
      engagement: 85,
      satisfaction: 90,
      retention: 80,
      description: 'Este contenido puede aumentar el engagement en un 85%, mejorar la satisfacción en un 90% y aumentar la retención en un 80%',
    },
    aiGenerated: true,
    aiMetadata: {
      generatedAt: '2025-10-15T10:00:00Z',
      reasoning: 'Basado en feedback positivo sobre transformación personal (28 menciones, impacto alto)',
      confidence: 92,
      alignmentWithFeedback: 95,
    },
    status: 'pending',
    createdAt: '2025-10-15T10:00:00Z',
  },
  {
    id: 'content_rec_002',
    type: 'content',
    title: 'Destacar historias de la comunidad',
    description: 'Crea contenido que destaque el valor de la comunidad y el apoyo mutuo',
    basedOnFeedback: {
      feedbackIds: ['feedback_004', 'feedback_005'],
      topics: ['comunidad', 'apoyo mutuo', 'satisfacción'],
      sentiment: 'positive',
      keyInsights: [
        'La comunidad es un factor clave de satisfacción',
        'El apoyo mutuo es muy valorado',
        'Los clientes disfrutan de la interacción comunitaria',
      ],
    },
    recommendation: {
      contentType: 'post',
      topic: 'Comunidad y apoyo mutuo',
      suggestedTitle: 'La Comunidad que Nos Hace Más Fuertes',
      suggestedContent: 'Crea un post destacando momentos de la comunidad, testimonios sobre el apoyo mutuo, y cómo la comunidad ha ayudado a los clientes a alcanzar sus objetivos.',
      suggestedCTA: 'Únete a nuestra comunidad y experimenta el apoyo mutuo',
      targetAudience: ['nuevo', 'regular'],
      platform: 'facebook',
      timing: 'Publicar el fin de semana cuando hay más tiempo para leer',
    },
    priority: 'medium',
    expectedImpact: {
      engagement: 75,
      satisfaction: 85,
      retention: 70,
      description: 'Este contenido puede aumentar el engagement en un 75%, mejorar la satisfacción en un 85% y aumentar la retención en un 70%',
    },
    aiGenerated: true,
    aiMetadata: {
      generatedAt: '2025-10-15T10:00:00Z',
      reasoning: 'Basado en feedback positivo sobre comunidad (22 menciones, impacto alto)',
      confidence: 88,
      alignmentWithFeedback: 92,
    },
    status: 'pending',
    createdAt: '2025-10-15T10:00:00Z',
  },
];

const MOCK_COMMUNICATION_RECOMMENDATIONS: CommunicationRecommendation[] = [
  {
    id: 'comm_rec_001',
    type: 'communication',
    title: 'Enviar mensaje de agradecimiento a clientes activos',
    description: 'Basado en feedback positivo sobre progreso, envía mensajes de agradecimiento a clientes que han demostrado progreso constante',
    basedOnFeedback: {
      feedbackIds: ['feedback_006', 'feedback_007'],
      topics: ['progreso', 'resultados', 'satisfacción'],
      sentiment: 'positive',
      keyInsights: [
        'Los clientes valoran el reconocimiento de su progreso',
        'El feedback positivo aumenta la motivación',
        'La comunicación personalizada es muy apreciada',
      ],
      clientSegment: 'embajador',
    },
    recommendation: {
      communicationType: 'whatsapp',
      message: '¡Hola {nombre}! 👋 Queríamos agradecerte por tu compromiso constante y tu progreso increíble. Tu dedicación inspira a toda nuestra comunidad. 💪✨ ¿Cómo te sientes con tu progreso?',
      tone: 'cercano',
      timing: 'Enviar durante la semana en horario de tarde (16:00-18:00)',
      targetAudience: ['embajador', 'regular'],
      personalization: {
        variables: ['nombre', 'progreso', 'objetivo'],
        examples: {
          nombre: 'Laura',
          progreso: '15 sesiones completadas',
          objetivo: 'pérdida de peso',
        },
      },
    },
    priority: 'high',
    expectedImpact: {
      responseRate: 80,
      satisfaction: 90,
      engagement: 85,
      description: 'Este mensaje puede aumentar la tasa de respuesta en un 80%, mejorar la satisfacción en un 90% y aumentar el engagement en un 85%',
    },
    aiGenerated: true,
    aiMetadata: {
      generatedAt: '2025-10-15T10:00:00Z',
      reasoning: 'Basado en feedback positivo sobre progreso (35 menciones, impacto alto)',
      confidence: 90,
      alignmentWithFeedback: 93,
    },
    status: 'pending',
    createdAt: '2025-10-15T10:00:00Z',
  },
  {
    id: 'comm_rec_002',
    type: 'communication',
    title: 'Enviar encuesta de satisfacción a clientes nuevos',
    description: 'Basado en feedback positivo sobre la experiencia inicial, envía una encuesta de satisfacción a clientes nuevos para recopilar más feedback',
    basedOnFeedback: {
      feedbackIds: ['feedback_008'],
      topics: ['experiencia inicial', 'satisfacción', 'bienvenida'],
      sentiment: 'positive',
      keyInsights: [
        'Los clientes nuevos valoran la bienvenida y el apoyo inicial',
        'La experiencia inicial es crucial para la retención',
        'El feedback temprano ayuda a identificar áreas de mejora',
      ],
      clientSegment: 'nuevo',
    },
    recommendation: {
      communicationType: 'email',
      subject: '¿Cómo ha sido tu primera semana con nosotros?',
      message: '¡Hola {nombre}! 👋 Esperamos que tu primera semana haya sido increíble. Queremos conocer tu experiencia y cómo podemos ayudarte mejor. Por favor, comparte tu feedback con nosotros. 💪✨',
      tone: 'cercano',
      timing: 'Enviar después de la primera semana (7 días después del registro)',
      targetAudience: ['nuevo'],
      personalization: {
        variables: ['nombre', 'dias_como_cliente'],
        examples: {
          nombre: 'Carlos',
          dias_como_cliente: '7',
        },
      },
    },
    priority: 'medium',
    expectedImpact: {
      responseRate: 60,
      satisfaction: 85,
      engagement: 70,
      description: 'Este mensaje puede aumentar la tasa de respuesta en un 60%, mejorar la satisfacción en un 85% y aumentar el engagement en un 70%',
    },
    aiGenerated: true,
    aiMetadata: {
      generatedAt: '2025-10-15T10:00:00Z',
      reasoning: 'Basado en feedback positivo sobre experiencia inicial',
      confidence: 85,
      alignmentWithFeedback: 88,
    },
    status: 'pending',
    createdAt: '2025-10-15T10:00:00Z',
  },
];

export const ContentRecommendationsAPI = {
  async getConfig(trainerId?: string): Promise<ContentRecommendationsConfig | null> {
    await delay(200);
    return cloneData(MOCK_CONTENT_RECOMMENDATIONS_CONFIG);
  },

  async saveConfig(config: Partial<ContentRecommendationsConfig>): Promise<ContentRecommendationsConfig> {
    await delay(300);
    const updated = {
      ...MOCK_CONTENT_RECOMMENDATIONS_CONFIG,
      ...config,
      updatedAt: new Date().toISOString(),
    };
    return cloneData(updated);
  },

  async analyzeFeedback(
    period: '30d' | '90d' | '12m' = '30d',
    sources?: FeedbackSource[]
  ): Promise<FeedbackAnalysis> {
    await delay(500);
    // Simulación de análisis de feedback
    const analysis = {
      ...MOCK_FEEDBACK_ANALYSIS,
      id: `feedback_analysis_${Date.now()}`,
      period,
      analyzedAt: new Date().toISOString(),
      sources: sources
        ? MOCK_FEEDBACK_ANALYSIS.sources.filter((s) => sources.includes(s.source))
        : MOCK_FEEDBACK_ANALYSIS.sources,
    };
    return cloneData(analysis);
  },

  async getContentRecommendations(status?: 'pending' | 'accepted' | 'rejected' | 'implemented'): Promise<ContentRecommendation[]> {
    await delay(200);
    if (status) {
      return cloneData(MOCK_CONTENT_RECOMMENDATIONS.filter((r) => r.status === status));
    }
    return cloneData(MOCK_CONTENT_RECOMMENDATIONS);
  },

  async generateContentRecommendations(
    feedbackAnalysis: FeedbackAnalysis,
    count: number = 5
  ): Promise<ContentRecommendation[]> {
    await delay(800);
    // Simulación de generación de recomendaciones basadas en análisis de feedback
    const recommendations: ContentRecommendation[] = [];

    // Generar recomendaciones basadas en los temas principales
    feedbackAnalysis.keyTopics.slice(0, count).forEach((topic, index) => {
      const recommendation: ContentRecommendation = {
        id: `content_rec_${Date.now()}_${index}`,
        type: 'content',
        title: `Crear contenido sobre ${topic.topic}`,
        description: `Basado en feedback ${topic.sentiment} sobre ${topic.topic}, crea contenido que ${topic.sentiment === 'positive' ? 'inspire y motive' : 'aborde y mejore'} este tema`,
        basedOnFeedback: {
          feedbackIds: [`feedback_${index}`],
          topics: [topic.topic],
          sentiment: topic.sentiment,
          keyInsights: topic.relatedFeedback.slice(0, 3),
        },
        recommendation: {
          contentType: topic.impact === 'high' ? 'video' : 'post',
          topic: topic.topic,
          suggestedTitle: `Contenido sobre ${topic.topic}`,
          suggestedContent: `Crea contenido sobre ${topic.topic} basado en el feedback recibido. ${topic.sentiment === 'positive' ? 'Destaca los aspectos positivos' : 'Aborda las áreas de mejora'}.`,
          suggestedCTA: '¿Quieres saber más? Únete a nuestra comunidad',
          targetAudience: ['embajador', 'regular'],
          platform: 'instagram',
          timing: 'Publicar durante la semana',
        },
        priority: topic.impact === 'high' ? 'high' : 'medium',
        expectedImpact: {
          engagement: topic.impact === 'high' ? 85 : 70,
          satisfaction: topic.impact === 'high' ? 90 : 75,
          retention: topic.impact === 'high' ? 80 : 65,
          description: `Este contenido puede tener un impacto ${topic.impact} en engagement, satisfacción y retención`,
        },
        aiGenerated: true,
        aiMetadata: {
          generatedAt: new Date().toISOString(),
          reasoning: `Basado en feedback sobre ${topic.topic} (${topic.frequency} menciones, impacto ${topic.impact})`,
          confidence: topic.impact === 'high' ? 90 : 75,
          alignmentWithFeedback: 95,
        },
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      recommendations.push(recommendation);
    });

    return cloneData(recommendations);
  },

  async acceptContentRecommendation(recommendationId: string): Promise<ContentRecommendation> {
    await delay(200);
    const recommendation = MOCK_CONTENT_RECOMMENDATIONS.find((r) => r.id === recommendationId);
    if (!recommendation) {
      throw new Error(`Recommendation ${recommendationId} no encontrada`);
    }
    const updated = {
      ...recommendation,
      status: 'accepted' as const,
      acceptedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return cloneData(updated);
  },

  async rejectContentRecommendation(recommendationId: string, reason: string): Promise<ContentRecommendation> {
    await delay(200);
    const recommendation = MOCK_CONTENT_RECOMMENDATIONS.find((r) => r.id === recommendationId);
    if (!recommendation) {
      throw new Error(`Recommendation ${recommendationId} no encontrada`);
    }
    const updated = {
      ...recommendation,
      status: 'rejected' as const,
      rejectedAt: new Date().toISOString(),
      rejectionReason: reason,
      updatedAt: new Date().toISOString(),
    };
    return cloneData(updated);
  },

  async getCommunicationRecommendations(status?: 'pending' | 'accepted' | 'rejected' | 'implemented'): Promise<CommunicationRecommendation[]> {
    await delay(200);
    if (status) {
      return cloneData(MOCK_COMMUNICATION_RECOMMENDATIONS.filter((r) => r.status === status));
    }
    return cloneData(MOCK_COMMUNICATION_RECOMMENDATIONS);
  },

  async generateCommunicationRecommendations(
    feedbackAnalysis: FeedbackAnalysis,
    count: number = 3
  ): Promise<CommunicationRecommendation[]> {
    await delay(800);
    // Simulación de generación de recomendaciones de comunicación basadas en análisis de feedback
    const recommendations: CommunicationRecommendation[] = [];

    // Generar recomendaciones basadas en los temas principales
    feedbackAnalysis.keyTopics.slice(0, count).forEach((topic, index) => {
      const recommendation: CommunicationRecommendation = {
        id: `comm_rec_${Date.now()}_${index}`,
        type: 'communication',
        title: `Enviar comunicación sobre ${topic.topic}`,
        description: `Basado en feedback ${topic.sentiment} sobre ${topic.topic}, envía una comunicación que ${topic.sentiment === 'positive' ? 'reconozca y celebre' : 'aborde y mejore'} este tema`,
        basedOnFeedback: {
          feedbackIds: [`feedback_${index}`],
          topics: [topic.topic],
          sentiment: topic.sentiment,
          keyInsights: topic.relatedFeedback.slice(0, 3),
          clientSegment: index % 2 === 0 ? 'embajador' : 'regular',
        },
        recommendation: {
          communicationType: index % 2 === 0 ? 'whatsapp' : 'email',
          subject: index % 2 === 1 ? `Actualización sobre ${topic.topic}` : undefined,
          message: `¡Hola {nombre}! 👋 Basado en el feedback de nuestra comunidad sobre ${topic.topic}, queríamos ${topic.sentiment === 'positive' ? 'celebrar y reconocer' : 'abordar y mejorar'} este aspecto. ${topic.sentiment === 'positive' ? '¡Gracias por ser parte de nuestra comunidad!' : 'Estamos trabajando para mejorar continuamente.'} 💪✨`,
          tone: topic.sentiment === 'positive' ? 'celebratorio' : 'empatico',
          timing: 'Enviar durante la semana en horario de tarde',
          targetAudience: ['embajador', 'regular'],
          personalization: {
            variables: ['nombre'],
            examples: {
              nombre: 'Cliente',
            },
          },
        },
        priority: topic.impact === 'high' ? 'high' : 'medium',
        expectedImpact: {
          responseRate: topic.impact === 'high' ? 80 : 60,
          satisfaction: topic.impact === 'high' ? 90 : 75,
          engagement: topic.impact === 'high' ? 85 : 70,
          description: `Esta comunicación puede tener un impacto ${topic.impact} en respuesta, satisfacción y engagement`,
        },
        aiGenerated: true,
        aiMetadata: {
          generatedAt: new Date().toISOString(),
          reasoning: `Basado en feedback sobre ${topic.topic} (${topic.frequency} menciones, impacto ${topic.impact})`,
          confidence: topic.impact === 'high' ? 90 : 75,
          alignmentWithFeedback: 95,
        },
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      recommendations.push(recommendation);
    });

    return cloneData(recommendations);
  },

  async acceptCommunicationRecommendation(recommendationId: string): Promise<CommunicationRecommendation> {
    await delay(200);
    const recommendation = MOCK_COMMUNICATION_RECOMMENDATIONS.find((r) => r.id === recommendationId);
    if (!recommendation) {
      throw new Error(`Recommendation ${recommendationId} no encontrada`);
    }
    const updated = {
      ...recommendation,
      status: 'accepted' as const,
      acceptedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return cloneData(updated);
  },

  async rejectCommunicationRecommendation(recommendationId: string, reason: string): Promise<CommunicationRecommendation> {
    await delay(200);
    const recommendation = MOCK_COMMUNICATION_RECOMMENDATIONS.find((r) => r.id === recommendationId);
    if (!recommendation) {
      throw new Error(`Recommendation ${recommendationId} no encontrada`);
    }
    const updated = {
      ...recommendation,
      status: 'rejected' as const,
      rejectedAt: new Date().toISOString(),
      rejectionReason: reason,
      updatedAt: new Date().toISOString(),
    };
    return cloneData(updated);
  },
};

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function cloneData<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value)) as T;
}

