import {
  AcquisitionSummary,
  ChannelData,
  CampaignsResponse,
  AcquisitionChannel,
  AcquisitionFilters,
} from '../types';

// Mock data - En producción esto vendría de una API real
const generateMockSummary = (isEntrenador: boolean): AcquisitionSummary => {
  if (isEntrenador) {
    // Datos más simples para entrenador personal
    return {
      totalLeads: {
        current: 45,
        previous: 38,
      },
      totalConversions: {
        current: 12,
        previous: 9,
      },
      conversionRate: {
        current: 0.267,
        previous: 0.237,
      },
      cpa: {
        current: 25.5,
        previous: 32.0,
      },
    };
  } else {
    // Datos más complejos para gimnasio
    return {
      totalLeads: {
        current: 150,
        previous: 120,
      },
      totalConversions: {
        current: 15,
        previous: 10,
      },
      conversionRate: {
        current: 0.1,
        previous: 0.083,
      },
      cpa: {
        current: 85.5,
        previous: 92.0,
      },
      roas: {
        current: 4.2,
        previous: 3.8,
      },
      ltv: {
        current: 1200,
        previous: 1150,
      },
    };
  }
};

const generateMockChannels = (isEntrenador: boolean): ChannelData[] => {
  if (isEntrenador) {
    // Canales más orgánicos para entrenador
    return [
      {
        channel: 'instagram / social',
        leads: 20,
        conversions: 6,
        cost: 150,
        cpa: 25.0,
        conversionRate: 0.3,
        revenue: 1800,
        roas: 12.0,
      },
      {
        channel: 'tiktok / social',
        leads: 15,
        conversions: 4,
        cost: 100,
        cpa: 25.0,
        conversionRate: 0.267,
        revenue: 1200,
        roas: 12.0,
      },
      {
        channel: 'referidos / word-of-mouth',
        leads: 7,
        conversions: 2,
        cost: 0,
        cpa: 0,
        conversionRate: 0.286,
        revenue: 600,
        roas: 0,
      },
      {
        channel: 'web personal / organic',
        leads: 3,
        conversions: 0,
        cost: 0,
        cpa: 0,
        conversionRate: 0,
        revenue: 0,
        roas: 0,
      },
    ];
  } else {
    // Canales más complejos para gimnasio
    return [
      {
        channel: 'google / cpc',
        leads: 50,
        conversions: 8,
        cost: 650,
        cpa: 81.25,
        conversionRate: 0.16,
        revenue: 2400,
        roas: 3.69,
        ltv: 1250,
      },
      {
        channel: 'instagram / social',
        leads: 80,
        conversions: 5,
        cost: 500,
        cpa: 100.0,
        conversionRate: 0.063,
        revenue: 1500,
        roas: 3.0,
        ltv: 1100,
      },
      {
        channel: '(direct) / (none)',
        leads: 20,
        conversions: 2,
        cost: 0,
        cpa: 0,
        conversionRate: 0.1,
        revenue: 600,
        roas: 0,
        ltv: 1300,
      },
    ];
  }
};

const generateMockCampaigns = (isEntrenador: boolean): CampaignData[] => {
  if (isEntrenador) {
    return [
      {
        id: 'camp_1',
        name: 'Instagram Stories Verano',
        channel: 'instagram / social',
        cost: 150,
        leads: 20,
        conversions: 6,
        cpa: 25.0,
        revenue: 1800,
        roas: 12.0,
        startDate: '2024-06-01',
        endDate: '2024-06-30',
        status: 'completed',
      },
      {
        id: 'camp_2',
        name: 'TikTok Contenido Fitness',
        channel: 'tiktok / social',
        cost: 100,
        leads: 15,
        conversions: 4,
        cpa: 25.0,
        revenue: 1200,
        roas: 12.0,
        startDate: '2024-06-15',
        status: 'active',
      },
    ];
  } else {
    return [
      {
        id: 'camp_123',
        name: 'Summer_Sale_2024',
        channel: 'google / cpc',
        cost: 650,
        leads: 50,
        conversions: 8,
        cpa: 81.25,
        revenue: 2400,
        roas: 3.69,
        startDate: '2024-06-01',
        endDate: '2024-07-31',
        status: 'active',
      },
      {
        id: 'camp_124',
        name: 'Insta_Promo_2x1',
        channel: 'instagram / social',
        cost: 500,
        leads: 80,
        conversions: 5,
        cpa: 100.0,
        revenue: 1500,
        roas: 3.0,
        startDate: '2024-07-01',
        status: 'active',
      },
    ];
  }
};

export const getAcquisitionSummary = async (
  filters: AcquisitionFilters,
  isEntrenador: boolean
): Promise<AcquisitionSummary> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 500));
  return generateMockSummary(isEntrenador);
};

export const getAcquisitionChannels = async (
  filters: AcquisitionFilters,
  isEntrenador: boolean
): Promise<ChannelData[]> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 500));
  return generateMockChannels(isEntrenador);
};

export const getAcquisitionCampaigns = async (
  filters: AcquisitionFilters,
  isEntrenador: boolean
): Promise<CampaignsResponse> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 500));
  const campaigns = generateMockCampaigns(isEntrenador);
  const page = filters.page || 1;
  const limit = filters.limit || 10;

  return {
    data: campaigns,
    pagination: {
      total: campaigns.length,
      page,
      limit,
      totalPages: Math.ceil(campaigns.length / limit),
    },
  };
};

export const createCustomChannel = async (
  channelData: Omit<AcquisitionChannel, 'id'>
): Promise<AcquisitionChannel> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  return {
    id: `ch_${Date.now()}`,
    ...channelData,
  };
};

export const getCustomChannels = async (): Promise<AcquisitionChannel[]> => {
  // Simular delay de API
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  return [
    {
      id: 'ch_1',
      name: 'Walk-in',
      source: 'walk-in',
      medium: 'offline',
      isCustom: true,
    },
    {
      id: 'ch_2',
      name: 'Evento de Verano',
      source: 'evento',
      medium: 'offline',
      isCustom: true,
    },
  ];
};

