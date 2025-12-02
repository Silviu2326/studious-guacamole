/**
 * API para obtener estadísticas de asistencia por cliente
 * 
 * DOCUMENTACIÓN: Alimentación de datos desde reservas completadas y canceladas
 * =============================================================================
 * 
 * Las estadísticas de asistencia se calculan directamente a partir del estado
 * de las reservas en el sistema:
 * 
 * 1. RESERVAS COMPLETADAS (estado: 'completada'):
 *    - Se cuentan como ASISTENCIAS
 *    - Incrementan el contador de asistencias del cliente
 *    - Se utilizan para calcular la tasa de asistencia
 *    - Actualizan la fecha de última asistencia
 * 
 * 2. RESERVAS CANCELADAS (estado: 'canceladaCliente' o 'canceladaCentro'):
 *    - Se cuentan como CANCELACIONES
 *    - Incrementan el contador de cancelaciones del cliente
 *    - Reducen la tasa de asistencia (son reservas no realizadas)
 *    - No cuentan como asistencia ni como no-show
 * 
 * 3. NO-SHOWS (estado: 'noShow'):
 *    - Se cuentan como NO-SHOWS
 *    - Incrementan el contador de no-shows del cliente
 *    - Se utilizan para calcular la tasa de no-show
 *    - Indicador importante de clientes problemáticos
 * 
 * 4. CÁLCULOS REALIZADOS:
 *    - totalReservas: Suma de todas las reservas (completadas + canceladas + no-shows + pendientes)
 *    - asistencias: Reservas con estado 'completada'
 *    - cancelaciones: Reservas con estado 'canceladaCliente' o 'canceladaCentro'
 *    - noShows: Reservas con estado 'noShow'
 *    - tasaAsistencia: (asistencias / totalReservas) * 100
 *    - tasaNoShow: (noShows / totalReservas) * 100
 * 
 * 5. FILTROS APLICABLES:
 *    - Por rango de fechas (fechaInicio, fechaFin)
 *    - Por cliente específico (clienteId)
 *    - Por entrenador (entrenadorId)
 *    - Por estado de reserva
 *    - Por tasa mínima de asistencia
 *    - Por tasa máxima de no-show
 * 
 * 6. CASOS DE USO:
 *    - Identificar clientes con alta tasa de no-show
 *    - Analizar patrones de asistencia
 *    - Detectar clientes problemáticos
 *    - Calcular métricas de retención de clientes
 */

import { Reserva, EstadisticasAsistencia, EstadoReserva, FiltrosReservas } from '../types';
import { getReservas } from './reservas';

export interface EstadisticasCliente {
  clienteId: string;
  clienteNombre: string;
  totalReservas: number;
  reservasCompletadas: number;
  reservasNoShow: number;
  reservasCanceladas: number;
  reservasPendientes: number;
  tasaAsistencia: number; // Porcentaje de asistencia (completadas / total)
  tasaNoShow: number; // Porcentaje de no shows (no-show / total)
  ultimaReserva?: Date;
  ultimaAsistencia?: Date;
  ultimoNoShow?: Date;
}

/**
 * Obtiene estadísticas de asistencia por cliente para un entrenador
 */
