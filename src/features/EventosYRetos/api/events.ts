// API para gestión de eventos y retos

export type EventType = 'challenge' | 'bootcamp' | 'workshop' | 'retreat' | 'other';
export type EventStatus = 'draft' | 'upcoming' | 'active' | 'completed' | 'cancelled';

export interface Event {
  id: string;
  name: string;
  description: string;
  type: EventType;
  status: EventStatus;
  startDate: string;
  endDate: string;
  trainerId: string;
  fee: number;
  currency?: string;
  maxParticipants?: number;
  participantCount: number;
  imageUrl?: string;
  rules?: string[];
  metrics?: EventMetric[];
  coverImageUrl?: string;
  createdAt: string;
  updatedAt?: string;
  stats?: {
    totalRevenue?: number;
    completionRate?: number;
    averageEngagement?: number;
  };
}

export interface EventMetric {
  id: string;
  name: string;
  type: 'number' | 'percentage' | 'count' | 'boolean';
  isPrimary?: boolean;
  unit?: string;
}

export interface EventParticipant {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  registrationDate: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  progress?: ParticipantProgress;
  currentRank?: number;
}

export interface ParticipantProgress {
  metricId: string;
  metricName: string;
  value: number;
  lastUpdated: string;
  history?: ProgressHistoryPoint[];
}

export interface ProgressHistoryPoint {
  date: string;
  value: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  userAvatar?: string;
  value: number;
  progress: 'up' | 'down' | 'neutral';
  change?: number;
}

export interface Leaderboard {
  metricName: string;
  metricId: string;
  ranking: LeaderboardEntry[];
}

export interface EventsResponse {
  data: Event[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface EventRegistration {
  registrationId: string;
  eventId: string;
  userId: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  registeredAt: string;
}

// Funciones API simuladas (a implementar con backend real)
export const getEvents = async (filters?: {
  status?: EventStatus;
  page?: number;
  limit?: number;
}): Promise<EventsResponse> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const mockEvents: Event[] = [
    {
      id: 'evt_abc123',
      name: 'Reto de 30 días Fit',
      description: 'Un reto intensivo de 30 días para transformar tu cuerpo y mente',
      type: 'challenge',
      status: 'active',
      startDate: '2024-08-01T00:00:00.000Z',
      endDate: '2024-08-31T23:59:59.000Z',
      trainerId: 'trn_xyz789',
      fee: 49.99,
      currency: 'EUR',
      maxParticipants: 100,
      participantCount: 45,
      coverImageUrl: 'https://via.placeholder.com/800x400',
      metrics: [
        { id: 'metric_1', name: 'Entrenamientos Completados', type: 'count', isPrimary: true },
        { id: 'metric_2', name: '% Grasa Corporal Perdido', type: 'percentage', unit: '%' },
        { id: 'metric_3', name: 'Puntos de Consistencia', type: 'number' }
      ],
      createdAt: '2024-07-15T10:00:00.000Z',
      stats: {
        totalRevenue: 2249.55,
        completionRate: 0.75,
        averageEngagement: 4.2
      }
    },
    {
      id: 'evt_def456',
      name: 'Bootcamp de Fin de Semana',
      description: 'Intensivo de entrenamiento funcional durante todo el fin de semana',
      type: 'bootcamp',
      status: 'upcoming',
      startDate: '2024-09-07T09:00:00.000Z',
      endDate: '2024-09-08T18:00:00.000Z',
      trainerId: 'trn_xyz789',
      fee: 149.99,
      currency: 'EUR',
      maxParticipants: 20,
      participantCount: 8,
      coverImageUrl: 'https://via.placeholder.com/800x400',
      metrics: [
        { id: 'metric_4', name: 'Asistencia', type: 'count', isPrimary: true }
      ],
      createdAt: '2024-08-20T14:30:00.000Z'
    },
    {
      id: 'evt_ghi789',
      name: 'Reto Post-Navidad de 21 días',
      description: 'Deshazte de los excesos navideños con este reto de 21 días',
      type: 'challenge',
      status: 'completed',
      startDate: '2024-01-02T00:00:00.000Z',
      endDate: '2024-01-23T23:59:59.000Z',
      trainerId: 'trn_xyz789',
      fee: 79.99,
      currency: 'EUR',
      maxParticipants: 50,
      participantCount: 38,
      coverImageUrl: 'https://via.placeholder.com/800x400',
      metrics: [
        { id: 'metric_5', name: 'Peso Perdido', type: 'number', isPrimary: true, unit: 'kg' },
        { id: 'metric_6', name: 'Entrenamientos Completados', type: 'count' }
      ],
      createdAt: '2023-12-15T09:00:00.000Z',
      stats: {
        totalRevenue: 3039.62,
        completionRate: 0.89,
        averageEngagement: 4.8
      }
    }
  ];
  
  let filtered = [...mockEvents];
  
  if (filters?.status) {
    filtered = filtered.filter(e => e.status === filters.status);
  }
  
  const page = filters?.page || 1;
  const limit = filters?.limit || 10;
  const startIndex = (page - 1) * limit;
  
  return {
    data: filtered.slice(startIndex, startIndex + limit),
    pagination: {
      total: filtered.length,
      page,
      limit
    }
  };
};

export const createEvent = async (
  eventData: Omit<Event, 'id' | 'createdAt' | 'status' | 'participantCount'>
): Promise<Event> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const newEvent: Event = {
    id: `evt_${Date.now()}`,
    ...eventData,
    status: 'draft',
    participantCount: 0,
    createdAt: new Date().toISOString()
  };
  
