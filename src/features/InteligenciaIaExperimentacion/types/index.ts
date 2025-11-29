export type IntelligenceMetricColor =
  | 'primary'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger';

export type MetricTrendDirection = 'up' | 'down' | 'neutral';

export interface IntelligenceMetricTrend {
  value: number;
  direction: MetricTrendDirection;
  label?: string;
}

export interface IntelligenceMetric {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  trend?: IntelligenceMetricTrend;
  color: IntelligenceMetricColor;
}

export type PlaybookStatus = 'active' | 'draft' | 'paused' | 'archived';

// User Story 2: Ownership status for insights and playbooks
export type OwnershipStatus = 'assigned' | 'in_progress' | 'completed' | 'blocked' | 'cancelled';

// User Story 1: Playbooks IA completos (estrategia, copy, assets, medición)
export interface PlaybookStrategy {
  overview: string; // Descripción general de la estrategia
  targetAudience: string; // Audiencia objetivo
  goals: string[]; // Objetivos específicos
  keyMessages: string[]; // Mensajes clave
  timeline: {
    phase: string;
    duration: string;
    description: string;
  }[];
  channels: {
    channel: string;
    role: string; // Rol del canal en la estrategia
    frequency: string;
  }[];
}

export interface PlaybookCopy {
  channel: string;
  contentType: string; // Tipo de contenido (email, sms, social post, etc.)
  subject?: string; // Para emails
  headline?: string; // Para contenido visual
  body: string; // Cuerpo del mensaje
  cta?: string; // Call to action
  tone: string; // Tono adaptado al estilo del entrenador
  personalization?: {
    type: string; // Tipo de personalización
    variables: string[]; // Variables a personalizar
  };
}

export interface PlaybookAsset {
  id: string;
  type: 'image' | 'video' | 'document' | 'template' | 'link';
  name: string;
  description: string;
  url?: string; // URL del asset o template
  channel: string; // Canal donde se usa
  dimensions?: string; // Para imágenes/videos
  format?: string; // Formato del archivo
  generated?: boolean; // Si fue generado por IA
}

export interface PlaybookMeasurement {
  primaryMetric: string; // Métrica principal a medir
  secondaryMetrics: string[]; // Métricas secundarias
  kpis: {
    name: string;
    target: number;
    current?: number;
    unit: string;
  }[];
  tracking: {
    method: string; // Método de seguimiento
    tools: string[]; // Herramientas de seguimiento
    frequency: string; // Frecuencia de medición
  };
  reporting: {
    frequency: string; // Frecuencia de reportes
    recipients: string[]; // Quienes reciben los reportes
    format: string; // Formato del reporte
  };
}

export interface PlaybookRecord {
  id: string;
  name: string;
  objective: string;
  channels: string[];
  owner: string;
  ownerName?: string; // User Story 2: Nombre del dueño
  ownerId?: string; // User Story 2: ID del dueño
  status: PlaybookStatus;
  impact: 'Alto' | 'Medio' | 'Bajo';
  // User Story 1: Campos adicionales para playbooks completos
  strategy?: PlaybookStrategy; // Estrategia completa
  copies?: PlaybookCopy[]; // Copy adaptado por canal
  assets?: PlaybookAsset[]; // Assets generados o sugeridos
  measurement?: PlaybookMeasurement; // Plan de medición
  // Adaptación al estilo y audiencia del entrenador
  adaptedToTrainer?: {
    trainerStyle: string; // Estilo del entrenador
    targetAudience: string; // Audiencia adaptada
    tone: string; // Tono adaptado
    differentiation: string[]; // Diferenciadores aplicados
  };
  // User Story 2: Campos para seguimiento de progreso
  ownershipStatus?: OwnershipStatus;
  progress?: number; // 0-100
  dueDate?: string;
  assignedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  sourceInsightId?: string; // ID del insight que originó este playbook (User Story 2)
}

export type FeedbackStatus = 'active' | 'scheduled' | 'paused';

export interface FeedbackLoopRecord {
  id: string;
  title: string;
  audience: string;
  lastRun: string;
  responseRate: number;
  status: FeedbackStatus;
}

export type ExperimentStatus = 'running' | 'planned' | 'completed' | 'paused';

// User Story 1: Seguimiento automático de experimentos con insights comprensibles
export type ScalingRecommendation = 'scale' | 'optimize' | 'stop' | 'test-more';

export interface ExperimentInsight {
  id: string;
  experimentId: string;
  summary: string; // Resumen en lenguaje claro de los resultados
  keyFindings: string[]; // Hallazgos clave traducidos a lenguaje comprensible
  performanceAnalysis: {
    metric: string;
    value: number;
    change: number; // Cambio porcentual
    interpretation: string; // Interpretación en lenguaje claro
  }[];
  recommendation: ScalingRecommendation;
  recommendationReason: string; // Razón de la recomendación en lenguaje claro
  confidence: number; // 0-100, nivel de confianza en la recomendación
  nextSteps: string[]; // Próximos pasos sugeridos
  generatedAt: string;
}

// User Story 2: Lecciones aprendidas de experimentos
export interface ExperimentLesson {
  id: string;
  experimentId: string;
  experimentName: string;
  category: 'success' | 'failure' | 'insight' | 'methodology';
  title: string;
  description: string; // Descripción detallada de la lección
  tags: string[]; // Tags para categorizar (ej: 'timing', 'audience', 'content')
  impact: 'high' | 'medium' | 'low'; // Impacto de la lección
  applicableTo: string[]; // Tipos de experimentos donde aplica
  recordedAt: string;
  recordedBy?: string; // ID del entrenador que registró la lección
}

export interface ExperimentRecord {
  id: string;
  name: string;
  hypothesis: string;
  status: ExperimentStatus;
  primaryMetric: string;
  uplift: number | null;
  // User Story 1: Insights automáticos traducidos
  insight?: ExperimentInsight;
  // User Story 2: Lecciones aprendidas
  lessons?: ExperimentLesson[];
}

export type InsightSeverity = 'low' | 'medium' | 'high';

export interface IntelligenceInsight {
  id: string;
  title: string;
  description: string;
  source: string;
  severity: InsightSeverity;
  // User Story 2: Campos para transformar insight en playbook
  canConvertToPlaybook?: boolean; // Si el insight puede convertirse en playbook
  playbookSuggestion?: {
    suggestedName: string;
    suggestedObjective: string;
    suggestedChannels: string[];
    estimatedImpact: 'Alto' | 'Medio' | 'Bajo';
  };
  // User Story 2: Campos para asignación de dueños y seguimiento
  ownerId?: string;
  ownerName?: string;
  ownershipStatus?: OwnershipStatus;
  progress?: number; // 0-100
  dueDate?: string;
  assignedAt?: string;
}

export interface TopCampaign {
  id: string;
  name: string;
  channel: string;
  conversionRate: number;
  revenue: number;
  engagementRate: number;
  sent: number;
  converted: number;
}

export interface UpcomingSend {
  id: string;
  name: string;
  type: 'campaign' | 'playbook' | 'automation' | 'scheduled_message';
  scheduledDate: string; // ISO date string
  channel: string;
  recipientCount: number;
  status: 'scheduled' | 'pending';
}

export interface Objective {
  id: string;
  name: string;
  currentValue: number;
  targetValue: number;
  unit?: string;
}

export interface CampaignPerformanceMetric {
  type: 'roi' | 'customers';
  value: number;
  previousMonthValue: number;
  percentageChange: number;
  label: string;
  unit?: string;
}

export interface SectorTrend {
  id: string;
  category: 'strategy' | 'timing' | 'content';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
}

