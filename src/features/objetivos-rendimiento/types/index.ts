export type UserRole = 'entrenador' | 'gimnasio';

export interface Objective {
  id: string;
  title: string;
  description?: string;
  metric: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  status: 'not_started' | 'in_progress' | 'achieved' | 'at_risk' | 'failed';
  responsible?: string;
  category: string;
  progress: number; // 0-100
  createdAt: string;
  updatedAt: string;
}

export interface Metric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    period: string;
  };
  target?: number;
  category: string;
}

export interface PerformanceData {
  period: string;
  metrics: Metric[];
  objectives: Objective[];
  summary: {
    totalObjectives: number;
    achievedObjectives: number;
    inProgressObjectives: number;
    atRiskObjectives: number;
  };
}

export interface KPI {
  id: string;
  name: string;
  description?: string;
  metric: string;
  target?: number;
  unit: string;
  category: string;
  enabled: boolean;
  role: UserRole[];
}

export interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  objectiveId?: string;
  metricId?: string;
  severity: 'low' | 'medium' | 'high';
  createdAt: string;
  read: boolean;
}

export interface Report {
  id: string;
  title: string;
  type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  period: string;
  data: PerformanceData;
  generatedAt: string;
}

export interface ComparisonData {
  currentPeriod: PerformanceData;
  previousPeriod: PerformanceData;
  changes: {
    metric: string;
    current: number;
    previous: number;
    change: number;
    changePercent: number;
  }[];
}

export interface ObjectiveFilters {
  status?: Objective['status'];
  category?: string;
  responsible?: string;
  deadlineFrom?: string;
  deadlineTo?: string;
}

