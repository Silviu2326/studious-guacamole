export type EstadoSuscripcion = 'activa' | 'pausada' | 'congelada' | 'cancelada' | 'vencida' | 'prueba' | 'pendiente';
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
  clienteId: string;
  importe: number;
  fechaVencimiento: string;
  fechaPagoOpcional?: string;
  estado: 'pendiente' | 'pagada' | 'vencida' | 'fallida';
  metodoPago?: string;
  referencia?: string;
  notas?: string;
  // Campos legacy para compatibilidad
  monto?: number; // Deprecated: usar importe
  fechaPago?: string; // Deprecated: usar fechaPagoOpcional
  // Información de reintentos para pagos fallidos
  numeroIntentos?: number; // Número de intentos de pago realizados
  ultimaFechaIntento?: string; // Última fecha en que se intentó el pago
  proximaFechaReintento?: string; // Próxima fecha sugerida para reintentar
  motivoFallo?: string; // Motivo del fallo del pago
  irrecuperable?: boolean; // Si la cuota ha sido marcada como irrecuperable
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
  notasInternas?: string;
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
  clienteNombre?: string; // Opcional para compatibilidad
  clienteEmail?: string; // Opcional para compatibilidad
  clienteTelefono?: string;
  fechaRenovacion?: string; // Opcional para compatibilidad
  diasAntes: number; // Días antes de la renovación (campo principal)
  diasAnticipacion?: number; // Alias para compatibilidad
  canal: 'email' | 'sms' | 'whatsapp'; // Canal principal del recordatorio
  canalesEnvio?: ('email' | 'sms' | 'whatsapp')[]; // Array para compatibilidad
  plantillaId?: string; // ID de la plantilla usada
  ultimoEnvio?: string; // Fecha del último envío
  fechaEnvio?: string; // Alias para compatibilidad
  estado: 'pendiente' | 'enviado' | 'fallido';
  monto?: number; // Opcional para compatibilidad
  entrenadorId?: string;
  fechaCreacion?: string; // Opcional para compatibilidad
}

