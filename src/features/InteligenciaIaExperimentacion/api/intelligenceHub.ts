import {
  IntelligenceOverviewResponse,
  IntelligenceProfile,
  StrategicPillars,
  DecisionStyle,
  AIOverviewResponse,
  AIPrioritizationResponse,
  PrioritizedAction,
  ResourceConstraint,
  GenerateCompletePlaybookRequest,
  GenerateCompletePlaybookResponse,
  ConvertInsightToPlaybookRequest,
  ConvertInsightToPlaybookResponse,
  PlaybookRecord,
  IntelligenceInsight,
  TeamMember,
  SharePlaybookRequest,
  SharePlaybookResponse,
  PlaybookShare,
  GetAIExperimentSuggestionsRequest,
  GetAIExperimentSuggestionsResponse,
  AIExperimentSuggestion,
  CreateExperimentFromSuggestionRequest,
  CreateExperimentFromSuggestionResponse,
  ExperimentRecord,
  GetExperimentInsightRequest,
  GetExperimentInsightResponse,
  ExperimentInsight,
  ScalingRecommendation,
  RecordExperimentLessonRequest,
  RecordExperimentLessonResponse,
  ExperimentLesson,
  GetExperimentLessonsRequest,
  GetExperimentLessonsResponse,
  GetRelevantLessonsForExperimentRequest,
  GetRelevantLessonsForExperimentResponse,
  GeneratePersonalizedJourneyRequest,
  GeneratePersonalizedJourneyResponse,
  DetectMicroSegmentsRequest,
  DetectMicroSegmentsResponse,
  GetOfferSuggestionsRequest,
  GetOfferSuggestionsResponse,
  GetPersonalizationImpactRequest,
  GetPersonalizationImpactResponse,
  PersonalizationImpactSnapshot,
  GetIntegratedAIViewRequest,
  GetIntegratedAIViewResponse,
  IntegratedAIView,
  GenerateNegativeFeedbackMicroPlanRequest,
  GenerateNegativeFeedbackMicroPlanResponse,
  NegativeFeedbackMicroPlan,
  GetNegativeFeedbackMicroPlansRequest,
  GetNegativeFeedbackMicroPlansResponse,
  GeneratePositiveFeedbackCampaignRequest,
  GeneratePositiveFeedbackCampaignResponse,
  PositiveFeedbackCampaign,
  CampaignSuggestion,
  AutoActivateCampaignRequest,
  AutoActivateCampaignResponse,
  GetPositiveFeedbackCampaignsRequest,
  GetPositiveFeedbackCampaignsResponse,
  CustomerFeedbackData,
  GetChannelInsightsRequest,
  ChannelInsightsResponse,
  ChannelInsight,
  ChannelRecommendation,
  ChannelType,
  GetMarketTrendsAlertsRequest,
  MarketTrendsAlertsResponse,
  MarketTrendAlert,
  CompetitorMovementAlert,
  MarketTrendType,
  CompetitorMovementType,
  GenerateQuarterlyPlanRequest,
  GenerateQuarterlyPlanResponse,
  GetQuarterlyPlanRequest,
  GetQuarterlyPlanResponse,
  UpdateQuarterlyPlanRequest,
  UpdateQuarterlyPlanResponse,
  QuarterlyPlan,
  OKRData,
  RoadmapItem,
  AssignOwnerRequest,
  AssignOwnerResponse,
  UpdateOwnershipProgressRequest,
  UpdateOwnershipProgressResponse,
  GetOwnershipAssignmentsRequest,
  GetOwnershipAssignmentsResponse,
  OwnershipAssignment,
  OwnershipStatus,
  // User Story 1: Aprobar experimentos/playbooks desde móvil con resumen IA
  ApprovalStatus,
  ApprovalItemType,
  AISummary,
  MobileApproval,
  GenerateAISummaryRequest,
  GenerateAISummaryResponse,
  ApproveItemRequest,
  ApproveItemResponse,
  GetPendingApprovalsRequest,
  GetPendingApprovalsResponse,
  // User Story 2: Sincronizar playbooks con otras sedes o entrenadores
  Location,
  Trainer,
  SyncStatus,
  PlaybookSync,
  SyncPlaybookRequest,
  SyncPlaybookResponse,
  GetSyncStatusRequest,
  GetSyncStatusResponse,
  GetAvailableLocationsRequest,
  GetAvailableLocationsResponse,
  GetAvailableTrainersRequest,
  GetAvailableTrainersResponse,
  ResolveSyncConflictRequest,
  ResolveSyncConflictResponse,
  // User Story 1: IA que aprende de decisiones de playbooks
  PlaybookDecision,
  PlaybookDecisionAction,
  PlaybookLearningProfile,
  PlaybookLearningInsights,
  RecordPlaybookDecisionRequest,
  RecordPlaybookDecisionResponse,
  GetPlaybookLearningProfileRequest,
  GetPlaybookLearningProfileResponse,
  GetPlaybookLearningInsightsRequest,
  GetPlaybookLearningInsightsResponse,
  // User Story 2: Evaluación automática de impacto de iniciativas
  InitiativeRepeatRecommendation,
  InitiativeImpactMetrics,
  InitiativeImpactEvaluation,
  EvaluateInitiativeImpactRequest,
  EvaluateInitiativeImpactResponse,
  GetInitiativeImpactEvaluationsRequest,
  GetInitiativeImpactEvaluationsResponse,
  // User Story 1: Retrospectivas IA mensuales
  MonthlyAchievement,
  NextFocus,
  MonthlyRetrospective,
  GetMonthlyRetrospectiveRequest,
  GetMonthlyRetrospectiveResponse,
  GenerateMonthlyRetrospectiveRequest,
  GenerateMonthlyRetrospectiveResponse,
  GetMonthlyRetrospectivesHistoryRequest,
  GetMonthlyRetrospectivesHistoryResponse,
} from '../types';

// Mock storage for intelligence profile (in production, this would be an API call)
let intelligenceProfileStorage: IntelligenceProfile | null = null;
let sharedPlaybooksStorage: PlaybookShare[] = [];
let experimentRecordsStorage: ExperimentRecord[] = [];

/**
 * Mock API call for the Inteligencia, IA & Experimentación feature.
 * Replace with real API integration when backend endpoints are available.
 */
export const fetchIntelligenceOverview = async (): Promise<IntelligenceOverviewResponse> => {
  return Promise.resolve({
    metrics: [
      {
        id: 'playbooks',
        title: 'Playbooks activos',
        value: '12',
        subtitle: 'Lanzados este trimestre',
        trend: {
          value: 18,
          direction: 'up',
          label: 'vs trimestre anterior',
        },
        color: 'primary',
      },
      {
        id: 'experiments',
        title: 'Experimentos en marcha',
        value: '8',
        subtitle: 'A/B Tests y multivariantes',
        trend: {
          value: 3,
          direction: 'up',
          label: 'nuevos esta semana',
        },
        color: 'info',
      },
      {
        id: 'personalization',
        title: 'Personalizaciones activas',
        value: '24',
        subtitle: 'Segmentos personalizados',
        trend: {
          value: 6,
          direction: 'up',
          label: 'últimos 30 días',
        },
        color: 'success',
      },
      {
        id: 'insights',
        title: 'Insights detectados',
        value: '5',
        subtitle: 'Últimos 7 días',
        trend: {
          value: 2,
          direction: 'up',
          label: 'nuevos hallazgos',
        },
        color: 'warning',
      },
    ],
    playbooks: [
      {
        id: 'pb-001',
        name: 'Onboarding Premium 30 días',
        objective: 'Incrementar engagement inicial',
        channels: ['Email', 'SMS', 'In-App'],
        owner: 'Equipo Growth',
        status: 'active',
        impact: 'Alto',
      },
      {
        id: 'pb-002',
        name: 'Reactivación clientes dormidos',
        objective: 'Recuperar clientes inactivos 60+',
        channels: ['Email', 'WhatsApp'],
        owner: 'Marketing Automation',
        status: 'draft',
        impact: 'Medio',
      },
      {
        id: 'pb-003',
        name: 'Fidelización ambassadors',
        objective: 'Potenciar referencias orgánicas',
        channels: ['Comunidad', 'Eventos'],
        owner: 'Community',
        status: 'paused',
        impact: 'Alto',
      },
    ],
    feedbackLoops: [
      {
        id: 'fb-001',
        title: 'Pulse semanal clientes premium',
        audience: 'Segmento VIP',
        lastRun: '2025-11-05',
        responseRate: 62,
        status: 'active',
      },
      {
        id: 'fb-002',
        title: 'Encuesta abandono clases',
        audience: 'Clientes churn riesgo',
        lastRun: '2025-11-01',
        responseRate: 48,
        status: 'scheduled',
      },
    ],
    experiments: [
      {
        id: 'exp-001',
        name: 'Hero landing IA vs estática',
        hypothesis: 'El copy personalizado aumenta conversiones',
        status: 'running',
        primaryMetric: 'CTR',
        uplift: 12,
      },
      {
        id: 'exp-002',
        name: 'Secuencia nutrición personalización',
        hypothesis: 'Contenido adaptado mejora retención',
        status: 'planned',
        primaryMetric: 'Retención 30d',
        uplift: null,
      },
      {
        id: 'exp-003',
        name: 'Test de pricing premium',
        hypothesis: 'Precio dinámico aumenta conversión',
        status: 'completed',
        primaryMetric: 'Conversión',
        uplift: 18,
      },
      {
        id: 'exp-004',
        name: 'Email subject lines A/B',
        hypothesis: 'Subject personalizado mejora apertura',
        status: 'completed',
        primaryMetric: 'Open Rate',
        uplift: 8,
      },
      {
        id: 'exp-005',
        name: 'Onboarding flow simplificado',
        hypothesis: 'Menos pasos aumenta completitud',
        status: 'running',
        primaryMetric: 'Completion Rate',
        uplift: null,
      },
    ],
    topCampaigns: [
      {
        id: 'camp-001',
        name: 'Onboarding Premium Q4',
        channel: 'Email + SMS',
        conversionRate: 24.5,
        revenue: 125000,
        engagementRate: 68.2,
        sent: 5000,
        converted: 1225,
      },
      {
        id: 'camp-002',
        name: 'Reactivación Inactivos 60+',
        channel: 'WhatsApp',
        conversionRate: 18.3,
        revenue: 89000,
        engagementRate: 72.1,
        sent: 3200,
        converted: 586,
      },
      {
        id: 'camp-003',
        name: 'Promoción Black Friday',
        channel: 'Email + Push',
        conversionRate: 31.2,
        revenue: 245000,
        engagementRate: 75.8,
        sent: 8500,
        converted: 2652,
      },
    ],
    insights: [
      {
        id: 'ins-001',
        title: 'Tendencia: HIIT híbrido + mindfulness',
        description: 'Incremento 22% en búsquedas y conversaciones sociales',
        source: 'Trend Analyzer',
        severity: 'medium',
        canConvertToPlaybook: true,
        playbookSuggestion: {
          suggestedName: 'Playbook: Capitalizar tendencia HIIT + mindfulness',
          suggestedObjective: 'Captar clientes interesados en HIIT híbrido con mindfulness',
          suggestedChannels: ['Email', 'Social Media', 'Blog'],
          estimatedImpact: 'Alto',
        },
      },
      {
        id: 'ins-002',
        title: 'Competidor lanza programa corporativo',
        description: 'GymX anunció paquetes B2B con IA de bienestar',
        source: 'Competitive Intelligence',
        severity: 'high',
        canConvertToPlaybook: true,
        playbookSuggestion: {
          suggestedName: 'Playbook: Respuesta competitiva programa corporativo',
          suggestedObjective: 'Desarrollar y lanzar programa corporativo competitivo',
          suggestedChannels: ['Email', 'LinkedIn', 'Webinars'],
          estimatedImpact: 'Alto',
        },
      },
      {
        id: 'ins-003',
        title: 'Mayor satisfacción en entrenadores online',
        description: 'NPS +15 puntos en cohortes con soporte IA',
        source: 'Feedback Loop',
        severity: 'low',
        canConvertToPlaybook: true,
        playbookSuggestion: {
          suggestedName: 'Playbook: Ampliar entrenadores online con soporte IA',
          suggestedObjective: 'Ampliar programa de entrenadores online con soporte IA',
          suggestedChannels: ['Email', 'Social Media'],
          estimatedImpact: 'Medio',
        },
      },
    ],
    upcomingSends: [
      {
        id: 'send-001',
        name: 'Recordatorio de sesión mañana',
        type: 'automation',
        scheduledDate: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(), // 20 horas desde ahora
        channel: 'WhatsApp',
        recipientCount: 8,
        status: 'scheduled',
      },
      {
        id: 'send-002',
        name: 'Seguimiento de progreso quincenal',
        type: 'scheduled_message',
        scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 días desde ahora
        channel: 'Email',
        recipientCount: 24,
        status: 'scheduled',
      },
      {
        id: 'send-003',
        name: 'Recordatorio de pago pendiente',
        type: 'automation',
        scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 días desde ahora
        channel: 'SMS',
        recipientCount: 3,
        status: 'scheduled',
      },
      {
        id: 'send-004',
        name: 'Check-in mensual de objetivos',
        type: 'playbook',
        scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 días desde ahora
        channel: 'Email',
        recipientCount: 15,
        status: 'scheduled',
      },
    ],
    objectives: [
      {
        id: 'obj-001',
        name: 'Nuevos clientes',
        currentValue: 145,
        targetValue: 200,
        unit: 'clientes',
      },
      {
        id: 'obj-002',
        name: 'Clientes reactivados',
        currentValue: 32,
        targetValue: 50,
        unit: 'clientes',
      },
      {
        id: 'obj-003',
        name: 'Leads generados',
        currentValue: 420,
        targetValue: 500,
        unit: 'leads',
      },
    ],
    campaignPerformanceMetric: {
      type: 'roi',
      value: 3.8,
      previousMonthValue: 3.2,
      percentageChange: 18.75,
      label: 'ROI Estimado',
      unit: 'x',
    },
    sectorTrends: {
      successfulStrategies: [
        {
          id: 'strategy-001',
          category: 'strategy',
          title: 'Micro-influencers generan 3x más engagement',
          description: 'Campañas con influencers de 10K-50K seguidores muestran mayor tasa de conversión',
          impact: 'high',
        },
        {
          id: 'strategy-002',
          category: 'strategy',
          title: 'Gamificación aumenta retención 40%',
          description: 'Programas con badges y recompensas muestran mejor retención a 90 días',
          impact: 'high',
        },
        {
          id: 'strategy-003',
          category: 'strategy',
          title: 'Contenido educativo supera promocional',
          description: 'Posts educativos generan 2.5x más leads que contenido promocional directo',
          impact: 'medium',
        },
      ],
      bestPostingTimes: [
        {
          id: 'timing-001',
          category: 'timing',
          title: 'Martes y Miércoles 9-11 AM',
          description: 'Mayor engagement en estos días y horarios para contenido de fitness',
          impact: 'high',
        },
        {
          id: 'timing-002',
          category: 'timing',
          title: 'Viernes 6-8 PM para promociones',
          description: 'Mejor momento para publicar ofertas y promociones especiales',
          impact: 'medium',
        },
        {
          id: 'timing-003',
          category: 'timing',
          title: 'Domingos 10-12 AM para contenido motivacional',
          description: 'Contenido inspiracional tiene mayor alcance los domingos por la mañana',
          impact: 'medium',
        },
      ],
      topContentTypes: [
        {
          id: 'content-001',
          category: 'content',
          title: 'Videos cortos (30-60 seg)',
          description: 'Videos cortos generan 4x más leads que imágenes estáticas',
          impact: 'high',
        },
        {
          id: 'content-002',
          category: 'content',
          title: 'Testimonios con resultados',
          description: 'Contenido con antes/después y métricas reales aumenta conversión 35%',
          impact: 'high',
        },
        {
          id: 'content-003',
          category: 'content',
          title: 'Guías paso a paso',
          description: 'Contenido educativo en formato guía genera más leads cualificados',
          impact: 'medium',
        },
      ],
    },
  });
};

/**
 * Obtiene el perfil de inteligencia del entrenador
 */
export const fetchIntelligenceProfile = async (trainerId?: string): Promise<IntelligenceProfile | null> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  // En producción, esto haría una llamada real a la API
  // Por ahora, retornamos el perfil almacenado en memoria o null
  if (intelligenceProfileStorage) {
    return intelligenceProfileStorage;
  }
  
  return null;
};

/**
 * Guarda o actualiza el perfil de inteligencia del entrenador
 */
export const saveIntelligenceProfile = async (
  strategicPillars: StrategicPillars,
  decisionStyle: DecisionStyle,
  trainerId?: string
): Promise<IntelligenceProfile> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const now = new Date().toISOString();
  const profileId = trainerId || 'trn_current'; // En producción vendría del contexto de autenticación
  
  const profile: IntelligenceProfile = {
    trainerId: profileId,
    strategicPillars,
    decisionStyle,
    updatedAt: now,
  };
  
  // En producción, esto haría una llamada real a la API
  intelligenceProfileStorage = profile;
  
  return profile;
};

// User Story 1: Compartir playbooks con el equipo - miembros disponibles
const mockTeamMembers: TeamMember[] = [
  {
    id: 'tm-001',
    name: 'María López',
    email: 'maria.lopez@example.com',
    role: 'marketing_manager',
    avatar: 'https://i.pravatar.cc/100?img=12',
    isActive: true,
  },
  {
    id: 'tm-002',
    name: 'Carlos García',
    email: 'carlos.garcia@example.com',
    role: 'entrenador',
    avatar: 'https://i.pravatar.cc/100?img=21',
    isActive: true,
  },
  {
    id: 'tm-003',
    name: 'Laura Fernández',
    email: 'laura.fernandez@example.com',
    role: 'community_manager',
    avatar: 'https://i.pravatar.cc/100?img=7',
    isActive: true,
  },
  {
    id: 'tm-004',
    name: 'Diego Martínez',
    email: 'diego.martinez@example.com',
    role: 'nutricionista',
    avatar: 'https://i.pravatar.cc/100?img=28',
    isActive: false,
  },
  {
    id: 'tm-005',
    name: 'Ana Ruiz',
    email: 'ana.ruiz@example.com',
    role: 'otro',
    avatar: 'https://i.pravatar.cc/100?img=45',
    isActive: true,
  },
];

/**
 * Obtiene los miembros del equipo disponibles para colaborar en playbooks
 */
export const getTeamMembers = async (): Promise<TeamMember[]> => {
  await new Promise((resolve) => setTimeout(resolve, 250));
  return mockTeamMembers;
};

/**
 * Comparte un playbook con miembros del equipo seleccionados
 */
export const sharePlaybook = async (
  request: SharePlaybookRequest
): Promise<SharePlaybookResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const now = new Date().toISOString();
  const recipients = mockTeamMembers.filter((member) =>
    request.teamMemberIds.includes(member.id)
  );

  const share: PlaybookShare = {
    id: `share-${Date.now()}`,
    playbookId: request.playbookId,
    sharedBy: 'trainer-current',
    sharedByName: 'Entrenador Actual',
    sharedAt: now,
    recipients,
    message: request.message,
    status: 'sent',
    accessLevel: request.accessLevel ?? 'view',
  };

  sharedPlaybooksStorage = [share, ...sharedPlaybooksStorage];

  return {
    success: true,
    message: 'Playbook compartido exitosamente con el equipo.',
    share,
  };
};

const mockExperimentSuggestions: AIExperimentSuggestion[] = [
  {
    id: 'sugg-001',
    name: 'Optimizar secuencia de onboarding con IA',
    hypothesis:
      'Personalizar los mensajes de onboarding según el estilo del entrenador incrementará la activación en la primera semana.',
    description:
      'Genera dos variantes del flujo de onboarding: una con mensajes motivacionales y otra con enfoque en métricas. La IA recomienda qué variante recibe cada lead.',
    experimentType: 'content',
    variants: [
      {
        id: 'var-001a',
        name: 'Flujo motivacional',
        description: 'Mensajes inspiracionales con foco en progreso y comunidad.',
      },
      {
        id: 'var-001b',
        name: 'Flujo orientado a métricas',
        description: 'Mensajes con métricas concretas, sesiones y objetivos semanales.',
      },
    ],
    primaryMetric: 'Activación semana 1',
    estimatedImpact: 'Alto',
    estimatedEffort: 'Medio',
    reasoning:
      'Basado en datos históricos: leads con mensajes personalizados tienen +18% de activación.',
    basedOnData: {
      trainerStyle: 'Motivador analítico',
      historicalPerformance: 'Onboarding actual 52% activación',
      audiencePreferences: 'Segmento prefiere mensajes medibles',
    },
    suggestedDuration: 14,
    expectedUplift: 15,
    priority: 9,
    canCreate: true,
  },
  {
    id: 'sugg-002',
    name: 'Test de horarios para clases híbridas',
    hypothesis:
      'Ofrecer clases híbridas en franjas personalizadas aumentará el ratio de asistencia.',
    description:
      'Prueba clases híbridas (online + presencial) en franjas matutinas vs vespertinas para segmentos con patrones diferentes.',
    experimentType: 'timing',
    variants: [
      {
        id: 'var-002a',
        name: 'Franja matutina',
        description: 'Clases híbridas entre 7:00 y 9:00.',
      },
      {
        id: 'var-002b',
        name: 'Franja vespertina',
        description: 'Clases híbridas entre 18:00 y 20:00.',
      },
    ],
    primaryMetric: 'Asistencia promedio',
    estimatedImpact: 'Medio',
    estimatedEffort: 'Bajo',
    reasoning:
      'Insights de comportamiento indican picos de interés en horarios opuestos según segmento.',
    basedOnData: {
      audiencePreferences: 'Segmento corporativo vs emprendedores',
      marketTrends: 'Tendencia global a flexibilizar horarios híbridos',
    },
    suggestedDuration: 10,
    expectedUplift: 8,
    priority: 7,
    canCreate: true,
  },
  {
    id: 'sugg-003',
    name: 'CTA dinámico en campañas de retención',
    hypothesis:
      'Adaptar el CTA según el nivel de participación incrementará el re-engagement.',
    description:
      'La IA propone CTAs distintos para usuarios con baja vs alta participación en emails de retención.',
    experimentType: 'cta',
    variants: [
      {
        id: 'var-003a',
        name: 'CTA para baja participación',
        description: 'Mensaje directo con incentivo y acceso rápido a soporte.',
      },
      {
        id: 'var-003b',
        name: 'CTA para alta participación',
        description: 'Mensaje enfocado en retos y contenido exclusivo.',
      },
    ],
    primaryMetric: 'Click-to-open rate',
    estimatedImpact: 'Alto',
    estimatedEffort: 'Bajo',
    reasoning:
      'Campañas similares elevaron el CTOR un 22% al alinear CTA con nivel de compromiso.',
    basedOnData: {
      historicalPerformance: 'Retención actual CTOR 9.5%',
      marketTrends: 'Segmentación por engagement en automatizaciones avanzadas',
    },
    suggestedDuration: 7,
    expectedUplift: 12,
    priority: 8,
    canCreate: true,
  },
];

/**
 * Obtiene sugerencias de experimentos generadas por IA
 */
