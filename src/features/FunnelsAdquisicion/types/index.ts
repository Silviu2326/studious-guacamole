export type FunnelsAcquisitionPeriod = '7d' | '30d' | '90d';

export type TrendDirection = 'up' | 'down' | 'neutral';

export interface AcquisitionKPI {
  id: string;
  label: string;
  value: number;
  changePercentage?: number;
  period: FunnelsAcquisitionPeriod;
  format?: 'number' | 'currency' | 'percentage';
  target?: number;
  trendDirection: TrendDirection;
}

export interface AcquisitionCampaign {
  id: string;
  name: string;
  channel: string;
  objective: string;
  status: 'active' | 'paused' | 'scheduled';
  spend: number;
  budget: number;
  roas: number;
  ctr: number;
  leadsGenerated: number;
  qualifiedRate: number;
  startDate: string;
  endDate?: string;
}

export interface AcquisitionFunnelPerformance {
  id: string;
  name: string;
  stage: 'TOFU' | 'MOFU' | 'BOFU';
  revenue: number;
  conversionRate: number;
  velocityDays: number;
  growthPercentage: number;
  qualifiedLeads: number;
}

export interface AcquisitionEvent {
  id: string;
  title: string;
  date: string;
  type: 'webinar' | 'live' | 'workshop' | 'challenge';
  status: 'draft' | 'scheduled' | 'registration_open';
  targetAudience: string;
  registrations: number;
  goal: number;
  host: string;
  funnelLink?: string;
}

export interface AcquisitionAISuggestion {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  rationale: string;
  cta: string;
}

export interface WorkspaceFocusMetric {
  id: string;
  label: string;
  value: string;
  helper?: string;
  change?: number;
  trend?: TrendDirection;
}

export interface WorkspaceAction {
  id: string;
  title: string;
  description: string;
  cta: string;
  href?: string;
}

export interface WorkspaceAutomation {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
}

export interface WorkspaceResource {
  id: string;
  label: string;
  href: string;
}

export interface AcquisitionWorkspaceBlueprint {
  id: string;
  title: string;
  description: string;
  focusMetrics: WorkspaceFocusMetric[];
  recommendedActions: WorkspaceAction[];
  automations: WorkspaceAutomation[];
  resources: WorkspaceResource[];
}

export interface FunnelsAcquisitionSnapshot {
  period: FunnelsAcquisitionPeriod;
  kpis: AcquisitionKPI[];
  campaigns: AcquisitionCampaign[];
  funnels: AcquisitionFunnelPerformance[];
  events: AcquisitionEvent[];
  aiSuggestions: AcquisitionAISuggestion[];
  workspaceBlueprints: AcquisitionWorkspaceBlueprint[];
}

// US-FA-008: Sistema de alertas y tareas automáticas para leads en riesgo
export type LeadRiskLevel = 'high' | 'medium' | 'low';
export type LeadStage = 'consulta_solicitada' | 'consulta_realizada' | 'primera_sesion_pagada' | 'cliente_activo';
export type SuggestedActionType = 'email' | 'whatsapp' | 'llamada' | 'oferta_especial' | 'recordatorio';

export interface LeadRiskAlert {
  id: string;
  leadId: string;
  leadName: string;
  leadEmail?: string;
  leadPhone?: string;
  currentStage: LeadStage;
  riskLevel: LeadRiskLevel;
  daysSinceLastAction: number;
  lastActionDate: string;
  reason: string;
  suggestedActions: SuggestedAction[];
  createdAt: string;
}

export interface SuggestedAction {
  id: string;
  type: SuggestedActionType;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  template?: string;
  scheduledFor?: string;
  completed?: boolean;
  completedAt?: string;
}

// US-FA-009: Métrica de conversión de primera sesión a cliente con plan recurrente o bono
export interface FirstSessionConversionMetric {
  period: FunnelsAcquisitionPeriod;
  totalFirstSessions: number;
  convertedToRecurring: number;
  convertedToBonus: number;
  totalConverted: number;
  conversionRate: number;
  conversionRateRecurring: number;
  conversionRateBonus: number;
  averageDaysToConvert: number;
  averageValueRecurring: number;
  averageValueBonus: number;
  totalRevenue: number;
  comparison?: PeriodComparison;
  suggestions: ConversionSuggestion[];
}

export interface PeriodComparison {
  previousPeriod: FunnelsAcquisitionPeriod;
  conversionRateChange: number;
  conversionRateChangePercentage: number;
  totalConvertedChange: number;
  totalConvertedChangePercentage: number;
  trendDirection: TrendDirection;
}

export interface ConversionSuggestion {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: 'follow_up' | 'pricing' | 'offer' | 'timing' | 'communication';
}

// US-FA-010: Integración con métricas de redes sociales
export type SocialMediaPlatform = 'instagram' | 'facebook' | 'tiktok' | 'youtube' | 'linkedin';

export interface SocialMediaPost {
  id: string;
  platform: SocialMediaPlatform;
  postId: string;
  content: string;
  imageUrl?: string;
  publishedAt: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    totalEngagement: number;
  };
  leadsGenerated: number;
  inquiriesGenerated: number;
  engagementToLeadRate: number;
  timeInvestedMinutes: number;
  roi: number; // ROI basado en tiempo invertido vs leads generados
}

export interface SocialMediaMetrics {
  period: FunnelsAcquisitionPeriod;
  platforms: SocialMediaPlatformMetrics[];
  topPosts: SocialMediaPost[];
  totalEngagement: number;
  totalLeads: number;
  totalInquiries: number;
  totalTimeInvestedMinutes: number;
  averageROI: number;
  comparison?: PeriodComparison;
}

export interface SocialMediaPlatformMetrics {
  platform: SocialMediaPlatform;
  postsCount: number;
  totalEngagement: number;
  leadsGenerated: number;
  inquiriesGenerated: number;
  engagementToLeadRate: number;
  timeInvestedMinutes: number;
  roi: number;
  trendDirection: TrendDirection;
}

// US-FA-012: Sistema de tracking de referidos
export interface ReferralSource {
  id: string;
  referrerId: string;
  referrerName: string;
  referrerEmail?: string;
  referrerPhone?: string;
  referrerType: 'cliente' | 'colaborador' | 'influencer' | 'otro';
  totalReferrals: number;
  convertedReferrals: number;
  conversionRate: number;
  totalRevenue: number;
  averageCustomerValue: number;
  lifetimeValue: number;
  firstReferralDate: string;
  lastReferralDate: string;
}

export interface ReferralProgramMetrics {
  period: FunnelsAcquisitionPeriod;
  totalReferrals: number;
  convertedReferrals: number;
  conversionRate: number;
  totalRevenue: number;
  averageCustomerValue: number;
  topReferrers: ReferralSource[];
  referralSources: ReferralSource[];
  programPerformance: {
    totalParticipants: number;
    activeReferrers: number;
    averageReferralsPerPerson: number;
    programROI: number;
  };
  comparison?: PeriodComparison;
  suggestions: ReferralProgramSuggestion[];
}

