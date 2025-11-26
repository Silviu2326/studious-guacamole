import React from 'react';
import { SurveySummary } from '../api/surveys';
import { FileText, Archive, CheckCircle, Loader, Eye, BarChart3 } from 'lucide-react';
import { Card } from '../../../components/componentsreutilizables';
import { Button } from '../../../components/componentsreutilizables';

interface SurveySummaryCardProps {
  survey: SurveySummary;
  onView: (surveyId: string) => void;
  onViewResults?: (surveyId: string) => void;
}

/**
 * Tarjeta de UI que muestra un resumen de una encuesta existente.
 */
export const SurveySummaryCard: React.FC<SurveySummaryCardProps> = ({
  survey,
  onView,
  onViewResults
}) => {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      active: 'bg-green-100 text-green-800',
      archived: 'bg-gray-100 text-gray-600'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: 'Borrador',
      active: 'Activa',
      archived: 'Archivada'
    };
    return labels[status] || status;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'archived':
        return <Archive className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <Card variant="hover" className="h-full flex flex-col transition-shadow overflow-hidden">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{survey.title}</h3>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(survey.status)}`}>
              {getStatusIcon(survey.status)}
              {getStatusLabel(survey.status)}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Principal */}
      <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{survey.mainKpi.label}</p>
            <p className="text-2xl font-bold text-gray-900">{survey.mainKpi.value}</p>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Tasa de Respuesta</span>
          <span className="font-semibold text-gray-900">{survey.responseRate}%</span>
        </div>
        {survey.totalSent !== undefined && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Enviadas</span>
            <span className="font-medium text-gray-700">{survey.totalSent}</span>
          </div>
        )}
        {survey.totalResponses !== undefined && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Respuestas</span>
            <span className="font-medium text-gray-700">{survey.totalResponses}</span>
          </div>
        )}
      </div>

      {/* Barra de progreso */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${survey.responseRate}%` }}
          />
        </div>
      </div>

      {/* Acciones */}
      <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
        <Button
          onClick={() => onView(survey.id)}
          variant="primary"
          size="sm"
          fullWidth
          leftIcon={<Eye size={16} />}
        >
          Ver Detalles
        </Button>
        {survey.status === 'active' && survey.totalResponses && survey.totalResponses > 0 && onViewResults && (
          <Button
            onClick={() => onViewResults(survey.id)}
            variant="secondary"
            size="sm"
            leftIcon={<BarChart3 size={16} />}
          >
            Resultados
          </Button>
        )}
      </div>
    </Card>
  );
};


