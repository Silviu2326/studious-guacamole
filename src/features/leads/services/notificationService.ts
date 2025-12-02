import { Lead, LeadStatus, Notification as LeadNotification, NotificationType, NotificationPriority, NotificationPreferences } from '../types';
import { getLeads } from '../api/leads';
import { PredictionService } from './predictionService';

// Re-exportar tipos para compatibilidad
export type { Notification as LeadNotification, NotificationType, NotificationPriority, NotificationPreferences };

// Mock storage
let notifications: LeadNotification[] = [];
let preferences: Map<string, NotificationPreferences> = new Map();

// Inicializar preferencias por defecto
const getDefaultPreferences = (userId: string): NotificationPreferences => ({
  userId,
  pushEnabled: true,
  emailEnabled: true,
  types: {
    lead_no_response: { push: true, email: true },
    follow_up_today: { push: true, email: true },
    hot_lead: { push: true, email: false },
    new_lead: { push: true, email: false },
    lead_converted: { push: true, email: true },
    lead_stage_changed: { push: false, email: false },
    task_due: { push: true, email: true },
    quote_sent: { push: false, email: false },
    roi_alert: { push: true, email: true },
  },
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00'
  }
});

export class NotificationService {
  // Obtener notificaciones del usuario
  static async getNotifications(
    userId: string,
    options?: {
      unreadOnly?: boolean;
      limit?: number;
      type?: NotificationType;
    }
  ): Promise<LeadNotification[]> {
    let userNotifications = notifications.filter(n => n.userId === userId);

    if (options?.unreadOnly) {
      userNotifications = userNotifications.filter(n => !n.read);
    }

    if (options?.type) {
      userNotifications = userNotifications.filter(n => n.type === options.type);
    }

    // Ordenar por fecha (más recientes primero) y prioridad
    userNotifications.sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

    if (options?.limit) {
      userNotifications = userNotifications.slice(0, options.limit);
    }

    return userNotifications;
  }

  // Obtener contador de notificaciones no leídas
  static async getUnreadCount(userId: string): Promise<number> {
    const unread = await this.getNotifications(userId, { unreadOnly: true });
    return unread.length;
  }

  // Marcar notificación como leída
  static async markAsRead(notificationId: string, userId: string): Promise<void> {
    const notification = notifications.find(n => n.id === notificationId && n.userId === userId);
    if (notification) {
      notification.read = true;
    }
  }

  // Marcar todas como leídas
  static async markAllAsRead(userId: string): Promise<void> {
    notifications.forEach(n => {
      if (n.userId === userId && !n.read) {
        n.read = true;
      }
    });
  }

  // Eliminar notificación
  static async deleteNotification(notificationId: string, userId: string): Promise<void> {
    const index = notifications.findIndex(n => n.id === notificationId && n.userId === userId);
    if (index !== -1) {
      notifications.splice(index, 1);
    }
  }

  // Obtener preferencias del usuario
  static async getPreferences(userId: string): Promise<NotificationPreferences> {
    if (!preferences.has(userId)) {
      preferences.set(userId, getDefaultPreferences(userId));
    }
    return preferences.get(userId)!;
  }

