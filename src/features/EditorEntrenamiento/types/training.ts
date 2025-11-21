export type ExerciseType = 'strength' | 'cardio' | 'mobility' | 'plyometric' | 'custom';

export interface Tag {
  id: string;
  label: string;
  color: string;
  category: 'muscle' | 'pattern' | 'equipment' | 'intensity' | 'other';
}

export interface Set {
  id: string;
  type: 'warmup' | 'working' | 'drop' | 'failure';
  reps?: number | string; // string for "AMRAP" or ranges "8-12"
  rpe?: number;
  weight?: number;
  percentage?: number; // % of 1RM
  rest?: number; // seconds
  notes?: string;
}

export interface Exercise {
  id: string;
  name: string;
  type: ExerciseType;
  sets: Set[];
  notes?: string;
  videoUrl?: string;
  tags: Tag[];
}

export interface Block {
  id: string;
  name: string; // e.g., "Activation", "Strength Block 1"
  type: 'warmup' | 'main' | 'cooldown' | 'conditioning';
  exercises: Exercise[];
  duration?: number; // minutes
  rpe?: number; // Average RPE
  notes?: string;
}

export interface Day {
  id: string;
  name: string; // e.g., "Upper Power"
  date?: string; // ISO Date
  blocks: Block[];
  tags: Tag[];
  totalDuration?: number;
  averageRpe?: number;
  notes?: string;
}

export interface Week {
  id: string;
  name: string; // e.g., "Semana 1"
  phase?: string; // e.g., "Acumulación"
  days: Day[];
  notes?: string;
}

export interface Program {
  id: string;
  name: string;
  author: string;
  clientName?: string;
  weeks: Week[];
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
}
