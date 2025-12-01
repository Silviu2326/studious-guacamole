/**
 * Tipos TypeScript principales del módulo Eventos y Retos
 * 
 * Este módulo gestiona eventos presenciales, virtuales y retos.
 * Se relaciona con:
 * - Agenda: sincronización de eventos en calendarios
 * - Reservas: gestión de inscripciones y capacidad
 * - Clientes: participantes y tipos de cliente (regular, premium, vip)
 * 
 * SERVICIOS DISPONIBLES:
 * - calendarioSyncService: Soporta sincronización con Google Calendar
 * - checklistPreparacionService: Soporta gestión de checklists de preparación
 * - progresoRetosService: Soporta dashboards de retos y seguimiento de progreso
 */

// ============================================================================
// ENUMS Y UNION TYPES
// ============================================================================

/**
 * Tipos de evento disponibles
 */
export type EventType = 'presencial' | 'virtual' | 'reto';

/**
 * Estados del ciclo de vida de un evento
 */
export type EventState = 'borrador' | 'programado' | 'enCurso' | 'finalizado' | 'cancelado';

/**
 * Estados de inscripción de un participante
 */
export type ParticipantRegistrationState = 
  | 'pendiente' 
  | 'confirmado' 
  | 'cancelado' 
  | 'listaEspera' 
  | 'noShow' 
  | 'asistio';

/**
 * Tipos de cliente para diferenciación de precios
 */
export type ClientType = 'regular' | 'premium' | 'vip';

/**
 * Origen de la inscripción del participante
 */
export type RegistrationOrigin = 'manual' | 'enlacePublico' | 'importacion';

/**
 * Tipo de insight o métrica analítica
 */
export type InsightType = 
  | 'asistencia' 
  | 'ingresos' 
  | 'satisfaccion' 
  | 'retencion' 
  | 'conversion' 
  | 'participacion';

// ============================================================================
// INTERFACES DE EVENTOS Y RETOS
// ============================================================================

/**
 * Interfaz base para eventos (presenciales, virtuales y retos)
 * 
 * Relación con otros módulos:
 * - Agenda: fechaInicio/fechaFin se sincronizan con calendarios
 * - Reservas: capacidadMaxima y listaEsperaActiva gestionan disponibilidad
 * - Clientes: preciosPorTipoCliente diferencia precios según tipo de cliente
 */
export interface Event {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: EventType;
  estado: EventState;
  fechaInicio: Date;
  fechaFin?: Date;
  ubicacionId?: string; // Referencia a Location (solo para eventos presenciales)
  plataformaVirtual?: string; // Plataforma usada para eventos virtuales (Zoom, Teams, etc.)
  enlaceVirtual?: string; // URL de acceso para eventos virtuales
  capacidadMaxima: number;
  listaEsperaActiva: boolean;
  preciosPorTipoCliente: Record<ClientType, number>; // Precios por tipo de cliente
  esGratuito: boolean;
  tags: string[]; // Etiquetas para categorización y búsqueda
  creadoEn: Date;
  actualizadoEn: Date;
}

/**
 * Interfaz específica para retos (challenges)
 * 
 * Hereda o extiende Event con campos adicionales para gestión de retos:
 * - Duración en días
 * - Objetivos y métricas de seguimiento
 * - Sistema de premios
 * - Reglas específicas
 * - Frecuencia de reportes de progreso
 * 
 * Relación con otros módulos:
 * - Clientes: metricasSeguimiento permite tracking individual de progreso
 * - Agenda: duracionDias se refleja en múltiples eventos en calendario
 */
export interface ChallengeEvent extends Event {
  duracionDias: number;
  objetivos: string[]; // Objetivos del reto
  metricasSeguimiento: ChallengeMetric[]; // Métricas configurables para seguimiento
  premios: Prize[]; // Sistema de premios y reconocimientos
  reglas: string[]; // Reglas específicas del reto
  frecuenciaReportes: 'diario' | 'semanal' | 'alFinalizar'; // Frecuencia de reportes de progreso
}

/**
 * Métrica configurable para seguimiento en retos
 */
export interface ChallengeMetric {
  id: string;
  nombre: string;
  tipo: 'numero' | 'porcentaje' | 'boolean' | 'texto';
  unidad?: string;
  objetivo?: number | string;
  requerida: boolean;
  orden: number;
}

/**
 * Premio o reconocimiento en un reto
 */
