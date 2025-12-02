// Tipos para la funcionalidad de Biblioteca de Ejercicios

export interface Ejercicio {
  id: string;
  nombre: string;
  descripcion: string;
  videoUrl: string;
  imagenUrl?: string;
  instrucciones: string[];
  advertencias: string[];
  grupoMuscular: GrupoMuscular[];
  equipamiento: Equipamiento[];
  dificultad: Dificultad;
  duracion?: number; // en minutos
  calorias?: number;
  contraindicaciones: string[];
  variaciones?: string[];
  tags: string[];
  fechaCreacion: Date;
  fechaActualizacion: Date;
  activo: boolean;
}

export interface GrupoMuscular {
  id: string;
  nombre: string;
  descripcion: string;
  color: string;
}

export interface Equipamiento {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: CategoriaEquipamiento;
}

export enum CategoriaEquipamiento {
  PESO_LIBRE = 'peso_libre',
  MAQUINA = 'maquina',
  CARDIO = 'cardio',
  FUNCIONAL = 'funcional',
  SIN_EQUIPAMIENTO = 'sin_equipamiento'
}

export enum Dificultad {
  PRINCIPIANTE = 'principiante',
  INTERMEDIO = 'intermedio',
  AVANZADO = 'avanzado',
  EXPERTO = 'experto'
}

export interface FiltrosEjercicio {
  busqueda?: string;
  gruposMusculares?: string[];
  equipamiento?: string[];
  dificultad?: Dificultad[];
  duracionMin?: number;
  duracionMax?: number;
  soloFavoritos?: boolean;
}

export interface EjercicioFavorito {
  id: string;
  ejercicioId: string;
  usuarioId: string;
  fechaAgregado: Date;
}

export interface ResultadoBusqueda {
  ejercicios: Ejercicio[];
  total: number;
  pagina: number;
  totalPaginas: number;
}

export interface EstadisticasEjercicio {
  ejercicioId: string;
  vecesUsado: number;
  ultimoUso: Date;
  promedioCalificacion: number;
  totalCalificaciones: number;
}

export interface ProgramaEjercicio {
  id: string;
  ejercicioId: string;
  series: number;
  repeticiones: number;
  peso?: number;
  descanso: number; // en segundos
  notas?: string;
  orden: number;
}

// Estados de la aplicación
export interface BibliotecaState {
  ejercicios: Ejercicio[];
  ejercicioSeleccionado: Ejercicio | null;
  favoritos: string[];
  filtros: FiltrosEjercicio;
  cargando: boolean;
  error: string | null;
  gruposMusculares: GrupoMuscular[];
  equipamientos: Equipamiento[];
}

// Props para componentes
export interface BibliotecaEjerciciosProps {
  modo?: 'seleccion' | 'visualizacion';
  onSeleccionarEjercicio?: (ejercicio: Ejercicio) => void;
  ejerciciosSeleccionados?: string[];
  mostrarFavoritos?: boolean;
}

export interface VisorEjercicioProps {
  ejercicio: Ejercicio;
  onCerrar: () => void;
  onAgregarFavorito?: (ejercicioId: string) => void;
  onRemoverFavorito?: (ejercicioId: string) => void;
  esFavorito?: boolean;
  onAgregarAPrograma?: (ejercicio: Ejercicio) => void;
}

export interface FiltrosEjercicioProps {
  filtros: FiltrosEjercicio;
  onCambiarFiltros: (filtros: FiltrosEjercicio) => void;
  gruposMusculares: GrupoMuscular[];
  equipamientos: Equipamiento[];
}