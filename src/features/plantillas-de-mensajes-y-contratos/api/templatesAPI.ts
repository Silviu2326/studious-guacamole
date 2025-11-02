import axios from 'axios';
import { 
  Template, 
  CreateTemplateRequest, 
  UpdateTemplateRequest, 
  TemplateResponse 
} from '../types';

const API_BASE_URL = '/api/settings/templates';

interface QueryParams {
  page?: number;
  limit?: number;
  type?: string;
}

export const templatesAPI = {
  /**
   * Obtener todas las plantillas con paginación y filtros
   */
  async getTemplates(params?: QueryParams): Promise<TemplateResponse> {
    const response = await axios.get<TemplateResponse>(API_BASE_URL, {
      params: {
        page: params?.page || 1,
        limit: params?.limit || 10,
        type: params?.type,
      },
    });
    return response.data;
  },

  /**
   * Obtener una plantilla por ID
   */
  async getTemplateById(id: string): Promise<Template> {
    const response = await axios.get<Template>(`${API_BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Crear una nueva plantilla
   */
  async createTemplate(data: CreateTemplateRequest): Promise<Template> {
    const response = await axios.post<Template>(API_BASE_URL, data);
    return response.data;
  },

  /**
   * Actualizar una plantilla existente
   */
  async updateTemplate(id: string, data: UpdateTemplateRequest): Promise<Template> {
    const response = await axios.put<Template>(`${API_BASE_URL}/${id}`, data);
    return response.data;
  },

  /**
   * Eliminar una plantilla
   */
  async deleteTemplate(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/${id}`);
  },

  /**
   * Duplicar una plantilla
   */
  async duplicateTemplate(id: string): Promise<Template> {
    const template = await templatesAPI.getTemplateById(id);
    const duplicatedName = `${template.name} (Copia)`;
    return await templatesAPI.createTemplate({
      name: duplicatedName,
      type: template.type,
      subject: template.subject,
      bodyHtml: template.bodyHtml,
      requiresSignature: template.requiresSignature || false,
    });
  },
};

