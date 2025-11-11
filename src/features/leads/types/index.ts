// Tipos para el módulo de Leads y Pipeline

export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  source: LeadSource;
  status: LeadStatus;
  stage: PipelineStage;
  score: number;
  assignedTo?: string; // ID del vendedor/entrenador asignado
  businessType: 'entrenador' | 'gimnasio';
  interactions: LeadInteraction[];
  notes: string[];
  tags: string[];
  customFields?: Record<string, any>;
  nurturingSequence?: string; // ID de secuencia activa
  conversionDate?: Date;
  convertedToClientId?: string;
  createdAt: Date;
  updatedAt: Date;
  lastContactDate?: Date;
  nextFollowUpDate?: Date;
  reminders?: LeadReminder[]; // US-06
}

// US-06: Recordatorios
export interface LeadReminder {
  id: string;
  leadId: string;
  dueDate: Date;
  message: string;
  completed: boolean;
  snoozedUntil?: Date;
  createdBy: string;
  createdAt: Date;
}

export type LeadSource =
  | 'instagram'
  | 'facebook'
  | 'tiktok'
  | 'whatsapp'
  | 'referido'
  | 'landing_page'
  | 'google_ads'
  | 'evento'
  | 'visita_centro'
  | 'campaña_pagada'
  | 'contenido_organico'
  | 'otro';

export type LeadStatus =
  | 'new'           // Nuevo
  | 'contacted'     // Contactado
  | 'qualified'     // Calificado
  | 'nurturing'     // En nurturing
  | 'meeting_scheduled' // Reunión agendada
  | 'proposal_sent' // Propuesta enviada
  | 'negotiation'   // En negociación
  | 'converted'     // Convertido
  | 'lost'          // Perdido
  | 'unqualified';  // No calificado

export type PipelineStage =
  | 'captacion'     // Captación
  | 'interes'       // Interés
  | 'calificacion'  // Calificación
  | 'oportunidad'   // Oportunidad
  | 'cierre';       // Cierre

export interface LeadInteraction {
  id: string;
  type: InteractionType;
  channel: InteractionChannel;
  date: Date;
  description: string;
  outcome?: InteractionOutcome;
  userId: string;
  metadata?: Record<string, any>;
}

export type InteractionType =
  | 'email_sent'
  | 'email_opened'
  | 'email_clicked'
  | 'whatsapp_sent'
  | 'whatsapp_replied'
  | 'call_made'
  | 'call_received'
  | 'meeting_scheduled'
  | 'meeting_completed'
  | 'visit_center'
  | 'form_submitted'
  | 'social_media_interaction'
  | 'document_viewed';

export type InteractionChannel =
  | 'email'
  | 'whatsapp'
  | 'phone'
  | 'instagram'
  | 'facebook'
  | 'tiktok'
  | 'in_person'
  | 'landing_page'
  | 'other';

export type InteractionOutcome =
  | 'positive'
  | 'neutral'
  | 'negative'
  | 'no_response';

export interface LeadScoring {
  leadId: string;
  baseScore: number;
  interactionScore: number;
  engagementScore: number;
  timeScore: number;
  totalScore: number;
  factors: ScoringFactor[];
  lastCalculated: Date;
}

export interface ScoringFactor {
  factor: string;
  weight: number;
  value: number;
  description: string;
}

export interface PipelineColumn {
  stage: PipelineStage;
  leads: Lead[];
}

export interface NurturingSequence {
  id: string;
  name: string;
  description?: string;
  businessType: 'entrenador' | 'gimnasio';
  steps: NurturingStep[];
  triggers: NurturingTrigger[];
  status: 'active' | 'paused' | 'draft';
  metrics: NurturingMetrics;
  createdAt: Date;
  updatedAt: Date;
}

export interface NurturingStep {
  id: string;
  order: number;
  name: string;
  channel: InteractionChannel;
  template: MessageTemplate;
  delay: {
    value: number;
    unit: 'minutes' | 'hours' | 'days';
  };
  conditions?: StepCondition[];
}

