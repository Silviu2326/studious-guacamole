import { useState, useCallback } from 'react';
import {
  generateContentIdeas,
  GenerationRequest,
  GenerationResponse
} from '../api/contentIdeas';

interface UseContentGeneratorAPIReturn {
  generate: (request: GenerationRequest) => Promise<GenerationResponse | null>;
  isLoading: boolean;
  error: Error | null;
  data: GenerationResponse | null;
}

/**
 * Hook personalizado para abstraer la comunicación con el backend.
 * Maneja los estados de carga, error y datos para la generación de contenido.
 */
export const useContentGeneratorAPI = (): UseContentGeneratorAPIReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<GenerationResponse | null>(null);

  const generate = useCallback(async (
    request: GenerationRequest
  ): Promise<GenerationResponse | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await generateContentIdeas(request);
      setData(response);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error al generar ideas');
      setError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    generate,
    isLoading,
    error,
    data
  };
};
















