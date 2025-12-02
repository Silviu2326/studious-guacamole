import {
  AIPlaybook,
  AIPlaybookSuggestion,
  AIPlaybookChallenge,
  AIPlaybookEvent,
  TrainerStyle,
  CalendarConstraint,
  SuggestionStatus,
  ChallengeType,
  EventType,
} from '../types';
import { CommunityVoiceConfig } from '../types';

// Mock data para el AI Playbook
const MOCK_PLAYBOOK: AIPlaybook = {
  id: 'playbook_001',
  trainerId: 'trainer_001',
  enabled: true,
  trainerStyle: {
    values: ['Disciplina', 'Apoyo mutuo', 'Progreso constante'],
    tone: 'Motivacional pero cercano',
    preferredEmojis: ['💪', '🔥', '✨', '🎯', '🏆'],
    keywords: ['transformación', 'progreso', 'comunidad'],
    recognitionStyle: 'motivacional',
  },
  calendarConstraints: {
    preferredDays: ['lunes', 'miércoles', 'viernes'],
    preferredTimes: ['09:00', '18:00', '19:00'],
    blackoutDates: [],
    maxDuration: 3,
  },
  preferences: {
    challengeTypes: ['fitness', 'nutricion', 'transformacion'],
    eventTypes: ['workshop', 'masterclass', 'celebracion'],
    frequency: 'monthly',
    minAlignmentScore: 70,
    autoAccept: false,
  },
  stats: {
    totalSuggestions: 12,
    acceptedSuggestions: 8,
    completedChallenges: 5,
    completedEvents: 3,
    averageEngagement: 78,
    averageImpact: 82,
  },
  lastAnalysis: '2025-10-15T10:00:00Z',
  createdAt: '2025-09-01T00:00:00Z',
  updatedAt: '2025-10-15T10:00:00Z',
};

const MOCK_SUGGESTIONS: AIPlaybookSuggestion[] = [
  {
    id: 'suggestion_001',
    type: 'challenge',
    challenge: {
      id: 'challenge_001',
      title: 'Reto de Transformación 30 Días',
      description: 'Un reto completo de 30 días enfocado en transformación física y mental, alineado con tus valores de disciplina y progreso constante.',
      type: 'transformacion',
      duration: 30,
      difficulty: 'intermedio',
      targetAudience: ['regular', 'vip'],
      objectives: [
        'Establecer hábitos consistentes de entrenamiento',
        'Mejorar la nutrición diaria',
        'Fortalecer la mentalidad de progreso',
      ],
      suggestedActivities: [
        'Check-in diario de entrenamiento',
        'Desafíos semanales de nutrición',
        'Sesiones grupales de motivación',
      ],
      rewards: {
        type: 'sesion-gratis',
        description: 'Sesión personalizada gratis al completar el reto',
      },
      communityEngagement: {
        hashtag: '#RetoTransformacion30',
        groupActivity: 'Grupo de WhatsApp para compartir progreso',
        sharingPrompt: 'Comparte tu progreso diario con la comunidad',
      },
      estimatedEngagement: 85,
      estimatedImpact: 90,
    },
    priority: 'high',
    status: 'pending',
    reasoning: 'Este reto está perfectamente alineado con tu estilo motivacional y valores de transformación. El calendario permite una duración de 30 días sin conflictos.',
    alignmentScore: 92,
    calendarFit: 88,
    communityFit: 85,
    suggestedBy: 'ai',
    suggestedAt: '2025-10-15T10:00:00Z',
  },
  {
    id: 'suggestion_002',
    type: 'event',
    event: {
      id: 'event_001',
      title: 'Workshop de Nutrición y Bienestar',
      description: 'Un workshop interactivo sobre nutrición y bienestar, perfecto para fortalecer la comunidad y compartir conocimiento.',
      type: 'workshop',
      duration: 2,
      suggestedDate: '2025-11-05',
      suggestedTime: '18:00',
      location: {
        type: 'hibrido',
        address: 'Tu estudio de entrenamiento',
        platform: 'Zoom',
      },
      targetAudience: ['nuevo', 'regular', 'vip'],
      agenda: [
        {
          time: '18:00',
          activity: 'Bienvenida y presentación',
          description: 'Introducción al workshop',
        },
        {
          time: '18:15',
          activity: 'Fundamentos de nutrición',
          description: 'Principios básicos de alimentación saludable',
        },
        {
          time: '19:00',
          activity: 'Planificación de comidas',
          description: 'Cómo planificar comidas semanales',
        },
        {
          time: '19:45',
          activity: 'Q&A y cierre',
          description: 'Preguntas y respuestas',
        },
      ],
      objectives: [
        'Educar sobre nutrición básica',
        'Fortalecer la comunidad',
        'Proporcionar herramientas prácticas',
      ],
      communityEngagement: {
        hashtag: '#WorkshopNutricion',
        liveStreaming: true,
        recording: true,
        followUpActivity: 'Grupo de seguimiento de nutrición',
      },
      estimatedAttendance: 45,
      estimatedImpact: 80,
    },
    priority: 'medium',
    status: 'pending',
    reasoning: 'Este evento encaja perfectamente en tu calendario (miércoles 18:00) y complementa tu enfoque en transformación integral. La duración de 2 horas es ideal.',
    alignmentScore: 85,
    calendarFit: 90,
    communityFit: 82,
    suggestedBy: 'ai',
    suggestedAt: '2025-10-15T10:00:00Z',
  },
  {
    id: 'suggestion_003',
    type: 'challenge',
    challenge: {
      id: 'challenge_002',
      title: 'Reto de Fuerza 21 Días',
      description: 'Un reto enfocado en ganancia de fuerza, perfecto para clientes intermedios y avanzados.',
      type: 'fitness',
      duration: 21,
      difficulty: 'avanzado',
      targetAudience: ['vip', 'embajador'],
      objectives: [
        'Aumentar la fuerza en ejercicios clave',
        'Mejorar la técnica de levantamiento',
        'Construir confianza en el entrenamiento',
      ],
      suggestedActivities: [
        'Test de fuerza inicial y final',
        'Sesiones de técnica semanales',
        'Tracking de progreso diario',
      ],
      rewards: {
        type: 'descuento',
        description: '20% de descuento en el próximo paquete',
      },
      communityEngagement: {
        hashtag: '#RetoFuerza21',
        groupActivity: 'Competencia amigable de progreso',
        sharingPrompt: 'Comparte tus PRs y logros',
      },
      estimatedEngagement: 70,
      estimatedImpact: 75,
    },
    priority: 'medium',
    status: 'accepted',
    reasoning: 'Este reto está bien alineado con tu enfoque en progreso constante. La duración de 21 días es manejable y el target audience es apropiado.',
    alignmentScore: 78,
    calendarFit: 85,
    communityFit: 72,
    suggestedBy: 'ai',
    suggestedAt: '2025-10-10T10:00:00Z',
    acceptedAt: '2025-10-12T14:00:00Z',
    scheduledFor: '2025-11-01',
  },
];

