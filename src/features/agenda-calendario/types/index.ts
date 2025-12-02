// ===== TIPOS AUXILIARES Y ENUMS =====

/**
 * Tipo de cita/sesión disponible en el sistema
 * Reutilizable desde otros módulos (Clientes, Facturación, etc.)
 */
export type TipoCita = 'sesion-1-1' | 'videollamada' | 'evaluacion' | 'clase-colectiva' | 'fisioterapia' | 'mantenimiento' | 'otro';

/**
 * Estado de una cita en el sistema
 * Define el ciclo de vida completo de una cita desde su creación hasta su finalización
 */
export type EstadoCita = 'reservada' | 'confirmada' | 'enCurso' | 'completada' | 'cancelada' | 'noShow';

/**
 * Canal por el cual se envía un recordatorio
 * Permite múltiples canales para mayor flexibilidad
 */
export type CanalRecordatorio = 'email' | 'sms' | 'whatsapp' | 'push';

/**
 * Tipo de bloqueo de agenda
 * Define diferentes razones por las que se puede bloquear tiempo en la agenda
 */
export type TipoBloqueoAgenda = 'vacaciones' | 'mantenimiento' | 'bloqueoManual' | 'feriado' | 'calendario-externo' | 'otro';

/**
 * Entidad a la que se aplica un bloqueo o configuración
 * Permite aplicar reglas a nivel de entrenador o centro/gimnasio
 */
export type AplicableA = 'entrenador' | 'centro';

export type VistaCalendario = 'mes' | 'semana' | 'dia';
export type TipoRecurrencia = 'diaria' | 'semanal' | 'quincenal' | 'mensual' | 'ninguna';
export type MotivoCancelacion = 'cliente' | 'entrenador' | 'otro';
export type EstadoConfirmacionCliente = 'pendiente' | 'confirmada' | 'cancelada' | 'reprogramacion-solicitada';

// ===== INTERFACES PRINCIPALES =====

/**
 * Representa un patrón de recurrencia para citas
 * Permite definir citas que se repiten automáticamente siguiendo un patrón
 * Reutilizable desde otros módulos que necesiten manejar eventos recurrentes
 */
export interface Recurrencia {
  /** Tipo de recurrencia: diaria, semanal, quincenal, mensual */
  tipo: TipoRecurrencia;
  /** Intervalo de repetición (ej: cada 2 semanas, cada 3 meses) */
  intervalo?: number;
  /** Días de la semana en que se repite (0 = Domingo, 6 = Sábado) - Solo para tipo 'semanal' */
  diasSemana?: number[];
  /** Fecha de inicio de la recurrencia */
  fechaInicio: Date;
  /** Fecha de fin opcional - undefined significa "hasta cancelar" */
  fechaFinOpcional?: Date;
  /** ID único para todas las sesiones de la misma serie */
  serieId?: string;
  /** Fechas excepcionales donde no se aplica la recurrencia */
  excepciones?: Date[];
}

/**
 * Historial de cambios realizados en una cita
 * Permite auditar todas las modificaciones realizadas
 */
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

/**
 * Representa una cita o sesión en el sistema de agenda
 * Interfaz central que puede ser reutilizada desde módulos de Clientes, Facturación, etc.
 * Contiene toda la información necesaria para gestionar una cita completa
 */
