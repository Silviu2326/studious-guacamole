/**
 * Tipos TypeScript para el módulo Panel Financiero Overview
 * 
 * Este módulo proporciona tipos completos para la gestión financiera
 * diferenciada entre entrenadores y gimnasios.
 */

// ============================================================================
// TIPOS AUXILIARES Y ENUMS
// ============================================================================

/**
 * Rol financiero del usuario
 * Utilizado en: Overview, filtros de reportes, permisos de acceso
 */
export type RolFinanciero = 'entrenador' | 'gimnasio';

/**
 * Tendencia financiera para métricas comparativas
 * Utilizado en: Overview, métricas de ingresos, rendimiento mensual
 */
export type TendenciaFinanciera = 'up' | 'down' | 'neutral';

/**
 * Nivel de riesgo de pago pendiente
 * Utilizado en: Alertas de pagos, clientes con pagos pendientes
 */
export type NivelRiesgoPago = 'bajo' | 'medio' | 'alto';

/**
 * Estado de salud financiera del negocio
 * Utilizado en: Análisis de rentabilidad, dashboard principal
 */
export type EstadoSaludFinanciera = 'saludable' | 'advertencia' | 'critico';

/**
 * Tipo de origen de un pago pendiente
 * Utilizado en: Clientes con pagos pendientes, alertas
 */
export type OrigenPago = 'cuota' | 'sesion' | 'bono' | 'otro';

/**
 * Tipo de alerta de pago
 * Utilizado en: Sistema de alertas de pagos
 */
export type TipoAlertaPago = 'vencido' | 'porVencer' | 'por_vencer' | 'recordatorio';

/**
 * Nivel de confianza de una proyección financiera
 * Utilizado en: Proyecciones financieras
 */
export type NivelConfianza = 'bajo' | 'medio' | 'alto';

/**
 * Escenario de proyección financiera
 * Utilizado en: Proyecciones financieras, análisis de escenarios
 */
export type EscenarioProyeccion = 'optimista' | 'base' | 'pesimista';

/**
 * Formato de reporte personalizado
 * Utilizado en: Generación y descarga de reportes
 */
export type FormatoReporte = 'PDF' | 'Excel' | 'CSV' | 'otro';

// ============================================================================
// INTERFACES BASE
// ============================================================================

/**
 * Estructura base para métricas financieras con tendencias
 * Utilizado en: Overview principal, tarjetas de métricas, comparativas
 */
export interface MetricasFinancieras {
  /** Valor actual de la métrica */
  valorActual: number;
  /** Valor del período anterior para comparación */
  valorAnterior: number;
  /** Variación absoluta (valorActual - valorAnterior) */
  variacionAbsoluta: number;
  /** Variación porcentual respecto al período anterior */
  variacionPorcentual: number;
  /** Tendencia de la métrica (up/down/neutral) */
  tendencia: TendenciaFinanciera;
  /** Etiqueta o nombre de la métrica */
  etiqueta: string;
  /** Descripción opcional adicional */
  descripcionOpcional?: string;
  // Campos legacy para compatibilidad
  total?: number;
  periodoActual?: string;
  periodoAnterior?: string;
  variacion?: number;
}

/**
 * Desglose de ingresos específicos de entrenadores
 * Utilizado en: Pestaña de ingresos (entrenadores), métricas de ingresos
 */
export interface IngresosEntrenador {
  /** Ingresos por sesiones 1 a 1 */
  sesiones1a1: number;
  /** Ingresos por paquetes de entrenamiento */
  paquetes: number;
  /** Ingresos por consultas online */
  consultasOnline: number;
  /** Otros ingresos no categorizados */
  otros: number;
  /** Total de ingresos */
  total: number;
  /** Período de referencia (ej: "2024-01", "Enero 2024") */
  periodo: string;
  // Campos legacy para compatibilidad
  paquetesEntrenamiento?: number;
}

/**
 * Facturación desglosada del gimnasio
 * Utilizado en: Pestaña de facturación (gimnasios), métricas de ingresos
 */
