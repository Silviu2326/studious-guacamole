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
  BarChart3,
  AlertCircle
} from 'lucide-react';
import { Card, MetricCards, type MetricCardData } from '../../../components/componentsreutilizables';

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
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
        <p className="text-gray-600 mb-4">{error.message}</p>
      </Card>
    );
  }

  if (!event) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Evento no encontrado</h3>
        <p className="text-gray-600">No se pudo encontrar el evento solicitado.</p>
      </Card>
    );
  }

  const primaryMetric = event.metrics?.find(m => m.isPrimary);
  const completionRate = event.stats?.completionRate 
    ? (event.stats.completionRate * 100).toFixed(1) 
    : '0';

  return (
    <div className="space-y-6">
      {/* Header del Evento */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-600 p-6 text-white border-0">
        <h2 className="text-2xl font-bold mb-2">{event.name}</h2>
        <p className="text-blue-100 mb-4">{event.description}</p>
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
      </Card>

      {/* KPIs */}
      <MetricCards
        columns={4}
        data={[
          {
            id: 'participants',
            title: 'Participantes',
            value: event.participantCount,
            subtitle: event.maxParticipants ? `de ${event.maxParticipants} plazas` : undefined,
            color: 'info',
            icon: <Users size={20} />
          },
          {
            id: 'revenue',
            title: 'Ingresos',
            value: `${event.stats?.totalRevenue?.toLocaleString() || '0'}€`,
            color: 'success',
            icon: <DollarSign size={20} />
          },
          {
            id: 'completion',
            title: 'Tasa Finalización',
            value: `${completionRate}%`,
            color: 'info',
            icon: <TrendingUp size={20} />
          },
          {
            id: 'engagement',
            title: 'Engagement',
            value: event.stats?.averageEngagement?.toFixed(1) || '0',
            color: 'warning',
            icon: <BarChart3 size={20} />
          }
        ] as MetricCardData[]}
      />

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
                className="rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-1 text-sm"
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
            <Card className="p-8 text-center bg-white shadow-sm">
              <Trophy size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin datos disponibles</h3>
              <p className="text-gray-600">No hay datos de leaderboard disponibles aún</p>
            </Card>
          )}
        </div>

        {/* Lista de Participantes */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Participantes</h3>
          <Card className="bg-white shadow-sm overflow-hidden">
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
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-blue-600 font-semibold text-xs">
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
                <div className="text-center py-8">
                  <Users size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin participantes</h3>
                  <p className="text-gray-600">No hay participantes inscritos todavía</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};


