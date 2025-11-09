import {
  AcquisitionAISuggestion,
  AcquisitionCampaign,
  AcquisitionEvent,
  AcquisitionFunnelPerformance,
  AcquisitionKPI,
  AcquisitionWorkspaceBlueprint,
  FunnelsAcquisitionPeriod,
  WorkspaceAutomation,
  WorkspaceFocusMetric,
  WorkspaceResource,
} from '../types';

const periodMultipliers: Record<FunnelsAcquisitionPeriod, number> = {
  '7d': 0.34,
  '30d': 1,
  '90d': 2.7,
};

const baseKpis: AcquisitionKPI[] = [
  {
    id: 'leads',
    label: 'Leads captados',
    value: 540,
    changePercentage: 22,
    period: '30d',
    format: 'number',
    target: 650,
    trendDirection: 'up',
  },
  {
    id: 'funnel-revenue',
    label: 'Ventas atribuidas a funnels',
    value: 58200,
    changePercentage: 16,
    period: '30d',
    format: 'currency',
    trendDirection: 'up',
  },
  {
    id: 'email-ctr',
    label: 'CTR emails nurturing',
    value: 8.4,
    changePercentage: 2.8,
    period: '30d',
    format: 'percentage',
    trendDirection: 'up',
  },
  {
    id: 'roas',
    label: 'ROAS campañas pagadas',
    value: 4.6,
    changePercentage: -0.4,
    period: '30d',
    format: 'number',
    trendDirection: 'down',
  },
  {
    id: 'social-growth',
    label: 'Crecimiento orgánico redes',
    value: 11.2,
    changePercentage: 3.5,
    period: '30d',
    format: 'percentage',
    trendDirection: 'up',
  },
];

const campaigns: AcquisitionCampaign[] = [
  {
    id: 'cmp-fa-1',
    name: 'Meta Ads · Evergreen TOFU',
    channel: 'Meta Ads',
    objective: 'Leads fríos',
    status: 'active',
    spend: 3200,
    budget: 4000,
    roas: 3.8,
    ctr: 4.1,
    leadsGenerated: 276,
    qualifiedRate: 0.36,
    startDate: '2025-09-01',
  },
  {
    id: 'cmp-fa-2',
    name: 'Google Ads · Search BOFU',
    channel: 'Google Ads',
    objective: 'Reservas demo',
    status: 'active',
    spend: 2100,
    budget: 2600,
    roas: 6.4,
    ctr: 5.9,
    leadsGenerated: 98,
    qualifiedRate: 0.54,
    startDate: '2025-10-04',
  },
  {
    id: 'cmp-fa-3',
    name: 'Email · Secuencia Lead Magnet',
    channel: 'Email',
    objective: 'Activación nurturing',
    status: 'scheduled',
    spend: 620,
    budget: 900,
    roas: 4.1,
    ctr: 9.3,
    leadsGenerated: 164,
    qualifiedRate: 0.41,
    startDate: '2025-11-10',
    endDate: '2025-12-05',
  },
];

const funnels: AcquisitionFunnelPerformance[] = [
  {
    id: 'fun-fa-1',
    name: 'Lead magnet → Secuencia → Demo',
    stage: 'MOFU',
    revenue: 28800,
    conversionRate: 6.1,
    velocityDays: 10,
    growthPercentage: 19,
    qualifiedLeads: 184,
  },
  {
    id: 'fun-fa-2',
    name: 'Ads UGC → Landing → Trial',
    stage: 'TOFU',
    revenue: 18200,
    conversionRate: 3.6,
    velocityDays: 8,
    growthPercentage: 24,
    qualifiedLeads: 142,
  },
  {
    id: 'fun-fa-3',
    name: 'Referidos → Offer Call → Cierre',
    stage: 'BOFU',
    revenue: 6400,
    conversionRate: 9.8,
    velocityDays: 5,
    growthPercentage: 11,
    qualifiedLeads: 86,
  },
];

const events: AcquisitionEvent[] = [
  {
    id: 'evt-fa-1',
    title: 'Webinar: Construye tu funnel evergreen en 7 días',
    date: '2025-11-18T16:00:00Z',
    type: 'webinar',
    status: 'registration_open',
    targetAudience: 'Leads fríos & MQLs',
    registrations: 312,
    goal: 420,
    host: 'Growth Squad',
    funnelLink: '/dashboard/marketing/funnels',
  },
  {
    id: 'evt-fa-2',
    title: 'Workshop: Landing pages que convierten al 25%',
    date: '2025-11-27T15:00:00Z',
    type: 'workshop',
    status: 'scheduled',
    targetAudience: 'Clientes trial',
    registrations: 74,
    goal: 160,
    host: 'Performance Team',
    funnelLink: '/dashboard/marketing/landing-pages-simples',
  },
  {
    id: 'evt-fa-3',
    title: 'Challenge 5 días: Lanza un nuevo lead magnet',
    date: '2025-12-09T10:00:00Z',
    type: 'challenge',
    status: 'draft',
    targetAudience: 'Community & audiencias orgánicas',
    registrations: 0,
    goal: 500,
    host: 'Community Builders',
    funnelLink: '/dashboard/marketing/lead-magnets',
  },
];

