import { useState, useEffect } from 'react';
import { getCampaignAnalytics, CampaignAnalytics } from '../api/campaigns';

interface UseCampaignAnalyticsParams {
  campaignId: string;
}

interface UseCampaignAnalyticsReturn {
  analytics: CampaignAnalytics | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Hook personalizado para obtener y gestionar los datos de analíticas
 * de una campaña específica.
 */
export const useCampaignAnalytics = ({
  campaignId
}: UseCampaignAnalyticsParams): UseCampaignAnalyticsReturn => {
  const [analytics, setAnalytics] = useState<CampaignAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAnalytics = async () => {
    if (!campaignId) {
      setAnalytics(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getCampaignAnalytics(campaignId);
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al cargar analíticas'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  return {
    analytics,
    isLoading,
    error,
    refetch: fetchAnalytics
  };
};























