import {
  InitiativePrioritization,
  CommunityActivity,
  InitiativeLearningData,
  InitiativeReferralImpact,
  ActivityRetentionImpact,
  ActivityRevenueImpact,
  CommunityActivityType,
} from '../types';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function simulateLatency<T>(data: T): Promise<T> {
  return delay(500 + Math.random() * 300).then(() => data);
}

// Mock data para iniciativas
const MOCK_ACTIVITIES: CommunityActivity[] = [
  {
    id: 'activity_001',
    name: 'Reto de Transformación 30 Días',
    type: 'reto',
    description: 'Reto intensivo de 30 días para transformación física',
    startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completado',
    investment: 5000,
    participants: 45,
    targetAudience: ['embajador', 'regular'],
  },
  {
    id: 'activity_002',
    name: 'Workshop de Nutrición',
    type: 'workshop',
    description: 'Taller sobre nutrición y alimentación saludable',
    startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completado',
    investment: 2000,
    participants: 30,
    targetAudience: ['nuevo', 'regular'],
  },
  {
    id: 'activity_003',
    name: 'Evento de Networking Fitness',
    type: 'networking',
    description: 'Evento para conectar a miembros de la comunidad',
    startDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completado',
    investment: 3000,
    participants: 60,
    targetAudience: ['embajador', 'vip'],
  },
];

