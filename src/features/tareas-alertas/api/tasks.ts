import { Task, CreateTaskData, UpdateTaskData, TaskFilters } from '../types';

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

export const getTasksByPriority = async (): Promise<Record<TaskPriority, Task[]>> => {
  const allTasks = await getTasks();
  return {
    alta: allTasks.filter(t => t.priority === 'alta' && t.status !== 'completada'),
    media: allTasks.filter(t => t.priority === 'media' && t.status !== 'completada'),
    baja: allTasks.filter(t => t.priority === 'baja' && t.status !== 'completada'),
  };
};

export const getAssignedTasks = async (userId: string): Promise<Task[]> => {
  return getTasks({ assignedTo: [userId] });
};

