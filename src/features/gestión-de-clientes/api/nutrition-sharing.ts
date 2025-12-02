import {
  NutritionPlanShare,
  Nutritionist,
  NutritionPlanPermissions,
  NutritionPlanComment,
  NutritionPlanAdjustment,
  NutritionistInvitation,
} from '../types/nutrition-sharing';

// Mock data para desarrollo
const MOCK_NUTRITIONISTS: Nutritionist[] = [
  {
    id: 'nutritionist_1',
    name: 'Ana García',
    email: 'ana.garcia@nutrition.com',
    phone: '+34612345678',
    especialidades: ['Pérdida de peso', 'Nutrición deportiva'],
    certificaciones: ['Licenciada en Nutrición', 'Certificado en Nutrición Deportiva'],
    activo: true,
    fechaRegistro: '2024-01-15T10:00:00Z',
  },
  {
    id: 'nutritionist_2',
    name: 'Carlos Martínez',
    email: 'carlos.martinez@nutrition.com',
    phone: '+34612345679',
    especialidades: ['Ganancia muscular', 'Nutrición vegana'],
    certificaciones: ['Máster en Nutrición Clínica'],
    activo: true,
    fechaRegistro: '2024-02-01T10:00:00Z',
  },
];

const MOCK_PLAN_SHARES: NutritionPlanShare[] = [];
const MOCK_PLAN_COMMENTS: NutritionPlanComment[] = [];
const MOCK_PLAN_ADJUSTMENTS: NutritionPlanAdjustment[] = [];
const MOCK_INVITATIONS: NutritionistInvitation[] = [];

/**
 * Obtiene todos los nutricionistas disponibles
 */
export const getNutritionists = async (): Promise<Nutritionist[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return MOCK_NUTRITIONISTS.filter(n => n.activo);
};

/**
 * Obtiene un nutricionista por ID
 */
export const getNutritionistById = async (nutritionistId: string): Promise<Nutritionist | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return MOCK_NUTRITIONISTS.find(n => n.id === nutritionistId) || null;
};

/**
 * Busca nutricionistas por nombre o especialidad
 */
export const searchNutritionists = async (query: string): Promise<Nutritionist[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const lowerQuery = query.toLowerCase();
  return MOCK_NUTRITIONISTS.filter(n => 
    n.activo && (
      n.name.toLowerCase().includes(lowerQuery) ||
      n.email.toLowerCase().includes(lowerQuery) ||
      n.especialidades?.some(e => e.toLowerCase().includes(lowerQuery))
    )
  );
};

/**
 * Comparte un plan nutricional con un nutricionista
 */
export const shareNutritionPlan = async (
  planNutricionalId: string,
  planNutricionalNombre: string,
  clienteId: string,
  clienteName: string,
  trainerId: string,
  trainerName: string,
  nutritionistId: string,
  nutritionistName: string,
  permisos?: Partial<NutritionPlanPermissions>
): Promise<NutritionPlanShare> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  // Permisos por defecto
  const defaultPermisos: NutritionPlanPermissions = {
    puedeVer: true,
    puedeEditar: true,
    puedeComentar: true,
    puedeAjustarMacros: true,
    puedeVerHistorial: true,
    puedeAsignarComidas: false,
  };

  const finalPermisos = { ...defaultPermisos, ...permisos };

  const share: NutritionPlanShare = {
    id: `share_${Date.now()}`,
    planNutricionalId,
    planNutricionalNombre,
    clienteId,
    clienteName,
    trainerId,
    trainerName,
    nutritionistId,
    nutritionistName,
    fechaCompartido: new Date().toISOString(),
    permisos: finalPermisos,
    estado: 'pendiente',
    ultimaActualizacion: new Date().toISOString(),
  };

  MOCK_PLAN_SHARES.push(share);
  return share;
};

/**
 * Obtiene todos los planes compartidos de un entrenador
 */
export const getSharedPlans = async (
  trainerId: string,
  clienteId?: string
): Promise<NutritionPlanShare[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  let shares = MOCK_PLAN_SHARES.filter(s => s.trainerId === trainerId);
  
  if (clienteId) {
    shares = shares.filter(s => s.clienteId === clienteId);
  }

  return shares;
};

/**
 * Obtiene los planes compartidos con un nutricionista
 */
export const getSharedPlansForNutritionist = async (
  nutritionistId: string
): Promise<NutritionPlanShare[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  return MOCK_PLAN_SHARES.filter(
    s => s.nutritionistId === nutritionistId && s.estado === 'aceptado'
  );
};

/**
 * Obtiene un plan compartido por ID
 */
export const getSharedPlanById = async (shareId: string): Promise<NutritionPlanShare | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return MOCK_PLAN_SHARES.find(s => s.id === shareId) || null;
};

/**
 * Actualiza los permisos de un plan compartido
 */
export const updateSharedPlanPermissions = async (
  shareId: string,
  permisos: Partial<NutritionPlanPermissions>
): Promise<NutritionPlanShare> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  const index = MOCK_PLAN_SHARES.findIndex(s => s.id === shareId);
  if (index === -1) throw new Error('Shared plan not found');

  MOCK_PLAN_SHARES[index].permisos = {
    ...MOCK_PLAN_SHARES[index].permisos,
    ...permisos,
  };
  MOCK_PLAN_SHARES[index].ultimaActualizacion = new Date().toISOString();

  return MOCK_PLAN_SHARES[index];
};

/**
 * Acepta o rechaza un plan compartido (por el nutricionista)
 */
