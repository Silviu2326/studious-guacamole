import { SmartList, ListMember } from '../types';

const mockSmartLists: SmartList[] = [
  {
    id: 'sl1',
    name: 'Lista Premium Activa',
    description: 'Clientes con membresía premium activa',
    segmentId: '2',
    memberCount: 89,
    refreshFrequency: 'daily',
    lastRefreshed: '2024-01-20T06:00:00Z',
    status: 'active',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-20T06:00:00Z',
    members: []
  },
  {
    id: 'sl2',
    name: 'Lista Renovación Urgente',
    description: 'Miembros con renovación próxima',
    segmentId: '1',
    memberCount: 142,
    refreshFrequency: 'realtime',
    lastRefreshed: '2024-01-20T16:30:00Z',
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T16:30:00Z',
    members: []
  },
  {
    id: 'sl3',
    name: 'Lista Abandono Alto Riesgo',
    description: 'Clientes con probabilidad alta de cancelación',
    segmentId: '3',
    memberCount: 234,
    refreshFrequency: 'hourly',
    lastRefreshed: '2024-01-20T16:00:00Z',
    status: 'active',
    createdAt: '2024-01-12T11:00:00Z',
    updatedAt: '2024-01-20T16:00:00Z',
    members: []
  }
];

export const getSmartLists = async (): Promise<SmartList[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return [...mockSmartLists];
};

export const getSmartList = async (id: string): Promise<SmartList | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockSmartLists.find(sl => sl.id === id) || null;
};

export const createSmartList = async (smartList: Omit<SmartList, 'id' | 'createdAt' | 'updatedAt' | 'lastRefreshed' | 'members' | 'memberCount'>): Promise<SmartList> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newSmartList: SmartList = {
    ...smartList,
    id: `sl${Date.now()}`,
    memberCount: 0,
    members: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastRefreshed: new Date().toISOString()
  };
  
  mockSmartLists.push(newSmartList);
  return newSmartList;
};

export const updateSmartList = async (id: string, updates: Partial<SmartList>): Promise<SmartList> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const index = mockSmartLists.findIndex(sl => sl.id === id);
  if (index === -1) {
    throw new Error('Lista inteligente no encontrada');
  }
  
  mockSmartLists[index] = {
    ...mockSmartLists[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  return mockSmartLists[index];
};

export const deleteSmartList = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const index = mockSmartLists.findIndex(sl => sl.id === id);
  if (index !== -1) {
    mockSmartLists.splice(index, 1);
  }
};

export const refreshSmartList = async (id: string): Promise<SmartList> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const smartList = mockSmartLists.find(sl => sl.id === id);
  if (!smartList) {
    throw new Error('Lista inteligente no encontrada');
  }
  
  smartList.memberCount = Math.floor(Math.random() * 300) + 50;
  smartList.lastRefreshed = new Date().toISOString();
  smartList.updatedAt = new Date().toISOString();
  
  return smartList;
};

export const getSmartListMembers = async (id: string, page = 1, limit = 50): Promise<{ members: ListMember[]; total: number }> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const smartList = mockSmartLists.find(sl => sl.id === id);
  if (!smartList) {
    return { members: [], total: 0 };
  }
  
  const mockMembers: ListMember[] = Array.from({ length: smartList.memberCount }, (_, i) => ({
    id: `member-${i + 1}`,
    name: `Cliente ${i + 1}`,
    email: `cliente${i + 1}@example.com`,
    phone: `+34 600 000 ${String(i + 1).padStart(3, '0')}`,
    joinedAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: {
      membershipType: ['Premium', 'Standard', 'Basic'][Math.floor(Math.random() * 3)]
    }
  }));
  
  const start = (page - 1) * limit;
  const end = start + limit;
  
  return {
    members: mockMembers.slice(start, end),
    total: mockMembers.length
  };
};

