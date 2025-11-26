export interface LocationSummary {
  locationId: string;
  locationName: string;
  totalRevenue: number;
  newMembers: number;
  churnRate: number;
  activeMembers: number;
  avgClassAttendance: number;
  arpu?: number; // Average Revenue Per User (Ingreso Promedio por Miembro)
  facilityOccupancyRate?: number; // Tasa de Ocupación de las Instalaciones
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface LocationSummaryResponse {
  data: LocationSummary[];
}

export interface ExportRequest {
  format: 'csv' | 'pdf';
  dateRange: {
    startDate: string;
    endDate: string;
  };
  columns?: string[];
}

export interface Location {
  id: string;
  name: string;
  city?: string;
  country?: string;
}

export type SortKey = keyof LocationSummary;
export type SortDirection = 'asc' | 'desc';

export interface LocationAnalyticsState {
  data: LocationSummary[];
  locations: Location[];
  loading: boolean;
  error: string | null;
  dateRange: DateRange;
  sortColumn: SortKey | null;
  sortDirection: SortDirection;
}

