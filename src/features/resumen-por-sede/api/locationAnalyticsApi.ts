import { LocationSummary, LocationSummaryResponse, Location, ExportRequest } from '../types';

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
    if (response.status === 500) {
      throw new Error('Error del servidor: Error durante la agregación de datos.');
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error: ${response.statusText}`);
  }

  return response;
};

/**
 * Obtiene un resumen agregado de los KPIs para todas las sedes
 * GET /api/analytics/locations/summary
 */
export const getLocationSummary = async (
  startDate: Date,
  endDate: Date
): Promise<LocationSummary[]> => {
  try {
    const params = new URLSearchParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    const response = await fetchWithAuth(
      `${API_BASE}/analytics/locations/summary?${params.toString()}`
    );
    const data: LocationSummaryResponse = await response.json();
    return data.data || [];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al obtener el resumen de sedes.';
    throw new Error(errorMessage);
  }
};

/**
 * Genera y descarga un archivo de exportación (CSV o PDF)
 * POST /api/analytics/locations/export
 */
export const exportLocationSummary = async (
  exportRequest: ExportRequest
): Promise<Blob> => {
  try {
    const response = await fetchWithAuth(`${API_BASE}/analytics/locations/export`, {
      method: 'POST',
      body: JSON.stringify(exportRequest),
    });
    
    const blob = await response.blob();
    return blob;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al exportar los datos.';
    throw new Error(errorMessage);
  }
};

/**
 * Obtiene la lista de todas las sedes gestionadas por el cliente
 * GET /api/locations
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

