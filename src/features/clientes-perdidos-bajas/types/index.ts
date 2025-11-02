export type UserType = 'gym' | 'trainer';

export interface ChurnedClient {
  id: string;
  name: string;
  email: string;
  cancellationDate: string;
  reason: string;
  plan: string;
  trainerId?: string;
  trainerName?: string;
  subscriptionId?: string;
  notes?: string;
  documentUrl?: string; // Solo para gimnasios
}

export interface ChurnStats {
  customerChurnRate: number; // Porcentaje
  mrrChurnRate: number; // Porcentaje
  totalCancellations: number;
  reasonsDistribution: ReasonDistribution[];
  averageLtvOfChurned: number;
  topPlansByChurn?: PlanChurnData[];
}

export interface ReasonDistribution {
  reason: string;
  count: number;
}

export interface PlanChurnData {
  plan: string;
  cancellations: number;
  churnRate: number;
}

export interface CancellationReason {
  id: string;
  label: string;
  type: 'formal' | 'informal';
  category?: string;
}

export interface CancellationData {
  clientId: string;
  reasonId: string;
  cancellationDate: string;
  notes?: string;
  document?: File; // Solo para gimnasios
}

export interface ChurnedClientsFilters {
  startDate?: string;
  endDate?: string;
  reasonId?: string;
  page?: number;
  limit?: number;
}

export interface ChurnedClientsResponse {
  data: ChurnedClient[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CancellationFormData {
  reasonId: string;
  cancellationDate: string;
  notes?: string;
  document?: File;
}
