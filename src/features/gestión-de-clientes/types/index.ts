export type ClientStatus = 'activo' | 'en-riesgo' | 'perdido';

export type ClientType = 'cliente' | 'socio';

export type RetentionReason = 
  | 'problemas-economicos'
  | 'falta-tiempo'
  | 'mudanza'
  | 'insatisfaccion'
  | 'lesion'
  | 'otro';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: ClientStatus;
  type: ClientType;
  registrationDate: string;
  lastCheckIn?: string;
  lastSession?: string;
  planId?: string;
  planName?: string;
  membershipStatus?: 'activa' | 'vencida' | 'pendiente';
  paymentStatus?: 'al-dia' | 'atrasado' | 'moroso';
  daysSinceLastVisit?: number;
  adherenceRate?: number;
  riskScore?: number;
  notes?: string;
  trainerId?: string; // Para entrenadores personales
  gymId?: string; // Para gimnasios
}

export interface Client360Profile extends Client {
  history: ClientHistoryItem[];
  documents: ClientDocument[];
  consentements: ClientConsentement[];
  metrics: ClientMetrics;
  interactions: ClientInteraction[];
}

export interface ClientHistoryItem {
  id: string;
  date: string;
  type: 'check-in' | 'session' | 'payment' | 'plan-change' | 'note';
  description: string;
  metadata?: Record<string, any>;
}

export interface ClientDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadDate: string;
}

export interface ClientConsentement {
  id: string;
  type: 'rgpd' | 'medico' | 'imagen';
  granted: boolean;
  date: string;
  expiryDate?: string;
}

export interface ClientMetrics {
  totalSessions: number;
  totalCheckIns: number;
  adherenceRate: number;
  averageSessionDuration: number;
  totalRevenue: number;
  lastPaymentDate?: string;
  nextPaymentDate?: string;
}

export interface ClientInteraction {
  id: string;
  date: string;
  type: 'email' | 'whatsapp' | 'sms' | 'call' | 'meeting';
  description: string;
  outcome?: string;
}

export interface RetentionAction {
  id: string;
  clientId: string;
  type: 'email' | 'whatsapp' | 'sms' | 'call' | 'offer';
  scheduledDate: string;
  executedDate?: string;
  status: 'pending' | 'executed' | 'cancelled';
  outcome?: 'recovered' | 'lost' | 'pending';
  notes?: string;
}

export interface ChurnAnalytics {
  totalClients: number;
  activeClients: number;
  riskClients: number;
  lostClients: number;
  churnRate: number;
  retentionRate: number;
  averageLifetime: number;
  topChurnReasons: Array<{
    reason: RetentionReason;
    count: number;
    percentage: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    active: number;
    risk: number;
    lost: number;
  }>;
}

export interface ClientSegment {
  id: string;
  name: string;
  criteria: SegmentCriteria;
  clientIds: string[];
  clientCount: number;
}

export interface SegmentCriteria {
  status?: ClientStatus[];
  planId?: string;
  adherenceRate?: { min: number; max: number };
  daysSinceLastVisit?: { min: number; max: number };
  riskScore?: { min: number; max: number };
  paymentStatus?: string[];
}

