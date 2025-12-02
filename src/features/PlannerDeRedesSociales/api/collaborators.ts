// API para gestión de colaboradores

import { SocialPost } from './social';

export type CollaboratorRole = 'admin' | 'editor' | 'viewer' | 'approver';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'draft';

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: CollaboratorRole;
  avatarUrl?: string;
  permissions: {
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canPublish: boolean;
    canApprove: boolean;
    canViewAnalytics: boolean;
  };
  invitedAt: string;
  joinedAt?: string;
  status: 'pending' | 'active' | 'inactive';
}

export interface PostApproval {
  id: string;
  postId: string;
  post: Partial<SocialPost>;
  submittedBy: string; // Collaborator ID
  submittedAt: string;
  status: ApprovalStatus;
  reviewedBy?: string; // Collaborator ID
  reviewedAt?: string;
  comments?: string;
  changes?: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
}

export interface ApprovalWorkflow {
  id: string;
  name: string;
  enabled: boolean;
  requireApproval: boolean;
  approvers: string[]; // Collaborator IDs
  autoApproveAfter?: number; // horas
}

export const getCollaborators = async (): Promise<Collaborator[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    {
      id: 'collab_001',
      name: 'Laura García',
      email: 'laura@fitness.com',
      role: 'admin',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      permissions: {
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canPublish: true,
        canApprove: true,
        canViewAnalytics: true
      },
      invitedAt: '2024-01-01T00:00:00Z',
      joinedAt: '2024-01-01T00:00:00Z',
      status: 'active'
    },
    {
      id: 'collab_002',
      name: 'María López',
      email: 'maria@fitness.com',
      role: 'editor',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
      permissions: {
        canCreate: true,
        canEdit: true,
        canDelete: false,
        canPublish: false,
        canApprove: false,
        canViewAnalytics: true
      },
      invitedAt: '2024-01-15T00:00:00Z',
      joinedAt: '2024-01-16T00:00:00Z',
      status: 'active'
    },
    {
      id: 'collab_003',
      name: 'Carlos Ruiz',
      email: 'carlos@fitness.com',
      role: 'approver',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      permissions: {
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canPublish: false,
        canApprove: true,
        canViewAnalytics: true
      },
      invitedAt: '2024-01-20T00:00:00Z',
      joinedAt: '2024-01-21T00:00:00Z',
      status: 'active'
    },
    {
      id: 'collab_004',
      name: 'Ana Martínez',
      email: 'ana@fitness.com',
      role: 'viewer',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
      permissions: {
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canPublish: false,
        canApprove: false,
        canViewAnalytics: true
      },
      invitedAt: '2024-01-25T00:00:00Z',
      status: 'pending'
    }
  ];
};

export const getPostApprovals = async (): Promise<PostApproval[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    {
      id: 'approval_001',
      postId: 'post_001',
      post: {
        content: '¡Empezamos la semana con energía! ¿Quién se apunta a un reto de 30 días?',
        platform: 'instagram',
        scheduledAt: '2024-01-28T09:00:00Z'
      },
      submittedBy: 'collab_002',
      submittedAt: '2024-01-27T10:00:00Z',
      status: 'pending'
    },
    {
      id: 'approval_002',
      postId: 'post_003',
      post: {
        content: 'Tip de nutrición: ¡No le temas a los carbohidratos!',
        platform: 'facebook',
        scheduledAt: '2024-01-29T12:00:00Z'
      },
      submittedBy: 'collab_002',
      submittedAt: '2024-01-27T14:00:00Z',
      status: 'approved',
      reviewedBy: 'collab_003',
      reviewedAt: '2024-01-27T15:00:00Z',
      comments: 'Aprobado. Buen contenido.'
    }
  ];
};

export const inviteCollaborator = async (
  email: string,
  role: CollaboratorRole
): Promise<Collaborator> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return {
    id: `collab_${Date.now()}`,
    name: email.split('@')[0],
    email,
    role,
    permissions: getPermissionsForRole(role),
    invitedAt: new Date().toISOString(),
    status: 'pending'
  };
};

export const updateCollaborator = async (
  id: string,
  updates: Partial<Collaborator>
): Promise<Collaborator> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const collaborators = await getCollaborators();
  const existing = collaborators.find(c => c.id === id);
  
  if (!existing) {
    throw new Error('Colaborador no encontrado');
  }
  
  return {
    ...existing,
    ...updates,
    permissions: updates.role ? getPermissionsForRole(updates.role) : existing.permissions
  };
};

export const deleteCollaborator = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  // En producción, eliminar de la base de datos
};

export const submitForApproval = async (
  postId: string,
  submittedBy: string
): Promise<PostApproval> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return {
    id: `approval_${Date.now()}`,
    postId,
    post: {},
    submittedBy,
    submittedAt: new Date().toISOString(),
    status: 'pending'
  };
};

export const approvePost = async (
  approvalId: string,
  reviewedBy: string,
  comments?: string
): Promise<PostApproval> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const approvals = await getPostApprovals();
  const existing = approvals.find(a => a.id === approvalId);
  
  if (!existing) {
    throw new Error('Aprobación no encontrada');
  }
  
  return {
    ...existing,
    status: 'approved',
    reviewedBy,
    reviewedAt: new Date().toISOString(),
    comments
  };
};

export const rejectPost = async (
  approvalId: string,
  reviewedBy: string,
  comments: string
): Promise<PostApproval> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const approvals = await getPostApprovals();
  const existing = approvals.find(a => a.id === approvalId);
  
  if (!existing) {
    throw new Error('Aprobación no encontrada');
  }
  
  return {
    ...existing,
    status: 'rejected',
    reviewedBy,
    reviewedAt: new Date().toISOString(),
    comments
  };
};

function getPermissionsForRole(role: CollaboratorRole): Collaborator['permissions'] {
  switch (role) {
    case 'admin':
      return {
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canPublish: true,
        canApprove: true,
        canViewAnalytics: true
      };
    case 'editor':
      return {
        canCreate: true,
        canEdit: true,
        canDelete: false,
        canPublish: false,
        canApprove: false,
        canViewAnalytics: true
      };
    case 'approver':
      return {
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canPublish: false,
        canApprove: true,
        canViewAnalytics: true
      };
    case 'viewer':
      return {
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canPublish: false,
        canApprove: false,
        canViewAnalytics: true
      };
    default:
      return {
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canPublish: false,
        canApprove: false,
        canViewAnalytics: false
      };
  }
}

export const getApprovalWorkflow = async (): Promise<ApprovalWorkflow> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    id: 'workflow_001',
    name: 'Flujo de Aprobación Estándar',
    enabled: true,
    requireApproval: true,
    approvers: ['collab_001', 'collab_003'],
    autoApproveAfter: 48 // 48 horas
  };
};

