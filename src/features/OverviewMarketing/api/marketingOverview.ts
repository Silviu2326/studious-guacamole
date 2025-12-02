import {
  AISuggestion,
  CampaignPerformance,
  FunnelPerformance,
  MarketingKPI,
  MarketingOverviewPeriod,
  SocialGrowthMetric,
  UpcomingEvent,
  StrategicProfile,
  QuarterlyObjectives,
  DefaultBuyerPersonaType,
  KPIAlert,
  SalesAttributionSnapshot,
  SalesAttribution,
  WeeklyAIStrategy,
  WeeklyStrategyMessage,
  WeeklyStrategyFunnel,
  WeeklyStrategyPost,
  ToneType,
  SuggestionPlaybook,
  ContentRepowerSnapshot,
  ContentToRepower,
  InsightSource,
  FunnelCampaignDraft,
  HotLeadsSnapshot,
  HotLead,
  TeamMember,
  WeeklySummaryShare,
  ForecastSnapshot,
  CampaignForecast,
  AIRoadmapSnapshot,
  SuggestedActivation,
  MarketingCalendarGap,
  MarketingCalendarGapsSnapshot,
  SuggestionFeedback,
  LearningProfile,
  LearningInsights,
  MarketingExperiment,
  ExperimentsSnapshot,
  MetricDropTipsSnapshot,
  MetricDropTip,
  MetricDropSeverity,
} from '../types';

const periodMultipliers: Record<MarketingOverviewPeriod, number> = {
  '7d': 0.35,
  '30d': 1,
  '90d': 2.6,
};

// Rangos esperados por buyer persona y KPI
const expectedRangesByPersona: Record<string, Record<string, { min?: number; max?: number }>> = {
  ejecutivos: {
    leads: { min: 300, max: 800 },
    'funnel-revenue': { min: 40000, max: 100000 },
    'email-ctr': { min: 5, max: 12 },
    roas: { min: 3.5, max: 7 },
    'social-growth': { min: 3, max: 15 },
    estimatedROI: { min: 150, max: 400 },
  },
  madres: {
    leads: { min: 250, max: 600 },
    'funnel-revenue': { min: 30000, max: 80000 },
    'email-ctr': { min: 6, max: 15 },
    roas: { min: 3, max: 6 },
    'social-growth': { min: 5, max: 20 },
    estimatedROI: { min: 120, max: 350 },
  },
  atletas: {
    leads: { min: 200, max: 500 },
    'funnel-revenue': { min: 25000, max: 70000 },
    'email-ctr': { min: 4, max: 10 },
    roas: { min: 2.5, max: 5.5 },
    'social-growth': { min: 8, max: 25 },
    estimatedROI: { min: 100, max: 300 },
  },
  all: {
    leads: { min: 300, max: 700 },
    'funnel-revenue': { min: 35000, max: 90000 },
    'email-ctr': { min: 5, max: 12 },
    roas: { min: 3, max: 6 },
    'social-growth': { min: 4, max: 18 },
    estimatedROI: { min: 120, max: 350 },
  },
};

// KPIs base sin segmentación
const baseKpis: MarketingKPI[] = [
  {
    id: 'leads',
    label: 'Leads Generados',
    value: 420,
    changePercentage: 18,
    period: '30d',
    format: 'number',
    target: 500,
    trendDirection: 'up',
    expectedRange: expectedRangesByPersona.all.leads,
  },
  {
    id: 'funnel-revenue',
    label: 'Ventas por Funnels',
    value: 46800,
    changePercentage: 12,
    period: '30d',
    format: 'currency',
    trendDirection: 'up',
    expectedRange: expectedRangesByPersona.all['funnel-revenue'],
  },
  {
    id: 'email-ctr',
    label: 'CTR Email Marketing',
    value: 7.8,
    changePercentage: 2.4,
    period: '30d',
    format: 'percentage',
    trendDirection: 'up',
    expectedRange: expectedRangesByPersona.all['email-ctr'],
  },
  {
    id: 'roas',
    label: 'ROAS Promedio',
    value: 2.8, // Valor bajo para que salga de rango mínimo
    changePercentage: -0.6,
    period: '30d',
    format: 'number',
    trendDirection: 'down',
    expectedRange: expectedRangesByPersona.all.roas,
  },
  {
    id: 'social-growth',
    label: 'Crecimiento Redes',
    value: 20.5, // Valor alto para que salga de rango máximo
    changePercentage: 3.1,
    period: '30d',
    format: 'percentage',
    trendDirection: 'up',
    expectedRange: expectedRangesByPersona.all['social-growth'],
  },
  {
    id: 'estimatedROI',
    label: 'ROI Estimado',
    value: 0, // Se calculará dinámicamente basado en revenue y spend
    changePercentage: 8.5,
    period: '30d',
    format: 'percentage',
    trendDirection: 'up',
    expectedRange: expectedRangesByPersona.all.estimatedROI,
  },
];

// Valores base por buyer persona (simulando datos diferentes)
const personaValueMultipliers: Record<DefaultBuyerPersonaType, Record<string, number>> = {
  ejecutivos: {
    leads: 1.3, // Más leads pero más caros
    'funnel-revenue': 1.4, // Mayor revenue
    'email-ctr': 0.9, // Menor CTR (más ocupados)
    roas: 1.2, // Mejor ROAS
    'social-growth': 0.8, // Menor crecimiento en redes
    estimatedROI: 1.3, // Mayor ROI por mayor revenue
  },
  madres: {
    leads: 1.0,
    'funnel-revenue': 1.0,
    'email-ctr': 1.2, // Mayor engagement
    roas: 1.0,
    'social-growth': 1.3, // Mayor crecimiento en redes
    estimatedROI: 1.0,
  },
  atletas: {
    leads: 0.7, // Menos leads pero más cualificados
    'funnel-revenue': 0.9,
    'email-ctr': 0.85,
    roas: 0.9,
    'social-growth': 1.5, // Mayor crecimiento en redes
    estimatedROI: 0.85, // ROI ligeramente menor
  },
  all: {
    leads: 1.0,
    'funnel-revenue': 1.0,
    'email-ctr': 1.0,
    roas: 1.0,
    'social-growth': 1.0,
    estimatedROI: 1.0,
  },
};

const campaigns: CampaignPerformance[] = [
  {
    id: 'cmp-1',
    name: 'Always On - Meta Ads',
    channel: 'Meta Ads',
    objective: 'Leads',
    status: 'active',
    spend: 2400,
    budget: 3000,
    roas: 4.5,
    ctr: 3.8,
    leadsGenerated: 186,
    startDate: '2025-10-12',
  },
  {
    id: 'cmp-2',
    name: 'Retargeting - Funnel BOFU',
    channel: 'Google Ads',
    objective: 'Ventas',
    status: 'active',
    spend: 1850,
    budget: 2200,
    roas: 6.1,
    ctr: 5.2,
    leadsGenerated: 74,
    startDate: '2025-09-30',
  },
  {
    id: 'cmp-3',
    name: 'Email Nurturing Q4',
    channel: 'Email',
    objective: 'Reactivación',
    status: 'active',
    spend: 420,
    budget: 600,
    roas: 3.7,
    ctr: 8.9,
    leadsGenerated: 112,
    startDate: '2025-10-01',
    endDate: '2025-12-31',
  },
];

const funnels: FunnelPerformance[] = [
  {
    id: 'fun-1',
    name: 'Lead Magnet → Webinar → Demo',
    stage: 'MOFU',
    revenue: 26800,
    conversionRate: 5.7,
    velocityDays: 11,
    growthPercentage: 14,
  },
  {
    id: 'fun-2',
    name: 'UGC Ads → Landing → Trial',
    stage: 'TOFU',
    revenue: 14800,
    conversionRate: 3.2,
    velocityDays: 8,
    growthPercentage: 21,
  },
  {
    id: 'fun-3',
    name: 'Referidos → Demo → Cierre',
    stage: 'BOFU',
    revenue: 5200,
    conversionRate: 9.4,
    velocityDays: 6,
    growthPercentage: 8,
  },
];

const socialGrowth: SocialGrowthMetric[] = [
  {
    id: 'sg-ig',
    network: 'Instagram',
    followers: 42600,
    growthPercentage: 4.8,
    engagementRate: 3.6,
    highlight: 'Reels educativos (+38% alcance)',
  },
  {
    id: 'sg-tt',
    network: 'TikTok',
    followers: 18900,
    growthPercentage: 12.2,
    engagementRate: 7.4,
    highlight: 'Contenido UGC en tendencia',
  },
  {
    id: 'sg-ln',
    network: 'LinkedIn',
    followers: 18250,
    growthPercentage: 6.1,
    engagementRate: 4.1,
    highlight: 'Posts tipo carrusel de casos de éxito',
  },
];

const events: UpcomingEvent[] = [
  {
    id: 'evt-1',
    title: 'Webinar: Cómo lanzar un funnel evergreen en 48h',
    date: '2025-11-14T17:00:00Z',
    type: 'webinar',
    status: 'registration_open',
    targetAudience: 'Leads fríos (TOFU)',
    registrations: 246,
    goal: 300,
    host: 'Equipo Growth',
  },
  {
    id: 'evt-2',
    title: 'Workshop en vivo: IA para campañas de pago',
    date: '2025-11-21T16:00:00Z',
    type: 'workshop',
    status: 'scheduled',
    targetAudience: 'Clientes actuales',
    registrations: 58,
    goal: 120,
    host: 'Marketing Automation',
  },
  {
    id: 'evt-3',
    title: 'Challenge 5 días: Lanza tu lead magnet',
    date: '2025-12-02T12:00:00Z',
    type: 'challenge',
    status: 'draft',
    targetAudience: 'Freemium y pruebas',
    registrations: 0,
    goal: 400,
    host: 'Community Team',
  },
];

const aiSuggestions: AISuggestion[] = [
  {
    id: 'ai-1',
    title: 'Lanza retargeting con creatividades dinámicas',
    description: 'Activa variantes con UGC y oferta limitada para leads que visitaron pricing en últimos 7 días.',
    impact: 'high',
    rationale: 'Alta intención detectada en tráfico sin conversión. Se estima +18% en cierre.',
    cta: 'Crear campaña retargeting ahora',
  },
  {
    id: 'ai-2',
    title: 'Envía campaña de email tipo “última llamada”',
    description: 'Segmenta contactos que abrieron 3 correos de nurturing pero no hicieron clic en CTA.',
    impact: 'medium',
    rationale: 'CTR actual 7.8%. Se proyecta +2.4 puntos con oferta con deadline.',
    cta: 'Generar secuencia con IA',
  },
  {
    id: 'ai-3',
    title: 'Publica carrusel con caso de éxito fresh',
    description: 'Utiliza datos del funnel “Trial → Cierre” para reforzar prueba social en LinkedIn.',
    impact: 'medium',
    rationale: 'Crecimiento orgánico 6.1% en LinkedIn. Mayor engagement con contenido testimonial.',
    cta: 'Crear post con asistente IA',
  },
];

function simulateLatency<T>(data: T, delay = 220): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(JSON.parse(JSON.stringify(data)) as T), delay);
  });
}

