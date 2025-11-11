import { 
  PaymentReminder, 
  PaymentReminderSettings, 
  PaymentReminderStats,
  SendReminderRequest,
  SendReminderResponse,
  ReminderChannel
} from '../types/payment-reminders';
import { Client, Client360Profile } from '../types';
import { getClients, getClientById } from './clients';

// Mock data - En producción esto se reemplazaría con llamadas reales a la API
const MOCK_REMINDERS: PaymentReminder[] = [];
const MOCK_SETTINGS: Map<string, PaymentReminderSettings> = new Map();

/**
 * Obtiene todos los recordatorios de pago para un entrenador/gimnasio
 */
export const getPaymentReminders = async (
  role: 'entrenador' | 'gimnasio',
  userId?: string,
  filters?: {
    status?: PaymentReminder['status'];
    reminderType?: PaymentReminder['reminderType'];
  }
): Promise<PaymentReminder[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  // Obtener clientes
  const clients = await getClients(role, userId);
  
  // Generar recordatorios basados en los clientes
  const reminders: PaymentReminder[] = [];
  const today = new Date();
  
  for (const client of clients) {
    // Solo generar recordatorios para clientes activos con planes
    if (client.status === 'activo' && client.planId && client.membershipStatus === 'activa') {
      const clientProfile = await getClientById(client.id);
      if (clientProfile?.metrics.nextPaymentDate) {
        const dueDate = new Date(clientProfile.metrics.nextPaymentDate);
        const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        // Solo incluir si está por vencer (dentro de 30 días) o vencido
        if (daysUntilDue <= 30) {
          let reminderType: PaymentReminder['reminderType'] = 'upcoming';
          let status: PaymentReminder['status'] = 'pending';
          
          if (daysUntilDue < 0) {
            reminderType = 'overdue';
            status = 'overdue';
          } else if (daysUntilDue === 0) {
            reminderType = 'due-today';
          }
          
          const reminder: PaymentReminder = {
            id: `reminder-${client.id}-${dueDate.toISOString().split('T')[0]}`,
            clientId: client.id,
            clientName: client.name,
            clientEmail: client.email,
            clientPhone: client.phone,
            planName: client.planName || 'Plan',
            amount: clientProfile.metrics.totalRevenue / 12 || 150, // Estimación mensual
            dueDate: clientProfile.metrics.nextPaymentDate,
            daysUntilDue,
            status,
            reminderType,
            channels: ['email'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          reminders.push(reminder);
        }
      }
    }
  }
  
  // Aplicar filtros
  let filteredReminders = reminders;
  if (filters?.status) {
    filteredReminders = filteredReminders.filter(r => r.status === filters.status);
  }
  if (filters?.reminderType) {
    filteredReminders = filteredReminders.filter(r => r.reminderType === filters.reminderType);
  }
  
  return filteredReminders.sort((a, b) => {
    const dateA = new Date(a.dueDate).getTime();
    const dateB = new Date(b.dueDate).getTime();
    return dateA - dateB;
  });
};

/**
 * Obtiene estadísticas de recordatorios de pago
 */
export const getPaymentReminderStats = async (
  role: 'entrenador' | 'gimnasio',
  userId?: string
): Promise<PaymentReminderStats> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const reminders = await getPaymentReminders(role, userId);
  const today = new Date();
  const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  const upcomingThisWeek = reminders.filter(r => {
    const dueDate = new Date(r.dueDate);
    return dueDate >= today && dueDate <= weekFromNow && r.status !== 'paid';
  }).length;
  
  const upcomingToday = reminders.filter(r => {
    const dueDate = new Date(r.dueDate);
    return dueDate.toDateString() === today.toDateString() && r.status !== 'paid';
  }).length;
  
  const paidReminders = reminders.filter(r => r.status === 'paid');
  const averageDaysToPayment = paidReminders.length > 0
    ? paidReminders.reduce((sum, r) => {
        const sentDate = r.sentAt ? new Date(r.sentAt) : new Date(r.createdAt);
        const paidDate = r.paidAt ? new Date(r.paidAt) : new Date();
        const days = Math.ceil((paidDate.getTime() - sentDate.getTime()) / (1000 * 60 * 60 * 24));
        return sum + days;
      }, 0) / paidReminders.length
    : 0;
  
  return {
    totalPending: reminders.filter(r => r.status === 'pending').length,
    totalSent: reminders.filter(r => r.status === 'sent').length,
    totalPaid: reminders.filter(r => r.status === 'paid').length,
    totalOverdue: reminders.filter(r => r.status === 'overdue').length,
    upcomingThisWeek,
    upcomingToday,
    averageDaysToPayment: Math.round(averageDaysToPayment),
  };
};

/**
 * Obtiene la configuración de recordatorios para un usuario
 */
export const getPaymentReminderSettings = async (
  role: 'entrenador' | 'gimnasio',
  userId?: string
): Promise<PaymentReminderSettings> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const key = `${role}-${userId || 'default'}`;
  
  if (!MOCK_SETTINGS.has(key)) {
    const defaultSettings: PaymentReminderSettings = {
      id: `settings-${key}`,
      trainerId: role === 'entrenador' ? userId : undefined,
      gymId: role === 'gimnasio' ? userId : undefined,
      enabled: true,
      reminderDays: [7, 3, 1], // 7 días antes, 3 días antes, 1 día antes
      channels: ['email', 'whatsapp'],
      preferredTime: '09:00',
      messageTemplate: `Hola {{clientName}},

Te recordamos que tu cuota de {{planName}} ({{amount}}€) vence el {{dueDate}}.

Por favor, realiza el pago para mantener tu membresía activa.

Gracias,
Tu equipo de entrenamiento`,
      overdueReminders: {
        enabled: true,
        frequency: 'daily',
        maxReminders: 5,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    MOCK_SETTINGS.set(key, defaultSettings);
  }
  
  return MOCK_SETTINGS.get(key)!;
};

/**
 * Actualiza la configuración de recordatorios
 */
export const updatePaymentReminderSettings = async (
  role: 'entrenador' | 'gimnasio',
  userId: string | undefined,
  updates: Partial<PaymentReminderSettings>
): Promise<PaymentReminderSettings> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const currentSettings = await getPaymentReminderSettings(role, userId);
  const updatedSettings: PaymentReminderSettings = {
    ...currentSettings,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  const key = `${role}-${userId || 'default'}`;
  MOCK_SETTINGS.set(key, updatedSettings);
  
  return updatedSettings;
};

/**
 * Envía un recordatorio de pago
 */
export const sendPaymentReminder = async (
  request: SendReminderRequest
): Promise<SendReminderResponse> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // En producción, aquí se enviarían los recordatorios reales
  console.log('[PaymentReminders] Enviando recordatorio:', {
    reminderId: request.reminderId,
    channels: request.channels,
  });
  
  // Simular envío exitoso
  const reminder = MOCK_REMINDERS.find(r => r.id === request.reminderId);
  if (!reminder) {
    throw new Error('Recordatorio no encontrado');
  }
  
  const updatedReminder: PaymentReminder = {
    ...reminder,
    status: 'sent',
    channels: request.channels,
    sentAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  // Actualizar en el array (en producción sería en la base de datos)
  const index = MOCK_REMINDERS.findIndex(r => r.id === request.reminderId);
  if (index !== -1) {
    MOCK_REMINDERS[index] = updatedReminder;
  }
  
  return {
    success: true,
    reminder: updatedReminder,
    sentChannels: request.channels,
  };
};

/**
 * Envía recordatorios automáticos según la configuración
 */
export const sendAutomaticReminders = async (
  role: 'entrenador' | 'gimnasio',
  userId?: string
): Promise<{ sent: number; failed: number }> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const settings = await getPaymentReminderSettings(role, userId);
  if (!settings.enabled) {
    return { sent: 0, failed: 0 };
  }
  
  const reminders = await getPaymentReminders(role, userId, { status: 'pending' });
  const today = new Date();
  let sent = 0;
  let failed = 0;
  
  for (const reminder of reminders) {
    const dueDate = new Date(reminder.dueDate);
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    // Verificar si debe enviarse según los días configurados
    if (settings.reminderDays.includes(daysUntilDue) || daysUntilDue < 0) {
      try {
        await sendPaymentReminder({
          reminderId: reminder.id,
          channels: settings.channels,
        });
        sent++;
      } catch (error) {
        console.error('Error enviando recordatorio:', error);
        failed++;
      }
    }
  }
  
  return { sent, failed };
};

/**
 * Marca un recordatorio como pagado
 */
export const markReminderAsPaid = async (
  reminderId: string
): Promise<PaymentReminder> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const reminder = MOCK_REMINDERS.find(r => r.id === reminderId);
  if (!reminder) {
    throw new Error('Recordatorio no encontrado');
  }
  
  const updatedReminder: PaymentReminder = {
    ...reminder,
    status: 'paid',
    paidAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const index = MOCK_REMINDERS.findIndex(r => r.id === reminderId);
  if (index !== -1) {
    MOCK_REMINDERS[index] = updatedReminder;
  }
  
  return updatedReminder;
};

