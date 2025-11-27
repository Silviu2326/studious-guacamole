// Tipos para el sistema de Pagos Pendientes & Morosidad

// ============================================================================
// TIPOS BASE Y UNION TYPES
// ============================================================================

/**
 * Nivel de riesgo de cobro de un cliente moroso.
 * Utilizado en: ClienteMoroso, clasificación de riesgo, dashboard de morosidad
 */
export type NivelRiesgo = 'bajo' | 'medio' | 'alto' | 'critico';

/**
 * Estado del proceso de gestión de morosidad de un cliente.
 * Utilizado en: ClienteMoroso, seguimiento de gestión, reportes de morosidad
 */
export type EstadoMorosidad = 
  | 'en_revision' 
  | 'en_gestion' 
  | 'plan_de_pago' 
  | 'derivado_externo' 
  | 'resuelto';

export type NivelMorosidad = 'verde' | 'amarillo' | 'naranja' | 'rojo' | 'negro';
export type EstadoPago = 'pendiente' | 'vencido' | 'pagado' | 'en_proceso' | 'cancelado';
export type TipoRecordatorio = 'amigable' | 'firme' | 'urgente' | 'escalado';
export type MedioRecordatorio = 'email' | 'sms' | 'whatsapp' | 'llamada';
export type RiesgoCobro = 'bajo' | 'medio' | 'alto' | 'critico';
export type EstrategiaCobro = 'recordatorio_automatico' | 'contacto_directo' | 'negociacion' | 'legal';
export type MetodoPago = 'efectivo' | 'transferencia' | 'tarjeta' | 'nequi' | 'daviplata' | 'pse' | 'otro';
export type PlataformaPago = 'wompi' | 'payu' | 'otro';

// ============================================================================
// INTERFACES BASE - CLIENTES Y MÉTRICAS
// ============================================================================

/**
 * Entrada del historial de cambios en la morosidad de un cliente.
 * Utilizado en: ClienteMoroso, seguimiento de cambios, auditoría
 */
export interface HistorialMorosidad {
  id: string;
  fecha: Date;
  tipoCambio: 'nivel_riesgo' | 'estado_morosidad' | 'actualizacion' | 'contacto' | 'pago';
  valorAnterior?: string;
  valorNuevo: string;
  usuario?: string;
  notas?: string;
}

/**
 * Representa un cliente con deudas pendientes y su información de morosidad.
 * Utilizado en: Listado de clientes morosos, dashboard, reportes, gestión de cobro
 */
export interface ClienteMoroso {
  idCliente: string;
  nombreCliente: string;
  email: string;
  telefono?: string;
  importeTotalAdeudado: number;
  importeVencido: number;
  numeroFacturasVencidas: number;
  diasMaximoRetraso: number;
  nivelRiesgo: NivelRiesgo;
  estadoMorosidad: EstadoMorosidad;
  fechaUltimoPago?: Date;
  fechaUltimoContacto?: Date;
  gestorAsignado?: string;
  notasInternas?: string;
  historialMorosidad?: HistorialMorosidad[];
}

/**
 * Filtros para obtener clientes morosos.
 * Utilizado en: getClientesMorosos, búsqueda y filtrado de clientes morosos
 */
export interface FiltrosClienteMoroso {
  nivelRiesgo?: NivelRiesgo[];
  estadoMorosidad?: EstadoMorosidad[];
  diasRetrasoMin?: number;
  diasRetrasoMax?: number;
  importeMin?: number;
  importeMax?: number;
  gestorAsignado?: string;
  clienteId?: string;
}

/**
 * Métricas agregadas de morosidad para un período determinado.
 * Utilizado en: Dashboard de morosidad, reportes, análisis de tendencias
 */
