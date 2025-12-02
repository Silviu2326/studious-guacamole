import { Vacacion, VacacionFilters } from '../types';

// Datos mock para desarrollo
const mockVacaciones: Vacacion[] = [
  {
    id: '1',
    personalId: '1',
    fechaInicio: '2025-02-01',
    fechaFin: '2025-02-07',
    tipo: 'vacaciones',
    estado: 'aprobada',
    motivo: 'Vacaciones de invierno',
    createdAt: '2025-01-05T10:00:00Z',
    updatedAt: '2025-01-06T10:00:00Z',
  },
];

export const getVacaciones = async (filters?: VacacionFilters): Promise<Vacacion[]> => {
  try {
    // Simulación de llamada API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filtered = [...mockVacaciones];
    if (filters?.personalId) {
      filtered = filtered.filter(v => v.personalId === filters.personalId);
    }
    if (filters?.fechaDesde) {
      filtered = filtered.filter(v => v.fechaInicio >= filters.fechaDesde!);
    }
    if (filters?.fechaHasta) {
      filtered = filtered.filter(v => v.fechaFin <= filters.fechaHasta!);
    }
    if (filters?.estado) {
      filtered = filtered.filter(v => v.estado === filters.estado);
    }
    if (filters?.tipo) {
      filtered = filtered.filter(v => v.tipo === filters.tipo);
    }

    return filtered;
  } catch (error) {
    console.error('Error fetching vacaciones:', error);
    return [];
  }
};

export const getVacacion = async (id: string): Promise<Vacacion | null> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockVacaciones.find(v => v.id === id) || null;
  } catch (error) {
    console.error('Error fetching vacacion:', error);
    return null;
  }
};

export const createVacacion = async (vacacion: Omit<Vacacion, 'id' | 'createdAt' | 'updatedAt'>): Promise<Vacacion> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    const nuevaVacacion: Vacacion = {
      ...vacacion,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockVacaciones.push(nuevaVacacion);
    return nuevaVacacion;
  } catch (error) {
    console.error('Error creating vacacion:', error);
    throw error;
  }
};

export const updateVacacion = async (id: string, updates: Partial<Vacacion>): Promise<Vacacion> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockVacaciones.findIndex(v => v.id === id);
    if (index === -1) throw new Error('Vacación no encontrada');
    
    const updated = {
      ...mockVacaciones[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    mockVacaciones[index] = updated;
    return updated;
  } catch (error) {
    console.error('Error updating vacacion:', error);
    throw error;
  }
};

export const deleteVacacion = async (id: string): Promise<void> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockVacaciones.findIndex(v => v.id === id);
    if (index === -1) throw new Error('Vacación no encontrada');
    mockVacaciones.splice(index, 1);
  } catch (error) {
    console.error('Error deleting vacacion:', error);
    throw error;
  }
};

