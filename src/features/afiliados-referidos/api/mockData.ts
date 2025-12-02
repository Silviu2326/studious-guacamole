import { ReferralProgram, ReferralStats } from '../types';

// Mock data para desarrollo
export const mockPrograms: ReferralProgram[] = [
  {
    id: 'prog_a1b2c3d4',
    name: 'Campaña Verano 2024',
    isActive: true,
    startDate: '2024-06-01T00:00:00.000Z',
    endDate: '2024-08-31T23:59:59.000Z',
    referrerReward: {
      type: 'free_month',
      value: 1,
    },
    referredReward: {
      type: 'percent_discount',
      value: 20,
    },
    conversions: 42,
    createdAt: '2024-05-15T10:00:00.000Z',
  },
  {
    id: 'prog_e5f6g7h8',
    name: 'Trae un Amigo',
    isActive: true,
    startDate: '2024-01-01T00:00:00.000Z',
    endDate: '2024-12-31T23:59:59.000Z',
    referrerReward: {
      type: 'free_session',
      value: 1,
    },
    referredReward: {
      type: 'free_session',
      value: 1,
    },
    conversions: 12,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'prog_i9j0k1l2',
    name: 'Black Friday 2024',
    isActive: false,
    startDate: '2024-11-20T00:00:00.000Z',
    endDate: '2024-11-30T23:59:59.000Z',
    referrerReward: {
      type: 'percent_discount',
      value: 15,
    },
    referredReward: {
      type: 'percent_discount',
      value: 30,
    },
    conversions: 89,
    createdAt: '2024-11-15T10:00:00.000Z',
  },
];

export const mockStats: ReferralStats = {
  totalClicks: 1520,
  totalConversions: 125,
  conversionRate: 8.22,
  revenueFromReferrals: 7500.5,
  totalRewardsCost: 950,
  topReferrers: [
    {
      userId: 'user_1',
      name: 'Ana García',
      conversions: 15,
    },
    {
      userId: 'user_2',
      name: 'Carlos Pérez',
      conversions: 11,
    },
    {
      userId: 'user_3',
      name: 'María López',
      conversions: 9,
    },
    {
      userId: 'user_4',
      name: 'Juan Martínez',
      conversions: 7,
    },
    {
      userId: 'user_5',
      name: 'Laura Sánchez',
      conversions: 6,
    },
  ],
};

