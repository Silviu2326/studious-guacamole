import { LeadAnalytics } from '../types';
import { AnalyticsService } from '../services/analyticsService';

export const getLeadAnalytics = async (
  businessType: 'entrenador' | 'gimnasio',
  userId?: string,
  period?: { start: Date; end: Date }
): Promise<LeadAnalytics> => {
  return AnalyticsService.getAnalytics(businessType, userId, period);
};

