// API para gestión de Lifecycle Email Sequences

export interface SequenceStats {
  activeEnrollments: number;
  totalSent: number;
  openRate: number;
  clickRate?: number;
  completionRate?: number;
}

export interface EmailSequence {
  id: string;
  name: string;
  isActive: boolean;
  triggerType: 'CLIENT_CREATED' | 'WORKOUT_COMPLETED' | 'CLIENT_INACTIVE_14_DAYS' | 'MILESTONE_REACHED' | 'CLIENT_BIRTHDAY' | 'CUSTOM';
  stats: SequenceStats;
  stepCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SequenceResponse {
  data: EmailSequence[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface SequenceAnalytics {
  sequenceId: string;
  overall: {
    enrollments: number;
    completions: number;
    openRate: number;
    ctr: number;
    conversionRate: number;
  };
  steps: Array<{
    stepId: string;
    stepName: string;
    sent: number;
    opens: number;
    clicks: number;
  }>;
}

export interface SequenceDetail extends EmailSequence {
  description?: string;
  steps: Array<{
    id: string;
    type: 'email' | 'delay' | 'condition';
    order: number;
    config: any;
  }>;
}

// Funciones API simuladas
export const getSequences = async (
  page: number = 1,
  limit: number = 20
): Promise<SequenceResponse> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const sequences: EmailSequence[] = [
    {
      id: 'seq_001',
      name: 'Bienvenida a Nuevos Clientes',
      isActive: true,
      triggerType: 'CLIENT_CREATED',
      stats: {
        activeEnrollments: 25,
        totalSent: 150,
        openRate: 0.65,
        clickRate: 0.28,
        completionRate: 0.82
      },
      stepCount: 5,
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 'seq_002',
      name: 'Reactivación - Sin Entrenar 14 Días',
      isActive: true,
      triggerType: 'CLIENT_INACTIVE_14_DAYS',
      stats: {
        activeEnrollments: 8,
        totalSent: 45,
        openRate: 0.72,
        clickRate: 0.31,
        completionRate: 0.45
      },
      stepCount: 4,
      createdAt: '2024-01-05T14:00:00Z',
      updatedAt: '2024-01-12T10:00:00Z'
    },
    {
      id: 'seq_003',
      name: 'Felicitación por Récord Personal',
      isActive: true,
      triggerType: 'MILESTONE_REACHED',
      stats: {
        activeEnrollments: 0,
        totalSent: 120,
        openRate: 0.88,
        clickRate: 0.35
      },
      stepCount: 1,
      createdAt: '2024-01-10T09:00:00Z',
      updatedAt: '2024-01-10T09:00:00Z'
    },
    {
      id: 'seq_004',
      name: 'Upsell - Coaching Nutricional',
      isActive: false,
      triggerType: 'CUSTOM',
      stats: {
        activeEnrollments: 0,
        totalSent: 35,
        openRate: 0.58,
        clickRate: 0.18,
        completionRate: 0.12
      },
      stepCount: 3,
      createdAt: '2024-01-20T11:00:00Z',
      updatedAt: '2024-01-20T11:00:00Z'
    },
    {
      id: 'seq_005',
      name: 'Recordatorio de Cumpleaños',
      isActive: true,
      triggerType: 'CLIENT_BIRTHDAY',
      stats: {
        activeEnrollments: 3,
        totalSent: 78,
        openRate: 0.82,
        clickRate: 0.24
      },
      stepCount: 1,
      createdAt: '2024-01-15T15:00:00Z',
      updatedAt: '2024-01-15T15:00:00Z'
    }
  ];
  
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = sequences.slice(start, end);
  
  return {
    data: paginated,
    pagination: {
      total: sequences.length,
      page,
      limit
    }
  };
};

export const getSequence = async (sequenceId: string): Promise<SequenceDetail | null> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const sequences = await getSequences();
  const sequence = sequences.data.find(s => s.id === sequenceId);
  
  if (!sequence) return null;
  
  return {
    ...sequence,
    description: `Secuencia automática de ${sequence.stepCount} pasos que se activa cuando ${getTriggerDescription(sequence.triggerType)}`,
    steps: Array.from({ length: sequence.stepCount }, (_, i) => ({
      id: `step_${i + 1}`,
      type: i === 0 ? 'email' : i % 2 === 1 ? 'delay' : 'email',
      order: i + 1,
      config: {
        delayHours: i % 2 === 1 ? 48 : undefined,
        emailTemplate: i === 0 ? 'welcome' : `followup_${Math.floor(i / 2)}`
      }
    }))
  };
};

const getTriggerDescription = (triggerType: EmailSequence['triggerType']): string => {
  const descriptions = {
    CLIENT_CREATED: 'se crea un nuevo cliente',
    WORKOUT_COMPLETED: 'un cliente completa un entrenamiento',
    CLIENT_INACTIVE_14_DAYS: 'un cliente está inactivo por 14 días',
    MILESTONE_REACHED: 'un cliente alcanza un hito o récord',
    CLIENT_BIRTHDAY: 'es el cumpleaños de un cliente',
    CUSTOM: 'se cumple una condición personalizada'
  };
  return descriptions[triggerType];
};

export const createSequence = async (sequenceData: Partial<EmailSequence>): Promise<EmailSequence> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    id: `seq_${Date.now()}`,
    name: sequenceData.name || 'Nueva Secuencia',
    isActive: false,
    triggerType: sequenceData.triggerType || 'CLIENT_CREATED',
    stats: {
      activeEnrollments: 0,
      totalSent: 0,
      openRate: 0
    },
    stepCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const updateSequence = async (
  sequenceId: string,
  updates: Partial<EmailSequence>
): Promise<EmailSequence> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const sequences = await getSequences();
  const sequence = sequences.data.find(s => s.id === sequenceId);
  
  if (!sequence) {
    throw new Error('Secuencia no encontrada');
  }
  
  return {
    ...sequence,
    ...updates,
    updatedAt: new Date().toISOString()
  };
};

export const getSequenceAnalytics = async (sequenceId: string): Promise<SequenceAnalytics> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return {
    sequenceId,
    overall: {
      enrollments: 100,
      completions: 75,
      openRate: 0.72,
      ctr: 0.15,
      conversionRate: 0.1
    },
    steps: [
      {
        stepId: 'step_1',
        stepName: 'Email de Bienvenida',
        sent: 100,
        opens: 85,
        clicks: 20
      },
      {
        stepId: 'step_2',
        stepName: 'Email: Primeros Pasos',
        sent: 85,
        opens: 58,
        clicks: 12
      },
      {
        stepId: 'step_3',
        stepName: 'Email: Consejos Nutricionales',
        sent: 58,
        opens: 42,
        clicks: 8
      }
    ]
  };
};

export const deleteSequence = async (sequenceId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  console.log('Eliminando secuencia:', sequenceId);
};













