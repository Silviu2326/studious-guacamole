import {
  fetchActiveCampaigns,
  fetchAISuggestions,
  fetchMarketingKPIs,
  fetchSocialGrowth,
  fetchTopFunnels,
  fetchUpcomingEvents,
  fetchStrategicProfile,
  saveStrategicProfile,
  fetchQuarterlyObjectives,
  saveQuarterlyObjectives,
  fetchKPIAlerts,
  fetchSalesAttribution,
  fetchWeeklyAIStrategy,
  saveWeeklyAIStrategy,
  approveWeeklyAIStrategy,
  executeWeeklyAIStrategy,
  fetchSuggestionPlaybooks,
  saveSuggestionPlaybook,
  deleteSuggestionPlaybook,
  createPlaybookFromSuggestions,
  fetchContentRepower,
  createFunnelCampaignFromInsight,
  fetchFunnelCampaignDrafts,
  saveFunnelCampaignDraft,
  fetchHotLeads,
  fetchTeamMembers,
  shareWeeklySummary,
  fetchForecast,
  fetchAIRoadmap,
  fetchMarketingCalendarGaps,
  submitSuggestionFeedback,
  getLearningProfile,
  getLearningInsights,
  applyLearningToSuggestions,
  fetchExperiments,
  saveExperiment,
  updateExperiment,
  fetchMetricDropTips,
} from '../api';
import {
  AISuggestion,
  CampaignPerformance,
  FunnelPerformance,
  MarketingKPI,
  MarketingOverviewPeriod,
  MarketingOverviewSnapshot,
  SocialGrowthMetric,
  UpcomingEvent,
  StrategicProfile,
  QuarterlyObjectives,
  DefaultBuyerPersonaType,
  KPIAlert,
  SalesAttributionSnapshot,
  WeeklyAIStrategy,
  ToneType,
  SuggestionPlaybook,
  ContentRepowerSnapshot,
  InsightSource,
  FunnelCampaignDraft,
  HotLeadsSnapshot,
  TeamMember,
  WeeklySummaryShare,
  ForecastSnapshot,
  AIRoadmapSnapshot,
  SuggestedActivation,
  MarketingCalendarGapsSnapshot,
  SuggestionFeedback,
  LearningProfile,
  LearningInsights,
  MarketingExperiment,
  ExperimentsSnapshot,
  MetricDropTipsSnapshot,
} from '../types';

/**
 * Convierte valores de fortalezas a etiquetas legibles
 */
function getStrengthLabel(strength: string): string {
  const labels: Record<string, string> = {
    HIIT: 'HIIT',
    fuerza_funcional: 'Fuerza Funcional',
    nutrición_holística: 'Nutrición Holística',
    yoga: 'Yoga',
    pilates: 'Pilates',
    crossfit: 'CrossFit',
    running: 'Running',
    ciclismo: 'Ciclismo',
    natación: 'Natación',
    rehabilitación: 'Rehabilitación',
    nutrición_deportiva: 'Nutrición Deportiva',
    coaching_mindset: 'Coaching Mindset',
    entrenamiento_personalizado: 'Entrenamiento Personalizado',
  };
  return labels[strength] || strength;
}

/**
 * Genera narrativa contextual para un KPI basada en el perfil del entrenador y objetivos
 */
