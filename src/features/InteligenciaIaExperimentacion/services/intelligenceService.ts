import {
  fetchIntelligenceOverview,
  fetchIntelligenceProfile,
  saveIntelligenceProfile,
  fetchAIOverview,
  fetchAIPrioritization,
  generateCompletePlaybook,
  convertInsightToPlaybook,
  getTeamMembers,
  sharePlaybook,
  getAIExperimentSuggestions,
  createExperimentFromSuggestion,
  getExperimentInsight,
  recordExperimentLesson,
  getExperimentLessons,
  getRelevantLessonsForExperiment,
  generatePersonalizedJourney,
  detectMicroSegments,
  getOfferSuggestions,
  fetchPersonalizationImpact,
  fetchIntegratedAIView,
  generateNegativeFeedbackMicroPlan,
  getNegativeFeedbackMicroPlans,
  generatePositiveFeedbackCampaign,
  autoActivateCampaign,
  getPositiveFeedbackCampaigns,
  getChannelInsights,
  getMarketTrendsAlerts,
  generateQuarterlyPlan,
  getQuarterlyPlan,
  updateQuarterlyPlan,
  assignOwner,
  updateOwnershipProgress,
  getOwnershipAssignments,
  // User Story 1: Aprobar experimentos/playbooks desde móvil con resumen IA
  generateAISummary,
  getPendingApprovals,
  approveItem,
  // User Story 2: Sincronizar playbooks con otras sedes o entrenadores
  getAvailableLocations,
  getAvailableTrainers,
  syncPlaybook,
  getSyncStatus,
  resolveSyncConflict,
  // User Story 1: IA que aprende de decisiones de playbooks
  recordPlaybookDecision,
  getPlaybookLearningProfile,
  getPlaybookLearningInsights,
  // User Story 2: Evaluación automática de impacto de iniciativas
  evaluateInitiativeImpact,
  getInitiativeImpactEvaluations,
  // User Story 1: Retrospectivas IA mensuales
  getMonthlyRetrospective,
  generateMonthlyRetrospective,
  getMonthlyRetrospectivesHistory,
} from '../api';
import {
  IntelligenceOverviewResponse,
  IntelligenceProfile,
  StrategicPillars,
  DecisionStyle,
  AIOverviewResponse,
  AIPrioritizationResponse,
  GenerateCompletePlaybookRequest,
  GenerateCompletePlaybookResponse,
  ConvertInsightToPlaybookRequest,
  ConvertInsightToPlaybookResponse,
  TeamMember,
  SharePlaybookRequest,
  SharePlaybookResponse,
  GetAIExperimentSuggestionsRequest,
  GetAIExperimentSuggestionsResponse,
  CreateExperimentFromSuggestionRequest,
  CreateExperimentFromSuggestionResponse,
  GetExperimentInsightRequest,
  GetExperimentInsightResponse,
  RecordExperimentLessonRequest,
  RecordExperimentLessonResponse,
  GetExperimentLessonsRequest,
  GetExperimentLessonsResponse,
  GetRelevantLessonsForExperimentRequest,
  GetRelevantLessonsForExperimentResponse,
  GeneratePersonalizedJourneyRequest,
  GeneratePersonalizedJourneyResponse,
  DetectMicroSegmentsRequest,
  DetectMicroSegmentsResponse,
  GetOfferSuggestionsRequest,
  GetOfferSuggestionsResponse,
  GetPersonalizationImpactRequest,
  GetPersonalizationImpactResponse,
  GetIntegratedAIViewRequest,
  GetIntegratedAIViewResponse,
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
  GetChannelInsightsRequest,
  ChannelInsightsResponse,
  GetMarketTrendsAlertsRequest,
  MarketTrendsAlertsResponse,
  GenerateQuarterlyPlanRequest,
  GenerateQuarterlyPlanResponse,
  GetQuarterlyPlanRequest,
  GetQuarterlyPlanResponse,
  UpdateQuarterlyPlanRequest,
  UpdateQuarterlyPlanResponse,
  AssignOwnerRequest,
  AssignOwnerResponse,
  UpdateOwnershipProgressRequest,
  UpdateOwnershipProgressResponse,
  GetOwnershipAssignmentsRequest,
  GetOwnershipAssignmentsResponse,
  // User Story 1: Aprobar experimentos/playbooks desde móvil con resumen IA
  GenerateAISummaryRequest,
  GenerateAISummaryResponse,
  ApproveItemRequest,
  ApproveItemResponse,
  GetPendingApprovalsRequest,
  GetPendingApprovalsResponse,
  // User Story 2: Sincronizar playbooks con otras sedes o entrenadores
  SyncPlaybookRequest,
  SyncPlaybookResponse,
  GetSyncStatusRequest,
  GetSyncStatusResponse,
  GetAvailableLocationsRequest,
  GetAvailableLocationsResponse,
  GetAvailableTrainersRequest,
  GetAvailableTrainersResponse,
  ResolveSyncConflictRequest,
  ResolveSyncConflictResponse,
  // User Story 1: IA que aprende de decisiones de playbooks
  RecordPlaybookDecisionRequest,
  RecordPlaybookDecisionResponse,
  GetPlaybookLearningProfileRequest,
  GetPlaybookLearningProfileResponse,
  GetPlaybookLearningInsightsRequest,
  GetPlaybookLearningInsightsResponse,
  // User Story 2: Evaluación automática de impacto de iniciativas
  EvaluateInitiativeImpactRequest,
  EvaluateInitiativeImpactResponse,
  GetInitiativeImpactEvaluationsRequest,
  GetInitiativeImpactEvaluationsResponse,
  // User Story 1: Retrospectivas IA mensuales
  GetMonthlyRetrospectiveRequest,
  GetMonthlyRetrospectiveResponse,
  GenerateMonthlyRetrospectiveRequest,
  GenerateMonthlyRetrospectiveResponse,
  GetMonthlyRetrospectivesHistoryRequest,
  GetMonthlyRetrospectivesHistoryResponse,
} from '../types';

