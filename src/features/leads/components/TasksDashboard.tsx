import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Button, Select, MetricCards } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { Task } from '../types';
import { TaskService } from '../services/taskService';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  Filter,
  TrendingUp
} from 'lucide-react';

interface TasksDashboardProps {
  businessType: 'entrenador' | 'gimnasio';
  userId?: string;
}

export const TasksDashboard: React.FC<TasksDashboardProps> = ({ businessType, userId }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'overdue'>('pending');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadTasks();
    loadStats();
  }, [businessType, userId, filter, filterPriority]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const filters: any = {
        businessType,
        ...(userId && { assignedTo: userId })
      };

      if (filter === 'pending') {
        filters.completed = false;
      } else if (filter === 'completed') {
        filters.completed = true;
      } else if (filter === 'overdue') {
        filters.overdue = true;
      }

      if (filterPriority !== 'all') {
        filters.priority = filterPriority;
      }

      let data = await TaskService.getTasks(filters);
      
      // Filtrar tareas vencidas si es necesario
      if (filter === 'overdue') {
        const now = new Date();
        data = data.filter(t => t.dueDate && new Date(t.dueDate) < now);
      }
      
      setTasks(data);
    } catch (error) {
      console.error('Error cargando tareas:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await TaskService.getTaskStatistics(businessType, userId);
      setStats(data);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  const handleComplete = async (taskId: string) => {
    try {
      await TaskService.completeTask(taskId, user?.id || 'unknown');
      await loadTasks();
      await loadStats();
    } catch (error) {
      console.error('Error completando tarea:', error);
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

  const metrics = stats ? [
    {
      id: 'total',
      title: 'Total Tareas',
      value: stats.total,
      icon: <Calendar className="w-5 h-5" />,
      color: 'primary' as const
    },
    {
      id: 'pending',
      title: 'Pendientes',
      value: stats.pending,
      icon: <Clock className="w-5 h-5" />,
      color: 'warning' as const
    },
    {
      id: 'completed',
      title: 'Completadas',
      value: stats.completed,
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'success' as const
    },
    {
      id: 'overdue',
      title: 'Vencidas',
      value: stats.overdue,
      icon: <AlertCircle className="w-5 h-5" />,
      color: 'error' as const
    }
  ] : [];

  return (
    <div className="space-y-6">
      {/* Métricas */}
      {stats && <MetricCards data={metrics} columns={4} />}

      {/* Filtros */}
      <Card>
        <div className={ds.spacing.md}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Estado"
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              options={[
                { value: 'all', label: 'Todas' },
                { value: 'pending', label: 'Pendientes' },
                { value: 'completed', label: 'Completadas' },
                { value: 'overdue', label: 'Vencidas' }
              ]}
            />
            <Select
              label="Prioridad"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              options={[
                { value: 'all', label: 'Todas' },
                { value: 'urgent', label: 'Urgente' },
                { value: 'high', label: 'Alta' },
                { value: 'medium', label: 'Media' },
                { value: 'low', label: 'Baja' }
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Lista de tareas */}
      <Card>
        <div className={ds.spacing.md}>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className={`animate-spin ${ds.radius.full} h-8 w-8 border-b-2 ${ds.color.primaryBg}`}></div>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-[#94A3B8]">
                No hay tareas con los filtros seleccionados
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-start justify-between gap-3 p-3 bg-gray-50 dark:bg-[#1E1E2E] rounded-lg hover:bg-gray-100 dark:hover:bg-[#2A2A3E] transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1">
                    {!task.completed ? (
                      <button
                        onClick={() => handleComplete(task.id)}
                        className="mt-0.5 p-1 hover:bg-gray-200 dark:hover:bg-[#334155] rounded"
                        title="Marcar como completada"
                      >
                        <div className="w-5 h-5 border-2 border-gray-300 dark:border-[#64748B] rounded" />
                      </button>
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-[#F1F5F9]'}`}>
                          {task.title}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      {task.description && (
                        <p className={`text-sm mb-2 ${task.completed ? 'text-gray-500' : 'text-gray-600 dark:text-[#94A3B8]'}`}>
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                        {task.dueDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {new Date(task.dueDate).toLocaleDateString()}
                              {!task.completed && new Date(task.dueDate) < new Date() && (
                                <span className="ml-1 text-red-600 dark:text-red-400">(Vencida)</span>
                              )}
                            </span>
                          </div>
                        )}
                        {task.assignedTo && (
                          <span>Asignada a: {task.assignedTo}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

