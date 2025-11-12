import { useState, useEffect, useCallback } from 'react';
import {
  EmailHealthStats,
  SuppressionListResponse,
  getEmailHealthStats,
  getSuppressionList,
  addSuppressedEmail as addSuppressedEmailAPI,
  removeSuppressedEmail as removeSuppressedEmailAPI
} from '../api/emailCompliance';

interface UseEmailComplianceAPIParams {
  trainerId: string;
  dateRange?: 'last7days' | 'last30days' | 'last90days';
}

interface UseEmailComplianceAPIReturn {
  stats: EmailHealthStats | null;
  suppressionList: SuppressionListResponse | null;
  isLoading: boolean;
  error: Error | null;
  addSuppressedEmail: (email: string, reason?: string) => Promise<void>;
  removeSuppressedEmail: (email: string) => Promise<void>;
  refreshStats: () => Promise<void>;
  refreshSuppressionList: () => Promise<void>;
}

/**
 * Hook personalizado que encapsula toda la lógica de llamadas a la API
 * para la gestión de la salud y cumplimiento de email.
 */
export const useEmailComplianceAPI = ({
  trainerId,
  dateRange = 'last30days'
}: UseEmailComplianceAPIParams): UseEmailComplianceAPIReturn => {
  const [stats, setStats] = useState<EmailHealthStats | null>(null);
  const [suppressionList, setSuppressionList] = useState<SuppressionListResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getEmailHealthStats(dateRange);
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al cargar estadísticas'));
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

  const fetchSuppressionList = useCallback(async () => {
    try {
      const data = await getSuppressionList();
      setSuppressionList(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al cargar lista de supresión'));
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchSuppressionList();
  }, [fetchStats, fetchSuppressionList]);

  const addSuppressedEmail = async (email: string, reason?: string): Promise<void> => {
    try {
      await addSuppressedEmailAPI(email, reason);
      await fetchSuppressionList(); // Refrescar lista
    } catch (err) {
      throw err instanceof Error ? err : new Error('Error al añadir email a la lista de supresión');
    }
  };

  const removeSuppressedEmail = async (email: string): Promise<void> => {
    try {
      await removeSuppressedEmailAPI(email);
      await fetchSuppressionList(); // Refrescar lista
    } catch (err) {
      throw err instanceof Error ? err : new Error('Error al eliminar email de la lista de supresión');
    }
  };

  return {
    stats,
    suppressionList,
    isLoading,
    error,
    addSuppressedEmail,
    removeSuppressedEmail,
    refreshStats: fetchStats,
    refreshSuppressionList: fetchSuppressionList
  };
};