  return newEvent;
};

export const updateEvent = async (
  eventId: string,
  updates: Partial<Event>
): Promise<Event> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const events = await getEvents();
  const existing = events.data.find(e => e.id === eventId);
  
  if (!existing) {
    throw new Error('Evento no encontrado');
  }
  
  return {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString()
  };
};

export const getEvent = async (eventId: string): Promise<Event | null> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const events = await getEvents();
  return events.data.find(e => e.id === eventId) || null;
};

export const getEventLeaderboard = async (
  eventId: string,
  metricId?: string
): Promise<Leaderboard> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Datos de ejemplo
  return {
    metricName: '% Grasa Corporal Perdido',
    metricId: metricId || 'metric_2',
    ranking: [
      {
        rank: 1,
        userId: 'usr_cde456',
        userName: 'Ana Gómez',
        userAvatar: 'https://via.placeholder.com/100',
        value: -3.5,
        progress: 'down',
        change: -0.2
      },
      {
        rank: 2,
        userId: 'usr_fgh789',
        userName: 'Carlos Ruiz',
        userAvatar: 'https://via.placeholder.com/100',
        value: -3.2,
        progress: 'down',
        change: -0.1
      },
      {
        rank: 3,
        userId: 'usr_ijk012',
        userName: 'María López',
        userAvatar: 'https://via.placeholder.com/100',
        value: -2.8,
        progress: 'down',
        change: -0.15
      }
    ]
  };
};

export const getEventParticipants = async (
  eventId: string
): Promise<EventParticipant[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return [
    {
      id: 'part_1',
      userId: 'usr_cde456',
      userName: 'Ana Gómez',
      userAvatar: 'https://via.placeholder.com/100',
      registrationDate: '2024-07-20T10:00:00.000Z',
      paymentStatus: 'paid',
      currentRank: 1,
      progress: {
        metricId: 'metric_2',
        metricName: '% Grasa Corporal Perdido',
        value: -3.5,
        lastUpdated: '2024-08-15T14:30:00.000Z'
      }
    },
    {
      id: 'part_2',
      userId: 'usr_fgh789',
      userName: 'Carlos Ruiz',
      userAvatar: 'https://via.placeholder.com/100',
      registrationDate: '2024-07-18T15:20:00.000Z',
      paymentStatus: 'paid',
      currentRank: 2,
      progress: {
        metricId: 'metric_2',
        metricName: '% Grasa Corporal Perdido',
        value: -3.2,
        lastUpdated: '2024-08-15T12:00:00.000Z'
      }
    },
    {
      id: 'part_3',
      userId: 'usr_ijk012',
      userName: 'María López',
      userAvatar: 'https://via.placeholder.com/100',
      registrationDate: '2024-07-22T09:15:00.000Z',
      paymentStatus: 'paid',
      currentRank: 3
    }
  ];
};

export const registerForEvent = async (
  eventId: string,
  paymentToken?: string
): Promise<EventRegistration> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return {
    registrationId: `reg_${Date.now()}`,
    eventId,
    userId: 'usr_current',
    status: 'confirmed',
    paymentStatus: paymentToken ? 'paid' : 'pending',
    registeredAt: new Date().toISOString()
  };
};

export const deleteEvent = async (eventId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  console.log('Eliminando evento:', eventId);
};


