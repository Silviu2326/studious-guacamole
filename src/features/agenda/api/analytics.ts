import type { UserRole } from '../../../types/auth';

interface AnalyticsRow { recurso: string; periodo: string; ocupacion: number; capacidad?: number; }

export async function getAnalytics(role: UserRole, periodo: string): Promise<{ rows: AnalyticsRow[] }> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const base = [
    { recurso: role === 'entrenador' ? 'Cliente: Juan Pérez' : 'Clase: Yoga Matutino', periodo, ocupacion: 80, capacidad: role === 'gimnasio' ? 20 : undefined },
    { recurso: role === 'entrenador' ? 'Cliente: María García' : 'Clase: HIIT', periodo, ocupacion: 88, capacidad: role === 'gimnasio' ? 25 : undefined },
    { recurso: role === 'entrenador' ? 'Cliente: Carlos Ruiz' : 'Clase: Pilates', periodo, ocupacion: 72, capacidad: role === 'gimnasio' ? 18 : undefined },
    { recurso: role === 'entrenador' ? 'Cliente: Ana Martínez' : 'Clase: Spinning', periodo, ocupacion: 93, capacidad: role === 'gimnasio' ? 30 : undefined },
    { recurso: role === 'entrenador' ? 'Cliente: Luis García' : 'Clase: Funcional', periodo, ocupacion: 90, capacidad: role === 'gimnasio' ? 20 : undefined },
  ];
  return { rows: base };
}

export type { AnalyticsRow };