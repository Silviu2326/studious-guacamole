// API para gestión de pedidos
import { Pedido, FiltroPedidos } from '../types';

const API_BASE = '/api/ventas/pedidos';

export const pedidosApi = {
  // Obtener lista de pedidos
  obtenerPedidos: async (filtros?: FiltroPedidos): Promise<Pedido[]> => {
    try {
      const params = new URLSearchParams();
      if (filtros?.fechaInicio) {
        params.append('fechaInicio', filtros.fechaInicio.toISOString());
      }
      if (filtros?.fechaFin) {
        params.append('fechaFin', filtros.fechaFin.toISOString());
      }
      if (filtros?.estado) {
        params.append('estado', filtros.estado);
      }
      if (filtros?.metodoPago) {
        params.append('metodoPago', filtros.metodoPago);
      }
      if (filtros?.clienteId) {
        params.append('clienteId', filtros.clienteId);
      }
      if (filtros?.buscar) {
        params.append('buscar', filtros.buscar);
      }

      const response = await fetch(`${API_BASE}?${params.toString()}`);
      if (!response.ok) throw new Error('Error al obtener pedidos');
      return await response.json();
    } catch (error) {
      console.error('Error en obtenerPedidos:', error);
      // Retornar datos mock para desarrollo
      return mockPedidos;
    }
  },

  // Obtener pedido por ID
  obtenerPedido: async (id: string): Promise<Pedido> => {
    try {
      const response = await fetch(`${API_BASE}/${id}`);
      if (!response.ok) throw new Error('Error al obtener pedido');
      return await response.json();
    } catch (error) {
      console.error('Error en obtenerPedido:', error);
      const pedido = mockPedidos.find(p => p.id === id);
      if (!pedido) throw new Error('Pedido no encontrado');
      return pedido;
    }
  },

  // Crear nuevo pedido
  crearPedido: async (pedido: Omit<Pedido, 'id' | 'numeroPedido' | 'createdAt' | 'updatedAt'>): Promise<Pedido> => {
    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido),
      });
      if (!response.ok) throw new Error('Error al crear pedido');
      return await response.json();
    } catch (error) {
      console.error('Error en crearPedido:', error);
      // Retornar mock
      const nuevoPedido: Pedido = {
        ...pedido,
        id: `ped-${Date.now()}`,
        numeroPedido: `PED-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return nuevoPedido;
    }
  },

  // Actualizar pedido
  actualizarPedido: async (id: string, pedido: Partial<Pedido>): Promise<Pedido> => {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido),
      });
      if (!response.ok) throw new Error('Error al actualizar pedido');
      return await response.json();
    } catch (error) {
      console.error('Error en actualizarPedido:', error);
      const pedidoExistente = mockPedidos.find(p => p.id === id);
      if (!pedidoExistente) throw new Error('Pedido no encontrado');
      return { ...pedidoExistente, ...pedido, updatedAt: new Date() };
    }
  },

  // Cancelar pedido
  cancelarPedido: async (id: string, motivo?: string): Promise<Pedido> => {
    try {
      const response = await fetch(`${API_BASE}/${id}/cancelar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ motivo }),
      });
      if (!response.ok) throw new Error('Error al cancelar pedido');
      return await response.json();
    } catch (error) {
      console.error('Error en cancelarPedido:', error);
      const pedido = mockPedidos.find(p => p.id === id);
      if (!pedido) throw new Error('Pedido no encontrado');
      return { ...pedido, estado: 'cancelado', updatedAt: new Date() };
    }
  },
};

// Datos mock para desarrollo
const mockPedidos: Pedido[] = [
  {
    id: 'ped-1',
    numeroPedido: 'PED-001',
    clienteId: 'cli-1',
    clienteNombre: 'Juan Pérez',
    fecha: new Date(),
    estado: 'completado',
    items: [
      {
        id: 'item-1',
        productoId: 'prod-1',
        productoNombre: 'Proteína Whey',
        cantidad: 2,
        precioUnitario: 50000,
        subtotal: 100000,
      },
    ],
    subtotal: 100000,
    descuento: 0,
    total: 100000,
    metodoPago: 'tarjeta',
    ticketId: 'tick-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

