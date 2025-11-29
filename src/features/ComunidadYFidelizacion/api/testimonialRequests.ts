import { TestimonialRequest, TestimonialRequestStatus, TestimonialChannel } from '../types';

// Mock data para solicitudes de testimonio
const MOCK_REQUESTS: TestimonialRequest[] = [
  {
    id: 'req_001',
    clientId: 'client_001',
    clientName: 'María González',
    templateId: 'template-objetivo',
    message: '¡Hola María! 🎉\n\nMe encantaría conocer tu experiencia ahora que has alcanzado tu objetivo...',
    channel: 'whatsapp',
    status: 'pendiente',
    sentAt: '2025-01-15T10:00:00Z',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'req_002',
    clientId: 'client_002',
    clientName: 'Carlos Ortega',
    templateId: 'template-programa',
    message: '¡Hola Carlos! 👏\n\n¡Felicitaciones por completar el programa...',
    channel: 'email',
    status: 'recibido',
    sentAt: '2025-01-10T14:30:00Z',
    receivedAt: '2025-01-12T09:15:00Z',
    createdAt: '2025-01-10T14:30:00Z',
    updatedAt: '2025-01-12T09:15:00Z',
  },
];

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const TestimonialRequestsAPI = {
  /**
   * Obtener todas las solicitudes de testimonio
   */
  async getAll(): Promise<TestimonialRequest[]> {
    await delay(200);
    return [...MOCK_REQUESTS];
  },

  /**
   * Obtener solicitudes por cliente
   */
  async getByClient(clientId: string): Promise<TestimonialRequest[]> {
    await delay(200);
    return MOCK_REQUESTS.filter(req => req.clientId === clientId);
  },

  /**
   * Crear una nueva solicitud de testimonio
   */
  async create(request: {
    clientId: string;
    clientName: string;
    templateId?: string;
    message: string;
    channel: TestimonialChannel;
  }): Promise<TestimonialRequest> {
    await delay(300);
    
    const newRequest: TestimonialRequest = {
      id: `req_${Date.now()}`,
      clientId: request.clientId,
      clientName: request.clientName,
      templateId: request.templateId,
      message: request.message,
      channel: request.channel,
      status: 'pendiente',
      sentAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    MOCK_REQUESTS.push(newRequest);
    return newRequest;
  },

  /**
   * Actualizar el estado de una solicitud
   */
  async updateStatus(
    requestId: string,
    status: TestimonialRequestStatus
  ): Promise<TestimonialRequest> {
    await delay(200);
    
    const request = MOCK_REQUESTS.find(req => req.id === requestId);
    if (!request) {
      throw new Error(`Solicitud no encontrada: ${requestId}`);
    }

    request.status = status;
    request.updatedAt = new Date().toISOString();

    if (status === 'recibido' && !request.receivedAt) {
      request.receivedAt = new Date().toISOString();
    }

    if (status === 'publicado' && !request.publishedAt) {
      request.publishedAt = new Date().toISOString();
    }

    return request;
  },

  /**
   * Eliminar una solicitud
   */
  async delete(requestId: string): Promise<void> {
    await delay(200);
    const index = MOCK_REQUESTS.findIndex(req => req.id === requestId);
    if (index !== -1) {
      MOCK_REQUESTS.splice(index, 1);
    }
  },

  /**
   * Reenviar recordatorio de solicitud de testimonio
   */
  async resendReminder(requestId: string): Promise<TestimonialRequest> {
    await delay(300);
    
    const request = MOCK_REQUESTS.find(req => req.id === requestId);
    if (!request) {
      throw new Error(`Solicitud no encontrada: ${requestId}`);
    }

    // Actualizar la fecha de envío para simular el reenvío
    request.sentAt = new Date().toISOString();
    request.updatedAt = new Date().toISOString();

    return request;
  },
};

