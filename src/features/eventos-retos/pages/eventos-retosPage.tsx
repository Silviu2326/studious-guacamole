import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, MetricCards, Button, Modal } from '../../../components/componentsreutilizables';
import { Trophy, Plus, MapPin, Calendar, Users, Video, Target, Search, X, Edit, Trash2, Eye, Copy, Save, EyeOff, CheckCircle, AlertCircle, FileText, BookOpen, DollarSign, Tag, Clock, ChevronDown, History, Bell, Send, UserPlus, UserX, AlertTriangle, UserCheck, Download, FileSpreadsheet, FileText as FileTextIcon, ClipboardCheck, Link, Share2, MessageSquare, CheckSquare, BarChart3, TrendingUp, Star, MessageCircle, RefreshCw, Unlink, CheckSquare as CheckSquareIcon, List, PlusCircle, GripVertical, Trash, Package, Archive } from 'lucide-react';
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
import { calcularRankingEventos, compararTiposEvento, analizarMejoresHorarios, generarInsightsEventos, RankingEvento, ComparativaTipoEvento, AnalisisHorarios, InsightsEventos } from '../services/eventosAnalyticsService';
import { sincronizarEventoConCalendario, desincronizarEventoDeCalendario, conectarGoogleCalendarSiNecesario, obtenerEstadoSincronizacion, sincronizarEventosAutomaticamente } from '../services/calendarioSyncService';
import { crearChecklistVacio, agregarItemChecklist, completarItemChecklist, eliminarItemChecklist, actualizarItemChecklist, aplicarPlantillaChecklist, obtenerPlantillasChecklist, guardarPlantillaChecklist, obtenerPorcentajeCompletado, verificarYEnviarRecordatoriosPreparacion, obtenerPlantillasPredefinidas } from '../services/checklistPreparacionService';
import { FeedbackResultsModal } from '../components/FeedbackResultsModal';
import { EventAnalyticsModal } from '../components/EventAnalyticsModal';
import { DashboardProgresoRetos } from '../components/DashboardProgresoRetos';
import { DashboardMetricasGenerales } from '../components/DashboardMetricasGenerales';
import { EventosCalendar } from '../components/EventosCalendar';
import { ArchivoEventos } from '../components/ArchivoEventos';

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

