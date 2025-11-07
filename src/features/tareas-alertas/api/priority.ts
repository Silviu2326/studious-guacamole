import { TaskPriority, Task } from '../types';

export const calculateTaskPriority = (
  dueDate?: Date | string,
  category?: string,
  relatedEntityType?: string
): TaskPriority => {
  // Si tiene fecha de vencimiento y está cerca, es alta prioridad
  if (dueDate) {
    const due = new Date(dueDate);
    const now = new Date();
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'alta'; // Ya vencida
    if (diffDays <= 1) return 'alta'; // Vence hoy o mañana
    if (diffDays <= 3) return 'media'; // Vence en 2-3 días
  }

  // Categorías críticas son alta prioridad
  const criticalCategories = ['pago', 'facturación', 'mantenimiento-urgente', 'aforo'];
  if (category && criticalCategories.includes(category.toLowerCase())) {
    return 'alta';
  }

  // Entidades relacionadas críticas
  const criticalEntities = ['factura', 'equipo', 'clase'];
  if (relatedEntityType && criticalEntities.includes(relatedEntityType)) {
    return 'alta';
  }

  return 'media';
};

export const getPriorityColor = (priority: TaskPriority): string => {
  switch (priority) {
    case 'alta':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'media':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'baja':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const sortTasksByPriority = (tasks: Task[]): Task[] => {
  const priorityOrder = { alta: 3, media: 2, baja: 1 };
  return [...tasks].sort((a, b) => {
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;

    // Si misma prioridad, ordenar por fecha de vencimiento
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;

    // Si no hay fecha, ordenar por fecha de creación
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

export const getPriorityLabel = (priority: TaskPriority): string => {
  switch (priority) {
    case 'alta':
      return 'Alta';
    case 'media':
      return 'Media';
    case 'baja':
      return 'Baja';
    default:
      return 'Sin prioridad';
  }
};

