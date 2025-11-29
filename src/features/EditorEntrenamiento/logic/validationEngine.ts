import { Program, Week, Day, Block, Exercise, Set, Tag } from '../types/training';

export type ValidationSeverity = 'critical' | 'warning' | 'suggestion';

export interface ValidationAlert {
  id: string;
  severity: ValidationSeverity;
  title: string;
  message: string;
  location?: {
    weekId?: string;
    dayId?: string;
    blockId?: string;
    exerciseId?: string;
  };
  actionLabel?: string;
  actionType?: string; // For automated fixes later
}

/**
 * Analyzes a program and returns a list of validation alerts based on business rules.
 */
export const validateProgram = (program: Program): ValidationAlert[] => {
  const alerts: ValidationAlert[] = [];

  program.weeks.forEach((week, weekIndex) => {
    // Rule 3 Context: Track weekly volume per muscle group
    const weeklyVolume: Record<string, number> = {};

    week.days.forEach((day, dayIndex) => {
      const dayLocation = { weekId: week.id, dayId: day.id };

      // Rule 1: Empty day without rest tag
      const hasBlocks = day.blocks && day.blocks.length > 0;
      const hasExercises = hasBlocks && day.blocks.some(b => b.exercises && b.exercises.length > 0);
      const isRestDay = day.tags && day.tags.some(t => t.label.toLowerCase().includes('descanso') || t.label.toLowerCase().includes('rest'));

      if (!hasExercises && !isRestDay) {
        alerts.push({
          id: `empty-day-${week.id}-${day.id}`,
          severity: 'warning',
          title: 'Día vacío sin etiqueta',
          message: `El ${day.name} (Semana ${weekIndex + 1}) no tiene ejercicios ni etiqueta de "Descanso".`,
          location: dayLocation,
          actionLabel: 'Marcar como Descanso',
          actionType: 'ADD_REST_TAG'
        });
      }

      if (hasBlocks) {
        day.blocks.forEach((block) => {
          if (block.exercises) {
            block.exercises.forEach((exercise) => {
              const exerciseLocation = { ...dayLocation, blockId: block.id, exerciseId: exercise.id };

              // Rule 2: RPE > 10
              if (exercise.sets) {
                exercise.sets.forEach((set, setIndex) => {
                  if (set.rpe && set.rpe > 10) {
                    alerts.push({
                      id: `rpe-high-${exercise.id}-${setIndex}`,
                      severity: 'critical',
                      title: 'RPE inválido detectado',
                      message: `En ${exercise.name} (Set ${setIndex + 1}), el RPE es ${set.rpe}. El máximo permitido es 10.`,
                      location: exerciseLocation,
                      actionLabel: 'Corregir a 10',
                      actionType: 'FIX_RPE_10'
                    });
                  }

                  // Rule 3 Data Gathering: Count sets for volume
                  // Only count "working" sets for volume usually, but prompts says "Weekly volume > 30 sets".
                  // Assuming all sets count or maybe just working sets. Let's count all for now or stick to working if specified.
                  // Usually warmup sets are excluded from "Volume" calculation in hypertrophy context.
                  // I'll exclude 'warmup' type sets for a more realistic check, but the prompt didn't strictly specify.
                  // Let's stick to counting valid working sets (working, drop, failure).
                  if (set.type !== 'warmup' && exercise.tags) {
                    exercise.tags.forEach(tag => {
                      if (tag.category === 'muscle') {
                        weeklyVolume[tag.label] = (weeklyVolume[tag.label] || 0) + 1;
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });

    // Rule 3 Check: Weekly volume > 30 sets per muscle group
    Object.entries(weeklyVolume).forEach(([muscle, sets]) => {
      if (sets > 30) {
        alerts.push({
          id: `vol-high-${week.id}-${muscle}`,
          severity: 'warning',
          title: 'Volumen semanal excesivo',
          message: `La Semana ${weekIndex + 1} tiene ${sets} series para ${muscle}. Se recomienda no exceder 30 series.`,
          location: { weekId: week.id },
          actionLabel: 'Revisar volumen',
          actionType: 'REVIEW_VOLUME'
        });
      }
    });
  });

  return alerts;
};
