export type MessagingChannel = 'email' | 'sms' | 'whatsapp' | 'push' | 'in-app';

export type CampaignStatus = 'draft' | 'scheduled' | 'running' | 'paused' | 'completed';

export interface MissionControlSummary {
  id: string;
  label: string;
  description: string;
  value: number;
  changePercentage: number;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
  channelFocus?: MessagingChannel | 'multi';
}

export interface MultiChannelCampaign {
  id: string;
  name: string;
  objective: string;
  status: CampaignStatus;
  owner: string;
  launchDate: string;
  channels: MessagingChannel[];
  targetSegments: string[];
  budget: number;
  spend: number;
  revenue: number;
  conversionRate: number;
  progression: number;
  nextAction: string;
  impactScore: number;
}

export interface EmailProgram {
  id: string;
  name: string;
  type: 'newsletter' | 'product-update' | 'promotion' | 'onboarding' | 'retention';
  cadence: string;
  audienceSize: number;
  openRate: number;
  clickRate: number;
  revenueAttributed: number;
  bestSubject?: string;
  status: CampaignStatus;
  aiRecommendation?: string;
}

export interface LifecycleSequence {
  id: string;
  name: string;
  goal: 'activation' | 'retention' | 'upsell' | 'winback' | 'churn-prevention';
  steps: number;
  activeContacts: number;
  completionRate: number;
  avgTimeToConvert: number;
  lastOptimization: string;
  bottleneckStep?: number;
  automationScore: number;
  status: CampaignStatus;
}

export interface MessagingAutomation {
  id: string;
  name: string;
  trigger: string;
  channel: Extract<MessagingChannel, 'sms' | 'whatsapp' | 'push'>;
  variantCount: number;
  audienceSize: number;
  responseRate: number;
  SLA: string;
  status: CampaignStatus;
  lastTriggered: string;
  ownedBy: string;
  recommendedImprovement?: string;
}

export interface ChannelHealthMetric {
  id: string;
  channel: MessagingChannel | 'multi';
  deliverability: number;
  engagement: number;
  satisfaction: number;
  automationCoverage: number;
  incidents: number;
  highlight: string;
}

export interface AutomationRoadmapItem {
  id: string;
  title: string;
  description: string;
  owner: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'S' | 'M' | 'L';
  eta: string;
  dependencies?: string[];
  tags: string[];
  status: 'backlog' | 'in-progress' | 'ready' | 'launched';
}

