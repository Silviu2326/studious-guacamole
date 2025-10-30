export interface Clase { id: string; clase: string; fecha: string; inicio: string; fin: string; capacidad: number; ocupacion: number; instructor: string; }

let CLASES: Clase[] = [
  { id: 'l1', clase: 'Yoga', fecha: '2025-11-01', inicio: '18:00', fin: '19:00', capacidad: 20, ocupacion: 16, instructor: 'Laura' },
  { id: 'l2', clase: 'HIIT', fecha: '2025-11-02', inicio: '19:00', fin: '20:00', capacidad: 25, ocupacion: 22, instructor: 'Carlos' },
];

export async function getClases(): Promise<Clase[]> { return CLASES; }
export async function publicarClase(clase: Clase): Promise<void> { CLASES = [clase, ...CLASES]; }
export async function cancelarClase(id: string): Promise<void> { CLASES = CLASES.filter(c => c.id !== id); }