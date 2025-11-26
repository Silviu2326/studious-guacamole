import { Notification as LeadNotification, NotificationPreferences, NotificationType } from '../types';
import { NotificationService } from '../services/notificationService';

export const getNotifications = async (
  userId: string,
  options?: {
    unreadOnly?: boolean;
    limit?: number;
    type?: NotificationType;
  }
): Promise<LeadNotification[]> => {
  return NotificationService.getNotifications(userId, options);
};

export const getUnreadCount = async (userId: string): Promise<number> => {
  return NotificationService.getUnreadCount(userId);
};

export const markAsRead = async (notificationId: string, userId: string): Promise<void> => {
  return NotificationService.markAsRead(notificationId, userId);
};

export const markAllAsRead = async (userId: string): Promise<void> => {
  return NotificationService.markAllAsRead(userId);
};

export const deleteNotification = async (notificationId: string, userId: string): Promise<void> => {
  return NotificationService.deleteNotification(notificationId, userId);
};

export const getPreferences = async (userId: string): Promise<NotificationPreferences> => {
  return NotificationService.getPreferences(userId);
};

export const updatePreferences = async (
  userId: string,
  updates: Partial<NotificationPreferences>
): Promise<NotificationPreferences> => {
  return NotificationService.updatePreferences(userId, updates);
};

export const createNotification = async (
  notification: Omit<LeadNotification, 'id' | 'read' | 'createdAt'>
): Promise<LeadNotification> => {
  return NotificationService.createNotification(notification);
};

export const runAllChecks = async (
  userId: string,
  businessType: 'entrenador' | 'gimnasio'
): Promise<void> => {
  return NotificationService.runAllChecks(userId, businessType);
};

