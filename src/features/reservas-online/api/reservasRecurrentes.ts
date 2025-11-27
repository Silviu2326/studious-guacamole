import { ReservaRecurrente, PatronRecurrencia, Reserva } from '../types';
import { crearReserva } from './reservas';
import { verificarDisponibilidad } from './disponibilidad';

/**
 * Filtros para obtener reservas recurrentes
 */
export interface FiltrosReservasRecurrentes {
  entrenadorId?: string;
  clienteId?: string;
  activo?: boolean;
  estado?: 'activa' | 'pausada' | 'cancelada' | 'completada';
  frecuencia?: 'diaria' | 'semanal' | 'quincenal' | 'mensual';
  tipo?: 'sesion-1-1' | 'fisio' | 'nutricion' | 'masaje';
}

/**
 * Almacenamiento mock de reservas recurrentes (solo para desarrollo)
 * En producción, esto se gestionaría mediante una base de datos
 */
let mockReservasRecurrentes: ReservaRecurrente[] = [];

/**
 * Inicializa los datos mock (solo para desarrollo)
 */
const inicializarDatosMock = (entrenadorId?: string): ReservaRecurrente[] => {
  const hoy = new Date();
  const addDays = (days: number) => new Date(hoy.getTime() + days * 86400000);
  
  const datosMock: ReservaRecurrente[] = [
    {
      id: '1',
      entrenadorId: entrenadorId || 'entrenador1',
      clienteId: 'cliente1',
      clienteNombre: 'Juan Pérez',
      fechaInicio: addDays(1),
      horaInicio: '10:00',
      horaFin: '11:00',
      tipo: 'sesion-1-1',
      tipoSesion: 'presencial',
      frecuencia: 'semanal',
      diaSemana: 1, // Lunes
      numeroRepeticiones: 12,
      precio: 50,
      duracionMinutos: 60,
      activo: true,
      estado: 'activa',
      reservasCreadas: 3,
      createdAt: addDays(-14),
      updatedAt: addDays(-1),
    },
    {
      id: '2',
      entrenadorId: entrenadorId || 'entrenador1',
      clienteId: 'cliente2',
      clienteNombre: 'María García',
      fechaInicio: addDays(2),
      horaInicio: '12:00',
      horaFin: '12:45',
      tipo: 'sesion-1-1',
      tipoSesion: 'videollamada',
      frecuencia: 'semanal',
      diaSemana: 2, // Martes
      fechaFin: addDays(60),
      precio: 45,
      duracionMinutos: 45,
      activo: true,
      estado: 'activa',
      reservasCreadas: 2,
      createdAt: addDays(-10),
      updatedAt: addDays(-3),
    },
    {
      id: '3',
      entrenadorId: entrenadorId || 'entrenador1',
      clienteId: 'cliente3',
      clienteNombre: 'Carlos Ruiz',
      fechaInicio: addDays(0),
      horaInicio: '09:00',
      horaFin: '10:00',
      tipo: 'fisio',
      tipoSesion: 'presencial',
      frecuencia: 'quincenal',
      numeroRepeticiones: 8,
      precio: 60,
      duracionMinutos: 60,
      activo: false,
      estado: 'pausada',
      reservasCreadas: 1,
      createdAt: addDays(-7),
      updatedAt: addDays(-7),
    },
  ];
  
  return datosMock;
};

/**
 * Obtiene las reservas recurrentes con filtros opcionales
 * 
 * @param filtros - Filtros para buscar reservas recurrentes
 * @returns Lista de reservas recurrentes que cumplen con los filtros
 * 
 * @example
 * ```typescript
 * // Obtener todas las reservas recurrentes de un entrenador
 * const recurrentes = await getReservasRecurrentes({ entrenadorId: 'entrenador1' });
 * 
 * // Obtener solo las activas de un cliente
 * const recurrentes = await getReservasRecurrentes({ 
 *   clienteId: 'cliente1', 
 *   activo: true 
 * });
 * ```
 */
