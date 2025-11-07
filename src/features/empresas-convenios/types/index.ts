// Tipos e interfaces para el módulo de Empresas/Convenios

export type AgreementStatus = 'active' | 'expired' | 'pending' | 'expiringSoon';

export type DiscountType = 'percentage' | 'fixed';

export interface CorporateAgreement {
  id: string;
  companyName: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  status: AgreementStatus;
  discountType: DiscountType;
  discountValue: number;
  validFrom: string;
  validUntil: string;
  memberCount: number;
  applicablePlans?: string[];
  createdAt: string;
  updatedAt: string;
  analytics?: AgreementAnalytics;
}

export interface AgreementAnalytics {
  totalMembers: number;
  activeMembersLast30Days: number;
  totalCheckIns: number;
  utilizationRate?: number;
}

export interface AgreementFormData {
  companyName: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  discountType: DiscountType;
  discountValue: number;
  validFrom: string;
  validUntil: string;
  applicablePlans?: string[];
}

export interface AgreementsResponse {
  data: CorporateAgreement[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AgreementFilters {
  status?: AgreementStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AgreementMembersResponse {
  userId: string;
  fullName: string;
  email: string;
  membershipStatus: 'active' | 'inactive' | 'suspended';
  lastCheckIn: string | null;
}

