import { Lead } from '../types';
import { DuplicateDetectionService } from '../services/duplicateDetectionService';

export interface DuplicateMatch {
  lead: Lead;
  similarity: number;
  matchType: 'email' | 'phone' | 'name';
}

export const detectDuplicates = async (
  lead: Lead,
  threshold?: number
): Promise<DuplicateMatch[]> => {
  return DuplicateDetectionService.detectDuplicates(lead, threshold);
};

export const checkDuplicate = async (
  email?: string,
  phone?: string,
  name?: string
): Promise<Lead[]> => {
  return DuplicateDetectionService.checkDuplicate(email, phone, name);
};

export const previewMerge = async (
  primaryId: string,
  duplicateId: string
): Promise<{
  name: string;
  email?: string;
  phone?: string;
  totalInteractions: number;
  totalNotes: number;
  combinedHistory: any[];
}> => {
  return DuplicateDetectionService.previewMerge(primaryId, duplicateId);
};

export const mergeLeads = async (
  primaryId: string,
  duplicateId: string
): Promise<Lead> => {
  return DuplicateDetectionService.mergeLeads(primaryId, duplicateId);
};

