// Tipos para el módulo de Roles & Permisos

export interface Role {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  userCount: number;
  permissions?: string[];
}

export type RoleWithUserCount = Role;

export interface Permission {
  slug: string;
  description: string;
  label?: string;
}

export interface PermissionGroup {
  groupName: string;
  permissions: Permission[];
}

export interface RoleCreate {
  name: string;
  description: string;
  permissions: string[];
}

export interface RoleUpdate {
  name?: string;
  description?: string;
  permissions?: string[];
}

export interface RolesResponse {
  data: Role[];
  total: number;
}

export interface PermissionsResponse {
  data: PermissionGroup[];
}

