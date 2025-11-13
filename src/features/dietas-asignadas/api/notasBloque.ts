import type { NotaBloque } from '../types';

// Mock de notas almacenadas (en producción vendría de la API)
const notasMock: NotaBloque[] = [];

/**
 * Guarda una nota de bloque
 */
export async function guardarNotaBloque(nota: Partial<NotaBloque>): Promise<NotaBloque> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const nuevaNota: NotaBloque = {
    id: `nota-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    bloqueId: nota.bloqueId || '',
    tipo: nota.tipo || 'texto',
    contenido: nota.contenido,
    urlArchivo: nota.urlArchivo,
    duracion: nota.duracion,
    creadoEn: nota.creadoEn || new Date().toISOString(),
    creadoPor: nota.creadoPor || 'user-1',
    actualizadoEn: nota.actualizadoEn || new Date().toISOString(),
  };

  notasMock.push(nuevaNota);

  // En producción, esto haría una llamada POST a la API
  // return await fetch('/api/notas-bloque', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(nuevaNota),
  // }).then(res => res.json());

  return nuevaNota;
}

/**
 * Obtiene todas las notas de un bloque
 */
export async function obtenerNotasBloque(bloqueId: string): Promise<NotaBloque[]> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const notas = notasMock.filter(n => n.bloqueId === bloqueId);

  // En producción, esto haría una llamada GET a la API
  // return await fetch(`/api/notas-bloque?bloqueId=${bloqueId}`)
  //   .then(res => res.json());

  return notas;
}

/**
 * Elimina una nota de bloque
 */
export async function eliminarNotaBloque(notaId: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const index = notasMock.findIndex(n => n.id === notaId);
  if (index !== -1) {
    notasMock.splice(index, 1);
  }

  // En producción, esto haría una llamada DELETE a la API
  // return await fetch(`/api/notas-bloque/${notaId}`, {
  //   method: 'DELETE',
  // }).then(res => res.ok);

  return true;
}

/**
 * Actualiza una nota de bloque
 */
export async function actualizarNotaBloque(
  notaId: string,
  actualizaciones: Partial<NotaBloque>
): Promise<NotaBloque | null> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const index = notasMock.findIndex(n => n.id === notaId);
  if (index === -1) {
    return null;
  }

  const notaActualizada: NotaBloque = {
    ...notasMock[index],
    ...actualizaciones,
    actualizadoEn: new Date().toISOString(),
  };

  notasMock[index] = notaActualizada;

  // En producción, esto haría una llamada PUT a la API
  // return await fetch(`/api/notas-bloque/${notaId}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(actualizaciones),
  // }).then(res => res.json());

  return notaActualizada;
}

