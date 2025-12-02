/**
 * Archivo de barril (barrel) para el módulo de Tareas y Alertas
 * 
 * Este índice centraliza el acceso a toda la lógica de API del módulo Tareas y Alertas,
 * proporcionando un punto único de importación para componentes y páginas.
 * 
 * Incluye:
 * - Funciones de gestión de tareas (crear, actualizar, eliminar, completar)
 * - Funciones de gestión de alertas (obtener, marcar como leída, posponer, resolver)
 * - Funciones de gestión de notificaciones (obtener, marcar como leída)
 * - Funciones de prioridad y ordenamiento (colores, estilos, ordenación)
 * - Tipos relacionados con las funciones de API
 */

// ============================================================================
// EXPORTACIONES DE TIPOS
// ============================================================================

// Re-exportar tipos desde el módulo de tipos
export type {
  Task,
  Alert,
  Notification,
  NotificationItem,
  TaskPriority,
  TaskStatus,
  AlertType,
  UserRole,
  AlertRulesMode,
  TaskFilters,
  AlertFilters,
  CreateTaskData,
  UpdateTaskData,
  DashboardTabConfig,
  TaskHistoryStats,
} from '../types';

// ============================================================================
// EXPORTACIONES DE FUNCIONES DE TAREAS
// ============================================================================

export {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
  getTasksByPriority,
  getAssignedTasks,
  getHighPriorityTasksForToday,
  createTaskFromAlert,
  getTaskHistoryStats,
} from './tasks';

// ============================================================================
// EXPORTACIONES DE FUNCIONES DE ALERTAS
// ============================================================================

export {
  getAlerts,
  getAlert,
  markAlertAsRead,
  markAlertsAsRead,
  markAllAlertsAsRead,
  createAlert,
  deleteAlert,
  getAlertsHistory,
  getUnreadAlertsCount,
  getTodayCriticalAlerts,
  resolveAlert,
  sendPaymentReminder,
  snoozeAlert,
} from './alerts';

// ============================================================================
// EXPORTACIONES DE FUNCIONES DE NOTIFICACIONES
// ============================================================================

export {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getUnreadNotificationsCount,
  getUpcomingReminders,
  generateICSFile,
  downloadICSFile,
  generateMailtoLink,
  addToCalendar,
} from './notifications';

// ============================================================================
// EXPORTACIONES DE FUNCIONES DE PRIORIDAD Y ESTILOS
// ============================================================================

export {
  calculateTaskPriority,
  getPriorityColor,
  getTaskPriorityCardStyles,
  getTaskPriorityIconColor,
  getAlertPriorityCardStyles,
  getAlertPriorityIconColor,
  sortTasksByPriority,
  getPriorityLabel,
} from './priority';
