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
  LeadRiskAlert,
  FirstSessionConversionMetric,
  SocialMediaMetrics,
  ReferralProgramMetrics,
  FunnelRecommendationRequest,
  FunnelRecommendationResponse,
  RecommendedFunnel,
  BuyerPersona,
  PainPoint,
  FunnelPersonalization,
  CopyAdaptation,
  FavoriteToneConfig,
  FavoriteCTAConfig,
  ToneAndCTAPreset,
  LeadMagnetFormatSuggestion,
  AvatarBasedFormatSuggestions,
  LandingPageCopyGenerationRequest,
  LandingPageCopyGenerationResponse,
  IntelligentFormSuggestionRequest,
  IntelligentFormSuggestion,
  IntelligentForm,
  FormSubmission,
  FunnelExperiment,
  FunnelExperimentType,
  FunnelExperimentStatus,
  FunnelExperimentVariant,
  ExperimentContent,
  AIExperimentSuggestion,
  FunnelPerformanceAnalysis,
  FunnelBottleneck,
  FunnelStageMetrics,
  BottleneckSeverity,
  TrendDirection,
  NurturingRecommendation,
  NurturingRecommendationRequest,
  LeadMagnetResponseAnalysis,
  NurturingStepRecommendation,
  FunnelExportRequest,
  FunnelExportResponse,
  FunnelExportPackage,
  FunnelExportMessage,
  FunnelExportSequence,
  FunnelExportCampaign,
  FunnelExportList,
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

// US-FA-008: Sistema de alertas y tareas automáticas para leads en riesgo
const leadRiskAlerts: LeadRiskAlert[] = [
  {
    id: 'alert-1',
    leadId: 'lead-123',
    leadName: 'María González',
    leadEmail: 'maria.gonzalez@email.com',
    leadPhone: '+34 612 345 678',
    currentStage: 'consulta_solicitada',
    riskLevel: 'high',
    daysSinceLastAction: 5,
    lastActionDate: '2025-01-10T10:00:00Z',
    reason: 'Consulta solicitada hace 5 días pero no se ha agendado',
    suggestedActions: [
      {
        id: 'action-1',
        type: 'whatsapp',
        title: 'Enviar mensaje de seguimiento',
        description: 'Contactar por WhatsApp para recordar la consulta y ofrecer agendar',
        priority: 'high',
        template: 'Hola {{nombre}}, vi que solicitaste una consulta. ¿Te gustaría agendar para esta semana?',
      },
      {
        id: 'action-2',
        type: 'email',
        title: 'Enviar email con información adicional',
        description: 'Enviar email con testimonios y beneficios del entrenamiento personal',
        priority: 'medium',
        template: 'Email template con casos de éxito',
      },
    ],
    createdAt: '2025-01-15T08:00:00Z',
  },
  {
    id: 'alert-2',
    leadId: 'lead-456',
    leadName: 'Carlos Ruiz',
    leadEmail: 'carlos.ruiz@email.com',
    leadPhone: '+34 623 456 789',
    currentStage: 'consulta_realizada',
    riskLevel: 'medium',
    daysSinceLastAction: 3,
    lastActionDate: '2025-01-12T14:30:00Z',
    reason: 'Consulta realizada hace 3 días pero no ha comprado primera sesión',
    suggestedActions: [
      {
        id: 'action-3',
        type: 'llamada',
        title: 'Llamada de seguimiento',
        description: 'Llamar para resolver dudas y ofrecer primera sesión con descuento',
        priority: 'high',
      },
      {
        id: 'action-4',
        type: 'oferta_especial',
        title: 'Enviar oferta especial',
        description: 'Ofrecer 20% de descuento en primera sesión si compra en las próximas 48h',
        priority: 'medium',
      },
    ],
    createdAt: '2025-01-15T08:00:00Z',
  },
  {
    id: 'alert-3',
    leadId: 'lead-789',
    leadName: 'Ana Martínez',
    leadEmail: 'ana.martinez@email.com',
    leadPhone: '+34 634 567 890',
    currentStage: 'primera_sesion_pagada',
    riskLevel: 'low',
    daysSinceLastAction: 7,
    lastActionDate: '2025-01-08T16:00:00Z',
    reason: 'Primera sesión realizada hace 7 días pero no ha comprado plan recurrente',
    suggestedActions: [
      {
        id: 'action-5',
        type: 'email',
        title: 'Enviar email con planes disponibles',
        description: 'Recordar los beneficios de los planes mensuales y bonos',
        priority: 'medium',
      },
      {
        id: 'action-6',
        type: 'whatsapp',
        title: 'Mensaje personalizado',
        description: 'Preguntar cómo fue la sesión y ofrecer plan adaptado',
        priority: 'low',
      },
    ],
    createdAt: '2025-01-15T08:00:00Z',
  },
  {
    id: 'alert-4',
    leadId: 'lead-321',
    leadName: 'Pedro Sánchez',
    leadEmail: 'pedro.sanchez@email.com',
    leadPhone: '+34 645 678 901',
    currentStage: 'consulta_solicitada',
    riskLevel: 'high',
    daysSinceLastAction: 8,
    lastActionDate: '2025-01-07T09:00:00Z',
    reason: 'Consulta solicitada hace 8 días, riesgo alto de pérdida',
    suggestedActions: [
      {
        id: 'action-7',
        type: 'llamada',
        title: 'Llamada urgente',
        description: 'Llamar inmediatamente para recuperar el lead',
        priority: 'high',
      },
      {
        id: 'action-8',
        type: 'oferta_especial',
        title: 'Oferta de último momento',
        description: 'Ofrecer consulta gratuita extendida o descuento especial',
        priority: 'high',
      },
    ],
    createdAt: '2025-01-15T08:00:00Z',
  },
];

export async function fetchLeadRiskAlerts(): Promise<LeadRiskAlert[]> {
  return simulateLatency(leadRiskAlerts);
}

// US-FA-009: Métrica de conversión de primera sesión a cliente con plan recurrente o bono
function generateFirstSessionConversionMetric(
  period: FunnelsAcquisitionPeriod,
): FirstSessionConversionMetric {
  const baseMetrics = {
    '7d': {
      totalFirstSessions: 28,
      convertedToRecurring: 12,
      convertedToBonus: 6,
      averageDaysToConvert: 4.2,
      averageValueRecurring: 89,
      averageValueBonus: 250,
    },
    '30d': {
      totalFirstSessions: 120,
      convertedToRecurring: 52,
      convertedToBonus: 24,
      averageDaysToConvert: 4.5,
      averageValueRecurring: 89,
      averageValueBonus: 250,
    },
    '90d': {
      totalFirstSessions: 340,
      convertedToRecurring: 148,
      convertedToBonus: 68,
      averageDaysToConvert: 4.8,
      averageValueRecurring: 89,
      averageValueBonus: 250,
    },
  };

  const base = baseMetrics[period];
  const totalConverted = base.convertedToRecurring + base.convertedToBonus;
  const conversionRate = (totalConverted / base.totalFirstSessions) * 100;
  const conversionRateRecurring = (base.convertedToRecurring / base.totalFirstSessions) * 100;
  const conversionRateBonus = (base.convertedToBonus / base.totalFirstSessions) * 100;
  const totalRevenue =
    base.convertedToRecurring * base.averageValueRecurring +
    base.convertedToBonus * base.averageValueBonus;

  // Comparación con período anterior
  let previousPeriod: FunnelsAcquisitionPeriod = '7d';
  if (period === '30d') previousPeriod = '7d';
  if (period === '90d') previousPeriod = '30d';

  const previousBase = baseMetrics[previousPeriod];
  const previousTotalConverted = previousBase.convertedToRecurring + previousBase.convertedToBonus;
  const previousConversionRate = (previousTotalConverted / previousBase.totalFirstSessions) * 100;

  const conversionRateChange = conversionRate - previousConversionRate;
  const conversionRateChangePercentage =
    previousConversionRate > 0 ? (conversionRateChange / previousConversionRate) * 100 : 0;
  const totalConvertedChange = totalConverted - previousTotalConverted;
  const totalConvertedChangePercentage =
    previousTotalConverted > 0 ? (totalConvertedChange / previousTotalConverted) * 100 : 0;

  const trendDirection: 'up' | 'down' | 'neutral' =
    conversionRateChange > 1 ? 'up' : conversionRateChange < -1 ? 'down' : 'neutral';

  const suggestions: FirstSessionConversionMetric['suggestions'] = [
    {
      id: 'suggestion-1',
      title: 'Mejorar seguimiento post-primera-sesión',
      description:
        'El 63% de los clientes que no convierten no reciben seguimiento en las primeras 48h. Implementa un sistema de seguimiento automático.',
      impact: 'high',
      category: 'follow_up',
    },
    {
      id: 'suggestion-2',
      title: 'Ofrecer descuento por compra anticipada',
      description:
        'Los clientes que compran plan en los primeros 3 días tienen 40% más retención. Crea una oferta especial para compras inmediatas.',
      impact: 'high',
      category: 'offer',
    },
    {
      id: 'suggestion-3',
      title: 'Optimizar timing de la oferta',
      description:
        'El mejor momento para ofrecer planes es 24-48h después de la primera sesión. Ajusta tu secuencia de seguimiento.',
      impact: 'medium',
      category: 'timing',
    },
    {
      id: 'suggestion-4',
      title: 'Personalizar comunicación según objetivo',
      description:
        'Segmenta tus ofertas según el objetivo del cliente (pérdida de peso, ganancia muscular, etc.) para aumentar conversión.',
      impact: 'medium',
      category: 'communication',
    },
  ];

  return {
    period,
    totalFirstSessions: base.totalFirstSessions,
    convertedToRecurring: base.convertedToRecurring,
    convertedToBonus: base.convertedToBonus,
    totalConverted,
    conversionRate: Number(conversionRate.toFixed(1)),
    conversionRateRecurring: Number(conversionRateRecurring.toFixed(1)),
    conversionRateBonus: Number(conversionRateBonus.toFixed(1)),
    averageDaysToConvert: base.averageDaysToConvert,
    averageValueRecurring: base.averageValueRecurring,
    averageValueBonus: base.averageValueBonus,
    totalRevenue,
    comparison: {
      previousPeriod,
      conversionRateChange: Number(conversionRateChange.toFixed(1)),
      conversionRateChangePercentage: Number(conversionRateChangePercentage.toFixed(1)),
      totalConvertedChange,
      totalConvertedChangePercentage: Number(totalConvertedChangePercentage.toFixed(1)),
      trendDirection,
    },
    suggestions,
  };
}

export async function fetchFirstSessionConversionMetric(
  period: FunnelsAcquisitionPeriod,
): Promise<FirstSessionConversionMetric> {
  return simulateLatency(generateFirstSessionConversionMetric(period));
}

// US-FA-010: Integración con métricas de redes sociales
function generateSocialMediaMetrics(period: FunnelsAcquisitionPeriod): SocialMediaMetrics {
  const baseMetrics = {
    '7d': {
      totalPosts: 12,
      totalEngagement: 2840,
      totalLeads: 18,
      totalInquiries: 42,
      totalTimeInvested: 180,
    },
    '30d': {
      totalPosts: 48,
      totalEngagement: 11200,
      totalLeads: 72,
      totalInquiries: 168,
      totalTimeInvested: 720,
    },
    '90d': {
      totalPosts: 144,
      totalEngagement: 33600,
      totalLeads: 216,
      totalInquiries: 504,
      totalTimeInvested: 2160,
    },
  };

  const base = baseMetrics[period];
  const averageROI = (base.totalLeads * 50) / base.totalTimeInvested; // Asumiendo valor promedio de lead

  const platforms: SocialMediaMetrics['platforms'] = [
    {
      platform: 'instagram',
      postsCount: Math.round(base.totalPosts * 0.45),
      totalEngagement: Math.round(base.totalEngagement * 0.5),
      leadsGenerated: Math.round(base.totalLeads * 0.55),
      inquiriesGenerated: Math.round(base.totalInquiries * 0.5),
      engagementToLeadRate: (Math.round(base.totalLeads * 0.55) / Math.round(base.totalEngagement * 0.5)) * 100,
      timeInvestedMinutes: Math.round(base.totalTimeInvested * 0.4),
      roi: ((Math.round(base.totalLeads * 0.55) * 50) / Math.round(base.totalTimeInvested * 0.4)),
      trendDirection: 'up',
    },
    {
      platform: 'facebook',
      postsCount: Math.round(base.totalPosts * 0.25),
      totalEngagement: Math.round(base.totalEngagement * 0.3),
      leadsGenerated: Math.round(base.totalLeads * 0.25),
      inquiriesGenerated: Math.round(base.totalInquiries * 0.3),
      engagementToLeadRate: (Math.round(base.totalLeads * 0.25) / Math.round(base.totalEngagement * 0.3)) * 100,
      timeInvestedMinutes: Math.round(base.totalTimeInvested * 0.3),
      roi: ((Math.round(base.totalLeads * 0.25) * 50) / Math.round(base.totalTimeInvested * 0.3)),
      trendDirection: 'neutral',
    },
    {
      platform: 'tiktok',
      postsCount: Math.round(base.totalPosts * 0.2),
      totalEngagement: Math.round(base.totalEngagement * 0.15),
      leadsGenerated: Math.round(base.totalLeads * 0.15),
      inquiriesGenerated: Math.round(base.totalInquiries * 0.15),
      engagementToLeadRate: (Math.round(base.totalLeads * 0.15) / Math.round(base.totalEngagement * 0.15)) * 100,
      timeInvestedMinutes: Math.round(base.totalTimeInvested * 0.2),
      roi: ((Math.round(base.totalLeads * 0.15) * 50) / Math.round(base.totalTimeInvested * 0.2)),
      trendDirection: 'up',
    },
    {
      platform: 'youtube',
      postsCount: Math.round(base.totalPosts * 0.1),
      totalEngagement: Math.round(base.totalEngagement * 0.05),
      leadsGenerated: Math.round(base.totalLeads * 0.05),
      inquiriesGenerated: Math.round(base.totalInquiries * 0.05),
      engagementToLeadRate: (Math.round(base.totalLeads * 0.05) / Math.round(base.totalEngagement * 0.05)) * 100,
      timeInvestedMinutes: Math.round(base.totalTimeInvested * 0.1),
      roi: ((Math.round(base.totalLeads * 0.05) * 50) / Math.round(base.totalTimeInvested * 0.1)),
      trendDirection: 'down',
    },
  ];

  const topPosts: SocialMediaMetrics['topPosts'] = [
    {
      id: 'post-1',
      platform: 'instagram',
      postId: 'ig-12345',
      content: 'Transformación completa en 12 semanas 💪',
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      engagement: {
        likes: 450,
        comments: 32,
        shares: 18,
        saves: 67,
        totalEngagement: 567,
      },
      leadsGenerated: 8,
      inquiriesGenerated: 15,
      engagementToLeadRate: (8 / 567) * 100,
      timeInvestedMinutes: 25,
      roi: (8 * 50) / 25,
    },
    {
      id: 'post-2',
      platform: 'facebook',
      postId: 'fb-67890',
      content: 'Nuevo programa de entrenamiento personalizado',
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      engagement: {
        likes: 320,
        comments: 45,
        shares: 22,
        saves: 12,
        totalEngagement: 399,
      },
      leadsGenerated: 6,
      inquiriesGenerated: 12,
      engagementToLeadRate: (6 / 399) * 100,
      timeInvestedMinutes: 20,
      roi: (6 * 50) / 20,
    },
    {
      id: 'post-3',
      platform: 'tiktok',
      postId: 'tt-11111',
      content: 'Rutina de 10 minutos para empezar el día',
      publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      engagement: {
        likes: 1200,
        comments: 89,
        shares: 156,
        saves: 234,
        totalEngagement: 1679,
      },
      leadsGenerated: 5,
      inquiriesGenerated: 18,
      engagementToLeadRate: (5 / 1679) * 100,
      timeInvestedMinutes: 15,
      roi: (5 * 50) / 15,
    },
  ];

  // Comparación con período anterior
  let previousPeriod: FunnelsAcquisitionPeriod = '7d';
  if (period === '30d') previousPeriod = '7d';
  if (period === '90d') previousPeriod = '30d';

  const previousBase = baseMetrics[previousPeriod];
  const previousROI = (previousBase.totalLeads * 50) / previousBase.totalTimeInvested;
  const roiChange = averageROI - previousROI;
  const roiChangePercentage = previousROI > 0 ? (roiChange / previousROI) * 100 : 0;
  const leadsChange = base.totalLeads - previousBase.totalLeads;
  const leadsChangePercentage = previousBase.totalLeads > 0 ? (leadsChange / previousBase.totalLeads) * 100 : 0;

  const trendDirection: 'up' | 'down' | 'neutral' =
    roiChange > 0.5 ? 'up' : roiChange < -0.5 ? 'down' : 'neutral';

  return {
    period,
    platforms,
    topPosts,
    totalEngagement: base.totalEngagement,
    totalLeads: base.totalLeads,
    totalInquiries: base.totalInquiries,
    totalTimeInvestedMinutes: base.totalTimeInvested,
    averageROI: Number(averageROI.toFixed(2)),
    comparison: {
      previousPeriod,
      conversionRateChange: roiChange,
      conversionRateChangePercentage: Number(roiChangePercentage.toFixed(1)),
      totalConvertedChange: leadsChange,
      totalConvertedChangePercentage: Number(leadsChangePercentage.toFixed(1)),
      trendDirection,
    },
  };
}

export async function fetchSocialMediaMetrics(
  period: FunnelsAcquisitionPeriod,
): Promise<SocialMediaMetrics> {
  return simulateLatency(generateSocialMediaMetrics(period));
}

