import { useState, useEffect, useCallback } from 'react';
import { fiscalCalendarApi } from '../api';
import { TaxReminder } from '../api/types';

export const useTaxReminders = (userId: string) => {
  const [reminders, setReminders] = useState<TaxReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadReminders = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await fiscalCalendarApi.getReminders(userId);
      setReminders(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error loading reminders'));
      console.error('Error loading tax reminders:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadReminders();
    
    // Recargar recordatorios cada hora para verificar si hay nuevos
    const interval = setInterval(() => {
      loadReminders();
    }, 60 * 60 * 1000); // Cada hora

    return () => clearInterval(interval);
  }, [loadReminders]);

  const unreadCount = reminders.filter(r => !r.isRead).length;
  const highPriorityCount = reminders.filter(r => r.priority === 'high' && !r.isRead).length;

  return {
    reminders,
    loading,
    error,
    unreadCount,
    highPriorityCount,
    reload: loadReminders
  };
};

