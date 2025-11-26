/**
 * Tipos para integraciones de datos de salud (Apple Health, Google Fit, Garmin)
 */

export type HealthProvider = 'apple-health' | 'google-fit' | 'garmin';

export interface HealthIntegration {
  id: string;
  clientId: string;
  provider: HealthProvider;
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  connectedAt?: string;
  lastSyncAt?: string;
  nextSyncAt?: string;
  syncFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
  enabledMetrics: HealthMetricType[];
  accessToken?: string; // Encriptado en producción
  refreshToken?: string; // Encriptado en producción
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export type HealthMetricType = 
  | 'steps'
  | 'distance'
  | 'calories'
  | 'heart-rate'
  | 'active-energy'
  | 'workouts'
  | 'sleep'
  | 'weight'
  | 'body-fat'
  | 'muscle-mass'
  | 'vo2-max'
  | 'resting-heart-rate'
  | 'blood-pressure'
  | 'blood-glucose';

export interface HealthDataPoint {
  id: string;
  clientId: string;
  integrationId: string;
  metricType: HealthMetricType;
  value: number;
  unit: string;
  timestamp: string;
  source: HealthProvider;
  metadata?: Record<string, any>;
}

export interface HealthMetrics {
  clientId: string;
  date: string;
  steps?: number;
  distance?: number; // en metros
  calories?: number; // en kilocalorías
  activeEnergy?: number; // en kilocalorías
  heartRate?: {
    average: number;
    resting: number;
    max: number;
    min: number;
  };
  workouts?: HealthWorkout[];
  sleep?: {
    duration: number; // en minutos
    quality: 'poor' | 'fair' | 'good' | 'excellent';
    deepSleep: number; // en minutos
    remSleep: number; // en minutos
  };
  weight?: number; // en kg
  bodyFat?: number; // en porcentaje
  muscleMass?: number; // en kg
  vo2Max?: number;
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  bloodGlucose?: number; // en mg/dL
}

export interface HealthWorkout {
  id: string;
  type: string; // 'running', 'cycling', 'strength-training', etc.
  startTime: string;
  endTime: string;
  duration: number; // en minutos
  distance?: number; // en metros
  calories?: number; // en kilocalorías
  averageHeartRate?: number;
  maxHeartRate?: number;
  metadata?: Record<string, any>;
}

export interface HealthIntegrationStats {
  totalIntegrations: number;
  activeIntegrations: number;
  totalDataPoints: number;
  lastSyncDate?: string;
  metricsByProvider: Record<HealthProvider, number>;
  syncErrors: number;
}

export interface HealthDataAnalysis {
  clientId: string;
  period: 'week' | 'month' | 'quarter' | 'year';
  startDate: string;
  endDate: string;
  trends: {
    steps: TrendAnalysis;
    calories: TrendAnalysis;
    heartRate: TrendAnalysis;
    workouts: TrendAnalysis;
  };
  insights: string[];
  recommendations: string[];
}

export interface TrendAnalysis {
  current: number;
  previous: number;
  change: number; // porcentaje
  trend: 'increasing' | 'decreasing' | 'stable';
  significance: 'high' | 'medium' | 'low';
}

export interface ConnectHealthIntegrationRequest {
  clientId: string;
  provider: HealthProvider;
  syncFrequency?: 'realtime' | 'hourly' | 'daily' | 'weekly';
  enabledMetrics?: HealthMetricType[];
}

export interface SyncHealthDataRequest {
  integrationId: string;
  startDate?: string;
  endDate?: string;
  metrics?: HealthMetricType[];
}

export interface SyncHealthDataResponse {
  success: boolean;
  integrationId: string;
  dataPointsSynced: number;
  lastSyncAt: string;
  errors?: string[];
}

