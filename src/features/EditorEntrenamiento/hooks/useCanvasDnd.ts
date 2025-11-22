import { DragEndEvent } from '@dnd-kit/core';
import { Day, Block, Exercise, Set, Week } from '../types/training';
import { LibraryExercise, LibraryBlock, MOCK_EXERCISES } from '../../../data/libraryMocks';

// Helper to generate unique IDs
const generateId = () => crypto.randomUUID();

const createDefaultSet = (type: 'warmup' | 'working' = 'working'): Set => ({
  id: generateId(),
  type,
  reps: 10,
  rpe: 8,
  rest: 60,
});

const mapLibraryExerciseToExercise = (libEx: LibraryExercise): Exercise => ({
  id: generateId(),
  name: libEx.name,
  type: 'strength', // Defaulting to strength, could infer from muscleGroup/equipment
  sets: [createDefaultSet('working'), createDefaultSet('working'), createDefaultSet('working')],
  tags: [],
  videoUrl: libEx.videoUrl,
});

const mapLibraryBlockToBlock = (libBlock: LibraryBlock): Block => {
  // Since LibraryBlock mock doesn't have exercises, we simulate them
  const simulatedExercises: Exercise[] = [];
  for (let i = 0; i < libBlock.exerciseCount; i++) {
    // Pick a random exercise from MOCK_EXERCISES for demonstration
    const randomEx = MOCK_EXERCISES[Math.floor(Math.random() * MOCK_EXERCISES.length)];
    simulatedExercises.push(mapLibraryExerciseToExercise(randomEx));
  }

  let blockType: Block['type'] = 'main';
  if (libBlock.type === 'warmup') blockType = 'warmup';
  if (libBlock.type === 'conditioning') blockType = 'conditioning';
  // 'strength' maps to 'main' by default

  return {
    id: generateId(),
    name: libBlock.name,
    type: blockType,
    duration: libBlock.estimatedDuration,
    exercises: simulatedExercises,
  };
};

export const useCanvasDnd = (
  weeks: Week[],
  setWeeks: (weeks: Week[]) => void
) => {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (!activeData || !overData) return;

    // Check if we are dropping a Library Item (Exercise or Block)
    const isLibraryItem = activeData.itemType === 'exercise' || activeData.itemType === 'block';
    
    // Check if the drop target is a DayCard
    const isDroppingOnDay = overData.type === 'day';

    if (isLibraryItem && isDroppingOnDay) {
      const dayId = overData.dayId;
      
      // Find the week and day index
      let weekIndex = -1;
      let dayIndex = -1;

      weeks.forEach((w, wIdx) => {
          const dIdx = w.days.findIndex(d => d.id === dayId);
          if (dIdx !== -1) {
              weekIndex = wIdx;
              dayIndex = dIdx;
          }
      });

      if (weekIndex === -1 || dayIndex === -1) return;

      const newWeeks = [...weeks];
      const targetWeek = { ...newWeeks[weekIndex] };
      const newDays = [...targetWeek.days];
      const targetDay = { ...newDays[dayIndex] };
      const newBlocks = [...targetDay.blocks];

      if (activeData.itemType === 'block') {
        // 1. Drop a complete Block
        const libBlock = activeData as LibraryBlock;
        const newBlock = mapLibraryBlockToBlock(libBlock);
        newBlocks.push(newBlock);
      } else if (activeData.itemType === 'exercise') {
        // 2. Drop a single Exercise -> Wrap in a new Block
        const libEx = activeData as LibraryExercise;
        const newExercise = mapLibraryExerciseToExercise(libEx);
        
        const newBlock: Block = {
          id: generateId(),
          name: `Bloque de ${libEx.name}`,
          type: 'main', // Default type
          exercises: [newExercise],
          duration: 10, // Default duration estimate
        };
        newBlocks.push(newBlock);
      }

      // Update the day with new blocks and recalculate totals if needed
      targetDay.blocks = newBlocks;
      
      // Simple recalc of totalDuration (sum of block durations)
      targetDay.totalDuration = newBlocks.reduce((acc, b) => acc + (b.duration || 0), 0);

      newDays[dayIndex] = targetDay;
      targetWeek.days = newDays;
      newWeeks[weekIndex] = targetWeek;

      setWeeks(newWeeks);
    }
  };

  return { handleDragEnd };
};
