/**
 * Tipos TypeScript compartidos para el módulo de Objetivos y Rendimiento
 * 
 * Este archivo centraliza todas las definiciones de tipos, interfaces y enums
 * utilizados en el módulo de análisis de rendimiento, objetivos, métricas, KPIs,
 * alertas y reportes. Los tipos están diseñados para ser reutilizables desde
 * otros módulos del sistema.
 */

// ============================================================================
// TIPOS BÁSICOS Y ENUMS
// ============================================================================

/**
 * Roles de usuario del sistema
 * @example 'entrenador' | 'gimnasio'
 */
export type UserRole = 'entrenador' | 'gimnasio';

/**
 * Estado de un objetivo durante su ciclo de vida
 * - on_track: El objetivo avanza según lo esperado
 * - at_risk: El objetivo tiene riesgo de no cumplirse
 * - off_track: El objetivo está desviado del plan
 * - completed: El objetivo ha sido completado exitosamente
 * - not_started: El objetivo aún no ha comenzado
 * - in_progress: El objetivo está en ejecución (sinónimo de on_track)
 * - failed: El objetivo no se alcanzó antes del plazo
 * 
 * @example ObjectiveStatus.on_track
 */
export enum ObjectiveStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  ON_TRACK = 'on_track',
  AT_RISK = 'at_risk',
  OFF_TRACK = 'off_track',
  COMPLETED = 'completed',
  ACHIEVED = 'achieved', // Alias para compatibilidad
  FAILED = 'failed',
}

/**
 * Tipos de objetivos según su naturaleza o dominio de negocio
 * - facturacion: Objetivos relacionados con ingresos y facturación
 * - retencion: Objetivos de retención de clientes
 * - adherencia: Objetivos de adherencia a planes de entrenamiento
 * - leads: Objetivos de captación de nuevos clientes
 * - ocupacion: Objetivos de ocupación de instalaciones
 * - operacional: Objetivos operativos generales
 * - comercial: Objetivos comerciales y de ventas
 * - calidad: Objetivos de calidad del servicio
 * 
 * @example ObjectiveType.FACTURACION
 */
export enum ObjectiveType {
  FACTURACION = 'facturacion',
  RETENCION = 'retencion',
  ADHERENCIA = 'adherencia',
  LEADS = 'leads',
  OCUPACION = 'ocupacion',
  OPERACIONAL = 'operacional',
  COMERCIAL = 'comercial',
  CALIDAD = 'calidad',
  GENERAL = 'general',
}

/**
 * Categorías de métricas para agrupación y análisis
 * - finanzas: Métricas financieras (facturación, ingresos, costos)
 * - clientes: Métricas relacionadas con clientes (retención, satisfacción)
 * - operaciones: Métricas operacionales (ocupación, eficiencia)
 * - marketing: Métricas de marketing y adquisición
 * - recursos_humanos: Métricas de RRHH (productividad, rendimiento)
 * - calidad: Métricas de calidad del servicio
 * 
 * @example MetricCategory.FINANZAS
 */
export enum MetricCategory {
  FINANZAS = 'financiero',
  CLIENTES = 'clientes',
  OPERACIONES = 'operacional',
  MARKETING = 'marketing',
  RECURSOS_HUMANOS = 'recursos_humanos',
  CALIDAD = 'calidad',
}

/**
 * Tipo de reporte según su periodicidad
 * - daily: Reporte diario
 * - weekly: Reporte semanal
 * - monthly: Reporte mensual
 * - quarterly: Reporte trimestral
 * - yearly: Reporte anual
 * - custom: Reporte personalizado con rango de fechas específico
 * 
 * @example ReportType.MONTHLY
 */
export enum ReportType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
  CUSTOM = 'custom',
}

/**
 * Formato de exportación de reportes
 * - pdf: Formato PDF
 * - excel: Formato Excel (.xlsx)
 * - csv: Formato CSV
 * - json: Formato JSON
 */
export enum ReportFormat {
  PDF = 'pdf',
  EXCEL = 'excel',
  CSV = 'csv',
  JSON = 'json',
}

/**
 * Estado de generación de un reporte
 * - pending: Pendiente de generación
 * - generating: En proceso de generación
 * - completed: Generado exitosamente
 * - failed: Error en la generación
 */
