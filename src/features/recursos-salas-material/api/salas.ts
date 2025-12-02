// API para gestión de salas

export interface Sala {
  id: string;
  nombre: string;
  tipo: 'musculacion' | 'cardio' | 'spinning' | 'yoga' | 'boxeo' | 'crossfit' | 'fisioterapia' | 'nutricion';
  capacidad: number;
  ocupacionActual: number;
  estado: 'disponible' | 'ocupada' | 'mantenimiento' | 'bloqueada';
  ubicacion: string;
  equipamiento?: string[];
  horariosDisponibilidad?: HorarioDisponibilidad[];
  ultimaActualizacion: string;
}

export interface HorarioDisponibilidad {
  dia: number; // 0-6 (domingo-sábado)
  horaInicio: string;
  horaFin: string;
}

export interface ReservaSala {
  id: string;
  salaId: string;
  instructorId: string;
  instructorNombre: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  estado: 'confirmada' | 'pendiente' | 'cancelada';
  motivo: string;
  participantesEsperados: number;
}

const API_BASE = '/api/operaciones';
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mockSalas: Sala[] = [
  {
    id: '1',
    nombre: 'Sala de Musculación Principal',
    tipo: 'musculacion',
    capacidad: 50,
    ocupacionActual: 32,
    estado: 'disponible',
    ubicacion: 'Planta 1',
    equipamiento: ['Máquinas de peso', 'Bancas', 'Barras'],
    ultimaActualizacion: new Date().toISOString()
  },
  {
    id: '2',
    nombre: 'Sala de Spinning',
    tipo: 'spinning',
    capacidad: 20,
    ocupacionActual: 15,
    estado: 'ocupada',
    ubicacion: 'Planta 2',
    equipamiento: ['Bicicletas estáticas'],
    ultimaActualizacion: new Date().toISOString()
  },
  {
    id: '3',
    nombre: 'Sala de Yoga',
    tipo: 'yoga',
    capacidad: 25,
    ocupacionActual: 0,
    estado: 'disponible',
    ubicacion: 'Planta 1',
    equipamiento: ['Esterillas', 'Cojines'],
    ultimaActualizacion: new Date().toISOString()
  },
  {
    id: '4',
    nombre: 'Sala de Boxeo',
    tipo: 'boxeo',
    capacidad: 15,
    ocupacionActual: 0,
    estado: 'mantenimiento',
    ubicacion: 'Planta Baja',
    equipamiento: ['Ring', 'Sacos', 'Guantes'],
    ultimaActualizacion: new Date().toISOString()
  }
];

export const salasApi = {
  obtenerSalas: async (filtros?: {
    tipo?: string;
    estado?: string;
    ubicacion?: string;
  }): Promise<Sala[]> => {
    await delay(500);
    let salas = [...mockSalas];
    
    if (filtros?.tipo) {
      salas = salas.filter(s => s.tipo === filtros.tipo);
    }
    if (filtros?.estado) {
      salas = salas.filter(s => s.estado === filtros.estado);
    }
    if (filtros?.ubicacion) {
      salas = salas.filter(s => s.ubicacion.includes(filtros.ubicacion!));
    }
    
    return salas;
  },

  obtenerSalaPorId: async (id: string): Promise<Sala | null> => {
    await delay(500);
    return mockSalas.find(s => s.id === id) || null;
  },

  crearSala: async (sala: Partial<Sala>): Promise<Sala> => {
    await delay(500);
    return {
      id: Date.now().toString(),
      nombre: sala.nombre || '',
      tipo: sala.tipo || 'musculacion',
      capacidad: sala.capacidad || 0,
      ocupacionActual: 0,
      estado: 'disponible',
      ubicacion: sala.ubicacion || '',
      ultimaActualizacion: new Date().toISOString(),
      ...sala
    };
  },

  actualizarSala: async (id: string, datos: Partial<Sala>): Promise<Sala> => {
    await delay(500);
    const index = mockSalas.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Sala no encontrada');
    mockSalas[index] = { ...mockSalas[index], ...datos };
    return mockSalas[index];
  },

  eliminarSala: async (id: string): Promise<void> => {
    await delay(500);
  },

  obtenerReservas: async (filtros?: {
    salaId?: string;
    fecha?: string;
    estado?: string;
  }): Promise<ReservaSala[]> => {
    await delay(500);
    return [];
  },

  crearReserva: async (reserva: Partial<ReservaSala>): Promise<ReservaSala> => {
    await delay(500);
    return {
      id: Date.now().toString(),
      salaId: reserva.salaId || '',
      instructorId: reserva.instructorId || '',
      instructorNombre: reserva.instructorNombre || '',
      fecha: reserva.fecha || new Date().toISOString(),
      horaInicio: reserva.horaInicio || '',
      horaFin: reserva.horaFin || '',
      estado: 'confirmada',
      motivo: reserva.motivo || '',
      participantesEsperados: reserva.participantesEsperados || 0
    };
  },

  cancelarReserva: async (id: string): Promise<void> => {
    await delay(500);
  }
};

