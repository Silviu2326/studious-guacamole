import React, { useState } from 'react';
import { Alert, AlertConversionType, Objective } from '../types';
import { convertAlertToAdjustment, convertAlertToTask, convertAlertToActionPlan } from '../api/alerts';
import { getObjectives } from '../api/objectives';
import { useAuth } from '../../../context/AuthContext';
import { Modal, Button, Select, Input, Textarea } from '../../../components/componentsreutilizables';
import { Target, CheckSquare, FileText, Loader2, AlertCircle } from 'lucide-react';

interface AlertConversionModalProps {
  isOpen: boolean;
  onClose: () => void;
  alert: Alert | null;
  onConversionComplete: () => void;
}

export const AlertConversionModal: React.FC<AlertConversionModalProps> = ({
  isOpen,
  onClose,
  alert,
  onConversionComplete,
}) => {
  const { user } = useAuth();
  const role = user?.role === 'entrenador' ? 'entrenador' : 'gimnasio';
  const [conversionType, setConversionType] = useState<AlertConversionType>('task');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [objective, setObjective] = useState<Objective | null>(null);

  // Form data for adjustment
  const [adjustmentData, setAdjustmentData] = useState({
    type: 'target_value' as 'target_value' | 'deadline' | 'metric' | 'responsible' | 'other',
    newValue: '',
    reason: '',
  });

  // Form data for task
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    assignedTo: '',
    assignedToName: '',
    dueDate: '',
  });

  // Form data for action plan
  const [actionPlanData, setActionPlanData] = useState({
    title: '',
    description: '',
    steps: [{ id: '1', title: '', description: '', completed: false, priority: 'medium' as 'high' | 'medium' | 'low' }],
  });

  // Load objective when alert changes
  React.useEffect(() => {
    if (alert?.objectiveId) {
      loadObjective();
    }
  }, [alert]);

  const loadObjective = async () => {
    if (!alert?.objectiveId) return;
    try {
      const objectives = await getObjectives({}, role);
      const obj = objectives.find(o => o.id === alert.objectiveId);
      setObjective(obj || null);
      
      // Pre-fill form data based on alert
      if (obj) {
        setTaskData(prev => ({
          ...prev,
          title: `Acción para: ${alert.title}`,
          description: alert.message,
        }));
        setActionPlanData(prev => ({
          ...prev,
          title: `Plan de acción: ${alert.title}`,
          description: alert.message,
        }));
        setAdjustmentData(prev => ({
          ...prev,
          reason: `Ajuste generado desde alerta: ${alert.title}`,
        }));
      }
    } catch (error) {
      console.error('Error loading objective:', error);
    }
  };

  if (!alert || !objective) return null;

  const handleConvert = async () => {
    setError(null);
    setLoading(true);

    try {
      switch (conversionType) {
        case 'adjustment':
          if (!adjustmentData.reason.trim()) {
            setError('Por favor, ingresa una razón para el ajuste');
            setLoading(false);
            return;
          }
          if (!adjustmentData.newValue && adjustmentData.type !== 'other') {
            setError('Por favor, ingresa un nuevo valor');
            setLoading(false);
            return;
          }
          await convertAlertToAdjustment(alert.id, {
            type: adjustmentData.type,
            newValue: adjustmentData.newValue,
            reason: adjustmentData.reason,
          });
          break;

        case 'task':
          if (!taskData.title.trim()) {
            setError('Por favor, ingresa un título para la tarea');
            setLoading(false);
            return;
          }
          await convertAlertToTask(alert.id, {
            title: taskData.title,
            description: taskData.description,
            priority: taskData.priority,
            assignedTo: taskData.assignedTo,
            assignedToName: taskData.assignedToName,
            dueDate: taskData.dueDate,
          });
          break;

        case 'action_plan':
          if (!actionPlanData.title.trim()) {
            setError('Por favor, ingresa un título para el plan de acción');
            setLoading(false);
            return;
          }
          await convertAlertToActionPlan(alert.id, {
            title: actionPlanData.title,
            description: actionPlanData.description,
            steps: actionPlanData.steps.filter(s => s.title.trim() !== ''),
          });
          break;
      }

      onConversionComplete();
      onClose();
      resetForms();
    } catch (error: any) {
      setError(error.message || 'Error al convertir la alerta');
    } finally {
      setLoading(false);
    }
  };

  const resetForms = () => {
    setAdjustmentData({
      type: 'target_value',
      newValue: '',
      reason: '',
    });
    setTaskData({
      title: '',
      description: '',
      priority: 'medium',
      assignedTo: '',
      assignedToName: '',
      dueDate: '',
    });
    setActionPlanData({
      title: '',
      description: '',
      steps: [{ id: '1', title: '', description: '', completed: false, priority: 'medium' }],
    });
    setError(null);
  };

  const getCurrentValueLabel = () => {
    if (!objective) return '';
    switch (adjustmentData.type) {
      case 'target_value':
        return `Valor actual: ${objective.targetValue} ${objective.unit}`;
      case 'deadline':
        return `Fecha actual: ${new Date(objective.deadline).toLocaleDateString('es-ES')}`;
      case 'metric':
        return `Métrica actual: ${objective.metric}`;
      case 'responsible':
        return `Responsable actual: ${objective.responsibleName || objective.responsible || 'No asignado'}`;
      default:
        return '';
    }
  };

  const addActionPlanStep = () => {
    setActionPlanData(prev => ({
      ...prev,
      steps: [
        ...prev.steps,
        {
          id: Date.now().toString(),
          title: '',
          description: '',
          completed: false,
          priority: 'medium',
        },
      ],
    }));
  };

  const removeActionPlanStep = (stepId: string) => {
    setActionPlanData(prev => ({
      ...prev,
      steps: prev.steps.filter(s => s.id !== stepId),
    }));
  };

  const updateActionPlanStep = (stepId: string, field: string, value: any) => {
    setActionPlanData(prev => ({
      ...prev,
      steps: prev.steps.map(s =>
        s.id === stepId ? { ...s, [field]: value } : s
      ),
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Convertir alerta en acción">
      <div className="space-y-6">
        {/* Alert info */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-gray-900 mb-1">{alert.title}</h4>
          <p className="text-sm text-gray-600">{alert.message}</p>
        </div>

        {/* Conversion type selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de conversión
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setConversionType('adjustment')}
              className={`p-4 rounded-lg border-2 transition-all ${
                conversionType === 'adjustment'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Target className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <div className="text-sm font-medium">Ajuste</div>
            </button>
            <button
              type="button"
              onClick={() => setConversionType('task')}
              className={`p-4 rounded-lg border-2 transition-all ${
                conversionType === 'task'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <CheckSquare className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <div className="text-sm font-medium">Tarea</div>
            </button>
            <button
              type="button"
              onClick={() => setConversionType('action_plan')}
              className={`p-4 rounded-lg border-2 transition-all ${
                conversionType === 'action_plan'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <FileText className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <div className="text-sm font-medium">Plan de acción</div>
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Adjustment form */}
        {conversionType === 'adjustment' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de ajuste
              </label>
              <Select
                value={adjustmentData.type}
                onChange={(e) => setAdjustmentData({ ...adjustmentData, type: e.target.value as any, newValue: '' })}
                options={[
                  { value: 'target_value', label: 'Valor objetivo' },
                  { value: 'deadline', label: 'Fecha límite' },
                  { value: 'metric', label: 'Métrica' },
                  { value: 'responsible', label: 'Responsable' },
                  { value: 'other', label: 'Otro' },
                ]}
              />
            </div>
            {getCurrentValueLabel() && (
              <p className="text-sm text-gray-600">{getCurrentValueLabel()}</p>
            )}
            {adjustmentData.type !== 'other' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nuevo valor
                </label>
                <Input
                  type={adjustmentData.type === 'deadline' ? 'date' : 'text'}
                  value={adjustmentData.newValue}
                  onChange={(e) => setAdjustmentData({ ...adjustmentData, newValue: e.target.value })}
                  placeholder={
                    adjustmentData.type === 'target_value'
                      ? 'Nuevo valor objetivo'
                      : adjustmentData.type === 'deadline'
                      ? 'Nueva fecha límite'
                      : 'Nuevo valor'
                  }
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Razón del ajuste *
              </label>
              <Textarea
                value={adjustmentData.reason}
                onChange={(e) => setAdjustmentData({ ...adjustmentData, reason: e.target.value })}
                placeholder="Explica por qué se realiza este ajuste"
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Task form */}
        {conversionType === 'task' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título de la tarea *
              </label>
              <Input
                value={taskData.title}
                onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                placeholder="Título de la tarea"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <Textarea
                value={taskData.description}
                onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                placeholder="Descripción de la tarea"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prioridad
                </label>
                <Select
                  value={taskData.priority}
                  onChange={(e) => setTaskData({ ...taskData, priority: e.target.value as any })}
                  options={[
                    { value: 'high', label: 'Alta' },
                    { value: 'medium', label: 'Media' },
                    { value: 'low', label: 'Baja' },
                  ]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha límite
                </label>
                <Input
                  type="date"
                  value={taskData.dueDate}
                  onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Asignado a
              </label>
              <Input
                value={taskData.assignedToName}
                onChange={(e) => setTaskData({ ...taskData, assignedToName: e.target.value })}
                placeholder="Nombre del responsable"
              />
            </div>
          </div>
        )}

        {/* Action plan form */}
        {conversionType === 'action_plan' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título del plan de acción *
              </label>
              <Input
                value={actionPlanData.title}
                onChange={(e) => setActionPlanData({ ...actionPlanData, title: e.target.value })}
                placeholder="Título del plan de acción"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <Textarea
                value={actionPlanData.description}
                onChange={(e) => setActionPlanData({ ...actionPlanData, description: e.target.value })}
                placeholder="Descripción del plan de acción"
                rows={3}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Pasos del plan
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addActionPlanStep}
                >
                  Agregar paso
                </Button>
              </div>
              <div className="space-y-3">
                {actionPlanData.steps.map((step, index) => (
                  <div key={step.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Paso {index + 1}
                      </span>
                      {actionPlanData.steps.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeActionPlanStep(step.id)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                    <Input
                      value={step.title}
                      onChange={(e) => updateActionPlanStep(step.id, 'title', e.target.value)}
                      placeholder="Título del paso"
                      className="mb-2"
                    />
                    <Textarea
                      value={step.description}
                      onChange={(e) => updateActionPlanStep(step.id, 'description', e.target.value)}
                      placeholder="Descripción del paso"
                      rows={2}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleConvert} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Convirtiendo...
              </>
            ) : (
              'Convertir alerta'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