export enum ReportStatus {
  PENDING = 'pending',
  GENERATING = 'generating',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

/**
 * Dirección de tendencia de una métrica
 * - up: Tendencia ascendente (positiva)
 * - down: Tendencia descendente (negativa)
 * - neutral: Sin cambio significativo
 */
export type TrendDirection = 'up' | 'down' | 'neutral';

/**
 * Tipo de alerta según su naturaleza
 * - warning: Advertencia que requiere atención
 * - error: Error o problema crítico
 * - info: Información general
 * - success: Notificación de éxito o logro
 */
export type AlertType = 'warning' | 'error' | 'info' | 'success';

/**
 * Severidad de una alerta
 * - low: Baja severidad, no urgente
 * - medium: Severidad media, atención moderada
 * - high: Alta severidad, requiere acción inmediata
 */
export type AlertSeverity = 'low' | 'medium' | 'high';

/**
 * Tipo de alerta específico para objetivos
 * - riesgo_progreso: Alerta cuando el progreso está por debajo del esperado
 * - umbral_superado: Alerta cuando se supera un umbral crítico
 * - fecha_proxima: Alerta cuando se acerca la fecha límite
 * - objetivo_cumplido: Alerta cuando un objetivo se completa
 * - objetivo_fallido: Alerta cuando un objetivo no se cumple
 */
export enum ObjectiveAlertType {
  RIESGO_PROGRESO = 'riesgo_progreso',
  UMBRAL_SUPERADO = 'umbral_superado',
  FECHA_PROXIMA = 'fecha_proxima',
  OBJETIVO_CUMPLIDO = 'objetivo_cumplido',
  OBJETIVO_FALLIDO = 'objetivo_fallido',
}

// ============================================================================
// INTERFACES PRINCIPALES
// ============================================================================

/**
 * Interfaz principal para representar un objetivo de rendimiento
 * 
 * Un objetivo define una meta cuantificable con un valor objetivo y un período
 * de tiempo para alcanzarlo. Incluye seguimiento de progreso, responsable
 * asignado y estado actual.
 * 
 * @example
 * const objetivo: Objective = {
 *   id: 'obj-001',
 *   nombre: 'Aumentar facturación mensual',
 *   descripcion: 'Incrementar facturación en 20% respecto al mes anterior',
 *   tipo: ObjectiveType.FACTURACION,
 *   periodo: '2024-12',
 *   valorObjetivo: 50000,
 *   valorActual: 35000,
 *   progreso: 70,
 *   estado: ObjectiveStatus.ON_TRACK,
 *   fechaInicio: '2024-12-01',
 *   fechaFin: '2024-12-31',
 *   responsable: 'user-123',
 *   tags: ['facturacion', 'mensual'],
 *   createdAt: '2024-11-01T00:00:00Z',
 *   updatedAt: '2024-12-15T10:30:00Z'
 * };
 */
export interface Objective {
  /** Identificador único del objetivo */
  id: string;
  
  /** Título del objetivo (compatibilidad con código existente) */
  title: string;
  
  /** Nombre del objetivo (preferido sobre title) */
  nombre?: string;
  
  /** Descripción detallada del objetivo y su propósito */
  descripcion?: string;
  description?: string; // Alias para compatibilidad
  
  /** Métrica asociada al objetivo (nombre de la métrica) */
  metric: string;
  
  /** Tipo de objetivo según su dominio */
  tipo?: ObjectiveType | string;
  
  /** Período al que aplica el objetivo (formato: YYYY-MM o similar) */
  periodo?: string;
  
  /** Valor objetivo a alcanzar */
  targetValue: number;
  valorObjetivo?: number; // Alias para compatibilidad
  
  /** Valor actual alcanzado */
  currentValue: number;
  valorActual?: number; // Alias para compatibilidad
  
  /** Unidad de medida (€, %, clientes, etc.) */
  unit: string;
  
  /** Fecha límite para alcanzar el objetivo (ISO 8601) */
  deadline: string;
  
  /** Estado actual del objetivo */
  status: ObjectiveStatus | 'not_started' | 'in_progress' | 'achieved' | 'at_risk' | 'failed';
  
  /** Progreso actual expresado como porcentaje (0-100) */
  progress: number;
  progreso?: number; // Alias para compatibilidad
  