export async function fetchMarketingKPIs(
  period: MarketingOverviewPeriod,
  buyerPersona?: DefaultBuyerPersonaType
): Promise<MarketingKPI[]> {
  const multiplier = periodMultipliers[period];
  const persona = buyerPersona || 'all';
  const personaMultipliers = personaValueMultipliers[persona];
  const personaRanges = expectedRangesByPersona[persona];

  // Calcular ROI estimado basado en revenue y gasto de marketing
  let estimatedROIValue = 0;
  if (baseKpis.some(kpi => kpi.id === 'estimatedROI')) {
    // Obtener datos de campañas y funnels para calcular ROI
    // Ajustar por período: los funnels ya se ajustan en fetchTopFunnels, pero las campañas son estáticas
    const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0) * multiplier;
    // Los funnels ya están ajustados por período cuando se obtienen, pero aquí usamos los datos base
    const totalFunnelRevenue = funnels.reduce((sum, f) => sum + f.revenue, 0) * multiplier;
    const totalCampaignRevenue = campaigns.reduce((sum, c) => sum + (c.spend * c.roas), 0) * multiplier;
    const totalRevenue = totalFunnelRevenue + totalCampaignRevenue;
    
    // Calcular ROI como porcentaje: ((revenue - spend) / spend) * 100
    if (totalSpend > 0) {
      estimatedROIValue = ((totalRevenue - totalSpend) / totalSpend) * 100;
    } else {
      // Si no hay gasto, usar un valor base razonable
      estimatedROIValue = 180; // 180% ROI base
    }
  }

  const adjusted = baseKpis.map((kpi) => {
    // Para estimatedROI, usar el valor calculado dinámicamente
    if (kpi.id === 'estimatedROI') {
      const personaMultiplier = personaMultipliers[kpi.id] || 1;
      const value = Number((estimatedROIValue * personaMultiplier).toFixed(2));
      
      return {
        ...kpi,
        value,
        period,
        buyerPersonaId: persona !== 'all' ? persona : undefined,
        expectedRange: personaRanges[kpi.id] || kpi.expectedRange,
      };
    }

    const baseValue = kpi.value;
    const personaMultiplier = personaMultipliers[kpi.id] || 1;
    let value: number;

    // Aplicar multiplicador de período y persona
    if (kpi.format === 'percentage') {
      // Para porcentajes, aplicar multiplicador de persona y ajuste de período
      value = Number((baseValue * personaMultiplier + (multiplier - 1) * 1.5).toFixed(2));
    } else if (['roas'].includes(kpi.id)) {
      // Para ROAS, aplicar multiplicador de persona y ajuste de período
      value = Number((baseValue * personaMultiplier + (multiplier - 1) * 0.5).toFixed(2));
    } else if (kpi.format === 'currency') {
      value = Math.round(baseValue * multiplier * personaMultiplier);
    } else {
      value = Math.round(baseValue * multiplier * personaMultiplier);
    }

    return {
      ...kpi,
      value,
      period,
      buyerPersonaId: persona !== 'all' ? persona : undefined,
      expectedRange: personaRanges[kpi.id] || kpi.expectedRange,
    };
  });

  return simulateLatency(adjusted);
}

export async function fetchActiveCampaigns(): Promise<CampaignPerformance[]> {
  return simulateLatency(campaigns);
}

export async function fetchTopFunnels(period: MarketingOverviewPeriod): Promise<FunnelPerformance[]> {
  const multiplier = periodMultipliers[period];

  const adjusted = funnels.map((funnel) => ({
    ...funnel,
    revenue: Math.round(funnel.revenue * multiplier),
    growthPercentage: Number((funnel.growthPercentage * multiplier * 0.8).toFixed(1)),
  }));

  return simulateLatency(adjusted);
}

export async function fetchSocialGrowth(period: MarketingOverviewPeriod): Promise<SocialGrowthMetric[]> {
  const multiplier = periodMultipliers[period];

  const adjusted = socialGrowth.map((metric) => ({
    ...metric,
    followers: Math.round(metric.followers * (1 + (multiplier - 1) * 0.15)),
    growthPercentage: Number((metric.growthPercentage * multiplier).toFixed(1)),
  }));

  return simulateLatency(adjusted);
}

export async function fetchUpcomingEvents(): Promise<UpcomingEvent[]> {
  return simulateLatency(events);
}

/**
 * Adapta el texto de una sugerencia según el tono seleccionado
 */
function adaptSuggestionToTone(suggestion: AISuggestion, tone?: ToneType): AISuggestion {
  if (!tone) {
    return suggestion;
  }

  const toneAdaptations: Record<ToneType, { titlePrefix?: string; descriptionModifier: (text: string) => string; rationaleModifier: (text: string) => string }> = {
    cercano: {
      descriptionModifier: (text) => {
        // Hacer el texto más amigable y cercano
        return text
          .replace(/Activa/g, 'Te sugiero activar')
          .replace(/Lanza/g, 'Lanza')
          .replace(/Envía/g, 'Te recomiendo enviar')
          .replace(/Publica/g, 'Publica')
          .replace(/Utiliza/g, 'Usa')
          .replace(/Segmenta/g, 'Te sugiero segmentar')
          .replace(/Crea/g, 'Crea');
      },
      rationaleModifier: (text) => {
        return text.replace(/Se estima/g, 'Estimamos').replace(/Se proyecta/g, 'Proyectamos');
      },
    },
    profesional: {
      descriptionModifier: (text) => {
        // Hacer el texto más técnico y profesional
        return text
          .replace(/Activa/g, 'Implementa')
          .replace(/Lanza/g, 'Ejecuta')
          .replace(/Envía/g, 'Distribuye')
          .replace(/Publica/g, 'Publica')
          .replace(/Utiliza/g, 'Aplica')
          .replace(/Segmenta/g, 'Segmenta')
          .replace(/Crea/g, 'Desarrolla');
      },
      rationaleModifier: (text) => {
        return text
          .replace(/Se estima/g, 'El análisis indica')
          .replace(/Se proyecta/g, 'Las proyecciones muestran')
          .replace(/Alta intención detectada/g, 'Análisis de comportamiento indica alta intención de compra');
      },
    },
    motivacional: {
      descriptionModifier: (text) => {
        // Hacer el texto más energético y motivador
        return text
          .replace(/Activa/g, '¡Activa ahora!')
          .replace(/Lanza/g, '¡Lanza ya!')
          .replace(/Envía/g, '¡Envía esta')
          .replace(/Publica/g, '¡Publica este')
          .replace(/Utiliza/g, '¡Aprovecha')
          .replace(/Segmenta/g, '¡Segmenta y')
          .replace(/Crea/g, '¡Crea este');
      },
      rationaleModifier: (text) => {
        return text
          .replace(/Se estima/g, '¡Se estima')
          .replace(/Se proyecta/g, '¡Se proyecta')
          .replace(/Alta intención detectada/g, '¡Excelente oportunidad! Alta intención detectada');
      },
    },
    educativo: {
      descriptionModifier: (text) => {
        return text;
      },
      rationaleModifier: (text) => {
        return text.replace(/Se estima/g, 'Los datos indican').replace(/Se proyecta/g, 'El análisis proyecta');
      },
    },
    inspirador: {
      descriptionModifier: (text) => {
        return text.replace(/Activa/g, 'Transforma con').replace(/Lanza/g, 'Impulsa');
      },
      rationaleModifier: (text) => {
        return text.replace(/Se estima/g, 'El potencial indica').replace(/Se proyecta/g, 'La visión proyecta');
      },
    },
    directo: {
      descriptionModifier: (text) => {
        return text;
      },
      rationaleModifier: (text) => {
        return text.replace(/Se estima/g, 'Resultado esperado:').replace(/Se proyecta/g, 'Proyección:');
      },
    },
  };

  const adaptation = toneAdaptations[tone] || toneAdaptations.profesional;

  return {
    ...suggestion,
    title: adaptation.titlePrefix ? `${adaptation.titlePrefix} ${suggestion.title}` : suggestion.title,
    description: adaptation.descriptionModifier(suggestion.description),
    rationale: adaptation.rationaleModifier(suggestion.rationale),
    adaptedTone: tone,
  };
}

export async function fetchAISuggestions(tone?: ToneType): Promise<AISuggestion[]> {
  const suggestions = await simulateLatency(aiSuggestions);
  
  // Adaptar sugerencias al tono si se proporciona
  if (tone) {
    return suggestions.map((suggestion) => adaptSuggestionToTone(suggestion, tone));
  }
  
  return suggestions;
}

// Strategic Profile API
const STORAGE_KEY_PROFILE = 'marketing_strategic_profile';
const STORAGE_KEY_OBJECTIVES = 'marketing_quarterly_objectives';

export async function fetchStrategicProfile(): Promise<StrategicProfile | null> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (stored) {
      return simulateLatency(JSON.parse(stored) as StrategicProfile, 100);
    }
    return simulateLatency(null, 100);
  } catch (error) {
    console.error('Error fetching strategic profile:', error);
    return simulateLatency(null, 100);
  }
}

export async function saveStrategicProfile(profile: StrategicProfile): Promise<StrategicProfile> {
  try {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
    return simulateLatency(profile, 200);
  } catch (error) {
    console.error('Error saving strategic profile:', error);
    throw error;
  }
}

export async function fetchQuarterlyObjectives(): Promise<QuarterlyObjectives | null> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_OBJECTIVES);
    if (stored) {
      return simulateLatency(JSON.parse(stored) as QuarterlyObjectives, 100);
    }
    return simulateLatency(null, 100);
  } catch (error) {
    console.error('Error fetching quarterly objectives:', error);
    return simulateLatency(null, 100);
  }
}

export async function saveQuarterlyObjectives(objectives: QuarterlyObjectives): Promise<QuarterlyObjectives> {
  try {
    localStorage.setItem(STORAGE_KEY_OBJECTIVES, JSON.stringify(objectives));
    return simulateLatency(objectives, 200);
  } catch (error) {
    console.error('Error saving quarterly objectives:', error);
    throw error;
  }
}

// Función para detectar alertas cuando KPIs salen de rango
export async function fetchKPIAlerts(
  kpis: MarketingKPI[],
  buyerPersona?: DefaultBuyerPersonaType
): Promise<KPIAlert[]> {
  const alerts: KPIAlert[] = [];
  const now = new Date().toISOString();

  kpis.forEach((kpi) => {
    if (!kpi.expectedRange) return;

    const { min, max } = kpi.expectedRange;
    const value = kpi.value;
    let severity: 'critical' | 'warning' | 'info' = 'info';
    let message = '';

    // Verificar si está fuera de rango
    if (min !== undefined && value < min) {
      const diff = ((min - value) / min) * 100;
      if (diff > 30) {
        severity = 'critical';
        message = `${kpi.label} está ${diff.toFixed(0)}% por debajo del mínimo esperado (${min}). Acción urgente requerida.`;
      } else {
        severity = 'warning';
        message = `${kpi.label} está ${diff.toFixed(0)}% por debajo del mínimo esperado (${min}). Revisa las métricas.`;
      }
    } else if (max !== undefined && value > max) {
      const diff = ((value - max) / max) * 100;
      if (diff > 30) {
        severity = 'warning';
        message = `${kpi.label} está ${diff.toFixed(0)}% por encima del máximo esperado (${max}). Puede indicar una anomalía.`;
      } else {
        severity = 'info';
        message = `${kpi.label} está ${diff.toFixed(0)}% por encima del máximo esperado (${max}). Monitorea de cerca.`;
      }
    }

    if (message) {
      alerts.push({
        id: `alert-${kpi.id}-${Date.now()}`,
        kpiId: kpi.id,
        severity,
        message,
        currentValue: value,
        expectedRange: kpi.expectedRange,
        buyerPersonaId: buyerPersona !== 'all' ? buyerPersona : undefined,
        timestamp: now,
      });
    }
  });

  return simulateLatency(alerts, 100);
}

