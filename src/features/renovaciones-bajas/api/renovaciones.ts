import { Renovacion, EstadoRenovacion, FiltrosRenovaciones } from '../types';

// ============================================================================
// TIPOS DE FILTROS
// ============================================================================

/**
 * Filtros para obtener suscripciones próximas a vencer
 */
export interface FiltrosSuscripcionesProximas {
  /** Rango de fechas de vencimiento (opcional) */
  fechaVencimiento?: {
    desde?: string;
    hasta?: string;
  };
  /** Estado de la renovación (opcional) */
  estado?: EstadoRenovacion;
  /** Tipo de renovación: automática o manual (opcional) */
  tipo?: 'automatica' | 'manual';
}

/**
 * Filtros para obtener historial de renovaciones
 */
export interface FiltrosHistorialRenovaciones {
  /** Rango de fechas de procesamiento (opcional) */
  fechaProcesada?: {
    desde?: string;
    hasta?: string;
  };
  /** Estado de la renovación (opcional) */
  estado?: EstadoRenovacion;
  /** Tipo de renovación: automática o manual (opcional) */
  tipo?: 'automatica' | 'manual';
  /** ID del cliente (opcional) */
  clienteId?: string;
  /** ID de la suscripción (opcional) */
  suscripcionId?: string;
}

/**
 * Opciones para procesar una renovación
 */
export interface OpcionesProcesarRenovacion {
  /** Forzar procesamiento manual aunque sea automática */
  forzarManual?: boolean;
  /** ID del nuevo plan (opcional, para upgrade/downgrade) */
  nuevoPlanId?: string;
}

/**
 * Métricas de renovación
 */
export interface MetricasRenovacion {
  /** Tasa de renovación en porcentaje (0-100) */
  tasaRenovacion: number;
  /** Total de renovaciones en el período */
  renovacionesTotales: number;
  /** Renovaciones automáticas */
  renovacionesAutomaticas: number;
  /** Renovaciones manuales */
  renovacionesManuales: number;
  /** Upgrades (cambios a plan superior) */
  upgrades: number;
  /** Downgrades (cambios a plan inferior) */
  downgrades: number;
}

// ============================================================================
// DATOS MOCK
// ============================================================================

/**
 * Datos mock de clientes
 */
const mockClientes: Record<string, { id: string; nombre: string; email: string; telefono?: string }> = {
  'cl-001': { id: 'cl-001', nombre: 'Juan Pérez', email: 'juan.perez@email.com', telefono: '+34 600 123 456' },
  'cl-002': { id: 'cl-002', nombre: 'María García', email: 'maria.garcia@email.com', telefono: '+34 600 234 567' },
  'cl-003': { id: 'cl-003', nombre: 'Carlos López', email: 'carlos.lopez@email.com', telefono: '+34 600 345 678' },
  'cl-004': { id: 'cl-004', nombre: 'Ana Martínez', email: 'ana.martinez@email.com', telefono: '+34 600 456 789' },
  'cl-005': { id: 'cl-005', nombre: 'Pedro Sánchez', email: 'pedro.sanchez@email.com', telefono: '+34 600 567 890' },
  'cl-006': { id: 'cl-006', nombre: 'Laura Fernández', email: 'laura.fernandez@email.com', telefono: '+34 600 678 901' },
  'cl-007': { id: 'cl-007', nombre: 'Miguel Torres', email: 'miguel.torres@email.com', telefono: '+34 600 789 012' },
  'cl-008': { id: 'cl-008', nombre: 'Sofía Ruiz', email: 'sofia.ruiz@email.com', telefono: '+34 600 890 123' },
  'cl-009': { id: 'cl-009', nombre: 'David González', email: 'david.gonzalez@email.com', telefono: '+34 600 901 234' },
  'cl-010': { id: 'cl-010', nombre: 'Elena Díaz', email: 'elena.diaz@email.com', telefono: '+34 600 012 345' },
};

/**
 * Datos mock de planes
 */
