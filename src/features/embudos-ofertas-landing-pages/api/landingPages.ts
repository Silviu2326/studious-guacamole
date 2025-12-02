// API Service para Landing Pages
import axios from 'axios';
import type {
  LandingPage,
  LandingPageListResponse,
  CreateLandingPageRequest,
  UpdateLandingPageRequest,
  AnalyticsData,
  LandingPageTemplate,
} from '../types';

const API_BASE_URL = '/api/v1/marketing';

// Obtener token de autenticación (asumiendo que está en localStorage o context)
const getAuthToken = () => {
  return localStorage.getItem('authToken') || '';
};

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación
axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * GET /api/v1/marketing/landings
 * Obtiene una lista paginada de todas las landing pages
 */
export const getLandingPages = async (
  page: number = 1,
  limit: number = 10,
  status?: 'draft' | 'published' | 'archived'
): Promise<LandingPageListResponse> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  if (status) {
    params.append('status', status);
  }

  const response = await axiosInstance.get<LandingPageListResponse>(`/landings?${params.toString()}`);
  return response.data;
};

/**
 * POST /api/v1/marketing/landings
 * Crea una nueva landing page
 */
export const createLandingPage = async (
  data: CreateLandingPageRequest
): Promise<LandingPage> => {
  const response = await axiosInstance.post<LandingPage>('/landings', data);
  return response.data;
};

/**
 * GET /api/v1/marketing/landings/:pageId
 * Obtiene una landing page específica por ID
 */
export const getLandingPage = async (pageId: string): Promise<LandingPage> => {
  const response = await axiosInstance.get<LandingPage>(`/landings/${pageId}`);
  return response.data;
};

/**
 * PUT /api/v1/marketing/landings/:pageId
 * Actualiza una landing page existente
 */
export const updateLandingPage = async (
  pageId: string,
  data: UpdateLandingPageRequest
): Promise<LandingPage> => {
  const response = await axiosInstance.put<LandingPage>(`/landings/${pageId}`, data);
  return response.data;
};

/**
 * DELETE /api/v1/marketing/landings/:pageId
 * Elimina una landing page
 */
export const deleteLandingPage = async (pageId: string): Promise<{ success: boolean; message: string }> => {
  const response = await axiosInstance.delete<{ success: boolean; message: string }>(`/landings/${pageId}`);
  return response.data;
};

/**
 * GET /api/v1/marketing/landings/:pageId/analytics
 * Obtiene las analíticas de una landing page
 */
export const getLandingPageAnalytics = async (
  pageId: string,
  period: 'day' | 'week' | 'month' | 'year' | 'custom' = 'month',
  startDate?: string,
  endDate?: string
): Promise<AnalyticsData> => {
  const params = new URLSearchParams();
  params.append('period', period);
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const response = await axiosInstance.get<AnalyticsData>(
    `/landings/${pageId}/analytics?${params.toString()}`
  );
  return response.data;
};

/**
 * GET /api/v1/marketing/landings/templates
 * Obtiene la lista de plantillas disponibles
 */
export const getTemplates = async (): Promise<LandingPageTemplate[]> => {
  const response = await axiosInstance.get<LandingPageTemplate[]>('/landings/templates');
  return response.data;
};

/**
 * POST /api/v1/marketing/landings/:pageId/duplicate
 * Duplica una landing page existente
 */
export const duplicateLandingPage = async (
  pageId: string,
  newName: string
): Promise<LandingPage> => {
  const response = await axiosInstance.post<LandingPage>(`/landings/${pageId}/duplicate`, {
    name: newName,
  });
  return response.data;
};

/**
 * POST /api/v1/marketing/landings/:pageId/publish
 * Publica una landing page (cambia estado a published)
 */
export const publishLandingPage = async (pageId: string): Promise<LandingPage> => {
  const response = await axiosInstance.post<LandingPage>(`/landings/${pageId}/publish`);
  return response.data;
};

/**
 * POST /api/v1/marketing/landings/:pageId/unpublish
 * Despublica una landing page (cambia estado a draft)
 */
export const unpublishLandingPage = async (pageId: string): Promise<LandingPage> => {
  const response = await axiosInstance.post<LandingPage>(`/landings/${pageId}/unpublish`);
  return response.data;
};

