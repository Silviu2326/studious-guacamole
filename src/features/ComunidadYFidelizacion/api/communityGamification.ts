import {
  CommunityGamificationConfig,
  CommunityBadge,
  ClientBadge,
  CommunityChallenge,
  Recognition,
  CommunityVoiceConfig,
} from '../types';
import { CommunityVoiceAPI } from './communityVoice';

// Mock data para gamificación
const MOCK_GAMIFICATION_CONFIG: CommunityGamificationConfig = {
  id: 'gamification_config_001',
  trainerId: 'trainer_001',
  enabled: true,
  badges: {
    enabled: true,
    autoAward: true,
    personalizeMessages: true,
    publishInCommunity: true,
  },
  challenges: {
    enabled: true,
    autoCreate: true,
    frequency: 'monthly',
    minAlignmentScore: 70,
  },
  recognitions: {
    enabled: true,
    autoGenerate: true,
    channels: ['community', 'email', 'whatsapp'],
    personalizeMessages: true,
  },
  useTrainerValues: true,
  stats: {
    totalBadgesAwarded: 145,
    totalChallengesCreated: 8,
    totalRecognitionsSent: 89,
    engagementIncrease: 23,
  },
  createdAt: '2025-09-01T00:00:00Z',
  updatedAt: '2025-10-15T10:00:00Z',
};

const MOCK_BADGES: CommunityBadge[] = [
  {
    id: 'badge_001',
    name: 'Guerrero de la Disciplina',
    description: 'Completa 30 sesiones consecutivas demostrando disciplina y compromiso',
    icon: 'Trophy',
    color: 'gold',
    category: 'valores',
    rarity: 'epico',
    requirements: {
      type: 'dias-consecutivos',
      value: 30,
      conditions: ['sesiones-completadas', 'asistencia-perfecta'],
    },
    adaptedToValues: {
      trainerValues: ['Disciplina', 'Progreso constante'],
      personalizedMessage: '¡Tu disciplina es inspiradora! Has demostrado que el progreso constante es la clave del éxito.',
      alignmentScore: 95,
    },
    aiGenerated: true,
    aiMetadata: {
      generatedAt: '2025-10-01T10:00:00Z',
      reasoning: 'Badge creado para premiar la disciplina, valor clave del entrenador',
      valueAlignment: ['Disciplina', 'Progreso constante'],
    },
    isActive: true,
    createdAt: '2025-10-01T10:00:00Z',
  },
  {
    id: 'badge_002',
    name: 'Embajador de la Comunidad',
    description: 'Demuestra apoyo mutuo ayudando a 5 miembros de la comunidad',
    icon: 'HeartHandshake',
    color: 'purple',
    category: 'comunidad',
    rarity: 'raro',
    requirements: {
      type: 'participacion-comunidad',
      value: 5,
      conditions: ['ayuda-a-miembros', 'compartir-conocimiento'],
    },
    adaptedToValues: {
      trainerValues: ['Apoyo mutuo', 'Autenticidad'],
      personalizedMessage: '¡Eres un verdadero embajador! Tu apoyo a la comunidad refleja nuestros valores de ayuda mutua.',
      alignmentScore: 90,
    },
    aiGenerated: true,
    aiMetadata: {
      generatedAt: '2025-10-01T10:00:00Z',
      reasoning: 'Badge creado para premiar el apoyo mutuo, valor clave del entrenador',
      valueAlignment: ['Apoyo mutuo', 'Autenticidad'],
    },
    isActive: true,
    createdAt: '2025-10-01T10:00:00Z',
  },
  {
    id: 'badge_003',
    name: 'Transformación Auténtica',
    description: 'Alcanza tu objetivo principal y comparte tu historia de transformación',
    icon: 'Sparkles',
    color: 'indigo',
    category: 'valores',
    rarity: 'legendario',
    requirements: {
      type: 'objetivo-alcanzado',
      value: 1,
      conditions: ['testimonio-compartido', 'transformacion-documentada'],
    },
    adaptedToValues: {
      trainerValues: ['Autenticidad', 'Progreso constante'],
      personalizedMessage: '¡Tu transformación es auténtica e inspiradora! Has demostrado que el progreso constante lleva al éxito.',
      alignmentScore: 98,
    },
    aiGenerated: true,
    aiMetadata: {
      generatedAt: '2025-10-01T10:00:00Z',
      reasoning: 'Badge creado para premiar transformaciones auténticas, valor clave del entrenador',
      valueAlignment: ['Autenticidad', 'Progreso constante'],
    },
    isActive: true,
    createdAt: '2025-10-01T10:00:00Z',
  },
];