export interface MessageTemplate {
  id: string;
  subject?: string;
  body: string;
  variables?: string[];
  personalizations?: PersonalizationRule[];
}

export interface PersonalizationRule {
  variable: string;
  source: 'lead_data' | 'user_profile' | 'custom';
  field: string;
  defaultValue?: string;
}

export interface StepCondition {
  type: 'previous_step_opened' | 'previous_step_clicked' | 'no_response' | 'lead_status' | 'custom';
  value?: any;
}

export interface NurturingTrigger {
  event: TriggerEvent;
  conditions?: TriggerCondition[];
}

export type TriggerEvent =
  | 'lead_created'
  | 'lead_status_changed'
  | 'no_response_days'
  | 'score_threshold'
  | 'custom';

export interface TriggerCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
  value: any;
}

export interface NurturingMetrics {
  totalLeads: number;
  activeSequences: number;
  completedSequences: number;
  responseRate: number;
  conversionRate: number;
  averageResponseTime: number; // en horas
}

export interface LeadAnalytics {
  period: {
    start: Date;
    end: Date;
  };
  overview: {
    totalLeads: number;
    newLeads: number;
    convertedLeads: number;
    conversionRate: number;
    averageTimeToConversion: number; // en días
    averageScore: number;
  };
  bySource: SourceBreakdown[];
  byStage: StageBreakdown[];
  byStatus: StatusBreakdown[];
  conversionFunnel: FunnelStep[];
  topPerformers: TopPerformer[];
  trends: TrendPoint[];
}

export interface SourceBreakdown {
  source: LeadSource;
  count: number;
  converted: number;
  conversionRate: number;
  averageScore: number;
}

export interface StageBreakdown {
  stage: PipelineStage;
  count: number;
  averageScore: number;
}

export interface StatusBreakdown {
  status: LeadStatus;
  count: number;
}

export interface FunnelStep {
  stage: PipelineStage;
  count: number;
  percentage: number;
  dropoffRate: number;
}

export interface TopPerformer {
  userId: string;
  userName: string;
  leadsAssigned: number;
  converted: number;
  conversionRate: number;
}

export interface TrendPoint {
  date: Date;
  newLeads: number;
  convertedLeads: number;
  conversionRate: number;
}

export interface LeadAssignment {
  leadId: string;
  assignedTo: string;
  assignedBy: string;
  reason?: string;
  assignedAt: Date;
}

export interface LeadHistory {
  leadId: string;
  events: HistoryEvent[];
}

export interface HistoryEvent {
  id: string;
  type: HistoryEventType;
  date: Date;
  userId: string;
  userName: string;
  description: string;
  metadata?: Record<string, any>;
}

export type HistoryEventType =
  | 'created'
  | 'status_changed'
  | 'stage_changed'
  | 'assigned'
  | 'unassigned'
  | 'score_updated'
  | 'interaction_added'
  | 'note_added'
  | 'converted'
  | 'lost';

// Filtros y búsqueda
export interface LeadFilters {
  status?: LeadStatus[];
  stage?: PipelineStage[];
  source?: LeadSource[];
  assignedTo?: string[];
  scoreRange?: {
    min?: number;
    max?: number;
  };
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
  tags?: string[];
  businessType?: 'entrenador' | 'gimnasio';
}

// Tareas y Recordatorios
export interface Task {
  id: string;
  leadId: string;
  title: string;
  description?: string;
  type: 'call' | 'email' | 'whatsapp' | 'meeting' | 'proposal' | 'follow_up' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: Date;
  completed: boolean;
  completedAt?: Date;
  completedBy?: string;
  assignedTo: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  metadata?: Record<string, any>;
}

// Presupuestos y Cotizaciones
export interface Quote {
  id: string;
  leadId: string;
  quoteNumber: string;
  title: string;
  description?: string;
  items: QuoteItem[];
  subtotal: number;
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
    description?: string;
  };
  tax?: {
    rate: number;
    amount: number;
  };
  total: number;
  currency: string;
  validUntil: Date;
  status: 'draft' | 'sent' | 'viewed' | 'approved' | 'rejected' | 'expired';
  sentAt?: Date;
  viewedAt?: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  notes?: string;
  templateId?: string;
  pdfUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface QuoteItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// Chat y Mensajería
