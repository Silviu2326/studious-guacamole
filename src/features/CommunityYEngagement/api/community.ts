// API para Community & Engagement

export interface Post {
  id: string;
  author: UserProfile;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  groupId?: string;
  groupName?: string;
  createdAt: string;
  reactions: Reactions;
  commentCount: number;
  isPinned?: boolean;
  /**
   * Tipo de post. Valores posibles:
   * - 'post': Publicación estándar
   * - 'question': Pregunta a la comunidad
   * - 'achievement': Logro o hito alcanzado
   * - 'testimonial': Testimonio de experiencia del usuario
   * - 'referral': Post de referido o recomendación
   */
  type?: 'post' | 'question' | 'achievement' | 'testimonial' | 'referral';
}

export interface UserProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  role?: 'trainer' | 'client' | 'admin';
  badges?: Badge[];
}

export interface Reactions {
  celebrate?: number;
  support?: number;
  like?: number;
  [key: string]: number | undefined;
}

export interface Comment {
  id: string;
  postId: string;
  author: UserProfile;
  content: string;
  createdAt: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  memberCount: number;
  coverImageUrl?: string;
  createdBy: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  earnedDate?: string;
}

export interface CommunityFilters {
  groupId?: string;
  filterBy?: 'latest' | 'trending' | 'questions' | 'testimonial' | 'referral';
  search?: string;
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export interface PostsResponse {
  data: Post[];
  pagination: PaginationData;
}

// Funciones API simuladas (a implementar con backend real)

export const getPosts = async (
  page: number = 1,
  limit: number = 10,
  filters?: CommunityFilters
): Promise<PostsResponse> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Datos de ejemplo
  const posts: Post[] = [
    {
      id: 'post_123',
      author: {
        id: 'user_abc',
        name: 'Ana Pérez',
        avatarUrl: 'https://ui-avatars.com/api/?name=Ana+Pérez',
        role: 'client',
        badges: [
          {
            id: 'badge_1',
            name: 'Guerrero del Gym',
            description: '50 Sesiones Registradas',
            earnedDate: '2023-10-01T10:00:00Z'
          }
        ]
      },
      content: '¡Nuevo PR en peso muerto! 100kg. ¡Gracias coach!',
      mediaUrl: 'https://cdn.trainererp.com/video_123.mp4',
      mediaType: 'video',
      groupId: 'group_general',
      groupName: 'Grupo General',
      createdAt: '2023-10-27T10:00:00Z',
      reactions: {
        celebrate: 15,
        support: 20
      },
      commentCount: 5,
      type: 'achievement'
    },
    {
      id: 'post_124',
      author: {
        id: 'user_xyz',
        name: 'Carlos Ruíz',
        avatarUrl: 'https://ui-avatars.com/api/?name=Carlos+Ruíz',
        role: 'client'
      },
      content: 'Duda sobre macros, ¿alguien me ayuda?',
      createdAt: '2023-10-27T11:00:00Z',
      reactions: {
        support: 3
      },
      commentCount: 2,
      type: 'question'
    },
    {
      id: 'post_125',
      author: {
        id: 'user_testimonial',
        name: 'María González',
        avatarUrl: 'https://ui-avatars.com/api/?name=María+González',
        role: 'client',
        badges: [
          {
            id: 'badge_3',
            name: 'Transformación Completa',
            description: 'Completó programa de 6 meses',
            earnedDate: '2023-09-15T10:00:00Z'
          }
        ]
      },
      content: 'Llevo 6 meses entrenando aquí y he perdido 15kg. El apoyo de la comunidad y mi entrenador ha sido increíble. ¡Recomiendo 100% este gimnasio!',
      mediaUrl: 'https://cdn.trainererp.com/testimonial_maria.jpg',
      mediaType: 'image',
      groupId: 'group_general',
      groupName: 'Grupo General',
      createdAt: '2023-10-26T14:30:00Z',
      reactions: {
        celebrate: 45,
        support: 32,
        like: 28
      },
      commentCount: 12,
      type: 'testimonial'
    },
    {
      id: 'post_126',
      author: {
        id: 'user_referral',
        name: 'Luis Martínez',
        avatarUrl: 'https://ui-avatars.com/api/?name=Luis+Martínez',
        role: 'client'
      },
      content: 'He traído a mi amigo Juan al gimnasio. Si alguien más quiere traer a un amigo, ambos obtienen un mes gratis. ¡Aprovechen la promoción!',
      groupId: 'group_general',
      groupName: 'Grupo General',
      createdAt: '2023-10-25T09:15:00Z',
      reactions: {
        support: 18,
        like: 15
      },
      commentCount: 8,
      type: 'referral'
    },
    // Testimonios recientes para el panel
    {
      id: 'post_testimonial_recent_1',
      author: {
        id: 'user_testimonial_2',
        name: 'Sofía Ramírez',
        avatarUrl: 'https://ui-avatars.com/api/?name=Sofía+Ramírez',
        role: 'client',
        badges: [
          {
            id: 'badge_4',
            name: 'Compromiso Total',
            description: '100 sesiones completadas',
            earnedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
      },
      content: 'Increíble experiencia en este gimnasio. En 3 meses he ganado mucha fuerza y confianza. Los entrenadores son profesionales y la comunidad es muy acogedora. ¡No puedo estar más feliz!',
      mediaUrl: 'https://cdn.trainererp.com/testimonial_sofia.jpg',
      mediaType: 'image',
      groupId: 'group_general',
      groupName: 'Grupo General',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // Hace 3 días
      reactions: {
        celebrate: 52,
        support: 38,
        like: 31
      },
      commentCount: 15,
      type: 'testimonial'
    },
    {
      id: 'post_testimonial_recent_2',
      author: {
        id: 'user_testimonial_3',
        name: 'Roberto Silva',
        avatarUrl: 'https://ui-avatars.com/api/?name=Roberto+Silva',
        role: 'client'
      },
      content: 'Llevo un año aquí y ha sido la mejor decisión. He logrado mis objetivos de pérdida de peso y ahora me siento más fuerte que nunca. El ambiente es motivador y los resultados hablan por sí solos.',
      groupId: 'group_general',
      groupName: 'Grupo General',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // Hace 10 días
      reactions: {
        celebrate: 67,
        support: 45,
        like: 42
      },
      commentCount: 18,
      type: 'testimonial'
    },
    {
      id: 'post_testimonial_recent_3',
      author: {
        id: 'user_testimonial_4',
        name: 'Laura Fernández',
        avatarUrl: 'https://ui-avatars.com/api/?name=Laura+Fernández',
        role: 'client'
      },
      content: 'Me encanta venir aquí. El equipo es increíble y siempre están dispuestos a ayudar. He mejorado mi técnica y he evitado lesiones gracias a su supervisión. ¡100% recomendado!',
      groupId: 'group_general',
      groupName: 'Grupo General',
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // Hace 20 días
      reactions: {
        celebrate: 41,
        support: 29,
        like: 25
      },
      commentCount: 11,
      type: 'testimonial'
    },
    // Referidos recientes para el panel
    {
      id: 'post_referral_recent_1',
      author: {
        id: 'user_referral_2',
        name: 'Carmen López',
        avatarUrl: 'https://ui-avatars.com/api/?name=Carmen+López',
        role: 'client'
      },
      content: 'Acabo de referir a mi hermana y ambos recibimos un mes gratis. ¡La promoción sigue activa! Si tienen amigos interesados en fitness, esta es su oportunidad.',
      groupId: 'group_general',
      groupName: 'Grupo General',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Hace 2 días
      reactions: {
        support: 22,
        like: 19
      },
      commentCount: 9,
      type: 'referral'
    },
    {
      id: 'post_referral_recent_2',
      author: {
        id: 'user_referral_3',
        name: 'Diego Torres',
        avatarUrl: 'https://ui-avatars.com/api/?name=Diego+Torres',
        role: 'client'
      },
      content: 'Mi compañero de trabajo se unió gracias a mi recomendación. Está encantado con las instalaciones y el ambiente. ¡Sigan así!',
      groupId: 'group_general',
      groupName: 'Grupo General',
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // Hace 15 días
      reactions: {
        support: 16,
        like: 14
      },
      commentCount: 6,
      type: 'referral'
    }
  ];
  
  // Aplicar filtros
  let filteredPosts = [...posts];
  
  // Filtrar por grupo si se especifica
  if (filters?.groupId) {
    filteredPosts = filteredPosts.filter(post => post.groupId === filters.groupId);
  }
  
  // Filtrar por tipo de post según filterBy
  if (filters?.filterBy) {
    switch (filters.filterBy) {
      case 'questions':
        filteredPosts = filteredPosts.filter(post => post.type === 'question');
        break;
      case 'testimonial':
        filteredPosts = filteredPosts.filter(post => post.type === 'testimonial');
        break;
      case 'referral':
        filteredPosts = filteredPosts.filter(post => post.type === 'referral');
        break;
      case 'trending':
        // Para trending, ordenar por reacciones totales
        filteredPosts = filteredPosts.sort((a, b) => {
          const aReactions = Object.values(a.reactions || {}).reduce((sum, val) => sum + (val || 0), 0);
          const bReactions = Object.values(b.reactions || {}).reduce((sum, val) => sum + (val || 0), 0);
          return bReactions - aReactions;
        });
        break;
      case 'latest':
      default:
        // Para latest, ordenar por fecha de creación (más recientes primero)
        filteredPosts = filteredPosts.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }
  } else {
    // Por defecto, ordenar por fecha (latest)
    filteredPosts = filteredPosts.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  
  // Aplicar paginación
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
  
  return {
    data: paginatedPosts,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(filteredPosts.length / limit),
      totalItems: filteredPosts.length
    }
  };
};

export const createPost = async (
  content: string,
  mediaUrl?: string,
  groupId?: string
): Promise<Post> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // En producción: POST /api/community/posts
  const newPost: Post = {
    id: `post_${Date.now()}`,
    author: {
      id: 'current_user',
      name: 'Usuario Actual',
      avatarUrl: 'https://ui-avatars.com/api/?name=Usuario',
      role: 'client'
    },
    content,
    mediaUrl,
    mediaType: mediaUrl?.match(/\.(jpg|jpeg|png|gif)$/i) ? 'image' : 'video',
    groupId,
    createdAt: new Date().toISOString(),
    reactions: {},
    commentCount: 0,
    type: 'post'
  };
  
  return newPost;
};

export const addComment = async (
  postId: string,
  content: string
): Promise<Comment> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: POST /api/community/posts/{postId}/comments
  const newComment: Comment = {
    id: `comment_${Date.now()}`,
    postId,
    author: {
      id: 'current_user',
      name: 'Usuario Actual',
      avatarUrl: 'https://ui-avatars.com/api/?name=Usuario',
      role: 'trainer'
    },
    content,
    createdAt: new Date().toISOString()
  };
  