  // Actualizar preferencias
  static async updatePreferences(
    userId: string,
    updates: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences> {
    const current = await this.getPreferences(userId);
    const updated = { ...current, ...updates };
    preferences.set(userId, updated);
    return updated;
  }

  // Crear notificación
  static async createNotification(
    notification: Omit<LeadNotification, 'id' | 'read' | 'createdAt'>
  ): Promise<LeadNotification> {
    const prefs = await this.getPreferences(notification.userId);
    
    // Verificar si está en horas silenciosas
    if (prefs.quietHours?.enabled) {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const { start, end } = prefs.quietHours;
      
      // Si está en horas silenciosas y no es urgente, no crear notificación push
      if (this.isInQuietHours(currentTime, start, end) && notification.priority !== 'urgent') {
        // Solo crear si email está habilitado
        if (!prefs.types[notification.type]?.email) {
          // No crear notificación si no está habilitada
          throw new Error('Notification disabled in quiet hours');
        }
      }
    }

    // Verificar si el tipo de notificación está habilitado
    const typePrefs = prefs.types[notification.type];
    if (!typePrefs.push && !typePrefs.email) {
      throw new Error('Notification type disabled');
    }

    const newNotification: LeadNotification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      read: false,
      createdAt: new Date()
    };

    notifications.push(newNotification);

    // Enviar notificación push si está habilitada
    if (prefs.pushEnabled && typePrefs.push) {
      await this.sendPushNotification(newNotification);
    }

    // Enviar email si está habilitado
    if (prefs.emailEnabled && typePrefs.email) {
      await this.sendEmailNotification(newNotification, prefs);
    }

    return newNotification;
  }

  // Verificar si está en horas silenciosas
  private static isInQuietHours(currentTime: string, start: string, end: string): boolean {
    const [currentHour, currentMin] = currentTime.split(':').map(Number);
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);

