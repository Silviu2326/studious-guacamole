import { ReservaRecurrente, PatronRecurrencia, Reserva } from '../types';
import { crearReserva } from './reservas';
import { verificarDisponibilidad } from './disponibilidad';

/**
 * Crea una configuración de reserva recurrente
 */
export const crearReservaRecurrente = async (
  reservaRecurrente: Omit<ReservaRecurrente, 'id' | 'createdAt' | 'updatedAt' | 'reservasCreadas'>
): Promise<ReservaRecurrente> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const nuevaReservaRecurrente: ReservaRecurrente = {
    ...reservaRecurrente,
    id: Date.now().toString(),
    reservasCreadas: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  // Simular guardado en base de datos
  console.log('[ReservasRecurrentes] Creando reserva recurrente:', nuevaReservaRecurrente);
  
  // No crear las reservas aquí - se crearán cuando se llame a generarReservasDesdePatron explícitamente
  // Esto permite más control sobre cuándo se generan las reservas
  
  return nuevaReservaRecurrente;
};

/**
 * Genera las reservas basadas en un patrón de recurrencia
 */
export const generarReservasDesdePatron = async (
  reservaRecurrente: ReservaRecurrente
): Promise<Reserva[]> => {
  const reservas: Reserva[] = [];
  const fechaInicio = new Date(reservaRecurrente.fechaInicio);
  const fechaActual = new Date();
  
  // Calcular las fechas de las reservas
  const fechasReservas = calcularFechasReservas(
    fechaInicio,
    reservaRecurrente.frecuencia,
    reservaRecurrente.diaSemana,
    reservaRecurrente.numeroRepeticiones,
    reservaRecurrente.fechaFin
  );
  
  // Crear reservas para cada fecha (solo las futuras)
  for (const fecha of fechasReservas) {
    // Solo crear reservas futuras
    if (fecha < fechaActual) {
      continue;
    }
    
    // Verificar disponibilidad antes de crear
    try {
      const disponible = await verificarDisponibilidad(
        fecha,
        reservaRecurrente.horaInicio,
        reservaRecurrente.tipo,
        undefined,
        reservaRecurrente.entrenadorId,
        reservaRecurrente.horaFin
      );
      
      if (!disponible) {
        console.warn(`[ReservasRecurrentes] Horario no disponible para ${fecha.toISOString()} ${reservaRecurrente.horaInicio}`);
        continue;
      }
      
      // Crear la reserva
      const reserva = await crearReserva({
        clienteId: reservaRecurrente.clienteId,
        clienteNombre: reservaRecurrente.clienteNombre,
        fecha,
        horaInicio: reservaRecurrente.horaInicio,
        horaFin: reservaRecurrente.horaFin,
        tipo: reservaRecurrente.tipo,
        tipoSesion: reservaRecurrente.tipoSesion,
        estado: 'confirmada', // Las reservas recurrentes se crean confirmadas por defecto
        precio: reservaRecurrente.precio,
        pagado: false, // El pago se gestiona individualmente
        duracionMinutos: reservaRecurrente.duracionMinutos,
        bonoId: reservaRecurrente.bonoId,
        observaciones: reservaRecurrente.observaciones 
          ? `${reservaRecurrente.observaciones}\n[Reserva recurrente creada automáticamente]`
          : '[Reserva recurrente creada automáticamente]',
      }, reservaRecurrente.entrenadorId);
      
      reservas.push(reserva);
    } catch (error) {
      console.error(`[ReservasRecurrentes] Error creando reserva para ${fecha.toISOString()}:`, error);
    }
  }
  
  // Actualizar contador de reservas creadas
  console.log(`[ReservasRecurrentes] Creadas ${reservas.length} reservas desde patrón recurrente`);
  
  return reservas;
};

/**
 * Calcula las fechas de las reservas basadas en el patrón de recurrencia
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
 * Obtiene todas las reservas recurrentes de un entrenador
 */
export const getReservasRecurrentes = async (
  entrenadorId: string
): Promise<ReservaRecurrente[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Datos de ejemplo para desarrollo
  const hoy = new Date();
  const addDays = (days: number) => new Date(hoy.getTime() + days * 86400000);
  
  return [
    {
      id: '1',
      entrenadorId,
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
      reservasCreadas: 3,
      createdAt: addDays(-14),
      updatedAt: addDays(-1),
    },
    {
      id: '2',
      entrenadorId,
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
      reservasCreadas: 2,
      createdAt: addDays(-10),
      updatedAt: addDays(-3),
    },
    {
      id: '3',
      entrenadorId,
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
      activo: true,
      reservasCreadas: 1,
      createdAt: addDays(-7),
      updatedAt: addDays(-7),
    },
  ];
};

