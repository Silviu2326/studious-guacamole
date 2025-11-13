// User Story 2: Utilidades para colores e iconos dinámicos según tipo de entrenamiento y grupo muscular
import {
  Dumbbell,
  Heart,
  Zap,
  Wind,
  Activity,
  Sparkles,
  RotateCcw,
  Timer,
  Target,
  User,
  type LucideIcon,
} from 'lucide-react';
import type { TipoEntrenamiento, GrupoMuscular } from '../types';

// Mapeo de tipos de entrenamiento a colores
export const getTipoEntrenamientoColor = (tipo?: TipoEntrenamiento): string => {
  switch (tipo) {
    case 'fuerza':
      return 'bg-blue-500 border-blue-600 text-blue-900';
    case 'cardio':
      return 'bg-red-500 border-red-600 text-red-900';
    case 'hiit':
      return 'bg-orange-500 border-orange-600 text-orange-900';
    case 'flexibilidad':
      return 'bg-purple-500 border-purple-600 text-purple-900';
    case 'mixto':
      return 'bg-indigo-500 border-indigo-600 text-indigo-900';
    case 'recuperacion':
      return 'bg-green-500 border-green-600 text-green-900';
    case 'resistencia':
      return 'bg-yellow-500 border-yellow-600 text-yellow-900';
    case 'movilidad':
      return 'bg-teal-500 border-teal-600 text-teal-900';
    default:
      return 'bg-gray-500 border-gray-600 text-gray-900';
  }
};

// Mapeo de tipos de entrenamiento a iconos
export const getTipoEntrenamientoIcon = (tipo?: TipoEntrenamiento): LucideIcon => {
  switch (tipo) {
    case 'fuerza':
      return Dumbbell;
    case 'cardio':
      return Heart;
    case 'hiit':
      return Zap;
    case 'flexibilidad':
      return Wind;
    case 'mixto':
      return Activity;
    case 'recuperacion':
      return RotateCcw;
    case 'resistencia':
      return Timer;
    case 'movilidad':
      return Target;
    default:
      return Activity;
  }
};

// Mapeo de grupos musculares a colores (más suaves que los de tipo)
export const getGrupoMuscularColor = (grupo?: GrupoMuscular): string => {
  switch (grupo) {
    case 'pecho':
      return 'bg-pink-100 border-pink-300 text-pink-800';
    case 'espalda':
      return 'bg-amber-100 border-amber-300 text-amber-800';
    case 'hombros':
      return 'bg-cyan-100 border-cyan-300 text-cyan-800';
    case 'brazos':
      return 'bg-lime-100 border-lime-300 text-lime-800';
    case 'piernas':
      return 'bg-violet-100 border-violet-300 text-violet-800';
    case 'gluteos':
      return 'bg-rose-100 border-rose-300 text-rose-800';
    case 'core':
      return 'bg-emerald-100 border-emerald-300 text-emerald-800';
    case 'full-body':
      return 'bg-slate-100 border-slate-300 text-slate-800';
    case 'cardio':
      return 'bg-red-100 border-red-300 text-red-800';
    case 'movilidad':
      return 'bg-sky-100 border-sky-300 text-sky-800';
    default:
      return 'bg-gray-100 border-gray-300 text-gray-800';
  }
};

// Mapeo de grupos musculares a iconos
export const getGrupoMuscularIcon = (grupo?: GrupoMuscular): LucideIcon => {
  switch (grupo) {
    case 'pecho':
      return User;
    case 'espalda':
      return Target;
    case 'hombros':
      return Target;
    case 'brazos':
      return Dumbbell;
    case 'piernas':
      return Activity;
    case 'gluteos':
      return Activity;
    case 'core':
      return Target;
    case 'full-body':
      return Activity;
    case 'cardio':
      return Heart;
    case 'movilidad':
      return Wind;
    default:
      return Target;
  }
};

// Función para obtener el color dominante basado en tipo de entrenamiento
export const getSessionColorClass = (tipo?: TipoEntrenamiento): string => {
  switch (tipo) {
    case 'fuerza':
      return 'border-l-4 border-l-blue-500 bg-blue-50';
    case 'cardio':
      return 'border-l-4 border-l-red-500 bg-red-50';
    case 'hiit':
      return 'border-l-4 border-l-orange-500 bg-orange-50';
    case 'flexibilidad':
      return 'border-l-4 border-l-purple-500 bg-purple-50';
    case 'mixto':
      return 'border-l-4 border-l-indigo-500 bg-indigo-50';
    case 'recuperacion':
      return 'border-l-4 border-l-green-500 bg-green-50';
    case 'resistencia':
      return 'border-l-4 border-l-yellow-500 bg-yellow-50';
    case 'movilidad':
      return 'border-l-4 border-l-teal-500 bg-teal-50';
    default:
      return 'border-l-4 border-l-gray-500 bg-gray-50';
  }
};

