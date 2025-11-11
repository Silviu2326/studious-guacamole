import { useState, useCallback } from 'react';
import {
  generateStrategy,
  StrategyInputData,
  MarketingStrategy
} from '../api/strategies';

interface UseAIStrategyGenerationReturn {
  generate: (input: StrategyInputData) => Promise<MarketingStrategy | null>;
  isLoading: boolean;
  error: Error | null;
  data: MarketingStrategy | null;
}

/**
 * Hook personalizado que encapsula la lógica para interactuar
 * con la API de generación de estrategias.
 */
export const useAIStrategyGeneration = (): UseAIStrategyGenerationReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<MarketingStrategy | null>(null);

  const generate = useCallback(async (
    input: StrategyInputData
  ): Promise<MarketingStrategy | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const strategy = await generateStrategy(input);
      setData(strategy);
      return strategy;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error al generar estrategia');
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

















