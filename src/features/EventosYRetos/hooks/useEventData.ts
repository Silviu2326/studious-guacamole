import { useState, useEffect, useCallback } from 'react';
import {
  Event,
  EventParticipant,
  Leaderboard,
  getEvent,
  getEventParticipants,
  getEventLeaderboard
} from '../api/events';

interface UseEventDataReturn {
  event: Event | null;
  participants: EventParticipant[];
  leaderboard: Leaderboard | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
}

/**
 * Hook personalizado que abstrae la lógica de fetching y caching
 * de los datos de un evento específico.
 */
export const useEventData = (eventId: string): UseEventDataReturn => {
  const [event, setEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<EventParticipant[]>([]);
  const [leaderboard, setLeaderboard] = useState<Leaderboard | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!eventId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const [eventData, participantsData, leaderboardData] = await Promise.all([
        getEvent(eventId),
        getEventParticipants(eventId),
        getEventLeaderboard(eventId)
      ]);
      
      setEvent(eventData);
      setParticipants(participantsData);
      setLeaderboard(leaderboardData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al cargar datos del evento'));
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    event,
    participants,
    leaderboard,
    isLoading,
    error,
    refresh: fetchData
  };
};




















