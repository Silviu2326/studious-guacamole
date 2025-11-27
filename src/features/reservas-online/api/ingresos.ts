/**
 * API para obtener ingresos por horario y por cliente
 * 
 * DOCUMENTACIÓN: Alimentación de datos desde reservas completadas y canceladas
 * =============================================================================
 * 
 * Los ingresos se calculan directamente a partir de las reservas que generan
 * ingresos reales en el sistema:
 * 
 * 1. RESERVAS COMPLETADAS (estado: 'completada' + pagado: true):
 *    - GENERAN INGRESOS: Se suman al total de ingresos
 *    - Se incluyen en el cálculo de ingresos por horario
 *    - Se incluyen en el cálculo de ingresos por cliente
 *    - El precio de la reserva (reserva.precio) se suma a los ingresos totales
 * 
 * 2. RESERVAS CONFIRMADAS (estado: 'confirmada' + pagado: true):
 *    - GENERAN INGRESOS: Se suman al total de ingresos
 *    - Se consideran como ingreso anticipado
 *    - Se incluyen en los cálculos de ingresos
 * 
 * 3. RESERVAS CANCELADAS (estado: 'canceladaCliente' o 'canceladaCentro'):
 *    - NO GENERAN INGRESOS: Por defecto, las reservas canceladas no generan ingresos
 *    - Se cuentan en reservasCanceladas para estadísticas, pero no en ingresosTotales
 *    - Excepción: Si hay políticas de cancelación con penalizaciones/reembolsos parciales,
 *      algunos ingresos podrían mantenerse (requiere configuración avanzada)
 * 
 * 4. RESERVAS NO PAGADAS (pagado: false):
 *    - NO GENERAN INGRESOS: Independientemente del estado
 *    - No se incluyen en los cálculos de ingresos
 * 
 * 5. AGRUPACIONES:
 * 
 *    A) POR FRANJA HORARIA (IngresosPorFranja):
 *       - Agrupa ingresos por rango horario (ej: "10:00-11:00")
 *       - Calcula ingresos totales por franja
 *       - Cuenta número de sesiones por franja
 *       - Calcula promedio por reserva
 *       - Útil para identificar horarios más rentables
 * 
 *    B) POR CLIENTE (IngresosPorCliente):
 *       - Agrupa ingresos por cliente
 *       - Calcula ingresos totales del cliente
 *       - Cuenta sesiones que generaron ingresos
 *       - Calcula ticket medio (promedio por sesión)
 *       - Incluye reservas completadas y canceladas para estadísticas completas
 *       - Útil para identificar clientes VIP o más valiosos
 * 
 * 6. CÁLCULOS REALIZADOS:
 *    - ingresosTotales: Suma de reserva.precio de todas las reservas completadas/confirmadas pagadas
 *    - numeroSesiones: Cantidad de reservas que generaron ingresos
 *    - promedioPorReserva / ticketMedio: ingresosTotales / numeroSesiones
 *    - reservasCompletadas: Total de reservas completadas (independiente del pago)
 *    - reservasCanceladas: Total de reservas canceladas (para contexto estadístico)
 * 
 * 7. FILTROS APLICABLES:
 *    - Por rango de fechas (fechaInicio, fechaFin)
 *    - Por cliente específico (clienteId)
 *    - Por entrenador (entrenadorId)
 *    - Por estado de reserva
 *    - Incluir canceladas (opcional, para reembolsos parciales)
 * 
 * 8. NOTA IMPORTANTE:
 *    Los ingresos reflejan SOLO el dinero realmente recibido (reservas pagadas).
 *    Las reservas canceladas normalmente no generan ingresos, a menos que haya
 *    políticas de penalización que permitan retener parte del pago.
 */

import { Reserva, IngresosPorFranja, IngresosPorCliente, FiltrosReservas, EstadoReserva } from '../types';
import { getReservas } from './reservas';

/**
 * Filtros para obtener ingresos
 */
export interface FiltrosIngresos {
  fechaInicio?: Date;
  fechaFin?: Date;
  clienteId?: string;
  entrenadorId?: string;
  estado?: EstadoReserva | EstadoReserva[];
  incluirCanceladas?: boolean; // Si se incluyen ingresos de reservas canceladas (si aplican reembolsos parciales)
}

