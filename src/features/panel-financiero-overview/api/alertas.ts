// API service para Alertas de Pagos
// En producción, estas llamadas se harían a un backend real

import { AlertaPago, ClientePagoPendiente } from '../types';

const API_BASE_URL = '/api/finanzas';

// Mock delay para simular llamadas API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const alertasApi = {
  // Obtener todas las alertas
  async obtenerAlertas(): Promise<AlertaPago[]> {
    await delay(500);
    
    const hoy = new Date();
    const addDays = (days: number) => {
      const fecha = new Date(hoy);
      fecha.setDate(fecha.getDate() + days);
      return fecha.toISOString().split('T')[0];
    };
    
    return [
      {
        id: '1',
        tipo: 'vencido',
        cliente: 'Juan Pérez',
        monto: 150,
        fecha: addDays(-15),
        prioridad: 'alta'
      },
      {
        id: '2',
        tipo: 'por_vencer',
        cliente: 'María González',
        monto: 200,
        fecha: addDays(2),
        prioridad: 'media'
      },
      {
        id: '3',
        tipo: 'recordatorio',
        cliente: 'Carlos Ruiz',
        monto: 100,
        fecha: addDays(5),
        prioridad: 'baja'
      },
      {
        id: '4',
        tipo: 'vencido',
        cliente: 'Ana Martínez',
        monto: 250,
        fecha: addDays(-8),
        prioridad: 'alta'
      },
      {
        id: '5',
        tipo: 'vencido',
        cliente: 'Luis García',
        monto: 180,
        fecha: addDays(-22),
        prioridad: 'alta'
      },
      {
        id: '6',
        tipo: 'por_vencer',
        cliente: 'Sofia López',
        monto: 300,
        fecha: addDays(1),
        prioridad: 'media'
      },
    ];
  },

  // Obtener clientes con pagos pendientes
  async obtenerClientesPendientes(): Promise<ClientePagoPendiente[]> {
    await delay(500);
    
    const hoy = new Date();
    const addDays = (days: number) => {
      const fecha = new Date(hoy);
      fecha.setDate(fecha.getDate() + days);
      return fecha.toISOString().split('T')[0];
    };
    
    return [
      {
        id: '1',
        nombre: 'Juan Pérez',
        servicio: 'Sesión PT',
        monto: 150,
        diasVencidos: 15,
        fechaVencimiento: addDays(-15),
        riesgo: 'alto'
      },
      {
        id: '2',
        nombre: 'María González',
        servicio: 'Paquete 10 sesiones',
        monto: 200,
        diasVencidos: 5,
        fechaVencimiento: addDays(-5),
        riesgo: 'medio'
      },
      {
        id: '3',
        nombre: 'Ana Martínez',
        servicio: 'Consulta Online',
        monto: 250,
        diasVencidos: 8,
        fechaVencimiento: addDays(-8),
        riesgo: 'alto'
      },
      {
        id: '4',
        nombre: 'Luis García',
        servicio: 'Membresía Mensual',
        monto: 80,
        diasVencidos: 22,
        fechaVencimiento: addDays(-22),
        riesgo: 'alto'
      },
      {
        id: '5',
        nombre: 'Roberto Martín',
        servicio: 'Clases Grupales',
        monto: 90,
        diasVencidos: 3,
        fechaVencimiento: addDays(-3),
        riesgo: 'bajo'
      },
    ];
  },

  // Marcar alerta como resuelta
  async resolverAlerta(id: string): Promise<void> {
    await delay(300);
    // En producción: POST ${API_BASE_URL}/alertas/${id}/resolver
    // throw new Error('Not implemented');
  },

  // Enviar recordatorio
  async enviarRecordatorio(clienteId: string): Promise<void> {
    await delay(400);
    // En producción: POST ${API_BASE_URL}/alertas/recordatorio
    // throw new Error('Not implemented');
  },
};

