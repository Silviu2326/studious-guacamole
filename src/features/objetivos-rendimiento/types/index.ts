export type UserRole = 'entrenador' | 'gimnasio';

// User Story 2: Campos SMART avanzados
export interface SMARTFields {
  // Período del objetivo
  period: {
    startDate: string;
    endDate: string;
    type: 'semana' | 'mes' | 'trimestre' | 'semestre' | 'año' | 'personalizado';
  };
  // Responsable del objetivo
  responsible: {
    userId: string;
    userName: string;
    role?: string;
  };
  // Métricas asociadas (puede tener múltiples métricas relacionadas)
  associatedMetrics: {
    metricId: string;
    metricName: string;
    weight: number; // Peso relativo de esta métrica (0-100)
  }[];
  // Peso relativo del objetivo en el contexto general
  relativeWeight: number; // 0-100, suma total de todos los objetivos debería ser 100
  // Plan de acción sugerido
  suggestedActionPlan: {
    steps: {
      id: string;
      title: string;
      description: string;
      dueDate?: string;
      completed: boolean;
      priority: 'high' | 'medium' | 'low';
    }[];
    generatedBy: 'ai' | 'manual';
    generatedAt: string;
  };
}

// User Story 1: Tipos de objetivos
export type ObjectiveType = 'quantitative' | 'qualitative' | 'okr' | 'project';

// User Story 1: Horizontes temporales
export type ObjectiveHorizon = 'monthly' | 'quarterly' | 'semester' | 'yearly';

// User Story 2: Tipos de asignación
export type AssignmentType = 'individual' | 'team' | 'businessUnit';

// User Story 2: Permisos de objetivo
export interface ObjectivePermissions {
  view: string[]; // IDs de usuarios o roles que pueden ver
  edit: string[]; // IDs de usuarios o roles que pueden editar
  approve: string[]; // IDs de usuarios o roles que pueden aprobar
}

// User Story 2: Asignación de objetivo
export interface ObjectiveAssignment {
  type: AssignmentType;
  id: string; // ID del individuo, equipo o unidad de negocio
  name: string; // Nombre del individuo, equipo o unidad de negocio
}

// User Story 1: Usuario o rol para permisos
export interface PermissionEntity {
  id: string;
  name: string;
  type: 'user' | 'role';
  email?: string; // Si es usuario
}

// User Story: Plan de acción vinculado a un objetivo
export interface ActionPlan {
  id: string;
  title: string;
  description?: string;
  steps: {
    id: string;
    title: string;
    description: string;
    dueDate?: string;
    completed: boolean;
    priority: 'high' | 'medium' | 'low';
    assignedTo?: string;
    assignedToName?: string;
  }[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
}

// User Story: Vinculación de objetivos con KPIs, tareas y planes de acción
export interface ObjectiveLinks {
  // KPIs vinculados del KPIConfigurator
  linkedKPIs: {
    kpiId: string;
    kpiName: string;
    linkedAt: string;
    weight?: number; // Peso relativo del KPI para este objetivo (0-100)
  }[];
  // Tareas vinculadas del módulo Tareas & Alertas
  linkedTasks: {
    taskId: string;
    taskTitle: string;
    linkedAt: string;
  }[];
  // Planes de acción vinculados
  actionPlans: ActionPlan[];
}

// User Story: Gestión de versiones para clonación de objetivos
export interface ObjectiveVersion {
  version: string; // Ej: "Plan A", "Plan B", "v1", "v2"
  parentObjectiveId?: string; // ID del objetivo original si es un clon
  isClone: boolean; // Indica si es un objetivo clonado
  clonedAt?: string; // Timestamp cuando fue clonado
  clonedBy?: string; // Usuario que realizó la clonación
  versionNotes?: string; // Notas sobre las diferencias de esta versión
}

// User Story: Umbrales de color y alertas automáticas
export interface ColorThresholds {
  green: number; // Porcentaje mínimo para estar en verde (ej: 80)
  yellow: number; // Porcentaje mínimo para estar en amarillo (ej: 50)
  red: number; // Por debajo de este porcentaje está en rojo (ej: 50)
  enabled: boolean; // Si los umbrales están activos
}

export interface AutomaticAlert {
  enabled: boolean; // Si las alertas automáticas están activas
  notifyOnYellow: boolean; // Alertar cuando entra en amarillo
  notifyOnRed: boolean; // Alertar cuando entra en rojo
  notifyOnDeviation: boolean; // Alertar cuando se desvía del progreso esperado
  deviationThreshold?: number; // Porcentaje de desviación para alertar (ej: 10%)
  notificationChannels?: ('email' | 'in_app' | 'push')[]; // Canales de notificación
}

// User Story 1: Configuración de recordatorios automáticos para actualizar objetivos
export type ReminderCadence = 'semanal' | 'quincenal';

export interface AutomaticReminder {
  enabled: boolean; // Si los recordatorios automáticos están activos
  cadence: ReminderCadence; // Cadencia del recordatorio (semanal, quincenal)
  notificationChannels?: ('email' | 'in_app' | 'push')[]; // Canales de notificación
  lastReminderSent?: string; // Última vez que se envió un recordatorio
  nextReminderDate?: string; // Próxima fecha programada para el recordatorio
  reminderTime?: string; // Hora del día para enviar el recordatorio (ej: "09:00")
}

// User Story 2: Sugerencias de IA para micro-acciones cuando un objetivo está en riesgo
export type MicroActionType = 'adjust_target' | 'extend_deadline' | 'increase_resources' | 'change_strategy' | 'add_checkpoint' | 'reassign' | 'break_down';

export interface AIMicroActionSuggestion {
  id: string;
  objectiveId: string;
  type: MicroActionType;
  title: string;
  description: string;
  rationale: string; // Explicación de IA sobre por qué se sugiere esta acción
  priority: 'high' | 'medium' | 'low';
  estimatedImpact: 'high' | 'medium' | 'low'; // Impacto estimado en el objetivo
  confidence: number; // 0-100, nivel de confianza de la sugerencia
  suggestedValues?: {
    // Valores sugeridos según el tipo de acción
    newTargetValue?: number;
    newDeadline?: string;
    newResponsible?: string;
    checkpointDate?: string;
    resourceIncrease?: number; // Porcentaje de aumento de recursos
    [key: string]: any;
  };
  createdAt: string;
  applied?: boolean; // Si la sugerencia ya fue aplicada
  appliedAt?: string;
  appliedBy?: string;
}

export interface Objective {
  id: string;
  title: string;
  description?: string;
  metric: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  status: 'not_started' | 'in_progress' | 'achieved' | 'at_risk' | 'failed';
  responsible?: string;
  responsibleName?: string; // Nombre del responsable
  category: string;
  progress: number; // 0-100
  createdAt: string;
  updatedAt: string;
  // User Story 2: Campos SMART avanzados
  smartFields?: SMARTFields;
  // User Story 1: Tipo de objetivo y horizonte
  objectiveType?: ObjectiveType;
  horizon?: ObjectiveHorizon;
  // User Story 2: Asignación y permisos
  assignment?: ObjectiveAssignment;
  permissions?: ObjectivePermissions;
  // User Story: Vinculación con KPIs, tareas y planes de acción
  links?: ObjectiveLinks;
  // User Story: Gestión de versiones para clonación
  version?: ObjectiveVersion;
  // User Story: Umbrales de color y alertas automáticas
  colorThresholds?: ColorThresholds;
  automaticAlerts?: AutomaticAlert;
  // User Story 2: Check-ins de progreso
  checkIns?: ObjectiveCheckIn[];
  // User Story 2: Comentarios y menciones
  comments?: ObjectiveKPIComment[];
  // User Story 1: Tareas rápidas y ajustes desde bloqueos
  quickTasks?: QuickTask[];
  quickAdjustments?: QuickAdjustment[];
  // User Story 2: Dependencias entre objetivos
  dependencies?: {
    feeds: ObjectiveDependency[]; // Objetivos que este objetivo alimenta
    fedBy: ObjectiveDependency[]; // Objetivos que alimentan a este objetivo
  };
  // User Story 1: Recordatorios automáticos para actualizar objetivos
  automaticReminder?: AutomaticReminder;
  // User Story 2: Sugerencias de IA de micro-acciones cuando está en riesgo
  aiMicroActionSuggestions?: AIMicroActionSuggestion[];
  // User Story: Alimentación automática de objetivos desde otras áreas
  dataSource?: ObjectiveDataSource;
  // User Story 1: Documentación adjunta (presentaciones, briefs)
  documents?: ObjectiveDocument[];
  // User Story: Sistema de aprobaciones (workflow)
  isCritical?: boolean; // Si el objetivo es crítico y requiere aprobación
  pendingApproval?: string; // ID de la solicitud de aprobación pendiente
  approvalRequests?: ApprovalRequest[]; // Historial de solicitudes de aprobación
  // User Story: Impacto económico y operativo
  economicImpact?: EconomicImpact;
  operationalImpact?: OperationalImpact;
  // User Story: Archivado de objetivos obsoletos
  archived?: boolean;
  archivedAt?: string;
  archivedBy?: string;
  archivedReason?: string;
  businessContribution?: number; // 0-100, contribución al negocio
  lastActivityAt?: string; // Última actividad (check-in, actualización, etc.)
}

// User Story: Configuración de fuente de datos automática para objetivos
export interface ObjectiveDataSource {
  enabled: boolean; // Si la alimentación automática está activa
  source: ERPSource; // Área del ERP de donde viene la data (ventas, adherencia, nutrición)
  sourceMetric: string; // Métrica específica del área fuente
  syncInterval: number; // Intervalo de sincronización en segundos (ej: 3600 = 1 hora)
  lastSync?: string; // Última vez que se sincronizó
  autoSync: boolean; // Si se sincroniza automáticamente
  mapping?: {
    // Mapeo de campos entre el objetivo y la fuente
    valueField: string; // Campo de valor en la fuente
    unitField?: string; // Campo de unidad en la fuente
    dateField?: string; // Campo de fecha en la fuente
  };
  // Configuración de transformación de datos si es necesario
  transformation?: {
    formula?: string; // Fórmula para transformar el valor (ej: "value * 1.1")
    aggregation?: 'sum' | 'avg' | 'max' | 'min' | 'count'; // Tipo de agregación si hay múltiples valores
    period?: 'day' | 'week' | 'month' | 'quarter' | 'year'; // Período de agregación
  };
}

export interface Metric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    period: string;
  };
  target?: number;
  category: string;
  variation?: number; // Variación porcentual vs período anterior
  previousValue?: number; // Valor del período anterior para calcular variación
  // User Story 1: Campos adicionales para filtros
  segmento?: string;
  responsable?: string;
  origen?: string;
}

