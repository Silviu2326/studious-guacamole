import { useState, useCallback } from 'react';

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
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [selectedAction, setSelectedAction] = useState<BatchActionType>(null);
  
  // Default configuration based on the design doc
  const [config, setConfig] = useState<BatchConfig>({
    weekRange: { start: 1, end: 4 },
    increments: {
      sets: 0,
      reps: 0,
      loadPercentage: 0,
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

  // Placeholder logic functions
  const applyLinearProgression = useCallback(async () => {
    console.log('Applying Linear Progression with config:', config);
    // TODO: Implement actual logic
    return Promise.resolve(true);
  }, [config]);

  const duplicateWeek = useCallback(async () => {
    console.log('Duplicating Week with config:', config);
     // TODO: Implement actual logic
    return Promise.resolve(true);
  }, [config]);

  const applyTemplate = useCallback(async () => {
    console.log('Applying Template with config:', config);
     // TODO: Implement actual logic
    return Promise.resolve(true);
  }, [config]);

  const massAdjustment = useCallback(async () => {
    console.log('Applying Mass Adjustment with config:', config);
     // TODO: Implement actual logic
    return Promise.resolve(true);
  }, [config]);

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
