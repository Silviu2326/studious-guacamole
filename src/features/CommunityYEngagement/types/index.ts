// Re-exportar tipos existentes desde api
export type {
  Post,
  UserProfile,
  Reactions,
  Comment,
  Group,
  Badge,
  CommunityFilters,
  PaginationData,
  PostsResponse,
  CommunityAnalytics,
  TestimonialSummary,
  ReferralSummary
} from '../api/community';

// Nuevos tipos para el Dashboard de Comunidad

// --- Testimonios ---
export interface Testimonial {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  content: string;
  rating: number; // 1-5
  date: string;
  status: 'pending' | 'approved' | 'featured' | 'archived';
  program?: string;
  tags?: string[];
}

export interface TestimonialFilters {
  status?: Testimonial['status'];
  rating?: number;
  search?: string;
}

// --- Encuestas ---
export interface SurveyQuestion {
  id: string;
  type: 'multiple_choice' | 'scale' | 'text' | 'nps';
  question: string;
  options?: string[];
  required: boolean;
}

export interface Survey {
  id: string;
  title: string;
  description?: string;
  status: 'active' | 'completed' | 'draft';
  questions?: SurveyQuestion[];
  recipients?: string[]; // IDs de usuarios
  totalRecipients: number;
  responses: number;
  startDate: string;
  endDate?: string;
  daysLeft?: number;
  color?: 'blue' | 'indigo' | 'slate' | 'purple' | 'green';
}

export interface CreateSurveyDto {
  title: string;
  description?: string;
  questions: SurveyQuestion[];
  recipients: string[];
  endDate?: string;
}

export interface SurveyResults {
  surveyId: string;
  totalResponses: number;
  questionResults: Record<string, any>; // Simplificado para este ejemplo
}

// --- Interacciones ---
export interface Interaction {
  id: string;
  type: 'comment' | 'like' | 'survey_response' | 'testimonial' | 'message' | 'check_in';
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  content?: string;
  target: string; // Sobre qué fue la interacción (e.g. "Post: Nutrición")
  timestamp: string; // ISO string
  time?: string; // Human readable relative time (e.g. "Hace 2h")
  isUnread?: boolean;
  metadata?: Record<string, any>;
}

export interface InteractionFilters {
  type?: Interaction['type'];
  clientId?: string;
  startDate?: string;
  endDate?: string;
}

// --- Métricas ---
export interface EngagementMetrics {
  testimonialsReceived: number;
  activeSurveys: number;
  responseRate: number; // Porcentaje
  avgResponseTime: number; // Horas
  engagementScore: number; // 0-10
  npsScore?: number;
  trends: {
    testimonials: { value: number; isPositive: boolean };
    responseRate: { value: number; isPositive: boolean };
    engagement: { value: number; isPositive: boolean };
  };
}