export const getAIExperimentSuggestions = async (
  request: GetAIExperimentSuggestionsRequest = {}
): Promise<GetAIExperimentSuggestionsResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const { experimentTypes, limit } = request;

  const filteredSuggestions = experimentTypes && experimentTypes.length > 0
    ? mockExperimentSuggestions.filter((suggestion) =>
        experimentTypes.includes(suggestion.experimentType)
      )
    : mockExperimentSuggestions;

  const suggestions = typeof limit === 'number'
    ? filteredSuggestions.slice(0, limit)
    : filteredSuggestions;

  return {
    suggestions,
    total: filteredSuggestions.length,
    generatedAt: new Date().toISOString(),
    basedOn: {
      trainerProfile: true,
      historicalData: true,
      marketTrends: true,
    },
  };
};

/**
 * Crea un experimento a partir de una sugerencia generada por IA
 */
export const createExperimentFromSuggestion = async (
  request: CreateExperimentFromSuggestionRequest
): Promise<CreateExperimentFromSuggestionResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const suggestion = mockExperimentSuggestions.find(
    (item) => item.id === request.suggestionId
  );

  if (!suggestion) {
    throw new Error('No se encontró la sugerencia solicitada.');
  }

  const experimentId = `exp-${Date.now()}`;

  const experiment: ExperimentRecord = {
    id: experimentId,
    name: request.name ?? suggestion.name,
    hypothesis: suggestion.hypothesis,
    status: 'planned',
    primaryMetric: request.primaryMetric ?? suggestion.primaryMetric,
    uplift: null,
    lessons: [],
    insight: undefined,
  };

  experimentRecordsStorage = [experiment, ...experimentRecordsStorage];

  return {
    success: true,
    message: 'Experimento creado a partir de la sugerencia.',
    experiment,
  };
};

/**
 * User Story 1: AI Overview - Conecta datos de marketing, comunidad y ventas en lenguaje claro
 * Obtiene un overview integrado de marketing, comunidad y ventas con narrativas en lenguaje claro
 */
export const fetchAIOverview = async (period: '7d' | '30d' | '90d' = '30d'): Promise<AIOverviewResponse> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 400));

  const now = new Date().toISOString();

  // Datos de marketing simulados
  const marketing: AIOverviewResponse['marketing'] = {
    totalRevenue: 245000,
    totalLeads: 420,
    conversionRate: 18.5,
    activeCampaigns: 8,
    topPerformingChannel: 'Email + SMS',
    revenueGrowth: 22.5,
    leadsGrowth: 15.3,
  };

  // Datos de comunidad simulados
  const community: AIOverviewResponse['community'] = {
    activeMembers: 132,
    engagementRate: 84,
    nps: 58,
    testimonialsCollected: 48,
    advocatesCount: 54,
    retentionLift: 5.6,
    participationRate: 72,
  };

  // Datos de ventas simulados
  const sales: AIOverviewResponse['sales'] = {
    totalSales: 142,
    averageOrderValue: 1725,
    conversionRate: 18.5,
    pipelineValue: 185000,
    closedDeals: 28,
    salesGrowth: 12.8,
  };

  // Narrativas en lenguaje claro
  const narratives: AIOverviewResponse['narratives'] = [
    {
      id: 'narr-001',
      category: 'integrated',
      title: 'Todo está conectado: Marketing → Comunidad → Ventas',
      narrative:
        'Tu estrategia está funcionando bien. Las campañas de marketing generaron 420 leads este mes, un 15% más que el mes pasado. Lo interesante es que 54 de tus clientes se han convertido en promotores activos, lo que significa que la comunidad está generando un efecto multiplicador. Esto se traduce en 142 ventas con un ticket promedio de 1,725€. La clave está en que los clientes que participan activamente en la comunidad tienen un 5.6% más de retención, lo que explica por qué tus ventas crecieron un 12.8%.',
      sentiment: 'positive',
      keyMetrics: ['420 leads', '54 promotores', '142 ventas', '5.6% retención'],
      recommendations: [
        'Aumenta la participación en la comunidad para mantener el crecimiento de retención',
        'Duplica las campañas que generan más promotores (Email + SMS)',
        'Crea más contenido que convierta leads en miembros activos de la comunidad',
      ],
      timestamp: now,
    },
    {
      id: 'narr-002',
      category: 'marketing',
      title: 'Marketing: Crecimiento sólido con Email + SMS liderando',
      narrative:
        'Tus campañas de marketing están generando resultados consistentes. Has generado 245,000€ en ingresos este mes, un 22.5% más que el mes pasado. El canal Email + SMS es el que mejor funciona, con una tasa de conversión del 18.5%. Tienes 8 campañas activas funcionando en paralelo. Los leads están creciendo un 15.3%, lo que indica que tus esfuerzos de captación están dando frutos.',
      sentiment: 'positive',
      keyMetrics: ['245,000€ ingresos', '18.5% conversión', '8 campañas activas', '15.3% crecimiento leads'],
      recommendations: [
        'Mantén el ritmo en Email + SMS, está funcionando muy bien',
        'Considera aumentar el presupuesto en las campañas más exitosas',
        'Prueba replicar el formato de Email + SMS en otros canales',
      ],
      timestamp: now,
    },
    {
      id: 'narr-003',
      category: 'community',
      title: 'Comunidad: Engagement alto pero hay espacio para mejorar',
      narrative:
        'Tu comunidad está activa y saludable. Tienes 132 miembros activos con un engagement del 84%, lo cual es muy bueno. El NPS de 58 indica que tus clientes están satisfechos y dispuestos a recomendar. Has recopilado 48 testimonios este mes, y 54 clientes se han convertido en promotores. Sin embargo, la tasa de participación del 72% está por debajo de tu objetivo del 90%, lo que significa que hay margen para involucrar más a los miembros menos activos.',
      sentiment: 'neutral',
      keyMetrics: ['132 miembros activos', '84% engagement', '58 NPS', '72% participación'],
      recommendations: [
        'Implementa desafíos semanales para aumentar la participación',
        'Reconoce públicamente a los miembros más activos para crear más motivación',
        'Crea contenido que invite a la participación de los miembros menos activos',
      ],
      timestamp: now,
    },
    {
      id: 'narr-004',
      category: 'sales',
      title: 'Ventas: Pipeline saludable con buen ritmo de cierre',
      narrative:
        'Tus ventas están creciendo de manera constante. Has cerrado 28 deals este mes con un ticket promedio de 1,725€, lo que suma 142 ventas totales. Tu pipeline tiene un valor de 185,000€, lo que indica que tienes oportunidades suficientes para mantener el crecimiento. La tasa de conversión del 18.5% está alineada con tus objetivos. El crecimiento del 12.8% muestra que estás en el camino correcto, aunque podrías acelerar el proceso mejorando la velocidad de conversión del pipeline.',
      sentiment: 'positive',
      keyMetrics: ['28 deals cerrados', '1,725€ ticket promedio', '185,000€ pipeline', '18.5% conversión'],
      recommendations: [
        'Acelera el cierre de deals en el pipeline para aumentar el cash flow',
        'Enfócate en aumentar el ticket promedio con upsells y cross-sells',
        'Mejora el seguimiento de leads calientes para aumentar la conversión',
      ],
      timestamp: now,
    },
  ];

  // Resumen ejecutivo
  const summary =
    'Resumen del mes: Tu negocio está creciendo de manera saludable. Las campañas de marketing están generando leads consistentemente, la comunidad está activa y generando promotores, y las ventas están cerrando bien. El ciclo completo Marketing → Comunidad → Ventas está funcionando. La recomendación principal es aumentar la participación en la comunidad (actualmente 72%, objetivo 90%) para maximizar el efecto multiplicador que está generando tus ventas.';

  return {
    marketing,
    community,
    sales,
    narratives,
    summary,
    period,
    updatedAt: now,
  };
};

/**
 * User Story 2: AI Prioritization - Matriz Impacto/Esfuerzo basada en recursos
 * Obtiene acciones priorizadas basadas en una matriz de Impacto/Esfuerzo considerando los recursos disponibles
 */
export const fetchAIPrioritization = async (
  period: '7d' | '30d' | '90d' = '30d',
  trainerId?: string
): Promise<AIPrioritizationResponse> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 500));

  const now = new Date().toISOString();

  // Recursos disponibles del entrenador (simulados)
  const resources: ResourceConstraint[] = [
    {
      id: 'res-001',
      type: 'time',
      name: 'Horas semanales disponibles',
      available: 20,
      unit: 'horas/semana',
      description: 'Tiempo disponible para tareas de marketing y crecimiento',
    },
    {
      id: 'res-002',
      type: 'budget',
      name: 'Presupuesto mensual marketing',
      available: 2000,
      unit: 'EUR/mes',
      description: 'Presupuesto disponible para campañas y herramientas',
    },
    {
      id: 'res-003',
      type: 'team',
      name: 'Equipo disponible',
      available: 1,
      unit: 'personas',
      description: 'Número de personas en el equipo (incluye al entrenador)',
    },
    {
      id: 'res-004',
      type: 'tools',
      name: 'Herramientas disponibles',
      available: 5,
      unit: 'herramientas',
      description: 'Herramientas de marketing y automatización disponibles',
    },
  ];

  // Acciones priorizadas basadas en Impacto/Esfuerzo
  const actions: PrioritizedAction[] = [
    {
      id: 'action-001',
      title: 'Crear campaña de reactivación para clientes inactivos',
      description:
        'Diseñar y lanzar una campaña automatizada para reactivar clientes que no han asistido en más de 60 días. Usar Email + SMS con ofertas personalizadas.',
      category: 'marketing',
      impact: 'alto',
      effort: 'medio',
      quadrant: 'quick-wins',
      estimatedImpact: 'Puede reactivar 15-20 clientes inactivos, generando ~30,000€ en ingresos adicionales',
      estimatedEffort: 'Requiere 4-6 horas de configuración inicial y luego se automatiza',
      requiredResources: [
        { id: 'res-001', type: 'time', name: 'Horas', available: 6, unit: 'horas', description: 'Configuración inicial' },
        { id: 'res-002', type: 'budget', name: 'Presupuesto', available: 200, unit: 'EUR', description: 'Para herramientas de automatización' },
      ],
      estimatedTime: 6,
      estimatedCost: 200,
      priorityScore: 95,
      reasoning:
        'Alto impacto (reactivación de clientes existentes) con esfuerzo medio. Los recursos están disponibles y puede ejecutarse inmediatamente. ROI esperado muy alto.',
      status: 'recommended',
      canExecute: true,
    },
    {
      id: 'action-002',
      title: 'Aumentar participación en comunidad con desafíos semanales',
      description:
        'Implementar desafíos semanales en la comunidad para aumentar la participación del 72% al 90%. Crear contenido motivacional y reconocer a los participantes.',
      category: 'community',
      impact: 'alto',
      effort: 'bajo',
      quadrant: 'quick-wins',
      estimatedImpact: 'Puede aumentar la participación del 72% al 90%, mejorando la retención y generando más promotores',
      estimatedEffort: 'Requiere 2-3 horas semanales para crear contenido y moderar',
      requiredResources: [
        { id: 'res-001', type: 'time', name: 'Horas', available: 3, unit: 'horas/semana', description: 'Tiempo semanal' },
      ],
      estimatedTime: 3,
      priorityScore: 92,
      reasoning:
        'Alto impacto en retención y creación de promotores con esfuerzo bajo. Los recursos están disponibles. Puede ejecutarse inmediatamente.',
      status: 'recommended',
      canExecute: true,
    },
    {
      id: 'action-003',
      title: 'Desarrollar programa de referidos con incentivos personalizados',
      description:
        'Crear un programa de referidos donde los clientes actuales puedan referir nuevos clientes con incentivos personalizados basados en su segmento.',
      category: 'sales',
      impact: 'alto',
      effort: 'alto',
      quadrant: 'major-projects',
      estimatedImpact: 'Puede generar 20-30 nuevos clientes por mes a través de referidos, con un costo de adquisición muy bajo',
      estimatedEffort: 'Requiere 15-20 horas de desarrollo inicial y 2-3 horas semanales de mantenimiento',
      requiredResources: [
        { id: 'res-001', type: 'time', name: 'Horas', available: 20, unit: 'horas', description: 'Desarrollo inicial' },
        { id: 'res-002', type: 'budget', name: 'Presupuesto', available: 500, unit: 'EUR', description: 'Para incentivos y herramientas' },
      ],
      estimatedTime: 20,
      estimatedCost: 500,
      priorityScore: 85,
      reasoning:
        'Alto impacto pero requiere esfuerzo alto. Los recursos están disponibles pero requiere compromiso a largo plazo. ROI esperado muy alto a medio plazo.',
      status: 'recommended',
      canExecute: true,
    },
    {
      id: 'action-004',
      title: 'Optimizar campañas de Email + SMS existentes',
      description:
        'Analizar las campañas existentes de Email + SMS que están funcionando bien y optimizarlas con A/B testing para mejorar aún más los resultados.',
      category: 'marketing',
      impact: 'medio',
      effort: 'bajo',
      quadrant: 'fill-ins',
      estimatedImpact: 'Puede mejorar la tasa de conversión del 18.5% al 20-22%, generando más leads con el mismo presupuesto',
      estimatedEffort: 'Requiere 3-4 horas de análisis y configuración de tests',
      requiredResources: [
        { id: 'res-001', type: 'time', name: 'Horas', available: 4, unit: 'horas', description: 'Análisis y configuración' },
      ],
      estimatedTime: 4,
      priorityScore: 75,
      reasoning:
        'Impacto medio con esfuerzo bajo. Los recursos están disponibles. Puede ejecutarse cuando haya tiempo disponible.',
      status: 'recommended',
      canExecute: true,
    },
    {
      id: 'action-005',
      title: 'Crear contenido educativo para redes sociales',
      description:
        'Desarrollar una serie de contenido educativo (guías, tips, tutoriales) para publicar en redes sociales y generar más leads orgánicos.',
      category: 'content',
      impact: 'medio',
      effort: 'medio',
      quadrant: 'fill-ins',
      estimatedImpact: 'Puede generar 30-50 leads adicionales por mes a través de contenido orgánico',
      estimatedEffort: 'Requiere 5-6 horas semanales para crear y publicar contenido',
      requiredResources: [
        { id: 'res-001', type: 'time', name: 'Horas', available: 6, unit: 'horas/semana', description: 'Tiempo semanal' },
        { id: 'res-004', type: 'tools', name: 'Herramientas', available: 2, unit: 'herramientas', description: 'Para diseño y publicación' },
      ],
      estimatedTime: 6,
      priorityScore: 70,
      reasoning:
        'Impacto medio con esfuerzo medio. Requiere compromiso continuo. Los recursos están disponibles pero puede competir con otras prioridades.',
      status: 'recommended',
      canExecute: true,
    },
    {
      id: 'action-006',
      title: 'Implementar sistema de seguimiento de pipeline avanzado',
      description:
        'Desarrollar un sistema avanzado de seguimiento de pipeline con automatizaciones para acelerar el cierre de deals.',
      category: 'sales',
      impact: 'alto',
      effort: 'alto',
      quadrant: 'major-projects',
      estimatedImpact: 'Puede acelerar el cierre de deals en un 20-30%, mejorando el cash flow',
      estimatedEffort: 'Requiere 25-30 horas de desarrollo inicial y 3-4 horas semanales de mantenimiento',
      requiredResources: [
        { id: 'res-001', type: 'time', name: 'Horas', available: 30, unit: 'horas', description: 'Desarrollo inicial' },
        { id: 'res-002', type: 'budget', name: 'Presupuesto', available: 800, unit: 'EUR', description: 'Para herramientas y desarrollo' },
        { id: 'res-003', type: 'team', name: 'Equipo', available: 1, unit: 'personas', description: 'Para desarrollo' },
      ],
      estimatedTime: 30,
      estimatedCost: 800,
      priorityScore: 80,
      reasoning:
        'Alto impacto pero requiere esfuerzo alto y recursos significativos. Los recursos están disponibles pero requiere compromiso a largo plazo. ROI esperado alto a medio plazo.',
      status: 'recommended',
      canExecute: true,
    },
    {
      id: 'action-007',
      title: 'Actualizar testimonios y casos de éxito',
      description:
        'Actualizar la sección de testimonios y casos de éxito en el sitio web y materiales de marketing con los nuevos testimonios recopilados.',
      category: 'content',
      impact: 'bajo',
      effort: 'bajo',
      quadrant: 'fill-ins',
      estimatedImpact: 'Puede mejorar la credibilidad y aumentar ligeramente la conversión (2-3%)',
      estimatedEffort: 'Requiere 2-3 horas de trabajo',
      requiredResources: [
        { id: 'res-001', type: 'time', name: 'Horas', available: 3, unit: 'horas', description: 'Actualización' },
      ],
      estimatedTime: 3,
      priorityScore: 60,
      reasoning:
        'Impacto bajo con esfuerzo bajo. Los recursos están disponibles. Puede ejecutarse cuando haya tiempo disponible, pero no es prioritario.',
      status: 'recommended',
      canExecute: true,
    },
    {
      id: 'action-008',
      title: 'Migrar a nueva plataforma de CRM',
      description:
        'Migrar todos los datos y procesos a una nueva plataforma de CRM más avanzada con mejores funcionalidades.',
      category: 'operations',
      impact: 'medio',
      effort: 'alto',
      quadrant: 'thankless-tasks',
      estimatedImpact: 'Puede mejorar la eficiencia operativa en un 10-15% a largo plazo',
      estimatedEffort: 'Requiere 40-50 horas de migración y configuración, más tiempo de adaptación',
      requiredResources: [
        { id: 'res-001', type: 'time', name: 'Horas', available: 50, unit: 'horas', description: 'Migración' },
        { id: 'res-002', type: 'budget', name: 'Presupuesto', available: 1500, unit: 'EUR', description: 'Para nueva plataforma' },
        { id: 'res-003', type: 'team', name: 'Equipo', available: 1, unit: 'personas', description: 'Para migración' },
      ],
      estimatedTime: 50,
      estimatedCost: 1500,
      priorityScore: 45,
      reasoning:
        'Impacto medio con esfuerzo muy alto. Requiere recursos significativos y tiempo considerable. No es prioritario en este momento, puede posponerse.',
      status: 'deferred',
      canExecute: false,
      blocker: 'Requiere demasiado tiempo y presupuesto. No es crítico en este momento.',
    },
  ];

  // Calcular resumen
  const quickWins = actions.filter((a) => a.quadrant === 'quick-wins').length;
  const majorProjects = actions.filter((a) => a.quadrant === 'major-projects').length;
  const fillIns = actions.filter((a) => a.quadrant === 'fill-ins').length;
  const thanklessTasks = actions.filter((a) => a.quadrant === 'thankless-tasks').length;
  const recommendedActions = actions.filter((a) => a.status === 'recommended' && a.canExecute).length;

  return {
    actions,
    resources,
    period,
    updatedAt: now,
    summary: {
      quickWins,
      majorProjects,
      fillIns,
      thanklessTasks,
      recommendedActions,
    },
  };
};

/**
 * User Story 1: Generar playbook IA completo (estrategia, copy, assets, medición)
 * Adaptado al estilo y audiencia del entrenador
 */
export const generateCompletePlaybook = async (
  request: GenerateCompletePlaybookRequest
): Promise<GenerateCompletePlaybookResponse> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const now = new Date().toISOString();
  const trainerId = request.trainerId || 'trn_current';

  // Obtener perfil del entrenador para adaptar el playbook
  const profile = intelligenceProfileStorage || null;
  
  // Definir audiencia objetivo (por defecto o del perfil)
  const targetAudience = request.targetAudience || 
    (profile?.strategicPillars.objectives?.[0] || 'Clientes activos');
  
  // Definir canales (por defecto o del perfil)
  const channels = request.channels || ['Email', 'SMS', 'Social Media'];
  
  // Estilo del entrenador (del perfil o por defecto)
  const trainerStyle = profile?.decisionStyle === 'rapido' 
    ? 'Directo y accionable'
    : profile?.decisionStyle === 'basado-en-datos'
    ? 'Data-driven y preciso'
    : 'Iterativo y flexible';
  
  // Tono adaptado
  const tone = profile?.decisionStyle === 'rapido'
    ? 'Directo, motivacional, claro'
    : profile?.decisionStyle === 'basado-en-datos'
    ? 'Profesional, respaldado por datos, preciso'
    : 'Conversacional, flexible, adaptable';

  // Generar playbook completo
  const playbook: PlaybookRecord = {
    id: `pb-${Date.now()}`,
    name: `Playbook: ${request.objective}`,
    objective: request.objective,
    channels: channels,
    owner: 'IA Generado',
    status: 'draft',
    impact: 'Alto',
    strategy: {
      overview: `Estrategia integral para ${request.objective}. Este playbook está diseñado para ${targetAudience} utilizando ${channels.join(', ')}. La estrategia está adaptada a tu estilo ${trainerStyle}.`,
      targetAudience: targetAudience,
      goals: [
        `Alcanzar ${request.objective}`,
        'Maximizar engagement con la audiencia',
        'Generar resultados medibles',
      ],
      keyMessages: [
        `Mensaje principal adaptado a ${targetAudience}`,
        'Mensaje de diferenciación basado en tus pilares estratégicos',
        'Mensaje de valor único',
      ],
      timeline: [
        {
          phase: 'Fase 1: Preparación',
          duration: '1 semana',
          description: 'Configuración inicial y preparación de assets',
        },
        {
          phase: 'Fase 2: Lanzamiento',
          duration: '2 semanas',
          description: 'Ejecución de la campaña en todos los canales',
        },
        {
          phase: 'Fase 3: Optimización',
          duration: '1 semana',
          description: 'Análisis de resultados y optimización continua',
        },
      ],
      channels: channels.map((channel) => ({
        channel: channel,
        role: channel === 'Email' 
          ? 'Comunicación principal y seguimiento'
          : channel === 'SMS'
          ? 'Recordatorios y acciones inmediatas'
          : 'Engagement y alcance amplio',
        frequency: channel === 'Email' 
          ? '2-3 veces por semana'
          : channel === 'SMS'
          ? '1-2 veces por semana'
          : 'Diario',
      })),
    },
    copies: channels.map((channel) => {
      const channelCopy: any = {
        channel: channel,
        contentType: channel === 'Email' 
          ? 'Email marketing'
          : channel === 'SMS'
          ? 'SMS'
          : 'Social Media Post',
        body: channel === 'Email'
          ? `Hola,\n\n${request.objective}. Este mensaje está personalizado para ti.\n\n[Contenido adaptado a tu audiencia]\n\nEsperamos que encuentres esto valioso.\n\nSaludos,`
          : channel === 'SMS'
          ? `Recordatorio: ${request.objective}. Accede ahora: [link]`
          : `🚀 ${request.objective}\n\n[Contenido adaptado]\n\n#Fitness #Entrenamiento`,
        tone: tone,
        personalization: {
          type: 'Dinámico',
          variables: ['nombre', 'objetivo', 'progreso'],
        },
      };
      
      if (channel === 'Email') {
        channelCopy.subject = `📧 ${request.objective}`;
        channelCopy.cta = 'Actuar ahora';
      } else if (channel !== 'SMS') {
        channelCopy.headline = `🎯 ${request.objective}`;
        channelCopy.cta = 'Descubre más';
      }
      
      return channelCopy;
    }),
    assets: [
      {
        id: `asset-${Date.now()}-1`,
        type: 'template',
        name: 'Template Email Principal',
        description: 'Template de email adaptado a tu estilo',
        url: '/templates/email-principal',
        channel: 'Email',
        format: 'HTML',
        generated: true,
      },
      {
        id: `asset-${Date.now()}-2`,
        type: 'image',
        name: 'Imagen Social Media',
        description: 'Imagen para redes sociales',
        url: '/assets/social-image',
        channel: 'Social Media',
        dimensions: '1200x630',
        format: 'PNG',
        generated: true,
      },
      {
        id: `asset-${Date.now()}-3`,
        type: 'document',
        name: 'Guía de Implementación',
        description: 'Documento con instrucciones detalladas',
        url: '/docs/guia-implementacion',
        channel: 'General',
        format: 'PDF',
        generated: true,
      },
    ],
    measurement: {
      primaryMetric: 'Tasa de conversión',
      secondaryMetrics: [
        'Tasa de apertura',
        'Tasa de clics',
        'Engagement rate',
        'ROI',
      ],
      kpis: [
        {
          name: 'Tasa de conversión',
          target: 15,
          unit: '%',
        },
        {
          name: 'Tasa de apertura',
          target: 25,
          unit: '%',
        },
        {
          name: 'Engagement rate',
          target: 10,
          unit: '%',
        },
        {
          name: 'ROI',
          target: 3,
          unit: 'x',
        },
      ],
      tracking: {
        method: 'Analytics integrado',
        tools: ['Google Analytics', 'Platform Analytics', 'CRM'],
        frequency: 'Diaria',
      },
      reporting: {
        frequency: 'Semanal',
        recipients: ['Entrenador', 'Equipo Marketing'],
        format: 'Dashboard + Reporte PDF',
      },
    },
    adaptedToTrainer: {
      trainerStyle: trainerStyle,
      targetAudience: targetAudience,
      tone: tone,
      differentiation: profile?.strategicPillars.differentiators || [
        'Enfoque personalizado',
        'Resultados medibles',
      ],
    },
    createdAt: now,
    updatedAt: now,
  };

  return {
    playbook,
    success: true,
    message: 'Playbook generado exitosamente con estrategia, copy, assets y medición adaptados a tu estilo y audiencia.',
  };
};

