// API service para Transacciones
// Integra los pagos de la agenda con el panel financiero

import { PagoSesion, FiltrosFinancieros } from '../../agenda-calendario/types';
import { getPagosSesiones, marcarPagoComoPagado as marcarPagoAgenda } from '../../agenda-calendario/api/finanzas';

// Tipo para transacción en el panel financiero
export interface Transaccion {
  id: string;
  fecha: Date;
  cliente: string;
  clienteId: string;
  concepto: string;
  tipoServicio: 'sesion-1-1' | 'videollamada' | 'evaluacion' | 'paquete' | 'otro';
  monto: number;
  estado: 'pagado' | 'pendiente' | 'vencido' | 'cancelado';
  metodoPago?: 'efectivo' | 'tarjeta' | 'transferencia' | 'otro';
  fechaPago?: Date;
  citaId?: string;
}

// Convertir PagoSesion a Transaccion
const convertirPagoATransaccion = (pago: PagoSesion): Transaccion => {
  const getConcepto = (tipoSesion: string): string => {
    const conceptos: Record<string, string> = {
      'sesion-1-1': 'Sesión 1 a 1',
      'videollamada': 'Videollamada',
      'evaluacion': 'Evaluación',
      'clase-colectiva': 'Clase Colectiva',
      'fisioterapia': 'Fisioterapia',
      'mantenimiento': 'Mantenimiento',
      'otro': 'Otro',
    };
    return conceptos[tipoSesion] || tipoSesion;
  };

  // Determinar si es un paquete basado en el concepto o tipo
  const conceptoTexto = getConcepto(pago.tipoSesion).toLowerCase();
  const esPaquete = conceptoTexto.includes('paquete') || pago.notas?.toLowerCase().includes('paquete');
  
  return {
    id: pago.id,
    fecha: pago.fechaSesion,
    cliente: pago.clienteNombre,
    clienteId: pago.clienteId,
    concepto: getConcepto(pago.tipoSesion),
    tipoServicio: esPaquete ? 'paquete' :
                  pago.tipoSesion === 'sesion-1-1' ? 'sesion-1-1' : 
                  pago.tipoSesion === 'videollamada' ? 'videollamada' :
                  pago.tipoSesion === 'evaluacion' ? 'evaluacion' : 'otro',
    monto: pago.monto,
    estado: pago.estado,
    metodoPago: pago.metodoPago,
    fechaPago: pago.fechaPago,
    citaId: pago.citaId,
  };
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const transaccionesApi = {
  // Obtener todas las transacciones con filtros
  async obtenerTransacciones(
    filtros?: {
      fechaInicio?: Date;
      fechaFin?: Date;
      clienteId?: string;
      tipoServicio?: string;
      estado?: string;
    },
    userId?: string
  ): Promise<Transaccion[]> {
    await delay(500);
    
    try {
      // Convertir filtros al formato de FiltrosFinancieros
      const filtrosFinancieros: FiltrosFinancieros = {
        fechaInicio: filtros?.fechaInicio,
        fechaFin: filtros?.fechaFin,
        clienteId: filtros?.clienteId,
        tipoSesion: filtros?.tipoServicio as any,
        estadoPago: filtros?.estado as any,
      };

      const pagos = await getPagosSesiones(filtrosFinancieros, userId);
      return pagos.map(convertirPagoATransaccion);
    } catch (error) {
      console.error('Error obteniendo transacciones:', error);
      return [];
    }
  },

  // Obtener transacciones pagadas (para calcular ingresos)
  async obtenerTransaccionesPagadas(
    fechaInicio?: Date,
    fechaFin?: Date,
    userId?: string
  ): Promise<Transaccion[]> {
    const transacciones = await this.obtenerTransacciones(
      {
        fechaInicio,
        fechaFin,
        estado: 'pagado',
      },
      userId
    );
    return transacciones.filter(t => t.estado === 'pagado');
  },

  // Marcar transacción como pagada (integra con agenda)
  async marcarTransaccionComoPagada(
    transaccionId: string,
    metodoPago: 'efectivo' | 'tarjeta' | 'transferencia' | 'otro',
    notas?: string,
    userId?: string
  ): Promise<Transaccion> {
    await delay(300);
    
    try {
      // Usar la función de la agenda para marcar el pago
      const pagoActualizado = await marcarPagoAgenda(transaccionId, metodoPago, notas, userId);
      return convertirPagoATransaccion(pagoActualizado);
    } catch (error) {
      console.error('Error marcando transacción como pagada:', error);
      throw error;
    }
  },
};

