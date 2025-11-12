export type Sentiment = 'positive' | 'neutral' | 'negative';

export interface CommunitySummary {
  cNps: number;
  advocates: number;
  testimonialsCollected: number;
  retentionLift: number;
}

export interface CommunityPulseMetric {
  id: string;
  label: string;
  value: string;
  delta: number;
  trend: 'up' | 'down' | 'steady';
  description: string;
}

export type TestimonialType = 'texto' | 'video' | 'audio';
export type TestimonialSource = 'formulario' | 'whatsapp' | 'email' | 'manual' | 'google-reviews' | 'redes-sociales';
export type TestimonialStatus = 'pendiente' | 'aprobado' | 'rechazado' | 'publicado';

export interface Testimonial {
  id: string;
  customerName: string;
  customerId?: string;
  role: string;
  quote: string;
  score: number;
  channel: string;
  impactTag: string;
  createdAt: string;
  type: TestimonialType;
  source: TestimonialSource;
  status: TestimonialStatus;
  tags: string[];
  mediaUrl?: string; // Para video y audio
  updatedAt?: string;
}

export interface FeedbackInsight {
  id: string;
  topic: string;
  sentiment: Sentiment;
  responseRate: number;
  change: number;
  keyFinding: string;
  followUpAction: string;
  lastRun: string;
}

export interface FeedbackAutomation {
  id: string;
  name: string;
  trigger: string;
  audience: string;
  status: 'active' | 'paused' | 'draft';
  lastRun: string;
  nextAction: string;
}

export interface EngagementProgram {
  id: string;
  title: string;
  description: string;
  owner: string;
  kpi: string;
  progress: number;
  trend: 'positive' | 'negative' | 'flat';
}

export interface AdvocacyMoment {
  id: string;
  title: string;
  type: 'evento' | 'campaña' | 'seguimiento';
  owner: string;
  dueDate: string;
  status: 'en curso' | 'planificado' | 'completado';
  impact: string;
}

export interface CommunityFidelizacionSnapshot {
  period: '30d' | '90d' | '12m';
  summary: CommunitySummary;
  pulseMetrics: CommunityPulseMetric[];
  testimonials: Testimonial[];
  insights: FeedbackInsight[];
  automations: FeedbackAutomation[];
  programs: EngagementProgram[];
  advocacyMoments: AdvocacyMoment[];
  idealTestimonialMoments: IdealTestimonialMoment[];
  postSessionSurveys: PostSessionSurvey[];
  postSessionSurveyConfig?: PostSessionSurveyConfig;
  surveyTemplates?: SurveyTemplate[];
  negativeFeedbackAlerts?: NegativeFeedbackAlert[];
  promoterClients?: PromoterClient[];
  referralProgram?: ReferralProgram;
  referrals?: Referral[];
  referralStats?: ReferralStats;
  socialPlatformConnections?: SocialPlatformConnection[];
  reviewRequests?: ReviewRequest[];
  monthlyReports?: MonthlyReport[];
  monthlyReportConfig?: MonthlyReportConfig;
}

// Tipos para solicitudes de testimonio
export type TestimonialRequestStatus = 'pendiente' | 'recibido' | 'publicado' | 'rechazado';
export type TestimonialChannel = 'whatsapp' | 'email';
export type TestimonialTemplateMoment = 'objetivo-alcanzado' | 'programa-completado' | 'despues-sesiones' | 'personalizado';

export interface TestimonialTemplate {
  id: string;
  name: string;
  moment: TestimonialTemplateMoment;
  message: string;
  description: string;
  variables?: string[]; // Variables que se pueden personalizar como {nombre}, {objetivo}, etc.
}

