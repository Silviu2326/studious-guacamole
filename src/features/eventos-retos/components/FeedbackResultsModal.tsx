// Componente para mostrar resultados de feedback post-evento

import React from 'react';
import { Modal, Card, Button } from '../../../components/componentsreutilizables';
import { X, Star, MessageSquare, TrendingUp, Users, BarChart3, ThumbsUp, ThumbsDown } from 'lucide-react';
import { EstadisticasFeedback } from '../services/feedbackService';
import { Badge } from '../../../components/componentsreutilizables/Badge';

interface FeedbackResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventoNombre: string;
  estadisticas: EstadisticasFeedback;
}

export const FeedbackResultsModal: React.FC<FeedbackResultsModalProps> = ({
  isOpen,
  onClose,
  eventoNombre,
  estadisticas,
}) => {
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="large">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Resultados de Feedback
            </h2>
            <p className="text-sm text-gray-500 mt-1">{eventoNombre}</p>
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
            className="p-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Satisfacción</p>
                <p className={`text-2xl font-bold ${getRatingColor(estadisticas.satisfaccionPromedio)}`}>
                  {estadisticas.satisfaccionPromedio.toFixed(1)}/5
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-400" />
            </div>
            {renderStars(Math.round(estadisticas.satisfaccionPromedio))}
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tasa de Respuesta</p>
                <p className="text-2xl font-bold text-gray-900">
                  {estadisticas.tasaRespuesta.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {estadisticas.totalRespuestas} de {estadisticas.totalParticipantes} respuestas
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Comentarios</p>
                <p className="text-2xl font-bold text-gray-900">
                  {estadisticas.comentariosDestacados.length + estadisticas.comentariosNegativos.length}
                </p>
              </div>
              <MessageSquare className="w-8 h-8 text-purple-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Participantes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {estadisticas.totalParticipantes}
                </p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </Card>
        </div>

        {/* Distribución de ratings */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Distribución de Valoraciones
          </h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = estadisticas.distribucionRatings[rating as keyof typeof estadisticas.distribucionRatings];
              const percentage = estadisticas.totalRespuestas > 0
                ? (count / estadisticas.totalRespuestas) * 100
                : 0;

              return (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-20">
                    <span className="text-sm font-medium">{rating}</span>
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                    <div
                      className={`h-full ${
                        rating >= 4
                          ? 'bg-green-500'
                          : rating >= 3
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-16 text-right">
                    {count} ({percentage.toFixed(0)}%)
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Preguntas con mejores/peores respuestas */}
        {estadisticas.preguntasConMejoresRespuestas.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <ThumbsUp className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Mejores Aspectos
                </h3>
              </div>
              <div className="space-y-3">
                {estadisticas.preguntasConMejoresRespuestas.map((pregunta, index) => (
                  <div key={index} className="border-l-4 border-green-500 pl-3">
                    <p className="text-sm text-gray-700 mb-1">{pregunta.preguntaTexto}</p>
                    <div className="flex items-center gap-2">
                      {renderStars(Math.round(pregunta.promedio))}
                      <span className="text-xs text-gray-500">
                        {pregunta.promedio.toFixed(1)}/5
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {estadisticas.preguntasConPeoresRespuestas.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ThumbsDown className="w-5 h-5 text-red-500" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Áreas de Mejora
                  </h3>
                </div>
                <div className="space-y-3">
                  {estadisticas.preguntasConPeoresRespuestas.map((pregunta, index) => (
                    <div key={index} className="border-l-4 border-red-500 pl-3">
                      <p className="text-sm text-gray-700 mb-1">{pregunta.preguntaTexto}</p>
                      <div className="flex items-center gap-2">
                        {renderStars(Math.round(pregunta.promedio))}
                        <span className="text-xs text-gray-500">
                          {pregunta.promedio.toFixed(1)}/5
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Comentarios destacados */}
        {estadisticas.comentariosDestacados.length > 0 && (
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <ThumbsUp className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Comentarios Destacados
              </h3>
            </div>
            <div className="space-y-4">
              {estadisticas.comentariosDestacados.map((comentario, index) => (
                <div
                  key={index}
                  className="bg-green-50 border border-green-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">
                        {comentario.participanteNombre}
                      </p>
                      {comentario.rating && (
                        <Badge variant="success" className="text-xs">
                          {comentario.rating}/5 ⭐
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(comentario.fecha).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{comentario.comentario}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Comentarios negativos */}
        {estadisticas.comentariosNegativos.length > 0 && (
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <ThumbsDown className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Comentarios para Mejorar
              </h3>
            </div>
            <div className="space-y-4">
              {estadisticas.comentariosNegativos.map((comentario, index) => (
                <div
                  key={index}
                  className="bg-red-50 border border-red-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">
                        {comentario.participanteNombre}
                      </p>
                      {comentario.rating && (
                        <Badge variant="danger" className="text-xs">
                          {comentario.rating}/5 ⭐
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(comentario.fecha).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{comentario.comentario}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className="flex justify-end mt-6">
          <Button onClick={onClose} variant="primary">
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
};


