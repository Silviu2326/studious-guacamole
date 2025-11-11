// API para gestión de campañas de SMS/WhatsApp Marketing

export interface Campaign {
  campaignId: string;
  name: string;
  status: 'scheduled' | 'sending' | 'sent' | 'failed' | 'draft';
  channel: 'sms' | 'whatsapp';
  segmentId: string;
  estimatedRecipients: number;
  scheduledAt?: string;
  sentAt?: string;
  stats: {
    sent: number;
    delivered: number;
    clicks?: number;
    conversions?: number;
    optOuts?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CampaignDetails extends Campaign {
  message: string;
  templateId?: string;
  recipientDetails?: CampaignRecipient[];
  kpis?: CampaignKPIs;
}

export interface CampaignKPIs {
  deliveryRate: number;
  ctr: number;
  optOutRate: number;
  conversionRate?: number;
  totalCost: string;
  costPerConversion?: string;
  failureRate: number;
}

export interface CampaignRecipient {
  clientId: string;
  clientName: string;
  phoneNumber: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  clicked?: boolean;
  converted?: boolean;
  optOut?: boolean;
  reason?: string;
  timestamp?: string;
}

export interface MessageTemplate {
  templateId: string;
  name: string;
  category: 'UTILITY' | 'MARKETING' | 'AUTHENTICATION';
  body: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  variables?: string[];
  createdAt?: string;
}

export interface Segment {
  id: string;
  name: string;
  description?: string;
  criteria: SegmentCriteria;
  estimatedSize: number;
  createdAt: string;
}

export interface SegmentCriteria {
  filters: SegmentFilter[];
  logic?: 'AND' | 'OR';
}

export interface SegmentFilter {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in' | 'not_in';
  value: any;
}

export interface CreateCampaignPayload {
  channel: 'sms' | 'whatsapp';
  segmentId: string;
  message: string;
  templateId?: string;
  scheduledAt?: string;
  name?: string;
}

export interface CampaignStats {
  campaignId: string;
  name: string;
  status: string;
  kpis: CampaignKPIs;
  recipientDetails: CampaignRecipient[];
}

// Funciones API simuladas (a implementar con backend real)
export const getCampaigns = async (page?: number, limit?: number): Promise<{ data: Campaign[]; pagination: { total: number; page: number; limit: number } }> => {
  // Simulación - en producción: GET /api/marketing/campaigns?page={page}&limit={limit}
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    data: [],
    pagination: {
      total: 0,
      page: page || 1,
      limit: limit || 10
    }
  };
};

export const getCampaignDetails = async (campaignId: string): Promise<CampaignDetails | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: GET /api/marketing/campaigns/{campaignId}
  return null;
};

export const getCampaignStats = async (campaignId: string): Promise<CampaignStats | null> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // En producción: GET /api/marketing/campaigns/{campaignId}/stats
  return null;
};

export const createCampaign = async (payload: CreateCampaignPayload): Promise<Campaign> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // En producción: POST /api/marketing/campaigns
  const newCampaign: Campaign = {
    campaignId: `camp_${Date.now()}`,
    name: payload.name || 'Nueva Campaña',
    status: payload.scheduledAt ? 'scheduled' : 'draft',
    channel: payload.channel,
    segmentId: payload.segmentId,
    estimatedRecipients: 0,
    scheduledAt: payload.scheduledAt,
    stats: {
      sent: 0,
      delivered: 0,
      clicks: 0,
      conversions: 0,
      optOuts: 0
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  return newCampaign;
};

export const deleteCampaign = async (campaignId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: DELETE /api/marketing/campaigns/{campaignId}
  console.log('Eliminando campaña:', campaignId);
};

export const cancelCampaign = async (campaignId: string): Promise<Campaign> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: POST /api/marketing/campaigns/{campaignId}/cancel
  return {
    campaignId,
    name: 'Campaña',
    status: 'draft',
    channel: 'sms',
    segmentId: 'segment-1',
    estimatedRecipients: 0,
    stats: {
      sent: 0,
      delivered: 0
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const getWhatsAppTemplates = async (): Promise<MessageTemplate[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // En producción: GET /api/marketing/whatsapp-templates
  return [];
};

export const createWhatsAppTemplate = async (template: Partial<MessageTemplate>): Promise<MessageTemplate> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // En producción: POST /api/marketing/whatsapp-templates
  return {
    templateId: `wa_tpl_${Date.now()}`,
    name: template.name || 'Nueva Plantilla',
    category: template.category || 'UTILITY',
    body: template.body || '',
    status: 'PENDING',
    variables: template.variables || [],
    createdAt: new Date().toISOString()
  };
};

export const getSegments = async (): Promise<Segment[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: GET /api/marketing/segments
  return [];
};

export const createSegment = async (segment: Partial<Segment>): Promise<Segment> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // En producción: POST /api/marketing/segments
  return {
    id: `seg_${Date.now()}`,
    name: segment.name || 'Nuevo Segmento',
    description: segment.description,
    criteria: segment.criteria || { filters: [] },
    estimatedSize: 0,
    createdAt: new Date().toISOString()
  };
};
















