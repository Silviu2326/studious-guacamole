// API para gestión de contenido clippeado

export interface ClippedContent {
  id: string;
  userId: string;
  title: string;
  originalUrl: string;
  thumbnailUrl?: string;
  scrapedDescription?: string;
  personalNotes?: string;
  categoryId?: string;
  category?: {
    id: string;
    name: string;
  };
  tags: Tag[];
  contentType?: 'article' | 'video' | 'image' | 'other';
  source?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  userId?: string;
  isShared?: boolean;
  color?: string;
}

export interface ClippedContentResponse {
  data: ClippedContent[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

export interface ScrapedMetadata {
  title: string;
  description: string;
  imageUrl: string;
}

// Funciones API simuladas (a implementar con backend real)
export const createClip = async (
  url: string,
  categoryId?: string
): Promise<ClippedContent> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Simulación de scraping de metadatos
  const newClip: ClippedContent = {
    id: `clip_${Date.now()}`,
    userId: 'user_abcde',
    title: 'Contenido capturado',
    originalUrl: url,
    thumbnailUrl: 'https://via.placeholder.com/400x300',
    scrapedDescription: 'Descripción extraída automáticamente del contenido.',
    personalNotes: null,
    categoryId: categoryId,
    tags: [],
    contentType: 'article',
    source: new URL(url).hostname,
    createdAt: new Date().toISOString()
  };
  
  return newClip;
};

export const getClips = async (
  filters?: {
    q?: string;
    categoryId?: string;
    tagIds?: string[];
    page?: number;
  }
): Promise<ClippedContentResponse> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Datos de ejemplo
  const mockClips: ClippedContent[] = [
    {
      id: 'clip_12345',
      userId: 'user_abcde',
      title: 'Los 5 mejores ejercicios para un core de acero',
      originalUrl: 'https://www.fitproblog.com/core-exercises',
      thumbnailUrl: 'https://via.placeholder.com/400x300',
      scrapedDescription: 'Descubre los ejercicios que realmente fortalecen tu abdomen y mejoran tu postura.',
      personalNotes: 'Excelente para un post sobre entrenamiento funcional',
      categoryId: 'cat_1',
      category: {
        id: 'cat_1',
        name: 'Ejercicios'
      },
      tags: [
        { id: 'tag_1', name: 'core' },
        { id: 'tag_2', name: 'abs' }
      ],
      contentType: 'article',
      source: 'fitproblog.com',
      createdAt: '2023-10-27T10:00:00Z',
      updatedAt: '2023-10-27T10:00:00Z'
    },
    {
      id: 'clip_67890',
      userId: 'user_abcde',
      title: 'Estudio sobre beneficios del sueño en recuperación muscular',
      originalUrl: 'https://www.ncbi.nlm.nih.gov/sleep-study',
      thumbnailUrl: 'https://via.placeholder.com/400x300',
      scrapedDescription: 'Investigación sobre la importancia del descanso para la hipertrofia.',
      personalNotes: null,
      categoryId: 'cat_2',
      category: {
        id: 'cat_2',
        name: 'Ciencia'
      },
      tags: [
        { id: 'tag_3', name: 'recuperacion' },
        { id: 'tag_4', name: 'sueño' }
      ],
      contentType: 'article',
      source: 'ncbi.nlm.nih.gov',
      createdAt: '2023-10-26T15:30:00Z'
    }
  ];
  
  // Aplicar filtros simples
  let filteredClips = [...mockClips];
  
  if (filters?.q) {
    const searchTerm = filters.q.toLowerCase();
    filteredClips = filteredClips.filter(clip =>
      clip.title.toLowerCase().includes(searchTerm) ||
      clip.scrapedDescription?.toLowerCase().includes(searchTerm) ||
      clip.personalNotes?.toLowerCase().includes(searchTerm)
    );
  }
  
  if (filters?.categoryId) {
    filteredClips = filteredClips.filter(clip => clip.categoryId === filters.categoryId);
  }
  
  if (filters?.tagIds && filters.tagIds.length > 0) {
    filteredClips = filteredClips.filter(clip =>
      clip.tags.some(tag => filters.tagIds?.includes(tag.id))
    );
  }
  
  return {
    data: filteredClips,
    pagination: {
      currentPage: filters?.page || 1,
      totalPages: 1,
      totalItems: filteredClips.length
    }
  };
};

export const updateClip = async (
  clipId: string,
  updates: {
    title?: string;
    personalNotes?: string;
    categoryId?: string;
    tagIds?: string[];
  }
): Promise<ClippedContent> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: PUT /api/content/clips/{clipId}
  const updatedClip: ClippedContent = {
    id: clipId,
    userId: 'user_abcde',
    title: updates.title || 'Contenido actualizado',
    originalUrl: 'https://example.com',
    scrapedDescription: 'Descripción actualizada',
    personalNotes: updates.personalNotes,
    categoryId: updates.categoryId,
    tags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  return updatedClip;
};

export const deleteClip = async (clipId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: DELETE /api/content/clips/{clipId}
  console.log('Eliminando clip:', clipId);
};

export const getCategories = async (): Promise<Category[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return [
    { id: 'cat_1', name: 'Ejercicios', color: '#3B82F6' },
    { id: 'cat_2', name: 'Ciencia', color: '#10B981' },
    { id: 'cat_3', name: 'Nutrición', color: '#F59E0B' },
    { id: 'cat_4', name: 'Marketing', color: '#8B5CF6' },
    { id: 'cat_5', name: 'Mindset', color: '#EC4899' }
  ];
};

export const createCategory = async (name: string, color?: string): Promise<Category> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    id: `cat_${Date.now()}`,
    name,
    color: color || '#6B7280'
  };
};

export const getTags = async (): Promise<Tag[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return [
    { id: 'tag_1', name: 'core' },
    { id: 'tag_2', name: 'abs' },
    { id: 'tag_3', name: 'recuperacion' },
    { id: 'tag_4', name: 'sueño' },
    { id: 'tag_5', name: 'vegano' },
    { id: 'tag_6', name: 'keto' },
    { id: 'tag_7', name: 'postparto' }
  ];
};

export const createTag = async (name: string): Promise<Tag> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return {
    id: `tag_${Date.now()}`,
    name
  };
};