  return newComment;
};

export const getComments = async (postId: string): Promise<Comment[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    {
      id: 'comment_789',
      postId,
      author: {
        id: 'trainer_001',
        name: 'Entrenador David',
        avatarUrl: 'https://ui-avatars.com/api/?name=David',
        role: 'trainer'
      },
      content: '¡Claro! Revisa el documento sobre macros en la sección de archivos del grupo de nutrición.',
      createdAt: '2023-10-27T11:05:00Z'
    }
  ];
};

export const deletePost = async (postId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: DELETE /api/community/posts/{postId}
};

export const reactToPost = async (
  postId: string,
  reactionType: string
): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: POST /api/community/posts/{postId}/reactions
};

export const getGroups = async (): Promise<Group[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    {
      id: 'group_general',
      name: 'Grupo General',
      description: 'Espacio general de la comunidad',
      isPrivate: false,
      memberCount: 150,
      createdBy: 'trainer_001'
    },
    {
      id: 'group_nutrition',
      name: 'Nutrición y Macros',
      description: 'Comparte recetas y consejos nutricionales',
      isPrivate: false,
      memberCount: 85,
      createdBy: 'trainer_001'
    },
    {
      id: 'group_challenge_90',
      name: 'Reto de 90 Días',
      description: 'Grupo exclusivo para participantes del reto',
      isPrivate: true,
      memberCount: 25,
      createdBy: 'trainer_001'
    }
  ];
};

