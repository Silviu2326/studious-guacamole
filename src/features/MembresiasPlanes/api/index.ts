export type PlanStatus = 'activo' | 'oculto' | 'archivado';

export interface PlanPricingOption {
  id: string;
  label: string;
  price: number;
  cycle: 'mensual' | 'trimestral' | 'anual';
  note?: string;
}

export interface PlanAutomation {
  id: string;
  stage: 'alta' | 'pre_vencimiento' | 'baja';
  title: string;
  description: string;
  offset?: string;
}

export interface PlanVisibility {
  web: boolean;
  app: boolean;
  recepcion: boolean;
  corporate: boolean;
}

export interface PlanAccess {
  schedule: string;
  zones: string[];
}

export interface PlanReservationPolicy {
  maxActive: number;
  noShows: number;
  waitlist: boolean;
}

export interface PlanDetail {
  description: string;
  tags: string[];
  pricing: PlanPricingOption[];
  access: PlanAccess;
  reservations: PlanReservationPolicy;
  benefits: string[];
  restrictions: string[];
  visibility: PlanVisibility;
  automations: PlanAutomation[];
}

export interface PlanSummary {
  id: string;
  name: string;
  price: number;
  billingCycle: 'mensual' | 'trimestral' | 'anual';
  type: 'general' | 'premium' | 'corporate' | 'online' | 'juvenil' | 'daypass';
  duration: string;
  activeMembers: number;
  monthlyRevenue: number;
  status: PlanStatus;
  highlight?: boolean;
  featured?: boolean;
  visibilityChannels: ('web' | 'app' | 'recepcion' | 'corporate')[];
  detail: PlanDetail;
}

export interface ActiveMembership {
  id: string;
  memberName: string;
  planName: string;
  startDate: string;
  renewalDate: string;
  status: 'activa' | 'morosidad' | 'en_revision' | 'pausada' | 'proxima_baja';
  value: number;
  paymentMethod: 'tarjeta' | 'domiciliacion' | 'transferencia' | 'efectivo';
  site: string;
  origin: 'online' | 'recepcion' | 'promo' | 'corporate';
  flags: ('riesgo_fuga' | 'moroso' | 'alto_valor')[];
  upgradePotential: 'alto' | 'medio' | 'bajo';
  riskScore: number;
  lastInteraction: string;
}

export interface RenewalInsight {
  id: string;
  memberName: string;
  planName: string;
  nextAction: string;
  renewalDate: string;
  churnRisk: 'alto' | 'medio' | 'bajo';
  reason?: string;
  owner: string;
  playbook: string;
}

export interface RuleItem {
  id: string;
  name: string;
  status: 'activa' | 'en_test' | 'inactiva';
  appliesTo: string;
  summary: string;
  lastUpdated: string;
  impact?: string;
}

export interface RuleCategory {
  id: string;
  title: string;
  description: string;
  rules: RuleItem[];
}

export interface AddOn {
  id: string;
  name: string;
  type: 'recurrente' | 'paquete' | 'unico';
  price: number;
  frequency: 'mensual' | 'puntual' | 'trimestral';
  conditions: string[];
  compatiblePlans: string[];
  status: 'activo' | 'inactivo';
  highlight?: boolean;
}

export interface CorporatePlan {
  id: string;
  name: string;
  description: string;
  minEmployees: number;
  pricePerEmployee: number;
  seatsIncluded: number;
  multiSite: boolean;
  perks: string[];
  activeCompanies: number;
  monthlyRevenue: number;
}

