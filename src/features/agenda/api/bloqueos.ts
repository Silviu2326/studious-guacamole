export interface Bloqueo {
  id: string;
  fechaInicio: string; // ISO YYYY-MM-DD
  fechaFin: string; // ISO YYYY-MM-DD
  motivo: string;
}

let BLOQUEOS: Bloqueo[] = [
  { id: 'b1', fechaInicio: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0], fechaFin: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0], motivo: 'Mantenimiento sala de pesas' },
  { id: 'b2', fechaInicio: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0], fechaFin: new Date(Date.now() + 11 * 86400000).toISOString().split('T')[0], motivo: 'Evento interno corporativo' },
  { id: 'b3', fechaInicio: new Date(Date.now() + 20 * 86400000).toISOString().split('T')[0], fechaFin: new Date(Date.now() + 20 * 86400000).toISOString().split('T')[0], motivo: 'Reforma sala de spinning' },
  { id: 'b4', fechaInicio: new Date(Date.now() + 25 * 86400000).toISOString().split('T')[0], fechaFin: new Date(Date.now() + 26 * 86400000).toISOString().split('T')[0], motivo: 'Capacitación de instructores' },
];

export async function getBloqueos(role: 'entrenador' | 'gimnasio'): Promise<Bloqueo[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  // En mock devolvemos la misma lista para ambos roles
  return BLOQUEOS;
}

export async function addBloqueo(bloqueo: Bloqueo): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 400));
  BLOQUEOS = [ { ...bloqueo, id: bloqueo.id || Date.now().toString() }, ...BLOQUEOS ];
}

export async function removeBloqueo(id: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 300));
  BLOQUEOS = BLOQUEOS.filter(b => b.id !== id);
}