/**
 * User Story 2: Transformar insight en playbook con un clic
 */
export const convertInsightToPlaybook = async (
  request: ConvertInsightToPlaybookRequest
): Promise<ConvertInsightToPlaybookResponse> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 1200));

  // Usar el insight proporcionado
  const insight = request.insight;

  const now = new Date().toISOString();
  const trainerId = request.trainerId || 'trn_current';

  // Obtener perfil del entrenador
  const profile = intelligenceProfileStorage || null;

  // Usar sugerencias del insight o personalizadas
  const objective = request.customObjective || 
    insight.playbookSuggestion?.suggestedObjective ||
    `Accionar insight: ${insight.title}`;
  const channels = request.customChannels || 
    insight.playbookSuggestion?.suggestedChannels || 
    ['Email', 'Social Media'];
  
  const targetAudience = profile?.strategicPillars.objectives?.[0] || 
    'Clientes activos';
  
  const trainerStyle = profile?.decisionStyle === 'rapido'
    ? 'Directo y accionable'
    : profile?.decisionStyle === 'basado-en-datos'
    ? 'Data-driven y preciso'
    : 'Iterativo y flexible';

  const tone = profile?.decisionStyle === 'rapido'
    ? 'Directo, motivacional, claro'
    : profile?.decisionStyle === 'basado-en-datos'
    ? 'Profesional, respaldado por datos, preciso'
    : 'Conversacional, flexible, adaptable';

  // Generar playbook desde el insight
  const playbookName = insight.playbookSuggestion?.suggestedName || 
    `Playbook: ${insight.title}`;
  
  const playbook: PlaybookRecord = {
    id: `pb-insight-${Date.now()}`,
    name: playbookName,
    objective: objective,
    channels: channels,
    owner: 'IA Generado desde Insight',
    status: 'draft',
    impact: insight.playbookSuggestion?.estimatedImpact || 'Medio',
    strategy: {
      overview: `Playbook generado desde el insight: "${insight.title}". ${insight.description}. Este playbook está diseñado para convertir este insight en acción inmediata.`,
      targetAudience: targetAudience,
      goals: [
        `Accionar el insight: ${insight.title}`,
        'Convertir diagnóstico en acción',
        'Generar resultados medibles',
      ],
      keyMessages: [
        `Mensaje basado en: ${insight.title}`,
        insight.description,
        'Mensaje de acción inmediata',
      ],
      timeline: [
        {
          phase: 'Fase 1: Ejecución inmediata',
          duration: '3 días',
          description: 'Lanzamiento rápido para capitalizar el insight',
        },
        {
          phase: 'Fase 2: Medición',
          duration: '1 semana',
          description: 'Monitoreo de resultados y ajustes',
        },
        {
          phase: 'Fase 3: Optimización',
          duration: '1 semana',
          description: 'Optimización basada en resultados',
        },
      ],
      channels: channels.map((channel) => ({
        channel: channel,
        role: channel === 'Email'
          ? 'Comunicación principal'
          : 'Engagement y alcance',
        frequency: channel === 'Email'
          ? 'Inmediato'
          : 'Diario',
      })),
    },
    copies: channels.map((channel) => {
      const channelCopy: any = {
        channel: channel,
        contentType: channel === 'Email'
          ? 'Email marketing'
          : 'Social Media Post',
        body: channel === 'Email'
          ? `Hola,\n\nBasado en nuestro análisis, hemos identificado: ${insight.title}\n\n${insight.description}\n\nAcción inmediata: [Descripción de acción]\n\nSaludos,`
          : `🔍 Insight: ${insight.title}\n\n${insight.description}\n\n💡 Acción: [Acción sugerida]\n\n#Insights #Fitness`,
        tone: tone,
        personalization: {
          type: 'Dinámico',
          variables: ['nombre', 'insight relevante'],
        },
      };
      
      if (channel === 'Email') {
        channelCopy.subject = `🚀 Acción inmediata: ${insight.title}`;
        channelCopy.cta = 'Actuar ahora';
      } else {
        channelCopy.headline = `💡 ${insight.title}`;
        channelCopy.cta = 'Descubre más';
      }
      
      return channelCopy;
    }),
    assets: [
      {
        id: `asset-insight-${Date.now()}-1`,
        type: 'template',
        name: 'Template Email Insight',
        description: 'Template de email basado en el insight',
        url: '/templates/email-insight',
        channel: 'Email',
        format: 'HTML',
        generated: true,
      },
    ],
    measurement: {
      primaryMetric: 'Tasa de conversión del insight',
      secondaryMetrics: [
        'Engagement rate',
        'Tasa de acción',
        'ROI',
      ],
      kpis: [
        {
          name: 'Tasa de conversión',
          target: 12,
          unit: '%',
        },
        {
          name: 'Engagement rate',
          target: 8,
          unit: '%',
        },
      ],
      tracking: {
        method: 'Analytics integrado',
        tools: ['Platform Analytics', 'CRM'],
        frequency: 'Diaria',
      },
      reporting: {
        frequency: 'Semanal',
        recipients: ['Entrenador'],
        format: 'Dashboard',
      },
    },
    adaptedToTrainer: {
      trainerStyle: trainerStyle,
      targetAudience: targetAudience,
      tone: tone,
      differentiation: profile?.strategicPillars.differentiators || [
        'Enfoque personalizado',
      ],
    },
    sourceInsightId: insight.id,
    createdAt: now,
    updatedAt: now,
  };

  return {
    playbook,
    success: true,
    message: `Insight "${insight.title}" transformado en playbook exitosamente. Listo para ejecutar.`,
  };
};

// Mock storage for lessons learned (in production, this would be an API call)
let lessonsStorage: ExperimentLesson[] = [];

/**
 * User Story 1: Obtener insights automáticos de un experimento con resultados traducidos a lenguaje claro
 */
export const getExperimentInsight = async (
  request: GetExperimentInsightRequest
): Promise<GetExperimentInsightResponse> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 800));

  const now = new Date().toISOString();

  // Simular generación de insights basados en el experimento
  // En producción, esto analizaría los datos reales del experimento
  const experimentId = request.experimentId;

  // Determinar recomendación basada en el experimento (simulado)
  // En producción, esto se calcularía basado en los datos reales
  let recommendation: ScalingRecommendation = 'test-more';
  let recommendationReason = '';
  let confidence = 70;
  let summary = '';
  let keyFindings: string[] = [];
  let nextSteps: string[] = [];

  // Simular diferentes escenarios basados en el ID del experimento
  if (experimentId === 'exp-003') {
    // Test de pricing premium - completado con 18% uplift
    recommendation = 'scale';
    confidence = 85;
    summary =
      'Este experimento de pricing premium ha mostrado resultados muy positivos. La variante con precio dinámico generó un 18% más de conversiones, lo que indica que tu audiencia está dispuesta a pagar más por valor percibido. Los resultados son estadísticamente significativos y consistentes a lo largo del período de prueba.';
    keyFindings = [
      'La variante con precio dinámico aumentó las conversiones en un 18%',
      'El ticket promedio aumentó un 12% sin afectar negativamente el volumen de ventas',
      'La satisfacción del cliente se mantuvo alta (NPS +3 puntos)',
      'El ROI mejoró significativamente debido al mayor margen por venta',
    ];
    recommendationReason =
      'Recomendamos escalar esta estrategia porque los resultados son claramente positivos, estadísticamente significativos, y no hay indicadores negativos. El aumento en conversión y ticket promedio sugiere que puedes aplicar esta estrategia a más segmentos de tu audiencia.';
    nextSteps = [
      'Aplicar pricing dinámico a todos los segmentos premium',
      'Monitorear métricas de satisfacción durante las primeras 2 semanas',
      'Considerar crear variantes de pricing para otros productos/servicios',
      'Documentar esta estrategia como best practice para futuros experimentos',
    ];
  } else if (experimentId === 'exp-004') {
    // Email subject lines A/B - completado con 8% uplift
    recommendation = 'optimize';
    confidence = 75;
    summary =
      'El experimento de subject lines personalizados mostró una mejora moderada del 8% en la tasa de apertura. Aunque los resultados son positivos, hay margen para optimización adicional. La variante ganadora funcionó especialmente bien en segmentos específicos de la audiencia.';
    keyFindings = [
      'La personalización en subject lines aumentó la apertura en un 8%',
      'El efecto fue más pronunciado en clientes activos (+15%) que en nuevos leads (+3%)',
      'No hubo impacto negativo en la tasa de clics o conversión',
      'Los subject lines con emojis tuvieron mejor rendimiento en móviles',
    ];
    recommendationReason =
      'Recomendamos optimizar antes de escalar completamente. Los resultados son positivos pero moderados, y hay oportunidades claras de mejora basadas en los segmentos que respondieron mejor. Es mejor refinar la estrategia antes de aplicarla a toda la base.';
    nextSteps = [
      'Crear variantes adicionales basadas en los segmentos que mejor respondieron',
      'Probar combinaciones de personalización + emojis en diferentes dispositivos',
      'Aplicar la estrategia ganadora a segmentos similares primero',
      'Medir impacto a largo plazo en engagement y retención',
    ];
  } else {
    // Caso genérico
    recommendation = 'test-more';
    confidence = 60;
    summary =
      'El experimento ha completado su fase inicial. Los resultados preliminares muestran tendencias interesantes, pero se necesita más tiempo y datos para tomar una decisión informada sobre escalado.';
    keyFindings = [
      'Los datos muestran variabilidad que requiere más muestras',
      'Se observan diferencias entre segmentos que merecen investigación',
      'El período de prueba fue suficiente para detectar tendencias iniciales',
    ];
    recommendationReason =
      'Recomendamos continuar el test o ejecutar una variante mejorada porque los datos actuales no son suficientes para una decisión definitiva. Hay señales positivas pero necesitamos más confianza estadística.';
    nextSteps = [
      'Extender el período de prueba por 1-2 semanas adicionales',
      'Aumentar el tamaño de la muestra si es posible',
      'Analizar resultados por segmentos para identificar oportunidades',
      'Considerar crear una variante optimizada basada en aprendizajes iniciales',
    ];
  }

  const insight: ExperimentInsight = {
    id: `insight-${experimentId}-${Date.now()}`,
    experimentId: experimentId,
    summary,
    keyFindings,
    performanceAnalysis: [
      {
        metric: 'Conversión',
        value: 18.5,
        change: 18,
        interpretation: 'Aumento significativo en la tasa de conversión, indicando que la variante experimental es más efectiva',
      },
      {
        metric: 'Ticket promedio',
        value: 1725,
        change: 12,
        interpretation: 'Incremento en el valor promedio por transacción, mejorando el ROI general',
      },
      {
        metric: 'Satisfacción (NPS)',
        value: 58,
        change: 3,
        interpretation: 'Mejora ligera en satisfacción, confirmando que los cambios no afectan negativamente la experiencia',
      },
    ],
    recommendation,
    recommendationReason,
    confidence,
    nextSteps,
    generatedAt: now,
  };

  return {
    insight,
    success: true,
    message: 'Insight generado exitosamente con resultados traducidos a lenguaje claro.',
  };
};

/**
 * User Story 2: Registrar una lección aprendida de un experimento
 */
export const recordExperimentLesson = async (
  request: RecordExperimentLessonRequest
): Promise<RecordExperimentLessonResponse> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 500));

  const now = new Date().toISOString();

  // Obtener nombre del experimento (en producción vendría de la BD)
  const experimentName = `Experimento ${request.experimentId}`;

  const lesson: ExperimentLesson = {
    id: `lesson-${Date.now()}`,
    experimentId: request.experimentId,
    experimentName,
    category: request.category,
    title: request.title,
    description: request.description,
    tags: request.tags || [],
    impact: request.impact || 'medium',
    applicableTo: request.applicableTo || [],
    recordedAt: now,
  };

  // Guardar en storage (en producción sería una llamada a la API)
  lessonsStorage.push(lesson);

  return {
    lesson,
    success: true,
    message: 'Lección aprendida registrada exitosamente. La IA la recordará para futuros experimentos.',
  };
};

/**
 * User Story 2: Obtener lecciones aprendidas
 */
export const getExperimentLessons = async (
  request: GetExperimentLessonsRequest = {}
): Promise<GetExperimentLessonsResponse> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 300));

  let lessons = [...lessonsStorage];

  // Filtrar por experimentId si se proporciona
  if (request.experimentId) {
    lessons = lessons.filter((l) => l.experimentId === request.experimentId);
  }

  // Filtrar por categoría si se proporciona
  if (request.category) {
    lessons = lessons.filter((l) => l.category === request.category);
  }

  // Filtrar por tags si se proporcionan
  if (request.tags && request.tags.length > 0) {
    lessons = lessons.filter((l) => request.tags!.some((tag) => l.tags.includes(tag)));
  }

  // Limitar resultados si se especifica
  if (request.limit) {
    lessons = lessons.slice(0, request.limit);
  }

  return {
    lessons,
    total: lessons.length,
    retrievedAt: new Date().toISOString(),
  };
};

/**
 * User Story 2: Obtener lecciones relevantes para un nuevo experimento
 * La IA analiza las lecciones aprendidas y sugiere las más relevantes
 */
export const getRelevantLessonsForExperiment = async (
  request: GetRelevantLessonsForExperimentRequest
): Promise<GetRelevantLessonsForExperimentResponse> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 600));

  let relevantLessons = [...lessonsStorage];

  // Filtrar por tags si se proporcionan
  if (request.tags && request.tags.length > 0) {
    relevantLessons = relevantLessons.filter((l) =>
      request.tags!.some((tag) => l.tags.includes(tag))
    );
  }

  // Filtrar por tipo de experimento si se proporciona
  if (request.experimentType) {
    relevantLessons = relevantLessons.filter((l) =>
      l.applicableTo.includes(request.experimentType!)
    );
  }

  // Ordenar por impacto (high primero) y luego por fecha (más recientes primero)
  relevantLessons.sort((a, b) => {
    const impactOrder = { high: 3, medium: 2, low: 1 };
    if (impactOrder[b.impact] !== impactOrder[a.impact]) {
      return impactOrder[b.impact] - impactOrder[a.impact];
    }
    return new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime();
  });

  // Limitar resultados
  const limit = request.limit || 5;
  relevantLessons = relevantLessons.slice(0, limit);

  // Generar reasoning sobre por qué estas lecciones son relevantes
  let reasoning = '';
  if (relevantLessons.length === 0) {
    reasoning =
      'No se encontraron lecciones aprendidas específicas para este tipo de experimento. Esto es una oportunidad para crear nuevos aprendizajes.';
  } else if (relevantLessons.length === 1) {
    reasoning = `Se encontró 1 lección aprendida relevante: "${relevantLessons[0].title}". Esta lección puede ayudarte a evitar errores similares o replicar estrategias exitosas.`;
  } else {
    const categories = relevantLessons.map((l) => l.category);
    const hasSuccess = categories.includes('success');
    const hasFailure = categories.includes('failure');
    reasoning = `Se encontraron ${relevantLessons.length} lecciones aprendidas relevantes. `;
    if (hasSuccess && hasFailure) {
      reasoning +=
        'Incluyen tanto éxitos como fracasos previos, lo que te ayudará a replicar lo que funcionó y evitar lo que no.';
    } else if (hasSuccess) {
      reasoning +=
        'Todas son lecciones de éxito, lo que te ayudará a replicar estrategias que funcionaron bien.';
    } else if (hasFailure) {
      reasoning +=
        'Incluyen lecciones de fracasos previos, lo que te ayudará a evitar errores similares.';
    } else {
      reasoning += 'Estas lecciones pueden proporcionar insights valiosos para tu experimento.';
    }
  }

  return {
    lessons: relevantLessons,
    total: relevantLessons.length,
    reasoning,
    retrievedAt: new Date().toISOString(),
  };
};

/**
 * User Story 1: Generar journey personalizado basado en atributos del lead
 */
export const generatePersonalizedJourney = async (
  request: GeneratePersonalizedJourneyRequest
): Promise<GeneratePersonalizedJourneyResponse> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const now = new Date().toISOString();
  const journeyId = `journey-${Date.now()}`;

  // Mapear objetivos de fitness a nombres legibles
  const goalNames: Record<string, string> = {
    'perdida-peso': 'Pérdida de Peso',
    'ganancia-masa-muscular': 'Ganancia de Masa Muscular',
    'mejora-resistencia': 'Mejora de Resistencia',
    'tonificacion': 'Tonificación',
    'salud-general': 'Salud General',
    'preparacion-deportiva': 'Preparación Deportiva',
    'rehabilitacion': 'Rehabilitación',
    'flexibilidad-movilidad': 'Flexibilidad y Movilidad',
  };

  // Mapear motivadores a nombres legibles
  const motivatorNames: Record<string, string> = {
    'salud-prevencion': 'Salud y Prevención',
    'apariencia-estetica': 'Apariencia Estética',
    'rendimiento-deportivo': 'Rendimiento Deportivo',
    'bienestar-mental': 'Bienestar Mental',
    'presion-social': 'Presión Social',
    'competencia-personal': 'Competencia Personal',
    'recomendacion-medica': 'Recomendación Médica',
    'evento-especial': 'Evento Especial',
  };

  const goalName = goalNames[request.leadAttributes.fitnessGoal] || request.leadAttributes.fitnessGoal;
  const motivatorNamesList = request.leadAttributes.motivators.map(m => motivatorNames[m] || m);

  // Generar steps del journey basados en los atributos
  const steps = [];
  let stepNumber = 1;

  // Step 1: Bienvenida personalizada
  steps.push({
    id: `${journeyId}-step-${stepNumber}`,
    stepNumber: stepNumber++,
    name: 'Bienvenida Personalizada',
    description: `Bienvenida adaptada a tu objetivo de ${goalName.toLowerCase()}`,
    channel: 'email' as const,
    trigger: 'Inmediato al inscribirse',
    content: {
      subject: `¡Bienvenido! Tu camino hacia ${goalName} comienza ahora`,
      message: `Hola {{nombre}},\n\nNos emociona acompañarte en tu objetivo de ${goalName.toLowerCase()}. Sabemos que te motiva ${motivatorNamesList.join(' y ')}.\n\nHemos diseñado un plan personalizado para ti que incluye:\n- Rutinas adaptadas a tu nivel\n- Contenido educativo relevante\n- Seguimiento constante\n\n¡Empecemos!`,
      cta: 'Ver mi plan personalizado',
      personalizationVariables: ['nombre', 'objetivo', 'motivadores'],
    },
    delay: 0,
  });

  // Step 2: Contenido educativo según objetivo
  steps.push({
    id: `${journeyId}-step-${stepNumber}`,
    stepNumber: stepNumber++,
    name: 'Contenido Educativo',
    description: `Guía educativa sobre ${goalName.toLowerCase()}`,
    channel: 'email' as const,
    trigger: '1 día después de la bienvenida',
    content: {
      subject: `Guía completa: Cómo alcanzar ${goalName}`,
      message: `{{nombre}},\n\nTe compartimos una guía completa con todo lo que necesitas saber sobre ${goalName.toLowerCase()}.\n\nIncluye:\n- Fundamentos científicos\n- Mejores prácticas\n- Errores comunes a evitar\n- Plan de acción paso a paso\n\nDescárgala ahora:`,
      cta: 'Descargar guía',
      personalizationVariables: ['nombre', 'objetivo'],
    },
    delay: 1,
  });

  // Step 3: Recordatorio motivacional
  if (request.leadAttributes.motivators.includes('bienestar-mental') || 
      request.leadAttributes.motivators.includes('competencia-personal')) {
    steps.push({
      id: `${journeyId}-step-${stepNumber}`,
      stepNumber: stepNumber++,
      name: 'Recordatorio Motivacional',
      description: 'Mensaje motivacional personalizado',
      channel: 'sms' as const,
      trigger: '3 días después del contenido educativo',
      content: {
        message: `{{nombre}}, recuerda: ${goalName} es un proceso. Cada paso cuenta. 💪 ¿Necesitas ayuda? Estamos aquí.`,
        cta: 'Contactar entrenador',
        personalizationVariables: ['nombre'],
      },
      delay: 3,
    });
  }

  // Step 4: Invitación a primera sesión/consulta
  steps.push({
    id: `${journeyId}-step-${stepNumber}`,
    stepNumber: stepNumber++,
    name: 'Invitación a Primera Sesión',
    description: 'Invitación personalizada a primera consulta o sesión',
    channel: 'email' as const,
    trigger: '5 días después del contenido educativo',
    content: {
      subject: `¿Listo para tu primera sesión? Te esperamos`,
      message: `{{nombre}},\n\nYa tienes toda la información. Ahora es momento de comenzar con tu primera sesión personalizada.\n\nHemos preparado una sesión especialmente diseñada para ayudarte a alcanzar ${goalName.toLowerCase()}.\n\nReserva tu sesión ahora:`,
      cta: 'Reservar sesión',
      personalizationVariables: ['nombre', 'objetivo'],
    },
    delay: 5,
  });

  // Step 5: Seguimiento post-sesión
  steps.push({
    id: `${journeyId}-step-${stepNumber}`,
    stepNumber: stepNumber++,
    name: 'Seguimiento Post-Sesión',
    description: 'Seguimiento después de la primera sesión',
    channel: 'whatsapp' as const,
    trigger: '1 día después de la primera sesión',
    content: {
      message: `{{nombre}}, ¿cómo te sentiste en tu primera sesión? Queremos saber tu opinión y ayudarte a ajustar el plan si es necesario.`,
      cta: 'Dar feedback',
      personalizationVariables: ['nombre'],
    },
    delay: 1,
    conditions: ['Primera sesión completada'],
  });

  // Determinar nivel de personalización
  let personalizationLevel: 'bajo' | 'medio' | 'alto' = 'medio';
  if (request.leadAttributes.motivators.length >= 3 && 
      request.leadAttributes.experienceLevel && 
      request.leadAttributes.availableTime) {
    personalizationLevel = 'alto';
  } else if (request.leadAttributes.motivators.length <= 1) {
    personalizationLevel = 'bajo';
  }

  const journey = {
    id: journeyId,
    name: `Journey: ${goalName}`,
    description: `Journey personalizado para leads con objetivo de ${goalName.toLowerCase()} y motivados por ${motivatorNamesList.join(', ')}`,
    leadAttributes: request.leadAttributes,
    steps: steps,
    estimatedDuration: steps.reduce((acc, step) => acc + (step.delay || 0), 0),
    expectedOutcome: `Conversión del lead en cliente activo con objetivo claro de ${goalName.toLowerCase()}`,
    personalizationLevel: personalizationLevel,
    createdAt: now,
    updatedAt: now,
    status: 'draft' as const,
  };

  return {
    journey,
    success: true,
    message: `Journey personalizado generado exitosamente con ${steps.length} pasos adaptados a los atributos del lead.`,
  };
};

