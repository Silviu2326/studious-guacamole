import {
  Suscripcion,
  CreateSuscripcionRequest,
  UpdateSuscripcionRequest,
  UpgradeDowngrade,
  FreezeRequest,
  MultisesionRequest,
  ModificarSesionesRequest,
  AjusteSesiones,
  CambioPlanPTRequest,
  CreateTrialSuscripcionRequest,
  AñadirBonusSesionesRequest,
  BonusSesiones,
  SesionPorCaducar,
  AplicarDescuentoRequest,
  EliminarDescuentoRequest,
  DescuentoSuscripcion,
  HistorialDescuento,
  HistorialCambio,
  TipoCambio,
  CancelarSuscripcionRequest,
  MetricaCompromiso,
  ResumenMetricasCompromiso,
  NivelRiesgo,
  CreateSuscripcionGrupalRequest,
  AgregarMiembroGrupoRequest,
  RemoverMiembroGrupoRequest,
  PropuestaCambioRenovacion,
  CrearPropuestaCambioRenovacionRequest,
  TransferirSesionesRequest,
  TransferenciaSesiones,
  ConfiguracionTransferenciaSesiones,
  ResumenActividadSuscripciones,
  GenerarResumenRequest,
  ConfiguracionResumenActividad,
} from '../types';

