export type UserRole = 'gym' | 'trainer';

export type RiskLevel = 'low' | 'medium' | 'high';

export type PaymentStatus = 'paid' | 'failed' | 'pending_renewal' | 'pending';

export type RetentionActionType = 'call' | 'email' | 'sms' | 'meeting' | 'offer';

export type RetentionActionOutcome = 'positive' | 'neutral' | 'negative' | 'pending';

export interface ClientRisk {
  id: string;
  name: string;
  email: string;
  phone?: string;
  riskLevel: RiskLevel;
  lastCheckIn?: string; // ISO date string - para gimnasio
  daysSinceLastCheckIn?: number; // para gimnasio
  membership?: string; // Plan de membresía - para gimnasio
  paymentStatus?: PaymentStatus; // para gimnasio
  missedSessions?: number; // para entrenador
  lastSessionDate?: string; // ISO date string - para entrenador
  workoutAdherence?: number; // Porcentaje - para entrenador
  nutritionAdherence?: number; // Porcentaje - para entrenador
  lastCommunication?: string; // ISO date string - para entrenador
  mrr?: number; // Monthly Recurring Revenue - para gimnasio
}

export interface RiskFilters {
  lastCheckInDays?: number; // para gimnasio
  paymentStatus?: PaymentStatus; // para gimnasio
  riskLevel?: RiskLevel;
  missedSessions?: number; // para entrenador
  minWorkoutAdherence?: number; // para entrenador
  minNutritionAdherence?: number; // para entrenador
}

export interface RetentionAction {
  id: string;
  clientId: string;
  agentId: string;
  actionType: RetentionActionType;
  notes: string;
  outcome?: RetentionActionOutcome;
  createdAt: string; // ISO date string
}

export interface RetentionAnalytics {
  totalAtRisk: number;
  churnRateMonthly: number;
  retentionSuccessRate: number;
  avgDaysSinceLastVisit: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
  };
  mrrAtRisk?: number; // Solo para gimnasio
}

export interface BatchActionRequest {
  clientIds: string[];
  action: {
    type: 'email' | 'sms' | 'assign_task';
    templateId?: string;
    message?: string;
  };
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RiskClientsResponse {
  data: ClientRisk[];
  pagination: PaginationMeta;
}

