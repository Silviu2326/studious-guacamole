// API para obtener estadísticas de asistencia por cliente

import { Reserva } from '../types';
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


