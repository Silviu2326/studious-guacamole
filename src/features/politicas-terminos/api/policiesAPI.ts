import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

export interface CreatePolicyDTO {
  type: 'CANCELLATION' | 'GDPR' | 'FACILITY_RULES';
  title: string;
  content: string;
}

export interface CreateVersionDTO {
  content: string;
  requireReAcceptance?: boolean;
}

export interface PolicyDTO {
  id: string;
  type: 'CANCELLATION' | 'GDPR' | 'FACILITY_RULES';
  title: string;
  activeVersion: {
    id: string;
    versionNumber: number;
    effectiveDate: string;
  };
}

export interface PolicyVersionDTO {
  id: string;
  policyId: string;
  versionNumber: number;
  content: string;
  effectiveDate: string;
  author?: string;
}

export const policiesAPI = {
  async getPolicies(): Promise<PolicyDTO[]> {
    const response = await axios.get(`${API_BASE_URL}/settings/policies`);
    return response.data;
  },

  async getPolicyVersions(policyId: string): Promise<PolicyVersionDTO[]> {
    const response = await axios.get(`${API_BASE_URL}/settings/policies/${policyId}/versions`);
    return response.data;
  },

  async createPolicy(data: CreatePolicyDTO): Promise<PolicyDTO> {
    const response = await axios.post(`${API_BASE_URL}/settings/policies`, data);
    return response.data;
  },

  async createVersion(policyId: string, data: CreateVersionDTO): Promise<PolicyVersionDTO> {
    const response = await axios.post(`${API_BASE_URL}/settings/policies/${policyId}/versions`, data);
    return response.data;
  },
};

