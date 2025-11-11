export interface AgendaEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  location: string;
  type: 'clase' | 'evento' | 'sesion';
  attendees: number;
  capacity: number;
}

export interface OnlineReservationChannel {
  id: string;
  name: string;
  conversionRate: number;
  averageLeadTime: number;
  status: 'activo' | 'pausado';
  lastSync: string;
}

export interface WaitlistEntry {
  id: string;
  member: string;
  session: string;
  sessionDate: string;
  priority: 'alta' | 'media' | 'baja';
  notified: boolean;
}

export interface AbsenceRecord {
  id: string;
  member: string;
  session: string;
  reason?: string;
  date: string;
  followUpStatus: 'pendiente' | 'contactado' | 'resuelto';
}

export interface ChallengeEvent {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  registered: number;
  goal: string;
  status: 'planificado' | 'activo' | 'finalizado';
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const agendaEventsMock: AgendaEvent[] = [
  {
    id: 'EV-001',
    title: 'Bootcamp HIIT',
    start: '2025-11-08T09:00:00Z',
    end: '2025-11-08T10:00:00Z',
    location: 'Sala 1',
    type: 'clase',
    attendees: 18,
    capacity: 20,
  },
  {
    id: 'EV-002',
    title: 'Sesión de fisioterapia',
    start: '2025-11-08T11:00:00Z',
    end: '2025-11-08T11:45:00Z',
    location: 'Consultorio',
    type: 'sesion',
    attendees: 1,
    capacity: 1,
  },
  {
    id: 'EV-003',
    title: 'Workshop: Nutrición para maratonistas',
    start: '2025-11-10T18:00:00Z',
    end: '2025-11-10T19:30:00Z',
    location: 'Auditorio',
    type: 'evento',
    attendees: 42,
    capacity: 60,
  },
];

const onlineReservationsMock: OnlineReservationChannel[] = [
  {
    id: 'OR-01',
    name: 'App móvil',
    conversionRate: 0.42,
    averageLeadTime: 2.4,
    status: 'activo',
    lastSync: '2025-11-06T22:15:00Z',
  },
  {
    id: 'OR-02',
    name: 'Sitio web',
    conversionRate: 0.28,
    averageLeadTime: 3.8,
    status: 'activo',
    lastSync: '2025-11-06T21:40:00Z',
  },
  {
    id: 'OR-03',
    name: 'Widget corporativo',
    conversionRate: 0.17,
    averageLeadTime: 4.1,
    status: 'pausado',
    lastSync: '2025-10-29T16:00:00Z',
  },
];

const waitlistMock: WaitlistEntry[] = [
  {
    id: 'WL-1001',
    member: 'Ana Torres',
    session: 'Funcional Intensivo',
    sessionDate: '2025-11-09T19:00:00Z',
    priority: 'alta',
    notified: true,
  },
  {
    id: 'WL-1002',
    member: 'Carlos Méndez',
    session: 'Indoor Cycling',
    sessionDate: '2025-11-09T06:30:00Z',
    priority: 'media',
    notified: false,
  },
];

const absencesMock: AbsenceRecord[] = [
  {
    id: 'AB-01',
    member: 'Laura Sánchez',
    session: 'Pilates Reformer',
    date: '2025-11-05T07:00:00Z',
    reason: 'Avisó la noche anterior',
    followUpStatus: 'contactado',
  },
  {
    id: 'AB-02',
    member: 'Javier Ruiz',
    session: 'CrossTraining',
    date: '2025-11-02T18:00:00Z',
    followUpStatus: 'pendiente',
  },
];

const challengesMock: ChallengeEvent[] = [
  {
    id: 'CH-01',
    name: 'Reto 30 días - Fuerza',
    startDate: '2025-11-15T00:00:00Z',
    endDate: '2025-12-15T00:00:00Z',
    registered: 85,
    goal: 'Aumentar fuerza máxima un 10%',
    status: 'planificado',
  },
  {
    id: 'CH-02',
    name: 'Liga de equipos - HIIT',
    startDate: '2025-10-01T00:00:00Z',
    endDate: '2025-11-30T00:00:00Z',
    registered: 48,
    goal: 'Acumular 50 sesiones por equipo',
    status: 'activo',
  },
];

export async function fetchAgendaEvents(): Promise<AgendaEvent[]> {
  await delay(220);
  return agendaEventsMock;
}

export async function fetchOnlineReservations(): Promise<OnlineReservationChannel[]> {
  await delay(260);
  return onlineReservationsMock;
}

export async function fetchWaitlist(): Promise<WaitlistEntry[]> {
  await delay(200);
  return waitlistMock;
}

export async function fetchAbsences(): Promise<AbsenceRecord[]> {
  await delay(210);
  return absencesMock;
}

export async function fetchChallenges(): Promise<ChallengeEvent[]> {
  await delay(240);
  return challengesMock;
}

export type {
  AgendaEvent,
  OnlineReservationChannel,
  WaitlistEntry,
  AbsenceRecord,
  ChallengeEvent,
};







