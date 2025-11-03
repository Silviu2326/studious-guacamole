import React, { useState } from 'react';
import { useEventData } from '../hooks/useEventData';
import { Leaderboard } from './Leaderboard';
import { EventParticipant } from '../api/events';
import { 
  Users, 
  DollarSign, 
  Trophy, 
  TrendingUp, 
  Mail, 
  Calendar,
  Loader2,
  BarChart3
} from 'lucide-react';

interface EventDashboardProps {
  eventId: string;
}

/**
 * Panel de control principal para un evento específico.
 * Muestra KPIs clave, lista de participantes, leaderboard y herramientas.
 */
export const EventDashboard: React.FC<EventDashboardProps> = ({
  eventId
}) => {
  const { event, participants, leaderboard, isLoading, error } = useEventData(eventId);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
        <p>Error: {error.message}</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Evento no encontrado</p>
      </div>
    );
  }

  const primaryMetric = event.metrics?.find(m => m.isPrimary);
  const completionRate = event.stats?.completionRate 
    ? (event.stats.completionRate * 100).toFixed(1) 
    : '0';

  return (
    <div className="space-y-6">
      {/* Header del Evento */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">{event.name}</h2>
        <p className="text-purple-100 mb-4">{event.description}</p>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(event.startDate).toLocaleDateString('es-ES')} - {' '}
              {new Date(event.endDate).toLocaleDateString('es-ES')}
            </span>
          </div>
          <span className="px-2 py-1 bg-white/20 rounded">
            {event.type}
          </span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Participantes</span>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{event.participantCount}</p>
          {event.maxParticipants && (
            <p className="text-xs text-gray-500 mt-1">
              de {event.maxParticipants} plazas
            </p>
          )}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Ingresos</span>
            <DollarSign className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {event.stats?.totalRevenue?.toLocaleString() || '0'}€
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Tasa Finalización</span>
            <TrendingUp className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{completionRate}%</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Engagement</span>
            <BarChart3 className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {event.stats?.averageEngagement?.toFixed(1) || '0'}
          </p>
        </div>
      </div>

      {/* Leaderboard y Participantes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leaderboard */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Leaderboard</h3>
            {event.metrics && event.metrics.length > 1 && (
              <select
                value={selectedMetric || primaryMetric?.id || ''}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {event.metrics.map(metric => (
                  <option key={metric.id} value={metric.id}>
                    {metric.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          {leaderboard ? (
            <Leaderboard
              participants={leaderboard.ranking}
              metricName={leaderboard.metricName}
            />
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No hay datos de leaderboard disponibles</p>
            </div>
          )}
        </div>

        {/* Lista de Participantes */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Participantes</h3>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              {participants.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Participante
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Estado Pago
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Posición
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {participants.map((participant) => (
                      <tr key={participant.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {participant.userAvatar ? (
                              <img
                                src={participant.userAvatar}
                                alt={participant.userName}
                                className="w-8 h-8 rounded-full"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                <span className="text-purple-600 font-semibold text-xs">
                                  {participant.userName.charAt(0)}
                                </span>
                              </div>
                            )}
                            <span className="text-sm font-medium text-gray-900">
                              {participant.userName}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            participant.paymentStatus === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : participant.paymentStatus === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {participant.paymentStatus === 'paid' ? 'Pagado' :
                             participant.paymentStatus === 'pending' ? 'Pendiente' : 'Reembolsado'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {participant.currentRank ? (
                            <span className="text-sm font-semibold text-gray-900">
                              #{participant.currentRank}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-500">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>No hay participantes inscritos todavía</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


