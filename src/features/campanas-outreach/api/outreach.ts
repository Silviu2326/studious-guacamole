import { 
  OutreachSequence, 
  OutreachFilters
} from '../types';
import { CampaignsService } from '../services/campaignsService';

export const getOutreachSequences = async (filters?: OutreachFilters): Promise<OutreachSequence[]> => {
  return CampaignsService.getOutreachSequences(filters);
};

export const createOutreachSequence = async (sequence: Omit<OutreachSequence, 'id' | 'createdAt' | 'updatedAt'>): Promise<OutreachSequence> => {
  return CampaignsService.createOutreachSequence(sequence);
};

export const updateOutreachSequence = async (id: string, updates: Partial<OutreachSequence>): Promise<OutreachSequence> => {
  // Implementación simulada
  await new Promise(resolve => setTimeout(resolve, 600));
  const sequences = await CampaignsService.getOutreachSequences();
  const existingSequence = sequences.find(s => s.id === id);
  if (!existingSequence) {
    throw new Error('Secuencia no encontrada');
  }
  return { ...existingSequence, ...updates };
};

export const deleteOutreachSequence = async (id: string): Promise<void> => {
  // Implementación simulada
  await new Promise(resolve => setTimeout(resolve, 400));
};

export const sendOutreachMessage = async (sequenceId: string, contactId: string): Promise<{ success: boolean; message: string }> => {
  // Simular envío de mensaje de outreach
  await new Promise(resolve => setTimeout(resolve, 800));
  return { success: true, message: 'Mensaje de outreach enviado exitosamente' };
};
