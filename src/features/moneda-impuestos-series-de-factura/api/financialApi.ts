// API para configuración financiera (moneda)
import { FinancialSettings, UpdateCurrencyRequest } from './types';

const API_BASE = '/api/settings/financial';

// Datos mock para desarrollo
const mockFinancialSettings: FinancialSettings = {
  currency: 'EUR',
  taxes: [
    {
      id: 'tax_1',
      name: 'IVA General',
      rate: 21,
      is_default: true
    }
  ],
  invoice_series: [
    {
      id: 'series_1',
      name: 'Facturas 2024',
      format: 'F-{YYYY}/{####}',
      next_number: 157,
      is_default: true,
      location_id: null
    }
  ]
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const financialApi = {
  // Obtener configuración financiera completa
  getFinancialSettings: async (): Promise<FinancialSettings> => {
    try {
      const response = await fetch(API_BASE);
      if (!response.ok) throw new Error('Error al obtener configuración financiera');
      return await response.json();
    } catch (error) {
      console.error('Error en getFinancialSettings:', error);
      await delay(500);
      return mockFinancialSettings;
    }
  },

  // Actualizar moneda
  updateCurrency: async (data: UpdateCurrencyRequest): Promise<{ id: string; name: string; currency: string }> => {
    try {
      const response = await fetch(API_BASE, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Error al actualizar moneda');
      return await response.json();
    } catch (error) {
      console.error('Error en updateCurrency:', error);
      await delay(500);
      return {
        id: 'org_123',
        name: 'Fitness Corp',
        currency: data.currency
      };
    }
  },
};

