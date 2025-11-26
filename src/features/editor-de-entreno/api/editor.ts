export interface Ejercicio {
  id: string;
  nombre: string;
  categoria: string;
  grupoMuscular: string[];
  descripcion?: string;
}

export interface Serie {
  id: string;
  repeticiones: number;
  peso?: number;
  descanso?: number; // en segundos
  rpe?: number; // Rate of Perceived Exertion (1-10)
  notas?: string;
}

export interface EjercicioEnSesion {
  id: string;
  ejercicio: Ejercicio;
  series: Serie[];
  orden: number;
}

export interface SesionEntrenamiento {
  id?: string;
  nombre: string;
  duracion?: number; // en minutos
  objetivo?: string;
  tipo: 'fuerza' | 'cardio' | 'hiit' | 'flexibilidad' | 'mixto';
  ejercicios: EjercicioEnSesion[];
  progresion?: ProgresionConfig;
  checkIns?: CheckInConfig;
  asignadoA?: string; // cliente ID o grupo ID
  asignadoTipo?: 'cliente' | 'grupo' | 'programa';
  plantilla?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProgresionConfig {
  habilitada: boolean;
  tipo: 'automatica' | 'manual';
  incrementoPeso?: number; // porcentaje
  incrementoRepeticiones?: number;
  incrementoRPE?: number;
  frecuencia?: 'semanal' | 'quincenal' | 'mensual';
}

export interface CheckInConfig {
  habilitado: boolean;
  tipos: ('energia' | 'dolor' | 'satisfaccion' | 'dificultad')[];
}

export async function getEditorData(): Promise<{ ejercicios: Ejercicio[] }> {
  const res = await fetch('/api/entrenamiento/editor');
  if (!res.ok) return { ejercicios: [] };
  return res.json();
}

export async function getEjercicios(): Promise<Ejercicio[]> {
  const res = await fetch('/api/entrenamiento/ejercicios');
  if (!res.ok) return [];
  return res.json();
}

