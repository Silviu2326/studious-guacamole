/**
 * Servicio de Inteligencia & Experimentos
 * 
 * Este servicio está enfocado en las funcionalidades principales de la página:
 * - Trend Analyzer & Competencia: análisis de tendencias, canales y competencia
 * - A/B Tests & Impacto: gestión de experimentos y evaluación de impacto
 * 
 * Funciones relacionadas con otras features (personalización, feedback, planificación, etc.)
 * están disponibles directamente desde el API (intelligenceHub.ts) pero no se re-exportan aquí
 * para mantener este servicio enfocado en el scope de Inteligencia & Experimentos.
 */

import {
  fetchIntelligenceOverview,
  fetchIntelligenceProfile,
  saveIntelligenceProfile,
  // Trend Analyzer & Competencia
  getChannelInsights,
  getMarketTrendsAlerts,
  fetchIntegratedAIView,
  // A/B Tests & Impacto
  getAIExperimentSuggestions,
  createExperimentFromSuggestion,
  evaluateInitiativeImpact,
  getInitiativeImpactEvaluations,
  // Insights (usado en InsightsSection - puede estar en overview tab)
  convertInsightToPlaybook,
  detectMicroSegments,
  getOfferSuggestions,
  // AI Overview & Prioritization
  fetchAIOverview,
  fetchAIPrioritization,
  // Experiment Lessons
  recordExperimentLesson,
  // Personalization
  generatePersonalizedJourney,
  fetchPersonalizationImpact,
  // Feedback
  generateNegativeFeedbackMicroPlan,
  getNegativeFeedbackMicroPlans,
  generatePositiveFeedbackCampaign,
  autoActivateCampaign,
  getPositiveFeedbackCampaigns,
  // Playbooks
  generateCompletePlaybook,
  sharePlaybook,
  recordPlaybookDecision,
  getPlaybookLearningProfile,
  getPlaybookLearningInsights,
  // Mobile Approvals
  generateAISummary,
  getPendingApprovals,
  approveItem,
  // Playbook Sync
  getAvailableLocations,
  getAvailableTrainers,
  syncPlaybook,
  getSyncStatus,
  resolveSyncConflict,
  // Quarterly Planning & Ownership
  getQuarterlyPlan,
  generateQuarterlyPlan,
  updateQuarterlyPlan,
  assignOwner,
  updateOwnershipProgress,
  getOwnershipAssignments,
  // Team
  getTeamMembers,
  // Monthly Retrospectives
  getMonthlyRetrospective,
  generateMonthlyRetrospective,
} from '../api';
import {
  IntelligenceOverviewResponse,
  IntelligenceProfile,
  StrategicPillars,
  DecisionStyle,
  GetChannelInsightsRequest,
  ChannelInsightsResponse,
  GetMarketTrendsAlertsRequest,
  MarketTrendsAlertsResponse,
  GetIntegratedAIViewRequest,
  GetIntegratedAIViewResponse,
  GetAIExperimentSuggestionsRequest,
  GetAIExperimentSuggestionsResponse,
  CreateExperimentFromSuggestionRequest,
  CreateExperimentFromSuggestionResponse,
  EvaluateInitiativeImpactRequest,
  EvaluateInitiativeImpactResponse,
  GetInitiativeImpactEvaluationsRequest,
  GetInitiativeImpactEvaluationsResponse,
  ConvertInsightToPlaybookRequest,
  ConvertInsightToPlaybookResponse,
  DetectMicroSegmentsRequest,
  DetectMicroSegmentsResponse,
  GetOfferSuggestionsRequest,
  GetOfferSuggestionsResponse,
  AIOverviewResponse,
  AIPrioritizationResponse,
  RecordExperimentLessonRequest,
  RecordExperimentLessonResponse,
  GeneratePersonalizedJourneyRequest,
  GeneratePersonalizedJourneyResponse,
  GetPersonalizationImpactRequest,
  GetPersonalizationImpactResponse,
  GenerateNegativeFeedbackMicroPlanRequest,
  GenerateNegativeFeedbackMicroPlanResponse,
  GetNegativeFeedbackMicroPlansRequest,
  GetNegativeFeedbackMicroPlansResponse,
  GeneratePositiveFeedbackCampaignRequest,
  GeneratePositiveFeedbackCampaignResponse,
  AutoActivateCampaignRequest,
  AutoActivateCampaignResponse,
  GetPositiveFeedbackCampaignsRequest,
  GetPositiveFeedbackCampaignsResponse,
  GenerateCompletePlaybookRequest,
  GenerateCompletePlaybookResponse,
  SharePlaybookRequest,
  SharePlaybookResponse,
  RecordPlaybookDecisionRequest,
  RecordPlaybookDecisionResponse,
  GetPlaybookLearningProfileRequest,
  GetPlaybookLearningProfileResponse,
  GetPlaybookLearningInsightsRequest,
  GetPlaybookLearningInsightsResponse,
  GenerateAISummaryRequest,
  GenerateAISummaryResponse,
  GetPendingApprovalsRequest,
  GetPendingApprovalsResponse,
  ApproveItemRequest,
  ApproveItemResponse,
  GetAvailableLocationsRequest,
  GetAvailableLocationsResponse,
  GetAvailableTrainersRequest,
  GetAvailableTrainersResponse,
  SyncPlaybookRequest,
  SyncPlaybookResponse,
  GetSyncStatusRequest,
  GetSyncStatusResponse,
  ResolveSyncConflictRequest,
  ResolveSyncConflictResponse,
  GetQuarterlyPlanRequest,
  GetQuarterlyPlanResponse,
  GenerateQuarterlyPlanRequest,
  GenerateQuarterlyPlanResponse,
  UpdateQuarterlyPlanRequest,
  UpdateQuarterlyPlanResponse,
  AssignOwnerRequest,
  AssignOwnerResponse,
  UpdateOwnershipProgressRequest,
  UpdateOwnershipProgressResponse,
  GetOwnershipAssignmentsRequest,
  GetOwnershipAssignmentsResponse,
  GetMonthlyRetrospectiveRequest,
  GetMonthlyRetrospectiveResponse,
  GenerateMonthlyRetrospectiveRequest,
  GenerateMonthlyRetrospectiveResponse,
} from '../types';

