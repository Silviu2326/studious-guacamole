import type {
  ContentLearning,
  LearningCategory,
  LearningFilter,
  SaveLearningRequest,
  ContentFormat,
  TrainerNiche,
} from '../types';

// Mock storage - en producción vendría del backend
let learnings: ContentLearning[] = [];

/**
 * Guarda un nuevo aprendizaje
 */
export const saveLearning = async (request: SaveLearningRequest): Promise<ContentLearning> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const now = new Date().toISOString();
  const trainerId = 'trn_current'; // En producción vendría del contexto de autenticación

  const learning: ContentLearning = {
    id: `learning_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    trainerId,
    ...request,
    createdAt: now,
    updatedAt: now,
  };

  learnings.push(learning);

  return learning;
};

/**
 * Obtiene todos los aprendizajes con filtros opcionales
 */
export const getLearnings = async (filter?: LearningFilter): Promise<ContentLearning[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  let filtered = [...learnings];

  if (filter) {
    if (filter.category) {
      filtered = filtered.filter((l) => l.category === filter.category);
    }
    if (filter.format) {
      filtered = filtered.filter((l) => l.format === filter.format);
    }
    if (filter.niche) {
      filtered = filtered.filter((l) => l.niche === filter.niche);
    }
    if (filter.tags && filter.tags.length > 0) {
      filtered = filtered.filter((l) =>
        filter.tags!.some((tag) => l.tags.includes(tag))
      );
    }
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filtered = filtered.filter(
        (l) =>
          l.title.toLowerCase().includes(searchLower) ||
          l.description.toLowerCase().includes(searchLower) ||
          l.insights.some((i) => i.toLowerCase().includes(searchLower)) ||
          l.tags.some((t) => t.toLowerCase().includes(searchLower))
      );
    }
  }

  // Ordenar por fecha de actualización (más recientes primero)
  return filtered.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
};

/**
 * Obtiene un aprendizaje específico por ID
 */
export const getLearningById = async (id: string): Promise<ContentLearning | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return learnings.find((l) => l.id === id) || null;
};

/**
 * Actualiza un aprendizaje existente
 */
export const updateLearning = async (
  id: string,
  updates: Partial<SaveLearningRequest>
): Promise<ContentLearning> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const index = learnings.findIndex((l) => l.id === id);
  if (index === -1) {
    throw new Error('Learning not found');
  }

  learnings[index] = {
    ...learnings[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  return learnings[index];
};

/**
 * Elimina un aprendizaje
 */
export const deleteLearning = async (id: string): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const index = learnings.findIndex((l) => l.id === id);
  if (index === -1) {
    return false;
  }

  learnings.splice(index, 1);
  return true;
};

/**
 * Obtiene aprendizajes agrupados por formato
 */
export const getLearningsByFormat = async (): Promise<Record<ContentFormat, ContentLearning[]>> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const byFormat: Record<string, ContentLearning[]> = {};

  learnings
    .filter((l) => l.category === 'formato' && l.format)
    .forEach((learning) => {
      if (learning.format) {
        if (!byFormat[learning.format]) {
          byFormat[learning.format] = [];
        }
        byFormat[learning.format].push(learning);
      }
    });

  return byFormat as Record<ContentFormat, ContentLearning[]>;
};

/**
 * Obtiene aprendizajes agrupados por nicho
 */
export const getLearningsByNiche = async (): Promise<Record<TrainerNiche, ContentLearning[]>> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const byNiche: Record<string, ContentLearning[]> = {};

  learnings
    .filter((l) => l.category === 'niche' && l.niche)
    .forEach((learning) => {
      if (learning.niche) {
        if (!byNiche[learning.niche]) {
          byNiche[learning.niche] = [];
        }
        byNiche[learning.niche].push(learning);
      }
    });

  return byNiche as Record<TrainerNiche, ContentLearning[]>;
};

/**
 * Obtiene estadísticas de aprendizajes
 */
export const getLearningStats = async (): Promise<{
  total: number;
  byCategory: Record<LearningCategory, number>;
  byFormat: Record<ContentFormat, number>;
  byNiche: Record<TrainerNiche, number>;
  byPriority: Record<'high' | 'medium' | 'low', number>;
}> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const stats = {
    total: learnings.length,
    byCategory: {
      formato: 0,
      niche: 0,
      general: 0,
    } as Record<LearningCategory, number>,
    byFormat: {} as Record<ContentFormat, number>,
    byNiche: {} as Record<TrainerNiche, number>,
    byPriority: {
      high: 0,
      medium: 0,
      low: 0,
    } as Record<'high' | 'medium' | 'low', number>,
  };

  learnings.forEach((learning) => {
    // Por categoría
    stats.byCategory[learning.category]++;

    // Por formato
    if (learning.format) {
      stats.byFormat[learning.format] = (stats.byFormat[learning.format] || 0) + 1;
    }

    // Por nicho
    if (learning.niche) {
      stats.byNiche[learning.niche] = (stats.byNiche[learning.niche] || 0) + 1;
    }

    // Por prioridad
    stats.byPriority[learning.priority]++;
  });

  return stats;
};

/**
 * Obtiene aprendizajes relevantes para generar contenido
 * (usado por la IA para considerar en futuras ideas)
 */
export const getRelevantLearnings = async (
  format?: ContentFormat,
  niche?: TrainerNiche
): Promise<ContentLearning[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  let relevant = learnings.filter((l) => l.priority === 'high' || l.priority === 'medium');

  if (format) {
    relevant = relevant.filter(
      (l) => l.category === 'formato' && l.format === format
    );
  }

  if (niche) {
    relevant = relevant.filter(
      (l) => l.category === 'niche' && l.niche === niche
    );
  }

  // También incluir aprendizajes generales de alta prioridad
  const generalHighPriority = learnings.filter(
    (l) => l.category === 'general' && l.priority === 'high'
  );

  return [...relevant, ...generalHighPriority].slice(0, 10); // Limitar a 10 más relevantes
};

