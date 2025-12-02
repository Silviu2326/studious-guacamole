import { useState, useEffect } from 'react';
import { EventoReto, EventoFilters } from '../types';
import { getEventosRetos, createEventoReto, updateEventoReto, deleteEventoReto } from '../api/retos';

export const useEventosRetos = (filters?: EventoFilters) => {
  const [eventos, setEventos] = useState<EventoReto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEventos();
  }, [filters]);

  const loadEventos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEventosRetos(filters);
      setEventos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar eventos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (evento: Omit<EventoReto, 'id' | 'createdAt' | 'updatedAt' | 'participantes' | 'ranking' | 'contenidoMotivacional' | 'premios'>) => {
    try {
      const nuevo = await createEventoReto(evento);
      setEventos([...eventos, nuevo]);
      return nuevo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear evento');
      throw err;
    }
  };

  const handleUpdate = async (id: string, updates: Partial<EventoReto>) => {
    try {
      const actualizado = await updateEventoReto(id, updates);
      setEventos(eventos.map(e => e.id === id ? actualizado : e));
      return actualizado;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar evento');
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEventoReto(id);
      setEventos(eventos.filter(e => e.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar evento');
      throw err;
    }
  };

  return {
    eventos,
    loading,
    error,
    reload: loadEventos,
    createEvento: handleCreate,
    updateEvento: handleUpdate,
    deleteEvento: handleDelete,
  };
};