export const getReservasRecurrentes = async (
  filtros: FiltrosReservasRecurrentes = {}
): Promise<ReservaRecurrente[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Inicializar datos mock si está vacío
  if (mockReservasRecurrentes.length === 0) {
    mockReservasRecurrentes = inicializarDatosMock(filtros.entrenadorId);
  }
  
  let reservasFiltradas = [...mockReservasRecurrentes];
  
  // Filtrar por entrenador
  if (filtros.entrenadorId) {
    reservasFiltradas = reservasFiltradas.filter(
      r => r.entrenadorId === filtros.entrenadorId
    );
  }
  
  // Filtrar por cliente
  if (filtros.clienteId) {
    reservasFiltradas = reservasFiltradas.filter(
      r => r.clienteId === filtros.clienteId
    );
  }
  
  // Filtrar por estado activo
  if (filtros.activo !== undefined) {
    reservasFiltradas = reservasFiltradas.filter(
      r => (r.activo ?? true) === filtros.activo
    );
  }
  
  // Filtrar por estado
  if (filtros.estado) {
    reservasFiltradas = reservasFiltradas.filter(
      r => (r.estado || 'activa') === filtros.estado
    );
  }
  
  // Filtrar por frecuencia
  if (filtros.frecuencia) {
    reservasFiltradas = reservasFiltradas.filter(
      r => r.frecuencia === filtros.frecuencia
    );
  }
  
  // Filtrar por tipo
  if (filtros.tipo) {
    reservasFiltradas = reservasFiltradas.filter(
      r => r.tipo === filtros.tipo
    );
  }
  
  return reservasFiltradas;
};

/**
 * Crea una nueva reserva recurrente
 * 
 * @param data - Datos de la reserva recurrente a crear (sin id, createdAt, updatedAt, reservasCreadas)
 * @returns La reserva recurrente creada con todos sus campos
 * 
 * @example
 * ```typescript
 * const nuevaRecurrente = await createReservaRecurrente({
 *   entrenadorId: 'entrenador1',
 *   clienteId: 'cliente1',
 *   clienteNombre: 'Juan Pérez',
 *   fechaInicio: new Date('2024-01-15'),
 *   horaInicio: '10:00',
 *   horaFin: '11:00',
 *   tipo: 'sesion-1-1',
 *   tipoSesion: 'presencial',
 *   frecuencia: 'semanal',
 *   diaSemana: 1,
 *   numeroRepeticiones: 12,
 *   precio: 50,
 *   duracionMinutos: 60
 * });
 * ```
 * 
 * @remarks
 * Esta función crea la configuración de reserva recurrente pero NO genera
 * las reservas individuales. Para generar las reservas, usa `expandirReservaRecurrente`.
 * 
 * En producción, esta función se conectaría con un backend REST/GraphQL:
 * - REST: POST /api/reservas-recurrentes { body: data }
 * - GraphQL: mutation { createReservaRecurrente(input: {...}) { id, ... } }
 */
export const createReservaRecurrente = async (
  data: Omit<ReservaRecurrente, 'id' | 'createdAt' | 'updatedAt' | 'reservasCreadas'>
): Promise<ReservaRecurrente> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const nuevaReservaRecurrente: ReservaRecurrente = {
    ...data,
    id: Date.now().toString(),
    reservasCreadas: 0,
    estado: data.estado || 'activa',
    activo: data.activo ?? true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  // Agregar al almacenamiento mock
  if (mockReservasRecurrentes.length === 0) {
    mockReservasRecurrentes = inicializarDatosMock(data.entrenadorId);
  }
  mockReservasRecurrentes.push(nuevaReservaRecurrente);
  
  // Simular guardado en base de datos
  console.log('[ReservasRecurrentes] Creando reserva recurrente:', nuevaReservaRecurrente);
  
  return nuevaReservaRecurrente;
};

