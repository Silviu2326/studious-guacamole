import type { SocialPlatform, PostStatus } from '../../PlannerDeRedesSociales/api/social';

export type ContentStudioPeriod = '7d' | '30d' | '90d';

export type IconKey =
  | 'sparkles'
  | 'calendar'
  | 'film'
  | 'scissors'
  | 'share'
  | 'lightbulb'
  | 'users'
  | 'library'
  | 'zap'
  | 'trendingUp'
  | 'globe'
  | 'link'
  | 'pen'
  | 'target'
  | 'megaphone'
  | 'brain'
  | 'message';

export interface ContentStudioMetric {
  id: string;
  title: string;
  value: string;
  subtitle?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  icon?: IconKey;
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info';
}

export interface ModuleQuickAction {
  id: string;
  title: string;
  description: string;
  icon: IconKey;
  href: string;
  highlight?: string;
  pill?: {
    label: string;
    tone?: 'info' | 'success' | 'warning' | 'danger' | 'neutral';
  };
}

export type PlannerContentType = 'post' | 'story' | 'reel' | 'live' | 'video' | 'carousel';

export interface PlannerUpcomingPost {
  id: string;
  title: string;
  scheduledAt: string;
  platform: SocialPlatform;
  status: PostStatus;
  contentType: PlannerContentType;
  campaign?: string;
  aiGenerated?: boolean;
}

export interface PlannerAISuggestion {
  id: string;
  title: string;
  description: string;
  platform: SocialPlatform;
  scheduledFor: string;
  priority: 'high' | 'medium' | 'low';
  reason: string;
}

export interface VideoProjectSummary {
  id: string;
  title: string;
  format: 'reel' | 'short' | 'long';
  status: 'ideation' | 'editing' | 'rendering' | 'scheduled' | 'published';
  automationLevel: 'manual' | 'assisted' | 'automated';
  publishDate?: string;
  duration?: string;
  platform: 'instagram' | 'tiktok' | 'youtube';
  performanceScore?: number;
}

export interface ContentClipSummary {
  id: string;
  title: string;
  category?: string;
  source?: string;
  tags: string[];
  savedAt: string;
  usageCount: number;
  impact?: string;
}

export interface ClipCategorySummary {
  id: string;
  name: string;
  count: number;
  color?: string;
}

export type DistributionChannel = SocialPlatform | 'youtube' | 'podcast' | 'email';

export interface SyndicationCampaignSummary {
  id: string;
  title: string;
  creator: string;
  persona: string;
  channels: DistributionChannel[];
  status: 'briefing' | 'awaiting-content' | 'live' | 'reporting';
  nextDelivery?: string;
  reachEstimate?: number;
  alignmentScore?: number;
}

export interface AIContentAssistant {
  id: string;
  title: string;
  description: string;
  useCases: string[];
  relatedModule: string;
  lastRun?: string;
  icon?: IconKey;
}

export interface AIContentIdea {
  id: string;
  title: string;
  hook: string;
  format: string;
  channel: DistributionChannel;
  callToAction: string;
}

export interface ClientProgressMetrics {
  clientId: string;
  clientName: string;
  weight?: {
    current: number;
    previous: number;
    change: number;
    unit: 'kg' | 'lbs';
  };
  measurements?: {
    chest?: { current: number; previous: number; change: number };
    waist?: { current: number; previous: number; change: number };
    hips?: { current: number; previous: number; change: number };
    arms?: { current: number; previous: number; change: number };
    legs?: { current: number; previous: number; change: number };
  };
  photos?: {
    before?: string;
    after?: string;
    hasPermission: boolean;
  };
  achievements?: string[];
  startDate: string;
  currentDate: string;
}

export interface PostTemplate {
  id: string;
  name: string;
  description: string;
  format: 'post' | 'reel' | 'carousel' | 'story';
  structure: {
    hook: string;
    body: string;
    cta: string;
  };
}

export interface GeneratedTransformationPost {
  id: string;
  clientId: string;
  clientName: string;
  template: PostTemplate;
  content: {
    caption: string;
    hashtags: string[];
    mediaUrls?: string[];
  };
  permissionStatus: 'pending' | 'granted' | 'denied' | 'not_requested';
  createdAt: string;
}

export interface FAQQuestion {
  id: string;
  question: string;
  frequency: number;
  source: 'inbox' | 'whatsapp' | 'instagram' | 'email';
  lastAsked: string;
  category?: string;
}

export interface FAQContentIdea {
  id: string;
  question: string;
  suggestedFormats: Array<'post' | 'reel' | 'carousel' | 'story'>;
  contentIdeas: Array<{
    format: 'post' | 'reel' | 'carousel' | 'story';
    title: string;
    hook: string;
    keyPoints: string[];
    cta: string;
  }>;
  priority: 'high' | 'medium' | 'low';
}

// Brand Profile Types (US-CSS-009)
export type Specialization = 
  | 'hipertrofia'
  | 'perdida-peso'
  | 'rehabilitacion'
  | 'fuerza'
  | 'resistencia'
  | 'flexibilidad'
  | 'funcional'
  | 'deportivo'
  | 'nutricion'
  | 'bienestar-general';

export type ToneOfVoice = 
  | 'motivacional'
  | 'tecnico'
  | 'cercano'
  | 'profesional'
  | 'energico'
  | 'empatico'
  | 'educativo'
  | 'directo';

