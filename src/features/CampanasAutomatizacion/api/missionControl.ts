import {
  AbsenceAutomation,
  AfterHoursAutoReply,
  AutomationRoadmapItem,
  ChannelHealthMetric,
  ClientReminderSettings,
  EmailProgram,
  ImportantDateAutomation,
  InactivityAutomation,
  LifecycleSequence,
  MessagingAutomation,
  MessageStatisticsDashboard,
  MessageTemplate,
  MissionControlSnapshot,
  MissionControlSummary,
  MultiChannelCampaign,
  PaymentReminderAutomation,
  PromotionalCampaign,
  ScheduledMessage,
  SessionReminder,
  SessionReminderTemplate,
  WelcomeSequence,
  ClientSegment,
  BulkMessage,
  Newsletter,
  NewsletterTemplate,
  ReservationsIntegration,
  CentralAutomationsPanel,
  MessageAlertsDashboard,
  PreferredSendingSchedulesDashboard,
  MultiStepSequence,
  ExportReport,
  ClientActionTriggersDashboard,
  AIReminderAutomationDashboard,
  WeeklyHighlightsNewsletterGenerator,
  QuickWhatsAppPromptsLibrary,
  AIHeatMapSendingSchedulesDashboard,
  ActionableKPIDashboard,
  ExperimentsDashboard,
  WeeklyAIInsightsDashboard,
  JourneyGapDetectorDashboard,
  ChannelRecommendationsDashboard,
} from '../types';

const baseSummary: MissionControlSummary[] = [
  {
    id: 'messages-sent',
    label: 'Mensajes enviados',
    description: 'Total de mensajes enviados a clientes (30 días)',
    value: 1247,
    changePercentage: 15,
    trend: 'up',
    icon: 'workflow',
    channelFocus: 'multi',
  },
  {
    id: 'client-response-rate',
    label: 'Tasa de respuesta de clientes',
    description: 'Porcentaje de clientes que responden a mensajes',
    value: 68,
    changePercentage: 8,
    trend: 'up',
    icon: 'target',
    channelFocus: 'whatsapp',
  },
  {
    id: 'active-reminders',
    label: 'Recordatorios automáticos activos',
    description: 'Recordatorios de sesiones configurados y en funcionamiento',
    value: 42,
    changePercentage: 12,
    trend: 'up',
    icon: 'clock',
    channelFocus: 'sms',
  },
  {
    id: 'pending-communication',
    label: 'Clientes con comunicación pendiente',
    description: 'Clientes que requieren seguimiento o respuesta',
    value: 18,
    changePercentage: -22,
    trend: 'down',
    icon: 'target',
    channelFocus: 'multi',
  },
];

const multiChannelCampaigns: MultiChannelCampaign[] = [
  {
    id: 'cmp-omni-black-friday',
    name: 'Black Friday Omnicanal',
    objective: 'Reactivación y upsell de planes premium',
    status: 'running',
    mode: 'manual',
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
    mode: 'automation',
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
    mode: 'manual',
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
    name: 'Newsletter semanal "Mission Control"',
    type: 'newsletter',
    mode: 'manual',
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
    mode: 'manual',
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
    mode: 'automation',
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

const sessionReminderTemplates: SessionReminderTemplate[] = [
  {
    id: 'reminder-24h-whatsapp',
    name: 'Recordatorio 24h antes - WhatsApp',
    description: 'Recordatorio estándar enviado 24 horas antes de la sesión',
    channel: 'whatsapp',
    messageTemplate: 'Hola {nombre}! 👋 Te recordamos que tienes una sesión mañana {fecha} a las {hora} en {lugar}. ¡Nos vemos pronto! 💪',
    timing: {
      type: 'before',
      hours: 24,
    },
    isActive: true,
    createdAt: '2025-10-15T10:00:00Z',
    updatedAt: '2025-11-01T14:30:00Z',
    variables: ['{nombre}', '{fecha}', '{hora}', '{lugar}'],
  },
  {
    id: 'reminder-2h-sms',
    name: 'Recordatorio 2h antes - SMS',
    description: 'Recordatorio de última hora 2 horas antes de la sesión',
    channel: 'sms',
    messageTemplate: 'Hola {nombre}, recordatorio: sesión hoy a las {hora}. Lugar: {lugar}. Confirma tu asistencia respondiendo SÍ.',
    timing: {
      type: 'before',
      hours: 2,
    },
    isActive: true,
    createdAt: '2025-10-15T10:00:00Z',
    updatedAt: '2025-11-01T14:30:00Z',
    variables: ['{nombre}', '{hora}', '{lugar}'],
  },
  {
    id: 'reminder-48h-email',
    name: 'Recordatorio 48h antes - Email',
    description: 'Recordatorio por email con detalles completos de la sesión',
    channel: 'email',
    messageTemplate: 'Hola {nombre},\n\nTe recordamos que tienes una sesión programada:\n\n📅 Fecha: {fecha}\n🕐 Hora: {hora}\n📍 Lugar: {lugar}\n\nPor favor, confirma tu asistencia o avísanos si necesitas reagendar.\n\n¡Nos vemos pronto!\n\nSaludos,\nTu entrenador personal',
    timing: {
      type: 'before',
      hours: 48,
    },
    isActive: true,
    createdAt: '2025-10-20T09:00:00Z',
    updatedAt: '2025-11-05T11:00:00Z',
    variables: ['{nombre}', '{fecha}', '{hora}', '{lugar}'],
  },
];

const clientReminderSettings: ClientReminderSettings[] = [
  {
    clientId: 'client-001',
    clientName: 'María González',
    templateId: 'reminder-24h-whatsapp',
    isEnabled: true,
    lastSent: '2025-11-08T10:00:00Z',
    nextScheduled: '2025-11-12T10:00:00Z',
  },
  {
    clientId: 'client-002',
    clientName: 'Juan Pérez',
    templateId: 'reminder-2h-sms',
    isEnabled: true,
    customMessage: 'Hola Juan! Recordatorio: sesión hoy a las {hora}. ¡No olvides traer tu botella de agua!',
    lastSent: '2025-11-09T08:00:00Z',
    nextScheduled: '2025-11-13T08:00:00Z',
  },
  {
    clientId: 'client-003',
    clientName: 'Ana Martínez',
    templateId: 'reminder-48h-email',
    isEnabled: true,
    lastSent: '2025-11-07T09:00:00Z',
    nextScheduled: '2025-11-11T09:00:00Z',
  },
  {
    clientId: 'client-004',
    clientName: 'Carlos Rodríguez',
    templateId: 'reminder-24h-whatsapp',
    isEnabled: false,
  },
];

const upcomingReminders: SessionReminder[] = [
  {
    id: 'reminder-upcoming-001',
    templateId: 'reminder-24h-whatsapp',
    templateName: 'Recordatorio 24h antes - WhatsApp',
    clientId: 'client-001',
    clientName: 'María González',
    sessionId: 'session-001',
    sessionDate: '2025-11-12',
    sessionTime: '10:00',
    channel: 'whatsapp',
    status: 'scheduled',
    scheduledAt: '2025-11-11T10:00:00Z',
    message: 'Hola María! 👋 Te recordamos que tienes una sesión mañana 12/11/2025 a las 10:00 en Gimnasio Central. ¡Nos vemos pronto! 💪',
  },
  {
    id: 'reminder-upcoming-002',
    templateId: 'reminder-2h-sms',
    templateName: 'Recordatorio 2h antes - SMS',
    clientId: 'client-002',
    clientName: 'Juan Pérez',
    sessionId: 'session-002',
    sessionDate: '2025-11-13',
    sessionTime: '18:00',
    channel: 'sms',
    status: 'scheduled',
    scheduledAt: '2025-11-13T16:00:00Z',
    message: 'Hola Juan, recordatorio: sesión hoy a las 18:00. Lugar: Gimnasio Central. Confirma tu asistencia respondiendo SÍ.',
  },
  {
    id: 'reminder-upcoming-003',
    templateId: 'reminder-48h-email',
    templateName: 'Recordatorio 48h antes - Email',
    clientId: 'client-003',
    clientName: 'Ana Martínez',
    sessionId: 'session-003',
    sessionDate: '2025-11-11',
    sessionTime: '09:00',
    channel: 'email',
    status: 'sent',
    scheduledAt: '2025-11-09T09:00:00Z',
    sentAt: '2025-11-09T09:00:00Z',
    message: 'Hola Ana,\n\nTe recordamos que tienes una sesión programada:\n\n📅 Fecha: 11/11/2025\n🕐 Hora: 09:00\n📍 Lugar: Gimnasio Central\n\nPor favor, confirma tu asistencia o avísanos si necesitas reagendar.\n\n¡Nos vemos pronto!\n\nSaludos,\nTu entrenador personal',
  },
];

// Secuencias de bienvenida - US-CA-003
const welcomeSequences: WelcomeSequence[] = [
  {
    id: 'welcome-seq-standard',
    name: 'Secuencia de Bienvenida Estándar',
    description: 'Secuencia automática de 3 días para nuevos clientes: bienvenida, qué esperar y preparación para la primera sesión',
    trigger: 'new-client',
    messages: [
      {
        id: 'welcome-msg-1',
        day: 1,
        title: 'Bienvenida',
        messageTemplate: '¡Hola {nombre}! 👋 Bienvenido/a a nuestro equipo. Estamos emocionados de comenzar este viaje contigo. En los próximos días te enviaremos información importante sobre tu primera sesión. ¡Nos vemos pronto! 💪',
        channel: 'whatsapp',
        scheduledTime: '09:00',
        variables: ['{nombre}'],
      },
      {
        id: 'welcome-msg-2',
        day: 2,
        title: 'Qué esperar',
        messageTemplate: 'Hola {nombre}, 👋\n\nMañana te contamos qué esperar en tu primera sesión. Por ahora, solo necesitas venir con ropa cómoda y muchas ganas. Si tienes alguna pregunta, no dudes en escribirme.\n\n¡Nos vemos pronto!',
        channel: 'whatsapp',
        scheduledTime: '10:00',
        variables: ['{nombre}'],
      },
      {
        id: 'welcome-msg-3',
        day: 3,
        title: 'Preparación primera sesión',
        messageTemplate: 'Hola {nombre}, 👋\n\nTu primera sesión está programada para {fechaPrimeraSesion} a las {horaPrimeraSesion}.\n\n📋 Recuerda traer:\n- Ropa cómoda\n- Botella de agua\n- Toalla\n\n📍 Lugar: {lugar}\n\nSi necesitas reagendar, avísame con al menos 24h de anticipación.\n\n¡Nos vemos mañana! 💪',
        channel: 'email',
        scheduledTime: '08:00',
        variables: ['{nombre}', '{fechaPrimeraSesion}', '{horaPrimeraSesion}', '{lugar}'],
      },
    ],
    activeClients: 24,
    completionRate: 78.5,
    status: 'running',
    createdAt: '2025-10-01T10:00:00Z',
    updatedAt: '2025-11-05T14:30:00Z',
  },
  {
    id: 'welcome-seq-premium',
    name: 'Secuencia de Bienvenida Premium',
    description: 'Secuencia extendida de 5 días para clientes premium con información adicional y recursos exclusivos',
    trigger: 'first-session-booked',
    messages: [
      {
        id: 'welcome-premium-1',
        day: 1,
        title: 'Bienvenida Premium',
        messageTemplate: '¡Hola {nombre}! 🎉 Bienvenido/a a nuestro programa Premium. Como cliente premium, tendrás acceso a recursos exclusivos y seguimiento personalizado. ¡Estamos aquí para ayudarte a alcanzar tus objetivos!',
        channel: 'email',
        scheduledTime: '09:00',
        variables: ['{nombre}'],
      },
      {
        id: 'welcome-premium-2',
        day: 2,
        title: 'Recursos exclusivos',
        messageTemplate: 'Hola {nombre}, 👋\n\nComo parte de tu programa Premium, tienes acceso a:\n- Plan nutricional personalizado\n- Videos de ejercicios exclusivos\n- Seguimiento 24/7\n\nRevisa tu email para acceder a estos recursos.',
        channel: 'email',
        scheduledTime: '10:00',
        variables: ['{nombre}'],
      },
      {
        id: 'welcome-premium-3',
        day: 3,
        title: 'Preparación primera sesión',
        messageTemplate: 'Hola {nombre}, 👋\n\nTu primera sesión está programada para {fechaPrimeraSesion} a las {horaPrimeraSesion}.\n\n📋 Checklist:\n- Ropa cómoda\n- Botella de agua\n- Toalla\n- Cuestionario de salud completado\n\n📍 Lugar: {lugar}\n\n¡Nos vemos pronto! 💪',
        channel: 'whatsapp',
        scheduledTime: '08:00',
        variables: ['{nombre}', '{fechaPrimeraSesion}', '{horaPrimeraSesion}', '{lugar}'],
      },
    ],
    activeClients: 8,
    completionRate: 92.3,
    status: 'running',
    createdAt: '2025-09-15T10:00:00Z',
    updatedAt: '2025-11-01T11:00:00Z',
  },
];

// Automatizaciones de ausencias - US-CA-004
const absenceAutomations: AbsenceAutomation[] = [
  {
    id: 'absence-auto-standard',
    name: 'Seguimiento de Ausencias Estándar',
    description: 'Detecta ausencias no justificadas y envía mensajes personalizados con diferentes tonos según la frecuencia de ausencias',
    isActive: true,
    messages: [
      {
        id: 'absence-msg-1',
        tone: 'friendly',
        absenceCount: 1,
        messageTemplate: 'Hola {nombre}! 👋 Notamos que no pudiste asistir a tu sesión de {fechaAusencia}. ¿Todo está bien? Si necesitas reagendar, puedes hacerlo respondiendo a este mensaje o usando este enlace: {opcionesReagendar}. ¡Estamos aquí para ayudarte!',
        channel: 'whatsapp',
        delayHours: 2,
        variables: ['{nombre}', '{fechaAusencia}', '{opcionesReagendar}'],
      },
      {
        id: 'absence-msg-2',
        tone: 'concerned',
        absenceCount: 2,
        messageTemplate: 'Hola {nombre}, 👋\n\nNotamos que has faltado a dos sesiones consecutivas. ¿Hay algo en lo que podamos ayudarte? Entendemos que pueden surgir imprevistos, pero queremos asegurarnos de que estés bien y que podamos ajustar tu plan si es necesario.\n\nPor favor, responde a este mensaje o reagenda tu próxima sesión aquí: {opcionesReagendar}\n\n¡Esperamos saber de ti pronto!',
        channel: 'email',
        delayHours: 4,
        variables: ['{nombre}', '{opcionesReagendar}'],
      },
      {
        id: 'absence-msg-3',
        tone: 'urgent',
        absenceCount: 3,
        messageTemplate: 'Hola {nombre},\n\nHemos notado que has faltado a varias sesiones. Queremos asegurarnos de que todo esté bien y que podamos ayudarte a retomar tu rutina de entrenamiento.\n\nPor favor, contáctanos lo antes posible para:\n- Reagendar tus sesiones\n- Ajustar tu plan si es necesario\n- Resolver cualquier problema que pueda estar impidiendo tu asistencia\n\nPuedes responder a este mensaje o llamarnos directamente. Estamos aquí para ayudarte a alcanzar tus objetivos.\n\n{opcionesReagendar}',
        channel: 'email',
        delayHours: 6,
        variables: ['{nombre}', '{opcionesReagendar}'],
      },
    ],
    activeCases: 12,
    responseRate: 65.5,
    reschedulingRate: 48.2,
    lastTriggered: '2025-11-09T14:30:00Z',
    createdAt: '2025-10-10T10:00:00Z',
    updatedAt: '2025-11-08T16:20:00Z',
  },
  {
    id: 'absence-auto-vip',
    name: 'Seguimiento de Ausencias VIP',
    description: 'Seguimiento personalizado para clientes VIP con contacto inmediato y opciones de reagendamiento prioritarias',
    isActive: true,
    messages: [
      {
        id: 'absence-vip-1',
        tone: 'friendly',
        absenceCount: 1,
        messageTemplate: 'Hola {nombre}! 👋 Como cliente VIP, notamos que no pudiste asistir a tu sesión. ¿Necesitas ayuda para reagendar? Como VIP, tienes prioridad en la agenda. Responde a este mensaje y te ayudamos de inmediato.',
        channel: 'whatsapp',
        delayHours: 1,
        variables: ['{nombre}', '{fechaAusencia}', '{opcionesReagendar}'],
      },
      {
        id: 'absence-vip-2',
        tone: 'concerned',
        absenceCount: 2,
        messageTemplate: 'Hola {nombre}, 👋\n\nComo cliente VIP, queremos asegurarnos de que recibas el mejor servicio. Hemos notado dos ausencias consecutivas. ¿Hay algo en lo que podamos ayudarte? Como VIP, podemos ajustar tu plan o tu horario según tus necesidades.\n\nPor favor, contáctanos para reagendar: {opcionesReagendar}',
        channel: 'whatsapp',
        delayHours: 2,
        variables: ['{nombre}', '{opcionesReagendar}'],
      },
    ],
    activeCases: 3,
    responseRate: 85.0,
    reschedulingRate: 72.5,
    lastTriggered: '2025-11-08T11:15:00Z',
    createdAt: '2025-09-20T10:00:00Z',
    updatedAt: '2025-11-05T09:30:00Z',
  },
];

function simulateLatency<T>(data: T, delay = 240): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(JSON.parse(JSON.stringify(data)) as T), delay);
  });
}

export async function fetchMissionControlSummary(): Promise<MissionControlSummary[]> {
  // Obtener todos los datos necesarios para calcular métricas
  const [
    campaigns,
    emailPrograms,
    lifecycleSequences,
    messagingAutomations,
    bulkMessages,
    promotionalCampaigns,
  ] = await Promise.all([
    fetchMultiChannelCampaigns(),
    fetchEmailPrograms(),
    fetchLifecycleSequences(),
    fetchMessagingAutomations(),
    fetchBulkMessages(),
    fetchPromotionalCampaigns(),
  ]);

  // Calcular métricas manuales
  let manualMessagesSent = 0;
  let manualResponses = 0;
  let manualTotalSent = 0;

  // Campañas multicanal manuales
  campaigns
    .filter((c) => c.mode === 'manual')
    .forEach((campaign) => {
      // Estimación basada en revenue y conversion rate
      const estimatedSent = campaign.revenue > 0 ? Math.round(campaign.revenue / (campaign.conversionRate / 100)) : 0;
      manualMessagesSent += estimatedSent;
      manualTotalSent += estimatedSent;
    });

  // Programas de email manuales
  emailPrograms
    .filter((ep) => ep.mode === 'manual')
    .forEach((program) => {
      const sent = program.audienceSize;
      manualMessagesSent += sent;
      manualTotalSent += sent;
      manualResponses += Math.round((sent * program.openRate) / 100);
    });

  // Mensajes masivos (bulk messages) - siempre manuales
  bulkMessages.forEach((bulk) => {
    manualMessagesSent += bulk.sentCount;
    manualTotalSent += bulk.sentCount;
    manualResponses += bulk.repliedCount;
  });

  // Campañas promocionales - siempre manuales
  promotionalCampaigns.forEach((promo) => {
    if (promo.tracking) {
      manualMessagesSent += promo.tracking.sentCount;
      manualTotalSent += promo.tracking.sentCount;
      manualResponses += promo.tracking.repliedCount;
    }
  });

  const manualResponseRate =
    manualTotalSent > 0 ? (manualResponses / manualTotalSent) * 100 : 0;

  // Calcular métricas de automatizaciones
  let automationMessagesSent = 0;
  let automationResponses = 0;
  let automationTotalSent = 0;
  let automationConversions = 0;

  // Secuencias de ciclo de vida - siempre automatizaciones
  lifecycleSequences.forEach((sequence) => {
    // Estimación basada en contactos activos y tasa de finalización
    const estimatedSent = Math.round(
      (sequence.activeContacts * sequence.completionRate) / 100
    );
    automationMessagesSent += estimatedSent;
    automationTotalSent += estimatedSent;
    automationConversions += Math.round(
      (estimatedSent * sequence.completionRate) / 100
    );
  });

  // Automatizaciones de mensajería - siempre automatizaciones
  messagingAutomations.forEach((automation) => {
    automationMessagesSent += automation.audienceSize;
    automationTotalSent += automation.audienceSize;
    automationResponses += Math.round(
      (automation.audienceSize * automation.responseRate) / 100
    );
  });

  // Campañas multicanal automatizadas
  campaigns
    .filter((c) => c.mode === 'automation')
    .forEach((campaign) => {
      const estimatedSent = campaign.revenue > 0
        ? Math.round(campaign.revenue / (campaign.conversionRate / 100))
        : 0;
      automationMessagesSent += estimatedSent;
      automationTotalSent += estimatedSent;
      automationConversions += Math.round(
        (estimatedSent * campaign.conversionRate) / 100
      );
    });

  // Programas de email automatizados
  emailPrograms
    .filter((ep) => ep.mode === 'automation')
    .forEach((program) => {
      const sent = program.audienceSize;
      automationMessagesSent += sent;
      automationTotalSent += sent;
      automationResponses += Math.round((sent * program.openRate) / 100);
    });

  const automationResponseRate =
    automationTotalSent > 0 ? (automationResponses / automationTotalSent) * 100 : 0;
  const automationConversionRate =
    automationTotalSent > 0 ? (automationConversions / automationTotalSent) * 100 : 0;

  // Actualizar el resumen base con métricas separadas
  const summaryWithBreakdown: MissionControlSummary[] = baseSummary.map((item) => {
    if (item.id === 'messages-sent') {
      return {
        ...item,
        value: manualMessagesSent + automationMessagesSent,
        manualMetrics: {
          messagesSent: manualMessagesSent,
          changePercentage: 12, // Ejemplo - en producción se calcularía vs período anterior
          trend: 'up' as const,
        },
        automationMetrics: {
          messagesSent: automationMessagesSent,
          changePercentage: 18, // Ejemplo - en producción se calcularía vs período anterior
          trend: 'up' as const,
        },
      };
    }
    if (item.id === 'client-response-rate') {
      return {
        ...item,
        value: Math.round(
          ((manualResponseRate + automationResponseRate) / 2) * 10
        ) / 10,
        manualMetrics: {
          messagesSent: manualTotalSent,
          responseRate: manualResponseRate,
          changePercentage: 5, // Ejemplo
          trend: 'up' as const,
        },
        automationMetrics: {
          messagesSent: automationTotalSent,
          responseRate: automationResponseRate,
          changePercentage: 10, // Ejemplo
          trend: 'up' as const,
        },
      };
    }
    return item;
  });

  return simulateLatency(summaryWithBreakdown);
}

export async function fetchMultiChannelCampaigns(): Promise<MultiChannelCampaign[]> {
  return simulateLatency(multiChannelCampaigns);
}

