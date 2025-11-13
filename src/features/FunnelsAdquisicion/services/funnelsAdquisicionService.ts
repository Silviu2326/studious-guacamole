import {
  fetchAcquisitionAISuggestions,
  fetchAcquisitionCampaigns,
  fetchAcquisitionEvents,
  fetchAcquisitionTopFunnels,
  fetchFunnelsAcquisitionKPIs,
  fetchWorkspaceBlueprints,
  fetchLeadRiskAlerts,
  fetchFirstSessionConversionMetric,
  fetchSocialMediaMetrics,
  fetchReferralProgramMetrics,
  fetchRecommendedFunnels,
  saveBuyerPersonas,
  savePainPoints,
  adaptFunnelCopy,
  getFunnelPersonalization,
  generateLandingPageCopy,
  suggestIntelligentForm,
  saveIntelligentForm,
  getIntelligentForms,
  submitIntelligentForm,
  getFunnelExperiments,
  getFunnelExperiment,
  createFunnelExperiment,
  updateFunnelExperimentStatus,
  generateAIExperimentSuggestions,
  getFunnelPerformanceAnalysis,
  getFunnelBottlenecks,
  getNurturingRecommendations,
  analyzeLeadMagnetResponses,
  exportFunnelToCampaigns,
  convertFunnelToChallenge,
  getTopReels,
  getTopTestimonials,
  getFunnelContentRecommendations,
  connectContentToFunnel,
  getFunnelConnectedContent,
  disconnectContentFromFunnel,
  fetchProjectedRevenueByFunnel,
  fetchFunnelLeadGenerationAlerts,
  getFunnelQualitativeNotes,
  createFunnelQualitativeNote,
  updateFunnelQualitativeNote,
  getProposalLearning,
  trackProposal,
  getProposalSimilarityMatches,
  getCommunityInsights,
  getFunnelCommunityInsightsStatus,
  updateFunnelWithCommunityInsights,
  getFunnelCommunityInsightsRecommendations,
  generateFollowUpTemplates,
  applyFollowUpTemplate,
  getFollowUpTemplates,
  getFunnelCalendar,
  generateFunnelAISummary,
  shareFunnelAISummary,
  getFunnelAISummaries,
  getFunnelRetrospective,
  createFunnelRetrospective,
  updateFunnelRetrospective,
} from '../api';
import {
  AcquisitionAISuggestion,
  AcquisitionCampaign,
  AcquisitionEvent,
  AcquisitionFunnelPerformance,
  AcquisitionKPI,
  AcquisitionWorkspaceBlueprint,
  FunnelsAcquisitionPeriod,
  FunnelsAcquisitionSnapshot,
  LeadRiskAlert,
  FirstSessionConversionMetric,
  SocialMediaMetrics,
  ReferralProgramMetrics,
  FunnelRecommendationRequest,
  FunnelRecommendationResponse,
  BuyerPersona,
  PainPoint,
  CopyAdaptation,
  FunnelPersonalization,
  LandingPageCopyGenerationRequest,
  LandingPageCopyGenerationResponse,
  IntelligentFormSuggestionRequest,
  IntelligentFormSuggestion,
  IntelligentForm,
  FormSubmission,
  FunnelExperiment,
  FunnelExperimentStatus,
  FunnelExperimentType,
  AIExperimentSuggestion,
  FunnelPerformanceAnalysis,
  FunnelBottleneck,
  NurturingRecommendation,
  NurturingRecommendationRequest,
  LeadMagnetResponseAnalysis,
  FunnelExportRequest,
  FunnelExportResponse,
  FunnelToChallengeConversion,
  FunnelToChallengeConversionResponse,
  SocialMediaReel,
  TestimonialContent,
  FunnelContentRecommendation,
  FunnelContentConnectionRequest,
  FunnelContentConnectionResponse,
  FunnelContent,
  ProjectedRevenueByFunnelResponse,
  FunnelLeadGenerationAlertsResponse,
  FunnelQualitativeNotesResponse,
  FunnelQualitativeNote,
  CreateFunnelQualitativeNoteRequest,
  UpdateFunnelQualitativeNoteRequest,
  ProposalLearningResponse,
  TrackProposalRequest,
  ProposalType,
  ProposalSimilarityMatch,
  CommunityInsight,
  FunnelCommunityInsightsStatus,
  FunnelCommunityInsightsUpdate,
  FunnelCommunityInsightsUpdateResponse,
  CommunityInsightsRecommendation,
  FollowUpTemplateGenerationRequest,
  FollowUpTemplateGenerationResponse,
  PostRegistrationFollowUpTemplate,
  FollowUpTemplateApplication,
  FollowUpTemplateApplicationResponse,
  FollowUpChannel,
  FunnelCalendarRequest,
  FunnelCalendarResponse,
  GenerateFunnelAISummaryRequest,
  GenerateFunnelAISummaryResponse,
  ShareFunnelAISummaryRequest,
  ShareFunnelAISummaryResponse,
  GetFunnelAISummariesRequest,
  GetFunnelAISummariesResponse,
  FunnelRetrospective,
  CreateFunnelRetrospectiveRequest,
  UpdateFunnelRetrospectiveRequest,
  FunnelRetrospectiveResponse,
} from '../types';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: value < 100 ? 1 : 0,
  }).format(value);
}

