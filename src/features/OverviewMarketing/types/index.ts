export type MarketingOverviewPeriod = '7d' | '30d' | '90d';

export type TrendDirection = 'up' | 'down' | 'neutral';

export interface KPIExpectedRange {
  min?: number; // Valor mínimo esperado
  max?: number; // Valor máximo esperado
  buyerPersonaId?: string; // Rango específico para una buyer persona
}

export interface KPIAlert {
  id: string;
  kpiId: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  currentValue: number;
  expectedRange: KPIExpectedRange;
  buyerPersonaId?: string;
  timestamp: string;
}

export interface MarketingKPI {
  id: string;
  label: string;
  value: number;
  changePercentage?: number;
  period: MarketingOverviewPeriod;
  format?: 'number' | 'currency' | 'percentage';
  target?: number;
  trendDirection: TrendDirection;
  contextualNarrative?: string; // Narrativa contextual que explica qué significa el KPI para el entrenador
  priority?: number; // Prioridad del KPI (1 = más importante)
  buyerPersonaId?: string; // ID de la buyer persona para segmentación
  expectedRange?: KPIExpectedRange; // Rango esperado para alertas
}

export interface CampaignPerformance {
  id: string;
  name: string;
  channel: string;
  objective: string;
  status: 'active' | 'paused' | 'scheduled';
  spend: number;
  budget: number;
  roas: number;
  ctr: number;
  leadsGenerated: number;
  startDate: string;
  endDate?: string;
}

export interface FunnelPerformance {
  id: string;
  name: string;
  stage: 'TOFU' | 'MOFU' | 'BOFU';
  revenue: number;
  conversionRate: number;
  velocityDays: number;
  growthPercentage: number;
}

export interface SocialGrowthMetric {
  id: string;
  network: string;
  followers: number;
  growthPercentage: number;
  engagementRate: number;
  highlight?: string;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  type: 'webinar' | 'live' | 'workshop' | 'challenge';
  status: 'draft' | 'scheduled' | 'registration_open';
  targetAudience: string;
  registrations: number;
  goal: number;
  host: string;
}

export interface AISuggestion {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  rationale: string;
  cta: string;
  adaptedTone?: ToneType; // Tono al que fue adaptada la sugerencia
}

export interface MarketingOverviewSnapshot {
  period: MarketingOverviewPeriod;
  kpis: MarketingKPI[];
  campaigns: CampaignPerformance[];
  funnels: FunnelPerformance[];
  socialGrowth: SocialGrowthMetric[];
  events: UpcomingEvent[];
  aiSuggestions: AISuggestion[];
  salesAttribution?: SalesAttributionSnapshot; // User Story 1
}

// Strategic Profile Types
export type ToneType = 'profesional' | 'motivacional' | 'cercano' | 'educativo' | 'inspirador' | 'directo';
export type SpecialtyType = 'fuerza' | 'cardio' | 'pérdida_peso' | 'ganancia_masa' | 'rehabilitación' | 'deportes_específicos' | 'bienestar_general' | 'nutrición_deportiva';
export type StrengthType = 'HIIT' | 'fuerza_funcional' | 'nutrición_holística' | 'yoga' | 'pilates' | 'crossfit' | 'running' | 'ciclismo' | 'natación' | 'rehabilitación' | 'nutrición_deportiva' | 'coaching_mindset' | 'entrenamiento_personalizado';
export type QuarterlyObjective = 'captar_leads' | 'vender_packs' | 'fidelizar';

export interface ContentPillar {
  id: string;
  name: string;
  description?: string;
}

export interface BuyerPersona {
  id: string;
  name: string;
  ageRange?: string;
  goals?: string[];
  painPoints?: string[];
  interests?: string[];
}

export interface StrategicProfile {
  tone?: ToneType;
  specialty?: SpecialtyType;
  strengths?: StrengthType[]; // Fortalezas del entrenador (múltiples)
  contentPillars?: ContentPillar[];
  buyerPersonas?: BuyerPersona[];
  completed: boolean;
}

