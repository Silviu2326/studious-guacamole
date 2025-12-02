/**
 * Tipos base para el módulo de Renovaciones y Bajas
 * Este módulo gestiona renovaciones de suscripciones, bajas de clientes,
 * alertas de vencimiento y análisis de churn.
 */

// ============================================================================
// ESTADO DE RENOVACIÓN
// ============================================================================

/**
 * Estados posibles de una renovación
 * Utilizado por: RenovacionesManager
 */
export type EstadoRenovacion = 
  | 'pendiente' 
  | 'en_proceso' 
  | 'renovada' 
  | 'rechazada' 
  | 'fallida';

// ============================================================================
// RENOVACIÓN
// ============================================================================

/**
 * Representa una renovación de suscripción
 * Utilizado por: RenovacionesManager
 */
export interface Renovacion {
  /** Identificador único de la renovación */
  id: string;
  /** Identificador de la suscripción asociada */
  suscripcionId: string;
  /** Identificador del cliente */
  clienteId: string;
  /** Fecha de vencimiento de la suscripción actual */
  fechaVencimiento: string;
  /** Fecha en que se procesó la renovación (opcional) */
  fechaProcesada?: string;
  /** Tipo de renovación: automática o manual */
  tipo: 'automatica' | 'manual';
  /** Estado actual de la renovación */
  estado: EstadoRenovacion;
  /** Identificador del plan anterior */
  planAnteriorId: string;
  /** Identificador del nuevo plan (opcional, puede ser el mismo) */
  planNuevoId?: string;
  /** Origen de la renovación: sistema o usuario */
  origen: 'sistema' | 'usuario';
  /** Notas adicionales sobre la renovación (opcional) */
  notas?: string;
  /** Información del cliente (opcional, para visualización) */
  cliente?: {
    id: string;
    nombre: string;
    email: string;
    telefono?: string;
  };
  /** Información del plan actual (opcional, para visualización) */
  planActual?: {
    id: string;
    nombre: string;
    precio?: number;
  };
  /** Días restantes hasta el vencimiento (calculado) */
  diasRestantes?: number;
}

/**
 * Filtros para consultar renovaciones
 * Utilizado por: RenovacionesManager
 */
export interface FiltrosRenovaciones {
  /** Rango de fechas de vencimiento (opcional) */
  fechaVencimientoDesde?: string;
  fechaVencimientoHasta?: string;
  /** Tipo de renovación: automática o manual (opcional) */
  tipo?: 'automatica' | 'manual';
  /** Estado de renovación (opcional) */
  estado?: EstadoRenovacion;
  /** ID del plan (opcional) */
  planId?: string;
}

// ============================================================================
// BAJA
// ============================================================================

/**
 * Representa una baja/cancelación de suscripción
 * Utilizado por: GestorBajas
 */
export interface Baja {
  /** Identificador único de la baja */
  id: string;
  /** Identificador del cliente que da de baja */
  clienteId: string;
  /** Identificador de la suscripción cancelada (opcional) */
  suscripcionId?: string;
  /** Fecha en que se solicitó la baja */
  fechaSolicitud: string;
  /** Fecha efectiva de la baja */
  fechaEfectiva: string;
  /** Tipo de efecto: inmediata o al final del período */
  tipoEfecto: 'inmediata' | 'fin_periodo';
  /** Identificador del motivo principal de la baja */
  motivoPrincipalId: string;
  /** Identificadores de otros motivos adicionales (opcional) */
  otrosMotivosIds?: string[];
  /** Indica si se realizó un intento de retención */
  intentoRetencionRealizado: boolean;
  /** Resultado del intento de retención (opcional) */
  resultadoRetencion?: 'retenido' | 'no_retenido';
  /** Comentarios adicionales sobre la baja (opcional) */
  comentarios?: string;
}

/**
 * Filtros para consultar bajas
 * Utilizado por: getBajas
 */
