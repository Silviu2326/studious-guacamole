import {
  Suscripcion,
  CreateSuscripcionRequest,
  UpdateSuscripcionRequest,
  UpgradeDowngrade,
  FreezeRequest,
  MultisesionRequest,
} from '../types';

// Mock data - En producción esto sería llamadas a API real
const mockSuscripciones: Suscripcion[] = [
  {
    id: 'sub1',
    clienteId: 'c1',
    clienteNombre: 'Juan Pérez',
    clienteEmail: 'juan@example.com',
    clienteTelefono: '+34600123456',
    tipo: 'pt-mensual',
    planId: 'pt-4',
    planNombre: 'Paquete Mensual 4 Sesiones',
    sesionesIncluidas: 4,
    sesionesUsadas: 2,
    sesionesDisponibles: 2,
    precio: 150,
    frecuenciaPago: 'mensual',
    fechaInicio: '2024-10-01',
    fechaVencimiento: '2024-11-01',
    proximaRenovacion: '2024-11-01',
    estado: 'activa',
    pagoRecurrente: {
      id: 'pr1',
      suscripcionId: 'sub1',
      metodoPago: 'tarjeta',
      numeroTarjeta: '****1234',
      activo: true,
      fechaProximoCargo: '2024-11-01',
      frecuencia: 'mensual',
    },
    historialCuotas: [],
    entrenadorId: 'trainer1',
    fechaCreacion: '2024-10-01',
    fechaActualizacion: '2024-10-15',
  },
  {
    id: 'sub2',
    clienteId: 'c2',
    clienteNombre: 'María García',
    clienteEmail: 'maria@example.com',
    clienteTelefono: '+34600234567',
    tipo: 'pt-mensual',
    planId: 'pt-8',
    planNombre: 'Paquete Mensual 8 Sesiones',
    sesionesIncluidas: 8,
    sesionesUsadas: 6,
    sesionesDisponibles: 2,
    precio: 280,
    frecuenciaPago: 'mensual',
    fechaInicio: '2024-09-15',
    fechaVencimiento: '2024-10-15',
    proximaRenovacion: '2024-10-15',
    estado: 'activa',
    pagoRecurrente: {
      id: 'pr2',
      suscripcionId: 'sub2',
      metodoPago: 'transferencia',
      activo: true,
      fechaProximoCargo: '2024-10-15',
      frecuencia: 'mensual',
    },
    historialCuotas: [],
    entrenadorId: 'trainer1',
    fechaCreacion: '2024-09-15',
    fechaActualizacion: '2024-10-01',
  },
  {
    id: 'sub6',
    clienteId: 'c6',
    clienteNombre: 'Elena Sánchez',
    clienteEmail: 'elena@example.com',
    clienteTelefono: '+34600345678',
    tipo: 'pt-mensual',
    planId: 'pt-12',
    planNombre: 'Paquete Mensual 12 Sesiones',
    sesionesIncluidas: 12,
    sesionesUsadas: 10,
    sesionesDisponibles: 2,
    precio: 480,
    frecuenciaPago: 'mensual',
    fechaInicio: '2024-10-01',
    fechaVencimiento: '2024-11-01',
    proximaRenovacion: '2024-11-01',
    estado: 'activa',
    pagoRecurrente: {
      id: 'pr6',
      suscripcionId: 'sub6',
      metodoPago: 'tarjeta',
      numeroTarjeta: '****3456',
      activo: true,
      fechaProximoCargo: '2024-11-01',
      frecuencia: 'mensual',
    },
    historialCuotas: [],
    entrenadorId: 'trainer1',
    fechaCreacion: '2024-10-01',
    fechaActualizacion: '2024-10-10',
  },
  {
    id: 'sub3',
    clienteId: 'c3',
    clienteNombre: 'Carlos López',
    clienteEmail: 'carlos@example.com',
    clienteTelefono: '+34600456789',
    tipo: 'membresia-gimnasio',
    planId: 'premium',
    planNombre: 'Membresía Premium',
    nivelPlan: 'premium',
    permiteFreeze: true,
    permiteMultisesion: true,
    precio: 80,
    frecuenciaPago: 'mensual',
    fechaInicio: '2024-08-01',
    fechaVencimiento: '2024-11-01',
    proximaRenovacion: '2024-11-01',
    estado: 'activa',
    pagoRecurrente: {
      id: 'pr3',
      suscripcionId: 'sub3',
      metodoPago: 'domiciliacion',
      activo: true,
      fechaProximoCargo: '2024-11-01',
      frecuencia: 'mensual',
    },
    historialCuotas: [],
    fechaCreacion: '2024-08-01',
    fechaActualizacion: '2024-10-01',
  },
  {
    id: 'sub4',
    clienteId: 'c4',
    clienteNombre: 'Ana Martínez',
    clienteEmail: 'ana@example.com',
    clienteTelefono: '+34600567890',
    tipo: 'membresia-gimnasio',
    planId: 'basico',
    planNombre: 'Membresía Básica',
    nivelPlan: 'basico',
    permiteFreeze: false,
    permiteMultisesion: false,
    precio: 50,
    frecuenciaPago: 'mensual',
    fechaInicio: '2024-07-01',
    fechaVencimiento: '2024-11-01',
    proximaRenovacion: '2024-11-01',
    estado: 'pausada',
    freezeActivo: true,
    fechaFreezeInicio: '2024-10-15',
    fechaFreezeFin: '2024-11-15',
    diasFreezeRestantes: 15,
    pagoRecurrente: {
      id: 'pr4',
      suscripcionId: 'sub4',
      metodoPago: 'tarjeta',
      numeroTarjeta: '****5678',
      activo: false,
      frecuencia: 'mensual',
    },
    historialCuotas: [],
    fechaCreacion: '2024-07-01',
    fechaActualizacion: '2024-10-15',
  },
  {
    id: 'sub5',
    clienteId: 'c5',
    clienteNombre: 'Luis Fernández',
    clienteEmail: 'luis@example.com',
    clienteTelefono: '+34600678901',
    tipo: 'membresia-gimnasio',
    planId: 'vip',
    planNombre: 'Membresía VIP',
    nivelPlan: 'vip',
    permiteFreeze: true,
    permiteMultisesion: true,
    serviciosAcceso: ['gimnasio', 'spa', 'piscina'],
    precio: 120,
    frecuenciaPago: 'mensual',
    fechaInicio: '2024-09-01',
    fechaVencimiento: '2024-11-01',
    proximaRenovacion: '2024-11-01',
    estado: 'activa',
    multisesionActivo: true,
    serviciosMultisesion: ['gimnasio', 'spa', 'piscina', 'clases-grupales'],
    pagoRecurrente: {
      id: 'pr5',
      suscripcionId: 'sub5',
      metodoPago: 'tarjeta',
      numeroTarjeta: '****9012',
      activo: true,
      fechaProximoCargo: '2024-11-01',
      frecuencia: 'mensual',
    },
    historialCuotas: [],
    fechaCreacion: '2024-09-01',
    fechaActualizacion: '2024-09-15',
  },
  {
    id: 'sub7',
    clienteId: 'c7',
    clienteNombre: 'Roberto Martín',
    clienteEmail: 'roberto@example.com',
    clienteTelefono: '+34600789012',
    tipo: 'membresia-gimnasio',
    planId: 'premium',
    planNombre: 'Membresía Premium',
    nivelPlan: 'premium',
    permiteFreeze: true,
    permiteMultisesion: true,
    precio: 80,
    frecuenciaPago: 'trimestral',
    fechaInicio: '2024-07-01',
    fechaVencimiento: '2025-01-01',
    proximaRenovacion: '2025-01-01',
    estado: 'activa',
    pagoRecurrente: {
      id: 'pr7',
      suscripcionId: 'sub7',
      metodoPago: 'domiciliacion',
      activo: true,
      fechaProximoCargo: '2025-01-01',
      frecuencia: 'trimestral',
    },
    historialCuotas: [],
    fechaCreacion: '2024-07-01',
    fechaActualizacion: '2024-09-30',
  },
  {
    id: 'sub8',
    clienteId: 'c8',
    clienteNombre: 'Laura Torres',
    clienteEmail: 'laura@example.com',
    clienteTelefono: '+34600890123',
    tipo: 'membresia-gimnasio',
    planId: 'basico',
    planNombre: 'Membresía Básica',
    nivelPlan: 'basico',
    permiteFreeze: false,
    permiteMultisesion: false,
    precio: 50,
    frecuenciaPago: 'mensual',
    fechaInicio: '2024-09-15',
    fechaVencimiento: '2024-10-15',
    proximaRenovacion: '2024-10-15',
    estado: 'vencida',
    pagoRecurrente: {
      id: 'pr8',
      suscripcionId: 'sub8',
      metodoPago: 'tarjeta',
      numeroTarjeta: '****7890',
      activo: false,
      frecuencia: 'mensual',
    },
    historialCuotas: [],
    fechaCreacion: '2024-09-15',
    fechaActualizacion: '2024-10-16',
  },
  {
    id: 'sub9',
    clienteId: 'c9',
    clienteNombre: 'Miguel Vargas',
    clienteEmail: 'miguel@example.com',
    clienteTelefono: '+34600901234',
    tipo: 'membresia-gimnasio',
    planId: 'vip',
    planNombre: 'Membresía VIP',
    nivelPlan: 'vip',
    permiteFreeze: true,
    permiteMultisesion: true,
    serviciosAcceso: ['gimnasio', 'spa', 'piscina'],
    precio: 120,
    frecuenciaPago: 'anual',
    fechaInicio: '2024-01-01',
    fechaVencimiento: '2025-01-01',
    proximaRenovacion: '2025-01-01',
    estado: 'activa',
    pagoRecurrente: {
      id: 'pr9',
      suscripcionId: 'sub9',
      metodoPago: 'transferencia',
      activo: true,
      fechaProximoCargo: '2025-01-01',
      frecuencia: 'anual',
    },
    historialCuotas: [],
    fechaCreacion: '2024-01-01',
    fechaActualizacion: '2024-01-15',
  },
];

