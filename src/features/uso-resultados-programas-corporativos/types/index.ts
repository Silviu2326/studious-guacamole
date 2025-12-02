export interface CorporateClient {
  id: string;
  name: string;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface UsageData {
  totalCheckIns: number;
  activationRate: number;
  averageVisitsPerUser: number;
  activeUsers: number;
  totalEnrolled: number;
}

export interface TimeSeriesData {
  date: string;
  checkIns: number;
}

export interface ActivityData {
  name: string;
  checkIns: number;
  percentage: number;
}

export interface UsageFilters {
  clientId: string | null;
  dateRange: DateRange;
  granularity: 'day' | 'week' | 'month';
}

export interface DashboardState {
  selectedClientId: string | null;
  dateRange: DateRange;
  dashboardData: UsageData | null;
  timeSeriesData: TimeSeriesData[];
  activitiesData: ActivityData[];
  isLoading: boolean;
  error: Error | null;
}

export interface ReportRequest {
  clientId: string;
  format: 'pdf' | 'csv';
  dateRange: DateRange;
  metrics: string[];
}