/**
 * @deprecated Usar createReservaRecurrente en su lugar
 */
export const crearReservaRecurrente = createReservaRecurrente;

/**
 * Actualiza una reserva recurrente existente
 * 
 * @param id - ID de la reserva recurrente a actualizar
 * @param changes - Campos a actualizar (parcial)
 * @returns La reserva recurrente actualizada
 * 
 * @throws Error si la reserva recurrente no existe
 * 
 * @example
 * ```typescript
 * const actualizada = await updateReservaRecurrente('1', {
 *   precio: 60,
 *   horaInicio: '11:00'
 * });
 * ```
 * 
 * @remarks
 * En producción, esta función se conectaría con un backend REST/GraphQL:
 * - REST: PATCH /api/reservas-recurrentes/:id { body: changes }
 * - GraphQL: mutation { updateReservaRecurrente(id: "...", input: {...}) { id, ... } }
 */
export const updateReservaRecurrente = async (
  id: string,
  changes: Partial<ReservaRecurrente>
): Promise<ReservaRecurrente> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Buscar la reserva recurrente
  const index = mockReservasRecurrentes.findIndex(r => r.id === id);
  
  if (index === -1) {
    // Si no está en mock, buscar en datos iniciales
    if (mockReservasRecurrentes.length === 0) {
      mockReservasRecurrentes = inicializarDatosMock();
    }
    
    const reservaExistente = mockReservasRecurrentes.find(r => r.id === id);
    if (!reservaExistente) {
      throw new Error('Reserva recurrente no encontrada');
    }
    
    index = mockReservasRecurrentes.indexOf(reservaExistente);
  }
  
  // Actualizar la reserva recurrente
  const reservaActualizada: ReservaRecurrente = {
    ...mockReservasRecurrentes[index],
    ...changes,
    id, // Asegurar que el ID no cambie
    updatedAt: new Date(),
  };
  
  mockReservasRecurrentes[index] = reservaActualizada;
  
  console.log('[ReservasRecurrentes] Actualizando reserva recurrente:', {
    id,
    cambios: changes,
    reservaActualizada,
  });
  
  return reservaActualizada;
};

/**
 * @deprecated Usar updateReservaRecurrente en su lugar
 */
export const actualizarReservaRecurrente = updateReservaRecurrente;

/**
 * Cancela una reserva recurrente
 * 
 * Esto marca la reserva recurrente como cancelada y opcionalmente puede
 * cancelar todas las reservas futuras generadas desde esta recurrencia.
 * 
 * @param id - ID de la reserva recurrente a cancelar
 * @param cancelarReservasFuturas - Si es true, cancela también todas las reservas futuras generadas (por defecto: true)
 * @param motivo - Motivo de la cancelación (opcional)
 * @returns La reserva recurrente cancelada
 * 
 * @throws Error si la reserva recurrente no existe
 * 
 * @example
 * ```typescript
 * // Cancelar solo la recurrencia (las reservas futuras se pueden cancelar después)
 * const cancelada = await cancelarReservaRecurrente('1', false);
 * 
 * // Cancelar la recurrencia y todas las reservas futuras
 * const cancelada = await cancelarReservaRecurrente('1', true, 'Cliente solicitó cancelación');
 * ```
 * 
 * @remarks
 * En producción, esta función se conectaría con un backend REST/GraphQL:
 * - REST: POST /api/reservas-recurrentes/:id/cancelar { body: { motivo, cancelarReservasFuturas } }
 * - GraphQL: mutation { cancelarReservaRecurrente(id: "...", motivo: "...") { id, estado, ... } }
 */
