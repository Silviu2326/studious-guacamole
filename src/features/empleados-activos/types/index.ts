// Tipos e interfaces para el módulo de Empleados Activos

export type EmployeeStatus = 'active' | 'inactive';

export interface CorporateEmployee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  employeeExternalId?: string;
  status: EmployeeStatus;
  lastCheckIn: string | null;
  totalCheckIns: number;
  createdAt: string;
  updatedAt: string;
}

export interface CorporateEmployeesResponse {
  data: CorporateEmployee[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
  };
}

export interface EmployeeFilters {
  search?: string;
  status?: EmployeeStatus;
  page?: number;
  limit?: number;
}

export interface EmployeeKPIs {
  totalActive: number;
  utilizationRate: number;
  avgCheckInsPerEmployee: number;
  newEmployeesThisMonth: number;
  deactivatedThisMonth: number;
}

export interface BulkImportResult {
  status: 'success' | 'partial' | 'error';
  newEmployees: number;
  updatedEmployees: number;
  errors: Array<{
    line: number;
    email?: string;
    message: string;
  }>;
}

export interface EmployeeStatusUpdate {
  employeeId: string;
  status: EmployeeStatus;
}

