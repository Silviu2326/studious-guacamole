import type { DayPlan, DaySession, GrupoMuscular, TipoEntrenamiento } from '../types';

export type TipoRiesgo = 
  | 'consecutive_muscle_group' 
  | 'high_volume_consecutive' 
  | 'missing_recovery' 
  | 'excessive_intensity'
  | 'imbalanced_volume';

export interface RiesgoDetectado {
  id: string;
  tipo: TipoRiesgo;
  severidad: 'alta' | 'media' | 'baja';
  titulo: string;
  descripcion: string;
  diasAfectados: string[];
  gruposMusculares?: GrupoMuscular[];
  recomendacion: string;
  planSugerido?: {
    tipo: 'movilidad' | 'descarga';
    nombre: string;
    sesiones: DaySession[];
  };
}

/**
 * Detecta riesgos en el plan semanal de entrenamiento
 */
export function detectarRiesgos(
  weeklyPlan: Record<string, DayPlan>,
  weekDays: readonly string[]
): RiesgoDetectado[] {
  const riesgos: RiesgoDetectado[] = [];

  // 1. Detectar días consecutivos con mismo grupo muscular
  for (let i = 0; i < weekDays.length - 1; i++) {
    const diaActual = weekDays[i];
    const diaSiguiente = weekDays[i + 1];
    
    const planActual = weeklyPlan[diaActual];
    const planSiguiente = weeklyPlan[diaSiguiente];
    
    if (!planActual || !planSiguiente) continue;

    // Obtener grupos musculares de cada día
    const gruposActuales = new Set<GrupoMuscular>();
    const gruposSiguientes = new Set<GrupoMuscular>();

    planActual.sessions.forEach(session => {
      if (session.gruposMusculares) {
        session.gruposMusculares.forEach(grupo => gruposActuales.add(grupo));
      }
    });

    planSiguiente.sessions.forEach(session => {
      if (session.gruposMusculares) {
        session.gruposMusculares.forEach(grupo => gruposSiguientes.add(grupo));
      }
    });

    // Detectar solapamiento de grupos musculares
    const gruposComunes = Array.from(gruposActuales).filter(g => gruposSiguientes.has(g));
    
    if (gruposComunes.length > 0) {
      // Filtrar grupos que no deberían ser problemáticos (cardio, movilidad, full-body ocasional)
      const gruposProblematicos = gruposComunes.filter(g => 
        g !== 'cardio' && g !== 'movilidad' && g !== 'full-body'
      );

      if (gruposProblematicos.length > 0) {
        riesgos.push({
          id: `consecutive-${diaActual}-${diaSiguiente}`,
          tipo: 'consecutive_muscle_group',
          severidad: gruposProblematicos.length >= 2 ? 'alta' : 'media',
          titulo: `Días consecutivos de ${gruposProblematicos.join(', ')}`,
          descripcion: `${diaActual} y ${diaSiguiente} tienen entrenamientos de ${gruposProblematicos.join(', ')}. Esto puede aumentar el riesgo de sobrecarga y lesiones.`,
          diasAfectados: [diaActual, diaSiguiente],
          gruposMusculares: gruposProblematicos,
          recomendacion: `Considera insertar un día de movilidad o descarga entre ${diaActual} y ${diaSiguiente}, o cambia el enfoque de uno de los días.`,
          planSugerido: generarPlanMovilidad(gruposProblematicos),
        });
      }
    }
  }

  // 2. Detectar alta intensidad en días consecutivos
  for (let i = 0; i < weekDays.length - 1; i++) {
    const diaActual = weekDays[i];
    const diaSiguiente = weekDays[i + 1];
    
    const planActual = weeklyPlan[diaActual];
    const planSiguiente = weeklyPlan[diaSiguiente];
    
    if (!planActual || !planSiguiente) continue;

    const tieneAltaIntensidad = (plan: DayPlan) => {
      return plan.sessions.some(s => {
        const intensity = s.intensity?.toLowerCase() || '';
        return intensity.includes('alta') || 
               intensity.includes('rpe 8') || 
               intensity.includes('rpe 9') ||
               intensity.includes('rpe 10') ||
               intensity.includes('máxima');
      });
    };

    if (tieneAltaIntensidad(planActual) && tieneAltaIntensidad(planSiguiente)) {
      riesgos.push({
        id: `high-intensity-${diaActual}-${diaSiguiente}`,
        tipo: 'high_volume_consecutive',
        severidad: 'alta',
        titulo: 'Alta intensidad en días consecutivos',
        descripcion: `${diaActual} y ${diaSiguiente} tienen sesiones de alta intensidad. Esto puede llevar a fatiga acumulada y sobreentrenamiento.`,
        diasAfectados: [diaActual, diaSiguiente],
        recomendacion: 'Inserta un día de descarga activa o movilidad entre estos días para permitir la recuperación adecuada.',
        planSugerido: generarPlanDescarga(),
      });
    }
  }

  // 3. Detectar falta de días de recuperación
  let diasConEntrenamiento = 0;
  let diasConRecuperacion = 0;

  weekDays.forEach(day => {
    const plan = weeklyPlan[day];
    if (!plan || plan.sessions.length === 0) return;

    diasConEntrenamiento++;
    
    const tieneRecuperacion = plan.sessions.some(s => {
      const modality = s.modality?.toLowerCase() || '';
      const tipo = s.tipoEntrenamiento?.toLowerCase() || '';
      return modality.includes('recovery') || 
             modality.includes('mobility') || 
             tipo === 'recuperacion' ||
             tipo === 'movilidad' ||
             s.intensity?.toLowerCase().includes('ligera');
    });

    if (tieneRecuperacion) {
      diasConRecuperacion++;
    }
  });

  if (diasConEntrenamiento >= 5 && diasConRecuperacion < 2) {
    riesgos.push({
      id: 'missing-recovery',
      tipo: 'missing_recovery',
      severidad: 'media',
      titulo: 'Falta de días de recuperación',
      descripcion: `Tienes ${diasConEntrenamiento} días de entrenamiento pero solo ${diasConRecuperacion} día(s) de recuperación. La recuperación es esencial para prevenir lesiones y optimizar el rendimiento.`,
      diasAfectados: weekDays.filter(day => {
        const plan = weeklyPlan[day];
        return plan && plan.sessions.length > 0;
      }),
      recomendacion: 'Considera agregar más sesiones de movilidad, estiramientos o descarga activa a lo largo de la semana.',
      planSugerido: generarPlanMovilidad(),
    });
  }

  // 4. Detectar volumen excesivo en un solo día
  weekDays.forEach(day => {
    const plan = weeklyPlan[day];
    if (!plan || plan.sessions.length === 0) return;

    const totalDuration = plan.sessions.reduce((total, session) => {
      const match = session.duration.match(/\d+/);
      return total + (match ? parseInt(match[0]) : 0);
    }, 0);

    if (totalDuration > 120) { // Más de 2 horas
      riesgos.push({
        id: `excessive-volume-${day}`,
        tipo: 'excessive_intensity',
        severidad: 'media',
        titulo: `Volumen excesivo en ${day}`,
        descripcion: `${day} tiene más de 2 horas de entrenamiento (${totalDuration} min). Esto puede ser contraproducente y aumentar el riesgo de lesiones.`,
        diasAfectados: [day],
        recomendacion: 'Considera dividir el entrenamiento en dos sesiones o reducir el volumen total del día.',
      });
    }
  });

  return riesgos;
}

