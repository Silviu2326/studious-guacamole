import { Day, Block, Exercise, Set, Tag, Week } from '../types/training';
import { MOCK_EXERCISES } from '../../../data/libraryMocks';

const generateId = () => crypto.randomUUID();

const createSet = (type: 'warmup' | 'working', reps: number, rpe: number): Set => ({
  id: generateId(),
  type,
  reps,
  rpe,
  rest: 60,
});

const findExercises = (criteria: (ex: any) => boolean, count: number) => {
  const matches = MOCK_EXERCISES.filter(criteria);
  const selected: any[] = [];
  for (let i = 0; i < count; i++) {
    if (matches.length > 0) {
      const index = Math.floor(Math.random() * matches.length);
      selected.push(matches[index]);
    } else {
        // Fallback to any
        selected.push(MOCK_EXERCISES[Math.floor(Math.random() * MOCK_EXERCISES.length)]);
    }
  }
  return selected;
};

const createBlock = (name: string, type: 'warmup' | 'main' | 'cooldown', exercises: any[], setsCount: number, reps: number, rpe: number): Block => {
    return {
        id: generateId(),
        name,
        type,
        duration: 15 * exercises.length,
        exercises: exercises.map(ex => ({
            id: generateId(),
            name: ex.name,
            type: 'strength',
            sets: Array(setsCount).fill(null).map(() => createSet('working', reps, rpe)),
            tags: [],
            videoUrl: ex.videoUrl
        }))
    };
};

export const generateAITemplateDays = (goal: string, dayCount: number): Day[] => {
    const days: Day[] = [];
    
    for (let i = 0; i < dayCount; i++) {
        const blocks: Block[] = [];
        let dayName = `Día ${i + 1}`;
        let tags: Tag[] = [];

        if (goal === 'hypertrophy') {
            dayName = `Hipertrofia - Día ${i + 1}`;
            tags.push({ id: 't-hyp', label: 'Hipertrofia', color: 'red', category: 'intensity' });
            
            // Warmup
            const warmups = findExercises(e => e.muscleGroup.includes('Full Body') || e.equipment === 'Bodyweight', 2);
            blocks.push(createBlock('Calentamiento General', 'warmup', warmups, 2, 15, 6));

            // Main
            const mainEx = findExercises(e => e.equipment === 'Barbell' || e.equipment === 'Dumbbell', 4);
            blocks.push(createBlock('Bloque Principal', 'main', mainEx, 4, 10, 8));

        } else if (goal === 'strength') {
             dayName = `Fuerza - Día ${i + 1}`;
             tags.push({ id: 't-str', label: 'Fuerza', color: 'blue', category: 'intensity' });

             // Warmup
             const warmups = findExercises(e => e.muscleGroup.includes('Full Body'), 2);
             blocks.push(createBlock('Activación', 'warmup', warmups, 2, 10, 5));

             // Main Compound
             const compounds = findExercises(e => e.equipment === 'Barbell', 2);
             blocks.push(createBlock('Levantamientos Principales', 'main', compounds, 5, 5, 9));

             // Accessories
             const accessories = findExercises(e => e.equipment === 'Dumbbell' || e.equipment === 'Machine', 3);
             blocks.push(createBlock('Accesorios', 'main', accessories, 3, 8, 8));

        } else if (goal === 'fat-loss') {
             dayName = `Metabólico - Día ${i + 1}`;
             tags.push({ id: 't-fat', label: 'Pérdida de Grasa', color: 'green', category: 'intensity' });

             // Circuit
             const circuitEx = findExercises(e => true, 6);
             blocks.push(createBlock('Circuito Metabólico', 'conditioning', circuitEx, 3, 15, 7));
        }

        days.push({
            id: generateId(),
            name: dayName,
            blocks,
            tags,
            totalDuration: blocks.reduce((acc, b) => acc + (b.duration || 0), 0)
        });
    }

    return days;
};

export const generateProgramVariation = (weeks: Week[], instruction: string): Week[] => {
    // Deep copy
    const newWeeks: Week[] = JSON.parse(JSON.stringify(weeks));
    const lowerInstruction = instruction.toLowerCase();

    // 1. Logic for "Mancuernas" (Dumbbells)
    if (lowerInstruction.includes('mancuerna') || lowerInstruction.includes('dumbbell')) {
        newWeeks.forEach(week => {
            week.days.forEach(day => {
                day.blocks.forEach(block => {
                    block.exercises.forEach(ex => {
                         // Simple heuristic replacements for demo
                         if (ex.name.toLowerCase().includes('barbell') || ex.name.toLowerCase().includes('barra')) {
                             ex.name = ex.name.replace(/Barbell/gi, 'Dumbbell').replace(/Barra/gi, 'Mancuernas');
                         }
                    });
                });
            });
        });
    }

    // 2. Logic for "Volumen" (Volume reduction)
    if (lowerInstruction.includes('reducir volumen') || lowerInstruction.includes('menos series')) {
         newWeeks.forEach(week => {
            week.days.forEach(day => {
                day.blocks.forEach(block => {
                    block.exercises.forEach(ex => {
                        if (ex.sets.length > 2) {
                            ex.sets = ex.sets.slice(0, Math.max(2, ex.sets.length - 1));
                        }
                    });
                });
            });
        });
    }
    
    // 3. Logic for "Cardio" (Add cardio)
    if (lowerInstruction.includes('cardio') || lowerInstruction.includes('aeróbico')) {
         newWeeks.forEach(week => {
            week.days.forEach(day => {
                // Add a cardio block at the end if not rest day
                if (day.blocks.length > 0) {
                    day.blocks.push({
                        id: crypto.randomUUID(),
                        name: 'Cardio Final',
                        type: 'conditioning',
                        duration: 20,
                        exercises: [
                            {
                                id: crypto.randomUUID(),
                                name: 'Cinta / Bicicleta',
                                type: 'cardio',
                                sets: [],
                                tags: [],
                                notes: '20 min zona 2'
                            }
                        ]
                    });
                    day.totalDuration = (day.totalDuration || 0) + 20;
                }
            });
        });
    }

    return newWeeks;
};