export async function fetchEmailPrograms(): Promise<EmailProgram[]> {
  // Obtener newsletters y convertirlos a EmailProgram
  const newslettersData = await fetchNewsletters();
  const newsletterPrograms: EmailProgram[] = newslettersData.map((newsletter) => ({
    id: newsletter.id,
    name: newsletter.name,
    type: 'newsletter' as const,
    mode: 'manual' as const,
    cadence: newsletter.schedule
      ? newsletter.schedule.frequency === 'weekly'
        ? 'Semanal'
        : newsletter.schedule.frequency === 'biweekly'
        ? 'Quincenal'
        : newsletter.schedule.frequency === 'monthly'
        ? 'Mensual'
        : 'Personalizado'
      : 'Único',
    audienceSize: newsletter.tracking?.totalRecipients || 0,
    openRate: newsletter.tracking?.openRate || newsletter.averageOpenRate || 0,
    clickRate: newsletter.tracking?.clickRate || newsletter.averageClickRate || 0,
    revenueAttributed: 0, // Newsletters no tienen revenue atribuido directamente
    bestSubject: newsletter.subject,
    status:
      newsletter.status === 'sent'
        ? 'completed'
        : newsletter.status === 'sending' || newsletter.status === 'scheduled'
        ? 'running'
        : newsletter.status === 'paused'
        ? 'paused'
        : 'draft',
    aiRecommendation: undefined,
  }));

  // Combinar emailPrograms existentes con newsletters convertidos
  // Filtrar newsletters que ya existen en emailPrograms (por ID)
  const existingNewsletterIds = new Set(
    emailPrograms.filter((p) => p.type === 'newsletter').map((p) => p.id)
  );
  const newNewsletterPrograms = newsletterPrograms.filter(
    (np) => !existingNewsletterIds.has(np.id)
  );
  const allPrograms = [...emailPrograms, ...newNewsletterPrograms];
  return simulateLatency(allPrograms);
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

export async function fetchSessionReminderTemplates(): Promise<SessionReminderTemplate[]> {
  return simulateLatency(sessionReminderTemplates);
}

export async function fetchClientReminderSettings(): Promise<ClientReminderSettings[]> {
  return simulateLatency(clientReminderSettings);
}

export async function fetchUpcomingReminders(): Promise<SessionReminder[]> {
  return simulateLatency(upcomingReminders);
}

export async function fetchWelcomeSequences(): Promise<WelcomeSequence[]> {
  return simulateLatency(welcomeSequences);
}

export async function fetchAbsenceAutomations(): Promise<AbsenceAutomation[]> {
  return simulateLatency(absenceAutomations);
}

// Biblioteca de plantillas de mensajes - US-CA-005
const messageTemplates: MessageTemplate[] = [
  {
    id: 'template-confirmacion-sesion',
    name: 'Confirmación de Sesión',
    description: 'Plantilla para confirmar una sesión programada con el cliente',
    category: 'confirmacion-sesion',
    channel: 'whatsapp',
    messageTemplate: 'Hola {nombre}! 👋 Confirmamos tu sesión para el {fechaSesion} a las {horaSesion} en {lugar}. ¡Nos vemos pronto! 💪',
    variables: ['{nombre}', '{fechaSesion}', '{horaSesion}', '{lugar}'],
    usageCount: 145,
    lastUsed: '2025-11-09T10:30:00Z',
    createdAt: '2025-09-01T10:00:00Z',
    updatedAt: '2025-11-05T14:20:00Z',
    isFavorite: true,
    tags: ['sesión', 'confirmación'],
  },
  {
    id: 'template-recordatorio-pago',
    name: 'Recordatorio de Pago Pendiente',
    description: 'Recordatorio amable para clientes con pagos pendientes',
    category: 'recordatorio-pago',
    channel: 'whatsapp',
    messageTemplate: 'Hola {nombre}, 👋 Te recordamos que tienes un pago pendiente de {monto} con vencimiento el {fechaPago}. Puedes pagar aquí: {linkPago}. ¡Gracias!',
    variables: ['{nombre}', '{monto}', '{fechaPago}', '{linkPago}'],
    usageCount: 89,
    lastUsed: '2025-11-08T09:15:00Z',
    createdAt: '2025-09-10T10:00:00Z',
    updatedAt: '2025-11-01T11:30:00Z',
    isFavorite: true,
    tags: ['pago', 'recordatorio'],
  },
  {
    id: 'template-felicitacion-progreso',
    name: 'Felicitación por Progreso',
    description: 'Mensaje motivacional para felicitar a clientes por sus logros',
    category: 'felicitacion-progreso',
    channel: 'whatsapp',
    messageTemplate: '¡Felicidades {nombre}! 🎉 Has logrado {logro}. Estamos muy orgullosos de tu progreso. ¡Sigue así! 💪✨',
    variables: ['{nombre}', '{logro}'],
    usageCount: 67,
    lastUsed: '2025-11-07T16:45:00Z',
    createdAt: '2025-09-15T10:00:00Z',
    updatedAt: '2025-10-28T13:20:00Z',
    isFavorite: false,
    tags: ['motivación', 'progreso'],
  },
  {
    id: 'template-ajuste-plan',
    name: 'Sugerencia de Ajuste de Plan',
    description: 'Plantilla para sugerir ajustes en el plan de entrenamiento',
    category: 'ajuste-plan',
    channel: 'email',
    messageTemplate: 'Hola {nombre},\n\nBasándonos en tu progreso y objetivos, te sugerimos ajustar tu plan de entrenamiento.\n\n📋 Recomendaciones:\n- {recomendacion1}\n- {recomendacion2}\n\n¿Te gustaría agendar una sesión para revisar estos cambios?\n\nSaludos,\nTu entrenador personal',
    variables: ['{nombre}', '{recomendacion1}', '{recomendacion2}'],
    usageCount: 34,
    lastUsed: '2025-11-06T11:00:00Z',
    createdAt: '2025-09-20T10:00:00Z',
    updatedAt: '2025-11-02T09:15:00Z',
    isFavorite: false,
    tags: ['plan', 'ajuste'],
  },
  {
    id: 'template-bienvenida-general',
    name: 'Bienvenida General',
    description: 'Mensaje de bienvenida para nuevos clientes',
    category: 'bienvenida',
    channel: 'whatsapp',
    messageTemplate: '¡Hola {nombre}! 👋 Bienvenido/a a nuestro equipo. Estamos emocionados de comenzar este viaje contigo. Si tienes alguna pregunta, no dudes en escribirme. ¡Nos vemos pronto! 💪',
    variables: ['{nombre}'],
    usageCount: 123,
    lastUsed: '2025-11-09T08:30:00Z',
    createdAt: '2025-08-25T10:00:00Z',
    updatedAt: '2025-10-15T12:00:00Z',
    isFavorite: true,
    tags: ['bienvenida', 'nuevo-cliente'],
  },
  {
    id: 'template-seguimiento-general',
    name: 'Seguimiento General',
    description: 'Plantilla para seguimiento general con clientes',
    category: 'seguimiento',
    channel: 'whatsapp',
    messageTemplate: 'Hola {nombre}! 👋 ¿Cómo te sientes con tu entrenamiento? ¿Hay algo en lo que podamos ayudarte? ¡Estamos aquí para apoyarte! 💪',
    variables: ['{nombre}'],
    usageCount: 156,
    lastUsed: '2025-11-09T14:20:00Z',
    createdAt: '2025-09-05T10:00:00Z',
    updatedAt: '2025-11-03T10:45:00Z',
    isFavorite: false,
    tags: ['seguimiento', 'check-in'],
  },
];

// Sistema de mensajes programados - US-CA-006
const scheduledMessages: ScheduledMessage[] = [
  {
    id: 'scheduled-progreso-quincenal',
    name: 'Seguimiento de Progreso Quincenal',
    description: 'Mensaje automático cada 2 semanas preguntando por el progreso y cómo se sienten los clientes',
    templateId: 'template-seguimiento-general',
    messageContent: 'Hola {nombre}! 👋 Han pasado 2 semanas desde tu última sesión. ¿Cómo te sientes con tu progreso? ¿Hay algo en lo que podamos ayudarte? ¡Estamos aquí para apoyarte! 💪',
    channel: 'whatsapp',
    frequency: 'biweekly',
    recipients: [
      { type: 'group', id: 'group-activos', name: 'Clientes Activos' },
      { type: 'group', id: 'group-mensual', name: 'Plan Mensual' },
    ],
    nextScheduledDate: '2025-11-23T10:00:00Z',
    lastSentDate: '2025-11-09T10:00:00Z',
    status: 'running',
    totalSent: 48,
    responseRate: 72.5,
    isActive: true,
    createdAt: '2025-10-01T10:00:00Z',
    updatedAt: '2025-11-09T10:00:00Z',
    variables: ['{nombre}'],
  },
  {
    id: 'scheduled-progreso-mensual',
    name: 'Check-in Mensual de Progreso',
    description: 'Mensaje mensual para revisar objetivos y ajustar el plan si es necesario',
    messageContent: 'Hola {nombre}! 👋 Este mes queremos revisar contigo tu progreso y objetivos. ¿Cómo te sientes? ¿Hay algo que quieras ajustar en tu plan? ¡Agenda una sesión de revisión cuando quieras! 💪',
    channel: 'email',
    frequency: 'monthly',
    recipients: [
      { type: 'group', id: 'group-premium', name: 'Clientes Premium' },
    ],
    nextScheduledDate: '2025-12-01T09:00:00Z',
    lastSentDate: '2025-11-01T09:00:00Z',
    status: 'running',
    totalSent: 12,
    responseRate: 58.3,
    isActive: true,
    createdAt: '2025-09-15T10:00:00Z',
    updatedAt: '2025-11-01T09:00:00Z',
    variables: ['{nombre}'],
  },
  {
    id: 'scheduled-motivacion-semanal',
    name: 'Motivación Semanal',
    description: 'Mensaje motivacional semanal para mantener el engagement',
    messageContent: '¡Hola {nombre}! 💪 Nueva semana, nuevas oportunidades. Recuerda que cada pequeño paso cuenta. ¡Sigue adelante! 🌟',
    channel: 'whatsapp',
    frequency: 'weekly',
    recipients: [
      { type: 'client', id: 'client-001', name: 'María González' },
      { type: 'client', id: 'client-002', name: 'Juan Pérez' },
      { type: 'group', id: 'group-inicio', name: 'Clientes Nuevos' },
    ],
    nextScheduledDate: '2025-11-16T08:00:00Z',
    lastSentDate: '2025-11-09T08:00:00Z',
    status: 'running',
    totalSent: 24,
    responseRate: 45.8,
    isActive: true,
    createdAt: '2025-10-20T10:00:00Z',
    updatedAt: '2025-11-09T08:00:00Z',
    variables: ['{nombre}'],
  },
  {
    id: 'scheduled-seguimiento-custom',
    name: 'Seguimiento Personalizado',
    description: 'Mensaje cada 10 días para clientes específicos que requieren seguimiento más frecuente',
    messageContent: 'Hola {nombre}! 👋 Queríamos hacer un seguimiento contigo. ¿Cómo va todo? ¿Necesitas algo? ¡Estamos aquí para ayudarte! 💪',
    channel: 'whatsapp',
    frequency: 'custom',
    customFrequencyDays: 10,
    recipients: [
      { type: 'client', id: 'client-003', name: 'Ana Martínez' },
      { type: 'client', id: 'client-004', name: 'Carlos Rodríguez' },
    ],
    nextScheduledDate: '2025-11-19T10:00:00Z',
    lastSentDate: '2025-11-09T10:00:00Z',
    status: 'running',
    totalSent: 6,
    responseRate: 83.3,
    isActive: true,
    createdAt: '2025-10-25T10:00:00Z',
    updatedAt: '2025-11-09T10:00:00Z',
    variables: ['{nombre}'],
  },
  {
    id: 'scheduled-recordatorio-diario',
    name: 'Recordatorio Diario de Ejercicios',
    description: 'Recordatorio diario para clientes que tienen ejercicios para hacer en casa',
    messageContent: '¡Buenos días {nombre}! ☀️ Recuerda hacer tus ejercicios de hoy. ¡Tú puedes! 💪',
    channel: 'whatsapp',
    frequency: 'daily',
    recipients: [
      { type: 'group', id: 'group-ejercicios-casa', name: 'Ejercicios en Casa' },
    ],
    nextScheduledDate: '2025-11-10T07:00:00Z',
    lastSentDate: '2025-11-09T07:00:00Z',
    status: 'paused',
    totalSent: 15,
    responseRate: 33.3,
    isActive: false,
    createdAt: '2025-11-01T10:00:00Z',
    updatedAt: '2025-11-08T12:00:00Z',
    variables: ['{nombre}'],
  },
];

export async function fetchMessageTemplates(): Promise<MessageTemplate[]> {
  return simulateLatency(messageTemplates);
}

export async function fetchScheduledMessages(): Promise<ScheduledMessage[]> {
  return simulateLatency(scheduledMessages);
}

// Automatización de inactividad - US-CA-007
const inactivityAutomations: InactivityAutomation[] = [
  {
    id: 'inactivity-auto-standard',
    name: 'Reactivación de Clientes Inactivos',
    description: 'Secuencia progresiva para clientes sin sesiones en 14 días: mensajes motivacionales, ofertas especiales e invitaciones a retomar',
    inactivityThresholdDays: 14,
    messages: [
      {
        id: 'inactivity-msg-1',
        step: 1,
        type: 'check-in',
        daysAfterInactivity: 0,
        messageTemplate: 'Hola {nombre}! 👋 Notamos que hace {diasInactivo} días que no tienes sesión. ¿Todo está bien? Estamos aquí para ayudarte a retomar tu rutina. 💪',
        channel: 'whatsapp',
        scheduledTime: '10:00',
        variables: ['{nombre}', '{diasInactivo}'],
        pauseOnResponse: true,
      },
      {
        id: 'inactivity-msg-2',
        step: 2,
        type: 'motivational',
        daysAfterInactivity: 3,
        messageTemplate: '¡Hola {nombre}! 💪 Recuerda que cada pequeño paso cuenta. Tu última sesión fue el {ultimaSesion}. ¿Te gustaría agendar una sesión esta semana? ¡Estamos aquí para apoyarte!',
        channel: 'whatsapp',
        scheduledTime: '09:00',
        variables: ['{nombre}', '{ultimaSesion}'],
        pauseOnResponse: true,
      },
      {
        id: 'inactivity-msg-3',
        step: 3,
        type: 'special-offer',
        daysAfterInactivity: 7,
        messageTemplate: 'Hola {nombre}! 🎁 Como valoramos tu compromiso, tenemos una oferta especial para ti: {ofertaEspecial}. Válida hasta el {fechaVencimiento}. ¡No dejes pasar esta oportunidad!',
        channel: 'email',
        scheduledTime: '08:00',
        variables: ['{nombre}', '{ofertaEspecial}', '{fechaVencimiento}'],
        pauseOnResponse: true,
      },
      {
        id: 'inactivity-msg-4',
        step: 4,
        type: 'invitation',
        daysAfterInactivity: 14,
        messageTemplate: '¡Hola {nombre}! 👋 Te extrañamos. Queremos invitarte a retomar tu entrenamiento. Agenda tu próxima sesión y recibe una sesión adicional gratis. ¡Es momento de volver! 💪',
        channel: 'whatsapp',
        scheduledTime: '10:00',
        variables: ['{nombre}'],
        pauseOnResponse: true,
      },
    ],
    activeClients: 18,
    pausedClients: 5,
    responseRate: 58.3,
    reactivationRate: 42.1,
    isActive: true,
    lastTriggered: '2025-11-09T10:00:00Z',
    createdAt: '2025-10-15T10:00:00Z',
    updatedAt: '2025-11-08T14:30:00Z',
  },
  {
    id: 'inactivity-auto-extended',
    name: 'Reactivación Extendida (30 días)',
    description: 'Secuencia extendida para clientes inactivos por 30 días con mensajes más intensivos y ofertas especiales',
    inactivityThresholdDays: 30,
    messages: [
      {
        id: 'inactivity-ext-1',
        step: 1,
        type: 'check-in',
        daysAfterInactivity: 0,
        messageTemplate: 'Hola {nombre}! 👋 Hace {diasInactivo} días que no nos vemos. ¿Cómo estás? Queremos saber si todo está bien y cómo podemos ayudarte.',
        channel: 'email',
        scheduledTime: '09:00',
        variables: ['{nombre}', '{diasInactivo}'],
        pauseOnResponse: true,
      },
      {
        id: 'inactivity-ext-2',
        step: 2,
        type: 'motivational',
        daysAfterInactivity: 5,
        messageTemplate: '¡Hola {nombre}! 💪 Sabemos que retomar puede ser difícil, pero estamos aquí para ayudarte. Tu progreso anterior fue increíble. ¿Qué te parece si agendamos una sesión de reintroducción?',
        channel: 'whatsapp',
        scheduledTime: '10:00',
        variables: ['{nombre}'],
        pauseOnResponse: true,
      },
      {
        id: 'inactivity-ext-3',
        step: 3,
        type: 'special-offer',
        daysAfterInactivity: 10,
        messageTemplate: 'Hola {nombre}! 🎁 Oferta especial de reactivación: {ofertaEspecial}. Válida solo por tiempo limitado. ¡Es el momento perfecto para retomar!',
        channel: 'email',
        scheduledTime: '08:00',
        variables: ['{nombre}', '{ofertaEspecial}'],
        pauseOnResponse: true,
      },
      {
        id: 'inactivity-ext-4',
        step: 4,
        type: 'invitation',
        daysAfterInactivity: 20,
        messageTemplate: '¡Hola {nombre}! 👋 Te invitamos a una sesión de prueba gratuita. Sin compromiso, solo para que veas cómo te sientes. ¿Te animas?',
        channel: 'whatsapp',
        scheduledTime: '10:00',
        variables: ['{nombre}'],
        pauseOnResponse: true,
      },
    ],
    activeClients: 8,
    pausedClients: 2,
    responseRate: 45.0,
    reactivationRate: 28.5,
    isActive: true,
    lastTriggered: '2025-11-08T09:30:00Z',
    createdAt: '2025-09-20T10:00:00Z',
    updatedAt: '2025-11-05T11:00:00Z',
  },
];

// Sistema de fechas importantes - US-CA-008
const importantDateAutomations: ImportantDateAutomation[] = [
  {
    id: 'important-dates-standard',
    name: 'Fechas Importantes Estándar',
    description: 'Sistema que detecta cumpleaños, aniversarios y fechas importantes de cada cliente y envía mensajes personalizados automáticamente',
    messages: [
      {
        id: 'date-msg-birthday',
        dateType: 'birthday',
        messageTemplate: '¡Feliz cumpleaños {nombre}! 🎉🎂 Esperamos que tengas un día increíble. Como regalo especial, tienes {ofertaEspecial}. ¡Que cumplas muchos más! 💪✨',
        channel: 'whatsapp',
        includeSpecialOffer: true,
        specialOfferTemplate: '20% de descuento en tu próxima sesión o bono de 3 sesiones',
        includeSessionReminder: false,
        sendTime: '09:00',
        sendDaysBefore: 0,
        variables: ['{nombre}', '{edad}', '{ofertaEspecial}'],
      },
      {
        id: 'date-msg-anniversary',
        dateType: 'anniversary',
        messageTemplate: '¡Feliz aniversario {nombre}! 🎉 Hace {añosEntrenando} años que comenzamos este viaje juntos. Gracias por confiar en nosotros. Como agradecimiento, {ofertaEspecial}. ¡Seguimos juntos! 💪',
        channel: 'email',
        includeSpecialOffer: true,
        specialOfferTemplate: 'Sesión gratuita o 15% de descuento en tu próximo plan',
        includeSessionReminder: true,
        sendTime: '10:00',
        sendDaysBefore: 0,
        variables: ['{nombre}', '{añosEntrenando}', '{ofertaEspecial}'],
      },
      {
        id: 'date-msg-milestone',
        dateType: 'milestone',
        messageTemplate: '¡Felicidades {nombre}! 🎉 Has alcanzado un hito importante: {milestone}. Estamos muy orgullosos de tu progreso. ¡Sigue así! 💪✨',
        channel: 'whatsapp',
        includeSpecialOffer: false,
        includeSessionReminder: false,
        sendTime: '09:00',
        sendDaysBefore: 0,
        variables: ['{nombre}', '{milestone}'],
      },
    ],
    activeDates: 45,
    upcomingDates: 8,
    sentThisMonth: 12,
    responseRate: 78.5,
    isActive: true,
    lastTriggered: '2025-11-09T09:00:00Z',
    createdAt: '2025-09-01T10:00:00Z',
    updatedAt: '2025-11-08T15:20:00Z',
  },
  {
    id: 'important-dates-premium',
    name: 'Fechas Importantes Premium',
    description: 'Sistema premium con mensajes más personalizados y ofertas exclusivas para clientes VIP',
    messages: [
      {
        id: 'date-premium-birthday',
        dateType: 'birthday',
        messageTemplate: '¡Feliz cumpleaños {nombre}! 🎉🎂 Como cliente VIP, queremos hacer tu día especial. {ofertaEspecial}. Además, agenda tu sesión de esta semana y recibe un regalo sorpresa. ¡Que cumplas muchos más! 💪✨',
        channel: 'whatsapp',
        includeSpecialOffer: true,
        specialOfferTemplate: 'Sesión gratuita + 25% de descuento en productos',
        includeSessionReminder: true,
        sendTime: '08:00',
        sendDaysBefore: 1,
        variables: ['{nombre}', '{edad}', '{ofertaEspecial}'],
      },
      {
        id: 'date-premium-anniversary',
        dateType: 'anniversary',
        messageTemplate: '¡Feliz aniversario {nombre}! 🎉 Hace {añosEntrenando} años que eres parte de nuestra familia VIP. Gracias por tu lealtad. {ofertaEspecial}. ¡Celebremos juntos! 💪',
        channel: 'email',
        includeSpecialOffer: true,
        specialOfferTemplate: 'Bono de 2 sesiones gratis + plan personalizado actualizado',
        includeSessionReminder: true,
        sendTime: '09:00',
        sendDaysBefore: 0,
        variables: ['{nombre}', '{añosEntrenando}', '{ofertaEspecial}'],
      },
    ],
    activeDates: 12,
    upcomingDates: 2,
    sentThisMonth: 3,
    responseRate: 91.7,
    isActive: true,
    lastTriggered: '2025-11-08T08:00:00Z',
    createdAt: '2025-09-15T10:00:00Z',
    updatedAt: '2025-11-05T10:30:00Z',
  },
];

export async function fetchInactivityAutomations(): Promise<InactivityAutomation[]> {
  return simulateLatency(inactivityAutomations);
}

export async function fetchImportantDateAutomations(): Promise<ImportantDateAutomation[]> {
  return simulateLatency(importantDateAutomations);
}

// Automatización de recordatorios de pagos - US-CA-009
const paymentReminderAutomations: PaymentReminderAutomation[] = [
  {
    id: 'payment-reminder-standard',
    name: 'Recordatorios de Pago Estándar',
    description: 'Automatización que detecta pagos pendientes o próximos a vencer y envía recordatorios amables por WhatsApp o email, con diferentes mensajes según los días de retraso',
    messages: [
      {
        id: 'payment-msg-1',
        daysDelay: 0,
        tone: 'friendly',
        messageTemplate: 'Hola {nombre}! 👋 Te recordamos que tienes un pago próximo a vencer el {fechaVencimiento} por un monto de {monto}. Puedes pagar fácilmente aquí: {linkPago}. ¡Gracias por tu confianza! 💪',
        channel: 'whatsapp',
        sendTime: '09:00',
        variables: ['{nombre}', '{fechaVencimiento}', '{monto}', '{linkPago}'],
      },
      {
        id: 'payment-msg-2',
        daysDelay: 1,
        tone: 'friendly',
        messageTemplate: 'Hola {nombre}, 👋\n\nNotamos que tu pago de {monto} con vencimiento el {fechaVencimiento} está vencido desde ayer. ¿Necesitas ayuda para realizar el pago? Puedes hacerlo aquí: {linkPago}\n\n¡Estamos aquí para ayudarte!',
        channel: 'whatsapp',
        sendTime: '10:00',
        variables: ['{nombre}', '{monto}', '{fechaVencimiento}', '{linkPago}'],
      },
      {
        id: 'payment-msg-3',
        daysDelay: 3,
        tone: 'gentle',
        messageTemplate: 'Hola {nombre},\n\nTu pago de {monto} tiene {diasRetraso} días de retraso. Para continuar disfrutando de nuestros servicios, te pedimos que realices el pago lo antes posible.\n\nPuedes pagar aquí: {linkPago}\n\nSi tienes alguna dificultad, no dudes en contactarnos. ¡Estamos aquí para ayudarte!',
        channel: 'email',
        sendTime: '09:00',
        variables: ['{nombre}', '{monto}', '{diasRetraso}', '{linkPago}'],
      },
      {
        id: 'payment-msg-4',
        daysDelay: 7,
        tone: 'urgent',
        messageTemplate: 'Hola {nombre},\n\nTu pago de {monto} tiene {diasRetraso} días de retraso. Es importante que regularices tu situación para evitar la suspensión de servicios.\n\nPor favor, realiza el pago aquí: {linkPago}\n\nSi necesitas ayuda o tienes alguna dificultad, contáctanos de inmediato. Estamos aquí para encontrar una solución juntos.',
        channel: 'email',
        sendTime: '08:00',
        variables: ['{nombre}', '{monto}', '{diasRetraso}', '{linkPago}'],
      },
    ],
    activeReminders: 24,
    sentThisMonth: 156,
    paymentRecoveryRate: 68.5,
    responseRate: 72.3,
    isActive: true,
    lastTriggered: '2025-11-09T09:15:00Z',
    createdAt: '2025-10-01T10:00:00Z',
    updatedAt: '2025-11-08T14:20:00Z',
  },
  {
    id: 'payment-reminder-premium',
    name: 'Recordatorios de Pago Premium',
    description: 'Recordatorios personalizados para clientes premium con mensajes más cercanos y opciones de pago flexibles',
    messages: [
      {
        id: 'payment-premium-1',
        daysDelay: 0,
        tone: 'friendly',
        messageTemplate: 'Hola {nombre}! 👋 Como cliente Premium, queremos recordarte que tu pago de {monto} vence el {fechaVencimiento}. Puedes pagar aquí: {linkPago}. ¡Gracias por ser parte de nuestra familia Premium! 💎',
        channel: 'whatsapp',
        sendTime: '09:00',
        variables: ['{nombre}', '{monto}', '{fechaVencimiento}', '{linkPago}'],
      },
      {
        id: 'payment-premium-2',
        daysDelay: 2,
        tone: 'gentle',
        messageTemplate: 'Hola {nombre}, 👋\n\nComo cliente Premium, notamos que tu pago de {monto} tiene 2 días de retraso. Como valoramos nuestra relación, queremos ayudarte. ¿Necesitas alguna flexibilidad en el pago? Contáctanos y encontraremos una solución.\n\nPuedes pagar aquí: {linkPago}',
        channel: 'whatsapp',
        sendTime: '10:00',
        variables: ['{nombre}', '{monto}', '{linkPago}'],
      },
    ],
    activeReminders: 8,
    sentThisMonth: 42,
    paymentRecoveryRate: 85.2,
    responseRate: 88.5,
    isActive: true,
    lastTriggered: '2025-11-09T09:00:00Z',
    createdAt: '2025-09-15T10:00:00Z',
    updatedAt: '2025-11-05T11:30:00Z',
  },
];

// Dashboard de estadísticas de mensajes - US-CA-010
const messageStatisticsDashboard: MessageStatisticsDashboard = {
  totalMessagesSent: 1247,
  totalMessagesOpened: 856,
  totalMessagesReplied: 623,
  overallOpenRate: 68.6,
  overallReplyRate: 49.9,
  period: '30d',
  lastUpdated: '2025-11-09T12:00:00Z',
  statistics: [
    {
      id: 'stat-recordatorio-sesion',
      messageType: 'recordatorio-sesion',
      typeLabel: 'Recordatorios de Sesión',
      totalSent: 342,
      totalOpened: 298,
      totalReplied: 187,
      openRate: 87.1,
      replyRate: 54.7,
      channel: 'whatsapp',
      period: '30d',
      trend: 'up',
      changePercentage: 5.2,
    },
    {
      id: 'stat-recordatorio-pago',
      messageType: 'recordatorio-pago',
      typeLabel: 'Recordatorios de Pago',
      totalSent: 156,
      totalOpened: 124,
      totalReplied: 98,
      openRate: 79.5,
      replyRate: 62.8,
      channel: 'whatsapp',
      period: '30d',
      trend: 'up',
      changePercentage: 8.3,
    },
    {
      id: 'stat-bienvenida',
      messageType: 'bienvenida',
      typeLabel: 'Bienvenida',
      totalSent: 48,
      totalOpened: 42,
      totalReplied: 35,
      openRate: 87.5,
      replyRate: 72.9,
      channel: 'whatsapp',
      period: '30d',
      trend: 'neutral',
      changePercentage: 0.0,
    },
    {
      id: 'stat-seguimiento',
      messageType: 'seguimiento',
      typeLabel: 'Seguimiento',
      totalSent: 234,
      totalOpened: 168,
      totalReplied: 112,
      openRate: 71.8,
      replyRate: 47.9,
      channel: 'whatsapp',
      period: '30d',
      trend: 'down',
      changePercentage: -3.1,
    },
    {
      id: 'stat-ausencia',
      messageType: 'ausencia',
      typeLabel: 'Ausencias',
      totalSent: 89,
      totalOpened: 67,
      totalReplied: 52,
      openRate: 75.3,
      replyRate: 58.4,
      channel: 'email',
      period: '30d',
      trend: 'up',
      changePercentage: 4.7,
    },
    {
      id: 'stat-inactividad',
      messageType: 'inactividad',
      typeLabel: 'Inactividad',
      totalSent: 156,
      totalOpened: 98,
      totalReplied: 64,
      openRate: 62.8,
      replyRate: 41.0,
      channel: 'email',
      period: '30d',
      trend: 'up',
      changePercentage: 6.2,
    },
    {
      id: 'stat-fecha-importante',
      messageType: 'fecha-importante',
      typeLabel: 'Fechas Importantes',
      totalSent: 45,
      totalOpened: 38,
      totalReplied: 32,
      openRate: 84.4,
      replyRate: 71.1,
      channel: 'whatsapp',
      period: '30d',
      trend: 'up',
      changePercentage: 2.5,
    },
    {
      id: 'stat-programado',
      messageType: 'programado',
      typeLabel: 'Programados',
      totalSent: 177,
      totalOpened: 121,
      totalReplied: 43,
      openRate: 68.4,
      replyRate: 24.3,
      channel: 'email',
      period: '30d',
      trend: 'down',
      changePercentage: -5.8,
    },
  ],
};

export async function fetchPaymentReminderAutomations(): Promise<PaymentReminderAutomation[]> {
  return simulateLatency(paymentReminderAutomations);
}

export async function fetchMessageStatisticsDashboard(): Promise<MessageStatisticsDashboard> {
  return simulateLatency(messageStatisticsDashboard);
}

// US-CA-011: Sistema de segmentación
const clientSegments: ClientSegment[] = [
  {
    id: 'seg-inactivos-30d',
    name: 'Clientes inactivos 30+ días',
    description: 'Clientes que no han asistido a sesiones en los últimos 30 días',
    criteria: [
      {
        id: 'crit-1',
        type: 'days-since-last-session',
        operator: 'greater-than',
        value: 30,
        label: 'Última sesión hace más de 30 días',
      },
    ],
    clientCount: 24,
    lastUpdated: '2025-01-15T10:00:00Z',
    createdAt: '2025-01-01T08:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    isActive: true,
    tags: ['inactivos', 'retención'],
  },
  {
    id: 'seg-plan-mensual',
    name: 'Clientes con plan mensual',
    description: 'Todos los clientes con plan de pago mensual activo',
    criteria: [
      {
        id: 'crit-2',
        type: 'plan-type',
        operator: 'equals',
        value: 'mensual',
        label: 'Plan tipo: Mensual',
      },
    ],
    clientCount: 156,
    lastUpdated: '2025-01-15T10:00:00Z',
    createdAt: '2025-01-01T08:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    isActive: true,
    tags: ['plan', 'mensual'],
  },
  {
    id: 'seg-alta-adherencia',
    name: 'Clientes con alta adherencia',
    description: 'Clientes con tasa de adherencia superior al 80%',
    criteria: [
      {
        id: 'crit-3',
        type: 'adherence-rate',
        operator: 'greater-than',
        value: 80,
        label: 'Adherencia mayor a 80%',
      },
    ],
    clientCount: 89,
    lastUpdated: '2025-01-15T10:00:00Z',
    createdAt: '2025-01-01T08:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    isActive: true,
    tags: ['adherencia', 'alto-engagement'],
  },
  {
    id: 'seg-pago-pendiente',
    name: 'Pagos pendientes',
    description: 'Clientes con pagos pendientes o vencidos',
    criteria: [
      {
        id: 'crit-4',
        type: 'payment-status',
        operator: 'in',
        value: ['pending', 'overdue'],
        label: 'Estado de pago: Pendiente o Vencido',
      },
    ],
    clientCount: 12,
    lastUpdated: '2025-01-15T10:00:00Z',
    createdAt: '2025-01-01T08:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    isActive: true,
    tags: ['pagos', 'urgente'],
  },
  // US-CA-032: Segmentos inteligentes basados en progreso de entrenamientos
  {
    id: 'seg-progreso-alto',
    name: 'Clientes con alto progreso',
    description: 'Clientes que muestran excelente progreso en sus entrenamientos',
    criteria: [],
    clientCount: 45,
    lastUpdated: '2025-01-15T10:00:00Z',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    isActive: true,
    tags: ['progreso', 'alto-rendimiento'],
    isIntelligentSegment: true,
    trainingProgressCriteria: [
      {
        metric: 'completion-rate',
        operator: 'greater-than',
        value: 85,
        period: '30d',
      },
      {
        metric: 'strength-improvement',
        operator: 'greater-than',
        value: 10,
        period: '30d',
      },
    ],
  },
  {
    id: 'seg-embajadores',
    name: 'Embajadores (Promotores NPS)',
    description: 'Clientes promotores que pueden convertirse en embajadores de la marca',
    criteria: [],
    clientCount: 67,
    lastUpdated: '2025-01-15T10:00:00Z',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    isActive: true,
    tags: ['embajadores', 'nps', 'promotores'],
    isIntelligentSegment: true,
    trainingProgressCriteria: [
      {
        metric: 'goal-achievement',
        operator: 'greater-than',
        value: 70,
        period: '90d',
      },
    ],
    // US-CA-033: Auto-actualización con feedback y NPS
    autoUpdateEnabled: true,
    autoUpdateFrequency: 'daily',
    autoUpdateRules: [
      {
        id: 'rule-embajadores-1',
        source: 'nps',
        condition: {
          type: 'nps-classification',
          operator: 'equals',
          value: 'promoter',
        },
        action: {
          type: 'add-to-segment',
        },
        isActive: true,
      },
    ],
    lastAutoUpdate: '2025-01-15T09:00:00Z',
  },
  {
    id: 'seg-detractores-recuperacion',
    name: 'Detractores - Recuperación',
    description: 'Clientes detractores que necesitan atención especial para recuperarlos',
    criteria: [],
    clientCount: 8,
    lastUpdated: '2025-01-15T10:00:00Z',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    isActive: true,
    tags: ['detractores', 'recuperación', 'nps'],
    isIntelligentSegment: true,
    trainingProgressCriteria: [
      {
        metric: 'completion-rate',
        operator: 'less-than',
        value: 50,
        period: '30d',
      },
    ],
    // US-CA-033: Auto-actualización con feedback y NPS
    autoUpdateEnabled: true,
    autoUpdateFrequency: 'realtime',
    autoUpdateRules: [
      {
        id: 'rule-detractores-1',
        source: 'nps',
        condition: {
          type: 'nps-classification',
          operator: 'equals',
          value: 'detractor',
        },
        action: {
          type: 'add-to-segment',
        },
        isActive: true,
      },
      {
        id: 'rule-detractores-2',
        source: 'nps',
        condition: {
          type: 'nps-score',
          operator: 'less-than',
          value: 6,
        },
        action: {
          type: 'add-to-segment',
        },
        isActive: true,
      },
    ],
    lastAutoUpdate: '2025-01-15T10:00:00Z',
  },
];

const bulkMessages: BulkMessage[] = [
  {
    id: 'bulk-msg-reactivacion',
    name: 'Campaña de reactivación Q1',
    description: 'Mensaje motivacional para clientes inactivos',
    mode: 'manual',
    segmentId: 'seg-inactivos-30d',
    segmentName: 'Clientes inactivos 30+ días',
    messageTemplate: 'Hola {nombre}, notamos que hace tiempo que no nos vemos. ¿Te gustaría reagendar tu próxima sesión?',
    channel: 'whatsapp',
    variables: ['nombre', 'ultimaSesion'],
    status: 'completed',
    sentDate: '2025-01-10T09:00:00Z',
    totalRecipients: 24,
    sentCount: 24,
    deliveredCount: 23,
    openedCount: 18,
    repliedCount: 8,
    deliveryRate: 95.8,
    openRate: 75.0,
    replyRate: 33.3,
    createdAt: '2025-01-08T08:00:00Z',
    updatedAt: '2025-01-10T09:30:00Z',
  },
  {
    id: 'bulk-msg-nuevo-plan',
    name: 'Oferta plan trimestral',
    description: 'Promoción especial para clientes mensuales',
    mode: 'manual',
    segmentId: 'seg-plan-mensual',
    segmentName: 'Clientes con plan mensual',
    messageTemplate: 'Hola {nombre}, tenemos una oferta especial para ti. Cambia a plan trimestral y ahorra 15%.',
    channel: 'email',
    variables: ['nombre', 'plan'],
    status: 'scheduled',
    scheduledDate: '2025-01-20T10:00:00Z',
    totalRecipients: 156,
    sentCount: 0,
    deliveredCount: 0,
    openedCount: 0,
    repliedCount: 0,
    deliveryRate: 0,
    openRate: 0,
    replyRate: 0,
    createdAt: '2025-01-15T08:00:00Z',
    updatedAt: '2025-01-15T08:00:00Z',
  },
];

export async function fetchClientSegments(): Promise<ClientSegment[]> {
  return simulateLatency(clientSegments);
}

export async function fetchBulkMessages(): Promise<BulkMessage[]> {
  return simulateLatency(bulkMessages);
}

// US-CA-012: Editor de newsletters
const newsletterTemplates: NewsletterTemplate[] = [
  {
    id: 'template-fitness-tips',
    name: 'Tips de Fitness Semanal',
    description: 'Plantilla para newsletter semanal con consejos de entrenamiento',
    category: 'fitness-tips',
    htmlContent: '<html><body><h1>Tips de Fitness</h1><p>Contenido del newsletter...</p></body></html>',
    isDefault: true,
    createdAt: '2025-01-01T08:00:00Z',
    updatedAt: '2025-01-01T08:00:00Z',
  },
  {
    id: 'template-nutricion',
    name: 'Newsletter de Nutrición',
    description: 'Plantilla enfocada en consejos nutricionales',
    category: 'nutrition',
    htmlContent: '<html><body><h1>Nutrición</h1><p>Contenido del newsletter...</p></body></html>',
    isDefault: false,
    createdAt: '2025-01-01T08:00:00Z',
    updatedAt: '2025-01-01T08:00:00Z',
  },
  {
    id: 'template-success-stories',
    name: 'Historias de Éxito',
    description: 'Plantilla para destacar transformaciones de clientes',
    category: 'success-stories',
    htmlContent: '<html><body><h1>Historias de Éxito</h1><p>Contenido del newsletter...</p></body></html>',
    isDefault: false,
    createdAt: '2025-01-01T08:00:00Z',
    updatedAt: '2025-01-01T08:00:00Z',
  },
];

const newsletters: Newsletter[] = [
  {
    id: 'newsletter-semanal-enero',
    name: 'Newsletter Semanal - Enero',
    description: 'Newsletter semanal con tips de fitness y motivación',
    subject: '🎯 Tips de esta semana para alcanzar tus objetivos',
    templateId: 'template-fitness-tips',
    htmlContent: '<html><body><h1>Tips de Fitness</h1><p>Contenido personalizado...</p></body></html>',
    segmentId: 'seg-alta-adherencia',
    segmentName: 'Clientes con alta adherencia',
    schedule: {
      id: 'schedule-1',
      frequency: 'weekly',
      dayOfWeek: 3, // Miércoles
      time: '09:00',
      timezone: 'America/Mexico_City',
      nextScheduledDate: '2025-01-22T09:00:00Z',
      lastSentDate: '2025-01-15T09:00:00Z',
      isActive: true,
    },
    status: 'scheduled',
    tracking: {
      id: 'track-1',
      newsletterId: 'newsletter-semanal-enero',
      sentDate: '2025-01-15T09:00:00Z',
      totalRecipients: 89,
      deliveredCount: 87,
      openedCount: 52,
      uniqueOpens: 48,
      clickedCount: 18,
      uniqueClicks: 16,
      unsubscribedCount: 1,
      bouncedCount: 2,
      deliveryRate: 97.8,
      openRate: 58.4,
      clickRate: 20.2,
      clickToOpenRate: 34.6,
      unsubscribeRate: 1.1,
      bounceRate: 2.2,
      topLinks: [
        { url: 'https://example.com/tips', clicks: 12, uniqueClicks: 11 },
        { url: 'https://example.com/retos', clicks: 6, uniqueClicks: 5 },
      ],
      deviceBreakdown: {
        desktop: 28,
        mobile: 20,
        tablet: 4,
      },
    },
    totalSent: 3,
    averageOpenRate: 58.4,
    averageClickRate: 20.2,
    createdAt: '2025-01-01T08:00:00Z',
    updatedAt: '2025-01-15T09:30:00Z',
    createdBy: 'user-1',
  },
  {
    id: 'newsletter-nutricion-mensual',
    name: 'Newsletter de Nutrición Mensual',
    description: 'Newsletter mensual con consejos nutricionales',
    subject: '🥗 Guía de nutrición para este mes',
    templateId: 'template-nutricion',
    htmlContent: '<html><body><h1>Nutrición</h1><p>Contenido personalizado...</p></body></html>',
    schedule: {
      id: 'schedule-2',
      frequency: 'monthly',
      dayOfMonth: 1,
      time: '10:00',
      timezone: 'America/Mexico_City',
      nextScheduledDate: '2025-02-01T10:00:00Z',
      lastSentDate: '2025-01-01T10:00:00Z',
      isActive: true,
    },
    status: 'scheduled',
    tracking: {
      id: 'track-2',
      newsletterId: 'newsletter-nutricion-mensual',
      sentDate: '2025-01-01T10:00:00Z',
      totalRecipients: 245,
      deliveredCount: 240,
      openedCount: 156,
      uniqueOpens: 142,
      clickedCount: 67,
      uniqueClicks: 61,
      unsubscribedCount: 2,
      bouncedCount: 5,
      deliveryRate: 98.0,
      openRate: 63.7,
      clickRate: 27.3,
      clickToOpenRate: 42.9,
      unsubscribeRate: 0.8,
      bounceRate: 2.0,
    },
    totalSent: 1,
    averageOpenRate: 63.7,
    averageClickRate: 27.3,
    createdAt: '2024-12-15T08:00:00Z',
    updatedAt: '2025-01-01T10:30:00Z',
    createdBy: 'user-1',
  },
  {
    id: 'newsletter-draft',
    name: 'Newsletter de Retos - Borrador',
    description: 'Newsletter sobre retos de fitness',
    subject: '💪 Únete al reto de 30 días',
    htmlContent: '<html><body><h1>Retos</h1><p>Contenido en borrador...</p></body></html>',
    status: 'draft',
    totalSent: 0,
    averageOpenRate: 0,
    averageClickRate: 0,
    createdAt: '2025-01-14T08:00:00Z',
    updatedAt: '2025-01-14T08:00:00Z',
    createdBy: 'user-1',
  },
];

export async function fetchNewsletters(): Promise<Newsletter[]> {
  return simulateLatency(newsletters);
}

export async function fetchNewsletterTemplates(): Promise<NewsletterTemplate[]> {
  return simulateLatency(newsletterTemplates);
}

// US-CA-013: Sistema de respuestas automáticas fuera de horario
const afterHoursAutoReplies: AfterHoursAutoReply[] = [
  {
    id: 'after-hours-whatsapp',
    name: 'Respuesta Automática WhatsApp - Horario Laboral',
    description: 'Responde automáticamente a mensajes recibidos fuera del horario de atención en WhatsApp',
    isActive: true,
    businessHours: [
      { id: 'mon', dayOfWeek: 1, dayName: 'Lunes', isEnabled: true, startTime: '09:00', endTime: '18:00' },
      { id: 'tue', dayOfWeek: 2, dayName: 'Martes', isEnabled: true, startTime: '09:00', endTime: '18:00' },
      { id: 'wed', dayOfWeek: 3, dayName: 'Miércoles', isEnabled: true, startTime: '09:00', endTime: '18:00' },
      { id: 'thu', dayOfWeek: 4, dayName: 'Jueves', isEnabled: true, startTime: '09:00', endTime: '18:00' },
      { id: 'fri', dayOfWeek: 5, dayName: 'Viernes', isEnabled: true, startTime: '09:00', endTime: '18:00' },
      { id: 'sat', dayOfWeek: 6, dayName: 'Sábado', isEnabled: false, startTime: '09:00', endTime: '13:00' },
      { id: 'sun', dayOfWeek: 0, dayName: 'Domingo', isEnabled: false, startTime: '09:00', endTime: '13:00' },
    ],
    timezone: 'America/Mexico_City',
    messageTemplate: 'Hola! 👋 Gracias por tu mensaje. Nuestro horario de atención es de lunes a viernes de 9:00 a 18:00. Te responderemos lo antes posible, normalmente en un plazo de 2-4 horas durante nuestro horario laboral. ¡Que tengas un excelente día!',
    channel: 'whatsapp',
    estimatedResponseTime: '2-4 horas (horario laboral)',
    variables: ['{horarioAtencion}', '{tiempoEstimado}'],
    totalRepliesSent: 47,
    lastTriggered: '2025-11-09T20:15:00Z',
    createdAt: '2025-10-01T10:00:00Z',
    updatedAt: '2025-11-08T14:30:00Z',
  },
  {
    id: 'after-hours-email',
    name: 'Respuesta Automática Email - Horario Extendido',
    description: 'Responde automáticamente a emails recibidos fuera del horario de atención',
    isActive: true,
    businessHours: [
      { id: 'mon', dayOfWeek: 1, dayName: 'Lunes', isEnabled: true, startTime: '08:00', endTime: '20:00' },
      { id: 'tue', dayOfWeek: 2, dayName: 'Martes', isEnabled: true, startTime: '08:00', endTime: '20:00' },
      { id: 'wed', dayOfWeek: 3, dayName: 'Miércoles', isEnabled: true, startTime: '08:00', endTime: '20:00' },
      { id: 'thu', dayOfWeek: 4, dayName: 'Jueves', isEnabled: true, startTime: '08:00', endTime: '20:00' },
      { id: 'fri', dayOfWeek: 5, dayName: 'Viernes', isEnabled: true, startTime: '08:00', endTime: '20:00' },
      { id: 'sat', dayOfWeek: 6, dayName: 'Sábado', isEnabled: true, startTime: '10:00', endTime: '14:00' },
      { id: 'sun', dayOfWeek: 0, dayName: 'Domingo', isEnabled: false, startTime: '10:00', endTime: '14:00' },
    ],
    timezone: 'America/Mexico_City',
    messageTemplate: 'Hola,\n\nGracias por contactarnos. Hemos recibido tu mensaje fuera de nuestro horario de atención.\n\nHorario de atención:\n- Lunes a Viernes: 8:00 - 20:00\n- Sábados: 10:00 - 14:00\n- Domingos: Cerrado\n\nTe responderemos mañana a primera hora (9:00 AM). Si es urgente, puedes contactarnos por WhatsApp.\n\nSaludos,\nTu entrenador personal',
    channel: 'email',
    estimatedResponseTime: 'Mañana a las 9:00 AM',
    variables: ['{horarioAtencion}', '{tiempoEstimado}'],
    totalRepliesSent: 23,
    lastTriggered: '2025-11-09T21:30:00Z',
    createdAt: '2025-10-05T10:00:00Z',
    updatedAt: '2025-11-07T11:20:00Z',
  },
];

// US-CA-014: Sistema de campañas promocionales
const promotionalCampaigns: PromotionalCampaign[] = [
  {
    id: 'promo-black-friday-2025',
    name: 'Black Friday 2025 - Descuento 30%',
    description: 'Campaña promocional de Black Friday con descuento del 30% en todos los planes',
    mode: 'manual',
    messageTemplate: '¡Hola {nombre}! 🎉 Black Friday está aquí. Obtén un 30% de descuento en todos nuestros planes. Válido hasta el 30 de noviembre. ¡No te lo pierdas! Usa el código: BLACK30',
    channel: 'whatsapp',
    recipients: {
      type: 'all',
    },
    variables: ['{nombre}', '{descuento}', '{codigo}', '{fechaVencimiento}'],
    status: 'completed',
    sentDate: '2025-11-25T09:00:00Z',
    tracking: {
      id: 'track-promo-bf',
      campaignId: 'promo-black-friday-2025',
      sentDate: '2025-11-25T09:00:00Z',
      totalRecipients: 245,
      sentCount: 245,
      deliveredCount: 238,
      openedCount: 189,
      clickedCount: 67,
      repliedCount: 45,
      conversionCount: 32,
      revenueGenerated: 12800,
      deliveryRate: 97.1,
      openRate: 77.2,
      clickRate: 27.3,
      replyRate: 18.4,
      conversionRate: 13.1,
    },
    createdAt: '2025-11-20T10:00:00Z',
    updatedAt: '2025-11-30T18:00:00Z',
    createdBy: 'user-1',
  },
  {
    id: 'promo-verano-inactivos',
    name: 'Promoción Verano - Reactivación Clientes Inactivos',
    description: 'Oferta especial de verano para reactivar clientes inactivos con descuento del 25%',
    mode: 'manual',
    messageTemplate: '¡Hola {nombre}! ☀️ El verano está aquí y queremos verte de vuelta. Oferta especial: 25% de descuento en tu próximo plan. Válido hasta el 15 de agosto. ¡Es momento de retomar tu rutina!',
    channel: 'email',
    recipients: {
      type: 'inactive-clients',
    },
    variables: ['{nombre}', '{descuento}', '{fechaVencimiento}'],
    status: 'scheduled',
    scheduledDate: '2025-07-01T10:00:00Z',
    createdAt: '2025-06-25T10:00:00Z',
    updatedAt: '2025-06-28T14:30:00Z',
    createdBy: 'user-1',
  },
  {
    id: 'promo-bono-trimestral',
    name: 'Promoción Bono Trimestral - Segmento Premium',
    description: 'Oferta de bono trimestral con sesión extra gratis para clientes premium',
    mode: 'manual',
    messageTemplate: '¡Hola {nombre}! 💎 Como cliente Premium, tenemos una oferta especial para ti: Contrata un bono trimestral y recibe 1 sesión adicional GRATIS. Oferta válida hasta el {fechaVencimiento}. ¡Aprovecha ahora!',
    channel: 'whatsapp',
    recipients: {
      type: 'segment',
      segmentId: 'seg-premium',
      segmentName: 'Clientes Premium',
    },
    variables: ['{nombre}', '{oferta}', '{fechaVencimiento}'],
    status: 'running',
    sentDate: '2025-11-10T09:00:00Z',
    tracking: {
      id: 'track-promo-bono',
      campaignId: 'promo-bono-trimestral',
      sentDate: '2025-11-10T09:00:00Z',
      totalRecipients: 42,
      sentCount: 42,
      deliveredCount: 41,
      openedCount: 38,
      clickedCount: 24,
      repliedCount: 18,
      conversionCount: 12,
      revenueGenerated: 4800,
      deliveryRate: 97.6,
      openRate: 90.5,
      clickRate: 57.1,
      replyRate: 42.9,
      conversionRate: 28.6,
    },
    createdAt: '2025-11-05T10:00:00Z',
    updatedAt: '2025-11-10T09:30:00Z',
    createdBy: 'user-1',
  },
  {
    id: 'promo-clase-grupal',
    name: 'Invitación Clase Grupal - Todos los Clientes',
    description: 'Invitación a clase grupal especial de fin de mes para todos los clientes',
    mode: 'manual',
    messageTemplate: '¡Hola {nombre}! 👥 Te invitamos a nuestra clase grupal especial este sábado a las 10:00 AM. Es GRATIS para todos nuestros clientes. ¡Ven con un amigo y ambos recibirán un descuento del 15%! Confirma tu asistencia respondiendo a este mensaje.',
    channel: 'whatsapp',
    recipients: {
      type: 'all',
    },
    variables: ['{nombre}', '{fechaClase}', '{horaClase}', '{descuento}'],
    status: 'draft',
    createdAt: '2025-11-08T10:00:00Z',
    updatedAt: '2025-11-08T10:00:00Z',
    createdBy: 'user-1',
  },
];

export async function fetchAfterHoursAutoReplies(): Promise<AfterHoursAutoReply[]> {
  return simulateLatency(afterHoursAutoReplies);
}

export async function fetchPromotionalCampaigns(): Promise<PromotionalCampaign[]> {
  return simulateLatency(promotionalCampaigns);
}

// US-CA-015: Integración con sistema de reservas
const reservationsIntegrationData: ReservationsIntegration = {
  isEnabled: true,
  rules: [
    {
      id: 'rule-new-session-reminder',
      name: 'Recordatorio nueva sesión',
      description: 'Envía recordatorio automático 24 horas antes de cada nueva sesión reservada',
      eventType: 'new-session',
      automationType: 'reminder',
      triggerDelay: {
        type: 'before',
        hours: 24,
      },
      messageTemplate: '¡Hola {nombre}! Te recordamos que tienes una sesión mañana {fecha} a las {hora}. ¡Nos vemos pronto!',
      channel: 'whatsapp',
      isActive: true,
      totalTriggered: 156,
      lastTriggered: '2025-11-30T14:30:00Z',
      createdAt: '2025-10-01T10:00:00Z',
      updatedAt: '2025-11-15T09:00:00Z',
    },
    {
      id: 'rule-cancellation-followup',
      name: 'Seguimiento cancelación',
      description: 'Envía mensaje de seguimiento cuando se cancela una sesión para ofrecer reagendar',
      eventType: 'session-cancelled',
      automationType: 'cancellation-follow-up',
      triggerDelay: {
        type: 'after',
        hours: 2,
      },
      messageTemplate: 'Hola {nombre}, vemos que cancelaste tu sesión del {fecha}. ¿Te gustaría reagendarla? Estamos aquí para ayudarte.',
      channel: 'whatsapp',
      isActive: true,
      totalTriggered: 23,
      lastTriggered: '2025-11-29T16:45:00Z',
      createdAt: '2025-10-01T10:00:00Z',
      updatedAt: '2025-11-10T11:00:00Z',
    },
    {
      id: 'rule-no-show-followup',
      name: 'Seguimiento ausencia sin avisar',
      description: 'Envía mensaje de seguimiento cuando un cliente no asiste a una sesión sin avisar',
      eventType: 'no-show',
      automationType: 'follow-up',
      triggerDelay: {
        type: 'after',
        hours: 1,
      },
      messageTemplate: 'Hola {nombre}, notamos que no pudiste asistir a tu sesión de hoy. ¿Todo bien? Estamos aquí para ayudarte a reagendar.',
      channel: 'whatsapp',
      isActive: true,
      totalTriggered: 8,
      lastTriggered: '2025-11-28T10:15:00Z',
      createdAt: '2025-10-01T10:00:00Z',
      updatedAt: '2025-11-05T09:00:00Z',
    },
    {
      id: 'rule-session-confirmation',
      name: 'Confirmación de sesión',
      description: 'Envía confirmación inmediata cuando se crea una nueva reserva',
      eventType: 'new-session',
      automationType: 'confirmation',
      messageTemplate: '¡Hola {nombre}! Tu sesión ha sido confirmada para el {fecha} a las {hora}. ¡Te esperamos!',
      channel: 'email',
      isActive: true,
      totalTriggered: 89,
      lastTriggered: '2025-11-30T18:20:00Z',
      createdAt: '2025-10-15T10:00:00Z',
      updatedAt: '2025-11-20T10:00:00Z',
    },
  ],
  recentEvents: [
    {
      id: 'event-1',
      reservationId: 'res-123',
      clientId: 'client-456',
      clientName: 'María González',
      eventType: 'new-session',
      sessionDate: '2025-12-02',
      sessionTime: '10:00',
      createdAt: '2025-11-30T18:20:00Z',
    },
    {
      id: 'event-2',
      reservationId: 'res-124',
      clientId: 'client-789',
      clientName: 'Juan Pérez',
      eventType: 'session-cancelled',
      sessionDate: '2025-12-01',
      sessionTime: '16:00',
      createdAt: '2025-11-30T14:30:00Z',
    },
    {
      id: 'event-3',
      reservationId: 'res-125',
      clientId: 'client-321',
      clientName: 'Ana Martínez',
      eventType: 'session-rescheduled',
      sessionDate: '2025-12-03',
      sessionTime: '11:00',
      originalDate: '2025-12-02',
      originalTime: '11:00',
      createdAt: '2025-11-30T12:15:00Z',
    },
  ],
  totalEventsProcessed: 276,
  eventsLast24h: 12,
  lastSyncDate: '2025-11-30T18:30:00Z',
  syncStatus: 'synced',
};

export async function fetchReservationsIntegration(): Promise<ReservationsIntegration> {
  return simulateLatency(reservationsIntegrationData);
}

// US-CA-016: Panel centralizado de automatizaciones
const centralAutomationsPanelData: CentralAutomationsPanel = {
  automations: [
    {
      id: 'auto-session-reminders',
      name: 'Recordatorios de Sesión',
      type: 'session-reminder',
      typeLabel: 'Recordatorios de sesión',
      description: 'Recordatorios automáticos 24h y 2h antes de cada sesión',
      status: 'active',
      nextScheduledSend: '2025-12-01T08:00:00Z',
      lastScheduledSend: '2025-11-30T08:00:00Z',
      totalSends: 1247,
      activeRecipients: 42,
      successRate: 94.5,
      createdAt: '2025-10-01T10:00:00Z',
      updatedAt: '2025-11-30T18:00:00Z',
      canPause: true,
      canResume: false,
      canEdit: true,
      canDelete: false,
    },
    {
      id: 'auto-welcome-sequence',
      name: 'Secuencia de Bienvenida',
      type: 'welcome-sequence',
      typeLabel: 'Secuencia de bienvenida',
      description: 'Secuencia de 3 mensajes para nuevos clientes',
      status: 'active',
      nextScheduledSend: '2025-12-01T09:00:00Z',
      lastScheduledSend: '2025-11-30T09:00:00Z',
      totalSends: 89,
      activeRecipients: 12,
      successRate: 87.2,
      createdAt: '2025-10-05T10:00:00Z',
      updatedAt: '2025-11-28T10:00:00Z',
      canPause: true,
      canResume: false,
      canEdit: true,
      canDelete: false,
    },
    {
      id: 'auto-absence-followup',
      name: 'Seguimiento de Ausencias',
      type: 'absence-follow-up',
      typeLabel: 'Seguimiento de ausencias',
      description: 'Mensajes automáticos cuando un cliente falta sin avisar',
      status: 'active',
      nextScheduledSend: undefined,
      lastScheduledSend: '2025-11-28T10:15:00Z',
      totalSends: 23,
      activeRecipients: 0,
      successRate: 78.3,
      createdAt: '2025-10-10T10:00:00Z',
      updatedAt: '2025-11-28T10:15:00Z',
      canPause: true,
      canResume: false,
      canEdit: true,
      canDelete: false,
    },
    {
      id: 'auto-payment-reminders',
      name: 'Recordatorios de Pago',
      type: 'payment-reminder',
      typeLabel: 'Recordatorios de pago',
      description: 'Recordatorios automáticos para pagos pendientes',
      status: 'paused',
      nextScheduledSend: undefined,
      lastScheduledSend: '2025-11-25T09:00:00Z',
      totalSends: 156,
      activeRecipients: 8,
      successRate: 82.1,
      createdAt: '2025-09-15T10:00:00Z',
      updatedAt: '2025-11-25T14:00:00Z',
      canPause: false,
      canResume: true,
      canEdit: true,
      canDelete: false,
    },
    {
      id: 'auto-inactivity-sequence',
      name: 'Secuencia de Inactividad',
      type: 'inactivity-sequence',
      typeLabel: 'Secuencia de inactividad',
      description: 'Secuencia para reactivar clientes inactivos',
      status: 'active',
      nextScheduledSend: '2025-12-02T10:00:00Z',
      lastScheduledSend: '2025-11-29T10:00:00Z',
      totalSends: 45,
      activeRecipients: 15,
      successRate: 65.4,
      createdAt: '2025-10-20T10:00:00Z',
      updatedAt: '2025-11-29T10:00:00Z',
      canPause: true,
      canResume: false,
      canEdit: true,
      canDelete: false,
    },
    {
      id: 'auto-important-dates',
      name: 'Fechas Importantes',
      type: 'important-date',
      typeLabel: 'Fechas importantes',
      description: 'Mensajes automáticos para cumpleaños y aniversarios',
      status: 'active',
      nextScheduledSend: '2025-12-05T09:00:00Z',
      lastScheduledSend: '2025-11-28T09:00:00Z',
      totalSends: 34,
      activeRecipients: 5,
      successRate: 91.2,
      createdAt: '2025-09-01T10:00:00Z',
      updatedAt: '2025-11-28T09:00:00Z',
      canPause: true,
      canResume: false,
      canEdit: true,
      canDelete: false,
    },
    {
      id: 'auto-reservation-integration',
      name: 'Integración con Reservas',
      type: 'reservation-integration',
      typeLabel: 'Integración con reservas',
      description: 'Automatizaciones basadas en eventos del calendario de reservas',
      status: 'active',
      nextScheduledSend: undefined,
      lastScheduledSend: '2025-11-30T18:20:00Z',
      totalSends: 276,
      activeRecipients: 0,
      successRate: 88.5,
      createdAt: '2025-10-01T10:00:00Z',
      updatedAt: '2025-11-30T18:30:00Z',
      canPause: true,
      canResume: false,
      canEdit: true,
      canDelete: false,
    },
  ],
  totalActive: 6,
  totalPaused: 1,
  totalFinished: 0,
  upcomingSends: [
    {
      automationId: 'auto-session-reminders',
      automationName: 'Recordatorios de Sesión',
      scheduledDate: '2025-12-01T08:00:00Z',
      recipientCount: 12,
      channel: 'whatsapp',
    },
    {
      automationId: 'auto-welcome-sequence',
      automationName: 'Secuencia de Bienvenida',
      scheduledDate: '2025-12-01T09:00:00Z',
      recipientCount: 3,
      channel: 'email',
    },
    {
      automationId: 'auto-inactivity-sequence',
      automationName: 'Secuencia de Inactividad',
      scheduledDate: '2025-12-02T10:00:00Z',
      recipientCount: 5,
      channel: 'whatsapp',
    },
    {
      automationId: 'auto-important-dates',
      automationName: 'Fechas Importantes',
      scheduledDate: '2025-12-05T09:00:00Z',
      recipientCount: 2,
      channel: 'email',
    },
  ],
  lastUpdated: '2025-11-30T18:30:00Z',
};

export async function fetchCentralAutomationsPanel(): Promise<CentralAutomationsPanel> {
  return simulateLatency(centralAutomationsPanelData);
}

// US-CA-017: Sistema de alertas de mensajes importantes
const messageAlertsDashboardData: MessageAlertsDashboard = {
  activeAlerts: [
    {
      id: 'alert-001',
      messageId: 'msg-001',
      messageType: 'recordatorio-pago',
      messageTypeLabel: 'Recordatorio de Pago',
      clientId: 'client-001',
      clientName: 'María González',
      channel: 'whatsapp',
      sentAt: '2025-11-09T08:00:00Z',
      timeSinceSent: {
        hours: 26,
        days: 1,
      },
      threshold: {
        type: 'replied',
        hours: 24,
      },
      priority: 'high',
      status: 'active',
      messageContent: 'Hola María! 👋 Te recordamos que tienes un pago pendiente de €120 con vencimiento el 10/11/2025. Puedes pagar aquí: [link]. ¡Gracias!',
      createdAt: '2025-11-10T08:00:00Z',
      updatedAt: '2025-11-10T08:00:00Z',
    },
    {
      id: 'alert-002',
      messageId: 'msg-002',
      messageType: 'recordatorio-sesion',
      messageTypeLabel: 'Recordatorio de Sesión',
      clientId: 'client-002',
      clientName: 'Juan Pérez',
      channel: 'email',
      sentAt: '2025-11-08T10:00:00Z',
      timeSinceSent: {
        hours: 50,
        days: 2,
      },
      threshold: {
        type: 'opened',
        hours: 48,
      },
      priority: 'urgent',
      status: 'active',
      messageContent: 'Hola Juan, recordatorio: sesión mañana a las 18:00. Lugar: Gimnasio Central.',
      messageSubject: 'Recordatorio de sesión - 10 de noviembre',
      createdAt: '2025-11-10T10:00:00Z',
      updatedAt: '2025-11-10T10:00:00Z',
    },
    {
      id: 'alert-003',
      messageId: 'msg-003',
      messageType: 'seguimiento',
      messageTypeLabel: 'Seguimiento',
      clientId: 'client-003',
      clientName: 'Ana Martínez',
      channel: 'whatsapp',
      sentAt: '2025-11-09T14:00:00Z',
      timeSinceSent: {
        hours: 18,
        days: 0,
      },
      threshold: {
        type: 'replied',
        hours: 12,
      },
      priority: 'medium',
      status: 'acknowledged',
      messageContent: 'Hola Ana! 👋 ¿Cómo te sientes con tu entrenamiento? ¿Hay algo en lo que podamos ayudarte?',
      acknowledgedAt: '2025-11-10T09:00:00Z',
      createdAt: '2025-11-09T14:00:00Z',
      updatedAt: '2025-11-10T09:00:00Z',
    },
  ],
  totalActive: 2,
  byPriority: {
    urgent: 1,
    high: 1,
    medium: 0,
    low: 0,
  },
  byStatus: {
    active: 2,
    acknowledged: 1,
    resolved: 0,
    dismissed: 0,
  },
  settings: [
    {
      id: 'settings-recordatorio-pago',
      messageType: 'recordatorio-pago',
      messageTypeLabel: 'Recordatorio de Pago',
      isEnabled: true,
      thresholds: {
        opened: {
          enabled: false,
          hours: 48,
          priority: 'medium',
        },
        replied: {
          enabled: true,
          hours: 24,
          priority: 'high',
        },
      },
      notificationChannels: ['email', 'in-app'],
      autoEscalation: {
        enabled: true,
        escalateAfterHours: 48,
      },
      createdAt: '2025-10-01T10:00:00Z',
      updatedAt: '2025-11-01T10:00:00Z',
    },
    {
      id: 'settings-recordatorio-sesion',
      messageType: 'recordatorio-sesion',
      messageTypeLabel: 'Recordatorio de Sesión',
      isEnabled: true,
      thresholds: {
        opened: {
          enabled: true,
          hours: 48,
          priority: 'urgent',
        },
        replied: {
          enabled: false,
          hours: 24,
          priority: 'medium',
        },
      },
      notificationChannels: ['email', 'push', 'in-app'],
      autoEscalation: {
        enabled: true,
        escalateAfterHours: 72,
      },
      createdAt: '2025-10-01T10:00:00Z',
      updatedAt: '2025-11-01T10:00:00Z',
    },
  ],
  lastUpdated: '2025-11-10T10:00:00Z',
};

// US-CA-018: Sistema de horarios preferidos de envío
const preferredSendingSchedulesDashboardData: PreferredSendingSchedulesDashboard = {
  clientSchedules: [
    {
      id: 'client-schedule-001',
      clientId: 'client-001',
      clientName: 'María González',
      timezone: 'Europe/Madrid',
      windows: [
        { id: 'w1', dayOfWeek: 1, dayName: 'Lunes', isEnabled: true, startTime: '09:00', endTime: '12:00' },
        { id: 'w2', dayOfWeek: 2, dayName: 'Martes', isEnabled: true, startTime: '09:00', endTime: '12:00' },
        { id: 'w3', dayOfWeek: 3, dayName: 'Miércoles', isEnabled: true, startTime: '09:00', endTime: '12:00' },
        { id: 'w4', dayOfWeek: 4, dayName: 'Jueves', isEnabled: true, startTime: '09:00', endTime: '12:00' },
        { id: 'w5', dayOfWeek: 5, dayName: 'Viernes', isEnabled: true, startTime: '09:00', endTime: '12:00' },
      ],
      isActive: true,
      appliesTo: {
        channels: ['whatsapp', 'email'],
        messageTypes: ['recordatorio-sesion', 'seguimiento', 'recordatorio-pago'],
      },
      createdAt: '2025-10-15T10:00:00Z',
      updatedAt: '2025-11-01T10:00:00Z',
    },
    {
      id: 'client-schedule-002',
      clientId: 'client-002',
      clientName: 'Juan Pérez',
      timezone: 'Europe/Madrid',
      windows: [
        { id: 'w1', dayOfWeek: 1, dayName: 'Lunes', isEnabled: true, startTime: '18:00', endTime: '20:00' },
        { id: 'w2', dayOfWeek: 2, dayName: 'Martes', isEnabled: true, startTime: '18:00', endTime: '20:00' },
        { id: 'w3', dayOfWeek: 3, dayName: 'Miércoles', isEnabled: true, startTime: '18:00', endTime: '20:00' },
        { id: 'w4', dayOfWeek: 4, dayName: 'Jueves', isEnabled: true, startTime: '18:00', endTime: '20:00' },
        { id: 'w5', dayOfWeek: 5, dayName: 'Viernes', isEnabled: true, startTime: '18:00', endTime: '20:00' },
      ],
      isActive: true,
      appliesTo: {
        channels: ['whatsapp', 'sms'],
        messageTypes: ['recordatorio-sesion', 'seguimiento'],
      },
      createdAt: '2025-10-20T10:00:00Z',
      updatedAt: '2025-11-05T10:00:00Z',
    },
  ],
  groupSchedules: [
    {
      id: 'group-schedule-001',
      groupId: 'group-premium',
      groupName: 'Clientes Premium',
      timezone: 'Europe/Madrid',
      windows: [
        { id: 'w1', dayOfWeek: 1, dayName: 'Lunes', isEnabled: true, startTime: '10:00', endTime: '13:00' },
        { id: 'w2', dayOfWeek: 2, dayName: 'Martes', isEnabled: true, startTime: '10:00', endTime: '13:00' },
        { id: 'w3', dayOfWeek: 3, dayName: 'Miércoles', isEnabled: true, startTime: '10:00', endTime: '13:00' },
        { id: 'w4', dayOfWeek: 4, dayName: 'Jueves', isEnabled: true, startTime: '10:00', endTime: '13:00' },
        { id: 'w5', dayOfWeek: 5, dayName: 'Viernes', isEnabled: true, startTime: '10:00', endTime: '13:00' },
      ],
      isActive: true,
      appliesTo: {
        channels: ['whatsapp', 'email'],
        messageTypes: ['recordatorio-sesion', 'seguimiento', 'fecha-importante'],
      },
      clientCount: 42,
      createdAt: '2025-09-15T10:00:00Z',
      updatedAt: '2025-11-01T10:00:00Z',
    },
  ],
  rules: [
    {
      id: 'rule-default-business-hours',
      name: 'Horario Laboral Estándar',
      description: 'Horario preferido para todos los clientes: lunes a viernes de 9:00 a 18:00',
      priority: 1,
      appliesTo: {
        type: 'all',
      },
      schedule: {
        timezone: 'Europe/Madrid',
        windows: [
          { id: 'w1', dayOfWeek: 1, dayName: 'Lunes', isEnabled: true, startTime: '09:00', endTime: '18:00' },
          { id: 'w2', dayOfWeek: 2, dayName: 'Martes', isEnabled: true, startTime: '09:00', endTime: '18:00' },
          { id: 'w3', dayOfWeek: 3, dayName: 'Miércoles', isEnabled: true, startTime: '09:00', endTime: '18:00' },
          { id: 'w4', dayOfWeek: 4, dayName: 'Jueves', isEnabled: true, startTime: '09:00', endTime: '18:00' },
          { id: 'w5', dayOfWeek: 5, dayName: 'Viernes', isEnabled: true, startTime: '09:00', endTime: '18:00' },
        ],
      },
      channels: ['whatsapp', 'email', 'sms'],
      messageTypes: ['recordatorio-sesion', 'seguimiento', 'recordatorio-pago', 'bienvenida'],
      isActive: true,
      createdAt: '2025-09-01T10:00:00Z',
      updatedAt: '2025-11-01T10:00:00Z',
    },
  ],
  totalClientsWithSchedule: 2,
  totalGroupsWithSchedule: 1,
  totalRules: 1,
  nextScheduledMessages: [
    {
      messageId: 'msg-scheduled-001',
      messageType: 'recordatorio-sesion',
      clientId: 'client-001',
      clientName: 'María González',
      scheduledTime: '2025-11-11T10:00:00Z',
      preferredWindow: {
        startTime: '09:00',
        endTime: '12:00',
      },
      channel: 'whatsapp',
    },
    {
      messageId: 'msg-scheduled-002',
      messageType: 'seguimiento',
      clientId: 'client-002',
      clientName: 'Juan Pérez',
      scheduledTime: '2025-11-11T19:00:00Z',
      preferredWindow: {
        startTime: '18:00',
        endTime: '20:00',
      },
      channel: 'whatsapp',
    },
  ],
  lastUpdated: '2025-11-10T10:00:00Z',
};

export async function fetchMessageAlertsDashboard(): Promise<MessageAlertsDashboard> {
  return simulateLatency(messageAlertsDashboardData);
}

export async function fetchPreferredSendingSchedulesDashboard(): Promise<PreferredSendingSchedulesDashboard> {
  return simulateLatency(preferredSendingSchedulesDashboardData);
}

// US-CA-019: Multi-step sequences with conditional logic
const multiStepSequencesData: MultiStepSequence[] = [
  {
    id: 'seq-onboarding-completo',
    name: 'Onboarding Completo con Lógica Condicional',
    description: 'Secuencia de onboarding que se adapta según las respuestas del cliente',
    trigger: 'new-client',
    steps: [
      {
        id: 'step-1',
        stepNumber: 1,
        name: 'Bienvenida Inicial',
        description: 'Mensaje de bienvenida al nuevo cliente',
        messageTemplate: '¡Hola {nombre}! Bienvenido/a. Estamos emocionados de comenzar este viaje contigo.',
        channel: 'whatsapp',
        delay: { value: 0, unit: 'minutes' },
        variables: ['nombre'],
        pauseOnResponse: true,
        pauseOnAction: false,
        isActive: true,
      },
      {
        id: 'step-2',
        stepNumber: 2,
        name: 'Información sobre el Programa',
        description: 'Información sobre qué esperar',
        messageTemplate: 'En los próximos días te enviaremos información sobre tu programa personalizado. ¿Tienes alguna pregunta específica?',
        channel: 'email',
        delay: { value: 1, unit: 'days' },
        variables: ['nombre'],
        conditionalRules: [
          {
            id: 'rule-1',
            condition: {
              type: 'response',
              field: 'response',
              operator: 'contains',
              value: 'pregunta',
            },
            thenAction: {
              type: 'send-message',
              messageId: 'msg-preguntas',
            },
          },
        ],
        pauseOnResponse: true,
        pauseOnAction: false,
        isActive: true,
      },
      {
        id: 'step-3',
        stepNumber: 3,
        name: 'Preparación Primera Sesión',
        description: 'Preparación para la primera sesión',
        messageTemplate: 'Tu primera sesión está programada para {fecha}. ¿Necesitas alguna recomendación previa?',
        channel: 'whatsapp',
        delay: { value: 2, unit: 'days' },
        scheduledTime: '09:00',
        variables: ['nombre', 'fecha'],
        pauseOnResponse: true,
        pauseOnAction: true,
        isActive: true,
      },
    ],
    activeClients: 12,
    pausedClients: 3,
    completionRate: 75.5,
    averageCompletionTime: 4.2,
    responseRate: 68.3,
    status: 'running',
    createdAt: '2025-10-15T10:00:00Z',
    updatedAt: '2025-11-01T10:00:00Z',
    createdBy: 'user-001',
  },
  {
    id: 'seq-reactivacion-inteligente',
    name: 'Reactivación Inteligente',
    description: 'Secuencia que se adapta según el nivel de inactividad',
    trigger: 'inactivity',
    triggerCondition: {
      type: 'daysSinceLastSession',
      value: 30,
    },
    steps: [
      {
        id: 'step-reactivacion-1',
        stepNumber: 1,
        name: 'Check-in Amigable',
        messageTemplate: 'Hola {nombre}, hace {dias} días que no nos vemos. ¿Todo bien?',
        channel: 'whatsapp',
        delay: { value: 0, unit: 'hours' },
        variables: ['nombre', 'dias'],
        pauseOnResponse: true,
        pauseOnAction: true,
        isActive: true,
      },
      {
        id: 'step-reactivacion-2',
        stepNumber: 2,
        name: 'Oferta Especial',
        messageTemplate: 'Tenemos una oferta especial para ti. ¿Te interesa retomar tus entrenamientos?',
        channel: 'email',
        delay: { value: 3, unit: 'days' },
        conditionalRules: [
          {
            id: 'rule-reactivacion-1',
            condition: {
              type: 'response',
              operator: 'contains',
              value: 'sí',
            },
            thenAction: {
              type: 'jump-to-step',
              stepId: 'step-reactivacion-3',
            },
          },
        ],
        pauseOnResponse: true,
        pauseOnAction: true,
        isActive: true,
      },
      {
        id: 'step-reactivacion-3',
        stepNumber: 3,
        name: 'Seguimiento de Interés',
        messageTemplate: 'Perfecto, te ayudo a agendar tu próxima sesión. ¿Qué día te viene bien?',
        channel: 'whatsapp',
        delay: { value: 1, unit: 'days' },
        variables: ['nombre'],
        pauseOnResponse: true,
        pauseOnAction: true,
        isActive: true,
      },
    ],
    activeClients: 8,
    pausedClients: 2,
    completionRate: 62.5,
    averageCompletionTime: 6.8,
    responseRate: 55.2,
    status: 'running',
    createdAt: '2025-09-20T10:00:00Z',
    updatedAt: '2025-11-01T10:00:00Z',
    createdBy: 'user-001',
  },
];

export async function fetchMultiStepSequences(): Promise<MultiStepSequence[]> {
  return simulateLatency(multiStepSequencesData);
}

// US-CA-020: Export reports
const exportReportsData: ExportReport[] = [
  {
    id: 'report-001',
    configuration: {
      name: 'Reporte Mensual de Comunicación - Octubre 2025',
      format: 'pdf',
      period: 'monthly',
      includeMetrics: {
        communicationMetrics: true,
        periodComparison: true,
        automationEffectiveness: true,
        channelBreakdown: true,
        messageTypeBreakdown: true,
        dailyTrends: true,
        topPerformers: true,
      },
      compareWithPreviousPeriod: true,
      includeCharts: true,
      includeRawData: false,
    },
    generatedAt: '2025-11-01T10:00:00Z',
    generatedBy: 'user-001',
    fileUrl: '/reports/report-001.pdf',
    fileSize: 2456789,
    status: 'completed',
    metrics: {
      totalMessagesSent: 1247,
      totalMessagesDelivered: 1205,
      totalMessagesOpened: 856,
      totalMessagesReplied: 423,
      deliveryRate: 96.6,
      openRate: 71.0,
      replyRate: 35.1,
      byChannel: [
        {
          channel: 'whatsapp',
          sent: 856,
          delivered: 845,
          opened: 712,
          replied: 389,
          deliveryRate: 98.7,
          openRate: 84.3,
          replyRate: 46.0,
        },
        {
          channel: 'email',
          sent: 312,
          delivered: 289,
          opened: 112,
          replied: 28,
          deliveryRate: 92.6,
          openRate: 38.8,
          replyRate: 9.7,
        },
        {
          channel: 'sms',
          sent: 79,
          delivered: 71,
          opened: 32,
          replied: 6,
          deliveryRate: 89.9,
          openRate: 45.1,
          replyRate: 8.5,
        },
      ],
      byMessageType: [
        {
          messageType: 'recordatorio-sesion',
          messageTypeLabel: 'Recordatorios de Sesión',
          sent: 456,
          opened: 389,
          replied: 156,
          openRate: 85.3,
          replyRate: 34.2,
        },
        {
          messageType: 'bienvenida',
          messageTypeLabel: 'Bienvenida',
          sent: 234,
          opened: 198,
          replied: 89,
          openRate: 84.6,
          replyRate: 38.0,
        },
      ],
      byDay: [],
    },
    periodComparison: {
      current: {
        totalMessagesSent: 1247,
        totalMessagesDelivered: 1205,
        totalMessagesOpened: 856,
        totalMessagesReplied: 423,
        deliveryRate: 96.6,
        openRate: 71.0,
        replyRate: 35.1,
        byChannel: [],
        byMessageType: [],
        byDay: [],
      },
      previous: {
        totalMessagesSent: 1089,
        totalMessagesDelivered: 1056,
        totalMessagesOpened: 712,
        totalMessagesReplied: 345,
        deliveryRate: 97.0,
        openRate: 67.4,
        replyRate: 31.7,
        byChannel: [],
        byMessageType: [],
        byDay: [],
      },
      changes: [
        {
          metric: 'Mensajes Enviados',
          currentValue: 1247,
          previousValue: 1089,
          change: 158,
          changePercentage: 14.5,
          trend: 'up',
        },
        {
          metric: 'Tasa de Apertura',
          currentValue: 71.0,
          previousValue: 67.4,
          change: 3.6,
          changePercentage: 5.3,
          trend: 'up',
        },
        {
          metric: 'Tasa de Respuesta',
          currentValue: 35.1,
          previousValue: 31.7,
          change: 3.4,
          changePercentage: 10.7,
          trend: 'up',
        },
      ],
    },
    automationEffectiveness: [
      {
        automationId: 'auto-001',
        automationName: 'Recordatorios de Sesión',
        automationType: 'session-reminder',
        automationTypeLabel: 'Recordatorios de Sesión',
        totalSent: 456,
        totalDelivered: 445,
        totalOpened: 389,
        totalReplied: 156,
        deliveryRate: 97.6,
        openRate: 85.3,
        replyRate: 34.2,
        trend: 'up',
        changePercentage: 8.5,
      },
      {
        automationId: 'auto-002',
        automationName: 'Secuencia de Bienvenida',
        automationType: 'welcome-sequence',
        automationTypeLabel: 'Secuencias de Bienvenida',
        totalSent: 234,
        totalDelivered: 228,
        totalOpened: 198,
        totalReplied: 89,
        deliveryRate: 97.4,
        openRate: 84.6,
        replyRate: 38.0,
        conversionRate: 72.5,
        trend: 'up',
        changePercentage: 12.3,
      },
    ],
  },
  {
    id: 'report-002',
    configuration: {
      name: 'Análisis de Efectividad - Últimos 30 días',
      format: 'excel',
      period: '30d',
      includeMetrics: {
        communicationMetrics: true,
        periodComparison: false,
        automationEffectiveness: true,
        channelBreakdown: true,
        messageTypeBreakdown: true,
        dailyTrends: true,
        topPerformers: true,
      },
      compareWithPreviousPeriod: false,
      includeCharts: false,
      includeRawData: true,
    },
    generatedAt: '2025-11-05T14:30:00Z',
    generatedBy: 'user-001',
    fileUrl: '/reports/report-002.xlsx',
    fileSize: 1234567,
    status: 'completed',
  },
];

export async function fetchExportReports(): Promise<ExportReport[]> {
  return simulateLatency(exportReportsData);
}

// US-CA-026: Triggers basados en acciones de clientes
const clientActionTriggersData: ClientActionTriggersDashboard = {
  triggers: [
    {
      id: 'trigger-session-booked',
      name: 'Confirmación de reserva',
      description: 'Envía mensaje de confirmación cuando un cliente reserva una sesión',
      actionType: 'session-booked',
      actionTypeLabel: 'Reserva sesión',
      messageTemplate: '¡Hola {nombre}! Confirmamos tu sesión el {fechaSesion} a las {horaSesion}. ¡Te esperamos!',
      channel: 'whatsapp',
      delay: {
        value: 5,
        unit: 'minutes',
      },
      variables: ['{nombre}', '{fechaSesion}', '{horaSesion}'],
      isActive: true,
      totalTriggered: 145,
      lastTriggered: '2025-11-05T10:30:00Z',
      responseRate: 78.5,
      createdAt: '2025-10-01T00:00:00Z',
      updatedAt: '2025-11-05T10:30:00Z',
    },
    {
      id: 'trigger-session-missed',
      name: 'Seguimiento por falta',
      description: 'Envía mensaje cuando un cliente falta a una clase sin avisar',
      actionType: 'session-missed',
      actionTypeLabel: 'Falta a clase',
      messageTemplate: 'Hola {nombre}, notamos que faltaste a tu sesión del {fechaSesion}. ¿Todo bien? Podemos reagendar cuando quieras.',
      channel: 'whatsapp',
      delay: {
        value: 2,
        unit: 'hours',
      },
      variables: ['{nombre}', '{fechaSesion}', '{opcionesReagendar}'],
      isActive: true,
      totalTriggered: 23,
      lastTriggered: '2025-11-04T16:45:00Z',
      responseRate: 65.2,
      createdAt: '2025-10-01T00:00:00Z',
      updatedAt: '2025-11-04T16:45:00Z',
    },
    {
      id: 'trigger-payment-made',
      name: 'Agradecimiento por pago',
      description: 'Mensaje de agradecimiento cuando un cliente realiza un pago',
      actionType: 'payment-made',
      actionTypeLabel: 'Realiza pago',
      messageTemplate: '¡Gracias {nombre}! Hemos recibido tu pago de {monto}. ¡Seguimos entrenando juntos! 💪',
      channel: 'whatsapp',
      variables: ['{nombre}', '{monto}'],
      isActive: true,
      totalTriggered: 89,
      lastTriggered: '2025-11-05T09:15:00Z',
      responseRate: 45.0,
      createdAt: '2025-10-15T00:00:00Z',
      updatedAt: '2025-11-05T09:15:00Z',
    },
  ],
  recentEvents: [
    {
      id: 'event-001',
      triggerId: 'trigger-session-booked',
      triggerName: 'Confirmación de reserva',
      clientId: 'client-001',
      clientName: 'María García',
      actionType: 'session-booked',
      actionDetails: {
        sessionId: 'session-001',
        sessionDate: '2025-11-06',
        sessionTime: '10:00',
      },
      messageSent: true,
      messageSentAt: '2025-11-05T10:35:00Z',
      messageContent: '¡Hola María! Confirmamos tu sesión el 06/11/2025 a las 10:00. ¡Te esperamos!',
      responseReceived: true,
      responseReceivedAt: '2025-11-05T10:36:00Z',
      createdAt: '2025-11-05T10:30:00Z',
    },
    {
      id: 'event-002',
      triggerId: 'trigger-session-missed',
      triggerName: 'Seguimiento por falta',
      clientId: 'client-002',
      clientName: 'Juan Pérez',
      actionType: 'session-missed',
      actionDetails: {
        sessionId: 'session-002',
        sessionDate: '2025-11-04',
        sessionTime: '14:00',
      },
      messageSent: true,
      messageSentAt: '2025-11-04T16:45:00Z',
      messageContent: 'Hola Juan, notamos que faltaste a tu sesión del 04/11/2025. ¿Todo bien? Podemos reagendar cuando quieras.',
      responseReceived: false,
      createdAt: '2025-11-04T14:00:00Z',
    },
  ],
  totalTriggers: 3,
  activeTriggers: 3,
  totalEventsProcessed: 257,
  eventsLast24h: 12,
  averageResponseRate: 62.9,
  lastUpdated: '2025-11-05T10:35:00Z',
};

export async function fetchClientActionTriggers(): Promise<ClientActionTriggersDashboard> {
  return simulateLatency(clientActionTriggersData);
}

// US-CA-027: Recordatorios con IA
const aiReminderAutomationData: AIReminderAutomationDashboard = {
  automations: [
    {
      id: 'ai-reminder-001',
      name: 'Recordatorios inteligentes de sesiones',
      description: 'Recordatorios adaptados por IA según el historial y comportamiento del cliente',
      isActive: true,
      baseTemplate: 'Hola {nombre}, recordatorio: tienes sesión el {fechaSesion} a las {horaSesion}. ¡Nos vemos!',
      channel: 'whatsapp',
      timing: {
        type: 'before',
        hours: 24,
      },
      aiSettings: {
        adaptationLevel: 'moderate',
        considerHistory: true,
        considerGoals: true,
        considerAttendance: true,
        toneAdjustment: true,
        personalizationDepth: 'advanced',
      },
      variables: ['{nombre}', '{fechaSesion}', '{horaSesion}'],
      totalSent: 342,
      totalAdapted: 298,
      averageResponseRate: 82.5,
      averageAttendanceImprovement: 15.3,
      lastTriggered: '2025-11-05T08:00:00Z',
      createdAt: '2025-09-01T00:00:00Z',
      updatedAt: '2025-11-05T08:00:00Z',
    },
    {
      id: 'ai-reminder-002',
      name: 'Recordatorios motivacionales',
      description: 'Recordatorios con mensajes motivacionales adaptados según progreso del cliente',
      isActive: true,
      baseTemplate: '¡Hola {nombre}! Tu sesión es mañana a las {horaSesion}. ¡Vamos a por ello!',
      channel: 'whatsapp',
      timing: {
        type: 'before',
        hours: 12,
      },
      aiSettings: {
        adaptationLevel: 'aggressive',
        considerHistory: true,
        considerGoals: true,
        considerAttendance: true,
        toneAdjustment: true,
        personalizationDepth: 'advanced',
      },
      variables: ['{nombre}', '{horaSesion}'],
      totalSent: 156,
      totalAdapted: 156,
      averageResponseRate: 88.2,
      averageAttendanceImprovement: 22.1,
      lastTriggered: '2025-11-05T20:00:00Z',
      createdAt: '2025-10-01T00:00:00Z',
      updatedAt: '2025-11-05T20:00:00Z',
    },
  ],
  upcomingReminders: [
    {
      id: 'reminder-001',
      clientId: 'client-003',
      clientName: 'Ana López',
      sessionId: 'session-003',
      sessionDate: '2025-11-06',
      sessionTime: '09:00',
      baseTemplate: 'Hola {nombre}, recordatorio: tienes sesión el {fechaSesion} a las {horaSesion}. ¡Nos vemos!',
      aiAdaptedMessage: '¡Hola Ana! 👋 Recordatorio: tu sesión es mañana a las 09:00. Veo que has estado muy constante últimamente (85% asistencia), ¡sigue así! 💪 ¡Nos vemos!',
      adaptationReason: 'Cliente con buena asistencia, mensaje más positivo y motivacional',
      channel: 'whatsapp',
      scheduledAt: '2025-11-05T09:00:00Z',
      status: 'scheduled',
      clientHistory: {
        clientId: 'client-003',
        clientName: 'Ana López',
        totalSessions: 45,
        attendanceRate: 85,
        averageDaysBetweenSessions: 3.2,
        lastSessionDate: '2025-11-03',
        missedSessionsCount: 5,
        cancelledSessionsCount: 2,
        preferredChannel: 'whatsapp',
        preferredTimeOfDay: '09:00',
        responseRate: 90,
        goals: [
          {
            name: 'Perder 5kg',
            progress: 60,
            status: 'in-progress',
          },
        ],
        planType: 'mensual',
        membershipStartDate: '2025-06-01',
      },
      aiConfidence: 92,
      createdAt: '2025-11-04T08:00:00Z',
    },
    {
      id: 'reminder-002',
      clientId: 'client-004',
      clientName: 'Carlos Ruiz',
      sessionId: 'session-004',
      sessionDate: '2025-11-06',
      sessionTime: '18:00',
      baseTemplate: 'Hola {nombre}, recordatorio: tienes sesión el {fechaSesion} a las {horaSesion}. ¡Nos vemos!',
      aiAdaptedMessage: 'Hola Carlos, recordatorio: tu sesión es mañana a las 18:00. Noto que has faltado a las últimas 2 sesiones. ¿Hay algo en lo que pueda ayudarte? Estoy aquí para apoyarte en tu proceso. 💙',
      adaptationReason: 'Cliente con baja asistencia reciente, mensaje más empático y de apoyo',
      channel: 'whatsapp',
      scheduledAt: '2025-11-05T18:00:00Z',
      status: 'scheduled',
      clientHistory: {
        clientId: 'client-004',
        clientName: 'Carlos Ruiz',
        totalSessions: 12,
        attendanceRate: 45,
        averageDaysBetweenSessions: 7.5,
        lastSessionDate: '2025-10-28',
        missedSessionsCount: 8,
        cancelledSessionsCount: 3,
        preferredChannel: 'whatsapp',
        responseRate: 40,
        planType: 'mensual',
        membershipStartDate: '2025-08-01',
      },
      aiConfidence: 87,
      createdAt: '2025-11-04T18:00:00Z',
    },
  ],
  totalActive: 2,
  totalScheduled: 24,
  averageResponseRate: 85.4,
  attendanceImprovement: 18.7,
  aiAdaptationRate: 87.1,
  lastUpdated: '2025-11-05T08:00:00Z',
};

export async function fetchAIReminderAutomation(): Promise<AIReminderAutomationDashboard> {
  return simulateLatency(aiReminderAutomationData);
}

// US-CA-030: Newsletter IA basadas en highlights semanales
const weeklyHighlightsNewsletterGeneratorData: WeeklyHighlightsNewsletterGenerator = {
  currentWeekSummary: {
    weekStartDate: '2025-11-04',
    weekEndDate: '2025-11-10',
    highlights: [
      {
        id: 'hl-001',
        category: 'client-success',
        categoryLabel: 'Éxito de Cliente',
        title: 'María alcanzó su objetivo de pérdida de peso',
        description: 'María ha perdido 8kg en 3 meses, superando su objetivo inicial. Compartió su testimonio en redes sociales.',
        clientName: 'María González',
        date: '2025-11-06',
        importance: 'high',
        metrics: {
          label: 'Pérdida de peso',
          value: '8kg',
        },
      },
      {
        id: 'hl-002',
        category: 'training-tip',
        categoryLabel: 'Tip de Entrenamiento',
        title: 'Nueva técnica de HIIT para principiantes',
        description: 'Desarrollamos una rutina de HIIT de 20 minutos especialmente diseñada para clientes que recién comienzan.',
        date: '2025-11-05',
        importance: 'medium',
      },
      {
        id: 'hl-003',
        category: 'achievement',
        categoryLabel: 'Logro',
        title: '3 clientes completaron el reto de 30 días',
        description: 'Tres clientes completaron exitosamente el reto de entrenamiento de 30 días sin faltar una sesión.',
        date: '2025-11-07',
        importance: 'high',
        metrics: {
          label: 'Clientes completaron',
          value: 3,
        },
      },
      {
        id: 'hl-004',
        category: 'nutrition-advice',
        categoryLabel: 'Consejo Nutricional',
        title: 'Guía de meal prep para la semana',
        description: 'Compartimos una guía completa de meal prep con recetas fáciles y nutritivas para toda la semana.',
        date: '2025-11-08',
        importance: 'medium',
      },
    ],
    totalHighlights: 4,
    byCategory: {
      'client-success': 1,
      'training-tip': 1,
      achievement: 1,
      'nutrition-advice': 1,
    },
    topHighlights: [
      {
        id: 'hl-001',
        category: 'client-success',
        categoryLabel: 'Éxito de Cliente',
        title: 'María alcanzó su objetivo de pérdida de peso',
        description: 'María ha perdido 8kg en 3 meses, superando su objetivo inicial. Compartió su testimonio en redes sociales.',
        clientName: 'María González',
        date: '2025-11-06',
        importance: 'high',
        metrics: {
          label: 'Pérdida de peso',
          value: '8kg',
        },
      },
      {
        id: 'hl-003',
        category: 'achievement',
        categoryLabel: 'Logro',
        title: '3 clientes completaron el reto de 30 días',
        description: 'Tres clientes completaron exitosamente el reto de entrenamiento de 30 días sin faltar una sesión.',
        date: '2025-11-07',
        importance: 'high',
        metrics: {
          label: 'Clientes completaron',
          value: 3,
        },
      },
    ],
  },
  previousNewsletters: [
    {
      id: 'nl-ai-001',
      name: 'Newsletter Semanal - Semana del 28 Oct',
      subject: '🎉 Esta semana: Logros increíbles y tips de entrenamiento',
      htmlContent: '<p>Contenido del newsletter generado con IA...</p>',
      textContent: 'Contenido del newsletter generado con IA...',
      highlightsUsed: [],
      cta: {
        text: 'Reserva tu próxima sesión',
        url: 'https://example.com/reservar',
        type: 'button',
      },
      personalizationLevel: 'advanced',
      tone: 'motivacional y cercano',
      estimatedValue: 'Alto valor educativo',
      generatedAt: '2025-10-28T10:00:00Z',
      status: 'sent',
    },
  ],
  settings: {
    autoGenerateEnabled: false,
    defaultTone: 'motivacional',
    includeClientNames: true,
    ctaStyle: 'moderate',
    personalizationDepth: 'advanced',
  },
  lastGenerated: '2025-10-28T10:00:00Z',
  lastUpdated: '2025-11-05T10:00:00Z',
};

export async function fetchWeeklyHighlightsNewsletterGenerator(): Promise<WeeklyHighlightsNewsletterGenerator> {
  return simulateLatency(weeklyHighlightsNewsletterGeneratorData);
}

// US-CA-031: Prompts rápidos para WhatsApp con audio/nota de voz sugerida
const quickWhatsAppPromptsLibraryData: QuickWhatsAppPromptsLibrary = {
  prompts: [
    {
      id: 'wa-prompt-001',
      name: 'Seguimiento post-sesión',
      category: 'follow-up',
      categoryLabel: 'Seguimiento',
      messageTemplate: '¡Hola {nombre}! 👋\n\n¿Cómo te sentiste después de la sesión de hoy? Si tienes alguna pregunta o necesitas ajustar algo, estoy aquí para ayudarte.\n\n¡Sigue así! 💪',
      variables: ['{nombre}'],
      voiceNoteSuggestion: {
        id: 'vn-001',
        title: 'Nota de voz de seguimiento amigable',
        description: 'Una nota de voz cálida para preguntar cómo se sintió el cliente después de la sesión',
        duration: 30,
        script: 'Hola {nombre}, solo quería saber cómo te sentiste después de la sesión de hoy. Si tienes alguna pregunta o necesitas ajustar algo, no dudes en escribirme. ¡Sigue así!',
        tone: 'friendly',
        useCase: 'Ideal para clientes nuevos o que necesitan más motivación',
        exampleScript: 'Hola María, solo quería saber cómo te sentiste después de la sesión de hoy. Si tienes alguna pregunta o necesitas ajustar algo, no dudes en escribirme. ¡Sigue así!',
      },
      suggestedAudioDuration: 30,
      whenToUse: 'Después de una sesión de entrenamiento, especialmente para clientes nuevos',
      personalizationTips: [
        'Menciona algo específico de la sesión (ej: "ese último ejercicio de piernas")',
        'Ajusta el tono según la personalidad del cliente',
        'Si el cliente tuvo dificultades, ofrece ayuda específica',
      ],
      usageCount: 45,
      lastUsed: '2025-11-05T14:30:00Z',
      isFavorite: true,
      tags: ['seguimiento', 'post-sesión', 'alta-efectividad'],
      createdAt: '2025-09-01T00:00:00Z',
      updatedAt: '2025-11-05T14:30:00Z',
    },
    {
      id: 'wa-prompt-002',
      name: 'Motivación para sesión mañana',
      category: 'motivation',
      categoryLabel: 'Motivación',
      messageTemplate: '¡Buenos días {nombre}! ☀️\n\nMañana tenemos sesión a las {hora}. Te espero con energía para seguir trabajando en tus objetivos.\n\n¡Vamos a por ello! 🔥',
      variables: ['{nombre}', '{hora}'],
      voiceNoteSuggestion: {
        id: 'vn-002',
        title: 'Nota de voz motivacional',
        description: 'Una nota de voz energética para motivar al cliente antes de su sesión',
        duration: 25,
        script: '¡Buenos días {nombre}! Solo quería recordarte que mañana tenemos sesión a las {hora}. Te espero con mucha energía para seguir trabajando en tus objetivos. ¡Vamos a por ello!',
        tone: 'motivational',
        useCase: 'Para clientes que necesitan un empujón extra de motivación',
        exampleScript: '¡Buenos días María! Solo quería recordarte que mañana tenemos sesión a las 10:00. Te espero con mucha energía para seguir trabajando en tus objetivos. ¡Vamos a por ello!',
      },
      suggestedAudioDuration: 25,
      whenToUse: 'Un día antes de la sesión, especialmente para clientes que tienden a faltar',
      personalizationTips: [
        'Menciona un logro reciente del cliente',
        'Ajusta el nivel de energía según la personalidad',
        'Si el cliente está pasando por un momento difícil, sé más empático',
      ],
      usageCount: 32,
      lastUsed: '2025-11-04T09:00:00Z',
      isFavorite: true,
      tags: ['motivación', 'recordatorio', 'alta-conversión'],
      createdAt: '2025-09-01T00:00:00Z',
      updatedAt: '2025-11-04T09:00:00Z',
    },
    {
      id: 'wa-prompt-003',
      name: 'Celebración de logro',
      category: 'celebration',
      categoryLabel: 'Celebración',
      messageTemplate: '¡Felicidades {nombre}! 🎉\n\nHas alcanzado {logro}. Esto es increíble y demuestra tu dedicación y esfuerzo.\n\n¡Estoy muy orgulloso/a de ti! Sigue así 💪',
      variables: ['{nombre}', '{logro}'],
      voiceNoteSuggestion: {
        id: 'vn-003',
        title: 'Nota de voz de celebración',
        description: 'Una nota de voz entusiasta para celebrar los logros del cliente',
        duration: 35,
        script: '¡Felicidades {nombre}! Has alcanzado {logro} y esto es increíble. Demuestra tu dedicación y esfuerzo. Estoy muy orgulloso de ti. ¡Sigue así!',
        tone: 'friendly',
        useCase: 'Cuando un cliente alcanza un objetivo o logro importante',
        exampleScript: '¡Felicidades María! Has alcanzado tu objetivo de pérdida de peso y esto es increíble. Demuestra tu dedicación y esfuerzo. Estoy muy orgulloso de ti. ¡Sigue así!',
      },
      suggestedAudioDuration: 35,
      whenToUse: 'Cuando un cliente alcanza un objetivo, marca personal, o logro significativo',
      personalizationTips: [
        'Sé específico sobre el logro alcanzado',
        'Menciona el esfuerzo que el cliente ha puesto',
        'Conecta el logro con sus objetivos a largo plazo',
      ],
      usageCount: 18,
      lastUsed: '2025-11-06T16:00:00Z',
      isFavorite: false,
      tags: ['celebración', 'motivación'],
      createdAt: '2025-09-15T00:00:00Z',
      updatedAt: '2025-11-06T16:00:00Z',
    },
    {
      id: 'wa-prompt-004',
      name: 'Check-in semanal',
      category: 'check-in',
      categoryLabel: 'Check-in',
      messageTemplate: 'Hola {nombre}! 👋\n\nSolo quería hacer un check-in rápido. ¿Cómo va la semana? ¿Hay algo en lo que necesites ayuda o ajustar?\n\nEstoy aquí para apoyarte 💙',
      variables: ['{nombre}'],
      whenToUse: 'Para hacer seguimiento semanal con clientes activos',
      personalizationTips: [
        'Pregunta sobre objetivos específicos del cliente',
        'Ofrece ayuda concreta si menciona dificultades',
        'Reconoce el progreso si lo menciona',
      ],
      usageCount: 28,
      lastUsed: '2025-11-03T10:00:00Z',
      isFavorite: false,
      tags: ['check-in', 'seguimiento'],
      createdAt: '2025-09-20T00:00:00Z',
      updatedAt: '2025-11-03T10:00:00Z',
    },
  ],
  totalPrompts: 4,
  byCategory: {
    'follow-up': 1,
    motivation: 1,
    celebration: 1,
    'check-in': 1,
  },
  recentPrompts: [
    {
      id: 'wa-prompt-001',
      name: 'Seguimiento post-sesión',
      category: 'follow-up',
      categoryLabel: 'Seguimiento',
      messageTemplate: '¡Hola {nombre}! 👋\n\n¿Cómo te sentiste después de la sesión de hoy? Si tienes alguna pregunta o necesitas ajustar algo, estoy aquí para ayudarte.\n\n¡Sigue así! 💪',
      variables: ['{nombre}'],
      voiceNoteSuggestion: {
        id: 'vn-001',
        title: 'Nota de voz de seguimiento amigable',
        description: 'Una nota de voz cálida para preguntar cómo se sintió el cliente después de la sesión',
        duration: 30,
        script: 'Hola {nombre}, solo quería saber cómo te sentiste después de la sesión de hoy. Si tienes alguna pregunta o necesitas ajustar algo, no dudes en escribirme. ¡Sigue así!',
        tone: 'friendly',
        useCase: 'Ideal para clientes nuevos o que necesitan más motivación',
        exampleScript: 'Hola María, solo quería saber cómo te sentiste después de la sesión de hoy. Si tienes alguna pregunta o necesitas ajustar algo, no dudes en escribirme. ¡Sigue así!',
      },
      suggestedAudioDuration: 30,
      whenToUse: 'Después de una sesión de entrenamiento, especialmente para clientes nuevos',
      personalizationTips: [
        'Menciona algo específico de la sesión (ej: "ese último ejercicio de piernas")',
        'Ajusta el tono según la personalidad del cliente',
        'Si el cliente tuvo dificultades, ofrece ayuda específica',
      ],
      usageCount: 45,
      lastUsed: '2025-11-05T14:30:00Z',
      isFavorite: true,
      tags: ['seguimiento', 'post-sesión', 'alta-efectividad'],
      createdAt: '2025-09-01T00:00:00Z',
      updatedAt: '2025-11-05T14:30:00Z',
    },
    {
      id: 'wa-prompt-002',
      name: 'Motivación para sesión mañana',
      category: 'motivation',
      categoryLabel: 'Motivación',
      messageTemplate: '¡Buenos días {nombre}! ☀️\n\nMañana tenemos sesión a las {hora}. Te espero con energía para seguir trabajando en tus objetivos.\n\n¡Vamos a por ello! 🔥',
      variables: ['{nombre}', '{hora}'],
      voiceNoteSuggestion: {
        id: 'vn-002',
        title: 'Nota de voz motivacional',
        description: 'Una nota de voz energética para motivar al cliente antes de su sesión',
        duration: 25,
        script: '¡Buenos días {nombre}! Solo quería recordarte que mañana tenemos sesión a las {hora}. Te espero con mucha energía para seguir trabajando en tus objetivos. ¡Vamos a por ello!',
        tone: 'motivational',
        useCase: 'Para clientes que necesitan un empujón extra de motivación',
        exampleScript: '¡Buenos días María! Solo quería recordarte que mañana tenemos sesión a las 10:00. Te espero con mucha energía para seguir trabajando en tus objetivos. ¡Vamos a por ello!',
      },
      suggestedAudioDuration: 25,
      whenToUse: 'Un día antes de la sesión, especialmente para clientes que tienden a faltar',
      personalizationTips: [
        'Menciona un logro reciente del cliente',
        'Ajusta el nivel de energía según la personalidad',
        'Si el cliente está pasando por un momento difícil, sé más empático',
      ],
      usageCount: 32,
      lastUsed: '2025-11-04T09:00:00Z',
      isFavorite: true,
      tags: ['motivación', 'recordatorio', 'alta-conversión'],
      createdAt: '2025-09-01T00:00:00Z',
      updatedAt: '2025-11-04T09:00:00Z',
    },
  ],
  favoritePrompts: [
    {
      id: 'wa-prompt-001',
      name: 'Seguimiento post-sesión',
      category: 'follow-up',
      categoryLabel: 'Seguimiento',
      messageTemplate: '¡Hola {nombre}! 👋\n\n¿Cómo te sentiste después de la sesión de hoy? Si tienes alguna pregunta o necesitas ajustar algo, estoy aquí para ayudarte.\n\n¡Sigue así! 💪',
      variables: ['{nombre}'],
      voiceNoteSuggestion: {
        id: 'vn-001',
        title: 'Nota de voz de seguimiento amigable',
        description: 'Una nota de voz cálida para preguntar cómo se sintió el cliente después de la sesión',
        duration: 30,
        script: 'Hola {nombre}, solo quería saber cómo te sentiste después de la sesión de hoy. Si tienes alguna pregunta o necesitas ajustar algo, no dudes en escribirme. ¡Sigue así!',
        tone: 'friendly',
        useCase: 'Ideal para clientes nuevos o que necesitan más motivación',
        exampleScript: 'Hola María, solo quería saber cómo te sentiste después de la sesión de hoy. Si tienes alguna pregunta o necesitas ajustar algo, no dudes en escribirme. ¡Sigue así!',
      },
      suggestedAudioDuration: 30,
      whenToUse: 'Después de una sesión de entrenamiento, especialmente para clientes nuevos',
      personalizationTips: [
        'Menciona algo específico de la sesión (ej: "ese último ejercicio de piernas")',
        'Ajusta el tono según la personalidad del cliente',
        'Si el cliente tuvo dificultades, ofrece ayuda específica',
      ],
      usageCount: 45,
      lastUsed: '2025-11-05T14:30:00Z',
      isFavorite: true,
      tags: ['seguimiento', 'post-sesión', 'alta-efectividad'],
      createdAt: '2025-09-01T00:00:00Z',
      updatedAt: '2025-11-05T14:30:00Z',
    },
    {
      id: 'wa-prompt-002',
      name: 'Motivación para sesión mañana',
      category: 'motivation',
      categoryLabel: 'Motivación',
      messageTemplate: '¡Buenos días {nombre}! ☀️\n\nMañana tenemos sesión a las {hora}. Te espero con energía para seguir trabajando en tus objetivos.\n\n¡Vamos a por ello! 🔥',
      variables: ['{nombre}', '{hora}'],
      voiceNoteSuggestion: {
        id: 'vn-002',
        title: 'Nota de voz motivacional',
        description: 'Una nota de voz energética para motivar al cliente antes de su sesión',
        duration: 25,
        script: '¡Buenos días {nombre}! Solo quería recordarte que mañana tenemos sesión a las {hora}. Te espero con mucha energía para seguir trabajando en tus objetivos. ¡Vamos a por ello!',
        tone: 'motivational',
        useCase: 'Para clientes que necesitan un empujón extra de motivación',
        exampleScript: '¡Buenos días María! Solo quería recordarte que mañana tenemos sesión a las 10:00. Te espero con mucha energía para seguir trabajando en tus objetivos. ¡Vamos a por ello!',
      },
      suggestedAudioDuration: 25,
      whenToUse: 'Un día antes de la sesión, especialmente para clientes que tienden a faltar',
      personalizationTips: [
        'Menciona un logro reciente del cliente',
        'Ajusta el nivel de energía según la personalidad',
        'Si el cliente está pasando por un momento difícil, sé más empático',
      ],
      usageCount: 32,
      lastUsed: '2025-11-04T09:00:00Z',
      isFavorite: true,
      tags: ['motivación', 'recordatorio', 'alta-conversión'],
      createdAt: '2025-09-01T00:00:00Z',
      updatedAt: '2025-11-04T09:00:00Z',
    },
  ],
  voiceNoteSuggestions: [
    {
      id: 'vn-001',
      title: 'Nota de voz de seguimiento amigable',
      description: 'Una nota de voz cálida para preguntar cómo se sintió el cliente después de la sesión',
      duration: 30,
      script: 'Hola {nombre}, solo quería saber cómo te sentiste después de la sesión de hoy. Si tienes alguna pregunta o necesitas ajustar algo, no dudes en escribirme. ¡Sigue así!',
      tone: 'friendly',
      useCase: 'Ideal para clientes nuevos o que necesitan más motivación',
      exampleScript: 'Hola María, solo quería saber cómo te sentiste después de la sesión de hoy. Si tienes alguna pregunta o necesitas ajustar algo, no dudes en escribirme. ¡Sigue así!',
    },
    {
      id: 'vn-002',
      title: 'Nota de voz motivacional',
      description: 'Una nota de voz energética para motivar al cliente antes de su sesión',
      duration: 25,
      script: '¡Buenos días {nombre}! Solo quería recordarte que mañana tenemos sesión a las {hora}. Te espero con mucha energía para seguir trabajando en tus objetivos. ¡Vamos a por ello!',
      tone: 'motivational',
      useCase: 'Para clientes que necesitan un empujón extra de motivación',
      exampleScript: '¡Buenos días María! Solo quería recordarte que mañana tenemos sesión a las 10:00. Te espero con mucha energía para seguir trabajando en tus objetivos. ¡Vamos a por ello!',
    },
    {
      id: 'vn-003',
      title: 'Nota de voz de celebración',
      description: 'Una nota de voz entusiasta para celebrar los logros del cliente',
      duration: 35,
      script: '¡Felicidades {nombre}! Has alcanzado {logro} y esto es increíble. Demuestra tu dedicación y esfuerzo. Estoy muy orgulloso de ti. ¡Sigue así!',
      tone: 'friendly',
      useCase: 'Cuando un cliente alcanza un objetivo o logro importante',
      exampleScript: '¡Felicidades María! Has alcanzado tu objetivo de pérdida de peso y esto es increíble. Demuestra tu dedicación y esfuerzo. Estoy muy orgulloso de ti. ¡Sigue así!',
    },
  ],
  settings: {
    defaultIncludeVoiceNote: true,
    defaultTone: 'friendly',
    autoSuggestVoiceNote: true,
  },
  lastUpdated: '2025-11-05T10:00:00Z',
};

export async function fetchQuickWhatsAppPromptsLibrary(): Promise<QuickWhatsAppPromptsLibrary> {
  return simulateLatency(quickWhatsAppPromptsLibraryData);
}

// Mock data para AI Heat Map Sending Schedules
const aiHeatMapSendingSchedulesData: AIHeatMapSendingSchedulesDashboard = {
  period: '30d',
  channels: [
    {
      channel: 'whatsapp',
      timeSlots: Array.from({ length: 168 }, (_, i) => {
        const dayOfWeek = Math.floor(i / 24);
        const hour = i % 24;
        const score = Math.random() * 100;
        return {
          hour,
          dayOfWeek,
          dayName: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][dayOfWeek],
          openRate: score * 0.8,
          replyRate: score * 0.6,
          totalSent: Math.floor(Math.random() * 100) + 10,
          totalOpened: Math.floor(Math.random() * 80) + 5,
          totalReplied: Math.floor(Math.random() * 50) + 2,
          score,
          recommendation: score >= 80 ? 'optimal' : score >= 60 ? 'good' : score >= 40 ? 'fair' : score >= 20 ? 'poor' : 'avoid',
          aiInsight: score >= 80 ? 'Horario óptimo detectado por IA' : undefined,
        };
      }),
      optimalSlots: [],
      worstSlots: [],
      averageOpenRate: 65.5,
      averageReplyRate: 42.3,
      aiRecommendations: [
        'Los mejores horarios son entre 9:00-11:00 y 18:00-20:00 de lunes a viernes',
        'Evitar envíos los domingos antes de las 10:00',
        'Los mensajes de seguimiento tienen mejor respuesta los martes y miércoles',
      ],
    },
    {
      channel: 'email',
      timeSlots: Array.from({ length: 168 }, (_, i) => {
        const dayOfWeek = Math.floor(i / 24);
        const hour = i % 24;
        const score = Math.random() * 100;
        return {
          hour,
          dayOfWeek,
          dayName: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][dayOfWeek],
          openRate: score * 0.7,
          replyRate: score * 0.4,
          totalSent: Math.floor(Math.random() * 150) + 20,
          totalOpened: Math.floor(Math.random() * 100) + 10,
          totalReplied: Math.floor(Math.random() * 40) + 3,
          score,
          recommendation: score >= 80 ? 'optimal' : score >= 60 ? 'good' : score >= 40 ? 'fair' : score >= 20 ? 'poor' : 'avoid',
        };
      }),
      optimalSlots: [],
      worstSlots: [],
      averageOpenRate: 58.2,
      averageReplyRate: 28.7,
      aiRecommendations: [
        'Los emails tienen mejor apertura los martes y jueves entre 10:00-12:00',
        'Evitar envíos los lunes por la mañana temprano',
      ],
    },
  ],
  overallOptimalTime: {
    dayOfWeek: 2,
    dayName: 'Martes',
    hour: 10,
    score: 92.5,
  },
  overallWorstTime: {
    dayOfWeek: 0,
    dayName: 'Domingo',
    hour: 3,
    score: 12.3,
  },
  aiInsights: {
    summary: 'El análisis IA muestra que los horarios óptimos varían significativamente entre canales. WhatsApp tiene mejor rendimiento en horarios laborales, mientras que email funciona mejor a media mañana.',
    recommendations: [
      'Programar mensajes importantes de WhatsApp entre 9:00-11:00 de lunes a viernes',
      'Enviar emails promocionales los martes y jueves a las 10:00',
      'Evitar cualquier envío los domingos antes de las 10:00',
      'Ajustar horarios según el tipo de mensaje: recordatorios funcionan mejor por la mañana',
    ],
    trends: [
      {
        trend: 'Aumento del 15% en tasa de respuesta en horarios recomendados',
        impact: 'high',
        action: 'Aplicar automáticamente horarios óptimos a todas las automatizaciones',
      },
      {
        trend: 'Disminución del 30% en engagement en horarios no recomendados',
        impact: 'medium',
        action: 'Revisar y ajustar horarios de mensajes programados',
      },
    ],
  },
  lastUpdated: new Date().toISOString(),
  lastAIAnalysis: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
};