export interface ReferralProgramSuggestion {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: 'incentives' | 'communication' | 'tracking' | 'promotion' | 'optimization';
}

// US-FA-014: Generar funnels recomendados según especialidad y objetivos
export type TrainerSpecialty =
  | 'fuerza'
  | 'hiit'
  | 'yoga'
  | 'pilates'
  | 'crossfit'
  | 'nutricion'
  | 'rehabilitacion'
  | 'perdida_peso'
  | 'ganancia_muscular'
  | 'running'
  | 'funcional'
  | 'calistenia'
  | 'boxeo'
  | 'natacion'
  | 'otro';

export type TrainerObjective =
  | 'captar_leads'
  | 'aumentar_ventas'
  | 'fidelizar_clientes'
  | 'lanzar_nuevo_servicio'
  | 'aumentar_valor_ticket'
  | 'mejorar_conversion'
  | 'expandir_audiencia'
  | 'posicionamiento_marca';

export interface RecommendedFunnel {
  id: string;
  name: string;
  description: string;
  specialty: TrainerSpecialty[];
  objectives: TrainerObjective[];
  stages: RecommendedFunnelStage[];
  estimatedConversion: number;
  estimatedRevenue: number;
  difficulty: 'principiante' | 'intermedio' | 'avanzado';
  timeToLaunch: string;
  tags: string[];
}

export interface RecommendedFunnelStage {
  id: string;
  title: string;
  stageType: 'Captación' | 'Cualificación' | 'Nurturing' | 'Conversión' | 'Onboarding' | 'Retención';
  description: string;
  suggestedCopy: string;
  suggestedAssets: string[];
  order: number;
}

export interface FunnelRecommendationRequest {
  specialties: TrainerSpecialty[];
  objectives: TrainerObjective[];
  currentFunnels?: string[];
  budget?: number;
  timeAvailable?: 'bajo' | 'medio' | 'alto';
}

export interface FunnelRecommendationResponse {
  recommendedFunnels: RecommendedFunnel[];
  personalizedMessage: string;
  nextSteps: string[];
}

// US-FA-015: Definir buyer personas y dolores principales en el builder
export interface BuyerPersona {
  id: string;
  name: string;
  description: string;
  demographics: {
    ageRange?: string;
    gender?: string;
    location?: string;
    income?: string;
    occupation?: string;
  };
  goals: string[];
  painPoints: string[];
  motivations: string[];
  preferredChannels: string[];
  objections: string[];
  toneOfVoice: string;
  keywords: string[];
}

export interface PainPoint {
  id: string;
  title: string;
  description: string;
  category: 'fisico' | 'emocional' | 'social' | 'economico' | 'tiempo' | 'conocimiento';
  intensity: 'bajo' | 'medio' | 'alto';
  frequency: string;
  impact: string;
}

export interface FunnelPersonalization {
  funnelId: string;
  buyerPersonas: BuyerPersona[];
  painPoints: PainPoint[];
  adaptedCopy: Record<string, string>; // stageId -> adapted copy
  adaptedAssets: Record<string, string[]>; // stageId -> adapted assets
  lastUpdated: string;
}

export interface CopyAdaptation {
  originalCopy: string;
  adaptedCopy: string;
  personaId: string;
  painPointIds: string[];
  reasoning: string;
}

// US-FA-03: Guardar configuraciones de tono y CTA favoritos
export type ToneOfVoice = 
  | 'motivacional'
  | 'educativo'
  | 'enérgico'
  | 'empático'
  | 'profesional'
  | 'directo'
  | 'inspirador'
  | 'cercano';

