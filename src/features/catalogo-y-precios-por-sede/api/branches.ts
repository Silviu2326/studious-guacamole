import { Branch } from '../types';

const API_BASE = '/api/branches';

// Mock data para desarrollo
const mockBranches: Branch[] = [
  {
    id: 'branch-001',
    name: 'Sede Centro Urbano',
    location: 'Madrid'
  },
  {
    id: 'branch-002',
    name: 'Sede Costa del Sol',
    location: 'Málaga'
  },
  {
    id: 'branch-003',
    name: 'Sede Norte',
    location: 'Bilbao'
  },
  {
    id: 'branch-004',
    name: 'Sede Sur',
    location: 'Sevilla'
  },
];

export const branchesApi = {
  /**
   * Obtiene una lista de todas las sedes disponibles
   */
  obtenerBranches: async (activeOnly?: boolean): Promise<Branch[]> => {
    try {
      const params = new URLSearchParams();
      if (activeOnly) {
        params.append('activeOnly', 'true');
      }

      const response = await fetch(`${API_BASE}?${params.toString()}`);
      if (!response.ok) {
        if (response.status === 401) throw new Error('No autorizado');
        if (response.status === 403) throw new Error('Sin permisos para acceder a las sedes');
        throw new Error('Error al obtener sedes');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en obtenerBranches:', error);
      // Retornar datos mock para desarrollo
      return mockBranches;
    }
  },
};
