import { useState, useCallback } from 'react';
import { useProgramContext } from '../context/ProgramContext';
import { Day, Block, Exercise, Set } from '../types/training';

export type BatchActionType = 
  | 'duplicate_week'
  | 'linear_progression'
  | 'apply_template'
  | 'mass_adjustment'
  | 'reorganize_days'
  | null;

export interface BatchConfig {
  weekRange: {
    start: number;
    end: number;
  };
  increments: {
    sets: number;
    reps: number;
    loadPercentage: number;
    rpe: number;
  };
  filters: {
    applyToAll: boolean;
    tags: string[];
  };
  safetyLimits: {
    maxSets: number;
    maxReps: number;
    alertVolumeIncrease: boolean; // e.g. > 10%
  };
}

export const useBatchTraining = (initialStep = 1) => {
  const { weeks, setProgramData } = useProgramContext();
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [selectedAction, setSelectedAction] = useState<BatchActionType>(null);
  
  // Default configuration based on the design doc
  const [config, setConfig] = useState<BatchConfig>({
    weekRange: { start: 1, end: 4 },
    increments: {
      sets: 0,
      reps: 0,
      loadPercentage: 0, // e.g. 0.025 for 2.5%
      rpe: 0,
    },
    filters: {
      applyToAll: true,
      tags: [],
    },
    safetyLimits: {
      maxSets: 5,
      maxReps: 15,
      alertVolumeIncrease: true,
    },
  });

  const nextStep = useCallback(() => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const selectAction = useCallback((action: BatchActionType) => {
    setSelectedAction(action);
  }, []);

  const updateConfig = useCallback((updates: Partial<BatchConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  // Helper to generate new IDs deeply
  const deepCloneDay = (day: Day): Day => {
    return {
      ...day,
      id: crypto.randomUUID(),
      blocks: day.blocks.map(block => ({
        ...block,
        id: crypto.randomUUID(),
        exercises: block.exercises.map(exercise => ({
          ...exercise,
          id: crypto.randomUUID(),
          sets: exercise.sets.map(set => ({
            ...set,
            id: crypto.randomUUID()
          }))
        }))
      }))
    };
  };

  const duplicateWeek = useCallback(async () => {
    console.log('Duplicating Week with config:', config);
    
    const startWeekIndex = config.weekRange.start - 1;
    const endWeekIndex = config.weekRange.end - 1;
    
    // Validate range
    if (startWeekIndex < 0 || startWeekIndex >= weeks.length) {
        console.error("Invalid start week");
        return;
    }

    const sourceWeek = weeks[startWeekIndex];
    const newWeeks = [...weeks];
    
    // Iterate over target weeks (from start + 1 to end)
    for (let w = startWeekIndex + 1; w <= endWeekIndex; w++) {
        // If target week doesn't exist, we should probably stop or handle it.
        // Assuming for now we only modify existing weeks as per UI selection
        if (w >= newWeeks.length) continue;

        const clonedDays = sourceWeek.days.map(day => {
             // Deep clone day
             const cloned = deepCloneDay(day);
             // Note: We might want to preserve the target day name if it's different, but usually it's consistent (Monday->Monday)
             return cloned;
        });

        newWeeks[w] = {
            ...newWeeks[w],
            days: clonedDays
        };
    }
    
    setProgramData(newWeeks);
    return Promise.resolve(true);

  }, [config, weeks, setProgramData]);

  const applyLinearProgression = useCallback(async () => {
    console.log('Applying Linear Progression with config:', config);
    
    const startWeekIndex = config.weekRange.start - 1;
    const endWeekIndex = config.weekRange.end - 1;
    
    const newWeeks = weeks.map((week, index) => {
        // Check if week is in range
        if (index < startWeekIndex || index > endWeekIndex) {
            return week;
        }
        
        // Calculate progression multiplier (0 for first week, 1 for second, etc.)
        const multiplier = index - startWeekIndex;
        if (multiplier <= 0) return week; // No change for the base week

        const newDays = week.days.map(day => {
            const newBlocks = day.blocks.map(block => {
                const newExercises = block.exercises.map(exercise => {
                    // Check filters
                    if (!config.filters.applyToAll) {
                        const hasTag = exercise.tags.some(t => config.filters.tags.includes(t.id));
                        if (!hasTag) return exercise;
                    }

                    // Apply increments
                    let newSets = [...exercise.sets];
                    
                    // 1. Sets Increment
                    if (config.increments.sets > 0) {
                        const setsToAdd = Math.round(config.increments.sets * multiplier);
                        if (setsToAdd > 0 && newSets.length > 0) {
                            const lastSet = newSets[newSets.length - 1];
                            for (let i = 0; i < setsToAdd; i++) {
                                 // Respect Max Sets Safety Limit
                                 if (newSets.length >= config.safetyLimits.maxSets) break;
                                 newSets.push({ ...lastSet, id: crypto.randomUUID() });
                            }
                        }
                    }

                    // Update existing sets properties
                    newSets = newSets.map(set => {
                       let updatedSet = { ...set };
                       
                       // 2. Reps Increment
                       if (config.increments.reps > 0 && typeof set.reps === 'number') {
                           const newReps = set.reps + (config.increments.reps * multiplier);
                           updatedSet.reps = Math.min(newReps, config.safetyLimits.maxReps);
                       }

                       // 3. RPE Increment
                       if (config.increments.rpe > 0 && typeof set.rpe === 'number') {
                           updatedSet.rpe = Math.min(10, set.rpe + (config.increments.rpe * multiplier));
                       }

                       // 4. Load Increment
                       if (config.increments.loadPercentage > 0 && typeof set.weight === 'number') {
                           // e.g. weight * (1 + (0.02 * 2)) = weight * 1.04
                           const factor = 1 + (config.increments.loadPercentage * multiplier);
                           updatedSet.weight = Math.round(set.weight * factor * 10) / 10; // Round to 1 decimal
                       }

                       return updatedSet;
                    });

                    return { ...exercise, sets: newSets };
                });
                return { ...block, exercises: newExercises };
            });
            return { ...day, blocks: newBlocks };
        });

        return { ...week, days: newDays };
    });

    setProgramData(newWeeks);
    return Promise.resolve(true);
  }, [config, weeks, setProgramData]);

  const applyTemplate = useCallback(async () => {
    console.log('Applying Template with config:', config);
     // TODO: Implement actual logic
    return Promise.resolve(true);
  }, [config]);

  const massAdjustment = useCallback(async () => {
    console.log('Applying Mass Adjustment with config:', config);
    
    const startWeekIndex = config.weekRange.start - 1;
    const endWeekIndex = config.weekRange.end - 1;
    
    const newWeeks = weeks.map((week, index) => {
        // Check if week is in range
        if (index < startWeekIndex || index > endWeekIndex) {
            return week;
        }
        
        // For mass adjustment, we apply the change equally to all weeks in range
        // unlike progression which scales with time.
        
        const newDays = week.days.map(day => {
            const newBlocks = day.blocks.map(block => {
                const newExercises = block.exercises.map(exercise => {
                    // Check filters
                    if (!config.filters.applyToAll) {
                        const hasTag = exercise.tags.some(t => config.filters.tags.includes(t.id));
                        if (!hasTag) return exercise;
                    }

                    // Apply adjustments
                    let newSets = [...exercise.sets];
                    
                    // 1. Sets Adjustment (+/- sets)
                    if (config.increments.sets !== 0) {
                        const setsToAdd = config.increments.sets;
                        if (setsToAdd > 0) {
                            const lastSet = newSets[newSets.length - 1];
                            for (let i = 0; i < setsToAdd; i++) {
                                 if (newSets.length >= config.safetyLimits.maxSets) break;
                                 newSets.push({ ...lastSet, id: crypto.randomUUID() });
                            }
                        } else if (setsToAdd < 0) {
                            // Remove sets
                            const setsToRemove = Math.abs(setsToAdd);
                            newSets = newSets.slice(0, Math.max(1, newSets.length - setsToRemove));
                        }
                    }

                    // Update existing sets properties
                    newSets = newSets.map(set => {
                       let updatedSet = { ...set };
                       
                       // 2. Reps Adjustment
                       if (config.increments.reps !== 0 && typeof set.reps === 'number') {
                           const newReps = set.reps + config.increments.reps;
                           updatedSet.reps = Math.max(1, Math.min(newReps, config.safetyLimits.maxReps));
                       }

                       // 3. RPE Adjustment
                       if (config.increments.rpe !== 0 && typeof set.rpe === 'number') {
                           updatedSet.rpe = Math.max(1, Math.min(10, set.rpe + config.increments.rpe));
                       }

                       // 4. Load Adjustment
                       if (config.increments.loadPercentage !== 0 && typeof set.weight === 'number') {
                           const factor = 1 + config.increments.loadPercentage;
                           updatedSet.weight = Math.round(set.weight * factor * 10) / 10; 
                       }

                       return updatedSet;
                    });

                    return { ...exercise, sets: newSets };
                });
                return { ...block, exercises: newExercises };
            });
            return { ...day, blocks: newBlocks };
        });

        return { ...week, days: newDays };
    });

    setProgramData(newWeeks);
    return Promise.resolve(true);
  }, [config, weeks, setProgramData]);

  const reorganizeDays = useCallback(async () => {
    console.log('Reorganizing Days with config:', config);
     // TODO: Implement actual logic
    return Promise.resolve(true);
  }, [config]);


  const applyChanges = useCallback(async () => {
    if (!selectedAction) return;

    switch (selectedAction) {
      case 'linear_progression':
        await applyLinearProgression();
        break;
      case 'duplicate_week':
        await duplicateWeek();
        break;
      case 'apply_template':
        await applyTemplate();
        break;
      case 'mass_adjustment':
        await massAdjustment();
        break;
      case 'reorganize_days':
        await reorganizeDays();
        break;
    }
  }, [selectedAction, applyLinearProgression, duplicateWeek, applyTemplate, massAdjustment, reorganizeDays]);

  const reset = useCallback(() => {
    setCurrentStep(1);
    setSelectedAction(null);
    // We might want to reset config to defaults here as well
    setConfig({
        weekRange: { start: 1, end: 4 },
        increments: { sets: 0, reps: 0, loadPercentage: 0, rpe: 0 },
        filters: { applyToAll: true, tags: [] },
        safetyLimits: { maxSets: 5, maxReps: 15, alertVolumeIncrease: true },
    });
  }, []);

  return {
    currentStep,
    selectedAction,
    config,
    nextStep,
    prevStep,
    selectAction,
    updateConfig,
    applyChanges,
    reset,
  };
};
