// API para gestión del Lead Inbox Unificado & SLA

export interface Lead {
  id: string;
  name: string;
  lastMessageSnippet: string;
  sourceChannel: 'instagram' | 'facebook' | 'web_form' | 'whatsapp' | 'email';
  status: 'new' | 'contacted' | 'converted' | 'discarded';
  assignedTo?: {
    id: string;
    name: string;
  };
  slaStatus: 'on_time' | 'at_risk' | 'overdue';
  slaDueTimestamp: string;
  updatedAt: string;
}

export interface LeadResponse {
  data: Lead[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const getLeads = async (
  page: number = 1,
  limit: number = 20,
  filters?: {
    status?: string;
    channel?: string;
    assigneeId?: string;
  }
): Promise<LeadResponse> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const now = Date.now();
  const mockLeads: Lead[] = [
    {
      id: 'ld_001',
      name: 'Ana García',
      lastMessageSnippet: '¿Hola! Me gustaría saber precios para el plan de entrenamiento personal...',
      sourceChannel: 'instagram',
      status: 'new',
      assignedTo: { id: 'trainer_abc', name: 'Carlos Ruiz' },
      slaStatus: 'at_risk',
      slaDueTimestamp: new Date(now + 30 * 60 * 1000).toISOString(),
      updatedAt: new Date(now - 30 * 60 * 1000).toISOString()
    },
    {
      id: 'ld_002',
      name: 'Roberto Martínez',
      lastMessageSnippet: 'Hola, estoy interesado en conocer más sobre los planes de membresía...',
      sourceChannel: 'facebook',
      status: 'contacted',
      assignedTo: { id: 'trainer_xyz', name: 'Laura Sánchez' },
      slaStatus: 'on_time',
      slaDueTimestamp: new Date(now + 2 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now - 15 * 60 * 1000).toISOString()
    },
    {
      id: 'ld_003',
      name: 'María López',
      lastMessageSnippet: '¿Tienen disponibilidad para entrenamientos en la mañana?',
      sourceChannel: 'whatsapp',
      status: 'new',
      slaStatus: 'on_time',
      slaDueTimestamp: new Date(now + 45 * 60 * 1000).toISOString(),
      updatedAt: new Date(now - 10 * 60 * 1000).toISOString()
    },
    {
      id: 'ld_004',
      name: 'José Fernández',
      lastMessageSnippet: 'Me interesa el programa de pérdida de peso...',
      sourceChannel: 'web_form',
      status: 'converted',
      assignedTo: { id: 'trainer_abc', name: 'Carlos Ruiz' },
      slaStatus: 'on_time',
      slaDueTimestamp: new Date(now + 1 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'ld_005',
      name: 'Carmen Torres',
      lastMessageSnippet: '¿Qué horarios tienen disponibles para clases grupales?',
      sourceChannel: 'email',
      status: 'new',
      slaStatus: 'overdue',
      slaDueTimestamp: new Date(now - 15 * 60 * 1000).toISOString(),
      updatedAt: new Date(now - 65 * 60 * 1000).toISOString()
    },
    {
      id: 'ld_006',
      name: 'David González',
      lastMessageSnippet: 'Necesito información sobre nutrición deportiva...',
      sourceChannel: 'instagram',
      status: 'contacted',
      slaStatus: 'on_time',
      slaDueTimestamp: new Date(now + 3 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now - 45 * 60 * 1000).toISOString()
    },
    {
      id: 'ld_007',
      name: 'Patricia Ramírez',
      lastMessageSnippet: '¿Ofrecen planes familiares? Me gustaría información...',
      sourceChannel: 'facebook',
      status: 'new',
      assignedTo: { id: 'trainer_xyz', name: 'Laura Sánchez' },
      slaStatus: 'at_risk',
      slaDueTimestamp: new Date(now + 10 * 60 * 1000).toISOString(),
      updatedAt: new Date(now - 50 * 60 * 1000).toISOString()
    },
    {
      id: 'ld_008',
      name: 'Luis Morales',
      lastMessageSnippet: 'Busco entrenamiento para preparar una maratón...',
      sourceChannel: 'web_form',
      status: 'converted',
      slaStatus: 'on_time',
      slaDueTimestamp: new Date(now + 4 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now - 3 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'ld_009',
      name: 'Sofía Herrera',
      lastMessageSnippet: '¿Tienen clases de yoga o pilates?',
      sourceChannel: 'whatsapp',
      status: 'discarded',
      slaStatus: 'on_time',
      slaDueTimestamp: new Date(now + 1 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now - 4 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'ld_010',
      name: 'Miguel Díaz',
      lastMessageSnippet: 'Me gustaría una consulta sobre nutrición...',
      sourceChannel: 'email',
      status: 'new',
      slaStatus: 'at_risk',
      slaDueTimestamp: new Date(now + 20 * 60 * 1000).toISOString(),
      updatedAt: new Date(now - 40 * 60 * 1000).toISOString()
    }
  ];

  // Aplicar filtros si existen
  let filtered = mockLeads;
  if (filters) {
    if (filters.status) {
      filtered = filtered.filter(l => l.status === filters.status);
    }
    if (filters.channel) {
      filtered = filtered.filter(l => l.sourceChannel === filters.channel);
    }
    if (filters.assigneeId) {
      filtered = filtered.filter(l => l.assignedTo?.id === filters.assigneeId);
    }
  }

  // Paginación
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = filtered.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    pagination: {
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit)
    }
  };
};