export interface FiltrosBajas {
  /** Rango de fechas de solicitud (opcional) */
  fechaDesde?: string;
  fechaHasta?: string;
  /** Filtro por motivo principal (opcional) */
  motivoPrincipalId?: string;
  /** Filtro por resultado de retención (opcional) */
  resultadoRetencion?: 'retenido' | 'no_retenido';
  /** Filtro por tipo de efecto (opcional) */
  tipoEfecto?: 'inmediata' | 'fin_periodo';
}

/**
 * Estadísticas de bajas para un período
 * Utilizado por: getEstadisticasBajas
 */
export interface EstadisticasBajas {
  /** Total de bajas en el período */
  totalBajas: number;
  /** Bajas con efecto inmediato */
  bajasInmediatas: number;
  /** Bajas con efecto al final del período */
  bajasFinPeriodo: number;
  /** Tasa de retención intentada (porcentaje de bajas con intento de retención) */
  tasaRetencionIntentada: number;
  /** Tasa de retención exitosa (porcentaje de bajas retenidas sobre las que se intentó retener) */
  tasaRetencionExitosa: number;
}

// ============================================================================
// MOTIVO DE BAJA
// ============================================================================

/**
 * Representa un motivo de baja/cancelación
 * Utilizado por: MotivosBaja, GestorBajas
 */
export interface MotivoBaja {
  /** Identificador único del motivo */
  id: string;
  /** Categoría del motivo de baja */
  categoria: 'precio' | 'no_uso' | 'ubicacion' | 'salud' | 'insatisfaccion' | 'competencia' | 'otros';
  /** Descripción del motivo */
  descripcion: string;
  /** Indica si el motivo es editable por el usuario */
  esEditable: boolean;
}

// ============================================================================
// ALERTA DE VENCIMIENTO
// ============================================================================

/**
 * Representa una alerta de vencimiento de suscripción
 * Utilizado por: AlertasVencimiento
 */
export interface AlertaVencimiento {
  /** Identificador único de la alerta */
  id: string;
  /** Identificador de la suscripción asociada */
  suscripcionId: string;
  /** Identificador del cliente */
  clienteId: string;
  /** Fecha de vencimiento de la suscripción */
  fechaVencimiento: string;
  /** Días restantes hasta el vencimiento */
  diasRestantes: number;
  /** Prioridad de la alerta */
  prioridad: 'alta' | 'media' | 'baja';
  /** Indica si la alerta ha sido leída */
  leida: boolean;
  /** Canal de comunicación preferido para la alerta */
  canalPreferido: 'email' | 'whatsapp' | 'sms' | 'ninguno';
  /** Fecha de creación de la alerta */
  creadoEn: string;
  /** Información del cliente (opcional, para visualización) */
  cliente?: {
    id: string;
    nombre: string;
    email?: string;
    telefono?: string;
  };
  /** Mensaje descriptivo de la alerta (opcional) */
  mensaje?: string;
}

/**
 * Filtros para consultar alertas de vencimiento
 * Utilizado por: getAlertasVencimiento
 */
export interface FiltrosAlertasVencimiento {
  /** Filtro por prioridad (opcional) */
  prioridad?: 'alta' | 'media' | 'baja';
  /** Filtro por días restantes mínimos (opcional) */
  diasRestantesMin?: number;
  /** Filtro por días restantes máximos (opcional) */
  diasRestantesMax?: number;
  /** Filtro por estado de lectura (opcional) */
  leida?: boolean;
}

/**
 * Configuración de alertas de vencimiento
 * Utilizado por: configurarDiasAnticipacion, getConfiguracionAlertas
 */
export interface ConfiguracionAlertas {
  /** Días de anticipación para generar alertas */
  diasAnticipacion: number;
  /** Umbral de días para prioridad alta */
  prioridadAltaUmbral: number;
  /** Umbral de días para prioridad media */
  prioridadMediaUmbral: number;
}

// ============================================================================
// MÉTRICAS DE CHURN
// ============================================================================

/**
 * Representa las métricas de churn para un período determinado
 * Utilizado por: AnalisisChurn
 */
