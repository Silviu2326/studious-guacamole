interface Reserva { id: string; tipo: 'cita' | 'clase'; referenciaId: string; cliente: string; estado: 'confirmada' | 'pendiente' | 'cancelada'; fecha: string; }

let RESERVAS: Reserva[] = [
  { id: 'r1', tipo: 'clase', referenciaId: 'l1', cliente: 'Ana López', estado: 'confirmada', fecha: new Date().toISOString().split('T')[0] },
  { id: 'r2', tipo: 'cita', referenciaId: 'c1', cliente: 'Juan Pérez', estado: 'pendiente', fecha: new Date().toISOString().split('T')[0] },
  { id: 'r3', tipo: 'clase', referenciaId: 'l2', cliente: 'Diego Fernández', estado: 'confirmada', fecha: new Date().toISOString().split('T')[0] },
  { id: 'r4', tipo: 'clase', referenciaId: 'l1', cliente: 'Elena Sánchez', estado: 'confirmada', fecha: new Date().toISOString().split('T')[0] },
  { id: 'r5', tipo: 'cita', referenciaId: 'c2', cliente: 'María García', estado: 'confirmada', fecha: new Date(Date.now() + 86400000).toISOString().split('T')[0] },
  { id: 'r6', tipo: 'clase', referenciaId: 'l3', cliente: 'Roberto Martín', estado: 'pendiente', fecha: new Date(Date.now() + 86400000).toISOString().split('T')[0] },
  { id: 'r7', tipo: 'clase', referenciaId: 'l2', cliente: 'Laura Torres', estado: 'confirmada', fecha: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0] },
  { id: 'r8', tipo: 'cita', referenciaId: 'c3', cliente: 'Carlos Ruiz', estado: 'confirmada', fecha: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0] },
];

export async function getReservas(): Promise<Reserva[]> { 
  await new Promise(resolve => setTimeout(resolve, 300));
  return RESERVAS; 
}

export async function crearReserva(reserva: Reserva): Promise<void> { 
  await new Promise(resolve => setTimeout(resolve, 400));
  RESERVAS = [reserva, ...RESERVAS]; 
}

export async function cancelarReserva(id: string): Promise<void> { 
  await new Promise(resolve => setTimeout(resolve, 300));
  RESERVAS = RESERVAS.filter(r => r.id !== id); 
}

export type { Reserva };