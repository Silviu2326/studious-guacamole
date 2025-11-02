export interface ValidacionResultado {
  ingrediente: string;
  esSeguro: boolean;
  razones?: string[];
}

export async function validarIngrediente(ingrediente: string): Promise<ValidacionResultado> {
  const res = await fetch('/api/nutricion/validar-ingrediente', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ingrediente }),
  });
  if (!res.ok) return { ingrediente, esSeguro: true };
  return res.json();
}

export async function getSustituciones(ingrediente: string): Promise<string[]> {
  const url = new URL('/api/nutricion/sustituciones', window.location.origin);
  url.searchParams.set('ingrediente', ingrediente);
  const res = await fetch(url.toString());
  if (!res.ok) return [];
  return res.json();
}


