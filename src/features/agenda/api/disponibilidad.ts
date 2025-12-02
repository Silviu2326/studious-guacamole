export interface Franja { id: string; dia: string; inicio: string; fin: string; tipo: 'general' | 'videollamada' | 'evaluacion' | 'clase'; }

let DISPONIBILIDAD: Franja[] = [
  { id: 'd1', dia: 'L', inicio: '09:00', fin: '12:00', tipo: 'general' },
  { id: 'd2', dia: 'M', inicio: '16:00', fin: '20:00', tipo: 'videollamada' },
  { id: 'd3', dia: 'X', inicio: '18:00', fin: '21:00', tipo: 'clase' },
  { id: 'd4', dia: 'J', inicio: '10:00', fin: '13:00', tipo: 'general' },
  { id: 'd5', dia: 'V', inicio: '09:00', fin: '18:00', tipo: 'general' },
  { id: 'd6', dia: 'S', inicio: '10:00', fin: '14:00', tipo: 'evaluacion' },
];

export async function getDisponibilidad(role: 'entrenador' | 'gimnasio'): Promise<Franja[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // En mock diferenciamos mínimamente por rol
  if (role === 'gimnasio') {
    return DISPONIBILIDAD.map(f => f.tipo === 'videollamada' ? { ...f, tipo: 'clase' } : f);
  }
  return DISPONIBILIDAD;
}

export async function addDisponibilidad(franja: Franja): Promise<void> { 
  await new Promise(resolve => setTimeout(resolve, 300));
  DISPONIBILIDAD = [{ ...franja, id: franja.id || Date.now().toString() }, ...DISPONIBILIDAD]; 
}

export async function removeDisponibilidad(id: string): Promise<void> { 
  await new Promise(resolve => setTimeout(resolve, 300));
  DISPONIBILIDAD = DISPONIBILIDAD.filter(f => f.id !== id); 
}