// Calcular optimal y worst slots
aiHeatMapSendingSchedulesData.channels.forEach((channel) => {
  channel.optimalSlots = [...channel.timeSlots]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
  channel.worstSlots = [...channel.timeSlots]
    .sort((a, b) => a.score - b.score)
    .slice(0, 5);
});

// Mock data para Actionable KPIs
// Calcular KPIs específicos de campañas y automatizaciones
const calculateCampaignAutomationKPIs = () => {
  // Contar automatizaciones activas vs en borrador
  const activeAutomations = messagingAutomations.filter(a => a.status === 'running').length;
  const draftAutomations = messagingAutomations.filter(a => a.status === 'draft').length;
  
  // Contar todas las automatizaciones (incluyendo sequences, welcome sequences, etc.)
  const allActiveAutomations = [
    ...messagingAutomations.filter(a => a.status === 'running'),
    ...lifecycleSequences.filter(s => s.status === 'running'),
    ...welcomeSequences.filter(w => w.status === 'running'),
    ...absenceAutomations.filter(a => a.isActive),
    ...inactivityAutomations.filter(a => a.isActive),
    ...importantDateAutomations.filter(a => a.isActive),
    ...paymentReminderAutomations.filter(a => a.isActive),
  ].length;
  
  const allDraftAutomations = [
    ...messagingAutomations.filter(a => a.status === 'draft'),
    ...lifecycleSequences.filter(s => s.status === 'draft'),
    ...welcomeSequences.filter(w => w.status === 'draft'),
  ].length;
  
  // Calcular revenue de campañas automatizadas
  const automatedCampaignsRevenue = multiChannelCampaigns
    .filter(c => c.mode === 'automation')
    .reduce((sum, c) => sum + c.revenue, 0);
  
  const totalAutomatedCampaigns = multiChannelCampaigns.filter(c => c.mode === 'automation').length;
  
  // Calcular tasa de conversión de automatizaciones (promedio de las activas)
  const activeAutomationConversionRates = [
    ...messagingAutomations.filter(a => a.status === 'running').map(a => a.responseRate),
    ...lifecycleSequences.filter(s => s.status === 'running').map(s => s.completionRate),
  ];
  const automationConversionRate = activeAutomationConversionRates.length > 0
    ? activeAutomationConversionRates.reduce((sum, rate) => sum + rate, 0) / activeAutomationConversionRates.length
    : 0;
  
  // Mensajes enviados esta semana (simulado - en producción vendría de datos reales)
  const messagesSentThisWeek = 312; // Aproximadamente 25% del total mensual
  const optimalMessagesPerWeek = 400; // Valor de referencia óptimo
  
  return {
    automationConversionRate,
    activeAutomations: allActiveAutomations,
    draftAutomations: allDraftAutomations,
    messagesSentThisWeek,
    optimalMessagesPerWeek,
    automatedCampaignsRevenue,
    totalAutomatedCampaigns,
  };
};