/**
 * User Story 2: Detectar micro-segmentos emergentes
 */
export const detectMicroSegments = async (
  request: DetectMicroSegmentsRequest = {}
): Promise<DetectMicroSegmentsResponse> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const now = new Date().toISOString();
  const lookbackPeriod = request.lookbackPeriod || '30d';

  // Simular detección de micro-segmentos emergentes
  const segments = [
    {
      id: 'segment-001',
      name: 'Ejecutivos Remotos',
      description: 'Profesionales que trabajan desde casa y buscan flexibilidad en sus entrenamientos',
      characteristics: [
        'Trabajo remoto',
        'Horarios flexibles',
        'Interés en entrenamientos en casa',
        'Búsqueda de equilibrio trabajo-vida',
        'Disponibilidad en horarios no tradicionales',
      ],
      size: 45,
      growthRate: 28.5,
      trend: 'emerging' as const,
      detectedAt: now,
      confidence: 87,
      examples: ['Lead #1234', 'Lead #1567', 'Cliente #890'],
      similarSegments: [],
    },
    {
      id: 'segment-002',
      name: 'Mamás Post-Parto',
      description: 'Mujeres que buscan recuperar su forma física después del embarazo',
      characteristics: [
        'Post-parto reciente',
        'Búsqueda de rutinas adaptadas',
        'Necesidad de flexibilidad horaria',
        'Interés en entrenamientos de bajo impacto',
        'Preocupación por la salud',
      ],
      size: 32,
      growthRate: 22.3,
      trend: 'growing' as const,
      detectedAt: now,
      confidence: 82,
      examples: ['Lead #2345', 'Lead #2678'],
      similarSegments: [],
    },
    {
      id: 'segment-003',
      name: 'Jubilados Activos',
      description: 'Personas mayores de 60 años que buscan mantenerse activos y saludables',
      characteristics: [
        'Mayor de 60 años',
        'Enfoque en salud y prevención',
        'Disponibilidad en horarios diurnos',
        'Preferencia por actividades grupales',
        'Interés en movilidad y flexibilidad',
      ],
      size: 28,
      growthRate: 15.7,
      trend: 'growing' as const,
      detectedAt: now,
      confidence: 75,
      examples: ['Cliente #3456', 'Lead #3789'],
      similarSegments: [],
    },
    {
      id: 'segment-004',
      name: 'Estudiantes Universitarios',
      description: 'Jóvenes estudiantes que buscan entrenamientos económicos y flexibles',
      characteristics: [
        '18-25 años',
        'Presupuesto limitado',
        'Horarios irregulares',
        'Interés en entrenamientos grupales',
        'Búsqueda de comunidad',
      ],
      size: 67,
      growthRate: 18.2,
      trend: 'stable' as const,
      detectedAt: now,
      confidence: 90,
      examples: ['Lead #4567', 'Lead #4890', 'Cliente #5123'],
      similarSegments: [],
    },
  ];

  // Filtrar por tamaño mínimo si se especifica
  let filteredSegments = segments;
  if (request.minSegmentSize) {
    filteredSegments = segments.filter(s => s.size >= request.minSegmentSize!);
  }

  return {
    segments: filteredSegments,
    total: filteredSegments.length,
    detectedAt: now,
    success: true,
    message: `Se detectaron ${filteredSegments.length} micro-segmentos emergentes en el período ${lookbackPeriod}.`,
  };
};

/**
 * User Story 2: Obtener sugerencias de ofertas para micro-segmentos
 */
export const getOfferSuggestions = async (
  request: GetOfferSuggestionsRequest = {}
): Promise<GetOfferSuggestionsResponse> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const now = new Date().toISOString();

  // Primero obtener los segmentos si no se proporciona un segmentId específico
  let segments = [];
  if (request.segmentId) {
    // Si se proporciona un segmentId, obtener solo ese segmento
    const segmentsResponse = await detectMicroSegments({});
    segments = segmentsResponse.segments.filter(s => s.id === request.segmentId);
  } else {
    const segmentsResponse = await detectMicroSegments({});
    segments = segmentsResponse.segments;
  }

  // Generar sugerencias de ofertas para cada segmento
  const suggestions = [];

  for (const segment of segments) {
    if (segment.id === 'segment-001') {
      // Ejecutivos Remotos
      suggestions.push({
        id: `offer-${segment.id}-001`,
        segmentId: segment.id,
        segmentName: segment.name,
        offerName: 'Plan Remoto Premium',
        offerDescription: 'Acceso completo a entrenamientos online + consultas virtuales + plan nutricional adaptado',
        offerType: 'paquete' as const,
        offerDetails: {
          packageDetails: '3 meses de entrenamiento online + 4 consultas virtuales + plan nutricional personalizado',
        },
        rationale: 'Los ejecutivos remotos valoran la flexibilidad y la personalización. Este paquete combina entrenamientos adaptados a su horario con soporte profesional virtual.',
        expectedConversionRate: 24.5,
        expectedRevenue: 67500, // 45 leads * 24.5% * 6000€ promedio
        priority: 'alta' as const,
        canCreateCampaign: true,
        suggestedChannels: ['Email', 'LinkedIn', 'WhatsApp'],
        createdAt: now,
      });
    } else if (segment.id === 'segment-002') {
      // Mamás Post-Parto
      suggestions.push({
        id: `offer-${segment.id}-001`,
        segmentId: segment.id,
        segmentName: segment.name,
        offerName: 'Programa Post-Parto Especializado',
        offerDescription: 'Programa de 12 semanas diseñado específicamente para la recuperación post-parto',
        offerType: 'paquete' as const,
        offerDetails: {
          packageDetails: '12 semanas de entrenamiento adaptado + consultas con fisioterapeuta + grupo de apoyo',
        },
        rationale: 'Las mamás post-parto necesitan un enfoque especializado y comprensivo. Este programa ofrece apoyo integral con profesionales especializados.',
        expectedConversionRate: 28.3,
        expectedRevenue: 45312, // 32 leads * 28.3% * 5000€ promedio
        priority: 'alta' as const,
        canCreateCampaign: true,
        suggestedChannels: ['Email', 'Instagram', 'Facebook Groups'],
        createdAt: now,
      });
    } else if (segment.id === 'segment-003') {
      // Jubilados Activos
      suggestions.push({
        id: `offer-${segment.id}-001`,
        segmentId: segment.id,
        segmentName: segment.name,
        offerName: 'Descuento Senior + Clases Grupales',
        offerDescription: '20% de descuento en membresía + acceso prioritario a clases grupales de movilidad',
        offerType: 'descuento' as const,
        offerDetails: {
          discount: 20,
        },
        rationale: 'Los jubilados valoran la comunidad y la accesibilidad. El descuento y las clases grupales son atractivos para este segmento.',
        expectedConversionRate: 32.1,
        expectedRevenue: 35952, // 28 leads * 32.1% * 4000€ promedio
        priority: 'media' as const,
        canCreateCampaign: true,
        suggestedChannels: ['Email', 'Teléfono', 'Eventos locales'],
        createdAt: now,
      });
    } else if (segment.id === 'segment-004') {
      // Estudiantes Universitarios
      suggestions.push({
        id: `offer-${segment.id}-001`,
        segmentId: segment.id,
        segmentName: segment.name,
        offerName: 'Membresía Estudiante con Descuento',
        offerDescription: '30% de descuento en membresía mensual + acceso a eventos y comunidad estudiantil',
        offerType: 'descuento' as const,
        offerDetails: {
          discount: 30,
        },
        rationale: 'Los estudiantes tienen presupuesto limitado pero buscan comunidad. El descuento significativo y el acceso a eventos los atrae.',
        expectedConversionRate: 35.8,
        expectedRevenue: 71946, // 67 leads * 35.8% * 3000€ promedio
        priority: 'alta' as const,
        canCreateCampaign: true,
        suggestedChannels: ['Instagram', 'TikTok', 'Email', 'Universidades'],
        createdAt: now,
      });
    }
  }

  // Limitar resultados si se especifica
  let limitedSuggestions = suggestions;
  if (request.limit) {
    limitedSuggestions = suggestions.slice(0, request.limit);
  }

  return {
    suggestions: limitedSuggestions,
    total: limitedSuggestions.length,
    generatedAt: now,
    success: true,
    message: `Se generaron ${limitedSuggestions.length} sugerencias de ofertas para los micro-segmentos detectados.`,
  };
};

/**
 * User Story 1: Obtener impacto de la personalización en métricas clave (reservas, retención)
 * Para justificar inversión en personalización
 */
export const fetchPersonalizationImpact = async (
  request: GetPersonalizationImpactRequest = {}
): Promise<GetPersonalizationImpactResponse> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 800));

  const now = new Date().toISOString();
  const period = request.period || '30d';

  // Simular datos de impacto en reservas
  const bookings: PersonalizationImpactSnapshot['bookings'] = {
    personalized: 145,
    nonPersonalized: 112,
    increasePercentage: 29.5,
    conversionRatePersonalized: 24.5,
    conversionRateNonPersonalized: 18.3,
    bookingLift: 33,
  };

  // Simular datos de impacto en retención
  const retention: PersonalizationImpactSnapshot['retention'] = {
    retentionRatePersonalized: 87.5,
    retentionRateNonPersonalized: 82.1,
    retentionLift: 5.4,
    churnRatePersonalized: 12.5,
    churnRateNonPersonalized: 17.9,
    churnReduction: 5.4,
    retentionPeriod: '90d',
  };

  // Simular análisis de ROI
  const investment = 2500; // Inversión en personalización (costos)
  const bookingsRevenue = bookings.bookingLift * 75; // 33 reservas adicionales * 75€ promedio
  const retentionRevenue = retention.retentionLift * 150; // 5.4% retención * 150€ valor promedio cliente
  const revenueGenerated = bookingsRevenue + retentionRevenue;
  const roi = revenueGenerated - investment;
  const roiPercentage = (roi / investment) * 100;
  const paybackPeriod = investment / (revenueGenerated / 12); // En meses

  const roiData: PersonalizationImpactSnapshot['roi'] = {
    investment,
    revenueGenerated,
    bookingsRevenue,
    retentionRevenue,
    roi,
    roiPercentage,
    paybackPeriod: Math.round(paybackPeriod * 10) / 10,
    breakevenPoint: `${Math.round(paybackPeriod)} meses`,
  };

  // Métricas adicionales de impacto
  const metrics: PersonalizationImpactSnapshot['metrics'] = [
    {
      metricId: 'bookings',
      metricName: 'Reservas',
      beforeValue: bookings.nonPersonalized,
      afterValue: bookings.personalized,
      change: bookings.bookingLift,
      changePercentage: bookings.increasePercentage,
      trendDirection: 'up',
      significance: 'high',
      period: period as any,
    },
    {
      metricId: 'retention',
      metricName: 'Retención',
      beforeValue: retention.retentionRateNonPersonalized,
      afterValue: retention.retentionRatePersonalized,
      change: retention.retentionLift,
      changePercentage: (retention.retentionLift / retention.retentionRateNonPersonalized) * 100,
      trendDirection: 'up',
      significance: 'high',
      period: period as any,
    },
    {
      metricId: 'nps',
      metricName: 'NPS (Net Promoter Score)',
      beforeValue: 52,
      afterValue: 58,
      change: 6,
      changePercentage: 11.5,
      trendDirection: 'up',
      significance: 'medium',
      period: period as any,
    },
    {
      metricId: 'engagement',
      metricName: 'Engagement Rate',
      beforeValue: 68,
      afterValue: 76,
      change: 8,
      changePercentage: 11.8,
      trendDirection: 'up',
      significance: 'medium',
      period: period as any,
    },
  ];

  // Resumen en lenguaje claro
  const summary = `La personalización está generando un impacto positivo significativo en tu negocio. Las reservas han aumentado un ${bookings.increasePercentage}% (${bookings.bookingLift} reservas adicionales) gracias a la personalización, y la retención ha mejorado ${retention.retentionLift} puntos porcentuales. Esto se traduce en un ROI del ${roiPercentage.toFixed(1)}%, lo que significa que por cada euro invertido en personalización, estás generando ${(roiPercentage / 100 + 1).toFixed(2)} euros. El período de recuperación de la inversión es de aproximadamente ${roiData.breakevenPoint}.`;

  // Insights clave
  const insights = [
    `Las reservas personalizadas tienen una tasa de conversión del ${bookings.conversionRatePersonalized}%, ${(bookings.conversionRatePersonalized - bookings.conversionRateNonPersonalized).toFixed(1)} puntos porcentuales más alta que las no personalizadas`,
    `La retención ha mejorado ${retention.retentionLift} puntos porcentuales, reduciendo el abandono en ${retention.churnReduction} puntos`,
    `El ROI del ${roiPercentage.toFixed(1)}% justifica ampliamente la inversión en personalización`,
    `El período de recuperación de ${roiData.breakevenPoint} es excelente para una inversión en marketing`,
  ];

  // Recomendaciones para justificar inversión
  const recommendations = [
    'Aumenta la inversión en personalización para escalar los resultados positivos',
    'Amplía la personalización a más canales y segmentos para maximizar el impacto',
    'Documenta estos resultados para justificar futuras inversiones en personalización',
    'Considera automatizar más procesos de personalización para reducir costos y aumentar escala',
  ];

  const impact: PersonalizationImpactSnapshot = {
    period: period as any,
    bookings,
    retention,
    roi: roiData,
    metrics,
    summary,
    insights,
    recommendations,
    generatedAt: now,
    lastUpdated: now,
  };

  return {
    impact,
    success: true,
    message: 'Impacto de personalización obtenido exitosamente.',
  };
};

/**
 * User Story 2: Integrar feedback de clientes, contenido y ventas en una sola vista IA
 * Para detectar patrones entre estos tres aspectos
 */
export const fetchIntegratedAIView = async (
  request: GetIntegratedAIViewRequest = {}
): Promise<GetIntegratedAIViewResponse> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const now = new Date().toISOString();
  const period = request.period || '30d';

  // Simular datos de feedback de clientes
  const feedbackData = [
    {
      feedbackId: 'fb-001',
      customerId: 'cust-001',
      customerName: 'María González',
      feedbackType: 'survey' as const,
      content: 'Me encanta el programa personalizado de HIIT. Los entrenamientos adaptados a mi nivel han sido clave para mantener la motivación.',
      sentiment: 'positive' as const,
      sentimentScore: 92,
      topics: ['HIIT', 'personalización', 'motivación'],
      rating: 5,
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      source: 'Encuesta NPS',
    },
    {
      feedbackId: 'fb-002',
      customerId: 'cust-002',
      customerName: 'Juan Pérez',
      feedbackType: 'review' as const,
      content: 'El contenido sobre nutrición deportiva me ha ayudado mucho. Los posts sobre meal prep son muy útiles.',
      sentiment: 'positive' as const,
      sentimentScore: 88,
      topics: ['nutrición', 'meal prep', 'contenido educativo'],
      rating: 5,
      date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      source: 'Google Reviews',
    },
    {
      feedbackId: 'fb-003',
      customerId: 'cust-003',
      customerName: 'Ana Martínez',
      feedbackType: 'support' as const,
      content: 'Necesito más flexibilidad en los horarios de las sesiones. El contenido sobre entrenamientos en casa es útil pero me gustaría más variedad.',
      sentiment: 'neutral' as const,
      sentimentScore: 65,
      topics: ['horarios', 'flexibilidad', 'entrenamientos en casa'],
      rating: 3,
      date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      source: 'Soporte',
    },
  ];

  // Simular datos de contenido
  const contentData = [
    {
      contentId: 'cont-001',
      contentType: 'post' as const,
      platform: 'instagram' as const,
      title: 'Guía completa: Meal Prep para entrenadores',
      content: 'Aprende a preparar tus comidas de la semana de forma eficiente...',
      publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      engagement: {
        likes: 1250,
        comments: 89,
        shares: 45,
        views: 5200,
        engagementRate: 26.7,
      },
      performance: {
        reach: 4800,
        impressions: 5200,
        clicks: 320,
        saves: 180,
      },
    },
    {
      contentId: 'cont-002',
      contentType: 'reel' as const,
      platform: 'instagram' as const,
      title: 'HIIT de 15 minutos para principiantes',
      content: 'Rutina de HIIT adaptada para principiantes...',
      publishedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      engagement: {
        likes: 2100,
        comments: 156,
        shares: 78,
        views: 8900,
        engagementRate: 26.2,
      },
      performance: {
        reach: 8200,
        impressions: 8900,
        clicks: 450,
        saves: 320,
      },
    },
    {
      contentId: 'cont-003',
      contentType: 'post' as const,
      platform: 'facebook' as const,
      title: 'Entrenamientos en casa: Rutina completa',
      content: 'Descubre cómo mantenerte en forma desde casa...',
      publishedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      engagement: {
        likes: 890,
        comments: 45,
        shares: 23,
        views: 3200,
        engagementRate: 29.8,
      },
      performance: {
        reach: 2900,
        impressions: 3200,
        clicks: 180,
        saves: 95,
      },
    },
  ];

  // Simular datos de ventas
  const salesData = [
    {
      saleId: 'sale-001',
      customerId: 'cust-001',
      customerName: 'María González',
      amount: 450,
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      product: 'Pack Premium 3 meses',
      channel: 'Instagram',
      attribution: {
        contentId: 'cont-002',
        feedbackId: 'fb-001',
      },
    },
    {
      saleId: 'sale-002',
      customerId: 'cust-002',
      customerName: 'Juan Pérez',
      amount: 320,
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      product: 'Plan Nutricional Premium',
      channel: 'Email',
      attribution: {
        contentId: 'cont-001',
        feedbackId: 'fb-002',
      },
    },
    {
      saleId: 'sale-003',
      customerId: 'cust-004',
      customerName: 'Carlos López',
      amount: 280,
      date: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
      product: 'Membresía Mensual',
      channel: 'Facebook',
      attribution: {
        contentId: 'cont-003',
      },
    },
  ];

  // Detectar patrones
  const patterns = [
    {
      patternId: 'pattern-001',
      patternType: 'feedback-content-sales' as const,
      title: 'Contenido sobre HIIT genera feedback positivo y ventas',
      description: 'El contenido sobre HIIT (especialmente reels) está generando feedback muy positivo de clientes que mencionan la personalización y motivación. Este feedback positivo se correlaciona con ventas de packs premium.',
      confidence: 87,
      significance: 'high' as const,
      relatedData: {
        feedback: [feedbackData[0]],
        content: [contentData[1]],
        sales: [salesData[0]],
      },
      insights: [
        'Los clientes que mencionan "personalización" y "motivación" en feedback tienen mayor probabilidad de comprar packs premium',
        'El contenido sobre HIIT genera más engagement y conversiones que otros tipos de contenido',
        'Los reels de entrenamiento tienen mejor rendimiento que los posts estáticos',
      ],
      recommendations: [
        'Crear más contenido sobre HIIT personalizado para diferentes niveles',
        'Aprovechar el feedback positivo sobre personalización en campañas de venta',
        'Aumentar la frecuencia de reels sobre entrenamientos HIIT',
      ],
      detectedAt: now,
    },
    {
      patternId: 'pattern-002',
      patternType: 'feedback-content-sales' as const,
      title: 'Contenido educativo sobre nutrición genera leads cualificados',
      description: 'El contenido educativo sobre nutrición y meal prep está generando feedback positivo y ventas de planes nutricionales. Los clientes valoran el contenido útil y educativo.',
      confidence: 82,
      significance: 'high' as const,
      relatedData: {
        feedback: [feedbackData[1]],
        content: [contentData[0]],
        sales: [salesData[1]],
      },
      insights: [
        'El contenido educativo sobre nutrición tiene alta conversión a ventas de planes nutricionales',
        'Los clientes que interactúan con contenido sobre meal prep tienen mayor probabilidad de comprar planes nutricionales',
        'El contenido útil y educativo genera más confianza que el contenido promocional',
      ],
      recommendations: [
        'Aumentar la frecuencia de contenido educativo sobre nutrición',
        'Crear guías descargables sobre meal prep para captar leads',
        'Usar el contenido educativo como lead magnet para planes nutricionales',
      ],
      detectedAt: now,
    },
    {
      patternId: 'pattern-003',
      patternType: 'feedback-content' as const,
      title: 'Demanda de más contenido sobre entrenamientos en casa',
      description: 'El feedback indica que los clientes valoran el contenido sobre entrenamientos en casa pero quieren más variedad. Este contenido tiene buen engagement pero podría generar más ventas con mejor estrategia.',
      confidence: 75,
      significance: 'medium' as const,
      relatedData: {
        feedback: [feedbackData[2]],
        content: [contentData[2]],
      },
      insights: [
        'Hay demanda de más contenido sobre entrenamientos en casa',
        'El contenido existente tiene buen engagement pero podría convertirse mejor en ventas',
        'Los clientes buscan más variedad en entrenamientos en casa',
      ],
      recommendations: [
        'Crear más variedad de contenido sobre entrenamientos en casa',
        'Desarrollar programas específicos de entrenamiento en casa para vender',
        'Usar el contenido sobre entrenamientos en casa para promover membresías',
      ],
      detectedAt: now,
    },
  ];

  // Calcular correlaciones
  const correlations = {
    feedbackToSales: 78, // Alta correlación entre feedback positivo y ventas
    contentToSales: 85, // Muy alta correlación entre contenido y ventas
    feedbackToContent: 72, // Buena correlación entre feedback y contenido
  };

  // Resumen ejecutivo
  const summary = `Análisis integrado de feedback, contenido y ventas revela patrones claros: el contenido sobre HIIT personalizado está generando feedback muy positivo y ventas de packs premium (correlación del ${correlations.contentToSales}%). El contenido educativo sobre nutrición tiene alta conversión a planes nutricionales (correlación del ${correlations.feedbackToSales}% entre feedback positivo y ventas). Se detectaron ${patterns.length} patrones significativos que pueden aprovecharse para mejorar las estrategias de contenido y ventas.`;

  // Insights clave
  const keyInsights = [
    'El contenido sobre HIIT personalizado tiene el mayor impacto en feedback positivo y ventas',
    'El contenido educativo sobre nutrición genera leads muy cualificados para planes nutricionales',
    'Hay demanda no satisfecha de más variedad en contenido sobre entrenamientos en casa',
    'Los clientes que mencionan "personalización" en feedback tienen mayor probabilidad de comprar packs premium',
  ];

  // Recomendaciones accionables
  const actionableRecommendations = [
    'Aumentar la producción de contenido sobre HIIT personalizado (reels y posts)',
    'Crear más contenido educativo sobre nutrición y meal prep para captar leads',
    'Desarrollar programas específicos de entrenamiento en casa basados en la demanda detectada',
    'Usar el feedback positivo sobre personalización en campañas de venta de packs premium',
    'Crear guías descargables sobre meal prep como lead magnets para planes nutricionales',
  ];

  const view: IntegratedAIView = {
    period: period as any,
    summary,
    patterns: patterns.filter((p) => (request.minConfidence || 70) <= p.confidence),
    correlations,
    keyInsights,
    actionableRecommendations,
    generatedAt: now,
    lastUpdated: now,
  };

  return {
    view,
    success: true,
    message: 'Vista integrada IA generada exitosamente con patrones detectados.',
  };
};

