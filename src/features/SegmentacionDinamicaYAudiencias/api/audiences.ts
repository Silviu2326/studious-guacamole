// API para gestión de Segmentación Dinámica & Audiencias

export type RuleOperator = 'AND' | 'OR';
export type FieldType = 'string' | 'number' | 'date' | 'boolean' | 'select';
export type ComparisonOperator = 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'before' | 'after';

export interface Rule {
  field: string;
  operator: ComparisonOperator;
  value: any;
}

export interface RuleGroup {
  operator: RuleOperator;
  rules: (Rule | RuleGroup)[];
}

export interface Audience {
  id: string;
  name: string;
  member_count: number;
  rules: RuleGroup;
  created_at?: string;
  updated_at?: string;
  last_synced?: string;
}

export interface AudienceMember {
  id: string;
  name: string;
  email: string;
}

export interface AudienceResponse {
  data: Audience[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface AudienceMembersResponse {
  data: AudienceMember[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface AudienceStats {
  totalAudiences: number;
  totalMembers: number;
  averageAudienceSize: number;
  topAudiencesBySize: {
    id: string;
    name: string;
    memberCount: number;
  }[];
  segmentationRate: number;
}

// Funciones API simuladas
export const getAudiences = async (page: number = 1, limit: number = 20): Promise<AudienceResponse> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  const audiences: Audience[] = [
    {
      id: 'aud_001',
      name: 'Clientes en Riesgo',
      member_count: 15,
      rules: {
        operator: 'AND',
        rules: [
          { field: 'last_workout_date', operator: 'before', value: '2024-01-13T00:00:00Z' },
          { field: 'subscription_status', operator: 'equals', value: 'active' }
        ]
      },
      created_at: '2024-01-15T10:00:00Z',
      last_synced: '2024-01-27T08:00:00Z'
    },
    {
      id: 'aud_002',
      name: 'Clientes VIP',
      member_count: 23,
      rules: {
        operator: 'AND',
        rules: [
          { field: 'subscription_plan_type', operator: 'equals', value: 'premium' },
          { field: 'client_since', operator: 'before', value: '2022-01-01T00:00:00Z' }
        ]
      },
      created_at: '2024-01-10T09:00:00Z',
      last_synced: '2024-01-27T08:00:00Z'
    },
    {
      id: 'aud_003',
      name: 'Leads - Descarga Guía Nutrición',
      member_count: 42,
      rules: {
        operator: 'AND',
        rules: [
          { field: 'lead_magnet_download', operator: 'equals', value: 'nutrition_guide' },
          { field: 'has_purchased_plan', operator: 'equals', value: false }
        ]
      },
      created_at: '2024-01-05T11:00:00Z',
      last_synced: '2024-01-27T08:00:00Z'
    },
    {
      id: 'aud_004',
      name: 'Principiantes - Pérdida de Peso',
      member_count: 38,
      rules: {
        operator: 'AND',
        rules: [
          { field: 'fitness_level', operator: 'equals', value: 'beginner' },
          { field: 'primary_goal', operator: 'equals', value: 'weight_loss' }
        ]
      },
      created_at: '2024-01-01T08:00:00Z',
      last_synced: '2024-01-27T08:00:00Z'
    },
    {
      id: 'aud_005',
      name: 'Suscripciones Renovables - 7 días',
      member_count: 12,
      rules: {
        operator: 'AND',
        rules: [
          { field: 'subscription_expires_in', operator: 'less_than', value: 7 },
          { field: 'subscription_status', operator: 'equals', value: 'active' }
        ]
      },
      created_at: '2023-12-20T10:00:00Z',
      last_synced: '2024-01-27T08:00:00Z'
    }
  ];

  return {
    data: audiences,
    pagination: {
      total: audiences.length,
      page: 1,
      limit: audiences.length
    }
  };
};

export const createAudience = async (audienceData: Omit<Audience, 'id' | 'member_count'>): Promise<Audience> => {
  await new Promise(resolve => setTimeout(resolve, 600));

  return {
    id: `aud_${Date.now()}`,
    ...audienceData,
    member_count: 0,
    created_at: new Date().toISOString()
  };
};

export const updateAudience = async (id: string, updateData: Partial<Audience>): Promise<Audience> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const response = await getAudiences();
  const existing = response.data.find(a => a.id === id);

  if (!existing) {
    throw new Error('Audiencia no encontrada');
  }

  return {
    ...existing,
    ...updateData,
    updated_at: new Date().toISOString()
  };
};

export const deleteAudience = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 400));
};

export const getAudiencePreview = async (rules: RuleGroup): Promise<{ matching_members: number }> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  // Simulación: contar miembros que coinciden
  return {
    matching_members: Math.floor(Math.random() * 100)
  };
};

export const getAudienceMembers = async (id: string, page: number = 1, limit: number = 50): Promise<AudienceMembersResponse> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  const members: AudienceMember[] = [
    { id: 'cli_001', name: 'Ana García', email: 'ana.garcia@example.com' },
    { id: 'cli_002', name: 'Carlos Ruiz', email: 'carlos.ruiz@example.com' },
    { id: 'cli_003', name: 'María López', email: 'maria.lopez@example.com' },
    { id: 'cli_004', name: 'Pedro Sánchez', email: 'pedro.sanchez@example.com' }
  ];

  return {
    data: members,
    pagination: {
      total: members.length,
      page: 1,
      limit: members.length
    }
  };
};

export const getAudienceStats = async (): Promise<AudienceStats> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  return {
    totalAudiences: 12,
    totalMembers: 234,
    averageAudienceSize: 19.5,
    topAudiencesBySize: [
      { id: 'aud_003', name: 'Leads - Descarga Guía Nutrición', memberCount: 42 },
      { id: 'aud_004', name: 'Principiantes - Pérdida de Peso', memberCount: 38 },
      { id: 'aud_002', name: 'Clientes VIP', memberCount: 23 }
    ],
    segmentationRate: 85.3
  };
};

// Available fields for segmentation
export const getAvailableFields = () => [
  { id: 'primary_goal', label: 'Objetivo Principal', type: 'select', options: ['Pérdida de peso', 'Ganancia muscular', 'Mejorar condición', 'Rendimiento deportivo'] },
  { id: 'fitness_level', label: 'Nivel de Fitness', type: 'select', options: ['Principiante', 'Intermedio', 'Avanzado'] },
  { id: 'subscription_status', label: 'Estado Suscripción', type: 'select', options: ['active', 'inactive', 'cancelled'] },
  { id: 'subscription_plan_type', label: 'Tipo de Plan', type: 'select', options: ['basic', 'premium', 'elite'] },
  { id: 'last_workout_date', label: 'Último Entrenamiento', type: 'date' },
  { id: 'subscription_expires_in', label: 'Expira en (días)', type: 'number' },
  { id: 'client_since', label: 'Cliente desde', type: 'date' },
  { id: 'workouts_last_30_days', label: 'Entrenamientos últimos 30 días', type: 'number' },
  { id: 'has_purchased_plan', label: 'Ha comprado plan', type: 'boolean' },
  { id: 'lead_magnet_download', label: 'Lead Magnet Descargado', type: 'select', options: ['nutrition_guide', 'workout_plans', 'meal_prep'] }
];












