import { SegmentAnalytics, SegmentComparison, PredictiveSegment } from '../types';

export const getSegmentAnalytics = async (segmentId: string, startDate?: string, endDate?: string): Promise<SegmentAnalytics> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const end = endDate || new Date().toISOString();
  
  // Generar datos de tendencia
  const generateTrendData = (days: number, baseValue: number, variance: number = 0.1) => {
    const data = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      const value = baseValue * (1 + (Math.random() - 0.5) * variance);
      data.push({ date: date.toISOString(), value: Math.max(0, Math.round(value)) });
    }
    return data;
  };
  
  return {
    segmentId,
    segmentName: 'Segmento de Prueba',
    totalMembers: 142,
    engagementRate: 0.68,
    conversionRate: 0.24,
    revenue: 45600,
    avgLifetimeValue: 321,
    churnRate: 0.12,
    period: {
      start,
      end
    },
    trends: {
      memberCount: generateTrendData(30, 140, 0.05),
      engagement: generateTrendData(30, 0.65, 0.15),
      revenue: generateTrendData(30, 1500, 0.2)
    }
  };
};

export const compareSegments = async (segmentIds: string[], startDate?: string, endDate?: string): Promise<SegmentComparison> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const end = endDate || new Date().toISOString();
  
  return {
    segments: segmentIds,
    metrics: {
      memberCount: segmentIds.map(() => Math.floor(Math.random() * 200) + 50),
      engagementRate: segmentIds.map(() => Math.random() * 0.5 + 0.4),
      conversionRate: segmentIds.map(() => Math.random() * 0.3 + 0.1),
      revenue: segmentIds.map(() => Math.floor(Math.random() * 50000) + 10000)
    },
    period: {
      start,
      end
    }
  };
};

export const getPredictiveSegments = async (): Promise<PredictiveSegment[]> => {
  await new Promise(resolve => setTimeout(resolve, 700));
  
  return [
    {
      id: 'ps1',
      name: 'Alto Riesgo de Abandono',
      modelType: 'churn',
      confidence: 0.87,
      memberCount: 45,
      criteria: {
        attendanceRate: { max: 0.3 },
        daysSinceLastVisit: { min: 14 }
      },
      createdAt: '2024-01-20T10:00:00Z'
    },
    {
      id: 'ps2',
      name: 'Oportunidad de Upsell Premium',
      modelType: 'upsell',
      confidence: 0.79,
      memberCount: 123,
      criteria: {
        lifetimeValue: { min: 2000 },
        activeMonths: { min: 6 },
        engagementRate: { min: 0.7 }
      },
      createdAt: '2024-01-20T11:00:00Z'
    },
    {
      id: 'ps3',
      name: 'Alto Potencial de Conversión',
      modelType: 'conversion',
      confidence: 0.82,
      memberCount: 67,
      criteria: {
        visitFrequency: { min: 8 },
        daysSinceFirstVisit: { max: 30 }
      },
      createdAt: '2024-01-20T12:00:00Z'
    }
  ];
};

export const predictSegment = async (criteria: Record<string, any>): Promise<PredictiveSegment> => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    id: `ps-${Date.now()}`,
    name: 'Segmento Predictivo Generado',
    modelType: 'engagement',
    confidence: 0.75 + Math.random() * 0.2,
    memberCount: Math.floor(Math.random() * 100) + 20,
    criteria,
    createdAt: new Date().toISOString()
  };
};