// ============================================================================
// Core: Overview y Perfil
// ============================================================================

/**
 * Obtiene el overview de inteligencia con métricas, insights, experimentos y campañas
 */
export const getIntelligenceOverview = async (): Promise<IntelligenceOverviewResponse> => {
  try {
    return await fetchIntelligenceOverview();
  } catch (error) {
    console.error('Error obteniendo overview de inteligencia', error);
    throw error;
  }
};

/**
 * Obtiene el perfil de inteligencia del entrenador
 */
export const getIntelligenceProfile = async (trainerId?: string): Promise<IntelligenceProfile | null> => {
  try {
    return await fetchIntelligenceProfile(trainerId);
  } catch (error) {
    console.error('Error obteniendo perfil de inteligencia', error);
    throw error;
  }
};

/**
 * Guarda el perfil de inteligencia (pilares estratégicos y estilo de decisión)
 */
export const saveIntelligenceProfileService = async (
  strategicPillars: StrategicPillars,
  decisionStyle: DecisionStyle,
  trainerId?: string
): Promise<IntelligenceProfile> => {
  try {
    return await saveIntelligenceProfile(strategicPillars, decisionStyle, trainerId);
  } catch (error) {
    console.error('Error guardando perfil de inteligencia', error);
    throw error;
  }
};

// ============================================================================
// Trend Analyzer & Competencia
// ============================================================================

/**
 * Obtiene insights IA por canal (Ads, orgánico, referidos) con recomendaciones concretas
 * Usado en: ChannelInsightsSection (tab trend-analyzer)
 */
export const getChannelInsightsService = async (
  request: GetChannelInsightsRequest = {}
): Promise<ChannelInsightsResponse> => {
  try {
    return await getChannelInsights(request);
  } catch (error) {
    console.error('Error obteniendo insights por canal', error);
    throw error;
  }
};

/**
 * Obtiene alertas de tendencias de mercado y movimientos competidores
 * Usado en: MarketTrendsAlertsSection (tab trend-analyzer)
 */
export const getMarketTrendsAlertsService = async (
  request: GetMarketTrendsAlertsRequest = {}
): Promise<MarketTrendsAlertsResponse> => {
  try {
    return await getMarketTrendsAlerts(request);
  } catch (error) {
    console.error('Error obteniendo alertas de mercado y competencia', error);
    throw error;
  }
};

/**
 * Obtiene vista integrada IA de feedback, contenido y ventas
 * Para detectar patrones entre estos tres aspectos
 * Usado en: IntegratedAIPatternsSection (tab trend-analyzer)
 */