export interface Cita {
  /** Identificador único de la cita */
  id: string;
  /** Título o nombre de la cita */
  titulo: string;
  /** Descripción adicional de la cita */
  descripcion?: string;
  /** Cliente asociado a la cita */
  cliente?: {
    id: string;
    nombre: string;
    email?: string;
    telefono?: string;
  };
  /** Entrenador asignado a la cita */
  entrenador?: {
    id: string;
    nombre: string;
  };
  /** Fecha y hora de inicio de la cita */
  fechaInicio: Date;
  /** Fecha y hora de fin de la cita */
  fechaFin: Date;
  /** 
   * ID del tipo de sesión (referencia a SesionTipo)
   * 
   * VÍNCULO CON SESIONTIPO:
   * Este campo vincula la cita con un tipo de sesión configurado (SesionTipo).
   * El tipo de sesión define características como duración, precio, capacidad,
   * color para el calendario, modalidad (online/presencial) y si permite lista de espera.
   * 
   * Al crear una cita, se puede especificar el tipoSesionId para heredar automáticamente
   * estas configuraciones. Si no se especifica, la cita puede tener valores personalizados.
   * 
   * Ejemplo:
   * ```typescript
   * const cita: Cita = {
   *   id: 'c1',
   *   tipoSesionId: 'tipo-entrenamiento-1-1', // Referencia al SesionTipo
   *   fechaInicio: new Date('2024-01-15T10:00:00'),
   *   fechaFin: new Date('2024-01-15T11:00:00'), // 60 min según duración del tipo
   *   // ... otros campos
   * };
   * ```
   */
  tipoSesionId?: string;
  /** Estado actual de la cita */
  estado: EstadoCita;
  /** Ubicación donde se realizará la cita */
  ubicacion?: string;
  /** Notas adicionales sobre la cita */
  notas?: string;
  /** Tags o etiquetas para categorizar la cita */
  tags?: string[];
  /** Fuente de la reserva (manual, enlace público, API, etc.) */
  fuenteReserva?: 'manual' | 'enlacePublico' | 'api' | 'sincronizacion' | 'otro';
  /** Recurrencia asociada si la cita es parte de una serie */
  recurrencia?: Recurrencia;
  /** Historial de cambios realizados en la cita */
  historial?: HistorialCambio[];
  /** Motivo de cancelación si aplica */
  motivoCancelacion?: MotivoCancelacion;
  /** Detalle del motivo de cancelación */
  motivoCancelacionDetalle?: string;
  /** Confirmación del cliente */
  confirmacionCliente?: EstadoConfirmacionCliente;
  /** Fecha de confirmación del cliente */
  fechaConfirmacionCliente?: Date;
  /** Solicitud de reprogramación si existe */
  solicitudReprogramacion?: SolicitudReprogramacion;
  /** Si se debe sincronizar con calendario externo */
  sincronizarCalendario?: boolean;
  /** ID del evento en calendario externo */
  eventoExternoId?: string;
  /** ID de la conexión de calendario usada */
  conexionCalendarioId?: string;
  /** Indicador de asistencia para historial */
  asistencia?: 'asistio' | 'falto' | 'cancelado';
  /** Capacidad máxima para clases colectivas */
  capacidadMaxima?: number;
  /** Número de inscritos en clases colectivas */
  inscritos?: number;
  /** Si se ha enviado recordatorio */
  recordatorioEnviado?: boolean;
  
