// Tipos para el módulo de Presupuestos & Forecast

export interface BudgetItem {
  itemId: string;
  category: string;
  type: 'income' | 'expense';
}

export interface MonthlyBudgetValue {
  budgeted: number;
  actual?: number;
  forecast?: number;
  deviation?: number;
}

export interface MonthlyValues {
  [month: string]: MonthlyBudgetValue;
}

export interface BudgetItemDetail extends BudgetItem {
  monthlyValues: MonthlyValues;
}

export interface BudgetDetail {
  budgetId: string;
  name: string;
  year: number;
  status: 'active' | 'draft' | 'archived';
  incomeItems: BudgetItemDetail[];
  expenseItems: BudgetItemDetail[];
  totalIncome?: {
    budgeted: number;
    actual: number;
    forecast: number;
  };
  totalExpenses?: {
    budgeted: number;
    actual: number;
    forecast: number;
  };
  netProfit?: {
    budgeted: number;
    actual: number;
    forecast: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface BudgetSummary {
  budgetId: string;
  name: string;
  year: number;
  status: 'active' | 'draft' | 'archived';
}

export interface BudgetGridData {
  category: string;
  type: 'income' | 'expense';
  jan?: MonthlyBudgetValue;
  feb?: MonthlyBudgetValue;
  mar?: MonthlyBudgetValue;
  apr?: MonthlyBudgetValue;
  may?: MonthlyBudgetValue;
  jun?: MonthlyBudgetValue;
  jul?: MonthlyBudgetValue;
  aug?: MonthlyBudgetValue;
  sep?: MonthlyBudgetValue;
  oct?: MonthlyBudgetValue;
  nov?: MonthlyBudgetValue;
  dec?: MonthlyBudgetValue;
  total?: MonthlyBudgetValue;
  itemId?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor?: string;
  }[];
}

export interface BudgetKPIs {
  totalDeviationPercentage: number;
  incomeDeviation: number;
  expenseDeviation: number;
  netProfitProjected: number;
  categoryCompliance: Array<{
    category: string;
    compliance: number;
  }>;
  ebitdaProjected: number;
}

export interface CreateBudgetRequest {
  name: string;
  year: number;
  fromTemplate?: string;
  incrementPercentage?: number;
}

export interface UpdateBudgetItemRequest {
  itemId: string;
  month: string;
  budgeted: number;
}