// Helper function para registrar cambios en el historial
const registrarCambio = (
  suscripcion: Suscripcion,
  tipoCambio: TipoCambio,
  descripcion: string,
  cambios: { campo: string; valorAnterior?: any; valorNuevo?: any }[],
  motivo?: string,
  realizadoPor?: string,
  realizadoPorNombre?: string,
  metadata?: Record<string, any>
): HistorialCambio => {
  const cambio: HistorialCambio = {
    id: `cambio-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    suscripcionId: suscripcion.id,
    tipoCambio,
    fechaCambio: new Date().toISOString(),
    descripcion,
    cambios,
    motivo,
    realizadoPor,
    realizadoPorNombre,
    metadata,
  };

  const historial = suscripcion.historialCambios || [];
  historial.push(cambio);

  return cambio;
};

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
  
  const fechaVencimiento = data.isTrial && data.trialDuration
    ? calcularFechaVencimientoTrial(data.fechaInicio, data.trialDuration)
    : calcularFechaVencimiento(data.fechaInicio, data.frecuenciaPago);
  
  const nuevaSuscripcion: Suscripcion = {
    id: `sub-${Date.now()}`,
    clienteId: data.clienteId,
    clienteNombre: 'Cliente Nuevo',
    clienteEmail: 'cliente@example.com',
    tipo: data.tipo,
    planId: data.planId,
    planNombre: `Plan ${data.planId}`,
    precio: data.isTrial && data.trialPrice ? data.trialPrice : data.precio,
    frecuenciaPago: data.frecuenciaPago,
    fechaInicio: data.fechaInicio,
    fechaVencimiento,
    proximaRenovacion: fechaVencimiento,
    estado: 'activa',
    sesionesIncluidas: data.isTrial && data.trialSessions ? data.trialSessions : data.sesionesIncluidas,
    sesionesUsadas: 0,
    sesionesDisponibles: data.isTrial && data.trialSessions ? data.trialSessions : data.sesionesIncluidas,
    pagoRecurrente: data.pagoRecurrente ? {
      id: `pr-${Date.now()}`,
      suscripcionId: `sub-${Date.now()}`,
      metodoPago: data.pagoRecurrente.metodoPago,
      activo: true,
      fechaProximoCargo: fechaVencimiento,
      frecuencia: data.frecuenciaPago,
    } : undefined,
    historialCuotas: [],
    historialCambios: [],
    entrenadorId: data.entrenadorId,
    fechaCreacion: new Date().toISOString().split('T')[0],
    fechaActualizacion: new Date().toISOString().split('T')[0],
    // Campos de suscripción de prueba
    isTrial: data.isTrial || false,
    trialSessions: data.trialSessions,
    trialPrice: data.trialPrice,
    trialDuration: data.trialDuration,
    trialEndDate: data.isTrial && data.trialDuration ? fechaVencimiento : undefined,
  };
  
  // Registrar creación en el historial
  registrarCambio(
    nuevaSuscripcion,
    'creacion',
    `Suscripción creada${data.isTrial ? ' (Prueba)' : ''} - Plan: ${nuevaSuscripcion.planNombre}`,
    [
      { campo: 'estado', valorNuevo: nuevaSuscripcion.estado },
      { campo: 'precio', valorNuevo: nuevaSuscripcion.precio },
      { campo: 'plan', valorNuevo: nuevaSuscripcion.planNombre },
      { campo: 'fechaInicio', valorNuevo: nuevaSuscripcion.fechaInicio },
      { campo: 'fechaVencimiento', valorNuevo: nuevaSuscripcion.fechaVencimiento },
    ],
    undefined,
    data.entrenadorId,
    'Sistema'
  );
  
  mockSuscripciones.push(nuevaSuscripcion);
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
  
  // Detectar cambios para el historial
  const cambios: { campo: string; valorAnterior?: any; valorNuevo?: any }[] = [];
  let tipoCambio: TipoCambio = 'otro';
  let descripcion = 'Actualización de suscripción';
  
  if (data.precio !== undefined && data.precio !== suscripcion.precio) {
    cambios.push({ campo: 'precio', valorAnterior: suscripcion.precio, valorNuevo: data.precio });
    tipoCambio = 'actualizacion_precio';
    descripcion = `Precio actualizado de ${suscripcion.precio}€ a ${data.precio}€`;
  }
  
  if (data.estado !== undefined && data.estado !== suscripcion.estado) {
    cambios.push({ campo: 'estado', valorAnterior: suscripcion.estado, valorNuevo: data.estado });
    tipoCambio = 'cambio_estado';
    descripcion = `Estado cambiado de ${suscripcion.estado} a ${data.estado}`;
  }
  
  if (data.fechaVencimiento !== undefined && data.fechaVencimiento !== suscripcion.fechaVencimiento) {
    cambios.push({ 
      campo: 'fechaVencimiento', 
      valorAnterior: suscripcion.fechaVencimiento, 
      valorNuevo: data.fechaVencimiento 
    });
    tipoCambio = 'cambio_fecha_vencimiento';
    descripcion = `Fecha de vencimiento actualizada`;
  }
  
  const suscripcionActualizada = {
    ...suscripcion,
    ...data,
    fechaActualizacion: new Date().toISOString().split('T')[0],
    historialCambios: suscripcion.historialCambios || [],
  };
  
  // Registrar cambio si hay modificaciones
  if (cambios.length > 0) {
    registrarCambio(
      suscripcionActualizada,
      tipoCambio,
      descripcion,
      cambios,
      data.notas
    );
  }
  
  // Actualizar en el array
  const indice = mockSuscripciones.findIndex(s => s.id === id);
  if (indice !== -1) {
    mockSuscripciones[indice] = suscripcionActualizada;
  }
  
  return suscripcionActualizada;
};

export const deleteSuscripcion = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  // En producción, actualizaría el estado a 'cancelada'
};

// Nueva función para cancelar suscripción con motivo
export const cancelarSuscripcion = async (
  data: CancelarSuscripcionRequest
): Promise<Suscripcion> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const suscripcion = mockSuscripciones.find(s => s.id === data.suscripcionId);
  if (!suscripcion) {
    throw new Error('Suscripción no encontrada');
  }
  
  const fechaCancelacion = new Date().toISOString().split('T')[0];
  
  const suscripcionCancelada = {
    ...suscripcion,
    estado: 'cancelada' as const,
    motivoCancelacion: data.motivo,
    fechaCancelacion,
    fechaActualizacion: fechaCancelacion,
    historialCambios: suscripcion.historialCambios || [],
    pagoRecurrente: suscripcion.pagoRecurrente ? {
      ...suscripcion.pagoRecurrente,
      activo: false,
    } : undefined,
  };
  
  // Registrar cancelación en el historial
  registrarCambio(
    suscripcionCancelada,
    'cancelacion',
    `Suscripción cancelada - Motivo: ${data.motivo}`,
    [
      { campo: 'estado', valorAnterior: suscripcion.estado, valorNuevo: 'cancelada' },
      { campo: 'motivoCancelacion', valorNuevo: data.motivo },
      { campo: 'fechaCancelacion', valorNuevo: fechaCancelacion },
    ],
    data.comentariosAdicionales || data.motivo
  );
  
  // Actualizar en el array
  const indice = mockSuscripciones.findIndex(s => s.id === data.suscripcionId);
  if (indice !== -1) {
    mockSuscripciones[indice] = suscripcionCancelada;
  }
  
  return suscripcionCancelada;
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
  
  // Calcular nueva fecha de vencimiento extendiendo el período
  const fechaFinFreeze = new Date(data.fechaFin);
  const fechaVencimientoOriginal = new Date(suscripcion.fechaVencimiento);
  const diasFreeze = data.diasTotales;
  const nuevaFechaVencimiento = new Date(fechaVencimientoOriginal);
  nuevaFechaVencimiento.setDate(nuevaFechaVencimiento.getDate() + diasFreeze);
  
  const suscripcionActualizada = {
    ...suscripcion,
    estado: 'pausada',
    freezeActivo: true,
    fechaFreezeInicio: data.fechaInicio,
    fechaFreezeFin: data.fechaFin,
    diasFreezeRestantes: data.diasTotales,
    reanudacionAutomatica: true, // Habilitar reanudación automática
    fechaVencimiento: nuevaFechaVencimiento.toISOString().split('T')[0],
    proximaRenovacion: nuevaFechaVencimiento.toISOString().split('T')[0],
    pagoRecurrente: suscripcion.pagoRecurrente ? {
      ...suscripcion.pagoRecurrente,
      activo: false,
      fechaProximoCargo: nuevaFechaVencimiento.toISOString().split('T')[0],
    } : undefined,
    fechaActualizacion: new Date().toISOString().split('T')[0],
    historialCambios: suscripcion.historialCambios || [],
  };
  
  // Registrar freeze en el historial
  registrarCambio(
    suscripcionActualizada,
    'freeze',
    `Suscripción pausada (Freeze) por ${data.diasTotales} días`,
    [
      { campo: 'estado', valorAnterior: suscripcion.estado, valorNuevo: 'pausada' },
      { campo: 'freezeActivo', valorAnterior: false, valorNuevo: true },
      { campo: 'fechaFreezeInicio', valorNuevo: data.fechaInicio },
      { campo: 'fechaFreezeFin', valorNuevo: data.fechaFin },
      { campo: 'fechaVencimiento', valorAnterior: suscripcion.fechaVencimiento, valorNuevo: nuevaFechaVencimiento.toISOString().split('T')[0] },
    ],
    data.motivo
  );
  
  // Actualizar en el array
  const indice = mockSuscripciones.findIndex(s => s.id === data.suscripcionId);
  if (indice !== -1) {
    mockSuscripciones[indice] = suscripcionActualizada;
  }
  
  return suscripcionActualizada;
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

export const modificarSesiones = async (
  data: ModificarSesionesRequest
): Promise<Suscripcion> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const suscripcion = mockSuscripciones.find(s => s.id === data.suscripcionId);
  if (!suscripcion) {
    throw new Error('Suscripción no encontrada');
  }
  
  if (!suscripcion.sesionesIncluidas) {
    throw new Error('Esta suscripción no tiene sesiones incluidas');
  }
  
  const sesionesAntes = suscripcion.sesionesIncluidas + (suscripcion.sesionesAjuste || 0);
  const sesionesDespues = sesionesAntes + data.sesionesAjuste;
  const nuevoAjuste = (suscripcion.sesionesAjuste || 0) + data.sesionesAjuste;
  
  // Crear registro de ajuste
  const ajuste: AjusteSesiones = {
    id: `ajuste-${Date.now()}`,
    suscripcionId: data.suscripcionId,
    fechaAjuste: new Date().toISOString().split('T')[0],
    sesionesAjuste: data.sesionesAjuste,
    sesionesAntes,
    sesionesDespues,
    motivo: data.motivo,
    aplicado: !data.aplicarEnProximoCiclo, // Si no es para próximo ciclo, se aplica inmediatamente
  };
  
  const historialAjustes = suscripcion.historialAjustesSesiones || [];
  historialAjustes.push(ajuste);
  
  // Calcular nuevas sesiones disponibles
  const sesionesDisponiblesActuales = suscripcion.sesionesDisponibles || 0;
  const nuevasSesionesDisponibles = data.aplicarEnProximoCiclo
    ? sesionesDisponiblesActuales
    : Math.max(0, sesionesDisponiblesActuales + data.sesionesAjuste);
  
  return {
    ...suscripcion,
    sesionesAjuste: nuevoAjuste,
    sesionesIncluidas: data.aplicarEnProximoCiclo 
      ? suscripcion.sesionesIncluidas 
      : sesionesDespues,
    sesionesDisponibles: nuevasSesionesDisponibles,
    historialAjustesSesiones: historialAjustes,
    fechaActualizacion: new Date().toISOString().split('T')[0],
  };
};

// Función para verificar y reanudar automáticamente suscripciones pausadas
export const verificarReanudacionesAutomaticas = async (): Promise<Suscripcion[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  const suscripcionesParaReanudar = mockSuscripciones.filter(s => 
    s.freezeActivo && 
    s.reanudacionAutomatica && 
    s.fechaFreezeFin &&
    new Date(s.fechaFreezeFin) <= hoy &&
    s.estado === 'pausada'
  );
  
  // En producción, aquí se actualizarían las suscripciones
  return suscripcionesParaReanudar.map(s => ({
    ...s,
    estado: 'activa' as const,
    freezeActivo: false,
    fechaFreezeInicio: undefined,
    fechaFreezeFin: undefined,
    diasFreezeRestantes: undefined,
    pagoRecurrente: s.pagoRecurrente ? {
      ...s.pagoRecurrente,
      activo: true,
    } : undefined,
    fechaActualizacion: new Date().toISOString().split('T')[0],
  }));
};

export const cambiarPlanPT = async (
  data: CambioPlanPTRequest
): Promise<Suscripcion> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const suscripcion = mockSuscripciones.find(s => s.id === data.suscripcionId);
  if (!suscripcion) {
    throw new Error('Suscripción no encontrada');
  }
  
  if (suscripcion.tipo !== 'pt-mensual') {
    throw new Error('Esta función solo es válida para suscripciones PT');
  }
  
  const sesionesActualesDisponibles = suscripcion.sesionesDisponibles || 0;
  const sesionesActualesIncluidas = suscripcion.sesionesIncluidas || 0;
  const diferenciaSesiones = data.nuevoSesiones - sesionesActualesIncluidas;
  
  // Calcular nuevas sesiones disponibles según el tipo de cambio
  let nuevasSesionesDisponibles: number;
  let nuevasSesionesIncluidas: number;
  
  if (data.aplicarInmediatamente) {
    if (diferenciaSesiones > 0) {
      // Upgrade: añadir las nuevas sesiones
      nuevasSesionesDisponibles = sesionesActualesDisponibles + diferenciaSesiones;
      nuevasSesionesIncluidas = data.nuevoSesiones;
    } else {
      // Downgrade: mantener las sesiones disponibles hasta que se usen, pero no renovar
      nuevasSesionesDisponibles = Math.min(sesionesActualesDisponibles, data.nuevoSesiones);
      nuevasSesionesIncluidas = data.nuevoSesiones;
    }
  } else {
    // Aplicar en próxima renovación: mantener todo igual por ahora
    nuevasSesionesDisponibles = sesionesActualesDisponibles;
    nuevasSesionesIncluidas = sesionesActualesIncluidas;
  }
  
  // Buscar el nombre del plan
  const nombresPlanes: Record<string, string> = {
    'pt-4': 'Paquete Mensual 4 Sesiones',
    'pt-8': 'Paquete Mensual 8 Sesiones',
    'pt-12': 'Paquete Mensual 12 Sesiones',
  };
  
  const suscripcionActualizada = {
    ...suscripcion,
    planId: data.nuevoPlanId,
    planNombre: nombresPlanes[data.nuevoPlanId] || `Plan ${data.nuevoPlanId}`,
    precio: data.nuevoPrecio,
    sesionesIncluidas: nuevasSesionesIncluidas,
    sesionesDisponibles: nuevasSesionesDisponibles,
    fechaActualizacion: new Date().toISOString().split('T')[0],
    historialCambios: suscripcion.historialCambios || [],
    notas: data.motivo 
      ? `${suscripcion.notas || ''}\n[${new Date().toLocaleDateString('es-ES')}] Cambio de plan: ${data.motivo}`.trim()
      : suscripcion.notas,
  };
  
  // Registrar cambio de plan en el historial
  registrarCambio(
    suscripcionActualizada,
    'cambio_plan',
    `Cambio de plan de "${suscripcion.planNombre}" a "${suscripcionActualizada.planNombre}"`,
    [
      { campo: 'planId', valorAnterior: suscripcion.planId, valorNuevo: data.nuevoPlanId },
      { campo: 'planNombre', valorAnterior: suscripcion.planNombre, valorNuevo: suscripcionActualizada.planNombre },
      { campo: 'precio', valorAnterior: suscripcion.precio, valorNuevo: data.nuevoPrecio },
      { campo: 'sesionesIncluidas', valorAnterior: suscripcion.sesionesIncluidas, valorNuevo: nuevasSesionesIncluidas },
    ],
    data.motivo
  );
  
  // Actualizar la suscripción en el array mock
  const indice = mockSuscripciones.findIndex(s => s.id === data.suscripcionId);
  if (indice !== -1) {
    mockSuscripciones[indice] = suscripcionActualizada;
  }
  
  return suscripcionActualizada;
};

// User Story 1: Crear suscripción de prueba
export const createTrialSuscripcion = async (
  data: CreateTrialSuscripcionRequest
): Promise<Suscripcion> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const fechaVencimiento = calcularFechaVencimientoTrial(data.fechaInicio, data.trialDuration);
  
  const nuevaSuscripcion: Suscripcion = {
    id: `sub-trial-${Date.now()}`,
    clienteId: data.clienteId,
    clienteNombre: data.clienteNombre || 'Cliente Nuevo',
    clienteEmail: data.clienteEmail || 'cliente@example.com',
    clienteTelefono: data.clienteTelefono,
    tipo: 'pt-mensual',
    planId: data.planId,
    planNombre: data.planNombre || `Suscripción de Prueba - ${data.trialSessions} sesiones`,
    precio: data.trialPrice,
    frecuenciaPago: 'mensual', // Las pruebas suelen ser mensuales
    fechaInicio: data.fechaInicio,
    fechaVencimiento,
    proximaRenovacion: fechaVencimiento,
    estado: 'activa',
    sesionesIncluidas: data.trialSessions,
    sesionesUsadas: 0,
    sesionesDisponibles: data.trialSessions,
    pagoRecurrente: data.pagoRecurrente ? {
      id: `pr-trial-${Date.now()}`,
      suscripcionId: `sub-trial-${Date.now()}`,
      metodoPago: data.pagoRecurrente.metodoPago,
      activo: true,
      fechaProximoCargo: fechaVencimiento,
      frecuencia: 'mensual',
    } : undefined,
    historialCuotas: [],
    entrenadorId: data.entrenadorId,
    fechaCreacion: new Date().toISOString().split('T')[0],
    fechaActualizacion: new Date().toISOString().split('T')[0],
    notas: data.notas,
    // Campos de suscripción de prueba
    isTrial: true,
    trialSessions: data.trialSessions,
    trialPrice: data.trialPrice,
    trialDuration: data.trialDuration,
    trialEndDate: fechaVencimiento,
  };
  
  mockSuscripciones.push(nuevaSuscripcion);
  return nuevaSuscripcion;
};

// User Story 2: Añadir sesiones bonus
export const añadirBonusSesiones = async (
  data: AñadirBonusSesionesRequest
): Promise<Suscripcion> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const suscripcion = mockSuscripciones.find(s => s.id === data.suscripcionId);
  if (!suscripcion) {
    throw new Error('Suscripción no encontrada');
  }
  
  if (!suscripcion.sesionesIncluidas) {
    throw new Error('Esta suscripción no tiene sesiones incluidas');
  }
  
  const sesionesBonusActuales = suscripcion.sesionesBonus || 0;
  const sesionesDisponiblesActuales = suscripcion.sesionesDisponibles || 0;
  const nuevasSesionesBonus = sesionesBonusActuales + data.cantidadSesiones;
  const nuevasSesionesDisponibles = sesionesDisponiblesActuales + data.cantidadSesiones;
  
  // Crear registro de bonus
  const bonus: BonusSesiones = {
    id: `bonus-${Date.now()}`,
    suscripcionId: data.suscripcionId,
    fechaAñadido: new Date().toISOString().split('T')[0],
    cantidadSesiones: data.cantidadSesiones,
    sesionesAntes: sesionesBonusActuales,
    sesionesDespues: nuevasSesionesBonus,
    motivo: data.motivo,
    usado: false,
  };
  
  const historialBonus = suscripcion.historialBonusSesiones || [];
  historialBonus.push(bonus);
  
  // Actualizar la suscripción en el array mock
  const indice = mockSuscripciones.findIndex(s => s.id === data.suscripcionId);
  if (indice !== -1) {
    mockSuscripciones[indice] = {
      ...suscripcion,
      sesionesBonus: nuevasSesionesBonus,
      sesionesDisponibles: nuevasSesionesDisponibles,
      historialBonusSesiones: historialBonus,
      fechaActualizacion: new Date().toISOString().split('T')[0],
    };
  }
  
  return mockSuscripciones[indice] || suscripcion;
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

function calcularFechaVencimientoTrial(fechaInicio: string, duracionDias: number): string {
  const fecha = new Date(fechaInicio);
  fecha.setDate(fecha.getDate() + duracionDias);
  return fecha.toISOString().split('T')[0];
}

// User Story 1: Obtener sesiones por caducar
export const getSesionesPorCaducar = async (
  entrenadorId?: string,
  diasAnticipacion: number = 7
): Promise<SesionPorCaducar[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  // Filtrar suscripciones PT activas con sesiones disponibles
  const suscripcionesRelevantes = mockSuscripciones.filter(s => {
    if (s.tipo !== 'pt-mensual') return false;
    if (s.estado !== 'activa') return false;
    if (!s.sesionesDisponibles || s.sesionesDisponibles === 0) return false;
    if (entrenadorId && s.entrenadorId !== entrenadorId) return false;
    
    // Verificar si está por caducar
    const fechaVencimiento = new Date(s.fechaVencimiento);
    fechaVencimiento.setHours(0, 0, 0, 0);
    const diffDias = Math.ceil((fechaVencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    
    return diffDias >= 0 && diffDias <= diasAnticipacion;
  });
  
  return suscripcionesRelevantes.map(s => {
    const fechaVencimiento = new Date(s.fechaVencimiento);
    fechaVencimiento.setHours(0, 0, 0, 0);
    const diffDias = Math.ceil((fechaVencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      suscripcionId: s.id,
      clienteId: s.clienteId,
      clienteNombre: s.clienteNombre,
      clienteEmail: s.clienteEmail,
      clienteTelefono: s.clienteTelefono,
      sesionesDisponibles: s.sesionesDisponibles || 0,
      sesionesIncluidas: s.sesionesIncluidas || 0,
      fechaVencimiento: s.fechaVencimiento,
      diasRestantes: diffDias,
      entrenadorId: s.entrenadorId,
    };
  });
};

// User Story 2: Aplicar descuento personalizado
export const aplicarDescuento = async (
  data: AplicarDescuentoRequest
): Promise<Suscripcion> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const suscripcion = mockSuscripciones.find(s => s.id === data.suscripcionId);
  if (!suscripcion) {
    throw new Error('Suscripción no encontrada');
  }
  
  // Guardar precio original si no existe
  const precioOriginal = suscripcion.precioOriginal || suscripcion.precio;
  
  // Calcular nuevo precio
  let nuevoPrecio: number;
  if (data.tipo === 'porcentaje') {
    if (data.valor < 0 || data.valor > 100) {
      throw new Error('El porcentaje debe estar entre 0 y 100');
    }
    nuevoPrecio = precioOriginal * (1 - data.valor / 100);
  } else {
    // Descuento fijo
    if (data.valor < 0 || data.valor > precioOriginal) {
      throw new Error('El descuento fijo no puede ser mayor al precio original');
    }
    nuevoPrecio = precioOriginal - data.valor;
  }
  
  // Redondear a 2 decimales
  nuevoPrecio = Math.round(nuevoPrecio * 100) / 100;
  
  // Crear descuento
  const descuento: DescuentoSuscripcion = {
    id: `desc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    tipo: data.tipo,
    valor: data.valor,
    motivo: data.motivo,
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaFin: data.fechaFin,
  };
  
  // Crear registro en historial
  const historialDescuento: HistorialDescuento = {
    id: `hist-desc-${Date.now()}`,
    suscripcionId: data.suscripcionId,
    descuento,
    fechaAplicacion: new Date().toISOString().split('T')[0],
    precioAntes: suscripcion.precio,
    precioDespues: nuevoPrecio,
    motivo: data.motivo,
  };
  
  const historialDescuentos = suscripcion.historialDescuentos || [];
  historialDescuentos.push(historialDescuento);
  
  // Actualizar la suscripción en el array mock
  const indice = mockSuscripciones.findIndex(s => s.id === data.suscripcionId);
  if (indice !== -1) {
    mockSuscripciones[indice] = {
      ...suscripcion,
      precio: nuevoPrecio,
      precioOriginal,
      descuento,
      historialDescuentos,
      fechaActualizacion: new Date().toISOString().split('T')[0],
    };
  }
  
  return mockSuscripciones[indice] || suscripcion;
};