  // Campos legacy para compatibilidad (deprecated - usar cliente y entrenador)
  /** @deprecated Usar cliente.id */
  clienteId?: string;
  /** @deprecated Usar cliente.nombre */
  clienteNombre?: string;
  /** @deprecated Usar entrenador.id */
  instructorId?: string;
  /** @deprecated Usar entrenador.nombre */
  instructorNombre?: string;
  /** @deprecated Usar tipoSesionId */
  tipo?: TipoCita;
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

/**
 * Representa un bloqueo de tiempo en la agenda
 * Permite reservar períodos de tiempo que no están disponibles para citas
 * Reutilizable para gestionar disponibilidad desde otros módulos
 */
export interface BloqueoAgenda {
  /** Identificador único del bloqueo */
  id: string;
  /** Título del bloqueo */
  titulo: string;
  /** Descripción adicional del bloqueo */
  descripcion?: string;
  /** Motivo del bloqueo */
  motivo?: string;
  /** Fecha y hora de inicio del bloqueo */
  fechaInicio: Date;
  /** Fecha y hora de fin del bloqueo */
  fechaFin: Date;
  /** Tipo de bloqueo */
  tipo: TipoBloqueoAgenda;
  /** Entidad a la que se aplica el bloqueo (entrenador o centro) */
  aplicableA: AplicableA;
  /** ID de la entidad específica (entrenadorId o centroId) */
  aplicableAId?: string;
  /** Si el bloqueo es recurrente */
  recurrente?: boolean;
  /** Si bloquea el día completo o solo un rango de horas */
  bloqueoCompleto: boolean;
  /** Hora de inicio en formato HH:mm (solo si bloqueoCompleto = false) */
  horaInicio?: string;
  /** Hora de fin en formato HH:mm (solo si bloqueoCompleto = false) */
  horaFin?: string;
  /** ID del evento externo si viene de sincronización */
  eventoExternoId?: string;
  /** ID de la conexión de calendario */
  conexionCalendarioId?: string;
}

/**
 * Representa el horario de trabajo de un entrenador o centro
 * Define los períodos de tiempo disponibles para agendar citas
 * Reutilizable desde módulos de disponibilidad y planificación
 */
export interface HorarioTrabajo {
  /** Identificador único del horario */
  id: string;
  /** Día de la semana (0 = Domingo, 6 = Sábado) */
  diaSemana: number;
  /** Hora de inicio en formato HH:mm */
  horaInicio: string;
  /** Hora de fin en formato HH:mm */
  horaFin: string;
  /** Pausas durante el horario (ej: almuerzo) */
  pausas?: Array<{
    horaInicio: string;
    horaFin: string;
  }>;
  /** Si el horario está activo */
  activo: boolean;
  /** Entidad a la que se aplica el horario */
  aplicableA: AplicableA;
  /** ID de la entidad específica (entrenadorId o centroId) */
  aplicableAId?: string;
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

/**
 * Representa un recordatorio para una cita
 * Permite notificar a clientes y entrenadores sobre citas próximas
 * Reutilizable desde módulos de notificaciones y comunicación
 * 
 * ESTADO Y CANAL:
 * - El recordatorio incluye estado (activo/inactivo) mediante el campo `activo`
 * - El recordatorio incluye estado del canal mediante el campo `canalActivo`
 * - El recordatorio incluye el canal de envío mediante el campo `tipo` (CanalRecordatorio)
 * - Los canales disponibles son: 'email', 'sms', 'whatsapp', 'push'
 */
export interface Recordatorio {
  /** Identificador único del recordatorio */
  id: string;
  /** ID de la cita asociada */
  citaId: string;
  /** Tipo de canal de recordatorio (email, sms, whatsapp, push) */
  tipo: CanalRecordatorio;
  /** Offset en minutos antes de la cita para enviar el recordatorio */
  offsetMinutos: number;
  /** Plantilla de mensaje a usar (puede contener variables) */
  plantilla?: string;
  /** Si el canal está activo para este recordatorio (estado del canal) */
  canalActivo: boolean;
  /** Si el recordatorio está activo (estado general: activo/inactivo) */
  activo: boolean;
  /** Si el recordatorio ya fue enviado */
  enviado?: boolean;
  /** Fecha de envío del recordatorio */
  fechaEnvio?: Date;
  /** Si el recordatorio fue leído */
  leido?: boolean;
  /** Fecha de lectura del recordatorio */
  fechaLectura?: Date;
  /** Error en caso de fallo al enviar */
  error?: string;
  
