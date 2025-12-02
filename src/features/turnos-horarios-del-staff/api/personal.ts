import { Personal } from '../types';

const API_BASE = '/api/rrhh/personal';

// Datos mock para desarrollo
const mockPersonal: Personal[] = [
  {
    id: '1',
    nombre: 'Juan',
    apellidos: 'García',
    email: 'juan.garcia@example.com',
    telefono: '600123456',
    tipo: 'entrenador',
    especialidad: 'Fuerza y acondicionamiento',
    estado: 'activo',
    fechaIngreso: '2024-01-15',
    horarioBase: {
      inicio: '09:00',
      fin: '17:00',
      dias: [1, 2, 3, 4, 5],
    },
  },
  {
    id: '2',
    nombre: 'María',
    apellidos: 'López',
    email: 'maria.lopez@example.com',
    telefono: '600234567',
    tipo: 'fisioterapeuta',
    especialidad: 'Lesiones deportivas',
    estado: 'activo',
    fechaIngreso: '2024-02-01',
    horarioBase: {
      inicio: '10:00',
      fin: '18:00',
      dias: [1, 2, 3, 4, 5],
    },
  },
  {
    id: '3',
    nombre: 'Carlos',
    apellidos: 'Martínez',
    email: 'carlos.martinez@example.com',
    telefono: '600345678',
    tipo: 'recepcionista',
    estado: 'activo',
    fechaIngreso: '2024-01-10',
    horarioBase: {
      inicio: '08:00',
      fin: '16:00',
      dias: [1, 2, 3, 4, 5],
    },
  },
  {
    id: '4',
    nombre: 'Ana',
    apellidos: 'Rodríguez',
    email: 'ana.rodriguez@example.com',
    telefono: '600456789',
    tipo: 'instructor_clases',
    especialidad: 'Yoga',
    estado: 'activo',
    fechaIngreso: '2024-03-01',
  },
  {
    id: '5',
    nombre: 'Luis',
    apellidos: 'Fernández',
    email: 'luis.fernandez@example.com',
    telefono: '600567890',
    tipo: 'supervisor',
    estado: 'activo',
    fechaIngreso: '2023-06-15',
  },
];

export const getPersonal = async (): Promise<Personal[]> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockPersonal.filter(p => p.estado === 'activo');
  } catch (error) {
    console.error('Error fetching personal:', error);
    return [];
  }
};

export const getPersonalPorId = async (id: string): Promise<Personal | null> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockPersonal.find(p => p.id === id) || null;
  } catch (error) {
    console.error('Error fetching personal:', error);
    return null;
  }
};

export const getPersonalPorTipo = async (tipo: string): Promise<Personal[]> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockPersonal.filter(p => p.tipo === tipo && p.estado === 'activo');
  } catch (error) {
    console.error('Error fetching personal por tipo:', error);
    return [];
  }
};


