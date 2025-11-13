import { PromoterMission, PromoterBranding, MissionType, MissionStatus, MissionPriority } from '../types';

// Mock data para misiones de promotores
const MOCK_PROMOTER_MISSIONS: PromoterMission[] = [
  {
    id: 'mission_001',
    promoterId: 'cliente_001',
    promoterName: 'Laura Méndez',
    type: 'reel',
    title: 'Reel: Mi Transformación en 3 Meses',
    description: 'Crea un reel mostrando tu transformación física y mental en los últimos 3 meses',
    instructions:
      '1. Graba un reel de 30-60 segundos mostrando tu antes y después\n2. Incluye momentos clave de tu entrenamiento\n3. Usa los hashtags sugeridos\n4. Menciona @tuentrenador en el reel',
    status: 'completed',
    priority: 'high',
    assignedAt: '2025-10-10T10:00:00Z',
    dueDate: '2025-10-20T23:59:59Z',
    completedAt: '2025-10-18T15:30:00Z',
    personalizedMessage:
      '¡Hola Laura! Sabemos que has logrado resultados increíbles. Queremos que compartas tu historia para inspirar a otros. Tu reel será destacado en nuestras redes.',
    suggestedHashtags: ['#Transformación', '#Fitness', '#Motivación', '#Éxito'],
    suggestedMentions: ['@tuentrenador', '@tucomunidad'],
    reward: {
      type: 'sesion-gratis',
      value: 2,
      description: '2 sesiones premium gratis',
    },
    submittedContent: {
      url: 'https://instagram.com/reel/example123',
      platform: 'instagram',
      publishedAt: '2025-10-18T15:30:00Z',
    },
    performance: {
      views: 12500,
      likes: 890,
      comments: 145,
      shares: 67,
      reach: 18500,
    },
    trainerFeedback: {
      rating: 5,
      comment: 'Excelente reel, muy inspirador. Perfecto para nuestra marca.',
      approved: true,
    },
    createdAt: '2025-10-10T10:00:00Z',
    updatedAt: '2025-10-18T15:30:00Z',
  },
  {
    id: 'mission_002',
    promoterId: 'cliente_002',
    promoterName: 'Carlos Ortega',
    type: 'review',
    title: 'Reseña en Google My Business',
    description: 'Escribe una reseña detallada sobre tu experiencia en Google',
    instructions:
      '1. Ve a nuestro perfil de Google My Business\n2. Escribe una reseña de 4-5 estrellas\n3. Menciona aspectos específicos que te gustaron\n4. Incluye detalles sobre tu progreso',
    status: 'in-progress',
    priority: 'medium',
    assignedAt: '2025-10-15T09:00:00Z',
    dueDate: '2025-10-25T23:59:59Z',
    personalizedMessage:
      'Carlos, tu experiencia ha sido excepcional. Ayúdanos compartiendo tu opinión en Google para que más personas puedan beneficiarse.',
    suggestedHashtags: [],
    reward: {
      type: 'descuento',
      value: 15,
      description: '15% de descuento en el próximo mes',
    },
    createdAt: '2025-10-15T09:00:00Z',
  },
  {
    id: 'mission_003',
    promoterId: 'cliente_004',
    promoterName: 'Pedro Sánchez',
    type: 'testimonial',
    title: 'Testimonio en Video',
    description: 'Graba un testimonio en video contando tu historia de éxito',
    instructions:
      '1. Graba un video de 2-3 minutos\n2. Habla sobre tu objetivo inicial y cómo lo alcanzaste\n3. Menciona cómo el entrenador te ayudó\n4. Comparte el video en tus redes sociales',
    status: 'assigned',
    priority: 'high',
    assignedAt: '2025-10-16T11:00:00Z',
    dueDate: '2025-10-26T23:59:59Z',
    personalizedMessage:
      'Pedro, has logrado resultados increíbles en poco tiempo. Tu testimonio puede inspirar a muchos. ¡Comparte tu historia!',
    suggestedHashtags: ['#Testimonio', '#Éxito', '#Motivación'],
    reward: {
      type: 'bono',
      value: 30,
      description: 'Bono de $30',
    },
    createdAt: '2025-10-16T11:00:00Z',
  },
  {
    id: 'mission_004',
    promoterId: 'cliente_001',
    promoterName: 'Laura Méndez',
    type: 'story',
    title: 'Story: Día de Entrenamiento',
    description: 'Comparte un story mostrando tu rutina de entrenamiento',
    instructions:
      '1. Toma fotos/videos durante tu sesión de entrenamiento\n2. Crea un story con 3-5 slides\n3. Menciona @tuentrenador\n4. Usa los hashtags sugeridos',
    status: 'pending',
    priority: 'low',
    assignedAt: '2025-10-17T14:00:00Z',
    dueDate: '2025-10-24T23:59:59Z',
    personalizedMessage: 'Laura, comparte tu día de entrenamiento para motivar a otros.',
    suggestedHashtags: ['#Entrenamiento', '#Fitness', '#Motivación'],
    reward: {
      type: 'descuento',
      value: 10,
      description: '10% de descuento',
    },
    createdAt: '2025-10-17T14:00:00Z',
  },
];

