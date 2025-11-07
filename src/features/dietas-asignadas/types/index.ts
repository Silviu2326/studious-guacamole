export interface Dieta {
  id: string;
  clienteId: string;
  clienteNombre?: string;
  tipo: 'individual' | 'plan-estandar' | 'pack-semanal';
  nombre: string;
  descripcion?: string;
  objetivo: ObjetivoNutricional;
  macros: MacrosNutricionales;
  comidas: Comida[];
  fechaInicio: string;
  fechaFin?: string;
  estado: 'activa' | 'pausada' | 'finalizada';
  restricciones?: string[];
  fotosComida?: FotoComida[];
  adherencia?: number; // Porcentaje de cumplimiento
  creadoEn: string;
  actualizadoEn: string;
  creadoPor: string;
}

export interface PlanNutricional {
  id: string;
  nombre: string;
  descripcion: string;
  nivel: string; // Ej: "Nivel 1", "Nivel 2"
  categoria: CategoriaPlan;
  objetivo: ObjetivoNutricional;
  macros: MacrosNutricionales;
  comidas: Comida[];
  duracionSemanas?: number;
  precio?: number;
  activo: boolean;
  usoCount: number;
  efectividad?: {
    tasaExito: number;
    satisfaccionPromedio: number;
  };
  creadoEn: string;
}

export interface PackSemanal {
  id: string;
  nombre: string;
  descripcion: string;
  planId?: string;
  semanaNumero: number;
  macros: MacrosNutricionales;
  comidas: Comida[];
  fechaInicio: string;
  fechaFin: string;
}

export interface MacrosNutricionales {
  calorias: number;
  proteinas: number; // gramos
  carbohidratos: number; // gramos
  grasas: number; // gramos
}

export interface Comida {
  id: string;
  nombre: string;
  tipo: TipoComida;
  alimentos: Alimento[];
  horario?: string;
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
  notas?: string;
}

export interface Alimento {
  id: string;
  nombre: string;
  cantidad: number;
  unidad: string;
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
}

export interface FotoComida {
  id: string;
  url: string;
  tipoComida: TipoComida;
  fecha: string;
  comentario?: string;
  validada: boolean;
}

export interface AsignacionDieta {
  id: string;
  dietaId: string;
  clienteId: string;
  planId?: string;
  packId?: string;
  fechaAsignacion: string;
  fechaInicio: string;
  fechaFin?: string;
  estado: 'activa' | 'pausada' | 'finalizada';
  observaciones?: string;
}

export interface SeguimientoMacros {
  clienteId: string;
  fecha: string;
  macrosObjetivo: MacrosNutricionales;
  macrosConsumidos: MacrosNutricionales;
  diferencia: MacrosNutricionales;
  porcentajeCumplimiento: number;
}

export interface AnalyticsNutricion {
  totalDietas: number;
  dietasActivas: number;
  adherenciaPromedio: number;
  clientesConDieta: number;
  planesMasUsados: PlanNutricional[];
  cumplimientoMacrosPromedio: number;
  tendenciaAdherencia: 'mejora' | 'estable' | 'empeora';
}

export type ObjetivoNutricional =
  | 'perdida-peso'
  | 'perdida-grasa'
  | 'ganancia-muscular'
  | 'mantenimiento'
  | 'rendimiento'
  | 'salud-general'
  | 'deficit-suave'
  | 'superavit-calorico';

export type CategoriaPlan =
  | 'perdida-grasa'
  | 'ganancia-muscular'
  | 'mantenimiento'
  | 'rendimiento'
  | 'salud-general';

export type TipoComida =
  | 'desayuno'
  | 'media-manana'
  | 'almuerzo'
  | 'merienda'
  | 'cena'
  | 'post-entreno';

export interface FiltrosDietas {
  clienteId?: string;
  tipo?: 'individual' | 'plan-estandar' | 'pack-semanal';
  objetivo?: ObjetivoNutricional;
  estado?: 'activa' | 'pausada' | 'finalizada';
  fechaInicio?: string;
  fechaFin?: string;
}

export interface DatosAsignacion {
  clienteId: string;
  tipo: 'individual' | 'plan-estandar' | 'pack-semanal';
  dietaId?: string;
  planId?: string;
  packId?: string;
  fechaInicio: string;
  fechaFin?: string;
  ajustarMacros?: boolean;
  macrosAjustados?: MacrosNutricionales;
  restricciones?: string[];
}

