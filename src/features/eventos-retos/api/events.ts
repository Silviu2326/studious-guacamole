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