export const getIntelligenceOverview = async (): Promise<IntelligenceOverviewResponse> => {
  try {
    return await fetchIntelligenceOverview();
  } catch (error) {
    console.error('Error obteniendo overview de inteligencia', error);
    throw error;
  }
};

export const getIntelligenceProfile = async (trainerId?: string): Promise<IntelligenceProfile | null> => {
  try {
    return await fetchIntelligenceProfile(trainerId);
  } catch (error) {
    console.error('Error obteniendo perfil de inteligencia', error);
    throw error;
  }
};

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

/**
 * User Story 1: Obtiene el overview IA que conecta datos de marketing, comunidad y ventas
 */
export const getAIOverview = async (period: '7d' | '30d' | '90d' = '30d'): Promise<AIOverviewResponse> => {
  try {
    return await fetchAIOverview(period);
  } catch (error) {
    console.error('Error obteniendo overview IA', error);
    throw error;
  }
};

/**
 * User Story 2: Obtiene la priorización IA con matriz Impacto/Esfuerzo
 */
export const getAIPrioritization = async (
  period: '7d' | '30d' | '90d' = '30d',
  trainerId?: string
): Promise<AIPrioritizationResponse> => {
  try {
    return await fetchAIPrioritization(period, trainerId);
  } catch (error) {
    console.error('Error obteniendo priorización IA', error);
    throw error;
  }
};

/**
 * User Story 1: Generar playbook IA completo (estrategia, copy, assets, medición)
 * Adaptado al estilo y audiencia del entrenador
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
 * User Story 2: Transformar insight en playbook con un clic
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
 * User Story 1: Obtener miembros del equipo
 */
export const getTeamMembersService = async (): Promise<TeamMember[]> => {
  try {
    return await getTeamMembers();
  } catch (error) {
    console.error('Error obteniendo miembros del equipo', error);
    throw error;
  }
};

/**
 * User Story 1: Compartir playbook con equipo
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
 * User Story 2: Obtener sugerencias de experimentos de IA
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
 * User Story 2: Crear experimento desde sugerencia de IA
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
 * User Story 1: Obtener insights automáticos de un experimento con resultados traducidos
 */
export const getExperimentInsightService = async (
  request: GetExperimentInsightRequest
): Promise<GetExperimentInsightResponse> => {
  try {
    return await getExperimentInsight(request);
  } catch (error) {
    console.error('Error obteniendo insight del experimento', error);
    throw error;
  }
};

/**
 * User Story 2: Registrar una lección aprendida de un experimento
 */
export const recordExperimentLessonService = async (
  request: RecordExperimentLessonRequest
): Promise<RecordExperimentLessonResponse> => {
  try {
    return await recordExperimentLesson(request);
  } catch (error) {
    console.error('Error registrando lección aprendida', error);
    throw error;
  }
};

/**
 * User Story 2: Obtener lecciones aprendidas
 */
export const getExperimentLessonsService = async (
  request: GetExperimentLessonsRequest = {}
): Promise<GetExperimentLessonsResponse> => {
  try {
    return await getExperimentLessons(request);
  } catch (error) {
    console.error('Error obteniendo lecciones aprendidas', error);
    throw error;
  }
};

/**
 * User Story 2: Obtener lecciones relevantes para un nuevo experimento
 */
export const getRelevantLessonsForExperimentService = async (
  request: GetRelevantLessonsForExperimentRequest
): Promise<GetRelevantLessonsForExperimentResponse> => {
  try {
    return await getRelevantLessonsForExperiment(request);
  } catch (error) {
    console.error('Error obteniendo lecciones relevantes', error);
    throw error;
  }
};

/**
 * User Story 1: Generar journey personalizado basado en atributos del lead
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
 * User Story 2: Detectar micro-segmentos emergentes
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
 * User Story 2: Obtener sugerencias de ofertas para micro-segmentos
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

/**
 * User Story 1: Obtener impacto de la personalización en métricas clave (reservas, retención)
 * Para justificar inversión en personalización
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

/**
 * User Story 2: Obtener vista integrada IA de feedback, contenido y ventas
 * Para detectar patrones entre estos tres aspectos
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

/**
 * User Story 1: Generar micro plan IA para feedback negativo (mensaje, acción, seguimiento)
 */
