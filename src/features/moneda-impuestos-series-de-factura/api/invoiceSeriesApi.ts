// API para gestión de series de facturación
import { InvoiceSeries, CreateInvoiceSeriesRequest, UpdateInvoiceSeriesRequest, Location } from './types';

const API_BASE = '/api/settings/invoice-series';

// Datos mock para desarrollo
const mockInvoiceSeries: InvoiceSeries[] = [
  {
    id: 'series_1',
    name: 'Facturas 2024',
    format: 'F-{YYYY}/{####}',
    next_number: 157,
    is_default: true,
    location_id: null
  }
];

const mockLocations: Location[] = [
  { id: 'loc_1', name: 'Sede Centro' },
  { id: 'loc_2', name: 'Sede Norte' },
  { id: 'loc_3', name: 'Sede Sur' }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const invoiceSeriesApi = {
  // Obtener todas las series de facturación
  getInvoiceSeries: async (): Promise<InvoiceSeries[]> => {
    try {
      const response = await fetch(API_BASE);
      if (!response.ok) throw new Error('Error al obtener series de facturación');
      return await response.json();
    } catch (error) {
      console.error('Error en getInvoiceSeries:', error);
      await delay(500);
      return mockInvoiceSeries;
    }
  },

  // Obtener ubicaciones (solo para gimnasios)
  getLocations: async (): Promise<Location[]> => {
    try {
      const response = await fetch('/api/locations');
      if (!response.ok) throw new Error('Error al obtener ubicaciones');
      return await response.json();
    } catch (error) {
      console.error('Error en getLocations:', error);
      await delay(500);
      return mockLocations;
    }
  },

  // Crear nueva serie de facturación
  createInvoiceSeries: async (data: CreateInvoiceSeriesRequest): Promise<InvoiceSeries> => {
    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Error al crear serie de facturación');
      return await response.json();
    } catch (error) {
      console.error('Error en createInvoiceSeries:', error);
      await delay(500);
      const newSeries: InvoiceSeries = {
        id: `series_${Date.now()}`,
        name: data.name,
        format: data.format,
        next_number: data.next_number,
        is_default: data.is_default || false,
        location_id: data.location_id || null
      };
      return newSeries;
    }
  },

  // Actualizar serie de facturación
  updateInvoiceSeries: async (seriesId: string, data: UpdateInvoiceSeriesRequest): Promise<InvoiceSeries> => {
    try {
      const response = await fetch(`${API_BASE}/${seriesId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Error al actualizar serie de facturación');
      return await response.json();
    } catch (error) {
      console.error('Error en updateInvoiceSeries:', error);
      await delay(500);
      const existing = mockInvoiceSeries.find(s => s.id === seriesId);
      if (!existing) throw new Error('Serie de facturación no encontrada');
      return {
        ...existing,
        ...data
      };
    }
  },

  // Eliminar serie de facturación (desactivar)
  deleteInvoiceSeries: async (seriesId: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE}/${seriesId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error al eliminar serie de facturación');
    } catch (error) {
      console.error('Error en deleteInvoiceSeries:', error);
      await delay(500);
    }
  },
};

