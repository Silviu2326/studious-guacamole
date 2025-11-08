import { Lead, LeadInteraction, InteractionType } from '../types';
import { updateLead } from '../api/leads';

export interface Appointment {
  id: string;
  leadId: string;
  leadName: string;
  leadEmail?: string;
  leadPhone?: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  type: 'consulta' | 'reunion' | 'visita' | 'llamada' | 'otro';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  reminderSent: boolean;
  reminder24hSent: boolean;
  externalCalendarId?: string; // ID en Google Calendar u otro
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface TimeSlot {
  start: Date;
  end: Date;
  available: boolean;
}

export interface Availability {
  date: Date;
  slots: TimeSlot[];
}

// Exportar tipos para uso externo
export type { Appointment, Availability, TimeSlot };

// Mock data storage
let mockAppointments: Appointment[] = [];
let mockAvailability: Map<string, Availability[]> = new Map();

// Horarios de trabajo por defecto
const defaultWorkingHours = {
  start: 9, // 9:00 AM
  end: 20, // 8:00 PM
  slotDuration: 60, // 60 minutos
  breakStart: 14, // 2:00 PM
  breakEnd: 15 // 3:00 PM
};

// Inicializar datos de ejemplo
const initializeMockData = () => {
  if (mockAppointments.length > 0) return;

  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const dayAfter = new Date(now.getTime() + 48 * 60 * 60 * 1000);

  mockAppointments = [
    {
      id: 'apt1',
      leadId: '1',
      leadName: 'María González',
      leadEmail: 'maria.gonzalez@example.com',
      leadPhone: '+34612345678',
      title: 'Consulta Inicial - María González',
      description: 'Primera consulta para evaluar objetivos y crear plan personalizado',
      startTime: tomorrow,
      endTime: new Date(tomorrow.getTime() + 60 * 60 * 1000),
      type: 'consulta',
      status: 'confirmed',
      reminderSent: true,
      reminder24hSent: false,
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: now,
      createdBy: '1'
    },
    {
      id: 'apt2',
      leadId: '4',
      leadName: 'David Torres',
      leadEmail: 'david.torres@example.com',
      leadPhone: '+34645678901',
      title: 'Reunión de Cierre - David Torres',
      description: 'Reunión para cerrar acuerdo y firmar contrato',
      startTime: dayAfter,
      endTime: new Date(dayAfter.getTime() + 30 * 60 * 1000),
      type: 'reunion',
      status: 'scheduled',
      reminderSent: false,
      reminder24hSent: false,
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: now,
      createdBy: '1'
    }
  ];
};

// Generar slots disponibles para una fecha
const generateAvailableSlots = (date: Date, existingAppointments: Appointment[]): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const startHour = defaultWorkingHours.start;
  const endHour = defaultWorkingHours.end;
  const slotDuration = defaultWorkingHours.slotDuration;
  const breakStart = defaultWorkingHours.breakStart;
  const breakEnd = defaultWorkingHours.breakEnd;

  const dateStr = date.toISOString().split('T')[0];
  const appointmentsForDate = existingAppointments.filter(apt => {
    const aptDate = apt.startTime.toISOString().split('T')[0];
    return aptDate === dateStr && apt.status !== 'cancelled';
  });

  for (let hour = startHour; hour < endHour; hour += slotDuration / 60) {
    // Saltar hora de descanso
    if (hour >= breakStart && hour < breakEnd) continue;

    const slotStart = new Date(date);
    slotStart.setHours(hour, 0, 0, 0);
    const slotEnd = new Date(slotStart.getTime() + slotDuration * 60 * 1000);

    // Verificar si el slot está ocupado
    const isOccupied = appointmentsForDate.some(apt => {
      const aptStart = new Date(apt.startTime);
      const aptEnd = new Date(apt.endTime);
      return (slotStart < aptEnd && slotEnd > aptStart);
    });

    slots.push({
      start: slotStart,
      end: slotEnd,
      available: !isOccupied
    });
  }

  return slots;
};

