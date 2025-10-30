interface Reserva { id: string; tipo: 'cita' | 'clase'; referenciaId: string; cliente: string; estado: 'confirmada' | 'pendiente' | 'cancelada'; fecha: string; }

let RESERVAS: Reserva[] = [
  { id: 'r1', tipo: 'clase', referenciaId: 'l1', cliente: 'Ana', estado: 'confirmada', fecha: '2025-11-01' },
  { id: 'r2', tipo: 'cita', referenciaId: 'c1', cliente: 'Juan', estado: 'pendiente', fecha: '2025-11-01' },
];

export async function getReservas(): Promise<Reserva[]> { return RESERVAS; }
export async function crearReserva(reserva: Reserva): Promise<void> { RESERVAS = [reserva, ...RESERVAS]; }
export async function cancelarReserva(id: string): Promise<void> { RESERVAS = RESERVAS.filter(r => r.id !== id); }

export type { Reserva };