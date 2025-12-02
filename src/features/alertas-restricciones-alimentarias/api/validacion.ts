import {
  ValidacionIngrediente,
  SustitucionSegura,
  RestriccionAlimentaria,
} from '../types';

export async function validarIngrediente(
  ingrediente: string,
  clienteId?: string
): Promise<ValidacionIngrediente | null> {
  try {
    const res = await fetch('/api/nutricion/validar-ingrediente', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingrediente, clienteId }),
    });
    if (!res.ok) throw new Error('Error al validar ingrediente');
    return res.json();
  } catch (error) {
    console.error('Error validating ingrediente:', error);
    return null;
  }
}

export async function validarReceta(
  ingredientes: string[],
  clienteId?: string
): Promise<ValidacionIngrediente[]> {
  try {
    const res = await fetch('/api/nutricion/validar-receta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredientes, clienteId }),
    });
    if (!res.ok) throw new Error('Error al validar receta');
    return res.json();
  } catch (error) {
    console.error('Error validating receta:', error);
    return [];
  }
}

export async function buscarSustituciones(
  ingrediente: string,
  restricciones: RestriccionAlimentaria[]
): Promise<SustitucionSegura[]> {
  try {
    const res = await fetch('/api/nutricion/sustituciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingrediente, restricciones }),
    });
    if (!res.ok) throw new Error('Error al buscar sustituciones');
    return res.json();
  } catch (error) {
    console.error('Error fetching sustituciones:', error);
    return [];
  }
}

export async function getIngredientesProblema(): Promise<
  Array<{ ingrediente: string; alertas: number }>
> {
  try {
    const res = await fetch('/api/nutricion/ingredientes-problema');
    if (!res.ok) throw new Error('Error al obtener ingredientes problemáticos');
    return res.json();
  } catch (error) {
    console.error('Error fetching ingredientes problema:', error);
    return [];
  }
}

