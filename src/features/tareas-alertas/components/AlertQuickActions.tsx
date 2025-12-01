import React, { useState, useRef, useEffect } from 'react';
import { Phone, MessageCircle, Mail, CheckCircle2, Plus, Send, Clock, ChevronDown, X, Calendar } from 'lucide-react';
import { Alert, AlertType } from '../types';
import { 
  resolveAlert, 
  sendPaymentReminder, 
  snoozeAlert,
  createTaskFromAlert,
  addToCalendar 
} from '../api';
import { Button } from '../../../components/componentsreutilizables';

interface AlertQuickActionsProps {
  alert: Alert;
  onAlertUpdated?: (alert: Alert) => void;
  onTaskCreated?: () => void;
  onShowToast?: (message: string, type?: 'success' | 'error') => void;
  compact?: boolean;
  /**
   * Callback para abrir el modal de TaskCreator (preferido sobre crear tarea directamente)
   */
  onOpenTaskCreator?: () => void;
}

export const AlertQuickActions: React.FC<AlertQuickActionsProps> = ({
  alert,
  onAlertUpdated,
  onTaskCreated,
  onShowToast,
  compact = false,
  onOpenTaskCreator,
}) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [showSnoozeMenu, setShowSnoozeMenu] = useState(false);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [customDateTime, setCustomDateTime] = useState('');
  const snoozeMenuRef = useRef<HTMLDivElement>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    if (onShowToast) {
      onShowToast(message, type);
    } else {
      // Fallback: usar console o alert si no hay sistema de toast
      console.log(`[${type.toUpperCase()}] ${message}`);
    }
  };

  const handleCall = () => {
    if (alert.contactPhone) {
      window.location.href = `tel:${alert.contactPhone}`;
    } else {
      showToast('No hay número de teléfono disponible para esta alerta', 'error');
    }
  };

  const handleWhatsApp = () => {
    if (alert.contactPhone) {
      // Formatear número (eliminar espacios, guiones, etc.)
      const phoneNumber = alert.contactPhone.replace(/[\s\-\(\)]/g, '');
      const message = encodeURIComponent(`Hola, te contacto respecto a: ${alert.title}`);
      window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    } else {
      showToast('No hay número de teléfono disponible para esta alerta', 'error');
    }
  };

  const handleEmail = () => {
    if (alert.contactEmail) {
      const subject = encodeURIComponent(`Re: ${alert.title}`);
      const body = encodeURIComponent(`Hola,\n\nTe contacto respecto a: ${alert.message}\n\nSaludos.`);
      window.location.href = `mailto:${alert.contactEmail}?subject=${subject}&body=${body}`;
    } else {
      showToast('No hay dirección de email disponible para esta alerta', 'error');
    }
  };

  const handleCreateTask = async () => {
    // Si hay callback para abrir el modal, usarlo (preferido)
    if (onOpenTaskCreator) {
      onOpenTaskCreator();
      return;
    }
    
    // Fallback: crear tarea directamente (comportamiento legacy)
    setLoading('task');
    try {
      const task = await createTaskFromAlert(alert);
      showToast(`Tarea "${task.title}" creada exitosamente`);
      if (onTaskCreated) {
        onTaskCreated();
      }
    } catch (error) {
      console.error('Error creando tarea:', error);
      showToast('Error al crear la tarea', 'error');
    } finally {
      setLoading(null);
    }
  };

  const handleResolve = async () => {
    setLoading('resolve');
    try {
      const resolvedAlert = await resolveAlert(alert.id);
      showToast('Alerta marcada como resuelta');
      if (onAlertUpdated) {
        onAlertUpdated(resolvedAlert);
      }
    } catch (error) {
      console.error('Error resolviendo alerta:', error);
      showToast('Error al marcar la alerta como resuelta', 'error');
    } finally {
      setLoading(null);
    }
  };

  const handleSendPaymentReminder = async () => {
    setLoading('reminder');
    try {
      await sendPaymentReminder(alert.id);
      showToast('Recordatorio de pago enviado');
      if (onAlertUpdated) {
        // Recargar la alerta actualizada
        const updatedAlert = { ...alert };
        onAlertUpdated(updatedAlert);
      }
    } catch (error) {
      console.error('Error enviando recordatorio:', error);
      showToast(error instanceof Error ? error.message : 'Error al enviar recordatorio', 'error');
    } finally {
      setLoading(null);
    }
  };

  // Cerrar menú de posponer al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (snoozeMenuRef.current && !snoozeMenuRef.current.contains(event.target as Node)) {
        setShowSnoozeMenu(false);
        setShowDateTimePicker(false);
      }
    };

    if (showSnoozeMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showSnoozeMenu]);

  const handleSnooze = async (until: Date) => {
    setLoading('snooze');
    setShowSnoozeMenu(false);
    setShowDateTimePicker(false);
    try {
      const updatedAlert = await snoozeAlert(alert.id, until);
      const untilFormatted = until.toLocaleString('es-ES', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
      showToast(`Alerta pospuesta hasta ${untilFormatted}`);
      if (onAlertUpdated) {
        onAlertUpdated(updatedAlert);
      }
    } catch (error) {
      console.error('Error posponiendo alerta:', error);
      showToast('Error al posponer la alerta', 'error');
    } finally {
      setLoading(null);
    }
  };

  const handleSnooze1Hour = () => {
    const until = new Date();
    until.setHours(until.getHours() + 1);
    handleSnooze(until);
  };

  const handleSnoozeTomorrow = () => {
    const until = new Date();
    until.setDate(until.getDate() + 1);
    until.setHours(9, 0, 0, 0); // Mañana a las 9:00
    handleSnooze(until);
  };

  const handleSnoozeCustom = () => {
    if (!customDateTime) {
      showToast('Por favor selecciona una fecha y hora', 'error');
      return;
    }
    const until = new Date(customDateTime);
    if (isNaN(until.getTime())) {
      showToast('Fecha y hora inválidas', 'error');
      return;
    }
    if (until <= new Date()) {
      showToast('La fecha debe ser en el futuro', 'error');
      return;
    }
    handleSnooze(until);
  };

  const handleAddToCalendar = () => {
    setLoading('calendar');
    try {
      addToCalendar(
        alert,
        (message) => {
          showToast(message);
          setLoading(null);
        },
        (error) => {
          showToast(error, 'error');
          setLoading(null);
        }
      );
    } catch (error) {
      console.error('Error añadiendo a calendario:', error);
      showToast('Error al añadir el evento al calendario', 'error');
      setLoading(null);
    }
  };

  const isPaymentAlert = alert.type === 'pago-pendiente' || alert.type === 'factura-vencida';
  const isResolved = alert.isResolved === true;
  const isAppointmentAlert = alert.kind === 'appointment' || alert.type === 'recordatorio' || !!alert.appointmentDate;

  // Si está resuelta, no mostrar acciones (o solo mostrar algunas)
  if (isResolved && !compact) {
    return null;
  }

  const buttonSize = compact ? 'sm' : 'sm';
  const buttonVariant = 'ghost';

  return (
    <div className={`flex items-center gap-2 ${compact ? 'flex-wrap' : 'flex-wrap'} mt-3 pt-3 border-t border-gray-200`}>
      {alert.contactPhone && (
        <Button
          variant={buttonVariant}
          size={buttonSize}
          onClick={handleCall}
          title="Llamar"
          className="flex items-center gap-1.5 min-h-[44px] px-3 md:min-h-0 md:px-2"
        >
          <Phone className="w-5 h-5 md:w-4 md:h-4" />
          {!compact && <span className="text-xs">Llamar</span>}
        </Button>
      )}

      {alert.contactPhone && (
        <Button
          variant={buttonVariant}
          size={buttonSize}
          onClick={handleWhatsApp}
          title="Enviar WhatsApp"
          className="flex items-center gap-1.5 min-h-[44px] px-3 md:min-h-0 md:px-2"
        >
          <MessageCircle className="w-5 h-5 md:w-4 md:h-4" />
          {!compact && <span className="text-xs">WhatsApp</span>}
        </Button>
      )}

      {alert.contactEmail && (
        <Button
          variant={buttonVariant}
          size={buttonSize}
          onClick={handleEmail}
          title="Enviar Email"
          className="flex items-center gap-1.5 min-h-[44px] px-3 md:min-h-0 md:px-2"
        >
          <Mail className="w-5 h-5 md:w-4 md:h-4" />
          {!compact && <span className="text-xs">Email</span>}
        </Button>
      )}

      <Button
        variant={buttonVariant}
        size={buttonSize}
        onClick={handleCreateTask}
        disabled={loading === 'task'}
        title="Crear tarea"
        className="flex items-center gap-1.5 min-h-[44px] px-3 md:min-h-0 md:px-2"
      >
        {loading === 'task' ? (
          <div className="w-5 h-5 md:w-4 md:h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          <Plus className="w-5 h-5 md:w-4 md:h-4" />
        )}
        {!compact && <span className="text-xs">Crear tarea</span>}
      </Button>

      {isAppointmentAlert && (
        <Button
          variant={buttonVariant}
          size={buttonSize}
          onClick={handleAddToCalendar}
          disabled={loading === 'calendar'}
          title="Añadir a calendario"
          className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 min-h-[44px] px-3 md:min-h-0 md:px-2"
        >
          {loading === 'calendar' ? (
            <div className="w-5 h-5 md:w-4 md:h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Calendar className="w-5 h-5 md:w-4 md:h-4" />
          )}
          {!compact && <span className="text-xs">Añadir a calendario</span>}
        </Button>
      )}

      {isPaymentAlert && (
        <Button
          variant={buttonVariant}
          size={buttonSize}
          onClick={handleSendPaymentReminder}
          disabled={loading === 'reminder'}
          title="Enviar recordatorio de pago"
          className="flex items-center gap-1.5 min-h-[44px] px-3 md:min-h-0 md:px-2"
        >
          {loading === 'reminder' ? (
            <div className="w-5 h-5 md:w-4 md:h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-5 h-5 md:w-4 md:h-4" />
          )}
          {!compact && <span className="text-xs">Recordatorio</span>}
        </Button>
      )}

      {!isResolved && (
        <>
          <div className="relative" ref={snoozeMenuRef}>
            <Button
              variant={buttonVariant}
              size={buttonSize}
              onClick={() => {
                setShowSnoozeMenu(!showSnoozeMenu);
                setShowDateTimePicker(false);
              }}
              disabled={loading === 'snooze'}
              title="Posponer alerta"
              className="flex items-center gap-1.5 text-orange-600 hover:text-orange-700 min-h-[44px] px-3 md:min-h-0 md:px-2"
            >
              {loading === 'snooze' ? (
                <div className="w-5 h-5 md:w-4 md:h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Clock className="w-5 h-5 md:w-4 md:h-4" />
              )}
              {!compact && <span className="text-xs">Posponer</span>}
              <ChevronDown className="w-4 h-4 md:w-3 md:h-3" />
            </Button>

            {showSnoozeMenu && (
              <div className="absolute left-0 bottom-full mb-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px]">
                <div className="py-1">
                  <button
                    onClick={handleSnooze1Hour}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 min-h-[44px]"
                  >
                    <Clock className="w-4 h-4" />
                    <span>+1 hora</span>
                  </button>
                  <button
                    onClick={handleSnoozeTomorrow}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 min-h-[44px]"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Mañana (9:00)</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowDateTimePicker(!showDateTimePicker);
                      if (!showDateTimePicker) {
                        // Establecer fecha/hora por defecto: 1 hora desde ahora
                        const defaultDate = new Date();
                        defaultDate.setHours(defaultDate.getHours() + 1);
                        setCustomDateTime(defaultDate.toISOString().slice(0, 16));
                      }
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 border-t border-gray-200 min-h-[44px]"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Elegir fecha y hora</span>
                  </button>
                </div>

                {showDateTimePicker && (
                  <div className="border-t border-gray-200 p-3 bg-gray-50">
                    <div className="flex items-center gap-2 mb-2">
                      <label className="text-xs font-medium text-gray-700">Fecha y hora:</label>
                      <button
                        onClick={() => setShowDateTimePicker(false)}
                        className="ml-auto p-1 hover:bg-gray-200 rounded"
                        title="Cerrar"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <input
                      type="datetime-local"
                      value={customDateTime}
                      onChange={(e) => setCustomDateTime(e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSnoozeCustom}
                      className="w-full mt-2 text-xs min-h-[44px]"
                    >
                      Aplicar
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          <Button
            variant={buttonVariant}
            size={buttonSize}
            onClick={handleResolve}
            disabled={loading === 'resolve'}
            title="Marcar como resuelta"
            className="flex items-center gap-1.5 text-green-600 hover:text-green-700 min-h-[44px] px-3 md:min-h-0 md:px-2"
          >
            {loading === 'resolve' ? (
              <div className="w-5 h-5 md:w-4 md:h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <CheckCircle2 className="w-5 h-5 md:w-4 md:h-4" />
            )}
            {!compact && <span className="text-xs">Resolver</span>}
          </Button>
        </>
      )}
    </div>
  );
};

