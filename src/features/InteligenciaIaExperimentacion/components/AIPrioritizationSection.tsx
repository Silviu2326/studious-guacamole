import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Select, Modal } from '../../../components/componentsreutilizables';
import { AIPrioritizationResponse, PrioritizedAction, PriorityQuadrant } from '../types';
import { getAIPrioritization } from '../services/intelligenceService';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Zap,
  Target,
  Clock,
  DollarSign,
  Users,
  Wrench,
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  ArrowRight,
  Grid3x3,
  List,
  Filter,
  Eye,
} from 'lucide-react';

interface AIPrioritizationSectionProps {
  period?: '7d' | '30d' | '90d';
  onPeriodChange?: (period: '7d' | '30d' | '90d') => void;
  trainerId?: string;
}

const quadrantLabels: Record<PriorityQuadrant, string> = {
  'quick-wins': 'Quick Wins',
  'major-projects': 'Proyectos Mayores',
  'fill-ins': 'Tareas de Relleno',
  'thankless-tasks': 'Tareas Sin Recompensa',
};

const quadrantColors: Record<PriorityQuadrant, string> = {
  'quick-wins': 'bg-emerald-50 border-emerald-200 text-emerald-900',
  'major-projects': 'bg-blue-50 border-blue-200 text-blue-900',
  'fill-ins': 'bg-amber-50 border-amber-200 text-amber-900',
  'thankless-tasks': 'bg-red-50 border-red-200 text-red-900',
};

const quadrantDescriptions: Record<PriorityQuadrant, string> = {
  'quick-wins': 'Alto impacto, bajo esfuerzo - Hazlo primero',
  'major-projects': 'Alto impacto, alto esfuerzo - Planifícalo',
  'fill-ins': 'Bajo impacto, bajo esfuerzo - Hazlo cuando tengas tiempo',
  'thankless-tasks': 'Bajo impacto, alto esfuerzo - Evítalo o pospónlo',
};

const categoryIcons = {
  marketing: TrendingUp,
  community: Users,
  sales: DollarSign,
  operations: Wrench,
  content: BookOpen,
};

const categoryColors = {
  marketing: 'text-blue-600 bg-blue-50',
  community: 'text-purple-600 bg-purple-50',
  sales: 'text-green-600 bg-green-50',
  operations: 'text-slate-600 bg-slate-50',
  content: 'text-amber-600 bg-amber-50',
};

const impactLabels: Record<string, string> = {
  alto: 'Alto',
  medio: 'Medio',
  bajo: 'Bajo',
};

const effortLabels: Record<string, string> = {
  alto: 'Alto',
  medio: 'Medio',
  bajo: 'Bajo',
};

const resourceTypeIcons = {
  time: Clock,
  budget: DollarSign,
  team: Users,
  tools: Wrench,
  skills: BookOpen,
};