// User Story 1: Sales Attribution API
const salesAttributionData: SalesAttribution[] = [
  {
    id: 'att-campaign-1',
    sourceType: 'campaign',
    sourceId: 'cmp-1',
    sourceName: 'Always On - Meta Ads',
    salesRevenue: 18600,
    salesCount: 12,
    conversionRate: 6.5,
    averageOrderValue: 1550,
    roas: 7.75,
    leadsGenerated: 186,
    leadsToSalesRate: 6.5,
    period: '30d',
    trendDirection: 'up',
    changePercentage: 18,
    channel: 'Meta Ads',
  },
  {
    id: 'att-campaign-2',
    sourceType: 'campaign',
    sourceId: 'cmp-2',
    sourceName: 'Retargeting - Funnel BOFU',
    salesRevenue: 12400,
    salesCount: 8,
    conversionRate: 10.8,
    averageOrderValue: 1550,
    roas: 6.7,
    leadsGenerated: 74,
    leadsToSalesRate: 10.8,
    period: '30d',
    trendDirection: 'up',
    changePercentage: 12,
    channel: 'Google Ads',
  },
  {
    id: 'att-lead-magnet-1',
    sourceType: 'lead_magnet',
    sourceId: 'lm-1',
    sourceName: 'Calculadora de Macros',
    salesRevenue: 9300,
    salesCount: 6,
    conversionRate: 4.8,
    averageOrderValue: 1550,
    leadsGenerated: 125,
    leadsToSalesRate: 4.8,
    period: '30d',
    trendDirection: 'up',
    changePercentage: 15,
    type: 'Calculator',
  },
  {
    id: 'att-lead-magnet-2',
    sourceType: 'lead_magnet',
    sourceId: 'lm-2',
    sourceName: 'Guía de Nutrición Holística',
    salesRevenue: 6200,
    salesCount: 4,
    conversionRate: 3.2,
    averageOrderValue: 1550,
    leadsGenerated: 125,
    leadsToSalesRate: 3.2,
    period: '30d',
    trendDirection: 'neutral',
    changePercentage: 0,
    type: 'PDF',
  },
  {
    id: 'att-content-1',
    sourceType: 'content',
    sourceId: 'content-1',
    sourceName: 'Reel: Transformación en 30 días',
    salesRevenue: 4650,
    salesCount: 3,
    conversionRate: 2.1,
    averageOrderValue: 1550,
    leadsGenerated: 142,
    leadsToSalesRate: 2.1,
    period: '30d',
    trendDirection: 'up',
    changePercentage: 25,
    type: 'Reel',
  },
  {
    id: 'att-content-2',
    sourceType: 'content',
    sourceId: 'content-2',
    sourceName: 'Post LinkedIn: Caso de éxito',
    salesRevenue: 3100,
    salesCount: 2,
    conversionRate: 1.8,
    averageOrderValue: 1550,
    leadsGenerated: 111,
    leadsToSalesRate: 1.8,
    period: '30d',
    trendDirection: 'up',
    changePercentage: 8,
    type: 'Post',
  },
];

export async function fetchSalesAttribution(
  period: MarketingOverviewPeriod,
  buyerPersona?: DefaultBuyerPersonaType
): Promise<SalesAttributionSnapshot> {
  const multiplier = periodMultipliers[period];
  
  // Adjust data based on period
  const adjustedAttribution = salesAttributionData.map((item) => {
    const adjustedRevenue = Math.round(item.salesRevenue * multiplier);
    const adjustedSales = Math.round(item.salesCount * multiplier);
    const adjustedLeads = Math.round(item.leadsGenerated * multiplier);
    
    return {
      ...item,
      salesRevenue: adjustedRevenue,
      salesCount: adjustedSales,
      leadsGenerated: adjustedLeads,
      period,
    };
  });

  // Calculate totals
  const totalRevenue = adjustedAttribution.reduce((sum, item) => sum + item.salesRevenue, 0);
  const totalSales = adjustedAttribution.reduce((sum, item) => sum + item.salesCount, 0);
  
  // Find top performer
  const topPerformer = adjustedAttribution.reduce((top, item) => {
    return item.salesRevenue > (top?.salesRevenue || 0) ? item : top;
  }, adjustedAttribution[0] || null);

  // Generate insights
  const insights: string[] = [];
  
  // Helper function to format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (topPerformer) {
    if (topPerformer.sourceType === 'campaign') {
      insights.push(
        `Tu campaña "${topPerformer.sourceName}" está generando ${formatCurrency(topPerformer.salesRevenue)} en ventas. Considera aumentar el presupuesto.`
      );
    } else if (topPerformer.sourceType === 'lead_magnet') {
      insights.push(
        `Tu lead magnet "${topPerformer.sourceName}" está convirtiendo ${topPerformer.conversionRate.toFixed(1)}% de leads a ventas. Duplica este formato.`
      );
    } else {
      insights.push(
        `Tu contenido "${topPerformer.sourceName}" está generando ${topPerformer.salesCount} ventas. Crea contenido similar.`
      );
    }
  }

  // Compare campaign vs lead magnet vs content performance
  const campaignRevenue = adjustedAttribution
    .filter((item) => item.sourceType === 'campaign')
    .reduce((sum, item) => sum + item.salesRevenue, 0);
  const leadMagnetRevenue = adjustedAttribution
    .filter((item) => item.sourceType === 'lead_magnet')
    .reduce((sum, item) => sum + item.salesRevenue, 0);
  const contentRevenue = adjustedAttribution
    .filter((item) => item.sourceType === 'content')
    .reduce((sum, item) => sum + item.salesRevenue, 0);

  if (campaignRevenue > leadMagnetRevenue && campaignRevenue > contentRevenue) {
    insights.push(
      'Las campañas de pago están generando más ventas que los lead magnets y contenido orgánico. Considera escalar las campañas que mejor funcionan.'
    );
  } else if (leadMagnetRevenue > campaignRevenue && leadMagnetRevenue > contentRevenue) {
    insights.push(
      'Tus lead magnets están generando más ventas que las campañas. Esto indica que tienes un buen sistema de nutrición. Optimiza la conversión de los lead magnets que menos venden.'
    );
  } else if (contentRevenue > campaignRevenue && contentRevenue > leadMagnetRevenue) {
    insights.push(
      'Tu contenido orgánico está generando más ventas. Esto es excelente para el crecimiento sostenible. Aumenta la frecuencia de publicación de contenido similar.'
    );
  }

  // Find underperformers
  const avgRevenue = totalRevenue / adjustedAttribution.length;
  const underperformers = adjustedAttribution.filter((item) => item.salesRevenue < avgRevenue * 0.5);
  
  if (underperformers.length > 0) {
    insights.push(
      `${underperformers.length} ${underperformers.length === 1 ? 'elemento está' : 'elementos están'} generando menos del 50% del promedio. Considera optimizarlos o pausarlos.`
    );
  }

  const snapshot: SalesAttributionSnapshot = {
    period,
    totalRevenue,
    totalSales,
    attribution: adjustedAttribution,
    topPerformer,
    insights,
  };

  return simulateLatency(snapshot, 200);
}

