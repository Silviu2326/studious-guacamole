import React, { useState } from 'react';
import { Bell, Clock, Calendar, X } from 'lucide-react';
import { Button } from '../../../components/componentsreutilizables';
import { ReminderService } from '../services/reminderService';

interface ReminderSchedulerProps {
  leadId: string;
  leadName: string;
  userId: string;
  onReminderCreated?: () => void;
}

export const ReminderScheduler: React.FC<ReminderSchedulerProps> = ({
  leadId,
  leadName,
  userId,
  onReminderCreated,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [customDate, setCustomDate] = useState('');
  const [customTime, setCustomTime] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const quickOptions = [
    { id: '2h', label: '2 horas', hours: 2 },
    { id: '4h', label: '4 horas', hours: 4 },
    { id: '1d', label: 'Mañana', hours: 24 },
    { id: '2d', label: 'En 2 días', hours: 48 },
    { id: '3d', label: 'En 3 días', hours: 72 },
    { id: '1w', label: 'En 1 semana', hours: 168 },
  ];

  const handleSave = async () => {
    let dueDate: Date;

    if (selectedOption === 'custom') {
      if (!customDate || !customTime) {
        alert('Por favor selecciona fecha y hora');
        return;
      }
      dueDate = new Date(`${customDate}T${customTime}`);
    } else {
      const option = quickOptions.find(o => o.id === selectedOption);
      if (!option) {
        alert('Por favor selecciona una opción');
        return;
      }
      dueDate = new Date(Date.now() + option.hours * 60 * 60 * 1000);
    }

    const defaultMessage = message || `Hacer seguimiento con ${leadName}`;

    setSaving(true);
    try {
      await ReminderService.createReminder(leadId, dueDate, defaultMessage, userId);
      setShowModal(false);
      setSelectedOption('');
      setCustomDate('');
      setCustomTime('');
      setMessage('');
      onReminderCreated?.();
    } catch (error) {
      console.error('Error creating reminder:', error);
      alert('Error al crear recordatorio');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
      >
        <Bell className="w-4 h-4" />
        Recordarme
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Crear recordatorio</h3>
                    <p className="text-sm text-white/90">{leadName}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  ¿Cuándo quieres que te recordemos?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {quickOptions.map(option => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedOption(option.id)}
                      className={`px-4 py-3 text-sm font-medium rounded-xl border-2 transition-all ${
                        selectedOption === option.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <button
                  onClick={() => setSelectedOption('custom')}
                  className={`w-full px-4 py-3 text-sm font-medium rounded-xl border-2 transition-all mb-3 ${
                    selectedOption === 'custom'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Personalizado
                </button>

                {selectedOption === 'custom' && (
                  <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        Fecha
                      </label>
                      <input
                        type="date"
                        value={customDate}
                        onChange={(e) => setCustomDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        <Clock className="w-3 h-3 inline mr-1" />
                        Hora
                      </label>
                      <input
                        type="time"
                        value={customTime}
                        onChange={(e) => setCustomTime(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Mensaje (opcional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Hacer seguimiento con ${leadName}`}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowModal(false)}
                  variant="ghost"
                  size="md"
                  fullWidth
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  variant="primary"
                  size="md"
                  fullWidth
                  loading={saving}
                  disabled={!selectedOption}
                >
                  Crear recordatorio
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

