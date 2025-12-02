/**
 * API para gestión de eventos y retos
 * 
 * ============================================================================
 * NOTAS DE INTEGRACIÓN CON BACKEND REAL
 * ============================================================================
 * 
 * Este archivo contiene funciones mock que simulan llamadas a una API REST.
 * Para conectar con un backend real, se deben realizar los siguientes cambios:
 * 
 * 1. REPLACING MOCK CALLS:
 *    - Reemplazar todas las llamadas a localStorage con fetch/axios
 *    - Usar variables de entorno para la URL base del API
 *    - Ejemplo: const API_BASE_URL = process.env.REACT_APP_API_URL;
 * 
 * 2. AUTENTICACIÓN:
 *    - Todas las peticiones deben incluir token de autenticación
 *    - Usar headers: { 'Authorization': `Bearer ${token}` }
 *    - Manejar refresco de token automático si expira
 * 
 * 3. MANEJO DE ERRORES:
 *    - Implementar try/catch para todas las llamadas
 *    - Transformar errores HTTP en errores de dominio
 *    - Mostrar mensajes de error apropiados al usuario
 * 
 * 4. PÁGINA PÚBLICA DE REGISTRO:
 *    - El endpoint GET /api/public/events/{slug} debe ser público (sin auth)
 *    - La ruta de la página pública sería: /eventos/inscripcion/{slug}
 *    - Esta página llamaría a getEnlacePublicoPorSlug() y mostraría formulario
 *    - Al enviar, llamaría a POST /api/public/events/{slug}/register
 * 
 * 5. SINCRONIZACIÓN DE ESTADOS:
 *    - Los cambios de estado deberían disparar webhooks/notificaciones
 *    - Integrar con servicios de email/SMS para notificaciones
 *    - Actualizar caché local después de operaciones CRUD
 * 
 * 6. VALIDACIONES:
 *    - El backend debe validar todas las reglas de negocio
 *    - Validar transiciones de estado
 *    - Validar permisos según rol del usuario
 * 
 * ============================================================================
 */

// API para gestión de eventos y retos

export type TipoEvento = 'presencial' | 'reto' | 'virtual';
export type EstadoEvento = 'borrador' | 'programado' | 'en-curso' | 'finalizado' | 'cancelado';

export interface Participante {
  id: string;
  nombre: string;
  email?: string;
  telefono?: string;
  foto?: string;
  confirmado: boolean;
  asistencia?: boolean;
  fechaInscripcion: Date;
  fechaCancelacion?: Date;
  motivoCancelacion?: string;
  esNoInscrito?: boolean;
  // Tipo de cliente para pricing diferenciado
  tipoCliente?: 'regular' | 'premium' | 'vip';
  // Campos para confirmación de asistencia (User Story 1)
  confirmacionAsistencia?: 'pendiente' | 'confirmado' | 'no-puede';
  fechaConfirmacionAsistencia?: Date;
  solicitudConfirmacionEnviada?: boolean;
  fechaSolicitudConfirmacion?: Date;
  // Campos para progreso en retos (User Story US-ER-23)
  progresoReto?: ProgresoParticipanteReto;
}

// Interfaz para progreso de participantes en retos
export interface ProgresoParticipanteReto {
  participanteId: string;
  eventoId: string;
  metricas: MetricaProgreso[];
  diasCompletados: number;
  diasTotales: number;
  porcentajeCompletado: number;
  checkIns: CheckInReto[];
  ultimoCheckIn?: Date;
  logros: LogroReto[];
  puntos?: number;
  posicionRanking?: number;
}

// Interfaz para métricas de progreso configurables
export interface MetricaProgreso {
  id: string;
  nombre: string;
  tipo: 'numero' | 'porcentaje' | 'boolean' | 'texto';
  valor: number | boolean | string;
  unidad?: string;
  fechaActualizacion: Date;
  historial?: HistorialMetrica[];
  objetivo?: number | string;
  cumplido?: boolean;
}

// Historial de una métrica
export interface HistorialMetrica {
  fecha: Date;
  valor: number | boolean | string;
  notas?: string;
}

// Check-in en un reto
export interface CheckInReto {
  id: string;
  fecha: Date;
  metricas: Record<string, number | boolean | string>;
  notas?: string;
  completado: boolean;
}

// Logro en un reto
export interface LogroReto {
  id: string;
  nombre: string;
  descripcion: string;
  fechaObtencion: Date;
  icono?: string;
  tipo: 'dia' | 'metrica' | 'consistencia' | 'especial';
}

export interface Evento {
  id: string;
  tipo: TipoEvento;
  nombre: string;
  descripcion: string;
  fechaInicio: Date;
  fechaFin?: Date;
  capacidad: number;
  participantes: string[];
  participantesDetalle?: Participante[];
  listaEspera?: Participante[];
  cancelaciones?: any[];
  estado: EstadoEvento;
  ubicacion?: string; // Mantener para compatibilidad
  ubicacionId?: string; // ID de la ubicación/sala
  ubicacionDetalle?: {
    id: string;
    nombre: string;
    capacidadMaxima: number;
    tipo: string;
  }; // Detalles completos de la ubicación
  requisitosFisicos?: string;
  materialNecesario?: string;
  plataforma?: string;
  linkAcceso?: string;
  requisitosTecnicos?: string;
  grabacion?: boolean;
  duracionDias?: number;
  objetivo?: string;
  metricas?: string;
  premios?: string;
  imagen?: string;
  creadoPor: string;
  createdAt: Date;
  eventoDuplicadoDe?: string;
  nombreEventoOriginal?: string;
  precio?: number;
  preciosPorTipoCliente?: Record<string, number>;
  esGratuito?: boolean;
  esPlantilla?: boolean;
  plantillaId?: string;
  historialEstado?: any[];
  publicLink?: string; // Link único para inscripción pública
  inscripcionesPublicasHabilitadas?: boolean; // Si las inscripciones públicas están habilitadas
  // Campos para invitaciones (User Story 1)
  invitaciones?: InvitacionEvento[];
  plantillaInvitacion?: string; // Plantilla personalizable de invitación
  // Campos para recordatorios (User Story 2)
  recordatoriosConfiguracion?: ConfiguracionRecordatoriosEvento;
  recordatoriosEnviados?: RecordatorioEnviado[];
  // Campos para solicitud de confirmación (User Story 1)
  solicitudConfirmacion?: SolicitudConfirmacion;
  // Campos para mensajes grupales (User Story 2)
  mensajesGrupales?: MensajeGrupal[];
  // Campos para feedback post-evento (User Story 1)
  encuestaPostEvento?: {
    id: string;
    enviada: boolean;
    fechaEnvio?: Date;
    respuestasRecibidas: number;
    valoracionPromedio?: number;
  };
  // Campos para progreso de retos (User Story US-ER-23)
  metricasRetoConfiguradas?: MetricaRetoConfig[];
  rankingRetoHabilitado?: boolean;
  mensajesMotivacionEnviados?: MensajeMotivacionReto[];
  // Campos para sincronización con Google Calendar (User Story 1)
  sincronizacionCalendario?: SincronizacionCalendarioEvento;
  // Campos para checklist de preparación (User Story 2)
  checklistPreparacion?: ChecklistPreparacion;
  // Campos para archivado (User Story 2)
  archivado?: boolean;
  fechaArchivado?: Date;
}