export interface MetricasMorosidad {
  totalMorosidad: number;
  numeroClientesMorosos: number;
  distribucionPorNivelRiesgo: Record<NivelRiesgo, { cantidad: number; importe: number }>;
  diasPromedioRetraso: number;
  tasaRecuperacion: number;
  periodo: {
    inicio: Date;
    fin: Date;
  };
}

export interface PagoPendiente {
  id: string;
  facturaId: string;
  numeroFactura: string;
  cliente: {
    id: string;
    nombre: string;
    email: string;
    telefono?: string;
    direccion?: string;
    metodoPagoPreferido?: MetodoPago; // Método de pago preferido del cliente
  };
  fechaEmision: Date;
  fechaVencimiento: Date;
  fechaVencida: Date; // Fecha cuando realmente venció
  diasRetraso: number;
  montoTotal: number;
  montoPendiente: number;
  nivelMorosidad: NivelMorosidad;
  estado: EstadoPago;
  recordatoriosEnviados: number;
  ultimoRecordatorio?: Date;
  proximoRecordatorio?: Date;
  riesgo: RiesgoCobro;
  estrategiaCobro?: EstrategiaCobro;
  notas?: string;
  notasPrivadas?: string; // Notas privadas sobre situación financiera o personal del cliente
  historialAcciones: AccionCobro[];
  fechaCreacion: Date;
  fechaActualizacion: Date;
  // Información de pago recibido
  metodoPago?: MetodoPago;
  fechaPago?: Date;
  notaPago?: string;
  // Información de membresía pausada
  membresiaPausada?: {
    pausada: boolean;
    fechaPausa?: Date;
    fechaReactivacion?: Date;
    motivoPausa?: string;
  };
  membresiaId?: string; // ID de la membresía asociada
  // Información de asistencia
  asistencia?: {
    ultimaAsistencia?: Date; // Fecha de la última sesión asistida
    sesionesEsteMes: number; // Número de sesiones del mes actual
  };
  // Información de descuentos/condonaciones
  ajustesDeuda?: {
    montoOriginal: number; // Monto original antes del ajuste
    montoAjustado: number; // Monto después del ajuste
    descuentoAplicado: number; // Monto descontado/condonado
    motivo: string; // Motivo del ajuste
    fechaAjuste: Date; // Fecha en que se aplicó el ajuste
    usuarioAjuste: string; // Usuario que aplicó el ajuste
  }[];
  // Cliente de confianza - reduce alertas y priorización
  clienteDeConfianza?: boolean;
  // Último contacto registrado con el cliente
  ultimoContacto?: Date;
}

export interface EnlacePago {
  id: string;
  pagoPendienteId: string;
  url: string;
  plataforma: PlataformaPago;
  estado: 'activo' | 'expirado' | 'usado' | 'cancelado';
  fechaCreacion: Date;
  fechaExpiracion?: Date;
  fechaUso?: Date;
  monto: number;
  referencia: string;
}

export interface AlertaMorosidad {
  id: string;
  pagoPendienteId: string;
  nivel: NivelMorosidad;
  titulo: string;
  descripcion: string;
  fechaGeneracion: Date;
  fechaVencimiento?: Date;
  estado: 'activa' | 'resuelta' | 'archivada';
  accionesRecomendadas: string[];
  prioridad: 'baja' | 'media' | 'alta' | 'critica';
}

export interface RecordatorioPago {
  id: string;
  pagoPendienteId: string;
  tipo: TipoRecordatorio;
  medio: MedioRecordatorio;
  fechaEnvio: Date;
  fechaProgramada?: Date;
  contenido: string;
  estado: 'pendiente' | 'enviado' | 'fallido' | 'cancelado';
  respuesta?: string;
  siguienteRecordatorio?: Date;
  usuarioEnvio?: string;
}

// Recordatorio programado para contactar a un cliente en una fecha específica
export interface RecordatorioContacto {
  id: string;
  pagoPendienteId: string;
  clienteId: string;
  clienteNombre: string;
  fechaRecordatorio: Date;
  nota?: string;
  completado: boolean;
  fechaCompletado?: Date;
  fechaCreacion: Date;
  creadoPor: string;
}