export interface QuarterlyObjectives {
  objectives: QuarterlyObjective[];
  period: string; // e.g., "Q1-2025"
  completed: boolean;
}

// Tipos predefinidos de buyer personas comunes
export type DefaultBuyerPersonaType = 'ejecutivos' | 'madres' | 'atletas' | 'all';

export interface BuyerPersonaSegment {
  id: string;
  name: string;
  type: DefaultBuyerPersonaType | 'custom';
  description?: string;
}

// User Story 1: Sales Attribution Types
export interface SalesAttribution {
  id: string;
  sourceType: 'campaign' | 'lead_magnet' | 'content';
  sourceId: string;
  sourceName: string;
  salesRevenue: number;
  salesCount: number;
  conversionRate: number;
  averageOrderValue: number;
  roas?: number; // Return on ad spend (for campaigns)
  leadsGenerated: number;
  leadsToSalesRate: number;
  period: MarketingOverviewPeriod;
  trendDirection: TrendDirection;
  changePercentage?: number;
  channel?: string; // For campaigns
  type?: string; // For lead magnets (PDF, Calculator, etc.) and content (Post, Reel, etc.)
}

export interface SalesAttributionSnapshot {
  period: MarketingOverviewPeriod;
  totalRevenue: number;
  totalSales: number;
  attribution: SalesAttribution[];
  topPerformer: SalesAttribution | null;
  insights: string[];
}

// User Story 2: Weekly AI Strategy Types
export interface WeeklyStrategyMessage {
  id: string;
  type: 'email' | 'sms' | 'push';
  subject?: string; // For email
  content: string;
  targetAudience: string;
  sendDate: string;
  status: 'draft' | 'scheduled' | 'sent';
  estimatedImpact: 'high' | 'medium' | 'low';
}

export interface WeeklyStrategyFunnel {
  id: string;
  name: string;
  description: string;
  stage: 'TOFU' | 'MOFU' | 'BOFU';
  recommendedAction: string;
  estimatedRevenue: number;
  estimatedConversion: number;
  priority: number;
  status: 'draft' | 'ready' | 'active';
}

export interface WeeklyStrategyPost {
  id: string;
  platform: 'instagram' | 'linkedin' | 'tiktok' | 'facebook';
  type: 'post' | 'reel' | 'story' | 'carousel';
  caption: string;
  hashtags: string[];
  suggestedImage?: string;
  publishDate: string;
  status: 'draft' | 'scheduled' | 'published';
  estimatedEngagement: number;
  estimatedReach: number;
}

export interface WeeklyAIStrategy {
  id: string;
  weekStartDate: string;
  weekEndDate: string;
  generatedAt: string;
  strategicFocus: string;
  objectives: string[];
  messages: WeeklyStrategyMessage[];
  funnels: WeeklyStrategyFunnel[];
  posts: WeeklyStrategyPost[];
  expectedResults: {
    estimatedRevenue: number;
    estimatedLeads: number;
    estimatedEngagement: number;
  };
  personalizationBasedOn: {
    strategicProfile?: StrategicProfile;
    quarterlyObjectives?: QuarterlyObjectives;
    performanceData?: string;
  };
  status: 'draft' | 'approved' | 'executing' | 'completed';
  executionProgress: number; // 0-100
}

// User Story: Playbooks de Sugerencias
export interface SuggestionPlaybook {
  id: string;
  name: string;
  description?: string;
  suggestions: AISuggestion[];
  createdAt: string;
  updatedAt: string;
  isRecurring: boolean; // Si es true, se puede reutilizar en futuros periodos
  tags?: string[];
  period?: MarketingOverviewPeriod; // Periodo original cuando se creó
}

