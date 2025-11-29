import { ChurnAnalytics, RetentionReason } from '../types';

export const getChurnAnalytics = async (role: 'entrenador' | 'gimnasio', userId?: string): Promise<ChurnAnalytics> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return {
    totalClients: 150,
    activeClients: 120,
    riskClients: 20,
    lostClients: 10,
    churnRate: 6.7,
    retentionRate: 93.3,
    averageLifetime: 18,
    topChurnReasons: [
      { reason: 'problemas-economicos', count: 4, percentage: 40 },
      { reason: 'falta-tiempo', count: 3, percentage: 30 },
      { reason: 'mudanza', count: 2, percentage: 20 },
      { reason: 'insatisfaccion', count: 1, percentage: 10 },
    ],
    monthlyTrend: [
      { month: '2024-07', active: 115, risk: 15, lost: 8 },
      { month: '2024-08', active: 118, risk: 18, lost: 7 },
      { month: '2024-09', active: 122, risk: 19, lost: 9 },
      { month: '2024-10', active: 120, risk: 20, lost: 10 },
    ],
  };
};

export const getRetentionMetrics = async (role: 'entrenador' | 'gimnasio', userId?: string) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    activeRetentionActions: 8,
    completedRetentionActions: 45,
    recoveredClients: 12,
    recoveryRate: 60,
  };
};

