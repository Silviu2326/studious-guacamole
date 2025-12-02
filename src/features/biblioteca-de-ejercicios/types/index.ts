export type GrupoMuscular = 
  | 'pecho' 
  | 'espalda' 
  | 'hombros' 
  | 'brazos' 
  | 'piernas' 
  | 'gluteos' 
  | 'core' 
  | 'cardio' 
  | 'full-body';

export type Equipamiento = 
  | 'ninguno' 
  | 'pesas' 
  | 'mancuernas' 
  | 'barra' 
  | 'máquina' 
  | 'cables' 
  | 'bandas' 
  | 'balón' 
  | 'kettlebell';

export type Dificultad = 'principiante' | 'intermedio' | 'avanzado';

export type TipoLesion = 
  | 'rodilla' 
  | 'espalda' 
  | 'hombro' 
  | 'muñeca' 
  | 'cuello' 
  | 'tobillo' 
  | 'cadera';

export interface Ejercicio {
  id: string;
  nombre: string;
  descripcion: string;
  grupoMuscular: GrupoMuscular[];
  equipamiento: Equipamiento[];
  dificultad: Dificultad;
  videoUrl?: string;
  imagenUrl?: string;
  instrucciones: string[];
  musculosSecundarios?: string[];
  advertencias?: AdvertenciaLesion[];
  variaciones?: string[];
  seriesRecomendadas?: string;
  repeticionesRecomendadas?: string;
  descansoRecomendado?: string;
  rpeRecomendado?: number;
  tags?: string[];
  fechaCreacion: string;
  fechaActualizacion?: string;
  creadoPor?: string;
  esFavorito?: boolean;
  vecesUsado?: number;
}

export interface AdvertenciaLesion {
  tipoLesion: TipoLesion;
  severidad: 'precaucion' | 'evitar' | 'consulta-profesional';
  descripcion: string;
  alternativas?: string[]; // IDs de ejercicios alternativos
}

export interface Categoria {
  id: string;
  nombre: string;
  grupoMuscular?: GrupoMuscular;
  icono?: string;
  descripcion?: string;
  cantidadEjercicios?: number;
}

export interface FiltrosEjercicios {
  busqueda?: string;
  gruposMusculares?: GrupoMuscular[];
  equipamiento?: Equipamiento[];
  dificultad?: Dificultad[];
  excluirLesiones?: TipoLesion[];
  soloFavoritos?: boolean;
  ordenarPor?: 'nombre' | 'popularidad' | 'fecha' | 'grupo';
  orden?: 'asc' | 'desc';
}

export interface EjercicioFavorito {
  id: string;
  ejercicioId: string;
  usuarioId: string;
  fechaAgregado: string;
  notas?: string;
}

export interface EstadisticasEjercicio {
  vecesUsado: number;
  enProgramas: number;
  enPlantillas: number;
  promedioSatisfaccion?: number;
  ultimaVezUsado?: string;
}

export interface IntegracionPrograma {
  programaId: string;
  programaNombre: string;
  sesionId?: string;
  sesionNombre?: string;
  fechaAsignacion: string;
  fechaEjecucion?: string;
}