  /** Identificador del usuario responsable del objetivo */
  responsable?: string;
  responsible?: string; // Alias para compatibilidad
  
  /** Categoría del objetivo (compatibilidad con código existente) */
  category?: string;
  
  /** Tags o etiquetas para categorización y búsqueda */
  tags?: string[];
  
  /** Fecha de inicio del objetivo (ISO 8601) */
  fechaInicio?: string;
  
  /** Fecha de finalización del objetivo (ISO 8601) */
  fechaFin?: string;
  
  /** Fecha de creación del registro (ISO 8601) */
  createdAt: string;
  
  /** Fecha de última actualización (ISO 8601) */
  updatedAt: string;
}

/**
 * Interfaz para representar una métrica de rendimiento
 * 
 * Una métrica es un indicador medible que representa un aspecto del negocio.
 * Incluye el valor actual, unidad de medida, tendencia y categoría.
 * 
 * @example
 * const metrica: Metric = {
 *   id: 'metric-001',
 *   nombre: 'Facturación Mensual',
 *   descripcion: 'Total de ingresos facturados en el mes',
 *   unidad: '€',
 *   categoria: MetricCategory.FINANZAS,
 *   valorActual: 45000,
 *   valorObjetivoOpcional: 50000,
 *   tendencia: {
 *     valor: 5.2,
 *     direccion: 'up',
 *     periodo: 'vs mes anterior'
 *   }
 * };
 */
export interface Metric {
  /** Identificador único de la métrica */
  id: string;
  
  /** Nombre de la métrica */
  name: string;
  nombre?: string; // Alias para compatibilidad
  
  /** Descripción de la métrica y cómo se calcula */
  descripcion?: string;
  description?: string; // Alias para compatibilidad
  
  /** Valor actual de la métrica */
  value: number;
  valorActual?: number; // Alias para compatibilidad
  
  /** Unidad de medida (€, %, clientes, horas, etc.) */
  unit: string;
  unidad?: string; // Alias para compatibilidad
  
  /** Información sobre la tendencia de la métrica */
  trend?: {
    /** Variación porcentual del valor */
    value: number;
    /** Dirección de la tendencia */
    direction: TrendDirection;
    direccion?: TrendDirection; // Alias
    /** Período de comparación */
    period: string;
    periodo?: string; // Alias
  };
  tendencia?: {
    valor: number;
    direccion: TrendDirection;
    periodo: string;
  };
  
  /** Valor objetivo opcional (si existe un objetivo asociado) */
  target?: number;
  valorObjetivoOpcional?: number; // Alias
  
  /** Categoría de la métrica */
  category: MetricCategory | string;
  categoria?: MetricCategory | string; // Alias
}

/**
 * Interfaz para representar un KPI (Indicador Clave de Rendimiento)
 * 
 * Un KPI es una métrica especialmente importante que se monitorea de cerca.
 * Extiende o envuelve la funcionalidad de Metric añadiendo características
 * específicas como visibilidad, roles de usuario y configuración de objetivo.
 * 
 * @example
 * const kpi: KPI = {
 *   id: 'kpi-facturacion',
 *   name: 'Facturación',
 *   description: 'Ingresos totales facturados',
 *   metric: 'facturacion',
 *   targetValue: 50000,
 *   unit: '€',
 *   category: MetricCategory.FINANZAS,
 *   isVisible: true,
 *   enabled: true,
 *   role: ['entrenador', 'gimnasio']
 * };
 */
export interface KPI {
  /** Identificador único del KPI */
  id: string;
  
  /** Nombre del KPI */
  name: string;
  
  /** Descripción del KPI y su importancia */
  description?: string;
  descripcion?: string; // Alias
  
  /** Nombre de la métrica asociada */
  metric: string;
  
  /** Valor objetivo del KPI */
  target?: number;
  targetValue?: number; // Alias más específico
  
  /** Unidad de medida */
  unit: string;
  
  /** Categoría del KPI */
  category: string;
  
  /** Indica si el KPI está habilitado y se muestra */
  enabled: boolean;
  isVisible?: boolean; // Alias más descriptivo
  
  /** Roles de usuario que pueden ver este KPI */
  role: UserRole[];
  
  /** Referencia opcional a la métrica completa si se desea envolver Metric */
  metricData?: Metric;
  
