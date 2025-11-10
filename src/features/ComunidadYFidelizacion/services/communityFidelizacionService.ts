import { CommunityFidelizacionAPI } from '../api/communityFidelizacion';
import { CommunityFidelizacionSnapshot } from '../types';

export const CommunityFidelizacionService = {
  async getSnapshot(period: CommunityFidelizacionSnapshot['period']) {
    return CommunityFidelizacionAPI.getSnapshot(period);
  },
};