export interface TestimonialRequest {
  id: string;
  clientId: string;
  clientName: string;
  templateId?: string;
  message: string;
  channel: TestimonialChannel;
  status: TestimonialRequestStatus;
  sentAt?: string;
  receivedAt?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Tipos para momentos ideales de testimonios (US-23)
export type IdealMomentType = 'objetivo-alcanzado' | 'programa-completado' | 'feedback-positivo' | 'sesiones-completadas';

export interface IdealTestimonialMoment {
  id: string;
  clientId: string;
  clientName: string;
  momentType: IdealMomentType;
  description: string;
  detectedAt: string;
  sessionId?: string;
  objectiveId?: string;
  programId?: string;
  sessionCount?: number;
  feedbackScore?: number;
  status: 'pending' | 'notified' | 'sent' | 'dismissed';
  notificationSentAt?: string;
  reminderSentAt?: string;
}

// Tipos para encuestas post-sesión (US-24)
export interface PostSessionSurvey {
  id: string;
  sessionId: string;
  clientId: string;
  clientName: string;
  sessionDate: string;
  surveySentAt?: string;
  surveyChannel: 'whatsapp' | 'email';
  responseReceivedAt?: string;
  satisfactionScore?: number; // 1-5 estrellas
  comment?: string;
  status: 'pending' | 'sent' | 'responded' | 'expired';
  hasNegativeFeedback: boolean;
}

export interface PostSessionSurveyConfig {
  id: string;
  enabled: boolean;
  delayHours: number; // 2-4 horas
  channel: 'whatsapp' | 'email' | 'both';
  question: string;
  allowComment: boolean;
  autoAlertOnNegative: boolean; // Alerta si feedback negativo
  negativeThreshold: number; // Puntuación <= X se considera negativo
}

// Tipos para plantillas de encuestas (US-10)
export type SurveyTemplateType = 'post-session' | 'monthly-progress' | 'program-satisfaction' | 'quarterly-nps';

export interface SurveyTemplate {
  id: string;
  name: string;
  type: SurveyTemplateType;
  description: string;
  defaultQuestions: string[];
  estimatedTime: number; // minutos
}

// Tipos para alertas de feedback negativo (US-11)
export interface NegativeFeedbackAlert {
  id: string;
  clientId: string;
  clientName: string;
  sessionId: string;
  sessionDate: string;
  detectedAt: string;
  rating?: number; // 1-5 estrellas
  comment?: string;
  priority: 'urgent' | 'high' | 'medium';
  status: 'pending' | 'in-progress' | 'resolved';
  notificationChannels?: ('in-app' | 'email' | 'whatsapp')[];
  clientHistory?: ClientHistory;
  recentSessions?: Session[];
  actionSuggestions?: ActionSuggestion[];
}

export interface ClientHistory {
  totalSessions: number;
  averageSatisfaction?: number;
  daysAsClient: number;
  lastSessionDate: string;
}

export interface Session {
  id: string;
  date: string;
  notes?: string;
  satisfactionScore?: number;
}

export interface ActionSuggestion {
  title: string;
  description: string;
}

// Tipos para clientes promotores (US-14)
export type PromoterSuggestionType = 'referido' | 'testimonio' | 'ambos';
export type PromoterSuggestionTiming = 'ahora' | 'esta-semana' | 'este-mes' | 'mas-adelante';

export interface PromoterClient {
  id: string;
  clientId: string;
  clientName: string;
  email?: string;
  phone?: string;
  promoterScore: number; // 0-100
  satisfactionScore: number; // Promedio de satisfacción
  attendanceRate: number; // Porcentaje de asistencia
  objectivesCompleted: number;
  totalObjectives: number;
  positiveFeedbackCount: number;
  lastPositiveFeedback?: string;
  daysAsClient: number;
  lastSessionDate?: string;
  suggestionType: PromoterSuggestionType;
  suggestionTiming: PromoterSuggestionTiming;
  suggestionReason: string;
  lastContactedForReferral?: string;
  lastContactedForTestimonial?: string;
  tags: string[];
}

// Tipos para programa de referidos (US-15)
export type RewardType = 'descuento' | 'sesion-gratis' | 'bono' | 'producto' | 'personalizado';
export type ReferralStatus = 'pendiente' | 'en-proceso' | 'convertido' | 'recompensado' | 'expirado';

export interface ReferralReward {
  id: string;
  type: RewardType;
  name: string;
  description: string;
  value: number; // Porcentaje de descuento, número de sesiones, etc.
  currency?: string; // Para bonos monetarios
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ReferralProgram {
  id: string;
  name: string;
  description: string;
  reward: ReferralReward;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  totalReferrals: number;
  convertedReferrals: number;
  totalRewardsGiven: number;
}

export interface Referral {
  id: string;
  programId: string;
  referrerClientId: string;
  referrerClientName: string;
  referredEmail: string;
  referredName?: string;
  referralLink: string;
  status: ReferralStatus;
  convertedAt?: string;
  rewardGivenAt?: string;
  createdAt: string;
  updatedAt?: string;
  notes?: string;
}

export interface ReferralStats {
  totalReferrals: number;
  convertedReferrals: number;
  conversionRate: number;
  totalRewardsGiven: number;
  topReferrers: {
    clientId: string;
    clientName: string;
    referralCount: number;
    convertedCount: number;
  }[];
  referralsByStatus: {
    status: ReferralStatus;
    count: number;
  }[];
  referralsByMonth: {
    month: string;
    count: number;
    converted: number;
  }[];
}

// Tipos para integración de plataformas sociales (US-19)
export type SocialPlatform = 'google-my-business' | 'facebook' | 'instagram';
export type SyncFrequency = 'hourly' | 'daily' | 'weekly' | 'manual';

export interface SocialPlatformConnection {
  id: string;
  platform: SocialPlatform;
  name: string;
  isConnected: boolean;
  connectedAt?: string;
  lastSyncAt?: string;
  syncFrequency: SyncFrequency;
  reviewsImported: number;
  reviewsThisMonth: number;
  accountName?: string;
  accountId?: string;
  error?: string;
}

export interface ReviewRequest {
  id: string;
  clientId: string;
  clientName: string;
  platform: SocialPlatform;
  requestedAt: string;
  status: 'pending' | 'sent' | 'completed' | 'expired';
  link?: string;
  completedAt?: string;
}

// Tipos para reportes mensuales (US-20)
export type ReportStatus = 'pending' | 'generating' | 'completed' | 'sent' | 'failed';
export type ReportFormat = 'pdf' | 'email' | 'both';

export interface MonthlyReport {
  id: string;
  month: string; // YYYY-MM
  period: string; // "Octubre 2025"
  status: ReportStatus;
  averageSatisfaction: number;
  testimonialsCollected: number;
  promoterClients: number;
  negativeFeedbackResolved: number;
  trends: ReportTrend[];
  comparisonWithPreviousMonth: MonthComparison;
  generatedAt?: string;
  sentAt?: string;
  downloadUrl?: string;
  recipients?: string[];
  format: ReportFormat;
}

export interface ReportTrend {
  metric: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'stable';
  description: string;
}

export interface MonthComparison {
  averageSatisfaction: { current: number; previous: number; change: number };
  testimonialsCollected: { current: number; previous: number; change: number };
  promoterClients: { current: number; previous: number; change: number };
  negativeFeedbackResolved: { current: number; previous: number; change: number };
}

export interface MonthlyReportConfig {
  id: string;
  enabled: boolean;
  autoSend: boolean;
  sendDate: number; // Día del mes (1-31)
  recipients: string[];
  format: ReportFormat;
  includeCharts: boolean;
  includeTestimonials: boolean;
  includeTrends: boolean;
}











