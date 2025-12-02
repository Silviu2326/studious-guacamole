import React from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { CheckCircle2, Circle, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { Task } from '../api';

interface TasksWidgetProps {
  tasks: Task[];
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  onUpdateTask: (taskActualizada: Task) => void;
}

export const TasksWidget: React.FC<TasksWidgetProps> = ({
  tasks,
  loading = false,
  error,
  onRetry,
  onUpdateTask,
}) => {
  const handleToggleTask = (task: Task) => {
    // Marcar como completada si está pendiente o en progreso, o desmarcar si está completada
    const newStatus: Task['status'] = 
      task.status === 'done' ? 'pending' : 'done';
    
    const taskActualizada: Task = {
      ...task,
      status: newStatus,
    };
    
    onUpdateTask(taskActualizada);
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

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50/50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50/50';
      case 'low':
      default:
        return 'border-l-gray-300 bg-gray-50';
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

  // Agrupar tareas por estado y prioridad
  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const completedTasks = tasks.filter(t => t.status === 'done');

  // Ordenar por prioridad: high -> medium -> low
  const sortByPriority = (a: Task, b: Task) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  };

  const sortedPendingTasks = [...pendingTasks].sort(sortByPriority);
  const sortedInProgressTasks = [...inProgressTasks].sort(sortByPriority);
  const sortedCompletedTasks = [...completedTasks].sort(sortByPriority);

  if (error) {
    return (
      <Card className="p-4 bg-white shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Tareas del Día
          </h3>
        </div>
        <div className="flex flex-col items-center justify-center py-8">
          <div className="p-3 bg-red-100 rounded-full mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h4 className="text-sm font-semibold text-gray-900 mb-1">
            Error al cargar las tareas
          </h4>
          <p className="text-sm text-gray-600 text-center mb-4 max-w-xs">
            {error}
          </p>
          {onRetry && (
            <Button 
              variant="primary" 
              size="sm"
              onClick={onRetry}
              className="bg-red-600 hover:bg-red-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </Button>
          )}
        </div>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="p-4 bg-white shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Tareas del Día
          </h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </Card>
    );
  }

  const renderTaskItem = (task: Task, showCompleted: boolean = false) => (
    <div
      key={task.id}
      className={`flex items-start gap-3 p-3 rounded-lg border-l-4 transition-all hover:shadow-sm ${
        showCompleted 
          ? 'opacity-75 bg-gray-50/50 border-l-gray-300' 
          : getPriorityColor(task.priority)
      }`}
    >
      <button
        onClick={() => handleToggleTask(task)}
        className="flex-shrink-0 mt-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full transition-transform hover:scale-110"
        aria-label={task.status === 'done' ? 'Desmarcar tarea' : 'Marcar como completada'}
      >
        {task.status === 'done' ? (
          <CheckCircle2 className="w-5 h-5 text-green-600" />
        ) : task.status === 'in_progress' ? (
          <Clock className="w-5 h-5 text-blue-600" />
        ) : (
          <Circle className="w-5 h-5 text-gray-400 hover:text-blue-600 transition-colors" />
        )}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className={`text-sm font-medium ${
            showCompleted ? 'text-gray-500 line-through' : 'text-gray-900'
          }`}>
            {task.title}
          </h4>
          {!showCompleted && getPriorityIcon(task.priority)}
        </div>
        {task.description && !showCompleted && (
          <p className="text-sm text-gray-600 mt-1">
            {task.description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className="text-xs px-2 py-1 rounded bg-white ring-1 ring-gray-200 text-gray-700">
            {task.category}
          </span>
          {task.status === 'in_progress' && !showCompleted && (
            <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">
              En progreso
            </span>
          )}
          {task.dueDate && !showCompleted && (
            <span className={`text-xs px-2 py-1 rounded ${
              formatDate(task.dueDate) === 'Vencida' 
                ? 'bg-red-100 text-red-700' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Card className="p-4 bg-white shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Tareas del Día
        </h3>
        <p className="text-gray-600 text-sm mt-1">
          {pendingTasks.length + inProgressTasks.length} {pendingTasks.length + inProgressTasks.length === 1 ? 'tarea pendiente' : 'tareas pendientes'}
        </p>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {/* Tareas en progreso */}
        {sortedInProgressTasks.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">
              En Progreso ({sortedInProgressTasks.length})
            </p>
            <div className="space-y-2">
              {sortedInProgressTasks.map((task) => renderTaskItem(task))}
            </div>
          </div>
        )}

        {/* Tareas pendientes */}
        {sortedPendingTasks.length > 0 && (
          <div>
            {sortedInProgressTasks.length > 0 && (
              <div className="border-t border-gray-200 pt-4 mt-4" />
            )}
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
              Pendientes ({sortedPendingTasks.length})
            </p>
            <div className="space-y-2">
              {sortedPendingTasks.map((task) => renderTaskItem(task))}
            </div>
          </div>
        )}

        {/* Tareas completadas */}
        {sortedCompletedTasks.length > 0 && (
          <div>
            {(sortedPendingTasks.length > 0 || sortedInProgressTasks.length > 0) && (
              <div className="border-t border-gray-200 pt-4 mt-4" />
            )}
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Completadas ({sortedCompletedTasks.length})
            </p>
            <div className="space-y-2">
              {sortedCompletedTasks.slice(0, 3).map((task) => renderTaskItem(task, true))}
              {sortedCompletedTasks.length > 3 && (
                <p className="text-xs text-gray-500 text-center py-2">
                  +{sortedCompletedTasks.length - 3} más completadas
                </p>
              )}
            </div>
          </div>
        )}

        {/* Estado vacío */}
        {tasks.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600 font-medium text-base">
              No tienes tareas pendientes
            </p>
            <p className="text-gray-500 text-sm mt-1">
              ¡Excelente trabajo! Todo está al día.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