  /** Umbral de advertencia (warning) - valor que activa una alerta de advertencia */
  warningThreshold?: number;
  
  /** Umbral de peligro (danger) - valor que activa una alerta crítica */
  dangerThreshold?: number;
}

/**
 * Interfaz para representar una alerta del sistema
 * 
 * Las alertas notifican eventos importantes relacionados con objetivos,
 * métricas o KPIs. Pueden estar vinculadas a objetivos específicos y
 * incluyen información sobre el tipo de alerta, severidad y umbrales.
 * 
 * @example
 * const alerta: Alert = {
 *   id: 'alert-001',
 *   tipo: 'warning',
 *   tipoObjetivo: ObjectiveAlertType.RIESGO_PROGRESO,
 *   titulo: 'Objetivo en riesgo',
 *   mensaje: 'El objetivo de facturación está por debajo del 50% esperado',
 *   objectiveId: 'obj-001',
 *   riesgo: 'alto',
 *   umbral: 50,
 *   severidad: 'high',
 *   createdAt: '2024-12-15T10:00:00Z',
 *   read: false
 * };
 */
export interface Alert {
  /** Identificador único de la alerta */
  id: string;
  
  /** Tipo general de la alerta */
  type: AlertType;
  tipo?: AlertType; // Alias
  
  /** Tipo específico de alerta relacionada con objetivos */
  tipoObjetivo?: ObjectiveAlertType | string;
  
  /** Título de la alerta */
  title: string;
  titulo?: string; // Alias
  
  /** Mensaje descriptivo de la alerta */
  message: string;
  mensaje?: string; // Alias
  
  /** ID del objetivo relacionado (si aplica) */
  objectiveId?: string;
  
  /** ID de la métrica relacionada (si aplica) */
  metricId?: string;
  
  /** Nivel de riesgo (opcional, más descriptivo que severity) */
  riesgo?: 'bajo' | 'medio' | 'alto';
  
  /** Umbral que activó la alerta (valor numérico) */
  umbral?: number;
  
  /** Severidad de la alerta */
  severity: AlertSeverity;
  severidad?: AlertSeverity; // Alias
  
  /** Fecha de creación de la alerta (ISO 8601) */
  createdAt: string;
  
  /** Indica si la alerta ha sido leída por el usuario */
  read: boolean;
  isRead?: boolean; // Alias para compatibilidad
}

/**
 * Interfaz para representar un reporte de rendimiento
 * 
 * Un reporte contiene datos agregados de rendimiento para un período específico.
 * Incluye métricas, objetivos y un resumen ejecutivo. Puede generarse en
 * diferentes formatos y exportarse.
 * 
 * @example
 * const reporte: Report = {
 *   id: 'report-001',
 *   titulo: 'Reporte Mensual - Noviembre 2024',
 *   tipo: ReportType.MONTHLY,
 *   rangoFechas: {
 *     desde: '2024-11-01',
 *     hasta: '2024-11-30'
 *   },
 *   estado: ReportStatus.COMPLETED,
 *   formato: ReportFormat.PDF,
 *   urlDescarga: 'https://api.example.com/reports/report-001.pdf',
 *   period: '2024-11',
 *   data: performanceData,
 *   generatedAt: '2024-12-01T00:00:00Z'
 * };
 */
export interface Report {
  /** Identificador único del reporte */
  id: string;
  
  /** Título del reporte */
  title: string;
  titulo?: string; // Alias
  nombre?: string; // Alias adicional
  
  /** Tipo de reporte según periodicidad */
  type: ReportType | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  tipo?: ReportType | string; // Alias
  
  /** Período del reporte (compatibilidad con código existente) */
  period: string;
  periodo?: string; // Alias
  
  /** Rango de fechas del reporte */
  rangoFechas?: {
    desde: string;
    hasta: string;
  };
  
  /** Estado de generación del reporte */
  estado?: ReportStatus | string;
  status?: ReportStatus | string; // Alias
  
  /** Formato de exportación del reporte */
  formato?: ReportFormat | 'pdf' | 'excel' | 'csv' | 'json';
  format?: ReportFormat | string; // Alias
  
  /** URL mock o real para descargar el reporte */
  urlDescarga?: string;
  downloadUrl?: string; // Alias
  
  /** Datos de rendimiento incluidos en el reporte */
  data: PerformanceData;
  
