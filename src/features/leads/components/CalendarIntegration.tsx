import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Button, Modal, Select } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { Appointment } from '../api/calendar';
import { getAppointments, cancelAppointment, updateAppointment } from '../api/calendar';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';

interface CalendarIntegrationProps {
  businessType: 'entrenador' | 'gimnasio';
  userId?: string;
}

export const CalendarIntegration: React.FC<CalendarIntegrationProps> = ({ businessType, userId }) => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'today' | 'past'>('upcoming');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, [filter, businessType, userId]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const filters: any = {};

      if (filter === 'upcoming') {
        filters.startDate = now;
      } else if (filter === 'today') {
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const todayEnd = new Date(todayStart);
        todayEnd.setDate(todayEnd.getDate() + 1);
        filters.startDate = todayStart;
        filters.endDate = todayEnd;
      } else if (filter === 'past') {
        filters.endDate = now;
      }

      const data = await getAppointments(filters);
      setAppointments(data);
    } catch (error) {
      console.error('Error cargando citas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (window.confirm('¿Estás seguro de cancelar esta cita?')) {
      try {
        await cancelAppointment(id);
        await loadAppointments();
      } catch (error) {
        console.error('Error cancelando cita:', error);
      }
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await updateAppointment(id, { status: 'completed' });
      await loadAppointments();
    } catch (error) {
      console.error('Error completando cita:', error);
    }
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300';
      case 'confirmed':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300';
      case 'completed':
        return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-300';
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled':
        return 'Agendada';
      case 'confirmed':
        return 'Confirmada';
      case 'completed':
        return 'Completada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const getTypeLabel = (type: Appointment['type']) => {
    switch (type) {
      case 'consulta':
        return 'Consulta';
      case 'reunion':
        return 'Reunión';
      case 'visita':
        return 'Visita';
      case 'llamada':
        return 'Llamada';
      case 'otro':
        return 'Otro';
      default:
        return type;
    }
  };

  const formatDateTime = (date: Date) => {
    const d = new Date(date);
    return {
      date: d.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      time: d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const upcomingAppointments = appointments.filter(apt => 
    new Date(apt.startTime) >= new Date() && apt.status !== 'cancelled' && apt.status !== 'completed'
  );

  const todayAppointments = upcomingAppointments.filter(apt => {
    const aptDate = new Date(apt.startTime);
    const today = new Date();
    return aptDate.toDateString() === today.toDateString();
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-[#F1F5F9]">
            Calendario de Citas
          </h2>
          <p className="text-gray-600 dark:text-[#94A3B8] mt-1">
            Gestiona tus citas y reuniones con leads
          </p>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <div className={ds.spacing.md}>
          <Select
            label="Filtrar por"
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            options={[
              { value: 'all', label: 'Todas' },
              { value: 'upcoming', label: 'Próximas' },
              { value: 'today', label: 'Hoy' },
              { value: 'past', label: 'Pasadas' }
            ]}
          />
        </div>
      </Card>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-3 gap-4">
        <Card padding="md">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-[#F1F5F9]">
                {upcomingAppointments.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-[#94A3B8]">
                Próximas
              </div>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-[#F1F5F9]">
                {todayAppointments.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-[#94A3B8]">
                Hoy
              </div>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-[#F1F5F9]">
                {appointments.filter(a => a.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-[#94A3B8]">
                Completadas
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Lista de citas */}
      <Card>
        <div className={ds.spacing.md}>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className={`animate-spin ${ds.radius.full} h-8 w-8 border-b-2 ${ds.color.primaryBg}`}></div>
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-[#94A3B8]">
                No hay citas con los filtros seleccionados
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.map(appointment => {
                const { date, time } = formatDateTime(appointment.startTime);
                const isPast = new Date(appointment.startTime) < new Date();
                const isToday = new Date(appointment.startTime).toDateString() === new Date().toDateString();

                return (
                  <div
                    key={appointment.id}
                    className={`p-4 border rounded-lg transition-colors ${
                      isToday
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                        : 'bg-gray-50 dark:bg-[#1E1E2E] border-gray-200 dark:border-[#334155] hover:bg-gray-100 dark:hover:bg-[#2A2A3E]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-[#F1F5F9]">
                            {appointment.title}
                          </h3>
                          <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(appointment.status)}`}>
                            {getStatusLabel(appointment.status)}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded bg-gray-200 dark:bg-[#334155] text-gray-700 dark:text-gray-300">
                            {getTypeLabel(appointment.type)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-[#94A3B8] space-y-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{time}</span>
                          </div>
                          {appointment.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{appointment.location}</span>
                            </div>
                          )}
                          <div className="text-gray-900 dark:text-[#F1F5F9]">
                            Cliente: {appointment.leadName}
                          </div>
                          {appointment.description && (
                            <p className="text-gray-700 dark:text-gray-400 mt-2">
                              {appointment.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {appointment.status !== 'completed' && appointment.status !== 'cancelled' && !isPast && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleComplete(appointment.id)}
                            title="Marcar como completada"
                          >
                            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                          </Button>
                        )}
                        {appointment.status !== 'cancelled' && !isPast && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancel(appointment.id)}
                            title="Cancelar cita"
                          >
                            <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setShowDetails(true);
                          }}
                          title="Ver detalles"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      {/* Modal de detalles */}
      {selectedAppointment && (
        <Modal
          isOpen={showDetails}
          onClose={() => {
            setShowDetails(false);
            setSelectedAppointment(null);
          }}
          title={`Detalles de Cita: ${selectedAppointment.title}`}
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-[#F1F5F9] mb-1">
                Cliente
              </label>
              <p className="text-gray-900 dark:text-[#F1F5F9]">{selectedAppointment.leadName}</p>
              {selectedAppointment.leadEmail && (
                <p className="text-sm text-gray-600 dark:text-[#94A3B8]">{selectedAppointment.leadEmail}</p>
              )}
              {selectedAppointment.leadPhone && (
                <p className="text-sm text-gray-600 dark:text-[#94A3B8]">{selectedAppointment.leadPhone}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-[#F1F5F9] mb-1">
                Fecha y Hora
              </label>
              <p className="text-gray-900 dark:text-[#F1F5F9]">
                {formatDateTime(selectedAppointment.startTime).date} a las {formatDateTime(selectedAppointment.startTime).time}
              </p>
            </div>
            {selectedAppointment.location && (
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-[#F1F5F9] mb-1">
                  Ubicación
                </label>
                <p className="text-gray-900 dark:text-[#F1F5F9]">{selectedAppointment.location}</p>
              </div>
            )}
            {selectedAppointment.description && (
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-[#F1F5F9] mb-1">
                  Descripción
                </label>
                <p className="text-gray-900 dark:text-[#F1F5F9]">{selectedAppointment.description}</p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-[#F1F5F9] mb-1">
                Estado
              </label>
              <span className={`inline-block text-xs px-2 py-1 rounded ${getStatusColor(selectedAppointment.status)}`}>
                {getStatusLabel(selectedAppointment.status)}
              </span>
            </div>
            {selectedAppointment.externalCalendarId && (
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-[#F1F5F9] mb-1">
                  Sincronizado con
                </label>
                <p className="text-sm text-gray-600 dark:text-[#94A3B8]">
                  {selectedAppointment.externalCalendarId.startsWith('google') ? 'Google Calendar' : 'Calendario externo'}
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

