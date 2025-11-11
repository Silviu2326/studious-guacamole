import { useState, useEffect, useCallback } from 'react';
import {
  getContentPackage,
  updateContentPackage,
  deleteContentPackage,
  ContentPackage
} from '../api/contentPackages';

interface UseContentPackageReturn {
  package: ContentPackage | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  updatePackage: (updates: Partial<ContentPackage>) => Promise<ContentPackage | null>;
  deletePackage: () => Promise<void>;
  refresh: () => void;
}

/**
 * Hook personalizado para abstraer la lógica de fetching y mutación
 * de un paquete de contenido específico.
 */
export const useContentPackage = (packageId: string): UseContentPackageReturn => {
  const [packageData, setPackageData] = useState<ContentPackage | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPackage = useCallback(async () => {
    if (!packageId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setError(null);
    
    try {
      const data = await getContentPackage(packageId);
      setPackageData(data);
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err : new Error('Error al cargar paquete'));
    } finally {
      setIsLoading(false);
    }
  }, [packageId]);

  useEffect(() => {
    fetchPackage();
  }, [fetchPackage]);

  const updatePackage = useCallback(async (
    updates: Partial<ContentPackage>
  ): Promise<ContentPackage | null> => {
    if (!packageId) return null;

    try {
      const updated = await updateContentPackage(packageId, updates);
      setPackageData(updated);
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al actualizar paquete'));
      throw err;
    }
  }, [packageId]);

  const deletePackage = useCallback(async (): Promise<void> => {
    if (!packageId) return;

    try {
      await deleteContentPackage(packageId);
      setPackageData(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al eliminar paquete'));
      throw err;
    }
  }, [packageId]);

  return {
    package: packageData,
    isLoading,
    isError,
    error,
    updatePackage,
    deletePackage,
    refresh: fetchPackage
  };
};



