/**
 * Tipo de contacto realizado con un cliente para gestión de cobro.
 * Utilizado en: Registro de intentos de contacto, historial de contactos, seguimiento de cobros
 */
export type TipoContactoCobro = 'llamada' | 'email' | 'whatsapp' | 'visita';

/**
 * Resultado de un intento de contacto con un cliente.
 * Utilizado en: ContactoCobro, seguimiento de efectividad de contactos, reportes
 */
export type ResultadoContactoCobro = 
  | 'sinContacto' 
  | 'contactado' 
  | 'compromisoPago' 
  | 'pagoRealizado' 
  | 'negativa' 
  | 'pendienteRespuesta';

/**
 * Registro de un intento de contacto realizado con un cliente para gestión de cobro.
 * Este tipo se utiliza para registrar todos los intentos de contacto (llamadas, emails, whatsapp, visitas)
 * y se visualiza en RecordatoriosContacto.tsx y SeguimientoPagos.tsx para el seguimiento de la gestión de cobros.
 * 
 * Utilizado en: 
 * - RecordatoriosContacto.tsx: Visualización de contactos registrados
 * - SeguimientoPagos.tsx: Historial de contactos por cliente
 * - Historial de acciones de cobro
 */
export interface ContactoCobro {
  id: string;
  clienteId: string;
  pagoPendienteId?: string; // Opcional: puede estar asociado a un pago específico
  tipoContacto: TipoContactoCobro;
  fecha: Date;
  resultado: ResultadoContactoCobro;
  notas: string;
  usuario?: string; // Usuario que realizó el contacto
  fechaCreacion?: Date; // Fecha de creación del registro
}

export interface SeguimientoPago {
  id: string;
  pagoPendienteId: string;
  fecha: Date;
  accion: string;
  tipo: 'recordatorio' | 'contacto' | 'negociacion' | 'pago_parcial' | 'pago_completo' | 'legal' | 'otro';
  usuario: string;
  notas?: string;
  documentos?: string[];
  proximaSeguimiento?: Date;
}

// ============================================================================
// TIPOS PARA PLANES DE PAGO, RECORDATORIOS Y ACCIONES
// ============================================================================

/**
 * Estado de una cuota dentro de un plan de pago.
 * Utilizado en: CuotaPlanPago, gestión de planes de pago
 */
export type EstadoCuotaPlanPago = 'pendiente' | 'pagada' | 'vencida' | 'parcialmentePagada';

/**
 * Estado general de un plan de pago.
 * Utilizado en: PlanPago, listado de planes, reportes
 */
export type EstadoPlanPagoGeneral = 
  | 'activo' 
  | 'completado' 
  | 'incumplido' 
  | 'renegociado' 
  | 'cancelado';


/**
 * Recordatorio programado o enviado a un cliente.
 * Utilizado en: Gestor de recordatorios, automatización de cobros, seguimiento
 */
export interface Recordatorio {
  id: string;
  clienteId: string;
  facturaId?: string;
  planPagoId?: string;
  fechaProgramada: Date;
  fechaEnviado?: Date;
  canal: 'email' | 'telefono' | 'whatsapp' | 'sms';
  tipo: 'recordatorioVencido' | 'recordatorioPlan' | 'recordatorioGeneral';
  estadoEnvio: 'pendiente' | 'enviado' | 'error';
  mensaje?: string;
}

/**
 * Tipo de acción de cobro realizada o programada.
 * Utilizado en: AccionCobro, historial de gestión, reportes de efectividad
 */
export type TipoAccionCobro = 
  | 'llamada' 
  | 'email' 
  | 'whatsapp' 
  | 'visita' 
  | 'carta' 
  | 'derivacionExterna' 
  | 'suspensionServicio';

