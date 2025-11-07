import React, { useState, useEffect } from 'react';
import { Card, Badge } from '../../../components/componentsreutilizables';
import { Task, TaskPriority } from '../types';
import { getTasksByPriority, getPriorityColor, getPriorityLabel } from '../api';
import { AlertCircle, Clock, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';

interface PriorityQueueProps {
  role: 'entrenador' | 'gimnasio';
}

export const PriorityQueue: React.FC<PriorityQueueProps> = ({ role }) => {
  const [tasksByPriority, setTasksByPriority] = useState<Record<TaskPriority, Task[]>>({
    alta: [],
    media: [],
    baja: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, [role]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await getTasksByPriority();
      setTasksByPriority(data);
    } catch (error) {
      console.error('Error cargando tareas por prioridad:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityIcon = (priority: TaskPriority) => {
    switch (priority) {
      case 'alta':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'media':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'baja':
        return <CheckCircle2 className="w-5 h-5 text-blue-600" />;
    }
  };

  const renderPriorityColumn = (priority: TaskPriority, tasks: Task[]) => {
    return (
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-4">
          {getPriorityIcon(priority)}
          <h3 className="text-lg font-semibold text-gray-900">
            {getPriorityLabel(priority)}
          </h3>
          <Badge className={getPriorityColor(priority)}>
            {tasks.length}
          </Badge>
        </div>
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <Card className="p-8 text-center bg-white shadow-sm">
              <p className="text-sm text-gray-600">
                No hay tareas
              </p>
            </Card>
          ) : (
            tasks.map((task) => (
              <Card key={task.id} variant="hover" className="p-4 bg-white shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 flex-1">
                    {task.title}
                  </h4>
                </div>
                {task.description && (
                  <p className="text-sm text-gray-600 mb-2">
                    {task.description}
                  </p>
                )}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  {task.dueDate && (
                    <span className="text-xs text-gray-500">
                      {new Date(task.dueDate).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </span>
                  )}
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </Card>
    );
  }

  const totalTasks = tasksByPriority.alta.length + tasksByPriority.media.length + tasksByPriority.baja.length;

  return (
    <Card className="bg-white shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Cola de Prioridades
        </h2>
        <p className="text-gray-600">
          Tareas organizadas por prioridad ({totalTasks} total)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderPriorityColumn('alta', tasksByPriority.alta)}
        {renderPriorityColumn('media', tasksByPriority.media)}
        {renderPriorityColumn('baja', tasksByPriority.baja)}
      </div>
    </Card>
  );
};

