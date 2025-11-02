import { EventoReto, EventoFilters } from '../types';
import { eventosRetosService } from '../services/eventosRetosService';

export const getEventosRetos = async (filters?: EventoFilters): Promise<EventoReto[]> => {
  return eventosRetosService.getEventosRetos(filters);
};

export const getEventoReto = async (id: string): Promise<EventoReto | null> => {
  return eventosRetosService.getEventoReto(id);
};

export const createEventoReto = async (evento: Omit<EventoReto, 'id' | 'createdAt' | 'updatedAt' | 'participantes' | 'ranking' | 'contenidoMotivacional' | 'premios'>): Promise<EventoReto> => {
  return eventosRetosService.createEventoReto(evento);
};

export const updateEventoReto = async (id: string, updates: Partial<EventoReto>): Promise<EventoReto> => {
  return eventosRetosService.updateEventoReto(id, updates);
};

export const deleteEventoReto = async (id: string): Promise<void> => {
  return eventosRetosService.deleteEventoReto(id);
};

export const publicarEvento = async (id: string): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  await eventosRetosService.updateEventoReto(id, { estado: 'publicado' });
  return { success: true, message: 'Evento publicado exitosamente' };
};

