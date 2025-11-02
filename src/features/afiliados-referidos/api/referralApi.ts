import axios from 'axios';

const API_BASE_URL = '/api/marketing';

export interface CreateProgramRequest {
  name: string;
  startDate: string;
  endDate: string;
  referrerReward: {
    type: string;
    value: number;
  };
  referredReward: {
    type: string;
    value: number;
  };
  description?: string;
}

export interface UpdateProgramRequest {
  name?: string;
  startDate?: string;
  endDate?: string;
  referrerReward?: {
    type: string;
    value: number;
  };
  referredReward?: {
    type: string;
    value: number;
  };
  description?: string;
  isActive?: boolean;
}

export interface GetStatsParams {
  startDate: string;
  endDate: string;
  programId?: string;
}

export const referralApi = {
  // GET /api/marketing/referral-programs
  getPrograms: async (status?: 'active' | 'inactive' | 'all') => {
    const params = status ? { status } : {};
    const response = await axios.get(`${API_BASE_URL}/referral-programs`, { params });
    return response.data;
  },

  // POST /api/marketing/referral-programs
  createProgram: async (programData: CreateProgramRequest) => {
    const response = await axios.post(`${API_BASE_URL}/referral-programs`, programData);
    return response.data;
  },

  // PUT /api/marketing/referral-programs/{programId}
  updateProgram: async (programId: string, updateData: UpdateProgramRequest) => {
    const response = await axios.put(`${API_BASE_URL}/referral-programs/${programId}`, updateData);
    return response.data;
  },

  // GET /api/marketing/referrals/stats
  getStats: async (params: GetStatsParams) => {
    const response = await axios.get(`${API_BASE_URL}/referrals/stats`, { params });
    return response.data;
  },
};