/**
 * Obtiene los ingresos agrupados por franja horaria
 * 
 * @param filtros - Filtros para buscar ingresos (fechas, cliente, entrenador, etc.)
 * @returns Lista de ingresos agrupados por franja horaria
 * 
 * @example
 * ```typescript
 * // Obtener ingresos por horario en un período
 * const ingresos = await getIngresosPorHorario({
 *   fechaInicio: new Date('2024-01-01'),
 *   fechaFin: new Date('2024-12-31'),
 *   entrenadorId: 'entrenador1'
 * });
 * ```
 * 
 * @remarks
 * Esta función calcula los ingresos basándose en las reservas completadas y pagadas.
 * Los datos se alimentan directamente de:
 * 
 * - Reservas completadas: Reservas con estado 'completada' que tienen pagado=true
 * - Reservas confirmadas: Reservas con estado 'confirmada' que tienen pagado=true
 * 
 * Las reservas canceladas NO generan ingresos (a menos que incluirCanceladas=true y
 * haya políticas de reembolso parcial, lo cual es raro).
 * 
 * Los ingresos se agrupan por franja horaria (ej: "10:00-11:00") y se calculan:
 * - ingresos: Suma total de ingresos en esa franja
 * - numeroSesiones: Cantidad de sesiones en esa franja
 * - promedioPorReserva: Ingresos promedio por reserva
 * 
 * En producción, esta función se conectaría con un backend REST/GraphQL:
 * - REST: GET /api/ingresos/por-horario?fechaInicio=...&fechaFin=...
 * - GraphQL: query { ingresosPorHorario(filtros: {...}) { franja, ingresos, ... } }
 */
