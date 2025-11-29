import { useState, useEffect, useCallback } from 'react';
import { BranchCatalogData } from '../types';
import { catalogApi } from '../api/catalog';
import { branchesApi } from '../api/branches';

export const useBranchCatalog = (branchId: string | null) => {
  const [data, setData] = useState<BranchCatalogData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCatalog = useCallback(async () => {
    if (!branchId) {
      setData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [catalogItems, branches] = await Promise.all([
        catalogApi.obtenerBranchCatalog(branchId),
        branchesApi.obtenerBranches(),
      ]);

      const currentBranch = branches.find(b => b.id === branchId);

      // Calcular estadísticas
      const masterItems = catalogItems.filter(item => item.status === 'master').length;
      const overriddenItems = catalogItems.filter(item => item.status === 'override').length;
      const exclusiveItems = catalogItems.filter(item => item.status === 'exclusive').length;

      // Calcular desviación promedio de precios
      const overriddenItemsWithDeviation = catalogItems.filter(
        item => item.status === 'override' && item.masterPrice > 0
      );
      const avgDeviation = overriddenItemsWithDeviation.length > 0
        ? overriddenItemsWithDeviation.reduce((sum, item) => {
            const deviation = ((item.branchPrice - item.masterPrice) / item.masterPrice) * 100;
            return sum + deviation;
          }, 0) / overriddenItemsWithDeviation.length
        : 0;

      const catalogData: BranchCatalogData = {
        branchId,
        branchName: currentBranch?.name || 'Sede desconocida',
        items: catalogItems,
        stats: {
          totalItems: catalogItems.length,
          masterItems,
          overriddenItems,
          exclusiveItems,
          avgPriceDeviation: Math.round(avgDeviation * 100) / 100,
          lastModified: new Date().toISOString(),
        },
      };

      setData(catalogData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'));
    } finally {
      setIsLoading(false);
    }
  }, [branchId]);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  return { data, isLoading, error, refetch: fetchCatalog };
};
