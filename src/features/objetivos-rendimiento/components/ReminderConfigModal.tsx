import React, { useState, useEffect } from 'react';
import { Objective, AutomaticReminder, ReminderCadence } from '../types';
import { configureAutomaticReminder, disableAutomaticReminder } from '../api/reminders';
import { Modal, Button, Input, Select } from '../../../components/componentsreutilizables';
import { Bell, Clock, X } from 'lucide-react';

interface ReminderConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  objective: Objective | null;
  onSave: () => void;
}

export const ReminderConfigModal: React.FC<ReminderConfigModalProps> = ({
  isOpen,
  onClose,
  objective,
  onSave,
}) => {
  const [enabled, setEnabled] = useState(false);
  const [cadence, setCadence] = useState<ReminderCadence>('semanal');
  const [reminderTime, setReminderTime] = useState('09:00');
  const [notificationChannels, setNotificationChannels] = useState<('email' | 'in_app' | 'push')[]>(['in_app']);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (objective?.automaticReminder) {
      setEnabled(objective.automaticReminder.enabled);
      setCadence(objective.automaticReminder.cadence);
      setReminderTime(objective.automaticReminder.reminderTime || '09:00');
      setNotificationChannels(objective.automaticReminder.notificationChannels || ['in_app']);
    } else {
      setEnabled(false);
      setCadence('semanal');
      setReminderTime('09:00');
      setNotificationChannels(['in_app']);
    }
  }, [objective, isOpen]);

  const handleSave = async () => {
    if (!objective) return;

    setLoading(true);
    try {
      if (enabled) {
        await configureAutomaticReminder(objective.id, {
          enabled: true,
          cadence,
          reminderTime,
          notificationChannels,
        });
      } else {
        await disableAutomaticReminder(objective.id);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving reminder config:', error);
      alert('Error al guardar la configuración de recordatorios');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleChannel = (channel: 'email' | 'in_app' | 'push') => {
    if (notificationChannels.includes(channel)) {
      setNotificationChannels(notificationChannels.filter(c => c !== channel));
    } else {
      setNotificationChannels([...notificationChannels, channel]);
    }
  };

  if (!objective) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Configurar Recordatorios: ${objective.title}`}
      size="md"
      footer={
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={loading}>
            <Bell className="w-4 h-4 mr-2" />
            {loading ? 'Guardando...' : 'Guardar Configuración'}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Toggle para activar/desactivar recordatorios */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Recordatorios Automáticos</h3>
            <p className="text-xs text-gray-600">
              Recibe recordatorios automáticos para actualizar el progreso de este objetivo
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {enabled && (
          <>
            {/* Cadencia del recordatorio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Cadencia del Recordatorio
              </label>
              <Select
                value={cadence}
                onChange={(e) => setCadence(e.target.value as ReminderCadence)}
                options={[
                  { value: 'semanal', label: 'Semanal (cada 7 días)' },
                  { value: 'quincenal', label: 'Quincenal (cada 15 días)' },
                ]}
              />
              <p className="text-xs text-gray-500 mt-1">
                {cadence === 'semanal'
                  ? 'Recibirás un recordatorio cada semana para actualizar el progreso'
                  : 'Recibirás un recordatorio cada 15 días para actualizar el progreso'}
              </p>
            </div>

            {/* Hora del recordatorio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora del Recordatorio
              </label>
              <Input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Hora del día en que recibirás el recordatorio
              </p>
            </div>

            {/* Canales de notificación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Canales de Notificación
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationChannels.includes('in_app')}
                    onChange={() => handleToggleChannel('in_app')}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Notificación en la aplicación</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationChannels.includes('email')}
                    onChange={() => handleToggleChannel('email')}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Correo electrónico</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationChannels.includes('push')}
                    onChange={() => handleToggleChannel('push')}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Notificación push</span>
                </label>
              </div>
              {notificationChannels.length === 0 && (
                <p className="text-xs text-red-500 mt-1">
                  Debes seleccionar al menos un canal de notificación
                </p>
              )}
            </div>

            {/* Información sobre el próximo recordatorio */}
            {objective.automaticReminder?.nextReminderDate && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-2">
                  <Bell className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-700">
                    <strong>Próximo recordatorio:</strong>{' '}
                    {new Date(objective.automaticReminder.nextReminderDate).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};