/**
 * Obtiene una reserva recurrente por ID
 */
export const getReservaRecurrentePorId = async (
  entrenadorId: string,
  reservaRecurrenteId: string
): Promise<ReservaRecurrente | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Buscar en las reservas recurrentes
  const reservasRecurrentes = await getReservasRecurrentes(entrenadorId);
  return reservasRecurrentes.find(r => r.id === reservaRecurrenteId) || null;
};

/**
 * Actualiza una reserva recurrente
 */
export const actualizarReservaRecurrente = async (
  reservaRecurrenteId: string,
  actualizaciones: Partial<ReservaRecurrente>
): Promise<ReservaRecurrente> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // En producción, esto actualizaría la reserva recurrente en la base de datos
  throw new Error('No implementado');
};

/**
 * Desactiva una reserva recurrente
 */
export const desactivarReservaRecurrente = async (
  reservaRecurrenteId: string
): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // En producción, esto desactivaría la reserva recurrente
  console.log('[ReservasRecurrentes] Desactivando reserva recurrente:', reservaRecurrenteId);
};

/**
 * Obtiene todas las reservas futuras asociadas a una reserva recurrente
 */
export const getReservasFuturasDeRecurrente = async (
  reservaRecurrenteId: string,
  entrenadorId: string
): Promise<Reserva[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción, esto buscaría todas las reservas futuras creadas desde esta recurrencia
  // Por ahora, devolvemos un array vacío
  return [];
};

/**
 * Cancela todas las reservas futuras de una serie recurrente
 */
export const cancelarReservasRecurrentes = async (
  reservaRecurrenteId: string,
  entrenadorId: string,
  motivo?: string,
  soloFuturas: boolean = true
): Promise<{ canceladas: number; errores: number }> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // En producción, esto:
  // 1. Buscaría la reserva recurrente
  // 2. Buscaría todas las reservas futuras asociadas
  // 3. Cancelaría cada una de ellas
  // 4. Opcionalmente desactivaría la recurrencia
  
  console.log('[ReservasRecurrentes] Cancelando reservas recurrentes:', {
    reservaRecurrenteId,
    entrenadorId,
    motivo,
    soloFuturas
  });
  
  // Simular cancelación de reservas
  const reservaRecurrente = await getReservaRecurrentePorId(entrenadorId, reservaRecurrenteId);
  if (!reservaRecurrente) {
    throw new Error('Reserva recurrente no encontrada');
  }
  
  // Calcular cuántas reservas futuras se cancelarían
  const fechaActual = new Date();
  const fechasReservas = calcularFechasReservas(
    reservaRecurrente.fechaInicio,
    reservaRecurrente.frecuencia,
    reservaRecurrente.diaSemana,
    reservaRecurrente.numeroRepeticiones,
    reservaRecurrente.fechaFin
  );
  
  const reservasFuturas = fechasReservas.filter(fecha => fecha >= fechaActual);
  
  // En producción, aquí se cancelarían las reservas reales
  // Por ahora, solo retornamos el número simulado
  return {
    canceladas: reservasFuturas.length,
    errores: 0
  };
};

/**
 * Modifica todas las reservas futuras de una serie recurrente
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
  
  // En producción, esto:
  // 1. Buscaría la reserva recurrente
  // 2. Actualizaría la configuración de la recurrencia
  // 3. Buscaría todas las reservas futuras asociadas
  // 4. Modificaría cada una de ellas según las nuevas configuraciones
  
  console.log('[ReservasRecurrentes] Modificando reservas recurrentes:', {
    reservaRecurrenteId,
    entrenadorId,
    modificaciones,
    soloFuturas
  });
  
  // Simular modificación de reservas
  const reservaRecurrente = await getReservaRecurrentePorId(entrenadorId, reservaRecurrenteId);
  if (!reservaRecurrente) {
    throw new Error('Reserva recurrente no encontrada');
  }
  
  // Calcular cuántas reservas futuras se modificarían
  const fechaActual = new Date();
  const fechasReservas = calcularFechasReservas(
    reservaRecurrente.fechaInicio,
    reservaRecurrente.frecuencia,
    reservaRecurrente.diaSemana,
    reservaRecurrente.numeroRepeticiones,
    reservaRecurrente.fechaFin
  );
  
  const reservasFuturas = fechasReservas.filter(fecha => fecha >= fechaActual);
  
  // En producción, aquí se modificarían las reservas reales
  // Por ahora, solo retornamos el número simulado
  return {
    modificadas: reservasFuturas.length,
    errores: 0
  };
};

