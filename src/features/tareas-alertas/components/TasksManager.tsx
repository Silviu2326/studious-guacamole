import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Button, Table, Badge, MetricCards } from '../../../components/componentsreutilizables';
import { Task, TaskFilters, TaskPriority, TaskStatus, CreateTaskData } from '../types';
import {
  getTasks,
  createTask,
  deleteTask,
  completeTask,
  sortTasksByPriority,
  getPriorityColor,
  getPriorityLabel
} from '../api';
import { TaskCreator } from './TaskCreator';
import { Plus, Search, Filter, CheckCircle2, Clock, AlertCircle, ChevronDown, ChevronUp, X, Trash2, CheckSquare } from 'lucide-react';

interface TasksManagerProps {
  role: 'entrenador' | 'gimnasio';
  /**
   * Lista de tareas filtradas. Si se proporciona, el componente usará estas tareas
   * en lugar de cargarlas internamente. Esto permite compartir la misma fuente de datos
   * con PriorityQueue.
   */
  tasks?: Task[];
  /**
   * Callback cuando las tareas se actualizan (crear, editar, eliminar, completar).
   * Permite sincronizar cambios con PriorityQueue.
   */
  onTasksChange?: (tasks: Task[]) => void;
  /**
   * Si es true, el componente cargará sus propias tareas (modo legacy).
   * Si es false y tasks está proporcionado, usará las tareas recibidas.
   */
  loadOwnTasks?: boolean;
  /**
   * Estado de carga externo. Si se proporciona, se usa en lugar del estado interno.
   */
  loading?: boolean;
}

