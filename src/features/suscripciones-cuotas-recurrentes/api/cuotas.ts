import { Cuota, PagoRecurrente, PagoFallido, GestionarPagoFallidoRequest } from '../types';
import { getSuscripcionById } from './suscripciones';

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
  {
    id: 'cuota11',
    suscripcionId: 'sub1',
    monto: 150,
    fechaVencimiento: '2024-11-01',
    estado: 'fallida',
    metodoPago: 'tarjeta',
    notas: 'Tarjeta rechazada - fondos insuficientes',
  },
  {
    id: 'cuota12',
    suscripcionId: 'sub2',
    monto: 280,
    fechaVencimiento: '2024-11-15',
    estado: 'fallida',
    metodoPago: 'tarjeta',
    notas: 'Tarjeta expirada',
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