// Mock storage for negative feedback micro plans
let negativeFeedbackMicroPlansStorage: NegativeFeedbackMicroPlan[] = [];

// Mock storage for positive feedback campaigns
let positiveFeedbackCampaignsStorage: PositiveFeedbackCampaign[] = [];

/**
 * User Story 1: Generar micro plan IA para feedback negativo (mensaje, acción, seguimiento)
 * Genera un plan completo para resolver rápidamente feedback negativo
 */
export const generateNegativeFeedbackMicroPlan = async (
  request: GenerateNegativeFeedbackMicroPlanRequest
): Promise<GenerateNegativeFeedbackMicroPlanResponse> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const now = new Date().toISOString();
  const feedback = request.feedback;
  const customerHistory = request.customerHistory || {};

  // Determinar prioridad basada en el feedback
  let priority: NegativeFeedbackMicroPlan['priority'] = 'medium';
  if (feedback.rating && feedback.rating <= 2) {
    priority = 'urgent';
  } else if (feedback.sentimentScore < 30) {
    priority = 'high';
  }

  // Determinar canal y tono del mensaje
  let messageChannel: 'email' | 'sms' | 'whatsapp' | 'phone' | 'in-app' = 'whatsapp';
  let messageTone: 'empatico' | 'profesional' | 'cercano' | 'directo' = 'empatico';
  let messageTiming: 'immediate' | '1h' | '4h' | '24h' = '1h';

  if (feedback.rating && feedback.rating <= 2) {
    messageChannel = 'phone';
    messageTone = 'empatico';
    messageTiming = 'immediate';
  } else if (feedback.rating === 3) {
    messageChannel = 'whatsapp';
    messageTone = 'profesional';
    messageTiming = '4h';
  } else {
    messageChannel = 'email';
    messageTone = 'cercano';
    messageTiming = '24h';
  }

  // Generar mensaje personalizado
  const messageContent = messageChannel === 'phone'
    ? `Hola ${feedback.customerName}, hemos recibido tu feedback y queremos hablar contigo personalmente para resolverlo. ¿Puedes recibir una llamada ahora?`
    : messageChannel === 'whatsapp'
    ? `Hola ${feedback.customerName}, hemos recibido tu feedback sobre "${feedback.content.substring(0, 50)}...". Nos importa mucho tu opinión y queremos resolver esto contigo. ¿Puedes hablar ahora?`
    : `Hola ${feedback.customerName},\n\nHemos recibido tu feedback y queremos asegurarnos de que tu experiencia mejore. Hemos identificado el problema y estamos trabajando en una solución.\n\n¿Puedes compartir más detalles para ayudarnos a resolver esto rápidamente?\n\nGracias por tu paciencia.`;

  // Generar acción
  const actionType: 'contact' | 'offer' | 'schedule' | 'follow-up' | 'escalate' = 
    priority === 'urgent' ? 'contact' : 
    feedback.rating && feedback.rating <= 2 ? 'offer' : 
    'follow-up';

  const actionTitle = actionType === 'contact'
    ? 'Contactar inmediatamente con el cliente'
    : actionType === 'offer'
    ? 'Ofrecer compensación o solución especial'
    : 'Programar seguimiento personalizado';

  const actionDescription = actionType === 'contact'
    ? `Contactar directamente con ${feedback.customerName} para entender mejor el problema y ofrecer una solución inmediata.`
    : actionType === 'offer'
    ? `Ofrecer una compensación o solución especial basada en el feedback negativo. Esto puede incluir una sesión gratuita, descuento, o solución personalizada.`
    : `Programar un seguimiento personalizado para asegurar que el problema se resuelva y el cliente esté satisfecho.`;

  // Generar seguimiento
  const followUpType: 'check-in' | 'survey' | 'review' | 'feedback-request' = 'check-in';
  const followUpTiming: '24h' | '48h' | '72h' | '1w' | '2w' = priority === 'urgent' ? '24h' : '48h';

  const microPlan: NegativeFeedbackMicroPlan = {
    id: `microplan-${Date.now()}`,
    feedbackId: feedback.feedbackId,
    customerId: feedback.customerId,
    customerName: feedback.customerName,
    generatedAt: now,
    status: 'pending',
    priority,
    message: {
      id: `message-${Date.now()}`,
      channel: messageChannel,
      subject: messageChannel === 'email' ? `Hemos recibido tu feedback - ${feedback.customerName}` : undefined,
      content: messageContent,
      tone: messageTone,
      personalizationVariables: ['nombre', 'feedback específico', 'solución'],
      suggestedTiming: messageTiming,
      priority,
    },
    action: {
      id: `action-${Date.now()}`,
      type: actionType,
      title: actionTitle,
      description: actionDescription,
      channel: actionType === 'contact' ? 'phone' : messageChannel,
      suggestedTiming: priority === 'urgent' ? 'immediate' : '1h',
      priority,
      estimatedDuration: actionType === 'contact' ? 15 : 30,
      requiredResources: actionType === 'contact' ? ['teléfono', 'calendario'] : ['sistema de ofertas'],
      expectedOutcome: actionType === 'contact'
        ? 'Cliente contactado y problema identificado'
        : actionType === 'offer'
        ? 'Oferta presentada y cliente satisfecho'
        : 'Seguimiento programado y cliente informado',
    },
    followUp: {
      id: `followup-${Date.now()}`,
      type: followUpType,
      title: 'Verificar resolución del problema',
      description: `Verificar que el problema se haya resuelto y el cliente esté satisfecho después de ${followUpTiming}.`,
      channel: messageChannel === 'phone' ? 'whatsapp' : messageChannel,
      suggestedTiming: followUpTiming,
      trigger: 'Después de completar la acción',
      questions: [
        '¿Se resolvió el problema?',
        '¿Estás satisfecho con la solución?',
        '¿Hay algo más en lo que podamos ayudarte?',
      ],
    },
    reasoning: `Se generó este micro plan porque el cliente ${feedback.customerName} proporcionó feedback negativo (rating: ${feedback.rating || 'N/A'}, sentimiento: ${feedback.sentimentScore}/100). El plan está diseñado para resolver el problema rápidamente y asegurar la satisfacción del cliente.`,
    confidenceScore: 85,
    estimatedResolutionTime: priority === 'urgent' ? '24 horas' : '48-72 horas',
    successMetrics: [
      {
        metric: 'Satisfacción del cliente',
        target: 4,
        current: feedback.rating || 0,
      },
      {
        metric: 'Tiempo de resolución (horas)',
        target: priority === 'urgent' ? 24 : 72,
      },
    ],
  };

  // Guardar en storage
  negativeFeedbackMicroPlansStorage.push(microPlan);

  return {
    microPlan,
    success: true,
    message: 'Micro plan generado exitosamente. El plan incluye mensaje, acción y seguimiento para resolver el feedback negativo rápidamente.',
  };
};

/**
 * User Story 1: Obtener micro planes de feedback negativo
 */
export const getNegativeFeedbackMicroPlans = async (
  request: GetNegativeFeedbackMicroPlansRequest = {}
): Promise<GetNegativeFeedbackMicroPlansResponse> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 300));

  let microPlans = [...negativeFeedbackMicroPlansStorage];

  // Filtrar por status si se proporciona
  if (request.status) {
    microPlans = microPlans.filter((mp) => mp.status === request.status);
  }

  // Filtrar por priority si se proporciona
  if (request.priority) {
    microPlans = microPlans.filter((mp) => mp.priority === request.priority);
  }

  // Limitar resultados si se especifica
  if (request.limit) {
    microPlans = microPlans.slice(0, request.limit);
  }

  return {
    microPlans,
    total: microPlans.length,
    retrievedAt: new Date().toISOString(),
    success: true,
    message: `Se encontraron ${microPlans.length} micro planes de feedback negativo.`,
  };
};

/**
 * User Story 2: Generar campaña automatizada basada en feedback positivo
 * Genera una campaña para aprovechar el momentum del feedback positivo (ej: invitar a programa premium)
 */
export const generatePositiveFeedbackCampaign = async (
  request: GeneratePositiveFeedbackCampaignRequest
): Promise<GeneratePositiveFeedbackCampaignResponse> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const now = new Date().toISOString();
  const feedback = request.feedback;
  const customerHistory = request.customerHistory || {};
  const campaignTypes = request.campaignTypes || ['premium-invitation', 'referral-program', 'upsell'];

  // Determinar el tipo de campaña más adecuado basado en el feedback
  let selectedCampaignType: CampaignType = 'premium-invitation';
  let campaignName = '';
  let campaignDescription = '';
  let campaignObjective = '';
  let campaignRationale = '';
  let expectedConversionRate = 0;
  let expectedRevenue = 0;

  // Analizar el feedback para determinar la mejor campaña
  if (feedback.rating && feedback.rating >= 5) {
    if (customerHistory.currentPlan && !customerHistory.currentPlan.includes('Premium')) {
      selectedCampaignType = 'premium-invitation';
      campaignName = `Invitación Premium para ${feedback.customerName}`;
      campaignDescription = `Invitación especial al programa premium basada en feedback muy positivo`;
      campaignObjective = 'Convertir cliente satisfecho en cliente premium';
      campaignRationale = `El cliente ${feedback.customerName} ha dado feedback muy positivo (rating: ${feedback.rating}/5) y está en un plan básico. Este es el momento perfecto para invitarle al programa premium.`;
      expectedConversionRate = 35;
      expectedRevenue = customerHistory.totalSessions && customerHistory.totalSessions > 10 ? 500 : 300;
    } else if (!customerHistory.previousCampaigns?.includes('referral')) {
      selectedCampaignType = 'referral-program';
      campaignName = `Programa de Referidos para ${feedback.customerName}`;
      campaignDescription = `Invitación al programa de referidos basada en feedback muy positivo`;
      campaignObjective = 'Incentivar referidos de clientes satisfechos';
      campaignRationale = `El cliente ${feedback.customerName} está muy satisfecho y puede ser un gran promotor. Invitarle al programa de referidos puede generar nuevos clientes.`;
      expectedConversionRate = 25;
      expectedRevenue = 200;
    }
  } else if (feedback.sentimentScore >= 80) {
    selectedCampaignType = 'upsell';
    campaignName = `Oferta Especial para ${feedback.customerName}`;
    campaignDescription = `Oferta especial basada en feedback positivo`;
      campaignObjective = 'Aumentar valor del cliente con oferta especial';
      campaignRationale = `El cliente ${feedback.customerName} está satisfecho (sentimiento: ${feedback.sentimentScore}/100). Este es un buen momento para ofrecerle servicios adicionales.`;
      expectedConversionRate = 20;
      expectedRevenue = 150;
  }

  // Generar contenido de la campaña
  const campaignMessage = selectedCampaignType === 'premium-invitation'
    ? `¡Hola ${feedback.customerName}!\n\nNos encanta saber que estás disfrutando de nuestros servicios. Basado en tu feedback positivo, queremos invitarte a conocer nuestro programa Premium.\n\nEl programa Premium incluye:\n- Sesiones ilimitadas\n- Plan nutricional personalizado\n- Acceso prioritario a eventos\n- Descuentos exclusivos\n\n¿Te gustaría conocer más?`
    : selectedCampaignType === 'referral-program'
    ? `¡Hola ${feedback.customerName}!\n\nGracias por tu feedback positivo. Nos encanta saber que estás disfrutando de nuestros servicios.\n\n¿Sabías que puedes ganar beneficios invitando a tus amigos? Por cada amigo que invites y se una, recibirás un mes gratis.\n\n¿Te interesa?`
    : `¡Hola ${feedback.customerName}!\n\nGracias por tu feedback positivo. Nos encanta saber que estás disfrutando de nuestros servicios.\n\nTenemos una oferta especial para ti: [Descripción de la oferta]\n\n¿Te interesa conocer más?`;

  const campaign: PositiveFeedbackCampaign = {
    id: `campaign-${Date.now()}`,
    feedbackId: feedback.feedbackId,
    customerId: feedback.customerId,
    customerName: feedback.customerName,
    campaignType: selectedCampaignType,
    name: campaignName,
    description: campaignDescription,
    objective: campaignObjective,
    channel: 'email',
    content: {
      subject: selectedCampaignType === 'premium-invitation' 
        ? `🎉 Invitación Especial: Programa Premium para ti`
        : selectedCampaignType === 'referral-program'
        ? `🎁 Programa de Referidos: Gana beneficios invitando amigos`
        : `🎯 Oferta Especial para ti`,
      message: campaignMessage,
      cta: selectedCampaignType === 'premium-invitation' 
        ? 'Conocer más sobre Premium'
        : selectedCampaignType === 'referral-program'
        ? 'Invitar amigos'
        : 'Ver oferta',
      personalizationVariables: ['nombre', 'feedback específico', 'beneficios'],
    },
    trigger: {
      condition: feedback.rating && feedback.rating >= 4 ? 'high-rating' : 'positive-feedback',
      minRating: feedback.rating || 4,
      sentimentScore: feedback.sentimentScore,
      topics: feedback.topics,
    },
    timing: {
      delay: '24h', // Enviar 24 horas después del feedback positivo para aprovechar el momentum
      bestTime: '10:00', // Hora óptima para enviar
    },
    status: request.autoActivate ? 'active' : 'draft',
    priority: expectedConversionRate >= 30 ? 'high' : 'medium',
    expectedConversionRate,
    expectedRevenue,
    generatedAt: now,
    activatedAt: request.autoActivate ? now : undefined,
  };

  // Generar sugerencias adicionales si hay múltiples opciones
  const suggestions: CampaignSuggestion[] = [];
  if (campaignTypes.length > 1) {
    campaignTypes.forEach((type) => {
      if (type !== selectedCampaignType) {
        suggestions.push({
          id: `suggestion-${Date.now()}-${type}`,
          feedbackId: feedback.feedbackId,
          customerId: feedback.customerId,
          customerName: feedback.customerName,
          suggestionType: type,
          name: `Campaña ${type} para ${feedback.customerName}`,
          description: `Campaña ${type} basada en feedback positivo`,
          rationale: `Alternativa ${type} para aprovechar el feedback positivo`,
          expectedConversionRate: type === 'premium-invitation' ? 30 : type === 'referral-program' ? 25 : 20,
          expectedRevenue: type === 'premium-invitation' ? 400 : type === 'referral-program' ? 200 : 150,
          priority: 'medium',
          confidenceScore: 75,
          canAutoActivate: false,
          suggestedChannels: ['email', 'whatsapp'],
          generatedAt: now,
        });
      }
    });
  }

  // Guardar en storage si se activa automáticamente
  if (request.autoActivate) {
    positiveFeedbackCampaignsStorage.push(campaign);
  }

  return {
    campaign,
    suggestions: suggestions.length > 0 ? suggestions : undefined,
    success: true,
    message: request.autoActivate
      ? 'Campaña generada y activada automáticamente para aprovechar el momentum del feedback positivo.'
      : 'Campaña generada exitosamente. Lista para activar y aprovechar el momentum del feedback positivo.',
  };
};

/**
 * User Story 2: Activar campaña automáticamente
 */
export const autoActivateCampaign = async (
  request: AutoActivateCampaignRequest
): Promise<AutoActivateCampaignResponse> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 500));

  const now = new Date().toISOString();

  // Buscar la campaña en storage o generar una nueva (simulado)
  let campaign = positiveFeedbackCampaignsStorage.find((c) => c.id === request.campaignId);

  if (!campaign) {
    // Si no se encuentra, crear una campaña activa (simulado)
    campaign = {
      id: request.campaignId,
      feedbackId: request.feedbackId,
      customerId: request.customerId,
      customerName: 'Cliente',
      campaignType: 'premium-invitation',
      name: 'Campaña Premium',
      description: 'Campaña activada automáticamente',
      objective: 'Aprovechar momentum de feedback positivo',
      channel: 'email',
      content: {
        subject: 'Invitación Especial',
        message: 'Mensaje de la campaña',
        cta: 'Actuar ahora',
        personalizationVariables: ['nombre'],
      },
      trigger: {
        condition: 'positive-feedback',
        minRating: 4,
      },
      timing: {
        delay: '24h',
      },
      status: 'active',
      priority: 'high',
      expectedConversionRate: 30,
      expectedRevenue: 300,
      generatedAt: now,
      activatedAt: now,
    };
  } else {
    // Actualizar status a active
    campaign.status = 'active';
    campaign.activatedAt = now;
  }

  // Guardar en storage
  const existingIndex = positiveFeedbackCampaignsStorage.findIndex((c) => c.id === request.campaignId);
  if (existingIndex >= 0) {
    positiveFeedbackCampaignsStorage[existingIndex] = campaign;
  } else {
    positiveFeedbackCampaignsStorage.push(campaign);
  }

  return {
    campaign,
    success: true,
    message: 'Campaña activada automáticamente. Se enviará en el momento óptimo para aprovechar el momentum del feedback positivo.',
  };
};

/**
 * User Story 2: Obtener campañas de feedback positivo
 */
export const getPositiveFeedbackCampaigns = async (
  request: GetPositiveFeedbackCampaignsRequest = {}
): Promise<GetPositiveFeedbackCampaignsResponse> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 300));

  let campaigns = [...positiveFeedbackCampaignsStorage];

  // Filtrar por status si se proporciona
  if (request.status) {
    campaigns = campaigns.filter((c) => c.status === request.status);
  }

  // Filtrar por campaignType si se proporciona
  if (request.campaignType) {
    campaigns = campaigns.filter((c) => c.campaignType === request.campaignType);
  }

  // Limitar resultados si se especifica
  if (request.limit) {
    campaigns = campaigns.slice(0, request.limit);
  }

  return {
    campaigns,
    total: campaigns.length,
    retrievedAt: new Date().toISOString(),
    success: true,
    message: `Se encontraron ${campaigns.length} campañas de feedback positivo.`,
  };
};

