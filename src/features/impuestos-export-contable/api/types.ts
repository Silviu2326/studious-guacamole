// Tipos para el módulo de Impuestos & Export Contable

/**
 * ============================================================================
 * TIPOS DE ALTO NIVEL DEL MÓDULO DE IMPUESTOS Y EXPORT CONTABLE
 * ============================================================================
 * Estos tipos son utilizados principalmente en:
 * - TaxCalculator: Para cálculos fiscales y de impuestos
 * - FinancialDashboard: Para visualización de datos fiscales
 * - FiscalProfileForm: Para gestión del perfil fiscal
 * - AnnualSummary: Para resúmenes fiscales anuales
 * ============================================================================
 */

/**
 * Régimen fiscal aplicable
 * Utilizado en: PerfilFiscal, TaxCalculator
 */
export type RegimenFiscal = 
  | 'general'              // Régimen general
  | 'simplificado'        // Régimen simplificado
  | 'estimacion_objetiva' // Estimación objetiva (módulos)
  | 'exento';             // Exento de IVA

/**
 * Tipo de actividad económica
 * Utilizado en: PerfilFiscal, TaxCalculator
 */
export type TipoActividad = 
  | 'autonomo'            // Autónomo
  | 'sociedad_limitada'   // Sociedad Limitada
  | 'sociedad_anonima'    // Sociedad Anónima
  | 'comunidad_bienes'    // Comunidad de Bienes
  | 'sociedad_civil';     // Sociedad Civil

/**
 * Tipo de IVA aplicable
 * Utilizado en: PerfilFiscal, TaxCalculator
 */
export type TipoIVAFiscal = 
  | 'general'      // 21%
  | 'reducido'     // 10%
  | 'superreducido' // 4%
  | 'exento'       // Exento
  | 'no_sujeto';   // No sujeto

/**
 * Perfil fiscal del contribuyente
 * Utilizado en: FiscalProfileForm, TaxCalculator, FinancialDashboard
 */
export interface PerfilFiscal {
  regimenFiscal: RegimenFiscal; // Régimen fiscal aplicable
  tipoActividad: TipoActividad; // Tipo de actividad económica
  tipoIVA: TipoIVAFiscal; // Tipo de IVA aplicable
  retencionIRPF: number; // Porcentaje de retención de IRPF (ej: 15 para 15%)
  pais: string; // País (ej: "España")
  comunidadAutonomaOpcional?: string; // Comunidad autónoma (opcional, para España)
  observaciones?: string; // Observaciones adicionales sobre el perfil fiscal
  // Campos adicionales para compatibilidad
  legalName?: string; // Nombre legal (legacy)
  taxId?: string; // NIF/CIF (legacy)
  address?: string; // Dirección (legacy)
  country?: string; // País (legacy, usar pais)
  taxRegime?: string; // Régimen fiscal (legacy, usar regimenFiscal)
}

/**
 * Alias legacy para mantener compatibilidad
 * @deprecated Usar PerfilFiscal en nuevo código
 */
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

/**
 * Tramo de IRPF para cálculo progresivo
 * Utilizado en: ParametrosCalculoImpuestos, TaxCalculator
 */
export interface TramoIRPF {
  desde: number; // Base imponible desde (en euros)
  hasta?: number; // Base imponible hasta (en euros, undefined = sin límite)
  porcentaje: number; // Porcentaje de IRPF para este tramo (ej: 19 para 19%)
}

/**
 * Parámetros para el cálculo de impuestos
 * Utilizado en: TaxCalculator, FinancialDashboard
 */
export interface ParametrosCalculoImpuestos {
  anio: number; // Año fiscal
  trimestreOpcional?: number; // Trimestre (1-4) si es cálculo trimestral, opcional
  ingresos: number; // Total de ingresos del período
  gastos: number; // Total de gastos del período
  regimen: RegimenFiscal; // Régimen fiscal aplicable
  tipoIVA: TipoIVAFiscal; // Tipo de IVA aplicable
  tramosIRPF: TramoIRPF[]; // Tramos de IRPF para cálculo progresivo
}

// Tipos para la calculadora de impuestos (legacy)
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
export type TaxObligationType = 
  | 'iva_trimestral'      // IVA trimestral (Modelo 303)
  | 'irpf_trimestral'     // IRPF trimestral (Modelo 130)
  | 'declaracion_anual'   // Declaración anual (Modelo 100/390)
  | 'pago_fraccionado';   // Pagos fraccionados

export interface TaxDeadline {
  id: string;
  model: '130' | '303' | '390' | '347' | '100' | 'other';
  modelName: string;
  description: string;
  obligationType: TaxObligationType;
  quarter?: 1 | 2 | 3 | 4; // Solo para obligaciones trimestrales
  year: number;
  deadline: Date;
  reminderDate: Date; // 15 días antes del vencimiento
  status: 'pending' | 'completed' | 'overdue';
  isReminderSent?: boolean;
  isSubmitted?: boolean; // Estado de cumplimiento (presentado/no presentado)
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
  type: 'quarterly_deadline' | 'annual_declaration' | 'installment_payment';
  priority: 'high' | 'medium' | 'low';
  obligationType: TaxObligationType;
  daysUntilDeadline: number;
}

/**
 * Resumen fiscal anual completo
 * Utilizado en: AnnualSummary, TaxCalculator, FinancialDashboard
 */
export interface ResumenFiscalAnual {
  anio: number; // Año fiscal
  ingresosTotales: number; // Total de ingresos del año
  gastosTotales: number; // Total de gastos del año
  baseImponible: number; // Base imponible para IRPF (ingresos - gastos deducibles)
  ivaSoportado: number; // IVA soportado (de gastos)
  ivaRepercutido: number; // IVA repercutido (de ingresos)
  irpfEstimado: number; // IRPF estimado a pagar
  beneficio: number; // Beneficio neto (ingresos - gastos - impuestos)
  ratioDeducibilidad: number; // Ratio de deducibilidad (gastos deducibles / gastos totales) en porcentaje
}

// Tipos para el resumen anual (legacy)
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

/**
 * Alias legacy para mantener compatibilidad
 * @deprecated Usar ResumenFiscalAnual en nuevo código
 */
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

