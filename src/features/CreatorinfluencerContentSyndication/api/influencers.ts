// API para gestión de influencers y campañas

export interface Influencer {
  id: string;
  name: string;
  niche: string;
  followerCount: number;
  engagementRate?: number;
  socialLinks: {
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    twitter?: string;
    [key: string]: string | undefined;
  };
  email?: string;
  phone?: string;
  notes?: string;
  activeCampaigns: number;
  totalCampaigns?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Campaign {
  id: string;
  influencerId: string;
  influencer?: Influencer;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  agreementType: 'service_exchange' | 'fixed_payment' | 'commission' | 'free';
  agreementDetails?: string;
  startDate: string;
  endDate?: string;
  trackingLink?: string;
  promoCode?: string;
  deliverables: CampaignDeliverable[];
  createdAt: string;
  updatedAt?: string;
}

export interface CampaignDeliverable {
  id: string;
  type: 'post' | 'story' | 'reel' | 'video' | 'other';
  description: string;
  status: 'pending' | 'completed' | 'approved';
  dueDate?: string;
  completedDate?: string;
  link?: string;
  notes?: string;
}

export interface CampaignStats {
  campaignId: string;
  clicks: number;
  leadsGenerated: number;
  conversions: number;
  revenue: number;
  cpa: number; // Cost per Acquisition
  roi: number; // Return on Investment (%)
  promoCodeUsage?: number;
  trackingLinkClicks?: number;
}

export interface CampaignFormData {
  name: string;
  description?: string;
  influencerId: string;
  agreementType: 'service_exchange' | 'fixed_payment' | 'commission' | 'free';
  agreementDetails?: string;
  startDate: string;
  endDate?: string;
  deliverables?: Partial<CampaignDeliverable>[];
}

// Funciones API simuladas (a implementar con backend real)
export const getInfluencers = async (filters?: {
  sortBy?: string;
  filterByNiche?: string;
}): Promise<Influencer[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const mockInfluencers: Influencer[] = [
    {
      id: 'inf_1',
      name: 'FitLife Maria',
      niche: 'Calistenia',
      followerCount: 150000,
      engagementRate: 4.2,
      socialLinks: {
        instagram: 'https://instagram.com/fitlifemaria',
        youtube: 'https://youtube.com/fitlifemaria'
      },
      email: 'maria@fitlife.com',
      activeCampaigns: 1,
      totalCampaigns: 3,
      createdAt: '2023-10-01T10:00:00Z'
    },
    {
      id: 'inf_2',
      name: 'Keto Coach Kevin',
      niche: 'Nutrición Keto',
      followerCount: 75000,
      engagementRate: 5.8,
      socialLinks: {
        instagram: 'https://instagram.com/ketocoachkevin',
        youtube: 'https://youtube.com/ketocoachkevin'
      },
      email: 'kevin@ketocoach.com',
      activeCampaigns: 0,
      totalCampaigns: 2,
      createdAt: '2023-09-15T14:30:00Z'
    },
    {
      id: 'inf_3',
      name: 'Carlos Functional',
      niche: 'Entrenamiento Funcional',
      followerCount: 50000,
      engagementRate: 6.1,
      socialLinks: {
        instagram: 'https://instagram.com/carlosfunctional',
        tiktok: 'https://tiktok.com/@carlosfunctional'
      },
      email: 'carlos@functional.com',
      activeCampaigns: 1,
      totalCampaigns: 1,
      createdAt: '2023-10-20T09:00:00Z'
    }
  ];
  
  let filtered = [...mockInfluencers];
  
  if (filters?.filterByNiche) {
    filtered = filtered.filter(inf => 
      inf.niche.toLowerCase().includes(filters.filterByNiche!.toLowerCase())
    );
  }
  
  if (filters?.sortBy) {
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'followerCount':
          return b.followerCount - a.followerCount;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }
  
  return filtered;
};

export const createInfluencer = async (
  influencerData: Omit<Influencer, 'id' | 'activeCampaigns' | 'createdAt'>
): Promise<Influencer> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newInfluencer: Influencer = {
    id: `inf_${Date.now()}`,
    ...influencerData,
    activeCampaigns: 0,
    createdAt: new Date().toISOString()
  };
  
  return newInfluencer;
};

export const updateInfluencer = async (
  influencerId: string,
  updates: Partial<Influencer>
): Promise<Influencer> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: PUT /api/marketing/influencers/{id}
  const updated: Influencer = {
    id: influencerId,
    name: updates.name || 'Influencer Actualizado',
    niche: updates.niche || 'Fitness',
    followerCount: updates.followerCount || 0,
    socialLinks: updates.socialLinks || {},
    activeCampaigns: 0
  };
  
  return updated;
};

export const deleteInfluencer = async (influencerId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  console.log('Eliminando influencer:', influencerId);
};

