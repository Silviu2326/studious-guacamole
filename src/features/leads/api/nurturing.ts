import { NurturingSequence, NurturingMetrics, Lead } from '../types';
import { NurturingService } from '../services/nurturingService';

export const getNurturingSequences = async (businessType?: 'entrenador' | 'gimnasio'): Promise<NurturingSequence[]> => {
  return NurturingService.getSequences(businessType);
};

export const getNurturingSequence = async (id: string): Promise<NurturingSequence | null> => {
  return NurturingService.getSequence(id);
};

export const createNurturingSequence = async (
  sequence: Omit<NurturingSequence, 'id' | 'createdAt' | 'updatedAt' | 'metrics'>
): Promise<NurturingSequence> => {
  return NurturingService.createSequence(sequence);
};

export const updateNurturingSequence = async (
  id: string,
  updates: Partial<NurturingSequence>
): Promise<NurturingSequence> => {
  return NurturingService.updateSequence(id, updates);
};

export const deleteNurturingSequence = async (id: string): Promise<void> => {
  return NurturingService.deleteSequence(id);
};

export const toggleNurturingSequenceStatus = async (id: string): Promise<NurturingSequence> => {
  return NurturingService.toggleSequenceStatus(id);
};

export const assignSequenceToLead = async (sequenceId: string, leadId: string): Promise<void> => {
  return NurturingService.assignSequenceToLead(sequenceId, leadId);
};

export const getSequenceMetrics = async (sequenceId: string): Promise<NurturingMetrics> => {
  return NurturingService.getSequenceMetrics(sequenceId);
};

export const getActiveLeadsInSequence = async (sequenceId: string): Promise<Lead[]> => {
  return NurturingService.getActiveLeadsInSequence(sequenceId);
};

export const checkTriggers = async (lead: Lead, event: 'lead_created' | 'lead_status_changed' | 'no_response_days' | 'score_threshold' | 'custom'): Promise<void> => {
  return NurturingService.checkTriggers(lead, event);
};

