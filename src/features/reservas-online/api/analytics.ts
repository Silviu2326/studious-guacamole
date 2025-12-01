/**
 * API para obtener analytics agregados de reservas
 * 
 * Calcula métricas generales como:
 * - Total de reservas
 * - Tasa de ocupación
 * - Ratio de cancelaciones/no-shows
 * - Ingresos totales y promedio
 * - Distribución por tipo, mes, horario
 */

import { Reserva, AnalyticsReservas, FiltrosReservas } from '../types';
import { getReservas } from './reservas';

export interface FiltrosAnalytics extends FiltrosReservas {
  fechaInicio?: Date;
  fechaFin?: Date;
  entrenadorId?: string;
  centroId?: string;
}

/**
 * Obtiene analytics agregados de reservas
 */
export const getAnalyticsReservas = async (
  filtros: FiltrosAnalytics = {},
  role: 'entrenador' | 'gimnasio' = 'entrenador'
): Promise<AnalyticsReservas> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  // Construir filtros para obtener reservas
  const hoy = new Date();
  const fechaInicio = filtros.fechaInicio || (() => {
    const inicio = new Date();
    inicio.setMonth(inicio.getMonth() - 3); // Por defecto, últimos 3 meses
    return inicio;
  })();
  const fechaFin = filtros.fechaFin || hoy;

  const filtrosReservas: FiltrosReservas = {
    fechaInicio,
    fechaFin,
    entrenadorId: filtros.entrenadorId,
    clienteId: filtros.clienteId,
    estado: filtros.estado,
    origen: filtros.origen,
    tipo: filtros.tipo,
    tipoSesion: filtros.tipoSesion,
  };

  // Obtener reservas del período
  const reservas = await getReservas(filtrosReservas, role);

  // Calcular métricas básicas
  const totalReservas = reservas.length;
  const reservasConfirmadas = reservas.filter(r => r.estado === 'confirmada' || r.estado === 'completada').length;
  const reservasCanceladas = reservas.filter(r => 
    r.estado === 'canceladaCliente' || r.estado === 'canceladaCentro'
  ).length;
  const reservasNoShow = reservas.filter(r => r.estado === 'noShow').length;
  const reservasCompletadas = reservas.filter(r => r.estado === 'completada').length;

  // Calcular ingresos (solo de reservas completadas/confirmadas que están pagadas)
  const reservasConIngreso = reservas.filter(r => 
    r.pagado && (r.estado === 'completada' || r.estado === 'confirmada')
  );
  const ingresosTotales = reservasConIngreso.reduce((sum, r) => sum + (r.precio || 0), 0);
  const promedioPorReserva = reservasConIngreso.length > 0 
    ? ingresosTotales / reservasConIngreso.length 
    : 0;

  // Calcular tasa de ocupación (reservas completadas / total reservas)
  const tasaOcupacion = totalReservas > 0
    ? Math.round((reservasCompletadas / totalReservas) * 100)
    : 0;

  // Reservas por tipo
  const reservasPorTipo: Record<string, number> = {};
  reservas.forEach(r => {
    const tipo = r.tipo || 'otro';
    reservasPorTipo[tipo] = (reservasPorTipo[tipo] || 0) + 1;
  });

  // Reservas por mes
  const reservasPorMesMap = new Map<string, number>();
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  
  reservas.forEach(r => {
    const fecha = r.fecha || r.fechaInicio || new Date();
    const mes = meses[fecha.getMonth()];
    reservasPorMesMap.set(mes, (reservasPorMesMap.get(mes) || 0) + 1);
  });

  const reservasPorMes = Array.from(reservasPorMesMap.entries())
    .map(([mes, cantidad]) => ({ mes, cantidad }))
    .sort((a, b) => {
      const indexA = meses.indexOf(a.mes);
      const indexB = meses.indexOf(b.mes);
      return indexA - indexB;
    });

  // Horarios más reservados
  const horariosMap = new Map<string, number>();
  reservas.forEach(r => {
    const hora = r.horaInicio || '00:00';
    // Normalizar a franjas horarias (redondear a la hora)
    const [h, m] = hora.split(':').map(Number);
    const horaNormalizada = `${String(h).padStart(2, '0')}:00`;
    horariosMap.set(horaNormalizada, (horariosMap.get(horaNormalizada) || 0) + 1);
  });

  const horariosMasReservados = Array.from(horariosMap.entries())
    .map(([hora, cantidad]) => ({ hora, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 10); // Top 10

  return {
    totalReservas,
    reservasConfirmadas,
    reservasCanceladas,
    tasaOcupacion,
    ingresosTotales,
    promedioPorReserva,
    reservasPorTipo,
    reservasPorMes,
    horariosMasReservados,
  };
};