export interface Prize {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: 'trofeo' | 'medalla' | 'descuento' | 'producto' | 'reconocimiento';
  criterioObtencion: string; // Criterio para obtener el premio
  valor?: number; // Valor monetario si aplica
  cantidadDisponible?: number; // Cantidad limitada de premios
}

/**
 * Plantilla de evento para creación rápida
 * 
 * Permite guardar configuraciones base de eventos para reutilización.
 * Relación con otros módulos:
 * - Reservas: configuracionBase incluye precios y capacidad por defecto
 * - Agenda: duracion y recordatorios se aplican automáticamente
 */
export interface EventTemplate {
  id: string;
  nombre: string;
  tipo: EventType;
  configuracionBase: {
    duracion?: number; // Duración en horas o días según tipo
    preciosPorTipoCliente: Record<ClientType, number>;
    recordatorios: ReminderConfig[]; // Configuración de recordatorios automáticos
    checklist: ChecklistItem[]; // Checklist de preparación por defecto
    capacidadMaxima: number;
    tags: string[];
  };
  creadoEn: Date;
  actualizadoEn: Date;
}

/**
 * Configuración de recordatorio automático
 */
export interface ReminderConfig {
  id: string;
  tiempoAnticipacionHoras: number; // Horas antes del evento
  activo: boolean;
  canales: ('email' | 'whatsapp')[];
  orden: number;
}

// ============================================================================
// PARTICIPANTES Y PRECIOS
// ============================================================================

/**
 * Participante en un evento o reto
 * 
 * Relación con otros módulos:
 * - Clientes: clienteId referencia al módulo de clientes
 * - Reservas: estadoInscripcion gestiona el flujo de reservas
 * - Agenda: fechaInscripcion se puede sincronizar con calendario del cliente
 */
export interface Participant {
  id: string;
  clienteId: string; // Referencia al módulo de clientes
  eventId: string; // Referencia al evento
  estadoInscripcion: ParticipantRegistrationState;
  tipoCliente: ClientType; // Tipo de cliente al momento de inscripción
  origenInscripcion: RegistrationOrigin;
  fechaInscripcion: Date;
  notasInternas?: string; // Notas privadas del staff
}

/**
 * Nivel de precios por tipo de cliente
 * 
 * Relación con otros módulos:
 * - Clientes: tipoCliente se relaciona con la clasificación de clientes
 * - Reservas: precio se usa para calcular ingresos y facturación
 */
export interface EventPricingTier {
  tipoCliente: ClientType;
  precio: number;
  moneda: string; // Código de moneda (EUR, USD, etc.)
  esPorDefecto: boolean; // Si es el precio por defecto para este tipo
}

// ============================================================================
// UBICACIONES Y ESTADOS
// ============================================================================

/**
 * Ubicación física para eventos presenciales
 * 
 * Relación con otros módulos:
 * - Agenda: se usa para verificar disponibilidad y conflictos de horario
 * - Reservas: capacidadMaxima limita las inscripciones
 */
export interface Location {
  id: string;
  nombre: string;
  direccion: string;
  capacidadMaxima: number;
  notas?: string; // Notas adicionales sobre la ubicación
  esUbicacionFrecuente: boolean; // Si aparece frecuentemente en opciones
}

// ============================================================================
// MÉTRICAS Y ANALYTICS
// ============================================================================

/**
 * Métricas de rendimiento de un evento
 * 
 * Relación con otros módulos:
 * - Reservas: inscritos, cancelaciones, noShows provienen del módulo de reservas
 * - Clientes: tasaAsistencia y tasaCancelacion reflejan comportamiento de clientes
 * - Finanzas: ingresosTotales e ingresosProyectados se integran con facturación
 */
export interface EventMetrics {
  asistenciaTotal: number; // Total de asistentes confirmados
  inscritos: number; // Total de inscripciones
  noShows: number; // Inscritos que no asistieron
  cancelaciones: number; // Inscripciones canceladas
  ingresosTotales: number; // Ingresos reales generados
  ingresosProyectados: number; // Ingresos proyectados basados en inscripciones
  tasaAsistencia: number; // Porcentaje de asistencia (asistenciaTotal / inscritos)
  tasaCancelacion: number; // Porcentaje de cancelaciones
  tasaNoShow: number; // Porcentaje de no-shows
}

