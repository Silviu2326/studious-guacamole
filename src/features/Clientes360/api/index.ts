export interface Client360Summary {
  id: string;
  name: string;
  email: string;
  membership: string;
  status: 'activo' | 'riesgo' | 'inactivo';
  lastVisit: string;
  assignedCoach: string;
  lifetimeValue: number;
  satisfactionScore: number;
}

export interface ClientProfile {
  biography: string;
  goals: string[];
  programs: Array<{
    id: string;
    name: string;
    progress: number;
    nextSession: string;
  }>;
  metrics: Array<{
    id: string;
    label: string;
    value: string;
    trend: 'up' | 'down' | 'neutral';
  }>;
}

export interface ClientPortalSettings {
  selfServiceEnabled: boolean;
  appAccess: 'full' | 'limited';
  nextSteps: string[];
  lastLogin: string;
  checklist: Array<{
    id: string;
    label: string;
    completed: boolean;
  }>;
}

export interface SatisfactionInsight {
  id: string;
  survey: string;
  score: number;
  comment?: string;
  submittedAt: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const clientsMock: Client360Summary[] = [
  {
    id: 'CL-1001',
    name: 'Laura Sánchez',
    email: 'laura.sanchez@example.com',
    membership: 'Premium 12 meses',
    status: 'activo',
    lastVisit: '2025-11-05T18:30:00Z',
    assignedCoach: 'Raúl Ortega',
    lifetimeValue: 1890,
    satisfactionScore: 92,
  },
  {
    id: 'CL-1002',
    name: 'Javier Ruiz',
    email: 'javier.ruiz@example.com',
    membership: 'Corporativo',
    status: 'riesgo',
    lastVisit: '2025-10-24T09:10:00Z',
    assignedCoach: 'María Gómez',
    lifetimeValue: 2450,
    satisfactionScore: 74,
  },
  {
    id: 'CL-1003',
    name: 'Nerea Vidal',
    email: 'nerea.vidal@example.com',
    membership: 'Mensual flexible',
    status: 'activo',
    lastVisit: '2025-11-06T07:45:00Z',
    assignedCoach: 'Ana Duarte',
    lifetimeValue: 630,
    satisfactionScore: 88,
  },
  {
    id: 'CL-1004',
    name: 'Samuel Pérez',
    email: 'samuel.perez@example.com',
    membership: 'PT 24 sesiones',
    status: 'inactivo',
    lastVisit: '2025-09-12T16:00:00Z',
    assignedCoach: 'Luis Pérez',
    lifetimeValue: 1280,
    satisfactionScore: 65,
  },
];

const profilesMock: Record<string, ClientProfile> = {
  'CL-1001': {
    biography:
      'Profesional de marketing con objetivo de reducir estrés y mejorar la composición corporal. Entrena 4 veces por semana.',
    goals: [
      'Reducir porcentaje de grasa al 20%',
      'Mejorar condición cardiovascular',
      'Mantener hábitos saludables en viajes',
    ],
    programs: [
      {
        id: 'PR-301',
        name: 'Funcional intensivo',
        progress: 72,
        nextSession: '2025-11-09T09:00:00Z',
      },
      {
        id: 'PR-124',
        name: 'Yoga & Mindfulness',
        progress: 38,
        nextSession: '2025-11-11T19:00:00Z',
      },
    ],
    metrics: [
      { id: 'bf', label: 'Grasa corporal', value: '24.1%', trend: 'down' },
      { id: 'strength', label: '1RM Sentadilla', value: '92 kg', trend: 'up' },
      { id: 'compliance', label: 'Adherencia 30 días', value: '87%', trend: 'neutral' },
    ],
  },
  'CL-1002': {
    biography:
      'Director financiero con poco tiempo disponible. Enfocado en mejorar energía y controlar el peso.',
    goals: ['Recuperar masa muscular', 'Dormir 7h diarias', 'Lograr 3 sesiones/semana'],
    programs: [
      {
        id: 'PR-512',
        name: 'Metcon híbrido',
        progress: 46,
        nextSession: '2025-11-13T07:00:00Z',
      },
    ],
    metrics: [
      { id: 'weight', label: 'Peso', value: '84.5 kg', trend: 'down' },
      { id: 'sleep', label: 'Horas de sueño', value: '6h 15m', trend: 'up' },
      { id: 'compliance', label: 'Adherencia 30 días', value: '54%', trend: 'down' },
    ],
  },
};

const portalSettingsMock: Record<string, ClientPortalSettings> = {
  'CL-1001': {
    selfServiceEnabled: true,
    appAccess: 'full',
    lastLogin: '2025-11-06T21:15:00Z',
    nextSteps: [
      'Solicitar feedback sobre la app móvil',
      'Invitar a programa de referidos premium',
    ],
    checklist: [
      { id: 'documents', label: 'Documentación firmada', completed: true },
      { id: 'waiver', label: 'Renovación póliza segura', completed: true },
      { id: 'billing', label: 'Método de pago actualizado', completed: false },
    ],
  },
  'CL-1002': {
    selfServiceEnabled: false,
    appAccess: 'limited',
    lastLogin: '2025-09-30T18:45:00Z',
    nextSteps: ['Activar recordatorios push', 'Ofrecer upgrade a plan híbrido'],
    checklist: [
      { id: 'documents', label: 'Documentación firmada', completed: true },
      { id: 'waiver', label: 'Renovación póliza segura', completed: false },
      { id: 'billing', label: 'Método de pago actualizado', completed: true },
    ],
  },
};

const satisfactionMock: Record<string, SatisfactionInsight[]> = {
  'CL-1001': [
    {
      id: 'SAT-01',
      survey: 'NPS Octubre',
      score: 9,
      comment: 'La comunicación con el coach es excelente, echo de menos más variedad en cardio.',
      submittedAt: '2025-10-21T12:00:00Z',
    },
    {
      id: 'SAT-02',
      survey: 'Encuesta de onboarding',
      score: 5,
      submittedAt: '2025-08-05T09:30:00Z',
    },
  ],
  'CL-1002': [
    {
      id: 'SAT-03',
      survey: 'Encuesta mensual',
      score: 6,
      comment: 'Costó agendar sesiones en horario temprano, agradecería slots extra.',
      submittedAt: '2025-10-30T07:50:00Z',
    },
  ],
};

export async function fetchClients(): Promise<Client360Summary[]> {
  await delay(250);
  return clientsMock;
}

export async function fetchClientProfile(clientId: string): Promise<ClientProfile | null> {
  await delay(250);
  return profilesMock[clientId] ?? null;
}

export async function fetchPortalSettings(clientId: string): Promise<ClientPortalSettings | null> {
  await delay(220);
  return portalSettingsMock[clientId] ?? null;
}

export async function fetchSatisfactionInsights(clientId: string): Promise<SatisfactionInsight[]> {
  await delay(220);
  return satisfactionMock[clientId] ?? [];
}