export function generateContextualNarrative(
  kpi: MarketingKPI,
  profile: StrategicProfile | null,
  objectives: QuarterlyObjectives | null
): string {
  const narratives: string[] = [];
  const trend = kpi.trendDirection;
  const change = kpi.changePercentage || 0;
  const value = kpi.value;

  // Narrativa base según el tipo de KPI
  switch (kpi.id) {
    case 'leads':
      if (trend === 'up') {
        narratives.push(`¡Excelente! Estás generando ${Math.round(value)} leads, un ${Math.abs(change)}% más que antes.`);
        if (objectives?.objectives.includes('captar_leads')) {
          narratives.push('Esto es clave para tu objetivo de captación. Cada lead es una oportunidad de mostrar tu expertise.');
        }
        if (profile?.strengths && profile.strengths.length > 0) {
          const strengthLabels = profile.strengths.slice(0, 2).map(getStrengthLabel);
          narratives.push(`Con tus fortalezas en ${strengthLabels.join(' y ')}, puedes crear contenido específico que atraiga a clientes ideales.`);
        }
        narratives.push('Siguiente paso: Segmenta estos leads por interés y crea secuencias personalizadas según sus necesidades.');
      } else if (trend === 'down') {
        narratives.push(`Tienes ${Math.round(value)} leads, pero ha bajado un ${Math.abs(change)}%.`);
        narratives.push('Es momento de revisar tus campañas y optimizar el targeting.');
        if (profile?.strengths && profile.strengths.length > 0) {
          narratives.push(`Enfócate en crear contenido que destaque tu expertise en ${getStrengthLabel(profile.strengths[0])} para atraer leads más cualificados.`);
        }
      }
      break;

    case 'funnel-revenue':
      if (trend === 'up') {
        narratives.push(`Tus funnels están generando ${Math.round(value / 1000)}K€, un ${Math.abs(change)}% más.`);
        if (objectives?.objectives.includes('vender_packs')) {
          narratives.push('Esto te acerca a tu objetivo de ventas. Los funnels están funcionando bien.');
        }
        narratives.push('Siguiente paso: Analiza qué funnels tienen mejor conversión y duplica ese modelo.');
      } else {
        narratives.push(`Tus funnels generan ${Math.round(value / 1000)}K€.`);
        narratives.push('Revisa los puntos de fricción en tus funnels y optimiza las páginas de venta.');
      }
      break;

    case 'email-ctr':
      if (trend === 'up') {
        narratives.push(`Tu CTR de email está en ${value.toFixed(1)}%, subiendo ${Math.abs(change)} puntos.`);
        narratives.push('Esto significa que tu audiencia está más comprometida con tu contenido.');
        if (objectives?.objectives.includes('fidelizar')) {
          narratives.push('Perfecto para tu objetivo de fidelización. Sigue nutriendo a tu base con contenido valioso.');
        }
        narratives.push('Siguiente paso: Duplica el formato de los emails que mejor funcionan.');
      } else {
        narratives.push(`Tu CTR está en ${value.toFixed(1)}%.`);
        narratives.push('Prueba diferentes asuntos y horarios de envío para mejorar el engagement.');
      }
      break;

    case 'roas':
      if (trend === 'up') {
        narratives.push(`Tu ROAS es ${value.toFixed(1)}x, mejorando ${Math.abs(change)} puntos.`);
        narratives.push('Por cada euro invertido, estás recuperando más. Tus campañas son rentables.');
        if (objectives?.objectives.includes('vender_packs')) {
          narratives.push('Esto te permite escalar con confianza hacia tu objetivo de ventas.');
        }
        narratives.push('Siguiente paso: Aumenta el presupuesto en las campañas con mejor ROAS.');
      } else if (trend === 'down') {
        narratives.push(`Tu ROAS es ${value.toFixed(1)}x, bajando ${Math.abs(change)} puntos.`);
        narratives.push('Revisa tus campañas activas. Puede que necesites ajustar el targeting o las creatividades.');
        narratives.push('Siguiente paso: Pausa las campañas con bajo rendimiento y optimiza las que funcionan.');
      } else {
        narratives.push(`Tu ROAS es ${value.toFixed(1)}x.`);
        narratives.push('Mantén este nivel mientras optimizas para mejorarlo gradualmente.');
      }
      break;

    case 'social-growth':
      if (trend === 'up') {
        narratives.push(`Tu crecimiento en redes es del ${value.toFixed(1)}%, aumentando ${Math.abs(change)} puntos.`);
        narratives.push('Tu comunidad está creciendo. Esto aumenta tu autoridad y alcance orgánico.');
        if (objectives?.objectives.includes('fidelizar')) {
          narratives.push('Ideal para fidelizar: una comunidad activa es tu mejor activo de retención.');
        }
        if (profile?.strengths && profile.strengths.length > 0) {
          narratives.push(`Aprovecha tu expertise en ${getStrengthLabel(profile.strengths[0])} para crear contenido que resuene con tu audiencia.`);
        }
        narratives.push('Siguiente paso: Interactúa más con tu comunidad y crea contenido educativo regular.');
      } else {
        narratives.push(`Tu crecimiento es del ${value.toFixed(1)}%.`);
        narratives.push('Consistencia es clave. Publica regularmente y responde a los comentarios.');
      }
      break;

    default:
      narratives.push(`Este KPI muestra ${kpi.label}.`);
      if (trend === 'up') {
        narratives.push(`Está mejorando un ${Math.abs(change)}%, lo cual es positivo.`);
      } else if (trend === 'down') {
        narratives.push(`Ha bajado un ${Math.abs(change)}%. Revisa qué puede estar afectando.`);
      }
  }

  // Agregar contexto según fortalezas si no se ha mencionado
  if (profile?.strengths && profile.strengths.length > 0 && !narratives.some(n => n.includes(profile.strengths![0]))) {
    const strengthLabels = profile.strengths.slice(0, 2).map(getStrengthLabel);
    narratives.push(`Recuerda: tus fortalezas en ${strengthLabels.join(' y ')} son tu diferenciador. Úsalas en tus campañas.`);
  }

  return narratives.join(' ');
}

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