export interface SessionReminderTemplate {
  id: string;
  name: string;
  description: string;
  channel: Extract<MessagingChannel, 'sms' | 'whatsapp' | 'email'>;
  messageTemplate: string;
  timing: {
    type: 'before' | 'after';
    hours: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  variables: string[]; // Variables disponibles: {nombre}, {fecha}, {hora}, {lugar}, etc.
}

export interface ClientReminderSettings {
  clientId: string;
  clientName: string;
  templateId: string;
  isEnabled: boolean;
  customMessage?: string; // Mensaje personalizado para este cliente
  lastSent?: string;
  nextScheduled?: string;
}

export interface SessionReminder {
  id: string;
  templateId: string;
  templateName: string;
  clientId: string;
  clientName: string;
  sessionId: string;
  sessionDate: string;
  sessionTime: string;
  channel: Extract<MessagingChannel, 'sms' | 'whatsapp' | 'email'>;
  status: 'scheduled' | 'sent' | 'failed' | 'cancelled';
  scheduledAt: string;
  sentAt?: string;
  message: string;
}

// Secuencia de bienvenida - US-CA-003
export interface WelcomeSequenceMessage {
  id: string;
  day: number; // Día en que se envía (1, 2, 3, etc.)
  title: string; // Título del mensaje (ej: "Bienvenida", "Qué esperar", "Preparación primera sesión")
  messageTemplate: string;
  channel: Extract<MessagingChannel, 'email' | 'whatsapp'>;
  scheduledTime?: string; // Hora del día en que se envía (ej: "09:00")
  variables: string[]; // Variables disponibles: {nombre}, {fechaPrimeraSesion}, etc.
}

export interface WelcomeSequence {
  id: string;
  name: string;
  description: string;
  trigger: 'new-client' | 'first-session-booked' | 'manual';
  messages: WelcomeSequenceMessage[];
  activeClients: number; // Clientes actualmente en la secuencia
  completionRate: number; // Porcentaje de clientes que completan la secuencia
  status: CampaignStatus;
  createdAt: string;
  updatedAt: string;
}

// Automatización de ausencias - US-CA-004
export type AbsenceTone = 'friendly' | 'concerned' | 'urgent'; // Tono según frecuencia de ausencias

export interface AbsenceMessage {
  id: string;
  tone: AbsenceTone;
  absenceCount: number; // Número de ausencias que activa este mensaje (1, 2, 3+)
  messageTemplate: string;
  channel: Extract<MessagingChannel, 'email' | 'whatsapp' | 'sms'>;
  delayHours: number; // Horas después de la ausencia para enviar el mensaje
  variables: string[]; // Variables disponibles: {nombre}, {fechaAusencia}, {opcionesReagendar}, etc.
}

export interface AbsenceAutomation {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  messages: AbsenceMessage[]; // Mensajes ordenados por frecuencia de ausencias
  activeCases: number; // Casos activos actualmente
  responseRate: number; // Tasa de respuesta de los mensajes
  reschedulingRate: number; // Tasa de reagendamiento exitoso
  lastTriggered: string;
  createdAt: string;
  updatedAt: string;
}

// Biblioteca de plantillas de mensajes - US-CA-005
export type MessageTemplateCategory = 
  | 'confirmacion-sesion' 
  | 'recordatorio-pago' 
  | 'felicitacion-progreso' 
  | 'ajuste-plan' 
  | 'general' 
  | 'bienvenida' 
  | 'seguimiento';

export interface MessageTemplate {
  id: string;
  name: string;
  description: string;
  category: MessageTemplateCategory;
  channel: MessagingChannel;
  messageTemplate: string;
  variables: string[]; // Variables disponibles: {nombre}, {fechaSesion}, {horaSesion}, {lugar}, {monto}, {fechaPago}, etc.
  usageCount: number; // Veces que se ha usado
  lastUsed?: string;
  createdAt: string;
  updatedAt: string;
  isFavorite?: boolean;
  tags?: string[];
}

// Sistema de mensajes programados - US-CA-006
export type ScheduledMessageFrequency = 
  | 'daily' 
  | 'weekly' 
  | 'biweekly' 
  | 'monthly' 
  | 'custom';

export interface ScheduledMessageRecipient {
  type: 'client' | 'group';
  id: string;
  name: string;
}

export interface ScheduledMessage {
  id: string;
  name: string;
  description: string;
  templateId?: string; // ID de plantilla si usa una
  messageContent: string; // Contenido del mensaje (puede ser personalizado)
  channel: MessagingChannel;
  frequency: ScheduledMessageFrequency;
  customFrequencyDays?: number; // Para frecuencia 'custom'
  recipients: ScheduledMessageRecipient[]; // Clientes o grupos específicos
  nextScheduledDate: string;
  lastSentDate?: string;
  status: CampaignStatus;
  totalSent: number;
  responseRate?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  variables?: string[]; // Variables que se usarán al enviar
}

// Automatización de inactividad - US-CA-007
export type InactivityMessageType = 'motivational' | 'special-offer' | 'invitation' | 'check-in';

export interface InactivityMessage {
  id: string;
  step: number; // Paso en la secuencia (1, 2, 3, etc.)
  type: InactivityMessageType;
  daysAfterInactivity: number; // Días después de la inactividad para enviar este mensaje
  messageTemplate: string;
  channel: Extract<MessagingChannel, 'email' | 'whatsapp' | 'sms'>;
  scheduledTime?: string; // Hora del día en que se envía (ej: "09:00")
  variables: string[]; // Variables disponibles: {nombre}, {diasInactivo}, {ultimaSesion}, {ofertaEspecial}, etc.
  pauseOnResponse: boolean; // Si el cliente responde, pausar la secuencia
}

export interface InactivityAutomation {
  id: string;
  name: string;
  description: string;
  inactivityThresholdDays: number; // X días sin sesiones para activar la automatización
  messages: InactivityMessage[]; // Secuencia progresiva de mensajes
  activeClients: number; // Clientes actualmente en la secuencia
  pausedClients: number; // Clientes que respondieron y pausaron la secuencia
  responseRate: number; // Tasa de respuesta de los mensajes
  reactivationRate: number; // Tasa de clientes que retoman sesiones
  isActive: boolean;
  lastTriggered: string;
  createdAt: string;
  updatedAt: string;
}

// Sistema de fechas importantes - US-CA-008
export type ImportantDateType = 'birthday' | 'anniversary' | 'milestone' | 'custom';

export interface ImportantDate {
  id: string;
  clientId: string;
  clientName: string;
  dateType: ImportantDateType;
  date: string; // Fecha en formato YYYY-MM-DD
  label?: string; // Etiqueta personalizada para fechas custom
  isActive: boolean;
  lastSent?: string; // Última vez que se envió un mensaje para esta fecha
}

export interface ImportantDateMessage {
  id: string;
  dateType: ImportantDateType;
  messageTemplate: string;
  channel: Extract<MessagingChannel, 'email' | 'whatsapp' | 'sms'>;
  includeSpecialOffer: boolean; // Si incluye oferta especial
  specialOfferTemplate?: string; // Plantilla de oferta especial
  includeSessionReminder: boolean; // Si incluye recordatorio de sesión
  sendTime: string; // Hora del día en que se envía (ej: "09:00")
  sendDaysBefore?: number; // Días antes de la fecha para enviar (0 = el mismo día)
  variables: string[]; // Variables disponibles: {nombre}, {fechaImportante}, {edad}, {añosEntrenando}, {ofertaEspecial}, etc.
}

export interface ImportantDateAutomation {
  id: string;
  name: string;
  description: string;
  messages: ImportantDateMessage[]; // Mensajes por tipo de fecha
  activeDates: number; // Fechas importantes activas configuradas
  upcomingDates: number; // Próximas fechas importantes en los próximos 30 días
  sentThisMonth: number; // Mensajes enviados este mes
  responseRate: number; // Tasa de respuesta
  isActive: boolean;
  lastTriggered: string;
  createdAt: string;
  updatedAt: string;
}

// Automatización de recordatorios de pagos - US-CA-009
export type PaymentReminderTone = 'friendly' | 'gentle' | 'urgent';

export interface PaymentReminderMessage {
  id: string;
  daysDelay: number; // Días de retraso que activa este mensaje (0 = próximo a vencer, 1 = 1 día vencido, etc.)
  tone: PaymentReminderTone;
  messageTemplate: string;
  channel: Extract<MessagingChannel, 'email' | 'whatsapp'>;
  sendTime: string; // Hora del día en que se envía (ej: "09:00")
  variables: string[]; // Variables disponibles: {nombre}, {monto}, {fechaVencimiento}, {diasRetraso}, {linkPago}, etc.
}

export interface PaymentReminderAutomation {
  id: string;
  name: string;
  description: string;
  messages: PaymentReminderMessage[]; // Mensajes ordenados por días de retraso
  activeReminders: number; // Recordatorios activos actualmente
  sentThisMonth: number; // Recordatorios enviados este mes
  paymentRecoveryRate: number; // Tasa de recuperación de pagos (%)
  responseRate: number; // Tasa de respuesta de los mensajes
  isActive: boolean;
  lastTriggered: string;
  createdAt: string;
  updatedAt: string;
}

// Dashboard de estadísticas de mensajes - US-CA-010
export type MessageType = 
  | 'recordatorio-sesion'
  | 'recordatorio-pago'
  | 'bienvenida'
  | 'seguimiento'
  | 'ausencia'
  | 'inactividad'
  | 'fecha-importante'
  | 'programado'
  | 'otro';

export interface MessageStatistics {
  id: string;
  messageType: MessageType;
  typeLabel: string; // Etiqueta legible del tipo
  totalSent: number; // Total de mensajes enviados
  totalOpened: number; // Total de mensajes abiertos
  totalReplied: number; // Total de mensajes que generaron respuesta
  openRate: number; // Tasa de apertura (%)
  replyRate: number; // Tasa de respuesta (%)
  channel: MessagingChannel;
  period: '7d' | '30d' | '90d' | 'all'; // Período de tiempo
  trend: 'up' | 'down' | 'neutral'; // Tendencia vs período anterior
  changePercentage: number; // Cambio porcentual vs período anterior
}

export interface MessageStatisticsDashboard {
  totalMessagesSent: number;
  totalMessagesOpened: number;
  totalMessagesReplied: number;
  overallOpenRate: number;
  overallReplyRate: number;
  statistics: MessageStatistics[];
  period: '7d' | '30d' | '90d' | 'all';
  lastUpdated: string;
}

// Sistema de segmentación - US-CA-011
export type SegmentCriteriaType = 
  | 'days-since-last-session' 
  | 'plan-type' 
  | 'adherence-rate' 
  | 'payment-status' 
  | 'client-status' 
  | 'total-sessions' 
  | 'last-payment-days' 
  | 'custom';

export type PlanType = 'mensual' | 'trimestral' | 'semestral' | 'anual' | 'bono' | 'trial';
export type ClientStatus = 'active' | 'inactive' | 'at-risk' | 'churned' | 'trial';
export type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'cancelled';

export interface SegmentCriteria {
  id: string;
  type: SegmentCriteriaType;
  operator: 'equals' | 'not-equals' | 'greater-than' | 'less-than' | 'between' | 'in' | 'not-in';
  value: string | number | string[] | number[];
  value2?: number; // Para operador 'between'
  label: string; // Etiqueta legible del criterio
}

export interface ClientSegment {
  id: string;
  name: string;
  description: string;
  criteria: SegmentCriteria[];
  clientCount: number; // Número de clientes que cumplen los criterios
  lastUpdated: string; // Última vez que se actualizó el conteo
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  tags?: string[];
}

export interface BulkMessage {
  id: string;
  name: string;
  description: string;
  segmentId: string;
  segmentName: string;
  messageTemplate: string;
  channel: MessagingChannel;
  variables: string[]; // Variables disponibles: {nombre}, {plan}, {ultimaSesion}, etc.
  status: CampaignStatus;
  scheduledDate?: string; // Fecha programada para envío
  sentDate?: string; // Fecha de envío
  totalRecipients: number; // Total de destinatarios
  sentCount: number; // Mensajes enviados
  deliveredCount: number; // Mensajes entregados
  openedCount: number; // Mensajes abiertos
  repliedCount: number; // Mensajes con respuesta
  deliveryRate: number; // Tasa de entrega (%)
  openRate: number; // Tasa de apertura (%)
  replyRate: number; // Tasa de respuesta (%)
  createdAt: string;
  updatedAt: string;
}

// Editor de newsletters - US-CA-012
export type NewsletterFrequency = 'weekly' | 'biweekly' | 'monthly' | 'custom';
export type NewsletterStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'cancelled';

export interface NewsletterTemplate {
  id: string;
  name: string;
  description: string;
  category: 'fitness-tips' | 'nutrition' | 'motivation' | 'success-stories' | 'challenges' | 'general';
  htmlContent: string; // Contenido HTML del newsletter
  previewImage?: string; // URL de imagen de vista previa
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterSchedule {
  id: string;
  frequency: NewsletterFrequency;
  customDays?: number; // Para frecuencia 'custom'
  dayOfWeek?: number; // 0-6 (domingo-sábado) para weekly/biweekly
  dayOfMonth?: number; // 1-31 para monthly
  time: string; // Hora del día en formato HH:mm
  timezone: string; // Zona horaria
  nextScheduledDate: string; // Próxima fecha programada
  lastSentDate?: string; // Última fecha de envío
  isActive: boolean;
}

export interface NewsletterTracking {
  id: string;
  newsletterId: string;
  sentDate: string;
  totalRecipients: number;
  deliveredCount: number;
  openedCount: number;
  uniqueOpens: number; // Aperturas únicas
  clickedCount: number;
  uniqueClicks: number; // Clics únicos
  unsubscribedCount: number;
  bouncedCount: number;
  deliveryRate: number; // Tasa de entrega (%)
  openRate: number; // Tasa de apertura (%)
  clickRate: number; // Tasa de clics (%)
  clickToOpenRate: number; // Tasa de clics sobre aperturas (%)
  unsubscribeRate: number; // Tasa de cancelaciones (%)
  bounceRate: number; // Tasa de rebotes (%)
  topLinks?: Array<{
    url: string;
    clicks: number;
    uniqueClicks: number;
  }>;
  deviceBreakdown?: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  locationBreakdown?: Array<{
    country: string;
    opens: number;
    clicks: number;
  }>;
}

export interface Newsletter {
  id: string;
  name: string;
  description: string;
  subject: string; // Asunto del email
  templateId?: string; // ID de plantilla si usa una
  htmlContent: string; // Contenido HTML personalizado
  textContent?: string; // Versión en texto plano
  segmentId?: string; // Segmento de destinatarios (opcional, si no se especifica, va a todos)
  segmentName?: string;
  schedule?: NewsletterSchedule; // Programación recurrente
  status: NewsletterStatus;
  scheduledDate?: string; // Fecha programada para envío único
  sentDate?: string; // Fecha de envío
  tracking?: NewsletterTracking; // Datos de tracking del último envío
  totalSent: number; // Total de envíos realizados
  averageOpenRate: number; // Tasa promedio de apertura
  averageClickRate: number; // Tasa promedio de clics
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// Sistema de respuestas automáticas fuera de horario - US-CA-013
export interface BusinessHours {
  id: string;
  dayOfWeek: number; // 0-6 (domingo-sábado)
  dayName: string; // 'Lunes', 'Martes', etc.
  isEnabled: boolean;
  startTime: string; // Formato HH:mm
  endTime: string; // Formato HH:mm
}

export interface AfterHoursAutoReply {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  businessHours: BusinessHours[]; // Horarios de atención configurados
  timezone: string; // Zona horaria
  messageTemplate: string; // Mensaje de respuesta automática
  channel: Extract<MessagingChannel, 'whatsapp' | 'sms' | 'email'>;
  estimatedResponseTime: string; // Tiempo estimado de respuesta (ej: "2-4 horas", "mañana a las 9:00")
  variables: string[]; // Variables disponibles: {horarioAtencion}, {tiempoEstimado}, etc.
  totalRepliesSent: number; // Total de respuestas automáticas enviadas
  lastTriggered?: string; // Última vez que se activó
  createdAt: string;
  updatedAt: string;
}

// Sistema de campañas promocionales - US-CA-014
export type PromotionalCampaignRecipientType = 'all' | 'segment' | 'inactive-clients' | 'custom';

export interface PromotionalCampaignRecipient {
  type: PromotionalCampaignRecipientType;
  segmentId?: string; // Si type es 'segment'
  segmentName?: string;
  clientIds?: string[]; // Si type es 'custom'
  clientNames?: string[]; // Para mostrar en UI
}

export interface PromotionalCampaignTracking {
  id: string;
  campaignId: string;
  sentDate: string;
  totalRecipients: number;
  sentCount: number;
  deliveredCount: number;
  openedCount: number;
  clickedCount: number;
  repliedCount: number;
  conversionCount: number; // Clientes que tomaron acción (compraron, agendaron, etc.)
  revenueGenerated?: number; // Ingresos generados por la campaña
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  replyRate: number;
  conversionRate: number;
}

export interface PromotionalCampaign {
  id: string;
  name: string;
  description: string;
  messageTemplate: string; // Mensaje personalizado de la campaña
  channel: MessagingChannel;
  recipients: PromotionalCampaignRecipient;
  variables: string[]; // Variables disponibles: {nombre}, {oferta}, {descuento}, {fechaVencimiento}, etc.
  status: CampaignStatus;
  scheduledDate?: string; // Fecha programada para envío
  sentDate?: string; // Fecha de envío
  tracking?: PromotionalCampaignTracking; // Datos de tracking
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface MissionControlSnapshot {
  summary: MissionControlSummary[];
  campaigns: MultiChannelCampaign[];
  emailPrograms: EmailProgram[];
  lifecycleSequences: LifecycleSequence[];
  messagingAutomations: MessagingAutomation[];
  channelHealth: ChannelHealthMetric[];
  roadmap: AutomationRoadmapItem[];
  sessionReminderTemplates?: SessionReminderTemplate[];
  clientReminderSettings?: ClientReminderSettings[];
  upcomingReminders?: SessionReminder[];
  welcomeSequences?: WelcomeSequence[];
  absenceAutomations?: AbsenceAutomation[];
  messageTemplates?: MessageTemplate[]; // US-CA-005
  scheduledMessages?: ScheduledMessage[]; // US-CA-006
  inactivityAutomations?: InactivityAutomation[]; // US-CA-007
  importantDateAutomations?: ImportantDateAutomation[]; // US-CA-008
  paymentReminderAutomations?: PaymentReminderAutomation[]; // US-CA-009
  messageStatisticsDashboard?: MessageStatisticsDashboard; // US-CA-010
  clientSegments?: ClientSegment[]; // US-CA-011
  bulkMessages?: BulkMessage[]; // US-CA-011
  newsletters?: Newsletter[]; // US-CA-012
  newsletterTemplates?: NewsletterTemplate[]; // US-CA-012
  afterHoursAutoReplies?: AfterHoursAutoReply[]; // US-CA-013
  promotionalCampaigns?: PromotionalCampaign[]; // US-CA-014
  reservationsIntegration?: ReservationsIntegration; // US-CA-015
  centralAutomationsPanel?: CentralAutomationsPanel; // US-CA-016
  messageAlertsDashboard?: MessageAlertsDashboard; // US-CA-017
  preferredSendingSchedulesDashboard?: PreferredSendingSchedulesDashboard; // US-CA-018
  multiStepSequences?: MultiStepSequence[]; // US-CA-019
  exportReports?: ExportReport[]; // US-CA-020
}

// Integración con sistema de reservas - US-CA-015
export type ReservationEventType = 'new-session' | 'session-cancelled' | 'session-rescheduled' | 'session-completed' | 'no-show';

export interface ReservationEvent {
  id: string;
  reservationId: string;
  clientId: string;
  clientName: string;
  eventType: ReservationEventType;
  sessionDate: string;
  sessionTime: string;
  originalDate?: string; // Para eventos de reagendamiento
  originalTime?: string;
  createdAt: string;
}

export interface ReservationAutomationRule {
  id: string;
  name: string;
  description: string;
  eventType: ReservationEventType;
  automationType: 'reminder' | 'follow-up' | 'confirmation' | 'cancellation-follow-up';
  triggerDelay?: {
    type: 'before' | 'after';
    hours: number;
  };
  messageTemplate: string;
  channel: Extract<MessagingChannel, 'email' | 'whatsapp' | 'sms'>;
  isActive: boolean;
  totalTriggered: number;
  lastTriggered?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReservationsIntegration {
  isEnabled: boolean;
  rules: ReservationAutomationRule[];
  recentEvents: ReservationEvent[];
  totalEventsProcessed: number;
  eventsLast24h: number;
  lastSyncDate?: string;
  syncStatus: 'synced' | 'syncing' | 'error';
  errorMessage?: string;
}

// Panel centralizado de automatizaciones - US-CA-016
export type AutomationType = 
  | 'session-reminder'
  | 'welcome-sequence'
  | 'absence-follow-up'
  | 'inactivity-sequence'
  | 'payment-reminder'
  | 'important-date'
  | 'scheduled-message'
  | 'promotional-campaign'
  | 'newsletter'
  | 'after-hours-reply'
  | 'reservation-integration';

export type AutomationStatus = 'active' | 'paused' | 'finished' | 'draft' | 'error';

export interface CentralizedAutomation {
  id: string;
  name: string;
  type: AutomationType;
  typeLabel: string; // Etiqueta legible del tipo
  description: string;
  status: AutomationStatus;
  nextScheduledSend?: string; // Próximo envío programado
  lastScheduledSend?: string; // Último envío programado
  totalSends: number; // Total de envíos realizados
  activeRecipients: number; // Clientes/contactos activos en esta automatización
  successRate?: number; // Tasa de éxito (%)
  createdAt: string;
  updatedAt: string;
  canPause: boolean;
  canResume: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export interface CentralAutomationsPanel {
  automations: CentralizedAutomation[];
  totalActive: number;
  totalPaused: number;
  totalFinished: number;
  upcomingSends: Array<{
    automationId: string;
    automationName: string;
    scheduledDate: string;
    recipientCount: number;
    channel: MessagingChannel;
  }>;
  lastUpdated: string;
}

// Sistema de alertas de mensajes importantes no abiertos/respondidos - US-CA-017
export type MessageAlertPriority = 'low' | 'medium' | 'high' | 'urgent';

export type MessageAlertStatus = 'active' | 'acknowledged' | 'resolved' | 'dismissed';

export interface MessageAlert {
  id: string;
  messageId: string;
  messageType: MessageType;
  messageTypeLabel: string;
  clientId: string;
  clientName: string;
  channel: MessagingChannel;
  sentAt: string; // Fecha y hora en que se envió el mensaje
  timeSinceSent: {
    hours: number;
    days: number;
  };
  threshold: {
    type: 'opened' | 'replied';
    hours: number; // X horas después de las cuales se activa la alerta
  };
  priority: MessageAlertPriority;
  status: MessageAlertStatus;
  messageContent: string; // Contenido del mensaje original
  messageSubject?: string; // Asunto (si aplica)
  lastChecked?: string; // Última vez que el entrenador revisó esta alerta
  acknowledgedAt?: string; // Fecha en que se reconoció la alerta
  resolvedAt?: string; // Fecha en que se resolvió (cliente abrió/respondió)
  notes?: string; // Notas del entrenador sobre la acción tomada
  createdAt: string;
  updatedAt: string;
}

export interface MessageAlertSettings {
  id: string;
  messageType: MessageType;
  messageTypeLabel: string;
  isEnabled: boolean;
  thresholds: {
    opened: {
      enabled: boolean;
      hours: number; // Horas después de las cuales alertar si no se abre
      priority: MessageAlertPriority;
    };
    replied: {
      enabled: boolean;
      hours: number; // Horas después de las cuales alertar si no se responde
      priority: MessageAlertPriority;
    };
  };
  notificationChannels: ('email' | 'push' | 'in-app')[]; // Cómo notificar al entrenador
  autoEscalation?: {
    enabled: boolean;
    escalateAfterHours: number; // Escalar a mayor prioridad después de X horas
  };
  createdAt: string;
  updatedAt: string;
}

export interface MessageAlertsDashboard {
  activeAlerts: MessageAlert[];
  totalActive: number;
  byPriority: {
    urgent: number;
    high: number;
    medium: number;
    low: number;
  };
  byStatus: {
    active: number;
    acknowledged: number;
    resolved: number;
    dismissed: number;
  };
  settings: MessageAlertSettings[];
  lastUpdated: string;
}

// Sistema de horarios preferidos de envío - US-CA-018
export interface PreferredSendingWindow {
  id: string;
  dayOfWeek: number; // 0-6 (domingo-sábado)
  dayName: string; // 'Lunes', 'Martes', etc.
  isEnabled: boolean;
  startTime: string; // Formato HH:mm
  endTime: string; // Formato HH:mm
}

export interface ClientPreferredSchedule {
  id: string;
  clientId: string;
  clientName: string;
  timezone: string; // Zona horaria del cliente
  windows: PreferredSendingWindow[]; // Ventanas de tiempo preferidas
  isActive: boolean;
  appliesTo: {
    channels: MessagingChannel[]; // Canales a los que aplica este horario
    messageTypes: MessageType[]; // Tipos de mensajes a los que aplica
  };
  createdAt: string;
  updatedAt: string;
}

export interface GroupPreferredSchedule {
  id: string;
  groupId: string;
  groupName: string;
  timezone: string;
  windows: PreferredSendingWindow[];
  isActive: boolean;
  appliesTo: {
    channels: MessagingChannel[];
    messageTypes: MessageType[];
  };
  clientCount: number; // Número de clientes en este grupo
  createdAt: string;
  updatedAt: string;
}

export interface PreferredScheduleRule {
  id: string;
  name: string;
  description: string;
  priority: number; // Prioridad de la regla (mayor número = mayor prioridad)
  appliesTo: {
    type: 'all' | 'client' | 'group' | 'segment';
    clientIds?: string[];
    groupIds?: string[];
    segmentIds?: string[];
  };
  schedule: {
    timezone: string;
    windows: PreferredSendingWindow[];
  };
  channels: MessagingChannel[];
  messageTypes: MessageType[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PreferredSendingSchedulesDashboard {
  clientSchedules: ClientPreferredSchedule[];
  groupSchedules: GroupPreferredSchedule[];
  rules: PreferredScheduleRule[];
  totalClientsWithSchedule: number;
  totalGroupsWithSchedule: number;
  totalRules: number;
  nextScheduledMessages: Array<{
    messageId: string;
    messageType: string;
    clientId: string;
    clientName: string;
    scheduledTime: string; // Hora programada dentro de la ventana preferida
    preferredWindow: {
      startTime: string;
      endTime: string;
    };
    channel: MessagingChannel;
  }>;
  lastUpdated: string;
}

// Constructor de secuencias de múltiples pasos con lógica condicional - US-CA-019
export type ConditionalOperator = 'equals' | 'contains' | 'starts-with' | 'ends-with' | 'not-equals' | 'greater-than' | 'less-than';
export type DelayUnit = 'minutes' | 'hours' | 'days';

export interface ConditionalRule {
  id: string;
  condition: {
    type: 'response' | 'action' | 'time' | 'custom';
    field?: string; // Campo a evaluar (ej: 'response', 'action', 'daysSinceLastSession')
    operator: ConditionalOperator;
    value: string | number; // Valor a comparar
  };
  thenAction: {
    type: 'send-message' | 'skip-step' | 'jump-to-step' | 'end-sequence' | 'pause-sequence';
    stepId?: string; // Para jump-to-step
    messageId?: string; // Para send-message
  };
}

export interface SequenceStep {
  id: string;
  stepNumber: number;
  name: string;
  description?: string;
  messageTemplate: string;
  channel: MessagingChannel;
  delay?: {
    value: number;
    unit: DelayUnit;
  };
  scheduledTime?: string; // Hora específica del día (ej: "09:00")
  variables: string[]; // Variables disponibles: {nombre}, {fecha}, etc.
  conditionalRules?: ConditionalRule[]; // Reglas condicionales para este paso
  pauseOnResponse: boolean; // Si el cliente responde, pausar la secuencia
  pauseOnAction: boolean; // Si el cliente toma acción (ej: agendar sesión), pausar la secuencia
  isActive: boolean;
}

export interface MultiStepSequence {
  id: string;
  name: string;
  description: string;
  trigger: 'new-client' | 'first-session-booked' | 'inactivity' | 'custom-event' | 'manual';
  triggerCondition?: {
    type: string;
    value: string | number;
  };
  steps: SequenceStep[];
  activeClients: number; // Clientes actualmente en la secuencia
  pausedClients: number; // Clientes que respondieron/actuaron y pausaron la secuencia
  completionRate: number; // Porcentaje de clientes que completan la secuencia
  averageCompletionTime: number; // Tiempo promedio en días para completar la secuencia
  responseRate: number; // Tasa de respuesta de los mensajes
  status: CampaignStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// Funcionalidad de exportación de reportes - US-CA-020
export type ReportFormat = 'pdf' | 'excel' | 'csv';
export type ReportPeriod = '7d' | '30d' | '90d' | 'custom' | 'monthly' | 'quarterly' | 'yearly';

export interface ReportPeriodComparison {
  currentPeriod: {
    startDate: string;
    endDate: string;
    label: string;
  };
  previousPeriod: {
    startDate: string;
    endDate: string;
    label: string;
  };
}

export interface CommunicationMetrics {
  totalMessagesSent: number;
  totalMessagesDelivered: number;
  totalMessagesOpened: number;
  totalMessagesReplied: number;
  totalMessagesClicked?: number; // Para emails/newsletters
  deliveryRate: number;
  openRate: number;
  replyRate: number;
  clickRate?: number;
  byChannel: {
    channel: MessagingChannel;
    sent: number;
    delivered: number;
    opened: number;
    replied: number;
    deliveryRate: number;
    openRate: number;
    replyRate: number;
  }[];
  byMessageType: {
    messageType: MessageType;
    messageTypeLabel: string;
    sent: number;
    opened: number;
    replied: number;
    openRate: number;
    replyRate: number;
  }[];
  byDay: {
    date: string;
    sent: number;
    opened: number;
    replied: number;
  }[];
}

export interface AutomationEffectiveness {
  automationId: string;
  automationName: string;
  automationType: AutomationType;
  automationTypeLabel: string;
  totalSent: number;
  totalDelivered: number;
  totalOpened: number;
  totalReplied: number;
  totalConverted?: number; // Clientes que tomaron acción deseada
  deliveryRate: number;
  openRate: number;
  replyRate: number;
  conversionRate?: number;
  averageResponseTime?: number; // Tiempo promedio de respuesta en horas
  costPerMessage?: number; // Costo por mensaje (si aplica)
  roi?: number; // Retorno de inversión (si aplica)
  trend: 'up' | 'down' | 'neutral';
  changePercentage: number; // Cambio vs período anterior
}

export interface ReportConfiguration {
  id?: string;
  name: string;
  format: ReportFormat;
  period: ReportPeriod;
  customPeriod?: {
    startDate: string;
    endDate: string;
  };
  includeMetrics: {
    communicationMetrics: boolean;
    periodComparison: boolean;
    automationEffectiveness: boolean;
    channelBreakdown: boolean;
    messageTypeBreakdown: boolean;
    dailyTrends: boolean;
    topPerformers: boolean;
  };
  compareWithPreviousPeriod: boolean;
  automationTypes?: AutomationType[]; // Tipos de automatización a incluir (si está vacío, incluye todos)
  channels?: MessagingChannel[]; // Canales a incluir (si está vacío, incluye todos)
  includeCharts: boolean;
  includeRawData: boolean;
}

export interface ExportReport {
  id: string;
  configuration: ReportConfiguration;
  generatedAt: string;
  generatedBy: string;
  fileUrl?: string; // URL del archivo generado
  fileSize?: number; // Tamaño del archivo en bytes
  status: 'generating' | 'completed' | 'failed';
  errorMessage?: string;
  metrics?: CommunicationMetrics;
  periodComparison?: {
    current: CommunicationMetrics;
    previous: CommunicationMetrics;
    changes: {
      metric: string;
      currentValue: number;
      previousValue: number;
      change: number;
      changePercentage: number;
      trend: 'up' | 'down' | 'neutral';
    }[];
  };
  automationEffectiveness?: AutomationEffectiveness[];
  topPerformers?: {
    automations: AutomationEffectiveness[];
    channels: {
      channel: MessagingChannel;
      metrics: CommunicationMetrics;
    }[];
    messageTypes: {
      messageType: MessageType;
      messageTypeLabel: string;
      metrics: CommunicationMetrics;
    }[];
  };
}







