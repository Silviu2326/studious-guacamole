export interface Restriccion {
  id: string;
  tipo: 'alergia' | 'intolerancia' | 'religiosa' | 'cultural';
  descripcion: string;
  severidad: 'leve' | 'moderada' | 'severa';
  clienteId?: string;
}

export async function getRestricciones(): Promise<Restriccion[]> {
  const res = await fetch('/api/nutricion/restricciones');
  if (!res.ok) return [];
  return res.json();
}

export async function crearRestriccion(data: Omit<Restriccion, 'id'>): Promise<Restriccion | null> {
  const res = await fetch('/api/nutricion/restricciones', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function actualizarRestriccion(id: string, data: Partial<Restriccion>): Promise<boolean> {
  const res = await fetch(`/api/nutricion/restricciones/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.ok;
}

export async function eliminarRestriccion(id: string): Promise<boolean> {
  const res = await fetch(`/api/nutricion/restricciones/${id}`, { method: 'DELETE' });
  return res.ok;
}


