// Tipos para el módulo de Parte Horaria / Fichajes

export interface Employee {
  id: string;
  name: string;
}

export interface TimeEntry {
  id: string;
  employee: Employee;
  clockIn: string; // ISO 8601
  clockOut: string | null; // ISO 8601 o null si está activo
  totalHours: number;
  isManual: boolean;
  status?: 'ongoing' | 'completed';
  audit?: {
    editedBy: string;
    editTimestamp: string;
    reason: string;
  };
}

export interface TimeEntryFilters {
  dateRange: {
    start: Date;
    end: Date;
  };
  employeeId?: string;
  page?: number;
}

export interface TimeEntriesResponse {
  data: TimeEntry[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

export interface TimeTrackingKPIs {
  activeEmployees: number;
  totalHoursMonth: number;
  overtimeHoursMonth: number;
  estimatedLaborCost: number;
  punctualityRate: string;
  manualEditsCount: number;
}

export interface ManualEntryFormData {
  employeeId: string;
  clockIn: string; // ISO 8601
  clockOut: string | null; // ISO 8601 o null
  reason: string; // Justificación obligatoria para ediciones manuales
}

export interface ClockInRequest {
  employeeId: string;
  timestamp: string; // ISO 8601
}

export interface UpdateEntryRequest {
  clockIn?: string; // ISO 8601
  clockOut?: string; // ISO 8601
  reason: string; // Justificación obligatoria
}