export interface FacturacionGimnasio {
  /** Facturación por cuotas de socios */
  cuotasSocios: number;
  /** Facturación por entrenamiento personal */
  entrenamientoPersonal: number;
  /** Facturación por tienda */
  tienda: number;
  /** Facturación por servicios adicionales */
  serviciosAdicionales: number;
  /** Otros ingresos no categorizados */
  otros: number;
  /** Total de facturación */
  total: number;
  /** Período de referencia (ej: "2024-01", "Enero 2024") */
  periodo: string;
}

/**
 * Costes estructurales (costes fijos) del gimnasio
 * Utilizado en: Pestaña de gastos (gimnasios), análisis de rentabilidad
 */
export interface CostesEstructurales {
  /** Coste de alquiler */
  alquiler: number;
  /** Coste de salarios */
  salarios: number;
  /** Coste de equipamiento */
  equipamiento: number;
  /** Coste de servicios básicos (luz, agua, etc.) */
  serviciosBasicos: number;
  /** Otros costes no categorizados */
  otros: number;
  /** Total de costes estructurales */
  total: number;
  /** Período de referencia (ej: "2024-01", "Enero 2024") */
  periodo: string;
}

/**
 * Métricas de rendimiento mensual de un entrenador
 * Utilizado en: Pestaña de rendimiento (entrenadores), análisis de desempeño
 */
export interface RendimientoEntrenador {
  /** Ingresos totales del mes */
  ingresosTotales: number;
  /** Número de clientes activos */
  numeroClientesActivos: number;
  /** Ticket medio (ingresosTotales / numeroClientesActivos) */
  ticketsMedio: number;
  /** Variación porcentual vs mes anterior */
  variacionVsMesAnterior: number;
  /** Tendencia global del rendimiento */
  tendenciaGlobal: TendenciaFinanciera;
  /** Mes de referencia (1-12) */
  mes: number;
  /** Año de referencia */
  anio: number;
  // Campos legacy para compatibilidad
  mesActual?: number;
  mesAnterior?: number;
  variacion?: number;
  tendencia?: TendenciaFinanciera;
}

// ============================================================================
// ALERTAS Y PAGOS PENDIENTES
// ============================================================================

/**
 * Información de un cliente con pago pendiente
 * Utilizado en: Alertas de pagos, lista de clientes pendientes
 */
export interface ClientePagoPendiente {
  /** ID único del cliente */
  clienteId: string;
  /** Nombre completo del cliente */
  nombreCliente: string;
  /** Importe pendiente de pago */
  importePendiente: number;
  /** Fecha de vencimiento del pago */
  fechaVencimiento: string;
  /** Días de retraso desde la fecha de vencimiento */
  diasRetraso: number;
  /** Nivel de riesgo del pago pendiente */
  nivelRiesgo: NivelRiesgoPago;
  /** Origen del pago (cuota, sesión, bono, otro) */
  origen: OrigenPago;
  // Campos legacy para compatibilidad
  id?: string;
  nombre?: string;
  servicio?: string;
  monto?: number;
  diasVencidos?: number;
  fecha?: string;
  riesgo?: NivelRiesgoPago;
}

/**
 * Alerta de pago generada por el sistema
 * Utilizado en: Sistema de alertas, notificaciones, dashboard
 */
export interface AlertaPago {
  /** ID único de la alerta */
  id: string;
  /** Tipo de alerta (vencido, porVencer, recordatorio) */
  tipo: TipoAlertaPago;
  /** Información del cliente con pago pendiente (nueva estructura) o nombre del cliente (legacy) */
  cliente: ClientePagoPendiente | string;
  /** Prioridad de la alerta (alta, media, baja) */
  prioridad: 'alta' | 'media' | 'baja';
  /** Mensaje descriptivo de la alerta */
  mensaje?: string;
  /** Fecha de creación de la alerta */
  fechaCreacion?: string;
  /** Indica si la alerta ha sido leída */
  leida?: boolean;
  // Campos legacy para compatibilidad
  /** Monto del pago pendiente (estructura legacy) */
  monto?: number;
  /** Fecha de vencimiento o creación (estructura legacy) */
  fecha?: string;
}