const mockPlanes: Record<string, { id: string; nombre: string; precio: number }> = {
  'plan-basico': { id: 'plan-basico', nombre: 'Plan Básico', precio: 29.99 },
  'plan-intermedio': { id: 'plan-intermedio', nombre: 'Plan Intermedio', precio: 49.99 },
  'plan-premium': { id: 'plan-premium', nombre: 'Plan Premium', precio: 79.99 },
};

/**
 * Función helper para calcular días restantes
 */
function calcularDiasRestantes(fechaVencimiento: string): number {
  const ahora = new Date();
  const vencimiento = new Date(fechaVencimiento);
  const diffTime = vencimiento.getTime() - ahora.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Función helper para enriquecer renovación con datos de cliente y plan
 */
function enriquecerRenovacion(renovacion: Renovacion): Renovacion {
  const cliente = mockClientes[renovacion.clienteId];
  const planActual = mockPlanes[renovacion.planAnteriorId];
  const diasRestantes = calcularDiasRestantes(renovacion.fechaVencimiento);

  return {
    ...renovacion,
    cliente: cliente ? { ...cliente } : undefined,
    planActual: planActual ? { ...planActual } : undefined,
    diasRestantes,
  };
}

/**
 * Base de datos mock de renovaciones
 * TODO: Reemplazar con llamada real a API: GET /api/renovaciones
 */
const mockRenovacionesBase: Omit<Renovacion, 'cliente' | 'planActual' | 'diasRestantes'>[] = [
  {
    id: 'ren-001',
    suscripcionId: 'sub-001',
    clienteId: 'cl-001',
    fechaVencimiento: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    tipo: 'automatica',
    estado: 'pendiente',
    planAnteriorId: 'plan-basico',
    planNuevoId: 'plan-basico',
    origen: 'sistema',
    notas: 'Renovación automática programada',
  },
  {
    id: 'ren-002',
    suscripcionId: 'sub-002',
    clienteId: 'cl-002',
    fechaVencimiento: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    tipo: 'manual',
    estado: 'pendiente',
    planAnteriorId: 'plan-premium',
    planNuevoId: 'plan-premium',
    origen: 'usuario',
    notas: 'Cliente solicitó renovación manual',
  },
  {
    id: 'ren-003',
    suscripcionId: 'sub-003',
    clienteId: 'cl-003',
    fechaVencimiento: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    tipo: 'automatica',
    estado: 'en_proceso',
    planAnteriorId: 'plan-basico',
    planNuevoId: 'plan-intermedio',
    origen: 'sistema',
    notas: 'Upgrade automático en proceso',
  },
  {
    id: 'ren-004',
    suscripcionId: 'sub-004',
    clienteId: 'cl-004',
    fechaVencimiento: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    fechaProcesada: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    tipo: 'automatica',
    estado: 'renovada',
    planAnteriorId: 'plan-premium',
    planNuevoId: 'plan-premium',
    origen: 'sistema',
    notas: 'Renovación completada exitosamente',
  },
  {
    id: 'ren-005',
    suscripcionId: 'sub-005',
    clienteId: 'cl-005',
    fechaVencimiento: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    tipo: 'manual',
    estado: 'pendiente',
    planAnteriorId: 'plan-basico',
    planNuevoId: 'plan-basico',
    origen: 'usuario',
  },
  {
    id: 'ren-006',
    suscripcionId: 'sub-006',
    clienteId: 'cl-006',
    fechaVencimiento: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    tipo: 'automatica',
    estado: 'rechazada',
    planAnteriorId: 'plan-intermedio',
    planNuevoId: 'plan-intermedio',
    origen: 'sistema',
    notas: 'Cliente canceló la suscripción',
  },
  {
    id: 'ren-007',
    suscripcionId: 'sub-007',
    clienteId: 'cl-007',
    fechaVencimiento: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    fechaProcesada: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    tipo: 'manual',
    estado: 'renovada',
    planAnteriorId: 'plan-basico',
    planNuevoId: 'plan-premium',
    origen: 'usuario',
    notas: 'Upgrade manual completado',
  },
  {
    id: 'ren-008',
    suscripcionId: 'sub-008',
    clienteId: 'cl-008',
    fechaVencimiento: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    fechaProcesada: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    tipo: 'automatica',
    estado: 'fallida',
    planAnteriorId: 'plan-premium',
    planNuevoId: 'plan-premium',
    origen: 'sistema',
    notas: 'Error en el procesamiento del pago',
  },
  {
    id: 'ren-009',
    suscripcionId: 'sub-009',
    clienteId: 'cl-009',
    fechaVencimiento: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    tipo: 'automatica',
    estado: 'pendiente',
    planAnteriorId: 'plan-intermedio',
    planNuevoId: 'plan-intermedio',
    origen: 'sistema',
  },
  {
    id: 'ren-010',
    suscripcionId: 'sub-010',
    clienteId: 'cl-010',
    fechaVencimiento: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    tipo: 'manual',
    estado: 'en_proceso',
    planAnteriorId: 'plan-premium',
    planNuevoId: 'plan-basico',
    origen: 'usuario',
    notas: 'Downgrade solicitado por el cliente',
  },
];

// ============================================================================
// FUNCIONES DE API
// ============================================================================

/**
 * Obtiene las suscripciones próximas a vencer según los filtros proporcionados
 * 
 * TODO: Integrar con API real
 * Endpoint: GET /api/renovaciones/proximas-vencer
 * Query params: fechaVencimientoDesde, fechaVencimientoHasta, estado, tipo
 * 
 * @param filtros - Filtros para buscar suscripciones próximas a vencer
 * @returns Promise con array de renovaciones que cumplen los filtros
 */
export async function getSuscripcionesProximasAVencer(
  filtros: FiltrosSuscripcionesProximas = {}
): Promise<Renovacion[]> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));

  // Convertir base a Renovacion completo y enriquecer
  let resultado = mockRenovacionesBase.map(r => enriquecerRenovacion(r as Renovacion));

  // Filtrar por rango de fecha de vencimiento
  if (filtros.fechaVencimiento) {
    const { desde, hasta } = filtros.fechaVencimiento;
    if (desde) {
      const fechaDesde = new Date(desde).getTime();
      resultado = resultado.filter(
        r => new Date(r.fechaVencimiento).getTime() >= fechaDesde
      );
    }
    if (hasta) {
      const fechaHasta = new Date(hasta).getTime();
      resultado = resultado.filter(
        r => new Date(r.fechaVencimiento).getTime() <= fechaHasta
      );
    }
  }

  // Filtrar por estado
  if (filtros.estado) {
    resultado = resultado.filter(r => r.estado === filtros.estado);
  }

  // Filtrar por tipo
  if (filtros.tipo) {
    resultado = resultado.filter(r => r.tipo === filtros.tipo);
  }

  // Ordenar por fecha de vencimiento (más próximas primero)
  resultado.sort((a, b) => 
    new Date(a.fechaVencimiento).getTime() - new Date(b.fechaVencimiento).getTime()
  );

  return resultado;
}

