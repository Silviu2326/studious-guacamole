import { TestimonialRequestsAPI } from '../api/testimonialRequests';
import { TestimonialRequest, TestimonialRequestStatus, TestimonialChannel } from '../types';

export const TestimonialRequestsService = {
  /**
   * Obtener todas las solicitudes de testimonio
   */
  async getAll(): Promise<TestimonialRequest[]> {
    return TestimonialRequestsAPI.getAll();
  },

  /**
   * Obtener solicitudes por cliente
   */
  async getByClient(clientId: string): Promise<TestimonialRequest[]> {
    return TestimonialRequestsAPI.getByClient(clientId);
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
    return TestimonialRequestsAPI.create(request);
  },

  /**
   * Actualizar el estado de una solicitud
   */
  async updateStatus(
    requestId: string,
    status: TestimonialRequestStatus
  ): Promise<TestimonialRequest> {
    return TestimonialRequestsAPI.updateStatus(requestId, status);
  },

  /**
   * Eliminar una solicitud
   */
  async delete(requestId: string): Promise<void> {
    return TestimonialRequestsAPI.delete(requestId);
  },

  /**
   * Reenviar recordatorio de solicitud de testimonio
   */
  async resendReminder(requestId: string): Promise<TestimonialRequest> {
    return TestimonialRequestsAPI.resendReminder(requestId);
  },
};

