import { Turno, TurnoFilters } from '../types';

const API_BASE = '/api/rrhh/turnos';

// Datos mock para desarrollo
const mockTurnos: Turno[] = [
  {
    id: '1',
    personalId: '1',
    fecha: '2025-01-20',
    tipo: 'mañana',
    horaInicio: '09:00',
    horaFin: '13:00',
    estado: 'asignado',
    notas: 'Turno matutino regular',
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2025-01-10T10:00:00Z',
  },
  {
    id: '2',
    personalId: '2',
    fecha: '2025-01-20',
    tipo: 'tarde',
    horaInicio: '13:00',
    horaFin: '17:00',
    estado: 'confirmado',
    notas: 'Turno vespertino',
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2025-01-11T10:00:00Z',
  },
  {
    id: '3',
    personalId: '3',
    fecha: '2025-01-20',
    tipo: 'noche',
    horaInicio: '17:00',
    horaFin: '22:00',
    estado: 'completado',
    notas: 'Turno nocturno',
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2025-01-20T22:00:00Z',
  },
];

export const getTurnos = async (filters?: TurnoFilters): Promise<Turno[]> => {
  try {
    // Simulación de llamada API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filtered = [...mockTurnos];
    
    if (filters?.personalId) {
      filtered = filtered.filter(t => t.personalId === filters.personalId);
    }
    if (filters?.fechaDesde) {
      filtered = filtered.filter(t => t.fecha >= filters.fechaDesde!);
    }
    if (filters?.fechaHasta) {
      filtered = filtered.filter(t => t.fecha <= filters.fechaHasta!);
    }
    if (filters?.tipo) {
      filtered = filtered.filter(t => t.tipo === filters.tipo);
    }
    if (filters?.estado) {
      filtered = filtered.filter(t => t.estado === filters.estado);
    }

    return filtered;
  } catch (error) {
    console.error('Error fetching turnos:', error);
    return [];
  }
};

export const getTurno = async (id: string): Promise<Turno | null> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockTurnos.find(t => t.id === id) || null;
  } catch (error) {
    console.error('Error fetching turno:', error);
    return null;
  }
};

export const createTurno = async (turno: Omit<Turno, 'id' | 'createdAt' | 'updatedAt'>): Promise<Turno> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    const nuevoTurno: Turno = {
      ...turno,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockTurnos.push(nuevoTurno);
    return nuevoTurno;
  } catch (error) {
    console.error('Error creating turno:', error);
    throw error;
  }
};

export const updateTurno = async (id: string, updates: Partial<Turno>): Promise<Turno> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockTurnos.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Turno no encontrado');
    
    const updated = {
      ...mockTurnos[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    mockTurnos[index] = updated;
    return updated;
  } catch (error) {
    console.error('Error updating turno:', error);
    throw error;
  }
};

export const deleteTurno = async (id: string): Promise<void> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockTurnos.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Turno no encontrado');
    mockTurnos.splice(index, 1);
  } catch (error) {
    console.error('Error deleting turno:', error);
    throw error;
  }
};