// User Story 1: Datos temporales para gráficos interactivos
export interface TimeSeriesDataPoint {
  date: string;
  value: number;
  metricId: string;
  metricName: string;
  unit: string;
  segmento?: string;
  responsable?: string;
  origen?: string;
}

export interface TimeSeriesData {
  metricId: string;
  metricName: string;
  unit: string;
  dataPoints: TimeSeriesDataPoint[];
}

// User Story 2: Datos para comparación de múltiples KPIs
export interface MultiKPIDataPoint {
  date: string;
  [kpiId: string]: string | number; // Cada KPI tiene su propio campo
}

export interface MultiKPIComparison {
  kpis: {
    id: string;
    name: string;
    unit: string;
    color: string;
  }[];
  dataPoints: MultiKPIDataPoint[];
  correlations?: {
    kpi1: string;
    kpi2: string;
    correlation: number; // -1 a 1
    description?: string; // Ej: "Cuando sube la adherencia, baja la morosidad"
  }[];
}

export interface PerformanceData {
  period: string;
  metrics: Metric[];
  objectives: Objective[];
  summary: {
    totalObjectives: number;
    achievedObjectives: number;
    inProgressObjectives: number;
    atRiskObjectives: number;
  };
}

// User Story: Familias o marcos de KPIs
export type KPIFamily = 'finanzas' | 'operaciones' | 'satisfaccion' | 'salud';

export interface KPIFramework {
  id: string;
  name: string;
  family: KPIFamily;
  description?: string;
  color?: string; // Color para visualización
  icon?: string; // Icono para visualización
  createdAt: string;
  updatedAt: string;
}

// User Story: Fuente de datos para KPIs personalizados
export type DataSourceType = 'api' | 'database' | 'calculation' | 'manual' | 'external';

export interface KPIDataSource {
  id: string;
  name: string;
  type: DataSourceType;
  description?: string;
  // Configuración según el tipo
  config?: {
    // Para API
    apiUrl?: string;
    apiKey?: string;
    endpoint?: string;
    method?: 'GET' | 'POST';
    headers?: Record<string, string>;
    // Para database
    table?: string;
    query?: string;
    connectionString?: string;
    // Para calculation (fórmula)
    formula?: string;
    // Para external
    externalSystem?: string;
    syncInterval?: number; // Intervalo de sincronización en segundos
  };
  enabled: boolean;
  lastSync?: string;
  createdAt: string;
  updatedAt: string;
}

