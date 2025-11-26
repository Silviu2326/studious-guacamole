export type EstadoSuscripcion = 'activa' | 'pausada' | 'cancelada' | 'vencida' | 'pendiente';
export type TipoSuscripcion = 'pt-mensual' | 'membresia-gimnasio' | 'servicio' | 'contenido' | 'evento' | 'hibrida';
export type FrecuenciaPago = 'mensual' | 'trimestral' | 'semestral' | 'anual';

export interface Suscripcion {
  id: string;
  clienteId: string;
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono?: string;
  tipo: TipoSuscripcion;
  planId: string;
  planNombre: string;
  
  // Para Entrenadores: Paquetes PT
  sesionesIncluidas?: number; // 4, 8, 12 sesiones/mes
  sesionesUsadas?: number;
  sesionesDisponibles?: number;
  
  // Para Gimnasios: Membresías
  nivelPlan?: 'basico' | 'premium' | 'vip';
  permiteFreeze?: boolean;
  permiteMultisesion?: boolean;
  serviciosAcceso?: string[]; // Para multisesión
  
  precio: number;
  precioOriginal?: number; // Precio original antes de descuentos
  frecuenciaPago: FrecuenciaPago;
  fechaInicio: string;
  fechaVencimiento: string;
  proximaRenovacion?: string;
  estado: EstadoSuscripcion;
  
  // Descuentos personalizados (User Story 2)
  descuento?: DescuentoSuscripcion;
  historialDescuentos?: HistorialDescuento[];
  
  // Cuotas recurrentes
  pagoRecurrente?: PagoRecurrente;
  historialCuotas: Cuota[];
  
  // Freeze
  freezeActivo?: boolean;
  fechaFreezeInicio?: string;
  fechaFreezeFin?: string;
  diasFreezeRestantes?: number;
  reanudacionAutomatica?: boolean; // Para reanudación automática después del freeze
  
  // Modificaciones de sesiones (para PT)
  sesionesAjuste?: number; // Sesiones añadidas o quitadas del plan base
  historialAjustesSesiones?: AjusteSesiones[];
  
  // Sesiones bonus (para PT) - User Story 2
  sesionesBonus?: number; // Sesiones bonus gratuitas acumuladas
  historialBonusSesiones?: BonusSesiones[];
  
  // Suscripción de prueba (para PT) - User Story 1
  isTrial?: boolean; // Indica si es una suscripción de prueba
  trialSessions?: number; // Número de sesiones incluidas en la prueba
  trialPrice?: number; // Precio reducido de la prueba
  trialDuration?: number; // Duración de la prueba en días
  trialEndDate?: string; // Fecha de finalización de la prueba
  
  // Multisesión (para gimnasios)
  multisesionActivo?: boolean;
  serviciosMultisesion?: string[];
  
  entrenadorId?: string; // Para PT
  fechaCreacion: string;
  fechaActualizacion: string;
  notas?: string;
  
  // Historial de cambios (User Story 1)
  historialCambios?: HistorialCambio[];
  
  // Cancelación (User Story 2)
  motivoCancelacion?: string;
  fechaCancelacion?: string;
  
  // Suscripciones grupales/familiares (User Story 2)
  esGrupal?: boolean;
  grupoId?: string; // ID del grupo si es parte de una suscripción grupal
  miembrosGrupo?: MiembroGrupo[]; // Miembros del grupo (solo en la suscripción principal)
  descuentoGrupo?: DescuentoGrupo; // Descuento aplicado por volumen
  
  // Transferencia de sesiones no usadas (User Story 1)
  transferenciaSesionesActiva?: boolean; // Si está habilitada la transferencia automática
  configuracionTransferencia?: ConfiguracionTransferenciaSesiones;
  historialTransferencias?: TransferenciaSesiones[];
  sesionesTransferidas?: number; // Sesiones transferidas del mes anterior
}

// User Story 2: Suscripciones grupales/familiares
export interface MiembroGrupo {
  id: string;
  clienteId: string;
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono?: string;
  suscripcionId: string; // ID de la suscripción individual del miembro
  fechaAgregado: string;
  activo: boolean;
}

export interface DescuentoGrupo {
  tipo: 'porcentaje' | 'fijo';
  valor: number; // Porcentaje (0-100) o cantidad fija en euros
  numeroMiembrosMinimo: number; // Número mínimo de miembros para aplicar el descuento
  aplicado: boolean;
}

