export interface Asignacion {
  id: string;
  programaId: string;
  programaNombre?: string;
  clienteId?: string;
  clienteNombre?: string;
  grupoId?: string;
  grupoNombre?: string;
  fechaInicio: string;
  fechaFin?: string;
  estado: 'activa' | 'pausada' | 'completada' | 'cancelada';
  progreso?: number;
  notas?: string;
  fechaAsignacion: string;
}

export interface AsignacionInput {
  programaId: string;
  clienteId?: string;
  grupoId?: string;
  fechaInicio: string;
  fechaFin?: string;
  notas?: string;
}

export async function getAsignaciones(filtros?: {
  programaId?: string;
  clienteId?: string;
  grupoId?: string;
  estado?: string;
}): Promise<Asignacion[]> {
  try {
    const params = new URLSearchParams();
    if (filtros) {
      if (filtros.programaId) params.append('programaId', filtros.programaId);
      if (filtros.clienteId) params.append('clienteId', filtros.clienteId);
      if (filtros.grupoId) params.append('grupoId', filtros.grupoId);
      if (filtros.estado) params.append('estado', filtros.estado);
    }
    
    const res = await fetch(`/api/entrenamiento/asignaciones?${params.toString()}`);
    if (!res.ok) throw new Error('Error al obtener asignaciones');
    return res.json();
  } catch (error) {
    console.error('Error fetching asignaciones:', error);
    return [];
  }
}

export async function asignarPrograma(data: AsignacionInput): Promise<Asignacion | null> {
  try {
    const res = await fetch('/api/entrenamiento/asignar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al asignar programa');
    return res.json();
  } catch (error) {
    console.error('Error assigning programa:', error);
    return null;
  }
}

export async function actualizarAsignacion(id: string, data: Partial<Asignacion>): Promise<boolean> {
  try {
    const res = await fetch(`/api/entrenamiento/asignaciones/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch (error) {
    console.error('Error updating asignacion:', error);
    return false;
  }
}

export async function eliminarAsignacion(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/entrenamiento/asignaciones/${id}`, { method: 'DELETE' });
    return res.ok;
  } catch (error) {
    console.error('Error deleting asignacion:', error);
    return false;
  }
}

