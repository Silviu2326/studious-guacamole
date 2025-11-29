import { Cuota, PagoRecurrente, PagoFallido, GestionarPagoFallidoRequest, Suscripcion, FrecuenciaPago } from '../types';
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

// Helper para normalizar cuotas (compatibilidad con campos legacy)
const normalizeCuota = (cuota: Partial<Cuota> & { suscripcionId: string; clienteId: string }): Cuota => {
  const importe = cuota.importe ?? cuota.monto ?? 0;
  const fechaPagoOpcional = cuota.fechaPagoOpcional ?? cuota.fechaPago;
  
  return {
    id: cuota.id || `cuota-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    suscripcionId: cuota.suscripcionId,
    clienteId: cuota.clienteId,
    importe,
    fechaVencimiento: cuota.fechaVencimiento || formatDate(new Date()),
    fechaPagoOpcional,
    estado: cuota.estado || 'pendiente',
    metodoPago: cuota.metodoPago,
    referencia: cuota.referencia,
    notas: cuota.notas,
    // Campos legacy para compatibilidad
    monto: importe,
    fechaPago: fechaPagoOpcional,
    // Información de reintentos
    numeroIntentos: cuota.numeroIntentos,
    ultimaFechaIntento: cuota.ultimaFechaIntento,
    proximaFechaReintento: cuota.proximaFechaReintento,
    motivoFallo: cuota.motivoFallo,
    irrecuperable: cuota.irrecuperable,
  };
};

// Mock data - actualizado con nueva estructura
const mockCuotas: Cuota[] = [
  normalizeCuota({
    id: 'cuota-sub1-ago',
    suscripcionId: 'sub1',
    clienteId: 'c1',
    importe: 280,
    fechaVencimiento: addMonths(-2),
    fechaPagoOpcional: addMonths(-2),
    estado: 'pagada',
    metodoPago: 'tarjeta',
    referencia: 'PT-280-AGO',
  }),
  normalizeCuota({
    id: 'cuota-sub1-sep',
    suscripcionId: 'sub1',
    clienteId: 'c1',
    importe: 280,
    fechaVencimiento: addMonths(-1),
    fechaPagoOpcional: addMonths(-1),
    estado: 'pagada',
    metodoPago: 'tarjeta',
    referencia: 'PT-280-SEP',
  }),
  normalizeCuota({
    id: 'cuota-sub1-oct',
    suscripcionId: 'sub1',
    clienteId: 'c1',
    importe: 280,
    fechaVencimiento: addDays(-5),
    estado: 'fallida',
    metodoPago: 'tarjeta',
    notas: 'Tarjeta rechazada - fondos insuficientes',
    numeroIntentos: 2,
    ultimaFechaIntento: addDays(-5),
    proximaFechaReintento: addDays(2),
    motivoFallo: 'Tarjeta rechazada - fondos insuficientes',
  }),
  normalizeCuota({
    id: 'cuota-sub2-ago',
    suscripcionId: 'sub2',
    clienteId: 'c2',
    importe: 195,
    fechaVencimiento: addMonths(-2),
    fechaPagoOpcional: addMonths(-2),
    estado: 'pagada',
    metodoPago: 'domiciliacion',
    referencia: 'DOM-195-AGO',
  }),
  normalizeCuota({
    id: 'cuota-sub2-sep',
    suscripcionId: 'sub2',
    clienteId: 'c2',
    importe: 195,
    fechaVencimiento: addMonths(-1),
    fechaPagoOpcional: addMonths(-1),
    estado: 'pagada',
    metodoPago: 'domiciliacion',
    referencia: 'DOM-195-SEP',
  }),
  normalizeCuota({
    id: 'cuota-sub2-oct',
    suscripcionId: 'sub2',
    clienteId: 'c2',
    importe: 195,
    fechaVencimiento: addDays(4),
    estado: 'pendiente',
  }),
  normalizeCuota({
    id: 'cuota-sub6-ago',
    suscripcionId: 'sub6',
    clienteId: 'c6',
    importe: 520,
    fechaVencimiento: addMonths(-2),
    fechaPagoOpcional: addMonths(-2),
    estado: 'pagada',
    metodoPago: 'transferencia',
    referencia: 'TRF-520-AGO',
  }),
  normalizeCuota({
    id: 'cuota-sub6-sep',
    suscripcionId: 'sub6',
    clienteId: 'c6',
    importe: 520,
    fechaVencimiento: addMonths(-1),
    estado: 'fallida',
    metodoPago: 'transferencia',
    notas: 'Cuenta bancaria sin fondos',
    numeroIntentos: 4,
    ultimaFechaIntento: addDays(-10),
    proximaFechaReintento: addDays(5),
    motivoFallo: 'Cuenta bancaria sin fondos',
  }),
  normalizeCuota({
    id: 'cuota-sub10-trial',
    suscripcionId: 'sub10',
    clienteId: 'c10',
    importe: 99,
    fechaVencimiento: addDays(12),
    estado: 'pendiente',
    metodoPago: 'tarjeta',
  }),
  normalizeCuota({
    id: 'cuota-sub11-sep',
    suscripcionId: 'sub11',
    clienteId: 'c11',
    importe: 180,
    fechaVencimiento: addMonths(-2),
    fechaPagoOpcional: addMonths(-2),
    estado: 'pagada',
    metodoPago: 'tarjeta',
  }),
  normalizeCuota({
    id: 'cuota-sub5-ago',
    suscripcionId: 'sub5',
    clienteId: 'c5',
    importe: 540,
    fechaVencimiento: addMonths(-2),
    fechaPagoOpcional: addMonths(-2),
    estado: 'pagada',
    metodoPago: 'transferencia',
  }),
  normalizeCuota({
    id: 'cuota-sub5-sep',
    suscripcionId: 'sub5',
    clienteId: 'c5',
    importe: 540,
    fechaVencimiento: addMonths(-1),
    fechaPagoOpcional: addMonths(-1),
    estado: 'pagada',
    metodoPago: 'transferencia',
  }),
  normalizeCuota({
    id: 'cuota-sub5-m1-ago',
    suscripcionId: 'sub5-m1',
    clienteId: 'c5',
    importe: 180,
    fechaVencimiento: addMonths(-2),
    fechaPagoOpcional: addMonths(-2),
    estado: 'pagada',
    metodoPago: 'tarjeta',
  }),
  normalizeCuota({
    id: 'cuota-sub5-m2-ago',
    suscripcionId: 'sub5-m2',
    clienteId: 'c5',
    importe: 180,
    fechaVencimiento: addMonths(-2),
    fechaPagoOpcional: addMonths(-2),
    estado: 'pagada',
    metodoPago: 'tarjeta',
  }),
  normalizeCuota({
    id: 'cuota-sub3-ago',
    suscripcionId: 'sub3',
    clienteId: 'c3',
    importe: 85,
    fechaVencimiento: addMonths(-2),
    fechaPagoOpcional: addMonths(-2),
    estado: 'pagada',
    metodoPago: 'domiciliacion',
  }),
  normalizeCuota({
    id: 'cuota-sub4-ago',
    suscripcionId: 'sub4',
    clienteId: 'c4',
    importe: 55,
    fechaVencimiento: addMonths(-2),
    fechaPagoOpcional: addMonths(-2),
    estado: 'pagada',
    metodoPago: 'tarjeta',
  }),
  normalizeCuota({
    id: 'cuota-sub7-oct',
    suscripcionId: 'sub7',
    clienteId: 'c7',
    importe: 240,
    fechaVencimiento: addMonths(-1),
    fechaPagoOpcional: addMonths(-1),
    estado: 'pagada',
    metodoPago: 'domiciliacion',
  }),
  normalizeCuota({
    id: 'cuota-sub8-sep',
    suscripcionId: 'sub8',
    clienteId: 'c8',
    importe: 50,
    fechaVencimiento: addDays(-42),
    estado: 'vencida',
  }),
  normalizeCuota({
    id: 'cuota-sub9-inicio',
    suscripcionId: 'sub9',
    clienteId: 'c9',
    importe: 1440,
    fechaVencimiento: addMonths(-11),
    fechaPagoOpcional: addMonths(-11),
    estado: 'pagada',
    metodoPago: 'transferencia',
    referencia: 'TRF-1440',
  }),
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

// Obtener cuotas por suscripción (alias para compatibilidad)
export const getCuotasPorSuscripcion = async (
  suscripcionId: string
): Promise<Cuota[]> => {
  return getCuotas(suscripcionId);
};

// Obtener cuotas por cliente
export const getCuotasPorCliente = async (
  clienteId: string
): Promise<Cuota[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockCuotas.filter(c => c.clienteId === clienteId);
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
  
  const fechaPago = new Date().toISOString().split('T')[0];
  const cuotaActualizada = normalizeCuota({
    ...cuota,
    estado: 'pagada',
    fechaPagoOpcional: fechaPago,
    metodoPago,
    referencia: referencia || `REF-${Date.now()}`,
  });
  
  // Actualizar en el array mock
  const index = mockCuotas.findIndex(c => c.id === cuotaId);
  if (index !== -1) {
    mockCuotas[index] = cuotaActualizada;
  }
  
  return cuotaActualizada;
};

// Registrar pago de cuota (alias para compatibilidad)
export const registrarPagoCuota = async (
  cuotaId: string,
  metodoPago: string,
  referencia?: string,
  fechaPago?: string
): Promise<Cuota> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const cuota = mockCuotas.find(c => c.id === cuotaId);
  if (!cuota) {
    throw new Error('Cuota no encontrada');
  }
  
  const fechaPagoFinal = fechaPago || new Date().toISOString().split('T')[0];
  const cuotaActualizada = normalizeCuota({
    ...cuota,
    estado: 'pagada',
    fechaPagoOpcional: fechaPagoFinal,
    metodoPago,
    referencia: referencia || `REF-${Date.now()}`,
  });
  
  // Actualizar en el array mock
  const index = mockCuotas.findIndex(c => c.id === cuotaId);
  if (index !== -1) {
    mockCuotas[index] = cuotaActualizada;
  }
  
  return cuotaActualizada;
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
  entrenadorId?: string,
  filtros?: {
    planId?: string;
    antiguedadMinima?: number; // Días desde el fallo
    incluirIrrecuperables?: boolean;
  }
): Promise<PagoFallido[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let cuotasFallidas = mockCuotas.filter(c => c.estado === 'fallida');
  
  // Filtrar por irrecuperables si se especifica
  if (filtros?.incluirIrrecuperables === false) {
    cuotasFallidas = cuotasFallidas.filter(c => !c.irrecuperable);
  }
  
  // Filtrar por antigüedad mínima
  if (filtros?.antiguedadMinima) {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - filtros.antiguedadMinima);
    cuotasFallidas = cuotasFallidas.filter(c => {
      const fechaFallo = c.ultimaFechaIntento || c.fechaVencimiento;
      return new Date(fechaFallo) <= fechaLimite;
    });
  }
  
  const pagosFallidos: PagoFallido[] = [];
  
  for (const cuota of cuotasFallidas) {
    try {
      const suscripcion = await getSuscripcionById(cuota.suscripcionId);
      
      // Si se especifica entrenadorId, filtrar solo sus suscripciones
      if (entrenadorId && suscripcion.entrenadorId !== entrenadorId) {
        continue;
      }
      
      // Filtrar por plan si se especifica
      if (filtros?.planId && suscripcion.planId !== filtros.planId) {
        continue;
      }
      
      pagosFallidos.push({
        cuotaId: cuota.id,
        suscripcionId: cuota.suscripcionId,
        clienteId: suscripcion.clienteId,
        clienteNombre: suscripcion.clienteNombre,
        clienteEmail: suscripcion.clienteEmail,
        clienteTelefono: suscripcion.clienteTelefono,
        monto: cuota.importe,
        fechaVencimiento: cuota.fechaVencimiento,
        fechaIntento: cuota.ultimaFechaIntento || cuota.fechaVencimiento,
        motivoFallo: cuota.motivoFallo || cuota.notas || 'Pago rechazado',
        intentos: cuota.numeroIntentos || 1,
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
        const fechaPago = new Date().toISOString().split('T')[0];
        const cuotaActualizada = normalizeCuota({
          ...cuota,
          estado: 'pagada',
          fechaPagoOpcional: fechaPago,
          metodoPago: cuota.metodoPago || data.nuevoMetodoPago,
          referencia: `REF-${Date.now()}`,
          notas: data.notas || cuota.notas,
        });
        
        const index = mockCuotas.findIndex(c => c.id === cuota.id);
        if (index !== -1) {
          mockCuotas[index] = cuotaActualizada;
        }
        
        return cuotaActualizada;
      } else {
        const cuotaActualizada = normalizeCuota({
          ...cuota,
          estado: 'fallida',
          notas: data.notas || cuota.notas || 'Reintento fallido',
        });
        
        const index = mockCuotas.findIndex(c => c.id === cuota.id);
        if (index !== -1) {
          mockCuotas[index] = cuotaActualizada;
        }
        
        return cuotaActualizada;
      }
      
    case 'actualizar_metodo':
      // Actualizar método de pago y reintentar
      if (!data.nuevoMetodoPago) {
        throw new Error('Se requiere un nuevo método de pago');
      }
      
      // En producción, aquí se actualizaría el método de pago en la suscripción
      const cuotaActualizada = normalizeCuota({
        ...cuota,
        metodoPago: data.nuevoMetodoPago,
        notas: data.notas || cuota.notas || `Método de pago actualizado a ${data.nuevoMetodoPago}`,
      });
      
      const index = mockCuotas.findIndex(c => c.id === cuota.id);
      if (index !== -1) {
        mockCuotas[index] = cuotaActualizada;
      }
      
      return cuotaActualizada;
      
    case 'marcar_resuelto':
      // Marcar como resuelto manualmente
      const fechaPago = new Date().toISOString().split('T')[0];
      const cuotaResuelta = normalizeCuota({
        ...cuota,
        estado: 'pagada',
        fechaPagoOpcional: fechaPago,
        notas: data.notas || cuota.notas || 'Resuelto manualmente',
      });
      
      const indexResuelta = mockCuotas.findIndex(c => c.id === cuota.id);
      if (indexResuelta !== -1) {
        mockCuotas[indexResuelta] = cuotaResuelta;
      }
      
      return cuotaResuelta;
      
    case 'contactar_cliente':
      // Solo registrar la acción, no cambiar el estado
      const cuotaContactada = normalizeCuota({
        ...cuota,
        notas: data.notas || cuota.notas || 'Cliente contactado',
      });
      
      const indexContactada = mockCuotas.findIndex(c => c.id === cuota.id);
      if (indexContactada !== -1) {
        mockCuotas[indexContactada] = cuotaContactada;
      }
      
      return cuotaContactada;
      
    default:
      return cuota;
  }
};

// Marcar cuota como fallida
export const marcarCuotaComoFallida = async (
  cuotaId: string,
  motivo?: string
): Promise<Cuota> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const cuota = mockCuotas.find(c => c.id === cuotaId);
  if (!cuota) {
    throw new Error('Cuota no encontrada');
  }
  
  const cuotaActualizada = normalizeCuota({
    ...cuota,
    estado: 'fallida',
    notas: motivo || cuota.notas || 'Pago fallido',
  });
  
  // Actualizar en el array mock
  const index = mockCuotas.findIndex(c => c.id === cuotaId);
  if (index !== -1) {
    mockCuotas[index] = cuotaActualizada;
  }
  
  return cuotaActualizada;
};

// Generar cuotas para una suscripción
export const generarCuotasParaSuscripcion = async (
  suscripcionId: string,
  numeroCuotas: number,
  fechaInicio?: string
): Promise<Cuota[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const suscripcion = await getSuscripcionById(suscripcionId);
  
  if (!suscripcion) {
    throw new Error('Suscripción no encontrada');
  }
  
  const fechaInicioCuotas = fechaInicio || suscripcion.fechaInicio;
  const fechaBase = new Date(fechaInicioCuotas);
  const cuotasGeneradas: Cuota[] = [];
  
  // Calcular intervalo según frecuencia de pago
  const getIntervaloMeses = (frecuencia: FrecuenciaPago): number => {
    switch (frecuencia) {
      case 'mensual': return 1;
      case 'trimestral': return 3;
      case 'semestral': return 6;
      case 'anual': return 12;
      default: return 1;
    }
  };
  
  const intervaloMeses = getIntervaloMeses(suscripcion.frecuenciaPago);
  const importe = suscripcion.descuento
    ? suscripcion.descuento.tipo === 'porcentaje'
      ? suscripcion.precio * (1 - suscripcion.descuento.valor / 100)
      : suscripcion.precio - suscripcion.descuento.valor
    : suscripcion.precio;
  
  for (let i = 0; i < numeroCuotas; i++) {
    const fechaVencimiento = new Date(fechaBase);
    fechaVencimiento.setMonth(fechaVencimiento.getMonth() + (i * intervaloMeses));
    
    // Verificar si ya existe una cuota para esta fecha
    const cuotaExistente = mockCuotas.find(
      c => c.suscripcionId === suscripcionId &&
      c.fechaVencimiento === formatDate(fechaVencimiento)
    );
    
    if (!cuotaExistente) {
      const nuevaCuota = normalizeCuota({
        id: `cuota-${suscripcionId}-${formatDate(fechaVencimiento)}`,
        suscripcionId: suscripcion.id,
        clienteId: suscripcion.clienteId,
        importe,
        fechaVencimiento: formatDate(fechaVencimiento),
        estado: 'pendiente',
        metodoPago: suscripcion.pagoRecurrente?.metodoPago,
      });
      
      mockCuotas.push(nuevaCuota);
      cuotasGeneradas.push(nuevaCuota);
    }
  }
  
  return cuotasGeneradas;
};

// Programar reintento de pago para una cuota fallida
export const programarReintentoPago = async (
  cuotaId: string,
  fechaReintento?: string
): Promise<Cuota> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const cuota = mockCuotas.find(c => c.id === cuotaId);
  if (!cuota) {
    throw new Error('Cuota no encontrada');
  }
  
  if (cuota.estado !== 'fallida') {
    throw new Error('Solo se pueden programar reintentos para cuotas fallidas');
  }
  
  // Calcular fecha de reintento si no se proporciona
  const fechaReintentoCalculada = fechaReintento || (() => {
    const fecha = new Date();
    // Por defecto, reintentar en 3 días
    fecha.setDate(fecha.getDate() + 3);
    return formatDate(fecha);
  })();
  
  const numeroIntentos = (cuota.numeroIntentos || 1) + 1;
  const ultimaFechaIntento = formatDate(new Date());
  
  const cuotaActualizada = normalizeCuota({
    ...cuota,
    numeroIntentos,
    ultimaFechaIntento,
    proximaFechaReintento: fechaReintentoCalculada,
    motivoFallo: cuota.motivoFallo || cuota.notas || 'Pago rechazado',
    notas: cuota.notas ? `${cuota.notas} | Reintento programado para ${fechaReintentoCalculada}` : `Reintento programado para ${fechaReintentoCalculada}`,
  });
  
  // Actualizar en el array mock
  const index = mockCuotas.findIndex(c => c.id === cuotaId);
  if (index !== -1) {
    mockCuotas[index] = cuotaActualizada;
  }
  
  return cuotaActualizada;
};

// Marcar cuota como irrecuperable
export const marcarCuotaComoIrrecuperable = async (
  cuotaId: string,
  motivo?: string
): Promise<Cuota> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const cuota = mockCuotas.find(c => c.id === cuotaId);
  if (!cuota) {
    throw new Error('Cuota no encontrada');
  }
  
  const cuotaActualizada = normalizeCuota({
    ...cuota,
    irrecuperable: true,
    estado: 'fallida',
    notas: motivo 
      ? `${cuota.notas || ''} | Marcada como irrecuperable: ${motivo}`.trim()
      : `${cuota.notas || ''} | Marcada como irrecuperable`.trim(),
    motivoFallo: cuota.motivoFallo || motivo || 'Pago irrecuperable',
  });
  
  // Actualizar en el array mock
  const index = mockCuotas.findIndex(c => c.id === cuotaId);
  if (index !== -1) {
    mockCuotas[index] = cuotaActualizada;
  }
  
  return cuotaActualizada;
};

