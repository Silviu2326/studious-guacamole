import { Participante } from '../types';
import { eventosRetosService } from '../services/eventosRetosService';

export const getParticipantes = async (eventoId: string): Promise<Participante[]> => {
  const evento = await eventosRetosService.getEventoReto(eventoId);
  return evento?.participantes || [];
};

export const inscribirParticipante = async (
  eventoId: string,
  participanteId: string,
  nombre: string,
  email: string
): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const evento = await eventosRetosService.getEventoReto(eventoId);
  if (!evento) {
    throw new Error('Evento no encontrado');
  }
  
  if (evento.capacidadMaxima && evento.participantes.length >= evento.capacidadMaxima) {
    return { success: false, message: 'El evento ha alcanzado su capacidad máxima' };
  }
  
  const nuevoParticipante: Participante = {
    id: participanteId,
    nombre,
    email,
    progreso: 0,
    puntos: 0,
    posicion: evento.participantes.length + 1,
    inscripcionFecha: new Date(),
  };
  
  await eventosRetosService.updateEventoReto(eventoId, {
    participantes: [...evento.participantes, nuevoParticipante]
  });
  
  return { success: true, message: 'Inscripción exitosa' };
};

export const eliminarParticipante = async (
  eventoId: string,
  participanteId: string
): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const evento = await eventosRetosService.getEventoReto(eventoId);
  if (!evento) {
    throw new Error('Evento no encontrado');
  }
  
  await eventosRetosService.updateEventoReto(eventoId, {
    participantes: evento.participantes.filter(p => p.id !== participanteId)
  });
  
  return { success: true, message: 'Participante eliminado exitosamente' };
};

