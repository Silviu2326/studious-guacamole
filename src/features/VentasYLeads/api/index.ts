import type {
  LeadOpportunity,
  LeadSegment,
  LeadWorkloadInsight,
  PipelineStage,
  SalesMetric,
} from './types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const salesMetricsMock: SalesMetric[] = [
  {
    id: 'new-leads-today',
    title: 'Leads nuevos (hoy)',
    value: 18,
    subtitle: 'Últimos 7 días: 132',
    trend: {
      direction: 'up',
      value: 9.8,
      label: 'vs. semana pasada',
    },
  },
  {
    id: 'appointments',
    title: 'Citas agendadas',
    value: 27,
    subtitle: 'Próximas 48h',
    trend: {
      direction: 'neutral',
      value: 0.5,
      label: 'SLA 4h desde captura',
    },
  },
  {
    id: 'visits',
    title: 'Visitas realizadas',
    value: 19,
    subtitle: 'Semana en curso',
    trend: {
      direction: 'down',
      value: 3.4,
      label: 'Revisar no show',
    },
  },
  {
    id: 'conversion',
    title: 'Conversión a membresía',
    value: 31,
    subtitle: '% cierre últimos 30 días',
    trend: {
      direction: 'up',
      value: 2.1,
      label: 'Mejor que media',
    },
  },
  {
    id: 'pipeline',
    title: 'Ingresos potenciales',
    value: 142_600,
    subtitle: 'Valor pipeline activo',
    trend: {
      direction: 'up',
      value: 5.3,
      label: 'vs. semana anterior',
    },
  },
];

const pipelineStagesMock: PipelineStage[] = [
  {
    id: 'stage-nuevo',
    label: 'Nuevo',
    status: 'nuevo',
    leads: 64,
    potentialValue: 18_400,
    conversionFromPrevious: 1,
    slaHours: 2,
  },
  {
    id: 'stage-contactado',
    label: 'Contactado',
    status: 'contactado',
    leads: 48,
    potentialValue: 21_700,
    conversionFromPrevious: 0.75,
    slaHours: 8,
  },
  {
    id: 'stage-cita',
    label: 'Cita agendada',
    status: 'cita_agendada',
    leads: 32,
    potentialValue: 27_900,
    conversionFromPrevious: 0.66,
    slaHours: 24,
  },
  {
    id: 'stage-no-show',
    label: 'No presentado',
    status: 'no_presentado',
    leads: 11,
    potentialValue: 8_600,
    conversionFromPrevious: 0.22,
    slaHours: 4,
  },
  {
    id: 'stage-visita',
    label: 'Visitó el centro',
    status: 'visita_realizada',
    leads: 22,
    potentialValue: 24_100,
    conversionFromPrevious: 0.52,
    slaHours: 48,
  },
  {
    id: 'stage-prueba',
    label: 'En prueba',
    status: 'en_prueba',
    leads: 16,
    potentialValue: 18_800,
    conversionFromPrevious: 0.47,
    slaHours: 72,
  },
  {
    id: 'stage-ganado',
    label: 'Cerrado ganado',
    status: 'cerrado_ganado',
    leads: 12,
    potentialValue: 31_700,
    conversionFromPrevious: 0.38,
    slaHours: 0,
  },
];

