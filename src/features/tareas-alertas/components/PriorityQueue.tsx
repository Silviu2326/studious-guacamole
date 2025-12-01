import React, { useState, useEffect } from 'react';
import { Card, Badge } from '../../../components/componentsreutilizables';
import { Task, TaskPriority, TaskFilters } from '../types';
import { 
  getTasksByPriority, 
  updateTask, 
  completeTask, 
  deleteTask,
  getPriorityColor, 
  getPriorityLabel, 
  getTaskPriorityCardStyles,
  getTaskPriorityIconColor 
} from '../api';
import { AlertCircle, Clock, CheckCircle2, ArrowRight, Loader2, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface PriorityQueueProps {
  role: 'entrenador' | 'gimnasio';
  /**
   * Lista de tareas filtradas. Si se proporciona, el componente usará estas tareas
   * en lugar de cargarlas internamente. Esto permite compartir la misma fuente de datos
   * con TasksManager.
   */
  tasks?: Task[];
  /**
   * Filtros aplicados a las tareas. Se usa cuando tasks no está proporcionado
   * para cargar las tareas con los mismos filtros que TasksManager.
   */
  filters?: TaskFilters;
  /**
   * Callback cuando una tarea se actualiza (completar, editar, etc.)
   * Permite sincronizar cambios con TasksManager.
   */
  onTaskUpdate?: () => void;
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

export const PriorityQueue: React.FC<PriorityQueueProps> = ({ 
  role, 
  tasks: externalTasks,
  filters,
  onTaskUpdate,
  loadOwnTasks = false,
  loading: externalLoading
}) => {
  const [tasksByPriority, setTasksByPriority] = useState<Record<TaskPriority, Task[]>>({
    alta: [],
    media: [],
    baja: [],
  });
  const [internalLoading, setInternalLoading] = useState(true);
  const [completingTasks, setCompletingTasks] = useState<Set<string>>(new Set());
  const [animatingTasks, setAnimatingTasks] = useState<Set<string>>(new Set());
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  // Determinar si debemos cargar tareas o usar las proporcionadas
  const shouldLoadTasks = loadOwnTasks || !externalTasks;

  useEffect(() => {
    if (shouldLoadTasks) {
      loadTasks();
    } else {
      // Usar tareas proporcionadas
      organizeTasksByPriority(externalTasks || []);
      setInternalLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, externalTasks, filters, shouldLoadTasks]);

  const loadTasks = async () => {
    setInternalLoading(true);
    try {
      const data = await getTasksByPriority(filters);
      setTasksByPriority(data);
    } catch (error) {
      console.error('Error cargando tareas por prioridad:', error);
    } finally {
      setInternalLoading(false);
    }
  };

  const organizeTasksByPriority = (tasks: Task[]) => {
    // Filtrar solo tareas no completadas
    const activeTasks = tasks.filter(t => t.status !== 'completada');
    
    setTasksByPriority({
      alta: activeTasks.filter(t => t.priority === 'alta'),
      media: activeTasks.filter(t => t.priority === 'media'),
      baja: activeTasks.filter(t => t.priority === 'baja'),
    });
  };

  const handleTaskUpdate = async () => {
    if (onTaskUpdate) {
      onTaskUpdate();
    } else if (shouldLoadTasks) {
      // Si no hay callback pero estamos en modo auto-carga, recargar
      await loadTasks();
    }
  };

  /**
   * Maneja la completación de una tarea con animación suave
   * FASE FUTURA: Esta acción se conectará con estadísticas de productividad en el Historial
   * para trackear métricas como: tiempo promedio de completación, tareas completadas por día,
   * productividad por prioridad, etc.
   */
  const handleCompleteTask = async (task: Task) => {
    // Marcar tarea como completando para deshabilitar interacción
    setCompletingTasks(prev => new Set(prev).add(task.id));
    
    // Iniciar animación de fade out / slide
    setAnimatingTasks(prev => new Set(prev).add(task.id));
    
    try {
      // Completar la tarea en la API
      await completeTask(task.id);
      
      // Esperar a que la animación termine (300ms)
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Remover la tarea de la vista localmente
      if (shouldLoadTasks) {
        // Si estamos en modo auto-carga, recargar tareas
        await loadTasks();
      } else if (externalTasks) {
        // Si usamos tareas externas, actualizar la organización
        const updatedTasks = externalTasks.filter(t => t.id !== task.id);
        organizeTasksByPriority(updatedTasks);
      }
      
      // Notificar al componente padre si existe callback
      await handleTaskUpdate();
    } catch (error) {
      console.error('Error completando tarea:', error);
      // Revertir estado de animación en caso de error
      setCompletingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(task.id);
        return newSet;
      });
      setAnimatingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(task.id);
        return newSet;
      });
    } finally {
      // Limpiar estados después de un breve delay
      setTimeout(() => {
        setCompletingTasks(prev => {
          const newSet = new Set(prev);
          newSet.delete(task.id);
          return newSet;
        });
        setAnimatingTasks(prev => {
          const newSet = new Set(prev);
          newSet.delete(task.id);
          return newSet;
        });
      }, 350);
    }
  };

  const getPriorityIcon = (priority: TaskPriority) => {
    const iconColor = getTaskPriorityIconColor(priority);
    switch (priority) {
      case 'alta':
        return <AlertCircle className={`w-5 h-5 ${iconColor}`} />;
      case 'media':
        return <Clock className={`w-5 h-5 ${iconColor}`} />;
      case 'baja':
        return <CheckCircle2 className={`w-5 h-5 ${iconColor}`} />;
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
            tasks.map((task) => {
              const isCompleting = completingTasks.has(task.id);
              const isAnimating = animatingTasks.has(task.id);
              const isExpanded = expandedCards.has(task.id);
              const cardStyles = getTaskPriorityCardStyles(task.priority);
              
              return (
                <Card 
                  key={task.id} 
                  variant="hover" 
                  className={`md:p-4 p-3 shadow-sm transition-all duration-300 ${
                    cardStyles.background
                  } ${cardStyles.border} ${cardStyles.borderColor} ${
                    isAnimating ? 'animate-in fade-out slide-out-up opacity-0' : 'opacity-100'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2 gap-3 relative">
                    {/* Badge de prioridad en esquina superior derecha */}
                    <div className="absolute top-2 right-2 md:relative md:top-0 md:right-0 md:ml-auto z-10">
                      <Badge className={getPriorityColor(task.priority)}>
                        {getPriorityLabel(task.priority)}
                      </Badge>
                    </div>

                    <div className="flex items-start gap-3 flex-1 pr-16 md:pr-0">
                      {/* Checkbox para completar tarea - más grande en móvil */}
                      <button
                        onClick={() => handleCompleteTask(task)}
                        disabled={isCompleting}
                        className={`
                          flex-shrink-0 mt-0.5 w-6 h-6 md:w-5 md:h-5 rounded border-2 
                          flex items-center justify-center
                          transition-all duration-200
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
                          ${
                            isCompleting
                              ? 'bg-blue-100 border-blue-400 cursor-wait'
                              : 'bg-white border-gray-300 hover:border-blue-500 hover:bg-blue-50 cursor-pointer active:scale-95'
                          }
                        `}
                        aria-label={`Completar tarea: ${task.title}`}
                        title="Marcar como completada"
                      >
                        {isCompleting ? (
                          <Loader2 className="w-4 h-4 md:w-3 md:h-3 text-blue-600 animate-spin" />
                        ) : null}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-gray-900 line-clamp-1 md:line-clamp-none">
                            {task.title}
                          </h4>
                          {/* Botón expandir/colapsar en móvil */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedCards(prev => {
                                const newSet = new Set(prev);
                                if (newSet.has(task.id)) {
                                  newSet.delete(task.id);
                                } else {
                                  newSet.add(task.id);
                                }
                                return newSet;
                              });
                            }}
                            className="md:hidden flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
                            aria-label={isExpanded ? 'Colapsar' : 'Expandir'}
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-gray-600" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-600" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {task.description && (
                    <p className={`text-sm text-gray-600 mb-2 ml-8 md:ml-8 ${
                      isExpanded ? '' : 'hidden md:block'
                    }`}>
                      {task.description}
                    </p>
                  )}
                  <div className={`flex items-center justify-between mt-3 pt-3 border-t border-gray-100 ${
                    isExpanded ? '' : 'hidden md:flex'
                  }`}>
                    {task.dueDate && (
                      <span className="text-xs text-gray-500">
                        {new Date(task.dueDate).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                        })}
                      </span>
                    )}
                    <div className="flex items-center gap-2">
                      {isCompleting && (
                        <span className="text-xs text-blue-600 font-medium">
                          Completando...
                        </span>
                      )}
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    );
  };

  const loading = externalLoading !== undefined ? externalLoading : internalLoading;

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

