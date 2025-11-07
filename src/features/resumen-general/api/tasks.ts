/**
 * API para tareas del dashboard
 */

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  dueDate?: Date;
  completed: boolean;
  category: string;
}

export async function getTasks(role: 'entrenador' | 'gimnasio', userId?: string): Promise<Task[]> {
  // Simulación de API - reemplazar con llamada real
  return new Promise((resolve) => {
    setTimeout(() => {
      if (role === 'entrenador') {
        resolve([
          {
            id: '1',
            title: 'Preparar sesión con Juan Pérez',
            description: 'Revisar progreso y ajustar plan',
            priority: 'high',
            dueDate: new Date(Date.now() + 3600000),
            completed: false,
            category: 'Sesiones',
          },
          {
            id: '2',
            title: 'Actualizar dieta de María García',
            description: 'Ajustar macros según últimos check-ins',
            priority: 'medium',
            dueDate: new Date(Date.now() + 86400000),
            completed: false,
            category: 'Nutrición',
          },
          {
            id: '3',
            title: 'Revisar objetivos de Pedro López',
            priority: 'low',
            completed: false,
            category: 'Seguimiento',
          },
        ]);
      } else {
        resolve([
          {
            id: '1',
            title: 'Revisar facturación del día',
            priority: 'high',
            dueDate: new Date(Date.now() + 7200000),
            completed: false,
            category: 'Finanzas',
          },
          {
            id: '2',
            title: 'Coordinar mantenimiento cinta #3',
            description: 'Contactar técnico para reparación',
            priority: 'high',
            dueDate: new Date(Date.now() + 14400000),
            completed: false,
            category: 'Mantenimiento',
          },
          {
            id: '3',
            title: 'Revisar nuevas solicitudes de membresía',
            priority: 'medium',
            completed: false,
            category: 'Clientes',
          },
        ]);
      }
    }, 300);
  });
}

export async function updateTask(taskId: string, completed: boolean): Promise<void> {
  // Simulación de API
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 200);
  });
}