export const getIntegratedAIViewService = async (
  request: GetIntegratedAIViewRequest = {}
): Promise<GetIntegratedAIViewResponse> => {
  try {
    return await fetchIntegratedAIView(request);
  } catch (error) {
    console.error('Error obteniendo vista integrada IA', error);
    throw error;
  }
};

// ============================================================================
// A/B Tests & Impacto
// ============================================================================

/**
 * Obtener sugerencias de experimentos de IA
 * Usado en: ExperimentationSection (tab experiments-impact)
 */
export const getAIExperimentSuggestionsService = async (
  request: GetAIExperimentSuggestionsRequest = {}
): Promise<GetAIExperimentSuggestionsResponse> => {
  try {
    return await getAIExperimentSuggestions(request);
  } catch (error) {
    console.error('Error obteniendo sugerencias de experimentos', error);
    throw error;
  }
};

/**
 * Crear experimento desde sugerencia de IA
 * Usado en: ExperimentationSection (tab experiments-impact)
 */
export const createExperimentFromSuggestionService = async (
  request: CreateExperimentFromSuggestionRequest
): Promise<CreateExperimentFromSuggestionResponse> => {
  try {
    return await createExperimentFromSuggestion(request);
  } catch (error) {
    console.error('Error creando experimento desde sugerencia', error);
    throw error;
  }
};

/**
 * Evaluar impacto de una iniciativa y recomendar si repetirla
 * Usado en: InitiativeImpactEvaluation (tab experiments-impact)
 */
export const evaluateInitiativeImpactService = async (
  request: EvaluateInitiativeImpactRequest
): Promise<EvaluateInitiativeImpactResponse> => {
  try {
    return await evaluateInitiativeImpact(request);
  } catch (error) {
    console.error('Error evaluando impacto de iniciativa', error);
    throw error;
  }
};

/**
 * Obtener evaluaciones de impacto de iniciativas
 * Usado en: InitiativeImpactEvaluation (tab experiments-impact)
 */
export const getInitiativeImpactEvaluationsService = async (
  request: GetInitiativeImpactEvaluationsRequest = {}
): Promise<GetInitiativeImpactEvaluationsResponse> => {
  try {
    return await getInitiativeImpactEvaluations(request);
  } catch (error) {
    console.error('Error obteniendo evaluaciones de impacto', error);
    throw error;
  }
};

// ============================================================================
// Insights (usado en InsightsSection - puede estar en overview tab)
// ============================================================================

/**
 * Transformar insight en playbook con un clic
 * Usado en: InsightsSection
 */
export const convertInsightToPlaybookService = async (
  request: ConvertInsightToPlaybookRequest
): Promise<ConvertInsightToPlaybookResponse> => {
  try {
    return await convertInsightToPlaybook(request);
  } catch (error) {
    console.error('Error convirtiendo insight en playbook', error);
    throw error;
  }
};

/**
 * Detectar micro-segmentos emergentes
 * Usado en: InsightsSection
 */
export const detectMicroSegmentsService = async (
  request: DetectMicroSegmentsRequest = {}
): Promise<DetectMicroSegmentsResponse> => {
  try {
    return await detectMicroSegments(request);
  } catch (error) {
    console.error('Error detectando micro-segmentos', error);
    throw error;
  }
};

/**
 * Obtener sugerencias de ofertas para micro-segmentos
 * Usado en: InsightsSection
 */
export const getOfferSuggestionsService = async (
  request: GetOfferSuggestionsRequest = {}
): Promise<GetOfferSuggestionsResponse> => {
  try {
    return await getOfferSuggestions(request);
  } catch (error) {
    console.error('Error obteniendo sugerencias de ofertas', error);
    throw error;
  }
};

// ============================================================================
// AI Overview & Prioritization
// ============================================================================

/**
 * Obtiene overview de IA con métricas integradas de marketing, comunidad y ventas
 * Usado en: AIOverviewSection
 */
export const getAIOverview = async (period: '7d' | '30d' | '90d' = '30d'): Promise<AIOverviewResponse> => {
  try {
    return await fetchAIOverview(period);
  } catch (error) {
    console.error('Error obteniendo overview de IA', error);
    throw error;
  }
};

/**
 * Obtiene acciones priorizadas basadas en matriz Impacto/Esfuerzo
 * Usado en: AIPrioritizationSection
 */
export const getAIPrioritization = async (
  period: '7d' | '30d' | '90d' = '30d',
  trainerId?: string
): Promise<AIPrioritizationResponse> => {
  try {
    return await fetchAIPrioritization(period, trainerId);
  } catch (error) {
    console.error('Error obteniendo priorización de IA', error);
    throw error;
  }
};