function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

function formatNumber(value: number): string {
  if (value >= 1000) {
    return `${Math.round(value / 100) / 10}K`;
  }
  return value.toString();
}

export function formatKpiValue(kpi: AcquisitionKPI): string {
  switch (kpi.format) {
    case 'currency':
      return formatCurrency(kpi.value);
    case 'percentage':
      return formatPercentage(kpi.value);
    case 'number':
    default:
      return formatNumber(kpi.value);
  }
}

async function getKPIs(period: FunnelsAcquisitionPeriod): Promise<AcquisitionKPI[]> {
  return fetchFunnelsAcquisitionKPIs(period);
}

async function getCampaigns(): Promise<AcquisitionCampaign[]> {
  return fetchAcquisitionCampaigns();
}

async function getFunnels(
  period: FunnelsAcquisitionPeriod,
): Promise<AcquisitionFunnelPerformance[]> {
  return fetchAcquisitionTopFunnels(period);
}

async function getEvents(): Promise<AcquisitionEvent[]> {
  return fetchAcquisitionEvents();
}

async function getSuggestions(): Promise<AcquisitionAISuggestion[]> {
  return fetchAcquisitionAISuggestions();
}

async function getWorkspaceBlueprints(): Promise<AcquisitionWorkspaceBlueprint[]> {
  return fetchWorkspaceBlueprints();
}

async function getSnapshot(period: FunnelsAcquisitionPeriod): Promise<FunnelsAcquisitionSnapshot> {
  const [kpis, campaigns, funnels, events, aiSuggestions, workspaceBlueprints] = await Promise.all([
    getKPIs(period),
    getCampaigns(),
    getFunnels(period),
    getEvents(),
    getSuggestions(),
    getWorkspaceBlueprints(),
  ]);

  return {
    period,
    kpis,
    campaigns,
    funnels,
    events,
    aiSuggestions,
    workspaceBlueprints,
  };
}

async function getLeadRiskAlerts(): Promise<LeadRiskAlert[]> {
  return fetchLeadRiskAlerts();
}

async function getFirstSessionConversionMetric(
  period: FunnelsAcquisitionPeriod,
): Promise<FirstSessionConversionMetric> {
  return fetchFirstSessionConversionMetric(period);
}

async function getSocialMediaMetrics(
  period: FunnelsAcquisitionPeriod,
): Promise<SocialMediaMetrics> {
  return fetchSocialMediaMetrics(period);
}

async function getReferralProgramMetrics(
  period: FunnelsAcquisitionPeriod,
): Promise<ReferralProgramMetrics> {
  return fetchReferralProgramMetrics(period);
}

async function getRecommendedFunnels(
  request: FunnelRecommendationRequest,
): Promise<FunnelRecommendationResponse> {
  return fetchRecommendedFunnels(request);
}

async function savePersonas(funnelId: string, personas: BuyerPersona[]): Promise<{ success: boolean; message: string }> {
  return saveBuyerPersonas(funnelId, personas);
}

async function savePainPointsData(
  funnelId: string,
  painPoints: PainPoint[],
): Promise<{ success: boolean; message: string }> {
  return savePainPoints(funnelId, painPoints);
}

async function adaptCopy(
  funnelId: string,
  stageId: string,
  originalCopy: string,
  personaId: string,
  painPointIds: string[],
): Promise<CopyAdaptation> {
  return adaptFunnelCopy(funnelId, stageId, originalCopy, personaId, painPointIds);
}