export interface CreateSuscripcionGrupalRequest {
  nombreGrupo: string; // Nombre del grupo/familia
  clientePrincipalId: string; // Cliente principal que pagará
  miembros: Array<{
    clienteId: string;
    clienteNombre?: string;
    clienteEmail?: string;
    clienteTelefono?: string;
    planId: string;
    sesionesIncluidas?: number;
  }>;
  descuentoGrupo: {
    tipo: 'porcentaje' | 'fijo';
    valor: number;
  };
  frecuenciaPago: FrecuenciaPago;
  fechaInicio: string;
  pagoRecurrente?: {
    metodoPago: 'tarjeta' | 'transferencia' | 'domiciliacion';
    datosPago?: any;
  };
  entrenadorId?: string;
  notas?: string;
}

export interface AgregarMiembroGrupoRequest {
  grupoId: string;
  clienteId: string;
  clienteNombre?: string;
  clienteEmail?: string;
  clienteTelefono?: string;
  planId: string;
  sesionesIncluidas?: number;
}

export interface RemoverMiembroGrupoRequest {
  grupoId: string;
  miembroId: string;
  motivo?: string;
}

export interface PagoRecurrente {
  id: string;
  suscripcionId: string;
  metodoPago: 'tarjeta' | 'transferencia' | 'domiciliacion';
  numeroTarjeta?: string; // Últimos 4 dígitos
  activo: boolean;
  fechaProximoCargo?: string;
  frecuencia: FrecuenciaPago;
}

export interface Cuota {
  id: string;
  suscripcionId: string;
  monto: number;
  fechaVencimiento: string;
  fechaPago?: string;
  estado: 'pendiente' | 'pagada' | 'vencida' | 'fallida';
  metodoPago?: string;
  referencia?: string;
  notas?: string;
}

export interface UpgradeDowngrade {
  id: string;
  suscripcionId: string;
  planOrigen: string;
  planDestino: string;
  fechaSolicitud: string;
  fechaAplicacion: string;
  tipoCambio: 'upgrade' | 'downgrade';
  diferenciaPrecio: number;
  estado: 'pendiente' | 'aplicado' | 'cancelado';
}

export interface FreezeRequest {
  suscripcionId: string;
  fechaInicio: string;
  fechaFin: string;
  motivo?: string;
  diasTotales: number;
}

export interface MultisesionRequest {
  suscripcionId: string;
  servicios: string[];
  precioAdicional?: number;
}

export interface Renovacion {
  id: string;
  suscripcionId: string;
  fechaRenovacion: string;
  monto: number;
  estado: 'programada' | 'procesada' | 'fallida';
  fechaProcesamiento?: string;
  notas?: string;
}

export interface CreateSuscripcionRequest {
  clienteId: string;
  tipo: TipoSuscripcion;
  planId: string;
  precio: number;
  frecuenciaPago: FrecuenciaPago;
  fechaInicio: string;
  pagoRecurrente?: {
    metodoPago: 'tarjeta' | 'transferencia' | 'domiciliacion';
    datosPago?: any;
  };
  sesionesIncluidas?: number; // Para PT
  entrenadorId?: string; // Para PT
  // Campos para suscripción de prueba
  isTrial?: boolean;
  trialSessions?: number;
  trialPrice?: number;
  trialDuration?: number;
}

export interface UpdateSuscripcionRequest {
  precio?: number;
  fechaVencimiento?: string;
  estado?: EstadoSuscripcion;
  notas?: string;
}

export interface ModificarSesionesRequest {
  suscripcionId: string;
  sesionesAjuste: number; // Positivo para añadir, negativo para quitar
  motivo?: string;
  aplicarEnProximoCiclo?: boolean; // Si es true, se aplica en la próxima renovación
}

export interface AjusteSesiones {
  id: string;
  suscripcionId: string;
  fechaAjuste: string;
  sesionesAjuste: number; // Positivo para añadir, negativo para quitar
  sesionesAntes: number;
  sesionesDespues: number;
  motivo?: string;
  aplicado: boolean;
}

export interface CambioPlanPTRequest {
  suscripcionId: string;
  nuevoPlanId: string;
  nuevoPrecio: number;
  nuevoSesiones: number;
  aplicarInmediatamente: boolean;
  motivo?: string;
}

export interface BonusSesiones {
  id: string;
  suscripcionId: string;
  fechaAñadido: string;
  cantidadSesiones: number; // Siempre positivo (sesiones bonus)
  sesionesAntes: number;
  sesionesDespues: number;
  motivo?: string; // Razón: fidelidad, compensación, etc.
  usado?: boolean; // Si las sesiones ya fueron utilizadas
}