export interface SectorTrendsData {
  successfulStrategies: SectorTrend[];
  bestPostingTimes: SectorTrend[];
  topContentTypes: SectorTrend[];
}

export interface IntelligenceOverviewResponse {
  metrics: IntelligenceMetric[];
  playbooks: PlaybookRecord[];
  feedbackLoops: FeedbackLoopRecord[];
  experiments: ExperimentRecord[];
  insights: IntelligenceInsight[];
  topCampaigns?: TopCampaign[];
  upcomingSends?: UpcomingSend[];
  objectives?: Objective[];
  campaignPerformanceMetric?: CampaignPerformanceMetric;
  sectorTrends?: SectorTrendsData;
}

// User Story: Pilares Estratégicos
export type DecisionStyle = 'rapido' | 'basado-en-datos' | 'iterativo';

export interface StrategicPillars {
  mission: string;
  differentiators: string[];
  availableResources: string[];
  budget?: string;
  tools?: string[];
  objectives?: string[];
  limitations?: string[];
}

export interface IntelligenceProfile {
  trainerId: string;
  strategicPillars: StrategicPillars;
  decisionStyle: DecisionStyle;
  updatedAt?: string;
}

// User Story 1: AI Overview - Conecta datos de marketing, comunidad y ventas en lenguaje claro
export interface MarketingData {
  totalRevenue: number;
  totalLeads: number;
  conversionRate: number;
  activeCampaigns: number;
  topPerformingChannel: string;
  revenueGrowth: number;
  leadsGrowth: number;
}

export interface CommunityData {
  activeMembers: number;
  engagementRate: number;
  nps: number;
  testimonialsCollected: number;
  advocatesCount: number;
  retentionLift: number;
  participationRate: number;
}

export interface SalesData {
  totalSales: number;
  averageOrderValue: number;
  conversionRate: number;
  pipelineValue: number;
  closedDeals: number;
  salesGrowth: number;
}

export interface AIOverviewNarrative {
  id: string;
  category: 'marketing' | 'community' | 'sales' | 'integrated';
  title: string;
  narrative: string; // Lenguaje claro que explica qué está pasando
  sentiment: 'positive' | 'neutral' | 'warning' | 'critical';
  keyMetrics: string[]; // Métricas clave que respaldan la narrativa
  recommendations?: string[]; // Recomendaciones basadas en los datos
  timestamp: string;
}

export interface AIOverviewResponse {
  marketing: MarketingData;
  community: CommunityData;
  sales: SalesData;
  narratives: AIOverviewNarrative[];
  summary: string; // Resumen ejecutivo en lenguaje claro
  period: '7d' | '30d' | '90d';
  updatedAt: string;
}

// User Story 2: AI Prioritization - Matriz Impacto/Esfuerzo basada en recursos
export type ImpactLevel = 'alto' | 'medio' | 'bajo';
export type EffortLevel = 'alto' | 'medio' | 'bajo';
export type PriorityQuadrant = 'quick-wins' | 'major-projects' | 'fill-ins' | 'thankless-tasks';

export interface ResourceConstraint {
  id: string;
  type: 'time' | 'budget' | 'team' | 'tools' | 'skills';
  name: string;
  available: number;
  unit: string;
  description: string;
}

export interface PrioritizedAction {
  id: string;
  title: string;
  description: string;
  category: 'marketing' | 'community' | 'sales' | 'operations' | 'content';
  impact: ImpactLevel;
  effort: EffortLevel;
  quadrant: PriorityQuadrant;
  estimatedImpact: string; // Descripción del impacto esperado
  estimatedEffort: string; // Descripción del esfuerzo requerido
  requiredResources: ResourceConstraint[];
  estimatedTime?: number; // En horas
  estimatedCost?: number; // En moneda
  priorityScore: number; // Score calculado (0-100)
  reasoning: string; // Explicación de por qué está priorizado así
  status: 'recommended' | 'in-progress' | 'completed' | 'deferred';
  canExecute: boolean; // Basado en recursos disponibles
  blocker?: string; // Si no se puede ejecutar, qué falta
}

export interface AIPrioritizationResponse {
  actions: PrioritizedAction[];
  resources: ResourceConstraint[];
  period: '7d' | '30d' | '90d';
  updatedAt: string;
  summary: {
    quickWins: number;
    majorProjects: number;
    fillIns: number;
    thanklessTasks: number;
    recommendedActions: number;
  };
}

// User Story 1: Generar playbook IA completo
export interface GenerateCompletePlaybookRequest {
  objective: string;
  targetAudience?: string; // Si no se proporciona, se usa la audiencia del perfil del entrenador
  channels?: string[]; // Si no se proporciona, se usan los canales preferidos del entrenador
  trainerId?: string; // Para adaptar al estilo del entrenador
  customRequirements?: string[]; // Requisitos adicionales
}

export interface GenerateCompletePlaybookResponse {
  playbook: PlaybookRecord;
  success: boolean;
  message?: string;
}

// User Story 2: Transformar insight en playbook
export interface ConvertInsightToPlaybookRequest {
  insight: IntelligenceInsight; // Insight completo para convertir
  trainerId?: string; // Para adaptar al estilo del entrenador
  customChannels?: string[]; // Canales personalizados (opcional)
  customObjective?: string; // Objetivo personalizado (opcional)
}

export interface ConvertInsightToPlaybookResponse {
  playbook: PlaybookRecord;
  success: boolean;
  message?: string;
}

// User Story 1: Compartir playbooks con equipo
export type TeamMemberRole = 'community_manager' | 'nutricionista' | 'entrenador' | 'marketing_manager' | 'otro';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamMemberRole;
  avatar?: string;
  isActive?: boolean;
}

export interface PlaybookShare {
  id: string;
  playbookId: string;
  sharedBy: string; // ID del entrenador que comparte
  sharedByName: string;
  sharedAt: string;
  recipients: TeamMember[];
  message?: string; // Mensaje personalizado al compartir
  status: 'sent' | 'viewed' | 'acknowledged';
  viewedBy?: string[]; // IDs de quienes han visto
  acknowledgedBy?: string[]; // IDs de quienes han confirmado recibido
  accessLevel?: 'view' | 'edit' | 'execute'; // Nivel de acceso al playbook
}

export interface SharePlaybookRequest {
  playbookId: string;
  teamMemberIds: string[];
  message?: string;
  accessLevel?: 'view' | 'edit' | 'execute';
}

export interface SharePlaybookResponse {
  success: boolean;
  message?: string;
  share: PlaybookShare;
}

// User Story 2: Experimentos sugeridos por IA
export interface AIExperimentSuggestion {
  id: string;
  name: string;
  hypothesis: string;
  description: string;
  experimentType: 'tone' | 'content' | 'timing' | 'channel' | 'audience' | 'cta';
  variants: {
    id: string;
    name: string;
    description: string;
    example?: string;
  }[];
  primaryMetric: string;
  estimatedImpact: 'Alto' | 'Medio' | 'Bajo';
  estimatedEffort: 'Bajo' | 'Medio' | 'Alto';
  reasoning: string; // Por qué se sugiere este experimento
  basedOnData: {
    trainerStyle?: string;
    historicalPerformance?: string;
    audiencePreferences?: string;
    marketTrends?: string;
  };
  suggestedDuration?: number; // En días
  expectedUplift?: number; // Porcentaje esperado de mejora
  priority: number; // 1-10, mayor = más prioritario
  canCreate?: boolean; // Si se puede crear el experimento directamente
}

export interface GetAIExperimentSuggestionsRequest {
  trainerId?: string;
  period?: '7d' | '30d' | '90d';
  experimentTypes?: AIExperimentSuggestion['experimentType'][];
  limit?: number;
}

