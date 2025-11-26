import { Client360, WorkoutHistory, PaymentHistory, BodyMeasurement, ClientNote } from '../types';

// Mock data
const MOCK_CLIENT_360: Client360 = {
  id: 'cli_12345',
  personalInfo: {
    firstName: 'Ana',
    lastName: 'García',
    email: 'ana.garcia@example.com',
    phone: '+34600112233',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
    birthDate: '1990-05-15',
    gender: 'female',
  },
  membership: {
    planName: 'Plan Premium Anual',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
  },
  kpis: {
    ltv: 1250.75,
    attendanceRate30d: 85,
    daysSinceLastVisit: 2,
    outstandingBalance: 0,
    totalSessions: 45,
    adherenceRate: 85,
  },
  recentActivity: [
    {
      id: 'act1',
      date: '2024-10-27T10:00:00Z',
      type: 'check-in',
      description: 'Check-in realizado',
    },
    {
      id: 'act2',
      date: '2024-10-26T18:00:00Z',
      type: 'workout',
      description: 'Entrenamiento completado',
    },
  ],
};

const MOCK_WORKOUTS: WorkoutHistory[] = [
  {
    id: 'wrk1',
    date: '2024-10-27T09:00:00Z',
    duration: 60,
    exercises: [
      {
        exerciseId: 'ex1',
        exerciseName: 'Press de Banca',
        sets: 4,
        reps: 8,
        weight: 50,
      },
      {
        exerciseId: 'ex2',
        exerciseName: 'Sentadillas',
        sets: 4,
        reps: 12,
        weight: 60,
      },
    ],
    notes: 'Excelente sesión. Progresión notable en press de banca.',
  },
  {
    id: 'wrk2',
    date: '2024-10-24T09:00:00Z',
    duration: 45,
    exercises: [
      {
        exerciseId: 'ex3',
        exerciseName: 'Remo con Barra',
        sets: 3,
        reps: 10,
        weight: 40,
      },
    ],
  },
];

const MOCK_PAYMENTS: PaymentHistory[] = [
  {
    id: 'pay1',
    date: '2024-10-01T00:00:00Z',
    amount: 49.99,
    type: 'membership',
    status: 'paid',
    method: 'card',
    invoiceUrl: 'https://example.com/invoice/pay1',
  },
  {
    id: 'pay2',
    date: '2024-09-01T00:00:00Z',
    amount: 49.99,
    type: 'membership',
    status: 'paid',
    method: 'card',
  },
];

const MOCK_MEASUREMENTS: BodyMeasurement[] = [
  {
    id: 'msr1',
    date: '2024-10-27T09:00:00Z',
    weightKg: 65.0,
    bodyFatPercentage: 22.0,
    muscleMassKg: 48.0,
    chest: 95,
    waist: 72,
    hips: 98,
  },
  {
    id: 'msr2',
    date: '2024-09-27T09:00:00Z',
    weightKg: 66.2,
    bodyFatPercentage: 23.5,
    muscleMassKg: 47.0,
    chest: 94,
    waist: 75,
    hips: 100,
  },
];

const MOCK_NOTES: ClientNote[] = [
  {
    id: 'note1',
    content: 'Cliente mencionó dolor en el hombro izquierdo durante el press de banca. Sugerir evaluación médica.',
    authorId: 'user_67890',
    authorName: 'Carlos Martínez',
    createdAt: '2024-10-27T10:00:00Z',
    tags: ['lesión', 'importante'],
    isPrivate: true,
  },
  {
    id: 'note2',
    content: 'Muy motivada con el progreso. Objetivo: perder 5kg antes de diciembre.',
    authorId: 'user_67890',
    authorName: 'Carlos Martínez',
    createdAt: '2024-10-20T15:00:00Z',
    isPrivate: true,
  },
];

export const getClient360 = async (clientId: string): Promise<Client360 | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (clientId === 'cli_12345') {
    return MOCK_CLIENT_360;
  }
  
  return null;
};

export const getWorkoutHistory = async (
  clientId: string,
  startDate?: string,
  endDate?: string
): Promise<WorkoutHistory[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  if (clientId === 'cli_12345') {
    return MOCK_WORKOUTS;
  }
  
  return [];
};

export const getPaymentHistory = async (clientId: string): Promise<PaymentHistory[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  if (clientId === 'cli_12345') {
    return MOCK_PAYMENTS;
  }
  
  return [];
};

export const getBodyMeasurements = async (
  clientId: string,
  startDate?: string,
  endDate?: string
): Promise<BodyMeasurement[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  if (clientId === 'cli_12345') {
    return MOCK_MEASUREMENTS;
  }
  
  return [];
};

export const getClientNotes = async (clientId: string): Promise<ClientNote[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  if (clientId === 'cli_12345') {
    return MOCK_NOTES;
  }
  
  return [];
};

export const createClientNote = async (
  clientId: string,
  content: string,
  authorId: string,
  authorName: string
): Promise<ClientNote> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newNote: ClientNote = {
    id: `note_${Date.now()}`,
    content,
    authorId,
    authorName,
    createdAt: new Date().toISOString(),
    isPrivate: true,
  };
  
  MOCK_NOTES.unshift(newNote);
  return newNote;
};

export const updatePersonalInfo = async (
  clientId: string,
  updates: Partial<{ firstName: string; lastName: string; email: string; phone: string }>
): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  // En producción haría la llamada a la API
  console.log(`Actualizando información personal para cliente ${clientId}`, updates);
};

