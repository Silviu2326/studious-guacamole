import { CalendarService, Appointment, Availability, TimeSlot } from '../services/calendarService';

// Re-exportar tipos
export type { Appointment, Availability, TimeSlot };

export const getAppointments = async (filters?: {
  leadId?: string;
  startDate?: Date;
  endDate?: Date;
  status?: Appointment['status'];
}): Promise<Appointment[]> => {
  return CalendarService.getAppointments(filters);
};

export const getAppointment = async (id: string): Promise<Appointment | null> => {
  return CalendarService.getAppointment(id);
};

export const getLeadAppointments = async (leadId: string): Promise<Appointment[]> => {
  return CalendarService.getLeadAppointments(leadId);
};

export const createAppointment = async (
  appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'reminderSent' | 'reminder24hSent'>
): Promise<Appointment> => {
  return CalendarService.createAppointment(appointment);
};

export const updateAppointment = async (id: string, updates: Partial<Appointment>): Promise<Appointment> => {
  return CalendarService.updateAppointment(id, updates);
};

export const cancelAppointment = async (id: string, reason?: string): Promise<Appointment> => {
  return CalendarService.cancelAppointment(id, reason);
};

export const getAvailability = async (date: Date): Promise<TimeSlot[]> => {
  return CalendarService.getAvailability(date);
};

export const getAvailabilityRange = async (startDate: Date, endDate: Date): Promise<Availability[]> => {
  return CalendarService.getAvailabilityRange(startDate, endDate);
};

export const sendConfirmation = async (appointment: Appointment): Promise<void> => {
  return CalendarService.sendConfirmation(appointment);
};

export const syncWithExternalCalendar = async (appointmentId: string, provider: 'google' | 'outlook' | 'apple'): Promise<string> => {
  return CalendarService.syncWithExternalCalendar(appointmentId, provider);
};

