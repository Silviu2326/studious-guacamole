import React from 'react';
import { RankingEntry } from '../types';
import { Card } from '../../../components/componentsreutilizables';
import { Badge } from '../../../components/componentsreutilizables/Badge';
import { ds } from '../../adherencia/ui/ds';
import { Trophy, TrendingUp, Award } from 'lucide-react';

interface RankingRetosProps {
  ranking: RankingEntry[];
  loading?: boolean;
}

export const RankingRetos: React.FC<RankingRetosProps> = ({
  ranking,
  loading = false,
}) => {
  const getMedalla = (posicion: number) => {
    if (posicion === 1) return '🥇';
    if (posicion === 2) return '🥈';
    if (posicion === 3) return '🥉';
    return '';
  };

  const getPosicionColor = (posicion: number) => {
    if (posicion === 1) return 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700';
    if (posicion === 2) return 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700';
    if (posicion === 3) return 'bg-orange-100 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700';
    return 'bg-white dark:bg-[#1E1E2E] border-gray-200 dark:border-gray-700';
  };

  if (loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
        <p className="text-gray-600 mt-4">Cargando...</p>
      </Card>
    );
  }

  if (ranking.length === 0) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Trophy size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay ranking disponible aún</h3>
        <p className="text-gray-600 mb-4">
          El ranking se generará cuando los participantes comiencen a registrar progreso
        </p>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-6 space-y-4">
        <div className="flex items-center space-x-2 mb-6">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <h3 className="text-xl font-bold text-gray-900">
            Ranking
          </h3>
        </div>

        <div className="space-y-2">
          {ranking.map((entry) => (
            <div
              key={entry.participanteId}
              className={`flex items-center justify-between p-4 rounded-lg border ${getPosicionColor(entry.posicion)}`}
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#6366F1] to-[#818CF8] text-white font-bold text-lg">
                  {entry.posicion}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getMedalla(entry.posicion)}</span>
                  <div>
                    <p className={`${ds.typography.body} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                      {entry.nombre}
                    </p>
                    {entry.posicion <= 3 && (
                          <Badge variant="outline">
                            Top {entry.posicion}
                          </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className={`${ds.typography.body} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                      {entry.puntos}
                    </span>
                  </div>
                  <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                    puntos
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className={`${ds.typography.body} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                      {entry.progreso}%
                    </span>
                  </div>
                  <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                    progreso
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

