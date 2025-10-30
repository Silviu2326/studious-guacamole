export interface Franja { id: string; dia: string; inicio: string; fin: string; tipo: 'general' | 'videollamada' | 'evaluacion' | 'clase'; }

let DISPONIBILIDAD: Franja[] = [
  { id: 'd1', dia: 'L', inicio: '09:00', fin: '12:00', tipo: 'general' },
  { id: 'd2', dia: 'M', inicio: '16:00', fin: '20:00', tipo: 'videollamada' },
  { id: 'd3', dia: 'X', inicio: '18:00', fin: '21:00', tipo: 'clase' },
];

export async function getDisponibilidad(role: 'entrenador' | 'gimnasio'): Promise<Franja[]> {
  // En mock diferenciamos mínimamente por rol
  if (role === 'gimnasio') {
    return DISPONIBILIDAD.map(f => f.tipo === 'videollamada' ? { ...f, tipo: 'clase' } : f);
  }
  return DISPONIBILIDAD;
}

export async function addDisponibilidad(franja: Franja): Promise<void> { DISPONIBILIDAD = [franja, ...DISPONIBILIDAD]; }
export async function removeDisponibilidad(id: string): Promise<void> { DISPONIBILIDAD = DISPONIBILIDAD.filter(f => f.id !== id); }