// User Story 2: Weekly AI Strategy API
export async function fetchWeeklyAIStrategy(
  strategicProfile?: StrategicProfile | null,
  quarterlyObjectives?: QuarterlyObjectives | null
): Promise<WeeklyAIStrategy | null> {
  // Calculate current week dates
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
  startOfWeek.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday
  endOfWeek.setHours(23, 59, 59, 999);

  // Generate strategic focus based on profile and objectives
  let strategicFocus = 'Estrategia semanal personalizada para maximizar resultados.';
  const objectives: string[] = [];

  if (quarterlyObjectives?.objectives) {
    if (quarterlyObjectives.objectives.includes('captar_leads')) {
      objectives.push('Aumentar la captación de leads cualificados');
      strategicFocus = 'Enfócate en captar leads cualificados mediante campañas y contenido de valor.';
    }
    if (quarterlyObjectives.objectives.includes('vender_packs')) {
      objectives.push('Incrementar las ventas de packs y servicios');
      strategicFocus = 'Optimiza los funnels de venta y aumenta la conversión.';
    }
    if (quarterlyObjectives.objectives.includes('fidelizar')) {
      objectives.push('Fidelizar clientes existentes');
      strategicFocus = 'Mejora la retención y el engagement con tu comunidad.';
    }
  }

  if (objectives.length === 0) {
    objectives.push('Maximizar resultados de marketing');
  }

  // Generate messages
  const messages: WeeklyStrategyMessage[] = [
    {
      id: 'msg-1',
      type: 'email',
      subject: 'Guía gratuita: Transforma tu rutina en 7 días',
      content: 'Hola [Nombre], he preparado una guía exclusiva con los 7 pasos clave para transformar tu rutina de entrenamiento. Descárgala gratis y comienza hoy mismo.',
      targetAudience: 'Leads fríos (no abiertos últimos 7 días)',
      sendDate: startOfWeek.toISOString(),
      status: 'draft',
      estimatedImpact: 'high',
    },
    {
      id: 'msg-2',
      type: 'email',
      subject: 'Última oportunidad: Oferta especial esta semana',
      content: 'Hola [Nombre], tienes hasta el domingo para aprovechar nuestra oferta especial. No pierdas esta oportunidad única de trabajar conmigo.',
      targetAudience: 'Leads calientes (visitaron pricing últimos 3 días)',
      sendDate: new Date(startOfWeek.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'draft',
      estimatedImpact: 'high',
    },
    {
      id: 'msg-3',
      type: 'email',
      subject: 'Consejo del día: Cómo mantener la motivación',
      content: 'Hola [Nombre], aquí tienes un consejo rápido para mantener la motivación durante tus entrenamientos. Espero que te ayude.',
      targetAudience: 'Clientes activos',
      sendDate: new Date(startOfWeek.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'draft',
      estimatedImpact: 'medium',
    },
  ];

  // Generate funnels
  const funnels: WeeklyStrategyFunnel[] = [
    {
      id: 'funnel-1',
      name: 'Lead Magnet → Nurturing → Demo',
      description: 'Funnel de prospección diseñado para convertir leads fríos en clientes cualificados mediante contenido de valor.',
      stage: 'TOFU',
      recommendedAction: 'Activar secuencia de emails de nurturing',
      estimatedRevenue: 15000,
      estimatedConversion: 4.5,
      priority: 1,
      status: 'draft',
    },
    {
      id: 'funnel-2',
      name: 'Retargeting → Landing → Cierre',
      description: 'Funnel de conversión para leads que visitaron pricing pero no compraron.',
      stage: 'BOFU',
      recommendedAction: 'Lanzar campaña de retargeting con oferta especial',
      estimatedRevenue: 25000,
      estimatedConversion: 8.2,
      priority: 2,
      status: 'draft',
    },
  ];

  // Generate posts
  const posts: WeeklyStrategyPost[] = [
    {
      id: 'post-1',
      platform: 'instagram',
      type: 'reel',
      caption: '💪 Transformación real en 30 días. Si yo pude, tú también puedes. ¿Listo para empezar tu transformación? 👇 #FitnessMotivation #Transformación #EntrenamientoPersonal',
      hashtags: ['FitnessMotivation', 'Transformación', 'EntrenamientoPersonal', 'Motivación', 'Salud'],
      publishDate: new Date(startOfWeek.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'draft',
      estimatedEngagement: 1250,
      estimatedReach: 8500,
    },
    {
      id: 'post-2',
      platform: 'linkedin',
      type: 'post',
      caption: '3 errores comunes que cometen los entrenadores personales al crear contenido en redes sociales. Como entrenador personal, he aprendido que el contenido que funciona no es el que piensas. Aquí están los 3 errores más comunes...',
      hashtags: ['EntrenamientoPersonal', 'MarketingFitness', 'Coaching', 'NegocioFitness'],
      publishDate: new Date(startOfWeek.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'draft',
      estimatedEngagement: 890,
      estimatedReach: 3200,
    },
    {
      id: 'post-3',
      platform: 'instagram',
      type: 'carousel',
      caption: '📊 Caso de éxito: Cliente perdió 15kg en 3 meses. Conoce su historia completa y los pasos que siguió. 💪 #CasoDeÉxito #PérdidaDePeso #Transformación #Motivación',
      hashtags: ['CasoDeÉxito', 'PérdidaDePeso', 'Transformación', 'Motivación', 'Resultados'],
      publishDate: new Date(startOfWeek.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'draft',
      estimatedEngagement: 2100,
      estimatedReach: 12000,
    },
  ];

  // Calculate expected results
  const estimatedRevenue = funnels.reduce((sum, funnel) => sum + funnel.estimatedRevenue, 0);
  const estimatedLeads = Math.round(estimatedRevenue / 1500); // Average order value
  const estimatedEngagement = posts.reduce((sum, post) => sum + post.estimatedEngagement, 0);

  const strategy: WeeklyAIStrategy = {
    id: `strategy-${startOfWeek.toISOString()}`,
    weekStartDate: startOfWeek.toISOString(),
    weekEndDate: endOfWeek.toISOString(),
    generatedAt: now.toISOString(),
    strategicFocus,
    objectives,
    messages,
    funnels,
    posts,
    expectedResults: {
      estimatedRevenue,
      estimatedLeads,
      estimatedEngagement,
    },
    personalizationBasedOn: {
      strategicProfile: strategicProfile || undefined,
      quarterlyObjectives: quarterlyObjectives || undefined,
      performanceData: 'Basado en datos de performance de las últimas 4 semanas',
    },
    status: 'draft',
    executionProgress: 0,
  };

  return simulateLatency(strategy, 300);
}

export async function saveWeeklyAIStrategy(strategy: WeeklyAIStrategy): Promise<WeeklyAIStrategy> {
  try {
    localStorage.setItem(`weekly_strategy_${strategy.id}`, JSON.stringify(strategy));
    return simulateLatency(strategy, 200);
  } catch (error) {
    console.error('Error saving weekly strategy:', error);
    throw error;
  }
}

export async function approveWeeklyAIStrategy(strategyId: string): Promise<WeeklyAIStrategy> {
  try {
    const stored = localStorage.getItem(`weekly_strategy_${strategyId}`);
    if (!stored) {
      throw new Error('Strategy not found');
    }
    const strategy = JSON.parse(stored) as WeeklyAIStrategy;
    strategy.status = 'approved';
    localStorage.setItem(`weekly_strategy_${strategyId}`, JSON.stringify(strategy));
    return simulateLatency(strategy, 200);
  } catch (error) {
    console.error('Error approving weekly strategy:', error);
    throw error;
  }
}

export async function executeWeeklyAIStrategy(strategyId: string): Promise<WeeklyAIStrategy> {
  try {
    const stored = localStorage.getItem(`weekly_strategy_${strategyId}`);
    if (!stored) {
      throw new Error('Strategy not found');
    }
    const strategy = JSON.parse(stored) as WeeklyAIStrategy;
    strategy.status = 'executing';
    strategy.executionProgress = 25; // Start execution
    localStorage.setItem(`weekly_strategy_${strategyId}`, JSON.stringify(strategy));
    return simulateLatency(strategy, 200);
  } catch (error) {
    console.error('Error executing weekly strategy:', error);
    throw error;
  }
}

// User Story: Playbooks de Sugerencias API
const STORAGE_KEY_PLAYBOOKS = 'marketing_suggestion_playbooks';

export async function fetchSuggestionPlaybooks(): Promise<SuggestionPlaybook[]> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_PLAYBOOKS);
    if (stored) {
      return simulateLatency(JSON.parse(stored) as SuggestionPlaybook[], 100);
    }
    return simulateLatency([], 100);
  } catch (error) {
    console.error('Error fetching playbooks:', error);
    return simulateLatency([], 100);
  }
}

export async function saveSuggestionPlaybook(playbook: SuggestionPlaybook): Promise<SuggestionPlaybook> {
  try {
    const playbooks = await fetchSuggestionPlaybooks();
    const existingIndex = playbooks.findIndex((p) => p.id === playbook.id);
    
    if (existingIndex >= 0) {
      playbooks[existingIndex] = { ...playbook, updatedAt: new Date().toISOString() };
    } else {
      playbooks.push(playbook);
    }
    
    localStorage.setItem(STORAGE_KEY_PLAYBOOKS, JSON.stringify(playbooks));
    return simulateLatency(playbook, 200);
  } catch (error) {
    console.error('Error saving playbook:', error);
    throw error;
  }
}

export async function deleteSuggestionPlaybook(playbookId: string): Promise<void> {
  try {
    const playbooks = await fetchSuggestionPlaybooks();
    const filtered = playbooks.filter((p) => p.id !== playbookId);
    localStorage.setItem(STORAGE_KEY_PLAYBOOKS, JSON.stringify(filtered));
    return simulateLatency(undefined, 200);
  } catch (error) {
    console.error('Error deleting playbook:', error);
    throw error;
  }
}

export async function createPlaybookFromSuggestions(
  name: string,
  suggestions: AISuggestion[],
  period: MarketingOverviewPeriod,
  isRecurring: boolean = true,
  description?: string
): Promise<SuggestionPlaybook> {
  const now = new Date().toISOString();
  const playbook: SuggestionPlaybook = {
    id: `playbook-${Date.now()}`,
    name,
    description,
    suggestions: suggestions.map((s) => ({ ...s })), // Clone suggestions
    createdAt: now,
    updatedAt: now,
    isRecurring,
    period,
  };
  
  return saveSuggestionPlaybook(playbook);
}

// User Story 1: Content Repower API
export async function fetchContentRepower(
  period: MarketingOverviewPeriod,
  strategicProfile?: StrategicProfile | null,
  salesAttribution?: SalesAttributionSnapshot | null
): Promise<ContentRepowerSnapshot> {
  // Simular datos de contenido a repotenciar basado en atribución de ventas y perfil estratégico
  const contents: ContentToRepower[] = [];
  
  // Obtener contenido destacado de la atribución de ventas
  if (salesAttribution?.attribution) {
    salesAttribution.attribution.forEach((item) => {
      if (item.sourceType === 'content' || item.sourceType === 'lead_magnet') {
        const score = Math.min(100, (item.conversionRate * 10) + (item.salesRevenue / 100));
        const toneMatch = strategicProfile?.tone ? 85 : 70;
        const strengthMatch: string[] = [];
        
        if (strategicProfile?.strengths) {
          // Simular coincidencias con fortalezas
          if (item.sourceName.toLowerCase().includes('nutrición') || item.sourceName.toLowerCase().includes('nutricion')) {
            if (strategicProfile.strengths.includes('nutrición_holística') || strategicProfile.strengths.includes('nutrición_deportiva')) {
              strengthMatch.push('Nutrición');
            }
          }
          if (item.sourceName.toLowerCase().includes('transformación') || item.sourceName.toLowerCase().includes('transformacion')) {
            strengthMatch.push('Coaching');
          }
        }
        
        contents.push({
          id: `repower-${item.id}`,
          title: item.sourceName,
          type: item.sourceType === 'lead_magnet' ? 'lead_magnet' : (item.type?.toLowerCase() as any || 'post'),
          platform: item.sourceType === 'content' ? (item.type === 'Reel' ? 'instagram' : 'linkedin') : undefined,
          originalDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Hace 30 días
          performance: {
            leadsGenerated: item.leadsGenerated,
            salesRevenue: item.salesRevenue,
            conversionRate: item.conversionRate,
            score: Math.round(score),
          },
          styleMatch: {
            toneMatch,
            strengthMatch,
            personaMatch: item.sourceType === 'content' ? 'all' : undefined,
          },
          recommendation: {
            reason: `Este contenido generó ${item.salesCount} ventas con un ${item.conversionRate.toFixed(1)}% de conversión.`,
            suggestedAction: item.sourceType === 'lead_magnet' 
              ? 'Repotenciar este lead magnet con campaña de pago y contenido orgánico'
              : 'Amplificar este contenido con presupuesto de pago y crear variaciones',
            expectedImpact: item.conversionRate > 5 ? 'high' : item.conversionRate > 3 ? 'medium' : 'low',
            suggestedChannels: item.sourceType === 'lead_magnet' 
              ? ['Meta Ads', 'Email', 'LinkedIn']
              : ['Instagram', 'LinkedIn', 'TikTok'],
          },
        });
      }
    });
  }
  
  // Agregar contenido de campañas destacadas
  if (salesAttribution?.attribution) {
    salesAttribution.attribution
      .filter(item => item.sourceType === 'campaign' && item.roas && item.roas > 5)
      .forEach((item) => {
        contents.push({
          id: `repower-campaign-${item.id}`,
          title: item.sourceName,
          type: 'campaign',
          platform: item.channel === 'Meta Ads' ? 'facebook' : undefined,
          originalDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          performance: {
            leadsGenerated: item.leadsGenerated,
            salesRevenue: item.salesRevenue,
            conversionRate: item.conversionRate,
            roas: item.roas,
            score: Math.round((item.roas || 0) * 15),
          },
          styleMatch: {
            toneMatch: strategicProfile?.tone ? 90 : 75,
            strengthMatch: [],
          },
          recommendation: {
            reason: `Esta campaña tiene un ROAS de ${item.roas?.toFixed(1)}x y está generando ${item.salesCount} ventas.`,
            suggestedAction: 'Aumentar presupuesto y escalar esta campaña a nuevas audiencias',
            expectedImpact: 'high',
            suggestedChannels: [item.channel || 'Meta Ads'],
          },
        });
      });
  }
  
  // Ordenar por score descendente
  contents.sort((a, b) => b.performance.score - a.performance.score);
  
  const topPerformer = contents.length > 0 ? contents[0] : null;
  
  // Calcular impacto potencial
  const totalPotentialImpact = {
    estimatedLeads: contents.reduce((sum, c) => sum + (c.performance.leadsGenerated || 0) * 1.5, 0),
    estimatedRevenue: contents.reduce((sum, c) => sum + (c.performance.salesRevenue || 0) * 1.3, 0),
    estimatedEngagement: contents.reduce((sum, c) => sum + (c.performance.engagement || 0) * 1.2, 0),
  };
  
  // Generar insights
  const insights: string[] = [];
  if (topPerformer) {
    insights.push(
      `Tu ${topPerformer.type === 'lead_magnet' ? 'lead magnet' : topPerformer.type} "${topPerformer.title}" es tu mejor contenido. Repotenciarlo podría generar ${Math.round((topPerformer.performance.salesRevenue || 0) * 0.3)}€ adicionales.`
    );
  }
  
  if (contents.filter(c => c.performance.score > 70).length > 0) {
    insights.push(
      `Tienes ${contents.filter(c => c.performance.score > 70).length} piezas de contenido con alto rendimiento. Amplificarlas te ayudará a maximizar resultados sin crear contenido nuevo.`
    );
  }
  
  if (strategicProfile?.strengths && contents.some(c => c.styleMatch.strengthMatch.length > 0)) {
    insights.push(
      `El contenido que mejor coincide con tus fortalezas (${strategicProfile.strengths.slice(0, 2).join(', ')}) está generando resultados. Enfócate en repotenciar este tipo de contenido.`
    );
  }
  
  const snapshot: ContentRepowerSnapshot = {
    period,
    contents: contents.slice(0, 5), // Top 5
    topPerformer,
    insights,
    totalPotentialImpact,
  };
  
  return simulateLatency(snapshot, 250);
}

// User Story 2: Create Funnel/Campaign from Insight API
const STORAGE_KEY_DRAFTS = 'marketing_funnel_campaign_drafts';

export async function createFunnelCampaignFromInsight(
  insight: InsightSource,
  draft: Partial<FunnelCampaignDraft>
): Promise<FunnelCampaignDraft> {
  const now = new Date().toISOString();
  
  // Generar nombre sugerido basado en el insight
  let suggestedName = draft.name || '';
  if (!suggestedName) {
    if (insight.type === 'suggestion') {
      suggestedName = `Campaña: ${insight.title}`;
    } else if (insight.type === 'attribution') {
      suggestedName = `Funnel: ${insight.title}`;
    } else {
      suggestedName = `Nueva ${draft.type === 'funnel' ? 'Funnel' : 'Campaña'}`;
    }
  }
  
  const funnelCampaign: FunnelCampaignDraft = {
    id: `draft-${Date.now()}`,
    name: suggestedName,
    type: draft.type || 'campaign',
    source: insight,
    stage: draft.stage || 'TOFU',
    channel: draft.channel || 'Meta Ads',
    objective: draft.objective || (draft.type === 'funnel' ? 'Conversión' : 'Leads'),
    budget: draft.budget || 500,
    targetAudience: draft.targetAudience || 'Audiencia basada en insight',
    description: draft.description || insight.description,
    status: 'draft',
    createdAt: now,
  };
  
  // Guardar en localStorage
  try {
    const drafts = await fetchFunnelCampaignDrafts();
    drafts.push(funnelCampaign);
    localStorage.setItem(STORAGE_KEY_DRAFTS, JSON.stringify(drafts));
  } catch (error) {
    console.error('Error saving draft:', error);
  }
  
  return simulateLatency(funnelCampaign, 200);
}

export async function fetchFunnelCampaignDrafts(): Promise<FunnelCampaignDraft[]> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_DRAFTS);
    if (stored) {
      return simulateLatency(JSON.parse(stored) as FunnelCampaignDraft[], 100);
    }
    return simulateLatency([], 100);
  } catch (error) {
    console.error('Error fetching drafts:', error);
    return simulateLatency([], 100);
  }
}

