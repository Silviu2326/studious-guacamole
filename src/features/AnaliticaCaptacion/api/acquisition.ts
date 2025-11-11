export interface LeadSourceStat {
  id: string;
  label: string;
  leads: number;
  trend: 'up' | 'down' | 'stable';
  contribution: number;
}

export interface FunnelStage {
  stage: 'lead' | 'visita' | 'alta';
  count: number;
  conversionRateToNext?: number;
}

export interface CampaignPerformance {
  id: string;
  name: string;
  channel: 'Social Ads' | 'Email' | 'Referidos' | 'Landing';
  leads: number;
  costPerLead: number;
  leadToMemberRate: number;
}

export const fetchLeadSourceStats = async (): Promise<LeadSourceStat[]> => {
  return [
    { id: 'instagram-ads', label: 'Instagram Ads', leads: 186, trend: 'up', contribution: 0.32 },
    { id: 'organic', label: 'Orgánico (web + redes)', leads: 142, trend: 'stable', contribution: 0.24 },
    { id: 'referidos', label: 'Programa referidos', leads: 98, trend: 'up', contribution: 0.17 },
    { id: 'google-search', label: 'Google Search', leads: 76, trend: 'down', contribution: 0.13 },
    { id: 'eventos', label: 'Eventos & Open Days', leads: 54, trend: 'up', contribution: 0.09 },
    { id: 'otros', label: 'Otros', leads: 23, trend: 'stable', contribution: 0.05 },
  ];
};

export const fetchFunnelStages = async (): Promise<FunnelStage[]> => {
  return [
    { stage: 'lead', count: 579, conversionRateToNext: 0.41 },
    { stage: 'visita', count: 238, conversionRateToNext: 0.56 },
    { stage: 'alta', count: 133 },
  ];
};

export const fetchCampaignPerformance = async (): Promise<CampaignPerformance[]> => {
  return [
    {
      id: 'bf-2025',
      name: 'Black Friday 2025',
      channel: 'Social Ads',
      leads: 74,
      costPerLead: 6.9,
      leadToMemberRate: 0.38,
    },
    {
      id: 'referidos-q4',
      name: 'Reto referidos Q4',
      channel: 'Referidos',
      leads: 61,
      costPerLead: 2.1,
      leadToMemberRate: 0.52,
    },
    {
      id: 'newsletter-fit',
      name: 'Newsletter Fit Tips',
      channel: 'Email',
      leads: 45,
      costPerLead: 1.4,
      leadToMemberRate: 0.27,
    },
    {
      id: 'landing-hiit',
      name: 'Landing Challenge HIIT',
      channel: 'Landing',
      leads: 39,
      costPerLead: 3.2,
      leadToMemberRate: 0.42,
    },
  ];
};






