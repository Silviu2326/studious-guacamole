// Tipos para el módulo de Impuestos & Export Contable

export interface FiscalProfile {
  legalName: string;
  taxId: string;
  address: string;
  taxRegime: string;
  country: string;
}

export interface TaxSummary {
  totalGross: number;
  totalNet: number;
  totalVat: number;
  totalExpenses: number;
  netProfit: number; // totalGross - totalExpenses
  transactionCount: number;
  currency: string;
}

export interface AccountingExport {
  id: string;
  createdAt: string;
  generatedBy: string;
  dateRange: string;
  format: 'csv' | 'pdf' | 'a3' | 'sage50' | 'xlsx';
  status: 'pending' | 'completed' | 'failed';
  downloadUrl?: string;
}

export interface ExportRequest {
  dateFrom: string;
  dateTo: string;
  format: 'csv' | 'pdf' | 'a3' | 'sage50' | 'xlsx';
  reportType: 'simple' | 'detailedVat';
}

export interface ExportJob {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  message: string;
  statusUrl: string;
}

export type UserType = 'trainer' | 'gym';

// Tipos para la calculadora de impuestos
export interface TaxCalculationSettings {
  // Configuración de IVA
  vatRate: number; // Porcentaje de IVA (ej: 21 para 21%)
  vatEnabled: boolean; // Si está sujeto a IVA
  
  // Configuración de IRPF
  irpfRate: number; // Porcentaje de IRPF estimado (ej: 15 para 15%)
  irpfEnabled: boolean; // Si está sujeto a IRPF
  
  // Régimen fiscal
  taxRegime: 'General' | 'Simplificado' | 'Exento' | 'EstimacionObjetiva';
}

export interface TaxCalculation {
  // Datos de entrada
  grossIncome: number; // Ingresos brutos
  deductibleExpenses: number; // Gastos deducibles
  
  // Cálculos de IVA
  vatToPay: number; // IVA a pagar
  vatCollected: number; // IVA repercutido (cobrado a clientes)
  vatDeductible: number; // IVA deducible (de gastos)
  vatNet: number; // IVA neto (a pagar o devolver)
  
  // Cálculos de IRPF
  taxableBase: number; // Base imponible para IRPF
  irpfAmount: number; // Cantidad estimada de IRPF
  
  // Resumen
  netIncome: number; // Ingresos netos después de impuestos
  totalTaxes: number; // Total de impuestos (IVA + IRPF)
  
  // Configuración usada
  settings: TaxCalculationSettings;
}

// Tipos para el calendario fiscal y recordatorios
export interface TaxDeadline {
  id: string;
  model: '130' | '303' | '390' | '347' | 'other';
  modelName: string;
  description: string;
  quarter: 1 | 2 | 3 | 4;
  year: number;
  deadline: Date;
  reminderDate: Date; // 15 días antes del vencimiento
  status: 'pending' | 'completed' | 'overdue';
  isReminderSent?: boolean;
}

export interface FiscalCalendar {
  year: number;
  deadlines: TaxDeadline[];
}

export interface TaxReminder {
  id: string;
  deadlineId: string;
  userId: string;
  title: string;
  message: string;
  deadlineDate: Date;
  reminderDate: Date;
  isRead: boolean;
  createdAt: Date;
  type: 'quarterly_deadline';
  priority: 'high' | 'medium' | 'low';
}

// Tipos para el resumen anual
export interface QuarterlySummary {
  quarter: 1 | 2 | 3 | 4;
  year: number;
  totalGross: number;
  totalNet: number;
  totalVat: number;
  totalExpenses: number;
  netProfit: number;
  transactionCount: number;
  currency: string;
}

export interface AnnualSummary {
  year: number;
  totalGross: number;
  totalNet: number;
  totalVat: number;
  totalExpenses: number;
  netProfit: number;
  totalTaxes: number;
  quarterlyBreakdown: QuarterlySummary[];
  transactionCount: number;
  currency: string;
  averageMonthlyIncome: number;
  averageMonthlyExpenses: number;
  bestQuarter: number;
  worstQuarter: number;
}

// Tipos para gráficos de ingresos vs gastos
export interface MonthlyIncomeExpense {
  month: string; // Formato: "YYYY-MM" o nombre del mes
  monthNumber: number;
  year: number;
  income: number;
  expenses: number;
  balance: number; // income - expenses
  quarter: 1 | 2 | 3 | 4;
}

export interface IncomeExpenseChartData {
  monthlyData: MonthlyIncomeExpense[];
  categoryBreakdown?: {
    category: string;
    income: number;
    expenses: number;
  }[];
}

// Tipos para visualización de ingresos por tipo de servicio
export type IncomeSourceType = 
  | 'sesiones-presenciales'
  | 'sesiones-online'
  | 'planes-nutricionales'
  | 'consultas'
  | 'membresias'
  | 'productos'
  | 'otros';

export interface IncomeBySource {
  sourceType: IncomeSourceType;
  sourceName: string; // Nombre legible para mostrar
  totalIncome: number;
  percentage: number; // Porcentaje del total
  transactionCount: number;
  averageAmount: number;
  currency: string;
}

export interface IncomeBySourceSummary {
  totalIncome: number;
  sources: IncomeBySource[];
  period: {
    from: Date;
    to: Date;
  };
  currency: string;
}

// Tipos para el Dashboard de KPIs financieros
export interface FinancialDashboard {
  // KPIs principales
  monthlyNetProfit: number; // Beneficio neto mensual
  profitMargin: number; // Margen de beneficio (%)
  estimatedPendingTaxes: number; // Impuestos pendientes estimados
  availableAfterTaxes: number; // Dinero disponible después de impuestos
  currency: string;
  
  // Datos base para cálculos
  monthlyIncome: number; // Ingresos mensuales
  monthlyExpenses: number; // Gastos mensuales
  grossProfit: number; // Beneficio bruto (ingresos - gastos)
  
  // Alertas y problemas
  alerts: FinancialAlert[];
  
  // Período
  period: {
    from: Date;
    to: Date;
  };
  
  // Cálculos de impuestos
  taxCalculation?: TaxCalculation;
}

export interface FinancialAlert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  actionUrl?: string;
  actionLabel?: string;
}