const aiSuggestions: AcquisitionAISuggestion[] = [
  {
    id: 'ai-fa-1',
    title: 'Lanza hoy variante de landing basada en prueba social',
    description: 'Duplica tu landing top y añade módulo de testimonios de MQLs que cerraron en <14 días.',
    impact: 'high',
    rationale: 'El funnel evergreen tiene 184 SQLs en cola. Se proyecta +12% en conversiones a demo.',
    cta: 'Crear versión con IA',
  },
  {
    id: 'ai-fa-2',
    title: 'Activa secuencia de urgencia para leads calientes',
    description: 'Segmenta leads con 3+ interacciones y dispara email + WhatsApp en 6h.',
    impact: 'medium',
    rationale: 'Hay 86 leads con intención alta sin contacto comercial en las últimas 48h.',
    cta: 'Generar flujo ahora',
  },
  {
    id: 'ai-fa-3',
    title: 'Duplica campaña de search a keywords long tail',
    description: 'Usa histórico de conversiones y crea grupo específico de intención transaccional.',
    impact: 'medium',
    rationale: 'ROAS actual 6.4x. Proyección +18% leads cualificados manteniendo CPA.',
    cta: 'Clonar campaña con IA',
  },
];

const workspaceFocus = (metrics: WorkspaceFocusMetric[]): WorkspaceFocusMetric[] => metrics;

const workspaceAutomations = (automations: WorkspaceAutomation[]): WorkspaceAutomation[] => automations;

const workspaceResources = (resources: WorkspaceResource[]): WorkspaceResource[] => resources;

const workspaceBlueprints: AcquisitionWorkspaceBlueprint[] = [
  {
    id: 'funnels-builder',
    title: 'Funnels & Landing Pages Builder',
    description:
      'Diseña, prueba y lanza funnels completos con landing pages optimizadas, secuencias de follow-up y medición end-to-end.',
    focusMetrics: workspaceFocus([
      {
        id: 'conversion-rate',
        label: 'Conversión promedio funnel',
        value: '6.1%',
        helper: 'Meta: 7.5%',
        change: 1.2,
        trend: 'up',
      },
      {
        id: 'velocity',
        label: 'Velocidad de cierre',
        value: '10 días',
        helper: 'Objetivo < 9 días',
        trend: 'neutral',
      },
      {
        id: 'launches',
        label: 'Funnels activos',
        value: '4',
        helper: '2 nuevos lanzamientos esta semana',
        trend: 'up',
      },
    ]),
    recommendedActions: [
      {
        id: 'action-funnels-1',
        title: 'Duplicar funnel evergreen y testear versión B',
        description: 'Clona tu funnel con mejor ROAS y activa test A/B en hero + oferta de la landing.',
        cta: 'Abrir en builder',
        href: '/dashboard/marketing/funnels',
      },
      {
        id: 'action-funnels-2',
        title: 'Sincronizar funnels con campañas pagadas',
        description: 'Asigna UTMs y automatiza cambios creativos según etapa TOFU/MOFU/BOFU.',
        cta: 'Configurar automatización',
        href: '/dashboard/marketing/anuncios',
      },
    ],
    automations: workspaceAutomations([
      {
        id: 'automation-funnels-1',
        title: 'Alertas instantáneas por caída de conversión',
        description: 'Recibe alertas cuando la conversión caiga >15% versus los últimos 7 días.',
        impact: 'high',
      },
      {
        id: 'automation-funnels-2',
        title: 'Pruebas dinámicas de headlines',
        description: 'La IA rota headlines en landing según segmentos que convierten mejor.',
        impact: 'medium',
      },
    ]),
    resources: workspaceResources([
      { id: 'resource-funnels-1', label: 'Playbook: Funnel evergreen de alto cierre', href: '/docs/playbooks/funnel-evergreen' },
      { id: 'resource-funnels-2', label: 'Checklist lanzamiento landing', href: '/docs/checklists/landing-launch' },
    ]),
  },
  {
    id: 'lead-magnet-factory',
    title: 'Lead Magnet Factory',
    description:
      'Genera activos de captación en minutos con asistentes IA, flujos de contenido y análisis de performance por magnet.',
    focusMetrics: workspaceFocus([
      {
        id: 'downloads',
        label: 'Descargas últimos 30 días',
        value: '1,820',
        helper: 'Objetivo 2,400',
        trend: 'up',
        change: 18,
      },
      {
        id: 'qualification',
        label: 'Rate de leads cualificados',
        value: '41%',
        helper: '+6 pts vs. mes anterior',
        trend: 'up',
        change: 6,
      },
      {
        id: 'time-to-launch',
        label: 'Tiempo promedio de lanzamiento',
        value: '2.5 días',
        helper: 'Redúcelo a <2 días con plantillas',
        trend: 'down',
      },
    ]),
    recommendedActions: [
      {
        id: 'action-leadmagnet-1',
        title: 'Lanzar magnet temático para audiencia fría',
        description: 'Usa insights de social listening para generar guía descargable en 15 minutos.',
        cta: 'Generar con IA',
        href: '/dashboard/marketing/lead-magnets',
      },
      {
        id: 'action-leadmagnet-2',
        title: 'Activar secuencia nurturing específica',
        description: 'Conecta magnet con secuencia de 5 correos hiperpersonalizados.',
        cta: 'Conectar secuencia',
        href: '/dashboard/automatizacion/secuencias-email',
      },
    ],
    automations: workspaceAutomations([
      {
        id: 'automation-leadmagnet-1',
        title: 'Calificación automática con IA',
        description: 'Clasifica leads según interacción y envía a SDR solo los SQLs listos.',
        impact: 'high',
      },
      {
        id: 'automation-leadmagnet-2',
        title: 'Rotación de magnet por canal',
        description: 'Prioriza magnet más fresco por canal para evitar fatiga de audiencia.',
        impact: 'medium',
      },
    ]),
    resources: workspaceResources([
      { id: 'resource-leadmagnet-1', label: 'Plantillas IA de lead magnet', href: '/docs/playbooks/lead-magnet-factory' },
      { id: 'resource-leadmagnet-2', label: 'Reporte performance magnets', href: '/dashboard/analytics/captacion' },
    ]),
  },
  {
    id: 'segmentacion-audiencias',
    title: 'Segmentación & Audiencias',
    description:
      'Construye audiencias dinámicas, sincroniza datos en todos los canales y activa journeys personalizados.',
    focusMetrics: workspaceFocus([
      {
        id: 'audiences-sync',
        label: 'Audiencias sincronizadas',
        value: '12',
        helper: 'Meta: 15 audiencias activas',
        trend: 'up',
      },
      {
        id: 'lookalike',
        label: 'ROAS lookalike',
        value: '5.2x',
        helper: '+0.8 vs. mes anterior',
        trend: 'up',
        change: 0.8,
      },
      {
        id: 'profile-completeness',
        label: 'Datos enriquecidos',
        value: '78%',
        helper: 'Activa progressive profiling para llegar al 85%',
        trend: 'neutral',
      },
    ]),
    recommendedActions: [
      {
        id: 'action-segmentation-1',
        title: 'Configurar audiencias dinámicas TOFU → BOFU',
        description: 'Mapea journeys por etapa y sincroniza datos con Meta + Google + Email.',
        cta: 'Abrir segmentación',
        href: '/dashboard/audiencias',
      },
      {
        id: 'action-segmentation-2',
        title: 'Activar progressive profiling',
        description: 'Completa atributos críticos vía microformularios + automatizaciones.',
        cta: 'Configurar PF',
        href: '/dashboard/marketing/progressive-profiling',
      },
    ],
    automations: workspaceAutomations([
      {
        id: 'automation-segmentation-1',
        title: 'Actualización automática de audiencias lookalike',
        description: 'Refresca seeds cada 7 días con los mejores clientes cerrados.',
        impact: 'high',
      },
      {
        id: 'automation-segmentation-2',
        title: 'Journey dinámico por intent signals',
        description: 'Envía experiencias personalizadas según comportamiento multi-canal.',
        impact: 'high',
      },
    ]),
    resources: workspaceResources([
      { id: 'resource-segmentation-1', label: 'Guía de segmentación dinámica', href: '/docs/secciones/segmentacion' },
      { id: 'resource-segmentation-2', label: 'Checklist audiencias pagadas', href: '/docs/checklists/paid-audiences' },
    ]),
  },
];