  /** Fecha de generación del reporte (ISO 8601) */
  generatedAt: string;
}

/**
 * Interfaz para datos de rendimiento agregados
 * 
 * Contiene métricas, objetivos y resumen de rendimiento para un período.
 * Puede incluir series temporales para visualización en gráficos.
 * 
 * @example
 * const performanceData: PerformanceData = {
 *   period: '2024-11',
 *   metrics: [...],
 *   objectives: [...],
 *   summary: {
 *     totalObjectives: 10,
 *     achievedObjectives: 7,
 *     inProgressObjectives: 2,
 *     atRiskObjectives: 1
 *   },
 *   timeSeries: {
 *     dates: ['2024-11-01', '2024-11-08', ...],
 *     metrics: {
 *       'facturacion': [35000, 38000, ...],
 *       'adherencia': [75, 78, ...]
 *     }
 *   }
 * };
 */
export interface PerformanceData {
  /** Período de los datos (YYYY-MM, YYYY-MM-DD, etc.) */
  period: string;
  periodo?: string; // Alias
  
  /** Lista de métricas para el período */
  metrics: Metric[];
  metricas?: Metric[]; // Alias
  
  /** Lista de objetivos activos en el período */
  objectives: Objective[];
  objetivos?: Objective[]; // Alias
  
  /** Resumen ejecutivo de los objetivos */
  summary: {
    /** Total de objetivos */
    totalObjectives: number;
    totalObjetivos?: number; // Alias
    
    /** Objetivos alcanzados */
    achievedObjectives: number;
    objetivosAlcanzados?: number; // Alias
    
    /** Objetivos en progreso */
    inProgressObjectives: number;
    objetivosEnProgreso?: number; // Alias
    
    /** Objetivos en riesgo */
    atRiskObjectives: number;
    objetivosEnRiesgo?: number; // Alias
  };
  
  /** Series temporales para gráficos (opcional) */
  timeSeries?: {
    /** Array de fechas para el eje X */
    dates: string[];
    fechas?: string[]; // Alias
    
    /** Valores de métricas por fecha (clave: nombre métrica, valor: array de valores) */
    metrics: Record<string, number[]>;
    metricas?: Record<string, number[]>; // Alias
  };
}

/**
 * Interfaz para datos de comparación entre períodos
 * 
 * Permite comparar el rendimiento actual con un período anterior,
 * mostrando cambios absolutos y porcentuales.
 * 
 * @example
 * const comparacion: ComparisonData = {
 *   currentPeriod: currentPerformanceData,
 *   previousPeriod: previousPerformanceData,
 *   changes: [
 *     {
 *       metric: 'Facturación',
 *       current: 45000,
 *       previous: 42000,
 *       change: 3000,
 *       changePercent: 7.14
 *     }
 *   ]
 * };
 */
export interface ComparisonData {
  /** Datos del período actual */
  currentPeriod: PerformanceData;
  periodoActual?: PerformanceData; // Alias
  
  /** Datos del período anterior */
  previousPeriod: PerformanceData;
  periodoAnterior?: PerformanceData; // Alias
  
  /** Cambios calculados entre períodos */
  changes: {
    /** Nombre de la métrica */
    metric: string;
    metrica?: string; // Alias
    
    /** Valor actual */
    current: number;
    actual?: number; // Alias
    
    /** Valor anterior */
    previous: number;
    anterior?: number; // Alias
    
    /** Cambio absoluto */
    change: number;
    cambio?: number; // Alias
    
    /** Cambio porcentual */
    changePercent: number;
    cambioPorcentual?: number; // Alias
  }[];
  cambios?: ComparisonData['changes']; // Alias completo
}

/**
 * Interfaz para filtros de búsqueda de objetivos
 * 
 * Permite filtrar objetivos por múltiples criterios para facilitar
 * la búsqueda y visualización.
 */
export interface ObjectiveFilters {
  /** Filtrar por estado del objetivo */
  status?: Objective['status'] | ObjectiveStatus;
  estado?: ObjectiveStatus | string; // Alias
  
  /** Filtrar por categoría o tipo */
  category?: string;
  categoria?: string; // Alias
  tipo?: ObjectiveType | string; // Alias
  
  /** Filtrar por responsable */
  responsible?: string;
  responsable?: string; // Alias
  
