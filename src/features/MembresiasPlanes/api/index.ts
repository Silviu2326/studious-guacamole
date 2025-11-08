export interface PlanSummary {
  id: string;
  name: string;
  price: number;
  billingCycle: 'mensual' | 'trimestral' | 'anual';
  features: string[];
  activeMembers: number;
  status: 'activo' | 'pausado';
}

export interface ActiveMembership {
  id: string;
  memberName: string;
  planName: string;
  startDate: string;
  renewalDate: string;
  status: 'activa' | 'morosidad' | 'en_revision';
  value: number;
}

export interface RenewalInsight {
  id: string;
  memberName: string;
  planName: string;
  nextAction: string;
  renewalDate: string;
  churnRisk: 'alto' | 'medio' | 'bajo';
  reason?: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const planCatalogMock: PlanSummary[] = [
  {
    id: 'PL-001',
    name: 'Premium 12 meses',
    price: 89,
    billingCycle: 'mensual',
    features: ['Acceso ilimitado', 'Sesiones PT x2', 'SPA & Wellness'],
    activeMembers: 132,
    status: 'activo',
  },
  {
    id: 'PL-002',
    name: 'Flexible trimestral',
    price: 65,
    billingCycle: 'mensual',
    features: ['Reservas ilimitadas', 'Acceso fin de semana', 'App móvil'],
    activeMembers: 87,
    status: 'activo',
  },
  {
    id: 'PL-003',
    name: 'Corporativo empresas',
    price: 59,
    billingCycle: 'mensual',
    features: ['Condiciones B2B', 'Dashboard HR', 'Soporte dedicado'],
    activeMembers: 240,
    status: 'activo',
  },
  {
    id: 'PL-004',
    name: 'Clases ilimitadas',
    price: 75,
    billingCycle: 'mensual',
    features: ['CrossTraining', 'Cycling', 'Yoga'],
    activeMembers: 54,
    status: 'pausado',
  },
];

const activeMembershipsMock: ActiveMembership[] = [
  {
    id: 'MB-101',
    memberName: 'Laura Sánchez',
    planName: 'Premium 12 meses',
    startDate: '2025-01-12T00:00:00Z',
    renewalDate: '2025-12-12T00:00:00Z',
    status: 'activa',
    value: 89,
  },
  {
    id: 'MB-102',
    memberName: 'Javier Ruiz',
    planName: 'Flexible trimestral',
    startDate: '2025-09-15T00:00:00Z',
    renewalDate: '2025-12-15T00:00:00Z',
    status: 'morosidad',
    value: 65,
  },
  {
    id: 'MB-103',
    memberName: 'Nerea Vidal',
    planName: 'Clases ilimitadas',
    startDate: '2025-07-01T00:00:00Z',
    renewalDate: '2025-10-01T00:00:00Z',
    status: 'en_revision',
    value: 75,
  },
  {
    id: 'MB-104',
    memberName: 'Robert Castillo',
    planName: 'Corporativo empresas',
    startDate: '2025-03-01T00:00:00Z',
    renewalDate: '2025-12-01T00:00:00Z',
    status: 'activa',
    value: 59,
  },
];

const renewalsMock: RenewalInsight[] = [
  {
    id: 'RN-01',
    memberName: 'Javier Ruiz',
    planName: 'Flexible trimestral',
    renewalDate: '2025-12-15T00:00:00Z',
    nextAction: 'Llamar para actualizar pago',
    churnRisk: 'alto',
    reason: 'Morosidad > 14 días',
  },
  {
    id: 'RN-02',
    memberName: 'Nerea Vidal',
    planName: 'Clases ilimitadas',
    renewalDate: '2025-10-01T00:00:00Z',
    nextAction: 'Enviar oferta upgrade PT',
    churnRisk: 'medio',
    reason: 'Asistencia a clases 1/sem',
  },
  {
    id: 'RN-03',
    memberName: 'Laura Sánchez',
    planName: 'Premium 12 meses',
    renewalDate: '2025-12-12T00:00:00Z',
    nextAction: 'Reunión con coach',
    churnRisk: 'bajo',
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

export type { PlanSummary, ActiveMembership, RenewalInsight };

