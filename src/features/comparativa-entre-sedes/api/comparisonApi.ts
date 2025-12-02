import { Location, ComparisonResponse, ComparisonFilters } from '../types';

const API_BASE = '/api';

// Obtener token de autenticación desde el contexto o localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken') || null;
};

// Helper para hacer peticiones fetch con autenticación
const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = getAuthToken();
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('No autorizado: El token de autenticación no es válido o ha expirado.');
    }
    if (response.status === 403) {
      throw new Error('Acceso denegado: No tiene permisos para acceder a este recurso.');
    }
    if (response.status === 400) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Solicitud inválida: Parámetros faltantes o con formato incorrecto.');
    }
    if (response.status === 429) {
      throw new Error('Demasiadas solicitudes: Ha solicitado demasiados reportes en un corto período de tiempo.');
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error: ${response.statusText}`);
  }

  return response;
};

/**
 * Obtiene la lista de todas las sedes a las que el usuario tiene acceso
 */
export const getLocations = async (): Promise<Location[]> => {
  try {
    const response = await fetchWithAuth(`${API_BASE}/locations`);
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al obtener las sedes.';
    throw new Error(errorMessage);
  }
};

/**
 * Obtiene los datos comparativos de las sedes seleccionadas
 */
export const getLocationComparison = async (
  filters: ComparisonFilters
): Promise<ComparisonResponse> => {
  try {
    const params = new URLSearchParams({
      locationIds: filters.locationIds.join(','),
      startDate: filters.dateRange.startDate.toISOString(),
      endDate: filters.dateRange.endDate.toISOString(),
      kpis: filters.kpis.join(','),
    });

    const response = await fetchWithAuth(
      `${API_BASE}/analytics/location-comparison?${params.toString()}`
    );
    return await response.json();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al obtener la comparativa.';
    throw new Error(errorMessage);
  }
};

/**
 * Inicia la generación de un reporte exportable
 */
export const generateReport = async (
  filters: ComparisonFilters,
  format: 'csv' | 'pdf'
): Promise<{ message: string; reportId: string }> => {
  try {
    const response = await fetchWithAuth(`${API_BASE}/analytics/reports`, {
      method: 'POST',
      body: JSON.stringify({
        locationIds: filters.locationIds,
        dateRange: {
          start: filters.dateRange.startDate.toISOString(),
          end: filters.dateRange.endDate.toISOString(),
        },
        kpis: filters.kpis,
        format,
      }),
    });
    return await response.json();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al generar el reporte.';
    throw new Error(errorMessage);
  }
};