export const getEstadisticasAsistenciaPorCliente = async (
  entrenadorId: string,
  fechaInicio?: Date,
  fechaFin?: Date
): Promise<EstadisticasCliente[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  // Obtener todas las reservas del entrenador
  const inicio = fechaInicio || new Date();
  inicio.setMonth(inicio.getMonth() - 6); // Por defecto, últimos 6 meses
  const fin = fechaFin || new Date();

  const reservas = await getReservas(inicio, fin, 'entrenador');

  // Agrupar reservas por cliente
  const estadisticasPorCliente = new Map<string, EstadisticasCliente>();

  reservas.forEach((reserva) => {
    const clienteId = reserva.clienteId;
    
    if (!estadisticasPorCliente.has(clienteId)) {
      estadisticasPorCliente.set(clienteId, {
        clienteId,
        clienteNombre: reserva.clienteNombre,
        totalReservas: 0,
        reservasCompletadas: 0,
        reservasNoShow: 0,
        reservasCanceladas: 0,
        reservasPendientes: 0,
        tasaAsistencia: 0,
        tasaNoShow: 0,
      });
    }

    const estadisticas = estadisticasPorCliente.get(clienteId)!;
    estadisticas.totalReservas++;

    switch (reserva.estado) {
      case 'completada':
        estadisticas.reservasCompletadas++;
        if (!estadisticas.ultimaAsistencia || reserva.fecha > estadisticas.ultimaAsistencia) {
          estadisticas.ultimaAsistencia = reserva.fecha;
        }
        break;
      case 'no-show':
        estadisticas.reservasNoShow++;
        if (!estadisticas.ultimoNoShow || reserva.fecha > estadisticas.ultimoNoShow) {
          estadisticas.ultimoNoShow = reserva.fecha;
        }
        break;
      case 'cancelada':
        estadisticas.reservasCanceladas++;
        break;
      case 'pendiente':
      case 'confirmada':
        estadisticas.reservasPendientes++;
        break;
    }

    // Actualizar última reserva
    if (!estadisticas.ultimaReserva || reserva.fecha > estadisticas.ultimaReserva) {
      estadisticas.ultimaReserva = reserva.fecha;
    }
  });

  // Calcular tasas de asistencia y no show
  const estadisticasArray = Array.from(estadisticasPorCliente.values());
  
  estadisticasArray.forEach((estadistica) => {
    if (estadistica.totalReservas > 0) {
      // Tasa de asistencia: completadas / total
      estadistica.tasaAsistencia = Math.round(
        (estadistica.reservasCompletadas / estadistica.totalReservas) * 100
      );
      
      // Tasa de no show: no-show / total
      estadistica.tasaNoShow = Math.round(
        (estadistica.reservasNoShow / estadistica.totalReservas) * 100
      );
    }
  });

  // Ordenar por tasa de no show descendente (clientes problemáticos primero)
  estadisticasArray.sort((a, b) => {
    // Primero por tasa de no show descendente
    if (b.tasaNoShow !== a.tasaNoShow) {
      return b.tasaNoShow - a.tasaNoShow;
    }
    // Luego por número total de no shows descendente
    if (b.reservasNoShow !== a.reservasNoShow) {
      return b.reservasNoShow - a.reservasNoShow;
    }
    // Finalmente por nombre
    return a.clienteNombre.localeCompare(b.clienteNombre);
  });

  return estadisticasArray;
};

/**
 * Obtiene el resumen general de estadísticas de asistencia
 */
export interface ResumenEstadisticasAsistencia {
  totalClientes: number;
  totalReservas: number;
  totalCompletadas: number;
  totalNoShows: number;
  totalCanceladas: number;
  tasaAsistenciaGeneral: number;
  tasaNoShowGeneral: number;
  clientesProblematicos: number; // Clientes con tasa de no show > 20%
}

export const getResumenEstadisticasAsistencia = async (
  entrenadorId: string,
  fechaInicio?: Date,
  fechaFin?: Date
): Promise<ResumenEstadisticasAsistencia> => {
  const estadisticas = await getEstadisticasAsistenciaPorCliente(
    entrenadorId,
    fechaInicio,
    fechaFin
  );

  const totalClientes = estadisticas.length;
  const totalReservas = estadisticas.reduce((sum, e) => sum + e.totalReservas, 0);
  const totalCompletadas = estadisticas.reduce((sum, e) => sum + e.reservasCompletadas, 0);
  const totalNoShows = estadisticas.reduce((sum, e) => sum + e.reservasNoShow, 0);
  const totalCanceladas = estadisticas.reduce((sum, e) => sum + e.reservasCanceladas, 0);

  const tasaAsistenciaGeneral = totalReservas > 0
    ? Math.round((totalCompletadas / totalReservas) * 100)
    : 0;

  const tasaNoShowGeneral = totalReservas > 0
    ? Math.round((totalNoShows / totalReservas) * 100)
    : 0;

  const clientesProblematicos = estadisticas.filter(
    (e) => e.tasaNoShow > 20 || e.reservasNoShow >= 3
  ).length;

  return {
    totalClientes,
    totalReservas,
    totalCompletadas,
    totalNoShows,
    totalCanceladas,
    tasaAsistenciaGeneral,
    tasaNoShowGeneral,
    clientesProblematicos,
  };
};

