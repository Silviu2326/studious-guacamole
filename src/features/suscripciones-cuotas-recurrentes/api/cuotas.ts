import { Cuota, PagoRecurrente } from '../types';

// Mock data
const mockCuotas: Cuota[] = [
  {
    id: 'cuota1',
    suscripcionId: 'sub1',
    monto: 150,
    fechaVencimiento: '2024-11-01',
    fechaPago: '2024-10-01',
    estado: 'pagada',
    metodoPago: 'tarjeta',
    referencia: 'TRF-2024-001',
  },
  {
    id: 'cuota2',
    suscripcionId: 'sub2',
    monto: 280,
    fechaVencimiento: '2024-10-15',
    fechaPago: '2024-09-15',
    estado: 'pagada',
    metodoPago: 'transferencia',
    referencia: 'TRF-2024-002',
  },
  {
    id: 'cuota3',
    suscripcionId: 'sub3',
    monto: 80,
    fechaVencimiento: '2024-11-01',
    estado: 'pendiente',
  },
  {
    id: 'cuota4',
    suscripcionId: 'sub4',
    monto: 50,
    fechaVencimiento: '2024-11-01',
    estado: 'vencida',
  },
  {
    id: 'cuota5',
    suscripcionId: 'sub5',
    monto: 120,
    fechaVencimiento: '2024-11-01',
    estado: 'pendiente',
  },
  {
    id: 'cuota6',
    suscripcionId: 'sub6',
    monto: 480,
    fechaVencimiento: '2024-11-01',
    estado: 'pendiente',
  },
  {
    id: 'cuota7',
    suscripcionId: 'sub7',
    monto: 240,
    fechaVencimiento: '2025-01-01',
    estado: 'pendiente',
  },
  {
    id: 'cuota8',
    suscripcionId: 'sub8',
    monto: 50,
    fechaVencimiento: '2024-10-15',
    estado: 'vencida',
  },
  {
    id: 'cuota9',
    suscripcionId: 'sub9',
    monto: 1440,
    fechaVencimiento: '2025-01-01',
    estado: 'pagada',
    fechaPago: '2024-01-01',
    metodoPago: 'transferencia',
    referencia: 'TRF-2024-003',
  },
  {
    id: 'cuota10',
    suscripcionId: 'sub1',
    monto: 150,
    fechaVencimiento: '2024-10-01',
    fechaPago: '2024-09-30',
    estado: 'pagada',
    metodoPago: 'tarjeta',
    referencia: 'TRF-2024-004',
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

