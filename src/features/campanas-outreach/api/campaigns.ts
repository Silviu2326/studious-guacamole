import { 
  Campaign, 
  CampaignFilters,
  AudienceSegment
} from '../types';
import { CampaignsService } from '../services/campaignsService';

// Re-exportar funciones del servicio como funciones API
export const getCampaigns = async (filters?: CampaignFilters): Promise<Campaign[]> => {
  return CampaignsService.getCampaigns(filters);
};

export const getCampaign = async (id: string): Promise<Campaign | null> => {
  return CampaignsService.getCampaign(id);
};

export const createCampaign = async (campaign: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>): Promise<Campaign> => {
  return CampaignsService.createCampaign(campaign);
};

export const updateCampaign = async (id: string, updates: Partial<Campaign>): Promise<Campaign> => {
  return CampaignsService.updateCampaign(id, updates);
};

export const deleteCampaign = async (id: string): Promise<void> => {
  return CampaignsService.deleteCampaign(id);
};

export const sendCampaign = async (campaignId: string): Promise<{ success: boolean; message: string }> => {
  // Simular envío de campaña
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true, message: 'Campaña enviada exitosamente' };
};

export const getAudienceSegments = async (): Promise<AudienceSegment[]> => {
  return CampaignsService.getAudienceSegments();
};
