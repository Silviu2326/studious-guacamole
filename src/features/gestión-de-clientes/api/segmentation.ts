import { ClientSegment, SegmentCriteria } from '../types';

const MOCK_SEGMENTS: ClientSegment[] = [
  {
    id: '1',
    name: 'Clientes de Alto Riesgo',
    criteria: {
      status: ['en-riesgo'],
      riskScore: { min: 60, max: 100 },
    },
    clientIds: ['2'],
    clientCount: 1,
  },
  {
    id: '2',
    name: 'Clientes Activos Premium',
    criteria: {
      status: ['activo'],
      adherenceRate: { min: 80, max: 100 },
    },
    clientIds: ['1'],
    clientCount: 1,
  },
];

export const getSegments = async (role: 'entrenador' | 'gimnasio', userId?: string): Promise<ClientSegment[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return MOCK_SEGMENTS;
};

export const createSegment = async (segment: Omit<ClientSegment, 'id' | 'clientCount' | 'clientIds'>): Promise<ClientSegment> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newSegment: ClientSegment = {
    id: Date.now().toString(),
    ...segment,
    clientIds: [],
    clientCount: 0,
  };
  
  MOCK_SEGMENTS.push(newSegment);
  return newSegment;
};

export const updateSegment = async (
  segmentId: string,
  updates: Partial<ClientSegment>
): Promise<ClientSegment> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = MOCK_SEGMENTS.findIndex(s => s.id === segmentId);
  if (index === -1) throw new Error('Segment not found');
  
  MOCK_SEGMENTS[index] = { ...MOCK_SEGMENTS[index], ...updates };
  return MOCK_SEGMENTS[index];
};

export const deleteSegment = async (segmentId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = MOCK_SEGMENTS.findIndex(s => s.id === segmentId);
  if (index !== -1) {
    MOCK_SEGMENTS.splice(index, 1);
  }
};

