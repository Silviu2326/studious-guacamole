export interface LibraryBlock {
  id: string;
  name: string;
  type: 'warmup' | 'strength' | 'conditioning';
  exerciseCount: number;
  estimatedDuration: number; // minutos
}

export interface LibraryExercise {
  id: string;
  name: string;
  muscleGroup: string[]; // ['Chest', 'Triceps']
  equipment: string;     // 'Barbell'
  videoUrl?: string;
  isFavorite: boolean;
}

export const MOCK_EXERCISES: LibraryExercise[] = [
  { id: '1', name: 'Bench Press', muscleGroup: ['Chest', 'Triceps', 'Shoulders'], equipment: 'Barbell', isFavorite: true },
  { id: '2', name: 'Squat', muscleGroup: ['Legs', 'Core'], equipment: 'Barbell', isFavorite: true },
  { id: '3', name: 'Deadlift', muscleGroup: ['Back', 'Legs', 'Core'], equipment: 'Barbell', isFavorite: true },
  { id: '4', name: 'Overhead Press', muscleGroup: ['Shoulders', 'Triceps'], equipment: 'Barbell', isFavorite: false },
  { id: '5', name: 'Pull Up', muscleGroup: ['Back', 'Biceps'], equipment: 'Bodyweight', isFavorite: true },
  { id: '6', name: 'Dumbbell Row', muscleGroup: ['Back', 'Biceps'], equipment: 'Dumbbell', isFavorite: false },
  { id: '7', name: 'Lunge', muscleGroup: ['Legs'], equipment: 'Dumbbell', isFavorite: false },
  { id: '8', name: 'Plank', muscleGroup: ['Core'], equipment: 'Bodyweight', isFavorite: true },
  { id: '9', name: 'Push Up', muscleGroup: ['Chest', 'Triceps'], equipment: 'Bodyweight', isFavorite: false },
  { id: '10', name: 'Leg Press', muscleGroup: ['Legs'], equipment: 'Machine', isFavorite: false },
  { id: '11', name: 'Lat Pulldown', muscleGroup: ['Back', 'Biceps'], equipment: 'Cable', isFavorite: false },
  { id: '12', name: 'Face Pull', muscleGroup: ['Shoulders', 'Back'], equipment: 'Cable', isFavorite: true },
  { id: '13', name: 'Tricep Extension', muscleGroup: ['Triceps'], equipment: 'Cable', isFavorite: false },
  { id: '14', name: 'Bicep Curl', muscleGroup: ['Biceps'], equipment: 'Dumbbell', isFavorite: false },
  { id: '15', name: 'Romanian Deadlift', muscleGroup: ['Legs', 'Back'], equipment: 'Barbell', isFavorite: true },
];

export const MOCK_BLOCKS: LibraryBlock[] = [
  { id: 'b1', name: 'Warmup General', type: 'warmup', exerciseCount: 3, estimatedDuration: 10 },
  { id: 'b2', name: 'Upper Body Power', type: 'strength', exerciseCount: 4, estimatedDuration: 45 },
  { id: 'b3', name: 'Leg Day Finisher', type: 'conditioning', exerciseCount: 2, estimatedDuration: 15 },
  { id: 'b4', name: 'Core Blaster', type: 'conditioning', exerciseCount: 5, estimatedDuration: 20 },
  { id: 'b5', name: 'Mobility Routine', type: 'warmup', exerciseCount: 6, estimatedDuration: 15 },
];