// User Story 1: Content Repower - Contenido a repotenciar según rendimiento y estilo
export interface ContentToRepower {
  id: string;
  title: string;
  type: 'post' | 'reel' | 'story' | 'carousel' | 'lead_magnet' | 'campaign' | 'email';
  platform?: 'instagram' | 'linkedin' | 'tiktok' | 'facebook' | 'email';
  originalDate: string;
  performance: {
    engagement?: number;
    reach?: number;
    leadsGenerated?: number;
    salesRevenue?: number;
    conversionRate?: number;
    roas?: number;
    score: number; // Puntuación de rendimiento (0-100)
  };
  styleMatch: {
    toneMatch: number; // 0-100, qué tan bien coincide con el tono del entrenador
    strengthMatch: string[]; // Fortalezas que coinciden con este contenido
    personaMatch?: string; // Buyer persona que mejor responde
  };
  recommendation: {
    reason: string; // Por qué se recomienda repotenciar
    suggestedAction: string; // Qué hacer con este contenido
    expectedImpact: 'high' | 'medium' | 'low';
    suggestedChannels?: string[]; // Canales donde repotenciar
  };
  contentUrl?: string; // URL o referencia al contenido original
}

export interface ContentRepowerSnapshot {
  period: MarketingOverviewPeriod;
  contents: ContentToRepower[];
  topPerformer: ContentToRepower | null;
  insights: string[];
  totalPotentialImpact: {
    estimatedLeads: number;
    estimatedRevenue: number;
    estimatedEngagement: number;
  };
}

// User Story 2: Create Funnel/Campaign from Insight
export interface InsightSource {
  type: 'suggestion' | 'attribution' | 'kpi' | 'content';
  id: string;
  title: string;
  description: string;
  data?: any; // Datos adicionales del insight
}

export interface FunnelCampaignDraft {
  id: string;
  name: string;
  type: 'funnel' | 'campaign';
  source: InsightSource;
  stage?: 'TOFU' | 'MOFU' | 'BOFU';
  channel?: string;
  objective?: string;
  budget?: number;
  targetAudience?: string;
  description?: string;
  status: 'draft' | 'saved';
  createdAt: string;
}

// User Story 1: Hot Leads for Dashboard
export interface HotLead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  score: number; // 0-100
  probability: number; // 0-100, probabilidad de conversión
  source: string; // 'instagram' | 'whatsapp' | 'referido' | etc.
  lastInteraction?: string; // Fecha de última interacción
  lastInteractionType?: string; // Tipo de última interacción
  status: string; // Estado del lead
  tags?: string[];
  assignedTo?: string;
  preferredChannel?: 'instagram' | 'whatsapp' | 'email' | 'phone';
  urgency: 'high' | 'medium' | 'low'; // Urgencia basada en tiempo sin contacto
}

export interface HotLeadsSnapshot {
  leads: HotLead[];
  totalCount: number;
  highUrgencyCount: number;
  lastUpdated: string;
}

// User Story 2: Share Weekly Summary with Team
export type TeamMemberRole = 'community_manager' | 'nutricionista' | 'entrenador' | 'otro';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamMemberRole;
  avatar?: string;
}

export interface WeeklySummaryShare {
  id: string;
  strategyId: string;
  sharedBy: string; // ID del entrenador que comparte
  sharedByName: string;
  sharedAt: string;
  recipients: TeamMember[];
  message?: string; // Mensaje personalizado al compartir
  status: 'sent' | 'viewed' | 'acknowledged';
  viewedBy?: string[]; // IDs de quienes han visto
  acknowledgedBy?: string[]; // IDs de quienes han confirmado recibido
}

// User Story 1: Forecast Automatizado de Leads e Ingresos
export interface CampaignForecast {
  campaignId: string;
  campaignName: string;
  channel: string;
  currentLeads: number;
  currentRevenue: number;
  forecastedLeads: number; // Leads proyectados
  forecastedRevenue: number; // Ingresos proyectados
  forecastPeriod: '7d' | '14d' | '30d' | '60d' | '90d';
  confidence: 'high' | 'medium' | 'low'; // Nivel de confianza del forecast
  growthRate: number; // Tasa de crecimiento proyectada (%)
  trendDirection: TrendDirection;
  recommendations?: string[]; // Recomendaciones para ajustar recursos
}

