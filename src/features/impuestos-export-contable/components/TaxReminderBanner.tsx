import React, { useMemo } from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { TaxReminder, TaxObligationType } from '../api/types';
import { Bell, AlertTriangle, X, Calendar, Clock } from 'lucide-react';
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
  // Filtrar recordatorios activos (no leídos y próximos)
  const activeReminders = useMemo(() => {
    return reminders
      .filter(r => !r.isRead && r.daysUntilDeadline > 0)
      .sort((a, b) => a.daysUntilDeadline - b.daysUntilDeadline)
      .slice(0, 3); // Mostrar máximo 3
  }, [reminders]);

  // Obtener el recordatorio más urgente
  const mostUrgent = useMemo(() => {
    return activeReminders.length > 0 ? activeReminders[0] : null;
  }, [activeReminders]);

  // Función para generar mensaje personalizado
  const getCustomMessage = (reminder: TaxReminder): string => {
    const days = reminder.daysUntilDeadline;
    const obligationType = reminder.obligationType;
    
    // Mensajes específicos según días restantes y tipo de obligación
    if (days <= 0) {
      return `¡VENCIDO! Debes presentar ${getObligationTypeLabel(obligationType)} urgentemente.`;
    }
    
    if (days === 1) {
      return `¡Mañana vence! Debes presentar ${getObligationTypeLabel(obligationType)} antes de las 23:59.`;
    }
    
    if (days <= 7) {
      const weekText = days <= 3 ? 'menos de una semana' : 'una semana';
      if (obligationType === 'iva_trimestral') {
        const quarter = getQuarterFromReminder(reminder);
        return `Te queda ${weekText} para presentar el IVA del ${quarter}. Fecha límite: ${format(reminder.deadlineDate, 'dd/MM/yyyy')}`;
      }
      if (obligationType === 'irpf_trimestral') {
        const quarter = getQuarterFromReminder(reminder);
        return `Te queda ${weekText} para presentar el IRPF del ${quarter}. Fecha límite: ${format(reminder.deadlineDate, 'dd/MM/yyyy')}`;
      }
      if (obligationType === 'declaracion_anual') {
        return `Te queda ${weekText} para presentar la declaración anual. Fecha límite: ${format(reminder.deadlineDate, 'dd/MM/yyyy')}`;
      }
      return `Te queda ${weekText} para presentar ${getObligationTypeLabel(obligationType)}. Fecha límite: ${format(reminder.deadlineDate, 'dd/MM/yyyy')}`;
    }
    
    if (days <= 15) {
      return `Quedan ${days} días para presentar ${getObligationTypeLabel(obligationType)}. Fecha límite: ${format(reminder.deadlineDate, 'dd/MM/yyyy')}`;
    }
    
    return reminder.message;
  };

  const getObligationTypeLabel = (type: TaxObligationType): string => {
    switch (type) {
      case 'iva_trimestral':
        return 'IVA trimestral';
      case 'irpf_trimestral':
        return 'IRPF trimestral';
      case 'declaracion_anual':
        return 'declaración anual';
      case 'pago_fraccionado':
        return 'pago fraccionado';
      default:
        return type;
    }
  };

  const getQuarterFromReminder = (reminder: TaxReminder): string => {
    const month = reminder.deadlineDate.getMonth();
    // Los vencimientos trimestrales en España:
    // Q1 (Ene-Mar) vence en abril (mes 3)
    // Q2 (Abr-Jun) vence en julio (mes 6)
    // Q3 (Jul-Sep) vence en octubre (mes 9)
    // Q4 (Oct-Dic) vence en enero del año siguiente (mes 0)
    if (month === 0 || month === 1) return 'Q4'; // Enero-Febrero = Q4 del año anterior
    if (month >= 3 && month <= 5) return 'Q1'; // Abril-Junio = Q1
    if (month >= 6 && month <= 8) return 'Q2'; // Julio-Septiembre = Q2
    if (month >= 9 && month <= 11) return 'Q3'; // Octubre-Diciembre = Q3
    return 'Q?';
  };

  const getBannerColor = (daysUntil: number) => {
    if (daysUntil <= 0) {
      return 'bg-red-50 border-red-300';
    }
    if (daysUntil <= 3) {
      return 'bg-red-50 border-red-200';
    }
    if (daysUntil <= 7) {
      return 'bg-yellow-50 border-yellow-300';
    }
    return 'bg-blue-50 border-blue-200';
  };

  const getIconColor = (daysUntil: number) => {
    if (daysUntil <= 0) {
      return 'text-red-800';
    }
    if (daysUntil <= 3) {
      return 'text-red-700';
    }
    if (daysUntil <= 7) {
      return 'text-yellow-800';
    }
    return 'text-blue-800';
  };

  if (activeReminders.length === 0) {
    return null;
  }

  const mostUrgentDays = mostUrgent?.daysUntilDeadline || 0;
  const bannerColor = getBannerColor(mostUrgentDays);
  const iconColor = getIconColor(mostUrgentDays);

  return (
    <Card className={`p-4 ${bannerColor} border-2 mb-6 sticky top-4 z-40`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 ${iconColor.includes('red') ? 'bg-red-200' : iconColor.includes('yellow') ? 'bg-yellow-200' : 'bg-blue-200'} rounded-lg`}>
          <AlertTriangle className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className={`font-semibold ${iconColor.includes('red') ? 'text-red-900' : iconColor.includes('yellow') ? 'text-yellow-900' : 'text-blue-900'} flex items-center gap-2`}>
              <Bell className="w-4 h-4" />
              {mostUrgentDays <= 0 
                ? '¡Obligación Fiscal Vencida!'
                : mostUrgentDays <= 3
                ? '¡Obligación Fiscal Urgente!'
                : mostUrgentDays <= 7
                ? 'Recordatorio de Impuestos'
                : 'Próximas Obligaciones Fiscales'
              }
            </h3>
            {onViewCalendar && (
              <Button
                variant="outline"
                size="sm"
                onClick={onViewCalendar}
                className={iconColor.includes('red') ? 'text-red-900 border-red-300 hover:bg-red-100' : iconColor.includes('yellow') ? 'text-yellow-900 border-yellow-300 hover:bg-yellow-100' : 'text-blue-900 border-blue-300 hover:bg-blue-100'}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Ver Calendario
              </Button>
            )}
          </div>
          
          <div className="space-y-3">
            {activeReminders.map((reminder) => {
              const daysUntil = reminder.daysUntilDeadline;
              const isUrgent = daysUntil <= 7;
              
              return (
                <div
                  key={reminder.id}
                  className={`flex items-start justify-between p-3 rounded-lg ${
                    daysUntil <= 0
                      ? 'bg-red-100 border border-red-200'
                      : daysUntil <= 3
                      ? 'bg-red-50 border border-red-200'
                      : daysUntil <= 7
                      ? 'bg-yellow-100 border border-yellow-200'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        reminder.obligationType === 'iva_trimestral'
                          ? 'bg-purple-100 text-purple-800'
                          : reminder.obligationType === 'irpf_trimestral'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {getObligationTypeLabel(reminder.obligationType).toUpperCase()}
                      </span>
                      {isUrgent && (
                        <span className="text-xs font-medium text-red-600 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {daysUntil <= 0 ? 'VENCIDO' : `${daysUntil} día${daysUntil !== 1 ? 's' : ''}`}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm font-medium ${
                      daysUntil <= 0
                        ? 'text-red-900'
                        : daysUntil <= 7
                        ? 'text-yellow-900'
                        : 'text-gray-900'
                    }`}>
                      {getCustomMessage(reminder)}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Fecha límite: {format(reminder.deadlineDate, 'dd/MM/yyyy')}
                    </p>
                  </div>
                  {onDismiss && (
                    <button
                      onClick={() => onDismiss(reminder.id)}
                      className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
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
            <p className={`text-xs mt-3 ${
              iconColor.includes('red') ? 'text-red-700' : iconColor.includes('yellow') ? 'text-yellow-700' : 'text-blue-700'
            }`}>
              Y {reminders.length - activeReminders.length} recordatorio(s) más...
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};



