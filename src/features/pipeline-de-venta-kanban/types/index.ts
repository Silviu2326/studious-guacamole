// Tipos para el módulo de Pipeline de Venta Kanban

export type BusinessType = 'entrenador' | 'gimnasio';

// US-11: Fases específicas por tipo de negocio
export type EntrenadorPhase = 
  | 'contacto_nuevo'
  | 'primera_charla'
  | 'enviado_precio'
  | 'llamada'
  | 'cliente'
  | 'descartado';

export type GimnasioPhase =
  | 'tour_hecho'
  | 'oferta_enviada'
  | 'matricula_pendiente'
  | 'alta_cerrada';

export type PipelinePhase = EntrenadorPhase | GimnasioPhase;

// US-13: Tipos de servicio
export type ServiceType = '1-1' | 'online' | 'nutricion' | 'combo' | 'grupal';

export const SERVICE_LABELS: Record<ServiceType, string> = {
  '1-1': 'Entreno 1:1',
  'online': 'Plan Online',
  'nutricion': 'Nutrición',
  'combo': 'Entreno + Nutrición',
  'grupal': 'Clase Grupal'
};

export const SERVICE_COLORS: Record<ServiceType, { bg: string; text: string; border: string }> = {
  '1-1': { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
  'online': { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
  'nutricion': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
  'combo': { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
  'grupal': { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-300' }
};

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
  lastContact?: Date; // US-14: Última vez que se contactó al lead
  notes: string[];
  tags: string[];
  serviceType?: ServiceType; // US-13: Tipo de servicio
  interactions: SaleInteraction[];
  createdAt: Date;
  updatedAt: Date;
  phaseHistory?: PhaseHistoryEntry[]; // US-12: Historial de movimientos
  scheduledCall?: ScheduledCall; // US-16: Llamada agendada
  followUpNotificationSent?: boolean; // US-15: Si se envió notificación de seguimiento
  priceSentAt?: Date; // US-17: Cuándo se enviaron los precios
  priceSentMessage?: string; // US-17: Mensaje de precios enviado
}

// US-16: Llamada agendada
export interface ScheduledCall {
  id: string;
  saleId: string;
  scheduledDate: Date;
  reminderSent?: boolean;
  completed?: boolean;
  notes?: string;
  createdAt: Date;
}

// US-12: Historial de cambios de fase
export interface PhaseHistoryEntry {
  id: string;
  fromPhase?: PipelinePhase;
  toPhase: PipelinePhase;
  movedBy: string;
  movedAt: Date;
  reason?: string;
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

