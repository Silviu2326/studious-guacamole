import {
  AutomationRoadmapItem,
  ChannelHealthMetric,
  EmailProgram,
  LifecycleSequence,
  MessagingAutomation,
  MissionControlSnapshot,
  MissionControlSummary,
  MultiChannelCampaign,
} from '../types';

const baseSummary: MissionControlSummary[] = [
  {
    id: 'active-campaigns',
    label: 'Campañas activas',
    description: 'Flujos multicanal ejecutándose ahora mismo',
    value: 14,
    changePercentage: 18,
    trend: 'up',
    icon: 'target',
    channelFocus: 'multi',
  },
  {
    id: 'automations',
    label: 'Automatizaciones en vivo',
    description: 'Mensajes automatizados por canal',
    value: 38,
    changePercentage: 9,
    trend: 'up',
    icon: 'workflow',
    channelFocus: 'whatsapp',
  },
  {
    id: 'avg-response',
    label: 'Tiempo medio respuesta',
    description: 'SLA de mensajes entrantes',
    value: 6,
    changePercentage: -12,
    trend: 'down',
    icon: 'clock',
    channelFocus: 'sms',
  },
  {
    id: 'revenue-attributed',
    label: 'Ingresos atribuidos (30d)',
    description: 'Ingresos provenientes de campañas automatizadas',
    value: 92400,
    changePercentage: 22,
    trend: 'up',
    icon: 'currency',
    channelFocus: 'email',
  },
];

const multiChannelCampaigns: MultiChannelCampaign[] = [
  {
    id: 'cmp-omni-black-friday',
    name: 'Black Friday Omnicanal',
    objective: 'Reactivación y upsell de planes premium',
    status: 'running',
    owner: 'Growth Squad',
    launchDate: '2025-11-01',
    channels: ['email', 'sms', 'whatsapp', 'push'],
    targetSegments: ['Clientes inactivos', 'Usuarios premium trial', 'Leads calientes'],
    budget: 35000,
    spend: 18240,
    revenue: 76400,
    conversionRate: 7.4,
    progression: 62,
    nextAction: 'Test A/B de asunto con IA en segmento VIP',
    impactScore: 92,
  },
  {
    id: 'cmp-activacion-nov',
    name: 'Secuencia de activación leads Noviembre',
    objective: 'Conseguir primera compra en 7 días',
    status: 'running',
    owner: 'Lifecycle Ops',
    launchDate: '2025-10-26',
    channels: ['email', 'whatsapp', 'in-app'],
    targetSegments: ['Leads nuevos (≤14 días)', 'Referidos'],
    budget: 8200,
    spend: 3540,
    revenue: 15680,
    conversionRate: 4.9,
    progression: 48,
    nextAction: 'Activar paso de WhatsApp con CTA personalizada',
    impactScore: 78,
  },
  {
    id: 'cmp-retencion-premium',
    name: 'Retención planes premium Q4',
    objective: 'Reducir churn voluntario',
    status: 'scheduled',
    owner: 'Customer Marketing',
    launchDate: '2025-11-16',
    channels: ['email', 'sms'],
    targetSegments: ['Clientes premium 6+ meses', 'Usuarios con riesgo alto'],
    budget: 5400,
    spend: 0,
    revenue: 0,
    conversionRate: 0,
    progression: 28,
    nextAction: 'Sincronizar modelos de propensión de churn',
    impactScore: 84,
  },
];

