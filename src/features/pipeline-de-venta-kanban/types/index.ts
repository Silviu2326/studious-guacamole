// Tipos para el módulo de Pipeline de Venta Kanban

export type BusinessType = 'entrenador' | 'gimnasio';

// Fases específicas por tipo de negocio
export type EntrenadorPhase = 
  | 'contactado'
  | 'enviado_precio'
  | 'llamada'
  | 'cerrado';

export type GimnasioPhase =
  | 'tour_hecho'
  | 'oferta_enviada'
  | 'matricula_pendiente'
  | 'alta_cerrada';

export type PipelinePhase = EntrenadorPhase | GimnasioPhase;

export interface Sale {
  id: string;
  leadId: string;
  leadName: string;
  leadEmail?: string;
  leadPhone?: string;
  phase: PipelinePhase;
  businessType: BusinessType;
  assignedTo?: string; // ID del vendedor/entrenador asignado
  assignedToName?: string;
  value?: number; // Valor de la venta potencial
  probability: number; // Probabilidad de cierre (0-100)
  expectedCloseDate?: Date;
  lastActivity?: Date;
  notes: string[];
  tags: string[];
  interactions: SaleInteraction[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SaleInteraction {
  id: string;
  type: InteractionType;
  channel: InteractionChannel;
  date: Date;
  description: string;
  userId: string;
  metadata?: Record<string, any>;
}

export type InteractionType =
  | 'call'
  | 'email'
  | 'whatsapp'
  | 'meeting'
  | 'visit'
  | 'quote_sent'
  | 'contract_sent'
  | 'payment_received'
  | 'other';

export type InteractionChannel =
  | 'phone'
  | 'email'
  | 'whatsapp'
  | 'in_person'
  | 'video_call'
  | 'other';

export interface Phase {
  id: string;
  key: PipelinePhase;
  name: string;
  description?: string;
  businessType: BusinessType;
  order: number;
  color?: string;
  icon?: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PhaseColumn {
  phase: Phase;
  sales: Sale[];
  metrics: PhaseMetrics;
}

export interface PhaseMetrics {
  total: number;
  value: number;
  averageProbability: number;
  averageDaysInPhase: number;
  conversionRate: number;
}

export interface PipelineMetrics {
  totalSales: number;
  totalValue: number;
  averageConversionTime: number; // en días
  conversionRate: number;
  byPhase: PhaseMetrics[];
  trends: MetricTrend[];
}

export interface MetricTrend {
  date: Date;
  value: number;
  label: string;
}

export interface PipelineFilters {
  phase?: PipelinePhase[];
  assignedTo?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  valueRange?: {
    min?: number;
    max?: number;
  };
  probabilityRange?: {
    min?: number;
    max?: number;
  };
  search?: string;
  tags?: string[];
  businessType?: BusinessType;
}

export interface PipelineReport {
  id: string;
  name: string;
  description?: string;
  period: {
    start: Date;
    end: Date;
  };
  filters?: PipelineFilters;
  metrics: PipelineMetrics;
  generatedAt: Date;
  generatedBy: string;
}

export interface PhaseConfig {
  phase: Phase;
  automations: AutomationRule[];
  notifications: NotificationRule[];
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: AutomationTrigger;
  actions: AutomationAction[];
  enabled: boolean;
}

export type AutomationTrigger =
  | 'phase_entry'
  | 'days_in_phase'
  | 'probability_threshold'
  | 'no_activity_days'
  | 'custom';

export interface AutomationAction {
  type: 'email' | 'whatsapp' | 'task' | 'notification' | 'phase_move';
  config: Record<string, any>;
}

export interface NotificationRule {
  id: string;
  name: string;
  trigger: NotificationTrigger;
  recipients: string[]; // User IDs
  enabled: boolean;
}

export type NotificationTrigger =
  | 'phase_entry'
  | 'phase_exit'
  | 'probability_change'
  | 'new_sale'
  | 'stale_sale'
  | 'custom';

