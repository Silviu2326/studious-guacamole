import axios from 'axios';
import type {
  SuppliersFilter,
  Supplier,
  SuppliersResponse,
  SupplierFormData,
  Contract,
  ContractFormData,
} from '../types';

// En producción, esto vendría de variables de entorno
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

// Obtener token de autenticación (en producción vendría del contexto de auth)
const getAuthToken = (): string | null => {
  const token = localStorage.getItem('authToken');
  return token;
};

// Configurar axios con interceptores para autenticación
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * GET /api/v1/gyms/{gymId}/suppliers
 * Obtiene una lista paginada de proveedores para un gimnasio específico
 */
export const getSuppliers = async (
  gymId: string,
  filters?: SuppliersFilter
): Promise<SuppliersResponse> => {
  try {
    const params = new URLSearchParams();
    
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.ratingMin) params.append('ratingMin', filters.ratingMin.toString());

    const queryString = params.toString();
    const url = `/gyms/${gymId}/suppliers${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get<SuppliersResponse>(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    // En caso de error, retornar datos mock para desarrollo
    return {
      data: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      },
    };
  }
};

/**
 * POST /api/v1/gyms/{gymId}/suppliers
 * Crea un nuevo proveedor para un gimnasio
 */
export const createSupplier = async (
  gymId: string,
  supplierData: SupplierFormData
): Promise<Supplier> => {
  try {
    const response = await apiClient.post<Supplier>(
      `/gyms/${gymId}/suppliers`,
      supplierData
    );
    return response.data;
  } catch (error) {
    console.error('Error creating supplier:', error);
    throw error;
  }
};

/**
 * PUT /api/v1/gyms/{gymId}/suppliers/{supplierId}
 * Actualiza la información de un proveedor existente
 */
export const updateSupplier = async (
  gymId: string,
  supplierId: string,
  updateData: Partial<SupplierFormData>
): Promise<Supplier> => {
  try {
    const response = await apiClient.put<Supplier>(
      `/gyms/${gymId}/suppliers/${supplierId}`,
      updateData
    );
    return response.data;
  } catch (error) {
    console.error('Error updating supplier:', error);
    throw error;
  }
};

/**
 * POST /api/v1/gyms/{gymId}/suppliers/{supplierId}/contracts
 * Añade un nuevo contrato a un proveedor existente
 */
export const createContract = async (
  gymId: string,
  supplierId: string,
  contractData: ContractFormData
): Promise<Contract> => {
  try {
    const formData = new FormData();
    formData.append('startDate', contractData.startDate);
    formData.append('endDate', contractData.endDate);
    if (contractData.file) {
      formData.append('file', contractData.file);
    }
    if (contractData.renewalAlertDays) {
      formData.append('renewalAlertDays', contractData.renewalAlertDays.toString());
    }

    const response = await apiClient.post<Contract>(
      `/gyms/${gymId}/suppliers/${supplierId}/contracts`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating contract:', error);
    throw error;
  }
};

/**
 * DELETE /api/v1/gyms/{gymId}/suppliers/{supplierId}
 * Elimina (archiva) un proveedor
 */
export const deleteSupplier = async (
  gymId: string,
  supplierId: string
): Promise<void> => {
  try {
    await apiClient.delete(`/gyms/${gymId}/suppliers/${supplierId}`);
  } catch (error) {
    console.error('Error deleting supplier:', error);
    throw error;
  }
};

