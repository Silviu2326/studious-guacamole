// API para gestión de email marketing y newsletters

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  bodyHtml: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled';
  segmentId?: string;
  segment?: EmailSegment;
  scheduledAt?: string;
  sentAt?: string;
  createdAt: string;
  updatedAt?: string;
  fromName?: string;
  fromEmail?: string;
  previewText?: string;
}

export interface EmailSegment {
  id: string;
  name: string;
  contactCount: number;
  rules?: SegmentRule[];
  description?: string;
}

export interface SegmentRule {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'is_empty';
  value: any;
}

export interface EmailTemplate {
  id: string;
  name: string;
  thumbnailUrl?: string;
  bodyHtml: string;
  category?: 'newsletter' | 'promotion' | 'announcement' | 'welcome' | 'other';
  description?: string;
}

export interface CampaignAnalytics {
  campaignId: string;
  totalSent: number;
  opens: {
    total: number;
    rate: number;
  };
  clicks: {
    total: number;
    rate: number;
  };
  bounces: {
    total: number;
    rate: number;
  };
  unsubscribes: {
    total: number;
    rate: number;
  };
  conversions?: {
    total: number;
    revenue?: number;
  };
}

export interface CampaignsResponse {
  data: EmailCampaign[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

// Funciones API simuladas (a implementar con backend real)
export const getCampaigns = async (filters?: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<CampaignsResponse> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const mockCampaigns: EmailCampaign[] = [
    {
      id: 'camp_a1b2c3d4',
      name: 'Lanzamiento Reto Verano',
      subject: '💪 ¿Listo para tu mejor versión este verano?',
      bodyHtml: '<html>...</html>',
      status: 'sent',
      segmentId: 'seg_1',
      sentAt: '2023-06-01T08:00:00Z',
      createdAt: '2023-05-28T10:00:00Z',
      fromName: 'TrainerERP',
      fromEmail: 'noreply@trainererp.com'
    },
    {
      id: 'camp_b2c3d4e5',
      name: 'Newsletter Mensual Octubre',
      subject: '🎃 Consejos de Nutrición para Halloween',
      bodyHtml: '<html>...</html>',
      status: 'draft',
      createdAt: '2023-10-25T14:00:00Z',
      fromName: 'TrainerERP',
      fromEmail: 'noreply@trainererp.com'
    },
    {
      id: 'camp_c3d4e5f6',
      name: 'Oferta Black Friday',
      subject: '⚡ Descuento Especial Black Friday - 40% OFF',
      bodyHtml: '<html>...</html>',
      status: 'scheduled',
      scheduledAt: '2023-11-24T00:00:00Z',
      segmentId: 'seg_2',
      createdAt: '2023-11-15T09:00:00Z',
      fromName: 'TrainerERP',
      fromEmail: 'noreply@trainererp.com'
    }
  ];
  
  let filtered = [...mockCampaigns];
  
  if (filters?.status) {
    filtered = filtered.filter(c => c.status === filters.status);
  }
  
  const page = filters?.page || 1;
  const limit = filters?.limit || 10;
  const startIndex = (page - 1) * limit;
  
  return {
    data: filtered.slice(startIndex, startIndex + limit),
    pagination: {
      total: filtered.length,
      page,
      limit
    }
  };
};

export const createCampaign = async (
  campaignData: Omit<EmailCampaign, 'id' | 'createdAt' | 'status'>
): Promise<EmailCampaign> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const newCampaign: EmailCampaign = {
    id: `camp_${Date.now()}`,
    ...campaignData,
    status: 'draft',
    createdAt: new Date().toISOString()
  };
  
  return newCampaign;
};

export const updateCampaign = async (
  campaignId: string,
  updates: Partial<EmailCampaign>
): Promise<EmailCampaign> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: PUT /api/marketing/campaigns/{campaignId}
  const campaigns = await getCampaigns();
  const existing = campaigns.data.find(c => c.id === campaignId);
  
  if (!existing) {
    throw new Error('Campaña no encontrada');
  }
  
  return {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString()
  };
};

export const scheduleCampaign = async (
  campaignId: string,
  scheduledAt?: string
): Promise<EmailCampaign> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const campaigns = await getCampaigns();
  const existing = campaigns.data.find(c => c.id === campaignId);
  
  if (!existing) {
    throw new Error('Campaña no encontrada');
  }
  
  return {
    ...existing,
    status: scheduledAt ? 'scheduled' : 'sending',
    scheduledAt: scheduledAt || new Date().toISOString()
  };
};

export const getCampaignAnalytics = async (
  campaignId: string
): Promise<CampaignAnalytics> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return {
    campaignId,
    totalSent: 500,
    opens: {
      total: 250,
      rate: 0.5
    },
    clicks: {
      total: 100,
      rate: 0.2
    },
    bounces: {
      total: 5,
      rate: 0.01
    },
    unsubscribes: {
      total: 2,
      rate: 0.004
    },
    conversions: {
      total: 12,
      revenue: 1440
    }
  };
};

export const deleteCampaign = async (campaignId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  console.log('Eliminando campaña:', campaignId);
};

export const getSegments = async (): Promise<EmailSegment[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    {
      id: 'seg_1',
      name: 'Clientes Activos',
      contactCount: 245,
      description: 'Clientes con membresía activa'
    },
    {
      id: 'seg_2',
      name: 'Leads Calientes',
      contactCount: 89,
      description: 'Leads que han descargado contenido'
    },
    {
      id: 'seg_3',
      name: 'Clientes VIP',
      contactCount: 34,
      description: 'Clientes con más de 1 año'
    },
    {
      id: 'seg_4',
      name: 'Inactivos 30+ días',
      contactCount: 56,
      description: 'Clientes que no han reservado en 30 días'
    }
  ];
};

export const getEmailTemplates = async (): Promise<EmailTemplate[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return [
    {
      id: 'tpl_1',
      name: 'Lanzamiento de Nuevo Programa',
      category: 'announcement',
      description: 'Plantilla para anunciar nuevos programas o retos',
      thumbnailUrl: 'https://via.placeholder.com/400x300'
    },
    {
      id: 'tpl_2',
      name: 'Newsletter Mensual',
      category: 'newsletter',
      description: 'Plantilla para newsletters con consejos y novedades',
      thumbnailUrl: 'https://via.placeholder.com/400x300'
    },
    {
      id: 'tpl_3',
      name: 'Oferta de Temporada',
      category: 'promotion',
      description: 'Plantilla para promociones y ofertas especiales',
      thumbnailUrl: 'https://via.placeholder.com/400x300'
    },
    {
      id: 'tpl_4',
      name: 'Secuencia de Bienvenida',
      category: 'welcome',
      description: 'Plantilla para dar la bienvenida a nuevos clientes',
      thumbnailUrl: 'https://via.placeholder.com/400x300'
    }
  ];
};





















