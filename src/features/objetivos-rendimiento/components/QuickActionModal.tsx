import React, { useState } from 'react';
import { Objective, QuickTask, QuickAdjustment } from '../types';
import { createQuickTask, createQuickAdjustment } from '../api/objectives';
import { Modal, Button, Input, Select, Textarea } from '../../../components/componentsreutilizables';
import { AlertTriangle, CheckCircle2, Settings, X } from 'lucide-react';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  objective: Objective | null;
  onActionComplete: () => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({
  isOpen,
  onClose,
  objective,
  onActionComplete,
}) => {
  const [actionType, setActionType] = useState<'task' | 'adjustment'>('task');
  const [loading, setLoading] = useState(false);
  
  // Form data for task
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    assignedTo: '',
    assignedToName: '',
    dueDate: '',
    blockerReason: '',
  });
  
  // Form data for adjustment
  const [adjustmentData, setAdjustmentData] = useState({
    type: 'target_value' as 'target_value' | 'deadline' | 'metric' | 'responsible' | 'other',
    newValue: '',
    reason: '',
  });

  if (!objective) return null;

  const hasBlockers = objective.status === 'at_risk' || objective.status === 'failed' || objective.progress < 50;

  const handleSubmitTask = async () => {
    if (!taskData.title.trim()) {
      alert('Por favor, ingresa un título para la tarea');
      return;
    }

    setLoading(true);
    try {
      await createQuickTask(objective.id, {
        ...taskData,
        blockerReason: taskData.blockerReason || `Bloqueo detectado en objetivo: ${objective.title}`,
        createdBy: 'user',
        createdByName: 'Manager',
      });
      onActionComplete();
      onClose();
      // Reset form
      setTaskData({
        title: '',
        description: '',
        priority: 'medium',
        assignedTo: '',
        assignedToName: '',
        dueDate: '',
        blockerReason: '',
      });
    } catch (error) {
      console.error('Error creating quick task:', error);
      alert('Error al crear la tarea');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAdjustment = async () => {
    if (!adjustmentData.reason.trim()) {
      alert('Por favor, ingresa una razón para el ajuste');
      return;
    }

    if (!adjustmentData.newValue) {
      alert('Por favor, ingresa un nuevo valor');
      return;
    }

    setLoading(true);
    try {
      let newValue: any = adjustmentData.newValue;
      
      // Convert value based on type
      if (adjustmentData.type === 'target_value') {
        newValue = parseFloat(adjustmentData.newValue);
        if (isNaN(newValue)) {
          alert('El valor objetivo debe ser un número');
          setLoading(false);
          return;
        }
      }

      await createQuickAdjustment(objective.id, {
        type: adjustmentData.type,
        newValue,
        reason: adjustmentData.reason,
        createdBy: 'user',
        createdByName: 'Manager',
      });
      onActionComplete();
      onClose();
      // Reset form
      setAdjustmentData({
        type: 'target_value',
        newValue: '',
        reason: '',
      });
    } catch (error) {
      console.error('Error creating quick adjustment:', error);
      alert('Error al aplicar el ajuste');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentValueLabel = () => {
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Acción Rápida: ${objective.title}`}
      size="md"
      footer={
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={actionType === 'task' ? handleSubmitTask : handleSubmitAdjustment}
            disabled={loading}
          >
            {loading ? 'Guardando...' : actionType === 'task' ? 'Crear Tarea' : 'Aplicar Ajuste'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Alert for blockers */}
        {hasBlockers && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm font-medium text-yellow-900">Bloqueo Detectado</div>
              <div className="text-xs text-yellow-700 mt-1">
                Este objetivo está en riesgo. Asigna una tarea o aplica un ajuste para resolver el bloqueo.
              </div>
            </div>
          </div>
        )}

        {/* Action type selector */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => setActionType('task')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              actionType === 'task'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 inline mr-2" />
            Asignar Tarea
          </button>
          <button
            onClick={() => setActionType('adjustment')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              actionType === 'adjustment'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Settings className="w-4 h-4 inline mr-2" />
            Aplicar Ajuste
          </button>
        </div>

        {/* Task form */}
        {actionType === 'task' && (
          <div className="space-y-4">
            <Input
              label="Título de la tarea"
              value={taskData.title}
              onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
              placeholder="Ej: Revisar estrategia de retención"
              required
            />
            <Textarea
              label="Descripción"
              value={taskData.description}
              onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
              placeholder="Describe la tarea en detalle..."
              rows={3}
            />
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Prioridad"
                value={taskData.priority}
                onChange={(e) => setTaskData({ ...taskData, priority: e.target.value as any })}
                options={[
                  { value: 'high', label: 'Alta' },
                  { value: 'medium', label: 'Media' },
                  { value: 'low', label: 'Baja' },
                ]}
              />
              <Input
                label="Fecha límite"
                type="date"
                value={taskData.dueDate}
                onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
              />
            </div>
            <Input
              label="Asignar a (nombre)"
              value={taskData.assignedToName}
              onChange={(e) => setTaskData({ ...taskData, assignedToName: e.target.value })}
              placeholder="Nombre del responsable"
            />
            <Textarea
              label="Razón del bloqueo"
              value={taskData.blockerReason}
              onChange={(e) => setTaskData({ ...taskData, blockerReason: e.target.value })}
              placeholder="Describe por qué este objetivo está bloqueado..."
              rows={2}
            />
          </div>
        )}

        {/* Adjustment form */}
        {actionType === 'adjustment' && (
          <div className="space-y-4">
            <Select
              label="Tipo de ajuste"
              value={adjustmentData.type}
              onChange={(e) => {
                setAdjustmentData({ ...adjustmentData, type: e.target.value as any, newValue: '' });
              }}
              options={[
                { value: 'target_value', label: 'Valor Objetivo' },
                { value: 'deadline', label: 'Fecha Límite' },
                { value: 'metric', label: 'Métrica' },
                { value: 'responsible', label: 'Responsable' },
                { value: 'other', label: 'Otro' },
              ]}
            />
            {getCurrentValueLabel() && (
              <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                {getCurrentValueLabel()}
              </div>
            )}
            {adjustmentData.type === 'target_value' && (
              <Input
                label="Nuevo valor objetivo"
                type="number"
                value={adjustmentData.newValue}
                onChange={(e) => setAdjustmentData({ ...adjustmentData, newValue: e.target.value })}
                placeholder={`Ej: ${objective.targetValue}`}
                required
              />
            )}
            {adjustmentData.type === 'deadline' && (
              <Input
                label="Nueva fecha límite"
                type="date"
                value={adjustmentData.newValue}
                onChange={(e) => setAdjustmentData({ ...adjustmentData, newValue: e.target.value })}
                required
              />
            )}
            {adjustmentData.type === 'metric' && (
              <Input
                label="Nueva métrica"
                value={adjustmentData.newValue}
                onChange={(e) => setAdjustmentData({ ...adjustmentData, newValue: e.target.value })}
                placeholder="Ej: facturacion, adherencia..."
                required
              />
            )}
            {adjustmentData.type === 'responsible' && (
              <Input
                label="Nuevo responsable"
                value={adjustmentData.newValue}
                onChange={(e) => setAdjustmentData({ ...adjustmentData, newValue: e.target.value })}
                placeholder="Nombre del nuevo responsable"
                required
              />
            )}
            {adjustmentData.type === 'other' && (
              <Textarea
                label="Descripción del ajuste"
                value={adjustmentData.newValue}
                onChange={(e) => setAdjustmentData({ ...adjustmentData, newValue: e.target.value })}
                placeholder="Describe el ajuste a realizar..."
                rows={3}
                required
              />
            )}
            <Textarea
              label="Razón del ajuste"
              value={adjustmentData.reason}
              onChange={(e) => setAdjustmentData({ ...adjustmentData, reason: e.target.value })}
              placeholder="Explica por qué es necesario este ajuste..."
              rows={3}
              required
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

