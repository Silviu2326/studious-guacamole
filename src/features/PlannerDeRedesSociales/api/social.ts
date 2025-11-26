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

// Nuevas interfaces para funcionalidades avanzadas
export interface Campaign {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'draft';
  posts: string[]; // IDs de posts
  goals: {
    reach?: number;
    engagement?: number;
    conversions?: number;
  };
  currentMetrics: {
    reach: number;
    engagement: number;
    conversions: number;
  };
}

export interface ContentLibraryItem {
  id: string;
  title: string;
  content: string;
  category: 'transformation' | 'exercise' | 'nutrition' | 'motivation' | 'tip' | 'recipe' | 'workout';
  mediaUrls: string[];
  hashtags: string[];
  performance?: {
    avgEngagement: number;
    avgReach: number;
    timesUsed: number;
  };
  createdAt: string;
  lastUsed?: string;
}

export interface AudienceInsight {
  demographics: {
    ageGroups: { range: string; percentage: number }[];
    gender: { type: string; percentage: number }[];
    locations: { city: string; percentage: number }[];
  };
  behavior: {
    activeHours: { hour: number; engagement: number }[];
    preferredContent: { category: string; engagement: number }[];
    bestDays: { day: string; engagement: number }[];
  };
  growth: {
    newFollowers: number;
    unfollowers: number;
    netGrowth: number;
    growthRate: string;
  };
}

export interface BestTimeToPost {
  platform: SocialPlatform;
  dayOfWeek: string;
  hour: number;
  engagementScore: number;
  recommendation: string;
}

export interface HashtagAnalysis {
  hashtag: string;
  usageCount: number;
  avgEngagement: number;
  reach: number;
  trend: 'up' | 'down' | 'stable';
  recommendation: 'use' | 'avoid' | 'test';
}

export interface ContentSuggestion {
  id: string;
  type: 'post' | 'story' | 'reel' | 'video';
  title: string;
  description: string;
  suggestedContent: string;
  suggestedHashtags: string[];
  suggestedTime: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

export interface ClientTransformation {
  id: string;
  clientName: string;
  beforeImage: string;
  afterImage: string;
  duration: string;
  results: string[];
  testimonial?: string;
  socialPostId?: string;
}

// Nuevas funciones API
export const getCampaigns = async (): Promise<Campaign[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [
    {
      id: 'camp_001',
      name: 'Reto 30 Días - Enero 2024',
      description: 'Campaña para motivar a nuevos clientes',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      status: 'active',
      posts: ['post_001', 'post_002', 'post_003'],
      goals: { reach: 50000, engagement: 2000, conversions: 50 },
      currentMetrics: { reach: 35230, engagement: 1450, conversions: 32 }
    },
    {
      id: 'camp_002',
      name: 'Transformaciones del Mes',
      description: 'Destacar logros de clientes',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      status: 'active',
      posts: ['post_004'],
      goals: { reach: 30000, engagement: 1500 },
      currentMetrics: { reach: 18500, engagement: 890, conversions: 0 }
    }
  ];
};

export const getContentLibrary = async (): Promise<ContentLibraryItem[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [
    {
      id: 'lib_001',
      title: 'Plantilla Transformación Cliente',
      content: '¡Increíble transformación de {cliente}! En {tiempo} logramos {resultados}. ¡Felicidades! #Transformacion #FitnessMotivation',
      category: 'transformation',
      mediaUrls: [],
      hashtags: ['transformacion', 'fitnessmotivation', 'resultados'],
      performance: {
        avgEngagement: 850,
        avgReach: 4200,
        timesUsed: 12
      },
      createdAt: '2024-01-01T00:00:00Z',
      lastUsed: '2024-01-25T10:00:00Z'
    },
    {
      id: 'lib_002',
      title: 'Tip Nutrición - Carbohidratos',
      content: '💡 Tip de nutrición: ¡No le temas a los carbohidratos! Son tu principal fuente de energía para entrenar. #Nutricion #Fitness',
      category: 'nutrition',
      mediaUrls: [],
      hashtags: ['nutricion', 'fitness', 'carbohidratos'],
      performance: {
        avgEngagement: 420,
        avgReach: 2100,
        timesUsed: 8
      },
      createdAt: '2024-01-10T00:00:00Z',
      lastUsed: '2024-01-27T12:00:00Z'
    }
  ];
};

export const getAudienceInsights = async (platform?: SocialPlatform): Promise<AudienceInsight> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return {
    demographics: {
      ageGroups: [
        { range: '18-24', percentage: 25 },
        { range: '25-34', percentage: 45 },
        { range: '35-44', percentage: 20 },
        { range: '45+', percentage: 10 }
      ],
      gender: [
        { type: 'Femenino', percentage: 60 },
        { type: 'Masculino', percentage: 40 }
      ],
      locations: [
        { city: 'Madrid', percentage: 35 },
        { city: 'Barcelona', percentage: 25 },
        { city: 'Valencia', percentage: 15 },
        { city: 'Otras', percentage: 25 }
      ]
    },
    behavior: {
      activeHours: [
        { hour: 8, engagement: 120 },
        { hour: 12, engagement: 180 },
        { hour: 18, engagement: 250 },
        { hour: 20, engagement: 220 },
        { hour: 21, engagement: 190 }
      ],
      preferredContent: [
        { category: 'Transformaciones', engagement: 850 },
        { category: 'Ejercicios', engagement: 620 },
        { category: 'Nutrición', engagement: 480 },
        { category: 'Motivación', engagement: 420 }
      ],
      bestDays: [
        { day: 'Lunes', engagement: 180 },
        { day: 'Miércoles', engagement: 200 },
        { day: 'Viernes', engagement: 220 },
        { day: 'Sábado', engagement: 190 }
      ]
    },
    growth: {
      newFollowers: 120,
      unfollowers: 31,
      netGrowth: 89,
      growthRate: '1.6%'
    }
  };
};

