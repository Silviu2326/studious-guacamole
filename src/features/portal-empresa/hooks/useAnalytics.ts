import { useState, useCallback } from 'react';
import { AnalyticsData, DateRange } from '../types';
import { portalEmpresaService } from '../api/portalEmpresaService';

interface UseAnalyticsReturn {
  analytics: AnalyticsData | null;
  isLoading: boolean;
  error: string | null;
  dateRange: DateRange;
  loadAnalytics: (range: DateRange) => Promise<void>;
  setDateRange: (range: DateRange) => void;
  clearError: () => void;
}

export const useAnalytics = (companyId: string): UseAnalyticsReturn => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Rango por defecto: últimos 30 días
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
  });

  const loadAnalytics = useCallback(async (range: DateRange) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await portalEmpresaService.getAnalytics(companyId, range);
      setAnalytics(data);
      setDateRange(range);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar las analíticas';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [companyId]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    analytics,
    isLoading,
    error,
    dateRange,
    loadAnalytics,
    setDateRange,
    clearError,
  };
};