// Configuración de métricas para retos
export interface MetricaRetoConfig {
  id: string;
  nombre: string;
  tipo: 'numero' | 'porcentaje' | 'boolean' | 'texto';
  unidad?: string;
  objetivo?: number | string;
  requerida: boolean;
  orden: number;
}

// Mensaje de motivación enviado a participantes de reto
export interface MensajeMotivacionReto {
  id: string;
  eventoId: string;
  participanteId?: string; // Si es undefined, es mensaje grupal
  mensaje: string;
  tipo: 'logro' | 'motivacion' | 'recordatorio' | 'apoyo';
  fechaEnvio: Date;
  canal: 'email' | 'whatsapp' | 'ambos';
  enviadoPor: string;
  leido?: boolean;
  fechaLectura?: Date;
}

// Sincronización con Google Calendar (User Story 1)
export interface SincronizacionCalendarioEvento {
  activo: boolean;
  conexionCalendarioId?: string; // ID de la conexión de calendario
  eventoExternoId?: string; // ID del evento en Google Calendar
  sincronizacionBidireccional: boolean;
  calendarioId?: string; // ID del calendario específico en Google
  ultimaSincronizacion?: Date;
  errorSincronizacion?: string;
  desactivado?: boolean; // Si el usuario desactivó la sincronización manualmente
}

// Checklist de preparación (User Story 2)
export interface ChecklistPreparacion {
  items: ItemChecklist[];
  recordatorioUnDiaAntes: boolean;
  recordatorioEnviado?: boolean;
  fechaRecordatorioEnviado?: Date;
  plantillaId?: string; // ID de la plantilla de checklist usada
}

export interface ItemChecklist {
  id: string;
  nombre: string;
  descripcion?: string;
  completado: boolean;
  fechaCompletado?: Date;
  orden: number;
  categoria?: 'material' | 'preparacion' | 'documentacion' | 'otro';
  completadoPor?: string;
}

// Plantilla de checklist
export interface PlantillaChecklist {
  id: string;
  nombre: string;
  descripcion?: string;
  tipoEvento?: TipoEvento; // Tipo de evento al que se aplica (opcional)
  items: Omit<ItemChecklist, 'id' | 'completado' | 'fechaCompletado'>[];
  creadoPor: string;
  createdAt: Date;
  updatedAt: Date;
  usoFrecuente: number; // Contador de uso
}

export interface EventoHistorialCliente {
  eventoId: string;
  eventoNombre: string;
  eventoTipo: TipoEvento;
  fechaInicio: Date;
  fechaFin?: Date;
  estadoEvento: EstadoEvento;
  inscrito: boolean;
  asistio: boolean;
  fechaInscripcion?: Date;
  fechaAsistencia?: Date;
  cancelado: boolean;
  fechaCancelacion?: Date;
  ubicacion?: string;
  plataforma?: string;
}

export interface EstadisticasEventosCliente {
  totalEventos: number;
  eventosInscritos: number;
  eventosAsistidos: number;
  porcentajeAsistencia: number; // % de asistencia vs inscripciones
  eventosPorTipo: {
    presencial: number;
    virtual: number;
    reto: number;
  };
  eventosFavoritos: Array<{
    eventoId: string;
    eventoNombre: string;
    eventoTipo: TipoEvento;
    vecesAsistido: number;
  }>;
}

// Interfaces para invitaciones (User Story 1)
export interface InvitacionEvento {
  id: string;
  destinatarioId: string; // ID del cliente o grupo
  destinatarioNombre: string;
  destinatarioTipo: 'cliente' | 'grupo';
  email?: string;
  telefono?: string;
  canal: 'email' | 'whatsapp' | 'ambos';
  plantilla: string;
  mensajePersonalizado?: string;
  fechaEnvio: Date;
  estado: 'pendiente' | 'enviada' | 'entregada' | 'fallida';
  abierta: boolean;
  fechaApertura?: Date;
  linkInvitacion?: string; // Link único para tracking
}

// Interfaces para recordatorios (User Story 2)
export interface ConfiguracionRecordatoriosEvento {
  activo: boolean;
  recordatorios: RecordatorioConfiguracionEvento[];
  plantillaRecordatorio?: string;
  canalPorDefecto: 'email' | 'whatsapp' | 'ambos';
}

export interface RecordatorioConfiguracionEvento {
  id: string;
  tiempoAnticipacionHoras: number; // 24, 2, etc.
  activo: boolean;
  canales: ('email' | 'whatsapp')[];
  orden: number;
}

export interface RecordatorioEnviado {
  id: string;
  participanteId: string;
  participanteNombre: string;
  tiempoAnticipacionHoras: number;
  canal: 'email' | 'whatsapp';
  mensaje: string;
  fechaEnvio: Date;
  estado: 'enviado' | 'entregado' | 'fallido';
  leido: boolean;
  fechaLectura?: Date;
}

// Interfaces para solicitud de confirmación (User Story 1)
export interface SolicitudConfirmacion {
  id: string;
  eventoId: string;
  diasAnticipacion: number;
  fechaSolicitud: Date;
  fechaLimite: Date;
  mensaje: string;
  canal: 'email' | 'whatsapp' | 'ambos';
  estado: 'pendiente' | 'enviada' | 'finalizada';
  participantesNotificados: string[]; // IDs de participantes
  respuestas: RespuestaConfirmacion[];
}

export interface RespuestaConfirmacion {
  participanteId: string;
  participanteNombre: string;
  respuesta: 'confirmado' | 'no-puede';
  fechaRespuesta: Date;
  motivo?: string;
}

// Interfaces para mensajes grupales (User Story 2)
export interface MensajeGrupal {
  id: string;
  eventoId: string;
  titulo?: string;
  mensaje: string;
  plantillaId?: string;
  plantillaNombre?: string;
  canal: 'email' | 'whatsapp' | 'ambos';
  fechaEnvio: Date;
  enviadoPor: string;
  enviadoPorNombre: string;
  destinatarios: DestinatarioMensajeGrupal[];
  estado: 'enviado' | 'en-proceso' | 'fallido';
  estadisticas?: {
    total: number;
    enviados: number;
    entregados: number;
    fallidos: number;
    tasaEntrega: number;
  };
}

export interface DestinatarioMensajeGrupal {
  participanteId: string;
  participanteNombre: string;
  email?: string;
  telefono?: string;
  canal: 'email' | 'whatsapp';
  estado: 'pendiente' | 'enviado' | 'entregado' | 'fallido';
  fechaEnvio?: Date;
  fechaEntrega?: Date;
  error?: string;
}

