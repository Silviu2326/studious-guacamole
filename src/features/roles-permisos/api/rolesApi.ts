// Servicio para manejar las llamadas API de roles

import { Role, RoleCreate, RoleUpdate, PermissionGroup } from '../types';

const API_BASE_URL = '/api/v1/config';

export class RolesApiService {
  /**
   * Obtiene la lista de todos los roles definidos para el gimnasio
   * Incluye el número de usuarios asignados a cada rol
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
      if (response.status === 403) {
        throw new Error('No tiene permisos para ver los roles.');
      }
      throw new Error('Error al cargar los roles');
    }

    return response.json();
  }

  /**
   * Crea un nuevo rol personalizado
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
        throw new Error(error.message || 'Datos inválidos. Verifique que el nombre no exista y los permisos sean válidos.');
      }
      if (response.status === 403) {
        throw new Error('No tiene permisos para crear roles.');
      }
      throw new Error('Error al crear el rol');
    }

    return response.json();
  }

  /**
   * Actualiza un rol existente
   */
  static async updateRole(roleId: string, updateData: RoleUpdate): Promise<Role> {
    const response = await fetch(`${API_BASE_URL}/roles/${roleId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('El rol no existe.');
      }
      if (response.status === 400) {
        const error = await response.json();
        throw new Error(error.message || 'No se puede modificar un rol por defecto.');
      }
      if (response.status === 403) {
        throw new Error('No tiene permisos para actualizar roles.');
      }
      throw new Error('Error al actualizar el rol');
    }

    return response.json();
  }

  /**
   * Elimina un rol personalizado
   */
  static async deleteRole(roleId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/roles/${roleId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('El rol no existe.');
      }
      if (response.status === 409) {
        throw new Error('El rol tiene usuarios asignados. Debe reasignarlos antes de eliminarlo.');
      }
      if (response.status === 400) {
        const error = await response.json();
        throw new Error(error.message || 'No se puede eliminar un rol por defecto del sistema.');
      }
      if (response.status === 403) {
        throw new Error('No tiene permisos para eliminar roles.');
      }
      throw new Error('Error al eliminar el rol');
    }
  }

  /**
   * Obtiene la lista completa de todos los permisos disponibles en el sistema
   * Agrupados por categoría para ser usados en la UI de edición de roles
   */
  static async getPermissions(): Promise<PermissionGroup[]> {
    const response = await fetch(`${API_BASE_URL}/permissions`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('No autorizado. Por favor, inicie sesión nuevamente.');
      }
      if (response.status === 403) {
        throw new Error('No tiene permisos para ver los permisos.');
      }
      throw new Error('Error al cargar los permisos');
    }

    return response.json();
  }
}

