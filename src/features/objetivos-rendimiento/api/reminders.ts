import { Objective, AutomaticReminder, ReminderCadence } from '../types';

/**
 * User Story 1: Configura recordatorios automáticos para un objetivo
 */
export const configureAutomaticReminder = async (
  objectiveId: string,
  reminderConfig: {
    enabled: boolean;
    cadence: ReminderCadence;
    notificationChannels?: ('email' | 'in_app' | 'push')[];
    reminderTime?: string;
  }
): Promise<Objective> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Load existing objectives
  const savedObjectives = localStorage.getItem('objectives-data');
  const objectives = savedObjectives ? JSON.parse(savedObjectives) : [];
  
  const objective = objectives.find((obj: Objective) => obj.id === objectiveId);
  if (!objective) throw new Error('Objective not found');
  
  // Calcular próxima fecha de recordatorio
  const nextReminderDate = calculateNextReminderDate(reminderConfig.cadence, reminderConfig.reminderTime);
  
  const automaticReminder: AutomaticReminder = {
    enabled: reminderConfig.enabled,
    cadence: reminderConfig.cadence,
    notificationChannels: reminderConfig.notificationChannels || ['in_app'],
    nextReminderDate: nextReminderDate.toISOString(),
    reminderTime: reminderConfig.reminderTime || '09:00',
  };
  
  objective.automaticReminder = automaticReminder;
  objective.updatedAt = new Date().toISOString();
  
  const index = objectives.findIndex((obj: Objective) => obj.id === objectiveId);
  objectives[index] = objective;
  localStorage.setItem('objectives-data', JSON.stringify(objectives));
  
  return objective;
};

/**
 * User Story 1: Calcula la próxima fecha de recordatorio basada en la cadencia
 */
const calculateNextReminderDate = (cadence: ReminderCadence, reminderTime?: string): Date => {
  const now = new Date();
  const nextDate = new Date(now);
  
  if (cadence === 'semanal') {
    // Próximo recordatorio en 7 días
    nextDate.setDate(now.getDate() + 7);
  } else if (cadence === 'quincenal') {
    // Próximo recordatorio en 15 días
    nextDate.setDate(now.getDate() + 15);
  }
  
  // Establecer la hora del recordatorio si se proporciona
  if (reminderTime) {
    const [hours, minutes] = reminderTime.split(':').map(Number);
    nextDate.setHours(hours, minutes || 0, 0, 0);
  } else {
    nextDate.setHours(9, 0, 0, 0); // Por defecto 9:00 AM
  }
  
  return nextDate;
};

/**
 * User Story 1: Obtiene los recordatorios pendientes que deben enviarse
 */
export const getPendingReminders = async (): Promise<Objective[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const savedObjectives = localStorage.getItem('objectives-data');
  const objectives = savedObjectives ? JSON.parse(savedObjectives) : [];
  
  const now = new Date();
  
  return objectives.filter((obj: Objective) => {
    if (!obj.automaticReminder?.enabled || !obj.automaticReminder.nextReminderDate) {
      return false;
    }
    
    // Solo objetivos activos (no alcanzados ni fallidos)
    if (obj.status === 'achieved' || obj.status === 'failed') {
      return false;
    }
    
    const nextReminderDate = new Date(obj.automaticReminder.nextReminderDate);
    return nextReminderDate <= now;
  });
};

/**
 * User Story 1: Marca un recordatorio como enviado y calcula el siguiente
 */
export const markReminderAsSent = async (objectiveId: string): Promise<Objective> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const savedObjectives = localStorage.getItem('objectives-data');
  const objectives = savedObjectives ? JSON.parse(savedObjectives) : [];
  
  const objective = objectives.find((obj: Objective) => obj.id === objectiveId);
  if (!objective || !objective.automaticReminder) {
    throw new Error('Objective or reminder not found');
  }
  
  // Marcar como enviado
  objective.automaticReminder.lastReminderSent = new Date().toISOString();
  
  // Calcular próxima fecha
  const nextReminderDate = calculateNextReminderDate(
    objective.automaticReminder.cadence,
    objective.automaticReminder.reminderTime
  );
  objective.automaticReminder.nextReminderDate = nextReminderDate.toISOString();
  
  objective.updatedAt = new Date().toISOString();
  
  const index = objectives.findIndex((obj: Objective) => obj.id === objectiveId);
  objectives[index] = objective;
  localStorage.setItem('objectives-data', JSON.stringify(objectives));
  
  return objective;
};

/**
 * User Story 1: Desactiva los recordatorios automáticos de un objetivo
 */
export const disableAutomaticReminder = async (objectiveId: string): Promise<Objective> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const savedObjectives = localStorage.getItem('objectives-data');
  const objectives = savedObjectives ? JSON.parse(savedObjectives) : [];
  
  const objective = objectives.find((obj: Objective) => obj.id === objectiveId);
  if (!objective) throw new Error('Objective not found');
  
  if (objective.automaticReminder) {
    objective.automaticReminder.enabled = false;
    objective.updatedAt = new Date().toISOString();
    
    const index = objectives.findIndex((obj: Objective) => obj.id === objectiveId);
    objectives[index] = objective;
    localStorage.setItem('objectives-data', JSON.stringify(objectives));
  }
  
  return objective;
};