export interface BrandProfileConfig {
  trainerId: string;
  specializations: Specialization[];
  toneOfVoice: ToneOfVoice;
  customTone?: string;
  values: string[];
  targetAudience?: string;
  keywords?: string[];
  updatedAt?: string;
}

// Promotional Content Types (US-CSS-010)
export type PromotionalTemplateType = 
  | 'plan-entrenamiento'
  | 'oferta-especial'
  | 'bono-sesiones'
  | 'nuevo-servicio'
  | 'descuento'
  | 'evento-clase';

export interface ServicePlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  sessionsPerMonth?: number;
  features: string[];
  isActive: boolean;
}

export interface PromotionalOffer {
  id: string;
  title: string;
  description: string;
  discount?: number;
  discountType?: 'percentage' | 'fixed';
  validUntil?: string;
  applicablePlans?: string[];
  isActive: boolean;
}

export interface PromotionalContentTemplate {
  id: string;
  name: string;
  description: string;
  type: PromotionalTemplateType;
  format: 'post' | 'reel' | 'carousel' | 'story';
  structure: {
    hook: string;
    body: string;
    cta: string;
  };
  variables: Array<{
    key: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'plan' | 'offer';
    defaultValue?: string;
  }>;
  suggestedHashtags: string[];
  educational: boolean;
  platforms: SocialPlatform[];
}

export interface GeneratedPromotionalContent {
  id: string;
  templateId: string;
  content: {
    caption: string;
    hashtags: string[];
    mediaUrls?: string[];
  };
  scheduledAt?: string;
  platform: SocialPlatform;
  status: 'draft' | 'scheduled' | 'published';
  createdAt: string;
}

export interface ContentSocialSnapshot {
  metrics: ContentStudioMetric[];
  modules: ModuleQuickAction[];
  planner: {
    backlogCount: number;
    coverageDays: number;
    upcoming: PlannerUpcomingPost[];
    aiSuggestions: PlannerAISuggestion[];
    gapAlerts?: CalendarGapAlert[];
    gaps?: CalendarGap[];
  };
  video: {
    projects: VideoProjectSummary[];
    automationPlaybooks: number;
    readyToPublish: number;
    libraryAssets: number;
  };
  clipper: {
    totalClips: number;
    newThisWeek: number;
    categories: ClipCategorySummary[];
    featured: ContentClipSummary[];
    trendingTags: string[];
  };
  syndication: {
    activeCampaigns: number;
    creatorsNetwork: number;
    pipeline: SyndicationCampaignSummary[];
  };
  ai: {
    assistants: AIContentAssistant[];
    quickIdeas: AIContentIdea[];
    brandProfile?: {
      toneOfVoice?: string;
      targetAudience?: string;
      keywords?: string[];
      updatedAt?: string;
    };
    brandProfileConfig?: BrandProfileConfig;
    lastUpdated: string;
    templates?: {
      templates: AITemplate[];
      balance: AITemplateBalance;
      recentUsage: AITemplateUsage[];
    };
  };
  clientTransformations?: {
    availableClients: ClientProgressMetrics[];
    generatedPosts: GeneratedTransformationPost[];
    templates: PostTemplate[];
  };
  faqContent?: {
    topQuestions: FAQQuestion[];
    contentIdeas: FAQContentIdea[];
  };
  promotionalContent?: {
    templates: PromotionalContentTemplate[];
    availablePlans: ServicePlan[];
    activeOffers: PromotionalOffer[];
    generatedContent: GeneratedPromotionalContent[];
  };
  creativeVoiceConfig?: CreativeVoiceConfig;
  starFormatsConfig?: StarFormatsConfig;
  contentAssignments?: {
    assignments: ContentAssignment[];
    availableTeamMembers: TeamMember[];
    pendingAssignments: number;
    inProgressAssignments: number;
  };
  contentApprovals?: {
    pendingApprovals: ContentApproval[];
    pendingCount: number;
    recentApprovals: ContentApproval[];
  };
  brandKits?: {
    kits: BrandKit[];
    recentGenerations: BrandKit[];
  };
  visualStyleLearning?: VisualStyleLearningSnapshot;
  saturatedTopics?: SaturatedTopicsAnalysis;
  postCampaignInsights?: CampaignInsight[];
}

// Creative Voice Config Types (US-CSS-011)
export type CreativeTone = 
  | 'motivacional'
  | 'tecnico'
  | 'cercano'
  | 'profesional'
  | 'energico'
  | 'empatico'
  | 'educativo'
  | 'directo'
  | 'humoristico'
  | 'inspirador';

export interface CreativeVoiceConfig {
  trainerId: string;
  tone: CreativeTone;
  customToneDescription?: string;
  forbiddenWords: string[];
  thematicPillars: ThematicPillar[];
  updatedAt?: string;
}

export interface ThematicPillar {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  priority: 'high' | 'medium' | 'low';
}

// Star Formats Config Types (US-CSS-012)
export type ContentFormat = 
  | 'reel'
  | 'carousel'
  | 'email'
  | 'post'
  | 'story'
  | 'blog'
  | 'newsletter'
  | 'tiktok'
  | 'youtube';

// Extended platform type for star formats (includes platforms beyond base SocialPlatform)
export type ExtendedSocialPlatform = SocialPlatform | 'twitter' | 'youtube';

export interface StarFormat {
  format: ContentFormat;
  priority: number; // 1-10, where 10 is highest priority
  enabled: boolean;
  preferredPlatforms?: ExtendedSocialPlatform[];
  notes?: string;
}

export interface StarFormatsConfig {
  trainerId: string;
  starFormats: StarFormat[];
  updatedAt?: string;
}

