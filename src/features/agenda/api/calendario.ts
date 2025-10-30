import type { UserRole } from '../../../types/auth';

interface Evento {
  id: string;
  titulo: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  tipo: 'sesion' | 'clase' | 'evaluacion' | 'videollamada';
  capacidad?: number;
  ocupacion?: number;
}

export async function getCalendario(role: UserRole): Promise<Evento[]> {
  // Mock: datos diferenciados por rol
  const hoy = new Date();
  const iso = (d: Date) => d.toISOString().split('T')[0];
  const addDays = (days: number) => new Date(hoy.getTime() + days * 24 * 60 * 60 * 1000);
  if (role === 'entrenador') {
    return [
      { id: 'e1', titulo: 'Sesión 1 a 1: Juan', fecha: iso(addDays(1)), horaInicio: '10:00', horaFin: '11:00', tipo: 'sesion' },
      { id: 'e2', titulo: 'Videollamada: María', fecha: iso(addDays(2)), horaInicio: '12:00', horaFin: '12:45', tipo: 'videollamada' },
      { id: 'e3', titulo: 'Evaluación: Carlos', fecha: iso(addDays(3)), horaInicio: '09:00', horaFin: '10:00', tipo: 'evaluacion' },
    ];
  }
  return [
    { id: 'e4', titulo: 'Yoga', fecha: iso(addDays(1)), horaInicio: '18:00', horaFin: '19:00', tipo: 'clase', capacidad: 20, ocupacion: 16 },
    { id: 'e5', titulo: 'HIIT', fecha: iso(addDays(2)), horaInicio: '19:00', horaFin: '20:00', tipo: 'clase', capacidad: 25, ocupacion: 22 },
    { id: 'e6', titulo: 'Fisioterapia', fecha: iso(addDays(3)), horaInicio: '11:00', horaFin: '12:00', tipo: 'evaluacion', capacidad: 1, ocupacion: 1 },
  ];
}