export const respondToSharedPlan = async (
  shareId: string,
  respuesta: 'aceptado' | 'rechazado'
): Promise<NutritionPlanShare> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  const index = MOCK_PLAN_SHARES.findIndex(s => s.id === shareId);
  if (index === -1) throw new Error('Shared plan not found');

  MOCK_PLAN_SHARES[index].estado = respuesta;
  MOCK_PLAN_SHARES[index].ultimaActualizacion = new Date().toISOString();

  return MOCK_PLAN_SHARES[index];
};

/**
 * Revoca el acceso a un plan compartido
 */
export const revokeSharedPlan = async (shareId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const index = MOCK_PLAN_SHARES.findIndex(s => s.id === shareId);
  if (index !== -1) {
    MOCK_PLAN_SHARES[index].estado = 'revocado';
    MOCK_PLAN_SHARES[index].ultimaActualizacion = new Date().toISOString();
  }
};

/**
 * Agrega un comentario a un plan compartido
 */
export const addPlanComment = async (
  planShareId: string,
  autorId: string,
  autorName: string,
  autorTipo: 'trainer' | 'nutritionist',
  contenido: string
): Promise<NutritionPlanComment> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  const comment: NutritionPlanComment = {
    id: `comment_${Date.now()}`,
    planShareId,
    autorId,
    autorName,
    autorTipo,
    contenido,
    fechaCreacion: new Date().toISOString(),
    editado: false,
    respuestas: [],
  };

  MOCK_PLAN_COMMENTS.push(comment);
  return comment;
};

/**
 * Obtiene los comentarios de un plan compartido
 */
export const getPlanComments = async (planShareId: string): Promise<NutritionPlanComment[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return MOCK_PLAN_COMMENTS.filter(c => c.planShareId === planShareId);
};

/**
 * Registra un ajuste realizado en un plan compartido
 */
export const recordPlanAdjustment = async (
  planShareId: string,
  realizadoPorId: string,
  realizadoPorName: string,
  realizadoPorTipo: 'trainer' | 'nutritionist',
  tipoAjuste: 'macros' | 'comidas' | 'horarios' | 'restricciones' | 'objetivo',
  descripcion: string,
  cambios: Record<string, any>,
  razon?: string
): Promise<NutritionPlanAdjustment> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  const adjustment: NutritionPlanAdjustment = {
    id: `adjustment_${Date.now()}`,
    planShareId,
    realizadoPorId,
    realizadoPorName,
    realizadoPorTipo,
    tipoAjuste,
    descripcion,
    cambios,
    razon,
    fechaAjuste: new Date().toISOString(),
    aprobado: false,
  };

  MOCK_PLAN_ADJUSTMENTS.push(adjustment);
  return adjustment;
};

/**
 * Obtiene los ajustes de un plan compartido
 */
export const getPlanAdjustments = async (
  planShareId: string
): Promise<NutritionPlanAdjustment[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return MOCK_PLAN_ADJUSTMENTS.filter(a => a.planShareId === planShareId);
};

/**
 * Aprueba un ajuste de plan
 */
export const approvePlanAdjustment = async (
  adjustmentId: string,
  aprobadoPorId: string
): Promise<NutritionPlanAdjustment> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  const index = MOCK_PLAN_ADJUSTMENTS.findIndex(a => a.id === adjustmentId);
  if (index === -1) throw new Error('Adjustment not found');

  MOCK_PLAN_ADJUSTMENTS[index].aprobado = true;
  MOCK_PLAN_ADJUSTMENTS[index].aprobadoPorId = aprobadoPorId;
  MOCK_PLAN_ADJUSTMENTS[index].fechaAprobacion = new Date().toISOString();

  return MOCK_PLAN_ADJUSTMENTS[index];
};

/**
 * Envía una invitación a un nutricionista
 */
export const sendNutritionistInvitation = async (
  trainerId: string,
  trainerName: string,
  nutritionistId: string,
  nutritionistName: string,
  nutritionistEmail: string,
  tipoInvitacion: 'plan-especifico' | 'cliente-especifico' | 'colaboracion-general',
  planNutricionalId?: string,
  clienteId?: string,
  mensaje?: string
): Promise<NutritionistInvitation> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const invitation: NutritionistInvitation = {
    id: `invitation_${Date.now()}`,
    trainerId,
    trainerName,
    nutritionistId,
    nutritionistName,
    nutritionistEmail,
    planNutricionalId,
    clienteId,
    mensaje,
    fechaInvitacion: new Date().toISOString(),
    fechaExpiracion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días
    estado: 'pendiente',
    tipoInvitacion,
  };

  MOCK_INVITATIONS.push(invitation);
  return invitation;
};

/**
 * Obtiene las invitaciones de un entrenador
 */
export const getTrainerInvitations = async (trainerId: string): Promise<NutritionistInvitation[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return MOCK_INVITATIONS.filter(i => i.trainerId === trainerId);
};

/**
 * Obtiene las invitaciones de un nutricionista
 */
export const getNutritionistInvitations = async (
  nutritionistId: string
): Promise<NutritionistInvitation[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return MOCK_INVITATIONS.filter(i => i.nutritionistId === nutritionistId);
};

/**
 * Responde a una invitación
 */
export const respondToInvitation = async (
  invitationId: string,
  respuesta: 'aceptada' | 'rechazada'
): Promise<NutritionistInvitation> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  const index = MOCK_INVITATIONS.findIndex(i => i.id === invitationId);
  if (index === -1) throw new Error('Invitation not found');

  MOCK_INVITATIONS[index].estado = respuesta;

  // Si se acepta, crear automáticamente el share si es para un plan específico
  if (respuesta === 'aceptada' && MOCK_INVITATIONS[index].planNutricionalId) {
    const inv = MOCK_INVITATIONS[index];
    // Aquí se podría crear automáticamente el share
    // Por ahora solo actualizamos el estado
  }

  return MOCK_INVITATIONS[index];
};

