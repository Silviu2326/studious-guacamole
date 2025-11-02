export interface Template {
  id: string;
  name: string;
  description?: string;
  durationWeeks: number;
  tags: string[];
  assignmentCount?: number;
  createdAt?: string;
  updatedAt?: string;
  structure?: TemplateStructure;
}

export interface TemplateStructure {
  phases: Phase[];
}

export interface Phase {
  name: string;
  weeks: Week[];
}

export interface Week {
  weekNumber: number;
  days: Day[];
}

export interface Day {
  dayNumber: number;
  name?: string;
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  restSeconds?: number;
  weight?: string;
  tempo?: string;
  notes?: string;
  videoUrl?: string;
  order: number;
}

export interface TemplateFilters {
  searchQuery?: string;
  tags?: string[];
  durationWeeks?: number;
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TemplatesResponse {
  data: Template[];
  pagination: PaginationMeta;
}

