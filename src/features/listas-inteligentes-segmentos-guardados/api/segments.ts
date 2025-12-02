import { Segment, SegmentFilters } from '../types';

// Mock data para desarrollo
const mockSegments: Segment[] = [
  {
    id: '1',
    name: 'Mujeres 30-45 con bono a punto de caducar',
    description: 'Segmento para campañas de renovación',
    type: 'automatic',
    rules: [
      { id: 'r1', field: 'gender', operator: 'equals', value: 'female' },
      { id: 'r2', field: 'age', operator: 'between', value: [30, 45], logicalOperator: 'AND' },
      { id: 'r3', field: 'membership_expires', operator: 'less_than', value: 30, logicalOperator: 'AND' }
    ],
    memberCount: 142,
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    lastRefreshed: '2024-01-20T14:30:00Z',
    createdBy: 'user1'
  },
  {
    id: '2',
    name: 'Clientes VIP alto gasto',
    description: 'Clientes con alto valor de por vida',
    type: 'smart',
    rules: [
      { id: 'r1', field: 'lifetime_value', operator: 'greater_than', value: 5000 },
      { id: 'r2', field: 'active_months', operator: 'greater_than', value: 12, logicalOperator: 'AND' }
    ],
    memberCount: 89,
    status: 'active',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-20T15:00:00Z',
    lastRefreshed: '2024-01-20T15:00:00Z',
    createdBy: 'user1'
  },
  {
    id: '3',
    name: 'Riesgo de abandono',
    description: 'Clientes con baja adherencia detectada',
    type: 'automatic',
    rules: [
      { id: 'r1', field: 'attendance_rate', operator: 'less_than', value: 0.3 },
      { id: 'r2', field: 'days_since_last_visit', operator: 'greater_than', value: 14, logicalOperator: 'AND' }
    ],
    memberCount: 234,
    status: 'active',
    createdAt: '2024-01-12T11:00:00Z',
    updatedAt: '2024-01-20T16:00:00Z',
    lastRefreshed: '2024-01-20T16:00:00Z',
    createdBy: 'user1'
  }
];

export const getSegments = async (filters?: SegmentFilters): Promise<Segment[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filtered = [...mockSegments];
  
  if (filters?.type) {
    filtered = filtered.filter(s => s.type === filters.type);
  }
  
  if (filters?.status) {
    filtered = filtered.filter(s => s.status === filters.status);
  }
  
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(s => 
      s.name.toLowerCase().includes(searchLower) ||
      s.description?.toLowerCase().includes(searchLower)
    );
  }
  
  return filtered;
};

export const getSegment = async (id: string): Promise<Segment | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockSegments.find(s => s.id === id) || null;
};

export const createSegment = async (segment: Omit<Segment, 'id' | 'createdAt' | 'updatedAt' | 'lastRefreshed' | 'memberCount'>): Promise<Segment> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newSegment: Segment = {
    ...segment,
    id: Date.now().toString(),
    memberCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastRefreshed: new Date().toISOString()
  };
  
  mockSegments.push(newSegment);
  return newSegment;
};

export const updateSegment = async (id: string, updates: Partial<Segment>): Promise<Segment> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const index = mockSegments.findIndex(s => s.id === id);
  if (index === -1) {
    throw new Error('Segmento no encontrado');
  }
  
  mockSegments[index] = {
    ...mockSegments[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  return mockSegments[index];
};

export const deleteSegment = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const index = mockSegments.findIndex(s => s.id === id);
  if (index !== -1) {
    mockSegments.splice(index, 1);
  }
};

export const refreshSegment = async (id: string): Promise<Segment> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const segment = mockSegments.find(s => s.id === id);
  if (!segment) {
    throw new Error('Segmento no encontrado');
  }
  
  // Simular actualización de miembros
  segment.memberCount = Math.floor(Math.random() * 200) + 50;
  segment.lastRefreshed = new Date().toISOString();
  segment.updatedAt = new Date().toISOString();
  
  return segment;
};