/**
 * Métricas de analíticas de la comunidad
 * Incluye métricas básicas de engagement y métricas extendidas de retención y fidelización
 */
export interface CommunityAnalytics {
  dailyActiveUsers: number;
  totalMembers: number;
  participationRate: number;
  postsThisWeek: number;
  avgCommentsPerPost: number;
  avgResponseTime: number;
  growthRate: number;
  // Métricas de retención y fidelización
  retentionRate: number; // Porcentaje de usuarios que vuelven a participar semana a semana
  reactivatedMembers: number; // Número de miembros inactivos que han vuelto a participar en la última ventana de tiempo
  referralLeads: number; // Número de leads generados por referidos (placeholder simulado)
}

export const getCommunityAnalytics = async (): Promise<CommunityAnalytics> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return {
    dailyActiveUsers: 45,
    totalMembers: 150,
    participationRate: 30,
    postsThisWeek: 28,
    avgCommentsPerPost: 3.5,
    avgResponseTime: 2.5, // horas
    growthRate: 15, // %
    retentionRate: 72.5, // Porcentaje de usuarios que vuelven semana a semana
    reactivatedMembers: 12, // Miembros reactivados en la última semana
    referralLeads: 8 // Leads por referidos (simulado)
  };
};

export const getUserBadges = async (userId: string): Promise<Badge[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    {
      id: 'badge_1',
      name: 'Guerrero del Gym',
      description: '50 Sesiones Registradas',
      earnedDate: '2023-10-01T10:00:00Z'
    },
    {
      id: 'badge_2',
      name: 'Consistencia Semanal',
      description: 'Completó todos los entrenamientos de una semana',
      earnedDate: '2023-10-15T10:00:00Z'
    }
  ];
};