export const getBestTimesToPost = async (platform: SocialPlatform): Promise<BestTimeToPost[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const times: BestTimeToPost[] = [
    {
      platform,
      dayOfWeek: 'Lunes',
      hour: 8,
      engagementScore: 85,
      recommendation: 'Excelente momento para publicar contenido motivacional'
    },
    {
      platform,
      dayOfWeek: 'Miércoles',
      hour: 18,
      engagementScore: 92,
      recommendation: 'Mejor hora para publicar ejercicios y tips'
    },
    {
      platform,
      dayOfWeek: 'Viernes',
      hour: 20,
      engagementScore: 88,
      recommendation: 'Ideal para contenido de fin de semana'
    }
  ];
  return times;
};

export const getHashtagAnalysis = async (): Promise<HashtagAnalysis[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [
    { hashtag: '#fitness', usageCount: 45, avgEngagement: 620, reach: 3200, trend: 'up', recommendation: 'use' },
    { hashtag: '#personaltrainer', usageCount: 32, avgEngagement: 580, reach: 2800, trend: 'stable', recommendation: 'use' },
    { hashtag: '#transformacion', usageCount: 28, avgEngagement: 850, reach: 4200, trend: 'up', recommendation: 'use' },
    { hashtag: '#gym', usageCount: 15, avgEngagement: 180, reach: 800, trend: 'down', recommendation: 'avoid' },
    { hashtag: '#fitnessmotivation', usageCount: 20, avgEngagement: 420, reach: 2100, trend: 'stable', recommendation: 'test' }
  ];
};

