export * from './intelligenceHub';
export {
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
} from './intelligenceHub';
