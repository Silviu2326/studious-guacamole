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
    lastUpdated: string;
  };
}


