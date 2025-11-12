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

// US-FA-008: Sistema de alertas y tareas automáticas para leads en riesgo
export type LeadRiskLevel = 'high' | 'medium' | 'low';
export type LeadStage = 'consulta_solicitada' | 'consulta_realizada' | 'primera_sesion_pagada' | 'cliente_activo';
export type SuggestedActionType = 'email' | 'whatsapp' | 'llamada' | 'oferta_especial' | 'recordatorio';

export interface LeadRiskAlert {
  id: string;
  leadId: string;
  leadName: string;
  leadEmail?: string;
  leadPhone?: string;
  currentStage: LeadStage;
  riskLevel: LeadRiskLevel;
  daysSinceLastAction: number;
  lastActionDate: string;
  reason: string;
  suggestedActions: SuggestedAction[];
  createdAt: string;
}

export interface SuggestedAction {
  id: string;
  type: SuggestedActionType;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  template?: string;
  scheduledFor?: string;
  completed?: boolean;
  completedAt?: string;
}

// US-FA-009: Métrica de conversión de primera sesión a cliente con plan recurrente o bono
export interface FirstSessionConversionMetric {
  period: FunnelsAcquisitionPeriod;
  totalFirstSessions: number;
  convertedToRecurring: number;
  convertedToBonus: number;
  totalConverted: number;
  conversionRate: number;
  conversionRateRecurring: number;
  conversionRateBonus: number;
  averageDaysToConvert: number;
  averageValueRecurring: number;
  averageValueBonus: number;
  totalRevenue: number;
  comparison?: PeriodComparison;
  suggestions: ConversionSuggestion[];
}

export interface PeriodComparison {
  previousPeriod: FunnelsAcquisitionPeriod;
  conversionRateChange: number;
  conversionRateChangePercentage: number;
  totalConvertedChange: number;
  totalConvertedChangePercentage: number;
  trendDirection: TrendDirection;
}

export interface ConversionSuggestion {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: 'follow_up' | 'pricing' | 'offer' | 'timing' | 'communication';
}

// US-FA-010: Integración con métricas de redes sociales
export type SocialMediaPlatform = 'instagram' | 'facebook' | 'tiktok' | 'youtube' | 'linkedin';

export interface SocialMediaPost {
  id: string;
  platform: SocialMediaPlatform;
  postId: string;
  content: string;
  imageUrl?: string;
  publishedAt: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    totalEngagement: number;
  };
  leadsGenerated: number;
  inquiriesGenerated: number;
  engagementToLeadRate: number;
  timeInvestedMinutes: number;
  roi: number; // ROI basado en tiempo invertido vs leads generados
}

export interface SocialMediaMetrics {
  period: FunnelsAcquisitionPeriod;
  platforms: SocialMediaPlatformMetrics[];
  topPosts: SocialMediaPost[];
  totalEngagement: number;
  totalLeads: number;
  totalInquiries: number;
  totalTimeInvestedMinutes: number;
  averageROI: number;
  comparison?: PeriodComparison;
}

export interface SocialMediaPlatformMetrics {
  platform: SocialMediaPlatform;
  postsCount: number;
  totalEngagement: number;
  leadsGenerated: number;
  inquiriesGenerated: number;
  engagementToLeadRate: number;
  timeInvestedMinutes: number;
  roi: number;
  trendDirection: TrendDirection;
}

// US-FA-012: Sistema de tracking de referidos
export interface ReferralSource {
  id: string;
  referrerId: string;
  referrerName: string;
  referrerEmail?: string;
  referrerPhone?: string;
  referrerType: 'cliente' | 'colaborador' | 'influencer' | 'otro';
  totalReferrals: number;
  convertedReferrals: number;
  conversionRate: number;
  totalRevenue: number;
  averageCustomerValue: number;
  lifetimeValue: number;
  firstReferralDate: string;
  lastReferralDate: string;
}

export interface ReferralProgramMetrics {
  period: FunnelsAcquisitionPeriod;
  totalReferrals: number;
  convertedReferrals: number;
  conversionRate: number;
  totalRevenue: number;
  averageCustomerValue: number;
  topReferrers: ReferralSource[];
  referralSources: ReferralSource[];
  programPerformance: {
    totalParticipants: number;
    activeReferrers: number;
    averageReferralsPerPerson: number;
    programROI: number;
  };
  comparison?: PeriodComparison;
  suggestions: ReferralProgramSuggestion[];
}

export interface ReferralProgramSuggestion {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: 'incentives' | 'communication' | 'tracking' | 'promotion' | 'optimization';
}










