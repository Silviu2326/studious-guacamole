import { Cuota, PagoRecurrente, PagoFallido, GestionarPagoFallidoRequest } from '../types';
import { getSuscripcionById } from './suscripciones';

const BASE_DATE = new Date();
const DAY_IN_MS = 24 * 60 * 60 * 1000;

const formatDate = (date: Date) => date.toISOString().split('T')[0];
const addDays = (days: number) =>
  formatDate(new Date(BASE_DATE.getTime() + days * DAY_IN_MS));
const addMonths = (months: number) => {
  const date = new Date(BASE_DATE);
  date.setMonth(date.getMonth() + months);
  return formatDate(date);
};

// Mock data
const mockCuotas: Cuota[] = [
  {
    id: 'cuota-sub1-ago',
    suscripcionId: 'sub1',
    monto: 280,
    fechaVencimiento: addMonths(-2),
    fechaPago: addMonths(-2),
    estado: 'pagada',
    metodoPago: 'tarjeta',
    referencia: 'PT-280-AGO',
  },
  {
    id: 'cuota-sub1-sep',
    suscripcionId: 'sub1',
    monto: 280,
    fechaVencimiento: addMonths(-1),
    fechaPago: addMonths(-1),
    estado: 'pagada',
    metodoPago: 'tarjeta',
    referencia: 'PT-280-SEP',
  },
  {
    id: 'cuota-sub1-oct',
    suscripcionId: 'sub1',
    monto: 280,
    fechaVencimiento: addDays(-5),
    estado: 'fallida',
    metodoPago: 'tarjeta',
    notas: 'Tarjeta rechazada - fondos insuficientes',
  },
  {
    id: 'cuota-sub2-ago',
    suscripcionId: 'sub2',
    monto: 195,
    fechaVencimiento: addMonths(-2),
    fechaPago: addMonths(-2),
    estado: 'pagada',
    metodoPago: 'domiciliacion',
    referencia: 'DOM-195-AGO',
  },
  {
    id: 'cuota-sub2-sep',
    suscripcionId: 'sub2',
    monto: 195,
    fechaVencimiento: addMonths(-1),
    fechaPago: addMonths(-1),
    estado: 'pagada',
    metodoPago: 'domiciliacion',
    referencia: 'DOM-195-SEP',
  },
  {
    id: 'cuota-sub2-oct',
    suscripcionId: 'sub2',
    monto: 195,
    fechaVencimiento: addDays(4),
    estado: 'pendiente',
  },
  {
    id: 'cuota-sub6-ago',
    suscripcionId: 'sub6',
    monto: 520,
    fechaVencimiento: addMonths(-2),
    fechaPago: addMonths(-2),
    estado: 'pagada',
    metodoPago: 'transferencia',
    referencia: 'TRF-520-AGO',
  },
  {
    id: 'cuota-sub6-sep',
    suscripcionId: 'sub6',
    monto: 520,
    fechaVencimiento: addMonths(-1),
    estado: 'fallida',
    metodoPago: 'transferencia',
    notas: 'Cuenta bancaria sin fondos',
  },
  {
    id: 'cuota-sub10-trial',
    suscripcionId: 'sub10',
    monto: 99,
    fechaVencimiento: addDays(12),
    estado: 'pendiente',
    metodoPago: 'tarjeta',
  },
  {
    id: 'cuota-sub11-sep',
    suscripcionId: 'sub11',
    monto: 180,
    fechaVencimiento: addMonths(-2),
    fechaPago: addMonths(-2),
    estado: 'pagada',
    metodoPago: 'tarjeta',
  },
  {
    id: 'cuota-sub5-ago',
    suscripcionId: 'sub5',
    monto: 540,
    fechaVencimiento: addMonths(-2),
    fechaPago: addMonths(-2),
    estado: 'pagada',
    metodoPago: 'transferencia',
  },
  {
    id: 'cuota-sub5-sep',
    suscripcionId: 'sub5',
    monto: 540,
    fechaVencimiento: addMonths(-1),
    fechaPago: addMonths(-1),
    estado: 'pagada',
    metodoPago: 'transferencia',
  },
  {
    id: 'cuota-sub5-m1-ago',
    suscripcionId: 'sub5-m1',
    monto: 180,
    fechaVencimiento: addMonths(-2),
    fechaPago: addMonths(-2),
    estado: 'pagada',
    metodoPago: 'tarjeta',
  },
  {
    id: 'cuota-sub5-m2-ago',
    suscripcionId: 'sub5-m2',
    monto: 180,
    fechaVencimiento: addMonths(-2),
    fechaPago: addMonths(-2),
    estado: 'pagada',
    metodoPago: 'tarjeta',
  },
  {
    id: 'cuota-sub3-ago',
    suscripcionId: 'sub3',
    monto: 85,
    fechaVencimiento: addMonths(-2),
    fechaPago: addMonths(-2),
    estado: 'pagada',
    metodoPago: 'domiciliacion',
  },
  {
    id: 'cuota-sub4-ago',
    suscripcionId: 'sub4',
    monto: 55,
    fechaVencimiento: addMonths(-2),
    fechaPago: addMonths(-2),
    estado: 'pagada',
    metodoPago: 'tarjeta',
  },
  {
    id: 'cuota-sub7-oct',
    suscripcionId: 'sub7',
    monto: 240,
    fechaVencimiento: addMonths(-1),
    fechaPago: addMonths(-1),
    estado: 'pagada',
    metodoPago: 'domiciliacion',
  },
  {
    id: 'cuota-sub8-sep',
    suscripcionId: 'sub8',
    monto: 50,
    fechaVencimiento: addDays(-42),
    estado: 'vencida',
  },
  {
    id: 'cuota-sub9-inicio',
    suscripcionId: 'sub9',
    monto: 1440,
    fechaVencimiento: addMonths(-11),
    fechaPago: addMonths(-11),
    estado: 'pagada',
    metodoPago: 'transferencia',
    referencia: 'TRF-1440',
  },
];

