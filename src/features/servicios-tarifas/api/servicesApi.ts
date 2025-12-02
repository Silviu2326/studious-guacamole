import {
  Service,
  ServicesResponse,
  CreateServiceRequest,
  UpdateServiceRequest,
  ServiceFilters,
  DeleteServiceResponse,
  ServiceStats
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const servicesApi = {
  /**
   * Obtiene una lista paginada y filtrada de todos los servicios
   */
  async getServices(filters?: ServiceFilters): Promise<ServicesResponse> {
    const params = new URLSearchParams();
    
    if (filters?.searchTerm) params.append('searchTerm', filters.searchTerm);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    
    const response = await fetch(`${API_BASE_URL}/settings/services?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error(`Error fetching services: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Obtiene un servicio por su ID
   */
  async getServiceById(serviceId: string): Promise<Service> {
    const response = await fetch(`${API_BASE_URL}/settings/services/${serviceId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error(`Error fetching service: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Crea un nuevo servicio
   */
  async createService(serviceData: CreateServiceRequest): Promise<Service> {
    const response = await fetch(`${API_BASE_URL}/settings/services`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(serviceData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Error creating service: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Actualiza un servicio existente
   */
  async updateService(serviceId: string, updateData: UpdateServiceRequest): Promise<Service> {
    const response = await fetch(`${API_BASE_URL}/settings/services/${serviceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Error updating service: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Elimina un servicio
   */
  async deleteService(serviceId: string): Promise<DeleteServiceResponse> {
    const response = await fetch(`${API_BASE_URL}/settings/services/${serviceId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Error deleting service: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Cambia el estado activo/inactivo de un servicio
   */
  async toggleServiceStatus(serviceId: string, isActive: boolean): Promise<Service> {
    return this.updateService(serviceId, { isActive });
  },

  /**
   * Duplica un servicio existente
   */
  async duplicateService(serviceId: string): Promise<Service> {
    const service = await this.getServiceById(serviceId);
    
    const duplicateData: CreateServiceRequest = {
      name: `${service.name} (Copia)`,
      description: service.description,
      category: service.category,
      price: service.price,
      currency: service.currency,
      serviceType: service.serviceType,
      isRecurring: service.isRecurring,
      billingType: service.billingType,
      recurringInterval: service.recurringInterval,
      isActive: false, // Por defecto, las duplicaciones se crean inactivas
      duration: service.duration,
      sessionCount: service.sessionCount,
      taxRate: service.taxRate,
      taxType: service.taxType,
      sku: service.sku,
      requiresBooking: service.requiresBooking,
      requiresResources: service.requiresResources,
      metadata: service.metadata
    };

    return this.createService(duplicateData);
  },

  /**
   * Obtiene estadísticas de servicios
   */
  async getServiceStats(): Promise<ServiceStats> {
    const response = await fetch(`${API_BASE_URL}/settings/services/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error(`Error fetching service stats: ${response.statusText}`);
    }

    return response.json();
  }
};

