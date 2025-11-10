// API service para Alertas de Pagos
// En producción, estas llamadas se harían a un backend real

import { AlertaPago, ClientePagoPendiente, HistorialGestionPago } from '../types';

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
        riesgo: 'alto',
        email: 'juan.perez@example.com',
        telefono: '+34600123456',
        clienteId: 'cliente-1',
        estado: 'en_gestion',
        notas: 'Cliente contactado, prometió pagar esta semana',
        historial: [
          {
            id: 'h1',
            fecha: addDays(-2),
            usuario: 'Entrenador',
            accion: 'Estado cambiado',
            estadoAnterior: 'pendiente',
            estadoNuevo: 'en_gestion',
            notas: 'Cliente contactado vía WhatsApp'
          }
        ]
      },
      {
        id: '2',
        nombre: 'María González',
        servicio: 'Paquete 10 sesiones',
        monto: 200,
        diasVencidos: 5,
        fechaVencimiento: addDays(-5),
        riesgo: 'medio',
        email: 'maria.gonzalez@example.com',
        telefono: '+34600123457',
        clienteId: 'cliente-2',
        estado: 'pendiente',
        notas: '',
        historial: []
      },
      {
        id: '3',
        nombre: 'Ana Martínez',
        servicio: 'Consulta Online',
        monto: 250,
        diasVencidos: 8,
        fechaVencimiento: addDays(-8),
        riesgo: 'alto',
        email: 'ana.martinez@example.com',
        telefono: '+34600123458',
        clienteId: 'cliente-3',
        estado: 'pendiente',
        notas: '',
        historial: []
      },
      {
        id: '4',
        nombre: 'Luis García',
        servicio: 'Membresía Mensual',
        monto: 80,
        diasVencidos: 22,
        fechaVencimiento: addDays(-22),
        riesgo: 'alto',
        email: 'luis.garcia@example.com',
        telefono: '+34600123459',
        clienteId: 'cliente-4',
        estado: 'resuelto',
        notas: 'Pago recibido el 15/01/2024',
        historial: [
          {
            id: 'h2',
            fecha: addDays(-7),
            usuario: 'Entrenador',
            accion: 'Estado cambiado',
            estadoAnterior: 'en_gestion',
            estadoNuevo: 'resuelto',
            notas: 'Pago recibido y confirmado'
          }
        ]
      },
      {
        id: '5',
        nombre: 'Roberto Martín',
        servicio: 'Clases Grupales',
        monto: 90,
        diasVencidos: 3,
        fechaVencimiento: addDays(-3),
        riesgo: 'bajo',
        email: 'roberto.martin@example.com',
        telefono: '+34600123460',
        clienteId: 'cliente-5',
        estado: 'pendiente',
        notas: '',
        historial: []
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

  // Actualizar estado de pago pendiente
  async actualizarEstadoPago(
    id: string, 
    estado: 'pendiente' | 'en_gestion' | 'resuelto' | 'cancelado',
    notas?: string
  ): Promise<ClientePagoPendiente> {
    await delay(300);
    // En producción: PATCH ${API_BASE_URL}/pagos-pendientes/${id}
    // return await fetch(...).then(res => res.json());
    
    // Mock: retornar el pago actualizado
    const pendientes = await this.obtenerClientesPendientes();
    const pago = pendientes.find(p => p.id === id);
    if (!pago) throw new Error('Pago no encontrado');
    
    const estadoAnterior = pago.estado || 'pendiente';
    const nuevoHistorial: HistorialGestionPago = {
      id: `h${Date.now()}`,
      fecha: new Date().toISOString().split('T')[0],
      usuario: 'Entrenador',
      accion: 'Estado cambiado',
      estadoAnterior,
      estadoNuevo: estado,
      notas: notas || undefined
    };
    
    return {
      ...pago,
      estado,
      notas: notas || pago.notas,
      historial: [...(pago.historial || []), nuevoHistorial]
    };
  },

  // Actualizar notas de pago pendiente
  async actualizarNotasPago(id: string, notas: string): Promise<ClientePagoPendiente> {
    await delay(300);
    // En producción: PATCH ${API_BASE_URL}/pagos-pendientes/${id}/notas
    // return await fetch(...).then(res => res.json());
    
    const pendientes = await this.obtenerClientesPendientes();
    const pago = pendientes.find(p => p.id === id);
    if (!pago) throw new Error('Pago no encontrado');
    
    const nuevoHistorial: HistorialGestionPago = {
      id: `h${Date.now()}`,
      fecha: new Date().toISOString().split('T')[0],
      usuario: 'Entrenador',
      accion: 'Notas actualizadas',
      notas
    };
    
    return {
      ...pago,
      notas,
      historial: [...(pago.historial || []), nuevoHistorial]
    };
  },

  // Obtener historial de gestión de pago
  async obtenerHistorialPago(id: string): Promise<HistorialGestionPago[]> {
    await delay(200);
    // En producción: GET ${API_BASE_URL}/pagos-pendientes/${id}/historial
    // return await fetch(...).then(res => res.json());
    
    const pendientes = await this.obtenerClientesPendientes();
    const pago = pendientes.find(p => p.id === id);
    return pago?.historial || [];
  },
};