export const getContentSuggestions = async (): Promise<ContentSuggestion[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return [
    {
      id: 'sug_001',
      type: 'reel',
      title: 'Reel: Técnica de Sentadillas',
      description: 'Crea un reel mostrando la técnica correcta de sentadillas',
      suggestedContent: 'Video corto mostrando paso a paso la técnica correcta de sentadillas con tips de seguridad',
      suggestedHashtags: ['#sentadillas', '#tecnica', '#fitness', '#ejercicio'],
      suggestedTime: '2024-01-29T18:00:00Z',
      reason: 'Los videos de ejercicios tienen 3x más engagement en este horario',
      priority: 'high'
    },
    {
      id: 'sug_002',
      type: 'post',
      title: 'Post: Transformación Cliente',
      description: 'Publica la transformación de un cliente exitoso',
      suggestedContent: 'Antes y después de cliente con testimonial y resultados',
      suggestedHashtags: ['#transformacion', '#resultados', '#fitnessmotivation'],
      suggestedTime: '2024-01-30T10:00:00Z',
      reason: 'Las transformaciones generan el mayor engagement según tus métricas',
      priority: 'high'
    },
    {
      id: 'sug_003',
      type: 'story',
      title: 'Story: Tip Nutricional',
      description: 'Comparte un tip rápido de nutrición',
      suggestedContent: 'Tip visual sobre hidratación o proteínas',
      suggestedHashtags: ['#nutricion', '#tip', '#salud'],
      suggestedTime: '2024-01-28T12:00:00Z',
      reason: 'Los tips de nutrición funcionan bien a mediodía',
      priority: 'medium'
    }
  ];
};

export const getClientTransformations = async (): Promise<ClientTransformation[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [
    {
      id: 'trans_001',
      clientName: 'Juan Pérez',
      beforeImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
      afterImage: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e',
      duration: '3 meses',
      results: ['-15kg', 'Aumento de masa muscular', 'Mejora de resistencia'],
      testimonial: 'Gracias a Laura por su dedicación y profesionalismo. Los resultados hablan por sí solos.',
      socialPostId: 'post_004'
    },
    {
      id: 'trans_002',
      clientName: 'María González',
      beforeImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48',
      afterImage: 'https://images.unsplash.com/photo-1556910096-6f5e72db6803',
      duration: '6 meses',
      results: ['-20kg', 'Mejora de fuerza', 'Mayor confianza'],
      testimonial: 'El mejor entrenador personal que he tenido. Superó todas mis expectativas.'
    }
  ];
};

export const createCampaign = async (campaignData: Omit<Campaign, 'id'>): Promise<Campaign> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    id: `camp_${Date.now()}`,
    ...campaignData
  };
};

export const saveToContentLibrary = async (item: Omit<ContentLibraryItem, 'id' | 'createdAt'>): Promise<ContentLibraryItem> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return {
    id: `lib_${Date.now()}`,
    ...item,
    createdAt: new Date().toISOString()
  };
};

// Interfaces para generación automática de contenido
export interface ContentVariable {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'client' | 'event';
  defaultValue?: string;
  options?: string[];
}

export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  category: 'transformation' | 'exercise' | 'nutrition' | 'motivation' | 'tip' | 'event' | 'achievement';
  content: string; // Con variables como {cliente}, {tiempo}, etc.
  variables: ContentVariable[];
  platforms: SocialPlatform[];
  suggestedHashtags: string[];
  mediaPlaceholders?: string[];
}

export interface GeneratedContent {
  id: string;
  templateId: string;
  content: string;
  platform: SocialPlatform;
  variables: Record<string, string>;
  hashtags: string[];
  mediaUrls: string[];
  scheduledAt?: string;
  status: 'draft' | 'scheduled';
}

export interface ContentRotationRule {
  id: string;
  name: string;
  enabled: boolean;
  minDaysBetween: number;
  categories: string[];
  platforms: SocialPlatform[];
}

