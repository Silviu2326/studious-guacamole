// Tipos para el módulo Cliente 360
export interface Client360 {
  id: string;
  personalInfo: PersonalInfo;
  membership: Membership;
  kpis: ClientKPIs;
  recentActivity: Activity[];
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other';
}

export interface Membership {
  planName: string;
  status: 'active' | 'pending' | 'expired' | 'frozen';
  startDate: string;
  endDate?: string;
}

export interface ClientKPIs {
  ltv: number;
  attendanceRate30d: number;
  daysSinceLastVisit: number;
  outstandingBalance: number;
  totalSessions?: number;
  adherenceRate?: number;
}

export interface Activity {
  id: string;
  date: string;
  type: 'check-in' | 'workout' | 'payment' | 'plan-change' | 'note' | 'message';
  description: string;
  metadata?: Record<string, any>;
}

export interface WorkoutHistory {
  id: string;
  date: string;
  exercises: ExerciseRecord[];
  duration: number;
  notes?: string;
}

export interface ExerciseRecord {
  exerciseId: string;
  exerciseName: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
}

export interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  type: 'membership' | 'session' | 'product' | 'refund';
  status: 'paid' | 'pending' | 'failed';
  method: 'card' | 'cash' | 'transfer' | 'other';
  invoiceUrl?: string;
}

export interface BodyMeasurement {
  id: string;
  date: string;
  weightKg?: number;
  bodyFatPercentage?: number;
  muscleMassKg?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  arms?: number;
  legs?: number;
  notes?: string;
}

export interface ClientNote {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  tags?: string[];
  isPrivate: boolean;
}

