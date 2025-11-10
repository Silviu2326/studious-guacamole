// API para gestión de email deliverability y compliance

export interface EmailHealthStats {
  healthScore: number;
  bounceRate: {
    total: number;
    hard: number;
    soft: number;
  };
  spamComplaintRate: number;
  unsubscribeRate: number;
  openRate?: number;
  history: HealthHistoryPoint[];
}

export interface HealthHistoryPoint {
  date: string;
  bounces: number;
  complaints: number;
  unsubscribes?: number;
  opens?: number;
}

export interface SuppressedEmail {
  email: string;
  reason: 'hard_bounce' | 'soft_bounce' | 'spam_complaint' | 'unsubscribe' | 'manual_add';
  date: string;
  notes?: string;
}

export interface SuppressionListResponse {
  data: SuppressedEmail[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

export interface GDPRConsent {
  email: string;
  consentDate: string;
  consentSource: string;
  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;
  withdrawalDate?: string;
}

// Funciones API simuladas (a implementar con backend real)
export const getEmailHealthStats = async (
  range?: 'last7days' | 'last30days' | 'last90days'
): Promise<EmailHealthStats> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    healthScore: 89,
    bounceRate: {
      total: 1.2,
      hard: 0.3,
      soft: 0.9
    },
    spamComplaintRate: 0.08,
    unsubscribeRate: 0.5,
    openRate: 65.5,
    history: [
      { date: '2023-10-01', bounces: 10, complaints: 1, unsubscribes: 3, opens: 450 },
      { date: '2023-10-02', bounces: 12, complaints: 0, unsubscribes: 2, opens: 480 },
      { date: '2023-10-03', bounces: 8, complaints: 0, unsubscribes: 1, opens: 520 },
      { date: '2023-10-04', bounces: 15, complaints: 2, unsubscribes: 4, opens: 460 },
      { date: '2023-10-05', bounces: 9, complaints: 0, unsubscribes: 2, opens: 490 },
      { date: '2023-10-06', bounces: 11, complaints: 1, unsubscribes: 3, opens: 510 },
      { date: '2023-10-07', bounces: 7, complaints: 0, unsubscribes: 1, opens: 530 }
    ]
  };
};

export const getSuppressionList = async (
  filters?: {
    page?: number;
    limit?: number;
    search?: string;
  }
): Promise<SuppressionListResponse> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const mockSuppressed: SuppressedEmail[] = [
    {
      email: 'bounce@example.com',
      reason: 'hard_bounce',
      date: '2023-09-15T10:00:00Z',
      notes: 'Email inválido detectado automáticamente'
    },
    {
      email: 'complaint@example.com',
      reason: 'spam_complaint',
      date: '2023-09-16T11:30:00Z',
      notes: 'Marcado como spam por el usuario'
    },
    {
      email: 'unsubscribed@example.com',
      reason: 'unsubscribe',
      date: '2023-09-20T14:20:00Z'
    },
    {
      email: 'manual@example.com',
      reason: 'manual_add',
      date: '2023-10-01T09:00:00Z',
      notes: 'Añadido manualmente por el administrador'
    },
    {
      email: 'softbounce@example.com',
      reason: 'soft_bounce',
      date: '2023-10-10T16:45:00Z',
      notes: 'Buzón lleno - múltiples intentos fallidos'
    }
  ];
  
  let filtered = [...mockSuppressed];
  
  if (filters?.search) {
    const searchTerm = filters.search.toLowerCase();
    filtered = filtered.filter(item => item.email.toLowerCase().includes(searchTerm));
  }
  
  const page = filters?.page || 1;
  const limit = filters?.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return {
    data: filtered.slice(startIndex, endIndex),
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(filtered.length / limit),
      totalItems: filtered.length
    }
  };
};

export const addSuppressedEmail = async (
  email: string,
  reason?: string
): Promise<{ success: boolean; email: string; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Formato de email inválido');
  }
  
  return {
    success: true,
    email,
    message: 'Email añadido a la lista de supresión.'
  };
};

export const removeSuppressedEmail = async (
  email: string
): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    success: true,
    message: 'Email eliminado de la lista de supresión.'
  };
};

export const getGDPRConsents = async (
  filters?: {
    page?: number;
    limit?: number;
    email?: string;
  }
): Promise<{
  data: GDPRConsent[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const mockConsents: GDPRConsent[] = [
    {
      email: 'cliente1@example.com',
      consentDate: '2023-09-01T10:00:00Z',
      consentSource: 'Formulario de suscripción',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0...',
      isActive: true
    },
    {
      email: 'cliente2@example.com',
      consentDate: '2023-08-15T14:30:00Z',
      consentSource: 'Descarga de Guía de Nutrición',
      ipAddress: '192.168.1.2',
      isActive: true
    },
    {
      email: 'cliente3@example.com',
      consentDate: '2023-07-20T09:15:00Z',
      consentSource: 'Checkout de compra',
      ipAddress: '192.168.1.3',
      isActive: false,
      withdrawalDate: '2023-10-01T12:00:00Z'
    }
  ];
  
  let filtered = [...mockConsents];
  
  if (filters?.email) {
    filtered = filtered.filter(c => c.email.toLowerCase().includes(filters.email!.toLowerCase()));
  }
  
  const page = filters?.page || 1;
  const limit = filters?.limit || 10;
  const startIndex = (page - 1) * limit;
  
  return {
    data: filtered.slice(startIndex, startIndex + limit),
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(filtered.length / limit),
      totalItems: filtered.length
    }
  };
};

export const exportGDPRConsents = async (): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // En producción: generar CSV o PDF
  return 'gdpr_consents_export.csv';
};