// User Story: Fórmula personalizada para cálculo de KPI
export interface KPIFormula {
  id: string;
  formula: string; // Ej: "SUM(facturacion_mensual) / COUNT(clientes_activos)"
  description?: string;
  variables: {
    id: string;
    name: string;
    dataSourceId: string; // ID de la fuente de datos
    field?: string; // Campo específico de la fuente
    defaultValue?: number; // Valor por defecto si no hay datos
  }[];
  validation?: {
    isValid: boolean;
    error?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// User Story: Umbrales para KPIs
export interface KPIThresholds {
  warning?: number; // Umbral de advertencia
  critical?: number; // Umbral crítico
  excellent?: number; // Umbral de excelencia
  // Tipo de umbral (por encima o por debajo del valor)
  type: 'above' | 'below' | 'range';
  // Si es rango, definir mínimo y máximo
  rangeMin?: number;
  rangeMax?: number;
  // Unidad del umbral (mismo que el KPI o diferente)
  unit?: string;
}

// User Story: Responsable de un KPI
export interface KPIResponsible {
  userId: string;
  userName: string;
  role?: string;
  email?: string;
  // Permisos del responsable
  canEdit?: boolean;
  canView?: boolean;
  // Notificaciones
  notifyOnThreshold?: boolean; // Notificar cuando se alcanza umbral
  notifyOnCritical?: boolean; // Notificar cuando es crítico
}

// User Story 2: Versión de KPI para historial de cambios
export interface KPIVersion {
  id: string;
  kpiId: string;
  version: string; // Número de versión (ej: "1.0", "2.0") o nombre (ej: "v2024-Q1")
  name: string;
  description?: string;
  metric: string;
  target?: number;
  unit: string;
  category: string;
  enabled: boolean;
  role: UserRole[];
  order?: number;
  visible?: boolean;
  critical?: boolean;
  criticalThreshold?: number;
  isCustom?: boolean;
  formula?: KPIFormula;
  dataSource?: KPIDataSource;
  thresholds?: KPIThresholds;
  responsibles?: KPIResponsible[];
  family?: KPIFamily;
  frameworkId?: string;
  frameworkName?: string;
  autoCalculate?: boolean;
  calculationFrequency?: 'realtime' | 'hourly' | 'daily' | 'weekly';
  // Metadata de versión
  createdAt: string;
  createdBy: string;
  createdByName: string;
  changeNotes?: string; // Notas sobre los cambios en esta versión
  isCurrentVersion: boolean; // Si es la versión actual
  previousVersionId?: string; // ID de la versión anterior
}

// User Story 2: Cambio en un KPI para el historial
export interface KPIChange {
  field: string; // Campo que cambió (ej: "name", "target", "thresholds")
  oldValue: any;
  newValue: any;
  fieldLabel: string; // Etiqueta legible del campo (ej: "Nombre", "Objetivo")
}

// User Story 2: Entrada en el historial de versiones de un KPI
export interface KPIVersionHistoryEntry {
  id: string;
  kpiId: string;
  version: string;
  versionId: string; // ID de la versión completa
  changes: KPIChange[]; // Lista de cambios en esta versión
  createdAt: string;
  createdBy: string;
  createdByName: string;
  changeNotes?: string;
  isCurrentVersion: boolean;
}

// User Story 1: Mapeo de KPI a Objetivo
export interface KPIToObjectiveMapping {
  id: string;
  kpiId: string;
  kpiName: string;
  objectiveId: string;
  objectiveTitle: string;
  weight?: number; // Peso relativo del KPI para este objetivo (0-100)
  linkedAt: string;
  linkedBy: string;
  linkedByName: string;
  notes?: string; // Notas sobre cómo este KPI sustenta el objetivo
}

export interface KPI {
  id: string;
  name: string;
  description?: string;
  metric: string;
  target?: number;
  unit: string;
  category: string;
  enabled: boolean;
  role: UserRole[];
  order?: number; // Orden de visualización en el dashboard
  visible?: boolean; // Si el KPI debe mostrarse en el dashboard
  critical?: boolean; // User Story 1: Si el KPI es crítico y debe generar alertas cuando cae
  criticalThreshold?: number; // User Story 1: Umbral crítico (porcentaje por debajo del target para alertar)
  // User Story: KPI personalizado con fórmulas, fuentes de datos, umbrales y responsables
  isCustom?: boolean; // Si es un KPI personalizado
  formula?: KPIFormula; // Fórmula personalizada para cálculo
  dataSource?: KPIDataSource; // Fuente de datos
  thresholds?: KPIThresholds; // Umbrales personalizados
  responsibles?: KPIResponsible[]; // Responsables del KPI
  // User Story: Organización en familias o marcos
  family?: KPIFamily; // Familia del KPI (finanzas, operaciones, satisfacción, salud)
  frameworkId?: string; // ID del marco/framework al que pertenece
  frameworkName?: string; // Nombre del marco (para referencia rápida)
  // Cálculo automático
  autoCalculate?: boolean; // Si el sistema debe calcular automáticamente el valor
  calculationFrequency?: 'realtime' | 'hourly' | 'daily' | 'weekly'; // Frecuencia de cálculo
  lastCalculated?: string; // Última vez que se calculó
  calculatedValue?: number; // Valor calculado actual
  // User Story 2: Versionado de KPIs
  currentVersion?: string; // Versión actual del KPI
  versionHistory?: KPIVersionHistoryEntry[]; // Historial de versiones
  // User Story 1: Mapeo a objetivos
  linkedObjectives?: {
    objectiveId: string;
    objectiveTitle: string;
    weight?: number;
    linkedAt: string;
  }[]; // Objetivos vinculados a este KPI
  // User Story 2: Comentarios y menciones
  comments?: ObjectiveKPIComment[];
  // User Story 1: Permisos del KPI
  permissions?: KPIPermissions;
}

// User Story 1: Permisos de KPI
export interface KPIPermissions {
  view: string[]; // IDs de usuarios o roles que pueden ver
  edit: string[]; // IDs de usuarios o roles que pueden editar
  manage?: string[]; // IDs de usuarios o roles que pueden gestionar (configurar, eliminar)
}

// User Story 1 & 2: Tipos de alertas
export type AlertType = 'objective_deviation' | 'kpi_critical_drop' | 'objective_not_updated' | 'objective_at_risk' | 'objective_failed' | 'info' | 'success';

// User Story 2: Prioridad de alerta
export type AlertPriority = 'low' | 'medium' | 'high' | 'critical';

// User Story 1 & 2: Causa detectada de la alerta
export interface DetectedCause {
  type: 'threshold_exceeded' | 'kpi_drop' | 'stale_objective' | 'progress_deviation' | 'deadline_approaching' | 'other';
  description: string;
  details?: {
    threshold?: number;
    currentValue?: number;
    expectedValue?: number;
    deviation?: number;
    daysSinceUpdate?: number;
    daysUntilDeadline?: number;
    [key: string]: any;
  };
}

// User Story 2: Plan de mitigación sugerido por IA
export interface MitigationPlan {
  id: string;
  title: string;
  description: string;
  steps: {
    id: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    estimatedImpact: 'high' | 'medium' | 'low';
    estimatedEffort: 'low' | 'medium' | 'high';
    order: number;
  }[];
  rationale: string; // Explicación de IA sobre por qué este plan es adecuado
  confidence: number; // 0-100, nivel de confianza de la sugerencia
  estimatedTimeToResolve?: string; // Tiempo estimado para resolver (ej: "2-3 días")
  generatedAt: string;
  applied?: boolean;
  appliedAt?: string;
  appliedBy?: string;
}

// User Story: Conversión de alerta
export type AlertConversionType = 'adjustment' | 'task' | 'action_plan';

export interface AlertConversion {
  type: AlertConversionType;
  convertedAt: string;
  convertedBy: string;
  convertedByName: string;
  // ID del elemento creado (ajuste, tarea o plan de acción)
  convertedToId: string;
  // Título del elemento creado
  convertedToTitle: string;
}

// User Story: Resultado de una alerta
export type AlertResultStatus = 'resolved' | 'mitigated' | 'dismissed' | 'converted' | 'pending';

export interface AlertResult {
  status: AlertResultStatus;
  resultDescription?: string; // Descripción del resultado o qué se hizo
  resolvedAt?: string;
  resolvedBy?: string;
  resolvedByName?: string;
  // Si fue resuelta, indicar si funcionó
  wasEffective?: boolean; // Si la mitigación fue efectiva
  effectivenessNotes?: string; // Notas sobre qué funcionó y qué no
  conversion?: AlertConversion; // Si fue convertida, información de la conversión
}

export interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  alertType: AlertType; // User Story 1 & 2: Tipo específico de alerta
  title: string;
  message: string;
  objectiveId?: string;
  metricId?: string;
  kpiId?: string; // User Story 1: ID del KPI crítico si aplica
  severity: 'low' | 'medium' | 'high';
  priority: AlertPriority; // User Story 2: Prioridad de la alerta
  detectedCause?: DetectedCause; // User Story 1 & 2: Causa detectada
  mitigationPlan?: MitigationPlan; // User Story 2: Plan de mitigación sugerido por IA
  createdAt: string;
  read: boolean;
  acknowledged?: boolean; // Si la alerta ha sido reconocida
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  // User Story: Conversión y resultado de alerta
  conversion?: AlertConversion; // Si fue convertida a ajuste/tarea/plan de acción
  result?: AlertResult; // Resultado de la alerta (resuelta, mitigada, etc.)
  customRuleId?: string; // ID de la regla personalizada que generó esta alerta
}

// User Story: Reglas de alerta personalizadas
export type AlertConditionOperator = 'greater_than' | 'less_than' | 'equals' | 'not_equals' | 'greater_or_equal' | 'less_or_equal' | 'between' | 'contains' | 'not_contains';
export type AlertConditionLogic = 'AND' | 'OR';
export type AlertPeriod = 'day' | 'week' | 'month' | 'quarter' | 'year' | 'custom';

export interface AlertCondition {
  id: string;
  field: 'progress' | 'currentValue' | 'targetValue' | 'deviation' | 'daysUntilDeadline' | 'daysSinceUpdate' | 'status' | 'metric' | 'category';
  operator: AlertConditionOperator;
  value: any; // Valor de comparación
  value2?: any; // Segundo valor para operadores 'between'
  metricId?: string; // Si el campo es 'metric', especificar qué métrica
}

export interface CustomAlertRule {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  active: boolean; // Si está activa (después de probarla)
  // Condiciones múltiples
  conditions: AlertCondition[];
  conditionLogic: AlertConditionLogic; // AND u OR entre condiciones
  // Periodos
  period: AlertPeriod;
  periodStart?: string; // Para periodos personalizados
  periodEnd?: string; // Para periodos personalizados
  // Responsables
  responsibleIds?: string[]; // IDs de responsables a los que aplicar la regla
  responsibleNames?: string[]; // Nombres de responsables
  // Filtros adicionales
  objectiveIds?: string[]; // IDs de objetivos específicos
  category?: string; // Categoría de objetivos
  // Configuración de alerta
  alertType: AlertType;
  priority: AlertPriority;
  severity: 'low' | 'medium' | 'high';
  titleTemplate?: string; // Plantilla para el título de la alerta
  messageTemplate?: string; // Plantilla para el mensaje de la alerta
  // Notificaciones
  notificationChannels?: ('email' | 'in_app' | 'push')[];
  // Pruebas
  testResults?: AlertRuleTestResult[];
  lastTestedAt?: string;
  lastTestedBy?: string;
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdByName: string;
}

export interface AlertRuleTestResult {
  id: string;
  ruleId: string;
  testedAt: string;
  testedBy: string;
  testedByName: string;
  // Resultados de la prueba
  matchedObjectives: string[]; // IDs de objetivos que cumplen las condiciones
  matchedCount: number;
  wouldGenerateAlerts: number; // Cuántas alertas se generarían
  sampleAlerts: Alert[]; // Ejemplos de alertas que se generarían
  // Análisis
  noiseLevel: 'low' | 'medium' | 'high'; // Nivel de ruido estimado
  noiseReason?: string; // Razón del nivel de ruido
  recommendations?: string[]; // Recomendaciones para reducir ruido
}

export interface Report {
  id: string;
  title: string;
  type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
  period: string;
  data: PerformanceData;
  generatedAt: string;
  // User Story 2: Campos para reportes personalizados
  customReportConfig?: CustomReportConfig;
  // User Story 1: Resumen narrativo generado por IA
  aiNarrativeSummary?: AINarrativeSummary;
  // User Story 2: Comparativas, riesgos y acciones
  objectivesVsTargets?: ObjectiveVsTargetComparison[];
  detectedRisks?: DetectedRisk[];
  proposedActions?: ProposedAction[];
}

// User Story 2: Configuración de reporte personalizado
export interface CustomReportConfig {
  audience: 'management' | 'investors' | 'team' | 'custom';
  includeMetrics: boolean;
  includeCharts: boolean;
  includeComments: boolean;
  selectedObjectives?: string[]; // IDs de objetivos a incluir
  selectedMetrics?: string[]; // IDs de métricas a incluir
  chartTypes?: ('bar' | 'line' | 'pie' | 'area')[];
  comments?: ReportComment[];
  template?: 'executive' | 'detailed' | 'presentation' | 'custom';
  customSections?: CustomReportSection[];
}

// User Story 2: Comentario en reporte
export interface ReportComment {
  id: string;
  objectiveId?: string;
  metricId?: string;
  content: string;
  author: string;
  authorName: string;
  createdAt: string;
  type: 'insight' | 'recommendation' | 'observation' | 'warning';
}

// User Story 2: Sección personalizada en reporte
export interface CustomReportSection {
  id: string;
  title: string;
  content: string;
  order: number;
  includeChart?: boolean;
  chartType?: 'bar' | 'line' | 'pie' | 'area';
}

export interface ComparisonData {
  currentPeriod: PerformanceData;
  previousPeriod: PerformanceData;
  changes: {
    metric: string;
    current: number;
    previous: number;
    change: number;
    changePercent: number;
  }[];
}

// User Story: Comparación entre unidades (equipos, sedes)
export type ComparisonUnitType = 'team' | 'site' | 'businessUnit' | 'responsible';

export interface UnitComparisonData {
  unitType: ComparisonUnitType;
  unit1: {
    id: string;
    name: string;
    data: PerformanceData;
  };
  unit2: {
    id: string;
    name: string;
    data: PerformanceData;
  };
  period: string; // Período comparado
  changes: {
    metric: string;
    unit1Value: number;
    unit2Value: number;
    difference: number;
    differencePercent: number;
    winner: 'unit1' | 'unit2' | 'tie';
  }[];
  opportunities: ComparisonOpportunity[]; // Oportunidades detectadas
}

export interface ComparisonOpportunity {
  id: string;
  type: 'performance_gap' | 'best_practice' | 'resource_optimization' | 'risk_mitigation';
  title: string;
  description: string;
  metric: string;
  unit1Value: number;
  unit2Value: number;
  recommendation: string;
  estimatedImpact: 'low' | 'medium' | 'high';
  priority: 'low' | 'medium' | 'high';
}

export interface ObjectiveFilters {
  archived?: boolean; // Filtrar por objetivos archivados o no archivados
  status?: Objective['status'];
  category?: string;
  responsible?: string;
  deadlineFrom?: string;
  deadlineTo?: string;
  // User Story 1: Filtros por tipo y horizonte
  objectiveType?: ObjectiveType;
  horizon?: ObjectiveHorizon;
  // User Story 2: Filtros por asignación
  assignmentType?: AssignmentType;
  assignmentId?: string;
  // User Story: Filtros por versión y clonación
  parentObjectiveId?: string; // Filtrar por objetivo padre (para ver versiones)
  isClone?: boolean; // Filtrar solo clones o solo originales
  version?: string; // Filtrar por versión específica
}

export interface GlobalFilters {
  sede?: string;
  equipo?: string;
  lineaNegocio?: string;
  // User Story 1: Filtros adicionales para gráficos interactivos
  segmento?: string;
  responsable?: string;
  origen?: string;
}

export type TabId = 'dashboard' | 'objetivos' | 'metricas' | 'seguimiento' | 'reportes' | 'alertas' | 'comparacion' | 'simulacion' | 'configuracion' | 'aprobaciones' | 'patrones-exito';

export interface TabConfig {
  id: TabId;
  label: string;
  visible: boolean;
  order: number;
  tooltip?: string;
  videoUrl?: string;
}

export interface TabProgress {
  tabId: TabId;
  value: number;
  label: string;
  type: 'percentage' | 'count' | 'status';
}

// User Story 1: Sincronización de widgets con otras áreas del ERP
// User Story: Alimentación automática de objetivos desde otras áreas
export type ERPSource = 'finanzas' | 'adherencia' | 'campanas' | 'nutricion' | 'ventas';

export interface WidgetSyncConfig {
  widgetId: string; // ID del widget/KPI que se sincroniza
  source: ERPSource; // Área del ERP de donde viene la data
  sourceMetric: string; // Métrica específica del área fuente
  syncEnabled: boolean; // Si la sincronización está activa
  syncInterval: number; // Intervalo de sincronización en segundos (ej: 30, 60, 300)
  lastSync?: string; // Última vez que se sincronizó
  autoSync: boolean; // Si se sincroniza automáticamente
  mapping?: {
    // Mapeo de campos entre el widget y la fuente
    valueField: string; // Campo de valor en la fuente
    unitField?: string; // Campo de unidad en la fuente
    dateField?: string; // Campo de fecha en la fuente
  };
}

export interface ERPSyncData {
  source: ERPSource;
  metric: string;
  value: number;
  unit: string;
  timestamp: string;
  metadata?: {
    period?: string;
    category?: string;
    [key: string]: any;
  };
}

export interface WidgetSyncStatus {
  widgetId: string;
  isSyncing: boolean;
  lastSyncTime?: string;
  lastSyncStatus: 'success' | 'error' | 'pending';
  errorMessage?: string;
  nextSyncTime?: string;
}

// Objetivos automáticos sugeridos por IA
export interface AISuggestedObjective {
  id: string;
  title: string;
  description: string;
  metric: string;
  suggestedTargetValue: number;
  currentValue: number;
  unit: string;
  rationale: string; // Explicación de IA sobre por qué se sugiere este objetivo
  confidence: number; // 0-100, nivel de confianza de la sugerencia
  basedOn: {
    historicalAverage?: number;
    trend?: 'increasing' | 'decreasing' | 'stable';
    similarPeriods?: number[];
    industryBenchmark?: number; // Benchmark del sector
    benchmarkSource?: string; // Fuente del benchmark (ej: "Sector fitness España 2024")
    benchmarkPercentile?: number; // Percentil del benchmark (ej: 50 = mediana, 75 = percentil 75)
  };
  deadline?: string; // Fecha sugerida para alcanzar el objetivo
  category: string;
}

// Insights destacados con explicaciones de IA
export interface HighlightedInsight {
  id: string;
  title: string;
  description: string; // Ej: "Las sesiones martes contribuyen al 40% del objetivo semanal"
  metric: string;
  value: number;
  unit: string;
  percentage?: number; // Porcentaje de contribución si aplica
  type: 'opportunity' | 'achievement' | 'warning' | 'trend';
  aiExplanation: string; // Explicación detallada de IA sobre el insight
  actionableRecommendation?: string; // Recomendación accionable basada en el insight
  impact: 'high' | 'medium' | 'low';
  relatedMetric?: string;
  period?: string; // Período al que se refiere el insight
}

// Comparación extendida con objetivos sugeridos por IA
export interface ExtendedComparisonData extends ComparisonData {
  aiSuggestedObjectives?: AISuggestedObjective[];
  comparisonWithAI?: {
    metric: string;
    current: number;
    aiSuggested: number;
    difference: number;
    differencePercent: number;
    rationale: string;
  }[];
}

// User Story: Análisis de IA de diferencias significativas y causas
export interface SignificantDifference {
  id: string;
  metric: string;
  metricName: string;
  currentValue: number;
  previousValue: number;
  difference: number;
  differencePercent: number;
  significance: 'low' | 'medium' | 'high' | 'critical';
  isSignificant: boolean;
  statisticalSignificance?: number; // 0-100, nivel de significancia estadística
  possibleCauses: PossibleCause[];
  aiExplanation: string;
  recommendation?: string;
  context?: {
    historicalAverage?: number;
    industryBenchmark?: number;
    trend?: 'increasing' | 'decreasing' | 'stable' | 'volatile';
    seasonality?: boolean;
    externalFactors?: string[];
  };
}

export interface PossibleCause {
  id: string;
  cause: string;
  description: string;
  likelihood: 'low' | 'medium' | 'high'; // Probabilidad de que sea la causa
  confidence: number; // 0-100, nivel de confianza de la IA
  evidence?: string; // Evidencia que apoya esta causa
  impact?: 'low' | 'medium' | 'high'; // Impacto estimado de esta causa
}

export interface AIComparisonAnalysis {
  id: string;
  currentPeriod: string;
  previousPeriod: string;
  significantDifferences: SignificantDifference[];
  overallSummary: string;
  keyInsights: string[];
  riskAreas: string[];
  opportunities: string[];
  generatedAt: string;
  confidence: number; // 0-100, nivel de confianza general del análisis
}

// User Story: Configuración de highlights automáticos de IA
export interface AIHighlightsConfig {
  enabled: boolean;
  showAnomalies: boolean;
  showImportantChanges: boolean;
  anomalyThreshold?: number; // Porcentaje de desviación para considerar anomalía (ej: 20%)
  changeThreshold?: number; // Porcentaje de cambio para considerar importante (ej: 10%)
}

// User Story: Anomalía detectada por IA
export interface DetectedAnomaly {
  id: string;
  metricId: string;
  metricName: string;
  currentValue: number;
  expectedValue: number;
  deviation: number; // Porcentaje de desviación
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detectedAt: string;
  aiExplanation: string;
  recommendation?: string;
}

// User Story: Cambio importante detectado por IA
export interface ImportantChange {
  id: string;
  metricId: string;
  metricName: string;
  previousValue: number;
  currentValue: number;
  changePercent: number;
  changeType: 'increase' | 'decrease' | 'spike' | 'drop';
  significance: 'low' | 'medium' | 'high';
  description: string;
  detectedAt: string;
  aiExplanation: string;
  recommendation?: string;
}

// User Story: Formatos de exportación
export type ExportFormat = 'csv' | 'png' | 'jpg' | 'svg' | 'pdf' | 'embed';

// User Story: Opciones de exportación
export interface ExportOptions {
  format: ExportFormat;
  includeCharts?: boolean;
  includeData?: boolean;
  chartIds?: string[]; // IDs de gráficos específicos a exportar
  filename?: string;
}

// User Story 1: Fuentes externas para contextualizar variaciones en gráficos
export type ExternalSourceType = 'crm' | 'wearable' | 'campaign' | 'other';

export interface ExternalSource {
  id: string;
  name: string;
  type: ExternalSourceType;
  description?: string;
  enabled: boolean;
  connectionConfig?: {
    apiKey?: string;
    apiUrl?: string;
    credentials?: Record<string, any>;
  };
  syncInterval?: number; // Intervalo de sincronización en segundos
  lastSync?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExternalEvent {
  id: string;
  sourceId: string;
  sourceName: string;
  sourceType: ExternalSourceType;
  name: string;
  description?: string;
  date: string; // Fecha del evento
  metadata?: {
    campaignId?: string;
    campaignName?: string;
    wearableDeviceId?: string;
    crmContactId?: string;
    [key: string]: any;
  };
  relatedMetrics?: string[]; // IDs de métricas relacionadas
  impact?: {
    metricId: string;
    expectedImpact?: number; // Impacto esperado en la métrica
    actualImpact?: number; // Impacto real observado
  }[];
}

// Anotación para mostrar en gráficos
export interface ChartAnnotation {
  id: string;
  eventId: string;
  date: string;
  label: string;
  description?: string;
  sourceType: ExternalSourceType;
  color?: string; // Color de la etiqueta
  position?: 'top' | 'bottom' | 'auto';
  metricIds: string[]; // Métricas donde se debe mostrar esta anotación
}

// User Story 2: Vistas personalizadas guardadas
export interface SavedMetricView {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  shared: boolean; // Si la vista es compartida con otros usuarios
  sharedWith?: string[]; // IDs de usuarios con los que se comparte
  shareToken?: string; // Token para compartir la vista vía URL
  
