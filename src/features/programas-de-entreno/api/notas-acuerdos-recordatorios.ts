import type { NotaAcuerdoRecordatorio } from '../types';

// Simulación de base de datos en memoria (en producción sería una llamada a API)
let notasDB: NotaAcuerdoRecordatorio[] = [
  {
    id: '1',
    tipo: 'nota',
    titulo: 'Revisar fatiga en próximas sesiones',
    contenido: 'El cliente ha mostrado signos de fatiga en la última semana. Revisar intensidad del plan.',
    tags: ['Revisar fatiga', 'Ajuste'],
    clienteId: 'cliente-1',
    fechaCreacion: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    fechaActualizacion: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    completado: false,
    creadoPor: 'entrenador-1',
    prioridad: 'alta',
  },
  {
    id: '2',
    tipo: 'recordatorio',
    titulo: 'Enviar vídeo de técnica',
    contenido: 'Recordar enviar el vídeo de técnica de sentadilla al cliente.',
    tags: ['Enviar vídeo', 'Técnica'],
    clienteId: 'cliente-1',
    fechaCreacion: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    fechaActualizacion: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    fechaRecordatorio: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    completado: false,
    creadoPor: 'entrenador-1',
    prioridad: 'media',
  },
];

export async function obtenerNotas(
  programaId?: string,
  clienteId?: string
): Promise<NotaAcuerdoRecordatorio[]> {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 300));

  let notas = [...notasDB];

  if (programaId) {
    notas = notas.filter((n) => n.programaId === programaId);
  }

  if (clienteId) {
    notas = notas.filter((n) => n.clienteId === clienteId);
  }

  // Ordenar por fecha de creación (más recientes primero)
  return notas.sort(
    (a, b) =>
      new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
  );
}

export async function crearNota(
  nota: Omit<NotaAcuerdoRecordatorio, 'id' | 'fechaCreacion' | 'fechaActualizacion'>
): Promise<NotaAcuerdoRecordatorio> {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 300));

  const nuevaNota: NotaAcuerdoRecordatorio = {
    ...nota,
    id: `nota-${Date.now()}`,
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString(),
  };

  notasDB.push(nuevaNota);
  return nuevaNota;
}

export async function actualizarNota(
  id: string,
  actualizacion: Partial<Omit<NotaAcuerdoRecordatorio, 'id' | 'fechaCreacion' | 'creadoPor'>>
): Promise<NotaAcuerdoRecordatorio | null> {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 300));

  const indice = notasDB.findIndex((n) => n.id === id);
  if (indice === -1) {
    return null;
  }

  const notaActualizada: NotaAcuerdoRecordatorio = {
    ...notasDB[indice],
    ...actualizacion,
    fechaActualizacion: new Date().toISOString(),
    ...(actualizacion.completado && !notasDB[indice].completado
      ? { completadoEn: new Date().toISOString() }
      : {}),
  };

  notasDB[indice] = notaActualizada;
  return notaActualizada;
}

export async function eliminarNota(id: string): Promise<boolean> {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 300));

  const indice = notasDB.findIndex((n) => n.id === id);
  if (indice === -1) {
    return false;
  }

  notasDB.splice(indice, 1);
  return true;
}

export async function obtenerNotasPorTag(tag: string): Promise<NotaAcuerdoRecordatorio[]> {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 300));

  return notasDB.filter((n) => n.tags.includes(tag));
}

export async function obtenerTagsDisponibles(): Promise<string[]> {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 300));

  const tagsSet = new Set<string>();
  notasDB.forEach((nota) => {
    nota.tags.forEach((tag) => tagsSet.add(tag));
  });

  return Array.from(tagsSet).sort();
}

