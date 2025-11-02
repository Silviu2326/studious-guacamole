import React from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react';
import { Task } from '../api/tasks';
import { updateTask } from '../api/tasks';

interface TasksWidgetProps {
  tasks: Task[];
  loading?: boolean;
  onTaskUpdate?: () => void;
}

export const TasksWidget: React.FC<TasksWidgetProps> = ({
  tasks,
  loading = false,
  onTaskUpdate,
}) => {
  const handleToggleTask = async (taskId: string, completed: boolean) => {
    try {
      await updateTask(taskId, !completed);
      onTaskUpdate?.();
    } catch (error) {
      console.error('Error actualizando tarea:', error);
    }
  };

  const getPriorityIcon = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'medium':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'low':
      default:
        return null;
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return null;
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.floor(diff / 3600000);
    
    if (hours < 0) return 'Vencida';
    if (hours < 24) return `En ${hours}h`;
    return `En ${Math.floor(hours / 24)} días`;
  };

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  if (loading) {
    return (
      <Card className="p-4 bg-white shadow-sm">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-white shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Tareas del Día
        </h3>
        <p className="text-gray-600 text-sm mt-1">
          {pendingTasks.length} {pendingTasks.length === 1 ? 'tarea pendiente' : 'tareas pendientes'}
        </p>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {pendingTasks.map((task) => (
          <div
            key={task.id}
            className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 ring-1 ring-gray-200 transition-colors"
          >
            <button
              onClick={() => handleToggleTask(task.id, task.completed)}
              className="flex-shrink-0 mt-0.5"
            >
              <Circle className="w-5 h-5 text-gray-400 hover:text-blue-600 transition-colors" />
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-medium text-gray-900">
                  {task.title}
                </h4>
                {getPriorityIcon(task.priority)}
              </div>
              {task.description && (
                <p className="text-sm text-gray-600 mt-1">
                  {task.description}
                </p>
              )}
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs px-2 py-1 rounded bg-white ring-1 ring-gray-200 text-gray-700">
                  {task.category}
                </span>
                {task.dueDate && (
                  <span className="text-xs text-gray-500">
                    {formatDate(task.dueDate)}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {completedTasks.length > 0 && (
          <div className="pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-2">
              Completadas ({completedTasks.length})
            </p>
            {completedTasks.slice(0, 2).map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-2 rounded-lg opacity-60"
              >
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-gray-600 line-through">
                  {task.title}
                </span>
              </div>
            ))}
          </div>
        )}

        {tasks.length === 0 && (
          <div className="text-center py-8">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">
              No hay tareas pendientes
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