export interface ChatMessage {
  id: string;
  leadId: string;
  channel: 'whatsapp' | 'email' | 'sms' | 'internal';
  direction: 'inbound' | 'outbound';
  content: string;
  timestamp: Date;
  userId?: string;
  userName?: string;
  read: boolean;
  important: boolean;
  metadata?: {
    messageId?: string; // ID del mensaje en WhatsApp/Email
    attachments?: Array<{
      type: 'image' | 'document' | 'audio' | 'video';
      url: string;
      name?: string;
    }>;
    replyTo?: string; // ID del mensaje al que responde
  };
}

// ROI y Atribución
export interface CampaignCost {
  id: string;
  source: LeadSource;
  campaignName: string;
  period: {
    start: Date;
    end: Date;
  };
  cost: number;
  currency: string;
  businessType: 'entrenador' | 'gimnasio';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface ROIMetrics {
  source: LeadSource;
  totalCost: number;
  totalLeads: number;
  convertedLeads: number;
  conversionRate: number;
  costPerLead: number;
  costPerConversion: number;
  totalRevenue: number;
  roi: number;
  roiRatio: number;
  period: {
    start: Date;
    end: Date;
  };
}

export interface ROITrend {
  date: Date;
  source: LeadSource;
  cost: number;
  leads: number;
  conversions: number;
  revenue: number;
  roi: number;
}

export interface ROIAlert {
  id: string;
  source: LeadSource;
  type: 'low_roi' | 'high_cost_per_lead' | 'low_conversion' | 'negative_roi';
  message: string;
  severity: 'warning' | 'critical';
  threshold: number;
  currentValue: number;
  createdAt: Date;
}

// Predicción de Conversión
export interface ConversionPrediction {
  leadId: string;
  probability: number; // 0-100%
  confidence: 'low' | 'medium' | 'high';
  factors: PredictionFactor[];
  recommendations: string[];
  lastCalculated: Date;
}

export interface PredictionFactor {
  name: string;
  impact: number; // -100 a +100, impacto en la probabilidad
  description: string;
  currentValue: any;
  optimalValue?: any;
  suggestion?: string;
}

// Notificaciones
export type NotificationType = 
  | 'lead_no_response'
  | 'follow_up_today'
  | 'hot_lead'
  | 'new_lead'
  | 'lead_converted'
  | 'lead_stage_changed'
  | 'task_due'
  | 'quote_sent'
  | 'roi_alert';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  leadId?: string;
  leadName?: string;
  userId: string;
  businessType: 'entrenador' | 'gimnasio';
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export interface NotificationPreferences {
  userId: string;
  pushEnabled: boolean;
  emailEnabled: boolean;
  types: {
    [key in NotificationType]: {
      push: boolean;
      email: boolean;
    };
  };
  quietHours?: {
    enabled: boolean;
    start: string; // HH:mm
    end: string; // HH:mm
  };
}

// Exportación y Reportes
export type ExportFormat = 'excel' | 'csv' | 'pdf';
export type ReportType = 'monthly' | 'by_seller' | 'by_source' | 'custom';

export interface ExportOptions {
  format: ExportFormat;
  columns?: string[]; // Columnas a incluir
  filters?: {
    status?: LeadStatus[];
    source?: LeadSource[];
    stage?: PipelineStage[];
    dateRange?: {
      start: Date;
      end: Date;
    };
    assignedTo?: string[];
  };
  includeCharts?: boolean;
}

export interface ReportOptions {
  type: ReportType;
  format: 'pdf';
  period?: {
    start: Date;
    end: Date;
  };
  sellerId?: string;
  source?: LeadSource;
  includeCharts?: boolean;
  emailRecipients?: string[];
  schedule?: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    dayOfWeek?: number; // 0-6 para weekly
    dayOfMonth?: number; // 1-31 para monthly
    time?: string; // HH:mm
  };
}

