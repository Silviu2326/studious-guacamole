import { CancellationReason } from '../types';
import { getMockCancellationReasons } from './mockData';

const API_BASE = '/api/v1/crm';
const USE_MOCK_DATA = true; // Cambiar a false cuando el backend esté disponible

export async function getCancellationReasons(): Promise<CancellationReason[]> {
  // Usar datos mock si está habilitado
  if (USE_MOCK_DATA) {
    console.log('⚠️ Usando datos mock para getCancellationReasons');
    return getMockCancellationReasons();
  }

  try {
    const response = await fetch(`${API_BASE}/cancellation-reasons`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 500) {
        throw new Error('No se pudo cargar la configuración de motivos');
      }
      throw new Error(`Error al obtener motivos de baja: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(`El servidor devolvió HTML en lugar de JSON. Esto puede indicar que la ruta de la API no existe o hay un problema de configuración. Respuesta: ${text.substring(0, 200)}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching cancellation reasons:', error);
    console.log('⚠️ Fallback a datos mock debido al error');
    // Fallback a datos mock en caso de error
    return getMockCancellationReasons();
  }
}