// User Story 2: Eliminar descuento
export const eliminarDescuento = async (
  data: EliminarDescuentoRequest
): Promise<Suscripcion> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const suscripcion = mockSuscripciones.find(s => s.id === data.suscripcionId);
  if (!suscripcion) {
    throw new Error('Suscripción no encontrada');
  }
  
  if (!suscripcion.descuento) {
    throw new Error('Esta suscripción no tiene descuento aplicado');
  }
  
  // Restaurar precio original
  const precioOriginal = suscripcion.precioOriginal || suscripcion.precio;
  const nuevoPrecio = precioOriginal;
  
  // Actualizar historial
  const historialDescuentos = suscripcion.historialDescuentos || [];
  const ultimoDescuento = historialDescuentos[historialDescuentos.length - 1];
  if (ultimoDescuento && !ultimoDescuento.fechaEliminacion) {
    ultimoDescuento.fechaEliminacion = new Date().toISOString().split('T')[0];
  }
  
  // Actualizar la suscripción en el array mock
  const indice = mockSuscripciones.findIndex(s => s.id === data.suscripcionId);
  if (indice !== -1) {
    mockSuscripciones[indice] = {
      ...suscripcion,
      precio: nuevoPrecio,
      descuento: undefined,
      historialDescuentos,
      fechaActualizacion: new Date().toISOString().split('T')[0],
    };
  }
  
  return mockSuscripciones[indice] || suscripcion;
};

