// API para Account-Based Marketing (ABM)

export interface Account {
  id: string;
  companyName: string;
  industry?: string;
  website?: string;
  employeeCount?: number;
  ownerId: string;
  contacts?: Contact[];
  deals?: Deal[];
  activityLog?: Activity[];
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  accountId: string;
  isKeyContact: boolean;
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  accountId: string;
  accountName: string;
  stageId: string;
  stageName?: string;
  nextStepDate?: string;
  probability?: number;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  deals: Deal[];
}

export interface Activity {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'proposal' | 'note';
  description: string;
  timestamp: string;
  accountId?: string;
  dealId?: string;
  contactId?: string;
}

export interface Proposal {
  id: string;
  accountId: string;
  dealId?: string;
  title: string;
  templateId?: string;
  viewed: boolean;
  viewedAt?: string;
  createdAt: string;
}

export interface ABMFilters {
  stageId?: string;
  search?: string;
  accountId?: string;
}

// Funciones API simuladas (a implementar con backend real)

export const getDeals = async (filters?: ABMFilters): Promise<Deal[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Datos de ejemplo
  return [
    {
      id: 'deal-01',
      title: 'Programa Wellness Q3',
      value: 5000,
      accountId: 'acc-789',
      accountName: 'TechCorp',
      stageId: 'stage-02',
      stageName: 'Contacto Establecido',
      probability: 60,
      ownerId: 'trainer-123',
      createdAt: '2023-10-01T10:00:00Z',
      updatedAt: '2023-10-27T10:00:00Z'
    },
    {
      id: 'deal-02',
      title: 'Pausas Activas 2024',
      value: 2500,
      accountId: 'acc-790',
      accountName: 'Innovate Solutions',
      stageId: 'stage-03',
      stageName: 'Propuesta Enviada',
      probability: 75,
      ownerId: 'trainer-123',
      createdAt: '2023-10-15T10:00:00Z',
      updatedAt: '2023-10-28T10:00:00Z'
    }
  ];
};

export const getPipelineStages = async (): Promise<PipelineStage[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const stages: PipelineStage[] = [
    { id: 'stage-01', name: 'Prospección', order: 1, deals: [] },
    { id: 'stage-02', name: 'Contacto Establecido', order: 2, deals: [] },
    { id: 'stage-03', name: 'Propuesta Enviada', order: 3, deals: [] },
    { id: 'stage-04', name: 'Negociación', order: 4, deals: [] },
    { id: 'stage-05', name: 'Ganado', order: 5, deals: [] },
    { id: 'stage-06', name: 'Perdido', order: 6, deals: [] }
  ];
  
  // Cargar deals y distribuirlos en las etapas
  const deals = await getDeals();
  deals.forEach(deal => {
    const stage = stages.find(s => s.id === deal.stageId);
    if (stage) {
      stage.deals.push(deal);
    }
  });
  
  return stages;
};

export const createAccount = async (accountData: Omit<Account, 'id' | 'createdAt' | 'updatedAt'>): Promise<Account> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // En producción: POST /api/abm/accounts
  const newAccount: Account = {
    ...accountData,
    id: `acc_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  return newAccount;
};

export const getAccount = async (accountId: string): Promise<Account | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: GET /api/abm/accounts/{accountId}
  const account: Account = {
    id: accountId,
    companyName: 'Innovate Solutions',
    industry: 'Technology',
    website: 'innovate.com',
    ownerId: 'trainer-123',
    contacts: [
      {
        id: 'cont-1',
        name: 'Ana García',
        role: 'HR Manager',
        email: 'ana.garcia@innovate.com',
        phone: '+34 600 123 456',
        accountId: accountId,
        isKeyContact: true
      }
    ],
    deals: [
      {
        id: 'deal-02',
        title: 'Pausas Activas 2024',
        value: 2500,
        accountId: accountId,
        accountName: 'Innovate Solutions',
        stageId: 'stage-03',
        ownerId: 'trainer-123',
        createdAt: '2023-10-15T10:00:00Z',
        updatedAt: '2023-10-28T10:00:00Z'
      }
    ],
    activityLog: [
      {
        id: 'act-1',
        type: 'email',
        description: 'Email enviado a Ana García',
        timestamp: '2023-10-27T10:00:00Z',
        accountId: accountId,
        contactId: 'cont-1'
      }
    ],
    createdAt: '2023-10-01T10:00:00Z',
    updatedAt: '2023-10-27T10:00:00Z'
  };
  
  return account;
};

export const updateDealStage = async (dealId: string, newStageId: string): Promise<Deal> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: PATCH /api/abm/deals/{dealId}/stage
  const deals = await getDeals();
  const deal = deals.find(d => d.id === dealId);
  
  if (!deal) {
    throw new Error('Deal no encontrado');
  }
  
  return {
    ...deal,
    stageId: newStageId,
    updatedAt: new Date().toISOString()
  };
};

export const createDeal = async (dealData: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Deal> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newDeal: Deal = {
    ...dealData,
    id: `deal_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  return newDeal;
};

export const getABMAnalytics = async (): Promise<{
  totalPipelineValue: number;
  conversionRate: number;
  averageSalesCycle: number;
  newAccountsThisMonth: number;
  proposalEngagementRate: number;
  totalRevenue: number;
}> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const deals = await getDeals();
  const totalPipelineValue = deals
    .filter(d => !['stage-05', 'stage-06'].includes(d.stageId))
    .reduce((sum, d) => sum + d.value, 0);
  
  const wonDeals = deals.filter(d => d.stageId === 'stage-05');
  const conversionRate = deals.length > 0 ? (wonDeals.length / deals.length) * 100 : 0;
  
  return {
    totalPipelineValue,
    conversionRate,
    averageSalesCycle: 45, // días promedio
    newAccountsThisMonth: 5,
    proposalEngagementRate: 72.5,
    totalRevenue: 15000
  };
};