export interface GetAIExperimentSuggestionsResponse {
  suggestions: AIExperimentSuggestion[];
  total: number;
  generatedAt: string;
  basedOn: {
    trainerProfile?: boolean;
    historicalData?: boolean;
    marketTrends?: boolean;
  };
}

export interface CreateExperimentFromSuggestionRequest {
  suggestionId: string;
  name?: string; // Nombre personalizado (opcional)
  variants?: string[]; // IDs de las variantes a incluir
  primaryMetric?: string;
  duration?: number; // En días
}

export interface CreateExperimentFromSuggestionResponse {
  experiment: ExperimentRecord;
  success: boolean;
  message?: string;
}

// User Story 1: Seguimiento automático de experimentos con insights comprensibles
export interface GetExperimentInsightRequest {
  experimentId: string;
}

export interface GetExperimentInsightResponse {
  insight: ExperimentInsight;
  success: boolean;
  message?: string;
}

// User Story 2: Registrar lecciones aprendidas
export interface RecordExperimentLessonRequest {
  experimentId: string;
  category: ExperimentLesson['category'];
  title: string;
  description: string;
  tags?: string[];
  impact?: ExperimentLesson['impact'];
  applicableTo?: string[];
}

export interface RecordExperimentLessonResponse {
  lesson: ExperimentLesson;
  success: boolean;
  message?: string;
}

export interface GetExperimentLessonsRequest {
  experimentId?: string; // Si no se proporciona, retorna todas las lecciones
  category?: ExperimentLesson['category'];
  tags?: string[];
  limit?: number;
}

export interface GetExperimentLessonsResponse {
  lessons: ExperimentLesson[];
  total: number;
  retrievedAt: string;
}

export interface GetRelevantLessonsForExperimentRequest {
  experimentType?: string;
  hypothesis?: string;
  tags?: string[];
  limit?: number;
}

export interface GetRelevantLessonsForExperimentResponse {
  lessons: ExperimentLesson[];
  total: number;
  reasoning: string; // Por qué estas lecciones son relevantes
  retrievedAt: string;
}

// User Story 1: Motor de personalización IA que construye journeys según atributos del lead
export type FitnessGoal = 
  | 'perdida-peso'
  | 'ganancia-masa-muscular'
  | 'mejora-resistencia'
  | 'tonificacion'
  | 'salud-general'
  | 'preparacion-deportiva'
  | 'rehabilitacion'
  | 'flexibilidad-movilidad';

export type Motivator = 
  | 'salud-prevencion'
  | 'apariencia-estetica'
  | 'rendimiento-deportivo'
  | 'bienestar-mental'
  | 'presion-social'
  | 'competencia-personal'
  | 'recomendacion-medica'
  | 'evento-especial';

export interface LeadAttributes {
  fitnessGoal: FitnessGoal;
  motivators: Motivator[];
  experienceLevel?: 'principiante' | 'intermedio' | 'avanzado';
  availableTime?: number; // Horas por semana
  preferences?: string[]; // Preferencias adicionales
  constraints?: string[]; // Restricciones o limitaciones
}

export interface JourneyStep {
  id: string;
  stepNumber: number;
  name: string;
  description: string;
  channel: 'email' | 'sms' | 'whatsapp' | 'in-app' | 'push' | 'social';
  trigger: string; // Cuándo se activa este paso
  content: {
    subject?: string; // Para emails
    message: string;
    cta?: string;
    personalizationVariables: string[];
  };
  delay?: number; // Días desde el paso anterior
  conditions?: string[]; // Condiciones para ejecutar este paso
}

export interface PersonalizedJourney {
  id: string;
  name: string;
  description: string;
  leadAttributes: LeadAttributes;
  steps: JourneyStep[];
  estimatedDuration: number; // Días
  expectedOutcome: string;
  personalizationLevel: 'bajo' | 'medio' | 'alto';
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'active' | 'paused' | 'archived';
  metrics?: {
    leadsEnrolled: number;
    completionRate: number;
    conversionRate: number;
  };
}

export interface GeneratePersonalizedJourneyRequest {
  leadAttributes: LeadAttributes;
  trainerId?: string;
  customRequirements?: string[];
}

export interface GeneratePersonalizedJourneyResponse {
  journey: PersonalizedJourney;
  success: boolean;
  message?: string;
}

// User Story 2: Detección de micro-segmentos emergentes y sugerencia de ofertas
export interface MicroSegment {
  id: string;
  name: string;
  description: string;
  characteristics: string[]; // Características que definen el segmento
  size: number; // Número de leads/clientes en este segmento
  growthRate: number; // Tasa de crecimiento del segmento (%)
  trend: 'emerging' | 'growing' | 'stable' | 'declining';
  detectedAt: string;
  confidence: number; // 0-100, nivel de confianza en la detección
  examples?: string[]; // Ejemplos de leads/clientes en este segmento
  similarSegments?: string[]; // IDs de segmentos similares
}

export interface OfferSuggestion {
  id: string;
  segmentId: string;
  segmentName: string;
  offerName: string;
  offerDescription: string;
  offerType: 'descuento' | 'paquete' | 'servicio-premium' | 'trial' | 'bonus';
  offerDetails: {
    discount?: number; // Porcentaje de descuento
    packageDetails?: string;
    trialDuration?: number; // Días
    bonusContent?: string;
  };
  rationale: string; // Por qué esta oferta es adecuada para este segmento
  expectedConversionRate: number; // Tasa de conversión esperada (%)
  expectedRevenue: number; // Ingresos esperados
  priority: 'alta' | 'media' | 'baja';
  canCreateCampaign: boolean;
  suggestedChannels: string[];
  createdAt: string;
}

export interface DetectMicroSegmentsRequest {
  trainerId?: string;
  minSegmentSize?: number; // Tamaño mínimo del segmento
  lookbackPeriod?: '7d' | '30d' | '90d';
}

export interface DetectMicroSegmentsResponse {
  segments: MicroSegment[];
  total: number;
  detectedAt: string;
  success: boolean;
  message?: string;
}

export interface GetOfferSuggestionsRequest {
  segmentId?: string; // Si se proporciona, solo sugerencias para este segmento
  trainerId?: string;
  limit?: number;
}

export interface GetOfferSuggestionsResponse {
  suggestions: OfferSuggestion[];
  total: number;
  generatedAt: string;
  success: boolean;
  message?: string;
}

// User Story 1: Impacto de la personalización en métricas clave (reservas, retención)
export interface PersonalizationBookingImpact {
  personalized: number; // Número de reservas con personalización
  nonPersonalized: number; // Número de reservas sin personalización
  increasePercentage: number; // Incremento porcentual
  conversionRatePersonalized: number; // Tasa de conversión con personalización
  conversionRateNonPersonalized: number; // Tasa de conversión sin personalización
  bookingLift: number; // Incremento en reservas (en número)
}

export interface PersonalizationRetentionImpact {
  retentionRatePersonalized: number; // Tasa de retención con personalización (%)
  retentionRateNonPersonalized: number; // Tasa de retención sin personalización (%)
  retentionLift: number; // Incremento en retención (puntos porcentuales)
  churnRatePersonalized: number; // Tasa de abandono con personalización (%)
  churnRateNonPersonalized: number; // Tasa de abandono sin personalización (%)
  churnReduction: number; // Reducción en abandono (puntos porcentuales)
  retentionPeriod: '30d' | '90d' | '180d' | '365d'; // Período de análisis
}

