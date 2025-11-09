export type ClientStatus = 'activo' | 'pausa' | 'baja' | 'lead' | 'prueba';
export type ClientType = 'gym' | 'pt' | 'online' | 'hybrid';
export type ClientRiskLevel = 'alto' | 'medio' | 'bajo';
export type ClientSatisfactionLevel = 'alto' | 'neutro' | 'bajo';

export interface Client360Summary {
  id: string;
  name: string;
  avatarUrl?: string;
  email: string;
  phone: string;
  status: ClientStatus;
  type: ClientType;
  riskLevel: ClientRiskLevel;
  satisfactionLevel: ClientSatisfactionLevel;
  branch: string;
  tags: string[];
  membership: {
    name: string;
    endDate: string;
  };
  monthlyValue: number;
  lifetimeValue: number;
  lastVisit: string;
  lastContact: string;
  assignedCoach: string;
  upcomingRenewal: string | null;
  joinedAt: string;
  isVip?: boolean;
  isHighValue?: boolean;
}

export interface ClientTimelineEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  category: 'membership' | 'attendance' | 'training' | 'nutrition' | 'finance' | 'communication' | 'incident';
  tone: 'success' | 'info' | 'warning';
}

export interface ClientQuickCard {
  id: string;
  title: string;
  value: string;
  caption?: string;
  intent?: 'positive' | 'warning' | 'negative' | 'neutral';
  actionLabel?: string;
}

export interface ClientAlert {
  id: string;
  label: string;
  level: 'info' | 'warning' | 'error' | 'success';
  description?: string;
  actionLabel?: string;
}

export interface ClientPersonalDataItem {
  label: string;
  value: string;
}

export interface ClientMedicalNote {
  id: string;
  label: string;
  detail: string;
  createdAt: string;
  critical?: boolean;
}

export interface ClientPlanHistoryItem {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'activo' | 'finalizado' | 'cancelado';
  price: number;
}

export interface ClientServiceAddon {
    id: string;
    name: string;
  description: string;
  active: boolean;
  price: number;
}

export interface ClientTrainingMetric {
    id: string;
    label: string;
    value: string;
    trend: 'up' | 'down' | 'neutral';
}

export interface ClientTrainingHistoryItem {
  id: string;
  name: string;
  completion: number;
  timeframe: string;
}

export interface ClientNutritionCheckIn {
  id: string;
  date: string;
  weight: string;
  notes?: string;
}

export interface ClientAttendanceEntry {
    id: string;
  date: string;
  type: 'entrenamiento' | 'clase' | 'acceso';
  status: 'asistido' | 'faltó' | 'canceló';
    label: string;
}

export interface ClientFinanceRecord {
  id: string;
  concept: string;
  amount: number;
  status: 'pagado' | 'pendiente' | 'fallido';
  date: string;
}

export interface ClientPaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'amex' | 'sepa';
  lastDigits: string;
  status: 'activo' | 'expirado';
  primary: boolean;
}

export interface ClientCommunicationEntry {
  id: string;
  channel: 'email' | 'whatsapp' | 'llamada' | 'sms';
  subject: string;
  author: string;
  date: string;
  outcome?: string;
}

export interface ClientNote {
  id: string;
  author: string;
  createdAt: string;
  content: string;
}

export interface ClientSurveyRecord {
  id: string;
  name: string;
  score: number;
  date: string;
  comment?: string;
}

export interface ClientDocumentRecord {
  id: string;
  name: string;
  type: 'contrato' | 'consentimiento' | 'informe' | 'otros';
  status: 'firmado' | 'pendiente' | 'expirado';
  updatedAt: string;
}

export interface ClientAutomationRule {
  id: string;
  name: string;
  description: string;
  status: 'activa' | 'en pausa';
}

export interface ClientAutomationRecommendation {
  id: string;
  message: string;
  confidence: number;
  actionLabel: string;
}

export interface ClientProfileHeader {
  fullName: string;
  avatarUrl?: string;
  status: ClientStatus;
  membership: {
    name: string;
    planType: string;
    endDate: string;
    nextBillingDate?: string;
  };
  branch: string;
  assignedTeam: {
    coach: string;
    manager?: string;
  };
  contact: {
    phone: string;
    email: string;
    address?: string;
  };
  tags: string[];
  indicators: {
    riskLevel: ClientRiskLevel;
    satisfaction: {
      score: number;
      label: string;
    };
    totalValue: number;
    monthlyValue: number;
    attendance30Days: number;
    primaryGoal: string;
  };
}