export interface PlantillaMensajeGrupal {
  id: string;
  nombre: string;
  categoria: 'general' | 'cambio' | 'instrucciones' | 'motivacion' | 'recordatorio';
  mensaje: string;
  variables: string[]; // Variables disponibles como {nombre}, {eventoNombre}, etc.
  creadoPor: string;
  createdAt: Date;
}

// ============================================================================
// INTERFACES PARA FILTROS Y PARÁMETROS
// ============================================================================

/**
 * Filtros para búsqueda y listado de eventos
 * 
 * NOTA: En un backend real, estos filtros se convertirían en query parameters
 * o en el body de una petición POST para búsquedas complejas.
 * Ejemplo: GET /api/events?fechaDesde=2024-01-01&tipo=presencial&estado=programado
 */
export interface EventFilters {
  fechaDesde?: Date;
  fechaHasta?: Date;
  tipo?: TipoEvento | TipoEvento[];
  estado?: EstadoEvento | EstadoEvento[];
  tags?: string[];
  rol?: 'entrenador' | 'gimnasio'; // Filtro por rol del creador o participante
  creadoPor?: string; // ID del usuario creador
  archivado?: boolean;
  textoBusqueda?: string; // Búsqueda por nombre o descripción
}

/**
 * Entrada en el historial de cambios de estado de un evento
 * 
 * NOTA: En un backend real, esto se almacenaría en una tabla separada
 * (event_state_history) con relación al evento, permitiendo auditoría completa.
 */
export interface CambioEstado {
  estadoAnterior: EstadoEvento;
  estadoNuevo: EstadoEvento;
  fechaCambio: Date;
  usuarioId: string;
  usuarioNombre: string;
  motivo?: string;
  notificado: boolean;
}

/**
 * Plantilla de evento para reutilización
 * 
 * NOTA: En un backend real, las plantillas se almacenarían en una tabla separada
 * y podrían compartirse entre usuarios o ser privadas.
 */
export interface PlantillaEvento {
  id: string;
  nombre: string;
  descripcion?: string;
  tipo: TipoEvento;
  datosEvento: Omit<Evento, 'id' | 'participantes' | 'participantesDetalle' | 'listaEspera' | 'estado' | 'fechaInicio' | 'fechaFin' | 'createdAt' | 'esPlantilla' | 'plantillaId' | 'historialEstado' | 'archivado' | 'fechaArchivado'>;
  creadoPor: string;
  createdAt: Date;
  updatedAt: Date;
  usoFrecuente?: number; // Contador de uso para ordenar plantillas más usadas
}

/**
 * Enlace público de inscripción con slug legible
 * 
 * NOTA: En un backend real, los slugs deberían ser únicos y validarse antes de generar.
 * Se podría usar una tabla event_public_links para rastrear múltiples enlaces por evento.
 */
export interface EnlacePublicoEvento {
  eventId: string;
  slug: string; // Slug legible (ej: "reto-30-dias-enero")
  enlaceCompleto: string; // URL completa: https://app.com/eventos/{slug}
  fechaGeneracion: Date;
  activo: boolean;
  fechaExpiracion?: Date;
  contadorAccesos: number;
}

/**
 * Obtiene el historial de eventos de un cliente
 */
export const getEventosHistorialCliente = async (clientId: string): Promise<EventoHistorialCliente[]> => {
  // TODO: Implementar llamada a API real
  // Por ahora, simular con datos de localStorage o mock
  await new Promise(resolve => setTimeout(resolve, 500));

  // Obtener eventos del localStorage (donde se guardan en eventos-retosPage)
  const eventosStorage = localStorage.getItem('eventos');
  if (!eventosStorage) {
    return [];
  }

  try {
    const eventos: Evento[] = JSON.parse(eventosStorage).map((e: any) => ({
      ...e,
      fechaInicio: new Date(e.fechaInicio),
      fechaFin: e.fechaFin ? new Date(e.fechaFin) : undefined,
      createdAt: new Date(e.createdAt),
    }));

    // Filtrar eventos donde el cliente es participante
    const eventosCliente: EventoHistorialCliente[] = [];

    eventos.forEach(evento => {
      const participante = evento.participantesDetalle?.find(p => p.id === clientId);
      if (participante) {
        eventosCliente.push({
          eventoId: evento.id,
          eventoNombre: evento.nombre,
          eventoTipo: evento.tipo,
          fechaInicio: evento.fechaInicio,
          fechaFin: evento.fechaFin,
          estadoEvento: evento.estado,
          inscrito: true,
          asistio: participante.asistencia || false,
          fechaInscripcion: participante.fechaInscripcion,
          fechaAsistencia: participante.asistencia ? evento.fechaInicio : undefined,
          cancelado: !!participante.fechaCancelacion,
          fechaCancelacion: participante.fechaCancelacion,
          ubicacion: evento.ubicacion,
          plataforma: evento.plataforma,
        });
      }
    });

    // Ordenar por fecha más reciente
    return eventosCliente.sort((a, b) =>
      b.fechaInicio.getTime() - a.fechaInicio.getTime()
    );
  } catch (error) {
    console.error('Error obteniendo historial de eventos del cliente:', error);
    return [];
  }
};

/**
 * Obtiene estadísticas de eventos de un cliente
 */
export const getEstadisticasEventosCliente = async (clientId: string): Promise<EstadisticasEventosCliente> => {
  const historial = await getEventosHistorialCliente(clientId);

  const eventosInscritos = historial.filter(e => e.inscrito);
  const eventosAsistidos = historial.filter(e => e.asistio);
  const porcentajeAsistencia = eventosInscritos.length > 0
    ? (eventosAsistidos.length / eventosInscritos.length) * 100
    : 0;

  // Contar eventos por tipo
  const eventosPorTipo = {
    presencial: historial.filter(e => e.eventoTipo === 'presencial').length,
    virtual: historial.filter(e => e.eventoTipo === 'virtual').length,
    reto: historial.filter(e => e.eventoTipo === 'reto').length,
  };

  // Calcular eventos favoritos (más asistidos)
  const eventosFavoritosMap = new Map<string, { eventoId: string; eventoNombre: string; eventoTipo: TipoEvento; vecesAsistido: number }>();

  eventosAsistidos.forEach(evento => {
    const existente = eventosFavoritosMap.get(evento.eventoId);
    if (existente) {
      existente.vecesAsistido++;
    } else {
      eventosFavoritosMap.set(evento.eventoId, {
        eventoId: evento.eventoId,
        eventoNombre: evento.eventoNombre,
        eventoTipo: evento.eventoTipo,
        vecesAsistido: 1,
      });
    }
  });

  const eventosFavoritos = Array.from(eventosFavoritosMap.values())
    .sort((a, b) => b.vecesAsistido - a.vecesAsistido)
    .slice(0, 5); // Top 5

  return {
    totalEventos: historial.length,
    eventosInscritos: eventosInscritos.length,
    eventosAsistidos: eventosAsistidos.length,
    porcentajeAsistencia: Math.round(porcentajeAsistencia * 10) / 10,
    eventosPorTipo,
    eventosFavoritos,
  };
};