export interface ForecastSnapshot {
  period: MarketingOverviewPeriod;
  forecastPeriod: '7d' | '14d' | '30d' | '60d' | '90d';
  totalForecastedLeads: number;
  totalForecastedRevenue: number;
  currentTotalLeads: number;
  currentTotalRevenue: number;
  growthPercentage: number; // Crecimiento proyectado
  campaigns: CampaignForecast[];
  resourceRecommendations: {
    capacityAdjustment: 'increase' | 'decrease' | 'maintain';
    message: string;
    suggestedCapacity?: number; // Cupos sugeridos
  };
  insights: string[];
  generatedAt: string;
}

// User Story 2: Roadmap IA de Activaciones Sugeridas
export type ActivationType = 'reto' | 'colaboracion' | 'live' | 'webinar' | 'workshop' | 'challenge';

export interface SuggestedActivation {
  id: string;
  type: ActivationType;
  title: string;
  description: string;
  suggestedDate: string; // Fecha sugerida para la activación
  priority: 'high' | 'medium' | 'low';
  estimatedImpact: {
    leads?: number;
    engagement?: number;
    revenue?: number;
    reach?: number;
  };
  rationale: string; // Por qué se sugiere esta activación
  targetAudience: string;
  duration?: string; // Duración estimada (ej: "5 días", "1 hora")
  preparationTime?: string; // Tiempo de preparación necesario
  relatedCampaigns?: string[]; // IDs de campañas relacionadas
  status: 'suggested' | 'scheduled' | 'completed' | 'dismissed';
  consistencyScore?: number; // 0-100, qué tan bien mantiene la consistencia
}

export interface AIRoadmapSnapshot {
  period: MarketingOverviewPeriod;
  roadmapPeriod: '30d' | '60d' | '90d'; // Período del roadmap
  activations: SuggestedActivation[];
  consistencyScore: number; // Score general de consistencia (0-100)
  insights: string[];
  recommendations: string[]; // Recomendaciones para mantener consistencia
  generatedAt: string;
  nextSuggestedActivation?: SuggestedActivation; // Próxima activación recomendada
}

// User Story 1: Alertas de Huecos Críticos en Calendario de Marketing
export interface MarketingCalendarGap {
  id: string;
  date: string; // Fecha del hueco
  gapType: 'content' | 'campaign' | 'event' | 'social_post' | 'email';
  severity: 'critical' | 'warning' | 'info';
  duration: number; // Duración del hueco en días
  description: string;
  impact: {
    estimatedLeads?: number;
    estimatedRevenue?: number;
    estimatedEngagement?: number;
  };
  suggestedActions: AISuggestion[]; // Sugerencias IA para rellenar el hueco
  context?: {
    previousActivity?: string; // Última actividad antes del hueco
    nextActivity?: string; // Próxima actividad después del hueco
    historicalPattern?: string; // Patrón histórico en esta fecha
  };
}

export interface MarketingCalendarGapsSnapshot {
  period: MarketingOverviewPeriod;
  gaps: MarketingCalendarGap[];
  criticalGapsCount: number;
  totalGapsCount: number;
  insights: string[];
  generatedAt: string;
}

// User Story 2: Sistema de Aprendizaje basado en Feedback
export type SuggestionAction = 'accept' | 'reject' | 'dismiss' | 'modify';

