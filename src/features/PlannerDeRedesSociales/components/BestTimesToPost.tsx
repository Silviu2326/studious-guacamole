import React from 'react';
import { BestTimeToPost, SocialPlatform, getPlatformIcon } from '../api/social';
import { Card } from '../../../components/componentsreutilizables';
import { Clock, TrendingUp, Calendar } from 'lucide-react';

interface BestTimesToPostProps {
  times: BestTimeToPost[];
  platform?: SocialPlatform;
}

export const BestTimesToPost: React.FC<BestTimesToPostProps> = ({ times, platform }) => {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'bg-green-600';
    if (score >= 70) return 'bg-yellow-600';
    return 'bg-orange-600';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={20} className="text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Mejores Horarios para Publicar</h3>
        </div>
        {platform && (
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getPlatformIcon(platform)}</span>
            <span className="text-sm text-gray-600 capitalize">{platform}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {times.map((time, idx) => (
          <Card
            key={idx}
            className="p-5 bg-white shadow-sm ring-1 ring-gray-200 hover:ring-blue-400 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-blue-600" />
                <div>
                  <p className="font-semibold text-gray-900">{time.dayOfWeek}</p>
                  <p className="text-sm text-gray-600">{time.hour}:00</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 mb-1">
                  <TrendingUp size={14} className="text-green-600" />
                  <span className="text-xs font-medium text-gray-600">Score</span>
                </div>
                <div className={`w-12 h-12 rounded-full ${getScoreColor(time.engagementScore)} flex items-center justify-center`}>
                  <span className="text-white font-bold text-sm">{time.engagementScore}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-800">{time.recommendation}</p>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Plataforma</span>
                <div className="flex items-center gap-1">
                  <span className="text-lg">{getPlatformIcon(time.platform)}</span>
                  <span className="text-gray-900 capitalize">{time.platform}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {times.length === 0 && (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Clock size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay datos</h3>
          <p className="text-gray-600">Los mejores horarios aparecerán después de analizar tu actividad</p>
        </Card>
      )}
    </div>
  );
};

