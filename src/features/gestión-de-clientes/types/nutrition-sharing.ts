/**
 * Tipos para compartir planes nutricionales con nutricionistas aliados
 */

export interface Nutritionist {
  id: string;
  name: string;
  email: string;
  phone?: string;
  especialidades?: string[];
  certificaciones?: string[];
  activo: boolean;
  fechaRegistro: string;
}

export interface NutritionPlanShare {
  id: string;
  planNutricionalId: string;
  planNutricionalNombre: string;
  clienteId: string;
  clienteName: string;
  trainerId: string;
  trainerName: string;
  nutritionistId: string;
  nutritionistName: string;
  fechaCompartido: string;
  permisos: NutritionPlanPermissions;
  estado: 'pendiente' | 'aceptado' | 'rechazado' | 'revocado';
  notas?: string;
  ultimaActualizacion?: string;
}

export interface NutritionPlanPermissions {
  puedeVer: boolean;
  puedeEditar: boolean;
  puedeComentar: boolean;
  puedeAjustarMacros: boolean;
  puedeVerHistorial: boolean;
  puedeAsignarComidas: boolean;
}

export interface NutritionPlanComment {
  id: string;
  planShareId: string;
  autorId: string;
  autorName: string;
  autorTipo: 'trainer' | 'nutritionist';
  contenido: string;
  fechaCreacion: string;
  editado: boolean;
  fechaEdicion?: string;
  respuestas?: NutritionPlanComment[];
}

export interface NutritionPlanAdjustment {
  id: string;
  planShareId: string;
  realizadoPorId: string;
  realizadoPorName: string;
  realizadoPorTipo: 'trainer' | 'nutritionist';
  tipoAjuste: 'macros' | 'comidas' | 'horarios' | 'restricciones' | 'objetivo';
  descripcion: string;
  cambios: Record<string, any>; // Cambios específicos realizados
  razon?: string;
  fechaAjuste: string;
  aprobado: boolean;
  aprobadoPorId?: string;
  fechaAprobacion?: string;
}

export interface NutritionPlanSync {
  id: string;
  planShareId: string;
  ultimaSincronizacion: string;
  version: number; // Versión del plan para control de cambios
  cambiosPendientes: boolean;
  conflictos?: NutritionPlanConflict[];
}

export interface NutritionPlanConflict {
  id: string;
  campo: string;
  valorTrainer: any;
  valorNutritionist: any;
  resuelto: boolean;
  resueltoPor?: string;
  fechaResolucion?: string;
}

export interface NutritionistInvitation {
  id: string;
  trainerId: string;
  trainerName: string;
  nutritionistId: string;
  nutritionistName: string;
  nutritionistEmail: string;
  planNutricionalId?: string; // Si se invita para un plan específico
  clienteId?: string; // Si se invita para un cliente específico
  mensaje?: string;
  fechaInvitacion: string;
  fechaExpiracion?: string;
  estado: 'pendiente' | 'aceptada' | 'rechazada' | 'expirada';
  tipoInvitacion: 'plan-especifico' | 'cliente-especifico' | 'colaboracion-general';
}

