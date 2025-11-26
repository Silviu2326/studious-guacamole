import { ChurnStats } from '../types';
import { getMockChurnStats } from './mockData';

const API_BASE = '/api/v1/crm';
const USE_MOCK_DATA = true; // Cambiar a false cuando el backend esté disponible

export interface ChurnStatsFilters {
  startDate: string; // ISO 8601
  endDate: string; // ISO 8601
}

export async function getChurnStats(
  filters: ChurnStatsFilters
): Promise<ChurnStats> {
  // Usar datos mock si está habilitado
  if (USE_MOCK_DATA) {
    console.log('⚠️ Usando datos mock para getChurnStats');
    return getMockChurnStats();
  }

  try {
    const queryParams = new URLSearchParams();
    queryParams.append('startDate', filters.startDate);
    queryParams.append('endDate', filters.endDate);

    const url = `${API_BASE}/churn-stats?${queryParams.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error('El rango de fechas es inválido o no ha sido proporcionado');
      }
      throw new Error(`Error al obtener estadísticas de churn: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(`El servidor devolvió HTML en lugar de JSON. Esto puede indicar que la ruta de la API no existe o hay un problema de configuración. Respuesta: ${text.substring(0, 200)}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching churn stats:', error);
    console.log('⚠️ Fallback a datos mock debido al error');
    // Fallback a datos mock en caso de error
    return getMockChurnStats();
  }
}

