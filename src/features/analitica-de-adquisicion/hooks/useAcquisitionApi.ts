import { useState, useEffect } from 'react';
import {
  AcquisitionSummary,
  ChannelData,
  CampaignsResponse,
  AcquisitionFilters,
} from '../types';
import {
  getAcquisitionSummary,
  getAcquisitionChannels,
  getAcquisitionCampaigns,
} from '../api/acquisitionApi';

interface UseAcquisitionApiReturn {
  summary: AcquisitionSummary | null;
  channels: ChannelData[] | null;
  campaigns: CampaignsResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useAcquisitionApi = (
  filters: AcquisitionFilters,
  isEntrenador: boolean
): UseAcquisitionApiReturn => {
  const [summary, setSummary] = useState<AcquisitionSummary | null>(null);
  const [channels, setChannels] = useState<ChannelData[] | null>(null);
  const [campaigns, setCampaigns] = useState<CampaignsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [summaryData, channelsData, campaignsData] = await Promise.all([
        getAcquisitionSummary(filters, isEntrenador),
        getAcquisitionChannels(filters, isEntrenador),
        getAcquisitionCampaigns(filters, isEntrenador),
      ]);

      setSummary(summaryData);
      setChannels(channelsData);
      setCampaigns(campaignsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
      console.error('Error fetching acquisition data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters.startDate, filters.endDate, filters.channel, filters.campaign, filters.page, isEntrenador]);

  return {
    summary,
    channels,
    campaigns,
    isLoading,
    error,
    refetch: fetchData,
  };
};