// ============================================================================
// ANÁLISIS Y PROYECCIONES
// ============================================================================

/**
 * Análisis de rentabilidad del negocio
 * 
 * Este tipo representa el análisis completo de rentabilidad de un negocio,
 * calculando métricas clave como beneficio neto, margen porcentual y estado
 * de salud financiera.
 * 
 * Utilizado en: 
 * - Componente AnalisisRentabilidad.tsx (principalmente para gimnasios)
 * - Pestaña de rentabilidad (gimnasios)
 * - Dashboard principal
 * 
 * Los datos son proporcionados por la función getAnalisisRentabilidad()
 * en rentabilidad.ts, que calcula estas métricas basándose en ingresos
 * y costes del período especificado.
 */
export interface AnalisisRentabilidad {
  /** Ingresos totales del período */
  ingresosTotales: number;
  /** Costes totales del período */
  costesTotales: number;
  /** Beneficio neto (ingresosTotales - costesTotales) */
  beneficioNeto: number;
  /** Margen porcentual de rentabilidad (beneficioNeto / ingresosTotales * 100) */
  margenPorcentual: number;
  /** Estado de salud financiera basado en el margen porcentual (>25%: saludable, 10-25%: advertencia, <10%: crítico) */
  estadoSalud: EstadoSaludFinanciera;
  /** Comentario resumen del análisis con recomendaciones basadas en el estado */
  comentarioResumen: string;
  // Campos legacy para compatibilidad hacia atrás con código existente
  /** @deprecated Usar margenPorcentual en su lugar */
  margenRentabilidad?: number;
  /** @deprecated Usar estadoSalud en su lugar */
  estado?: EstadoSaludFinanciera;
}

/**
 * Proyección financiera para períodos futuros
 * Utilizado en: Pestaña de proyecciones, análisis de escenarios
 */
export interface ProyeccionFinanciera {
  /** Período de la proyección (mes/año o rango) */
  periodo: string;
  /** Ingresos esperados para el período */
  ingresosEsperados: number;
  /** Costes esperados para el período */
  costesEsperados: number;
  /** Beneficio esperado (ingresosEsperados - costesEsperados) */
  beneficioEsperado: number;
  /** Nivel de confianza de la proyección */
  nivelConfianza: NivelConfianza;
  /** Escenario de la proyección */
  escenario: EscenarioProyeccion;
  // Campos legacy para compatibilidad
  ingresos?: number;
  gastos?: number;
  beneficio?: number;
  confianza?: number;
}

// ============================================================================
// REPORTES
// ============================================================================

/**
 * Reporte personalizado generado por el usuario
 * Utilizado en: Pestaña de reportes, generación y descarga de reportes
 */
export interface ReportePersonalizado {
  /** ID único del reporte */
  id: string;
  /** Nombre del reporte */
  nombre: string;
  /** Tipo de reporte (entrenador o gimnasio) */
  tipo: RolFinanciero;
  /** Filtros aplicados al generar el reporte */
  filtrosAplicados: Record<string, any>;
  /** Fecha y hora de generación del reporte */
  generadoEn: string;
  /** Formato del reporte (PDF, Excel, CSV, otro) */
  formato: FormatoReporte;
  /** URL mock para descarga del reporte */
  urlDescargaMock: string;
  // Campos legacy para compatibilidad
  datos?: any;
  fechaGeneracion?: string;
}

// ============================================================================
// FILTROS Y PARÁMETROS
// ============================================================================

/**
 * Filtros para obtener histórico de ingresos
 * Utilizado en: getHistoricoIngresosEntrenador, getHistoricoFacturacionGimnasio
 */
export interface FiltrosHistoricoIngresos {
  /** Tipo de período: 'meses' o 'semanas' */
  tipoPeriodo?: 'meses' | 'semanas';
  /** Número de períodos a retornar (por defecto 12 meses o 12 semanas) */
  cantidadPeriodos?: number;
  /** Fecha de inicio del rango (opcional) */
  fechaInicio?: Date;
  /** Fecha de fin del rango (opcional) */
  fechaFin?: Date;
}

