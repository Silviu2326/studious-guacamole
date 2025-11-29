export interface AforoActual {
  personasDentro: number;
  capacidadMaxima: number;
  porcentajeOcupacion: number;
  estado: 'normal' | 'alerta' | 'completo';
  ultimaActualizacion: string;
}

export interface AforoPorZona {
  zona: string;
  personas: number;
  capacidad: number;
  porcentaje: number;
  estado: 'normal' | 'alerta' | 'completo';
}

export interface AforoConfiguracion {
  capacidadMaxima: number;
  limiteAlerta: number;
  limiteCompleto: number;
  zonas: Array<{
    nombre: string;
    capacidad: number;
  }>;
}

export interface ConteoPersona {
  id?: string;
  clienteId?: string;
  tipo: 'entrada' | 'salida';
  zona?: string;
  fechaHora: string;
  sensorId?: string;
  createdAt?: string;
}

export async function obtenerAforoActual(): Promise<AforoActual> {
  const res = await fetch('/api/operaciones/aforo');
  if (!res.ok) {
    return {
      personasDentro: 0,
      capacidadMaxima: 100,
      porcentajeOcupacion: 0,
      estado: 'normal',
      ultimaActualizacion: new Date().toISOString(),
    };
  }
  return res.json();
}

export async function obtenerAforoPorZona(): Promise<AforoPorZona[]> {
  const res = await fetch('/api/operaciones/aforo/zonas');
  if (!res.ok) return [];
  return res.json();
}

export async function actualizarContadorAforo(
  cambio: Omit<ConteoPersona, 'id' | 'createdAt'>
): Promise<ConteoPersona | null> {
  const res = await fetch('/api/operaciones/aforo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cambio),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function obtenerConfiguracionAforo(): Promise<AforoConfiguracion> {
  const res = await fetch('/api/operaciones/aforo/configuracion');
  if (!res.ok) {
    return {
      capacidadMaxima: 100,
      limiteAlerta: 90,
      limiteCompleto: 100,
      zonas: [],
    };
  }
  return res.json();
}

export async function actualizarConfiguracionAforo(
  config: Partial<AforoConfiguracion>
): Promise<boolean> {
  const res = await fetch('/api/operaciones/aforo/configuracion', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });
  return res.ok;
}

export async function obtenerHistorialAforo(
  fechaInicio?: string,
  fechaFin?: string
): Promise<Array<{ fecha: string; personas: number; porcentaje: number }>> {
  const params = new URLSearchParams();
  if (fechaInicio) params.append('fechaInicio', fechaInicio);
  if (fechaFin) params.append('fechaFin', fechaFin);
  
  const res = await fetch(`/api/operaciones/aforo/historial?${params.toString()}`);
  if (!res.ok) return [];
  return res.json();
}

