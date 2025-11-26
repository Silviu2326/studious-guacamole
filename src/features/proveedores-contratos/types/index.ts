// Tipos para el módulo Proveedores & Contratos

export interface Supplier {
  id: string;
  name: string;
  category: string;
  status: 'approved' | 'pending_approval' | 'rejected' | 'archived';
  rating?: number;
  activeContracts: number;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  fiscalData?: {
    nif?: string;
    cif?: string;
    address?: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Contract {
  id: string;
  supplierId: string;
  supplier?: Supplier;
  startDate: string;
  endDate: string;
  documentUrl?: string;
  status: 'active' | 'expired' | 'archived';
  renewalAlertDays?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface SupplierDocument {
  id: string;
  supplierId: string;
  name: string;
  type: 'contract' | 'sla' | 'certification' | 'invoice' | 'proposal' | 'other';
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface SupplierReview {
  id: string;
  supplierId: string;
  rating: number;
  criteria?: {
    quality: number;
    price: number;
    service: number;
    punctuality: number;
    communication: number;
  };
  comments?: string;
  createdAt: string;
  createdBy: string;
}

export interface SuppliersFilter {
  status?: 'approved' | 'pending_approval' | 'rejected';
  category?: string;
  search?: string;
  ratingMin?: number;
  page?: number;
  limit?: number;
}

export interface SuppliersResponse {
  data: Supplier[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SupplierFormData {
  name: string;
  category: string;
  status: 'approved' | 'pending_approval' | 'rejected';
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  fiscalData?: {
    nif?: string;
    cif?: string;
    address?: string;
  };
  notes?: string;
}

export interface ContractFormData {
  supplierId: string;
  startDate: string;
  endDate: string;
  file?: File;
  renewalAlertDays?: number;
}

// Categorías de proveedores comunes
export const SUPPLIER_CATEGORIES = [
  'Equipamiento',
  'Mantenimiento',
  'Servicios',
  'Suplementos',
  'Limpieza',
  'Marketing',
  'Software',
  'Consultoría',
  'Otros',
] as const;

export type SupplierCategory = typeof SUPPLIER_CATEGORIES[number];