export const getIngresosPorHorario = async (
  filtros: FiltrosIngresos = {}
): Promise<IngresosPorFranja[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  // Construir filtros para obtener reservas
  const hoy = new Date();
  const fechaInicio = filtros.fechaInicio || (() => {
    const inicio = new Date();
    inicio.setMonth(inicio.getMonth() - 1); // Por defecto, último mes
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

  // Obtener reservas del período
  const reservas = await getReservas(filtrosReservas, 'entrenador');

  // Filtrar solo reservas que generan ingresos
  // Por defecto: solo completadas y confirmadas que están pagadas
  // Si incluirCanceladas=true, podríamos incluir canceladas con pagos parciales (raro)
  const reservasConIngreso = reservas.filter((r) => {
    if (!r.pagado) return false;
    
    if (r.estado === 'completada' || r.estado === 'confirmada') {
      return true;
    }
    
    // Opcional: incluir canceladas con reembolsos parciales (si aplica)
    if (filtros.incluirCanceladas && (r.estado === 'canceladaCliente' || r.estado === 'canceladaCentro')) {
      // En producción, aquí se calcularían los ingresos netos después de reembolsos
      return false; // Por defecto, no incluimos canceladas
    }
    
    return false;
  });

  // Agrupar por franja horaria
  const ingresosPorFranja: Record<string, { ingresos: number; cantidad: number; hora: string }> = {};

  reservasConIngreso.forEach((reserva) => {
    const horaInicio = reserva.horaInicio || '';
    const horaFin = reserva.horaFin || '';
    const franja = `${horaInicio}-${horaFin}`;
    const key = franja;

    if (!ingresosPorFranja[key]) {
      ingresosPorFranja[key] = { ingresos: 0, cantidad: 0, hora: horaInicio };
    }

    ingresosPorFranja[key].ingresos += reserva.precio || 0;
    ingresosPorFranja[key].cantidad += 1;
  });

  // Convertir a array de IngresosPorFranja
  const resultado: IngresosPorFranja[] = Object.entries(ingresosPorFranja)
    .map(([franja, datos]) => ({
      franja,
      ingresos: datos.ingresos,
      numeroSesiones: datos.cantidad,
      hora: datos.hora, // Campo adicional
      cantidadReservas: datos.cantidad, // Alias
      promedioPorReserva: datos.cantidad > 0 ? datos.ingresos / datos.cantidad : 0,
    }))
    // Ordenar por ingresos descendente
    .sort((a, b) => b.ingresos - a.ingresos);

  return resultado;
};

/**
 * Obtiene los ingresos agrupados por cliente
 * 
 * @param filtros - Filtros para buscar ingresos (fechas, cliente, entrenador, etc.)
 * @returns Lista de ingresos agrupados por cliente
 * 
 * @example
 * ```typescript
 * // Obtener ingresos por cliente en un período
 * const ingresos = await getIngresosPorCliente({
 *   fechaInicio: new Date('2024-01-01'),
 *   fechaFin: new Date('2024-12-31'),
 *   entrenadorId: 'entrenador1'
 * });
 * 
 * // Obtener ingresos de un cliente específico
 * const ingresosCliente = await getIngresosPorCliente({
 *   clienteId: 'cliente-123'
 * });
 * ```
 * 
 * @remarks
 * Esta función calcula los ingresos basándose en las reservas completadas y pagadas.
 * Los datos se alimentan directamente de:
 * 
 * - Reservas completadas: Reservas con estado 'completada' que tienen pagado=true
 * - Reservas confirmadas: Reservas con estado 'confirmada' que tienen pagado=true
 * 
 * Las reservas canceladas NO generan ingresos para el cálculo de ingresosTotales,
 * pero se cuentan en reservasCanceladas para estadísticas completas.
 * 
 * Para cada cliente se calcula:
 * - ingresosTotales: Suma de todos los ingresos de reservas completadas/confirmadas pagadas
 * - sesiones: Cantidad de sesiones que generaron ingresos
 * - ticketMedio: Ingresos promedio por sesión
 * - reservasCompletadas: Total de reservas completadas (independiente del pago)
 * - reservasCanceladas: Total de reservas canceladas
 * 
 * En producción, esta función se conectaría con un backend REST/GraphQL:
 * - REST: GET /api/ingresos/por-cliente?fechaInicio=...&fechaFin=...&clienteId=...
 * - GraphQL: query { ingresosPorCliente(filtros: {...}) { clienteId, ingresosTotales, ... } }
 */
export const getIngresosPorCliente = async (
  filtros: FiltrosIngresos = {}
): Promise<IngresosPorCliente[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  // Construir filtros para obtener reservas
  const hoy = new Date();
  const fechaInicio = filtros.fechaInicio || (() => {
    const inicio = new Date();
    inicio.setMonth(inicio.getMonth() - 1); // Por defecto, último mes
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

  // Obtener reservas del período
  const reservas = await getReservas(filtrosReservas, 'entrenador');

  // Agrupar por cliente
  const ingresosPorCliente: Record<string, {
    clienteId: string;
    clienteNombre?: string;
    ingresos: number;
    reservas: Reserva[];
    reservasCompletadas: number;
    reservasCanceladas: number;
  }> = {};

  reservas.forEach((reserva) => {
    const clienteId = reserva.clienteId;

    if (!ingresosPorCliente[clienteId]) {
      ingresosPorCliente[clienteId] = {
        clienteId,
        clienteNombre: reserva.clienteNombre,
        ingresos: 0,
        reservas: [],
        reservasCompletadas: 0,
        reservasCanceladas: 0,
      };
    }

    const clienteData = ingresosPorCliente[clienteId];
    clienteData.reservas.push(reserva);

    // Solo contar ingresos de reservas pagadas y completadas/confirmadas
    if (
      reserva.pagado &&
      (reserva.estado === 'completada' || reserva.estado === 'confirmada')
    ) {
      clienteData.ingresos += reserva.precio || 0;
    }

    // Contar reservas completadas y canceladas para estadísticas
    if (reserva.estado === 'completada' || reserva.estado === 'confirmada') {
      clienteData.reservasCompletadas += 1;
    }

    if (
      reserva.estado === 'canceladaCliente' ||
      reserva.estado === 'canceladaCentro'
    ) {
      clienteData.reservasCanceladas += 1;
    }
  });

  // Convertir a array de IngresosPorCliente
  const resultado: IngresosPorCliente[] = Object.values(ingresosPorCliente)
    .map((datos) => {
      const reservasPagadas = datos.reservas.filter(
        (r) => r.pagado && (r.estado === 'completada' || r.estado === 'confirmada')
      );

      // Encontrar la última reserva
      const reservasOrdenadas = datos.reservas.sort((a, b) => {
        const fechaA = a.fechaInicio?.getTime() || a.fecha?.getTime() || 0;
        const fechaB = b.fechaInicio?.getTime() || b.fecha?.getTime() || 0;
        return fechaB - fechaA;
      });
      const ultimaReserva = reservasOrdenadas[0];

      return {
        clienteId: datos.clienteId,
        clienteNombre: datos.clienteNombre,
        ingresosTotales: datos.ingresos,
        sesiones: reservasPagadas.length,
        ticketMedio: reservasPagadas.length > 0 ? datos.ingresos / reservasPagadas.length : 0,
        cantidadReservas: reservasPagadas.length, // Alias
        promedioPorReserva: reservasPagadas.length > 0 ? datos.ingresos / reservasPagadas.length : 0, // Alias
        ultimaReserva: ultimaReserva
          ? ultimaReserva.fechaInicio || ultimaReserva.fecha
          : undefined,
        reservasCompletadas: datos.reservasCompletadas,
        reservasCanceladas: datos.reservasCanceladas,
      };
    })
    // Filtrar solo clientes que han generado ingresos
    .filter((cliente) => cliente.ingresosTotales > 0)
    // Ordenar por ingresos descendente
    .sort((a, b) => b.ingresosTotales - a.ingresosTotales);

  return resultado;
};

