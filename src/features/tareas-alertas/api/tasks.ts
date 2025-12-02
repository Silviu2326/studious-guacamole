import { Task, CreateTaskData, UpdateTaskData, TaskFilters, UserRole, TaskPriority, TaskHistoryStats } from '../types';

// Mock data para desarrollo
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Seguimiento a cliente sin check-in',
    description: 'Cliente Juan Pérez no ha subido check-in desde hace 5 días',
    priority: 'alta',
    status: 'pendiente',
    assignedTo: 'user1',
    assignedToName: 'Entrenador Personal',
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: 'cliente',
    relatedEntityType: 'cliente',
    relatedEntityId: 'cliente1',
    tags: ['check-in', 'seguimiento'],
  },
  {
    id: '2',
    title: 'Llamar a lead caliente',
    description: 'Lead María González mostró interés hace 2 días',
    priority: 'alta',
    status: 'pendiente',
    assignedTo: 'user1',
    assignedToName: 'Entrenador Personal',
    dueDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: 'venta',
    relatedEntityType: 'lead',
    relatedEntityId: 'lead1',
    tags: ['lead', 'venta'],
  },
  {
    id: '3',
    title: 'Factura #1234 vencida',
    description: 'Factura por €150 vencida hace 3 días',
    priority: 'alta',
    status: 'pendiente',
    assignedTo: 'user2',
    assignedToName: 'Administrador Gimnasio',
    dueDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: 'facturación',
    relatedEntityType: 'factura',
    relatedEntityId: 'factura1',
    tags: ['pago', 'vencido'],
  },
  {
    id: '4',
    title: 'Equipo roto en sala de pesas',
    description: 'Máquina de press de banca necesita reparación',
    priority: 'media',
    status: 'pendiente',
    assignedTo: 'user2',
    assignedToName: 'Administrador Gimnasio',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: 'mantenimiento',
    relatedEntityType: 'equipo',
    relatedEntityId: 'equipo1',
    tags: ['mantenimiento', 'equipo'],
  },
  {
    id: '5',
    title: 'Clase de spinning supera aforo',
    description: 'Reservas actuales: 25/20 personas',
    priority: 'alta',
    status: 'pendiente',
    assignedTo: 'user2',
    assignedToName: 'Administrador Gimnasio',
    dueDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: 'operaciones',
    relatedEntityType: 'clase',
    relatedEntityId: 'clase1',
    tags: ['aforo', 'clase'],
  },
  {
    id: '6',
    title: 'Preparar sesión de evaluación',
    description: 'Revisar historial del cliente antes de la evaluación',
    priority: 'media',
    status: 'en-progreso',
    assignedTo: 'user1',
    assignedToName: 'Entrenador Personal',
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: 'sesión',
    tags: ['preparación', 'evaluación'],
  },
];

let tasksData = [...mockTasks];

export const getTasks = async (filters?: TaskFilters): Promise<Task[]> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 300));

  let filteredTasks = [...tasksData];

  if (filters) {
    if (filters.status && filters.status.length > 0) {
      filteredTasks = filteredTasks.filter(task => filters.status!.includes(task.status));
    }

    if (filters.priority && filters.priority.length > 0) {
      filteredTasks = filteredTasks.filter(task => filters.priority!.includes(task.priority));
    }

    if (filters.assignedTo && filters.assignedTo.length > 0) {
      filteredTasks = filteredTasks.filter(task => 
        task.assignedTo && filters.assignedTo!.includes(task.assignedTo)
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower) ||
        task.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    if (filters.category && filters.category.length > 0) {
      filteredTasks = filteredTasks.filter(task => 
        task.category && filters.category!.includes(task.category)
      );
    }
  }

  // Ordenar por prioridad y fecha de vencimiento
  filteredTasks.sort((a, b) => {
    const priorityOrder = { alta: 3, media: 2, baja: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;

    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return 0;
  });

  return filteredTasks;
};

export const getTask = async (id: string): Promise<Task | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return tasksData.find(task => task.id === id) || null;
};

export const createTask = async (data: CreateTaskData): Promise<Task> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const newTask: Task = {
    id: `task_${Date.now()}`,
    title: data.title,
    description: data.description,
    priority: data.priority,
    status: 'pendiente',
    assignedTo: data.assignedTo,
    dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: data.tags || [],
    category: data.category,
    relatedEntityId: data.relatedEntityId,
    relatedEntityType: data.relatedEntityType,
  };

  tasksData.push(newTask);
  return newTask;
};

export const updateTask = async (id: string, updates: UpdateTaskData): Promise<Task> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const taskIndex = tasksData.findIndex(task => task.id === id);
  if (taskIndex === -1) {
    throw new Error('Tarea no encontrada');
  }

  const updatedTask: Task = {
    ...tasksData[taskIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
    ...(updates.status === 'completada' && !tasksData[taskIndex].completedAt
      ? { completedAt: new Date().toISOString() }
      : {}),
  };

  tasksData[taskIndex] = updatedTask;
  return updatedTask;
};

export const deleteTask = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  tasksData = tasksData.filter(task => task.id !== id);
};

export const completeTask = async (id: string): Promise<Task> => {
  return updateTask(id, { status: 'completada' });
};

/**
 * Obtiene tareas agrupadas por prioridad
 * Usa getTasks() internamente para asegurar consistencia con TasksManager
 * @param filters - Filtros opcionales para aplicar a las tareas (mismos que getTasks)
 * @returns Tareas agrupadas por prioridad (solo no completadas por defecto)
 */