  /** Filtrar por período del objetivo (ej: '2024-12', '2024-Q4') */
  periodo?: string;
  
  /** Filtrar por fecha límite desde */
  deadlineFrom?: string;
  fechaDesde?: string; // Alias
  
  /** Filtrar por fecha límite hasta */
  deadlineTo?: string;
  fechaHasta?: string; // Alias
  
  /** Filtrar por tags */
  tags?: string[];
}

// ============================================================================
// TIPOS AUXILIARES Y UTILITARIOS
// ============================================================================

/**
 * Tipo unión para estados de objetivo (compatibilidad con código existente)
 */
export type ObjectiveStatusUnion = 
  | 'not_started' 
  | 'in_progress' 
  | 'achieved' 
  | 'at_risk' 
  | 'failed'
  | 'on_track'
  | 'off_track'
  | 'completed';

/**
 * Tipo unión para tipos de objetivo (compatibilidad)
 */
export type ObjectiveTypeUnion = 
  | 'facturacion'
  | 'retencion'
  | 'adherencia'
  | 'leads'
  | 'ocupacion'
  | 'operacional'
  | 'comercial'
  | 'calidad'
  | 'general';

/**
 * Tipo unión para categorías de métricas (compatibilidad)
 */
export type MetricCategoryUnion = 
  | 'financiero'
  | 'finanzas'
  | 'clientes'
  | 'operacional'
  | 'operaciones'
  | 'marketing'
  | 'recursos_humanos'
  | 'calidad';

/**
 * Parámetros para comparar períodos de rendimiento
 * 
 * Permite especificar dos rangos de fechas para comparar métricas y objetivos
 * entre períodos diferentes.
 */
export interface ComparePeriodsParams {
  /** Rol del usuario (entrenador o gimnasio) */
  role: UserRole;
  
  /** Fecha de inicio del período actual (ISO 8601) */
  currentPeriodStart: string;
  
  /** Fecha de fin del período actual (ISO 8601) */
  currentPeriodEnd: string;
  
  /** Fecha de inicio del período anterior (ISO 8601) */
  previousPeriodStart: string;
  
  /** Fecha de fin del período anterior (ISO 8601) */
  previousPeriodEnd: string;
  
  /** Granularidad de los datos ('day', 'week', 'month') */
  granularity?: 'day' | 'week' | 'month';
}

/**
 * Filtros para búsqueda de reportes
 * 
 * Permite filtrar reportes históricos por múltiples criterios.
 */
export interface ReportFilters {
  /** Filtrar por tipo de reporte */
  tipo?: ReportType | string;
  type?: ReportType | string; // Alias
  
  /** Filtrar por estado del reporte */
  estado?: ReportStatus | string;
  status?: ReportStatus | string; // Alias
  
  /** Filtrar por formato del reporte */
  formato?: ReportFormat | string;
  format?: ReportFormat | string; // Alias
  
  /** Filtrar por fecha de generación desde */
  fechaDesde?: string;
  generatedFrom?: string; // Alias
  
  /** Filtrar por fecha de generación hasta */
  fechaHasta?: string;
  generatedTo?: string; // Alias
  
  /** Filtrar por rango de fechas del reporte (desde) */
  rangoDesde?: string;
  periodFrom?: string; // Alias
  
  /** Filtrar por rango de fechas del reporte (hasta) */
  rangoHasta?: string;
  periodTo?: string; // Alias
}

/**
 * Parámetros para generar un nuevo reporte
 * 
 * Especifica el tipo de reporte, formato, rango de fechas y otras opciones
 * necesarias para la generación.
 */
export interface GenerateReportParams {
  /** Tipo de reporte según periodicidad */
  tipo: ReportType | string;
  type?: ReportType | string; // Alias
  
  /** Formato de exportación deseado */
  formato: ReportFormat | string;
  format?: ReportFormat | string; // Alias
  
  /** Rango de fechas del reporte (requerido para custom, opcional para otros tipos) */
  rangoFechas?: {
    desde: string;
    hasta: string;
  };
  dateRange?: {
    from: string;
    to: string;
  }; // Alias
  
  /** Rol del usuario que solicita el reporte */
  role?: UserRole;
  
  /** Nombre personalizado del reporte (opcional) */
  nombre?: string;
  name?: string; // Alias
}
