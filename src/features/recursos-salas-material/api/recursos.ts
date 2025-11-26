// API para recursos generales

export interface Recurso {
  id: string;
  nombre: string;
  tipo: 'sala' | 'material' | 'equipamiento';
  estado: 'disponible' | 'ocupado' | 'mantenimiento' | 'bloqueado';
  ubicacion?: string;
  capacidad?: number;
  ocupacionActual?: number;
  ultimaActualizacion: string;
}

const API_BASE = '/api/operaciones';
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const recursosApi = {
  obtenerRecursos: async (filtros?: {
    tipo?: string;
    estado?: string;
    ubicacion?: string;
  }): Promise<Recurso[]> => {
    await delay(500);
    return [];
  },

  obtenerRecursoPorId: async (id: string): Promise<Recurso | null> => {
    await delay(500);
    return null;
  },

  crearRecurso: async (recurso: Partial<Recurso>): Promise<Recurso> => {
    await delay(500);
    return {
      id: Date.now().toString(),
      nombre: recurso.nombre || '',
      tipo: recurso.tipo || 'material',
      estado: 'disponible',
      ultimaActualizacion: new Date().toISOString(),
      ...recurso
    };
  },

  actualizarRecurso: async (id: string, datos: Partial<Recurso>): Promise<Recurso> => {
    await delay(500);
    throw new Error('No implementado');
  },

  eliminarRecurso: async (id: string): Promise<void> => {
    await delay(500);
  }
};