export interface ClientProfile {
  header: ClientProfileHeader;
  summary: {
    timeline: ClientTimelineEvent[];
    quickCards: ClientQuickCard[];
    alerts: ClientAlert[];
    shortcuts: Array<{ id: string; label: string; description?: string }>;
  };
  health: {
    personalData: ClientPersonalDataItem[];
    preferences: string[];
    medicalNotes: ClientMedicalNote[];
    alerts: string[];
    documents: Array<{ id: string; name: string; status: 'vigente' | 'pendiente' | 'expirado' }>;
  };
  memberships: {
    currentPlan: {
      name: string;
      startDate: string;
      endDate: string;
      price: number;
      status: 'activo' | 'pendiente' | 'en pausa';
    };
    history: ClientPlanHistoryItem[];
    addons: ClientServiceAddon[];
    trials: Array<{ id: string; name: string; status: 'activo' | 'finalizado'; endDate: string }>;
  };
  training: {
    activeProgram: {
      name: string;
      coach: string;
      startDate: string;
      endDate: string;
      completion: number;
      missedSessions: number;
    };
    keyMetrics: ClientTrainingMetric[];
    history: ClientTrainingHistoryItem[];
  };
  nutrition: {
    activePlan: {
      name: string;
      coach: string;
      calories: number;
      macros: {
        protein: number;
        carbs: number;
        fats: number;
      };
      compliance: number;
      startDate: string;
      alerts: string[];
    };
    checkIns: ClientNutritionCheckIn[];
    restrictions: string[];
  };
  attendance: {
    weeklyAverage: number;
    monthlyAverage: number;
    preferredSchedule: string;
    entries: ClientAttendanceEntry[];
    alerts: string[];
    noShows: Array<{ id: string; className: string; date: string }>;
  };
  finances: {
    summary: {
      totalBilled: number;
      pending: number;
      refunded: number;
    };
    subscriptions: Array<{
      id: string;
      name: string;
      amount: number;
      status: 'activa' | 'pendiente' | 'fallida';
      nextCharge: string;
    }>;
    invoices: ClientFinanceRecord[];
    paymentMethods: ClientPaymentMethod[];
  };
  communications: {
    timeline: ClientCommunicationEntry[];
    notes: ClientNote[];
    templates: Array<{ id: string; name: string; description: string }>;
  };
  satisfaction: {
    lastNps: number;
    trend: 'up' | 'flat' | 'down';
    surveys: ClientSurveyRecord[];
    promoters: number;
    detractors: number;
  };
  documents: ClientDocumentRecord[];
  automations: {
    rules: ClientAutomationRule[];
    recommendations: ClientAutomationRecommendation[];
  };
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const clientsMock: Client360Summary[] = [
  {
    id: 'CL-1001',
    name: 'Laura Sánchez',
    avatarUrl: 'https://i.pravatar.cc/120?img=47',
    email: 'laura.sanchez@example.com',
    phone: '+34 615 203 844',
    status: 'activo',
    type: 'hybrid',
    riskLevel: 'bajo',
    satisfactionLevel: 'alto',
    branch: 'Madrid - Castellana',
    tags: ['VIP', 'Embajadora', 'Híbrido'],
    membership: {
      name: 'Premium 12 meses',
      endDate: '2026-03-15T00:00:00Z',
    },
    monthlyValue: 189,
    lifetimeValue: 1890,
    lastVisit: '2025-11-05T18:30:00Z',
    lastContact: '2025-11-06T10:15:00Z',
    assignedCoach: 'Raúl Ortega',
    upcomingRenewal: '2025-12-15T00:00:00Z',
    joinedAt: '2024-12-01T00:00:00Z',
    isVip: true,
    isHighValue: true,
  },
  {
    id: 'CL-1002',
    name: 'Javier Ruiz',
    avatarUrl: 'https://i.pravatar.cc/120?img=12',
    email: 'javier.ruiz@example.com',
    phone: '+34 644 118 221',
    status: 'activo',
    type: 'hybrid',
    riskLevel: 'alto',
    satisfactionLevel: 'neutro',
    branch: 'Madrid - Serrano',
    tags: ['Corporativo', 'Madrugador'],
    membership: {
      name: 'Corporativo Plus',
      endDate: '2025-12-31T00:00:00Z',
    },
    monthlyValue: 210,
    lifetimeValue: 2450,
    lastVisit: '2025-10-24T09:10:00Z',
    lastContact: '2025-10-30T07:50:00Z',
    assignedCoach: 'María Gómez',
    upcomingRenewal: '2025-12-01T00:00:00Z',
    joinedAt: '2025-02-18T00:00:00Z',
    isHighValue: true,
  },
  {
    id: 'CL-1003',
    name: 'Nerea Vidal',
    avatarUrl: 'https://i.pravatar.cc/120?img=32',
    email: 'nerea.vidal@example.com',
    phone: '+34 699 887 230',
    status: 'prueba',
    type: 'online',
    riskLevel: 'medio',
    satisfactionLevel: 'alto',
    branch: 'Barcelona - Diagonal',
    tags: ['Online', 'PT'],
    membership: {
      name: 'Trial 30 días',
      endDate: '2025-11-28T00:00:00Z',
    },
    monthlyValue: 79,
    lifetimeValue: 630,
    lastVisit: '2025-11-06T07:45:00Z',
    lastContact: '2025-11-04T13:20:00Z',
    assignedCoach: 'Ana Duarte',
    upcomingRenewal: '2025-11-28T00:00:00Z',
    joinedAt: '2025-10-30T00:00:00Z',
  },
  {
    id: 'CL-1004',
    name: 'Samuel Pérez',
    avatarUrl: 'https://i.pravatar.cc/120?img=56',
    email: 'samuel.perez@example.com',
    phone: '+34 622 555 102',
    status: 'pausa',
    type: 'gym',
    riskLevel: 'medio',
    satisfactionLevel: 'bajo',
    branch: 'Valencia - Ruzafa',
    tags: ['Fuerza', 'Recuperación'],
    membership: {
      name: 'PT 24 sesiones',
      endDate: '2025-01-12T00:00:00Z',
    },
    monthlyValue: 160,
    lifetimeValue: 1280,
    lastVisit: '2025-09-12T16:00:00Z',
    lastContact: '2025-09-18T09:40:00Z',
    assignedCoach: 'Luis Pérez',
    upcomingRenewal: null,
    joinedAt: '2024-05-03T00:00:00Z',
  },
];

const profilesMock: Record<string, ClientProfile> = {
  'CL-1001': {
    header: {
      fullName: 'Laura Sánchez',
      avatarUrl: 'https://i.pravatar.cc/120?img=47',
      status: 'activo',
      membership: {
        name: 'Premium 12 meses',
        planType: 'Full Access + PT semanal',
        endDate: '2026-03-15T00:00:00Z',
        nextBillingDate: '2025-12-15T00:00:00Z',
      },
      branch: 'Madrid - Castellana',
      assignedTeam: {
        coach: 'Raúl Ortega',
        manager: 'Marta Varela',
      },
      contact: {
        phone: '+34 615 203 844',
        email: 'laura.sanchez@example.com',
        address: 'Calle Serrano 112, Madrid',
      },
      tags: ['VIP', 'Embajadora', 'Lesión rodilla 2023', 'Híbrido'],
      indicators: {
        riskLevel: 'bajo',
        satisfaction: {
          score: 92,
          label: 'Promotora',
        },
        totalValue: 1890,
        monthlyValue: 189,
        attendance30Days: 11,
        primaryGoal: 'Reducir estrés y mejorar composición corporal',
      },
    },
    summary: {
      timeline: [
        {
          id: 'event-1',
          title: 'Renovó plan Premium',
          description: 'Renovación anual con upgrade a PT semanal.',
          date: '2025-09-01T09:00:00Z',
          category: 'membership',
          tone: 'success',
        },
        {
          id: 'event-2',
          title: 'Asistencia a Funcional Intensivo',
          description: 'Completó la sesión dirigida por Raúl Ortega.',
          date: '2025-11-05T18:30:00Z',
          category: 'attendance',
          tone: 'info',
        },
        {
          id: 'event-3',
          title: 'Feedback excelente en NPS',
          description: 'Puntuó con un 9 destacando el trato del coach.',
          date: '2025-10-21T12:00:00Z',
          category: 'communication',
          tone: 'success',
        },
        {
          id: 'event-4',
          title: 'Recordatorio de revisión de plan',
          description: 'Pendiente coordinar revisión de plan de yoga.',
          date: '2025-11-09T10:00:00Z',
          category: 'training',
          tone: 'warning',
        },
      ],
      quickCards: [
        {
          id: 'goal-progress',
          title: 'Progreso objetivo principal',
          value: '72%',
          caption: 'Objetivo: 20% grasa corporal',
          intent: 'positive',
          actionLabel: 'Ver detalles',
        },
        {
          id: 'training-compliance',
          title: 'Cumplimiento entreno',
          value: '87%',
          caption: 'Últimos 30 días',
          intent: 'positive',
          actionLabel: 'Ver sesiones',
        },
        {
          id: 'nutrition-compliance',
          title: 'Cumplimiento nutrición',
          value: '78%',
          caption: 'Check-ins semanales',
          intent: 'neutral',
          actionLabel: 'Ver plan',
        },
        {
          id: 'payments-status',
          title: 'Pagos al día',
          value: 'OK',
          caption: 'Sin incidencias',
          intent: 'positive',
        },
      ],
      alerts: [
        {
          id: 'alert-1',
          label: 'Revisión de plan de yoga pendiente',
          level: 'info',
          description: 'Coordinar feedback antes del 15 de noviembre.',
          actionLabel: 'Crear tarea',
        },
      ],
      shortcuts: [
        { id: 'training-detail', label: 'Ver detalle entreno', description: 'Programas activos y progreso' },
        { id: 'nutrition-detail', label: 'Ver detalle nutrición', description: 'Plan activo y check-ins' },
        { id: 'payments-detail', label: 'Ver pagos', description: 'Facturas y cobros recientes' },
        { id: 'communications-detail', label: 'Ver comunicaciones', description: 'Mensajería y notas internas' },
      ],
    },
    health: {
      personalData: [
        { label: 'Fecha de nacimiento', value: '13/07/1991' },
        { label: 'DNI', value: '12345678L' },
        { label: 'Talla', value: '1,68 m' },
        { label: 'Peso actual', value: '64,3 kg' },
      ],
      preferences: ['Prefiere entrenar mañanas', 'Clases de fuerza', 'No le gustan sesiones >60 min', 'Coach femenino para yoga'],
      medicalNotes: [
        {
          id: 'med-1',
          label: 'Lesión rodilla derecha (2023)',
          detail: 'Evitar impacto alto y mantener control en sentadillas profundas.',
          createdAt: '2024-02-10T10:00:00Z',
          critical: true,
        },
        {
          id: 'med-2',
          label: 'Intolerancia a lactosa',
          detail: 'Preferir suplementos sin lactosa.',
          createdAt: '2024-06-22T09:20:00Z',
        },
      ],
      alerts: ['Alerta médica activa: rodilla derecha. Mostrar icono en reservas de clases.'],
      documents: [
        { id: 'doc-1', name: 'PAR-Q 2025', status: 'vigente' },
        { id: 'doc-2', name: 'Consentimiento uso de datos', status: 'vigente' },
      ],
    },
    memberships: {
      currentPlan: {
        name: 'Premium 12 meses',
        startDate: '2025-03-15T00:00:00Z',
        endDate: '2026-03-15T00:00:00Z',
        price: 189,
        status: 'activo',
      },
      history: [
        {
          id: 'm-2024',
          name: 'Premium 12 meses',
          startDate: '2024-03-15T00:00:00Z',
          endDate: '2025-03-14T00:00:00Z',
          status: 'finalizado',
          price: 165,
        },
        {
          id: 'm-2023',
          name: 'Full Access 6 meses',
          startDate: '2023-09-15T00:00:00Z',
          endDate: '2024-03-14T00:00:00Z',
          status: 'finalizado',
          price: 149,
        },
      ],
      addons: [
        {
          id: 'addon-1',
          name: 'Taquilla premium',
          description: 'Taquilla fija con servicio de lavandería',
          active: true,
          price: 19,
        },
        {
          id: 'addon-2',
          name: 'Parking',
          description: 'Plaza de parking 2h',
          active: false,
          price: 45,
        },
      ],
      trials: [
        { id: 'trial-1', name: 'Programa mindfulness', status: 'finalizado', endDate: '2024-12-15T00:00:00Z' },
      ],
    },
    training: {
      activeProgram: {
        name: 'Funcional intensivo',
        coach: 'Raúl Ortega',
        startDate: '2025-09-01T00:00:00Z',
        endDate: '2025-12-01T00:00:00Z',
        completion: 72,
        missedSessions: 1,
      },
      keyMetrics: [
        { id: 'bf', label: 'Grasa corporal', value: '24.1%', trend: 'down' },
        { id: 'strength', label: '1RM Sentadilla', value: '92 kg', trend: 'up' },
        { id: 'compliance', label: 'Adherencia 30 días', value: '87%', trend: 'neutral' },
      ],
      history: [
        { id: 't-1', name: 'Yoga & Mindfulness', completion: 38, timeframe: 'Ago - Nov 2025' },
        { id: 't-2', name: 'Hipertrofia avanzada', completion: 90, timeframe: 'Ene - Jun 2025' },
      ],
    },
    nutrition: {
      activePlan: {
        name: 'Plan anti-estrés',
        coach: 'Patri Márquez',
        calories: 1900,
        macros: {
          protein: 130,
          carbs: 210,
          fats: 60,
        },
        compliance: 78,
        startDate: '2025-08-20T00:00:00Z',
        alerts: ['Recordar actualización de check-in semanal en app'],
      },
      checkIns: [
        { id: 'n-1', date: '2025-11-02T00:00:00Z', weight: '64,3 kg', notes: 'Semana estable, viaje de trabajo.' },
        { id: 'n-2', date: '2025-10-26T00:00:00Z', weight: '64,5 kg' },
        { id: 'n-3', date: '2025-10-19T00:00:00Z', weight: '64,9 kg', notes: 'Buen cumplimiento, más energía.' },
      ],
      restrictions: ['Intolerancia lactosa', 'Evitar ultraprocesados', 'Cena ligera'],
    },
    attendance: {
      weeklyAverage: 3.7,
      monthlyAverage: 15,
      preferredSchedule: 'Ma - Ju 07:00h, Sa 10:00h',
      entries: [
        { id: 'a-1', date: '2025-11-05T18:30:00Z', type: 'entrenamiento', status: 'asistido', label: 'Funcional intensivo' },
        { id: 'a-2', date: '2025-11-04T07:00:00Z', type: 'clase', status: 'asistido', label: 'Yoga vinyasa' },
        { id: 'a-3', date: '2025-11-02T09:00:00Z', type: 'clase', status: 'faltó', label: 'HIIT team' },
      ],
      alerts: ['Sin incidencias de ausencia. Mantener seguimiento semanal.'],
      noShows: [
        { id: 'ns-1', className: 'HIIT team', date: '2025-11-02T09:00:00Z' },
      ],
    },
    finances: {
      summary: {
        totalBilled: 3245,
        pending: 0,
        refunded: 0,
      },
      subscriptions: [
        {
          id: 'sub-1',
          name: 'Premium 12 meses',
          amount: 189,
          status: 'activa',
          nextCharge: '2025-12-15T00:00:00Z',
        },
      ],
      invoices: [
        {
          id: 'inv-1',
          concept: 'Cuota noviembre 2025',
          amount: 189,
          status: 'pagado',
          date: '2025-11-01T00:00:00Z',
        },
        {
          id: 'inv-2',
          concept: 'Sesión PT extra',
          amount: 45,
          status: 'pagado',
          date: '2025-10-18T00:00:00Z',
        },
      ],
      paymentMethods: [
        {
          id: 'pm-1',
          type: 'visa',
          lastDigits: '1290',
          status: 'activo',
          primary: true,
        },
        {
          id: 'pm-2',
          type: 'sepa',
          lastDigits: '7621',
          status: 'activo',
          primary: false,
        },
      ],
    },
    communications: {
      timeline: [
        {
          id: 'comm-1',
          channel: 'whatsapp',
          subject: 'Confirmación sesión PT',
          author: 'Raúl Ortega',
          date: '2025-11-04T10:12:00Z',
          outcome: 'Respondió OK',
        },
        {
          id: 'comm-2',
          channel: 'email',
          subject: 'Encuesta NPS Octubre',
          author: 'Equipo CX',
          date: '2025-10-21T12:00:00Z',
          outcome: 'Puntuación 9',
        },
      ],
      notes: [
        {
          id: 'note-1',
          author: 'Marta Varela',
          createdAt: '2025-10-10T08:45:00Z',
          content: 'Excelente promotora, proponerle participar en programa de referidos.',
        },
        {
          id: 'note-2',
          author: 'Raúl Ortega',
          createdAt: '2025-09-24T18:10:00Z',
          content: 'Revisar ejecución de sentadilla por molestia leve en rodilla.',
        },
      ],
      templates: [
        { id: 'tpl-1', name: 'Recordatorio check-in nutrición', description: 'Mensaje semanal para subir peso y foto' },
        { id: 'tpl-2', name: 'Upgrade PT intensivo', description: 'Oferta para duplicar sesiones PT' },
      ],
    },
    satisfaction: {
      lastNps: 9,
      trend: 'up',
      surveys: [
        {
          id: 'sat-1',
          name: 'NPS Octubre',
          score: 9,
          date: '2025-10-21T12:00:00Z',
          comment: 'La comunicación con el coach es excelente, echo de menos más variedad en cardio.',
        },
        {
          id: 'sat-2',
          name: 'Encuesta onboarding',
          score: 8,
          date: '2025-08-05T09:30:00Z',
        },
      ],
      promoters: 2,
      detractors: 0,
    },
    documents: [
      {
        id: 'doc-1',
        name: 'Contrato Premium 2025',
        type: 'contrato',
        status: 'firmado',
        updatedAt: '2025-03-15T00:00:00Z',
      },
      {
        id: 'doc-2',
        name: 'Consentimiento audiovisual',
        type: 'consentimiento',
        status: 'firmado',
        updatedAt: '2025-04-10T00:00:00Z',
      },
    ],
    automations: {
      rules: [
        {
          id: 'auto-1',
          name: 'Alerta de baja asistencia',
          description: 'Si baja de 2 visitas/semana → notifica coach y envía WhatsApp.',
          status: 'activa',
        },
        {
          id: 'auto-2',
          name: 'Seguimiento VIP',
          description: 'Envia check-in personalizado cada viernes a clientes VIP.',
          status: 'activa',
        },
      ],
      recommendations: [
        {
          id: 'rec-1',
          message:
            'Cliente con alto uso de sesiones PT. Propón upgrade a paquete 2x semana para aprovechar momentum.',
          confidence: 0.82,
          actionLabel: 'Proponer upgrade',
        },
      ],
    },
  },
  'CL-1002': {
    header: {
      fullName: 'Javier Ruiz',
      avatarUrl: 'https://i.pravatar.cc/120?img=12',
      status: 'activo',
      membership: {
        name: 'Corporativo Plus',
        planType: 'Acceso ilimitado + PT quincenal',
        endDate: '2025-12-31T00:00:00Z',
        nextBillingDate: '2025-12-01T00:00:00Z',
      },
      branch: 'Madrid - Serrano',
      assignedTeam: {
        coach: 'María Gómez',
        manager: 'Julián Cerezo',
      },
      contact: {
        phone: '+34 644 118 221',
        email: 'javier.ruiz@example.com',
        address: 'Av. América 45, Madrid',
      },
      tags: ['Corporativo', 'High Potential', 'Madrugador'],
      indicators: {
        riskLevel: 'alto',
        satisfaction: {
          score: 62,
          label: 'Neutral',
        },
        totalValue: 2450,
        monthlyValue: 210,
        attendance30Days: 4,
        primaryGoal: 'Recuperar masa muscular y mejorar energía',
      },
    },
    summary: {
      timeline: [
        {
          id: 'j-evt-1',
          title: 'Sesión cancelada por trabajo',
          description: 'Notificó cancelación con 2h de antelación.',
          date: '2025-11-01T07:00:00Z',
          category: 'attendance',
          tone: 'warning',
        },
        {
          id: 'j-evt-2',
          title: 'Check-in nutrición completo',
          date: '2025-10-26T08:30:00Z',
          category: 'nutrition',
          tone: 'info',
        },
        {
          id: 'j-evt-3',
          title: 'Encuesta mensual',
          description: 'Puntuó 6/10 por dificultad de horarios.',
          date: '2025-10-30T07:50:00Z',
          category: 'communication',
          tone: 'warning',
        },
      ],
      quickCards: [
        {
          id: 'goal-progress',
          title: 'Progreso objetivo principal',
          value: '38%',
          caption: 'Recuperar masa muscular',
          intent: 'warning',
          actionLabel: 'Plan de acción',
        },
        {
          id: 'training-compliance',
          title: 'Cumplimiento entreno',
          value: '54%',
          caption: 'Últimos 30 días',
          intent: 'warning',
        },
        {
          id: 'nutrition-compliance',
          title: 'Cumplimiento nutrición',
          value: '61%',
          caption: 'Últimas 4 semanas',
          intent: 'neutral',
        },
        {
          id: 'payments-status',
          title: 'Pagos',
          value: '1 pendiente',
          caption: 'Recibo 01/11 en seguimiento',
          intent: 'warning',
          actionLabel: 'Ver recibo',
        },
      ],
      alerts: [
        {
          id: 'alert-risk',
          label: 'Riesgo alto: baja asistencia',
          level: 'warning',
          description: 'Ha asistido 1 de 4 sesiones planificadas este mes.',
          actionLabel: 'Enviar campaña retención',
        },
        {
          id: 'alert-schedule',
          label: 'Horarios tempranos completos',
          level: 'info',
          description: 'Revisar disponibilidad con equipo corporativo.',
        },
      ],
      shortcuts: [
        { id: 'assign-coach', label: 'Asignar tarea llamada', description: 'Coordinación con María Gómez' },
        { id: 'retention-campaign', label: 'Añadir a campaña retención', description: 'Secuencia reactivación 7 días' },
      ],
    },
    health: {
      personalData: [
        { label: 'Fecha de nacimiento', value: '02/11/1985' },
        { label: 'Talla', value: '1,80 m' },
        { label: 'Peso actual', value: '84,5 kg' },
      ],
      preferences: ['Sesiones antes de las 8:00', 'Entrenamientos de fuerza + HIIT', 'Viaja dos veces al mes'],
      medicalNotes: [
        {
          id: 'med-j1',
          label: 'Estrés laboral elevado',
          detail: 'Trabaja más de 55h semanales. Ajustar cargas.',
          createdAt: '2025-07-01T07:30:00Z',
        },
      ],
      alerts: ['Recordar evaluación médica anual corporativa en diciembre.'],
      documents: [
        { id: 'doc-j1', name: 'Certificado médico corporativo', status: 'vigente' },
        { id: 'doc-j2', name: 'Apto PAR-Q', status: 'vigente' },
      ],
    },
    memberships: {
      currentPlan: {
        name: 'Corporativo Plus',
        startDate: '2025-01-01T00:00:00Z',
        endDate: '2025-12-31T00:00:00Z',
        price: 210,
        status: 'activo',
      },
      history: [
        {
          id: 'jm-2024',
          name: 'Corporativo Base',
          startDate: '2024-01-01T00:00:00Z',
          endDate: '2024-12-31T00:00:00Z',
          status: 'finalizado',
          price: 165,
        },
      ],
      addons: [
        {
          id: 'jaddon-1',
          name: 'Locker premium',
          description: 'Locker 24/7',
          active: true,
          price: 15,
        },
      ],
      trials: [
        { id: 'jtrial-1', name: 'Entreno híbrido remoto', status: 'activo', endDate: '2025-11-20T00:00:00Z' },
      ],
    },
    training: {
      activeProgram: {
        name: 'Metcon híbrido',
        coach: 'María Gómez',
        startDate: '2025-09-15T00:00:00Z',
        endDate: '2025-12-15T00:00:00Z',
        completion: 46,
        missedSessions: 3,
      },
      keyMetrics: [
      { id: 'weight', label: 'Peso', value: '84.5 kg', trend: 'down' },
      { id: 'sleep', label: 'Horas de sueño', value: '6h 15m', trend: 'up' },
      { id: 'compliance', label: 'Adherencia 30 días', value: '54%', trend: 'down' },
    ],
      history: [
        { id: 'jt-1', name: 'Corporativo express', completion: 78, timeframe: 'Ene - Ago 2025' },
      ],
    },
    nutrition: {
      activePlan: {
        name: 'Plan energía ejecutivos',
        coach: 'Patricia Núñez',
        calories: 2200,
        macros: {
          protein: 150,
          carbs: 230,
          fats: 70,
        },
        compliance: 61,
        startDate: '2025-08-01T00:00:00Z',
        alerts: ['Enviar recordatorio de check-in semanal', 'Revisar cenas tardías'],
      },
      checkIns: [
        { id: 'jn-1', date: '2025-10-26T00:00:00Z', weight: '84,5 kg', notes: 'Semana con dos cenas de trabajo.' },
        { id: 'jn-2', date: '2025-10-12T00:00:00Z', weight: '85,0 kg' },
      ],
      restrictions: ['Sin restricciones médicas', 'Prefiere menú flexitariano'],
    },
    attendance: {
      weeklyAverage: 1.2,
      monthlyAverage: 5,
      preferredSchedule: 'L-M-V 07:00h (flexible)',
      entries: [
        { id: 'ja-1', date: '2025-10-24T09:10:00Z', type: 'entrenamiento', status: 'asistido', label: 'Metcon híbrido' },
        { id: 'ja-2', date: '2025-10-17T07:00:00Z', type: 'entrenamiento', status: 'asistido', label: 'Sesión PT' },
        { id: 'ja-3', date: '2025-10-10T07:00:00Z', type: 'entrenamiento', status: 'canceló', label: 'Sesión PT' },
      ],
      alerts: ['Ha reducido asistencia un 48% respecto al trimestre anterior.'],
      noShows: [
        { id: 'jns-1', className: 'Sesión PT', date: '2025-10-10T07:00:00Z' },
      ],
    },
    finances: {
      summary: {
        totalBilled: 1980,
        pending: 210,
        refunded: 0,
      },
      subscriptions: [
        {
          id: 'jsub-1',
          name: 'Corporativo Plus',
          amount: 210,
          status: 'pendiente',
          nextCharge: '2025-12-01T00:00:00Z',
        },
      ],
      invoices: [
        {
          id: 'jinv-1',
          concept: 'Cuota noviembre 2025',
          amount: 210,
          status: 'pendiente',
          date: '2025-11-01T00:00:00Z',
        },
        {
          id: 'jinv-2',
          concept: 'Pack PT adicional',
          amount: 90,
          status: 'pagado',
          date: '2025-09-15T00:00:00Z',
        },
      ],
      paymentMethods: [
        {
          id: 'jpm-1',
          type: 'mastercard',
          lastDigits: '5402',
          status: 'activo',
          primary: true,
        },
      ],
    },
    communications: {
      timeline: [
        {
          id: 'jcomm-1',
          channel: 'email',
          subject: 'Encuesta mensual',
          author: 'Equipo CX',
          date: '2025-10-30T07:50:00Z',
          outcome: 'Score 6, comentario sobre horarios',
        },
        {
          id: 'jcomm-2',
          channel: 'llamada',
          subject: 'Seguimiento adherencia',
          author: 'María Gómez',
          date: '2025-10-18T08:15:00Z',
          outcome: 'Sin respuesta, dejó nota para devolver llamada',
        },
      ],
      notes: [
        {
          id: 'jnote-1',
          author: 'Julián Cerezo',
          createdAt: '2025-10-31T09:10:00Z',
          content: 'Proponer horarios especiales corporate. Abrir slot 6:30 martes.',
        },
      ],
      templates: [
        { id: 'jtpl-1', name: 'Campaña retención 7 días', description: 'Secuencia de WhatsApp + email + llamada' },
      ],
    },
    satisfaction: {
      lastNps: 6,
      trend: 'down',
      surveys: [
        {
          id: 'jsat-1',
          name: 'Encuesta mensual Octubre',
          score: 6,
          date: '2025-10-30T07:50:00Z',
          comment: 'Costó agendar sesiones en horario temprano, agradecería slots extra.',
        },
      ],
      promoters: 0,
      detractors: 1,
    },
    documents: [
      {
        id: 'jdoc-1',
        name: 'Contrato corporativo 2025',
        type: 'contrato',
        status: 'firmado',
        updatedAt: '2025-01-01T00:00:00Z',
      },
      {
        id: 'jdoc-2',
        name: 'Anexo upgrade corporativo',
        type: 'contrato',
        status: 'pendiente',
        updatedAt: '2025-09-01T00:00:00Z',
      },
    ],
    automations: {
      rules: [
        {
          id: 'jauto-1',
          name: 'Campaña reactivación corporativa',
          description: 'Tras 2 ausencias seguidas → enviar secuencia 3 toques.',
          status: 'activa',
        },
      ],
      recommendations: [
        {
          id: 'jrec-1',
          message:
            'Riesgo alto por baja asistencia. Recomendado: llamada personalizada + oferta de horario exclusivo.',
          confidence: 0.88,
          actionLabel: 'Programar llamada',
        },
      ],
    },
  },
  'CL-1003': {
    header: {
      fullName: 'Nerea Vidal',
      avatarUrl: 'https://i.pravatar.cc/120?img=32',
      status: 'prueba',
      membership: {
        name: 'Trial 30 días',
        planType: 'Entrenamiento online + videollamadas',
        endDate: '2025-11-28T00:00:00Z',
        nextBillingDate: '2025-11-28T00:00:00Z',
      },
      branch: 'Barcelona - Diagonal',
      assignedTeam: {
        coach: 'Ana Duarte',
      },
      contact: {
        phone: '+34 699 887 230',
        email: 'nerea.vidal@example.com',
        address: 'Passeig de Gràcia 120, Barcelona',
      },
      tags: ['Trial', 'Online', 'PT'],
      indicators: {
        riskLevel: 'medio',
        satisfaction: {
          score: 85,
          label: 'Promotora',
        },
        totalValue: 630,
        monthlyValue: 79,
        attendance30Days: 6,
        primaryGoal: 'Tonificar y mejorar postura en home office',
      },
    },
    summary: {
      timeline: [
        {
          id: 'nevt-1',
          title: 'Registro a clases online',
          date: '2025-11-03T18:00:00Z',
          category: 'training',
          tone: 'info',
        },
        {
          id: 'nevt-2',
          title: 'Videollamada onboarding',
          description: 'Feedback muy positivo, interesada en plan híbrido.',
          date: '2025-10-31T10:00:00Z',
          category: 'communication',
          tone: 'success',
        },
      ],
      quickCards: [
        {
          id: 'goal-progress',
          title: 'Progreso objetivo',
          value: '25%',
          caption: 'Trial en curso',
          intent: 'neutral',
        },
        {
          id: 'training-compliance',
          title: 'Cumplimiento entreno',
          value: '92%',
          caption: 'Sesiones online',
          intent: 'positive',
        },
        {
          id: 'nutrition-compliance',
          title: 'Check-ins enviados',
          value: '3/4',
          caption: 'Plan nutricional remoto',
          intent: 'positive',
        },
        {
          id: 'payments-status',
          title: 'Trial',
          value: 'Gratis hasta 28/11',
          intent: 'neutral',
        },
      ],
      alerts: [
        {
          id: 'trial-alert',
          label: 'Trial finaliza en 20 días',
          level: 'info',
          description: 'Preparar propuesta de conversión a plan híbrido.',
          actionLabel: 'Crear propuesta',
        },
      ],
      shortcuts: [
        { id: 'convert-plan', label: 'Convertir a plan híbrido', description: 'Ofrecer pack PT + clases on-site' },
      ],
    },
    health: {
      personalData: [
        { label: 'Fecha de nacimiento', value: '15/04/1994' },
        { label: 'Talla', value: '1,65 m' },
      ],
      preferences: ['Entrenar desde casa', 'Sesiones cortas', 'Feedback por chat'],
      medicalNotes: [],
      alerts: [],
      documents: [
        { id: 'ndoc-1', name: 'Consentimiento digital', status: 'vigente' },
      ],
    },
    memberships: {
      currentPlan: {
        name: 'Trial 30 días',
        startDate: '2025-10-29T00:00:00Z',
        endDate: '2025-11-28T00:00:00Z',
        price: 0,
        status: 'activo',
      },
      history: [],
      addons: [],
      trials: [
        { id: 'ntrial-1', name: 'Trial 30 días', status: 'activo', endDate: '2025-11-28T00:00:00Z' },
      ],
    },
    training: {
      activeProgram: {
        name: 'Entreno en casa con bandas',
        coach: 'Ana Duarte',
        startDate: '2025-10-29T00:00:00Z',
        endDate: '2025-11-28T00:00:00Z',
        completion: 25,
        missedSessions: 0,
      },
      keyMetrics: [
        { id: 'compliance', label: 'Adherencia 14 días', value: '92%', trend: 'up' },
        { id: 'mobility', label: 'Movilidad', value: 'Mejora', trend: 'up' },
      ],
      history: [],
    },
    nutrition: {
      activePlan: {
        name: 'Plan remoto balanceado',
        coach: 'Leo Martín',
        calories: 1750,
        macros: {
          protein: 110,
          carbs: 200,
          fats: 55,
        },
        compliance: 80,
        startDate: '2025-10-29T00:00:00Z',
        alerts: ['Reforzar hidratación'],
      },
      checkIns: [
        { id: 'nn-1', date: '2025-11-04T00:00:00Z', weight: '58,1 kg' },
        { id: 'nn-2', date: '2025-10-29T00:00:00Z', weight: '58,7 kg', notes: 'Inicio plan' },
      ],
      restrictions: ['Vegetariana flexible', 'Evitar picante'],
    },
    attendance: {
      weeklyAverage: 2.5,
      monthlyAverage: 6,
      preferredSchedule: 'Sesiones asincrónicas + miércoles live 19h',
      entries: [
        { id: 'na-1', date: '2025-11-03T19:00:00Z', type: 'clase', status: 'asistido', label: 'Live fuerza full-body' },
        { id: 'na-2', date: '2025-10-31T19:00:00Z', type: 'comunicación', status: 'asistido', label: 'Videollamada onboarding' },
      ],
      alerts: [],
      noShows: [],
    },
    finances: {
      summary: {
        totalBilled: 0,
        pending: 0,
        refunded: 0,
      },
      subscriptions: [],
      invoices: [],
      paymentMethods: [],
    },
    communications: {
      timeline: [
        {
          id: 'ncomm-1',
          channel: 'whatsapp',
          subject: 'Seguimiento onboarding',
          author: 'Ana Duarte',
          date: '2025-11-03T09:10:00Z',
          outcome: 'Se siente motivada, pide propuestas híbridas.',
        },
      ],
      notes: [
        {
          id: 'nnote-1',
          author: 'Ana Duarte',
          createdAt: '2025-10-31T11:20:00Z',
          content: 'Muy buena actitud. Preparar propuesta para plan híbrido enero.',
        },
      ],
      templates: [
        { id: 'ntpl-1', name: 'Conversión trial a plan híbrido', description: 'Secuencia email + WhatsApp con oferta' },
      ],
    },
    satisfaction: {
      lastNps: 8,
      trend: 'up',
      surveys: [
        { id: 'nsat-1', name: 'Encuesta onboarding', score: 8, date: '2025-11-01T12:00:00Z' },
      ],
      promoters: 1,
      detractors: 0,
    },
    documents: [
      {
        id: 'ndoc-1',
        name: 'Consentimiento digital',
        type: 'consentimiento',
        status: 'firmado',
        updatedAt: '2025-10-29T00:00:00Z',
      },
    ],
    automations: {
      rules: [
        {
          id: 'nauto-1',
          name: 'Recordatorio fin de trial',
          description: '5 días antes del final del trial enviar WhatsApp + email con oferta.',
          status: 'activa',
        },
      ],
      recommendations: [
        {
          id: 'nrec-1',
          message: 'Alto compromiso en el trial. Recomendar plan híbrido con 1 sesión presencial semanal.',
          confidence: 0.76,
          actionLabel: 'Preparar oferta',
        },
      ],
    },
  },
};

export async function fetchClients(): Promise<Client360Summary[]> {
  await delay(200);
  return clientsMock;
}

export async function fetchClientProfile(clientId: string): Promise<ClientProfile | null> {
  await delay(220);
  return profilesMock[clientId] ?? null;
}

