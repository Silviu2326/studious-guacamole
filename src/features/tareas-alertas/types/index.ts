export type TaskPriority = 'alta' | 'media' | 'baja';
export type TaskStatus = 'pendiente' | 'en-progreso' | 'completada' | 'cancelada';
export type AlertType = 'pago-pendiente' | 'check-in-faltante' | 'lead-sin-seguimiento' | 'factura-vencida' | 'equipo-roto' | 'aforo-superado' | 'mantenimiento' | 'tarea-critica' | 'recordatorio';
export type UserRole = 'entrenador' | 'gimnasio';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo?: string;
  assignedToName?: string;
  dueDate?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  completedAt?: Date | string;
  tags?: string[];
  category?: string;
  relatedEntityId?: string;
  relatedEntityType?: 'cliente' | 'lead' | 'factura' | 'equipo' | 'clase' | 'otro';
}

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  priority: TaskPriority;
  isRead: boolean;
  createdAt: Date | string;
  actionUrl?: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
  userId?: string;
  role: UserRole;
}

export interface Notification {
  id: string;
  type: 'task' | 'alert' | 'reminder';
  title: string;
  message: string;
  priority: TaskPriority;
  isRead: boolean;
  createdAt: Date | string;
  actionUrl?: string;
  scheduledFor?: Date | string;
}

export interface TaskFilters {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  assignedTo?: string[];
  search?: string;
  dueDateFrom?: Date | string;
  dueDateTo?: Date | string;
  category?: string[];
  role?: UserRole;
}

export interface AlertFilters {
  type?: AlertType[];
  priority?: TaskPriority[];
  isRead?: boolean;
  role?: UserRole;
  userId?: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority: TaskPriority;
  assignedTo?: string;
  dueDate?: Date | string;
  tags?: string[];
  category?: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  assignedTo?: string;
  dueDate?: Date | string;
  tags?: string[];
  category?: string;
}