// Función para analizar distribución de estímulos y detectar excesos/carencias
export interface AnalisisEstimulos {
  porTipo: Record<TipoEntrenamiento, number>;
  porGrupoMuscular: Record<GrupoMuscular, number>;
  excesos: Array<{
    tipo: 'tipoEntrenamiento' | 'grupoMuscular';
    valor: string;
    cantidad: number;
    porcentaje: number;
    severidad: 'alta' | 'media' | 'baja';
  }>;
  carencias: Array<{
    tipo: 'tipoEntrenamiento' | 'grupoMuscular';
    valor: string;
    cantidad: number;
    porcentaje: number;
    severidad: 'alta' | 'media' | 'baja';
  }>;
}

export const analizarDistribucionEstimulos = (
  sesiones: Array<{ tipoEntrenamiento?: TipoEntrenamiento; gruposMusculares?: GrupoMuscular[] }>
): AnalisisEstimulos => {
  const porTipo: Record<TipoEntrenamiento, number> = {
    fuerza: 0,
    cardio: 0,
    hiit: 0,
    flexibilidad: 0,
    mixto: 0,
    recuperacion: 0,
    resistencia: 0,
    movilidad: 0,
  };

  const porGrupoMuscular: Record<GrupoMuscular, number> = {
    pecho: 0,
    espalda: 0,
    hombros: 0,
    brazos: 0,
    piernas: 0,
    gluteos: 0,
    core: 0,
    'full-body': 0,
    cardio: 0,
    movilidad: 0,
  };

  sesiones.forEach((sesion) => {
    if (sesion.tipoEntrenamiento) {
      porTipo[sesion.tipoEntrenamiento] = (porTipo[sesion.tipoEntrenamiento] || 0) + 1;
    }
    sesion.gruposMusculares?.forEach((grupo) => {
      porGrupoMuscular[grupo] = (porGrupoMuscular[grupo] || 0) + 1;
    });
  });

  const totalSesiones = sesiones.length;
  const totalPorTipo = Object.values(porTipo).reduce((sum, val) => sum + val, 0);
  const totalPorGrupo = Object.values(porGrupoMuscular).reduce((sum, val) => sum + val, 0);

  const excesos: AnalisisEstimulos['excesos'] = [];
  const carencias: AnalisisEstimulos['carencias'] = [];

  // Analizar tipos de entrenamiento
  Object.entries(porTipo).forEach(([tipo, cantidad]) => {
    if (totalPorTipo > 0) {
      const porcentaje = (cantidad / totalPorTipo) * 100;
      // Considerar exceso si > 40% y más de 3 sesiones
      if (porcentaje > 40 && cantidad > 3) {
        excesos.push({
          tipo: 'tipoEntrenamiento',
          valor: tipo,
          cantidad,
          porcentaje,
          severidad: porcentaje > 60 ? 'alta' : porcentaje > 50 ? 'media' : 'baja',
        });
      }
      // Considerar carencia si < 10% y hay otras sesiones
      if (porcentaje < 10 && totalSesiones > 3 && cantidad === 0) {
        carencias.push({
          tipo: 'tipoEntrenamiento',
          valor: tipo,
          cantidad,
          porcentaje,
          severidad: 'alta',
        });
      }
    }
  });

  // Analizar grupos musculares
  Object.entries(porGrupoMuscular).forEach(([grupo, cantidad]) => {
    if (totalPorGrupo > 0) {
      const porcentaje = (cantidad / totalPorGrupo) * 100;
      // Considerar exceso si > 30% y más de 2 sesiones
      if (porcentaje > 30 && cantidad > 2) {
        excesos.push({
          tipo: 'grupoMuscular',
          valor: grupo,
          cantidad,
          porcentaje,
          severidad: porcentaje > 50 ? 'alta' : porcentaje > 40 ? 'media' : 'baja',
        });
      }
      // Considerar carencia si < 5% y hay otras sesiones
      if (porcentaje < 5 && totalSesiones > 3 && cantidad === 0) {
        carencias.push({
          tipo: 'grupoMuscular',
          valor: grupo,
          cantidad,
          porcentaje,
          severidad: 'alta',
        });
      }
    }
  });

  return {
    porTipo,
    porGrupoMuscular,
    excesos,
    carencias,
  };
};

