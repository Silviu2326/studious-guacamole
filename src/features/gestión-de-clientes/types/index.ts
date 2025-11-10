export type ClientStatus = 'activo' | 'en-riesgo' | 'perdido';

export type ClientType = 'cliente' | 'socio';

export type MetodoPago = 'efectivo' | 'transferencia' | 'tarjeta' | 'nequi' | 'daviplata' | 'pse' | 'otro';

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
  metodoPagoPreferido?: MetodoPago; // Método de pago preferido del cliente
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

// Tipos para el sistema de chat/mensajería
export interface ChatMessage {
  id: string;
  clienteId: string;
  senderId: string;
  senderType: 'trainer' | 'client';
  senderName: string;
  content: string;
  timestamp: string;
  read: boolean;
  attachments?: ChatAttachment[];
}

export interface ChatAttachment {
  id: string;
  messageId: string;
  fileName: string;
  fileType: string;
  fileSize: number; // en bytes
  url: string;
  uploadDate: string;
}

export interface ChatConversation {
  clienteId: string;
  clienteName: string;
  lastMessage?: ChatMessage;
  unreadCount: number;
  lastActivity: string;
}

// Tipos para el sistema de timeline/progreso
export interface TimelineEntry {
  id: string;
  clienteId: string;
  date: string;
  type: 'photo' | 'measurement' | 'milestone';
  title: string;
  description?: string;
  photos?: TimelinePhoto[];
  measurements?: PhysicalMeasurement[];
  metadata?: Record<string, any>;
}

export interface TimelinePhoto {
  id: string;
  timelineEntryId: string;
  url: string;
  thumbnailUrl?: string;
  description?: string;
  photoType: 'front' | 'side' | 'back' | 'progress' | 'other';
  uploadDate: string;
}

export interface PhysicalMeasurement {
  id: string;
  timelineEntryId: string;
  type: 'weight' | 'body-fat' | 'muscle-mass' | 'chest' | 'waist' | 'hips' | 'arms' | 'thighs' | 'height' | 'bmi' | 'other';
  value: number;
  unit: 'kg' | 'g' | 'cm' | 'm' | '%' | 'bmi';
  notes?: string;
}

// Tipos para el asistente virtual de retención
export interface RetentionSuggestion {
  id: string;
  clientId: string;
  priority: 'high' | 'medium' | 'low';
  actionType: 'email' | 'whatsapp' | 'sms' | 'call' | 'offer' | 'personalized-message';
  title: string;
  description: string;
  suggestedMessage?: string;
  suggestedTiming?: string;
  reasoning: string;
  expectedImpact: 'high' | 'medium' | 'low';
  confidence: number; // 0-100
  relatedFactors: string[];
  createdAt: string;
}

export interface RetentionSuggestionContext {
  riskScore: number;
  daysSinceLastVisit: number;
  adherenceRate: number;
  paymentStatus?: string;
  lastInteractionType?: string;
  lastInteractionDate?: string;
  clientHistory?: ClientHistoryItem[];
  interactions?: ClientInteraction[];
}

// Tipos para el portal del cliente
export interface ClientObjective {
  id: string;
  clientId: string;
  title: string;
  description?: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  status: 'not_started' | 'in_progress' | 'achieved' | 'at_risk' | 'failed';
  category: 'fitness' | 'nutrition' | 'health' | 'weight' | 'strength' | 'endurance' | 'other';
  progress: number; // 0-100
  createdAt: string;
  updatedAt: string;
  createdBy: 'trainer' | 'client';
}

export interface ClientFeedback {
  id: string;
  clientId: string;
  sessionId?: string;
  reservationId?: string;
  rating: number; // 1-5
  comment?: string;
  category: 'session' | 'trainer' | 'facility' | 'program' | 'general';
  submittedAt: string;
  trainerId?: string;
}

export interface ClientReservation {
  id: string;
  clientId: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  tipo: 'sesion-1-1' | 'clase-grupal' | 'fisio' | 'nutricion' | 'masaje';
  estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada' | 'no-show';
  precio: number;
  pagado: boolean;
  observaciones?: string;
  canCancel: boolean;
  canReschedule: boolean;
  cancelationDeadline?: string;
}

// Exportar tipos de hábitos y sugerencias
export * from './habits';
export * from './session-suggestions';
export * from './payment-reminders';
export * from './health-integrations';
export * from './referrals';
export * from './nutrition-sharing';

