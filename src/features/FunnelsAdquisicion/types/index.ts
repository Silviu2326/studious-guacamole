export type FunnelsAcquisitionPeriod = '7d' | '30d' | '90d';

export type TrendDirection = 'up' | 'down' | 'neutral';

export interface AcquisitionKPI {
  id: string;
  label: string;
  value: number;
  changePercentage?: number;
  period: FunnelsAcquisitionPeriod;
  format?: 'number' | 'currency' | 'percentage';
  target?: number;
  trendDirection: TrendDirection;
}

export interface AcquisitionCampaign {
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
  qualifiedRate: number;
  startDate: string;
  endDate?: string;
}

export interface AcquisitionFunnelPerformance {
  id: string;
  name: string;
  stage: 'TOFU' | 'MOFU' | 'BOFU';
  revenue: number;
  conversionRate: number;
  velocityDays: number;
  growthPercentage: number;
  qualifiedLeads: number;
}

export interface AcquisitionEvent {
  id: string;
  title: string;
  date: string;
  type: 'webinar' | 'live' | 'workshop' | 'challenge';
  status: 'draft' | 'scheduled' | 'registration_open';
  targetAudience: string;
  registrations: number;
  goal: number;
  host: string;
  funnelLink?: string;
}

export interface AcquisitionAISuggestion {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  rationale: string;
  cta: string;
}

export interface WorkspaceFocusMetric {
  id: string;
  label: string;
  value: string;
  helper?: string;
  change?: number;
  trend?: TrendDirection;
}

export interface WorkspaceAction {
  id: string;
  title: string;
  description: string;
  cta: string;
  href?: string;
}

export interface WorkspaceAutomation {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
}

export interface WorkspaceResource {
  id: string;
  label: string;
  href: string;
}

export interface AcquisitionWorkspaceBlueprint {
  id: string;
  title: string;
  description: string;
  focusMetrics: WorkspaceFocusMetric[];
  recommendedActions: WorkspaceAction[];
  automations: WorkspaceAutomation[];
  resources: WorkspaceResource[];
}

export interface FunnelsAcquisitionSnapshot {
  period: FunnelsAcquisitionPeriod;
  kpis: AcquisitionKPI[];
  campaigns: AcquisitionCampaign[];
  funnels: AcquisitionFunnelPerformance[];
  events: AcquisitionEvent[];
  aiSuggestions: AcquisitionAISuggestion[];
  workspaceBlueprints: AcquisitionWorkspaceBlueprint[];
}



