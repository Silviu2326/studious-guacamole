// API para gestión del Marketing de Referidos

export type RewardType = 'free_sessions' | 'percentage_discount' | 'fixed_discount' | 'content_access';
export type CampaignStatus = 'active' | 'paused' | 'archived';

export interface Reward {
  type: RewardType;
  value: number;
}

export interface ReferralCampaign {
  id: string;
  name: string;
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  referrerReward: Reward;
  referredReward: Reward;
  termsAndConditions?: string;
  stats?: CampaignStats;
}

export interface CampaignStats {
  referrals: number;
  conversions: number;
  conversionRate?: number;
}

export interface ReferralStats {
  totalRevenueFromReferrals: number;
  totalConversions: number;
  conversionRate: number;
  topReferrers: TopReferrer[];
  kpis: {
    participationRate: number;
    cacPerReferral: number;
    avgConversionCycle: number;
  };
}

export interface TopReferrer {
  clientId: string;
  name: string;
  conversions: number;
  referrals: number;
}

// Funciones API simuladas
export const getReferralCampaigns = async (status?: CampaignStatus): Promise<ReferralCampaign[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const campaigns: ReferralCampaign[] = [
    {
      id: 'camp_001',
      name: 'Reto de Enero',
      status: 'active',
      startDate: '2024-01-01T00:00:00Z',
      endDate: '2024-01-31T23:59:59Z',
      referrerReward: {
        type: 'free_sessions',
        value: 2
      },
      referredReward: {
        type: 'percentage_discount',
        value: 20
      },
      termsAndConditions: 'La recompensa se aplica solo cuando el referido contrata un plan mensual.',
      stats: {
        referrals: 50,
        conversions: 12,
        conversionRate: 24
      }
    },
    {
      id: 'camp_002',
      name: 'Operación Verano Fit',
      status: 'active',
      startDate: '2024-06-01T00:00:00Z',
      endDate: '2024-07-31T23:59:59Z',
      referrerReward: {
        type: 'percentage_discount',
        value: 25
      },
      referredReward: {
        type: 'fixed_discount',
        value: 50
      },
      stats: {
        referrals: 85,
        conversions: 28,
        conversionRate: 32.9
      }
    },
    {
      id: 'camp_003',
      name: 'Propósitos de Año Nuevo',
      status: 'paused',
      startDate: '2023-12-01T00:00:00Z',
      endDate: '2024-02-29T23:59:59Z',
      referrerReward: {
        type: 'content_access',
        value: 1
      },
      referredReward: {
        type: 'free_sessions',
        value: 1
      },
      stats: {
        referrals: 120,
        conversions: 35,
        conversionRate: 29.2
      }
    }
  ];

  if (status) {
    return campaigns.filter(c => c.status === status);
  }

  return campaigns;
};

export const createReferralCampaign = async (campaignData: Omit<ReferralCampaign, 'id' | 'stats'>): Promise<ReferralCampaign> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return {
    id: `camp_${Date.now()}`,
    ...campaignData,
    stats: {
      referrals: 0,
      conversions: 0,
      conversionRate: 0
    }
  };
};

export const updateReferralCampaign = async (
  campaignId: string,
  updateData: Partial<ReferralCampaign>
): Promise<ReferralCampaign> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const campaigns = await getReferralCampaigns();
  const existing = campaigns.find(c => c.id === campaignId);
  
  if (!existing) {
    throw new Error('Campaña no encontrada');
  }

  return {
    ...existing,
    ...updateData
  };
};

export const getReferralStats = async (range?: 'last7days' | 'last30days' | 'allTime'): Promise<ReferralStats> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return {
    totalRevenueFromReferrals: 15400.5,
    totalConversions: 75,
    conversionRate: 0.28,
    topReferrers: [
      {
        clientId: 'cli_001',
        name: 'Laura Gómez',
        conversions: 8,
        referrals: 12
      },
      {
        clientId: 'cli_002',
        name: 'Carlos Ruiz',
        conversions: 6,
        referrals: 9
      },
      {
        clientId: 'cli_003',
        name: 'Ana Martínez',
        conversions: 5,
        referrals: 7
      },
      {
        clientId: 'cli_004',
        name: 'Miguel Torres',
        conversions: 4,
        referrals: 8
      },
      {
        clientId: 'cli_005',
        name: 'Sofía López',
        conversions: 3,
        referrals: 5
      }
    ],
    kpis: {
      participationRate: 42.5,
      cacPerReferral: 18.50,
      avgConversionCycle: 7.2
    }
  };
};

export const getRewardTypeLabel = (type: RewardType): string => {
  const labels = {
    free_sessions: 'Sesiones Gratis',
    percentage_discount: 'Descuento Porcentual',
    fixed_discount: 'Descuento Fijo',
    content_access: 'Acceso a Contenido'
  };
  return labels[type];
};

export const getStatusLabel = (status: CampaignStatus): string => {
  const labels = {
    active: 'Activa',
    paused: 'Pausada',
    archived: 'Archivada'
  };
  return labels[status];
};

export const getStatusColor = (status: CampaignStatus): string => {
  const colors = {
    active: 'text-green-700 bg-green-50',
    paused: 'text-yellow-700 bg-yellow-50',
    archived: 'text-gray-700 bg-gray-50'
  };
  return colors[status];
};




