export interface PersonalizationROI {
  investment: number; // Inversión en personalización (costos)
  revenueGenerated: number; // Ingresos generados por personalización
  bookingsRevenue: number; // Ingresos por reservas adicionales
  retentionRevenue: number; // Ingresos por retención mejorada
  roi: number; // Return on Investment (retorno sobre inversión)
  roiPercentage: number; // ROI en porcentaje
  paybackPeriod: number; // Período de recuperación (en meses)
  breakevenPoint: string; // Punto de equilibrio
}

export interface PersonalizationMetricImpact {
  metricId: string;
  metricName: string; // Nombre de la métrica (ej: "Reservas", "Retención", "NPS")
  beforeValue: number; // Valor antes de la personalización
  afterValue: number; // Valor después de la personalización
  change: number; // Cambio absoluto
  changePercentage: number; // Cambio porcentual
  trendDirection: MetricTrendDirection; // Dirección de la tendencia
  significance: 'high' | 'medium' | 'low'; // Significancia del impacto
  period: '7d' | '30d' | '90d' | '180d' | '365d'; // Período de análisis
}

export interface PersonalizationImpactSnapshot {
  period: '7d' | '30d' | '90d' | '180d' | '365d';
  bookings: PersonalizationBookingImpact;
  retention: PersonalizationRetentionImpact;
  roi: PersonalizationROI;
  metrics: PersonalizationMetricImpact[];
  summary: string; // Resumen en lenguaje claro del impacto
  insights: string[]; // Insights clave sobre el impacto
  recommendations: string[]; // Recomendaciones para justificar inversión
  generatedAt: string;
  lastUpdated: string;
}

export interface GetPersonalizationImpactRequest {
  period?: '7d' | '30d' | '90d' | '180d' | '365d';
  trainerId?: string;
  includeROI?: boolean; // Si incluir análisis de ROI
}

export interface GetPersonalizationImpactResponse {
  impact: PersonalizationImpactSnapshot;
  success: boolean;
  message?: string;
}

// User Story 2: Integrar feedback de clientes, contenido y ventas en una sola vista IA
export interface CustomerFeedbackData {
  feedbackId: string;
  customerId: string;
  customerName: string;
  feedbackType: 'survey' | 'review' | 'testimonial' | 'support' | 'social';
  content: string; // Contenido del feedback
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number; // 0-100
  topics: string[]; // Temas mencionados en el feedback
  rating?: number; // Rating si aplica (1-5)
  date: string;
  source: string; // Fuente del feedback (ej: "Encuesta NPS", "Google Reviews")
}

export interface ContentPerformanceData {
  contentId: string;
  contentType: 'post' | 'reel' | 'story' | 'video' | 'email' | 'blog';
  platform: 'instagram' | 'facebook' | 'tiktok' | 'linkedin' | 'email' | 'website';
  title?: string;
  content: string; // Contenido o descripción
  publishedAt: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
    engagementRate: number;
  };
  performance: {
    reach: number;
    impressions: number;
    clicks: number;
    saves: number;
  };
}

export interface SalesData {
  saleId: string;
  customerId: string;
  customerName: string;
  amount: number;
  date: string;
  product: string; // Producto o servicio vendido
  channel: string; // Canal de venta
  attribution?: {
    contentId?: string; // ID del contenido que generó la venta
    feedbackId?: string; // ID del feedback relacionado
    campaignId?: string; // ID de la campaña
  };
}

export interface IntegratedPattern {
  patternId: string;
  patternType: 'feedback-content' | 'content-sales' | 'feedback-sales' | 'feedback-content-sales';
  title: string;
  description: string; // Descripción del patrón detectado
  confidence: number; // 0-100, confianza en el patrón
  significance: 'high' | 'medium' | 'low'; // Significancia del patrón
  relatedData: {
    feedback?: CustomerFeedbackData[];
    content?: ContentPerformanceData[];
    sales?: SalesData[];
  };
  insights: string[]; // Insights derivados del patrón
  recommendations: string[]; // Recomendaciones basadas en el patrón
  detectedAt: string;
}

export interface IntegratedAIView {
  period: '7d' | '30d' | '90d';
  summary: string; // Resumen ejecutivo en lenguaje claro
  patterns: IntegratedPattern[];
  correlations: {
    feedbackToSales: number; // Correlación entre feedback y ventas (0-100)
    contentToSales: number; // Correlación entre contenido y ventas (0-100)
    feedbackToContent: number; // Correlación entre feedback y contenido (0-100)
  };
  keyInsights: string[]; // Insights clave de la vista integrada
  actionableRecommendations: string[]; // Recomendaciones accionables
  generatedAt: string;
  lastUpdated: string;
}

export interface GetIntegratedAIViewRequest {
  period?: '7d' | '30d' | '90d';
  trainerId?: string;
  includePatterns?: boolean; // Si incluir detección de patrones
  minConfidence?: number; // Confianza mínima para patrones (0-100)
}

export interface GetIntegratedAIViewResponse {
  view: IntegratedAIView;
  success: boolean;
  message?: string;
}

// User Story 1: Micro plan IA para feedback negativo (mensaje, acción, seguimiento)
export interface MicroPlanMessage {
  id: string;
  channel: 'email' | 'sms' | 'whatsapp' | 'phone' | 'in-app';
  subject?: string; // Para email
  content: string; // Mensaje personalizado
  tone: 'empatico' | 'profesional' | 'cercano' | 'directo';
  personalizationVariables: string[]; // Variables a personalizar (nombre, feedback específico, etc.)
  suggestedTiming: 'immediate' | '1h' | '4h' | '24h'; // Cuándo enviar el mensaje
  priority: 'urgent' | 'high' | 'medium';
}

export interface MicroPlanAction {
  id: string;
  type: 'contact' | 'offer' | 'schedule' | 'follow-up' | 'escalate';
  title: string;
  description: string;
  channel: 'email' | 'sms' | 'whatsapp' | 'phone' | 'in-app' | 'in-person';
  suggestedTiming: 'immediate' | '1h' | '4h' | '24h' | '48h';
  priority: 'urgent' | 'high' | 'medium';
  estimatedDuration?: number; // En minutos
  requiredResources?: string[]; // Recursos necesarios
  expectedOutcome: string; // Qué se espera lograr con esta acción
}

export interface MicroPlanFollowUp {
  id: string;
  type: 'check-in' | 'survey' | 'review' | 'feedback-request';
  title: string;
  description: string;
  channel: 'email' | 'sms' | 'whatsapp' | 'in-app';
  suggestedTiming: '24h' | '48h' | '72h' | '1w' | '2w'; // Cuándo hacer el seguimiento
  trigger: string; // Condición que activa el seguimiento
  questions?: string[]; // Preguntas para el seguimiento si es survey
}

export interface NegativeFeedbackMicroPlan {
  id: string;
  feedbackId: string;
  customerId: string;
  customerName: string;
  generatedAt: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'urgent' | 'high' | 'medium';
  message: MicroPlanMessage;
  action: MicroPlanAction;
  followUp: MicroPlanFollowUp;
  reasoning: string; // Por qué se generó este plan
  confidenceScore: number; // 0-100, nivel de confianza en el plan
  estimatedResolutionTime?: string; // Tiempo estimado para resolver
  successMetrics?: {
    metric: string;
    target: number;
    current?: number;
  }[];
}

export interface GenerateNegativeFeedbackMicroPlanRequest {
  feedback: CustomerFeedbackData; // Feedback negativo
  customerHistory?: {
    totalSessions?: number;
    lastSessionDate?: string;
    averageRating?: number;
    previousIssues?: string[];
  };
  trainerId?: string;
  customRequirements?: string[]; // Requisitos adicionales
}

export interface GenerateNegativeFeedbackMicroPlanResponse {
  microPlan: NegativeFeedbackMicroPlan;
  success: boolean;
  message?: string;
}

