// API para programación recurrente de posts

import { SocialPlatform, SocialPost } from './social';

export type RecurrencePattern = 'daily' | 'weekly' | 'monthly' | 'custom';

export interface RecurringPost {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  pattern: RecurrencePattern;
  schedule: {
    daysOfWeek?: number[]; // 0-6, domingo a sábado
    dayOfMonth?: number;
    time: string; // HH:mm format
    timezone: string;
  };
  content: {
    text: string;
    mediaUrls: string[];
    hashtags: string[];
  };
  platforms: SocialPlatform[];
  startDate: string;
  endDate?: string;
  exceptions: string[]; // Fechas a saltar (ISO format)
  nextOccurrence?: string;
  occurrencesGenerated: number;
  createdAt: string;
  updatedAt: string;
}

export interface RecurringPostSeries {
  id: string;
  recurringPostId: string;
  postId: string;
  scheduledAt: string;
  status: 'scheduled' | 'published' | 'skipped';
  createdAt: string;
}

export const getRecurringPosts = async (): Promise<RecurringPost[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    {
      id: 'rec_001',
      name: 'Tip Diario de Nutrición',
      description: 'Publica un tip de nutrición todos los días a las 9am',
      enabled: true,
      pattern: 'daily',
      schedule: {
        time: '09:00',
        timezone: 'Europe/Madrid'
      },
      content: {
        text: '💡 Tip del día: {tip}\n\nRecuerda que la nutrición es clave para alcanzar tus objetivos. #TipNutricion #Fitness',
        mediaUrls: [],
        hashtags: ['tipnutricion', 'fitness', 'nutricion']
      },
      platforms: ['instagram', 'facebook'],
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      exceptions: [],
      nextOccurrence: '2024-01-28T09:00:00Z',
      occurrencesGenerated: 27,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-27T00:00:00Z'
    },
    {
      id: 'rec_002',
      name: 'Motivación Lunes y Miércoles',
      description: 'Post motivacional cada lunes y miércoles',
      enabled: true,
      pattern: 'weekly',
      schedule: {
        daysOfWeek: [1, 3], // Lunes y Miércoles
        time: '08:00',
        timezone: 'Europe/Madrid'
      },
      content: {
        text: '💪 ¡Empezamos la semana con energía!\n\n{frase_motivacional}\n\n#Motivacion #Fitness #LunesMotivador',
        mediaUrls: [],
        hashtags: ['motivacion', 'fitness', 'lunesmotivador']
      },
      platforms: ['instagram'],
      startDate: '2024-01-01',
      exceptions: [],
      nextOccurrence: '2024-01-29T08:00:00Z',
      occurrencesGenerated: 8,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-27T00:00:00Z'
    },
    {
      id: 'rec_003',
      name: 'Transformación del Mes',
      description: 'Publica una transformación destacada el primer día de cada mes',
      enabled: true,
      pattern: 'monthly',
      schedule: {
        dayOfMonth: 1,
        time: '10:00',
        timezone: 'Europe/Madrid'
      },
      content: {
        text: '🏆 Transformación del mes de {mes}\n\n{transformacion}\n\n#Transformacion #FitnessMotivation',
        mediaUrls: [],
        hashtags: ['transformacion', 'fitnessmotivation', 'resultados']
      },
      platforms: ['instagram', 'facebook'],
      startDate: '2024-01-01',
      exceptions: [],
      nextOccurrence: '2024-02-01T10:00:00Z',
      occurrencesGenerated: 1,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-27T00:00:00Z'
    }
  ];
};

export const createRecurringPost = async (
  recurringPost: Omit<RecurringPost, 'id' | 'createdAt' | 'updatedAt' | 'occurrencesGenerated' | 'nextOccurrence'>
): Promise<RecurringPost> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Calcular próxima ocurrencia
  const nextOccurrence = calculateNextOccurrence(recurringPost);
  
  return {
    id: `rec_${Date.now()}`,
    ...recurringPost,
    nextOccurrence,
    occurrencesGenerated: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const updateRecurringPost = async (
  id: string,
  updates: Partial<RecurringPost>
): Promise<RecurringPost> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const recurringPosts = await getRecurringPosts();
  const existing = recurringPosts.find(rp => rp.id === id);
  
  if (!existing) {
    throw new Error('Post recurrente no encontrado');
  }
  
  const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
  
  // Recalcular próxima ocurrencia si cambió el schedule
  if (updates.schedule || updates.pattern) {
    updated.nextOccurrence = calculateNextOccurrence(updated);
  }
  
  return updated;
};

