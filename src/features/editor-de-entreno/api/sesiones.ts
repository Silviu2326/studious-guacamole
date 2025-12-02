import { SesionEntrenamiento } from './editor';

export async function getSesiones(): Promise<SesionEntrenamiento[]> {
  try {
    const res = await fetch('/api/entrenamiento/sesiones');
    if (!res.ok) {
      console.warn('Error al cargar sesiones:', res.status);
      return [];
    }
    return res.json();
  } catch (error) {
    console.warn('Error al cargar sesiones:', error);
    return [];
  }
}

export async function getSesion(id: string): Promise<SesionEntrenamiento | null> {
  const res = await fetch(`/api/entrenamiento/sesiones/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export async function crearSesion(sesion: Omit<SesionEntrenamiento, 'id' | 'createdAt' | 'updatedAt'>): Promise<SesionEntrenamiento | null> {
  const res = await fetch('/api/entrenamiento/sesiones', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sesion),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function actualizarSesion(id: string, sesion: Partial<SesionEntrenamiento>): Promise<boolean> {
  const res = await fetch(`/api/entrenamiento/sesiones/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sesion),
  });
  return res.ok;
}

export async function eliminarSesion(id: string): Promise<boolean> {
  const res = await fetch(`/api/entrenamiento/sesiones/${id}`, {
    method: 'DELETE',
  });
  return res.ok;
}

export async function getSesionesPorCliente(clienteId: string): Promise<SesionEntrenamiento[]> {
  const res = await fetch(`/api/entrenamiento/sesiones/cliente/${clienteId}`);
  if (!res.ok) return [];
  return res.json();
}

export async function getSesionesPorGrupo(grupoId: string): Promise<SesionEntrenamiento[]> {
  const res = await fetch(`/api/entrenamiento/sesiones/grupo/${grupoId}`);
  if (!res.ok) return [];
  return res.json();
}

export async function duplicarSesion(sesionId: string, nuevoNombre?: string): Promise<SesionEntrenamiento | null> {
  const res = await fetch('/api/entrenamiento/sesiones/duplicar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sesionId, nuevoNombre }),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function getPlantillas(): Promise<SesionEntrenamiento[]> {
  try {
    const res = await fetch('/api/entrenamiento/sesiones/plantillas');
    if (!res.ok) {
      console.warn('Error al cargar plantillas:', res.status);
      return [];
    }
    return res.json();
  } catch (error) {
    console.warn('Error al cargar plantillas:', error);
    return [];
  }
}