/**
 * Genera un plan de movilidad sugerido para grupos musculares específicos
 */
export function generarPlanMovilidad(gruposMusculares?: GrupoMuscular[]): RiesgoDetectado['planSugerido'] {
  const sesiones: DaySession[] = [];

  if (gruposMusculares?.includes('piernas')) {
    sesiones.push({
      id: `mobility-legs-${Date.now()}`,
      time: '10:00',
      block: 'Movilidad de cadera y piernas',
      duration: '15 min',
      modality: 'Mobility',
      intensity: 'Ligera',
      tipoEntrenamiento: 'movilidad',
      gruposMusculares: ['piernas', 'movilidad'],
      notes: 'Estiramientos dinámicos de cadera, cuádriceps, isquiotibiales y gemelos. Foam roller en piernas.',
      tags: ['movilidad', 'recuperacion', 'piernas'],
    });
  }

  if (gruposMusculares?.includes('espalda') || gruposMusculares?.includes('pecho')) {
    sesiones.push({
      id: `mobility-upper-${Date.now()}`,
      time: '10:00',
      block: 'Movilidad de tren superior',
      duration: '15 min',
      modality: 'Mobility',
      intensity: 'Ligera',
      tipoEntrenamiento: 'movilidad',
      gruposMusculares: ['espalda', 'pecho', 'hombros', 'movilidad'],
      notes: 'Movilidad torácica, estiramientos de pecho y espalda. Band pull aparts y rotaciones de hombro.',
      tags: ['movilidad', 'recuperacion', 'tren-superior'],
    });
  }

  if (sesiones.length === 0 || !gruposMusculares || gruposMusculares.length === 0) {
    // Plan general de movilidad
    sesiones.push({
      id: `mobility-general-${Date.now()}`,
      time: '10:00',
      block: 'Movilidad general',
      duration: '20 min',
      modality: 'Mobility',
      intensity: 'Ligera',
      tipoEntrenamiento: 'movilidad',
      gruposMusculares: ['movilidad'],
      notes: 'Rutina completa de movilidad: calentamiento articular, estiramientos dinámicos y foam rolling.',
      tags: ['movilidad', 'recuperacion'],
    });
  }

  return {
    tipo: 'movilidad',
    nombre: gruposMusculares && gruposMusculares.length > 0
      ? `Movilidad para ${gruposMusculares.join(', ')}`
      : 'Plan de movilidad general',
    sesiones,
  };
}

/**
 * Genera un plan de descarga activa
 */
export function generarPlanDescarga(): RiesgoDetectado['planSugerido'] {
  return {
    tipo: 'descarga',
    nombre: 'Día de descarga activa',
    sesiones: [
      {
        id: `unload-cardio-${Date.now()}`,
        time: '10:00',
        block: 'Cardio ligero',
        duration: '20 min',
        modality: 'Cardio',
        intensity: 'Ligera',
        tipoEntrenamiento: 'cardio',
        gruposMusculares: ['cardio'],
        notes: 'Caminata rápida, bici estática o elíptica a ritmo conversacional (RPE 3-4).',
        tags: ['descarga', 'cardio', 'recuperacion'],
      },
      {
        id: `unload-mobility-${Date.now()}`,
        time: '18:00',
        block: 'Movilidad y estiramientos',
        duration: '15 min',
        modality: 'Mobility',
        intensity: 'Ligera',
        tipoEntrenamiento: 'movilidad',
        gruposMusculares: ['movilidad'],
        notes: 'Estiramientos estáticos mantenidos 30-60 segundos. Yoga suave o movilidad articular.',
        tags: ['descarga', 'movilidad', 'recuperacion'],
      },
    ],
  };
}

