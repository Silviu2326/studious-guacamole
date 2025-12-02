import axios from 'axios';
import { CorporateClient, UsageData, TimeSeriesData, ReportRequest } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

/**
 * Obtiene la lista de clientes corporativos activos del gimnasio
 */
export const getCorporateClients = async (): Promise<CorporateClient[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/corporate/clients`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching corporate clients:', error);
    throw error;
  }
};

/**
 * Obtiene los KPIs agregados para un cliente corporativo específico
 */
export const getUsageSummary = async (
  clientId: string,
  startDate: Date,
  endDate: Date
): Promise<UsageData> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/corporate/clients/${clientId}/usage-summary`,
      {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching usage summary:', error);
    throw error;
  }
};

/**
 * Obtiene datos de series temporales para gráficos de tendencias
 */
export const getTimeSeriesData = async (
  clientId: string,
  startDate: Date,
  endDate: Date,
  granularity: 'day' | 'week' | 'month'
): Promise<TimeSeriesData[]> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/corporate/clients/${clientId}/usage-timeseries`,
      {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          granularity,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching time series data:', error);
    throw error;
  }
};

/**
 * Inicia la generación de un informe en PDF o CSV
 */
export const generateReport = async (
  request: ReportRequest
): Promise<{ reportId: string; status: string; message: string }> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/corporate/clients/${request.clientId}/reports`,
      {
        format: request.format,
        dateRange: {
          startDate: request.dateRange.startDate.toISOString(),
          endDate: request.dateRange.endDate.toISOString(),
        },
        metrics: request.metrics,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
};