export function formatKpiValue(kpi: MarketingKPI): string {
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

async function getKPIs(
  period: MarketingOverviewPeriod,
  buyerPersona?: DefaultBuyerPersonaType
): Promise<MarketingKPI[]> {
  return fetchMarketingKPIs(period, buyerPersona);
}

async function getKPIAlerts(
  kpis: MarketingKPI[],
  buyerPersona?: DefaultBuyerPersonaType
): Promise<KPIAlert[]> {
  return fetchKPIAlerts(kpis, buyerPersona);
}

async function getCampaigns(): Promise<CampaignPerformance[]> {
  return fetchActiveCampaigns();
}

async function getFunnels(period: MarketingOverviewPeriod): Promise<FunnelPerformance[]> {
  return fetchTopFunnels(period);
}

async function getSocial(period: MarketingOverviewPeriod): Promise<SocialGrowthMetric[]> {
  return fetchSocialGrowth(period);
}

async function getEvents(): Promise<UpcomingEvent[]> {
  return fetchUpcomingEvents();
}

async function getSuggestions(tone?: ToneType): Promise<AISuggestion[]> {
  return fetchAISuggestions(tone);
}

async function getSalesAttribution(
  period: MarketingOverviewPeriod,
  buyerPersona?: DefaultBuyerPersonaType
): Promise<SalesAttributionSnapshot> {
  return fetchSalesAttribution(period, buyerPersona);
}

async function getSnapshot(
  period: MarketingOverviewPeriod,
  buyerPersona?: DefaultBuyerPersonaType,
  tone?: ToneType
): Promise<MarketingOverviewSnapshot> {
  const [kpis, campaigns, funnels, socialGrowth, events, aiSuggestions, salesAttribution] = await Promise.all([
    getKPIs(period, buyerPersona),
    getCampaigns(),
    getFunnels(period),
    getSocial(period),
    getEvents(),
    getSuggestions(tone),
    getSalesAttribution(period, buyerPersona),
  ]);

  return {
    period,
    kpis,
    campaigns,
    funnels,
    socialGrowth,
    events,
    aiSuggestions,
    salesAttribution,
  };
}

async function getStrategicProfile(): Promise<StrategicProfile | null> {
  return fetchStrategicProfile();
}

async function saveProfile(profile: StrategicProfile): Promise<StrategicProfile> {
  return saveStrategicProfile(profile);
}

async function getQuarterlyObjectives(): Promise<QuarterlyObjectives | null> {
  return fetchQuarterlyObjectives();
}

async function saveObjectives(objectives: QuarterlyObjectives): Promise<QuarterlyObjectives> {
  return saveQuarterlyObjectives(objectives);
}

async function getWeeklyAIStrategy(
  strategicProfile?: StrategicProfile | null,
  quarterlyObjectives?: QuarterlyObjectives | null
): Promise<WeeklyAIStrategy | null> {
  return fetchWeeklyAIStrategy(strategicProfile, quarterlyObjectives);
}

async function saveWeeklyStrategy(strategy: WeeklyAIStrategy): Promise<WeeklyAIStrategy> {
  return saveWeeklyAIStrategy(strategy);
}

async function approveWeeklyStrategy(strategyId: string): Promise<WeeklyAIStrategy> {
  return approveWeeklyAIStrategy(strategyId);
}

async function executeWeeklyStrategy(strategyId: string): Promise<WeeklyAIStrategy> {
  return executeWeeklyAIStrategy(strategyId);
}

async function getPlaybooks(): Promise<SuggestionPlaybook[]> {
  return fetchSuggestionPlaybooks();
}

async function savePlaybook(playbook: SuggestionPlaybook): Promise<SuggestionPlaybook> {
  return saveSuggestionPlaybook(playbook);
}

async function deletePlaybook(playbookId: string): Promise<void> {
  return deleteSuggestionPlaybook(playbookId);
}

async function createPlaybook(
  name: string,
  suggestions: AISuggestion[],
  period: MarketingOverviewPeriod,
  isRecurring: boolean = true,
  description?: string
): Promise<SuggestionPlaybook> {
  return createPlaybookFromSuggestions(name, suggestions, period, isRecurring, description);
}

async function getContentRepower(
  period: MarketingOverviewPeriod,
  strategicProfile?: StrategicProfile | null,
  salesAttribution?: SalesAttributionSnapshot | null
): Promise<ContentRepowerSnapshot> {
  return fetchContentRepower(period, strategicProfile, salesAttribution);
}

async function createFunnelCampaign(
  insight: InsightSource,
  draft: Partial<FunnelCampaignDraft>
): Promise<FunnelCampaignDraft> {
  return createFunnelCampaignFromInsight(insight, draft);
}

async function getFunnelCampaignDrafts(): Promise<FunnelCampaignDraft[]> {
  return fetchFunnelCampaignDrafts();
}

async function saveFunnelCampaign(draft: FunnelCampaignDraft): Promise<FunnelCampaignDraft> {
  return saveFunnelCampaignDraft(draft);
}

async function getHotLeads(): Promise<HotLeadsSnapshot> {
  return fetchHotLeads();
}

async function getTeamMembers(): Promise<TeamMember[]> {
  return fetchTeamMembers();
}

async function shareWeeklySummaryWithTeam(
  strategyId: string,
  recipientIds: string[],
  message?: string
): Promise<WeeklySummaryShare> {
  return shareWeeklySummary(strategyId, recipientIds, message);
}

async function getForecast(
  period: MarketingOverviewPeriod,
  forecastPeriod: '7d' | '14d' | '30d' | '60d' | '90d' = '30d'
): Promise<ForecastSnapshot> {
  return fetchForecast(period, forecastPeriod);
}

async function getAIRoadmap(
  period: MarketingOverviewPeriod,
  roadmapPeriod: '30d' | '60d' | '90d' = '30d',
  strategicProfile?: StrategicProfile | null
): Promise<AIRoadmapSnapshot> {
  return fetchAIRoadmap(period, roadmapPeriod, strategicProfile);
}

async function getMarketingCalendarGaps(
  period: MarketingOverviewPeriod,
  strategicProfile?: StrategicProfile | null
): Promise<MarketingCalendarGapsSnapshot> {
  return fetchMarketingCalendarGaps(period, strategicProfile);
}

async function submitFeedback(
  suggestionId: string,
  suggestionType: 'ai_suggestion' | 'weekly_strategy' | 'activation' | 'content_repower',
  action: 'accept' | 'reject' | 'dismiss' | 'modify',
  reason?: string,
  modifiedData?: any,
  context?: {
    period?: MarketingOverviewPeriod;
    buyerPersona?: string;
    strategicProfile?: Partial<StrategicProfile>;
    quarterlyObjectives?: Partial<QuarterlyObjectives>;
  }
): Promise<SuggestionFeedback> {
  return submitSuggestionFeedback(suggestionId, suggestionType, action, reason, modifiedData, context);
}

async function getLearningProfileData(): Promise<LearningProfile | null> {
  return getLearningProfile();
}

async function getLearningInsightsData(): Promise<LearningInsights> {
  return getLearningInsights();
}

function applyLearning(
  suggestions: AISuggestion[],
  learningProfile: LearningProfile | null
): AISuggestion[] {
  return applyLearningToSuggestions(suggestions, learningProfile);
}

async function getExperiments(): Promise<ExperimentsSnapshot> {
  return fetchExperiments();
}

async function saveExperimentData(experiment: MarketingExperiment): Promise<MarketingExperiment> {
  return saveExperiment(experiment);
}

async function updateExperimentData(
  experimentId: string,
  updates: Partial<MarketingExperiment>
): Promise<MarketingExperiment> {
  return updateExperiment(experimentId, updates);
}

async function getMetricDropTips(
  kpis: MarketingKPI[],
  strategicProfile?: StrategicProfile | null
): Promise<MetricDropTipsSnapshot> {
  return fetchMetricDropTips(kpis, strategicProfile);
}

export const MarketingOverviewService = {
  getKPIs,
  getCampaigns,
  getFunnels,
  getSocial,
  getEvents,
  getSuggestions,
  getSnapshot,
  formatKpiValue,
  getStrategicProfile,
  saveProfile,
  getQuarterlyObjectives,
  saveObjectives,
  generateContextualNarrative,
  getKPIAlerts,
  getSalesAttribution,
  getWeeklyAIStrategy,
  saveWeeklyStrategy,
  approveWeeklyStrategy,
  executeWeeklyStrategy,
  getPlaybooks,
  savePlaybook,
  deletePlaybook,
  createPlaybook,
  getContentRepower,
  createFunnelCampaign,
  getFunnelCampaignDrafts,
  saveFunnelCampaign,
  getHotLeads,
  getTeamMembers,
  shareWeeklySummaryWithTeam,
  getForecast,
  getAIRoadmap,
  getMarketingCalendarGaps,
  submitFeedback,
  getLearningProfile: getLearningProfileData,
  getLearningInsights: getLearningInsightsData,
  applyLearning,
  getExperiments,
  saveExperiment: saveExperimentData,
  updateExperiment: updateExperimentData,
  getMetricDropTips,
};











