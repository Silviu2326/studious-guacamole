/**
 * API para gestionar notas de sesión
 * 
 * DOCUMENTACIÓN: Alimentación de datos desde reservas
 * ===================================================
 * 
 * Las notas de sesión están directamente relacionadas con las reservas:
 * 
 * 1. RESERVAS COMPLETADAS:
 *    - Cuando una reserva tiene estado 'completada', se pueden crear notas
 *      asociadas para documentar lo trabajado, rendimiento y observaciones.
 *    - Las notas se vinculan a la reserva mediante el campo reservaId.
 * 
 * 2. RESERVAS CANCELADAS:
 *    - Las reservas canceladas normalmente NO tienen notas asociadas, ya que
 *      no se realizó la sesión.
 *    - Sin embargo, se pueden crear notas explicativas si es necesario (por ejemplo,
 *      para documentar el motivo de cancelación o seguimiento).
 * 
 * 3. FLUJO DE DATOS:
 *    - getNotasPorReserva(reservaId) → Busca notas de una reserva específica
 *      (típicamente reservas completadas)
 *    - getNotasPorCliente(clienteId) → Busca todas las notas de un cliente,
 *      basándose en sus reservas completadas
 *    - crearNotaSesion(data) → Crea una nota asociada a una reserva
 *      (se recomienda crear después de que la reserva esté completada)
 * 
 * 4. DATOS DERIVADOS:
 *    - La fecha de sesión y horarios se obtienen de la reserva asociada
 *    - El clienteId y entrenadorId provienen de la reserva
 *    - El contenido de la nota es independiente pero contextualiza la sesión
 */

import { NotaDeSesion, NotaSesion } from '../types';

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
 * Obtener nota de sesión por ID de reserva (singular)
 */
export const getNotaPorReserva = async (reservaId: string): Promise<NotaDeSesion | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const nota = notasStorage.find(n => n.reservaId === reservaId);
  return nota || null;
};

/**
 * Obtener todas las notas de sesión por ID de reserva (plural)
 * 
 * @param reservaId - ID de la reserva para buscar notas
 * @returns Lista de notas asociadas a la reserva
 * 
 * @example
 * ```typescript
 * const notas = await getNotasPorReserva('reserva-123');
 * // Retorna todas las notas asociadas a esta reserva
 * ```
 * 
 * @remarks
 * Esta función retorna todas las notas asociadas a una reserva específica.
 * En el contexto actual, típicamente una reserva tiene una sola nota, pero
 * esta función permite manejar casos donde pueden existir múltiples notas.
 * Los datos se alimentan de las reservas completadas.
 */
export const getNotasPorReserva = async (reservaId: string): Promise<NotaDeSesion[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const notas = notasStorage.filter(n => n.reservaId === reservaId);
  
  // Ordenar por fecha de creación descendente (más recientes primero)
  return notas.sort((a, b) => {
    const fechaA = a.createdAt?.getTime() || 0;
    const fechaB = b.createdAt?.getTime() || 0;
    return fechaB - fechaA;
  });
};

/**
 * Crear una nueva nota de sesión
 * 
 * @param data - Datos de la nota a crear (sin id, createdAt, updatedAt)
 * @returns La nota creada
 * 
 * @example
 * ```typescript
 * const nuevaNota = await crearNotaSesion({
 *   reservaId: 'reserva-123',
 *   clienteId: 'cliente-456',
 *   entrenadorId: 'entrenador-789',
 *   clienteNombre: 'Juan Pérez',
 *   fechaSesion: new Date(),
 *   horaInicio: '10:00',
 *   horaFin: '11:00',
 *   queTrabajamos: 'Trabajo de fuerza',
 *   rendimiento: 'Excelente',
 *   observaciones: 'Notas adicionales'
 * });
 * ```
 * 
 * @remarks
 * Esta función crea una nueva nota de sesión asociada a una reserva.
 * Las notas típicamente se crean después de que una reserva ha sido completada.
 * Los datos se alimentan de las reservas completadas.
 * 
 * En producción, esta función se conectaría con un backend REST/GraphQL:
 * - REST: POST /api/reservas/:reservaId/notas { body: {...} }
 * - GraphQL: mutation { crearNotaSesion(reservaId: "...", data: {...}) { id, ... } }
 */
export const crearNotaSesion = async (
  data: Omit<NotaDeSesion, 'id' | 'createdAt' | 'updatedAt'> | Omit<NotaSesion, 'id' | 'fechaCreacion'>
): Promise<NotaDeSesion> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Si es tipo NotaSesion, convertir a NotaDeSesion para compatibilidad
  let notaData: Omit<NotaDeSesion, 'id' | 'createdAt' | 'updatedAt'>;
  
  if ('contenido' in data) {
    // Es tipo NotaSesion
    const notaSesion = data as Omit<NotaSesion, 'id' | 'fechaCreacion'>;
    notaData = {
      reservaId: notaSesion.reservaId,
      clienteId: notaSesion.clienteId,
      entrenadorId: notaSesion.entrenadorId,
      clienteNombre: '', // Se puede obtener de la reserva
      fechaSesion: new Date(), // Se puede obtener de la reserva
      horaInicio: '',
      horaFin: '',
      queTrabajamos: notaSesion.contenido,
      rendimiento: '',
      observaciones: '',
    };
  } else {
    // Es tipo NotaDeSesion
    notaData = data as Omit<NotaDeSesion, 'id' | 'createdAt' | 'updatedAt'>;
  }
  
  const nuevaNota: NotaDeSesion = {
    ...notaData,
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