function generateMockPrioritization(period: '30d' | '90d' | '12m'): InitiativePrioritization {
  const prioritizedInitiatives = MOCK_ACTIVITIES.map((activity, index) => {
    const referralImpact: InitiativeReferralImpact = {
      initiativeId: activity.id,
      initiativeName: activity.name,
      initiativeType: activity.type,
      referralsGenerated: Math.floor(Math.random() * 20) + 5,
      referralConversionRate: 60 + Math.random() * 30,
      referralRevenue: (Math.random() * 10000) + 5000,
      referralROI: (Math.random() * 200) + 50,
      retentionRate: 75 + Math.random() * 20,
      retentionLift: (Math.random() * 15) + 5,
      participantsRetained: Math.floor(activity.participants * (0.7 + Math.random() * 0.2)),
      overallEffectiveness: 70 + Math.random() * 25,
      priorityScore: 90 - index * 10 + Math.random() * 5,
    };

    const retentionImpact: ActivityRetentionImpact = {
      activityId: activity.id,
      activityName: activity.name,
      retentionRate: referralImpact.retentionRate,
      retentionLift: referralImpact.retentionLift,
      participantsRetained: referralImpact.participantsRetained,
      totalParticipants: activity.participants,
      retentionPeriod: '90d',
      baselineRetention: referralImpact.retentionRate - referralImpact.retentionLift,
      retentionChange: referralImpact.retentionLift,
      retentionTrend: referralImpact.retentionLift > 10 ? 'up' : 'steady',
    };

    const revenueImpact: ActivityRevenueImpact = {
      activityId: activity.id,
      activityName: activity.name,
      revenueGenerated: referralImpact.referralRevenue * 1.5,
      revenueAttributed: referralImpact.referralRevenue,
      revenueLift: (referralImpact.referralRevenue / activity.investment) * 100,
      averageRevenuePerParticipant: referralImpact.referralRevenue / activity.participants,
      roi: referralImpact.referralROI,
      roiPeriod: '90d',
      baselineRevenue: referralImpact.referralRevenue * 0.7,
      revenueChange: referralImpact.referralRevenue * 0.3,
      revenueTrend: referralImpact.referralROI > 100 ? 'up' : 'steady',
    };

    const learningData: InitiativeLearningData = {
      initiativeId: activity.id,
      initiativeName: activity.name,
      initiativeType: activity.type,
      totalRuns: Math.floor(Math.random() * 5) + 1,
      totalParticipants: activity.participants * (Math.floor(Math.random() * 3) + 1),
      totalReferralsGenerated: referralImpact.referralsGenerated * 2,
      totalRetentionLift: referralImpact.retentionLift * 1.5,
      totalRevenueGenerated: revenueImpact.revenueGenerated * 1.2,
      averageROI: referralImpact.referralROI,
      trend: {
        referralTrend: referralImpact.referralsGenerated > 10 ? 'up' : 'steady',
        retentionTrend: referralImpact.retentionLift > 10 ? 'up' : 'steady',
        effectivenessTrend: referralImpact.overallEffectiveness > 80 ? 'up' : 'steady',
      },
      aiPatterns: {
        bestAudience: activity.targetAudience || ['regular'],
        optimalTiming: 'Fines de semana por la mañana',
        keySuccessFactors: [
          'Alto engagement de participantes',
          'Seguimiento personalizado',
          'Comunidad activa',
        ],
        improvementOpportunities: [
          'Aumentar frecuencia de comunicación',
          'Mejorar materiales de apoyo',
        ],
      },
      predictions: {
        expectedReferrals: Math.floor(referralImpact.referralsGenerated * 1.1),
        expectedRetentionLift: referralImpact.retentionLift * 1.05,
        confidence: 75 + Math.random() * 20,
      },
      lastAnalyzed: new Date().toISOString(),
      createdAt: activity.startDate,
      updatedAt: new Date().toISOString(),
    };

    const recommendations: ('increase' | 'maintain' | 'reduce' | 'discontinue' | 'replicate')[] = [
      'increase',
      'maintain',
      'reduce',
      'discontinue',
      'replicate',
    ];

    return {
      initiative: activity,
      learningData,
      referralImpact,
      retentionImpact,
      revenueImpact,
      priorityRank: index + 1,
      priorityScore: referralImpact.priorityScore,
      recommendation: recommendations[Math.floor(Math.random() * recommendations.length)] as any,
      reasoning: `Esta iniciativa ha generado ${referralImpact.referralsGenerated} referidos y un incremento de ${referralImpact.retentionLift.toFixed(1)}% en retención. El ROI es del ${referralImpact.referralROI.toFixed(1)}%, lo que la convierte en una de las más efectivas.`,
    };
  }).sort((a, b) => b.priorityScore - a.priorityScore);

  // Reasignar rankings después de ordenar
  prioritizedInitiatives.forEach((item, index) => {
    item.priorityRank = index + 1;
  });

  return {
    id: `prioritization_${period}_${Date.now()}`,
    trainerId: 'trainer_001',
    period,
    generatedAt: new Date().toISOString(),
    prioritizedInitiatives,
    aiInsights: {
      topPerformers: prioritizedInitiatives.slice(0, 3).map((item) => item.initiative.id),
      emergingOpportunities: [prioritizedInitiatives[0].initiative.id],
      decliningInitiatives: [],
      recommendations: [
        {
          action: `Aumentar inversión en "${prioritizedInitiatives[0].initiative.name}"`,
          initiativeId: prioritizedInitiatives[0].initiative.id,
          reasoning: 'Esta iniciativa muestra el mejor ROI y generación de referidos',
          expectedImpact: 'Incremento del 20% en referidos y 15% en retención',
          priority: 'high',
        },
        {
          action: 'Replicar modelo de reto de transformación',
          reasoning: 'Los retos de transformación muestran alta efectividad',
          expectedImpact: 'Nuevas iniciativas con ROI similar',
          priority: 'medium',
        },
      ],
      patterns: [
        {
          pattern: 'Retos de transformación generan más referidos',
          description: 'Los retos intensivos de corta duración generan más referidos que eventos únicos',
          evidence: [
            'Reto de Transformación 30 Días: 18 referidos',
            'Workshop de Nutrición: 8 referidos',
            'Evento de Networking: 12 referidos',
          ],
          confidence: 85,
        },
        {
          pattern: 'Audiencia embajadora responde mejor',
          description: 'Los miembros embajadores tienen mayor tasa de participación y generación de referidos',
          evidence: [
            '70% de referidos vienen de segmento embajador',
            'Tasa de conversión 40% mayor en embajadores',
          ],
          confidence: 78,
        },
      ],
    },
    summary: {
      totalInitiatives: prioritizedInitiatives.length,
      highPriorityCount: prioritizedInitiatives.filter((item) => item.priorityScore > 80).length,
      averagePriorityScore:
        prioritizedInitiatives.reduce((sum, item) => sum + item.priorityScore, 0) /
        prioritizedInitiatives.length,
      topInitiativeType: prioritizedInitiatives[0].initiative.type,
      totalReferralsAttributed: prioritizedInitiatives.reduce(
        (sum, item) => sum + item.referralImpact.referralsGenerated,
        0,
      ),
      totalRetentionLift: prioritizedInitiatives.reduce(
        (sum, item) => sum + item.retentionImpact.retentionLift,
        0,
      ),
    },
  };
}

export const InitiativePrioritizationAPI = {
  /**
   * Obtener priorización de iniciativas
   */
  async getPrioritization(period: '30d' | '90d' | '12m'): Promise<InitiativePrioritization> {
    return simulateLatency(generateMockPrioritization(period));
  },

  /**
   * Generar nuevo análisis de priorización
   */
  async generatePrioritization(period: '30d' | '90d' | '12m'): Promise<InitiativePrioritization> {
    return simulateLatency(generateMockPrioritization(period));
  },
};

