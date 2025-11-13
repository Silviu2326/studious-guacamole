import React, { useState, useEffect } from 'react';
import { Modal, Button, Badge, Table, Input, Select, Textarea } from '../../../components/componentsreutilizables';
import { Sparkles, Loader2, Target, Calendar, User, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { Objective, ActionPlan } from '../types';
import { generateIntelligentActionPlan, syncActionPlanWithERP } from '../api/actionPlanGenerator';
import { ActionPlanSimulationModal } from './ActionPlanSimulationModal';

interface IntelligentActionPlanGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedObjectives: Objective[];
  role: 'entrenador' | 'gimnasio';
  onPlanCreated: () => void;
}

interface ActionPlanStep {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  assignedTo?: string;
  assignedToName?: string;
  estimatedHours?: number;
  dependencies?: string[]; // IDs de pasos de los que depende
  erpTaskId?: string; // ID de la tarea en el ERP
  erpSyncStatus?: 'pending' | 'synced' | 'error';
}

interface GeneratedActionPlan {
  id: string;
  title: string;
  description: string;
  steps: ActionPlanStep[];
  estimatedCompletionDate: string;
  totalEstimatedHours: number;
  alignedWithERP: boolean;
  erpProjectId?: string;
}

export const IntelligentActionPlanGenerator: React.FC<IntelligentActionPlanGeneratorProps> = ({
  isOpen,
  onClose,
  selectedObjectives,
  role,
  onPlanCreated,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedActionPlan | null>(null);
  const [planTitle, setPlanTitle] = useState('');
  const [planDescription, setPlanDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [erpSyncEnabled, setErpSyncEnabled] = useState(true);
  const [showSimulationModal, setShowSimulationModal] = useState(false);
  const [pendingActionPlan, setPendingActionPlan] = useState<ActionPlan | null>(null);

  useEffect(() => {
    if (selectedObjectives.length > 0 && !planTitle) {
      const defaultTitle = `Plan de Acción: ${selectedObjectives.map(obj => obj.title).join(', ')}`;
      setPlanTitle(defaultTitle);
    }
  }, [selectedObjectives, planTitle]);

  const handleGenerate = async () => {
    if (selectedObjectives.length === 0) {
      alert('Por favor, selecciona al menos un objetivo');
      return;
    }

    setIsGenerating(true);
    try {
      const plan = await generateIntelligentActionPlan(selectedObjectives, role, erpSyncEnabled);
      setGeneratedPlan(plan);
      if (!planTitle) {
        setPlanTitle(plan.title);
      }
      if (!planDescription) {
        setPlanDescription(plan.description);
      }
    } catch (error) {
      console.error('Error generating action plan:', error);
      alert('Error al generar el plan de acción. Por favor, intenta de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedPlan || !planTitle.trim()) {
      alert('Por favor, completa el título del plan');
      return;
    }

    // User Story 2: Crear el plan de acción en estado 'draft' primero
    const actionPlan: ActionPlan = {
      id: generatedPlan.id,
      title: planTitle,
      description: planDescription || generatedPlan.description,
      steps: generatedPlan.steps.map(step => ({
        id: step.id,
        title: step.title,
        description: step.description,
        dueDate: step.dueDate,
        completed: false,
        priority: step.priority,
        assignedTo: step.assignedTo,
        assignedToName: step.assignedToName,
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'user', // En producción usar el ID del usuario actual
      status: 'draft', // Cambiar a 'draft' para requerir aprobación
    };

    // User Story 2: Mostrar simulación antes de aprobar
    setPendingActionPlan(actionPlan);
    setShowSimulationModal(true);
  };

  // User Story 2: Handler para aprobar el plan después de ver la simulación
  const handleApprovePlan = async () => {
    if (!pendingActionPlan) return;

    setIsSaving(true);
    try {
      // Sincronizar con ERP si está habilitado
      if (erpSyncEnabled && generatedPlan) {
        await syncActionPlanWithERP(generatedPlan, selectedObjectives);
      }

      // Cambiar estado a 'active' al aprobar
      const approvedPlan: ActionPlan = {
        ...pendingActionPlan,
        status: 'active',
        updatedAt: new Date().toISOString(),
      };

      // Guardar en localStorage (simulación)
      const savedPlans = localStorage.getItem('action-plans') || '[]';
      const plans: ActionPlan[] = JSON.parse(savedPlans);
      plans.push(approvedPlan);
      localStorage.setItem('action-plans', JSON.stringify(plans));

      // Vincular el plan a los objetivos seleccionados
      const savedObjectives = localStorage.getItem('objectives-data') || '[]';
      const objectives: Objective[] = JSON.parse(savedObjectives);
      
      selectedObjectives.forEach(selectedObj => {
        const objective = objectives.find(obj => obj.id === selectedObj.id);
        if (objective) {
          if (!objective.links) {
            objective.links = {
              linkedKPIs: [],
              linkedTasks: [],
              actionPlans: [],
            };
          }
          objective.links.actionPlans.push(approvedPlan);
        }
      });
      
      localStorage.setItem('objectives-data', JSON.stringify(objectives));

      setShowSimulationModal(false);
      setPendingActionPlan(null);
      onPlanCreated();
      handleReset();
      onClose();
    } catch (error) {
      console.error('Error saving action plan:', error);
      alert('Error al guardar el plan de acción. Por favor, intenta de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  // User Story 2: Handler para cancelar la aprobación
  const handleCancelApproval = () => {
    setShowSimulationModal(false);
    setPendingActionPlan(null);
  };

  const handleReset = () => {
    setGeneratedPlan(null);
    setPlanTitle('');
    setPlanDescription('');
    setIsGenerating(false);
    setIsSaving(false);
  };

  const handleClose = () => {
    if (!isGenerating && !isSaving) {
      handleReset();
      onClose();
    }
  };

  const handleStepEdit = (stepId: string, field: keyof ActionPlanStep, value: any) => {
    if (!generatedPlan) return;

    const updatedSteps = generatedPlan.steps.map(step =>
      step.id === stepId ? { ...step, [field]: value } : step
    );

    setGeneratedPlan({
      ...generatedPlan,
      steps: updatedSteps,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Generar Plan de Acción Inteligente"
      size="xl"
      footer={
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleClose} disabled={isGenerating || isSaving}>
            {generatedPlan ? 'Cancelar' : 'Cerrar'}
          </Button>
          {!generatedPlan && (
            <Button
              variant="primary"
              onClick={handleGenerate}
              disabled={isGenerating || selectedObjectives.length === 0}
              loading={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Sparkles size={18} className="mr-2" />
                  Generar Plan
                </>
              )}
            </Button>
          )}
          {generatedPlan && (
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={isSaving || !planTitle.trim()}
              loading={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} className="mr-2" />
                  Guardar Plan
                </>
              )}
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        {!generatedPlan ? (
          <>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-purple-900 mb-1">
                    Plan de Acción Inteligente
                  </h4>
                  <p className="text-xs text-purple-700">
                    El sistema generará un plan de acción personalizado basado en los objetivos seleccionados,
                    proponiendo pasos (tareas, responsables, fechas) alineados con el ERP.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Objetivos Seleccionados ({selectedObjectives.length})
              </h3>
              <div className="space-y-2">
                {selectedObjectives.map((objective) => (
                  <div
                    key={objective.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <Target className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{objective.title}</div>
                      <div className="text-xs text-gray-600">
                        Progreso: {objective.progress.toFixed(0)}% • 
                        Vence: {new Date(objective.deadline).toLocaleDateString('es-ES')}
                      </div>
                    </div>
                    <Badge
                      variant={
                        objective.status === 'achieved' ? 'green' :
                        objective.status === 'at_risk' ? 'yellow' : 'blue'
                      }
                    >
                      {objective.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={erpSyncEnabled}
                  onChange={(e) => setErpSyncEnabled(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">
                  Sincronizar con ERP (crear tareas, asignar responsables, establecer fechas)
                </span>
              </label>
            </div>
          </>
        ) : (
          <>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-green-900 mb-1">
                    Plan Generado Exitosamente
                  </h4>
                  <p className="text-xs text-green-700">
                    Revisa y ajusta el plan antes de guardarlo. Las tareas se sincronizarán con el ERP.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título del Plan *
              </label>
              <Input
                value={planTitle}
                onChange={(e) => setPlanTitle(e.target.value)}
                placeholder="Ej: Plan de Acción Q1 2024"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <Textarea
                value={planDescription}
                onChange={(e) => setPlanDescription(e.target.value)}
                placeholder="Descripción del plan de acción..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="text-xs text-gray-600 mb-1">Pasos Totales</div>
                <div className="text-2xl font-bold text-gray-900">{generatedPlan.steps.length}</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Horas Estimadas</div>
                <div className="text-2xl font-bold text-gray-900">
                  {generatedPlan.totalEstimatedHours}h
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Fecha Estimada</div>
                <div className="text-lg font-semibold text-gray-900">
                  {new Date(generatedPlan.estimatedCompletionDate).toLocaleDateString('es-ES')}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Pasos del Plan ({generatedPlan.steps.length})
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {generatedPlan.steps.map((step, index) => (
                  <div
                    key={step.id}
                    className="p-4 border border-gray-200 rounded-lg bg-white"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-gray-500">
                            Paso {index + 1}
                          </span>
                          <Badge
                            variant={
                              step.priority === 'high' ? 'red' :
                              step.priority === 'medium' ? 'yellow' : 'blue'
                            }
                          >
                            {step.priority === 'high' ? 'Alta' :
                             step.priority === 'medium' ? 'Media' : 'Baja'}
                          </Badge>
                          {step.erpSyncStatus === 'synced' && (
                            <Badge variant="green">Sincronizado con ERP</Badge>
                          )}
                        </div>
                        <Input
                          value={step.title}
                          onChange={(e) => handleStepEdit(step.id, 'title', e.target.value)}
                          className="mb-2"
                          placeholder="Título del paso"
                        />
                        <Textarea
                          value={step.description}
                          onChange={(e) => handleStepEdit(step.id, 'description', e.target.value)}
                          rows={2}
                          className="mb-2"
                          placeholder="Descripción del paso"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          Fecha Límite
                        </label>
                        <Input
                          type="date"
                          value={step.dueDate}
                          onChange={(e) => handleStepEdit(step.id, 'dueDate', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          <User className="w-3 h-3 inline mr-1" />
                          Responsable
                        </label>
                        <Input
                          value={step.assignedToName || ''}
                          onChange={(e) => handleStepEdit(step.id, 'assignedToName', e.target.value)}
                          placeholder="Nombre del responsable"
                        />
                      </div>
                    </div>
                    {step.estimatedHours && (
                      <div className="mt-2 text-xs text-gray-600">
                        Horas estimadas: {step.estimatedHours}h
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* User Story 2: Modal de simulación antes de aprobar */}
      {pendingActionPlan && (
        <ActionPlanSimulationModal
          isOpen={showSimulationModal}
          onClose={handleCancelApproval}
          actionPlan={pendingActionPlan}
          objectives={selectedObjectives}
          onApprove={handleApprovePlan}
          onCancel={handleCancelApproval}
        />
      )}
    </Modal>
  );
};

