import { AIReferralProgram, SegmentBasedReward, CustomerSegmentType } from '../types';

// Mock data para programas de referidos IA
const MOCK_AI_REFERRAL_PROGRAM: AIReferralProgram = {
  id: 'ai_ref_prog_001',
  name: 'Programa de Referidos IA - Crecimiento Orgánico',
  description:
    'Programa inteligente que adapta recompensas y mensajes según el segmento de cada cliente para maximizar conversiones.',
  reward: {
    id: 'reward_default',
    type: 'sesion-gratis',
    name: 'Sesión Gratis',
    description: 'Una sesión de entrenamiento personal gratis',
    value: 1,
    isActive: true,
    createdAt: '2025-09-01T00:00:00Z',
  },
  defaultReward: {
    id: 'reward_default',
    type: 'sesion-gratis',
    name: 'Sesión Gratis',
    description: 'Una sesión de entrenamiento personal gratis',
    value: 1,
    isActive: true,
    createdAt: '2025-09-01T00:00:00Z',
  },
  isActive: true,
  isAIEnabled: true,
  autoAdaptEnabled: true,
  createdAt: '2025-09-01T00:00:00Z',
  updatedAt: '2025-10-15T10:00:00Z',
  totalReferrals: 45,
  convertedReferrals: 28,
  totalRewardsGiven: 25,
  lastAIAnalysis: '2025-10-15T08:00:00Z',
  segmentBasedRewards: [
    {
      segmentType: 'embajador',
      reward: {
        id: 'reward_embajador',
        type: 'bono',
        name: 'Bono Especial Embajador',
        description: 'Bono de $50 para embajadores',
        value: 50,
        currency: 'USD',
        isActive: true,
        createdAt: '2025-09-15T00:00:00Z',
      },
      message:
        '¡Hola {nombre}! Como embajador de nuestra comunidad, queremos recompensarte especialmente. Por cada amigo que traigas, recibirás $50 y ellos también obtendrán beneficios exclusivos. ¡Comparte tu experiencia y ayuda a otros a transformarse!',
      aiGenerated: true,
      performance: {
        conversionRate: 68.5,
        referralsCount: 12,
        avgTimeToConvert: 5.2,
      },
    },
    {
      segmentType: 'vip',
      reward: {
        id: 'reward_vip',
        type: 'sesion-gratis',
        name: 'Sesión Premium VIP',
        description: '2 sesiones premium gratis',
        value: 2,
        isActive: true,
        createdAt: '2025-09-15T00:00:00Z',
      },
      message:
        'Estimado {nombre}, como cliente VIP valoramos tu lealtad. Por cada referido que se una, ambos recibirán 2 sesiones premium gratis. ¡Comparte los beneficios de ser parte de nuestra comunidad exclusiva!',
      aiGenerated: true,
      performance: {
        conversionRate: 55.0,
        referralsCount: 8,
        avgTimeToConvert: 7.1,
      },
    },
    {
      segmentType: 'regular',
      reward: {
        id: 'reward_regular',
        type: 'descuento',
        name: 'Descuento Regular',
        description: '20% de descuento en el próximo mes',
        value: 20,
        isActive: true,
        createdAt: '2025-09-15T00:00:00Z',
      },
      message:
        '¡Hola {nombre}! Sabemos que estás disfrutando de tu experiencia. Por cada amigo que invites, ambos recibirán un 20% de descuento. ¡Es el momento perfecto para compartir tu progreso!',
      aiGenerated: true,
      performance: {
        conversionRate: 42.3,
        referralsCount: 15,
        avgTimeToConvert: 9.5,
      },
    },
    {
      segmentType: 'nuevo',
      reward: {
        id: 'reward_nuevo',
        type: 'sesion-gratis',
        name: 'Sesión Gratis Nuevo',
        description: '1 sesión gratis para nuevos clientes',
        value: 1,
        isActive: true,
        createdAt: '2025-09-15T00:00:00Z',
      },
      message:
        '¡Bienvenido {nombre}! Estamos emocionados de tenerte. Si invitas a un amigo en tus primeros 30 días, ambos recibirán una sesión gratis. ¡Comparte tu nueva aventura fitness!',
      aiGenerated: true,
      performance: {
        conversionRate: 38.7,
        referralsCount: 10,
        avgTimeToConvert: 12.3,
      },
    },
  ],
  aiMessageTemplates: [
    {
      segmentType: 'embajador',
      template:
        '¡Hola {nombre}! Como embajador, queremos recompensarte especialmente. Por cada amigo que traigas, recibirás {recompensa}. ¡Comparte tu experiencia!',
      variables: ['nombre', 'recompensa', 'objetivo'],
    },
    {
      segmentType: 'vip',
      template:
        'Estimado {nombre}, como cliente VIP valoramos tu lealtad. Por cada referido, ambos recibirán {recompensa}. ¡Comparte los beneficios!',
      variables: ['nombre', 'recompensa'],
    },
  ],
  aiInsights: {
    bestPerformingSegment: 'embajador',
    recommendedAdjustments: [
      'Aumentar recompensa para segmento "regular" para mejorar tasa de conversión',
      'Personalizar mensajes para segmento "nuevo" con más urgencia',
      'Crear campaña especial para embajadores durante temporada alta',
    ],
    conversionPredictions: [
      { segmentType: 'embajador', predictedConversionRate: 72.0 },
      { segmentType: 'vip', predictedConversionRate: 58.5 },
      { segmentType: 'regular', predictedConversionRate: 45.0 },
      { segmentType: 'nuevo', predictedConversionRate: 40.0 },
      { segmentType: 'riesgo', predictedConversionRate: 25.0 },
    ],
  },
};

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export const AIReferralProgramAPI = {
  async getAIReferralProgram(): Promise<AIReferralProgram | null> {
    await delay(200);
    return MOCK_AI_REFERRAL_PROGRAM;
  },

  async enableAI(programId: string): Promise<AIReferralProgram> {
    await delay(300);
    return {
      ...MOCK_AI_REFERRAL_PROGRAM,
      id: programId,
      isAIEnabled: true,
    };
  },

  async generateSegmentRewards(programId: string): Promise<SegmentBasedReward[]> {
    await delay(500);
    return MOCK_AI_REFERRAL_PROGRAM.segmentBasedRewards || [];
  },

  async analyzeWithAI(programId: string): Promise<AIReferralProgram['aiInsights']> {
    await delay(600);
    return MOCK_AI_REFERRAL_PROGRAM.aiInsights!;
  },

  async updateSegmentReward(
    programId: string,
    segmentReward: SegmentBasedReward,
  ): Promise<SegmentBasedReward> {
    await delay(300);
    return segmentReward;
  },
};

