export interface AdherenciaCliente {
  id: number;
  nombre: string;
  adherencia: number; // 0-100
}

export async function fetchAdherencia(): Promise<AdherenciaCliente[]> {
  // TODO: Reemplazar por llamada real a `/api/entrenamiento/adherencia`
  return Promise.resolve([
    { id: 1, nombre: 'María P.', adherencia: 88 },
    { id: 2, nombre: 'Luis G.', adherencia: 62 },
  ]);
}


