// API para gestión del Planner de Redes Sociales

export type SocialPlatform = 'instagram' | 'facebook' | 'tiktok' | 'linkedin';
export type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed';
export type ViewMode = 'month' | 'week';

export interface SocialProfile {
  id: string;
  platform: SocialPlatform;
  username: string;
  displayName: string;
  avatarUrl?: string;
  isConnected: boolean;
  followerCount?: number;
}

export interface SocialPost {
  id: string;
  content: string;
  status: PostStatus;
  scheduledAt: string;
  platform: SocialPlatform;
  profileId: string;
  profileName?: string;
  mediaUrls: string[];
  hashtags?: string[];
  createdAt?: string;
  publishedAt?: string;
}

export interface SocialAnalytics {
  summary: {
    totalReach: number;
    totalImpressions: number;
    engagementRate: string;
    followerGrowth: number;
    linkClicks: number;
  };
  topPosts: TopPost[];
}

export interface TopPost {
  id: string;
  content: string;
  engagement: number;
  reach: number;
  platform: SocialPlatform;
  publishedAt: string;
}

export interface PostTemplate {
  id: string;
  name: string;
  description: string;
  category: 'transformation' | 'exercise' | 'nutrition' | 'motivation' | 'tip';
  sampleContent: string;
  icon?: string;
}

// Funciones API simuladas
export const getSocialProfiles = async (): Promise<SocialProfile[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  return [
    {
      id: 'prof_001',
      platform: 'instagram',
      username: '@laurafitness',
      displayName: 'Laura Fitness',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      isConnected: true,
      followerCount: 5420
    },
    {
      id: 'prof_002',
      platform: 'facebook',
      username: 'Laura Fitness Coach',
      displayName: 'Laura Fitness Coach',
      isConnected: true,
      followerCount: 2890
    },
    {
      id: 'prof_003',
      platform: 'tiktok',
      username: '@laurafit',
      displayName: '@laurafit',
      isConnected: true,
      followerCount: 15200
    },
    {
      id: 'prof_004',
      platform: 'linkedin',
      username: 'Laura García',
      displayName: 'Laura García - Personal Trainer',
      isConnected: false
    }
  ];
};

export const getSocialPosts = async (
  startDate: string,
  endDate: string,
  profileIds?: string[]
): Promise<SocialPost[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  const posts: SocialPost[] = [
    {
      id: 'post_001',
      content: '¡Empezamos la semana con energía! ¿Quién se apunta a un reto de 30 días? #fitness #personaltrainer #transformacion',
      status: 'scheduled',
      scheduledAt: '2024-01-28T09:00:00Z',
      platform: 'instagram',
      profileId: 'prof_001',
      profileName: 'Laura Fitness',
      mediaUrls: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b'],
      hashtags: ['fitness', 'personaltrainer', 'transformacion'],
      createdAt: '2024-01-27T10:00:00Z'
    },
    {
      id: 'post_002',
      content: 'Tip de nutrición: ¡No le temas a los carbohidratos! Son tu principal fuente de energía para entrenar.',
      status: 'published',
      scheduledAt: '2024-01-27T12:00:00Z',
      publishedAt: '2024-01-27T12:00:00Z',
      platform: 'facebook',
      profileId: 'prof_002',
      profileName: 'Laura Fitness Coach',
      mediaUrls: ['https://images.unsplash.com/photo-1556910096-6f5e72db6803'],
      hashtags: ['nutricion', 'carbohidratos', 'energia'],
      createdAt: '2024-01-26T15:00:00Z'
    },
    {
      id: 'post_003',
      content: 'Mirar mi último video donde enseño la técnica correcta del peso muerto 💪',
      status: 'scheduled',
      scheduledAt: '2024-01-29T18:00:00Z',
      platform: 'tiktok',
      profileId: 'prof_003',
      profileName: '@laurafit',
      mediaUrls: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48'],
      hashtags: ['pesomuerto', 'tecnicacorrecta', 'fuerza'],
      createdAt: '2024-01-27T14:00:00Z'
    },
    {
      id: 'post_004',
      content: 'Transformación increíble de @JuanPerez en solo 3 meses con constancia y dedicación.',
      status: 'published',
      scheduledAt: '2024-01-25T10:00:00Z',
      publishedAt: '2024-01-25T10:00:00Z',
      platform: 'instagram',
      profileId: 'prof_001',
      profileName: 'Laura Fitness',
      mediaUrls: [
        'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e',
        'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e'
      ],
      hashtags: ['transformacion', 'antesydespues', 'resultados'],
      createdAt: '2024-01-24T16:00:00Z'
    },
    {
      id: 'post_005',
      content: '💪 La disciplina es elegir entre lo que quieres ahora y lo que más quieres.',
      status: 'draft',
      platform: 'instagram',
      profileId: 'prof_001',
      profileName: 'Laura Fitness',
      mediaUrls: [],
      hashtags: ['motivacion', 'disciplina'],
      createdAt: '2024-01-27T08:00:00Z'
    }
  ];

  let filtered = posts;
  if (profileIds && profileIds.length > 0) {
    filtered = filtered.filter(post => profileIds.includes(post.profileId));
  }

  return filtered;
};

