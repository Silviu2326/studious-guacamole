import { useMemo } from 'react';
import { useProgramContext } from '../context/ProgramContext';
import { validateProgram, ValidationAlert } from '../logic/validationEngine';
import { Program } from '../types/training';

export const useValidation = () => {
    const { weeks, globalTags } = useProgramContext();

    const alerts = useMemo(() => {
        // Construct a temporary Program object for validation
        // We only really need 'weeks' for the current validation logic, 
        // but we satisfy the type definition.
        const program: Program = {
            id: 'temp-validation-id',
            name: 'Temp Program',
            author: 'Temp Author',
            weeks: weeks,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            tags: globalTags
        };

        return validateProgram(program);
    }, [weeks, globalTags]);

    const getDayAlerts = (dayId: string): ValidationAlert[] => {
        return alerts.filter(alert => alert.location?.dayId === dayId && !alert.location?.blockId);
    };

    const getBlockAlerts = (blockId: string): ValidationAlert[] => {
        return alerts.filter(alert => alert.location?.blockId === blockId && !alert.location?.exerciseId);
    };

    const getExerciseAlerts = (exerciseId: string): ValidationAlert[] => {
        return alerts.filter(alert => alert.location?.exerciseId === exerciseId);
    };

    const hasAlerts = (id: string, type: 'day' | 'block' | 'exercise'): boolean => {
        if (type === 'day') return getDayAlerts(id).length > 0;
        if (type === 'block') return getBlockAlerts(id).length > 0;
        if (type === 'exercise') return getExerciseAlerts(id).length > 0;
        return false;
    };

    return {
        alerts,
        getDayAlerts,
        getBlockAlerts,
        getExerciseAlerts,
        hasAlerts
    };
};
