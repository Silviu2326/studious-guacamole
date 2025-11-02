import { Lead, LeadFilters, LeadHistory } from '../types';
import { LeadsService } from '../services/leadsService';

// Re-exportar funciones del servicio como funciones API
export const getLeads = async (filters?: LeadFilters): Promise<Lead[]> => {
  return LeadsService.getLeads(filters);
};

export const getLead = async (id: string): Promise<Lead | null> => {
  return LeadsService.getLead(id);
};

export const createLead = async (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> => {
  return LeadsService.createLead(lead);
};

export const updateLead = async (id: string, updates: Partial<Lead>): Promise<Lead> => {
  return LeadsService.updateLead(id, updates);
};

export const deleteLead = async (id: string): Promise<void> => {
  return LeadsService.deleteLead(id);
};

export const getLeadHistory = async (id: string): Promise<LeadHistory> => {
  return LeadsService.getLeadHistory(id);
};

