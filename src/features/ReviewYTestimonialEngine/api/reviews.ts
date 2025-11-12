// API para gestión de Reviews & Testimonials

export type ReviewSource = 'google' | 'facebook' | 'web';
export type ReviewStatus = 'new' | 'read' | 'featured' | 'archived' | 'responded';
export type AutomationTrigger = 'program_completed' | 'milestone_reached' | 'sessions_completed';
export type AutomationChannel = 'email' | 'sms';

export interface Review {
  id: string;
  source: ReviewSource;
  rating: number;
  content: string;
  authorName: string;
  authorPhoto?: string;
  createdAt: string;
  status: ReviewStatus;
  response?: string;
  tags?: string[];
}

export interface ReviewResponse {
  data: Review[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

export interface Automation {
  id: string;
  name: string;
  isActive: boolean;
  trigger: {
    type: AutomationTrigger;
    programId?: string;
    milestoneId?: string;
    sessionsCount?: number;
  };
  action: {
    type: 'send_review_request';
    channel: AutomationChannel;
    templateId?: string;
  };
  delay?: {
    value: number;
    unit: 'days' | 'hours';
  };
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  reviewsByPlatform: {
    google: number;
    facebook: number;
    web: number;
  };
  requestConversionRate: number;
  averageResponseTime: number;
  reviewsConvertedToContent: number;
  ratingTrend: {
    date: string;
    averageRating: number;
  }[];
}

// Funciones API simuladas
export const getReviews = async (
  page: number = 1,
  limit: number = 20,
  source?: ReviewSource,
  rating?: number,
  status?: ReviewStatus
): Promise<ReviewResponse> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  const reviews: Review[] = [
    {
      id: 'rev_001',
      source: 'google',
      rating: 5,
      content: '¡El mejor entrenador! He conseguido mis objetivos en tiempo récord.',
      authorName: 'Ana García',
      createdAt: '2024-01-27T10:00:00Z',
      status: 'featured',
      tags: ['transformación corporal']
    },
    {
      id: 'rev_002',
      source: 'facebook',
      rating: 5,
      content: 'Profesional, motivador y con resultados increíbles. Lo recomiendo 100%.',
      authorName: 'Carlos Ruiz',
      createdAt: '2024-01-26T14:30:00Z',
      status: 'read',
      tags: ['preparación maratón']
    },
    {
      id: 'rev_003',
      source: 'google',
      rating: 4,
      content: 'Muy buen entrenador, aunque algunas veces el horario no cuadraba.',
      authorName: 'María López',
      createdAt: '2024-01-25T09:15:00Z',
      status: 'read',
      response: 'Gracias por tu feedback. Estamos mejorando la flexibilidad de horarios.'
    },
    {
      id: 'rev_004',
      source: 'web',
      rating: 5,
      content: 'Después de 90 días de programa, he perdido 12kg y me siento mejor que nunca.',
      authorName: 'Laura Martínez',
      createdAt: '2024-01-24T16:45:00Z',
      status: 'featured',
      tags: ['transformación corporal', 'pérdida de peso']
    },
    {
      id: 'rev_005',
      source: 'facebook',
      rating: 3,
      content: 'Buen entrenador pero la comunicación podría ser mejor.',
      authorName: 'Pedro Sánchez',
      createdAt: '2024-01-23T11:20:00Z',
      status: 'new',
      response: 'Gracias por tu comentario. Nos pondremos en contacto contigo para mejorar.'
    }
  ];

  let filtered = reviews;

  if (source) {
    filtered = filtered.filter(r => r.source === source);
  }

  if (rating) {
    filtered = filtered.filter(r => r.rating === rating);
  }

  if (status) {
    filtered = filtered.filter(r => r.status === status);
  }

  return {
    data: filtered,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(filtered.length / limit),
      totalItems: filtered.length
    }
  };
};

export const updateReviewStatus = async (
  reviewId: string,
  status: ReviewStatus
): Promise<Review> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const response = await getReviews();
  const review = response.data.find(r => r.id === reviewId);

  if (!review) {
    throw new Error('Reseña no encontrada');
  }

  return {
    ...review,
    status
  };
};

export const syncReviews = async (platform?: ReviewSource): Promise<{ status: string; message: string; jobId: string }> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    status: 'sync_started',
    message: 'La sincronización con las plataformas ha comenzado. Puede tomar unos minutos.',
    jobId: `sync_job_${Date.now()}`
  };
};

export const getAutomations = async (): Promise<Automation[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  return [
    {
      id: 'auto_001',
      name: 'Solicitud post-programa 90 días',
      isActive: true,
      trigger: {
        type: 'program_completed',
        programId: 'prog_xyz'
      },
      action: {
        type: 'send_review_request',
        channel: 'email',
        templateId: 'tmpl_abc'
      },
      delay: {
        value: 3,
        unit: 'days'
      }
    },
    {
      id: 'auto_002',
      name: 'Reseña después de hito de pérdida de peso',
      isActive: true,
      trigger: {
        type: 'milestone_reached',
        milestoneId: 'milestone_weight_loss_10kg'
      },
      action: {
        type: 'send_review_request',
        channel: 'sms'
      },
      delay: {
        value: 1,
        unit: 'days'
      }
    }
  ];
};

export const createOrUpdateAutomation = async (automation: Omit<Automation, 'id'>): Promise<Automation> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    id: `auto_${Date.now()}`,
    ...automation
  };
};

export const getReviewStats = async (): Promise<ReviewStats> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  return {
    averageRating: 4.6,
    totalReviews: 156,
    reviewsByPlatform: {
      google: 89,
      facebook: 52,
      web: 15
    },
    requestConversionRate: 42.5,
    averageResponseTime: 4.5,
    reviewsConvertedToContent: 23,
    ratingTrend: [
      { date: '2024-01-01', averageRating: 4.5 },
      { date: '2024-01-15', averageRating: 4.6 },
      { date: '2024-01-27', averageRating: 4.6 }
    ]
  };
};

export const getSourceLabel = (source: ReviewSource): string => {
  const labels = {
    google: 'Google',
    facebook: 'Facebook',
    web: 'Sitio Web'
  };
  return labels[source];
};

export const getStatusLabel = (status: ReviewStatus): string => {
  const labels = {
    new: 'Nueva',
    read: 'Leída',
    featured: 'Destacada',
    archived: 'Archivada',
    responded: 'Respondida'
  };
  return labels[status];
};

export const getStatusColor = (status: ReviewStatus): string => {
  const colors = {
    new: 'text-blue-700 bg-blue-50',
    read: 'text-gray-700 bg-gray-50',
    featured: 'text-purple-700 bg-purple-50',
    archived: 'text-gray-500 bg-gray-50',
    responded: 'text-green-700 bg-green-50'
  };
  return colors[status];
};

export const getRatingColor = (rating: number): string => {
  if (rating >= 4.5) return 'text-green-600';
  if (rating >= 3.5) return 'text-yellow-600';
  return 'text-red-600';
};




















