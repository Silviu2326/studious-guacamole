import { Objective, ObjectiveFilters, ActionPlan, ColorThresholds, AutomaticAlert, ObjectiveCheckIn, CheckInEvidence, CheckInComment, QuickTask, QuickAdjustment, ObjectiveDependency, DependencyImpact } from '../types';

// Mock data - En producción esto sería llamadas a una API real
const mockObjectives: Objective[] = [
  {
    id: '1',
    title: 'Facturación Mensual',
    description: 'Alcanzar objetivo de facturación mensual',
    metric: 'facturacion',
    targetValue: 50000,
    currentValue: 35000,
    unit: '€',
    deadline: '2024-12-31',
    status: 'in_progress',
    responsible: 'user-1',
    responsibleName: 'Juan Pérez',
    category: 'financiero',
    progress: 70,
    createdAt: '2024-01-01',
    updatedAt: '2024-11-15',
    links: {
      linkedKPIs: [],
      linkedTasks: [],
      actionPlans: [],
    },
    checkIns: [],
    quickTasks: [],
    quickAdjustments: [],
    dependencies: {
      feeds: [],
      fedBy: [],
    },
  },
  {
    id: '2',
    title: 'Adherencia de Clientes',
    description: 'Mantener adherencia superior al 80%',
    metric: 'adherencia',
    targetValue: 80,
    currentValue: 75,
    unit: '%',
    deadline: '2024-12-31',
    status: 'in_progress',
    responsible: 'user-2',
    responsibleName: 'María García',
    category: 'operacional',
    progress: 93.75,
    createdAt: '2024-01-01',
    updatedAt: '2024-11-15',
    links: {
      linkedKPIs: [],
      linkedTasks: [],
      actionPlans: [],
    },
    checkIns: [],
    quickTasks: [],
    quickAdjustments: [],
    dependencies: {
      feeds: [],
      fedBy: [],
    },
  },
  {
    id: '3',
    title: 'Retención de Clientes',
    description: 'Mantener tasa de retención superior al 80%',
    metric: 'retencion',
    targetValue: 80,
    currentValue: 65,
    unit: '%',
    deadline: '2024-12-31',
    status: 'at_risk',
    responsible: 'user-3',
    responsibleName: 'Carlos López',
    category: 'operacional',
    progress: 81.25,
    createdAt: '2024-01-01',
    updatedAt: '2024-11-15',
    links: {
      linkedKPIs: [],
      linkedTasks: [],
      actionPlans: [],
    },
    checkIns: [],
    quickTasks: [],
    quickAdjustments: [],
    dependencies: {
      feeds: [],
      fedBy: [],
    },
  },
];

export const getObjectives = async (filters?: ObjectiveFilters, role?: 'entrenador' | 'gimnasio'): Promise<Objective[]> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Load from localStorage if available
  const savedObjectives = localStorage.getItem('objectives-data');
  let objectives = savedObjectives ? JSON.parse(savedObjectives) : [...mockObjectives];
  
  // Initialize links and new properties if not present
  objectives = objectives.map((obj: Objective) => ({
    ...obj,
    links: obj.links || {
      linkedKPIs: [],
      linkedTasks: [],
      actionPlans: [],
    },
    checkIns: obj.checkIns || [],
    quickTasks: obj.quickTasks || [],
    quickAdjustments: obj.quickAdjustments || [],
    dependencies: obj.dependencies || {
      feeds: [],
      fedBy: [],
    },
  }));
  
  let filtered = [...objectives];
  
  if (filters?.status) {
    filtered = filtered.filter(obj => obj.status === filters.status);
  }
  
  if (filters?.category) {
    filtered = filtered.filter(obj => obj.category === filters.category);
  }
  
  // User Story: Filtrar por versión y clonación
  if (filters?.parentObjectiveId) {
    filtered = filtered.filter(obj => obj.version?.parentObjectiveId === filters.parentObjectiveId);
  }
  
  if (filters?.isClone !== undefined) {
    filtered = filtered.filter(obj => obj.version?.isClone === filters.isClone);
  }
  
  if (filters?.version) {
    filtered = filtered.filter(obj => obj.version?.version === filters.version);
  }
  
  // User Story: Filtrar por archivado
  if (filters?.archived !== undefined) {
    filtered = filtered.filter(obj => (obj.archived || false) === filters.archived);
  } else {
    // Por defecto, excluir archivados si no se especifica
    filtered = filtered.filter(obj => !obj.archived);
  }
  
  // Filtrar por rol - ajustar objetivos según el tipo de usuario
  if (role === 'entrenador') {
    filtered = filtered.filter(obj => 
      ['facturacion', 'adherencia', 'retencion'].includes(obj.metric)
    );
  } else if (role === 'gimnasio') {
    filtered = filtered.filter(obj => 
      ['facturacion', 'ocupacion', 'tasa_bajas', 'objetivos_comerciales'].includes(obj.metric)
    );
  }
  
  return filtered;
};

export const getObjective = async (id: string): Promise<Objective | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Load from localStorage if available
  const savedObjectives = localStorage.getItem('objectives-data');
  const objectives = savedObjectives ? JSON.parse(savedObjectives) : [...mockObjectives];
  
  const objective = objectives.find((obj: Objective) => obj.id === id);
  if (!objective) return null;
  
  // Ensure links structure exists
  if (!objective.links) {
    objective.links = {
      linkedKPIs: [],
      linkedTasks: [],
      actionPlans: [],
    };
  }
  
  return objective;
};

