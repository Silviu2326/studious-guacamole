// API service para obtener resumen de KPIs
import { KPISummary, DateRange } from '../types';

const API_BASE_URL = '/api/finances';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const kpiSummaryApi = {
  async obtenerKPISummary(
    startDate: Date,
    endDate: Date,
    locationIds?: string[]
  ): Promise<KPISummary> {
    await delay(500);
    
    // En producción: GET ${API_BASE_URL}/kpi-summary?startDate=...&endDate=...&locationIds=...
    // Simulación de datos
    return {
      mrr: {
        current: 15200,
        change: 2.5,
      },
      revenueChurnRate: {
        current: 1.8,
        change: -0.2,
      },
      ltv: {
        current: 850,
        change: 5.1,
      },
      cac: {
        current: 120,
        change: -10,
      },
      averageTicketPerMember: {
        current: 55,
        change: 3.2,
      },
      averageTicketPerLocation: {
        current: 5067,
        change: 4.1,
      },
      grossMargin: {
        current: 0.72,
        change: 1.5,
      },
      mrrGrowthRate: {
        current: 2.5,
        change: 0.8,
      },
    };
  },
};

