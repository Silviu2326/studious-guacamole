export interface Bloqueo {
  id: string;
  fechaInicio: string; // ISO YYYY-MM-DD
  fechaFin: string; // ISO YYYY-MM-DD
  motivo: string;
}

let BLOQUEOS: Bloqueo[] = [
  { id: 'b1', fechaInicio: '2025-11-05', fechaFin: '2025-11-05', motivo: 'Mantenimiento sala' },
  { id: 'b2', fechaInicio: '2025-11-10', fechaFin: '2025-11-11', motivo: 'Evento interno' },
];

export async function getBloqueos(role: 'entrenador' | 'gimnasio'): Promise<Bloqueo[]> {
  // En mock devolvemos la misma lista para ambos roles
  return BLOQUEOS;
}

export async function addBloqueo(bloqueo: Bloqueo): Promise<void> {
  BLOQUEOS = [ { ...bloqueo, id: bloqueo.id || Math.random().toString() }, ...BLOQUEOS ];
}

export async function removeBloqueo(id: string): Promise<void> {
  BLOQUEOS = BLOQUEOS.filter(b => b.id !== id);
}