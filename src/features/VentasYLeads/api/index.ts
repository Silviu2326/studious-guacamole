import type {
  LeadOpportunity,
  LeadSegment,
  PipelineStage,
  SalesMetric,
} from './types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const salesMetricsMock: SalesMetric[] = [
  {
    id: 'monthly-revenue',
    title: 'Ingresos proyectados',
    value: 48200,
    subtitle: 'Contratos ganados este mes',
    trend: {
      direction: 'up',
      value: 12.4,
      label: 'vs. mes anterior',
    },
  },
  {
    id: 'lead-to-sale',
    title: 'Lead → Venta',
    value: 32,
    subtitle: 'Tasa de conversión global',
    trend: {
      direction: 'up',
      value: 4.1,
      label: 'Últimos 30 días',
    },
  },
  {
    id: 'pipeline-value',
    title: 'Valor del pipeline',
    value: 127800,
    subtitle: 'Oportunidades abiertas',
    trend: {
      direction: 'neutral',
      value: 0.8,
      label: 'Variación semanal',
    },
  },
  {
    id: 'lead-response',
    title: 'Tiempo de respuesta',
    value: 47,
    subtitle: 'Minutos promedio',
    trend: {
      direction: 'down',
      value: 6.2,
      label: 'Necesita seguimiento',
    },
  },
];

const pipelineStagesMock: PipelineStage[] = [
  {
    id: 'lead',
    label: 'Lead captado',
    conversionRate: 1,
    deals: 460,
    velocityDays: 2.2,
  },
  {
    id: 'qualified',
    label: 'Lead cualificado',
    conversionRate: 0.56,
    deals: 256,
    velocityDays: 3.9,
  },
  {
    id: 'proposal',
    label: 'Propuesta enviada',
    conversionRate: 0.34,
    deals: 156,
    velocityDays: 4.5,
  },
  {
    id: 'negotiation',
    label: 'Negociación',
    conversionRate: 0.18,
    deals: 82,
    velocityDays: 6.1,
  },
  {
    id: 'won',
    label: 'Venta ganada',
    conversionRate: 0.11,
    deals: 51,
    velocityDays: 2.7,
  },
];

const leadOpportunitiesMock: LeadOpportunity[] = [
  {
    id: 'OP-1024',
    name: 'Plan Premium Corporativo - InovaTech',
    source: 'Referidos',
    owner: 'María Gómez',
    status: 'en_progreso',
    value: 9800,
    createdAt: '2025-10-28T09:30:00Z',
    nextAction: 'Demo final con comité (12/11)',
    probability: 0.7,
  },
  {
    id: 'OP-1025',
    name: 'Abono Familiar - Hermano Mayor',
    source: 'Landing Pages',
    owner: 'Luis Pérez',
    status: 'nuevo',
    value: 420,
    createdAt: '2025-11-03T15:20:00Z',
    nextAction: 'Llamada de calificación',
    probability: 0.25,
  },
  {
    id: 'OP-1026',
    name: 'Plan Empresas PyME - Creativa Studio',
    source: 'Outbound',
    owner: 'María Gómez',
    status: 'en_progreso',
    value: 5600,
    createdAt: '2025-10-18T11:00:00Z',
    nextAction: 'Ajustar propuesta económica',
    probability: 0.55,
  },
  {
    id: 'OP-1027',
    name: 'Plan 12 meses - Individual',
    source: 'Redes Sociales',
    owner: 'Ana Duarte',
    status: 'ganado',
    value: 780,
    createdAt: '2025-09-30T10:10:00Z',
    nextAction: 'Onboarding inicial',
    probability: 1,
  },
  {
    id: 'OP-1028',
    name: 'Plan Premium - Deportista Elite',
    source: 'Eventos',
    owner: 'Luis Pérez',
    status: 'en_progreso',
    value: 1500,
    createdAt: '2025-11-01T16:45:00Z',
    nextAction: 'Envío de plan personalizado',
    probability: 0.4,
  },
];

const leadSegmentsMock: LeadSegment[] = [
  {
    id: 'corporate',
    label: 'Empresas & convenios',
    description: 'Organizaciones buscando programas corporativos de bienestar',
    totalLeads: 42,
    conversionRate: 0.38,
    averageValue: 8200,
  },
  {
    id: 'high-value',
    label: 'Altos ingresos',
    description: 'Leads con ticket promedio > 100€/mes',
    totalLeads: 128,
    conversionRate: 0.27,
    averageValue: 1450,
  },
  {
    id: 'digital',
    label: 'Captados digitalmente',
    description: 'Leads provenientes de campañas digitales',
    totalLeads: 320,
    conversionRate: 0.19,
    averageValue: 640,
  },
  {
    id: 'referrals',
    label: 'Referidos',
    description: 'Leads recomendados por clientes activos',
    totalLeads: 86,
    conversionRate: 0.46,
    averageValue: 980,
  },
];

export async function fetchSalesMetrics(): Promise<SalesMetric[]> {
  await delay(320);
  return salesMetricsMock;
}

export async function fetchPipelineStages(): Promise<PipelineStage[]> {
  await delay(280);
  return pipelineStagesMock;
}

export async function fetchLeadOpportunities(): Promise<LeadOpportunity[]> {
  await delay(360);
  return leadOpportunitiesMock;
}

export async function fetchLeadSegments(): Promise<LeadSegment[]> {
  await delay(300);
  return leadSegmentsMock;
}

export type { LeadOpportunity, LeadSegment, PipelineStage, SalesMetric } from './types';

