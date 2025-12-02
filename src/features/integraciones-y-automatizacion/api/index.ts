import type {
  Integration,
  UserIntegration,
  ConnectIntegrationRequest,
  ConnectIntegrationResponse,
  IntegrationSettings,
  IntegrationStats,
} from '../types';

const API_BASE = '/api/settings/integrations';

export const integrationService = {
  /**
   * Obtiene todas las integraciones disponibles con su estado
   */
  async getAllIntegrations(): Promise<Integration[]> {
    try {
      const response = await fetch(API_BASE, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener las integraciones');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching integrations:', error);
      throw error;
    }
  },

  /**
   * Inicia el flujo de conexión OAuth para una integración
   */
  async connectIntegration(
    data: ConnectIntegrationRequest
  ): Promise<ConnectIntegrationResponse> {
    try {
      const response = await fetch(`${API_BASE}/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al conectar la integración');
      }

      return await response.json();
    } catch (error) {
      console.error('Error connecting integration:', error);
      throw error;
    }
  },

  /**
   * Desconecta una integración existente
   */
  async disconnectIntegration(userIntegrationId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE}/${userIntegrationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al desconectar la integración');
      }
    } catch (error) {
      console.error('Error disconnecting integration:', error);
      throw error;
    }
  },

  /**
   * Actualiza la configuración de una integración
   */
  async updateSettings(
    userIntegrationId: string,
    settings: IntegrationSettings
  ): Promise<UserIntegration> {
    try {
      const response = await fetch(`${API_BASE}/${userIntegrationId}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || 'Error al actualizar la configuración'
        );
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating integration settings:', error);
      throw error;
    }
  },

  /**
   * Obtiene las estadísticas de integraciones
   */
  async getStats(): Promise<IntegrationStats> {
    try {
      const response = await fetch(`${API_BASE}/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener las estadísticas');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching integration stats:', error);
      throw error;
    }
  },
};

