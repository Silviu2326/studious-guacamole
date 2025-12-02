import React, { useState, useEffect } from 'react';
import { Bell, Volume2, Monitor, Clock, X } from 'lucide-react';
import { NotificationService } from '../services/notificationService';
import { Button } from '../../../components/componentsreutilizables';

interface NotificationSettingsProps {
  onClose: () => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({ onClose }) => {
  const [settings, setSettings] = useState(NotificationService.getSettings());

  const handleToggle = (key: 'enabled' | 'sound' | 'desktop') => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    NotificationService.updateSettings(updated);
  };

  const handleMuteScheduleToggle = () => {
    const updated = {
      ...settings,
      muteSchedule: {
        ...settings.muteSchedule!,
        enabled: !settings.muteSchedule?.enabled
      }
    };
    setSettings(updated);
    NotificationService.updateSettings(updated);
  };

  const handleTimeChange = (field: 'startHour' | 'endHour', value: number) => {
    const updated = {
      ...settings,
      muteSchedule: {
        ...settings.muteSchedule!,
        [field]: value
      }
    };
    setSettings(updated);
    NotificationService.updateSettings(updated);
  };

  const handleDayToggle = (day: number) => {
    const currentDays = settings.muteSchedule?.muteDays || [];
    const updated = {
      ...settings,
      muteSchedule: {
        ...settings.muteSchedule!,
        muteDays: currentDays.includes(day)
          ? currentDays.filter(d => d !== day)
          : [...currentDays, day]
      }
    };
    setSettings(updated);
    NotificationService.updateSettings(updated);
  };

  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Configuración de Notificaciones</h3>
                <p className="text-sm text-white/90">Personaliza tus alertas</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Main toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-semibold text-gray-900">Notificaciones</p>
                <p className="text-sm text-gray-600">Activar alertas de respuestas</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('enabled')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.enabled ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {settings.enabled && (
            <>
              {/* Sound */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Sonido</p>
                    <p className="text-sm text-gray-600">Reproducir sonido distintivo</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('sound')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.sound ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.sound ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Desktop notifications */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Monitor className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Notificaciones de escritorio</p>
                    <p className="text-sm text-gray-600">Mostrar en el sistema</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('desktop')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.desktop ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.desktop ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Mute schedule */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Horario de silencio</p>
                      <p className="text-sm text-gray-600">No molestar en ciertos horarios</p>
                    </div>
                  </div>
                  <button
                    onClick={handleMuteScheduleToggle}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.muteSchedule?.enabled ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.muteSchedule?.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {settings.muteSchedule?.enabled && (
                  <div className="space-y-4 pl-8">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
                        <select
                          value={settings.muteSchedule.startHour}
                          onChange={(e) => handleTimeChange('startHour', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {Array.from({ length: 24 }, (_, i) => (
                            <option key={i} value={i}>
                              {i.toString().padStart(2, '0')}:00
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
                        <select
                          value={settings.muteSchedule.endHour}
                          onChange={(e) => handleTimeChange('endHour', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {Array.from({ length: 24 }, (_, i) => (
                            <option key={i} value={i}>
                              {i.toString().padStart(2, '0')}:00
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Silenciar días</label>
                      <div className="flex gap-2">
                        {days.map((day, index) => {
                          const isSelected = settings.muteSchedule?.muteDays?.includes(index);
                          return (
                            <button
                              key={index}
                              onClick={() => handleDayToggle(index)}
                              className={`flex-1 px-2 py-2 text-xs font-medium rounded-lg transition-colors ${
                                isSelected
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          <Button onClick={onClose} variant="primary" size="md" fullWidth>
            Guardar cambios
          </Button>
        </div>
      </div>
    </div>
  );
};