export interface CreateTrialSuscripcionRequest {
  clienteId: string;
  clienteNombre?: string;
  clienteEmail?: string;
  clienteTelefono?: string;
  planId: string;
  planNombre?: string;
  trialSessions: number; // Sesiones limitadas para la prueba
  trialPrice: number; // Precio reducido
  trialDuration: number; // Duración en días (ej: 7, 14, 30)
  fechaInicio: string;
  pagoRecurrente?: {
    metodoPago: 'tarjeta' | 'transferencia' | 'domiciliacion';
    datosPago?: any;
  };
  entrenadorId?: string;
  notas?: string;
}

export interface AñadirBonusSesionesRequest {
  suscripcionId: string;
  cantidadSesiones: number; // Siempre positivo
  motivo?: string; // Razón: fidelidad, compensación, etc.
}

// User Story 1: Alertas de sesiones por caducar
export interface SesionPorCaducar {
  suscripcionId: string;
  clienteId: string;
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono?: string;
  sesionesDisponibles: number;
  sesionesIncluidas: number;
  fechaVencimiento: string;
  diasRestantes: number;
  entrenadorId?: string;
}

// User Story 2: Gestión de pagos fallidos
export interface PagoFallido {
  cuotaId: string;
  suscripcionId: string;
  clienteId: string;
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono?: string;
  monto: number;
  fechaVencimiento: string;
  fechaIntento: string;
  motivoFallo?: string;
  intentos: number;
  metodoPago?: string;
  entrenadorId?: string;
}

export interface GestionarPagoFallidoRequest {
  cuotaId: string;
  accion: 'reintentar' | 'actualizar_metodo' | 'contactar_cliente' | 'marcar_resuelto';
  nuevoMetodoPago?: 'tarjeta' | 'transferencia' | 'domiciliacion';
  datosPago?: any;
  notas?: string;
}

// User Story 1: Recordatorios automáticos de renovación
export interface RecordatorioRenovacion {
  id: string;
  suscripcionId: string;
  clienteId: string;
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono?: string;
  fechaRenovacion: string;
  diasAnticipacion: number; // Días antes de la renovación que se envía el recordatorio
  monto: number;
  estado: 'pendiente' | 'enviado' | 'fallido';
  fechaEnvio?: string;
  canalesEnvio: ('email' | 'sms' | 'whatsapp')[];
  entrenadorId?: string;
  fechaCreacion: string;
}

export interface ConfiguracionRecordatorios {
  suscripcionId: string;
  activo: boolean;
  diasAnticipacion: number[]; // Array de días antes de la renovación (ej: [7, 3, 1])
  canalesEnvio: ('email' | 'sms' | 'whatsapp')[];
  plantillaEmail?: string;
  plantillaSMS?: string;
  plantillaWhatsApp?: string;
}

export interface EnviarRecordatorioRequest {
  suscripcionId: string;
  diasAnticipacion: number;
  canales?: ('email' | 'sms' | 'whatsapp')[];
}

// User Story 2: Descuentos personalizados
export interface DescuentoSuscripcion {
  id: string;
  tipo: 'porcentaje' | 'fijo';
  valor: number; // Porcentaje (0-100) o cantidad fija en euros
  motivo?: string; // Razón del descuento: 'cliente-clave', 'promocion', 'fidelidad', etc.
  fechaInicio: string;
  fechaFin?: string; // Si no se especifica, el descuento es permanente hasta que se elimine
  aplicadoPor?: string; // ID del entrenador que aplicó el descuento
  aplicadoPorNombre?: string;
}

export interface HistorialDescuento {
  id: string;
  suscripcionId: string;
  descuento: DescuentoSuscripcion;
  fechaAplicacion: string;
  fechaEliminacion?: string;
  precioAntes: number;
  precioDespues: number;
  aplicadoPor?: string;
  aplicadoPorNombre?: string;
  motivo?: string;
}

export interface AplicarDescuentoRequest {
  suscripcionId: string;
  tipo: 'porcentaje' | 'fijo';
  valor: number;
  motivo?: string;
  fechaFin?: string; // Opcional: fecha de expiración del descuento
}

export interface EliminarDescuentoRequest {
  suscripcionId: string;
  motivo?: string;
}