function simulateLatency<T>(data: T, delay = 220): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(JSON.parse(JSON.stringify(data)) as T), delay);
  });
}

export async function fetchFunnelsAcquisitionKPIs(
  period: FunnelsAcquisitionPeriod,
): Promise<AcquisitionKPI[]> {
  const multiplier = periodMultipliers[period];

  const adjusted = baseKpis.map((kpi) => {
    const baseValue = kpi.value;
    let value = baseValue * multiplier;

    if (kpi.format === 'percentage') {
      value = Number((baseValue * Math.max(multiplier, 0.85)).toFixed(1));
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

export async function fetchAcquisitionCampaigns(): Promise<AcquisitionCampaign[]> {
  return simulateLatency(campaigns);
}

export async function fetchAcquisitionTopFunnels(
  period: FunnelsAcquisitionPeriod,
): Promise<AcquisitionFunnelPerformance[]> {
  const multiplier = periodMultipliers[period];

  const adjusted = funnels.map((funnel) => ({
    ...funnel,
    revenue: Math.round(funnel.revenue * multiplier),
    growthPercentage: Number((funnel.growthPercentage * multiplier).toFixed(1)),
    qualifiedLeads: Math.round(funnel.qualifiedLeads * multiplier),
  }));

  return simulateLatency(adjusted);
}

export async function fetchAcquisitionEvents(): Promise<AcquisitionEvent[]> {
  return simulateLatency(events);
}

export async function fetchAcquisitionAISuggestions(): Promise<AcquisitionAISuggestion[]> {
  return simulateLatency(aiSuggestions);
}

export async function fetchWorkspaceBlueprints(): Promise<AcquisitionWorkspaceBlueprint[]> {
  return simulateLatency(workspaceBlueprints);
}



