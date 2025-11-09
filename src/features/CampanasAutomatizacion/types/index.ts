export type MessagingChannel = 'email' | 'sms' | 'whatsapp' | 'push' | 'in-app';

export type CampaignStatus = 'draft' | 'scheduled' | 'running' | 'paused' | 'completed';

export interface MissionControlSummary {
  id: string;
  label: string;
  description: string;
  value: number;
  changePercentage: number;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
  channelFocus?: MessagingChannel | 'multi';
}

export interface MultiChannelCampaign {
  id: string;
  name: string;
  objective: string;
  status: CampaignStatus;
  owner: string;
  launchDate: string;
  channels: MessagingChannel[];
  targetSegments: string[];
  budget: number;
  spend: number;
  revenue: number;
  conversionRate: number;
  progression: number;
  nextAction: string;
  impactScore: number;
}

export interface EmailProgram {
  id: string;
  name: string;
  type: 'newsletter' | 'product-update' | 'promotion' | 'onboarding' | 'retention';
  cadence: string;
  audienceSize: number;
  openRate: number;
  clickRate: number;
  revenueAttributed: number;
  bestSubject?: string;
  status: CampaignStatus;
  aiRecommendation?: string;
}

export interface LifecycleSequence {
  id: string;
  name: string;
  goal: 'activation' | 'retention' | 'upsell' | 'winback' | 'churn-prevention';
  steps: number;
  activeContacts: number;
  completionRate: number;
  avgTimeToConvert: number;
  lastOptimization: string;
  bottleneckStep?: number;
  automationScore: number;
  status: CampaignStatus;
}

export interface MessagingAutomation {
  id: string;
  name: string;
  trigger: string;
  channel: Extract<MessagingChannel, 'sms' | 'whatsapp' | 'push'>;
  variantCount: number;
  audienceSize: number;
  responseRate: number;
  SLA: string;
  status: CampaignStatus;
  lastTriggered: string;
  ownedBy: string;
  recommendedImprovement?: string;
}

export interface ChannelHealthMetric {
  id: string;
  channel: MessagingChannel | 'multi';
  deliverability: number;
  engagement: number;
  satisfaction: number;
  automationCoverage: number;
  incidents: number;
  highlight: string;
}

export interface AutomationRoadmapItem {
  id: string;
  title: string;
  description: string;
  owner: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'S' | 'M' | 'L';
  eta: string;
  dependencies?: string[];
  tags: string[];
  status: 'backlog' | 'in-progress' | 'ready' | 'launched';
}

export interface MissionControlSnapshot {
  summary: MissionControlSummary[];
  campaigns: MultiChannelCampaign[];
  emailPrograms: EmailProgram[];
  lifecycleSequences: LifecycleSequence[];
  messagingAutomations: MessagingAutomation[];
  channelHealth: ChannelHealthMetric[];
  roadmap: AutomationRoadmapItem[];
}


