import { PipelineColumn, Lead, PipelineStage } from '../types';
import { PipelineService } from '../services/pipelineService';

export const getPipeline = async (businessType: 'entrenador' | 'gimnasio', userId?: string): Promise<PipelineColumn[]> => {
  return PipelineService.getPipeline(businessType, userId);
};

export const updateLeadStage = async (leadId: string, newStage: PipelineStage): Promise<Lead> => {
  return PipelineService.updateLeadStage(leadId, newStage);
};

export const updateLeadStatus = async (leadId: string, newStatus: string): Promise<Lead> => {
  return PipelineService.updateLeadStatus(leadId, newStatus);
};

