import { Reserva } from '../types';
import { getConfiguracionTiempoMinimoAnticipacion } from './configuracionTiempoMinimoAnticipacion';
import { verificarDisponibilidad } from './disponibilidad';
import { verificarPoliticaCancelacion } from './politicasCancelacion';

/**
 * Contexto para validar disponibilidad de un slot
 */
export interface ContextoValidacionSlot {
  reservasExistentes: Reserva[];
  entrenadorId?: string;
  claseId?: string;
}

/**
 * Datos del slot a validar
 */
export interface DatosSlot {
  fecha: Date;
  horaInicio: string;
  horaFin: string;
  tipo: 'sesion-1-1' | 'clase-grupal' | 'fisio' | 'nutricion' | 'masaje';
  entrenadorId?: string;
  claseId?: string;
}

/**
 * Configuración de tiempo mínimo de anticipación
 */
export interface ConfiguracionTiempoMinimo {
  horasMinimas: number;
  activo?: boolean;
}

/**
 * Valida si un slot está disponible para una reserva
 * 
 * Verifica que:
 * - El slot no se solape con reservas existentes
 * - El slot esté dentro del horario disponible del entrenador
 * - No haya conflictos de capacidad (para clases grupales)
 * 
 * @param reserva - Datos del slot a validar
 * @param contexto - Contexto con reservas existentes y configuración
 * @returns Objeto con `valido` (boolean) y `mensaje` (string) si no es válido
 * 
 * @example
 * ```typescript
 * const validacion = await validarSlotDisponible(
 *   {
 *     fecha: new Date('2024-01-15'),
 *     horaInicio: '10:00',
 *     horaFin: '11:00',
 *     tipo: 'sesion-1-1',
 *     entrenadorId: 'entrenador1'
 *   },
 *   {
 *     reservasExistentes: reservas,
 *     entrenadorId: 'entrenador1'
 *   }
 * );
 * 
 * if (!validacion.valido) {
 *   console.error(validacion.mensaje);
 * }
 * ```
 * 
 * @remarks
 * En producción, esta validación se realizaría en el backend:
 * - Verificar disponibilidad contra la base de datos
 * - Considerar buffer time entre reservas
 * - Verificar horarios del entrenador
 * - Verificar capacidad de salas/clases
 * - Considerar bloqueos y excepciones
 */
export const validarSlotDisponible = async (
  reserva: DatosSlot,
  contexto: ContextoValidacionSlot
): Promise<{ valido: boolean; mensaje?: string }> => {
  try {
    // Verificar disponibilidad usando el módulo de disponibilidad
    if (reserva.entrenadorId) {
      const disponible = await verificarDisponibilidad(
        reserva.fecha,
        reserva.horaInicio,
        reserva.tipo,
        reserva.claseId,
        reserva.entrenadorId,
        reserva.horaFin
      );
      
      if (!disponible) {
        return {
          valido: false,
          mensaje: 'El horario seleccionado no está disponible según el horario del entrenador',
        };
      }
    }
    
    // Verificar solapamiento con reservas existentes
    const reservasExistentes = contexto.reservasExistentes || [];
    const fechaReserva = new Date(reserva.fecha);
    fechaReserva.setHours(0, 0, 0, 0);
    
    // Convertir horas a minutos para comparación
    const convertirHoraAMinutos = (hora: string): number => {
      const [h, m] = hora.split(':').map(Number);
      return h * 60 + m;
    };
    
    const slotInicioMinutos = convertirHoraAMinutos(reserva.horaInicio);
    const slotFinMinutos = convertirHoraAMinutos(reserva.horaFin);
    
    // Verificar solapamiento
    const haySolapamiento = reservasExistentes.some(r => {
      // Solo considerar reservas confirmadas o pendientes
      if (r.estado !== 'confirmada' && r.estado !== 'pendiente') {
        return false;
      }
      
      // Verificar misma fecha
      const fechaR = new Date(r.fecha || r.fechaInicio);
      fechaR.setHours(0, 0, 0, 0);
      if (fechaR.getTime() !== fechaReserva.getTime()) {
        return false;
      }
      
      // Verificar solapamiento de horarios
      const rInicioMinutos = convertirHoraAMinutos(r.horaInicio || '');
      const rFinMinutos = convertirHoraAMinutos(r.horaFin || '');
      
      // Hay solapamiento si los intervalos se intersectan
      return !(slotFinMinutos <= rInicioMinutos || slotInicioMinutos >= rFinMinutos);
    });
    
    if (haySolapamiento) {
      return {
        valido: false,
        mensaje: 'El horario seleccionado se solapa con otra reserva existente',
      };
    }
    
    return { valido: true };
  } catch (error) {
    console.error('Error validando disponibilidad del slot:', error);
    // En caso de error, permitir la reserva (no bloquear por error de validación)
    return { valido: true };
  }
};

/**
 * Valida las políticas de cancelación para una reserva
 * 
 * Verifica que:
 * - La cancelación se realice dentro del tiempo mínimo requerido
 * - Se cumplan las políticas de penalización
 * - La reserva pueda ser cancelada según su estado
 * 
 * @param reserva - Reserva a cancelar
 * @param fechaActual - Fecha actual (para calcular tiempo restante)
 * @returns Objeto con `valido` (boolean) y `mensaje` (string) si no es válido
 * 
 * @example
 * ```typescript
 * const validacion = await validarPoliticasCancelacion(
 *   reserva,
 *   new Date()
 * );
 * 
 * if (!validacion.valido) {
 *   console.error(validacion.mensaje);
 * }
 * ```
 * 
 * @remarks
 * En producción, esta validación se realizaría en el backend:
 * - Consultar políticas de cancelación del entrenador/centro
 * - Calcular tiempo restante hasta la reserva
 * - Verificar si se aplican penalizaciones
 * - Validar estado actual de la reserva
 * - Considerar excepciones y casos especiales
 */
