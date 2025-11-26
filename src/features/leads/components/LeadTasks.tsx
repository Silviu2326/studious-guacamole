import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Button, Modal, Input, Select } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { Task, Lead } from '../types';
import { TaskService } from '../services/taskService';
import {
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  User,
  Trash2,
  Edit,
  Mail,
  MessageSquare,
  Phone,
  FileText
} from 'lucide-react';

interface LeadTasksProps {
  lead: Lead;
  onTaskUpdate?: () => void;
}

export const LeadTasks: React.FC<LeadTasksProps> = ({ lead, onTaskUpdate }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    loadTasks();
  }, [lead.id]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await TaskService.getLeadTasks(lead.id);
      setTasks(data);
    } catch (error) {
      console.error('Error cargando tareas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    try {
      if (editingTask) {
        await TaskService.updateTask(editingTask.id, taskData);
      } else {
        await TaskService.createTask({
          ...taskData,
          createdBy: user?.id || 'unknown'
        });
      }
      setShowModal(false);
      setEditingTask(null);
      await loadTasks();
      onTaskUpdate?.();
    } catch (error) {
      console.error('Error guardando tarea:', error);
      alert('Error al guardar la tarea');
    }
  };

  const handleComplete = async (taskId: string) => {
    try {
      await TaskService.completeTask(taskId, user?.id || 'unknown');
      await loadTasks();
      onTaskUpdate?.();
    } catch (error) {
      console.error('Error completando tarea:', error);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta tarea?')) {
      try {
        await TaskService.deleteTask(taskId);
        await loadTasks();
        onTaskUpdate?.();
      } catch (error) {
        console.error('Error eliminando tarea:', error);
      }
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      case 'high':
        return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'whatsapp':
        return <MessageSquare className="w-4 h-4" />;
      case 'proposal':
        return <FileText className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);
  const overdueTasks = pendingTasks.filter(t => {
    if (!t.dueDate) return false;
    return new Date(t.dueDate) < new Date() && !t.completed;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
          Tareas y Recordatorios
        </h3>
        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            setEditingTask(null);
            setShowModal(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Tarea
        </Button>
      </div>

      {/* Alertas de tareas vencidas */}
      {overdueTasks.length > 0 && (
        <Card>
          <div className={`${ds.spacing.md} bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg`}>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="font-semibold text-red-900 dark:text-red-300">
                {overdueTasks.length} tarea(s) vencida(s)
              </span>
            </div>
            {overdueTasks.map(task => (
              <div key={task.id} className="text-sm text-red-800 dark:text-red-300">
                • {task.title} - Vencida el {new Date(task.dueDate!).toLocaleDateString()}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tareas pendientes */}
      {pendingTasks.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-[#F1F5F9]">
            Pendientes ({pendingTasks.length})
          </h4>
          {pendingTasks.map(task => (
            <Card key={task.id} padding="md">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <button
                    onClick={() => handleComplete(task.id)}
                    className="mt-0.5 p-1 hover:bg-gray-100 dark:hover:bg-[#334155] rounded"
                    title="Marcar como completada"
                  >
                    <div className="w-5 h-5 border-2 border-gray-300 dark:border-[#64748B] rounded" />
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getTypeIcon(task.type)}
                      <span className="font-medium text-gray-900 dark:text-[#F1F5F9]">
                        {task.title}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    {task.description && (
                      <p className="text-sm text-gray-600 dark:text-[#94A3B8] mb-2">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                      {task.dueDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {new Date(task.dueDate).toLocaleDateString()}
                            {new Date(task.dueDate) < new Date() && (
                              <span className="ml-1 text-red-600 dark:text-red-400">(Vencida)</span>
                            )}
                          </span>
                        </div>
                      )}
                      {task.assignedTo && (
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>Asignada a: {task.assignedTo}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingTask(task);
                      setShowModal(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(task.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tareas completadas */}
      {completedTasks.length > 0 && (
        <details className="space-y-2">
          <summary className="text-sm font-semibold text-gray-900 dark:text-[#F1F5F9] cursor-pointer">
            Completadas ({completedTasks.length})
          </summary>
          <div className="mt-2 space-y-2">
            {completedTasks.map(task => (
              <Card key={task.id} padding="md" className="opacity-60">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <div className="flex-1">
                    <div className="line-through text-gray-600 dark:text-[#94A3B8]">
                      {task.title}
                    </div>
                    {task.completedAt && (
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Completada el {new Date(task.completedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </details>
      )}

      {tasks.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-600 dark:text-[#94A3B8]">
          <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No hay tareas para este lead</p>
        </div>
      )}

      {/* Modal de crear/editar */}
      <TaskFormModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingTask(null);
        }}
        onSave={handleSave}
        task={editingTask}
        lead={lead}
      />
    </div>
  );
};

// Modal de formulario
interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => void;
  task?: Task | null;
  lead: Lead;
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({ isOpen, onClose, onSave, task, lead }) => {
  const [formData, setFormData] = useState({
    leadId: lead.id,
    title: task?.title || '',
    description: task?.description || '',
    type: task?.type || 'call',
    priority: task?.priority || 'medium',
    dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    assignedTo: task?.assignedTo || lead.assignedTo || ''
  });

  useEffect(() => {
    if (task) {
      setFormData({
        leadId: task.leadId,
        title: task.title || '',
        description: task.description || '',
        type: task.type || 'call',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        assignedTo: task.assignedTo || ''
      });
    } else {
      setFormData({
        leadId: lead.id,
        title: '',
        description: '',
        type: 'call',
        priority: 'medium',
        dueDate: '',
        assignedTo: lead.assignedTo || ''
      });
    }
  }, [task, lead, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      alert('Por favor completa el título de la tarea');
      return;
    }

    onSave({
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      completed: false
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Editar Tarea' : 'Nueva Tarea'}
      size="md"
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Guardar
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Título *"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Ej: Llamar a María González"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-[#F1F5F9] mb-2">
            Descripción
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detalles de la tarea..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-[#334155] rounded-lg bg-white dark:bg-[#1E1E2E] text-gray-900 dark:text-[#F1F5F9] min-h-[100px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Tipo *"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
            options={[
              { value: 'call', label: 'Llamada' },
              { value: 'email', label: 'Email' },
              { value: 'whatsapp', label: 'WhatsApp' },
              { value: 'proposal', label: 'Enviar Presupuesto' },
              { value: 'follow_up', label: 'Seguimiento' },
              { value: 'other', label: 'Otro' }
            ]}
            required
          />

          <Select
            label="Prioridad *"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
            options={[
              { value: 'low', label: 'Baja' },
              { value: 'medium', label: 'Media' },
              { value: 'high', label: 'Alta' },
              { value: 'urgent', label: 'Urgente' }
            ]}
            required
          />
        </div>

        <Input
          label="Fecha de Vencimiento"
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
        />
      </form>
    </Modal>
  );
};

