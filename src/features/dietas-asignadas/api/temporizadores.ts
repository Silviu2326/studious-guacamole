import type { DatosTemporizador, TiempoReceta } from '../types';

// Mock de datos de temporizadores (en producción vendría de la API)
const temporizadoresMock: Map<string, DatosTemporizador> = new Map();

/**
 * Obtiene los datos del temporizador para una receta
 */
export async function obtenerDatosTemporizador(recetaId: string): Promise<DatosTemporizador | null> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const datos = temporizadoresMock.get(recetaId);

  // En producción, esto haría una llamada GET a la API
  // return await fetch(`/api/temporizadores/${recetaId}`)
  //   .then(res => res.json())
  //   .catch(() => null);

  return datos || null;
}

/**
 * Guarda un tiempo real de una receta
 */
export async function guardarTiempoReceta(
  recetaId: string,
  tiempo: TiempoReceta
): Promise<TiempoReceta> {
  await new Promise(resolve => setTimeout(resolve, 300));

  let datos = temporizadoresMock.get(recetaId);

  if (!datos) {
    datos = {
      recetaId,
      historialTiempos: [],
    };
  }

  datos.historialTiempos = [...datos.historialTiempos, tiempo];
  datos.tiempoReal = tiempo.tiempoReal;
  datos.ultimaEjecucion = tiempo.fecha;

  temporizadoresMock.set(recetaId, datos);

  // En producción, esto haría una llamada POST a la API
  // return await fetch(`/api/temporizadores/${recetaId}/tiempos`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(tiempo),
  // }).then(res => res.json());

  return tiempo;
}

/**
 * Actualiza los datos del temporizador
 */
export async function actualizarDatosTemporizador(
  recetaId: string,
  datos: DatosTemporizador
): Promise<DatosTemporizador> {
  await new Promise(resolve => setTimeout(resolve, 300));

  temporizadoresMock.set(recetaId, datos);

  // En producción, esto haría una llamada PUT a la API
  // return await fetch(`/api/temporizadores/${recetaId}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(datos),
  // }).then(res => res.json());

  return datos;
}

/**
 * Obtiene el historial de tiempos de una receta
 */
export async function obtenerHistorialTiempos(recetaId: string): Promise<TiempoReceta[]> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const datos = temporizadoresMock.get(recetaId);

  // En producción, esto haría una llamada GET a la API
  // return await fetch(`/api/temporizadores/${recetaId}/tiempos`)
  //   .then(res => res.json());

  return datos?.historialTiempos || [];
}

