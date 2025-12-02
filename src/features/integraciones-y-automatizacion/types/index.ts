export type IntegrationStatus = 'connected' | 'disconnected' | 'error';
export type IntegrationCategory = 'payments' | 'calendars' | 'marketing' | 'communication' | 'health' | 'other';

export interface Integration {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  category: IntegrationCategory;
  status: IntegrationStatus;
  userIntegrationId?: string;
  lastSync?: Date | string;
  errorMessage?: string;
}

export interface UserIntegration {
  id: string;
  integrationId: string;
  userId: string;
  status: IntegrationStatus;
  settings: Record<string, any>;
  lastSync?: Date | string;
  errorMessage?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ConnectIntegrationRequest {
  integrationId: string;
}

export interface ConnectIntegrationResponse {
  authorizationUrl: string;
}

export interface IntegrationSettings {
  [key: string]: any;
}

export interface IntegrationStats {
  totalIntegrations: number;
  connectedIntegrations: number;
  failedIntegrations: number;
  lastSyncOverall?: Date | string;
}

export const INTEGRATION_CATEGORIES = {
  payments: 'Pagos',
  calendars: 'Calendarios',
  marketing: 'Marketing',
  communication: 'Comunicación',
  health: 'Salud',
  other: 'Otros',
} as const;

export const INTEGRATION_STATUS_COLORS = {
  connected: 'green',
  disconnected: 'gray',
  error: 'red',
} as const;

export const INTEGRATION_STATUS_LABELS = {
  connected: 'Conectado',
  disconnected: 'Desconectado',
  error: 'Error',
} as const;

