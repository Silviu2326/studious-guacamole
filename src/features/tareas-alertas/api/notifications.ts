import { Notification, Alert } from '../types';

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

/**
 * Obtiene los próximos recordatorios/citas (1-3 próximos)
 */
export const getUpcomingReminders = async (limit: number = 3): Promise<Notification[]> => {
  const now = new Date();
  
  // Obtener todas las notificaciones de tipo reminder
  const allNotifications = await getNotifications();
  
  // Filtrar recordatorios que tienen scheduledFor y están en el futuro
  const reminders = allNotifications
    .filter(notif => 
      notif.type === 'reminder' && 
      notif.scheduledFor &&
      new Date(notif.scheduledFor) >= now
    )
    .sort((a, b) => {
      // Ordenar por fecha programada (más próximos primero)
      const dateA = a.scheduledFor ? new Date(a.scheduledFor).getTime() : Infinity;
      const dateB = b.scheduledFor ? new Date(b.scheduledFor).getTime() : Infinity;
      return dateA - dateB;
    });

  return reminders.slice(0, limit);
};

/**
 * Formatea una fecha a formato ICS (YYYYMMDDTHHmmssZ)
 */
const formatICSDate = (date: Date): string => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
};

/**
 * Escapa caracteres especiales para formato ICS
 */
const escapeICS = (text: string): string => {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
};

/**
 * Genera un archivo ICS (iCalendar) para un evento de calendario
 */
export const generateICSFile = (
  title: string,
  description: string,
  startDate: Date,
  endDate?: Date,
  location?: string
): string => {
  const now = new Date();
  const uid = `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@app`;
  const start = formatICSDate(startDate);
  const end = endDate ? formatICSDate(endDate) : formatICSDate(new Date(startDate.getTime() + 3600000)); // +1 hora por defecto
  const created = formatICSDate(now);
  const dtstamp = formatICSDate(now);

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Gimnasio App//Calendar Event//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escapeICS(title)}`,
    `DESCRIPTION:${escapeICS(description)}`,
    ...(location ? [`LOCATION:${escapeICS(location)}`] : []),
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapeICS(title)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  return icsContent;
};

/**
 * Descarga un archivo ICS
 */
export const downloadICSFile = (icsContent: string, filename: string = 'evento.ics'): void => {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Genera un enlace mailto para añadir evento a calendario (alternativa)
 */
export const generateMailtoLink = (
  title: string,
  description: string,
  startDate: Date,
  endDate?: Date,
  location?: string
): string => {
  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const start = formatDate(startDate);
  const end = endDate ? formatDate(endDate) : formatDate(new Date(startDate.getTime() + 3600000));
  
  const params = new URLSearchParams({
    subject: title,
    body: `${description}\n\nFecha: ${startDate.toLocaleString('es-ES')}${endDate ? ` - ${endDate.toLocaleString('es-ES')}` : ''}${location ? `\nUbicación: ${location}` : ''}`,
  });

  // Algunos clientes de correo soportan parámetros de calendario
  return `mailto:?${params.toString()}`;
};

/**
 * Añade un evento de calendario desde una alerta o notificación
 * Genera y descarga un archivo ICS, o muestra un callback para integración futura
 */
export const addToCalendar = (
  alertOrNotification: Alert | Notification,
  onSuccess?: (message: string) => void,
  onError?: (error: string) => void
): void => {
  try {
    // Determinar si es una alerta o notificación de tipo cita
    // Para Alert: kind === 'appointment' o type === 'recordatorio' o tiene appointmentDate
    // Para Notification: kind === 'appointment' o type === 'reminder' o tiene appointmentDate
    const hasAppointmentDate = 'appointmentDate' in alertOrNotification && alertOrNotification.appointmentDate;
    const hasScheduledFor = 'scheduledFor' in alertOrNotification && alertOrNotification.scheduledFor;
    const isReminderType = 'type' in alertOrNotification && 
      (alertOrNotification.type === 'reminder' || alertOrNotification.type === 'recordatorio');
    
    const isAppointment = 
      alertOrNotification.kind === 'appointment' ||
      hasAppointmentDate ||
      (isReminderType && (hasScheduledFor || hasAppointmentDate));

    if (!isAppointment) {
      const errorMsg = 'Esta alerta no está asociada a una cita o recordatorio';
      if (onError) {
        onError(errorMsg);
      } else {
        console.warn(errorMsg);
      }
      return;
    }

    // Obtener fecha de inicio
    let startDate: Date;
    if ('appointmentDate' in alertOrNotification && alertOrNotification.appointmentDate) {
      startDate = new Date(alertOrNotification.appointmentDate);
    } else if ('scheduledFor' in alertOrNotification && alertOrNotification.scheduledFor) {
      startDate = new Date(alertOrNotification.scheduledFor);
    } else {
      // Si no hay fecha específica, usar la fecha de creación + 1 día como fallback
      startDate = new Date(alertOrNotification.createdAt);
      startDate.setDate(startDate.getDate() + 1);
      startDate.setHours(10, 0, 0, 0); // 10:00 AM por defecto
    }

    // Obtener fecha de fin
    let endDate: Date | undefined;
    if ('appointmentEndDate' in alertOrNotification && alertOrNotification.appointmentEndDate) {
      endDate = new Date(alertOrNotification.appointmentEndDate);
    } else {
      // Por defecto, 1 hora después del inicio
      endDate = new Date(startDate.getTime() + 3600000);
    }

    // Obtener ubicación si existe
    const location = 'location' in alertOrNotification ? alertOrNotification.location : undefined;

    // Generar y descargar archivo ICS
    const icsContent = generateICSFile(
      alertOrNotification.title,
      alertOrNotification.message,
      startDate,
      endDate,
      location
    );

    const filename = `evento-${alertOrNotification.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.ics`;
    downloadICSFile(icsContent, filename);

    const successMsg = 'Evento preparado para calendario. El archivo se ha descargado.';
    if (onSuccess) {
      onSuccess(successMsg);
    }

    // TODO: Integración futura con módulo de Agenda
    // Aquí se podría llamar a una función del módulo de Agenda para sincronizar directamente
    // Ejemplo: await agendaService.addEvent({ title, description, startDate, endDate, location });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Error al generar el evento de calendario';
    if (onError) {
      onError(errorMsg);
    } else {
      console.error('Error añadiendo a calendario:', error);
    }
  }
};