// User Story 1: Historial de cambios de suscripción
export type TipoCambio = 
  | 'creacion' 
  | 'actualizacion_precio' 
  | 'cambio_plan' 
  | 'cambio_estado' 
  | 'cambio_fecha_vencimiento'
  | 'aplicacion_descuento'
  | 'eliminacion_descuento'
  | 'ajuste_sesiones'
  | 'bonus_sesiones'
  | 'freeze'
  | 'unfreeze'
  | 'activacion_multisesion'
  | 'desactivacion_multisesion'
  | 'cancelacion'
  | 'otro';

export interface HistorialCambio {
  id: string;
  suscripcionId: string;
  tipoCambio: TipoCambio;
  fechaCambio: string;
  realizadoPor?: string; // ID del usuario que realizó el cambio
  realizadoPorNombre?: string;
  descripcion: string; // Descripción legible del cambio
  cambios: {
    campo: string;
    valorAnterior?: any;
    valorNuevo?: any;
  }[];
  motivo?: string; // Motivo del cambio si fue proporcionado
  metadata?: Record<string, any>; // Información adicional sobre el cambio
}

// User Story 2: Cancelación de suscripción con motivo
export interface CancelarSuscripcionRequest {
  suscripcionId: string;
  motivo: string; // Motivo de cancelación (requerido)
  comentariosAdicionales?: string; // Comentarios opcionales adicionales
}

// User Story 1: Métricas de compromiso y riesgo de cancelación
export type NivelRiesgo = 'bajo' | 'medio' | 'alto' | 'critico';

export interface MetricaCompromiso {
  suscripcionId: string;
  clienteId: string;
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono?: string;
  
  // Métricas de uso
  tasaUsoSesiones: number; // Porcentaje de sesiones usadas vs incluidas (últimos 3 meses)
  sesionesUsadasUltimos3Meses: number;
  sesionesIncluidasUltimos3Meses: number;
  diasDesdeUltimaSesion: number;
  promedioSesionesPorMes: number;
  
  // Métricas de asistencia
  tasaAsistencia: number; // Porcentaje de sesiones asistidas vs programadas
  sesionesProgramadas: number;
  sesionesAsistidas: number;
  sesionesCanceladas: number;
  sesionesNoAsistidas: number;
  
  // Métricas de pago
  pagosPuntuales: number; // Número de pagos puntuales
  pagosAtrasados: number; // Número de pagos atrasados
  pagosFallidos: number; // Número de pagos fallidos
  tasaPagosPuntuales: number; // Porcentaje de pagos puntuales
  
  // Métricas de tiempo
  diasComoCliente: number; // Días desde la fecha de inicio
  mesesActivo: number; // Meses con suscripción activa
  ultimaInteraccion: string; // Fecha de última interacción (sesión, pago, etc.)
  
  // Métricas de compromiso general
  puntuacionCompromiso: number; // Puntuación de 0-100
  nivelRiesgo: NivelRiesgo;
  factoresRiesgo: string[]; // Lista de factores que indican riesgo
  
  // Información adicional
  entrenadorId?: string;
  fechaCalculo: string;
}

export interface ResumenMetricasCompromiso {
  totalClientes: number;
  clientesEnRiesgo: number;
  clientesRiesgoAlto: number;
  clientesRiesgoCritico: number;
  tasaCompromisoPromedio: number;
  tasaUsoPromedio: number;
  tasaAsistenciaPromedio: number;
  tasaPagosPuntualesPromedio: number;
  metricas: MetricaCompromiso[];
}

// User Story: Propuesta de cambio antes de renovación
export interface PropuestaCambioRenovacion {
  id: string;
  suscripcionId: string;
  clienteId: string;
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono?: string;
  tipoCambio: 'plan' | 'precio' | 'descuento';
  
  // Para cambio de plan
  nuevoPlanId?: string;
  nuevoPlanNombre?: string;
  nuevoPrecio?: number;
  nuevoSesiones?: number;
  
  // Para cambio de precio
  precioActual?: number;
  precioNuevo?: number;
  
  // Para descuento
  descuento?: {
    tipo: 'porcentaje' | 'fijo';
    valor: number;
    motivo?: string;
  };
  
  // Información general
  mensajePersonalizado?: string;
  fechaRenovacion: string;
  fechaCreacion: string;
  fechaVencimiento?: string; // Fecha hasta la cual la propuesta es válida
  estado: 'pendiente' | 'aceptada' | 'rechazada' | 'expirada';
  fechaAceptacion?: string;
  fechaRechazo?: string;
  motivoRechazo?: string;
  
  // Metadata
  creadoPor?: string;
  creadoPorNombre?: string;
  entrenadorId?: string;
}

