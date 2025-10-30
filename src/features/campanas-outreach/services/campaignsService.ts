import { 
  Campaign, 
  OutreachSequence, 
  AudienceSegment, 
  CampaignAnalytics, 
  ROIData,
  CampaignFilters,
  OutreachFilters,
  MessageTemplate
} from '../types';

// Simulación de datos para desarrollo
const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Black Friday 2024',
    description: 'Campaña especial de Black Friday para captar nuevos socios',
    objective: 'captacion',
    status: 'active',
    type: 'one_time',
    channels: ['whatsapp', 'email'],
    audience: {
      id: 'seg1',
      name: 'Leads Calientes',
      description: 'Leads que han mostrado interés en el último mes',
      criteria: {
        behavior: {
          membershipStatus: 'trial'
        }
      },
      size: 150,
      members: []
    },
    content: {
      templates: [],
      personalizations: []
    },
    schedule: {
      type: 'scheduled',
      startDate: new Date('2024-11-29'),
      timezone: 'America/Mexico_City'
    },
    metrics: {
      sent: 150,
      delivered: 145,
      opened: 87,
      clicked: 23,
      converted: 8,
      unsubscribed: 2,
      bounced: 5,
      revenue: 12000,
      cost: 500,
      roi: 2300,
      engagementRate: 60,
      conversionRate: 5.5,
      deliveryRate: 96.7,
      openRate: 60,
      clickRate: 15.9,
      unsubscribeRate: 1.4
    },
    createdAt: new Date('2024-11-15'),
    updatedAt: new Date('2024-11-29'),
    createdBy: 'admin'
  },
  {
    id: '2',
    name: 'Retención Enero',
    description: 'Campaña para retener socios que no han visitado en 2 semanas',
    objective: 'retencion',
    status: 'scheduled',
    type: 'automated',
    channels: ['whatsapp', 'email'],
    audience: {
      id: 'seg2',
      name: 'Socios Inactivos',
      description: 'Socios que no han visitado en las últimas 2 semanas',
      criteria: {
        behavior: {
          membershipStatus: 'active',
          lastVisit: {
            operator: 'before',
            value: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
          }
        }
      },
      size: 89,
      members: []
    },
    content: {
      templates: [],
      personalizations: []
    },
    schedule: {
      type: 'trigger_based',
      timezone: 'America/Mexico_City',
      triggers: [{
        id: 'trigger1',
        name: 'Sin visita 14 días',
        event: 'no_visit_days',
        conditions: [{
          field: 'days_since_last_visit',
          operator: 'greater_than',
          value: 14
        }]
      }]
    },
    metrics: {
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      converted: 0,
      unsubscribed: 0,
      bounced: 0,
      engagementRate: 0,
      conversionRate: 0,
      deliveryRate: 0,
      openRate: 0,
      clickRate: 0,
      unsubscribeRate: 0
    },
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01'),
    createdBy: 'admin'
  }
];

const mockOutreachSequences: OutreachSequence[] = [
  {
    id: 'seq1',
    name: 'Bienvenida Nuevos Leads',
    description: 'Secuencia de bienvenida para nuevos leads',
    status: 'active',
    steps: [
      {
        id: 'step1',
        order: 1,
        name: 'Mensaje de Bienvenida',
        channel: 'whatsapp',
        template: {
          id: 'template1',
          channel: 'whatsapp',
          title: 'Bienvenido a FitGym',
          body: 'Hola {{nombre}}, bienvenido a FitGym. Estamos emocionados de tenerte con nosotros.',
          variables: ['nombre']
        },
        delay: { value: 0, unit: 'minutes' }
      },
      {
        id: 'step2',
        order: 2,
        name: 'Información de Servicios',
        channel: 'email',
        template: {
          id: 'template2',
          channel: 'email',
          subject: 'Conoce nuestros servicios',
          body: 'Descubre todo lo que tenemos para ofrecerte en FitGym...',
          variables: ['nombre']
        },
        delay: { value: 2, unit: 'days' }
      }
    ],
    triggers: [{
      id: 'trigger1',
      name: 'Nuevo registro',
      event: 'user_signup'
    }],
    audience: {
      id: 'seg3',
      name: 'Nuevos Leads',
      description: 'Leads registrados en los últimos 7 días',
      criteria: {},
      size: 45,
      members: []
    },
    metrics: {
      totalContacts: 45,
      activeSequences: 32,
      completedSequences: 13,
      responseRate: 28.9,
      conversionRate: 15.6,
      averageResponseTime: 4.2
    },
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-12-01')
  }
];