const campaignAutomationKPIs = calculateCampaignAutomationKPIs();

const actionableKPIsData: ActionableKPIDashboard = {
  period: '30d',
  summary: {
    totalMessagesSent: 1247,
    totalBookingsGenerated: 342,
    totalSalesGenerated: 89,
    totalRevenue: 12450.75,
    overallBookingConversionRate: 27.4,
    overallSaleConversionRate: 7.1,
    averageRevenuePerMessage: 9.98,
    roi: 245.8,
    // KPIs específicos de campañas y automatizaciones
    automationConversionRate: campaignAutomationKPIs.automationConversionRate,
    activeAutomations: campaignAutomationKPIs.activeAutomations,
    draftAutomations: campaignAutomationKPIs.draftAutomations,
    messagesSentThisWeek: campaignAutomationKPIs.messagesSentThisWeek,
    optimalMessagesPerWeek: campaignAutomationKPIs.optimalMessagesPerWeek,
    automatedCampaignsRevenue: campaignAutomationKPIs.automatedCampaignsRevenue,
    totalAutomatedCampaigns: campaignAutomationKPIs.totalAutomatedCampaigns,
  },
  byMessageType: [
    {
      messageType: 'recordatorio-sesion',
      messageTypeLabel: 'Recordatorio Sesión',
      messagesSent: 456,
      bookingsGenerated: 198,
      salesGenerated: 12,
      revenue: 1450.50,
      bookingConversionRate: 43.4,
      saleConversionRate: 2.6,
      revenuePerMessage: 3.18,
    },
    {
      messageType: 'bienvenida',
      messageTypeLabel: 'Bienvenida',
      messagesSent: 123,
      bookingsGenerated: 89,
      salesGenerated: 45,
      revenue: 5230.25,
      bookingConversionRate: 72.4,
      saleConversionRate: 36.6,
      revenuePerMessage: 42.52,
    },
    {
      messageType: 'seguimiento',
      messageTypeLabel: 'Seguimiento',
      messagesSent: 234,
      bookingsGenerated: 45,
      salesGenerated: 23,
      revenue: 3120.00,
      bookingConversionRate: 19.2,
      saleConversionRate: 9.8,
      revenuePerMessage: 13.33,
    },
    {
      messageType: 'programado',
      messageTypeLabel: 'Programado',
      messagesSent: 189,
      bookingsGenerated: 10,
      salesGenerated: 9,
      revenue: 2650.00,
      bookingConversionRate: 5.3,
      saleConversionRate: 4.8,
      revenuePerMessage: 14.02,
    },
  ],
  byChannel: [
    {
      channel: 'whatsapp',
      messagesSent: 678,
      bookingsGenerated: 234,
      salesGenerated: 67,
      revenue: 8234.50,
      bookingConversionRate: 34.5,
      saleConversionRate: 9.9,
      revenuePerMessage: 12.14,
    },
    {
      channel: 'email',
      messagesSent: 456,
      bookingsGenerated: 89,
      salesGenerated: 18,
      revenue: 3456.25,
      bookingConversionRate: 19.5,
      saleConversionRate: 3.9,
      revenuePerMessage: 7.58,
    },
    {
      channel: 'sms',
      messagesSent: 113,
      bookingsGenerated: 19,
      salesGenerated: 4,
      revenue: 760.00,
      bookingConversionRate: 16.8,
      saleConversionRate: 3.5,
      revenuePerMessage: 6.73,
    },
  ],
  topPerformingMessages: [
    {
      messageId: 'msg-001',
      messageType: 'bienvenida',
      messageTypeLabel: 'Bienvenida',
      channel: 'whatsapp',
      clientName: 'María García',
      sentAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      bookingsGenerated: 3,
      salesGenerated: 2,
      revenue: 450.00,
      conversionScore: 95.5,
    },
    {
      messageId: 'msg-002',
      messageType: 'recordatorio-sesion',
      messageTypeLabel: 'Recordatorio Sesión',
      channel: 'whatsapp',
      clientName: 'Juan Pérez',
      sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      bookingsGenerated: 2,
      salesGenerated: 1,
      revenue: 320.00,
      conversionScore: 88.2,
    },
  ],
  campaignImpact: [
    {
      campaignId: 'camp-001',
      campaignName: 'Campaña Bienvenida Nuevos Clientes',
      campaignType: 'welcome-sequence',
      totalMessagesSent: 123,
      bookingsGenerated: 89,
      salesGenerated: 45,
      totalRevenue: 5230.25,
      bookingConversionRate: 72.4,
      saleConversionRate: 36.6,
      revenuePerMessage: 42.52,
      roi: 312.5,
      topPerformingMessages: [
        {
          messageId: 'msg-001',
          messageType: 'bienvenida',
          bookings: 3,
          sales: 2,
          revenue: 450.00,
        },
      ],
    },
  ],
  actionableInsights: [
    {
      insight: 'Los mensajes de bienvenida generan 5.3x más ingresos por mensaje que los recordatorios',
      impact: 'high',
      action: 'Optimizar secuencia de bienvenida y replicar estrategia en otros tipos de mensajes',
      estimatedImpact: 'Aumento estimado del 25% en ingresos por mensaje',
    },
    {
      insight: 'WhatsApp tiene una tasa de conversión a reservas 1.8x mayor que email',
      impact: 'high',
      action: 'Priorizar WhatsApp para mensajes que requieren acción inmediata',
      estimatedImpact: 'Aumento estimado del 15% en reservas generadas',
    },
    {
      insight: 'Los mensajes enviados los martes y miércoles tienen 30% más conversión',
      impact: 'medium',
      action: 'Programar mensajes importantes en estos días',
      estimatedImpact: 'Mejora estimada del 10% en tasa de conversión',
    },
  ],
  trends: {
    bookingConversionTrend: 'up',
    saleConversionTrend: 'up',
    revenueTrend: 'up',
    changePercentage: {
      bookings: 12.5,
      sales: 8.3,
      revenue: 15.7,
    },
  },
  lastUpdated: new Date().toISOString(),
};

