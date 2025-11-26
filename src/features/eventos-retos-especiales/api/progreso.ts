import { ProgresoParticipante, RankingEntry } from '../types';
import { eventosRetosService } from '../services/eventosRetosService';

export const getProgreso = async (eventoId: string, participanteId?: string): Promise<ProgresoParticipante[]> => {
  // En una implementación real, esto consultaría una base de datos
  // Por ahora, simulamos datos
  await new Promise(resolve => setTimeout(resolve, 300));
  return [];
};

export const registrarProgreso = async (
  eventoId: string,
  progreso: Omit<ProgresoParticipante, 'fecha'>
): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const evento = await eventosRetosService.getEventoReto(eventoId);
  if (!evento) {
    throw new Error('Evento no encontrado');
  }
  
  // Actualizar progreso del participante
  const participante = evento.participantes.find(p => p.id === progreso.participanteId);
  if (participante) {
    participante.progreso = progreso.completado ? participante.progreso + 1 : participante.progreso;
    participante.puntos = progreso.completado ? participante.puntos + 10 : participante.puntos;
    participante.ultimoCheckIn = new Date();
    
    // Actualizar ranking
    const rankingActualizado = [...evento.participantes]
      .sort((a, b) => b.puntos - a.puntos)
      .map((p, index) => ({
        posicion: index + 1,
        participanteId: p.id,
        nombre: p.nombre,
        puntos: p.puntos,
        progreso: p.progreso,
        avatar: p.avatar,
      }));
    
    await eventosRetosService.updateEventoReto(eventoId, {
      participantes: evento.participantes,
      ranking: rankingActualizado
    });
  }
  
  return { success: true, message: 'Progreso registrado exitosamente' };
};

export const getRanking = async (eventoId: string): Promise<RankingEntry[]> => {
  const evento = await eventosRetosService.getEventoReto(eventoId);
  return evento?.ranking || [];
};

