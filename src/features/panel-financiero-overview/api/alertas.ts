/**
 * API service para Alertas de Pagos
 * 
 * Este módulo proporciona funciones mock para la gestión de alertas de pagos:
 * - Alertas de pagos vencidos
 * - Alertas de pagos por vencer
 * - Recordatorios de pagos
 * 
 * Los datos mock generados alimentan:
 * - El componente AlertasPagos.tsx para visualización de alertas
 * - El resumen ejecutivo del panel financiero
 * 
 * En producción, estas llamadas se harían a un backend real
 */

import { 
  AlertaPago, 
  ClientePagoPendiente, 
  RolFinanciero,
  FiltrosAlertasPagos,
  FiltrosClientesPagosPendientes,
  NivelRiesgoPago,
  TipoAlertaPago,
  OrigenPago
} from '../types';

const API_BASE_URL = '/api/finanzas';

// Mock delay para simular llamadas API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Estado mock para alertas leídas (en producción sería persistido en backend)
const alertasLeidas = new Set<string>();

/**
 * Calcula los días de retraso desde una fecha de vencimiento
 */
const calcularDiasRetraso = (fechaVencimiento: string): number => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fecha = new Date(fechaVencimiento);
  fecha.setHours(0, 0, 0, 0);
  const diffTime = hoy.getTime() - fecha.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Determina el nivel de riesgo basado en días de retraso y monto
 */
const determinarNivelRiesgo = (diasRetraso: number, monto: number): NivelRiesgoPago => {
  if (diasRetraso > 30 || monto > 500) return 'alto';
  if (diasRetraso > 15 || monto > 200) return 'medio';
  return 'bajo';
};

/**
 * Determina la prioridad de una alerta basada en tipo y días de retraso
 */
const determinarPrioridad = (tipo: TipoAlertaPago, diasRetraso: number): 'alta' | 'media' | 'baja' => {
  if (tipo === 'vencido') {
    if (diasRetraso > 20) return 'alta';
    if (diasRetraso > 7) return 'media';
    return 'alta'; // Siempre alta si está vencido
  }
  if (tipo === 'por_vencer') {
    if (diasRetraso < -5) return 'media';
    return 'alta'; // Urgente si vence pronto
  }
  return 'baja'; // Recordatorios son baja prioridad
};

/**
 * Genera datos mock de clientes con pagos pendientes
 * Incluye distintos niveles de riesgo, fechas de vencimiento y días de retraso
 */
