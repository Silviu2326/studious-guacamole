import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, MetricCards, Button, Modal } from '../../../components/componentsreutilizables';
import { Trophy, Plus, MapPin, Calendar, Users, Video, Target, Search, X, Edit, Trash2, Eye, Copy, EyeOff, CheckCircle, AlertCircle, FileText, DollarSign, Tag, Clock, ChevronDown, History, Bell, Send, UserPlus, UserX, AlertTriangle, UserCheck, FileSpreadsheet, FileText as FileTextIcon, ClipboardCheck, Link, MessageSquare, CheckSquare, BarChart3, TrendingUp, Star, MessageCircle, RefreshCw, Unlink, CheckSquare as CheckSquareIcon, List, PlusCircle, Trash, Package, Archive } from 'lucide-react';
import { Badge } from '../../../components/componentsreutilizables/Badge';
import { Input } from '../../../components/componentsreutilizables/Input';
import { Textarea } from '../../../components/componentsreutilizables/Textarea';
import { Select } from '../../../components/componentsreutilizables/Select';
import { getActiveClients } from '../../gestión-de-clientes/api/clients';
import { Client } from '../../gestión-de-clientes/types';
import { getSegments } from '../../gestión-de-clientes/api/segmentation';
import { ClientSegment } from '../../gestión-de-clientes/types';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { generarPublicLink, guardarEventos, ConfiguracionRecordatoriosEvento, RecordatorioConfiguracionEvento } from '../api/events';
import { getUbicaciones, getUbicacionesFrecuentes, verificarConflictosHorario, getCapacidadMaximaUbicacion, Ubicacion, ConflictoHorario, crearUbicacion, actualizarUbicacion, eliminarUbicacion, marcarUbicacionFrecuente } from '../api/locations';
import { enviarInvitaciones, obtenerEstadisticasInvitaciones, obtenerClientesDeGrupo } from '../services/invitacionesService';
import { crearConfiguracionRecordatoriosPorDefecto, iniciarVerificacionRecordatorios, obtenerHistorialRecordatorios, obtenerEstadisticasRecordatorios } from '../services/recordatoriosService';
import { crearSolicitudConfirmacion, enviarSolicitudConfirmacion, procesarRespuestaConfirmacion, obtenerEstadisticasConfirmacion, puedeEnviarSolicitudConfirmacion } from '../services/confirmacionService';
import { enviarMensajeGrupal, obtenerPlantillas, obtenerHistorialMensajesGrupales, personalizarMensajeGrupal, PLANTILLAS_PREDEFINIDAS } from '../services/mensajesGrupalesService';
import { detectarCambiosRelevantes, enviarNotificacionCambioEvento, CambioEvento } from '../services/notificacionCambioEventoService';
import { calcularEstadisticasTodosEventos, obtenerComparativaEvento, identificarPatronesAsistencia, obtenerDatosGraficoTendencia, EstadisticasAsistenciaEvento } from '../services/estadisticasAsistenciaService';
import { obtenerEncuestaPorEvento, calcularEstadisticasFeedback, enviarEncuestaPostEvento, crearEncuestaPostEvento, guardarEncuesta, iniciarVerificacionEncuestasAutomaticas, verificarYEnviarEncuestasAutomaticas, EstadisticasFeedback } from '../services/feedbackService';
import { calcularRankingEventos, compararTiposEvento, analizarMejoresHorarios, InsightsEventos, RankingEvento, ComparativaTipoEvento, AnalisisHorarios } from '../services/eventosAnalyticsService';
import { sincronizarEventoConCalendario } from '../services/calendarioSyncService';
import { obtenerChecklistsDisponibles, asignarChecklistAEvento, actualizarEstadoItem, guardarPlantillaChecklist, obtenerPlantillasPredefinidas } from '../services/checklistPreparacionService';
import { agregarParticipante as agregarParticipanteService, eliminarParticipante as eliminarParticipanteService, moverParticipanteAListaEspera, moverParticipanteDeListaEspera, DatosCliente } from '../services/participantesService';
import { marcarAsistencia, registrarNoShow, agregarWalkIn, actualizarAsistenciasMasivas, DatosClienteAnonimo } from '../services/checkInService';
import { calcularPrecioParticipante, obtenerPrecioPorTipoCliente, formatearPrecio, obtenerEtiquetaPrecio, obtenerRangoPrecios } from '../services/pricingService';
import { FeedbackResultsModal } from '../components/FeedbackResultsModal';
import { EventAnalyticsModal } from '../components/EventAnalyticsModal';
import { DashboardProgresoRetos } from '../components/DashboardProgresoRetos';
import { DashboardMetricasGenerales } from '../components/DashboardMetricasGenerales';
import { EventosCalendar } from '../components/EventosCalendar';
import { ArchivoEventos } from '../components/ArchivoEventos';
import { EventCommunicationPanel } from '../components/EventCommunicationPanel';
import { PostEventSection } from '../components/PostEventSection';
import { SurveyConfigModal } from '../components/SurveyConfigModal';

type TipoEvento = 'presencial' | 'reto' | 'virtual';
type EstadoEvento = 'borrador' | 'programado' | 'en-curso' | 'finalizado' | 'cancelado';
type TipoCliente = 'regular' | 'premium' | 'vip' | 'general';

// Interfaz para historial de cambios de estado (User Story 1)
interface CambioEstado {
  estadoAnterior: EstadoEvento;
  estadoNuevo: EstadoEvento;
  fechaCambio: Date;
  usuarioId: string;
  usuarioNombre: string;
  motivo?: string;
  notificado: boolean;
}

// Precio por tipo de cliente
interface PreciosPorTipoCliente {
  general?: number; // Precio general (si no hay precios específicos)
  regular?: number;
  premium?: number;
  vip?: number;
}

// Interfaz para participantes del evento
interface Participante {
  id: string;
  nombre: string;
  email?: string;
  telefono?: string; // Teléfono de contacto
  foto?: string;
  confirmado: boolean;
  asistencia?: boolean; // Si asistió al evento (check-in)
  fechaInscripcion: Date;
  fechaCancelacion?: Date; // Fecha de cancelación si fue cancelado
  motivoCancelacion?: string; // Motivo de cancelación
  esNoInscrito?: boolean; // Si fue agregado en el check-in sin estar inscrito
}

// Interfaz para registro de cancelaciones
interface Cancelacion {
  participanteId: string;
  participanteNombre: string;
  fechaCancelacion: Date;
  motivo?: string;
  movidoAEspera: boolean; // Si fue movido a lista de espera
}

interface Evento {
  id: string;
  tipo: TipoEvento;
  nombre: string;
  descripcion: string;
  fechaInicio: Date;
  fechaFin?: Date;
  capacidad: number;
  participantes: string[]; // Mantener para compatibilidad, pero también usar participantesDetalle
  participantesDetalle?: Participante[]; // Información completa de participantes confirmados
  listaEspera?: Participante[]; // Lista de espera cuando el evento está lleno
  cancelaciones?: Cancelacion[]; // Historial de cancelaciones
  estado: EstadoEvento;
  // Campos específicos por tipo
  ubicacion?: string; // presencial
  requisitosFisicos?: string; // presencial
  materialNecesario?: string; // presencial
  plataforma?: string; // virtual
  linkAcceso?: string; // virtual
  requisitosTecnicos?: string; // virtual
  grabacion?: boolean; // virtual
  duracionDias?: number; // reto
  objetivo?: string; // reto
  metricas?: string; // reto
  premios?: string; // reto
  imagen?: string;
  creadoPor: string;
  createdAt: Date;
  // Campos para duplicación
  eventoDuplicadoDe?: string; // ID del evento original
  nombreEventoOriginal?: string; // Nombre del evento original para mostrar
  // Campos de pricing (User Story 2)
  precio?: number; // Precio general (opcional)
  preciosPorTipoCliente?: PreciosPorTipoCliente; // Precios por tipo de cliente
  esGratuito?: boolean; // Indicador de evento gratuito
  // Campo para plantilla
  esPlantilla?: boolean; // Si este evento es una plantilla
  plantillaId?: string; // ID de la plantilla si fue creado desde una
  // Historial de cambios de estado (User Story 1)
  historialEstado?: CambioEstado[];
  // Campos para inscripción pública (User Story 2)
  publicLink?: string; // Link único para inscripción pública
  inscripcionesPublicasHabilitadas?: boolean; // Si las inscripciones públicas están habilitadas
  // Campos para archivado (User Story 2)
  archivado?: boolean;
  fechaArchivado?: Date;
}

