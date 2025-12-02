import { ChurnedClient, ChurnedClientsResponse, ChurnedClientsFilters } from '../types';
import { getMockChurnedClients } from './mockData';

const API_BASE = '/api/v1/crm';
const USE_MOCK_DATA = true; // Cambiar a false cuando el backend esté disponible

export async function getChurnedClients(
  filters: ChurnedClientsFilters = {}
): Promise<ChurnedClientsResponse> {
  // Usar datos mock si está habilitado
  if (USE_MOCK_DATA) {
    console.log('⚠️ Usando datos mock para getChurnedClients');
    return getMockChurnedClients(filters);
  }

  try {
    const queryParams = new URLSearchParams();
    
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (filters.reasonId) queryParams.append('reasonId', filters.reasonId);
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());

    const url = `${API_BASE}/churned-clients?${queryParams.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error al obtener clientes dados de baja: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(`El servidor devolvió HTML en lugar de JSON. Esto puede indicar que la ruta de la API no existe o hay un problema de configuración. Respuesta: ${text.substring(0, 200)}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching churned clients:', error);
    console.log('⚠️ Fallback a datos mock debido al error');
    // Fallback a datos mock en caso de error
    return getMockChurnedClients(filters);
  }
}

export async function logCancellation(
  clientId: string,
  cancellationData: FormData
): Promise<{ cancellationId: string; clientId: string; status: string; message: string }> {
  try {
    const response = await fetch(`${API_BASE}/clients/${clientId}/cancellation`, {
      method: 'POST',
      body: cancellationData,
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('El cliente no existe');
      }
      if (response.status === 409) {
        throw new Error('El cliente ya tiene una baja registrada');
      }
      throw new Error(`Error al registrar la baja: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(`El servidor devolvió HTML en lugar de JSON. Esto puede indicar que la ruta de la API no existe o hay un problema de configuración. Respuesta: ${text.substring(0, 200)}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error logging cancellation:', error);
    throw error;
  }
}

export async function exportChurnedClients(
  filters: ChurnedClientsFilters
): Promise<Blob> {
  // Si estamos usando datos mock, generar CSV desde los datos mock
  if (USE_MOCK_DATA) {
    console.log('⚠️ Generando CSV desde datos mock para exportChurnedClients');
    const mockData = await getMockChurnedClients(filters);
    
    // Generar CSV
    const headers = ['Nombre', 'Email', 'Fecha de Baja', 'Motivo', 'Plan', 'Entrenador', 'Notas'];
    const rows = mockData.data.map(client => [
      client.name,
      client.email,
      new Date(client.cancellationDate).toLocaleDateString('es-ES'),
      client.reason,
      client.plan,
      client.trainerName || 'N/A',
      client.notes || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  }

  try {
    const queryParams = new URLSearchParams();
    
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (filters.reasonId) queryParams.append('reasonId', filters.reasonId);

    const url = `${API_BASE}/churned-clients/export?${queryParams.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error al exportar datos: ${response.statusText}`);
    }

    return await response.blob();
  } catch (error) {
    console.error('Error exporting churned clients:', error);
    // Fallback a CSV mock
    const mockData = await getMockChurnedClients(filters);
    const headers = ['Nombre', 'Email', 'Fecha de Baja', 'Motivo', 'Plan', 'Entrenador', 'Notas'];
    const rows = mockData.data.map(client => [
      client.name,
      client.email,
      new Date(client.cancellationDate).toLocaleDateString('es-ES'),
      client.reason,
      client.plan,
      client.trainerName || 'N/A',
      client.notes || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  }
}

