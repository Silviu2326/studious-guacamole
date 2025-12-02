import { 
  CampaignAnalytics, 
  ROIData
} from '../types';
import { CampaignsService } from '../services/campaignsService';

export const getCampaignAnalytics = async (campaignId: string): Promise<CampaignAnalytics> => {
  return CampaignsService.getCampaignAnalytics(campaignId);
};

export const getROIData = async (campaignId: string): Promise<ROIData> => {
  return CampaignsService.getROIData(campaignId);
};

export const getCampaignMetrics = async (campaignId: string, startDate?: Date, endDate?: Date): Promise<CampaignAnalytics> => {
  const analytics = await CampaignsService.getCampaignAnalytics(campaignId);
  // Filtrar por rango de fechas si se proporciona
  if (startDate && endDate) {
    // Implementación simplificada - en producción se filtrarían los datos de timeSeriesData
    return analytics;
  }
  return analytics;
};
