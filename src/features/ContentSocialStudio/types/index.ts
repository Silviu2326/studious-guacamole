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
}









