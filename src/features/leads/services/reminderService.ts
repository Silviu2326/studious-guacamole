import { LeadReminder } from '../types';

let reminders: Map<string, LeadReminder[]> = new Map();

export class ReminderService {
  static async getRemindersForLead(leadId: string): Promise<LeadReminder[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return reminders.get(leadId) || [];
  }

  static async getPendingReminders(userId: string): Promise<LeadReminder[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const now = new Date();
    const allReminders: LeadReminder[] = [];
    
    reminders.forEach(leadReminders => {
      leadReminders.forEach(reminder => {
        if (
          !reminder.completed &&
          reminder.createdBy === userId &&
          reminder.dueDate <= now &&
          (!reminder.snoozedUntil || reminder.snoozedUntil <= now)
        ) {
          allReminders.push(reminder);
        }
      });
    });
    
    return allReminders.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  }

  static async createReminder(
    leadId: string,
    dueDate: Date,
    message: string,
    userId: string
  ): Promise<LeadReminder> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const newReminder: LeadReminder = {
      id: `reminder-${Date.now()}`,
      leadId,
      dueDate,
      message,
      completed: false,
      createdBy: userId,
      createdAt: new Date(),
    };

    const leadReminders = reminders.get(leadId) || [];
    leadReminders.push(newReminder);
    reminders.set(leadId, leadReminders);

    return newReminder;
  }

  static async completeReminder(reminderId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    reminders.forEach(leadReminders => {
      const reminder = leadReminders.find(r => r.id === reminderId);
      if (reminder) {
        reminder.completed = true;
      }
    });
  }

  static async snoozeReminder(reminderId: string, snoozedUntil: Date): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    reminders.forEach(leadReminders => {
      const reminder = leadReminders.find(r => r.id === reminderId);
      if (reminder) {
        reminder.snoozedUntil = snoozedUntil;
      }
    });
  }

  static async deleteReminder(reminderId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    reminders.forEach((leadReminders, leadId) => {
      const updated = leadReminders.filter(r => r.id !== reminderId);
      reminders.set(leadId, updated);
    });
  }
}