export async function saveFunnelCampaignDraft(draft: FunnelCampaignDraft): Promise<FunnelCampaignDraft> {
  try {
    const drafts = await fetchFunnelCampaignDrafts();
    const existingIndex = drafts.findIndex((d) => d.id === draft.id);
    
    if (existingIndex >= 0) {
      drafts[existingIndex] = draft;
    } else {
      drafts.push(draft);
    }
    
    localStorage.setItem(STORAGE_KEY_DRAFTS, JSON.stringify(drafts));
    return simulateLatency(draft, 200);
  } catch (error) {
    console.error('Error saving draft:', error);
    throw error;
  }
}

// User Story 1: Fetch Hot Leads
export async function fetchHotLeads(): Promise<HotLeadsSnapshot> {
  await simulateLatency(null, 300);

  // Mock data - In production, this would fetch from the leads API
  const mockHotLeads: HotLead[] = [
    {
      id: 'lead-1',
      name: 'María González',
      email: 'maria.gonzalez@email.com',
      phone: '+34 612 345 678',
      score: 85,
      probability: 78,
      source: 'instagram',
      lastInteraction: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      lastInteractionType: 'Mensaje en Instagram',
      status: 'contacted',
      tags: ['caliente', 'interesado', 'pricing'],
      preferredChannel: 'instagram',
      urgency: 'high',
    },
    {
      id: 'lead-2',
      name: 'Carlos Ruiz',
      email: 'carlos.ruiz@email.com',
      phone: '+34 623 456 789',
      score: 72,
      probability: 65,
      source: 'whatsapp',
      lastInteraction: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
      lastInteractionType: 'Consulta por WhatsApp',
      status: 'qualified',
      tags: ['caliente', 'referido'],
      preferredChannel: 'whatsapp',
      urgency: 'medium',
    },
    {
      id: 'lead-3',
      name: 'Ana Martínez',
      email: 'ana.martinez@email.com',
      phone: '+34 634 567 890',
      score: 68,
      probability: 60,
      source: 'referido',
      lastInteraction: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      lastInteractionType: 'Llamada telefónica',
      status: 'meeting_scheduled',
      tags: ['caliente'],
      preferredChannel: 'phone',
      urgency: 'low',
    },
    {
      id: 'lead-4',
      name: 'David López',
      email: 'david.lopez@email.com',
      phone: '+34 645 678 901',
      score: 80,
      probability: 72,
      source: 'instagram',
      lastInteraction: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
      lastInteractionType: 'Comentario en post',
      status: 'contacted',
      tags: ['caliente', 'urgente'],
      preferredChannel: 'instagram',
      urgency: 'high',
    },
  ];

  const highUrgencyCount = mockHotLeads.filter((lead) => lead.urgency === 'high').length;

  return {
    leads: mockHotLeads,
    totalCount: mockHotLeads.length,
    highUrgencyCount,
    lastUpdated: new Date().toISOString(),
  };
}

// User Story 2: Fetch Team Members
export async function fetchTeamMembers(): Promise<TeamMember[]> {
  await simulateLatency(null, 200);

  // Mock data - In production, this would fetch from the team API
  return [
    {
      id: 'team-1',
      name: 'Laura Sánchez',
      email: 'laura.sanchez@email.com',
      role: 'community_manager',
      avatar: undefined,
    },
    {
      id: 'team-2',
      name: 'Dr. Juan Pérez',
      email: 'juan.perez@email.com',
      role: 'nutricionista',
      avatar: undefined,
    },
    {
      id: 'team-3',
      name: 'Sofía García',
      email: 'sofia.garcia@email.com',
      role: 'community_manager',
      avatar: undefined,
    },
    {
      id: 'team-4',
      name: 'Dr. Miguel Torres',
      email: 'miguel.torres@email.com',
      role: 'nutricionista',
      avatar: undefined,
    },
  ];
}

// User Story 2: Share Weekly Summary
export async function shareWeeklySummary(
  strategyId: string,
  recipientIds: string[],
  message?: string
): Promise<WeeklySummaryShare> {
  await simulateLatency(null, 500);

  // In production, this would make an API call to share the summary
  // For now, we'll return a mock response
  const teamMembers = await fetchTeamMembers();
  const recipients = teamMembers.filter((m) => recipientIds.includes(m.id));

  const share: WeeklySummaryShare = {
    id: `share_${Date.now()}`,
    strategyId,
    sharedBy: 'current_user', // This should come from auth context
    sharedByName: 'Tú',
    sharedAt: new Date().toISOString(),
    recipients,
    message,
    status: 'sent',
    viewedBy: [],
    acknowledgedBy: [],
  };

  // In production, save to backend
  const STORAGE_KEY_SHARES = 'weekly_summary_shares';
  const existingShares = JSON.parse(localStorage.getItem(STORAGE_KEY_SHARES) || '[]');
  existingShares.push(share);
  localStorage.setItem(STORAGE_KEY_SHARES, JSON.stringify(existingShares));

  return share;
}

// User Story 1: Forecast Automatizado de Leads e Ingresos
export async function fetchForecast(
  period: MarketingOverviewPeriod,
  forecastPeriod: '7d' | '14d' | '30d' | '60d' | '90d' = '30d'
): Promise<ForecastSnapshot> {
  await simulateLatency(null, 300);

  // Obtener datos de campañas activas
  const activeCampaigns = await fetchActiveCampaigns();
  
  // Calcular forecast basado en campañas activas
  const campaigns: CampaignForecast[] = activeCampaigns.map((campaign) => {
    // Calcular tasa de crecimiento basada en ROAS y CTR
    const growthRate = campaign.roas > 4 ? 15 : campaign.roas > 3 ? 10 : 5;
    const confidence = campaign.roas > 5 ? 'high' : campaign.roas > 3 ? 'medium' : 'low';
    
    // Calcular multiplicador según período de forecast
    const forecastMultipliers: Record<string, number> = {
      '7d': 0.23,
      '14d': 0.46,
      '30d': 1,
      '60d': 2,
      '90d': 3,
    };
    const multiplier = forecastMultipliers[forecastPeriod] || 1;
    
    const currentLeads = campaign.leadsGenerated;
    const currentRevenue = campaign.spend * campaign.roas;
    const forecastedLeads = Math.round(currentLeads * multiplier * (1 + growthRate / 100));
    const forecastedRevenue = Math.round(currentRevenue * multiplier * (1 + growthRate / 100));
    
    const recommendations: string[] = [];
    if (forecastedLeads > currentLeads * 1.5) {
      recommendations.push('Considera aumentar la capacidad de atención para manejar el incremento proyectado de leads.');
    }
    if (campaign.roas > 5) {
      recommendations.push('Esta campaña tiene excelente ROAS. Considera aumentar el presupuesto para maximizar resultados.');
    }
    if (campaign.spend / campaign.budget > 0.8) {
      recommendations.push('La campaña está cerca de agotar su presupuesto. Revisa si necesitas aumentar el límite.');
    }
    
    return {
      campaignId: campaign.id,
      campaignName: campaign.name,
      channel: campaign.channel,
      currentLeads,
      currentRevenue,
      forecastedLeads,
      forecastedRevenue,
      forecastPeriod,
      confidence,
      growthRate,
      trendDirection: growthRate > 0 ? 'up' : 'down',
      recommendations: recommendations.length > 0 ? recommendations : undefined,
    };
  });
  
  // Calcular totales
  const currentTotalLeads = campaigns.reduce((sum, c) => sum + c.currentLeads, 0);
  const currentTotalRevenue = campaigns.reduce((sum, c) => sum + c.currentRevenue, 0);
  const totalForecastedLeads = campaigns.reduce((sum, c) => sum + c.forecastedLeads, 0);
  const totalForecastedRevenue = campaigns.reduce((sum, c) => sum + c.forecastedRevenue, 0);
  const growthPercentage = currentTotalLeads > 0 
    ? ((totalForecastedLeads - currentTotalLeads) / currentTotalLeads) * 100 
    : 0;
  
  // Calcular recomendación de recursos
  const avgLeadsPerWeek = currentTotalLeads / 4; // Asumiendo 4 semanas
  const forecastedLeadsPerWeek = totalForecastedLeads / (forecastPeriod === '7d' ? 1 : forecastPeriod === '14d' ? 2 : forecastPeriod === '30d' ? 4 : forecastPeriod === '60d' ? 8 : 12);
  const capacityIncrease = ((forecastedLeadsPerWeek - avgLeadsPerWeek) / avgLeadsPerWeek) * 100;
  
  let capacityAdjustment: 'increase' | 'decrease' | 'maintain' = 'maintain';
  let capacityMessage = 'Tu capacidad actual es adecuada para el forecast proyectado.';
  let suggestedCapacity: number | undefined;
  
  if (capacityIncrease > 20) {
    capacityAdjustment = 'increase';
    const currentCapacity = Math.ceil(avgLeadsPerWeek);
    suggestedCapacity = Math.ceil(forecastedLeadsPerWeek * 1.2); // 20% de buffer
    capacityMessage = `Se proyecta un aumento del ${capacityIncrease.toFixed(0)}% en leads. Considera aumentar tu capacidad de atención.`;
  } else if (capacityIncrease < -20) {
    capacityAdjustment = 'decrease';
    capacityMessage = `Se proyecta una disminución del ${Math.abs(capacityIncrease).toFixed(0)}% en leads. Puedes ajustar recursos si es necesario.`;
  }
  
  // Generar insights
  const insights: string[] = [];
  
  // Helper function to format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  const topCampaign = campaigns.reduce((top, c) => 
    c.forecastedRevenue > (top?.forecastedRevenue || 0) ? c : top, 
    campaigns[0] || null
  );
  
  if (topCampaign) {
    insights.push(
      `La campaña "${topCampaign.campaignName}" tiene el mayor potencial de generación de ingresos (${formatCurrency(topCampaign.forecastedRevenue)}).`
    );
  }
  
  if (totalForecastedLeads > currentTotalLeads * 1.3) {
    insights.push(
      `Se proyecta un crecimiento del ${growthPercentage.toFixed(0)}% en leads. Asegúrate de tener suficiente capacidad para atenderlos.`
    );
  }
  
  if (campaigns.filter(c => c.confidence === 'high').length > 0) {
    insights.push(
      `${campaigns.filter(c => c.confidence === 'high').length} campaña(s) tienen alta confianza en el forecast. Puedes confiar en estas proyecciones.`
    );
  }
  
  const snapshot: ForecastSnapshot = {
    period,
    forecastPeriod,
    totalForecastedLeads,
    totalForecastedRevenue,
    currentTotalLeads,
    currentTotalRevenue,
    growthPercentage,
    campaigns,
    resourceRecommendations: {
      capacityAdjustment,
      message: capacityMessage,
      suggestedCapacity,
    },
    insights,
    generatedAt: new Date().toISOString(),
  };
  
  return snapshot;
}

