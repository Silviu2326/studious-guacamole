import React from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { Competitor } from '../api/competitors';
import { ExternalLink, Trash2, Eye, TrendingUp, Calendar } from 'lucide-react';
import { Button } from '../../../components/componentsreutilizables';

interface CompetitorCardProps {
  competitor: Competitor;
  onViewDetails: (id: string) => void;
  onDelete: (id: string) => void;
}

/**
 * Componente presentacional que muestra la información resumida de un competidor
 */
export const CompetitorCard: React.FC<CompetitorCardProps> = ({
  competitor,
  onViewDetails,
  onDelete
}) => {
  const getStatusBadge = (status: Competitor['status']) => {
    const statusConfig = {
      pending_first_scan: { label: 'Analizando...', color: 'bg-yellow-100 text-yellow-800' },
      scanning: { label: 'Escaneando', color: 'bg-blue-100 text-blue-800' },
      active: { label: 'Activo', color: 'bg-green-100 text-green-800' },
      error: { label: 'Error', color: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status] || statusConfig.pending_first_scan;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card variant="hover" className="h-full flex flex-col transition-shadow overflow-hidden">
      <div className="p-4 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {competitor.name}
              </h3>
              {getStatusBadge(competitor.status)}
            </div>
            <a
              href={competitor.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <ExternalLink className="w-4 h-4" />
              Ver sitio web
            </a>
          </div>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
              <TrendingUp className="w-4 h-4" />
              Precio/Sesión
            </div>
            <p className="text-xl font-bold text-gray-900">
              {competitor.summary.avgPricePerSession > 0 
                ? `€${competitor.summary.avgPricePerSession}` 
                : 'N/A'}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-gray-600 text-sm mb-1">Engagement</div>
            <p className="text-xl font-bold text-gray-900">
              {competitor.summary.socialEngagementRate > 0 
                ? `${competitor.summary.socialEngagementRate}%` 
                : 'N/A'}
            </p>
          </div>
        </div>

        {/* Última actualización */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Calendar className="w-3 h-3" />
          Última actualización: {formatDate(competitor.summary.lastUpdate)}
        </div>

        {/* Acciones */}
        <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onViewDetails(competitor.id)}
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-2" />
            Ver Detalles
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(competitor.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};


