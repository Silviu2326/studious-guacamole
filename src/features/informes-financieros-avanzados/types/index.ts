// Tipos para Informes Financieros Avanzados

export interface Location {
  id: string;
  name: string;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface Filters {
  dateRange: DateRange;
  locationIds: string[];
}

export interface KPISummary {
  mrr: {
    current: number;
    change: number;
  };
  revenueChurnRate: {
    current: number;
    change: number;
  };
  ltv: {
    current: number;
    change: number;
  };
  cac: {
    current: number;
    change: number;
  };
  averageTicketPerMember?: {
    current: number;
    change: number;
  };
  averageTicketPerLocation?: {
    current: number;
    change: number;
  };
  grossMargin?: {
    current: number;
    change: number;
  };
  mrrGrowthRate?: {
    current: number;
    change: number;
  };
}

export interface MRREvolutionData {
  date: string;
  mrr: number;
}

export interface ServiceProfitability {
  serviceId: string;
  serviceName: string;
  totalRevenue: number;
  directCosts: number;
  grossMargin: number;
}

export interface FinancialReport {
  kpis: KPISummary;
  mrrEvolution: MRREvolutionData[];
  serviceProfitability: ServiceProfitability[];
}

