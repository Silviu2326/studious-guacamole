// API para gestión de Partnerships & Influencers

export type PartnerType = 'professional' | 'influencer';
export type PartnerStatus = 'active' | 'inactive';
export type ReferralDirection = 'sent' | 'received';
export type ReferralStatus = 'pending' | 'converted' | 'rejected';
export type CommissionType = 'percentage' | 'fixed';
export type PayoutStatus = 'due' | 'paid';

export interface Contact {
  email?: string;
  phone?: string;
  instagram?: string;
  website?: string;
}

export interface Agreement {
  commissionType: CommissionType;
  commissionValue: number;
  terms?: string;
  effectiveDate: string;
}

export interface Partner {
  id: string;
  name: string;
  type: PartnerType;
  specialty?: string;
  contact: Contact;
  agreement: Agreement;
  status: PartnerStatus;
  stats?: PartnerStats;
}

export interface PartnerStats {
  totalReferrals: number;
  totalConversions: number;
  totalCommissions: number;
  conversionRate: number;
}

export interface Referral {
  id: string;
  partnerId: string;
  partnerName: string;
  clientName: string;
  clientEmail?: string;
  direction: ReferralDirection;
  status: ReferralStatus;
  conversionDate?: string;
  commission: number;
  trackingCode: string;
}

export interface Payout {
  id: string;
  partnerId: string;
  partnerName: string;
  amount: number;
  status: PayoutStatus;
  paymentDate?: string;
  relatedReferralIds: string[];
}

export interface PartnershipsKPI {
  totalActivePartners: number;
  totalCommissionsGenerated: number;
  totalCommissionsPending: number;
  totalRevenueFromReferrals: number;
  topPartners: TopPartner[];
  conversionStats: {
    sent: {
      total: number;
      converted: number;
      rate: number;
    };
    received: {
      total: number;
      converted: number;
      rate: number;
    };
  };
}

export interface TopPartner {
  id: string;
  name: string;
  conversions: number;
  commissions: number;
  type: PartnerType;
}

// Funciones API simuladas
export const getPartners = async (
  type?: PartnerType,
  status?: PartnerStatus
): Promise<Partner[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  const partners: Partner[] = [
    {
      id: 'part_001',
      name: 'Ana Morales - Nutricionista',
      type: 'professional',
      specialty: 'Nutrición Deportiva',
      contact: {
        email: 'ana@nutricion.com',
        phone: '+34 600 123 456'
      },
      agreement: {
        commissionType: 'percentage',
        commissionValue: 15,
        effectiveDate: '2024-01-01T00:00:00Z'
      },
      status: 'active',
      stats: {
        totalReferrals: 15,
        totalConversions: 10,
        totalCommissions: 450,
        conversionRate: 66.7
      }
    },
    {
      id: 'part_002',
      name: 'Carlos Ruiz - Fisioterapeuta',
      type: 'professional',
      specialty: 'Rehabilitación Deportiva',
      contact: {
        email: 'carlos@fisio.com',
        phone: '+34 600 789 012'
      },
      agreement: {
        commissionType: 'fixed',
        commissionValue: 50,
        effectiveDate: '2024-02-01T00:00:00Z'
      },
      status: 'active',
      stats: {
        totalReferrals: 8,
        totalConversions: 6,
        totalCommissions: 300,
        conversionRate: 75
      }
    },
    {
      id: 'part_003',
      name: 'María Fitness - Influencer',
      type: 'influencer',
      specialty: 'Fitness & Wellness',
      contact: {
        email: 'maria@influencer.com',
        instagram: '@mariafitness'
      },
      agreement: {
        commissionType: 'percentage',
        commissionValue: 20,
        effectiveDate: '2024-03-01T00:00:00Z'
      },
      status: 'active',
      stats: {
        totalReferrals: 45,
        totalConversions: 28,
        totalCommissions: 1200,
        conversionRate: 62.2
      }
    },
    {
      id: 'part_004',
      name: 'Dr. Laura Hernández - Psicología Deportiva',
      type: 'professional',
      specialty: 'Psicología del Deporte',
      contact: {
        email: 'laura@psicodeportiva.com',
        phone: '+34 600 345 678'
      },
      agreement: {
        commissionType: 'percentage',
        commissionValue: 12,
        effectiveDate: '2024-04-01T00:00:00Z'
      },
      status: 'active',
      stats: {
        totalReferrals: 5,
        totalConversions: 4,
        totalCommissions: 240,
        conversionRate: 80
      }
    }
  ];

  let filtered = partners;
  if (type) {
    filtered = filtered.filter(p => p.type === type);
  }
  if (status) {
    filtered = filtered.filter(p => p.status === status);
  }

  return filtered;
};