const emailPrograms: EmailProgram[] = [
  {
    id: 'email-newsletter-semanal',
    name: 'Newsletter semanal “Mission Control”',
    type: 'newsletter',
    cadence: 'Semanal (jueves)',
    audienceSize: 18240,
    openRate: 41.2,
    clickRate: 9.6,
    revenueAttributed: 12600,
    bestSubject: '🎯 3 playbooks para reactivar leads fríos esta semana',
    status: 'running',
    aiRecommendation: 'Probar versión con bloque dinámico según segmento',
  },
  {
    id: 'email-product-update',
    name: 'Lanzamiento automatizaciones condicionales',
    type: 'product-update',
    cadence: 'Campaña puntual',
    audienceSize: 9200,
    openRate: 58.4,
    clickRate: 24.1,
    revenueAttributed: 18400,
    status: 'completed',
    aiRecommendation: 'Reutilizar como secuencia evergreen para leads enterprise',
  },
  {
    id: 'email-onboarding-fast-track',
    name: 'Fast-track Onboarding (Day 0-14)',
    type: 'onboarding',
    cadence: 'Automático',
    audienceSize: 4200,
    openRate: 72.6,
    clickRate: 18.3,
    revenueAttributed: 38600,
    status: 'running',
    aiRecommendation: 'Añadir video personalizado en paso 3 para mejorar activación',
  },
];

const lifecycleSequences: LifecycleSequence[] = [
  {
    id: 'lcsupsell-pro',
    name: 'Upsell a plan Pro tras 30 días activos',
    goal: 'upsell',
    steps: 7,
    activeContacts: 1380,
    completionRate: 63,
    avgTimeToConvert: 11,
    lastOptimization: '2025-10-28',
    bottleneckStep: 4,
    automationScore: 86,
    status: 'running',
  },
  {
    id: 'lcwinback-45',
    name: 'Winback 45 días inactivos',
    goal: 'winback',
    steps: 5,
    activeContacts: 820,
    completionRate: 47,
    avgTimeToConvert: 9,
    lastOptimization: '2025-09-18',
    automationScore: 72,
    status: 'running',
  },
  {
    id: 'lcchurnshield',
    name: 'Churn Shield Preventivo (riesgo alto)',
    goal: 'churn-prevention',
    steps: 8,
    activeContacts: 460,
    completionRate: 54,
    avgTimeToConvert: 6,
    lastOptimization: '2025-11-04',
    bottleneckStep: 6,
    automationScore: 88,
    status: 'running',
  },
];

const messagingAutomations: MessagingAutomation[] = [
  {
    id: 'auto-sms-pago',
    name: 'Recordatorio pago fallido + enlace one-click',
    trigger: 'Pago rechazado en Stripe',
    channel: 'sms',
    variantCount: 3,
    audienceSize: 420,
    responseRate: 42,
    SLA: '1m',
    status: 'running',
    lastTriggered: '2025-11-09T10:42:00Z',
    ownedBy: 'Revenue Ops',
    recommendedImprovement: 'Añadir fallback en WhatsApp si no hay respuesta en 2h',
  },
  {
    id: 'auto-whatsapp-demo',
    name: 'Confirmación demo + checklist interactivo',
    trigger: 'Demo agendada en CRM',
    channel: 'whatsapp',
    variantCount: 4,
    audienceSize: 188,
    responseRate: 78,
    SLA: 'Instantáneo',
    status: 'running',
    lastTriggered: '2025-11-09T11:05:00Z',
    ownedBy: 'Sales Enablement',
  },
  {
    id: 'auto-push-nps',
    name: 'Encuesta NPS post entrenamiento',
    trigger: 'Sesión completada (app móvil)',
    channel: 'push',
    variantCount: 2,
    audienceSize: 620,
    responseRate: 36,
    SLA: '30m',
    status: 'paused',
    lastTriggered: '2025-11-08T19:18:00Z',
    ownedBy: 'Customer Experience',
    recommendedImprovement: 'Reescribir copy + CTA con IA para elevar respuesta a 45%',
  },
];

