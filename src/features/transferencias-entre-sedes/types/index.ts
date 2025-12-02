// Tipos para el sistema de Transferencias Entre Sedes

export type TransferStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';

export interface Member {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  membershipType?: string;
  paymentStatus?: 'up_to_date' | 'pending' | 'overdue';
}

export interface Location {
  id: string;
  name: string;
  address?: string;
}

export interface Transfer {
  id: string;
  member: Member;
  originLocation: Location;
  destinationLocation: Location;
  status: TransferStatus;
  requestedDate: Date;
  effectiveDate: Date;
  approvedDate?: Date;
  approvedBy?: string;
  rejectionReason?: string;
  notes?: string;
  requestedBy: string;
  cancelDate?: Date;
  completedDate?: Date;
}

export interface CreateTransferRequest {
  memberId: string;
  destinationLocationId: string;
  effectiveDate: string; // ISO 8601
  notes?: string;
}

export interface UpdateTransferStatusRequest {
  status: 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
}

export interface TransferResponse {
  data: Transfer[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

export interface TransferFilters {
  status?: TransferStatus;
  originLocationId?: string;
  destinationLocationId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  page?: number;
  limit?: number;
}

export interface KPIData {
  totalTransfers: number;
  pendingTransfers: number;
  approvedTransfers: number;
  rejectedTransfers: number;
  completedTransfers: number;
  averageResolutionTime: number; // en horas
  approvalRate: number; // porcentaje
  topOriginLocations: Array<{ location: Location; count: number }>;
  topDestinationLocations: Array<{ location: Location; count: number }>;
  netTransferredRevenue: number;
}

