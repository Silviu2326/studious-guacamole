import { NotaDeSesion } from '../types';

// Simulación de almacenamiento en memoria (en producción sería una llamada a la API)
let notasStorage: NotaDeSesion[] = [
  // Datos de ejemplo
  {
    id: 'nota1',
    reservaId: '1',
    entrenadorId: 'entrenador1',
    clienteId: 'cliente1',
    clienteNombre: 'Juan Pérez',
    fechaSesion: new Date(Date.now() - 2 * 86400000), // Hace 2 días
    horaInicio: '10:00',
    horaFin: '11:00',
    queTrabajamos: 'Trabajo de fuerza en tren superior: press banca, remo con mancuernas y flexiones.',
    rendimiento: 'Excelente rendimiento. Cliente muy motivado, completó todas las series con buena técnica.',
    observaciones: 'Notar mejora en la técnica del press banca. Aumentar peso para próxima sesión.',
    createdAt: new Date(Date.now() - 2 * 86400000),
    updatedAt: new Date(Date.now() - 2 * 86400000),
  },
  {
    id: 'nota2',
    reservaId: '2',
    entrenadorId: 'entrenador1',
    clienteId: 'cliente2',
    clienteNombre: 'María García',
    fechaSesion: new Date(Date.now() - 5 * 86400000), // Hace 5 días
    horaInicio: '12:00',
    horaFin: '12:45',
    queTrabajamos: 'Sesión de HIIT online: circuito de 4 ejercicios durante 20 minutos.',
    rendimiento: 'Buen rendimiento. Cliente mostró resistencia mejorada comparado con sesiones anteriores.',
    observaciones: 'Cliente mencionó ligera molestia en rodilla izquierda. Vigilar en próximas sesiones.',
    createdAt: new Date(Date.now() - 5 * 86400000),
    updatedAt: new Date(Date.now() - 5 * 86400000),
  },
];

/**
 * Obtener todas las notas de sesión de un cliente específico
 */
export const getNotasPorCliente = async (clienteId: string, entrenadorId?: string): Promise<NotaDeSesion[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let notas = notasStorage.filter(nota => nota.clienteId === clienteId);
  
  // Si se proporciona entrenadorId, filtrar por entrenador
  if (entrenadorId) {
    notas = notas.filter(nota => nota.entrenadorId === entrenadorId);
  }
  
  // Ordenar por fecha de sesión descendente (más recientes primero)
  return notas.sort((a, b) => b.fechaSesion.getTime() - a.fechaSesion.getTime());
};

/**
 * Obtener nota de sesión por ID de reserva
 */
export const getNotaPorReserva = async (reservaId: string): Promise<NotaDeSesion | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const nota = notasStorage.find(n => n.reservaId === reservaId);
  return nota || null;
};

/**
 * Crear una nueva nota de sesión
 */
export const crearNotaSesion = async (nota: Omit<NotaDeSesion, 'id' | 'createdAt' | 'updatedAt'>): Promise<NotaDeSesion> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const nuevaNota: NotaDeSesion = {
    ...nota,
    id: `nota${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  notasStorage.push(nuevaNota);
  return nuevaNota;
};

/**
 * Actualizar una nota de sesión existente
 */
export const actualizarNotaSesion = async (id: string, nota: Partial<Omit<NotaDeSesion, 'id' | 'createdAt' | 'reservaId' | 'entrenadorId' | 'clienteId' | 'clienteNombre' | 'fechaSesion' | 'horaInicio' | 'horaFin'>>): Promise<NotaDeSesion> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = notasStorage.findIndex(n => n.id === id);
  if (index === -1) {
    throw new Error('Nota de sesión no encontrada');
  }
  
  const notaActualizada: NotaDeSesion = {
    ...notasStorage[index],
    ...nota,
    updatedAt: new Date(),
  };
  
  notasStorage[index] = notaActualizada;
  return notaActualizada;
};

/**
 * Eliminar una nota de sesión
 */
export const eliminarNotaSesion = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = notasStorage.findIndex(n => n.id === id);
  if (index === -1) {
    throw new Error('Nota de sesión no encontrada');
  }
  
  notasStorage.splice(index, 1);
};

/**
 * Obtener todas las notas de sesión de un entrenador
 */
export const getNotasPorEntrenador = async (entrenadorId: string): Promise<NotaDeSesion[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const notas = notasStorage.filter(nota => nota.entrenadorId === entrenadorId);
  
  // Ordenar por fecha de sesión descendente (más recientes primero)
  return notas.sort((a, b) => b.fechaSesion.getTime() - a.fechaSesion.getTime());
};

/**
 * Obtener lista de clientes únicos con notas
 */
export const getClientesConNotas = async (entrenadorId: string): Promise<Array<{ clienteId: string; clienteNombre: string; totalNotas: number }>> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const notas = notasStorage.filter(nota => nota.entrenadorId === entrenadorId);
  
  // Agrupar por cliente
  const clientesMap = new Map<string, { clienteId: string; clienteNombre: string; totalNotas: number }>();
  
  notas.forEach(nota => {
    if (clientesMap.has(nota.clienteId)) {
      const cliente = clientesMap.get(nota.clienteId)!;
      cliente.totalNotas += 1;
    } else {
      clientesMap.set(nota.clienteId, {
        clienteId: nota.clienteId,
        clienteNombre: nota.clienteNombre,
        totalNotas: 1,
      });
    }
  });
  
  return Array.from(clientesMap.values()).sort((a, b) => a.clienteNombre.localeCompare(b.clienteNombre));
};


