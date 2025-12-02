import { Factura, EstadoFactura } from '../types';
import { facturasAPI } from '../api/facturas';

export interface PaymentStatus {
  hasPendingPayments: boolean;
  hasOverdueInvoices: boolean;
  pendingCount: number;
  overdueCount: number;
  totalPendingAmount: number;
  totalOverdueAmount: number;
  oldestOverdueDays: number | null; // Días desde la factura más antigua vencida
  severity: 'none' | 'warning' | 'danger' | 'critical'; // Severidad basada en antigüedad
}

/**
 * Obtiene el estado de pagos para un cliente específico
 */
export async function getClientPaymentStatus(clientId: string): Promise<PaymentStatus> {
  try {
    const facturas = await facturasAPI.obtenerFacturas({ clienteId: clientId });
    const ahora = new Date();
    ahora.setHours(0, 0, 0, 0);

    const facturasPendientes = facturas.filter(
      f => f.estado === 'pendiente' || f.estado === 'parcial'
    );
    const facturasVencidas = facturas.filter(f => {
      const estado = f.estado;
      const fechaVencimiento = new Date(f.fechaVencimiento);
      fechaVencimiento.setHours(0, 0, 0, 0);
      return (estado === 'pendiente' || estado === 'parcial' || estado === 'vencida') && 
             fechaVencimiento < ahora;
    });

    const totalPendingAmount = facturasPendientes.reduce((sum, f) => sum + f.montoPendiente, 0);
    const totalOverdueAmount = facturasVencidas.reduce((sum, f) => sum + f.montoPendiente, 0);

    // Calcular días de la factura más antigua vencida
    let oldestOverdueDays: number | null = null;
    if (facturasVencidas.length > 0) {
      const oldestVencida = facturasVencidas.reduce((oldest, current) => {
        const currentDate = new Date(current.fechaVencimiento);
        const oldestDate = new Date(oldest.fechaVencimiento);
        return currentDate < oldestDate ? current : oldest;
      });
      
      const vencimientoDate = new Date(oldestVencida.fechaVencimiento);
      vencimientoDate.setHours(0, 0, 0, 0);
      const diffTime = ahora.getTime() - vencimientoDate.getTime();
      oldestOverdueDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    }

    // Determinar severidad basada en antigüedad
    let severity: PaymentStatus['severity'] = 'none';
    if (oldestOverdueDays !== null) {
      if (oldestOverdueDays >= 30) {
        severity = 'critical'; // Más de 30 días vencido - crítico
      } else if (oldestOverdueDays >= 15) {
        severity = 'danger'; // 15-29 días vencido - peligro
      } else if (oldestOverdueDays > 0) {
        severity = 'warning'; // 1-14 días vencido - advertencia
      }
    } else if (facturasPendientes.length > 0) {
      severity = 'warning'; // Tiene facturas pendientes pero no vencidas
    }

    return {
      hasPendingPayments: facturasPendientes.length > 0,
      hasOverdueInvoices: facturasVencidas.length > 0,
      pendingCount: facturasPendientes.length,
      overdueCount: facturasVencidas.length,
      totalPendingAmount,
      totalOverdueAmount,
      oldestOverdueDays,
      severity
    };
  } catch (error) {
    console.error('Error al obtener estado de pagos del cliente:', error);
    return {
      hasPendingPayments: false,
      hasOverdueInvoices: false,
      pendingCount: 0,
      overdueCount: 0,
      totalPendingAmount: 0,
      totalOverdueAmount: 0,
      oldestOverdueDays: null,
      severity: 'none'
    };
  }
}

/**
 * Obtiene el estado de pagos para múltiples clientes
 */
export async function getMultipleClientsPaymentStatus(clientIds: string[]): Promise<Map<string, PaymentStatus>> {
  const statusMap = new Map<string, PaymentStatus>();
  
  await Promise.all(
    clientIds.map(async (clientId) => {
      const status = await getClientPaymentStatus(clientId);
      statusMap.set(clientId, status);
    })
  );
  
  return statusMap;
}