// User Story 2: Campañas automatizadas basadas en feedback positivo
export type CampaignType = 'premium-invitation' | 'referral-program' | 'upsell' | 'testimonial-request' | 'loyalty-program' | 'custom';

export interface PositiveFeedbackCampaign {
  id: string;
  feedbackId: string;
  customerId: string;
  customerName: string;
  campaignType: CampaignType;
  name: string;
  description: string;
  objective: string; // Objetivo de la campaña
  channel: 'email' | 'sms' | 'whatsapp' | 'in-app' | 'social';
  content: {
    subject?: string; // Para email
    message: string; // Mensaje personalizado
    cta?: string; // Call to action
    personalizationVariables: string[]; // Variables a personalizar
  };
  trigger: {
    condition: 'positive-feedback' | 'high-rating' | 'specific-topic' | 'multiple-positive';
    minRating?: number; // Rating mínimo (1-5)
    sentimentScore?: number; // Score mínimo de sentimiento (0-100)
    topics?: string[]; // Temas específicos que deben estar en el feedback
  };
  timing: {
    delay: 'immediate' | '1h' | '4h' | '24h' | '48h'; // Cuándo activar la campaña
    bestTime?: string; // Hora óptima para enviar
  };
  status: 'draft' | 'active' | 'paused' | 'completed';
  priority: 'high' | 'medium' | 'low';
  expectedConversionRate?: number; // Tasa de conversión esperada (%)
  expectedRevenue?: number; // Ingresos esperados
  generatedAt: string;
  activatedAt?: string;
  completedAt?: string;
  metrics?: {
    sent?: number;
    opened?: number;
    clicked?: number;
    converted?: number;
    revenue?: number;
  };
}

export interface CampaignSuggestion {
  id: string;
  feedbackId: string;
  customerId: string;
  customerName: string;
  suggestionType: CampaignType;
  name: string;
  description: string;
  rationale: string; // Por qué se sugiere esta campaña
  expectedConversionRate: number; // Tasa de conversión esperada (%)
  expectedRevenue: number; // Ingresos esperados
  priority: 'high' | 'medium' | 'low';
  confidenceScore: number; // 0-100, nivel de confianza en la sugerencia
  canAutoActivate: boolean; // Si se puede activar automáticamente
  suggestedChannels: ('email' | 'sms' | 'whatsapp' | 'in-app' | 'social')[];
  generatedAt: string;
}

export interface GeneratePositiveFeedbackCampaignRequest {
  feedback: CustomerFeedbackData; // Feedback positivo
  customerHistory?: {
    totalSessions?: number;
    lastSessionDate?: string;
    averageRating?: number;
    currentPlan?: string;
    previousCampaigns?: string[];
  };
  campaignTypes?: CampaignType[]; // Tipos de campaña a considerar
  trainerId?: string;
  autoActivate?: boolean; // Si activar automáticamente la campaña
}

export interface GeneratePositiveFeedbackCampaignResponse {
  campaign?: PositiveFeedbackCampaign;
  suggestions?: CampaignSuggestion[]; // Múltiples sugerencias si hay varias opciones
  success: boolean;
  message?: string;
}

export interface AutoActivateCampaignRequest {
  campaignId: string;
  feedbackId: string;
  customerId: string;
  trainerId?: string;
}

export interface AutoActivateCampaignResponse {
  campaign: PositiveFeedbackCampaign;
  success: boolean;
  message?: string;
}

export interface GetNegativeFeedbackMicroPlansRequest {
  status?: NegativeFeedbackMicroPlan['status'];
  priority?: NegativeFeedbackMicroPlan['priority'];
  limit?: number;
  trainerId?: string;
}

export interface GetNegativeFeedbackMicroPlansResponse {
  microPlans: NegativeFeedbackMicroPlan[];
  total: number;
  retrievedAt: string;
  success: boolean;
  message?: string;
}

export interface GetPositiveFeedbackCampaignsRequest {
  status?: PositiveFeedbackCampaign['status'];
  campaignType?: CampaignType;
  limit?: number;
  trainerId?: string;
}

export interface GetPositiveFeedbackCampaignsResponse {
  campaigns: PositiveFeedbackCampaign[];
  total: number;
  retrievedAt: string;
  success: boolean;
  message?: string;
}

// User Story 1: Insights IA por canal (Ads, orgánico, referidos) con recomendaciones concretas
export type ChannelType = 'ads' | 'organico' | 'referidos';

export interface ChannelInsight {
  id: string;
  channel: ChannelType;
  title: string;
  description: string;
  currentPerformance: {
    metric: string;
    value: number;
    changePercentage: number;
    trendDirection: MetricTrendDirection;
    period: '7d' | '30d' | '90d';
  };
  recommendations: ChannelRecommendation[];
  priority: 'high' | 'medium' | 'low';
  estimatedImpact: {
    metric: string;
    expectedImprovement: number; // Porcentaje esperado de mejora
    confidence: number; // 0-100
  };
  generatedAt: string;
}

export interface ChannelRecommendation {
  id: string;
  title: string;
  description: string;
  action: string; // Acción concreta a realizar
  effort: 'bajo' | 'medio' | 'alto';
  impact: 'alto' | 'medio' | 'bajo';
  timeframe: string; // Tiempo estimado para implementar (ej: "1 semana", "2 días")
  resources?: string[]; // Recursos necesarios
  expectedOutcome: string; // Resultado esperado
  priority: number; // 1-10, mayor = más prioritario
}

export interface ChannelInsightsResponse {
  insights: ChannelInsight[];
  summary: {
    totalInsights: number;
    highPriorityCount: number;
    channels: {
      channel: ChannelType;
      insightCount: number;
      avgImpact: number;
    }[];
  };
  period: '7d' | '30d' | '90d';
  generatedAt: string;
  success: boolean;
  message?: string;
}

export interface GetChannelInsightsRequest {
  trainerId?: string;
  channels?: ChannelType[];
  period?: '7d' | '30d' | '90d';
  minPriority?: 'high' | 'medium' | 'low';
}

// User Story 2: Alertas de tendencias de mercado/movimiento competidor relevante
export type MarketTrendType = 'tendencia_mercado' | 'movimiento_competidor' | 'oportunidad_emergente' | 'cambio_regulatorio' | 'tecnologia_nueva';

export type CompetitorMovementType = 'nuevo_producto' | 'cambio_precio' | 'campaña_marketing' | 'expansion' | 'partnership' | 'cambio_posicionamiento';

export interface MarketTrendAlert {
  id: string;
  type: MarketTrendType;
  title: string;
  description: string;
  relevance: 'alta' | 'media' | 'baja'; // Relevancia para el entrenador
  urgency: 'urgente' | 'alta' | 'media' | 'baja';
  impact: {
    potential: 'alto' | 'medio' | 'bajo';
    timeframe: 'inmediato' | 'corto_plazo' | 'medio_plazo' | 'largo_plazo';
    affectedChannels?: ChannelType[];
  };
  source: string; // Fuente de la información
  detectedAt: string;
  actionableInsights: string[]; // Insights accionables
  recommendedActions: {
    action: string;
    priority: number;
    timeframe: string;
  }[];
  relatedTrends?: string[]; // IDs de tendencias relacionadas
}

export interface CompetitorMovementAlert {
  id: string;
  competitorName: string;
  movementType: CompetitorMovementType;
  title: string;
  description: string;
  details: {
    what: string; // Qué hizo el competidor
    when: string; // Cuándo lo hizo
    where?: string; // Dónde (canal, región, etc.)
    impact?: string; // Impacto potencial en el mercado
  };
  relevance: 'alta' | 'media' | 'baja';
  urgency: 'urgente' | 'alta' | 'media' | 'baja';
  threatLevel: 'alto' | 'medio' | 'bajo'; // Nivel de amenaza
  opportunityLevel: 'alto' | 'medio' | 'bajo'; // Nivel de oportunidad
  recommendedResponse: {
    action: string;
    priority: number;
    timeframe: string;
    rationale: string; // Por qué esta respuesta
  }[];
  detectedAt: string;
  source: string;
}

