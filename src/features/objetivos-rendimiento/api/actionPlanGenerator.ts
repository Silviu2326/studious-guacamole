import { Objective, ActionPlan } from '../types';

export interface ActionPlanStep {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  assignedTo?: string;
  assignedToName?: string;
  estimatedHours?: number;
  dependencies?: string[];
  erpTaskId?: string;
  erpSyncStatus?: 'pending' | 'synced' | 'error';
}

export interface GeneratedActionPlan {
  id: string;
  title: string;
  description: string;
  steps: ActionPlanStep[];
  estimatedCompletionDate: string;
  totalEstimatedHours: number;
  alignedWithERP: boolean;
  erpProjectId?: string;
}

/**
 * Genera un plan de acción inteligente basado en objetivos seleccionados
 */
export const generateIntelligentActionPlan = async (
  objectives: Objective[],
  role: 'entrenador' | 'gimnasio',
  syncWithERP: boolean = true
): Promise<GeneratedActionPlan> => {
  // Simular delay de generación
  await new Promise(resolve => setTimeout(resolve, 2000));

  const steps: ActionPlanStep[] = [];
  let totalEstimatedHours = 0;
  const baseDate = new Date();
  
  // Generar pasos basados en los objetivos
  objectives.forEach((objective, objIndex) => {
    const objectiveSteps = generateStepsForObjective(objective, baseDate, objIndex);
    steps.push(...objectiveSteps);
    totalEstimatedHours += objectiveSteps.reduce((sum, step) => sum + (step.estimatedHours || 0), 0);
  });

  // Ordenar pasos por prioridad y fecha
  steps.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  // Calcular fecha de finalización estimada
  const latestDate = steps.reduce((latest, step) => {
    const stepDate = new Date(step.dueDate);
    return stepDate > latest ? stepDate : latest;
  }, baseDate);

  // Sincronizar con ERP si está habilitado
  let erpProjectId: string | undefined;
  if (syncWithERP) {
    erpProjectId = await createERPProject(objectives, steps);
    // Marcar pasos como sincronizados
    steps.forEach(step => {
      step.erpSyncStatus = 'synced';
      step.erpTaskId = `erp_task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    });
  }

  const planTitle = `Plan de Acción: ${objectives.map(obj => obj.title).join(', ')}`;
  const planDescription = `Plan de acción generado automáticamente para ${objectives.length} objetivo(s) seleccionado(s). 
    Incluye ${steps.length} pasos con tareas, responsables y fechas alineadas con el ERP.`;

  return {
    id: `action_plan_${Date.now()}`,
    title: planTitle,
    description: planDescription,
    steps,
    estimatedCompletionDate: latestDate.toISOString(),
    totalEstimatedHours,
    alignedWithERP: syncWithERP,
    erpProjectId,
  };
};

/**
 * Genera pasos específicos para un objetivo
 */
const generateStepsForObjective = (
  objective: Objective,
  baseDate: Date,
  objectiveIndex: number
): ActionPlanStep[] => {
  const steps: ActionPlanStep[] = [];
  const daysUntilDeadline = Math.ceil(
    (new Date(objective.deadline).getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Paso 1: Análisis inicial
  steps.push({
    id: `step_${objective.id}_1`,
    title: `Análisis inicial: ${objective.title}`,
    description: `Analizar el estado actual del objetivo "${objective.title}". 
      Progreso actual: ${objective.progress.toFixed(0)}%. 
      Valor actual: ${objective.currentValue} ${objective.unit} / Objetivo: ${objective.targetValue} ${objective.unit}.`,
    dueDate: new Date(baseDate.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: objective.status === 'at_risk' ? 'high' : 'medium',
    assignedToName: objective.responsibleName || objective.responsible || 'Sin asignar',
    estimatedHours: 2,
  });

  // Paso 2: Definir acciones específicas
  const gap = objective.targetValue - objective.currentValue;
  const progressNeeded = 100 - objective.progress;
  
  if (progressNeeded > 0) {
    steps.push({
      id: `step_${objective.id}_2`,
      title: `Definir acciones para alcanzar ${objective.title}`,
      description: `Definir acciones concretas para cerrar la brecha de ${gap.toFixed(2)} ${objective.unit} 
        y alcanzar el ${progressNeeded.toFixed(0)}% de progreso restante.`,
      dueDate: new Date(baseDate.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: objective.status === 'at_risk' ? 'high' : 'medium',
      assignedToName: objective.responsibleName || objective.responsible || 'Sin asignar',
      estimatedHours: 4,
      dependencies: [`step_${objective.id}_1`],
    });
  }

  // Paso 3: Implementar acciones
  steps.push({
    id: `step_${objective.id}_3`,
    title: `Implementar acciones para ${objective.title}`,
    description: `Ejecutar las acciones definidas para alcanzar el objetivo "${objective.title}". 
      Monitorear el progreso semanalmente.`,
    dueDate: new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: objective.status === 'at_risk' ? 'high' : 'medium',
    assignedToName: objective.responsibleName || objective.responsible || 'Sin asignar',
    estimatedHours: Math.max(8, Math.ceil(daysUntilDeadline * 0.5)),
    dependencies: [`step_${objective.id}_2`],
  });

  // Paso 4: Checkpoint intermedio
  if (daysUntilDeadline > 14) {
    const checkpointDate = new Date(
      baseDate.getTime() + Math.floor(daysUntilDeadline / 2) * 24 * 60 * 60 * 1000
    );
    steps.push({
      id: `step_${objective.id}_4`,
      title: `Checkpoint intermedio: ${objective.title}`,
      description: `Revisar el progreso del objetivo "${objective.title}" y ajustar acciones si es necesario.`,
      dueDate: checkpointDate.toISOString().split('T')[0],
      priority: 'medium',
      assignedToName: objective.responsibleName || objective.responsible || 'Sin asignar',
      estimatedHours: 2,
      dependencies: [`step_${objective.id}_3`],
    });
  }

  // Paso 5: Revisión final
  steps.push({
    id: `step_${objective.id}_5`,
    title: `Revisión final: ${objective.title}`,
    description: `Revisar el cumplimiento del objetivo "${objective.title}" antes de la fecha límite.`,
    dueDate: new Date(
      new Date(objective.deadline).getTime() - 3 * 24 * 60 * 60 * 1000
    ).toISOString().split('T')[0],
    priority: 'high',
    assignedToName: objective.responsibleName || objective.responsible || 'Sin asignar',
    estimatedHours: 3,
    dependencies: [`step_${objective.id}_3`],
  });

  return steps;
};

/**
 * Crea un proyecto en el ERP y sincroniza las tareas
 */
const createERPProject = async (
  objectives: Objective[],
  steps: ActionPlanStep[]
): Promise<string> => {
  // Simular delay de sincronización con ERP
  await new Promise(resolve => setTimeout(resolve, 1000));

  // En producción, aquí se haría la llamada real al ERP
  // Por ahora simulamos la creación del proyecto
  const projectId = `erp_project_${Date.now()}`;

  // Simular creación de tareas en el ERP
  steps.forEach(step => {
    // En producción, aquí se crearían las tareas en el ERP
    // con la información de responsable, fecha, prioridad, etc.
    console.log(`Creating ERP task for step: ${step.title}`);
  });

  return projectId;
};

/**
 * Sincroniza el plan de acción con el ERP
 */
export const syncActionPlanWithERP = async (
  plan: GeneratedActionPlan,
  objectives: Objective[]
): Promise<void> => {
  // Simular delay de sincronización
  await new Promise(resolve => setTimeout(resolve, 1500));

  // En producción, aquí se sincronizarían las tareas con el ERP
  // Actualizando responsables, fechas, estados, etc.
  console.log(`Syncing action plan ${plan.id} with ERP`);
  console.log(`ERP Project ID: ${plan.erpProjectId}`);
  console.log(`Steps to sync: ${plan.steps.length}`);

  // Marcar todos los pasos como sincronizados
  plan.steps.forEach(step => {
    step.erpSyncStatus = 'synced';
  });
};

