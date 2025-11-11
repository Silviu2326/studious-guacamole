import {
  fetchAutomationRoadmap,
  fetchChannelHealthMetrics,
  fetchEmailPrograms,
  fetchLifecycleSequences,
  fetchMessagingAutomations,
  fetchMissionControlSnapshot,
  fetchMissionControlSummary,
  fetchMultiChannelCampaigns,
} from '../api';
import {
  AutomationRoadmapItem,
  ChannelHealthMetric,
  EmailProgram,
  LifecycleSequence,
  MessagingAutomation,
  MissionControlSnapshot,
  MissionControlSummary,
  MultiChannelCampaign,
} from '../types';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: value < 100 ? 1 : 0,
  }).format(value);
}

function formatPercentage(value: number, fractionDigits = 1): string {
  return `${value.toFixed(fractionDigits)}%`;
}

function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (remaining === 0) {
    return `${hours} h`;
  }
  return `${hours}h ${remaining}m`;
}

async function getSummary(): Promise<MissionControlSummary[]> {
  return fetchMissionControlSummary();
}

async function getCampaigns(): Promise<MultiChannelCampaign[]> {
  return fetchMultiChannelCampaigns();
}

async function getEmailPrograms(): Promise<EmailProgram[]> {
  return fetchEmailPrograms();
}

async function getLifecycleSequences(): Promise<LifecycleSequence[]> {
  return fetchLifecycleSequences();
}

async function getMessagingAutomations(): Promise<MessagingAutomation[]> {
  return fetchMessagingAutomations();
}

async function getChannelHealth(): Promise<ChannelHealthMetric[]> {
  return fetchChannelHealthMetrics();
}

async function getRoadmap(): Promise<AutomationRoadmapItem[]> {
  return fetchAutomationRoadmap();
}

async function getSnapshot(): Promise<MissionControlSnapshot> {
  return fetchMissionControlSnapshot();
}

export const CampanasAutomatizacionService = {
  getSummary,
  getCampaigns,
  getEmailPrograms,
  getLifecycleSequences,
  getMessagingAutomations,
  getChannelHealth,
  getRoadmap,
  getSnapshot,
  formatCurrency,
  formatPercentage,
  formatDuration,
};







