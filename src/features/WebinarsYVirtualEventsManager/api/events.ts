// API para gestión de webinars y eventos virtuales

export interface VirtualEvent {
  id: string;
  title: string;
  description?: string;
  type: 'webinar' | 'masterclass' | 'challenge' | 'qa' | 'community';
  access: 'free' | 'paid';
  price?: number;
  currency?: string;
  startTime_utc: string;
  endTime_utc?: string;
  duration?: number; // en minutos
  status: 'draft' | 'published' | 'live' | 'completed' | 'cancelled';
  trainerId: string;
  registrations_count: number;
  live_attendees_count?: number;
  recordingUrl?: string;
  registrationPageUrl?: string;
  liveRoomUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  status: 'registered' | 'attended' | 'cancelled';
  attendedLive?: boolean;
  watchedRecording?: boolean;
  registrationDate: string;
  attendedAt?: string;
  notes?: string;
}

export interface EventAnalytics {
  eventId: string;
  totalRegistrations: number;
  liveAttendees: number;
  attendanceRate: number; // porcentaje
  newLeads: number;
  recordingViews: number;
  revenue: number;
  conversionRate?: number;
  averageEngagement?: number;
  registrationPageVisits?: number;
  registrationConversionRate?: number;
}

export interface EventAutomation {
  id: string;
  eventId: string;
  type: 'confirmation' | 'reminder_24h' | 'reminder_1h' | 'follow_up' | 'recording_available';
  enabled: boolean;
  template?: {
    email?: string;
    sms?: string;
  };
  scheduledAt?: string;
  sentAt?: string;
}

export interface EventRecording {
  id: string;
  eventId: string;
  url: string;
  duration: number;
  thumbnailUrl?: string;
  processedAt: string;
  viewCount: number;
  accessLevel: 'public' | 'registered_only' | 'paid_only';
}

export interface RegistrationPage {
  eventId: string;
  title: string;
  description: string;
  imageUrl?: string;
  customFields?: RegistrationField[];
  branding?: {
    primaryColor?: string;
    logoUrl?: string;
  };
  publicUrl: string;
}

export interface RegistrationField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'select' | 'checkbox';
  required: boolean;
  options?: string[];
}

export interface CreateEventPayload {
  title: string;
  description?: string;
  type: 'webinar' | 'masterclass' | 'challenge' | 'qa' | 'community';
  access: 'free' | 'paid';
  price?: number;
  startTime_utc: string;
  duration?: number;
}

export interface UpdateEventPayload {
  title?: string;
  description?: string;
  startTime_utc?: string;
  duration?: number;
  status?: string;
  price?: number;
}

// Funciones API simuladas (a implementar con backend real)
export const createEvent = async (payload: CreateEventPayload): Promise<VirtualEvent> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // En producción: POST /api/events
  return {
    id: `evt_${Date.now()}`,
    title: payload.title,
    description: payload.description,
    type: payload.type,
    access: payload.access,
    price: payload.price,
    startTime_utc: payload.startTime_utc,
    duration: payload.duration,
    status: 'draft',
    trainerId: 'trainer-123',
    registrations_count: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const getEvents = async (
  status?: 'upcoming' | 'past' | 'drafts',
  page?: number,
  limit?: number
): Promise<{ data: VirtualEvent[]; pagination: { total: number; page: number; limit: number } }> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // En producción: GET /api/events?status={status}&page={page}&limit={limit}
  return {
    data: [],
    pagination: {
      total: 0,
      page: page || 1,
      limit: limit || 10
    }
  };
};

export const getEvent = async (eventId: string): Promise<VirtualEvent | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: GET /api/events/{eventId}
  return null;
};

export const updateEvent = async (
  eventId: string,
  updates: UpdateEventPayload
): Promise<VirtualEvent> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // En producción: PUT /api/events/{eventId}
  return {
    id: eventId,
    title: updates.title || 'Evento',
    type: 'webinar',
    access: 'free',
    startTime_utc: updates.startTime_utc || new Date().toISOString(),
    status: updates.status || 'draft',
    trainerId: 'trainer-123',
    registrations_count: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const deleteEvent = async (eventId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: DELETE /api/events/{eventId}
  console.log('Eliminando evento:', eventId);
};

export const publishEvent = async (eventId: string): Promise<VirtualEvent> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // En producción: POST /api/events/{eventId}/publish
  return {
    id: eventId,
    title: 'Evento',
    type: 'webinar',
    access: 'free',
    startTime_utc: new Date().toISOString(),
    status: 'published',
    trainerId: 'trainer-123',
    registrations_count: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const cancelEvent = async (eventId: string): Promise<VirtualEvent> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // En producción: POST /api/events/{eventId}/cancel
  return {
    id: eventId,
    title: 'Evento',
    type: 'webinar',
    access: 'free',
    startTime_utc: new Date().toISOString(),
    status: 'cancelled',
    trainerId: 'trainer-123',
    registrations_count: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const startEvent = async (eventId: string): Promise<{ liveRoomUrl: string }> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // En producción: POST /api/events/{eventId}/start
  return {
    liveRoomUrl: `https://events.trainererp.com/room/${eventId}`
  };
};

export const endEvent = async (eventId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: POST /api/events/{eventId}/end
  console.log('Finalizando evento:', eventId);
};

export const getEventAnalytics = async (eventId: string): Promise<EventAnalytics | null> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // En producción: GET /api/events/{eventId}/analytics
  return null;
};

export const getEventRegistrations = async (
  eventId: string
): Promise<EventRegistration[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: GET /api/events/{eventId}/registrations
  return [];
};

export const registerForEvent = async (
  eventId: string,
  registrationData: {
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    customFields?: Record<string, any>;
  }
): Promise<EventRegistration> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // En producción: POST /api/events/{eventId}/register
  return {
    id: `reg_${Date.now()}`,
    eventId,
    email: registrationData.email,
    firstName: registrationData.firstName,
    lastName: registrationData.lastName,
    phone: registrationData.phone,
    status: 'registered',
    registrationDate: new Date().toISOString()
  };
};

export const getEventRecording = async (eventId: string): Promise<EventRecording | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: GET /api/events/{eventId}/recording
  return null;
};

export const getEventAutomations = async (eventId: string): Promise<EventAutomation[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: GET /api/events/{eventId}/automations
  return [];
};

export const updateEventAutomations = async (
  eventId: string,
  automations: Partial<EventAutomation>[]
): Promise<EventAutomation[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // En producción: PUT /api/events/{eventId}/automations
  return [];
};

export const getRegistrationPage = async (eventId: string): Promise<RegistrationPage | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: GET /api/events/{eventId}/registration-page
  return null;
};

export const updateRegistrationPage = async (
  eventId: string,
  page: Partial<RegistrationPage>
): Promise<RegistrationPage> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // En producción: PUT /api/events/{eventId}/registration-page
  return {
    eventId,
    title: page.title || 'Evento',
    description: page.description || '',
    publicUrl: `https://events.trainererp.com/register/${eventId}`
  };
};






















