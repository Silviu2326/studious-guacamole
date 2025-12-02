export interface OcupacionItem {
  id: number;
  clase: string;
  hora: string;
  plazas: number;
  asistentes: number;
}

export async function fetchOcupacion(): Promise<OcupacionItem[]> {
  // TODO: Reemplazar por llamada real a `/api/entrenamiento/ocupacion`
  return Promise.resolve([
    { id: 1, clase: 'Cross Training', hora: '18:00', plazas: 20, asistentes: 17 },
    { id: 2, clase: 'Pilates', hora: '09:00', plazas: 15, asistentes: 9 },
  ]);
}


