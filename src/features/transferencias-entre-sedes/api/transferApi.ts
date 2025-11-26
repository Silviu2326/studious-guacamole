import { 
  TransferResponse, 
  Transfer, 
  CreateTransferRequest, 
  UpdateTransferStatusRequest,
  TransferFilters,
  KPIData
} from '../types';

const API_BASE = '/api';

// Mock data para desarrollo
const mockTransfers: Transfer[] = [
  {
    id: 'tf_1',
    member: { id: 'mem_1', name: 'Juan Pérez', email: 'juan@example.com' },
    originLocation: { id: 'loc_1', name: 'Sede Central' },
    destinationLocation: { id: 'loc_2', name: 'Sede Norte' },
    status: 'PENDING',
    requestedDate: new Date('2024-01-15T10:00:00'),
    effectiveDate: new Date('2024-02-01T00:00:00'),
    requestedBy: 'user_1',
  },
  {
    id: 'tf_2',
    member: { id: 'mem_2', name: 'María García', email: 'maria@example.com' },
    originLocation: { id: 'loc_2', name: 'Sede Norte' },
    destinationLocation: { id: 'loc_3', name: 'Sede Sur' },
    status: 'APPROVED',
    requestedDate: new Date('2024-01-20T09:30:00'),
    effectiveDate: new Date('2024-02-15T00:00:00'),
    approvedDate: new Date('2024-01-21T14:00:00'),
    approvedBy: 'user_2',
    requestedBy: 'user_1',
  },
];

const mockKPIs: KPIData = {
  totalTransfers: 15,
  pendingTransfers: 5,
  approvedTransfers: 7,
  rejectedTransfers: 2,
  completedTransfers: 1,
  averageResolutionTime: 24.5,
  approvalRate: 87.5,
  topOriginLocations: [
    { location: { id: 'loc_1', name: 'Sede Central' }, count: 8 },
    { location: { id: 'loc_2', name: 'Sede Norte' }, count: 5 },
  ],
  topDestinationLocations: [
    { location: { id: 'loc_2', name: 'Sede Norte' }, count: 6 },
    { location: { id: 'loc_3', name: 'Sede Sur' }, count: 4 },
  ],
  netTransferredRevenue: 1500,
};

// Obtener token de autenticación
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken') || null;
};

// Helper para hacer peticiones fetch con autenticación
const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = getAuthToken();
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('No autorizado: El token de autenticación no es válido o ha expirado.');
    }
    if (response.status === 403) {
      throw new Error('Acceso denegado: No tiene permisos para acceder a este recurso.');
    }
    if (response.status === 400) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Solicitud inválida: Parámetros faltantes o con formato incorrecto.');
    }
    if (response.status === 404) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Recurso no encontrado.');
    }
    if (response.status === 409) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Conflicto: La transferencia no está en el estado requerido.');
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error: ${response.statusText}`);
  }

  return response;
};

/**
 * Obtiene una lista paginada de transferencias con filtros
 */
export const getTransfers = async (filters: TransferFilters = {}): Promise<TransferResponse> => {
  // Mock data para desarrollo - Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let filtered = [...mockTransfers];
  
  if (filters.status) {
    filtered = filtered.filter(t => t.status === filters.status);
  }
  if (filters.originLocationId) {
    filtered = filtered.filter(t => t.originLocation.id === filters.originLocationId);
  }
  if (filters.destinationLocationId) {
    filtered = filtered.filter(t => t.destinationLocation.id === filters.destinationLocationId);
  }
  
  return {
    data: filtered,
    pagination: {
      currentPage: filters.page || 1,
      totalPages: 1,
      totalItems: filtered.length,
    },
  };
  
  /* Código real de API - comentado para desarrollo
  try {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.originLocationId) params.append('originLocationId', filters.originLocationId);
    if (filters.destinationLocationId) params.append('destinationLocationId', filters.destinationLocationId);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom.toISOString());
    if (filters.dateTo) params.append('dateTo', filters.dateTo.toISOString());
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await fetchWithAuth(`${API_BASE}/multisede/transferencias?${params.toString()}`);
    return await response.json();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al obtener las transferencias.';
    throw new Error(errorMessage);
  }
  */
};

/**
 * Crea una nueva solicitud de transferencia
 */
export const createTransfer = async (request: CreateTransferRequest): Promise<Transfer> => {
  // Mock data para desarrollo
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newTransfer: Transfer = {
    id: `tf_${Date.now()}`,
    member: { id: request.memberId, name: 'Nuevo Socio' },
    originLocation: { id: 'loc_1', name: 'Sede Origen' },
    destinationLocation: { id: request.destinationLocationId, name: 'Sede Destino' },
    status: 'PENDING',
    requestedDate: new Date(),
    effectiveDate: new Date(request.effectiveDate),
    notes: request.notes,
    requestedBy: 'current_user',
  };
  
  mockTransfers.push(newTransfer);
  return newTransfer;
  
  /* Código real de API - comentado para desarrollo
  try {
    const response = await fetchWithAuth(`${API_BASE}/multisede/transferencias`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al crear la transferencia.';
    throw new Error(errorMessage);
  }
  */
};

/**
 * Actualiza el estado de una transferencia (aprobar o rechazar)
 */
export const updateTransferStatus = async (
  transferId: string,
  request: UpdateTransferStatusRequest
): Promise<Transfer> => {
  // Mock data para desarrollo
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const transfer = mockTransfers.find(t => t.id === transferId);
  if (!transfer) {
    throw new Error('Transferencia no encontrada');
  }
  
  transfer.status = request.status;
  if (request.status === 'APPROVED') {
    transfer.approvedDate = new Date();
    transfer.approvedBy = 'current_user';
  } else if (request.status === 'REJECTED') {
    transfer.rejectionReason = request.rejectionReason;
  }
  
  return transfer;
  
  /* Código real de API - comentado para desarrollo
  try {
    const response = await fetchWithAuth(`${API_BASE}/multisede/transferencias/${transferId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(request),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al actualizar la transferencia.';
    throw new Error(errorMessage);
  }
  */
};

/**
 * Obtiene los KPIs del dashboard de transferencias
 */
export const getTransferKPIs = async (): Promise<KPIData> => {
  // Mock data para desarrollo
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockKPIs;
  
  /* Código real de API - comentado para desarrollo
  try {
    const response = await fetchWithAuth(`${API_BASE}/multisede/transferencias/kpis`);
    const data = await response.json();
    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al obtener los KPIs.';
    throw new Error(errorMessage);
  }
  */
};