export const generateNegativeFeedbackMicroPlanService = async (
  request: GenerateNegativeFeedbackMicroPlanRequest
): Promise<GenerateNegativeFeedbackMicroPlanResponse> => {
  try {
    return await generateNegativeFeedbackMicroPlan(request);
  } catch (error) {
    console.error('Error generando micro plan de feedback negativo', error);
    throw error;
  }
};

/**
 * User Story 1: Obtener micro planes de feedback negativo
 */
export const getNegativeFeedbackMicroPlansService = async (
  request: GetNegativeFeedbackMicroPlansRequest = {}
): Promise<GetNegativeFeedbackMicroPlansResponse> => {
  try {
    return await getNegativeFeedbackMicroPlans(request);
  } catch (error) {
    console.error('Error obteniendo micro planes de feedback negativo', error);
    throw error;
  }
};

/**
 * User Story 2: Generar campaña automatizada basada en feedback positivo
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
 * User Story 2: Activar campaña automáticamente
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
 * User Story 2: Obtener campañas de feedback positivo
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

/**
 * User Story 1: Obtener insights IA por canal (Ads, orgánico, referidos) con recomendaciones concretas
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
 * User Story 2: Obtener alertas de tendencias de mercado y movimientos competidores
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
 * User Story 1: Generar plan trimestral IA basado en OKRs y roadmap
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
 * User Story 1: Obtener plan trimestral
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
 * User Story 1: Actualizar plan trimestral
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
 * User Story 2: Asignar dueño a insight o playbook
 */
export const assignOwnerService = async (
  request: AssignOwnerRequest
): Promise<AssignOwnerResponse> => {
  try {
    return await assignOwner(request);
  } catch (error) {
    console.error('Error asignando dueño', error);
    throw error;
  }
};

/**
 * User Story 2: Actualizar progreso de ownership
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
 * User Story 2: Obtener asignaciones de ownership
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

/**
 * User Story 1: Generar resumen IA de un experimento o playbook para aprobación móvil
 */
export const generateAISummaryService = async (
  request: GenerateAISummaryRequest
): Promise<GenerateAISummaryResponse> => {
  try {
    return await generateAISummary(request);
  } catch (error) {
    console.error('Error generando resumen IA', error);
    throw error;
  }
};

/**
 * User Story 1: Obtener aprobaciones pendientes para móvil
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
 * User Story 1: Aprobar o rechazar un item desde móvil
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

/**
 * User Story 2: Obtener sedes disponibles para sincronización
 */
export const getAvailableLocationsService = async (
  request: GetAvailableLocationsRequest = {}
): Promise<GetAvailableLocationsResponse> => {
  try {
    return await getAvailableLocations(request);
  } catch (error) {
    console.error('Error obteniendo sedes disponibles', error);
    throw error;
  }
};

/**
 * User Story 2: Obtener entrenadores disponibles para sincronización
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
 * User Story 2: Sincronizar playbook con otras sedes o entrenadores
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
 * User Story 2: Obtener estado de sincronizaciones
 */
export const getSyncStatusService = async (
  request: GetSyncStatusRequest = {}
): Promise<GetSyncStatusResponse> => {
  try {
    return await getSyncStatus(request);
  } catch (error) {
    console.error('Error obteniendo estado de sincronizaciones', error);
    throw error;
  }
};

/**
 * User Story 2: Resolver conflicto de sincronización
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

/**
 * User Story 1: Registrar decisión de playbook (aceptar/rechazar)
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
 * User Story 1: Obtener perfil de aprendizaje de playbooks
 */
export const getPlaybookLearningProfileService = async (
  request: GetPlaybookLearningProfileRequest = {}
): Promise<GetPlaybookLearningProfileResponse> => {
  try {
    return await getPlaybookLearningProfile(request);
  } catch (error) {
    console.error('Error obteniendo perfil de aprendizaje', error);
    throw error;
  }
};

/**
 * User Story 1: Obtener insights de aprendizaje de playbooks
 */
export const getPlaybookLearningInsightsService = async (
  request: GetPlaybookLearningInsightsRequest = {}
): Promise<GetPlaybookLearningInsightsResponse> => {
  try {
    return await getPlaybookLearningInsights(request);
  } catch (error) {
    console.error('Error obteniendo insights de aprendizaje', error);
    throw error;
  }
};

/**
 * User Story 2: Evaluar impacto de una iniciativa y recomendar si repetirla
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
 * User Story 2: Obtener evaluaciones de impacto de iniciativas
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

/**
 * User Story 1: Obtener retrospectiva mensual
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
 * User Story 1: Generar retrospectiva mensual
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

/**
 * User Story 1: Obtener historial de retrospectivas mensuales
 */
export const getMonthlyRetrospectivesHistoryService = async (
  request: GetMonthlyRetrospectivesHistoryRequest = {}
): Promise<GetMonthlyRetrospectivesHistoryResponse> => {
  try {
    return await getMonthlyRetrospectivesHistory(request);
  } catch (error) {
    console.error('Error obteniendo historial de retrospectivas', error);
    throw error;
  }
};

export default getIntelligenceOverview;









