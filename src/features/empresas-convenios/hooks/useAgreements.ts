import { useState, useEffect, useCallback } from 'react';
import {
  CorporateAgreement,
  AgreementFilters,
  AgreementFormData,
  AgreementsResponse,
  AgreementMembersResponse,
} from '../types';
import { AgreementsService } from '../api/agreementsService';

interface UseAgreementsReturn {
  agreements: CorporateAgreement[];
  pagination: AgreementsResponse['pagination'] | null;
  isLoading: boolean;
  error: string | null;
  filters: AgreementFilters;
  selectedAgreement: CorporateAgreement | null;
  agreementMembers: AgreementMembersResponse[];
  membersLoading: boolean;

  // Actions
  loadAgreements: (newFilters?: AgreementFilters) => Promise<void>;
  createAgreement: (data: AgreementFormData) => Promise<CorporateAgreement | null>;
  updateAgreement: (
    agreementId: string,
    data: Partial<AgreementFormData>
  ) => Promise<CorporateAgreement | null>;
  getAgreementById: (agreementId: string) => Promise<void>;
  getAgreementMembers: (agreementId: string) => Promise<void>;
  updateFilters: (newFilters: Partial<AgreementFilters>) => void;
  setSelectedAgreement: (agreement: CorporateAgreement | null) => void;
  clearError: () => void;
}

export const useAgreements = (): UseAgreementsReturn => {
  const [agreements, setAgreements] = useState<CorporateAgreement[]>([]);
  const [pagination, setPagination] = useState<AgreementsResponse['pagination'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AgreementFilters>({
    page: 1,
    limit: 10,
  });
  const [selectedAgreement, setSelectedAgreement] = useState<CorporateAgreement | null>(null);
  const [agreementMembers, setAgreementMembers] = useState<AgreementMembersResponse[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);

  const loadAgreements = useCallback(async (newFilters?: AgreementFilters) => {
    try {
      setIsLoading(true);
      setError(null);

      const filtersToUse = newFilters || filters;
      const response = await AgreementsService.getAgreements(filtersToUse);

      setAgreements(response.data);
      setPagination(response.pagination);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los convenios';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const createAgreement = useCallback(async (data: AgreementFormData): Promise<CorporateAgreement | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const newAgreement = await AgreementsService.createAgreement(data);
      await loadAgreements(); // Recargar lista
      return newAgreement;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear el convenio';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [loadAgreements]);

  const updateAgreement = useCallback(
    async (
      agreementId: string,
      data: Partial<AgreementFormData>
    ): Promise<CorporateAgreement | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const updatedAgreement = await AgreementsService.updateAgreement(agreementId, data);
        await loadAgreements(); // Recargar lista
        return updatedAgreement;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el convenio';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [loadAgreements]
  );

  const getAgreementById = useCallback(async (agreementId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const agreement = await AgreementsService.getAgreementById(agreementId);
      setSelectedAgreement(agreement);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar el convenio';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAgreementMembers = useCallback(async (agreementId: string) => {
    try {
      setMembersLoading(true);
      setError(null);

      const members = await AgreementsService.getAgreementMembers(agreementId);
      setAgreementMembers(members);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los miembros';
      setError(errorMessage);
    } finally {
      setMembersLoading(false);
    }
  }, []);

  const updateFilters = useCallback((newFilters: Partial<AgreementFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Cargar convenios cuando cambian los filtros
  useEffect(() => {
    loadAgreements();
  }, [filters.page, filters.status, filters.search]);

  return {
    agreements,
    pagination,
    isLoading,
    error,
    filters,
    selectedAgreement,
    agreementMembers,
    membersLoading,
    loadAgreements,
    createAgreement,
    updateAgreement,
    getAgreementById,
    getAgreementMembers,
    updateFilters,
    setSelectedAgreement,
    clearError,
  };
};