// User Story 1: Obtener insights IA por canal (Ads, orgánico, referidos) con recomendaciones concretas
export const getChannelInsights = async (
  request: GetChannelInsightsRequest = {}
): Promise<ChannelInsightsResponse> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 500));

  const period = request.period || '30d';
  const now = new Date().toISOString();

  // Mock data para insights por canal
  const mockInsights: ChannelInsight[] = [
    {
      id: 'ci-ads-001',
      channel: 'ads',
      title: 'ROAS en descenso en campañas de Facebook',
      description: 'El ROAS de tus campañas de Facebook ha disminuido un 15% en los últimos 30 días. La competencia está aumentando y los costos por clic están subiendo.',
      currentPerformance: {
        metric: 'ROAS',
        value: 2.8,
        changePercentage: -15,
        trendDirection: 'down',
        period: period as '7d' | '30d' | '90d',
      },
      recommendations: [
        {
          id: 'rec-ads-001',
          title: 'Optimizar audiencias con lookalike mejoradas',
          description: 'Crea audiencias lookalike basadas en tus mejores clientes de los últimos 90 días',
          action: 'Ir a Facebook Ads Manager > Audiences > Crear Lookalike Audience',
          effort: 'bajo',
          impact: 'alto',
          timeframe: '2 días',
          resources: ['Facebook Ads Manager', 'Lista de clientes de alto valor'],
          expectedOutcome: 'Reducción del 20-30% en costos por adquisición',
          priority: 9,
        },
        {
          id: 'rec-ads-002',
          title: 'Ajustar pujas por hora del día',
          description: 'Reduce pujas en horas de bajo rendimiento y aumenta en horas pico',
          action: 'Configurar reglas de puja automática por hora en campañas activas',
          effort: 'medio',
          impact: 'medio',
          timeframe: '1 semana',
          resources: ['Datos históricos de rendimiento por hora'],
          expectedOutcome: 'Mejora del 10-15% en eficiencia de gasto',
          priority: 7,
        },
      ],
      priority: 'high',
      estimatedImpact: {
        metric: 'ROAS',
        expectedImprovement: 25,
        confidence: 85,
      },
      generatedAt: now,
    },
    {
      id: 'ci-organico-001',
      channel: 'organico',
      title: 'Alto engagement en contenido de nutrición',
      description: 'Tu contenido sobre nutrición deportiva está generando 3x más engagement que otros temas. Hay una oportunidad clara de capitalizar esta tendencia.',
      currentPerformance: {
        metric: 'Engagement Rate',
        value: 8.5,
        changePercentage: 45,
        trendDirection: 'up',
        period: period as '7d' | '30d' | '90d',
      },
      recommendations: [
        {
          id: 'rec-org-001',
          title: 'Crear serie semanal de nutrición',
          description: 'Lanza una serie de contenido semanal sobre nutrición deportiva para mantener el momentum',
          action: 'Planificar 4 posts semanales sobre nutrición con diferentes formatos (Reel, Carousel, Post)',
          effort: 'medio',
          impact: 'alto',
          timeframe: '2 semanas',
          resources: ['Contenido de nutrición', 'Calendario editorial'],
          expectedOutcome: 'Aumento del 40% en seguidores y 25% en leads orgánicos',
          priority: 8,
        },
        {
          id: 'rec-org-002',
          title: 'Amplificar contenido top con presupuesto',
          description: 'Usa los posts de nutrición más exitosos como base para campañas pagadas',
          action: 'Seleccionar top 3 posts de nutrición y crear campañas de engagement en Instagram',
          effort: 'bajo',
          impact: 'alto',
          timeframe: '3 días',
          resources: ['Presupuesto de ads', 'Posts existentes'],
          expectedOutcome: 'Conversión de engagement orgánico en leads calificados',
          priority: 9,
        },
      ],
      priority: 'high',
      estimatedImpact: {
        metric: 'Leads Orgánicos',
        expectedImprovement: 35,
        confidence: 90,
      },
      generatedAt: now,
    },
    {
      id: 'ci-referidos-001',
      channel: 'referidos',
      title: 'Programa de referidos infrautilizado',
      description: 'Solo el 12% de tus clientes activos están participando en el programa de referidos. Hay un potencial significativo sin explotar.',
      currentPerformance: {
        metric: 'Tasa de Participación',
        value: 12,
        changePercentage: -5,
        trendDirection: 'down',
        period: period as '7d' | '30d' | '90d',
      },
      recommendations: [
        {
          id: 'rec-ref-001',
          title: 'Lanzar campaña de activación de referidos',
          description: 'Envía un email personalizado a clientes satisfechos invitándolos a referir',
          action: 'Crear email con testimoniales y beneficios claros del programa de referidos',
          effort: 'bajo',
          impact: 'alto',
          timeframe: '1 semana',
          resources: ['Lista de clientes satisfechos', 'Plantilla de email'],
          expectedOutcome: 'Aumento del 50% en referidos en 30 días',
          priority: 8,
        },
        {
          id: 'rec-ref-002',
          title: 'Mejorar incentivos del programa',
          description: 'Aumenta los incentivos para referidos y referidores para aumentar la motivación',
          action: 'Revisar y actualizar estructura de recompensas del programa',
          effort: 'medio',
          impact: 'medio',
          timeframe: '2 semanas',
          resources: ['Presupuesto para incentivos'],
          expectedOutcome: 'Mejora sostenida en tasa de referidos',
          priority: 6,
        },
      ],
      priority: 'medium',
      estimatedImpact: {
        metric: 'Referidos Generados',
        expectedImprovement: 50,
        confidence: 75,
      },
      generatedAt: now,
    },
  ];

  // Filtrar por canales si se especifica
  let filteredInsights = mockInsights;
  if (request.channels && request.channels.length > 0) {
    filteredInsights = mockInsights.filter((insight) => request.channels?.includes(insight.channel));
  }

  // Filtrar por prioridad mínima si se especifica
  if (request.minPriority) {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const minPriorityValue = priorityOrder[request.minPriority];
    filteredInsights = filteredInsights.filter(
      (insight) => priorityOrder[insight.priority] >= minPriorityValue
    );
  }

  // Calcular resumen
  const channels = ['ads', 'organico', 'referidos'] as ChannelType[];
  const channelSummary = channels.map((channel) => {
    const channelInsights = filteredInsights.filter((i) => i.channel === channel);
    const avgImpact = channelInsights.length > 0
      ? channelInsights.reduce((sum, i) => sum + i.estimatedImpact.expectedImprovement, 0) / channelInsights.length
      : 0;
    return {
      channel,
      insightCount: channelInsights.length,
      avgImpact: Math.round(avgImpact),
    };
  });

  return {
    insights: filteredInsights,
    summary: {
      totalInsights: filteredInsights.length,
      highPriorityCount: filteredInsights.filter((i) => i.priority === 'high').length,
      channels: channelSummary,
    },
    period: period as '7d' | '30d' | '90d',
    generatedAt: now,
    success: true,
    message: `Se encontraron ${filteredInsights.length} insights por canal.`,
  };
};

// User Story 2: Obtener alertas de tendencias de mercado y movimientos competidores
export const getMarketTrendsAlerts = async (
  request: GetMarketTrendsAlertsRequest = {}
): Promise<MarketTrendsAlertsResponse> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 500));

  const period = request.period || '30d';
  const now = new Date().toISOString();

  // Mock data para tendencias de mercado
  const mockMarketTrends: MarketTrendAlert[] = [
    {
      id: 'mt-001',
      type: 'tendencia_mercado',
      title: 'Aumento del 40% en búsquedas de "entrenamiento online personalizado"',
      description: 'Las búsquedas de entrenamiento online personalizado han aumentado significativamente en los últimos 30 días, especialmente en el segmento de profesionales remotos.',
      relevance: 'alta',
      urgency: 'alta',
      impact: {
        potential: 'alto',
        timeframe: 'corto_plazo',
        affectedChannels: ['organico', 'ads'],
      },
      source: 'Google Trends, Análisis de búsquedas',
      detectedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      actionableInsights: [
        'El mercado está buscando más personalización en entrenamiento online',
        'Los profesionales remotos son un segmento en crecimiento',
        'Hay oportunidad de posicionarse como líder en entrenamiento personalizado online',
      ],
      recommendedActions: [
        {
          action: 'Crear contenido SEO optimizado para "entrenamiento online personalizado"',
          priority: 9,
          timeframe: '1 semana',
        },
        {
          action: 'Lanzar campaña de ads dirigida a profesionales remotos',
          priority: 8,
          timeframe: '2 semanas',
        },
      ],
    },
    {
      id: 'mt-002',
      type: 'oportunidad_emergente',
      title: 'Nueva tecnología de tracking de movimiento con IA',
      description: 'Una nueva tecnología de tracking de movimiento con IA está ganando tracción. Los entrenadores que la adoptan temprano están viendo mejoras en retención de clientes.',
      relevance: 'media',
      urgency: 'media',
      impact: {
        potential: 'medio',
        timeframe: 'medio_plazo',
        affectedChannels: ['organico'],
      },
      source: 'TechCrunch, Industry Reports',
      detectedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      actionableInsights: [
        'La tecnología puede diferenciar tu oferta',
        'Los clientes valoran herramientas innovadoras',
        'Adopción temprana puede generar contenido viral',
      ],
      recommendedActions: [
        {
          action: 'Investigar y evaluar la tecnología para integración',
          priority: 6,
          timeframe: '1 mes',
        },
      ],
    },
  ];

  // Mock data para movimientos competidores
  const mockCompetitorMovements: CompetitorMovementAlert[] = [
    {
      id: 'cm-001',
      competitorName: 'FitPro Academy',
      movementType: 'cambio_precio',
      title: 'FitPro Academy redujo precios en 25%',
      description: 'Tu competidor principal redujo sus precios en un 25% para sus planes mensuales, lo que puede afectar tu capacidad de competir en el segmento de precio.',
      details: {
        what: 'Reducción del 25% en planes mensuales',
        when: 'Hace 3 días',
        where: 'Toda su oferta online',
        impact: 'Puede capturar clientes sensibles al precio',
      },
      relevance: 'alta',
      urgency: 'urgente',
      threatLevel: 'alto',
      opportunityLevel: 'medio',
      recommendedResponse: [
        {
          action: 'Enfatizar diferenciadores de valor (no competir solo en precio)',
          priority: 10,
          timeframe: 'Inmediato',
          rationale: 'Competir solo en precio es insostenible. Mejor destacar valor único.',
        },
        {
          action: 'Crear campaña de retención para clientes existentes',
          priority: 9,
          timeframe: '1 semana',
          rationale: 'Proteger base de clientes actual antes de que consideren cambiar',
        },
        {
          action: 'Lanzar oferta limitada de valor agregado (no descuento)',
          priority: 8,
          timeframe: '2 semanas',
          rationale: 'Competir con valor, no con precio. Ofrecer algo que ellos no tienen.',
        },
      ],
      detectedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      source: 'Monitoreo de competencia, Análisis de precios',
    },
    {
      id: 'cm-002',
      competitorName: 'Elite Training Co',
      movementType: 'nuevo_producto',
      title: 'Elite Training Co lanzó programa de nutrición integrado',
      description: 'Tu competidor lanzó un nuevo programa que combina entrenamiento y nutrición, lo que puede atraer clientes que buscan una solución integral.',
      details: {
        what: 'Nuevo programa de entrenamiento + nutrición',
        when: 'Hace 1 semana',
        where: 'Todas sus plataformas',
        impact: 'Puede capturar clientes que buscan solución integral',
      },
      relevance: 'alta',
      urgency: 'alta',
      threatLevel: 'medio',
      opportunityLevel: 'alto',
      recommendedResponse: [
        {
          action: 'Evaluar asociación con nutricionista o crear contenido de nutrición',
          priority: 8,
          timeframe: '1 mes',
          rationale: 'Ofrecer valor similar sin necesidad de desarrollar producto completo',
        },
        {
          action: 'Destacar fortalezas únicas que ellos no tienen',
          priority: 7,
          timeframe: '2 semanas',
          rationale: 'Diferenciarse en áreas donde eres más fuerte',
        },
      ],
      detectedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      source: 'Análisis de competencia, Redes sociales',
    },
  ];

  // Filtrar por tipos si se especifica
  let filteredTrends = mockMarketTrends;
  if (request.trendTypes && request.trendTypes.length > 0) {
    filteredTrends = mockMarketTrends.filter((trend) => request.trendTypes?.includes(trend.type));
  }

  let filteredMovements = mockCompetitorMovements;
  if (request.movementTypes && request.movementTypes.length > 0) {
    filteredMovements = mockCompetitorMovements.filter((movement) =>
      request.movementTypes?.includes(movement.movementType)
    );
  }

  // Filtrar por relevancia mínima
  if (request.minRelevance) {
    const relevanceOrder = { alta: 3, media: 2, baja: 1 };
    const minRelevanceValue = relevanceOrder[request.minRelevance];
    filteredTrends = filteredTrends.filter(
      (trend) => relevanceOrder[trend.relevance] >= minRelevanceValue
    );
    filteredMovements = filteredMovements.filter(
      (movement) => relevanceOrder[movement.relevance] >= minRelevanceValue
    );
  }

  // Filtrar por urgencia mínima
  if (request.minUrgency) {
    const urgencyOrder = { urgente: 4, alta: 3, media: 2, baja: 1 };
    const minUrgencyValue = urgencyOrder[request.minUrgency];
    filteredTrends = filteredTrends.filter(
      (trend) => urgencyOrder[trend.urgency] >= minUrgencyValue
    );
    filteredMovements = filteredMovements.filter(
      (movement) => urgencyOrder[movement.urgency] >= minUrgencyValue
    );
  }

  // Limitar resultados si se especifica
  if (request.limit) {
    filteredTrends = filteredTrends.slice(0, request.limit);
    filteredMovements = filteredMovements.slice(0, request.limit);
  }

  // Calcular resumen
  const trendsByType = (['tendencia_mercado', 'movimiento_competidor', 'oportunidad_emergente', 'cambio_regulatorio', 'tecnologia_nueva'] as MarketTrendType[]).map((type) => ({
    type,
    count: filteredTrends.filter((t) => t.type === type).length,
  }));

  const movementsByType = (['nuevo_producto', 'cambio_precio', 'campaña_marketing', 'expansion', 'partnership', 'cambio_posicionamiento'] as CompetitorMovementType[]).map((type) => ({
    type,
    count: filteredMovements.filter((m) => m.movementType === type).length,
  }));

  return {
    marketTrends: filteredTrends,
    competitorMovements: filteredMovements,
    summary: {
      totalAlerts: filteredTrends.length + filteredMovements.length,
      urgentCount: [
        ...filteredTrends.filter((t) => t.urgency === 'urgente'),
        ...filteredMovements.filter((m) => m.urgency === 'urgente'),
      ].length,
      highRelevanceCount: [
        ...filteredTrends.filter((t) => t.relevance === 'alta'),
        ...filteredMovements.filter((m) => m.relevance === 'alta'),
      ].length,
      trendsByType,
      movementsByType,
    },
    period: period as '7d' | '30d' | '90d',
    generatedAt: now,
    success: true,
    message: `Se encontraron ${filteredTrends.length} tendencias de mercado y ${filteredMovements.length} movimientos competidores.`,
  };
};

// User Story 1: Generar plan trimestral IA basado en OKRs y roadmap
export const generateQuarterlyPlan = async (
  request: GenerateQuarterlyPlanRequest
): Promise<GenerateQuarterlyPlanResponse> => {
  const now = new Date();
  const quarter = request.quarter || `Q${Math.floor(now.getMonth() / 3) + 1}-${now.getFullYear()}`;
  const quarterMatch = quarter.match(/Q(\d)-(\d{4})/);
  const quarterNum = quarterMatch ? parseInt(quarterMatch[1]) : Math.floor(now.getMonth() / 3) + 1;
  const year = quarterMatch ? parseInt(quarterMatch[2]) : now.getFullYear();

  // Mock OKRs si no se proporcionan
  const mockOKRs: OKRData[] = request.okrs || [
    {
      id: 'okr-001',
      objective: 'Aumentar captación de leads en 30%',
      keyResults: [
        {
          id: 'kr-001',
          description: 'Generar 150 leads calificados',
          target: 150,
          current: 45,
          unit: 'leads',
          progress: 30,
        },
        {
          id: 'kr-002',
          description: 'Mejorar tasa de conversión a 15%',
          target: 15,
          current: 12,
          unit: '%',
          progress: 80,
        },
      ],
      period: quarter,
      status: 'in_progress',
    },
    {
      id: 'okr-002',
      objective: 'Incrementar ventas de packs premium en 25%',
      keyResults: [
        {
          id: 'kr-003',
          description: 'Vender 50 packs premium',
          target: 50,
          current: 18,
          unit: 'packs',
          progress: 36,
        },
      ],
      period: quarter,
      status: 'in_progress',
    },
  ];

  // Mock roadmap items si no se proporcionan
  const mockRoadmapItems: RoadmapItem[] = request.roadmapItems || [
    {
      id: 'rm-001',
      title: 'Campaña de lanzamiento Q1',
      description: 'Campaña integral de lanzamiento para Q1',
      category: 'campaign',
      priority: 'high',
      status: 'planned',
      startDate: new Date(year, (quarterNum - 1) * 3, 1).toISOString(),
      endDate: new Date(year, quarterNum * 3, 0).toISOString(),
    },
    {
      id: 'rm-002',
      title: 'Programa de contenido mensual',
      description: 'Crear contenido de valor mensual',
      category: 'content',
      priority: 'medium',
      status: 'planned',
    },
  ];

  // Generar milestones basados en OKRs y roadmap
  const milestones: QuarterlyPlan['milestones'] = [
    {
      id: 'ms-001',
      title: 'Lanzamiento campaña Q1',
      description: 'Iniciar campaña de lanzamiento para Q1',
      month: 1,
      week: 1,
      deliverables: ['Diseño de campaña', 'Contenido inicial', 'Segmentación de audiencia'],
      successMetrics: [
        { metric: 'Leads generados', target: 50, unit: 'leads' },
        { metric: 'Tasa de conversión', target: 12, unit: '%' },
      ],
      status: 'planned',
      relatedOKRId: 'okr-001',
      relatedRoadmapItemId: 'rm-001',
    },
    {
      id: 'ms-002',
      title: 'Optimización de conversión',
      description: 'Optimizar proceso de conversión basado en datos',
      month: 2,
      deliverables: ['Análisis de datos', 'A/B tests', 'Mejoras en funnel'],
      successMetrics: [
        { metric: 'Tasa de conversión', target: 15, unit: '%' },
        { metric: 'Ventas de packs', target: 25, unit: 'packs' },
      ],
      status: 'planned',
      relatedOKRId: 'okr-002',
    },
    {
      id: 'ms-003',
      title: 'Evaluación y ajustes Q1',
      description: 'Evaluar resultados y hacer ajustes para Q2',
      month: 3,
      week: 4,
      deliverables: ['Reporte de resultados', 'Análisis de impacto', 'Plan para Q2'],
      successMetrics: [
        { metric: 'Alcance de objetivos', target: 80, unit: '%' },
      ],
      status: 'planned',
    },
  ];

  // Generar iniciativas clave
  const keyInitiatives: QuarterlyPlan['keyInitiatives'] = [
    {
      id: 'init-001',
      name: 'Campaña de captación multi-canal',
      description: 'Lanzar campaña integral en múltiples canales para captar leads',
      priority: 'high',
      status: 'planned',
      progress: 0,
      expectedImpact: 'high',
      relatedOKRId: 'okr-001',
      startDate: new Date(year, (quarterNum - 1) * 3, 1).toISOString(),
      endDate: new Date(year, (quarterNum - 1) * 3 + 1, 15).toISOString(),
    },
    {
      id: 'init-002',
      name: 'Optimización de funnel de ventas',
      description: 'Mejorar proceso de venta para aumentar conversión',
      priority: 'high',
      status: 'planned',
      progress: 0,
      expectedImpact: 'high',
      relatedOKRId: 'okr-002',
    },
    {
      id: 'init-003',
      name: 'Programa de contenido estratégico',
      description: 'Crear contenido de valor para engagement y captación',
      priority: 'medium',
      status: 'planned',
      progress: 0,
      expectedImpact: 'medium',
      relatedRoadmapItemId: 'rm-002',
    },
  ];

  // Generar recomendaciones IA
  const aiRecommendations: QuarterlyPlan['aiRecommendations'] = [
    {
      id: 'rec-001',
      category: 'strategy',
      title: 'Enfocar esfuerzos en canales de mayor ROI',
      description: 'Basado en datos históricos, enfocar esfuerzos en email marketing y contenido orgánico',
      priority: 'high',
      rationale: 'Estos canales han demostrado mayor ROI en trimestres anteriores',
      suggestedActions: [
        'Aumentar presupuesto en email marketing',
        'Crear más contenido orgánico de valor',
        'Reducir inversión en canales de bajo rendimiento',
      ],
    },
    {
      id: 'rec-002',
      category: 'timing',
      title: 'Lanzar campaña a principios de mes',
      description: 'Los datos muestran mayor engagement en los primeros 10 días del mes',
      priority: 'medium',
      rationale: 'Los clientes están más activos al inicio del mes',
      suggestedActions: [
        'Programar lanzamientos para primeros días del mes',
        'Enviar comunicaciones importantes en esta ventana',
      ],
    },
  ];

  // Calcular progreso
  const okrProgress = mockOKRs.reduce((acc, okr) => {
    const krProgress = okr.keyResults.reduce((sum, kr) => sum + kr.progress, 0) / okr.keyResults.length;
    return acc + krProgress;
  }, 0) / mockOKRs.length;

  const milestoneProgress = milestones.reduce((acc, ms) => {
    const statusProgress = ms.status === 'completed' ? 100 : ms.status === 'in_progress' ? 50 : 0;
    return acc + statusProgress;
  }, 0) / milestones.length;

  const initiativeProgress = keyInitiatives.reduce((acc, init) => acc + init.progress, 0) / keyInitiatives.length;

  const overallProgress = (okrProgress + milestoneProgress + initiativeProgress) / 3;

  // Crear plan
  const plan: QuarterlyPlan = {
    id: `plan-${quarter}-${Date.now()}`,
    quarter,
    year,
    title: `Plan Estratégico ${quarter}`,
    description: `Plan estratégico trimestral generado por IA basado en OKRs y roadmap para ${quarter}`,
    strategicObjectives: request.strategicProfile?.objectives || [
      'Aumentar captación de leads',
      'Incrementar ventas de packs premium',
      'Mejorar engagement de clientes',
    ],
    okrs: mockOKRs,
    roadmapItems: mockRoadmapItems,
    milestones,
    keyInitiatives,
    aiRecommendations,
    progress: {
      overall: Math.round(overallProgress),
      okrs: Math.round(okrProgress),
      milestones: Math.round(milestoneProgress),
      initiatives: Math.round(initiativeProgress),
    },
    alignment: {
      okrAlignment: 95,
      roadmapAlignment: 90,
      strategyAlignment: 85,
    },
    generatedAt: now.toISOString(),
    updatedAt: now.toISOString(),
    status: 'draft',
  };

  return {
    plan,
    success: true,
    message: `Plan trimestral ${quarter} generado exitosamente.`,
  };
};

// User Story 1: Obtener plan trimestral
export const getQuarterlyPlan = async (
  request: GetQuarterlyPlanRequest
): Promise<GetQuarterlyPlanResponse> => {
  // En producción, esto haría una llamada a la API
  // Por ahora, generamos un plan si no existe
  const now = new Date();
  const quarter = request.quarter || `Q${Math.floor(now.getMonth() / 3) + 1}-${now.getFullYear()}`;

  // Si no hay plan almacenado, generar uno nuevo
  const generateRequest: GenerateQuarterlyPlanRequest = {
    trainerId: request.trainerId,
    quarter,
  };

  const response = await generateQuarterlyPlan(generateRequest);

  return {
    plan: response.plan,
    success: true,
    message: `Plan trimestral ${quarter} obtenido exitosamente.`,
  };
};

// User Story 1: Actualizar plan trimestral
export const updateQuarterlyPlan = async (
  request: UpdateQuarterlyPlanRequest
): Promise<UpdateQuarterlyPlanResponse> => {
  // En producción, esto haría una llamada a la API
  // Por ahora, simulamos la actualización
  const now = new Date();

  // Obtener el plan actual
  const getRequest: GetQuarterlyPlanRequest = {
    trainerId: undefined,
  };
  const currentPlanResponse = await getQuarterlyPlan(getRequest);

  if (!currentPlanResponse.plan) {
    throw new Error('Plan no encontrado');
  }

  const plan = { ...currentPlanResponse.plan };

  // Actualizar milestones si se proporcionan
  if (request.updates.milestones) {
    request.updates.milestones.forEach((update) => {
      const index = plan.milestones.findIndex((ms) => ms.id === update.id);
      if (index !== -1) {
        plan.milestones[index] = { ...plan.milestones[index], ...update };
      }
    });
  }

  // Actualizar iniciativas si se proporcionan
  if (request.updates.initiatives) {
    request.updates.initiatives.forEach((update) => {
      const index = plan.keyInitiatives.findIndex((init) => init.id === update.id);
      if (index !== -1) {
        plan.keyInitiatives[index] = { ...plan.keyInitiatives[index], ...update };
      }
    });
  }

  // Actualizar estado si se proporciona
  if (request.updates.status) {
    plan.status = request.updates.status;
  }

  // Recalcular progreso
  const okrProgress = plan.okrs.reduce((acc, okr) => {
    const krProgress = okr.keyResults.reduce((sum, kr) => sum + kr.progress, 0) / okr.keyResults.length;
    return acc + krProgress;
  }, 0) / plan.okrs.length;

  const milestoneProgress = plan.milestones.reduce((acc, ms) => {
    const statusProgress = ms.status === 'completed' ? 100 : ms.status === 'in_progress' ? 50 : 0;
    return acc + statusProgress;
  }, 0) / plan.milestones.length;

  const initiativeProgress = plan.keyInitiatives.reduce((acc, init) => acc + init.progress, 0) / plan.keyInitiatives.length;

  plan.progress = {
    overall: Math.round((okrProgress + milestoneProgress + initiativeProgress) / 3),
    okrs: Math.round(okrProgress),
    milestones: Math.round(milestoneProgress),
    initiatives: Math.round(initiativeProgress),
  };

  plan.updatedAt = now.toISOString();

  return {
    plan,
    success: true,
    message: 'Plan trimestral actualizado exitosamente.',
  };
};