const mockAudienceSegments: AudienceSegment[] = [
  {
    id: 'seg1',
    name: 'Leads Calientes',
    description: 'Leads que han mostrado interés en el último mes',
    criteria: {
      behavior: {
        membershipStatus: 'trial'
      }
    },
    size: 150,
    members: []
  },
  {
    id: 'seg2',
    name: 'Socios Inactivos',
    description: 'Socios que no han visitado en las últimas 2 semanas',
    criteria: {
      behavior: {
        membershipStatus: 'active',
        lastVisit: {
          operator: 'before',
          value: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
        }
      }
    },
    size: 89,
    members: []
  },
  {
    id: 'seg3',
    name: 'Nuevos Leads',
    description: 'Leads registrados en los últimos 7 días',
    criteria: {},
    size: 45,
    members: []
  }
];

export class CampaignsService {
  // Campañas
  static async getCampaigns(filters?: CampaignFilters): Promise<Campaign[]> {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredCampaigns = [...mockCampaigns];
    
    if (filters) {
      if (filters.status?.length) {
        filteredCampaigns = filteredCampaigns.filter(c => 
          filters.status!.includes(c.status)
        );
      }
      
      if (filters.type?.length) {
        filteredCampaigns = filteredCampaigns.filter(c => 
          filters.type!.includes(c.type)
        );
      }
      
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filteredCampaigns = filteredCampaigns.filter(c => 
          c.name.toLowerCase().includes(search) ||
          c.description?.toLowerCase().includes(search)
        );
      }
    }
    
