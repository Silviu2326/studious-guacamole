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

export interface PlaybookRecord {
  id: string;
  name: string;
  objective: string;
  channels: string[];
  owner: string;
  status: PlaybookStatus;
  impact: 'Alto' | 'Medio' | 'Bajo';
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

export interface ExperimentRecord {
  id: string;
  name: string;
  hypothesis: string;
  status: ExperimentStatus;
  primaryMetric: string;
  uplift: number | null;
}

export type InsightSeverity = 'low' | 'medium' | 'high';

export interface IntelligenceInsight {
  id: string;
  title: string;
  description: string;
  source: string;
  severity: InsightSeverity;
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

