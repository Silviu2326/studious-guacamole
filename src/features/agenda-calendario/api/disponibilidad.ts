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
      });
    }, 300);
  });
};

