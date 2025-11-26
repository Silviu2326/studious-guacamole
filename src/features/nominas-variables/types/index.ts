// Tipos para el módulo de Nóminas & Variables

export interface Period {
  month: number; // 1-12
  year: number;
}

export interface PayrollVariable {
  type: 'pt_commission' | 'sales_commission' | 'class_bonus' | 'attendance_bonus' | 'other';
  amount: number;
  source_events?: number; // Número de eventos que generaron esta variable
  description?: string;
}

export interface PayrollAdjustment {
  adjustmentId: string;
  type: 'bonus' | 'deduction' | 'advance';
  amount: number;
  description: string;
  createdAt: string;
  createdBy: string;
}

export interface PayrollRunItem {
  employeeId: string;
  employeeName: string;
  basePay: number;
  variables: PayrollVariable[];
  adjustments: PayrollAdjustment[];
  total: number;
}

export interface PayrollRun {
  runId: string;
  period: Period;
  status: 'draft' | 'finalized';
  totalBase: number;
  totalVariables: number;
  totalDeductions: number;
  totalPayable: number;
  items: PayrollRunItem[];
  createdAt?: string;
  finalizedAt?: string;
}

export interface AdjustmentData {
  employeeId: string;
  type: 'bonus' | 'deduction' | 'advance';
  amount: number;
  description: string;
}

export interface PayrollProfile {
  profileId: string;
  employeeId: string;
  payType: 'fixed' | 'hourly';
  baseSalary?: number; // Para fixed
  hourlyRate?: number; // Para hourly
  variableRules: VariableRule[];
}

export interface VariableRule {
  ruleId: string;
  type: 'pt_commission' | 'sales_commission' | 'class_bonus' | 'attendance_bonus';
  commissionType: 'percentage' | 'fixed';
  value: number; // Porcentaje o monto fijo
  appliesTo: string; // 'all_sessions', 'specific_products', etc.
}

export interface GeneratePayrollRunRequest {
  period: Period;
}

export interface AddAdjustmentRequest {
  employeeId: string;
  type: 'bonus' | 'deduction' | 'advance';
  amount: number;
  description: string;
}

