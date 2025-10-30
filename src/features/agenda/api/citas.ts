interface Cita { id: string; cliente: string; tipo: '1a1' | 'videollamada' | 'evaluacion'; fecha: string; inicio: string; fin: string; }

let CITAS: Cita[] = [
  { id: 'c1', cliente: 'Juan Pérez', tipo: '1a1', fecha: '2025-11-01', inicio: '10:00', fin: '11:00' },
  { id: 'c2', cliente: 'María García', tipo: 'videollamada', fecha: '2025-11-02', inicio: '12:00', fin: '12:45' },
];

export async function getCitas(): Promise<Cita[]> {
  return CITAS;
}

export async function crearCita(cita: Cita): Promise<void> {
  CITAS = [cita, ...CITAS];
}

export async function cancelarCita(id: string): Promise<void> {
  CITAS = CITAS.filter(c => c.id !== id);
}

export type { Cita };