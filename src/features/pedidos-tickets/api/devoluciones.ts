// API para gestión de devoluciones
import { Devolucion } from '../types';

const API_BASE = '/api/ventas/devoluciones';

export const devolucionesApi = {
  // Procesar devolución
  procesarDevolucion: async (devolucion: Omit<Devolucion, 'id' | 'numeroDevolucion' | 'createdAt' | 'updatedAt'>): Promise<Devolucion> => {
    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(devolucion),
      });
      if (!response.ok) throw new Error('Error al procesar devolución');
      return await response.json();
    } catch (error) {
      console.error('Error en procesarDevolucion:', error);
      // Retornar mock
      const nuevaDevolucion: Devolucion = {
        ...devolucion,
        id: `dev-${Date.now()}`,
        numeroDevolucion: `DEV-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return nuevaDevolucion;
    }
  },

  // Obtener devoluciones
  obtenerDevoluciones: async (filtros?: { fechaInicio?: Date; fechaFin?: Date; estado?: Devolucion['estado'] }): Promise<Devolucion[]> => {
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

      const response = await fetch(`${API_BASE}?${params.toString()}`);
      if (!response.ok) throw new Error('Error al obtener devoluciones');
      return await response.json();
    } catch (error) {
      console.error('Error en obtenerDevoluciones:', error);
      return mockDevoluciones;
    }
  },

  // Obtener devolución por ID
  obtenerDevolucion: async (id: string): Promise<Devolucion> => {
    try {
      const response = await fetch(`${API_BASE}/${id}`);
      if (!response.ok) throw new Error('Error al obtener devolución');
      return await response.json();
    } catch (error) {
      console.error('Error en obtenerDevolucion:', error);
      const devolucion = mockDevoluciones.find(d => d.id === id);
      if (!devolucion) throw new Error('Devolución no encontrada');
      return devolucion;
    }
  },

  // Aprobar devolución
  aprobarDevolucion: async (id: string, autorizadoPor: string): Promise<Devolucion> => {
    try {
      const response = await fetch(`${API_BASE}/${id}/aprobar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autorizadoPor }),
      });
      if (!response.ok) throw new Error('Error al aprobar devolución');
      return await response.json();
    } catch (error) {
      console.error('Error en aprobarDevolucion:', error);
      const devolucion = mockDevoluciones.find(d => d.id === id);
      if (!devolucion) throw new Error('Devolución no encontrada');
      return { ...devolucion, estado: 'aprobada', autorizadoPor, updatedAt: new Date() };
    }
  },

  // Rechazar devolución
  rechazarDevolucion: async (id: string, motivo: string): Promise<Devolucion> => {
    try {
      const response = await fetch(`${API_BASE}/${id}/rechazar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ motivo }),
      });
      if (!response.ok) throw new Error('Error al rechazar devolución');
      return await response.json();
    } catch (error) {
      console.error('Error en rechazarDevolucion:', error);
      const devolucion = mockDevoluciones.find(d => d.id === id);
      if (!devolucion) throw new Error('Devolución no encontrada');
      return { ...devolucion, estado: 'rechazada', notas: motivo, updatedAt: new Date() };
    }
  },

  // Completar devolución (procesar reembolso)
  completarDevolucion: async (id: string, procesadoPor: string): Promise<Devolucion> => {
    try {
      const response = await fetch(`${API_BASE}/${id}/completar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ procesadoPor }),
      });
      if (!response.ok) throw new Error('Error al completar devolución');
      return await response.json();
    } catch (error) {
      console.error('Error en completarDevolucion:', error);
      const devolucion = mockDevoluciones.find(d => d.id === id);
      if (!devolucion) throw new Error('Devolución no encontrada');
      return { ...devolucion, estado: 'completada', procesadoPor, updatedAt: new Date() };
    }
  },
};

// Datos mock para desarrollo
const mockDevoluciones: Devolucion[] = [
  {
    id: 'dev-1',
    numeroDevolucion: 'DEV-001',
    ticketId: 'tick-1',
    numeroTicket: 'TICK-001',
    pedidoId: 'ped-1',
    fecha: new Date(),
    motivo: 'Producto defectuoso',
    estado: 'pendiente',
    items: [
      {
        id: 'item-1',
        productoId: 'prod-1',
        productoNombre: 'Proteína Whey',
        cantidad: 1,
        precioUnitario: 50000,
        motivo: 'Producto defectuoso',
        estado: 'defectuoso',
        reembolsoAprobado: true,
      },
    ],
    montoTotal: 50000,
    metodoReembolso: 'tarjeta_original',
    productosEstado: 'defectuoso',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