// User Story 2: Roadmap IA de Activaciones Sugeridas
export async function fetchAIRoadmap(
  period: MarketingOverviewPeriod,
  roadmapPeriod: '30d' | '60d' | '90d' = '30d',
  strategicProfile?: StrategicProfile | null
): Promise<AIRoadmapSnapshot> {
  await simulateLatency(null, 350);
  
  // Obtener datos de campañas y eventos
  const [activeCampaigns, upcomingEvents] = await Promise.all([
    fetchActiveCampaigns(),
    fetchUpcomingEvents(),
  ]);
  
  // Generar activaciones sugeridas basadas en el perfil estratégico y campañas
  const activations: SuggestedActivation[] = [];
  const now = new Date();
  
  // Calcular consistencia basada en eventos existentes
  const eventsInPeriod = upcomingEvents.filter(e => {
    const eventDate = new Date(e.date);
    const daysDiff = Math.floor((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff >= 0 && daysDiff <= (roadmapPeriod === '30d' ? 30 : roadmapPeriod === '60d' ? 60 : 90);
  });
  
  const consistencyScore = Math.min(100, 60 + (eventsInPeriod.length * 8)); // Base 60 + 8 por evento
  
  // Sugerir retos basados en campañas activas
  if (activeCampaigns.length > 0) {
    const campaign = activeCampaigns[0];
    const retoDate = new Date(now);
    retoDate.setDate(now.getDate() + 7); // 7 días desde ahora
    
    activations.push({
      id: 'activation-reto-1',
      type: 'reto',
      title: 'Reto de 7 días: Transformación Express',
      description: 'Lanza un reto de 7 días que se alinee con tu campaña activa para generar engagement y leads cualificados.',
      suggestedDate: retoDate.toISOString(),
      priority: 'high',
      estimatedImpact: {
        leads: 50,
        engagement: 500,
        reach: 2000,
      },
      rationale: 'Los retos generan alto engagement y mantienen a tu audiencia activa. Este reto se alinea con tu campaña actual.',
      targetAudience: 'Seguidores activos y leads recientes',
      duration: '7 días',
      preparationTime: '2-3 días',
      relatedCampaigns: [campaign.id],
      status: 'suggested',
      consistencyScore: 85,
    });
  }
  
  // Sugerir colaboración
  const colaboracionDate = new Date(now);
  colaboracionDate.setDate(now.getDate() + 14);
  
  activations.push({
    id: 'activation-colab-1',
    type: 'colaboracion',
    title: 'Colaboración con Influencer Fitness',
    description: 'Colabora con un influencer o entrenador del sector para ampliar tu alcance y atraer nueva audiencia.',
    suggestedDate: colaboracionDate.toISOString(),
    priority: 'medium',
    estimatedImpact: {
      leads: 80,
      engagement: 800,
      reach: 5000,
    },
    rationale: 'Las colaboraciones son efectivas para llegar a nuevas audiencias y aumentar tu autoridad en el sector.',
    targetAudience: 'Nueva audiencia y seguidores del colaborador',
    duration: '1 día',
    preparationTime: '1 semana',
    status: 'suggested',
    consistencyScore: 75,
  });
  
  // Sugerir live
  const liveDate = new Date(now);
  liveDate.setDate(now.getDate() + 5);
  
  activations.push({
    id: 'activation-live-1',
    type: 'live',
    title: 'Live: Q&A sobre Entrenamiento Personalizado',
    description: 'Realiza un live respondiendo preguntas de tu audiencia sobre entrenamiento personalizado y nutrición.',
    suggestedDate: liveDate.toISOString(),
    priority: 'high',
    estimatedImpact: {
      leads: 30,
      engagement: 600,
      reach: 1500,
    },
    rationale: 'Los lives generan alta interacción y ayudan a construir relación con tu audiencia. Perfecto para mantener consistencia.',
    targetAudience: 'Seguidores activos y comunidad',
    duration: '1 hora',
    preparationTime: '1 día',
    status: 'suggested',
    consistencyScore: 90,
  });
  
  // Sugerir webinar si hay campañas activas
  if (activeCampaigns.some(c => c.objective === 'Leads')) {
    const webinarDate = new Date(now);
    webinarDate.setDate(now.getDate() + 21);
    
    activations.push({
      id: 'activation-webinar-1',
      type: 'webinar',
      title: 'Webinar: Cómo Crear tu Rutina Perfecta',
      description: 'Webinar educativo que puede servir como lead magnet y generar leads cualificados.',
      suggestedDate: webinarDate.toISOString(),
      priority: 'medium',
      estimatedImpact: {
        leads: 100,
        engagement: 400,
        revenue: 2000,
      },
      rationale: 'Los webinars son excelentes para generar leads cualificados y demostrar tu expertise.',
      targetAudience: 'Leads fríos y audiencia interesada',
      duration: '1 hora',
      preparationTime: '1 semana',
      status: 'suggested',
      consistencyScore: 80,
    });
  }
  
  // Sugerir challenge
  const challengeDate = new Date(now);
  challengeDate.setDate(now.getDate() + 10);
  
  activations.push({
    id: 'activation-challenge-1',
    type: 'challenge',
    title: 'Challenge de 5 días: Hábitos Saludables',
    description: 'Challenge corto y accionable que motive a tu audiencia a adoptar hábitos saludables.',
    suggestedDate: challengeDate.toISOString(),
    priority: 'medium',
    estimatedImpact: {
      leads: 40,
      engagement: 700,
      reach: 2500,
    },
    rationale: 'Los challenges cortos tienen alta participación y ayudan a mantener el engagement constante.',
    targetAudience: 'Seguidores y comunidad activa',
    duration: '5 días',
    preparationTime: '3 días',
    status: 'suggested',
    consistencyScore: 88,
  });
  
  // Ordenar por prioridad y fecha
  activations.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return new Date(a.suggestedDate).getTime() - new Date(b.suggestedDate).getTime();
  });
  
  // Próxima activación sugerida (la primera)
  const nextSuggestedActivation = activations.find(a => a.status === 'suggested') || activations[0];
  
  // Generar recomendaciones
  const recommendations: string[] = [];
  if (consistencyScore < 70) {
    recommendations.push('Tu frecuencia de activaciones es baja. Intenta programar al menos 2-3 activaciones por mes.');
  }
  if (activations.filter(a => a.type === 'live').length === 0) {
    recommendations.push('Considera agregar lives regulares (semanal o quincenal) para mantener alta interacción.');
  }
  if (activations.filter(a => a.type === 'reto' || a.type === 'challenge').length < 2) {
    recommendations.push('Los retos y challenges generan alto engagement. Programa al menos uno cada 2 semanas.');
  }
  recommendations.push('Mantén un mix de activaciones: educativas (webinars), de engagement (lives) y de acción (retos/challenges).');
  
  // Generar insights
  const insights: string[] = [];
  insights.push(`Tu score de consistencia actual es ${consistencyScore}/100. ${consistencyScore >= 80 ? 'Excelente trabajo manteniendo activaciones regulares.' : 'Puedes mejorar programando más activaciones.'}`);
  
  const highPriorityCount = activations.filter(a => a.priority === 'high').length;
  if (highPriorityCount > 0) {
    insights.push(`Tienes ${highPriorityCount} activación(es) de alta prioridad sugeridas. Estas deberían ser tu foco principal.`);
  }
  
  const totalEstimatedLeads = activations.reduce((sum, a) => sum + (a.estimatedImpact.leads || 0), 0);
  if (totalEstimatedLeads > 0) {
    insights.push(`Si ejecutas todas las activaciones sugeridas, podrías generar aproximadamente ${totalEstimatedLeads} leads adicionales.`);
  }
  
  const snapshot: AIRoadmapSnapshot = {
    period,
    roadmapPeriod,
    activations,
    consistencyScore,
    insights,
    recommendations,
    generatedAt: new Date().toISOString(),
    nextSuggestedActivation,
  };
  
  return snapshot;
}