export const cancelarReservaRecurrente = async (
  id: string,
  cancelarReservasFuturas: boolean = true,
  motivo?: string
): Promise<ReservaRecurrente> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Buscar y actualizar la reserva recurrente
  const reservaActualizada = await updateReservaRecurrente(id, {
    estado: 'cancelada',
    activo: false,
    observaciones: motivo 
      ? `[${new Date().toLocaleString('es-ES')}] Cancelada: ${motivo}`
      : `[${new Date().toLocaleString('es-ES')}] Cancelada`,
  });
  
  // Si se solicitó cancelar reservas futuras, hacerlo
  if (cancelarReservasFuturas && reservaActualizada.entrenadorId) {
    try {
      await cancelarReservasRecurrentes(
        id,
        reservaActualizada.entrenadorId,
        motivo,
        true
      );
    } catch (error) {
      console.error('[ReservasRecurrentes] Error cancelando reservas futuras:', error);
      // No fallar la cancelación si hay error en las reservas futuras
    }
  }
  
  console.log('[ReservasRecurrentes] Reserva recurrente cancelada:', {
    id,
    motivo,
    cancelarReservasFuturas,
  });
  
  return reservaActualizada;
};

/**
 * @deprecated Usar cancelarReservaRecurrente en su lugar
 */
export const desactivarReservaRecurrente = cancelarReservaRecurrente;

/**
 * Helper: Expande una reserva recurrente en reservas individuales
 * 
 * Esta función genera las reservas individuales basándose en el patrón de recurrencia,
 * usando la misma lógica de validación que `reservas.ts` (validación de disponibilidad,
 * tiempo mínimo de anticipación, etc.).
 * 
 * Cada reserva generada incluye el campo `reservaRecurrenteId` para asociarla con
 * la reserva recurrente que la originó.
 * 
 * @param reservaRecurrente - La reserva recurrente a expandir
 * @returns Array de reservas individuales generadas
 * 
 * @example
 * ```typescript
 * const reservaRecurrente = await getReservaRecurrentePorId('entrenador1', '1');
 * const reservasGeneradas = await expandirReservaRecurrente(reservaRecurrente);
 * // Cada reserva en reservasGeneradas tendrá reservaRecurrenteId: '1'
 * ```
 * 
 * @remarks
 * Esta función:
 * 1. Calcula las fechas basándose en el patrón de recurrencia
 * 2. Para cada fecha, valida la disponibilidad (usando verificarDisponibilidad)
 * 3. Crea la reserva usando crearReserva (que aplica todas las validaciones de reservas.ts)
 * 4. Asocia cada reserva con la reserva recurrente mediante reservaRecurrenteId
 * 5. Solo crea reservas futuras (no crea reservas en el pasado)
 * 
 * Relación entre ReservaRecurrente y Reserva:
 * - Campo de asociación: `Reserva.reservaRecurrenteId` -> `ReservaRecurrente.id`
 * - Permite rastrear qué reservas fueron generadas automáticamente
 * - Facilita la cancelación/modificación masiva de reservas futuras
 * - Útil para reportes y análisis de reservas recurrentes
 */