/**
 * Procesa una renovación de suscripción
 * 
 * TODO: Integrar con API real
 * Endpoint: POST /api/renovaciones/:id/procesar
 * Body: { forzarManual?: boolean, nuevoPlanId?: string }
 * 
 * @param id - ID de la renovación a procesar
 * @param opciones - Opciones para el procesamiento (forzar manual, nuevo plan)
 * @returns Promise con la renovación actualizada
 */
export async function procesarRenovacion(
  id: string,
  opciones: OpcionesProcesarRenovacion = {}
): Promise<Renovacion> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 600));

  const renovacionBase = mockRenovacionesBase.find(r => r.id === id);
  
  if (!renovacionBase) {
    throw new Error(`Renovación con ID ${id} no encontrada`);
  }

  // Actualizar renovación
  const renovacionActualizada: Omit<Renovacion, 'cliente' | 'planActual' | 'diasRestantes'> = {
    ...renovacionBase,
    estado: 'en_proceso',
    fechaProcesada: new Date().toISOString(),
  };

  // Si se fuerza manual, cambiar tipo
  if (opciones.forzarManual) {
    renovacionActualizada.tipo = 'manual';
    renovacionActualizada.origen = 'usuario';
  }

  // Si se especifica un nuevo plan, actualizarlo
  if (opciones.nuevoPlanId) {
    renovacionActualizada.planNuevoId = opciones.nuevoPlanId;
  }

  // Actualizar en el array mock (simulando persistencia)
  const index = mockRenovacionesBase.findIndex(r => r.id === id);
  if (index !== -1) {
    mockRenovacionesBase[index] = renovacionActualizada;
  }

  return enriquecerRenovacion(renovacionActualizada as Renovacion);
}

