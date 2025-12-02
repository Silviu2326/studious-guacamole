import { useState, useEffect } from 'react';
import { getFunnelAnalytics } from '../api/funnels';
import type { FunnelAnalytics } from '../api/funnels';

interface UseFunnelAnalyticsParams {
  funnelId: string;
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
}

interface UseFunnelAnalyticsReturn {
  data: FunnelAnalytics | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Hook personalizado para obtener y gestionar los datos de analíticas de un funnel específico
 */
export const useFunnelAnalytics = ({
  funnelId,
  dateRange
}: UseFunnelAnalyticsParams): UseFunnelAnalyticsReturn => {
  const [data, setData] = useState<FunnelAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const startDate = dateRange.startDate.toISOString().split('T')[0];
      const endDate = dateRange.endDate.toISOString().split('T')[0];
      
      const analytics = await getFunnelAnalytics(funnelId, startDate, endDate);
      setData(analytics);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al cargar analíticas'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (funnelId) {
      fetchAnalytics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [funnelId, dateRange.startDate, dateRange.endDate]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchAnalytics
  };
};