const MOCK_CLIENT_BADGES: ClientBadge[] = [
  {
    id: 'client_badge_001',
    badgeId: 'badge_001',
    clientId: 'cliente_001',
    clientName: 'Laura Méndez',
    badge: MOCK_BADGES[0],
    earnedAt: '2025-10-10T10:00:00Z',
    recognitionMessage: '¡Felicidades Laura! Has completado 30 días consecutivos de entrenamiento. Tu disciplina es inspiradora y refleja nuestros valores de progreso constante. 💪🏆',
    earnedContext: {
      achievement: '30 sesiones consecutivas completadas',
      milestone: 'Mes completo de disciplina',
    },
    notified: true,
    notifiedAt: '2025-10-10T10:05:00Z',
    published: true,
    publishedAt: '2025-10-10T10:10:00Z',
  },
];

const MOCK_CHALLENGES: CommunityChallenge[] = [
  {
    id: 'challenge_001',
    title: 'Reto de Disciplina: 21 Días de Transformación',
    description: 'Únete a nuestro reto de 21 días donde demostrarás disciplina y compromiso con tu transformación. Cada día cuenta, cada sesión importa.',
    type: 'transformacion',
    difficulty: 'intermedio',
    duration: 21,
    startDate: '2025-10-20T00:00:00Z',
    endDate: '2025-11-10T00:00:00Z',
    objectives: [
      'Completar 21 sesiones en 21 días',
      'Mantener disciplina y consistencia',
      'Compartir progreso en la comunidad',
    ],
    requirements: [
      {
        type: 'sesiones-completadas',
        target: 21,
        description: 'Completar 21 sesiones en 21 días',
      },
      {
        type: 'dias-consecutivos',
        target: 21,
        description: 'Mantener consistencia diaria',
      },
    ],
    rewards: {
      badges: ['badge_001'],
      rewards: [
        {
          type: 'descuento',
          description: '20% de descuento en el próximo mes',
          value: 20,
        },
      ],
    },
    adaptedToValues: {
      trainerValues: ['Disciplina', 'Progreso constante'],
      personalizedDescription: 'Este reto refleja nuestros valores de disciplina y progreso constante. Cada día es una oportunidad para crecer y mejorar.',
      alignmentScore: 92,
    },
    participants: [
      {
        clientId: 'cliente_001',
        clientName: 'Laura Méndez',
        joinedAt: '2025-10-20T08:00:00Z',
        progress: 65,
        status: 'active',
      },
      {
        clientId: 'cliente_002',
        clientName: 'Carlos Ortega',
        joinedAt: '2025-10-20T09:00:00Z',
        progress: 80,
        status: 'active',
      },
    ],
    status: 'active',
    aiGenerated: true,
    aiMetadata: {
      generatedAt: '2025-10-15T10:00:00Z',
      reasoning: 'Reto creado para promover disciplina y progreso constante, valores clave del entrenador',
      valueAlignment: ['Disciplina', 'Progreso constante'],
      estimatedEngagement: 85,
    },
    metrics: {
      totalParticipants: 24,
      completionRate: 0,
      averageProgress: 72,
      engagementScore: 85,
    },
    createdAt: '2025-10-15T10:00:00Z',
  },
];

const MOCK_RECOGNITIONS: Recognition[] = [
  {
    id: 'recognition_001',
    type: 'badge',
    clientId: 'cliente_001',
    clientName: 'Laura Méndez',
    title: '¡Laura ha ganado el badge "Guerrero de la Disciplina"!',
    message: '¡Felicidades Laura! Has completado 30 días consecutivos de entrenamiento. Tu disciplina es inspiradora y refleja nuestros valores de progreso constante. 💪🏆',
    badgeId: 'badge_001',
    badge: MOCK_BADGES[0],
    adaptedToValues: {
      trainerValues: ['Disciplina', 'Progreso constante'],
      personalizedTone: 'motivacional',
      keywords: ['disciplina', 'progreso', 'inspiración'],
      emojis: ['💪', '🏆', '✨'],
    },
    aiGenerated: true,
    aiMetadata: {
      generatedAt: '2025-10-10T10:00:00Z',
      reasoning: 'Reconocimiento generado automáticamente al ganar badge de disciplina',
      valueAlignment: ['Disciplina', 'Progreso constante'],
    },
    channels: ['community', 'email', 'whatsapp'],
    status: 'published',
    sentAt: '2025-10-10T10:05:00Z',
    publishedAt: '2025-10-10T10:10:00Z',
    metrics: {
      views: 156,
      likes: 42,
      shares: 8,
      comments: 12,
    },
    createdAt: '2025-10-10T10:00:00Z',
  },
];

// Función para obtener valores del entrenador
async function getTrainerValues(): Promise<string[]> {
  const voiceConfig = await CommunityVoiceAPI.getConfig();
  return voiceConfig?.values || ['Disciplina', 'Apoyo mutuo', 'Progreso constante'];
}

