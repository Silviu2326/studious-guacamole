import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Select } from '../../../components/componentsreutilizables';
import { Task, TaskFilters, TaskStatus } from '../types';
import { getTasks, getPriorityColor, getPriorityLabel } from '../api';
import { CheckCircle2, Calendar, Clock } from 'lucide-react';

interface TaskHistoryProps {
  role: 'entrenador' | 'gimnasio';
}

export const TaskHistory: React.FC<TaskHistoryProps> = ({ role }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<TaskStatus>('completada');

  useEffect(() => {
    loadTasks();
  }, [statusFilter, role]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const filters: TaskFilters = {
        role,
        status: [statusFilter],
      };
      const data = await getTasks(filters);
      // Ordenar por fecha de completado o actualización
      const sorted = data.sort((a, b) => {
        const dateA = a.completedAt || a.updatedAt;
        const dateB = b.completedAt || b.updatedAt;
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });
      setTasks(sorted);
    } catch (error) {
      console.error('Error cargando historial:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: 'completada', label: 'Completadas' },
    { value: 'cancelada', label: 'Canceladas' },
    { value: 'pendiente', label: 'Pendientes' },
    { value: 'en-progreso', label: 'En Progreso' },
  ];

  const columns = [
    {
      key: 'title',
      label: 'Tarea',
      render: (value: string, row: Task) => (
        <div className="flex flex-col">
          <span className="font-semibold">{value}</span>
          {row.description && (
            <span className="text-sm text-gray-500 mt-1">{row.description}</span>
          )}
        </div>
      ),
    },
    {
      key: 'priority',
      label: 'Prioridad',
      render: (value: Task['priority']) => (
        <Badge className={getPriorityColor(value)}>
          {getPriorityLabel(value)}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (value: TaskStatus) => {
        const statusConfig = {
          'pendiente': { label: 'Pendiente', color: 'text-yellow-600' },
          'en-progreso': { label: 'En Progreso', color: 'text-blue-600' },
          'completada': { label: 'Completada', color: 'text-green-600' },
          'cancelada': { label: 'Cancelada', color: 'text-gray-600' },
        };
        const config = statusConfig[value] || statusConfig['pendiente'];
        return <span className={config.color}>{config.label}</span>;
      },
    },
    {
      key: 'completedAt',
      label: 'Fecha de Finalización',
      render: (value: Date | string | undefined, row: Task) => {
        const date = value || row.updatedAt;
        return (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>
              {new Date(date).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        );
      },
    },
    {
      key: 'createdAt',
      label: 'Creada',
      render: (value: Date | string) => (
        <span className="text-sm text-gray-500">
          {new Date(value).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      ),
    },
  ];

  const completedCount = tasks.filter(t => t.status === 'completada').length;
  const cancelledCount = tasks.filter(t => t.status === 'cancelada').length;

  return (
    <Card className="bg-white shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Historial de Tareas
          </h2>
          <p className="text-gray-600">
            Registro de todas las tareas realizadas
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {completedCount}
            </p>
            <p className="text-xs text-gray-600">
              Completadas
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {cancelledCount}
            </p>
            <p className="text-xs text-gray-600">
              Canceladas
            </p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as TaskStatus)}
          options={statusOptions}
          className="w-48"
        />
      </div>

      <Table
        data={tasks}
        columns={columns}
        loading={loading}
        emptyMessage="No hay tareas en el historial"
      />
    </Card>
  );
};

