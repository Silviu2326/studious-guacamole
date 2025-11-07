import {
  RestriccionAlimentaria,
  TipoRestriccion,
  SeveridadRestriccion,
} from '../types';

export async function getRestricciones(): Promise<RestriccionAlimentaria[]> {
  try {
    const res = await fetch('/api/nutricion/restricciones');
    if (!res.ok) throw new Error('Error al obtener restricciones');
    return res.json();
  } catch (error) {
    console.error('Error fetching restricciones:', error);
    return [];
  }
}

export async function getRestriccionPorId(id: string): Promise<RestriccionAlimentaria | null> {
  try {
    const res = await fetch(`/api/nutricion/restricciones/${id}`);
    if (!res.ok) throw new Error('Error al obtener restricción');
    return res.json();
  } catch (error) {
    console.error('Error fetching restriccion:', error);
    return null;
  }
}

export async function crearRestriccion(
  data: Omit<RestriccionAlimentaria, 'id' | 'fechaRegistro' | 'activa'>
): Promise<RestriccionAlimentaria | null> {
  try {
    const res = await fetch('/api/nutricion/restricciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        fechaRegistro: new Date().toISOString(),
        activa: true,
      }),
    });
    if (!res.ok) throw new Error('Error al crear restricción');
    return res.json();
  } catch (error) {
    console.error('Error creating restriccion:', error);
    return null;
  }
}

export async function actualizarRestriccion(
  id: string,
  data: Partial<RestriccionAlimentaria>
): Promise<boolean> {
  try {
    const res = await fetch(`/api/nutricion/restricciones/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        fechaActualizacion: new Date().toISOString(),
      }),
    });
    return res.ok;
  } catch (error) {
    console.error('Error updating restriccion:', error);
    return false;
  }
}

export async function eliminarRestriccion(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/nutricion/restricciones/${id}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (error) {
    console.error('Error deleting restriccion:', error);
    return false;
  }
}

export async function getRestriccionesPorCliente(
  clienteId: string
): Promise<RestriccionAlimentaria[]> {
  try {
    const res = await fetch(`/api/nutricion/restricciones/cliente/${clienteId}`);
    if (!res.ok) throw new Error('Error al obtener restricciones del cliente');
    return res.json();
  } catch (error) {
    console.error('Error fetching restricciones por cliente:', error);
    return [];
  }
}

export async function getRestriccionesPorTipo(
  tipo: TipoRestriccion
): Promise<RestriccionAlimentaria[]> {
  try {
    const res = await fetch(`/api/nutricion/restricciones/tipo/${tipo}`);
    if (!res.ok) throw new Error('Error al obtener restricciones por tipo');
    return res.json();
  } catch (error) {
    console.error('Error fetching restricciones por tipo:', error);
    return [];
  }
}