/**
 * Obtiene un evento por su ID (para la página pública de inscripción)
 */
export const getEventoPorId = async (eventoId: string): Promise<Evento | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const eventosStorage = localStorage.getItem('eventos');
  if (!eventosStorage) {
    return null;
  }

  try {
    const eventos: Evento[] = JSON.parse(eventosStorage).map((e: any) => ({
      ...e,
      fechaInicio: new Date(e.fechaInicio),
      fechaFin: e.fechaFin ? new Date(e.fechaFin) : undefined,
      createdAt: new Date(e.createdAt),
      participantesDetalle: e.participantesDetalle?.map((p: any) => ({
        ...p,
        fechaInscripcion: new Date(p.fechaInscripcion),
        fechaCancelacion: p.fechaCancelacion ? new Date(p.fechaCancelacion) : undefined,
      })),
    }));

    return eventos.find(e => e.id === eventoId) || null;
  } catch (error) {
    console.error('Error obteniendo evento:', error);
    return null;
  }
};

/**
 * Obtiene un evento por su publicLink (para la página pública de inscripción)
 */
export const getEventoPorPublicLink = async (publicLink: string): Promise<Evento | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const eventosStorage = localStorage.getItem('eventos');
  if (!eventosStorage) {
    return null;
  }

  try {
    const eventos: Evento[] = JSON.parse(eventosStorage).map((e: any) => ({
      ...e,
      fechaInicio: new Date(e.fechaInicio),
      fechaFin: e.fechaFin ? new Date(e.fechaFin) : undefined,
      createdAt: new Date(e.createdAt),
      participantesDetalle: e.participantesDetalle?.map((p: any) => ({
        ...p,
        fechaInscripcion: new Date(p.fechaInscripcion),
        fechaCancelacion: p.fechaCancelacion ? new Date(p.fechaCancelacion) : undefined,
      })),
    }));

    return eventos.find(e => e.publicLink === publicLink) || null;
  } catch (error) {
    console.error('Error obteniendo evento por publicLink:', error);
    return null;
  }
};

/**
 * Genera un link único para un evento
 */
export const generarPublicLink = (eventoId: string): string => {
  // Generar un hash único basado en el ID del evento y timestamp
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `evt-${eventoId}-${timestamp}-${random}`;
};

/**
 * Inscribe un cliente a un evento mediante el link público
 */
export const inscribirClientePublico = async (
  eventoId: string,
  datosInscripcion: {
    nombre: string;
    email: string;
    telefono?: string;
  }
): Promise<{ success: boolean; message: string; enListaEspera?: boolean }> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const eventosStorage = localStorage.getItem('eventos');
  if (!eventosStorage) {
    return { success: false, message: 'Evento no encontrado' };
  }

  try {
    const eventos: Evento[] = JSON.parse(eventosStorage).map((e: any) => ({
      ...e,
      fechaInicio: new Date(e.fechaInicio),
      fechaFin: e.fechaFin ? new Date(e.fechaFin) : undefined,
      createdAt: new Date(e.createdAt),
      participantesDetalle: e.participantesDetalle?.map((p: any) => ({
        ...p,
        fechaInscripcion: new Date(p.fechaInscripcion),
        fechaCancelacion: p.fechaCancelacion ? new Date(p.fechaCancelacion) : undefined,
      })) || [],
    }));

    const evento = eventos.find(e => e.id === eventoId);
    if (!evento) {
      return { success: false, message: 'Evento no encontrado' };
    }

    // Verificar si las inscripciones públicas están habilitadas
    if (!evento.inscripcionesPublicasHabilitadas) {
      return { success: false, message: 'Las inscripciones públicas están deshabilitadas para este evento' };
    }

    // Verificar si el evento está lleno
    const participantesActuales = evento.participantesDetalle?.filter(p => !p.fechaCancelacion).length || 0;
    const capacidadDisponible = evento.capacidad - participantesActuales;

    if (capacidadDisponible <= 0) {
      // Agregar a lista de espera
      const nuevoParticipante: Participante = {
        id: `public_${Date.now()}`,
        nombre: datosInscripcion.nombre,
        email: datosInscripcion.email,
        telefono: datosInscripcion.telefono,
        confirmado: false,
        asistencia: false,
        fechaInscripcion: new Date(),
        esNoInscrito: false,
      };

      const listaEspera = evento.listaEspera || [];
      listaEspera.push(nuevoParticipante);

      evento.listaEspera = listaEspera;
      evento.participantes = [...evento.participantes, nuevoParticipante.id];
      evento.participantesDetalle = [...(evento.participantesDetalle || []), nuevoParticipante];

      // Guardar en localStorage
      localStorage.setItem('eventos', JSON.stringify(eventos));

      return {
        success: true,
        message: 'Te hemos agregado a la lista de espera. Te notificaremos si hay disponibilidad.',
        enListaEspera: true
      };
    }

    // Agregar participante
    const nuevoParticipante: Participante = {
      id: `public_${Date.now()}`,
      nombre: datosInscripcion.nombre,
      email: datosInscripcion.email,
      telefono: datosInscripcion.telefono,
      confirmado: true,
      asistencia: false,
      fechaInscripcion: new Date(),
      esNoInscrito: false,
    };

    evento.participantes = [...evento.participantes, nuevoParticipante.id];
    evento.participantesDetalle = [...(evento.participantesDetalle || []), nuevoParticipante];

    // Guardar en localStorage
    localStorage.setItem('eventos', JSON.stringify(eventos));

    return {
      success: true,
      message: '¡Inscripción exitosa! Te esperamos en el evento.',
      enListaEspera: false
    };
  } catch (error) {
    console.error('Error inscribiendo cliente:', error);
    return { success: false, message: 'Error al procesar la inscripción' };
  }
};

/**
 * Guarda eventos en localStorage (helper para sincronizar con eventos-retosPage)
 */
export const guardarEventos = (eventos: Evento[]): void => {
  localStorage.setItem('eventos', JSON.stringify(eventos));
};

/**
 * Carga eventos de localStorage
 */
