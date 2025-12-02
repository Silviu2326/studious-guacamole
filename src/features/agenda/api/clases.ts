export interface Clase { id: string; clase: string; fecha: string; inicio: string; fin: string; capacidad: number; ocupacion: number; instructor: string; }

let CLASES: Clase[] = [
  { id: 'l1', clase: 'Yoga Matutino', fecha: new Date().toISOString().split('T')[0], inicio: '07:00', fin: '08:00', capacidad: 20, ocupacion: 16, instructor: 'Laura Torres' },
  { id: 'l2', clase: 'HIIT', fecha: new Date().toISOString().split('T')[0], inicio: '19:00', fin: '20:00', capacidad: 25, ocupacion: 22, instructor: 'Carlos Méndez' },
  { id: 'l3', clase: 'Spinning', fecha: new Date(Date.now() + 86400000).toISOString().split('T')[0], inicio: '08:00', fin: '09:00', capacidad: 30, ocupacion: 28, instructor: 'Elena Sánchez' },
  { id: 'l4', clase: 'Pilates', fecha: new Date(Date.now() + 86400000).toISOString().split('T')[0], inicio: '18:30', fin: '19:30', capacidad: 15, ocupacion: 12, instructor: 'Roberto Martín' },
  { id: 'l5', clase: 'Funcional', fecha: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0], inicio: '19:00', fin: '20:00', capacidad: 20, ocupacion: 18, instructor: 'Carlos Méndez' },
  { id: 'l6', clase: 'Stretching', fecha: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0], inicio: '09:00', fin: '10:00', capacidad: 18, ocupacion: 14, instructor: 'Laura Torres' },
];

export async function getClases(): Promise<Clase[]> { 
  await new Promise(resolve => setTimeout(resolve, 300));
  return CLASES; 
}

export async function publicarClase(clase: Clase): Promise<void> { 
  await new Promise(resolve => setTimeout(resolve, 400));
  CLASES = [clase, ...CLASES]; 
}

export async function cancelarClase(id: string): Promise<void> { 
  await new Promise(resolve => setTimeout(resolve, 300));
  CLASES = CLASES.filter(c => c.id !== id); 
}