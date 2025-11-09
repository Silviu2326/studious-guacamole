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

export interface IntelligenceOverviewResponse {
  metrics: IntelligenceMetric[];
  playbooks: PlaybookRecord[];
  feedbackLoops: FeedbackLoopRecord[];
  experiments: ExperimentRecord[];
  insights: IntelligenceInsight[];
}