export const expandirReservaRecurrente = async (
  reservaRecurrente: ReservaRecurrente
): Promise<Reserva[]> => {
  const reservas: Reserva[] = [];
  const fechaInicio = new Date(reservaRecurrente.fechaInicio);
  const fechaActual = new Date();
  
  // Calcular las fechas de las reservas basándose en el patrón
  const fechasReservas = calcularFechasReservas(
    fechaInicio,
    reservaRecurrente.frecuencia || 'semanal',
    reservaRecurrente.diaSemana,
    reservaRecurrente.numeroRepeticiones,
    reservaRecurrente.fechaFin || reservaRecurrente.fechaFinOpcional
  );
  
  // Crear reservas para cada fecha (solo las futuras)
  for (const fecha of fechasReservas) {
    // Solo crear reservas futuras
    if (fecha < fechaActual) {
      continue;
    }
    
    // Verificar disponibilidad antes de crear (usando la misma lógica de reservas.ts)
    try {
      if (reservaRecurrente.entrenadorId && reservaRecurrente.horaInicio) {
        const disponible = await verificarDisponibilidad(
          fecha,
          reservaRecurrente.horaInicio,
          reservaRecurrente.tipo || 'sesion-1-1',
          undefined,
          reservaRecurrente.entrenadorId,
          reservaRecurrente.horaFin
        );
        
        if (!disponible) {
          console.warn(`[ReservasRecurrentes] Horario no disponible para ${fecha.toISOString()} ${reservaRecurrente.horaInicio}`);
          continue;
        }
      }
      
      // Preparar fecha/hora de inicio y fin
      const [horaInicio, minutoInicio] = (reservaRecurrente.horaInicio || '10:00').split(':').map(Number);
      const fechaInicioCompleta = new Date(fecha);
      fechaInicioCompleta.setHours(horaInicio, minutoInicio, 0, 0);
      
      const duracionMinutos = reservaRecurrente.duracionMinutos || 60;
      const fechaFinCompleta = new Date(fechaInicioCompleta.getTime() + duracionMinutos * 60 * 1000);
      
      // Crear la reserva usando crearReserva (que aplica todas las validaciones de reservas.ts)
      const reserva = await crearReserva({
        clienteId: reservaRecurrente.clienteId || '',
        clienteNombre: reservaRecurrente.clienteNombre,
        fechaInicio: fechaInicioCompleta,
        fechaFin: fechaFinCompleta,
        fecha: fechaInicioCompleta, // Compatibilidad
        horaInicio: reservaRecurrente.horaInicio || '10:00',
        horaFin: reservaRecurrente.horaFin || '11:00',
        tipo: reservaRecurrente.tipo || 'sesion-1-1',
        tipoSesion: reservaRecurrente.tipoSesion || 'presencial',
        estado: 'confirmada', // Las reservas recurrentes se crean confirmadas por defecto
        origen: 'appCliente',
        esOnline: reservaRecurrente.tipoSesion === 'videollamada',
        precio: reservaRecurrente.precio,
        pagado: false, // El pago se gestiona individualmente
        duracionMinutos: reservaRecurrente.duracionMinutos,
        bonoId: reservaRecurrente.bonoId,
        observaciones: reservaRecurrente.observaciones 
          ? `${reservaRecurrente.observaciones}\n[Reserva recurrente creada automáticamente - ID: ${reservaRecurrente.id}]`
          : `[Reserva recurrente creada automáticamente - ID: ${reservaRecurrente.id}]`,
        // IMPORTANTE: Asociar la reserva con la reserva recurrente
        reservaRecurrenteId: reservaRecurrente.id,
      }, reservaRecurrente.entrenadorId);
      
      reservas.push(reserva);
    } catch (error) {
      console.error(`[ReservasRecurrentes] Error creando reserva para ${fecha.toISOString()}:`, error);
      // Continuar con la siguiente fecha si hay error en una reserva
    }
  }
  
  // Actualizar contador de reservas creadas en la reserva recurrente
  if (reservas.length > 0) {
    await updateReservaRecurrente(reservaRecurrente.id, {
      reservasCreadas: (reservaRecurrente.reservasCreadas || 0) + reservas.length,
    });
  }
  
  console.log(`[ReservasRecurrentes] Expandidas ${reservas.length} reservas desde patrón recurrente ${reservaRecurrente.id}`);
  
  return reservas;
};

/**
 * @deprecated Usar expandirReservaRecurrente en su lugar
 */
export const generarReservasDesdePatron = expandirReservaRecurrente;

/**
 * Calcula las fechas de las reservas basadas en el patrón de recurrencia
 * 
 * @param fechaInicio - Fecha de inicio de la recurrencia
 * @param frecuencia - Frecuencia de repetición
 * @param diaSemana - Día de la semana (0-6, Domingo-Sábado) para frecuencia semanal
 * @param numeroRepeticiones - Número total de repeticiones
 * @param fechaFin - Fecha límite para crear reservas
 * @returns Array de fechas calculadas
 */
