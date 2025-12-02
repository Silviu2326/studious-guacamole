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

export type LeadStatus =
  | 'nuevo'
  | 'contactado'
  | 'cita_agendada'
  | 'visita_realizada'
  | 'no_presentado'
  | 'en_prueba'
  | 'cerrado_ganado'
  | 'cerrado_perdido';

export type LeadStage =
  | 'captacion'
  | 'calificacion'
  | 'agenda'
  | 'visita'
  | 'seguimiento_prueba'
  | 'cierre';

export type LeadChannel = 'whatsapp' | 'email' | 'llamada' | 'sms' | 'presencial';

export interface LeadTimelineEvent {
  id: string;
  type: 'nota' | 'mensaje' | 'llamada' | 'cita' | 'tarea' | 'actualizacion';
  title: string;
  description?: string;
  channel?: LeadChannel;
  createdAt: string;
  createdBy: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface LeadNextAction {
  label: string;
  dueDate?: string;
  owner?: string;
}

export interface LeadSequenceEnrollment {
  id: string;
  label: string;
  status: 'activa' | 'pausada' | 'completada';
}

export interface LeadOpportunity {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: string;
  sede: string;
  owner: string;
  ownerRole: 'comercial' | 'entrenador';
  status: LeadStatus;
  stage: LeadStage;
  probability: number;
  score: number;
  potentialValue: number;
  createdAt: string;
  priority?: 'alta' | 'media' | 'baja';
  objective?: string;
  tags?: string[];
  lastContact?: {
    date: string;
    channel: LeadChannel;
    summary?: string;
  };
  nextAction?: LeadNextAction;
  sequences?: LeadSequenceEnrollment[];
  timeline: LeadTimelineEvent[];
  notes?: string;
}

export interface PipelineStage {
  id: string;
  label: string;
  status: LeadStatus;
  leads: number;
  potentialValue: number;
  conversionFromPrevious: number;
  slaHours: number;
}

export interface LeadSegment {
  id: string;
  label: string;
  description: string;
  totalLeads: number;
  conversionRate: number;
  averageValue: number;
  dominantStatus?: LeadStatus;
  topSource?: string;
  owners?: string[];
}

export interface LeadWorkloadInsight {
  slaBreached: number;
  leadsToday: number;
  appointmentsToday: number;
  followUpsDue: number;
}

