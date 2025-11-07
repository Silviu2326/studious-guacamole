import { ControlHorario, ControlHorarioFilters } from '../types';

const API_BASE = '/api/rrhh/control-horarios';

// Datos mock para desarrollo
const mockControlHorarios: ControlHorario[] = [
  {
    id: '1',
    personalId: '1',
    fecha: '2025-01-20',
    horaEntrada: '09:05',
    horaSalida: '13:02',
    horaInicioPlanificada: '09:00',
    horaFinPlanificada: '13:00',
    cumplido: true,
    incidencias: [],
    createdAt: '2025-01-20T09:05:00Z',
    updatedAt: '2025-01-20T13:02:00Z',
  },
  {
    id: '2',
    personalId: '2',
    fecha: '2025-01-20',
    horaEntrada: '13:15',
    horaSalida: null,
    horaInicioPlanificada: '13:00',
    horaFinPlanificada: '17:00',
    cumplido: false,
    incidencias: [
      {
        tipo: 'retraso',
        descripcion: 'Retraso de 15 minutos',
        hora: '13:15',
      },
    ],
    createdAt: '2025-01-20T13:15:00Z',
    updatedAt: '2025-01-20T13:15:00Z',
  },
  {
    id: '3',
    personalId: '3',
    fecha: '2025-01-19',
    horaEntrada: null,
    horaSalida: null,
    horaInicioPlanificada: '17:00',
    horaFinPlanificada: '22:00',
    cumplido: false,
    incidencias: [
      {
        tipo: 'ausencia',
        descripcion: 'Ausencia no justificada',
      },
    ],
    createdAt: '2025-01-19T17:00:00Z',
    updatedAt: '2025-01-19T17:00:00Z',
  },
];

export const getControlHorarios = async (filters?: ControlHorarioFilters): Promise<ControlHorario[]> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filtered = [...mockControlHorarios];
    
    if (filters?.personalId) {
      filtered = filtered.filter(ch => ch.personalId === filters.personalId);
    }
    if (filters?.fechaDesde) {
      filtered = filtered.filter(ch => ch.fecha >= filters.fechaDesde!);
    }
    if (filters?.fechaHasta) {
      filtered = filtered.filter(ch => ch.fecha <= filters.fechaHasta!);
    }
    if (filters?.cumplido !== undefined) {
      filtered = filtered.filter(ch => ch.cumplido === filters.cumplido);
    }

    return filtered;
  } catch (error) {
    console.error('Error fetching control horarios:', error);
    return [];
  }
};

export const getControlHorario = async (id: string): Promise<ControlHorario | null> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockControlHorarios.find(ch => ch.id === id) || null;
  } catch (error) {
    console.error('Error fetching control horario:', error);
    return null;
  }
};

export const registrarEntrada = async (personalId: string, fecha: string, hora: string): Promise<ControlHorario> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    const control: ControlHorario = {
      id: Date.now().toString(),
      personalId,
      fecha,
      horaEntrada: hora,
      horaInicioPlanificada: '09:00', // Debería venir del turno asignado
      horaFinPlanificada: '13:00',
      cumplido: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockControlHorarios.push(control);
    return control;
  } catch (error) {
    console.error('Error registrando entrada:', error);
    throw error;
  }
};

export const registrarSalida = async (id: string, hora: string): Promise<ControlHorario> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockControlHorarios.findIndex(ch => ch.id === id);
    if (index === -1) throw new Error('Control de horario no encontrado');
    
    mockControlHorarios[index].horaSalida = hora;
    mockControlHorarios[index].updatedAt = new Date().toISOString();
    return mockControlHorarios[index];
  } catch (error) {
    console.error('Error registrando salida:', error);
    throw error;
  }
};

export const registrarIncidencia = async (id: string, incidencia: { tipo: string; descripcion: string; hora?: string }): Promise<ControlHorario> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockControlHorarios.findIndex(ch => ch.id === id);
    if (index === -1) throw new Error('Control de horario no encontrado');
    
    if (!mockControlHorarios[index].incidencias) {
      mockControlHorarios[index].incidencias = [];
    }
    mockControlHorarios[index].incidencias!.push(incidencia);
    mockControlHorarios[index].cumplido = false;
    mockControlHorarios[index].updatedAt = new Date().toISOString();
    return mockControlHorarios[index];
  } catch (error) {
    console.error('Error registrando incidencia:', error);
    throw error;
  }
};