export interface SuggestionFeedback {
  id: string;
  suggestionId: string;
  suggestionType: 'ai_suggestion' | 'weekly_strategy' | 'activation' | 'content_repower';
  action: SuggestionAction;
  timestamp: string;
  reason?: string; // Razón opcional para rechazo/modificación
  modifiedData?: Partial<AISuggestion | WeeklyAIStrategy | SuggestedActivation>; // Si se modificó, datos modificados
  context?: {
    period?: MarketingOverviewPeriod;
    buyerPersona?: string;
    strategicProfile?: Partial<StrategicProfile>;
    quarterlyObjectives?: Partial<QuarterlyObjectives>;
  };
}

export interface LearningProfile {
  trainerId: string;
  preferences: {
    preferredImpact: ('high' | 'medium' | 'low')[];
    preferredChannels: string[];
    preferredContentTypes: string[];
    rejectedPatterns: string[]; // Patrones que el entrenador rechaza frecuentemente
    acceptedPatterns: string[]; // Patrones que el entrenador acepta frecuentemente
  };
  feedbackHistory: SuggestionFeedback[];
  accuracyScore: number; // 0-100, qué tan precisa es la IA para este entrenador
  lastUpdated: string;
}

export interface LearningInsights {
  totalFeedback: number;
  acceptanceRate: number; // % de sugerencias aceptadas
  rejectionRate: number; // % de sugerencias rechazadas
  topAcceptedTypes: Array<{ type: string; count: number; percentage: number }>;
  topRejectedTypes: Array<{ type: string; count: number; percentage: number }>;
  commonRejectionReasons: Array<{ reason: string; count: number }>;
  improvementSuggestions: string[]; // Sugerencias para mejorar la precisión
}

// User Story 1: Registrar Experimentos y su Impacto en KPIs
export type ExperimentStatus = 'draft' | 'active' | 'completed' | 'cancelled';

export interface ExperimentKPIImpact {
  kpiId: string;
  kpiLabel: string;
  beforeValue: number;
  afterValue: number;
  changePercentage: number;
  changeDirection: TrendDirection;
  notes?: string;
}

export interface MarketingExperiment {
  id: string;
  name: string;
  description: string;
  hypothesis: string; // Qué se espera lograr
  type: 'campaign' | 'content' | 'funnel' | 'email' | 'social' | 'other';
  startDate: string;
  endDate?: string;
  status: ExperimentStatus;
  kpiImpacts: ExperimentKPIImpact[];
  results: {
    success: boolean; // Si el experimento fue exitoso
    shouldRepeat: boolean; // Si se recomienda repetir
    keyLearnings: string[]; // Aprendizajes clave
    notes?: string;
  };
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface ExperimentsSnapshot {
  experiments: MarketingExperiment[];
  totalCount: number;
  activeCount: number;
  completedCount: number;
  successfulCount: number;
  topPerformingExperiments: MarketingExperiment[]; // Top 3 experimentos más exitosos
  insights: string[];
  lastUpdated: string;
}

// User Story 2: Tips IA cuando una métrica cae
export type MetricDropSeverity = 'critical' | 'warning' | 'moderate';

export interface MetricDropTip {
  id: string;
  kpiId: string;
  kpiLabel: string;
  currentValue: number;
  previousValue: number;
  dropPercentage: number;
  severity: MetricDropSeverity;
  tip: string; // Tip específico de IA
  actionItems: string[]; // Acciones concretas a realizar
  expectedImpact: 'high' | 'medium' | 'low';
  adaptedToStyle: {
    tone?: ToneType;
    specialty?: SpecialtyType;
    strengths?: StrengthType[];
  }; // Cómo está adaptado al estilo del entrenador
  rationale: string; // Por qué este tip es efectivo
  relatedExperiments?: string[]; // IDs de experimentos relacionados que funcionaron
  priority: number; // 1 = más urgente
  createdAt: string;
}

export interface MetricDropTipsSnapshot {
  tips: MetricDropTip[];
  totalCount: number;
  criticalCount: number;
  warningCount: number;
  moderateCount: number;
  insights: string[];
  lastUpdated: string;
}






