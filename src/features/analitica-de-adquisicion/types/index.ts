export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface AcquisitionSummary {
  totalLeads: {
    current: number;
    previous: number;
  };
  totalConversions: {
    current: number;
    previous: number;
  };
  conversionRate: {
    current: number;
    previous: number;
  };
  cpa: {
    current: number;
    previous: number;
  };
  roas?: {
    current: number;
    previous: number;
  };
  ltv?: {
    current: number;
    previous: number;
  };
}

export interface ChannelData {
  channel: string;
  leads: number;
  conversions: number;
  cost: number;
  cpa: number;
  conversionRate?: number;
  revenue?: number;
  roas?: number;
  ltv?: number;
}

export interface CampaignData {
  id: string;
  name: string;
  channel: string;
  cost: number;
  leads: number;
  conversions: number;
  cpa: number;
  revenue?: number;
  roas?: number;
  startDate?: string;
  endDate?: string;
  status?: 'active' | 'paused' | 'completed';
}

export interface CampaignsResponse {
  data: CampaignData[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AcquisitionChannel {
  id: string;
  name: string;
  source: string;
  medium: string;
  isCustom: boolean;
}

export interface AcquisitionFilters {
  dateRange: DateRange;
  channel?: string;
  campaign?: string;
  page?: number;
  limit?: number;
}

