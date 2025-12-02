import { useState, useEffect, useCallback } from 'react';
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  SuppliersFilter,
  Supplier,
  SupplierFormData,
} from '../api/suppliersApi';

interface UseSuppliersOptions {
  gymId: string;
  filters?: SuppliersFilter;
}

interface UseSuppliersReturn {
  suppliers: Supplier[];
  isLoading: boolean;
  error: Error | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  refetch: () => Promise<void>;
  createSupplier: (data: SupplierFormData) => Promise<Supplier>;
  updateSupplier: (supplierId: string, data: Partial<SupplierFormData>) => Promise<Supplier>;
  deleteSupplier: (supplierId: string) => Promise<void>;
}

export const useSuppliers = ({ gymId, filters }: UseSuppliersOptions): UseSuppliersReturn => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const fetchSuppliers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getSuppliers(gymId, filters);
      setSuppliers(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al cargar proveedores'));
      console.error('Error fetching suppliers:', err);
    } finally {
      setIsLoading(false);
    }
  }, [gymId, filters]);

  useEffect(() => {
    if (gymId) {
      fetchSuppliers();
    }
  }, [gymId, fetchSuppliers]);

  const handleCreateSupplier = async (data: SupplierFormData): Promise<Supplier> => {
    try {
      const newSupplier = await createSupplier(gymId, data);
      await fetchSuppliers(); // Refetch to update list
      return newSupplier;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Error al crear proveedor');
    }
  };

  const handleUpdateSupplier = async (
    supplierId: string,
    data: Partial<SupplierFormData>
  ): Promise<Supplier> => {
    try {
      const updatedSupplier = await updateSupplier(gymId, supplierId, data);
      await fetchSuppliers(); // Refetch to update list
      return updatedSupplier;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Error al actualizar proveedor');
    }
  };

  const handleDeleteSupplier = async (supplierId: string): Promise<void> => {
    try {
      await deleteSupplier(gymId, supplierId);
      await fetchSuppliers(); // Refetch to update list
    } catch (err) {
      throw err instanceof Error ? err : new Error('Error al eliminar proveedor');
    }
  };

  return {
    suppliers,
    isLoading,
    error,
    pagination,
    refetch: fetchSuppliers,
    createSupplier: handleCreateSupplier,
    updateSupplier: handleUpdateSupplier,
    deleteSupplier: handleDeleteSupplier,
  };
};