export const cargarEventos = (): Evento[] => {
  const eventosStorage = localStorage.getItem('eventos');
  if (!eventosStorage) {
    return [];
  }

  try {
    return JSON.parse(eventosStorage).map((e: any) => ({
      ...e,
      fechaInicio: new Date(e.fechaInicio),
      fechaFin: e.fechaFin ? new Date(e.fechaFin) : undefined,
      createdAt: new Date(e.createdAt),
      fechaArchivado: e.fechaArchivado ? new Date(e.fechaArchivado) : undefined,
      participantesDetalle: e.participantesDetalle?.map((p: any) => ({
        ...p,
        fechaInscripcion: new Date(p.fechaInscripcion),
        fechaCancelacion: p.fechaCancelacion ? new Date(p.fechaCancelacion) : undefined,
      })) || [],
    }));
  } catch (error) {
    console.error('Error cargando eventos:', error);
    return [];
  }
};

// ============================================================================
// FUNCIONES CRUD PRINCIPALES
// ============================================================================

/**
 * Obtiene una lista de eventos filtrada según los criterios proporcionados
 * 
 * NOTA BACKEND: Esta función se conectaría a un endpoint como:
 * GET /api/events?fechaDesde=2024-01-01&tipo=presencial&estado=programado
 * 
 * El backend debería implementar:
 * - Paginación (page, limit)
 * - Ordenamiento (sortBy, sortOrder)
 * - Búsqueda full-text en nombre y descripción
 * - Filtrado por relaciones (participantes, creador, etc.)
 * 
 * @param filtros Filtros opcionales para la búsqueda
 * @returns Array de eventos que cumplen los filtros
 */
export const getEvents = async (filtros?: EventFilters): Promise<Evento[]> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));

  // Cargar eventos desde localStorage
  let eventos = cargarEventos();

  // Si no hay eventos, retornar array vacío
  if (!eventos || eventos.length === 0) {
    return [];
  }

  // Aplicar filtros
  if (filtros) {
    // Filtro por rango de fechas
    if (filtros.fechaDesde) {
      eventos = eventos.filter(e =>
        e.fechaInicio >= filtros.fechaDesde!
      );
    }
    if (filtros.fechaHasta) {
      eventos = eventos.filter(e =>
        e.fechaInicio <= filtros.fechaHasta! ||
        (e.fechaFin && e.fechaFin <= filtros.fechaHasta!)
      );
    }

    // Filtro por tipo
    if (filtros.tipo) {
      const tipos = Array.isArray(filtros.tipo) ? filtros.tipo : [filtros.tipo];
      eventos = eventos.filter(e => tipos.includes(e.tipo));
    }

    // Filtro por estado
    if (filtros.estado) {
      const estados = Array.isArray(filtros.estado) ? filtros.estado : [filtros.estado];
      eventos = eventos.filter(e => estados.includes(e.estado));
    }

    // Filtro por etiquetas (tags) - si el evento tiene alguno de los tags buscados
    if (filtros.tags && filtros.tags.length > 0) {
      // Nota: asumiendo que los eventos pueden tener tags en algún campo
      // En la implementación actual no hay campo tags en Evento, se podría agregar
      // eventos = eventos.filter(e => {
      //   const eventoTags = e.tags || [];
      //   return filtros.tags!.some(tag => eventoTags.includes(tag));
      // });
    }

    // Filtro por rol del creador
    if (filtros.rol) {
      // Nota: Necesitaríamos tener información del rol del creador en el evento
      // Por ahora, filtramos por creadoPor si está disponible
      // En un backend real, esto sería un JOIN con la tabla de usuarios
    }

    // Filtro por creador
    if (filtros.creadoPor) {
      eventos = eventos.filter(e => e.creadoPor === filtros.creadoPor);
    }

    // Filtro por archivado
    if (filtros.archivado !== undefined) {
      eventos = eventos.filter(e => !!e.archivado === filtros.archivado);
    }

    // Búsqueda de texto en nombre y descripción
    if (filtros.textoBusqueda) {
      const busquedaLower = filtros.textoBusqueda.toLowerCase();
      eventos = eventos.filter(e =>
        e.nombre.toLowerCase().includes(busquedaLower) ||
        e.descripcion?.toLowerCase().includes(busquedaLower)
      );
    }
  }

  // Ordenar por fecha de inicio (más recientes primero)
  eventos.sort((a, b) => b.fechaInicio.getTime() - a.fechaInicio.getTime());

  return eventos;
};

/**
 * Obtiene un evento por su ID con todos sus datos completos
 * 
 * NOTA BACKEND: Endpoint GET /api/events/{id}
 * Debería incluir relaciones (participantes, historial, etc.) mediante query params:
 * GET /api/events/{id}?include=participants,history,template
 * 
 * @param id ID del evento
 * @returns El evento completo o null si no existe
 */
export const getEventById = async (id: string): Promise<Evento | null> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 200));

  const eventos = cargarEventos();
  const evento = eventos.find(e => e.id === id);

  if (!evento) {
    return null;
  }

  // En un backend real, aquí se cargarían relaciones adicionales
  // como participantes completos, historial detallado, etc.

  return evento;
};

/**
 * Crea un nuevo evento o reto
 * 
 * NOTA BACKEND: Endpoint POST /api/events
 * El backend debería:
 * - Validar todos los campos requeridos
 * - Asignar ID único (UUID)
 * - Establecer createdAt automáticamente
 * - Validar permisos del usuario (solo entrenadores/gimnasios pueden crear)
 * - Inicializar campos por defecto (estado: 'borrador', etc.)
 * - Generar slug para enlace público si se requiere
 * 
 * @param data Datos del evento a crear (sin id, createdAt, etc.)
 * @returns El evento creado con todos sus campos completos
 */
export const createEvent = async (data: Omit<Evento, 'id' | 'createdAt' | 'participantes' | 'participantesDetalle' | 'listaEspera'>): Promise<Evento> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 400));

  const eventos = cargarEventos();

  // Generar ID único
  const nuevoId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  // Crear el evento con campos iniciales
  const nuevoEvento: Evento = {
    ...data,
    id: nuevoId,
    createdAt: new Date(),
    participantes: [],
    participantesDetalle: [],
    listaEspera: [],
    cancelaciones: [],
    historialEstado: [],
    estado: data.estado || 'borrador',
    archivado: false,
  };

  // Agregar evento a la lista
  eventos.push(nuevoEvento);

  // Guardar en localStorage
  guardarEventos(eventos);

  return nuevoEvento;
};

/**
 * Actualiza un evento existente
 * 
 * NOTA BACKEND: Endpoint PUT /api/events/{id} o PATCH /api/events/{id}
 * El backend debería:
 * - Validar que el evento existe
 * - Validar permisos (solo el creador o admin puede editar)
 * - Validar transiciones de estado (no permitir cambios inválidos)
 * - Actualizar updatedAt automáticamente
 * - Guardar versión anterior para auditoría si es necesario
 * 
 * @param id ID del evento a actualizar
 * @param changes Campos a actualizar (parcial)
 * @returns El evento actualizado
 */