export const validarPoliticasCancelacion = async (
  reserva: Reserva,
  fechaActual: Date
): Promise<{ valido: boolean; mensaje?: string }> => {
  try {
    // Si no hay entrenadorId, no se pueden validar políticas
    if (!reserva.entrenadorId) {
      return { valido: true };
    }
    
    // Verificar políticas de cancelación usando el módulo existente
    const fechaReserva = reserva.fecha || reserva.fechaInicio;
    const horaReserva = reserva.horaInicio || '';
    const precioReserva = reserva.precio || 0;
    
    const verificacion = await verificarPoliticaCancelacion(
      reserva.entrenadorId,
      fechaReserva,
      horaReserva,
      precioReserva
    );
    
    if (!verificacion.puedeCancelar) {
      return {
        valido: false,
        mensaje: verificacion.mensaje || 'No se puede cancelar la reserva según las políticas configuradas',
      };
    }
    
    // Si es cancelación de último momento, informar pero permitir
    if (verificacion.esCancelacionUltimoMomento) {
      return {
        valido: true,
        mensaje: verificacion.mensaje || 'Cancelación de último momento. Se aplicarán las penalizaciones correspondientes.',
      };
    }
    
    return { valido: true };
  } catch (error) {
    console.error('Error validando políticas de cancelación:', error);
    // En caso de error, permitir la cancelación (no bloquear por error de validación)
    return { valido: true };
  }
};

/**
 * Valida si una reserva cumple con el tiempo mínimo de anticipación requerido
 * 
 * Versión genérica que acepta configuración personalizada.
 * 
 * @param fecha - Fecha de la reserva
 * @param horaInicio - Hora de inicio de la reserva (formato HH:mm)
 * @param configuracion - Configuración de tiempo mínimo
 * @returns Objeto con `valido` (boolean) y `mensaje` (string) si no es válido
 * 
 * @example
 * ```typescript
 * const validacion = await validarAnticipacion(
 *   new Date('2024-01-15'),
 *   '10:00',
 *   { horasMinimas: 24, activo: true }
 * );
 * ```
 * 
 * @remarks
 * En producción, esta validación se realizaría en el backend:
 * - Consultar configuración de tiempo mínimo del entrenador/centro
 * - Calcular tiempo entre ahora y la reserva
 * - Aplicar reglas específicas por tipo de sesión
 * - Considerar excepciones y casos especiales
 */
export const validarAnticipacion = async (
  fecha: Date,
  horaInicio: string,
  configuracion: ConfiguracionTiempoMinimo
): Promise<{ valido: boolean; mensaje?: string }> => {
  try {
    // Si la configuración no está activa, la reserva es válida
    if (configuracion.activo === false) {
      return { valido: true };
    }
    
    // Calcular la fecha y hora de inicio de la reserva
    const fechaHoraReserva = new Date(fecha);
    const [horas, minutos] = horaInicio.split(':').map(Number);
    fechaHoraReserva.setHours(horas, minutos, 0, 0);
    
    // Obtener la fecha y hora actual
    const ahora = new Date();
    
    // Calcular la diferencia en milisegundos
    const diferenciaMs = fechaHoraReserva.getTime() - ahora.getTime();
    
    // Convertir a horas
    const diferenciaHoras = diferenciaMs / (1000 * 60 * 60);
    
    // Verificar si cumple con el tiempo mínimo requerido
    if (diferenciaHoras < configuracion.horasMinimas) {
      const horasRestantes = configuracion.horasMinimas - diferenciaHoras;
      const mensaje = `Las reservas deben realizarse con al menos ${configuracion.horasMinimas} hora${configuracion.horasMinimas !== 1 ? 's' : ''} de anticipación. Faltan ${Math.ceil(horasRestantes)} hora${Math.ceil(horasRestantes) !== 1 ? 's' : ''}.`;
      return { valido: false, mensaje };
    }
    
    return { valido: true };
  } catch (error) {
    console.error('Error validando anticipación:', error);
    // En caso de error, permitir la reserva (no bloquear por error de configuración)
    return { valido: true };
  }
};

/**
 * Valida si una reserva cumple con el tiempo mínimo de anticipación requerido
 * 
 * Versión que usa la configuración del entrenador.
 * 
 * @param fecha - Fecha de la reserva
 * @param horaInicio - Hora de inicio de la reserva (formato HH:mm)
 * @param entrenadorId - ID del entrenador
 * @returns Objeto con `valido` (boolean) y `mensaje` (string) si no es válido
 * 
 * @remarks
 * Esta función mantiene compatibilidad con código existente.
 * En producción, usar validarAnticipacion con configuración explícita.
 */
export const validarTiempoMinimoAnticipacion = async (
  fecha: Date,
  horaInicio: string,
  entrenadorId: string
): Promise<{ valido: boolean; mensaje?: string }> => {
  try {
    // Obtener configuración de tiempo mínimo de anticipación
    const config = await getConfiguracionTiempoMinimoAnticipacion(entrenadorId);
    
    // Usar la función genérica con la configuración obtenida
    return await validarAnticipacion(
      fecha,
      horaInicio,
      {
        horasMinimas: config.horasMinimasAnticipacion || 24,
        activo: config.activo,
      }
    );
  } catch (error) {
    console.error('Error validando tiempo mínimo de anticipación:', error);
    // En caso de error, permitir la reserva (no bloquear por error de configuración)
    return { valido: true };
  }
};