export default function EventosRetosPage() {
  const { user } = useAuth();
  const isEntrenador = user?.role === 'entrenador';
  
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [plantillas, setPlantillas] = useState<PlantillaEvento[]>([]);
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
  const [participanteAEliminar, setParticipanteAEliminar] = useState<{eventoId: string, participante: Participante} | null>(null);
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
  
  // Estados para estadísticas de asistencia (User Story 2)
  const [mostrarModalEstadisticas, setMostrarModalEstadisticas] = useState(false);
  const [eventoEstadisticas, setEventoEstadisticas] = useState<Evento | null>(null);
  const [estadisticasEvento, setEstadisticasEvento] = useState<EstadisticasAsistenciaEvento | null>(null);
  
  // Estados para feedback post-evento (User Story 1)
  const [mostrarModalFeedback, setMostrarModalFeedback] = useState(false);
  const [eventoFeedback, setEventoFeedback] = useState<Evento | null>(null);
  const [estadisticasFeedback, setEstadisticasFeedback] = useState<EstadisticasFeedback | null>(null);
  
  // Estados para analytics de eventos (User Story 2)
  const [mostrarModalAnalytics, setMostrarModalAnalytics] = useState(false);
  const [rankings, setRankings] = useState<RankingEvento[]>([]);
  const [comparativas, setComparativas] = useState<ComparativaTipoEvento[]>([]);
  const [analisisHorarios, setAnalisisHorarios] = useState<AnalisisHorarios | null>(null);
  const [insights, setInsights] = useState<InsightsEventos | null>(null);
  
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
  const [plantillasChecklist, setPlantillasChecklist] = useState<any[]>([]);
  const [mostrarModalPlantillasChecklist, setMostrarModalPlantillasChecklist] = useState(false);
  const [editandoItemChecklist, setEditandoItemChecklist] = useState<string | null>(null);
  
  // Estados para calendario (User Story 1)
  const [vistaCalendario, setVistaCalendario] = useState(false);
  const [tipoFiltroCalendario, setTipoFiltroCalendario] = useState<TipoEvento | 'todos'>('todos');
  
  // Estados para archivado (User Story 2)
  const [mostrarArchivo, setMostrarArchivo] = useState(false);
  const [busquedaArchivo, setBusquedaArchivo] = useState('');
  
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
      // Verificar recordatorios de preparación
      verificarYEnviarRecordatoriosPreparacion(eventos);
    }
  }, [eventos.length]); // Solo dependemos de la longitud para evitar loops infinitos
  
  // Cargar plantillas de checklist y verificar conexión de calendario
  useEffect(() => {
    const cargarDatosAdicionales = async () => {
      try {
        // Cargar plantillas de checklist
        const plantillas = await obtenerPlantillasChecklist(undefined, user?.id);
        
        // Si no hay plantillas, crear las predefinidas
        if (plantillas.length === 0) {
          const plantillasPredefinidas = obtenerPlantillasPredefinidas();
          for (const plantilla of plantillasPredefinidas) {
            await guardarPlantillaChecklist({
              ...plantilla,
              creadoPor: user?.id || 'system',
            });
          }
          const plantillasCargadas = await obtenerPlantillasChecklist(undefined, user?.id);
          setPlantillasChecklist(plantillasCargadas);
        } else {
          setPlantillasChecklist(plantillas);
        }
        
        // Verificar conexión de calendario
        const conexion = await conectarGoogleCalendarSiNecesario(user?.id);
        if (conexion.yaConectado) {
          setConexionCalendario({ id: conexion.conexionId });
        }
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
        return;
      } catch (error) {
        console.error('Error cargando eventos de localStorage:', error);
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

  const eventosFiltrados = useMemo(() => {
    let filtrados = eventos;

    // Excluir eventos archivados de la vista principal (a menos que estemos en vista de archivo)
    if (!mostrarArchivo) {
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
  }, [eventos, tipoFiltro, busqueda, mostrarArchivo]);

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
        const cambio = detectarCambiosRelevantes(eventoEditando, eventoAGuardar);
        
        // Si hay cambio relevante y hay participantes, mostrar modal de notificación
        if (cambio && (eventoEditando.participantesDetalle?.length || 0) > 0) {
          setCambioEventoDetectado(cambio);
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
      if (notificarCambioEvento) {
        const resultado = await enviarNotificacionCambioEvento(
          cambioEventoDetectado,
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
      const estadisticas = calcularEstadisticasFeedback(encuesta);
      setEventoFeedback(evento);
      setEstadisticasFeedback(estadisticas);
      setMostrarModalFeedback(true);
    } else {
      alert('No hay encuesta disponible para este evento. Las encuestas se envían automáticamente después de que el evento finalice.');
    }
  };
  
  // Handler para ver analytics de eventos (User Story 2)
  const mostrarAnalyticsEventos = () => {
    const eventosFinalizados = eventos.filter(e => e.estado === 'finalizado');
    
    if (eventosFinalizados.length === 0) {
      alert('No hay eventos finalizados para analizar. Los analytics están disponibles una vez que tengas eventos completados.');
      return;
    }
    
    const rankingsData = calcularRankingEventos(eventosFinalizados, 'valoracion');
    const comparativasData = compararTiposEvento(eventosFinalizados);
    const analisisHorariosData = analizarMejoresHorarios(eventosFinalizados);
    const insightsData = generarInsightsEventos(eventosFinalizados);
    
    setRankings(rankingsData);
    setComparativas(comparativasData);
    setAnalisisHorarios(analisisHorariosData);
    setInsights(insightsData);
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

  const eliminarItemDeChecklist = (itemId: string) => {
    if (!eventoChecklist) return;
    if (!confirm('¿Estás seguro de que quieres eliminar este item?')) return;
    
    const checklist = eventoChecklist.checklistPreparacion;
    if (!checklist) return;
    
    const nuevoChecklist = eliminarItemChecklist(checklist, itemId);
    
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

  const aplicarPlantillaAChecklist = async (plantillaId: string) => {
    if (!eventoChecklist) return;
    
    const plantilla = plantillasChecklist.find(p => p.id === plantillaId);
    if (!plantilla) return;
    
    const checklist = eventoChecklist.checklistPreparacion || crearChecklistVacio();
    const nuevoChecklist = aplicarPlantillaChecklist(checklist, plantilla);
    
    const eventosActualizados = eventos.map(e => {
      if (e.id === eventoChecklist.id) {
        return { ...e, checklistPreparacion: nuevoChecklist };
      }
      return e;
    });
    
    setEventos(eventosActualizados);
    guardarEventos(eventosActualizados);
    
    // Actualizar contador de uso
    const plantillaActualizada = { ...plantilla, usoFrecuente: plantilla.usoFrecuente + 1 };
    await guardarPlantillaChecklist(plantillaActualizada);
    
    const eventoActualizado = eventosActualizados.find(e => e.id === eventoChecklist.id);
    if (eventoActualizado) {
      setEventoChecklist(eventoActualizado);
      if (eventoSeleccionado?.id === eventoChecklist.id) {
        setEventoSeleccionado(eventoActualizado);
      }
    }
    
    // Recargar plantillas
    const plantillas = await obtenerPlantillasChecklist(eventoChecklist.tipo, user?.id);
    setPlantillasChecklist(plantillas);
    
    alert('Plantilla aplicada exitosamente');
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

      await guardarPlantillaChecklist(plantilla);
      
      // Recargar plantillas
      const plantillas = await obtenerPlantillasChecklist(eventoChecklist.tipo, user?.id);
      setPlantillasChecklist(plantillas);
      
      alert('Plantilla de checklist guardada exitosamente');
    } catch (error) {
      console.error('Error guardando plantilla de checklist:', error);
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

  // Función para agregar participantes al evento (User Story 1)
  const agregarParticipantes = async () => {
    if (!eventoAgregarParticipantes || clientesSeleccionados.length === 0) return;

    try {
      // Obtener información completa de los clientes seleccionados
      const clientesSeleccionadosData = clientesDisponibles.filter(c => 
        clientesSeleccionados.includes(c.id)
      );

      // Crear objetos Participante
      const nuevosParticipantes: Participante[] = clientesSeleccionadosData.map(cliente => ({
        id: cliente.id,
        nombre: cliente.name,
        email: cliente.email,
        telefono: cliente.phone,
        foto: undefined, // Por ahora sin foto
        confirmado: false, // Por defecto no confirmado
        asistencia: false,
        fechaInscripcion: new Date(),
        esNoInscrito: false,
      }));

      // Actualizar evento con lista de espera automática (US-ER-10)
      const eventosActualizados = eventos.map(e => {
        if (e.id === eventoAgregarParticipantes.id) {
          const participantesActuales = e.participantesDetalle || [];
          const participantesIdsActuales = e.participantes || [];
          const listaEsperaActual = e.listaEspera || [];
          
          // Separar participantes que caben directamente y los que van a lista de espera
          const espaciosDisponibles = e.capacidad - participantesActuales.length;
          const participantesQueCaben = nuevosParticipantes.slice(0, Math.max(0, espaciosDisponibles));
          const participantesEnEspera = nuevosParticipantes.slice(espaciosDisponibles);
          
          // Agregar participantes que caben
          const participantesActualizados = [...participantesActuales, ...participantesQueCaben];
          const participantesIdsActualizados = [...participantesIdsActuales, ...participantesQueCaben.map(p => p.id)];
          
          // Agregar a lista de espera si el evento está lleno
          const nuevaListaEspera = participantesEnEspera.length > 0 
            ? [...listaEsperaActual, ...participantesEnEspera]
            : listaEsperaActual;
          
          // Mostrar mensaje si algunos fueron a lista de espera
          if (participantesEnEspera.length > 0) {
            alert(`${participantesEnEspera.length} participante(s) agregado(s) a lista de espera. El evento está lleno.`);
          }
          
          return {
            ...e,
            participantes: participantesIdsActualizados,
            participantesDetalle: participantesActualizados,
            listaEspera: nuevaListaEspera,
          };
        }
        return e;
      });

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
      alert(`${nuevosParticipantes.length} participante(s) agregado(s) exitosamente`);
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

  // Función para eliminar participante (US-ER-09)
  const eliminarParticipante = () => {
    if (!participanteAEliminar) return;

    const { eventoId, participante } = participanteAEliminar;
    const eventosActualizados = eventos.map(e => {
      if (e.id === eventoId) {
        // Remover de participantes confirmados
        const participantesActualizados = (e.participantesDetalle || []).filter(p => p.id !== participante.id);
        const participantesIdsActualizados = e.participantes.filter(id => id !== participante.id);
        
        // Crear registro de cancelación
        const cancelacion: Cancelacion = {
          participanteId: participante.id,
          participanteNombre: participante.nombre,
          fechaCancelacion: new Date(),
          motivo: motivoCancelacionInput || undefined,
          movidoAEspera: moverAEspera,
        };
        
        const cancelaciones = e.cancelaciones || [];
        cancelaciones.push(cancelacion);
        
        let listaEsperaActualizada = e.listaEspera || [];
        
        // Si se elige mover a lista de espera, agregar allí
        if (moverAEspera) {
          const participanteEnEspera: Participante = {
            ...participante,
            confirmado: false,
            fechaCancelacion: new Date(),
            motivoCancelacion: motivoCancelacionInput || undefined,
          };
          listaEsperaActualizada = [...listaEsperaActualizada, participanteEnEspera];
        }
        
        // Si hay espacio y hay personas en lista de espera, mover la primera a confirmados
        const hayEspacio = participantesActualizados.length < e.capacidad;
        let nuevosParticipantes = participantesActualizados;
        let nuevaListaEspera = listaEsperaActualizada;
        let notificacionEnviada = false;
        
        if (hayEspacio && listaEsperaActualizada.length > 0) {
          const primerEnEspera = listaEsperaActualizada[0];
          nuevosParticipantes = [...nuevosParticipantes, {
            ...primerEnEspera,
            confirmado: false,
            fechaInscripcion: new Date(),
            fechaCancelacion: undefined,
            motivoCancelacion: undefined,
          }];
          nuevaListaEspera = listaEsperaActualizada.slice(1);
          notificacionEnviada = true;
          
          // Mostrar notificación cuando se libera un espacio (US-ER-10)
          setTimeout(() => {
            alert(`¡Espacio liberado! ${primerEnEspera.nombre} ha sido movido automáticamente de la lista de espera a participantes confirmados.`);
          }, 100);
          
          // Aquí se podría enviar una notificación real al primer participante en espera
          console.log(`Notificación: Se liberó un espacio para ${primerEnEspera.nombre} en el evento ${e.nombre}`);
        }
        
        return {
          ...e,
          participantes: participantesIdsActualizados,
          participantesDetalle: nuevosParticipantes,
          listaEspera: nuevaListaEspera,
          cancelaciones,
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
    
    // Cerrar modal y limpiar estados
    setMostrarModalEliminarParticipante(false);
    setParticipanteAEliminar(null);
    setMoverAEspera(false);
    setMotivoCancelacionInput('');
  };

  // Función para mover participante de lista de espera a confirmados (US-ER-10)
  const moverDeEsperaAConfirmados = (eventoId: string, participanteId: string) => {
    const eventosActualizados = eventos.map(e => {
      if (e.id === eventoId && e.listaEspera) {
        const participanteEnEspera = e.listaEspera.find(p => p.id === participanteId);
        if (participanteEnEspera) {
          // Verificar si hay espacio
          const participantesActuales = e.participantesDetalle || [];
          if (participantesActuales.length >= e.capacidad) {
            alert('El evento está lleno. No se puede mover más participantes.');
            return e;
          }
          
          // Remover de lista de espera
          const nuevaListaEspera = e.listaEspera.filter(p => p.id !== participanteId);
          
          // Agregar a confirmados
          const participanteConfirmado: Participante = {
            ...participanteEnEspera,
            confirmado: false,
            fechaInscripcion: new Date(),
            fechaCancelacion: undefined,
            motivoCancelacion: undefined,
          };
          
          const nuevosParticipantes = [...participantesActuales, participanteConfirmado];
          const nuevosParticipantesIds = [...e.participantes, participanteId];
          
          // Mostrar confirmación
          alert(`${participanteEnEspera.nombre} ha sido movido a participantes confirmados.`);
          
          return {
            ...e,
            participantes: nuevosParticipantesIds,
            participantesDetalle: nuevosParticipantes,
            listaEspera: nuevaListaEspera,
          };
        }
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

  // Función para agregar participante no inscrito en check-in
  const agregarParticipanteNoInscrito = () => {
    if (!eventoCheckin || !nuevoParticipanteNombre.trim()) {
      alert('Por favor ingresa al menos el nombre del participante');
      return;
    }

    const nuevoId = `no-inscrito-${Date.now()}`;
    const nuevoParticipante: Participante = {
      id: nuevoId,
      nombre: nuevoParticipanteNombre.trim(),
      email: nuevoParticipanteEmail.trim() || undefined,
      telefono: nuevoParticipanteTelefono.trim() || undefined,
      confirmado: false,
      asistencia: true,
      fechaInscripcion: new Date(),
      esNoInscrito: true,
    };

    // Agregar a las asistencias
    setAsistenciasCheckin(prev => ({
      ...prev,
      [nuevoId]: true,
    }));

    // Agregar al evento temporalmente (se guardará cuando se guarde el check-in)
    if (eventoCheckin) {
      const participantesActuales = eventoCheckin.participantesDetalle || [];
      eventoCheckin.participantesDetalle = [...participantesActuales, nuevoParticipante];
      eventoCheckin.participantes = [...eventoCheckin.participantes, nuevoId];
      setEventoCheckin({ ...eventoCheckin });
    }

    // Limpiar formulario
    setNuevoParticipanteNombre('');
    setNuevoParticipanteEmail('');
    setNuevoParticipanteTelefono('');
    setMostrarFormularioNoInscrito(false);
  };

  // Función para guardar registro de asistencia (User Story 1)
  const guardarCheckin = () => {
    if (!eventoCheckin) return;

    // Obtener todos los participantes del evento check-in (incluyendo los agregados temporalmente)
    const todosLosParticipantesCheckin = eventoCheckin.participantesDetalle || [];

    const eventosActualizados = eventos.map(e => {
      if (e.id === eventoCheckin.id) {
        // Crear un mapa de participantes existentes por ID
        const participantesExistentesMap = new Map(
          (e.participantesDetalle || []).map(p => [p.id, p])
        );

        // Actualizar o agregar participantes
        const participantesActualizados: Participante[] = [];
        const idsProcesados = new Set<string>();

        // Primero, actualizar participantes existentes con sus asistencias
        participantesExistentesMap.forEach((p, id) => {
          const participanteCheckin = todosLosParticipantesCheckin.find(pc => pc.id === id);
          if (participanteCheckin) {
            // Usar datos del check-in si están disponibles
            participantesActualizados.push({
              ...p,
              asistencia: asistenciasCheckin[id] !== undefined ? asistenciasCheckin[id] : p.asistencia,
            });
          } else {
            // Mantener participante existente con asistencia actualizada si existe
            participantesActualizados.push({
              ...p,
              asistencia: asistenciasCheckin[id] !== undefined ? asistenciasCheckin[id] : p.asistencia,
            });
          }
          idsProcesados.add(id);
        });

        // Agregar participantes no inscritos nuevos que fueron agregados en el check-in
        todosLosParticipantesCheckin.forEach(p => {
          if (!idsProcesados.has(p.id) && p.esNoInscrito && asistenciasCheckin[p.id] === true) {
            participantesActualizados.push(p);
            idsProcesados.add(p.id);
          }
        });

        return {
          ...e,
          participantesDetalle: participantesActualizados,
          participantes: participantesActualizados.map(p => p.id),
        };
      }
      return e;
    });

    setEventos(eventosActualizados);

    // Actualizar evento seleccionado si es el mismo
    if (eventoSeleccionado?.id === eventoCheckin.id) {
      const eventoActualizado = eventosActualizados.find(e => e.id === eventoCheckin.id);
      if (eventoActualizado) {
        setEventoSeleccionado(eventoActualizado);
      }
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
                  onClick={() => {
                    setVistaCalendario(!vistaCalendario);
                    setMostrarArchivo(false);
                  }}
                  variant={vistaCalendario ? "primary" : "secondary"}
                  iconLeft={<Calendar className="w-4 h-4" />}
                >
                  Calendario
                </Button>
                <Button
                  onClick={() => {
                    setMostrarArchivo(!mostrarArchivo);
                    setVistaCalendario(false);
                  }}
                  variant={mostrarArchivo ? "primary" : "secondary"}
                  iconLeft={<Archive className="w-4 h-4" />}
                >
                  Archivo
                </Button>
                <Button
                  onClick={mostrarAnalyticsEventos}
                  variant="secondary"
                  iconLeft={<TrendingUp className="w-4 h-4" />}
                >
                  Analytics
                </Button>
                <Button
                  onClick={mostrarMetricasGenerales}
                  variant="secondary"
                  iconLeft={<BarChart3 className="w-4 h-4" />}
                >
                  Métricas Generales
                </Button>
                <Button
                  onClick={() => setMostrarGaleríaPlantillas(true)}
                  variant="secondary"
                  iconLeft={<BookOpen className="w-4 h-4" />}
                >
                  Plantillas
                </Button>
                <Button
                  onClick={() => handleNuevoEvento('presencial')}
                  variant="secondary"
                  iconLeft={<MapPin className="w-4 h-4" />}
                >
                  Nuevo Presencial
                </Button>
                <Button
                  onClick={() => handleNuevoEvento('reto')}
                  variant="secondary"
                  iconLeft={<Target className="w-4 h-4" />}
                >
                  Nuevo Reto
                </Button>
                <Button
                  onClick={() => handleNuevoEvento('virtual')}
                  variant="secondary"
                  iconLeft={<Video className="w-4 h-4" />}
                >
                  Nuevo Virtual
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* Métricas */}
          <MetricCards data={metricas} />

          {/* Vista de Calendario (User Story 1) */}
          {vistaCalendario && (
            <div className="mb-6">
              <EventosCalendar
                eventos={eventos}
                onEventoClick={(evento) => setEventoSeleccionado(evento)}
                onEventoMove={handleMoverEvento}
                tipoFiltro={tipoFiltroCalendario}
                onTipoFiltroChange={setTipoFiltroCalendario}
              />
            </div>
          )}

          {/* Vista de Archivo (User Story 2) */}
          {mostrarArchivo && (
            <div className="mb-6">
              <ArchivoEventos
                eventos={eventos}
                busqueda={busquedaArchivo}
                tipoFiltro={tipoFiltroArchivo}
                onBusquedaChange={setBusquedaArchivo}
                onTipoFiltroChange={setTipoFiltroArchivo}
                onDesarchivar={desarchivarEvento}
                onEventoClick={(evento) => setEventoSeleccionado(evento)}
              />
            </div>
          )}

          {/* Próximos Eventos (User Story 2) - Solo mostrar si no estamos en vista de calendario o archivo */}
          {!vistaCalendario && !mostrarArchivo && proximosEventos.length > 0 && (
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
                              onClick={() => abrirModalSolicitudConfirmacion(evento)}
                              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                              title="Solicitar confirmación de asistencia"
                              disabled={evento.estado !== 'programado' || evento.participantes.length === 0}
                            >
                              <CheckSquare className="w-4 h-4" />
                              Confirmación
                            </button>
                            <button
                              onClick={() => abrirModalMensajeGrupal(evento)}
                              className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                              title="Enviar mensaje grupal"
                              disabled={evento.participantes.length === 0}
                            >
                              <MessageSquare className="w-4 h-4" />
                              Mensaje
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

          {/* Filtros y Lista de Eventos - Solo mostrar si no estamos en vista de calendario o archivo */}
          {!vistaCalendario && !mostrarArchivo && (
            <>
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
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            tipoFiltro === tipo
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
                          className={`p-1.5 rounded transition-colors ${
                            evento.sincronizacionCalendario?.activo && !evento.sincronizacionCalendario?.desactivado
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
            </>
          )}
        </div>
      </div>

      {/* Modal de Formulario */}
      {mostrarFormulario && (
        <Modal
          isOpen={mostrarFormulario}
          onClose={() => {
            setMostrarFormulario(false);
            setEventoEditando(null);
            setErroresValidacion({});
            setMostrarVistaPrevia(false);
          }}
          title={plantillaEditando ? 'Editar Plantilla' : eventoEditando ? 'Editar Evento' : formData.eventoDuplicadoDe ? 'Duplicar Evento' : 'Nuevo Evento'}
          size="xl"
        >
          <div className="space-y-4">
            {/* Indicador de evento duplicado */}
            {formData.eventoDuplicadoDe && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 flex items-center gap-2">
                <Copy className="w-5 h-5 text-purple-600" />
                <p className="text-sm text-purple-700">
                  Este evento es una copia de "{formData.nombreEventoOriginal}". Puedes editar todos los campos antes de guardar.
                </p>
              </div>
            )}

            {/* Tipo de evento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Evento <span className="text-red-500">*</span>
              </label>
              <Select
                value={tipoFormulario}
                onChange={(value) => {
                  setTipoFormulario(value as TipoEvento);
                  setFormData({ ...formData, tipo: value as TipoEvento });
                  // Limpiar errores al cambiar tipo
                  if (erroresValidacion.tipo) {
                    setErroresValidacion({ ...erroresValidacion, tipo: '' });
                  }
                }}
                options={[
                  { label: 'Presencial', value: 'presencial' },
                  { label: 'Reto', value: 'reto' },
                  { label: 'Virtual', value: 'virtual' },
                ]}
              />
              {erroresValidacion.tipo && (
                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {erroresValidacion.tipo}
                </p>
              )}
            </div>

            {/* Campos comunes */}
            <div>
              <Input
                label="Nombre del Evento"
                value={formData.nombre || ''}
                onChange={(e) => {
                  setFormData({ ...formData, nombre: e.target.value });
                  if (erroresValidacion.nombre) {
                    setErroresValidacion({ ...erroresValidacion, nombre: '' });
                  }
                }}
                placeholder="Ej: Maratón de Fuerza"
                error={erroresValidacion.nombre}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={formData.descripcion || ''}
                onChange={(e) => {
                  setFormData({ ...formData, descripcion: e.target.value });
                  if (erroresValidacion.descripcion) {
                    setErroresValidacion({ ...erroresValidacion, descripcion: '' });
                  }
                }}
                placeholder="Describe el evento..."
                rows={3}
                className={erroresValidacion.descripcion ? 'border-red-500' : ''}
              />
              {erroresValidacion.descripcion && (
                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {erroresValidacion.descripcion}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  label="Fecha de Inicio"
                  type="datetime-local"
                  value={
                    formData.fechaInicio
                      ? new Date(formData.fechaInicio).toISOString().slice(0, 16)
                      : ''
                  }
                  onChange={async (e) => {
                    const nuevaFechaInicio = new Date(e.target.value);
                    setFormData({ ...formData, fechaInicio: nuevaFechaInicio });
                    if (erroresValidacion.fechaInicio) {
                      setErroresValidacion({ ...erroresValidacion, fechaInicio: '' });
                    }
                    // Verificar conflictos si hay ubicación seleccionada
                    if (formData.ubicacionId && tipoFormulario === 'presencial') {
                      const fechaFin = formData.fechaFin || nuevaFechaInicio;
                      const conflictos = await verificarConflictosHorario(
                        formData.ubicacionId,
                        nuevaFechaInicio,
                        fechaFin,
                        eventoEditando?.id
                      );
                      setConflictosHorario(conflictos);
                    }
                  }}
                  error={erroresValidacion.fechaInicio}
                  required
                />
              </div>
              <div>
                <Input
                  label="Capacidad Máxima"
                  type="number"
                  value={formData.capacidad || ''}
                  onChange={(e) => {
                    setFormData({ ...formData, capacidad: parseInt(e.target.value) || 0 });
                    if (erroresValidacion.capacidad) {
                      setErroresValidacion({ ...erroresValidacion, capacidad: '' });
                    }
                  }}
                  placeholder="50"
                  error={erroresValidacion.capacidad}
                  required
                />
              </div>
            </div>

            {/* Inscripciones públicas (User Story 2) */}
            <div className="border-t pt-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="inscripcionesPublicas"
                  checked={formData.inscripcionesPublicasHabilitadas || false}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      inscripcionesPublicasHabilitadas: e.target.checked,
                      publicLink: e.target.checked && !formData.publicLink 
                        ? generarPublicLink(formData.id || Date.now().toString())
                        : formData.publicLink,
                    });
                  }}
                  className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <label htmlFor="inscripcionesPublicas" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Habilitar inscripciones públicas
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Permite que los clientes se inscriban al evento mediante un link público. 
                    Las inscripciones se desactivarán automáticamente cuando el evento alcance su capacidad máxima.
                  </p>
                  {formData.inscripcionesPublicasHabilitadas && formData.publicLink && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-gray-600">
                      <strong>Link generado:</strong> {window.location.origin}/evento-inscripcion/{formData.publicLink}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Configuración de Recordatorios (User Story 2) */}
            {!plantillaEditando && (
              <div className="border-t pt-4 mt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recordatorios Automáticos</h3>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={recordatoriosConfig?.activo ?? true}
                      onChange={(e) => {
                        const nuevaConfig = {
                          ...(recordatoriosConfig || crearConfiguracionRecordatoriosPorDefecto()),
                          activo: e.target.checked,
                        };
                        actualizarConfiguracionRecordatorios(nuevaConfig);
                      }}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Activar recordatorios</span>
                  </label>
                </div>
                
                {recordatoriosConfig && recordatoriosConfig.activo && (
                  <div className="space-y-4">
                    {/* Plantilla de recordatorio */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Plantilla de recordatorio
                      </label>
                      <Textarea
                        value={recordatoriosConfig.plantillaRecordatorio || ''}
                        onChange={(e) => {
                          const nuevaConfig = {
                            ...recordatoriosConfig,
                            plantillaRecordatorio: e.target.value,
                          };
                          actualizarConfiguracionRecordatorios(nuevaConfig);
                        }}
                        rows={4}
                        placeholder="Hola {nombre}, te recordamos que tienes el evento..."
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Variables: {'{nombre}'}, {'{eventoNombre}'}, {'{fecha}'}, {'{hora}'}, {'{ubicacion}'}, {'{tiempoAnticipacion}'}
                      </p>
                    </div>
                    
                    {/* Lista de recordatorios */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Recordatorios programados
                      </label>
                      <div className="space-y-3">
                        {recordatoriosConfig.recordatorios.map((rec, index) => (
                          <div key={rec.id} className="border rounded-lg p-4 bg-gray-50">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <Input
                                    type="number"
                                    value={rec.tiempoAnticipacionHoras}
                                    onChange={(e) => {
                                      actualizarRecordatorio(rec.id, {
                                        tiempoAnticipacionHoras: parseInt(e.target.value) || 24,
                                      });
                                    }}
                                    className="w-24"
                                    min="1"
                                  />
                                  <span className="text-sm text-gray-700">horas antes del evento</span>
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={rec.activo}
                                      onChange={(e) => {
                                        actualizarRecordatorio(rec.id, { activo: e.target.checked });
                                      }}
                                      className="w-4 h-4 text-blue-600 rounded"
                                    />
                                    <span className="text-xs text-gray-600">Activo</span>
                                  </label>
                                </div>
                                <div className="flex gap-2">
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={rec.canales.includes('email')}
                                      onChange={(e) => {
                                        const nuevosCanales = e.target.checked
                                          ? [...rec.canales, 'email']
                                          : rec.canales.filter(c => c !== 'email');
                                        actualizarRecordatorio(rec.id, { canales: nuevosCanales });
                                      }}
                                      className="w-4 h-4 text-blue-600 rounded"
                                    />
                                    <span className="text-xs text-gray-600">Email</span>
                                  </label>
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={rec.canales.includes('whatsapp')}
                                      onChange={(e) => {
                                        const nuevosCanales = e.target.checked
                                          ? [...rec.canales, 'whatsapp']
                                          : rec.canales.filter(c => c !== 'whatsapp');
                                        actualizarRecordatorio(rec.id, { canales: nuevosCanales });
                                      }}
                                      className="w-4 h-4 text-blue-600 rounded"
                                    />
                                    <span className="text-xs text-gray-600">WhatsApp</span>
                                  </label>
                                </div>
                              </div>
                              {recordatoriosConfig.recordatorios.length > 1 && (
                                <button
                                  onClick={() => eliminarRecordatorio(rec.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                  title="Eliminar recordatorio"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={agregarRecordatorio}
                  iconLeft={<Plus className="w-4 h-4" />}
                        >
                          Agregar recordatorio
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Campos de Pricing (User Story 2) */}
            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Precio y Monetización</h3>
              
              <div className="space-y-4">
                {/* Checkbox para evento gratuito */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="esGratuito"
                    checked={formData.esGratuito || false}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        esGratuito: e.target.checked,
                        precio: e.target.checked ? undefined : formData.precio,
                        preciosPorTipoCliente: e.target.checked ? {} : formData.preciosPorTipoCliente,
                      });
                    }}
                    className="rounded"
                  />
                  <label htmlFor="esGratuito" className="text-sm font-medium text-gray-700">
                    Evento gratuito
                  </label>
                </div>

                {!formData.esGratuito && (
                  <>
                    {/* Precio general */}
                    <div>
                      <Input
                        label="Precio General (€)"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.precio || ''}
                        onChange={(e) => {
                          const precio = e.target.value ? parseFloat(e.target.value) : undefined;
                          setFormData({
                            ...formData,
                            precio,
                            // Si se establece precio general, limpiar precios por tipo
                            preciosPorTipoCliente: precio !== undefined && precio !== null && precio > 0 ? {} : formData.preciosPorTipoCliente,
                          });
                        }}
                        placeholder="0.00"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Precio único para todos los tipos de clientes
                      </p>
                    </div>

                    {/* Precios por tipo de cliente */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Precios por Tipo de Cliente (opcional)
                      </label>
                      <p className="text-xs text-gray-500 mb-3">
                        Establece precios diferenciados por tipo de cliente. Si se establecen, se usan en lugar del precio general.
                      </p>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Input
                            label="Regular (€)"
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.preciosPorTipoCliente?.regular || ''}
                            onChange={(e) => {
                              const precio = e.target.value ? parseFloat(e.target.value) : undefined;
                              const nuevosPrecios = {
                                ...formData.preciosPorTipoCliente,
                                regular: precio,
                              };
                              // Si se establece cualquier precio por tipo, limpiar precio general
                              const tienePreciosPorTipo = Object.values(nuevosPrecios).some(p => p !== undefined && p !== null && p > 0);
                              setFormData({
                                ...formData,
                                preciosPorTipoCliente: nuevosPrecios,
                                precio: tienePreciosPorTipo ? undefined : formData.precio,
                              });
                            }}
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <Input
                            label="Premium (€)"
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.preciosPorTipoCliente?.premium || ''}
                            onChange={(e) => {
                              const precio = e.target.value ? parseFloat(e.target.value) : undefined;
                              const nuevosPrecios = {
                                ...formData.preciosPorTipoCliente,
                                premium: precio,
                              };
                              const tienePreciosPorTipo = Object.values(nuevosPrecios).some(p => p !== undefined && p !== null && p > 0);
                              setFormData({
                                ...formData,
                                preciosPorTipoCliente: nuevosPrecios,
                                precio: tienePreciosPorTipo ? undefined : formData.precio,
                              });
                            }}
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <Input
                            label="VIP (€)"
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.preciosPorTipoCliente?.vip || ''}
                            onChange={(e) => {
                              const precio = e.target.value ? parseFloat(e.target.value) : undefined;
                              const nuevosPrecios = {
                                ...formData.preciosPorTipoCliente,
                                vip: precio,
                              };
                              const tienePreciosPorTipo = Object.values(nuevosPrecios).some(p => p !== undefined && p !== null && p > 0);
                              setFormData({
                                ...formData,
                                preciosPorTipoCliente: nuevosPrecios,
                                precio: tienePreciosPorTipo ? undefined : formData.precio,
                              });
                            }}
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Sincronización con Google Calendar (User Story 1) */}
            {!plantillaEditando && (
              <div className="border-t pt-4 mt-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Sincronización con Google Calendar</h3>
                      <p className="text-sm text-gray-600">Sincroniza tus eventos con tu calendario personal</p>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.sincronizacionCalendario?.activo && !formData.sincronizacionCalendario?.desactivado || false}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          sincronizacionCalendario: {
                            activo: e.target.checked,
                            sincronizacionBidireccional: true,
                            desactivado: !e.target.checked,
                          },
                        });
                      }}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Activar sincronización</span>
                  </label>
                </div>
                
                {formData.sincronizacionCalendario?.activo && !formData.sincronizacionCalendario?.desactivado && (
                  <div className="space-y-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.sincronizacionCalendario?.sincronizacionBidireccional || false}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            sincronizacionCalendario: {
                              ...formData.sincronizacionCalendario,
                              sincronizacionBidireccional: e.target.checked,
                            } as any,
                          });
                        }}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <label className="text-sm text-gray-700">
                        Sincronización bidireccional (los cambios en Google Calendar se reflejarán aquí)
                      </label>
                    </div>
                    <p className="text-xs text-gray-600">
                      El evento se creará automáticamente en Google Calendar cuando se publique. 
                      Si no tienes una cuenta conectada, se te pedirá autorización.
                    </p>
                    {formData.sincronizacionCalendario?.errorSincronizacion && (
                      <div className="bg-red-50 border border-red-200 rounded p-2 text-sm text-red-700">
                        {formData.sincronizacionCalendario.errorSincronizacion}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Checklist de Preparación (User Story 2) */}
            {!plantillaEditando && (
              <div className="border-t pt-4 mt-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <CheckSquareIcon className="w-5 h-5 text-purple-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Checklist de Preparación</h3>
                      <p className="text-sm text-gray-600">Agrega tareas y materiales necesarios para el evento</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="recordatorioPreparacion"
                      checked={formData.checklistPreparacion?.recordatorioUnDiaAntes || false}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          checklistPreparacion: {
                            ...formData.checklistPreparacion,
                            items: formData.checklistPreparacion?.items || [],
                            recordatorioUnDiaAntes: e.target.checked,
                          } as any,
                        });
                      }}
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                    <label htmlFor="recordatorioPreparacion" className="text-sm text-gray-700">
                      Enviar recordatorio de preparación un día antes del evento
                    </label>
                  </div>
                  
                  {formData.checklistPreparacion && formData.checklistPreparacion.items.length > 0 && (
                    <div className="bg-gray-50 border rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Items de preparación ({formData.checklistPreparacion.items.filter(i => i.completado).length} / {formData.checklistPreparacion.items.length} completados)
                      </p>
                      <div className="space-y-2">
                        {formData.checklistPreparacion.items.map(item => (
                          <div key={item.id} className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={item.completado}
                              onChange={() => {
                                // Toggle will be handled when viewing/editing the event
                              }}
                              className="w-4 h-4 text-purple-600 rounded"
                              disabled
                            />
                            <span className={item.completado ? 'line-through text-gray-500' : 'text-gray-700'}>
                              {item.nombre}
                            </span>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Puedes gestionar el checklist completo desde el detalle del evento después de publicarlo.
                      </p>
                    </div>
                  )}
                  
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      if (!formData.checklistPreparacion) {
                        setFormData({
                          ...formData,
                          checklistPreparacion: crearChecklistVacio(),
                        });
                      }
                    }}
                    iconLeft={<PlusCircle className="w-4 h-4" />}
                  >
                    Agregar items al checklist
                  </Button>
                </div>
              </div>
            )}

            {/* Campos específicos por tipo */}
            {tipoFormulario === 'presencial' && (
              <>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ubicación/Sala <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <Select
                        value={formData.ubicacionId || ''}
                        onChange={async (value) => {
                          const ubicacionSeleccionada = ubicaciones.find(u => u.id === value);
                          if (ubicacionSeleccionada) {
                            // Verificar conflictos de horario
                            const fechaInicio = formData.fechaInicio || new Date();
                            const fechaFin = formData.fechaFin || fechaInicio;
                            const conflictos = await verificarConflictosHorario(
                              value,
                              fechaInicio,
                              fechaFin,
                              eventoEditando?.id
                            );
                            setConflictosHorario(conflictos);
                            
                            // Obtener capacidad máxima de la ubicación
                            const capacidadMaxima = ubicacionSeleccionada.capacidadMaxima;
                            
                            // Actualizar formData
                            setFormData({
                              ...formData,
                              ubicacionId: value,
                              ubicacion: ubicacionSeleccionada.nombre,
                              ubicacionDetalle: {
                                id: ubicacionSeleccionada.id,
                                nombre: ubicacionSeleccionada.nombre,
                                capacidadMaxima: capacidadMaxima,
                                tipo: ubicacionSeleccionada.tipo,
                              },
                              // Ajustar capacidad si excede la máxima de la ubicación
                              capacidad: formData.capacidad && formData.capacidad > capacidadMaxima
                                ? capacidadMaxima
                                : formData.capacidad || capacidadMaxima,
                            });
                            
                            if (erroresValidacion.ubicacion) {
                              setErroresValidacion({ ...erroresValidacion, ubicacion: '' });
                            }
                          }
                        }}
                        options={[
                          { label: 'Selecciona una ubicación', value: '' },
                          ...(ubicacionesFrecuentes.length > 0 ? [{
                            label: '--- Frecuentes ---',
                            value: '__frecuentes__',
                            disabled: true,
                          }] : []),
                          ...ubicacionesFrecuentes.map(u => ({
                            label: `${u.nombre} (Cap: ${u.capacidadMaxima})`,
                            value: u.id,
                          })),
                          ...(ubicaciones.filter(u => !u.frecuente).length > 0 ? [{
                            label: '--- Otras ---',
                            value: '__otras__',
                            disabled: true,
                          }] : []),
                          ...ubicaciones.filter(u => !u.frecuente).map(u => ({
                            label: `${u.nombre} (Cap: ${u.capacidadMaxima})`,
                            value: u.id,
                          })),
                        ]}
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setMostrarModalGestionUbicaciones(true)}
                        iconLeft={<Plus className="w-4 h-4" />}
                      >
                        Nueva
                      </Button>
                    </div>
                    {formData.ubicacionId && (
                      <div className="mt-2">
                        {formData.ubicacionDetalle && (
                          <p className="text-xs text-gray-600">
                            Capacidad máxima: {formData.ubicacionDetalle.capacidadMaxima} personas
                          </p>
                        )}
                      </div>
                    )}
                    {conflictosHorario.length > 0 && (
                      <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-red-800 mb-1">
                              Conflicto de horario detectado
                            </p>
                            <p className="text-xs text-red-700 mb-2">
                              La sala ya está reservada en el mismo horario para:
                            </p>
                            <ul className="list-disc list-inside text-xs text-red-700 space-y-1">
                              {conflictosHorario.map((conflicto) => (
                                <li key={conflicto.eventoId}>
                                  {conflicto.eventoNombre} - {new Date(conflicto.fechaInicio).toLocaleString('es-ES')}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                    {erroresValidacion.ubicacion && (
                      <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {erroresValidacion.ubicacion}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <Input
                    label="Requisitos Físicos"
                    value={formData.requisitosFisicos || ''}
                    onChange={(e) => setFormData({ ...formData, requisitosFisicos: e.target.value })}
                    placeholder="Ej: Nivel intermedio"
                  />
                </div>
                <div>
                  <Input
                    label="Material Necesario"
                    value={formData.materialNecesario || ''}
                    onChange={(e) => setFormData({ ...formData, materialNecesario: e.target.value })}
                    placeholder="Ej: Pesas y barras"
                  />
                </div>
              </>
            )}

            {tipoFormulario === 'reto' && (
              <>
                <div>
                  <Input
                    label="Duración (días)"
                    type="number"
                    value={formData.duracionDias || ''}
                    onChange={(e) => {
                      setFormData({ ...formData, duracionDias: parseInt(e.target.value) || 0 });
                      if (erroresValidacion.duracionDias) {
                        setErroresValidacion({ ...erroresValidacion, duracionDias: '' });
                      }
                    }}
                    placeholder="30"
                    error={erroresValidacion.duracionDias}
                    required
                  />
                </div>
                <div>
                  <Input
                    label="Objetivo del Reto"
                    value={formData.objetivo || ''}
                    onChange={(e) => {
                      setFormData({ ...formData, objetivo: e.target.value });
                      if (erroresValidacion.objetivo) {
                        setErroresValidacion({ ...erroresValidacion, objetivo: '' });
                      }
                    }}
                    placeholder="Ej: Mejora general de condición física"
                    error={erroresValidacion.objetivo}
                    required
                  />
                </div>
                <div>
                  <Input
                    label="Métricas a Seguir"
                    value={formData.metricas || ''}
                    onChange={(e) => setFormData({ ...formData, metricas: e.target.value })}
                    placeholder="Ej: Entrenamientos, pasos, hidratación"
                  />
                </div>
                <div>
                  <Input
                    label="Premios/Incentivos"
                    value={formData.premios || ''}
                    onChange={(e) => setFormData({ ...formData, premios: e.target.value })}
                    placeholder="Ej: Certificado y descuento"
                  />
                </div>
              </>
            )}

            {tipoFormulario === 'virtual' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plataforma <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.plataforma || ''}
                    onChange={(value) => {
                      setFormData({ ...formData, plataforma: value });
                      if (erroresValidacion.plataforma) {
                        setErroresValidacion({ ...erroresValidacion, plataforma: '' });
                      }
                    }}
                    options={[
                      { label: 'Zoom', value: 'Zoom' },
                      { label: 'Teams', value: 'Teams' },
                      { label: 'Google Meet', value: 'Google Meet' },
                      { label: 'Otra', value: 'Otra' },
                    ]}
                  />
                  {erroresValidacion.plataforma && (
                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {erroresValidacion.plataforma}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    label="Link de Acceso"
                    value={formData.linkAcceso || ''}
                    onChange={(e) => {
                      setFormData({ ...formData, linkAcceso: e.target.value });
                      if (erroresValidacion.linkAcceso) {
                        setErroresValidacion({ ...erroresValidacion, linkAcceso: '' });
                      }
                    }}
                    placeholder="https://..."
                    error={erroresValidacion.linkAcceso}
                    required
                  />
                </div>
                <div>
                  <Input
                    label="Requisitos Técnicos"
                    value={formData.requisitosTecnicos || ''}
                    onChange={(e) => setFormData({ ...formData, requisitosTecnicos: e.target.value })}
                    placeholder="Ej: Conexión estable a internet"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.grabacion || false}
                    onChange={(e) => setFormData({ ...formData, grabacion: e.target.checked })}
                    className="rounded"
                  />
                  <label className="text-sm font-medium text-gray-700">Grabar sesión</label>
                </div>
              </>
            )}

            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-gray-500">
                <span className="text-red-500">*</span> Campos obligatorios
              </div>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setMostrarFormulario(false);
                    setEventoEditando(null);
                    setPlantillaEditando(null);
                    setErroresValidacion({});
                    setMostrarVistaPrevia(false);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleGuardarBorrador}
                  iconLeft={<Save className="w-4 h-4" />}
                >
                  Guardar Borrador
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    if (validarFormulario(false)) {
                      setMostrarVistaPrevia(true);
                    }
                  }}
                  iconLeft={<Eye className="w-4 h-4" />}
                >
                  Vista Previa
                </Button>
                {!plantillaEditando && (
                  <Button
                    variant="secondary"
                    onClick={handleGuardarComoPlantilla}
                    iconLeft={<FileText className="w-4 h-4" />}
                  >
                    Guardar como Plantilla
                  </Button>
                )}
                <Button
                  onClick={handlePublicar}
                  iconLeft={<CheckCircle className="w-4 h-4" />}
                >
                  {plantillaEditando ? 'Guardar Plantilla' : 'Publicar'}
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal para guardar plantilla (User Story 1) */}
      {mostrarModalGuardarPlantilla && (
        <Modal
          isOpen={mostrarModalGuardarPlantilla}
          onClose={() => {
            setMostrarModalGuardarPlantilla(false);
            setNombrePlantilla('');
          }}
          title="Guardar como Plantilla"
          size="md"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Ingresa un nombre para esta plantilla. Podrás usarla para crear eventos similares más rápido.
            </p>
            <Input
              label="Nombre de la Plantilla"
              value={nombrePlantilla}
              onChange={(e) => setNombrePlantilla(e.target.value)}
              placeholder={formData.nombre || 'Nombre de la plantilla'}
              required
            />
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="secondary"
                onClick={() => {
                  setMostrarModalGuardarPlantilla(false);
                  setNombrePlantilla('');
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmarGuardarPlantilla}
                iconLeft={<Save className="w-4 h-4" />}
              >
                Guardar Plantilla
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de Galería de Plantillas (User Story 1) */}
      {mostrarGaleríaPlantillas && (
        <Modal
          isOpen={mostrarGaleríaPlantillas}
          onClose={() => setMostrarGaleríaPlantillas(false)}
          title="Galería de Plantillas"
          size="xl"
        >
          <div className="space-y-4">
            {plantillas.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No tienes plantillas guardadas aún</p>
                <p className="text-sm text-gray-500">
                  Guarda eventos como plantillas para crearlos más rápido en el futuro
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {plantillas.map(plantilla => (
                  <Card key={plantilla.id} className="p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getTipoBadge(plantilla.tipo)}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">{plantilla.nombre}</h3>
                          {plantilla.descripcion && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{plantilla.descripcion}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        Creada: {new Date(plantilla.createdAt).toLocaleDateString('es-ES')}
                      </div>
                      
                      <div className="flex gap-2 pt-2 border-t">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleCrearDesdePlantilla(plantilla)}
                          className="flex-1"
                        >
                          Usar Plantilla
                        </Button>
                        <button
                          onClick={() => handleEditarPlantilla(plantilla)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Editar plantilla"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEliminarPlantilla(plantilla.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Eliminar plantilla"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            <div className="flex justify-end pt-4 border-t">
              <Button
                variant="secondary"
                onClick={() => setMostrarGaleríaPlantillas(false)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de Vista Previa */}
      {mostrarVistaPrevia && (
        <Modal
          isOpen={mostrarVistaPrevia}
          onClose={() => setMostrarVistaPrevia(false)}
          title="Vista Previa del Evento"
          size="lg"
        >
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-800">
                <Eye className="w-5 h-5" />
                <p className="font-semibold">Esta es una vista previa de cómo se verá tu evento cuando sea publicado.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {getTipoBadge(formData.tipo as TipoEvento)}
                {formData.eventoDuplicadoDe && (
                  <Badge variant="purple" className="text-xs">
                    <Copy className="w-3 h-3 mr-1" />
                    Duplicado de: {formData.nombreEventoOriginal}
                  </Badge>
                )}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900">{formData.nombre || 'Sin nombre'}</h2>
                <p className="text-gray-600 mt-2">{formData.descripcion || 'Sin descripción'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {formData.fechaInicio
                      ? new Date(formData.fechaInicio).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'No especificada'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>Capacidad: {formData.capacidad || 0} participantes</span>
                </div>
                {/* Precio o indicador gratuito (User Story 2) */}
                <div className="flex items-center gap-2 text-gray-600">
                  {formData.esGratuito ? (
                    <Badge variant="green" className="text-xs">
                      <Tag className="w-3 h-3 mr-1" />
                      Gratuito
                    </Badge>
                  ) : formData.preciosPorTipoCliente && Object.keys(formData.preciosPorTipoCliente).length > 0 ? (
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold">Precios por tipo:</span>
                      {formData.preciosPorTipoCliente.regular && (
                        <span>Regular: €{formData.preciosPorTipoCliente.regular}</span>
                      )}
                      {formData.preciosPorTipoCliente.premium && (
                        <span>Premium: €{formData.preciosPorTipoCliente.premium}</span>
                      )}
                      {formData.preciosPorTipoCliente.vip && (
                        <span>VIP: €{formData.preciosPorTipoCliente.vip}</span>
                      )}
                    </div>
                  ) : formData.precio ? (
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-semibold">Precio: €{formData.precio}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">Sin precio definido</span>
                  )}
                </div>
              </div>

              {formData.tipo === 'presencial' && (
                <div className="space-y-2">
                  {formData.ubicacion && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{formData.ubicacion}</span>
                    </div>
                  )}
                  {formData.requisitosFisicos && (
                    <div>
                      <p className="font-semibold text-gray-700">Requisitos Físicos:</p>
                      <p className="text-gray-600">{formData.requisitosFisicos}</p>
                    </div>
                  )}
                  {formData.materialNecesario && (
                    <div>
                      <p className="font-semibold text-gray-700">Material Necesario:</p>
                      <p className="text-gray-600">{formData.materialNecesario}</p>
                    </div>
                  )}
                </div>
              )}

              {formData.tipo === 'virtual' && (
                <div className="space-y-2">
                  {formData.plataforma && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Video className="w-4 h-4" />
                      <span>Plataforma: {formData.plataforma}</span>
                    </div>
                  )}
                  {formData.linkAcceso && (
                    <div>
                      <p className="font-semibold text-gray-700">Link de Acceso:</p>
                      <a href={formData.linkAcceso} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                        {formData.linkAcceso}
                      </a>
                    </div>
                  )}
                  {formData.requisitosTecnicos && (
                    <div>
                      <p className="font-semibold text-gray-700">Requisitos Técnicos:</p>
                      <p className="text-gray-600">{formData.requisitosTecnicos}</p>
                    </div>
                  )}
                  {formData.grabacion && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Video className="w-4 h-4" />
                      <span>La sesión será grabada</span>
                    </div>
                  )}
                </div>
              )}

              {formData.tipo === 'reto' && (
                <div className="space-y-2">
                  {formData.duracionDias && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Target className="w-4 h-4" />
                      <span>Duración: {formData.duracionDias} días</span>
                    </div>
                  )}
                  {formData.objetivo && (
                    <div>
                      <p className="font-semibold text-gray-700">Objetivo:</p>
                      <p className="text-gray-600">{formData.objetivo}</p>
                    </div>
                  )}
                  {formData.metricas && (
                    <div>
                      <p className="font-semibold text-gray-700">Métricas a Seguir:</p>
                      <p className="text-gray-600">{formData.metricas}</p>
                    </div>
                  )}
                  {formData.premios && (
                    <div>
                      <p className="font-semibold text-gray-700">Premios/Incentivos:</p>
                      <p className="text-gray-600">{formData.premios}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="secondary"
                onClick={() => setMostrarVistaPrevia(false)}
              >
                Volver a Editar
              </Button>
              <Button
                onClick={() => {
                  setMostrarVistaPrevia(false);
                  handlePublicar();
                }}
                iconLeft={<CheckCircle className="w-4 h-4" />}
              >
                Publicar Ahora
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de Detalle */}
      {eventoSeleccionado && (
        <Modal
          isOpen={!!eventoSeleccionado}
          onClose={() => setEventoSeleccionado(null)}
          title={eventoSeleccionado.nombre}
          size="lg"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-2 flex-wrap">
              {getTipoBadge(eventoSeleccionado.tipo)}
              {getEstadoBadge(eventoSeleccionado.estado)}
              {eventoSeleccionado.eventoDuplicadoDe && (
                <Badge variant="purple" className="text-xs">
                  <Copy className="w-3 h-3 mr-1" />
                  Duplicado de: {eventoSeleccionado.nombreEventoOriginal}
                </Badge>
              )}
            </div>
            <p className="text-gray-600">{eventoSeleccionado.descripcion}</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>
                  {new Date(eventoSeleccionado.fechaInicio).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              {eventoSeleccionado.tipo === 'presencial' && eventoSeleccionado.ubicacion && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{eventoSeleccionado.ubicacion}</span>
                </div>
              )}
              {eventoSeleccionado.tipo === 'virtual' && eventoSeleccionado.linkAcceso && (
                <div>
                  <a
                    href={eventoSeleccionado.linkAcceso}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {eventoSeleccionado.linkAcceso}
                  </a>
                </div>
              )}
            </div>

            {/* Link Público de Inscripción (User Story 2) */}
            {(eventoSeleccionado.estado === 'programado' || eventoSeleccionado.estado === 'en-curso') && (
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Link className="w-5 h-5 text-blue-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Inscripción Pública</h3>
                      <p className="text-sm text-gray-600">
                        Comparte un link para que los clientes se inscriban solos
                      </p>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={eventoSeleccionado.inscripcionesPublicasHabilitadas || false}
                      onChange={() => toggleInscripcionesPublicas(eventoSeleccionado)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Habilitar</span>
                  </label>
                </div>

                {eventoSeleccionado.inscripcionesPublicasHabilitadas && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700 mb-1">Link de inscripción:</p>
                        <p className="text-sm text-gray-600 break-all">
                          {`${window.location.origin}/evento-inscripcion/${eventoSeleccionado.publicLink || generarPublicLink(eventoSeleccionado.id)}`}
                        </p>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => copiarPublicLink(eventoSeleccionado)}
                        iconLeft={linkCopiado ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      >
                        {linkCopiado ? 'Copiado!' : 'Copiar link'}
                      </Button>
                    </div>
                    <div className="mt-3 flex items-start gap-2 text-xs text-gray-600">
                      <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p>
                        Las inscripciones se desactivarán automáticamente cuando el evento alcance su capacidad máxima.
                        {eventoSeleccionado.capacidad - obtenerParticipantesDetalle(eventoSeleccionado).length <= 0 && (
                          <span className="font-medium text-red-600 ml-1">El evento está lleno.</span>
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Sección de Participantes (User Story 2) */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-purple-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Participantes</h3>
                    <p className="text-sm text-gray-600">
                      {obtenerParticipantesDetalle(eventoSeleccionado).length} / {eventoSeleccionado.capacidad} participantes
                      {eventoSeleccionado.capacidad - obtenerParticipantesDetalle(eventoSeleccionado).length > 0 ? (
                        <span className="text-green-600 font-medium ml-1">
                          ({eventoSeleccionado.capacidad - obtenerParticipantesDetalle(eventoSeleccionado).length} lugares disponibles)
                        </span>
                      ) : (
                        <span className="text-red-600 font-medium ml-1">
                          (Evento lleno)
                        </span>
                      )}
                      {eventoSeleccionado.listaEspera && eventoSeleccionado.listaEspera.length > 0 && (
                        <span className="text-orange-600 font-medium ml-2">
                          • {eventoSeleccionado.listaEspera.length} en espera
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => abrirModalAgregarParticipantes(eventoSeleccionado)}
                  iconLeft={<UserPlus className="w-4 h-4" />}
                >
                  Agregar participantes
                </Button>
              </div>

              {/* Lista de Participantes */}
              {obtenerParticipantesDetalle(eventoSeleccionado).length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {obtenerParticipantesDetalle(eventoSeleccionado).map((participante) => (
                    <div
                      key={participante.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        {participante.foto ? (
                          <img
                            src={participante.foto}
                            alt={participante.nombre}
                            className="w-10 h-10 rounded-full object-cover border-2 border-white"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-sm">
                            {participante.nombre.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      
                      {/* Información */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {participante.nombre}
                          </p>
                          {participante.confirmado ? (
                            <Badge variant="green" className="text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Confirmado
                            </Badge>
                          ) : (
                            <Badge variant="gray" className="text-xs">
                              Pendiente
                            </Badge>
                          )}
                        </div>
                        {participante.email && (
                          <p className="text-xs text-gray-500 truncate">{participante.email}</p>
                        )}
                      </div>

                      {/* Botones de acción */}
                      <div className="flex items-center gap-2">
                        {/* Botón de confirmación */}
                        <button
                          onClick={() => toggleConfirmacionParticipante(eventoSeleccionado.id, participante.id)}
                          className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
                            participante.confirmado
                              ? 'text-green-600 hover:bg-green-50'
                              : 'text-gray-400 hover:bg-gray-200'
                          }`}
                          title={participante.confirmado ? 'Marcar como pendiente' : 'Confirmar asistencia'}
                        >
                          <CheckCircle className={`w-5 h-5 ${participante.confirmado ? 'fill-current' : ''}`} />
                        </button>
                        
                        {/* Botón de eliminar (US-ER-09) */}
                        <button
                          onClick={() => abrirModalEliminarParticipante(eventoSeleccionado.id, participante)}
                          className="flex-shrink-0 p-2 rounded-lg transition-colors text-red-400 hover:bg-red-50 hover:text-red-600"
                          title="Eliminar participante"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2">No hay participantes inscritos aún</p>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => abrirModalAgregarParticipantes(eventoSeleccionado)}
                    iconLeft={<UserPlus className="w-4 h-4" />}
                  >
                    Agregar participantes
                  </Button>
                </div>
              )}

              {/* Lista de Espera (US-ER-10) */}
              {eventoSeleccionado.listaEspera && eventoSeleccionado.listaEspera.length > 0 && (
                <div className="mt-6 border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-orange-600" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Lista de Espera</h3>
                        <p className="text-sm text-gray-600">
                          {eventoSeleccionado.listaEspera.length} persona(s) en espera
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {eventoSeleccionado.listaEspera.map((participante, index) => (
                      <div
                        key={participante.id}
                        className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200 hover:bg-orange-100 transition-colors"
                      >
                        {/* Número de posición */}
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center">
                          {index + 1}
                        </div>

                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          {participante.foto ? (
                            <img
                              src={participante.foto}
                              alt={participante.nombre}
                              className="w-10 h-10 rounded-full object-cover border-2 border-white"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-semibold shadow-sm">
                              {participante.nombre.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        
                        {/* Información */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {participante.nombre}
                            </p>
                            <Badge variant="orange" className="text-xs">
                              En espera
                            </Badge>
                          </div>
                          {participante.email && (
                            <p className="text-xs text-gray-500 truncate">{participante.email}</p>
                          )}
                          {participante.fechaCancelacion && (
                            <p className="text-xs text-gray-400">
                              Canceló: {new Date(participante.fechaCancelacion).toLocaleDateString()}
                            </p>
                          )}
                        </div>

                        {/* Botón para mover a confirmados */}
                        {obtenerParticipantesDetalle(eventoSeleccionado).length < eventoSeleccionado.capacidad && (
                          <button
                            onClick={() => moverDeEsperaAConfirmados(eventoSeleccionado.id, participante.id)}
                            className="flex-shrink-0 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                            title="Mover a confirmados"
                          >
                            <UserCheck className="w-4 h-4" />
                            Confirmar
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="secondary" onClick={() => setEventoSeleccionado(null)}>
                Cerrar
              </Button>
              {(eventoSeleccionado.estado === 'finalizado' || eventoSeleccionado.estado === 'cancelado' || new Date(eventoSeleccionado.fechaInicio) < new Date()) && (
                <>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      mostrarEstadisticasAsistencia(eventoSeleccionado);
                      setEventoSeleccionado(null);
                    }}
                    iconLeft={<BarChart3 className="w-4 h-4" />}
                  >
                    Ver Estadísticas
                  </Button>
                  {eventoSeleccionado.estado === 'finalizado' && (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        mostrarFeedbackEvento(eventoSeleccionado);
                        setEventoSeleccionado(null);
                      }}
                      iconLeft={<Star className="w-4 h-4" />}
                    >
                      Ver Feedback
                    </Button>
                  )}
                </>
              )}
              <Button onClick={() => {
                setEventoSeleccionado(null);
                handleEditarEvento(eventoSeleccionado);
              }}>
                Editar
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de Cambio de Estado (User Story 1) */}
      {mostrarModalCambioEstado && eventoCambioEstado && nuevoEstado && (
        <Modal
          isOpen={mostrarModalCambioEstado}
          onClose={() => {
            setMostrarModalCambioEstado(false);
            setEventoCambioEstado(null);
            setNuevoEstado(null);
            setNotificarParticipantes(false);
            setMotivoCambio('');
          }}
          title="Cambiar Estado del Evento"
          size="md"
        >
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Evento:</strong> {eventoCambioEstado.nombre}
              </p>
              <p className="text-sm text-blue-700 mt-1">
                Cambiando de <strong>{getEstadoLabel(eventoCambioEstado.estado)}</strong> a <strong>{getEstadoLabel(nuevoEstado)}</strong>
              </p>
            </div>

            {nuevoEstado === 'cancelado' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-800">Atención</p>
                    <p className="text-sm text-red-700 mt-1">
                      Al cancelar este evento, se notificará a todos los participantes. Esta acción puede afectar la confianza de los clientes.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo del cambio (opcional)
              </label>
              <Textarea
                value={motivoCambio}
                onChange={(e) => setMotivoCambio(e.target.value)}
                placeholder="Explica el motivo del cambio de estado..."
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="notificarParticipantes"
                checked={notificarParticipantes}
                onChange={(e) => setNotificarParticipantes(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="notificarParticipantes" className="text-sm text-gray-700 flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notificar cambio a participantes ({eventoCambioEstado.participantes.length} participantes)
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="secondary"
                onClick={() => {
                  setMostrarModalCambioEstado(false);
                  setEventoCambioEstado(null);
                  setNuevoEstado(null);
                  setNotificarParticipantes(false);
                  setMotivoCambio('');
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmarCambioEstado}
                iconLeft={<CheckCircle className="w-4 h-4" />}
                variant={nuevoEstado === 'cancelado' ? 'destructive' : 'primary'}
              >
                Confirmar Cambio
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de Historial de Estado (User Story 1) */}
      {mostrarHistorialEstado && eventoHistorial && (
        <Modal
          isOpen={mostrarHistorialEstado}
          onClose={() => {
            setMostrarHistorialEstado(false);
            setEventoHistorial(null);
          }}
          title={`Historial de Cambios - ${eventoHistorial.nombre}`}
          size="lg"
        >
          <div className="space-y-4">
            {eventoHistorial.historialEstado && eventoHistorial.historialEstado.length > 0 ? (
              <div className="space-y-3">
                {eventoHistorial.historialEstado
                  .sort((a, b) => new Date(b.fechaCambio).getTime() - new Date(a.fechaCambio).getTime())
                  .map((cambio, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="gray">{cambio.estadoAnterior}</Badge>
                            <span className="text-gray-400">→</span>
                            {getEstadoBadge(cambio.estadoNuevo)}
                          </div>
                          <p className="text-sm text-gray-600">
                            <strong>Cambiado por:</strong> {cambio.usuarioNombre}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Fecha:</strong> {new Date(cambio.fechaCambio).toLocaleString('es-ES', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                          {cambio.motivo && (
                            <p className="text-sm text-gray-700 mt-2">
                              <strong>Motivo:</strong> {cambio.motivo}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            {cambio.notificado ? (
                              <Badge variant="green" className="text-xs">
                                <Bell className="w-3 h-3 mr-1" />
                                Notificado a participantes
                              </Badge>
                            ) : (
                              <Badge variant="gray" className="text-xs">
                                No notificado
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No hay historial de cambios de estado</p>
              </div>
            )}
            <div className="flex justify-end pt-4 border-t">
              <Button
                variant="secondary"
                onClick={() => {
                  setMostrarHistorialEstado(false);
                  setEventoHistorial(null);
                }}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de Eliminar Participante (US-ER-09) */}
      {mostrarModalEliminarParticipante && participanteAEliminar && (
        <Modal
          isOpen={mostrarModalEliminarParticipante}
          onClose={() => {
            setMostrarModalEliminarParticipante(false);
            setParticipanteAEliminar(null);
            setMoverAEspera(false);
            setMotivoCancelacionInput('');
          }}
          title="Eliminar Participante"
          size="md"
        >
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-800">Confirmar eliminación</p>
                  <p className="text-sm text-red-700 mt-1">
                    ¿Estás seguro de que deseas eliminar a <strong>{participanteAEliminar.participante.nombre}</strong> del evento?
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo de cancelación (opcional)
              </label>
              <Textarea
                value={motivoCancelacionInput}
                onChange={(e) => setMotivoCancelacionInput(e.target.value)}
                placeholder="Ej: Canceló por motivos personales, cambio de fecha, etc."
                rows={3}
                className="w-full"
              />
            </div>

            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <input
                type="checkbox"
                id="moverAEspera"
                checked={moverAEspera}
                onChange={(e) => setMoverAEspera(e.target.checked)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label htmlFor="moverAEspera" className="text-sm text-gray-700 cursor-pointer">
                Mover a lista de espera en lugar de eliminar completamente
              </label>
            </div>

            {moverAEspera && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800">
                  El participante será movido a la lista de espera y podrá ser agregado nuevamente si se libera un espacio.
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="secondary"
                onClick={() => {
                  setMostrarModalEliminarParticipante(false);
                  setParticipanteAEliminar(null);
                  setMoverAEspera(false);
                  setMotivoCancelacionInput('');
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={eliminarParticipante}
                variant={moverAEspera ? "primary" : "destructive"}
                iconLeft={<UserX className="w-4 h-4" />}
              >
                {moverAEspera ? 'Mover a Lista de Espera' : 'Eliminar Participante'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de Participantes (User Story 2) */}
      {mostrarModalParticipantes && eventoParticipantes && (
        <Modal
          isOpen={mostrarModalParticipantes}
          onClose={() => {
            setMostrarModalParticipantes(false);
            setEventoParticipantes(null);
          }}
          title={`Participantes - ${eventoParticipantes.nombre}`}
          size="md"
        >
          <div className="space-y-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm text-purple-800 mb-2">
                <strong>Total:</strong> {eventoParticipantes.participantes.length} / {eventoParticipantes.capacidad} participantes
              </p>
              {eventoParticipantes.solicitudConfirmacion && (() => {
                const participantes = eventoParticipantes.participantesDetalle || [];
                const participantesActivos = participantes.filter(p => !p.fechaCancelacion);
                const confirmados = participantesActivos.filter(p => {
                  const conf = (p as any).confirmacionAsistencia;
                  return conf === 'confirmado' || (conf === undefined && p.confirmado);
                }).length;
                const noPueden = participantesActivos.filter(p => (p as any).confirmacionAsistencia === 'no-puede').length;
                const pendientes = participantesActivos.filter(p => {
                  const conf = (p as any).confirmacionAsistencia;
                  return conf === 'pendiente' || conf === undefined;
                }).length;
                return (
                  <div className="mt-2 pt-2 border-t border-purple-200">
                    <p className="text-xs text-purple-700 font-semibold mb-1">Estado de Confirmación:</p>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-green-700">✓ Confirmados: {confirmados}</span>
                      <span className="text-red-700">✗ No pueden: {noPueden}</span>
                      <span className="text-gray-600">⏳ Pendientes: {pendientes}</span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {eventoParticipantes.participantes.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {obtenerParticipantesDetalle(eventoParticipantes).map((participante) => (
                  <div key={participante.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex-shrink-0">
                      {participante.foto ? (
                        <img
                          src={participante.foto}
                          alt={participante.nombre}
                          className="w-10 h-10 rounded-full object-cover border-2 border-white"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-sm">
                          {participante.nombre.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium text-gray-900">
                          {participante.nombre}
                        </p>
                        {(() => {
                          const confAsistencia = (participante as any).confirmacionAsistencia;
                          if (confAsistencia === 'confirmado' || (confAsistencia === undefined && participante.confirmado)) {
                            return (
                              <Badge variant="green" className="text-xs">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Confirmado
                              </Badge>
                            );
                          } else if (confAsistencia === 'no-puede') {
                            return (
                              <Badge variant="red" className="text-xs">
                                <X className="w-3 h-3 mr-1" />
                                No puede asistir
                              </Badge>
                            );
                          } else if (confAsistencia === 'pendiente' || (eventoParticipantes.solicitudConfirmacion && confAsistencia === undefined)) {
                            return (
                              <Badge variant="yellow" className="text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                Pendiente confirmación
                              </Badge>
                            );
                          } else {
                            return (
                              <Badge variant="gray" className="text-xs">
                                Pendiente
                              </Badge>
                            );
                          }
                        })()}
                      </div>
                      {participante.email && (
                        <p className="text-xs text-gray-500">{participante.email}</p>
                      )}
                      {participante.telefono && (
                        <p className="text-xs text-gray-500">{participante.telefono}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {participante.asistencia !== undefined && (
                          <Badge variant={participante.asistencia ? "green" : "gray"} className="text-xs">
                            {participante.asistencia ? "Asistió" : "No asistió"}
                          </Badge>
                        )}
                        {participante.esNoInscrito && (
                          <Badge variant="yellow" className="text-xs">
                            No inscrito
                          </Badge>
                        )}
                        {(participante as any).fechaConfirmacionAsistencia && (
                          <span className="text-xs text-gray-500">
                            Confirmado: {new Date((participante as any).fechaConfirmacionAsistencia).toLocaleDateString('es-ES')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No hay participantes inscritos aún</p>
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t gap-3">
              {eventoParticipantes.participantes.length > 0 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => exportarAExcel(eventoParticipantes)}
                    iconLeft={<FileSpreadsheet className="w-4 h-4" />}
                    className="flex items-center gap-2"
                  >
                    Excel
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => exportarAPDF(eventoParticipantes)}
                    iconLeft={<FileTextIcon className="w-4 h-4" />}
                    className="flex items-center gap-2"
                  >
                    PDF
                  </Button>
                </div>
              )}
              <Button
                variant="secondary"
                onClick={() => {
                  setMostrarModalParticipantes(false);
                  setEventoParticipantes(null);
                }}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de Agregar Participantes (User Story 1) */}
      {mostrarModalAgregarParticipantes && eventoAgregarParticipantes && (
        <Modal
          isOpen={mostrarModalAgregarParticipantes}
          onClose={() => {
            setMostrarModalAgregarParticipantes(false);
            setEventoAgregarParticipantes(null);
            setClientesSeleccionados([]);
            setBusquedaClientes('');
          }}
          title={`Agregar Participantes - ${eventoAgregarParticipantes.nombre}`}
          size="lg"
        >
          <div className="space-y-4">
            {/* Información del evento */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Capacidad:</strong> {eventoAgregarParticipantes.participantes.length} / {eventoAgregarParticipantes.capacidad} participantes
                {eventoAgregarParticipantes.capacidad - eventoAgregarParticipantes.participantes.length > 0 && (
                  <span className="ml-2">
                    ({eventoAgregarParticipantes.capacidad - eventoAgregarParticipantes.participantes.length} lugares disponibles)
                  </span>
                )}
              </p>
            </div>

            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Buscar cliente por nombre..."
                value={busquedaClientes}
                onChange={(e) => setBusquedaClientes(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Contador de seleccionados */}
            {clientesSeleccionados.length > 0 && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <p className="text-sm text-purple-800 font-medium">
                  {clientesSeleccionados.length} cliente(s) seleccionado(s)
                </p>
              </div>
            )}

            {/* Lista de clientes */}
            {cargandoClientes ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando clientes...</p>
              </div>
            ) : (
              <>
                {clientesDisponibles.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">
                      {busquedaClientes
                        ? 'No se encontraron clientes con ese nombre'
                        : 'No hay clientes disponibles para agregar'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-2">
                    {clientesDisponibles
                      .filter(cliente =>
                        busquedaClientes.trim() === '' ||
                        cliente.name.toLowerCase().includes(busquedaClientes.toLowerCase())
                      )
                      .map((cliente) => {
                        const estaSeleccionado = clientesSeleccionados.includes(cliente.id);
                        return (
                          <div
                            key={cliente.id}
                            onClick={() => {
                              if (estaSeleccionado) {
                                setClientesSeleccionados(clientesSeleccionados.filter(id => id !== cliente.id));
                              } else {
                                // Verificar capacidad
                                const participantesActuales = eventoAgregarParticipantes.participantes.length;
                                const nuevosSeleccionados = clientesSeleccionados.length;
                                if (participantesActuales + nuevosSeleccionados + 1 > eventoAgregarParticipantes.capacidad) {
                                  alert(`No se pueden agregar más participantes. Capacidad máxima: ${eventoAgregarParticipantes.capacidad}`);
                                  return;
                                }
                                setClientesSeleccionados([...clientesSeleccionados, cliente.id]);
                              }
                            }}
                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                              estaSeleccionado
                                ? 'bg-purple-50 border-purple-300'
                                : 'bg-white border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            {/* Checkbox */}
                            <div className="flex-shrink-0">
                              <div
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                  estaSeleccionado
                                    ? 'bg-purple-600 border-purple-600'
                                    : 'border-gray-300'
                                }`}
                              >
                                {estaSeleccionado && (
                                  <CheckCircle className="w-4 h-4 text-white" />
                                )}
                              </div>
                            </div>

                            {/* Avatar */}
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-sm">
                                {cliente.name.charAt(0).toUpperCase()}
                              </div>
                            </div>

                            {/* Información */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {cliente.name}
                              </p>
                              {cliente.email && (
                                <p className="text-xs text-gray-500 truncate">{cliente.email}</p>
                              )}
                              {cliente.phone && (
                                <p className="text-xs text-gray-500">{cliente.phone}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </>
            )}

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="secondary"
                onClick={() => {
                  setMostrarModalAgregarParticipantes(false);
                  setEventoAgregarParticipantes(null);
                  setClientesSeleccionados([]);
                  setBusquedaClientes('');
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={agregarParticipantes}
                disabled={clientesSeleccionados.length === 0}
                iconLeft={<UserPlus className="w-4 h-4" />}
              >
                Agregar {clientesSeleccionados.length > 0 ? `(${clientesSeleccionados.length})` : ''}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de Check-in (User Story 1) */}
      {mostrarModalCheckin && eventoCheckin && (
        <Modal
          isOpen={mostrarModalCheckin}
          onClose={() => {
            setMostrarModalCheckin(false);
            setEventoCheckin(null);
            setAsistenciasCheckin({});
            setNuevoParticipanteNombre('');
            setNuevoParticipanteEmail('');
            setNuevoParticipanteTelefono('');
            setMostrarFormularioNoInscrito(false);
          }}
          title={`Check-in - ${eventoCheckin.nombre}`}
          size="lg"
        >
          <div className="space-y-4">
            {/* Información del evento */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-green-800">
                    {eventoCheckin.nombre}
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    {new Date(eventoCheckin.fechaInicio).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-800">
                    <strong>Asistentes:</strong> {Object.values(asistenciasCheckin).filter(a => a).length} / {obtenerParticipantesDetalle(eventoCheckin).length}
                  </p>
                </div>
              </div>
            </div>

            {/* Lista de participantes inscritos */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Participantes Inscritos</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {obtenerParticipantesDetalle(eventoCheckin).map((participante) => (
                  <div
                    key={participante.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      asistenciasCheckin[participante.id]
                        ? 'bg-green-50 border-green-300'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                    onClick={() => toggleAsistenciaCheckin(participante.id)}
                  >
                    {/* Checkbox */}
                    <div className="flex-shrink-0">
                      <div
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                          asistenciasCheckin[participante.id]
                            ? 'bg-green-600 border-green-600'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        {asistenciasCheckin[participante.id] && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>

                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {participante.foto ? (
                        <img
                          src={participante.foto}
                          alt={participante.nombre}
                          className="w-10 h-10 rounded-full object-cover border-2 border-white"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-sm">
                          {participante.nombre.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Información */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {participante.nombre}
                      </p>
                      {participante.email && (
                        <p className="text-xs text-gray-500 truncate">{participante.email}</p>
                      )}
                      {participante.telefono && (
                        <p className="text-xs text-gray-500">{participante.telefono}</p>
                      )}
                    </div>

                    {/* Badge de confirmación */}
                    {participante.confirmado && (
                      <Badge variant="green" className="text-xs">
                        Confirmado
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Botón para agregar participante no inscrito */}
            {!mostrarFormularioNoInscrito && (
              <Button
                variant="secondary"
                onClick={() => setMostrarFormularioNoInscrito(true)}
                iconLeft={<UserPlus className="w-4 h-4" />}
                className="w-full"
              >
                Agregar Participante No Inscrito
              </Button>
            )}

            {/* Formulario para agregar participante no inscrito */}
            {mostrarFormularioNoInscrito && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-blue-800">Nuevo Participante</h3>
                  <button
                    onClick={() => {
                      setMostrarFormularioNoInscrito(false);
                      setNuevoParticipanteNombre('');
                      setNuevoParticipanteEmail('');
                      setNuevoParticipanteTelefono('');
                    }}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <Input
                  type="text"
                  placeholder="Nombre *"
                  value={nuevoParticipanteNombre}
                  onChange={(e) => setNuevoParticipanteNombre(e.target.value)}
                  className="w-full"
                />
                <Input
                  type="email"
                  placeholder="Email (opcional)"
                  value={nuevoParticipanteEmail}
                  onChange={(e) => setNuevoParticipanteEmail(e.target.value)}
                  className="w-full"
                />
                <Input
                  type="tel"
                  placeholder="Teléfono (opcional)"
                  value={nuevoParticipanteTelefono}
                  onChange={(e) => setNuevoParticipanteTelefono(e.target.value)}
                  className="w-full"
                />
                <Button
                  onClick={agregarParticipanteNoInscrito}
                  disabled={!nuevoParticipanteNombre.trim()}
                  iconLeft={<UserPlus className="w-4 h-4" />}
                  className="w-full"
                >
                  Agregar y Marcar como Presente
                </Button>
              </div>
            )}

            {/* Lista de participantes no inscritos agregados */}
            {eventoCheckin.participantesDetalle?.some(p => p.esNoInscrito && asistenciasCheckin[p.id]) && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Participantes No Inscritos Agregados</h3>
                <div className="space-y-2">
                  {eventoCheckin.participantesDetalle
                    .filter(p => p.esNoInscrito && asistenciasCheckin[p.id])
                    .map((participante) => (
                      <div
                        key={participante.id}
                        className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center text-white font-semibold shadow-sm">
                          {participante.nombre.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{participante.nombre}</p>
                          {participante.email && (
                            <p className="text-xs text-gray-500">{participante.email}</p>
                          )}
                          {participante.telefono && (
                            <p className="text-xs text-gray-500">{participante.telefono}</p>
                          )}
                        </div>
                        <Badge variant="yellow" className="text-xs">
                          No inscrito
                        </Badge>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="secondary"
                onClick={() => {
                  setMostrarModalCheckin(false);
                  setEventoCheckin(null);
                  setAsistenciasCheckin({});
                  setNuevoParticipanteNombre('');
                  setNuevoParticipanteEmail('');
                  setNuevoParticipanteTelefono('');
                  setMostrarFormularioNoInscrito(false);
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={guardarCheckin}
                iconLeft={<Save className="w-4 h-4" />}
                className="bg-green-600 hover:bg-green-700"
              >
                Guardar Check-in
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de Enviar Invitaciones (User Story 1) */}
      {mostrarModalInvitaciones && eventoInvitaciones && (
        <Modal
          isOpen={mostrarModalInvitaciones}
          onClose={() => {
            setMostrarModalInvitaciones(false);
            setEventoInvitaciones(null);
            setDestinatariosSeleccionados([]);
            setBusquedaInvitaciones('');
          }}
          title={`Enviar Invitaciones - ${eventoInvitaciones.nombre}`}
          size="xl"
        >
          <div className="space-y-6">
            {/* Selector de tipo de destinatarios */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar destinatarios
              </label>
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setTipoSelectorInvitaciones('clientes')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    tipoSelectorInvitaciones === 'clientes'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Clientes
                </button>
                <button
                  onClick={() => setTipoSelectorInvitaciones('grupos')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    tipoSelectorInvitaciones === 'grupos'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Grupos
                </button>
                <button
                  onClick={() => setTipoSelectorInvitaciones('ambos')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    tipoSelectorInvitaciones === 'ambos'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Ambos
                </button>
              </div>
            </div>

            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Buscar clientes o grupos..."
                value={busquedaInvitaciones}
                onChange={(e) => setBusquedaInvitaciones(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Lista de destinatarios */}
            <div className="border rounded-lg max-h-64 overflow-y-auto">
              {(tipoSelectorInvitaciones === 'clientes' || tipoSelectorInvitaciones === 'ambos') && (
                <div className="p-4 border-b">
                  <h4 className="font-semibold text-gray-900 mb-3">Clientes</h4>
                  <div className="space-y-2">
                    {clientesDisponiblesInvitaciones
                      .filter(c => 
                        !busquedaInvitaciones || 
                        c.name.toLowerCase().includes(busquedaInvitaciones.toLowerCase()) ||
                        c.email?.toLowerCase().includes(busquedaInvitaciones.toLowerCase())
                      )
                      .map(cliente => {
                        const seleccionado = destinatariosSeleccionados.some(d => d.id === cliente.id && d.tipo === 'cliente');
                        return (
                          <div
                            key={cliente.id}
                            onClick={() => handleSeleccionarDestinatario({
                              id: cliente.id,
                              nombre: cliente.name,
                              email: cliente.email,
                              telefono: cliente.phone,
                              tipo: 'cliente',
                            })}
                            className={`p-3 rounded-lg cursor-pointer transition-colors ${
                              seleccionado ? 'bg-purple-100 border-2 border-purple-600' : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{cliente.name}</p>
                                {cliente.email && <p className="text-xs text-gray-500">{cliente.email}</p>}
                                {cliente.phone && <p className="text-xs text-gray-500">{cliente.phone}</p>}
                              </div>
                              {seleccionado && <CheckCircle className="w-5 h-5 text-purple-600" />}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
              
              {(tipoSelectorInvitaciones === 'grupos' || tipoSelectorInvitaciones === 'ambos') && (
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Grupos</h4>
                  <div className="space-y-2">
                    {gruposDisponibles
                      .filter(g => 
                        !busquedaInvitaciones || 
                        g.name.toLowerCase().includes(busquedaInvitaciones.toLowerCase())
                      )
                      .map(grupo => (
                        <div
                          key={grupo.id}
                          className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{grupo.name}</p>
                              <p className="text-xs text-gray-500">{grupo.clientCount} clientes</p>
                            </div>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSeleccionarGrupoCompleto(grupo);
                              }}
                            >
                              Seleccionar grupo
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Destinatarios seleccionados */}
            {destinatariosSeleccionados.length > 0 && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm font-medium text-purple-900 mb-2">
                  {destinatariosSeleccionados.length} destinatario(s) seleccionado(s)
                </p>
                <div className="flex flex-wrap gap-2">
                  {destinatariosSeleccionados.map((dest, index) => (
                    <Badge key={index} variant="purple" className="text-xs">
                      {dest.nombre}
                      <button
                        onClick={() => handleSeleccionarDestinatario(dest)}
                        className="ml-2 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Canal de envío */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Canal de envío
              </label>
              <Select
                value={canalInvitacion}
                onChange={(e) => setCanalInvitacion(e.target.value as 'email' | 'whatsapp' | 'ambos')}
              >
                <option value="email">Email</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="ambos">Email y WhatsApp</option>
              </Select>
            </div>

            {/* Plantilla de invitación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plantilla de invitación
              </label>
              <Textarea
                value={plantillaInvitacion}
                onChange={(e) => setPlantillaInvitacion(e.target.value)}
                rows={8}
                placeholder="Hola {nombre},..."
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Variables disponibles: {'{nombre}'}, {'{eventoNombre}'}, {'{fecha}'}, {'{hora}'}, {'{ubicacion}'}, {'{eventoDescripcion}'}
              </p>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="secondary"
                onClick={() => {
                  setMostrarModalInvitaciones(false);
                  setEventoInvitaciones(null);
                  setDestinatariosSeleccionados([]);
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={enviarInvitacionesHandler}
                disabled={enviandoInvitaciones || destinatariosSeleccionados.length === 0}
                iconLeft={<Send className="w-4 h-4" />}
              >
                {enviandoInvitaciones ? 'Enviando...' : 'Enviar Invitaciones'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de Historial de Recordatorios (User Story 2) */}
      {mostrarHistorialRecordatorios && eventoHistorialRecordatorios && (
        <Modal
          isOpen={mostrarHistorialRecordatorios}
          onClose={() => {
            setMostrarHistorialRecordatorios(false);
            setEventoHistorialRecordatorios(null);
          }}
          title={`Historial de Recordatorios - ${eventoHistorialRecordatorios.nombre}`}
          size="lg"
        >
          <div className="space-y-4">
            {eventoHistorialRecordatorios.recordatoriosEnviados && eventoHistorialRecordatorios.recordatoriosEnviados.length > 0 ? (
              <>
                {/* Estadísticas */}
                {(() => {
                  const stats = obtenerEstadisticasRecordatorios(eventoHistorialRecordatorios);
                  return (
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-xs text-blue-600 font-medium">Total</p>
                        <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-xs text-green-600 font-medium">Enviados</p>
                        <p className="text-2xl font-bold text-green-900">{stats.enviados}</p>
                      </div>
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                        <p className="text-xs text-purple-600 font-medium">Leídos</p>
                        <p className="text-2xl font-bold text-purple-900">{stats.leidos}</p>
                      </div>
                    </div>
                  );
                })()}

                {/* Lista de recordatorios */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {eventoHistorialRecordatorios.recordatoriosEnviados
                    .sort((a, b) => new Date(b.fechaEnvio).getTime() - new Date(a.fechaEnvio).getTime())
                    .map(recordatorio => (
                      <div key={recordatorio.id} className="border rounded-lg p-4 bg-white">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="font-medium text-gray-900">{recordatorio.participanteNombre}</p>
                              <Badge variant={recordatorio.estado === 'entregado' ? 'green' : recordatorio.estado === 'fallido' ? 'red' : 'blue'} className="text-xs">
                                {recordatorio.estado}
                              </Badge>
                              {recordatorio.leido && (
                                <Badge variant="purple" className="text-xs">
                                  Leído
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              {recordatorio.canal === 'email' ? '📧 Email' : '💬 WhatsApp'} • {recordatorio.tiempoAnticipacionHoras}h antes
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(recordatorio.fechaEnvio).toLocaleString('es-ES')}
                            </p>
                            {recordatorio.fechaLectura && (
                              <p className="text-xs text-green-600 mt-1">
                                Leído: {new Date(recordatorio.fechaLectura).toLocaleString('es-ES')}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No hay recordatorios enviados aún</p>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t">
              <Button
                variant="secondary"
                onClick={() => {
                  setMostrarHistorialRecordatorios(false);
                  setEventoHistorialRecordatorios(null);
                }}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de Solicitud de Confirmación (User Story 1) */}
      {mostrarModalConfirmacion && eventoConfirmacion && (
        <Modal
          isOpen={mostrarModalConfirmacion}
          onClose={() => {
            setMostrarModalConfirmacion(false);
            setEventoConfirmacion(null);
          }}
          title={`Solicitar Confirmación - ${eventoConfirmacion.nombre}`}
          size="lg"
        >
          <div className="space-y-4">
            {/* Información del evento */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Evento:</strong> {eventoConfirmacion.nombre}
              </p>
              <p className="text-sm text-blue-800">
                <strong>Fecha:</strong> {new Date(eventoConfirmacion.fechaInicio).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              <p className="text-sm text-blue-800">
                <strong>Participantes:</strong> {eventoConfirmacion.participantesDetalle?.filter(p => !p.fechaCancelacion).length || 0}
              </p>
            </div>

            {/* Validación */}
            {(() => {
              const validacion = puedeEnviarSolicitudConfirmacion(eventoConfirmacion, diasAnticipacionConfirmacion);
              if (!validacion.puede) {
                return (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      <p className="text-sm text-red-800">{validacion.razon}</p>
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            {/* Días de anticipación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Días de anticipación <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                min="1"
                max="30"
                value={diasAnticipacionConfirmacion}
                onChange={(e) => setDiasAnticipacionConfirmacion(parseInt(e.target.value) || 1)}
                placeholder="3"
              />
              <p className="text-xs text-gray-500 mt-1">
                La solicitud se enviará {diasAnticipacionConfirmacion} día(s) antes del evento
              </p>
            </div>

            {/* Canal de envío */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Canal de envío <span className="text-red-500">*</span>
              </label>
              <Select
                value={canalConfirmacion}
                onChange={(value) => setCanalConfirmacion(value as 'email' | 'whatsapp' | 'ambos')}
                options={[
                  { label: 'Email', value: 'email' },
                  { label: 'WhatsApp', value: 'whatsapp' },
                  { label: 'Ambos', value: 'ambos' },
                ]}
              />
            </div>

            {/* Mensaje */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensaje de confirmación <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={mensajeConfirmacion}
                onChange={(e) => setMensajeConfirmacion(e.target.value)}
                placeholder="Mensaje personalizado..."
                rows={8}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Variables disponibles: {'{nombre}'}, {'{eventoNombre}'}, {'{fecha}'}, {'{hora}'}, {'{ubicacion}'}
              </p>
            </div>

            {/* Vista previa */}
            {eventoConfirmacion.participantesDetalle && eventoConfirmacion.participantesDetalle.length > 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Vista previa del mensaje:</p>
                <div className="text-sm text-gray-600 whitespace-pre-wrap bg-white p-3 rounded border">
                  {mensajeConfirmacion
                    .replace(/{nombre}/g, eventoConfirmacion.participantesDetalle![0].nombre)
                    .replace(/{eventoNombre}/g, eventoConfirmacion.nombre)
                    .replace(/{fecha}/g, new Date(eventoConfirmacion.fechaInicio).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }))
                    .replace(/{hora}/g, new Date(eventoConfirmacion.fechaInicio).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit',
                    }))
                    .replace(/{ubicacion}/g, eventoConfirmacion.ubicacion || eventoConfirmacion.plataforma || eventoConfirmacion.linkAcceso || 'Por confirmar')
                  }
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="secondary"
                onClick={() => {
                  setMostrarModalConfirmacion(false);
                  setEventoConfirmacion(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={enviarSolicitudConfirmacionHandler}
                disabled={enviandoConfirmacion || !puedeEnviarSolicitudConfirmacion(eventoConfirmacion, diasAnticipacionConfirmacion).puede}
                iconLeft={<Send className="w-4 h-4" />}
              >
                {enviandoConfirmacion ? 'Enviando...' : 'Enviar Solicitud'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de Mensaje Grupal (User Story 2) */}
      {mostrarModalMensajeGrupal && eventoMensajeGrupal && (
        <Modal
          isOpen={mostrarModalMensajeGrupal}
          onClose={() => {
            setMostrarModalMensajeGrupal(false);
            setEventoMensajeGrupal(null);
            setMensajeGrupalTexto('');
            setPlantillaSeleccionada('');
            setTituloMensajeGrupal('');
          }}
          title={`Enviar Mensaje Grupal - ${eventoMensajeGrupal.nombre}`}
          size="xl"
        >
          <div className="space-y-4">
            {/* Información del evento */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Evento:</strong> {eventoMensajeGrupal.nombre}
              </p>
              <p className="text-sm text-blue-800">
                <strong>Participantes:</strong> {eventoMensajeGrupal.participantesDetalle?.filter(p => !p.fechaCancelacion).length || 0}
              </p>
            </div>

            {/* Plantillas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plantillas predefinidas
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2">
                {PLANTILLAS_PREDEFINIDAS.filter(p => categoriaPlantilla === 'todas' || p.categoria === categoriaPlantilla).map(plantilla => (
                  <button
                    key={plantilla.id}
                    onClick={() => aplicarPlantilla(plantilla.id)}
                    className={`p-3 text-left border rounded-lg transition-colors ${
                      plantillaSeleccionada === plantilla.id
                        ? 'bg-blue-50 border-blue-500'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <p className="text-sm font-medium text-gray-900">{plantilla.nombre}</p>
                    <p className="text-xs text-gray-500 mt-1">{plantilla.categoria}</p>
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setCategoriaPlantilla('todas')}
                  className={`px-3 py-1 rounded text-xs ${categoriaPlantilla === 'todas' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  Todas
                </button>
                <button
                  onClick={() => setCategoriaPlantilla('cambio')}
                  className={`px-3 py-1 rounded text-xs ${categoriaPlantilla === 'cambio' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  Cambios
                </button>
                <button
                  onClick={() => setCategoriaPlantilla('instrucciones')}
                  className={`px-3 py-1 rounded text-xs ${categoriaPlantilla === 'instrucciones' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  Instrucciones
                </button>
                <button
                  onClick={() => setCategoriaPlantilla('motivacion')}
                  className={`px-3 py-1 rounded text-xs ${categoriaPlantilla === 'motivacion' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  Motivación
                </button>
                <button
                  onClick={() => setCategoriaPlantilla('recordatorio')}
                  className={`px-3 py-1 rounded text-xs ${categoriaPlantilla === 'recordatorio' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  Recordatorio
                </button>
              </div>
            </div>

            {/* Título (opcional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título del mensaje (opcional)
              </label>
              <Input
                type="text"
                value={tituloMensajeGrupal}
                onChange={(e) => setTituloMensajeGrupal(e.target.value)}
                placeholder="Ej: Cambio de horario, Instrucciones importantes, etc."
              />
            </div>

            {/* Mensaje */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensaje <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={mensajeGrupalTexto}
                onChange={(e) => setMensajeGrupalTexto(e.target.value)}
                placeholder="Escribe tu mensaje aquí..."
                rows={10}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Variables disponibles: {'{nombre}'}, {'{eventoNombre}'}, {'{fecha}'}, {'{hora}'}, {'{ubicacion}'}
              </p>
            </div>

            {/* Canal de envío */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Canal de envío <span className="text-red-500">*</span>
              </label>
              <Select
                value={canalMensajeGrupal}
                onChange={(value) => setCanalMensajeGrupal(value as 'email' | 'whatsapp' | 'ambos')}
                options={[
                  { label: 'Email', value: 'email' },
                  { label: 'WhatsApp', value: 'whatsapp' },
                  { label: 'Ambos', value: 'ambos' },
                ]}
              />
            </div>

            {/* Botones de acción */}
            <div className="flex justify-between items-center pt-4 border-t">
              <Button
                variant="secondary"
                onClick={() => {
                  const historial = obtenerHistorialMensajesGrupales(eventoMensajeGrupal);
                  if (historial.length > 0) {
                    setMostrarHistorialMensajes(true);
                  } else {
                    alert('No hay historial de mensajes para este evento');
                  }
                }}
                iconLeft={<History className="w-4 h-4" />}
              >
                Ver Historial
              </Button>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setMostrarModalMensajeGrupal(false);
                    setEventoMensajeGrupal(null);
                    setMensajeGrupalTexto('');
                    setPlantillaSeleccionada('');
                    setTituloMensajeGrupal('');
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={enviarMensajeGrupalHandler}
                  disabled={enviandoMensajeGrupal || !mensajeGrupalTexto.trim()}
                  iconLeft={<Send className="w-4 h-4" />}
                >
                  {enviandoMensajeGrupal ? 'Enviando...' : 'Enviar Mensaje'}
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de Historial de Mensajes Grupales (User Story 2) */}
      {mostrarHistorialMensajes && eventoMensajeGrupal && (
        <Modal
          isOpen={mostrarHistorialMensajes}
          onClose={() => {
            setMostrarHistorialMensajes(false);
          }}
          title={`Historial de Mensajes - ${eventoMensajeGrupal.nombre}`}
          size="lg"
        >
          <div className="space-y-4">
            {(() => {
              const historial = obtenerHistorialMensajesGrupales(eventoMensajeGrupal);
              if (historial.length === 0) {
                return (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No hay mensajes enviados aún</p>
                  </div>
                );
              }
              return (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {historial
                    .sort((a, b) => new Date(b.fechaEnvio).getTime() - new Date(a.fechaEnvio).getTime())
                    .map(mensaje => (
                      <div key={mensaje.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            {mensaje.titulo && (
                              <p className="font-medium text-gray-900 mb-1">{mensaje.titulo}</p>
                            )}
                            <p className="text-sm text-gray-600 mb-2">{mensaje.mensaje.substring(0, 100)}...</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>{mensaje.canal === 'email' ? '📧 Email' : mensaje.canal === 'whatsapp' ? '💬 WhatsApp' : '📧💬 Ambos'}</span>
                              <span>•</span>
                              <span>{new Date(mensaje.fechaEnvio).toLocaleString('es-ES')}</span>
                              <span>•</span>
                              <span>Por: {mensaje.enviadoPorNombre}</span>
                            </div>
                            {mensaje.estadisticas && (
                              <div className="mt-2 flex items-center gap-4 text-xs">
                                <span className="text-gray-600">Total: {mensaje.estadisticas.total}</span>
                                <span className="text-green-600">Entregados: {mensaje.estadisticas.entregados}</span>
                                <span className="text-red-600">Fallidos: {mensaje.estadisticas.fallidos}</span>
                                <span className="text-blue-600">Tasa: {mensaje.estadisticas.tasaEntrega}%</span>
                              </div>
                            )}
                          </div>
                          <Badge variant={mensaje.estado === 'enviado' ? 'green' : mensaje.estado === 'fallido' ? 'red' : 'yellow'} className="text-xs">
                            {mensaje.estado}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              );
            })()}
            <div className="flex justify-end pt-4 border-t">
              <Button
                variant="secondary"
                onClick={() => {
                  setMostrarHistorialMensajes(false);
                }}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de Notificación de Cambio de Evento (User Story 1) */}
      {mostrarModalNotificacionCambio && cambioEventoDetectado && eventoAGuardarPendiente && (
        <Modal
          isOpen={mostrarModalNotificacionCambio}
          onClose={cancelarCambioEvento}
          title={
            cambioEventoDetectado.tipo === 'cancelacion'
              ? 'Notificar Cancelación de Evento'
              : cambioEventoDetectado.tipo === 'reprogramacion'
              ? 'Notificar Reprogramación de Evento'
              : 'Notificar Cambio de Evento'
          }
          size="lg"
        >
          <div className="space-y-4">
            {/* Información del cambio */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900 mb-2">
                {cambioEventoDetectado.tipo === 'cancelacion' && 'El evento será cancelado'}
                {cambioEventoDetectado.tipo === 'reprogramacion' && 'El evento será reprogramado'}
                {cambioEventoDetectado.tipo === 'estado' && 'El estado del evento cambiará'}
              </p>
              <p className="text-sm text-blue-800">
                <strong>Evento:</strong> {eventoAGuardarPendiente.nombre}
              </p>
              {cambioEventoDetectado.tipo === 'reprogramacion' && cambioEventoDetectado.fechaAnterior && cambioEventoDetectado.fechaNueva && (
                <>
                  <p className="text-sm text-blue-800 mt-1">
                    <strong>Fecha anterior:</strong> {cambioEventoDetectado.fechaAnterior.toLocaleString('es-ES')}
                  </p>
                  <p className="text-sm text-blue-800">
                    <strong>Nueva fecha:</strong> {cambioEventoDetectado.fechaNueva.toLocaleString('es-ES')}
                  </p>
                </>
              )}
              <p className="text-sm text-blue-800 mt-2">
                <strong>Participantes a notificar:</strong> {eventoAGuardarPendiente.participantesDetalle?.filter(p => !p.fechaCancelacion).length || 0}
              </p>
            </div>

            {/* Opción de notificación */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="notificarCambio"
                checked={notificarCambioEvento}
                onChange={(e) => setNotificarCambioEvento(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <label htmlFor="notificarCambio" className="block text-sm font-medium text-gray-700 cursor-pointer">
                  Notificar automáticamente a todos los participantes
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Se enviará un mensaje automático a todos los participantes inscritos informándoles del cambio.
                </p>
              </div>
            </div>

            {/* Motivo del cambio */}
            {notificarCambioEvento && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motivo del cambio (opcional)
                  </label>
                  <Textarea
                    value={motivoCambioEvento}
                    onChange={(e) => setMotivoCambioEvento(e.target.value)}
                    placeholder="Ej: Cambio de horario debido a condiciones climáticas adversas..."
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Este motivo se incluirá en la notificación enviada a los participantes.
                  </p>
                </div>

                {/* Canal de notificación */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Canal de notificación
                  </label>
                  <Select
                    value={canalNotificacionCambio}
                    onChange={(value) => setCanalNotificacionCambio(value as 'email' | 'whatsapp' | 'ambos')}
                    options={[
                      { label: 'Email y WhatsApp', value: 'ambos' },
                      { label: 'Solo Email', value: 'email' },
                      { label: 'Solo WhatsApp', value: 'whatsapp' },
                    ]}
                  />
                </div>
              </>
            )}

            {/* Botones de acción */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="secondary"
                onClick={cancelarCambioEvento}
                disabled={enviandoNotificacionCambio}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={confirmarCambioEventoConNotificacion}
                disabled={enviandoNotificacionCambio}
                iconLeft={enviandoNotificacionCambio ? undefined : <Send className="w-4 h-4" />}
              >
                {enviandoNotificacionCambio
                  ? 'Enviando...'
                  : notificarCambioEvento
                  ? 'Guardar y Notificar'
                  : 'Guardar sin Notificar'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de Estadísticas de Asistencia (User Story 2) */}
      {mostrarModalEstadisticas && eventoEstadisticas && estadisticasEvento && (
        <Modal
          isOpen={mostrarModalEstadisticas}
          onClose={() => {
            setMostrarModalEstadisticas(false);
            setEventoEstadisticas(null);
            setEstadisticasEvento(null);
          }}
          title={`Estadísticas de Asistencia - ${eventoEstadisticas.nombre}`}
          size="xl"
        >
          <div className="space-y-6">
            {/* Métricas principales */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-xs text-blue-600 font-medium mb-1">Inscritos</p>
                <p className="text-3xl font-bold text-blue-900">{estadisticasEvento.inscritos}</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-xs text-green-600 font-medium mb-1">Asistentes</p>
                <p className="text-3xl font-bold text-green-900">{estadisticasEvento.asistentes}</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-xs text-purple-600 font-medium mb-1">% de Asistencia</p>
                <p className="text-3xl font-bold text-purple-900">{estadisticasEvento.porcentajeAsistencia}%</p>
              </div>
            </div>

            {/* Comparativa con eventos anteriores */}
            {(() => {
              const comparativa = obtenerComparativaEvento(eventoEstadisticas, eventos);
              const tendenciaIcon = comparativa.tendencia === 'mejorando' 
                ? <TrendingUp className="w-5 h-5 text-green-600" />
                : comparativa.tendencia === 'empeorando'
                ? <TrendingUp className="w-5 h-5 text-red-600 rotate-180" />
                : <TrendingUp className="w-5 h-5 text-gray-600" />;
              
              return comparativa.eventosAnteriores.length > 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    {tendenciaIcon}
                    <h3 className="text-lg font-semibold text-gray-900">Comparativa</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Promedio de eventos anteriores</p>
                      <p className="text-2xl font-bold text-gray-900">{comparativa.promedioAsistencia}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Diferencia vs promedio</p>
                      <p className={`text-2xl font-bold ${comparativa.diferenciaVsPromedio >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {comparativa.diferenciaVsPromedio >= 0 ? '+' : ''}{comparativa.diferenciaVsPromedio}%
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Basado en {comparativa.eventosAnteriores.length} evento(s) anterior(es) del mismo tipo
                  </p>
                </div>
              ) : null;
            })()}

            {/* Gráfico de tendencia */}
            {(() => {
              const datosGrafico = obtenerDatosGraficoTendencia(eventos, eventoEstadisticas.tipo, 10);
              return datosGrafico.length > 1 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencia de Asistencia</h3>
                  <div className="relative h-64">
                    {/* Gráfico simple de barras */}
                    <div className="flex items-end justify-between h-full gap-2">
                      {datosGrafico.map((dato, index) => {
                        const maxPorcentaje = Math.max(...datosGrafico.map(d => d.porcentaje), 100);
                        const altura = (dato.porcentaje / maxPorcentaje) * 100;
                        const esActual = dato.eventoNombre === eventoEstadisticas.nombre;
                        return (
                          <div key={index} className="flex-1 flex flex-col items-center gap-2">
                            <div className="relative w-full h-full flex items-end">
                              <div
                                className={`w-full rounded-t ${
                                  esActual
                                    ? 'bg-purple-600'
                                    : dato.porcentaje >= 70
                                    ? 'bg-green-500'
                                    : dato.porcentaje >= 50
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                                }`}
                                style={{ height: `${altura}%` }}
                                title={`${dato.eventoNombre}: ${dato.porcentaje}%`}
                              />
                            </div>
                            <p className="text-xs text-gray-600 text-center rotate-45 origin-bottom-left whitespace-nowrap truncate max-w-[60px]">
                              {dato.fecha.split(' ')[0]}
                            </p>
                            <p className="text-xs font-medium text-gray-900">{dato.porcentaje}%</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : null;
            })()}

            {/* Patrones identificados */}
            {(() => {
              const patrones = identificarPatronesAsistencia(eventos);
              const patronEvento = patrones.find(p => p.tipoEvento === eventoEstadisticas.tipo);
              
              return patronEvento && patronEvento.eventosAnalizados > 1 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Patrones Identificados</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    Basado en {patronEvento.eventosAnalizados} evento(s) de tipo "{patronEvento.tipoEvento}":
                  </p>
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    Promedio de asistencia: {patronEvento.promedioAsistencia}%
                  </p>
                  {patronEvento.recomendaciones && patronEvento.recomendaciones.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-900 mb-2">Recomendaciones:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {patronEvento.recomendaciones.map((rec, index) => (
                          <li key={index} className="text-sm text-gray-700">{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : null;
            })()}

            {/* Lista de participantes */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Detalle de Participantes</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {estadisticasEvento.participantesDetalle.map((participante) => (
                  <div
                    key={participante.participanteId}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                        {participante.participanteNombre.charAt(0).toUpperCase()}
                      </div>
                      <p className="text-sm font-medium text-gray-900">{participante.participanteNombre}</p>
                    </div>
                    <Badge variant={participante.asistio ? 'green' : 'red'} className="text-xs">
                      {participante.asistio ? 'Asistió' : 'No asistió'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Botón de cierre */}
            <div className="flex justify-end pt-4 border-t">
              <Button
                variant="secondary"
                onClick={() => {
                  setMostrarModalEstadisticas(false);
                  setEventoEstadisticas(null);
                  setEstadisticasEvento(null);
                }}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de Feedback Post-Evento (User Story 1) */}
      {mostrarModalFeedback && eventoFeedback && estadisticasFeedback && (
        <FeedbackResultsModal
          isOpen={mostrarModalFeedback}
          onClose={() => {
            setMostrarModalFeedback(false);
            setEventoFeedback(null);
            setEstadisticasFeedback(null);
          }}
          eventoNombre={eventoFeedback.nombre}
          estadisticas={estadisticasFeedback}
        />
      )}

      {/* Modal de Analytics de Eventos (User Story 2) */}
      {mostrarModalAnalytics && (
        <EventAnalyticsModal
          isOpen={mostrarModalAnalytics}
          onClose={() => {
            setMostrarModalAnalytics(false);
            setRankings([]);
            setComparativas([]);
            setAnalisisHorarios(null);
            setInsights(null);
          }}
          rankings={rankings}
          comparativas={comparativas}
          analisisHorarios={analisisHorarios || {
            mejorDiaSemana: { dia: 'N/A', promedioParticipacion: 0, promedioAsistencia: 0, promedioValoracion: 0, totalEventos: 0 },
            mejorHora: { hora: 0, promedioParticipacion: 0, promedioAsistencia: 0, promedioValoracion: 0, totalEventos: 0 },
            mejoresHorarios: [],
          }}
          insights={insights || {
            eventosMasExitosos: [],
            eventosMenosExitosos: [],
            tendencias: { participacion: 'estable', asistencia: 'estable', valoracion: 'estable' },
            recomendaciones: [],
            tipoEventoMasPopular: 'presencial',
            mejorMomentoParaEventos: { dia: 'N/A', hora: 0 },
          }}
        />
      )}

      {/* Modal de Dashboard de Progreso de Retos (User Story US-ER-23) */}
      {mostrarDashboardProgresoRetos && eventoProgresoRetos && (
        <DashboardProgresoRetos
          isOpen={mostrarDashboardProgresoRetos}
          onClose={() => {
            setMostrarDashboardProgresoRetos(false);
            setEventoProgresoRetos(null);
          }}
          evento={eventoProgresoRetos}
        />
      )}

      {/* Modal de Dashboard de Métricas Generales (User Story US-ER-24) */}
      {mostrarDashboardMetricasGenerales && (
        <DashboardMetricasGenerales
          isOpen={mostrarDashboardMetricasGenerales}
          onClose={() => {
            setMostrarDashboardMetricasGenerales(false);
          }}
          entrenadorId={user?.id}
        />
      )}

      {/* Modal de Checklist de Preparación (User Story 2) */}
      {mostrarModalChecklist && eventoChecklist && (
        <Modal
          isOpen={mostrarModalChecklist}
          onClose={() => {
            setMostrarModalChecklist(false);
            setEventoChecklist(null);
            setEditandoItemChecklist(null);
          }}
          title={`Checklist de Preparación - ${eventoChecklist.nombre}`}
          size="lg"
        >
          <div className="space-y-4">
            {/* Información del checklist */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900">Progreso de Preparación</h3>
                <Badge variant="purple">
                  {eventoChecklist.checklistPreparacion 
                    ? `${obtenerPorcentajeCompletado(eventoChecklist.checklistPreparacion)}% completado`
                    : '0% completado'}
                </Badge>
              </div>
              {eventoChecklist.checklistPreparacion && eventoChecklist.checklistPreparacion.items.length > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all"
                    style={{ width: `${obtenerPorcentajeCompletado(eventoChecklist.checklistPreparacion)}%` }}
                  />
                </div>
              )}
            </div>

            {/* Recordatorio un día antes */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="recordatorioChecklist"
                checked={eventoChecklist.checklistPreparacion?.recordatorioUnDiaAntes || false}
                onChange={(e) => {
                  const eventosActualizados = eventos.map(e => {
                    if (e.id === eventoChecklist.id) {
                      return {
                        ...e,
                        checklistPreparacion: {
                          ...e.checklistPreparacion,
                          items: e.checklistPreparacion?.items || [],
                          recordatorioUnDiaAntes: e.target.checked,
                        } as any,
                      };
                    }
                    return e;
                  });
                  setEventos(eventosActualizados);
                  guardarEventos(eventosActualizados);
                  const eventoActualizado = eventosActualizados.find(e => e.id === eventoChecklist.id);
                  if (eventoActualizado) {
                    setEventoChecklist(eventoActualizado);
                  }
                }}
                className="w-4 h-4 text-purple-600 rounded"
              />
              <label htmlFor="recordatorioChecklist" className="text-sm text-gray-700">
                Enviar recordatorio de preparación un día antes del evento
              </label>
            </div>

            {/* Plantillas de checklist */}
            {plantillasChecklist.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aplicar Plantilla
                </label>
                <Select
                  value=""
                  onChange={(value) => {
                    if (value) {
                      aplicarPlantillaAChecklist(value);
                    }
                  }}
                  options={[
                    { label: 'Seleccionar plantilla...', value: '' },
                    ...plantillasChecklist.map(p => ({ label: p.nombre, value: p.id })),
                  ]}
                />
              </div>
            )}

            {/* Lista de items */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">Items de Preparación</h3>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={agregarItemAChecklist}
                  iconLeft={<PlusCircle className="w-4 h-4" />}
                >
                  Agregar Item
                </Button>
              </div>
              
              {eventoChecklist.checklistPreparacion && eventoChecklist.checklistPreparacion.items.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {eventoChecklist.checklistPreparacion.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg"
                    >
                      <input
                        type="checkbox"
                        checked={item.completado}
                        onChange={() => toggleItemChecklist(item.id)}
                        className="mt-1 w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <div className="flex-1">
                        {editandoItemChecklist === item.id ? (
                          <div className="space-y-2">
                            <Input
                              value={item.nombre}
                              onChange={(e) => {
                                // Update will be saved when clicking guardar
                                const nuevoNombre = e.target.value;
                                const eventosActualizados = eventos.map(ev => {
                                  if (ev.id === eventoChecklist.id && ev.checklistPreparacion) {
                                    return {
                                      ...ev,
                                      checklistPreparacion: actualizarItemChecklist(
                                        ev.checklistPreparacion,
                                        item.id,
                                        { nombre: nuevoNombre }
                                      ),
                                    };
                                  }
                                  return ev;
                                });
                                setEventos(eventosActualizados);
                                guardarEventos(eventosActualizados);
                                const eventoActualizado = eventosActualizados.find(ev => ev.id === eventoChecklist.id);
                                if (eventoActualizado) {
                                  setEventoChecklist(eventoActualizado);
                                }
                              }}
                              placeholder="Nombre del item"
                            />
                            <Textarea
                              value={item.descripcion || ''}
                              onChange={(e) => {
                                const nuevaDescripcion = e.target.value;
                                const eventosActualizados = eventos.map(ev => {
                                  if (ev.id === eventoChecklist.id && ev.checklistPreparacion) {
                                    return {
                                      ...ev,
                                      checklistPreparacion: actualizarItemChecklist(
                                        ev.checklistPreparacion,
                                        item.id,
                                        { descripcion: nuevaDescripcion }
                                      ),
                                    };
                                  }
                                  return ev;
                                });
                                setEventos(eventosActualizados);
                                guardarEventos(eventosActualizados);
                                const eventoActualizado = eventosActualizados.find(ev => ev.id === eventoChecklist.id);
                                if (eventoActualizado) {
                                  setEventoChecklist(eventoActualizado);
                                }
                              }}
                              placeholder="Descripción (opcional)"
                              rows={2}
                            />
                            <div className="flex gap-2">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                  setEditandoItemChecklist(null);
                                }}
                              >
                                Guardar
                              </Button>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                  setEditandoItemChecklist(null);
                                }}
                              >
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-sm ${item.completado ? 'line-through text-gray-500' : 'text-gray-900 font-medium'}`}
                              >
                                {item.nombre}
                              </span>
                              {item.categoria && (
                                <Badge variant="gray" className="text-xs">
                                  {item.categoria}
                                </Badge>
                              )}
                            </div>
                            {item.descripcion && (
                              <p className="text-xs text-gray-600 mt-1">{item.descripcion}</p>
                            )}
                            {item.fechaCompletado && (
                              <p className="text-xs text-gray-500 mt-1">
                                Completado: {new Date(item.fechaCompletado).toLocaleDateString('es-ES')}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {editandoItemChecklist !== item.id && (
                          <>
                            <button
                              onClick={() => setEditandoItemChecklist(item.id)}
                              className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Editar item"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => eliminarItemDeChecklist(item.id)}
                              className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Eliminar item"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 border border-gray-200 rounded-lg">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">No hay items en el checklist</p>
                  <p className="text-sm text-gray-500">Agrega items o aplica una plantilla para comenzar</p>
                </div>
              )}
            </div>

            {/* Botones de acción */}
            <div className="flex justify-between items-center pt-4 border-t">
              <Button
                variant="secondary"
                size="sm"
                onClick={guardarChecklistComoPlantilla}
                iconLeft={<Save className="w-4 h-4" />}
                disabled={!eventoChecklist?.checklistPreparacion || eventoChecklist.checklistPreparacion.items.length === 0}
              >
                Guardar como Plantilla
              </Button>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setMostrarModalChecklist(false);
                    setEventoChecklist(null);
                    setEditandoItemChecklist(null);
                  }}
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Sección de Google Calendar Sync en Modal de Detalle (User Story 1) */}
      {eventoSeleccionado && (
        <>
          {/* Esta sección se agregará dentro del modal de detalle existente */}
          {/* Se agregará mediante búsqueda y reemplazo del modal de detalle */}
        </>
      )}
    </div>
  );
}