export interface CrearPropuestaCambioRenovacionRequest {
  suscripcionId: string;
  tipoCambio: 'plan' | 'precio' | 'descuento';
  nuevoPlanId?: string;
  nuevoPrecio?: number;
  nuevoSesiones?: number;
  descuento?: {
    tipo: 'porcentaje' | 'fijo';
    valor: number;
    motivo?: string;
  };
  mensajePersonalizado?: string;
  fechaVencimiento?: string; // Fecha hasta la cual la propuesta es válida
}

// User Story 1: Transferencia de sesiones no usadas al siguiente mes
export interface TransferenciaSesiones {
  id: string;
  suscripcionId: string;
  periodoOrigen: string; // Mes/año de origen (ej: "2024-10")
  periodoDestino: string; // Mes/año de destino (ej: "2024-11")
  sesionesTransferidas: number;
  sesionesDisponiblesAntes: number;
  sesionesDisponiblesDespues: number;
  fechaTransferencia: string;
  aplicado: boolean;
}

export interface ConfiguracionTransferenciaSesiones {
  suscripcionId: string;
  transferenciaAutomatica: boolean; // Si es true, se transfieren automáticamente al renovar
  maxSesionesTransferibles?: number; // Límite máximo de sesiones transferibles (opcional)
  aplicarEnRenovacion: boolean; // Si se aplica automáticamente en la renovación
}

export interface TransferirSesionesRequest {
  suscripcionId: string;
  sesionesATransferir: number;
  periodoOrigen?: string; // Si no se especifica, se usa el período actual
  periodoDestino?: string; // Si no se especifica, se usa el próximo período
  aplicadoAutomaticamente?: boolean; // Si fue aplicado automáticamente en renovación
}

// User Story 2: Resumen periódico de actividad de suscripciones
export type FrecuenciaResumen = 'diario' | 'semanal' | 'mensual';

export interface ResumenActividadSuscripciones {
  id: string;
  entrenadorId?: string;
  periodo: string; // Período del resumen (ej: "2024-10", "2024-10-01 a 2024-10-07")
  fechaInicio: string;
  fechaFin: string;
  fechaGeneracion: string;
  
  // Métricas generales
  totalSuscripciones: number;
  suscripcionesActivas: number;
  suscripcionesNuevas: number;
  suscripcionesCanceladas: number;
  suscripcionesRenovadas: number;
  suscripcionesPausadas: number;
  
  // Métricas de sesiones (para entrenadores)
  totalSesionesIncluidas?: number;
  totalSesionesUsadas?: number;
  totalSesionesDisponibles?: number;
  totalSesionesTransferidas?: number;
  tasaUsoSesiones?: number; // Porcentaje de uso de sesiones
  
  // Métricas financieras
  ingresosRecurrentes: number;
  ingresosNuevos: number;
  ingresosPerdidos: number; // Por cancelaciones
  
  // Métricas de actividad
  clientesActivos: number;
  clientesNuevos: number;
  clientesPerdidos: number;
  
  // Detalles
  detallesNuevas?: DetalleSuscripcion[];
  detallesCanceladas?: DetalleSuscripcion[];
  detallesRenovadas?: DetalleSuscripcion[];
  detallesTransferencias?: DetalleTransferencia[];
  
  // Alertas y notificaciones
  alertas?: AlertaResumen[];
}

export interface DetalleSuscripcion {
  suscripcionId: string;
  clienteId: string;
  clienteNombre: string;
  clienteEmail: string;
  planNombre: string;
  precio: number;
  fecha: string;
  tipo: 'nueva' | 'cancelada' | 'renovada' | 'pausada';
}

export interface DetalleTransferencia {
  suscripcionId: string;
  clienteNombre: string;
  sesionesTransferidas: number;
  periodoOrigen: string;
  periodoDestino: string;
  fecha: string;
}

export interface AlertaResumen {
  tipo: 'info' | 'warning' | 'error';
  mensaje: string;
  accionRequerida?: boolean;
}

export interface ConfiguracionResumenActividad {
  entrenadorId?: string;
  frecuencia: FrecuenciaResumen;
  diasSemana?: number[]; // Para resúmenes semanales: [1, 3, 5] = lunes, miércoles, viernes
  diaMes?: number; // Para resúmenes mensuales: día del mes (1-31)
  horaEnvio?: string; // Hora de envío (ej: "09:00")
  canalesEnvio: ('email' | 'notificacion' | 'dashboard')[];
  activo: boolean;
}

export interface GenerarResumenRequest {
  entrenadorId?: string;
  fechaInicio: string;
  fechaFin: string;
  incluirDetalles?: boolean;
}

