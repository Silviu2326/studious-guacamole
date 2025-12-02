// Tipos para el módulo de Feedback Interno y Evaluaciones de Rendimiento

export interface PerformanceReview {
  id: string;
  staffMemberId: string;
  staffMemberName: string;
  reviewerName: string;
  reviewDate: string;
  status: 'draft' | 'completed' | 'in_progress' | 'disputed';
  overallScore: number | null;
  templateId: string;
  scores: ReviewScore[];
  createdAt: string;
  completedAt?: string;
  comments?: string;
  employeeComments?: string;
}

export interface ReviewScore {
  kpiId: string;
  score: number | null;
  comment: string;
}

export interface ReviewTemplate {
  id: string;
  name: string;
  description?: string;
  kpis: KPI[];
  createdAt: string;
}

export interface KPI {
  id: string;
  name: string;
  description?: string;
  type: 'quantitative' | 'qualitative';
  weight?: number;
  target?: number;
  unit?: string;
}

export interface TrainerPerformanceSummary {
  staffMemberId: string;
  name: string;
  avatarUrl?: string;
  avgClientRating: number;
  clientRetentionRate: number;
  goalCompletionRate: number;
  pendingReviews: number;
  completedReviews: number;
  avgClassAttendance?: number;
  performanceTrend?: number;
  lastReviewDate?: string;
}

export interface InternalFeedback {
  id: string;
  staffMemberId: string;
  staffMemberName: string;
  reviewerId: string;
  reviewerName: string;
  type: 'observation' | 'compliment' | 'concern' | 'suggestion';
  content: string;
  date: string;
  isUrgent: boolean;
}

export interface ClientFeedback {
  id: string;
  staffMemberId: string;
  rating: number;
  comment: string;
  date: string;
  sessionType: 'personal' | 'group';
  anonymous: boolean;
}

export interface PerformanceFilters {
  dateRange?: [Date | null, Date | null];
  staffMemberId?: string | null;
  reviewType?: 'formal' | 'internal' | 'client' | 'all';
  status?: 'draft' | 'completed' | 'in_progress' | 'all';
  page?: number;
  limit?: number;
}

export interface PerformanceReviewsResponse {
  data: PerformanceReview[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ReviewFormData {
  staffMemberId: string;
  templateId: string;
  scores: ReviewScore[];
  comments?: string;
  status: 'draft' | 'completed';
}

export interface PerformanceComparison {
  trainerId: string;
  trainerName: string;
  metrics: {
    [key: string]: number;
  };
}