// User Story 1: Detectar Huecos Críticos en Calendario de Marketing
export async function fetchMarketingCalendarGaps(
  period: MarketingOverviewPeriod,
  strategicProfile?: StrategicProfile | null
): Promise<MarketingCalendarGapsSnapshot> {
  await simulateLatency(null, 300);
  
  const now = new Date();
  const gaps: MarketingCalendarGap[] = [];
  
  // Obtener eventos y campañas para detectar huecos
  const [upcomingEvents, activeCampaigns, weeklyStrategy] = await Promise.all([
    fetchUpcomingEvents(),
    fetchActiveCampaigns(),
    fetchWeeklyAIStrategy(strategicProfile || null, null),
  ]);
  
  // Analizar próximos 30 días para detectar huecos
  const analysisPeriod = 30;
  const eventDates = new Set<string>();
  const campaignDates = new Set<string>();
  
  // Mapear fechas de eventos
  upcomingEvents.forEach(event => {
    const eventDate = new Date(event.date);
    const dateStr = eventDate.toISOString().split('T')[0];
    eventDates.add(dateStr);
  });
  
  // Mapear fechas de campañas activas
  activeCampaigns.forEach(campaign => {
    const startDate = new Date(campaign.startDate);
    const endDate = campaign.endDate ? new Date(campaign.endDate) : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    let currentDate = new Date(startDate);
    while (currentDate <= endDate && currentDate <= new Date(now.getTime() + analysisPeriod * 24 * 60 * 60 * 1000)) {
      const dateStr = currentDate.toISOString().split('T')[0];
      campaignDates.add(dateStr);
      currentDate.setDate(currentDate.getDate() + 1);
    }
  });
  
  // Detectar huecos de contenido (sin publicaciones programadas)
  let consecutiveDaysWithoutContent = 0;
  let lastContentDate: Date | null = null;
  
  for (let i = 0; i < analysisPeriod; i++) {
    const checkDate = new Date(now);
    checkDate.setDate(now.getDate() + i);
    const dateStr = checkDate.toISOString().split('T')[0];
    const dayOfWeek = checkDate.getDay();
    
    // Verificar si hay actividad programada
    const hasEvent = eventDates.has(dateStr);
    const hasCampaign = campaignDates.has(dateStr);
    const hasWeeklyStrategy = weeklyStrategy?.posts.some(post => {
      const postDate = new Date(post.publishDate);
      return postDate.toISOString().split('T')[0] === dateStr;
    });
    
    const hasActivity = hasEvent || hasCampaign || hasWeeklyStrategy;
    
    if (!hasActivity && (dayOfWeek !== 0 && dayOfWeek !== 6)) { // No contar fines de semana
      consecutiveDaysWithoutContent++;
      if (!lastContentDate) {
        lastContentDate = new Date(checkDate);
        lastContentDate.setDate(checkDate.getDate() - 1);
      }
    } else {
      if (consecutiveDaysWithoutContent >= 3) {
        // Hueco crítico detectado
        const gapStartDate = new Date(checkDate);
        gapStartDate.setDate(checkDate.getDate() - consecutiveDaysWithoutContent);
        
        const severity = consecutiveDaysWithoutContent >= 5 ? 'critical' : consecutiveDaysWithoutContent >= 3 ? 'warning' : 'info';
        
        // Generar sugerencias IA para rellenar el hueco
        const suggestedActions: AISuggestion[] = [
          {
            id: `gap-suggestion-${gaps.length}-1`,
            title: 'Programa contenido educativo para esta semana',
            description: `Crea y programa ${consecutiveDaysWithoutContent} piezas de contenido (posts, reels, carruseles) para mantener el engagement durante este período.`,
            impact: severity === 'critical' ? 'high' : 'medium',
            rationale: `Has detectado ${consecutiveDaysWithoutContent} días consecutivos sin contenido programado. Esto puede afectar tu engagement y alcance.`,
            cta: 'Crear contenido ahora',
          },
          {
            id: `gap-suggestion-${gaps.length}-2`,
            title: 'Lanza campaña de reactivación',
            description: 'Aprovecha este período para lanzar una campaña de email o retargeting a leads que no han interactuado recientemente.',
            impact: 'medium',
            rationale: 'Los períodos sin contenido son ideales para reactivar audiencias existentes.',
            cta: 'Crear campaña de reactivación',
          },
        ];
        
        gaps.push({
          id: `gap-${gaps.length + 1}`,
          date: gapStartDate.toISOString(),
          gapType: 'content',
          severity,
          duration: consecutiveDaysWithoutContent,
          description: `${consecutiveDaysWithoutContent} días consecutivos sin contenido programado`,
          impact: {
            estimatedLeads: consecutiveDaysWithoutContent * 5,
            estimatedEngagement: consecutiveDaysWithoutContent * 100,
          },
          suggestedActions,
          context: {
            previousActivity: lastContentDate ? `Última actividad: ${lastContentDate.toLocaleDateString('es-ES')}` : undefined,
            nextActivity: hasActivity ? `Próxima actividad: ${checkDate.toLocaleDateString('es-ES')}` : undefined,
          },
        });
      }
      consecutiveDaysWithoutContent = 0;
      lastContentDate = hasActivity ? new Date(checkDate) : null;
    }
  }
  
  // Detectar huecos de eventos (sin eventos programados en próximas 2 semanas)
  const twoWeeksFromNow = new Date(now);
  twoWeeksFromNow.setDate(now.getDate() + 14);
  
  const eventsInNextTwoWeeks = upcomingEvents.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= now && eventDate <= twoWeeksFromNow;
  });
  
  if (eventsInNextTwoWeeks.length === 0) {
    gaps.push({
      id: `gap-event-${Date.now()}`,
      date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      gapType: 'event',
      severity: 'warning',
      duration: 14,
      description: 'No hay eventos programados en las próximas 2 semanas',
      impact: {
        estimatedLeads: 50,
        estimatedEngagement: 500,
      },
      suggestedActions: [
        {
          id: `gap-event-suggestion-1`,
          title: 'Programa un webinar o live',
          description: 'Los eventos generan alto engagement y leads cualificados. Programa un webinar o live para las próximas 2 semanas.',
          impact: 'high',
          rationale: 'Los eventos son una excelente forma de generar leads y mantener el engagement de tu audiencia.',
          cta: 'Crear evento ahora',
        },
      ],
    });
  }
  
  const criticalGapsCount = gaps.filter(g => g.severity === 'critical').length;
  
  // Generar insights
  const insights: string[] = [];
  if (criticalGapsCount > 0) {
    insights.push(`Tienes ${criticalGapsCount} hueco(s) crítico(s) en tu calendario de marketing. Es importante rellenarlos para mantener el engagement.`);
  }
  if (gaps.length > 0) {
    insights.push(`Se detectaron ${gaps.length} hueco(s) en total. Usa las sugerencias de IA para rellenarlos con contenido relevante.`);
  }
  if (gaps.filter(g => g.gapType === 'content').length > 0) {
    insights.push('Los huecos de contenido pueden afectar tu alcance orgánico. Programa contenido con anticipación.');
  }
  
  const snapshot: MarketingCalendarGapsSnapshot = {
    period,
    gaps: gaps.sort((a, b) => {
      const severityOrder = { critical: 3, warning: 2, info: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    }),
    criticalGapsCount,
    totalGapsCount: gaps.length,
    insights,
    generatedAt: now.toISOString(),
  };
  
  return snapshot;
}

// User Story 2: Sistema de Aprendizaje basado en Feedback
const STORAGE_KEY_FEEDBACK = 'marketing_suggestion_feedback';
const STORAGE_KEY_LEARNING_PROFILE = 'marketing_learning_profile';

export async function submitSuggestionFeedback(
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
  await simulateLatency(null, 200);
  
  const feedback: SuggestionFeedback = {
    id: `feedback-${Date.now()}`,
    suggestionId,
    suggestionType,
    action,
    timestamp: new Date().toISOString(),
    reason,
    modifiedData,
    context,
  };
  
  // Guardar feedback
  try {
    const existingFeedback = JSON.parse(localStorage.getItem(STORAGE_KEY_FEEDBACK) || '[]') as SuggestionFeedback[];
    existingFeedback.push(feedback);
    localStorage.setItem(STORAGE_KEY_FEEDBACK, JSON.stringify(existingFeedback));
    
    // Actualizar perfil de aprendizaje
    await updateLearningProfile(feedback);
  } catch (error) {
    console.error('Error saving feedback:', error);
  }
  
  return feedback;
}

async function updateLearningProfile(feedback: SuggestionFeedback): Promise<void> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_LEARNING_PROFILE);
    let profile: LearningProfile;
    
    if (stored) {
      profile = JSON.parse(stored) as LearningProfile;
    } else {
      profile = {
        trainerId: 'current_user', // En producción, esto vendría del contexto de autenticación
        preferences: {
          preferredImpact: [],
          preferredChannels: [],
          preferredContentTypes: [],
          rejectedPatterns: [],
          acceptedPatterns: [],
        },
        feedbackHistory: [],
        accuracyScore: 50, // Score inicial
        lastUpdated: new Date().toISOString(),
      };
    }
    
    // Agregar feedback al historial
    profile.feedbackHistory.push(feedback);
    
    // Analizar patrones de aceptación/rechazo
    const recentFeedback = profile.feedbackHistory.slice(-50); // Últimos 50 feedbacks
    const accepted = recentFeedback.filter(f => f.action === 'accept');
    const rejected = recentFeedback.filter(f => f.action === 'reject');
    
    // Calcular tasa de aceptación
    const totalActions = accepted.length + rejected.length;
    const acceptanceRate = totalActions > 0 ? (accepted.length / totalActions) * 100 : 50;
    
    // Actualizar score de precisión (más aceptaciones = mayor precisión)
    profile.accuracyScore = Math.min(100, Math.max(0, acceptanceRate));
    
    // Extraer patrones de contenido aceptado/rechazado
    if (feedback.action === 'accept' && feedback.modifiedData) {
      // Analizar qué tipo de contenido se acepta
      const suggestion = feedback.modifiedData as AISuggestion;
      if (suggestion.impact) {
        if (!profile.preferences.preferredImpact.includes(suggestion.impact)) {
          profile.preferences.preferredImpact.push(suggestion.impact);
        }
      }
    }
    
    if (feedback.action === 'reject' && feedback.reason) {
      // Extraer patrones de rechazo
      const reasonLower = feedback.reason.toLowerCase();
      if (!profile.preferences.rejectedPatterns.includes(reasonLower)) {
        profile.preferences.rejectedPatterns.push(reasonLower);
      }
    }
    
    profile.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY_LEARNING_PROFILE, JSON.stringify(profile));
  } catch (error) {
    console.error('Error updating learning profile:', error);
  }
}

export async function getLearningProfile(): Promise<LearningProfile | null> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_LEARNING_PROFILE);
    if (stored) {
      return simulateLatency(JSON.parse(stored) as LearningProfile, 100);
    }
    return simulateLatency(null, 100);
  } catch (error) {
    console.error('Error fetching learning profile:', error);
    return simulateLatency(null, 100);
  }
}