export interface FavoriteToneConfig {
  id: string;
  name: string;
  tone: ToneOfVoice;
  description?: string;
  examples?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FavoriteCTAConfig {
  id: string;
  name: string;
  ctaText: string;
  ctaStyle?: 'primary' | 'secondary' | 'outline' | 'ghost';
  context?: string; // Ej: "Landing page", "Email", "WhatsApp"
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ToneAndCTAPreset {
  id: string;
  name: string;
  description?: string;
  toneConfig: FavoriteToneConfig;
  ctaConfig: FavoriteCTAConfig;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

// US-FA-04: Sugerencias de formatos de lead magnet según avatar
export type LeadMagnetFormat = 
  | 'guia_nutricional'
  | 'checklist_hiit'
  | 'mini_curso'
  | 'calculadora'
  | 'quiz'
  | 'plantilla'
  | 'ebook'
  | 'video_serie'
  | 'workshop_grabado'
  | 'challenge';

export interface LeadMagnetFormatSuggestion {
  id: string;
  format: LeadMagnetFormat;
  title: string;
  description: string;
  recommendedForPersonas: string[]; // IDs de buyer personas
  estimatedConversion: number;
  difficulty: 'facil' | 'medio' | 'avanzado';
  timeToCreate: string;
  exampleTitles?: string[];
  benefits?: string[];
}

export interface AvatarBasedFormatSuggestions {
  personaId: string;
  personaName: string;
  suggestions: LeadMagnetFormatSuggestion[];
  personalizedMessage?: string;
}

// US-FA-05: Generar el copy completo de la landing page con IA en mi tono
export interface LandingPageCopySection {
  id: string;
  sectionType: 'hero' | 'benefits' | 'testimonials' | 'faq' | 'cta' | 'features' | 'social_proof';
  title?: string;
  content: string;
  suggestedLength?: number;
}

export interface LandingPageCopyGenerationRequest {
  landingPageId?: string;
  objective: string; // Ej: "Captar leads", "Vender servicio", "Registro a evento"
  targetAudience?: string;
  toneOfVoice: ToneOfVoice;
  customToneDescription?: string;
  sections: LandingPageCopySection['sectionType'][];
  keyMessages?: string[]; // Mensajes clave a incluir
  ctaText?: string;
  includeTestimonials?: boolean;
  includeFAQ?: boolean;
}

export interface LandingPageCopyGenerationResponse {
  sections: LandingPageCopySection[];
  metaTitle?: string;
  metaDescription?: string;
  suggestedHeadlines?: string[];
  suggestedCTAs?: string[];
  reasoning?: string; // Explicación de por qué se generó así
  estimatedConversion?: number; // Estimación de conversión basada en mejores prácticas
}

// US-FA-06: Formularios inteligentes que capturen datos relevantes
export type FormFieldType = 
  | 'text'
  | 'email'
  | 'phone'
  | 'select'
  | 'multiselect'
  | 'date'
  | 'time'
  | 'textarea'
  | 'number'
  | 'checkbox'
  | 'radio';

export interface IntelligentFormField {
  id: string;
  label: string;
  fieldType: FormFieldType;
  required: boolean;
  placeholder?: string;
  options?: string[]; // Para select, multiselect, radio
  validationRules?: {
    min?: number;
    max?: number;
    pattern?: string;
    customMessage?: string;
  };
  aiSuggested?: boolean; // Si fue sugerido por IA
  dataCategory: 'objectives' | 'availability' | 'preferences' | 'contact' | 'health' | 'other';
  mappingField?: string; // Campo al que mapea en el CRM (ej: "objetivo_principal", "disponibilidad_horaria")
}

export interface IntelligentForm {
  id: string;
  name: string;
  description?: string;
  funnelId?: string;
  landingPageId?: string;
  fields: IntelligentFormField[];
  settings: {
    showProgress?: boolean;
    allowSaveProgress?: boolean;
    redirectUrl?: string;
    thankYouMessage?: string;
    autoQualify?: boolean; // Si debe calificar automáticamente según respuestas
    triggerCampaigns?: string[]; // IDs de campañas a activar según respuestas
  };
  createdAt: string;
  updatedAt: string;
}

export interface IntelligentFormSuggestionRequest {
  objective: string; // Objetivo del formulario
  targetAudience?: string;
  funnelStage?: 'TOFU' | 'MOFU' | 'BOFU';
  existingFields?: string[]; // Campos que ya existen
  dataNeeded?: ('objectives' | 'availability' | 'preferences' | 'contact' | 'health')[];
}

export interface IntelligentFormSuggestion {
  suggestedFields: IntelligentFormField[];
  reasoning: string;
  estimatedCompletionRate?: number;
  suggestedOrder: string[]; // Orden sugerido de los campos
  conditionalLogic?: {
    fieldId: string;
    condition: string;
    showFields: string[];
  }[];
}

export interface FormSubmission {
  formId: string;
  leadId?: string;
  responses: Record<string, any>; // fieldId -> value
  submittedAt: string;
  qualified?: boolean;
  qualificationScore?: number;
  triggeredCampaigns?: string[];
}

// US-FA-07: A/B tests guiados por IA (copy, oferta, formato)
export type FunnelExperimentType = 'copy' | 'offer' | 'format' | 'cta' | 'headline' | 'image';
export type FunnelExperimentStatus = 'draft' | 'running' | 'paused' | 'completed' | 'archived';

export interface FunnelExperiment {
  id: string;
  funnelId: string;
  name: string;
  description?: string;
  type: FunnelExperimentType;
  status: FunnelExperimentStatus;
  objective: string; // Ej: "Mejorar conversión de formulario"
  variants: FunnelExperimentVariant[];
  trafficSplit: number; // Porcentaje para variante A (50 = 50/50)
  startDate?: string;
  endDate?: string;
  winner?: string; // ID de la variante ganadora
  confidence?: number; // Nivel de confianza estadística (0-100)
  lift?: number; // Mejora relativa en porcentaje
  statisticalSignificance?: number; // Significancia estadística (0-100)
  totalVisitors: number;
  totalConversions: number;
  averageConversionRate: number;
  aiSuggestions?: AIExperimentSuggestion[];
  createdAt: string;
  updatedAt: string;
}

export interface FunnelExperimentVariant {
  id: string;
  experimentId: string;
  name: string;
  description?: string;
  isControl: boolean; // Si es la variante de control (original)
  content: ExperimentContent;
  visitors: number;
  conversions: number;
  conversionRate: number;
  revenue?: number;
  averageTimeOnPage?: number; // En segundos
  bounceRate?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExperimentContent {
  // Para tipo 'copy'
  headline?: string;
  subheadline?: string;
  body?: string;
  ctaText?: string;
  
  // Para tipo 'offer'
  offerTitle?: string;
  offerDescription?: string;
  offerPrice?: number;
  offerDiscount?: number;
  offerValue?: string; // Ej: "€89/mes", "3 meses gratis"
  
  // Para tipo 'format'
  layout?: 'single-column' | 'two-column' | 'three-column';
  imagePosition?: 'left' | 'right' | 'top' | 'bottom' | 'background';
  formStyle?: 'inline' | 'popup' | 'sidebar' | 'bottom-bar';
  
  // Para tipo 'image'
  imageUrl?: string;
  imageAlt?: string;
  
  // Metadata
  aiGenerated?: boolean;
  aiReasoning?: string;
}

export interface AIExperimentSuggestion {
  id: string;
  title: string;
  description: string;
  variantType: FunnelExperimentType;
  suggestedContent: Partial<ExperimentContent>;
  expectedImpact: 'high' | 'medium' | 'low';
  reasoning: string;
  estimatedLift?: number; // Porcentaje de mejora esperada
}

// US-FA-08: Identificación de cuellos de botella por etapa
export type FunnelStageType = 'visitas' | 'formulario' | 'cierre' | 'consulta' | 'primera_sesion' | 'conversion';
export type BottleneckSeverity = 'critical' | 'high' | 'medium' | 'low' | 'none';

export interface FunnelStageMetrics {
  stageId: string;
  stageType: FunnelStageType;
  stageName: string;
  order: number; // Orden en el funnel (1, 2, 3...)
  visitors: number;
  entries: number; // Entradas a esta etapa
  exits: number; // Salidas de esta etapa
  conversions: number; // Conversiones en esta etapa
  conversionRate: number; // Tasa de conversión de esta etapa
  dropoffRate: number; // Tasa de abandono
  averageTime: number; // Tiempo promedio en esta etapa (segundos)
  bottleneckScore: number; // Score de cuello de botella (0-100)
  severity: BottleneckSeverity;
  comparison?: {
    previousPeriod: FunnelsAcquisitionPeriod;
    conversionRateChange: number;
    conversionRateChangePercentage: number;
    trendDirection: TrendDirection;
  };
}

export interface FunnelBottleneck {
  id: string;
  funnelId: string;
  stageId: string;
  stageType: FunnelStageType;
  stageName: string;
  severity: BottleneckSeverity;
  problem: string; // Descripción del problema
  impact: string; // Impacto del cuello de botella
  affectedLeads: number; // Número de leads afectados
  potentialLoss: number; // Pérdida potencial de conversiones
  potentialRevenue: number; // Revenue potencial si se resuelve
  aiRecommendations: BottleneckRecommendation[];
  metrics: FunnelStageMetrics;
  detectedAt: string;
}

export interface BottleneckRecommendation {
  id: string;
  title: string;
  description: string;
  actionType: 'improve_offer' | 'nurture_leads' | 'optimize_form' | 'adjust_timing' | 'improve_copy' | 'add_urgency' | 'simplify_process';
  priority: 'high' | 'medium' | 'low';
  estimatedImpact: 'high' | 'medium' | 'low';
  estimatedLift?: number; // Porcentaje de mejora esperada
  steps: string[]; // Pasos para implementar
  resources?: {
    title: string;
    url: string;
  }[];
  reasoning: string;
}

export interface FunnelPerformanceAnalysis {
  funnelId: string;
  funnelName: string;
  period: FunnelsAcquisitionPeriod;
  totalVisitors: number;
  totalConversions: number;
  overallConversionRate: number;
  stages: FunnelStageMetrics[];
  bottlenecks: FunnelBottleneck[];
  topBottleneck?: FunnelBottleneck;
  healthScore: number; // Score de salud del funnel (0-100)
  trendDirection: TrendDirection;
  comparison?: {
    previousPeriod: FunnelsAcquisitionPeriod;
    conversionRateChange: number;
    conversionRateChangePercentage: number;
    trendDirection: TrendDirection;
  };
  recommendations: BottleneckRecommendation[];
  lastAnalyzedAt: string;
}

// US-FA-016: Recomendaciones de nurturing según respuestas del lead magnet
export type NurturingChannel = 'email' | 'whatsapp' | 'sms' | 'phone' | 'dm';
export type NurturingPriority = 'high' | 'medium' | 'low';
export type NurturingTiming = 'immediate' | '1h' | '6h' | '24h' | '48h' | '1w';

export interface NurturingRecommendation {
  id: string;
  leadMagnetId: string;
  leadMagnetName: string;
  formSubmissionId: string;
  leadId?: string;
  recommendations: NurturingStepRecommendation[];
  personalizedMessage?: string;
  reasoning: string;
  estimatedConversionLift?: number; // Porcentaje de mejora esperada
  createdAt: string;
}

export interface NurturingStepRecommendation {
  id: string;
  stepNumber: number;
  channel: NurturingChannel;
  timing: NurturingTiming;
  priority: NurturingPriority;
  title: string;
  messageTemplate: string;
  personalizationVariables: string[]; // Variables a personalizar (ej: {{nombre}}, {{objetivo}})
  suggestedContent?: {
    subject?: string; // Para email
    body: string;
    cta?: string;
    attachments?: string[]; // URLs o IDs de recursos
  };
  conditions?: {
    fieldId: string;
    operator: 'equals' | 'contains' | 'greater_than' | 'less_than';
    value: any;
  }[];
  reasoning: string;
  expectedImpact: 'high' | 'medium' | 'low';
}

export interface LeadMagnetResponseAnalysis {
  formSubmissionId: string;
  leadMagnetId: string;
  responses: Record<string, any>; // fieldId -> value
  analyzedAt: string;
  insights: {
    primaryObjective?: string;
    urgencyLevel?: 'high' | 'medium' | 'low';
    budgetRange?: string;
    preferredContactMethod?: NurturingChannel;
    painPoints?: string[];
    interests?: string[];
  };
}

export interface NurturingRecommendationRequest {
  formSubmissionId: string;
  leadMagnetId: string;
  leadId?: string;
  responses: Record<string, any>;
  buyerPersonaId?: string;
  existingNurturingSequenceId?: string;
}

// US-FA-017: Enviar funnel a Campañas & Automatización
export interface FunnelExportPackage {
  funnelId: string;
  funnelName: string;
  exportedAt: string;
  exportedBy: string;
  assets: FunnelExportAssets;
  campaigns: FunnelExportCampaign[];
  sequences: FunnelExportSequence[];
  lists: FunnelExportList[];
  timing: FunnelExportTiming;
  metadata: {
    version: string;
    notes?: string;
    tags?: string[];
  };
}

export interface FunnelExportAssets {
  messages: FunnelExportMessage[];
  templates: FunnelExportTemplate[];
  forms?: IntelligentForm[];
  landingPages?: {
    id: string;
    name: string;
    url: string;
  }[];
  leadMagnets?: {
    id: string;
    name: string;
    format: string;
  }[];
}

export interface FunnelExportMessage {
  id: string;
  stageId: string;
  stageName: string;
  channel: 'email' | 'whatsapp' | 'sms';
  subject?: string;
  content: string;
  variables: string[];
  attachments?: string[];
  cta?: {
    text: string;
    url?: string;
  };
}

export interface FunnelExportTemplate {
  id: string;
  name: string;
  type: 'email' | 'whatsapp' | 'sms';
  content: string;
  variables: string[];
  category?: string;
}

export interface FunnelExportCampaign {
  id: string;
  name: string;
  description?: string;
  channel: 'email' | 'whatsapp' | 'sms' | 'multi';
  objective: string;
  targetAudience?: string;
  status: 'draft' | 'scheduled' | 'active';
  scheduledFor?: string;
}

export interface FunnelExportSequence {
  id: string;
  name: string;
  description?: string;
  trigger: {
    type: 'form_submission' | 'lead_magnet_download' | 'stage_completion' | 'manual';
    conditions?: Record<string, any>;
  };
  steps: FunnelExportSequenceStep[];
  totalDuration?: string; // Ej: "7 días"
}

export interface FunnelExportSequenceStep {
  stepNumber: number;
  delay: {
    value: number;
    unit: 'minutes' | 'hours' | 'days';
  };
  messageId: string;
  conditions?: {
    fieldId: string;
    operator: string;
    value: any;
  }[];
}

export interface FunnelExportList {
  id: string;
  name: string;
  description?: string;
  segmentCriteria: {
    funnelId: string;
    stageIds?: string[];
    tags?: string[];
    customFields?: Record<string, any>;
  };
  estimatedSize?: number;
}

export interface FunnelExportTiming {
  startDate?: string;
  endDate?: string;
  timezone: string;
  businessHours?: {
    start: string; // HH:mm
    end: string; // HH:mm
    daysOfWeek: number[]; // 0-6, domingo-sábado
  };
  delays: {
    stageId: string;
    delay: {
      value: number;
      unit: 'minutes' | 'hours' | 'days';
    };
  }[];
}

export interface FunnelExportRequest {
  funnelId: string;
  includeAssets: boolean;
  includeCampaigns: boolean;
  includeSequences: boolean;
  includeLists: boolean;
  targetCampaignsModule?: boolean; // Si debe exportar directamente a CampanasAutomatizacion
  notes?: string;
}

export interface FunnelExportResponse {
  exportPackage: FunnelExportPackage;
  success: boolean;
  message: string;
  importedCampaignIds?: string[]; // IDs de campañas creadas en CampanasAutomatizacion
  importedSequenceIds?: string[]; // IDs de secuencias creadas
  warnings?: string[];
}

// US-FA-018: Convertir rápidamente un funnel en reto/comunidad
export type ChallengeType = 'reto' | 'comunidad' | 'evento';
export type ChallengeDuration = '7d' | '14d' | '21d' | '30d' | '60d' | '90d' | 'custom';

export interface FunnelToChallengeConversion {
  funnelId: string;
  funnelName: string;
  challengeType: ChallengeType;
  challengeName: string;
  challengeDescription: string;
  duration: ChallengeDuration;
  customDurationDays?: number;
  startDate?: string;
  endDate?: string;
  objectives?: string[];
  rules?: string[];
  metrics?: string[];
  includeParticipants?: boolean; // Si incluir participantes actuales del funnel
  includeContent?: boolean; // Si incluir contenido del funnel
  includeAutomation?: boolean; // Si incluir automatizaciones del funnel
  communitySettings?: {
    isPrivate: boolean;
    allowUserPosts: boolean;
    moderationRequired: boolean;
    categories?: string[];
  };
  challengeSettings?: {
    enableRanking: boolean;
    enableProgressTracking: boolean;
    enableMilestones: boolean;
    rewards?: string[];
  };
}

export interface FunnelToChallengeConversionResponse {
  challengeId: string;
  challengeName: string;
  challengeType: ChallengeType;
  success: boolean;
  message: string;
  convertedParticipants?: number;
  convertedContent?: number;
  convertedAutomations?: number;
  warnings?: string[];
}

// US-FA-019: Conectar funnels con contenidos existentes (reels top, testimonios)
export type ContentType = 'reel' | 'testimonial' | 'post' | 'video' | 'image';

export interface SocialMediaReel {
  id: string;
  platform: 'instagram' | 'tiktok' | 'youtube' | 'facebook';
  url: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  publishedAt: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
    totalEngagement: number;
  };
  metrics: {
    leadsGenerated?: number;
    conversionsGenerated?: number;
    engagementRate: number;
  };
}

export interface TestimonialContent {
  id: string;
  customerName: string;
  customerId?: string;
  quote: string;
  score?: number;
  type: 'texto' | 'video' | 'audio';
  mediaUrl?: string;
  channel: string;
  createdAt: string;
  tags: string[];
  status: 'pendiente' | 'aprobado' | 'rechazado' | 'publicado';
  metrics?: {
    views?: number;
    conversions?: number;
    engagement?: number;
  };
}

export interface FunnelContent {
  id: string;
  funnelId: string;
  contentType: ContentType;
  contentId: string; // ID del contenido original (reel, testimonial, etc.)
  contentData: SocialMediaReel | TestimonialContent;
  placement: 'hero' | 'social_proof' | 'testimonials' | 'features' | 'cta' | 'sidebar';
  stageId?: string; // ID de la etapa del funnel donde se muestra
  order: number; // Orden de visualización
  isActive: boolean;
  addedAt: string;
  addedBy: string;
}

export interface FunnelContentConnectionRequest {
  funnelId: string;
  stageId?: string;
  contentType: ContentType;
  contentIds: string[]; // IDs de los contenidos a conectar
  placement: FunnelContent['placement'];
  autoSelect?: boolean; // Si debe seleccionar automáticamente los mejores contenidos
  criteria?: {
    minEngagement?: number;
    minScore?: number;
    minViews?: number;
    dateRange?: {
      start: string;
      end: string;
    };
    tags?: string[];
  };
}

export interface FunnelContentConnectionResponse {
  connections: FunnelContent[];
  success: boolean;
  message: string;
  connectedCount: number;
  skippedCount?: number;
  warnings?: string[];
}

export interface FunnelContentRecommendation {
  contentId: string;
  contentType: ContentType;
  contentData: SocialMediaReel | TestimonialContent;
  recommendationScore: number;
  reason: string;
  suggestedPlacement: FunnelContent['placement'];
  estimatedImpact: 'high' | 'medium' | 'low';
}

// US-FA-020: Revenue proyectado por funnel según capacidad y precios
export interface FunnelCapacity {
  funnelId: string;
  maxCapacity: number; // Capacidad máxima de clientes/leads
  currentUtilization: number; // Utilización actual (0-100%)
  availableSlots: number; // Espacios disponibles
  utilizationTrend: TrendDirection;
}

export interface FunnelPricing {
  funnelId: string;
  basePrice: number; // Precio base del servicio/plan
  averageTicket: number; // Ticket promedio
  pricingTier?: 'basic' | 'premium' | 'vip';
  discountPercentage?: number; // Descuento aplicado si hay
}

export interface ProjectedRevenueByFunnel {
  funnelId: string;
  funnelName: string;
  stage: 'TOFU' | 'MOFU' | 'BOFU';
  capacity: FunnelCapacity;
  pricing: FunnelPricing;
  projectedRevenue: number; // Revenue proyectado basado en capacidad y precios
  currentRevenue: number; // Revenue actual
  revenueGap: number; // Diferencia entre proyectado y actual
  conversionRate: number; // Tasa de conversión actual
  projectedLeads: number; // Leads proyectados según capacidad
  currentLeads: number; // Leads actuales
  priorityScore: number; // Score de prioridad (0-100) para priorizar esfuerzos
  recommendations: RevenueProjectionRecommendation[];
  period: FunnelsAcquisitionPeriod;
}

export interface RevenueProjectionRecommendation {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: 'capacity' | 'pricing' | 'conversion' | 'marketing';
  estimatedRevenueIncrease?: number;
  estimatedLift?: number; // Porcentaje de mejora esperada
  steps: string[];
}

export interface ProjectedRevenueByFunnelResponse {
  period: FunnelsAcquisitionPeriod;
  funnels: ProjectedRevenueByFunnel[];
  totalProjectedRevenue: number;
  totalCurrentRevenue: number;
  totalRevenueGap: number;
  prioritizedFunnels: string[]; // IDs de funnels ordenados por prioridad
}

// US-FA-021: Alertas si un funnel de captación no genera leads suficientes antes de una campaña
export type CampaignLeadAlertSeverity = 'critical' | 'warning' | 'info';

export interface CampaignLeadRequirement {
  campaignId: string;
  campaignName: string;
  startDate: string;
  requiredLeads: number; // Leads requeridos para la campaña
  currentLeads: number; // Leads actuales generados
  leadGap: number; // Diferencia entre requeridos y actuales
  daysUntilCampaign: number; // Días hasta que inicie la campaña
  leadGenerationRate: number; // Tasa de generación de leads por día
  projectedLeadsAtStart: number; // Leads proyectados al inicio de la campaña
}

export interface FunnelLeadGenerationAlert {
  id: string;
  funnelId: string;
  funnelName: string;
  campaignId: string;
  campaignName: string;
  severity: CampaignLeadAlertSeverity;
  alertType: 'insufficient_leads' | 'low_generation_rate' | 'capacity_mismatch' | 'timing_risk';
  message: string;
  currentLeads: number;
  requiredLeads: number;
  leadGap: number;
  daysUntilCampaign: number;
  leadGenerationRate: number; // Leads por día
  projectedLeadsAtStart: number;
  riskLevel: 'high' | 'medium' | 'low';
  recommendedActions: LeadGenerationAlertAction[];
  detectedAt: string;
  campaignStartDate: string;
}

export interface LeadGenerationAlertAction {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionType: 'boost_funnel' | 'extend_timeline' | 'adjust_campaign' | 'increase_capacity' | 'optimize_conversion';
  estimatedImpact: 'high' | 'medium' | 'low';
  estimatedLeadsIncrease?: number;
  steps: string[];
  canExecute: boolean;
}

export interface FunnelLeadGenerationAlertsResponse {
  alerts: FunnelLeadGenerationAlert[];
  totalAlerts: number;
  criticalAlerts: number;
  warningAlerts: number;
  infoAlerts: number;
  upcomingCampaigns: CampaignLeadRequirement[];
}

// US-FA-022: Registrar notas cualitativas de cada funnel (feedback de prospectos)
export interface FunnelQualitativeNote {
  id: string;
  funnelId: string;
  funnelName: string;
  note: string;
  category: 'feedback_prospecto' | 'observacion' | 'mejora_sugerida' | 'problema_detectado' | 'exito' | 'otro';
  tags?: string[];
  prospectId?: string;
  prospectName?: string;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  priority?: 'high' | 'medium' | 'low';
  relatedIteration?: string; // ID de la iteración del funnel relacionada
  actionable?: boolean; // Si la nota requiere acción
  actionTaken?: string; // Acción tomada basada en esta nota
  actionTakenAt?: string;
}

export interface FunnelQualitativeNotesResponse {
  funnelId: string;
  funnelName: string;
  notes: FunnelQualitativeNote[];
  totalNotes: number;
  notesByCategory: Record<string, number>;
  lastNoteDate?: string;
  insights?: QualitativeNoteInsight[];
}

export interface QualitativeNoteInsight {
  id: string;
  title: string;
  description: string;
  category: string;
  frequency: number; // Número de veces que aparece este patrón
  suggestedAction?: string;
  impact: 'high' | 'medium' | 'low';
}

export interface CreateFunnelQualitativeNoteRequest {
  funnelId: string;
  note: string;
  category: FunnelQualitativeNote['category'];
  tags?: string[];
  prospectId?: string;
  prospectName?: string;
  priority?: FunnelQualitativeNote['priority'];
  relatedIteration?: string;
  actionable?: boolean;
}

export interface UpdateFunnelQualitativeNoteRequest {
  noteId: string;
  note?: string;
  category?: FunnelQualitativeNote['category'];
  tags?: string[];
  priority?: FunnelQualitativeNote['priority'];
  actionTaken?: string;
  actionable?: boolean;
}

// US-FA-023: IA aprende qué tipos de propuestas cierro mejor para priorizar ideas similares
export type ProposalType = 
  | 'oferta_descuento'
  | 'trial_gratis'
  | 'bonus_incluido'
  | 'pago_unico'
  | 'pago_recurrente'
  | 'pack_multiple'
  | 'consulta_gratis'
  | 'webinar_exclusivo'
  | 'challenge_gratis'
  | 'garantia_extendida'
  | 'pago_flexible'
  | 'otro';

export interface ProposalPerformance {
  proposalType: ProposalType;
  proposalName: string;
  funnelId?: string;
  funnelName?: string;
  totalPresented: number; // Veces que se presentó esta propuesta
  totalAccepted: number; // Veces que se aceptó
  totalClosed: number; // Veces que se cerró (conversión completa)
  acceptanceRate: number; // Tasa de aceptación (0-100)
  closingRate: number; // Tasa de cierre (0-100)
  averageRevenue: number; // Revenue promedio por propuesta cerrada
  totalRevenue: number; // Revenue total generado
  averageDaysToClose: number; // Días promedio para cerrar
  firstPresentedAt: string;
  lastPresentedAt: string;
  successFactors?: string[]; // Factores que contribuyen al éxito
  failureReasons?: string[]; // Razones de rechazo más comunes
  trendDirection: TrendDirection;
  performanceScore: number; // Score de performance (0-100)
}

export interface ProposalLearningInsight {
  id: string;
  proposalType: ProposalType;
  insight: string;
  confidence: number; // Nivel de confianza (0-100)
  basedOnDataPoints: number; // Número de datos en los que se basa
  recommendation: string;
  expectedImpact: 'high' | 'medium' | 'low';
  category: 'timing' | 'audience' | 'pricing' | 'messaging' | 'offer_structure' | 'other';
}

export interface ProposalPrioritization {
  proposalType: ProposalType;
  proposalName: string;
  priorityScore: number; // Score de prioridad (0-100)
  recommendedForFunnels: string[]; // IDs de funnels donde se recomienda
  recommendedForAudiences: string[]; // Audiencias objetivo recomendadas
  expectedConversionRate: number; // Tasa de conversión esperada
  expectedRevenue: number; // Revenue esperado
  confidence: number; // Nivel de confianza en la recomendación
  reasoning: string; // Razón por la que se prioriza
  similarSuccessfulProposals?: string[]; // IDs de propuestas similares exitosas
}

export interface ProposalLearningResponse {
  period: FunnelsAcquisitionPeriod;
  proposalPerformances: ProposalPerformance[];
  topPerformingProposals: ProposalPerformance[];
  lowPerformingProposals: ProposalPerformance[];
  insights: ProposalLearningInsight[];
  prioritizations: ProposalPrioritization[];
  totalProposalsTracked: number;
  averageClosingRate: number;
  trends: {
    improvingProposals: ProposalPerformance[];
    decliningProposals: ProposalPerformance[];
  };
  recommendations: ProposalPrioritization[];
}

export interface TrackProposalRequest {
  proposalType: ProposalType;
  proposalName: string;
  funnelId?: string;
  prospectId?: string;
  presentedAt: string;
  accepted?: boolean;
  acceptedAt?: string;
  closed?: boolean;
  closedAt?: string;
  revenue?: number;
  rejectionReason?: string;
  successFactors?: string[];
  context?: Record<string, any>; // Contexto adicional (audiencia, timing, etc.)
}

export interface ProposalSimilarityMatch {
  proposalId: string;
  proposalType: ProposalType;
  proposalName: string;
  similarityScore: number; // Score de similitud (0-100)
  sharedCharacteristics: string[]; // Características compartidas
  performanceComparison: {
    thisProposal: ProposalPerformance;
    similarProposal: ProposalPerformance;
  };
  recommendation: string;
}

// US-FA-024: Actualizar funnels con insights de Comunidad & Fidelización (testimonios, NPS)
export interface CommunityInsight {
  id: string;
  type: 'testimonial' | 'nps' | 'review';
  content: string;
  score?: number; // Para testimonios y reviews (1-5)
  npsValue?: number; // Para NPS (-100 a 100)
  customerName?: string;
  customerId?: string;
  source: string; // Origen del insight
  createdAt: string;
  tags?: string[];
  metrics?: {
    views?: number;
    conversions?: number;
    engagement?: number;
  };
}

export interface FunnelCommunityInsight {
  funnelId: string;
  funnelName: string;
  stageId?: string;
  stageName?: string;
  insightId: string;
  insight: CommunityInsight;
  placement: 'hero' | 'social_proof' | 'testimonials' | 'features' | 'cta' | 'sidebar' | 'footer';
  isActive: boolean;
  addedAt: string;
  addedBy: string;
  performance?: {
    views: number;
    conversions: number;
    conversionLift?: number; // Mejora en conversión atribuida a este insight
  };
}

export interface FunnelCommunityInsightsUpdate {
  funnelId: string;
  insights: {
    insightId: string;
    stageId?: string;
    placement: FunnelCommunityInsight['placement'];
    autoSelect?: boolean; // Si debe seleccionar automáticamente los mejores insights
  }[];
  criteria?: {
    minScore?: number; // Score mínimo para testimonios
    minNps?: number; // NPS mínimo
    dateRange?: {
      start: string;
      end: string;
    };
    tags?: string[];
    limit?: number; // Número máximo de insights a agregar
  };
}

export interface FunnelCommunityInsightsUpdateResponse {
  updatedInsights: FunnelCommunityInsight[];
  success: boolean;
  message: string;
  addedCount: number;
  removedCount?: number;
  warnings?: string[];
}

export interface CommunityInsightsRecommendation {
  insightId: string;
  insight: CommunityInsight;
  recommendationScore: number;
  reason: string;
  suggestedPlacement: FunnelCommunityInsight['placement'];
  estimatedImpact: 'high' | 'medium' | 'low';
  estimatedConversionLift?: number; // Porcentaje de mejora esperada
}

export interface FunnelCommunityInsightsStatus {
  funnelId: string;
  funnelName: string;
  totalInsights: number;
  activeInsights: number;
  insightsByType: {
    testimonials: number;
    nps: number;
    reviews: number;
  };
  lastUpdated: string;
  averageScore?: number;
  averageNps?: number;
  recommendations: CommunityInsightsRecommendation[];
}

// US-FA-025: Plantillas IA para follow-up post registro (WhatsApp + email) con tono del usuario
export type FollowUpChannel = 'whatsapp' | 'email';
export type FollowUpTiming = 'immediate' | '1h' | '6h' | '24h' | '48h' | '3d' | '7d';

export interface PostRegistrationFollowUpTemplate {
  id: string;
  name: string;
  description?: string;
  channel: FollowUpChannel;
  timing: FollowUpTiming;
  toneOfVoice: ToneOfVoice;
  customToneDescription?: string; // Descripción personalizada del tono
  subject?: string; // Para email
  message: string;
  variables: string[]; // Variables disponibles (ej: {{nombre}}, {{funnel}}, {{fecha_registro}})
  cta?: {
    text: string;
    url?: string;
  };
  personalizationRules?: {
    field: string;
    condition: string;
    value: any;
  }[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  usageCount?: number; // Número de veces que se ha usado
  conversionRate?: number; // Tasa de conversión cuando se usa esta plantilla
}

export interface FollowUpTemplateGenerationRequest {
  channel: FollowUpChannel;
  timing: FollowUpTiming;
  toneOfVoice: ToneOfVoice;
  customToneDescription?: string;
  funnelId?: string;
  funnelName?: string;
  objective?: string; // Objetivo del follow-up (ej: "cerrar venta", "agendar consulta", "activar cuenta")
  includeVariables?: string[]; // Variables específicas a incluir
  length?: 'short' | 'medium' | 'long'; // Longitud del mensaje
  includeCTA?: boolean;
  ctaText?: string;
  ctaUrl?: string;
}

export interface FollowUpTemplateGenerationResponse {
  templates: PostRegistrationFollowUpTemplate[];
  reasoning?: string; // Explicación de por qué se generó así
  estimatedConversionRate?: number; // Estimación de conversión basada en mejores prácticas
  suggestions?: {
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
  }[];
}

export interface FollowUpTemplateApplication {
  templateId: string;
  leadId?: string;
  leadName: string;
  leadEmail?: string;
  leadPhone?: string;
  funnelId?: string;
  funnelName?: string;
  customVariables?: Record<string, any>; // Variables personalizadas
  scheduledFor?: string; // Fecha/hora programada para enviar
  sendImmediately?: boolean;
}

export interface FollowUpTemplateApplicationResponse {
  success: boolean;
  message: string;
  sentAt?: string;
  scheduledFor?: string;
  messageId?: string;
  preview?: {
    subject?: string;
    body: string;
  };
}

// US-FA-026: Calendario de lanzamientos y fases del funnel
export type FunnelPhaseType = 
  | 'lanzamiento'
  | 'captacion'
  | 'cualificacion'
  | 'nurturing'
  | 'conversion'
  | 'onboarding'
  | 'retencion'
  | 'cierre_campana';

export interface FunnelLaunch {
  id: string;
  funnelId: string;
  funnelName: string;
  launchDate: string;
  endDate?: string;
  phase: FunnelPhaseType;
  status: 'planificado' | 'activo' | 'pausado' | 'completado' | 'cancelado';
  description?: string;
  teamMembers?: string[]; // IDs de miembros del equipo asignados
  milestones?: FunnelMilestone[];
  createdAt: string;
  updatedAt: string;
}

export interface FunnelMilestone {
  id: string;
  launchId: string;
  title: string;
  description?: string;
  date: string;
  completed: boolean;
  completedAt?: string;
  assignedTo?: string; // ID del miembro del equipo
}

export interface FunnelPhase {
  id: string;
  funnelId: string;
  funnelName: string;
  phaseType: FunnelPhaseType;
  startDate: string;
  endDate?: string;
  status: 'planificada' | 'en_progreso' | 'completada' | 'pausada';
  description?: string;
  objectives?: string[];
  metrics?: {
    targetLeads?: number;
    targetConversions?: number;
    targetRevenue?: number;
    currentLeads?: number;
    currentConversions?: number;
    currentRevenue?: number;
  };
  teamMembers?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FunnelCalendarEvent {
  id: string;
  type: 'launch' | 'phase' | 'milestone';
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  funnelId: string;
  funnelName: string;
  phaseType?: FunnelPhaseType;
  status: string;
  color?: string; // Color para el calendario
  teamMembers?: string[];
  metadata?: {
    launchId?: string;
    phaseId?: string;
    milestoneId?: string;
  };
}

export interface FunnelCalendarResponse {
  events: FunnelCalendarEvent[];
  launches: FunnelLaunch[];
  phases: FunnelPhase[];
  dateRange: {
    start: string;
    end: string;
  };
  teamMembers?: Array<{
    id: string;
    name: string;
    email?: string;
    role?: string;
  }>;
}

export interface FunnelCalendarRequest {
  startDate: string;
  endDate: string;
  funnelIds?: string[];
  phaseTypes?: FunnelPhaseType[];
  teamMemberIds?: string[];
}

// US-FA-027: Compartir resumen IA del funnel con community manager
export type AISummaryFormat = 'text' | 'markdown' | 'html' | 'pdf';
export type AISummaryLanguage = 'es' | 'en' | 'ca';

export interface FunnelAISummary {
  id: string;
  funnelId: string;
  funnelName: string;
  generatedAt: string;
  generatedBy: string;
  format: AISummaryFormat;
  language: AISummaryLanguage;
  summary: {
    overview: string;
    objectives: string[];
    targetAudience: string;
    keyMessages: string[];
    contentSuggestions: ContentSuggestion[];
    adSuggestions: AdSuggestion[];
    socialMediaPosts: SocialMediaPostSuggestion[];
    timing: TimingRecommendation;
    metrics: SummaryMetrics;
    nextSteps: string[];
  };
  sharedWith: SharedWithUser[];
  shareToken?: string; // Token para compartir públicamente
  expiresAt?: string; // Fecha de expiración del token
  createdAt: string;
  updatedAt: string;
}

export interface ContentSuggestion {
  id: string;
  type: 'post' | 'reel' | 'story' | 'video' | 'blog' | 'email';
  title: string;
  description: string;
  keyPoints: string[];
  tone: string;
  cta?: string;
  estimatedEngagement?: number;
  priority: 'high' | 'medium' | 'low';
}

export interface AdSuggestion {
  id: string;
  platform: 'facebook' | 'instagram' | 'google' | 'tiktok' | 'linkedin';
  adType: 'image' | 'video' | 'carousel' | 'story';
  headline: string;
  description: string;
  cta: string;
  targetAudience: string;
  budget?: number;
  estimatedReach?: number;
  estimatedConversions?: number;
  priority: 'high' | 'medium' | 'low';
}

export interface SocialMediaPostSuggestion {
  id: string;
  platform: 'instagram' | 'facebook' | 'tiktok' | 'linkedin' | 'twitter';
  postType: 'feed' | 'story' | 'reel' | 'carousel';
  caption: string;
  hashtags?: string[];
  suggestedImage?: string;
  suggestedVideo?: string;
  bestTimeToPost?: string;
  priority: 'high' | 'medium' | 'low';
}

export interface TimingRecommendation {
  launchDate: string;
  contentSchedule: {
    preLaunch: string[]; // Días antes del lanzamiento
    launch: string[]; // Día del lanzamiento
    postLaunch: string[]; // Días después del lanzamiento
  };
  adSchedule: {
    startDate: string;
    endDate?: string;
    dailyBudget?: number;
    peakHours?: string[];
  };
  socialMediaSchedule: {
    frequency: 'daily' | 'every_other_day' | 'weekly' | 'custom';
    bestDays?: string[];
    bestTimes?: string[];
  };
}

export interface SummaryMetrics {
  currentMetrics: {
    leads: number;
    conversions: number;
    revenue: number;
    conversionRate: number;
  };
  projectedMetrics: {
    leads: number;
    conversions: number;
    revenue: number;
    conversionRate: number;
  };
  benchmarks?: {
    industryAverage?: number;
    previousCampaign?: number;
  };
}

export interface SharedWithUser {
  userId: string;
  userName: string;
  userEmail: string;
  role: string;
  sharedAt: string;
  accessLevel: 'view' | 'edit' | 'comment';
  viewedAt?: string;
}

export interface GenerateFunnelAISummaryRequest {
  funnelId: string;
  format?: AISummaryFormat;
  language?: AISummaryLanguage;
  includeContentSuggestions?: boolean;
  includeAdSuggestions?: boolean;
  includeSocialMediaPosts?: boolean;
  focusAreas?: string[]; // Áreas específicas a enfocar en el resumen
  targetAudience?: string; // Audiencia objetivo específica
}

export interface GenerateFunnelAISummaryResponse {
  summary: FunnelAISummary;
  success: boolean;
  message: string;
}

export interface ShareFunnelAISummaryRequest {
  summaryId: string;
  userIds?: string[]; // IDs de usuarios con los que compartir
  emails?: string[]; // Emails con los que compartir (usuarios externos)
  accessLevel?: 'view' | 'edit' | 'comment';
  generatePublicLink?: boolean; // Si generar un enlace público
  expiresInDays?: number; // Días hasta que expire el enlace público
}

export interface ShareFunnelAISummaryResponse {
  success: boolean;
  message: string;
  sharedWith: SharedWithUser[];
  publicLink?: string;
  shareToken?: string;
  expiresAt?: string;
}

export interface GetFunnelAISummariesRequest {
  funnelId?: string;
  generatedBy?: string;
  sharedWithMe?: boolean; // Si solo obtener resúmenes compartidos conmigo
  limit?: number;
  offset?: number;
}

export interface GetFunnelAISummariesResponse {
  summaries: FunnelAISummary[];
  total: number;
  hasMore: boolean;
}

// US-FA-021: Actualizar un funnel una vez finalizado con resultados reales y aprendizajes
export type FunnelStatus = 'draft' | 'active' | 'paused' | 'completed' | 'archived';

export interface FunnelRealResults {
  totalVisitors: number;
  totalLeads: number;
  totalConversions: number;
  totalRevenue: number;
  conversionRate: number;
  averageOrderValue: number;
  costPerLead?: number;
  costPerAcquisition?: number;
  returnOnAdSpend?: number;
  actualStartDate: string;
  actualEndDate: string;
  durationDays: number;
}

export interface FunnelLearning {
  id: string;
  category: 'copy' | 'offer' | 'timing' | 'audience' | 'channel' | 'process' | 'other';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  actionTaken?: string;
  actionTakenAt?: string;
}

export interface FunnelImprovement {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'copy' | 'offer' | 'timing' | 'audience' | 'channel' | 'process' | 'other';
  estimatedImpact?: string;
  steps: string[];
  resources?: {
    title: string;
    url: string;
  }[];
}

export interface FunnelRetrospective {
  id: string;
  funnelId: string;
  funnelName: string;
  status: FunnelStatus;
  completedAt: string;
  realResults: FunnelRealResults;
  learnings: FunnelLearning[];
  improvements: FunnelImprovement[];
  notes?: string;
  nextIterationPlan?: string;
  aiGeneratedChecklist?: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface CreateFunnelRetrospectiveRequest {
  funnelId: string;
  status: FunnelStatus;
  completedAt: string;
  realResults: FunnelRealResults;
  learnings: Omit<FunnelLearning, 'id'>[];
  improvements?: Omit<FunnelImprovement, 'id'>[];
  notes?: string;
  nextIterationPlan?: string;
}

export interface UpdateFunnelRetrospectiveRequest {
  retrospectiveId: string;
  realResults?: Partial<FunnelRealResults>;
  learnings?: FunnelLearning[];
  improvements?: FunnelImprovement[];
  notes?: string;
  nextIterationPlan?: string;
}

export interface FunnelRetrospectiveResponse {
  retrospective: FunnelRetrospective;
  success: boolean;
  message: string;
  aiSuggestions?: {
    improvements: FunnelImprovement[];
    checklist: string[];
  };
}