export const updateEvent = async (id: string, changes: Partial<Evento>): Promise<Evento> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 350));

  const eventos = cargarEventos();
  const indice = eventos.findIndex(e => e.id === id);

  if (indice === -1) {
    throw new Error(`Evento con ID ${id} no encontrado`);
  }

  // Actualizar campos (excepto id y createdAt que no deben cambiar)
  const { id: _, createdAt: __, ...camposActualizables } = changes;
  eventos[indice] = {
    ...eventos[indice],
    ...camposActualizables,
  };

  // Guardar en localStorage
  guardarEventos(eventos);

  return eventos[indice];
};

/**
 * Elimina un evento o lo marca como cancelado/archivado según convenga
 * 
 * NOTA BACKEND: Endpoint DELETE /api/events/{id}
 * El backend podría implementar soft delete:
 * - Si el evento tiene participantes, marcarlo como cancelado en lugar de eliminarlo
 * - Si el evento está en curso o finalizado, archivarlo en lugar de eliminarlo
 * - Solo eliminar físicamente si está en borrador y sin participantes
 * 
 * En producción, se recomienda soft delete para mantener integridad referencial.
 * 
 * @param id ID del evento a eliminar
 * @returns true si se eliminó correctamente
 */
export const deleteEvent = async (id: string): Promise<boolean> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));

  const eventos = cargarEventos();
  const evento = eventos.find(e => e.id === id);

  if (!evento) {
    throw new Error(`Evento con ID ${id} no encontrado`);
  }

  // Estrategia de eliminación según el estado del evento:
  // - Si tiene participantes activos o está en curso/finalizado: marcar como cancelado/archivado
  // - Si está en borrador sin participantes: eliminar completamente

  const tieneParticipantes = evento.participantesDetalle && evento.participantesDetalle.length > 0;
  const estadoFinal = ['en-curso', 'finalizado'].includes(evento.estado);

  if (tieneParticipantes || estadoFinal) {
    // Soft delete: marcar como cancelado y archivado
    evento.estado = 'cancelado';
    evento.archivado = true;
    evento.fechaArchivado = new Date();
    guardarEventos(eventos);
    return true;
  } else {
    // Hard delete: eliminar completamente
    const eventosFiltrados = eventos.filter(e => e.id !== id);
    guardarEventos(eventosFiltrados);
    return true;
  }
};

// ============================================================================
// GESTIÓN DE ESTADOS
// ============================================================================

/**
 * Cambia el estado de un evento siguiendo reglas de transición
 * 
 * NOTA BACKEND: Endpoint POST /api/events/{id}/change-state
 * El backend debería:
 * - Validar reglas de transición de estados
 * - Registrar el cambio en historialEstado
 * - Notificar participantes si es necesario
 * - Actualizar campos relacionados (fechaFin para 'finalizado', etc.)
 * 
 * Reglas de transición implementadas:
 * - No se puede pasar de 'finalizado' a ningún otro estado (excepto 'cancelado' en casos especiales)
 * - No se puede pasar de 'cancelado' a 'borrador' o 'programado'
 * - Desde 'borrador' se puede ir a cualquier estado
 * 
 * @param id ID del evento
 * @param nuevoEstado Nuevo estado al que cambiar
 * @param motivoOpcional Motivo del cambio (opcional)
 * @returns El evento actualizado con el nuevo estado
 */
export const changeEventState = async (
  id: string,
  nuevoEstado: EstadoEvento,
  motivoOpcional?: string
): Promise<Evento> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));

  const eventos = cargarEventos();
  const evento = eventos.find(e => e.id === id);

  if (!evento) {
    throw new Error(`Evento con ID ${id} no encontrado`);
  }

  const estadoAnterior = evento.estado;

  // Validar transiciones de estado
  // No permitir pasar de finalizado a otros estados (excepto cancelado en casos especiales)
  if (estadoAnterior === 'finalizado' && nuevoEstado !== 'finalizado' && nuevoEstado !== 'cancelado') {
    throw new Error('No se puede cambiar el estado de un evento finalizado');
  }

  // No permitir pasar de cancelado a borrador o programado
  if (estadoAnterior === 'cancelado' && (nuevoEstado === 'borrador' || nuevoEstado === 'programado')) {
    throw new Error('No se puede reactivar un evento cancelado a borrador o programado');
  }

  // Actualizar estado
  evento.estado = nuevoEstado;

  // Actualizar campos relacionados según el nuevo estado
  if (nuevoEstado === 'finalizado' && !evento.fechaFin) {
    evento.fechaFin = new Date();
  }

  // Crear entrada en historial
  const cambioEstado: CambioEstado = {
    estadoAnterior,
    estadoNuevo: nuevoEstado,
    fechaCambio: new Date(),
    usuarioId: evento.creadoPor, // En producción, usaría el usuario actual autenticado
    usuarioNombre: 'Usuario Actual', // En producción, cargaría el nombre del usuario
    motivo: motivoOpcional,
    notificado: false, // Se marcaría como true después de notificar
  };

  evento.historialEstado = evento.historialEstado || [];
  evento.historialEstado.push(cambioEstado);

  // Guardar cambios
  guardarEventos(eventos);

  // NOTA BACKEND: Aquí se dispararía una notificación a participantes
  // mediante un servicio de notificaciones o una cola de mensajes

  return evento;
};

/**
 * Obtiene el historial completo de cambios de estado de un evento
 * 
 * NOTA BACKEND: Endpoint GET /api/events/{id}/state-history
 * Podría incluir paginación si el historial es muy largo.
 * También podría incluir metadatos adicionales como cambios relacionados.
 * 
 * @param id ID del evento
 * @returns Array con todas las entradas del historial de estados
 */
export const getEventStateHistory = async (id: string): Promise<CambioEstado[]> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 200));

  const evento = await getEventById(id);

  if (!evento) {
    throw new Error(`Evento con ID ${id} no encontrado`);
  }

  // Retornar historial ordenado por fecha (más reciente primero)
  const historial = evento.historialEstado || [];

  // Convertir cualquier formato antiguo a CambioEstado
  return historial.map((entrada: any) => {
    if (entrada.fechaCambio instanceof Date || typeof entrada.fechaCambio === 'string') {
      return {
        estadoAnterior: entrada.estadoAnterior,
        estadoNuevo: entrada.estadoNuevo,
        fechaCambio: new Date(entrada.fechaCambio),
        usuarioId: entrada.usuarioId || entrada.creadoPor || 'unknown',
        usuarioNombre: entrada.usuarioNombre || 'Usuario',
        motivo: entrada.motivo,
        notificado: entrada.notificado || false,
      } as CambioEstado;
    }
    return entrada;
  }).sort((a, b) => b.fechaCambio.getTime() - a.fechaCambio.getTime());
};

// ============================================================================
// GESTIÓN DE PLANTILLAS
// ============================================================================

/**
 * Obtiene todas las plantillas de eventos disponibles
 * 
 * NOTA BACKEND: Endpoint GET /api/event-templates
 * Podría incluir filtros por tipo de evento, usuario creador, etc.
 * También podría incluir plantillas públicas compartidas por otros usuarios.
 * 
 * @returns Array de todas las plantillas
 */
