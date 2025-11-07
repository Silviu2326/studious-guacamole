import { PipelineColumn, Lead, PipelineStage } from '../types';
import { getLeads } from '../api/leads';

export class PipelineService {
  static async getPipeline(businessType: 'entrenador' | 'gimnasio', userId?: string): Promise<PipelineColumn[]> {
    const leads = await getLeads({ businessType });
    
    // Filtrar por usuario si es entrenador
    let filteredLeads = leads;
    if (businessType === 'entrenador' && userId) {
      filteredLeads = leads.filter(l => l.assignedTo === userId);
    }

    const stages: PipelineStage[] = ['captacion', 'interes', 'calificacion', 'oportunidad', 'cierre'];
    
    const columns: PipelineColumn[] = stages.map(stage => ({
      stage,
      leads: filteredLeads.filter(lead => lead.stage === stage),
    }));

    return columns;
  }

  static async updateLeadStage(leadId: string, newStage: PipelineStage): Promise<Lead> {
    const { updateLead } = await import('../api/leads');
    return updateLead(leadId, { stage: newStage });
  }

  static async updateLeadStatus(leadId: string, newStatus: string): Promise<Lead> {
    const { updateLead } = await import('../api/leads');
    return updateLead(leadId, { status: newStatus as any });
  }
}