const MOCK_PROMOTER_BRANDINGS: PromoterBranding[] = [
  {
    promoterId: 'cliente_001',
    promoterName: 'Laura Méndez',
    brandKit: {
      logoUrl: 'https://example.com/logo.png',
      colorPalette: ['#6366F1', '#8B5CF6', '#EC4899'],
      fonts: ['Inter', 'Poppins'],
      styleGuide: 'https://example.com/style-guide.pdf',
    },
    personalizedBio:
      'Entusiasta del fitness y embajadora de la transformación personal. Compartiendo mi viaje hacia una vida más saludable y activa.',
    socialHandles: [
      { platform: 'instagram', handle: 'lauramendez_fit', verified: true },
      { platform: 'facebook', handle: 'lauramendez.fitness', verified: false },
    ],
    missionHistory: MOCK_PROMOTER_MISSIONS.filter((m) => m.promoterId === 'cliente_001'),
    totalMissionsCompleted: 1,
    totalMissionsAssigned: 2,
    averagePerformanceScore: 92,
    preferredMissionTypes: ['reel', 'testimonial'],
    tags: ['embajadora', 'alta-engagement', 'video-content'],
  },
  {
    promoterId: 'cliente_002',
    promoterName: 'Carlos Ortega',
    personalizedBio:
      'Empresario comprometido con su salud. Transformando mi estilo de vida mientras construyo mi negocio.',
    socialHandles: [
      { platform: 'facebook', handle: 'carlos.ortega', verified: false },
      { platform: 'google-my-business', handle: 'carlos-ortega', verified: true },
    ],
    missionHistory: MOCK_PROMOTER_MISSIONS.filter((m) => m.promoterId === 'cliente_002'),
    totalMissionsCompleted: 0,
    totalMissionsAssigned: 1,
    averagePerformanceScore: 0,
    preferredMissionTypes: ['review', 'testimonial'],
    tags: ['empresario', 'review-focused'],
  },
  {
    promoterId: 'cliente_004',
    promoterName: 'Pedro Sánchez',
    brandKit: {
      colorPalette: ['#10B981', '#3B82F6'],
    },
    personalizedBio: 'Atleta amateur en busca de superar mis límites. Cada día es una oportunidad de mejorar.',
    socialHandles: [
      { platform: 'instagram', handle: 'pedro_sanchez_fit', verified: false },
    ],
    missionHistory: MOCK_PROMOTER_MISSIONS.filter((m) => m.promoterId === 'cliente_004'),
    totalMissionsCompleted: 0,
    totalMissionsAssigned: 1,
    averagePerformanceScore: 0,
    preferredMissionTypes: ['reel', 'story', 'testimonial'],
    tags: ['atleta', 'contenido-visual'],
  },
];

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export const PromoterMissionsAPI = {
  async getMissions(): Promise<PromoterMission[]> {
    await delay(200);
    return MOCK_PROMOTER_MISSIONS;
  },

  async getPromoterBrandings(): Promise<PromoterBranding[]> {
    await delay(200);
    return MOCK_PROMOTER_BRANDINGS;
  },

  async createMission(
    promoterId: string,
    missionType: MissionType,
    missionData: Partial<PromoterMission>,
  ): Promise<PromoterMission> {
    await delay(300);
    return {
      id: `mission_${Date.now()}`,
      promoterId,
      promoterName: 'Nuevo Promotor',
      type: missionType,
      title: missionData.title || 'Nueva Misión',
      description: missionData.description || '',
      instructions: missionData.instructions || '',
      status: 'pending',
      priority: missionData.priority || 'medium',
      assignedAt: new Date().toISOString(),
      dueDate: missionData.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    };
  },

  async assignMission(missionId: string, promoterId: string): Promise<PromoterMission> {
    await delay(300);
    const mission = MOCK_PROMOTER_MISSIONS.find((m) => m.id === missionId);
    if (!mission) throw new Error('Mission not found');
    return {
      ...mission,
      promoterId,
      status: 'assigned',
    };
  },

  async updateMissionStatus(missionId: string, status: MissionStatus): Promise<PromoterMission> {
    await delay(300);
    const mission = MOCK_PROMOTER_MISSIONS.find((m) => m.id === missionId);
    if (!mission) throw new Error('Mission not found');
    return {
      ...mission,
      status,
      updatedAt: new Date().toISOString(),
    };
  },

  async reviewMission(
    missionId: string,
    approved: boolean,
    feedback?: string,
  ): Promise<PromoterMission> {
    await delay(300);
    const mission = MOCK_PROMOTER_MISSIONS.find((m) => m.id === missionId);
    if (!mission) throw new Error('Mission not found');
    return {
      ...mission,
      trainerFeedback: {
        rating: approved ? 5 : 2,
        comment: feedback,
        approved,
      },
      status: approved ? 'completed' : 'rejected',
      updatedAt: new Date().toISOString(),
    };
  },

  async brandPromoter(promoterId: string, branding: Partial<PromoterBranding>): Promise<PromoterBranding> {
    await delay(300);
    const existing = MOCK_PROMOTER_BRANDINGS.find((b) => b.promoterId === promoterId);
    if (existing) {
      return { ...existing, ...branding };
    }
    return {
      promoterId,
      promoterName: branding.promoterName || 'Nuevo Promotor',
      missionHistory: [],
      totalMissionsCompleted: 0,
      totalMissionsAssigned: 0,
      averagePerformanceScore: 0,
      preferredMissionTypes: [],
      tags: [],
      ...branding,
    };
  },
};

