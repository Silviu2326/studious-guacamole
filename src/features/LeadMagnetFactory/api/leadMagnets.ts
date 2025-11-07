// API para gestión de Lead Magnets

export interface LeadMagnet {
  id: string;
  trainerId: string;
  name: string;
  type: 'PDF_EDITOR' | 'CALCULATOR' | 'CHECKLIST' | 'QUIZ';
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  config: {
    backgroundColor?: string;
    logoUrl?: string;
    customFields?: Array<{
      label: string;
      type: 'text' | 'email' | 'select' | 'number';
      required: boolean;
      options?: string[];
    }>;
  };
  assetUrl?: string;
  stats: {
    views: number;
    leads: number;
    conversionRate: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface LeadMagnetAnalytics {
  totalViews: number;
  totalLeads: number;
  conversionRate: number;
  convertedToClient: number;
  clientConversionRate: number;
  leadsOverTime: Array<{
    date: string;
    count: number;
  }>;
}

export interface GlobalStats {
  totalLeadMagnets: number;
  totalViews: number;
  totalLeads: number;
  avgConversionRate: number;
  totalClientsConverted: number;
}

// Funciones API simuladas
export const getLeadMagnets = async (status?: string): Promise<LeadMagnet[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const allMagnets: LeadMagnet[] = [
    {
      id: 'lm_001',
      trainerId: 'trainer_123',
      name: 'Guía de Nutrición Keto',
      type: 'PDF_EDITOR',
      status: 'PUBLISHED',
      config: {
        backgroundColor: '#FF6B6B',
        logoUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48'
      },
      assetUrl: 'https://filesample.com/sample.pdf',
      stats: {
        views: 1204,
        leads: 350,
        conversionRate: 0.29
      },
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 'lm_002',
      trainerId: 'trainer_123',
      name: 'Calculadora de Macronutrientes',
      type: 'CALCULATOR',
      status: 'PUBLISHED',
      config: {
        backgroundColor: '#4ECDC4',
        customFields: [
          { label: 'Edad', type: 'number', required: true },
          { label: 'Objetivo', type: 'select', required: true, options: ['Perder grasa', 'Ganar músculo', 'Mantener'] }
        ]
      },
      stats: {
        views: 2340,
        leads: 890,
        conversionRate: 0.38
      },
      createdAt: '2024-01-05T14:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 'lm_003',
      trainerId: 'trainer_123',
      name: 'Plan de Entrenamiento de 7 Días',
      type: 'PDF_EDITOR',
      status: 'PUBLISHED',
      config: {
        backgroundColor: '#45B7D1'
      },
      assetUrl: 'https://filesample.com/sample.pdf',
      stats: {
        views: 856,
        leads: 198,
        conversionRate: 0.23
      },
      createdAt: '2024-01-10T09:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 'lm_004',
      trainerId: 'trainer_123',
      name: 'Checklist de Hábitos Saludables',
      type: 'CHECKLIST',
      status: 'DRAFT',
      config: {
        backgroundColor: '#96CEB4'
      },
      stats: {
        views: 0,
        leads: 0,
        conversionRate: 0
      },
      createdAt: '2024-01-20T11:00:00Z',
      updatedAt: '2024-01-20T11:00:00Z'
    }
  ];

  if (status) {
    return allMagnets.filter(magnet => magnet.status === status);
  }

  return allMagnets;
};

export const createLeadMagnet = async (magnetData: Partial<LeadMagnet>): Promise<LeadMagnet> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    id: `lm_${Date.now()}`,
    trainerId: 'trainer_123',
    name: magnetData.name || 'Nuevo Lead Magnet',
    type: magnetData.type || 'PDF_EDITOR',
    status: 'DRAFT',
    config: magnetData.config || {},
    stats: {
      views: 0,
      leads: 0,
      conversionRate: 0
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const updateLeadMagnet = async (id: string, updates: Partial<LeadMagnet>): Promise<LeadMagnet> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const magnets = await getLeadMagnets();
  const magnet = magnets.find(m => m.id === id);
  
  if (!magnet) {
    throw new Error('Lead magnet no encontrado');
  }
  
  return {
    ...magnet,
    ...updates,
    updatedAt: new Date().toISOString()
  };
};

export const getLeadMagnetAnalytics = async (id: string): Promise<LeadMagnetAnalytics> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return {
    totalViews: 5230,
    totalLeads: 1250,
    conversionRate: 0.239,
    convertedToClient: 85,
    clientConversionRate: 0.068,
    leadsOverTime: [
      { date: '2024-01-01', count: 45 },
      { date: '2024-01-02', count: 51 },
      { date: '2024-01-03', count: 38 },
      { date: '2024-01-04', count: 62 },
      { date: '2024-01-05', count: 49 }
    ]
  };
};

export const getGlobalStats = async (): Promise<GlobalStats> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    totalLeadMagnets: 12,
    totalViews: 8560,
    totalLeads: 2456,
    avgConversionRate: 0.287,
    totalClientsConverted: 178
  };
};

export const deleteLeadMagnet = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  console.log('Eliminando lead magnet:', id);
};








