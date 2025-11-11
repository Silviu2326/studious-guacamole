export interface FinancialMetric {
  id: string;
  label: string;
  value: number | string;
  delta?: number;
  trend?: 'up' | 'down' | 'neutral';
}

export interface InvoiceSummary {
  id: string;
  client: string;
  amount: number;
  status: 'pendiente' | 'pagada' | 'vencida';
  issuedAt: string;
  dueAt: string;
}

export interface SubscriptionSummary {
  id: string;
  memberName: string;
  planName: string;
  billingCycle: 'mensual' | 'trimestral' | 'anual';
  value: number;
  status: 'activa' | 'en_pausa' | 'morosidad';
}

export interface ExpenseRecord {
  id: string;
  vendor: string;
  category: string;
  amount: number;
  paidAt: string;
  status: 'pagado' | 'pendiente';
}

export interface CashFlowEntry {
  id: string;
  account: string;
  balance: number;
  lastMovement: string;
  variation: number;
}

export interface ForecastEntry {
  id: string;
  period: string;
  projectedRevenue: number;
  projectedExpenses: number;
  confidence: number;
}

export interface TaxExportRecord {
  id: string;
  document: string;
  amount: number;
  status: 'preparado' | 'enviado' | 'validado';
  submittedAt?: string;
}

export interface DynamicPricingInsight {
  id: string;
  product: string;
  lastChange: string;
  impact: 'positivo' | 'neutral' | 'negativo';
  recommendation: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const overviewMetricsMock: FinancialMetric[] = [
  { id: 'revenue', label: 'Ingresos últimos 30 días', value: 98200, delta: 12.3, trend: 'up' },
  { id: 'expenses', label: 'Gastos últimos 30 días', value: 42680, delta: 5.4, trend: 'down' },
  { id: 'cash-flow', label: 'Flujo de caja neto', value: 55520, delta: 8.1, trend: 'up' },
  { id: 'mrr', label: 'MRR', value: 18620, delta: 3.7, trend: 'up' },
];

const invoicesMock: InvoiceSummary[] = [
  {
    id: 'INV-1001',
    client: 'Laura Sánchez',
    amount: 189,
    status: 'pendiente',
    issuedAt: '2025-11-05T12:00:00Z',
    dueAt: '2025-11-12T12:00:00Z',
  },
  {
    id: 'INV-1002',
    client: 'InovaTech S.A.',
    amount: 2450,
    status: 'pagada',
    issuedAt: '2025-10-20T10:00:00Z',
    dueAt: '2025-10-27T10:00:00Z',
  },
  {
    id: 'INV-1003',
    client: 'Javier Ruiz',
    amount: 210,
    status: 'vencida',
    issuedAt: '2025-09-18T09:00:00Z',
    dueAt: '2025-09-25T09:00:00Z',
  },
];

const subscriptionsMock: SubscriptionSummary[] = [
  {
    id: 'SUB-01',
    memberName: 'Ana Torres',
    planName: 'Premium 12 meses',
    billingCycle: 'mensual',
    value: 89,
    status: 'activa',
  },
  {
    id: 'SUB-02',
    memberName: 'Creativa Studio',
    planName: 'Corporativo empresas',
    billingCycle: 'mensual',
    value: 59,
    status: 'activa',
  },
  {
    id: 'SUB-03',
    memberName: 'Carlos Méndez',
    planName: 'Flexible trimestral',
    billingCycle: 'mensual',
    value: 65,
    status: 'morosidad',
  },
];

const expensesMock: ExpenseRecord[] = [
  {
    id: 'EXP-001',
    vendor: 'Rent HQ',
    category: 'Infraestructura',
    amount: 1820,
    paidAt: '2025-11-03T12:00:00Z',
    status: 'pagado',
  },
  {
    id: 'EXP-002',
    vendor: 'Energy Flow',
    category: 'Servicios',
    amount: 430,
    paidAt: '2025-11-05T18:00:00Z',
    status: 'pendiente',
  },
  {
    id: 'EXP-003',
    vendor: 'Fit Equip',
    category: 'Equipamiento',
    amount: 2890,
    paidAt: '2025-10-28T09:30:00Z',
    status: 'pagado',
  },
];

const cashFlowMock: CashFlowEntry[] = [
  {
    id: 'CF-001',
    account: 'Caja central',
    balance: 14200,
    lastMovement: '2025-11-07T19:45:00Z',
    variation: 6.2,
  },
  {
    id: 'CF-002',
    account: 'Banco principal',
    balance: 68450,
    lastMovement: '2025-11-06T16:10:00Z',
    variation: 2.1,
  },
  {
    id: 'CF-003',
    account: 'Stripe pagos online',
    balance: 12890,
    lastMovement: '2025-11-07T21:00:00Z',
    variation: -1.4,
  },
];

const forecastMock: ForecastEntry[] = [
  {
    id: 'FC-01',
    period: 'Nov 2025',
    projectedRevenue: 101200,
    projectedExpenses: 46200,
    confidence: 0.78,
  },
  {
    id: 'FC-02',
    period: 'Dic 2025',
    projectedRevenue: 108400,
    projectedExpenses: 49800,
    confidence: 0.72,
  },
];

const taxExportsMock: TaxExportRecord[] = [
  {
    id: 'TX-001',
    document: 'Libro IVA',
    amount: 8200,
    status: 'preparado',
  },
  {
    id: 'TX-002',
    document: 'Modelo 347',
    amount: 12500,
    status: 'enviado',
    submittedAt: '2025-10-31T08:00:00Z',
  },
];

const dynamicPricingMock: DynamicPricingInsight[] = [
  {
    id: 'DP-001',
    product: 'Plan Premium',
    lastChange: '2025-11-02T10:00:00Z',
    impact: 'positivo',
    recommendation: 'Mantener ajuste +5% hasta cierre Q4',
  },
  {
    id: 'DP-002',
    product: 'Clases ilimitadas',
    lastChange: '2025-10-26T15:00:00Z',
    impact: 'neutral',
    recommendation: 'Test A/B con descuento temporal',
  },
  {
    id: 'DP-003',
    product: 'Plan Corporativo',
    lastChange: '2025-11-05T08:30:00Z',
    impact: 'negativo',
    recommendation: 'Revertir cambio y analizar feedback B2B',
  },
];

export async function fetchOverviewMetrics(): Promise<FinancialMetric[]> {
  await delay(200);
  return overviewMetricsMock;
}

export async function fetchInvoiceSummaries(): Promise<InvoiceSummary[]> {
  await delay(240);
  return invoicesMock;
}

export async function fetchSubscriptionSummaries(): Promise<SubscriptionSummary[]> {
  await delay(220);
  return subscriptionsMock;
}

export async function fetchExpenseRecords(): Promise<ExpenseRecord[]> {
  await delay(210);
  return expensesMock;
}

export async function fetchCashFlowEntries(): Promise<CashFlowEntry[]> {
  await delay(190);
  return cashFlowMock;
}

export async function fetchForecastEntries(): Promise<ForecastEntry[]> {
  await delay(230);
  return forecastMock;
}

export async function fetchTaxExportRecords(): Promise<TaxExportRecord[]> {
  await delay(200);
  return taxExportsMock;
}

export async function fetchDynamicPricingInsights(): Promise<DynamicPricingInsight[]> {
  await delay(210);
  return dynamicPricingMock;
}

export type {
  InvoiceSummary,
  FinancialMetric,
  SubscriptionSummary,
  ExpenseRecord,
  CashFlowEntry,
  ForecastEntry,
  TaxExportRecord,
  DynamicPricingInsight,
};









