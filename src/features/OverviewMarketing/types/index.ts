export type MarketingOverviewPeriod = '7d' | '30d' | '90d';

export type TrendDirection = 'up' | 'down' | 'neutral';

export interface MarketingKPI {
  id: string;
  label: string;
  value: number;
  changePercentage?: number;
  period: MarketingOverviewPeriod;
  format?: 'number' | 'currency' | 'percentage';
  target?: number;
  trendDirection: TrendDirection;
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
}

export interface MarketingOverviewSnapshot {
  period: MarketingOverviewPeriod;
  kpis: MarketingKPI[];
  campaigns: CampaignPerformance[];
  funnels: FunnelPerformance[];
  socialGrowth: SocialGrowthMetric[];
  events: UpcomingEvent[];
  aiSuggestions: AISuggestion[];
}


