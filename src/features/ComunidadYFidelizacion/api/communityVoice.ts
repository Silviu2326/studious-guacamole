import { CommunityVoiceConfig, CommunityRitual } from '../types';

// Mock data para la configuración de voz de comunidad
const MOCK_VOICE_CONFIG: CommunityVoiceConfig = {
  id: 'voice_config_001',
  trainerId: 'trainer_001',
  values: ['Disciplina', 'Apoyo mutuo', 'Progreso constante', 'Autenticidad'],
  tone: 'Motivacional pero cercano, con un toque de celebración en los logros',
  recognitionStyle: 'motivacional',
  preferredEmojis: ['💪', '🔥', '✨', '🎯', '🏆'],
  keywords: ['transformación', 'progreso', 'comunidad', 'disciplina', 'éxito'],
  rituals: [
    {
      id: 'ritual_001',
      type: 'bienvenida',
      name: 'Bienvenida a nuevos miembros',
      description: 'Mensaje de bienvenida personalizado para nuevos clientes',
      trigger: 'Primera sesión completada',
      message: '¡Bienvenido/a a nuestra comunidad! 💪 Estamos emocionados de acompañarte en tu transformación. Recuerda: cada paso cuenta.',
      emojis: ['💪', '✨', '🎯'],
      isActive: true,
    },
    {
      id: 'ritual_002',
      type: 'hito',
      name: 'Celebración de objetivos alcanzados',
      description: 'Reconocimiento cuando un cliente alcanza un objetivo importante',
      trigger: 'Objetivo alcanzado',
      message: '¡Increíble! 🏆 Has alcanzado tu objetivo. Tu dedicación y disciplina son inspiradoras. ¡Sigamos adelante!',
      emojis: ['🏆', '🔥', '✨'],
      isActive: true,
    },
    {
      id: 'ritual_003',
      type: 'reconocimiento',
      name: 'Reconocimiento semanal',
      description: 'Reconocimiento para clientes con asistencia perfecta',
      trigger: 'Asistencia perfecta en la semana',
      message: '¡Asistencia perfecta esta semana! 💪 Tu compromiso es admirable. ¡Sigue así!',
      emojis: ['💪', '✨'],
      isActive: true,
    },
  ],
  createdAt: '2025-09-01T00:00:00Z',
  updatedAt: '2025-10-15T10:00:00Z',
};

export const CommunityVoiceAPI = {
  async getConfig(trainerId?: string): Promise<CommunityVoiceConfig | null> {
    await delay(200);
    return cloneData(MOCK_VOICE_CONFIG);
  },

  async saveConfig(config: Partial<CommunityVoiceConfig>): Promise<CommunityVoiceConfig> {
    await delay(300);
    const updated = {
      ...MOCK_VOICE_CONFIG,
      ...config,
      updatedAt: new Date().toISOString(),
    };
    return cloneData(updated);
  },

  async addRitual(ritual: Omit<CommunityRitual, 'id'>): Promise<CommunityRitual> {
    await delay(200);
    const newRitual: CommunityRitual = {
      ...ritual,
      id: `ritual_${Date.now()}`,
    };
    return cloneData(newRitual);
  },

  async updateRitual(ritualId: string, updates: Partial<CommunityRitual>): Promise<CommunityRitual> {
    await delay(200);
    const ritual = MOCK_VOICE_CONFIG.rituals.find((r) => r.id === ritualId);
    if (!ritual) {
      throw new Error(`Ritual ${ritualId} no encontrado`);
    }
    return cloneData({ ...ritual, ...updates });
  },

  async deleteRitual(ritualId: string): Promise<void> {
    await delay(200);
    // Simulación de eliminación
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