const generarClientesMock = (): ClientePagoPendiente[] => {
  const hoy = new Date();
  const addDays = (days: number): string => {
    const fecha = new Date(hoy);
    fecha.setDate(fecha.getDate() + days);
    return fecha.toISOString().split('T')[0];
  };

  return [
    // Clientes con riesgo ALTO - Pagos muy vencidos o montos altos
    {
      clienteId: 'cliente-001',
      nombreCliente: 'Juan Pérez',
      importePendiente: 450,
      fechaVencimiento: addDays(-35),
      diasRetraso: 35,
      nivelRiesgo: 'alto',
      origen: 'cuota',
      // Campos legacy para compatibilidad
      id: 'cliente-001',
      nombre: 'Juan Pérez',
      servicio: 'Membresía Premium',
      monto: 450,
      diasVencidos: 35,
      fecha: addDays(-35),
      riesgo: 'alto'
    },
    {
      clienteId: 'cliente-002',
      nombreCliente: 'Ana Martínez',
      importePendiente: 680,
      fechaVencimiento: addDays(-28),
      diasRetraso: 28,
      nivelRiesgo: 'alto',
      origen: 'bono',
      id: 'cliente-002',
      nombre: 'Ana Martínez',
      servicio: 'Paquete 20 sesiones PT',
      monto: 680,
      diasVencidos: 28,
      fecha: addDays(-28),
      riesgo: 'alto'
    },
    {
      clienteId: 'cliente-003',
      nombreCliente: 'Luis García',
      importePendiente: 320,
      fechaVencimiento: addDays(-42),
      diasRetraso: 42,
      nivelRiesgo: 'alto',
      origen: 'cuota',
      id: 'cliente-003',
      nombre: 'Luis García',
      servicio: 'Membresía Mensual',
      monto: 320,
      diasVencidos: 42,
      fecha: addDays(-42),
      riesgo: 'alto'
    },
    {
      clienteId: 'cliente-004',
      nombreCliente: 'Carmen Rodríguez',
      importePendiente: 850,
      fechaVencimiento: addDays(-18),
      diasRetraso: 18,
      nivelRiesgo: 'alto',
      origen: 'bono',
      id: 'cliente-004',
      nombre: 'Carmen Rodríguez',
      servicio: 'Bono Anual',
      monto: 850,
      diasVencidos: 18,
      fecha: addDays(-18),
      riesgo: 'alto'
    },
    
    // Clientes con riesgo MEDIO - Pagos moderadamente vencidos
    {
      clienteId: 'cliente-005',
      nombreCliente: 'María González',
      importePendiente: 180,
      fechaVencimiento: addDays(-12),
      diasRetraso: 12,
      nivelRiesgo: 'medio',
      origen: 'sesion',
      id: 'cliente-005',
      nombre: 'María González',
      servicio: 'Sesión PT Individual',
      monto: 180,
      diasVencidos: 12,
      fecha: addDays(-12),
      riesgo: 'medio'
    },
    {
      clienteId: 'cliente-006',
      nombreCliente: 'Roberto Martín',
      importePendiente: 220,
      fechaVencimiento: addDays(-9),
      diasRetraso: 9,
      nivelRiesgo: 'medio',
      origen: 'cuota',
      id: 'cliente-006',
      nombre: 'Roberto Martín',
      servicio: 'Cuota Mensual',
      monto: 220,
      diasVencidos: 9,
      fecha: addDays(-9),
      riesgo: 'medio'
    },
    {
      clienteId: 'cliente-007',
      nombreCliente: 'Sofia López',
      importePendiente: 150,
      fechaVencimiento: addDays(-6),
      diasRetraso: 6,
      nivelRiesgo: 'medio',
      origen: 'sesion',
      id: 'cliente-007',
      nombre: 'Sofia López',
      servicio: 'Paquete 5 sesiones',
      monto: 150,
      diasVencidos: 6,
      fecha: addDays(-6),
      riesgo: 'medio'
    },
    {
      clienteId: 'cliente-008',
      nombreCliente: 'David Sánchez',
      importePendiente: 195,
      fechaVencimiento: addDays(-16),
      diasRetraso: 16,
      nivelRiesgo: 'medio',
      origen: 'cuota',
      id: 'cliente-008',
      nombre: 'David Sánchez',
      servicio: 'Membresía Básica',
      monto: 195,
      diasVencidos: 16,
      fecha: addDays(-16),
      riesgo: 'medio'
    },
    
    // Clientes con riesgo BAJO - Pagos recientemente vencidos o por vencer
    {
      clienteId: 'cliente-009',
      nombreCliente: 'Carlos Ruiz',
      importePendiente: 90,
      fechaVencimiento: addDays(-3),
      diasRetraso: 3,
      nivelRiesgo: 'bajo',
      origen: 'sesion',
      id: 'cliente-009',
      nombre: 'Carlos Ruiz',
      servicio: 'Consulta Online',
      monto: 90,
      diasVencidos: 3,
      fecha: addDays(-3),
      riesgo: 'bajo'
    },
    {
      clienteId: 'cliente-010',
      nombreCliente: 'Laura Fernández',
      importePendiente: 120,
      fechaVencimiento: addDays(-1),
      diasRetraso: 1,
      nivelRiesgo: 'bajo',
      origen: 'cuota',
      id: 'cliente-010',
      nombre: 'Laura Fernández',
      servicio: 'Cuota Semanal',
      monto: 120,
      diasVencidos: 1,
      fecha: addDays(-1),
      riesgo: 'bajo'
    },
    {
      clienteId: 'cliente-011',
      nombreCliente: 'Miguel Torres',
      importePendiente: 75,
      fechaVencimiento: addDays(2),
      diasRetraso: -2,
      nivelRiesgo: 'bajo',
      origen: 'sesion',
      id: 'cliente-011',
      nombre: 'Miguel Torres',
      servicio: 'Sesión PT',
      monto: 75,
      diasVencidos: 0,
      fecha: addDays(2),
      riesgo: 'bajo'
    },
    {
      clienteId: 'cliente-012',
      nombreCliente: 'Elena Moreno',
      importePendiente: 140,
      fechaVencimiento: addDays(5),
      diasRetraso: -5,
      nivelRiesgo: 'bajo',
      origen: 'cuota',
      id: 'cliente-012',
      nombre: 'Elena Moreno',
      servicio: 'Membresía Mensual',
      monto: 140,
      diasVencidos: 0,
      fecha: addDays(5),
      riesgo: 'bajo'
    },
    {
      clienteId: 'cliente-013',
      nombreCliente: 'Pedro Jiménez',
      importePendiente: 110,
      fechaVencimiento: addDays(1),
      diasRetraso: -1,
      nivelRiesgo: 'bajo',
      origen: 'sesion',
      id: 'cliente-013',
      nombre: 'Pedro Jiménez',
      servicio: 'Paquete 3 sesiones',
      monto: 110,
      diasVencidos: 0,
      fecha: addDays(1),
      riesgo: 'bajo'
    },
    {
      clienteId: 'cliente-014',
      nombreCliente: 'Isabel Díaz',
      importePendiente: 95,
      fechaVencimiento: addDays(7),
      diasRetraso: -7,
      nivelRiesgo: 'bajo',
      origen: 'otro',
      id: 'cliente-014',
      nombre: 'Isabel Díaz',
      servicio: 'Servicio Adicional',
      monto: 95,
      diasVencidos: 0,
      fecha: addDays(7),
      riesgo: 'bajo'
    }
  ];
};