  // Configuración de la vista
  config: {
    chartType: 'list' | 'bar' | 'line' | 'interactive' | 'multi-kpi';
    selectedMetrics?: string[]; // IDs de métricas seleccionadas
    selectedKPIs?: string[]; // IDs de KPIs seleccionados (para multi-kpi)
    period: 'week' | 'month' | 'quarter' | 'year';
    filters: GlobalFilters;
    category?: string;
    // Configuración adicional del gráfico
    chartOptions?: {
      showTargets?: boolean;
      showTrends?: boolean;
      showAnnotations?: boolean; // Mostrar anotaciones de fuentes externas
    };
  };
  
  // Captura de pantalla o preview (opcional)
  preview?: string; // Base64 image o URL
}

// User Story 2: Check-in de progreso para objetivos
export interface ObjectiveCheckIn {
  id: string;
  objectiveId: string;
  date: string;
  progress: number; // Progreso actualizado (0-100)
  currentValue: number; // Valor actual actualizado
  notes?: string; // Notas del check-in
  evidence?: CheckInEvidence[]; // Evidencias adjuntas (archivos, imágenes, etc.)
  comments?: CheckInComment[]; // Comentarios del check-in
  createdBy: string; // ID del usuario que creó el check-in
  createdByName: string; // Nombre del usuario que creó el check-in
  createdAt: string;
  updatedAt: string;
}

// User Story 2: Evidencia adjunta a un check-in
export interface CheckInEvidence {
  id: string;
  type: 'image' | 'document' | 'link' | 'video';
  url: string;
  name: string;
  description?: string;
  uploadedAt: string;
  uploadedBy: string;
  uploadedByName: string;
}

// User Story 2: Comentario en un check-in
export interface CheckInComment {
  id: string;
  checkInId: string;
  content: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt?: string;
}

// User Story 2: Menciones en comentarios
export interface Mention {
  userId: string;
  userName: string;
  userEmail?: string;
  position: number; // Posición en el texto donde comienza la mención
  length: number; // Longitud de la mención en el texto
}

// User Story 2: Comentario en objetivo o KPI
export interface ObjectiveKPIComment {
  id: string;
  objectiveId?: string; // Si es comentario de objetivo
  kpiId?: string; // Si es comentario de KPI
  content: string;
  mentions?: Mention[]; // Menciones de miembros del equipo
  createdBy: string;
  createdByName: string;
  createdByEmail?: string;
  createdAt: string;
  updatedAt?: string;
  replies?: ObjectiveKPIComment[]; // Respuestas al comentario
  parentCommentId?: string; // ID del comentario padre si es una respuesta
}

// User Story 1: Tarea rápida asignada desde un objetivo con bloqueos
export interface QuickTask {
  id: string;
  objectiveId: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  assignedTo?: string;
  assignedToName?: string;
  dueDate?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  createdBy: string;
  createdByName: string;
  completedAt?: string;
  blockerReason?: string; // Razón del bloqueo que generó esta tarea
}

// User Story 1: Ajuste rápido aplicado a un objetivo
export interface QuickAdjustment {
  id: string;
  objectiveId: string;
  type: 'target_value' | 'deadline' | 'metric' | 'responsible' | 'other';
  previousValue: any;
  newValue: any;
  reason: string; // Razón del ajuste
  createdBy: string;
  createdByName: string;
  createdAt: string;
}

// User Story 2: Dependencia entre objetivos
export interface ObjectiveDependency {
  id: string;
  sourceObjectiveId: string; // Objetivo secundario que alimenta
  targetObjectiveId: string; // Objetivo principal que recibe
  type: 'feeds' | 'blocks' | 'enables'; // Tipo de dependencia
  weight?: number; // Peso de la dependencia (0-100) - qué tanto impacta el progreso
  description?: string;
  createdAt: string;
  createdBy: string;
}

// User Story 2: Impacto calculado de dependencias
export interface DependencyImpact {
  sourceObjectiveId: string;
  targetObjectiveId: string;
  sourceProgress: number;
  targetProgress: number;
  impactPercentage: number; // Porcentaje de impacto del objetivo fuente en el objetivo destino
  status: 'on_track' | 'at_risk' | 'blocking'; // Estado de la dependencia
}

// User Story 1: Resumen narrativo generado por IA para reportes
export interface AINarrativeSummary {
  id: string;
  reportId: string;
  summary: string; // Resumen ejecutivo en lenguaje natural
  keyHighlights: string[]; // Puntos destacados principales
  trends: string[]; // Tendencias identificadas
  insights: string[]; // Insights clave
  recommendations: string[]; // Recomendaciones basadas en los datos
  generatedAt: string;
  confidence: number; // 0-100, nivel de confianza en el resumen
  language: 'es' | 'en' | 'ca';
}

// User Story 1: Configuración de envío automático de reportes
export type ScheduledReportFrequency = 'weekly' | 'monthly';

export interface ScheduledReport {
  id: string;
  reportType: 'weekly' | 'monthly';
  frequency: ScheduledReportFrequency;
  enabled: boolean;
  recipients: string[]; // IDs de usuarios o emails
  recipientEmails?: string[]; // Emails externos
  dayOfWeek?: number; // 0-6 (domingo-sábado) para reportes semanales
  dayOfMonth?: number; // 1-31 para reportes mensuales
  time: string; // Hora del día en formato HH:mm
  timezone: string; // Zona horaria
  includeAINarrative: boolean; // Si incluir resumen narrativo de IA
  includeObjectivesVsTargets: boolean; // Si incluir comparativa objetivos vs targets
  includeRisks: boolean; // Si incluir lista de riesgos
  includeProposedActions: boolean; // Si incluir acciones propuestas
  lastSentAt?: string;
  nextScheduledAt: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// User Story 2: Comparativa entre objetivo y target
export interface ObjectiveVsTargetComparison {
  objectiveId: string;
  objectiveTitle: string;
  currentValue: number;
  targetValue: number;
  progress: number; // 0-100
  gap: number; // Diferencia entre actual y target
  gapPercentage: number; // Porcentaje de desviación
  status: 'on_track' | 'at_risk' | 'behind' | 'exceeded';
  trend: 'improving' | 'declining' | 'stable';
  unit: string;
  deadline: string;
  daysRemaining: number;
  estimatedCompletion?: string; // Fecha estimada de completado basada en tendencia
  confidence: number; // 0-100, confianza en la estimación
}

// User Story 2: Riesgo detectado
export interface DetectedRisk {
  id: string;
  objectiveId?: string;
  metricId?: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'performance' | 'deadline' | 'resource' | 'dependency' | 'external';
  detectedAt: string;
  currentImpact: number; // 0-100, impacto actual estimado
  potentialImpact: number; // 0-100, impacto potencial si no se mitiga
  probability: number; // 0-100, probabilidad de que ocurra
  status: 'new' | 'monitoring' | 'mitigating' | 'resolved' | 'dismissed';
  mitigationActions?: string[]; // Acciones sugeridas para mitigar
  relatedObjectives?: string[]; // IDs de objetivos relacionados
}

// User Story 2: Acción propuesta
export interface ProposedAction {
  id: string;
  title: string;
  description: string;
  type: 'corrective' | 'preventive' | 'optimization' | 'strategic';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  objectiveId?: string;
  riskId?: string; // Si está relacionada con un riesgo
  estimatedImpact: 'low' | 'medium' | 'high';
  estimatedEffort: 'low' | 'medium' | 'high';
  suggestedBy: 'ai' | 'system' | 'user';
  suggestedAt: string;
  rationale: string; // Explicación de por qué se propone esta acción
  steps?: {
    id: string;
    title: string;
    description: string;
    order: number;
  }[];
  status: 'proposed' | 'approved' | 'in_progress' | 'completed' | 'rejected';
  assignedTo?: string;
  dueDate?: string;
  completedAt?: string;
}

// User Story 1: Plantilla de reporte común
export interface ReportTemplate {
  id: string;
  name: string;
  description?: string;
  isCommon: boolean; // Si es una plantilla común disponible para todos
  createdBy: string; // ID del usuario que creó la plantilla
  createdByName: string; // Nombre del usuario que creó la plantilla
  createdAt: string;
  updatedAt: string;
  config: CustomReportConfig;
  sharedWith?: string[]; // IDs de usuarios con los que se comparte
  isDefault?: boolean; // Si es la plantilla por defecto
}

// User Story 1: Permisos para personalización de reportes
export interface ReportCustomizationPermission {
  userId: string;
  userName: string;
  canCustomizeReports: boolean; // Permiso para personalizar reportes
  canCreateTemplates: boolean; // Permiso para crear nuevas plantillas
  canShareTemplates: boolean; // Permiso para compartir plantillas
  grantedBy: string; // ID del manager que otorgó el permiso
  grantedByName: string; // Nombre del manager
  grantedAt: string;
  expiresAt?: string; // Fecha de expiración del permiso (opcional)
}

// User Story 1: Configuración personalizada de reporte guardada por usuario
export interface UserReportConfig {
  id: string;
  userId: string;
  userName: string;
  name: string; // Nombre de la configuración personalizada
  description?: string;
  templateId?: string; // ID de la plantilla base (si se basa en una)
  config: CustomReportConfig;
  createdAt: string;
  updatedAt: string;
  isDefault?: boolean; // Si es la configuración por defecto del usuario
}

// User Story 2: Datos en bruto para exportación
export interface RawDataExport {
  objectives: RawObjectiveData[];
  metadata: {
    exportedAt: string;
    exportedBy: string;
    exportedByName: string;
    period?: string;
    filters?: GlobalFilters;
  };
}

// User Story 2: Datos de objetivo en bruto con etiquetas
export interface RawObjectiveData {
  // Identificadores
  objectiveId: string;
  objectiveTitle: string;
  objectiveDescription?: string;
  
