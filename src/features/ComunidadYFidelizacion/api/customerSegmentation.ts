import { CustomerSegment, SegmentSummary, CustomerSegmentType } from '../types';

// Mock data para segmentación de clientes con IA
const MOCK_SEGMENTS: CustomerSegment[] = [
  {
    id: 'seg_001',
    clientId: 'cliente_001',
    clientName: 'Laura Méndez',
    segmentType: 'embajador',
    classificationSource: 'ai',
    metrics: {
      attendanceRate: 95,
      npsScore: 10,
      purchaseFrequency: 4,
      daysAsClient: 120,
      lastSessionDate: '2025-10-15T08:00:00Z',
      satisfactionScore: 4.9,
      referralCount: 3,
      engagementScore: 92,
    },
    classificationReason: 'Cliente con asistencia excelente (95%), NPS perfecto (10), múltiples referidos (3) y alta satisfacción (4.9/5). Clasificado como embajador por IA.',
    confidenceScore: 95,
    classifiedAt: '2025-10-15T10:00:00Z',
    tags: ['alta-satisfaccion', 'referidos', 'asistencia-excelente'],
  },
  {
    id: 'seg_002',
    clientId: 'cliente_002',
    clientName: 'Carlos Ortega',
    segmentType: 'embajador',
    classificationSource: 'ai',
    metrics: {
      attendanceRate: 88,
      npsScore: 9,
      purchaseFrequency: 3,
      daysAsClient: 90,
      lastSessionDate: '2025-10-14T10:00:00Z',
      satisfactionScore: 4.8,
      referralCount: 2,
      engagementScore: 85,
    },
    classificationReason: 'Cliente satisfecho con alta asistencia y NPS de 9. Ha generado 2 referidos. Clasificado como embajador.',
    confidenceScore: 88,
    classifiedAt: '2025-10-14T11:00:00Z',
    tags: ['alta-satisfaccion', 'referidos'],
  },
  {
    id: 'seg_003',
    clientId: 'cliente_004',
    clientName: 'Pedro Sánchez',
    segmentType: 'nuevo',
    classificationSource: 'ai',
    metrics: {
      attendanceRate: 92,
      npsScore: 10,
      purchaseFrequency: 1,
      daysAsClient: 60,
      lastSessionDate: '2025-10-15T14:20:00Z',
      satisfactionScore: 5.0,
      referralCount: 0,
      engagementScore: 88,
    },
    classificationReason: 'Cliente nuevo (60 días) con excelente asistencia y satisfacción perfecta. Potencial embajador futuro.',
    confidenceScore: 90,
    classifiedAt: '2025-10-15T15:00:00Z',
    tags: ['cliente-nuevo', 'alta-satisfaccion'],
  },
  {
    id: 'seg_004',
    clientId: 'cliente_005',
    clientName: 'Ana Martínez',
    segmentType: 'nuevo',
    classificationSource: 'ai',
    metrics: {
      attendanceRate: 85,
      npsScore: 8,
      purchaseFrequency: 1,
      daysAsClient: 45,
      lastSessionDate: '2025-10-11T11:00:00Z',
      satisfactionScore: 4.6,
      referralCount: 0,
      engagementScore: 75,
    },
    classificationReason: 'Cliente nuevo (45 días) con buena asistencia y satisfacción. En proceso de adaptación.',
    confidenceScore: 82,
    classifiedAt: '2025-10-11T12:00:00Z',
    tags: ['cliente-nuevo'],
  },
  {
    id: 'seg_005',
    clientId: 'cliente_003',
    clientName: 'María González',
    segmentType: 'riesgo',
    classificationSource: 'ai',
    metrics: {
      attendanceRate: 65,
      npsScore: 6,
      purchaseFrequency: 2,
      daysAsClient: 150,
      lastSessionDate: '2025-10-13T16:00:00Z',
      satisfactionScore: 3.8,
      referralCount: 0,
      engagementScore: 55,
    },
    classificationReason: 'Cliente con asistencia en declive (65%), NPS bajo (6) y satisfacción promedio (3.8). Requiere atención inmediata para evitar churn.',
    confidenceScore: 87,
    classifiedAt: '2025-10-13T17:00:00Z',
    tags: ['riesgo-churn', 'baja-asistencia'],
  },
  {
    id: 'seg_006',
    clientId: 'cliente_006',
    clientName: 'Roberto Fernández',
    segmentType: 'regular',
    classificationSource: 'ai',
    metrics: {
      attendanceRate: 78,
      npsScore: 7,
      purchaseFrequency: 2,
      daysAsClient: 100,
      lastSessionDate: '2025-10-10T15:00:00Z',
      satisfactionScore: 4.2,
      referralCount: 0,
      engagementScore: 68,
    },
    classificationReason: 'Cliente regular con asistencia y satisfacción promedio. Sin señales de riesgo ni de alto potencial.',
    confidenceScore: 75,
    classifiedAt: '2025-10-10T16:00:00Z',
    tags: ['cliente-regular'],
  },
];

const MOCK_SEGMENT_SUMMARY: SegmentSummary[] = [
  {
    segmentType: 'embajador',
    count: 2,
    percentage: 33.3,
    trend: 'up',
    change: 1,
  },
  {
    segmentType: 'nuevo',
    count: 2,
    percentage: 33.3,
    trend: 'steady',
    change: 0,
  },
  {
    segmentType: 'riesgo',
    count: 1,
    percentage: 16.7,
    trend: 'down',
    change: -1,
  },
  {
    segmentType: 'regular',
    count: 1,
    percentage: 16.7,
    trend: 'steady',
    change: 0,
  },
];

export const CustomerSegmentationAPI = {
  async getSegments(): Promise<CustomerSegment[]> {
    await delay(250);
    return cloneData(MOCK_SEGMENTS);
  },

  async getSegmentSummary(): Promise<SegmentSummary[]> {
    await delay(200);
    return cloneData(MOCK_SEGMENT_SUMMARY);
  },

  async getSegmentsByType(type: CustomerSegmentType): Promise<CustomerSegment[]> {
    await delay(200);
    return cloneData(MOCK_SEGMENTS.filter((s) => s.segmentType === type));
  },
};

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function cloneData<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value)) as T;
}

