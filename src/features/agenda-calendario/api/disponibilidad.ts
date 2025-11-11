import { HorarioDisponibilidad, BloqueoAgenda } from '../types';

export const getDisponibilidad = async (fecha: Date, role: 'entrenador' | 'gimnasio'): Promise<HorarioDisponibilidad[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const disponibilidad: HorarioDisponibilidad[] = [
        { id: '1', diaSemana: 1, horaInicio: '09:00', horaFin: '18:00', disponible: true },
        { id: '2', diaSemana: 2, horaInicio: '09:00', horaFin: '18:00', disponible: true },
        { id: '3', diaSemana: 3, horaInicio: '09:00', horaFin: '18:00', disponible: true },
        { id: '4', diaSemana: 4, horaInicio: '09:00', horaFin: '18:00', disponible: true },
        { id: '5', diaSemana: 5, horaInicio: '09:00', horaFin: '18:00', disponible: true },
      ];
      resolve(disponibilidad);
    }, 300);
  });
};

export const getBloqueos = async (fechaInicio: Date, fechaFin: Date): Promise<BloqueoAgenda[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // En producción, esto haría una llamada real al backend
      // Por ahora, retornamos un array vacío, pero con el tipo correcto que incluye los nuevos campos
      const bloqueos: BloqueoAgenda[] = [];
      resolve(bloqueos);
    }, 300);
  });
};

export const crearBloqueo = async (bloqueo: Omit<BloqueoAgenda, 'id'>): Promise<BloqueoAgenda> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...bloqueo,
        id: Date.now().toString(),
        bloqueoCompleto: bloqueo.bloqueoCompleto ?? true, // Por defecto día completo
      });
    }, 300);
  });
};

export const actualizarBloqueo = async (id: string, bloqueo: Partial<BloqueoAgenda>): Promise<BloqueoAgenda> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // En producción, esto haría una llamada real al backend
      resolve({
        id,
        titulo: bloqueo.titulo || '',
        descripcion: bloqueo.descripcion,
        motivo: bloqueo.motivo,
        fechaInicio: bloqueo.fechaInicio || new Date(),
        fechaFin: bloqueo.fechaFin || new Date(),
        tipo: bloqueo.tipo || 'otro',
        recurrente: bloqueo.recurrente,
        bloqueoCompleto: bloqueo.bloqueoCompleto ?? true,
        horaInicio: bloqueo.horaInicio,
        horaFin: bloqueo.horaFin,
      } as BloqueoAgenda);
    }, 300);
  });
};

export const eliminarBloqueo = async (id: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // En producción, esto haría una llamada real al backend
      resolve();
    }, 300);
  });
};

