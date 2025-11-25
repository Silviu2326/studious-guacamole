export type MessagingChannel = 'email' | 'sms' | 'whatsapp' | 'push' | 'in-app';

export type CampaignStatus = 'draft' | 'scheduled' | 'running' | 'paused' | 'completed';

export type CommunicationMode = 'manual' | 'automation';

export interface MissionControlSummary {
  id: string;
  label: string;
  description: string;
  value: number;
  changePercentage: number;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
  channelFocus?: MessagingChannel | 'multi';
  // Métricas separadas para comunicaciones manuales y automatizaciones
  manualMetrics?: {
    messagesSent: number;
    responseRate?: number;
    conversionRate?: number;
    changePercentage?: number;
    trend?: 'up' | 'down' | 'neutral';
  };
  automationMetrics?: {
    messagesSent: number;
    responseRate?: number;
    conversionRate?: number;
    changePercentage?: number;
    trend?: 'up' | 'down' | 'neutral';
  };
}

export interface MultiChannelCampaign {
  id: string;
  name: string;
  objective: string;
  status: CampaignStatus;
  mode: CommunicationMode; // 'manual' - campaña sin lógica de flujo
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
  mode: CommunicationMode; // 'manual' - newsletters y programas de email
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
  mode: CommunicationMode; // 'automation' - secuencia de ciclo de vida
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
  mode: CommunicationMode; // 'automation' - automatización por trigger
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
  mode: CommunicationMode; // 'automation' - secuencia de bienvenida
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
  mode: CommunicationMode; // 'automation' - automatización de ausencias
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
  mode: CommunicationMode; // 'automation' - automatización de inactividad
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
  mode: CommunicationMode; // 'automation' - automatización de fechas importantes
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
  mode: CommunicationMode; // 'automation' - automatización de recordatorios de pago
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
  | 'training-progress' // US-CA-032: Segmentos basados en progreso de entrenamientos
  | 'nps-score' // US-CA-033: Segmentos basados en NPS
  | 'feedback-score' // US-CA-033: Segmentos basados en feedback
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

// Tipos para progreso de entrenamientos - US-CA-032
export type TrainingProgressMetric = 
  | 'completion-rate' // Tasa de cumplimiento de sesiones
  | 'weight-change' // Cambio de peso
  | 'strength-improvement' // Mejora en fuerza
  | 'consistency-score' // Puntuación de consistencia
  | 'goal-achievement' // Logro de objetivos
  | 'session-frequency'; // Frecuencia de sesiones

export interface TrainingProgressCriteria {
  metric: TrainingProgressMetric;
  operator: 'equals' | 'greater-than' | 'less-than' | 'between';
  value: number;
  value2?: number; // Para operador 'between'
  period?: '7d' | '30d' | '90d' | 'all'; // Período de tiempo para evaluar
}

// Tipos para auto-actualización con feedback/NPS - US-CA-033
export type NPSClassification = 'promoter' | 'neutral' | 'detractor';
export type FeedbackSource = 'nps' | 'csat' | 'custom-feedback';

export interface AutoUpdateRule {
  id: string;
  source: FeedbackSource;
  condition: {
    type: 'nps-score' | 'nps-classification' | 'feedback-score' | 'feedback-sentiment';
    operator: 'equals' | 'greater-than' | 'less-than' | 'between' | 'in';
    value: number | string | string[];
    value2?: number;
  };
  action: {
    type: 'add-to-segment' | 'remove-from-segment' | 'move-to-segment';
    targetSegmentId?: string; // Para move-to-segment
  };
  isActive: boolean;
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
  // US-CA-032: Segmentos inteligentes basados en progreso de entrenamientos
  isIntelligentSegment?: boolean; // Si es un segmento inteligente basado en progreso
  trainingProgressCriteria?: TrainingProgressCriteria[]; // Criterios de progreso de entrenamiento
  // US-CA-033: Auto-actualización con feedback y NPS
  autoUpdateEnabled?: boolean; // Si el segmento se auto-actualiza
  autoUpdateRules?: AutoUpdateRule[]; // Reglas de auto-actualización
  lastAutoUpdate?: string; // Última vez que se auto-actualizó
  autoUpdateFrequency?: 'realtime' | 'hourly' | 'daily' | 'weekly'; // Frecuencia de auto-actualización
}

export interface BulkMessage {
  id: string;
  name: string;
  description: string;
  mode: CommunicationMode; // 'manual' - envío masivo
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
  mode: CommunicationMode; // 'manual' - campaña promocional
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
  specializedTemplates?: SpecializedTemplate[]; // US-CA-04
  postLeadMagnetSequences?: PostLeadMagnetSequence[]; // US-CA-05
  leadMagnetFunnels?: LeadMagnetFunnel[]; // US-CA-05
  clientActionTriggers?: ClientActionTriggersDashboard; // US-CA-026
  aiReminderAutomation?: AIReminderAutomationDashboard; // US-CA-027
  messageSaturationDashboard?: MessageSaturationDashboard; // US-CA-028
  aiMessageLibrary?: AIMessageLibrary; // US-CA-029
  weeklyHighlightsNewsletterGenerator?: WeeklyHighlightsNewsletterGenerator; // US-CA-030
  quickWhatsAppPromptsLibrary?: QuickWhatsAppPromptsLibrary; // US-CA-031
  aiHeatMapSendingSchedules?: AIHeatMapSendingSchedulesDashboard; // US-CA-HEATMAP
  actionableKPIs?: ActionableKPIDashboard; // US-CA-KPIS
  experimentsDashboard?: ExperimentsDashboard; // US-CA-EXPERIMENTS
  weeklyAIInsights?: WeeklyAIInsightsDashboard; // US-CA-WEEKLY-INSIGHTS
  teamTasks?: TeamTask[]; // User Story: Asignar tareas a equipo desde campañas
  campaignTeamTasks?: CampaignTeamTasks[]; // User Story: Asignar tareas a equipo desde campañas
  aiPlaybooks?: AIPlaybook[]; // User Story: Exportar playbooks IA
  playbookExports?: PlaybookExport[]; // User Story: Exportar playbooks IA
  mobileCampaignApprovalDashboard?: MobileCampaignApprovalDashboard; // User Story: Aprobar campañas desde móvil
  successfulCampaignsRecommenderDashboard?: SuccessfulCampaignsRecommenderDashboard; // User Story: Sistema aprende de campañas exitosas
  journeyGapDetectorDashboard?: JourneyGapDetectorDashboard; // US-CA-22: Detección de gaps en journeys
  channelRecommendationsDashboard?: ChannelRecommendationsDashboard; // US-CA-23: Recomendaciones para nuevos canales
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

// Definición de objetivos de campaña desde Mission Control - US-CA-021
export type CampaignObjective = 'captar' | 'reactivar' | 'fidelizar';

export interface JourneySuggestion {
  id: string;
  name: string;
  description: string;
  objective: CampaignObjective;
  recommendedChannels: MessagingChannel[];
  estimatedDuration: number; // días
  steps: number;
  expectedConversionRate: number;
  priority: 'high' | 'medium' | 'low';
  reasoning: string; // Explicación de por qué se sugiere este journey
}

export interface ChannelSuggestion {
  channel: MessagingChannel;
  priority: 'primary' | 'secondary' | 'optional';
  reasoning: string;
  estimatedReach: number;
  estimatedCost?: number;
}

export interface CampaignObjectiveConfig {
  objective: CampaignObjective;
  targetAudience?: string;
  budget?: number;
  timeline?: number; // días
  additionalContext?: string;
}

export interface CampaignObjectiveSuggestions {
  objective: CampaignObjective;
  recommendedJourneys: JourneySuggestion[];
  recommendedChannels: ChannelSuggestion[];
  aiInsights: string; // Insights generados por IA
  createdAt: string;
}

// Generación de campaña 360 con IA en 3 pasos - US-CA-022
export type Campaign360Step = 'objective' | 'content' | 'review';

export interface Campaign360Objective {
  name: string;
  description: string;
  objective: CampaignObjective;
  targetAudience: string;
  channels: MessagingChannel[];
  timeline: number; // días
}

export interface Campaign360Content {
  email: {
    subject: string;
    body: string;
    htmlContent?: string;
  };
  whatsapp: {
    message: string;
    mediaUrl?: string;
  };
  dm: {
    message: string;
    mediaUrl?: string;
  };
  tone: 'professional' | 'friendly' | 'motivational' | 'urgent';
  personalizationVariables: string[];
}

export interface Campaign360Review {
  objective: Campaign360Objective;
  content: Campaign360Content;
  estimatedReach: number;
  estimatedCost: number;
  scheduledDate?: string;
  status: 'draft' | 'ready';
}

export interface Campaign360GenerationRequest {
  objective: Campaign360Objective;
  aiPreferences?: {
    tone?: string;
    includeEmojis?: boolean;
    language?: string;
  };
}

export interface Campaign360GenerationResponse {
  campaign: Campaign360Review;
  aiGeneratedAt: string;
  suggestions?: string[];
}

// Plantillas IA especializadas - US-CA-04
export type SpecializedTemplateCategory = 'retos-30-dias' | 'upsell-packs' | 'recuperacion-inactivos';

export interface SpecializedTemplateAsset {
  id: string;
  type: 'image' | 'video' | 'document' | 'form';
  url?: string;
  name: string;
  description?: string;
  suggestedUse: string; // Cómo usar este asset
}

export interface SpecializedTemplateForm {
  id: string;
  name: string;
  fields: Array<{
    id: string;
    label: string;
    type: 'text' | 'email' | 'phone' | 'number' | 'select' | 'checkbox';
    required: boolean;
    options?: string[]; // Para select
  }>;
  integrationUrl?: string; // URL para integrar el formulario
}

export interface SpecializedTemplateChannelContent {
  channel: MessagingChannel;
  messageTemplate: string;
  subject?: string; // Para email
  mediaUrl?: string; // Para WhatsApp/DM
  suggestedTiming?: string; // Cuándo enviar este mensaje
}

export interface SpecializedTemplate {
  id: string;
  name: string;
  description: string;
  category: SpecializedTemplateCategory;
  categoryLabel: string; // Etiqueta legible
  channels: MessagingChannel[];
  content: SpecializedTemplateChannelContent[]; // Copy multi canal
  assets: SpecializedTemplateAsset[]; // Assets sugeridos
  forms?: SpecializedTemplateForm[]; // Formularios asociados
  successRate?: number; // Tasa histórica de éxito (%)
  usageCount: number; // Veces que se ha usado
  lastUsed?: string;
  tags: string[]; // Etiquetas de éxito (ej: "alta conversión", "mejor engagement")
  estimatedConversionRate?: number; // Tasa de conversión estimada
  estimatedRevenue?: number; // Ingresos estimados generados
  variables: string[]; // Variables disponibles: {nombre}, {dias}, {descuento}, etc.
  buyerPersona?: string[]; // Buyer personas para las que es más efectivo
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

// Secuencias automáticas post lead magnet - US-CA-05
export interface LeadMagnetFunnel {
  id: string;
  name: string;
  type: 'ebook' | 'calculator' | 'challenge' | 'quiz' | 'video-series' | 'workshop' | 'other';
  description: string;
  leadCount: number; // Total de leads generados
  conversionRate: number; // Tasa de conversión a cliente
  averageTimeToConvert: number; // Tiempo promedio en días para convertir
}

export interface PostLeadMagnetSequenceStep {
  id: string;
  stepNumber: number;
  name: string;
  description?: string;
  delay: {
    value: number;
    unit: 'hours' | 'days';
  }; // Delay recomendado desde el lead magnet
  messageTemplate: string;
  channel: MessagingChannel;
  subject?: string; // Para email
  variables: string[]; // Variables disponibles: {nombre}, {leadMagnetName}, {diasDesdeLeadMagnet}, etc.
  buyerPersonaAdjustments?: {
    [persona: string]: {
      messageTemplate?: string; // Mensaje ajustado para esta buyer persona
      delay?: {
        value: number;
        unit: 'hours' | 'days';
      }; // Delay ajustado
      channel?: MessagingChannel; // Canal preferido para esta persona
    };
  };
  pauseOnResponse: boolean; // Si el lead responde, pausar la secuencia
  pauseOnAction: boolean; // Si el lead toma acción (agenda sesión, compra), pausar
}

export interface PostLeadMagnetSequence {
  id: string;
  name: string;
  description: string;
  funnelId: string;
  funnelName: string;
  funnelType: LeadMagnetFunnel['type'];
  steps: PostLeadMagnetSequenceStep[];
  activeLeads: number; // Leads actualmente en la secuencia
  completedLeads: number; // Leads que completaron la secuencia
  convertedLeads: number; // Leads que se convirtieron en clientes
  completionRate: number; // Tasa de finalización de la secuencia
  conversionRate: number; // Tasa de conversión a cliente
  averageTimeToConvert: number; // Tiempo promedio en días para convertir
  status: CampaignStatus;
  buyerPersonas: string[]; // Buyer personas objetivo
  aiGenerated: boolean; // Si fue generada por IA
  aiGeneratedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

// Triggers basados en acciones de clientes - US-CA-026
export type ClientActionType = 'session-booked' | 'session-missed' | 'session-cancelled' | 'session-completed' | 'payment-made' | 'plan-renewed' | 'goal-achieved' | 'custom';

export interface ClientActionTrigger {
  id: string;
  name: string;
  description: string;
  actionType: ClientActionType;
  actionTypeLabel: string; // Etiqueta legible
  conditions?: {
    // Condiciones opcionales para activar el trigger
    clientSegment?: string; // ID de segmento
    planType?: PlanType[];
    daysSinceLastSession?: number; // Para triggers de sesión
    customCondition?: string; // Condición personalizada
  };
  messageTemplate: string;
  channel: MessagingChannel;
  delay?: {
    // Delay opcional antes de enviar el mensaje
    value: number;
    unit: 'minutes' | 'hours' | 'days';
  };
  variables: string[]; // Variables disponibles: {nombre}, {fechaSesion}, {tipoAccion}, etc.
  isActive: boolean;
  totalTriggered: number;
  lastTriggered?: string;
  responseRate?: number; // Tasa de respuesta
  createdAt: string;
  updatedAt: string;
}

export interface ClientActionTriggerEvent {
  id: string;
  triggerId: string;
  triggerName: string;
  clientId: string;
  clientName: string;
  actionType: ClientActionType;
  actionDetails: {
    // Detalles específicos de la acción
    sessionId?: string;
    sessionDate?: string;
    sessionTime?: string;
    paymentAmount?: number;
    planName?: string;
    goalName?: string;
    [key: string]: any; // Para datos adicionales
  };
  messageSent: boolean;
  messageSentAt?: string;
  messageContent?: string;
  responseReceived: boolean;
  responseReceivedAt?: string;
  createdAt: string;
}

export interface ClientActionTriggersDashboard {
  triggers: ClientActionTrigger[];
  recentEvents: ClientActionTriggerEvent[];
  totalTriggers: number;
  activeTriggers: number;
  totalEventsProcessed: number;
  eventsLast24h: number;
  averageResponseRate: number;
  lastUpdated: string;
}

// Recordatorios con IA que adaptan el mensaje al historial del cliente - US-CA-027
export interface ClientHistory {
  clientId: string;
  clientName: string;
  totalSessions: number;
  attendanceRate: number; // Porcentaje de asistencia
  averageDaysBetweenSessions: number;
  lastSessionDate?: string;
  missedSessionsCount: number;
  cancelledSessionsCount: number;
  preferredChannel: MessagingChannel;
  preferredTimeOfDay?: string; // Hora preferida para recibir mensajes
  responseRate: number; // Tasa de respuesta a mensajes anteriores
  lastMessageResponse?: string; // Última respuesta del cliente
  goals?: Array<{
    name: string;
    progress: number;
    status: 'in-progress' | 'achieved' | 'paused';
  }>;
  planType?: PlanType;
  membershipStartDate?: string;
  notes?: string; // Notas del entrenador sobre el cliente
}

export interface AIReminderMessage {
  id: string;
  clientId: string;
  clientName: string;
  sessionId: string;
  sessionDate: string;
  sessionTime: string;
  baseTemplate: string; // Plantilla base
  aiAdaptedMessage: string; // Mensaje adaptado por IA
  adaptationReason: string; // Razón de la adaptación (ej: "Cliente tiene baja asistencia, mensaje más motivacional")
  channel: MessagingChannel;
  scheduledAt: string;
  sentAt?: string;
  status: 'scheduled' | 'sent' | 'failed' | 'cancelled';
  clientHistory: ClientHistory; // Historial usado para la adaptación
  aiConfidence?: number; // Nivel de confianza de la IA (0-100)
  createdAt: string;
}

export interface AIReminderAutomation {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  baseTemplate: string; // Plantilla base que la IA adaptará
  channel: MessagingChannel;
  timing: {
    type: 'before' | 'after';
    hours: number;
  };
  aiSettings: {
    // Configuración de la IA
    adaptationLevel: 'minimal' | 'moderate' | 'aggressive'; // Nivel de adaptación
    considerHistory: boolean; // Considerar historial del cliente
    considerGoals: boolean; // Considerar objetivos del cliente
    considerAttendance: boolean; // Considerar tasa de asistencia
    toneAdjustment: boolean; // Ajustar tono según historial
    personalizationDepth: 'basic' | 'intermediate' | 'advanced'; // Profundidad de personalización
  };
  variables: string[]; // Variables disponibles
  totalSent: number;
  totalAdapted: number; // Mensajes adaptados por IA
  averageResponseRate: number;
  averageAttendanceImprovement?: number; // Mejora en asistencia (%)
  lastTriggered?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIReminderAutomationDashboard {
  automations: AIReminderAutomation[];
  upcomingReminders: AIReminderMessage[];
  totalActive: number;
  totalScheduled: number;
  averageResponseRate: number;
  attendanceImprovement: number; // Mejora promedio en asistencia
  aiAdaptationRate: number; // Porcentaje de mensajes adaptados por IA
  lastUpdated: string;
}

// Detección de saturación de mensajes y propuesta de pausas automatizadas - US-CA-028
export type SaturationLevel = 'low' | 'medium' | 'high' | 'critical';

export interface MessageSaturationAlert {
  id: string;
  clientId?: string; // Si es específico de un cliente
  clientName?: string;
  segmentId?: string; // Si es específico de un segmento
  segmentName?: string;
  channel: MessagingChannel;
  saturationLevel: SaturationLevel;
  metrics: {
    messagesSentLast7Days: number;
    messagesSentLast30Days: number;
    averageMessagesPerDay: number;
    recommendedMaxPerDay: number;
    engagementDrop: number; // Porcentaje de caída en engagement
    unsubscribes: number; // Número de cancelaciones recientes
    responseRateDrop: number; // Porcentaje de caída en tasa de respuesta
  };
  recommendedPause: {
    durationDays: number;
    startDate: string;
    endDate: string;
    reason: string; // Razón de la pausa recomendada
  };
  affectedAutomations: string[]; // IDs de automatizaciones afectadas
  status: 'pending' | 'applied' | 'dismissed' | 'expired';
  createdAt: string;
  appliedAt?: string;
  dismissedAt?: string;
}

export interface MessageSaturationDashboard {
  alerts: MessageSaturationAlert[];
  totalAlerts: number;
  byLevel: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  byStatus: {
    pending: number;
    applied: number;
    dismissed: number;
  };
  globalMetrics: {
    totalMessagesSentLast7Days: number;
    totalMessagesSentLast30Days: number;
    averageMessagesPerClientPerDay: number;
    overallEngagementRate: number;
    engagementTrend: 'up' | 'down' | 'neutral';
    unsubscribesLast7Days: number;
  };
  settings: {
    enabled: boolean;
    thresholds: {
      low: number; // Mensajes por día que activan alerta baja
      medium: number;
      high: number;
      critical: number;
    };
    autoPauseEnabled: boolean; // Si se aplican pausas automáticamente
    notificationChannels: ('email' | 'push' | 'in-app')[];
  };
  lastUpdated: string;
}

// Biblioteca de mensajes IA con tono segmentada por objetivo - US-CA-029
export type MessageObjective = 'venta' | 'inspiracion' | 'seguimiento';

export interface AIMessageTemplate {
  id: string;
  name: string;
  description: string;
  objective: MessageObjective;
  objectiveLabel: string; // Etiqueta legible
  tone: string; // Tono del entrenador (importado del perfil estratégico)
  channel: MessagingChannel;
  messageTemplate: string; // Plantilla base del mensaje
  variables: string[]; // Variables disponibles: {nombre}, {fecha}, etc.
  usageCount: number;
  lastUsed?: string;
  successRate?: number; // Tasa de éxito histórica (%)
  averageResponseRate?: number; // Tasa promedio de respuesta
  tags?: string[];
  isFavorite?: boolean;
  aiGenerated: boolean; // Si fue generado por IA
  aiGeneratedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIMessageLibrary {
  templates: AIMessageTemplate[];
  totalTemplates: number;
  byObjective: {
    venta: number;
    inspiracion: number;
    seguimiento: number;
  };
  byChannel: {
    [key in MessagingChannel]?: number;
  };
  trainerTone: string; // Tono del entrenador importado del perfil estratégico
  lastSyncedWithProfile?: string; // Última vez que se sincronizó con el perfil estratégico
  settings: {
    autoGenerateEnabled: boolean; // Si se generan mensajes automáticamente
    syncWithProfile: boolean; // Si se sincroniza automáticamente con el perfil estratégico
  };
  lastUpdated: string;
}

// Newsletter IA basadas en highlights semanales - US-CA-030
export interface WeeklyHighlight {
  id: string;
  category: 'client-success' | 'training-tip' | 'nutrition-advice' | 'motivation' | 'achievement' | 'community' | 'other';
  categoryLabel: string;
  title: string;
  description: string;
  clientName?: string; // Si es un logro de cliente
  date: string;
  importance: 'high' | 'medium' | 'low';
  imageUrl?: string;
  metrics?: {
    // Métricas relacionadas (ej: "3 clientes alcanzaron su objetivo")
    label: string;
    value: number | string;
  };
}

export interface WeeklyHighlightsSummary {
  weekStartDate: string;
  weekEndDate: string;
  highlights: WeeklyHighlight[];
  totalHighlights: number;
  byCategory: {
    [key: string]: number;
  };
  topHighlights: WeeklyHighlight[]; // Highlights más importantes
}

export interface AIGeneratedNewsletter {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  highlightsUsed: WeeklyHighlight[];
  cta: {
    text: string;
    url?: string;
    type: 'link' | 'button' | 'inline';
  };
  personalizationLevel: 'basic' | 'intermediate' | 'advanced';
  tone: string;
  estimatedValue: string; // Valor estimado del contenido
  generatedAt: string;
  status: 'draft' | 'reviewed' | 'approved' | 'sent';
}

export interface WeeklyHighlightsNewsletterGenerator {
  currentWeekSummary?: WeeklyHighlightsSummary;
  previousNewsletters: AIGeneratedNewsletter[];
  settings: {
    autoGenerateEnabled: boolean;
    defaultTone?: string;
    includeClientNames: boolean;
    ctaStyle: 'subtle' | 'moderate' | 'prominent';
    personalizationDepth: 'basic' | 'intermediate' | 'advanced';
  };
  lastGenerated?: string;
  lastUpdated: string;
}

// Prompts rápidos para WhatsApp con audio/nota de voz sugerida - US-CA-031
export type WhatsAppPromptCategory = 'follow-up' | 'motivation' | 'reminder' | 'celebration' | 'check-in' | 'offer' | 'custom';

export interface VoiceNoteSuggestion {
  id: string;
  title: string;
  description: string;
  duration?: number; // Duración estimada en segundos
  script?: string; // Script sugerido para la nota de voz
  tone: 'friendly' | 'professional' | 'casual' | 'motivational' | 'empathetic';
  useCase: string; // Cuándo usar esta nota de voz
  exampleScript?: string; // Ejemplo de lo que decir
}

export interface QuickWhatsAppPrompt {
  id: string;
  name: string;
  category: WhatsAppPromptCategory;
  categoryLabel: string;
  messageTemplate: string;
  variables: string[]; // Variables disponibles: {nombre}, {fecha}, etc.
  voiceNoteSuggestion?: VoiceNoteSuggestion;
  suggestedAudioDuration?: number; // Duración sugerida en segundos
  whenToUse: string; // Cuándo usar este prompt
  personalizationTips?: string[]; // Tips para personalizar el mensaje
  usageCount: number;
  lastUsed?: string;
  isFavorite?: boolean;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface QuickWhatsAppPromptsLibrary {
  prompts: QuickWhatsAppPrompt[];
  totalPrompts: number;
  byCategory: {
    [key in WhatsAppPromptCategory]?: number;
  };
  recentPrompts: QuickWhatsAppPrompt[];
  favoritePrompts: QuickWhatsAppPrompt[];
  voiceNoteSuggestions: VoiceNoteSuggestion[];
  settings: {
    defaultIncludeVoiceNote: boolean;
    defaultTone: 'friendly' | 'professional' | 'casual' | 'motivational';
    autoSuggestVoiceNote: boolean;
  };
  lastUpdated: string;
}

// Mapa de calor IA de horarios preferidos de envío - US-CA-HEATMAP
export interface HeatMapTimeSlot {
  hour: number; // 0-23
  dayOfWeek: number; // 0-6 (domingo-sábado)
  dayName: string;
  openRate: number; // Tasa de apertura (%)
  replyRate: number; // Tasa de respuesta (%)
  totalSent: number; // Total de mensajes enviados en este slot
  totalOpened: number; // Total de mensajes abiertos
  totalReplied: number; // Total de mensajes con respuesta
  score: number; // Puntuación IA combinada (0-100)
  recommendation: 'optimal' | 'good' | 'fair' | 'poor' | 'avoid'; // Recomendación IA
  aiInsight?: string; // Insight generado por IA
}

export interface HeatMapChannelData {
  channel: MessagingChannel;
  timeSlots: HeatMapTimeSlot[];
  optimalSlots: HeatMapTimeSlot[]; // Top 5 slots óptimos
  worstSlots: HeatMapTimeSlot[]; // Top 5 slots a evitar
  averageOpenRate: number;
  averageReplyRate: number;
  aiRecommendations: string[]; // Recomendaciones generales de IA
}

export interface AIHeatMapSendingSchedulesDashboard {
  period: '7d' | '30d' | '90d' | 'all';
  channels: HeatMapChannelData[];
  overallOptimalTime: {
    dayOfWeek: number;
    dayName: string;
    hour: number;
    score: number;
  };
  overallWorstTime: {
    dayOfWeek: number;
    dayName: string;
    hour: number;
    score: number;
  };
  aiInsights: {
    summary: string; // Resumen general de insights
    recommendations: string[]; // Recomendaciones accionables
    trends: Array<{
      trend: string; // Descripción de la tendencia
      impact: 'high' | 'medium' | 'low';
      action?: string; // Acción recomendada
    }>;
  };
  lastUpdated: string;
  lastAIAnalysis: string; // Última vez que se ejecutó el análisis IA
}

// KPIs accionables que relacionen mensajes enviados con reservas y ventas - US-CA-KPIS
export interface MessageToBookingConversion {
  messageId: string;
  messageType: MessageType;
  messageTypeLabel: string;
  channel: MessagingChannel;
  sentAt: string;
  clientId: string;
  clientName: string;
  bookingsGenerated: number; // Número de reservas generadas después del mensaje
  bookings: Array<{
    bookingId: string;
    bookingDate: string;
    sessionDate: string;
    timeToBook: number; // Horas entre mensaje y reserva
  }>;
  conversionRate: number; // % de mensajes que generaron reservas
  averageTimeToBook: number; // Tiempo promedio en horas para generar reserva
}

export interface MessageToSaleConversion {
  messageId: string;
  messageType: MessageType;
  messageTypeLabel: string;
  channel: MessagingChannel;
  sentAt: string;
  clientId: string;
  clientName: string;
  salesGenerated: number; // Número de ventas generadas después del mensaje
  sales: Array<{
    saleId: string;
    saleDate: string;
    amount: number;
    timeToSale: number; // Horas entre mensaje y venta
    productName?: string;
  }>;
  totalRevenue: number; // Ingresos totales generados
  conversionRate: number; // % de mensajes que generaron ventas
  averageTimeToSale: number; // Tiempo promedio en horas para generar venta
  averageSaleValue: number; // Valor promedio de venta
}

export interface CampaignImpactMetrics {
  campaignId: string;
  campaignName: string;
  campaignType: AutomationType | 'manual' | 'promotional';
  totalMessagesSent: number;
  bookingsGenerated: number;
  salesGenerated: number;
  totalRevenue: number;
  bookingConversionRate: number; // % de mensajes que generaron reservas
  saleConversionRate: number; // % de mensajes que generaron ventas
  revenuePerMessage: number; // Ingresos por mensaje enviado
  roi: number; // Retorno de inversión (si hay costos asociados)
  topPerformingMessages: Array<{
    messageId: string;
    messageType: string;
    bookings: number;
    sales: number;
    revenue: number;
  }>;
}

export interface ActionableKPIDashboard {
  period: '7d' | '30d' | '90d' | 'all';
  summary: {
    totalMessagesSent: number;
    totalBookingsGenerated: number;
    totalSalesGenerated: number;
    totalRevenue: number;
    overallBookingConversionRate: number;
    overallSaleConversionRate: number;
    averageRevenuePerMessage: number;
    roi: number;
    // KPIs específicos de campañas y automatizaciones
    automationConversionRate: number; // Tasa de conversión de automatizaciones
    activeAutomations: number; // Nº de automatizaciones activas
    draftAutomations: number; // Nº de automatizaciones en borrador
    messagesSentThisWeek: number; // Mensajes enviados esta semana
    optimalMessagesPerWeek: number; // Mensajes óptimos por semana
    automatedCampaignsRevenue: number; // Revenue atribuido a campañas automatizadas
    totalAutomatedCampaigns: number; // Total de campañas automatizadas
  };
  byMessageType: Array<{
    messageType: MessageType;
    messageTypeLabel: string;
    messagesSent: number;
    bookingsGenerated: number;
    salesGenerated: number;
    revenue: number;
    bookingConversionRate: number;
    saleConversionRate: number;
    revenuePerMessage: number;
  }>;
  byChannel: Array<{
    channel: MessagingChannel;
    messagesSent: number;
    bookingsGenerated: number;
    salesGenerated: number;
    revenue: number;
    bookingConversionRate: number;
    saleConversionRate: number;
    revenuePerMessage: number;
  }>;
  topPerformingMessages: Array<{
    messageId: string;
    messageType: MessageType;
    messageTypeLabel: string;
    channel: MessagingChannel;
    clientName: string;
    sentAt: string;
    bookingsGenerated: number;
    salesGenerated: number;
    revenue: number;
    conversionScore: number; // Puntuación combinada (0-100)
  }>;
  campaignImpact: CampaignImpactMetrics[];
  actionableInsights: Array<{
    insight: string;
    impact: 'high' | 'medium' | 'low';
    action: string; // Acción recomendada
    estimatedImpact?: string; // Impacto estimado de la acción
  }>;
  trends: {
    bookingConversionTrend: 'up' | 'down' | 'neutral';
    saleConversionTrend: 'up' | 'down' | 'neutral';
    revenueTrend: 'up' | 'down' | 'neutral';
    changePercentage: {
      bookings: number;
      sales: number;
      revenue: number;
    };
  };
  lastUpdated: string;
}

// User Story 1: Tablero de experimentos que compare versiones IA vs edición humana - US-CA-EXPERIMENTS
export type ExperimentVersionType = 'ai' | 'human';

export type ExperimentStatus = 'draft' | 'running' | 'completed' | 'paused' | 'cancelled';

export interface ExperimentVersion {
  id: string;
  type: ExperimentVersionType;
  name: string; // Nombre de la versión (ej: "Versión IA - Motivacional", "Versión Humana - Directa")
  content: {
    subject?: string; // Para emails
    message: string; // Contenido del mensaje
    cta?: string; // Call to action
    tone?: string; // Tono del mensaje
  };
  channel: MessagingChannel;
  metadata?: {
    // Metadatos adicionales
    createdBy?: string; // Usuario que creó la versión
    createdAt?: string;
    aiModel?: string; // Modelo de IA usado (si es versión IA)
    humanEditor?: string; // Editor humano (si es versión humana)
    notes?: string; // Notas sobre la versión
  };
}

export interface ExperimentMetric {
  versionId: string;
  versionType: ExperimentVersionType;
  sent: number; // Mensajes enviados
  delivered: number; // Mensajes entregados
  opened: number; // Mensajes abiertos
  clicked?: number; // Clics (para emails)
  replied: number; // Respuestas
  converted: number; // Conversiones (reservas, ventas, etc.)
  openRate: number; // Tasa de apertura (%)
  clickRate?: number; // Tasa de clics (%)
  replyRate: number; // Tasa de respuesta (%)
  conversionRate: number; // Tasa de conversión (%)
  revenue?: number; // Ingresos generados
  engagementScore: number; // Puntuación de engagement (0-100)
}

export interface Experiment {
  id: string;
  name: string;
  description: string;
  objective: string; // Objetivo del experimento (ej: "Mejorar tasa de apertura", "Aumentar conversiones")
  campaignId?: string; // ID de campaña relacionada
  campaignName?: string;
  channel: MessagingChannel;
  versions: ExperimentVersion[]; // Versiones del experimento (IA y humana)
  metrics: ExperimentMetric[]; // Métricas por versión
  status: ExperimentStatus;
  startDate: string;
  endDate?: string;
  targetAudience: {
    type: 'all' | 'segment' | 'custom';
    segmentId?: string;
    segmentName?: string;
    clientIds?: string[];
    clientCount: number; // Número de clientes en la audiencia
  };
  trafficSplit: {
    // Distribución de tráfico entre versiones
    ai: number; // Porcentaje de tráfico a versión IA (0-100)
    human: number; // Porcentaje de tráfico a versión humana (0-100)
  };
  winner?: {
    versionId: string;
    versionType: ExperimentVersionType;
    reason: string; // Razón por la cual ganó esta versión
    confidence: number; // Nivel de confianza (0-100)
  };
  insights: string[]; // Insights generados por IA
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface ExperimentsDashboard {
  experiments: Experiment[];
  totalExperiments: number;
  activeExperiments: number;
  completedExperiments: number;
  summary: {
    totalExperiments: number;
    aiWins: number; // Experimentos ganados por versión IA
    humanWins: number; // Experimentos ganados por versión humana
    tie: number; // Experimentos sin ganador claro
    averageImprovement: number; // Mejora promedio (%)
  };
  topPerformers: {
    // Top experimentos más exitosos
    experiments: Experiment[];
  };
  recentExperiments: Experiment[]; // Experimentos recientes
  insights: string[]; // Insights generales
  lastUpdated: string;
}

// User Story 2: Insights IA semanales con mejoras concretas - US-CA-WEEKLY-INSIGHTS
export type ImprovementType = 'cta' | 'delay' | 'tone' | 'content' | 'channel' | 'timing' | 'personalization' | 'other';

export type ImprovementPriority = 'high' | 'medium' | 'low';

export type ImprovementStatus = 'pending' | 'applied' | 'dismissed' | 'testing';

export interface WeeklyImprovement {
  id: string;
  type: ImprovementType;
  typeLabel: string; // Etiqueta legible
  title: string; // Título de la mejora
  description: string; // Descripción detallada
  currentState: {
    // Estado actual
    value: string | number; // Valor actual (ej: CTA actual, delay actual)
    label: string; // Etiqueta legible
  };
  suggestedState: {
    // Estado sugerido
    value: string | number; // Valor sugerido
    label: string; // Etiqueta legible
  };
  rationale: string; // Razón por la cual se sugiere esta mejora
  expectedImpact: {
    metric: string; // Métrica que se espera mejorar (ej: "open rate", "conversion rate")
    currentValue: number; // Valor actual
    expectedValue: number; // Valor esperado
    improvementPercentage: number; // Mejora esperada (%)
    impact: ImprovementPriority; // Impacto esperado
  };
  affectedAutomations: Array<{
    automationId: string;
    automationName: string;
    automationType: AutomationType;
  }>;
  affectedCampaigns: Array<{
    campaignId: string;
    campaignName: string;
  }>;
  priority: ImprovementPriority;
  effort: 'low' | 'medium' | 'high'; // Esfuerzo para implementar
  status: ImprovementStatus;
  appliedAt?: string; // Fecha en que se aplicó
  appliedBy?: string; // Usuario que aplicó la mejora
  testResults?: {
    // Resultados de pruebas (si se probó)
    testedAt: string;
    improvementAchieved: number; // Mejora lograda (%)
    actualImpact: string; // Impacto real
  };
  createdAt: string;
  updatedAt: string;
}

export interface WeeklyAIInsight {
  id: string;
  weekStartDate: string;
  weekEndDate: string;
  generatedAt: string;
  summary: string; // Resumen ejecutivo de la semana
  improvements: WeeklyImprovement[]; // Mejoras sugeridas
  metrics: {
    // Métricas de la semana
    totalMessagesSent: number;
    averageOpenRate: number;
    averageReplyRate: number;
    averageConversionRate: number;
    totalRevenue: number;
    trends: {
      openRate: 'up' | 'down' | 'neutral';
      replyRate: 'up' | 'down' | 'neutral';
      conversionRate: 'up' | 'down' | 'neutral';
      changePercentage: {
        openRate: number;
        replyRate: number;
        conversionRate: number;
      };
    };
  };
  topPerformers: {
    // Mejores performers de la semana
    automations: Array<{
      automationId: string;
      automationName: string;
      performance: number; // Puntuación de rendimiento (0-100)
    }>;
    campaigns: Array<{
      campaignId: string;
      campaignName: string;
      performance: number;
    }>;
    messages: Array<{
      messageId: string;
      messageType: MessageType;
      performance: number;
    }>;
  };
  opportunities: Array<{
    // Oportunidades de mejora
    title: string;
    description: string;
    impact: ImprovementPriority;
    effort: 'low' | 'medium' | 'high';
    estimatedImprovement: number; // Mejora estimada (%)
  }>;
  aiRecommendations: string[]; // Recomendaciones generales de IA
  status: 'draft' | 'reviewed' | 'archived';
}

export interface WeeklyAIInsightsDashboard {
  currentWeek?: WeeklyAIInsight;
  previousWeeks: WeeklyAIInsight[]; // Semanas anteriores
  totalImprovements: number;
  appliedImprovements: number;
  pendingImprovements: number;
  averageImprovement: number; // Mejora promedio lograda (%)
  summary: {
    totalInsights: number;
    totalImprovements: number;
    improvementsApplied: number;
    improvementsDismissed: number;
    averageImpact: number; // Impacto promedio
  };
  byType: {
    // Mejoras por tipo
    [key in ImprovementType]?: {
      total: number;
      applied: number;
      averageImpact: number;
    };
  };
  insights: string[]; // Insights generales
  lastUpdated: string;
  lastGenerated?: string; // Última vez que se generó un insight semanal
}

// User Story 1: Asignar tareas a miembros del equipo desde campañas
export type TeamMemberRole = 'copywriter' | 'community-manager' | 'designer' | 'video-editor' | 'other';

export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'reviewed' | 'cancelled';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TeamTask {
  id: string;
  campaignId: string;
  campaignName: string;
  title: string;
  description: string;
  assignedTo: {
    userId: string;
    userName: string;
    userEmail: string;
    role: TeamMemberRole;
    roleLabel: string; // Etiqueta legible del rol
  };
  role: TeamMemberRole; // Rol al que está asignada la tarea
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string; // Fecha límite
  context: {
    // Contexto de la campaña para que el equipo entienda qué hacer
    campaignObjective: string;
    targetAudience: string;
    channels: MessagingChannel[];
    campaignContent?: {
      // Contenido existente de la campaña para contexto
      emailSubject?: string;
      emailBody?: string;
      whatsappMessage?: string;
      socialMediaPosts?: string[];
    };
    brandGuidelines?: string; // Guías de marca o tono
    buyerPersona?: string; // Buyer persona objetivo
    campaignGoals?: string[]; // Objetivos de la campaña
  };
  deliverables: {
    // Entregables esperados según el rol
    type: 'copy' | 'content' | 'design' | 'video' | 'other';
    description: string;
    requirements?: string[]; // Requisitos específicos
    examples?: string[]; // Ejemplos de referencia
  }[];
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
  }>;
  comments?: Array<{
    id: string;
    userId: string;
    userName: string;
    message: string;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  completedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface CampaignTeamTasks {
  campaignId: string;
  campaignName: string;
  tasks: TeamTask[];
  totalTasks: number;
  byStatus: {
    pending: number;
    'in-progress': number;
    completed: number;
    reviewed: number;
    cancelled: number;
  };
  byRole: {
    [key in TeamMemberRole]?: number;
  };
  lastUpdated: string;
}

// User Story 2: Exportar playbooks IA con todo el contenido y programación
export type PlaybookFormat = 'json' | 'pdf' | 'markdown' | 'html';

export interface PlaybookContent {
  // Contenido del playbook
  campaignName: string;
  campaignDescription: string;
  objective: CampaignObjective;
  targetAudience: string;
  buyerPersona?: string;
  channels: MessagingChannel[];
  content: {
    email?: {
      subject: string;
      body: string;
      htmlContent?: string;
    };
    whatsapp?: {
      message: string;
      mediaUrl?: string;
    };
    sms?: {
      message: string;
    };
    social?: {
      posts: Array<{
        platform: string;
        content: string;
        mediaUrl?: string;
      }>;
    };
  };
  sequences?: Array<{
    stepNumber: number;
    name: string;
    delay: {
      value: number;
      unit: 'minutes' | 'hours' | 'days';
    };
    channel: MessagingChannel;
    messageTemplate: string;
    variables: string[];
  }>;
  automationRules?: Array<{
    name: string;
    trigger: string;
    condition: string;
    action: string;
    channel: MessagingChannel;
  }>;
  segmentation?: {
    criteria: SegmentCriteria[];
    segmentName: string;
    description: string;
  };
  scheduling?: {
    startDate: string;
    endDate?: string;
    frequency?: ScheduledMessageFrequency;
    preferredTimes?: Array<{
      dayOfWeek: number;
      dayName: string;
      time: string;
    }>;
  };
  metrics?: {
    expectedReach?: number;
    expectedConversionRate?: number;
    expectedRevenue?: number;
  };
  brandGuidelines?: {
    tone: string;
    voice: string;
    styleGuide?: string;
  };
  aiGenerated: boolean;
  aiModel?: string;
  generatedAt?: string;
}

export interface AIPlaybook {
  id: string;
  name: string;
  description: string;
  version: string; // Versión del playbook
  content: PlaybookContent;
  metadata: {
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    tags?: string[];
    category?: string;
    isTemplate: boolean; // Si es una plantilla reutilizable
    usageCount?: number; // Veces que se ha usado
    lastUsed?: string;
    successRate?: number; // Tasa de éxito histórica
  };
  exportHistory?: Array<{
    id: string;
    format: PlaybookFormat;
    exportedAt: string;
    exportedBy: string;
    fileUrl?: string;
    fileSize?: number;
  }>;
  sharing?: {
    sharedWith: Array<{
      partnerId: string;
      partnerName: string;
      sharedAt: string;
      accessLevel: 'view' | 'edit' | 'copy';
    }>;
    isPublic: boolean;
    publicUrl?: string;
  };
}

export interface PlaybookExportConfig {
  format: PlaybookFormat;
  includeContent: boolean; // Incluir contenido completo
  includeScheduling: boolean; // Incluir programación
  includeAutomationRules: boolean; // Incluir reglas de automatización
  includeSegmentation: boolean; // Incluir segmentación
  includeMetrics: boolean; // Incluir métricas
  includeBrandGuidelines: boolean; // Incluir guías de marca
  includeInstructions: boolean; // Incluir instrucciones de uso
  compress: boolean; // Comprimir archivo (si aplica)
}

export interface PlaybookExport {
  id: string;
  playbookId: string;
  playbookName: string;
  format: PlaybookFormat;
  config: PlaybookExportConfig;
  status: 'generating' | 'completed' | 'failed';
  fileUrl?: string;
  fileSize?: number;
  downloadedAt?: string;
  downloadedBy?: string;
  errorMessage?: string;
  exportedAt: string;
  exportedBy: string;
}

// User Story 1: Aprobar campañas desde el móvil con vista previa clara
export type CampaignApprovalStatus = 'pending' | 'approved' | 'rejected' | 'needs-changes';

export interface CampaignApproval {
  id: string;
  campaignId: string;
  campaignName: string;
  campaignType: 'multichannel' | 'promotional' | 'newsletter' | 'automation' | 'sequence';
  status: CampaignApprovalStatus;
  submittedBy: {
    userId: string;
    userName: string;
    userEmail: string;
  };
  submittedAt: string;
  reviewedBy?: {
    userId: string;
    userName: string;
    userEmail: string;
  };
  reviewedAt?: string;
  scheduledDate?: string;
  targetAudience: {
    type: 'all' | 'segment' | 'custom';
    segmentId?: string;
    segmentName?: string;
    clientCount: number;
  };
  channels: MessagingChannel[];
  content: {
    email?: {
      subject: string;
      body: string;
      htmlContent?: string;
      previewText?: string;
    };
    whatsapp?: {
      message: string;
      mediaUrl?: string;
      mediaType?: 'image' | 'video' | 'document';
    };
    sms?: {
      message: string;
    };
    push?: {
      title: string;
      body: string;
      imageUrl?: string;
    };
  };
  estimatedReach: number;
  estimatedCost?: number;
  notes?: string;
  rejectionReason?: string;
  requestedChanges?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
}

export interface MobileCampaignApprovalDashboard {
  pendingApprovals: CampaignApproval[];
  totalPending: number;
  byPriority: {
    urgent: number;
    high: number;
    medium: number;
    low: number;
  };
  byType: {
    multichannel: number;
    promotional: number;
    newsletter: number;
    automation: number;
    sequence: number;
  };
  recentApprovals: CampaignApproval[];
  lastUpdated: string;
}

// User Story 2: Sistema aprenda de campañas exitosas y recomiende repetirlas
export type CampaignSuccessMetric = 
  | 'conversion-rate' 
  | 'open-rate' 
  | 'reply-rate' 
  | 'revenue-generated' 
  | 'booking-rate' 
  | 'engagement-score'
  | 'roi';

export interface CampaignSuccessMetrics {
  campaignId: string;
  campaignName: string;
  campaignType: AutomationType | 'multichannel' | 'promotional' | 'newsletter' | 'sequence';
  channels: MessagingChannel[];
  objective: CampaignObjective;
  metrics: {
    conversionRate: number;
    openRate: number;
    replyRate: number;
    clickRate?: number;
    revenueGenerated: number;
    bookingsGenerated: number;
    salesGenerated: number;
    engagementScore: number; // Puntuación combinada (0-100)
    roi: number;
    totalSent: number;
    totalDelivered: number;
    totalOpened: number;
    totalReplied: number;
    totalConverted: number;
  };
  performancePeriod: {
    startDate: string;
    endDate: string;
    duration: number; // días
  };
  targetAudience: {
    type: 'all' | 'segment' | 'custom';
    segmentId?: string;
    segmentName?: string;
    clientCount: number;
  };
  content: {
    email?: {
      subject: string;
      body: string;
      htmlContent?: string;
    };
    whatsapp?: {
      message: string;
      mediaUrl?: string;
    };
    sms?: {
      message: string;
    };
  };
  successFactors: string[]; // Factores que contribuyeron al éxito
  tags: string[]; // Etiquetas de éxito
  successScore: number; // Puntuación de éxito (0-100)
  createdAt: string;
  completedAt: string;
}

export interface CampaignRecommendation {
  id: string;
  campaignId: string;
  campaignName: string;
  campaignType: AutomationType | 'multichannel' | 'promotional' | 'newsletter' | 'sequence';
  recommendationType: 'repeat' | 'clone' | 'adapt';
  recommendationReason: string; // Razón por la cual se recomienda
  successMetrics: CampaignSuccessMetrics;
  confidence: number; // Nivel de confianza (0-100)
  expectedImpact: {
    metric: CampaignSuccessMetric;
    currentValue: number;
    expectedValue: number;
    improvementPercentage: number;
    impact: 'high' | 'medium' | 'low';
  };
  suggestedChanges?: {
    // Cambios sugeridos si es 'adapt'
    targetAudience?: {
      type: 'all' | 'segment' | 'custom';
      segmentId?: string;
      segmentName?: string;
    };
    content?: {
      email?: {
        subject?: string;
        body?: string;
      };
      whatsapp?: {
        message?: string;
      };
    };
    scheduling?: {
      startDate?: string;
      endDate?: string;
      preferredTimes?: Array<{
        dayOfWeek: number;
        dayName: string;
        time: string;
      }>;
    };
    channels?: MessagingChannel[];
  };
  recommendedDate?: string; // Fecha recomendada para repetir
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'accepted' | 'rejected' | 'scheduled';
  createdAt: string;
  updatedAt: string;
}

export interface SuccessfulCampaignsRecommenderDashboard {
  recommendations: CampaignRecommendation[];
  totalRecommendations: number;
  byType: {
    repeat: number;
    clone: number;
    adapt: number;
  };
  byPriority: {
    high: number;
    medium: number;
    low: number;
  };
  topSuccessfulCampaigns: CampaignSuccessMetrics[];
  successInsights: {
    // Insights sobre qué hace exitosas a las campañas
    topChannels: Array<{
      channel: MessagingChannel;
      averageSuccessScore: number;
      campaignCount: number;
    }>;
    topObjectives: Array<{
      objective: CampaignObjective;
      averageSuccessScore: number;
      campaignCount: number;
    }>;
    topContentPatterns: Array<{
      pattern: string;
      description: string;
      averageSuccessScore: number;
      campaignCount: number;
    }>;
    optimalTiming: Array<{
      dayOfWeek: number;
      dayName: string;
      hour: number;
      averageSuccessScore: number;
    }>;
    successFactors: Array<{
      factor: string;
      description: string;
      impact: 'high' | 'medium' | 'low';
      frequency: number; // Frecuencia en campañas exitosas (%)
    }>;
  };
  learningProgress: {
    totalCampaignsAnalyzed: number;
    successfulCampaignsIdentified: number;
    recommendationsGenerated: number;
    recommendationsAccepted: number;
    averageSuccessScore: number;
    improvementTrend: 'up' | 'down' | 'neutral';
    improvementPercentage: number;
  };
  lastUpdated: string;
  lastAnalysisDate?: string;
}

// User Story: Detección de gaps en journeys y completado automático - US-CA-22
export type JourneyGapType = 
  | 'post-purchase' 
  | 'post-signup' 
  | 'post-booking' 
  | 'post-payment' 
  | 'follow-up' 
  | 'reactivation' 
  | 'milestone' 
  | 'abandonment';

export type JourneyGapSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface JourneyGap {
  id: string;
  sequenceId: string;
  sequenceName: string;
  sequenceGoal: LifecycleSequence['goal'];
  gapType: JourneyGapType;
  gapTypeLabel: string;
  severity: JourneyGapSeverity;
  description: string;
  detectedAt: string;
  expectedStep: {
    stepNumber: number;
    name: string;
    description: string;
    suggestedDelay: {
      value: number;
      unit: 'hours' | 'days';
    };
    suggestedChannel: MessagingChannel;
    suggestedMessageTemplate: string;
    suggestedTiming?: string; // Hora del día (ej: "09:00")
  };
  suggestedContent: {
    subject?: string; // Para email
    message: string;
    cta?: string;
    variables: string[];
    tone: 'friendly' | 'professional' | 'motivational' | 'urgent';
  };
  aiConfidence: number; // Nivel de confianza de la IA (0-100)
  impact: {
    affectedContacts: number;
    estimatedConversionImprovement: number; // % de mejora estimada
    estimatedRevenueImpact?: number; // Impacto estimado en ingresos
  };
  autoFillEnabled: boolean; // Si se puede completar automáticamente
  status: 'pending' | 'accepted' | 'rejected' | 'auto-filled' | 'dismissed';
  appliedAt?: string;
  appliedBy?: string;
}

export interface JourneyGapDetectorDashboard {
  gaps: JourneyGap[];
  totalGaps: number;
  bySeverity: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  byType: {
    [key in JourneyGapType]?: number;
  };
  bySequence: Array<{
    sequenceId: string;
    sequenceName: string;
    gapCount: number;
  }>;
  totalAffectedContacts: number;
  estimatedConversionImprovement: number;
  estimatedRevenueImpact: number;
  lastAnalysisDate: string;
  autoFillEnabled: boolean; // Si el auto-fill está habilitado
}

// User Story: Recomendaciones para nuevos canales - US-CA-23
export type ChannelRecommendationType = 'sms' | 'bot' | 'push' | 'in-app' | 'voice';

export type ChannelRecommendationReason = 
  | 'saturation' 
  | 'low-engagement' 
  | 'high-potential' 
  | 'complementary' 
  | 'cost-effective' 
  | 'better-reach';

export type ChannelRecommendationPriority = 'high' | 'medium' | 'low';

export interface ChannelRecommendation {
  id: string;
  recommendedChannel: ChannelRecommendationType;
  recommendedChannelLabel: string;
  reason: ChannelRecommendationReason;
  reasonLabel: string;
  priority: ChannelRecommendationPriority;
  description: string;
  currentState: {
    currentChannels: MessagingChannel[];
    saturationLevel: number; // Nivel de saturación actual (0-100)
    engagementRate: number; // Tasa de engagement actual
    reach: number; // Alcance actual
  };
  expectedImpact: {
    reachImprovement: number; // Mejora estimada en alcance (%)
    engagementImprovement: number; // Mejora estimada en engagement (%)
    conversionImprovement: number; // Mejora estimada en conversión (%)
    costReduction?: number; // Reducción estimada en costos (%)
    estimatedRevenueImpact?: number; // Impacto estimado en ingresos
  };
  implementationPlan: {
    steps: Array<{
      stepNumber: number;
      title: string;
      description: string;
      estimatedTime: string; // Tiempo estimado (ej: "30 minutos", "2 horas")
      requiredResources?: string[]; // Recursos necesarios
      dependencies?: string[]; // Dependencias de otros pasos
    }>;
    totalEstimatedTime: string;
    difficulty: 'easy' | 'medium' | 'hard';
    requiredIntegration?: string; // Integración necesaria
    cost?: number; // Costo estimado
  };
  useCases: Array<{
    title: string;
    description: string;
    exampleMessage?: string;
    expectedResult: string;
  }>;
  aiConfidence: number; // Nivel de confianza de la IA (0-100)
  status: 'pending' | 'accepted' | 'rejected' | 'in-progress' | 'completed' | 'dismissed';
  acceptedAt?: string;
  acceptedBy?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChannelRecommendationsDashboard {
  recommendations: ChannelRecommendation[];
  totalRecommendations: number;
  byPriority: {
    high: number;
    medium: number;
    low: number;
  };
  byChannel: {
    [key in ChannelRecommendationType]?: number;
  };
  byReason: {
    [key in ChannelRecommendationReason]?: number;
  };
  activeRecommendations: number; // Recomendaciones aceptadas en progreso
  completedRecommendations: number;
  totalEstimatedImpact: {
    reachImprovement: number;
    engagementImprovement: number;
    conversionImprovement: number;
    revenueImpact: number;
  };
  lastAnalysisDate: string;
  insights: string[]; // Insights generados por IA
}

