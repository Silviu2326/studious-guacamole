import { ApiKey, Webhook, WebhookDeliveryLog, WebhookFormData, ApiKeyFormData } from '../types';

const API_BASE = '/api/v1/developer';

export const webhooksApiKeysApi = {
  // API Keys endpoints
  obtenerApiKeys: async (): Promise<ApiKey[]> => {
    try {
      const response = await fetch(`${API_BASE}/api-keys`);
      if (!response.ok) throw new Error('Error al obtener API Keys');
      return await response.json();
    } catch (error) {
      console.error('Error en obtenerApiKeys:', error);
      return mockApiKeys;
    }
  },

  crearApiKey: async (data: ApiKeyFormData): Promise<ApiKey> => {
    try {
      const response = await fetch(`${API_BASE}/api-keys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Error al crear API Key');
      return await response.json();
    } catch (error) {
      console.error('Error en crearApiKey:', error);
      throw error;
    }
  },

  revocarApiKey: async (keyId: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE}/api-keys/${keyId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error al revocar API Key');
    } catch (error) {
      console.error('Error en revocarApiKey:', error);
      throw error;
    }
  },

  // Webhooks endpoints
  obtenerWebhooks: async (): Promise<Webhook[]> => {
    try {
      const response = await fetch(`${API_BASE}/webhooks`);
      if (!response.ok) throw new Error('Error al obtener webhooks');
      return await response.json();
    } catch (error) {
      console.error('Error en obtenerWebhooks:', error);
      return mockWebhooks;
    }
  },

  crearWebhook: async (data: WebhookFormData): Promise<Webhook> => {
    try {
      const response = await fetch(`${API_BASE}/webhooks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Error al crear webhook');
      return await response.json();
    } catch (error) {
      console.error('Error en crearWebhook:', error);
      throw error;
    }
  },

  actualizarWebhook: async (webhookId: string, data: WebhookFormData): Promise<Webhook> => {
    try {
      const response = await fetch(`${API_BASE}/webhooks/${webhookId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Error al actualizar webhook');
      return await response.json();
    } catch (error) {
      console.error('Error en actualizarWebhook:', error);
      throw error;
    }
  },

  eliminarWebhook: async (webhookId: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE}/webhooks/${webhookId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error al eliminar webhook');
    } catch (error) {
      console.error('Error en eliminarWebhook:', error);
      throw error;
    }
  },

  obtenerWebhookLogs: async (webhookId: string, limit?: number): Promise<WebhookDeliveryLog[]> => {
    try {
      const params = limit ? `?limit=${limit}` : '';
      const response = await fetch(`${API_BASE}/webhooks/${webhookId}/logs${params}`);
      if (!response.ok) throw new Error('Error al obtener logs del webhook');
      return await response.json();
    } catch (error) {
      console.error('Error en obtenerWebhookLogs:', error);
      return mockWebhookLogs;
    }
  },
};

// Mock data for development
const mockApiKeys: ApiKey[] = [
  {
    id: 'ak_12345',
    name: 'CRM Integration',
    prefix: 'fgs_live_abcdef...',
    scopes: ['members:read', 'members:write'],
    createdAt: '2024-01-15T10:00:00Z',
    status: 'active',
  },
  {
    id: 'ak_67890',
    name: 'Access Control System',
    prefix: 'fgs_live_ghijk...',
    scopes: ['members:read', 'checkins:write'],
    createdAt: '2024-02-20T14:30:00Z',
    status: 'active',
  },
];

const mockWebhooks: Webhook[] = [
  {
    id: 'wh_abcde',
    name: 'Marketing Automation Hook',
    targetUrl: 'https://hooks.example.com/new-member',
    events: ['member.created', 'member.trial.started'],
    secret: 'whsec_1234567890abcdef...',
    status: 'active',
    createdAt: '2024-01-10T09:00:00Z',
  },
  {
    id: 'wh_fghij',
    name: 'Payment Failure Notification',
    targetUrl: 'https://billing.example.com/webhooks',
    events: ['payment.failed'],
    secret: 'whsec_9876543210fedcba...',
    status: 'active',
    createdAt: '2024-02-01T11:00:00Z',
  },
];

const mockWebhookLogs: WebhookDeliveryLog[] = [
  {
    id: 'log_xyz',
    eventType: 'member.created',
    status: 'success',
    responseCode: 200,
    attemptCount: 1,
    timestamp: '2024-03-15T12:00:00Z',
  },
  {
    id: 'log_wxy',
    eventType: 'payment.failed',
    status: 'failed',
    responseCode: 503,
    attemptCount: 5,
    timestamp: '2024-03-15T12:05:00Z',
    errorMessage: 'Service unavailable',
  },
];