export const createSocialPost = async (postData: Omit<SocialPost, 'id' | 'createdAt'>): Promise<SocialPost> => {
  await new Promise(resolve => setTimeout(resolve, 600));

  return {
    id: `post_${Date.now()}`,
    ...postData,
    createdAt: new Date().toISOString()
  };
};

export const updateSocialPost = async (
  postId: string,
  updateData: Partial<SocialPost>
): Promise<SocialPost> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const posts = await getSocialPosts('2024-01-01', '2024-12-31');
  const existing = posts.find(p => p.id === postId);

  if (!existing) {
    throw new Error('Post no encontrado');
  }

  return {
    ...existing,
    ...updateData
  };
};

export const getSocialAnalytics = async (
  startDate: string,
  endDate: string
): Promise<SocialAnalytics> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  return {
    summary: {
      totalReach: 15230,
      totalImpressions: 25400,
      engagementRate: '4.5%',
      followerGrowth: 89,
      linkClicks: 120
    },
    topPosts: [
      {
        id: 'post_004',
        content: 'Transformación increíble de @JuanPerez en solo 3 meses con constancia y dedicación.',
        engagement: 1200,
        reach: 8500,
        platform: 'instagram',
        publishedAt: '2024-01-25T10:00:00Z'
      },
      {
        id: 'post_002',
        content: 'Tip de nutrición: ¡No le temas a los carbohidratos!',
        engagement: 680,
        reach: 3200,
        platform: 'facebook',
        publishedAt: '2024-01-27T12:00:00Z'
      },
      {
        id: 'post_006',
        content: 'Video: Cómo hacer sentadillas perfectas',
        engagement: 540,
        reach: 2100,
        platform: 'tiktok',
        publishedAt: '2024-01-26T15:00:00Z'
      }
    ]
  };
};

export const getPostTemplates = async (): Promise<PostTemplate[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  return [
    {
      id: 'template_001',
      name: 'Transformación del Cliente',
      description: 'Plantilla para mostrar resultados de clientes',
      category: 'transformation',
      sampleContent: '¡Increíble transformación de @NombreCliente! Con dedicación y constancia, hemos logrado [Resultado]. ¡Felicidades! #Transformacion #FitnessMotivation'
    },
    {
      id: 'template_002',
      name: 'Ejercicio de la Semana',
      description: 'Destacar un ejercicio específico',
      category: 'exercise',
      sampleContent: '¿Conoces la técnica correcta para [Ejercicio]? En este video te muestro cómo hacerlo paso a paso 🎥 #Ejercicio #Tecnica #Fitness'
    },
    {
      id: 'template_003',
      name: 'Tip de Nutrición',
      description: 'Consejo rápido de alimentación',
      category: 'nutrition',
      sampleContent: '💡 Tip de nutrición: [Consejo]. La alimentación es clave para alcanzar tus objetivos. #Nutricion #Fitness #Salud'
    },
    {
      id: 'template_004',
      name: 'Frase Motivacional',
      description: 'Inspiración diaria para tu audiencia',
      category: 'motivation',
      sampleContent: '💪 La disciplina es elegir entre lo que quieres ahora y lo que más quieres. #Motivacion #Disciplina #Exito'
    }
  ];
};

export const getPlatformIcon = (platform: SocialPlatform): string => {
  const icons = {
    instagram: '📷',
    facebook: '👥',
    tiktok: '🎵',
    linkedin: '💼'
  };
  return icons[platform];
};

export const getPlatformColor = (platform: SocialPlatform): string => {
  const colors = {
    instagram: 'bg-gradient-to-r from-purple-600 to-pink-600',
    facebook: 'bg-blue-600',
    tiktok: 'bg-black',
    linkedin: 'bg-blue-700'
  };
  return colors[platform];
};

export const getStatusColor = (status: PostStatus): string => {
  const colors = {
    draft: 'text-gray-700 bg-gray-100',
    scheduled: 'text-blue-700 bg-blue-100',
    published: 'text-green-700 bg-green-100',
    failed: 'text-red-700 bg-red-100'
  };
  return colors[status];
};

export const getStatusLabel = (status: PostStatus): string => {
  const labels = {
    draft: 'Borrador',
    scheduled: 'Programado',
    published: 'Publicado',
    failed: 'Error'
  };
  return labels[status];
};

