export type DaySession = {
  id: string;
  time: string;
  block: string;
  duration: string;
  modality: string;
  intensity: string;
  notes: string;
};

export type DayPlan = {
  microCycle: string;
  focus: string;
  volume: string;
  intensity: string;
  restorative: string;
  summary: string[];
  sessions: DaySession[];
  targetDuration?: number; // Objetivo de duración en minutos
  targetCalories?: number; // Objetivo de calorías
};