export const getSuscripciones = async (
  role: 'entrenador' | 'gimnasio',
  userId?: string
): Promise<Suscripcion[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  if (role === 'entrenador') {
    // Para entrenadores: solo suscripciones PT
    return mockSuscripciones.filter(
      s => s.tipo === 'pt-mensual' && s.entrenadorId === userId
    );
  } else {
    // Para gimnasios: solo membresías de gimnasio
    return mockSuscripciones.filter(s => s.tipo === 'membresia-gimnasio');
  }
};

export const getSuscripcionById = async (id: string): Promise<Suscripcion> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const suscripcion = mockSuscripciones.find(s => s.id === id);
  if (!suscripcion) {
    throw new Error('Suscripción no encontrada');
  }
  
  return suscripcion;
};

export const createSuscripcion = async (
  data: CreateSuscripcionRequest
): Promise<Suscripcion> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const nuevaSuscripcion: Suscripcion = {
    id: `sub-${Date.now()}`,
    clienteId: data.clienteId,
    clienteNombre: 'Cliente Nuevo',
    clienteEmail: 'cliente@example.com',
    tipo: data.tipo,
    planId: data.planId,
    planNombre: `Plan ${data.planId}`,
    precio: data.precio,
    frecuenciaPago: data.frecuenciaPago,
    fechaInicio: data.fechaInicio,
    fechaVencimiento: calcularFechaVencimiento(data.fechaInicio, data.frecuenciaPago),
    proximaRenovacion: calcularFechaVencimiento(data.fechaInicio, data.frecuenciaPago),
    estado: 'activa',
    sesionesIncluidas: data.sesionesIncluidas,
    sesionesUsadas: 0,
    sesionesDisponibles: data.sesionesIncluidas,
    pagoRecurrente: data.pagoRecurrente ? {
      id: `pr-${Date.now()}`,
      suscripcionId: `sub-${Date.now()}`,
      metodoPago: data.pagoRecurrente.metodoPago,
      activo: true,
      fechaProximoCargo: calcularFechaVencimiento(data.fechaInicio, data.frecuenciaPago),
      frecuencia: data.frecuenciaPago,
    } : undefined,
    historialCuotas: [],
    entrenadorId: data.entrenadorId,
    fechaCreacion: new Date().toISOString().split('T')[0],
    fechaActualizacion: new Date().toISOString().split('T')[0],
  };
  
  return nuevaSuscripcion;
};

