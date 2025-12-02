// Tipos para Campañas y Outreach

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  objective: CampaignObjective;
  status: CampaignStatus;
  type: CampaignType;
  channels: CommunicationChannel[];
  audience: AudienceSegment;
  content: CampaignContent;
  schedule: CampaignSchedule;
  metrics: CampaignMetrics;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export type CampaignObjective = 
  | 'captacion'      // Captar nuevos socios
  | 'retencion'      // Retener socios existentes
  | 'promocion'      // Promocionar servicios/productos
  | 'reactivacion'   // Reactivar socios inactivos
  | 'upselling'      // Venta cruzada
  | 'nurturing';     // Nutrición de leads

export type CampaignStatus = 
  | 'draft'          // Borrador
  | 'scheduled'      // Programada
  | 'active'         // Activa
  | 'paused'         // Pausada
  | 'completed'      // Completada
  | 'cancelled';     // Cancelada

export type CampaignType = 
  | 'one_time'       // Campaña única
  | 'recurring'      // Campaña recurrente
  | 'automated'      // Campaña automatizada
  | 'drip';          // Secuencia de goteo

export type CommunicationChannel = 
  | 'whatsapp'
  | 'email'
  | 'sms'
  | 'push_notification'
  | 'in_app';

export interface AudienceSegment {
  id: string;
  name: string;
  description?: string;
  criteria: SegmentationCriteria;
  size: number;
  members: string[]; // IDs de usuarios
}

export interface SegmentationCriteria {
  demographics?: {
    ageRange?: [number, number];
    gender?: 'male' | 'female' | 'other' | 'all';
    location?: string[];
  };
  behavior?: {
    membershipStatus?: 'active' | 'inactive' | 'expired' | 'trial';
    lastVisit?: {
      operator: 'before' | 'after' | 'between';
      value: Date | [Date, Date];
    };
    attendanceFrequency?: {
      operator: 'greater_than' | 'less_than' | 'equal_to';
      value: number;
      period: 'week' | 'month';
    };
    purchaseHistory?: {
      hasProducts?: boolean;
      totalSpent?: {
        operator: 'greater_than' | 'less_than';
        value: number;
      };
    };
  };
  engagement?: {
    emailOpens?: number;
    whatsappResponses?: number;
    appUsage?: 'high' | 'medium' | 'low';
  };
  customFields?: Record<string, any>;
}

export interface CampaignContent {
  templates: MessageTemplate[];
  personalizations: PersonalizationRule[];
}

export interface MessageTemplate {
  id: string;
  channel: CommunicationChannel;
  subject?: string; // Para email
  title?: string;
  body: string;
  mediaUrl?: string;
  ctaButtons?: CTAButton[];
  variables: string[]; // Variables para personalización
}

export interface CTAButton {
  text: string;
  action: 'url' | 'phone' | 'whatsapp' | 'custom';
  value: string;
}

export interface PersonalizationRule {
  variable: string;
  source: 'user_profile' | 'membership_data' | 'custom';
  field: string;
  defaultValue?: string;
}

export interface CampaignSchedule {
  type: 'immediate' | 'scheduled' | 'recurring' | 'trigger_based';
  startDate?: Date;
  endDate?: Date;
  timezone: string;
  frequency?: {
    type: 'daily' | 'weekly' | 'monthly';
    interval: number;
    daysOfWeek?: number[]; // 0-6, domingo a sábado
    dayOfMonth?: number;
  };
  triggers?: AutomationTrigger[];
}

export interface AutomationTrigger {
  id: string;
  name: string;
  event: TriggerEvent;
  conditions?: TriggerCondition[];
  delay?: {
    value: number;
    unit: 'minutes' | 'hours' | 'days';
  };
}

export type TriggerEvent = 
  | 'user_signup'
  | 'membership_expiring'
  | 'membership_expired'
  | 'no_visit_days'
  | 'purchase_made'
  | 'birthday'
  | 'custom_event';

export interface TriggerCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
  value: any;
}

export interface CampaignMetrics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  converted: number;
  unsubscribed: number;
  bounced: number;
  revenue?: number;
  cost?: number;
  roi?: number;
  engagementRate: number;
  conversionRate: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  unsubscribeRate: number;
}

// Outreach específico
export interface OutreachSequence {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'paused' | 'completed';
  steps: OutreachStep[];
  triggers: AutomationTrigger[];
  audience: AudienceSegment;
  metrics: OutreachMetrics;
  createdAt: Date;
  updatedAt: Date;
}

export interface OutreachStep {
  id: string;
  order: number;
  name: string;
  channel: CommunicationChannel;
  template: MessageTemplate;
  delay: {
    value: number;
    unit: 'minutes' | 'hours' | 'days';
  };
  conditions?: StepCondition[];
}

export interface StepCondition {
  type: 'previous_step_opened' | 'previous_step_clicked' | 'no_response' | 'custom';
  value?: any;
}

export interface OutreachMetrics {
  totalContacts: number;
  activeSequences: number;
  completedSequences: number;
  responseRate: number;
  conversionRate: number;
  averageResponseTime: number; // en horas
}

// Analytics y Reportes
export interface CampaignAnalytics {
  campaignId: string;
  period: {
    start: Date;
    end: Date;
  };
  overview: CampaignMetrics;
  channelBreakdown: Record<CommunicationChannel, CampaignMetrics>;
  audienceInsights: AudienceInsights;
  timeSeriesData: TimeSeriesPoint[];
  topPerformingContent: ContentPerformance[];
}

export interface AudienceInsights {
  totalReach: number;
  uniqueEngagement: number;
  segmentPerformance: SegmentPerformance[];
  demographicBreakdown: Record<string, number>;
}

export interface SegmentPerformance {
  segmentId: string;
  segmentName: string;
  metrics: CampaignMetrics;
}

export interface TimeSeriesPoint {
  timestamp: Date;
  sent: number;
  opened: number;
  clicked: number;
  converted: number;
}

export interface ContentPerformance {
  templateId: string;
  templateName: string;
  channel: CommunicationChannel;
  metrics: CampaignMetrics;
  score: number; // Puntuación de rendimiento
}

// ROI Tracking
export interface ROIData {
  campaignId: string;
  totalCost: number;
  totalRevenue: number;
  roi: number;
  costPerAcquisition: number;
  lifetimeValue: number;
  paybackPeriod: number; // en días
  breakdown: ROIBreakdown;
}

export interface ROIBreakdown {
  channelCosts: Record<CommunicationChannel, number>;
  channelRevenue: Record<CommunicationChannel, number>;
  segmentROI: Record<string, number>;
  timeToConversion: number[]; // distribución en días
}

// Estados de la aplicación
export interface CampaignsState {
  campaigns: Campaign[];
  outreachSequences: OutreachSequence[];
  audienceSegments: AudienceSegment[];
  templates: MessageTemplate[];
  analytics: Record<string, CampaignAnalytics>;
  loading: boolean;
  error: string | null;
}

// Filtros y búsqueda
export interface CampaignFilters {
  status?: CampaignStatus[];
  type?: CampaignType[];
  objective?: CampaignObjective[];
  channels?: CommunicationChannel[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

export interface OutreachFilters {
  status?: ('active' | 'paused' | 'completed')[];
  channels?: CommunicationChannel[];
  responseRate?: {
    min?: number;
    max?: number;
  };
  search?: string;
}