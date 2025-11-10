/**
 * Tipos para el sistema de puntos y badges de hábitos
 */

export interface Habit {
  id: string;
  clienteId: string;
  nombre: string;
  descripcion?: string;
  tipo: 'rutina-semanal' | 'consistencia' | 'objetivo' | 'check-in';
  objetivo: number; // Meta a alcanzar (ej: 4 sesiones por semana)
  unidad: 'sesiones' | 'dias' | 'semanas' | 'check-ins';
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  clienteId: string;
  fecha: string;
  completado: boolean;
  puntos: number;
  notas?: string;
}

export interface HabitPoints {
  clienteId: string;
  puntosTotales: number;
  puntosSemanaActual: number;
  puntosMesActual: number;
  nivel: number; // Nivel del cliente basado en puntos
  proximoNivel: number; // Puntos necesarios para el siguiente nivel
  progresoNivel: number; // Porcentaje de progreso hacia el siguiente nivel (0-100)
  historial: Array<{
    fecha: string;
    puntos: number;
    motivo: string;
  }>;
}

export interface Badge {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string; // Nombre del icono de lucide-react
  color: string; // Color del badge
  categoria: 'consistencia' | 'logros' | 'hitos' | 'especial';
  requisitos: {
    tipo: 'puntos-totales' | 'semanas-consecutivas' | 'sesiones-completadas' | 'dias-consecutivos' | 'objetivo-alcanzado';
    valor: number;
  };
  rareza: 'comun' | 'raro' | 'epico' | 'legendario';
}

export interface ClientBadge {
  id: string;
  badgeId: string;
  clienteId: string;
  fechaObtenido: string;
  progreso?: number; // Progreso hacia el badge si aún no se ha obtenido (0-100)
}

export interface HabitStreak {
  clienteId: string;
  rachaActual: number; // Días/semanas consecutivas
  rachaMaxima: number; // Racha máxima histórica
  tipoRacha: 'diaria' | 'semanal';
  fechaInicioRacha: string;
  fechaFinRacha?: string;
}

export interface HabitPanelData {
  habitPoints: HabitPoints;
  badges: Array<ClientBadge & { badge: Badge }>;
  habitos: Habit[];
  completions: HabitCompletion[];
  streaks: HabitStreak[];
  estadisticas: {
    sesionesEstaSemana: number;
    sesionesObjetivoSemana: number;
    diasConsecutivos: number;
    semanasConsecutivas: number;
    mejorRacha: number;
  };
}

// Badges predefinidos
export const PREDEFINED_BADGES: Badge[] = [
  {
    id: 'badge-primera-sesion',
    nombre: 'Primeros Pasos',
    descripcion: 'Completa tu primera sesión',
    icono: 'Sparkles',
    color: 'blue',
    categoria: 'logros',
    requisitos: { tipo: 'sesiones-completadas', valor: 1 },
    rareza: 'comun',
  },
  {
    id: 'badge-semana-completa',
    nombre: 'Semana Completa',
    descripcion: 'Completa todas las sesiones de la semana',
    icono: 'Calendar',
    color: 'green',
    categoria: 'consistencia',
    requisitos: { tipo: 'sesiones-completadas', valor: 4 },
    rareza: 'comun',
  },
  {
    id: 'badge-7-dias',
    nombre: '7 Días de Fuerza',
    descripcion: '7 días consecutivos entrenando',
    icono: 'Flame',
    color: 'orange',
    categoria: 'hitos',
    requisitos: { tipo: 'dias-consecutivos', valor: 7 },
    rareza: 'raro',
  },
  {
    id: 'badge-30-dias',
    nombre: 'Maestro de la Constancia',
    descripcion: '30 días consecutivos entrenando',
    icono: 'Trophy',
    color: 'purple',
    categoria: 'hitos',
    requisitos: { tipo: 'dias-consecutivos', valor: 30 },
    rareza: 'epico',
  },
  {
    id: 'badge-4-semanas',
    nombre: 'Mes Completo',
    descripcion: '4 semanas consecutivas completando rutinas',
    icono: 'Award',
    color: 'gold',
    categoria: 'consistencia',
    requisitos: { tipo: 'semanas-consecutivas', valor: 4 },
    rareza: 'raro',
  },
  {
    id: 'badge-100-puntos',
    nombre: 'Centurión',
    descripcion: 'Alcanza 100 puntos',
    icono: 'Star',
    color: 'yellow',
    categoria: 'logros',
    requisitos: { tipo: 'puntos-totales', valor: 100 },
    rareza: 'comun',
  },
  {
    id: 'badge-500-puntos',
    nombre: 'Veterano',
    descripcion: 'Alcanza 500 puntos',
    icono: 'Medal',
    color: 'blue',
    categoria: 'logros',
    requisitos: { tipo: 'puntos-totales', valor: 500 },
    rareza: 'raro',
  },
  {
    id: 'badge-1000-puntos',
    nombre: 'Leyenda',
    descripcion: 'Alcanza 1000 puntos',
    icono: 'Crown',
    color: 'purple',
    categoria: 'logros',
    requisitos: { tipo: 'puntos-totales', valor: 1000 },
    rareza: 'legendario',
  },
  {
    id: 'badge-12-semanas',
    nombre: 'Transformación',
    descripcion: '12 semanas consecutivas de entrenamiento',
    icono: 'Zap',
    color: 'gold',
    categoria: 'hitos',
    requisitos: { tipo: 'semanas-consecutivas', valor: 12 },
    rareza: 'legendario',
  },
];