export const getEventTemplates = async (): Promise<PlantillaEvento[]> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));

  const templatesStorage = localStorage.getItem('eventTemplates');

  if (!templatesStorage) {
    return [];
  }

  try {
    const templates: PlantillaEvento[] = JSON.parse(templatesStorage).map((t: any) => ({
      ...t,
      createdAt: new Date(t.createdAt),
      updatedAt: new Date(t.updatedAt),
      datosEvento: {
        ...t.datosEvento,
        fechaInicio: t.datosEvento.fechaInicio ? new Date(t.datosEvento.fechaInicio) : undefined,
        fechaFin: t.datosEvento.fechaFin ? new Date(t.datosEvento.fechaFin) : undefined,
      },
    }));

    // Ordenar por uso frecuente (si está disponible) o por fecha de creación
    return templates.sort((a, b) => {
      if (a.usoFrecuente && b.usoFrecuente) {
        return b.usoFrecuente - a.usoFrecuente;
      }
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  } catch (error) {
    console.error('Error cargando plantillas:', error);
    return [];
  }
};

/**
 * Guarda plantillas en localStorage (helper)
 */
const guardarPlantillas = (plantillas: PlantillaEvento[]): void => {
  localStorage.setItem('eventTemplates', JSON.stringify(plantillas));
};

/**
 * Crea una nueva plantilla de evento
 * 
 * NOTA BACKEND: Endpoint POST /api/event-templates
 * El backend debería:
 * - Validar que todos los campos requeridos estén presentes
 * - Asignar ID único
 * - Establecer createdAt automáticamente
 * - Validar permisos (solo entrenadores/gimnasios pueden crear plantillas)
 * 
 * @param data Datos de la plantilla a crear
 * @returns La plantilla creada
 */
export const createEventTemplate = async (
  data: Omit<PlantillaEvento, 'id' | 'createdAt' | 'updatedAt'>
): Promise<PlantillaEvento> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 400));

  const plantillas = await getEventTemplates();

  // Generar ID único
  const nuevoId = `tpl_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  const nuevaPlantilla: PlantillaEvento = {
    ...data,
    id: nuevoId,
    createdAt: new Date(),
    updatedAt: new Date(),
    usoFrecuente: 0,
  };

  plantillas.push(nuevaPlantilla);
  guardarPlantillas(plantillas);

  return nuevaPlantilla;
};

/**
 * Actualiza una plantilla existente
 * 
 * NOTA BACKEND: Endpoint PUT /api/event-templates/{id}
 * El backend debería:
 * - Validar que la plantilla existe
 * - Validar permisos (solo el creador o admin puede editar)
 * - Actualizar updatedAt automáticamente
 * 
 * @param id ID de la plantilla
 * @param changes Campos a actualizar
 * @returns La plantilla actualizada
 */
export const updateEventTemplate = async (
  id: string,
  changes: Partial<PlantillaEvento>
): Promise<PlantillaEvento> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 350));

  const plantillas = await getEventTemplates();
  const indice = plantillas.findIndex(t => t.id === id);

  if (indice === -1) {
    throw new Error(`Plantilla con ID ${id} no encontrada`);
  }

  // Actualizar campos (excepto id y createdAt que no deben cambiar)
  const { id: _, createdAt: __, ...camposActualizables } = changes;
  plantillas[indice] = {
    ...plantillas[indice],
    ...camposActualizables,
    updatedAt: new Date(),
  };

  guardarPlantillas(plantillas);

  return plantillas[indice];
};

/**
 * Elimina una plantilla
 * 
 * NOTA BACKEND: Endpoint DELETE /api/event-templates/{id}
 * El backend debería:
 * - Validar que la plantilla existe
 * - Validar permisos (solo el creador o admin puede eliminar)
 * - Verificar si hay eventos creados desde esta plantilla (opcional: solo marcar como eliminada)
 * 
 * @param id ID de la plantilla
 * @returns true si se eliminó correctamente
 */
export const deleteEventTemplate = async (id: string): Promise<boolean> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));

  const plantillas = await getEventTemplates();
  const plantillasFiltradas = plantillas.filter(t => t.id !== id);

  if (plantillasFiltradas.length === plantillas.length) {
    throw new Error(`Plantilla con ID ${id} no encontrada`);
  }

  guardarPlantillas(plantillasFiltradas);
  return true;
};

// ============================================================================
// DUPLICACIÓN DE EVENTOS
// ============================================================================

/**
 * Duplica un evento desde una plantilla con opciones de personalización
 * 
 * NOTA BACKEND: Endpoint POST /api/event-templates/{templateId}/duplicate
 * El backend debería:
 * - Cargar la plantilla
 * - Aplicar los overrides proporcionados
 * - Crear el nuevo evento con estado 'borrador'
 * - Asignar nuevo ID y fechas
 * - Limpiar datos de participantes, historial, etc.
 * - Incrementar contador de uso de la plantilla
 * 
 * @param templateId ID de la plantilla a usar
 * @param overrides Campos a sobrescribir en la plantilla
 * @returns El nuevo evento creado
 */
export const duplicarEventoDesdePlantilla = async (
  templateId: string,
  overrides?: Partial<Evento>
): Promise<Evento> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 400));

  const plantillas = await getEventTemplates();
  const plantilla = plantillas.find(t => t.id === templateId);

  if (!plantilla) {
    throw new Error(`Plantilla con ID ${templateId} no encontrada`);
  }

  // Crear nuevo evento basado en la plantilla
  const nuevoEventoData: Omit<Evento, 'id' | 'createdAt' | 'participantes' | 'participantesDetalle' | 'listaEspera'> = {
    ...plantilla.datosEvento,
    ...overrides,
    fechaInicio: overrides?.fechaInicio || new Date(),
    estado: 'borrador', // Siempre empezar como borrador
    plantillaId: templateId,
    archivado: false,
  };

  // Crear el evento
  const nuevoEvento = await createEvent(nuevoEventoData);

  // Incrementar contador de uso de la plantilla
  plantilla.usoFrecuente = (plantilla.usoFrecuente || 0) + 1;
  await updateEventTemplate(templateId, { usoFrecuente: plantilla.usoFrecuente });

  return nuevoEvento;
};

/**
 * Duplica un evento existente con opciones de personalización
 * 
 * NOTA BACKEND: Endpoint POST /api/events/{eventId}/duplicate
 * El backend debería:
 * - Cargar el evento original
 * - Copiar todos los campos excepto participantes, historial, etc.
 * - Aplicar los overrides proporcionados
 * - Crear el nuevo evento con estado 'borrador'
 * - Asignar nuevo ID y fechas
 * - Registrar relación con el evento original (eventoDuplicadoDe)
 * 
 * @param eventId ID del evento a duplicar
 * @param overrides Campos a sobrescribir en el evento duplicado
 * @returns El nuevo evento creado
 */
export const duplicarEvento = async (
  eventId: string,
  overrides?: Partial<Evento>
): Promise<Evento> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 400));

  const eventoOriginal = await getEventById(eventId);

  if (!eventoOriginal) {
    throw new Error(`Evento con ID ${eventId} no encontrado`);
  }

  // Crear nuevo evento basado en el original, excluyendo campos que no deben copiarse
  const {
    id: _,
    createdAt: __,
    participantes: ___,
    participantesDetalle: ____,
    listaEspera: _____,
    historialEstado: ______,
    archivado: _______,
    fechaArchivado: ________,
    ...camposCopiables
  } = eventoOriginal;

  const nuevoEventoData: Omit<Evento, 'id' | 'createdAt' | 'participantes' | 'participantesDetalle' | 'listaEspera'> = {
    ...camposCopiables,
    ...overrides,
    estado: 'borrador', // Siempre empezar como borrador
    eventoDuplicadoDe: eventId,
    nombreEventoOriginal: eventoOriginal.nombre,
    archivado: false,
  };

  // Crear el nuevo evento
  return await createEvent(nuevoEventoData);
};

// ============================================================================
// ENLACES PÚBLICOS Y ARCHIVADO
// ============================================================================

/**
 * Genera un enlace público único para inscripción al evento
 * 
 * NOTA BACKEND: Endpoint POST /api/events/{eventId}/public-link
 * El backend debería:
 * - Generar un slug único y legible
 * - Validar que el slug no esté en uso
 * - Crear registro en tabla event_public_links
 * - Establecer fecha de expiración si es necesario
 * - Habilitar inscripciones públicas en el evento
 * - Retornar URL completa: https://app.com/eventos/{slug}
 * 
 * Para la página pública de registro, se necesita una ruta como:
 * /eventos/inscripcion/{slug} que use getEnlacePublicoPorSlug()
 * 
 * @param eventId ID del evento
 * @returns El enlace público generado con slug
 */
export const generarEnlacePublicoInscripcion = async (
  eventId: string
): Promise<EnlacePublicoEvento> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));

  const evento = await getEventById(eventId);

  if (!evento) {
    throw new Error(`Evento con ID ${eventId} no encontrado`);
  }

  // Generar slug legible a partir del nombre del evento
  const slugBase = evento.nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9]+/g, '-') // Reemplazar espacios y caracteres especiales con guiones
    .replace(/(^-|-$)/g, '') // Remover guiones al inicio y final
    .substring(0, 50); // Limitar longitud

  // Agregar sufijo único para evitar colisiones
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  const slug = `${slugBase}-${timestamp}-${random}`;

  // En producción, aquí se verificaría que el slug sea único
  // const slugExiste = await verificarSlugDisponible(slug);
  // if (slugExiste) { ... }

  // Generar enlace completo (en producción, usaría la URL base de la app)
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const enlaceCompleto = `${baseUrl}/eventos/inscripcion/${slug}`;

  // Actualizar evento con el enlace público
  evento.publicLink = slug;
  evento.inscripcionesPublicasHabilitadas = true;
  await updateEvent(eventId, {
    publicLink: slug,
    inscripcionesPublicasHabilitadas: true,
  });

  // Crear registro de enlace público
  const enlacePublico: EnlacePublicoEvento = {
    eventId,
    slug,
    enlaceCompleto,
    fechaGeneracion: new Date(),
    activo: true,
    contadorAccesos: 0,
  };

  // Guardar enlaces públicos en localStorage (en producción, sería una tabla separada)
  const enlacesStorage = localStorage.getItem('eventPublicLinks');
  const enlaces: EnlacePublicoEvento[] = enlacesStorage ? JSON.parse(enlacesStorage) : [];
  enlaces.push(enlacePublico);
  localStorage.setItem('eventPublicLinks', JSON.stringify(enlaces));

  return enlacePublico;
};

/**
 * Obtiene un evento por su slug de enlace público
 * 
 * NOTA BACKEND: Endpoint GET /api/public/events/{slug}
 * Este endpoint debería ser público (sin autenticación) para permitir
 * que usuarios externos accedan a la página de registro.
 * 
 * La página pública de registro se conectaría así:
 * 1. Obtener slug de la URL
 * 2. Llamar a getEnlacePublicoPorSlug(slug)
 * 3. Mostrar formulario de inscripción si el evento permite inscripciones públicas
 * 4. Al enviar, llamar a inscribirClientePublico(eventId, datosInscripcion)
 * 
 * @param slug Slug del enlace público
 * @returns El evento asociado al slug, o null si no existe
 */
export const getEnlacePublicoPorSlug = async (slug: string): Promise<Evento | null> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));

  // Cargar enlaces públicos
  const enlacesStorage = localStorage.getItem('eventPublicLinks');
  if (!enlacesStorage) {
    return null;
  }

  try {
    const enlaces: EnlacePublicoEvento[] = JSON.parse(enlacesStorage);
    const enlace = enlaces.find(e => e.slug === slug && e.activo);

    if (!enlace) {
      return null;
    }

    // Incrementar contador de accesos
    enlace.contadorAccesos++;
    localStorage.setItem('eventPublicLinks', JSON.stringify(enlaces));

    // Obtener el evento asociado
    const evento = await getEventById(enlace.eventId);

    if (!evento || !evento.inscripcionesPublicasHabilitadas) {
      return null;
    }

    return evento;
  } catch (error) {
    console.error('Error obteniendo evento por slug:', error);
    return null;
  }
};

/**
 * Archiva un evento (marcarlo como archivado sin eliminarlo)
 * 
 * NOTA BACKEND: Endpoint POST /api/events/{id}/archive
 * El backend debería:
 * - Marcar archivado = true
 * - Establecer fechaArchivado
 * - Opcionalmente ocultar el evento de búsquedas normales
 * - Mantener todas las relaciones y datos para auditoría
 * 
 * @param id ID del evento a archivar
 * @returns El evento archivado
 */
export const archivarEvento = async (id: string): Promise<Evento> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));

  const evento = await updateEvent(id, {
    archivado: true,
    fechaArchivado: new Date(),
  });

  return evento;
};

/**
 * Obtiene eventos archivados con filtros opcionales
 * 
 * NOTA BACKEND: Endpoint GET /api/events/archived?{filtros}
 * Similar a getEvents() pero filtrando solo eventos archivados.
 * Podría incluir opciones para restaurar eventos archivados.
 * 
 * @param filtros Filtros opcionales (aplicados además del filtro archivado=true)
 * @returns Array de eventos archivados
 */
export const getEventosArchivados = async (filtros?: Omit<EventFilters, 'archivado'>): Promise<Evento[]> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));

  // Llamar a getEvents con filtro archivado=true y otros filtros adicionales
  return await getEvents({
    ...filtros,
    archivado: true,
  });
};

