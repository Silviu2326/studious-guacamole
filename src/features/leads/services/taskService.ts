import { Task, Lead, HistoryEvent, HistoryEventType } from '../types';
import { getLead, updateLead } from '../api/leads';

// Mock data storage
let mockTasks: Task[] = [];

// Inicializar datos de ejemplo
const initializeMockData = () => {
  if (mockTasks.length > 0) return;

  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const twoDaysLater = new Date(now.getTime() + 48 * 60 * 60 * 1000);
  const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  mockTasks = [
    {
      id: 'task1',
      leadId: '1',
      title: 'Llamar a María González',
      description: 'Seguimiento sobre disponibilidad para consulta',
      type: 'call',
      priority: 'high',
      dueDate: tomorrow,
      completed: false,
      assignedTo: '1',
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: now,
      createdBy: '1'
    },
    {
      id: 'task2',
      leadId: '4',
      title: 'Enviar presupuesto a David Torres',
      description: 'Presupuesto personalizado para plan de 3 meses',
      type: 'proposal',
      priority: 'urgent',
      dueDate: new Date(now.getTime() + 6 * 60 * 60 * 1000), // Hoy
      completed: false,
      assignedTo: '1',
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: now,
      createdBy: '1'
    },
    {
      id: 'task3',
      leadId: '2',
      title: 'Seguimiento WhatsApp - Carlos Ruiz',
      description: 'Recordar sobre oferta especial',
      type: 'whatsapp',
      priority: 'medium',
      dueDate: twoDaysLater,
      completed: false,
      assignedTo: '1',
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: now,
      createdBy: '1'
    },
    {
      id: 'task4',
      leadId: '14',
      title: 'Email de seguimiento - Carmen Díaz',
      description: 'Enviar información adicional sobre planes',
      type: 'email',
      priority: 'low',
      dueDate: weekLater,
      completed: false,
      assignedTo: '1',
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: now,
      createdBy: '1'
    },
    {
      id: 'task5',
      leadId: '1',
      title: 'Agendar consulta inicial',
      description: 'Confirmar fecha y hora para primera consulta',
      type: 'meeting',
      priority: 'high',
      dueDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // Vencida
      completed: true,
      completedAt: new Date(now.getTime() - 12 * 60 * 60 * 1000),
      completedBy: '1',
      assignedTo: '1',
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 12 * 60 * 60 * 1000),
      createdBy: '1'
    }
  ];
};

