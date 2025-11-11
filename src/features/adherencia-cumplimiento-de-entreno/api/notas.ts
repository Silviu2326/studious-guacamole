export interface NotaCumplimiento {
  id: string;
  clienteId: string;
  clienteNombre: string;
  fecha: string;
  tipo: 'nota-rapida' | 'compromiso' | 'observacion';
  titulo?: string;
  contenido: string;
  creadoPor: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CrearNotaRequest {
  clienteId: string;
  clienteNombre: string;
  tipo: 'nota-rapida' | 'compromiso' | 'observacion';
  titulo?: string;
  contenido: string;
}

// Mock data para desarrollo
const mockNotas: NotaCumplimiento[] = [
  {
    id: '1',
    clienteId: 'maria',
    clienteNombre: 'María Pérez',
    fecha: '2025-01-15',
    tipo: 'compromiso',
    titulo: 'Compromiso de asistencia',
    contenido: 'Cliente se comprometió a asistir a todas las sesiones de la próxima semana. Revisar progreso el viernes.',
    creadoPor: 'entrenador1',
    createdAt: new Date('2025-01-15T10:30:00').toISOString(),
  },
  {
    id: '2',
    clienteId: 'carlos',
    clienteNombre: 'Carlos Ruiz',
    fecha: '2025-01-16',
    tipo: 'nota-rapida',
    contenido: 'Muy motivado después de alcanzar su PR. Aprovechar para aumentar intensidad gradualmente.',
    creadoPor: 'entrenador1',
    createdAt: new Date('2025-01-16T14:20:00').toISOString(),
  },
  {
    id: '3',
    clienteId: 'ana',
    clienteNombre: 'Ana Martínez',
    fecha: '2025-01-17',
    tipo: 'observacion',
    titulo: 'Observación sobre cancelaciones',
    contenido: 'Cliente mencionó problemas de horario. Ofrecer flexibilidad en horarios mañana/tarde.',
    creadoPor: 'entrenador1',
    createdAt: new Date('2025-01-17T09:15:00').toISOString(),
  },
];

let notasData = [...mockNotas];

/**
 * Obtiene todas las notas de cumplimiento para un cliente
 */
export async function getNotasPorCliente(clienteId: string): Promise<NotaCumplimiento[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return notasData.filter(n => n.clienteId === clienteId).sort((a, b) => 
    new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );
}

/**
 * Obtiene todas las notas de cumplimiento
 */
export async function getTodasLasNotas(): Promise<NotaCumplimiento[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return notasData.sort((a, b) => 
    new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );
}

/**
 * Crea una nueva nota de cumplimiento
 */
export async function crearNota(data: CrearNotaRequest): Promise<NotaCumplimiento> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const nuevaNota: NotaCumplimiento = {
    id: `nota-${Date.now()}`,
    ...data,
    fecha: new Date().toISOString().split('T')[0],
    creadoPor: 'entrenador1', // En producción, obtener del contexto de autenticación
    createdAt: new Date().toISOString(),
  };
  
  notasData.push(nuevaNota);
  return nuevaNota;
}

/**
 * Actualiza una nota existente
 */
export async function actualizarNota(
  id: string,
  data: Partial<CrearNotaRequest>
): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const index = notasData.findIndex(n => n.id === id);
  if (index === -1) return false;
  
  notasData[index] = {
    ...notasData[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  
  return true;
}

/**
 * Elimina una nota
 */
export async function eliminarNota(id: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const index = notasData.findIndex(n => n.id === id);
  if (index === -1) return false;
  
  notasData.splice(index, 1);
  return true;
}