// US-FA-012: Sistema de tracking de referidos
function generateReferralProgramMetrics(period: FunnelsAcquisitionPeriod): ReferralProgramMetrics {
  const baseMetrics = {
    '7d': {
      totalReferrals: 8,
      convertedReferrals: 5,
      totalRevenue: 1250,
      totalParticipants: 12,
      activeReferrers: 8,
    },
    '30d': {
      totalReferrals: 32,
      convertedReferrals: 20,
      totalRevenue: 5000,
      totalParticipants: 45,
      activeReferrers: 28,
    },
    '90d': {
      totalReferrals: 96,
      convertedReferrals: 60,
      totalRevenue: 15000,
      totalParticipants: 120,
      activeReferrers: 75,
    },
  };

  const base = baseMetrics[period];
  const conversionRate = (base.convertedReferrals / base.totalReferrals) * 100;
  const averageCustomerValue = base.totalRevenue / base.convertedReferrals;
  const averageReferralsPerPerson = base.totalReferrals / base.totalParticipants;
  const programROI = (base.totalRevenue / (base.totalParticipants * 10)) * 100; // Asumiendo costo de programa

  const referralSources: ReferralProgramMetrics['referralSources'] = [
    {
      id: 'ref-1',
      referrerId: 'client-123',
      referrerName: 'María González',
      referrerEmail: 'maria.gonzalez@email.com',
      referrerType: 'cliente',
      totalReferrals: 8,
      convertedReferrals: 6,
      conversionRate: 75,
      totalRevenue: 1800,
      averageCustomerValue: 300,
      lifetimeValue: 2400,
      firstReferralDate: '2024-10-15T10:00:00Z',
      lastReferralDate: new Date().toISOString(),
    },
    {
      id: 'ref-2',
      referrerId: 'client-456',
      referrerName: 'Carlos Ruiz',
      referrerEmail: 'carlos.ruiz@email.com',
      referrerType: 'cliente',
      totalReferrals: 6,
      convertedReferrals: 4,
      conversionRate: 66.7,
      totalRevenue: 1200,
      averageCustomerValue: 300,
      lifetimeValue: 1800,
      firstReferralDate: '2024-11-01T14:00:00Z',
      lastReferralDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'ref-3',
      referrerId: 'client-789',
      referrerName: 'Ana Martínez',
      referrerEmail: 'ana.martinez@email.com',
      referrerType: 'cliente',
      totalReferrals: 5,
      convertedReferrals: 3,
      conversionRate: 60,
      totalRevenue: 900,
      averageCustomerValue: 300,
      lifetimeValue: 1350,
      firstReferralDate: '2024-11-10T09:00:00Z',
      lastReferralDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'ref-4',
      referrerId: 'collab-001',
      referrerName: 'Juan Pérez',
      referrerEmail: 'juan.perez@email.com',
      referrerType: 'colaborador',
      totalReferrals: 4,
      convertedReferrals: 3,
      conversionRate: 75,
      totalRevenue: 900,
      averageCustomerValue: 300,
      lifetimeValue: 1200,
      firstReferralDate: '2024-10-20T11:00:00Z',
      lastReferralDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const topReferrers = [...referralSources]
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 3);

  // Comparación con período anterior
  let previousPeriod: FunnelsAcquisitionPeriod = '7d';
  if (period === '30d') previousPeriod = '7d';
  if (period === '90d') previousPeriod = '30d';

  const previousBase = baseMetrics[previousPeriod];
  const previousConversionRate = (previousBase.convertedReferrals / previousBase.totalReferrals) * 100;
  const conversionRateChange = conversionRate - previousConversionRate;
  const conversionRateChangePercentage =
    previousConversionRate > 0 ? (conversionRateChange / previousConversionRate) * 100 : 0;
  const convertedChange = base.convertedReferrals - previousBase.convertedReferrals;
  const convertedChangePercentage =
    previousBase.convertedReferrals > 0 ? (convertedChange / previousBase.convertedReferrals) * 100 : 0;

  const trendDirection: 'up' | 'down' | 'neutral' =
    conversionRateChange > 2 ? 'up' : conversionRateChange < -2 ? 'down' : 'neutral';

  const suggestions: ReferralProgramMetrics['suggestions'] = [
    {
      id: 'suggestion-ref-1',
      title: 'Aumentar incentivos para referrers activos',
      description:
        'Los top 3 referrers generan el 60% de las conversiones. Considera aumentar sus incentivos o crear un programa VIP para mantenerlos motivados.',
      impact: 'high',
      category: 'incentives',
    },
    {
      id: 'suggestion-ref-2',
      title: 'Mejorar comunicación del programa',
      description:
        'Solo el 62% de los participantes están activos. Envía recordatorios mensuales sobre el programa y cómo referir clientes.',
      impact: 'high',
      category: 'communication',
    },
    {
      id: 'suggestion-ref-3',
      title: 'Simplificar proceso de referido',
      description:
        'Crea un enlace único por referrer que puedan compartir fácilmente. Esto puede aumentar las referencias en un 30%.',
      impact: 'medium',
      category: 'tracking',
    },
    {
      id: 'suggestion-ref-4',
      title: 'Promocionar programa en redes sociales',
      description:
        'Publica sobre el programa de referidos en tus redes sociales para aumentar la participación. Los clientes satisfechos son tu mejor marketing.',
      impact: 'medium',
      category: 'promotion',
    },
  ];

  return {
    period,
    totalReferrals: base.totalReferrals,
    convertedReferrals: base.convertedReferrals,
    conversionRate: Number(conversionRate.toFixed(1)),
    totalRevenue: base.totalRevenue,
    averageCustomerValue: Number(averageCustomerValue.toFixed(2)),
    topReferrers,
    referralSources,
    programPerformance: {
      totalParticipants: base.totalParticipants,
      activeReferrers: base.activeReferrers,
      averageReferralsPerPerson: Number(averageReferralsPerPerson.toFixed(2)),
      programROI: Number(programROI.toFixed(1)),
    },
    comparison: {
      previousPeriod,
      conversionRateChange: Number(conversionRateChange.toFixed(1)),
      conversionRateChangePercentage: Number(conversionRateChangePercentage.toFixed(1)),
      totalConvertedChange: convertedChange,
      totalConvertedChangePercentage: Number(convertedChangePercentage.toFixed(1)),
      trendDirection,
    },
    suggestions,
  };
}

export async function fetchReferralProgramMetrics(
  period: FunnelsAcquisitionPeriod,
): Promise<ReferralProgramMetrics> {
  return simulateLatency(generateReferralProgramMetrics(period));
}

// US-FA-014: Generar funnels recomendados según especialidad y objetivos
function generateRecommendedFunnels(
  request: FunnelRecommendationRequest,
): FunnelRecommendationResponse {
  const { specialties, objectives } = request;

  const recommendedFunnels: RecommendedFunnel[] = [];

  // Funnel 1: Para especialidades de fuerza y objetivo de captar leads
  if (specialties.includes('fuerza') || specialties.includes('ganancia_muscular')) {
    if (objectives.includes('captar_leads') || objectives.includes('expandir_audiencia')) {
      recommendedFunnels.push({
        id: 'rec-funnel-1',
        name: 'Funnel de Fuerza: Reto 12 Semanas',
        description:
          'Funnel diseñado para captar leads interesados en ganancia muscular y fuerza, con lead magnet de plan de entrenamiento y secuencia de nurturing enfocada en resultados.',
        specialty: ['fuerza', 'ganancia_muscular'],
        objectives: ['captar_leads', 'aumentar_ventas'],
        stages: [
          {
            id: 'stage-1',
            title: 'Ads Instagram/TikTok - Transformaciones',
            stageType: 'Captación',
            description: 'Campañas con antes/después y testimonios de clientes',
            suggestedCopy:
              '¿Listo para transformar tu cuerpo en 12 semanas? Únete al reto que ha cambiado la vida de más de 500 personas.',
            suggestedAssets: ['Video testimonial', 'Gráfico antes/después', 'CTA destacado'],
            order: 1,
          },
          {
            id: 'stage-2',
            title: 'Landing Page - Reto 12 Semanas',
            stageType: 'Captación',
            description: 'Página de captura con lead magnet de plan de entrenamiento',
            suggestedCopy:
              'Descarga tu plan de entrenamiento personalizado para ganar fuerza y masa muscular. 100% gratis.',
            suggestedAssets: ['Hero con imagen de resultados', 'Formulario simple', 'Prueba social'],
            order: 2,
          },
          {
            id: 'stage-3',
            title: 'Email Sequence - Autoridad y Resultados',
            stageType: 'Nurturing',
            description: 'Secuencia de 5 emails con contenido de valor y casos de éxito',
            suggestedCopy:
              'En este email te comparto los 3 errores más comunes que impiden ganar músculo (y cómo evitarlos).',
            suggestedAssets: ['Infografía de errores', 'Video explicativo', 'CTA a consulta'],
            order: 3,
          },
          {
            id: 'stage-4',
            title: 'WhatsApp - Seguimiento Personalizado',
            stageType: 'Nurturing',
            description: 'Mensaje personalizado con oferta de consulta estratégica',
            suggestedCopy:
              'Hola {{nombre}}, vi que descargaste el plan. ¿Te gustaría una consulta gratuita para adaptarlo a tus objetivos específicos?',
            suggestedAssets: ['Plantilla personalizada', 'Enlace a calendario'],
            order: 4,
          },
          {
            id: 'stage-5',
            title: 'Checkout - Plan Mensual o Bono',
            stageType: 'Conversión',
            description: 'Oferta de plan mensual o bono de sesiones',
            suggestedCopy:
              'Elige tu plan: Mensual (€89/mes) o Bono 12 semanas (€750, ahorra €318). Ambos incluyen seguimiento personalizado.',
            suggestedAssets: ['Comparador de planes', 'Testimonios', 'Garantía'],
            order: 5,
          },
        ],
        estimatedConversion: 6.5,
        estimatedRevenue: 12000,
        difficulty: 'intermedio',
        timeToLaunch: '3-5 días',
        tags: ['fuerza', 'ganancia muscular', 'retos', 'alto ticket'],
      });
    }
  }

  // Funnel 2: Para pérdida de peso y mejorar conversión
  if (specialties.includes('perdida_peso') || specialties.includes('hiit')) {
    if (objectives.includes('mejorar_conversion') || objectives.includes('aumentar_ventas')) {
      recommendedFunnels.push({
        id: 'rec-funnel-2',
        name: 'Funnel de Pérdida de Peso: Programa 8 Semanas',
        description:
          'Funnel optimizado para convertir leads interesados en perder peso, con enfoque en resultados rápidos y sostenibles.',
        specialty: ['perdida_peso', 'hiit'],
        objectives: ['mejorar_conversion', 'aumentar_ventas'],
        stages: [
          {
            id: 'stage-6',
            title: 'Lead Magnet - Calculadora de Objetivos',
            stageType: 'Captación',
            description: 'Quiz interactivo que calcula objetivos personalizados',
            suggestedCopy:
              'Descubre cuánto peso puedes perder en 8 semanas con nuestro método probado. Calcula tus objetivos ahora.',
            suggestedAssets: ['Calculadora interactiva', 'Gráfico de progreso', 'CTA claro'],
            order: 1,
          },
          {
            id: 'stage-7',
            title: 'Email Sequence - Educación y Motivación',
            stageType: 'Nurturing',
            description: 'Secuencia de 7 emails con tips, recetas y motivación',
            suggestedCopy:
              'Día 1: Los 5 mitos sobre pérdida de peso que te están frenando. Día 3: Receta de desayuno que acelera tu metabolismo.',
            suggestedAssets: ['Infografías educativas', 'Recetas', 'Videos cortos'],
            order: 2,
          },
          {
            id: 'stage-8',
            title: 'Webinar en Vivo - Método Explicado',
            stageType: 'Cualificación',
            description: 'Webinar semanal donde explicas tu método',
            suggestedCopy:
              'Únete al webinar gratuito este jueves a las 19h: "Cómo perder 5-8kg en 8 semanas sin dietas extremas"',
            suggestedAssets: ['Invitación al webinar', 'Agenda del evento', 'Registro'],
            order: 3,
          },
          {
            id: 'stage-9',
            title: 'Oferta Especial Post-Webinar',
            stageType: 'Conversión',
            description: 'Oferta con descuento para asistentes al webinar',
            suggestedCopy:
              'Oferta exclusiva para asistentes: Programa completo 8 semanas con 30% de descuento. Solo válido 48h.',
            suggestedAssets: ['Oferta destacada', 'Countdown timer', 'Testimonios'],
            order: 4,
          },
        ],
        estimatedConversion: 8.2,
        estimatedRevenue: 15000,
        difficulty: 'avanzado',
        timeToLaunch: '5-7 días',
        tags: ['pérdida peso', 'webinar', 'educación', 'conversión alta'],
      });
    }
  }

  // Funnel 3: Para nutrición y fidelización
  if (specialties.includes('nutricion')) {
    if (objectives.includes('fidelizar_clientes') || objectives.includes('aumentar_valor_ticket')) {
      recommendedFunnels.push({
        id: 'rec-funnel-3',
        name: 'Funnel de Nutrición: Programa Integral',
        description:
          'Funnel para clientes que buscan mejorar su alimentación, con enfoque en educación y seguimiento continuo.',
        specialty: ['nutricion'],
        objectives: ['fidelizar_clientes', 'aumentar_valor_ticket'],
        stages: [
          {
            id: 'stage-10',
            title: 'Lead Magnet - Guía de Meal Prep',
            stageType: 'Captación',
            description: 'PDF descargable con recetas y plan de meal prep',
            suggestedCopy:
              'Descarga tu guía completa de meal prep: 20 recetas, lista de compra y plan semanal. Empieza a comer sano hoy.',
            suggestedAssets: ['PDF descargable', 'Preview de recetas', 'Formulario'],
            order: 1,
          },
          {
            id: 'stage-11',
            title: 'Email Sequence - Educación Nutricional',
            stageType: 'Nurturing',
            description: 'Secuencia educativa sobre nutrición y hábitos',
            suggestedCopy:
              'Email 1: Los 3 macronutrientes esenciales. Email 3: Cómo calcular tus calorías diarias. Email 5: Meal prep para principiantes.',
            suggestedAssets: ['Infografías', 'Videos tutoriales', 'Plantillas'],
            order: 2,
          },
          {
            id: 'stage-12',
            title: 'Consulta Gratuita de Evaluación',
            stageType: 'Cualificación',
            description: 'Oferta de consulta gratuita para evaluación nutricional',
            suggestedCopy:
              'Agenda tu consulta gratuita de 30 minutos. Evaluaremos tu situación actual y te daremos un plan personalizado.',
            suggestedAssets: ['Calendario de citas', 'Formulario de evaluación', 'CTA'],
            order: 3,
          },
          {
            id: 'stage-13',
            title: 'Oferta de Plan Nutricional',
            stageType: 'Conversión',
            description: 'Oferta de plan nutricional mensual o trimestral',
            suggestedCopy:
              'Plan Nutricional Personalizado: Seguimiento semanal, ajustes en tiempo real, recetas exclusivas. Desde €79/mes.',
            suggestedAssets: ['Comparador de planes', 'Beneficios', 'Testimonios'],
            order: 4,
          },
        ],
        estimatedConversion: 7.8,
        estimatedRevenue: 9500,
        difficulty: 'principiante',
        timeToLaunch: '2-3 días',
        tags: ['nutrición', 'educación', 'fidelización', 'valor recurrente'],
      });
    }
  }

  // Funnel genérico si no hay match específico
  if (recommendedFunnels.length === 0) {
    recommendedFunnels.push({
      id: 'rec-funnel-generic',
      name: 'Funnel Universal: Consulta Gratuita',
      description:
        'Funnel básico y efectivo para cualquier especialidad, enfocado en generar consultas gratuitas.',
      specialty: specialties,
      objectives: objectives,
      stages: [
        {
          id: 'stage-generic-1',
          title: 'Redes Sociales - Contenido de Valor',
          stageType: 'Captación',
          description: 'Publicaciones regulares con contenido educativo',
          suggestedCopy:
            'Comparte tips, ejercicios y consejos en tus redes sociales para atraer leads interesados.',
          suggestedAssets: ['Posts educativos', 'Videos cortos', 'Stories'],
          order: 1,
        },
        {
          id: 'stage-generic-2',
          title: 'Landing Page - Consulta Gratuita',
          stageType: 'Captación',
          description: 'Página simple ofreciendo consulta gratuita',
          suggestedCopy:
            'Reserva tu consulta gratuita de 30 minutos. Descubre cómo puedo ayudarte a alcanzar tus objetivos.',
          suggestedAssets: ['Hero atractivo', 'Formulario simple', 'Prueba social'],
          order: 2,
        },
        {
          id: 'stage-generic-3',
          title: 'Email de Confirmación y Preparación',
          stageType: 'Nurturing',
          description: 'Email de confirmación con información útil',
          suggestedCopy:
            'Gracias por reservar tu consulta. Mientras tanto, aquí tienes 3 tips para empezar hoy mismo.',
          suggestedAssets: ['Email de bienvenida', 'Tips útiles', 'Recordatorio'],
          order: 3,
        },
        {
          id: 'stage-generic-4',
          title: 'Seguimiento Post-Consulta',
          stageType: 'Conversión',
          description: 'Seguimiento después de la consulta con oferta',
          suggestedCopy:
            'Fue un placer conocerte. Aquí tienes la oferta especial que comentamos durante la consulta.',
          suggestedAssets: ['Oferta personalizada', 'Testimonios', 'CTA claro'],
          order: 4,
        },
      ],
      estimatedConversion: 5.0,
      estimatedRevenue: 8000,
      difficulty: 'principiante',
      timeToLaunch: '1-2 días',
      tags: ['universal', 'consulta gratuita', 'básico'],
    });
  }

  const personalizedMessage = `Basado en tu especialidad${specialties.length > 1 ? 'es' : ''} (${specialties.join(', ')}) y objetivo${objectives.length > 1 ? 's' : ''} (${objectives.join(', ')}), hemos generado ${recommendedFunnels.length} funnel${recommendedFunnels.length > 1 ? 's' : ''} recomendado${recommendedFunnels.length > 1 ? 's' : ''} para ti.`;

  const nextSteps = [
    'Revisa los funnels recomendados y selecciona el que mejor se adapte a tu situación',
    'Personaliza las etapas según tu propuesta única de valor',
    'Configura los buyer personas y dolores principales en el builder',
    'Lanza una versión de prueba y mide los resultados',
    'Itera y optimiza basándote en los datos',
  ];

  return {
    recommendedFunnels,
    personalizedMessage,
    nextSteps,
  };
}

export async function fetchRecommendedFunnels(
  request: FunnelRecommendationRequest,
): Promise<FunnelRecommendationResponse> {
  return simulateLatency(generateRecommendedFunnels(request));
}

// US-FA-015: Funciones para buyer personas y personalización
export async function saveBuyerPersonas(
  funnelId: string,
  personas: BuyerPersona[],
): Promise<{ success: boolean; message: string }> {
  // Simulación de guardado
  return simulateLatency({ success: true, message: 'Buyer personas guardadas correctamente' });
}

export async function savePainPoints(
  funnelId: string,
  painPoints: PainPoint[],
): Promise<{ success: boolean; message: string }> {
  // Simulación de guardado
  return simulateLatency({ success: true, message: 'Dolores principales guardados correctamente' });
}

export async function adaptFunnelCopy(
  funnelId: string,
  stageId: string,
  originalCopy: string,
  personaId: string,
  painPointIds: string[],
): Promise<CopyAdaptation> {
  // Simulación de adaptación de copy con IA
  const adaptedCopy = `[Adaptado para ${personaId}] ${originalCopy} - Este mensaje ha sido personalizado para abordar los dolores principales identificados y resonar mejor con tu buyer persona objetivo.`;

  return simulateLatency({
    originalCopy,
    adaptedCopy,
    personaId,
    painPointIds,
    reasoning:
      'El copy ha sido adaptado para usar un tono más empático y abordar directamente los dolores principales del buyer persona, aumentando la probabilidad de conversión.',
  });
}

export async function getFunnelPersonalization(
  funnelId: string,
): Promise<FunnelPersonalization | null> {
  // Simulación de obtención de personalización
  const defaultPersonalization: FunnelPersonalization = {
    funnelId,
    buyerPersonas: [],
    painPoints: [],
    adaptedCopy: {},
    adaptedAssets: {},
    lastUpdated: new Date().toISOString(),
  };

  return simulateLatency(defaultPersonalization);
}

// US-FA-03: Funciones para guardar y recuperar configuraciones de tono y CTA favoritos
const mockToneConfigs: FavoriteToneConfig[] = [
  {
    id: 'tone-1',
    name: 'Tono Motivacional',
    tone: 'motivacional',
    description: 'Tono enérgico y positivo para retos y desafíos',
    examples: ['¡Tú puedes lograrlo!', 'Transforma tu vida hoy', 'El cambio empieza ahora'],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'tone-2',
    name: 'Tono Educativo',
    tone: 'educativo',
    description: 'Tono profesional y didáctico para guías y contenido educativo',
    examples: ['Aprende cómo...', 'Descubre los secretos de...', 'Guía completa para...'],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const mockCTAConfigs: FavoriteCTAConfig[] = [
  {
    id: 'cta-1',
    name: 'CTA Reto 7 Días',
    ctaText: '¡Únete gratis al reto!',
    ctaStyle: 'primary',
    context: 'Landing page',
    description: 'CTA para retos y desafíos',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'cta-2',
    name: 'CTA Consulta Gratuita',
    ctaText: 'Reserva tu sesión estratégica',
    ctaStyle: 'primary',
    context: 'Email',
    description: 'CTA para agendar consultas',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'cta-3',
    name: 'CTA Descarga Guía',
    ctaText: 'Descarga tu guía gratis',
    ctaStyle: 'secondary',
    context: 'Landing page',
    description: 'CTA para lead magnets',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export async function getFavoriteToneConfigs(): Promise<FavoriteToneConfig[]> {
  return simulateLatency([...mockToneConfigs]);
}

export async function saveFavoriteToneConfig(
  config: Omit<FavoriteToneConfig, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<FavoriteToneConfig> {
  const newConfig: FavoriteToneConfig = {
    ...config,
    id: `tone-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockToneConfigs.push(newConfig);
  return simulateLatency(newConfig);
}

export async function deleteFavoriteToneConfig(configId: string): Promise<{ success: boolean }> {
  const index = mockToneConfigs.findIndex((c) => c.id === configId);
  if (index > -1) {
    mockToneConfigs.splice(index, 1);
  }
  return simulateLatency({ success: true });
}

export async function getFavoriteCTAConfigs(): Promise<FavoriteCTAConfig[]> {
  return simulateLatency([...mockCTAConfigs]);
}

export async function saveFavoriteCTAConfig(
  config: Omit<FavoriteCTAConfig, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<FavoriteCTAConfig> {
  const newConfig: FavoriteCTAConfig = {
    ...config,
    id: `cta-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockCTAConfigs.push(newConfig);
  return simulateLatency(newConfig);
}

export async function deleteFavoriteCTAConfig(configId: string): Promise<{ success: boolean }> {
  const index = mockCTAConfigs.findIndex((c) => c.id === configId);
  if (index > -1) {
    mockCTAConfigs.splice(index, 1);
  }
  return simulateLatency({ success: true });
}

export async function getToneAndCTAPresets(): Promise<ToneAndCTAPreset[]> {
  const presets: ToneAndCTAPreset[] = [
    {
      id: 'preset-1',
      name: 'Reto 7 Días',
      description: 'Preset para retos y desafíos',
      toneConfig: mockToneConfigs[0],
      ctaConfig: mockCTAConfigs[0],
      tags: ['reto', 'desafío', 'landing'],
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
  return simulateLatency(presets);
}

export async function saveToneAndCTAPreset(
  preset: Omit<ToneAndCTAPreset, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<ToneAndCTAPreset> {
  const newPreset: ToneAndCTAPreset = {
    ...preset,
    id: `preset-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return simulateLatency(newPreset);
}

// US-FA-04: Funciones para sugerencias de formatos de lead magnet según avatar
export async function getLeadMagnetFormatSuggestions(
  personaId: string,
  personas: BuyerPersona[],
): Promise<AvatarBasedFormatSuggestions> {
  const persona = personas.find((p) => p.id === personaId);
  if (!persona) {
    throw new Error('Persona no encontrada');
  }

  // Lógica de sugerencias basada en la persona
  const suggestions: LeadMagnetFormatSuggestion[] = [];

  // Si la persona tiene objetivos relacionados con nutrición
  if (
    persona.goals.some((g) => g.toLowerCase().includes('nutrición') || g.toLowerCase().includes('dieta')) ||
    persona.keywords.some((k) => k.toLowerCase().includes('nutrición') || k.toLowerCase().includes('alimentación'))
  ) {
    suggestions.push({
      id: 'suggestion-1',
      format: 'guia_nutricional',
      title: 'Guía Nutricional Personalizada',
      description: 'PDF descargable con planes de alimentación, recetas y tips nutricionales adaptados a tu avatar',
      recommendedForPersonas: [personaId],
      estimatedConversion: 8.5,
      difficulty: 'medio',
      timeToCreate: '2-3 horas',
      exampleTitles: [
        'Guía de Meal Prep para Principiantes',
        'Plan Nutricional de 7 Días',
        'Macronutrientes Explicados',
      ],
      benefits: ['Alto valor percibido', 'Fácil de compartir', 'Genera confianza'],
    });
  }

  // Si la persona busca entrenamientos intensos o HIIT
  if (
    persona.goals.some((g) => g.toLowerCase().includes('hiit') || g.toLowerCase().includes('intenso')) ||
    persona.keywords.some((k) => k.toLowerCase().includes('hiit') || k.toLowerCase().includes('cardio'))
  ) {
    suggestions.push({
      id: 'suggestion-2',
      format: 'checklist_hiit',
      title: 'Checklist HIIT de 4 Semanas',
      description: 'Checklist interactivo con rutinas HIIT progresivas, ejercicios y seguimiento de progreso',
      recommendedForPersonas: [personaId],
      estimatedConversion: 7.2,
      difficulty: 'facil',
      timeToCreate: '1-2 horas',
      exampleTitles: [
        'Checklist HIIT para Principiantes',
        'Rutina HIIT de 20 Minutos',
        'Desafío HIIT de 30 Días',
      ],
      benefits: ['Fácil de crear', 'Alto engagement', 'Reutilizable'],
    });
  }

  // Si la persona busca educación o aprendizaje
  if (
    persona.goals.some((g) => g.toLowerCase().includes('aprender') || g.toLowerCase().includes('educación')) ||
    persona.toneOfVoice.toLowerCase().includes('educativo')
  ) {
    suggestions.push({
      id: 'suggestion-3',
      format: 'mini_curso',
      title: 'Mini-Curso de Entrenamiento',
      description: 'Serie de videos cortos o emails educativos que enseñan conceptos clave paso a paso',
      recommendedForPersonas: [personaId],
      estimatedConversion: 9.1,
      difficulty: 'avanzado',
      timeToCreate: '5-7 horas',
      exampleTitles: [
        'Mini-Curso: Fundamentos del Entrenamiento',
        '5 Días para Dominar la Técnica',
        'Curso Express de Nutrición Deportiva',
      ],
      benefits: ['Alto valor percibido', 'Posiciona como experto', 'Genera leads cualificados'],
    });
  }

  // Sugerencias genéricas si no hay match específico
  if (suggestions.length === 0) {
    suggestions.push(
      {
        id: 'suggestion-generic-1',
        format: 'calculadora',
        title: 'Calculadora Personalizada',
        description: 'Herramienta interactiva que calcula métricas relevantes (IMC, macros, calorías)',
        recommendedForPersonas: [personaId],
        estimatedConversion: 6.8,
        difficulty: 'medio',
        timeToCreate: '2-3 horas',
        exampleTitles: ['Calculadora de Macronutrientes', 'Calculadora de IMC', 'Calculadora de Calorías'],
        benefits: ['Alto engagement', 'Viral potencial', 'Fácil de compartir'],
      },
      {
        id: 'suggestion-generic-2',
        format: 'quiz',
        title: 'Quiz de Diagnóstico',
        description: 'Quiz interactivo que ayuda a identificar objetivos, nivel de fitness o necesidades específicas',
        recommendedForPersonas: [personaId],
        estimatedConversion: 7.5,
        difficulty: 'facil',
        timeToCreate: '1-2 horas',
        exampleTitles: [
          'Quiz: ¿Qué tipo de entrenamiento necesitas?',
          'Descubre tu perfil fitness',
          'Test de Objetivos',
        ],
        benefits: ['Divertido', 'Genera datos valiosos', 'Alto engagement'],
      },
    );
  }

  const personalizedMessage = `Basado en el perfil de "${persona.name}", te recomendamos estos formatos de lead magnet que resonarán mejor con tu audiencia objetivo.`;

  return simulateLatency({
    personaId,
    personaName: persona.name,
    suggestions,
    personalizedMessage,
  });
}

// US-FA-05: Generar el copy completo de la landing page con IA en mi tono
export async function generateLandingPageCopy(
  request: LandingPageCopyGenerationRequest,
): Promise<LandingPageCopyGenerationResponse> {
  // Simulación de generación de copy con IA
  const toneMessages: Record<ToneOfVoice, string> = {
    motivacional: '¡Transforma tu vida hoy mismo!',
    educativo: 'Descubre cómo puedes alcanzar tus objetivos',
    enérgico: '¡Vamos! ¡Es tu momento!',
    empático: 'Entendemos tu situación y estamos aquí para ayudarte',
    profesional: 'Ofrecemos soluciones personalizadas para tus necesidades',
    directo: 'Aquí está lo que necesitas saber',
    inspirador: 'Tu mejor versión te espera',
    cercano: 'Hola, soy [nombre] y quiero ayudarte',
  };

  const sections: LandingPageCopyGenerationResponse['sections'] = [];

  // Hero section
  if (request.sections.includes('hero')) {
    sections.push({
      id: 'hero-1',
      sectionType: 'hero',
      title: request.objective.includes('Captar') 
        ? 'Descubre cómo podemos ayudarte a alcanzar tus objetivos'
        : request.objective.includes('Vender')
        ? 'La solución que estabas buscando'
        : 'Bienvenido',
      content: `${toneMessages[request.toneOfVoice]} ${request.objective}. ${request.keyMessages?.[0] || 'Ofrecemos resultados comprobados y un enfoque personalizado para cada cliente.'}`,
      suggestedLength: 150,
    });
  }

  // Benefits section
  if (request.sections.includes('benefits')) {
    sections.push({
      id: 'benefits-1',
      sectionType: 'benefits',
      title: 'Beneficios principales',
      content: `• ${request.keyMessages?.[0] || 'Resultados comprobados en tiempo récord'}\n• ${request.keyMessages?.[1] || 'Enfoque personalizado adaptado a tus necesidades'}\n• ${request.keyMessages?.[2] || 'Seguimiento continuo y apoyo constante'}`,
      suggestedLength: 200,
    });
  }

  // Features section
  if (request.sections.includes('features')) {
    sections.push({
      id: 'features-1',
      sectionType: 'features',
      title: 'Lo que incluye',
      content: `Nuestro servicio incluye todo lo necesario para alcanzar tus objetivos: planificación personalizada, seguimiento regular, ajustes en tiempo real y soporte continuo.`,
      suggestedLength: 180,
    });
  }

  // Social proof
  if (request.sections.includes('social_proof')) {
    sections.push({
      id: 'social-proof-1',
      sectionType: 'social_proof',
      title: 'Lo que dicen nuestros clientes',
      content: `"Los resultados superaron mis expectativas. En solo 8 semanas logré mis objetivos." - Cliente satisfecho\n\n"El enfoque personalizado hizo toda la diferencia. Me sentí apoyado en cada paso." - Testimonio real`,
      suggestedLength: 250,
    });
  }

  // FAQ
  if (request.includeFAQ || request.sections.includes('faq')) {
    sections.push({
      id: 'faq-1',
      sectionType: 'faq',
      title: 'Preguntas frecuentes',
      content: `P: ¿Cuánto tiempo toma ver resultados?\nR: La mayoría de nuestros clientes ven resultados significativos en las primeras 4-6 semanas.\n\nP: ¿Necesito experiencia previa?\nR: No, adaptamos el programa a tu nivel actual, desde principiantes hasta avanzados.`,
      suggestedLength: 300,
    });
  }

  // CTA
  if (request.sections.includes('cta')) {
    sections.push({
      id: 'cta-1',
      sectionType: 'cta',
      title: '¿Listo para comenzar?',
      content: request.ctaText || 'Reserva tu consulta gratuita ahora y descubre cómo podemos ayudarte a alcanzar tus objetivos.',
      suggestedLength: 100,
    });
  }

  return simulateLatency({
    sections,
    metaTitle: `${request.objective} - Solución Personalizada`,
    metaDescription: `${toneMessages[request.toneOfVoice]} ${request.objective}. ${request.keyMessages?.[0] || 'Descubre cómo podemos ayudarte.'}`,
    suggestedHeadlines: [
      `${toneMessages[request.toneOfVoice]} ${request.objective}`,
      `La solución que estabas buscando para ${request.objective.toLowerCase()}`,
      `Transforma tu vida con nuestro enfoque personalizado`,
    ],
    suggestedCTAs: [
      request.ctaText || 'Reserva tu consulta gratuita',
      'Comienza ahora',
      'Descubre más',
    ],
    reasoning: `El copy ha sido generado con un tono ${request.toneOfVoice} para resonar mejor con tu audiencia objetivo. Se han incluido mensajes clave y se ha optimizado para conversión basándose en mejores prácticas de landing pages.`,
    estimatedConversion: 6.5,
  });
}

// US-FA-06: Formularios inteligentes que capturen datos relevantes
export async function suggestIntelligentForm(
  request: IntelligentFormSuggestionRequest,
): Promise<IntelligentFormSuggestion> {
  const suggestedFields: IntelligentFormSuggestion['suggestedFields'] = [];

  // Campos básicos de contacto
  if (!request.existingFields?.includes('email')) {
    suggestedFields.push({
      id: 'field-email',
      label: 'Email',
      fieldType: 'email',
      required: true,
      placeholder: 'tu@email.com',
      dataCategory: 'contact',
      mappingField: 'email',
      aiSuggested: true,
    });
  }

  if (!request.existingFields?.includes('phone')) {
    suggestedFields.push({
      id: 'field-phone',
      label: 'Teléfono',
      fieldType: 'phone',
      required: false,
      placeholder: '+34 600 000 000',
      dataCategory: 'contact',
      mappingField: 'phone',
      aiSuggested: true,
    });
  }

  // Campos de objetivos
  if (request.dataNeeded?.includes('objectives') || !request.dataNeeded) {
    suggestedFields.push({
      id: 'field-objectives',
      label: '¿Cuál es tu objetivo principal?',
      fieldType: 'select',
      required: true,
      options: [
        'Pérdida de peso',
        'Ganancia muscular',
        'Mejorar condición física',
        'Preparación para competición',
        'Rehabilitación',
        'Bienestar general',
        'Otro',
      ],
      dataCategory: 'objectives',
      mappingField: 'objetivo_principal',
      aiSuggested: true,
    });
  }

  // Campos de disponibilidad
  if (request.dataNeeded?.includes('availability') || !request.dataNeeded) {
    suggestedFields.push({
      id: 'field-availability-days',
      label: '¿Qué días de la semana prefieres entrenar?',
      fieldType: 'multiselect',
      required: false,
      options: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
      dataCategory: 'availability',
      mappingField: 'dias_disponibles',
      aiSuggested: true,
    });

    suggestedFields.push({
      id: 'field-availability-time',
      label: '¿En qué horario prefieres entrenar?',
      fieldType: 'select',
      required: false,
      options: ['Mañana (6-12h)', 'Mediodía (12-15h)', 'Tarde (15-20h)', 'Noche (20-22h)', 'Flexible'],
      dataCategory: 'availability',
      mappingField: 'horario_preferido',
      aiSuggested: true,
    });
  }

  // Campos de preferencias
  if (request.dataNeeded?.includes('preferences')) {
    suggestedFields.push({
      id: 'field-training-type',
      label: '¿Qué tipo de entrenamiento prefieres?',
      fieldType: 'multiselect',
      required: false,
      options: ['Fuerza', 'Cardio', 'HIIT', 'Yoga', 'Pilates', 'Funcional', 'Otro'],
      dataCategory: 'preferences',
      mappingField: 'tipo_entrenamiento',
      aiSuggested: true,
    });
  }

  // Campos de salud
  if (request.dataNeeded?.includes('health')) {
    suggestedFields.push({
      id: 'field-health-conditions',
      label: '¿Tienes alguna condición de salud o lesión que debamos conocer?',
      fieldType: 'textarea',
      required: false,
      placeholder: 'Describe brevemente cualquier condición relevante...',
      dataCategory: 'health',
      mappingField: 'condiciones_salud',
      aiSuggested: true,
    });
  }

  const suggestedOrder = suggestedFields.map((f) => f.id);
  const reasoning = `Se han sugerido campos inteligentes basados en el objetivo "${request.objective}" y la etapa del funnel "${request.funnelStage || 'TOFU'}". Estos campos capturan información relevante para nutrir campañas posteriores y calificar leads de manera efectiva.`;

  return simulateLatency({
    suggestedFields,
    reasoning,
    estimatedCompletionRate: 75,
    suggestedOrder,
    conditionalLogic: [
      {
        fieldId: 'field-objectives',
        condition: 'value === "Otro"',
        showFields: ['field-objectives-other'],
      },
    ],
  });
}

export async function saveIntelligentForm(
  form: Omit<IntelligentForm, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<IntelligentForm> {
  const newForm: IntelligentForm = {
    ...form,
    id: `form-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return simulateLatency(newForm);
}

export async function getIntelligentForms(
  funnelId?: string,
  landingPageId?: string,
): Promise<IntelligentForm[]> {
  // Simulación de formularios guardados
  const mockForms: IntelligentForm[] = [
    {
      id: 'form-1',
      name: 'Formulario de Captación - Objetivos y Disponibilidad',
      description: 'Formulario inteligente para captar objetivos y disponibilidad de nuevos leads',
      funnelId: funnelId,
      landingPageId: landingPageId,
      fields: [
        {
          id: 'field-email',
          label: 'Email',
          fieldType: 'email',
          required: true,
          placeholder: 'tu@email.com',
          dataCategory: 'contact',
          mappingField: 'email',
        },
        {
          id: 'field-objectives',
          label: '¿Cuál es tu objetivo principal?',
          fieldType: 'select',
          required: true,
          options: ['Pérdida de peso', 'Ganancia muscular', 'Mejorar condición física', 'Otro'],
          dataCategory: 'objectives',
          mappingField: 'objetivo_principal',
        },
        {
          id: 'field-availability-time',
          label: '¿En qué horario prefieres entrenar?',
          fieldType: 'select',
          required: false,
          options: ['Mañana', 'Tarde', 'Noche', 'Flexible'],
          dataCategory: 'availability',
          mappingField: 'horario_preferido',
        },
      ],
      settings: {
        showProgress: true,
        redirectUrl: '/gracias',
        thankYouMessage: '¡Gracias! Te contactaremos pronto.',
        autoQualify: true,
        triggerCampaigns: ['campaign-1'],
      },
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  return simulateLatency(mockForms.filter((f) => 
    (!funnelId || f.funnelId === funnelId) && 
    (!landingPageId || f.landingPageId === landingPageId)
  ));
}

export async function submitIntelligentForm(
  formId: string,
  responses: Record<string, any>,
): Promise<FormSubmission> {
  // Simulación de envío de formulario
  const submission: FormSubmission = {
    formId,
    responses,
    submittedAt: new Date().toISOString(),
    qualified: true,
    qualificationScore: 85,
    triggeredCampaigns: ['campaign-1'],
  };
  return simulateLatency(submission);
}

// US-FA-07: A/B tests guiados por IA
export async function getFunnelExperiments(
  funnelId?: string,
): Promise<FunnelExperiment[]> {
  const experiments: FunnelExperiment[] = [
    {
      id: 'exp-1',
      funnelId: funnelId || 'fun-fa-1',
      name: 'Test de Headline - Landing Evergreen',
      description: 'Prueba de headlines alternativos para mejorar conversión',
      type: 'headline',
      status: 'running',
      objective: 'Mejorar conversión de formulario',
      trafficSplit: 50,
      startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      variants: [
        {
          id: 'var-a',
          experimentId: 'exp-1',
          name: 'Versión A - Control',
          description: 'Headline original',
          isControl: true,
          content: {
            headline: 'Transforma tu vida en 12 semanas',
            subheadline: 'Programa personalizado de entrenamiento',
            ctaText: 'Descarga tu plan gratis',
            aiGenerated: false,
          },
          visitors: 1240,
          conversions: 62,
          conversionRate: 5.0,
          revenue: 5580,
          averageTimeOnPage: 145,
          bounceRate: 42,
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'var-b',
          experimentId: 'exp-1',
          name: 'Versión B - Headline Agresivo',
          description: 'Headline más directo y orientado a resultados',
          isControl: false,
          content: {
            headline: 'Pierde 10kg en 12 semanas o te devolvemos el dinero',
            subheadline: 'Método probado con más de 500 clientes',
            ctaText: 'Comienza ahora',
            aiGenerated: true,
            aiReasoning: 'Headline más directo con garantía para aumentar confianza y conversión',
          },
          visitors: 1218,
          conversions: 85,
          conversionRate: 7.0,
          revenue: 7650,
          averageTimeOnPage: 178,
          bounceRate: 35,
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      totalVisitors: 2458,
      totalConversions: 147,
      averageConversionRate: 6.0,
      confidence: 95,
      lift: 40,
      statisticalSignificance: 95,
      winner: 'var-b',
      aiSuggestions: [
        {
          id: 'ai-suggestion-1',
          title: 'Test de Oferta Especial',
          description: 'Prueba añadir una oferta de descuento limitada',
          variantType: 'offer',
          expectedImpact: 'high',
          reasoning: 'Las ofertas especiales aumentan la urgencia y pueden mejorar la conversión',
          estimatedLift: 25,
          suggestedContent: {
            offerTitle: 'Oferta Especial: 20% OFF',
            offerDescription: 'Solo válido para las primeras 50 personas',
            offerDiscount: 20,
            offerValue: '€89/mes',
          },
        },
      ],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'exp-2',
      funnelId: funnelId || 'fun-fa-2',
      name: 'Test de CTA - Formulario',
      description: 'Prueba de diferentes textos de CTA',
      type: 'cta',
      status: 'completed',
      objective: 'Mejorar tasa de envío de formulario',
      trafficSplit: 50,
      startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      variants: [
        {
          id: 'var-c',
          experimentId: 'exp-2',
          name: 'Versión A - Control',
          isControl: true,
          content: {
            ctaText: 'Enviar',
          },
          visitors: 850,
          conversions: 34,
          conversionRate: 4.0,
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'var-d',
          experimentId: 'exp-2',
          name: 'Versión B - CTA Personalizado',
          isControl: false,
          content: {
            ctaText: 'Obtener mi plan gratis',
            aiGenerated: true,
            aiReasoning: 'CTA más descriptivo y orientado a beneficios',
          },
          visitors: 845,
          conversions: 51,
          conversionRate: 6.0,
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
      totalVisitors: 1695,
      totalConversions: 85,
      averageConversionRate: 5.0,
      confidence: 98,
      lift: 50,
      statisticalSignificance: 98,
      winner: 'var-d',
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  return simulateLatency(
    funnelId ? experiments.filter((e) => e.funnelId === funnelId) : experiments,
  );
}

export async function getFunnelExperiment(experimentId: string): Promise<FunnelExperiment | null> {
  const experiments = await getFunnelExperiments();
  return simulateLatency(experiments.find((e) => e.id === experimentId) || null);
}

export async function createFunnelExperiment(
  experiment: Omit<FunnelExperiment, 'id' | 'createdAt' | 'updatedAt' | 'totalVisitors' | 'totalConversions' | 'averageConversionRate'>,
): Promise<FunnelExperiment> {
  const newExperiment: FunnelExperiment = {
    ...experiment,
    id: `exp-${Date.now()}`,
    totalVisitors: 0,
    totalConversions: 0,
    averageConversionRate: 0,
    variants: experiment.variants.map((v, idx) => ({
      ...v,
      id: `var-${idx === 0 ? 'a' : idx === 1 ? 'b' : String.fromCharCode(99 + idx)}`,
      experimentId: `exp-${Date.now()}`,
      visitors: 0,
      conversions: 0,
      conversionRate: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return simulateLatency(newExperiment);
}

export async function updateFunnelExperimentStatus(
  experimentId: string,
  status: FunnelExperimentStatus,
): Promise<FunnelExperiment> {
  const experiment = await getFunnelExperiment(experimentId);
  if (!experiment) {
    throw new Error('Experimento no encontrado');
  }

  return simulateLatency({
    ...experiment,
    status,
    updatedAt: new Date().toISOString(),
  });
}

export async function generateAIExperimentSuggestions(
  funnelId: string,
  experimentType: FunnelExperimentType,
): Promise<AIExperimentSuggestion[]> {
  // Simulación de sugerencias IA
  const suggestions: AIExperimentSuggestion[] = [
    {
      id: 'ai-sug-1',
      title: 'Test de Headline con Urgencia',
      description: 'Añade urgencia al headline para aumentar conversiones',
      variantType: 'headline',
      expectedImpact: 'high',
      reasoning: 'Los headlines con urgencia pueden aumentar la conversión hasta en un 30%',
      estimatedLift: 30,
      suggestedContent: {
        headline: 'Últimas 24 horas: Oferta Especial de Lanzamiento',
        subheadline: 'No te pierdas esta oportunidad única',
      },
    },
    {
      id: 'ai-sug-2',
      title: 'Test de Oferta con Garantía',
      description: 'Añade una garantía de devolución de dinero',
      variantType: 'offer',
      expectedImpact: 'high',
      reasoning: 'Las garantías aumentan la confianza y reducen la fricción de compra',
      estimatedLift: 25,
      suggestedContent: {
        offerTitle: 'Garantía de 30 días',
        offerDescription: 'Si no estás satisfecho, te devolvemos el dinero',
      },
    },
  ];

  return simulateLatency(suggestions);
}

// US-FA-08: Identificación de cuellos de botella por etapa
export async function getFunnelPerformanceAnalysis(
  funnelId: string,
  period: FunnelsAcquisitionPeriod = '30d',
): Promise<FunnelPerformanceAnalysis> {
  // Datos simulados de análisis de performance
  const stages: FunnelStageMetrics[] = [
    {
      stageId: 'stage-1',
      stageType: 'visitas',
      stageName: 'Visitas a la Landing',
      order: 1,
      visitors: 5000,
      entries: 5000,
      exits: 3500,
      conversions: 1500,
      conversionRate: 30.0,
      dropoffRate: 70.0,
      averageTime: 120,
      bottleneckScore: 25,
      severity: 'low',
      comparison: {
        previousPeriod: '7d',
        conversionRateChange: 2.5,
        conversionRateChangePercentage: 9.1,
        trendDirection: 'up',
      },
    },
    {
      stageId: 'stage-2',
      stageType: 'formulario',
      stageName: 'Completar Formulario',
      order: 2,
      visitors: 1500,
      entries: 1500,
      exits: 900,
      conversions: 600,
      conversionRate: 40.0,
      dropoffRate: 60.0,
      averageTime: 180,
      bottleneckScore: 45,
      severity: 'medium',
      comparison: {
        previousPeriod: '7d',
        conversionRateChange: -3.0,
        conversionRateChangePercentage: -7.0,
        trendDirection: 'down',
      },
    },
    {
      stageId: 'stage-3',
      stageType: 'consulta',
      stageName: 'Agendar Consulta',
      order: 3,
      visitors: 600,
      entries: 600,
      exits: 360,
      conversions: 240,
      conversionRate: 40.0,
      dropoffRate: 60.0,
      averageTime: 240,
      bottleneckScore: 60,
      severity: 'high',
      comparison: {
        previousPeriod: '7d',
        conversionRateChange: -5.0,
        conversionRateChangePercentage: -11.1,
        trendDirection: 'down',
      },
    },
    {
      stageId: 'stage-4',
      stageType: 'cierre',
      stageName: 'Cierre de Venta',
      order: 4,
      visitors: 240,
      entries: 240,
      exits: 144,
      conversions: 96,
      conversionRate: 40.0,
      dropoffRate: 60.0,
      averageTime: 300,
      bottleneckScore: 75,
      severity: 'critical',
      comparison: {
        previousPeriod: '7d',
        conversionRateChange: -8.0,
        conversionRateChangePercentage: -16.7,
        trendDirection: 'down',
      },
    },
  ];

  const bottlenecks: FunnelBottleneck[] = [
    {
      id: 'bottleneck-1',
      funnelId,
      stageId: 'stage-4',
      stageType: 'cierre',
      stageName: 'Cierre de Venta',
      severity: 'critical',
      problem: 'Tasa de conversión de cierre muy baja (40%)',
      impact: 'Se están perdiendo 144 leads potenciales en la etapa de cierre',
      affectedLeads: 144,
      potentialLoss: 144,
      potentialRevenue: 12960, // 144 * €90 promedio
      detectedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      metrics: stages[3],
      aiRecommendations: [
        {
          id: 'rec-1',
          title: 'Mejorar oferta de cierre',
          description: 'Añade una oferta especial o descuento para leads que están en la etapa de cierre',
          actionType: 'improve_offer',
          priority: 'high',
          estimatedImpact: 'high',
          estimatedLift: 25,
          reasoning: 'Una oferta especial puede aumentar la conversión de cierre en un 25%',
          steps: [
            'Crear oferta especial para leads en etapa de cierre',
            'Enviar email con oferta personalizada',
            'Añadir urgencia (ej: válido solo 48h)',
            'Seguimiento por WhatsApp',
          ],
          resources: [
            {
              title: 'Guía de Ofertas de Cierre',
              url: '/docs/guides/closing-offers',
            },
          ],
        },
        {
          id: 'rec-2',
          title: 'Nurture leads fríos',
          description: 'Implementa una secuencia de nurturing para leads que no cierran',
          actionType: 'nurture_leads',
          priority: 'high',
          estimatedImpact: 'medium',
          estimatedLift: 15,
          reasoning: 'El nurturing puede recuperar hasta el 15% de los leads que no cierran',
          steps: [
            'Crear secuencia de email de nurturing',
            'Añadir contenido de valor',
            'Incluir testimonios y casos de éxito',
            'Ofrecer consulta gratuita',
          ],
        },
      ],
    },
    {
      id: 'bottleneck-2',
      funnelId,
      stageId: 'stage-3',
      stageType: 'consulta',
      stageName: 'Agendar Consulta',
      severity: 'high',
      problem: 'Tasa de abandono alta en agendamiento de consulta (60%)',
      impact: 'Se están perdiendo 360 leads en la etapa de consulta',
      affectedLeads: 360,
      potentialLoss: 360,
      potentialRevenue: 32400,
      detectedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      metrics: stages[2],
      aiRecommendations: [
        {
          id: 'rec-3',
          title: 'Optimizar formulario de agendamiento',
          description: 'Simplifica el proceso de agendamiento para reducir la fricción',
          actionType: 'optimize_form',
          priority: 'high',
          estimatedImpact: 'high',
          estimatedLift: 20,
          reasoning: 'Formularios más simples pueden aumentar la conversión hasta en un 20%',
          steps: [
            'Reducir campos del formulario',
            'Añadir calendario visual',
            'Permitir agendamiento rápido',
            'Enviar recordatorio automático',
          ],
        },
        {
          id: 'rec-4',
          title: 'Ajustar timing de seguimiento',
          description: 'Contacta a los leads más rápido después del formulario',
          actionType: 'adjust_timing',
          priority: 'medium',
          estimatedImpact: 'medium',
          estimatedLift: 10,
          reasoning: 'El contacto rápido (menos de 1 hora) aumenta la conversión',
          steps: [
            'Configurar notificación inmediata',
            'Enviar email de confirmación',
            'Llamada o WhatsApp en menos de 1 hora',
            'Seguimiento automático',
          ],
        },
      ],
    },
  ];

  const topBottleneck = bottlenecks.find((b) => b.severity === 'critical') || bottlenecks[0];

  const healthScore = Math.max(
    0,
    100 - bottlenecks.reduce((sum, b) => {
      const severityScore = b.severity === 'critical' ? 30 : b.severity === 'high' ? 20 : b.severity === 'medium' ? 10 : 0;
      return sum + severityScore;
    }, 0),
  );

  const analysis: FunnelPerformanceAnalysis = {
    funnelId,
    funnelName: 'Funnel Evergreen',
    period,
    totalVisitors: 5000,
    totalConversions: 96,
    overallConversionRate: 1.92,
    stages,
    bottlenecks,
    topBottleneck,
    healthScore,
    trendDirection: 'down',
    comparison: {
      previousPeriod: '7d',
      conversionRateChange: -2.0,
      conversionRateChangePercentage: -51.0,
      trendDirection: 'down',
    },
    recommendations: bottlenecks.flatMap((b) => b.aiRecommendations),
    lastAnalyzedAt: new Date().toISOString(),
  };

  return simulateLatency(analysis);
}

export async function getFunnelBottlenecks(
  funnelId?: string,
): Promise<FunnelBottleneck[]> {
  if (!funnelId) {
    return simulateLatency([]);
  }

  const analysis = await getFunnelPerformanceAnalysis(funnelId);
  return simulateLatency(analysis.bottlenecks);
}

// US-FA-016: Recomendaciones de nurturing según respuestas del lead magnet
export async function getNurturingRecommendations(
  request: NurturingRecommendationRequest,
): Promise<NurturingRecommendation> {
  // Analizar respuestas del formulario
  const analysis: LeadMagnetResponseAnalysis = {
    formSubmissionId: request.formSubmissionId,
    leadMagnetId: request.leadMagnetId,
    responses: request.responses,
    analyzedAt: new Date().toISOString(),
    insights: {
      primaryObjective: request.responses['objetivo_principal'] || request.responses['objetivo'] || 'Mejorar condición física',
      urgencyLevel: request.responses['urgencia'] === 'alta' ? 'high' : request.responses['urgencia'] === 'media' ? 'medium' : 'low',
      budgetRange: request.responses['presupuesto'] || request.responses['budget'] || 'medio',
      preferredContactMethod: request.responses['canal_preferido'] || 'email',
      painPoints: request.responses['dolores'] ? (Array.isArray(request.responses['dolores']) ? request.responses['dolores'] : [request.responses['dolores']]) : [],
      interests: request.responses['intereses'] ? (Array.isArray(request.responses['intereses']) ? request.responses['intereses'] : [request.responses['intereses']]) : [],
    },
  };

  // Generar recomendaciones basadas en el análisis
  const recommendations: NurturingStepRecommendation[] = [];

  // Paso 1: Email inmediato de bienvenida
  recommendations.push({
    id: 'nurture-1',
    stepNumber: 1,
    channel: 'email',
    timing: 'immediate',
    priority: 'high',
    title: 'Email de bienvenida personalizado',
    messageTemplate: `Hola {{nombre}}, gracias por descargar {{lead_magnet}}. Basado en tu objetivo de {{objetivo}}, te comparto...`,
    personalizationVariables: ['nombre', 'lead_magnet', 'objetivo'],
    suggestedContent: {
      subject: `¡Bienvenido! Tu guía de ${analysis.insights.primaryObjective} está lista`,
      body: `Hola {{nombre}},\n\nGracias por descargar nuestro recurso. Veo que tu objetivo principal es ${analysis.insights.primaryObjective}.\n\nTe he preparado contenido específico para ayudarte a alcanzar tus metas. En los próximos días recibirás:\n\n• Tips personalizados según tu objetivo\n• Casos de éxito de clientes similares\n• Una invitación a una consulta gratuita\n\n¿Tienes alguna pregunta? Responde a este email y te ayudo personalmente.\n\n{{cta_consulta}}`,
      cta: 'Agendar consulta gratuita',
    },
    reasoning: 'Email inmediato de bienvenida personalizado según el objetivo declarado aumenta el engagement inicial',
    expectedImpact: 'high',
  });

  // Paso 2: Email de valor (24h después)
  recommendations.push({
    id: 'nurture-2',
    stepNumber: 2,
    channel: 'email',
    timing: '24h',
    priority: 'high',
    title: 'Email con contenido de valor',
    messageTemplate: `{{nombre}}, aquí tienes el primer tip para alcanzar tu objetivo de {{objetivo}}...`,
    personalizationVariables: ['nombre', 'objetivo'],
    suggestedContent: {
      subject: `3 errores que te impiden alcanzar tu objetivo de ${analysis.insights.primaryObjective}`,
      body: `Hola {{nombre}},\n\nEn mi experiencia ayudando a personas con tu mismo objetivo (${analysis.insights.primaryObjective}), he identificado 3 errores comunes que frenan el progreso:\n\n1. [Error específico relacionado con el objetivo]\n2. [Error específico relacionado con el objetivo]\n3. [Error específico relacionado con el objetivo]\n\nLa buena noticia es que todos son evitables. En mi próxima comunicación te compartiré cómo solucionarlos.\n\n{{cta_consulta}}`,
      cta: 'Quiero una consulta personalizada',
    },
    reasoning: 'Contenido educativo específico según el objetivo mantiene el interés y posiciona como experto',
    expectedImpact: 'high',
  });

  // Paso 3: WhatsApp (48h después, si no ha respondido)
  if (analysis.insights.preferredContactMethod === 'whatsapp' || analysis.insights.urgencyLevel === 'high') {
    recommendations.push({
      id: 'nurture-3',
      stepNumber: 3,
      channel: 'whatsapp',
      timing: '48h',
      priority: 'high',
      title: 'Mensaje WhatsApp personalizado',
      messageTemplate: `Hola {{nombre}}, vi que descargaste {{lead_magnet}}. ¿Cómo va tu progreso hacia {{objetivo}}?`,
      personalizationVariables: ['nombre', 'lead_magnet', 'objetivo'],
      suggestedContent: {
        body: `Hola {{nombre}} 👋\n\nVi que descargaste nuestro recurso sobre ${analysis.insights.primaryObjective}. ¿Cómo va tu progreso?\n\nSi tienes alguna pregunta o quieres una consulta gratuita para personalizar tu plan, estaré encantado de ayudarte.\n\n¿Te parece bien si hablamos esta semana?`,
        cta: 'Agendar consulta',
      },
      conditions: [
        {
          fieldId: 'email_opened',
          operator: 'equals',
          value: false,
        },
      ],
      reasoning: 'WhatsApp personalizado para leads de alta urgencia o que prefieren este canal aumenta la tasa de respuesta',
      expectedImpact: 'high',
    });
  }

  // Paso 4: Email con caso de éxito (3 días después)
  recommendations.push({
    id: 'nurture-4',
    stepNumber: 4,
    channel: 'email',
    timing: '1w',
    priority: 'medium',
    title: 'Email con caso de éxito',
    messageTemplate: `{{nombre}}, te comparto cómo {{cliente_similar}} logró {{objetivo}} en {{tiempo}}...`,
    personalizationVariables: ['nombre', 'objetivo'],
    suggestedContent: {
      subject: `Cómo ${analysis.insights.primaryObjective} cambió la vida de [Cliente]`,
      body: `Hola {{nombre}},\n\nTe quería compartir la historia de [Cliente], que tenía un objetivo similar al tuyo: ${analysis.insights.primaryObjective}.\n\n[Historia del caso de éxito]\n\n¿Te gustaría tener resultados similares? Podemos agendar una consulta gratuita para crear tu plan personalizado.\n\n{{cta_consulta}}`,
      cta: 'Quiero mi plan personalizado',
    },
    reasoning: 'Casos de éxito específicos según el objetivo generan confianza y motivación',
    expectedImpact: 'medium',
  });

  const personalizedMessage = `Basado en tu objetivo de ${analysis.insights.primaryObjective} y tus respuestas, he preparado una secuencia de nurturing personalizada que te ayudará a avanzar hacia tus metas.`;

  const recommendation: NurturingRecommendation = {
    id: `nurture-rec-${Date.now()}`,
    leadMagnetId: request.leadMagnetId,
    leadMagnetName: 'Lead Magnet Personalizado',
    formSubmissionId: request.formSubmissionId,
    leadId: request.leadId,
    recommendations,
    personalizedMessage,
    reasoning: `Las recomendaciones están basadas en tu objetivo principal (${analysis.insights.primaryObjective}), nivel de urgencia (${analysis.insights.urgencyLevel}) y preferencias de contacto. Esta secuencia está diseñada para nutrirte con contenido relevante y guiarte hacia una consulta personalizada.`,
    estimatedConversionLift: 35,
    createdAt: new Date().toISOString(),
  };

  return simulateLatency(recommendation);
}

export async function analyzeLeadMagnetResponses(
  formSubmissionId: string,
  leadMagnetId: string,
  responses: Record<string, any>,
): Promise<LeadMagnetResponseAnalysis> {
  const analysis: LeadMagnetResponseAnalysis = {
    formSubmissionId,
    leadMagnetId,
    responses,
    analyzedAt: new Date().toISOString(),
    insights: {
      primaryObjective: responses['objetivo_principal'] || responses['objetivo'] || undefined,
      urgencyLevel: responses['urgencia'] === 'alta' ? 'high' : responses['urgencia'] === 'media' ? 'medium' : 'low',
      budgetRange: responses['presupuesto'] || responses['budget'] || undefined,
      preferredContactMethod: responses['canal_preferido'] || undefined,
      painPoints: responses['dolores'] ? (Array.isArray(responses['dolores']) ? responses['dolores'] : [responses['dolores']]) : [],
      interests: responses['intereses'] ? (Array.isArray(responses['intereses']) ? responses['intereses'] : [responses['intereses']]) : [],
    },
  };

  return simulateLatency(analysis);
}

// US-FA-017: Enviar funnel a Campañas & Automatización
export async function exportFunnelToCampaigns(
  request: FunnelExportRequest,
): Promise<FunnelExportResponse> {
  // Simular obtención de datos del funnel
  // En producción, esto obtendría los datos reales del funnel
  const funnelData = {
    id: request.funnelId,
    name: 'Funnel de Ejemplo',
    stages: [
      {
        id: 'stage-1',
        name: 'Landing Page',
        type: 'Captación',
        messaging: 'Bienvenido a nuestro programa',
      },
      {
        id: 'stage-2',
        name: 'Email Sequence',
        type: 'Nurturing',
        messaging: 'Email de bienvenida con contenido de valor',
        delay: { value: 24, unit: 'hours' },
      },
      {
        id: 'stage-3',
        name: 'WhatsApp Follow-up',
        type: 'Nurturing',
        messaging: 'Mensaje personalizado de seguimiento',
        delay: { value: 48, unit: 'hours' },
      },
    ],
  };

  // Construir el paquete de exportación
  const messages: FunnelExportMessage[] = [];
  const sequences: FunnelExportSequence[] = [];
  const campaigns: FunnelExportCampaign[] = [];
  const lists: FunnelExportList[] = [];

  if (request.includeAssets) {
    funnelData.stages.forEach((stage, index) => {
      if (stage.messaging) {
        messages.push({
          id: `msg-${stage.id}`,
          stageId: stage.id,
          stageName: stage.name,
          channel: stage.type === 'Nurturing' && index > 0 ? 'email' : 'email',
          subject: index === 0 ? undefined : `Seguimiento: ${stage.name}`,
          content: stage.messaging,
          variables: ['nombre', 'objetivo'],
          cta: index === funnelData.stages.length - 1 ? {
            text: 'Agendar consulta',
            url: '/agendar',
          } : undefined,
        });
      }
    });
  }

  if (request.includeSequences) {
    sequences.push({
      id: `seq-${request.funnelId}`,
      name: `Secuencia: ${funnelData.name}`,
      description: `Secuencia de nurturing para el funnel ${funnelData.name}`,
      trigger: {
        type: 'form_submission',
        conditions: {
          funnelId: request.funnelId,
        },
      },
      steps: messages
        .filter((msg, idx) => idx > 0)
        .map((msg, idx) => ({
          stepNumber: idx + 1,
          delay: {
            value: idx === 0 ? 24 : idx === 1 ? 48 : 72,
            unit: 'hours' as const,
          },
          messageId: msg.id,
        })),
      totalDuration: '7 días',
    });
  }

  if (request.includeCampaigns) {
    campaigns.push({
      id: `camp-${request.funnelId}`,
      name: `Campaña: ${funnelData.name}`,
      description: `Campaña exportada desde el funnel ${funnelData.name}`,
      channel: 'multi',
      objective: 'Nurturing y conversión',
      targetAudience: `Leads del funnel ${funnelData.name}`,
      status: 'draft',
    });
  }

  if (request.includeLists) {
    lists.push({
      id: `list-${request.funnelId}`,
      name: `Lista: ${funnelData.name}`,
      description: `Lista de leads del funnel ${funnelData.name}`,
      segmentCriteria: {
        funnelId: request.funnelId,
      },
      estimatedSize: 0,
    });
  }

  const exportPackage: FunnelExportPackage = {
    funnelId: request.funnelId,
    funnelName: funnelData.name,
    exportedAt: new Date().toISOString(),
    exportedBy: 'current-user',
    assets: {
      messages,
      templates: messages.map((msg) => ({
        id: `tpl-${msg.id}`,
        name: `Plantilla: ${msg.stageName}`,
        type: msg.channel,
        content: msg.content,
        variables: msg.variables,
        category: 'Funnel Export',
      })),
    },
    campaigns,
    sequences,
    lists,
    timing: {
      timezone: 'Europe/Madrid',
      delays: funnelData.stages
        .filter((s) => s.delay)
        .map((s) => ({
          stageId: s.id,
          delay: s.delay!,
        })),
    },
    metadata: {
      version: '1.0',
      notes: request.notes,
      tags: ['funnel-export', request.funnelId],
    },
  };

  const response: FunnelExportResponse = {
    exportPackage,
    success: true,
    message: request.targetCampaignsModule
      ? `Funnel exportado exitosamente a Campañas & Automatización. Se crearon ${campaigns.length} campaña(s) y ${sequences.length} secuencia(s).`
      : `Paquete de exportación creado exitosamente con ${messages.length} mensaje(s), ${sequences.length} secuencia(s) y ${campaigns.length} campaña(s).`,
    importedCampaignIds: request.targetCampaignsModule ? campaigns.map((c) => c.id) : undefined,
    importedSequenceIds: request.targetCampaignsModule ? sequences.map((s) => s.id) : undefined,
  };

  return simulateLatency(response);
}

// US-FA-018: Convertir rápidamente un funnel en reto/comunidad
export async function convertFunnelToChallenge(
  request: import('../types').FunnelToChallengeConversion,
): Promise<import('../types').FunnelToChallengeConversionResponse> {
  // Simulación de conversión de funnel a reto/comunidad
  const challengeId = `challenge-${Date.now()}`;
  const challengeName = request.challengeName || `${request.funnelName} - Reto`;

  // Calcular fecha de fin si no se proporciona
  let endDate = request.endDate;
  if (!endDate && request.startDate) {
    const start = new Date(request.startDate);
    const durationDays =
      request.duration === 'custom'
        ? request.customDurationDays || 30
        : parseInt(request.duration.replace('d', ''));
    const end = new Date(start);
    end.setDate(end.getDate() + durationDays);
    endDate = end.toISOString();
  }

  const response: import('../types').FunnelToChallengeConversionResponse = {
    challengeId,
    challengeName,
    challengeType: request.challengeType,
    success: true,
    message: `Funnel "${request.funnelName}" convertido exitosamente a ${request.challengeType}`,
    convertedParticipants: request.includeParticipants ? 45 : 0, // Simulación
    convertedContent: request.includeContent ? 12 : 0, // Simulación
    convertedAutomations: request.includeAutomation ? 3 : 0, // Simulación
    warnings: [],
  };

  return simulateLatency(response);
}

// US-FA-019: Conectar funnels con contenidos existentes (reels top, testimonios)
// Obtener reels top de redes sociales
export async function getTopReels(
  limit: number = 10,
  minEngagement?: number,
): Promise<import('../types').SocialMediaReel[]> {
  // Simulación de obtención de reels top
  const reels: import('../types').SocialMediaReel[] = [
    {
      id: 'reel-1',
      platform: 'instagram',
      url: 'https://instagram.com/reel/abc123',
      thumbnailUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48',
      title: 'Transformación en 12 semanas',
      description: 'Mira cómo este cliente logró sus objetivos',
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      engagement: {
        likes: 1250,
        comments: 89,
        shares: 45,
        views: 15200,
        totalEngagement: 1384,
      },
      metrics: {
        leadsGenerated: 12,
        conversionsGenerated: 3,
        engagementRate: 9.1,
      },
    },
    {
      id: 'reel-2',
      platform: 'tiktok',
      url: 'https://tiktok.com/@trainer/video/xyz789',
      thumbnailUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
      title: 'Rutina HIIT de 15 minutos',
      description: 'Entrenamiento intenso para quemar calorías',
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      engagement: {
        likes: 8900,
        comments: 234,
        shares: 567,
        views: 45600,
        totalEngagement: 9701,
      },
      metrics: {
        leadsGenerated: 8,
        conversionsGenerated: 2,
        engagementRate: 21.3,
      },
    },
    {
      id: 'reel-3',
      platform: 'instagram',
      url: 'https://instagram.com/reel/def456',
      thumbnailUrl: 'https://images.unsplash.com/photo-1556910096-6f5e72db6803',
      title: 'Testimonial: Pérdida de peso',
      description: 'Cliente compartió su historia de éxito',
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      engagement: {
        likes: 2100,
        comments: 156,
        shares: 78,
        views: 18900,
        totalEngagement: 2334,
      },
      metrics: {
        leadsGenerated: 15,
        conversionsGenerated: 5,
        engagementRate: 12.3,
      },
    },
  ];

  let filtered = reels;
  if (minEngagement) {
    filtered = filtered.filter((reel) => reel.metrics.engagementRate >= minEngagement);
  }

  return simulateLatency(filtered.slice(0, limit));
}

// Obtener testimonios top
export async function getTopTestimonials(
  limit: number = 10,
  minScore?: number,
): Promise<import('../types').TestimonialContent[]> {
  // Simulación de obtención de testimonios top
  const testimonials: import('../types').TestimonialContent[] = [
    {
      id: 'testimonial-1',
      customerName: 'María González',
      customerId: 'customer-123',
      quote: 'He perdido 15kg en 3 meses y me siento mejor que nunca. El entrenamiento personalizado marcó la diferencia.',
      score: 5,
      type: 'texto',
      channel: 'Google Reviews',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ['pérdida de peso', 'transformación', 'resultados'],
      status: 'publicado',
      metrics: {
        views: 1250,
        conversions: 8,
        engagement: 156,
      },
    },
    {
      id: 'testimonial-2',
      customerName: 'Carlos Ruiz',
      customerId: 'customer-456',
      quote: 'El mejor entrenador que he tenido. Me ayudó a ganar 8kg de músculo y aumentar mi fuerza en un 40%.',
      score: 5,
      type: 'video',
      mediaUrl: 'https://example.com/videos/testimonial-carlos.mp4',
      channel: 'Instagram',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ['ganancia muscular', 'fuerza', 'resultados'],
      status: 'publicado',
      metrics: {
        views: 3200,
        conversions: 12,
        engagement: 289,
      },
    },
    {
      id: 'testimonial-3',
      customerName: 'Ana Martínez',
      customerId: 'customer-789',
      quote: 'Después de 6 meses, logré correr mi primera maratón. Gracias por el apoyo constante y la motivación.',
      score: 5,
      type: 'texto',
      channel: 'Facebook',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ['running', 'maratón', 'objetivos'],
      status: 'publicado',
      metrics: {
        views: 890,
        conversions: 5,
        engagement: 98,
      },
    },
  ];

  let filtered = testimonials;
  if (minScore) {
    filtered = filtered.filter((testimonial) => (testimonial.score || 0) >= minScore);
  }

  return simulateLatency(filtered.slice(0, limit));
}

// Obtener recomendaciones de contenido para un funnel
export async function getFunnelContentRecommendations(
  funnelId: string,
  stageId?: string,
): Promise<import('../types').FunnelContentRecommendation[]> {
  // Obtener reels y testimonios top
  const [reels, testimonials] = await Promise.all([
    getTopReels(5, 8),
    getTopTestimonials(5, 4),
  ]);

  const recommendations: import('../types').FunnelContentRecommendation[] = [];

  // Agregar recomendaciones de reels
  reels.forEach((reel) => {
    recommendations.push({
      contentId: reel.id,
      contentType: 'reel',
      contentData: reel,
      recommendationScore: reel.metrics.engagementRate * 10, // Score basado en engagement
      reason: `Reel con alto engagement (${reel.metrics.engagementRate}%) y ${reel.metrics.leadsGenerated} leads generados`,
      suggestedPlacement: 'social_proof',
      estimatedImpact: reel.metrics.engagementRate > 15 ? 'high' : reel.metrics.engagementRate > 10 ? 'medium' : 'low',
    });
  });

  // Agregar recomendaciones de testimonios
  testimonials.forEach((testimonial) => {
    recommendations.push({
      contentId: testimonial.id,
      contentType: 'testimonial',
      contentData: testimonial,
      recommendationScore: (testimonial.score || 0) * 20 + (testimonial.metrics?.conversions || 0) * 5,
      reason: `Testimonio con ${testimonial.score} estrellas y ${testimonial.metrics?.conversions || 0} conversiones`,
      suggestedPlacement: 'testimonials',
      estimatedImpact: (testimonial.score || 0) >= 5 ? 'high' : 'medium',
    });
  });

  // Ordenar por score de recomendación
  recommendations.sort((a, b) => b.recommendationScore - a.recommendationScore);

  return simulateLatency(recommendations);
}

// Conectar contenidos a un funnel
export async function connectContentToFunnel(
  request: import('../types').FunnelContentConnectionRequest,
): Promise<import('../types').FunnelContentConnectionResponse> {
  // Si autoSelect está activado, obtener recomendaciones automáticas
  let contentIds = request.contentIds;
  if (request.autoSelect && request.criteria) {
    const recommendations = await getFunnelContentRecommendations(request.funnelId, request.stageId);
    contentIds = recommendations
      .filter((rec) => {
        if (request.criteria?.minEngagement && rec.contentData.metrics?.engagementRate) {
          return rec.contentData.metrics.engagementRate >= request.criteria.minEngagement;
        }
        if (request.criteria?.minScore && 'score' in rec.contentData && rec.contentData.score) {
          return rec.contentData.score >= request.criteria.minScore;
        }
        return true;
      })
      .slice(0, 5)
      .map((rec) => rec.contentId);
  }

  // Obtener los contenidos seleccionados
  const [reels, testimonials] = await Promise.all([
    getTopReels(20),
    getTopTestimonials(20),
  ]);

  const connections: import('../types').FunnelContent[] = [];
  let order = 1;

  contentIds.forEach((contentId) => {
    // Buscar en reels
    const reel = reels.find((r) => r.id === contentId);
    if (reel) {
      connections.push({
        id: `funnel-content-${Date.now()}-${order}`,
        funnelId: request.funnelId,
        contentType: 'reel',
        contentId: reel.id,
        contentData: reel,
        placement: request.placement,
        stageId: request.stageId,
        order: order++,
        isActive: true,
        addedAt: new Date().toISOString(),
        addedBy: 'current-user',
      });
      return;
    }

    // Buscar en testimonios
    const testimonial = testimonials.find((t) => t.id === contentId);
    if (testimonial) {
      connections.push({
        id: `funnel-content-${Date.now()}-${order}`,
        funnelId: request.funnelId,
        contentType: 'testimonial',
        contentId: testimonial.id,
        contentData: testimonial,
        placement: request.placement,
        stageId: request.stageId,
        order: order++,
        isActive: true,
        addedAt: new Date().toISOString(),
        addedBy: 'current-user',
      });
    }
  });

  const response: import('../types').FunnelContentConnectionResponse = {
    connections,
    success: true,
    message: `${connections.length} contenido(s) conectado(s) exitosamente al funnel`,
    connectedCount: connections.length,
    skippedCount: contentIds.length - connections.length,
    warnings: connections.length < contentIds.length ? ['Algunos contenidos no se encontraron'] : undefined,
  };

  return simulateLatency(response);
}

// Obtener contenidos conectados a un funnel
export async function getFunnelConnectedContent(
  funnelId: string,
  stageId?: string,
): Promise<import('../types').FunnelContent[]> {
  // Simulación de obtención de contenidos conectados
  const [reels, testimonials] = await Promise.all([
    getTopReels(10),
    getTopTestimonials(10),
  ]);

  const connections: import('../types').FunnelContent[] = [
    {
      id: 'funnel-content-1',
      funnelId,
      contentType: 'reel',
      contentId: reels[0].id,
      contentData: reels[0],
      placement: 'social_proof',
      stageId,
      order: 1,
      isActive: true,
      addedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      addedBy: 'current-user',
    },
    {
      id: 'funnel-content-2',
      funnelId,
      contentType: 'testimonial',
      contentId: testimonials[0].id,
      contentData: testimonials[0],
      placement: 'testimonials',
      stageId,
      order: 2,
      isActive: true,
      addedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      addedBy: 'current-user',
    },
  ];

  return simulateLatency(connections.filter((c) => !stageId || c.stageId === stageId));
}

// Desconectar contenido de un funnel
export async function disconnectContentFromFunnel(
  funnelId: string,
  contentConnectionId: string,
): Promise<{ success: boolean; message: string }> {
  // Simulación de desconexión
  return simulateLatency({
    success: true,
    message: 'Contenido desconectado exitosamente del funnel',
  });
}

// US-FA-020: Revenue proyectado por funnel según capacidad y precios
export async function fetchProjectedRevenueByFunnel(
  period: FunnelsAcquisitionPeriod,
): Promise<import('../types').ProjectedRevenueByFunnelResponse> {
  // Obtener funnels activos
  const funnels = await fetchAcquisitionTopFunnels(period);

  const projectedFunnels: import('../types').ProjectedRevenueByFunnel[] = funnels.map((funnel, index) => {
    // Simular datos de capacidad y precios
    const maxCapacity = 50 + index * 20;
    const currentUtilization = 60 + Math.random() * 30;
    const availableSlots = Math.max(0, maxCapacity - (maxCapacity * currentUtilization) / 100);
    
    const basePrice = 80 + index * 30;
    const averageTicket = basePrice * (0.9 + Math.random() * 0.2);
    const discountPercentage = index % 3 === 0 ? 15 : undefined;

    // Calcular revenue proyectado basado en capacidad y precios
    const projectedLeads = maxCapacity;
    const currentLeads = Math.floor(projectedLeads * (currentUtilization / 100));
    const projectedRevenue = projectedLeads * averageTicket * (funnel.conversionRate / 100);
    const currentRevenue = currentLeads * averageTicket * (funnel.conversionRate / 100);
    const revenueGap = projectedRevenue - currentRevenue;

    // Calcular priority score (0-100)
    const capacityScore = (availableSlots / maxCapacity) * 40; // Hasta 40 puntos
    const revenueGapScore = Math.min(40, (revenueGap / projectedRevenue) * 40); // Hasta 40 puntos
    const conversionScore = Math.min(20, (funnel.conversionRate / 10) * 20); // Hasta 20 puntos
    const priorityScore = Math.round(capacityScore + revenueGapScore + conversionScore);

    // Generar recomendaciones
    const recommendations: import('../types').RevenueProjectionRecommendation[] = [];
    
    if (availableSlots > maxCapacity * 0.3) {
      recommendations.push({
        id: `rec-capacity-${funnel.id}`,
        title: 'Aumentar capacidad de captación',
        description: `Tienes ${availableSlots} espacios disponibles. Considera aumentar el tráfico al funnel para maximizar el revenue.`,
        impact: 'high',
        category: 'capacity',
        estimatedRevenueIncrease: availableSlots * averageTicket * (funnel.conversionRate / 100),
        estimatedLift: (availableSlots / maxCapacity) * 100,
        steps: [
          'Aumentar presupuesto en campañas de captación',
          'Optimizar landing pages para mayor conversión',
          'Ampliar canales de marketing',
        ],
      });
    }

    if (revenueGap > projectedRevenue * 0.2) {
      recommendations.push({
        id: `rec-pricing-${funnel.id}`,
        title: 'Optimizar estrategia de precios',
        description: `El gap de revenue es significativo. Revisa la estrategia de precios y ofertas.`,
        impact: 'medium',
        category: 'pricing',
        estimatedRevenueIncrease: revenueGap * 0.3,
        estimatedLift: 15,
        steps: [
          'Analizar elasticidad de precios',
          'Crear ofertas especiales para aumentar conversión',
          'Implementar estrategias de upselling',
        ],
      });
    }

    if (funnel.conversionRate < 5) {
      recommendations.push({
        id: `rec-conversion-${funnel.id}`,
        title: 'Mejorar tasa de conversión',
        description: `La tasa de conversión está por debajo del óptimo. Enfócate en optimizar el funnel.`,
        impact: 'high',
        category: 'conversion',
        estimatedRevenueIncrease: currentRevenue * 0.2,
        estimatedLift: 20,
        steps: [
          'Realizar A/B tests en puntos clave del funnel',
          'Mejorar copy y CTAs',
          'Simplificar el proceso de conversión',
        ],
      });
    }

    return {
      funnelId: funnel.id,
      funnelName: funnel.name,
      stage: funnel.stage,
      capacity: {
        funnelId: funnel.id,
        maxCapacity,
        currentUtilization,
        availableSlots: Math.floor(availableSlots),
        utilizationTrend: currentUtilization > 70 ? 'up' : currentUtilization < 50 ? 'down' : 'neutral',
      },
      pricing: {
        funnelId: funnel.id,
        basePrice,
        averageTicket,
        pricingTier: index % 3 === 0 ? 'premium' : index % 3 === 1 ? 'basic' : 'vip',
        discountPercentage,
      },
      projectedRevenue,
      currentRevenue,
      revenueGap,
      conversionRate: funnel.conversionRate,
      projectedLeads,
      currentLeads,
      priorityScore,
      recommendations,
      period,
    };
  });

  // Ordenar por priority score
  projectedFunnels.sort((a, b) => b.priorityScore - a.priorityScore);

  const totalProjectedRevenue = projectedFunnels.reduce((sum, f) => sum + f.projectedRevenue, 0);
  const totalCurrentRevenue = projectedFunnels.reduce((sum, f) => sum + f.currentRevenue, 0);
  const totalRevenueGap = totalProjectedRevenue - totalCurrentRevenue;

  return simulateLatency({
    period,
    funnels: projectedFunnels,
    totalProjectedRevenue,
    totalCurrentRevenue,
    totalRevenueGap,
    prioritizedFunnels: projectedFunnels.map((f) => f.funnelId),
  });
}

// US-FA-021: Alertas si un funnel de captación no genera leads suficientes antes de una campaña
export async function fetchFunnelLeadGenerationAlerts(): Promise<
  import('../types').FunnelLeadGenerationAlertsResponse
> {
  // Obtener funnels y campañas
  const [funnels, campaigns] = await Promise.all([
    fetchAcquisitionTopFunnels('30d'),
    fetchAcquisitionCampaigns(),
  ]);

  const alerts: import('../types').FunnelLeadGenerationAlert[] = [];
  const upcomingCampaigns: import('../types').CampaignLeadRequirement[] = [];

  // Simular campañas próximas (en los próximos 30 días)
  const now = new Date();
  const upcomingCampaignsData = campaigns
    .filter((campaign) => {
      const startDate = new Date(campaign.startDate);
      const daysUntil = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntil > 0 && daysUntil <= 30 && campaign.status === 'scheduled';
    })
    .slice(0, 3);

  upcomingCampaignsData.forEach((campaign, index) => {
    const startDate = new Date(campaign.startDate);
    const daysUntilCampaign = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    // Asignar un funnel a cada campaña
    const funnel = funnels[index % funnels.length];
    if (!funnel) return;

    // Simular datos de leads
    const requiredLeads = campaign.leadsGenerated * 1.5; // Requiere 50% más leads
    const currentLeads = Math.floor(campaign.leadsGenerated * (0.4 + Math.random() * 0.4)); // 40-80% de lo requerido
    const leadGap = requiredLeads - currentLeads;
    const leadGenerationRate = currentLeads / (30 - daysUntilCampaign + 1); // Leads por día
    const projectedLeadsAtStart = currentLeads + leadGenerationRate * daysUntilCampaign;

    // Determinar severidad
    let severity: import('../types').CampaignLeadAlertSeverity = 'info';
    let alertType: import('../types').FunnelLeadGenerationAlert['alertType'] = 'insufficient_leads';
    let riskLevel: 'high' | 'medium' | 'low' = 'low';

    if (projectedLeadsAtStart < requiredLeads * 0.7) {
      severity = 'critical';
      riskLevel = 'high';
      alertType = 'insufficient_leads';
    } else if (projectedLeadsAtStart < requiredLeads * 0.9) {
      severity = 'warning';
      riskLevel = 'medium';
      alertType = 'low_generation_rate';
    } else {
      severity = 'info';
      riskLevel = 'low';
      alertType = 'timing_risk';
    }

    if (leadGenerationRate < requiredLeads / daysUntilCampaign * 0.8) {
      alertType = 'low_generation_rate';
    }

    // Solo crear alerta si hay un problema
    if (projectedLeadsAtStart < requiredLeads) {
      const message =
        severity === 'critical'
          ? `El funnel "${funnel.name}" no generará suficientes leads para la campaña "${campaign.name}". Se proyectan ${Math.floor(projectedLeadsAtStart)} leads pero se requieren ${requiredLeads}.`
          : severity === 'warning'
          ? `El funnel "${funnel.name}" podría no alcanzar los leads requeridos para "${campaign.name}". Se proyectan ${Math.floor(projectedLeadsAtStart)} de ${requiredLeads} leads necesarios.`
          : `El funnel "${funnel.name}" está cerca del objetivo de leads para "${campaign.name}". Monitorea el progreso.`;

      // Generar acciones recomendadas
      const recommendedActions: import('../types').LeadGenerationAlertAction[] = [];

      if (alertType === 'insufficient_leads' || alertType === 'low_generation_rate') {
        recommendedActions.push({
          id: `action-boost-${campaign.id}`,
          title: 'Potenciar funnel de captación',
          description: `Aumenta el tráfico y optimiza la conversión del funnel para generar más leads antes de la campaña.`,
          priority: severity === 'critical' ? 'high' : 'medium',
          actionType: 'boost_funnel',
          estimatedImpact: 'high',
          estimatedLeadsIncrease: Math.ceil(leadGap * 0.6),
          steps: [
            'Aumentar presupuesto en campañas de captación',
            'Optimizar landing pages y formularios',
            'Ampliar canales de marketing',
            'Mejorar copy y CTAs para mayor conversión',
          ],
          canExecute: true,
        });
      }

      if (daysUntilCampaign > 7) {
        recommendedActions.push({
          id: `action-extend-${campaign.id}`,
          title: 'Extender timeline de captación',
          description: `Considera extender el período de captación antes de la campaña para alcanzar los leads necesarios.`,
          priority: 'medium',
          actionType: 'extend_timeline',
          estimatedImpact: 'medium',
          estimatedLeadsIncrease: Math.ceil(leadGap * 0.4),
          steps: [
            'Evaluar posibilidad de posponer inicio de campaña',
            'Comunicar cambio a stakeholders',
            'Ajustar calendario de marketing',
          ],
          canExecute: true,
        });
      }

      recommendedActions.push({
        id: `action-optimize-${campaign.id}`,
        title: 'Optimizar tasa de conversión',
        description: `Mejora la tasa de conversión del funnel para maximizar los leads generados con el tráfico actual.`,
        priority: 'medium',
        actionType: 'optimize_conversion',
        estimatedImpact: 'high',
        estimatedLeadsIncrease: Math.ceil(currentLeads * 0.2),
        steps: [
          'Realizar A/B tests en puntos clave',
          'Simplificar formularios y proceso',
          'Mejorar mensajes y ofertas',
          'Añadir urgencia y escasez',
        ],
        canExecute: true,
      });

      alerts.push({
        id: `alert-${campaign.id}-${funnel.id}`,
        funnelId: funnel.id,
        funnelName: funnel.name,
        campaignId: campaign.id,
        campaignName: campaign.name,
        severity,
        alertType,
        message,
        currentLeads,
        requiredLeads,
        leadGap,
        daysUntilCampaign,
        leadGenerationRate,
        projectedLeadsAtStart,
        riskLevel,
        recommendedActions,
        detectedAt: new Date().toISOString(),
        campaignStartDate: campaign.startDate,
      });
    }

    // Agregar a campañas próximas
    upcomingCampaigns.push({
      campaignId: campaign.id,
      campaignName: campaign.name,
      startDate: campaign.startDate,
      requiredLeads,
      currentLeads,
      leadGap,
      daysUntilCampaign,
      leadGenerationRate,
      projectedLeadsAtStart,
    });
  });

  const criticalAlerts = alerts.filter((a) => a.severity === 'critical').length;
  const warningAlerts = alerts.filter((a) => a.severity === 'warning').length;
  const infoAlerts = alerts.filter((a) => a.severity === 'info').length;

  return simulateLatency({
    alerts,
    totalAlerts: alerts.length,
    criticalAlerts,
    warningAlerts,
    infoAlerts,
    upcomingCampaigns,
  });
}

// US-FA-022: Registrar notas cualitativas de cada funnel (feedback de prospectos)
export async function getFunnelQualitativeNotes(
  funnelId: string,
): Promise<import('../types').FunnelQualitativeNotesResponse> {
  const funnels = await fetchAcquisitionTopFunnels('30d');
  const funnel = funnels.find((f) => f.id === funnelId);

  if (!funnel) {
    throw new Error(`Funnel with id ${funnelId} not found`);
  }

  // Simular notas cualitativas
  const notes: import('../types').FunnelQualitativeNote[] = [
    {
      id: 'note-1',
      funnelId,
      funnelName: funnel.name,
      note: 'Varios prospectos mencionaron que el precio inicial es demasiado alto. Considerar ofrecer un descuento del 20% para primeros clientes.',
      category: 'feedback_prospecto',
      tags: ['precio', 'objeción', 'descuento'],
      prospectName: 'Cliente A',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: 'user-1',
      priority: 'high',
      actionable: true,
    },
    {
      id: 'note-2',
      funnelId,
      funnelName: funnel.name,
      note: 'El proceso de registro es demasiado largo. Los prospectos abandonan en el paso 3 del formulario.',
      category: 'problema_detectado',
      tags: ['formulario', 'abandono', 'ux'],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: 'user-1',
      priority: 'medium',
      actionable: true,
      actionTaken: 'Formulario simplificado a 2 pasos',
      actionTakenAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'note-3',
      funnelId,
      funnelName: funnel.name,
      note: 'Excelente feedback sobre el contenido del lead magnet. Los prospectos encuentran muy útil la guía de ejercicios.',
      category: 'exito',
      tags: ['lead-magnet', 'contenido', 'feedback-positivo'],
      prospectName: 'Cliente B',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: 'user-1',
      priority: 'low',
      actionable: false,
    },
  ];

  const notesByCategory: Record<string, number> = {};
  notes.forEach((note) => {
    notesByCategory[note.category] = (notesByCategory[note.category] || 0) + 1;
  });

  const insights: import('../types').QualitativeNoteInsight[] = [
    {
      id: 'insight-1',
      title: 'Precio como barrera principal',
      description: 'El precio aparece como objeción principal en múltiples feedbacks',
      category: 'feedback_prospecto',
      frequency: 3,
      suggestedAction: 'Considerar estrategia de precios más flexible o descuentos iniciales',
      impact: 'high',
    },
    {
      id: 'insight-2',
      title: 'Formulario demasiado largo',
      description: 'Abandono frecuente en pasos avanzados del formulario',
      category: 'problema_detectado',
      frequency: 2,
      suggestedAction: 'Simplificar formulario o dividir en múltiples pasos con guardado de progreso',
      impact: 'medium',
    },
  ];

  return simulateLatency({
    funnelId,
    funnelName: funnel.name,
    notes,
    totalNotes: notes.length,
    notesByCategory,
    lastNoteDate: notes[0]?.createdAt,
    insights,
  });
}

export async function createFunnelQualitativeNote(
  request: import('../types').CreateFunnelQualitativeNoteRequest,
): Promise<import('../types').FunnelQualitativeNote> {
  const funnels = await fetchAcquisitionTopFunnels('30d');
  const funnel = funnels.find((f) => f.id === request.funnelId);

  if (!funnel) {
    throw new Error(`Funnel with id ${request.funnelId} not found`);
  }

  const note: import('../types').FunnelQualitativeNote = {
    id: `note-${Date.now()}`,
    funnelId: request.funnelId,
    funnelName: funnel.name,
    note: request.note,
    category: request.category,
    tags: request.tags || [],
    prospectId: request.prospectId,
    prospectName: request.prospectName,
    createdAt: new Date().toISOString(),
    createdBy: 'current-user',
    priority: request.priority || 'medium',
    relatedIteration: request.relatedIteration,
    actionable: request.actionable || false,
  };

  return simulateLatency(note);
}

export async function updateFunnelQualitativeNote(
  request: import('../types').UpdateFunnelQualitativeNoteRequest,
): Promise<import('../types').FunnelQualitativeNote> {
  // En una implementación real, esto obtendría la nota existente y la actualizaría
  const notes = await getFunnelQualitativeNotes('fun-fa-1');
  const existingNote = notes.notes.find((n) => n.id === request.noteId);

  if (!existingNote) {
    throw new Error(`Note with id ${request.noteId} not found`);
  }

  const updatedNote: import('../types').FunnelQualitativeNote = {
    ...existingNote,
    note: request.note ?? existingNote.note,
    category: request.category ?? existingNote.category,
    tags: request.tags ?? existingNote.tags,
    priority: request.priority ?? existingNote.priority,
    actionTaken: request.actionTaken ?? existingNote.actionTaken,
    actionable: request.actionable ?? existingNote.actionable,
    updatedAt: new Date().toISOString(),
    actionTakenAt: request.actionTaken ? new Date().toISOString() : existingNote.actionTakenAt,
  };

  return simulateLatency(updatedNote);
}

// US-FA-023: IA aprende qué tipos de propuestas cierro mejor para priorizar ideas similares
export async function getProposalLearning(
  period: FunnelsAcquisitionPeriod = '30d',
): Promise<import('../types').ProposalLearningResponse> {
  const funnels = await fetchAcquisitionTopFunnels(period);

  // Simular datos de performance de propuestas
  const proposalPerformances: import('../types').ProposalPerformance[] = [
    {
      proposalType: 'trial_gratis',
      proposalName: '7 días de prueba gratis',
      funnelId: funnels[0]?.id,
      funnelName: funnels[0]?.name,
      totalPresented: 45,
      totalAccepted: 38,
      totalClosed: 32,
      acceptanceRate: 84.4,
      closingRate: 71.1,
      averageRevenue: 89.5,
      totalRevenue: 2864,
      averageDaysToClose: 3.2,
      firstPresentedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      lastPresentedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      successFactors: ['Sin compromiso inicial', 'Tiempo suficiente para evaluar', 'Soporte durante el trial'],
      failureReasons: ['Falta de tiempo', 'No se ajusta a horarios'],
      trendDirection: 'up',
      performanceScore: 85,
    },
    {
      proposalType: 'oferta_descuento',
      proposalName: '20% descuento primer mes',
      funnelId: funnels[1]?.id,
      funnelName: funnels[1]?.name,
      totalPresented: 62,
      totalAccepted: 48,
      totalClosed: 41,
      acceptanceRate: 77.4,
      closingRate: 66.1,
      averageRevenue: 71.2,
      totalRevenue: 2919.2,
      averageDaysToClose: 2.8,
      firstPresentedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
      lastPresentedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      successFactors: ['Ahorro inmediato', 'Urgencia', 'Valor percibido'],
      failureReasons: ['Aún muy caro', 'No hay disponibilidad'],
      trendDirection: 'up',
      performanceScore: 78,
    },
    {
      proposalType: 'consulta_gratis',
      proposalName: 'Consulta inicial sin costo',
      funnelId: funnels[2]?.id,
      funnelName: funnels[2]?.name,
      totalPresented: 38,
      totalAccepted: 35,
      totalClosed: 22,
      acceptanceRate: 92.1,
      closingRate: 57.9,
      averageRevenue: 125.0,
      totalRevenue: 2750,
      averageDaysToClose: 5.5,
      firstPresentedAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
      lastPresentedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      successFactors: ['Sin riesgo', 'Personalización', 'Confianza'],
      failureReasons: ['Falta de seguimiento', 'No se ajusta a necesidades'],
      trendDirection: 'neutral',
      performanceScore: 72,
    },
    {
      proposalType: 'pack_multiple',
      proposalName: 'Pack 3 meses con descuento',
      funnelId: funnels[0]?.id,
      funnelName: funnels[0]?.name,
      totalPresented: 28,
      totalAccepted: 18,
      totalClosed: 15,
      acceptanceRate: 64.3,
      closingRate: 53.6,
      averageRevenue: 210.0,
      totalRevenue: 3150,
      averageDaysToClose: 4.2,
      firstPresentedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      lastPresentedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      successFactors: ['Mejor precio por mes', 'Compromiso a largo plazo'],
      failureReasons: ['Compromiso muy largo', 'Inversión inicial alta'],
      trendDirection: 'down',
      performanceScore: 65,
    },
  ];

  const topPerformingProposals = [...proposalPerformances]
    .sort((a, b) => b.performanceScore - a.performanceScore)
    .slice(0, 2);

  const lowPerformingProposals = [...proposalPerformances]
    .sort((a, b) => a.performanceScore - b.performanceScore)
    .slice(0, 1);

  const insights: import('../types').ProposalLearningInsight[] = [
    {
      id: 'insight-1',
      proposalType: 'trial_gratis',
      insight: 'Los trials gratuitos tienen la mayor tasa de cierre cuando se presentan a leads que han mostrado interés en contenido educativo',
      confidence: 87,
      basedOnDataPoints: 45,
      recommendation: 'Priorizar trials gratuitos para leads que descargaron lead magnets educativos',
      expectedImpact: 'high',
      category: 'audience',
    },
    {
      id: 'insight-2',
      proposalType: 'oferta_descuento',
      insight: 'Los descuentos funcionan mejor cuando se presentan con urgencia (últimas 24-48h)',
      confidence: 82,
      basedOnDataPoints: 62,
      recommendation: 'Aplicar descuentos con límite de tiempo para aumentar conversión',
      expectedImpact: 'high',
      category: 'timing',
    },
    {
      id: 'insight-3',
      proposalType: 'consulta_gratis',
      insight: 'Las consultas gratuitas tienen alta aceptación pero requieren seguimiento inmediato para cerrar',
      confidence: 75,
      basedOnDataPoints: 38,
      recommendation: 'Automatizar seguimiento dentro de las primeras 2 horas después de la consulta',
      expectedImpact: 'medium',
      category: 'timing',
    },
  ];

  const prioritizations: import('../types').ProposalPrioritization[] = [
    {
      proposalType: 'trial_gratis',
      proposalName: '7 días de prueba gratis',
      priorityScore: 92,
      recommendedForFunnels: [funnels[0]?.id, funnels[1]?.id].filter(Boolean) as string[],
      recommendedForAudiences: ['Leads educativos', 'Nuevos prospectos', 'Audiencia fría'],
      expectedConversionRate: 71.1,
      expectedRevenue: 89.5,
      confidence: 87,
      reasoning: 'Mayor tasa de cierre y aceptación. Ideal para reducir fricción inicial y construir confianza.',
      similarSuccessfulProposals: ['oferta_descuento'],
    },
    {
      proposalType: 'oferta_descuento',
      proposalName: '20% descuento primer mes',
      priorityScore: 85,
      recommendedForFunnels: [funnels[1]?.id, funnels[2]?.id].filter(Boolean) as string[],
      recommendedForAudiences: ['Leads calientes', 'Audiencia con objeción de precio'],
      expectedConversionRate: 66.1,
      expectedRevenue: 71.2,
      confidence: 82,
      reasoning: 'Alta tasa de aceptación y cierre rápido. Efectivo para superar objeciones de precio.',
      similarSuccessfulProposals: ['trial_gratis'],
    },
    {
      proposalType: 'consulta_gratis',
      proposalName: 'Consulta inicial sin costo',
      priorityScore: 78,
      recommendedForFunnels: [funnels[2]?.id].filter(Boolean) as string[],
      recommendedForAudiences: ['Leads fríos', 'Audiencia que necesita personalización'],
      expectedConversionRate: 57.9,
      expectedRevenue: 125.0,
      confidence: 75,
      reasoning: 'Alta aceptación pero requiere seguimiento proactivo. Mejor para leads que necesitan más información.',
    },
  ];

  const averageClosingRate =
    proposalPerformances.reduce((sum, p) => sum + p.closingRate, 0) / proposalPerformances.length;

  const improvingProposals = proposalPerformances.filter((p) => p.trendDirection === 'up');
  const decliningProposals = proposalPerformances.filter((p) => p.trendDirection === 'down');

  return simulateLatency({
    period,
    proposalPerformances,
    topPerformingProposals,
    lowPerformingProposals,
    insights,
    prioritizations,
    totalProposalsTracked: proposalPerformances.length,
    averageClosingRate,
    trends: {
      improvingProposals,
      decliningProposals,
    },
    recommendations: prioritizations.slice(0, 3),
  });
}

export async function trackProposal(
  request: import('../types').TrackProposalRequest,
): Promise<{ success: boolean; message: string; proposalId: string }> {
  // En una implementación real, esto guardaría el tracking en la base de datos
  const proposalId = `proposal-${Date.now()}`;

  return simulateLatency({
    success: true,
    message: 'Propuesta registrada exitosamente',
    proposalId,
  });
}

export async function getProposalSimilarityMatches(
  proposalType: import('../types').ProposalType,
): Promise<import('../types').ProposalSimilarityMatch[]> {
  const learning = await getProposalLearning('30d');
  const targetProposal = learning.proposalPerformances.find((p) => p.proposalType === proposalType);

  if (!targetProposal) {
    return [];
  }

  // Encontrar propuestas similares basadas en características compartidas
  const similarProposals = learning.proposalPerformances
    .filter((p) => p.proposalType !== proposalType)
    .map((p) => {
      // Calcular similitud basada en tasas de cierre y factores de éxito
      const similarityScore = Math.min(
        100,
        Math.abs(p.closingRate - targetProposal.closingRate) < 10 ? 85 : 60,
      );

      const sharedCharacteristics: string[] = [];
      if (p.successFactors && targetProposal.successFactors) {
        p.successFactors.forEach((factor) => {
          if (targetProposal.successFactors?.includes(factor)) {
            sharedCharacteristics.push(factor);
          }
        });
      }

      return {
        proposalId: `proposal-${p.proposalType}`,
        proposalType: p.proposalType,
        proposalName: p.proposalName,
        similarityScore,
        sharedCharacteristics,
        performanceComparison: {
          thisProposal: targetProposal,
          similarProposal: p,
        },
        recommendation: `Esta propuesta tiene características similares y una tasa de cierre de ${p.closingRate.toFixed(1)}%. Considera aplicar estrategias similares.`,
      };
    })
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, 3);

  return simulateLatency(similarProposals);
}

// US-FA-024: Actualizar funnels con insights de Comunidad & Fidelización (testimonios, NPS)
export async function getCommunityInsights(
  limit: number = 20,
  minScore?: number,
  minNps?: number,
): Promise<import('../types').CommunityInsight[]> {
  await simulateLatency(null, 300);

  // Simular datos de testimonios y NPS desde ComunidadYFidelizacion
  const insights: import('../types').CommunityInsight[] = [
    {
      id: 'insight-1',
      type: 'testimonial',
      content: 'He perdido 15kg en 3 meses y me siento increíble. El entrenamiento personalizado ha cambiado mi vida completamente.',
      score: 5,
      customerName: 'María González',
      customerId: 'client-1',
      source: 'Google Reviews',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ['pérdida de peso', 'transformación', 'motivación'],
      metrics: {
        views: 245,
        conversions: 12,
        engagement: 89,
      },
    },
    {
      id: 'insight-2',
      type: 'nps',
      content: 'NPS Score: 78',
      npsValue: 78,
      source: 'Encuesta NPS',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ['nps', 'satisfacción'],
    },
    {
      id: 'insight-3',
      type: 'testimonial',
      content: 'El mejor entrenador personal que he tenido. Profesional, motivador y siempre disponible para ayudarme.',
      score: 5,
      customerName: 'Carlos Ruiz',
      customerId: 'client-2',
      source: 'Instagram',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ['profesionalismo', 'disponibilidad'],
      metrics: {
        views: 189,
        conversions: 8,
        engagement: 67,
      },
    },
    {
      id: 'insight-4',
      type: 'review',
      content: 'Excelente servicio. He ganado mucha fuerza y confianza en mí mismo. Totalmente recomendado.',
      score: 5,
      customerName: 'Ana Martínez',
      customerId: 'client-3',
      source: 'Facebook',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ['fuerza', 'confianza'],
      metrics: {
        views: 156,
        conversions: 6,
        engagement: 54,
      },
    },
    {
      id: 'insight-5',
      type: 'nps',
      content: 'NPS Score: 82',
      npsValue: 82,
      source: 'Encuesta NPS',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ['nps', 'satisfacción'],
    },
  ];

  let filtered = insights;

  if (minScore !== undefined) {
    filtered = filtered.filter((i) => !i.score || i.score >= minScore);
  }

  if (minNps !== undefined) {
    filtered = filtered.filter((i) => !i.npsValue || i.npsValue >= minNps);
  }

  return filtered.slice(0, limit);
}

export async function getFunnelCommunityInsightsStatus(
  funnelId: string,
): Promise<import('../types').FunnelCommunityInsightsStatus> {
  await simulateLatency(null, 300);

  const insights = await getCommunityInsights();
  const recommendations: import('../types').CommunityInsightsRecommendation[] = insights
    .filter((i) => i.score && i.score >= 4.5)
    .slice(0, 3)
    .map((insight, index) => ({
      insightId: insight.id,
      insight,
      recommendationScore: 85 - index * 5,
      reason: `Testimonio de alta calidad con score ${insight.score} y ${insight.metrics?.conversions || 0} conversiones`,
      suggestedPlacement: index === 0 ? 'hero' : 'testimonials',
      estimatedImpact: 'high' as const,
      estimatedConversionLift: 12 + index * 2,
    }));

  return {
    funnelId,
    funnelName: 'Funnel Principal',
    totalInsights: 5,
    activeInsights: 3,
    insightsByType: {
      testimonials: 3,
      nps: 2,
      reviews: 1,
    },
    lastUpdated: new Date().toISOString(),
    averageScore: 5,
    averageNps: 80,
    recommendations,
  };
}

export async function updateFunnelWithCommunityInsights(
  request: import('../types').FunnelCommunityInsightsUpdate,
): Promise<import('../types').FunnelCommunityInsightsUpdateResponse> {
  await simulateLatency(null, 500);

  const allInsights = await getCommunityInsights();
  const selectedInsights = request.insights.map((req) => {
    const insight = allInsights.find((i) => i.id === req.insightId);
    if (!insight) return null;

    return {
      funnelId: request.funnelId,
      funnelName: 'Funnel Principal',
      stageId: req.stageId,
      stageName: req.stageId ? 'Etapa de conversión' : undefined,
      insightId: insight.id,
      insight,
      placement: req.placement,
      isActive: true,
      addedAt: new Date().toISOString(),
      addedBy: 'current-user',
      performance: {
        views: insight.metrics?.views || 0,
        conversions: insight.metrics?.conversions || 0,
        conversionLift: 10,
      },
    };
  }).filter(Boolean) as import('../types').FunnelCommunityInsight[];

  return {
    updatedInsights: selectedInsights,
    success: true,
    message: `${selectedInsights.length} insights agregados exitosamente al funnel`,
    addedCount: selectedInsights.length,
    warnings: [],
  };
}

export async function getFunnelCommunityInsightsRecommendations(
  funnelId: string,
  stageId?: string,
): Promise<import('../types').CommunityInsightsRecommendation[]> {
  await simulateLatency(null, 300);

  const status = await getFunnelCommunityInsightsStatus(funnelId);
  return status.recommendations;
}

// US-FA-025: Plantillas IA para follow-up post registro (WhatsApp + email) con tono del usuario
export async function generateFollowUpTemplates(
  request: import('../types').FollowUpTemplateGenerationRequest,
): Promise<import('../types').FollowUpTemplateGenerationResponse> {
  await simulateLatency(null, 800);

  // Generar plantillas basadas en el tono y canal
  const templates: import('../types').PostRegistrationFollowUpTemplate[] = [];

  // Plantilla WhatsApp
  if (request.channel === 'whatsapp') {
    const whatsappTemplates: Record<import('../types').ToneOfVoice, string> = {
      motivacional: `¡Hola {{nombre}}! 🎉 

¡Bienvenido/a! Estoy súper emocionado/a de tenerte aquí. Tu decisión de dar el primer paso es el comienzo de algo increíble.

¿Listo/a para transformar tu vida? 💪

{{cta_text}}`,
      educativo: `Hola {{nombre}},

Gracias por registrarte. He preparado algunos recursos que te ayudarán a comenzar tu viaje de transformación.

{{cta_text}}`,
      enérgico: `¡{{nombre}}! 🔥

¡VAMOS! Has tomado la mejor decisión. Estoy aquí para llevarte al siguiente nivel.

{{cta_text}}`,
      empático: `Hola {{nombre}},

Entiendo que dar el primer paso puede generar dudas. Quiero que sepas que estoy aquí para acompañarte en cada momento.

{{cta_text}}`,
      profesional: `Estimado/a {{nombre}},

Gracias por registrarse en nuestro programa. Hemos recibido su información y nos pondremos en contacto pronto.

{{cta_text}}`,
      directo: `{{nombre}},

Bienvenido. Siguiente paso: {{cta_text}}`,
      inspirador: `{{nombre}},

Cada gran viaje comienza con un solo paso. El tuyo acaba de comenzar. 

{{cta_text}}`,
      cercano: `¡Hola {{nombre}}! 👋

Me alegra mucho que te hayas unido. Estoy aquí para ayudarte en lo que necesites.

{{cta_text}}`,
    };

    templates.push({
      id: `template-whatsapp-${Date.now()}`,
      name: `Follow-up WhatsApp - ${request.timing}`,
      description: `Plantilla de follow-up para WhatsApp con tono ${request.toneOfVoice}`,
      channel: 'whatsapp',
      timing: request.timing,
      toneOfVoice: request.toneOfVoice,
      customToneDescription: request.customToneDescription,
      message: whatsappTemplates[request.toneOfVoice] || whatsappTemplates.cercano,
      variables: ['{{nombre}}', '{{funnel}}', '{{fecha_registro}}', '{{cta_text}}'],
      cta: request.includeCTA
        ? {
            text: request.ctaText || 'Agendar consulta',
            url: request.ctaUrl,
          }
        : undefined,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  // Plantilla Email
  if (request.channel === 'email') {
    const emailTemplates: Record<import('../types').ToneOfVoice, { subject: string; body: string }> = {
      motivacional: {
        subject: '¡Bienvenido/a, {{nombre}}! Tu transformación comienza ahora 🎉',
        body: `¡Hola {{nombre}}!

¡Bienvenido/a a nuestra comunidad! Estoy súper emocionado/a de tenerte aquí. Tu decisión de dar el primer paso es el comienzo de algo increíble.

He preparado todo para que tu viaje de transformación sea exitoso. ¿Listo/a para comenzar?

${request.includeCTA ? `[${request.ctaText || 'Agendar consulta'}](${request.ctaUrl || '#'})` : ''}

¡Nos vemos pronto!
Tu entrenador personal`,
      },
      educativo: {
        subject: 'Bienvenido/a, {{nombre}} - Recursos para comenzar',
        body: `Hola {{nombre}},

Gracias por registrarte. He preparado algunos recursos que te ayudarán a comenzar tu viaje de transformación.

En los próximos días recibirás información valiosa sobre:
- Cómo establecer objetivos realistas
- Fundamentos de nutrición
- Rutinas de entrenamiento iniciales

${request.includeCTA ? `[${request.ctaText || 'Ver recursos'}](${request.ctaUrl || '#'})` : ''}

Saludos,
Tu entrenador personal`,
      },
      enérgico: {
        subject: '¡{{nombre}}! ¡VAMOS! 🔥',
        body: `¡{{nombre}}!

¡VAMOS! Has tomado la mejor decisión. Estoy aquí para llevarte al siguiente nivel.

Tu transformación comienza AHORA. ¿Listo/a?

${request.includeCTA ? `[${request.ctaText || 'Comenzar ahora'}](${request.ctaUrl || '#'})` : ''}

¡A por todas!
Tu entrenador personal`,
      },
      empático: {
        subject: 'Hola {{nombre}}, estoy aquí para acompañarte',
        body: `Hola {{nombre}},

Entiendo que dar el primer paso puede generar dudas. Quiero que sepas que estoy aquí para acompañarte en cada momento.

Tu bienestar es mi prioridad. Juntos lograremos tus objetivos.

${request.includeCTA ? `[${request.ctaText || 'Hablar conmigo'}](${request.ctaUrl || '#'})` : ''}

Con cariño,
Tu entrenador personal`,
      },
      profesional: {
        subject: 'Confirmación de registro - {{nombre}}',
        body: `Estimado/a {{nombre}},

Gracias por registrarse en nuestro programa. Hemos recibido su información y nos pondremos en contacto pronto.

${request.includeCTA ? `[${request.ctaText || 'Ver detalles'}](${request.ctaUrl || '#'})` : ''}

Atentamente,
Tu entrenador personal`,
      },
      directo: {
        subject: 'Bienvenido/a, {{nombre}}',
        body: `{{nombre}},

Bienvenido/a. Siguiente paso:

${request.includeCTA ? `[${request.ctaText || 'Continuar'}](${request.ctaUrl || '#'})` : ''}

Saludos.`,
      },
      inspirador: {
        subject: '{{nombre}}, tu viaje comienza ahora',
        body: `{{nombre}},

Cada gran viaje comienza con un solo paso. El tuyo acaba de comenzar.

Estoy aquí para guiarte en este camino de transformación.

${request.includeCTA ? `[${request.ctaText || 'Comenzar viaje'}](${request.ctaUrl || '#'})` : ''}

Con admiración,
Tu entrenador personal`,
      },
      cercano: {
        subject: '¡Hola {{nombre}}! 👋',
        body: `¡Hola {{nombre}}!

Me alegra mucho que te hayas unido. Estoy aquí para ayudarte en lo que necesites.

${request.includeCTA ? `[${request.ctaText || 'Empezar'}](${request.ctaUrl || '#'})` : ''}

¡Nos vemos pronto!
Tu entrenador personal`,
      },
    };

    const template = emailTemplates[request.toneOfVoice] || emailTemplates.cercano;

    templates.push({
      id: `template-email-${Date.now()}`,
      name: `Follow-up Email - ${request.timing}`,
      description: `Plantilla de follow-up para Email con tono ${request.toneOfVoice}`,
      channel: 'email',
      timing: request.timing,
      toneOfVoice: request.toneOfVoice,
      customToneDescription: request.customToneDescription,
      subject: template.subject,
      message: template.body,
      variables: ['{{nombre}}', '{{funnel}}', '{{fecha_registro}}', '{{cta_text}}'],
      cta: request.includeCTA
        ? {
            text: request.ctaText || 'Agendar consulta',
            url: request.ctaUrl,
          }
        : undefined,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  return {
    templates,
    reasoning: `Plantillas generadas con tono ${request.toneOfVoice} para ${request.channel}, optimizadas para ${request.timing}`,
    estimatedConversionRate: 25,
    suggestions: [
      {
        title: 'Personaliza el mensaje',
        description: 'Ajusta las variables según el contexto del lead para mayor relevancia',
        impact: 'high',
      },
      {
        title: 'Programa el timing correcto',
        description: `El timing ${request.timing} es óptimo para este tipo de follow-up`,
        impact: 'medium',
      },
    ],
  };
}

export async function applyFollowUpTemplate(
  request: import('../types').FollowUpTemplateApplication,
): Promise<import('../types').FollowUpTemplateApplicationResponse> {
  await simulateLatency(null, 500);

  // En una implementación real, esto enviaría el mensaje o lo programaría
  const preview = {
    subject: 'Bienvenido/a, {{nombre}}',
    body: `Hola ${request.leadName},\n\nGracias por registrarte...`,
  };

  return {
    success: true,
    message: request.sendImmediately ? 'Mensaje enviado exitosamente' : 'Mensaje programado exitosamente',
    sentAt: request.sendImmediately ? new Date().toISOString() : undefined,
    scheduledFor: request.scheduledFor,
    messageId: `msg-${Date.now()}`,
    preview,
  };
}

export async function getFollowUpTemplates(
  channel?: import('../types').FollowUpChannel,
): Promise<import('../types').PostRegistrationFollowUpTemplate[]> {
  await simulateLatency(null, 300);

  // Retornar plantillas guardadas (simulado)
  return [];
}

// US-FA-026: Calendario de lanzamientos y fases del funnel
export async function getFunnelCalendar(
  request: import('../types').FunnelCalendarRequest,
): Promise<import('../types').FunnelCalendarResponse> {
  await simulateLatency(null, 400);

  const startDate = new Date(request.startDate);
  const endDate = new Date(request.endDate);

  // Generar eventos simulados
  const events: import('../types').FunnelCalendarEvent[] = [];
  const launches: import('../types').FunnelLaunch[] = [];
  const phases: import('../types').FunnelPhase[] = [];

  // Eventos de ejemplo
  const currentDate = new Date(startDate);
  let eventId = 1;

  while (currentDate <= endDate) {
    // Lanzamiento cada 2 semanas
    if (eventId % 14 === 0) {
      const launchDate = new Date(currentDate);
      const launch: import('../types').FunnelLaunch = {
        id: `launch-${eventId}`,
        funnelId: `funnel-${(eventId % 3) + 1}`,
        funnelName: `Funnel ${(eventId % 3) + 1}`,
        launchDate: launchDate.toISOString(),
        endDate: new Date(launchDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        phase: 'lanzamiento',
        status: 'planificado',
        description: `Lanzamiento del funnel ${(eventId % 3) + 1}`,
        teamMembers: ['user-1', 'user-2'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      launches.push(launch);

      events.push({
        id: `event-${eventId}`,
        type: 'launch',
        title: `Lanzamiento: ${launch.funnelName}`,
        description: launch.description,
        startDate: launch.launchDate,
        endDate: launch.endDate,
        funnelId: launch.funnelId,
        funnelName: launch.funnelName,
        phaseType: launch.phase,
        status: launch.status,
        color: '#3b82f6',
        teamMembers: launch.teamMembers,
        metadata: { launchId: launch.id },
      });
    }

    // Fase cada semana
    if (eventId % 7 === 0) {
      const phaseDate = new Date(currentDate);
      const phaseTypes: import('../types').FunnelPhaseType[] = [
        'captacion',
        'cualificacion',
        'nurturing',
        'conversion',
      ];
      const phaseType = phaseTypes[eventId % phaseTypes.length];

      const phase: import('../types').FunnelPhase = {
        id: `phase-${eventId}`,
        funnelId: `funnel-${(eventId % 3) + 1}`,
        funnelName: `Funnel ${(eventId % 3) + 1}`,
        phaseType,
        startDate: phaseDate.toISOString(),
        endDate: new Date(phaseDate.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'planificada',
        description: `Fase de ${phaseType}`,
        objectives: [`Objetivo 1 para ${phaseType}`, `Objetivo 2 para ${phaseType}`],
        teamMembers: ['user-1'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      phases.push(phase);

      events.push({
        id: `event-phase-${eventId}`,
        type: 'phase',
        title: `${phaseType}: ${phase.funnelName}`,
        description: phase.description,
        startDate: phase.startDate,
        endDate: phase.endDate,
        funnelId: phase.funnelId,
        funnelName: phase.funnelName,
        phaseType: phase.phaseType,
        status: phase.status,
        color: '#10b981',
        teamMembers: phase.teamMembers,
        metadata: { phaseId: phase.id },
      });
    }

    currentDate.setDate(currentDate.getDate() + 1);
    eventId++;
  }

  return {
    events,
    launches,
    phases,
    dateRange: {
      start: request.startDate,
      end: request.endDate,
    },
    teamMembers: [
      { id: 'user-1', name: 'Juan Pérez', email: 'juan@ejemplo.com', role: 'Entrenador' },
      { id: 'user-2', name: 'María García', email: 'maria@ejemplo.com', role: 'Community Manager' },
    ],
  };
}

// US-FA-027: Compartir resumen IA del funnel con community manager
export async function generateFunnelAISummary(
  request: import('../types').GenerateFunnelAISummaryRequest,
): Promise<import('../types').GenerateFunnelAISummaryResponse> {
  await simulateLatency(null, 2000);

  const summary: import('../types').FunnelAISummary = {
    id: `summary-${Date.now()}`,
    funnelId: request.funnelId,
    funnelName: `Funnel ${request.funnelId}`,
    generatedAt: new Date().toISOString(),
    generatedBy: 'current-user',
    format: request.format || 'text',
    language: request.language || 'es',
    summary: {
      overview: `Este funnel está diseñado para captar y convertir leads en clientes. El objetivo principal es generar ${Math.floor(Math.random() * 100) + 50} leads calificados en los próximos 30 días, con una tasa de conversión objetivo del ${(Math.random() * 5 + 5).toFixed(1)}%.`,
      objectives: [
        'Aumentar la captación de leads en un 25%',
        'Mejorar la tasa de conversión del 3% al 5%',
        'Generar €10,000 en revenue en el primer mes',
        'Establecer un proceso de nurturing efectivo',
      ],
      targetAudience:
        'Personas de 25-45 años interesadas en fitness y bienestar, con disponibilidad para entrenar 3-4 veces por semana. Buscan resultados visibles en 3 meses.',
      keyMessages: [
        'Transforma tu cuerpo en 90 días con nuestro método probado',
        'Entrenamiento personalizado adaptado a tus objetivos',
        'Resultados garantizados o te devolvemos tu dinero',
        'Únete a una comunidad de más de 1,000 personas exitosas',
      ],
      contentSuggestions: [
        {
          id: 'content-1',
          type: 'reel',
          title: 'Reel: Transformación en 90 días',
          description: 'Muestra antes/después de clientes reales con música motivacional',
          keyPoints: ['Antes/después visual', 'Testimonial breve', 'CTA claro'],
          tone: 'Motivacional y energético',
          cta: 'Reserva tu consulta gratis',
          priority: 'high',
        },
        {
          id: 'content-2',
          type: 'post',
          title: 'Post: Beneficios del entrenamiento personalizado',
          description: 'Infografía con los 5 beneficios principales',
          keyPoints: ['Personalización', 'Resultados más rápidos', 'Acompañamiento'],
          tone: 'Educativo y profesional',
          cta: 'Descubre más',
          priority: 'medium',
        },
      ],
      adSuggestions: [
        {
          id: 'ad-1',
          platform: 'facebook',
          adType: 'video',
          headline: 'Transforma tu cuerpo en 90 días',
          description: 'Método probado con más de 1,000 clientes satisfechos',
          cta: 'Reserva tu consulta gratis',
          targetAudience: '25-45 años, interesados en fitness',
          budget: 500,
          estimatedReach: 10000,
          estimatedConversions: 50,
          priority: 'high',
        },
        {
          id: 'ad-2',
          platform: 'instagram',
          adType: 'carousel',
          headline: '5 razones para elegir entrenamiento personalizado',
          description: 'Descubre por qué nuestros clientes obtienen mejores resultados',
          cta: 'Solicita información',
          targetAudience: '25-45 años, activos en Instagram',
          budget: 300,
          estimatedReach: 8000,
          estimatedConversions: 30,
          priority: 'medium',
        },
      ],
      socialMediaPosts: [
        {
          id: 'post-1',
          platform: 'instagram',
          postType: 'feed',
          caption: '🔥 ¿Listo para transformar tu cuerpo? Nuestro método probado ha ayudado a más de 1,000 personas a alcanzar sus objetivos. ¿Quieres ser el siguiente? 💪 #Fitness #Transformación #EntrenamientoPersonalizado',
          hashtags: ['#Fitness', '#Transformación', '#EntrenamientoPersonalizado'],
          bestTimeToPost: '18:00-20:00',
          priority: 'high',
        },
        {
          id: 'post-2',
          platform: 'facebook',
          postType: 'feed',
          caption: 'El entrenamiento personalizado no es un lujo, es una inversión en tu salud y bienestar. Descubre cómo podemos ayudarte a alcanzar tus objetivos más rápido.',
          bestTimeToPost: '19:00-21:00',
          priority: 'medium',
        },
      ],
      timing: {
        launchDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        contentSchedule: {
          preLaunch: ['-7 días: Anuncio del lanzamiento', '-3 días: Contenido de expectativa'],
          launch: ['Día 0: Lanzamiento oficial', 'Día 0: Anuncios pagados activos'],
          postLaunch: ['+1 día: Follow-up con leads', '+3 días: Contenido de resultados'],
        },
        adSchedule: {
          startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000).toISOString(),
          dailyBudget: 50,
          peakHours: ['18:00', '19:00', '20:00'],
        },
        socialMediaSchedule: {
          frequency: 'daily',
          bestDays: ['Lunes', 'Miércoles', 'Viernes'],
          bestTimes: ['18:00', '19:00', '20:00'],
        },
      },
      metrics: {
        currentMetrics: {
          leads: 45,
          conversions: 3,
          revenue: 1200,
          conversionRate: 6.67,
        },
        projectedMetrics: {
          leads: 150,
          conversions: 12,
          revenue: 4800,
          conversionRate: 8.0,
        },
      },
      nextSteps: [
        'Revisar y aprobar el contenido sugerido',
        'Configurar los anuncios en las plataformas seleccionadas',
        'Programar los posts en el calendario de redes sociales',
        'Preparar el material de seguimiento para leads',
        'Establecer métricas de seguimiento y KPIs',
      ],
    },
    sharedWith: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return {
    summary,
    success: true,
    message: 'Resumen generado exitosamente',
  };
}

export async function shareFunnelAISummary(
  request: import('../types').ShareFunnelAISummaryRequest,
): Promise<import('../types').ShareFunnelAISummaryResponse> {
  await simulateLatency(null, 500);

  const sharedWith: import('../types').SharedWithUser[] = [];

  if (request.userIds) {
    request.userIds.forEach((userId) => {
      sharedWith.push({
        userId,
        userName: `Usuario ${userId}`,
        userEmail: `usuario${userId}@ejemplo.com`,
        role: 'Community Manager',
        sharedAt: new Date().toISOString(),
        accessLevel: request.accessLevel || 'view',
      });
    });
  }

  if (request.emails) {
    request.emails.forEach((email) => {
      sharedWith.push({
        userId: `external-${Date.now()}`,
        userName: email.split('@')[0],
        userEmail: email,
        role: 'Community Manager',
        sharedAt: new Date().toISOString(),
        accessLevel: request.accessLevel || 'view',
      });
    });
  }

  let publicLink: string | undefined;
  let shareToken: string | undefined;
  let expiresAt: string | undefined;

  if (request.generatePublicLink) {
    shareToken = `token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    publicLink = `${window.location.origin}/shared/funnel-summary/${shareToken}`;
    if (request.expiresInDays) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + request.expiresInDays);
      expiresAt = expiryDate.toISOString();
    }
  }

  return {
    success: true,
    message: 'Resumen compartido exitosamente',
    sharedWith,
    publicLink,
    shareToken,
    expiresAt,
  };
}

export async function getFunnelAISummaries(
  request?: import('../types').GetFunnelAISummariesRequest,
): Promise<import('../types').GetFunnelAISummariesResponse> {
  await simulateLatency(null, 300);

  // Retornar resúmenes guardados (simulado)
  return {
    summaries: [],
    total: 0,
    hasMore: false,
  };
}

// US-FA-021: Actualizar un funnel una vez finalizado con resultados reales y aprendizajes
const STORAGE_KEY_RETROSPECTIVES = 'funnel_retrospectives';

function getStoredRetrospectives(): import('../types').FunnelRetrospective[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_RETROSPECTIVES);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading retrospectives from storage:', error);
  }
  return [];
}

function saveRetrospectives(retrospectives: import('../types').FunnelRetrospective[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_RETROSPECTIVES, JSON.stringify(retrospectives));
  } catch (error) {
    console.error('Error saving retrospectives to storage:', error);
  }
}

export async function getFunnelRetrospective(
  funnelId: string,
): Promise<import('../types').FunnelRetrospective | null> {
  await simulateLatency(null, 200);
  const retrospectives = getStoredRetrospectives();
  return retrospectives.find((r) => r.funnelId === funnelId) || null;
}

export async function createFunnelRetrospective(
  request: import('../types').CreateFunnelRetrospectiveRequest,
): Promise<import('../types').FunnelRetrospectiveResponse> {
  await simulateLatency(null, 500);

  const retrospectives = getStoredRetrospectives();
  const existingIndex = retrospectives.findIndex((r) => r.funnelId === request.funnelId);

  const newRetrospective: import('../types').FunnelRetrospective = {
    id: `retro-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    funnelId: request.funnelId,
    funnelName: `Funnel ${request.funnelId}`,
    status: request.status,
    completedAt: request.completedAt,
    realResults: request.realResults,
    learnings: request.learnings.map((l, idx) => ({
      ...l,
      id: `learning-${Date.now()}-${idx}`,
    })),
    improvements: (request.improvements || []).map((i, idx) => ({
      ...i,
      id: `improvement-${Date.now()}-${idx}`,
    })),
    notes: request.notes,
    nextIterationPlan: request.nextIterationPlan,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'current-user',
  };

  // Generar sugerencias IA simuladas
  const aiSuggestions = {
    improvements: [
      {
        id: `ai-improvement-${Date.now()}`,
        title: 'Optimizar copy del CTA principal',
        description: 'Basado en los resultados, el CTA podría ser más específico y urgente.',
        priority: 'high' as const,
        category: 'copy' as const,
        estimatedImpact: 'Aumento estimado del 15-20% en conversión',
        steps: [
          'Revisar el copy actual del CTA',
          'Probar variaciones más específicas',
          'Añadir elementos de urgencia',
          'A/B test con la nueva versión',
        ],
      },
      {
        id: `ai-improvement-${Date.now()}-2`,
        title: 'Ajustar timing de seguimiento',
        description: 'Los leads responden mejor cuando el seguimiento es más rápido.',
        priority: 'medium' as const,
        category: 'timing' as const,
        estimatedImpact: 'Mejora del 10% en tasa de respuesta',
        steps: [
          'Reducir el delay del primer seguimiento',
          'Implementar seguimiento inmediato post-registro',
          'Monitorear tasa de respuesta',
        ],
      },
    ],
    checklist: [
      'Revisar métricas de conversión por etapa',
      'Analizar feedback cualitativo de prospectos',
      'Identificar cuellos de botella',
      'Actualizar buyer personas si es necesario',
      'Optimizar copy basado en resultados',
      'Ajustar timing de seguimiento',
      'Mejorar oferta si la conversión es baja',
      'Documentar aprendizajes clave',
    ],
  };

  newRetrospective.aiGeneratedChecklist = aiSuggestions.checklist;

  if (existingIndex >= 0) {
    retrospectives[existingIndex] = newRetrospective;
  } else {
    retrospectives.push(newRetrospective);
  }

  saveRetrospectives(retrospectives);

  return {
    retrospective: newRetrospective,
    success: true,
    message: 'Retrospectiva creada exitosamente',
    aiSuggestions,
  };
}

export async function updateFunnelRetrospective(
  request: import('../types').UpdateFunnelRetrospectiveRequest,
): Promise<import('../types').FunnelRetrospectiveResponse> {
  await simulateLatency(null, 400);

  const retrospectives = getStoredRetrospectives();
  const index = retrospectives.findIndex((r) => r.id === request.retrospectiveId);

  if (index < 0) {
    throw new Error('Retrospectiva no encontrada');
  }

  const existing = retrospectives[index];
  const updated: import('../types').FunnelRetrospective = {
    ...existing,
    ...(request.realResults && {
      realResults: { ...existing.realResults, ...request.realResults },
    }),
    ...(request.learnings && { learnings: request.learnings }),
    ...(request.improvements && { improvements: request.improvements }),
    ...(request.notes !== undefined && { notes: request.notes }),
    ...(request.nextIterationPlan !== undefined && { nextIterationPlan: request.nextIterationPlan }),
    updatedAt: new Date().toISOString(),
  };

  retrospectives[index] = updated;
  saveRetrospectives(retrospectives);

  return {
    retrospective: updated,
    success: true,
    message: 'Retrospectiva actualizada exitosamente',
  };
}