/**
 * Genera alertas mock basadas en los clientes con pagos pendientes
 * Incluye alertas vencidas, por vencer y recordatorios
 */
const generarAlertasMock = (): AlertaPago[] => {
  const clientes = generarClientesMock();
  const alertas: AlertaPago[] = [];
  const hoy = new Date();
  const addDays = (days: number): string => {
    const fecha = new Date(hoy);
    fecha.setDate(fecha.getDate() + days);
    return fecha.toISOString().split('T')[0];
  };

  clientes.forEach((cliente, index) => {
    const diasRetraso = cliente.diasRetraso || calcularDiasRetraso(cliente.fechaVencimiento);
    
    // Generar alerta vencida si tiene días de retraso positivos
    if (diasRetraso > 0) {
      alertas.push({
        id: `alerta-vencido-${index + 1}`,
        tipo: 'vencido',
        cliente: cliente.nombreCliente,
        prioridad: determinarPrioridad('vencido', diasRetraso),
        mensaje: `Pago vencido hace ${diasRetraso} día${diasRetraso > 1 ? 's' : ''}`,
        fechaCreacion: addDays(-diasRetraso),
        leida: alertasLeidas.has(`alerta-vencido-${index + 1}`),
        // Campos legacy
        monto: cliente.importePendiente,
        fecha: cliente.fechaVencimiento
      });
    }
    
    // Generar alerta por vencer si vence en los próximos 7 días
    if (diasRetraso <= 0 && diasRetraso >= -7) {
      alertas.push({
        id: `alerta-por-vencer-${index + 1}`,
        tipo: 'por_vencer',
        cliente: cliente.nombreCliente,
        prioridad: determinarPrioridad('por_vencer', diasRetraso),
        mensaje: `Pago vence en ${Math.abs(diasRetraso)} día${Math.abs(diasRetraso) > 1 ? 's' : ''}`,
        fechaCreacion: addDays(-5),
        leida: alertasLeidas.has(`alerta-por-vencer-${index + 1}`),
        // Campos legacy
        monto: cliente.importePendiente,
        fecha: cliente.fechaVencimiento
      });
    }
    
    // Generar recordatorio para pagos que vencen en 7-14 días
    if (diasRetraso < -7 && diasRetraso >= -14) {
      alertas.push({
        id: `alerta-recordatorio-${index + 1}`,
        tipo: 'recordatorio',
        cliente: cliente.nombreCliente,
        prioridad: determinarPrioridad('recordatorio', diasRetraso),
        mensaje: `Recordatorio: Pago próximo a vencer`,
        fechaCreacion: addDays(-3),
        leida: alertasLeidas.has(`alerta-recordatorio-${index + 1}`),
        // Campos legacy
        monto: cliente.importePendiente,
        fecha: cliente.fechaVencimiento
      });
    }
  });

  return alertas;
};

