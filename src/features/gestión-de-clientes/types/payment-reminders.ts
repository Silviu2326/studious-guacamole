/**
 * Tipos para el sistema de recordatorios de pago
 */

export interface PaymentReminder {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  planName: string;
  amount: number;
  dueDate: string; // Fecha de vencimiento
  daysUntilDue: number; // Días hasta el vencimiento
  status: 'pending' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  reminderType: 'upcoming' | 'due-today' | 'overdue';
  channels: ReminderChannel[];
  sentAt?: string;
  paidAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ReminderChannel = 'email' | 'sms' | 'whatsapp' | 'push';

export interface PaymentReminderSettings {
  id: string;
  trainerId?: string;
  gymId?: string;
  enabled: boolean;
  // Días antes del vencimiento para enviar recordatorios
  reminderDays: number[]; // Ej: [7, 3, 1] = 7 días antes, 3 días antes, 1 día antes
  // Canales habilitados
  channels: ReminderChannel[];
  // Horario preferido para envío (formato HH:mm)
  preferredTime: string;
  // Plantilla de mensaje
  messageTemplate: string;
  // Configuración de recordatorios para pagos vencidos
  overdueReminders: {
    enabled: boolean;
    frequency: 'daily' | 'weekly'; // Frecuencia de recordatorios para pagos vencidos
    maxReminders: number; // Máximo de recordatorios para pagos vencidos
  };
  createdAt: string;
  updatedAt: string;
}

export interface PaymentReminderStats {
  totalPending: number;
  totalSent: number;
  totalPaid: number;
  totalOverdue: number;
  upcomingThisWeek: number;
  upcomingToday: number;
  averageDaysToPayment: number;
}

export interface SendReminderRequest {
  reminderId: string;
  channels: ReminderChannel[];
  customMessage?: string;
}

export interface SendReminderResponse {
  success: boolean;
  reminder: PaymentReminder;
  sentChannels: ReminderChannel[];
  failedChannels?: ReminderChannel[];
  error?: string;
}

