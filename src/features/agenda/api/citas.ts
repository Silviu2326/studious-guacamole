interface Cita { id: string; cliente: string; tipo: '1a1' | 'videollamada' | 'evaluacion'; fecha: string; inicio: string; fin: string; }

let CITAS: Cita[] = [
  { id: 'c1', cliente: 'Juan Pérez', tipo: '1a1', fecha: new Date().toISOString().split('T')[0], inicio: '10:00', fin: '11:00' },
  { id: 'c2', cliente: 'María García', tipo: 'videollamada', fecha: new Date(Date.now() + 86400000).toISOString().split('T')[0], inicio: '12:00', fin: '12:45' },
  { id: 'c3', cliente: 'Carlos Ruiz', tipo: 'evaluacion', fecha: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0], inicio: '09:00', fin: '10:00' },
  { id: 'c4', cliente: 'Ana Martínez', tipo: '1a1', fecha: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0], inicio: '16:00', fin: '17:00' },
  { id: 'c5', cliente: 'Luis García', tipo: 'videollamada', fecha: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0], inicio: '11:00', fin: '11:30' },
  { id: 'c6', cliente: 'Sofia López', tipo: '1a1', fecha: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0], inicio: '15:00', fin: '16:00' },
];

export async function getCitas(): Promise<Cita[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return CITAS;
}

export async function crearCita(cita: Cita): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 400));
  CITAS = [cita, ...CITAS];
}

export async function cancelarCita(id: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 300));
  CITAS = CITAS.filter(c => c.id !== id);
}

export type { Cita };