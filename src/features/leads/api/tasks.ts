import { Task } from '../types';
import { TaskService } from '../services/taskService';

export const getTasks = async (filters?: {
  leadId?: string;
  assignedTo?: string;
  completed?: boolean;
  priority?: Task['priority'];
  type?: Task['type'];
  dueDateFrom?: Date;
  dueDateTo?: Date;
  businessType?: 'entrenador' | 'gimnasio';
  overdue?: boolean;
}): Promise<Task[]> => {
  return TaskService.getTasks(filters);
};

export const getTask = async (id: string): Promise<Task | null> => {
  return TaskService.getTask(id);
};

export const getLeadTasks = async (leadId: string): Promise<Task[]> => {
  return TaskService.getLeadTasks(leadId);
};

export const getPendingTasks = async (userId: string): Promise<Task[]> => {
  return TaskService.getPendingTasks(userId);
};

export const getOverdueTasks = async (userId?: string): Promise<Task[]> => {
  return TaskService.getOverdueTasks(userId);
};

export const createTask = async (
  task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Task> => {
  return TaskService.createTask(task);
};

export const updateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
  return TaskService.updateTask(id, updates);
};

export const completeTask = async (id: string, userId: string): Promise<Task> => {
  return TaskService.completeTask(id, userId);
};

export const deleteTask = async (id: string): Promise<void> => {
  return TaskService.deleteTask(id);
};

export const getTaskStatistics = async (
  businessType?: 'entrenador' | 'gimnasio',
  userId?: string
): Promise<{
  total: number;
  pending: number;
  completed: number;
  overdue: number;
}> => {
  return TaskService.getTaskStatistics(businessType, userId);
};