export const updateSuscripcion = async (
  id: string,
  data: UpdateSuscripcionRequest
): Promise<Suscripcion> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const suscripcion = mockSuscripciones.find(s => s.id === id);
  if (!suscripcion) {
    throw new Error('Suscripción no encontrada');
  }
  
  return {
    ...suscripcion,
    ...data,
    fechaActualizacion: new Date().toISOString().split('T')[0],
  };
};

export const deleteSuscripcion = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  // En producción, actualizaría el estado a 'cancelada'
};

export const upgradePlan = async (
  suscripcionId: string,
  nuevoPlanId: string,
  nuevoPrecio: number
): Promise<UpgradeDowngrade> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const suscripcion = mockSuscripciones.find(s => s.id === suscripcionId);
  if (!suscripcion) {
    throw new Error('Suscripción no encontrada');
  }
  
  const cambio: UpgradeDowngrade = {
    id: `ud-${Date.now()}`,
    suscripcionId,
    planOrigen: suscripcion.planNombre,
    planDestino: `Plan ${nuevoPlanId}`,
    fechaSolicitud: new Date().toISOString().split('T')[0],
    fechaAplicacion: new Date().toISOString().split('T')[0],
    tipoCambio: nuevoPrecio > suscripcion.precio ? 'upgrade' : 'downgrade',
    diferenciaPrecio: nuevoPrecio - suscripcion.precio,
    estado: 'aplicado',
  };
  
  return cambio;
};

