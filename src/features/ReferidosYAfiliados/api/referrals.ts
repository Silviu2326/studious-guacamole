// API para gestión de Referidos & Afiliados

export type ProgramType = 'client_referral' | 'affiliate';
export type RewardType = 'discount_percentage' | 'discount_amount' | 'free_session' | 'credit';
export type ReferralStatus = 'pending' | 'completed' | 'rewarded';

export interface RewardConfig {
  type: RewardType;
  referrer_value?: number;
  referee_value?: number;
  description?: string;
}

export interface ReferralProgram {
  id: string;
  trainerId: string;
  type: ProgramType;
  name: string;
  isActive: boolean;
  reward: RewardConfig;
  terms?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReferralOverview {
  kpis: {
    totalConversions: number;
    totalRevenue: number;
    conversionRate: number;
    referralCAC: number;
    participationRate: number;
  };
  topReferrers: {
    clientId: string;
    name: string;
    conversions: number;
    earnedAmount?: number;
  }[];
  topAffiliates: {
    affiliateId: string;
    name: string;
    revenue: number;
    conversions: number;
  }[];
}

export interface UserReferralData {
  userType: 'client' | 'affiliate';
  referralCode: string;
  referralLink: string;
  stats: {
    clicks: number;
    signups: number;
    pendingRewards: number;
    earnedRewards: string;
    conversions: number;
  };
  activity: {
    referredName: string;
    status: ReferralStatus;
    date: string;
    rewardAmount?: number;
  }[];
}

export interface Payout {
  payoutId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  amount: number;
  currency: string;
  affiliateId: string;
  createdAt: string;
}

// Funciones API simuladas
export const createReferralProgram = async (programData: Omit<ReferralProgram, 'id'>): Promise<ReferralProgram> => {
  await new Promise(resolve => setTimeout(resolve, 600));

  return {
    id: `prog_${Date.now()}`,
    ...programData,
    createdAt: new Date().toISOString()
  };
};

export const getReferralPrograms = async (): Promise<ReferralProgram[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  return [
    {
      id: 'prog_001',
      trainerId: 'trainer_123',
      type: 'client_referral',
      name: 'Referidos Verano 2024',
      isActive: true,
      reward: {
        type: 'discount_percentage',
        referrer_value: 25,
        referee_value: 25,
        description: '25% de descuento para ambos'
      },
      terms: 'La recompensa se aplica una vez que tu amigo complete su primer mes de pago',
      createdAt: '2024-05-21T10:00:00Z'
    },
    {
      id: 'prog_002',
      trainerId: 'trainer_123',
      type: 'affiliate',
      name: 'Programa Nutricionistas',
      isActive: true,
      reward: {
        type: 'credit',
        referrer_value: 150,
        description: '150€ de crédito por cada cliente que complete 3 meses'
      },
      terms: 'Comisión del 15% sobre los primeros 3 meses',
      createdAt: '2024-05-15T09:00:00Z'
    },
    {
      id: 'prog_003',
      trainerId: 'trainer_123',
      type: 'client_referral',
      name: 'Recompensa Doble 2024',
      isActive: false,
      reward: {
        type: 'free_session',
        referrer_value: 1,
        referee_value: 2,
        description: '1 sesión gratis para ti, 2 para tu amigo'
      },
      createdAt: '2024-01-01T00:00:00Z'
    }
  ];
};

export const getReferralOverview = async (timeframe: string = '30d'): Promise<ReferralOverview> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  return {
    kpis: {
      totalConversions: 42,
      totalRevenue: 4200.50,
      conversionRate: 15.5,
      referralCAC: 15.75,
      participationRate: 38.2
    },
    topReferrers: [
      {
        clientId: 'client_abc',
        name: 'Ana García',
        conversions: 5,
        earnedAmount: 125
      },
      {
        clientId: 'client_def',
        name: 'Carlos Ruiz',
        conversions: 3,
        earnedAmount: 75
      },
      {
        clientId: 'client_ghi',
        name: 'Maria López',
        conversions: 2,
        earnedAmount: 50
      }
    ],
    topAffiliates: [
      {
        affiliateId: 'aff_xyz',
        name: 'NutriFit Pro',
        revenue: 1200,
        conversions: 8
      },
      {
        affiliateId: 'aff_abc',
        name: 'FisioCenter Madrid',
        revenue: 800,
        conversions: 5
      }
    ]
  };
};

export const getUserReferralData = async (userId: string): Promise<UserReferralData> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  return {
    userType: 'client',
    referralCode: 'ANAGARCIA25',
    referralLink: 'https://trainererp.com/signup?ref=anagarcia25',
    stats: {
      clicks: 58,
      signups: 5,
      pendingRewards: 1,
      earnedRewards: '4 sesiones gratis',
      conversions: 4
    },
    activity: [
      {
        referredName: 'Laura M.',
        status: 'rewarded',
        date: '2024-04-15',
        rewardAmount: 25
      },
      {
        referredName: 'Pedro S.',
        status: 'completed',
        date: '2024-05-18',
        rewardAmount: 25
      },
      {
        referredName: 'Juan C.',
        status: 'pending',
        date: '2024-05-20'
      }
    ]
  };
};

export const getAffiliateReferralData = async (affiliateId: string): Promise<UserReferralData> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  return {
    userType: 'affiliate',
    referralCode: 'NUTRIFIT001',
    referralLink: 'https://trainererp.com/signup?aff=nutrifit001',
    stats: {
      clicks: 156,
      signups: 12,
      pendingRewards: 3,
      earnedRewards: '€900',
      conversions: 8
    },
    activity: [
      {
        referredName: 'Cliente A',
        status: 'completed',
        date: '2024-04-10',
        rewardAmount: 150
      },
      {
        referredName: 'Cliente B',
        status: 'completed',
        date: '2024-04-25',
        rewardAmount: 150
      },
      {
        referredName: 'Cliente C',
        status: 'pending',
        date: '2024-05-15'
      }
    ]
  };
};

export const createAffiliatePayout = async (
  affiliateId: string,
  amount: number,
  commissionIds: string[]
): Promise<Payout> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    payoutId: `pay_${Date.now()}`,
    status: 'processing',
    amount,
    currency: 'EUR',
    affiliateId,
    createdAt: new Date().toISOString()
  };
};

export const getRewardTypeLabel = (type: RewardType): string => {
  const labels = {
    discount_percentage: 'Descuento %',
    discount_amount: 'Descuento €',
    free_session: 'Sesión Gratis',
    credit: 'Crédito'
  };
  return labels[type];
};

export const getProgramTypeLabel = (type: ProgramType): string => {
  const labels = {
    client_referral: 'Referidos de Clientes',
    affiliate: 'Programa de Afiliados'
  };
  return labels[type];
};

export const getReferralStatusLabel = (status: ReferralStatus): string => {
  const labels = {
    pending: 'Pendiente',
    completed: 'Completado',
    rewarded: 'Recompensado'
  };
  return labels[status];
};

export const getReferralStatusColor = (status: ReferralStatus): string => {
  const colors = {
    pending: 'text-yellow-700 bg-yellow-50',
    completed: 'text-blue-700 bg-blue-50',
    rewarded: 'text-green-700 bg-green-50'
  };
  return colors[status];
};












