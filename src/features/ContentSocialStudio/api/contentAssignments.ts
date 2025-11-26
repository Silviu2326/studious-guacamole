import type {
  ContentAssignment,
  ContentPiece,
  TeamMember,
  ContentTeamRole,
  CreateContentAssignmentRequest,
  UpdateContentAssignmentRequest,
  ContentAssignmentStatus,
  ContentAssignmentPriority,
} from '../types';

// Mock storage - en producción vendría del backend
const assignments: ContentAssignment[] = [];
const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'María González',
    email: 'maria@example.com',
    role: 'video-editor',
    roleLabel: 'Editor de Video',
    isActive: true,
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    email: 'carlos@example.com',
    role: 'designer',
    roleLabel: 'Diseñador',
    isActive: true,
  },
  {
    id: '3',
    name: 'Ana Martínez',
    email: 'ana@example.com',
    role: 'video-editor',
    roleLabel: 'Editor de Video',
    isActive: true,
  },
  {
    id: '4',
    name: 'Luis Fernández',
    email: 'luis@example.com',
    role: 'designer',
    roleLabel: 'Diseñador',
    isActive: true,
  },
];

const contentPieces: ContentPiece[] = [
  {
    id: '1',
    title: 'Reel: Tips de entrenamiento matutino',
    description: 'Reel corto con 5 tips para entrenar por la mañana',
    type: 'reel',
    platform: 'instagram',
    content: {
      script: 'Hook: ¿Entrenas por la mañana? Aquí tienes 5 tips para maximizar tu rendimiento...',
      hashtags: ['fitness', 'entrenamiento', 'tips'],
    },
    source: 'ai-generator',
    status: 'draft',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Carousel: Rutina de fuerza',
    description: 'Carousel con rutina completa de fuerza para principiantes',
    type: 'carousel',
    platform: 'instagram',
    content: {
      caption: 'Rutina completa de fuerza para principiantes...',
      hashtags: ['fuerza', 'rutina', 'principiantes'],
    },
    source: 'planner',
    status: 'draft',
    createdAt: new Date().toISOString(),
  },
];

/**
 * Obtiene todos los miembros del equipo disponibles
 */
export const getTeamMembers = async (role?: ContentTeamRole): Promise<TeamMember[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (role) {
    return teamMembers.filter((member) => member.role === role && member.isActive);
  }

  return teamMembers.filter((member) => member.isActive);
};

/**
 * Obtiene todas las piezas de contenido disponibles para asignar
 */
export const getAvailableContentPieces = async (): Promise<ContentPiece[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return contentPieces.filter((piece) => piece.status === 'draft' || piece.status === 'assigned');
};

/**
 * Obtiene todas las asignaciones de contenido
 */
export const getContentAssignments = async (status?: ContentAssignmentStatus): Promise<ContentAssignment[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (status) {
    return assignments.filter((assignment) => assignment.status === status);
  }

  return assignments;
};

/**
 * Obtiene una asignación específica por ID
 */
export const getContentAssignmentById = async (id: string): Promise<ContentAssignment | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return assignments.find((assignment) => assignment.id === id) || null;
};

/**
 * Crea una nueva asignación de contenido
 */
export const createContentAssignment = async (
  request: CreateContentAssignmentRequest
): Promise<ContentAssignment> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const teamMember = teamMembers.find((member) => member.id === request.assignedToId);
  const contentPiece = contentPieces.find((piece) => piece.id === request.contentPieceId);

  if (!teamMember) {
    throw new Error('Miembro del equipo no encontrado');
  }

  if (!contentPiece) {
    throw new Error('Pieza de contenido no encontrada');
  }

  const assignment: ContentAssignment = {
    id: `assignment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    contentPieceId: request.contentPieceId,
    contentPiece,
    assignedTo: teamMember,
    assignedBy: 'trainer_1', // En producción vendría del contexto de autenticación
    role: request.role,
    status: 'pending',
    priority: request.priority,
    dueDate: request.dueDate,
    instructions: request.instructions,
    requirements: request.requirements || [],
    referenceMaterials: request.referenceMaterials?.map((material, index) => ({
      id: `material_${index}`,
      ...material,
    })),
    deliverables: request.deliverables,
    context: request.context,
    comments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  assignments.push(assignment);

  // Actualizar estado de la pieza de contenido
  contentPiece.status = 'assigned';
  contentPiece.updatedAt = new Date().toISOString();

  return assignment;
};

/**
 * Actualiza una asignación de contenido
 */
export const updateContentAssignment = async (
  request: UpdateContentAssignmentRequest
): Promise<ContentAssignment> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const assignment = assignments.find((a) => a.id === request.assignmentId);

  if (!assignment) {
    throw new Error('Asignación no encontrada');
  }

  if (request.status) {
    assignment.status = request.status;
  }

  if (request.instructions) {
    assignment.instructions = request.instructions;
  }

  if (request.priority) {
    assignment.priority = request.priority;
  }

  if (request.dueDate) {
    assignment.dueDate = request.dueDate;
  }

  if (request.comments && request.comments.length > 0) {
    const newComments = request.comments.map((comment, index) => ({
      id: `comment_${Date.now()}_${index}`,
      userId: 'trainer_1', // En producción vendría del contexto de autenticación
      userName: 'Trainer',
      message: comment.message,
      createdAt: new Date().toISOString(),
    }));

    assignment.comments = [...(assignment.comments || []), ...newComments];
  }

  assignment.updatedAt = new Date().toISOString();

  return assignment;
};

/**
 * Obtiene estadísticas de asignaciones
 */
export const getAssignmentStats = async (): Promise<{
  pendingAssignments: number;
  inProgressAssignments: number;
  completedAssignments: number;
  totalAssignments: number;
}> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const pendingAssignments = assignments.filter((a) => a.status === 'pending').length;
  const inProgressAssignments = assignments.filter((a) => a.status === 'in-progress').length;
  const completedAssignments = assignments.filter((a) => a.status === 'completed').length;

  return {
    pendingAssignments,
    inProgressAssignments,
    completedAssignments,
    totalAssignments: assignments.length,
  };
};