export const calcularFechasReservas = (
  fechaInicio: Date,
  frecuencia: 'diaria' | 'semanal' | 'quincenal' | 'mensual',
  diaSemana?: number,
  numeroRepeticiones?: number,
  fechaFin?: Date
): Date[] => {
  const fechas: Date[] = [];
  const fechaActual = new Date(fechaInicio);
  const fechaLimite = fechaFin || (numeroRepeticiones 
    ? new Date(fechaActual.getTime() + (numeroRepeticiones - 1) * getDiasFrecuencia(frecuencia) * 24 * 60 * 60 * 1000)
    : new Date(fechaActual.getTime() + 365 * 24 * 60 * 60 * 1000) // Por defecto, máximo 1 año
  );
  
  let contador = 0;
  const maxRepeticiones = numeroRepeticiones || 52; // Por defecto, máximo 52 repeticiones
  
  while (fechaActual <= fechaLimite && contador < maxRepeticiones) {
    // Para frecuencia semanal, asegurarse de que sea el día correcto
    if (frecuencia === 'semanal' && diaSemana !== undefined) {
      const diaActual = fechaActual.getDay();
      const diferencia = (diaSemana - diaActual + 7) % 7;
      if (diferencia > 0) {
        fechaActual.setDate(fechaActual.getDate() + diferencia);
      }
    }
    
    // Agregar fecha solo si no está en el pasado
    if (fechaActual >= fechaInicio) {
      fechas.push(new Date(fechaActual));
      contador++;
    }
    
    // Avanzar según la frecuencia
    switch (frecuencia) {
      case 'diaria':
        fechaActual.setDate(fechaActual.getDate() + 1);
        break;
      case 'semanal':
        fechaActual.setDate(fechaActual.getDate() + 7);
        break;
      case 'quincenal':
        fechaActual.setDate(fechaActual.getDate() + 14);
        break;
      case 'mensual':
        fechaActual.setMonth(fechaActual.getMonth() + 1);
        break;
    }
  }
  
  return fechas;
};

/**
 * Obtiene el número de días según la frecuencia
 */
const getDiasFrecuencia = (frecuencia: 'diaria' | 'semanal' | 'quincenal' | 'mensual'): number => {
  switch (frecuencia) {
    case 'diaria':
      return 1;
    case 'semanal':
      return 7;
    case 'quincenal':
      return 14;
    case 'mensual':
      return 30;
  }
};

/**
 * Obtiene una reserva recurrente por ID
 * 
 * @param entrenadorId - ID del entrenador (opcional, para validación)
 * @param reservaRecurrenteId - ID de la reserva recurrente
 * @returns La reserva recurrente encontrada o null
 */
export const getReservaRecurrentePorId = async (
  entrenadorId: string,
  reservaRecurrenteId: string
): Promise<ReservaRecurrente | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Buscar en las reservas recurrentes
  const reservasRecurrentes = await getReservasRecurrentes({ entrenadorId });
  return reservasRecurrentes.find(r => r.id === reservaRecurrenteId) || null;
};

/**
 * Obtiene todas las reservas futuras asociadas a una reserva recurrente
 * 
 * @param reservaRecurrenteId - ID de la reserva recurrente
 * @param entrenadorId - ID del entrenador
 * @returns Array de reservas futuras asociadas
 * 
 * @remarks
 * Esta función busca todas las reservas con `reservaRecurrenteId` igual al ID proporcionado
 * y que sean futuras (fecha >= fecha actual).
 */
