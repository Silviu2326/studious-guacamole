export type RewardType = 'percent_discount' | 'free_month' | 'free_session' | 'fixed_amount';

export interface Reward {
  type: RewardType;
  value: number;
}

export interface ReferralProgram {
  id: string;
  name: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
  referrerReward: Reward;
  referredReward: Reward;
  description?: string;
  conversions?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface ReferralStats {
  totalClicks: number;
  totalConversions: number;
  conversionRate: number;
  revenueFromReferrals: number;
  totalRewardsCost: number;
  topReferrers: Array<{
    userId: string;
    name: string;
    conversions: number;
  }>;
}

export interface ProgramFormData {
  name: string;
  startDate: string;
  endDate: string;
  referrerRewardType: RewardType;
  referrerRewardValue: number;
  referredRewardType: RewardType;
  referredRewardValue: number;
  description?: string;
  isActive?: boolean;
}

export type UserType = 'gym' | 'trainer';

