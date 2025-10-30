import type { UserRole } from '../../../types/auth';

interface AnalyticsRow { recurso: string; periodo: string; ocupacion: number; capacidad?: number; }

export async function getAnalytics(role: UserRole, periodo: string): Promise<{ rows: AnalyticsRow[] }> {
  const base = [
    { recurso: role === 'entrenador' ? 'Cliente: Juan' : 'Clase: Yoga', periodo, ocupacion: 80, capacidad: role === 'gimnasio' ? 20 : undefined },
    { recurso: role === 'entrenador' ? 'Cliente: María' : 'Clase: HIIT', periodo, ocupacion: 88, capacidad: role === 'gimnasio' ? 25 : undefined },
    { recurso: role === 'entrenador' ? 'Cliente: Carlos' : 'Clase: Pilates', periodo, ocupacion: 72, capacidad: role === 'gimnasio' ? 18 : undefined },
  ];
  return { rows: base };
}

export type { AnalyticsRow };