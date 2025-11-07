export interface PlantillaDieta {
  id: string;
  nombre: string;
  descripcion?: string;
  categoria: CategoriaNutricional;
  objetivo: ObjetivoNutricional;
  calorias: number;
  macros: {
    proteinas: number;
    carbohidratos: number;
    grasas: number;
  };
  comidas: ComidaPlantilla[];
  horarios: HorarioComida[];
  version: string;
  versionesAnteriores?: VersionPlantilla[];
  creadoPor: string;
  creadoEn: Date;
  actualizadoEn: Date;
  publicada: boolean;
  usoCount: number;
  efectividad?: {
    tasaExito: number;
    satisfaccionPromedio: number;
    seguimientoPromedio: number;
  };
  tags?: string[];
}

export interface ComidaPlantilla {
  id: string;
  nombre: string;
  tipo: TipoComida;
  alimentos: AlimentoComida[];
  horario?: string;
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
  notas?: string;
}

export interface AlimentoComida {
  id: string;
  alimentoId: string;
  nombre: string;
  cantidad: number;
  unidad: string;
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
}

export interface HorarioComida {
  id: string;
  comidaId: string;
  hora: string;
  dias: number[];
  notas?: string;
}

export interface VersionPlantilla {
  id: string;
  version: string;
  fechaCreacion: Date;
  cambios: string;
  creadoPor: string;
}

export type CategoriaNutricional =
  | 'vegetariana'
  | 'vegana'
  | 'keto'
  | 'paleo'
  | 'mediterranea'
  | 'baja-carbohidratos'
  | 'alta-proteina'
  | 'balanceada'
  | 'personalizada';

export type ObjetivoNutricional =
  | 'perdida-peso'
  | 'ganancia-muscular'
  | 'mantenimiento'
  | 'rendimiento'
  | 'salud-general'
  | 'deficit-suave'
  | 'superavit-calorico';

export type TipoComida =
  | 'desayuno'
  | 'media-manana'
  | 'almuerzo'
  | 'merienda'
  | 'cena'
  | 'post-entreno';

export interface FiltrosPlantillas {
  categoria?: CategoriaNutricional;
  objetivo?: ObjetivoNutricional;
  caloriasMin?: number;
  caloriasMax?: number;
  texto?: string;
  publicadas?: boolean;
  tags?: string[];
}

export interface EstadisticasPlantillas {
  totalPlantillas: number;
  plantillasPublicadas: number;
  plantillasPrivadas: number;
  usoTotal: number;
  plantillaMasUsada: PlantillaDieta | null;
  categoriaMasPopular: CategoriaNutricional | null;
  efectividadPromedio: number;
}

export interface DatosDuplicacion {
  nombreNueva: string;
  personalizarMacros: boolean;
  macrosAjustados?: {
    calorias?: number;
    proteinas?: number;
    carbohidratos?: number;
    grasas?: number;
  };
  mantenerHorarios: boolean;
}