// ============================================================================
// Experiment Lessons
// ============================================================================

/**
 * Registra una lección aprendida de un experimento
 * Usado en: ExperimentLessonForm
 */
export const recordExperimentLessonService = async (
  request: RecordExperimentLessonRequest
): Promise<RecordExperimentLessonResponse> => {
  try {
    return await recordExperimentLesson(request);
  } catch (error) {
    console.error('Error registrando lección de experimento', error);
    throw error;
  }
};

// ============================================================================
// Personalization
// ============================================================================

/**
 * Genera un journey personalizado para un cliente
 * Usado en: PersonalizationEngineSection
 */
export const generatePersonalizedJourneyService = async (
  request: GeneratePersonalizedJourneyRequest
): Promise<GeneratePersonalizedJourneyResponse> => {
  try {
    return await generatePersonalizedJourney(request);
  } catch (error) {
    console.error('Error generando journey personalizado', error);
    throw error;
  }
};

/**
 * Obtiene el impacto de las personalizaciones
 * Usado en: PersonalizationImpactSection
 */
export const getPersonalizationImpactService = async (
  request: GetPersonalizationImpactRequest = {}
): Promise<GetPersonalizationImpactResponse> => {
  try {
    return await fetchPersonalizationImpact(request);
  } catch (error) {
    console.error('Error obteniendo impacto de personalización', error);
    throw error;
  }
};

// ============================================================================
// Feedback
// ============================================================================

/**
 * Genera un micro-plan para feedback negativo
 * Usado en: NegativeFeedbackMicroPlans
 */
export const generateNegativeFeedbackMicroPlanService = async (
  request: GenerateNegativeFeedbackMicroPlanRequest
): Promise<GenerateNegativeFeedbackMicroPlanResponse> => {
  try {
    return await generateNegativeFeedbackMicroPlan(request);
  } catch (error) {
    console.error('Error generando micro-plan de feedback negativo', error);
    throw error;
  }
};

/**
 * Obtiene micro-planes de feedback negativo
 * Usado en: NegativeFeedbackMicroPlans
 */
export const getNegativeFeedbackMicroPlansService = async (
  request: GetNegativeFeedbackMicroPlansRequest = {}
): Promise<GetNegativeFeedbackMicroPlansResponse> => {
  try {
    return await getNegativeFeedbackMicroPlans(request);
  } catch (error) {
    console.error('Error obteniendo micro-planes de feedback negativo', error);
    throw error;
  }
};

/**
 * Genera una campaña de feedback positivo
 * Usado en: PositiveFeedbackCampaigns
 */
export const generatePositiveFeedbackCampaignService = async (
  request: GeneratePositiveFeedbackCampaignRequest
): Promise<GeneratePositiveFeedbackCampaignResponse> => {
  try {
    return await generatePositiveFeedbackCampaign(request);
  } catch (error) {
    console.error('Error generando campaña de feedback positivo', error);
    throw error;
  }
};

/**
 * Activa automáticamente una campaña de feedback positivo
 * Usado en: PositiveFeedbackCampaigns
 */
export const autoActivateCampaignService = async (
  request: AutoActivateCampaignRequest
): Promise<AutoActivateCampaignResponse> => {
  try {
    return await autoActivateCampaign(request);
  } catch (error) {
    console.error('Error activando campaña automáticamente', error);
    throw error;
  }
};

/**
 * Obtiene campañas de feedback positivo
 * Usado en: PositiveFeedbackCampaigns
 */
export const getPositiveFeedbackCampaignsService = async (
  request: GetPositiveFeedbackCampaignsRequest = {}
): Promise<GetPositiveFeedbackCampaignsResponse> => {
  try {
    return await getPositiveFeedbackCampaigns(request);
  } catch (error) {
    console.error('Error obteniendo campañas de feedback positivo', error);
    throw error;
  }
};

// ============================================================================
// Playbooks
// ============================================================================

/**
 * Genera un playbook completo
 * Usado en: PlaybookLibrary
 */
export const generateCompletePlaybookService = async (
  request: GenerateCompletePlaybookRequest
): Promise<GenerateCompletePlaybookResponse> => {
  try {
    return await generateCompletePlaybook(request);
  } catch (error) {
    console.error('Error generando playbook completo', error);
    throw error;
  }
};

/**
 * Comparte un playbook con otros usuarios
 * Usado en: PlaybookLibrary
 */
