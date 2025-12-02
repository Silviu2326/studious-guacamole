// Tipos TypeScript para el módulo de Landing Pages

export interface LandingPage {
  pageId: string;
  name: string;
  status: 'draft' | 'published' | 'archived';
  url?: string;
  pageSlug?: string;
  contentJson: LandingPageContent;
  seoMetadata?: SEOMetadata;
  stats?: LandingPageStats;
  createdAt: string;
  updatedAt?: string;
  templateId?: string;
}

export interface LandingPageContent {
  blocks: ContentBlock[];
}

export interface ContentBlock {
  id: string;
  type: 'headline' | 'paragraph' | 'image' | 'video' | 'button' | 'form' | 'testimonial' | 'feature' | 'pricing';
  content?: string;
  props?: Record<string, any>;
  style?: Record<string, any>;
}

export interface SEOMetadata {
  title?: string;
  description?: string;
  ogImage?: string;
}

export interface LandingPageStats {
  visits: number;
  leads: number;
  conversionRate: number;
  uniqueVisitors?: number;
  bounceRate?: number;
  revenue?: number;
}

export interface LandingPageTemplate {
  templateId: string;
  name: string;
  description: string;
  thumbnail?: string;
  category: 'promotion' | 'program-sale' | 'trial' | 'webinar' | 'generic';
  contentJson: LandingPageContent;
}

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea' | 'checkbox';
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[]; // Para campos select
}

export interface LeadForm {
  fields: FormField[];
  submitAction: 'redirect' | 'message' | 'webhook';
  redirectUrl?: string;
  successMessage?: string;
  privacyPolicyRequired: boolean;
  privacyPolicyUrl?: string;
}

export interface AnalyticsData {
  pageId: string;
  period: 'day' | 'week' | 'month' | 'year' | 'custom';
  startDate?: string;
  endDate?: string;
  metrics: {
    visits: number;
    uniqueVisitors: number;
    leads: number;
    conversionRate: number;
    bounceRate: number;
    revenue?: number;
    trafficSources: TrafficSource[];
  };
}

export interface TrafficSource {
  source: 'direct' | 'social' | 'referral' | 'search' | 'email' | 'paid';
  visits: number;
  percentage: number;
}

export interface LandingPageListResponse {
  data: LandingPage[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface CreateLandingPageRequest {
  name: string;
  templateId?: string;
}

export interface UpdateLandingPageRequest {
  name?: string;
  pageSlug?: string;
  contentJson?: LandingPageContent;
  status?: 'draft' | 'published' | 'archived';
  seoMetadata?: SEOMetadata;
}