// User Story 2: Verificar y eliminar descuentos expirados
export const verificarDescuentosExpirados = async (): Promise<Suscripcion[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  const suscripcionesConDescuentoExpirado = mockSuscripciones.filter(s => {
    if (!s.descuento || !s.descuento.fechaFin) return false;
    
    const fechaFin = new Date(s.descuento.fechaFin);
    fechaFin.setHours(0, 0, 0, 0);
    
    return fechaFin < hoy;
  });
  
  // Eliminar descuentos expirados
  for (const suscripcion of suscripcionesConDescuentoExpirado) {
    await eliminarDescuento({
      suscripcionId: suscripcion.id,
      motivo: 'Descuento expirado automáticamente',
    });
  }
  
  return suscripcionesConDescuentoExpirado;
};

// User Story 1: Obtener métricas de compromiso
export const getMetricasCompromiso = async (
  entrenadorId?: string
): Promise<ResumenMetricasCompromiso> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Filtrar suscripciones activas del entrenador
  const suscripciones = entrenadorId
    ? mockSuscripciones.filter(s => s.entrenadorId === entrenadorId && s.estado === 'activa' && s.tipo === 'pt-mensual')
    : mockSuscripciones.filter(s => s.estado === 'activa' && s.tipo === 'pt-mensual');
  
  const hoy = new Date();
  const metricas: MetricaCompromiso[] = [];
  
  for (const suscripcion of suscripciones) {
    // Calcular métricas de uso
    const sesionesIncluidas = suscripcion.sesionesIncluidas || 0;
    const sesionesUsadas = suscripcion.sesionesUsadas || 0;
    const mesesActivo = Math.max(1, Math.floor((hoy.getTime() - new Date(suscripcion.fechaInicio).getTime()) / (1000 * 60 * 60 * 24 * 30)));
    const sesionesIncluidasUltimos3Meses = sesionesIncluidas * Math.min(3, mesesActivo);
    const sesionesUsadasUltimos3Meses = Math.floor(sesionesUsadas * (Math.min(3, mesesActivo) / mesesActivo));
    const tasaUsoSesiones = sesionesIncluidasUltimos3Meses > 0 
      ? (sesionesUsadasUltimos3Meses / sesionesIncluidasUltimos3Meses) * 100 
      : 0;
    const promedioSesionesPorMes = mesesActivo > 0 ? sesionesUsadas / mesesActivo : 0;
    
    // Calcular días desde última sesión (simulado)
    const diasDesdeUltimaSesion = sesionesUsadas > 0 
      ? Math.floor(Math.random() * 30) + 1 
      : Math.floor((hoy.getTime() - new Date(suscripcion.fechaInicio).getTime()) / (1000 * 60 * 60 * 24));
    
    // Calcular métricas de asistencia (simulado)
    const sesionesProgramadas = sesionesUsadas + Math.floor(Math.random() * 5);
    const sesionesAsistidas = sesionesUsadas;
    const sesionesCanceladas = Math.floor(Math.random() * 3);
    const sesionesNoAsistidas = sesionesProgramadas - sesionesAsistidas - sesionesCanceladas;
    const tasaAsistencia = sesionesProgramadas > 0 
      ? (sesionesAsistidas / sesionesProgramadas) * 100 
      : 0;
    
    // Calcular métricas de pago
    const historialCuotas = suscripcion.historialCuotas || [];
    const pagosPuntuales = historialCuotas.filter(c => c.estado === 'pagada' && c.fechaPago && c.fechaVencimiento && new Date(c.fechaPago) <= new Date(c.fechaVencimiento)).length;
    const pagosAtrasados = historialCuotas.filter(c => c.estado === 'pagada' && c.fechaPago && c.fechaVencimiento && new Date(c.fechaPago) > new Date(c.fechaVencimiento)).length;
    const pagosFallidos = historialCuotas.filter(c => c.estado === 'fallida').length;
    const totalPagos = historialCuotas.length || 1;
    const tasaPagosPuntuales = (pagosPuntuales / totalPagos) * 100;
    
    // Calcular métricas de tiempo
    const diasComoCliente = Math.floor((hoy.getTime() - new Date(suscripcion.fechaInicio).getTime()) / (1000 * 60 * 60 * 24));
    const ultimaInteraccion = suscripcion.fechaActualizacion || suscripcion.fechaInicio;
    
    // Calcular puntuación de compromiso (0-100)
    let puntuacionCompromiso = 50; // Base
    
    // Factores positivos
    if (tasaUsoSesiones > 80) puntuacionCompromiso += 20;
    else if (tasaUsoSesiones > 50) puntuacionCompromiso += 10;
    
    if (tasaAsistencia > 90) puntuacionCompromiso += 15;
    else if (tasaAsistencia > 70) puntuacionCompromiso += 7;
    
    if (tasaPagosPuntuales > 90) puntuacionCompromiso += 15;
    else if (tasaPagosPuntuales > 70) puntuacionCompromiso += 7;
    
    if (diasDesdeUltimaSesion < 7) puntuacionCompromiso += 10;
    else if (diasDesdeUltimaSesion < 14) puntuacionCompromiso += 5;
    
    // Factores negativos
    if (tasaUsoSesiones < 30) puntuacionCompromiso -= 20;
    else if (tasaUsoSesiones < 50) puntuacionCompromiso -= 10;
    
    if (diasDesdeUltimaSesion > 30) puntuacionCompromiso -= 20;
    else if (diasDesdeUltimaSesion > 14) puntuacionCompromiso -= 10;
    
    if (pagosFallidos > 0) puntuacionCompromiso -= 15;
    if (pagosAtrasados > 2) puntuacionCompromiso -= 10;
    
    if (tasaAsistencia < 50) puntuacionCompromiso -= 15;
    
    puntuacionCompromiso = Math.max(0, Math.min(100, puntuacionCompromiso));
    
    // Determinar nivel de riesgo
    let nivelRiesgo: NivelRiesgo = 'bajo';
    const factoresRiesgo: string[] = [];
    
    if (puntuacionCompromiso < 30) {
      nivelRiesgo = 'critico';
    } else if (puntuacionCompromiso < 50) {
      nivelRiesgo = 'alto';
    } else if (puntuacionCompromiso < 70) {
      nivelRiesgo = 'medio';
    }
    
    if (tasaUsoSesiones < 30) factoresRiesgo.push('Bajo uso de sesiones');
    if (diasDesdeUltimaSesion > 30) factoresRiesgo.push('Sin actividad reciente');
    if (pagosFallidos > 0) factoresRiesgo.push('Pagos fallidos');
    if (pagosAtrasados > 2) factoresRiesgo.push('Múltiples pagos atrasados');
    if (tasaAsistencia < 50) factoresRiesgo.push('Baja asistencia');
    if (sesionesDisponibles > (sesionesIncluidas * 0.8)) factoresRiesgo.push('Acumulación de sesiones');
    
    metricas.push({
      suscripcionId: suscripcion.id,
      clienteId: suscripcion.clienteId,
      clienteNombre: suscripcion.clienteNombre,
      clienteEmail: suscripcion.clienteEmail,
      clienteTelefono: suscripcion.clienteTelefono,
      tasaUsoSesiones: Math.round(tasaUsoSesiones * 10) / 10,
      sesionesUsadasUltimos3Meses,
      sesionesIncluidasUltimos3Meses,
      diasDesdeUltimaSesion,
      promedioSesionesPorMes: Math.round(promedioSesionesPorMes * 10) / 10,
      tasaAsistencia: Math.round(tasaAsistencia * 10) / 10,
      sesionesProgramadas,
      sesionesAsistidas,
      sesionesCanceladas,
      sesionesNoAsistidas,
      pagosPuntuales,
      pagosAtrasados,
      pagosFallidos,
      tasaPagosPuntuales: Math.round(tasaPagosPuntuales * 10) / 10,
      diasComoCliente,
      mesesActivo,
      ultimaInteraccion,
      puntuacionCompromiso: Math.round(puntuacionCompromiso),
      nivelRiesgo,
      factoresRiesgo,
      entrenadorId: suscripcion.entrenadorId,
      fechaCalculo: hoy.toISOString(),
    });
  }
  
  // Calcular resumen
  const totalClientes = metricas.length;
  const clientesEnRiesgo = metricas.filter(m => m.nivelRiesgo !== 'bajo').length;
  const clientesRiesgoAlto = metricas.filter(m => m.nivelRiesgo === 'alto').length;
  const clientesRiesgoCritico = metricas.filter(m => m.nivelRiesgo === 'critico').length;
  const tasaCompromisoPromedio = metricas.length > 0
    ? metricas.reduce((sum, m) => sum + m.puntuacionCompromiso, 0) / metricas.length
    : 0;
  const tasaUsoPromedio = metricas.length > 0
    ? metricas.reduce((sum, m) => sum + m.tasaUsoSesiones, 0) / metricas.length
    : 0;
  const tasaAsistenciaPromedio = metricas.length > 0
    ? metricas.reduce((sum, m) => sum + m.tasaAsistencia, 0) / metricas.length
    : 0;
  const tasaPagosPuntualesPromedio = metricas.length > 0
    ? metricas.reduce((sum, m) => sum + m.tasaPagosPuntuales, 0) / metricas.length
    : 0;
  
  return {
    totalClientes,
    clientesEnRiesgo,
    clientesRiesgoAlto,
    clientesRiesgoCritico,
    tasaCompromisoPromedio: Math.round(tasaCompromisoPromedio * 10) / 10,
    tasaUsoPromedio: Math.round(tasaUsoPromedio * 10) / 10,
    tasaAsistenciaPromedio: Math.round(tasaAsistenciaPromedio * 10) / 10,
    tasaPagosPuntualesPromedio: Math.round(tasaPagosPuntualesPromedio * 10) / 10,
    metricas,
  };
};

