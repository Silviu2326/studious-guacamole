// API para gestión del Lead Inbox Unificado & SLA

export interface Lead {
  id: string;
  name: string;
  lastMessageSnippet: string;
  sourceChannel: 'instagram' | 'facebook' | 'web_form' | 'whatsapp' | 'email';
  status: 'new' | 'contacted' | 'converted' | 'discarded';
  assignedTo?: {
    id: string;
    name: string;
  };
  slaStatus: 'on_time' | 'at_risk' | 'overdue';
  slaDueTimestamp: string;
  updatedAt: string;
}

export interface LeadResponse {
  data: Lead[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const getLeads = async (
  page: number = 1,
  limit: number = 20,
  filters?: {
    status?: string;
    channel?: string;
    assigneeId?: string;
  }
): Promise<LeadResponse> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    data: [
      {
        id: 'ld_001',
        name: 'Ana García',
        lastMessageSnippet: '¿Hola! Me gustaría saber precios para el plan de entrenamiento personal...',
        sourceChannel: 'instagram',
        status: 'new',
        assignedTo: { id: 'trainer_abc', name: 'Carlos Ruiz' },
        slaStatus: 'at_risk',
        slaDueTimestamp: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        updatedAt: '2024-01-15T12:30:00Z'
      }
    ],
    pagination: {
      total: 1,
      page,
      limit,
      totalPages: 1
    }
  };
};