/**
 * Marca una renovación como renovada exitosamente
 * 
 * TODO: Integrar con API real
 * Endpoint: PATCH /api/renovaciones/:id/marcar-renovada
 * 
 * @param id - ID de la renovación a marcar como renovada
 * @returns Promise con la renovación actualizada
 */
export async function marcarComoRenovada(id: string): Promise<Renovacion> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 400));

  const renovacionBase = mockRenovacionesBase.find(r => r.id === id);
  
  if (!renovacionBase) {
    throw new Error(`Renovación con ID ${id} no encontrada`);
  }

  const renovacionActualizada: Omit<Renovacion, 'cliente' | 'planActual' | 'diasRestantes'> = {
    ...renovacionBase,
    estado: 'renovada',
    fechaProcesada: renovacionBase.fechaProcesada || new Date().toISOString(),
    notas: renovacionBase.notas 
      ? `${renovacionBase.notas} - Renovación completada exitosamente`
      : 'Renovación completada exitosamente',
  };

  // Actualizar en el array mock
  const index = mockRenovacionesBase.findIndex(r => r.id === id);
  if (index !== -1) {
    mockRenovacionesBase[index] = renovacionActualizada;
  }

  return enriquecerRenovacion(renovacionActualizada as Renovacion);
}

/**
 * Registra una renovación como fallida con el motivo especificado
 * 
 * TODO: Integrar con API real
 * Endpoint: PATCH /api/renovaciones/:id/registrar-fallida
 * Body: { motivo: string }
 * 
 * @param id - ID de la renovación que falló
 * @param motivo - Motivo del fallo de la renovación
 * @returns Promise con la renovación actualizada
 */
export async function registrarRenovacionFallida(
  id: string,
  motivo: string
): Promise<Renovacion> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 400));

  const renovacionBase = mockRenovacionesBase.find(r => r.id === id);
  
  if (!renovacionBase) {
    throw new Error(`Renovación con ID ${id} no encontrada`);
  }

  const renovacionActualizada: Omit<Renovacion, 'cliente' | 'planActual' | 'diasRestantes'> = {
    ...renovacionBase,
    estado: 'fallida',
    fechaProcesada: renovacionBase.fechaProcesada || new Date().toISOString(),
    notas: renovacionBase.notas 
      ? `${renovacionBase.notas} - FALLO: ${motivo}`
      : `FALLO: ${motivo}`,
  };

  // Actualizar en el array mock
  const index = mockRenovacionesBase.findIndex(r => r.id === id);
  if (index !== -1) {
    mockRenovacionesBase[index] = renovacionActualizada;
  }

  return enriquecerRenovacion(renovacionActualizada as Renovacion);
}

/**
 * Obtiene el historial de renovaciones según los filtros proporcionados
 * 
 * TODO: Integrar con API real
 * Endpoint: GET /api/renovaciones/historial
 * Query params: fechaProcesadaDesde, fechaProcesadaHasta, estado, tipo, clienteId, suscripcionId
 * 
 * @param filtros - Filtros para buscar en el historial
 * @returns Promise con array de renovaciones del historial
 */