// ============================================================================
// FUNCIÓN PRINCIPAL: getEstadisticasAsistenciaClientes
// ============================================================================

/**
 * Filtros para obtener estadísticas de asistencia
 */
export interface FiltrosEstadisticasAsistencia {
  fechaInicio?: Date;
  fechaFin?: Date;
  clienteId?: string;
  entrenadorId?: string;
  estado?: EstadoReserva | EstadoReserva[];
  minimoTasaAsistencia?: number; // Filtrar por tasa mínima de asistencia (0-100)
  maximoTasaNoShow?: number; // Filtrar por tasa máxima de no-show (0-100)
}

/**
 * Obtiene estadísticas de asistencia por cliente con filtros configurables
 * 
 * @param filtros - Filtros para buscar estadísticas (fechas, cliente, entrenador, etc.)
 * @returns Lista de estadísticas de asistencia por cliente
 * 
 * @example
 * ```typescript
 * // Obtener estadísticas de todos los clientes en un período
 * const estadisticas = await getEstadisticasAsistenciaClientes({
 *   fechaInicio: new Date('2024-01-01'),
 *   fechaFin: new Date('2024-12-31'),
 *   entrenadorId: 'entrenador1'
 * });
 * 
 * // Filtrar solo clientes con tasa de asistencia mayor al 80%
 * const clientesFieles = await getEstadisticasAsistenciaClientes({
 *   minimoTasaAsistencia: 80
 * });
 * ```
 * 
 * @remarks
 * Esta función calcula las estadísticas de asistencia basándose en las reservas
 * completadas, canceladas y con no-show. Los datos se alimentan directamente de:
 * 
 * - Reservas completadas: Reservas con estado 'completada'
 * - Reservas canceladas: Reservas con estado 'canceladaCliente' o 'canceladaCentro'
 * - No-shows: Reservas con estado 'noShow'
 * 
 * Las tasas se calculan como porcentajes (0-100):
 * - tasaAsistencia = (asistencias / totalReservas) * 100
 * - tasaNoShow = (noShows / totalReservas) * 100
 * 
 * En producción, esta función se conectaría con un backend REST/GraphQL:
 * - REST: GET /api/estadisticas/asistencia?fechaInicio=...&fechaFin=...&clienteId=...
 * - GraphQL: query { estadisticasAsistencia(filtros: {...}) { clienteId, totalReservas, ... } }
 */
