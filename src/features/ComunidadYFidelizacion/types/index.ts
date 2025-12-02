export type Sentiment = 'positive' | 'neutral' | 'negative';

export interface CommunitySummary {
  cNps: number;
  advocates: number;
  testimonialsCollected: number;
  retentionLift: number;
}

export interface CommunityPulseMetric {
  id: string;
  label: string;
  value: string;
  delta: number;
  trend: 'up' | 'down' | 'steady';
  description: string;
}

export type TestimonialType = 'texto' | 'video' | 'audio';
export type TestimonialSource = 'formulario' | 'whatsapp' | 'email' | 'manual' | 'google-reviews' | 'redes-sociales';
export type TestimonialStatus = 'pendiente' | 'aprobado' | 'rechazado' | 'publicado';

export interface Testimonial {
  id: string;
  customerName: string;
  customerId?: string;
  role: string;
  quote: string;
  score: number;
  channel: string;
  impactTag: string;
  createdAt: string;
  type: TestimonialType;
  source: TestimonialSource;
  status: TestimonialStatus;
  tags: string[];
  mediaUrl?: string; // Para video y audio
  updatedAt?: string;
}

export interface FeedbackInsight {
  id: string;
  topic: string;
  sentiment: Sentiment;
  responseRate: number;
  change: number;
  keyFinding: string;
  followUpAction: string;
  lastRun: string;
}

export interface FeedbackAutomation {
  id: string;
  name: string;
  trigger: string;
  audience: string;
  status: 'active' | 'paused' | 'draft';
  lastRun: string;
  nextAction: string;
}

export interface TeamMemberOwner {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatarUrl?: string;
}

export interface EngagementProgram {
  id: string;
  title: string;
  description: string;
  owner: string | TeamMemberOwner; // Mantener compatibilidad con string, pero preferir TeamMemberOwner
  kpi: string;
  progress: number;
  trend: 'positive' | 'negative' | 'flat';
  // US-CF-19: Asignación de owners a programas de fidelización
  assignedOwner?: TeamMemberOwner;
  assignedAt?: string;
  assignedBy?: string; // ID del entrenador que asignó
}

export interface AdvocacyMoment {
  id: string;
  title: string;
  type: 'evento' | 'campaña' | 'seguimiento';
  owner: string;
  dueDate: string;
  status: 'en curso' | 'planificado' | 'completado';
  impact: string;
}

export interface CommunityFidelizacionSnapshot {
  period: '30d' | '90d' | '12m';
  summary: CommunitySummary;
  pulseMetrics: CommunityPulseMetric[];
  testimonials: Testimonial[];
  insights: FeedbackInsight[];
  automations: FeedbackAutomation[];
  programs: EngagementProgram[];
  advocacyMoments: AdvocacyMoment[];
  idealTestimonialMoments: IdealTestimonialMoment[];
  postSessionSurveys: PostSessionSurvey[];
  postSessionSurveyConfig?: PostSessionSurveyConfig;
  surveyTemplates?: SurveyTemplate[];
  negativeFeedbackAlerts?: NegativeFeedbackAlert[];
  promoterClients?: PromoterClient[];
  referralProgram?: ReferralProgram;
  referrals?: Referral[];
  referralStats?: ReferralStats;
  socialPlatformConnections?: SocialPlatformConnection[];
  reviewRequests?: ReviewRequest[];
  monthlyReports?: MonthlyReport[];
  monthlyReportConfig?: MonthlyReportConfig;
  // US-CF-01: Configuración de Voz de Comunidad
  communityVoiceConfig?: CommunityVoiceConfig;
  // US-CF-02: Segmentación de Clientes
  customerSegments?: CustomerSegment[];
  segmentSummary?: SegmentSummary[];
  // US-CF-03: Momentos Wow
  wowMoments?: WowMoment[];
  // US-CF-04: Guiones IA para testimonios
  testimonialScripts?: TestimonialScript[];
  // US-CF-05: Publicación automática de mejores reseñas
  bestReviewConfig?: BestReviewConfig;
  autoPublishedReviews?: AutoPublishedReview[];
  // US-CF-06: Momentos ideales según progreso real
  progressBasedMoments?: ProgressBasedMoment[];
  // US-CF-07: Programas de Referidos IA con adaptación por segmentos
  aiReferralProgram?: AIReferralProgram;
  // US-CF-08: Misiones personalizadas para promotores
  promoterBrandings?: PromoterBranding[];
  promoterMissions?: PromoterMission[];
  // US-CF-09: Reportes IA de Impacto de Referidos
  referralROIReport?: ReferralROIReport;
  // US-CF-10: Encuestas IA Adaptadas por Experiencia
  aiAdaptedSurveys?: AIAdaptedSurvey[];
  aiAdaptedSurveyTemplates?: AIAdaptedSurveyTemplate[];
  aiAdaptedSurveyStats?: AIAdaptedSurveyStats[];
  // User Story: Historias de éxito para contenido y funnels
  successStories?: SuccessStory[];
  successStoryTemplates?: SuccessStoryTemplate[];
  // User Story: AI Playbook - Retos y eventos basados en estilo y calendario
  aiPlaybook?: AIPlaybook;
  aiPlaybookSuggestions?: AIPlaybookSuggestion[];
  // User Story: Mensajes automatizados de cumplimiento
  automatedComplianceMessages?: AutomatedComplianceMessage[];
  complianceMessageConfig?: ComplianceMessageConfig;
  // US-CF-16: Journey completo del cliente
  clientJourneys?: ClientJourney[];
  // User Story: Correlación de actividades de comunidad con retención e ingresos
  activityCorrelationReport?: CommunityActivityCorrelationReport;
  // User Story: Radar IA de salud comunitaria
  communityHealthRadar?: CommunityHealthRadar;
  // US-CF-20: Plantillas IA con guidelines para community managers
  communityManagerTemplates?: CommunityManagerAITemplate[];
  communityManagerGuidelines?: CommunityManagerGuidelines;
  // US-CF-21: Aprobación de testimonios y mensajes antes de publicar
  approvalConfig?: ApprovalConfig;
  pendingApprovals?: ApprovalRequest[];
  // US-CF-22: IA que aprende qué iniciativas generan mayor retención y referidos
  initiativePrioritization?: InitiativePrioritization;
  // User Story: Gamificación de la comunidad con IA (badges, retos, reconocimientos) adaptados a valores del entrenador
  communityGamificationConfig?: CommunityGamificationConfig;
  communityBadges?: CommunityBadge[];
  clientBadges?: ClientBadge[];
  communityChallenges?: CommunityChallenge[];
  recognitions?: Recognition[];
  // User Story: Recomendaciones de contenido/comunicaciones basadas en feedback reciente
  contentRecommendationsConfig?: ContentRecommendationsConfig;
  feedbackAnalysis?: FeedbackAnalysis;
  contentRecommendations?: ContentRecommendation[];
  communicationRecommendations?: CommunicationRecommendation[];
}

// US-CF-16: Tipos para journey completo del cliente
export type JourneyStage = 'first-contact' | 'onboarding' | 'active' | 'community' | 'loyalty' | 'at-risk' | 'churned';
export type JourneyEventType = 'contact' | 'purchase' | 'session' | 'feedback' | 'referral' | 'testimonial' | 'milestone' | 'interaction';
export type JourneyStrengthLevel = 'strong' | 'moderate' | 'weak';
export type JourneyRecommendationType = 'upsell' | 'reconnection' | 'recognition' | 'retention' | 'engagement' | 'referral';

export interface JourneyEvent {
  id: string;
  type: JourneyEventType;
  title: string;
  description: string;
  date: string;
  channel?: 'whatsapp' | 'email' | 'in-person' | 'phone' | 'social' | 'app';
  metadata?: Record<string, any>; // Datos adicionales del evento
  sentiment?: 'positive' | 'neutral' | 'negative';
  impact?: number; // 0-100, impacto en el journey
}

export interface JourneyStageData {
  stage: JourneyStage;
  enteredAt: string;
  exitedAt?: string;
  duration?: number; // Días en esta etapa
  events: JourneyEvent[];
  metrics?: {
    satisfaction?: number;
    engagement?: number;
    attendance?: number;
    spending?: number;
  };
  strengths: string[]; // Puntos fuertes en esta etapa
  weaknesses: string[]; // Puntos débiles en esta etapa
}

