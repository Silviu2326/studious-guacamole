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

