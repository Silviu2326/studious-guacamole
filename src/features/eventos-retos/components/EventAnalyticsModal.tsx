// Componente para mostrar analytics y ranking de eventos

import React, { useState } from 'react';
import { Modal, Card, Button } from '../../../components/componentsreutilizables';
import { X, Trophy, TrendingUp, TrendingDown, BarChart3, Calendar, Clock, Lightbulb, Star, Users, CheckCircle } from 'lucide-react';
import { RankingEvento, ComparativaTipoEvento, AnalisisHorarios, InsightsEventos } from '../services/eventosAnalyticsService';
import { Badge } from '../../../components/componentsreutilizables/Badge';
import { Select } from '../../../components/componentsreutilizables/Select';

interface EventAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  rankings: RankingEvento[];
  comparativas: ComparativaTipoEvento[];
  analisisHorarios: AnalisisHorarios;
  insights: InsightsEventos;
}

export const EventAnalyticsModal: React.FC<EventAnalyticsModalProps> = ({
  isOpen,
  onClose,
  rankings,
  comparativas,
  analisisHorarios,
  insights,
}) => {
  const [ordenRanking, setOrdenRanking] = useState<'participacion' | 'asistencia' | 'valoracion' | 'tasaAsistencia'>('valoracion');

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= Math.round(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const getTipoEventoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      presencial: 'Presencial',
      virtual: 'Virtual',
      reto: 'Reto',
    };
    return labels[tipo] || tipo;
  };

  const getTipoEventoColor = (tipo: string) => {
    const colors: Record<string, string> = {
      presencial: 'bg-blue-100 text-blue-800',
      virtual: 'bg-purple-100 text-purple-800',
      reto: 'bg-orange-100 text-orange-800',
    };
    return colors[tipo] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="large">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Analytics y Ranking de Eventos
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Análisis de éxito y recomendaciones
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
            className="p-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Insights y Recomendaciones */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Insights y Recomendaciones
            </h3>
          </div>
          <div className="space-y-3">
            {insights.recomendaciones.map((recomendacion, index) => (
              <div key={index} className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">{recomendacion}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-blue-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Tipo de Evento Más Popular</p>
                <Badge className={getTipoEventoColor(insights.tipoEventoMasPopular)}>
                  {getTipoEventoLabel(insights.tipoEventoMasPopular)}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Mejor Momento</p>
                <p className="text-sm font-medium text-gray-900">
                  {insights.mejorMomentoParaEventos.dia} a las {insights.mejorMomentoParaEventos.hora}:00
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Tendencias */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tendencias
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              {insights.tendencias.participacion === 'aumentando' ? (
                <TrendingUp className="w-5 h-5 text-green-500" />
              ) : insights.tendencias.participacion === 'disminuyendo' ? (
                <TrendingDown className="w-5 h-5 text-red-500" />
              ) : (
                <BarChart3 className="w-5 h-5 text-gray-500" />
              )}
              <div>
                <p className="text-xs text-gray-500">Participación</p>
                <p className="text-sm font-medium text-gray-900 capitalize">
                  {insights.tendencias.participacion}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              {insights.tendencias.asistencia === 'aumentando' ? (
                <TrendingUp className="w-5 h-5 text-green-500" />
              ) : insights.tendencias.asistencia === 'disminuyendo' ? (
                <TrendingDown className="w-5 h-5 text-red-500" />
              ) : (
                <BarChart3 className="w-5 h-5 text-gray-500" />
              )}
              <div>
                <p className="text-xs text-gray-500">Asistencia</p>
                <p className="text-sm font-medium text-gray-900 capitalize">
                  {insights.tendencias.asistencia}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              {insights.tendencias.valoracion === 'aumentando' ? (
                <TrendingUp className="w-5 h-5 text-green-500" />
              ) : insights.tendencias.valoracion === 'disminuyendo' ? (
                <TrendingDown className="w-5 h-5 text-red-500" />
              ) : (
                <BarChart3 className="w-5 h-5 text-gray-500" />
              )}
              <div>
                <p className="text-xs text-gray-500">Valoración</p>
                <p className="text-sm font-medium text-gray-900 capitalize">
                  {insights.tendencias.valoracion}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Ranking de Eventos */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Ranking de Eventos
            </h3>
            <Select
              value={ordenRanking}
              onChange={(e) => setOrdenRanking(e.target.value as any)}
              className="w-48"
            >
              <option value="valoracion">Por Valoración</option>
              <option value="participacion">Por Participación</option>
              <option value="asistencia">Por Asistencia</option>
              <option value="tasaAsistencia">Por Tasa de Asistencia</option>
            </Select>
          </div>
          <div className="space-y-3">
            {rankings.slice(0, 10).map((evento, index) => (
              <div
                key={evento.eventoId}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900">{evento.eventoNombre}</p>
                      <Badge className={getTipoEventoColor(evento.tipo)}>
                        {getTipoEventoLabel(evento.tipo)}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(evento.fechaInicio).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Participación</p>
                    <p className="text-sm font-medium text-gray-900">
                      {evento.participacion}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Asistencia</p>
                    <p className="text-sm font-medium text-gray-900">
                      {evento.asistencia}
                    </p>
                    <p className="text-xs text-gray-500">
                      ({evento.tasaAsistencia.toFixed(0)}%)
                    </p>
                  </div>
                  {evento.valoracionPromedio > 0 && (
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Valoración</p>
                      {renderStars(evento.valoracionPromedio)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Comparativa por Tipo */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Comparativa por Tipo de Evento
          </h3>
          <div className="space-y-4">
            {comparativas.map((comparativa) => (
              <div
                key={comparativa.tipo}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge className={getTipoEventoColor(comparativa.tipo)}>
                      {getTipoEventoLabel(comparativa.tipo)}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {comparativa.totalEventos} eventos
                    </span>
                  </div>
                  {comparativa.promedioValoracion > 0 && (
                    <div>{renderStars(comparativa.promedioValoracion)}</div>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Participación Promedio</p>
                    <p className="text-sm font-medium text-gray-900">
                      {comparativa.promedioParticipacion.toFixed(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Asistencia Promedio</p>
                    <p className="text-sm font-medium text-gray-900">
                      {comparativa.promedioAsistencia.toFixed(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Tasa de Asistencia</p>
                    <p className="text-sm font-medium text-gray-900">
                      {comparativa.promedioTasaAsistencia.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Participantes</p>
                    <p className="text-sm font-medium text-gray-900">
                      {comparativa.totalParticipantes}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Análisis de Horarios */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Análisis de Horarios
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <p className="font-medium text-gray-900">Mejor Día de la Semana</p>
              </div>
              <p className="text-2xl font-bold text-blue-600 mb-2">
                {analisisHorarios.mejorDiaSemana.dia}
              </p>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <p className="text-xs text-gray-500">Participación</p>
                  <p className="font-medium">{analisisHorarios.mejorDiaSemana.promedioParticipacion.toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Asistencia</p>
                  <p className="font-medium">{analisisHorarios.mejorDiaSemana.promedioAsistencia.toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Valoración</p>
                  <p className="font-medium">{analisisHorarios.mejorDiaSemana.promedioValoracion.toFixed(1)}</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-purple-600" />
                <p className="font-medium text-gray-900">Mejor Hora del Día</p>
              </div>
              <p className="text-2xl font-bold text-purple-600 mb-2">
                {analisisHorarios.mejorHora.hora}:00
              </p>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <p className="text-xs text-gray-500">Participación</p>
                  <p className="font-medium">{analisisHorarios.mejorHora.promedioParticipacion.toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Asistencia</p>
                  <p className="font-medium">{analisisHorarios.mejorHora.promedioAsistencia.toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Valoración</p>
                  <p className="font-medium">{analisisHorarios.mejorHora.promedioValoracion.toFixed(1)}</p>
                </div>
              </div>
            </div>
          </div>
          {analisisHorarios.mejoresHorarios.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-900 mb-2">Mejores Combinaciones Día/Hora</p>
              <div className="space-y-2">
                {analisisHorarios.mejoresHorarios.map((horario, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-900">
                        {horario.dia} a las {horario.hora}:00
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-600">
                        {horario.promedioParticipacion.toFixed(1)} part.
                      </span>
                      <span className="text-gray-600">
                        {horario.promedioValoracion.toFixed(1)} ⭐
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        <div className="flex justify-end mt-6">
          <Button onClick={onClose} variant="primary">
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
};