/**
 * Resultado de una acción de cobro.
 * Utilizado en: AccionCobro, seguimiento de gestión, métricas de efectividad
 */
export type ResultadoAccionCobro = 
  | 'sinContacto' 
  | 'contactado' 
  | 'compromisoPago' 
  | 'pagoRealizado' 
  | 'negativa' 
  | 'pendienteRespuesta';

/**
 * Acción de cobro realizada con un cliente moroso.
 * Utilizado en: Historial de acciones, seguimiento de gestión, reportes
 */
export interface AccionCobro {
  id: string;
  clienteId: string;
  tipoAccion: TipoAccionCobro;
  fecha: Date;
  resultado: ResultadoAccionCobro;
  notas: string;
}

/**
 * Filtros para obtener acciones de cobro por nivel de riesgo.
 * Utilizado en: getAccionesCobroPorNivelRiesgo, reportes de efectividad
 */
export interface FiltrosAccionesCobro {
  tipoAccion?: TipoAccionCobro[];
  resultado?: ResultadoAccionCobro[];
  fechaInicio?: Date;
  fechaFin?: Date;
  clienteId?: string;
}

// Tipo para ajuste de deuda (descuento o condonación)
export interface AjusteDeudaData {
  nuevoMonto: number; // Nuevo monto pendiente después del ajuste
  motivo: string; // Motivo obligatorio del ajuste
}

export interface ClasificacionRiesgo {
  pagoPendienteId: string;
  riesgo: RiesgoCobro;
  puntuacion: number; // 0-100
  factores: {
    historialPago: number;
    diasRetraso: number;
    monto: number;
    frecuenciaContacto: number;
    patronPago: number;
  };
  recomendaciones: string[];
  probabilidadCobro: number; // 0-100
  fechaEvaluacion: Date;
}

export interface EstrategiaCobro {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: EstrategiaCobro;
  nivelAplicacion: NivelMorosidad[];
  pasos: PasoEstrategia[];
  activa: boolean;
  fechaCreacion: Date;
}

export interface PasoEstrategia {
  orden: number;
  accion: string;
  descripcion: string;
  tiempoEstimado: number; // días
  responsable?: string;
}

// ============================================================================
// TIPOS DE REPORTES
// ============================================================================

/**
 * Cliente moroso destacado en reportes.
 * Utilizado en: ReporteMorosidad, análisis de casos prioritarios
 */
export interface ClienteMorosoTop {
  clienteId: string;
  clienteNombre: string;
  importeTotalAdeudado: number;
  diasMaximoRetraso: number;
  nivelRiesgo: NivelRiesgo;
}

/**
 * Reporte completo de morosidad con análisis detallado.
 * Utilizado en: ReportesMorosidad.tsx, generación de reportes, análisis ejecutivo, toma de decisiones
 */
export interface ReporteMorosidad {
  id: string;
  periodoInicio: Date;
  periodoFin: Date;
  fechaGeneracion: Date;
  resumenMetricas: MetricasMorosidad;
  distribucionPorRiesgo: Record<NivelRiesgo, { cantidad: number; importe: number }>;
  topClientesMorosos: ClienteMorosoTop[];
  comentariosResumen?: string;
}

export interface EstadisticasMorosidad {
  totalPendientes: number;
  montoTotalPendiente: number;
  totalVencidos: number;
  montoTotalVencido: number;
  porNivel: {
    [key in NivelMorosidad]: {
      cantidad: number;
      monto: number;
    };
  };
  promedioDiasRetraso: number;
  tasaRecuperacion: number;
  casosCriticos: number;
}

export interface FiltroMorosidad {
  fechaInicio?: Date;
  fechaFin?: Date;
  clienteId?: string;
  nivelMorosidad?: NivelMorosidad[];
  riesgo?: RiesgoCobro[];
  montoMin?: number;
  montoMax?: number;
  diasRetrasoMin?: number;
  diasRetrasoMax?: number;
  estrategiaCobro?: EstrategiaCobro;
  // Nuevos filtros simples
  vencidosMasDe15Dias?: boolean;
  montoMayorA?: number;
  sinContactoReciente?: boolean; // Sin contacto en los últimos 7 días
  excluirClientesDeConfianza?: boolean; // Para priorizar casos urgentes
}

