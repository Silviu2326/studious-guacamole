import { EngagementProgram, TeamMemberOwner } from '../types';

// Mock data de team members
const mockTeamMembers: TeamMemberOwner[] = [
  {
    id: 'tm_001',
    name: 'Marina González',
    email: 'marina@example.com',
    role: 'CX Lead',
    avatarUrl: undefined,
  },
  {
    id: 'tm_002',
    name: 'Luis Martínez',
    email: 'luis@example.com',
    role: 'Marketing Manager',
    avatarUrl: undefined,
  },
  {
    id: 'tm_003',
    name: 'Adriana Sánchez',
    email: 'adriana@example.com',
    role: 'Research Lead',
    avatarUrl: undefined,
  },
  {
    id: 'tm_004',
    name: 'Carlos Rodríguez',
    email: 'carlos@example.com',
    role: 'Community Manager',
    avatarUrl: undefined,
  },
  {
    id: 'tm_005',
    name: 'Ana López',
    email: 'ana@example.com',
    role: 'Community Manager',
    avatarUrl: undefined,
  },
];

// Mock data de programas (se actualizará desde el snapshot)
let programs: EngagementProgram[] = [];

/**
 * Obtiene todos los miembros del equipo disponibles para asignar como owners
 */
export const getAvailableTeamMembers = async (): Promise<TeamMemberOwner[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [...mockTeamMembers];
};

/**
 * Asigna un owner (team member) a un programa de fidelización
 */
export const assignProgramOwner = async (
  programId: string,
  ownerId: string
): Promise<EngagementProgram> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const program = programs.find((p) => p.id === programId);
  if (!program) {
    throw new Error('Programa no encontrado');
  }

  const owner = mockTeamMembers.find((m) => m.id === ownerId);
  if (!owner) {
    throw new Error('Miembro del equipo no encontrado');
  }

  // Actualizar el programa con el owner asignado
  program.assignedOwner = owner;
  program.assignedAt = new Date().toISOString();
  program.assignedBy = 'trainer_1'; // En producción vendría del contexto de autenticación

  return program;
};

/**
 * Remueve el owner asignado de un programa
 */
export const removeProgramOwner = async (programId: string): Promise<EngagementProgram> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const program = programs.find((p) => p.id === programId);
  if (!program) {
    throw new Error('Programa no encontrado');
  }

  delete program.assignedOwner;
  delete program.assignedAt;
  delete program.assignedBy;

  return program;
};

/**
 * Actualiza la lista de programas (usado para sincronizar con el snapshot)
 */
export const setPrograms = (programsList: EngagementProgram[]) => {
  programs = programsList;
};

/**
 * Obtiene un programa por ID
 */
export const getProgramById = async (programId: string): Promise<EngagementProgram | null> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return programs.find((p) => p.id === programId) || null;
};

