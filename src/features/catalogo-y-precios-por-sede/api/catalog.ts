import { CatalogItem, CatalogOverride } from '../types';

const API_BASE = '/api/branches';

// Mock data para desarrollo
const mockCatalogItems: CatalogItem[] = [
  {
    itemId: 'item-mem-01',
    name: 'Membresía Premium',
    type: 'membership',
    status: 'override',
    masterPrice: 80,
    branchPrice: 95,
    isActive: true,
    masterItemId: 'item-mem-01',
    description: 'Membresía completa con acceso a todas las instalaciones'
  },
  {
    itemId: 'item-mem-02',
    name: 'Membresía Básica',
    type: 'membership',
    status: 'master',
    masterPrice: 49,
    branchPrice: 49,
    isActive: true,
    masterItemId: 'item-mem-02',
    description: 'Membresía básica con acceso limitado'
  },
  {
    itemId: 'item-class-05',
    name: 'Aquagym',
    type: 'class',
    status: 'master',
    masterPrice: 15,
    branchPrice: 15,
    isActive: false,
    masterItemId: 'item-class-05',
    description: 'Clase de aquagym en piscina'
  },
  {
    itemId: 'item-class-06',
    name: 'Entrenamiento Funcional en la Playa',
    type: 'class',
    status: 'exclusive',
    masterPrice: 0,
    branchPrice: 25,
    isActive: true,
    description: 'Entrenamiento exclusivo en la playa'
  },
  {
    itemId: 'item-prod-01',
    name: 'Batidos de Proteína Marca X',
    type: 'product',
    status: 'master',
    masterPrice: 5.50,
    branchPrice: 5.50,
    isActive: false,
    masterItemId: 'item-prod-01',
    description: 'Batido de proteína'
  },
  {
    itemId: 'item-serv-01',
    name: 'Sesión de Entrenador Personal',
    type: 'service',
    status: 'override',
    masterPrice: 50,
    branchPrice: 65,
    isActive: true,
    masterItemId: 'item-serv-01',
    description: 'Sesión individual con entrenador personal'
  },
];

export const catalogApi = {
  /**
   * Obtiene el catálogo completo para una sede específica
   */
  obtenerBranchCatalog: async (branchId: string): Promise<CatalogItem[]> => {
    try {
      const response = await fetch(`${API_BASE}/${branchId}/catalog`);
      if (!response.ok) {
        if (response.status === 404) throw new Error('Sede no encontrada');
        throw new Error('Error al obtener catálogo');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en obtenerBranchCatalog:', error);
      // Retornar datos mock para desarrollo
      return mockCatalogItems;
    }
  },

  /**
   * Crea o actualiza una sobrescritura para un ítem del catálogo maestro
   */
  crearOverride: async (
    branchId: string,
    masterItemId: string,
    data: { price?: number; isActive?: boolean }
  ): Promise<CatalogOverride> => {
    try {
      const response = await fetch(`${API_BASE}/${branchId}/catalog/overrides`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          masterItemId,
          ...data,
        }),
      });

      if (!response.ok) {
        if (response.status === 400) throw new Error('Datos inválidos o falta masterItemId');
        if (response.status === 404) throw new Error('Ítem maestro no encontrado');
        throw new Error('Error al crear sobrescritura');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en crearOverride:', error);
      throw error;
    }
  },

  /**
   * Elimina una sobrescritura, revirtiendo el ítem al estado maestro
   */
  eliminarOverride: async (branchId: string, masterItemId: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE}/${branchId}/catalog/overrides/${masterItemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        if (response.status === 404) throw new Error('Sobrescritura no encontrada');
        throw new Error('Error al eliminar sobrescritura');
      }
    } catch (error) {
      console.error('Error en eliminarOverride:', error);
      throw error;
    }
  },
};
