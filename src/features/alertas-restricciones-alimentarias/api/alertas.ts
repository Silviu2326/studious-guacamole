import { AlertaAlergia, EstadoAlerta } from '../types';

export async function getAlertas(): Promise<AlertaAlergia[]> {
  try {
    const res = await fetch('/api/nutricion/alertas');
    if (!res.ok) throw new Error('Error al obtener alertas');
    return res.json();
  } catch (error) {
    console.error('Error fetching alertas:', error);
    return [];
  }
}

export async function getAlertaPorId(id: string): Promise<AlertaAlergia | null> {
  try {
    const res = await fetch(`/api/nutricion/alertas/${id}`);
    if (!res.ok) throw new Error('Error al obtener alerta');
    return res.json();
  } catch (error) {
    console.error('Error fetching alerta:', error);
    return null;
  }
}

export async function crearAlerta(
  data: Omit<AlertaAlergia, 'id' | 'fechaDetectada' | 'notificado'>
): Promise<AlertaAlergia | null> {
  try {
    const res = await fetch('/api/nutricion/alertas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        fechaDetectada: new Date().toISOString(),
        notificado: false,
      }),
    });
    if (!res.ok) throw new Error('Error al crear alerta');
    return res.json();
  } catch (error) {
    console.error('Error creating alerta:', error);
    return null;
  }
}

export async function actualizarAlerta(
  id: string,
  data: Partial<AlertaAlergia>
): Promise<boolean> {
  try {
    const res = await fetch(`/api/nutricion/alertas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch (error) {
    console.error('Error updating alerta:', error);
    return false;
  }
}

export async function resolverAlerta(
  id: string,
  accionTomada: string
): Promise<boolean> {
  try {
    const res = await fetch(`/api/nutricion/alertas/${id}/resolver`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        estado: 'resuelta' as EstadoAlerta,
        fechaResuelta: new Date().toISOString(),
        accionTomada,
      }),
    });
    return res.ok;
  } catch (error) {
    console.error('Error resolving alerta:', error);
    return false;
  }
}

export async function getAlertasPendientes(): Promise<AlertaAlergia[]> {
  try {
    const res = await fetch('/api/nutricion/alertas?estado=pendiente');
    if (!res.ok) throw new Error('Error al obtener alertas pendientes');
    return res.json();
  } catch (error) {
    console.error('Error fetching alertas pendientes:', error);
    return [];
  }
}

export async function getAlertasPorCliente(
  clienteId: string
): Promise<AlertaAlergia[]> {
  try {
    const res = await fetch(`/api/nutricion/alertas/cliente/${clienteId}`);
    if (!res.ok) throw new Error('Error al obtener alertas del cliente');
    return res.json();
  } catch (error) {
    console.error('Error fetching alertas por cliente:', error);
    return [];
  }
}