// User Story 2: Crear suscripción grupal
export const createSuscripcionGrupal = async (
  data: CreateSuscripcionGrupalRequest
): Promise<Suscripcion> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const grupoId = `grupo-${Date.now()}`;
  const fechaVencimiento = calcularFechaVencimiento(data.fechaInicio, data.frecuenciaPago);
  
  // Calcular precio total sin descuento
  const precioTotalSinDescuento = data.miembros.reduce((sum, m) => {
    // Precio estimado basado en sesiones (simulado)
    const precioPorMiembro = (m.sesionesIncluidas || 4) * 37.5; // 150€ / 4 sesiones
    return sum + precioPorMiembro;
  }, 0);
  
  // Aplicar descuento grupal
  let precioTotal = precioTotalSinDescuento;
  if (data.descuentoGrupo.tipo === 'porcentaje') {
    precioTotal = precioTotalSinDescuento * (1 - data.descuentoGrupo.valor / 100);
  } else {
    precioTotal = precioTotalSinDescuento - data.descuentoGrupo.valor;
  }
  
  // Crear suscripción principal del grupo
  const suscripcionPrincipal: Suscripcion = {
    id: `sub-grupo-${Date.now()}`,
    clienteId: data.clientePrincipalId,
    clienteNombre: 'Cliente Principal',
    clienteEmail: 'principal@example.com',
    tipo: 'pt-mensual',
    planId: 'grupo',
    planNombre: `Suscripción Grupal: ${data.nombreGrupo}`,
    precio: precioTotal,
    precioOriginal: precioTotalSinDescuento,
    frecuenciaPago: data.frecuenciaPago,
    fechaInicio: data.fechaInicio,
    fechaVencimiento,
    proximaRenovacion: fechaVencimiento,
    estado: 'activa',
    esGrupal: true,
    grupoId,
    descuentoGrupo: {
      tipo: data.descuentoGrupo.tipo,
      valor: data.descuentoGrupo.valor,
      numeroMiembrosMinimo: data.miembros.length,
      aplicado: true,
    },
    miembrosGrupo: data.miembros.map((m, index) => ({
      id: `miembro-${Date.now()}-${index}`,
      clienteId: m.clienteId,
      clienteNombre: m.clienteNombre || 'Miembro',
      clienteEmail: m.clienteEmail || 'miembro@example.com',
      clienteTelefono: m.clienteTelefono,
      suscripcionId: `sub-miembro-${Date.now()}-${index}`,
      fechaAgregado: data.fechaInicio,
      activo: true,
    })),
    pagoRecurrente: data.pagoRecurrente ? {
      id: `pr-grupo-${Date.now()}`,
      suscripcionId: `sub-grupo-${Date.now()}`,
      metodoPago: data.pagoRecurrente.metodoPago,
      activo: true,
      fechaProximoCargo: fechaVencimiento,
      frecuencia: data.frecuenciaPago,
    } : undefined,
    historialCuotas: [],
    historialCambios: [],
    entrenadorId: data.entrenadorId,
    fechaCreacion: new Date().toISOString().split('T')[0],
    fechaActualizacion: new Date().toISOString().split('T')[0],
    notas: data.notas,
  };
  
  // Crear suscripciones individuales para cada miembro
  for (const miembro of data.miembros) {
    const precioPorMiembro = precioTotal / data.miembros.length;
    const suscripcionMiembro: Suscripcion = {
      id: `sub-miembro-${Date.now()}-${miembro.clienteId}`,
      clienteId: miembro.clienteId,
      clienteNombre: miembro.clienteNombre || 'Miembro',
      clienteEmail: miembro.clienteEmail || 'miembro@example.com',
      clienteTelefono: miembro.clienteTelefono,
      tipo: 'pt-mensual',
      planId: miembro.planId,
      planNombre: `Plan ${miembro.planId} (Grupo: ${data.nombreGrupo})`,
      precio: precioPorMiembro,
      frecuenciaPago: data.frecuenciaPago,
      fechaInicio: data.fechaInicio,
      fechaVencimiento,
      proximaRenovacion: fechaVencimiento,
      estado: 'activa',
      esGrupal: false,
      grupoId,
      sesionesIncluidas: miembro.sesionesIncluidas,
      sesionesUsadas: 0,
      sesionesDisponibles: miembro.sesionesIncluidas,
      historialCuotas: [],
      historialCambios: [],
      entrenadorId: data.entrenadorId,
      fechaCreacion: new Date().toISOString().split('T')[0],
      fechaActualizacion: new Date().toISOString().split('T')[0],
    };
    
    mockSuscripciones.push(suscripcionMiembro);
  }
  
  // Registrar creación en el historial
  registrarCambio(
    suscripcionPrincipal,
    'creacion',
    `Suscripción grupal creada: ${data.nombreGrupo} con ${data.miembros.length} miembros`,
    [
      { campo: 'estado', valorNuevo: suscripcionPrincipal.estado },
      { campo: 'precio', valorNuevo: suscripcionPrincipal.precio },
      { campo: 'descuentoGrupo', valorNuevo: suscripcionPrincipal.descuentoGrupo },
      { campo: 'miembros', valorNuevo: data.miembros.length },
    ],
    undefined,
    data.entrenadorId,
    'Sistema'
  );
  
  mockSuscripciones.push(suscripcionPrincipal);
  return suscripcionPrincipal;
};

// User Story 2: Agregar miembro a grupo
export const agregarMiembroGrupo = async (
  data: AgregarMiembroGrupoRequest
): Promise<Suscripcion> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const suscripcionPrincipal = mockSuscripciones.find(s => s.grupoId === data.grupoId && s.esGrupal);
  if (!suscripcionPrincipal) {
    throw new Error('Grupo no encontrado');
  }
  
  // Crear suscripción individual para el nuevo miembro
  const precioPorMiembro = suscripcionPrincipal.precio / ((suscripcionPrincipal.miembrosGrupo?.length || 0) + 1);
  const fechaVencimiento = suscripcionPrincipal.fechaVencimiento;
  
  const suscripcionMiembro: Suscripcion = {
    id: `sub-miembro-${Date.now()}-${data.clienteId}`,
    clienteId: data.clienteId,
    clienteNombre: data.clienteNombre || 'Miembro',
    clienteEmail: data.clienteEmail || 'miembro@example.com',
    clienteTelefono: data.clienteTelefono,
    tipo: 'pt-mensual',
    planId: data.planId,
    planNombre: `Plan ${data.planId} (Grupo)`,
    precio: precioPorMiembro,
    frecuenciaPago: suscripcionPrincipal.frecuenciaPago,
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaVencimiento,
    proximaRenovacion: fechaVencimiento,
    estado: 'activa',
    esGrupal: false,
    grupoId: data.grupoId,
    sesionesIncluidas: data.sesionesIncluidas,
    sesionesUsadas: 0,
    sesionesDisponibles: data.sesionesIncluidas,
    historialCuotas: [],
    historialCambios: [],
    entrenadorId: suscripcionPrincipal.entrenadorId,
    fechaCreacion: new Date().toISOString().split('T')[0],
    fechaActualizacion: new Date().toISOString().split('T')[0],
  };
  
  mockSuscripciones.push(suscripcionMiembro);
  
  // Actualizar suscripción principal
  const nuevosMiembros = [...(suscripcionPrincipal.miembrosGrupo || []), {
    id: `miembro-${Date.now()}`,
    clienteId: data.clienteId,
    clienteNombre: data.clienteNombre || 'Miembro',
    clienteEmail: data.clienteEmail || 'miembro@example.com',
    clienteTelefono: data.clienteTelefono,
    suscripcionId: suscripcionMiembro.id,
    fechaAgregado: new Date().toISOString().split('T')[0],
    activo: true,
  }];
  
  const indice = mockSuscripciones.findIndex(s => s.id === suscripcionPrincipal.id);
  if (indice !== -1) {
    mockSuscripciones[indice] = {
      ...suscripcionPrincipal,
      miembrosGrupo: nuevosMiembros,
      fechaActualizacion: new Date().toISOString().split('T')[0],
    };
  }
  
  return mockSuscripciones[indice] || suscripcionPrincipal;
};

