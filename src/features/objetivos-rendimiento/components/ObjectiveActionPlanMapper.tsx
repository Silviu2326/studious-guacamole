import React, { useState, useEffect } from 'react';
import { Objective, ActionPlan } from '../types';
import { getObjectives, addActionPlanToObjective, removeActionPlanFromObjective, updateActionPlan } from '../api/objectives';
import { Card, Button, Modal, Badge } from '../../../components/componentsreutilizables';
import { Target, MapPin, CheckCircle2, Clock, AlertCircle, X, Plus, Link2, Unlink, Loader2, FileText, User, Calendar } from 'lucide-react';

interface ObjectiveActionPlanMapperProps {
  role: 'entrenador' | 'gimnasio';
  onClose?: () => void;
}

/**
 * Componente para mapear objetivos a planes de acción generados automáticamente
 * User Story: Como manager quiero mapear objetivos a los planes de acción generados automáticamente,
 * para ver qué tareas están contribuyendo a cada meta.
 */
export const ObjectiveActionPlanMapper: React.FC<ObjectiveActionPlanMapperProps> = ({ role, onClose }) => {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedObjective, setSelectedObjective] = useState<Objective | null>(null);
  const [availableActionPlans, setAvailableActionPlans] = useState<ActionPlan[]>([]);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linking, setLinking] = useState(false);

  useEffect(() => {
    loadData();
  }, [role]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Cargar objetivos
      const objectivesData = await getObjectives({}, role);
      setObjectives(objectivesData.filter(obj => obj.status === 'in_progress' || obj.status === 'at_risk'));

      // Cargar planes de acción disponibles (simulados - en producción vendrían de una API)
      await loadAvailableActionPlans();
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableActionPlans = async () => {
    // Simular carga de planes de acción generados automáticamente
    // En producción, esto vendría de una API que devuelve planes generados por IA
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const mockActionPlans: ActionPlan[] = [
      {
        id: 'ap_1',
        title: 'Plan de Acción: Aumentar Facturación',
        description: 'Plan generado automáticamente para aumentar la facturación mensual',
        steps: [
          {
            id: 'step_1',
            title: 'Identificar clientes de alto valor',
            description: 'Analizar base de clientes y segmentar por valor',
            dueDate: '2024-12-01',
            completed: false,
            priority: 'high',
            assignedTo: 'user-1',
            assignedToName: 'Juan Pérez',
          },
          {
            id: 'step_2',
            title: 'Lanzar campaña de upselling',
            description: 'Crear ofertas especiales para clientes existentes',
            dueDate: '2024-12-05',
            completed: false,
            priority: 'medium',
            assignedTo: 'user-2',
            assignedToName: 'María García',
          },
          {
            id: 'step_3',
            title: 'Optimizar precios de servicios',
            description: 'Revisar y ajustar precios según análisis de mercado',
            dueDate: '2024-12-10',
            completed: false,
            priority: 'high',
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'ai-system',
        status: 'active',
      },
      {
        id: 'ap_2',
        title: 'Plan de Acción: Mejorar Adherencia',
        description: 'Estrategias para aumentar la adherencia de clientes',
        steps: [
          {
            id: 'step_4',
            title: 'Implementar sistema de recordatorios',
            description: 'Configurar notificaciones automáticas para sesiones',
            dueDate: '2024-12-03',
            completed: false,
            priority: 'high',
          },
          {
            id: 'step_5',
            title: 'Crear programa de incentivos',
            description: 'Desarrollar sistema de recompensas por asistencia',
            dueDate: '2024-12-08',
            completed: false,
            priority: 'medium',
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'ai-system',
        status: 'active',
      },
    ];

    setAvailableActionPlans(mockActionPlans);
  };

  const handleLinkActionPlan = async (actionPlan: ActionPlan) => {
    if (!selectedObjective) return;

    setLinking(true);
    try {
      await addActionPlanToObjective(selectedObjective.id, {
        title: actionPlan.title,
        description: actionPlan.description,
        steps: actionPlan.steps,
        createdBy: actionPlan.createdBy,
        status: actionPlan.status,
      });
      await loadData();
      setShowLinkModal(false);
      setSelectedObjective(null);
    } catch (error) {
      console.error('Error linking action plan:', error);
      alert('Error al vincular el plan de acción');
    } finally {
      setLinking(false);
    }
  };

  const handleUnlinkActionPlan = async (actionPlanId: string) => {
    if (!selectedObjective) return;

    if (!window.confirm('¿Estás seguro de desvincular este plan de acción?')) {
      return;
    }

    try {
      await removeActionPlanFromObjective(selectedObjective.id, actionPlanId);
      await loadData();
      setSelectedObjective(null);
    } catch (error) {
      console.error('Error unlinking action plan:', error);
      alert('Error al desvincular el plan de acción');
    }
  };

  const getTaskContribution = (objective: Objective, actionPlan: ActionPlan) => {
    // Calcular cuántas tareas están completadas y su contribución al objetivo
    const totalSteps = actionPlan.steps.length;
    const completedSteps = actionPlan.steps.filter(step => step.completed).length;
    const completionRate = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
    
    // Estimar contribución al progreso del objetivo (simplificado)
    const estimatedContribution = Math.min(completionRate * 0.3, 30); // Máximo 30% de contribución por plan
    
    return {
      totalSteps,
      completedSteps,
      completionRate,
      estimatedContribution,
    };
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando objetivos y planes de acción...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-blue-600" />
            Mapeo de Objetivos a Planes de Acción
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Visualiza qué tareas de los planes de acción están contribuyendo a cada objetivo
          </p>
        </div>
        {onClose && (
          <Button variant="secondary" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Cerrar
          </Button>
        )}
      </div>

      {/* Lista de Objetivos con sus Planes de Acción */}
      <div className="space-y-4">
        {objectives.map((objective) => {
          const actionPlans = objective.links?.actionPlans || [];
          const hasActionPlans = actionPlans.length > 0;

          return (
            <Card key={objective.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">{objective.title}</h3>
                    <Badge variant={objective.status === 'in_progress' ? 'blue' : 'yellow'}>
                      {objective.status === 'in_progress' ? 'En Progreso' : 'En Riesgo'}
                    </Badge>
                  </div>
                  {objective.description && (
                    <p className="text-sm text-gray-600 mb-2">{objective.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>
                      Progreso: <strong className="text-gray-900">{objective.progress.toFixed(0)}%</strong>
                    </span>
                    <span>
                      {objective.currentValue} / {objective.targetValue} {objective.unit}
                    </span>
                    {objective.responsibleName && (
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {objective.responsibleName}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSelectedObjective(objective);
                    setShowLinkModal(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Vincular Plan
                </Button>
              </div>

              {/* Planes de Acción Vinculados */}
              {hasActionPlans ? (
                <div className="space-y-3 mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Link2 className="w-4 h-4" />
                    Planes de Acción Vinculados ({actionPlans.length})
                  </h4>
                  {actionPlans.map((actionPlan) => {
                    const contribution = getTaskContribution(objective, actionPlan);
                    return (
                      <div
                        key={actionPlan.id}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <FileText className="w-4 h-4 text-gray-500" />
                              <h5 className="font-semibold text-gray-900">{actionPlan.title}</h5>
                              <Badge
                                variant={
                                  actionPlan.status === 'active'
                                    ? 'green'
                                    : actionPlan.status === 'completed'
                                    ? 'blue'
                                    : 'gray'
                                }
                              >
                                {actionPlan.status === 'active'
                                  ? 'Activo'
                                  : actionPlan.status === 'completed'
                                  ? 'Completado'
                                  : 'Borrador'}
                              </Badge>
                            </div>
                            {actionPlan.description && (
                              <p className="text-sm text-gray-600 mb-2">{actionPlan.description}</p>
                            )}
                          </div>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleUnlinkActionPlan(actionPlan.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Unlink className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Estadísticas de Contribución */}
                        <div className="grid grid-cols-3 gap-3 mb-3 p-3 bg-white rounded border border-gray-200">
                          <div>
                            <p className="text-xs text-gray-500">Tareas Totales</p>
                            <p className="text-lg font-bold text-gray-900">{contribution.totalSteps}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Completadas</p>
                            <p className="text-lg font-bold text-green-600">
                              {contribution.completedSteps} ({contribution.completionRate.toFixed(0)}%)
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Contribución Estimada</p>
                            <p className="text-lg font-bold text-blue-600">
                              {contribution.estimatedContribution.toFixed(1)}%
                            </p>
                          </div>
                        </div>

                        {/* Lista de Tareas */}
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-gray-700 mb-2">Tareas del Plan:</p>
                          {actionPlan.steps.map((step) => (
                            <div
                              key={step.id}
                              className={`flex items-start gap-3 p-2 rounded border ${
                                step.completed
                                  ? 'bg-green-50 border-green-200'
                                  : 'bg-white border-gray-200'
                              }`}
                            >
                              <div className="mt-0.5">
                                {step.completed ? (
                                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Clock className="w-4 h-4 text-gray-400" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <p
                                    className={`text-sm font-medium ${
                                      step.completed ? 'text-green-900 line-through' : 'text-gray-900'
                                    }`}
                                  >
                                    {step.title}
                                  </p>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${getPriorityColor(step.priority)}`}
                                  >
                                    {step.priority === 'high'
                                      ? 'Alta'
                                      : step.priority === 'medium'
                                      ? 'Media'
                                      : 'Baja'}
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-600 mb-1">{step.description}</p>
                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                  {step.dueDate && (
                                    <span className="flex items-center gap-1">
                                      <Calendar className="w-3 h-3" />
                                      {new Date(step.dueDate).toLocaleDateString('es-ES')}
                                    </span>
                                  )}
                                  {step.assignedToName && (
                                    <span className="flex items-center gap-1">
                                      <User className="w-3 h-3" />
                                      {step.assignedToName}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t border-gray-200 text-center py-6">
                  <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    No hay planes de acción vinculados a este objetivo
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-3"
                    onClick={() => {
                      setSelectedObjective(objective);
                      setShowLinkModal(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Vincular Plan de Acción
                  </Button>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Modal para Vincular Plan de Acción */}
      {showLinkModal && selectedObjective && (
        <Modal
          isOpen={showLinkModal}
          onClose={() => {
            setShowLinkModal(false);
            setSelectedObjective(null);
          }}
          title={`Vincular Plan de Acción a: ${selectedObjective.title}`}
          size="lg"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Selecciona un plan de acción generado automáticamente para vincularlo a este objetivo.
            </p>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {availableActionPlans
                .filter(
                  plan =>
                    !selectedObjective.links?.actionPlans.some(
                      linkedPlan => linkedPlan.id === plan.id
                    )
                )
                .map((actionPlan) => (
                  <Card
                    key={actionPlan.id}
                    className="p-4 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                    onClick={() => handleLinkActionPlan(actionPlan)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900 mb-1">{actionPlan.title}</h5>
                        {actionPlan.description && (
                          <p className="text-sm text-gray-600 mb-2">{actionPlan.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{actionPlan.steps.length} tareas</span>
                          <span>
                            {actionPlan.steps.filter(s => s.completed).length} completadas
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLinkActionPlan(actionPlan);
                        }}
                        disabled={linking}
                        loading={linking}
                      >
                        <Link2 className="w-4 h-4 mr-2" />
                        Vincular
                      </Button>
                    </div>
                  </Card>
                ))}

              {availableActionPlans.filter(
                plan =>
                  !selectedObjective.links?.actionPlans.some(
                    linkedPlan => linkedPlan.id === plan.id
                  )
              ).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No hay planes de acción disponibles para vincular</p>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