// Mock data para Experiments Dashboard
const experimentsDashboardData: ExperimentsDashboard = {
  experiments: [
    {
      id: 'exp-1',
      name: 'Experimento CTA Bienvenida',
      description: 'Comparación de CTA entre versión IA y humana en emails de bienvenida',
      objective: 'Mejorar tasa de conversión de emails de bienvenida',
      campaignId: 'cmp-1',
      campaignName: 'Campaña Bienvenida',
      channel: 'email',
      versions: [
        {
          id: 'v-ai-1',
          type: 'ai',
          name: 'Versión IA - Motivacional',
          content: {
            subject: '¡Bienvenido a tu transformación! 🚀',
            message: 'Hola {nombre}, estamos emocionados de tenerte aquí. Tu viaje hacia una mejor versión de ti mismo comienza ahora. ¿Listo para tu primera sesión?',
            cta: 'Reserva tu primera sesión gratis',
            tone: 'motivacional',
          },
          channel: 'email',
          metadata: {
            aiModel: 'GPT-4',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          },
        },
        {
          id: 'v-human-1',
          type: 'human',
          name: 'Versión Humana - Directa',
          content: {
            subject: 'Bienvenido - Reserva tu primera sesión',
            message: 'Hola {nombre}, gracias por unirte. Agenda tu primera sesión cuando estés listo.',
            cta: 'Agendar sesión',
            tone: 'directo',
          },
          channel: 'email',
          metadata: {
            humanEditor: 'María García',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          },
        },
      ],
      metrics: [
        {
          versionId: 'v-ai-1',
          versionType: 'ai',
          sent: 150,
          delivered: 148,
          opened: 120,
          clicked: 89,
          replied: 45,
          converted: 67,
          openRate: 81.1,
          clickRate: 60.1,
          replyRate: 30.4,
          conversionRate: 45.3,
          revenue: 6700,
          engagementScore: 87.5,
        },
        {
          versionId: 'v-human-1',
          versionType: 'human',
          sent: 150,
          delivered: 149,
          opened: 105,
          clicked: 65,
          replied: 32,
          converted: 48,
          openRate: 70.5,
          clickRate: 43.6,
          replyRate: 21.5,
          conversionRate: 32.2,
          revenue: 4800,
          engagementScore: 72.3,
        },
      ],
      status: 'completed',
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      targetAudience: {
        type: 'segment',
        segmentId: 'seg-1',
        segmentName: 'Nuevos clientes',
        clientCount: 300,
      },
      trafficSplit: {
        ai: 50,
        human: 50,
      },
      winner: {
        versionId: 'v-ai-1',
        versionType: 'ai',
        reason: 'La versión IA logró un 45.3% de conversión vs 32.2% de la versión humana, con mayor engagement (87.5 vs 72.3)',
        confidence: 92,
      },
      insights: [
        'El tono motivacional funciona mejor para nuevos clientes',
        'CTAs más descriptivos generan más conversiones',
        'El uso de emojis aumenta el engagement sin afectar la profesionalidad',
      ],
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: 'user-1',
    },
    {
      id: 'exp-2',
      name: 'Experimento Delay Recordatorios',
      description: 'Comparación de delays en recordatorios de sesión entre IA y humana',
      objective: 'Optimizar timing de recordatorios para aumentar asistencia',
      channel: 'whatsapp',
      versions: [
        {
          id: 'v-ai-2',
          type: 'ai',
          name: 'Versión IA - Delay Inteligente',
          content: {
            message: 'Hola {nombre}, recordatorio: tu sesión es mañana a las {hora}. ¿Todo listo? Si necesitas cambiar, avísame.',
            cta: 'Confirmar asistencia',
            tone: 'amigable',
          },
          channel: 'whatsapp',
          metadata: {
            aiModel: 'GPT-4',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          },
        },
        {
          id: 'v-human-2',
          type: 'human',
          name: 'Versión Humana - Delay Estándar',
          content: {
            message: 'Recordatorio: sesión mañana a las {hora}.',
            cta: 'Confirmar',
            tone: 'formal',
          },
          channel: 'whatsapp',
          metadata: {
            humanEditor: 'Juan Pérez',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          },
        },
      ],
      metrics: [
        {
          versionId: 'v-ai-2',
          versionType: 'ai',
          sent: 200,
          delivered: 198,
          opened: 185,
          replied: 156,
          converted: 178,
          openRate: 93.4,
          replyRate: 78.8,
          conversionRate: 89.9,
          revenue: 8900,
          engagementScore: 91.2,
        },
        {
          versionId: 'v-human-2',
          versionType: 'human',
          sent: 200,
          delivered: 199,
          opened: 165,
          replied: 120,
          converted: 145,
          openRate: 82.9,
          replyRate: 60.3,
          conversionRate: 72.9,
          revenue: 7250,
          engagementScore: 78.5,
        },
      ],
      status: 'running',
      startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      targetAudience: {
        type: 'all',
        clientCount: 400,
      },
      trafficSplit: {
        ai: 50,
        human: 50,
      },
      insights: [
        'Los mensajes más personales generan mayor respuesta',
        'Preguntar "¿Todo listo?" aumenta el engagement',
      ],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'user-1',
    },
  ],
  totalExperiments: 2,
  activeExperiments: 1,
  completedExperiments: 1,
  summary: {
    totalExperiments: 2,
    aiWins: 1,
    humanWins: 0,
    tie: 1,
    averageImprovement: 13.1,
  },
  topPerformers: {
    experiments: [],
  },
  recentExperiments: [
    {
      id: 'exp-2',
      name: 'Experimento Delay Recordatorios',
      description: 'Comparación de delays en recordatorios de sesión entre IA y humana',
      objective: 'Optimizar timing de recordatorios para aumentar asistencia',
      channel: 'whatsapp',
      versions: [
        {
          id: 'v-ai-2',
          type: 'ai',
          name: 'Versión IA - Delay Inteligente',
          content: {
            message: 'Hola {nombre}, recordatorio: tu sesión es mañana a las {hora}. ¿Todo listo? Si necesitas cambiar, avísame.',
            cta: 'Confirmar asistencia',
            tone: 'amigable',
          },
          channel: 'whatsapp',
          metadata: {
            aiModel: 'GPT-4',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          },
        },
        {
          id: 'v-human-2',
          type: 'human',
          name: 'Versión Humana - Delay Estándar',
          content: {
            message: 'Recordatorio: sesión mañana a las {hora}.',
            cta: 'Confirmar',
            tone: 'formal',
          },
          channel: 'whatsapp',
          metadata: {
            humanEditor: 'Juan Pérez',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          },
        },
      ],
      metrics: [
        {
          versionId: 'v-ai-2',
          versionType: 'ai',
          sent: 200,
          delivered: 198,
          opened: 185,
          replied: 156,
          converted: 178,
          openRate: 93.4,
          replyRate: 78.8,
          conversionRate: 89.9,
          revenue: 8900,
          engagementScore: 91.2,
        },
        {
          versionId: 'v-human-2',
          versionType: 'human',
          sent: 200,
          delivered: 199,
          opened: 165,
          replied: 120,
          converted: 145,
          openRate: 82.9,
          replyRate: 60.3,
          conversionRate: 72.9,
          revenue: 7250,
          engagementScore: 78.5,
        },
      ],
      status: 'running',
      startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      targetAudience: {
        type: 'all',
        clientCount: 400,
      },
      trafficSplit: {
        ai: 50,
        human: 50,
      },
      insights: [
        'Los mensajes más personales generan mayor respuesta',
        'Preguntar "¿Todo listo?" aumenta el engagement',
      ],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'user-1',
    },
    {
      id: 'exp-1',
      name: 'Experimento CTA Bienvenida',
      description: 'Comparación de CTA entre versión IA y humana en emails de bienvenida',
      objective: 'Mejorar tasa de conversión de emails de bienvenida',
      campaignId: 'cmp-1',
      campaignName: 'Campaña Bienvenida',
      channel: 'email',
      versions: [
        {
          id: 'v-ai-1',
          type: 'ai',
          name: 'Versión IA - Motivacional',
          content: {
            subject: '¡Bienvenido a tu transformación! 🚀',
            message: 'Hola {nombre}, estamos emocionados de tenerte aquí. Tu viaje hacia una mejor versión de ti mismo comienza ahora. ¿Listo para tu primera sesión?',
            cta: 'Reserva tu primera sesión gratis',
            tone: 'motivacional',
          },
          channel: 'email',
          metadata: {
            aiModel: 'GPT-4',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          },
        },
        {
          id: 'v-human-1',
          type: 'human',
          name: 'Versión Humana - Directa',
          content: {
            subject: 'Bienvenido - Reserva tu primera sesión',
            message: 'Hola {nombre}, gracias por unirte. Agenda tu primera sesión cuando estés listo.',
            cta: 'Agendar sesión',
            tone: 'directo',
          },
          channel: 'email',
          metadata: {
            humanEditor: 'María García',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          },
        },
      ],
      metrics: [
        {
          versionId: 'v-ai-1',
          versionType: 'ai',
          sent: 150,
          delivered: 148,
          opened: 120,
          clicked: 89,
          replied: 45,
          converted: 67,
          openRate: 81.1,
          clickRate: 60.1,
          replyRate: 30.4,
          conversionRate: 45.3,
          revenue: 6700,
          engagementScore: 87.5,
        },
        {
          versionId: 'v-human-1',
          versionType: 'human',
          sent: 150,
          delivered: 149,
          opened: 105,
          clicked: 65,
          replied: 32,
          converted: 48,
          openRate: 70.5,
          clickRate: 43.6,
          replyRate: 21.5,
          conversionRate: 32.2,
          revenue: 4800,
          engagementScore: 72.3,
        },
      ],
      status: 'completed',
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      targetAudience: {
        type: 'segment',
        segmentId: 'seg-1',
        segmentName: 'Nuevos clientes',
        clientCount: 300,
      },
      trafficSplit: {
        ai: 50,
        human: 50,
      },
      winner: {
        versionId: 'v-ai-1',
        versionType: 'ai',
        reason: 'La versión IA logró un 45.3% de conversión vs 32.2% de la versión humana, con mayor engagement (87.5 vs 72.3)',
        confidence: 92,
      },
      insights: [
        'El tono motivacional funciona mejor para nuevos clientes',
        'CTAs más descriptivos generan más conversiones',
        'El uso de emojis aumenta el engagement sin afectar la profesionalidad',
      ],
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: 'user-1',
    },
  ],
  insights: [
    'Las versiones IA tienden a generar mayor engagement en mensajes motivacionales',
    'Los CTAs más descriptivos y personalizados aumentan las conversiones',
    'El timing inteligente mejora significativamente las tasas de respuesta',
  ],
  lastUpdated: new Date().toISOString(),
};