export const getCuotas = async (
  suscripcionId?: string
): Promise<Cuota[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (suscripcionId) {
    return mockCuotas.filter(c => c.suscripcionId === suscripcionId);
  }
  
  return mockCuotas;
};

export const getCuotaById = async (id: string): Promise<Cuota> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const cuota = mockCuotas.find(c => c.id === id);
  if (!cuota) {
    throw new Error('Cuota no encontrada');
  }
  
  return cuota;
};

export const getCuotasPendientes = async (): Promise<Cuota[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return mockCuotas.filter(c => c.estado === 'pendiente' || c.estado === 'vencida');
};

export const getCuotasVencidas = async (): Promise<Cuota[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return mockCuotas.filter(c => c.estado === 'vencida');
};

export const procesarPagoCuota = async (
  cuotaId: string,
  metodoPago: string,
  referencia?: string
): Promise<Cuota> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const cuota = mockCuotas.find(c => c.id === cuotaId);
  if (!cuota) {
    throw new Error('Cuota no encontrada');
  }
  
  return {
    ...cuota,
    estado: 'pagada',
    fechaPago: new Date().toISOString().split('T')[0],
    metodoPago,
    referencia: referencia || `REF-${Date.now()}`,
  };
};

export const configurarPagoRecurrente = async (
  suscripcionId: string,
  metodoPago: 'tarjeta' | 'transferencia' | 'domiciliacion',
  datosPago?: any
): Promise<PagoRecurrente> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const nuevoPagoRecurrente: PagoRecurrente = {
    id: `pr-${Date.now()}`,
    suscripcionId,
    metodoPago,
    activo: true,
    fechaProximoCargo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    frecuencia: 'mensual',
    numeroTarjeta: metodoPago === 'tarjeta' && datosPago?.numeroTarjeta 
      ? `****${datosPago.numeroTarjeta.slice(-4)}`
      : undefined,
  };
  
  return nuevoPagoRecurrente;
};

export const desactivarPagoRecurrente = async (
  pagoRecurrenteId: string
): Promise<PagoRecurrente> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción, buscaría el pago recurrente y lo desactivaría
  const pagoRecurrente: PagoRecurrente = {
    id: pagoRecurrenteId,
    suscripcionId: 'sub1',
    metodoPago: 'tarjeta',
    activo: false,
    frecuencia: 'mensual',
  };
  
  return pagoRecurrente;
};

