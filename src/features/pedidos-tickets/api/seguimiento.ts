// API para seguimiento de ventas
import { SeguimientoVenta } from '../types';

const API_BASE = '/api/ventas/seguimiento';

export const seguimientoApi = {
  // Obtener seguimiento de ventas
  obtenerSeguimiento: async (fechaInicio?: Date, fechaFin?: Date): Promise<SeguimientoVenta[]> => {
    try {
      const params = new URLSearchParams();
      if (fechaInicio) {
        params.append('fechaInicio', fechaInicio.toISOString());
      }
      if (fechaFin) {
        params.append('fechaFin', fechaFin.toISOString());
      }

      const response = await fetch(`${API_BASE}?${params.toString()}`);
      if (!response.ok) throw new Error('Error al obtener seguimiento');
      return await response.json();
    } catch (error) {
      console.error('Error en obtenerSeguimiento:', error);
      return mockSeguimiento;
    }
  },

  // Obtener resumen de ventas
  obtenerResumen: async (periodo: 'dia' | 'semana' | 'mes' | 'año'): Promise<SeguimientoVenta> => {
    try {
      const response = await fetch(`${API_BASE}/resumen?periodo=${periodo}`);
      if (!response.ok) throw new Error('Error al obtener resumen');
      return await response.json();
    } catch (error) {
      console.error('Error en obtenerResumen:', error);
      return mockSeguimiento[0];
    }
  },
};

// Datos mock para desarrollo
const mockSeguimiento: SeguimientoVenta[] = [
  {
    fecha: new Date(),
    totalVentas: 500000,
    cantidadPedidos: 10,
    promedioTicket: 50000,
    productosVendidos: 25,
    metodoPago: {
      efectivo: 200000,
      tarjeta: 250000,
      transferencia: 30000,
      credito: 20000,
    },
  },
];