export const createObjective = async (objective: Omit<Objective, 'id' | 'createdAt' | 'updatedAt' | 'progress'>): Promise<Objective> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newObjective: Objective = {
    ...objective,
    id: Date.now().toString(),
    progress: Math.min((objective.currentValue / objective.targetValue) * 100, 100),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    links: objective.links || {
      linkedKPIs: [],
      linkedTasks: [],
      actionPlans: [],
    },
  };
  
  // Load existing objectives
  const savedObjectives = localStorage.getItem('objectives-data');
  const objectives = savedObjectives ? JSON.parse(savedObjectives) : [...mockObjectives];
  objectives.push(newObjective);
  localStorage.setItem('objectives-data', JSON.stringify(objectives));
  
  // User Story 2: Registrar en historial de auditoría
  try {
    const { recordObjectiveChange } = await import('./auditHistory');
    await recordObjectiveChange(
      newObjective,
      null,
      'create',
      'user', // En producción, usar el ID del usuario actual
      'Usuario', // En producción, usar el nombre del usuario actual
      undefined, // Email del usuario
    );
  } catch (error) {
    console.error('Error recording audit history:', error);
    // No lanzar error para no interrumpir el flujo principal
  }
  
  return newObjective;
};

export const updateObjective = async (id: string, updates: Partial<Objective>): Promise<Objective> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Load existing objectives
  const savedObjectives = localStorage.getItem('objectives-data');
  const objectives = savedObjectives ? JSON.parse(savedObjectives) : [...mockObjectives];
  
  const index = objectives.findIndex((obj: Objective) => obj.id === id);
  if (index === -1) throw new Error('Objective not found');
  
  // Guardar el objetivo anterior para comparar cambios
  const previousObjective = { ...objectives[index] };
  
  const updated = {
    ...objectives[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  // Ensure links structure exists
  if (!updated.links) {
    updated.links = {
      linkedKPIs: [],
      linkedTasks: [],
      actionPlans: [],
    };
  }
  
  if (updates.currentValue !== undefined || updates.targetValue !== undefined) {
    updated.progress = Math.min((updated.currentValue / updated.targetValue) * 100, 100);
    
    if (updated.progress >= 100) {
      updated.status = 'achieved';
    } else if (updated.progress < 50 && updated.status === 'in_progress') {
      updated.status = 'at_risk';
    }
    
    // User Story: Verificar umbrales de color y generar alertas automáticas
    if (updated.colorThresholds?.enabled && updated.automaticAlerts?.enabled) {
      checkAndGenerateThresholdAlerts(updated);
    }
  }
  
  objectives[index] = updated;
  localStorage.setItem('objectives-data', JSON.stringify(objectives));
  
  // User Story 2: Registrar en historial de auditoría
  try {
    const { recordObjectiveChange } = await import('./auditHistory');
    const action = previousObjective.status !== updated.status ? 'status_change' : 'update';
    await recordObjectiveChange(
      updated,
      previousObjective,
      action,
      'user', // En producción, usar el ID del usuario actual
      'Usuario', // En producción, usar el nombre del usuario actual
      undefined, // Email del usuario
      undefined, // Razón del cambio
      action === 'status_change' ? {
        previousStatus: previousObjective.status,
        newStatus: updated.status,
      } : undefined,
    );
  } catch (error) {
    console.error('Error recording audit history:', error);
    // No lanzar error para no interrumpir el flujo principal
  }
  
  // User Story 1: Sincronizar tareas y prioridades en Tareas & Alertas cuando se modifica un objetivo
  try {
    const { syncActionPlanTasksWithObjective } = await import('./actionPlanTaskSync');
    await syncActionPlanTasksWithObjective(updated, previousObjective);
  } catch (error) {
    console.error('Error syncing action plan tasks with objective:', error);
    // No lanzar error para no interrumpir el flujo principal
  }

  // User Story 1: Registrar aprendizaje cuando un objetivo se completa o falla
  if ((updated.status === 'achieved' || updated.status === 'failed') && 
      previousObjective.status !== 'achieved' && previousObjective.status !== 'failed') {
    try {
      const { recordObjectiveLearning } = await import('./objectiveLearning');
      await recordObjectiveLearning(updated);
    } catch (error) {
      console.error('Error recording objective learning:', error);
      // No lanzar error para no interrumpir el flujo principal
    }
  }
  
  return updated;
};

export const deleteObjective = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Load existing objectives
  const savedObjectives = localStorage.getItem('objectives-data');
  const objectives = savedObjectives ? JSON.parse(savedObjectives) : [...mockObjectives];
  
  const objectiveToDelete = objectives.find((obj: Objective) => obj.id === id);
  
  const filtered = objectives.filter((obj: Objective) => obj.id !== id);
  localStorage.setItem('objectives-data', JSON.stringify(filtered));
  
  // User Story 2: Registrar en historial de auditoría
  if (objectiveToDelete) {
    try {
      const { recordObjectiveChange } = await import('./auditHistory');
      await recordObjectiveChange(
        objectiveToDelete,
        null,
        'delete',
        'user', // En producción, usar el ID del usuario actual
        'Usuario', // En producción, usar el nombre del usuario actual
      );
    } catch (error) {
      console.error('Error recording audit history:', error);
      // No lanzar error para no interrumpir el flujo principal
    }
  }
};

