import { useState } from 'react';
import { policiesAPI } from './policiesAPI';
import { Policy, PolicyVersion } from '../types';

export const usePoliciesAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPolicies = async (): Promise<Policy[]> => {
    setLoading(true);
    setError(null);
    try {
      const policies = await policiesAPI.getPolicies();
      return policies;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar políticas';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPolicyVersions = async (policyId: string): Promise<PolicyVersion[]> => {
    setLoading(true);
    setError(null);
    try {
      const versions = await policiesAPI.getPolicyVersions(policyId);
      return versions;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar versiones';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createPolicy = async (
    type: 'CANCELLATION' | 'GDPR' | 'FACILITY_RULES',
    title: string,
    content: string
  ): Promise<Policy> => {
    setLoading(true);
    setError(null);
    try {
      const policy = await policiesAPI.createPolicy({ type, title, content });
      return policy;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear política';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createVersion = async (
    policyId: string,
    content: string,
    requireReAcceptance?: boolean
  ): Promise<PolicyVersion> => {
    setLoading(true);
    setError(null);
    try {
      const version = await policiesAPI.createVersion(policyId, { content, requireReAcceptance });
      return version;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear versión';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getPolicies,
    getPolicyVersions,
    createPolicy,
    createVersion,
  };
};