export interface ConfiguracionRecordatorios {
  suscripcionId?: string; // Opcional para configuración global
  planId?: string; // ID del plan para configuración por nivel
  activo: boolean;
  diasAnticipacion: number[]; // Array de días antes de la renovación (ej: [7, 3, 1])
  canalesEnvio: ('email' | 'sms' | 'whatsapp')[];
  plantillaEmail?: string;
  plantillaSMS?: string;
  plantillaWhatsApp?: string;
  plantillaId?: string; // ID de plantilla genérica
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

// Tipo mejorado para descuentos con más información
export interface Descuento {
  id: string;
  tipo: 'porcentaje' | 'fijo';
  valor: number; // Porcentaje (0-100) o cantidad fija en euros
  motivo?: string; // Razón del descuento: 'cliente-clave', 'promocion', 'fidelidad', 'volumen', etc.
  fechaInicio: string;
  fechaFin?: string; // Fecha de expiración (opcional)
  vigencia?: {
    fechaInicio: string;
    fechaFin?: string;
    activo: boolean;
  };
  aplicadoA: 'cliente' | 'grupo' | 'plan'; // A qué se aplica el descuento
  clienteId?: string; // Si aplicadoA === 'cliente'
  grupoId?: string; // Si aplicadoA === 'grupo'
  planId?: string; // Si aplicadoA === 'plan'
  suscripcionId?: string; // ID de la suscripción asociada
  aplicadoPor?: string; // ID del entrenador que aplicó el descuento
  aplicadoPorNombre?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

// Tipo mejorado para suscripciones grupales con más información
export interface SuscripcionGrupal {
  id: string;
  grupoId: string;
  nombreGrupo: string;
  clientePrincipalId: string;
  clientePrincipalNombre: string;
  clientePrincipalEmail: string;
  miembros: MiembroGrupo[];
  precioTotal: number;
  precioOriginal: number; // Precio sin descuentos
  descuentoGrupo?: DescuentoGrupo;
  descuentosPersonalizados?: Descuento[]; // Descuentos adicionales aplicados al grupo
  frecuenciaPago: FrecuenciaPago;
  fechaInicio: string;
  fechaVencimiento: string;
  estado: EstadoSuscripcion;
  // Uso total del grupo
  usoTotal?: {
    sesionesIncluidas: number;
    sesionesUsadas: number;
    sesionesDisponibles: number;
    porcentajeUso: number;
  };
  // Uso por miembro
  usoPorMiembro?: Array<{
    miembroId: string;
    clienteId: string;
    clienteNombre: string;
    sesionesIncluidas: number;
    sesionesUsadas: number;
    sesionesDisponibles: number;
    porcentajeUso: number;
  }>;
  // Información de prorrateo si aplica
  prorrateo?: {
    aplicado: boolean;
    motivo?: string;
    fechaAplicacion?: string;
    montoProrrateado?: number;
  };
  entrenadorId?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
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

// Request mejorado para aplicar descuentos a clientes, grupos o planes
export interface AplicarDescuentoSuscripcionRequest {
  tipo: 'porcentaje' | 'fijo';
  valor: number;
  motivo?: string;
  fechaInicio: string;
  fechaFin?: string; // Opcional: fecha de expiración
  aplicadoA: 'cliente' | 'grupo' | 'plan';
  clienteId?: string; // Si aplicadoA === 'cliente'
  grupoId?: string; // Si aplicadoA === 'grupo'
  planId?: string; // Si aplicadoA === 'plan'
  suscripcionId?: string; // ID de la suscripción específica (opcional)
}

// Request para obtener descuentos de un cliente
export interface ObtenerDescuentosClienteRequest {
  clienteId: string;
  incluirExpirados?: boolean;
  incluirGrupos?: boolean; // Incluir descuentos de grupos a los que pertenece
}

// Request para obtener descuentos de un grupo
export interface ObtenerDescuentosGrupoRequest {
  grupoId: string;
  incluirExpirados?: boolean;
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
  cancelacionInmediata?: boolean; // true = inmediata, false = al final del período actual
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
    // Métricas de MRR con descuentos
    mrr: number; // Monthly Recurring Revenue (con descuentos aplicados)
    mrrSinDescuentos?: number; // MRR sin descuentos (opcional)
    impactoDescuentosMRR?: number; // Impacto de descuentos en MRR (opcional)
  };
}

// User Story 2: Exportación de datos de suscripciones y pagos
export type FormatoExportacion = 'csv' | 'excel' | 'pdf' | 'json';
export type TipoDatoExportacion = 'suscripciones' | 'cuotas' | 'metricas';

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

// Nuevos tipos para exportación separada
export interface ExportarSuscripcionesRequest {
  entrenadorId?: string;
  formato: 'csv' | 'excel';
  fechaInicio?: string;
  fechaFin?: string;
  planId?: string; // Filtro por plan específico
}

export interface ExportarCuotasRequest {
  entrenadorId?: string;
  formato: 'csv' | 'excel';
  fechaInicio?: string;
  fechaFin?: string;
  planId?: string; // Filtro por plan específico
}

export interface ExportarMetricasRequest {
  entrenadorId?: string;
  formato: 'csv' | 'excel';
  fechaInicio?: string;
  fechaFin?: string;
  planId?: string; // Filtro por plan específico
}

export interface ExportacionResponse {
  url?: string; // URL de descarga (mock)
  blob?: Blob; // Blob para descarga directa
  nombreArchivo: string;
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

// Filtros para el listado de suscripciones
export interface SuscripcionFilters {
  estado?: EstadoSuscripcion[];
  planId?: string[];
  tipoCliente?: 'pt-mensual' | 'membresia-gimnasio' | 'servicio' | 'contenido' | 'evento' | 'hibrida';
  fechaInicioDesde?: string;
  fechaInicioHasta?: string;
  search?: string; // Búsqueda por nombre de cliente
  entrenadorId?: string; // Para filtrar por entrenador
}

// Tipos para comparación de planes y upgrades/downgrades
export type TipoPlan = 'basico' | 'premium' | 'vip' | 'pt-4' | 'pt-8' | 'pt-12' | 'pt-custom';

export interface PlanSuscripcion {
  id: string;
  nombre: string;
  tipo: TipoPlan;
  nivel: number; // 1 = básico, 2 = premium, 3 = VIP, etc.
  precio: number;
  precioMensual?: number; // Precio mensualizado para comparación
  sesionesIncluidas?: number; // Para planes PT
  frecuenciaPago: FrecuenciaPago;
  beneficios: string[]; // Lista de beneficios del plan
  descripcion?: string;
  activo: boolean;
  permiteFreeze?: boolean;
  permiteMultisesion?: boolean;
  serviciosAcceso?: string[]; // Para gimnasios
}

export interface ComparacionPlanes {
  planOrigen: PlanSuscripcion;
  planDestino: PlanSuscripcion;
  diferenciaPrecio: number;
  diferenciaPrecioMensual: number; // Diferencia mensualizada
  diferenciaSesiones?: number;
  esUpgrade: boolean;
  esDowngrade: boolean;
  beneficiosGanados: string[];
  beneficiosPerdidos: string[];
  beneficiosMantenidos: string[];
}

export interface CalculoProrrateo {
  fechaCambio: string;
  fechaInicioPeriodo: string;
  fechaFinPeriodo: string;
  diasUsados: number;
  diasRestantes: number;
  diasTotales: number;
  precioPeriodoActual: number;
  precioPeriodoNuevo: number;
  creditoPeriodoActual: number; // Crédito por días no usados del plan actual
  cargoPeriodoNuevo: number; // Cargo por días restantes del nuevo plan
  diferenciaProrrateada: number; // Diferencia final a cobrar/devolver
  aplicarInmediatamente: boolean;
}

export interface ImpactoMRR {
  mrrActual: number;
  mrrNuevo: number;
  diferenciaMRR: number;
  porcentajeCambio: number;
  impactoAnual: number; // Impacto proyectado en 12 meses
}

export interface CambioPlanRequest {
  suscripcionId: string;
  nuevoPlanId: string;
  aplicarInmediatamente: boolean;
  fechaCambio?: string; // Si no se especifica, se usa la fecha actual
  motivo?: string;
  mantenerSesionesProgramadas?: boolean; // Para cambios de PT
  reasignarSesiones?: boolean; // Para cambios de PT
}

export interface CambioEntrenadorRequest {
  suscripcionId: string;
  nuevoEntrenadorId: string;
  nuevoEntrenadorNombre?: string;
  fechaCambio: string;
  mantenerSesionesProgramadas: boolean;
  reasignarSesiones: boolean;
  motivo?: string;
}

// Gestión de sesiones incluidas en planes de suscripción
export interface SesionIncluida {
  id: string;
  suscripcionId: string;
  clienteId: string;
  totalSesiones: number; // Total de sesiones incluidas en este período
  consumidas: number; // Sesiones ya consumidas
  fechaCaducidad: string; // Fecha de caducidad de estas sesiones
  tipoSesion: 'pt' | 'grupal' | 'multisesion' | 'bonus' | 'transferida'; // Tipo de sesión
  periodo?: string; // Período al que pertenecen (ej: "2024-10")
  fechaCreacion: string;
  fechaActualizacion: string;
  notas?: string;
}

export interface RegistrarConsumoSesionRequest {
  sesionIncluidaId: string;
  cantidad: number; // Cantidad de sesiones a consumir (normalmente 1)
  fechaConsumo: string; // Fecha en que se consumen
  motivo?: string;
}

export interface ObtenerSesionesIncluidasRequest {
  suscripcionId?: string;
  clienteId?: string;
  periodo?: string;
  incluirCaducadas?: boolean;
}

// Tipo para eventos de suscripciones (historial consolidado)
export type TipoEventoSuscripcion = 
  | 'alta' 
  | 'upgrade' 
  | 'downgrade'
  | 'congelacion' 
  | 'descongelacion'
  | 'pago_fallido' 
  | 'cancelacion'
  | 'renovacion'
  | 'cambio_plan'
  | 'aplicacion_descuento'
  | 'eliminacion_descuento'
  | 'ajuste_sesiones'
  | 'bonus_sesiones';

export interface EventoSuscripcion {
  id: string;
  suscripcionId: string;
  clienteId: string;
  clienteNombre: string;
  clienteEmail?: string;
  tipoEvento: TipoEventoSuscripcion;
  fecha: string;
  descripcion: string;
  detalles?: {
    campo?: string;
    valorAnterior?: any;
    valorNuevo?: any;
  }[];
  realizadoPor?: string;
  realizadoPorNombre?: string;
  motivo?: string;
  metadata?: Record<string, any>;
}

// Request para obtener actividad reciente de suscripciones
export interface GetActividadSuscripcionesRecienteRequest {
  entrenadorId?: string;
  fechaInicio?: string;
  fechaFin?: string;
  tiposEvento?: TipoEventoSuscripcion[];
  limite?: number;
}

// Response con actividad reciente
export interface ActividadSuscripcionesReciente {
  eventos: EventoSuscripcion[];
  resumen: {
    nuevasSuscripciones7Dias: number;
    nuevasSuscripciones30Dias: number;
    renovacionesRealizadas: number;
    cancelaciones: number;
    churn: number; // Tasa de cancelación
    cambiosPlan: number;
    congelaciones: number;
    pagosFallidos: number;
  };
  periodo: {
    fechaInicio: string;
    fechaFin: string;
  };
}

// Tipos para Analytics de Suscripciones
export interface MetricasSuscripcion {
  mrr: number; // Monthly Recurring Revenue
  numeroSuscripcionesActivas: number;
  churnMensual: number; // Porcentaje de churn mensual
  ltvMedio: number; // Lifetime Value medio
  retencion: number; // Tasa de retención
  evolucionMRR: Array<{
    mes: string;
    mrr: number;
    numeroSuscripciones: number;
  }>;
  distribucionPorPlan: Array<{
    planNombre: string;
    numeroSuscripciones: number;
    porcentaje: number;
    mrr: number;
  }>;
}

// Tipos para Proyecciones de Retención con Escenarios
export type EscenarioProyeccion = 'optimista' | 'realista' | 'pesimista';

export interface ProyeccionRetencion {
  escenario: EscenarioProyeccion;
  meses: Array<{
    mes: string;
    fechaInicio: string;
    fechaFin: string;
    ingresos: number;
    numeroSuscripciones: number;
    churnEsperado: number;
    crecimientoEsperado: number; // Nuevas suscripciones
  }>;
  parametros: {
    churnBase: number; // Churn base para el escenario
    crecimientoBase: number; // Crecimiento base de nuevas suscripciones
    factorOptimista?: number; // Factor multiplicador para escenario optimista
    factorPesimista?: number; // Factor multiplicador para escenario pesimista
  };
}

export interface ParametrosProyeccion {
  churnEsperado: number; // Porcentaje de churn esperado
  crecimientoAltas: number; // Número de nuevas suscripciones esperadas por mes
  mesesProyeccion: number; // Número de meses a proyectar (6-12)
}