const channelHealth: ChannelHealthMetric[] = [
  {
    id: 'health-email',
    channel: 'email',
    deliverability: 97,
    engagement: 68,
    satisfaction: 82,
    automationCoverage: 74,
    incidents: 1,
    highlight: 'Mantener warming de IP compartida para picos Black Friday',
  },
  {
    id: 'health-sms',
    channel: 'sms',
    deliverability: 93,
    engagement: 54,
    satisfaction: 77,
    automationCoverage: 61,
    incidents: 0,
    highlight: 'Probar mensajes cinemáticos con enlace trackeado y aceleración de respuesta',
  },
  {
    id: 'health-whatsapp',
    channel: 'whatsapp',
    deliverability: 99,
    engagement: 84,
    satisfaction: 90,
    automationCoverage: 88,
    incidents: 0,
    highlight: 'Nuevo template aprobado: “Plan personalizado con IA”',
  },
  {
    id: 'health-multi',
    channel: 'multi',
    deliverability: 95,
    engagement: 71,
    satisfaction: 85,
    automationCoverage: 79,
    incidents: 2,
    highlight: 'Sincronizar segmentos dinámicos cada 4h para evitar solapamiento',
  },
];

const roadmap: AutomationRoadmapItem[] = [
  {
    id: 'roadmap-ai-branching',
    title: 'Branching inteligente según comportamiento en app',
    description: 'Personalizar rutas de secuencias con IA usando eventos en tiempo real',
    owner: 'Automation Studio',
    impact: 'high',
    effort: 'L',
    eta: '2025-12-05',
    tags: ['IA', 'personalización', 'product-led'],
    status: 'in-progress',
  },
  {
    id: 'roadmap-bidireccional',
    title: 'Responder desde WhatsApp con macros dinámicas',
    description: 'Permitir respuesta humana asistida y mantener contexto en CRM',
    owner: 'Lifecycle Ops',
    impact: 'medium',
    effort: 'M',
    eta: '2025-11-28',
    tags: ['ventas', 'whatsapp', 'crm'],
    dependencies: ['roadmap-ai-branching'],
    status: 'ready',
  },
  {
    id: 'roadmap-voice',
    title: 'Activar canal de voice drops automatizados',
    description: 'Mensajes de voz personalizados para leads sin respuesta',
    owner: 'Growth Squad',
    impact: 'medium',
    effort: 'S',
    eta: '2025-12-12',
    tags: ['experimentación', 'nuevos-canales'],
    status: 'backlog',
  },
];

function simulateLatency<T>(data: T, delay = 240): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(JSON.parse(JSON.stringify(data)) as T), delay);
  });
}

export async function fetchMissionControlSummary(): Promise<MissionControlSummary[]> {
  return simulateLatency(baseSummary);
}

export async function fetchMultiChannelCampaigns(): Promise<MultiChannelCampaign[]> {
  return simulateLatency(multiChannelCampaigns);
}

export async function fetchEmailPrograms(): Promise<EmailProgram[]> {
  return simulateLatency(emailPrograms);
}

export async function fetchLifecycleSequences(): Promise<LifecycleSequence[]> {
  return simulateLatency(lifecycleSequences);
}

export async function fetchMessagingAutomations(): Promise<MessagingAutomation[]> {
  return simulateLatency(messagingAutomations);
}

export async function fetchChannelHealthMetrics(): Promise<ChannelHealthMetric[]> {
  return simulateLatency(channelHealth);
}

export async function fetchAutomationRoadmap(): Promise<AutomationRoadmapItem[]> {
  return simulateLatency(roadmap);
}

export async function fetchMissionControlSnapshot(): Promise<MissionControlSnapshot> {
  const [summary, campaigns, emails, sequences, automations, health, roadmapItems] = await Promise.all([
    fetchMissionControlSummary(),
    fetchMultiChannelCampaigns(),
    fetchEmailPrograms(),
    fetchLifecycleSequences(),
    fetchMessagingAutomations(),
    fetchChannelHealthMetrics(),
    fetchAutomationRoadmap(),
  ]);

  return {
    summary,
    campaigns,
    emailPrograms: emails,
    lifecycleSequences: sequences,
    messagingAutomations: automations,
    channelHealth: health,
    roadmap: roadmapItems,
  };
}