export const sharePlaybookService = async (
  request: SharePlaybookRequest
): Promise<SharePlaybookResponse> => {
  try {
    return await sharePlaybook(request);
  } catch (error) {
    console.error('Error compartiendo playbook', error);
    throw error;
  }
};

/**
 * Registra una decisión sobre un playbook para aprendizaje de IA
 * Usado en: PlaybookLibrary
 */
export const recordPlaybookDecisionService = async (
  request: RecordPlaybookDecisionRequest
): Promise<RecordPlaybookDecisionResponse> => {
  try {
    return await recordPlaybookDecision(request);
  } catch (error) {
    console.error('Error registrando decisión de playbook', error);
    throw error;
  }
};

/**
 * Obtiene el perfil de aprendizaje de playbooks
 * Usado en: PlaybookLearningInsights
 */
export const getPlaybookLearningProfileService = async (
  request: GetPlaybookLearningProfileRequest = {}
): Promise<GetPlaybookLearningProfileResponse> => {
  try {
    return await getPlaybookLearningProfile(request);
  } catch (error) {
    console.error('Error obteniendo perfil de aprendizaje de playbooks', error);
    throw error;
  }
};

/**
 * Obtiene insights de aprendizaje de playbooks
 * Usado en: PlaybookLearningInsights
 */
export const getPlaybookLearningInsightsService = async (
  request: GetPlaybookLearningInsightsRequest = {}
): Promise<GetPlaybookLearningInsightsResponse> => {
  try {
    return await getPlaybookLearningInsights(request);
  } catch (error) {
    console.error('Error obteniendo insights de aprendizaje de playbooks', error);
    throw error;
  }
};

// ============================================================================
// Mobile Approvals
// ============================================================================

/**
 * Genera un resumen de IA para aprobación móvil
 * Usado en: MobileApprovalSection
 */
export const generateAISummaryService = async (
  request: GenerateAISummaryRequest
): Promise<GenerateAISummaryResponse> => {
  try {
    return await generateAISummary(request);
  } catch (error) {
    console.error('Error generando resumen de IA', error);
    throw error;
  }
};

/**
 * Obtiene aprobaciones pendientes
 * Usado en: MobileApprovalSection
 */
export const getPendingApprovalsService = async (
  request: GetPendingApprovalsRequest = {}
): Promise<GetPendingApprovalsResponse> => {
  try {
    return await getPendingApprovals(request);
  } catch (error) {
    console.error('Error obteniendo aprobaciones pendientes', error);
    throw error;
  }
};

/**
 * Aprueba un item (experimento o playbook)
 * Usado en: MobileApprovalSection
 */
export const approveItemService = async (
  request: ApproveItemRequest
): Promise<ApproveItemResponse> => {
  try {
    return await approveItem(request);
  } catch (error) {
    console.error('Error aprobando item', error);
    throw error;
  }
};

// ============================================================================
// Playbook Sync
// ============================================================================

/**
 * Obtiene ubicaciones disponibles para sincronización
 * Usado en: PlaybookSyncSection
 */
export const getAvailableLocationsService = async (
  request: GetAvailableLocationsRequest = {}
): Promise<GetAvailableLocationsResponse> => {
  try {
    return await getAvailableLocations(request);
  } catch (error) {
    console.error('Error obteniendo ubicaciones disponibles', error);
    throw error;
  }
};

/**
 * Obtiene entrenadores disponibles para sincronización
 * Usado en: PlaybookSyncSection
 */
export const getAvailableTrainersService = async (
  request: GetAvailableTrainersRequest = {}
): Promise<GetAvailableTrainersResponse> => {
  try {
    return await getAvailableTrainers(request);
  } catch (error) {
    console.error('Error obteniendo entrenadores disponibles', error);
    throw error;
  }
};

/**
 * Sincroniza un playbook con otras sedes o entrenadores
 * Usado en: PlaybookSyncSection
 */
export const syncPlaybookService = async (
  request: SyncPlaybookRequest
): Promise<SyncPlaybookResponse> => {
  try {
    return await syncPlaybook(request);
  } catch (error) {
    console.error('Error sincronizando playbook', error);
    throw error;
  }
};

/**
 * Obtiene el estado de sincronización de un playbook
 * Usado en: PlaybookSyncSection
 */
export const getSyncStatusService = async (
  request: GetSyncStatusRequest
): Promise<GetSyncStatusResponse> => {
  try {
    return await getSyncStatus(request);
  } catch (error) {
    console.error('Error obteniendo estado de sincronización', error);
    throw error;
  }
};