  // Etiquetas principales
  objetivo: string; // Etiqueta del objetivo
  equipo: string; // Etiqueta del equipo
  responsable: string; // Etiqueta del responsable
  responsableId?: string; // ID del responsable
  
  // Datos del objetivo
  metric: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  progress: number; // 0-100
  status: 'not_started' | 'in_progress' | 'achieved' | 'at_risk' | 'failed';
  category: string;
  deadline: string;
  createdAt: string;
  updatedAt: string;
  
  // Información adicional
  objectiveType?: string;
  horizon?: string;
  assignmentType?: string;
  assignmentId?: string;
  assignmentName?: string;
}

// User Story: Simulación de escenarios hipotéticos
export interface ScenarioModification {
  objectiveId: string;
  objectiveTitle: string;
  modificationType: 'target_increase' | 'target_decrease' | 'target_set' | 'deadline_extend' | 'deadline_reduce';
  value: number; // Porcentaje o valor absoluto según el tipo
  unit?: string; // Unidad del valor (%, €, etc.)
}

export interface ScenarioImpact {
  metricId: string;
  metricName: string;
  currentValue: number;
  projectedValue: number;
  change: number;
  changePercent: number;
  unit: string;
  confidence: number; // 0-100, nivel de confianza en la proyección
  reasoning?: string; // Explicación del impacto
}

export interface Scenario {
  id: string;
  name: string;
  description?: string;
  baseObjectiveId: string;
  baseObjectiveTitle: string;
  modifications: ScenarioModification[];
  impacts: ScenarioImpact[];
  createdAt: string;
  createdBy: string;
  createdByName: string;
  period: string; // Período para el cual se proyecta el impacto
}

export interface ScenarioComparison {
  baseScenario: {
    objectiveId: string;
    objectiveTitle: string;
    currentValue: number;
    targetValue: number;
    progress: number;
    unit: string;
  };
  scenarios: Scenario[];
  summary: {
    bestScenario?: string; // ID del mejor escenario
    worstScenario?: string; // ID del peor escenario
    recommendedScenario?: string; // ID del escenario recomendado
    recommendationReason?: string;
  };
}

// User Story: Exportación de comparativas
export interface ComparisonExportData {
  currentPeriod: string;
  previousPeriod: string;
  comparisonData: ExtendedComparisonData;
  aiAnalysis?: AIComparisonAnalysis;
  exportedAt: string;
  exportedBy: string;
  exportedByName: string;
}

export interface ComparisonExportOptions {
  format: 'csv' | 'excel' | 'pdf' | 'json' | 'embed';
  includeCharts?: boolean;
  includeAIAnalysis?: boolean;
  includeRawData?: boolean;
  chartFormat?: 'png' | 'jpg' | 'svg';
}

// User Story 1: Sistema de aprendizaje de IA de planes anteriores
export interface ObjectiveLearningData {
  objectiveId: string;
  objectiveTitle: string;
  metric: string;
  category: string;
  // Resultado del objetivo
  finalStatus: 'achieved' | 'failed' | 'at_risk' | 'cancelled';
  finalProgress: number; // Progreso final (0-100)
  targetValue: number;
  finalValue: number;
  deadline: string;
  completedAt?: string; // Fecha en que se completó o falló
  // Factores que influyeron
  factors: {
    targetRealistic?: boolean; // Si el target era realista
    deadlineAdequate?: boolean; // Si el deadline era adecuado
    resourcesSufficient?: boolean; // Si los recursos fueron suficientes
    strategyEffective?: boolean; // Si la estrategia fue efectiva
    externalFactors?: string[]; // Factores externos que afectaron
  };
  // Lecciones aprendidas
  lessonsLearned?: string[];
  // Plan de acción asociado (si tuvo)
  actionPlanId?: string;
  actionPlanEffective?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ObjectiveLearningPattern {
  id: string;
  patternType: 'success' | 'failure' | 'risk';
  category: string;
  metric?: string;
  // Características del patrón
  characteristics: {
    targetRange?: { min: number; max: number };
    deadlineRange?: { min: number; max: number }; // En días
    commonFactors?: string[];
    averageProgress?: number;
  };
  // Frecuencia
  occurrenceCount: number;
  successRate?: number; // Para patrones de éxito
  failureRate?: number; // Para patrones de fallo
  // Recomendaciones
  recommendations: string[];
  // Ejemplos
  exampleObjectiveIds: string[];
  lastSeen: string;
  confidence: number; // 0-100
}

export interface AIObjectiveAdjustmentSuggestion {
  id: string;
  objectiveId?: string; // Si es para un objetivo específico
  type: 'target_adjustment' | 'deadline_adjustment' | 'strategy_adjustment' | 'resource_adjustment' | 'metric_adjustment';
  title: string;
  description: string;
  rationale: string; // Explicación basada en aprendizaje
  // Valores sugeridos
  suggestedValues: {
    newTargetValue?: number;
    newDeadline?: string;
    newStrategy?: string;
    resourceRecommendations?: string[];
    alternativeMetric?: string;
  };
  // Basado en
  basedOn: {
    learningPatternId?: string;
    similarObjectives?: string[]; // IDs de objetivos similares
    successRate?: number;
    confidence: number; // 0-100
  };
  // Impacto estimado
  estimatedImpact: 'high' | 'medium' | 'low';
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  applied?: boolean;
  appliedAt?: string;
  appliedBy?: string;
}

export interface ObjectiveLearningProfile {
  id: string;
  userId?: string; // Perfil por usuario (opcional)
  // Estadísticas generales
  totalObjectives: number;
  achievedObjectives: number;
  failedObjectives: number;
  successRate: number; // 0-100
  // Patrones identificados
  patterns: ObjectiveLearningPattern[];
  // Ajustes sugeridos recientes
  recentSuggestions: AIObjectiveAdjustmentSuggestion[];
  // Preferencias aprendidas
  preferences: {
    preferredTargetRanges?: Record<string, { min: number; max: number }>;
    preferredDeadlineRanges?: Record<string, { min: number; max: number }>;
    effectiveStrategies?: string[];
    ineffectiveStrategies?: string[];
  };
  lastAnalyzed: string;
  createdAt: string;
  updatedAt: string;
}

// User Story 2: Resumen inteligente mejorado para compartir con stakeholders
export interface IntelligentSummary {
  id: string;
  title: string;
  period: string;
  generatedAt: string;
  generatedBy?: string;
  // Narrativa generada por IA
  narrative: {
    executiveSummary: string; // Resumen ejecutivo
    keyHighlights: string[]; // Puntos destacados
    progressOverview: string; // Visión general del progreso
    challenges: string[]; // Desafíos identificados
    opportunities: string[]; // Oportunidades identificadas
    recommendations: string[]; // Recomendaciones
  };
  // Métricas clave
  keyMetrics: {
    totalObjectives: number;
    achievedObjectives: number;
    inProgressObjectives: number;
    atRiskObjectives: number;
    failedObjectives: number;
    overallProgress: number; // Progreso promedio
    successRate: number; // Tasa de éxito
    metrics: {
      metricId: string;
      metricName: string;
      currentValue: number;
      targetValue?: number;
      progress: number;
      unit: string;
      trend: 'up' | 'down' | 'stable';
      changePercent?: number;
    }[];
  };
  // Alertas críticas
  criticalAlerts: {
    alertId: string;
    title: string;
    message: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    objectiveId?: string;
    actionRequired: boolean;
    recommendedAction?: string;
  }[];
  // Objetivos destacados
  highlightedObjectives: {
    objectiveId: string;
    title: string;
    status: Objective['status'];
    progress: number;
    highlightReason: 'achieved' | 'at_risk' | 'behind' | 'exceeded' | 'critical';
    summary: string;
  }[];
  // Configuración de generación
  config: {
    includeDetailedMetrics: boolean;
    includeCharts: boolean;
    includeActionItems: boolean;
    audience: 'management' | 'investors' | 'team' | 'stakeholders';
    language: 'es' | 'en' | 'ca';
  };
  // Compartir
  sharing: {
    shareable: boolean;
    shareToken?: string; // Token para compartir vía URL
    sharedWith?: string[]; // IDs de usuarios con los que se compartió
    sharedAt?: string;
    expiresAt?: string; // Fecha de expiración del enlace compartido
  };
  // Exportación
  exportFormats?: ('pdf' | 'presentation' | 'email' | 'link')[];
}

export interface ShareableSummaryLink {
  token: string;
  summaryId: string;
  createdAt: string;
  expiresAt?: string;
  accessCount: number;
  lastAccessed?: string;
  passwordProtected?: boolean;
  passwordHash?: string;
}

// User Story 1: Documentación adjunta a objetivos (presentaciones, briefs)
export type DocumentType = 'presentation' | 'brief' | 'document' | 'spreadsheet' | 'image' | 'other';

export interface ObjectiveDocument {
  id: string;
  objectiveId: string;
  name: string;
  description?: string;
  type: DocumentType;
  fileUrl: string;
  fileName: string;
  fileSize: number; // en bytes
  mimeType: string;
  uploadedAt: string;
  uploadedBy: string;
  uploadedByName: string;
  version?: string; // Versión del documento si aplica
  tags?: string[]; // Etiquetas para categorizar el documento
}

// User Story 2: Historial de auditoría para cambios en objetivos, KPIs y planes
export type AuditEntityType = 'objective' | 'kpi' | 'action_plan';

export type AuditActionType = 
  | 'create' 
  | 'update' 
  | 'delete' 
  | 'status_change' 
  | 'assign' 
  | 'unassign' 
  | 'link' 
  | 'unlink'
  | 'attach_document'
  | 'remove_document'
  | 'clone'
  | 'archive'
  | 'restore';

export interface AuditChange {
  field: string; // Campo que cambió
  fieldLabel: string; // Etiqueta legible del campo
  oldValue: any; // Valor anterior
  newValue: any; // Valor nuevo
  changeType: 'added' | 'modified' | 'removed'; // Tipo de cambio
}

export interface AuditHistoryEntry {
  id: string;
  entityType: AuditEntityType; // Tipo de entidad (objetivo, KPI, plan)
  entityId: string; // ID de la entidad
  entityName: string; // Nombre/título de la entidad para referencia
  action: AuditActionType; // Acción realizada
  changes?: AuditChange[]; // Cambios específicos realizados
  performedBy: string; // ID del usuario que realizó la acción
  performedByName: string; // Nombre del usuario
  performedByEmail?: string; // Email del usuario
  timestamp: string; // Fecha y hora de la acción
  ipAddress?: string; // Dirección IP desde donde se realizó la acción
  userAgent?: string; // User agent del navegador
  reason?: string; // Razón del cambio (opcional)
  metadata?: {
    // Metadatos adicionales según el tipo de acción
    documentId?: string; // Si se adjuntó/eliminó un documento
    documentName?: string;
    linkedEntityId?: string; // Si se vinculó/desvinculó algo
    linkedEntityName?: string;
    previousStatus?: string; // Estado anterior si cambió el estado
    newStatus?: string; // Nuevo estado
    [key: string]: any;
  };
}

export interface AuditHistoryFilters {
  entityType?: AuditEntityType;
  entityId?: string;
  action?: AuditActionType;
  performedBy?: string;
  dateFrom?: string;
  dateTo?: string;
  searchQuery?: string; // Búsqueda en nombre de entidad o usuario
}

// User Story: Sistema de aprobaciones (workflow) para objetivos críticos o con cambios significativos
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'needs_changes' | 'cancelled';

export type ApprovalType = 'critical_objective' | 'significant_change' | 'target_modification' | 'deadline_extension' | 'budget_change' | 'other';

export interface ApprovalRequest {
  id: string;
  objectiveId: string;
  objectiveTitle: string;
  type: ApprovalType;
  status: ApprovalStatus;
  // Cambios que requieren aprobación
  changes: {
    field: string;
    fieldLabel: string;
    oldValue: any;
    newValue: any;
    reason?: string;
  }[];
  // Información del solicitante
  requestedBy: string; // ID del usuario
  requestedByName: string;
  requestedAt: string;
  // Información del aprobador
  approvedBy?: string; // ID del aprobador
  approvedByName?: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  // Notas y comentarios
  notes?: string;
  comments?: ApprovalComment[];
  // Prioridad
  priority: 'low' | 'medium' | 'high' | 'urgent';
  // Fecha límite para aprobación (opcional)
  deadline?: string;
  // Notificaciones
  notifiedApprovers?: string[]; // IDs de aprobadores notificados
  // Metadata
  metadata?: {
    isCritical?: boolean;
    impactLevel?: 'low' | 'medium' | 'high' | 'critical';
    affectedMetrics?: string[];
    estimatedImpact?: string;
    [key: string]: any;
  };
}

export interface ApprovalComment {
  id: string;
  approvalRequestId: string;
  content: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  isInternal?: boolean; // Si es un comentario interno (no visible para el solicitante)
}

export interface ApprovalWorkflowConfig {
  id: string;
  // Configuración de cuándo se requiere aprobación
  requiresApprovalFor: {
    criticalObjectives: boolean; // Objetivos marcados como críticos
    significantChanges: boolean; // Cambios significativos (target > X%, deadline > Y días)
    targetModifications: boolean; // Modificaciones de target
    deadlineExtensions: boolean; // Extensiones de deadline
    budgetChanges: boolean; // Cambios de presupuesto
  };
  // Umbrales para cambios significativos
  thresholds: {
    targetChangePercent?: number; // Porcentaje de cambio en target que requiere aprobación (ej: 20%)
    deadlineExtensionDays?: number; // Días de extensión que requieren aprobación (ej: 7)
    budgetChangePercent?: number; // Porcentaje de cambio en presupuesto que requiere aprobación
  };
  // Aprobadores por defecto
  defaultApprovers: string[]; // IDs de usuarios que pueden aprobar
  // Flujo de aprobación
  approvalFlow: 'single' | 'sequential' | 'parallel'; // Tipo de flujo
  // Notificaciones
  notifyOnRequest: boolean;
  notifyOnApproval: boolean;
  notifyOnRejection: boolean;
  notificationChannels?: ('email' | 'in_app' | 'push')[];
  // Auto-aprobación para ciertos casos
  autoApproveFor?: {
    userRoles?: string[]; // Roles que pueden auto-aprobar
    changeTypes?: ApprovalType[]; // Tipos de cambio que se auto-aprueban
  };
}

// User Story: Configuración de tema, densidad y accesibilidad
export type ThemeMode = 'light' | 'dark' | 'auto';

export type DensityMode = 'comfortable' | 'compact' | 'spacious';

export interface AccessibilityConfig {
  // Modo oscuro
  theme: ThemeMode;
  // Control de densidad
  density: DensityMode;
  // Soporte para lectores de pantalla
  screenReaderSupport: {
    enabled: boolean;
    announceChanges: boolean; // Anunciar cambios dinámicos
    announceProgress: boolean; // Anunciar cambios de progreso
    verboseMode: boolean; // Modo verboso para más detalles
  };
  // Configuración adicional de accesibilidad
  highContrast: boolean;
  reducedMotion: boolean; // Reducir animaciones
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  // Preferencias guardadas
  savedAt?: string;
  savedBy?: string;
}

// User Story 1: Impacto económico de un objetivo
export interface EconomicImpact {
  // Inversión relacionada
  investment: number; // Inversión total en el objetivo (€)
  investmentBreakdown?: {
    resources?: number; // Costo de recursos humanos
    tools?: number; // Costo de herramientas/tecnología
    marketing?: number; // Costo de marketing/campañas
    other?: number; // Otros costos
  };
  // Ingresos incrementales
  incrementalRevenue: number; // Ingresos incrementales generados (€)
  revenueBreakdown?: {
    newCustomers?: number; // Ingresos de nuevos clientes
    upsells?: number; // Ingresos de upsells
    retention?: number; // Ingresos por retención mejorada
    other?: number; // Otros ingresos
  };
  // Métricas financieras
  roi: number; // Return on Investment (%)
  roiAmount: number; // ROI en cantidad (€)
  paybackPeriod?: number; // Período de recuperación (días)
  breakevenDate?: string; // Fecha estimada de punto de equilibrio
  // Proyecciones
  projectedRevenue?: number; // Ingresos proyectados al completar el objetivo
  projectedROI?: number; // ROI proyectado
  // Comparación
  baselineRevenue?: number; // Ingresos sin el objetivo (línea base)
  revenueLift?: number; // Incremento porcentual vs línea base
  // Período de análisis
  analysisPeriod: {
    startDate: string;
    endDate: string;
    period: 'month' | 'quarter' | 'year' | 'custom';
  };
  // Última actualización
  lastCalculated?: string;
  calculatedBy?: string;
}

// User Story 1: Impacto operativo de un objetivo
export interface OperationalImpact {
  // Clientes retenidos
  retainedCustomers: number; // Número de clientes retenidos
  retentionRate?: number; // Tasa de retención (%)
  retentionLift?: number; // Incremento en retención vs línea base (%)
  // Eficiencia operativa
  efficiencyGains?: {
    timeSaved?: number; // Horas ahorradas
    costReduction?: number; // Reducción de costos operativos (€)
    productivityIncrease?: number; // Incremento de productividad (%)
    processImprovement?: string; // Descripción de mejoras en procesos
  };
  // Métricas operativas
  operationalMetrics?: {
    metricName: string;
    currentValue: number;
    baselineValue: number;
    improvement: number; // Mejora porcentual
    unit: string;
  }[];
  // Impacto en satisfacción
  satisfactionImpact?: {
    customerSatisfaction?: number; // NPS o satisfacción del cliente
    employeeSatisfaction?: number; // Satisfacción del equipo
    satisfactionLift?: number; // Incremento en satisfacción
  };
  // Capacidad y escalabilidad
  capacityImpact?: {
    capacityIncrease?: number; // Incremento de capacidad (%)
    scalabilityImprovement?: string; // Mejoras en escalabilidad
  };
  // Período de análisis
  analysisPeriod: {
    startDate: string;
    endDate: string;
    period: 'month' | 'quarter' | 'year' | 'custom';
  };
  // Última actualización
  lastCalculated?: string;
  calculatedBy?: string;
}

// User Story 2: Patrón de éxito extendido (objetivos alcanzados en menos tiempo)
export interface SuccessPatternExtended extends ObjectiveLearningPattern {
  // Tiempo de logro
  timeToAchievement?: {
    averageDays: number; // Días promedio para alcanzar el objetivo
    fastestDays: number; // Días más rápidos
    medianDays: number; // Días mediana
    timeEfficiency: number; // Eficiencia de tiempo (0-100)
  };
  // Planes más efectivos
  effectivePlans?: {
    planId: string;
    planName: string;
    effectivenessScore: number; // Score de efectividad (0-100)
    averageTimeToComplete: number; // Tiempo promedio para completar (días)
    successRate: number; // Tasa de éxito (%)
    keyActions: string[]; // Acciones clave del plan
    usageCount: number; // Veces que se ha usado este plan
  }[];
  // Factores de éxito acelerado
  accelerationFactors?: {
    factor: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    frequency: number; // Frecuencia con que aparece en objetivos exitosos
  }[];
  // Recomendaciones de replicación
  replicationRecommendations?: ReplicationRecommendation[];
}

// User Story 2: Recomendación de replicación de patrón de éxito
export interface ReplicationRecommendation {
  id: string;
  patternId: string;
  patternName: string;
  objectiveId?: string; // Si es para un objetivo específico
  recommendationType: 'replicate_plan' | 'replicate_strategy' | 'replicate_timeline' | 'replicate_approach';
  title: string;
  description: string;
  rationale: string; // Por qué se recomienda replicar
  // Qué replicar
  elementsToReplicate: {
    actionPlan?: string; // ID del plan de acción a replicar
    timeline?: {
      suggestedDeadline: string;
      suggestedStartDate: string;
      estimatedDays: number;
    };
    strategy?: string[]; // Estrategias a replicar
    resources?: string[]; // Recursos a replicar
  };
  // Impacto esperado
  expectedImpact: {
    successProbability: number; // Probabilidad de éxito (0-100)
    estimatedTimeReduction?: number; // Reducción estimada de tiempo (%)
    estimatedEffectiveness?: number; // Efectividad estimada (0-100)
    confidence: number; // Confianza en la recomendación (0-100)
  };
  // Basado en
  basedOn: {
    similarObjectives: string[]; // IDs de objetivos similares exitosos
    patternOccurrences: number; // Veces que este patrón ha tenido éxito
    averageSuccessRate: number; // Tasa promedio de éxito
  };
  // Estado
  status: 'pending' | 'applied' | 'dismissed';
  appliedAt?: string;
  appliedBy?: string;
  createdAt: string;
}

