import { fetchIntelligenceOverview } from '../api';
import { IntelligenceOverviewResponse } from '../types';

export const getIntelligenceOverview = async (): Promise<IntelligenceOverviewResponse> => {
  try {
    return await fetchIntelligenceOverview();
  } catch (error) {
    console.error('Error obteniendo overview de inteligencia', error);
    throw error;
  }
};

export default getIntelligenceOverview;