export const TasksManager: React.FC<TasksManagerProps> = ({
  role,
  tasks: externalTasks,
  onTasksChange,
  loadOwnTasks = false,
  loading: externalLoading
}) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [internalLoading, setInternalLoading] = useState(true);
  // filters is now an object, not a state, as it's only used for initial taskFilters
  const initialFilters: TaskFilters = {
    role,
    ...(role === 'entrenador' && user?.id ? { assignedTo: [user.id] } : {}),
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus[]>(['pendiente', 'en-progreso']);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority | ''>('');

  // Determinar si debemos cargar tareas o usar las proporcionadas
  const shouldLoadTasks = loadOwnTasks || !externalTasks;

  // Sincronizar tareas externas cuando cambian
  useEffect(() => {
    if (!shouldLoadTasks && externalTasks) {
      setTasks(sortTasksByPriority(externalTasks));
      setInternalLoading(false);
    }
  }, [externalTasks, shouldLoadTasks]);

  useEffect(() => {
    if (shouldLoadTasks) {
      loadTasks();
    }
  }, [initialFilters.role, user?.id, selectedStatus, searchTerm, selectedPriority, shouldLoadTasks]); // Use initialFilters.role instead of filters.role

  const loadTasks = async () => {
    setInternalLoading(true);
    try {
      const taskFilters: TaskFilters = {
        ...initialFilters, // Use initialFilters here
        role,
        status: selectedStatus,
        ...(role === 'entrenador' && user?.id ? { assignedTo: [user.id] } : {}),
        ...(searchTerm ? { search: searchTerm } : {}),
        ...(selectedPriority ? { priority: [selectedPriority as TaskPriority] } : {}),
      };
      const data = await getTasks(taskFilters);
      const sortedTasks = sortTasksByPriority(data);
      setTasks(sortedTasks);

      // Notificar cambios si hay callback
      if (onTasksChange) {
        onTasksChange(sortedTasks);
      }
    } catch (error) {
      console.error('Error cargando tareas:', error);
    } finally {
      setInternalLoading(false);
    }
  };

  const handleCreateTask = async (data: CreateTaskData) => {
    try {
      const newTask = await createTask({
        ...data,
      });
      setShowCreateModal(false);

      if (shouldLoadTasks) {
        await loadTasks();
      } else {
        // Si estamos usando tareas externas, actualizar la lista local y notificar
        const updatedTasks = sortTasksByPriority([...tasks, newTask]);
        setTasks(updatedTasks);
        if (onTasksChange) {
          onTasksChange(updatedTasks);
        }
      }
    } catch (error) {
      console.error('Error creando tarea:', error);
    }
  };

  const handleCompleteTask = async (id: string) => {
    try {
      await completeTask(id);

      if (shouldLoadTasks) {
        await loadTasks();
      } else {
        // Si estamos usando tareas externas, actualizar la lista local y notificar
        const updatedTasks = tasks.map(t =>
          t.id === id ? { ...t, status: 'completada' as TaskStatus } : t
        );
        const sortedTasks = sortTasksByPriority(updatedTasks);
        setTasks(sortedTasks);
        if (onTasksChange) {
          onTasksChange(sortedTasks);
        }
      }
    } catch (error) {
      console.error('Error completando tarea:', error);
    }
  };


  const handleDeleteTask = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta tarea?')) {
      try {
        await deleteTask(id);

        if (shouldLoadTasks) {
          await loadTasks();
        } else {
          // Si estamos usando tareas externas, actualizar la lista local y notificar
          const updatedTasks = tasks.filter(t => t.id !== id);
          const sortedTasks = sortTasksByPriority(updatedTasks);
          setTasks(sortedTasks);
          if (onTasksChange) {
            onTasksChange(sortedTasks);
          }
        }
      } catch (error) {
        console.error('Error eliminando tarea:', error);
      }
    }
  };

  const handleStatusFilter = (status: TaskStatus) => {
    setSelectedStatus(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  useEffect(() => {
    loadTasks();
  }, [selectedStatus, searchTerm, selectedPriority]);

  const columns = [
    {
      key: 'title',
      label: 'Tarea',
      sortable: true,
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
      sortable: true,
      render: (value: TaskPriority) => (
        <Badge className={getPriorityColor(value)}>
          {getPriorityLabel(value)}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      sortable: true,
      render: (value: TaskStatus) => {
        const statusConfig = {
          'pendiente': { label: 'Pendiente', icon: Clock, color: 'text-yellow-600' },
          'en-progreso': { label: 'En Progreso', icon: AlertCircle, color: 'text-blue-600' },
          'completada': { label: 'Completada', icon: CheckCircle2, color: 'text-green-600' },
          'cancelada': { label: 'Cancelada', icon: AlertCircle, color: 'text-gray-600' },
        };
        const config = statusConfig[value] || statusConfig['pendiente'];
        const Icon = config.icon;
        return (
          <div className={`flex items-center gap-2 ${config.color}`}>
            <Icon className="w-4 h-4" />
            <span>{config.label}</span>
          </div>
        );
      },
    },
    {
      key: 'dueDate',
      label: 'Fecha Límite',
      sortable: true,
      render: (value: Date | string | undefined) => {
        if (!value) return <span className="text-gray-400">Sin fecha</span>;
        const date = new Date(value);
        const today = new Date();
        const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        let className = 'text-gray-600';
        if (diffDays < 0) className = 'text-red-600 font-semibold';
        else if (diffDays <= 1) className = 'text-orange-600 font-semibold';

        return (
          <span className={className}>
            {date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
          </span>
        );
      },
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_: any, row: Task) => (
        <div className="flex items-center gap-2">
          {row.status !== 'completada' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleCompleteTask(row.id)}
              className="min-h-[44px] px-3 md:min-h-0 md:px-2"
            >
              <CheckCircle2 className="w-5 h-5 md:w-4 md:h-4 mr-1" />
              <span className="hidden sm:inline">Completar</span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteTask(row.id)}
            className="min-h-[44px] px-3 md:min-h-0 md:px-2"
          >
            <span className="hidden sm:inline">Eliminar</span>
            <Trash2 className="w-5 h-5 md:w-4 md:h-4 sm:hidden" />
          </Button>
        </div>
      ),
    },
  ];

  const pendingTasks = tasks.filter(t => t.status !== 'completada');
  const completedTasks = tasks.filter(t => t.status === 'completada');
  const highPriorityTasks = pendingTasks.filter(t => t.priority === 'alta');

  const activeFiltersCount = selectedStatus.length + (selectedPriority ? 1 : 0) + (searchTerm ? 1 : 0);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus(['pendiente', 'en-progreso']);
    setSelectedPriority('');
  };

  return (
    <div className="space-y-6">
      {/* Texto Explicativo */}
      <Card className="bg-blue-50 border-blue-200 shadow-sm">
        <div className="flex items-start gap-3 p-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <AlertCircle className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-blue-900 font-medium">
              Las tareas que crees aquí aparecerán en el tab Prioridades según su prioridad.
            </p>
          </div>
        </div>
      </Card>

      {/* Toolbar Superior */}
      <div className="flex items-center justify-end">
        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
          className="min-h-[44px] px-4 md:min-h-0"
        >
          <Plus size={20} className="mr-2" />
          <span className="hidden sm:inline">Nueva Tarea</span>
          <span className="sm:hidden">Nueva</span>
        </Button>
      </div>

      {/* KPIs/Métricas */}
      <MetricCards
        data={[
          {
            id: 'pending',
            title: 'Tareas Pendientes',
            value: pendingTasks.length,
            color: 'warning',
          },
          {
            id: 'completed',
            title: 'Tareas Completadas',
            value: completedTasks.length,
            color: 'success',
          },
          {
            id: 'high-priority',
            title: 'Alta Prioridad',
            value: highPriorityTasks.length,
            color: 'error',
          },
        ]}
        columns={3}
      />

      {/* Sistema de Filtros */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="space-y-4">
          {/* Barra de búsqueda */}
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar tareas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                />
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="min-h-[44px] px-3 md:min-h-0"
              >
                <Filter size={18} className="mr-2" />
                <span className="hidden sm:inline">Filtros</span>
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 bg-blue-600 text-white">
                    {activeFiltersCount}
                  </Badge>
                )}
                {showAdvancedFilters ? (
                  <ChevronUp size={16} className="ml-2" />
                ) : (
                  <ChevronDown size={16} className="ml-2" />
                )}
              </Button>
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="min-h-[44px] px-3 md:min-h-0"
                >
                  <X size={18} className="mr-2" />
                  <span className="hidden sm:inline">Limpiar</span>
                </Button>
              )}
            </div>
          </div>

          {/* Panel de filtros avanzados */}
          {showAdvancedFilters && (
            <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Filter size={16} className="inline mr-1" />
                    Estado
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(['pendiente', 'en-progreso', 'completada', 'cancelada'] as TaskStatus[]).map((status) => {
                      const statusLabels: Record<TaskStatus, string> = {
                        'pendiente': 'Pendientes',
                        'en-progreso': 'En Progreso',
                        'completada': 'Completadas',
                        'cancelada': 'Canceladas',
                      };
                      const isSelected = selectedStatus.includes(status);
                      return (
                        <button
                          key={status}
                          onClick={() => handleStatusFilter(status)}
                          className={`px-3 py-2.5 md:py-1.5 rounded-lg text-sm font-medium transition-all min-h-[44px] md:min-h-0 ${isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                        >
                          {statusLabels[status]}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <AlertCircle size={16} className="inline mr-1" />
                    Prioridad
                  </label>
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value as TaskPriority | '')}
                    className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                  >
                    <option value="">Todas</option>
                    <option value="alta">Alta</option>
                    <option value="media">Media</option>
                    <option value="baja">Baja</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Resumen de resultados */}
          {activeFiltersCount > 0 && (
            <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
              <span>{tasks.length} resultado{tasks.length !== 1 ? 's' : ''} encontrado{tasks.length !== 1 ? 's' : ''}</span>
              <span>{activeFiltersCount} filtro{activeFiltersCount !== 1 ? 's' : ''} aplicado{activeFiltersCount !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Lista de Tareas */}
      <Card className="bg-white shadow-sm">
        {tasks.length === 0 && !(externalLoading !== undefined ? externalLoading : internalLoading) ? (
          <div className="p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <CheckSquare className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay tareas aún
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Crea tu primera tarea para comenzar a organizar tu trabajo. Las tareas aparecerán automáticamente en el tab Prioridades según su nivel de prioridad.
            </p>
            <Button
              variant="primary"
              onClick={() => setShowCreateModal(true)}
              size="lg"
              className="min-h-[44px] px-4"
            >
              <Plus size={20} className="mr-2" />
              Crear primera tarea
            </Button>
          </div>
        ) : (
          <Table
            data={tasks}
            columns={columns}
            loading={externalLoading !== undefined ? externalLoading : internalLoading}
            emptyMessage="No hay tareas disponibles"
          />
        )}
      </Card>

      {showCreateModal && (
        <TaskCreator
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateTask}
          role={role}
        />
      )}
    </div>
  );
};

