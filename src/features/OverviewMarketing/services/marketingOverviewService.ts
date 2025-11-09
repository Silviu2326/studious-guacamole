import {
  fetchActiveCampaigns,
  fetchAISuggestions,
  fetchMarketingKPIs,
  fetchSocialGrowth,
  fetchTopFunnels,
  fetchUpcomingEvents,
} from '../api';
import {
  AISuggestion,
  CampaignPerformance,
  FunnelPerformance,
  MarketingKPI,
  MarketingOverviewPeriod,
  MarketingOverviewSnapshot,
  SocialGrowthMetric,
  UpcomingEvent,
} from '../types';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: value < 100 ? 1 : 0,
  }).format(value);
}

function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

function formatNumber(value: number): string {
  if (value >= 1000) {
    return `${Math.round(value / 100) / 10}K`;
  }
  return value.toString();
}

export function formatKpiValue(kpi: MarketingKPI): string {
  switch (kpi.format) {
    case 'currency':
      return formatCurrency(kpi.value);
    case 'percentage':
      return formatPercentage(kpi.value);
    case 'number':
    default:
      return formatNumber(kpi.value);
  }
}

async function getKPIs(period: MarketingOverviewPeriod): Promise<MarketingKPI[]> {
  return fetchMarketingKPIs(period);
}

async function getCampaigns(): Promise<CampaignPerformance[]> {
  return fetchActiveCampaigns();
}

async function getFunnels(period: MarketingOverviewPeriod): Promise<FunnelPerformance[]> {
  return fetchTopFunnels(period);
}

async function getSocial(period: MarketingOverviewPeriod): Promise<SocialGrowthMetric[]> {
  return fetchSocialGrowth(period);
}

async function getEvents(): Promise<UpcomingEvent[]> {
  return fetchUpcomingEvents();
}

async function getSuggestions(): Promise<AISuggestion[]> {
  return fetchAISuggestions();
}

async function getSnapshot(period: MarketingOverviewPeriod): Promise<MarketingOverviewSnapshot> {
  const [kpis, campaigns, funnels, socialGrowth, events, aiSuggestions] = await Promise.all([
    getKPIs(period),
    getCampaigns(),
    getFunnels(period),
    getSocial(period),
    getEvents(),
    getSuggestions(),
  ]);

  return {
    period,
    kpis,
    campaigns,
    funnels,
    socialGrowth,
    events,
    aiSuggestions,
  };
}

export const MarketingOverviewService = {
  getKPIs,
  getCampaigns,
  getFunnels,
  getSocial,
  getEvents,
  getSuggestions,
  getSnapshot,
  formatKpiValue,
};


