// API service para obtener evolución del MRR
import { MRREvolutionData } from '../types';

const API_BASE_URL = '/api/finances';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const generateMRRData = (
  startDate: Date,
  endDate: Date,
  granularity: 'daily' | 'weekly' | 'monthly'
): MRREvolutionData[] => {
  const data: MRREvolutionData[] = [];
  const current = new Date(startDate);
  let baseMRR = 12000;

  while (current <= endDate) {
    data.push({
      date: formatDate(new Date(current)),
      mrr: baseMRR + Math.random() * 1000 - 500,
    });

    if (granularity === 'daily') {
      current.setDate(current.getDate() + 1);
    } else if (granularity === 'weekly') {
      current.setDate(current.getDate() + 7);
    } else {
      current.setMonth(current.getMonth() + 1);
    }

    baseMRR += Math.random() * 200 - 100;
  }

  return data;
};

export const mrrEvolutionApi = {
  async obtenerEvolucionMRR(
    startDate: Date,
    endDate: Date,
    granularity: 'daily' | 'weekly' | 'monthly',
    locationIds?: string[]
  ): Promise<MRREvolutionData[]> {
    await delay(400);
    
    // En producción: GET ${API_BASE_URL}/mrr-evolution?startDate=...&endDate=...&granularity=...&locationIds=...
    return generateMRRData(startDate, endDate, granularity);
  },
};

