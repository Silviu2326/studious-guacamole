import React from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { User, Star, TrendingUp, Eye } from 'lucide-react';
import { TrainerPerformanceSummary } from '../types';

export interface TrainerPerformanceCardProps {
  trainer: TrainerPerformanceSummary;
  onViewDetails: (trainerId: string) => void;
}

export const TrainerPerformanceCard: React.FC<TrainerPerformanceCardProps> = ({
  trainer,
  onViewDetails,
}) => {
  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (trend?: number) => {
    if (!trend) return null;
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
  };

  return (
    <Card variant="hover" className="h-full flex flex-col transition-shadow overflow-hidden bg-white shadow-sm">
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {trainer.avatarUrl ? (
              <img
                src={trainer.avatarUrl}
                alt={trainer.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {trainer.name}
            </h3>

            {/* KPIs */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Star size={16} className={getRatingColor(trainer.avgClientRating)} />
                  <span className="text-sm text-gray-600">
                    Calificación Clientes
                  </span>
                </div>
                <p className={`text-base font-semibold ${getRatingColor(trainer.avgClientRating)}`}>
                  {trainer.avgClientRating.toFixed(1)}/5.0
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp size={16} className="text-blue-600" />
                  <span className="text-sm text-gray-600">
                    Retención
                  </span>
                </div>
                <p className="text-base font-semibold text-blue-600">
                  {trainer.clientRetentionRate}%
                </p>
              </div>
            </div>

            {/* Additional Metrics */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-600">
                  Objetivos:
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {trainer.goalCompletionRate}%
                </span>
              </div>
              {trainer.performanceTrend !== undefined && (
                <div className="flex items-center gap-1">
                  {getTrendIcon(trainer.performanceTrend)}
                  <span className="text-sm text-gray-600">
                    Tendencia
                  </span>
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="mt-auto pt-3 border-t border-gray-100">
              <Button
                variant="secondary"
                size="sm"
                fullWidth
                onClick={() => onViewDetails(trainer.staffMemberId)}
              >
                <Eye size={16} className="mr-2" />
                Ver Detalles
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

