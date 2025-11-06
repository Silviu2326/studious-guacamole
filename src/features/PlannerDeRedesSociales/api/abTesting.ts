// API para A/B Testing de posts

import { SocialPost, SocialPlatform } from './social';

export interface ABTest {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'running' | 'completed' | 'paused';
  variants: ABTestVariant[];
  startDate: string;
  endDate?: string;
  trafficSplit: number; // Porcentaje para variante A (resto va a B)
  metrics: {
    totalViews: number;
    totalEngagement: number;
    conversionRate: number;
  };
  winner?: string; // ID de la variante ganadora
  createdAt: string;
  updatedAt: string;
}

export interface ABTestVariant {
  id: string;
  testId: string;
  name: string;
  postId: string;
  content: string;
  mediaUrls: string[];
  hashtags: string[];
  platform: SocialPlatform;
  metrics: {
    views: number;
    engagement: number;
    reach: number;
    clicks: number;
    conversionRate: number;
  };
  performance: {
    engagementRate: number;
    clickThroughRate: number;
    conversionRate: number;
  };
}

export const getABTests = async (): Promise<ABTest[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    {
      id: 'ab_001',
      name: 'Test: Título de Transformación',
      description: 'Probando diferentes títulos para posts de transformación',
      status: 'running',
      variants: [
        {
          id: 'var_001',
          testId: 'ab_001',
          name: 'Variante A - Título Emocional',
          postId: 'post_001',
          content: '¡Increíble transformación! 🎉',
          mediaUrls: [],
          hashtags: ['transformacion', 'fitness'],
          platform: 'instagram',
          metrics: {
            views: 1200,
            engagement: 180,
            reach: 850,
            clicks: 45,
            conversionRate: 3.75
          },
          performance: {
            engagementRate: 15.0,
            clickThroughRate: 3.75,
            conversionRate: 3.75
          }
        },
        {
          id: 'var_002',
          testId: 'ab_001',
          name: 'Variante B - Título Directo',
          postId: 'post_002',
          content: 'Transformación en 3 meses',
          mediaUrls: [],
          hashtags: ['transformacion', 'fitness'],
          platform: 'instagram',
          metrics: {
            views: 1150,
            engagement: 210,
            reach: 920,
            clicks: 52,
            conversionRate: 4.52
          },
          performance: {
            engagementRate: 18.26,
            clickThroughRate: 4.52,
            conversionRate: 4.52
          }
        }
      ],
      startDate: '2024-01-20T00:00:00Z',
      trafficSplit: 50,
      metrics: {
        totalViews: 2350,
        totalEngagement: 390,
        conversionRate: 4.13
      },
      createdAt: '2024-01-20T00:00:00Z',
      updatedAt: '2024-01-27T00:00:00Z'
    }
  ];
};

export const createABTest = async (test: Omit<ABTest, 'id' | 'createdAt' | 'updatedAt' | 'metrics'>): Promise<ABTest> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return {
    id: `ab_${Date.now()}`,
    ...test,
    metrics: {
      totalViews: 0,
      totalEngagement: 0,
      conversionRate: 0
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const updateABTest = async (testId: string, updates: Partial<ABTest>): Promise<ABTest> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const tests = await getABTests();
  const existing = tests.find(t => t.id === testId);
  
  if (!existing) {
    throw new Error('Test no encontrado');
  }
  
  return {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString()
  };
};

export const analyzeABTest = async (testId: string): Promise<{ winner: string; confidence: number; insights: string[] }> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const tests = await getABTests();
  const test = tests.find(t => t.id === testId);
  
  if (!test || test.variants.length < 2) {
    throw new Error('Test no encontrado o incompleto');
  }
  
  const variantA = test.variants[0];
  const variantB = test.variants[1];
  
  // Determinar ganador basado en engagement rate
  const winner = variantB.performance.engagementRate > variantA.performance.engagementRate
    ? variantB.id
    : variantA.id;
  
  const confidence = 85; // Simulado
  
  const insights = [
    `La variante ${winner === variantA.id ? 'A' : 'B'} tiene un ${Math.abs(variantB.performance.engagementRate - variantA.performance.engagementRate).toFixed(1)}% más de engagement`,
    `La variante ganadora tiene un ${winner === variantB.id ? variantB.performance.clickThroughRate : variantA.performance.clickThroughRate}% de click-through rate`,
    'Se recomienda usar la variante ganadora en futuros posts similares'
  ];
  
  return {
    winner,
    confidence,
    insights
  };
};

