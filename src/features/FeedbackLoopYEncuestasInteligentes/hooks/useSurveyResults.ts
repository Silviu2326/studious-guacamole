import { useState, useEffect, useCallback } from 'react';
import { SurveyResults, getSurveyResults } from '../api/surveys';

interface UseSurveyResultsReturn {
  results: SurveyResults | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
}

/**
 * Hook personalizado para abstraer la lógica de fetching y procesamiento
 * de los datos de resultados de una encuesta específica.
 */
export const useSurveyResults = (surveyId: string): UseSurveyResultsReturn => {
  const [results, setResults] = useState<SurveyResults | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchResults = useCallback(async () => {
    if (!surveyId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getSurveyResults(surveyId);
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al cargar resultados'));
    } finally {
      setIsLoading(false);
    }
  }, [surveyId]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  return {
    results,
    isLoading,
    error,
    refresh: fetchResults
  };
};











