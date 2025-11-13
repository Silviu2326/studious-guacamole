// User Story: Widget de objetivos para incrustar en otras páginas
import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { Objective } from '../types';
import { getObjectives } from '../api/objectives';
import { Target, TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Clock, RefreshCw, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

interface ObjectivesWidgetProps {
  maxObjectives?: number; // Número máximo de objetivos a mostrar
  showAllLink?: boolean; // Si se muestra un enlace para ver todos
  statusFilter?: Objective['status']; // Filtro por estado
  categoryFilter?: string; // Filtro por categoría
  compact?: boolean; // Modo compacto
  title?: string; // Título personalizado del widget
  onObjectiveClick?: (objective: Objective) => void; // Callback cuando se hace clic en un objetivo
}

export const ObjectivesWidget: React.FC<ObjectivesWidgetProps> = ({
  maxObjectives = 5,
  showAllLink = true,
  statusFilter,
  categoryFilter,
  compact = false,
  title = 'Objetivos',
  onObjectiveClick,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const role = user?.role === 'entrenador' ? 'entrenador' : 'gimnasio';
  
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadObjectives();
  }, [statusFilter, categoryFilter, role]);

  const loadObjectives = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (statusFilter) filters.status = statusFilter;
      if (categoryFilter) filters.category = categoryFilter;
      
      const data = await getObjectives(filters, role);
      setObjectives(data.slice(0, maxObjectives));
    } catch (error) {
      console.error('Error cargando objetivos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadObjectives();
    setRefreshing(false);
  };

  const handleObjectiveClick = (objective: Objective) => {
    if (onObjectiveClick) {
      onObjectiveClick(objective);
    } else {
      navigate(`/objetivos-rendimiento?tab=objetivos&objectiveId=${objective.id}`);
    }
  };

  const getStatusIcon = (status: Objective['status']) => {
    switch (status) {
      case 'achieved':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'at_risk':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'not_started':
        return <Clock className="w-4 h-4 text-gray-400" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-800" />;
      default:
        return <Target className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: Objective['status']) => {
    switch (status) {
      case 'achieved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'at_risk':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'not_started':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'failed':
        return 'bg-red-200 text-red-900 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatStatus = (status: Objective['status']) => {
    const statusMap: Record<Objective['status'], string> = {
      'not_started': 'No iniciado',
      'in_progress': 'En progreso',
      'achieved': 'Logrado',
      'at_risk': 'En riesgo',
      'failed': 'Fallido',
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <Card className={compact ? "p-4" : "p-6"}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-2">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (objectives.length === 0) {
    return (
      <Card className={compact ? "p-4" : "p-6"}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-semibold text-gray-900 ${compact ? 'text-sm' : 'text-lg'}`}>
            {title}
          </h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No hay objetivos para mostrar</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={compact ? "p-4" : "p-6"}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-semibold text-gray-900 ${compact ? 'text-sm' : 'text-lg'}`}>
          {title}
        </h3>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
          title="Actualizar objetivos"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className={compact ? "space-y-2" : "space-y-3"}>
        {objectives.map((objective) => (
          <div
            key={objective.id}
            onClick={() => handleObjectiveClick(objective)}
            className={`${compact ? 'p-3' : 'p-4'} border border-gray-200 rounded-lg cursor-pointer hover:shadow-md transition-all`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start gap-3 flex-1">
                <div className="mt-0.5">{getStatusIcon(objective.status)}</div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-medium text-gray-900 ${compact ? 'text-sm' : 'text-base'} truncate`}>
                    {objective.title}
                  </h4>
                  {!compact && objective.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {objective.description}
                    </p>
                  )}
                </div>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded border ${getStatusColor(
                  objective.status
                )} whitespace-nowrap ml-2`}
              >
                {formatStatus(objective.status)}
              </span>
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">
                  {objective.currentValue.toLocaleString()} {objective.unit} / {objective.targetValue.toLocaleString()} {objective.unit}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {objective.progress.toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${getProgressColor(objective.progress)}`}
                  style={{ width: `${Math.min(objective.progress, 100)}%` }}
                />
              </div>
            </div>

            {objective.responsibleName && !compact && (
              <div className="mt-2 flex items-center text-xs text-gray-500">
                <span>Responsable: {objective.responsibleName}</span>
              </div>
            )}

            {objective.dataSource?.enabled && (
              <div className="mt-2 flex items-center text-xs text-gray-500">
                <RefreshCw className="w-3 h-3 mr-1" />
                <span>Actualización automática desde {objective.dataSource.source}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {showAllLink && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => navigate('/objetivos-rendimiento?tab=objetivos')}
            className="flex items-center justify-center w-full text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Ver todos los objetivos
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      )}
    </Card>
  );
};