/**
 * Progreso agregado de un reto
 * 
 * Relación con otros módulos:
 * - Clientes: rankingParticipantes muestra participación de clientes
 * - Agenda: fechaUltimaActualizacion se sincroniza con eventos del reto
 */
export interface ChallengeProgress {
  challengeId: string;
  participantesActivos: number; // Participantes que siguen activos
  porcentajeCompletadoMedio: number; // Porcentaje promedio de completado
  rankingParticipantes: ParticipantRanking[]; // Ranking de participantes
  fechaUltimaActualizacion: Date;
}

/**
 * Entrada en el ranking de participantes de un reto
 */
export interface ParticipantRanking {
  participanteId: string;
  nombre: string;
  puntos: number;
  porcentajeCompletado: number;
  posicion: number;
  avatar?: string;
}

/**
 * Insight o análisis derivado de métricas
 * 
 * Relación con otros módulos:
 * - Analytics: se integra con el módulo de analytics general
 * - Clientes: insights pueden generar acciones en el módulo de clientes
 */
export interface EventInsight {
  tipoInsight: InsightType;
  descripcion: string;
  valor: number | string; // Valor numérico o texto del insight
  fechaCalculo: Date;
}

// ============================================================================
// CHECKLISTS Y FEEDBACK
// ============================================================================

/**
 * Checklist de preparación para eventos
 * 
 * Relación con otros módulos:
 * - Agenda: se puede activar automáticamente antes de eventos programados
 * - Staff: items completados pueden asignarse a miembros del equipo
 */
export interface PreparationChecklist {
  id: string;
  nombre: string;
  items: ChecklistItem[];
  esPlantilla: boolean; // Si es una plantilla reutilizable
  eventId?: string; // ID del evento si está asociado a uno específico
}

/**
 * Item individual de un checklist
 */
export interface ChecklistItem {
  id: string;
  descripcion: string;
  obligatorio: boolean; // Si es obligatorio completar antes del evento
  completado: boolean;
  orden: number; // Orden de aparición en el checklist
  categoria?: 'material' | 'preparacion' | 'documentacion' | 'otro';
  fechaCompletado?: Date;
  completadoPor?: string; // ID del usuario que completó el item
}

/**
 * Pregunta de feedback post-evento
 * 
 * Relación con otros módulos:
 * - Clientes: respuestas se asocian a participantes/clientes
 * - Analytics: resultados se usan para métricas de satisfacción
 */
export interface FeedbackQuestion {
  id: string;
  pregunta: string;
  tipo: 'texto' | 'numero' | 'escala' | 'opcionMultiple' | 'siNo';
  opciones?: string[]; // Para tipo opcionMultiple
  escalaMin?: number; // Para tipo escala
  escalaMax?: number; // Para tipo escala
  obligatoria: boolean;
  orden: number;
}

/**
 * Resultado de una encuesta de feedback
 * 
 * Relación con otros módulos:
 * - Clientes: participanteId referencia al cliente que respondió
 * - Analytics: se agrega para métricas de satisfacción y mejora continua
 */
export interface FeedbackResult {
  id: string;
  eventId: string;
  participanteId: string;
  respuestas: FeedbackAnswer[];
  fechaCompletado: Date;
  valoracionGeneral?: number; // Valoración general del evento (1-5 o 1-10)
}

/**
 * Respuesta individual a una pregunta de feedback
 */
export interface FeedbackAnswer {
  preguntaId: string;
  respuesta: string | number | boolean;
}

// ============================================================================
// TIPOS ADICIONALES PARA COMPATIBILIDAD Y EXTENSIÓN
// ============================================================================

/**
 * Configuración de sincronización con calendarios externos
 * 
 * Relación con otros módulos:
 * - Agenda: sincronización bidireccional con Google Calendar, Outlook, etc.
 */
export interface CalendarSync {
  activo: boolean;
  conexionCalendarioId?: string;
  eventoExternoId?: string;
  sincronizacionBidireccional: boolean;
  calendarioId?: string;
  ultimaSincronizacion?: Date;
  errorSincronizacion?: string;
}

/**
 * Configuración de invitaciones a eventos
 * 
 * Relación con otros módulos:
 * - Clientes: destinatarios pueden ser clientes individuales o grupos
 * - Comunicaciones: integración con email y WhatsApp
 */