/**
 * Obtiene las alertas de pagos con filtros opcionales
 * 
 * Esta función alimenta:
 * - El componente AlertasPagos.tsx para visualización de alertas
 * - El resumen ejecutivo del panel financiero
 * 
 * @param filtros - Filtros opcionales para personalizar la búsqueda
 * @returns Promise con array de alertas de pagos
 */
export const getAlertasPagos = async (
  filtros?: FiltrosAlertasPagos
): Promise<AlertaPago[]> => {
  await delay(500);
  
  let alertas = generarAlertasMock();
  
  // Aplicar filtros
  if (filtros) {
    if (filtros.tipo) {
      alertas = alertas.filter(a => a.tipo === filtros.tipo);
    }
    
    if (filtros.prioridad) {
      alertas = alertas.filter(a => a.prioridad === filtros.prioridad);
    }
    
    if (filtros.soloNoLeidas) {
      alertas = alertas.filter(a => !a.leida);
    }
    
    if (filtros.clienteId) {
      alertas = alertas.filter(a => {
        const clienteNombre = typeof a.cliente === 'string' 
          ? a.cliente 
          : a.cliente.nombreCliente;
        return clienteNombre.toLowerCase().includes(filtros.clienteId!.toLowerCase());
      });
    }
    
    if (filtros.fechaInicio || filtros.fechaFin) {
      alertas = alertas.filter(a => {
        const fechaAlerta = a.fecha || a.fechaCreacion || '';
        if (filtros.fechaInicio && fechaAlerta < filtros.fechaInicio) return false;
        if (filtros.fechaFin && fechaAlerta > filtros.fechaFin) return false;
        return true;
      });
    }
  }
  
  // Ordenar por prioridad y fecha (más urgentes primero)
  alertas.sort((a, b) => {
    const prioridadOrden = { alta: 3, media: 2, baja: 1 };
    if (prioridadOrden[b.prioridad] !== prioridadOrden[a.prioridad]) {
      return prioridadOrden[b.prioridad] - prioridadOrden[a.prioridad];
    }
    const fechaA = a.fecha || a.fechaCreacion || '';
    const fechaB = b.fecha || b.fechaCreacion || '';
    return fechaA.localeCompare(fechaB);
  });
  
  return alertas;
};

/**
 * Marca una alerta como leída
 * 
 * @param id - ID de la alerta a marcar como leída
 * @returns Promise que se resuelve cuando la alerta ha sido marcada
 */
export const marcarAlertaComoLeida = async (id: string): Promise<void> => {
  await delay(300);
  
  // En producción: POST ${API_BASE_URL}/alertas/${id}/marcar-leida
  alertasLeidas.add(id);
  
  // En producción, aquí se haría la llamada al backend
  // await fetch(`${API_BASE_URL}/alertas/${id}/marcar-leida`, { method: 'POST' });
};

