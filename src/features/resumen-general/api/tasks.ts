/**
 * API para tareas del dashboard
 */

/**
 * Interfaz que representa una tarea en el sistema CRM
 * 
 * Ejemplos de tareas típicas:
 * - Llamar a un cliente para seguimiento
 * - Configurar campaña de marketing
 * - Revisar pagos pendientes
 * - Programar sesión de entrenamiento
 * - Actualizar información de cliente
 * - Revisar objetivos y progreso
 */
export interface Task {
  /** Identificador único de la tarea */
  id: string;
  
  /** Título breve de la tarea (ej: "Llamar a Juan Pérez") */
  title: string;
  
  /** Descripción detallada de la tarea (opcional) */
  description?: string;
  
  /** Estado actual de la tarea */
  status: 'pending' | 'in_progress' | 'done';
  
  /** Fecha límite para completar la tarea (opcional) */
  dueDate?: Date;
  
  /** Nivel de prioridad de la tarea */
  priority: 'low' | 'medium' | 'high';
  
  /** Categoría de la tarea (ej: "Clientes", "Finanzas", "Sesiones") */
  category: string;
}

/**
 * Obtiene la lista de tareas del usuario según su rol
 * 
 * @param role - Rol del usuario ('entrenador' o 'gimnasio')
 * @param userId - ID del usuario (opcional)
 * @returns Promise con array de tareas que incluye tareas pendientes, en progreso y completadas
 */
export async function getTasks(role: 'entrenador' | 'gimnasio', userId?: string): Promise<Task[]> {
  // Simulación de API - reemplazar con llamada real
  return new Promise((resolve) => {
    setTimeout(() => {
      const now = Date.now();
      
      if (role === 'entrenador') {
        resolve([
          // Tareas pendientes
          {
            id: '1',
            title: 'Llamar a Juan Pérez',
            description: 'Seguimiento post-sesión y revisar objetivos semanales',
            status: 'pending',
            priority: 'high',
            dueDate: new Date(now + 2 * 3600000), // En 2 horas
            category: 'Clientes',
          },
          {
            id: '2',
            title: 'Configurar campaña de bienvenida',
            description: 'Crear email automatizado para nuevos clientes',
            status: 'pending',
            priority: 'medium',
            dueDate: new Date(now + 24 * 3600000), // En 1 día
            category: 'Marketing',
          },
          {
            id: '3',
            title: 'Revisar pagos pendientes',
            description: 'Verificar estado de pagos del mes actual',
            status: 'pending',
            priority: 'high',
            dueDate: new Date(now + 6 * 3600000), // En 6 horas
            category: 'Finanzas',
          },
          // Tareas en progreso
          {
            id: '4',
            title: 'Preparar sesión con María García',
            description: 'Revisar progreso y ajustar plan de entrenamiento',
            status: 'in_progress',
            priority: 'high',
            dueDate: new Date(now + 4 * 3600000), // En 4 horas
            category: 'Sesiones',
          },
          {
            id: '5',
            title: 'Actualizar dieta de Pedro López',
            description: 'Ajustar macros según últimos check-ins',
            status: 'in_progress',
            priority: 'medium',
            dueDate: new Date(now + 48 * 3600000), // En 2 días
            category: 'Nutrición',
          },
          // Tareas completadas
          {
            id: '6',
            title: 'Revisar objetivos de Ana Martínez',
            description: 'Evaluar progreso del mes',
            status: 'done',
            priority: 'low',
            dueDate: new Date(now - 24 * 3600000), // Hace 1 día
            category: 'Seguimiento',
          },
          {
            id: '7',
            title: 'Enviar recordatorio de sesión',
            description: 'Recordatorio para cliente de mañana',
            status: 'done',
            priority: 'medium',
            dueDate: new Date(now - 12 * 3600000), // Hace 12 horas
            category: 'Comunicación',
          },
          {
            id: '8',
            title: 'Actualizar perfil de nuevo cliente',
            status: 'done',
            priority: 'low',
            category: 'Clientes',
          },
        ]);
      } else {
        // Gimnasio
        resolve([
          // Tareas pendientes
          {
            id: '1',
            title: 'Llamar a proveedor de equipamiento',
            description: 'Solicitar cotización para nuevas máquinas',
            status: 'pending',
            priority: 'high',
            dueDate: new Date(now + 3 * 3600000), // En 3 horas
            category: 'Compras',
          },
          {
            id: '2',
            title: 'Revisar facturación del día',
            description: 'Verificar pagos y membresías procesadas',
            status: 'pending',
            priority: 'high',
            dueDate: new Date(now + 2 * 3600000), // En 2 horas
            category: 'Finanzas',
          },
          {
            id: '3',
            title: 'Configurar campaña de promoción',
            description: 'Crear oferta especial para nuevos miembros',
            status: 'pending',
            priority: 'medium',
            dueDate: new Date(now + 72 * 3600000), // En 3 días
            category: 'Marketing',
          },
          {
            id: '4',
            title: 'Revisar nuevas solicitudes de membresía',
            status: 'pending',
            priority: 'medium',
            dueDate: new Date(now + 8 * 3600000), // En 8 horas
            category: 'Clientes',
          },
          // Tareas en progreso
          {
            id: '5',
            title: 'Coordinar mantenimiento cinta #3',
            description: 'Contactar técnico para reparación urgente',
            status: 'in_progress',
            priority: 'high',
            dueDate: new Date(now + 4 * 3600000), // En 4 horas
            category: 'Mantenimiento',
          },
          {
            id: '6',
            title: 'Actualizar horarios de clases',
            description: 'Ajustar calendario según disponibilidad de instructores',
            status: 'in_progress',
            priority: 'medium',
            dueDate: new Date(now + 24 * 3600000), // En 1 día
            category: 'Programación',
          },
          // Tareas completadas
          {
            id: '7',
            title: 'Revisar inventario de suplementos',
            description: 'Verificar stock y hacer pedido si es necesario',
            status: 'done',
            priority: 'low',
            dueDate: new Date(now - 48 * 3600000), // Hace 2 días
            category: 'Inventario',
          },
          {
            id: '8',
            title: 'Enviar newsletter mensual',
            description: 'Newsletter con novedades y promociones',
            status: 'done',
            priority: 'medium',
            dueDate: new Date(now - 24 * 3600000), // Hace 1 día
            category: 'Marketing',
          },
        ]);
      }
    }, 300);
  });
}

/**
 * Actualiza una tarea existente
 * 
 * @param task - Objeto Task completo con los datos actualizados
 * @returns Promise con la tarea actualizada (simulando respuesta del servidor)
 * 
 * @example
 * ```typescript
 * const updatedTask = await updateTask({
 *   id: '1',
 *   title: 'Llamar a cliente',
 *   description: 'Seguimiento importante',
 *   status: 'in_progress',
 *   priority: 'high',
 *   dueDate: new Date(),
 *   category: 'Clientes'
 * });
 * ```
 */
export async function updateTask(task: Task): Promise<Task> {
  // Simulación de API - reemplazar con llamada real
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simula la respuesta del servidor devolviendo la tarea actualizada
      // En un caso real, aquí se haría una llamada HTTP PUT/PATCH al backend
      resolve({
        ...task,
        // El servidor podría añadir campos adicionales como updatedAt, etc.
      });
    }, 200);
  });
}

