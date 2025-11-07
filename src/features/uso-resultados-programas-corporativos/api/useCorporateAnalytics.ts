import { useState, useEffect } from 'react';
import { CorporateClient, UsageData, TimeSeriesData, DateRange } from '../types';
import * as api from './index';

export const useCorporateAnalytics = (
  clientId: string | null,
  dateRange: DateRange
) => {
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!clientId) {
      setUsageData(null);
      setTimeSeriesData([]);
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Cargar datos en paralelo
        const [summary, timeseries] = await Promise.all([
          api.getUsageSummary(clientId, dateRange.startDate, dateRange.endDate),
          api.getTimeSeriesData(clientId, dateRange.startDate, dateRange.endDate, 'day'),
        ]);

        setUsageData(summary);
        setTimeSeriesData(timeseries);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Error desconocido'));
        setUsageData(null);
        setTimeSeriesData([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [clientId, dateRange.startDate, dateRange.endDate]);

  return { usageData, timeSeriesData, isLoading, error };
};

export const useCorporateClients = () => {
  const [clients, setClients] = useState<CorporateClient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadClients = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await api.getCorporateClients();
        setClients(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Error desconocido'));
        setClients([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadClients();
  }, []);

  return { clients, isLoading, error };
};

