// API service para obtener sedes/locations
import { Location } from '../types';

const API_BASE_URL = '/api';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const locationsApi = {
  async obtenerTodasLasSedes(): Promise<Location[]> {
    await delay(300);
    // En producción: GET ${API_BASE_URL}/locations
    return [
      { id: 'loc_01', name: 'Sede Centro' },
      { id: 'loc_02', name: 'Sede Norte' },
      { id: 'loc_03', name: 'Sede Sur' },
    ];
  },
};

