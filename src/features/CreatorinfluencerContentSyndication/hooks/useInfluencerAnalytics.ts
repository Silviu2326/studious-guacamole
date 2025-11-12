import { useState, useEffect } from 'react';
import { getCampaignStats, CampaignStats } from '../api/influencers';

interface UseInfluencerAnalyticsParams {
  campaignId: string | null;
}

interface UseInfluencerAnalyticsReturn {
  stats: CampaignStats | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Hook personalizado que encapsula la lógica para obtener y procesar
 * las estadísticas de rendimiento de una campaña o influencer específico.
 */
export const useInfluencerAnalytics = ({
  campaignId
}: UseInfluencerAnalyticsParams): UseInfluencerAnalyticsReturn => {
  const [stats, setStats] = useState<CampaignStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = async () => {
    if (!campaignId) {
      setStats(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getCampaignStats(campaignId);
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al cargar analíticas'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats
  };
};




