export const getHistorialPagos = async (
  suscripcionId: string
): Promise<Cuota[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return mockCuotas.filter(
    c => c.suscripcionId === suscripcionId && c.estado === 'pagada'
  );
};

// User Story 2: Obtener pagos fallidos
export const getPagosFallidos = async (
  entrenadorId?: string
): Promise<PagoFallido[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const cuotasFallidas = mockCuotas.filter(c => c.estado === 'fallida');
  
  const pagosFallidos: PagoFallido[] = [];
  
  for (const cuota of cuotasFallidas) {
    try {
      const suscripcion = await getSuscripcionById(cuota.suscripcionId);
      
      // Si se especifica entrenadorId, filtrar solo sus suscripciones
      if (entrenadorId && suscripcion.entrenadorId !== entrenadorId) {
        continue;
      }
      
      // Solo para suscripciones PT (entrenadores)
      if (suscripcion.tipo !== 'pt-mensual') {
        continue;
      }
      
      pagosFallidos.push({
        cuotaId: cuota.id,
        suscripcionId: cuota.suscripcionId,
        clienteId: suscripcion.clienteId,
        clienteNombre: suscripcion.clienteNombre,
        clienteEmail: suscripcion.clienteEmail,
        clienteTelefono: suscripcion.clienteTelefono,
        monto: cuota.monto,
        fechaVencimiento: cuota.fechaVencimiento,
        fechaIntento: cuota.fechaVencimiento, // En producción sería la fecha del intento
        motivoFallo: cuota.notas || 'Pago rechazado',
        intentos: 1, // En producción se contaría desde la base de datos
        metodoPago: cuota.metodoPago as 'tarjeta' | 'transferencia' | 'domiciliacion' | undefined,
        entrenadorId: suscripcion.entrenadorId,
      });
    } catch (error) {
      console.error(`Error obteniendo suscripción ${cuota.suscripcionId}:`, error);
    }
  }
  
  return pagosFallidos;
};

// User Story 2: Gestionar pago fallido
export const gestionarPagoFallido = async (
  data: GestionarPagoFallidoRequest
): Promise<Cuota> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const cuota = mockCuotas.find(c => c.id === data.cuotaId);
  if (!cuota) {
    throw new Error('Cuota no encontrada');
  }
  
  switch (data.accion) {
    case 'reintentar':
      // Simular reintento de pago
      // En producción, aquí se llamaría al procesador de pagos
      const exito = Math.random() > 0.3; // 70% de éxito simulado
      
      if (exito) {
        return {
          ...cuota,
          estado: 'pagada',
          fechaPago: new Date().toISOString().split('T')[0],
          metodoPago: cuota.metodoPago || data.nuevoMetodoPago,
          referencia: `REF-${Date.now()}`,
          notas: data.notas || cuota.notas,
        };
      } else {
        return {
          ...cuota,
          estado: 'fallida',
          notas: data.notas || cuota.notas || 'Reintento fallido',
        };
      }
      
    case 'actualizar_metodo':
      // Actualizar método de pago y reintentar
      if (!data.nuevoMetodoPago) {
        throw new Error('Se requiere un nuevo método de pago');
      }
      
      // En producción, aquí se actualizaría el método de pago en la suscripción
      return {
        ...cuota,
        metodoPago: data.nuevoMetodoPago,
        notas: data.notas || cuota.notas || `Método de pago actualizado a ${data.nuevoMetodoPago}`,
      };
      
    case 'marcar_resuelto':
      // Marcar como resuelto manualmente
      return {
        ...cuota,
        estado: 'pagada',
        fechaPago: new Date().toISOString().split('T')[0],
        notas: data.notas || cuota.notas || 'Resuelto manualmente',
      };
      
    case 'contactar_cliente':
      // Solo registrar la acción, no cambiar el estado
      return {
        ...cuota,
        notas: data.notas || cuota.notas || 'Cliente contactado',
      };
      
    default:
      return cuota;
  }
};

