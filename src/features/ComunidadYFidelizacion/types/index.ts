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

export interface Testimonial {
  id: string;
  customerName: string;
  role: string;
  quote: string;
  score: number;
  channel: string;
  impactTag: string;
  createdAt: string;
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

export interface EngagementProgram {
  id: string;
  title: string;
  description: string;
  owner: string;
  kpi: string;
  progress: number;
  trend: 'positive' | 'negative' | 'flat';
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
}



