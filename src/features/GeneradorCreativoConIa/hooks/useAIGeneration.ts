import { useState, useCallback } from 'react';
import {
  generateContent,
  GenerationRequest,
  GenerationResponse
} from '../api/generator';

interface UseAIGenerationReturn {
  generate: (request: GenerationRequest) => Promise<GenerationResponse | null>;
  isLoading: boolean;
  error: Error | null;
  data: GenerationResponse | null;
}

/**
 * Hook personalizado que encapsula la lógica para interactuar
 * con el endpoint de generación de la API.
 */
export const useAIGeneration = (): UseAIGenerationReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<GenerationResponse | null>(null);

  const generate = useCallback(async (
    request: GenerationRequest
  ): Promise<GenerationResponse | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await generateContent(request);
      setData(response);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error al generar contenido');
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



















