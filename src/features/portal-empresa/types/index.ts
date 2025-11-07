// Tipos para el módulo Portal Empresa

export type EmployeeStatus = 'active' | 'invited' | 'inactive';

export interface Company {
  id: string;
  name: string;
  contact_person: string;
  contact_email: string;
  plan: CompanyPlan;
}

export interface CompanyPlan {
  id: string;
  name: string;
  max_employees: number;
  services: string[];
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  status: EmployeeStatus;
  joined_date: string;
}

export interface EmployeesListResponse {
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  data: Employee[];
}

export interface InvitationRequest {
  emails: string[];
}

export interface InvitationResponse {
  success_count: number;
  failed_count: number;
  details: Array<{
    email: string;
    status: 'sent' | 'failed';
    reason?: string;
  }>;
}

export interface EmployeeUpdateRequest {
  status: EmployeeStatus;
}

export interface AnalyticsData {
  adoption_rate: number;
  avg_attendance: number;
  active_employees_trend: Array<{
    month: string;
    count: number;
  }>;
  popular_classes: Array<{
    name: string;
    count: number;
  }>;
  usage_by_service: {
    [key: string]: number;
  };
}

export interface KPI {
  title: string;
  value: string | number;
  change?: number;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

