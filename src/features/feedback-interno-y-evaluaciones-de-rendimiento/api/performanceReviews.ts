// API functions para Performance Reviews

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export interface GetPerformanceReviewsParams {
  gymId: string;
  staffMemberId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface PerformanceReviewResponse {
  id: string;
  staffMemberName: string;
  reviewerName: string;
  reviewDate: string;
  status: 'draft' | 'completed' | 'in_progress' | 'disputed';
  overallScore: number | null;
  staffMemberId: string;
  templateId: string;
  scores: Array<{
    kpiId: string;
    score: number | null;
    comment: string;
  }>;
  createdAt: string;
  completedAt?: string;
}

export interface PerformanceReviewsListResponse {
  data: PerformanceReviewResponse[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

export const getPerformanceReviews = async (
  params: GetPerformanceReviewsParams
): Promise<PerformanceReviewsListResponse> => {
  const { gymId, staffMemberId, startDate, endDate, page = 1, limit = 10 } = params;
  
  const queryParams = new URLSearchParams();
  if (staffMemberId) queryParams.append('staffMemberId', staffMemberId);
  if (startDate) queryParams.append('startDate', startDate);
  if (endDate) queryParams.append('endDate', endDate);
  queryParams.append('page', page.toString());
  queryParams.append('limit', limit.toString());

  const response = await fetch(`${API_BASE_URL}/gyms/${gymId}/performance-reviews?${queryParams}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error('No autorizado');
    if (response.status === 403) throw new Error('Sin permisos para acceder a estas evaluaciones');
    if (response.status === 404) throw new Error('Gimnasio no encontrado');
    throw new Error('Error al obtener las evaluaciones de rendimiento');
  }

  return response.json();
};

export interface CreatePerformanceReviewData {
  staffMemberId: string;
  templateId: string;
  scores: Array<{
    kpiId: string;
    score: number | null;
    comment: string;
  }>;
  comments?: string;
  status?: 'draft' | 'completed';
}

export const createPerformanceReview = async (
  gymId: string,
  reviewData: CreatePerformanceReviewData
): Promise<PerformanceReviewResponse> => {
  const response = await fetch(`${API_BASE_URL}/gyms/${gymId}/performance-reviews`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reviewData),
  });

  if (!response.ok) {
    if (response.status === 400) throw new Error('Datos inválidos');
    if (response.status === 403) throw new Error('Sin permisos para crear evaluaciones');
    throw new Error('Error al crear la evaluación de rendimiento');
  }

  return response.json();
};

export interface UpdatePerformanceReviewData {
  scores?: Array<{
    kpiId: string;
    score: number | null;
    comment: string;
  }>;
  comments?: string;
  employeeComments?: string;
  status?: 'draft' | 'completed' | 'in_progress' | 'disputed';
}

export const updatePerformanceReview = async (
  gymId: string,
  reviewId: string,
  updateData: UpdatePerformanceReviewData
): Promise<PerformanceReviewResponse> => {
  const response = await fetch(`${API_BASE_URL}/gyms/${gymId}/performance-reviews/${reviewId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    if (response.status === 404) throw new Error('Evaluación no encontrada');
    if (response.status === 409) throw new Error('La evaluación ya está completada y no se puede modificar');
    throw new Error('Error al actualizar la evaluación de rendimiento');
  }

  return response.json();
};

export const getFeedbackSummary = async (
  gymId: string,
  dateRange?: string
): Promise<Array<{
  staffMemberId: string;
  name: string;
  avatarUrl?: string;
  avgClientRating: number;
  clientRetentionRate: number;
  lastReviewDate?: string;
}>> => {
  const queryParams = new URLSearchParams();
  if (dateRange) queryParams.append('dateRange', dateRange);

  const response = await fetch(`${API_BASE_URL}/gyms/${gymId}/staff/feedback-summary?${queryParams}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 403) throw new Error('Sin permisos para ver resúmenes del equipo');
    throw new Error('Error al obtener el resumen de feedback');
  }

  return response.json();
};

