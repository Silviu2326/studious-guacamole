export type TipoCita = 'sesion-1-1' | 'videollamada' | 'evaluacion' | 'clase-colectiva' | 'fisioterapia' | 'mantenimiento' | 'otro';
export type EstadoCita = 'pendiente' | 'confirmada' | 'en-curso' | 'completada' | 'cancelada' | 'no-show';
export type VistaCalendario = 'mes' | 'semana' | 'dia';
export type TipoRecurrencia = 'diaria' | 'semanal' | 'quincenal' | 'mensual' | 'ninguna';
export type MotivoCancelacion = 'cliente' | 'entrenador' | 'otro';
export type EstadoConfirmacionCliente = 'pendiente' | 'confirmada' | 'cancelada' | 'reprogramacion-solicitada';

export interface Recurrencia {
  tipo: TipoRecurrencia;
  diasSemana?: number[]; // 0 = Domingo, 6 = Sábado (solo para tipo 'semanal')
  fechaInicio: Date;
  fechaFin?: Date; // undefined significa "hasta cancelar"
  serieId?: string; // ID único para todas las sesiones de la misma serie
}

export interface HistorialCambio {
  id: string;
  fecha: Date;
  tipo: 'creada' | 'editada' | 'cancelada' | 'reprogramada';
  motivo?: MotivoCancelacion;
  motivoDetalle?: string;
  cambios?: {
    campo: string;
    valorAnterior: any;
    valorNuevo: any;
  }[];
  usuarioId?: string;
  usuarioNombre?: string;
}

export interface Cita {
  id: string;
  titulo: string;
  descripcion?: string;
  tipo: TipoCita;
  estado: EstadoCita;
  fechaInicio: Date;
  fechaFin: Date;
  clienteId?: string;
  clienteNombre?: string;
  instructorId?: string;
  instructorNombre?: string;
  capacidadMaxima?: number;
  inscritos?: number;
  ubicacion?: string;
  notas?: string;
  recordatorioEnviado?: boolean;
  recurrencia?: Recurrencia;
  historial?: HistorialCambio[];
  motivoCancelacion?: MotivoCancelacion;
  motivoCancelacionDetalle?: string;
  // Nueva funcionalidad de confirmación de cliente
  confirmacionCliente?: EstadoConfirmacionCliente;
  fechaConfirmacionCliente?: Date;
  solicitudReprogramacion?: SolicitudReprogramacion;
  // Sincronización con calendario externo
  sincronizarCalendario?: boolean; // Si está activo, se sincronizará automáticamente
  eventoExternoId?: string; // ID del evento en el calendario externo
  conexionCalendarioId?: string; // ID de la conexión de calendario usada
  asistencia?: 'asistio' | 'falto' | 'cancelado'; // Indicador de asistencia para historial
}

// Solicitud de reprogramación por parte del cliente
export interface SolicitudReprogramacion {
  id: string;
  citaId: string;
  clienteId: string;
  fechaSolicitud: Date;
  motivo?: string;
  fechaPreferida?: Date;
  horaPreferida?: string;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  respuestaEntrenador?: string;
  fechaRespuesta?: Date;
}

export interface BloqueoAgenda {
  id: string;
  titulo: string;
  descripcion?: string;
  motivo?: string; // Motivo del bloqueo (opcional)
  fechaInicio: Date;
  fechaFin: Date;
  tipo: 'vacaciones' | 'mantenimiento' | 'feriado' | 'calendario-externo' | 'otro';
  recurrente?: boolean;
  bloqueoCompleto: boolean; // true = día completo, false = rango de horas
  horaInicio?: string; // HH:mm (solo si bloqueoCompleto = false)
  horaFin?: string; // HH:mm (solo si bloqueoCompleto = false)
  eventoExternoId?: string; // ID del evento externo si viene de sincronización
  conexionCalendarioId?: string; // ID de la conexión de calendario
}

export interface HorarioDisponibilidad {
  id: string;
  diaSemana: number; // 0 = Domingo, 6 = Sábado
  horaInicio: string; // HH:mm
  horaFin: string; // HH:mm
  disponible: boolean;
}

export interface RangoHorario {
  id: string;
  horaInicio: string; // HH:mm
  horaFin: string; // HH:mm
}

