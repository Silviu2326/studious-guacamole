import { Cita, EstadoCita } from '../types';

export const confirmarCita = async (id: string): Promise<Cita> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        titulo: 'Cita confirmada',
        tipo: 'sesion-1-1',
        estado: 'confirmada',
        fechaInicio: new Date(),
        fechaFin: new Date(),
      });
    }, 300);
  });
};

export const cancelarCita = async (id: string, motivo?: string): Promise<Cita> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        titulo: 'Cita cancelada',
        tipo: 'sesion-1-1',
        estado: 'cancelada',
        fechaInicio: new Date(),
        fechaFin: new Date(),
        notas: motivo,
      });
    }, 300);
  });
};

export const cambiarEstadoCita = async (id: string, estado: EstadoCita): Promise<Cita> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        titulo: 'Cita actualizada',
        tipo: 'sesion-1-1',
        estado,
        fechaInicio: new Date(),
        fechaFin: new Date(),
      });
    }, 300);
  });
};

