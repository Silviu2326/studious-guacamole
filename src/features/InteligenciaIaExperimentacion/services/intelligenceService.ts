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

export default getIntelligenceOverview;