// Trainer Niches Config Types (US-CSS-013)
export type TrainerNiche = 
  | 'ejecutivos'
  | 'postparto'
  | 'alto-rendimiento'
  | 'rehabilitacion'
  | 'perdida-peso'
  | 'ganancia-masa'
  | 'bienestar-general'
  | 'deportistas-amateur';

export interface NicheAngle {
  niche: TrainerNiche;
  angles: string[];
  keywords: string[];
  painPoints: string[];
  benefits: string[];
}

export interface TrainerNichesConfig {
  trainerId: string;
  primaryNiches: TrainerNiche[];
  nicheAngles: NicheAngle[];
  updatedAt?: string;
}

// Weekly AI Calendar Types (US-CSS-014)
export interface WeeklyCalendarPost {
  id: string;
  date: string; // ISO date string
  dayOfWeek: string;
  time: string; // HH:mm format
  platform: SocialPlatform;
  contentType: 'post' | 'reel' | 'carousel' | 'story';
  hook: string;
  copy: string;
  cta: string;
  audiovisualHook?: string;
  hashtags: string[];
  suggestedMedia?: string[];
  niche?: TrainerNiche;
  status: 'draft' | 'scheduled' | 'published';
}

export interface WeeklyAICalendar {
  id: string;
  weekStart: string; // ISO date string
  weekEnd: string; // ISO date string
  posts: WeeklyCalendarPost[];
  generatedAt: string;
  trainerId: string;
}

// Video Script Generator Types (US-CSS-015)
export type VideoStyle = 'energetico' | 'calmado' | 'motivacional' | 'educativo' | 'personalizado';

export interface VideoScriptPrompt {
  id: string;
  title: string;
  description: string;
  category: 'tip' | 'tutorial' | 'motivacion' | 'transformacion' | 'nutricion' | 'ejercicio' | 'bienestar';
  estimatedDuration: string; // e.g., "30s", "60s", "90s"
  style: VideoStyle;
  template: {
    hook: string;
    body: string[];
    cta: string;
    visualCues?: string[];
  };
}

export interface GeneratedVideoScript {
  id: string;
  promptId: string;
  title: string;
  style: VideoStyle;
  duration: string;
  script: {
    hook: {
      text: string;
      timing: string;
      visualCue?: string;
    };
    body: Array<{
      text: string;
      timing: string;
      visualCue?: string;
    }>;
    cta: {
      text: string;
      timing: string;
      visualCue?: string;
    };
  };
  hashtags: string[];
  notes?: string;
  createdAt: string;
}

// AI Template Types (US-CSS-016 - User Story 1)
export type AITemplatePurpose = 'educar' | 'inspirar' | 'vender';
export type AITemplateFormat = 'post' | 'reel' | 'carousel' | 'story' | 'video' | 'email';

export interface AITemplate {
  id: string;
  name: string;
  description: string;
  purpose: AITemplatePurpose;
  format: AITemplateFormat;
  category: string;
  structure: {
    hook: string;
    body: string[];
    cta: string;
  };
  variables: Array<{
    key: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'url' | 'hashtag';
    defaultValue?: string;
    required?: boolean;
  }>;
  suggestedHashtags: string[];
  platforms: SocialPlatform[];
  usageCount?: number;
  lastUsed?: string;
  enabled: boolean;
}

export interface AITemplateBalance {
  educar: number;
  inspirar: number;
  vender: number;
  total: number;
}

export interface AITemplateUsage {
  templateId: string;
  purpose: AITemplatePurpose;
  format: AITemplateFormat;
  usedAt: string;
  platform: SocialPlatform;
}

// Calendar Gap Detection Types (US-CSS-017 - User Story 2)
export interface CalendarGap {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // in hours
  priority: 'high' | 'medium' | 'low';
  reason: string;
  suggestedFormats: AITemplateFormat[];
  suggestedPlatforms: SocialPlatform[];
  aiSuggestions?: PlannerAISuggestion[];
}

export interface CalendarGapAlert {
  id: string;
  type: 'gap' | 'low_coverage' | 'imbalance';
  severity: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  gaps?: CalendarGap[];
  action?: {
    label: string;
    onClick: () => void;
  };
  createdAt: string;
}

// Launch Orchestration Types (US-CSS-018 - User Story 1: Orquestar lanzamiento completo)
export type LaunchPhase = 'teasing' | 'apertura' | 'cierre';

export interface LaunchPhaseContent {
  id: string;
  phase: LaunchPhase;
  title: string;
  description: string;
  scheduledDate: string;
  scheduledTime: string;
  platform: SocialPlatform;
  contentType: PlannerContentType;
  content: {
    caption: string;
    hashtags: string[];
    mediaUrls?: string[];
  };
  status: 'draft' | 'scheduled' | 'published';
  funnelId?: string;
  campaignId?: string;
  createdAt: string;
}

export interface LaunchOrchestration {
  id: string;
  name: string;
  description?: string;
  funnelId?: string;
  campaignId?: string;
  startDate: string;
  endDate: string;
  phases: {
    teasing: {
      startDate: string;
      endDate: string;
      content: LaunchPhaseContent[];
      status: 'pending' | 'active' | 'completed';
    };
    apertura: {
      startDate: string;
      endDate: string;
      content: LaunchPhaseContent[];
      status: 'pending' | 'active' | 'completed';
    };
    cierre: {
      startDate: string;
      endDate: string;
      content: LaunchPhaseContent[];
      status: 'pending' | 'active' | 'completed';
    };
  };
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'paused';
  createdAt: string;
  updatedAt: string;
}