// Interfaz para plantillas (User Story 1)
interface PlantillaEvento {
  id: string;
  nombre: string;
  descripcion?: string;
  tipo: TipoEvento;
  datosEvento: Omit<Evento, 'id' | 'participantes' | 'estado' | 'fechaInicio' | 'fechaFin' | 'createdAt' | 'esPlantilla' | 'plantillaId'>;
  creadoPor: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Página principal de Eventos y Retos
 * 
 * ESTRUCTURA ORGANIZADA EN TABS:
 * - Gestión: Listado principal, crear, editar, duplicar, archivar eventos
 * - Calendario: Vista de calendario de eventos con drag & drop
 * - Retos: Gestión específica de retos y seguimiento de progreso
 * - Comunicaciones: Invitaciones, recordatorios, mensajes grupales, confirmaciones
 * - Analytics: Dashboards, métricas generales, analytics de eventos y feedback
 * - Archivo: Eventos archivados con filtros avanzados
 * 
 * ESTADO GLOBAL CENTRALIZADO:
 * - eventoSeleccionado: Evento actualmente seleccionado (compartido entre secciones)
 * - tipoFiltro, busqueda: Filtros globales aplicables a múltiples secciones
 * - tabActivo: Controla qué sección/tab está visible
 * - modalAbierto: Evita conflictos cuando múltiples modales podrían abrirse
 */
export default function EventosRetosPage() {
  const { user } = useAuth();
  const isEntrenador = user?.role === 'entrenador';

  // ============================================
  // ESTADOS PRINCIPALES
  // ============================================
  // Estados globales de carga y error para la carga inicial de datos clave
  const [isLoading, setIsLoading] = useState(true);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [plantillas, setPlantillas] = useState<PlantillaEvento[]>([]);
  const [plantillasChecklist, setPlantillasChecklist] = useState<any[]>([]);
  const [tipoFiltro, setTipoFiltro] = useState<TipoEvento | 'todos'>('todos');
  const [busqueda, setBusqueda] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [eventoEditando, setEventoEditando] = useState<Evento | null>(null);
  const [eventoSeleccionado, setEventoSeleccionado] = useState<Evento | null>(null);
  const [tipoFormulario, setTipoFormulario] = useState<TipoEvento>('presencial');
  const [mostrarVistaPrevia, setMostrarVistaPrevia] = useState(false);
  const [erroresValidacion, setErroresValidacion] = useState<Record<string, string>>({});
  const [mostrarGaleríaPlantillas, setMostrarGaleríaPlantillas] = useState(false);
  const [plantillaEditando, setPlantillaEditando] = useState<PlantillaEvento | null>(null);
  const [nombrePlantilla, setNombrePlantilla] = useState('');
  const [mostrarModalGuardarPlantilla, setMostrarModalGuardarPlantilla] = useState(false);

  // Estados para cambio de estado (User Story 1)
  const [mostrarModalCambioEstado, setMostrarModalCambioEstado] = useState(false);
  const [eventoCambioEstado, setEventoCambioEstado] = useState<Evento | null>(null);
  const [nuevoEstado, setNuevoEstado] = useState<EstadoEvento | null>(null);
  const [notificarParticipantes, setNotificarParticipantes] = useState(false);
  const [motivoCambio, setMotivoCambio] = useState('');
  const [mostrarHistorialEstado, setMostrarHistorialEstado] = useState(false);
  const [eventoHistorial, setEventoHistorial] = useState<Evento | null>(null);

  // Estados para próximos eventos (User Story 2)
  const [mostrarModalParticipantes, setMostrarModalParticipantes] = useState(false);
  const [eventoParticipantes, setEventoParticipantes] = useState<Evento | null>(null);

  // Estados para agregar participantes (User Story 1)
  const [mostrarModalAgregarParticipantes, setMostrarModalAgregarParticipantes] = useState(false);
  const [eventoAgregarParticipantes, setEventoAgregarParticipantes] = useState<Evento | null>(null);
  const [clientesDisponibles, setClientesDisponibles] = useState<Client[]>([]);
  const [clientesSeleccionados, setClientesSeleccionados] = useState<string[]>([]);
  const [busquedaClientes, setBusquedaClientes] = useState('');
  const [cargandoClientes, setCargandoClientes] = useState(false);

  // Estados para eliminar participantes (User Story US-ER-09)
  const [mostrarModalEliminarParticipante, setMostrarModalEliminarParticipante] = useState(false);
  const [participanteAEliminar, setParticipanteAEliminar] = useState<{ eventoId: string, participante: Participante } | null>(null);
  const [moverAEspera, setMoverAEspera] = useState(false);
  const [motivoCancelacionInput, setMotivoCancelacionInput] = useState('');

  // Estados para check-in (User Story 1)
  const [mostrarModalCheckin, setMostrarModalCheckin] = useState(false);
  const [eventoCheckin, setEventoCheckin] = useState<Evento | null>(null);
  const [asistenciasCheckin, setAsistenciasCheckin] = useState<Record<string, boolean>>({});
  const [nuevoParticipanteNombre, setNuevoParticipanteNombre] = useState('');
  const [nuevoParticipanteEmail, setNuevoParticipanteEmail] = useState('');
  const [nuevoParticipanteTelefono, setNuevoParticipanteTelefono] = useState('');
  const [mostrarFormularioNoInscrito, setMostrarFormularioNoInscrito] = useState(false);

  // ============================================
  // ESTADOS PARA COMUNICACIONES
  // ============================================

  // Estados para invitaciones (User Story 1)
  const [mostrarModalInvitaciones, setMostrarModalInvitaciones] = useState(false);
  const [eventoInvitaciones, setEventoInvitaciones] = useState<Evento | null>(null);
  const [destinatariosSeleccionados, setDestinatariosSeleccionados] = useState<Array<{ id: string; nombre: string; email?: string; telefono?: string; tipo: 'cliente' | 'grupo' }>>([]);
  const [plantillaInvitacion, setPlantillaInvitacion] = useState('Hola {nombre},\n\nTe invitamos a nuestro evento "{eventoNombre}" que se realizará el {fecha} a las {hora} en {ubicacion}.\n\n{eventoDescripcion}\n\n¡Esperamos verte allí!\n\nSaludos,\nEquipo de Entrenamiento');
  const [canalInvitacion, setCanalInvitacion] = useState<'email' | 'whatsapp' | 'ambos'>('ambos');
  const [clientesDisponiblesInvitaciones, setClientesDisponiblesInvitaciones] = useState<Client[]>([]);
  const [gruposDisponibles, setGruposDisponibles] = useState<ClientSegment[]>([]);
  const [tipoSelectorInvitaciones, setTipoSelectorInvitaciones] = useState<'clientes' | 'grupos' | 'ambos'>('ambos');
  const [busquedaInvitaciones, setBusquedaInvitaciones] = useState('');
  const [enviandoInvitaciones, setEnviandoInvitaciones] = useState(false);
  const [mostrarHistorialInvitaciones, setMostrarHistorialInvitaciones] = useState(false);

  // Estados para recordatorios (User Story 2)
  const [recordatoriosConfig, setRecordatoriosConfig] = useState<ConfiguracionRecordatoriosEvento | null>(null);
  const [mostrarHistorialRecordatorios, setMostrarHistorialRecordatorios] = useState(false);
  const [eventoHistorialRecordatorios, setEventoHistorialRecordatorios] = useState<Evento | null>(null);

  // Estados para link público (User Story 2)
  const [linkCopiado, setLinkCopiado] = useState(false);

  // Estados para solicitud de confirmación (User Story 1)
  const [mostrarModalConfirmacion, setMostrarModalConfirmacion] = useState(false);
  const [eventoConfirmacion, setEventoConfirmacion] = useState<Evento | null>(null);
  const [diasAnticipacionConfirmacion, setDiasAnticipacionConfirmacion] = useState(3);
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState('Hola {nombre},\n\nTe contactamos para confirmar tu asistencia al evento "{eventoNombre}" que se realizará el {fecha} a las {hora}.\n\nPor favor, confirma si podrás asistir respondiendo:\n- "Confirmo" si asistirás\n- "No puedo" si no podrás asistir\n\n¡Esperamos tu respuesta!\n\nSaludos,\nEquipo de Entrenamiento');
  const [canalConfirmacion, setCanalConfirmacion] = useState<'email' | 'whatsapp' | 'ambos'>('ambos');
  const [enviandoConfirmacion, setEnviandoConfirmacion] = useState(false);

  // Estados para mensajes grupales (User Story 2)
  const [mostrarModalMensajeGrupal, setMostrarModalMensajeGrupal] = useState(false);
  const [eventoMensajeGrupal, setEventoMensajeGrupal] = useState<Evento | null>(null);
  const [mensajeGrupalTexto, setMensajeGrupalTexto] = useState('');
  const [canalMensajeGrupal, setCanalMensajeGrupal] = useState<'email' | 'whatsapp' | 'ambos'>('ambos');
  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState<string>('');
  const [categoriaPlantilla, setCategoriaPlantilla] = useState<'general' | 'cambio' | 'instrucciones' | 'motivacion' | 'recordatorio' | 'todas'>('todas');
  const [enviandoMensajeGrupal, setEnviandoMensajeGrupal] = useState(false);
  const [mostrarHistorialMensajes, setMostrarHistorialMensajes] = useState(false);
  const [tituloMensajeGrupal, setTituloMensajeGrupal] = useState('');

  // Estados para notificación de cambio de evento (User Story 1)
  const [mostrarModalNotificacionCambio, setMostrarModalNotificacionCambio] = useState(false);
  const [cambioEventoDetectado, setCambioEventoDetectado] = useState<CambioEvento | null>(null);
  const [eventoAGuardarPendiente, setEventoAGuardarPendiente] = useState<Evento | null>(null);
  const [notificarCambioEvento, setNotificarCambioEvento] = useState(true);
  const [motivoCambioEvento, setMotivoCambioEvento] = useState('');
  const [canalNotificacionCambio, setCanalNotificacionCambio] = useState<'email' | 'whatsapp' | 'ambos'>('ambos');
  const [enviandoNotificacionCambio, setEnviandoNotificacionCambio] = useState(false);

  // Estado para panel de comunicaciones centralizado
  const [mostrarPanelComunicaciones, setMostrarPanelComunicaciones] = useState(false);
  const [eventoComunicaciones, setEventoComunicaciones] = useState<Evento | null>(null);

  // Estados para estadísticas de asistencia (User Story 2)
  const [mostrarModalEstadisticas, setMostrarModalEstadisticas] = useState(false);
  const [eventoEstadisticas, setEventoEstadisticas] = useState<Evento | null>(null);
  const [estadisticasEvento, setEstadisticasEvento] = useState<EstadisticasAsistenciaEvento | null>(null);

  // Estados para feedback post-evento (User Story 1)
  const [mostrarModalFeedback, setMostrarModalFeedback] = useState(false);
  const [eventoFeedbackId, setEventoFeedbackId] = useState<string | null>(null);

  // Estados para analytics de eventos (User Story 2)
  const [mostrarModalAnalytics, setMostrarModalAnalytics] = useState(false);
  const [eventoAnalyticsId, setEventoAnalyticsId] = useState<string | null>(null);

  // Estados para configuración de encuestas post-evento
  const [mostrarModalConfigurarEncuesta, setMostrarModalConfigurarEncuesta] = useState(false);
  const [eventoConfigurarEncuesta, setEventoConfigurarEncuesta] = useState<Evento | null>(null);

  // ============================================
  // ESTADOS PARA ANALYTICS Y RETOS
  // ============================================

  // Estados para dashboard de progreso de retos (User Story US-ER-23)
  const [mostrarDashboardProgresoRetos, setMostrarDashboardProgresoRetos] = useState(false);
  const [eventoProgresoRetos, setEventoProgresoRetos] = useState<Evento | null>(null);

  // Estados para dashboard de métricas generales (User Story US-ER-24)
  const [mostrarDashboardMetricasGenerales, setMostrarDashboardMetricasGenerales] = useState(false);

  // Estados para sincronización con Google Calendar (User Story 1)
  const [sincronizandoCalendario, setSincronizandoCalendario] = useState(false);
  const [errorSincronizacion, setErrorSincronizacion] = useState<string | null>(null);
  const [conexionCalendario, setConexionCalendario] = useState<any | null>(null);

  // Estados para checklist de preparación (User Story 2)
  const [mostrarModalChecklist, setMostrarModalChecklist] = useState(false);
  const [eventoChecklist, setEventoChecklist] = useState<Evento | null>(null);
  const [mostrarModalPlantillasChecklist, setMostrarModalPlantillasChecklist] = useState(false);
  const [editandoItemChecklist, setEditandoItemChecklist] = useState<string | null>(null);

  // Estados para calendario (User Story 1)
  const [tipoFiltroCalendario, setTipoFiltroCalendario] = useState<TipoEvento | 'todos'>('todos');

  // ============================================
  // ESTADO GLOBAL CENTRALIZADO
  // ============================================

  /**
   * Tab activo - Controla qué sección principal se muestra
   * Las secciones están organizadas para facilitar la navegación y comprensión
   */
  type TabActivo = 'gestion' | 'calendario' | 'retos' | 'comunicaciones' | 'analytics' | 'archivo';
  const [tabActivo, setTabActivo] = useState<TabActivo>('gestion');

  /**
   * Estado global: modal abierto
   * Evita conflictos cuando múltiples modales podrían intentar abrirse simultáneamente
   */
  const [modalAbierto, setModalAbierto] = useState<string | null>(null);

  // Estados para archivado (User Story 2)
  const [busquedaArchivo, setBusquedaArchivo] = useState('');
  const [fechaDesdeArchivo, setFechaDesdeArchivo] = useState<string>('');
  const [fechaHastaArchivo, setFechaHastaArchivo] = useState<string>('');
  const [rendimientoFiltroArchivo, setRendimientoFiltroArchivo] = useState<'todos' | 'alto' | 'medio' | 'bajo'>('todos');

  // Estados para gestión de ubicaciones (User Story 1)
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
  const [ubicacionesFrecuentes, setUbicacionesFrecuentes] = useState<Ubicacion[]>([]);
  const [conflictosHorario, setConflictosHorario] = useState<ConflictoHorario[]>([]);
  const [mostrarModalGestionUbicaciones, setMostrarModalGestionUbicaciones] = useState(false);
  const [mostrarFormularioUbicacion, setMostrarFormularioUbicacion] = useState(false);
  const [ubicacionEditando, setUbicacionEditando] = useState<Ubicacion | null>(null);
  const [tipoFiltroArchivo, setTipoFiltroArchivo] = useState<TipoEvento | 'todos'>('todos');

  // Estado del formulario
  const [formData, setFormData] = useState<Partial<Evento>>({
    tipo: 'presencial',
    nombre: '',
    descripcion: '',
    fechaInicio: new Date(),
    capacidad: 50,
    estado: 'borrador',
    creadoPor: user?.id || '',
    precio: undefined,
    preciosPorTipoCliente: {},
    esGratuito: false,
  });

  useEffect(() => {
    cargarEventos();
    cargarPlantillas();
    cargarUbicaciones();
    cargarClientesYGrupos();

    // Inicializar servicio de recordatorios automáticos
    const intervaloRecordatorios = iniciarVerificacionRecordatorios();

    // Inicializar servicio de encuestas automáticas
    const intervaloEncuestas = iniciarVerificacionEncuestasAutomaticas();

    return () => {
      if (intervaloRecordatorios) {
        clearInterval(intervaloRecordatorios);
      }
      if (intervaloEncuestas) {
        clearInterval(intervaloEncuestas);
      }
    };
  }, []);

  // Verificar encuestas automáticas cuando cambien los eventos
  useEffect(() => {
    if (eventos.length > 0) {
      verificarYEnviarEncuestasAutomaticas(eventos);
      // TODO: Verificar recordatorios de preparación
      // verificarYEnviarRecordatoriosPreparacion(eventos);
    }
  }, [eventos.length]); // Solo dependemos de la longitud para evitar loops infinitos

  // Cargar plantillas de checklist y verificar conexión de calendario
  useEffect(() => {
    const cargarDatosAdicionales = async () => {
      try {
        // Cargar plantillas de checklist
        const plantillas = await obtenerChecklistsDisponibles();

        // Si no hay plantillas, crear las predefinidas
        if (plantillas.length === 0) {
          const plantillasPredefinidas = obtenerPlantillasPredefinidas();
          for (const plantilla of plantillasPredefinidas) {
            await guardarPlantillaChecklist({
              ...plantilla,
              creadoPor: user?.id || 'system',
            });
          }
          const plantillasCargadas = await obtenerChecklistsDisponibles();
          setPlantillasChecklist(plantillasCargadas);
        } else {
          setPlantillasChecklist(plantillas);
        }

        // TODO: Verificar conexión de calendario
        // const conexion = await conectarGoogleCalendarSiNecesario(user?.id);
        // if (conexion.yaConectado) {
        //   setConexionCalendario({ id: conexion.conexionId });
        // }
      } catch (error) {
        console.error('Error cargando datos adicionales:', error);
      }
    };

    cargarDatosAdicionales();
  }, [user?.id]);

  const cargarClientesYGrupos = async () => {
    try {
      const [clientes, grupos] = await Promise.all([
        getActiveClients(user?.role || 'entrenador', user?.id),
        getSegments(user?.role || 'entrenador', user?.id),
      ]);
      setClientesDisponiblesInvitaciones(clientes);
      setGruposDisponibles(grupos);
    } catch (error) {
      console.error('Error cargando clientes y grupos:', error);
    }
  };

  // Hook para actualizar countdown en tiempo real (User Story 2)
  const [countdownTime, setCountdownTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdownTime(new Date());
    }, 1000); // Actualizar cada segundo
    return () => clearInterval(interval);
  }, []);

  const cargarEventos = async () => {
    setIsLoading(true);
    setGlobalError(null);

    try {
      // Intentar cargar eventos desde localStorage primero
      const eventosStorage = localStorage.getItem('eventos');
      if (eventosStorage) {
        try {
          const eventosData = JSON.parse(eventosStorage);
          // Convertir fechas de string a Date
          const eventosParsed = eventosData.map((e: any) => ({
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
          setEventos(eventosParsed);
          setIsLoading(false);
          return;
        } catch (error) {
          console.error('Error cargando eventos de localStorage:', error);
          throw new Error('Error al cargar eventos desde el almacenamiento local');
        }
      }

      // Si no hay eventos en localStorage, crear datos de ejemplo
      // TODO: Implementar llamada a API
      const ahora = new Date();
      const en7Dias = new Date();
      en7Dias.setDate(ahora.getDate() + 7);
      const en3Dias = new Date();
      en3Dias.setDate(ahora.getDate() + 3);
      const en5Dias = new Date();
      en5Dias.setDate(ahora.getDate() + 5);

      // Cargar clientes para crear participantesDetalle
      let clientesEjemplo: Client[] = [];
      try {
        clientesEjemplo = await getActiveClients(user?.role || 'entrenador', user?.id);
      } catch (error) {
        console.error('Error cargando clientes para eventos de ejemplo:', error);
      }

      // Crear participantes de ejemplo usando los primeros clientes disponibles
      const crearParticipantes = (ids: string[]): Participante[] => {
        if (ids.length === 0) return [];

        return ids.map((id, index) => {
          // Buscar cliente por ID primero
          let cliente = clientesEjemplo.find(c => c.id === id);

          // Si no se encuentra, usar un cliente por índice (si hay clientes disponibles)
          if (!cliente && clientesEjemplo.length > 0) {
            cliente = clientesEjemplo[index % clientesEjemplo.length];
          }

          if (cliente) {
            return {
              id: cliente.id,
              nombre: cliente.name,
              email: cliente.email,
              telefono: cliente.phone,
              foto: undefined,
              confirmado: index % 2 === 0, // Alternar confirmación
              asistencia: false,
              fechaInscripcion: new Date(ahora.getTime() - (index + 1) * 24 * 60 * 60 * 1000),
              esNoInscrito: false,
            };
          }

          // Si no hay cliente, crear participante básico
          return {
            id,
            nombre: `Participante ${index + 1}`,
            confirmado: false,
            asistencia: false,
            fechaInscripcion: new Date(ahora.getTime() - (index + 1) * 24 * 60 * 60 * 1000),
            esNoInscrito: false,
          };
        });
      };

      // Usar IDs de clientes reales si están disponibles, sino usar IDs de ejemplo
      const clientesIds = clientesEjemplo.length > 0
        ? clientesEjemplo.slice(0, 4).map(c => c.id)
        : ['client_1', 'client_4', 'client_5', 'client_2'];

      const participantesEvento1 = crearParticipantes([
        clientesIds[0] || 'client_1',
        clientesIds[1] || 'client_4',
        clientesIds[2] || 'client_5'
      ].filter(Boolean));
      const participantesEvento2 = crearParticipantes([
        clientesIds[2] || 'client_1',
        clientesIds[3] || 'client_4'
      ].filter(Boolean));
      const participantesEvento3 = crearParticipantes(clientesIds.slice(0, 4).filter(Boolean));
      const participantesEvento4 = crearParticipantes([
        clientesIds[0] || 'client_1',
        clientesIds[1] || 'client_4'
      ].filter(Boolean));

      const eventosEjemplo = [
        {
          id: '1',
          tipo: 'presencial',
          nombre: 'Maratón de Fuerza',
          descripcion: 'Evento de levantamiento de pesas',
          fechaInicio: en3Dias,
          capacidad: 50,
          participantes: participantesEvento1.map(p => p.id),
          participantesDetalle: participantesEvento1,
          estado: 'programado',
          ubicacion: 'Sala Principal',
          requisitosFisicos: 'Nivel intermedio',
          materialNecesario: 'Pesas y barras',
          creadoPor: user?.id || '',
          createdAt: new Date(),
          precio: 25,
          esGratuito: false,
          historialEstado: [
            {
              estadoAnterior: 'borrador',
              estadoNuevo: 'programado',
              fechaCambio: new Date(ahora.getTime() - 2 * 24 * 60 * 60 * 1000),
              usuarioId: user?.id || '',
              usuarioNombre: user?.name || 'Usuario',
              notificado: true,
            },
          ],
        },
        {
          id: '2',
          tipo: 'reto',
          nombre: 'Reto 30 Días',
          descripcion: 'Desafío de 30 días de entrenamiento',
          fechaInicio: new Date(ahora.getTime() - 5 * 24 * 60 * 60 * 1000),
          fechaFin: new Date(ahora.getTime() + 25 * 24 * 60 * 60 * 1000),
          capacidad: 100,
          participantes: participantesEvento2.map(p => p.id),
          participantesDetalle: participantesEvento2,
          estado: 'en-curso',
          duracionDias: 30,
          objetivo: 'Mejora general de condición física',
          metricas: 'Entrenamientos, pasos, hidratación',
          premios: 'Certificado y descuento',
          creadoPor: user?.id || '',
          createdAt: new Date(),
          precio: 49,
          preciosPorTipoCliente: {
            regular: 49,
            premium: 39,
            vip: 29,
          },
          esGratuito: false,
          historialEstado: [
            {
              estadoAnterior: 'programado',
              estadoNuevo: 'en-curso',
              fechaCambio: new Date(ahora.getTime() - 5 * 24 * 60 * 60 * 1000),
              usuarioId: user?.id || '',
              usuarioNombre: user?.name || 'Usuario',
              notificado: true,
            },
          ],
        },
        {
          id: '3',
          tipo: 'virtual',
          nombre: 'Webinar de Nutrición',
          descripcion: 'Sesión online sobre nutrición deportiva',
          fechaInicio: en5Dias,
          capacidad: 100,
          participantes: participantesEvento3.map(p => p.id),
          participantesDetalle: participantesEvento3,
          estado: 'programado',
          plataforma: 'Zoom',
          linkAcceso: 'https://zoom.us/j/123456',
          requisitosTecnicos: 'Conexión estable a internet',
          grabacion: true,
          creadoPor: user?.id || '',
          createdAt: new Date(),
          esGratuito: true,
          historialEstado: [
            {
              estadoAnterior: 'borrador',
              estadoNuevo: 'programado',
              fechaCambio: new Date(ahora.getTime() - 1 * 24 * 60 * 60 * 1000),
              usuarioId: user?.id || '',
              usuarioNombre: user?.name || 'Usuario',
              notificado: false,
            },
          ],
        },
        {
          id: '4',
          tipo: 'presencial',
          nombre: 'Clase de Spinning',
          descripcion: 'Clase intensiva de spinning',
          fechaInicio: new Date(ahora.getTime() + 2 * 60 * 60 * 1000), // En 2 horas
          capacidad: 30,
          participantes: participantesEvento4.map(p => p.id),
          participantesDetalle: participantesEvento4,
          estado: 'programado',
          ubicacion: 'Sala de Spinning',
          creadoPor: user?.id || '',
          createdAt: new Date(),
          precio: 15,
          esGratuito: false,
          listaEspera: [], // Inicializar lista de espera vacía
          cancelaciones: [], // Inicializar cancelaciones vacías
        },
      ];

      setEventos(eventosEjemplo);
      // Guardar en localStorage
      guardarEventos(eventosEjemplo);
      setIsLoading(false);
    } catch (error) {
      console.error('Error cargando eventos:', error);
      setGlobalError(error instanceof Error ? error.message : 'Error al cargar los eventos. Por favor, intenta de nuevo.');
      setIsLoading(false);
    }
  };

  const cargarPlantillas = async () => {
    // TODO: Implementar llamada a API
    // Por ahora, datos de ejemplo
    const plantillasStorage = localStorage.getItem('plantillas-eventos');
    if (plantillasStorage) {
      try {
        const plantillasData = JSON.parse(plantillasStorage);
        setPlantillas(plantillasData);
      } catch (error) {
        console.error('Error cargando plantillas:', error);
      }
    }
  };

  const cargarUbicaciones = async () => {
    try {
      const ubicacionesData = await getUbicaciones();
      setUbicaciones(ubicacionesData);
      const frecuentes = await getUbicacionesFrecuentes();
      setUbicacionesFrecuentes(frecuentes);
    } catch (error) {
      console.error('Error cargando ubicaciones:', error);
    }
  };

  const guardarPlantillas = (plantillasData: PlantillaEvento[]) => {
    localStorage.setItem('plantillas-eventos', JSON.stringify(plantillasData));
    setPlantillas(plantillasData);
  };

  // ============================================
  // FILTROS Y DATOS COMPUTADOS
  // ============================================

  // Filtrar eventos según la sección activa y filtros globales
  const eventosFiltrados = useMemo(() => {
    let filtrados = eventos;

    // Excluir eventos archivados de la vista principal (solo en sección Archivo se muestran)
    if (tabActivo !== 'archivo') {
      filtrados = filtrados.filter(e => !e.archivado);
    } else {
      // En vista de archivo, solo mostrar archivados
      filtrados = filtrados.filter(e => e.archivado);
    }

    // Filtro por tipo
    if (tipoFiltro !== 'todos') {
      filtrados = filtrados.filter(e => e.tipo === tipoFiltro);
    }

    // Filtro por búsqueda
    if (busqueda) {
      filtrados = filtrados.filter(
        e =>
          e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
          e.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
          (e.ubicacion && e.ubicacion.toLowerCase().includes(busqueda.toLowerCase()))
      );
    }

    return filtrados;
  }, [eventos, tipoFiltro, busqueda, tabActivo]);

  const metricas = useMemo(
    () => {
      // Calcular ingresos proyectados (User Story 2)
      const ingresosProyectados = eventos.reduce((total, evento) => {
        if (evento.esGratuito) return total;

        const participantesInscritos = evento.participantes.length;
        let precioPromedio = 0;

        if (evento.preciosPorTipoCliente) {
          // Calcular precio promedio basado en precios por tipo
          const precios = Object.values(evento.preciosPorTipoCliente).filter(p => p !== undefined) as number[];
          if (precios.length > 0) {
            precioPromedio = precios.reduce((sum, p) => sum + p, 0) / precios.length;
          }
        } else if (evento.precio) {
          precioPromedio = evento.precio;
        }

        return total + (precioPromedio * participantesInscritos);
      }, 0);

      // Incluir eventos archivados en las estadísticas
      const eventosIncluyendoArchivados = eventos;
      const eventosActivos = eventosIncluyendoArchivados.filter(e => !e.archivado && (e.estado === 'programado' || e.estado === 'en-curso'));

      return [
        {
          title: 'Total Eventos',
          value: eventosIncluyendoArchivados.length.toString(),
          icon: <Trophy className="w-5 h-5" />,
          trend: 'up' as const,
          trendValue: '+0%',
          color: 'blue' as const,
        },
        {
          title: 'Eventos Activos',
          value: eventosActivos.length.toString(),
          icon: <Calendar className="w-5 h-5" />,
          trend: 'up' as const,
          trendValue: '+0%',
          color: 'green' as const,
        },
        {
          title: 'Total Participantes',
          value: eventosIncluyendoArchivados.reduce((sum, e) => sum + (e.participantesDetalle?.length || e.participantes.length), 0).toString(),
          icon: <Users className="w-5 h-5" />,
          trend: 'neutral' as const,
          trendValue: '0%',
          color: 'purple' as const,
        },
        {
          title: 'Ingresos Proyectados',
          value: `€${ingresosProyectados.toFixed(2)}`,
          icon: <DollarSign className="w-5 h-5" />,
          trend: 'neutral' as const,
          trendValue: '0%',
          color: 'green' as const,
        },
      ];
    },
    [eventos]
  );

  // Función de validación
  const validarFormulario = (esPublicar: boolean = false): boolean => {
    const errores: Record<string, string> = {};

    // Solo validar campos obligatorios si se va a publicar
    if (esPublicar) {
      // Validaciones comunes obligatorias
      if (!formData.nombre || formData.nombre.trim().length === 0) {
        errores.nombre = 'El nombre del evento es obligatorio';
      }

      if (!formData.descripcion || formData.descripcion.trim().length === 0) {
        errores.descripcion = 'La descripción es obligatoria';
      }

      if (!formData.fechaInicio) {
        errores.fechaInicio = 'La fecha de inicio es obligatoria';
      } else if (new Date(formData.fechaInicio) < new Date()) {
        errores.fechaInicio = 'La fecha de inicio no puede ser en el pasado';
      }

      if (!formData.capacidad || formData.capacidad <= 0) {
        errores.capacidad = 'La capacidad debe ser mayor a 0';
      }

      // Validaciones específicas por tipo
      if (tipoFormulario === 'presencial') {
        if (!formData.ubicacionId && !formData.ubicacion) {
          errores.ubicacion = 'La ubicación es obligatoria para eventos presenciales';
        }
        // Validar que la capacidad no exceda la capacidad máxima de la ubicación
        if (formData.ubicacionId && formData.ubicacionDetalle) {
          if (formData.capacidad && formData.capacidad > formData.ubicacionDetalle.capacidadMaxima) {
            errores.capacidad = `La capacidad no puede exceder ${formData.ubicacionDetalle.capacidadMaxima} personas (capacidad máxima de la ubicación)`;
          }
        }
        // Validar conflictos de horario
        if (conflictosHorario.length > 0) {
          errores.ubicacion = 'Existen conflictos de horario en la ubicación seleccionada';
        }
      }

      if (tipoFormulario === 'virtual') {
        if (!formData.plataforma || formData.plataforma.trim().length === 0) {
          errores.plataforma = 'La plataforma es obligatoria para eventos virtuales';
        }
        if (!formData.linkAcceso || formData.linkAcceso.trim().length === 0) {
          errores.linkAcceso = 'El link de acceso es obligatorio para eventos virtuales';
        }
      }

      if (tipoFormulario === 'reto') {
        if (!formData.duracionDias || formData.duracionDias <= 0) {
          errores.duracionDias = 'La duración en días es obligatoria para retos';
        }
        if (!formData.objetivo || formData.objetivo.trim().length === 0) {
          errores.objetivo = 'El objetivo es obligatorio para retos';
        }
      }
    }

    setErroresValidacion(errores);
    return Object.keys(errores).length === 0;
  };

  const handleNuevoEvento = (tipo: TipoEvento) => {
    setTipoFormulario(tipo);
    const configRecordatoriosPorDefecto = crearConfiguracionRecordatoriosPorDefecto();
    setRecordatoriosConfig(configRecordatoriosPorDefecto);
    setFormData({
      tipo,
      nombre: '',
      descripcion: '',
      fechaInicio: new Date(),
      capacidad: 50,
      estado: 'borrador',
      creadoPor: user?.id || '',
      precio: undefined,
      preciosPorTipoCliente: {},
      esGratuito: false,
      recordatoriosConfiguracion: configRecordatoriosPorDefecto,
    });
    setEventoEditando(null);
    setErroresValidacion({});
    setMostrarVistaPrevia(false);
    setMostrarFormulario(true);
  };

  // Funciones para gestión de plantillas (User Story 1)
  const handleGuardarComoPlantilla = () => {
    if (!formData.nombre || formData.nombre.trim().length === 0) {
      alert('Por favor, ingresa un nombre para la plantilla');
      return;
    }
    setNombrePlantilla(formData.nombre);
    setMostrarModalGuardarPlantilla(true);
  };

  const confirmarGuardarPlantilla = () => {
    const nombre = nombrePlantilla.trim() || formData.nombre || 'Plantilla sin nombre';
    const nuevaPlantilla: PlantillaEvento = {
      id: Date.now().toString(),
      nombre,
      descripcion: formData.descripcion,
      tipo: formData.tipo as TipoEvento,
      datosEvento: {
        ...formData,
        nombre,
      } as Omit<Evento, 'id' | 'participantes' | 'estado' | 'fechaInicio' | 'fechaFin' | 'createdAt' | 'esPlantilla' | 'plantillaId'>,
      creadoPor: user?.id || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const nuevasPlantillas = [...plantillas, nuevaPlantilla];
    guardarPlantillas(nuevasPlantillas);
    setMostrarModalGuardarPlantilla(false);
    setNombrePlantilla('');
    alert('Plantilla guardada exitosamente');
  };

  const handleCrearDesdePlantilla = (plantilla: PlantillaEvento) => {
    const nuevaFechaInicio = new Date();
    nuevaFechaInicio.setDate(nuevaFechaInicio.getDate() + 7);

    setTipoFormulario(plantilla.tipo);
    setFormData({
      ...plantilla.datosEvento,
      nombre: `${plantilla.nombre} - ${new Date().toLocaleDateString('es-ES')}`,
      fechaInicio: nuevaFechaInicio,
      fechaFin: undefined,
      participantes: [],
      estado: 'borrador',
      plantillaId: plantilla.id,
    });
    setEventoEditando(null);
    setErroresValidacion({});
    setMostrarVistaPrevia(false);
    setMostrarGaleríaPlantillas(false);
    setMostrarFormulario(true);
  };

  const handleEliminarPlantilla = (plantillaId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta plantilla?')) {
      const nuevasPlantillas = plantillas.filter(p => p.id !== plantillaId);
      guardarPlantillas(nuevasPlantillas);
    }
  };

  const handleEditarPlantilla = (plantilla: PlantillaEvento) => {
    setPlantillaEditando(plantilla);
    setTipoFormulario(plantilla.tipo);
    setFormData({
      ...plantilla.datosEvento,
      nombre: plantilla.nombre,
    });
    setEventoEditando(null);
    setErroresValidacion({});
    setMostrarVistaPrevia(false);
    setMostrarGaleríaPlantillas(false);
    setMostrarFormulario(true);
  };

  const handleEditarEvento = (evento: Evento) => {
    setEventoEditando(evento);
    setTipoFormulario(evento.tipo);
    setFormData({
      ...evento,
      // Asegurar que checklist y sincronización de calendario estén incluidos
      checklistPreparacion: evento.checklistPreparacion || undefined,
      sincronizacionCalendario: evento.sincronizacionCalendario || undefined,
    });
    // Cargar configuración de recordatorios si existe
    if (evento.recordatoriosConfiguracion) {
      setRecordatoriosConfig(evento.recordatoriosConfiguracion);
    } else {
      setRecordatoriosConfig(crearConfiguracionRecordatoriosPorDefecto());
    }
    setErroresValidacion({});
    setMostrarVistaPrevia(false);
    setMostrarFormulario(true);
  };

  const handleDuplicarEvento = (evento: Evento) => {
    const nuevoFechaInicio = new Date();
    nuevoFechaInicio.setDate(nuevoFechaInicio.getDate() + 7); // Fecha por defecto: 7 días desde hoy

    // Remover el sufijo "(Copia)" si ya existe para evitar "(Copia) (Copia)"
    const nombreBase = evento.nombre.replace(/\s*\(Copia\)\s*$/, '');

    setTipoFormulario(evento.tipo);
    setFormData({
      ...evento,
      id: '', // Se generará nuevo ID al guardar
      nombre: `${nombreBase} (Copia)`,
      fechaInicio: nuevoFechaInicio,
      fechaFin: undefined,
      participantes: [], // Limpiar participantes
      estado: 'borrador',
      eventoDuplicadoDe: evento.id,
      nombreEventoOriginal: nombreBase,
      createdAt: new Date(),
    });
    setEventoEditando(null);
    setErroresValidacion({});
    setMostrarVistaPrevia(false);
    setMostrarFormulario(true);
  };

  const handleGuardarBorrador = async () => {
    try {
      // Si es un evento nuevo o duplicado, generar nuevo ID
      const nuevoId = eventoEditando?.id || (formData.id && formData.id !== '' ? formData.id : Date.now().toString());

      const eventoAGuardar: Evento = {
        ...formData,
        id: nuevoId,
        estado: 'borrador',
        participantes: eventoEditando?.participantes || [],
        createdAt: eventoEditando?.createdAt || new Date(),
      } as Evento;

      let eventosActualizados: Evento[];
      if (eventoEditando && eventoEditando.id) {
        // Actualizar evento existente
        eventosActualizados = eventos.map(e => (e.id === eventoEditando.id ? eventoAGuardar : e));
      } else {
        // Nuevo evento (incluye duplicados)
        eventosActualizados = [...eventos, eventoAGuardar];
      }

      setEventos(eventosActualizados);
      // Guardar en localStorage
      guardarEventos(eventosActualizados);

      // Si estamos editando una plantilla, actualizarla
      if (plantillaEditando) {
        const plantillaActualizada: PlantillaEvento = {
          ...plantillaEditando,
          nombre: formData.nombre || plantillaEditando.nombre,
          descripcion: formData.descripcion,
          tipo: formData.tipo as TipoEvento,
          datosEvento: {
            ...formData,
            nombre: formData.nombre || plantillaEditando.nombre,
          } as Omit<Evento, 'id' | 'participantes' | 'estado' | 'fechaInicio' | 'fechaFin' | 'createdAt' | 'esPlantilla' | 'plantillaId'>,
          updatedAt: new Date(),
        };
        const nuevasPlantillas = plantillas.map(p =>
          p.id === plantillaEditando.id ? plantillaActualizada : p
        );
        guardarPlantillas(nuevasPlantillas);
        setPlantillaEditando(null);
      }

      setMostrarFormulario(false);
      setEventoEditando(null);
      setErroresValidacion({});
      setFormData({
        tipo: 'presencial',
        nombre: '',
        descripcion: '',
        fechaInicio: new Date(),
        capacidad: 50,
        estado: 'borrador',
        creadoPor: user?.id || '',
        precio: undefined,
        preciosPorTipoCliente: {},
        esGratuito: false,
      });
    } catch (error) {
      console.error('Error al guardar borrador:', error);
      alert('Error al guardar el borrador');
    }
  };

  const handlePublicar = async () => {
    // Si estamos editando una plantilla, no validar como evento
    if (!plantillaEditando && !validarFormulario(true)) {
      return;
    }

    try {
      // Si estamos editando una plantilla, actualizarla y no crear evento
      if (plantillaEditando) {
        const plantillaActualizada: PlantillaEvento = {
          ...plantillaEditando,
          nombre: formData.nombre || plantillaEditando.nombre,
          descripcion: formData.descripcion,
          tipo: formData.tipo as TipoEvento,
          datosEvento: {
            ...formData,
            nombre: formData.nombre || plantillaEditando.nombre,
          } as Omit<Evento, 'id' | 'participantes' | 'estado' | 'fechaInicio' | 'fechaFin' | 'createdAt' | 'esPlantilla' | 'plantillaId'>,
          updatedAt: new Date(),
        };
        const nuevasPlantillas = plantillas.map(p =>
          p.id === plantillaEditando.id ? plantillaActualizada : p
        );
        guardarPlantillas(nuevasPlantillas);
        setMostrarFormulario(false);
        setMostrarVistaPrevia(false);
        setPlantillaEditando(null);
        setErroresValidacion({});
        setFormData({
          tipo: 'presencial',
          nombre: '',
          descripcion: '',
          fechaInicio: new Date(),
          capacidad: 50,
          estado: 'borrador',
          creadoPor: user?.id || '',
          precio: undefined,
          preciosPorTipoCliente: {},
          esGratuito: false,
        });
        alert('Plantilla actualizada exitosamente');
        return;
      }

      // Si es un evento nuevo o duplicado, generar nuevo ID
      const nuevoId = eventoEditando?.id || (formData.id && formData.id !== '' ? formData.id : Date.now().toString());

      // Generar publicLink si no existe
      const publicLink = formData.publicLink || generarPublicLink(nuevoId);

      // Configurar recordatorios si no existen (User Story 2)
      let configRecordatorios = formData.recordatoriosConfiguracion;
      if (!configRecordatorios && recordatoriosConfig) {
        configRecordatorios = recordatoriosConfig;
      } else if (!configRecordatorios) {
        // Crear configuración por defecto si no hay ninguna
        configRecordatorios = crearConfiguracionRecordatoriosPorDefecto();
      }

      const eventoAGuardar: Evento = {
        ...formData,
        id: nuevoId,
        estado: formData.estado === 'programado' || formData.estado === 'en-curso' || formData.estado === 'finalizado' || formData.estado === 'cancelado'
          ? formData.estado
          : 'programado',
        participantes: eventoEditando?.participantes || [],
        participantesDetalle: eventoEditando?.participantesDetalle || [],
        createdAt: eventoEditando?.createdAt || new Date(),
        publicLink,
        inscripcionesPublicasHabilitadas: formData.inscripcionesPublicasHabilitadas !== undefined
          ? formData.inscripcionesPublicasHabilitadas
          : false,
        recordatoriosConfiguracion: configRecordatorios,
        recordatoriosEnviados: eventoEditando?.recordatoriosEnviados || [],
        invitaciones: eventoEditando?.invitaciones || [],
        plantillaInvitacion: formData.plantillaInvitacion || eventoEditando?.plantillaInvitacion,
        // Incluir checklist de preparación (User Story 2)
        checklistPreparacion: formData.checklistPreparacion || eventoEditando?.checklistPreparacion,
        // Incluir sincronización de calendario (User Story 1)
        sincronizacionCalendario: formData.sincronizacionCalendario || eventoEditando?.sincronizacionCalendario,
      } as Evento;

      // Si estamos editando un evento existente, detectar cambios relevantes
      if (eventoEditando && eventoEditando.id) {
        const cambios = detectarCambiosRelevantes(eventoEditando, eventoAGuardar);

        // Si hay cambios relevantes y hay participantes, mostrar modal de notificación
        if (cambios && cambios.length > 0 && (eventoEditando.participantesDetalle?.length || 0) > 0) {
          // Crear objeto CambioEvento para compatibilidad con el modal existente
          const cambioEvento: CambioEvento = {
            tipo: cambios[0].tipo === 'fecha' || cambios[0].tipo === 'hora' ? 'reprogramacion' :
              cambios[0].tipo === 'estado' && eventoAGuardar.estado === 'cancelado' ? 'cancelacion' :
                cambios[0].tipo,
            eventoAnterior: eventoEditando,
            eventoNuevo: eventoAGuardar,
            cambios: cambios,
            fechaAnterior: eventoEditando.fechaInicio,
            fechaNueva: eventoAGuardar.fechaInicio,
            estadoAnterior: eventoEditando.estado,
            estadoNuevo: eventoAGuardar.estado,
          };

          setCambioEventoDetectado(cambioEvento);
          setEventoAGuardarPendiente(eventoAGuardar);
          setNotificarCambioEvento(true);
          setMotivoCambioEvento('');
          setCanalNotificacionCambio('ambos');
          setMostrarModalNotificacionCambio(true);
          return; // No guardar aún, esperar confirmación del usuario
        }
      }

      // Guardar evento (no hay cambios relevantes o es evento nuevo)
      let eventosActualizados: Evento[];
      if (eventoEditando && eventoEditando.id) {
        // Actualizar evento existente
        eventosActualizados = eventos.map(e => (e.id === eventoEditando.id ? eventoAGuardar : e));
      } else {
        // Nuevo evento (incluye duplicados)
        eventosActualizados = [...eventos, eventoAGuardar];
      }

      setEventos(eventosActualizados);
      // Guardar en localStorage
      guardarEventos(eventosActualizados);

      // Sincronizar con Google Calendar si está habilitado (User Story 1)
      if (eventoAGuardar.sincronizacionCalendario?.activo && !eventoAGuardar.sincronizacionCalendario.desactivado) {
        try {
          const resultadoSync = await sincronizarEventoConCalendario(eventoAGuardar, user?.id);
          if (resultadoSync.success && resultadoSync.eventoExternoId) {
            // Actualizar evento con información de sincronización
            const eventosConSync = eventosActualizados.map(e => {
              if (e.id === eventoAGuardar.id) {
                return {
                  ...e,
                  sincronizacionCalendario: {
                    ...e.sincronizacionCalendario,
                    activo: true,
                    eventoExternoId: resultadoSync.eventoExternoId,
                    ultimaSincronizacion: new Date(),
                    desactivado: false,
                  } as any,
                };
              }
              return e;
            });
            setEventos(eventosConSync);
            guardarEventos(eventosConSync);
          }
        } catch (error) {
          console.error('Error sincronizando con calendario después de publicar:', error);
          // No bloquear la publicación si falla la sincronización
        }
      }

      setMostrarFormulario(false);
      setMostrarVistaPrevia(false);
      setEventoEditando(null);
      setErroresValidacion({});
      setFormData({
        tipo: 'presencial',
        nombre: '',
        descripcion: '',
        fechaInicio: new Date(),
        capacidad: 50,
        estado: 'borrador',
        creadoPor: user?.id || '',
        precio: undefined,
        preciosPorTipoCliente: {},
        esGratuito: false,
        inscripcionesPublicasHabilitadas: false,
      });
      setPlantillaEditando(null);
    } catch (error) {
      console.error('Error al publicar evento:', error);
      alert('Error al publicar el evento');
    }
  };

  const handleGuardar = async () => {
    // Mantener compatibilidad, pero ahora usa handlePublicar
    await handlePublicar();
  };

  const handleEliminar = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este evento?')) {
      const eventosActualizados = eventos.filter(e => e.id !== id);
      setEventos(eventosActualizados);
      guardarEventos(eventosActualizados);
    }
  };

  // Funciones de archivado (User Story 2)
  const archivarEvento = async (eventoId: string) => {
    const eventosActualizados = eventos.map(e => {
      if (e.id === eventoId) {
        return {
          ...e,
          archivado: true,
          fechaArchivado: new Date(),
        };
      }
      return e;
    });
    setEventos(eventosActualizados);
    guardarEventos(eventosActualizados);
  };

  const desarchivarEvento = async (eventoId: string) => {
    const eventosActualizados = eventos.map(e => {
      if (e.id === eventoId) {
        return {
          ...e,
          archivado: false,
          fechaArchivado: undefined,
        };
      }
      return e;
    });
    setEventos(eventosActualizados);
    guardarEventos(eventosActualizados);
  };

  // Auto-archivar eventos finalizados después de 60 días (User Story 2)
  useEffect(() => {
    const verificarAutoArchivado = () => {
      const ahora = new Date();
      const hace60Dias = new Date(ahora.getTime() - 60 * 24 * 60 * 60 * 1000);

      // Cargar eventos desde localStorage
      const eventosStorage = localStorage.getItem('eventos');
      if (!eventosStorage) return;

      try {
        const eventosData = JSON.parse(eventosStorage);
        const eventosParsed = eventosData.map((e: any) => ({
          ...e,
          fechaInicio: new Date(e.fechaInicio),
          fechaFin: e.fechaFin ? new Date(e.fechaFin) : undefined,
          fechaArchivado: e.fechaArchivado ? new Date(e.fechaArchivado) : undefined,
        }));

        let eventosActualizados = eventosParsed;
        let hayCambios = false;

        eventosParsed.forEach(evento => {
          // Solo archivar eventos finalizados o cancelados que no estén ya archivados
          if ((evento.estado === 'finalizado' || evento.estado === 'cancelado') && !evento.archivado) {
            // Usar fechaFin si existe, sino fechaInicio
            const fechaFinalizacion = evento.fechaFin || evento.fechaInicio;

            if (fechaFinalizacion <= hace60Dias) {
              eventosActualizados = eventosActualizados.map((e: any) => {
                if (e.id === evento.id) {
                  hayCambios = true;
                  return {
                    ...e,
                    archivado: true,
                    fechaArchivado: new Date(),
                  };
                }
                return e;
              });
            }
          }
        });

        if (hayCambios) {
          guardarEventos(eventosActualizados);
          // Actualizar estado solo si hay cambios
          setEventos(eventosActualizados);
        }
      } catch (error) {
        console.error('Error en auto-archivado:', error);
      }
    };

    // Verificar al cargar
    verificarAutoArchivado();

    // Verificar cada día
    const interval = setInterval(verificarAutoArchivado, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []); // Sin dependencias para evitar loops

  // Función para mover evento (drag & drop en calendario) (User Story 1)
  const handleMoverEvento = async (eventoId: string, nuevaFecha: Date) => {
    const evento = eventos.find(e => e.id === eventoId);
    if (!evento) return;

    const duracion = evento.fechaFin
      ? new Date(evento.fechaFin).getTime() - new Date(evento.fechaInicio).getTime()
      : 2 * 60 * 60 * 1000; // 2 horas por defecto

    const nuevaFechaFin = new Date(nuevaFecha.getTime() + duracion);

    const eventosActualizados = eventos.map(e => {
      if (e.id === eventoId) {
        return {
          ...e,
          fechaInicio: nuevaFecha,
          fechaFin: nuevaFechaFin,
        };
      }
      return e;
    });

    setEventos(eventosActualizados);
    guardarEventos(eventosActualizados);
  };

  // Función para copiar link público al portapapeles (User Story 2)
  const copiarPublicLink = async (evento: Evento) => {
    if (!evento.publicLink) {
      // Generar link si no existe
      const nuevoLink = generarPublicLink(evento.id);
      const eventosActualizados = eventos.map(e =>
        e.id === evento.id
          ? { ...e, publicLink: nuevoLink, inscripcionesPublicasHabilitadas: true }
          : e
      );
      setEventos(eventosActualizados);
      guardarEventos(eventosActualizados);

      if (eventoSeleccionado?.id === evento.id) {
        setEventoSeleccionado(eventosActualizados.find(e => e.id === evento.id) || null);
      }

      const urlCompleta = `${window.location.origin}/evento-inscripcion/${nuevoLink}`;
      await navigator.clipboard.writeText(urlCompleta);
    } else {
      const urlCompleta = `${window.location.origin}/evento-inscripcion/${evento.publicLink}`;
      await navigator.clipboard.writeText(urlCompleta);
    }

    setLinkCopiado(true);
    setTimeout(() => setLinkCopiado(false), 2000);
  };

  // Función para habilitar/deshabilitar inscripciones públicas (User Story 2)
  const toggleInscripcionesPublicas = (evento: Evento) => {
    const eventosActualizados = eventos.map(e => {
      if (e.id === evento.id) {
        const nuevoEstado = !e.inscripcionesPublicasHabilitadas;
        return {
          ...e,
          inscripcionesPublicasHabilitadas: nuevoEstado,
          publicLink: nuevoEstado && !e.publicLink ? generarPublicLink(e.id) : e.publicLink,
        };
      }
      return e;
    });

    setEventos(eventosActualizados);
    guardarEventos(eventosActualizados);

    if (eventoSeleccionado?.id === evento.id) {
      setEventoSeleccionado(eventosActualizados.find(e => e.id === evento.id) || null);
    }
  };

  const getTipoBadge = (tipo: TipoEvento) => {
    const configs = {
      presencial: { label: 'Presencial', variant: 'blue' as const, icon: <MapPin className="w-3 h-3" /> },
      reto: { label: 'Reto', variant: 'purple' as const, icon: <Target className="w-3 h-3" /> },
      virtual: { label: 'Virtual', variant: 'green' as const, icon: <Video className="w-3 h-3" /> },
    };
    const config = configs[tipo];
    return (
      <Badge variant={config.variant} leftIcon={config.icon}>
        {config.label}
      </Badge>
    );
  };

  const getEstadoLabel = (estado: EstadoEvento): string => {
    const labels = {
      borrador: 'Borrador',
      programado: 'Programado',
      'en-curso': 'En Curso',
      finalizado: 'Finalizado',
      cancelado: 'Cancelado',
    };
    return labels[estado];
  };

  const getEstadoBadge = (estado: EstadoEvento) => {
    const configs = {
      borrador: { label: 'Borrador', variant: 'gray' as const },
      programado: { label: 'Programado', variant: 'blue' as const },
      'en-curso': { label: 'En Curso', variant: 'green' as const },
      finalizado: { label: 'Finalizado', variant: 'gray' as const },
      cancelado: { label: 'Cancelado', variant: 'red' as const },
    };
    const config = configs[estado];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // Función para obtener próximos eventos (User Story 2)
  const proximosEventos = useMemo(() => {
    const ahora = countdownTime; // Usar countdownTime para forzar recálculo
    const en7Dias = new Date();
    en7Dias.setDate(ahora.getDate() + 7);

    return eventos
      .filter(evento => {
        // Solo eventos programados o en curso
        if (evento.estado !== 'programado' && evento.estado !== 'en-curso') {
          return false;
        }
        // Eventos que están dentro de los próximos 7 días
        const fechaEvento = new Date(evento.fechaInicio);
        return fechaEvento >= ahora && fechaEvento <= en7Dias;
      })
      .sort((a, b) => new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime())
      .slice(0, 6); // Máximo 6 eventos
  }, [eventos, countdownTime]);

  // Función para calcular countdown (User Story 2)
  const calcularCountdown = (fecha: Date) => {
    const ahora = countdownTime; // Usar countdownTime para actualización en tiempo real
    const diferencia = fecha.getTime() - ahora.getTime();

    if (diferencia <= 0) {
      return { dias: 0, horas: 0, minutos: 0, segundos: 0, terminado: true };
    }

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

    return { dias, horas, minutos, segundos, terminado: false };
  };

  // Función para iniciar cambio de estado (User Story 1)
  const iniciarCambioEstado = (evento: Evento, nuevoEstado: EstadoEvento) => {
    setEventoCambioEstado(evento);
    setNuevoEstado(nuevoEstado);
    setNotificarParticipantes(false);
    setMotivoCambio('');
    setMostrarModalCambioEstado(true);
  };

  // Función para confirmar cambio de estado (User Story 1)
  const confirmarCambioEstado = async () => {
    if (!eventoCambioEstado || !nuevoEstado) return;

    // Confirmación especial para cancelar
    if (nuevoEstado === 'cancelado') {
      const confirmar = window.confirm(
        `¿Estás seguro de que quieres cancelar el evento "${eventoCambioEstado.nombre}"? Esta acción no se puede deshacer.`
      );
      if (!confirmar) {
        return;
      }
    }

    // Crear registro de cambio
    const cambioEstado: CambioEstado = {
      estadoAnterior: eventoCambioEstado.estado,
      estadoNuevo: nuevoEstado,
      fechaCambio: new Date(),
      usuarioId: user?.id || '',
      usuarioNombre: user?.name || 'Usuario',
      motivo: motivoCambio || undefined,
      notificado: notificarParticipantes,
    };

    // Actualizar evento
    const eventosActualizados = eventos.map(e => {
      if (e.id === eventoCambioEstado.id) {
        return {
          ...e,
          estado: nuevoEstado,
          historialEstado: [...(e.historialEstado || []), cambioEstado],
        };
      }
      return e;
    });

    setEventos(eventosActualizados);

    // Notificar participantes si se solicitó
    if (notificarParticipantes && eventoCambioEstado.participantes.length > 0) {
      // TODO: Implementar notificación real a participantes
      console.log(`Notificando a ${eventoCambioEstado.participantes.length} participantes sobre cambio de estado`);
      alert(`Se notificará a ${eventoCambioEstado.participantes.length} participantes sobre el cambio de estado.`);
    }

    // Cerrar modal
    setMostrarModalCambioEstado(false);
    setEventoCambioEstado(null);
    setNuevoEstado(null);
    setNotificarParticipantes(false);
    setMotivoCambio('');
  };

  // Función para mostrar historial de estado (User Story 1)
  const mostrarHistorial = (evento: Evento) => {
    setEventoHistorial(evento);
    setMostrarHistorialEstado(true);
  };

  // Función para mostrar participantes (User Story 2)
  const mostrarParticipantes = (evento: Evento) => {
    setEventoParticipantes(evento);
    setMostrarModalParticipantes(true);
  };

  // Función para confirmar y guardar cambio de evento con notificación (User Story 1)
  const confirmarCambioEventoConNotificacion = async () => {
    if (!cambioEventoDetectado || !eventoAGuardarPendiente) return;

    setEnviandoNotificacionCambio(true);

    try {
      // Guardar evento primero
      const eventosActualizados = eventos.map(e =>
        e.id === eventoAGuardarPendiente.id ? eventoAGuardarPendiente : e
      );
      setEventos(eventosActualizados);
      guardarEventos(eventosActualizados);

      // Enviar notificación si se solicitó
      if (notificarCambioEvento && cambioEventoDetectado) {
        const resultado = await notificarCambiosAparticipantes(
          cambioEventoDetectado.eventoNuevo.id,
          cambioEventoDetectado.cambios,
          motivoCambioEvento || undefined,
          canalNotificacionCambio,
          user?.id || '',
          user?.name || 'Entrenador'
        );

        if (resultado.success) {
          // Actualizar evento con el mensaje grupal enviado
          if (resultado.mensaje) {
            const eventoActualizado = eventosActualizados.find(e => e.id === eventoAGuardarPendiente.id);
            if (eventoActualizado) {
              eventoActualizado.mensajesGrupales = [
                ...(eventoActualizado.mensajesGrupales || []),
                resultado.mensaje,
              ];
              const eventosConMensaje = eventosActualizados.map(e =>
                e.id === eventoActualizado.id ? eventoActualizado : e
              );
              setEventos(eventosConMensaje);
              guardarEventos(eventosConMensaje);
            }
          }

          alert(`Evento actualizado exitosamente. Se notificó a ${resultado.participantesNotificados} participantes.`);
        } else {
          alert('Evento actualizado, pero hubo un error al enviar las notificaciones.');
        }
      } else {
        alert('Evento actualizado exitosamente.');
      }

      // Cerrar modales y limpiar estado
      setMostrarModalNotificacionCambio(false);
      setCambioEventoDetectado(null);
      setEventoAGuardarPendiente(null);
      setNotificarCambioEvento(true);
      setMotivoCambioEvento('');
      setMostrarFormulario(false);
      setMostrarVistaPrevia(false);
      setEventoEditando(null);
      setErroresValidacion({});
      setFormData({
        tipo: 'presencial',
        nombre: '',
        descripcion: '',
        fechaInicio: new Date(),
        capacidad: 50,
        estado: 'borrador',
        creadoPor: user?.id || '',
        precio: undefined,
        preciosPorTipoCliente: {},
        esGratuito: false,
        inscripcionesPublicasHabilitadas: false,
      });
      setPlantillaEditando(null);
    } catch (error) {
      console.error('Error al confirmar cambio de evento:', error);
      alert('Error al actualizar el evento');
    } finally {
      setEnviandoNotificacionCambio(false);
    }
  };

  // Función para cancelar cambio de evento
  const cancelarCambioEvento = () => {
    setMostrarModalNotificacionCambio(false);
    setCambioEventoDetectado(null);
    setEventoAGuardarPendiente(null);
    setNotificarCambioEvento(true);
    setMotivoCambioEvento('');
  };

  // Función para mostrar estadísticas de asistencia (User Story 2)
  const mostrarEstadisticasAsistencia = (evento: Evento) => {
    setEventoEstadisticas(evento);
    const estadisticas = calcularEstadisticasTodosEventos([evento])[0];
    setEstadisticasEvento(estadisticas);
    setMostrarModalEstadisticas(true);
  };

  // Handler para ver feedback post-evento (User Story 1)
  const mostrarFeedbackEvento = (evento: Evento) => {
    const encuesta = obtenerEncuestaPorEvento(evento.id);
    if (encuesta) {
      setEventoFeedbackId(evento.id);
      setMostrarModalFeedback(true);
    } else {
      alert('No hay encuesta disponible para este evento. Las encuestas se envían automáticamente después de que el evento finalice.');
    }
  };

  // Handler para ver analytics de un evento específico (User Story 2)
  const mostrarAnalyticsEvento = (evento: Evento) => {
    if (evento.estado !== 'finalizado') {
      alert('Los analytics están disponibles solo para eventos finalizados.');
      return;
    }
    setEventoAnalyticsId(evento.id);
    setMostrarModalAnalytics(true);
  };

  // Handler para configurar encuesta post-evento
  const abrirModalConfigurarEncuesta = (evento: Evento) => {
    setEventoConfigurarEncuesta(evento);
    setMostrarModalConfigurarEncuesta(true);
  };

  // Handler para enviar encuesta post-evento
  const handleEnviarEncuesta = async (evento: Evento) => {
    const encuesta = obtenerEncuestaPorEvento(evento.id);
    if (!encuesta) {
      alert('Primero debes configurar la encuesta para este evento.');
      return;
    }

    if (encuesta.estado === 'enviada') {
      alert('La encuesta ya ha sido enviada a los participantes.');
      return;
    }

    try {
      const participantes = evento.participantesDetalle || [];
      const resultado = await enviarEncuestaPostEvento(encuesta, participantes);

      if (resultado.success) {
        alert(`Encuesta enviada exitosamente a ${resultado.participantesNotificados} participantes.`);
        // Actualizar eventos si el evento seleccionado es el mismo
        if (eventoSeleccionado?.id === evento.id) {
          const eventosActualizados = eventos.map(e =>
            e.id === evento.id ? { ...e } : e
          );
          setEventos(eventosActualizados);
          guardarEventos(eventosActualizados);
        }
      } else {
        alert(`Error al enviar la encuesta: ${resultado.mensaje}`);
      }
    } catch (error) {
      console.error('Error enviando encuesta:', error);
      alert('Error al enviar la encuesta. Por favor, intenta de nuevo.');
    }
  };

  // Handler para guardar encuesta configurada
  const handleEncuestaGuardada = () => {
    // Recargar eventos para reflejar cambios
    const eventosStorage = localStorage.getItem('eventos');
    if (eventosStorage) {
      try {
        const eventosCargados: Evento[] = JSON.parse(eventosStorage).map((e: any) => ({
          ...e,
          fechaInicio: new Date(e.fechaInicio),
          fechaFin: e.fechaFin ? new Date(e.fechaFin) : undefined,
          createdAt: new Date(e.createdAt),
        }));
        setEventos(eventosCargados);
      } catch (error) {
        console.error('Error recargando eventos:', error);
      }
    }
  };

  // Handler para ver analytics generales (mantener compatibilidad)
  const mostrarAnalyticsEventos = () => {
    const eventosFinalizados = eventos.filter(e => e.estado === 'finalizado');

    if (eventosFinalizados.length === 0) {
      alert('No hay eventos finalizados para analizar. Los analytics están disponibles una vez que tengas eventos completados.');
      return;
    }

    // Usar el primer evento finalizado como referencia, o el más reciente
    const eventoMasReciente = eventosFinalizados.sort((a, b) =>
      new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime()
    )[0];

    setEventoAnalyticsId(eventoMasReciente.id);
    setMostrarModalAnalytics(true);
  };

  // Handler para ver dashboard de progreso de retos (User Story US-ER-23)
  const mostrarDashboardProgreso = (evento: Evento) => {
    if (evento.tipo !== 'reto') {
      alert('Este dashboard solo está disponible para eventos tipo reto');
      return;
    }
    setEventoProgresoRetos(evento);
    setMostrarDashboardProgresoRetos(true);
  };

  // Handler para ver dashboard de métricas generales (User Story US-ER-24)
  const mostrarMetricasGenerales = () => {
    setMostrarDashboardMetricasGenerales(true);
  };

  // Handler para enviar encuesta manualmente (User Story 1)
  const enviarEncuestaManual = async (evento: Evento) => {
    if (!evento.participantesDetalle || evento.participantesDetalle.length === 0) {
      alert('El evento no tiene participantes para enviar la encuesta');
      return;
    }

    let encuesta = obtenerEncuestaPorEvento(evento.id);
    if (!encuesta) {
      encuesta = crearEncuestaPostEvento(evento, undefined, false, 0);
      guardarEncuesta(encuesta);
    }

    const resultado = await enviarEncuestaPostEvento(encuesta, evento.participantesDetalle);
    if (resultado.success) {
      alert(resultado.mensaje);
      // Actualizar evento con referencia a la encuesta
      const eventosActualizados = eventos.map(e => {
        if (e.id === evento.id) {
          return {
            ...e,
            encuestaPostEvento: {
              id: encuesta.id,
              enviada: true,
              fechaEnvio: new Date(),
              respuestasRecibidas: 0,
            },
          };
        }
        return e;
      });
      setEventos(eventosActualizados);
      guardarEventos(eventosActualizados);
    } else {
      alert('Error al enviar la encuesta: ' + resultado.mensaje);
    }
  };

  // Handlers para invitaciones (User Story 1)
  const abrirModalInvitaciones = async (evento: Evento) => {
    setEventoInvitaciones(evento);
    setDestinatariosSeleccionados([]);
    setBusquedaInvitaciones('');
    setPlantillaInvitacion(evento.plantillaInvitacion || 'Hola {nombre},\n\nTe invitamos a nuestro evento "{eventoNombre}" que se realizará el {fecha} a las {hora} en {ubicacion}.\n\n{eventoDescripcion}\n\n¡Esperamos verte allí!\n\nSaludos,\nEquipo de Entrenamiento');
    setCanalInvitacion('ambos');
    setTipoSelectorInvitaciones('ambos');
    setMostrarModalInvitaciones(true);
  };

  const handleSeleccionarDestinatario = (destinatario: { id: string; nombre: string; email?: string; telefono?: string; tipo: 'cliente' | 'grupo' }) => {
    const yaSeleccionado = destinatariosSeleccionados.some(d => d.id === destinatario.id && d.tipo === destinatario.tipo);
    if (yaSeleccionado) {
      setDestinatariosSeleccionados(destinatariosSeleccionados.filter(d => !(d.id === destinatario.id && d.tipo === destinatario.tipo)));
    } else {
      setDestinatariosSeleccionados([...destinatariosSeleccionados, destinatario]);
    }
  };

  const handleSeleccionarGrupoCompleto = async (grupo: ClientSegment) => {
    try {
      const clientesDelGrupo = await obtenerClientesDeGrupo(grupo.id);
      const nuevosDestinatarios = clientesDelGrupo.map(cliente => ({
        id: cliente.id,
        nombre: cliente.name,
        email: cliente.email,
        telefono: cliente.phone,
        tipo: 'cliente' as const,
      }));

      // Agregar solo los que no están ya seleccionados
      const destinatariosUnicos = [...destinatariosSeleccionados];
      nuevosDestinatarios.forEach(dest => {
        if (!destinatariosUnicos.some(d => d.id === dest.id && d.tipo === dest.tipo)) {
          destinatariosUnicos.push(dest);
        }
      });
      setDestinatariosSeleccionados(destinatariosUnicos);
    } catch (error) {
      console.error('Error cargando clientes del grupo:', error);
      alert('Error al cargar clientes del grupo');
    }
  };

  const enviarInvitacionesHandler = async () => {
    if (!eventoInvitaciones || destinatariosSeleccionados.length === 0) {
      alert('Por favor selecciona al menos un destinatario');
      return;
    }

    if (!plantillaInvitacion.trim()) {
      alert('Por favor ingresa una plantilla de invitación');
      return;
    }

    setEnviandoInvitaciones(true);
    try {
      const invitaciones = await enviarInvitaciones(
        eventoInvitaciones,
        destinatariosSeleccionados,
        plantillaInvitacion,
        canalInvitacion
      );

      // Actualizar evento con las invitaciones
      const eventosActualizados = eventos.map(e => {
        if (e.id === eventoInvitaciones.id) {
          return {
            ...e,
            invitaciones: [...(e.invitaciones || []), ...invitaciones],
            plantillaInvitacion: plantillaInvitacion,
          };
        }
        return e;
      });

      setEventos(eventosActualizados);
      guardarEventos(eventosActualizados);

      // Actualizar evento seleccionado si es el mismo
      if (eventoSeleccionado?.id === eventoInvitaciones.id) {
        const eventoActualizado = eventosActualizados.find(e => e.id === eventoInvitaciones.id);
        if (eventoActualizado) {
          setEventoSeleccionado(eventoActualizado);
        }
      }

      alert(`Invitaciones enviadas exitosamente a ${invitaciones.length} destinatario(s)`);
      setMostrarModalInvitaciones(false);
      setDestinatariosSeleccionados([]);
    } catch (error) {
      console.error('Error enviando invitaciones:', error);
      alert('Error al enviar invitaciones');
    } finally {
      setEnviandoInvitaciones(false);
    }
  };

  // Handlers para recordatorios (User Story 2)
  const abrirHistorialRecordatorios = (evento: Evento) => {
    setEventoHistorialRecordatorios(evento);
    setMostrarHistorialRecordatorios(true);
  };

  const actualizarConfiguracionRecordatorios = (config: ConfiguracionRecordatoriosEvento) => {
    setRecordatoriosConfig(config);
    setFormData(prev => ({
      ...prev,
      recordatoriosConfiguracion: config,
    }));
  };

  const agregarRecordatorio = () => {
    const nuevaConfig = recordatoriosConfig || crearConfiguracionRecordatoriosPorDefecto();
    const nuevoRecordatorio: RecordatorioConfiguracionEvento = {
      id: `rec-${Date.now()}`,
      tiempoAnticipacionHoras: 24,
      activo: true,
      canales: ['whatsapp'],
      orden: nuevaConfig.recordatorios.length + 1,
    };

    const configActualizada: ConfiguracionRecordatoriosEvento = {
      ...nuevaConfig,
      recordatorios: [...nuevaConfig.recordatorios, nuevoRecordatorio],
    };

    actualizarConfiguracionRecordatorios(configActualizada);
  };

  // Handlers para solicitud de confirmación (User Story 1)
  const abrirModalSolicitudConfirmacion = (evento: Evento) => {
    setEventoConfirmacion(evento);
    setMostrarModalConfirmacion(true);

    // Verificar si se puede enviar
    const validacion = puedeEnviarSolicitudConfirmacion(evento, diasAnticipacionConfirmacion);
    if (!validacion.puede && validacion.razon) {
      // Ajustar días si es necesario
      const fechaEvento = new Date(evento.fechaInicio);
      const ahora = new Date();
      const diasHastaEvento = Math.floor(
        (fechaEvento.getTime() - ahora.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diasHastaEvento > 0 && diasHastaEvento < diasAnticipacionConfirmacion) {
        setDiasAnticipacionConfirmacion(Math.max(1, diasHastaEvento - 1));
      }
    }
  };

  const enviarSolicitudConfirmacionHandler = async () => {
    if (!eventoConfirmacion) return;

    const validacion = puedeEnviarSolicitudConfirmacion(eventoConfirmacion, diasAnticipacionConfirmacion);
    if (!validacion.puede) {
      alert(validacion.razon || 'No se puede enviar la solicitud de confirmación');
      return;
    }

    if (!mensajeConfirmacion.trim()) {
      alert('Por favor ingresa un mensaje de confirmación');
      return;
    }

    setEnviandoConfirmacion(true);
    try {
      // Crear solicitud
      const solicitud = await crearSolicitudConfirmacion(
        eventoConfirmacion,
        diasAnticipacionConfirmacion,
        mensajeConfirmacion,
        canalConfirmacion
      );

      // Enviar solicitud
      const resultado = await enviarSolicitudConfirmacion(eventoConfirmacion, solicitud);

      // Actualizar evento
      const eventosActualizados = eventos.map(e => {
        if (e.id === eventoConfirmacion.id) {
          const eventoActualizado = { ...e, solicitudConfirmacion: solicitud };

          // Actualizar participantes
          if (eventoActualizado.participantesDetalle) {
            eventoActualizado.participantesDetalle = eventoActualizado.participantesDetalle.map(p => {
              if (!p.fechaCancelacion) {
                return {
                  ...p,
                  solicitudConfirmacionEnviada: true,
                  fechaSolicitudConfirmacion: new Date(),
                  confirmacionAsistencia: 'pendiente' as const,
                };
              }
              return p;
            });
          }

          return eventoActualizado;
        }
        return e;
      });

      setEventos(eventosActualizados);
      guardarEventos(eventosActualizados);

      // Actualizar evento seleccionado si es el mismo
      if (eventoSeleccionado?.id === eventoConfirmacion.id) {
        const eventoActualizado = eventosActualizados.find(e => e.id === eventoConfirmacion.id);
        if (eventoActualizado) {
          setEventoSeleccionado(eventoActualizado);
        }
      }

      alert(`Solicitud de confirmación enviada a ${resultado.participantesNotificados} participante(s)`);
      setMostrarModalConfirmacion(false);
    } catch (error) {
      console.error('Error enviando solicitud de confirmación:', error);
      alert('Error al enviar la solicitud de confirmación');
    } finally {
      setEnviandoConfirmacion(false);
    }
  };

  // Handlers para mensajes grupales (User Story 2)
  const abrirModalMensajeGrupal = (evento: Evento) => {
    setEventoMensajeGrupal(evento);
    setMensajeGrupalTexto('');
    setPlantillaSeleccionada('');
    setTituloMensajeGrupal('');
    setMostrarModalMensajeGrupal(true);
  };

  const aplicarPlantilla = (plantillaId: string) => {
    const plantilla = PLANTILLAS_PREDEFINIDAS.find(p => p.id === plantillaId);
    if (plantilla && eventoMensajeGrupal) {
      setMensajeGrupalTexto(plantilla.mensaje);
      setPlantillaSeleccionada(plantillaId);
      setTituloMensajeGrupal(plantilla.nombre);
    }
  };

  const enviarMensajeGrupalHandler = async () => {
    if (!eventoMensajeGrupal) return;

    if (!mensajeGrupalTexto.trim()) {
      alert('Por favor ingresa un mensaje');
      return;
    }

    const participantes = eventoMensajeGrupal.participantesDetalle || [];
    const participantesActivos = participantes.filter(p => !p.fechaCancelacion);

    if (participantesActivos.length === 0) {
      alert('El evento no tiene participantes activos');
      return;
    }

    setEnviandoMensajeGrupal(true);
    try {
      const mensajeGrupal = await enviarMensajeGrupal(
        eventoMensajeGrupal,
        mensajeGrupalTexto,
        canalMensajeGrupal,
        user?.id || '',
        user?.name || 'Entrenador',
        plantillaSeleccionada || undefined,
        tituloMensajeGrupal || undefined
      );

      // Actualizar evento
      const eventosActualizados = eventos.map(e => {
        if (e.id === eventoMensajeGrupal.id) {
          return {
            ...e,
            mensajesGrupales: [...(e.mensajesGrupales || []), mensajeGrupal],
          };
        }
        return e;
      });

      setEventos(eventosActualizados);
      guardarEventos(eventosActualizados);

      // Actualizar evento seleccionado si es el mismo
      if (eventoSeleccionado?.id === eventoMensajeGrupal.id) {
        const eventoActualizado = eventosActualizados.find(e => e.id === eventoMensajeGrupal.id);
        if (eventoActualizado) {
          setEventoSeleccionado(eventoActualizado);
        }
      }

      // Actualizar evento mensaje grupal
      const eventoActualizado = eventosActualizados.find(e => e.id === eventoMensajeGrupal.id);
      if (eventoActualizado) {
        setEventoMensajeGrupal(eventoActualizado);
      }

      alert(`Mensaje grupal enviado a ${participantesActivos.length} participante(s)`);
      setMostrarModalMensajeGrupal(false);
      setMensajeGrupalTexto('');
      setPlantillaSeleccionada('');
      setTituloMensajeGrupal('');
    } catch (error) {
      console.error('Error enviando mensaje grupal:', error);
      alert('Error al enviar el mensaje grupal');
    } finally {
      setEnviandoMensajeGrupal(false);
    }
  };

  const eliminarRecordatorio = (recordatorioId: string) => {
    if (!recordatoriosConfig) return;

    const configActualizada: ConfiguracionRecordatoriosEvento = {
      ...recordatoriosConfig,
      recordatorios: recordatoriosConfig.recordatorios.filter(r => r.id !== recordatorioId),
    };

    actualizarConfiguracionRecordatorios(configActualizada);
  };

  const actualizarRecordatorio = (recordatorioId: string, actualizacion: Partial<RecordatorioConfiguracionEvento>) => {
    if (!recordatoriosConfig) return;

    const configActualizada: ConfiguracionRecordatoriosEvento = {
      ...recordatoriosConfig,
      recordatorios: recordatoriosConfig.recordatorios.map(r =>
        r.id === recordatorioId ? { ...r, ...actualizacion } : r
      ),
    };

    actualizarConfiguracionRecordatorios(configActualizada);
  };

  // Handlers para sincronización con Google Calendar (User Story 1)
  const handleSincronizarConCalendario = async (evento: Evento) => {
    setSincronizandoCalendario(true);
    setErrorSincronizacion(null);

    try {
      // Verificar conexión
      const conexion = await conectarGoogleCalendarSiNecesario(user?.id);
      if (!conexion.yaConectado && conexion.authUrl) {
        // Abrir ventana de autenticación
        window.open(conexion.authUrl, '_blank', 'width=600,height=700');
        alert('Por favor, autoriza el acceso a Google Calendar en la ventana que se abrió.');
        setSincronizandoCalendario(false);
        return;
      }

      // Sincronizar evento
      const resultado = await sincronizarEventoConCalendario(evento, user?.id);

      if (resultado.success && resultado.eventoExternoId) {
        // Actualizar evento con información de sincronización
        const eventosActualizados = eventos.map(e => {
          if (e.id === evento.id) {
            return {
              ...e,
              sincronizacionCalendario: {
                activo: true,
                conexionCalendarioId: conexion.conexionId || evento.sincronizacionCalendario?.conexionCalendarioId,
                eventoExternoId: resultado.eventoExternoId,
                sincronizacionBidireccional: true,
                ultimaSincronizacion: new Date(),
                desactivado: false,
              },
            };
          }
          return e;
        });

        setEventos(eventosActualizados);
        guardarEventos(eventosActualizados);

        if (eventoSeleccionado?.id === evento.id) {
          const eventoActualizado = eventosActualizados.find(e => e.id === evento.id);
          if (eventoActualizado) {
            setEventoSeleccionado(eventoActualizado);
          }
        }

        alert('Evento sincronizado con Google Calendar exitosamente');
      } else {
        setErrorSincronizacion(resultado.error || 'Error al sincronizar');
        alert(`Error al sincronizar: ${resultado.error || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error sincronizando con calendario:', error);
      setErrorSincronizacion(error instanceof Error ? error.message : 'Error desconocido');
      alert('Error al sincronizar con Google Calendar');
    } finally {
      setSincronizandoCalendario(false);
    }
  };

  const handleDesactivarSincronizacion = async (evento: Evento) => {
    if (!confirm('¿Estás seguro de que quieres desactivar la sincronización con Google Calendar?')) {
      return;
    }

    const eventosActualizados = eventos.map(e => {
      if (e.id === evento.id) {
        return {
          ...e,
          sincronizacionCalendario: {
            ...e.sincronizacionCalendario,
            activo: false,
            desactivado: true,
          } as any,
        };
      }
      return e;
    });

    setEventos(eventosActualizados);
    guardarEventos(eventosActualizados);

    if (eventoSeleccionado?.id === evento.id) {
      const eventoActualizado = eventosActualizados.find(e => e.id === evento.id);
      if (eventoActualizado) {
        setEventoSeleccionado(eventoActualizado);
      }
    }

    alert('Sincronización desactivada');
  };

  // Handlers para checklist de preparación (User Story 2)
  const abrirModalChecklist = async (evento: Evento) => {
    setEventoChecklist(evento);

    // Cargar plantillas de checklist
    const plantillas = await obtenerPlantillasChecklist(evento.tipo, user?.id);
    setPlantillasChecklist(plantillas);

    setMostrarModalChecklist(true);
  };

  const agregarItemAChecklist = () => {
    if (!eventoChecklist) return;

    const checklist = eventoChecklist.checklistPreparacion || crearChecklistVacio();
    const nuevoChecklist = agregarItemChecklist(checklist, {
      nombre: 'Nuevo item',
      descripcion: '',
      orden: checklist.items.length,
      categoria: 'preparacion',
    });

    const eventosActualizados = eventos.map(e => {
      if (e.id === eventoChecklist.id) {
        return { ...e, checklistPreparacion: nuevoChecklist };
      }
      return e;
    });

    setEventos(eventosActualizados);
    guardarEventos(eventosActualizados);

    const eventoActualizado = eventosActualizados.find(e => e.id === eventoChecklist.id);
    if (eventoActualizado) {
      setEventoChecklist(eventoActualizado);
      if (eventoSeleccionado?.id === eventoChecklist.id) {
        setEventoSeleccionado(eventoActualizado);
      }
    }
  };

  const toggleItemChecklist = (itemId: string) => {
    if (!eventoChecklist) return;

    const checklist = eventoChecklist.checklistPreparacion;
    if (!checklist) return;

    const item = checklist.items.find(i => i.id === itemId);
    if (!item) return;

    const nuevoChecklist = completarItemChecklist(checklist, itemId, !item.completado);

    const eventosActualizados = eventos.map(e => {
      if (e.id === eventoChecklist.id) {
        return { ...e, checklistPreparacion: nuevoChecklist };
      }
      return e;
    });

    setEventos(eventosActualizados);
    guardarEventos(eventosActualizados);

    const eventoActualizado = eventosActualizados.find(e => e.id === eventoChecklist.id);
    if (eventoActualizado) {
      setEventoChecklist(eventoActualizado);
      if (eventoSeleccionado?.id === eventoChecklist.id) {
        setEventoSeleccionado(eventoActualizado);
      }
    }
  };

  const eliminarItemDeChecklist = async (itemId: string) => {
    if (!eventoChecklist) return;
    if (!confirm('¿Estás seguro de que quieres eliminar este item?')) return;

    const checklist = eventoChecklist.checklistPreparacion;
    if (!checklist) return;

    const nuevoChecklist = eliminarItemDeChecklist(checklist, itemId);

    const eventosActualizados = eventos.map(e => {
      if (e.id === eventoChecklist.id) {
        return { ...e, checklistPreparacion: nuevoChecklist };
      }
      return e;
    });

    setEventos(eventosActualizados);
    guardarEventos(eventosActualizados);

    const eventoActualizado = eventosActualizados.find(e => e.id === eventoChecklist.id);
    if (eventoActualizado) {
      setEventoChecklist(eventoActualizado);
      if (eventoSeleccionado?.id === eventoChecklist.id) {
        setEventoSeleccionado(eventoActualizado);
      }
    }
  };

  const guardarChecklistComoPlantilla = async () => {
    if (!eventoChecklist || !eventoChecklist.checklistPreparacion) {
      alert('El evento no tiene un checklist para guardar como plantilla');
      return;
    }

    const nombrePlantilla = prompt('Ingresa un nombre para la plantilla de checklist:');
    if (!nombrePlantilla || nombrePlantilla.trim().length === 0) {
      return;
    }

    try {
      const plantilla: any = {
        nombre: nombrePlantilla.trim(),
        descripcion: `Plantilla basada en el checklist del evento "${eventoChecklist.nombre}"`,
        tipoEvento: eventoChecklist.tipo,
        items: eventoChecklist.checklistPreparacion.items.map(item => ({
          nombre: item.nombre,
          descripcion: item.descripcion,
          orden: item.orden,
          categoria: item.categoria,
        })),
        creadoPor: user?.id || '',
        usoFrecuente: 0,
      };

      // Guardar plantilla usando el servicio
      await guardarPlantillaChecklist(plantilla);

      // Recargar plantillas
      const plantillasActualizadas = await obtenerChecklistsDisponibles();
      setPlantillasChecklist(plantillasActualizadas);

      alert('Plantilla guardada exitosamente');
    } catch (error) {
      console.error('Error guardando plantilla:', error);
      alert('Error al guardar la plantilla');
    }
  };

  // Función para abrir modal de agregar participantes (User Story 1)
  const abrirModalAgregarParticipantes = async (evento: Evento) => {
    setEventoAgregarParticipantes(evento);
    setClientesSeleccionados([]);
    setBusquedaClientes('');
    setCargandoClientes(true);

    try {
      // Cargar clientes activos
      const clientes = await getActiveClients(user?.role || 'entrenador', user?.id);

      // Filtrar clientes que ya están inscritos
      const participantesIds = evento.participantesDetalle?.map(p => p.id) || evento.participantes || [];
      const clientesDisponibles = clientes.filter(c => !participantesIds.includes(c.id));

      setClientesDisponibles(clientesDisponibles);
    } catch (error) {
      console.error('Error cargando clientes:', error);
      alert('Error al cargar la lista de clientes');
    } finally {
      setCargandoClientes(false);
      setMostrarModalAgregarParticipantes(true);
    }
  };

  // Función para agregar participantes al evento (User Story 1) - Refactorizada con servicio
  const agregarParticipantes = async () => {
    if (!eventoAgregarParticipantes || clientesSeleccionados.length === 0) return;

    try {
      // Obtener información completa de los clientes seleccionados
      const clientesSeleccionadosData = clientesDisponibles.filter(c =>
        clientesSeleccionados.includes(c.id)
      );

      let eventosActualizados = [...eventos];
      let participantesEnEspera = 0;
      let participantesAgregados = 0;

      // Agregar cada participante usando el servicio
      for (const cliente of clientesSeleccionadosData) {
        try {
          const datosCliente: DatosCliente = {
            id: cliente.id,
            nombre: cliente.name,
            email: cliente.email,
            telefono: cliente.phone,
            foto: undefined,
          };

          // Por defecto usar 'regular', se puede mejorar para obtener del cliente
          const tipoCliente: 'regular' | 'premium' | 'vip' = 'regular';

          const resultado = agregarParticipanteService(
            eventoAgregarParticipantes.id,
            datosCliente,
            tipoCliente,
            eventosActualizados
          );

          eventosActualizados = eventosActualizados.map(e =>
            e.id === eventoAgregarParticipantes.id ? resultado.eventoActualizado : e
          );

          participantesAgregados++;
          if (resultado.enListaEspera) {
            participantesEnEspera++;
          }
        } catch (error) {
          console.error(`Error agregando participante ${cliente.name}:`, error);
          // Continuar con el siguiente participante
        }
      }

      setEventos(eventosActualizados);

      // Si el evento está abierto en el modal de detalle, actualizarlo
      if (eventoSeleccionado?.id === eventoAgregarParticipantes.id) {
        const eventoActualizado = eventosActualizados.find(e => e.id === eventoAgregarParticipantes.id);
        if (eventoActualizado) {
          setEventoSeleccionado(eventoActualizado);
        }
      }

      // Cerrar modal
      setMostrarModalAgregarParticipantes(false);
      setEventoAgregarParticipantes(null);
      setClientesSeleccionados([]);
      setBusquedaClientes('');

      // Mostrar confirmación
      if (participantesEnEspera > 0) {
        alert(`${participantesAgregados} participante(s) agregado(s). ${participantesEnEspera} fueron agregados a lista de espera.`);
      } else {
        alert(`${participantesAgregados} participante(s) agregado(s) exitosamente`);
      }
    } catch (error) {
      console.error('Error agregando participantes:', error);
      alert('Error al agregar participantes');
    }
  };

  // Función para obtener participantes con información completa
  const obtenerParticipantesDetalle = (evento: Evento): Participante[] => {
    if (evento.participantesDetalle && evento.participantesDetalle.length > 0) {
      return evento.participantesDetalle.sort((a, b) => a.nombre.localeCompare(b.nombre));
    }

    // Si no hay participantesDetalle, crear objetos básicos desde los IDs
    return evento.participantes.map((id, index) => ({
      id,
      nombre: `Participante ${index + 1}`,
      confirmado: false,
      fechaInscripcion: new Date(),
    })).sort((a, b) => a.nombre.localeCompare(b.nombre));
  };

  // Función para toggle de confirmación de participante
  const toggleConfirmacionParticipante = (eventoId: string, participanteId: string) => {
    const eventosActualizados = eventos.map(e => {
      if (e.id === eventoId && e.participantesDetalle) {
        const participantesActualizados = e.participantesDetalle.map(p => {
          if (p.id === participanteId) {
            return { ...p, confirmado: !p.confirmado };
          }
          return p;
        });
        return {
          ...e,
          participantesDetalle: participantesActualizados,
        };
      }
      return e;
    });

    setEventos(eventosActualizados);

    // Actualizar evento seleccionado si es el mismo
    if (eventoSeleccionado?.id === eventoId) {
      const eventoActualizado = eventosActualizados.find(e => e.id === eventoId);
      if (eventoActualizado) {
        setEventoSeleccionado(eventoActualizado);
      }
    }
  };

  // Función para abrir modal de eliminación de participante (US-ER-09)
  const abrirModalEliminarParticipante = (eventoId: string, participante: Participante) => {
    setParticipanteAEliminar({ eventoId, participante });
    setMoverAEspera(false);
    setMotivoCancelacionInput('');
    setMostrarModalEliminarParticipante(true);
  };

  // Función para eliminar participante (US-ER-09) - Refactorizada con servicio
  const eliminarParticipante = () => {
    if (!participanteAEliminar) return;

    const { eventoId, participante } = participanteAEliminar;

    try {
      // Usar servicio para eliminar participante
      const resultado = eliminarParticipanteService(
        eventoId,
        participante.id,
        eventos,
        motivoCancelacionInput || undefined
      );

      // Si se eligió mover a lista de espera, hacerlo manualmente
      let eventoActualizado = resultado.eventoActualizado;
      if (moverAEspera) {
        eventoActualizado = moverParticipanteAListaEspera(eventoId, participante.id, [eventoActualizado]);
      }

      // Agregar registro de cancelación
      const cancelaciones = eventoActualizado.cancelaciones || [];
      cancelaciones.push({
        participanteId: participante.id,
        participanteNombre: participante.nombre,
        fechaCancelacion: new Date(),
        motivo: motivoCancelacionInput || undefined,
        movidoAEspera: moverAEspera,
      });
      eventoActualizado.cancelaciones = cancelaciones;

      // Actualizar eventos
      const eventosActualizados = eventos.map(e =>
        e.id === eventoId ? eventoActualizado : e
      );

      setEventos(eventosActualizados);

      // Actualizar evento seleccionado si es el mismo
      if (eventoSeleccionado?.id === eventoId) {
        setEventoSeleccionado(eventoActualizado);
      }

      // Mostrar notificación si se movió alguien de lista de espera
      if (resultado.participanteMovidoDeEspera) {
        setTimeout(() => {
          const primerEnEspera = eventoActualizado.listaEspera?.[0];
          if (primerEnEspera) {
            alert(`¡Espacio liberado! ${primerEnEspera.nombre} ha sido movido automáticamente de la lista de espera a participantes confirmados.`);
          }
        }, 100);
      }

      // Cerrar modal y limpiar estados
      setMostrarModalEliminarParticipante(false);
      setParticipanteAEliminar(null);
      setMoverAEspera(false);
      setMotivoCancelacionInput('');
    } catch (error) {
      console.error('Error eliminando participante:', error);
      alert('Error al eliminar participante');
    }
  };

  // Función para mover participante de lista de espera a confirmados (US-ER-10) - Refactorizada con servicio
  const moverDeEsperaAConfirmados = (eventoId: string, participanteId: string) => {
    try {
      const eventoActualizado = moverParticipanteDeListaEspera(
        eventoId,
        participanteId,
        eventos
      );

      const eventosActualizados = eventos.map(e =>
        e.id === eventoId ? eventoActualizado : e
      );

      setEventos(eventosActualizados);

      // Actualizar evento seleccionado si es el mismo
      if (eventoSeleccionado?.id === eventoId) {
        setEventoSeleccionado(eventoActualizado);
      }

      const participante = eventoActualizado.participantesDetalle?.find(p => p.id === participanteId);
      if (participante) {
        alert(`${participante.nombre} ha sido movido a participantes confirmados.`);
      }
    } catch (error: any) {
      alert(error.message || 'Error al mover participante de lista de espera');
    }
  };

  // Función para abrir modal de check-in (User Story 1)
  const abrirModalCheckin = (evento: Evento) => {
    setEventoCheckin(evento);
    // Inicializar asistencias con los valores actuales
    const asistenciasIniciales: Record<string, boolean> = {};
    obtenerParticipantesDetalle(evento).forEach(p => {
      asistenciasIniciales[p.id] = p.asistencia || false;
    });
    setAsistenciasCheckin(asistenciasIniciales);
    setMostrarFormularioNoInscrito(false);
    setNuevoParticipanteNombre('');
    setNuevoParticipanteEmail('');
    setNuevoParticipanteTelefono('');
    setMostrarModalCheckin(true);
  };

  // Función para toggle de asistencia en check-in
  const toggleAsistenciaCheckin = (participanteId: string) => {
    setAsistenciasCheckin(prev => ({
      ...prev,
      [participanteId]: !prev[participanteId],
    }));
  };

  // Función para agregar participante no inscrito en check-in - Refactorizada con servicio
  const agregarParticipanteNoInscrito = () => {
    if (!eventoCheckin || !nuevoParticipanteNombre.trim()) {
      alert('Por favor ingresa al menos el nombre del participante');
      return;
    }

    try {
      const datosClienteAnonimo: DatosClienteAnonimo = {
        nombre: nuevoParticipanteNombre.trim(),
        email: nuevoParticipanteEmail.trim() || undefined,
        telefono: nuevoParticipanteTelefono.trim() || undefined,
      };

      const eventoActualizado = agregarWalkIn(
        eventoCheckin.id,
        datosClienteAnonimo,
        [eventoCheckin]
      );

      // Agregar a las asistencias
      const walkInParticipante = eventoActualizado.participantesDetalle?.find(
        p => p.esNoInscrito && p.nombre === datosClienteAnonimo.nombre
      );
      if (walkInParticipante) {
        setAsistenciasCheckin(prev => ({
          ...prev,
          [walkInParticipante.id]: true,
        }));
      }

      // Actualizar evento temporalmente
      setEventoCheckin(eventoActualizado);

      // Limpiar formulario
      setNuevoParticipanteNombre('');
      setNuevoParticipanteEmail('');
      setNuevoParticipanteTelefono('');
      setMostrarFormularioNoInscrito(false);
    } catch (error) {
      console.error('Error agregando walk-in:', error);
      alert('Error al agregar participante walk-in');
    }
  };

  // Función para guardar registro de asistencia (User Story 1) - Refactorizada con servicio
  const guardarCheckin = () => {
    if (!eventoCheckin) return;

    try {
      // Usar servicio para actualizar asistencias masivas
      const eventoActualizado = actualizarAsistenciasMasivas(
        eventoCheckin.id,
        asistenciasCheckin,
        [eventoCheckin]
      );

      // Agregar walk-ins que fueron agregados temporalmente
      const todosLosParticipantesCheckin = eventoCheckin.participantesDetalle || [];
      const participantesExistentes = eventoActualizado.participantesDetalle || [];
      const idsExistentes = new Set(participantesExistentes.map(p => p.id));

      // Agregar walk-ins nuevos
      const walkInsNuevos = todosLosParticipantesCheckin.filter(
        p => p.esNoInscrito && !idsExistentes.has(p.id) && asistenciasCheckin[p.id] === true
      );

      if (walkInsNuevos.length > 0) {
        eventoActualizado.participantesDetalle = [...participantesExistentes, ...walkInsNuevos];
        eventoActualizado.participantes = eventoActualizado.participantesDetalle.map(p => p.id);
      }

      const eventosActualizados = eventos.map(e =>
        e.id === eventoCheckin.id ? eventoActualizado : e
      );

      setEventos(eventosActualizados);

      // Actualizar evento seleccionado si es el mismo
      if (eventoSeleccionado?.id === eventoCheckin.id) {
        setEventoSeleccionado(eventoActualizado);
      }

      // Calcular total de asistentes antes de limpiar estados
      const totalAsistentes = Object.values(asistenciasCheckin).filter(a => a).length;

      // Cerrar modal
      setMostrarModalCheckin(false);
      setEventoCheckin(null);
      setAsistenciasCheckin({});
      setNuevoParticipanteNombre('');
      setNuevoParticipanteEmail('');
      setNuevoParticipanteTelefono('');
      setMostrarFormularioNoInscrito(false);

      alert(`Check-in guardado exitosamente. Total de asistentes: ${totalAsistentes}`);
    } catch (error) {
      console.error('Error guardando check-in:', error);
      alert('Error al guardar check-in');
    }
  };

  // Función para exportar participantes a Excel (User Story 2)
  const exportarAExcel = (evento: Evento) => {
    const participantes = obtenerParticipantesDetalle(evento);

    // Preparar datos para Excel
    const datos = participantes.map(p => ({
      'Nombre': p.nombre,
      'Email': p.email || 'N/A',
      'Teléfono': p.telefono || 'N/A',
      'Confirmado': p.confirmado ? 'Sí' : 'No',
      'Asistencia': p.asistencia ? 'Sí' : 'No',
      'Fecha Inscripción': p.fechaInscripcion ? new Date(p.fechaInscripcion).toLocaleDateString('es-ES') : 'N/A',
      'No Inscrito': p.esNoInscrito ? 'Sí' : 'No',
    }));

    // Crear workbook y worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(datos);

    // Ajustar ancho de columnas
    const columnWidths = [
      { wch: 25 }, // Nombre
      { wch: 30 }, // Email
      { wch: 15 }, // Teléfono
      { wch: 12 }, // Confirmado
      { wch: 12 }, // Asistencia
      { wch: 18 }, // Fecha Inscripción
      { wch: 12 }, // No Inscrito
    ];
    ws['!cols'] = columnWidths;

    // Agregar worksheet al workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Participantes');

    // Generar nombre de archivo
    const nombreArchivo = `Participantes_${evento.nombre}_${new Date().toISOString().split('T')[0]}.xlsx`;

    // Guardar archivo
    XLSX.writeFile(wb, nombreArchivo);
  };

  // Función para exportar participantes a PDF (User Story 2)
  const exportarAPDF = (evento: Evento) => {
    const participantes = obtenerParticipantesDetalle(evento);

    // Crear documento PDF
    const doc = new jsPDF();

    // Título
    doc.setFontSize(18);
    doc.text('Lista de Participantes', 14, 20);

    // Información del evento
    doc.setFontSize(12);
    doc.text(`Evento: ${evento.nombre}`, 14, 30);
    doc.text(`Fecha: ${new Date(evento.fechaInicio).toLocaleDateString('es-ES')}`, 14, 36);
    doc.text(`Total de participantes: ${participantes.length}`, 14, 42);

    // Preparar datos para la tabla
    const datosTabla = participantes.map(p => [
      p.nombre,
      p.email || 'N/A',
      p.telefono || 'N/A',
      p.confirmado ? 'Sí' : 'No',
      p.asistencia ? 'Sí' : 'No',
      p.esNoInscrito ? 'Sí' : 'No',
    ]);

    // Agregar tabla
    (doc as any).autoTable({
      startY: 50,
      head: [['Nombre', 'Email', 'Teléfono', 'Confirmado', 'Asistencia', 'No Inscrito']],
      body: datosTabla,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [79, 70, 229] }, // Color púrpura
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    // Generar nombre de archivo
    const nombreArchivo = `Participantes_${evento.nombre}_${new Date().toISOString().split('T')[0]}.pdf`;

    // Guardar archivo
    doc.save(nombreArchivo);
  };

  // Función para verificar si un evento está lleno y activar lista de espera automáticamente (US-ER-10)
  const verificarCapacidadYActivarEspera = (evento: Evento, nuevoParticipante: Participante): { agregado: boolean; enEspera: boolean } => {
    const participantesActuales = evento.participantesDetalle || [];

    if (participantesActuales.length >= evento.capacidad) {
      // Evento lleno - agregar a lista de espera
      const listaEspera = evento.listaEspera || [];
      const nuevaListaEspera = [...listaEspera, nuevoParticipante];

      const eventosActualizados = eventos.map(e => {
        if (e.id === evento.id) {
          return {
            ...e,
            listaEspera: nuevaListaEspera,
          };
        }
        return e;
      });

      setEventos(eventosActualizados);

      if (eventoSeleccionado?.id === evento.id) {
        const eventoActualizado = eventosActualizados.find(e => e.id === evento.id);
        if (eventoActualizado) {
          setEventoSeleccionado(eventoActualizado);
        }
      }

      return { agregado: true, enEspera: true };
    }

    return { agregado: false, enEspera: false };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-xl mr-4 ring-1 ring-purple-200/70">
                  <Trophy size={24} className="text-purple-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Eventos & Retos
                  </h1>
                  <p className="text-gray-600">
                    Gestiona eventos presenciales, retos de entrenamiento y webinars virtuales
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleNuevoEvento('presencial')}
                  variant="primary"
                  iconLeft={<Plus className="w-4 h-4" />}
                >
                  Nuevo Evento
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Estado de carga inicial - Skeleton/Placeholders */}
          {isLoading && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="p-4">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                    </div>
                  </Card>
                ))}
              </div>
              <Card className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </Card>
            </div>
          )}

          {/* Estado de error global - Mensaje con botón reintentar */}
          {globalError && !isLoading && (
            <Card className="p-6 border-red-200 bg-red-50">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-900 mb-1">Error al cargar datos</h3>
                    <p className="text-sm text-red-700">{globalError}</p>
                  </div>
                </div>
                <Button
                  variant="primary"
                  onClick={() => {
                    setGlobalError(null);
                    cargarEventos();
                  }}
                  iconLeft={<RefreshCw className="w-4 h-4" />}
                >
                  Reintentar
                </Button>
              </div>
            </Card>
          )}

          {/* Contenido principal - Solo mostrar si no está cargando y no hay error */}
          {!isLoading && !globalError && (
            <>
              {/* Métricas - Mostrar en todas las secciones */}
              <MetricCards data={metricas} />

              {/* ============================================
              SISTEMA DE TABS - NAVEGACIÓN PRINCIPAL
              ============================================ */}
              {/* NOTA: Primera capa de responsive - Las tabs son scrollables horizontalmente en móvil.
                   Se puede mejorar más adelante con dropdown o mejor UX móvil. */}
              <Card className="p-0 bg-white shadow-sm">
                <div className="px-4 py-3">
                  <div
                    role="tablist"
                    aria-label="Secciones de Eventos y Retos"
                    className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1 overflow-x-auto scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {/* Tab: Gestión */}
                    <button
                      role="tab"
                      aria-selected={tabActivo === 'gestion'}
                      onClick={() => setTabActivo('gestion')}
                      className={`
                    inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap
                    ${tabActivo === 'gestion'
                          ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                        }
                  `}
                    >
                      <List className="w-4 h-4" />
                      <span>Gestión</span>
                    </button>

                    {/* Tab: Calendario */}
                    <button
                      role="tab"
                      aria-selected={tabActivo === 'calendario'}
                      onClick={() => setTabActivo('calendario')}
                      className={`
                    inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap
                    ${tabActivo === 'calendario'
                          ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                        }
                  `}
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Calendario</span>
                    </button>

                    {/* Tab: Retos */}
                    <button
                      role="tab"
                      aria-selected={tabActivo === 'retos'}
                      onClick={() => setTabActivo('retos')}
                      className={`
                    inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap
                    ${tabActivo === 'retos'
                          ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                        }
                  `}
                    >
                      <Target className="w-4 h-4" />
                      <span>Retos</span>
                    </button>

                    {/* Tab: Comunicaciones */}
                    <button
                      role="tab"
                      aria-selected={tabActivo === 'comunicaciones'}
                      onClick={() => setTabActivo('comunicaciones')}
                      className={`
                    inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap
                    ${tabActivo === 'comunicaciones'
                          ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                        }
                  `}
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Comunicaciones</span>
                    </button>

                    {/* Tab: Analytics */}
                    <button
                      role="tab"
                      aria-selected={tabActivo === 'analytics'}
                      onClick={() => setTabActivo('analytics')}
                      className={`
                    inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap
                    ${tabActivo === 'analytics'
                          ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                        }
                  `}
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span>Analytics</span>
                    </button>

                    {/* Tab: Archivo */}
                    <button
                      role="tab"
                      aria-selected={tabActivo === 'archivo'}
                      onClick={() => setTabActivo('archivo')}
                      className={`
                    inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap
                    ${tabActivo === 'archivo'
                          ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                        }
                  `}
                    >
                      <Archive className="w-4 h-4" />
                      <span>Archivo</span>
                    </button>
                  </div>
                </div>
              </Card>

              {/* ============================================
              CONTENIDO DE TABS
              ============================================ */}

              {/* SECCIÓN: GESTIÓN - Listado principal, crear, editar, duplicar, archivar */}
              {tabActivo === 'gestion' && (
                <div className="space-y-6">
                  {/* Próximos Eventos */}
                  {proximosEventos.length > 0 && (
                    <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Clock className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-gray-900">Próximos Eventos</h2>
                            <p className="text-sm text-gray-600">Eventos de los próximos 7 días</p>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {proximosEventos.map(evento => {
                          // Usar countdownTime para forzar actualización
                          const countdown = calcularCountdown(evento.fechaInicio);
                          return (
                            <Card key={evento.id} className="p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                              <div className="space-y-3">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      {getTipoBadge(evento.tipo)}
                                    </div>
                                    <h3 className="font-semibold text-gray-900">{evento.nombre}</h3>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Calendar className="w-4 h-4" />
                                  <span>
                                    {new Date(evento.fechaInicio).toLocaleDateString('es-ES', {
                                      day: 'numeric',
                                      month: 'short',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                </div>

                                {/* Countdown */}
                                {!countdown.terminado && (
                                  <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                                    <Clock className="w-4 h-4 text-purple-600" />
                                    <div className="flex gap-2 text-sm font-medium text-purple-700">
                                      {countdown.dias > 0 && <span>{countdown.dias}d</span>}
                                      {countdown.horas > 0 && <span>{countdown.horas}h</span>}
                                      <span>{countdown.minutos}m</span>
                                      {countdown.dias === 0 && countdown.horas === 0 && <span>{countdown.segundos}s</span>}
                                    </div>
                                  </div>
                                )}

                                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Users className="w-4 h-4" />
                                    <span>{evento.participantes.length} participantes</span>
                                  </div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <button
                                      onClick={() => {
                                        setEventoComunicaciones(evento);
                                        setMostrarPanelComunicaciones(true);
                                      }}
                                      className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                                      title="Panel de comunicaciones (invitaciones, recordatorios, confirmaciones, mensajes)"
                                    >
                                      <MessageCircle className="w-4 h-4" />
                                      Comunicaciones
                                    </button>
                                    <button
                                      onClick={() => abrirModalCheckin(evento)}
                                      className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                                      title="Check-in de asistencia"
                                    >
                                      <ClipboardCheck className="w-4 h-4" />
                                      Check-in
                                    </button>
                                    <button
                                      onClick={() => mostrarParticipantes(evento)}
                                      className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                                    >
                                      Ver lista
                                    </button>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  {getEstadoBadge(evento.estado)}
                                  <button
                                    onClick={() => setEventoSeleccionado(evento)}
                                    className="ml-auto text-sm text-blue-600 hover:text-blue-700 font-medium"
                                  >
                                    Ver detalles
                                  </button>
                                </div>
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    </Card>
                  )}

                  {/* Filtros y Lista de Eventos */}
                  <div className="space-y-4">
                    {/* Filtros */}
                    <Card className="p-4 bg-white shadow-sm">
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">Filtrar por tipo:</span>
                          <div className="flex gap-2">
                            {(['todos', 'presencial', 'reto', 'virtual'] as const).map(tipo => (
                              <button
                                key={tipo}
                                onClick={() => setTipoFiltro(tipo)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${tipoFiltro === tipo
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  }`}
                              >
                                {tipo === 'todos' ? 'Todos' : tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex-1 max-w-md">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              type="text"
                              placeholder="Buscar eventos..."
                              value={busqueda}
                              onChange={(e) => setBusqueda(e.target.value)}
                              className="pl-10"
                            />
                            {busqueda && (
                              <button
                                onClick={() => setBusqueda('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Lista de Eventos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {eventosFiltrados.map(evento => (
                        <Card key={evento.id} className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  {getTipoBadge(evento.tipo)}
                                  {evento.eventoDuplicadoDe && (
                                    <Badge variant="purple" className="text-xs" title={`Duplicado de: ${evento.nombreEventoOriginal}`}>
                                      <Copy className="w-3 h-3 mr-1" />
                                      Duplicado
                                    </Badge>
                                  )}
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mt-2">{evento.nombre}</h3>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{evento.descripcion}</p>
                              </div>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {new Date(evento.fechaInicio).toLocaleDateString('es-ES', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  })}
                                </span>
                              </div>
                              {evento.tipo === 'presencial' && evento.ubicacion && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4" />
                                  <span>{evento.ubicacion}</span>
                                </div>
                              )}
                              {evento.tipo === 'virtual' && evento.plataforma && (
                                <div className="flex items-center gap-2">
                                  <Video className="w-4 h-4" />
                                  <span>{evento.plataforma}</span>
                                </div>
                              )}
                              {evento.tipo === 'reto' && evento.duracionDias && (
                                <div className="flex items-center gap-2">
                                  <Target className="w-4 h-4" />
                                  <span>{evento.duracionDias} días</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                <span>
                                  {evento.participantes.length} / {evento.capacidad} participantes
                                </span>
                              </div>
                              {/* Precio o indicador gratuito (User Story 2) */}
                              <div className="flex items-center gap-2">
                                {evento.esGratuito ? (
                                  <Badge variant="green" className="text-xs">
                                    <Tag className="w-3 h-3 mr-1" />
                                    Gratuito
                                  </Badge>
                                ) : evento.preciosPorTipoCliente && Object.keys(evento.preciosPorTipoCliente).length > 0 ? (
                                  <div className="flex items-center gap-1">
                                    <DollarSign className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm font-semibold text-gray-900">
                                      Desde €{Math.min(...Object.values(evento.preciosPorTipoCliente).filter(p => p !== undefined) as number[])}
                                    </span>
                                  </div>
                                ) : evento.precio ? (
                                  <div className="flex items-center gap-1">
                                    <DollarSign className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm font-semibold text-gray-900">€{evento.precio}</span>
                                  </div>
                                ) : null}
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                              <div className="flex items-center gap-2">
                                {/* Selector rápido de estado (User Story 1) */}
                                <div className="relative">
                                  <select
                                    value={evento.estado}
                                    onChange={(e) => iniciarCambioEstado(evento, e.target.value as EstadoEvento)}
                                    className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-1.5 pr-8 text-sm font-medium cursor-pointer hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    style={{
                                      color: evento.estado === 'programado' ? '#2563eb' :
                                        evento.estado === 'en-curso' ? '#16a34a' :
                                          evento.estado === 'cancelado' ? '#dc2626' :
                                            evento.estado === 'finalizado' ? '#6b7280' : '#9ca3af'
                                    }}
                                  >
                                    <option value="borrador">Borrador</option>
                                    <option value="programado">Programado</option>
                                    <option value="en-curso">En Curso</option>
                                    <option value="finalizado">Finalizado</option>
                                    <option value="cancelado">Cancelado</option>
                                  </select>
                                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                                {/* Botón de historial (User Story 1) */}
                                {evento.historialEstado && evento.historialEstado.length > 0 && (
                                  <button
                                    onClick={() => mostrarHistorial(evento)}
                                    className="p-1.5 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                                    title="Ver historial de cambios"
                                  >
                                    <History className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleDuplicarEvento(evento)}
                                  className="p-1.5 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                                  title="Duplicar evento"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setEventoSeleccionado(evento)}
                                  className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                  title="Ver detalle"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                {evento.tipo === 'reto' && (evento.estado === 'en-curso' || evento.estado === 'programado') && (
                                  <button
                                    onClick={() => mostrarDashboardProgreso(evento)}
                                    className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                    title="Ver progreso de participantes"
                                  >
                                    <Target className="w-4 h-4" />
                                  </button>
                                )}
                                {(evento.estado === 'finalizado' || evento.estado === 'cancelado' || new Date(evento.fechaInicio) < new Date()) && (
                                  <>
                                    <button
                                      onClick={() => mostrarEstadisticasAsistencia(evento)}
                                      className="p-1.5 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                                      title="Ver estadísticas de asistencia"
                                    >
                                      <BarChart3 className="w-4 h-4" />
                                    </button>
                                    {evento.estado === 'finalizado' && (
                                      <button
                                        onClick={() => mostrarFeedbackEvento(evento)}
                                        className="p-1.5 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                                        title="Ver feedback del evento"
                                      >
                                        <Star className="w-4 h-4" />
                                      </button>
                                    )}
                                  </>
                                )}
                                {/* Botón de checklist de preparación (User Story 2) */}
                                <button
                                  onClick={() => abrirModalChecklist(evento)}
                                  className="p-1.5 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                                  title="Checklist de preparación"
                                >
                                  <CheckSquareIcon className="w-4 h-4" />
                                </button>
                                {/* Botón de sincronización con Google Calendar (User Story 1) */}
                                {evento.estado === 'programado' || evento.estado === 'en-curso' ? (
                                  <button
                                    onClick={() => {
                                      const estadoSync = obtenerEstadoSincronizacion(evento);
                                      if (estadoSync.sincronizado || estadoSync.activo) {
                                        handleDesactivarSincronizacion(evento);
                                      } else {
                                        handleSincronizarConCalendario(evento);
                                      }
                                    }}
                                    className={`p-1.5 rounded transition-colors ${evento.sincronizacionCalendario?.activo && !evento.sincronizacionCalendario?.desactivado
                                      ? 'text-blue-600 hover:text-red-600 hover:bg-red-50'
                                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                                      }`}
                                    title={
                                      evento.sincronizacionCalendario?.activo && !evento.sincronizacionCalendario?.desactivado
                                        ? 'Desactivar sincronización con Google Calendar'
                                        : 'Sincronizar con Google Calendar'
                                    }
                                    disabled={sincronizandoCalendario}
                                  >
                                    {sincronizandoCalendario ? (
                                      <RefreshCw className="w-4 h-4 animate-spin" />
                                    ) : evento.sincronizacionCalendario?.activo && !evento.sincronizacionCalendario?.desactivado ? (
                                      <Link className="w-4 h-4" />
                                    ) : (
                                      <Unlink className="w-4 h-4" />
                                    )}
                                  </button>
                                ) : null}
                                <button
                                  onClick={() => handleEditarEvento(evento)}
                                  className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                                  title="Editar"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                {!evento.archivado && (
                                  <button
                                    onClick={() => {
                                      if (window.confirm('¿Estás seguro de que quieres archivar este evento?')) {
                                        archivarEvento(evento.id);
                                      }
                                    }}
                                    className="p-1.5 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                                    title="Archivar"
                                  >
                                    <Archive className="w-4 h-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleEliminar(evento.id)}
                                  className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                  title="Eliminar"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}

                      {eventosFiltrados.length === 0 && (
                        <Card className="p-12 text-center bg-white">
                          <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">No se encontraron eventos</p>
                        </Card>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* SECCIÓN: CALENDARIO - Vista de calendario de eventos */}
              {tabActivo === 'calendario' && (
                <div className="space-y-6">
                  <EventosCalendar
                    eventos={eventos}
                    onEventoClick={(evento) => setEventoSeleccionado(evento)}
                    onEventoMove={handleMoverEvento}
                    tipoFiltro={tipoFiltroCalendario}
                    onTipoFiltroChange={setTipoFiltroCalendario}
                  />
                </div>
              )}

              {/* SECCIÓN: RETOS - Gestión específica de retos y progreso */}
              {tabActivo === 'retos' && (
                <div className="space-y-6">
                  {/* Lista de retos activos */}
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-gray-900">Retos Activos</h2>
                      <Button
                        onClick={() => handleNuevoEvento('reto')}
                        variant="primary"
                        iconLeft={<Plus className="w-4 h-4" />}
                      >
                        Nuevo Reto
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {eventosFiltrados
                        .filter(e => e.tipo === 'reto' && (e.estado === 'programado' || e.estado === 'en-curso'))
                        .map(evento => (
                          <Card key={evento.id} className="p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                            <div className="space-y-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    {getTipoBadge(evento.tipo)}
                                    {getEstadoBadge(evento.estado)}
                                  </div>
                                  <h3 className="font-semibold text-gray-900">{evento.nombre}</h3>
                                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{evento.descripcion}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Target className="w-4 h-4" />
                                <span>{evento.duracionDias || 30} días</span>
                                <Users className="w-4 h-4 ml-2" />
                                <span>{evento.participantes.length} participantes</span>
                              </div>
                              <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => mostrarDashboardProgreso(evento)}
                                  iconLeft={<Target className="w-4 h-4" />}
                                >
                                  Ver Progreso
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEventoSeleccionado(evento)}
                                  iconLeft={<Eye className="w-4 h-4" />}
                                >
                                  Ver Detalle
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                    </div>
                    {eventosFiltrados.filter(e => e.tipo === 'reto' && (e.estado === 'programado' || e.estado === 'en-curso')).length === 0 && (
                      <div className="text-center py-12">
                        <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No hay retos activos</p>
                      </div>
                    )}
                  </Card>
                </div>
              )}

              {/* SECCIÓN: COMUNICACIONES - Invitaciones, recordatorios, mensajes grupales, confirmaciones */}
              {tabActivo === 'comunicaciones' && (
                <div className="space-y-6">
                  <Card className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Comunicaciones</h2>
                    <p className="text-gray-600 mb-6">
                      Gestiona invitaciones, recordatorios, mensajes grupales y confirmaciones de asistencia.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card className="p-4 bg-blue-50 border-blue-200 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => {
                          // Abrir modal de invitaciones desde un evento seleccionado o crear uno nuevo
                          if (eventosFiltrados.length > 0) {
                            abrirModalInvitaciones(eventosFiltrados[0]);
                          }
                        }}
                      >
                        <UserPlus className="w-8 h-8 text-blue-600 mb-2" />
                        <h3 className="font-semibold text-gray-900 mb-1">Invitaciones</h3>
                        <p className="text-sm text-gray-600">Enviar invitaciones a clientes y grupos</p>
                      </Card>
                      <Card className="p-4 bg-purple-50 border-purple-200 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => {
                          if (eventosFiltrados.length > 0) {
                            abrirModalMensajeGrupal(eventosFiltrados[0]);
                          }
                        }}
                      >
                        <MessageSquare className="w-8 h-8 text-purple-600 mb-2" />
                        <h3 className="font-semibold text-gray-900 mb-1">Mensajes Grupales</h3>
                        <p className="text-sm text-gray-600">Enviar mensajes a todos los participantes</p>
                      </Card>
                      <Card className="p-4 bg-green-50 border-green-200 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => {
                          if (eventosFiltrados.length > 0) {
                            abrirModalSolicitudConfirmacion(eventosFiltrados[0]);
                          }
                        }}
                      >
                        <CheckSquare className="w-8 h-8 text-green-600 mb-2" />
                        <h3 className="font-semibold text-gray-900 mb-1">Confirmaciones</h3>
                        <p className="text-sm text-gray-600">Solicitar confirmación de asistencia</p>
                      </Card>
                      <Card className="p-4 bg-orange-50 border-orange-200 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => {
                          if (eventosFiltrados.length > 0 && eventosFiltrados[0].id) {
                            setEventoHistorialRecordatorios(eventosFiltrados[0]);
                            setMostrarHistorialRecordatorios(true);
                          }
                        }}
                      >
                        <Bell className="w-8 h-8 text-orange-600 mb-2" />
                        <h3 className="font-semibold text-gray-900 mb-1">Recordatorios</h3>
                        <p className="text-sm text-gray-600">Configurar y ver recordatorios automáticos</p>
                      </Card>
                    </div>
                  </Card>
                </div>
              )}

              {/* SECCIÓN: ANALYTICS - Dashboards, modales de analítica y feedback */}
              {tabActivo === 'analytics' && (
                <div className="space-y-6">
                  <Card className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Analytics y Métricas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={mostrarMetricasGenerales}
                      >
                        <BarChart3 className="w-10 h-10 text-blue-600 mb-3" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Métricas Generales</h3>
                        <p className="text-sm text-gray-600 mb-4">Dashboard completo con KPIs y análisis de rendimiento</p>
                        <Button variant="primary" size="sm">Ver Dashboard</Button>
                      </Card>
                      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={mostrarAnalyticsEventos}
                      >
                        <TrendingUp className="w-10 h-10 text-purple-600 mb-3" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics de Eventos</h3>
                        <p className="text-sm text-gray-600 mb-4">Rankings, comparativas y análisis de horarios</p>
                        <Button variant="primary" size="sm">Ver Analytics</Button>
                      </Card>
                    </div>
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Eventos Finalizados - Feedback</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {eventosFiltrados
                          .filter(e => e.estado === 'finalizado')
                          .slice(0, 6)
                          .map(evento => (
                            <Card key={evento.id} className="p-4 hover:shadow-md transition-shadow">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-medium text-gray-900">{evento.nombre}</h4>
                                <Star className="w-4 h-4 text-yellow-400" />
                              </div>
                              <p className="text-sm text-gray-600 mb-3">
                                {new Date(evento.fechaInicio).toLocaleDateString('es-ES')}
                              </p>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => mostrarFeedbackEvento(evento)}
                                className="w-full"
                              >
                                Ver Feedback
                              </Button>
                            </Card>
                          ))}
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* SECCIÓN: ARCHIVO - Eventos archivados */}
              {tabActivo === 'archivo' && (
                <div className="space-y-6">
                  <ArchivoEventos
                    eventos={eventos}
                    busqueda={busquedaArchivo}
                    tipoFiltro={tipoFiltroArchivo}
                    fechaDesde={fechaDesdeArchivo}
                    fechaHasta={fechaHastaArchivo}
                    rendimientoFiltro={rendimientoFiltroArchivo}
                    onBusquedaChange={setBusquedaArchivo}
                    onTipoFiltroChange={setTipoFiltroArchivo}
                    onFechaDesdeChange={setFechaDesdeArchivo}
                    onFechaHastaChange={setFechaHastaArchivo}
                    onRendimientoFiltroChange={setRendimientoFiltroArchivo}
                    onDesarchivar={desarchivarEvento}
                    onDuplicar={handleDuplicarEvento}
                    onEventoClick={(evento) => setEventoSeleccionado(evento)}
                  />
                </div>
              )}

            </>
          )}
        </div>

        {/* ============================================
          MODALES - TODOS LOS MODALES SE RENDERIZAN AQUÍ
          ============================================ */}

        {/* All modals go here */}

      </div>
    </div>
  );
}
