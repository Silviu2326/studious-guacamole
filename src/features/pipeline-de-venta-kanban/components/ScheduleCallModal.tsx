// US-16: Modal para agendar llamadas

import React, { useState } from 'react';
import { Modal, Button } from '../../../components/componentsreutilizables';
import { Sale, ScheduledCall } from '../types';
import { Calendar, Clock, X } from 'lucide-react';

interface ScheduleCallModalProps {
  sale: Sale;
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (scheduledCall: Omit<ScheduledCall, 'id' | 'createdAt'>) => void;
}

export const ScheduleCallModal: React.FC<ScheduleCallModalProps> = ({
  sale,
  isOpen,
  onClose,
  onSchedule,
}) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  // Establecer fecha mínima como hoy
  const today = new Date().toISOString().split('T')[0];
  const minTime = date === today ? new Date().toTimeString().slice(0, 5) : '00:00';

  const handleSchedule = () => {
    if (!date || !time) {
      alert('Por favor selecciona fecha y hora');
      return;
    }

    const scheduledDate = new Date(`${date}T${time}`);
    
    if (scheduledDate < new Date()) {
      alert('La fecha y hora deben ser futuras');
      return;
    }

    onSchedule({
      saleId: sale.id,
      scheduledDate,
      notes: notes || undefined,
      reminderSent: false,
      completed: false,
    });

    // Reset form
    setDate('');
    setTime('');
    setNotes('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Agendar llamada con ${sale.leadName}`}
      size="md"
    >
      <div className="space-y-6">
        {/* Información del lead */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">Lead:</span> {sale.leadName}
          </p>
          {sale.leadPhone && (
            <p className="text-sm text-blue-900 mt-1">
              <span className="font-semibold">Teléfono:</span> {sale.leadPhone}
            </p>
          )}
          <p className="text-sm text-blue-900 mt-1">
            <span className="font-semibold">Fase:</span> {sale.phase}
          </p>
        </div>

        {/* Fecha */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Fecha
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={today}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Hora */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Hora
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            min={date === today ? minTime : undefined}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Notas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notas (opcional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Agregar notas sobre la llamada..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Vista previa */}
        {date && time && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Llamada programada para:</span>
            </p>
            <p className="text-base font-medium text-gray-900 mt-1">
              {new Date(`${date}T${time}`).toLocaleString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-3 justify-end">
          <Button
            variant="ghost"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSchedule}
            disabled={!date || !time}
          >
            Agendar llamada
          </Button>
        </div>
      </div>
    </Modal>
  );
};