// User Story 2: Remover miembro de grupo
export const removerMiembroGrupo = async (
  data: RemoverMiembroGrupoRequest
): Promise<Suscripcion> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const suscripcionPrincipal = mockSuscripciones.find(s => s.grupoId === data.grupoId && s.esGrupal);
  if (!suscripcionPrincipal) {
    throw new Error('Grupo no encontrado');
  }
  
  // Marcar miembro como inactivo
  const miembros = suscripcionPrincipal.miembrosGrupo || [];
  const miembro = miembros.find(m => m.id === data.miembroId);
  if (!miembro) {
    throw new Error('Miembro no encontrado');
  }
  
  // Actualizar suscripción del miembro
  const suscripcionMiembro = mockSuscripciones.find(s => s.id === miembro.suscripcionId);
  if (suscripcionMiembro) {
    const indiceMiembro = mockSuscripciones.findIndex(s => s.id === miembro.suscripcionId);
    if (indiceMiembro !== -1) {
      mockSuscripciones[indiceMiembro] = {
        ...suscripcionMiembro,
        estado: 'cancelada',
        fechaActualizacion: new Date().toISOString().split('T')[0],
      };
    }
  }
  
  // Actualizar suscripción principal
  const miembrosActualizados = miembros.map(m => 
    m.id === data.miembroId ? { ...m, activo: false } : m
  );
  
  const indice = mockSuscripciones.findIndex(s => s.id === suscripcionPrincipal.id);
  if (indice !== -1) {
    mockSuscripciones[indice] = {
      ...suscripcionPrincipal,
      miembrosGrupo: miembrosActualizados,
      fechaActualizacion: new Date().toISOString().split('T')[0],
    };
  }
  
  return mockSuscripciones[indice] || suscripcionPrincipal;
};

// User Story 2: Obtener suscripciones grupales
export const getSuscripcionesGrupales = async (
  entrenadorId?: string
): Promise<Suscripcion[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return mockSuscripciones.filter(s => 
    s.esGrupal === true && 
    (!entrenadorId || s.entrenadorId === entrenadorId)
  );
};

// User Story: Propuesta de cambio antes de renovación
// Mock data para propuestas
const mockPropuestas: PropuestaCambioRenovacion[] = [
  {
    id: 'prop1',
    suscripcionId: 'sub1',
    clienteId: 'c1',
    clienteNombre: 'Juan Pérez',
    clienteEmail: 'juan@example.com',
    tipoCambio: 'plan',
    nuevoPlanId: 'pt-8',
    nuevoPlanNombre: 'Paquete Mensual 8 Sesiones',
    nuevoPrecio: 280,
    nuevoSesiones: 8,
    fechaRenovacion: '2024-11-01',
    fechaCreacion: '2024-10-20',
    estado: 'pendiente',
    entrenadorId: 'trainer1',
  },
  {
    id: 'prop2',
    suscripcionId: 'sub2',
    clienteId: 'c2',
    clienteNombre: 'María García',
    clienteEmail: 'maria@example.com',
    tipoCambio: 'descuento',
    descuento: {
      tipo: 'porcentaje',
      valor: 10,
      motivo: 'Fidelidad del cliente',
    },
    fechaRenovacion: '2024-11-15',
    fechaCreacion: '2024-10-25',
    estado: 'aceptada',
    fechaAceptacion: '2024-10-26',
    entrenadorId: 'trainer1',
  },
];

export const crearPropuestaCambioRenovacion = async (
  data: CrearPropuestaCambioRenovacionRequest
): Promise<PropuestaCambioRenovacion> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const suscripcion = mockSuscripciones.find(s => s.id === data.suscripcionId);
  if (!suscripcion) {
    throw new Error('Suscripción no encontrada');
  }

  // Obtener información del nuevo plan si es cambio de plan
  let nuevoPlanNombre: string | undefined;
  let nuevoSesiones: number | undefined;
  
  if (data.tipoCambio === 'plan' && data.nuevoPlanId) {
    const planes = [
      { id: 'pt-4', nombre: 'Paquete Mensual 4 Sesiones', sesiones: 4 },
      { id: 'pt-8', nombre: 'Paquete Mensual 8 Sesiones', sesiones: 8 },
      { id: 'pt-12', nombre: 'Paquete Mensual 12 Sesiones', sesiones: 12 },
    ];
    const plan = planes.find(p => p.id === data.nuevoPlanId);
    if (plan) {
      nuevoPlanNombre = plan.nombre;
      nuevoSesiones = plan.sesiones;
    }
  }

  const propuesta: PropuestaCambioRenovacion = {
    id: `prop-${Date.now()}`,
    suscripcionId: data.suscripcionId,
    clienteId: suscripcion.clienteId,
    clienteNombre: suscripcion.clienteNombre,
    clienteEmail: suscripcion.clienteEmail,
    clienteTelefono: suscripcion.clienteTelefono,
    tipoCambio: data.tipoCambio,
    nuevoPlanId: data.nuevoPlanId,
    nuevoPlanNombre,
    nuevoPrecio: data.nuevoPrecio,
    nuevoSesiones,
    precioActual: suscripcion.precio,
    precioNuevo: data.nuevoPrecio,
    descuento: data.descuento,
    mensajePersonalizado: data.mensajePersonalizado,
    fechaRenovacion: suscripcion.proximaRenovacion || suscripcion.fechaVencimiento,
    fechaCreacion: new Date().toISOString(),
    fechaVencimiento: data.fechaVencimiento,
    estado: 'pendiente',
    entrenadorId: suscripcion.entrenadorId,
  };

  mockPropuestas.push(propuesta);
  
  return propuesta;
};

export const getPropuestasCambioRenovacion = async (
  entrenadorId?: string
): Promise<PropuestaCambioRenovacion[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let propuestas = mockPropuestas;
  
  if (entrenadorId) {
    propuestas = propuestas.filter(p => p.entrenadorId === entrenadorId);
  }
  
  // Verificar propuestas expiradas
  const hoy = new Date();
  propuestas.forEach(propuesta => {
    if (propuesta.estado === 'pendiente' && propuesta.fechaVencimiento) {
      const fechaVencimiento = new Date(propuesta.fechaVencimiento);
      if (fechaVencimiento < hoy) {
        propuesta.estado = 'expirada';
      }
    }
  });
  
  return propuestas;
};

export const aceptarPropuestaCambio = async (
  propuestaId: string
): Promise<PropuestaCambioRenovacion> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const propuesta = mockPropuestas.find(p => p.id === propuestaId);
  if (!propuesta) {
    throw new Error('Propuesta no encontrada');
  }

  if (propuesta.estado !== 'pendiente') {
    throw new Error('La propuesta no está pendiente');
  }

  const suscripcion = mockSuscripciones.find(s => s.id === propuesta.suscripcionId);
  if (!suscripcion) {
    throw new Error('Suscripción no encontrada');
  }

  // Aplicar el cambio según el tipo
  if (propuesta.tipoCambio === 'plan' && propuesta.nuevoPlanId && propuesta.nuevoPrecio) {
    // Cambiar plan
    const indice = mockSuscripciones.findIndex(s => s.id === suscripcion.id);
    if (indice !== -1) {
      mockSuscripciones[indice] = {
        ...suscripcion,
        planId: propuesta.nuevoPlanId,
        planNombre: propuesta.nuevoPlanNombre || suscripcion.planNombre,
        precio: propuesta.nuevoPrecio,
        sesionesIncluidas: propuesta.nuevoSesiones || suscripcion.sesionesIncluidas,
        sesionesDisponibles: (suscripcion.sesionesDisponibles || 0) + (propuesta.nuevoSesiones || 0) - (suscripcion.sesionesIncluidas || 0),
        fechaActualizacion: new Date().toISOString().split('T')[0],
      };
    }
  } else if (propuesta.tipoCambio === 'precio' && propuesta.precioNuevo) {
    // Cambiar precio
    const indice = mockSuscripciones.findIndex(s => s.id === suscripcion.id);
    if (indice !== -1) {
      mockSuscripciones[indice] = {
        ...suscripcion,
        precio: propuesta.precioNuevo,
        fechaActualizacion: new Date().toISOString().split('T')[0],
      };
    }
  } else if (propuesta.tipoCambio === 'descuento' && propuesta.descuento) {
    // Aplicar descuento
    const indice = mockSuscripciones.findIndex(s => s.id === suscripcion.id);
    if (indice !== -1) {
      const precioOriginal = suscripcion.precioOriginal || suscripcion.precio;
      const descuento: DescuentoSuscripcion = {
        id: `desc-${Date.now()}`,
        tipo: propuesta.descuento.tipo,
        valor: propuesta.descuento.valor,
        motivo: propuesta.descuento.motivo,
        fechaInicio: new Date().toISOString().split('T')[0],
      };
      
      const nuevoPrecio = descuento.tipo === 'porcentaje'
        ? precioOriginal * (1 - descuento.valor / 100)
        : precioOriginal - descuento.valor;

      mockSuscripciones[indice] = {
        ...suscripcion,
        precio: nuevoPrecio,
        precioOriginal: precioOriginal,
        descuento,
        fechaActualizacion: new Date().toISOString().split('T')[0],
      };
    }
  }

  // Actualizar estado de la propuesta
  propuesta.estado = 'aceptada';
  propuesta.fechaAceptacion = new Date().toISOString();
  
  return propuesta;
};

