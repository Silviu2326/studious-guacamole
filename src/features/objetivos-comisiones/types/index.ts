// Tipos para el módulo de Objetivos y Comisiones

export type IncentiveSchemeType = 'commission' | 'bonus';
export type SchemeStatus = 'active' | 'inactive';
export type CalculationType = 'percentage' | 'fixed';
export type KPIType = 'nps_avg' | 'retention_rate' | 'team_performance';
export type ObjectiveStatus = 'in_progress' | 'completed' | 'failed';
export type PeriodType = 'monthly' | 'quarterly' | 'yearly';

export interface CalculationRule {
  type: CalculationType;
  value: number;
}

export interface KPITarget {
  target_kpi: KPIType;
  threshold: {
    operator: 'gte' | 'lte' | 'eq';
    value: number;
  };
  period: PeriodType;
}

export interface ProductTarget {
  target_product_id: string;
  target_product_name?: string;
}

export interface IncentiveScheme {
  id: string;
  name: string;
  type: IncentiveSchemeType;
  status: SchemeStatus;
  rules: {
    calculation: CalculationRule;
  } & (ProductTarget | KPITarget);
  applies_to_roles: string[];
  created_at: string;
  updated_at?: string;
}

export interface Objective {
  id: string;
  employee_id: string;
  employee_name?: string;
  description: string;
  metric: string;
  target_value: number;
  current_value: number;
  due_date: string;
  status: ObjectiveStatus;
  created_at: string;
}

export interface Employee {
  id: string;
  name: string;
  avatarUrl?: string;
  role?: string;
}

export interface EmployeePerformance {
  employee: Employee;
  totalCommissions: number;
  totalBonuses: number;
  totalPayout: number;
  objectives: Array<{
    id: string;
    name: string;
    progress: number;
    target: number;
    status: ObjectiveStatus;
    due_date: string;
  }>;
}

export interface IncentivePayoutReport {
  summary: {
    total_payout: number;
    total_commissions: number;
    total_bonuses: number;
  };
  payouts_by_employee: Array<{
    employee_id: string;
    employee_name: string;
    total_payout: number;
    breakdown: {
      commissions: number;
      bonuses: number;
    };
  }>;
}

export interface ObjectiveAssignmentData {
  employee_ids: string[];
  description: string;
  metric: string;
  target_value: number;
  due_date: string;
}

