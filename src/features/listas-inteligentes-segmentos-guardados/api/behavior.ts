import { BehaviorPattern } from '../types';

const mockBehaviorPatterns: BehaviorPattern[] = [
  {
    id: 'bp1',
    clientId: 'client1',
    clientName: 'María García',
    patternType: 'risk',
    score: 0.85,
    details: {
      daysSinceLastVisit: 21,
      attendanceRate: 0.25,
      purchaseFrequency: 'low'
    },
    detectedAt: '2024-01-20T10:00:00Z'
  },
  {
    id: 'bp2',
    clientId: 'client2',
    clientName: 'Juan Pérez',
    patternType: 'engagement',
    score: 0.92,
    details: {
      attendanceRate: 0.95,
      classParticipation: 'high',
      socialEngagement: 'active'
    },
    detectedAt: '2024-01-19T15:30:00Z'
  },
  {
    id: 'bp3',
    clientId: 'client3',
    clientName: 'Ana López',
    patternType: 'purchase',
    score: 0.78,
    details: {
      purchaseFrequency: 'high',
      avgPurchaseValue: 120,
      favoriteCategories: ['nutrition', 'supplements']
    },
    detectedAt: '2024-01-18T09:15:00Z'
  },
  {
    id: 'bp4',
    clientId: 'client4',
    clientName: 'Carlos Ruiz',
    patternType: 'attendance',
    score: 0.88,
    details: {
      attendanceRate: 0.82,
      preferredTime: 'morning',
      preferredDays: ['Monday', 'Wednesday', 'Friday']
    },
    detectedAt: '2024-01-17T14:20:00Z'
  }
];

export const getBehaviorPatterns = async (clientId?: string, patternType?: string): Promise<BehaviorPattern[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  let filtered = [...mockBehaviorPatterns];
  
  if (clientId) {
    filtered = filtered.filter(bp => bp.clientId === clientId);
  }
  
  if (patternType) {
    filtered = filtered.filter(bp => bp.patternType === patternType);
  }
  
  return filtered;
};

export const analyzeBehavior = async (segmentId: string): Promise<BehaviorPattern[]> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simular análisis de comportamiento para un segmento
  return mockBehaviorPatterns.slice(0, 10);
};

export const getBehaviorInsights = async (clientId: string): Promise<{
  patterns: BehaviorPattern[];
  predictions: {
    churnRisk: number;
    upsellOpportunity: number;
    engagementTrend: 'increasing' | 'stable' | 'decreasing';
  };
}> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const patterns = mockBehaviorPatterns.filter(bp => bp.clientId === clientId);
  
  return {
    patterns,
    predictions: {
      churnRisk: Math.random() * 0.5,
      upsellOpportunity: Math.random() * 0.6,
      engagementTrend: ['increasing', 'stable', 'decreasing'][Math.floor(Math.random() * 3)] as 'increasing' | 'stable' | 'decreasing'
    }
  };
};