export const rechazarPropuestaCambio = async (
  propuestaId: string
): Promise<PropuestaCambioRenovacion> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const propuesta = mockPropuestas.find(p => p.id === propuestaId);
  if (!propuesta) {
    throw new Error('Propuesta no encontrada');
  }

  if (propuesta.estado !== 'pendiente') {
    throw new Error('La propuesta no está pendiente');
  }

  propuesta.estado = 'rechazada';
  propuesta.fechaRechazo = new Date().toISOString();
  
  return propuesta;
};

// User Story 1: Transferir sesiones no usadas al siguiente mes
export const transferirSesiones = async (
  data: TransferirSesionesRequest
): Promise<Suscripcion> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const suscripcion = mockSuscripciones.find(s => s.id === data.suscripcionId);
  if (!suscripcion) {
    throw new Error('Suscripción no encontrada');
  }
  
  if (!suscripcion.sesionesDisponibles || suscripcion.sesionesDisponibles === 0) {
    throw new Error('No hay sesiones disponibles para transferir');
  }
  
  if (!suscripcion.sesionesIncluidas) {
    throw new Error('Esta suscripción no tiene sesiones incluidas');
  }
  
  // Calcular sesiones a transferir
  const sesionesDisponiblesActuales = suscripcion.sesionesDisponibles || 0;
  const sesionesATransferir = Math.min(
    data.sesionesATransferir || sesionesDisponiblesActuales,
    sesionesDisponiblesActuales
  );
  
  // Validar límite máximo si existe
  const config = suscripcion.configuracionTransferencia;
  if (config?.maxSesionesTransferibles && sesionesATransferir > config.maxSesionesTransferibles) {
    throw new Error(`El límite máximo de sesiones transferibles es ${config.maxSesionesTransferibles}`);
  }
  
  // Calcular períodos
  const hoy = new Date();
  const fechaVencimiento = new Date(suscripcion.fechaVencimiento);
  const periodoOrigen = data.periodoOrigen || 
    `${fechaVencimiento.getFullYear()}-${String(fechaVencimiento.getMonth() + 1).padStart(2, '0')}`;
  
  // Calcular próximo período (próximo mes)
  const proximoMes = new Date(fechaVencimiento);
  proximoMes.setMonth(proximoMes.getMonth() + 1);
  const periodoDestino = data.periodoDestino || 
    `${proximoMes.getFullYear()}-${String(proximoMes.getMonth() + 1).padStart(2, '0')}`;
  
  // Crear registro de transferencia
  const transferencia: TransferenciaSesiones = {
    id: `transfer-${Date.now()}`,
    suscripcionId: data.suscripcionId,
    periodoOrigen,
    periodoDestino,
    sesionesTransferidas: sesionesATransferir,
    sesionesDisponiblesAntes: sesionesDisponiblesActuales,
    sesionesDisponiblesDespues: sesionesDisponiblesActuales - sesionesATransferir,
    fechaTransferencia: new Date().toISOString().split('T')[0],
    aplicado: false, // Se aplicará cuando se renueve la suscripción
  };
  
  // Actualizar suscripción
  const historialTransferencias = suscripcion.historialTransferencias || [];
  historialTransferencias.push(transferencia);
  
  const indice = mockSuscripciones.findIndex(s => s.id === data.suscripcionId);
  if (indice !== -1) {
    mockSuscripciones[indice] = {
      ...suscripcion,
      sesionesDisponibles: sesionesDisponiblesActuales - sesionesATransferir,
      sesionesTransferidas: (suscripcion.sesionesTransferidas || 0) + sesionesATransferir,
      historialTransferencias,
      fechaActualizacion: new Date().toISOString().split('T')[0],
    };
  }
  
  // Registrar cambio en historial
  const suscripcionActualizada = mockSuscripciones[indice] || suscripcion;
  registrarCambio(
    suscripcionActualizada,
    'ajuste_sesiones',
    `${sesionesATransferir} sesiones transferidas al siguiente mes (${periodoDestino})`,
    [
      { campo: 'sesionesDisponibles', valorAnterior: sesionesDisponiblesActuales, valorNuevo: sesionesDisponiblesActuales - sesionesATransferir },
      { campo: 'sesionesTransferidas', valorAnterior: suscripcion.sesionesTransferidas || 0, valorNuevo: (suscripcion.sesionesTransferidas || 0) + sesionesATransferir },
    ],
    data.aplicadoAutomaticamente ? 'Transferencia automática en renovación' : 'Transferencia manual'
  );
  
  return suscripcionActualizada;
};

// User Story 1: Configurar transferencia automática de sesiones
export const configurarTransferenciaSesiones = async (
  suscripcionId: string,
  config: ConfiguracionTransferenciaSesiones
): Promise<Suscripcion> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const suscripcion = mockSuscripciones.find(s => s.id === suscripcionId);
  if (!suscripcion) {
    throw new Error('Suscripción no encontrada');
  }
  
  const indice = mockSuscripciones.findIndex(s => s.id === suscripcionId);
  if (indice !== -1) {
    mockSuscripciones[indice] = {
      ...suscripcion,
      transferenciaSesionesActiva: config.transferenciaAutomatica,
      configuracionTransferencia: config,
      fechaActualizacion: new Date().toISOString().split('T')[0],
    };
  }
  
  return mockSuscripciones[indice] || suscripcion;
};

// User Story 1: Aplicar sesiones transferidas en renovación
export const aplicarSesionesTransferidasEnRenovacion = async (
  suscripcionId: string
): Promise<Suscripcion> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const suscripcion = mockSuscripciones.find(s => s.id === suscripcionId);
  if (!suscripcion) {
    throw new Error('Suscripción no encontrada');
  }
  
  if (!suscripcion.transferenciaSesionesActiva || !suscripcion.configuracionTransferencia?.aplicarEnRenovacion) {
    return suscripcion; // No hay transferencia automática configurada
  }
  
  const sesionesTransferidas = suscripcion.sesionesTransferidas || 0;
  if (sesionesTransferidas === 0) {
    return suscripcion; // No hay sesiones transferidas
  }
  
  // Aplicar sesiones transferidas al nuevo período
  const sesionesIncluidas = suscripcion.sesionesIncluidas || 0;
  const nuevasSesionesDisponibles = sesionesIncluidas + sesionesTransferidas;
  
  // Marcar transferencias como aplicadas
  const historialTransferencias = suscripcion.historialTransferencias || [];
  const transferenciasPendientes = historialTransferencias.filter(t => !t.aplicado);
  transferenciasPendientes.forEach(t => {
    t.aplicado = true;
  });
  
  const indice = mockSuscripciones.findIndex(s => s.id === suscripcionId);
  if (indice !== -1) {
    mockSuscripciones[indice] = {
      ...suscripcion,
      sesionesDisponibles: nuevasSesionesDisponibles,
      sesionesTransferidas: 0, // Resetear sesiones transferidas después de aplicarlas
      historialTransferencias,
      fechaActualizacion: new Date().toISOString().split('T')[0],
    };
  }
  
  return mockSuscripciones[indice] || suscripcion;
};