export interface MetricasChurn {
  /** Período de análisis: mensual o anual */
  periodo: 'mensual' | 'anual';
  /** Año del período */
  anio: number;
  /** Mes del período (opcional, solo para períodos mensuales) */
  mes?: number;
  /** Tasa de churn calculada */
  tasaChurn: number;
  /** Tasa de retención calculada */
  tasaRetencion: number;
  /** Número de clientes activos al inicio del período */
  clientesActivosInicio: number;
  /** Número de clientes activos al final del período */
  clientesActivosFin: number;
  /** Número de clientes que dieron de baja en el período */
  clientesBajaPeriodo: number;
  /** LTV (Lifetime Value) medio de los clientes (opcional) */
  ltvMedio?: number;
  /** Permanencia media en meses (opcional) */
  permanenciaMediaMeses?: number;
}

// ============================================================================
// TIPOS AUXILIARES Y COMPATIBILIDAD
// ============================================================================

/**
 * Tipo de usuario del sistema
 * Utilizado por: RenovacionesManager, GestorBajas
 */
export type UserType = 'entrenador' | 'gimnasio';

/**
 * Prioridad de alerta (mantenido para compatibilidad)
 * @deprecated Usar el tipo 'alta' | 'media' | 'baja' directamente en AlertaVencimiento
 */
export type PrioridadAlerta = 'alta' | 'media' | 'baja';

/**
 * Categoría de motivo de baja (mantenido para compatibilidad)
 * @deprecated Usar el tipo de categoria en MotivoBaja
 */
export type CategoriaMotivoBaja = 
  | 'Motivos Economicos' 
  | 'Motivos Personales' 
  | 'Motivos de Servicio' 
  | 'Motivos de Ubicacion' 
  | 'Motivos de Salud';

// ============================================================================
// TIPOS DE REQUEST/RESPONSE (para compatibilidad con componentes existentes)
// ============================================================================

/**
 * Request para procesar una renovación
 * Utilizado por: RenovacionesManager
 */
export interface ProcessRenovacionRequest {
  renovacionId: string;
  nuevaFechaVencimiento?: string;
  notas?: string;
}

/**
 * Request para crear un motivo de baja
 * Utilizado por: MotivosBaja
 */
export interface CreateMotivoBajaRequest {
  nombre: string;
  categoria: CategoriaMotivoBaja;
  descripcion?: string;
}

/**
 * Request para actualizar un motivo de baja
 * Utilizado por: MotivosBaja
 */
export interface UpdateMotivoBajaRequest {
  nombre?: string;
  categoria?: CategoriaMotivoBaja;
  descripcion?: string;
  activo?: boolean;
}

/**
 * Acción que se puede realizar sobre una alerta
 * Utilizado por: AlertasVencimiento
 */
export type AccionAlerta = 'renovar' | 'contactar' | 'posponer';

// ============================================================================
// TIPOS LEGACY (mantenidos para compatibilidad con código existente)
// ============================================================================

/**
 * Cliente (tipo legacy, puede ser reemplazado por un tipo centralizado)
 * Utilizado por: Componentes que aún no han migrado
 */
export interface Cliente {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
}

/**
 * Membresía (tipo legacy, puede ser reemplazado por Suscripción)
 * Utilizado por: Componentes que aún no han migrado
 */
export interface Membresia {
  id: string;
  clienteId: string;
  tipo: 'bono-pt' | 'cuota-mensual' | 'otro';
  fechaVencimiento: string;
  activa: boolean;
}

/**
 * Datos de churn (tipo legacy)
 * @deprecated Usar MetricasChurn en su lugar
 * Utilizado por: Componentes que aún no han migrado
 */
export interface ChurnData {
  periodo: string;
  sociosIniciales: number;
  bajas: number;
  motivosBaja: string[];
  tasaChurn: number;
}

/**
 * Período de churn (tipo legacy)
 * Utilizado por: Componentes que aún no han migrado
 */
export interface PeriodoChurn {
  tipo: 'mensual' | 'trimestral' | 'anual';
  fechaInicio: string;
  fechaFin: string;
}