export interface FunnelOption {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'paused';
  landingPageUrl?: string;
}

export interface CampaignOption {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'paused';
  type: 'promotional' | 'referral' | 'influencer' | 'other';
}

// Content Recycling Types (US-CSS-019 - User Story 2: Reciclar contenido ganador)
export type SourceContentFormat = 'blog' | 'post' | 'carousel' | 'email' | 'newsletter' | 'video';
export type TargetContentFormat = 'reel' | 'post' | 'carousel' | 'story' | 'tiktok' | 'youtube';

export interface WinningContent {
  id: string;
  sourceId: string;
  title: string;
  originalFormat: SourceContentFormat;
  originalPlatform: SocialPlatform | 'blog' | 'email';
  originalContent: {
    text: string;
    mediaUrls?: string[];
    hashtags?: string[];
  };
  performance: {
    engagement: number;
    reach: number;
    conversions?: number;
    engagementRate: number;
    score: number; // 0-100, calculated score
  };
  publishedAt: string;
  topics: string[];
  niche?: TrainerNiche;
}

export interface ContentRecycling {
  id: string;
  sourceContentId: string;
  sourceContent: WinningContent;
  targetFormat: TargetContentFormat;
  targetPlatform: SocialPlatform;
  recycledContent: {
    title: string;
    caption: string;
    hashtags: string[];
    mediaSuggestions?: string[];
    script?: string; // For video formats
    visualCues?: string[]; // For video formats
  };
  status: 'draft' | 'scheduled' | 'published';
  scheduledAt?: string;
  publishedAt?: string;
  performance?: {
    engagement: number;
    reach: number;
    engagementRate: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface RecyclingSuggestion {
  id: string;
  sourceContent: WinningContent;
  suggestedFormats: Array<{
    format: TargetContentFormat;
    platform: SocialPlatform;
    reason: string;
    priority: 'high' | 'medium' | 'low';
    estimatedReach?: number;
  }>;
  createdAt: string;
}

// User Story 1: Enviar contenido aprobado a Campañas & Automatización
export type ApprovedContentType = 'post' | 'reel' | 'carousel' | 'email' | 'whatsapp' | 'video' | 'template';

export interface ApprovedContent {
  id: string;
  title: string;
  type: ApprovedContentType;
  content: {
    text?: string;
    caption?: string;
    subject?: string;
    body?: string;
    htmlContent?: string;
    mediaUrls?: string[];
    hashtags?: string[];
  };
  platform?: SocialPlatform;
  status: 'approved' | 'published';
  approvedAt: string;
  approvedBy: string;
  source: 'planner' | 'clipper' | 'ai-generator' | 'video-studio' | 'transformation' | 'promotional';
  tags?: string[];
  performance?: {
    engagement?: number;
    reach?: number;
    engagementRate?: number;
  };
}

export interface ContentToCampaignsRequest {
  contentIds: string[];
  targetType: 'sequence' | 'campaign' | 'automation' | 'template';
  targetId?: string; // ID de la secuencia/campaña/automatización destino
  channels: Array<'email' | 'whatsapp' | 'sms'>;
  adaptContent?: boolean; // Si debe adaptar el contenido al formato del canal
  includeMedia?: boolean; // Si debe incluir medios adjuntos
  notes?: string;
}

export interface ContentToCampaignsResponse {
  success: boolean;
  message: string;
  createdItems: Array<{
    id: string;
    type: 'message' | 'template' | 'sequence-step';
    channel: 'email' | 'whatsapp' | 'sms';
    contentId: string;
    targetId: string;
  }>;
  warnings?: string[];
}

// User Story 2: Vincular piezas clave a funnels activos
export interface ActiveFunnel {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'draft' | 'paused';
  stage: 'TOFU' | 'MOFU' | 'BOFU';
  revenue?: number;
  conversionRate?: number;
  stages?: Array<{
    id: string;
    name: string;
    type: string;
  }>;
}

export interface ContentToFunnelLinkRequest {
  contentIds: string[];
  funnelId: string;
  stageId?: string;
  placement: 'nurture-email' | 'nurture-whatsapp' | 'landing-page' | 'thank-you-page' | 'follow-up';
  autoAdapt?: boolean; // Adaptar contenido al formato del funnel
  notes?: string;
}

export interface ContentToFunnelLinkResponse {
  success: boolean;
  message: string;
  linkedContent: Array<{
    contentId: string;
    funnelId: string;
    stageId?: string;
    placement: string;
    adaptedContent?: {
      text: string;
      mediaUrls?: string[];
    };
  }>;
  warnings?: string[];
}

// User Story 1: Generación automática de kits de contenido para eventos/retos
export type ContentKitType = 'invitacion' | 'recordatorio' | 'recap';

export interface EventChallengeContentKit {
  id: string;
  eventId: string;
  eventName: string;
  eventType: 'challenge' | 'bootcamp' | 'workshop' | 'retreat' | 'other';
  kitType: ContentKitType;
  content: {
    caption: string;
    hashtags: string[];
    mediaSuggestions?: string[];
    cta?: string;
  };
  platform: SocialPlatform;
  contentType: PlannerContentType;
  scheduledAt?: string;
  status: 'draft' | 'scheduled' | 'published';
  autoGenerated: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface EventChallengeContentKitSet {
  eventId: string;
  eventName: string;
  eventType: 'challenge' | 'bootcamp' | 'workshop' | 'retreat' | 'other';
  startDate: string;
  endDate: string;
  kits: {
    invitacion?: EventChallengeContentKit;
    recordatorio?: EventChallengeContentKit;
    recap?: EventChallengeContentKit;
  };
  autoGenerationEnabled: boolean;
  createdAt: string;
}

export interface GenerateContentKitRequest {
  eventId: string;
  kitTypes: ContentKitType[];
  platforms: SocialPlatform[];
  autoSchedule?: boolean;
  scheduleConfig?: {
    invitacion?: {
      daysBefore: number; // Días antes del evento
      time: string; // HH:mm
    };
    recordatorio?: {
      hoursBefore: number; // Horas antes del evento
      time: string; // HH:mm
    };
    recap?: {
      daysAfter: number; // Días después del evento
      time: string; // HH:mm
    };
  };
}

export interface GenerateContentKitResponse {
  success: boolean;
  message: string;
  kits: EventChallengeContentKit[];
  warnings?: string[];
}

// User Story 2: Analytics mejorado con ventas/revenue
export interface ContentSalesAnalytics {
  postId: string;
  postContent: string;
  platform: 'instagram' | 'facebook' | 'tiktok' | 'twitter' | 'linkedin';
  contentType: 'post' | 'reel' | 'story' | 'video' | 'carousel';
  publishedAt: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    reach: number;
  };
  leadsGenerated: {
    total: number;
    consultations: number;
    interestMessages: number;
    converted: number;
  };
  sales: {
    totalRevenue: number;
    totalSales: number;
    averageOrderValue: number;
    conversionRate: number; // % de leads que se convirtieron en ventas
  };
  leadDetails: Array<{
    leadId: string;
    leadName: string;
    source: string;
    type: 'consultation' | 'interest_message' | 'converted';
    date: string;
    status: string;
    revenue?: number; // Revenue generado por este lead
  }>;
  conversionRate: number; // % de engagement que generó leads
  roi?: number; // Return on investment si hay coste asociado
  priority: 'high' | 'medium' | 'low'; // Prioridad basada en leads + ventas
  pattern?: {
    contentType: string;
    topic: string;
    timeOfDay: string;
    dayOfWeek: string;
  };
}

export interface ContentSalesPattern {
  contentType: string;
  topic: string;
  timeOfDay: string;
  dayOfWeek: string;
  averageLeads: number;
  averageRevenue: number;
  averageSales: number;
  conversionRate: number;
  roi: number;
  postsCount: number;
  priority: 'high' | 'medium' | 'low';
}

export interface ContentSalesAnalyticsSummary {
  totalPosts: number;
  postsWithLeads: number;
  postsWithSales: number;
  totalLeads: number;
  totalConsultations: number;
  totalInterestMessages: number;
  totalSales: number;
  totalRevenue: number;
  averageConversionRate: number;
  averageROI: number;
  topPerformingContent: ContentSalesAnalytics[];
}

// User Story 1: Retroalimentación IA sobre contenido (claridad, CTA, coherencia)
export interface ContentFeedbackRequest {
  content: string;
  contentType?: PlannerContentType;
  platform?: SocialPlatform;
  context?: string; // Contexto adicional sobre el contenido
}

export interface ContentFeedbackScore {
  score: number; // 0-100
  level: 'excelente' | 'bueno' | 'regular' | 'necesita_mejora';
  feedback: string;
  suggestions: string[];
}

export interface ContentAIFeedback {
  id: string;
  contentId?: string; // ID del contenido original si existe
  originalContent: string;
  contentType: PlannerContentType;
  platform?: SocialPlatform;
  feedback: {
    claridad: ContentFeedbackScore;
    cta: ContentFeedbackScore;
    coherencia: ContentFeedbackScore;
    overall: {
      score: number; // Promedio de los tres
      level: 'excelente' | 'bueno' | 'regular' | 'necesita_mejora';
      summary: string;
    };
  };
  suggestions: Array<{
    category: 'claridad' | 'cta' | 'coherencia' | 'general';
    priority: 'high' | 'medium' | 'low';
    suggestion: string;
    example?: string;
  }>;
  improvedVersion?: string; // Versión mejorada sugerida por IA
  createdAt: string;
}

// User Story 2: Guardar aprendizajes por formato/nicho
export type LearningCategory = 'formato' | 'niche' | 'general';

export interface ContentLearning {
  id: string;
  trainerId: string;
  category: LearningCategory;
  format?: ContentFormat;
  niche?: TrainerNiche;
  title: string;
  description: string;
  insights: string[]; // Aprendizajes clave
  bestPractices: string[]; // Mejores prácticas identificadas
  whatWorks: string[]; // Lo que funciona bien
  whatDoesntWork: string[]; // Lo que no funciona
  examples?: Array<{
    content: string;
    performance?: {
      engagement: number;
      reach: number;
      engagementRate: number;
    };
    notes?: string;
  }>;
  tags: string[];
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  updatedAt: string;
}

export interface LearningFilter {
  category?: LearningCategory;
  format?: ContentFormat;
  niche?: TrainerNiche;
  tags?: string[];
  search?: string;
}

export interface SaveLearningRequest {
  category: LearningCategory;
  format?: ContentFormat;
  niche?: TrainerNiche;
  title: string;
  description: string;
  insights: string[];
  bestPractices: string[];
  whatWorks: string[];
  whatDoesntWork: string[];
  examples?: Array<{
    content: string;
    performance?: {
      engagement: number;
      reach: number;
      engagementRate: number;
    };
    notes?: string;
  }>;
  tags: string[];
  priority: 'high' | 'medium' | 'low';
}

// User Story 1: Asignar piezas de contenido a equipo (editor video, diseñador)
export type ContentTeamRole = 'video-editor' | 'designer' | 'copywriter' | 'community-manager';

export type ContentAssignmentStatus = 'pending' | 'in-progress' | 'completed' | 'reviewed' | 'needs-revision' | 'cancelled';

export type ContentAssignmentPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: ContentTeamRole;
  roleLabel: string;
  avatar?: string;
  isActive: boolean;
}

export interface ContentPiece {
  id: string;
  title: string;
  description: string;
  type: PlannerContentType;
  platform?: SocialPlatform;
  content?: {
    caption?: string;
    script?: string;
    mediaUrls?: string[];
    hashtags?: string[];
  };
  source: 'planner' | 'clipper' | 'ai-generator' | 'video-studio' | 'transformation' | 'promotional';
  status: 'draft' | 'assigned' | 'in-production' | 'review' | 'approved' | 'published';
  createdAt: string;
  updatedAt?: string;
}

export interface ContentAssignment {
  id: string;
  contentPieceId: string;
  contentPiece: ContentPiece;
  assignedTo: TeamMember;
  assignedBy: string; // Trainer ID
  role: ContentTeamRole;
  status: ContentAssignmentStatus;
  priority: ContentAssignmentPriority;
  dueDate?: string;
  instructions: string; // Instrucciones específicas sobre qué y cómo producir
  requirements?: string[]; // Requisitos específicos
  referenceMaterials?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
  }>;
  deliverables: {
    type: 'video' | 'design' | 'copy' | 'content';
    description: string;
    format?: string; // Formato esperado (ej: "Reel 30s", "Carousel 5 slides")
    specifications?: string[]; // Especificaciones técnicas
  }[];
  context?: {
    // Contexto adicional para que el equipo entienda el objetivo
    objective?: string;
    targetAudience?: string;
    brandGuidelines?: string;
    tone?: string;
    examples?: string[];
  };
  comments?: Array<{
    id: string;
    userId: string;
    userName: string;
    message: string;
    createdAt: string;
  }>;
  submittedWork?: {
    deliverables: Array<{
      id: string;
      type: string;
      url: string;
      name: string;
    }>;
    submittedAt: string;
    notes?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateContentAssignmentRequest {
  contentPieceId: string;
  assignedToId: string;
  role: ContentTeamRole;
  priority: ContentAssignmentPriority;
  dueDate?: string;
  instructions: string;
  requirements?: string[];
  referenceMaterials?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  deliverables: Array<{
    type: 'video' | 'design' | 'copy' | 'content';
    description: string;
    format?: string;
    specifications?: string[];
  }>;
  context?: {
    objective?: string;
    targetAudience?: string;
    brandGuidelines?: string;
    tone?: string;
    examples?: string[];
  };
}

export interface UpdateContentAssignmentRequest {
  assignmentId: string;
  status?: ContentAssignmentStatus;
  instructions?: string;
  priority?: ContentAssignmentPriority;
  dueDate?: string;
  comments?: Array<{
    message: string;
  }>;
}

// User Story 2: Aprobar contenido desde móvil con preview IA
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'needs-revision';

export interface ContentApproval {
  id: string;
  contentId: string;
  title: string;
  type: PlannerContentType;
  platform?: SocialPlatform;
  content: {
    caption?: string;
    script?: string;
    mediaUrls?: string[];
    hashtags?: string[];
    subject?: string; // Para emails
    body?: string; // Para emails
  };
  status: ApprovalStatus;
  submittedBy: {
    userId: string;
    userName: string;
    userEmail: string;
    role: ContentTeamRole;
  };
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  revisionNotes?: string;
  aiPreview?: {
    // Preview generado por IA del contenido
    previewImage?: string; // Imagen generada por IA del preview
    previewVideo?: string; // Video preview generado por IA
    estimatedEngagement?: number;
    estimatedReach?: number;
    suggestions?: Array<{
      category: 'optimization' | 'engagement' | 'format' | 'timing';
      message: string;
      priority: 'high' | 'medium' | 'low';
    }>;
    qualityScore?: number; // 0-100
    feedback?: string;
  };
  metadata?: {
    scheduledDate?: string;
    campaignId?: string;
    funnelId?: string;
    tags?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface MobileContentApprovalRequest {
  approvalId: string;
  status: 'approved' | 'rejected' | 'needs-revision';
  notes?: string;
  revisionNotes?: string;
}

export interface AIPreviewRequest {
  contentId: string;
  contentType: PlannerContentType;
  platform?: SocialPlatform;
  content: {
    caption?: string;
    script?: string;
    mediaUrls?: string[];
    hashtags?: string[];
  };
}

export interface AIPreviewResponse {
  previewImage?: string;
  previewVideo?: string;
  estimatedEngagement?: number;
  estimatedReach?: number;
  suggestions?: Array<{
    category: 'optimization' | 'engagement' | 'format' | 'timing';
    message: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  qualityScore?: number;
  feedback?: string;
}

// User Story 1: Generar kits de marca coherentes (paleta, tipografías, slogans) para entregar a equipo externo
export interface BrandColor {
  id: string;
  name: string;
  hex: string;
  rgb: {
    r: number;
    g: number;
    b: number;
  };
  usage: 'primary' | 'secondary' | 'accent' | 'neutral' | 'background' | 'text';
  description?: string;
}

export interface BrandTypography {
  id: string;
  name: string;
  fontFamily: string;
  fontWeights: number[];
  usage: 'heading' | 'body' | 'accent' | 'display';
  sizes?: {
    desktop: string;
    mobile: string;
  };
  lineHeight?: string;
  letterSpacing?: string;
  description?: string;
}

export interface BrandSlogan {
  id: string;
  text: string;
  variant: 'primary' | 'secondary' | 'tagline' | 'cta';
  context?: string;
  usage?: string[];
}

export interface BrandKit {
  id: string;
  trainerId: string;
  name: string;
  description?: string;
  colorPalette: BrandColor[];
  typographies: BrandTypography[];
  slogans: BrandSlogan[];
  logoUrl?: string;
  logoVariations?: Array<{
    id: string;
    name: string;
    url: string;
    usage: string;
  }>;
  brandGuidelines?: {
    do: string[];
    dont: string[];
    spacingRules?: string;
    usageExamples?: string[];
  };
  exportFormats?: Array<'pdf' | 'png' | 'svg' | 'json'>;
  sharedWith?: Array<{
    teamMemberId: string;
    teamMemberName: string;
    role: ContentTeamRole;
    sharedAt: string;
    accessLevel: 'view' | 'download' | 'edit';
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface GenerateBrandKitRequest {
  name: string;
  description?: string;
  includeColors: boolean;
  includeTypography: boolean;
  includeSlogans: boolean;
  colorPreferences?: {
    primaryColor?: string;
    style?: 'vibrant' | 'minimal' | 'professional' | 'energetic' | 'calm';
    mood?: string[];
  };
  typographyPreferences?: {
    style?: 'modern' | 'classic' | 'bold' | 'elegant' | 'playful';
    includeWebFonts?: boolean;
  };
  sloganPreferences?: {
    tone?: ToneOfVoice;
    focus?: string[];
    count?: number;
  };
  brandProfileId?: string; // Referencia al BrandProfileConfig si existe
}

export interface GenerateBrandKitResponse {
  success: boolean;
  message: string;
  brandKit: BrandKit;
  warnings?: string[];
}

export interface ShareBrandKitRequest {
  brandKitId: string;
  teamMemberIds: string[];
  accessLevel: 'view' | 'download' | 'edit';
  message?: string;
}

export interface ShareBrandKitResponse {
  success: boolean;
  message: string;
  sharedWith: Array<{
    teamMemberId: string;
    teamMemberName: string;
    accessLevel: 'view' | 'download' | 'edit';
  }>;
}

// User Story 2: IA aprende qué estilos visuales obtienen más engagement para recomendar formatos similares
export type VisualStyleAttribute = 
  | 'color-scheme'
  | 'composition'
  | 'typography-style'
  | 'image-style'
  | 'video-pacing'
  | 'overlay-style'
  | 'text-placement'
  | 'filter-style'
  | 'animation-style'
  | 'aspect-ratio';

export interface VisualStyle {
  id: string;
  attributes: {
    [key in VisualStyleAttribute]?: string;
  };
  description: string;
  tags: string[];
  thumbnailUrl?: string;
  exampleContentIds?: string[];
}

export interface VisualStylePerformance {
  styleId: string;
  style: VisualStyle;
  metrics: {
    totalPosts: number;
    averageEngagement: number;
    averageReach: number;
    averageEngagementRate: number;
    averageLeadsGenerated: number;
    averageRevenue?: number;
    topPerformingContent: Array<{
      contentId: string;
      engagement: number;
      reach: number;
      engagementRate: number;
    }>;
  };
  trend: {
    direction: 'up' | 'down' | 'stable';
    changePercentage: number;
    period: string;
  };
  score: number; // 0-100, calculated based on performance
  priority: 'high' | 'medium' | 'low';
}

export interface VisualStyleRecommendation {
  id: string;
  recommendedStyle: VisualStyle;
  reason: string;
  confidence: number; // 0-100
  expectedEngagement?: {
    min: number;
    max: number;
    average: number;
  };
  similarHighPerformingStyles: Array<{
    styleId: string;
    style: VisualStyle;
    performance: {
      engagement: number;
      engagementRate: number;
    };
  }>;
  suggestedFormats: Array<{
    format: ContentFormat;
    platform: SocialPlatform;
    priority: 'high' | 'medium' | 'low';
    reason: string;
  }>;
  createdAt: string;
}

export interface VisualStyleLearningConfig {
  trainerId: string;
  enabled: boolean;
  learningPeriod: '7d' | '30d' | '90d' | 'all';
  minPostsForLearning: number; // Mínimo de posts con un estilo para considerarlo
  attributesToTrack: VisualStyleAttribute[];
  autoRecommendations: boolean;
  recommendationFrequency: 'daily' | 'weekly' | 'monthly';
  updatedAt?: string;
}

export interface VisualStyleLearningSnapshot {
  config: VisualStyleLearningConfig;
  learnedStyles: VisualStylePerformance[];
  recommendations: VisualStyleRecommendation[];
  insights: Array<{
    id: string;
    title: string;
    description: string;
    type: 'trend' | 'pattern' | 'recommendation' | 'warning';
    priority: 'high' | 'medium' | 'low';
    relatedStyles?: string[];
  }>;
  lastUpdated: string;
}

export interface GetVisualStyleRecommendationsRequest {
  contentType?: ContentFormat;
  platform?: SocialPlatform;
  niche?: TrainerNiche;
  limit?: number;
  minConfidence?: number;
}

export interface GetVisualStyleRecommendationsResponse {
  recommendations: VisualStyleRecommendation[];
  insights: Array<{
    id: string;
    title: string;
    description: string;
    type: 'trend' | 'pattern' | 'recommendation';
    priority: 'high' | 'medium' | 'low';
  }>;
}

// User Story 1: Detección de temas saturados y propuesta de giros creativos
export interface SaturatedTopic {
  id: string;
  topic: string;
  category?: string;
  saturationLevel: 'high' | 'medium' | 'low';
  saturationScore: number; // 0-100, donde 100 es completamente saturado
  frequency: number; // Número de veces que aparece en el contenido
  lastUsed?: string;
  platforms: SocialPlatform[];
  reasons: string[]; // Razones por las que está saturado
  relatedTopics: string[]; // Temas relacionados que también están saturados
}

export interface CreativeTwist {
  id: string;
  originalTopic: string;
  twist: string;
  description: string;
  angle: string; // El ángulo creativo propuesto
  freshnessScore: number; // 0-100, qué tan fresco es este giro
  suggestedFormats: ContentFormat[];
  suggestedPlatforms: SocialPlatform[];
  exampleContent?: {
    hook: string;
    body: string;
    cta: string;
  };
  tags: string[];
  confidence: number; // 0-100, confianza en que este giro funcionará
  priority: 'high' | 'medium' | 'low';
}

export interface SaturatedTopicsAnalysis {
  id: string;
  trainerId: string;
  period: ContentStudioPeriod;
  analyzedAt: string;
  totalTopicsAnalyzed: number;
  saturatedTopics: SaturatedTopic[];
  creativeTwists: CreativeTwist[];
  recommendations: Array<{
    id: string;
    type: 'avoid' | 'refresh' | 'pivot';
    topic: string;
    message: string;
    priority: 'high' | 'medium' | 'low';
    actionItems: string[];
  }>;
  insights: Array<{
    id: string;
    title: string;
    description: string;
    type: 'warning' | 'opportunity' | 'trend';
    priority: 'high' | 'medium' | 'low';
  }>;
}

export interface AnalyzeSaturatedTopicsRequest {
  period?: ContentStudioPeriod;
  minFrequency?: number; // Mínimo de apariciones para considerar un tema
  includeSuggestions?: boolean;
}

export interface GenerateCreativeTwistsRequest {
  topic: string;
  context?: string; // Contexto adicional sobre el tema
  targetAudience?: string;
  niche?: TrainerNiche;
  format?: ContentFormat;
  platform?: SocialPlatform;
  count?: number; // Número de giros a generar
}

// User Story 2: Insights IA post campaña por buyer persona
export interface BuyerPersona {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
  painPoints: string[];
  goals: string[];
  demographics?: {
    ageRange?: string;
    gender?: string;
    location?: string;
  };
}

export interface ContentPerformanceByPersona {
  contentId: string;
  contentTitle: string;
  contentType: PlannerContentType;
  platform: SocialPlatform;
  publishedAt: string;
  personaId: string;
  personaName: string;
  metrics: {
    reach: number;
    impressions: number;
    engagement: number;
    engagementRate: number;
    clicks: number;
    saves: number;
    shares: number;
    comments: number;
    likes: number;
  };
  impact: {
    score: number; // 0-100, score de impacto en esta persona
    level: 'high' | 'medium' | 'low';
    reasons: string[]; // Por qué impactó a esta persona
    sentiment?: 'positive' | 'neutral' | 'negative';
  };
  conversion?: {
    leadsGenerated: number;
    consultations: number;
    sales: number;
    revenue: number;
  };
}

export interface CampaignInsight {
  id: string;
  campaignId?: string;
  campaignName?: string;
  period: {
    startDate: string;
    endDate: string;
  };
  analyzedAt: string;
  totalContent: number;
  buyerPersonas: BuyerPersona[];
  performanceByPersona: ContentPerformanceByPersona[];
  topPerformingContent: Array<{
    contentId: string;
    contentTitle: string;
    overallScore: number;
    topPersona: string;
    metrics: {
      totalEngagement: number;
      totalReach: number;
      engagementRate: number;
    };
  }>;
  insights: Array<{
    id: string;
    type: 'pattern' | 'recommendation' | 'warning' | 'opportunity';
    title: string;
    description: string;
    personaId?: string;
    personaName?: string;
    priority: 'high' | 'medium' | 'low';
    actionable: boolean;
    actionItems?: string[];
    relatedContentIds?: string[];
  }>;
  recommendations: Array<{
    id: string;
    personaId: string;
    personaName: string;
    recommendation: string;
    reason: string;
    suggestedContentTypes: ContentFormat[];
    suggestedTopics: string[];
    priority: 'high' | 'medium' | 'low';
  }>;
}

export interface GetPostCampaignInsightsRequest {
  campaignId?: string;
  startDate?: string;
  endDate?: string;
  period?: ContentStudioPeriod;
  personaIds?: string[]; // Filtrar por personas específicas
  minEngagement?: number; // Mínimo de engagement para considerar contenido
}

export interface GetPostCampaignInsightsResponse {
  insights: CampaignInsight[];
  summary: {
    totalCampaigns: number;
    totalContent: number;
    totalPersonas: number;
    averageEngagementRate: number;
    topPerformingPersona: {
      personaId: string;
      personaName: string;
      averageEngagementRate: number;
    };
  };
}