// User Story 2: Generar resumen de actividad de suscripciones
export const generarResumenActividad = async (
  data: GenerarResumenRequest
): Promise<ResumenActividadSuscripciones> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const fechaInicio = new Date(data.fechaInicio);
  const fechaFin = new Date(data.fechaFin);
  
  // Filtrar suscripciones del entrenador
  let suscripciones = mockSuscripciones.filter(s => {
    if (data.entrenadorId && s.entrenadorId !== data.entrenadorId) return false;
    if (s.tipo !== 'pt-mensual') return false;
    return true;
  });
  
  // Filtrar por período
  const suscripcionesEnPeriodo = suscripciones.filter(s => {
    const fechaCreacion = new Date(s.fechaCreacion);
    const fechaActualizacion = new Date(s.fechaActualizacion);
    return (fechaCreacion >= fechaInicio && fechaCreacion <= fechaFin) ||
           (fechaActualizacion >= fechaInicio && fechaActualizacion <= fechaFin);
  });
  
  // Calcular métricas
  const suscripcionesNuevas = suscripcionesEnPeriodo.filter(s => {
    const fechaCreacion = new Date(s.fechaCreacion);
    return fechaCreacion >= fechaInicio && fechaCreacion <= fechaFin;
  }).length;
  
  const suscripcionesCanceladas = suscripcionesEnPeriodo.filter(s => {
    if (s.estado !== 'cancelada') return false;
    const fechaCancelacion = s.fechaCancelacion ? new Date(s.fechaCancelacion) : null;
    return fechaCancelacion && fechaCancelacion >= fechaInicio && fechaCancelacion <= fechaFin;
  }).length;
  
  const suscripcionesRenovadas = suscripcionesEnPeriodo.filter(s => {
    if (!s.proximaRenovacion) return false;
    const fechaRenovacion = new Date(s.proximaRenovacion);
    return fechaRenovacion >= fechaInicio && fechaRenovacion <= fechaFin && s.estado === 'activa';
  }).length;
  
  const suscripcionesPausadas = suscripciones.filter(s => s.estado === 'pausada').length;
  
  // Obtener suscripciones activas
  const suscripcionesActivasArray = suscripciones.filter(s => s.estado === 'activa');
  
  // Métricas de sesiones
  const totalSesionesIncluidas = suscripcionesActivasArray
    .reduce((sum, s) => sum + (s.sesionesIncluidas || 0), 0);
  const totalSesionesUsadas = suscripcionesActivasArray
    .reduce((sum, s) => sum + (s.sesionesUsadas || 0), 0);
  const totalSesionesDisponibles = suscripcionesActivasArray
    .reduce((sum, s) => sum + (s.sesionesDisponibles || 0), 0);
  const totalSesionesTransferidas = suscripcionesActivasArray
    .reduce((sum, s) => sum + (s.sesionesTransferidas || 0), 0);
  const tasaUsoSesiones = totalSesionesIncluidas > 0
    ? (totalSesionesUsadas / totalSesionesIncluidas) * 100
    : 0;
  
  // Métricas financieras
  const ingresosRecurrentes = suscripcionesActivasArray
    .reduce((sum, s) => sum + s.precio, 0);
  const ingresosNuevos = suscripcionesEnPeriodo
    .filter(s => {
      const fechaCreacion = new Date(s.fechaCreacion);
      return fechaCreacion >= fechaInicio && fechaCreacion <= fechaFin;
    })
    .reduce((sum, s) => sum + s.precio, 0);
  const ingresosPerdidos = suscripcionesEnPeriodo
    .filter(s => {
      if (s.estado !== 'cancelada') return false;
      const fechaCancelacion = s.fechaCancelacion ? new Date(s.fechaCancelacion) : null;
      return fechaCancelacion && fechaCancelacion >= fechaInicio && fechaCancelacion <= fechaFin;
    })
    .reduce((sum, s) => sum + s.precio, 0);
  
  // Métricas de actividad
  const clientesActivos = new Set(suscripcionesActivasArray.map(s => s.clienteId)).size;
  const clientesNuevos = new Set(suscripcionesEnPeriodo
    .filter(s => {
      const fechaCreacion = new Date(s.fechaCreacion);
      return fechaCreacion >= fechaInicio && fechaCreacion <= fechaFin;
    })
    .map(s => s.clienteId)).size;
  const clientesPerdidos = new Set(suscripcionesEnPeriodo
    .filter(s => {
      if (s.estado !== 'cancelada') return false;
      const fechaCancelacion = s.fechaCancelacion ? new Date(s.fechaCancelacion) : null;
      return fechaCancelacion && fechaCancelacion >= fechaInicio && fechaCancelacion <= fechaFin;
    })
    .map(s => s.clienteId)).size;
  
  // Detalles si se solicitan
  const detallesNuevas = data.incluirDetalles ? suscripcionesEnPeriodo
    .filter(s => {
      const fechaCreacion = new Date(s.fechaCreacion);
      return fechaCreacion >= fechaInicio && fechaCreacion <= fechaFin;
    })
    .map(s => ({
      suscripcionId: s.id,
      clienteId: s.clienteId,
      clienteNombre: s.clienteNombre,
      clienteEmail: s.clienteEmail,
      planNombre: s.planNombre,
      precio: s.precio,
      fecha: s.fechaCreacion,
      tipo: 'nueva' as const,
    })) : undefined;
  
  const detallesCanceladas = data.incluirDetalles ? suscripcionesEnPeriodo
    .filter(s => {
      if (s.estado !== 'cancelada') return false;
      const fechaCancelacion = s.fechaCancelacion ? new Date(s.fechaCancelacion) : null;
      return fechaCancelacion && fechaCancelacion >= fechaInicio && fechaCancelacion <= fechaFin;
    })
    .map(s => ({
      suscripcionId: s.id,
      clienteId: s.clienteId,
      clienteNombre: s.clienteNombre,
      clienteEmail: s.clienteEmail,
      planNombre: s.planNombre,
      precio: s.precio,
      fecha: s.fechaCancelacion || s.fechaActualizacion,
      tipo: 'cancelada' as const,
    })) : undefined;
  
  const detallesRenovadas = data.incluirDetalles ? suscripcionesEnPeriodo
    .filter(s => {
      if (!s.proximaRenovacion) return false;
      const fechaRenovacion = new Date(s.proximaRenovacion);
      return fechaRenovacion >= fechaInicio && fechaRenovacion <= fechaFin && s.estado === 'activa';
    })
    .map(s => ({
      suscripcionId: s.id,
      clienteId: s.clienteId,
      clienteNombre: s.clienteNombre,
      clienteEmail: s.clienteEmail,
      planNombre: s.planNombre,
      precio: s.precio,
      fecha: s.proximaRenovacion || s.fechaActualizacion,
      tipo: 'renovada' as const,
    })) : undefined;
  
  const detallesTransferencias = data.incluirDetalles ? suscripciones
    .filter(s => s.historialTransferencias && s.historialTransferencias.length > 0)
    .flatMap(s => {
      const transferencias = s.historialTransferencias!.filter(t => {
        const fechaTransferencia = new Date(t.fechaTransferencia);
        return fechaTransferencia >= fechaInicio && fechaTransferencia <= fechaFin;
      });
      return transferencias.map(t => ({
        suscripcionId: s.id,
        clienteNombre: s.clienteNombre,
        sesionesTransferidas: t.sesionesTransferidas,
        periodoOrigen: t.periodoOrigen,
        periodoDestino: t.periodoDestino,
        fecha: t.fechaTransferencia,
      }));
    }) : undefined;
  
  // Alertas
  const alertas: Array<{ tipo: 'info' | 'warning' | 'error'; mensaje: string; accionRequerida?: boolean }> = [];
  
  if (suscripcionesCanceladas > 0) {
    alertas.push({
      tipo: 'warning',
      mensaje: `${suscripcionesCanceladas} suscripción(es) cancelada(s) en este período`,
      accionRequerida: true,
    });
  }
  
  if (tasaUsoSesiones < 50) {
    alertas.push({
      tipo: 'info',
      mensaje: `Tasa de uso de sesiones baja: ${tasaUsoSesiones.toFixed(1)}%`,
      accionRequerida: false,
    });
  }
  
  if (totalSesionesTransferidas > 0) {
    alertas.push({
      tipo: 'info',
      mensaje: `${totalSesionesTransferidas} sesiones transferidas al siguiente mes`,
      accionRequerida: false,
    });
  }
  
  // Formatear período
  const formatoFecha = (fecha: Date) => fecha.toISOString().split('T')[0];
  const periodo = fechaInicio.getTime() === fechaFin.getTime()
    ? formatoFecha(fechaInicio)
    : `${formatoFecha(fechaInicio)} a ${formatoFecha(fechaFin)}`;
  
  const resumen: ResumenActividadSuscripciones = {
    id: `resumen-${Date.now()}`,
    entrenadorId: data.entrenadorId,
    periodo,
    fechaInicio: formatoFecha(fechaInicio),
    fechaFin: formatoFecha(fechaFin),
    fechaGeneracion: new Date().toISOString(),
    totalSuscripciones: suscripciones.length,
    suscripcionesActivas: suscripcionesActivasArray.length,
    suscripcionesNuevas,
    suscripcionesCanceladas,
    suscripcionesRenovadas,
    suscripcionesPausadas,
    totalSesionesIncluidas,
    totalSesionesUsadas,
    totalSesionesDisponibles,
    totalSesionesTransferidas,
    tasaUsoSesiones: Math.round(tasaUsoSesiones * 10) / 10,
    ingresosRecurrentes,
    ingresosNuevos,
    ingresosPerdidos,
    clientesActivos,
    clientesNuevos,
    clientesPerdidos,
    detallesNuevas,
    detallesCanceladas,
    detallesRenovadas,
    detallesTransferencias,
    alertas,
  };
  
  return resumen;
};

// User Story 2: Obtener configuración de resumen de actividad
export const getConfiguracionResumenActividad = async (
  entrenadorId?: string
): Promise<ConfiguracionResumenActividad | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Mock: retornar configuración por defecto
  return {
    entrenadorId,
    frecuencia: 'semanal',
    diasSemana: [1], // Lunes
    horaEnvio: '09:00',
    canalesEnvio: ['email', 'dashboard'],
    activo: true,
  };
};

// User Story 2: Actualizar configuración de resumen de actividad
export const actualizarConfiguracionResumenActividad = async (
  config: ConfiguracionResumenActividad
): Promise<ConfiguracionResumenActividad> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción, esto guardaría la configuración en la base de datos
  return config;
};

