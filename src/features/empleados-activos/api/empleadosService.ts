// Servicio para manejar las llamadas API de empleados corporativos

import { CorporateEmployee, CorporateEmployeesResponse, EmployeeFilters, BulkImportResult, EmployeeStatusUpdate, EmployeeKPIs } from '../types';

const API_BASE_URL = '/api/corporate';

export class EmpleadosService {
  /**
   * Obtiene la lista paginada y filtrada de empleados de una empresa
   */
  static async getEmployees(
    companyId: string,
    filters: EmployeeFilters = {}
  ): Promise<CorporateEmployeesResponse> {
    const queryParams = new URLSearchParams();
    
    if (filters.search) {
      queryParams.append('search', filters.search);
    }
    if (filters.status) {
      queryParams.append('status', filters.status);
    }
    if (filters.page) {
      queryParams.append('page', filters.page.toString());
    }
    if (filters.limit) {
      queryParams.append('limit', filters.limit.toString());
    }

    const response = await fetch(
      `${API_BASE_URL}/companies/${companyId}/employees?${queryParams.toString()}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Empresa no encontrada');
      }
      if (response.status === 403) {
        throw new Error('No tiene permisos para ver los empleados de esta empresa');
      }
      throw new Error('Error al cargar los empleados');
    }

    return response.json();
  }

  /**
   * Actualiza el estado de un empleado
   */
  static async updateEmployeeStatus(
    employeeId: string,
    status: EmployeeStatusUpdate['status']
  ): Promise<CorporateEmployee> {
    const response = await fetch(
      `${API_BASE_URL}/employees/${employeeId}/status`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Empleado no encontrado');
      }
      if (response.status === 400) {
        throw new Error('Estado inválido');
      }
      throw new Error('Error al actualizar el estado del empleado');
    }

    return response.json();
  }

  /**
   * Importa empleados desde un archivo CSV
   */
  static async bulkImportEmployees(
    companyId: string,
    file: File
  ): Promise<BulkImportResult> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(
      `${API_BASE_URL}/companies/${companyId}/employees/bulk-import`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error('El archivo no tiene el formato CSV esperado');
      }
      if (response.status === 413) {
        throw new Error('El archivo excede el tamaño máximo permitido');
      }
      throw new Error('Error al importar los empleados');
    }

    return response.json();
  }

  /**
   * Exporta los empleados a CSV
   */
  static async exportEmployees(
    companyId: string,
    filters: EmployeeFilters = {}
  ): Promise<Blob> {
    const queryParams = new URLSearchParams();
    
    if (filters.search) {
      queryParams.append('search', filters.search);
    }
    if (filters.status) {
      queryParams.append('status', filters.status);
    }

    const response = await fetch(
      `${API_BASE_URL}/companies/${companyId}/employees/export?${queryParams.toString()}`,
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      throw new Error('Error al exportar los empleados');
    }

    return response.blob();
  }

  /**
   * Obtiene los KPIs de empleados para una empresa
   */
  static async getEmployeeKPIs(companyId: string): Promise<EmployeeKPIs> {
    const response = await fetch(
      `${API_BASE_URL}/companies/${companyId}/employees/kpis`
    );

    if (!response.ok) {
      throw new Error('Error al cargar los KPIs');
    }

    return response.json();
  }
}

