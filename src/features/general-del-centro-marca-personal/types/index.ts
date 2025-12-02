export type UserRole = 'entrenador' | 'gimnasio';

export type ProfileType = 'gym' | 'trainer';

export type PaymentStatus = 'connected' | 'incomplete' | 'not_connected';

export interface BusinessHoursSlot {
  open: string;
  close: string;
}

export interface BusinessHours {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  slots: BusinessHoursSlot[];
  isClosed?: boolean;
}

export interface GeneralProfile {
  profileType: ProfileType;
  name: string;
  description?: string;
  logoUrl?: string;
  address?: string; // Solo para gimnasios
  phone?: string;
  maxCapacity?: number; // Solo para gimnasios
  specialties?: string[]; // Solo para entrenadores
  businessHours: BusinessHours[];
  paymentStatus: PaymentStatus;
  lastUpdated?: string;
}

export interface GeneralProfileFormData {
  name: string;
  description: string;
  address?: string;
  phone?: string;
  maxCapacity?: number;
  specialties?: string[];
  businessHours: BusinessHours[];
}

export interface ProfileCompleteness {
  percentage: number;
  missingFields: string[];
}

export interface LogoUploadResponse {
  success: boolean;
  logoUrl: string;
}

export interface StripeConnectResponse {
  redirectUrl: string;
}