export const createPartner = async (
  partnerData: Omit<Partner, 'id' | 'stats'>
): Promise<Partner> => {
  await new Promise(resolve => setTimeout(resolve, 600));

  return {
    id: `part_${Date.now()}`,
    ...partnerData,
    stats: {
      totalReferrals: 0,
      totalConversions: 0,
      totalCommissions: 0,
      conversionRate: 0
    }
  };
};

export const updatePartner = async (
  partnerId: string,
  updateData: Partial<Partner>
): Promise<Partner> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const partners = await getPartners();
  const existing = partners.find(p => p.id === partnerId);

  if (!existing) {
    throw new Error('Partner no encontrado');
  }

  return {
    ...existing,
    ...updateData
  };
};

export const generateReferralLink = async (partnerId: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  return `https://trainererp.com/signup?ref=${partnerId}_${Date.now()}`;
};

export const getReferrals = async (
  partnerId?: string,
  direction?: ReferralDirection
): Promise<Referral[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  const referrals: Referral[] = [
    {
      id: 'ref_001',
      partnerId: 'part_001',
      partnerName: 'Ana Morales - Nutricionista',
      clientName: 'Lucía Pérez',
      clientEmail: 'lucia@example.com',
      direction: 'sent',
      status: 'converted',
      conversionDate: '2024-01-15T10:00:00Z',
      commission: 45,
      trackingCode: 'ABC123'
    },
    {
      id: 'ref_002',
      partnerId: 'part_003',
      partnerName: 'María Fitness - Influencer',
      clientName: 'Pedro González',
      clientEmail: 'pedro@example.com',
      direction: 'received',
      status: 'converted',
      conversionDate: '2024-03-20T14:30:00Z',
      commission: 80,
      trackingCode: 'XYZ789'
    },
    {
      id: 'ref_003',
      partnerId: 'part_002',
      partnerName: 'Carlos Ruiz - Fisioterapeuta',
      clientName: 'Sofía Martínez',
      clientEmail: 'sofia@example.com',
      direction: 'sent',
      status: 'pending',
      commission: 0,
      trackingCode: 'DEF456'
    }
  ];

  let filtered = referrals;
  if (partnerId) {
    filtered = filtered.filter(r => r.partnerId === partnerId);
  }
  if (direction) {
    filtered = filtered.filter(r => r.direction === direction);
  }

  return filtered;
};

export const getPartnershipsKPI = async (): Promise<PartnershipsKPI> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  return {
    totalActivePartners: 4,
    totalCommissionsGenerated: 2190,
    totalCommissionsPending: 850,
    totalRevenueFromReferrals: 15200,
    topPartners: [
      {
        id: 'part_003',
        name: 'María Fitness - Influencer',
        conversions: 28,
        commissions: 1200,
        type: 'influencer'
      },
      {
        id: 'part_001',
        name: 'Ana Morales - Nutricionista',
        conversions: 10,
        commissions: 450,
        type: 'professional'
      },
      {
        id: 'part_002',
        name: 'Carlos Ruiz - Fisioterapeuta',
        conversions: 6,
        commissions: 300,
        type: 'professional'
      },
      {
        id: 'part_004',
        name: 'Dr. Laura Hernández - Psicología Deportiva',
        conversions: 4,
        commissions: 240,
        type: 'professional'
      }
    ],
    conversionStats: {
      sent: {
        total: 68,
        converted: 40,
        rate: 58.8
      },
      received: {
        total: 15,
        converted: 12,
        rate: 80
      }
    }
  };
};

export const getPartnerTypeLabel = (type: PartnerType): string => {
  const labels = {
    professional: 'Profesional',
    influencer: 'Influencer'
  };
  return labels[type];
};

export const getPartnerStatusLabel = (status: PartnerStatus): string => {
  const labels = {
    active: 'Activo',
    inactive: 'Inactivo'
  };
  return labels[status];
};

export const getPartnerStatusColor = (status: PartnerStatus): string => {
  const colors = {
    active: 'text-green-700 bg-green-50',
    inactive: 'text-gray-700 bg-gray-50'
  };
  return colors[status];
};

export const getReferralDirectionLabel = (direction: ReferralDirection): string => {
  const labels = {
    sent: 'Enviado',
    received: 'Recibido'
  };
  return labels[direction];
};

export const getReferralStatusLabel = (status: ReferralStatus): string => {
  const labels = {
    pending: 'Pendiente',
    converted: 'Convertido',
    rejected: 'Rechazado'
  };
  return labels[status];
};

export const getReferralStatusColor = (status: ReferralStatus): string => {
  const colors = {
    pending: 'text-yellow-700 bg-yellow-50',
    converted: 'text-green-700 bg-green-50',
    rejected: 'text-red-700 bg-red-50'
  };
  return colors[status];
};