const leadOpportunitiesMock: LeadOpportunity[] = [
  {
    id: 'LD-1201',
    name: 'Lucía Fernández',
    phone: '+34 600 123 456',
    email: 'lucia.fernandez@example.com',
    source: 'Instagram',
    sede: 'Sede Central',
    owner: 'María Gómez',
    ownerRole: 'comercial',
    status: 'contactado',
    stage: 'calificacion',
    probability: 0.42,
    score: 76,
    potentialValue: 890,
    createdAt: '2025-11-06T08:20:00Z',
    priority: 'alta',
    objective: 'Bajar peso y tonificar',
    tags: ['Alto potencial', 'Programas HIIT'],
    lastContact: {
      date: '2025-11-07T10:30:00Z',
      channel: 'whatsapp',
      summary: 'Respondió al cuestionario inicial',
    },
    nextAction: {
      label: 'Llamada de diagnóstico',
      dueDate: '2025-11-08T17:00:00Z',
      owner: 'María Gómez',
    },
    sequences: [
      { id: 'seq-new-web', label: 'Nuevo lead web', status: 'activa' },
    ],
    timeline: [
      {
        id: 'evt-1',
        type: 'mensaje',
        title: 'WhatsApp enviado',
        description: 'Mensaje de bienvenida con propuesta de plan',
        channel: 'whatsapp',
        createdAt: '2025-11-07T10:30:00Z',
        createdBy: 'María Gómez',
      },
      {
        id: 'evt-2',
        type: 'nota',
        title: 'Interés en entrenamientos HIIT',
        description: 'Mencionó que busca mejorar resistencia en 12 semanas.',
        createdAt: '2025-11-07T11:00:00Z',
        createdBy: 'María Gómez',
      },
    ],
  },
  {
    id: 'LD-1202',
    name: 'Carlos Ortega',
    phone: '+34 611 987 321',
    email: 'carlos.ortega@example.com',
    source: 'Web',
    sede: 'Sede Norte',
    owner: 'Luis Pérez',
    ownerRole: 'entrenador',
    status: 'cita_agendada',
    stage: 'agenda',
    probability: 0.6,
    score: 64,
    potentialValue: 640,
    createdAt: '2025-11-05T14:15:00Z',
    objective: 'Ganar masa muscular',
    tags: ['Objetivo fuerza'],
    lastContact: {
      date: '2025-11-07T09:00:00Z',
      channel: 'llamada',
      summary: 'Confirmó asistencia a cita de valoración',
    },
    nextAction: {
      label: 'Cita presencial valoración',
      dueDate: '2025-11-09T09:30:00Z',
      owner: 'Luis Pérez',
    },
    sequences: [
      { id: 'seq-valoracion', label: 'Pre valoración', status: 'activa' },
    ],
    timeline: [
      {
        id: 'evt-3',
        type: 'cita',
        title: 'Cita agendada',
        description: 'Valoración inicial en sede Norte',
        createdAt: '2025-11-07T09:00:00Z',
        createdBy: 'Luis Pérez',
        metadata: {
          fecha: '2025-11-09',
          hora: '09:30',
        },
      },
      {
        id: 'evt-4',
        type: 'actualizacion',
        title: 'Lead movido a Cita agendada',
        createdAt: '2025-11-07T09:05:00Z',
        createdBy: 'Luis Pérez',
      },
    ],
  },
  {
    id: 'LD-1203',
    name: 'Brenda Castillo',
    phone: '+34 698 002 321',
    email: 'brenda.castillo@example.com',
    source: 'Referido',
    sede: 'Sede Central',
    owner: 'Ana Duarte',
    ownerRole: 'comercial',
    status: 'en_prueba',
    stage: 'seguimiento_prueba',
    probability: 0.72,
    score: 88,
    potentialValue: 1_140,
    createdAt: '2025-10-28T11:45:00Z',
    priority: 'alta',
    objective: 'Preparación para triatlón',
    tags: ['VIP', 'Premium'],
    lastContact: {
      date: '2025-11-06T18:10:00Z',
      channel: 'email',
      summary: 'Envió feedback sobre la clase de prueba',
    },
    nextAction: {
      label: 'Oferta membresía premium',
      dueDate: '2025-11-08T12:00:00Z',
      owner: 'Ana Duarte',
    },
    sequences: [
      { id: 'seq-triathlon', label: 'Seguimiento deportistas', status: 'activa' },
      { id: 'seq-no-show', label: 'No show', status: 'completada' },
    ],
    timeline: [
      {
        id: 'evt-5',
        type: 'nota',
        title: 'Gran potencial para programas premium',
        description: 'Busca plan personalizado para triatlón. Alto presupuesto.',
        createdAt: '2025-11-06T18:15:00Z',
        createdBy: 'Ana Duarte',
      },
      {
        id: 'evt-6',
        type: 'mensaje',
        title: 'Email enviado',
        description: 'Seguimiento con propuesta de plan premium.',
        channel: 'email',
        createdAt: '2025-11-06T18:10:00Z',
        createdBy: 'Ana Duarte',
      },
    ],
  },
  {
    id: 'LD-1204',
    name: 'Julio Morales',
    phone: '+34 622 340 876',
    email: 'julio.morales@example.com',
    source: 'Evento',
    sede: 'Sede Sur',
    owner: 'María Gómez',
    ownerRole: 'comercial',
    status: 'nuevo',
    stage: 'captacion',
    probability: 0.22,
    score: 58,
    potentialValue: 540,
    createdAt: '2025-11-07T19:45:00Z',
    objective: 'Recuperación post lesión',
    tags: ['Fisioterapia'],
    lastContact: {
      date: '2025-11-07T19:50:00Z',
      channel: 'whatsapp',
      summary: 'Descargó lead magnet en evento',
    },
    nextAction: {
      label: 'Enviar cuestionario inicial',
      dueDate: '2025-11-08T11:00:00Z',
      owner: 'María Gómez',
    },
    sequences: [{ id: 'seq-evento', label: 'Secuencia evento 2025', status: 'activa' }],
    timeline: [
      {
        id: 'evt-7',
        type: 'mensaje',
        title: 'WhatsApp automático',
        description: 'Mensaje post evento con CTA para agendar cita.',
        channel: 'whatsapp',
        createdAt: '2025-11-07T19:50:00Z',
        createdBy: 'Automatización',
      },
    ],
  },
  {
    id: 'LD-1205',
    name: 'Marta Lozano',
    phone: '+34 633 215 980',
    email: 'marta.lozano@example.com',
    source: 'Walk-in',
    sede: 'Sede Central',
    owner: 'Luis Pérez',
    ownerRole: 'entrenador',
    status: 'cerrado_ganado',
    stage: 'cierre',
    probability: 1,
    score: 92,
    potentialValue: 1_320,
    createdAt: '2025-10-15T10:05:00Z',
    objective: 'Tonificar y mejorar hábitos',
    tags: ['Alto potencial', 'Clientes felices'],
    lastContact: {
      date: '2025-11-01T08:30:00Z',
      channel: 'presencial',
      summary: 'Firmó contrato anual',
    },
    nextAction: {
      label: 'Programar valoración inicial',
      dueDate: '2025-11-10T08:00:00Z',
      owner: 'Luis Pérez',
    },
    sequences: [
      { id: 'seq-onboarding', label: 'Onboarding clientes premium', status: 'activa' },
    ],
    timeline: [
      {
        id: 'evt-8',
        type: 'actualizacion',
        title: 'Convertido a cliente',
        description: 'Se generó membresía anual Premium',
        createdAt: '2025-11-01T08:30:00Z',
        createdBy: 'Luis Pérez',
      },
      {
        id: 'evt-9',
        type: 'nota',
        title: 'Motivación alta',
        description: 'Quiere mejorar hábitos antes de boda en abril.',
        createdAt: '2025-10-29T19:20:00Z',
        createdBy: 'Luis Pérez',
      },
    ],
  },
  {
    id: 'LD-1206',
    name: 'Sofía Navarro',
    phone: '+34 644 908 112',
    email: 'sofia.navarro@example.com',
    source: 'Landing',
    sede: 'Sede Central',
    owner: 'Ana Duarte',
    ownerRole: 'comercial',
    status: 'no_presentado',
    stage: 'agenda',
    probability: 0.18,
    score: 45,
    potentialValue: 450,
    createdAt: '2025-11-02T12:40:00Z',
    objective: 'Recuperar forma post embarazo',
    tags: ['Reactivación'],
    lastContact: {
      date: '2025-11-06T17:00:00Z',
      channel: 'llamada',
      summary: 'No atendió el recordatorio de cita',
    },
    nextAction: {
      label: 'Reagendar cita',
      dueDate: '2025-11-08T09:00:00Z',
      owner: 'Ana Duarte',
    },
    sequences: [
      { id: 'seq-no-show', label: 'No show 24h', status: 'activa' },
    ],
    timeline: [
      {
        id: 'evt-10',
        type: 'tarea',
        title: 'Reagendar cita',
        description: 'Coordinar nueva fecha dentro de 48h',
        createdAt: '2025-11-06T18:00:00Z',
        createdBy: 'Ana Duarte',
      },
    ],
  },
];

