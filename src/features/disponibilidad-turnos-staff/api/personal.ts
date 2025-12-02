import { Personal } from '../types';

// Datos mock para desarrollo
const mockPersonal: Personal[] = [
  {
    id: '1',
    nombre: 'Juan',
    apellidos: 'Pérez',
    email: 'juan.perez@gimnasio.com',
    telefono: '+34 600 123 456',
    tipo: 'entrenador',
    especialidad: 'Fuerza y acondicionamiento',
    estado: 'activo',
    fechaIngreso: '2023-01-15',
    horarioBase: {
      inicio: '09:00',
      fin: '13:00',
      dias: [1, 2, 3, 4, 5],
    },
  },
  {
    id: '2',
    nombre: 'María',
    apellidos: 'García',
    email: 'maria.garcia@gimnasio.com',
    telefono: '+34 600 234 567',
    tipo: 'fisioterapeuta',
    especialidad: 'Rehabilitación deportiva',
    estado: 'activo',
    fechaIngreso: '2023-03-20',
    horarioBase: {
      inicio: '13:00',
      fin: '17:00',
      dias: [1, 2, 3, 4, 5],
    },
  },
  {
    id: '3',
    nombre: 'Carlos',
    apellidos: 'López',
    email: 'carlos.lopez@gimnasio.com',
    tipo: 'recepcionista',
    estado: 'activo',
    fechaIngreso: '2022-06-10',
  },
];

export const getPersonal = async (): Promise<Personal[]> => {
  try {
    // Simulación de llamada API
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockPersonal];
  } catch (error) {
    console.error('Error fetching personal:', error);
    return [];
  }
};

export const getPersonalById = async (id: string): Promise<Personal | null> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockPersonal.find(p => p.id === id) || null;
  } catch (error) {
    console.error('Error fetching personal:', error);
    return null;
  }
};

export const createPersonal = async (personal: Omit<Personal, 'id'>): Promise<Personal> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    const nuevoPersonal: Personal = {
      ...personal,
      id: Date.now().toString(),
    };
    mockPersonal.push(nuevoPersonal);
    return nuevoPersonal;
  } catch (error) {
    console.error('Error creating personal:', error);
    throw error;
  }
};

export const updatePersonal = async (id: string, updates: Partial<Personal>): Promise<Personal> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockPersonal.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Personal no encontrado');
    
    const updated = {
      ...mockPersonal[index],
      ...updates,
    };
    mockPersonal[index] = updated;
    return updated;
  } catch (error) {
    console.error('Error updating personal:', error);
    throw error;
  }
};

export const deletePersonal = async (id: string): Promise<void> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockPersonal.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Personal no encontrado');
    mockPersonal.splice(index, 1);
  } catch (error) {
    console.error('Error deleting personal:', error);
    throw error;
  }
};