export const deleteRecurringPost = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  // En producción, eliminar de la base de datos
};

export const generateOccurrences = async (
  recurringPostId: string,
  startDate: string,
  endDate: string
): Promise<SocialPost[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const recurringPosts = await getRecurringPosts();
  const recurringPost = recurringPosts.find(rp => rp.id === recurringPostId);
  
  if (!recurringPost) {
    throw new Error('Post recurrente no encontrado');
  }
  
  const occurrences: SocialPost[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const current = new Date(start);
  
  while (current <= end) {
    // Verificar si la fecha está en excepciones
    const dateStr = current.toISOString().split('T')[0];
    if (recurringPost.exceptions.includes(dateStr)) {
      current.setDate(current.getDate() + 1);
      continue;
    }
    
    // Verificar si coincide con el patrón
    if (matchesPattern(current, recurringPost)) {
      const scheduledAt = new Date(`${dateStr}T${recurringPost.schedule.time}:00`);
      
      // Crear post para cada plataforma
      recurringPost.platforms.forEach((platform, idx) => {
        occurrences.push({
          id: `post_rec_${recurringPostId}_${dateStr}_${platform}_${idx}`,
          content: recurringPost.content.text,
          status: 'scheduled',
          scheduledAt: scheduledAt.toISOString(),
          platform,
          profileId: `prof_${platform}`,
          mediaUrls: recurringPost.content.mediaUrls,
          hashtags: recurringPost.content.hashtags,
          createdAt: new Date().toISOString()
        });
      });
    }
    
    current.setDate(current.getDate() + 1);
  }
  
  return occurrences;
};

function calculateNextOccurrence(recurringPost: RecurringPost): string {
  const now = new Date();
  const start = new Date(recurringPost.startDate);
  let current = new Date(Math.max(now.getTime(), start.getTime()));
  
  // Buscar próxima ocurrencia válida
  for (let i = 0; i < 365; i++) {
    if (current > new Date(recurringPost.endDate || '2099-12-31')) {
      break;
    }
    
    const dateStr = current.toISOString().split('T')[0];
    if (!recurringPost.exceptions.includes(dateStr) && matchesPattern(current, recurringPost)) {
      return `${dateStr}T${recurringPost.schedule.time}:00`;
    }
    
    current.setDate(current.getDate() + 1);
  }
  
  return '';
}

function matchesPattern(date: Date, recurringPost: RecurringPost): boolean {
  const dayOfWeek = date.getDay();
  const dayOfMonth = date.getDate();
  
  switch (recurringPost.pattern) {
    case 'daily':
      return true;
    case 'weekly':
      return recurringPost.schedule.daysOfWeek?.includes(dayOfWeek) ?? false;
    case 'monthly':
      return recurringPost.schedule.dayOfMonth === dayOfMonth;
    case 'custom':
      return recurringPost.schedule.daysOfWeek?.includes(dayOfWeek) ?? false;
    default:
      return false;
  }
}

export const getRecurringPostSeries = async (recurringPostId: string): Promise<RecurringPostSeries[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    {
      id: 'series_001',
      recurringPostId,
      postId: 'post_001',
      scheduledAt: '2024-01-28T09:00:00Z',
      status: 'scheduled',
      createdAt: '2024-01-27T00:00:00Z'
    },
    {
      id: 'series_002',
      recurringPostId,
      postId: 'post_002',
      scheduledAt: '2024-01-29T09:00:00Z',
      status: 'scheduled',
      createdAt: '2024-01-27T00:00:00Z'
    }
  ];
};

