export interface SalesMetric {
  id: string;
  title: string;
  value: number;
  subtitle?: string;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: number;
    label?: string;
  };
}

export interface PipelineStage {
  id: string;
  label: string;
  conversionRate: number;
  deals: number;
  velocityDays: number;
}

export interface LeadOpportunity {
  id: string;
  name: string;
  source: string;
  owner: string;
  status: 'nuevo' | 'en_progreso' | 'ganado' | 'perdido';
  value: number;
  createdAt: string;
  nextAction?: string;
  probability: number;
}

export interface LeadSegment {
  id: string;
  label: string;
  description: string;
  totalLeads: number;
  conversionRate: number;
  averageValue: number;
}

