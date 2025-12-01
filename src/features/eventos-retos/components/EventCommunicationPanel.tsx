/**
 * Panel de Comunicaciones por Evento
 * 
 * Centraliza todas las funcionalidades de comunicación:
 * - Invitaciones
 * - Recordatorios
 * - Confirmaciones
 * - Mensajes grupales
 * - Notificaciones de cambios
 */

import { useState, useEffect } from 'react';
import { Modal, Button, Card } from '../../../components/componentsreutilizables';
import { Input } from '../../../components/componentsreutilizables/Input';
import { Textarea } from '../../../components/componentsreutilizables/Textarea';
import { Select } from '../../../components/componentsreutilizables/Select';
import { Badge } from '../../../components/componentsreutilizables/Badge';
import {
  Send, UserPlus, Bell, CheckSquare, MessageSquare, AlertTriangle,
  X, CheckCircle, Search, History, Settings, Mail, MessageCircle
} from 'lucide-react';
import { Evento } from '../api/events';
import { Client } from '../../gestión-de-clientes/types';
import { ClientSegment } from '../../gestión-de-clientes/types';
import { getActiveClients } from '../../gestión-de-clientes/api/clients';
import { getSegments } from '../../gestión-de-clientes/api/segmentation';
import { enviarInvitaciones, obtenerEstadisticasInvitaciones, obtenerClientesDeGrupo, obtenerPlantillasInvitacion } from '../services/invitacionesService';
import { configurarRecordatoriosEvento, obtenerRecordatoriosEvento, obtenerHistorialRecordatorios, obtenerEstadisticasRecordatorios } from '../services/recordatoriosService';
import { enviarSolicitudConfirmacion, puedeEnviarSolicitudConfirmacion, obtenerEstadisticasConfirmacion } from '../services/confirmacionService';
import { enviarMensajeGrupal, obtenerPlantillas, obtenerHistorialMensajesGrupales } from '../services/mensajesGrupalesService';
import { detectarCambiosRelevantes, notificarCambiosAparticipantes } from '../services/notificacionCambioEventoService';

interface EventCommunicationPanelProps {
  evento: Evento;
  isOpen: boolean;
  onClose: () => void;
  onEventUpdated?: (evento: Evento) => void;
  user?: { id: string; name: string };
}

type CommunicationTab = 'invitaciones' | 'recordatorios' | 'confirmaciones' | 'mensajes' | 'historial';