const leadSegmentsMock: LeadSegment[] = [
  {
    id: 'corporate',
    label: 'Empresas & convenios',
    description: 'Organizaciones buscando programas corporativos de bienestar',
    totalLeads: 42,
    conversionRate: 0.38,
    averageValue: 8_200,
    dominantStatus: 'cita_agendada',
    topSource: 'Referido',
    owners: ['María Gómez', 'Ana Duarte'],
  },
  {
    id: 'high-value',
    label: 'Alto potencial',
    description: 'Leads con ticket promedio > 100€/mes',
    totalLeads: 128,
    conversionRate: 0.27,
    averageValue: 1_450,
    dominantStatus: 'contactado',
    topSource: 'Instagram',
    owners: ['Luis Pérez', 'Ana Duarte'],
  },
  {
    id: 'digital',
    label: 'Captados digitalmente',
    description: 'Leads provenientes de campañas digitales',
    totalLeads: 320,
    conversionRate: 0.19,
    averageValue: 640,
    dominantStatus: 'nuevo',
    topSource: 'Landing',
    owners: ['Equipo inbound'],
  },
  {
    id: 'referrals',
    label: 'Referidos',
    description: 'Leads recomendados por clientes activos',
    totalLeads: 86,
    conversionRate: 0.46,
    averageValue: 980,
    dominantStatus: 'en_prueba',
    topSource: 'Referido',
    owners: ['Programa fidelización'],
  },
];

const workloadInsightMock: LeadWorkloadInsight = {
  slaBreached: 12,
  leadsToday: 18,
  appointmentsToday: 9,
  followUpsDue: 24,
};

export async function fetchSalesMetrics(): Promise<SalesMetric[]> {
  await delay(160);
  return salesMetricsMock;
}

export async function fetchPipelineStages(): Promise<PipelineStage[]> {
  await delay(180);
  return pipelineStagesMock;
}

export async function fetchLeadOpportunities(): Promise<LeadOpportunity[]> {
  await delay(220);
  return leadOpportunitiesMock;
}

export async function fetchLeadSegments(): Promise<LeadSegment[]> {
  await delay(200);
  return leadSegmentsMock;
}

export async function fetchLeadWorkloadInsight(): Promise<LeadWorkloadInsight> {
  await delay(150);
  return workloadInsightMock;
}

export type {
  LeadStatus,
  LeadOpportunity,
  LeadSegment,
  LeadWorkloadInsight,
  PipelineStage,
  SalesMetric,
} from './types';
