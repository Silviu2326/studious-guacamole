// API para notificaciones en tiempo real

export type NotificationType = 'success' | 'warning' | 'error' | 'info' | 'reminder';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  action?: {
    label: string;
    url?: string;
    actionId?: string;
  };
  read: boolean;
  createdAt: string;
  readAt?: string;
}

export interface NotificationSettings {
  enabled: boolean;
  email: boolean;
  push: boolean;
  types: {
    success: boolean;
    warning: boolean;
    error: boolean;
    info: boolean;
    reminder: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string; // HH:mm
    end: string; // HH:mm
  };
}

export const getNotifications = async (unreadOnly?: boolean): Promise<Notification[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const notifications: Notification[] = [
    {
      id: 'notif_001',
      type: 'success',
      priority: 'medium',
      title: 'Post Publicado Exitosamente',
      message: 'Tu post "Transformación de Juan Pérez" se publicó correctamente en Instagram',
      action: {
        label: 'Ver Post',
        actionId: 'view_post_001'
      },
      read: false,
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString()
    },
    {
      id: 'notif_002',
      type: 'warning',
      priority: 'high',
      title: 'Bajo Engagement',
      message: 'Tu último post tiene un engagement rate del 2.5%, considera mejorar el contenido',
      action: {
        label: 'Ver Analíticas',
        actionId: 'view_analytics'
      },
      read: false,
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    },
    {
      id: 'notif_003',
      type: 'reminder',
      priority: 'medium',
      title: 'Post Próximo',
      message: 'Tienes un post programado para publicarse en 1 hora',
      action: {
        label: 'Ver Calendario',
        actionId: 'view_calendar'
      },
      read: false,
      createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString()
    },
    {
      id: 'notif_004',
      type: 'info',
      priority: 'low',
      title: 'Nueva Sugerencia Disponible',
      message: 'Tienes 3 nuevas sugerencias de contenido basadas en tu rendimiento',
      action: {
        label: 'Ver Sugerencias',
        actionId: 'view_suggestions'
      },
      read: true,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      readAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'notif_005',
      type: 'error',
      priority: 'high',
      title: 'Error al Publicar',
      message: 'No se pudo publicar el post "Tip de Nutrición" en Facebook. Revisa la conexión.',
      action: {
        label: 'Reintentar',
        actionId: 'retry_post_002'
      },
      read: false,
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
    }
  ];
  
  if (unreadOnly) {
    return notifications.filter(n => !n.read);
  }
  
  return notifications.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  // En producción, actualizar en la base de datos
};

export const markAllAsRead = async (): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  // En producción, actualizar en la base de datos
};

export const deleteNotification = async (notificationId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  // En producción, eliminar de la base de datos
};

export const getNotificationSettings = async (): Promise<NotificationSettings> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    enabled: true,
    email: true,
    push: true,
    types: {
      success: true,
      warning: true,
      error: true,
      info: true,
      reminder: true
    },
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '08:00'
    }
  };
};

export const updateNotificationSettings = async (settings: Partial<NotificationSettings>): Promise<NotificationSettings> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const current = await getNotificationSettings();
  return {
    ...current,
    ...settings
  };
};

export const createNotification = async (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>): Promise<Notification> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return {
    id: `notif_${Date.now()}`,
    ...notification,
    read: false,
    createdAt: new Date().toISOString()
  };
};

