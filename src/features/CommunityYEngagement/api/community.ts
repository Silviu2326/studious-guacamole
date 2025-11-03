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
  type?: 'post' | 'question' | 'achievement';
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
  filterBy?: 'latest' | 'trending' | 'questions';
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
    }
  ];
  
  return {
    data: posts,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(100 / limit),
      totalItems: 100
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

export const getCommunityAnalytics = async (): Promise<{
  dailyActiveUsers: number;
  totalMembers: number;
  participationRate: number;
  postsThisWeek: number;
  avgCommentsPerPost: number;
  avgResponseTime: number;
  growthRate: number;
}> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return {
    dailyActiveUsers: 45,
    totalMembers: 150,
    participationRate: 30,
    postsThisWeek: 28,
    avgCommentsPerPost: 3.5,
    avgResponseTime: 2.5, // horas
    growthRate: 15 // %
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