export class TaskService {
  // Obtener todas las tareas
  static async getTasks(
    filters?: {
      leadId?: string;
      assignedTo?: string;
      completed?: boolean;
      priority?: Task['priority'];
      type?: Task['type'];
      dueDateFrom?: Date;
      dueDateTo?: Date;
    }
  ): Promise<Task[]> {
    initializeMockData();
    let tasks = [...mockTasks];

    if (filters) {
      if (filters.leadId) {
        tasks = tasks.filter(t => t.leadId === filters.leadId);
      }
      if (filters.assignedTo) {
        tasks = tasks.filter(t => t.assignedTo === filters.assignedTo);
      }
      if (filters.completed !== undefined) {
        tasks = tasks.filter(t => t.completed === filters.completed);
      }
      if (filters.priority) {
        tasks = tasks.filter(t => t.priority === filters.priority);
      }
      if (filters.type) {
        tasks = tasks.filter(t => t.type === filters.type);
      }
      if (filters.dueDateFrom) {
        tasks = tasks.filter(t => t.dueDate >= filters.dueDateFrom!);
      }
      if (filters.dueDateTo) {
        tasks = tasks.filter(t => t.dueDate <= filters.dueDateTo!);
      }
    }

    return tasks.sort((a, b) => {
      // Ordenar por: completadas al final, luego por prioridad, luego por fecha
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      if (!a.completed) {
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityDiff !== 0) return priorityDiff;
      }
      return a.dueDate.getTime() - b.dueDate.getTime();
    });
  }

  // Obtener una tarea por ID
  static async getTask(id: string): Promise<Task | null> {
    initializeMockData();
    return mockTasks.find(t => t.id === id) || null;
  }

  // Obtener tareas de un lead
  static async getLeadTasks(leadId: string): Promise<Task[]> {
    return this.getTasks({ leadId });
  }

  // Obtener tareas pendientes de un usuario
  static async getPendingTasks(userId: string): Promise<Task[]> {
    return this.getTasks({ assignedTo: userId, completed: false });
  }

  // Obtener tareas vencidas
  static async getOverdueTasks(userId?: string): Promise<Task[]> {
    const now = new Date();
    const tasks = await this.getTasks({ assignedTo: userId, completed: false });
    return tasks.filter(t => t.dueDate < now);
  }

  // Crear nueva tarea
  static async createTask(
    task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Task> {
    initializeMockData();

    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockTasks.push(newTask);

    // Registrar en historial del lead
    const lead = await getLead(task.leadId);
    if (lead) {
      const historyEvent: HistoryEvent = {
        id: `task-${newTask.id}`,
        type: 'note_added' as HistoryEventType,
        date: new Date(),
        userId: task.createdBy,
        userName: `Usuario ${task.createdBy}`,
        description: `Tarea creada: ${newTask.title} (Vence: ${newTask.dueDate.toLocaleDateString()})`,
        metadata: {
          taskId: newTask.id,
          taskType: newTask.type,
          priority: newTask.priority
        }
      };

      // En producción, esto actualizaría el historial del lead
      console.log('[TaskService] Tarea creada y registrada en historial:', historyEvent);
    }

    return newTask;
  }

  // Actualizar tarea
  static async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    initializeMockData();
    const index = mockTasks.findIndex(t => t.id === id);

    if (index === -1) {
      throw new Error('Task not found');
    }

    mockTasks[index] = {
      ...mockTasks[index],
      ...updates,
      updatedAt: new Date()
    };

    return mockTasks[index];
  }

  // Completar tarea
  static async completeTask(id: string, userId: string): Promise<Task> {
    const task = await this.getTask(id);
    if (!task) {
      throw new Error('Task not found');
    }

    const updated = await this.updateTask(id, {
      completed: true,
      completedAt: new Date(),
      completedBy: userId
    });

    // Registrar en historial del lead
    const lead = await getLead(task.leadId);
    if (lead) {
      const historyEvent: HistoryEvent = {
        id: `task-completed-${task.id}`,
        type: 'note_added' as HistoryEventType,
        date: new Date(),
        userId,
        userName: `Usuario ${userId}`,
        description: `Tarea completada: ${task.title}`,
        metadata: {
          taskId: task.id,
          taskType: task.type
        }
      };

      // Actualizar lead con la interacción
      const interaction = {
        id: `task-${task.id}`,
        type: task.type === 'call' ? 'call_made' as const :
              task.type === 'email' ? 'email_sent' as const :
              task.type === 'whatsapp' ? 'whatsapp_sent' as const :
              'meeting_completed' as const,
        channel: task.type === 'call' ? 'phone' as const :
                 task.type === 'email' ? 'email' as const :
                 task.type === 'whatsapp' ? 'whatsapp' as const :
                 'in_person' as const,
        date: new Date(),
        description: `Tarea completada: ${task.title}`,
        outcome: 'positive' as const,
        userId,
        metadata: {
          taskId: task.id
        }
      };

      await updateLead(task.leadId, {
        interactions: [...(lead.interactions || []), interaction],
        lastContactDate: new Date()
      });

      console.log('[TaskService] Tarea completada y registrada:', historyEvent);
    }

    return updated;
  }

  // Eliminar tarea
  static async deleteTask(id: string): Promise<void> {
    initializeMockData();
    const index = mockTasks.findIndex(t => t.id === id);
    if (index !== -1) {
      mockTasks.splice(index, 1);
    }
  }

  // Obtener estadísticas de tareas
  static async getTaskStats(userId?: string): Promise<{
    total: number;
    pending: number;
    completed: number;
    overdue: number;
    byPriority: Record<Task['priority'], number>;
    byType: Record<Task['type'], number>;
  }> {
    const tasks = await this.getTasks({ assignedTo: userId });
    const overdue = await this.getOverdueTasks(userId);

    const stats = {
      total: tasks.length,
      pending: tasks.filter(t => !t.completed).length,
      completed: tasks.filter(t => t.completed).length,
      overdue: overdue.length,
      byPriority: {
        urgent: 0,
        high: 0,
        medium: 0,
        low: 0
      } as Record<Task['priority'], number>,
      byType: {
        call: 0,
        email: 0,
        whatsapp: 0,
        meeting: 0,
        proposal: 0,
        follow_up: 0,
        other: 0
      } as Record<Task['type'], number>
    };

    tasks.forEach(task => {
      if (!task.completed) {
        stats.byPriority[task.priority]++;
        stats.byType[task.type]++;
      }
    });

    return stats;
  }

  // Obtener estadísticas de tareas (alias para compatibilidad)
  static async getTaskStatistics(
    businessType?: 'entrenador' | 'gimnasio',
    userId?: string
  ): Promise<{
    total: number;
    pending: number;
    completed: number;
    overdue: number;
  }> {
    const stats = await this.getTaskStats(userId);
    return {
      total: stats.total,
      pending: stats.pending,
      completed: stats.completed,
      overdue: stats.overdue
    };
  }
}

