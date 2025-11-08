// API para gestión de contenido UGC (User-Generated Content)

export interface UgcContent {
  id: string;
  type: 'image' | 'video';
  sourceUrl: string;
  storageUrl: string;
  status: 'pending_moderation' | 'approved' | 'rejected';
  consentStatus: 'pending_response' | 'granted' | 'denied' | 'not_requested';
  client: {
    id: string;
    name: string;
    email?: string;
  };
  tags: string[];
  createdAt: string;
}

export interface UgcResponse {
  data: UgcContent[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ConsentRequest {
  requestId: string;
  contentId: string;
  status: string;
  message: string;
}

export interface SocialSync {
  jobId: string;
  status: string;
  message: string;
}

// Funciones API simuladas
export const getUgcContent = async (
  page: number = 1,
  limit: number = 20,
  filters?: {
    status?: string;
    consentStatus?: string;
    tags?: string[];
  }
): Promise<UgcResponse> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const allContent: UgcContent[] = [
    {
      id: 'ugc_001',
      type: 'image',
      sourceUrl: 'https://instagram.com/p/CXYZ...',
      storageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
      status: 'pending_moderation',
      consentStatus: 'not_requested',
      client: {
        id: 'client_001',
        name: 'Ana Pérez',
        email: 'ana.perez@example.com'
      },
      tags: ['transformacion', 'perdida-grasa'],
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 'ugc_002',
      type: 'video',
      sourceUrl: 'https://instagram.com/p/CABC...',
      storageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48',
      status: 'approved',
      consentStatus: 'granted',
      client: {
        id: 'client_002',
        name: 'Laura González',
        email: 'laura.gonzalez@example.com'
      },
      tags: ['testimonio', '12-semanas', 'ganancia-muscular'],
      createdAt: '2024-01-10T15:30:00Z'
    },
    {
      id: 'ugc_003',
      type: 'image',
      sourceUrl: 'https://tiktok.com/@...',
      storageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438',
      status: 'approved',
      consentStatus: 'granted',
      client: {
        id: 'client_003',
        name: 'Carlos Ruiz',
        email: 'carlos.ruiz@example.com'
      },
      tags: ['transformacion', 'hombre', 'fuerza'],
      createdAt: '2024-01-05T09:20:00Z'
    },
    {
      id: 'ugc_004',
      type: 'image',
      sourceUrl: 'https://instagram.com/p/CDEF...',
      storageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f',
      status: 'pending_moderation',
      consentStatus: 'pending_response',
      client: {
        id: 'client_004',
        name: 'María Sánchez',
        email: 'maria.sanchez@example.com'
      },
      tags: [],
      createdAt: '2024-01-20T11:00:00Z'
    },
    {
      id: 'ugc_005',
      type: 'video',
      sourceUrl: 'https://instagram.com/p/CGHI...',
      storageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
      status: 'approved',
      consentStatus: 'granted',
      client: {
        id: 'client_005',
        name: 'David López',
        email: 'david.lopez@example.com'
      },
      tags: ['testimonio', 'online', 'consistentia'],
      createdAt: '2024-01-01T14:45:00Z'
    }
  ];

  // Aplicar filtros
  let filteredContent = allContent;
  if (filters?.status) {
    filteredContent = filteredContent.filter(item => item.status === filters.status);
  }
  if (filters?.consentStatus) {
    filteredContent = filteredContent.filter(item => item.consentStatus === filters.consentStatus);
  }
  if (filters?.tags && filters.tags.length > 0) {
    filteredContent = filteredContent.filter(item =>
      filters.tags!.some(tag => item.tags.includes(tag))
    );
  }

  // Paginación
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedContent = filteredContent.slice(start, end);

  return {
    data: paginatedContent,
    pagination: {
      total: filteredContent.length,
      page,
      limit,
      totalPages: Math.ceil(filteredContent.length / limit)
    }
  };
};

export const updateContentStatus = async (
  contentId: string,
  status: 'approved' | 'rejected'
): Promise<UgcContent> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Simulación de actualización
  return {
    id: contentId,
    type: 'image',
    sourceUrl: '',
    storageUrl: '',
    status,
    consentStatus: 'not_requested',
    client: { id: '', name: '' },
    tags: [],
    createdAt: new Date().toISOString()
  };
};

export const requestConsent = async (
  contentId: string,
  customMessage?: string
): Promise<ConsentRequest> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return {
    requestId: `consent_req_${Date.now()}`,
    contentId,
    status: 'pending_response',
    message: 'Consent request sent successfully.'
  };
};

export const syncSocialMedia = async (): Promise<SocialSync> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return {
    jobId: `sync_job_${Date.now()}`,
    status: 'queued',
    message: 'Social media content sync has been initiated.'
  };
};

export const getUgcStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    pendingModeration: 2,
    totalApproved: 125,
    consentApprovalRate: 87.5,
    avgApprovalTime: 2.5,
    recentMentions: 8,
    topTags: [
      { tag: 'transformacion', count: 45 },
      { tag: 'testimonio', count: 32 },
      { tag: '12-semanas', count: 28 }
    ]
  };
};











