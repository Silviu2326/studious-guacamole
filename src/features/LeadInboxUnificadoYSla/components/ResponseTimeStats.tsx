import React, { useState, useEffect } from 'react';
import { Clock, TrendingUp, TrendingDown, Target, CheckCircle } from 'lucide-react';
import { Card } from '../../../components/componentsreutilizables';

interface ResponseTimeStatsProps {
  userId: string;
}

interface Stats {
  avgResponseTime: number; // in minutes
  thisWeek: number;
  lastWeek: number;
  targetTime: number; // in minutes
  onTimeRate: number; // percentage
}

export const ResponseTimeStats: React.FC<ResponseTimeStatsProps> = ({ userId }) => {
  const [stats, setStats] = useState<Stats>({
    avgResponseTime: 45,
    thisWeek: 45,
    lastWeek: 67,
    targetTime: 120, // 2 hours
    onTimeRate: 78
  });

  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const improvement = ((stats.lastWeek - stats.thisWeek) / stats.lastWeek) * 100;
  const isImproving = improvement > 0;
  const meetsTarget = stats.avgResponseTime <= stats.targetTime;

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Tiempo de Respuesta</h3>
              <p className="text-sm text-gray-600">Tu rendimiento semanal</p>
            </div>
          </div>
        </div>

        {/* Main metric */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-bold text-gray-900">
              {formatTime(stats.avgResponseTime)}
            </span>
            <span className="text-lg text-gray-600">promedio</span>
          </div>
          <p className="text-sm text-gray-600">Respondes a tus leads en promedio</p>
        </div>

        {/* Comparison */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Esta semana</span>
              {isImproving ? (
                <TrendingDown className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingUp className="w-4 h-4 text-red-600" />
              )}
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {formatTime(stats.thisWeek)}
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Semana pasada</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {formatTime(stats.lastWeek)}
            </div>
          </div>
        </div>

        {/* Improvement indicator */}
        {improvement !== 0 && (
          <div className={`flex items-center gap-2 px-4 py-3 rounded-xl mb-6 ${
            isImproving ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {isImproving ? (
              <TrendingDown className="w-5 h-5" />
            ) : (
              <TrendingUp className="w-5 h-5" />
            )}
            <span className="text-sm font-semibold">
              {isImproving ? 'Mejoraste' : 'Empeoraste'} un {Math.abs(Math.round(improvement))}% respecto a la semana pasada
            </span>
          </div>
        )}

        {/* Target */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-semibold text-gray-900">Meta: {formatTime(stats.targetTime)}</span>
            </div>
            {meetsTarget && (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-xs font-medium">¡Cumplida!</span>
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div className="relative">
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  meetsTarget ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{
                  width: `${Math.min((stats.targetTime / stats.avgResponseTime) * 100, 100)}%`
                }}
              />
            </div>
            <div className="mt-2 text-xs text-gray-600 text-center">
              {meetsTarget
                ? `¡Excelente! Estás ${formatTime(stats.targetTime - stats.avgResponseTime)} por debajo de tu meta`
                : `Te faltan ${formatTime(stats.avgResponseTime - stats.targetTime)} para alcanzar tu meta`
              }
            </div>
          </div>
        </div>

        {/* On-time rate */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Tasa de respuestas a tiempo</p>
              <p className="text-xs text-gray-500 mt-1">Respuestas dentro de la meta</p>
            </div>
            <div className={`text-2xl font-bold ${
              stats.onTimeRate >= 80 ? 'text-green-600' :
              stats.onTimeRate >= 60 ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {stats.onTimeRate}%
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

