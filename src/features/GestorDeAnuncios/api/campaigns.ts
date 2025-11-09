// API para gestión de campañas publicitarias

export interface Campaign {
  id: string;
  name: string;
  platform: 'meta' | 'google';
  status: 'active' | 'paused' | 'pending_review' | 'error';
  externalId?: string;
  objective: string;
  summary: {
    spend: number;
    cpl: number;
    conversions: number;
  };
}

export interface CampaignDetails extends Campaign {
  dailyBudget: number;
  startDate: string;
  endDate?: string;
  audience: {
    location: string;
    demographics: {
      ageMin: number;
      ageMax: number;
      gender?: string[];
    };
    interests: string[];
  };
  creative: {
    headline: string;
    description: string;
    imageUrl: string;
  };
  metrics: {
    impressions: number;
    clicks: number;
    ctr: string;
    cpc: number;
    roas: number;
  };
}

export interface PerformanceMetrics {
  total: {
    spend: number;
    conversions: number;
    cpl: number;
    clicks: number;
    ctr: string;
    roas: number;
  };
  dailyBreakdown: {
    date: string;
    spend: number;
    conversions: number;
    clicks: number;
  }[];
}

export interface AdAccount {
  id: string;
  platform: 'meta' | 'google';
  name: string;
  accountId: string;
  status: 'connected' | 'disconnected' | 'error';
  connectedAt: string;
}

// Simulaciones de llamadas API
export const getCampaigns = async (platform?: string, status?: string): Promise<Campaign[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      id: 'camp_abc123',
      name: 'Campaña Leads Locales - Enero',
      platform: 'meta',
      status: 'active',
      externalId: '1234567890123',
      objective: 'Captar Leads',
      summary: {
        spend: 150.75,
        cpl: 12.56,
        conversions: 12
      }
    },
    {
      id: 'camp_xyz456',
      name: 'Reto de Verano 2024',
      platform: 'google',
      status: 'active',
      objective: 'Promocionar Reto',
      summary: {
        spend: 280.50,
        cpl: 9.35,
        conversions: 30
      }
    },
    {
      id: 'camp_def789',
      name: 'Webinar Nutrición',
      platform: 'meta',
      status: 'paused',
      objective: 'Registraciones',
      summary: {
        spend: 45.00,
        cpl: 15.00,
        conversions: 3
      }
    }
  ];
};

export const getCampaignDetails = async (id: string): Promise<CampaignDetails | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const campaigns = await getCampaigns();
  const campaign = campaigns.find(c => c.id === id);
  
  if (!campaign) return null;
  
  return {
    ...campaign,
    dailyBudget: 50,
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    audience: {
      location: 'Madrid, España',
      demographics: {
        ageMin: 25,
        ageMax: 45,
        gender: ['women']
      },
      interests: ['Fitness', 'Gimnasios', 'Comida saludable']
    },
    creative: {
      headline: 'Transforma tu cuerpo en 12 semanas',
      description: 'Únete a nuestro programa personalizado y logra resultados reales.',
      imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f'
    },
    metrics: {
      impressions: 12500,
      clicks: 450,
      ctr: '3.6%',
      cpc: 0.34,
      roas: 4.2
    }
  };
};

export const createCampaign = async (campaignData: Partial<CampaignDetails>): Promise<Campaign> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newCampaign: Campaign = {
    id: `camp_${Date.now()}`,
    name: campaignData.name || 'Nueva Campaña',
    platform: campaignData.platform || 'meta',
    status: 'pending_review',
    externalId: Math.random().toString(36).substr(2, 15),
    objective: campaignData.objective || 'Captar Leads',
    summary: {
      spend: 0,
      cpl: 0,
      conversions: 0
    }
  };
  
  return newCampaign;
};

export const updateCampaign = async (id: string, updateData: Partial<Campaign>): Promise<Campaign> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const campaigns = await getCampaigns();
  const campaign = campaigns.find(c => c.id === id);
  
  if (!campaign) {
    throw new Error('Campaña no encontrada');
  }
  
  return { ...campaign, ...updateData };
};

export const getPerformance = async (
  startDate: string,
  endDate: string,
  campaignId?: string
): Promise<PerformanceMetrics> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return {
    total: {
      spend: 1200.5,
      conversions: 85,
      cpl: 14.12,
      clicks: 1523,
      ctr: '2.15%',
      roas: 4.8
    },
    dailyBreakdown: [
      { date: '2024-01-26', spend: 75.1, conversions: 5, clicks: 95 },
      { date: '2024-01-27', spend: 80.2, conversions: 7, clicks: 102 },
      { date: '2024-01-28', spend: 85.5, conversions: 6, clicks: 110 },
      { date: '2024-01-29', spend: 70.3, conversions: 4, clicks: 88 },
      { date: '2024-01-30', spend: 92.1, conversions: 8, clicks: 120 }
    ]
  };
};

export const getAdAccounts = async (): Promise<AdAccount[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return [
    {
      id: 'acc_meta1',
      platform: 'meta',
      name: 'Cuenta Meta Principal',
      accountId: 'act_123456789',
      status: 'connected',
      connectedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 'acc_google1',
      platform: 'google',
      name: 'Cuenta Google Ads',
      accountId: '123-456-7890',
      status: 'connected',
      connectedAt: '2024-01-20T14:15:00Z'
    }
  ];
};

export const connectAdAccount = async (platform: 'meta' | 'google'): Promise<{ redirectUrl: string }> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción, esto generaría una URL real de OAuth
  const oauthUrls = {
    meta: 'https://www.facebook.com/v18.0/dialog/oauth?client_id=...',
    google: 'https://accounts.google.com/o/oauth2/auth?client_id=...'
  };
  
  return {
    redirectUrl: oauthUrls[platform]
  };
};

export const deleteCampaign = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  console.log('Eliminando campaña:', id);
};