export async function getHistorialRenovaciones(
  filtros: FiltrosHistorialRenovaciones = {}
): Promise<Renovacion[]> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));

  let resultado = mockRenovacionesBase.map(r => enriquecerRenovacion(r as Renovacion));

  // Filtrar por rango de fecha de procesamiento
  if (filtros.fechaProcesada) {
    const { desde, hasta } = filtros.fechaProcesada;
    if (desde) {
      const fechaDesde = new Date(desde).getTime();
      resultado = resultado.filter(r => {
        if (!r.fechaProcesada) return false;
        return new Date(r.fechaProcesada).getTime() >= fechaDesde;
      });
    }
    if (hasta) {
      const fechaHasta = new Date(hasta).getTime();
      resultado = resultado.filter(r => {
        if (!r.fechaProcesada) return false;
        return new Date(r.fechaProcesada).getTime() <= fechaHasta;
      });
    }
  }

  // Filtrar por estado
  if (filtros.estado) {
    resultado = resultado.filter(r => r.estado === filtros.estado);
  }

  // Filtrar por tipo
  if (filtros.tipo) {
    resultado = resultado.filter(r => r.tipo === filtros.tipo);
  }

  // Filtrar por cliente
  if (filtros.clienteId) {
    resultado = resultado.filter(r => r.clienteId === filtros.clienteId);
  }

  // Filtrar por suscripción
  if (filtros.suscripcionId) {
    resultado = resultado.filter(r => r.suscripcionId === filtros.suscripcionId);
  }

  // Ordenar por fecha de procesamiento (más recientes primero)
  resultado.sort((a, b) => {
    const fechaA = a.fechaProcesada ? new Date(a.fechaProcesada).getTime() : 0;
    const fechaB = b.fechaProcesada ? new Date(b.fechaProcesada).getTime() : 0;
    return fechaB - fechaA;
  });

  return resultado;
}

/**
 * Obtiene las métricas de renovación para un período determinado
 * 
 * TODO: Integrar con API real
 * Endpoint: GET /api/renovaciones/metricas
 * Query params: anio, mes (opcional)
 * 
 * @param periodo - Período para calcular las métricas (año y opcionalmente mes)
 * @returns Promise con las métricas de renovación
 */
export async function getMetricasRenovacion(
  periodo: { anio: number; mes?: number }
): Promise<MetricasRenovacion> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 600));

  // Filtrar renovaciones del período
  const ahora = new Date();
  const anioActual = periodo.anio;
  const mesActual = periodo.mes !== undefined ? periodo.mes : null;

  const renovacionesPeriodo = mockRenovacionesBase.filter(r => {
    if (!r.fechaProcesada) return false;
    
    const fechaProcesada = new Date(r.fechaProcesada);
    const coincideAnio = fechaProcesada.getFullYear() === anioActual;
    
    if (mesActual !== null) {
      return coincideAnio && fechaProcesada.getMonth() === mesActual;
    }
    
    return coincideAnio;
  });

  // Calcular métricas
  const renovacionesTotales = renovacionesPeriodo.length;
  const renovacionesAutomaticas = renovacionesPeriodo.filter(
    r => r.tipo === 'automatica'
  ).length;
  const renovacionesManuales = renovacionesPeriodo.filter(
    r => r.tipo === 'manual'
  ).length;
  
  const renovadas = renovacionesPeriodo.filter(r => r.estado === 'renovada').length;
  const totalProcesadas = renovacionesPeriodo.filter(
    r => r.estado === 'renovada' || r.estado === 'fallida' || r.estado === 'rechazada'
  ).length;
  
  const tasaRenovacion = totalProcesadas > 0 
    ? (renovadas / totalProcesadas) * 100 
    : 0;

  // Calcular upgrades y downgrades
  // Nota: En un sistema real, esto requeriría comparar los planes anteriores y nuevos
  // con información de precios/niveles. Aquí simulamos basándonos en cambios de plan.
  const upgrades = renovacionesPeriodo.filter(r => {
    // Simulación: si cambió de plan y el nuevo es diferente, podría ser upgrade
    return r.planAnteriorId && r.planNuevoId && 
           r.planAnteriorId !== r.planNuevoId &&
           r.estado === 'renovada';
  }).length;

  const downgrades = renovacionesPeriodo.filter(r => {
    // Simulación: similar a upgrades pero para downgrades
    // En producción, esto requeriría lógica de comparación de planes
    return r.planAnteriorId && r.planNuevoId && 
           r.planAnteriorId !== r.planNuevoId &&
           r.estado === 'renovada';
  }).length;

  return {
    tasaRenovacion: Math.round(tasaRenovacion * 100) / 100,
    renovacionesTotales,
    renovacionesAutomaticas,
    renovacionesManuales,
    upgrades,
    downgrades,
  };
}