// Función para calcular alineación con valores
function calculateValueAlignment(
  item: { name?: string; description?: string; title?: string },
  trainerValues: string[]
): number {
  const text = `${item.name || ''} ${item.description || ''} ${item.title || ''}`.toLowerCase();
  let matches = 0;
  trainerValues.forEach((value) => {
    if (text.includes(value.toLowerCase())) {
      matches++;
    }
  });
  return Math.min(100, (matches / trainerValues.length) * 100);
}

export const CommunityGamificationAPI = {
  async getConfig(trainerId?: string): Promise<CommunityGamificationConfig | null> {
    await delay(200);
    return cloneData(MOCK_GAMIFICATION_CONFIG);
  },

  async saveConfig(config: Partial<CommunityGamificationConfig>): Promise<CommunityGamificationConfig> {
    await delay(300);
    const updated = {
      ...MOCK_GAMIFICATION_CONFIG,
      ...config,
      updatedAt: new Date().toISOString(),
    };
    return cloneData(updated);
  },

  async getBadges(): Promise<CommunityBadge[]> {
    await delay(200);
    return cloneData(MOCK_BADGES);
  },

  async createBadge(badge: Omit<CommunityBadge, 'id' | 'createdAt'>): Promise<CommunityBadge> {
    await delay(300);
    const trainerValues = await getTrainerValues();
    const alignmentScore = calculateValueAlignment(badge, trainerValues);

    const newBadge: CommunityBadge = {
      ...badge,
      id: `badge_${Date.now()}`,
      adaptedToValues: {
        trainerValues,
        alignmentScore,
        personalizedMessage: badge.adaptedToValues?.personalizedMessage,
      },
      aiGenerated: true,
      aiMetadata: {
        generatedAt: new Date().toISOString(),
        reasoning: `Badge creado para premiar ${badge.category}`,
        valueAlignment: trainerValues,
      },
      createdAt: new Date().toISOString(),
    };
    return cloneData(newBadge);
  },

  async getClientBadges(clientId?: string): Promise<ClientBadge[]> {
    await delay(200);
    if (clientId) {
      return cloneData(MOCK_CLIENT_BADGES.filter((cb) => cb.clientId === clientId));
    }
    return cloneData(MOCK_CLIENT_BADGES);
  },

  async awardBadge(clientId: string, clientName: string, badgeId: string): Promise<ClientBadge> {
    await delay(300);
    const badge = MOCK_BADGES.find((b) => b.id === badgeId);
    if (!badge) {
      throw new Error(`Badge ${badgeId} no encontrado`);
    }

    const trainerValues = await getTrainerValues();
    const recognitionMessage = badge.adaptedToValues?.personalizedMessage || `¡Felicidades ${clientName}! Has ganado el badge "${badge.name}".`;

    const newClientBadge: ClientBadge = {
      id: `client_badge_${Date.now()}`,
      badgeId,
      clientId,
      clientName,
      badge,
      earnedAt: new Date().toISOString(),
      recognitionMessage,
      notified: false,
      published: false,
    };
    return cloneData(newClientBadge);
  },

  async getChallenges(): Promise<CommunityChallenge[]> {
    await delay(200);
    return cloneData(MOCK_CHALLENGES);
  },

  async createChallenge(challenge: Omit<CommunityChallenge, 'id' | 'createdAt'>): Promise<CommunityChallenge> {
    await delay(300);
    const trainerValues = await getTrainerValues();
    const alignmentScore = calculateValueAlignment(challenge, trainerValues);

    const newChallenge: CommunityChallenge = {
      ...challenge,
      id: `challenge_${Date.now()}`,
      adaptedToValues: {
        trainerValues,
        alignmentScore,
        personalizedDescription: challenge.adaptedToValues?.personalizedDescription,
      },
      aiGenerated: true,
      aiMetadata: {
        generatedAt: new Date().toISOString(),
        reasoning: `Reto creado para promover ${challenge.type}`,
        valueAlignment: trainerValues,
        estimatedEngagement: 75,
      },
      participants: [],
      createdAt: new Date().toISOString(),
    };
    return cloneData(newChallenge);
  },

  async joinChallenge(challengeId: string, clientId: string, clientName: string): Promise<CommunityChallenge> {
    await delay(200);
    const challenge = MOCK_CHALLENGES.find((c) => c.id === challengeId);
    if (!challenge) {
      throw new Error(`Challenge ${challengeId} no encontrado`);
    }

    const updatedChallenge = {
      ...challenge,
      participants: [
        ...challenge.participants,
        {
          clientId,
          clientName,
          joinedAt: new Date().toISOString(),
          progress: 0,
          status: 'active' as const,
        },
      ],
    };
    return cloneData(updatedChallenge);
  },

  async getRecognitions(clientId?: string): Promise<Recognition[]> {
    await delay(200);
    if (clientId) {
      return cloneData(MOCK_RECOGNITIONS.filter((r) => r.clientId === clientId));
    }
    return cloneData(MOCK_RECOGNITIONS);
  },

  async createRecognition(recognition: Omit<Recognition, 'id' | 'createdAt'>): Promise<Recognition> {
    await delay(300);
    const trainerValues = await getTrainerValues();
    const alignmentScore = calculateValueAlignment(recognition, trainerValues);

    const newRecognition: Recognition = {
      ...recognition,
      id: `recognition_${Date.now()}`,
      adaptedToValues: {
        trainerValues,
        personalizedTone: recognition.adaptedToValues?.personalizedTone || 'motivacional',
        keywords: recognition.adaptedToValues?.keywords || [],
        emojis: recognition.adaptedToValues?.emojis || [],
      },
      aiGenerated: true,
      aiMetadata: {
        generatedAt: new Date().toISOString(),
        reasoning: 'Reconocimiento generado automáticamente',
        valueAlignment: trainerValues,
      },
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    return cloneData(newRecognition);
  },

  async generateAIBadges(count: number = 3): Promise<CommunityBadge[]> {
    await delay(500);
    const trainerValues = await getTrainerValues();
    const badgeTemplates = [
      {
        name: `Campeón de ${trainerValues[0]}`,
        description: `Demuestra ${trainerValues[0].toLowerCase()} completando 20 sesiones`,
        category: 'valores' as const,
        rarity: 'raro' as const,
        requirements: { type: 'sesiones-completadas' as const, value: 20 },
      },
      {
        name: `Embajador de ${trainerValues[1]}`,
        description: `Demuestra ${trainerValues[1].toLowerCase()} ayudando a la comunidad`,
        category: 'comunidad' as const,
        rarity: 'epico' as const,
        requirements: { type: 'participacion-comunidad' as const, value: 5 },
      },
    ];

    const generatedBadges: CommunityBadge[] = badgeTemplates.slice(0, count).map((template, index) => ({
      id: `badge_ai_${Date.now()}_${index}`,
      name: template.name,
      description: template.description,
      icon: 'Trophy',
      color: 'gold',
      category: template.category,
      rarity: template.rarity,
      requirements: template.requirements,
      adaptedToValues: {
        trainerValues,
        alignmentScore: 95,
        personalizedMessage: `¡Has demostrado ${trainerValues[index % trainerValues.length].toLowerCase()}!`,
      },
      aiGenerated: true,
      aiMetadata: {
        generatedAt: new Date().toISOString(),
        reasoning: `Badge generado para promover ${trainerValues[index % trainerValues.length]}`,
        valueAlignment: trainerValues,
      },
      isActive: true,
      createdAt: new Date().toISOString(),
    }));

    return cloneData(generatedBadges);
  },

  async generateAIChallenges(count: number = 2): Promise<CommunityChallenge[]> {
    await delay(500);
    const trainerValues = await getTrainerValues();
    const challengeTemplates = [
      {
        title: `Reto de ${trainerValues[0]}: 21 Días`,
        description: `Demuestra ${trainerValues[0].toLowerCase()} completando 21 días de entrenamiento`,
        type: 'transformacion' as const,
        difficulty: 'intermedio' as const,
        duration: 21,
        objectives: [`Completar 21 sesiones`, `Demostrar ${trainerValues[0].toLowerCase()}`],
        requirements: [
          { type: 'sesiones-completadas' as const, target: 21, description: '21 sesiones en 21 días' },
        ],
      },
    ];

    const generatedChallenges: CommunityChallenge[] = challengeTemplates.slice(0, count).map((template, index) => ({
      id: `challenge_ai_${Date.now()}_${index}`,
      title: template.title,
      description: template.description,
      type: template.type,
      difficulty: template.difficulty,
      duration: template.duration,
      objectives: template.objectives,
      requirements: template.requirements,
      rewards: {
        badges: [],
        rewards: [],
      },
      adaptedToValues: {
        trainerValues,
        alignmentScore: 92,
        personalizedDescription: `Este reto refleja nuestro valor de ${trainerValues[0].toLowerCase()}`,
      },
      participants: [],
      status: 'draft' as const,
      aiGenerated: true,
      aiMetadata: {
        generatedAt: new Date().toISOString(),
        reasoning: `Reto generado para promover ${trainerValues[0]}`,
        valueAlignment: trainerValues,
        estimatedEngagement: 80,
      },
      createdAt: new Date().toISOString(),
    }));

    return cloneData(generatedChallenges);
  },
};

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function cloneData<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value)) as T;
}

