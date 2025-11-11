// API para gestión del Loyalty Program Manager

export interface LoyaltyRule {
  id: string;
  actionType: 'session_attendance' | 'referral_signup' | 'review_posted' | 'milestone_reached' | 'birthday' | 'purchase';
  description: string;
  points: number;
  isActive: boolean;
}

export interface LoyaltyTier {
  id: string;
  name: string;
  minPoints: number;
  pointMultiplier: number;
  color: string;
}

export interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  type: 'physical' | 'service' | 'digital' | 'discount';
  imageUrl?: string;
  stock?: number;
  isActive: boolean;
}

export interface LoyaltyProgram {
  id: string;
  isActive: boolean;
  programName: string;
  rules: LoyaltyRule[];
  tiers: LoyaltyTier[];
}

export interface LoyaltyStats {
  participationRate: number;
  totalPointsRedeemed: number;
  mostPopularReward: {
    id: string;
    name: string;
    redemptionCount: number;
  };
  redemptionRate: number;
  successfulReferrals: number;
  avgPointsPerClient: number;
}

// Funciones API simuladas
export const getLoyaltyProgram = async (): Promise<LoyaltyProgram> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return {
    id: 'prog_123',
    isActive: true,
    programName: 'Trainer Pro Club',
    rules: [
      {
        id: 'rule_001',
        actionType: 'session_attendance',
        description: 'Asistir a una sesión de entrenamiento',
        points: 10,
        isActive: true
      },
      {
        id: 'rule_002',
        actionType: 'referral_signup',
        description: 'Referir un amigo que se convierte en cliente',
        points: 150,
        isActive: true
      },
      {
        id: 'rule_003',
        actionType: 'review_posted',
        description: 'Dejar una reseña verificada',
        points: 25,
        isActive: true
      },
      {
        id: 'rule_004',
        actionType: 'milestone_reached',
        description: 'Alcanzar un hito o récord personal',
        points: 50,
        isActive: true
      },
      {
        id: 'rule_005',
        actionType: 'birthday',
        description: 'Felicitación de cumpleaños',
        points: 100,
        isActive: true
      },
      {
        id: 'rule_006',
        actionType: 'purchase',
        description: 'Compra de productos o servicios',
        points: 5,
        isActive: false
      }
    ],
    tiers: [
      {
        id: 'tier_bronze',
        name: 'Bronce',
        minPoints: 0,
        pointMultiplier: 1,
        color: '#CD7F32'
      },
      {
        id: 'tier_silver',
        name: 'Plata',
        minPoints: 1000,
        pointMultiplier: 1.2,
        color: '#C0C0C0'
      },
      {
        id: 'tier_gold',
        name: 'Oro',
        minPoints: 3000,
        pointMultiplier: 1.5,
        color: '#FFD700'
      }
    ]
  };
};

export const updateLoyaltyProgram = async (updates: Partial<LoyaltyProgram>): Promise<LoyaltyProgram> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const current = await getLoyaltyProgram();
  return { ...current, ...updates };
};

export const getLoyaltyRewards = async (): Promise<LoyaltyReward[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    {
      id: 'rew_001',
      name: 'Sesión de Entrenamiento Personal Gratis',
      description: 'Una sesión 1-a-1 de 60 minutos con tu entrenador',
      pointsCost: 500,
      type: 'service',
      imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48',
      isActive: true
    },
    {
      id: 'rew_002',
      name: 'Consulta de Nutrición',
      description: 'Consulta personalizada de nutrición deportiva',
      pointsCost: 300,
      type: 'service',
      isActive: true
    },
    {
      id: 'rew_003',
      name: 'Proteína Whey 1kg',
      description: 'Bote de proteína sabor chocolate',
      pointsCost: 1500,
      type: 'physical',
      imageUrl: 'https://images.unsplash.com/photo-1556910096-6f5e72db6803',
      stock: 50,
      isActive: true
    },
    {
      id: 'rew_004',
      name: 'Descuento 10% en Suplementos',
      description: 'Código de descuento del 10% para tu próxima compra',
      pointsCost: 100,
      type: 'discount',
      isActive: true
    },
    {
      id: 'rew_005',
      name: 'Shaker TrainerERP',
      description: 'Shaker oficial de TrainerERP',
      pointsCost: 200,
      type: 'physical',
      imageUrl: 'https://images.unsplash.com/photo-1584713224707-7345c434c006',
      stock: 100,
      isActive: true
    }
  ];
};

export const createLoyaltyReward = async (rewardData: Omit<LoyaltyReward, 'id'>): Promise<LoyaltyReward> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return {
    id: `rew_${Date.now()}`,
    ...rewardData
  };
};

export const deleteLoyaltyReward = async (rewardId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  console.log('Eliminando recompensa:', rewardId);
};

export const getLoyaltyStats = async (): Promise<LoyaltyStats> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return {
    participationRate: 68.5,
    totalPointsRedeemed: 45000,
    mostPopularReward: {
      id: 'rew_004',
      name: 'Descuento 10% en Suplementos',
      redemptionCount: 125
    },
    redemptionRate: 42.3,
    successfulReferrals: 45,
    avgPointsPerClient: 856
  };
};

export const adjustClientPoints = async (
  clientId: string,
  points: number,
  reason: string
): Promise<{ clientId: string; newPointsBalance: number }> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    clientId,
    newPointsBalance: 1200
  };
};















