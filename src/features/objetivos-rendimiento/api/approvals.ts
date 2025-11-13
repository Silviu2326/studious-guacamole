import { ApprovalRequest, ApprovalStatus, ApprovalType, ApprovalWorkflowConfig, ApprovalComment, Objective } from '../types';

// Mock data - En producción esto sería llamadas a una API real
const mockApprovalRequests: ApprovalRequest[] = [];

const defaultWorkflowConfig: ApprovalWorkflowConfig = {
  id: 'default',
  requiresApprovalFor: {
    criticalObjectives: true,
    significantChanges: true,
    targetModifications: true,
    deadlineExtensions: true,
    budgetChanges: true,
  },
  thresholds: {
    targetChangePercent: 20,
    deadlineExtensionDays: 7,
    budgetChangePercent: 15,
  },
  defaultApprovers: ['manager-1', 'manager-2'],
  approvalFlow: 'single',
  notifyOnRequest: true,
  notifyOnApproval: true,
  notifyOnRejection: true,
  notificationChannels: ['email', 'in_app'],
};

/**
 * Crea una solicitud de aprobación para un objetivo
 */
export const createApprovalRequest = async (
  objectiveId: string,
  objectiveTitle: string,
  type: ApprovalType,
  changes: ApprovalRequest['changes'],
  requestedBy: string,
  requestedByName: string,
  notes?: string,
  priority: ApprovalRequest['priority'] = 'medium',
  metadata?: ApprovalRequest['metadata']
): Promise<ApprovalRequest> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const approvalRequest: ApprovalRequest = {
    id: `approval-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    objectiveId,
    objectiveTitle,
    type,
    status: 'pending',
    changes,
    requestedBy,
    requestedByName,
    requestedAt: new Date().toISOString(),
    notes,
    priority,
    metadata,
    comments: [],
  };

  // Guardar en localStorage
  const saved = localStorage.getItem('approval-requests');
  const requests = saved ? JSON.parse(saved) : [];
  requests.push(approvalRequest);
  localStorage.setItem('approval-requests', JSON.stringify(requests));

  return approvalRequest;
};

/**
 * Obtiene todas las solicitudes de aprobación
 */
export const getApprovalRequests = async (
  filters?: {
    status?: ApprovalStatus;
    objectiveId?: string;
    requestedBy?: string;
    type?: ApprovalType;
  }
): Promise<ApprovalRequest[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  const saved = localStorage.getItem('approval-requests');
  let requests: ApprovalRequest[] = saved ? JSON.parse(saved) : [...mockApprovalRequests];

  // Aplicar filtros
  if (filters) {
    if (filters.status) {
      requests = requests.filter(r => r.status === filters.status);
    }
    if (filters.objectiveId) {
      requests = requests.filter(r => r.objectiveId === filters.objectiveId);
    }
    if (filters.requestedBy) {
      requests = requests.filter(r => r.requestedBy === filters.requestedBy);
    }
    if (filters.type) {
      requests = requests.filter(r => r.type === filters.type);
    }
  }

  return requests.sort((a, b) => 
    new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
  );
};

/**
 * Obtiene una solicitud de aprobación por ID
 */
export const getApprovalRequest = async (id: string): Promise<ApprovalRequest | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  const saved = localStorage.getItem('approval-requests');
  const requests: ApprovalRequest[] = saved ? JSON.parse(saved) : [];
  
  return requests.find(r => r.id === id) || null;
};

/**
 * Aprueba una solicitud de aprobación
 */
export const approveRequest = async (
  approvalId: string,
  approvedBy: string,
  approvedByName: string,
  notes?: string
): Promise<ApprovalRequest> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const saved = localStorage.getItem('approval-requests');
  const requests: ApprovalRequest[] = saved ? JSON.parse(saved) : [];
  
  const request = requests.find(r => r.id === approvalId);
  if (!request) {
    throw new Error('Solicitud de aprobación no encontrada');
  }

  request.status = 'approved';
  request.approvedBy = approvedBy;
  request.approvedByName = approvedByName;
  request.approvedAt = new Date().toISOString();
  if (notes) {
    request.notes = notes;
  }

  localStorage.setItem('approval-requests', JSON.stringify(requests));

  return request;
};

/**
 * Rechaza una solicitud de aprobación
 */
export const rejectRequest = async (
  approvalId: string,
  rejectedBy: string,
  rejectedByName: string,
  rejectionReason: string
): Promise<ApprovalRequest> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const saved = localStorage.getItem('approval-requests');
  const requests: ApprovalRequest[] = saved ? JSON.parse(saved) : [];
  
  const request = requests.find(r => r.id === approvalId);
  if (!request) {
    throw new Error('Solicitud de aprobación no encontrada');
  }

  request.status = 'rejected';
  request.approvedBy = rejectedBy;
  request.approvedByName = rejectedByName;
  request.rejectedAt = new Date().toISOString();
  request.rejectionReason = rejectionReason;

  localStorage.setItem('approval-requests', JSON.stringify(requests));

  return request;
};

/**
 * Solicita cambios en una solicitud de aprobación
 */
export const requestChanges = async (
  approvalId: string,
  requestedBy: string,
  requestedByName: string,
  changesRequested: string
): Promise<ApprovalRequest> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const saved = localStorage.getItem('approval-requests');
  const requests: ApprovalRequest[] = saved ? JSON.parse(saved) : [];
  
  const request = requests.find(r => r.id === approvalId);
  if (!request) {
    throw new Error('Solicitud de aprobación no encontrada');
  }

  request.status = 'needs_changes';
  if (!request.comments) {
    request.comments = [];
  }
  request.comments.push({
    id: `comment-${Date.now()}`,
    approvalRequestId: approvalId,
    content: changesRequested,
    createdBy: requestedBy,
    createdByName: requestedByName,
    createdAt: new Date().toISOString(),
    isInternal: false,
  });

  localStorage.setItem('approval-requests', JSON.stringify(requests));

  return request;
};

/**
 * Cancela una solicitud de aprobación
 */
export const cancelRequest = async (approvalId: string): Promise<ApprovalRequest> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const saved = localStorage.getItem('approval-requests');
  const requests: ApprovalRequest[] = saved ? JSON.parse(saved) : [];
  
  const request = requests.find(r => r.id === approvalId);
  if (!request) {
    throw new Error('Solicitud de aprobación no encontrada');
  }

  request.status = 'cancelled';

  localStorage.setItem('approval-requests', JSON.stringify(requests));

  return request;
};

/**
 * Agrega un comentario a una solicitud de aprobación
 */
export const addApprovalComment = async (
  approvalId: string,
  content: string,
  createdBy: string,
  createdByName: string,
  isInternal: boolean = false
): Promise<ApprovalComment> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  const saved = localStorage.getItem('approval-requests');
  const requests: ApprovalRequest[] = saved ? JSON.parse(saved) : [];
  
  const request = requests.find(r => r.id === approvalId);
  if (!request) {
    throw new Error('Solicitud de aprobación no encontrada');
  }

  const comment: ApprovalComment = {
    id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    approvalRequestId: approvalId,
    content,
    createdBy,
    createdByName,
    createdAt: new Date().toISOString(),
    isInternal,
  };

  if (!request.comments) {
    request.comments = [];
  }
  request.comments.push(comment);

  localStorage.setItem('approval-requests', JSON.stringify(requests));

  return comment;
};

/**
 * Obtiene la configuración del workflow de aprobaciones
 */
export const getWorkflowConfig = async (): Promise<ApprovalWorkflowConfig> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  const saved = localStorage.getItem('approval-workflow-config');
  if (saved) {
    return JSON.parse(saved);
  }

  return defaultWorkflowConfig;
};

/**
 * Actualiza la configuración del workflow de aprobaciones
 */
export const updateWorkflowConfig = async (
  config: Partial<ApprovalWorkflowConfig>
): Promise<ApprovalWorkflowConfig> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const current = await getWorkflowConfig();
  const updated = { ...current, ...config };
  
  localStorage.setItem('approval-workflow-config', JSON.stringify(updated));

  return updated;
};

/**
 * Verifica si un objetivo requiere aprobación basado en la configuración
 */
export const requiresApproval = async (
  objective: Objective,
  changes: { field: string; oldValue: any; newValue: any }[]
): Promise<{ requires: boolean; type?: ApprovalType; reason?: string }> => {
  const config = await getWorkflowConfig();

  // Verificar si es un objetivo crítico
  if (objective.isCritical && config.requiresApprovalFor.criticalObjectives) {
    return {
      requires: true,
      type: 'critical_objective',
      reason: 'Este objetivo está marcado como crítico y requiere aprobación ejecutiva',
    };
  }

  // Verificar cambios significativos
  if (config.requiresApprovalFor.significantChanges) {
    for (const change of changes) {
      // Cambio en target
      if (change.field === 'targetValue' && config.thresholds.targetChangePercent) {
        const oldValue = Number(change.oldValue) || 0;
        const newValue = Number(change.newValue) || 0;
        if (oldValue > 0) {
          const changePercent = Math.abs((newValue - oldValue) / oldValue) * 100;
          if (changePercent >= config.thresholds.targetChangePercent) {
            return {
              requires: true,
              type: 'target_modification',
              reason: `El cambio en el target (${changePercent.toFixed(1)}%) excede el umbral configurado (${config.thresholds.targetChangePercent}%)`,
            };
          }
        }
      }

      // Cambio en deadline
      if (change.field === 'deadline' && config.thresholds.deadlineExtensionDays) {
        const oldDate = new Date(change.oldValue);
        const newDate = new Date(change.newValue);
        const daysDiff = Math.ceil((newDate.getTime() - oldDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff >= config.thresholds.deadlineExtensionDays) {
          return {
            requires: true,
            type: 'deadline_extension',
            reason: `La extensión del deadline (${daysDiff} días) excede el umbral configurado (${config.thresholds.deadlineExtensionDays} días)`,
          };
        }
      }
    }
  }

  return { requires: false };
};