export interface ClientJourney {
  id: string;
  clientId: string;
  clientName: string;
  currentStage: JourneyStage;
  stages: JourneyStageData[];
  totalDuration: number; // Días totales como cliente
  firstContactDate: string;
  lastInteractionDate?: string;
  // Análisis del journey
  analysis: {
    overallHealth: number; // 0-100, salud general del journey
    strengths: JourneyStrength[];
    weaknesses: JourneyStrength[];
    criticalMoments: JourneyEvent[]; // Momentos críticos (positivos o negativos)
    dropOffPoints?: JourneyStage[]; // Etapas donde hubo riesgo de abandono
  };
  // Recomendaciones IA
  aiRecommendations: JourneyRecommendation[];
  // Métricas agregadas
  metrics: {
    totalSessions?: number;
    totalSpent?: number;
    averageSatisfaction?: number;
    referralsGiven?: number;
    testimonialsGiven?: number;
    lastPurchaseDate?: string;
    daysSinceLastSession?: number;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface JourneyStrength {
  stage: JourneyStage;
  strength: JourneyStrengthLevel;
  description: string;
  evidence: string[]; // Evidencia que respalda la evaluación
  impact: 'high' | 'medium' | 'low'; // Impacto en el journey
}

export interface JourneyRecommendation {
  id: string;
  type: JourneyRecommendationType;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  reasoning: string; // Por qué se recomienda esta acción
  expectedImpact: string; // Impacto esperado
  suggestedTimeline: string; // Timeline sugerido
  actionableSteps: string[]; // Pasos concretos
  relatedStage?: JourneyStage; // Etapa relacionada
  relatedEventId?: string; // Evento relacionado
  confidence: number; // 0-100, confianza en la recomendación
}

// Tipos para solicitudes de testimonio
export type TestimonialRequestStatus = 'pendiente' | 'recibido' | 'publicado' | 'rechazado';
export type TestimonialChannel = 'whatsapp' | 'email';
export type TestimonialTemplateMoment = 'objetivo-alcanzado' | 'programa-completado' | 'despues-sesiones' | 'personalizado';

export interface TestimonialTemplate {
  id: string;
  name: string;
  moment: TestimonialTemplateMoment;
  message: string;
  description: string;
  variables?: string[]; // Variables que se pueden personalizar como {nombre}, {objetivo}, etc.
}

export interface TestimonialRequest {
  id: string;
  clientId: string;
  clientName: string;
  templateId?: string;
  message: string;
  channel: TestimonialChannel;
  status: TestimonialRequestStatus;
  sentAt?: string;
  receivedAt?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Tipos para momentos ideales de testimonios (US-23)
export type IdealMomentType = 'objetivo-alcanzado' | 'programa-completado' | 'feedback-positivo' | 'sesiones-completadas';

export interface IdealTestimonialMoment {
  id: string;
  clientId: string;
  clientName: string;
  momentType: IdealMomentType;
  description: string;
  detectedAt: string;
  sessionId?: string;
  objectiveId?: string;
  programId?: string;
  sessionCount?: number;
  feedbackScore?: number;
  status: 'pending' | 'notified' | 'sent' | 'dismissed';
  notificationSentAt?: string;
  reminderSentAt?: string;
}

// Tipos para encuestas post-sesión (US-24)
export interface PostSessionSurvey {
  id: string;
  sessionId: string;
  clientId: string;
  clientName: string;
  sessionDate: string;
  surveySentAt?: string;
  surveyChannel: 'whatsapp' | 'email';
  responseReceivedAt?: string;
  satisfactionScore?: number; // 1-5 estrellas
  comment?: string;
  status: 'pending' | 'sent' | 'responded' | 'expired';
  hasNegativeFeedback: boolean;
}

export interface PostSessionSurveyConfig {
  id: string;
  enabled: boolean;
  delayHours: number; // 2-4 horas
  channel: 'whatsapp' | 'email' | 'both';
  question: string;
  allowComment: boolean;
  autoAlertOnNegative: boolean; // Alerta si feedback negativo
  negativeThreshold: number; // Puntuación <= X se considera negativo
}

// Tipos para plantillas de encuestas (US-10)
export type SurveyTemplateType = 'post-session' | 'monthly-progress' | 'program-satisfaction' | 'quarterly-nps';

export interface SurveyTemplate {
  id: string;
  name: string;
  type: SurveyTemplateType;
  description: string;
  defaultQuestions: string[];
  estimatedTime: number; // minutos
}

// Tipos para alertas de feedback negativo (US-11)
export interface NegativeFeedbackAlert {
  id: string;
  clientId: string;
  clientName: string;
  sessionId: string;
  sessionDate: string;
  detectedAt: string;
  rating?: number; // 1-5 estrellas
  comment?: string;
  priority: 'urgent' | 'high' | 'medium';
  status: 'pending' | 'in-progress' | 'resolved';
  notificationChannels?: ('in-app' | 'email' | 'whatsapp')[];
  clientHistory?: ClientHistory;
  recentSessions?: Session[];
  actionSuggestions?: ActionSuggestion[];
  // User Story: Respuesta personalizada sugerida
  personalizedResponse?: PersonalizedResponse;
}

export interface ClientHistory {
  totalSessions: number;
  averageSatisfaction?: number;
  daysAsClient: number;
  lastSessionDate: string;
}

export interface Session {
  id: string;
  date: string;
  notes?: string;
  satisfactionScore?: number;
}

export interface ActionSuggestion {
  title: string;
  description: string;
}

// User Story: Detección de feedback negativo con respuesta personalizada
export interface PersonalizedResponse {
  id: string;
  suggestedMessage: string; // Mensaje personalizado sugerido para responder al cliente
  tone: 'empatico' | 'profesional' | 'cercano' | 'motivacional';
  channel: 'whatsapp' | 'email' | 'phone' | 'in-person';
  reasoning: string; // Razón por la que se sugiere esta respuesta
  keyPoints: string[]; // Puntos clave a mencionar
  suggestedFollowUp?: string; // Acción de seguimiento sugerida
  generatedAt: string;
  confidenceScore?: number; // 0-100, confianza en la sugerencia
}

// Tipos para clientes promotores (US-14)
export type PromoterSuggestionType = 'referido' | 'testimonio' | 'ambos';
export type PromoterSuggestionTiming = 'ahora' | 'esta-semana' | 'este-mes' | 'mas-adelante';

export interface PromoterClient {
  id: string;
  clientId: string;
  clientName: string;
  email?: string;
  phone?: string;
  promoterScore: number; // 0-100
  satisfactionScore: number; // Promedio de satisfacción
  attendanceRate: number; // Porcentaje de asistencia
  objectivesCompleted: number;
  totalObjectives: number;
  positiveFeedbackCount: number;
  lastPositiveFeedback?: string;
  daysAsClient: number;
  lastSessionDate?: string;
  suggestionType: PromoterSuggestionType;
  suggestionTiming: PromoterSuggestionTiming;
  suggestionReason: string;
  lastContactedForReferral?: string;
  lastContactedForTestimonial?: string;
  tags: string[];
}

// Tipos para programa de referidos (US-15)
export type RewardType = 'descuento' | 'sesion-gratis' | 'bono' | 'producto' | 'personalizado';
export type ReferralStatus = 'pendiente' | 'en-proceso' | 'convertido' | 'recompensado' | 'expirado';

export interface ReferralReward {
  id: string;
  type: RewardType;
  name: string;
  description: string;
  value: number; // Porcentaje de descuento, número de sesiones, etc.
  currency?: string; // Para bonos monetarios
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ReferralProgram {
  id: string;
  name: string;
  description: string;
  reward: ReferralReward;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  totalReferrals: number;
  convertedReferrals: number;
  totalRewardsGiven: number;
}

export interface Referral {
  id: string;
  programId: string;
  referrerClientId: string;
  referrerClientName: string;
  referredEmail: string;
  referredName?: string;
  referralLink: string;
  status: ReferralStatus;
  convertedAt?: string;
  rewardGivenAt?: string;
  createdAt: string;
  updatedAt?: string;
  notes?: string;
}

export interface ReferralStats {
  totalReferrals: number;
  convertedReferrals: number;
  conversionRate: number;
  totalRewardsGiven: number;
  topReferrers: {
    clientId: string;
    clientName: string;
    referralCount: number;
    convertedCount: number;
  }[];
  referralsByStatus: {
    status: ReferralStatus;
    count: number;
  }[];
  referralsByMonth: {
    month: string;
    count: number;
    converted: number;
  }[];
}

// Tipos para US-CF-07: Programas de Referidos IA con adaptación por segmentos
export interface SegmentBasedReward {
  segmentType: CustomerSegmentType;
  reward: ReferralReward;
  message: string; // Mensaje personalizado para este segmento
  aiGenerated: boolean; // Si fue generado por IA
  performance?: {
    conversionRate: number;
    referralsCount: number;
    avgTimeToConvert: number; // días
  };
}

export interface AIReferralProgram extends ReferralProgram {
  isAIEnabled: boolean;
  segmentBasedRewards?: SegmentBasedReward[]; // Recompensas adaptadas por segmento
  defaultReward: ReferralReward; // Recompensa por defecto si no hay segmento específico
  aiMessageTemplates?: {
    segmentType: CustomerSegmentType;
    template: string;
    variables?: string[]; // Variables disponibles como {nombre}, {objetivo}, etc.
  }[];
  autoAdaptEnabled: boolean; // Si la IA adapta automáticamente recompensas y mensajes
  lastAIAnalysis?: string; // Última vez que la IA analizó y adaptó el programa
  aiInsights?: {
    bestPerformingSegment: CustomerSegmentType;
    recommendedAdjustments: string[];
    conversionPredictions: {
      segmentType: CustomerSegmentType;
      predictedConversionRate: number;
    }[];
  };
}

// Tipos para US-CF-08: Misiones personalizadas para promotores
export type MissionType = 'reel' | 'review' | 'testimonial' | 'story' | 'post';
export type MissionStatus = 'pending' | 'assigned' | 'in-progress' | 'completed' | 'rejected' | 'expired';
export type MissionPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface PromoterMission {
  id: string;
  promoterId: string;
  promoterName: string;
  type: MissionType;
  title: string;
  description: string;
  instructions: string; // Instrucciones detalladas para el promotor
  status: MissionStatus;
  priority: MissionPriority;
  assignedAt: string;
  dueDate: string;
  completedAt?: string;
  // Contenido generado por el promotor
  submittedContent?: {
    url?: string; // URL del reel, post, etc.
    text?: string; // Texto de la reseña o testimonio
    platform?: SocialPlatform; // Plataforma donde se publicó
    publishedAt?: string;
  };
  // Personalización basada en el promotor
  personalizedMessage?: string; // Mensaje personalizado para este promotor
  suggestedHashtags?: string[];
  suggestedMentions?: string[];
  // Recompensa por completar la misión
  reward?: {
    type: RewardType;
    value: number;
    description: string;
  };
  // Métricas de rendimiento
  performance?: {
    views?: number;
    likes?: number;
    shares?: number;
    comments?: number;
    reach?: number;
  };
  // Feedback del entrenador
  trainerFeedback?: {
    rating: number; // 1-5
    comment?: string;
    approved: boolean;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface PromoterBranding {
  promoterId: string;
  promoterName: string;
  brandKit?: {
    logoUrl?: string;
    colorPalette?: string[];
    fonts?: string[];
    styleGuide?: string; // URL o texto con guía de estilo
  };
  personalizedBio?: string; // Biografía personalizada para el promotor
  socialHandles?: {
    platform: SocialPlatform;
    handle: string;
    verified: boolean;
  }[];
  missionHistory: PromoterMission[];
  totalMissionsCompleted: number;
  totalMissionsAssigned: number;
  averagePerformanceScore: number; // 0-100
  preferredMissionTypes: MissionType[];
  tags: string[];
}

// Tipos para integración de plataformas sociales (US-19)
export type SocialPlatform = 'google-my-business' | 'facebook' | 'instagram';
export type SyncFrequency = 'hourly' | 'daily' | 'weekly' | 'manual';

export interface SocialPlatformConnection {
  id: string;
  platform: SocialPlatform;
  name: string;
  isConnected: boolean;
  connectedAt?: string;
  lastSyncAt?: string;
  syncFrequency: SyncFrequency;
  reviewsImported: number;
  reviewsThisMonth: number;
  accountName?: string;
  accountId?: string;
  error?: string;
}

export interface ReviewRequest {
  id: string;
  clientId: string;
  clientName: string;
  platform: SocialPlatform;
  requestedAt: string;
  status: 'pending' | 'sent' | 'completed' | 'expired';
  link?: string;
  completedAt?: string;
}

// Tipos para reportes mensuales (US-20)
export type ReportStatus = 'pending' | 'generating' | 'completed' | 'sent' | 'failed';
export type ReportFormat = 'pdf' | 'email' | 'both';

export interface MonthlyReport {
  id: string;
  month: string; // YYYY-MM
  period: string; // "Octubre 2025"
  status: ReportStatus;
  averageSatisfaction: number;
  testimonialsCollected: number;
  promoterClients: number;
  negativeFeedbackResolved: number;
  trends: ReportTrend[];
  comparisonWithPreviousMonth: MonthComparison;
  generatedAt?: string;
  sentAt?: string;
  downloadUrl?: string;
  recipients?: string[];
  format: ReportFormat;
  // US-CF-15: Insights accionables y próximas acciones
  actionableInsights?: ActionableInsight[];
  nextActions?: NextAction[];
  highlights?: ReportHighlight[];
  learnings?: ReportLearning[];
}

export interface ReportTrend {
  metric: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'stable';
  description: string;
}

export interface MonthComparison {
  averageSatisfaction: { current: number; previous: number; change: number };
  testimonialsCollected: { current: number; previous: number; change: number };
  promoterClients: { current: number; previous: number; change: number };
  negativeFeedbackResolved: { current: number; previous: number; change: number };
}

export interface MonthlyReportConfig {
  id: string;
  enabled: boolean;
  autoSend: boolean;
  sendDate: number; // Día del mes (1-31)
  recipients: string[];
  format: ReportFormat;
  includeCharts: boolean;
  includeTestimonials: boolean;
  includeTrends: boolean;
  includeActionableInsights?: boolean; // US-CF-15
  includeNextActions?: boolean; // US-CF-15
}

// US-CF-15: Tipos para insights accionables y próximas acciones
export interface ActionableInsight {
  id: string;
  title: string;
  description: string;
  category: 'satisfaction' | 'engagement' | 'retention' | 'growth' | 'community' | 'revenue';
  priority: 'high' | 'medium' | 'low';
  impact: string; // Descripción del impacto esperado
  dataPoints: string[]; // Datos que respaldan el insight
  confidence: number; // 0-100, confianza en el insight
}

export interface NextAction {
  id: string;
  title: string;
  description: string;
  type: 'campaign' | 'content' | 'challenge' | 'automation' | 'outreach' | 'optimization';
  priority: 'high' | 'medium' | 'low';
  estimatedImpact: string; // Impacto estimado
  effort: 'low' | 'medium' | 'high'; // Esfuerzo requerido
  suggestedTimeline: string; // Timeline sugerido
  relatedInsightId?: string; // ID del insight relacionado
  actionableSteps: string[]; // Pasos concretos a seguir
}

export interface ReportHighlight {
  id: string;
  title: string;
  description: string;
  metric?: string;
  value?: string | number;
  trend?: 'positive' | 'negative' | 'neutral';
  icon?: string;
}

export interface ReportLearning {
  id: string;
  title: string;
  description: string;
  category: 'what-worked' | 'what-didnt' | 'opportunity' | 'risk';
  evidence: string[]; // Evidencia que respalda el aprendizaje
  recommendation?: string; // Recomendación basada en el aprendizaje
}

// Tipos para US-CF-01: Configuración de Voz de Comunidad
export type RecognitionStyle = 'formal' | 'cercano' | 'motivacional' | 'celebratorio' | 'personalizado';
export type CommunityRitualType = 'bienvenida' | 'hito' | 'reconocimiento' | 'despedida' | 'personalizado';

export interface CommunityRitual {
  id: string;
  type: CommunityRitualType;
  name: string;
  description: string;
  trigger: string; // Cuándo se activa (ej: "Primera sesión", "Objetivo alcanzado")
  message: string; // Mensaje personalizado
  emojis?: string[]; // Emojis asociados
  isActive: boolean;
}

export interface CommunityVoiceConfig {
  id: string;
  trainerId: string;
  // Valores de la comunidad
  values: string[]; // Ej: ["Disciplina", "Apoyo mutuo", "Progreso constante"]
  // Tono y estilo
  tone: string; // Descripción del tono (ej: "Motivacional pero cercano")
  recognitionStyle: RecognitionStyle;
  customRecognitionStyle?: string; // Si es personalizado
  // Elementos visuales y de comunicación
  preferredEmojis: string[]; // Emojis que usa frecuentemente
  keywords: string[]; // Palabras clave que definen su estilo
  // Rituales de comunidad
  rituals: CommunityRitual[];
  // Configuración adicional
  updatedAt?: string;
  createdAt?: string;
}

// Tipos para US-CF-02: Segmentación de Clientes con IA
export type CustomerSegmentType = 'embajador' | 'nuevo' | 'riesgo' | 'regular' | 'vip';
export type SegmentClassificationSource = 'ai' | 'manual' | 'rule-based';

export interface CustomerSegment {
  id: string;
  clientId: string;
  clientName: string;
  segmentType: CustomerSegmentType;
  classificationSource: SegmentClassificationSource;
  // Métricas que determinan el segmento
  metrics: {
    attendanceRate?: number; // Porcentaje de asistencia
    npsScore?: number; // NPS del cliente
    purchaseFrequency?: number; // Frecuencia de compras
    daysAsClient?: number; // Días como cliente
    lastSessionDate?: string; // Última sesión
    satisfactionScore?: number; // Puntuación de satisfacción promedio
    referralCount?: number; // Número de referidos
    engagementScore?: number; // Score de engagement (0-100)
  };
  // Razón de la clasificación
  classificationReason: string; // Explicación de por qué está en este segmento
  // Confianza de la clasificación IA (0-100)
  confidenceScore?: number;
  // Fechas
  classifiedAt: string;
  lastUpdated?: string;
  // Tags adicionales
  tags?: string[];
}

export interface SegmentSummary {
  segmentType: CustomerSegmentType;
  count: number;
  percentage: number;
  trend?: 'up' | 'down' | 'steady';
  change?: number; // Cambio respecto al periodo anterior
}

// Tipos para US-CF-03: Captura de "momentos wow" con IA
export type WowMomentType = 'sesion-especial' | 'ritual' | 'logro-cliente' | 'evento-comunidad' | 'personalizado';
export type WowMomentStatus = 'capturado' | 'en-analisis' | 'replicado' | 'archivado';

export interface WowMoment {
  id: string;
  title: string;
  type: WowMomentType;
  description: string;
  capturedAt: string;
  capturedBy?: string; // ID del entrenador o sistema
  // Detalles del momento
  sessionId?: string;
  clientId?: string;
  clientName?: string;
  eventDetails?: string;
  // Análisis IA
  aiAnalysis?: {
    keyElements: string[]; // Elementos clave que hacen especial el momento
    emotionalTriggers: string[]; // Triggers emocionales identificados
    replicableActions: string[]; // Acciones que se pueden replicar
    suggestedScripts?: string[]; // Guiones sugeridos para replicar
    suggestedFollowUps?: string[]; // Follow-ups sugeridos
  };
  // Estrategias de replicación
  replicationStrategies?: ReplicationStrategy[];
  status: WowMomentStatus;
  tags: string[];
  notes?: string;
}

export interface ReplicationStrategy {
  id: string;
  name: string;
  description: string;
  targetAudience: string; // A quién aplicar
  suggestedActions: string[];
  suggestedScript?: string;
  suggestedFollowUp?: string;
  isActive: boolean;
  createdAt: string;
}

// Tipos para US-CF-04: Guiones IA para solicitar testimonios
export type TestimonialScriptObjective = 'ventas-premium' | 'programa-grupal' | 'transformacion' | 'fidelizacion' | 'referidos' | 'personalizado';
export type TestimonialScriptFormat = 'video' | 'audio' | 'texto' | 'live';

export interface TestimonialScript {
  id: string;
  name: string;
  objective: TestimonialScriptObjective;
  format: TestimonialScriptFormat;
  // Story arc
  storyArc: {
    opening: string; // Apertura del guión
    questions: TestimonialQuestion[]; // Preguntas guiadas
    closing: string; // Cierre del guión
  };
  // Personalización basada en voz de comunidad
  tone: string; // Tono del entrenador
  keywords: string[]; // Palabras clave a usar
  preferredEmojis?: string[]; // Emojis preferidos
  // Configuración
  estimatedDuration: number; // Duración estimada en minutos
  clientContext?: {
    clientId?: string;
    clientName?: string;
    objective?: string; // Objetivo del cliente
    progress?: string; // Progreso del cliente
  };
  // Exportación
  teleprompterText?: string; // Texto formateado para teleprompter
  createdAt: string;
  updatedAt?: string;
}

export interface TestimonialQuestion {
  id: string;
  order: number;
  question: string;
  purpose: string; // Propósito de la pregunta
  suggestedFollowUp?: string; // Pregunta de seguimiento sugerida
  expectedDuration?: number; // Duración esperada en segundos
}

// Tipos para US-CF-05: Publicación automática de mejores reseñas en funnels y contenido
export type AutoPublishTarget = 'funnel' | 'landing-page' | 'social-content' | 'email-sequence' | 'all';
export type BestReviewCriteria = 'score' | 'recency' | 'engagement' | 'completeness' | 'composite';

export interface BestReviewConfig {
  id: string;
  enabled: boolean;
  criteria: BestReviewCriteria;
  minScore: number; // Mínimo 4.5
  minRecencyDays: number; // Máximo días desde creación
  autoPublishTargets: AutoPublishTarget[];
  funnelIds?: string[]; // IDs de funnels específicos, si está vacío aplica a todos
  maxReviewsPerFunnel?: number; // Máximo de reseñas por funnel
  refreshFrequency: 'daily' | 'weekly' | 'manual'; // Frecuencia de actualización
  lastRefreshAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AutoPublishedReview {
  id: string;
  testimonialId: string;
  testimonial: Testimonial;
  publishedTo: AutoPublishTarget[];
  funnelIds?: string[];
  publishedAt: string;
  publishedBy: 'system' | 'manual';
  performance?: {
    views?: number;
    clicks?: number;
    conversions?: number;
    engagementRate?: number;
  };
}

// Tipos para US-CF-06: Detección de momentos ideales según progreso real
export interface ClientProgressData {
  clientId: string;
  clientName: string;
  objectives: {
    id: string;
    title: string;
    progress: number; // 0-100
    status: 'not_started' | 'in_progress' | 'achieved' | 'at_risk' | 'failed';
    achievedAt?: string;
    category: string;
  }[];
  sessions: {
    total: number;
    completed: number;
    lastSessionDate?: string;
    milestoneSessions: number[]; // Sesiones que son hitos (5, 10, 20, etc.)
  };
  metrics?: {
    weightChange?: number; // kg
    bodyFatChange?: number; // %
    strengthGains?: number; // %
    enduranceGains?: number; // %
  };
  recentAchievements: {
    id: string;
    title: string;
    achievedAt: string;
    category: string;
  }[];
  lastTestimonialRequest?: string;
  daysSinceLastTestimonial?: number;
}

export interface ProgressBasedMoment extends IdealTestimonialMoment {
  progressData: ClientProgressData;
  momentumScore: number; // 0-100, indica qué tan fuerte es el momentum
  recommendedAction: 'request-now' | 'wait-optimal' | 'schedule-follow-up';
  optimalTiming?: string; // Fecha/hora recomendada para solicitar
  suggestedMessage?: string; // Mensaje sugerido basado en el progreso
}

// User Story 1: Reportes IA de Impacto de Referidos en Ingresos y Funnel
export type FunnelStage = 'awareness' | 'interest' | 'consideration' | 'conversion' | 'retention';
export type ReferralImpactPeriod = '7d' | '30d' | '90d' | '12m';

export interface ReferralFunnelMetrics {
  stage: FunnelStage;
  referrals: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
  averageOrderValue: number;
  timeToConvert: number; // días promedio
  trendDirection: 'up' | 'down' | 'steady';
  changePercentage?: number;
}

export interface ReferralRevenueImpact {
  totalRevenue: number;
  referralRevenue: number;
  referralRevenuePercentage: number;
  averageRevenuePerReferral: number;
  lifetimeValue: number; // LTV de clientes referidos
  costPerReferral: number;
  returnOnInvestment: number; // ROI en porcentaje
  trendDirection: 'up' | 'down' | 'steady';
  changePercentage?: number;
}

export interface ReferralSegmentImpact {
  segmentType: CustomerSegmentType;
  referralsCount: number;
  conversionsCount: number;
  conversionRate: number;
  revenue: number;
  averageOrderValue: number;
  roi: number;
}

export interface ReferralROIReport {
  id: string;
  period: ReferralImpactPeriod;
  generatedAt: string;
  // Métricas de ingresos
  revenueImpact: ReferralRevenueImpact;
  // Métricas de funnel
  funnelMetrics: ReferralFunnelMetrics[];
  // Impacto por segmento
  segmentImpact: ReferralSegmentImpact[];
  // Insights de IA
  aiInsights: {
    keyFindings: string[];
    recommendations: string[];
    topPerformingSegments: CustomerSegmentType[];
    improvementOpportunities: string[];
    predictedROI?: number; // ROI proyectado
  };
  // Comparación con periodo anterior
  comparison?: {
    revenueChange: number;
    conversionRateChange: number;
    roiChange: number;
    funnelImprovement: string[];
  };
}

// User Story 2: Encuestas IA Adaptadas por Experiencia
export type ExperienceType = 'sesion-1-1' | 'reto' | 'evento' | 'programa' | 'webinar' | 'workshop';
export type SurveyAdaptationLevel = 'basic' | 'advanced' | 'personalized';
export type SurveyQuestionType = 'rating' | 'multiple-choice' | 'text' | 'yes-no' | 'scale';

export interface AIAdaptedSurveyQuestion {
  id: string;
  type: SurveyQuestionType;
  question: string;
  description?: string;
  options?: string[]; // Para multiple-choice
  scale?: {
    min: number;
    max: number;
    labels?: {
      min: string;
      max: string;
    };
  };
  required: boolean;
  order: number;
  aiReasoning?: string; // Por qué esta pregunta fue seleccionada/adaptada
}

export interface AIAdaptedSurvey {
  id: string;
  name: string;
  experienceType: ExperienceType;
  description: string;
  questions: AIAdaptedSurveyQuestion[];
  adaptationLevel: SurveyAdaptationLevel;
  // Configuración de personalización
  personalization: {
    adaptedToClient?: {
      clientId?: string;
      clientName?: string;
      clientSegment?: CustomerSegmentType;
      clientHistory?: {
        previousSurveys?: number;
        averageSatisfaction?: number;
        lastInteraction?: string;
      };
    };
    adaptedToExperience?: {
      experienceId?: string;
      experienceName?: string;
      experienceDate?: string;
      experienceDuration?: number;
      experienceParticipants?: number;
    };
    adaptedToContext?: {
      timing?: string; // 'post-experience' | 'during' | 'pre-experience'
      channel?: 'whatsapp' | 'email' | 'in-app' | 'sms';
      language?: string;
    };
  };
  // Configuración de envío
  sendConfig?: {
    delayHours?: number; // Horas después de la experiencia
    channel: 'whatsapp' | 'email' | 'in-app' | 'sms';
    autoSend: boolean;
    reminderEnabled: boolean;
    reminderDelayHours?: number;
  };
  // Metadatos de IA
  aiMetadata: {
    generatedAt: string;
    model?: string;
    adaptationReasons: string[]; // Razones por las que se adaptó así
    expectedResponseRate?: number; // Tasa de respuesta esperada
    expectedActionableFeedback?: number; // Cantidad de feedback accionable esperado
  };
  // Estado
  status: 'draft' | 'active' | 'sent' | 'completed' | 'archived';
  createdAt: string;
  updatedAt?: string;
}

export interface AIAdaptedSurveyResponse {
  id: string;
  surveyId: string;
  clientId: string;
  clientName: string;
  experienceType: ExperienceType;
  experienceId?: string;
  responses: {
    questionId: string;
    question: string;
    answer: string | number | boolean;
    answeredAt: string;
  }[];
  completedAt: string;
  // Análisis de feedback accionable
  actionableFeedback?: {
    insights: string[];
    priorities: {
      priority: 'high' | 'medium' | 'low';
      insight: string;
      suggestedAction: string;
    }[];
    sentiment: 'positive' | 'neutral' | 'negative';
    overallSatisfaction?: number; // 1-5
  };
}

export interface AIAdaptedSurveyTemplate {
  id: string;
  name: string;
  experienceType: ExperienceType;
  description: string;
  baseQuestions: AIAdaptedSurveyQuestion[]; // Preguntas base que se adaptan
  defaultConfig: {
    delayHours: number;
    channel: 'whatsapp' | 'email' | 'in-app' | 'sms';
    autoSend: boolean;
  };
  adaptationRules?: {
    segmentRules?: {
      segmentType: CustomerSegmentType;
      additionalQuestions?: string[];
      modifiedQuestions?: Partial<AIAdaptedSurveyQuestion>[];
    }[];
    timingRules?: {
      timing: string;
      questionOrder?: number[];
    }[];
  };
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AIAdaptedSurveyStats {
  surveyId: string;
  surveyName: string;
  experienceType: ExperienceType;
  totalSent: number;
  totalResponses: number;
  responseRate: number;
  averageSatisfaction?: number;
  actionableFeedbackCount: number;
  actionableFeedbackRate: number; // % de respuestas con feedback accionable
  topInsights: string[];
  sentimentDistribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  period: ReferralImpactPeriod;
}

// User Story: Convertir feedback positivo en historias de éxito para contenido y funnels
export type SuccessStoryStatus = 'draft' | 'published' | 'archived';
export type SuccessStoryFormat = 'text' | 'video' | 'image' | 'case-study';
export type ContentType = 'funnel' | 'landing-page' | 'social-media' | 'email' | 'blog' | 'testimonial-page';

export interface SuccessStory {
  id: string;
  title: string;
  description: string;
  // Testimonial original del que se generó
  sourceTestimonialId: string;
  sourceTestimonial?: Testimonial;
  // Cliente
  clientId: string;
  clientName: string;
  clientRole?: string;
  // Contenido de la historia
  storyContent: {
    headline: string; // Título impactante
    challenge: string; // Desafío inicial del cliente
    solution: string; // Cómo se resolvió
    results: string; // Resultados obtenidos
    quote: string; // Cita destacada del testimonio
    metrics?: {
      label: string;
      value: string;
      improvement?: string; // Mejora porcentual o absoluta
    }[];
  };
  // Formato y medios
  format: SuccessStoryFormat;
  mediaUrl?: string; // URL de video, imagen, etc.
  // Uso en contenido
  usedInContent: {
    contentType: ContentType;
    contentId?: string;
    contentName?: string;
    publishedAt?: string;
  }[];
  // Tags y categorización
  tags: string[];
  category?: string; // Ej: "pérdida de peso", "ganancia muscular", "rehabilitación"
  // Estado y fechas
  status: SuccessStoryStatus;
  createdAt: string;
  updatedAt?: string;
  publishedAt?: string;
  // Métricas de rendimiento
  performance?: {
    views?: number;
    conversions?: number;
    engagementRate?: number;
    shares?: number;
  };
  // Generado por IA
  aiGenerated: boolean;
  aiMetadata?: {
    generatedAt: string;
    model?: string;
    confidenceScore?: number;
  };
}

export interface SuccessStoryTemplate {
  id: string;
  name: string;
  description: string;
  contentType: ContentType;
  template: {
    headlineTemplate: string;
    challengeTemplate: string;
    solutionTemplate: string;
    resultsTemplate: string;
  };
  isActive: boolean;
  createdAt: string;
}

export interface SuccessStoryUsage {
  storyId: string;
  contentType: ContentType;
  contentId?: string;
  contentName?: string;
  position?: string; // Dónde se usa en el contenido (ej: "hero", "testimonials", "results")
  publishedAt?: string;
  performance?: {
    views?: number;
    clicks?: number;
    conversions?: number;
  };
}

// User Story: AI Playbook - Retos y eventos basados en estilo y calendario
export type ChallengeType = 'fitness' | 'nutricion' | 'mental' | 'social' | 'transformacion' | 'personalizado';
export type EventType = 'workshop' | 'retro' | 'competencia' | 'masterclass' | 'networking' | 'celebracion' | 'personalizado';
export type SuggestionStatus = 'pending' | 'accepted' | 'rejected' | 'scheduled' | 'completed';
export type SuggestionPriority = 'low' | 'medium' | 'high';

export interface CalendarConstraint {
  startDate?: string; // Fecha de inicio disponible
  endDate?: string; // Fecha de fin disponible
  preferredDays?: string[]; // Días de la semana preferidos ['lunes', 'martes', ...]
  preferredTimes?: string[]; // Horarios preferidos ['09:00', '18:00', ...]
  blackoutDates?: string[]; // Fechas no disponibles
  maxDuration?: number; // Duración máxima en horas
}

export interface TrainerStyle {
  values?: string[]; // Valores del entrenador
  tone?: string; // Tono de comunicación
  preferredEmojis?: string[]; // Emojis preferidos
  keywords?: string[]; // Palabras clave
  recognitionStyle?: RecognitionStyle; // Estilo de reconocimiento
  communityRituals?: CommunityRitual[]; // Rituales de comunidad
}

export interface AIPlaybookChallenge {
  id: string;
  title: string;
  description: string;
  type: ChallengeType;
  duration: number; // Duración en días
  difficulty: 'principiante' | 'intermedio' | 'avanzado';
  targetAudience?: CustomerSegmentType[]; // Segmentos objetivo
  objectives: string[]; // Objetivos del reto
  suggestedActivities: string[]; // Actividades sugeridas
  rewards?: {
    type: RewardType;
    description: string;
  };
  communityEngagement?: {
    hashtag?: string;
    groupActivity?: string;
    sharingPrompt?: string;
  };
  estimatedEngagement: number; // Participantes estimados (0-100)
  estimatedImpact: number; // Impacto estimado en motivación (0-100)
}

export interface AIPlaybookEvent {
  id: string;
  title: string;
  description: string;
  type: EventType;
  duration: number; // Duración en horas
  suggestedDate?: string; // Fecha sugerida
  suggestedTime?: string; // Hora sugerida
  location?: {
    type: 'presencial' | 'virtual' | 'hibrido';
    address?: string;
    platform?: string;
  };
  targetAudience?: CustomerSegmentType[];
  agenda?: {
    time: string;
    activity: string;
    description?: string;
  }[];
  objectives: string[]; // Objetivos del evento
  communityEngagement?: {
    hashtag?: string;
    liveStreaming?: boolean;
    recording?: boolean;
    followUpActivity?: string;
  };
  estimatedAttendance: number; // Asistencia estimada
  estimatedImpact: number; // Impacto estimado en comunidad (0-100)
  resources?: {
    materials?: string[];
    speakers?: string[];
    sponsors?: string[];
  };
}

export interface AIPlaybookSuggestion {
  id: string;
  type: 'challenge' | 'event';
  challenge?: AIPlaybookChallenge;
  event?: AIPlaybookEvent;
  priority: SuggestionPriority;
  status: SuggestionStatus;
  reasoning: string; // Por qué se sugiere esto
  alignmentScore: number; // 0-100, qué tan alineado está con el estilo del entrenador
  calendarFit: number; // 0-100, qué tan bien encaja en el calendario
  communityFit: number; // 0-100, qué tan bien encaja con la comunidad
  suggestedBy: 'ai' | 'manual';
  suggestedAt: string;
  scheduledFor?: string; // Fecha programada si fue aceptado
  acceptedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  completedAt?: string;
  performance?: {
    participation?: number;
    engagement?: number;
    satisfaction?: number;
    impact?: number;
  };
}

export interface AIPlaybook {
  id: string;
  trainerId: string;
  enabled: boolean;
  // Configuración de estilo
  trainerStyle: TrainerStyle;
  // Configuración de calendario
  calendarConstraints: CalendarConstraint;
  // Preferencias de sugerencias
  preferences: {
    challengeTypes?: ChallengeType[];
    eventTypes?: EventType[];
    frequency?: 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
    minAlignmentScore?: number; // Score mínimo para sugerir (0-100)
    autoAccept?: boolean; // Si acepta automáticamente sugerencias con score alto
  };
  // Estadísticas
  stats?: {
    totalSuggestions: number;
    acceptedSuggestions: number;
    completedChallenges: number;
    completedEvents: number;
    averageEngagement: number;
    averageImpact: number;
  };
  lastAnalysis?: string; // Última vez que se analizó el estilo y calendario
  createdAt: string;
  updatedAt?: string;
}

// User Story: Mensajes automatizados de cumplimiento (felicitar hitos, motivar recaídas)
export type MessageType = 'milestone' | 'relapse' | 'achievement' | 'encouragement' | 'check-in';
export type MessageTrigger = 'objective-achieved' | 'session-milestone' | 'weight-goal' | 'strength-goal' | 'attendance-streak' | 'relapse-detected' | 'low-engagement' | 'anniversary' | 'custom';
export type MessageChannel = 'whatsapp' | 'email' | 'sms' | 'in-app';
export type MessageStatus = 'draft' | 'scheduled' | 'sent' | 'delivered' | 'read' | 'failed';

export interface MilestoneData {
  type: 'objective' | 'session' | 'weight' | 'strength' | 'attendance' | 'time' | 'custom';
  title: string;
  description: string;
  achievedAt: string;
  value?: string | number; // Valor del hito (ej: "10 sesiones", "5kg perdidos")
  previousValue?: string | number;
  clientId: string;
  clientName: string;
}

export interface RelapseData {
  type: 'attendance' | 'engagement' | 'progress' | 'communication' | 'custom';
  description: string;
  detectedAt: string;
  severity: 'low' | 'medium' | 'high';
  indicators: string[]; // Indicadores de la recaída
  clientId: string;
  clientName: string;
  lastPositiveInteraction?: string;
  daysSinceLastSession?: number;
  previousStreak?: number;
}

export interface ComplianceMessageTemplate {
  id: string;
  name: string;
  type: MessageType;
  trigger: MessageTrigger;
  message: string; // Template con variables como {nombre}, {hito}, {valor}, etc.
  variables?: string[]; // Variables disponibles
  tone: 'empatico' | 'motivacional' | 'celebratorio' | 'profesional' | 'cercano';
  channel: MessageChannel;
  delayHours?: number; // Horas después del trigger para enviar
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AutomatedComplianceMessage {
  id: string;
  clientId: string;
  clientName: string;
  type: MessageType;
  trigger: MessageTrigger;
  templateId?: string;
  template?: ComplianceMessageTemplate;
  message: string; // Mensaje personalizado final
  channel: MessageChannel;
  status: MessageStatus;
  // Datos del trigger
  milestoneData?: MilestoneData;
  relapseData?: RelapseData;
  // Personalización
  personalization?: {
    tone?: string;
    emojis?: string[];
    keywords?: string[];
    customVariables?: Record<string, string>;
  };
  // Programación
  scheduledFor?: string; // Fecha/hora programada
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  // Respuesta del cliente
  clientResponse?: {
    responded: boolean;
    responseText?: string;
    respondedAt?: string;
    sentiment?: 'positive' | 'neutral' | 'negative';
  };
  // Efectividad
  effectiveness?: {
    opened: boolean;
    clicked?: boolean;
    responded: boolean;
    engagementScore?: number; // 0-100
  };
  createdAt: string;
  updatedAt?: string;
}

export interface ComplianceMessageConfig {
  id: string;
  trainerId: string;
  enabled: boolean;
  // Configuración de mensajes de hitos
  milestoneMessages: {
    enabled: boolean;
    triggers: MessageTrigger[];
    channels: MessageChannel[];
    delayHours: number;
    templates: ComplianceMessageTemplate[];
  };
  // Configuración de mensajes de recaídas
  relapseMessages: {
    enabled: boolean;
    triggers: MessageTrigger[];
    channels: MessageChannel[];
    delayHours: number;
    templates: ComplianceMessageTemplate[];
    sensitivity: 'low' | 'medium' | 'high'; // Sensibilidad para detectar recaídas
  };
  // Configuración general
  general: {
    maxMessagesPerWeek?: number; // Máximo de mensajes por cliente por semana
    quietHours?: {
      start: string; // Hora de inicio (ej: "22:00")
      end: string; // Hora de fin (ej: "08:00")
    };
    respectOptOut: boolean; // Respetar si el cliente optó por no recibir mensajes
    useTrainerVoice: boolean; // Usar la voz de comunidad del entrenador
  };
  // Estadísticas
  stats?: {
    totalMessagesSent: number;
    milestoneMessagesSent: number;
    relapseMessagesSent: number;
    averageResponseRate: number;
    averageEngagementScore: number;
    clientsReached: number;
  };
  lastAnalysis?: string;
  createdAt: string;
  updatedAt?: string;
}

// User Story 1: Correlación de actividades de comunidad con retención e ingresos
export type CommunityActivityType = 'programa' | 'evento' | 'reto' | 'workshop' | 'webinar' | 'competencia' | 'networking' | 'celebracion';
export type ActivityStatus = 'activo' | 'completado' | 'planificado' | 'cancelado';
export type MetricType = 'retencion' | 'ingresos' | 'engagement' | 'referidos' | 'satisfaccion';

export interface CommunityActivity {
  id: string;
  name: string;
  type: CommunityActivityType;
  description: string;
  startDate: string;
  endDate?: string;
  status: ActivityStatus;
  investment: number; // Inversión en la actividad (coste)
  participants: number; // Número de participantes
  targetAudience?: CustomerSegmentType[]; // Segmentos objetivo
  organizer?: string; // Organizador/responsable
  tags?: string[];
}

export interface ActivityRetentionImpact {
  activityId: string;
  activityName: string;
  // Métricas de retención
  retentionRate: number; // Tasa de retención (%)
  retentionLift: number; // Incremento en retención (%)
  participantsRetained: number; // Participantes que se mantuvieron activos
  totalParticipants: number;
  retentionPeriod: '30d' | '90d' | '180d' | '365d'; // Periodo de análisis de retención
  // Comparación
  baselineRetention: number; // Retención sin la actividad
  retentionChange: number; // Cambio en puntos porcentuales
  retentionTrend: 'up' | 'down' | 'steady';
}

export interface ActivityRevenueImpact {
  activityId: string;
  activityName: string;
  // Métricas de ingresos
  revenueGenerated: number; // Ingresos generados directamente
  revenueAttributed: number; // Ingresos atribuidos a la actividad
  revenueLift: number; // Incremento en ingresos (%)
  averageRevenuePerParticipant: number; // ARPU de participantes
  // ROI
  roi: number; // Return on Investment (%)
  roiPeriod: '30d' | '90d' | '180d' | '365d'; // Periodo de cálculo de ROI
  paybackPeriod?: number; // Periodo de recuperación en días
  // Comparación
  baselineRevenue: number; // Ingresos sin la actividad
  revenueChange: number; // Cambio en ingresos
  revenueTrend: 'up' | 'down' | 'steady';
}

export interface ActivityCorrelation {
  activity: CommunityActivity;
  retentionImpact: ActivityRetentionImpact;
  revenueImpact: ActivityRevenueImpact;
  // Métricas combinadas
  overallImpact: number; // Impacto general (0-100)
  impactScore: number; // Score de impacto (0-100)
  // Justificación de inversión
  investmentJustification: {
    roi: number;
    retentionValue: number; // Valor de la retención generada
    revenueValue: number; // Valor de los ingresos generados
    totalValue: number; // Valor total generado
    paybackPeriod?: number;
    recommendation: 'increase' | 'maintain' | 'reduce' | 'discontinue';
    reasoning: string; // Razón de la recomendación
  };
  // Comparación con otras actividades
  comparison?: {
    rank: number; // Ranking entre todas las actividades
    percentile: number; // Percentil (0-100)
    betterThanAverage: boolean;
  };
}

export interface CommunityActivityCorrelationReport {
  id: string;
  period: CommunityFidelizacionSnapshot['period'];
  generatedAt: string;
  // Correlaciones por actividad
  correlations: ActivityCorrelation[];
  // Resumen
  summary: {
    totalActivities: number;
    totalInvestment: number;
    totalRevenueGenerated: number;
    totalRetentionLift: number;
    averageROI: number;
    topPerformer: ActivityCorrelation | null;
    worstPerformer: ActivityCorrelation | null;
  };
  // Insights de IA
  aiInsights: {
    keyFindings: string[];
    recommendations: string[];
    opportunities: string[];
    risks: string[];
    investmentRecommendations: {
      activityId: string;
      activityName: string;
      recommendation: 'increase' | 'maintain' | 'reduce' | 'discontinue';
      reasoning: string;
      suggestedInvestment?: number;
    }[];
  };
  // Tendencias
  trends: {
    activityType: CommunityActivityType;
    averageROI: number;
    averageRetentionLift: number;
    trendDirection: 'up' | 'down' | 'steady';
  }[];
}

// User Story 2: Radar IA de salud comunitaria
export type HealthMetricType = 'engagement' | 'satisfaccion' | 'referidos' | 'retencion' | 'advocacy' | 'comunidad';
export type HealthStatus = 'excelente' | 'buena' | 'regular' | 'baja' | 'critica';
export type AlertPriority = 'critical' | 'high' | 'medium' | 'low';
export type AlertType = 'engagement-drop' | 'satisfaction-drop' | 'referral-drop' | 'retention-risk' | 'community-health' | 'advocacy-decline';

export interface HealthMetric {
  id: string;
  type: HealthMetricType;
  label: string;
  value: number; // 0-100
  previousValue?: number;
  trend: 'up' | 'down' | 'steady';
  changePercentage?: number;
  status: HealthStatus;
  target?: number; // Valor objetivo
  threshold?: {
    critical: number; // Umbral crítico
    warning: number; // Umbral de advertencia
    good: number; // Umbral bueno
  };
  description?: string;
  lastUpdated: string;
}

export interface CommunityHealthAlert {
  id: string;
  type: AlertType;
  priority: AlertPriority;
  metric: HealthMetricType;
  title: string;
  description: string;
  // Datos del alerta
  currentValue: number;
  previousValue: number;
  changePercentage: number;
  threshold: number;
  // Recomendaciones IA
  aiRecommendations: {
    action: string;
    rationale: string;
    expectedImpact: 'high' | 'medium' | 'low';
    urgency: 'immediate' | 'soon' | 'planned';
    actionableSteps: string[];
  }[];
  // Contexto
  context?: {
    relatedActivities?: string[]; // IDs de actividades relacionadas
    relatedSegments?: CustomerSegmentType[];
    timeframe?: string;
    historicalData?: {
      date: string;
      value: number;
    }[];
  };
  // Estado
  status: 'active' | 'acknowledged' | 'resolved' | 'dismissed';
  acknowledgedAt?: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface CommunityHealthRadar {
  id: string;
  period: CommunityFidelizacionSnapshot['period'];
  generatedAt: string;
  // Métricas del radar
  metrics: HealthMetric[];
  // Score general de salud
  overallHealthScore: number; // 0-100
  previousHealthScore?: number;
  healthTrend: 'up' | 'down' | 'steady';
  healthStatus: HealthStatus;
  // Alertas proactivas
  alerts: CommunityHealthAlert[];
  activeAlertsCount: number;
  criticalAlertsCount: number;
  // Análisis IA
  aiAnalysis: {
    overallAssessment: string;
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    risks: string[];
    recommendations: {
      priority: AlertPriority;
      action: string;
      rationale: string;
      expectedImpact: string;
      timeline: string;
    }[];
    predictiveInsights?: {
      metric: HealthMetricType;
      prediction: string;
      confidence: number; // 0-100
      timeframe: string;
    }[];
  };
  // Comparación histórica
  historicalComparison?: {
    period: string;
    healthScore: number;
    metrics: {
      type: HealthMetricType;
      value: number;
    }[];
  }[];
  // Segmentos de salud
  segmentHealth?: {
    segmentType: CustomerSegmentType;
    healthScore: number;
    metrics: HealthMetric[];
    alerts: CommunityHealthAlert[];
  }[];
}

// US-CF-20: Tipos para plantillas IA con guidelines para community managers
export type TemplateCategory = 'testimonial' | 'social-post' | 'email' | 'message' | 'content' | 'campaign';
export type TemplateFormat = 'text' | 'video-script' | 'audio-script' | 'post' | 'story' | 'reel' | 'email';
export type TemplateStatus = 'draft' | 'active' | 'archived';

export interface CommunityManagerAITemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  format: TemplateFormat;
  // Contenido de la plantilla
  template: {
    structure: string[]; // Estructura del contenido (ej: ["hook", "body", "cta"])
    content: Record<string, string>; // Contenido por sección
    variables?: Array<{
      key: string;
      label: string;
      type: 'text' | 'number' | 'date' | 'select';
      required: boolean;
      options?: string[]; // Para tipo select
      placeholder?: string;
      description?: string;
    }>;
    example?: string; // Ejemplo de uso
  };
  // Guidelines asociados
  guidelines: {
    tone: string; // Tono a usar
    do: string[]; // Qué hacer (DOs)
    dont: string[]; // Qué no hacer (DON'Ts)
    keyPoints: string[]; // Puntos clave a recordar
    brandVoice?: string; // Voz de marca específica
    examples?: string[]; // Ejemplos de buen uso
  };
  // Configuración de personalización IA
  aiConfig?: {
    enabled: boolean;
    personalizationLevel: 'basic' | 'advanced' | 'full';
    adaptToClient?: boolean; // Adaptar según cliente
    adaptToContext?: boolean; // Adaptar según contexto
    useCommunityVoice?: boolean; // Usar voz de comunidad configurada
  };
  // Asignación a community managers
  assignedTo?: string[]; // IDs de community managers
  // Metadatos
  status: TemplateStatus;
  usageCount?: number;
  lastUsed?: string;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string; // ID del entrenador que creó la plantilla
}

export interface CommunityManagerGuidelines {
  id: string;
  trainerId: string;
  // Guidelines generales
  general: {
    tone: string;
    voice: string; // Descripción de la voz de marca
    values: string[]; // Valores a reflejar
    keywords: string[]; // Palabras clave a usar
    preferredEmojis?: string[]; // Emojis preferidos
    avoidWords?: string[]; // Palabras a evitar
  };
  // Guidelines por categoría
  categoryGuidelines?: Record<TemplateCategory, {
    tone?: string;
    specificRules?: string[];
    examples?: string[];
  }>;
  // Guidelines por plataforma
  platformGuidelines?: Record<'instagram' | 'facebook' | 'whatsapp' | 'email' | 'linkedin', {
    tone?: string;
    format?: string;
    bestPractices?: string[];
    examples?: string[];
  }>;
  // DOs y DON'Ts globales
  dos: string[];
  donts: string[];
  // Ejemplos de buen contenido
  goodExamples?: Array<{
    id: string;
    title: string;
    content: string;
    category: TemplateCategory;
    whyGood: string; // Por qué es un buen ejemplo
  }>;
  // Ejemplos de mal contenido (para evitar)
  badExamples?: Array<{
    id: string;
    title: string;
    content: string;
    category: TemplateCategory;
    whyBad: string; // Por qué es un mal ejemplo
    howToFix: string; // Cómo mejorarlo
  }>;
  // Configuración de aprobación
  approvalConfig?: {
    requireApproval: boolean; // Requerir aprobación antes de publicar
    autoApprove?: boolean; // Auto-aprobar si cumple guidelines
    approvers?: string[]; // IDs de quienes pueden aprobar
  };
  // Metadatos
  createdAt: string;
  updatedAt?: string;
  lastReviewed?: string;
  version?: number;
}

// US-CF-21: Aprobación de testimonios y mensajes antes de publicar
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'auto-approved';
export type ApprovalType = 'testimonial' | 'message' | 'content';

export interface ApprovalRequest {
  id: string;
  type: ApprovalType;
  // Referencia al item que necesita aprobación
  itemId: string;
  itemType: 'testimonial' | 'automated-message' | 'content';
  // Contenido a aprobar
  content: {
    title?: string;
    text: string;
    metadata?: Record<string, any>;
  };
  // Estado de aprobación
  status: ApprovalStatus;
  // Información del solicitante
  requestedBy?: string; // ID del sistema o usuario
  requestedAt: string;
  // Información del aprobador
  approvedBy?: string; // ID del entrenador
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  // Configuración de auto-aprobación
  autoApproved?: boolean;
  autoApprovalReason?: string;
  // Notas
  notes?: string;
}

export interface ApprovalConfig {
  id: string;
  trainerId: string;
  // Configuración de aprobación de testimonios
  testimonialApproval: {
    enabled: boolean; // Requerir aprobación antes de publicar
    autoApproveHighScore?: boolean; // Auto-aprobar testimonios con score >= X
    autoApproveScoreThreshold?: number; // Umbral de score para auto-aprobación (ej: 4.5)
    requireApprovalForAll?: boolean; // Requerir aprobación incluso para auto-publicación
  };
  // Configuración de aprobación de mensajes
  messageApproval: {
    enabled: boolean; // Requerir aprobación antes de enviar
    autoApproveTemplates?: boolean; // Auto-aprobar mensajes de plantillas aprobadas
    requireApprovalForNewTemplates?: boolean; // Requerir aprobación para nuevas plantillas
    requireApprovalForPersonalized?: boolean; // Requerir aprobación para mensajes personalizados
  };
  // Notificaciones
  notifications: {
    notifyOnPending: boolean; // Notificar cuando hay aprobaciones pendientes
    notifyOnRejection: boolean; // Notificar cuando se rechaza algo
    notificationChannels?: ('email' | 'in-app')[];
  };
  // Estadísticas
  stats?: {
    totalPending: number;
    totalApproved: number;
    totalRejected: number;
    averageApprovalTime?: number; // Tiempo promedio de aprobación en horas
  };
  createdAt: string;
  updatedAt?: string;
}

// US-CF-22: IA que aprende qué iniciativas generan mayor retención y referidos
export interface InitiativeReferralImpact {
  initiativeId: string;
  initiativeName: string;
  initiativeType: CommunityActivityType;
  // Métricas de referidos
  referralsGenerated: number; // Número de referidos generados
  referralConversionRate: number; // Tasa de conversión de referidos
  referralRevenue: number; // Ingresos de referidos generados
  referralROI: number; // ROI de referidos
  // Métricas de retención
  retentionRate: number; // Tasa de retención
  retentionLift: number; // Incremento en retención
  participantsRetained: number; // Participantes retenidos
  // Métricas combinadas
  overallEffectiveness: number; // Efectividad general (0-100)
  priorityScore: number; // Score de prioridad (0-100)
}

export interface InitiativeLearningData {
  initiativeId: string;
  initiativeName: string;
  initiativeType: CommunityActivityType;
  // Datos históricos
  totalRuns: number; // Veces que se ha ejecutado
  totalParticipants: number; // Total de participantes históricos
  // Métricas acumuladas
  totalReferralsGenerated: number;
  totalRetentionLift: number;
  totalRevenueGenerated: number;
  averageROI: number;
  // Tendencias
  trend: {
    referralTrend: 'up' | 'down' | 'steady';
    retentionTrend: 'up' | 'down' | 'steady';
    effectivenessTrend: 'up' | 'down' | 'steady';
  };
  // Patrones identificados por IA
  aiPatterns?: {
    bestAudience?: CustomerSegmentType[]; // Segmentos que mejor responden
    optimalTiming?: string; // Timing óptimo identificado
    keySuccessFactors?: string[]; // Factores clave de éxito
    improvementOpportunities?: string[]; // Oportunidades de mejora
  };
  // Predicciones
  predictions?: {
    expectedReferrals?: number; // Referidos esperados en próxima ejecución
    expectedRetentionLift?: number; // Retención esperada
    confidence?: number; // Confianza en la predicción (0-100)
  };
  lastAnalyzed?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface InitiativePrioritization {
  id: string;
  trainerId: string;
  period: CommunityFidelizacionSnapshot['period'];
  generatedAt: string;
  // Iniciativas priorizadas
  prioritizedInitiatives: {
    initiative: CommunityActivity;
    learningData: InitiativeLearningData;
    referralImpact: InitiativeReferralImpact;
    retentionImpact: ActivityRetentionImpact;
    revenueImpact: ActivityRevenueImpact;
    priorityRank: number; // Ranking de prioridad (1 = más alta)
    priorityScore: number; // Score de prioridad (0-100)
    recommendation: 'increase' | 'maintain' | 'reduce' | 'discontinue' | 'replicate';
    reasoning: string; // Razón de la priorización
  }[];
  // Insights de IA
  aiInsights: {
    topPerformers: string[]; // IDs de iniciativas top
    emergingOpportunities: string[]; // Oportunidades emergentes
    decliningInitiatives: string[]; // Iniciativas en declive
    recommendations: {
      action: string;
      initiativeId?: string;
      reasoning: string;
      expectedImpact: string;
      priority: 'high' | 'medium' | 'low';
    }[];
    patterns: {
      pattern: string;
      description: string;
      evidence: string[];
      confidence: number;
    }[];
  };
  // Resumen
  summary: {
    totalInitiatives: number;
    highPriorityCount: number;
    averagePriorityScore: number;
    topInitiativeType?: CommunityActivityType;
    totalReferralsAttributed: number;
    totalRetentionLift: number;
  };
}

// User Story: Gamificación de la comunidad con IA (badges, retos, reconocimientos) adaptados a valores del entrenador
export type BadgeRarity = 'comun' | 'raro' | 'epico' | 'legendario';
export type BadgeCategory = 'consistencia' | 'logros' | 'hitos' | 'comunidad' | 'especial' | 'valores';
export type BadgeTriggerType = 'sesiones-completadas' | 'dias-consecutivos' | 'objetivo-alcanzado' | 'referido' | 'testimonio' | 'participacion-comunidad' | 'retos-completados' | 'valores-demonstrados' | 'custom';
export type RecognitionType = 'badge' | 'mensaje' | 'recompensa' | 'destacado' | 'liderazgo';
export type ChallengeStatus = 'draft' | 'active' | 'completed' | 'paused' | 'archived';
export type ChallengeDifficulty = 'principiante' | 'intermedio' | 'avanzado' | 'experto';

export interface CommunityBadge {
  id: string;
  name: string;
  description: string;
  icon: string; // Nombre del icono de lucide-react
  color: string; // Color del badge
  category: BadgeCategory;
  rarity: BadgeRarity;
  // Requisitos para obtener el badge
  requirements: {
    type: BadgeTriggerType;
    value: number; // Valor necesario (ej: 10 sesiones, 30 días)
    conditions?: string[]; // Condiciones adicionales
  };
  // Adaptación a valores del entrenador
  adaptedToValues?: {
    trainerValues: string[]; // Valores del entrenador relacionados
    personalizedMessage?: string; // Mensaje personalizado según valores
    alignmentScore: number; // 0-100, qué tan alineado está con los valores
  };
  // Generado por IA
  aiGenerated: boolean;
  aiMetadata?: {
    generatedAt: string;
    reasoning: string; // Razón por la que se generó este badge
    valueAlignment: string[]; // Valores que se alinean
  };
  // Configuración
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ClientBadge {
  id: string;
  badgeId: string;
  clientId: string;
  clientName: string;
  badge: CommunityBadge;
  earnedAt: string;
  // Mensaje de reconocimiento personalizado
  recognitionMessage?: string;
  // Datos del momento
  earnedContext?: {
    achievement: string; // Qué logró para ganar el badge
    milestone?: string; // Hito alcanzado
    relatedActivityId?: string; // Actividad relacionada
  };
  // Notificación
  notified: boolean;
  notifiedAt?: string;
  // Publicación
  published: boolean; // Si se publicó en comunidad
  publishedAt?: string;
}

export interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  // Tipo y dificultad
  type: ChallengeType;
  difficulty: ChallengeDifficulty;
  // Duración
  duration: number; // Duración en días
  startDate?: string;
  endDate?: string;
  // Objetivos
  objectives: string[];
  // Requisitos para completar
  requirements: {
    type: BadgeTriggerType;
    target: number; // Meta a alcanzar
    description: string;
  }[];
  // Badges y recompensas
  rewards: {
    badges?: string[]; // IDs de badges a otorgar
    rewards?: {
      type: RewardType;
      description: string;
      value?: number;
    }[];
  };
  // Adaptación a valores del entrenador
  adaptedToValues?: {
    trainerValues: string[]; // Valores del entrenador relacionados
    personalizedDescription?: string; // Descripción personalizada
    alignmentScore: number; // 0-100
  };
  // Participantes
  participants: {
    clientId: string;
    clientName: string;
    joinedAt: string;
    progress: number; // 0-100
    status: 'active' | 'completed' | 'dropped';
    completedAt?: string;
  }[];
  // Estado
  status: ChallengeStatus;
  // Generado por IA
  aiGenerated: boolean;
  aiMetadata?: {
    generatedAt: string;
    reasoning: string;
    valueAlignment: string[];
    estimatedEngagement: number; // 0-100
  };
  // Métricas
  metrics?: {
    totalParticipants: number;
    completionRate: number; // %
    averageProgress: number; // %
    engagementScore: number; // 0-100
  };
  createdAt: string;
  updatedAt?: string;
}

export interface Recognition {
  id: string;
  type: RecognitionType;
  clientId: string;
  clientName: string;
  // Contenido del reconocimiento
  title: string;
  message: string; // Mensaje personalizado adaptado a valores
  // Badge relacionado (si aplica)
  badgeId?: string;
  badge?: CommunityBadge;
  // Challenge relacionado (si aplica)
  challengeId?: string;
  challenge?: CommunityChallenge;
  // Adaptación a valores del entrenador
  adaptedToValues?: {
    trainerValues: string[]; // Valores demostrados
    personalizedTone?: string; // Tono personalizado
    keywords?: string[]; // Palabras clave a usar
    emojis?: string[]; // Emojis preferidos
  };
  // Generado por IA
  aiGenerated: boolean;
  aiMetadata?: {
    generatedAt: string;
    reasoning: string;
    valueAlignment: string[];
  };
  // Canales de publicación
  channels: ('community' | 'social' | 'email' | 'whatsapp' | 'in-app')[];
  // Estado
  status: 'pending' | 'sent' | 'published' | 'archived';
  sentAt?: string;
  publishedAt?: string;
  // Métricas
  metrics?: {
    views?: number;
    likes?: number;
    shares?: number;
    comments?: number;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface CommunityGamificationConfig {
  id: string;
  trainerId: string;
  enabled: boolean;
  // Configuración de badges
  badges: {
    enabled: boolean;
    autoAward: boolean; // Otorgar badges automáticamente
    personalizeMessages: boolean; // Personalizar mensajes según valores
    publishInCommunity: boolean; // Publicar en comunidad
  };
  // Configuración de retos
  challenges: {
    enabled: boolean;
    autoCreate: boolean; // Crear retos automáticamente con IA
    frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly';
    minAlignmentScore: number; // Score mínimo de alineación con valores (0-100)
  };
  // Configuración de reconocimientos
  recognitions: {
    enabled: boolean;
    autoGenerate: boolean; // Generar reconocimientos automáticamente
    channels: ('community' | 'social' | 'email' | 'whatsapp' | 'in-app')[];
    personalizeMessages: boolean; // Personalizar según valores
  };
  // Integración con valores del entrenador
  useTrainerValues: boolean; // Usar valores de CommunityVoiceConfig
  // Estadísticas
  stats?: {
    totalBadgesAwarded: number;
    totalChallengesCreated: number;
    totalRecognitionsSent: number;
    engagementIncrease: number; // % de aumento en engagement
  };
  lastAnalysis?: string;
  createdAt: string;
  updatedAt?: string;
}

// User Story: Recomendaciones de contenido/comunicaciones basadas en feedback reciente
export type RecommendationType = 'content' | 'communication' | 'campaign' | 'message' | 'post' | 'email' | 'whatsapp';
export type RecommendationPriority = 'high' | 'medium' | 'low';
export type RecommendationStatus = 'pending' | 'accepted' | 'rejected' | 'implemented' | 'archived';
export type FeedbackSource = 'survey' | 'testimonial' | 'review' | 'nps' | 'csat' | 'feedback-form' | 'social-media' | 'community';

export interface FeedbackAnalysis {
  id: string;
  period: CommunityFidelizacionSnapshot['period'];
  analyzedAt: string;
  // Fuentes de feedback analizadas
  sources: {
    source: FeedbackSource;
    count: number;
    sentiment: 'positive' | 'neutral' | 'negative';
    keyTopics: string[];
  }[];
  // Temas principales identificados
  keyTopics: {
    topic: string;
    frequency: number;
    sentiment: 'positive' | 'neutral' | 'negative';
    impact: 'high' | 'medium' | 'low'; // Impacto en satisfacción/engagement
    relatedFeedback: string[]; // Ejemplos de feedback relacionado
  }[];
  // Insights de IA
  aiInsights: {
    trends: string[]; // Tendencias identificadas
    opportunities: string[]; // Oportunidades identificadas
    risks: string[]; // Riesgos identificados
    recommendations: string[]; // Recomendaciones generales
  };
  // Sentimiento general
  overallSentiment: {
    positive: number; // %
    neutral: number; // %
    negative: number; // %
    score: number; // 0-100
  };
}

export interface ContentRecommendation {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
  // Basado en feedback
  basedOnFeedback: {
    feedbackIds: string[]; // IDs de feedback relacionados
    topics: string[]; // Temas del feedback
    sentiment: 'positive' | 'neutral' | 'negative';
    keyInsights: string[]; // Insights clave del feedback
  };
  // Recomendación específica
  recommendation: {
    contentType: 'post' | 'video' | 'reel' | 'story' | 'email' | 'whatsapp' | 'blog' | 'testimonial' | 'case-study';
    topic: string;
    suggestedTitle?: string;
    suggestedContent?: string; // Contenido sugerido
    suggestedCTA?: string; // Call to action sugerido
    targetAudience?: CustomerSegmentType[]; // Audiencia objetivo
    platform?: SocialPlatform; // Plataforma sugerida
    timing?: string; // Timing sugerido
  };
  // Prioridad y impacto
  priority: RecommendationPriority;
  expectedImpact: {
    engagement?: number; // % esperado de engagement
    satisfaction?: number; // % esperado de satisfacción
    retention?: number; // % esperado de retención
    description: string; // Descripción del impacto esperado
  };
  // Generado por IA
  aiGenerated: boolean;
  aiMetadata?: {
    generatedAt: string;
    reasoning: string; // Razón de la recomendación
    confidence: number; // 0-100, confianza en la recomendación
    alignmentWithFeedback: number; // 0-100, alineación con feedback
  };
  // Estado
  status: RecommendationStatus;
  acceptedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  implementedAt?: string;
  // Métricas de rendimiento (si se implementó)
  performance?: {
    views?: number;
    engagement?: number;
    conversions?: number;
    feedbackReceived?: number;
    sentiment?: 'positive' | 'neutral' | 'negative';
  };
  createdAt: string;
  updatedAt?: string;
}

export interface CommunicationRecommendation {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
  // Basado en feedback
  basedOnFeedback: {
    feedbackIds: string[]; // IDs de feedback relacionados
    topics: string[]; // Temas del feedback
    sentiment: 'positive' | 'neutral' | 'negative';
    keyInsights: string[]; // Insights clave del feedback
    clientSegment?: CustomerSegmentType; // Segmento de clientes
  };
  // Recomendación específica
  recommendation: {
    communicationType: 'email' | 'whatsapp' | 'sms' | 'in-app' | 'social' | 'community';
    subject?: string; // Asunto (para email)
    message: string; // Mensaje sugerido
    tone: 'empatico' | 'motivacional' | 'celebratorio' | 'profesional' | 'cercano';
    timing: string; // Timing sugerido
    targetAudience?: CustomerSegmentType[]; // Audiencia objetivo
    personalization?: {
      variables: string[]; // Variables a personalizar
      examples: Record<string, string>; // Ejemplos de personalización
    };
  };
  // Prioridad y impacto
  priority: RecommendationPriority;
  expectedImpact: {
    responseRate?: number; // % esperado de respuesta
    satisfaction?: number; // % esperado de satisfacción
    engagement?: number; // % esperado de engagement
    description: string; // Descripción del impacto esperado
  };
  // Generado por IA
  aiGenerated: boolean;
  aiMetadata?: {
    generatedAt: string;
    reasoning: string; // Razón de la recomendación
    confidence: number; // 0-100
    alignmentWithFeedback: number; // 0-100
  };
  // Estado
  status: RecommendationStatus;
  acceptedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  implementedAt?: string;
  // Métricas de rendimiento (si se implementó)
  performance?: {
    sent?: number;
    delivered?: number;
    opened?: number;
    clicked?: number;
    responded?: number;
    satisfaction?: number;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface ContentRecommendationsConfig {
  id: string;
  trainerId: string;
  enabled: boolean;
  // Configuración de análisis de feedback
  feedbackAnalysis: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
    sources: FeedbackSource[]; // Fuentes de feedback a analizar
    minFeedbackCount: number; // Mínimo de feedback para generar recomendaciones
  };
  // Configuración de recomendaciones de contenido
  contentRecommendations: {
    enabled: boolean;
    autoGenerate: boolean; // Generar automáticamente
    minConfidence: number; // Confianza mínima (0-100)
    maxRecommendations: number; // Máximo de recomendaciones por análisis
  };
  // Configuración de recomendaciones de comunicaciones
  communicationRecommendations: {
    enabled: boolean;
    autoGenerate: boolean; // Generar automáticamente
    minConfidence: number; // Confianza mínima (0-100)
    maxRecommendations: number; // Máximo de recomendaciones por análisis
  };
  // Estadísticas
  stats?: {
    totalRecommendationsGenerated: number;
    totalRecommendationsAccepted: number;
    totalRecommendationsImplemented: number;
    averageImpact: number; // Impacto promedio (0-100)
  };
  lastAnalysis?: string;
  createdAt: string;
  updatedAt?: string;
}

