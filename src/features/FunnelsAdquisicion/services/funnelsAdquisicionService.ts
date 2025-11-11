import {
  fetchAcquisitionAISuggestions,
  fetchAcquisitionCampaigns,
  fetchAcquisitionEvents,
  fetchAcquisitionTopFunnels,
  fetchFunnelsAcquisitionKPIs,
  fetchWorkspaceBlueprints,
} from '../api';
import {
  AcquisitionAISuggestion,
  AcquisitionCampaign,
  AcquisitionEvent,
  AcquisitionFunnelPerformance,
  AcquisitionKPI,
  AcquisitionWorkspaceBlueprint,
  FunnelsAcquisitionPeriod,
  FunnelsAcquisitionSnapshot,
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

export function formatKpiValue(kpi: AcquisitionKPI): string {
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

async function getKPIs(period: FunnelsAcquisitionPeriod): Promise<AcquisitionKPI[]> {
  return fetchFunnelsAcquisitionKPIs(period);
}

async function getCampaigns(): Promise<AcquisitionCampaign[]> {
  return fetchAcquisitionCampaigns();
}

async function getFunnels(
  period: FunnelsAcquisitionPeriod,
): Promise<AcquisitionFunnelPerformance[]> {
  return fetchAcquisitionTopFunnels(period);
}

async function getEvents(): Promise<AcquisitionEvent[]> {
  return fetchAcquisitionEvents();
}

async function getSuggestions(): Promise<AcquisitionAISuggestion[]> {
  return fetchAcquisitionAISuggestions();
}

async function getWorkspaceBlueprints(): Promise<AcquisitionWorkspaceBlueprint[]> {
  return fetchWorkspaceBlueprints();
}

async function getSnapshot(period: FunnelsAcquisitionPeriod): Promise<FunnelsAcquisitionSnapshot> {
  const [kpis, campaigns, funnels, events, aiSuggestions, workspaceBlueprints] = await Promise.all([
    getKPIs(period),
    getCampaigns(),
    getFunnels(period),
    getEvents(),
    getSuggestions(),
    getWorkspaceBlueprints(),
  ]);

  return {
    period,
    kpis,
    campaigns,
    funnels,
    events,
    aiSuggestions,
    workspaceBlueprints,
  };
}

export const FunnelsAdquisicionService = {
  getKPIs,
  getCampaigns,
  getFunnels,
  getEvents,
  getSuggestions,
  getWorkspaceBlueprints,
  getSnapshot,
  formatKpiValue,
};






