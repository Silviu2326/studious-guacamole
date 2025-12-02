// Servicio para manejar las llamadas API de equipo

import { TeamMember, TeamMembersResponse, TeamFilters, InvitationData, InvitationResponse, TeamMemberUpdate } from '../types';

const API_BASE_URL = '/api/v1/team';

export class TeamService {
  /**
   * Obtiene una lista paginada y filtrada de todos los miembros del equipo
   */
  static async getMembers(filters: TeamFilters = {}): Promise<TeamMembersResponse> {
    const queryParams = new URLSearchParams();
    
    if (filters.page) {
      queryParams.append('page', filters.page.toString());
    }
    if (filters.limit) {
      queryParams.append('limit', filters.limit.toString());
    }
    if (filters.roleId) {
      queryParams.append('roleId', filters.roleId);
    }
    if (filters.search) {
      queryParams.append('search', filters.search);
    }

    const response = await fetch(
      `${API_BASE_URL}/members?${queryParams.toString()}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('No autorizado. Por favor, inicie sesión nuevamente.');
      }
      if (response.status === 403) {
        throw new Error('No tiene permisos para acceder a la gestión de equipos.');
      }
      throw new Error('Error al cargar los miembros del equipo');
    }

    return response.json();
  }

  /**
   * Crea y envía una invitación por correo electrónico a un nuevo miembro del equipo
   */
  static async inviteMember(invitationData: InvitationData): Promise<InvitationResponse> {
    const response = await fetch(`${API_BASE_URL}/invites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invitationData),
    });

    if (!response.ok) {
      if (response.status === 400) {
        const error = await response.json();
        throw new Error(error.message || 'Datos inválidos en la solicitud');
      }
      if (response.status === 409) {
        throw new Error('Ya existe un usuario o una invitación pendiente para ese correo electrónico.');
      }
      throw new Error('Error al enviar la invitación');
    }

    return response.json();
  }

  /**
   * Actualiza la información de un miembro del equipo
   */
  static async updateMember(memberId: string, update: TeamMemberUpdate): Promise<TeamMember> {
    const response = await fetch(`${API_BASE_URL}/members/${memberId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(update),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Miembro del equipo no encontrado');
      }
      if (response.status === 400) {
        throw new Error('Datos inválidos. El rol o estado proporcionado no es válido.');
      }
      throw new Error('Error al actualizar el miembro del equipo');
    }

    return response.json();
  }
}

