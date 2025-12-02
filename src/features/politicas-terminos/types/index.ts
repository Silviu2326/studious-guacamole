export type PolicyType = 'CANCELLATION' | 'GDPR' | 'FACILITY_RULES';

export interface PolicyVersion {
  id: string;
  policyId: string;
  versionNumber: number;
  content: string;
  effectiveDate: string;
  author?: string;
  requireReAcceptance?: boolean;
}

export interface Policy {
  id: string;
  type: PolicyType;
  title: string;
  activeVersion: PolicyVersion;
  createdAt?: string;
  updatedAt?: string;
}

export interface PolicyWithVersions extends Policy {
  versions: PolicyVersion[];
}

export interface CreatePolicyRequest {
  type: PolicyType;
  title: string;
  content: string;
}

export interface CreateVersionRequest {
  content: string;
  requireReAcceptance?: boolean;
}

export interface GetVersionsResponse {
  versions: PolicyVersion[];
}

export interface GetPoliciesResponse {
  policies: Policy[];
}

