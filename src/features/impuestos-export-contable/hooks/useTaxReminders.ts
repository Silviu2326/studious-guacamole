import { useState, useEffect, useCallback } from 'react';
import { fiscalCalendarApi } from '../api';
import { TaxReminder, TaxDeadline, TaxObligationType } from '../api/types';

export const useTaxReminders = (userId: string) => {
  const [reminders, setReminders] = useState<TaxReminder[]>([]);
  const [upcomingDates, setUpcomingDates] = useState<TaxDeadline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadReminders = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      // Obtener recordatorios pendientes
      const remindersData = await fiscalCalendarApi.getReminders(userId);
      setReminders(remindersData);
      
      // Obtener próximas fechas relevantes (todas las obligaciones del año actual y siguiente)
      const currentYear = new Date().getFullYear();
      const currentCalendar = await fiscalCalendarApi.getCalendar(currentYear);
      const nextYearCalendar = await fiscalCalendarApi.getCalendar(currentYear + 1);
      
      const allDeadlines = [...currentCalendar.deadlines, ...nextYearCalendar.deadlines];
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Filtrar solo las fechas futuras o próximas (hasta 6 meses adelante)
      const sixMonthsFromNow = new Date();
      sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
      
      const upcoming = allDeadlines
        .filter(d => {
          const deadlineDate = new Date(d.deadline);
          deadlineDate.setHours(0, 0, 0, 0);
          return deadlineDate >= today && deadlineDate <= sixMonthsFromNow;
        })
        .sort((a, b) => a.deadline.getTime() - b.deadline.getTime());
      
      setUpcomingDates(upcoming);
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

  // Recordatorios pendientes (no leídos y próximos)
  const pendingReminders = reminders.filter(r => !r.isRead && r.daysUntilDeadline > 0);
  const unreadCount = reminders.filter(r => !r.isRead).length;
  const highPriorityCount = reminders.filter(r => r.priority === 'high' && !r.isRead).length;
  
  // Filtrar por tipo de obligación
  const getRemindersByType = useCallback((type: TaxObligationType) => {
    return reminders.filter(r => r.obligationType === type);
  }, [reminders]);
  
  // Obtener próximas fechas por tipo
  const getUpcomingDatesByType = useCallback((type: TaxObligationType) => {
    return upcomingDates.filter(d => d.obligationType === type);
  }, [upcomingDates]);

  return {
    reminders,
    pendingReminders,
    upcomingDates,
    loading,
    error,
    unreadCount,
    highPriorityCount,
    reload: loadReminders,
    getRemindersByType,
    getUpcomingDatesByType
  };
};

