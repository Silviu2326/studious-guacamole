import { ConversionPrediction, Lead, PredictionFactor } from '../types';
import { PredictionService } from '../services/predictionService';

export const getPrediction = async (leadId: string): Promise<ConversionPrediction> => {
  return PredictionService.getPrediction(leadId);
};

export const getPredictions = async (
  leads: Lead[],
  businessType?: 'entrenador' | 'gimnasio'
): Promise<Map<string, ConversionPrediction>> => {
  return PredictionService.getPredictions(leads, businessType);
};

export const filterByProbability = async (
  leads: Lead[],
  minProbability: number,
  maxProbability?: number
): Promise<Lead[]> => {
  return PredictionService.filterByProbability(leads, minProbability, maxProbability);
};

export const getTopProbableLeads = async (
  businessType: 'entrenador' | 'gimnasio',
  limit?: number
): Promise<Array<Lead & { prediction: ConversionPrediction }>> => {
  return PredictionService.getTopProbableLeads(businessType, limit);
};

export const recalculateAllPredictions = async (
  businessType: 'entrenador' | 'gimnasio'
): Promise<void> => {
  return PredictionService.recalculateAllPredictions(businessType);
};

export const getMostInfluentialFactors = async (
  businessType: 'entrenador' | 'gimnasio'
): Promise<Array<{ factor: string; averageImpact: number; frequency: number }>> => {
  return PredictionService.getMostInfluentialFactors(businessType);
};