async function getPersonalization(funnelId: string): Promise<FunnelPersonalization | null> {
  return getFunnelPersonalization(funnelId);
}

// US-FA-05: Generar el copy completo de la landing page con IA
async function generateLandingPageCopyWithAI(
  request: LandingPageCopyGenerationRequest,
): Promise<LandingPageCopyGenerationResponse> {
  return generateLandingPageCopy(request);
}

// US-FA-06: Formularios inteligentes
async function suggestIntelligentFormFields(
  request: IntelligentFormSuggestionRequest,
): Promise<IntelligentFormSuggestion> {
  return suggestIntelligentForm(request);
}

async function saveIntelligentFormData(
  form: Omit<IntelligentForm, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<IntelligentForm> {
  return saveIntelligentForm(form);
}

async function getIntelligentFormsList(
  funnelId?: string,
  landingPageId?: string,
): Promise<IntelligentForm[]> {
  return getIntelligentForms(funnelId, landingPageId);
}

async function submitIntelligentFormData(
  formId: string,
  responses: Record<string, any>,
): Promise<FormSubmission> {
  return submitIntelligentForm(formId, responses);
}

// US-FA-07: A/B tests guiados por IA
async function getFunnelExperimentsList(funnelId?: string): Promise<FunnelExperiment[]> {
  return getFunnelExperiments(funnelId);
}

async function getFunnelExperimentById(experimentId: string): Promise<FunnelExperiment | null> {
  return getFunnelExperiment(experimentId);
}

async function createFunnelExperimentData(
  experiment: Omit<FunnelExperiment, 'id' | 'createdAt' | 'updatedAt' | 'totalVisitors' | 'totalConversions' | 'averageConversionRate'>,
): Promise<FunnelExperiment> {
  return createFunnelExperiment(experiment);
}

async function updateFunnelExperimentStatusData(
  experimentId: string,
  status: FunnelExperimentStatus,
): Promise<FunnelExperiment> {
  return updateFunnelExperimentStatus(experimentId, status);
}

async function getAIExperimentSuggestions(
  funnelId: string,
  experimentType: FunnelExperimentType,
): Promise<AIExperimentSuggestion[]> {
  return generateAIExperimentSuggestions(funnelId, experimentType);
}

// US-FA-08: Identificación de cuellos de botella por etapa
async function getFunnelPerformanceAnalysisData(
  funnelId: string,
  period: FunnelsAcquisitionPeriod = '30d',
): Promise<FunnelPerformanceAnalysis> {
  return getFunnelPerformanceAnalysis(funnelId, period);
}

async function getFunnelBottlenecksList(funnelId?: string): Promise<FunnelBottleneck[]> {
  return getFunnelBottlenecks(funnelId);
}

// US-FA-016: Recomendaciones de nurturing según respuestas del lead magnet
async function getNurturingRecommendationsData(
  request: NurturingRecommendationRequest,
): Promise<NurturingRecommendation> {
  return getNurturingRecommendations(request);
}

async function analyzeLeadMagnetResponsesData(
  formSubmissionId: string,
  leadMagnetId: string,
  responses: Record<string, any>,
): Promise<LeadMagnetResponseAnalysis> {
  return analyzeLeadMagnetResponses(formSubmissionId, leadMagnetId, responses);
}

// US-FA-017: Enviar funnel a Campañas & Automatización
async function exportFunnelToCampaignsData(
  request: FunnelExportRequest,
): Promise<FunnelExportResponse> {
  return exportFunnelToCampaigns(request);
}

// US-FA-018: Convertir rápidamente un funnel en reto/comunidad
async function convertFunnelToChallengeData(
  request: FunnelToChallengeConversion,
): Promise<FunnelToChallengeConversionResponse> {
  return convertFunnelToChallenge(request);
}

// US-FA-019: Conectar funnels con contenidos existentes (reels top, testimonios)
async function getTopReelsData(
  limit: number = 10,
  minEngagement?: number,
): Promise<SocialMediaReel[]> {
  return getTopReels(limit, minEngagement);
}

async function getTopTestimonialsData(
  limit: number = 10,
  minScore?: number,
): Promise<TestimonialContent[]> {
  return getTopTestimonials(limit, minScore);
}

async function getFunnelContentRecommendationsData(
  funnelId: string,
  stageId?: string,
): Promise<FunnelContentRecommendation[]> {
  return getFunnelContentRecommendations(funnelId, stageId);
}

async function connectContentToFunnelData(
  request: FunnelContentConnectionRequest,
): Promise<FunnelContentConnectionResponse> {
  return connectContentToFunnel(request);
}

async function getFunnelConnectedContentData(
  funnelId: string,
  stageId?: string,
): Promise<FunnelContent[]> {
  return getFunnelConnectedContent(funnelId, stageId);
}

async function disconnectContentFromFunnelData(
  funnelId: string,
  contentConnectionId: string,
): Promise<{ success: boolean; message: string }> {
  return disconnectContentFromFunnel(funnelId, contentConnectionId);
}

// US-FA-020: Revenue proyectado por funnel según capacidad y precios
async function getProjectedRevenueByFunnel(
  period: FunnelsAcquisitionPeriod,
): Promise<ProjectedRevenueByFunnelResponse> {
  return fetchProjectedRevenueByFunnel(period);
}

// US-FA-021: Alertas si un funnel de captación no genera leads suficientes antes de una campaña
async function getFunnelLeadGenerationAlerts(): Promise<FunnelLeadGenerationAlertsResponse> {
  return fetchFunnelLeadGenerationAlerts();
}

// US-FA-022: Registrar notas cualitativas de cada funnel (feedback de prospectos)
async function getFunnelQualitativeNotesData(funnelId: string): Promise<FunnelQualitativeNotesResponse> {
  return getFunnelQualitativeNotes(funnelId);
}

async function createFunnelQualitativeNoteData(
  request: CreateFunnelQualitativeNoteRequest,
): Promise<FunnelQualitativeNote> {
  return createFunnelQualitativeNote(request);
}

async function updateFunnelQualitativeNoteData(
  request: UpdateFunnelQualitativeNoteRequest,
): Promise<FunnelQualitativeNote> {
  return updateFunnelQualitativeNote(request);
}

// US-FA-023: IA aprende qué tipos de propuestas cierro mejor para priorizar ideas similares
async function getProposalLearningData(
  period: FunnelsAcquisitionPeriod = '30d',
): Promise<ProposalLearningResponse> {
  return getProposalLearning(period);
}

async function trackProposalData(request: TrackProposalRequest): Promise<{ success: boolean; message: string; proposalId: string }> {
  return trackProposal(request);
}

async function getProposalSimilarityMatchesData(
  proposalType: ProposalType,
): Promise<ProposalSimilarityMatch[]> {
  return getProposalSimilarityMatches(proposalType);
}

// US-FA-024: Actualizar funnels con insights de Comunidad & Fidelización
async function getCommunityInsightsData(
  limit: number = 20,
  minScore?: number,
  minNps?: number,
): Promise<CommunityInsight[]> {
  return getCommunityInsights(limit, minScore, minNps);
}

async function getFunnelCommunityInsightsStatusData(
  funnelId: string,
): Promise<FunnelCommunityInsightsStatus> {
  return getFunnelCommunityInsightsStatus(funnelId);
}

async function updateFunnelWithCommunityInsightsData(
  request: FunnelCommunityInsightsUpdate,
): Promise<FunnelCommunityInsightsUpdateResponse> {
  return updateFunnelWithCommunityInsights(request);
}

async function getFunnelCommunityInsightsRecommendationsData(
  funnelId: string,
  stageId?: string,
): Promise<CommunityInsightsRecommendation[]> {
  return getFunnelCommunityInsightsRecommendations(funnelId, stageId);
}

// US-FA-025: Plantillas IA para follow-up post registro
async function generateFollowUpTemplatesData(
  request: FollowUpTemplateGenerationRequest,
): Promise<FollowUpTemplateGenerationResponse> {
  return generateFollowUpTemplates(request);
}

async function applyFollowUpTemplateData(
  request: FollowUpTemplateApplication,
): Promise<FollowUpTemplateApplicationResponse> {
  return applyFollowUpTemplate(request);
}

async function getFollowUpTemplatesData(
  channel?: FollowUpChannel,
): Promise<PostRegistrationFollowUpTemplate[]> {
  return getFollowUpTemplates(channel);
}

// US-FA-026: Calendario de lanzamientos y fases del funnel
async function getFunnelCalendarData(
  request: FunnelCalendarRequest,
): Promise<FunnelCalendarResponse> {
  return getFunnelCalendar(request);
}

// US-FA-027: Compartir resumen IA del funnel con community manager
async function generateFunnelAISummaryData(
  request: GenerateFunnelAISummaryRequest,
): Promise<GenerateFunnelAISummaryResponse> {
  return generateFunnelAISummary(request);
}

async function shareFunnelAISummaryData(
  request: ShareFunnelAISummaryRequest,
): Promise<ShareFunnelAISummaryResponse> {
  return shareFunnelAISummary(request);
}

async function getFunnelAISummariesData(
  request?: GetFunnelAISummariesRequest,
): Promise<GetFunnelAISummariesResponse> {
  return getFunnelAISummaries(request);
}

// US-FA-021: Actualizar un funnel una vez finalizado con resultados reales y aprendizajes
async function getFunnelRetrospectiveData(
  funnelId: string,
): Promise<FunnelRetrospective | null> {
  return getFunnelRetrospective(funnelId);
}

async function createFunnelRetrospectiveData(
  request: CreateFunnelRetrospectiveRequest,
): Promise<FunnelRetrospectiveResponse> {
  return createFunnelRetrospective(request);
}

async function updateFunnelRetrospectiveData(
  request: UpdateFunnelRetrospectiveRequest,
): Promise<FunnelRetrospectiveResponse> {
  return updateFunnelRetrospective(request);
}

export const FunnelsAdquisicionService = {
  getKPIs,
  getCampaigns,
  getFunnels,
  getEvents,
  getSuggestions,
  getWorkspaceBlueprints,
  getSnapshot,
  formatKpiValue,
  getLeadRiskAlerts,
  getFirstSessionConversionMetric,
  getSocialMediaMetrics,
  getReferralProgramMetrics,
  getRecommendedFunnels,
  savePersonas,
  savePainPointsData,
  adaptCopy,
  getPersonalization,
  generateLandingPageCopyWithAI,
  suggestIntelligentFormFields,
  saveIntelligentFormData,
  getIntelligentFormsList,
  submitIntelligentFormData,
  getFunnelExperimentsList,
  getFunnelExperimentById,
  createFunnelExperimentData,
  updateFunnelExperimentStatusData,
  getAIExperimentSuggestions,
  getFunnelPerformanceAnalysisData,
  getFunnelBottlenecksList,
  getNurturingRecommendations: getNurturingRecommendationsData,
  analyzeLeadMagnetResponses: analyzeLeadMagnetResponsesData,
  exportFunnelToCampaigns: exportFunnelToCampaignsData,
  convertFunnelToChallenge: convertFunnelToChallengeData,
  getTopReels: getTopReelsData,
  getTopTestimonials: getTopTestimonialsData,
  getFunnelContentRecommendations: getFunnelContentRecommendationsData,
  connectContentToFunnel: connectContentToFunnelData,
  getFunnelConnectedContent: getFunnelConnectedContentData,
  disconnectContentFromFunnel: disconnectContentFromFunnelData,
  getProjectedRevenueByFunnel,
  getFunnelLeadGenerationAlerts,
  getFunnelQualitativeNotes: getFunnelQualitativeNotesData,
  createFunnelQualitativeNote: createFunnelQualitativeNoteData,
  updateFunnelQualitativeNote: updateFunnelQualitativeNoteData,
  getProposalLearning: getProposalLearningData,
  trackProposal: trackProposalData,
  getProposalSimilarityMatches: getProposalSimilarityMatchesData,
  getCommunityInsights: getCommunityInsightsData,
  getFunnelCommunityInsightsStatus: getFunnelCommunityInsightsStatusData,
  updateFunnelWithCommunityInsights: updateFunnelWithCommunityInsightsData,
  getFunnelCommunityInsightsRecommendations: getFunnelCommunityInsightsRecommendationsData,
  generateFollowUpTemplates: generateFollowUpTemplatesData,
  applyFollowUpTemplate: applyFollowUpTemplateData,
  getFollowUpTemplates: getFollowUpTemplatesData,
  getFunnelCalendar: getFunnelCalendarData,
  generateFunnelAISummary: generateFunnelAISummaryData,
  shareFunnelAISummary: shareFunnelAISummaryData,
  getFunnelAISummaries: getFunnelAISummariesData,
  getFunnelRetrospective: getFunnelRetrospectiveData,
  createFunnelRetrospective: createFunnelRetrospectiveData,
  updateFunnelRetrospective: updateFunnelRetrospectiveData,
};