export const getObjectiveProgress = async (id: string): Promise<{ progress: number; status: string }> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Load existing objectives
  const savedObjectives = localStorage.getItem('objectives-data');
  const objectives = savedObjectives ? JSON.parse(savedObjectives) : [...mockObjectives];
  
  const objective = objectives.find((obj: Objective) => obj.id === id);
  if (!objective) throw new Error('Objective not found');
  
  return {
    progress: objective.progress,
    status: objective.status,
  };
};

// User Story: Función para clonar objetivos
export const cloneObjective = async (
  id: string,
  versionName: string,
  versionNotes?: string,
  clonedBy?: string
): Promise<Objective> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Load existing objectives
  const savedObjectives = localStorage.getItem('objectives-data');
  const objectives = savedObjectives ? JSON.parse(savedObjectives) : [...mockObjectives];
  
  const originalObjective = objectives.find((obj: Objective) => obj.id === id);
  if (!originalObjective) throw new Error('Objective not found');
  
  // Crear clon del objetivo
  const clonedObjective: Objective = {
    ...originalObjective,
    id: `clone_${Date.now()}`,
    title: `${originalObjective.title} - ${versionName}`,
    status: 'not_started',
    currentValue: 0,
    progress: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: {
      version: versionName,
      parentObjectiveId: id,
      isClone: true,
      clonedAt: new Date().toISOString(),
      clonedBy: clonedBy || 'user',
      versionNotes: versionNotes || '',
    },
    links: {
      linkedKPIs: [], // Los links no se clonan por defecto
      linkedTasks: [],
      actionPlans: [],
    },
  };
  
  objectives.push(clonedObjective);
  localStorage.setItem('objectives-data', JSON.stringify(objectives));
  
  // User Story 2: Registrar en historial de auditoría
  try {
    const { recordObjectiveChange } = await import('./auditHistory');
    await recordObjectiveChange(
      clonedObjective,
      originalObjective,
      'clone',
      clonedBy || 'user',
      'Usuario', // En producción, usar el nombre del usuario actual
      undefined,
      versionNotes || undefined,
      {
        parentObjectiveId: id,
        versionName,
      },
    );
  } catch (error) {
    console.error('Error recording audit history:', error);
    // No lanzar error para no interrumpir el flujo principal
  }
  
  return clonedObjective;
};

// User Story: Función para obtener versiones de un objetivo
export const getObjectiveVersions = async (parentObjectiveId: string): Promise<Objective[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Load existing objectives
  const savedObjectives = localStorage.getItem('objectives-data');
  const objectives = savedObjectives ? JSON.parse(savedObjectives) : [...mockObjectives];
  
  return objectives.filter((obj: Objective) => 
    obj.version?.parentObjectiveId === parentObjectiveId || obj.id === parentObjectiveId
  );
};

// User Story: Función para vincular KPI a un objetivo
export const linkKPIToObjective = async (
  objectiveId: string,
  kpiId: string,
  kpiName: string,
  weight?: number
): Promise<Objective> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Load existing objectives
  const savedObjectives = localStorage.getItem('objectives-data');
  const objectives = savedObjectives ? JSON.parse(savedObjectives) : [...mockObjectives];
  
  const objective = objectives.find((obj: Objective) => obj.id === objectiveId);
  if (!objective) throw new Error('Objective not found');
  
  if (!objective.links) {
    objective.links = {
      linkedKPIs: [],
      linkedTasks: [],
      actionPlans: [],
    };
  }
  
  // Verificar si el KPI ya está vinculado
  const existingLink = objective.links.linkedKPIs.find(link => link.kpiId === kpiId);
  if (existingLink) {
    // Actualizar peso si se proporciona
    if (weight !== undefined) {
      existingLink.weight = weight;
    }
  } else {
    // Añadir nuevo vínculo
    objective.links.linkedKPIs.push({
      kpiId,
      kpiName,
      linkedAt: new Date().toISOString(),
      weight: weight || 0,
    });
  }
  
  objective.updatedAt = new Date().toISOString();
  localStorage.setItem('objectives-data', JSON.stringify(objectives));
  
  return objective;
};

// User Story: Función para desvincular KPI de un objetivo
export const unlinkKPIFromObjective = async (
  objectiveId: string,
  kpiId: string
): Promise<Objective> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Load existing objectives
  const savedObjectives = localStorage.getItem('objectives-data');
  const objectives = savedObjectives ? JSON.parse(savedObjectives) : [...mockObjectives];
  
  const objective = objectives.find((obj: Objective) => obj.id === objectiveId);
  if (!objective) throw new Error('Objective not found');
  
  if (!objective.links) {
    objective.links = {
      linkedKPIs: [],
      linkedTasks: [],
      actionPlans: [],
    };
  }
  
  objective.links.linkedKPIs = objective.links.linkedKPIs.filter(
    link => link.kpiId !== kpiId
  );
  
  objective.updatedAt = new Date().toISOString();
  localStorage.setItem('objectives-data', JSON.stringify(objectives));
  
  return objective;
};

