// API para gestión de Promociones, Cupones & Packs

export type OfferType = 'coupon' | 'pack' | 'automatic';
export type DiscountType = 'percentage' | 'fixed_amount';
export type OfferStatus = 'active' | 'inactive' | 'expired' | 'scheduled';

export interface Offer {
  id: string;
  name: string;
  type: OfferType;
  code?: string;
  discountType: DiscountType;
  discountValue: number;
  usageLimit?: number;
  usageCount: number;
  validFrom: string;
  validTo?: string;
  applicableServiceIds?: string[];
  applicableServices?: string[];
  status: OfferStatus;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OfferStats {
  redemptionRate: number;
  totalRevenue: number;
  newClientsAcquired: number;
  avgOrderValueWithDiscount: number;
  avgOrderValueWithoutDiscount: number;
  topOffers: TopOffer[];
  totalActiveOffers: number;
}

export interface TopOffer {
  id: string;
  name: string;
  usageCount: number;
  revenue: number;
  type: OfferType;
}

export interface OfferUsage {
  id: string;
  offerId: string;
  offerCode?: string;
  clientId: string;
  clientName: string;
  usedAt: string;
  amount: number;
  serviceName: string;
}

// Funciones API simuladas
export const getOffers = async (
  status?: OfferStatus,
  type?: OfferType,
  page?: number,
  limit?: number
): Promise<Offer[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  const offers: Offer[] = [
    {
      id: 'offer_001',
      name: 'Pack Bienvenida',
      type: 'pack',
      discountType: 'fixed_amount',
      discountValue: 250,
      usageCount: 15,
      validFrom: '2024-01-01T00:00:00Z',
      applicableServices: ['Entrenamiento Personal', 'Asesoría Nutricional'],
      status: 'active',
      description: 'Pack especial para nuevos clientes'
    },
    {
      id: 'offer_002',
      name: 'Campaña Año Nuevo 2025',
      type: 'coupon',
      code: 'PROPOSITO25',
      discountType: 'percentage',
      discountValue: 20,
      usageLimit: 30,
      usageCount: 28,
      validFrom: '2024-01-01T00:00:00Z',
      validTo: '2024-01-31T23:59:59Z',
      applicableServices: ['Plan de Entrenamiento Mensual'],
      status: 'active'
    },
    {
      id: 'offer_003',
      name: 'Flash Sale 48h',
      type: 'coupon',
      code: 'FLASH30',
      discountType: 'percentage',
      discountValue: 30,
      usageLimit: 50,
      usageCount: 45,
      validFrom: '2024-02-01T00:00:00Z',
      validTo: '2024-02-02T23:59:59Z',
      applicableServices: ['Programa de Transformación 90 días'],
      status: 'expired'
    },
    {
      id: 'offer_004',
      name: 'Pack de 12 Sesiones',
      type: 'pack',
      discountType: 'percentage',
      discountValue: 15,
      usageCount: 8,
      validFrom: '2024-01-15T00:00:00Z',
      applicableServices: ['Sesiones Individuales'],
      status: 'active',
      description: 'Ahorra 15% comprando 12 sesiones de una vez'
    },
    {
      id: 'offer_005',
      name: 'Plan Verano Fit',
      type: 'coupon',
      code: 'VERANO20',
      discountType: 'percentage',
      discountValue: 20,
      usageLimit: 100,
      usageCount: 67,
      validFrom: '2024-06-01T00:00:00Z',
      validTo: '2024-08-31T23:59:59Z',
      applicableServices: ['Plan Mensual Online'],
      status: 'scheduled',
      description: 'Descuento especial para el verano'
    }
  ];

  let filtered = offers;
  if (status) {
    filtered = filtered.filter(o => o.status === status);
  }
  if (type) {
    filtered = filtered.filter(o => o.type === type);
  }

  return filtered;
};

export const createOffer = async (offerData: Omit<Offer, 'id' | 'usageCount'>): Promise<Offer> => {
  await new Promise(resolve => setTimeout(resolve, 600));

  return {
    id: `offer_${Date.now()}`,
    ...offerData,
    usageCount: 0,
    createdAt: new Date().toISOString()
  };
};

export const updateOffer = async (offerId: string, updateData: Partial<Offer>): Promise<Offer> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const offers = await getOffers();
  const existing = offers.find(o => o.id === offerId);

  if (!existing) {
    throw new Error('Oferta no encontrada');
  }

  return {
    ...existing,
    ...updateData,
    updatedAt: new Date().toISOString()
  };
};

export const getOfferStats = async (): Promise<OfferStats> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  return {
    redemptionRate: 76.5,
    totalRevenue: 45230.5,
    newClientsAcquired: 156,
    avgOrderValueWithDiscount: 125.5,
    avgOrderValueWithoutDiscount: 180.0,
    totalActiveOffers: 4,
    topOffers: [
      {
        id: 'offer_002',
        name: 'Campaña Año Nuevo 2025',
        usageCount: 28,
        revenue: 11200,
        type: 'coupon'
      },
      {
        id: 'offer_004',
        name: 'Pack de 12 Sesiones',
        usageCount: 8,
        revenue: 8960,
        type: 'pack'
      },
      {
        id: 'offer_003',
        name: 'Flash Sale 48h',
        usageCount: 45,
        revenue: 13500,
        type: 'coupon'
      }
    ]
  };
};

export const getOfferUsage = async (offerId: string): Promise<OfferUsage[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  return [
    {
      id: 'usage_001',
      offerId,
      offerCode: 'PROPOSITO25',
      clientId: 'cli_001',
      clientName: 'Ana García',
      usedAt: '2024-01-05T14:30:00Z',
      amount: 156.5,
      serviceName: 'Plan de Entrenamiento Mensual'
    },
    {
      id: 'usage_002',
      offerId,
      offerCode: 'PROPOSITO25',
      clientId: 'cli_002',
      clientName: 'Carlos Ruiz',
      usedAt: '2024-01-07T10:15:00Z',
      amount: 156.5,
      serviceName: 'Plan de Entrenamiento Mensual'
    }
  ];
};

export const getOfferTypeLabel = (type: OfferType): string => {
  const labels = {
    coupon: 'Cupón',
    pack: 'Pack',
    automatic: 'Automática'
  };
  return labels[type];
};

export const getOfferStatusLabel = (status: OfferStatus): string => {
  const labels = {
    active: 'Activa',
    inactive: 'Inactiva',
    expired: 'Expirada',
    scheduled: 'Programada'
  };
  return labels[status];
};

export const getOfferStatusColor = (status: OfferStatus): string => {
  const colors = {
    active: 'text-green-700 bg-green-50',
    inactive: 'text-gray-700 bg-gray-50',
    expired: 'text-red-700 bg-red-50',
    scheduled: 'text-blue-700 bg-blue-50'
  };
  return colors[status];
};

export const getDiscountTypeLabel = (type: DiscountType): string => {
  const labels = {
    percentage: '%',
    fixed_amount: '€'
  };
  return labels[type];
};










