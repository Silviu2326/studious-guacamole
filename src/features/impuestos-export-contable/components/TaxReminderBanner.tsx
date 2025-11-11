import React from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { TaxReminder } from '../api/types';
import { Bell, AlertTriangle, X, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface TaxReminderBannerProps {
  reminders: TaxReminder[];
  onDismiss?: (reminderId: string) => void;
  onViewCalendar?: () => void;
}

export const TaxReminderBanner: React.FC<TaxReminderBannerProps> = ({
  reminders,
  onDismiss,
  onViewCalendar
}) => {
  if (reminders.length === 0) {
    return null;
  }

  // Mostrar solo los recordatorios no leídos de alta prioridad
  const activeReminders = reminders
    .filter(r => !r.isRead && r.priority === 'high')
    .slice(0, 3);

  if (activeReminders.length === 0) {
    return null;
  }

  return (
    <Card className="p-4 bg-yellow-50 border-yellow-300 border-2 mb-6">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-yellow-200 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-yellow-800" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-yellow-900 flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Recordatorios de Impuestos ({activeReminders.length})
            </h3>
            {onViewCalendar && (
              <Button
                variant="outline"
                size="sm"
                onClick={onViewCalendar}
                className="text-yellow-900 border-yellow-300 hover:bg-yellow-100"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Ver Calendario
              </Button>
            )}
          </div>
          <div className="space-y-2">
            {activeReminders.map((reminder) => {
              const daysUntil = Math.ceil(
                (reminder.deadlineDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
              );
              
              return (
                <div
                  key={reminder.id}
                  className="flex items-start justify-between p-3 bg-yellow-100 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-900">{reminder.title}</p>
                    <p className="text-sm text-yellow-800 mt-1">{reminder.message}</p>
                    <p className="text-xs text-yellow-700 mt-1">
                      Fecha límite: {format(reminder.deadlineDate, 'dd/MM/yyyy')} 
                      {daysUntil > 0 && ` (${daysUntil} día${daysUntil !== 1 ? 's' : ''})`}
                    </p>
                  </div>
                  {onDismiss && (
                    <button
                      onClick={() => onDismiss(reminder.id)}
                      className="ml-2 text-yellow-600 hover:text-yellow-800"
                      aria-label="Cerrar recordatorio"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          {reminders.length > activeReminders.length && (
            <p className="text-xs text-yellow-700 mt-2">
              Y {reminders.length - activeReminders.length} recordatorio(s) más...
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};


