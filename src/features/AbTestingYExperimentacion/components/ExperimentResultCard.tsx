import React from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { Experiment } from '../api/experiments';
import { StatisticalSignificanceIndicator } from './StatisticalSignificanceIndicator';
import { 
  Play, 
  Pause, 
  Square, 
  Trophy, 
  TrendingUp,
  Eye,
  Target
} from 'lucide-react';

interface ExperimentResultCardProps {
  experiment: Experiment;
}

export const ExperimentResultCard: React.FC<ExperimentResultCardProps> = ({ experiment }) => {
  const getStatusBadge = (status: string) => {
    const badges = {
      'DRAFT': 'bg-gray-100 text-gray-700',
      'ACTIVE': 'bg-green-100 text-green-700',
      'PAUSED': 'bg-yellow-100 text-yellow-700',
      'FINISHED': 'bg-blue-100 text-blue-700'
    };
    return badges[status as keyof typeof badges] || badges.DRAFT;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      'DRAFT': 'Borrador',
      'ACTIVE': 'Activo',
      'PAUSED': 'Pausado',
      'FINISHED': 'Finalizado'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      'LANDING_PAGE': 'Landing Page',
      'EMAIL': 'Email',
      'OFFER': 'Oferta'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const bestVariant = experiment.variants.reduce((best, current) => 
    current.conversionRate > best.conversionRate ? current : best
  );

  const handleStatusChange = async (newStatus: string) => {
    // TODO: Implementar cambio de estado
    console.log(`Cambiar estado a: ${newStatus}`);
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{experiment.name}</h3>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(experiment.status)}`}>
              {getStatusLabel(experiment.status)}
            </span>
            <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-700">
              {getTypeLabel(experiment.type)}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Objetivo: {experiment.objective}
          </p>
          {experiment.winner && (
            <div className="flex items-center gap-2 text-sm text-green-700 font-medium">
              <Trophy className="w-4 h-4" />
              <span>Ganador: {experiment.variants.find(v => v.id === experiment.winner)?.name}</span>
            </div>
          )}
        </div>
        
        {experiment.status === 'ACTIVE' && (
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => handleStatusChange('PAUSED')}
            >
              <Pause className="w-4 h-4" />
            </Button>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => handleStatusChange('FINISHED')}
            >
              <Square className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Estadísticas de variantes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {experiment.variants.map((variant, idx) => {
          const isWinner = variant.id === experiment.winner;
          const isBest = variant.id === bestVariant.id;
          
          return (
            <div 
              key={variant.id}
              className={`p-4 rounded-lg border-2 ${
                isWinner 
                  ? 'border-green-500 bg-green-50' 
                  : isBest && experiment.status === 'ACTIVE'
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">{variant.name}</span>
                {isWinner && <Trophy className="w-4 h-4 text-green-600" />}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <Eye className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{variant.visitors.toLocaleString()} visitantes</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Target className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{variant.conversions} conversiones</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-600">{(variant.conversionRate * 100).toFixed(2)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Significancia estadística y lift */}
      {(experiment.confidence !== undefined || experiment.lift !== undefined) && (
        <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
          {experiment.confidence !== undefined && (
            <StatisticalSignificanceIndicator confidenceLevel={experiment.confidence} />
          )}
          {experiment.lift !== undefined && (
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">
                Mejora: <span className="text-green-600">+{(experiment.lift * 100).toFixed(1)}%</span>
              </span>
            </div>
          )}
        </div>
      )}

      {/* Acciones */}
      {experiment.winner && experiment.status === 'FINISHED' && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => {/* TODO: Implementar aplicar ganador */}}
          >
            Aplicar Variante Ganadora
          </Button>
        </div>
      )}
    </Card>
  );
};