    const current = currentHour * 60 + currentMin;
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    if (startTime <= endTime) {
      // Horas normales (ej: 22:00 - 08:00)
      return current >= startTime || current < endTime;
    } else {
      // Horas que cruzan medianoche (ej: 22:00 - 08:00)
      return current >= startTime || current < endTime;
    }
  }

  // Enviar notificación push
  private static async sendPushNotification(notification: LeadNotification): Promise<void> {
    // Verificar si el navegador soporta notificaciones
    if (!('Notification' in window)) {
      console.warn('Browser does not support notifications');
      return;
    }

    // Solicitar permiso si no está concedido
    if (Notification.permission === 'default') {
      await Notification.requestPermission();
    }

    if (Notification.permission === 'granted') {
      const options: NotificationOptions = {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.id,
        requireInteraction: notification.priority === 'urgent',
        data: {
          notificationId: notification.id,
          leadId: notification.leadId,
          actionUrl: notification.actionUrl
        }
      };

      const browserNotification = new Notification(notification.title, options);

      browserNotification.onclick = () => {
        window.focus();
        if (notification.actionUrl) {
          window.location.href = notification.actionUrl;
        }
        browserNotification.close();
      };

      // Auto-cerrar después de 5 segundos (excepto urgentes)
      if (notification.priority !== 'urgent') {
        setTimeout(() => browserNotification.close(), 5000);
      }
    }
  }

  // Enviar email (simulado)
  private static async sendEmailNotification(
    notification: LeadNotification,
    prefs: NotificationPreferences
  ): Promise<void> {
    // En producción, esto enviaría un email real
    console.log('[NotificationService] Email notification sent:', {
      to: `user-${notification.userId}@example.com`,
      subject: notification.title,
      body: notification.message,
      type: notification.type
    });
  }

  // Verificar y crear notificaciones para leads sin respuesta
  static async checkLeadsWithoutResponse(
    userId: string,
    businessType: 'entrenador' | 'gimnasio'
  ): Promise<void> {
    const leads = await getLeads({ businessType });
    const userLeads = businessType === 'entrenador'
      ? leads.filter(l => l.assignedTo === userId)
      : leads;

    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    for (const lead of userLeads) {
      if (lead.status === 'converted' || lead.status === 'lost') continue;
      if (!lead.lastContactDate) continue;

      const lastContact = new Date(lead.lastContactDate);
      if (lastContact < twentyFourHoursAgo) {
        // Verificar si ya existe una notificación reciente para este lead
        const existing = notifications.find(
          n => n.leadId === lead.id &&
               n.type === 'lead_no_response' &&
               n.userId === userId &&
               !n.read &&
               (now.getTime() - n.createdAt.getTime()) < 24 * 60 * 60 * 1000
        );

        if (!existing) {
          await this.createNotification({
            type: 'lead_no_response',
            priority: 'high',
            title: 'Lead sin respuesta',
            message: `${lead.name} no ha respondido en más de 24 horas`,
            leadId: lead.id,
            leadName: lead.name,
            userId,
            businessType,
            actionUrl: `/leads?leadId=${lead.id}`
          });
        }
      }
    }
  }

  // Verificar y crear notificaciones para seguimientos de hoy
  static async checkFollowUpsToday(
    userId: string,
    businessType: 'entrenador' | 'gimnasio'
  ): Promise<void> {
    const leads = await getLeads({ businessType });
    const userLeads = businessType === 'entrenador'
      ? leads.filter(l => l.assignedTo === userId)
      : leads;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    for (const lead of userLeads) {
      if (!lead.nextFollowUpDate) continue;
      if (lead.status === 'converted' || lead.status === 'lost') continue;

      const followUpDate = new Date(lead.nextFollowUpDate);
      followUpDate.setHours(0, 0, 0, 0);

      if (followUpDate >= today && followUpDate < tomorrow) {
        // Verificar si ya existe una notificación para hoy
        const existing = notifications.find(
          n => n.leadId === lead.id &&
               n.type === 'follow_up_today' &&
               n.userId === userId &&
               !n.read &&
               n.createdAt >= today
        );

        if (!existing) {
          await this.createNotification({
            type: 'follow_up_today',
            priority: 'high',
            title: 'Seguimiento programado hoy',
            message: `Tienes un seguimiento programado con ${lead.name} hoy`,
            leadId: lead.id,
            leadName: lead.name,
            userId,
            businessType,
            actionUrl: `/leads?leadId=${lead.id}`
          });
        }
      }
    }
  }

  // Verificar y crear notificaciones para leads calientes
  static async checkHotLeads(
    userId: string,
    businessType: 'entrenador' | 'gimnasio'
  ): Promise<void> {
    const leads = await getLeads({ businessType });
    const userLeads = businessType === 'entrenador'
      ? leads.filter(l => l.assignedTo === userId)
      : leads;

    const activeLeads = userLeads.filter(
      l => l.status !== 'converted' && l.status !== 'lost'
    );

    const predictions = await PredictionService.getPredictions(activeLeads, businessType);

    for (const lead of activeLeads) {
      const prediction = predictions.get(lead.id);
      if (!prediction) continue;

      // Lead caliente: probabilidad > 70% y score > 60
      if (prediction.probability >= 70 && lead.score >= 60) {
        // Verificar si ya existe una notificación reciente
        const existing = notifications.find(
          n => n.leadId === lead.id &&
               n.type === 'hot_lead' &&
               n.userId === userId &&
               !n.read &&
               (new Date().getTime() - n.createdAt.getTime()) < 6 * 60 * 60 * 1000 // 6 horas
        );

        if (!existing) {
          await this.createNotification({
            type: 'hot_lead',
            priority: 'urgent',
            title: 'Lead caliente detectado',
            message: `${lead.name} tiene ${prediction.probability.toFixed(0)}% de probabilidad de conversión`,
            leadId: lead.id,
            leadName: lead.name,
            userId,
            businessType,
            actionUrl: `/leads?leadId=${lead.id}`,
            metadata: {
              probability: prediction.probability,
              score: lead.score
            }
          });
        }
      }
    }
  }

  // Ejecutar todas las verificaciones
  static async runAllChecks(
    userId: string,
    businessType: 'entrenador' | 'gimnasio'
  ): Promise<void> {
    await Promise.all([
      this.checkLeadsWithoutResponse(userId, businessType),
      this.checkFollowUpsToday(userId, businessType),
      this.checkHotLeads(userId, businessType)
    ]);
  }

  // Limpiar notificaciones antiguas (más de 30 días)
  static async cleanupOldNotifications(): Promise<void> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    notifications = notifications.filter(n => n.createdAt >= thirtyDaysAgo);
  }
}

