// API service para obtener rentabilidad por servicio
import { ServiceProfitability } from '../types';

const API_BASE_URL = '/api/finances';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const serviceProfitabilityApi = {
  async obtenerRentabilidadPorServicio(
    startDate: Date,
    endDate: Date,
    locationIds?: string[]
  ): Promise<ServiceProfitability[]> {
    await delay(500);
    
    // En producción: GET ${API_BASE_URL}/service-profitability?startDate=...&endDate=...&locationIds=...
    return [
      {
        serviceId: 'svc_01',
        serviceName: 'Membresía Premium',
        totalRevenue: 25000,
        directCosts: 5000,
        grossMargin: 0.8,
      },
      {
        serviceId: 'svc_02',
        serviceName: 'Entrenamiento Personal',
        totalRevenue: 8000,
        directCosts: 4500,
        grossMargin: 0.4375,
      },
      {
        serviceId: 'svc_03',
        serviceName: 'Clases de Yoga',
        totalRevenue: 5000,
        directCosts: 1500,
        grossMargin: 0.7,
      },
      {
        serviceId: 'svc_04',
        serviceName: 'Membresía Básica',
        totalRevenue: 18000,
        directCosts: 7200,
        grossMargin: 0.6,
      },
      {
        serviceId: 'svc_05',
        serviceName: 'Clases de Crossfit',
        totalRevenue: 6000,
        directCosts: 2400,
        grossMargin: 0.6,
      },
    ];
  },
};