export const AIPrioritizationSection: React.FC<AIPrioritizationSectionProps> = ({
  period = '30d',
  onPeriodChange,
  trainerId,
}) => {
  const [data, setData] = useState<AIPrioritizationResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [selectedQuadrant, setSelectedQuadrant] = useState<PriorityQuadrant | 'all'>('all');
  const [viewMode, setViewMode] = useState<'matrix' | 'list'>('matrix');
  const [selectedAction, setSelectedAction] = useState<PrioritizedAction | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, [period, trainerId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      const prioritizationData = await getAIPrioritization(period, trainerId);
      setData(prioritizationData);
    } catch (error) {
      console.error('Error cargando priorización IA', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatHours = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)} min`;
    if (hours < 24) return `${hours} h`;
    return `${Math.round(hours / 24)} días`;
  };

  const filteredActions = data?.actions.filter((action) => {
    if (selectedQuadrant === 'all') return true;
    return action.quadrant === selectedQuadrant;
  }) || [];

  const getActionsByQuadrant = (quadrant: PriorityQuadrant) => {
    return data?.actions.filter((action) => action.quadrant === quadrant) || [];
  };

  const openActionDetails = (action: PrioritizedAction) => {
    setSelectedAction(action);
    setShowDetailsModal(true);
  };

  if (isLoading) {
    return (
      <Card className="p-12 flex items-center justify-center bg-white shadow-sm border border-slate-200/70">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="animate-spin" size={20} />
          <span>Analizando tus recursos y priorizando acciones...</span>
        </div>
      </Card>
    );
  }

  if (hasError || !data) {
    return (
      <Card className="p-8 bg-white shadow-sm border border-red-200">
        <div className="flex items-center justify-between">
          <p className="text-sm text-red-600">Ocurrió un problema al cargar los datos.</p>
          <Button variant="ghost" size="sm" onClick={loadData}>
            <RefreshCw size={16} className="mr-2" />
            Reintentar
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con controles */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Priorización IA</h2>
          <p className="text-sm text-slate-600 mt-1">
            Matriz Impacto/Esfuerzo basada en tus recursos disponibles
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={period}
            onChange={(e) => {
              const newPeriod = e.target.value as '7d' | '30d' | '90d';
              onPeriodChange?.(newPeriod);
            }}
            className="min-w-[120px]"
          >
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="90d">Últimos 90 días</option>
          </Select>
          <div className="flex items-center gap-1 border border-slate-200 rounded-lg p-1">
            <Button
              variant={viewMode === 'matrix' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('matrix')}
            >
              <Grid3x3 size={16} />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List size={16} />
            </Button>
          </div>
          <Button variant="ghost" size="sm" onClick={loadData}>
            <RefreshCw size={16} />
          </Button>
        </div>
      </div>

      {/* Recursos disponibles */}
      <Card className="p-5 bg-slate-50 border border-slate-200">
        <h3 className="font-semibold text-slate-900 mb-4">Recursos disponibles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.resources.map((resource) => {
            const ResourceIcon = resourceTypeIcons[resource.type] || Wrench;
            return (
              <div key={resource.id} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200">
                <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                  <ResourceIcon size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-600">{resource.name}</p>
                  <p className="text-lg font-bold text-slate-900">
                    {resource.available} {resource.unit}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{resource.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Resumen de cuadrantes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(['quick-wins', 'major-projects', 'fill-ins', 'thankless-tasks'] as PriorityQuadrant[]).map(
          (quadrant) => {
            const count = getActionsByQuadrant(quadrant).length;
            return (
              <Card
                key={quadrant}
                className={`p-4 border-2 cursor-pointer transition-all hover:shadow-md ${quadrantColors[quadrant]}`}
                onClick={() => setSelectedQuadrant(selectedQuadrant === quadrant ? 'all' : quadrant)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{quadrantLabels[quadrant]}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {count}
                  </Badge>
                </div>
                <p className="text-xs opacity-75">{quadrantDescriptions[quadrant]}</p>
              </Card>
            );
          }
        )}
      </div>

      {/* Vista de matriz */}
      {viewMode === 'matrix' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Matriz Impacto/Esfuerzo</h3>
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-slate-500" />
              <span className="text-sm text-slate-600">Filtrar:</span>
              <Button
                variant={selectedQuadrant === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedQuadrant('all')}
              >
                Todas
              </Button>
              {(['quick-wins', 'major-projects', 'fill-ins', 'thankless-tasks'] as PriorityQuadrant[]).map(
                (quadrant) => (
                  <Button
                    key={quadrant}
                    variant={selectedQuadrant === quadrant ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedQuadrant(quadrant)}
                  >
                    {quadrantLabels[quadrant]}
                  </Button>
                )
              )}
            </div>
          </div>

          {/* Matriz visual */}
          <Card className="p-6 bg-white border border-slate-200">
            <div className="grid grid-cols-3 gap-4">
              {/* Header */}
              <div></div>
              <div className="text-center font-semibold text-slate-600">Bajo Esfuerzo</div>
              <div className="text-center font-semibold text-slate-600">Alto Esfuerzo</div>

              {/* Alto Impacto */}
              <div className="flex items-center font-semibold text-slate-600">Alto Impacto</div>
              <div className={`p-4 rounded-lg border-2 min-h-[120px] ${quadrantColors['quick-wins']}`}>
                <p className="text-xs font-semibold mb-2">{quadrantLabels['quick-wins']}</p>
                {getActionsByQuadrant('quick-wins').map((action) => (
                  <div
                    key={action.id}
                    className="mb-2 p-2 bg-white rounded border border-slate-200 cursor-pointer hover:shadow-sm transition-all"
                    onClick={() => openActionDetails(action)}
                  >
                    <p className="text-xs font-medium text-slate-900 truncate">{action.title}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {action.priorityScore}
                      </Badge>
                      {action.canExecute && (
                        <CheckCircle2 size={12} className="text-emerald-600" />
                      )}
                      {!action.canExecute && <XCircle size={12} className="text-red-600" />}
                    </div>
                  </div>
                ))}
              </div>
              <div className={`p-4 rounded-lg border-2 min-h-[120px] ${quadrantColors['major-projects']}`}>
                <p className="text-xs font-semibold mb-2">{quadrantLabels['major-projects']}</p>
                {getActionsByQuadrant('major-projects').map((action) => (
                  <div
                    key={action.id}
                    className="mb-2 p-2 bg-white rounded border border-slate-200 cursor-pointer hover:shadow-sm transition-all"
                    onClick={() => openActionDetails(action)}
                  >
                    <p className="text-xs font-medium text-slate-900 truncate">{action.title}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {action.priorityScore}
                      </Badge>
                      {action.canExecute && (
                        <CheckCircle2 size={12} className="text-emerald-600" />
                      )}
                      {!action.canExecute && <XCircle size={12} className="text-red-600" />}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bajo Impacto */}
              <div className="flex items-center font-semibold text-slate-600">Bajo Impacto</div>
              <div className={`p-4 rounded-lg border-2 min-h-[120px] ${quadrantColors['fill-ins']}`}>
                <p className="text-xs font-semibold mb-2">{quadrantLabels['fill-ins']}</p>
                {getActionsByQuadrant('fill-ins').map((action) => (
                  <div
                    key={action.id}
                    className="mb-2 p-2 bg-white rounded border border-slate-200 cursor-pointer hover:shadow-sm transition-all"
                    onClick={() => openActionDetails(action)}
                  >
                    <p className="text-xs font-medium text-slate-900 truncate">{action.title}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {action.priorityScore}
                      </Badge>
                      {action.canExecute && (
                        <CheckCircle2 size={12} className="text-emerald-600" />
                      )}
                      {!action.canExecute && <XCircle size={12} className="text-red-600" />}
                    </div>
                  </div>
                ))}
              </div>
              <div className={`p-4 rounded-lg border-2 min-h-[120px] ${quadrantColors['thankless-tasks']}`}>
                <p className="text-xs font-semibold mb-2">{quadrantLabels['thankless-tasks']}</p>
                {getActionsByQuadrant('thankless-tasks').map((action) => (
                  <div
                    key={action.id}
                    className="mb-2 p-2 bg-white rounded border border-slate-200 cursor-pointer hover:shadow-sm transition-all"
                    onClick={() => openActionDetails(action)}
                  >
                    <p className="text-xs font-medium text-slate-900 truncate">{action.title}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {action.priorityScore}
                      </Badge>
                      {action.canExecute && (
                        <CheckCircle2 size={12} className="text-emerald-600" />
                      )}
                      {!action.canExecute && <XCircle size={12} className="text-red-600" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Vista de lista */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Acciones priorizadas</h3>
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-slate-500" />
              <span className="text-sm text-slate-600">Filtrar:</span>
              <Button
                variant={selectedQuadrant === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedQuadrant('all')}
              >
                Todas
              </Button>
              {(['quick-wins', 'major-projects', 'fill-ins', 'thankless-tasks'] as PriorityQuadrant[]).map(
                (quadrant) => (
                  <Button
                    key={quadrant}
                    variant={selectedQuadrant === quadrant ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedQuadrant(quadrant)}
                  >
                    {quadrantLabels[quadrant]}
                  </Button>
                )
              )}
            </div>
          </div>

          {filteredActions
            .sort((a, b) => b.priorityScore - a.priorityScore)
            .map((action) => {
              const CategoryIcon = categoryIcons[action.category] || BookOpen;
              const categoryColorClass = categoryColors[action.category];
              const quadrantColorClass = quadrantColors[action.quadrant];

              return (
                <Card
                  key={action.id}
                  className={`p-5 bg-white border-2 cursor-pointer hover:shadow-md transition-all ${quadrantColorClass}`}
                  onClick={() => openActionDetails(action)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`p-2 rounded-lg ${categoryColorClass}`}>
                          <CategoryIcon size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <h3 className="font-semibold text-slate-900">{action.title}</h3>
                            <Badge variant="outline" className={categoryColorClass}>
                              {action.category}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              Score: {action.priorityScore}
                            </Badge>
                            {action.canExecute ? (
                              <Badge variant="success" className="text-xs">
                                <CheckCircle2 size={12} className="mr-1" />
                                Ejecutable
                              </Badge>
                            ) : (
                              <Badge variant="error" className="text-xs">
                                <XCircle size={12} className="mr-1" />
                                Bloqueado
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-700 mb-3">{action.description}</p>
                          <div className="flex items-center gap-4 flex-wrap">
                            <div className="flex items-center gap-2">
                              <Target size={14} className="text-slate-400" />
                              <span className="text-xs text-slate-600">
                                Impacto: <strong>{impactLabels[action.impact]}</strong>
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock size={14} className="text-slate-400" />
                              <span className="text-xs text-slate-600">
                                Esfuerzo: <strong>{effortLabels[action.effort]}</strong>
                              </span>
                            </div>
                            {action.estimatedTime && (
                              <div className="flex items-center gap-2">
                                <Clock size={14} className="text-slate-400" />
                                <span className="text-xs text-slate-600">
                                  Tiempo: <strong>{formatHours(action.estimatedTime)}</strong>
                                </span>
                              </div>
                            )}
                            {action.estimatedCost && (
                              <div className="flex items-center gap-2">
                                <DollarSign size={14} className="text-slate-400" />
                                <span className="text-xs text-slate-600">
                                  Costo: <strong>{formatCurrency(action.estimatedCost)}</strong>
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye size={16} />
                    </Button>
                  </div>
                </Card>
              );
            })}
        </div>
      )}

      {/* Modal de detalles */}
      {selectedAction && (
        <Modal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedAction(null);
          }}
          title={selectedAction.title}
          size="lg"
          footer={
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedAction(null);
                }}
              >
                Cerrar
              </Button>
              {selectedAction.canExecute && (
                <Button variant="default">
                  Ejecutar acción
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              )}
            </div>
          }
        >
          <div className="space-y-6">
            <div>
              <p className="text-sm text-slate-700">{selectedAction.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-1">Impacto</p>
                <Badge variant="secondary">{impactLabels[selectedAction.impact]}</Badge>
                <p className="text-xs text-slate-600 mt-2">{selectedAction.estimatedImpact}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-1">Esfuerzo</p>
                <Badge variant="secondary">{effortLabels[selectedAction.effort]}</Badge>
                <p className="text-xs text-slate-600 mt-2">{selectedAction.estimatedEffort}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-600 mb-2">Razón de priorización</p>
              <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">{selectedAction.reasoning}</p>
            </div>

            {selectedAction.requiredResources.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-600 mb-2">Recursos requeridos</p>
                <div className="space-y-2">
                  {selectedAction.requiredResources.map((resource) => {
                    const ResourceIcon = resourceTypeIcons[resource.type] || Wrench;
                    return (
                      <div
                        key={resource.id}
                        className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200"
                      >
                        <ResourceIcon size={16} className="text-slate-400" />
                        <div className="flex-1">
                          <p className="text-xs font-medium text-slate-900">{resource.name}</p>
                          <p className="text-xs text-slate-600">
                            {resource.available} {resource.unit}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedAction.blocker && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs font-semibold text-red-900 mb-1">Bloqueador</p>
                <p className="text-sm text-red-700">{selectedAction.blocker}</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AIPrioritizationSection;