export interface EventInvitation {
  id: string;
  eventId: string;
  destinatarioId: string; // ID del cliente o grupo
  destinatarioTipo: 'cliente' | 'grupo';
  canal: 'email' | 'whatsapp' | 'ambos';
  estado: 'pendiente' | 'enviada' | 'entregada' | 'fallida';
  fechaEnvio: Date;
  fechaApertura?: Date;
  linkInvitacion?: string; // Link único para tracking
}

/**
 * Mensaje grupal enviado a participantes
 * 
 * Relación con otros módulos:
 * - Clientes: destinatarios son participantes del evento
 * - Comunicaciones: integración con canales de comunicación
 */
export interface GroupMessage {
  id: string;
  eventId: string;
  titulo?: string;
  mensaje: string;
  canal: 'email' | 'whatsapp' | 'ambos';
  fechaEnvio: Date;
  enviadoPor: string;
  destinatarios: string[]; // IDs de participantes
  estado: 'enviado' | 'en-proceso' | 'fallido';
}

// ============================================================================
// FILTROS Y PARÁMETROS DE BÚSQUEDA
// ============================================================================

/**
 * Filtros para búsqueda y listado de eventos
 */
export interface EventFilters {
  fechaDesde?: Date;
  fechaHasta?: Date;
  tipo?: EventType | EventType[];
  estado?: EventState | EventState[];
  tags?: string[];
  rol?: 'entrenador' | 'gimnasio';
  creadoPor?: string;
  archivado?: boolean;
  textoBusqueda?: string;
}

/**
 * Filtros para analytics de eventos
 */
export interface AnalyticsFilters extends EventFilters {
  incluirCancelados?: boolean;
  periodoMeses?: number;
  ordenPor?: 'asistencia' | 'ingresos' | 'satisfaccion' | 'participacion';
}

/**
 * Filtros para métricas de eventos
 */
export interface MetricasFilters {
  fechaDesde?: Date;
  fechaHasta?: Date;
  tipo?: EventType | EventType[];
  estado?: EventState | EventState[];
  entrenadorId?: string;
  periodoMeses?: number;
}

// ============================================================================
// HISTORIAL DE ESTADOS
// ============================================================================

/**
 * Entrada en el historial de cambios de estado de un evento
 */
export interface EventStateHistoryEntry {
  estadoAnterior: EventState;
  estadoNuevo: EventState;
  fechaCambio: Date;
  usuarioId: string;
  usuarioNombre: string;
  motivo?: string;
  notificado: boolean;
}

// ============================================================================
// ENLACES PÚBLICOS
// ============================================================================

/**
 * Enlace público de inscripción a un evento
 */
export interface PublicEventLink {
  eventId: string;
  slug: string;
  enlaceCompleto: string;
  fechaGeneracion: Date;
  activo: boolean;
  fechaExpiracion?: Date;
  contadorAccesos: number;
}

// ============================================================================
// TIPOS PARA SERVICIOS DE COMUNICACIONES MASIVAS
// ============================================================================

/**
 * Plantilla de invitación con asunto y cuerpo
 * 
 * NOTA: En producción, estas plantillas se almacenarían en la base de datos
 * y podrían ser personalizadas por el usuario.
 */
export interface PlantillaInvitacion {
  id: string;
  nombre: string;
  asunto: string;
  cuerpo: string;
  variables: string[]; // Variables disponibles como {nombre}, {eventoNombre}, etc.
  creadoPor: string;
  createdAt: Date;
}

/**
 * Filtros para seleccionar participantes en mensajes grupales
 * 
 * NOTA: Estos filtros permiten segmentar a qué participantes se envía
 * un mensaje grupal, útil para comunicaciones dirigidas.
 */
export interface FiltrosParticipantes {
  confirmados?: boolean; // Solo participantes confirmados
  noConfirmados?: boolean; // Solo participantes no confirmados
  asistieron?: boolean; // Solo participantes que asistieron
  noAsistieron?: boolean; // Solo participantes que no asistieron
  participantesIds?: string[]; // IDs específicos de participantes
  excluirParticipantesIds?: string[]; // IDs de participantes a excluir
}

/**
 * Regla de configuración de recordatorio
 * 
 * NOTA: En producción, estas reglas se usarían para programar recordatorios
 * automáticos mediante sistemas de colas o scheduling.
 */
export interface ReglaRecordatorio {
  diasAntes: number;
  canal: 'email' | 'whatsapp' | 'ambos';
  plantilla?: string;
}

