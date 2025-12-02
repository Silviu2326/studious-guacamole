export type UserRole = 'entrenador' | 'gimnasio';

export type ServiceType = 
  | 'MEMBERSHIP'           // Membresía
  | 'SESSION_PACK'         // Paquete de sesiones
  | 'SINGLE_CLASS'         // Clase suelta
  | 'PRODUCT'              // Producto físico
  | 'CONSULTATION'         // Consulta
  | 'ONLINE_PROGRAM';      // Programa online

export type BillingType = 'ONE_TIME' | 'RECURRING';

export type RecurringInterval = 'MONTHLY' | 'QUARTERLY' | 'YEARLY';

export type TaxType = 'STANDARD' | 'REDUCED' | 'EXEMPT';

export interface Service {
  serviceId: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  currency: string;
  serviceType: ServiceType;
  isRecurring: boolean;
  billingType: BillingType;
  recurringInterval?: RecurringInterval;
  isActive: boolean;
  duration?: number; // en minutos para servicios con duración
  sessionCount?: number; // para paquetes
  taxRate?: number;
  taxType?: TaxType;
  sku?: string;
  requiresBooking?: boolean;
  requiresResources?: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface ServiceFormData {
  name: string;
  description?: string;
  category: string;
  price: number;
  currency: string;
  serviceType: ServiceType;
  isRecurring: boolean;
  billingType: BillingType;
  recurringInterval?: RecurringInterval;
  isActive: boolean;
  duration?: number;
  sessionCount?: number;
  taxRate?: number;
  taxType?: TaxType;
  sku?: string;
  requiresBooking?: boolean;
  requiresResources?: boolean;
  metadata?: Record<string, any>;
}

export interface ServicesResponse {
  data: Service[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateServiceRequest {
  name: string;
  description?: string;
  category: string;
  price: number;
  currency: string;
  serviceType: ServiceType;
  isRecurring: boolean;
  billingType: BillingType;
  recurringInterval?: RecurringInterval;
  isActive?: boolean;
  duration?: number;
  sessionCount?: number;
  taxRate?: number;
  taxType?: TaxType;
  sku?: string;
  requiresBooking?: boolean;
  requiresResources?: boolean;
  metadata?: Record<string, any>;
}

export interface UpdateServiceRequest {
  name?: string;
  description?: string;
  category?: string;
  price?: number;
  currency?: string;
  serviceType?: ServiceType;
  isRecurring?: boolean;
  billingType?: BillingType;
  recurringInterval?: RecurringInterval;
  isActive?: boolean;
  duration?: number;
  sessionCount?: number;
  taxRate?: number;
  taxType?: TaxType;
  sku?: string;
  requiresBooking?: boolean;
  requiresResources?: boolean;
  metadata?: Record<string, any>;
}

export interface ServiceFilters {
  searchTerm?: string;
  category?: string;
  status?: 'active' | 'inactive' | 'all';
  serviceType?: ServiceType;
  page?: number;
  limit?: number;
}

export interface ServiceStats {
  totalServices: number;
  activeServices: number;
  inactiveServices: number;
  revenueLast30Days: number;
  topServiceRevenue: {
    name: string;
    revenue: number;
  };
  topServiceSales: {
    name: string;
    sales: number;
  };
  categoryDistribution: Array<{
    category: string;
    count: number;
  }>;
  revenueByCategory: Array<{
    category: string;
    revenue: number;
  }>;
  averageTicketPrice: number;
}

export interface DeleteServiceResponse {
  status: string;
  message: string;
}

