import { useState, useEffect } from 'react';
import { 
  getTransfers, 
  createTransfer, 
  updateTransferStatus, 
  getTransferKPIs 
} from '../api';
import { 
  TransferFilters, 
  Transfer, 
  CreateTransferRequest, 
  UpdateTransferStatusRequest,
  KPIData 
} from '../types';

export const useTransferApi = (filters: TransferFilters = {}) => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [kpis, setKPIs] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const fetchTransfers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getTransfers(filters);
      setTransfers(response.data);
      setPagination(response.pagination);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener las transferencias';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchKPIs = async () => {
    try {
      const data = await getTransferKPIs();
      setKPIs(data);
    } catch (err) {
      console.error('Error al obtener KPIs:', err);
    }
  };

  useEffect(() => {
    fetchTransfers();
    fetchKPIs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status, filters.originLocationId, filters.destinationLocationId]);

  const addTransfer = async (request: CreateTransferRequest): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await createTransfer(request);
      await fetchTransfers();
      await fetchKPIs();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear la transferencia';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (
    transferId: string,
    request: UpdateTransferStatusRequest
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await updateTransferStatus(transferId, request);
      await fetchTransfers();
      await fetchKPIs();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar la transferencia';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchTransfers();
    fetchKPIs();
  };

  return {
    transfers,
    kpis,
    loading,
    error,
    pagination,
    addTransfer,
    updateStatus,
    refetch,
  };
};

