import { LeadScoring, Lead } from '../types';
import { ScoringService } from '../services/scoringService';

export const calculateLeadScore = async (leadId: string): Promise<LeadScoring> => {
  return ScoringService.calculateLeadScore(leadId);
};

export const recalculateAllScores = async (businessType: 'entrenador' | 'gimnasio'): Promise<void> => {
  return ScoringService.recalculateAllScores(businessType);
};

export const getTopScoredLeads = async (limit: number = 10, businessType?: 'entrenador' | 'gimnasio'): Promise<Lead[]> => {
  return ScoringService.getTopScoredLeads(limit, businessType);
};