export const AIPlaybookAPI = {
  async getPlaybook(trainerId?: string): Promise<AIPlaybook | null> {
    await delay(200);
    return cloneData(MOCK_PLAYBOOK);
  },

  async updatePlaybook(updates: Partial<AIPlaybook>): Promise<AIPlaybook> {
    await delay(300);
    const updated = {
      ...MOCK_PLAYBOOK,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return cloneData(updated);
  },

  async getSuggestions(playbookId: string): Promise<AIPlaybookSuggestion[]> {
    await delay(200);
    return cloneData(MOCK_SUGGESTIONS);
  },

  async generateSuggestions(
    playbookId: string,
    voiceConfig?: CommunityVoiceConfig,
    calendarConstraints?: CalendarConstraint,
  ): Promise<AIPlaybookSuggestion[]> {
    await delay(500);
    // Simulación de generación de sugerencias basadas en estilo y calendario
    return cloneData(MOCK_SUGGESTIONS);
  },

  async acceptSuggestion(suggestionId: string, scheduledFor?: string): Promise<AIPlaybookSuggestion> {
    await delay(200);
    const suggestion = MOCK_SUGGESTIONS.find((s) => s.id === suggestionId);
    if (!suggestion) {
      throw new Error(`Sugerencia ${suggestionId} no encontrada`);
    }
    const updated: AIPlaybookSuggestion = {
      ...suggestion,
      status: 'accepted',
      acceptedAt: new Date().toISOString(),
      scheduledFor: scheduledFor || suggestion.scheduledFor,
    };
    return cloneData(updated);
  },

  async rejectSuggestion(suggestionId: string, reason?: string): Promise<AIPlaybookSuggestion> {
    await delay(200);
    const suggestion = MOCK_SUGGESTIONS.find((s) => s.id === suggestionId);
    if (!suggestion) {
      throw new Error(`Sugerencia ${suggestionId} no encontrada`);
    }
    const updated: AIPlaybookSuggestion = {
      ...suggestion,
      status: 'rejected',
      rejectedAt: new Date().toISOString(),
      rejectionReason: reason,
    };
    return cloneData(updated);
  },

  async updateSuggestionStatus(
    suggestionId: string,
    status: SuggestionStatus,
    scheduledFor?: string,
  ): Promise<AIPlaybookSuggestion> {
    await delay(200);
    const suggestion = MOCK_SUGGESTIONS.find((s) => s.id === suggestionId);
    if (!suggestion) {
      throw new Error(`Sugerencia ${suggestionId} no encontrada`);
    }
    const updated: AIPlaybookSuggestion = {
      ...suggestion,
      status,
      scheduledFor: scheduledFor || suggestion.scheduledFor,
      updatedAt: new Date().toISOString(),
    };
    if (status === 'accepted' && !suggestion.acceptedAt) {
      updated.acceptedAt = new Date().toISOString();
    }
    if (status === 'completed' && !suggestion.completedAt) {
      updated.completedAt = new Date().toISOString();
    }
    return cloneData(updated);
  },

  async analyzeStyleAndCalendar(
    voiceConfig: CommunityVoiceConfig,
    calendarConstraints: CalendarConstraint,
  ): Promise<{ alignmentScore: number; recommendations: string[] }> {
    await delay(400);
    return {
      alignmentScore: 88,
      recommendations: [
        'Tu estilo motivacional se alinea perfectamente con retos de transformación',
        'Los miércoles a las 18:00 son ideales para eventos comunitarios',
        'Considera retos de 21-30 días para máximo engagement',
      ],
    };
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