export interface MarketTrendsAlertsResponse {
  marketTrends: MarketTrendAlert[];
  competitorMovements: CompetitorMovementAlert[];
  summary: {
    totalAlerts: number;
    urgentCount: number;
    highRelevanceCount: number;
    trendsByType: {
      type: MarketTrendType;
      count: number;
    }[];
    movementsByType: {
      type: CompetitorMovementType;
      count: number;
    }[];
  };
  period: '7d' | '30d' | '90d';
  generatedAt: string;
  success: boolean;
  message?: string;
}

export interface GetMarketTrendsAlertsRequest {
  trainerId?: string;
  trendTypes?: MarketTrendType[];
  movementTypes?: CompetitorMovementType[];
  minRelevance?: 'alta' | 'media' | 'baja';
  minUrgency?: 'urgente' | 'alta' | 'media' | 'baja';
  period?: '7d' | '30d' | '90d';
  limit?: number;
}

// User Story 1: Planes trimestrales IA basados en OKRs y roadmap
export interface OKRData {
  id: string;
  objective: string;
  keyResults: {
    id: string;
    description: string;
    target: number;
    current: number;
    unit: string;
    progress: number; // 0-100
  }[];
  period: string; // e.g., "Q1-2025"
  status: 'not_started' | 'in_progress' | 'achieved' | 'at_risk' | 'failed';
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  category: 'campaign' | 'content' | 'experiment' | 'automation' | 'event' | 'other';
  priority: 'high' | 'medium' | 'low';
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  startDate?: string;
  endDate?: string;
  dependencies?: string[]; // IDs of other roadmap items
}

export interface QuarterlyPlanMilestone {
  id: string;
  title: string;
  description: string;
  month: 1 | 2 | 3; // Month within the quarter
  week?: number; // Optional week within the month
  deliverables: string[];
  successMetrics: {
    metric: string;
    target: number;
    unit: string;
  }[];
  status: 'planned' | 'in_progress' | 'completed' | 'at_risk';
  relatedOKRId?: string;
  relatedRoadmapItemId?: string;
}

export interface QuarterlyPlan {
  id: string;
  quarter: string; // e.g., "Q1-2025"
  year: number;
  title: string;
  description: string;
  strategicObjectives: string[];
  okrs: OKRData[];
  roadmapItems: RoadmapItem[];
  milestones: QuarterlyPlanMilestone[];
  keyInitiatives: {
    id: string;
    name: string;
    description: string;
    owner?: string;
    ownerName?: string;
    priority: 'high' | 'medium' | 'low';
    status: 'planned' | 'in_progress' | 'completed' | 'at_risk';
    progress: number; // 0-100
    expectedImpact: 'high' | 'medium' | 'low';
    relatedOKRId?: string;
    startDate?: string;
    endDate?: string;
  }[];
  aiRecommendations: {
    id: string;
    category: 'strategy' | 'timing' | 'resource' | 'risk';
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    rationale: string;
    suggestedActions: string[];
  }[];
  progress: {
    overall: number; // 0-100
    okrs: number; // 0-100
    milestones: number; // 0-100
    initiatives: number; // 0-100
  };
  alignment: {
    okrAlignment: number; // 0-100, how well plan aligns with OKRs
    roadmapAlignment: number; // 0-100, how well plan aligns with roadmap
    strategyAlignment: number; // 0-100, how well plan aligns with strategic profile
  };
  generatedAt: string;
  updatedAt: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
}

export interface GenerateQuarterlyPlanRequest {
  trainerId?: string;
  quarter: string; // e.g., "Q1-2025"
  okrs?: OKRData[];
  roadmapItems?: RoadmapItem[];
  strategicProfile?: {
    objectives?: string[];
    strengths?: string[];
    buyerPersonas?: string[];
  };
  customRequirements?: string[];
}

export interface GenerateQuarterlyPlanResponse {
  plan: QuarterlyPlan;
  success: boolean;
  message?: string;
}

export interface GetQuarterlyPlanRequest {
  trainerId?: string;
  quarter?: string; // If not provided, returns current quarter
  year?: number;
}

export interface GetQuarterlyPlanResponse {
  plan: QuarterlyPlan | null;
  success: boolean;
  message?: string;
}

export interface UpdateQuarterlyPlanRequest {
  planId: string;
  updates: {
    milestones?: Partial<QuarterlyPlanMilestone>[];
    initiatives?: Partial<QuarterlyPlan['keyInitiatives'][0]>[];
    status?: QuarterlyPlan['status'];
  };
}

export interface UpdateQuarterlyPlanResponse {
  plan: QuarterlyPlan;
  success: boolean;
  message?: string;
}

// User Story 2: Asignar dueños a insights/playbooks y ver su progreso
export interface OwnershipAssignment {
  id: string;
  itemId: string; // ID of insight or playbook
  itemType: 'insight' | 'playbook';
  itemName: string;
  ownerId: string;
  ownerName: string;
  ownerEmail?: string;
  assignedBy: string; // ID of trainer who assigned
  assignedByName: string;
  assignedAt: string;
  status: OwnershipStatus;
  dueDate?: string;
  priority: 'high' | 'medium' | 'low';
  progress: number; // 0-100
  notes?: string;
  milestones?: {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed';
    completedAt?: string;
    dueDate?: string;
  }[];
  updates?: {
    id: string;
    message: string;
    updatedBy: string;
    updatedByName: string;
    updatedAt: string;
    progress?: number;
    status?: OwnershipStatus;
  }[];
  blockers?: {
    id: string;
    description: string;
    reportedBy: string;
    reportedByName: string;
    reportedAt: string;
    resolved: boolean;
    resolvedAt?: string;
  }[];
}

export interface AssignOwnerRequest {
  itemId: string;
  itemType: 'insight' | 'playbook';
  ownerId: string;
  dueDate?: string;
  priority?: 'high' | 'medium' | 'low';
  notes?: string;
  milestones?: {
    title: string;
    description: string;
    dueDate?: string;
  }[];
}

export interface AssignOwnerResponse {
  assignment: OwnershipAssignment;
  success: boolean;
  message?: string;
}

export interface UpdateOwnershipProgressRequest {
  assignmentId: string;
  progress?: number;
  status?: OwnershipStatus;
  update?: {
    message: string;
    progress?: number;
    status?: OwnershipStatus;
  };
  milestoneId?: string;
  milestoneStatus?: 'pending' | 'in_progress' | 'completed';
  blocker?: {
    description: string;
  };
  resolveBlockerId?: string;
}

export interface UpdateOwnershipProgressResponse {
  assignment: OwnershipAssignment;
  success: boolean;
  message?: string;
}

export interface GetOwnershipAssignmentsRequest {
  trainerId?: string;
  ownerId?: string; // Filter by owner
  itemType?: 'insight' | 'playbook';
  status?: OwnershipStatus;
  itemId?: string; // Get assignments for specific item
}

export interface GetOwnershipAssignmentsResponse {
  assignments: OwnershipAssignment[];
  total: number;
  summary: {
    assigned: number;
    in_progress: number;
    completed: number;
    blocked: number;
    overdue: number;
  };
  success: boolean;
  message?: string;
}