// User Story: Función para vincular tarea a un objetivo
export const linkTaskToObjective = async (
  objectiveId: string,
  taskId: string,
  taskTitle: string
): Promise<Objective> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Load existing objectives
  const savedObjectives = localStorage.getItem('objectives-data');
  const objectives = savedObjectives ? JSON.parse(savedObjectives) : [...mockObjectives];
  
  const objective = objectives.find((obj: Objective) => obj.id === objectiveId);
  if (!objective) throw new Error('Objective not found');
  
  if (!objective.links) {
    objective.links = {
      linkedKPIs: [],
      linkedTasks: [],
      actionPlans: [],
    };
  }
  
  // Verificar si la tarea ya está vinculada
  const existingLink = objective.links.linkedTasks.find(link => link.taskId === taskId);
  if (!existingLink) {
    objective.links.linkedTasks.push({
      taskId,
      taskTitle,
      linkedAt: new Date().toISOString(),
    });
  }
  
  objective.updatedAt = new Date().toISOString();
  localStorage.setItem('objectives-data', JSON.stringify(objectives));
  
  return objective;
};

// User Story: Función para desvincular tarea de un objetivo
export const unlinkTaskFromObjective = async (
  objectiveId: string,
  taskId: string
): Promise<Objective> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Load existing objectives
  const savedObjectives = localStorage.getItem('objectives-data');
  const objectives = savedObjectives ? JSON.parse(savedObjectives) : [...mockObjectives];
  
  const objective = objectives.find((obj: Objective) => obj.id === objectiveId);
  if (!objective) throw new Error('Objective not found');
  
  if (!objective.links) {
    objective.links = {
      linkedKPIs: [],
      linkedTasks: [],
      actionPlans: [],
    };
  }
  
  objective.links.linkedTasks = objective.links.linkedTasks.filter(
    link => link.taskId !== taskId
  );
  
  objective.updatedAt = new Date().toISOString();
  localStorage.setItem('objectives-data', JSON.stringify(objectives));
  
  return objective;
};