  // Campo legacy para compatibilidad
  /** @deprecated Usar offsetMinutos */
  tiempoAnticipacion?: number;
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

/**
 * Representa un tipo de sesión configurable
 * Define las características de un tipo de sesión que puede ser reutilizado
 * Reutilizable desde módulos de servicios, facturación y reservas
 * 
 * VÍNCULO CON CITAS:
 * Las citas (Cita) se vinculan a un tipo de sesión mediante el campo `tipoSesionId`.
 * Este campo permite que cada cita herede las configuraciones del tipo de sesión
 * (duración, precio, capacidad, color, etc.) y facilita la gestión centralizada
 * de los diferentes tipos de servicios ofrecidos.
 * 
 * Ejemplo de uso:
 * ```typescript
 * const cita: Cita = {
 *   id: 'c1',
 *   tipoSesionId: 'tipo-entrenamiento-1-1', // Referencia al SesionTipo
 *   fechaInicio: new Date(),
 *   // ... otros campos
 * };
 * ```
 */
export interface SesionTipo {
  /** Identificador único del tipo de sesión */
  id: string;
  /** Nombre del tipo de sesión */
  nombre: string;
  /** Duración estándar en minutos */
  duracion: number;
  /** Capacidad máxima de participantes (1 para sesiones 1-1) */
  capacidad: number;
  /** Precio estándar del tipo de sesión */
  precio?: number;
  /** Color para visualización en calendarios (formato hex: #RRGGBB) */
  color?: string;
  /** Si permite lista de espera cuando está lleno */
  permiteListaEspera: boolean;
  /** Modalidad de la sesión: online o presencial */
  modalidad: 'online' | 'presencial';
  /** Notas adicionales sobre el tipo de sesión */
  notas?: string;
  /** Fecha de creación */
  createdAt: Date;
  /** Fecha de última actualización */
  updatedAt: Date;
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

/**
 * Proveedor de calendario externo
 * Alias de TipoCalendarioExterno para mayor claridad semántica
 * @see TipoCalendarioExterno
 */
export type ProveedorCalendario = TipoCalendarioExterno;

export type EstadoSincronizacion = 'conectado' | 'desconectado' | 'error' | 'sincronizando';

/**
 * Contexto para operaciones de sincronización de calendario
 * Contiene información del usuario y entorno necesaria para las operaciones
 */
export interface ContextoSincronizacion {
  userId?: string;
  role?: 'entrenador' | 'gimnasio';
  entrenadorId?: string;
  centroId?: string;
}

/**
 * Representa un calendario externo conectado
 * Alias de ConexionCalendario para mayor claridad semántica en funciones de integración
 * @see ConexionCalendario
 */
export type CalendarioExterno = ConexionCalendario;

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

/**
 * Política de cancelación para sesiones
 * Define las reglas de cancelación, penalizaciones y excepciones aplicables
 * 
 * Esta interfaz representa la configuración completa de políticas de cancelación
 * que controla cómo se manejan las cancelaciones tardías y los no-shows.
 * Incluye:
 * - Plazo mínimo para cancelar sin coste
 * - Penalizaciones por no-show
 * - Penalizaciones por cancelación tardía
 * - Excepciones a la política general
 * - Configuraciones de notificación y automatización
 */
export interface PoliticaCancelacion {
  id: string;
  userId?: string;
  activo: boolean;
  tiempoMinimoCancelacionHoras: number; // Plazo mínimo para cancelar sin coste (en horas)
  penalizacionNoShow: boolean; // Si se aplica penalización por no-show
  tipoPenalizacion?: 'advertencia' | 'cobro' | 'bloqueo'; // Tipo de penalización aplicada
  maxNoShowsAntesAlerta: number; // Número máximo de no-shows antes de generar alerta
  maxNoShowsAntesPenalizacion: number; // Número máximo de no-shows antes de aplicar penalización
  autoMarcarNoShow: boolean; // Si se marca automáticamente como no-show
  minutosEsperaAutoNoShow: number; // Minutos de espera antes de auto-marcar no-show
  notificarPoliticaAlCrear: boolean; // Si se notifica la política al crear sesión
  mensajePolitica?: string; // Mensaje predefinido de la política para clientes
  aplicarPenalizacionCancelacionTardia: boolean; // Si se aplica penalización por cancelación tardía
  tipoPenalizacionCancelacionTardia?: 'advertencia' | 'cobro' | 'bloqueo'; // Tipo de penalización para cancelaciones tardías
  excepciones: ExcepcionPoliticaCancelacion[]; // Lista de excepciones a la política
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Configuración de política de cancelación
 * Alias de PoliticaCancelacion para compatibilidad con código existente
 * 
 * @see PoliticaCancelacion - Interfaz base que define las reglas de cancelación
 */
export type ConfiguracionPoliticaCancelacion = PoliticaCancelacion;

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

/**
 * Representa métricas de ocupación de la agenda
 * Proporciona información sobre el uso del tiempo y la eficiencia de la agenda
 * Reutilizable desde módulos de analytics, reportes y dashboards
 */
export interface MetricasOcupacion {
  /** Período de análisis (ej: "Semana 1", "Enero 2024") */
  periodo: string;
  /** Fecha de inicio del período analizado */
  fechaInicio: Date;
  /** Fecha de fin del período analizado */
  fechaFin: Date;
  /** Ocupación media del período (porcentaje) */
  ocupacionMedia: number;
  /** Ocupación desglosada por día */
  ocupacionPorDia?: Array<{
    fecha: Date;
    ocupacion: number;
    horasTrabajadas: number;
    horasDisponibles: number;
  }>;
  /** Número de no-shows en el período */
  noShows: number;
  /** Número de cancelaciones en el período */
  cancelaciones: number;
  /** Ingresos estimados por sesión en el período */
  ingresosPorSesion?: number;
  /** Horas disponibles en el período */
  horasDisponibles: number;
  /** Horas trabajadas (sesiones completadas) */
  horasTrabajadas: number;
  /** Horas reservadas (sesiones confirmadas) */
  horasReservadas: number;
  /** Porcentaje de ocupación (horasTrabajadas / horasDisponibles) * 100 */
  porcentajeOcupacion: number;
  /** Total de sesiones en el período */
  totalSesiones: number;
  /** Sesiones completadas */
  sesionesCompletadas: number;
  /** Sesiones confirmadas */
  sesionesConfirmadas: number;
  /** Sesiones canceladas */
  sesionesCanceladas: number;
  /** Ingresos estimados totales */
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

// Dashboard financiero específico para agenda
export interface DashboardFinancieroAgenda {
  periodo: string;
  fechaInicio: Date;
  fechaFin: Date;
  // KPIs principales
  ingresosTotales: number;
  ingresosPorSesion: number;
  ticketMedio: number;
  totalSesiones: number;
  sesionesCompletadas: number;
  sesionesCanceladas: number;
  tasaCancelacion: number; // Porcentaje (0-100)
  noShows: number;
  tasaNoShow: number; // Porcentaje (0-100)
  // Métricas de rendimiento
  ingresosPendientes: number;
  sesionesPendientes: number;
  ocupacionPromedio: number; // Porcentaje
  horasTrabajadas: number;
  horasDisponibles: number;
  // Comparativas
  crecimientoIngresos?: number; // Porcentaje vs período anterior
  crecimientoSesiones?: number; // Porcentaje vs período anterior
  tendencia: 'subiendo' | 'bajando' | 'estable';
  // Desglose por tipo de sesión
  ingresosPorTipoSesion: Array<{
    tipo: TipoCita;
    cantidad: number;
    ingresos: number;
    porcentaje: number;
  }>;
}

// Tipos para funciones de métricas
export interface RangoFechas {
  fechaInicio: Date;
  fechaFin: Date;
}

export interface ContextoMetricas {
  userId?: string;
  role?: 'entrenador' | 'gimnasio';
  entrenadorId?: string;
  centroId?: string;
}

// ===== TIPOS PARA LISTA DE ESPERA =====

// Estado de una entrada en la lista de espera
export type EstadoListaEspera = 'activa' | 'notificada' | 'asignada' | 'cancelada' | 'expirada';

/**
 * Entrada en la lista de espera de sesiones
 * 
 * INTEGRACIÓN CON GESTORLISTAESPERA.TSX:
 * Este tipo es utilizado por el componente GestorListaEspera.tsx para mostrar
 * y gestionar las entradas de la lista de espera. El componente llama a las
 * funciones mock de listaEspera.ts para obtener, agregar, eliminar y asignar
 * entradas de la lista de espera.
 * 
 * INTEGRACIÓN CON CREACIÓN/ACTUALIZACIÓN DE CITA:
 * Cuando se asigna un hueco desde la lista de espera (mediante asignarHuecoDesdeListaEspera),
 * se crea una nueva Cita en el sistema. La entrada de lista de espera se marca como
 * 'asignada' y se vincula con el citaId de la cita creada. Esto permite rastrear
 * qué citas fueron originadas desde la lista de espera.
 */
export interface EntradaListaEspera {
  /** Identificador único de la entrada */
  id: string;
  /** Información del cliente que solicita la sesión */
  cliente: {
    id: string;
    nombre: string;
    email?: string;
    telefono?: string;
  };
  /** Tipo de sesión solicitada (sesion-1-1, videollamada, evaluacion, etc.) */
  tipoSesion: TipoCita;
  /** Fecha deseada por el cliente para la sesión */
  fechaDeseada: Date;
  /** Prioridad de la entrada (menor número = mayor prioridad) */
  prioridad: number;
  /** Estado actual de la entrada en la lista de espera */
  estado: EstadoListaEspera;
  /** Notas adicionales sobre la solicitud */
  notas?: string;
  /** ID de la cita asignada (si se asignó un hueco) */
  citaId?: string;
  /** Fecha en que se asignó el slot (si aplica) */
  fechaAsignacion?: Date;
  /** Fecha de creación de la entrada */
  createdAt: Date;
  /** Fecha de última actualización */
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

// ===== TIPOS PARA SLOTS DISPONIBLES =====

/**
 * Representa un slot de tiempo disponible para agendar
 * Usado en: calcularSlotsDisponibles, GestorHorarios, ConfiguradorHorariosTrabajo
 */
export interface SlotDisponible {
  /** Fecha del slot */
  fecha: Date;
  /** Hora de inicio del slot (HH:mm) */
  horaInicio: string;
  /** Hora de fin del slot (HH:mm) */
  horaFin: string;
  /** Duración del slot en minutos */
  duracionMinutos: number;
  /** Si el slot está disponible */
  disponible: boolean;
  /** Motivo por el que no está disponible (si aplica) */
  motivoNoDisponible?: string;
}