export interface StrategicInsight {
  id: string;
  title: string;
  description: string;
  impact: string;
  cta: string;
  icon: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const planCatalogMock: PlanSummary[] = [
  {
    id: 'PL-001',
    name: 'Premium 24/7 + PT',
    price: 89,
    billingCycle: 'mensual',
    type: 'premium',
    duration: '12 meses',
    activeMembers: 132,
    monthlyRevenue: 11748,
    status: 'activo',
    highlight: true,
    visibilityChannels: ['web', 'app', 'recepcion'],
    detail: {
      description: 'Plan completo con acceso ilimitado, sesiones PT y servicios wellness para clientes top.',
      tags: ['Premium', 'MRR alto', 'Upgrade favorito'],
      pricing: [
        { id: 'monthly', label: 'Mensual', price: 89, cycle: 'mensual', note: 'Sin permanencia' },
        { id: 'quarterly', label: 'Trimestral', price: 249, cycle: 'trimestral', note: '-7% vs mensual' },
        { id: 'annual', label: 'Anual', price: 960, cycle: 'anual', note: '2 meses gratis' },
      ],
      access: {
        schedule: '24/7',
        zones: ['Sala fitness', 'Box funcional', 'Spa & Wellness', 'Clases premium'],
      },
      reservations: {
        maxActive: 5,
        noShows: 2,
        waitlist: true,
      },
      benefits: [
        '2 sesiones PT mensuales',
        'Plan nutricional personalizado',
        '2 invitados al mes',
        'Acceso a app premium',
      ],
      restrictions: ['Edad mínima 18 años', 'No combinable con Plan Corporativo'],
      visibility: {
        web: true,
        app: true,
        recepcion: true,
        corporate: false,
      },
      automations: [
        {
          id: 'auto-1',
          stage: 'alta',
          title: 'Onboarding premium',
          description: 'Email + WhatsApp de bienvenida + asignación de coach inicial.',
        },
        {
          id: 'auto-2',
          stage: 'pre_vencimiento',
          title: 'Recordatorio 15 días antes',
          description: 'Invitar a simulador de progreso y propuesta de upgrade a plan Elite.',
          offset: '15 días',
        },
        {
          id: 'auto-3',
          stage: 'baja',
          title: 'Encuesta + oferta recuperación',
          description: 'Encuesta de salida + 20% descuento si renueva <7 días.',
        },
      ],
    },
  },
  {
    id: 'PL-002',
    name: 'Flexible Mañanas',
    price: 55,
    billingCycle: 'mensual',
    type: 'general',
    duration: 'Sin permanencia',
    activeMembers: 204,
    monthlyRevenue: 11220,
    status: 'activo',
    visibilityChannels: ['web', 'app', 'recepcion'],
    detail: {
      description: 'Acceso ilimitado de lunes a viernes hasta las 14h, ideal para clientes flexibles.',
      tags: ['Top altas', 'Mayor conversión online'],
      pricing: [
        { id: 'monthly', label: 'Mensual', price: 55, cycle: 'mensual' },
        { id: 'annual', label: 'Anual', price: 600, cycle: 'anual', note: '2 meses gratis' },
      ],
      access: {
        schedule: 'L-V 6:00-14:00',
        zones: ['Sala fitness', 'Clases colectivas', 'Zona cardio'],
      },
      reservations: {
        maxActive: 3,
        noShows: 3,
        waitlist: true,
      },
      benefits: ['App básica', 'Evaluación inicial', '1 invitado/mes'],
      restrictions: ['No acceso fines de semana', 'No incluye SPA'],
      visibility: {
        web: true,
        app: true,
        recepcion: true,
        corporate: false,
      },
      automations: [
        {
          id: 'auto-4',
          stage: 'alta',
          title: 'Kit bienvenida',
          description: 'Checklist de primeros 30 días + asignación de objetivo.',
        },
        {
          id: 'auto-5',
          stage: 'pre_vencimiento',
          title: 'Recordatorio 7 días',
          description: 'Enviar upgrade a Premium 24/7 si asistencia >8 veces/mes.',
          offset: '7 días',
        },
      ],
    },
  },
  {
    id: 'PL-003',
    name: 'Online Hybrid',
    price: 39,
    billingCycle: 'mensual',
    type: 'online',
    duration: 'Sin permanencia',
    activeMembers: 95,
    monthlyRevenue: 3705,
    status: 'activo',
    visibilityChannels: ['web', 'app'],
    detail: {
      description: 'Plan híbrido con clases en directo, biblioteca on-demand y 2 accesos presenciales/mes.',
      tags: ['Digital', 'Low touch', 'Upsell potencial'],
      pricing: [
        { id: 'monthly', label: 'Mensual', price: 39, cycle: 'mensual' },
        { id: 'quarterly', label: 'Trimestral', price: 109, cycle: 'trimestral', note: 'Ahorra 7€' },
      ],
      access: {
        schedule: 'Contenido on-demand 24/7',
        zones: ['Clases online', '2 pases presenciales/mes'],
      },
      reservations: {
        maxActive: 2,
        noShows: 1,
        waitlist: true,
      },
      benefits: ['Planificación semanal automatizada', 'Comunidad privada', 'Coach virtual'],
      restrictions: ['No acceso SPA', 'Pases presenciales sujetos a disponibilidad'],
      visibility: {
        web: true,
        app: true,
        recepcion: false,
        corporate: false,
      },
      automations: [
        {
          id: 'auto-6',
          stage: 'alta',
          title: 'Secuencia onboarding digital',
          description: '5 emails + 3 notificaciones push primeras 2 semanas.',
        },
        {
          id: 'auto-7',
          stage: 'pre_vencimiento',
          title: 'Upgrade a Presencial',
          description: 'Identifica usuarios con >80% asistencia online y ofrece upgrade a Premium.',
          offset: '5 días',
        },
      ],
    },
  },
  {
    id: 'PL-004',
    name: 'Corporate Scale',
    price: 49,
    billingCycle: 'mensual',
    type: 'corporate',
    duration: 'Permanencia 12 meses',
    activeMembers: 310,
    monthlyRevenue: 15190,
    status: 'activo',
    visibilityChannels: ['corporate', 'recepcion'],
    detail: {
      description: 'Plan diseñado para empresas con acceso multisede, reportes y perks exclusivos.',
      tags: ['B2B', 'Dashboard HR', 'Multi-sede'],
      pricing: [
        { id: 'company', label: 'Precio por empleado', price: 49, cycle: 'mensual', note: 'Desde 50 empleados' },
        { id: 'custom', label: 'Enterprise', price: 45, cycle: 'mensual', note: 'Desde 200 empleados' },
      ],
      access: {
        schedule: '24/7 multisede',
        zones: ['Todas las sedes', 'Clases corporativas', 'Sala wellness'],
      },
      reservations: {
        maxActive: 6,
        noShows: 2,
        waitlist: true,
      },
      benefits: ['Dashboard RRHH', 'Reportes mensuales', 'Eventos exclusivos', 'Invitados ilimitados'],
      restrictions: ['Solo empresas registradas', 'Contrato mínimo 12 meses'],
      visibility: {
        web: false,
        app: false,
        recepcion: true,
        corporate: true,
      },
      automations: [
        {
          id: 'auto-8',
          stage: 'alta',
          title: 'Onboarding empresa',
          description: 'Email CFO + pack bienvenida RRHH + webinar de lanzamiento.',
        },
        {
          id: 'auto-9',
          stage: 'pre_vencimiento',
          title: 'Reporte ROI 30 días antes',
          description: 'Reporte impacto empleados + propuesta renovación.',
          offset: '30 días',
        },
      ],
    },
  },
];

const activeMembershipsMock: ActiveMembership[] = [
  {
    id: 'MB-101',
    memberName: 'Laura Sánchez',
    planName: 'Premium 24/7 + PT',
    startDate: '2025-01-12T00:00:00Z',
    renewalDate: '2025-12-12T00:00:00Z',
    status: 'activa',
    value: 89,
    paymentMethod: 'tarjeta',
    site: 'Sede Central',
    origin: 'online',
    flags: ['alto_valor'],
    upgradePotential: 'bajo',
    riskScore: 12,
    lastInteraction: '2025-09-28',
  },
  {
    id: 'MB-102',
    memberName: 'Javier Ruiz',
    planName: 'Flexible Mañanas',
    startDate: '2025-09-15T00:00:00Z',
    renewalDate: '2025-12-15T00:00:00Z',
    status: 'morosidad',
    value: 55,
    paymentMethod: 'domiciliacion',
    site: 'Sede Norte',
    origin: 'recepcion',
    flags: ['moroso', 'riesgo_fuga'],
    upgradePotential: 'medio',
    riskScore: 78,
    lastInteraction: '2025-10-05',
  },
  {
    id: 'MB-103',
    memberName: 'Nerea Vidal',
    planName: 'Online Hybrid',
    startDate: '2025-07-01T00:00:00Z',
    renewalDate: '2025-10-01T00:00:00Z',
    status: 'en_revision',
    value: 39,
    paymentMethod: 'tarjeta',
    site: 'Digital',
    origin: 'online',
    flags: ['riesgo_fuga'],
    upgradePotential: 'alto',
    riskScore: 64,
    lastInteraction: '2025-10-02',
  },
  {
    id: 'MB-104',
    memberName: 'Robert Castillo',
    planName: 'Corporate Scale',
    startDate: '2025-03-01T00:00:00Z',
    renewalDate: '2025-12-01T00:00:00Z',
    status: 'activa',
    value: 49,
    paymentMethod: 'transferencia',
    site: 'Sede Centro + Sede Norte',
    origin: 'corporate',
    flags: ['alto_valor'],
    upgradePotential: 'medio',
    riskScore: 18,
    lastInteraction: '2025-09-30',
  },
  {
    id: 'MB-105',
    memberName: 'Sara Prieto',
    planName: 'Flexible Mañanas',
    startDate: '2025-08-21T00:00:00Z',
    renewalDate: '2025-11-21T00:00:00Z',
    status: 'pausada',
    value: 0,
    paymentMethod: 'tarjeta',
    site: 'Sede Sur',
    origin: 'promo',
    flags: [],
    upgradePotential: 'bajo',
    riskScore: 35,
    lastInteraction: '2025-09-18',
  },
];

const renewalsMock: RenewalInsight[] = [
  {
    id: 'RN-01',
    memberName: 'Javier Ruiz',
    planName: 'Flexible Mañanas',
    renewalDate: '2025-12-15T00:00:00Z',
    nextAction: 'Llamar para actualizar pago',
    churnRisk: 'alto',
    reason: 'Morosidad > 14 días',
    owner: 'María López',
    playbook: 'Recuperar morosos 14d',
  },
  {
    id: 'RN-02',
    memberName: 'Nerea Vidal',
    planName: 'Online Hybrid',
    renewalDate: '2025-10-01T00:00:00Z',
    nextAction: 'Enviar oferta upgrade PT',
    churnRisk: 'medio',
    reason: 'Asistencia a clases 1/sem',
    owner: 'Carlos Pérez',
    playbook: 'Upgrade digital a presencial',
  },
  {
    id: 'RN-03',
    memberName: 'Laura Sánchez',
    planName: 'Premium 24/7 + PT',
    renewalDate: '2025-12-12T00:00:00Z',
    nextAction: 'Reunión con coach',
    churnRisk: 'bajo',
    owner: 'María López',
    playbook: 'Renovación VIP',
  },
  {
    id: 'RN-04',
    memberName: 'Empresa X (45 empleados)',
    planName: 'Corporate Scale',
    renewalDate: '2025-11-30T00:00:00Z',
    nextAction: 'Presentar reporte trimestral',
    churnRisk: 'medio',
    reason: 'Uso plano en sede Norte',
    owner: 'Daniela Torres',
    playbook: 'Renovación corporate',
  },
];

const ruleCategoriesMock: RuleCategory[] = [
  {
    id: 'cancelaciones',
    title: 'Políticas de cancelación',
    description: 'Controla cómo se cancelan los planes y si existe penalización.',
    rules: [
      {
        id: 'cancel-01',
        name: 'Aviso mínimo 48h',
        status: 'activa',
        appliesTo: 'Planes premium y corporate',
        summary: 'Cancelaciones con menos de 48h pierden el depósito de reactivación.',
        lastUpdated: '2025-09-01',
        impact: 'Redujo el churn involuntario 8%',
      },
      {
        id: 'cancel-02',
        name: 'Reembolso 50% con preaviso',
        status: 'en_test',
        appliesTo: 'Planes Flexible y Online',
        summary: 'Reembolso parcial si cancelan con 15 días de antelación.',
        lastUpdated: '2025-10-05',
      },
    ],
  },
  {
    id: 'pausas',
    title: 'Pausas & congelaciones',
    description: 'Define cuándo y cómo se puede congelar una membresía.',
    rules: [
      {
        id: 'pause-01',
        name: 'Máx 2 meses/año',
        status: 'activa',
        appliesTo: 'Todos los planes salvo corporativos',
        summary: 'Se cobra 15€/mes durante la pausa para premium y 5€ para flexible.',
        lastUpdated: '2025-08-20',
      },
      {
        id: 'pause-02',
        name: 'Pausas médicas sin coste',
        status: 'activa',
        appliesTo: 'Planes premium',
        summary: 'Requiere certificado y aprobación manual.',
        lastUpdated: '2025-07-12',
      },
    ],
  },
  {
    id: 'reservas',
    title: 'Reservas & no-shows',
    description: 'Limita reservas y gestiona penalizaciones por ausencias.',
    rules: [
      {
        id: 'booking-01',
        name: 'Bloqueo 7 días si 3 no-shows',
        status: 'activa',
        appliesTo: 'Clases colectivas',
        summary: 'Al 3º no-show se bloquean reservas durante 7 días.',
        lastUpdated: '2025-06-30',
      },
      {
        id: 'booking-02',
        name: 'Lista espera prioritaria',
        status: 'en_test',
        appliesTo: 'Plan Premium',
        summary: 'Los VIP saltan la lista de espera tras 12h de espera.',
        lastUpdated: '2025-10-01',
      },
    ],
  },
  {
    id: 'upgrades',
    title: 'Upgrades & downgrades',
    description: 'Controla saltos de plan y prorrateos automáticos.',
    rules: [
      {
        id: 'upgrade-01',
        name: 'Upgrade inmediato',
        status: 'activa',
        appliesTo: 'Flexible → Premium',
        summary: 'Prorratea diferencia y activa beneficios instantáneamente.',
        lastUpdated: '2025-05-15',
        impact: 'Aumentó ARPU +12%',
      },
      {
        id: 'downgrade-01',
        name: 'Downgrade solo fin de ciclo',
        status: 'activa',
        appliesTo: 'Premium → Flexible/Online',
        summary: 'Se agenda downgrade tras la fecha de renovación.',
        lastUpdated: '2025-04-10',
      },
    ],
  },
];

const addOnsMock: AddOn[] = [
  {
    id: 'addon-01',
    name: 'Taquilla fija',
    type: 'recurrente',
    price: 15,
    frequency: 'mensual',
    conditions: ['Contrato mínimo 3 meses'],
    compatiblePlans: ['Premium 24/7 + PT', 'Corporate Scale'],
    status: 'activo',
    highlight: true,
  },
  {
    id: 'addon-02',
    name: 'Parking cubierto',
    type: 'recurrente',
    price: 25,
    frequency: 'mensual',
    conditions: ['Sujeto a disponibilidad'],
    compatiblePlans: ['Premium 24/7 + PT', 'Flexible Mañanas'],
    status: 'activo',
  },
  {
    id: 'addon-03',
    name: 'Pack 5 sesiones PT',
    type: 'paquete',
    price: 180,
    frequency: 'puntual',
    conditions: ['Válido 3 meses'],
    compatiblePlans: ['Premium 24/7 + PT', 'Flexible Mañanas'],
    status: 'activo',
  },
  {
    id: 'addon-04',
    name: 'Evaluación biomecánica',
    type: 'unico',
    price: 60,
    frequency: 'puntual',
    conditions: ['Incluye informe personalizado'],
    compatiblePlans: ['Todos'],
    status: 'activo',
  },
  {
    id: 'addon-05',
    name: 'Sauna ilimitada',
    type: 'recurrente',
    price: 19,
    frequency: 'mensual',
    conditions: ['Solo premium'],
    compatiblePlans: ['Premium 24/7 + PT'],
    status: 'inactivo',
  },
];

const corporatePlansMock: CorporatePlan[] = [
  {
    id: 'corp-01',
    name: 'Corporate Scale',
    description: 'Plan base multisede para empresas medianas con seguimiento mensual.',
    minEmployees: 50,
    pricePerEmployee: 49,
    seatsIncluded: 50,
    multiSite: true,
    perks: ['Reportes RRHH', 'Eventos corporativos', 'Hotline dedicada'],
    activeCompanies: 12,
    monthlyRevenue: 15190,
  },
  {
    id: 'corp-02',
    name: 'Corporate Elite',
    description: 'Solución enterprise con entrenador in-company y acceso VIP.',
    minEmployees: 200,
    pricePerEmployee: 45,
    seatsIncluded: 200,
    multiSite: true,
    perks: ['PT en oficina', 'Dashboard BI', 'Clases privadas'],
    activeCompanies: 4,
    monthlyRevenue: 36200,
  },
  {
    id: 'corp-03',
    name: 'StartUp Fit',
    description: 'Plan flexible para startups con crecimiento rápido y necesidad de perks.',
    minEmployees: 15,
    pricePerEmployee: 59,
    seatsIncluded: 20,
    multiSite: false,
    perks: ['Acceso híbrido', 'Mentor wellness', 'Comunidad networking'],
    activeCompanies: 18,
    monthlyRevenue: 12780,
  },
];

const strategicInsightsMock: StrategicInsight[] = [
  {
    id: 'insight-01',
    title: 'Simular subida 5€ Premium',
    description: 'Proyecta el impacto de subir 5€ el plan Premium con 12% churn esperado.',
    impact: '+6.240€ MRR estimado',
    cta: 'Abrir simulador',
    icon: 'chart',
  },
  {
    id: 'insight-02',
    title: 'Mover 40 clientes Flexible → Premium',
    description: 'Clientes con uso alto listos para upgrade; impacto en ARPU +18%.',
    impact: '+3.560€ MRR / 40 clientes',
    cta: 'Ver lista clientes',
    icon: 'rocket',
  },
  {
    id: 'insight-03',
    title: 'Downgrade preventivo plan Online',
    description: 'Clientes con poca asistencia: ofrece plan Lite para evitar churn.',
    impact: 'Evita 1.120€ de churn',
    cta: 'Lanzar campaña',
    icon: 'shield',
  },
];

export async function fetchPlanCatalog(): Promise<PlanSummary[]> {
  await delay(220);
  return planCatalogMock;
}

export async function fetchActiveMemberships(): Promise<ActiveMembership[]> {
  await delay(240);
  return activeMembershipsMock;
}

export async function fetchRenewalInsights(): Promise<RenewalInsight[]> {
  await delay(200);
  return renewalsMock;
}

export async function fetchRuleCategories(): Promise<RuleCategory[]> {
  await delay(180);
  return ruleCategoriesMock;
}

export async function fetchAddOns(): Promise<AddOn[]> {
  await delay(160);
  return addOnsMock;
}

export async function fetchCorporatePlans(): Promise<CorporatePlan[]> {
  await delay(210);
  return corporatePlansMock;
}

export async function fetchStrategicInsights(): Promise<StrategicInsight[]> {
  await delay(120);
  return strategicInsightsMock;
}