export interface OwnershipProgressMetrics {
  ownerId: string;
  ownerName: string;
  totalAssignments: number;
  completed: number;
  inProgress: number;
  blocked: number;
  overdue: number;
  averageProgress: number;
  completionRate: number; // 0-100
  onTimeCompletionRate: number; // 0-100
}

// User Story 1: Aprobar experimentos/playbooks desde móvil con resumen IA
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'needs-changes';

export type ApprovalItemType = 'experiment' | 'playbook';

export interface AISummary {
  summary: string; // Resumen ejecutivo en lenguaje claro
  keyPoints: string[]; // Puntos clave del experimento/playbook
  risks: string[]; // Riesgos identificados
  opportunities: string[]; // Oportunidades identificadas
  recommendations: string[]; // Recomendaciones de la IA
  confidence: number; // 0-100, nivel de confianza en el resumen
  generatedAt: string;
}

export interface MobileApproval {
  id: string;
  itemType: ApprovalItemType;
  itemId: string; // ID del experimento o playbook
  itemName: string;
  itemObjective?: string;
  submittedBy: string;
  submittedByName: string;
  submittedAt: string;
  status: ApprovalStatus;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  aiSummary?: AISummary; // Resumen generado por IA
  notes?: string;
  reviewedBy?: string;
  reviewedByName?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  requestedChanges?: string;
  // Campos específicos por tipo
  experiment?: ExperimentRecord;
  playbook?: PlaybookRecord;
}

export interface GenerateAISummaryRequest {
  itemType: ApprovalItemType;
  itemId: string;
}

export interface GenerateAISummaryResponse {
  summary: AISummary;
  success: boolean;
  message?: string;
}

export interface ApproveItemRequest {
  approvalId: string;
  status: 'approved' | 'rejected' | 'needs-changes';
  notes?: string;
  rejectionReason?: string;
  requestedChanges?: string;
}

export interface ApproveItemResponse {
  approval: MobileApproval;
  success: boolean;
  message?: string;
}

export interface GetPendingApprovalsRequest {
  itemType?: ApprovalItemType;
  priority?: MobileApproval['priority'];
  limit?: number;
  trainerId?: string;
}

export interface GetPendingApprovalsResponse {
  approvals: MobileApproval[];
  total: number;
  success: boolean;
  message?: string;
}

// User Story 2: Sincronizar playbooks con otras sedes o entrenadores
export interface Location {
  id: string;
  name: string;
  address?: string;
  city?: string;
  country?: string;
}

export interface Trainer {
  id: string;
  name: string;
  email: string;
  locationId?: string;
  locationName?: string;
  avatar?: string;
}

export type SyncStatus = 'synced' | 'pending' | 'conflict' | 'error';