/**
 * Obtiene clientes con pagos pendientes filtrados por rol y filtros opcionales
 * 
 * Esta función alimenta:
 * - El componente AlertasPagos.tsx para visualización de clientes pendientes
 * - El resumen ejecutivo del panel financiero
 * 
 * @param rol - Rol financiero del usuario (entrenador o gimnasio)
 * @param filtros - Filtros opcionales para personalizar la búsqueda
 * @returns Promise con array de clientes con pagos pendientes
 */
export const getClientesConPagosPendientes = async (
  rol: RolFinanciero,
  filtros?: FiltrosClientesPagosPendientes
): Promise<ClientePagoPendiente[]> => {
  await delay(500);
  
  let clientes = generarClientesMock();
  
  // Aplicar filtros
  if (filtros) {
    if (filtros.nivelRiesgo) {
      clientes = clientes.filter(c => c.nivelRiesgo === filtros.nivelRiesgo);
    }
    
    if (filtros.origen) {
      clientes = clientes.filter(c => c.origen === filtros.origen);
    }
    
    if (filtros.fechaVencimientoDesde || filtros.fechaVencimientoHasta) {
      clientes = clientes.filter(c => {
        if (filtros.fechaVencimientoDesde && c.fechaVencimiento < filtros.fechaVencimientoDesde) {
          return false;
        }
        if (filtros.fechaVencimientoHasta && c.fechaVencimiento > filtros.fechaVencimientoHasta) {
          return false;
        }
        return true;
      });
    }
    
    if (filtros.diasRetrasoMinimo !== undefined || filtros.diasRetrasoMaximo !== undefined) {
      clientes = clientes.filter(c => {
        const diasRetraso = c.diasRetraso || calcularDiasRetraso(c.fechaVencimiento);
        if (filtros.diasRetrasoMinimo !== undefined && diasRetraso < filtros.diasRetrasoMinimo) {
          return false;
        }
        if (filtros.diasRetrasoMaximo !== undefined && diasRetraso > filtros.diasRetrasoMaximo) {
          return false;
        }
        return true;
      });
    }
    
    if (filtros.montoMinimo !== undefined || filtros.montoMaximo !== undefined) {
      clientes = clientes.filter(c => {
        const monto = c.importePendiente || c.monto || 0;
        if (filtros.montoMinimo !== undefined && monto < filtros.montoMinimo) {
          return false;
        }
        if (filtros.montoMaximo !== undefined && monto > filtros.montoMaximo) {
          return false;
        }
        return true;
      });
    }
  }
  
  // Ordenar por nivel de riesgo y días de retraso (más críticos primero)
  clientes.sort((a, b) => {
    const riesgoOrden = { alto: 3, medio: 2, bajo: 1 };
    if (riesgoOrden[b.nivelRiesgo] !== riesgoOrden[a.nivelRiesgo]) {
      return riesgoOrden[b.nivelRiesgo] - riesgoOrden[a.nivelRiesgo];
    }
    const diasA = a.diasRetraso || calcularDiasRetraso(a.fechaVencimiento);
    const diasB = b.diasRetraso || calcularDiasRetraso(b.fechaVencimiento);
    return diasB - diasA;
  });
  
  return clientes;
};

// ============================================================================
// API LEGACY (Compatibilidad hacia atrás)
// ============================================================================

/**
 * @deprecated Usar getAlertasPagos en su lugar
 * Mantenido para compatibilidad con código existente
 */
export const alertasApi = {
  async obtenerAlertas(): Promise<AlertaPago[]> {
    return getAlertasPagos();
  },

  async obtenerClientesPendientes(): Promise<ClientePagoPendiente[]> {
    return getClientesConPagosPendientes('entrenador');
  },

  async resolverAlerta(id: string): Promise<void> {
    await delay(300);
    // En producción: POST ${API_BASE_URL}/alertas/${id}/resolver
  },

  async enviarRecordatorio(clienteId: string): Promise<void> {
    await delay(400);
    // En producción: POST ${API_BASE_URL}/alertas/recordatorio
  },
};
