// API para reportes de pedidos
import { ReportePedidos } from '../types';

const API_BASE = '/api/ventas/reportes';

export const reportesApi = {
  // Generar reportes de ventas
  generarReporte: async (fechaInicio: Date, fechaFin: Date): Promise<ReportePedidos> => {
    try {
      const params = new URLSearchParams();
      params.append('fechaInicio', fechaInicio.toISOString());
      params.append('fechaFin', fechaFin.toISOString());

      const response = await fetch(`${API_BASE}?${params.toString()}`);
      if (!response.ok) throw new Error('Error al generar reporte');
      return await response.json();
    } catch (error) {
      console.error('Error en generarReporte:', error);
      return mockReporte;
    }
  },

  // Exportar reporte a PDF
  exportarPDF: async (fechaInicio: Date, fechaFin: Date): Promise<Blob> => {
    try {
      const params = new URLSearchParams();
      params.append('fechaInicio', fechaInicio.toISOString());
      params.append('fechaFin', fechaFin.toISOString());

      const response = await fetch(`${API_BASE}/exportar/pdf?${params.toString()}`);
      if (!response.ok) throw new Error('Error al exportar reporte');
      return await response.blob();
    } catch (error) {
      console.error('Error en exportarPDF:', error);
      throw error;
    }
  },

  // Exportar reporte a Excel
  exportarExcel: async (fechaInicio: Date, fechaFin: Date): Promise<Blob> => {
    try {
      const params = new URLSearchParams();
      params.append('fechaInicio', fechaInicio.toISOString());
      params.append('fechaFin', fechaFin.toISOString());

      const response = await fetch(`${API_BASE}/exportar/excel?${params.toString()}`);
      if (!response.ok) throw new Error('Error al exportar reporte');
      return await response.blob();
    } catch (error) {
      console.error('Error en exportarExcel:', error);
      throw error;
    }
  },
};

// Datos mock para desarrollo
const mockReporte: ReportePedidos = {
  periodo: 'Último mes',
  totalVentas: 5000000,
  totalPedidos: 100,
  promedioTicket: 50000,
  productosMasVendidos: [
    {
      productoId: 'prod-1',
      productoNombre: 'Proteína Whey',
      cantidadVendida: 50,
      ingresos: 2500000,
    },
    {
      productoId: 'prod-2',
      productoNombre: 'Creatina',
      cantidadVendida: 30,
      ingresos: 900000,
    },
  ],
  categoriaVentas: [
    {
      categoria: 'Suplementos',
      cantidad: 80,
      ingresos: 4000000,
      porcentaje: 80,
    },
    {
      categoria: 'Ropa',
      cantidad: 20,
      ingresos: 1000000,
      porcentaje: 20,
    },
  ],
  tendencias: [
    {
      fecha: new Date(),
      ventas: 500000,
      pedidos: 10,
    },
  ],
  devoluciones: {
    total: 5,
    monto: 250000,
    porcentaje: 5,
  },
};

