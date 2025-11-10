import { useState, useEffect, useCallback } from 'react';
import {
  ClippedContent,
  getClips,
  createClip as createClipAPI,
  updateClip as updateClipAPI,
  deleteClip as deleteClipAPI,
  ClippedContentResponse
} from '../api/clips';

interface UseContentLibraryParams {
  initialFilters?: {
    category?: string;
    tags?: string[];
    search?: string;
  };
}

interface UseContentLibraryReturn {
  clips: ClippedContent[];
  isLoading: boolean;
  error: Error | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
  addClip: (url: string, categoryId?: string) => Promise<ClippedContent>;
  updateClip: (clipId: string, updates: Partial<ClippedContent>) => Promise<void>;
  removeClip: (clipId: string) => Promise<void>;
  refreshClips: () => void;
  setFilters: (filters: { category?: string; tags?: string[]; search?: string }) => void;
}

/**
 * Hook personalizado que encapsula toda la lógica de comunicación con la API
 * para el contenido guardado. Maneja estados de carga, errores y los datos en sí.
 */
export const useContentLibrary = ({
  initialFilters = {}
}: UseContentLibraryParams = {}): UseContentLibraryReturn => {
  const [clips, setClips] = useState<ClippedContent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  const [filters, setFiltersState] = useState(initialFilters);

  const fetchClips = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response: ClippedContentResponse = await getClips({
        q: filters.search,
        categoryId: filters.category,
        tagIds: filters.tags,
        page: pagination.currentPage
      });
      
      setClips(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al cargar contenido'));
    } finally {
      setIsLoading(false);
    }
  }, [filters, pagination.currentPage]);

  useEffect(() => {
    fetchClips();
  }, [fetchClips]);

  const addClip = async (url: string, categoryId?: string): Promise<ClippedContent> => {
    try {
      const newClip = await createClipAPI(url, categoryId);
      await fetchClips(); // Refrescar la lista
      return newClip;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Error al crear clip');
    }
  };

  const updateClip = async (
    clipId: string,
    updates: Partial<ClippedContent>
  ): Promise<void> => {
    try {
      await updateClipAPI(clipId, {
        title: updates.title,
        personalNotes: updates.personalNotes,
        categoryId: updates.categoryId,
        tagIds: updates.tags?.map(tag => tag.id)
      });
      await fetchClips(); // Refrescar la lista
    } catch (err) {
      throw err instanceof Error ? err : new Error('Error al actualizar clip');
    }
  };

  const removeClip = async (clipId: string): Promise<void> => {
    try {
      await deleteClipAPI(clipId);
      await fetchClips(); // Refrescar la lista
    } catch (err) {
      throw err instanceof Error ? err : new Error('Error al eliminar clip');
    }
  };

  const setFilters = (newFilters: { category?: string; tags?: string[]; search?: string }) => {
    setFiltersState(newFilters);
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset a página 1
  };

  return {
    clips,
    isLoading,
    error,
    pagination,
    addClip,
    updateClip,
    removeClip,
    refreshClips: fetchClips,
    setFilters
  };
};