export const getCampaigns = async (filters?: {
  influencerId?: string;
  status?: string;
}): Promise<Campaign[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const mockCampaigns: Campaign[] = [
    {
      id: 'camp_123',
      influencerId: 'inf_1',
      name: "Lanzamiento Programa 'Abs de Acero'",
      description: 'Campaña para promocionar el nuevo programa de core',
      status: 'active',
      agreementType: 'service_exchange',
      agreementDetails: '3 meses de coaching premium a cambio de 2 posts en el feed, 5 stories con enlace y 1 Reel tutorial',
      startDate: '2023-10-15T00:00:00Z',
      endDate: '2023-11-15T00:00:00Z',
      trackingLink: 'https://trainererp.com/landing/abs-acero?ref=fitlifemaria',
      promoCode: 'MARIA15',
      deliverables: [
        {
          id: 'del_1',
          type: 'post',
          description: 'Post 1/2 en feed',
          status: 'completed',
          completedDate: '2023-10-18T10:00:00Z',
          link: 'https://instagram.com/p/example1'
        },
        {
          id: 'del_2',
          type: 'story',
          description: 'Story 1/5',
          status: 'completed',
          completedDate: '2023-10-20T15:30:00Z'
        },
        {
          id: 'del_3',
          type: 'story',
          description: 'Story 2/5',
          status: 'pending'
        },
        {
          id: 'del_4',
          type: 'reel',
          description: 'Reel tutorial',
          status: 'pending'
        }
      ],
      createdAt: '2023-10-15T09:00:00Z'
    },
    {
      id: 'camp_456',
      influencerId: 'inf_3',
      name: "Lanzamiento Programa Funtional-8S",
      description: 'Campaña para nuevo programa de 8 semanas',
      status: 'active',
      agreementType: 'service_exchange',
      agreementDetails: '3 meses de acceso gratuito al plan premium',
      startDate: '2023-10-20T00:00:00Z',
      trackingLink: 'https://trainererp.com/funcional-8s?ref=carlosfunctional',
      promoCode: 'CARLOS20',
      deliverables: [
        {
          id: 'del_5',
          type: 'post',
          description: 'Post 1/2',
          status: 'pending'
        },
        {
          id: 'del_6',
          type: 'story',
          description: 'Stories 1/5',
          status: 'pending'
        }
      ],
      createdAt: '2023-10-20T09:00:00Z'
    }
  ];
  
  let filtered = [...mockCampaigns];
  
  if (filters?.influencerId) {
    filtered = filtered.filter(c => c.influencerId === filters.influencerId);
  }
  
  if (filters?.status) {
    filtered = filtered.filter(c => c.status === filters.status);
  }
  
  return filtered;
};

export const createCampaign = async (
  campaignData: CampaignFormData
): Promise<Campaign> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Generar tracking link y promo code automáticamente
  const baseUrl = 'https://trainererp.com';
  const campaignSlug = campaignData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const influencerRef = campaignData.influencerId.slice(-6);
  
  const newCampaign: Campaign = {
    id: `camp_${Date.now()}`,
    influencerId: campaignData.influencerId,
    name: campaignData.name,
    description: campaignData.description,
    status: 'active',
    agreementType: campaignData.agreementType,
    agreementDetails: campaignData.agreementDetails,
    startDate: campaignData.startDate,
    endDate: campaignData.endDate,
    trackingLink: `${baseUrl}/landing/${campaignSlug}?ref=${influencerRef}`,
    promoCode: `${influencerRef.toUpperCase()}${Math.floor(Math.random() * 100)}`,
    deliverables: campaignData.deliverables?.map((del, idx) => ({
      id: `del_${Date.now()}_${idx}`,
      type: del.type || 'post',
      description: del.description || `Entregable ${idx + 1}`,
      status: 'pending',
      dueDate: del.dueDate
    })) || [],
    createdAt: new Date().toISOString()
  };
  
  return newCampaign;
};

export const updateCampaign = async (
  campaignId: string,
  updates: Partial<Campaign>
): Promise<Campaign> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: PUT /api/marketing/campaigns/{id}
  const campaigns = await getCampaigns();
  const existing = campaigns.find(c => c.id === campaignId);
  
  if (!existing) {
    throw new Error('Campaña no encontrada');
  }
  
  return {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString()
  };
};

export const getCampaignStats = async (
  campaignId: string
): Promise<CampaignStats> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Datos de ejemplo basados en el documento
  const stats: CampaignStats = {
    campaignId,
    clicks: 1250,
    leadsGenerated: 98,
    conversions: 15,
    revenue: 2388,
    cpa: 30,
    roi: 430,
    promoCodeUsage: 15,
    trackingLinkClicks: 1250
  };
  
  return stats;
};

export const deleteCampaign = async (campaignId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  console.log('Eliminando campaña:', campaignId);
};