/**
 * Resuelve un conflicto de sincronización
 * Usado en: PlaybookSyncSection
 */
export const resolveSyncConflictService = async (
  request: ResolveSyncConflictRequest
): Promise<ResolveSyncConflictResponse> => {
  try {
    return await resolveSyncConflict(request);
  } catch (error) {
    console.error('Error resolviendo conflicto de sincronización', error);
    throw error;
  }
};

// ============================================================================
// Quarterly Planning & Ownership
// ============================================================================

/**
 * Obtiene el plan trimestral
 * Usado en: QuarterlyPlanSection
 */
export const getQuarterlyPlanService = async (
  request: GetQuarterlyPlanRequest = {}
): Promise<GetQuarterlyPlanResponse> => {
  try {
    return await getQuarterlyPlan(request);
  } catch (error) {
    console.error('Error obteniendo plan trimestral', error);
    throw error;
  }
};

/**
 * Genera un plan trimestral
 * Usado en: QuarterlyPlanSection
 */
export const generateQuarterlyPlanService = async (
  request: GenerateQuarterlyPlanRequest
): Promise<GenerateQuarterlyPlanResponse> => {
  try {
    return await generateQuarterlyPlan(request);
  } catch (error) {
    console.error('Error generando plan trimestral', error);
    throw error;
  }
};

/**
 * Actualiza un plan trimestral
 * Usado en: QuarterlyPlanSection
 */
export const updateQuarterlyPlanService = async (
  request: UpdateQuarterlyPlanRequest
): Promise<UpdateQuarterlyPlanResponse> => {
  try {
    return await updateQuarterlyPlan(request);
  } catch (error) {
    console.error('Error actualizando plan trimestral', error);
    throw error;
  }
};

/**
 * Asigna un propietario a una tarea
 * Usado en: OwnershipTrackingSection
 */
export const assignOwnerService = async (
  request: AssignOwnerRequest
): Promise<AssignOwnerResponse> => {
  try {
    return await assignOwner(request);
  } catch (error) {
    console.error('Error asignando propietario', error);
    throw error;
  }
};

/**
 * Actualiza el progreso de ownership
 * Usado en: OwnershipTrackingSection
 */
export const updateOwnershipProgressService = async (
  request: UpdateOwnershipProgressRequest
): Promise<UpdateOwnershipProgressResponse> => {
  try {
    return await updateOwnershipProgress(request);
  } catch (error) {
    console.error('Error actualizando progreso de ownership', error);
    throw error;
  }
};

/**
 * Obtiene asignaciones de ownership
 * Usado en: OwnershipTrackingSection
 */
export const getOwnershipAssignmentsService = async (
  request: GetOwnershipAssignmentsRequest = {}
): Promise<GetOwnershipAssignmentsResponse> => {
  try {
    return await getOwnershipAssignments(request);
  } catch (error) {
    console.error('Error obteniendo asignaciones de ownership', error);
    throw error;
  }
};

// ============================================================================
// Team
// ============================================================================

/**
 * Obtiene miembros del equipo
 * Usado en: OwnershipTrackingSection, PlaybookLibrary
 */
export const getTeamMembersService = async (): Promise<import('../types').TeamMember[]> => {
  try {
    return await getTeamMembers();
  } catch (error) {
    console.error('Error obteniendo miembros del equipo', error);
    throw error;
  }
};

// ============================================================================
// Monthly Retrospectives
// ============================================================================

/**
 * Obtiene retrospectiva mensual
 * Usado en: MonthlyRetrospectiveSection
 */
export const getMonthlyRetrospectiveService = async (
  request: GetMonthlyRetrospectiveRequest = {}
): Promise<GetMonthlyRetrospectiveResponse> => {
  try {
    return await getMonthlyRetrospective(request);
  } catch (error) {
    console.error('Error obteniendo retrospectiva mensual', error);
    throw error;
  }
};

/**
 * Genera una retrospectiva mensual
 * Usado en: MonthlyRetrospectiveSection
 */
export const generateMonthlyRetrospectiveService = async (
  request: GenerateMonthlyRetrospectiveRequest
): Promise<GenerateMonthlyRetrospectiveResponse> => {
  try {
    return await generateMonthlyRetrospective(request);
  } catch (error) {
    console.error('Error generando retrospectiva mensual', error);
    throw error;
  }
};

export default getIntelligenceOverview;
