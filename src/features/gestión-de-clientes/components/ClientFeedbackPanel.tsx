import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Button, Badge, Modal, Textarea } from '../../../components/componentsreutilizables';
import { ClientFeedback, ClientReservation } from '../types';
import { 
  getClientFeedback, 
  createClientFeedback 
} from '../api/client-feedback';
import { getClientReservations } from '../api/client-reservations';
import { 
  MessageSquare, 
  Star, 
  Send, 
  Loader2,
  CheckCircle2,
  Calendar,
  Clock
} from 'lucide-react';

interface ClientFeedbackPanelProps {
  clientId: string;
}

export const ClientFeedbackPanel: React.FC<ClientFeedbackPanelProps> = ({ clientId }) => {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState<ClientFeedback[]>([]);
  const [reservations, setReservations] = useState<ClientReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<ClientReservation | null>(null);
  const [feedbackData, setFeedbackData] = useState({
    rating: 5,
    comment: '',
    category: 'session' as ClientFeedback['category'],
  });

  useEffect(() => {
    loadData();
  }, [clientId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [feedbackData, reservationsData] = await Promise.all([
        getClientFeedback(clientId),
        getClientReservations(clientId),
      ]);
      setFeedback(feedbackData);
      // Mostrar solo reservas completadas que aún no tienen feedback
      const completedReservations = reservationsData.filter(
        r => r.estado === 'completada' && !feedbackData.some(f => f.reservationId === r.id)
      );
      setReservations(completedReservations);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!selectedReservation) return;
    try {
      await createClientFeedback({
        clientId,
        reservationId: selectedReservation.id,
        rating: feedbackData.rating,
        comment: feedbackData.comment,
        category: feedbackData.category,
        trainerId: user?.id,
      });
      await loadData();
      setShowFeedbackModal(false);
      setSelectedReservation(null);
      setFeedbackData({ rating: 5, comment: '', category: 'session' });
    } catch (error) {
      console.error('Error enviando feedback:', error);
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando feedback...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-xl ring-1 ring-yellow-200/70">
              <MessageSquare size={20} className="text-yellow-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Feedback y Evaluaciones
              </h3>
              <p className="text-sm text-gray-600">
                Comparte tu opinión sobre tus sesiones
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {reservations.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Sesiones Pendientes de Evaluar
              </h4>
              <div className="space-y-3">
                {reservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-yellow-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h5 className="text-lg font-semibold text-gray-900">
                            Sesión del {new Date(reservation.fecha).toLocaleDateString('es-ES')}
                          </h5>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>
                              {reservation.horaInicio} - {reservation.horaFin}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="primary"
                        onClick={() => {
                          setSelectedReservation(reservation);
                          setShowFeedbackModal(true);
                        }}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Dar Feedback
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {feedback.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Mi Historial de Feedback
              </h4>
              <div className="space-y-3">
                {feedback.map((fb) => (
                  <div
                    key={fb.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getRatingStars(fb.rating)}
                      </div>
                      <Badge variant="gray">
                        {new Date(fb.submittedAt).toLocaleDateString('es-ES')}
                      </Badge>
                    </div>
                    {fb.comment && (
                      <p className="text-sm text-gray-600 mt-2">{fb.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {reservations.length === 0 && feedback.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No hay sesiones pendientes de evaluar</p>
            </div>
          )}
        </div>
      </Card>

      {showFeedbackModal && selectedReservation && (
        <Modal
          isOpen={showFeedbackModal}
          onClose={() => {
            setShowFeedbackModal(false);
            setSelectedReservation(null);
          }}
          title="Dar Feedback"
        >
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Sesión del {new Date(selectedReservation.fecha).toLocaleDateString('es-ES')}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calificación
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setFeedbackData({ ...feedbackData, rating })}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        rating <= feedbackData.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      } transition-colors`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {feedbackData.rating} / 5
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comentario (opcional)
              </label>
              <Textarea
                value={feedbackData.comment}
                onChange={(e) => setFeedbackData({ ...feedbackData, comment: e.target.value })}
                placeholder="Comparte tu experiencia..."
                rows={4}
                className="min-h-[100px]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={feedbackData.category}
                onChange={(e) => setFeedbackData({ ...feedbackData, category: e.target.value as ClientFeedback['category'] })}
              >
                <option value="session">Sesión</option>
                <option value="trainer">Entrenador</option>
                <option value="facility">Instalaciones</option>
                <option value="program">Programa</option>
                <option value="general">General</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowFeedbackModal(false);
                  setSelectedReservation(null);
                }}
              >
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleSubmitFeedback}>
                <Send className="w-4 h-4 mr-2" />
                Enviar Feedback
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

