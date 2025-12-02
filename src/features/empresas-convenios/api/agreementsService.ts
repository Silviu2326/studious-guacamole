// Servicio para manejar las llamadas API de convenios corporativos

import {
  CorporateAgreement,
  AgreementsResponse,
  AgreementFilters,
  AgreementFormData,
  AgreementMembersResponse,
} from '../types';

const API_BASE_URL = '/api/b2b';

export class AgreementsService {
  /**
   * Obtiene una lista paginada y filtrada de todos los convenios corporativos
   */
  static async getAgreements(
    filters: AgreementFilters = {}
  ): Promise<AgreementsResponse> {
    const queryParams = new URLSearchParams();

    if (filters.page) {
      queryParams.append('page', filters.page.toString());
    }
    if (filters.limit) {
      queryParams.append('limit', filters.limit.toString());
    }
    if (filters.status) {
      queryParams.append('status', filters.status);
    }
    if (filters.search) {
      queryParams.append('search', filters.search);
    }

    const response = await fetch(
      `${API_BASE_URL}/agreements?${queryParams.toString()}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('No autorizado. El token de autenticación es inválido.');
      }
      if (response.status === 403) {
        throw new Error('No tiene permisos para acceder a esta información');
      }
      throw new Error('Error al cargar los convenios');
    }

    return response.json();
  }

  /**
   * Obtiene los detalles completos de un convenio específico
   */
  static async getAgreementById(agreementId: string): Promise<CorporateAgreement> {
    const response = await fetch(`${API_BASE_URL}/agreements/${agreementId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Convenio no encontrado');
      }
      if (response.status === 401) {
        throw new Error('No autorizado');
      }
      throw new Error('Error al cargar el convenio');
    }

    return response.json();
  }

  /**
   * Crea un nuevo convenio corporativo
   */
  static async createAgreement(
    agreementData: AgreementFormData
  ): Promise<CorporateAgreement> {
    const response = await fetch(`${API_BASE_URL}/agreements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(agreementData),
    });

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error('Datos del formulario inválidos o faltantes');
      }
      if (response.status === 409) {
        throw new Error('Ya existe un convenio activo con la misma empresa');
      }
      if (response.status === 401) {
        throw new Error('No autorizado');
      }
      throw new Error('Error al crear el convenio');
    }

    return response.json();
  }

  /**
   * Actualiza la información de un convenio existente
   */
  static async updateAgreement(
    agreementId: string,
    updateData: Partial<AgreementFormData>
  ): Promise<CorporateAgreement> {
    const response = await fetch(`${API_BASE_URL}/agreements/${agreementId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error('Los datos proporcionados para la actualización son inválidos');
      }
      if (response.status === 404) {
        throw new Error('El convenio no existe');
      }
      if (response.status === 401) {
        throw new Error('No autorizado');
      }
      throw new Error('Error al actualizar el convenio');
    }

    return response.json();
  }

  /**
   * Obtiene la lista de todos los miembros asociados a un convenio específico
   */
  static async getAgreementMembers(
    agreementId: string
  ): Promise<AgreementMembersResponse[]> {
    const response = await fetch(
      `${API_BASE_URL}/agreements/${agreementId}/members`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Convenio no encontrado');
      }
      if (response.status === 401) {
        throw new Error('No autorizado');
      }
      throw new Error('Error al cargar los miembros del convenio');
    }

    return response.json();
  }
}

