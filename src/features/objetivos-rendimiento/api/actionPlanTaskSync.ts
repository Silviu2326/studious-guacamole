import { Objective, ActionPlan } from '../types';
import { Task, TaskPriority, UpdateTaskData } from '../../../features/tareas-alertas/types';
import { updateTask, getTask } from '../../../features/tareas-alertas/api/tasks';

/**
 * User Story 1: Sincroniza tareas y prioridades en Tareas & Alertas cuando se modifica un objetivo
 * Actualiza las tareas relacionadas con los planes de acción del objetivo
 */
export const syncActionPlanTasksWithObjective = async (
  objective: Objective,
  previousObjective?: Objective
): Promise<void> => {
  // Si el objetivo no tiene planes de acción vinculados, no hay nada que sincronizar
  if (!objective.links?.actionPlans || objective.links.actionPlans.length === 0) {
    return;
  }

  // Determinar la nueva prioridad basada en el estado del objetivo
  const newPriority = calculateTaskPriorityFromObjective(objective);
  
  // Determinar si hay cambios significativos que requieran actualización
  const hasSignificantChanges = previousObjective ? 
    hasSignificantObjectiveChanges(objective, previousObjective) : true;

  if (!hasSignificantChanges) {
    return;
  }

  // Para cada plan de acción vinculado, actualizar las tareas relacionadas
  for (const actionPlan of objective.links.actionPlans) {
    await updateTasksFromActionPlan(actionPlan, objective, newPriority);
  }
};

/**
 * Calcula la prioridad de tarea basada en el estado del objetivo
 */
const calculateTaskPriorityFromObjective = (objective: Objective): TaskPriority => {
  // Si el objetivo está en riesgo o fallido, las tareas deben ser de alta prioridad
  if (objective.status === 'at_risk' || objective.status === 'failed') {
    return 'alta';
  }
  
  // Si el progreso es bajo, prioridad alta
  if (objective.progress < 50) {
    return 'alta';
  }
  
  // Si el objetivo está cerca de la fecha límite, prioridad media o alta
  const now = new Date();
  const deadline = new Date(objective.deadline);
  const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilDeadline <= 7) {
    return 'alta';
  } else if (daysUntilDeadline <= 30) {
    return 'media';
  }
  
  return 'media';
};

/**
 * Verifica si hay cambios significativos en el objetivo que requieran actualización de tareas
 */
const hasSignificantObjectiveChanges = (
  current: Objective,
  previous: Objective
): boolean => {
  // Cambios en estado
  if (current.status !== previous.status) {
    return true;
  }
  
  // Cambios significativos en progreso (más del 10%)
  if (Math.abs(current.progress - previous.progress) > 10) {
    return true;
  }
  
  // Cambios en fecha límite
  if (current.deadline !== previous.deadline) {
    return true;
  }
  
  // Cambios en valor objetivo o actual
  if (current.targetValue !== previous.targetValue || 
      current.currentValue !== previous.currentValue) {
    return true;
  }
  
  return false;
};

/**
 * Actualiza las tareas relacionadas con un plan de acción
 */
const updateTasksFromActionPlan = async (
  actionPlan: ActionPlan,
  objective: Objective,
  newPriority: TaskPriority
): Promise<void> => {
  // Buscar tareas relacionadas con este plan de acción
  // Las tareas relacionadas pueden estar identificadas por el ID del plan de acción
  // o por el ID del objetivo en el campo relatedEntityId
  
  try {
    // Obtener todas las tareas del sistema (en producción esto sería una búsqueda más eficiente)
    // Las tareas se almacenan en memoria en el módulo tasks.ts, así que las obtenemos mediante la API
    const { getTasks } = await import('../../../features/tareas-alertas/api/tasks');
    const tasks = await getTasks();
    
    // Buscar tareas relacionadas con este objetivo o plan de acción
    const relatedTasks = tasks.filter(task => {
      // Tareas vinculadas directamente al objetivo
      if (objective.links?.linkedTasks?.some(link => link.taskId === task.id)) {
        return true;
      }
      
      // Tareas que mencionan el objetivo en su título o descripción
      if (task.title.toLowerCase().includes(objective.title.toLowerCase()) ||
          task.description?.toLowerCase().includes(objective.title.toLowerCase())) {
        return true;
      }
      
      // Tareas relacionadas con pasos del plan de acción
      if (actionPlan.steps.some(step => 
        task.title.toLowerCase().includes(step.title.toLowerCase()) ||
        task.description?.toLowerCase().includes(step.title.toLowerCase())
      )) {
        return true;
      }
      
      return false;
    });
    
    // Actualizar cada tarea relacionada
    for (const task of relatedTasks) {
      const updates: UpdateTaskData = {
        priority: newPriority,
      };
      
      // Si el objetivo cambió de estado a "at_risk" o "failed", actualizar descripción
      if (objective.status === 'at_risk' || objective.status === 'failed') {
        const statusMessage = objective.status === 'at_risk' 
          ? 'Objetivo en riesgo - requiere atención inmediata'
          : 'Objetivo fallido - revisar estrategia';
        
        updates.description = `${task.description || ''}\n\n[Actualizado automáticamente] ${statusMessage}. Progreso actual: ${objective.progress.toFixed(0)}%`;
      }
      
      // Actualizar la tarea
      await updateTask(task.id, updates);
    }
    
    // Crear nuevas tareas si el plan de acción tiene pasos que no tienen tareas asociadas
    await createMissingTasksFromActionPlan(actionPlan, objective, newPriority);
    
  } catch (error) {
    console.error('Error updating tasks from action plan:', error);
    // No lanzar error para no interrumpir el flujo principal
  }
};

/**
 * Crea tareas faltantes basadas en los pasos del plan de acción
 */
const createMissingTasksFromActionPlan = async (
  actionPlan: ActionPlan,
  objective: Objective,
  priority: TaskPriority
): Promise<void> => {
  try {
    const { createTask, getTasks } = await import('../../../features/tareas-alertas/api/tasks');
    const existingTasks = await getTasks();
    
    // Para cada paso del plan de acción, verificar si existe una tarea
    for (const step of actionPlan.steps) {
      // Verificar si ya existe una tarea para este paso
      const taskExists = existingTasks.some(task => 
        task.title.toLowerCase().includes(step.title.toLowerCase()) ||
        (task.description?.toLowerCase().includes(step.title.toLowerCase()) && 
         task.relatedEntityId === objective.id)
      );
      
      if (!taskExists && !step.completed) {
        // Crear nueva tarea para este paso
        await createTask({
          title: step.title,
          description: `${step.description}\n\nRelacionado con objetivo: ${objective.title}`,
          priority: step.priority === 'high' ? 'alta' : step.priority === 'medium' ? 'media' : 'baja',
          assignedTo: step.assignedTo,
          dueDate: step.dueDate,
          category: 'objetivo',
          relatedEntityId: objective.id,
          relatedEntityType: 'otro',
          tags: ['plan-accion', 'objetivo', objective.id],
        });
      }
    }
  } catch (error) {
    console.error('Error creating missing tasks from action plan:', error);
  }
};

