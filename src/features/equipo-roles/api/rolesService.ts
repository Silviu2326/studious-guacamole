// Servicio para manejar las llamadas API de roles

import { Role, RoleCreate } from '../types';

const API_BASE_URL = '/api/v1/team';

export class RolesService {
  /**
   * Obtiene la lista de todos los roles disponibles en el gimnasio
   */
  static async getRoles(): Promise<Role[]> {
    const response = await fetch(`${API_BASE_URL}/roles`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('No autorizado. Por favor, inicie sesión nuevamente.');
      }
      throw new Error('Error al cargar los roles');
    }

    return response.json();
  }

  /**
   * Crea un nuevo rol personalizado con un conjunto específico de permisos
   */
  static async createRole(roleData: RoleCreate): Promise<Role> {
    const response = await fetch(`${API_BASE_URL}/roles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(roleData),
    });

    if (!response.ok) {
      if (response.status === 400) {
        const error = await response.json();
        throw new Error(error.message || 'El nombre está vacío o los permisos contienen claves no válidas.');
      }
      if (response.status === 409) {
        throw new Error('Ya existe un rol con ese nombre.');
      }
      throw new Error('Error al crear el rol');
    }

    return response.json();
  }
}

