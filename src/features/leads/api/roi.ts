import { CampaignCost, ROIMetrics, ROITrend, ROIAlert } from '../types';
import { ROIService } from '../services/roiService';

export const getCampaignCosts = async (filters?: {
  source?: string;
  businessType?: 'entrenador' | 'gimnasio';
  period?: { start: Date; end: Date };
}): Promise<CampaignCost[]> => {
  return ROIService.getCampaignCosts(filters);
};

export const getCampaignCost = async (id: string): Promise<CampaignCost | null> => {
  return ROIService.getCampaignCost(id);
};

export const createCampaignCost = async (
  cost: Omit<CampaignCost, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>
): Promise<CampaignCost> => {
  return ROIService.createCampaignCost(cost);
};

export const updateCampaignCost = async (
  id: string,
  updates: Partial<CampaignCost>
): Promise<CampaignCost> => {
  return ROIService.updateCampaignCost(id, updates);
};

export const deleteCampaignCost = async (id: string): Promise<void> => {
  return ROIService.deleteCampaignCost(id);
};

export const calculateROIBySource = async (
  businessType: 'entrenador' | 'gimnasio',
  period?: { start: Date; end: Date }
): Promise<ROIMetrics[]> => {
  return ROIService.calculateROIBySource(businessType, period);
};

export const getROITrends = async (
  source: string,
  businessType: 'entrenador' | 'gimnasio',
  days?: number
): Promise<ROITrend[]> => {
  return ROIService.getROITrends(source as any, businessType, days);
};

export const checkROIAlerts = async (
  businessType: 'entrenador' | 'gimnasio',
  thresholds?: {
    minROI?: number;
    maxCostPerLead?: number;
    minConversionRate?: number;
  }
): Promise<ROIAlert[]> => {
  return ROIService.checkROIAlerts(businessType, thresholds);
};

export const getROISummary = async (
  businessType: 'entrenador' | 'gimnasio',
  period?: { start: Date; end: Date }
): Promise<{
  totalCost: number;
  totalLeads: number;
  totalConversions: number;
  totalRevenue: number;
  averageROI: number;
  bestSource: string | null;
  worstSource: string | null;
}> => {
  return ROIService.getROISummary(businessType, period);
};