export class CalendarService {
  // Obtener todas las citas
  static async getAppointments(
    userId?: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<Appointment[]> {
    initializeMockData();
    let appointments = [...mockAppointments];

    if (userId) {
      appointments = appointments.filter(apt => apt.createdBy === userId);
    }

    if (startDate) {
      appointments = appointments.filter(apt => apt.startTime >= startDate);
    }

    if (endDate) {
      appointments = appointments.filter(apt => apt.startTime <= endDate);
    }

    return appointments.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  }

  // Obtener una cita por ID
  static async getAppointment(id: string): Promise<Appointment | null> {
    initializeMockData();
    return mockAppointments.find(apt => apt.id === id) || null;
  }

  // Obtener citas de un lead
  static async getLeadAppointments(leadId: string): Promise<Appointment[]> {
    initializeMockData();
    return mockAppointments
      .filter(apt => apt.leadId === leadId)
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  }

  // Crear nueva cita
  static async createAppointment(
    appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'reminderSent' | 'reminder24hSent'>
  ): Promise<Appointment> {
    initializeMockData();

    // Verificar disponibilidad
    const conflicting = mockAppointments.find(apt => {
      if (apt.status === 'cancelled') return false;
      return (
        appointment.startTime < apt.endTime &&
        appointment.endTime > apt.startTime
      );
    });

    if (conflicting) {
      throw new Error('El horario seleccionado no está disponible');
    }

    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString(),
      reminderSent: false,
      reminder24hSent: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockAppointments.push(newAppointment);

    // Registrar interacción en el lead
    const interaction: LeadInteraction = {
      id: `apt-${newAppointment.id}`,
      type: 'meeting_scheduled' as InteractionType,
      channel: 'in_person',
      date: new Date(),
      description: `Cita agendada: ${newAppointment.title} - ${newAppointment.startTime.toLocaleString()}`,
      outcome: 'positive',
      userId: appointment.createdBy,
      metadata: {
        appointmentId: newAppointment.id
      }
    };

    const lead = await import('../api/leads').then(m => m.getLead(appointment.leadId));
    if (lead) {
      await updateLead(appointment.leadId, {
        interactions: [...(lead.interactions || []), interaction],
        nextFollowUpDate: newAppointment.startTime,
        status: lead.status === 'new' ? 'meeting_scheduled' : lead.status
      });
    }

    // Enviar confirmación (simulado)
    await this.sendConfirmation(newAppointment);

    return newAppointment;
  }

  // Actualizar cita
  static async updateAppointment(
    id: string,
    updates: Partial<Appointment>
  ): Promise<Appointment> {
    initializeMockData();
    const index = mockAppointments.findIndex(apt => apt.id === id);

    if (index === -1) {
      throw new Error('Appointment not found');
    }

    mockAppointments[index] = {
      ...mockAppointments[index],
      ...updates,
      updatedAt: new Date()
    };

    return mockAppointments[index];
  }

  // Cancelar cita
  static async cancelAppointment(id: string, reason?: string): Promise<Appointment> {
    return this.updateAppointment(id, {
      status: 'cancelled'
    });
  }

  // Obtener disponibilidad para una fecha
  static async getAvailability(date: Date): Promise<TimeSlot[]> {
    initializeMockData();
    const dateStr = date.toISOString().split('T')[0];

    if (!mockAvailability.has(dateStr)) {
      const slots = generateAvailableSlots(date, mockAppointments);
      mockAvailability.set(dateStr, [{ date, slots }]);
    }

    const availability = mockAvailability.get(dateStr);
    return availability?.slots || [];
  }

  // Obtener disponibilidad para un rango de fechas
  static async getAvailabilityRange(startDate: Date, endDate: Date): Promise<Availability[]> {
    const availability: Availability[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const slots = await this.getAvailability(new Date(currentDate));
      availability.push({
        date: new Date(currentDate),
        slots
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return availability;
  }

  // Enviar confirmación de cita
  static async sendConfirmation(appointment: Appointment): Promise<void> {
    // En producción, esto enviaría email/WhatsApp
    console.log(`[CalendarService] Enviando confirmación de cita a ${appointment.leadEmail || appointment.leadPhone}`);
    
    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 100));

    // Marcar como enviado
    await this.updateAppointment(appointment.id, { reminderSent: true });
  }

  // Enviar recordatorio 24h antes
  static async sendReminder24h(appointment: Appointment): Promise<void> {
    if (appointment.reminder24hSent) return;

    const hoursUntil = (appointment.startTime.getTime() - Date.now()) / (1000 * 60 * 60);
    
    if (hoursUntil <= 24 && hoursUntil > 23) {
      // En producción, esto enviaría email/WhatsApp
      console.log(`[CalendarService] Enviando recordatorio 24h antes a ${appointment.leadEmail || appointment.leadPhone}`);
      
      await this.updateAppointment(appointment.id, { reminder24hSent: true });
    }
  }

  // Sincronizar con Google Calendar (simulado)
  static async syncWithGoogleCalendar(appointment: Appointment): Promise<string> {
    // En producción, esto usaría la API de Google Calendar
    console.log(`[CalendarService] Sincronizando cita con Google Calendar: ${appointment.title}`);
    
    const externalId = `google-${appointment.id}`;
    await this.updateAppointment(appointment.id, { externalCalendarId: externalId });
    
    return externalId;
  }

  // Verificar y enviar recordatorios pendientes
  static async checkAndSendReminders(): Promise<number> {
    initializeMockData();
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const upcomingAppointments = mockAppointments.filter(apt => {
      return (
        apt.status !== 'cancelled' &&
        apt.status !== 'completed' &&
        apt.startTime >= now &&
        apt.startTime <= tomorrow &&
        !apt.reminder24hSent
      );
    });

    for (const appointment of upcomingAppointments) {
      await this.sendReminder24h(appointment);
    }

    return upcomingAppointments.length;
  }

  // Sincronizar con calendario externo
  static async syncWithExternalCalendar(appointmentId: string, provider: 'google' | 'outlook' | 'apple'): Promise<string> {
    const appointment = await this.getAppointment(appointmentId);
    if (!appointment) {
      throw new Error('Appointment not found');
    }

    if (provider === 'google') {
      return this.syncWithGoogleCalendar(appointment);
    }

    // Para otros proveedores, simular sincronización
    const externalId = `${provider}-${appointment.id}`;
    await this.updateAppointment(appointment.id, { externalCalendarId: externalId });
    return externalId;
  }
}

