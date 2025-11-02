import { Notification } from '../types';

// Mock data para desarrollo
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'reminder',
    title: 'Recordatorio: Sesión de evaluación mañana',
    message: 'Tienes una sesión de evaluación programada mañana a las 10:00',
    priority: 'media',
    isRead: false,
    createdAt: new Date().toISOString(),
    scheduledFor: new Date(Date.now() + 86400000).toISOString(),
    actionUrl: '/agenda',
  },
  {
    id: '2',
    type: 'task',
    title: 'Nueva tarea asignada',
    message: 'Se te ha asignado una nueva tarea: "Seguimiento a cliente sin check-in"',
    priority: 'alta',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    actionUrl: '/tareas-alertas',
  },
  {
    id: '3',
    type: 'alert',
    title: 'Alerta: Factura vencida',
    message: 'Tienes una factura vencida que requiere atención inmediata',
    priority: 'alta',
    isRead: true,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    actionUrl: '/facturacin-cobros',
  },
];

let notificationsData = [...mockNotifications];

export const getNotifications = async (isRead?: boolean): Promise<Notification[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  let filtered = [...notificationsData];

  if (isRead !== undefined) {
    filtered = filtered.filter(n => n.isRead === isRead);
  }

  // Ordenar por fecha (más recientes primero)
  filtered.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return filtered;
};

export const markNotificationAsRead = async (id: string): Promise<Notification> => {
  await new Promise(resolve => setTimeout(resolve, 100));

  const index = notificationsData.findIndex(n => n.id === id);
  if (index === -1) {
    throw new Error('Notificación no encontrada');
  }

  notificationsData[index] = {
    ...notificationsData[index],
    isRead: true,
  };

  return notificationsData[index];
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  notificationsData = notificationsData.map(n => ({ ...n, isRead: true }));
};

export const deleteNotification = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  notificationsData = notificationsData.filter(n => n.id !== id);
};

export const getUnreadNotificationsCount = async (): Promise<number> => {
  const notifications = await getNotifications(false);
  return notifications.length;
};

