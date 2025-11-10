import { Reserva } from '../types';
import { getReservas } from './reservas';

/**
 * Interfaz para ingresos por horario
 */
export interface IngresoPorHorario {
  hora: string; // Formato: "HH:MM"
  franja: string; // Ej: "10:00-11:00"
  ingresos: number;
  cantidadReservas: number;
  promedioPorReserva: number;
}

/**
 * Interfaz para ingresos por cliente
 */
export interface IngresoPorCliente {
  clienteId: string;
  clienteNombre: string;
  ingresosTotales: number;
  cantidadReservas: number;
  promedioPorReserva: number;
  ultimaReserva?: Date;
  reservasCompletadas: number;
  reservasCanceladas: number;
}

/**
 * Obtiene los ingresos agrupados por horario
 * Solo considera reservas completadas y pagadas
 */
export const getIngresosPorHorario = async (
  fechaInicio: Date,
  fechaFin: Date,
  entrenadorId?: string
): Promise<IngresoPorHorario[]> => {
  // Obtener todas las reservas del período
  const reservas = await getReservas(fechaInicio, fechaFin, 'entrenador');
  
  // Filtrar solo reservas completadas y pagadas (o confirmadas y pagadas)
  const reservasConIngreso = reservas.filter(
    r => r.pagado && (r.estado === 'completada' || r.estado === 'confirmada')
  );
  
  // Agrupar por horario
  const ingresosPorHora: Record<string, { ingresos: number; cantidad: number }> = {};
  
  reservasConIngreso.forEach(reserva => {
    const hora = reserva.horaInicio;
    const franja = `${reserva.horaInicio}-${reserva.horaFin}`;
    const key = hora;
    
    if (!ingresosPorHora[key]) {
      ingresosPorHora[key] = { ingresos: 0, cantidad: 0 };
    }
    
    ingresosPorHora[key].ingresos += reserva.precio;
    ingresosPorHora[key].cantidad += 1;
  });
  
  // Convertir a array y calcular promedios
  const resultado: IngresoPorHorario[] = Object.entries(ingresosPorHora).map(([hora, datos]) => {
    // Encontrar la franja horaria (horaInicio-horaFin) para esta hora
    const reservaEjemplo = reservasConIngreso.find(r => r.horaInicio === hora);
    const franja = reservaEjemplo ? `${reservaEjemplo.horaInicio}-${reservaEjemplo.horaFin}` : `${hora}-${hora}`;
    
    return {
      hora,
      franja,
      ingresos: datos.ingresos,
      cantidadReservas: datos.cantidad,
      promedioPorReserva: datos.ingresos / datos.cantidad,
    };
  });
  
  // Ordenar por ingresos descendente
  resultado.sort((a, b) => b.ingresos - a.ingresos);
  
  return resultado;
};

/**
 * Obtiene los ingresos agrupados por cliente
 * Solo considera reservas completadas y pagadas
 */
export const getIngresosPorCliente = async (
  fechaInicio: Date,
  fechaFin: Date,
  entrenadorId?: string
): Promise<IngresoPorCliente[]> => {
  // Obtener todas las reservas del período
  const reservas = await getReservas(fechaInicio, fechaFin, 'entrenador');
  
  // Agrupar por cliente
  const ingresosPorCliente: Record<string, {
    clienteId: string;
    clienteNombre: string;
    ingresos: number;
    reservas: Reserva[];
    reservasCompletadas: number;
    reservasCanceladas: number;
  }> = {};
  
  reservas.forEach(reserva => {
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
    
    // Solo contar ingresos de reservas pagadas
    if (reserva.pagado && (reserva.estado === 'completada' || reserva.estado === 'confirmada')) {
      ingresosPorCliente[clienteId].ingresos += reserva.precio;
    }
    
    ingresosPorCliente[clienteId].reservas.push(reserva);
    
    if (reserva.estado === 'completada' || reserva.estado === 'confirmada') {
      ingresosPorCliente[clienteId].reservasCompletadas += 1;
    }
    
    if (reserva.estado === 'cancelada') {
      ingresosPorCliente[clienteId].reservasCanceladas += 1;
    }
  });
  
  // Convertir a array y calcular promedios
  const resultado: IngresoPorCliente[] = Object.values(ingresosPorCliente)
    .map(datos => {
      const reservasPagadas = datos.reservas.filter(
        r => r.pagado && (r.estado === 'completada' || r.estado === 'confirmada')
      );
      
      // Encontrar la última reserva
      const ultimaReserva = datos.reservas
        .sort((a, b) => b.fecha.getTime() - a.fecha.getTime())[0];
      
      return {
        clienteId: datos.clienteId,
        clienteNombre: datos.clienteNombre,
        ingresosTotales: datos.ingresos,
        cantidadReservas: reservasPagadas.length,
        promedioPorReserva: reservasPagadas.length > 0 
          ? datos.ingresos / reservasPagadas.length 
          : 0,
        ultimaReserva: ultimaReserva?.fecha,
        reservasCompletadas: datos.reservasCompletadas,
        reservasCanceladas: datos.reservasCanceladas,
      };
    })
    // Filtrar solo clientes que han generado ingresos
    .filter(cliente => cliente.ingresosTotales > 0);
  
  // Ordenar por ingresos descendente
  resultado.sort((a, b) => b.ingresosTotales - a.ingresosTotales);
  
  return resultado;
};

