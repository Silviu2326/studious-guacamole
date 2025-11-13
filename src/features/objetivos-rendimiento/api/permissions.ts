import { PermissionEntity } from '../types';

// Mock data - En producción esto sería llamadas a una API real
const mockUsers: PermissionEntity[] = [
  {
    id: 'user-1',
    name: 'Juan Pérez',
    type: 'user',
    email: 'juan.perez@example.com',
  },
  {
    id: 'user-2',
    name: 'María García',
    type: 'user',
    email: 'maria.garcia@example.com',
  },
  {
    id: 'user-3',
    name: 'Carlos López',
    type: 'user',
    email: 'carlos.lopez@example.com',
  },
  {
    id: 'user-4',
    name: 'Ana Martínez',
    type: 'user',
    email: 'ana.martinez@example.com',
  },
];

const mockRoles: PermissionEntity[] = [
  {
    id: 'role-manager',
    name: 'Manager',
    type: 'role',
  },
  {
    id: 'role-team-lead',
    name: 'Team Lead',
    type: 'role',
  },
  {
    id: 'role-member',
    name: 'Team Member',
    type: 'role',
  },
  {
    id: 'role-viewer',
    name: 'Viewer',
    type: 'role',
  },
];

export const getTeamMembers = async (): Promise<PermissionEntity[]> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  
  // Load from localStorage if available
  const saved = localStorage.getItem('permissions-users');
  if (saved) {
    return JSON.parse(saved);
  }
  
  return [...mockUsers];
};

export const getRoles = async (): Promise<PermissionEntity[]> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  
  // Load from localStorage if available
  const saved = localStorage.getItem('permissions-roles');
  if (saved) {
    return JSON.parse(saved);
  }
  
  return [...mockRoles];
};

export const updateObjectivePermissions = async (
  objectiveId: string,
  permissions: any
): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  // Load objectives from localStorage
  const saved = localStorage.getItem('objectives-data');
  if (saved) {
    const objectives = JSON.parse(saved);
    const index = objectives.findIndex((obj: any) => obj.id === objectiveId);
    if (index !== -1) {
      objectives[index].permissions = permissions;
      localStorage.setItem('objectives-data', JSON.stringify(objectives));
    }
  }
};

export const updateKPIPermissions = async (
  kpiId: string,
  permissions: any
): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  // Load KPIs from localStorage
  const saved = localStorage.getItem('kpis-data');
  if (saved) {
    const kpis = JSON.parse(saved);
    const index = kpis.findIndex((kpi: any) => kpi.id === kpiId);
    if (index !== -1) {
      kpis[index].permissions = permissions;
      localStorage.setItem('kpis-data', JSON.stringify(kpis));
    }
  }
};

