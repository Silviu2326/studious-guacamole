import React from 'react';
import { LeaderboardEntry } from '../api/events';
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface LeaderboardProps {
  participants: LeaderboardEntry[];
  metricName: string;
}

/**
 * Componente visual que renderiza una tabla de clasificación ordenada.
 */
export const Leaderboard: React.FC<LeaderboardProps> = ({
  participants,
  metricName
}) => {
  const getProgressIcon = (progress: 'up' | 'down' | 'neutral') => {
    switch (progress) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Leaderboard - {metricName}
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Posición
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Participante
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tendencia
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {participants.map((participant) => (
              <tr
                key={participant.userId}
                className={`hover:bg-gray-50 transition-colors ${
                  participant.rank <= 3 ? 'bg-yellow-50/30' : ''
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {participant.rank <= 3 && (
                      <Trophy className={`w-5 h-5 ${
                        participant.rank === 1 ? 'text-yellow-500' :
                        participant.rank === 2 ? 'text-gray-400' :
                        'text-amber-600'
                      }`} />
                    )}
                    <span className="text-lg font-bold text-gray-900">
                      {getRankBadge(participant.rank)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    {participant.userAvatar ? (
                      <img
                        src={participant.userAvatar}
                        alt={participant.userName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-purple-600 font-semibold text-sm">
                          {participant.userName.charAt(0)}
                        </span>
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-900">
                      {participant.userName}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-lg font-semibold text-gray-900">
                    {participant.value.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getProgressIcon(participant.progress)}
                    {participant.change !== undefined && (
                      <span className={`text-sm ${
                        participant.progress === 'up' ? 'text-green-600' :
                        participant.progress === 'down' ? 'text-red-600' :
                        'text-gray-600'
                      }`}>
                        {participant.change > 0 ? '+' : ''}{participant.change.toFixed(2)}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {participants.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p>No hay participantes aún en el leaderboard</p>
        </div>
      )}
    </div>
  );
};


