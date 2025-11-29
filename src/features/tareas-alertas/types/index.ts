export type TaskPriority = 'alta' | 'media' | 'baja';
export type TaskStatus = 'pendiente' | 'en-progreso' | 'completada' | 'cancelada';
export type AlertType = 'pago-pendiente' | 'check-in-faltante' | 'lead-sin-seguimiento' | 'factura-vencida' | 'equipo-roto' | 'aforo-superado' | 'mantenimiento' | 'tarea-critica' | 'recordatorio';
export type UserRole = 'entrenador' | 'gimnasio';
export type AlertRulesMode = 'simple' | 'advanced';

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
  // Tipo de entidad relacionada (cliente, lead, etc.)
  entityType?: 'client' | 'lead' | 'other';
  // Datos de contacto para acciones rápidas
  contactPhone?: string;
  contactEmail?: string;
  // Estado de resolución
  isResolved?: boolean;
  resolvedAt?: Date | string;
  // Estado de posponer (snooze)
  snoozedUntil?: Date | string;
  // Tipo de alerta para identificar si está relacionada con una cita/recordatorio
  kind?: 'appointment' | 'payment' | 'system';
  // Fecha y hora de la cita (si aplica)
  appointmentDate?: Date | string;
  appointmentEndDate?: Date | string;
  location?: string;
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
  // Tipo de notificación para identificar si está relacionada con una cita/recordatorio
  kind?: 'appointment' | 'payment' | 'system';
  // Fecha y hora de la cita (si aplica)
  appointmentDate?: Date | string;
  appointmentEndDate?: Date | string;
  location?: string;
}

/**
 * Tipo unificado para elementos del Centro de Notificaciones
 * Combina Alert y Notification con campos comunes
 */
export interface NotificationItem {
  id: string;
  type: 'alert' | 'notification';
  title: string;
  message: string;
  priority: TaskPriority;
  isRead: boolean;
  createdAt: Date | string;
  actionUrl?: string;
  // Campos específicos de Alert
  alertType?: AlertType;
  relatedEntityId?: string;
  relatedEntityType?: string;
  entityType?: 'client' | 'lead' | 'other';
  userId?: string;
  role?: UserRole;
  // Campos específicos de Notification
  notificationType?: Notification['type'];
  scheduledFor?: Date | string;
  // Campos para citas/recordatorios
  kind?: 'appointment' | 'payment' | 'system';
  appointmentDate?: Date | string;
  appointmentEndDate?: Date | string;
  location?: string;
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

import type { LucideIcon } from 'lucide-react';

/**
 * Configuración de tabs del dashboard de Tareas y Alertas
 * Define qué tabs son visibles para cada rol de usuario
 */
export interface DashboardTabConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  allowedRoles: UserRole[];
}

/**
 * Estadísticas de productividad del historial de tareas
 * Usado para mostrar métricas de tareas completadas y canceladas
 */
export interface TaskHistoryStats {
  completedThisWeek: number;
  completedPreviousWeek: number;
  completedCount: number;
  cancelledCount: number;
  completedPercentage: number;
  cancelledPercentage: number;
}

