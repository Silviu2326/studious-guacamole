import { Alert, AlertFilters, AlertType } from '../types';

// Mock data para desarrollo
const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'check-in-faltante',
    title: 'Cliente sin check-in',
    message: 'Juan Pérez no ha subido check-in desde hace 5 días',
    priority: 'alta',
    isRead: false,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    actionUrl: '/clientes/cliente1',
    relatedEntityId: 'cliente1',
    relatedEntityType: 'cliente',
    role: 'entrenador',
  },
  {
    id: '2',
    type: 'lead-sin-seguimiento',
    title: 'Lead sin seguimiento',
    message: 'María González mostró interés hace 2 días sin seguimiento',
    priority: 'alta',
    isRead: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    actionUrl: '/leads/lead1',
    relatedEntityId: 'lead1',
    relatedEntityType: 'lead',
    role: 'entrenador',
  },
  {
    id: '3',
    type: 'pago-pendiente',
    title: 'Pago pendiente',
    message: 'Cliente Ana García tiene un pago pendiente de €150',
    priority: 'media',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    actionUrl: '/facturacin-cobros',
    relatedEntityId: 'pago1',
    relatedEntityType: 'pago',
    role: 'entrenador',
  },
  {
    id: '4',
    type: 'factura-vencida',
    title: 'Factura vencida',
    message: 'Factura #1234 por €350 vencida hace 3 días',
    priority: 'alta',
    isRead: false,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    actionUrl: '/facturacin-cobros/factura1',
    relatedEntityId: 'factura1',
    relatedEntityType: 'factura',
    role: 'gimnasio',
  },
  {
    id: '5',
    type: 'equipo-roto',
    title: 'Equipo dañado',
    message: 'Máquina de press de banca necesita reparación urgente',
    priority: 'alta',
    isRead: false,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    actionUrl: '/mantenimiento-incidencias/incidencia1',
    relatedEntityId: 'equipo1',
    relatedEntityType: 'equipo',
    role: 'gimnasio',
  },
  {
    id: '6',
    type: 'aforo-superado',
    title: 'Aforo superado',
    message: 'Clase de spinning tiene 25 reservas para 20 plazas disponibles',
    priority: 'alta',
    isRead: true,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    actionUrl: '/control-de-acceso-aforo',
    relatedEntityId: 'clase1',
    relatedEntityType: 'clase',
    role: 'gimnasio',
  },
  {
    id: '7',
    type: 'mantenimiento',
    title: 'Mantenimiento programado',
    message: 'Revisión mensual de equipos programada para mañana',
    priority: 'media',
    isRead: false,
    createdAt: new Date().toISOString(),
    actionUrl: '/mantenimiento-incidencias',
    role: 'gimnasio',
  },
];

let alertsData = [...mockAlerts];

export const getAlerts = async (filters?: AlertFilters): Promise<Alert[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  let filteredAlerts = [...alertsData];

  if (filters) {
    if (filters.type && filters.type.length > 0) {
      filteredAlerts = filteredAlerts.filter(alert => filters.type!.includes(alert.type));
    }

    if (filters.priority && filters.priority.length > 0) {
      filteredAlerts = filteredAlerts.filter(alert => filters.priority!.includes(alert.priority));
    }

    if (filters.isRead !== undefined) {
      filteredAlerts = filteredAlerts.filter(alert => alert.isRead === filters.isRead);
    }

    if (filters.role) {
      filteredAlerts = filteredAlerts.filter(alert => alert.role === filters.role);
    }

    if (filters.userId) {
      filteredAlerts = filteredAlerts.filter(alert => alert.userId === filters.userId);
    }
  }

  // Ordenar por prioridad y fecha (más recientes primero)
  filteredAlerts.sort((a, b) => {
    const priorityOrder = { alta: 3, media: 2, baja: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return filteredAlerts;
};

export const getAlert = async (id: string): Promise<Alert | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return alertsData.find(alert => alert.id === id) || null;
};

export const markAlertAsRead = async (id: string): Promise<Alert> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  const alertIndex = alertsData.findIndex(alert => alert.id === id);
  if (alertIndex === -1) {
    throw new Error('Alerta no encontrada');
  }

  alertsData[alertIndex] = {
    ...alertsData[alertIndex],
    isRead: true,
  };

  return alertsData[alertIndex];
};

export const markAllAlertsAsRead = async (filters?: AlertFilters): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const alerts = await getAlerts(filters);
  alerts.forEach(alert => {
    const index = alertsData.findIndex(a => a.id === alert.id);
    if (index !== -1) {
      alertsData[index].isRead = true;
    }
  });
};

export const createAlert = async (alertData: Omit<Alert, 'id' | 'createdAt' | 'isRead'>): Promise<Alert> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  const newAlert: Alert = {
    ...alertData,
    id: `alert_${Date.now()}`,
    isRead: false,
    createdAt: new Date().toISOString(),
  };

  alertsData.unshift(newAlert);
  return newAlert;
};

export const deleteAlert = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  alertsData = alertsData.filter(alert => alert.id !== id);
};

export const getAlertsHistory = async (limit?: number): Promise<Alert[]> => {
  const allAlerts = await getAlerts();
  const sortedAlerts = allAlerts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  return limit ? sortedAlerts.slice(0, limit) : sortedAlerts;
};

export const getUnreadAlertsCount = async (filters?: AlertFilters): Promise<number> => {
  const alerts = await getAlerts({ ...filters, isRead: false });
  return alerts.length;
};