// Mock storage para asignaciones de ownership
let ownershipAssignmentsStorage: OwnershipAssignment[] = [];

// User Story 2: Asignar dueño a insight o playbook
export const assignOwner = async (request: AssignOwnerRequest): Promise<AssignOwnerResponse> => {
  const now = new Date();

  // Obtener información del item (insight o playbook)
  // En producción, esto haría una llamada a la API para obtener el item
  const itemName = request.itemType === 'insight' ? `Insight ${request.itemId}` : `Playbook ${request.itemId}`;

  // Obtener información del dueño
  // En producción, esto haría una llamada a la API para obtener el dueño
  const ownerName = `Dueño ${request.ownerId}`;

  // Crear asignación
  const assignment: OwnershipAssignment = {
    id: `assign-${Date.now()}`,
    itemId: request.itemId,
    itemType: request.itemType,
    itemName,
    ownerId: request.ownerId,
    ownerName,
    assignedBy: 'trainer-001', // En producción, usar el ID del entrenador actual
    assignedByName: 'Entrenador',
    assignedAt: now.toISOString(),
    status: 'assigned',
    dueDate: request.dueDate,
    priority: request.priority || 'medium',
    progress: 0,
    notes: request.notes,
    milestones: request.milestones?.map((ms, index) => ({
      id: `milestone-${Date.now()}-${index}`,
      title: ms.title,
      description: ms.description,
      status: 'pending',
      dueDate: ms.dueDate,
    })),
    updates: [],
    blockers: [],
  };

  // Almacenar asignación
  ownershipAssignmentsStorage.push(assignment);

  return {
    assignment,
    success: true,
    message: `Dueño asignado exitosamente a ${request.itemType}.`,
  };
};

// User Story 2: Actualizar progreso de ownership
export const updateOwnershipProgress = async (
  request: UpdateOwnershipProgressRequest
): Promise<UpdateOwnershipProgressResponse> => {
  const now = new Date();

  // Encontrar asignación
  const assignmentIndex = ownershipAssignmentsStorage.findIndex((a) => a.id === request.assignmentId);
  if (assignmentIndex === -1) {
    throw new Error('Asignación no encontrada');
  }

  const assignment = { ...ownershipAssignmentsStorage[assignmentIndex] };

  // Actualizar progreso si se proporciona
  if (request.progress !== undefined) {
    assignment.progress = request.progress;
  }

  // Actualizar estado si se proporciona
  if (request.status) {
    assignment.status = request.status;
  }

  // Agregar update si se proporciona
  if (request.update) {
    assignment.updates = [
      ...(assignment.updates || []),
      {
        id: `update-${Date.now()}`,
        message: request.update.message,
        updatedBy: 'trainer-001', // En producción, usar el ID del usuario actual
        updatedByName: 'Entrenador',
        updatedAt: now.toISOString(),
        progress: request.update.progress,
        status: request.update.status,
      },
    ];
  }

  // Actualizar milestone si se proporciona
  if (request.milestoneId && request.milestoneStatus) {
    const milestoneIndex = assignment.milestones?.findIndex((ms) => ms.id === request.milestoneId);
    if (milestoneIndex !== undefined && milestoneIndex !== -1 && assignment.milestones) {
      assignment.milestones[milestoneIndex] = {
        ...assignment.milestones[milestoneIndex],
        status: request.milestoneStatus,
        completedAt: request.milestoneStatus === 'completed' ? now.toISOString() : undefined,
      };
    }
  }

  // Agregar blocker si se proporciona
  if (request.blocker) {
    assignment.blockers = [
      ...(assignment.blockers || []),
      {
        id: `blocker-${Date.now()}`,
        description: request.blocker.description,
        reportedBy: 'trainer-001', // En producción, usar el ID del usuario actual
        reportedByName: 'Entrenador',
        reportedAt: now.toISOString(),
        resolved: false,
      },
    ];
    assignment.status = 'blocked';
  }

  // Resolver blocker si se proporciona
  if (request.resolveBlockerId) {
    const blockerIndex = assignment.blockers?.findIndex((b) => b.id === request.resolveBlockerId);
    if (blockerIndex !== undefined && blockerIndex !== -1 && assignment.blockers) {
      assignment.blockers[blockerIndex] = {
        ...assignment.blockers[blockerIndex],
        resolved: true,
        resolvedAt: now.toISOString(),
      };

      // Si no hay más blockers, cambiar estado a in_progress
      if (assignment.blockers.every((b) => b.resolved)) {
        assignment.status = 'in_progress';
      }
    }
  }

  // Actualizar almacenamiento
  ownershipAssignmentsStorage[assignmentIndex] = assignment;

  return {
    assignment,
    success: true,
    message: 'Progreso de ownership actualizado exitosamente.',
  };
};

// User Story 2: Obtener asignaciones de ownership
export const getOwnershipAssignments = async (
  request: GetOwnershipAssignmentsRequest
): Promise<GetOwnershipAssignmentsResponse> => {
  let filteredAssignments = [...ownershipAssignmentsStorage];

  // Filtrar por dueño
  if (request.ownerId) {
    filteredAssignments = filteredAssignments.filter((a) => a.ownerId === request.ownerId);
  }

  // Filtrar por tipo de item
  if (request.itemType) {
    filteredAssignments = filteredAssignments.filter((a) => a.itemType === request.itemType);
  }

  // Filtrar por estado
  if (request.status) {
    filteredAssignments = filteredAssignments.filter((a) => a.status === request.status);
  }

  // Filtrar por item ID
  if (request.itemId) {
    filteredAssignments = filteredAssignments.filter((a) => a.itemId === request.itemId);
  }

  // Calcular resumen
  const now = new Date();
  const summary = {
    assigned: filteredAssignments.filter((a) => a.status === 'assigned').length,
    in_progress: filteredAssignments.filter((a) => a.status === 'in_progress').length,
    completed: filteredAssignments.filter((a) => a.status === 'completed').length,
    blocked: filteredAssignments.filter((a) => a.status === 'blocked').length,
    overdue: filteredAssignments.filter((a) => {
      if (!a.dueDate) return false;
      return new Date(a.dueDate) < now && a.status !== 'completed';
    }).length,
  };

  return {
    assignments: filteredAssignments,
    total: filteredAssignments.length,
    summary,
    success: true,
    message: `Se encontraron ${filteredAssignments.length} asignaciones.`,
  };
};

// User Story 1: Aprobar experimentos/playbooks desde móvil con resumen IA
// Mock storage para aprobaciones móviles
let mobileApprovalsStorage: MobileApproval[] = [];

/**
 * User Story 1: Generar resumen IA de un experimento o playbook para aprobación móvil
 */
export const generateAISummary = async (
  request: GenerateAISummaryRequest
): Promise<GenerateAISummaryResponse> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const now = new Date().toISOString();
  
  // Obtener el item (experimento o playbook) - en producción vendría de la API
  let itemName = '';
  let itemObjective = '';
  let itemData: any = null;

  // En producción, se obtendría el item real desde la API
  // Por ahora, simulamos datos
  if (request.itemType === 'experiment') {
    itemName = 'Experimento de Test A/B';
    itemObjective = 'Mejorar tasa de conversión en emails';
    itemData = {
      hypothesis: 'Mensajes más personalizados aumentarán la conversión',
      primaryMetric: 'Tasa de conversión',
      status: 'planned' as const,
    };
  } else if (request.itemType === 'playbook') {
    itemName = 'Playbook de Retención';
    itemObjective = 'Aumentar retención de clientes premium';
    itemData = {
      channels: ['Email', 'SMS'],
      impact: 'Alto' as const,
      status: 'draft' as const,
    };
  }

  // Generar resumen IA (en producción, esto usaría un servicio de IA real)
  const summary: AISummary = {
    summary: `${itemName}: ${itemObjective}. Este ${request.itemType} está diseñado para mejorar métricas clave. La estrategia propuesta es sólida y tiene potencial de alto impacto.`,
    keyPoints: [
      `Objetivo claro: ${itemObjective}`,
      request.itemType === 'experiment' 
        ? 'Hipótesis bien definida con métricas medibles'
        : 'Estrategia multicanal bien estructurada',
      'Alineado con objetivos estratégicos',
      'Recursos necesarios disponibles',
    ],
    risks: [
      'Tiempo de ejecución puede ser mayor al estimado',
      'Necesita validación continua durante la ejecución',
    ],
    opportunities: [
      'Potencial de escalar resultados exitosos',
      'Aprendizaje aplicable a futuras iniciativas',
      'Mejora en métricas clave del negocio',
    ],
    recommendations: [
      'Aprobar y proceder con la ejecución',
      'Establecer puntos de revisión semanales',
      'Monitorear métricas clave desde el inicio',
    ],
    confidence: 85,
    generatedAt: now,
  };

  return {
    summary,
    success: true,
    message: 'Resumen IA generado exitosamente.',
  };
};

/**
 * User Story 1: Obtener aprobaciones pendientes para móvil
 */
export const getPendingApprovals = async (
  request: GetPendingApprovalsRequest = {}
): Promise<GetPendingApprovalsResponse> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Si no hay aprobaciones en storage, crear algunas de ejemplo
  if (mobileApprovalsStorage.length === 0) {
    const now = new Date().toISOString();
    mobileApprovalsStorage = [
      {
        id: 'approval_1',
        itemType: 'experiment',
        itemId: 'exp_1',
        itemName: 'Experimento: Test A/B de Emails',
        itemObjective: 'Mejorar tasa de conversión en emails',
        submittedBy: 'team_member_1',
        submittedByName: 'Juan Pérez',
        submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        priority: 'high',
        experiment: {
          id: 'exp_1',
          name: 'Test A/B de Emails',
          hypothesis: 'Mensajes más personalizados aumentarán la conversión',
          status: 'planned',
          primaryMetric: 'Tasa de conversión',
          uplift: null,
        },
      },
      {
        id: 'approval_2',
        itemType: 'playbook',
        itemId: 'pb_1',
        itemName: 'Playbook: Retención Premium',
        itemObjective: 'Aumentar retención de clientes premium',
        submittedBy: 'team_member_2',
        submittedByName: 'María García',
        submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        priority: 'medium',
        playbook: {
          id: 'pb_1',
          name: 'Retención Premium',
          objective: 'Aumentar retención de clientes premium',
          channels: ['Email', 'SMS'],
          owner: 'team_member_2',
          status: 'draft',
          impact: 'Alto',
        },
      },
    ];
  }

  let filteredApprovals = mobileApprovalsStorage.filter(
    (a) => a.status === 'pending'
  );

  // Filtrar por tipo
  if (request.itemType) {
    filteredApprovals = filteredApprovals.filter(
      (a) => a.itemType === request.itemType
    );
  }

  // Filtrar por prioridad
  if (request.priority) {
    filteredApprovals = filteredApprovals.filter(
      (a) => a.priority === request.priority
    );
  }

  // Limitar resultados
  if (request.limit) {
    filteredApprovals = filteredApprovals.slice(0, request.limit);
  }

  return {
    approvals: filteredApprovals,
    total: filteredApprovals.length,
    success: true,
    message: `Se encontraron ${filteredApprovals.length} aprobaciones pendientes.`,
  };
};

/**
 * User Story 1: Aprobar o rechazar un item desde móvil
 */
export const approveItem = async (
  request: ApproveItemRequest
): Promise<ApproveItemResponse> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 800));

  const now = new Date().toISOString();
  const approvalIndex = mobileApprovalsStorage.findIndex(
    (a) => a.id === request.approvalId
  );

  if (approvalIndex === -1) {
    throw new Error('Aprobación no encontrada');
  }

  const approval = mobileApprovalsStorage[approvalIndex];
  approval.status = request.status;
  approval.reviewedBy = 'current_trainer'; // En producción vendría del contexto de autenticación
  approval.reviewedByName = 'Tú';
  approval.reviewedAt = now;
  approval.notes = request.notes;

  if (request.status === 'rejected') {
    approval.rejectionReason = request.rejectionReason || request.notes || 'Rechazado sin razón específica';
  }

  if (request.status === 'needs-changes') {
    approval.requestedChanges = request.requestedChanges || request.notes || 'Necesita cambios';
  }

  // Actualizar storage
  mobileApprovalsStorage[approvalIndex] = approval;

  return {
    approval,
    success: true,
    message: `Item ${request.status === 'approved' ? 'aprobado' : request.status === 'rejected' ? 'rechazado' : 'marcado para cambios'} exitosamente.`,
  };
};

// User Story 2: Sincronizar playbooks con otras sedes o entrenadores
// Mock storage para sincronizaciones
let playbookSyncsStorage: PlaybookSync[] = [];
let locationsStorage: Location[] = [
  { id: 'loc_1', name: 'Sede Central', city: 'Madrid', country: 'España' },
  { id: 'loc_2', name: 'Sede Norte', city: 'Barcelona', country: 'España' },
  { id: 'loc_3', name: 'Sede Sur', city: 'Valencia', country: 'España' },
];
let trainersStorage: Trainer[] = [
  { id: 'trn_1', name: 'Carlos Rodríguez', email: 'carlos@example.com', locationId: 'loc_1', locationName: 'Sede Central' },
  { id: 'trn_2', name: 'Ana Martínez', email: 'ana@example.com', locationId: 'loc_2', locationName: 'Sede Norte' },
  { id: 'trn_3', name: 'Luis Sánchez', email: 'luis@example.com', locationId: 'loc_3', locationName: 'Sede Sur' },
];

/**
 * User Story 2: Obtener sedes disponibles para sincronización
 */
export const getAvailableLocations = async (
  request: GetAvailableLocationsRequest = {}
): Promise<GetAvailableLocationsResponse> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 300));

  let locations = [...locationsStorage];

  // Excluir sede actual si se proporciona
  if (request.excludeLocationId) {
    locations = locations.filter((l) => l.id !== request.excludeLocationId);
  }

  return {
    locations,
    success: true,
    message: `Se encontraron ${locations.length} sedes disponibles.`,
  };
};

/**
 * User Story 2: Obtener entrenadores disponibles para sincronización
 */
export const getAvailableTrainers = async (
  request: GetAvailableTrainersRequest = {}
): Promise<GetAvailableTrainersResponse> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 300));

  let trainers = [...trainersStorage];

  // Filtrar por sede si se proporciona
  if (request.locationId) {
    trainers = trainers.filter((t) => t.locationId === request.locationId);
  }

  // Excluir entrenador actual si se proporciona
  if (request.excludeTrainerId) {
    trainers = trainers.filter((t) => t.id !== request.excludeTrainerId);
  }

  return {
    trainers,
    success: true,
    message: `Se encontraron ${trainers.length} entrenadores disponibles.`,
  };
};

/**
 * User Story 2: Sincronizar playbook con otras sedes o entrenadores
 */
export const syncPlaybook = async (
  request: SyncPlaybookRequest
): Promise<SyncPlaybookResponse> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const now = new Date().toISOString();
  
  // Obtener playbook (en producción vendría de la API)
  const playbook = {
    id: request.playbookId,
    name: 'Playbook de Retención',
    objective: 'Aumentar retención de clientes',
  };

  // Obtener información del entrenador origen (en producción vendría del contexto de autenticación)
  const sourceTrainer = trainersStorage[0];
  const sourceLocation = locationsStorage.find((l) => l.id === sourceTrainer.locationId);

  // Obtener sedes y entrenadores destino
  const targetLocations: Location[] = [];
  const targetTrainers: Trainer[] = [];

  if (request.targetLocationIds && request.targetLocationIds.length > 0) {
    request.targetLocationIds.forEach((locationId) => {
      const location = locationsStorage.find((l) => l.id === locationId);
      if (location) {
        targetLocations.push(location);
      }
    });
  }

  if (request.targetTrainerIds && request.targetTrainerIds.length > 0) {
    request.targetTrainerIds.forEach((trainerId) => {
      const trainer = trainersStorage.find((t) => t.id === trainerId);
      if (trainer) {
        targetTrainers.push(trainer);
      }
    });
  }

  // Crear registro de sincronización
  const sync: PlaybookSync = {
    id: `sync_${Date.now()}`,
    playbookId: request.playbookId,
    playbookName: playbook.name,
    sourceTrainerId: sourceTrainer.id,
    sourceTrainerName: sourceTrainer.name,
    sourceLocationId: sourceLocation?.id,
    sourceLocationName: sourceLocation?.name,
    targetTrainerId: targetTrainers.length === 1 ? targetTrainers[0].id : undefined,
    targetTrainerName: targetTrainers.length === 1 ? targetTrainers[0].name : undefined,
    targetLocationId: targetLocations.length === 1 ? targetLocations[0].id : undefined,
    targetLocationName: targetLocations.length === 1 ? targetLocations[0].name : undefined,
    syncType: request.syncType,
    status: 'synced',
    syncedAt: now,
    syncedBy: sourceTrainer.id,
    syncedByName: sourceTrainer.name,
    createdAt: now,
    updatedAt: now,
  };

  // Guardar en storage
  playbookSyncsStorage.push(sync);

  return {
    sync,
    syncedTo: {
      locations: targetLocations,
      trainers: targetTrainers,
    },
    success: true,
    message: `Playbook sincronizado exitosamente con ${targetLocations.length} sede(s) y ${targetTrainers.length} entrenador(es).`,
  };
};

/**
 * User Story 2: Obtener estado de sincronizaciones
 */
export const getSyncStatus = async (
  request: GetSyncStatusRequest = {}
): Promise<GetSyncStatusResponse> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 500));

  let filteredSyncs = [...playbookSyncsStorage];

  // Filtrar por playbook
  if (request.playbookId) {
    filteredSyncs = filteredSyncs.filter((s) => s.playbookId === request.playbookId);
  }

  // Filtrar por sede
  if (request.locationId) {
    filteredSyncs = filteredSyncs.filter(
      (s) => s.sourceLocationId === request.locationId || s.targetLocationId === request.locationId
    );
  }

  // Filtrar por entrenador
  if (request.trainerId) {
    filteredSyncs = filteredSyncs.filter(
      (s) => s.sourceTrainerId === request.trainerId || s.targetTrainerId === request.trainerId
    );
  }

  // Filtrar por estado
  if (request.status) {
    filteredSyncs = filteredSyncs.filter((s) => s.status === request.status);
  }

  // Limitar resultados
  if (request.limit) {
    filteredSyncs = filteredSyncs.slice(0, request.limit);
  }

  return {
    syncs: filteredSyncs,
    total: filteredSyncs.length,
    success: true,
    message: `Se encontraron ${filteredSyncs.length} sincronizaciones.`,
  };
};

/**
 * User Story 2: Resolver conflicto de sincronización
 */
export const resolveSyncConflict = async (
  request: ResolveSyncConflictRequest
): Promise<ResolveSyncConflictResponse> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 800));

  const now = new Date().toISOString();
  const syncIndex = playbookSyncsStorage.findIndex((s) => s.id === request.syncId);

  if (syncIndex === -1) {
    throw new Error('Sincronización no encontrada');
  }

  const sync = playbookSyncsStorage[syncIndex];
  sync.status = 'synced';
  sync.conflictResolution = request.resolution;
  sync.updatedAt = now;
  sync.lastSyncAt = now;

  // Actualizar storage
  playbookSyncsStorage[syncIndex] = sync;

  return {
    sync,
    success: true,
    message: `Conflicto resuelto exitosamente usando resolución: ${request.resolution}.`,
  };
};

// User Story 1: Storage para perfil de aprendizaje de playbooks
const STORAGE_KEY_PLAYBOOK_DECISIONS = 'playbook_decisions';
const STORAGE_KEY_PLAYBOOK_LEARNING_PROFILE = 'playbook_learning_profile';

// User Story 2: Storage para evaluaciones de impacto
const STORAGE_KEY_INITIATIVE_EVALUATIONS = 'initiative_impact_evaluations';

/**
 * User Story 1: Registrar decisión de playbook (aceptar/rechazar)
 */
export const recordPlaybookDecision = async (
  request: RecordPlaybookDecisionRequest
): Promise<RecordPlaybookDecisionResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const trainerId = 'current_user'; // En producción, esto vendría del contexto de autenticación
  const now = new Date().toISOString();

  // Obtener información del playbook (en producción vendría de la API)
  const playbookName = `Playbook ${request.playbookId}`;

  const decision: PlaybookDecision = {
    id: `decision_${Date.now()}`,
    playbookId: request.playbookId,
    playbookName,
    action: request.action,
    timestamp: now,
    trainerId,
    reason: request.reason,
    modifiedData: request.modifiedData,
    context: request.context,
  };

  // Guardar decisión
  try {
    const existingDecisions = JSON.parse(
      localStorage.getItem(STORAGE_KEY_PLAYBOOK_DECISIONS) || '[]'
    ) as PlaybookDecision[];
    existingDecisions.push(decision);
    localStorage.setItem(STORAGE_KEY_PLAYBOOK_DECISIONS, JSON.stringify(existingDecisions));

    // Actualizar perfil de aprendizaje
    const updatedProfile = await updatePlaybookLearningProfile(decision);
    
    return {
      decision,
      success: true,
      message: 'Decisión registrada exitosamente.',
      updatedLearningProfile: updatedProfile,
    };
  } catch (error) {
    console.error('Error guardando decisión:', error);
    return {
      decision,
      success: false,
      message: 'Error al guardar la decisión.',
    };
  }
};

async function updatePlaybookLearningProfile(decision: PlaybookDecision): Promise<PlaybookLearningProfile> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_PLAYBOOK_LEARNING_PROFILE);
    let profile: PlaybookLearningProfile;

    if (stored) {
      profile = JSON.parse(stored) as PlaybookLearningProfile;
    } else {
      profile = {
        trainerId: decision.trainerId,
        preferences: {
          preferredImpact: [],
          preferredChannels: [],
          preferredObjectives: [],
          rejectedPatterns: [],
          acceptedPatterns: [],
        },
        decisionHistory: [],
        accuracyScore: 50,
        lastUpdated: new Date().toISOString(),
      };
    }

    // Agregar decisión al historial
    profile.decisionHistory.push(decision);

    // Analizar patrones de aceptación/rechazo
    const recentDecisions = profile.decisionHistory.slice(-50);
    const accepted = recentDecisions.filter((d) => d.action === 'accept');
    const rejected = recentDecisions.filter((d) => d.action === 'reject');

    // Calcular tasa de aceptación
    const totalActions = accepted.length + rejected.length;
    const acceptanceRate = totalActions > 0 ? (accepted.length / totalActions) * 100 : 50;
    profile.accuracyScore = Math.min(100, Math.max(0, acceptanceRate));

    // Extraer patrones de playbooks aceptados/rechazados
    if (decision.action === 'accept' && decision.context) {
      if (decision.context.channels) {
        decision.context.channels.forEach((channel) => {
          if (!profile.preferences.preferredChannels.includes(channel)) {
            profile.preferences.preferredChannels.push(channel);
          }
        });
      }
      if (decision.context.objective) {
        if (!profile.preferences.preferredObjectives.includes(decision.context.objective)) {
          profile.preferences.preferredObjectives.push(decision.context.objective);
        }
      }
    }

    profile.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY_PLAYBOOK_LEARNING_PROFILE, JSON.stringify(profile));

    return profile;
  } catch (error) {
    console.error('Error actualizando perfil de aprendizaje:', error);
    throw error;
  }
}