export function EventCommunicationPanel({
  evento,
  isOpen,
  onClose,
  onEventUpdated,
  user
}: EventCommunicationPanelProps) {
  const [tabActivo, setTabActivo] = useState<CommunicationTab>('invitaciones');
  
  // Estados para invitaciones
  const [destinatariosSeleccionados, setDestinatariosSeleccionados] = useState<Array<{ id: string; nombre: string; email?: string; telefono?: string; tipo: 'cliente' | 'grupo' }>>([]);
  const [plantillaInvitacion, setPlantillaInvitacion] = useState('');
  const [canalInvitacion, setCanalInvitacion] = useState<'email' | 'whatsapp' | 'ambos'>('ambos');
  const [clientesDisponibles, setClientesDisponibles] = useState<Client[]>([]);
  const [gruposDisponibles, setGruposDisponibles] = useState<ClientSegment[]>([]);
  const [tipoSelectorInvitaciones, setTipoSelectorInvitaciones] = useState<'clientes' | 'grupos' | 'ambos'>('ambos');
  const [busquedaInvitaciones, setBusquedaInvitaciones] = useState('');
  const [enviandoInvitaciones, setEnviandoInvitaciones] = useState(false);
  
  // Estados para recordatorios
  const [recordatoriosConfig, setRecordatoriosConfig] = useState<any>(null);
  const [mostrarConfigRecordatorios, setMostrarConfigRecordatorios] = useState(false);
  
  // Estados para confirmaciones
  const [diasAnticipacionConfirmacion, setDiasAnticipacionConfirmacion] = useState(3);
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState('');
  const [canalConfirmacion, setCanalConfirmacion] = useState<'email' | 'whatsapp' | 'ambos'>('ambos');
  const [enviandoConfirmacion, setEnviandoConfirmacion] = useState(false);
  
  // Estados para mensajes grupales
  const [mensajeGrupalTexto, setMensajeGrupalTexto] = useState('');
  const [canalMensajeGrupal, setCanalMensajeGrupal] = useState<'email' | 'whatsapp' | 'ambos'>('ambos');
  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState<string>('');
  const [tituloMensajeGrupal, setTituloMensajeGrupal] = useState('');
  const [enviandoMensajeGrupal, setEnviandoMensajeGrupal] = useState(false);
  
  // Cargar datos al abrir
  useEffect(() => {
    if (isOpen && evento) {
      cargarDatosIniciales();
    }
  }, [isOpen, evento]);

  const cargarDatosIniciales = async () => {
    // Cargar clientes y grupos
    try {
      const clientes = await getActiveClients('entrenador');
      setClientesDisponibles(clientes);
      
      const segmentos = await getSegments('entrenador');
      setGruposDisponibles(segmentos);
    } catch (error) {
      console.error('Error cargando clientes:', error);
    }
    
    // Cargar plantilla de invitación por defecto
    const plantillas = obtenerPlantillasInvitacion();
    if (plantillas.length > 0) {
      setPlantillaInvitacion(evento.plantillaInvitacion || plantillas[0].cuerpo);
    } else {
      setPlantillaInvitacion(evento.plantillaInvitacion || 'Hola {nombre},\n\nTe invitamos a nuestro evento "{eventoNombre}" que se realizará el {fecha} a las {hora} en {ubicacion}.\n\n{eventoDescripcion}\n\n¡Esperamos verte allí!\n\nSaludos,\nEquipo de Entrenamiento');
    }
    
    // Cargar configuración de recordatorios
    const config = await obtenerRecordatoriosEvento(evento.id);
    if (config) {
      setRecordatoriosConfig(config);
    }
    
    // Cargar mensaje de confirmación por defecto
    setMensajeConfirmacion('Hola {nombre},\n\nTe contactamos para confirmar tu asistencia al evento "{eventoNombre}" que se realizará el {fecha} a las {hora}.\n\nPor favor, confirma si podrás asistir respondiendo:\n- "Confirmo" si asistirás\n- "No puedo" si no podrás asistir\n\n¡Esperamos tu respuesta!\n\nSaludos,\nEquipo de Entrenamiento');
  };

  // Handlers para invitaciones
  const handleSeleccionarDestinatario = (destinatario: { id: string; nombre: string; email?: string; telefono?: string; tipo: 'cliente' | 'grupo' }) => {
    const existe = destinatariosSeleccionados.some(d => d.id === destinatario.id && d.tipo === destinatario.tipo);
    if (existe) {
      setDestinatariosSeleccionados(destinatariosSeleccionados.filter(d => !(d.id === destinatario.id && d.tipo === destinatario.tipo)));
    } else {
      setDestinatariosSeleccionados([...destinatariosSeleccionados, destinatario]);
    }
  };

  const handleSeleccionarGrupoCompleto = async (grupo: ClientSegment) => {
    try {
      const clientesGrupo = await obtenerClientesDeGrupo(grupo.id);
      const nuevosDestinatarios = clientesGrupo.map(c => ({
        id: c.id,
        nombre: c.name,
        email: c.email,
        telefono: c.phone,
        tipo: 'cliente' as const
      }));
      setDestinatariosSeleccionados([...destinatariosSeleccionados, ...nuevosDestinatarios]);
    } catch (error) {
      console.error('Error cargando clientes del grupo:', error);
      alert('Error al cargar clientes del grupo');
    }
  };

  const enviarInvitacionesHandler = async () => {
    if (destinatariosSeleccionados.length === 0) {
      alert('Selecciona al menos un destinatario');
      return;
    }
    
    if (!plantillaInvitacion.trim()) {
      alert('La plantilla de invitación no puede estar vacía');
      return;
    }
    
    setEnviandoInvitaciones(true);
    try {
      const invitaciones = await enviarInvitaciones(
        evento,
        destinatariosSeleccionados,
        plantillaInvitacion,
        canalInvitacion
      );
      
      // Actualizar evento
      const eventosStorage = localStorage.getItem('eventos');
      if (eventosStorage) {
        const eventos: Evento[] = JSON.parse(eventosStorage).map((e: any) => ({
          ...e,
          fechaInicio: new Date(e.fechaInicio),
          fechaFin: e.fechaFin ? new Date(e.fechaFin) : undefined,
        }));
        
        const eventoActualizado = eventos.find(e => e.id === evento.id);
        if (eventoActualizado) {
          eventoActualizado.invitaciones = [...(eventoActualizado.invitaciones || []), ...invitaciones];
          eventoActualizado.plantillaInvitacion = plantillaInvitacion;
          
          const eventosActualizados = eventos.map(e => e.id === evento.id ? eventoActualizado : e);
          localStorage.setItem('eventos', JSON.stringify(eventosActualizados));
          
          if (onEventUpdated) {
            onEventUpdated(eventoActualizado);
          }
        }
      }
      
      alert(`Invitaciones enviadas exitosamente a ${invitaciones.length} destinatario(s)`);
      setDestinatariosSeleccionados([]);
    } catch (error) {
      console.error('Error enviando invitaciones:', error);
      alert('Error al enviar invitaciones');
    } finally {
      setEnviandoInvitaciones(false);
    }
  };

  // Handlers para confirmaciones
  const enviarConfirmacionHandler = async () => {
    const validacion = puedeEnviarSolicitudConfirmacion(evento, diasAnticipacionConfirmacion);
    if (!validacion.puede) {
      alert(validacion.razon);
      return;
    }
    
    setEnviandoConfirmacion(true);
    try {
      const participantesIds = (evento.participantesDetalle || [])
        .filter(p => !p.fechaCancelacion)
        .map(p => p.id);
      
      const resultado = await enviarSolicitudConfirmacion(
        evento.id,
        participantesIds
      );
      
      if (resultado.success) {
        alert(`Solicitud de confirmación enviada a ${resultado.participantesNotificados} participantes`);
        
        // Actualizar evento
        const eventosStorage = localStorage.getItem('eventos');
        if (eventosStorage) {
          const eventos: Evento[] = JSON.parse(eventosStorage).map((e: any) => ({
            ...e,
            fechaInicio: new Date(e.fechaInicio),
            fechaFin: e.fechaFin ? new Date(e.fechaFin) : undefined,
          }));
          
          const eventoActualizado = eventos.find(e => e.id === evento.id);
          if (eventoActualizado && onEventUpdated) {
            onEventUpdated(eventoActualizado);
          }
        }
      } else {
        alert('Error al enviar solicitud de confirmación');
      }
    } catch (error) {
      console.error('Error enviando confirmación:', error);
      alert('Error al enviar solicitud de confirmación');
    } finally {
      setEnviandoConfirmacion(false);
    }
  };

  // Handlers para mensajes grupales
  const enviarMensajeGrupalHandler = async () => {
    if (!mensajeGrupalTexto.trim() && !plantillaSeleccionada) {
      alert('Debes proporcionar un mensaje o seleccionar una plantilla');
      return;
    }
    
    setEnviandoMensajeGrupal(true);
    try {
      const tipoPlantilla = plantillaSeleccionada ? plantillaSeleccionada as any : undefined;
      const mensaje = plantillaSeleccionada ? undefined : mensajeGrupalTexto;
      
      const mensajeGrupal = await enviarMensajeGrupal(
        evento.id,
        tipoPlantilla,
        undefined, // filtros - enviar a todos
        mensaje,
        canalMensajeGrupal,
        user?.id,
        user?.name,
        tituloMensajeGrupal || undefined
      );
      
      alert(`Mensaje grupal enviado a ${mensajeGrupal.estadisticas?.total || 0} destinatarios`);
      
      // Actualizar evento
      const eventosStorage = localStorage.getItem('eventos');
      if (eventosStorage) {
        const eventos: Evento[] = JSON.parse(eventosStorage).map((e: any) => ({
          ...e,
          fechaInicio: new Date(e.fechaInicio),
          fechaFin: e.fechaFin ? new Date(e.fechaFin) : undefined,
        }));
        
        const eventoActualizado = eventos.find(e => e.id === evento.id);
        if (eventoActualizado && onEventUpdated) {
          onEventUpdated(eventoActualizado);
        }
      }
      
      setMensajeGrupalTexto('');
      setTituloMensajeGrupal('');
      setPlantillaSeleccionada('');
    } catch (error) {
      console.error('Error enviando mensaje grupal:', error);
      alert('Error al enviar mensaje grupal');
    } finally {
      setEnviandoMensajeGrupal(false);
    }
  };

  // Obtener estadísticas
  const statsInvitaciones = evento ? obtenerEstadisticasInvitaciones(evento) : null;
  const statsRecordatorios = evento ? obtenerEstadisticasRecordatorios(evento) : null;
  const statsConfirmacion = evento ? obtenerEstadisticasConfirmacion(evento) : null;
  const historialMensajes = evento ? obtenerHistorialMensajesGrupales(evento) : [];
  const historialRecordatorios = evento ? obtenerHistorialRecordatorios(evento) : [];

  const plantillasMensajes = obtenerPlantillas();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Comunicaciones - ${evento?.nombre || ''}`}
      size="xl"
    >
      <div className="space-y-6">
        {/* Tabs de navegación */}
        <div className="flex gap-2 border-b">
          <button
            onClick={() => setTabActivo('invitaciones')}
            className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
              tabActivo === 'invitaciones'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Invitaciones
              {statsInvitaciones && statsInvitaciones.total > 0 && (
                <Badge variant="purple" className="text-xs">{statsInvitaciones.total}</Badge>
              )}
            </div>
          </button>
          <button
            onClick={() => setTabActivo('recordatorios')}
            className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
              tabActivo === 'recordatorios'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Recordatorios
              {statsRecordatorios && statsRecordatorios.total > 0 && (
                <Badge variant="blue" className="text-xs">{statsRecordatorios.total}</Badge>
              )}
            </div>
          </button>
          <button
            onClick={() => setTabActivo('confirmaciones')}
            className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
              tabActivo === 'confirmaciones'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4" />
              Confirmaciones
              {statsConfirmacion && statsConfirmacion.confirmados > 0 && (
                <Badge variant="green" className="text-xs">{statsConfirmacion.confirmados}</Badge>
              )}
            </div>
          </button>
          <button
            onClick={() => setTabActivo('mensajes')}
            className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
              tabActivo === 'mensajes'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Mensajes
              {historialMensajes.length > 0 && (
                <Badge variant="blue" className="text-xs">{historialMensajes.length}</Badge>
              )}
            </div>
          </button>
          <button
            onClick={() => setTabActivo('historial')}
            className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
              tabActivo === 'historial'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Historial
            </div>
          </button>
        </div>

        {/* Contenido de tabs */}
        <div className="min-h-[400px]">
          {/* Tab Invitaciones */}
          {tabActivo === 'invitaciones' && (
            <div className="space-y-4">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 mb-2">Enviar Invitaciones</h3>
                <p className="text-sm text-purple-700">
                  Invita clientes o grupos a participar en este evento
                </p>
              </div>

              {/* Selector de tipo */}
              <div className="flex gap-2">
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
                      {clientesDisponibles
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

              {/* Canal y plantilla */}
              <div className="grid grid-cols-2 gap-4">
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plantilla de invitación
                </label>
                <Textarea
                  value={plantillaInvitacion}
                  onChange={(e) => setPlantillaInvitacion(e.target.value)}
                  rows={6}
                  placeholder="Hola {nombre},..."
                  className="font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Variables: {'{nombre}'}, {'{eventoNombre}'}, {'{fecha}'}, {'{hora}'}, {'{ubicacion}'}
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="secondary"
                  onClick={onClose}
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
          )}

          {/* Tab Recordatorios */}
          {tabActivo === 'recordatorios' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">Configurar Recordatorios</h3>
                    <p className="text-sm text-blue-700">
                      Los recordatorios se envían automáticamente según la configuración
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    iconLeft={<Settings className="w-4 h-4" />}
                    onClick={() => setMostrarConfigRecordatorios(true)}
                  >
                    Configurar
                  </Button>
                </div>
              </div>

              {statsRecordatorios && (
                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-4">
                    <p className="text-xs text-gray-600 mb-1">Total Enviados</p>
                    <p className="text-2xl font-bold text-gray-900">{statsRecordatorios.total}</p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-xs text-gray-600 mb-1">Entregados</p>
                    <p className="text-2xl font-bold text-green-600">{statsRecordatorios.entregados}</p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-xs text-gray-600 mb-1">Leídos</p>
                    <p className="text-2xl font-bold text-purple-600">{statsRecordatorios.leidos}</p>
                  </Card>
                </div>
              )}

              {historialRecordatorios.length > 0 && (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <h4 className="font-semibold text-gray-900">Historial Reciente</h4>
                  {historialRecordatorios.slice(0, 5).map(rec => (
                    <div key={rec.id} className="border rounded-lg p-3 bg-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{rec.participanteNombre}</p>
                          <p className="text-xs text-gray-500">
                            {rec.canal} • {rec.tiempoAnticipacionHoras}h antes
                          </p>
                        </div>
                        <Badge variant={rec.estado === 'entregado' ? 'green' : 'blue'}>
                          {rec.estado}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab Confirmaciones */}
          {tabActivo === 'confirmaciones' && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">Solicitar Confirmación</h3>
                <p className="text-sm text-green-700">
                  Envía una solicitud de confirmación de asistencia a los participantes
                </p>
              </div>

              {statsConfirmacion && (
                <div className="grid grid-cols-4 gap-4">
                  <Card className="p-4">
                    <p className="text-xs text-gray-600 mb-1">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{statsConfirmacion.total}</p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-xs text-gray-600 mb-1">Confirmados</p>
                    <p className="text-2xl font-bold text-green-600">{statsConfirmacion.confirmados}</p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-xs text-gray-600 mb-1">No Pueden</p>
                    <p className="text-2xl font-bold text-red-600">{statsConfirmacion.noPueden}</p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-xs text-gray-600 mb-1">Pendientes</p>
                    <p className="text-2xl font-bold text-yellow-600">{statsConfirmacion.pendientes}</p>
                  </Card>
                </div>
              )}

              {(() => {
                const validacion = puedeEnviarSolicitudConfirmacion(evento, diasAnticipacionConfirmacion);
                if (!validacion.puede) {
                  return (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                        <p className="text-sm text-red-800">{validacion.razon}</p>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Días de anticipación
                </label>
                <Input
                  type="number"
                  min="1"
                  max="30"
                  value={diasAnticipacionConfirmacion}
                  onChange={(e) => setDiasAnticipacionConfirmacion(parseInt(e.target.value) || 1)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Canal de envío
                </label>
                <Select
                  value={canalConfirmacion}
                  onChange={(e) => setCanalConfirmacion(e.target.value as 'email' | 'whatsapp' | 'ambos')}
                >
                  <option value="email">Email</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="ambos">Ambos</option>
                </Select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="secondary"
                  onClick={onClose}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={enviarConfirmacionHandler}
                  disabled={enviandoConfirmacion}
                  iconLeft={<CheckSquare className="w-4 h-4" />}
                >
                  {enviandoConfirmacion ? 'Enviando...' : 'Enviar Solicitud'}
                </Button>
              </div>
            </div>
          )}

          {/* Tab Mensajes Grupales */}
          {tabActivo === 'mensajes' && (
            <div className="space-y-4">
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <h3 className="font-semibold text-indigo-900 mb-2">Enviar Mensaje Grupal</h3>
                <p className="text-sm text-indigo-700">
                  Envía un mensaje personalizado a todos los participantes del evento
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título del mensaje (opcional)
                </label>
                <Input
                  value={tituloMensajeGrupal}
                  onChange={(e) => setTituloMensajeGrupal(e.target.value)}
                  placeholder="Ej: Cambio de ubicación"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plantilla (opcional)
                </label>
                <Select
                  value={plantillaSeleccionada}
                  onChange={(e) => {
                    setPlantillaSeleccionada(e.target.value);
                    if (e.target.value) {
                      const plantilla = plantillasMensajes.find(p => p.id === e.target.value);
                      if (plantilla) {
                        setMensajeGrupalTexto(plantilla.mensaje);
                      }
                    }
                  }}
                >
                  <option value="">Seleccionar plantilla...</option>
                  {plantillasMensajes.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje
                </label>
                <Textarea
                  value={mensajeGrupalTexto}
                  onChange={(e) => setMensajeGrupalTexto(e.target.value)}
                  rows={8}
                  placeholder="Escribe tu mensaje aquí..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Variables: {'{nombre}'}, {'{eventoNombre}'}, {'{fecha}'}, {'{hora}'}, {'{ubicacion}'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Canal de envío
                </label>
                <Select
                  value={canalMensajeGrupal}
                  onChange={(e) => setCanalMensajeGrupal(e.target.value as 'email' | 'whatsapp' | 'ambos')}
                >
                  <option value="email">Email</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="ambos">Ambos</option>
                </Select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="secondary"
                  onClick={onClose}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={enviarMensajeGrupalHandler}
                  disabled={enviandoMensajeGrupal || (!mensajeGrupalTexto.trim() && !plantillaSeleccionada)}
                  iconLeft={<Send className="w-4 h-4" />}
                >
                  {enviandoMensajeGrupal ? 'Enviando...' : 'Enviar Mensaje'}
                </Button>
              </div>
            </div>
          )}

          {/* Tab Historial */}
          {tabActivo === 'historial' && (
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Historial de Comunicaciones</h3>
                <p className="text-sm text-gray-700">
                  Revisa todas las comunicaciones enviadas para este evento
                </p>
              </div>

              {/* Historial de mensajes grupales */}
              {historialMensajes.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Mensajes Grupales</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {historialMensajes.map(msg => (
                      <div key={msg.id} className="border rounded-lg p-4 bg-white">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-gray-900">{msg.titulo || 'Sin título'}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(msg.fechaEnvio).toLocaleString('es-ES')}
                            </p>
                          </div>
                          <Badge variant={msg.estado === 'enviado' ? 'green' : 'blue'}>
                            {msg.estado}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{msg.mensaje}</p>
                        {msg.estadisticas && (
                          <p className="text-xs text-gray-500 mt-2">
                            {msg.estadisticas.enviados} enviados • {msg.estadisticas.entregados} entregados
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Historial de recordatorios */}
              {historialRecordatorios.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Recordatorios</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {historialRecordatorios.map(rec => (
                      <div key={rec.id} className="border rounded-lg p-3 bg-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{rec.participanteNombre}</p>
                            <p className="text-xs text-gray-500">
                              {rec.canal} • {rec.tiempoAnticipacionHoras}h antes • {new Date(rec.fechaEnvio).toLocaleString('es-ES')}
                            </p>
                          </div>
                          <Badge variant={rec.estado === 'entregado' ? 'green' : 'blue'}>
                            {rec.estado}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {historialMensajes.length === 0 && historialRecordatorios.length === 0 && (
                <div className="text-center py-8">
                  <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No hay comunicaciones registradas aún</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

