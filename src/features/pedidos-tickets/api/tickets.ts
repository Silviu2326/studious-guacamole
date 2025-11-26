// API para gestión de tickets
import { Ticket, FiltroTickets } from '../types';

const API_BASE = '/api/ventas/tickets';

export const ticketsApi = {
  // Obtener historico de tickets
  obtenerTickets: async (filtros?: FiltroTickets): Promise<Ticket[]> => {
    try {
      const params = new URLSearchParams();
      if (filtros?.fechaInicio) {
        params.append('fechaInicio', filtros.fechaInicio.toISOString());
      }
      if (filtros?.fechaFin) {
        params.append('fechaFin', filtros.fechaFin.toISOString());
      }
      if (filtros?.tipo) {
        params.append('tipo', filtros.tipo);
      }
      if (filtros?.impreso !== undefined) {
        params.append('impreso', filtros.impreso.toString());
      }
      if (filtros?.buscar) {
        params.append('buscar', filtros.buscar);
      }

      const response = await fetch(`${API_BASE}?${params.toString()}`);
      if (!response.ok) throw new Error('Error al obtener tickets');
      return await response.json();
    } catch (error) {
      console.error('Error en obtenerTickets:', error);
      return mockTickets;
    }
  },

  // Obtener ticket por ID
  obtenerTicket: async (id: string): Promise<Ticket> => {
    try {
      const response = await fetch(`${API_BASE}/${id}`);
      if (!response.ok) throw new Error('Error al obtener ticket');
      return await response.json();
    } catch (error) {
      console.error('Error en obtenerTicket:', error);
      const ticket = mockTickets.find(t => t.id === id);
      if (!ticket) throw new Error('Ticket no encontrado');
      return ticket;
    }
  },

  // Generar ticket físico
  generarTicket: async (pedidoId: string): Promise<Ticket> => {
    try {
      const response = await fetch(`${API_BASE}/generar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pedidoId }),
      });
      if (!response.ok) throw new Error('Error al generar ticket');
      return await response.json();
    } catch (error) {
      console.error('Error en generarTicket:', error);
      // Retornar mock
      return {
        id: `tick-${Date.now()}`,
        numeroTicket: `TICK-${Date.now()}`,
        pedidoId,
        tipo: 'venta',
        fecha: new Date(),
        montoTotal: 100000,
        metodoPago: 'tarjeta',
        items: [],
        impreso: false,
        usuarioId: 'user-1',
        usuarioNombre: 'Usuario Sistema',
        createdAt: new Date(),
      };
    }
  },

  // Imprimir ticket
  imprimirTicket: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE}/${id}/imprimir`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Error al imprimir ticket');
    } catch (error) {
      console.error('Error en imprimirTicket:', error);
      // En desarrollo, solo marcamos como impreso
    }
  },

  // Exportar tickets
  exportarTickets: async (filtros?: FiltroTickets): Promise<Blob> => {
    try {
      const params = new URLSearchParams();
      if (filtros?.fechaInicio) {
        params.append('fechaInicio', filtros.fechaInicio.toISOString());
      }
      if (filtros?.fechaFin) {
        params.append('fechaFin', filtros.fechaFin.toISOString());
      }
      if (filtros?.tipo) {
        params.append('tipo', filtros.tipo);
      }

      const response = await fetch(`${API_BASE}/exportar?${params.toString()}`);
      if (!response.ok) throw new Error('Error al exportar tickets');
      return await response.blob();
    } catch (error) {
      console.error('Error en exportarTickets:', error);
      throw error;
    }
  },
};

// Datos mock para desarrollo
const mockTickets: Ticket[] = [
  {
    id: 'tick-1',
    numeroTicket: 'TICK-001',
    pedidoId: 'ped-1',
    tipo: 'venta',
    fecha: new Date(),
    montoTotal: 100000,
    metodoPago: 'tarjeta',
    items: [
      {
        id: 'item-1',
        descripcion: 'Proteína Whey',
        cantidad: 2,
        precioUnitario: 50000,
        subtotal: 100000,
      },
    ],
    impreso: true,
    fechaImpresion: new Date(),
    usuarioId: 'user-1',
    usuarioNombre: 'Juan Pérez',
    createdAt: new Date(),
  },
];