// Funciones para generación automática
export const getContentTemplates = async (): Promise<ContentTemplate[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    {
      id: 'tpl_001',
      name: 'Transformación de Cliente',
      description: 'Genera un post de transformación con datos del cliente',
      category: 'transformation',
      content: '¡Increíble transformación de {cliente}! 🎉\n\nEn {tiempo} logramos:\n{resultados}\n\n{testimonial}\n\n#Transformacion #FitnessMotivation #Resultados',
      variables: [
        { key: 'cliente', label: 'Nombre del Cliente', type: 'client' },
        { key: 'tiempo', label: 'Duración', type: 'text', defaultValue: '3 meses' },
        { key: 'resultados', label: 'Resultados', type: 'text' },
        { key: 'testimonial', label: 'Testimonial', type: 'text', defaultValue: '' }
      ],
      platforms: ['instagram', 'facebook'],
      suggestedHashtags: ['transformacion', 'fitnessmotivation', 'resultados', 'personaltrainer'],
      mediaPlaceholders: ['before', 'after']
    },
    {
      id: 'tpl_002',
      name: 'Evento/Clase Próxima',
      description: 'Anuncia una clase o evento próximo',
      category: 'event',
      content: '📅 ¡No te pierdas {evento}!\n\n📆 Fecha: {fecha}\n⏰ Hora: {hora}\n📍 Lugar: {lugar}\n\n{descripcion}\n\n¡Reserva tu lugar! 👇\n\n#Fitness #Evento #Clase',
      variables: [
        { key: 'evento', label: 'Nombre del Evento', type: 'text' },
        { key: 'fecha', label: 'Fecha', type: 'date' },
        { key: 'hora', label: 'Hora', type: 'text', defaultValue: '10:00' },
        { key: 'lugar', label: 'Lugar', type: 'text', defaultValue: 'Gimnasio' },
        { key: 'descripcion', label: 'Descripción', type: 'text' }
      ],
      platforms: ['instagram', 'facebook', 'tiktok'],
      suggestedHashtags: ['fitness', 'evento', 'clase', 'entrenamiento']
    },
    {
      id: 'tpl_003',
      name: 'Tip Diario',
      description: 'Genera un tip de fitness o nutrición',
      category: 'tip',
      content: '💡 Tip del día: {tip}\n\n{explicacion}\n\n#TipFitness #Nutricion #Fitness',
      variables: [
        { key: 'tip', label: 'Tip', type: 'text' },
        { key: 'explicacion', label: 'Explicación', type: 'text' }
      ],
      platforms: ['instagram', 'facebook'],
      suggestedHashtags: ['tipfitness', 'nutricion', 'fitness', 'salud']
    },
    {
      id: 'tpl_004',
      name: 'Logro de Cliente',
      description: 'Celebra un logro o hito de un cliente',
      category: 'achievement',
      content: '🏆 ¡Felicitaciones {cliente}!\n\nHas logrado: {logro}\n\n{descripcion}\n\n¡Sigue así! 💪\n\n#Logro #FitnessMotivation #Exito',
      variables: [
        { key: 'cliente', label: 'Nombre del Cliente', type: 'client' },
        { key: 'logro', label: 'Logro', type: 'text' },
        { key: 'descripcion', label: 'Descripción', type: 'text' }
      ],
      platforms: ['instagram', 'facebook'],
      suggestedHashtags: ['logro', 'fitnessmotivation', 'exito', 'personaltrainer']
    }
  ];
};

export const generateContentFromTemplate = async (
  templateId: string,
  variables: Record<string, string>,
  platform: SocialPlatform
): Promise<GeneratedContent> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const templates = await getContentTemplates();
  const template = templates.find(t => t.id === templateId);
  
  if (!template) {
    throw new Error('Plantilla no encontrada');
  }
  
  let content = template.content;
  
  // Reemplazar variables
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    content = content.replace(regex, value);
  });
  
  // Personalizar por plataforma
  if (platform === 'tiktok') {
    content = content.substring(0, 150); // TikTok tiene límite más corto
  }
  
  return {
    id: `gen_${Date.now()}`,
    templateId,
    content,
    platform,
    variables,
    hashtags: template.suggestedHashtags,
    mediaUrls: [],
    status: 'draft'
  };
};

export const getContentRotationRules = async (): Promise<ContentRotationRule[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    {
      id: 'rot_001',
      name: 'Evitar Repetición de Transformaciones',
      enabled: true,
      minDaysBetween: 7,
      categories: ['transformation'],
      platforms: ['instagram', 'facebook']
    },
    {
      id: 'rot_002',
      name: 'Rotación de Tips',
      enabled: true,
      minDaysBetween: 3,
      categories: ['tip', 'nutrition'],
      platforms: ['instagram', 'facebook']
    }
  ];
};