// Interfaces para resúmenes de testimonios y referidos
export interface TestimonialSummary {
  totalLastWeek: number;
  totalLast30Days: number;
  featured: Post[];
}

export interface ReferralSummary {
  totalLastWeek: number;
  totalLast30Days: number;
  featured: Post[];
}

/**
 * Obtiene un resumen de testimonios del feed
 * Incluye conteos de la última semana y últimos 30 días, y testimonios destacados
 */
export const getTestimonialSummary = async (): Promise<TestimonialSummary> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Obtener todos los posts de tipo testimonial
  const response = await getPosts(1, 100, { filterBy: 'testimonial' });
  const testimonials = response.data;
  
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  // Filtrar por fecha
  const lastWeek = testimonials.filter(post => 
    new Date(post.createdAt) >= oneWeekAgo
  );
  const last30Days = testimonials.filter(post => 
    new Date(post.createdAt) >= thirtyDaysAgo
  );
  
  // Obtener testimonios destacados (ordenados por reacciones totales, máximo 5)
  const featured = testimonials
    .sort((a, b) => {
      const aReactions = Object.values(a.reactions || {}).reduce((sum, val) => sum + (val || 0), 0);
      const bReactions = Object.values(b.reactions || {}).reduce((sum, val) => sum + (val || 0), 0);
      return bReactions - aReactions;
    })
    .slice(0, 5);
  
  return {
    totalLastWeek: lastWeek.length,
    totalLast30Days: last30Days.length,
    featured
  };
};

/**
 * Obtiene un resumen de referidos del feed
 * Incluye conteos de la última semana y últimos 30 días, y referidos destacados
 */
export const getReferralSummary = async (): Promise<ReferralSummary> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Obtener todos los posts de tipo referral
  const response = await getPosts(1, 100, { filterBy: 'referral' });
  const referrals = response.data;
  
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  // Filtrar por fecha
  const lastWeek = referrals.filter(post => 
    new Date(post.createdAt) >= oneWeekAgo
  );
  const last30Days = referrals.filter(post => 
    new Date(post.createdAt) >= thirtyDaysAgo
  );
  
  // Obtener referidos destacados (ordenados por fecha, más recientes primero, máximo 5)
  const featured = referrals
    .sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);
  
  return {
    totalLastWeek: lastWeek.length,
    totalLast30Days: last30Days.length,
    featured
  };
};























