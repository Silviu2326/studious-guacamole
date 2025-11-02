import { useState, useEffect } from 'react';
import { CostHistoryResponse, CostHistoryFilters } from '../types';
import { getCostHistory } from '../api/costHistoryApi';

export const usePurchaseData = (filters: CostHistoryFilters) => {
  const [data, setData] = useState<CostHistoryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await getCostHistory(filters);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar los datos');
        console.error('Error fetching purchase data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters.from, filters.to, filters.supplierIds, filters.categoryIds, filters.productId]);

  return { data, loading, error };
};