/**
 * Comparativa con el mes anterior en reportes mensuales.
 * Utilizado en: ReporteMensualMorosidadSimple, análisis de tendencias
 */
export type ComparativaMesAnterior = 'sube' | 'baja' | 'igual';

/**
 * Reporte mensual simplificado de morosidad con métricas clave.
 * Utilizado en: ReporteMensualSimple.tsx, dashboard ejecutivo, reportes mensuales, análisis de tendencias
 */
export interface ReporteMensualMorosidadSimple {
  id: string;
  mes: number; // 1-12
  anio: number;
  totalMorosidad: number;
  numeroClientes: number;
  tasaRecuperacion: number;
  comparativaMesAnterior: ComparativaMesAnterior;
  comentarioEjecutivo?: string;
}

// Reporte mensual simple (mantenido para compatibilidad)
export interface ReporteMensualSimple {
  mes: number; // 1-12
  año: number;
  totalCobrado: number;
  totalPendiente: number;
  pagosRecibidos: {
    id: string;
    facturaId: string;
    numeroFactura: string;
    clienteNombre: string;
    monto: number;
    fechaPago: Date;
    metodoPago?: MetodoPago;
  }[];
  pagosFaltantes: {
    id: string;
    facturaId: string;
    numeroFactura: string;
    clienteNombre: string;
    montoPendiente: number;
    fechaVencimiento: Date;
    diasRetraso: number;
  }[];
}

// ============================================================================
// TIPOS PARA PLANES DE PAGO (Actualizados según especificaciones)
// ============================================================================

// Tipos para Planes de Pago (mantenidos para compatibilidad)
export type EstadoCuota = 'pendiente' | 'pagada' | 'vencida' | 'cancelada';
export type EstadoPlanPago = 'activo' | 'completado' | 'cancelado' | 'vencido';

/**
 * Representa una cuota individual dentro de un plan de pago.
 * Utilizado en: PlanPago, seguimiento de pagos, reportes de cumplimiento
 */
export interface CuotaPlanPago {
  id: string;
  planPagoId: string;
  fechaVencimiento: Date;
  importeCuota: number;
  importePagado: number;
  estadoCuota: EstadoCuotaPlanPago | EstadoCuota; // Compatibilidad con ambos tipos
  diasRetraso?: number;
  // Campos adicionales para compatibilidad con código existente
  numeroCuota?: number;
  monto?: number; // Alias de importeCuota
  fechaPago?: Date;
  metodoPago?: MetodoPago;
  nota?: string;
}

/**
 * Plan de pago acordado con un cliente para liquidar su deuda.
 * Utilizado en: Gestión de planes de pago, seguimiento de acuerdos, reportes
 */
export interface PlanPago {
  id: string;
  clienteId: string;
  importeTotal: number;
  numeroCuotas: number;
  importeCuota: number;
  fechaInicio: Date;
  fechaFinEstimada: Date;
  cuotasPagadas: number;
  cuotasPendientes: number;
  estadoPlan: EstadoPlanPagoGeneral | EstadoPlanPago; // Compatibilidad con ambos tipos
  notas?: string;
  // Campos adicionales para compatibilidad con código existente
  pagoPendienteId?: string;
  clienteNombre?: string;
  montoTotal?: number; // Alias de importeTotal
  montoPagado?: number;
  montoPendiente?: number;
  cuotas?: CuotaPlanPago[];
  fechaCreacion?: Date;
  fechaFin?: Date; // Alias de fechaFinEstimada
  creadoPor?: string;
  fechaActualizacion?: Date;
}
