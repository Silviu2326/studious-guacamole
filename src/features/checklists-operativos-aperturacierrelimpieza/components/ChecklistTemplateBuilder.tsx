// Componente ChecklistTemplateBuilder - Container
import React, { useState } from 'react';
import { ChecklistTemplate, ChecklistTemplateTask } from '../types';
import { ChecklistsService } from '../services/checklistsService';
import { Card, Button, Input, Textarea, Modal, ConfirmModal } from '../../../components/componentsreutilizables';
import { Plus, X, GripVertical, AlertCircle, Save } from 'lucide-react';

interface ChecklistTemplateBuilderProps {
  templateId?: string | null;
  onSave: (template: ChecklistTemplate) => void;
  onCancel?: () => void;
}

export const ChecklistTemplateBuilder: React.FC<ChecklistTemplateBuilderProps> = ({
  templateId,
  onSave,
  onCancel
}) => {
  const [templateName, setTemplateName] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState<ChecklistTemplateTask[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const handleAddTask = () => {
    const newTask: ChecklistTemplateTask = {
      id: `task_${Date.now()}`,
      text: '',
      isCritical: false
    };
    setTasks([...tasks, newTask]);
  };

  const handleRemoveTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleUpdateTask = (taskId: string, updates: Partial<ChecklistTemplateTask>) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const handleSave = async () => {
    if (!templateName.trim()) {
      alert('Por favor ingresa un nombre para la plantilla');
      return;
    }

    if (tasks.length === 0) {
      alert('Por favor agrega al menos una tarea');
      return;
    }

    // Validar que todas las tareas tengan texto
    const tasksWithoutText = tasks.filter(task => !task.text.trim());
    if (tasksWithoutText.length > 0) {
      alert('Todas las tareas deben tener un texto descriptivo');
      return;
    }

    try {
      setIsSaving(true);
      const templateData = {
        name: templateName,
        description: description,
        tasks: tasks
      };

      const savedTemplate = await ChecklistsService.crearTemplate(templateData);
      onSave(savedTemplate);
    } catch (error) {
      console.error('Error al guardar la plantilla:', error);
      alert('Error al guardar la plantilla');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm">
        <div className="p-4 space-y-4">
          {/* Template Header */}
          <div>
            <Input
              label="Nombre de la Plantilla"
              placeholder="Ej: Checklist de Apertura"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              required
            />
          </div>

          <div>
            <Textarea
              label="Descripción"
              placeholder="Describe para qué sirve este checklist..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </Card>

      {/* Tasks List */}
      <Card className="bg-white shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Tareas
            </h3>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleAddTask}
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Tarea
            </Button>
          </div>

          <div className="space-y-3">
            {tasks.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">
                  No hay tareas. Agrega tu primera tarea.
                </p>
              </div>
            ) : (
              tasks.map((task, index) => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition"
                >
                  {/* Drag Handle */}
                  <div className="flex-shrink-0 text-gray-400 mt-2 cursor-move">
                    <GripVertical className="w-5 h-5" />
                  </div>

                  {/* Task Number */}
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </div>
                  </div>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <Input
                      placeholder="Describe la tarea..."
                      value={task.text}
                      onChange={(e) => handleUpdateTask(task.id, { text: e.target.value })}
                      required
                    />
                    
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="checkbox"
                        id={`critical_${task.id}`}
                        checked={task.isCritical}
                        onChange={(e) => handleUpdateTask(task.id, { isCritical: e.target.checked })}
                        className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                      />
                      <label
                        htmlFor={`critical_${task.id}`}
                        className="text-sm text-gray-600 cursor-pointer"
                      >
                        Tarea crítica
                      </label>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => {
                      setTaskToDelete(task.id);
                      setShowDeleteConfirm(true);
                    }}
                    className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button
          variant="primary"
          onClick={handleSave}
          loading={isSaving}
        >
          <Save className="w-5 h-5 mr-2" />
          Guardar Plantilla
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setTaskToDelete(null);
        }}
        onConfirm={() => {
          if (taskToDelete) {
            handleRemoveTask(taskToDelete);
          }
          setShowDeleteConfirm(false);
          setTaskToDelete(null);
        }}
        title="Eliminar Tarea"
        message="¿Estás seguro de que quieres eliminar esta tarea?"
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="destructive"
      />
    </div>
  );
};