/**
 * User Story 1: Obtener perfil de aprendizaje de playbooks
 */
export const getPlaybookLearningProfile = async (
  request: GetPlaybookLearningProfileRequest = {}
): Promise<GetPlaybookLearningProfileResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  try {
    const stored = localStorage.getItem(STORAGE_KEY_PLAYBOOK_LEARNING_PROFILE);
    const profile = stored ? (JSON.parse(stored) as PlaybookLearningProfile) : null;

    return {
      profile,
      success: true,
      message: profile ? 'Perfil de aprendizaje encontrado.' : 'No se encontró perfil de aprendizaje.',
    };
  } catch (error) {
    console.error('Error obteniendo perfil de aprendizaje:', error);
    return {
      profile: null,
      success: false,
      message: 'Error al obtener el perfil de aprendizaje.',
    };
  }
};

/**
 * User Story 1: Obtener insights de aprendizaje de playbooks
 */
export const getPlaybookLearningInsights = async (
  request: GetPlaybookLearningInsightsRequest = {}
): Promise<GetPlaybookLearningInsightsResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  try {
    const stored = localStorage.getItem(STORAGE_KEY_PLAYBOOK_DECISIONS);
    const decisions = stored ? (JSON.parse(stored) as PlaybookDecision[]) : [];

    const accepted = decisions.filter((d) => d.action === 'accept');
    const rejected = decisions.filter((d) => d.action === 'reject');
    const total = decisions.length;

    const acceptanceRate = total > 0 ? (accepted.length / total) * 100 : 0;
    const rejectionRate = total > 0 ? (rejected.length / total) * 100 : 0;

    // Analizar patrones aceptados/rechazados
    const acceptedPatterns = new Map<string, number>();
    const rejectedPatterns = new Map<string, number>();

    accepted.forEach((d) => {
      if (d.context?.channels) {
        d.context.channels.forEach((channel) => {
          const count = acceptedPatterns.get(channel) || 0;
          acceptedPatterns.set(channel, count + 1);
        });
      }
    });

    rejected.forEach((d) => {
      if (d.reason) {
        const count = rejectedPatterns.get(d.reason) || 0;
        rejectedPatterns.set(d.reason, count + 1);
      }
    });

    const topAcceptedPatterns = Array.from(acceptedPatterns.entries())
      .map(([pattern, count]) => ({
        pattern,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const topRejectedPatterns = Array.from(rejectedPatterns.entries())
      .map(([pattern, count]) => ({
        pattern,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Razones de rechazo comunes
    const rejectionReasons = new Map<string, number>();
    rejected.forEach((d) => {
      if (d.reason) {
        const count = rejectionReasons.get(d.reason) || 0;
        rejectionReasons.set(d.reason, count + 1);
      }
    });

    const commonRejectionReasons = Array.from(rejectionReasons.entries())
      .map(([reason, count]) => ({
        reason,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const insights: PlaybookLearningInsights = {
      totalDecisions: total,
      acceptanceRate,
      rejectionRate,
      topAcceptedPatterns,
      topRejectedPatterns,
      commonRejectionReasons,
      improvementSuggestions: [
        'Considera aceptar más playbooks con canales que ya has aceptado anteriormente.',
        'Revisa las razones de rechazo más comunes para mejorar las recomendaciones futuras.',
      ],
      accuracyTrend: [
        { period: 'Últimos 7 días', score: acceptanceRate },
        { period: 'Últimos 30 días', score: acceptanceRate * 0.95 },
      ],
    };

    return {
      insights,
      success: true,
      message: 'Insights de aprendizaje obtenidos exitosamente.',
    };
  } catch (error) {
    console.error('Error obteniendo insights de aprendizaje:', error);
    return {
      insights: {
        totalDecisions: 0,
        acceptanceRate: 0,
        rejectionRate: 0,
        topAcceptedPatterns: [],
        topRejectedPatterns: [],
        commonRejectionReasons: [],
        improvementSuggestions: [],
        accuracyTrend: [],
      },
      success: false,
      message: 'Error al obtener los insights de aprendizaje.',
    };
  }
};

/**
 * User Story 2: Evaluar impacto de una iniciativa y recomendar si repetirla
 */
export const evaluateInitiativeImpact = async (
  request: EvaluateInitiativeImpactRequest
): Promise<EvaluateInitiativeImpactResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const now = new Date().toISOString();

  // Simular métricas de impacto (en producción vendrían de la API)
  const metrics: InitiativeImpactMetrics = {
    initiativeId: request.initiativeId,
    initiativeName: `Iniciativa ${request.initiativeId}`,
    initiativeType: request.initiativeType,
    reach: Math.floor(Math.random() * 10000) + 1000,
    engagement: Math.floor(Math.random() * 50) + 10,
    conversionRate: Math.random() * 20 + 5,
    revenue: Math.floor(Math.random() * 50000) + 5000,
    roi: Math.random() * 300 + 50,
    cost: Math.floor(Math.random() * 5000) + 500,
    retentionLift: Math.random() * 15 + 2,
    participantsRetained: Math.floor(Math.random() * 200) + 50,
    duration: Math.floor(Math.random() * 30) + 7,
    executionTime: Math.floor(Math.random() * 40) + 10,
    overallEffectiveness: Math.random() * 40 + 60,
    efficiencyScore: Math.random() * 30 + 70,
    impactScore: Math.random() * 35 + 65,
  };

  // Determinar recomendación basada en métricas
  let recommendation: InitiativeRepeatRecommendation;
  let recommendationReason: string;
  let confidence: number;
  let performanceCategory: 'excellent' | 'good' | 'average' | 'poor';

  if (metrics.overallEffectiveness >= 80 && metrics.roi >= 200) {
    recommendation = 'scale';
    recommendationReason = 'Esta iniciativa ha demostrado excelente rendimiento con alta efectividad y ROI. Se recomienda escalarla para maximizar su impacto.';
    confidence = 90;
    performanceCategory = 'excellent';
  } else if (metrics.overallEffectiveness >= 70 && metrics.roi >= 150) {
    recommendation = 'repeat';
    recommendationReason = 'La iniciativa ha mostrado buenos resultados. Se recomienda repetirla para mantener el impacto positivo.';
    confidence = 80;
    performanceCategory = 'good';
  } else if (metrics.overallEffectiveness >= 60 && metrics.roi >= 100) {
    recommendation = 'repeat-with-modifications';
    recommendationReason = 'La iniciativa tiene potencial pero puede mejorarse. Se recomienda repetirla con algunas modificaciones para optimizar resultados.';
    confidence = 70;
    performanceCategory = 'average';
  } else if (metrics.overallEffectiveness >= 50) {
    recommendation = 'test-more';
    recommendationReason = 'Los resultados son mixtos. Se recomienda realizar más pruebas antes de decidir si repetir o discontinuar.';
    confidence = 60;
    performanceCategory = 'average';
  } else {
    recommendation = 'discontinue';
    recommendationReason = 'La iniciativa no ha alcanzado los resultados esperados. Se recomienda discontinuarla y enfocar recursos en otras iniciativas más prometedoras.';
    confidence = 75;
    performanceCategory = 'poor';
  }

  const evaluation: InitiativeImpactEvaluation = {
    id: `eval_${Date.now()}`,
    initiativeId: request.initiativeId,
    initiativeName: metrics.initiativeName,
    initiativeType: request.initiativeType,
    metrics,
    evaluation: {
      summary: `La iniciativa "${metrics.initiativeName}" ha alcanzado una efectividad del ${metrics.overallEffectiveness.toFixed(1)}% con un ROI del ${metrics.roi.toFixed(1)}%.`,
      strengths: [
        `Alto engagement: ${metrics.engagement}%`,
        `ROI positivo: ${metrics.roi.toFixed(1)}%`,
        `Alcance significativo: ${metrics.reach} personas`,
      ],
      weaknesses: metrics.overallEffectiveness < 70 ? [
        'Efectividad por debajo del objetivo',
        'Oportunidad de mejora en conversión',
      ] : [],
      keyFindings: [
        `La iniciativa generó ${metrics.revenue.toLocaleString()} en ingresos`,
        `Tasa de conversión del ${metrics.conversionRate.toFixed(1)}%`,
        `Incremento en retención del ${metrics.retentionLift?.toFixed(1)}%`,
      ],
      performanceCategory,
    },
    recommendation,
    recommendationReason,
    confidence,
    suggestedModifications: recommendation === 'repeat-with-modifications' ? [
      {
        what: 'Optimizar timing de envío',
        why: 'Mejorar el timing puede aumentar el engagement',
        expectedImpact: 'Incremento esperado del 10-15% en engagement',
        priority: 'high',
      },
      {
        what: 'Ajustar segmentación de audiencia',
        why: 'Enfocar en segmentos más receptivos puede mejorar conversión',
        expectedImpact: 'Incremento esperado del 5-10% en conversión',
        priority: 'medium',
      },
    ] : undefined,
    comparison: {
      similarInitiatives: [
        { initiativeId: 'init-001', initiativeName: 'Iniciativa Similar 1', performance: 75 },
        { initiativeId: 'init-002', initiativeName: 'Iniciativa Similar 2', performance: 68 },
      ],
      percentile: Math.floor(metrics.overallEffectiveness),
      benchmark: metrics.overallEffectiveness >= 70 ? 'above' : metrics.overallEffectiveness >= 60 ? 'at' : 'below',
    },
    nextSteps: [
      recommendation === 'scale' ? 'Planificar escalamiento de la iniciativa' : 
      recommendation === 'repeat' ? 'Programar repetición de la iniciativa' :
      recommendation === 'repeat-with-modifications' ? 'Implementar modificaciones sugeridas y repetir' :
      recommendation === 'test-more' ? 'Diseñar nuevas variantes para probar' :
      'Evaluar alternativas y reasignar recursos',
    ],
    evaluatedAt: now,
    evaluatedBy: 'ai',
    period: request.period || 'all',
  };

  // Guardar evaluación
  try {
    const existingEvaluations = JSON.parse(
      localStorage.getItem(STORAGE_KEY_INITIATIVE_EVALUATIONS) || '[]'
    ) as InitiativeImpactEvaluation[];
    existingEvaluations.push(evaluation);
    localStorage.setItem(STORAGE_KEY_INITIATIVE_EVALUATIONS, JSON.stringify(existingEvaluations));
  } catch (error) {
    console.error('Error guardando evaluación:', error);
  }

  return {
    evaluation,
    success: true,
    message: 'Evaluación de impacto completada exitosamente.',
  };
};

/**
 * User Story 2: Obtener evaluaciones de impacto de iniciativas
 */
export const getInitiativeImpactEvaluations = async (
  request: GetInitiativeImpactEvaluationsRequest = {}
): Promise<GetInitiativeImpactEvaluationsResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 400));

  try {
    const stored = localStorage.getItem(STORAGE_KEY_INITIATIVE_EVALUATIONS);
    let evaluations = stored ? (JSON.parse(stored) as InitiativeImpactEvaluation[]) : [];

    // Filtrar por tipo de iniciativa
    if (request.initiativeType) {
      evaluations = evaluations.filter((e) => e.initiativeType === request.initiativeType);
    }

    // Filtrar por recomendación
    if (request.recommendation) {
      evaluations = evaluations.filter((e) => e.recommendation === request.recommendation);
    }

    // Limitar resultados
    if (request.limit) {
      evaluations = evaluations.slice(0, request.limit);
    }

    // Calcular resumen
    const totalEvaluated = evaluations.length;
    const recommendedToRepeat = evaluations.filter((e) => e.recommendation === 'repeat').length;
    const recommendedToScale = evaluations.filter((e) => e.recommendation === 'scale').length;
    const recommendedToDiscontinue = evaluations.filter((e) => e.recommendation === 'discontinue').length;
    const averageEffectiveness = evaluations.length > 0
      ? evaluations.reduce((sum, e) => sum + e.metrics.overallEffectiveness, 0) / evaluations.length
      : 0;

    const topPerformers = evaluations
      .sort((a, b) => b.metrics.overallEffectiveness - a.metrics.overallEffectiveness)
      .slice(0, 5)
      .map((e) => e.initiativeId);

    return {
      evaluations,
      total: totalEvaluated,
      summary: {
        totalEvaluated,
        recommendedToRepeat,
        recommendedToScale,
        recommendedToDiscontinue,
        averageEffectiveness,
        topPerformers,
      },
      success: true,
      message: `Se encontraron ${totalEvaluated} evaluaciones.`,
    };
  } catch (error) {
    console.error('Error obteniendo evaluaciones:', error);
    return {
      evaluations: [],
      total: 0,
      summary: {
        totalEvaluated: 0,
        recommendedToRepeat: 0,
        recommendedToScale: 0,
        recommendedToDiscontinue: 0,
        averageEffectiveness: 0,
        topPerformers: [],
      },
      success: false,
      message: 'Error al obtener las evaluaciones.',
    };
  }
};

// User Story 1: Retrospectivas IA mensuales que celebran logros y marcan próximos focos
const STORAGE_KEY_MONTHLY_RETROSPECTIVES = 'monthly_retrospectives';

/**
 * Obtener retrospectiva mensual
 */
export const getMonthlyRetrospective = async (
  request: GetMonthlyRetrospectiveRequest = {}
): Promise<GetMonthlyRetrospectiveResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 400));

  try {
    const now = new Date();
    const month = request.month ?? now.getMonth() + 1;
    const year = request.year ?? now.getFullYear();

    const stored = localStorage.getItem(STORAGE_KEY_MONTHLY_RETROSPECTIVES);
    const retrospectives = stored ? (JSON.parse(stored) as MonthlyRetrospective[]) : [];

    const retrospective = retrospectives.find(
      (r) => r.year === year && r.month === `${getMonthName(month)} ${year}`
    );

    if (retrospective) {
      return {
        retrospective,
        success: true,
      };
    }

    // Si no existe y se solicita generar, generar una nueva
    if (request.generateIfNotExists) {
      const generateRequest: GenerateMonthlyRetrospectiveRequest = {
        month,
        year,
        trainerId: request.trainerId,
        includeAchievements: true,
        includeNextFoci: true,
      };
      const generated = await generateMonthlyRetrospective(generateRequest);
      return {
        retrospective: generated.retrospective,
        success: true,
        message: 'Retrospectiva generada exitosamente.',
      };
    }

    return {
      retrospective: null,
      success: true,
      message: 'No se encontró retrospectiva para el período solicitado.',
    };
  } catch (error) {
    console.error('Error obteniendo retrospectiva mensual:', error);
    return {
      retrospective: null,
      success: false,
      message: 'Error al obtener la retrospectiva mensual.',
    };
  }
};

/**
 * Generar retrospectiva mensual
 */
export const generateMonthlyRetrospective = async (
  request: GenerateMonthlyRetrospectiveRequest
): Promise<GenerateMonthlyRetrospectiveResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const now = new Date();
  const monthName = getMonthName(request.month);
  const startDate = request.customPeriod?.startDate || 
    new Date(request.year, request.month - 1, 1).toISOString();
  const endDate = request.customPeriod?.endDate || 
    new Date(request.year, request.month, 0, 23, 59, 59).toISOString();

  // Generar logros de ejemplo (en producción, esto vendría de datos reales)
  const achievements: MonthlyAchievement[] = [
    {
      id: 'ach-001',
      category: 'marketing',
      title: 'Crecimiento en leads generados',
      description: 'Incremento significativo en la generación de leads a través de campañas optimizadas',
      metric: {
        name: 'Leads generados',
        value: 245,
        change: 32,
        unit: 'leads',
      },
      impact: 'high',
      celebrationMessage: '¡Excelente trabajo! Has logrado un crecimiento del 32% en leads, lo que demuestra la efectividad de tus estrategias de marketing.',
      relatedItems: [
        { type: 'campaign', id: 'camp-001', name: 'Campaña de Verano 2025' },
      ],
    },
    {
      id: 'ach-002',
      category: 'ventas',
      title: 'Mejora en tasa de conversión',
      description: 'Aumento en la conversión de leads a clientes',
      metric: {
        name: 'Tasa de conversión',
        value: 18.5,
        change: 5.2,
        unit: '%',
      },
      impact: 'high',
      celebrationMessage: '¡Increíble! Tu tasa de conversión ha mejorado un 5.2%, mostrando que estás conectando mejor con tu audiencia.',
    },
    {
      id: 'ach-003',
      category: 'comunidad',
      title: 'Aumento en engagement',
      description: 'Mayor participación y engagement en la comunidad',
      metric: {
        name: 'Engagement rate',
        value: 12.8,
        change: 8.3,
        unit: '%',
      },
      impact: 'medium',
      celebrationMessage: '¡Bien hecho! Tu comunidad está más activa que nunca, con un aumento del 8.3% en engagement.',
    },
  ];

  // Generar próximos focos
  const nextFoci: NextFocus[] = [
    {
      id: 'focus-001',
      title: 'Optimizar campañas de retargeting',
      description: 'Mejorar las campañas de retargeting para aumentar la conversión de leads calientes',
      category: 'marketing',
      priority: 'high',
      rationale: 'Tienes un buen volumen de leads, pero hay oportunidad de mejorar la conversión con mejor retargeting.',
      suggestedActions: [
        'Segmentar leads por comportamiento',
        'Crear secuencias de email personalizadas',
        'Ajustar timing de seguimiento',
      ],
      expectedImpact: {
        metric: 'Tasa de conversión',
        expectedImprovement: 15,
        timeframe: '30 días',
      },
      canCreatePlaybook: true,
      canCreateExperiment: true,
    },
    {
      id: 'focus-002',
      title: 'Ampliar programa de referidos',
      description: 'Escalar el programa de referidos que ha mostrado buenos resultados',
      category: 'ventas',
      priority: 'high',
      rationale: 'Los referidos tienen alta tasa de conversión y bajo costo de adquisición.',
      suggestedActions: [
        'Crear incentivos más atractivos',
        'Automatizar proceso de referidos',
        'Lanzar campaña de activación',
      ],
      expectedImpact: {
        metric: 'Leads de referidos',
        expectedImprovement: 40,
        timeframe: '60 días',
      },
      canCreatePlaybook: true,
    },
    {
      id: 'focus-003',
      title: 'Mejorar retención de clientes',
      description: 'Implementar estrategias para reducir churn y aumentar retención',
      category: 'retencion',
      priority: 'medium',
      rationale: 'La retención es clave para el crecimiento sostenible del negocio.',
      suggestedActions: [
        'Crear programa de onboarding mejorado',
        'Implementar check-ins regulares',
        'Desarrollar contenido educativo',
      ],
      expectedImpact: {
        metric: 'Tasa de retención',
        expectedImprovement: 10,
        timeframe: '90 días',
      },
      canCreatePlaybook: true,
    },
  ];

  const performanceScore = Math.floor(Math.random() * 30) + 70; // 70-100
  const overallPerformance: 'excellent' | 'good' | 'average' | 'needs-improvement' = 
    performanceScore >= 90 ? 'excellent' :
    performanceScore >= 80 ? 'good' :
    performanceScore >= 70 ? 'average' : 'needs-improvement';

  const retrospective: MonthlyRetrospective = {
    id: `retro-${request.year}-${request.month}`,
    month: `${monthName} ${request.year}`,
    year: request.year,
    period: {
      startDate,
      endDate,
    },
    generatedAt: now.toISOString(),
    achievements: request.includeAchievements !== false ? achievements : [],
    nextFoci: request.includeNextFoci !== false ? nextFoci : [],
    summary: {
      overallPerformance,
      performanceScore,
      keyHighlights: [
        'Crecimiento sostenido en generación de leads',
        'Mejora en métricas de conversión',
        'Aumento en engagement de la comunidad',
      ],
      motivationalMessage: `¡Felicitaciones por un ${monthName} exitoso! Has logrado avances significativos en múltiples áreas. Sigue así y mantén el enfoque en los próximos objetivos.`,
    },
    metrics: {
      totalAchievements: achievements.length,
      highImpactAchievements: achievements.filter((a) => a.impact === 'high').length,
      totalFoci: nextFoci.length,
      highPriorityFoci: nextFoci.filter((f) => f.priority === 'high').length,
    },
    insights: [
      'Las campañas de verano han sido especialmente efectivas',
      'El contenido educativo genera mayor engagement',
      'Los referidos tienen el mejor ROI',
    ],
    recommendations: [
      'Continuar con las estrategias que han funcionado bien',
      'Priorizar los focos de alto impacto',
      'Mantener consistencia en la comunicación',
    ],
    trainerId: request.trainerId,
  };

  // Guardar retrospectiva
  try {
    const stored = localStorage.getItem(STORAGE_KEY_MONTHLY_RETROSPECTIVES);
    const retrospectives = stored ? (JSON.parse(stored) as MonthlyRetrospective[]) : [];
    
    // Eliminar retrospectiva existente si hay una para este mes/año
    const filtered = retrospectives.filter(
      (r) => !(r.year === request.year && r.month === `${monthName} ${request.year}`)
    );
    
    filtered.push(retrospective);
    localStorage.setItem(STORAGE_KEY_MONTHLY_RETROSPECTIVES, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error guardando retrospectiva:', error);
  }

  return {
    retrospective,
    success: true,
    message: 'Retrospectiva generada exitosamente.',
  };
};

/**
 * Obtener historial de retrospectivas mensuales
 */
export const getMonthlyRetrospectivesHistory = async (
  request: GetMonthlyRetrospectivesHistoryRequest = {}
): Promise<GetMonthlyRetrospectivesHistoryResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 400));

  try {
    const stored = localStorage.getItem(STORAGE_KEY_MONTHLY_RETROSPECTIVES);
    let retrospectives = stored ? (JSON.parse(stored) as MonthlyRetrospective[]) : [];

    // Filtrar por trainerId si se proporciona
    if (request.trainerId) {
      retrospectives = retrospectives.filter((r) => r.trainerId === request.trainerId);
    }

    // Filtrar por fechas si se proporcionan
    if (request.startDate) {
      retrospectives = retrospectives.filter(
        (r) => new Date(r.period.startDate) >= new Date(request.startDate!)
      );
    }
    if (request.endDate) {
      retrospectives = retrospectives.filter(
        (r) => new Date(r.period.endDate) <= new Date(request.endDate!)
      );
    }

    // Ordenar por fecha descendente (más reciente primero)
    retrospectives.sort(
      (a, b) => new Date(b.period.endDate).getTime() - new Date(a.period.endDate).getTime()
    );

    // Limitar resultados
    if (request.limit) {
      retrospectives = retrospectives.slice(0, request.limit);
    }

    return {
      retrospectives,
      total: retrospectives.length,
      success: true,
    };
  } catch (error) {
    console.error('Error obteniendo historial de retrospectivas:', error);
    return {
      retrospectives: [],
      total: 0,
      success: false,
      message: 'Error al obtener el historial de retrospectivas.',
    };
  }
};

// Función auxiliar para obtener nombre del mes
function getMonthName(month: number): string {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return months[month - 1] || 'Enero';
}

export default fetchIntelligenceOverview;