export interface HorarioTrabajoDia {
  diaSemana: number; // 0 = Domingo, 6 = Sábado
  disponible: boolean;
  rangos: RangoHorario[];
}

export interface HorarioTrabajoSemanal {
  id: string;
  nombre: string;
  dias: HorarioTrabajoDia[];
  esPlantilla: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlantillaHorario {
  id: string;
  nombre: string;
  descripcion?: string;
  horarioTrabajo: Omit<HorarioTrabajoSemanal, 'id' | 'nombre' | 'esPlantilla' | 'createdAt' | 'updatedAt'>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Recordatorio {
  id: string;
  citaId: string;
  tipo: 'email' | 'sms' | 'whatsapp' | 'push';
  tiempoAnticipacion: number; // minutos antes
  activo: boolean;
  enviado?: boolean;
  fechaEnvio?: Date;
  leido?: boolean;
  fechaLectura?: Date;
  error?: string;
}

// Configuración de recordatorios automáticos
export interface ConfiguracionRecordatorios {
  id: string;
  userId?: string;
  activo: boolean;
  recordatorios: RecordatorioConfiguracion[];
  plantillaMensaje: string; // Plantilla con variables: {nombre}, {hora}, {lugar}, {fecha}
  canalPorDefecto: 'whatsapp' | 'sms' | 'email';
  createdAt: Date;
  updatedAt: Date;
}

// Configuración individual de recordatorio (24h, 2h, etc.)
export interface RecordatorioConfiguracion {
  id: string;
  tiempoAnticipacionHoras: number; // 24, 2, etc.
  activo: boolean;
  canales: ('whatsapp' | 'sms' | 'email')[]; // Puede enviarse por múltiples canales
  orden: number; // Orden de envío
}

// Preferencias de recordatorios por cliente
export interface PreferenciasRecordatorioCliente {
  id: string;
  clienteId: string;
  clienteNombre?: string;
  recordatoriosDesactivados: boolean; // Si el cliente no quiere recordatorios
  canalPreferido?: 'whatsapp' | 'sms' | 'email';
  telefono?: string; // Para WhatsApp/SMS
  email?: string; // Para email
  createdAt: Date;
  updatedAt: Date;
}

// Historial de recordatorios enviados
export interface HistorialRecordatorio {
  id: string;
  citaId: string;
  clienteId: string;
  tipo: 'whatsapp' | 'sms' | 'email';
  tiempoAnticipacionHoras: number;
  mensaje: string;
  enviado: boolean;
  fechaEnvio: Date;
  leido: boolean;
  fechaLectura?: Date;
  error?: string;
  createdAt: Date;
}

export interface AnalyticsOcupacion {
  periodo: string;
  totalCitas: number;
  citasConfirmadas: number;
  citasCompletadas: number;
  ocupacionPromedio: number;
  ingresosEstimados: number;
  claseMasPopular?: {
    nombre: string;
    ocupacion: number;
  };
}

export interface PlantillaSesion {
  id: string;
  nombre: string;
  tipo: TipoCita;
  duracion: number; // en minutos
  precio?: number;
  notas?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConfiguracionTiempoDescanso {
  id: string;
  tiempoMinimoMinutos: number; // Tiempo mínimo entre sesiones en minutos (ej: 15)
  activo: boolean; // Si está activo o no
  permitirOverride: boolean; // Si se permite override manual
  userId?: string; // ID del usuario (entrenador)
  createdAt: Date;
  updatedAt: Date;
}

// Configuración de resumen diario
export interface ConfiguracionResumenDiario {
  id: string;
  userId?: string;
  activo: boolean;
  horaEnvio: string; // HH:mm (ej: "20:00")
  canal: 'email' | 'notificacion' | 'ambos';
  incluirHorarios: boolean;
  incluirClientes: boolean;
  incluirTiposSesion: boolean;
  incluirNotas: boolean;
  email?: string; // Email donde enviar el resumen
  createdAt: Date;
  updatedAt: Date;
}

// Resumen diario de sesiones
export interface ResumenDiario {
  id: string;
  userId?: string;
  fechaResumen: Date; // Fecha del día siguiente (del que se hace el resumen)
  sesiones: ResumenSesion[];
  enviado: boolean;
  fechaEnvio?: Date;
  leido: boolean;
  fechaLectura?: Date;
  createdAt: Date;
}

// Sesión en el resumen
export interface ResumenSesion {
  id: string;
  citaId: string;
  titulo: string;
  tipo: TipoCita;
  fechaInicio: Date;
  fechaFin: Date;
  clienteNombre?: string;
  clienteId?: string;
  ubicacion?: string;
  notas?: string;
  estado: EstadoCita;
}

// Notificación de sesión para entrenador
export interface NotificacionSesion {
  id: string;
  citaId: string;
  entrenadorId: string;
  clienteNombre: string;
  tipoSesion: TipoCita;
  tipoNotificacion: TipoNotificacionSesion; // Tipo de notificación
  fechaInicio: Date;
  fechaFin: Date;
  tiempoAnticipacionMinutos: number;
  fechaNotificacion: Date;
  estado: 'pendiente' | 'mostrada' | 'snoozed' | 'dismissed' | 'leida';
  fechaSnooze?: Date;
  vecesSnoozed: number;
  sonidoActivo: boolean;
  prioridad: 'baja' | 'media' | 'alta' | 'urgente'; // Prioridad de la notificación
  accionUrl?: string; // URL para actuar desde la notificación
  accionTexto?: string; // Texto del botón de acción (ej: "Ver sesión", "Confirmar")
  datosAdicionales?: Record<string, any>; // Datos adicionales para la acción
  createdAt: Date;
  leidaAt?: Date;
}

// Tipo de notificación de sesión
export type TipoNotificacionSesion = 
  | 'nueva-reserva' 
  | 'cancelacion' 
  | 'recordatorio' 
  | 'no-show' 
  | 'confirmacion'
  | 'reprogramacion';

// Configuración de notificación por tipo
export interface ConfiguracionTipoNotificacion {
  tipo: TipoNotificacionSesion;
  activo: boolean;
  push: boolean;
  sonido: boolean;
  sonidoPersonalizado?: string; // URL o nombre del sonido
  vibrar: boolean; // Solo para móvil
}

// Horario de no molestar
export interface HorarioNoMolestar {
  activo: boolean;
  horaInicio: string; // HH:mm (ej: "22:00")
  horaFin: string; // HH:mm (ej: "08:00")
  diasSemana: number[]; // 0 = Domingo, 6 = Sábado
  permitirUrgentes: boolean; // Si se permiten notificaciones urgentes durante el horario
}

// Configuración de notificaciones de sesión para entrenador
export interface ConfiguracionNotificacionesSesion {
  id: string;
  userId?: string;
  activo: boolean;
  tiempoAnticipacionMinutos: number; // Por defecto 10 minutos
  sonidoActivo: boolean;
  notificacionesPush: boolean;
  // Nuevas configuraciones
  tiposNotificacion: ConfiguracionTipoNotificacion[];
  horarioNoMolestar: HorarioNoMolestar;
  mostrarBadge: boolean; // Mostrar badge con contador
  createdAt: Date;
  updatedAt: Date;
}

// Estadísticas de confirmación por cliente
export interface EstadisticasConfirmacionCliente {
  clienteId: string;
  clienteNombre: string;
  totalSesiones: number;
  sesionesConfirmadas: number;
  sesionesCanceladas: number;
  sesionesPendientes: number;
  tasaConfirmacion: number; // Porcentaje (0-100)
  ultimaConfirmacion?: Date;
  ultimaCancelacion?: Date;
}

// ===== TIPOS PARA SINCRONIZACIÓN DE CALENDARIO =====

export type TipoCalendarioExterno = 'google' | 'outlook';

export type EstadoSincronizacion = 'conectado' | 'desconectado' | 'error' | 'sincronizando';

// Conexión con calendario externo
export interface ConexionCalendario {
  id: string;
  userId?: string;
  tipo: TipoCalendarioExterno;
  nombreCalendario: string; // Nombre del calendario en Google/Outlook
  calendarioId: string; // ID del calendario en el servicio externo
  estado: EstadoSincronizacion;
  sincronizacionBidireccional: boolean;
  bloquearAutomaticamente: boolean; // Si los eventos externos bloquean horarios automáticamente
  ultimaSincronizacion?: Date;
  errorSincronizacion?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Evento sincronizado desde calendario externo
export interface EventoCalendarioExterno {
  id: string;
  conexionId: string;
  eventoExternoId: string; // ID del evento en el calendario externo
  titulo: string;
  descripcion?: string;
  fechaInicio: Date;
  fechaFin: Date;
  ubicacion?: string;
  sincronizado: boolean; // Si se sincronizó correctamente
  ultimaSincronizacion?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Configuración de sincronización
export interface ConfiguracionSincronizacion {
  id: string;
  userId?: string;
  activo: boolean;
  sincronizacionBidireccional: boolean;
  bloquearAutomaticamente: boolean;
  intervaloActualizacion: number; // minutos
  createdAt: Date;
  updatedAt: Date;
}

// ===== TIPOS PARA ENLACES DE RESERVA PÚBLICA =====

export interface EnlaceReservaPublica {
  id: string;
  entrenadorId: string;
  slug: string; // Ej: "nombre-entrenador"
  nombrePersonalizado?: string; // Nombre que se muestra en el enlace
  activo: boolean;
  tiposSesionDisponibles: TipoCita[]; // Tipos de sesión que se pueden reservar
  mensajeBienvenida?: string;
  requiereConfirmacion: boolean; // Si requiere confirmación del entrenador
  mostrarHorariosDisponibles: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Reserva realizada desde enlace público
export interface ReservaPublica {
  id: string;
  enlaceId: string;
  entrenadorId: string;
  nombreCliente: string;
  emailCliente: string;
  telefonoCliente?: string;
  tipoSesion: TipoCita;
  fechaInicio: Date;
  fechaFin: Date;
  notas?: string;
  estado: 'pendiente' | 'confirmada' | 'cancelada';
  confirmadoAutomaticamente: boolean;
  fechaConfirmacion?: Date;
  citaId?: string; // ID de la cita creada en la agenda
  createdAt: Date;
  updatedAt: Date;
}

// ===== TIPOS PARA NOTAS DE SESIÓN =====

// Nota rápida agregada después de una sesión completada
export interface NotaSesion {
  id: string;
  citaId: string;
  clienteId?: string;
  clienteNombre?: string;
  fechaSesion: Date;
  queSeTrabajo: string; // Qué se trabajó
  comoSeSintio: string; // Cómo se sintió el cliente
  observaciones?: string; // Observaciones adicionales
  proximosPasos?: string; // Próximos pasos
  plantillaId?: string; // ID de la plantilla usada (opcional)
  createdAt: Date;
  updatedAt: Date;
  creadoPor?: string; // ID del entrenador que creó la nota
}

// Plantilla de nota frecuente
export interface PlantillaNotaSesion {
  id: string;
  nombre: string;
  descripcion?: string;
  queSeTrabajo: string;
  comoSeSintio: string;
  observaciones?: string;
  proximosPasos?: string;
  tipoSesion?: TipoCita[]; // Tipos de sesión para los que es aplicable
  userId?: string; // ID del usuario (entrenador) que creó la plantilla
  usoFrecuente: number; // Contador de uso
  createdAt: Date;
  updatedAt: Date;
}

// ===== TIPOS PARA ESTADOS DE SESIÓN Y NO-SHOWS =====

// Estadísticas de no-shows por cliente
export interface EstadisticasNoShowsCliente {
  clienteId: string;
  clienteNombre: string;
  totalSesiones: number;
  sesionesCompletadas: number;
  sesionesNoShow: number;
  sesionesCanceladas: number;
  tasaNoShow: number; // Porcentaje (0-100)
  tasaAsistencia: number; // Porcentaje (0-100)
  ultimaSesionNoShow?: Date;
  tieneAlerta: boolean; // Si tiene muchos no-shows
  createdAt: Date;
  updatedAt: Date;
}

// Excepción a la política de cancelación
export interface ExcepcionPoliticaCancelacion {
  id: string;
  clienteId?: string; // Si es para un cliente específico
  clienteNombre?: string;
  tipo: 'cliente' | 'tipo-sesion' | 'situacion'; // Tipo de excepción
  tipoSesion?: TipoCita; // Si es para un tipo de sesión específico
  descripcion?: string; // Descripción de la excepción
  aplicaPenalizacion: boolean; // Si aplica penalización o no
  tiempoMinimoHoras?: number; // Tiempo mínimo personalizado (opcional)
  activa: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Registro de cancelación tardía
export interface RegistroCancelacionTardia {
  id: string;
  citaId: string;
  clienteId?: string;
  clienteNombre?: string;
  fechaSesion: Date;
  fechaCancelacion: Date;
  horasAnticipacion: number; // Horas antes de la sesión que se canceló
  tiempoMinimoRequerido: number; // Tiempo mínimo requerido por la política
  esTardia: boolean; // Si fue cancelación tardía
  penalizacionAplicada?: 'advertencia' | 'cobro' | 'bloqueo' | 'ninguna';
  excepcionAplicada?: string; // ID de la excepción aplicada
  motivoCancelacion?: MotivoCancelacion;
  notas?: string;
  createdAt: Date;
}

// Estadísticas de cumplimiento de política de cancelación
export interface EstadisticasCumplimientoPolitica {
  periodo: string; // "Enero 2024", etc.
  totalCancelaciones: number;
  cancelacionesTardias: number;
  cancelacionesOnTime: number;
  tasaCumplimiento: number; // Porcentaje (0-100)
  promedioHorasAnticipacion: number;
  penalizacionesAplicadas: number;
  excepcionesAplicadas: number;
  porCliente: {
    clienteId: string;
    clienteNombre: string;
    totalCancelaciones: number;
    cancelacionesTardias: number;
    tasaCumplimiento: number;
  }[];
}

// Configuración de política de cancelación
export interface ConfiguracionPoliticaCancelacion {
  id: string;
  userId?: string;
  activo: boolean;
  tiempoMinimoCancelacionHoras: number; // Horas mínimas antes de la sesión para cancelar sin penalización
  penalizacionNoShow: boolean; // Si se aplica penalización por no-show
  tipoPenalizacion?: 'advertencia' | 'cobro' | 'bloqueo'; // Tipo de penalización
  maxNoShowsAntesAlerta: number; // Número máximo de no-shows antes de alertar
  maxNoShowsAntesPenalizacion: number; // Número máximo de no-shows antes de penalizar
  autoMarcarNoShow: boolean; // Si se marca automáticamente como no-show después de X minutos
  minutosEsperaAutoNoShow: number; // Minutos de espera antes de marcar como no-show automáticamente
  // Nuevos campos para User Story 1
  notificarPoliticaAlCrear: boolean; // Si se notifica la política al cliente al crear sesión
  mensajePolitica?: string; // Mensaje predefinido de la política para enviar a clientes
  aplicarPenalizacionCancelacionTardia: boolean; // Si se aplica penalización por cancelación tardía
  tipoPenalizacionCancelacionTardia?: 'advertencia' | 'cobro' | 'bloqueo'; // Tipo de penalización para cancelaciones tardías
  excepciones: ExcepcionPoliticaCancelacion[]; // Lista de excepciones
  createdAt: Date;
  updatedAt: Date;
}

// Alerta de no-show para un cliente
export interface AlertaNoShow {
  id: string;
  clienteId: string;
  clienteNombre: string;
  tipoAlerta: 'advertencia' | 'critica'; // Tipo de alerta
  mensaje: string;
  noShowsCount: number;
  fechaUltimoNoShow: Date;
  activa: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Tendencia de no-shows por mes (últimos 3 meses)
export interface TendenciaNoShows {
  mes: string; // Ej: "Enero 2024"
  mesNumero: number; // 1-12
  anio: number;
  totalSesiones: number;
  sesionesCompletadas: number;
  sesionesNoShow: number;
  sesionesCanceladas: number;
  tasaNoShow: number;
  tasaAsistencia: number;
}

// Sugerencia de conversación para cliente con baja adherencia
export interface SugerenciaConversacion {
  tipo: 'advertencia' | 'mejora' | 'recompensa';
  titulo: string;
  mensaje: string;
  puntosClave: string[];
  tono: 'amigable' | 'profesional' | 'firme';
}

// Estadísticas extendidas de no-shows por cliente (incluye tendencia y sugerencias)
export interface EstadisticasNoShowsClienteExtendida extends EstadisticasNoShowsCliente {
  tendenciaUltimos3Meses: TendenciaNoShows[];
  sugerenciaConversacion?: SugerenciaConversacion;
  porcentajeAdherencia: number; // Porcentaje de adherencia general
}

// ===== TIPOS PARA OCUPACIÓN Y ANALYTICS =====

// Métrica de ocupación por período
export interface MetricasOcupacion {
  periodo: string; // "Semana 1", "Enero 2024", etc.
  fechaInicio: Date;
  fechaFin: Date;
  horasDisponibles: number; // Horas disponibles en el período
  horasTrabajadas: number; // Horas trabajadas (sesiones completadas)
  horasReservadas: number; // Horas reservadas (sesiones confirmadas)
  porcentajeOcupacion: number; // (horasTrabajadas / horasDisponibles) * 100
  totalSesiones: number;
  sesionesCompletadas: number;
  sesionesConfirmadas: number;
  sesionesCanceladas: number;
  ingresosEstimados: number;
}

// Comparativa de ocupación entre períodos
export interface ComparativaOcupacion {
  periodoActual: MetricasOcupacion;
  periodoAnterior: MetricasOcupacion;
  diferenciaPorcentaje: number; // Diferencia en porcentaje de ocupación
  diferenciaHoras: number; // Diferencia en horas trabajadas
  tendencia: 'subiendo' | 'bajando' | 'estable';
}

// Configuración de meta de ocupación
export interface ConfiguracionMetaOcupacion {
  id: string;
  userId?: string;
  metaSemanal: number; // Porcentaje de ocupación semanal objetivo (0-100)
  metaMensual: number; // Porcentaje de ocupación mensual objetivo (0-100)
  precioPromedioSesion: number; // Precio promedio por sesión para proyección de ingresos
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Proyección de ingresos basada en ocupación
export interface ProyeccionIngresos {
  periodo: string;
  ocupacionActual: number;
  ocupacionProyectada: number;
  ingresosActuales: number;
  ingresosProyectados: number;
  diferenciaIngresos: number;
  metaOcupacion: number;
  horasNecesariasParaMeta: number;
  sesionesNecesariasParaMeta: number;
}

// ===== TIPOS PARA DASHBOARD FINANCIERO =====

// Estado de pago de una sesión
export type EstadoPago = 'pagado' | 'pendiente' | 'vencido' | 'cancelado';

// Información de pago de una sesión
export interface PagoSesion {
  id: string;
  citaId: string;
  clienteId: string;
  clienteNombre: string;
  fechaSesion: Date;
  tipoSesion: TipoCita;
  monto: number;
  estado: EstadoPago;
  fechaPago?: Date;
  metodoPago?: 'efectivo' | 'tarjeta' | 'transferencia' | 'otro';
  notas?: string;
  fechaVencimiento?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Resumen financiero del mes
export interface ResumenFinanciero {
  mes: string; // "Enero 2024"
  mesNumero: number; // 1-12
  anio: number;
  ingresosTotales: number; // Ingresos cobrados
  ingresosPendientes: number; // Ingresos pendientes de cobro
  sesionesCobradas: number; // Número de sesiones pagadas
  sesionesPendientes: number; // Número de sesiones pendientes de pago
  sesionesVencidas: number; // Número de sesiones con pago vencido
  proyeccionMensual: number; // Proyección de ingresos del mes
  promedioSesion: number; // Precio promedio por sesión
  crecimientoPorcentaje?: number; // Porcentaje de crecimiento respecto al mes anterior
}

// Proyección financiera
export interface ProyeccionFinanciera {
  periodo: string; // "Enero 2024"
  ingresosActuales: number; // Ingresos hasta la fecha
  ingresosProyectados: number; // Proyección total del mes
  sesionesProgramadas: number; // Sesiones programadas restantes
  sesionesCobradas: number; // Sesiones ya cobradas
  ingresoPromedioDiario: number; // Ingreso promedio por día
  diasRestantes: number; // Días restantes en el mes
  tendencia: 'subiendo' | 'bajando' | 'estable'; // Tendencia de ingresos
}

// Alerta de pago pendiente
export interface AlertaPagoPendiente {
  id: string;
  citaId: string;
  clienteId: string;
  clienteNombre: string;
  fechaSesion: Date;
  monto: number;
  diasVencido: number; // Días desde que venció el pago
  estado: 'pendiente' | 'vencido' | 'urgente';
  fechaVencimiento?: Date;
  prioridad: 'baja' | 'media' | 'alta' | 'critica';
}

// Filtros para dashboard financiero
export interface FiltrosFinancieros {
  fechaInicio?: Date;
  fechaFin?: Date;
  clienteId?: string;
  estadoPago?: EstadoPago;
  tipoSesion?: TipoCita;
}

// Estadísticas financieras por cliente
export interface EstadisticasFinancierasCliente {
  clienteId: string;
  clienteNombre: string;
  totalIngresos: number;
  sesionesPagadas: number;
  sesionesPendientes: number;
  montoPendiente: number;
  promedioSesion: number;
  ultimoPago?: Date;
  deudaTotal?: number;
}

// ===== TIPOS PARA LISTA DE ESPERA =====

// Estado de una entrada en la lista de espera
export type EstadoListaEspera = 'activa' | 'notificada' | 'asignada' | 'cancelada' | 'expirada';

// Entrada en la lista de espera
export interface EntradaListaEspera {
  id: string;
  entrenadorId: string;
  clienteId: string;
  clienteNombre: string;
  clienteEmail?: string;
  clienteTelefono?: string;
  diaSemana: number; // 0 = Domingo, 6 = Sábado
  horaInicio: string; // HH:mm
  horaFin: string; // HH:mm
  fechaSolicitud: Date; // Fecha en que el cliente se apuntó
  estado: EstadoListaEspera;
  prioridad: number; // Orden de prioridad (menor número = mayor prioridad)
  fechaNotificacion?: Date; // Fecha en que se notificó al cliente
  fechaAsignacion?: Date; // Fecha en que se asignó el slot
  citaId?: string; // ID de la cita asignada (si se asignó)
  fechaExpiracion?: Date; // Fecha de expiración de la solicitud
  notas?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Horario popular (horario con más solicitudes en lista de espera)
export interface HorarioPopular {
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
  numeroSolicitudes: number; // Número de clientes en lista de espera
  ultimaAsignacion?: Date; // Última vez que se asignó este horario
  frecuenciaAsignacion: number; // Número de veces que se ha asignado este horario
}

// Notificación de slot liberado
export interface NotificacionSlotLiberado {
  id: string;
  entradaListaEsperaId: string;
  clienteId: string;
  clienteNombre: string;
  fechaSlot: Date;
  horaInicio: string;
  horaFin: string;
  enviada: boolean;
  fechaEnvio?: Date;
  leida: boolean;
  fechaLectura?: Date;
  metodoNotificacion: 'email' | 'sms' | 'whatsapp' | 'push';
  fechaExpiracion: Date; // Tiempo límite para que el cliente confirme
  confirmada: boolean;
  fechaConfirmacion?: Date;
  createdAt: Date;
}

// Configuración de lista de espera
export interface ConfiguracionListaEspera {
  id: string;
  entrenadorId: string;
  activo: boolean;
  tiempoRespuestaHoras: number; // Tiempo que el cliente tiene para responder (ej: 24 horas)
  notificacionAutomatica: boolean; // Si se notifica automáticamente cuando se libera un slot
  metodoNotificacion: 'email' | 'sms' | 'whatsapp' | 'push';
  maxEntradasPorCliente: number; // Máximo número de horarios en lista de espera por cliente
  diasValidez: number; // Días de validez de una entrada en lista de espera
  createdAt: Date;
  updatedAt: Date;
}

// Resumen de lista de espera
export interface ResumenListaEspera {
  totalEntradas: number;
  entradasActivas: number;
  entradasNotificadas: number;
  entradasAsignadas: number;
  horariosPopulares: HorarioPopular[];
  proximasNotificaciones: number; // Número de clientes próximos a ser notificados
}

