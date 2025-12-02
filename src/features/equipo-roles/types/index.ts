// Tipos para el módulo de Equipo & Roles

export interface Role {
  id: string;
  name: string;
  isCustom: boolean;
  permissions?: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'active' | 'inactive' | 'pending';
  lastLogin?: string;
}

export interface TeamMembersResponse {
  data: TeamMember[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface InvitationData {
  name: string;
  email: string;
  roleId: string;
}

export interface InvitationResponse {
  success: boolean;
  message: string;
  inviteId: string;
}

export interface TeamMemberUpdate {
  roleId?: string;
  status?: 'active' | 'inactive';
}

export interface RoleCreate {
  name: string;
  permissions: string[];
}

export interface PermissionGroup {
  category: string;
  permissions: Permission[];
}

export interface Permission {
  key: string;
  label: string;
  description?: string;
}

export interface TeamFilters {
  page?: number;
  limit?: number;
  roleId?: string;
  search?: string;
}

export interface TeamKPIs {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  pendingInvitations: number;
  membersByRole: Record<string, number>;
  customRolesCount: number;
}