export const downgradePlan = async (
  suscripcionId: string,
  nuevoPlanId: string,
  nuevoPrecio: number
): Promise<UpgradeDowngrade> => {
  return upgradePlan(suscripcionId, nuevoPlanId, nuevoPrecio);
};

export const freezeSuscripcion = async (
  data: FreezeRequest
): Promise<Suscripcion> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const suscripcion = mockSuscripciones.find(s => s.id === data.suscripcionId);
  if (!suscripcion) {
    throw new Error('Suscripción no encontrada');
  }
  
  return {
    ...suscripcion,
    estado: 'pausada',
    freezeActivo: true,
    fechaFreezeInicio: data.fechaInicio,
    fechaFreezeFin: data.fechaFin,
    diasFreezeRestantes: data.diasTotales,
    pagoRecurrente: suscripcion.pagoRecurrente ? {
      ...suscripcion.pagoRecurrente,
      activo: false,
    } : undefined,
    fechaActualizacion: new Date().toISOString().split('T')[0],
  };
};

export const unfreezeSuscripcion = async (
  suscripcionId: string
): Promise<Suscripcion> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const suscripcion = mockSuscripciones.find(s => s.id === suscripcionId);
  if (!suscripcion) {
    throw new Error('Suscripción no encontrada');
  }
  
  return {
    ...suscripcion,
    estado: 'activa',
    freezeActivo: false,
    fechaFreezeInicio: undefined,
    fechaFreezeFin: undefined,
    diasFreezeRestantes: undefined,
    pagoRecurrente: suscripcion.pagoRecurrente ? {
      ...suscripcion.pagoRecurrente,
      activo: true,
    } : undefined,
    fechaActualizacion: new Date().toISOString().split('T')[0],
  };
};

export const activarMultisesion = async (
  data: MultisesionRequest
): Promise<Suscripcion> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const suscripcion = mockSuscripciones.find(s => s.id === data.suscripcionId);
  if (!suscripcion) {
    throw new Error('Suscripción no encontrada');
  }
  
  return {
    ...suscripcion,
    multisesionActivo: true,
    serviciosMultisesion: data.servicios,
    fechaActualizacion: new Date().toISOString().split('T')[0],
  };
};

export const desactivarMultisesion = async (
  suscripcionId: string
): Promise<Suscripcion> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const suscripcion = mockSuscripciones.find(s => s.id === suscripcionId);
  if (!suscripcion) {
    throw new Error('Suscripción no encontrada');
  }
  
  return {
    ...suscripcion,
    multisesionActivo: false,
    serviciosMultisesion: undefined,
    fechaActualizacion: new Date().toISOString().split('T')[0],
  };
};

// Helper functions
function calcularFechaVencimiento(fechaInicio: string, frecuencia: string): string {
  const fecha = new Date(fechaInicio);
  
  switch (frecuencia) {
    case 'mensual':
      fecha.setMonth(fecha.getMonth() + 1);
      break;
    case 'trimestral':
      fecha.setMonth(fecha.getMonth() + 3);
      break;
    case 'semestral':
      fecha.setMonth(fecha.getMonth() + 6);
      break;
    case 'anual':
      fecha.setFullYear(fecha.getFullYear() + 1);
      break;
  }
  
  return fecha.toISOString().split('T')[0];
}

