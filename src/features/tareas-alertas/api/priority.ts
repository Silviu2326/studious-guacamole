import { TaskPriority, Task } from '../types';

/**
 * Sistema centralizado de prioridad y colores para tareas y alertas
 * 
 * CORRESPONDENCIA DE PRIORIDADES Y COLORES:
 * - Alta (alta): Rojo 🔴 - Crítico/Urgente
 * - Media (media): Amarillo 🟡 - Atención/Importante
 * - Baja (baja): Azul 🔵 - Informativo/Normal
 */

/**
 * Calcula la prioridad de una tarea basándose en su fecha de vencimiento,
 * categoría y tipo de entidad relacionada.
 */
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

/**
 * Obtiene los colores de badge/etiqueta para una prioridad de tarea.
 * Usado en Badges para mostrar el nivel de prioridad.
 * 
 * @returns Clases CSS de Tailwind para background, text y border
 */
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

/**
 * Obtiene los estilos para tarjetas de tareas según su prioridad.
 * Aplica colores de borde y fondo para dar jerarquía visual.
 * 
 * @returns Objeto con clases CSS para border, background y otros estilos
 */
export const getTaskPriorityCardStyles = (priority: TaskPriority): {
  border: string;
  background: string;
  borderColor: string;
} => {
  switch (priority) {
    case 'alta':
      return {
        border: 'border-2',
        background: 'bg-red-50',
        borderColor: 'border-red-200',
      };
    case 'media':
      return {
        border: 'border-2',
        background: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
      };
    case 'baja':
      return {
        border: 'border-2',
        background: 'bg-blue-50',
        borderColor: 'border-blue-200',
      };
    default:
      return {
        border: 'border',
        background: 'bg-gray-50',
        borderColor: 'border-gray-200',
      };
  }
};

/**
 * Obtiene los colores para íconos según la prioridad de la tarea.
 * 
 * @returns Clase CSS de Tailwind para el color del ícono
 */
export const getTaskPriorityIconColor = (priority: TaskPriority): string => {
  switch (priority) {
    case 'alta':
      return 'text-red-600';
    case 'media':
      return 'text-yellow-600';
    case 'baja':
      return 'text-blue-600';
    default:
      return 'text-gray-600';
  }
};

/**
 * Obtiene los estilos para tarjetas de alertas según su prioridad.
 * Mapea la prioridad de la alerta (que usa TaskPriority) a colores visuales consistentes.
 * 
 * CORRESPONDENCIA:
 * - alta → 🔴 Crítico (rojo)
 * - media → 🟡 Atención (amarillo)
 * - baja → 🔵 Informativo (azul)
 * 
 * @returns Objeto con clases CSS para border, background y otros estilos
 */
export const getAlertPriorityCardStyles = (priority: TaskPriority): {
  border: string;
  background: string;
  borderColor: string;
  ring?: string;
} => {
  switch (priority) {
    case 'alta':
      return {
        border: 'border-2',
        background: 'bg-red-50',
        borderColor: 'border-red-200',
        ring: 'ring-1 ring-red-100',
      };
    case 'media':
      return {
        border: 'border-2',
        background: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        ring: 'ring-1 ring-yellow-100',
      };
    case 'baja':
      return {
        border: 'border-2',
        background: 'bg-blue-50',
        borderColor: 'border-blue-200',
        ring: 'ring-1 ring-blue-100',
      };
    default:
      return {
        border: 'border',
        background: 'bg-gray-50',
        borderColor: 'border-gray-200',
      };
  }
};

/**
 * Obtiene los colores para íconos de alertas según la prioridad.
 * 
 * @returns Clase CSS de Tailwind para el color del ícono
 */
export const getAlertPriorityIconColor = (priority: TaskPriority): string => {
  switch (priority) {
    case 'alta':
      return 'text-red-600';
    case 'media':
      return 'text-yellow-600';
    case 'baja':
      return 'text-blue-600';
    default:
      return 'text-gray-600';
  }
};

/**
 * Ordena tareas por prioridad (alta → media → baja).
 * Si tienen la misma prioridad, ordena por fecha de vencimiento (más cercana primero).
 * Si no tienen fecha de vencimiento, ordena por fecha de creación (más reciente primero).
 */
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

/**
 * Obtiene la etiqueta legible en español para una prioridad.
 */
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