// User Story 1: Proyecciones de ingresos recurrentes y análisis de retención
export interface ProyeccionIngresos {
  periodo: string; // Mes/año (ej: "2024-11")
  fechaInicio: string;
  fechaFin: string;
  ingresosProyectados: number; // Ingresos esperados en este período
  ingresosConfirmados: number; // Ingresos ya confirmados (suscripciones activas)
  ingresosPotenciales: number; // Ingresos de suscripciones en riesgo
  numeroSuscripciones: number; // Número de suscripciones activas
  numeroRenovaciones: number; // Número de renovaciones esperadas
  numeroCancelaciones: number; // Número de cancelaciones esperadas
  tasaRetencionEsperada: number; // Porcentaje de retención esperado
}

export interface AnalisisRetencion {
  periodo: string; // Período analizado (ej: "Últimos 6 meses")
  fechaInicio: string;
  fechaFin: string;
  tasaRetencionGeneral: number; // Tasa de retención general (%)
  tasaRetencionPorPlan: Array<{
    planId: string;
    planNombre: string;
    tasaRetencion: number;
    numeroClientes: number;
    numeroCancelaciones: number;
  }>;
  tasaRetencionPorAntiguedad: Array<{
    rango: string; // "0-3 meses", "3-6 meses", "6-12 meses", "12+ meses"
    tasaRetencion: number;
    numeroClientes: number;
  }>;
  razonesCancelacion: Array<{
    motivo: string;
    frecuencia: number;
    porcentaje: number;
  }>;
  clientesEnRiesgo: number; // Número de clientes con alto riesgo de cancelación
  valorVidaCliente: number; // Customer Lifetime Value promedio
  tiempoPromedioRetencion: number; // Meses promedio de retención
  tendenciaRetencion: Array<{
    mes: string;
    tasaRetencion: number;
    numeroClientes: number;
  }>;
}

export interface ProyeccionesYRetencionRequest {
  entrenadorId?: string;
  mesesProyeccion?: number; // Número de meses a proyectar (default: 12)
  mesesAnalisis?: number; // Número de meses para análisis de retención (default: 6)
}

export interface ProyeccionesYRetencionResponse {
  proyecciones: ProyeccionIngresos[];
  analisisRetencion: AnalisisRetencion;
  resumen: {
    ingresosTotalesProyectados: number; // Suma de ingresos proyectados
    ingresosTotalesConfirmados: number; // Suma de ingresos confirmados
    tasaRetencionPromedio: number;
    clientesTotales: number;
    clientesEnRiesgo: number;
    valorVidaClientePromedio: number;
  };
}

// User Story 2: Exportación de datos de suscripciones y pagos
export type FormatoExportacion = 'csv' | 'excel' | 'pdf' | 'json';

export interface ExportarDatosRequest {
  entrenadorId?: string;
  formato: FormatoExportacion;
  fechaInicio?: string; // Opcional: filtrar por fecha de inicio
  fechaFin?: string; // Opcional: filtrar por fecha de fin
  incluirSuscripciones: boolean;
  incluirPagos: boolean;
  incluirCanceladas?: boolean; // Incluir suscripciones canceladas
  incluirPausadas?: boolean; // Incluir suscripciones pausadas
  campos?: string[]; // Campos específicos a incluir (opcional)
}

export interface DatosExportacion {
  suscripciones?: Array<{
    id: string;
    clienteId: string;
    clienteNombre: string;
    clienteEmail: string;
    clienteTelefono?: string;
    tipo: TipoSuscripcion;
    planNombre: string;
    precio: number;
    precioOriginal?: number;
    frecuenciaPago: FrecuenciaPago;
    fechaInicio: string;
    fechaVencimiento: string;
    estado: EstadoSuscripcion;
    sesionesIncluidas?: number;
    sesionesUsadas?: number;
    fechaCreacion: string;
    fechaCancelacion?: string;
    motivoCancelacion?: string;
  }>;
  pagos?: Array<{
    id: string;
    suscripcionId: string;
    clienteId: string;
    clienteNombre: string;
    monto: number;
    fechaVencimiento: string;
    fechaPago?: string;
    estado: 'pendiente' | 'pagada' | 'vencida' | 'fallida';
    metodoPago?: string;
    referencia?: string;
  }>;
  metadata: {
    fechaExportacion: string;
    periodo: string;
    totalSuscripciones?: number;
    totalPagos?: number;
    ingresosTotales?: number;
  };
}

