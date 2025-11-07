import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Button, Modal, Input, Select } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { Lead } from '../types';
import { CalendarService, Appointment, Availability } from '../services/calendarService';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface AppointmentSchedulerProps {
  lead: Lead;
  isOpen: boolean;
  onClose: () => void;
  onScheduled?: () => void;
}

export const AppointmentScheduler: React.FC<AppointmentSchedulerProps> = ({
  lead,
  isOpen,
  onClose,
  onScheduled
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [formData, setFormData] = useState({
    title: `Consulta con ${lead.name}`,
    description: '',
    type: 'consulta' as 'consulta' | 'reunion' | 'visita' | 'llamada' | 'otro',
    location: ''
  });

  useEffect(() => {
    if (isOpen) {
      loadAvailability();
      // Establecer fecha por defecto (mañana)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setSelectedDate(tomorrow.toISOString().split('T')[0]);
    }
  }, [isOpen]);

  const loadAvailability = async () => {
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30); // Próximos 30 días
      
      const data = await CalendarService.getAvailabilityRange(startDate, endDate);
      setAvailability(data);
    } catch (error) {
      console.error('Error cargando disponibilidad:', error);
    }
  };

  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime) {
      alert('Por favor selecciona fecha y hora');
      return;
    }

    setLoading(true);
    try {
      const startTime = new Date(`${selectedDate}T${selectedTime}`);
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + 1); // Duración de 1 hora por defecto

      const appointment = await CalendarService.createAppointment({
        leadId: lead.id,
        leadName: lead.name,
        leadEmail: lead.email,
        leadPhone: lead.phone,
        title: formData.title,
        description: formData.description,
        startTime,
        endTime,
        location: formData.location,
        type: formData.type,
        status: 'scheduled',
        createdBy: user?.id || 'unknown'
      });

      // Enviar confirmación
      await CalendarService.sendConfirmation(appointment);

      // Sincronizar con calendario externo (simulado)
      await CalendarService.syncWithExternalCalendar(appointment.id, 'google');

      onScheduled?.();
      onClose();
    } catch (error) {
      console.error('Error agendando cita:', error);
      alert('Error al agendar la cita');
    } finally {
      setLoading(false);
    }
  };

  const getAvailableSlots = (date: string) => {
    const dayAvailability = availability.find(a => 
      a.date.toISOString().split('T')[0] === date
    );
    return dayAvailability?.slots.filter(s => s.available) || [];
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Agendar Consulta - ${lead.name}`}
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSchedule}
            disabled={loading || !selectedDate || !selectedTime}
          >
            {loading ? 'Agendando...' : 'Agendar Cita'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Tipo de cita */}
        <Select
          label="Tipo de Cita *"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
          options={[
            { value: 'consulta', label: 'Consulta' },
            { value: 'reunion', label: 'Reunión' },
            { value: 'visita', label: 'Visita' },
            { value: 'llamada', label: 'Llamada' },
            { value: 'otro', label: 'Otro' }
          ]}
        />

        {/* Título */}
        <Input
          label="Título *"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-[#F1F5F9] mb-2">
            Descripción
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detalles de la cita..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-[#334155] rounded-lg bg-white dark:bg-[#1E1E2E] text-gray-900 dark:text-[#F1F5F9] min-h-[100px]"
          />
        </div>

        {/* Fecha */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-[#F1F5F9] mb-2">
            Fecha * <Calendar className="w-4 h-4 inline ml-1" />
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedTime(''); // Resetear hora al cambiar fecha
            }}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 dark:border-[#334155] rounded-lg bg-white dark:bg-[#1E1E2E] text-gray-900 dark:text-[#F1F5F9]"
            required
          />
        </div>

        {/* Hora */}
        {selectedDate && (
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-[#F1F5F9] mb-2">
              Hora * <Clock className="w-4 h-4 inline ml-1" />
            </label>
            <div className="grid grid-cols-4 gap-2">
              {getAvailableSlots(selectedDate).map((slot, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedTime(formatTime(slot.start))}
                  className={`px-3 py-2 rounded-lg border transition-colors ${
                    selectedTime === formatTime(slot.start)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white dark:bg-[#1E1E2E] text-gray-900 dark:text-[#F1F5F9] border-gray-300 dark:border-[#334155] hover:bg-gray-50 dark:hover:bg-[#2A2A3E]'
                  }`}
                >
                  {formatTime(slot.start)}
                </button>
              ))}
            </div>
            {getAvailableSlots(selectedDate).length === 0 && (
              <p className="text-sm text-gray-600 dark:text-[#94A3B8] mt-2">
                No hay horarios disponibles para esta fecha
              </p>
            )}
          </div>
        )}

        {/* Ubicación */}
        {formData.type !== 'llamada' && (
          <Input
            label="Ubicación"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Dirección o lugar de la cita"
            leftIcon={<MapPin className="w-4 h-4" />}
          />
        )}

        {/* Información del lead */}
        <Card padding="sm" className="bg-gray-50 dark:bg-[#1E1E2E]">
          <div className="text-sm">
            <div className="font-medium text-gray-900 dark:text-[#F1F5F9] mb-1">
              Cliente: {lead.name}
            </div>
            {lead.email && (
              <div className="text-gray-600 dark:text-[#94A3B8]">
                Email: {lead.email}
              </div>
            )}
            {lead.phone && (
              <div className="text-gray-600 dark:text-[#94A3B8]">
                Teléfono: {lead.phone}
              </div>
            )}
          </div>
        </Card>
      </div>
    </Modal>
  );
};

