// API para automatizaciones del Planner de Redes Sociales

import { SocialPlatform, BestTimeToPost, SocialPost } from './social';

export interface AutoPublishRule {
  id: string;
  name: string;
  enabled: boolean;
  platforms: SocialPlatform[];
  schedule: {
    type: 'best_time' | 'custom' | 'recurring';
    daysOfWeek?: number[]; // 0-6, domingo a sábado
    timeSlots?: string[]; // HH:mm format
    useBestTimes?: boolean;
  };
  conditions?: {
    minPostsPerDay?: number;
    maxPostsPerDay?: number;
    avoidConsecutiveHours?: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PublishQueue {
  id: string;
  postId: string;
  scheduledAt: string;
  platform: SocialPlatform;
  status: 'pending' | 'processing' | 'published' | 'failed';
  attempts: number;
  lastAttempt?: string;
  error?: string;
  priority: number;
}

export interface AutoPublishSettings {
  enabled: boolean;
  rules: AutoPublishRule[];
  queue: PublishQueue[];
  notifications: {
    onSuccess: boolean;
    onFailure: boolean;
    email?: string;
  };
}

export const getAutoPublishSettings = async (): Promise<AutoPublishSettings> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    enabled: true,
    rules: [
      {
        id: 'rule_001',
        name: 'Publicación Automática - Mejores Horarios',
        enabled: true,
        platforms: ['instagram', 'facebook'],
        schedule: {
          type: 'best_time',
          useBestTimes: true
        },
        conditions: {
          minPostsPerDay: 1,
          maxPostsPerDay: 3,
          avoidConsecutiveHours: true
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-27T00:00:00Z'
      },
      {
        id: 'rule_002',
        name: 'Publicación Mañanera',
        enabled: true,
        platforms: ['instagram'],
        schedule: {
          type: 'custom',
          daysOfWeek: [1, 2, 3, 4, 5], // Lunes a Viernes
          timeSlots: ['08:00', '09:00']
        },
        conditions: {
          maxPostsPerDay: 1
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-27T00:00:00Z'
      }
    ],
    queue: [],
    notifications: {
      onSuccess: true,
      onFailure: true,
      email: 'laura@fitness.com'
    }
  };
};

export const createAutoPublishRule = async (rule: Omit<AutoPublishRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<AutoPublishRule> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return {
    id: `rule_${Date.now()}`,
    ...rule,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const updateAutoPublishRule = async (ruleId: string, updates: Partial<AutoPublishRule>): Promise<AutoPublishRule> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const settings = await getAutoPublishSettings();
  const rule = settings.rules.find(r => r.id === ruleId);
  
  if (!rule) {
    throw new Error('Regla no encontrada');
  }
  
  return {
    ...rule,
    ...updates,
    updatedAt: new Date().toISOString()
  };
};

export const getPublishQueue = async (): Promise<PublishQueue[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    {
      id: 'queue_001',
      postId: 'post_001',
      scheduledAt: '2024-01-28T09:00:00Z',
      platform: 'instagram',
      status: 'pending',
      attempts: 0,
      priority: 1
    },
    {
      id: 'queue_002',
      postId: 'post_003',
      scheduledAt: '2024-01-29T18:00:00Z',
      platform: 'tiktok',
      status: 'pending',
      attempts: 0,
      priority: 2
    }
  ];
};

export const optimizePublishQueue = async (posts: SocialPost[], bestTimes: BestTimeToPost[]): Promise<PublishQueue[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simular optimización de cola basada en mejores horarios
  const queue: PublishQueue[] = posts
    .filter(post => post.status === 'scheduled')
    .map((post, index) => {
      const bestTime = bestTimes.find(bt => bt.platform === post.platform);
      const scheduledDate = bestTime 
        ? new Date(`${new Date().toISOString().split('T')[0]}T${bestTime.hour}:00:00`)
        : new Date(post.scheduledAt);
      
      return {
        id: `queue_${post.id}`,
        postId: post.id,
        scheduledAt: scheduledDate.toISOString(),
        platform: post.platform,
        status: 'pending' as const,
        attempts: 0,
        priority: index + 1
      };
    })
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
  
  return queue;
};

export const processPublishQueue = async (queueId: string): Promise<{ success: boolean; error?: string }> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simular publicación (90% éxito)
  const success = Math.random() > 0.1;
  
  if (!success) {
    return {
      success: false,
      error: 'Error al conectar con la plataforma'
    };
  }
  
  return { success: true };
};

export const retryFailedPublish = async (queueId: string): Promise<{ success: boolean; error?: string }> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const success = Math.random() > 0.2; // 80% éxito en reintento
  
  if (!success) {
    return {
      success: false,
      error: 'Error persistente al publicar'
    };
  }
  
  return { success: true };
};

