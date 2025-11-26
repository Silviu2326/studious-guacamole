import { ClientReservation } from '../types';
import { Reserva } from '../../reservas-online/types';
import { getReservas } from '../../reservas-online/api/reservas';

/**
 * Obtiene las reservas de un cliente
 */
export const getClientReservations = async (clientId: string): Promise<ClientReservation[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Obtener reservas desde el módulo de reservas
  const hoy = new Date();
  const fechaFin = new Date();
  fechaFin.setMonth(fechaFin.getMonth() + 3); // Próximos 3 meses
  
  const reservas = await getReservas(hoy, fechaFin, 'entrenador');
  
  // Filtrar reservas del cliente y convertir al formato ClientReservation
  const clientReservations: ClientReservation[] = reservas
    .filter(reserva => reserva.clienteId === clientId)
    .map(reserva => ({
      id: reserva.id,
      clientId: reserva.clienteId,
      fecha: reserva.fecha.toISOString().split('T')[0],
      horaInicio: reserva.horaInicio,
      horaFin: reserva.horaFin,
      tipo: reserva.tipo,
      estado: reserva.estado,
      precio: reserva.precio,
      pagado: reserva.pagado,
      observaciones: reserva.observaciones,
      canCancel: reserva.estado === 'confirmada' || reserva.estado === 'pendiente',
      canReschedule: reserva.estado === 'confirmada' || reserva.estado === 'pendiente',
      cancelationDeadline: reserva.fecha > new Date() 
        ? new Date(reserva.fecha.getTime() - 24 * 60 * 60 * 1000).toISOString() // 24 horas antes
        : undefined,
    }));
  
  return clientReservations;
};

/**
 * Cancela una reserva de cliente
 */
export const cancelClientReservation = async (reservationId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // En producción, esto actualizaría el estado de la reserva a 'cancelada'
  console.log('Canceling reservation:', reservationId);
};

/**
 * Reprograma una reserva de cliente
 */
export const rescheduleClientReservation = async (
  reservationId: string,
  newDate: string,
  newTime: string
): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // En producción, esto actualizaría la fecha y hora de la reserva
  console.log('Rescheduling reservation:', reservationId, newDate, newTime);
};