export const getTasksByPriority = async (filters?: TaskFilters): Promise<Record<TaskPriority, Task[]>> => {
  // Usar getTasks con los filtros proporcionados para mantener consistencia
  const allTasks = await getTasks(filters);
  
  // Filtrar solo tareas no completadas (comportamiento por defecto)
  const activeTasks = allTasks.filter(t => t.status !== 'completada');
  
  return {
    alta: activeTasks.filter(t => t.priority === 'alta'),
    media: activeTasks.filter(t => t.priority === 'media'),
    baja: activeTasks.filter(t => t.priority === 'baja'),
  };
};

export const getAssignedTasks = async (userId: string): Promise<Task[]> => {
  return getTasks({ assignedTo: [userId] });
};

/**
 * Obtiene las tareas de alta prioridad para hoy (3-5 tareas)
 */
export const getHighPriorityTasksForToday = async (
  role: UserRole,
  userId?: string,
  limit: number = 5
): Promise<Task[]> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const filters: TaskFilters = {
    role,
    priority: ['alta'],
    status: ['pendiente', 'en-progreso'],
    ...(userId ? { assignedTo: [userId] } : {}),
  };

  const allTasks = await getTasks(filters);

  // Filtrar tareas que vencen hoy o están relacionadas con hoy
  const todayTasks = allTasks.filter(task => {
    if (task.dueDate) {
      const taskDate = new Date(task.dueDate);
      return taskDate >= today && taskDate < tomorrow;
    }
    // Si no tiene fecha, incluir si fue creada hoy
    const createdDate = new Date(task.createdAt);
    return createdDate >= today && createdDate < tomorrow;
  });

  // Ordenar por prioridad y fecha de vencimiento
  todayTasks.sort((a, b) => {
    const priorityOrder = { alta: 3, media: 2, baja: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;

    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return 0;
  });

  return todayTasks.slice(0, limit);
};

/**
 * Crea una tarea a partir de una alerta
 */
export const createTaskFromAlert = async (alert: import('../types').Alert): Promise<Task> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  // Mapear la prioridad de la alerta a la tarea
  const taskPriority: TaskPriority = alert.priority;

  // Generar título y descripción basados en la alerta
  const taskTitle = `Seguimiento: ${alert.title}`;
  const taskDescription = alert.message;

  // Determinar categoría basada en el tipo de alerta
  let category = 'general';
  if (alert.type === 'pago-pendiente' || alert.type === 'factura-vencida') {
    category = 'facturación';
  } else if (alert.type === 'check-in-faltante' || alert.type === 'lead-sin-seguimiento') {
    category = 'seguimiento';
  } else if (alert.type === 'equipo-roto' || alert.type === 'mantenimiento') {
    category = 'mantenimiento';
  } else if (alert.type === 'aforo-superado') {
    category = 'operaciones';
  }

  // Generar tags basados en el tipo de alerta
  const tags = [alert.type, 'desde-alerta'];

  const newTask: Task = {
    id: `task_${Date.now()}`,
    title: taskTitle,
    description: taskDescription,
    priority: taskPriority,
    status: 'pendiente',
    assignedTo: alert.userId,
    dueDate: new Date(Date.now() + 86400000).toISOString(), // Vence en 1 día
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags,
    category,
    relatedEntityId: alert.relatedEntityId,
    relatedEntityType: alert.relatedEntityType as Task['relatedEntityType'],
  };

  tasksData.push(newTask);
  return newTask;
};

/**
 * Obtiene estadísticas de productividad del historial de tareas
 * Función mock que calcula métricas básicas de tareas completadas y canceladas
 * 
 * @param role - Rol del usuario para filtrar tareas
 * @returns Estadísticas de productividad
 */
export const getTaskHistoryStats = async (role?: UserRole): Promise<TaskHistoryStats> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 200));

  // Obtener todas las tareas completadas y canceladas
  const filters: TaskFilters = {
    status: ['completada', 'cancelada'],
    ...(role ? { role } : {}),
  };
  
  const allResolvedTasks = await getTasks(filters);

  // Calcular fechas de esta semana y semana anterior
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Inicio de esta semana (lunes)
  const thisWeekStart = new Date(today);
  const dayOfWeek = today.getDay();
  const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Ajustar para que lunes sea 0
  thisWeekStart.setDate(today.getDate() - diff);
  thisWeekStart.setHours(0, 0, 0, 0);
  
  // Inicio de semana anterior
  const previousWeekStart = new Date(thisWeekStart);
  previousWeekStart.setDate(previousWeekStart.getDate() - 7);
  const previousWeekEnd = new Date(thisWeekStart);

  // Filtrar tareas completadas por semana
  const completedThisWeek = allResolvedTasks.filter(task => {
    if (task.status !== 'completada') return false;
    const completedDate = task.completedAt ? new Date(task.completedAt) : new Date(task.updatedAt);
    return completedDate >= thisWeekStart && completedDate < now;
  }).length;

  const completedPreviousWeek = allResolvedTasks.filter(task => {
    if (task.status !== 'completada') return false;
    const completedDate = task.completedAt ? new Date(task.completedAt) : new Date(task.updatedAt);
    return completedDate >= previousWeekStart && completedDate < previousWeekEnd;
  }).length;

  // Contar totales
  const completedCount = allResolvedTasks.filter(t => t.status === 'completada').length;
  const cancelledCount = allResolvedTasks.filter(t => t.status === 'cancelada').length;
  const total = completedCount + cancelledCount;

  // Calcular porcentajes
  const completedPercentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;
  const cancelledPercentage = total > 0 ? Math.round((cancelledCount / total) * 100) : 0;

  return {
    completedThisWeek,
    completedPreviousWeek,
    completedCount,
    cancelledCount,
    completedPercentage,
    cancelledPercentage,
  };
};

