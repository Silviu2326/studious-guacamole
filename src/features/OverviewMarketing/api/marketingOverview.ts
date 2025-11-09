import {
  AISuggestion,
  CampaignPerformance,
  FunnelPerformance,
  MarketingKPI,
  MarketingOverviewPeriod,
  SocialGrowthMetric,
  UpcomingEvent,
} from '../types';

const periodMultipliers: Record<MarketingOverviewPeriod, number> = {
  '7d': 0.35,
  '30d': 1,
  '90d': 2.6,
};

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
  },
  {
    id: 'funnel-revenue',
    label: 'Ventas por Funnels',
    value: 46800,
    changePercentage: 12,
    period: '30d',
    format: 'currency',
    trendDirection: 'up',
  },
  {
    id: 'email-ctr',
    label: 'CTR Email Marketing',
    value: 7.8,
    changePercentage: 2.4,
    period: '30d',
    format: 'percentage',
    trendDirection: 'up',
  },
  {
    id: 'roas',
    label: 'ROAS Promedio',
    value: 4.2,
    changePercentage: -0.6,
    period: '30d',
    format: 'number',
    trendDirection: 'down',
  },
  {
    id: 'social-growth',
    label: 'Crecimiento Redes',
    value: 9.4,
    changePercentage: 3.1,
    period: '30d',
    format: 'percentage',
    trendDirection: 'up',
  },
];

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

export async function fetchMarketingKPIs(period: MarketingOverviewPeriod): Promise<MarketingKPI[]> {
  const multiplier = periodMultipliers[period];

  const adjusted = baseKpis.map((kpi) => {
    const baseValue = kpi.value;
    let value = baseValue * multiplier;

    if (kpi.format === 'percentage' || ['roas'].includes(kpi.id)) {
      value = Number((baseValue + (multiplier - 1) * 2).toFixed(2));
    } else if (kpi.format === 'currency') {
      value = Math.round(baseValue * multiplier);
    } else {
      value = Math.round(baseValue * multiplier);
    }

    return {
      ...kpi,
      value,
      period,
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

export async function fetchAISuggestions(): Promise<AISuggestion[]> {
  return simulateLatency(aiSuggestions);
}