export const getEstadisticasAsistenciaClientes = async (
  filtros: FiltrosEstadisticasAsistencia = {}
): Promise<EstadisticasAsistencia[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  // Construir filtros para obtener reservas
  const hoy = new Date();
  const fechaInicio = filtros.fechaInicio || (() => {
    const inicio = new Date();
    inicio.setMonth(inicio.getMonth() - 6); // Por defecto, últimos 6 meses
    return inicio;
  })();
  const fechaFin = filtros.fechaFin || hoy;

  const filtrosReservas: FiltrosReservas = {
    fechaInicio,
    fechaFin,
    entrenadorId: filtros.entrenadorId,
    clienteId: filtros.clienteId,
    estado: filtros.estado,
  };

  // Obtener reservas aplicando filtros
  const reservas = await getReservas(filtrosReservas, 'entrenador');

  // Agrupar reservas por cliente y calcular estadísticas
  const estadisticasPorCliente = new Map<string, {
    clienteId: string;
    clienteNombre?: string;
    totalReservas: number;
    asistencias: number;
    noShows: number;
    cancelaciones: number;
    ultimaReserva?: Date;
    ultimaAsistencia?: Date;
    ultimoNoShow?: Date;
  }>();

  reservas.forEach((reserva) => {
    const clienteId = reserva.clienteId;

    if (!estadisticasPorCliente.has(clienteId)) {
      estadisticasPorCliente.set(clienteId, {
        clienteId,
        clienteNombre: reserva.clienteNombre,
        totalReservas: 0,
        asistencias: 0,
        noShows: 0,
        cancelaciones: 0,
      });
    }

    const estadistica = estadisticasPorCliente.get(clienteId)!;
    estadistica.totalReservas++;

    // Usar fechaInicio de la reserva si está disponible, sino usar fecha
    const fechaReserva = reserva.fechaInicio || reserva.fecha || new Date();

    switch (reserva.estado) {
      case 'completada':
        estadistica.asistencias++;
        if (!estadistica.ultimaAsistencia || fechaReserva > estadistica.ultimaAsistencia) {
          estadistica.ultimaAsistencia = fechaReserva;
        }
        break;
      case 'noShow':
        estadistica.noShows++;
        if (!estadistica.ultimoNoShow || fechaReserva > estadistica.ultimoNoShow) {
          estadistica.ultimoNoShow = fechaReserva;
        }
        break;
      case 'canceladaCliente':
      case 'canceladaCentro':
        estadistica.cancelaciones++;
        break;
    }

    // Actualizar última reserva
    if (!estadistica.ultimaReserva || fechaReserva > estadistica.ultimaReserva) {
      estadistica.ultimaReserva = fechaReserva;
    }
  });

  // Convertir a array de EstadisticasAsistencia y calcular tasas
  const estadisticas: EstadisticasAsistencia[] = Array.from(estadisticasPorCliente.values())
    .map((est) => {
      const tasaAsistencia = est.totalReservas > 0
        ? Math.round((est.asistencias / est.totalReservas) * 100)
        : 0;

      const tasaNoShow = est.totalReservas > 0
        ? Math.round((est.noShows / est.totalReservas) * 100)
        : 0;

      return {
        clienteId: est.clienteId,
        totalReservas: est.totalReservas,
        asistencias: est.asistencias,
        noShows: est.noShows,
        cancelaciones: est.cancelaciones,
        tasaAsistencia,
        tasaNoShow,
        reservasCompletadas: est.asistencias, // Alias
        reservasNoShow: est.noShows, // Alias
        reservasCanceladas: est.cancelaciones, // Alias
        ultimaReserva: est.ultimaReserva,
        ultimaAsistencia: est.ultimaAsistencia,
        ultimoNoShow: est.ultimoNoShow,
        clienteNombre: est.clienteNombre,
      };
    })
    // Aplicar filtros adicionales
    .filter((est) => {
      if (filtros.minimoTasaAsistencia !== undefined) {
        if (est.tasaAsistencia < filtros.minimoTasaAsistencia) {
          return false;
        }
      }
      if (filtros.maximoTasaNoShow !== undefined) {
        if (est.tasaNoShow !== undefined && est.tasaNoShow > filtros.maximoTasaNoShow) {
          return false;
        }
      }
      return true;
    })
    // Ordenar por tasa de no-show descendente (clientes problemáticos primero)
    .sort((a, b) => {
      const tasaNoShowA = a.tasaNoShow || 0;
      const tasaNoShowB = b.tasaNoShow || 0;
      if (tasaNoShowB !== tasaNoShowA) {
        return tasaNoShowB - tasaNoShowA;
      }
      if (b.noShows !== a.noShows) {
        return b.noShows - a.noShows;
      }
      return (a.clienteNombre || '').localeCompare(b.clienteNombre || '');
    });

  return estadisticas;
};