export interface PlaybookSync {
  id: string;
  playbookId: string;
  playbookName: string;
  sourceTrainerId: string;
  sourceTrainerName: string;
  sourceLocationId?: string;
  sourceLocationName?: string;
  targetTrainerId?: string;
  targetTrainerName?: string;
  targetLocationId?: string;
  targetLocationName?: string;
  syncType: 'location' | 'trainer' | 'both'; // Sincronizar a sede, entrenador, o ambos
  status: SyncStatus;
  syncedAt?: string;
  syncedBy?: string;
  syncedByName?: string;
  conflictResolution?: 'source' | 'target' | 'merge' | 'manual';
  errorMessage?: string;
  lastSyncAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SyncPlaybookRequest {
  playbookId: string;
  syncType: 'location' | 'trainer' | 'both';
  targetLocationIds?: string[]; // IDs de sedes destino
  targetTrainerIds?: string[]; // IDs de entrenadores destino
  includeStrategy?: boolean; // Incluir estrategia
  includeCopy?: boolean; // Incluir copy
  includeAssets?: boolean; // Incluir assets
  includeMeasurement?: boolean; // Incluir medición
  adaptToTarget?: boolean; // Adaptar al estilo del entrenador/sede destino
}

export interface SyncPlaybookResponse {
  sync: PlaybookSync;
  syncedTo: {
    locations: Location[];
    trainers: Trainer[];
  };
  success: boolean;
  message?: string;
}

export interface GetSyncStatusRequest {
  playbookId?: string;
  locationId?: string;
  trainerId?: string;
  status?: SyncStatus;
  limit?: number;
}

export interface GetSyncStatusResponse {
  syncs: PlaybookSync[];
  total: number;
  success: boolean;
  message?: string;
}

export interface GetAvailableLocationsRequest {
  excludeLocationId?: string;
  trainerId?: string;
}

export interface GetAvailableLocationsResponse {
  locations: Location[];
  success: boolean;
  message?: string;
}

export interface GetAvailableTrainersRequest {
  locationId?: string;
  excludeTrainerId?: string;
}

export interface GetAvailableTrainersResponse {
  trainers: Trainer[];
  success: boolean;
  message?: string;
}

export interface ResolveSyncConflictRequest {
  syncId: string;
  resolution: 'source' | 'target' | 'merge' | 'manual';
  manualResolution?: Partial<PlaybookRecord>; // Para resolución manual
}

export interface ResolveSyncConflictResponse {
  sync: PlaybookSync;
  success: boolean;
  message?: string;
}

// User Story 1: IA que aprende de decisiones de playbooks (aceptar/rechazar)
export type PlaybookDecisionAction = 'accept' | 'reject' | 'modify' | 'dismiss';

export interface PlaybookDecision {
  id: string;
  playbookId: string;
  playbookName: string;
  action: PlaybookDecisionAction;
  timestamp: string;
  trainerId: string;
  reason?: string; // Razón de la decisión
  modifiedData?: Partial<PlaybookRecord>; // Si se modificó antes de aceptar
  context?: {
    period?: string;
    objective?: string;
    channels?: string[];
    targetAudience?: string;
  };
}

export interface PlaybookLearningProfile {
  trainerId: string;
  preferences: {
    preferredImpact: ('Alto' | 'Medio' | 'Bajo')[];
    preferredChannels: string[];
    preferredObjectives: string[];
    rejectedPatterns: string[]; // Patrones que el entrenador rechaza frecuentemente
    acceptedPatterns: string[]; // Patrones que el entrenador acepta frecuentemente
  };
  decisionHistory: PlaybookDecision[];
  accuracyScore: number; // 0-100, qué tan precisa es la IA para este entrenador
  lastUpdated: string;
}

export interface PlaybookLearningInsights {
  totalDecisions: number;
  acceptanceRate: number; // Porcentaje de aceptaciones
  rejectionRate: number; // Porcentaje de rechazos
  topAcceptedPatterns: {
    pattern: string;
    count: number;
    percentage: number;
  }[];
  topRejectedPatterns: {
    pattern: string;
    count: number;
    percentage: number;
  }[];
  commonRejectionReasons: {
    reason: string;
    count: number;
    percentage: number;
  }[];
  improvementSuggestions: string[];
  accuracyTrend: {
    period: string;
    score: number;
  }[];
}

export interface RecordPlaybookDecisionRequest {
  playbookId: string;
  action: PlaybookDecisionAction;
  reason?: string;
  modifiedData?: Partial<PlaybookRecord>;
  context?: PlaybookDecision['context'];
}

export interface RecordPlaybookDecisionResponse {
  decision: PlaybookDecision;
  success: boolean;
  message?: string;
  updatedLearningProfile?: PlaybookLearningProfile;
}

export interface GetPlaybookLearningProfileRequest {
  trainerId?: string;
}

export interface GetPlaybookLearningProfileResponse {
  profile: PlaybookLearningProfile | null;
  success: boolean;
  message?: string;
}

export interface GetPlaybookLearningInsightsRequest {
  trainerId?: string;
  period?: '7d' | '30d' | '90d';
}

export interface GetPlaybookLearningInsightsResponse {
  insights: PlaybookLearningInsights;
  success: boolean;
  message?: string;
}

// User Story 2: Evaluación automática de impacto de iniciativas y recomendación de repetición
export type InitiativeRepeatRecommendation = 'repeat' | 'repeat-with-modifications' | 'scale' | 'discontinue' | 'test-more';

export interface InitiativeImpactMetrics {
  initiativeId: string;
  initiativeName: string;
  initiativeType: 'playbook' | 'experiment' | 'campaign' | 'automation';
  // Métricas de impacto
  reach: number; // Alcance
  engagement: number; // Engagement
  conversionRate: number; // Tasa de conversión
  revenue: number; // Ingresos generados
  roi: number; // Return on Investment
  cost: number; // Costo de la iniciativa
  // Métricas de retención
  retentionLift?: number; // Incremento en retención
  participantsRetained?: number; // Participantes retenidos
  // Métricas de tiempo
  duration: number; // Duración en días
  executionTime: number; // Tiempo de ejecución en horas
  // Métricas combinadas
  overallEffectiveness: number; // Efectividad general (0-100)
  efficiencyScore: number; // Score de eficiencia (0-100)
  impactScore: number; // Score de impacto (0-100)
}

export interface InitiativeImpactEvaluation {
  id: string;
  initiativeId: string;
  initiativeName: string;
  initiativeType: 'playbook' | 'experiment' | 'campaign' | 'automation';
  metrics: InitiativeImpactMetrics;
  // Evaluación automática
  evaluation: {
    summary: string; // Resumen de la evaluación en lenguaje claro
    strengths: string[]; // Fortalezas de la iniciativa
    weaknesses: string[]; // Debilidades de la iniciativa
    keyFindings: string[]; // Hallazgos clave
    performanceCategory: 'excellent' | 'good' | 'average' | 'poor'; // Categoría de rendimiento
  };
  // Recomendación de repetición
  recommendation: InitiativeRepeatRecommendation;
  recommendationReason: string; // Razón de la recomendación en lenguaje claro
  confidence: number; // 0-100, nivel de confianza en la recomendación
  // Sugerencias de mejora si se repite
  suggestedModifications?: {
    what: string; // Qué modificar
    why: string; // Por qué modificar
    expectedImpact: string; // Impacto esperado
    priority: 'high' | 'medium' | 'low';
  }[];
  // Comparación con iniciativas similares
  comparison?: {
    similarInitiatives: {
      initiativeId: string;
      initiativeName: string;
      performance: number; // 0-100
    }[];
    percentile: number; // Percentil de rendimiento (0-100)
    benchmark: 'above' | 'at' | 'below'; // Comparado con el benchmark
  };
  // Próximos pasos
  nextSteps: string[]; // Próximos pasos sugeridos
  evaluatedAt: string;
  evaluatedBy: 'system' | 'ai';
  period: '7d' | '30d' | '90d' | 'all';
}

export interface EvaluateInitiativeImpactRequest {
  initiativeId: string;
  initiativeType: 'playbook' | 'experiment' | 'campaign' | 'automation';
  period?: '7d' | '30d' | '90d' | 'all';
  trainerId?: string;
}

export interface EvaluateInitiativeImpactResponse {
  evaluation: InitiativeImpactEvaluation;
  success: boolean;
  message?: string;
}

export interface GetInitiativeImpactEvaluationsRequest {
  trainerId?: string;
  initiativeType?: 'playbook' | 'experiment' | 'campaign' | 'automation';
  recommendation?: InitiativeRepeatRecommendation;
  period?: '7d' | '30d' | '90d';
  limit?: number;
}

export interface GetInitiativeImpactEvaluationsResponse {
  evaluations: InitiativeImpactEvaluation[];
  total: number;
  summary: {
    totalEvaluated: number;
    recommendedToRepeat: number;
    recommendedToScale: number;
    recommendedToDiscontinue: number;
    averageEffectiveness: number;
    topPerformers: string[]; // IDs de iniciativas top
  };
  success: boolean;
  message?: string;
}

// User Story 1: Retrospectivas IA mensuales que celebran logros y marcan próximos focos
export interface MonthlyAchievement {
  id: string;
  category: 'marketing' | 'ventas' | 'comunidad' | 'experimentacion' | 'personalizacion' | 'retencion' | 'otro';
  title: string;
  description: string;
  metric?: {
    name: string;
    value: number;
    change?: number; // Cambio porcentual
    unit?: string;
  };
  impact: 'high' | 'medium' | 'low';
  celebrationMessage: string; // Mensaje motivacional que celebra el logro
  relatedItems?: {
    type: 'campaign' | 'experiment' | 'playbook' | 'content' | 'event';
    id: string;
    name: string;
  }[];
}

export interface NextFocus {
  id: string;
  title: string;
  description: string;
  category: 'marketing' | 'ventas' | 'comunidad' | 'experimentacion' | 'personalizacion' | 'retencion' | 'otro';
  priority: 'high' | 'medium' | 'low';
  rationale: string; // Por qué este es un foco importante
  suggestedActions: string[]; // Acciones sugeridas para este foco
  expectedImpact: {
    metric: string;
    expectedImprovement: number; // Porcentaje esperado de mejora
    timeframe: string; // Tiempo estimado para ver resultados
  };
  relatedInsights?: string[]; // IDs de insights relacionados
  canCreatePlaybook?: boolean; // Si se puede crear un playbook desde este foco
  canCreateExperiment?: boolean; // Si se puede crear un experimento desde este foco
}

export interface MonthlyRetrospective {
  id: string;
  month: string; // e.g., "Enero 2025"
  year: number;
  period: {
    startDate: string; // ISO date
    endDate: string; // ISO date
  };
  generatedAt: string;
  achievements: MonthlyAchievement[];
  nextFoci: NextFocus[];
  summary: {
    overallPerformance: 'excellent' | 'good' | 'average' | 'needs-improvement';
    performanceScore: number; // 0-100
    keyHighlights: string[]; // Puntos destacados del mes
    motivationalMessage: string; // Mensaje motivacional general
  };
  metrics: {
    totalAchievements: number;
    highImpactAchievements: number;
    totalFoci: number;
    highPriorityFoci: number;
  };
  insights: string[]; // Insights clave del mes
  recommendations: string[]; // Recomendaciones para el próximo mes
  trainerId?: string;
}

export interface GetMonthlyRetrospectiveRequest {
  month?: number; // 1-12, si no se proporciona, retorna el mes actual
  year?: number; // Si no se proporciona, retorna el año actual
  trainerId?: string;
  generateIfNotExists?: boolean; // Si generar la retrospectiva si no existe
}

export interface GetMonthlyRetrospectiveResponse {
  retrospective: MonthlyRetrospective | null;
  success: boolean;
  message?: string;
}

export interface GenerateMonthlyRetrospectiveRequest {
  month: number; // 1-12
  year: number;
  trainerId?: string;
  includeAchievements?: boolean; // Si incluir logros
  includeNextFoci?: boolean; // Si incluir próximos focos
  customPeriod?: {
    startDate: string;
    endDate: string;
  };
}

export interface GenerateMonthlyRetrospectiveResponse {
  retrospective: MonthlyRetrospective;
  success: boolean;
  message?: string;
}

export interface GetMonthlyRetrospectivesHistoryRequest {
  trainerId?: string;
  limit?: number; // Número de retrospectivas a retornar
  startDate?: string; // Fecha de inicio para filtrar
  endDate?: string; // Fecha de fin para filtrar
}

export interface GetMonthlyRetrospectivesHistoryResponse {
  retrospectives: MonthlyRetrospective[];
  total: number;
  success: boolean;
  message?: string;
}