// User Story: Función para añadir plan de acción a un objetivo
export const addActionPlanToObjective = async (
  objectiveId: string,
  actionPlan: Omit<ActionPlan, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Objective> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Load existing objectives
  const savedObjectives = localStorage.getItem('objectives-data');
  const objectives = savedObjectives ? JSON.parse(savedObjectives) : [...mockObjectives];
  
  const objective = objectives.find((obj: Objective) => obj.id === objectiveId);
  if (!objective) throw new Error('Objective not found');
  
  if (!objective.links) {
    objective.links = {
      linkedKPIs: [],
      linkedTasks: [],
      actionPlans: [],
    };
  }
  
  const newActionPlan: ActionPlan = {
    ...actionPlan,
    id: `action_plan_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  objective.links.actionPlans.push(newActionPlan);
  objective.updatedAt = new Date().toISOString();
  localStorage.setItem('objectives-data', JSON.stringify(objectives));
  
  return objective;
};

// User Story: Función para eliminar plan de acción de un objetivo
export const removeActionPlanFromObjective = async (
  objectiveId: string,
  actionPlanId: string
): Promise<Objective> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Load existing objectives
  const savedObjectives = localStorage.getItem('objectives-data');
  const objectives = savedObjectives ? JSON.parse(savedObjectives) : [...mockObjectives];
  
  const objective = objectives.find((obj: Objective) => obj.id === objectiveId);
  if (!objective) throw new Error('Objective not found');
  
  if (!objective.links) {
    objective.links = {
      linkedKPIs: [],
      linkedTasks: [],
      actionPlans: [],
    };
  }
  
  objective.links.actionPlans = objective.links.actionPlans.filter(
    plan => plan.id !== actionPlanId
  );
  
  objective.updatedAt = new Date().toISOString();
  localStorage.setItem('objectives-data', JSON.stringify(objectives));
  
  return objective;
};

// User Story: Función para actualizar plan de acción
export const updateActionPlan = async (
  objectiveId: string,
  actionPlanId: string,
  updates: Partial<ActionPlan>
): Promise<Objective> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Load existing objectives
  const savedObjectives = localStorage.getItem('objectives-data');
  const objectives = savedObjectives ? JSON.parse(savedObjectives) : [...mockObjectives];
  
  const objective = objectives.find((obj: Objective) => obj.id === objectiveId);
  if (!objective) throw new Error('Objective not found');
  
  if (!objective.links) {
    objective.links = {
      linkedKPIs: [],
      linkedTasks: [],
      actionPlans: [],
    };
  }
  
  const actionPlanIndex = objective.links.actionPlans.findIndex(
    plan => plan.id === actionPlanId
  );
  
  if (actionPlanIndex === -1) throw new Error('Action plan not found');
  
  objective.links.actionPlans[actionPlanIndex] = {
    ...objective.links.actionPlans[actionPlanIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  objective.updatedAt = new Date().toISOString();
  localStorage.setItem('objectives-data', JSON.stringify(objectives));
  
  return objective;
};

/**
 * User Story: Calcula el color del objetivo basado en umbrales
 * @param objective Objetivo con umbrales configurados
 * @returns 'green' | 'yellow' | 'red' | null (null si no hay umbrales configurados)
 */
export const getObjectiveColor = (objective: Objective): 'green' | 'yellow' | 'red' | null => {
  if (!objective.colorThresholds?.enabled) {
    return null;
  }
  
  const thresholds = objective.colorThresholds;
  const progress = objective.progress;
  
  if (progress >= thresholds.green) {
    return 'green';
  } else if (progress >= thresholds.yellow) {
    return 'yellow';
  } else {
    return 'red';
  }
};

/**
 * User Story: Calcula el progreso esperado basado en la fecha límite
 */
const calculateExpectedProgress = (objective: Objective): number => {
  const now = new Date();
  const deadline = new Date(objective.deadline);
  const createdAt = new Date(objective.createdAt);
  
  const totalDays = Math.ceil((deadline.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
  const elapsedDays = Math.ceil((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
  
  if (totalDays <= 0) return 100;
  if (elapsedDays <= 0) return 0;
  
  return Math.min((elapsedDays / totalDays) * 100, 100);
};

/**
 * User Story: Verifica umbrales y genera alertas automáticas si es necesario
 */
const checkAndGenerateThresholdAlerts = async (objective: Objective): Promise<void> => {
  if (!objective.automaticAlerts?.enabled || !objective.colorThresholds?.enabled) {
    return;
  }
  
  const color = getObjectiveColor(objective);
  const alerts = objective.automaticAlerts;
  
  // Importar dinámicamente para evitar dependencias circulares
  const { createAutomaticAlert } = await import('./alerts');
  
  // Alertar cuando entra en amarillo
  if (alerts.notifyOnYellow && color === 'yellow') {
    await createAutomaticAlert(objective, 'yellow');
  }
  
  // Alertar cuando entra en rojo
  if (alerts.notifyOnRed && color === 'red') {
    await createAutomaticAlert(objective, 'red');
  }
  
  // Alertar por desviación del progreso esperado
  if (alerts.notifyOnDeviation && alerts.deviationThreshold) {
    const expectedProgress = calculateExpectedProgress(objective);
    const deviation = Math.abs(objective.progress - expectedProgress);
    
    if (deviation >= alerts.deviationThreshold) {
      await createAutomaticAlert(objective, 'deviation', deviation);
    }
  }
};

// User Story 2: Crear check-in de progreso
export const createCheckIn = async (
  objectiveId: string,
  checkInData: {
    progress: number;
    currentValue: number;
    notes?: string;
    evidence?: Omit<CheckInEvidence, 'id' | 'uploadedAt' | 'uploadedBy' | 'uploadedByName'>[];
    createdBy?: string;
    createdByName?: string;
  }
): Promise<ObjectiveCheckIn> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Load existing objectives
  const savedObjectives = localStorage.getItem('objectives-data');
  const objectives = savedObjectives ? JSON.parse(savedObjectives) : [...mockObjectives];
  
  const objective = objectives.find((obj: Objective) => obj.id === objectiveId);
  if (!objective) throw new Error('Objective not found');
  
  // Crear check-in
  const checkIn: ObjectiveCheckIn = {
    id: `checkin_${Date.now()}`,
    objectiveId,
    date: new Date().toISOString(),
    progress: checkInData.progress,
    currentValue: checkInData.currentValue,
    notes: checkInData.notes,
    evidence: checkInData.evidence?.map((ev, idx) => ({
      ...ev,
      id: `evidence_${Date.now()}_${idx}`,
      uploadedAt: new Date().toISOString(),
      uploadedBy: checkInData.createdBy || 'user',
      uploadedByName: checkInData.createdByName || 'Usuario',
    })) || [],
    comments: [],
    createdBy: checkInData.createdBy || 'user',
    createdByName: checkInData.createdByName || 'Usuario',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  // Agregar check-in al objetivo
  if (!objective.checkIns) {
    objective.checkIns = [];
  }
  objective.checkIns.push(checkIn);
  
  // Actualizar progreso y valor actual del objetivo
  objective.progress = checkInData.progress;
  objective.currentValue = checkInData.currentValue;
  objective.updatedAt = new Date().toISOString();
  
  // Actualizar estado basado en progreso
  if (objective.progress >= 100) {
    objective.status = 'achieved';
  } else if (objective.progress < 50 && objective.status === 'in_progress') {
    objective.status = 'at_risk';
  } else if (objective.status === 'not_started' && objective.progress > 0) {
    objective.status = 'in_progress';
  }
  
  // Verificar umbrales y alertas
  if (objective.colorThresholds?.enabled && objective.automaticAlerts?.enabled) {
    await checkAndGenerateThresholdAlerts(objective);
  }
  
  // Guardar
  const index = objectives.findIndex((obj: Objective) => obj.id === objectiveId);
  objectives[index] = objective;
  localStorage.setItem('objectives-data', JSON.stringify(objectives));
  
  return checkIn;
};

// User Story 2: Obtener check-ins de un objetivo
export const getCheckIns = async (objectiveId: string): Promise<ObjectiveCheckIn[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const savedObjectives = localStorage.getItem('objectives-data');
  const objectives = savedObjectives ? JSON.parse(savedObjectives) : [...mockObjectives];
  
  const objective = objectives.find((obj: Objective) => obj.id === objectiveId);
  if (!objective) return [];
  
  return objective.checkIns || [];
};

// User Story 2: Agregar comentario a un check-in
export const addCheckInComment = async (
  objectiveId: string,
  checkInId: string,
  comment: {
    content: string;
    createdBy?: string;
    createdByName?: string;
  }
): Promise<CheckInComment> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const savedObjectives = localStorage.getItem('objectives-data');
  const objectives = savedObjectives ? JSON.parse(savedObjectives) : [...mockObjectives];
  
  const objective = objectives.find((obj: Objective) => obj.id === objectiveId);
  if (!objective || !objective.checkIns) throw new Error('Objective or check-in not found');
  
  const checkIn = objective.checkIns.find(ci => ci.id === checkInId);
  if (!checkIn) throw new Error('Check-in not found');
  
  const newComment: CheckInComment = {
    id: `comment_${Date.now()}`,
    checkInId,
    content: comment.content,
    createdBy: comment.createdBy || 'user',
    createdByName: comment.createdByName || 'Usuario',
    createdAt: new Date().toISOString(),
  };
  
  if (!checkIn.comments) {
    checkIn.comments = [];
  }
  checkIn.comments.push(newComment);
  checkIn.updatedAt = new Date().toISOString();
  
  const index = objectives.findIndex((obj: Objective) => obj.id === objectiveId);
  objectives[index] = objective;
  localStorage.setItem('objectives-data', JSON.stringify(objectives));
  
  return newComment;
};

// User Story 1: Crear tarea rápida desde un objetivo con bloqueos
export const createQuickTask = async (
  objectiveId: string,
  taskData: {
    title: string;
    description?: string;
    priority: 'high' | 'medium' | 'low';
    assignedTo?: string;
    assignedToName?: string;
    dueDate?: string;
    blockerReason?: string;
    createdBy?: string;
    createdByName?: string;
  }
): Promise<QuickTask> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const savedObjectives = localStorage.getItem('objectives-data');
  const objectives = savedObjectives ? JSON.parse(savedObjectives) : [...mockObjectives];
  
  const objective = objectives.find((obj: Objective) => obj.id === objectiveId);
  if (!objective) throw new Error('Objective not found');
  
  const quickTask: QuickTask = {
    id: `quick_task_${Date.now()}`,
    objectiveId,
    title: taskData.title,
    description: taskData.description,
    priority: taskData.priority,
    assignedTo: taskData.assignedTo,
    assignedToName: taskData.assignedToName,
    dueDate: taskData.dueDate,
    status: 'pending',
    createdAt: new Date().toISOString(),
    createdBy: taskData.createdBy || 'user',
    createdByName: taskData.createdByName || 'Manager',
    blockerReason: taskData.blockerReason,
  };
  
  if (!objective.quickTasks) {
    objective.quickTasks = [];
  }
  objective.quickTasks.push(quickTask);
  objective.updatedAt = new Date().toISOString();
  
  const index = objectives.findIndex((obj: Objective) => obj.id === objectiveId);
  objectives[index] = objective;
  localStorage.setItem('objectives-data', JSON.stringify(objectives));
  
  return quickTask;
};

// User Story 1: Obtener tareas rápidas de un objetivo
export const getQuickTasks = async (objectiveId: string): Promise<QuickTask[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const savedObjectives = localStorage.getItem('objectives-data');
  const objectives = savedObjectives ? JSON.parse(savedObjectives) : [...mockObjectives];
  
  const objective = objectives.find((obj: Objective) => obj.id === objectiveId);
  if (!objective) return [];
  
  return objective.quickTasks || [];
};

// User Story 1: Aplicar ajuste rápido a un objetivo
export const createQuickAdjustment = async (
  objectiveId: string,
  adjustmentData: {
    type: 'target_value' | 'deadline' | 'metric' | 'responsible' | 'other';
    newValue: any;
    reason: string;
    createdBy?: string;
    createdByName?: string;
  }
): Promise<QuickAdjustment> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const savedObjectives = localStorage.getItem('objectives-data');
  const objectives = savedObjectives ? JSON.parse(savedObjectives) : [...mockObjectives];
  
  const objective = objectives.find((obj: Objective) => obj.id === objectiveId);
  if (!objective) throw new Error('Objective not found');
  
  // Obtener valor anterior según el tipo
  let previousValue: any;
  switch (adjustmentData.type) {
    case 'target_value':
      previousValue = objective.targetValue;
      objective.targetValue = adjustmentData.newValue;
      objective.progress = Math.min((objective.currentValue / objective.targetValue) * 100, 100);
      break;
    case 'deadline':
      previousValue = objective.deadline;
      objective.deadline = adjustmentData.newValue;
      break;
    case 'metric':
      previousValue = objective.metric;
      objective.metric = adjustmentData.newValue;
      break;
    case 'responsible':
      previousValue = objective.responsible;
      objective.responsible = adjustmentData.newValue;
      break;
    default:
      previousValue = null;
  }
  
  const quickAdjustment: QuickAdjustment = {
    id: `quick_adj_${Date.now()}`,
    objectiveId,
    type: adjustmentData.type,
    previousValue,
    newValue: adjustmentData.newValue,
    reason: adjustmentData.reason,
    createdBy: adjustmentData.createdBy || 'user',
    createdByName: adjustmentData.createdByName || 'Manager',
    createdAt: new Date().toISOString(),
  };
  
  if (!objective.quickAdjustments) {
    objective.quickAdjustments = [];
  }
  objective.quickAdjustments.push(quickAdjustment);
  objective.updatedAt = new Date().toISOString();
  
  const index = objectives.findIndex((obj: Objective) => obj.id === objectiveId);
  objectives[index] = objective;
  localStorage.setItem('objectives-data', JSON.stringify(objectives));
  
  return quickAdjustment;
};

// User Story 2: Crear dependencia entre objetivos
export const createObjectiveDependency = async (
  sourceObjectiveId: string,
  targetObjectiveId: string,
  dependencyData: {
    type: 'feeds' | 'blocks' | 'enables';
    weight?: number;
    description?: string;
    createdBy?: string;
  }
): Promise<ObjectiveDependency> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const savedObjectives = localStorage.getItem('objectives-data');
  const objectives = savedObjectives ? JSON.parse(savedObjectives) : [...mockObjectives];
  
  const sourceObjective = objectives.find((obj: Objective) => obj.id === sourceObjectiveId);
  const targetObjective = objectives.find((obj: Objective) => obj.id === targetObjectiveId);
  
  if (!sourceObjective || !targetObjective) {
    throw new Error('Source or target objective not found');
  }
  
  const dependency: ObjectiveDependency = {
    id: `dep_${Date.now()}`,
    sourceObjectiveId,
    targetObjectiveId,
    type: dependencyData.type,
    weight: dependencyData.weight || 50,
    description: dependencyData.description,
    createdAt: new Date().toISOString(),
    createdBy: dependencyData.createdBy || 'user',
  };
  
  // Agregar dependencia al objetivo fuente (feeds)
  if (!sourceObjective.dependencies) {
    sourceObjective.dependencies = { feeds: [], fedBy: [] };
  }
  sourceObjective.dependencies.feeds.push(dependency);
  
  // Agregar dependencia al objetivo destino (fedBy)
  if (!targetObjective.dependencies) {
    targetObjective.dependencies = { feeds: [], fedBy: [] };
  }
  targetObjective.dependencies.fedBy.push(dependency);
  
  sourceObjective.updatedAt = new Date().toISOString();
  targetObjective.updatedAt = new Date().toISOString();
  
  const sourceIndex = objectives.findIndex((obj: Objective) => obj.id === sourceObjectiveId);
  const targetIndex = objectives.findIndex((obj: Objective) => obj.id === targetObjectiveId);
  objectives[sourceIndex] = sourceObjective;
  objectives[targetIndex] = targetObjective;
  localStorage.setItem('objectives-data', JSON.stringify(objectives));
  
  return dependency;
};

// User Story 2: Obtener dependencias de un objetivo
export const getObjectiveDependencies = async (objectiveId: string): Promise<{
  feeds: ObjectiveDependency[];
  fedBy: ObjectiveDependency[];
}> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const savedObjectives = localStorage.getItem('objectives-data');
  const objectives = savedObjectives ? JSON.parse(savedObjectives) : [...mockObjectives];
  
  const objective = objectives.find((obj: Objective) => obj.id === objectiveId);
  if (!objective) return { feeds: [], fedBy: [] };
  
  return objective.dependencies || { feeds: [], fedBy: [] };
};

// User Story 2: Eliminar dependencia
export const deleteObjectiveDependency = async (dependencyId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const savedObjectives = localStorage.getItem('objectives-data');
  const objectives = savedObjectives ? JSON.parse(savedObjectives) : [...mockObjectives];
  
  // Buscar la dependencia en todos los objetivos
  for (const objective of objectives) {
    if (objective.dependencies) {
      const feedsIndex = objective.dependencies.feeds.findIndex(dep => dep.id === dependencyId);
      const fedByIndex = objective.dependencies.fedBy.findIndex(dep => dep.id === dependencyId);
      
      if (feedsIndex !== -1) {
        objective.dependencies.feeds.splice(feedsIndex, 1);
        objective.updatedAt = new Date().toISOString();
      }
      if (fedByIndex !== -1) {
        objective.dependencies.fedBy.splice(fedByIndex, 1);
        objective.updatedAt = new Date().toISOString();
      }
    }
  }
  
  localStorage.setItem('objectives-data', JSON.stringify(objectives));
};

// User Story 2: Calcular impacto de dependencias
export const calculateDependencyImpact = async (objectiveId: string): Promise<DependencyImpact[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const savedObjectives = localStorage.getItem('objectives-data');
  const objectives = savedObjectives ? JSON.parse(savedObjectives) : [...mockObjectives];
  
  const objective = objectives.find((obj: Objective) => obj.id === objectiveId);
  if (!objective || !objective.dependencies) return [];
  
  const impacts: DependencyImpact[] = [];
  
  // Calcular impacto de objetivos que alimentan a este objetivo
  for (const dependency of objective.dependencies.fedBy) {
    const sourceObjective = objectives.find(obj => obj.id === dependency.sourceObjectiveId);
    if (!sourceObjective) continue;
    
    const weight = dependency.weight || 50;
    const impactPercentage = (sourceObjective.progress / 100) * (weight / 100) * 100;
    
    let status: 'on_track' | 'at_risk' | 'blocking' = 'on_track';
    if (sourceObjective.status === 'at_risk' || sourceObjective.status === 'failed') {
      status = 'blocking';
    } else if (sourceObjective.progress < 50) {
      status = 'at_risk';
    }
    
    impacts.push({
      sourceObjectiveId: dependency.sourceObjectiveId,
      targetObjectiveId: objectiveId,
      sourceProgress: sourceObjective.progress,
      targetProgress: objective.progress,
      impactPercentage,
      status,
    });
  }
  
  return impacts;
};

// User Story: Archivar objetivo
export const archiveObjective = async (
  id: string,
  reason?: string,
  archivedBy?: string
): Promise<Objective> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const savedObjectives = localStorage.getItem('objectives-data');
  const objectives = savedObjectives ? JSON.parse(savedObjectives) : [...mockObjectives];
  
  const objective = objectives.find((obj: Objective) => obj.id === id);
  if (!objective) throw new Error('Objective not found');
  
  const updated = {
    ...objective,
    archived: true,
    archivedAt: new Date().toISOString(),
    archivedBy: archivedBy || 'user',
    archivedReason: reason,
    updatedAt: new Date().toISOString(),
  };
  
  const index = objectives.findIndex((obj: Objective) => obj.id === id);
  objectives[index] = updated;
  localStorage.setItem('objectives-data', JSON.stringify(objectives));
  
  // Registrar en historial de auditoría
  try {
    const { recordObjectiveChange } = await import('./auditHistory');
    await recordObjectiveChange(
      updated,
      objective,
      'archive',
      archivedBy || 'user',
      'Usuario',
      undefined,
      reason,
    );
  } catch (error) {
    console.error('Error recording audit history:', error);
  }
  
  return updated;
};

// User Story: Desarchivar objetivo
export const unarchiveObjective = async (
  id: string,
  unarchivedBy?: string
): Promise<Objective> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const savedObjectives = localStorage.getItem('objectives-data');
  const objectives = savedObjectives ? JSON.parse(savedObjectives) : [...mockObjectives];
  
  const objective = objectives.find((obj: Objective) => obj.id === id);
  if (!objective) throw new Error('Objective not found');
  
  const updated = {
    ...objective,
    archived: false,
    archivedAt: undefined,
    archivedBy: undefined,
    archivedReason: undefined,
    updatedAt: new Date().toISOString(),
  };
  
  const index = objectives.findIndex((obj: Objective) => obj.id === id);
  objectives[index] = updated;
  localStorage.setItem('objectives-data', JSON.stringify(objectives));
  
  // Registrar en historial de auditoría
  try {
    const { recordObjectiveChange } = await import('./auditHistory');
    await recordObjectiveChange(
      updated,
      objective,
      'unarchive',
      unarchivedBy || 'user',
      'Usuario',
    );
  } catch (error) {
    console.error('Error recording audit history:', error);
  }
  
  return updated;
};

// User Story: Detectar objetivos obsoletos o con baja contribución
export const detectObsoleteObjectives = async (
  options?: {
    minDaysSinceLastActivity?: number; // Días sin actividad para considerar obsoleto
    minBusinessContribution?: number; // Contribución mínima al negocio (0-100)
    includeArchived?: boolean; // Incluir objetivos ya archivados
  }
): Promise<Objective[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const savedObjectives = localStorage.getItem('objectives-data');
  const objectives = savedObjectives ? JSON.parse(savedObjectives) : [...mockObjectives];
  
  const minDays = options?.minDaysSinceLastActivity || 90; // Por defecto 90 días
  const minContribution = options?.minBusinessContribution || 20; // Por defecto 20%
  const includeArchived = options?.includeArchived || false;
  
  const now = new Date();
  const obsoleteObjectives: Objective[] = [];
  
  for (const objective of objectives) {
    // Si está archivado y no queremos incluirlos, saltar
    if (objective.archived && !includeArchived) {
      continue;
    }
    
    // Calcular días desde última actividad
    const lastActivityDate = objective.lastActivityAt 
      ? new Date(objective.lastActivityAt)
      : new Date(objective.updatedAt);
    const daysSinceActivity = Math.floor(
      (now.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    // Verificar si es obsoleto por falta de actividad
    const isObsoleteByActivity = daysSinceActivity >= minDays;
    
    // Verificar si tiene baja contribución al negocio
    const contribution = objective.businessContribution || 50; // Por defecto 50% si no está definido
    const hasLowContribution = contribution < minContribution;
    
    // Verificar si el deadline ya pasó y no se ha actualizado
    const deadlinePassed = new Date(objective.deadline) < now;
    const isStale = deadlinePassed && daysSinceActivity >= 30; // 30 días después del deadline
    
    if (isObsoleteByActivity || hasLowContribution || isStale) {
      obsoleteObjectives.push({
        ...objective,
        // Calcular score de obsolescencia
        businessContribution: contribution,
        lastActivityAt: lastActivityDate.toISOString(),
      });
    }
  }
  
  // Ordenar por score de obsolescencia (combinación de días sin actividad y baja contribución)
  obsoleteObjectives.sort((a, b) => {
    const aDays = a.lastActivityAt 
      ? Math.floor((now.getTime() - new Date(a.lastActivityAt).getTime()) / (1000 * 60 * 60 * 24))
      : 0;
    const bDays = b.lastActivityAt
      ? Math.floor((now.getTime() - new Date(b.lastActivityAt).getTime()) / (1000 * 60 * 60 * 24))
      : 0;
    
    const aScore = aDays + (100 - (a.businessContribution || 50));
    const bScore = bDays + (100 - (b.businessContribution || 50));
    
    return bScore - aScore; // Mayor score primero (más obsoleto)
  });
  
  return obsoleteObjectives;
};

// User Story: Archivar múltiples objetivos
export const archiveMultipleObjectives = async (
  objectiveIds: string[],
  reason?: string,
  archivedBy?: string
): Promise<Objective[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const results: Objective[] = [];
  
  for (const id of objectiveIds) {
    try {
      const archived = await archiveObjective(id, reason, archivedBy);
      results.push(archived);
    } catch (error) {
      console.error(`Error archiving objective ${id}:`, error);
    }
  }
  
  return results;
};

