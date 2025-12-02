import { useState, useEffect, useCallback } from 'react';
import { Company, EmployeesListResponse, Employee, InvitationRequest, InvitationResponse } from '../types';
import { portalEmpresaService } from '../api/portalEmpresaService';

interface UseCompanyReturn {
  company: Company | null;
  isLoading: boolean;
  error: string | null;
  loadCompany: () => Promise<void>;
  clearError: () => void;
}

export const useCompany = (companyId: string): UseCompanyReturn => {
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCompany = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const companyData = await portalEmpresaService.getCompany(companyId);
      setCompany(companyData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar la empresa';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [companyId]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    loadCompany();
  }, [loadCompany]);

  return {
    company,
    isLoading,
    error,
    loadCompany,
    clearError,
  };
};

