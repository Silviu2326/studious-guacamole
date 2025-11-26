export interface CumplimientoSesion {
  id: number;
  fecha: string;
  sesion: string;
  estado: 'Completada' | 'No completada';
  observaciones?: string;
}

export async function fetchCumplimientoCliente(clienteId: number): Promise<CumplimientoSesion[]> {
  // TODO: Reemplazar por llamada real a `/api/entrenamiento/cumplimiento` o `/api/entrenamiento/adherencia/cliente/:id`
  return Promise.resolve([
    { id: 1, fecha: '2025-10-25', sesion: 'Fuerza Tren Superior', estado: 'Completada' },
    { id: 2, fecha: '2025-10-27', sesion: 'Cardio Interválico', estado: 'No completada', observaciones: 'Fatiga' },
  ]);
}


