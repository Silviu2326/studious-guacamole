// API para gestión de tipos impositivos
import { TaxRate, CreateTaxRequest, UpdateTaxRequest } from './types';

const API_BASE = '/api/settings/taxes';

// Datos mock para desarrollo
const mockTaxes: TaxRate[] = [
  {
    id: 'tax_1',
    name: 'IVA General',
    rate: 21,
    is_default: true
  },
  {
    id: 'tax_2',
    name: 'IVA Reducido',
    rate: 10,
    is_default: false
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const taxesApi = {
  // Crear nuevo tipo de impuesto
  createTax: async (data: CreateTaxRequest): Promise<TaxRate> => {
    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Error al crear tipo de impuesto');
      return await response.json();
    } catch (error) {
      console.error('Error en createTax:', error);
      await delay(500);
      const newTax: TaxRate = {
        id: `tax_${Date.now()}`,
        name: data.name,
        rate: data.rate,
        is_default: data.is_default || false
      };
      return newTax;
    }
  },

  // Actualizar tipo de impuesto
  updateTax: async (id: string, data: UpdateTaxRequest): Promise<TaxRate> => {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Error al actualizar tipo de impuesto');
      return await response.json();
    } catch (error) {
      console.error('Error en updateTax:', error);
      await delay(500);
      const existing = mockTaxes.find(t => t.id === id);
      if (!existing) throw new Error('Tipo de impuesto no encontrado');
      return {
        ...existing,
        ...data
      };
    }
  },

  // Eliminar tipo de impuesto
  deleteTax: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error al eliminar tipo de impuesto');
    } catch (error) {
      console.error('Error en deleteTax:', error);
      await delay(500);
    }
  },
};

