import { useState, useEffect, useCallback } from 'react';
import { ReferralProgram } from '../types';
import { referralApi } from '../api/referralApi';
import { mockPrograms } from '../api/mockData';

export const useReferralPrograms = () => {
  const [programs, setPrograms] = useState<ReferralProgram[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrograms = useCallback(async (status?: 'active' | 'inactive' | 'all') => {
    try {
      setIsLoading(true);
      setError(null);
      
      // En desarrollo, usar mock data
      // En producción: const data = await referralApi.getPrograms(status);
      const data = mockPrograms.filter(p => 
        status === 'all' || status === undefined || (status === 'active' ? p.isActive : !p.isActive)
      );
      
      setPrograms(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar programas');
      setPrograms([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProgram = useCallback(async (programData: any) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // En desarrollo, crear programa mock
      // En producción: const newProgram = await referralApi.createProgram(programData);
      const newProgram: ReferralProgram = {
        id: `prog_${Date.now()}`,
        name: programData.name,
        isActive: programData.isActive ?? true,
        startDate: programData.startDate,
        endDate: programData.endDate,
        referrerReward: {
          type: programData.referrerReward.type,
          value: programData.referrerReward.value,
        },
        referredReward: {
          type: programData.referredReward.type,
          value: programData.referredReward.value,
        },
        description: programData.description,
        conversions: 0,
        createdAt: new Date().toISOString(),
      };
      
      setPrograms(prev => [...prev, newProgram]);
      return newProgram;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear programa');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProgram = useCallback(async (programId: string, updateData: any) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // En desarrollo, actualizar programa mock
      // En producción: const updatedProgram = await referralApi.updateProgram(programId, updateData);
      setPrograms(prev =>
        prev.map(p =>
          p.id === programId
            ? {
                ...p,
                ...updateData,
                updatedAt: new Date().toISOString(),
              }
            : p
        )
      );
      
      return programs.find(p => p.id === programId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar programa');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [programs]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  return {
    programs,
    isLoading,
    error,
    fetchPrograms,
    createProgram,
    updateProgram,
  };
};