    return filteredCampaigns;
  }

  static async getCampaign(id: string): Promise<Campaign | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockCampaigns.find(c => c.id === id) || null;
  }

  static async createCampaign(campaign: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>): Promise<Campaign> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newCampaign: Campaign = {
      ...campaign,
      id: `campaign_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockCampaigns.push(newCampaign);
    return newCampaign;
  }

  static async updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const index = mockCampaigns.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Campaña no encontrada');
    }
    
    mockCampaigns[index] = {
      ...mockCampaigns[index],
      ...updates,
      updatedAt: new Date()
    };
    
    return mockCampaigns[index];
  }

  static async deleteCampaign(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = mockCampaigns.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Campaña no encontrada');
    }
    
    mockCampaigns.splice(index, 1);
  }

  // Outreach Sequences
  static async getOutreachSequences(filters?: OutreachFilters): Promise<OutreachSequence[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredSequences = [...mockOutreachSequences];
    
    if (filters) {
      if (filters.status?.length) {
        filteredSequences = filteredSequences.filter(s => 
          filters.status!.includes(s.status)
        );
      }
      
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filteredSequences = filteredSequences.filter(s => 
          s.name.toLowerCase().includes(search) ||
          s.description?.toLowerCase().includes(search)
        );
      }
    }
    
    return filteredSequences;
  }

  static async createOutreachSequence(sequence: Omit<OutreachSequence, 'id' | 'createdAt' | 'updatedAt'>): Promise<OutreachSequence> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newSequence: OutreachSequence = {
      ...sequence,
      id: `sequence_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockOutreachSequences.push(newSequence);
    return newSequence;
  }

  // Audience Segments
  static async getAudienceSegments(): Promise<AudienceSegment[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [...mockAudienceSegments];
  }

  static async createAudienceSegment(segment: Omit<AudienceSegment, 'id' | 'size' | 'members'>): Promise<AudienceSegment> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const newSegment: AudienceSegment = {
      ...segment,
      id: `segment_${Date.now()}`,
      size: Math.floor(Math.random() * 200) + 10, // Simular tamaño
      members: []
    };
    
    mockAudienceSegments.push(newSegment);
    return newSegment;
  }

  // Analytics
  static async getCampaignAnalytics(campaignId: string): Promise<CampaignAnalytics> {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const campaign = mockCampaigns.find(c => c.id === campaignId);
    if (!campaign) {
      throw new Error('Campaña no encontrada');
    }

    return {
      campaignId,
      period: {
        start: campaign.createdAt,
        end: new Date()
      },
      overview: campaign.metrics,
      channelBreakdown: {
        whatsapp: {
          ...campaign.metrics,
          sent: Math.floor(campaign.metrics.sent * 0.6),
          delivered: Math.floor(campaign.metrics.delivered * 0.6)
        },
        email: {
          ...campaign.metrics,
          sent: Math.floor(campaign.metrics.sent * 0.4),
          delivered: Math.floor(campaign.metrics.delivered * 0.4)
        },
        sms: {
          sent: 0, delivered: 0, opened: 0, clicked: 0, converted: 0,
          unsubscribed: 0, bounced: 0, engagementRate: 0, conversionRate: 0,
          deliveryRate: 0, openRate: 0, clickRate: 0, unsubscribeRate: 0
        },
        push_notification: {
          sent: 0, delivered: 0, opened: 0, clicked: 0, converted: 0,
          unsubscribed: 0, bounced: 0, engagementRate: 0, conversionRate: 0,
          deliveryRate: 0, openRate: 0, clickRate: 0, unsubscribeRate: 0
        },
        in_app: {
          sent: 0, delivered: 0, opened: 0, clicked: 0, converted: 0,
          unsubscribed: 0, bounced: 0, engagementRate: 0, conversionRate: 0,
          deliveryRate: 0, openRate: 0, clickRate: 0, unsubscribeRate: 0
        }
      },
      audienceInsights: {
        totalReach: campaign.audience.size,
        uniqueEngagement: Math.floor(campaign.metrics.opened * 0.8),
        segmentPerformance: [],
        demographicBreakdown: {
          'Hombres': 60,
          'Mujeres': 40
        }
      },
      timeSeriesData: [],
      topPerformingContent: []
    };
  }

  static async getROIData(campaignId: string): Promise<ROIData> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const campaign = mockCampaigns.find(c => c.id === campaignId);
    if (!campaign) {
      throw new Error('Campaña no encontrada');
    }

    return {
      campaignId,
      totalCost: campaign.metrics.cost || 0,
      totalRevenue: campaign.metrics.revenue || 0,
      roi: campaign.metrics.roi || 0,
      costPerAcquisition: (campaign.metrics.cost || 0) / (campaign.metrics.converted || 1),
      lifetimeValue: 1500, // Valor promedio de lifetime
      paybackPeriod: 30,
      breakdown: {
        channelCosts: {
          whatsapp: (campaign.metrics.cost || 0) * 0.3,
          email: (campaign.metrics.cost || 0) * 0.2,
          sms: (campaign.metrics.cost || 0) * 0.4,
          push_notification: 0,
          in_app: 0
        },
        channelRevenue: {
          whatsapp: (campaign.metrics.revenue || 0) * 0.6,
          email: (campaign.metrics.revenue || 0) * 0.4,
          sms: 0,
          push_notification: 0,
          in_app: 0
        },
        segmentROI: {},
        timeToConversion: [1, 3, 7, 14, 30]
      }
    };
  }

  // Templates
  static async getMessageTemplates(): Promise<MessageTemplate[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      {
        id: 'template1',
        channel: 'whatsapp',
        title: 'Bienvenida',
        body: 'Hola {{nombre}}, bienvenido a {{gimnasio}}. Estamos emocionados de tenerte con nosotros.',
        variables: ['nombre', 'gimnasio']
      },
      {
        id: 'template2',
        channel: 'email',
        subject: 'Oferta especial para ti',
        body: 'Hola {{nombre}}, tenemos una oferta especial solo para ti...',
        variables: ['nombre']
      }
    ];
  }
}