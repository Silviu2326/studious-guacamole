import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Button, Badge, Modal, Input } from '../../../components/componentsreutilizables';
import { ClientReservation } from '../types';
import { 
  getClientReservations, 
  cancelClientReservation, 
  rescheduleClientReservation 
} from '../api/client-reservations';
import { 
  Calendar, 
  Clock, 
  X, 
  RefreshCw, 
  CheckCircle2, 
  Loader2,
  AlertCircle,
  MapPin,
  Video
} from 'lucide-react';

interface ClientReservationsPanelProps {
  clientId: string;
}

export const ClientReservationsPanel: React.FC<ClientReservationsPanelProps> = ({ clientId }) => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<ClientReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<ClientReservation | null>(null);
  const [rescheduleData, setRescheduleData] = useState({
    date: '',
    time: '',
  });

  useEffect(() => {
    loadReservations();
  }, [clientId]);

  const loadReservations = async () => {
    setLoading(true);
    try {
      const data = await getClientReservations(clientId);
      setReservations(data);
    } catch (error) {
      console.error('Error cargando reservas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!selectedReservation) return;
    try {
      await cancelClientReservation(selectedReservation.id);
      await loadReservations();
      setShowCancelModal(false);
      setSelectedReservation(null);
    } catch (error) {
      console.error('Error cancelando reserva:', error);
    }
  };

  const handleReschedule = async () => {
    if (!selectedReservation || !rescheduleData.date || !rescheduleData.time) return;
    try {
      await rescheduleClientReservation(
        selectedReservation.id,
        rescheduleData.date,
        rescheduleData.time
      );
      await loadReservations();
      setShowRescheduleModal(false);
      setSelectedReservation(null);
      setRescheduleData({ date: '', time: '' });
    } catch (error) {
      console.error('Error reprogramando reserva:', error);
    }
  };

  const getStatusBadge = (status: ClientReservation['estado']) => {
    switch (status) {
      case 'confirmada':
        return <Badge variant="green">Confirmada</Badge>;
      case 'pendiente':
        return <Badge variant="yellow">Pendiente</Badge>;
      case 'cancelada':
        return <Badge variant="red">Cancelada</Badge>;
      case 'completada':
        return <Badge variant="blue">Completada</Badge>;
      case 'no-show':
        return <Badge variant="gray">No asistió</Badge>;
      default:
        return <Badge variant="gray">-</Badge>;
    }
  };

  const getTypeLabel = (tipo: ClientReservation['tipo']) => {
    const labels: Record<ClientReservation['tipo'], string> = {
      'sesion-1-1': 'Sesión 1-1',
      'clase-grupal': 'Clase Grupal',
      'fisio': 'Fisioterapia',
      'nutricion': 'Nutrición',
      'masaje': 'Masaje',
    };
    return labels[tipo];
  };

  const upcomingReservations = reservations.filter(
    r => r.estado === 'confirmada' || r.estado === 'pendiente'
  ).sort((a, b) => {
    const dateA = new Date(`${a.fecha}T${a.horaInicio}`);
    const dateB = new Date(`${b.fecha}T${b.horaInicio}`);
    return dateA.getTime() - dateB.getTime();
  });

  const pastReservations = reservations.filter(
    r => r.estado === 'completada' || r.estado === 'cancelada' || r.estado === 'no-show'
  ).sort((a, b) => {
    const dateA = new Date(`${a.fecha}T${a.horaInicio}`);
    const dateB = new Date(`${b.fecha}T${b.horaInicio}`);
    return dateB.getTime() - dateA.getTime();
  });

  if (loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando reservas...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-xl ring-1 ring-green-200/70">
              <Calendar size={20} className="text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Mis Reservas
              </h3>
              <p className="text-sm text-gray-600">
                Gestiona tus reservas y sesiones
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {upcomingReservations.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Próximas Reservas</h4>
              <div className="space-y-3">
                {upcomingReservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h5 className="text-lg font-semibold text-gray-900">
                            {getTypeLabel(reservation.tipo)}
                          </h5>
                          {getStatusBadge(reservation.estado)}
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(reservation.fecha).toLocaleDateString('es-ES', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>
                              {reservation.horaInicio} - {reservation.horaFin}
                            </span>
                          </div>
                          {reservation.observaciones && (
                            <p className="text-sm text-gray-500 mt-2">
                              {reservation.observaciones}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        {reservation.canCancel && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setSelectedReservation(reservation);
                              setShowCancelModal(true);
                            }}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Cancelar
                          </Button>
                        )}
                        {reservation.canReschedule && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedReservation(reservation);
                              setRescheduleData({
                                date: reservation.fecha,
                                time: reservation.horaInicio,
                              });
                              setShowRescheduleModal(true);
                            }}
                          >
                            <RefreshCw className="w-4 h-4 mr-1" />
                            Reprogramar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {pastReservations.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Historial</h4>
              <div className="space-y-3">
                {pastReservations.slice(0, 5).map((reservation) => (
                  <div
                    key={reservation.id}
                    className="border border-gray-200 rounded-lg p-4 opacity-75"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h5 className="text-lg font-semibold text-gray-900">
                            {getTypeLabel(reservation.tipo)}
                          </h5>
                          {getStatusBadge(reservation.estado)}
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(reservation.fecha).toLocaleDateString('es-ES')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>
                              {reservation.horaInicio} - {reservation.horaFin}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {reservations.length === 0 && (
            <div className="text-center py-8">
              <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No tienes reservas</p>
            </div>
          )}
        </div>
      </Card>

      {showCancelModal && selectedReservation && (
        <Modal
          isOpen={showCancelModal}
          onClose={() => {
            setShowCancelModal(false);
            setSelectedReservation(null);
          }}
          title="Cancelar Reserva"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              ¿Estás seguro de que deseas cancelar esta reserva?
            </p>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="font-semibold text-gray-900">
                {getTypeLabel(selectedReservation.tipo)}
              </p>
              <p className="text-sm text-gray-600">
                {new Date(selectedReservation.fecha).toLocaleDateString('es-ES')} a las {selectedReservation.horaInicio}
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedReservation(null);
                }}
              >
                No Cancelar
              </Button>
              <Button variant="primary" onClick={handleCancel}>
                Confirmar Cancelación
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {showRescheduleModal && selectedReservation && (
        <Modal
          isOpen={showRescheduleModal}
          onClose={() => {
            setShowRescheduleModal(false);
            setSelectedReservation(null);
          }}
          title="Reprogramar Reserva"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nueva Fecha
              </label>
              <Input
                type="date"
                value={rescheduleData.date}
                onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nueva Hora
              </label>
              <Input
                type="time"
                value={rescheduleData.time}
                onChange={(e) => setRescheduleData({ ...rescheduleData, time: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowRescheduleModal(false);
                  setSelectedReservation(null);
                }}
              >
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleReschedule}>
                Confirmar Reprogramación
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

