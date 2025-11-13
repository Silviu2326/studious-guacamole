/**
 * API para gestión de formación in-app (tutoriales y casos de uso)
 * User Story: Como manager quiero recibir formación in-app (tutoriales, casos de uso)
 */

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: 'basico' | 'avanzado' | 'casos-uso' | 'mejores-practicas';
  videoUrl?: string;
  content: string; // Contenido en markdown o HTML
  duration?: number; // Duración en minutos
  difficulty: 'principiante' | 'intermedio' | 'avanzado';
  tags: string[];
  completedBy?: string[]; // IDs de usuarios que completaron
  createdAt: string;
  updatedAt: string;
  order: number;
}

export interface UseCase {
  id: string;
  title: string;
  description: string;
  category: string;
  scenario: string; // Descripción del escenario
  solution: string; // Solución propuesta
  objectives: {
    id: string;
    title: string;
    description: string;
    metric: string;
    targetValue: number;
    unit: string;
  }[]; // Objetivos de ejemplo relacionados
  bestPractices: string[];
  lessonsLearned: string[];
  industry?: string; // Sector/industria
  companySize?: 'pequeña' | 'mediana' | 'grande';
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
}

export interface TrainingProgress {
  userId: string;
  tutorialId: string;
  completed: boolean;
  completedAt?: string;
  progress: number; // 0-100
  lastAccessedAt?: string;
}

// Simulación de datos - en producción vendría de una API real
const mockTutorials: Tutorial[] = [
  {
    id: '1',
    title: 'Introducción a Objetivos y Rendimiento',
    description: 'Aprende los conceptos básicos para crear y gestionar objetivos efectivos',
    category: 'basico',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    content: 'Este tutorial te enseñará...',
    duration: 10,
    difficulty: 'principiante',
    tags: ['objetivos', 'basico', 'introduccion'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    order: 1,
  },
  {
    id: '2',
    title: 'Cómo establecer objetivos SMART',
    description: 'Aprende a crear objetivos específicos, medibles, alcanzables, relevantes y con tiempo definido',
    category: 'mejores-practicas',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    content: 'Los objetivos SMART son...',
    duration: 15,
    difficulty: 'intermedio',
    tags: ['smart', 'objetivos', 'mejores-practicas'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    order: 2,
  },
  {
    id: '3',
    title: 'Análisis de rendimiento y métricas',
    description: 'Domina el análisis de métricas y la interpretación de datos de rendimiento',
    category: 'avanzado',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    content: 'El análisis de rendimiento...',
    duration: 20,
    difficulty: 'avanzado',
    tags: ['metricas', 'analisis', 'rendimiento'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    order: 3,
  },
];

const mockUseCases: UseCase[] = [
  {
    id: '1',
    title: 'Aumentar la retención de clientes en un 20%',
    description: 'Caso de éxito de un gimnasio que logró mejorar la retención mediante objetivos bien definidos',
    category: 'retencion',
    scenario: 'Un gimnasio con alta tasa de bajas necesita mejorar la retención de clientes...',
    solution: 'Se establecieron objetivos específicos de adherencia y seguimiento personalizado...',
    objectives: [
      {
        id: 'obj-1',
        title: 'Reducir tasa de bajas mensual',
        description: 'Reducir la tasa de bajas del 8% al 6% mensual',
        metric: 'Tasa de bajas',
        targetValue: 6,
        unit: '%',
      },
    ],
    bestPractices: [
      'Establecer check-ins regulares con clientes',
      'Monitorear métricas de adherencia semanalmente',
      'Crear alertas automáticas para clientes en riesgo',
    ],
    lessonsLearned: [
      'La comunicación proactiva es clave',
      'Los objetivos deben ser medibles y alcanzables',
    ],
    industry: 'fitness',
    companySize: 'mediana',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    views: 150,
    likes: 45,
  },
];

export const getTutorials = async (category?: Tutorial['category']): Promise<Tutorial[]> => {
  // Simulación de llamada API
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (category) {
    return mockTutorials.filter(t => t.category === category);
  }
  return mockTutorials;
};

export const getTutorial = async (id: string): Promise<Tutorial | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockTutorials.find(t => t.id === id) || null;
};

export const getUseCases = async (category?: string): Promise<UseCase[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (category) {
    return mockUseCases.filter(uc => uc.category === category);
  }
  return mockUseCases;
};

export const getUseCase = async (id: string): Promise<UseCase | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockUseCases.find(uc => uc.id === id) || null;
};

export const markTutorialAsCompleted = async (userId: string, tutorialId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  // En producción, esto actualizaría la base de datos
  console.log(`Tutorial ${tutorialId} marcado como completado por usuario ${userId}`);
};

export const getTrainingProgress = async (userId: string): Promise<TrainingProgress[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  // En producción, esto vendría de la base de datos
  return [];
};