// Mock data para Weekly AI Insights
const weeklyAIInsightsData: WeeklyAIInsightsDashboard = {
  currentWeek: {
    id: 'insight-week-1',
    weekStartDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    weekEndDate: new Date().toISOString().split('T')[0],
    generatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    summary: 'Esta semana se observó un aumento del 15% en la tasa de apertura de emails, pero una disminución del 8% en la tasa de respuesta de WhatsApp. Se recomienda ajustar el timing y personalización de mensajes.',
    improvements: [
      {
        id: 'imp-1',
        type: 'cta',
        typeLabel: 'CTA',
        title: 'Mejorar CTA en emails de bienvenida',
        description: 'El CTA actual "Agendar sesión" tiene menor conversión que alternativas más descriptivas. Se sugiere cambiar a "Reserva tu primera sesión gratis" para aumentar conversiones.',
        currentState: {
          value: 'Agendar sesión',
          label: 'CTA actual',
        },
        suggestedState: {
          value: 'Reserva tu primera sesión gratis',
          label: 'CTA sugerido',
        },
        rationale: 'Los CTAs más descriptivos y que incluyen beneficios concretos tienen un 45% más de conversión según experimentos anteriores.',
        expectedImpact: {
          metric: 'conversion rate',
          currentValue: 32.2,
          expectedValue: 46.7,
          improvementPercentage: 45.0,
          impact: 'high',
        },
        affectedAutomations: [
          {
            automationId: 'auto-1',
            automationName: 'Secuencia de Bienvenida',
            automationType: 'welcome-sequence',
          },
        ],
        affectedCampaigns: [
          {
            campaignId: 'cmp-1',
            campaignName: 'Campaña Bienvenida',
          },
        ],
        priority: 'high',
        effort: 'low',
        status: 'pending',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'imp-2',
        type: 'delay',
        typeLabel: 'Delay',
        title: 'Ajustar delay en recordatorios de sesión',
        description: 'Los recordatorios enviados 24 horas antes tienen menor respuesta que aquellos enviados 48 horas antes. Se recomienda cambiar el delay de 24h a 48h.',
        currentState: {
          value: 24,
          label: 'Delay actual (horas)',
        },
        suggestedState: {
          value: 48,
          label: 'Delay sugerido (horas)',
        },
        rationale: 'Los recordatorios con 48 horas de anticipación permiten a los clientes reorganizar mejor su agenda, aumentando la tasa de confirmación en un 23%.',
        expectedImpact: {
          metric: 'reply rate',
          currentValue: 60.3,
          expectedValue: 74.2,
          improvementPercentage: 23.0,
          impact: 'medium',
        },
        affectedAutomations: [
          {
            automationId: 'auto-2',
            automationName: 'Recordatorios de Sesión',
            automationType: 'session-reminder',
          },
        ],
        affectedCampaigns: [],
        priority: 'medium',
        effort: 'low',
        status: 'pending',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'imp-3',
        type: 'tone',
        typeLabel: 'Tono',
        title: 'Ajustar tono en mensajes de seguimiento',
        description: 'Los mensajes con tono más personal y cercano tienen mayor engagement. Se sugiere cambiar de tono formal a amigable en mensajes de seguimiento.',
        currentState: {
          value: 'formal',
          label: 'Tono actual',
        },
        suggestedState: {
          value: 'amigable',
          label: 'Tono sugerido',
        },
        rationale: 'El análisis de mensajes muestra que los mensajes con tono amigable tienen un 18% más de respuesta y generan mayor confianza con los clientes.',
        expectedImpact: {
          metric: 'reply rate',
          currentValue: 45.2,
          expectedValue: 53.3,
          improvementPercentage: 18.0,
          impact: 'medium',
        },
        affectedAutomations: [
          {
            automationId: 'auto-3',
            automationName: 'Seguimiento Post-Sesión',
            automationType: 'welcome-sequence',
          },
        ],
        affectedCampaigns: [],
        priority: 'medium',
        effort: 'medium',
        status: 'applied',
        appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        appliedBy: 'user-1',
        testResults: {
          testedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          improvementAchieved: 16.5,
          actualImpact: 'Aumento del 16.5% en tasa de respuesta después de aplicar el cambio de tono.',
        },
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    metrics: {
      totalMessagesSent: 1247,
      averageOpenRate: 78.5,
      averageReplyRate: 62.3,
      averageConversionRate: 38.7,
      totalRevenue: 12450.75,
      trends: {
        openRate: 'up',
        replyRate: 'down',
        conversionRate: 'up',
        changePercentage: {
          openRate: 15.2,
          replyRate: -8.3,
          conversionRate: 12.5,
        },
      },
    },
    topPerformers: {
      automations: [
        {
          automationId: 'auto-1',
          automationName: 'Secuencia de Bienvenida',
          performance: 92.5,
        },
        {
          automationId: 'auto-2',
          automationName: 'Recordatorios de Sesión',
          performance: 87.3,
        },
      ],
      campaigns: [
        {
          campaignId: 'cmp-1',
          campaignName: 'Campaña Bienvenida',
          performance: 89.1,
        },
      ],
      messages: [
        {
          messageId: 'msg-1',
          messageType: 'bienvenida',
          performance: 95.2,
        },
      ],
    },
    opportunities: [
      {
        title: 'Optimizar timing de mensajes de WhatsApp',
        description: 'Los mensajes enviados en horarios laborales tienen menor engagement. Considerar enviar en horarios de descanso.',
        impact: 'high',
        effort: 'low',
        estimatedImprovement: 25.0,
      },
    ],
    aiRecommendations: [
      'Priorizar la implementación de mejoras en CTAs para aumentar conversiones',
      'Ajustar delays en recordatorios para mejorar la tasa de confirmación',
      'Considerar personalización más profunda en mensajes según historial del cliente',
    ],
    status: 'reviewed',
  },
  previousWeeks: [],
  totalImprovements: 3,
  appliedImprovements: 1,
  pendingImprovements: 2,
  averageImprovement: 28.7,
  summary: {
    totalInsights: 1,
    totalImprovements: 3,
    improvementsApplied: 1,
    improvementsDismissed: 0,
    averageImpact: 28.7,
  },
  byType: {
    cta: {
      total: 1,
      applied: 0,
      averageImpact: 45.0,
    },
    delay: {
      total: 1,
      applied: 0,
      averageImpact: 23.0,
    },
    tone: {
      total: 1,
      applied: 1,
      averageImpact: 18.0,
    },
  },
  insights: [
    'Las mejoras en CTAs tienen el mayor impacto en conversiones',
    'Ajustar delays puede mejorar significativamente la tasa de respuesta',
    'El tono personalizado aumenta el engagement con los clientes',
  ],
  lastUpdated: new Date().toISOString(),
  lastGenerated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
};

// US-CA-22: Detección de gaps en journeys
export async function fetchJourneyGapDetectorDashboard(): Promise<JourneyGapDetectorDashboard> {
  // Simulamos datos mock - en producción, esto vendría de la API
  return {
    gaps: [
      {
        id: 'gap-1',
        sequenceId: 'seq-1',
        sequenceName: 'Secuencia de Activación',
        sequenceGoal: 'activation',
        gapType: 'post-purchase',
        gapTypeLabel: 'Post-compra',
        severity: 'critical',
        description: 'Falta mensaje post-compra en la secuencia de activación. Los clientes que realizan su primera compra no reciben seguimiento inmediato.',
        detectedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        expectedStep: {
          stepNumber: 4,
          name: 'Confirmación de compra y próximos pasos',
          description: 'Mensaje de confirmación de compra con información sobre próximos pasos y cómo empezar',
          suggestedDelay: {
            value: 1,
            unit: 'hours',
          },
          suggestedChannel: 'email',
          suggestedMessageTemplate: '¡Gracias por tu compra! Hemos recibido tu pedido y estamos preparando todo para ti. En las próximas horas recibirás más información sobre cómo empezar.',
          suggestedTiming: '09:00',
        },
        suggestedContent: {
          subject: '¡Gracias por tu compra! 🎉',
          message: '¡Hola {nombre}!\n\nGracias por confiar en nosotros para tu entrenamiento. Hemos recibido tu pedido y estamos preparando todo para ti.\n\n📦 Tu pedido está en proceso y recibirás más información en las próximas horas.\n\n🎯 Próximos pasos:\n1. Revisa tu email para más detalles\n2. Agenda tu primera sesión\n3. Descarga la app para empezar\n\nSi tienes alguna pregunta, no dudes en contactarnos.\n\n¡Estamos aquí para ayudarte a alcanzar tus objetivos! 💪',
          cta: 'Ver detalles del pedido',
          variables: ['{nombre}', '{fechaCompra}', '{numeroPedido}'],
          tone: 'friendly',
        },
        aiConfidence: 92,
        impact: {
          affectedContacts: 45,
          estimatedConversionImprovement: 18.5,
          estimatedRevenueImpact: 5400,
        },
        autoFillEnabled: true,
        status: 'pending',
      },
      {
        id: 'gap-2',
        sequenceId: 'seq-2',
        sequenceName: 'Secuencia de Retención',
        sequenceGoal: 'retention',
        gapType: 'follow-up',
        gapTypeLabel: 'Seguimiento',
        severity: 'high',
        description: 'Falta seguimiento después de 7 días de inactividad en la secuencia de retención.',
        detectedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        expectedStep: {
          stepNumber: 3,
          name: 'Check-in después de 7 días',
          description: 'Mensaje de check-in para clientes que llevan 7 días sin actividad',
          suggestedDelay: {
            value: 7,
            unit: 'days',
          },
          suggestedChannel: 'whatsapp',
          suggestedMessageTemplate: '¡Hola {nombre}! 👋 Hace una semana que no te vemos. ¿Todo está bien? Estamos aquí para ayudarte a retomar tu rutina. ¿Te gustaría agendar una sesión?',
          suggestedTiming: '10:00',
        },
        suggestedContent: {
          message: '¡Hola {nombre}! 👋\n\nHace una semana que no te vemos por aquí. ¿Todo está bien?\n\nSabemos que mantener una rutina puede ser desafiante, pero estamos aquí para ayudarte a retomar tu entrenamiento.\n\n💪 Si te gustaría agendar una sesión, puedes hacerlo respondiendo a este mensaje o usando este enlace: {linkAgendar}\n\nSi hay algo en lo que podamos ayudarte, no dudes en contactarnos. ¡Estamos aquí para apoyarte!',
          variables: ['{nombre}', '{diasInactivo}', '{linkAgendar}'],
          tone: 'friendly',
        },
        aiConfidence: 85,
        impact: {
          affectedContacts: 28,
          estimatedConversionImprovement: 12.3,
          estimatedRevenueImpact: 3200,
        },
        autoFillEnabled: true,
        status: 'pending',
      },
    ],
    totalGaps: 2,
    bySeverity: {
      critical: 1,
      high: 1,
      medium: 0,
      low: 0,
    },
    byType: {
      'post-purchase': 1,
      'follow-up': 1,
    },
    bySequence: [
      {
        sequenceId: 'seq-1',
        sequenceName: 'Secuencia de Activación',
        gapCount: 1,
      },
      {
        sequenceId: 'seq-2',
        sequenceName: 'Secuencia de Retención',
        gapCount: 1,
      },
    ],
    totalAffectedContacts: 73,
    estimatedConversionImprovement: 15.4,
    estimatedRevenueImpact: 8600,
    lastAnalysisDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    autoFillEnabled: true,
  };
}

// US-CA-23: Recomendaciones para nuevos canales
export async function fetchChannelRecommendationsDashboard(): Promise<ChannelRecommendationsDashboard> {
  // Simulamos datos mock - en producción, esto vendría de la API
  return {
    recommendations: [
      {
        id: 'rec-1',
        recommendedChannel: 'sms',
        recommendedChannelLabel: 'SMS',
        reason: 'saturation',
        reasonLabel: 'Saturación',
        priority: 'high',
        description: 'Tu canal de WhatsApp está saturado con un 85% de saturación. SMS puede ayudarte a alcanzar clientes que no responden a WhatsApp y expandir tu alcance.',
        currentState: {
          currentChannels: ['email', 'whatsapp'],
          saturationLevel: 85,
          engagementRate: 45,
          reach: 1200,
        },
        expectedImpact: {
          reachImprovement: 25,
          engagementImprovement: 18,
          conversionImprovement: 12,
          costReduction: 15,
          estimatedRevenueImpact: 8400,
        },
        implementationPlan: {
          steps: [
            {
              stepNumber: 1,
              title: 'Configurar integración SMS',
              description: 'Configurar la integración con un proveedor de SMS (Twilio, MessageBird, etc.)',
              estimatedTime: '30 minutos',
              requiredResources: ['Cuenta de proveedor SMS', 'API key'],
            },
            {
              stepNumber: 2,
              title: 'Crear plantillas de mensajes SMS',
              description: 'Crear plantillas de mensajes SMS para diferentes tipos de comunicación',
              estimatedTime: '1 hora',
              requiredResources: ['Contenido de mensajes'],
            },
            {
              stepNumber: 3,
              title: 'Configurar automatizaciones SMS',
              description: 'Configurar automatizaciones para enviar SMS cuando sea apropiado',
              estimatedTime: '2 horas',
              requiredResources: ['Reglas de automatización'],
            },
            {
              stepNumber: 4,
              title: 'Probar y validar',
              description: 'Probar el envío de SMS y validar que todo funcione correctamente',
              estimatedTime: '30 minutos',
              requiredResources: ['Números de teléfono de prueba'],
            },
          ],
          totalEstimatedTime: '4 horas',
          difficulty: 'medium',
          requiredIntegration: 'Twilio SMS API',
          cost: 50,
        },
        useCases: [
          {
            title: 'Recordatorios de sesión',
            description: 'Enviar recordatorios de sesión por SMS a clientes que no responden a WhatsApp',
            exampleMessage: 'Hola {nombre}, tienes una sesión mañana a las {hora}. Confirma tu asistencia respondiendo SI o NO.',
            expectedResult: 'Aumento del 20% en confirmaciones de sesión',
          },
          {
            title: 'Seguimiento post-compra',
            description: 'Enviar seguimiento post-compra por SMS para clientes que no abren emails',
            exampleMessage: '¡Hola {nombre}! Gracias por tu compra. Tu pedido está en proceso. Recibirás más información pronto.',
            expectedResult: 'Mejora del 15% en satisfacción del cliente',
          },
        ],
        aiConfidence: 88,
        status: 'pending',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'rec-2',
        recommendedChannel: 'bot',
        recommendedChannelLabel: 'Chatbot',
        reason: 'high-potential',
        reasonLabel: 'Alto potencial',
        priority: 'medium',
        description: 'Un chatbot puede ayudarte a responder preguntas frecuentes 24/7 y capturar leads cuando no estás disponible, mejorando significativamente tu engagement.',
        currentState: {
          currentChannels: ['email', 'whatsapp'],
          saturationLevel: 60,
          engagementRate: 52,
          reach: 1200,
        },
        expectedImpact: {
          reachImprovement: 35,
          engagementImprovement: 25,
          conversionImprovement: 18,
          estimatedRevenueImpact: 12000,
        },
        implementationPlan: {
          steps: [
            {
              stepNumber: 1,
              title: 'Diseñar flujos de conversación',
              description: 'Diseñar flujos de conversación para el chatbot basados en preguntas frecuentes',
              estimatedTime: '4 horas',
              requiredResources: ['Lista de preguntas frecuentes', 'Respuestas'],
            },
            {
              stepNumber: 2,
              title: 'Configurar plataforma de chatbot',
              description: 'Configurar la plataforma de chatbot (Dialogflow, ManyChat, etc.)',
              estimatedTime: '2 horas',
              requiredResources: ['Cuenta de plataforma chatbot'],
            },
            {
              stepNumber: 3,
              title: 'Integrar con WhatsApp',
              description: 'Integrar el chatbot con WhatsApp Business API',
              estimatedTime: '3 horas',
              requiredResources: ['WhatsApp Business API', 'API keys'],
            },
            {
              stepNumber: 4,
              title: 'Probar y optimizar',
              description: 'Probar el chatbot y optimizar las respuestas basadas en interacciones reales',
              estimatedTime: '2 horas',
              requiredResources: ['Datos de prueba'],
            },
          ],
          totalEstimatedTime: '11 horas',
          difficulty: 'hard',
          requiredIntegration: 'Dialogflow + WhatsApp Business API',
          cost: 100,
        },
        useCases: [
          {
            title: 'Respuesta automática 24/7',
            description: 'Responder preguntas frecuentes automáticamente cuando no estás disponible',
            exampleMessage: 'Hola! Soy el asistente virtual. ¿En qué puedo ayudarte?',
            expectedResult: 'Reducción del 40% en tiempo de respuesta',
          },
          {
            title: 'Captura de leads',
            description: 'Capturar leads automáticamente cuando alguien pregunta sobre tus servicios',
            exampleMessage: '¡Perfecto! Para darte más información, necesito algunos datos. ¿Cuál es tu nombre?',
            expectedResult: 'Aumento del 30% en captura de leads',
          },
        ],
        aiConfidence: 82,
        status: 'pending',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    totalRecommendations: 2,
    byPriority: {
      high: 1,
      medium: 1,
      low: 0,
    },
    byChannel: {
      sms: 1,
      bot: 1,
    },
    byReason: {
      saturation: 1,
      'high-potential': 1,
    },
    activeRecommendations: 0,
    completedRecommendations: 0,
    totalEstimatedImpact: {
      reachImprovement: 30,
      engagementImprovement: 21.5,
      conversionImprovement: 15,
      revenueImpact: 20400,
    },
    lastAnalysisDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    insights: [
      'SMS puede ayudarte a alcanzar clientes que no responden a WhatsApp',
      'Un chatbot puede mejorar significativamente tu engagement y captura de leads',
      'La saturación de WhatsApp está afectando tu capacidad de alcance',
    ],
  };
}

export async function fetchMissionControlSnapshot(): Promise<MissionControlSnapshot> {
  const [
    summary,
    campaigns,
    emails,
    sequences,
    automations,
    health,
    roadmapItems,
    reminderTemplates,
    clientSettings,
    reminders,
    welcomeSeqs,
    absenceAutos,
    messageTemplates,
    scheduledMsgs,
    inactivityAutos,
    importantDateAutos,
    paymentReminderAutos,
    messageStats,
    clientSegs,
    bulkMsgs,
    newslettersData,
    newsletterTemps,
    afterHoursReplies,
    promotionalCamps,
    reservationsIntegration,
    centralAutomationsPanel,
    messageAlertsDashboard,
    preferredSendingSchedulesDashboard,
    multiStepSeqs,
    exportReps,
    clientActionTriggers,
    aiReminderAutomation,
    weeklyHighlightsNewsletterGenerator,
    quickWhatsAppPromptsLibrary,
    journeyGapDetectorDashboard,
    channelRecommendationsDashboard,
  ] = await Promise.all([
    fetchMissionControlSummary(),
    fetchMultiChannelCampaigns(),
    fetchEmailPrograms(),
    fetchLifecycleSequences(),
    fetchMessagingAutomations(),
    fetchChannelHealthMetrics(),
    fetchAutomationRoadmap(),
    fetchSessionReminderTemplates(),
    fetchClientReminderSettings(),
    fetchUpcomingReminders(),
    fetchWelcomeSequences(),
    fetchAbsenceAutomations(),
    fetchMessageTemplates(),
    fetchScheduledMessages(),
    fetchInactivityAutomations(),
    fetchImportantDateAutomations(),
    fetchPaymentReminderAutomations(),
    fetchMessageStatisticsDashboard(),
    fetchClientSegments(),
    fetchBulkMessages(),
    fetchNewsletters(),
    fetchNewsletterTemplates(),
    fetchAfterHoursAutoReplies(),
    fetchPromotionalCampaigns(),
    fetchReservationsIntegration(),
    fetchCentralAutomationsPanel(),
    fetchMessageAlertsDashboard(),
    fetchPreferredSendingSchedulesDashboard(),
    fetchMultiStepSequences(),
    fetchExportReports(),
    fetchClientActionTriggers(),
    fetchAIReminderAutomation(),
    fetchWeeklyHighlightsNewsletterGenerator(),
    fetchQuickWhatsAppPromptsLibrary(),
    fetchJourneyGapDetectorDashboard(),
    fetchChannelRecommendationsDashboard(),
  ]);

  return {
    summary,
    campaigns,
    emailPrograms: emails,
    lifecycleSequences: sequences,
    messagingAutomations: automations,
    channelHealth: health,
    roadmap: roadmapItems,
    sessionReminderTemplates: reminderTemplates,
    clientReminderSettings: clientSettings,
    upcomingReminders: reminders,
    welcomeSequences: welcomeSeqs,
    absenceAutomations: absenceAutos,
    messageTemplates,
    scheduledMessages: scheduledMsgs,
    inactivityAutomations: inactivityAutos,
    importantDateAutomations: importantDateAutos,
    paymentReminderAutomations: paymentReminderAutos,
    messageStatisticsDashboard: messageStats,
    clientSegments: clientSegs,
    bulkMessages: bulkMsgs,
    newsletters: newslettersData,
    newsletterTemplates: newsletterTemps,
    afterHoursAutoReplies: afterHoursReplies,
    promotionalCampaigns: promotionalCamps,
    reservationsIntegration,
    centralAutomationsPanel,
    messageAlertsDashboard,
    preferredSendingSchedulesDashboard,
    multiStepSequences: multiStepSeqs,
    exportReports: exportReps,
    clientActionTriggers,
    aiReminderAutomation,
    weeklyHighlightsNewsletterGenerator,
    quickWhatsAppPromptsLibrary,
    aiHeatMapSendingSchedules: aiHeatMapSendingSchedulesData,
    actionableKPIs: actionableKPIsData,
    experimentsDashboard: experimentsDashboardData,
    weeklyAIInsights: weeklyAIInsightsData,
    journeyGapDetectorDashboard,
    channelRecommendationsDashboard,
  };
}









