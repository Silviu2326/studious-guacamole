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