export async function getLearningInsights(): Promise<LearningInsights> {
  await simulateLatency(null, 200);
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY_FEEDBACK);
    const feedbackHistory = stored ? (JSON.parse(stored) as SuggestionFeedback[]) : [];
    
    const accepted = feedbackHistory.filter(f => f.action === 'accept');
    const rejected = feedbackHistory.filter(f => f.action === 'reject');
    const total = feedbackHistory.length;
    
    const acceptanceRate = total > 0 ? (accepted.length / total) * 100 : 0;
    const rejectionRate = total > 0 ? (rejected.length / total) * 100 : 0;
    
    // Analizar tipos más aceptados/rechazados
    const acceptedTypes = new Map<string, number>();
    const rejectedTypes = new Map<string, number>();
    
    accepted.forEach(f => {
      const count = acceptedTypes.get(f.suggestionType) || 0;
      acceptedTypes.set(f.suggestionType, count + 1);
    });
    
    rejected.forEach(f => {
      const count = rejectedTypes.get(f.suggestionType) || 0;
      rejectedTypes.set(f.suggestionType, count + 1);
    });
    
    const topAcceptedTypes = Array.from(acceptedTypes.entries())
      .map(([type, count]) => ({
        type,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    const topRejectedTypes = Array.from(rejectedTypes.entries())
      .map(([type, count]) => ({
        type,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    // Analizar razones de rechazo
    const rejectionReasons = new Map<string, number>();
    rejected.forEach(f => {
      if (f.reason) {
        const count = rejectionReasons.get(f.reason) || 0;
        rejectionReasons.set(f.reason, count + 1);
      }
    });
    
    const commonRejectionReasons = Array.from(rejectionReasons.entries())
      .map(([reason, count]) => ({ reason, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    // Generar sugerencias de mejora
    const improvementSuggestions: string[] = [];
    
    if (acceptanceRate < 50) {
      improvementSuggestions.push('Tu tasa de aceptación es baja. La IA necesita más datos para aprender tus preferencias.');
    }
    
    if (topRejectedTypes.length > 0) {
      improvementSuggestions.push(`Evita sugerencias de tipo "${topRejectedTypes[0].type}" ya que las rechazas frecuentemente.`);
    }
    
    if (commonRejectionReasons.length > 0) {
      improvementSuggestions.push(`Razón común de rechazo: "${commonRejectionReasons[0].reason}". La IA ajustará futuras sugerencias.`);
    }
    
    if (acceptanceRate > 70) {
      improvementSuggestions.push('¡Excelente! La IA está aprendiendo bien tus preferencias. Sigue proporcionando feedback para mantener la precisión.');
    }
    
    return {
      totalFeedback: total,
      acceptanceRate,
      rejectionRate,
      topAcceptedTypes,
      topRejectedTypes,
      commonRejectionReasons,
      improvementSuggestions,
    };
  } catch (error) {
    console.error('Error getting learning insights:', error);
    return {
      totalFeedback: 0,
      acceptanceRate: 0,
      rejectionRate: 0,
      topAcceptedTypes: [],
      topRejectedTypes: [],
      commonRejectionReasons: [],
      improvementSuggestions: [],
    };
  }
}

// Función para aplicar aprendizaje a sugerencias futuras
export function applyLearningToSuggestions(
  suggestions: AISuggestion[],
  learningProfile: LearningProfile | null
): AISuggestion[] {
  if (!learningProfile || learningProfile.feedbackHistory.length === 0) {
    return suggestions;
  }
  
  // Filtrar sugerencias basadas en patrones rechazados
  let filtered = suggestions.filter(suggestion => {
    // Verificar si el tipo de sugerencia ha sido rechazado frecuentemente
    const rejectedCount = learningProfile.feedbackHistory.filter(
      f => f.action === 'reject' && f.suggestionType === 'ai_suggestion'
    ).length;
    
    // Si hay muchas rechazos, ser más conservador
    if (rejectedCount > 10) {
      // Priorizar sugerencias de alto impacto si el entrenador las prefiere
      if (learningProfile.preferences.preferredImpact.includes('high')) {
        return suggestion.impact === 'high';
      }
    }
    
    return true;
  });
  
  // Reordenar basado en preferencias
  filtered.sort((a, b) => {
    // Priorizar impactos preferidos
    const aImpactScore = learningProfile.preferences.preferredImpact.includes(a.impact) ? 1 : 0;
    const bImpactScore = learningProfile.preferences.preferredImpact.includes(b.impact) ? 1 : 0;
    
    if (aImpactScore !== bImpactScore) {
      return bImpactScore - aImpactScore;
    }
    
    // Mantener orden original si no hay preferencias claras
    return 0;
  });
  
  return filtered;
}

// User Story 1: Experiments API
const STORAGE_KEY_EXPERIMENTS = 'marketing_experiments';

export async function fetchExperiments(): Promise<ExperimentsSnapshot> {
  await simulateLatency(null, 200);

  try {
    const stored = localStorage.getItem(STORAGE_KEY_EXPERIMENTS);
    const experiments: MarketingExperiment[] = stored ? JSON.parse(stored) : [];

    // Calcular estadísticas
    const totalCount = experiments.length;
    const activeCount = experiments.filter((e) => e.status === 'active').length;
    const completedCount = experiments.filter((e) => e.status === 'completed').length;
    const successfulCount = experiments.filter((e) => e.status === 'completed' && e.results.success).length;

    // Top 3 experimentos más exitosos (basado en impacto positivo en KPIs)
    const topPerformingExperiments = experiments
      .filter((e) => e.status === 'completed' && e.results.success)
      .sort((a, b) => {
        const aImpact = a.kpiImpacts.reduce((sum, kpi) => sum + (kpi.changePercentage > 0 ? kpi.changePercentage : 0), 0);
        const bImpact = b.kpiImpacts.reduce((sum, kpi) => sum + (kpi.changePercentage > 0 ? kpi.changePercentage : 0), 0);
        return bImpact - aImpact;
      })
      .slice(0, 3);

    // Generar insights
    const insights: string[] = [];
    if (successfulCount > 0) {
      insights.push(
        `${successfulCount} de ${completedCount} experimentos completados fueron exitosos. Considera repetir los experimentos exitosos.`
      );
    }
    if (topPerformingExperiments.length > 0) {
      insights.push(
        `Tu mejor experimento fue "${topPerformingExperiments[0].name}". Analiza qué lo hizo exitoso y aplícalo a otros experimentos.`
      );
    }
    if (activeCount > 0) {
      insights.push(`Tienes ${activeCount} experimento(s) activo(s). Monitorea su progreso regularmente.`);
    }

    const snapshot: ExperimentsSnapshot = {
      experiments,
      totalCount,
      activeCount,
      completedCount,
      successfulCount,
      topPerformingExperiments,
      insights,
      lastUpdated: new Date().toISOString(),
    };

    return snapshot;
  } catch (error) {
    console.error('Error fetching experiments:', error);
    return {
      experiments: [],
      totalCount: 0,
      activeCount: 0,
      completedCount: 0,
      successfulCount: 0,
      topPerformingExperiments: [],
      insights: [],
      lastUpdated: new Date().toISOString(),
    };
  }
}

export async function saveExperiment(experiment: MarketingExperiment): Promise<MarketingExperiment> {
  await simulateLatency(null, 200);

  try {
    const stored = localStorage.getItem(STORAGE_KEY_EXPERIMENTS);
    const experiments: MarketingExperiment[] = stored ? JSON.parse(stored) : [];

    const existingIndex = experiments.findIndex((e) => e.id === experiment.id);
    if (existingIndex >= 0) {
      experiments[existingIndex] = { ...experiment, updatedAt: new Date().toISOString() };
    } else {
      experiments.push(experiment);
    }

    localStorage.setItem(STORAGE_KEY_EXPERIMENTS, JSON.stringify(experiments));
    return experiment;
  } catch (error) {
    console.error('Error saving experiment:', error);
    throw error;
  }
}

export async function updateExperiment(
  experimentId: string,
  updates: Partial<MarketingExperiment>
): Promise<MarketingExperiment> {
  await simulateLatency(null, 200);

  try {
    const stored = localStorage.getItem(STORAGE_KEY_EXPERIMENTS);
    const experiments: MarketingExperiment[] = stored ? JSON.parse(stored) : [];

    const existingIndex = experiments.findIndex((e) => e.id === experimentId);
    if (existingIndex < 0) {
      throw new Error('Experiment not found');
    }

    experiments[existingIndex] = {
      ...experiments[existingIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY_EXPERIMENTS, JSON.stringify(experiments));
    return experiments[existingIndex];
  } catch (error) {
    console.error('Error updating experiment:', error);
    throw error;
  }
}

// User Story 2: Metric Drop Tips API
export async function fetchMetricDropTips(
  kpis: MarketingKPI[],
  strategicProfile?: StrategicProfile | null
): Promise<MetricDropTipsSnapshot> {
  await simulateLatency(null, 300);

  const tips: MetricDropTip[] = [];
  const now = new Date().toISOString();

  // Analizar KPIs que han caído
  kpis.forEach((kpi) => {
    if (kpi.trendDirection === 'down' && kpi.changePercentage && kpi.changePercentage < 0) {
      const dropPercentage = Math.abs(kpi.changePercentage);
      let severity: MetricDropSeverity = 'moderate';

      if (dropPercentage > 30) {
        severity = 'critical';
      } else if (dropPercentage > 15) {
        severity = 'warning';
      }

      // Calcular valor anterior (aproximado)
      const previousValue = kpi.value / (1 + kpi.changePercentage / 100);

      // Generar tip específico según el KPI
      let tip = '';
      let actionItems: string[] = [];
      let rationale = '';

      switch (kpi.id) {
        case 'leads':
          tip = strategicProfile?.tone === 'motivacional'
            ? '¡No te desanimes! Los leads pueden fluctuar. Enfócate en crear contenido de alto valor que resuene con tu audiencia objetivo.'
            : strategicProfile?.tone === 'profesional'
            ? 'La caída en leads requiere un análisis sistemático. Revisa el targeting de tus campañas y optimiza los puntos de entrada.'
            : 'Los leads han bajado. Es momento de revisar tus estrategias de captación y ajustar el enfoque.';
          actionItems = [
            'Revisa el targeting de tus campañas activas',
            'Optimiza las landing pages y CTAs',
            'Crea contenido educativo que atraiga a tu buyer persona',
            'Considera lanzar una campaña de retargeting',
          ];
          rationale = 'La caída en leads puede deberse a cambios en el algoritmo, competencia o targeting. Estos ajustes ayudan a recuperar el volumen.';
          break;

        case 'funnel-revenue':
          tip = strategicProfile?.tone === 'motivacional'
            ? '¡Las ventas pueden tener altibajos! Enfócate en optimizar los puntos de fricción en tu funnel y mejorar la experiencia del cliente.'
            : 'La caída en revenue requiere optimización del funnel. Analiza cada etapa y elimina fricciones.';
          actionItems = [
            'Analiza las tasas de conversión por etapa del funnel',
            'Optimiza las páginas de venta y checkout',
            'Mejora la secuencia de emails de nurturing',
            'Revisa los precios y ofertas',
          ];
          rationale = 'El revenue del funnel puede caer por múltiples factores. Optimizar cada etapa mejora la conversión general.';
          break;

        case 'email-ctr':
          tip = strategicProfile?.tone === 'educativo'
            ? 'El CTR de email refleja el engagement de tu audiencia. Prueba diferentes asuntos, horarios y formatos para mejorar la apertura.'
            : 'El CTR de email ha bajado. Experimenta con asuntos más atractivos y horarios de envío.';
          actionItems = [
            'Prueba diferentes asuntos de email (A/B testing)',
            'Optimiza los horarios de envío',
            'Segmenta mejor tu audiencia',
            'Mejora el contenido del email para que sea más relevante',
          ];
          rationale = 'El CTR depende de la relevancia y timing. Estos ajustes mejoran la apertura y clics.';
          break;

        case 'roas':
          tip = strategicProfile?.tone === 'directo'
            ? 'ROAS bajo = campañas no rentables. Pausa las que no funcionan y aumenta presupuesto en las que sí.'
            : 'El ROAS ha bajado. Revisa tus campañas y optimiza las que tienen mejor rendimiento.';
          actionItems = [
            'Pausa campañas con ROAS bajo',
            'Aumenta presupuesto en campañas con buen ROAS',
            'Optimiza las audiencias y creatividades',
            'Revisa el tracking y atribución',
          ];
          rationale = 'Un ROAS bajo indica que las campañas no son rentables. Optimizar y reasignar presupuesto mejora los resultados.';
          break;

        case 'social-growth':
          tip = strategicProfile?.tone === 'inspirador'
            ? 'El crecimiento en redes requiere consistencia y autenticidad. Crea contenido que inspire y conecte con tu comunidad.'
            : 'El crecimiento en redes ha bajado. Aumenta la frecuencia de publicación y mejora el engagement.';
          actionItems = [
            'Aumenta la frecuencia de publicación',
            'Crea contenido más interactivo (polls, preguntas)',
            'Responde a todos los comentarios',
            'Colabora con otros creadores o influencers',
          ];
          rationale = 'El crecimiento orgánico depende de la consistencia y engagement. Estas acciones mejoran la visibilidad.';
          break;

        default:
          tip = 'Esta métrica ha bajado. Revisa las estrategias relacionadas y ajusta según sea necesario.';
          actionItems = ['Analiza las causas de la caída', 'Ajusta las estrategias relacionadas', 'Monitorea de cerca'];
          rationale = 'La caída requiere análisis y ajustes estratégicos.';
      }

      // Adaptar tip según fortalezas del entrenador
      if (strategicProfile?.strengths && strategicProfile.strengths.length > 0) {
        const strengths = strategicProfile.strengths.slice(0, 2).join(' y ');
        tip += ` Considera usar tus fortalezas en ${strengths} para mejorar esta métrica.`;
      }

      // Determinar impacto esperado
      const expectedImpact: 'high' | 'medium' | 'low' =
        severity === 'critical' ? 'high' : severity === 'warning' ? 'medium' : 'low';

      // Prioridad (1 = más urgente)
      const priority = severity === 'critical' ? 1 : severity === 'warning' ? 2 : 3;

      tips.push({
        id: `tip-${kpi.id}-${Date.now()}`,
        kpiId: kpi.id,
        kpiLabel: kpi.label,
        currentValue: kpi.value,
        previousValue,
        dropPercentage,
        severity,
        tip,
        actionItems,
        expectedImpact,
        adaptedToStyle: {
          tone: strategicProfile?.tone,
          specialty: strategicProfile?.specialty,
          strengths: strategicProfile?.strengths,
        },
        rationale,
        priority,
        createdAt: now,
      });
    }
  });

  // Ordenar por prioridad
  tips.sort((a, b) => a.priority - b.priority);

  // Calcular estadísticas
  const criticalCount = tips.filter((t) => t.severity === 'critical').length;
  const warningCount = tips.filter((t) => t.severity === 'warning').length;
  const moderateCount = tips.filter((t) => t.severity === 'moderate').length;

  // Generar insights
  const insights: string[] = [];
  if (criticalCount > 0) {
    insights.push(
      `Tienes ${criticalCount} métrica(s) con caídas críticas. Es importante actuar rápidamente para evitar mayores impactos.`
    );
  }
  if (tips.length > 0) {
    insights.push(
      `Se generaron ${tips.length} tip(s) específico(s) adaptados a tu estilo (${strategicProfile?.tone || 'general'}).`
    );
  }
  if (strategicProfile?.strengths && strategicProfile.strengths.length > 0) {
    insights.push(
      `Los tips están adaptados a tus fortalezas: ${strategicProfile.strengths.slice(0, 2).join(', ')}. Úsalas para mejorar las métricas.`
    );
  }

  const snapshot: MetricDropTipsSnapshot = {
    tips,
    totalCount: tips.length,
    criticalCount,
    warningCount,
    moderateCount,
    insights,
    lastUpdated: now,
  };

  return snapshot;
}