export const getReservasFuturasDeRecurrente = async (
  reservaRecurrenteId: string,
  entrenadorId: string
): Promise<Reserva[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Importar getReservas para buscar las reservas
  const { getReservas } = await import('./reservas');
  
  // Obtener todas las reservas del entrenador en un rango amplio
  const fechaActual = new Date();
  const fechaFin = new Date();
  fechaFin.setMonth(fechaFin.getMonth() + 6); // Buscar en los próximos 6 meses
  
  const reservas = await getReservas(
    { 
      fechaInicio: fechaActual, 
      fechaFin,
      entrenadorId 
    }, 
    'entrenador'
  );
  
  // Filtrar por reservaRecurrenteId y solo futuras
  return reservas.filter(reserva => {
    const fechaReserva = reserva.fecha || reserva.fechaInicio;
    return reserva.reservaRecurrenteId === reservaRecurrenteId && fechaReserva >= fechaActual;
  });
};

/**
 * Cancela todas las reservas futuras de una serie recurrente
 * 
 * @param reservaRecurrenteId - ID de la reserva recurrente
 * @param entrenadorId - ID del entrenador
 * @param motivo - Motivo de la cancelación (opcional)
 * @param soloFuturas - Si es true, solo cancela reservas futuras (por defecto: true)
 * @returns Objeto con el número de reservas canceladas y errores
 */
export const cancelarReservasRecurrentes = async (
  reservaRecurrenteId: string,
  entrenadorId: string,
  motivo?: string,
  soloFuturas: boolean = true
): Promise<{ canceladas: number; errores: number }> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Obtener las reservas futuras asociadas
  const reservas = soloFuturas
    ? await getReservasFuturasDeRecurrente(reservaRecurrenteId, entrenadorId)
    : await getReservasFuturasDeRecurrente(reservaRecurrenteId, entrenadorId); // Por ahora solo futuras
  
  let canceladas = 0;
  let errores = 0;
  
  // Cancelar cada reserva
  const { cancelarReserva } = await import('./reservas');
  
  for (const reserva of reservas) {
    try {
      await cancelarReserva(reserva.id, motivo, entrenadorId);
      canceladas++;
    } catch (error) {
      console.error(`[ReservasRecurrentes] Error cancelando reserva ${reserva.id}:`, error);
      errores++;
    }
  }
  
  console.log('[ReservasRecurrentes] Canceladas reservas recurrentes:', {
    reservaRecurrenteId,
    entrenadorId,
    motivo,
    soloFuturas,
    canceladas,
    errores,
  });
  
  return { canceladas, errores };
};

/**
 * Modifica todas las reservas futuras de una serie recurrente
 * 
 * @param reservaRecurrenteId - ID de la reserva recurrente
 * @param entrenadorId - ID del entrenador
 * @param modificaciones - Campos a modificar en las reservas futuras
 * @param soloFuturas - Si es true, solo modifica reservas futuras (por defecto: true)
 * @returns Objeto con el número de reservas modificadas y errores
 */
export const modificarReservasRecurrentes = async (
  reservaRecurrenteId: string,
  entrenadorId: string,
  modificaciones: {
    horaInicio?: string;
    horaFin?: string;
    tipoSesion?: 'presencial' | 'videollamada';
    precio?: number;
    duracionMinutos?: number;
    observaciones?: string;
  },
  soloFuturas: boolean = true
): Promise<{ modificadas: number; errores: number }> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Obtener las reservas futuras asociadas
  const reservas = await getReservasFuturasDeRecurrente(reservaRecurrenteId, entrenadorId);
  
  let modificadas = 0;
  let errores = 0;
  
  // Actualizar cada reserva
  const { updateReserva } = await import('./reservas');
  
  for (const reserva of reservas) {
    try {
      await updateReserva(reserva.id, modificaciones, entrenadorId);
      modificadas++;
    } catch (error) {
      console.error(`[ReservasRecurrentes] Error modificando reserva ${reserva.id}:`, error);
      errores++;
    }
  }
  
  console.log('[ReservasRecurrentes] Modificadas reservas recurrentes:', {
    reservaRecurrenteId,
    entrenadorId,
    modificaciones,
    soloFuturas,
    modificadas,
    errores,
  });
  
  return { modificadas, errores };
};