// ============================================================================
// FUNCIONES LEGACY (mantenidas para compatibilidad)
// ============================================================================

/**
 * @deprecated Usar getRenovaciones con filtros en su lugar
 * Obtiene todas las renovaciones (legacy)
 * Esta función ahora usa la nueva implementación con filtros
 */
export async function getRenovacionesLegacy(
  userType: 'entrenador' | 'gimnasio'
): Promise<Renovacion[]> {
  // Usar la nueva implementación con filtros para solo pendientes y en proceso
  const resultado = await getRenovaciones({});
  return resultado.filter(r => r.estado === 'pendiente' || r.estado === 'en_proceso');
}

/**
 * @deprecated Usar procesarRenovacion en su lugar
 * Procesa una renovación (legacy)
 */
export async function procesarRenovacionLegacy(
  id: string,
  data: { renovacionId: string; nuevaFechaVencimiento?: string; notas?: string }
): Promise<Renovacion | null> {
  return procesarRenovacion(id, {});
}

/**
 * Cancela una renovación
 * 
 * TODO: Integrar con API real
 * Endpoint: PATCH /api/renovaciones/:id/cancelar
 */
export async function cancelarRenovacion(id: string): Promise<boolean> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const renovacionBase = mockRenovacionesBase.find(r => r.id === id);
  if (renovacionBase) {
    const index = mockRenovacionesBase.findIndex(r => r.id === id);
    if (index !== -1) {
      mockRenovacionesBase[index] = {
        ...renovacionBase,
        estado: 'rechazada',
        notas: renovacionBase.notas 
          ? `${renovacionBase.notas} - Cancelada por el usuario`
          : 'Cancelada por el usuario',
      };
    }
    return true;
  }
  return false;
}

/**
 * Envía un recordatorio de renovación
 * 
 * TODO: Integrar con API real
 * Endpoint: POST /api/renovaciones/:id/recordatorio
 */
export async function enviarRecordatorio(id: string): Promise<boolean> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const renovacion = mockRenovacionesBase.find(r => r.id === id);
  return renovacion !== undefined;
}

/**
 * Obtiene renovaciones con filtros avanzados
 * 
 * TODO: Integrar con API real
 * Endpoint: GET /api/renovaciones
 * 
 * @param filtros - Filtros para buscar renovaciones
 * @returns Promise con array de renovaciones que cumplen los filtros
 */
export async function getRenovaciones(
  filtros: FiltrosRenovaciones = {}
): Promise<Renovacion[]> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));

  let resultado = mockRenovacionesBase.map(r => enriquecerRenovacion(r as Renovacion));

  // Filtrar por rango de fecha de vencimiento
  if (filtros.fechaVencimientoDesde) {
    const fechaDesde = new Date(filtros.fechaVencimientoDesde).getTime();
    resultado = resultado.filter(
      r => new Date(r.fechaVencimiento).getTime() >= fechaDesde
    );
  }
  if (filtros.fechaVencimientoHasta) {
    const fechaHasta = new Date(filtros.fechaVencimientoHasta).getTime();
    resultado = resultado.filter(
      r => new Date(r.fechaVencimiento).getTime() <= fechaHasta
    );
  }

  // Filtrar por tipo
  if (filtros.tipo) {
    resultado = resultado.filter(r => r.tipo === filtros.tipo);
  }

  // Filtrar por estado
  if (filtros.estado) {
    resultado = resultado.filter(r => r.estado === filtros.estado);
  }

  // Filtrar por plan
  if (filtros.planId) {
    resultado = resultado.filter(r => r.planAnteriorId === filtros.planId);
  }

  // Ordenar por fecha de vencimiento (más próximas primero)
  resultado.sort((a, b) => 
    new Date(a.fechaVencimiento).getTime() - new Date(b.fechaVencimiento).getTime()
  );

  return resultado;
}