/**
 * Filtros para obtener comparativa mensual
 * Utilizado en: getComparativaMensual
 */
export interface FiltrosComparativaMensual {
  /** Número de meses históricos a incluir (por defecto 2: mes actual y anterior) */
  cantidadMeses?: number;
  /** Mes de inicio (1-12). Si no se especifica, usa el mes actual */
  mesInicio?: number;
  /** Año de inicio. Si no se especifica, usa el año actual */
  anioInicio?: number;
}

/**
 * Filtros para obtener alertas de pagos
 * Utilizado en: getAlertasPagos
 */
export interface FiltrosAlertasPagos {
  /** Filtrar por tipo de alerta (vencido, por_vencer, recordatorio) */
  tipo?: TipoAlertaPago;
  /** Filtrar por nivel de prioridad (alta, media, baja) */
  prioridad?: 'alta' | 'media' | 'baja';
  /** Filtrar por fecha de inicio (rango de fechas) */
  fechaInicio?: string;
  /** Filtrar por fecha de fin (rango de fechas) */
  fechaFin?: string;
  /** Filtrar solo alertas no leídas */
  soloNoLeidas?: boolean;
  /** ID del cliente específico */
  clienteId?: string;
}

/**
 * Filtros para obtener clientes con pagos pendientes
 * Utilizado en: getClientesConPagosPendientes
 */
export interface FiltrosClientesPagosPendientes {
  /** Filtrar por nivel de riesgo (bajo, medio, alto) */
  nivelRiesgo?: NivelRiesgoPago;
  /** Filtrar por origen del pago (cuota, sesion, bono, otro) */
  origen?: OrigenPago;
  /** Filtrar por fecha de vencimiento desde */
  fechaVencimientoDesde?: string;
  /** Filtrar por fecha de vencimiento hasta */
  fechaVencimientoHasta?: string;
  /** Filtrar por días mínimos de retraso */
  diasRetrasoMinimo?: number;
  /** Filtrar por días máximos de retraso */
  diasRetrasoMaximo?: number;
  /** Filtrar por monto mínimo */
  montoMinimo?: number;
  /** Filtrar por monto máximo */
  montoMaximo?: number;
}

/**
 * Configuración para generar un reporte financiero personalizado
 * Utilizado en: generarReporteFinanciero
 */
export interface ConfigGeneracionReporte {
  /** Rol del usuario que genera el reporte (entrenador o gimnasio) */
  rol: RolFinanciero;
  /** Tipo de reporte a generar (resumen, ingresos, gastos, rendimiento, proyecciones) */
  tipoReporte: string;
  /** Nombre del reporte */
  nombre: string;
  /** Descripción opcional del reporte */
  descripcion?: string;
  /** Formato del reporte (PDF, Excel, CSV) */
  formato?: FormatoReporte;
  /** Filtros adicionales para el reporte */
  filtrosAdicionales?: Record<string, any>;
}

/**
 * Filtros para obtener reportes generados
 * Utilizado en: getReportesGenerados
 */
export interface FiltrosReportesGenerados {
  /** Filtrar por rol (entrenador o gimnasio) */
  rol?: RolFinanciero;
  /** Filtrar por tipo de reporte */
  tipoReporte?: string;
  /** Filtrar por formato del reporte */
  formato?: FormatoReporte;
  /** Filtrar por fecha de generación desde */
  fechaGeneracionDesde?: string;
  /** Filtrar por fecha de generación hasta */
  fechaGeneracionHasta?: string;
  /** Buscar por nombre del reporte */
  nombre?: string;
}

// ============================================================================
// TIPOS LEGACY (Compatibilidad hacia atrás)
// ============================================================================

/**
 * @deprecated Usar RolFinanciero en su lugar
 * Mantenido para compatibilidad con código existente
 */
export type UserRole = RolFinanciero;
