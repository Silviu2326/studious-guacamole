import { useState, useEffect, useCallback } from 'react';
import { ReferralStats } from '../types';
import { referralApi } from '../api/referralApi';
import { mockStats } from '../api/mockData';

export interface StatsParams {
  startDate: string;
  endDate: string;
  programId?: string;
}

export const useReferralStats = () => {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async (params: StatsParams) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // En desarrollo, usar mock data
      // En producción: const data = await referralApi.getStats(params);
      const data = mockStats;
      
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar estadísticas');
      setStats(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Cargar estadísticas del último mes por defecto
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);

    fetchStats({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
  }, [fetchStats]);

  return {
    stats,
    isLoading,
    error,
    fetchStats,
  };
};

