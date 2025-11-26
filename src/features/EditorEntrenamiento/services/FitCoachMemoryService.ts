
export interface FitCoachMemory {
    id: string;
    type: 'action' | 'preference' | 'pattern';
    content: string;
    timestamp: number;
    metadata?: any;
}

const STORAGE_KEY = 'fitcoach_memories';

export const FitCoachMemoryService = {
    getMemories: (): FitCoachMemory[] => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Error reading FitCoach memories:', e);
            return [];
        }
    },

    saveMemory: (content: string, type: FitCoachMemory['type'] = 'action', metadata?: any) => {
        try {
            const memories = FitCoachMemoryService.getMemories();
            const newMemory: FitCoachMemory = {
                id: crypto.randomUUID(),
                type,
                content,
                timestamp: Date.now(),
                metadata
            };

            // Keep only last 50 memories to avoid bloat
            const updatedMemories = [newMemory, ...memories].slice(0, 50);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMemories));
            return newMemory;
        } catch (e) {
            console.error('Error saving FitCoach memory:', e);
            return null;
        }
    },

    clearMemories: () => {
        localStorage.removeItem(STORAGE_KEY);
    },

    // Helper to analyze memories for patterns
    analyzePatterns: () => {
        const memories = FitCoachMemoryService.getMemories();
        const patterns: string[] = [];

        // Example analysis: Count duplicate actions
        const duplicateActions = memories.filter(m => m.content.includes('Duplicó la Semana'));
        if (duplicateActions.length > 2) {
            patterns.push('Frecuentemente duplica semanas');
        }

        // Analysis: Day reuse preference
        const copyPasteActions = memories.filter(m => m.metadata?.type === 'copy_day' || m.metadata?.type === 'paste_day');
        if (copyPasteActions.length > 3) {
            patterns.push('Prefiere reutilizar días existentes');
        }

        // Example analysis: Frequent exercises
        const addedExercises = memories.filter(m => m.metadata?.type === 'add_exercise');
        const exerciseCounts: Record<string, number> = {};
        addedExercises.forEach(m => {
            if (m.metadata?.exerciseName) {
                exerciseCounts[m.metadata.exerciseName] = (exerciseCounts[m.metadata.exerciseName] || 0) + 1;
            }
        });

        Object.entries(exerciseCounts).forEach(([name, count]) => {
            if (count >= 3) {
                patterns.push(`Usa frecuentemente: ${name}`);
            }
        });

        // Analysis: Detailed designer
        if (addedExercises.length > 5) {
            patterns.push('Diseña sesiones detalladas ejercicio por ejercicio');
        }

        return patterns;
    }
};
