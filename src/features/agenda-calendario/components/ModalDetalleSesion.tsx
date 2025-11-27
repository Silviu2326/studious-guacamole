import React, { useState, useEffect } from 'react';
import { X, Clock, User, FileText, Calendar, History, ExternalLink, UserCircle, Plus, Search, Edit2, Send, CalendarX, RotateCcw } from 'lucide-react';
import { Modal, Button, Input } from '../../../components/componentsreutilizables';
import { Cita, NotaSesion } from '../types';
import { getClientById } from '../../gestión-de-clientes/api/clients';
import { Client360Profile } from '../../gestión-de-clientes/types';
import { getHistorialSesionesCliente, SesionHistorial } from '../api/sesiones';
import { getNotaSesionPorCita, getNotasSesionCliente, buscarNotasSesion } from '../api/notasSesion';
import { ModalAgregarNotaSesion } from './ModalAgregarNotaSesion';
import { ModalCambiarEstadoSesion } from './ModalCambiarEstadoSesion';
import { enviarRecordatorio, getConfiguracionRecordatorios } from '../api/recordatorios';
import { useAuth } from '../../../context/AuthContext';
import { RecordatorioConfiguracion } from '../types';

interface ModalDetalleSesionProps {
  isOpen: boolean;
  onClose: () => void;
  cita: Cita | null;
  onVerPerfilCliente?: (clienteId: string) => void;
  onEditarSesion?: (cita: Cita) => void;
  onCancelarSesion?: (cita: Cita) => void;
  onReprogramarSesion?: (cita: Cita) => void;
}

export const ModalDetalleSesion: React.FC<ModalDetalleSesionProps> = ({
  isOpen,
  onClose,
  cita,
  onVerPerfilCliente,
  onEditarSesion,
  onCancelarSesion,
  onReprogramarSesion,
}) => {
  const { user } = useAuth();
  const [cliente, setCliente] = useState<Client360Profile | null>(null);
  const [historialSesiones, setHistorialSesiones] = useState<SesionHistorial[]>([]);
  const [notaActual, setNotaActual] = useState<NotaSesion | null>(null);
  const [notasCliente, setNotasCliente] = useState<NotaSesion[]>([]);
  const [busquedaNotas, setBusquedaNotas] = useState('');
  const [loading, setLoading] = useState(false);
  const [enviandoRecordatorio, setEnviandoRecordatorio] = useState(false);
  const [mostrarModalNota, setMostrarModalNota] = useState(false);
  const [mostrarModalEstado, setMostrarModalEstado] = useState(false);

  useEffect(() => {
    if (isOpen && cita?.clienteId) {
      cargarDatosCliente();
      cargarHistorialSesiones();
      cargarNotaActual();
      cargarNotasCliente();
    }
  }, [isOpen, cita]);

  useEffect(() => {
    if (!cita?.clienteId) return;

    const timeoutId = setTimeout(async () => {
      try {
        if (busquedaNotas) {
          const notas = await buscarNotasSesion(busquedaNotas, cita.clienteId);
          setNotasCliente(notas);
        } else {
          const notas = await getNotasSesionCliente(cita.clienteId);
          setNotasCliente(notas);
        }
      } catch (error) {
        console.error('Error cargando/buscando notas:', error);
      }
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timeoutId);
  }, [busquedaNotas, cita?.clienteId]);

  const cargarDatosCliente = async () => {
    if (!cita?.clienteId) return;
    setLoading(true);
    try {
      const clienteData = await getClientById(cita.clienteId);
      setCliente(clienteData);
    } catch (error) {
      console.error('Error cargando datos del cliente:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarHistorialSesiones = async () => {
    if (!cita?.clienteId) return;
    try {
      const historial = await getHistorialSesionesCliente(cita.clienteId);
      setHistorialSesiones(historial);
    } catch (error) {
      console.error('Error cargando historial de sesiones:', error);
    }
  };

  const cargarNotaActual = async () => {
    if (!cita) return;
    try {
      const nota = await getNotaSesionPorCita(cita.id);
      setNotaActual(nota);
    } catch (error) {
      console.error('Error cargando nota actual:', error);
    }
  };

  const cargarNotasCliente = async () => {
    if (!cita?.clienteId) return;
    try {
      const notas = await getNotasSesionCliente(cita.clienteId);
      setNotasCliente(notas);
    } catch (error) {
      console.error('Error cargando notas del cliente:', error);
    }
  };

  const getTipoSesionLabel = (tipo: string) => {
    const tipos: Record<string, string> = {
      'sesion-1-1': 'Sesión 1 a 1',
      'videollamada': 'Videollamada',
      'evaluacion': 'Evaluación',
      'clase-colectiva': 'Clase Colectiva',
      'fisioterapia': 'Fisioterapia',
      'mantenimiento': 'Mantenimiento',
      'otro': 'Otro',
    };
    return tipos[tipo] || tipo;
  };

  const getEstadoLabel = (estado: string) => {
    const estados: Record<string, string> = {
      'pendiente': 'Pendiente',
      'confirmada': 'Confirmada',
      'en-curso': 'En Curso',
      'completada': 'Completada',
      'cancelada': 'Cancelada',
      'no-show': 'No Show',
    };
    return estados[estado] || estado;
  };

  const getEstadoColor = (estado: string) => {
    const colores: Record<string, string> = {
      'pendiente': 'bg-yellow-100 text-yellow-800',
      'confirmada': 'bg-blue-100 text-blue-800',
      'en-curso': 'bg-purple-100 text-purple-800',
      'completada': 'bg-green-100 text-green-800',
      'cancelada': 'bg-orange-100 text-orange-800',
      'no-show': 'bg-red-100 text-red-800',
    };
    return colores[estado] || 'bg-gray-100 text-gray-800';
  };

  const calcularDuracion = (fechaInicio: Date, fechaFin: Date): string => {
    const duracionMs = new Date(fechaFin).getTime() - new Date(fechaInicio).getTime();
    const duracionMinutos = Math.round(duracionMs / (1000 * 60));
    const horas = Math.floor(duracionMinutos / 60);
    const minutos = duracionMinutos % 60;
    
    if (horas > 0) {
      return `${horas}h ${minutos}min`;
    }
    return `${minutos}min`;
  };

  const handleVerPerfilCliente = () => {
    if (cita?.clienteId) {
      if (onVerPerfilCliente) {
        onVerPerfilCliente(cita.clienteId);
      }
      // Si no hay callback, simplemente cerrar el modal
      // La navegación se puede manejar externamente
      onClose();
    }
  };

  const handleEditar = () => {
    if (cita && onEditarSesion) {
      onEditarSesion(cita);
      onClose();
    }
  };

  const handleCancelar = () => {
    if (cita && onCancelarSesion) {
      onCancelarSesion(cita);
      onClose();
    }
  };

  const handleReprogramar = () => {
    if (cita && onReprogramarSesion) {
      onReprogramarSesion(cita);
      onClose();
    }
  };

  const handleEnviarRecordatorio = async () => {
    if (!cita) return;

    setEnviandoRecordatorio(true);
    try {
      const configuracion = await getConfiguracionRecordatorios(user?.id);
      let recordatorioConfig: RecordatorioConfiguracion;
      
      if (configuracion && configuracion.recordatorios.length > 0) {
        // Usar la primera configuración activa o la primera disponible
        const configActiva = configuracion.recordatorios.find(r => r.activo) || configuracion.recordatorios[0];
        recordatorioConfig = {
          id: configActiva.id,
          tiempoAnticipacionHoras: configActiva.tiempoAnticipacionHoras,
          activo: true,
          canales: configActiva.canales.length > 0 ? configActiva.canales : [configuracion.canalPorDefecto || 'whatsapp'],
          orden: configActiva.orden,
        };
      } else {
        // Usar configuración por defecto
        recordatorioConfig = {
          id: `rec-${Date.now()}`,
          tiempoAnticipacionHoras: 24,
          activo: true,
          canales: ['whatsapp'],
          orden: 1,
        };
      }
      
      await enviarRecordatorio(cita, recordatorioConfig);
      alert('Recordatorio enviado exitosamente');
    } catch (error) {
      console.error('Error enviando recordatorio:', error);
      alert('Error al enviar el recordatorio. Por favor, intenta de nuevo.');
    } finally {
      setEnviandoRecordatorio(false);
    }
  };

  const getAvatarUrl = () => {
    if (cliente?.name) {
      // Generar iniciales como fallback
      const iniciales = cliente.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(cliente.name)}&size=128&background=4f46e5&color=fff&bold=true`;
    }
    return null;
  };

  if (!cita) return null;

  const fechaInicio = new Date(cita.fechaInicio);
  const fechaFin = new Date(cita.fechaFin);
  const duracion = calcularDuracion(fechaInicio, fechaFin);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalle de Sesión"
      size="lg"
      footer={
        <div className="flex flex-col gap-3 w-full">
          {/* Acciones rápidas principales */}
          <div className="flex flex-wrap gap-2 justify-between items-center">
            <Button
              variant="secondary"
              onClick={handleVerPerfilCliente}
              className="flex items-center gap-2"
            >
              <UserCircle className="w-4 h-4" />
              Ver Perfil del Cliente
            </Button>
            <div className="flex gap-2">
              {onEditarSesion && (
                <Button
                  variant="secondary"
                  onClick={handleEditar}
                  className="flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Editar
                </Button>
              )}
              {onReprogramarSesion && cita.estado !== 'cancelada' && cita.estado !== 'completada' && (
                <Button
                  variant="secondary"
                  onClick={handleReprogramar}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reprogramar
                </Button>
              )}
              {onCancelarSesion && cita.estado !== 'cancelada' && (
                <Button
                  variant="secondary"
                  onClick={handleCancelar}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700"
                >
                  <CalendarX className="w-4 h-4" />
                  Cancelar
                </Button>
              )}
              {cita.estado !== 'cancelada' && cita.estado !== 'completada' && (
                <Button
                  variant="secondary"
                  onClick={handleEnviarRecordatorio}
                  disabled={enviandoRecordatorio}
                  className="flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {enviandoRecordatorio ? 'Enviando...' : 'Enviar Recordatorio'}
                </Button>
              )}
            </div>
          </div>
          
          {/* Acciones secundarias */}
          <div className="flex gap-2 justify-end border-t pt-3">
            {(cita.estado === 'completada' || cita.estado === 'no-show') && (
              <Button
                variant="ghost"
                onClick={() => setMostrarModalNota(true)}
                className="flex items-center gap-2"
              >
                {notaActual ? (
                  <>
                    <Edit2 className="w-4 h-4" />
                    Editar Nota
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Agregar Nota
                  </>
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={() => setMostrarModalEstado(true)}
              className="flex items-center gap-2"
            >
              Cambiar Estado
            </Button>
            <Button variant="primary" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Información del Cliente */}
        <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
          <div className="flex-shrink-0">
            {cliente ? (
              <img
                src={getAvatarUrl() || ''}
                alt={cliente.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  if (target.nextElementSibling) {
                    (target.nextElementSibling as HTMLElement).style.display = 'flex';
                  }
                }}
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
                {cita.clienteNombre?.charAt(0).toUpperCase() || 'C'}
              </div>
            )}
            <div
              className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 hidden items-center justify-center text-white text-xl font-bold shadow-md"
            >
              {cita.clienteNombre?.charAt(0).toUpperCase() || 'C'}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {cita.clienteNombre || 'Cliente sin nombre'}
            </h3>
            {cliente && (
              <div className="space-y-1 text-sm text-gray-600">
                {cliente.email && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{cliente.email}</span>
                  </div>
                )}
                {cliente.phone && (
                  <div className="flex items-center gap-2">
                    <span>{cliente.phone}</span>
                  </div>
                )}
                {cliente.status && (
                  <div className="mt-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        cliente.status === 'activo'
                          ? 'bg-green-100 text-green-800'
                          : cliente.status === 'en-riesgo'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {cliente.status === 'activo'
                        ? 'Activo'
                        : cliente.status === 'en-riesgo'
                        ? 'En Riesgo'
                        : 'Perdido'}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Información de la Sesión */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">Fecha y Hora</span>
            </div>
            <p className="text-base font-semibold text-gray-900">
              {fechaInicio.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <p className="text-sm text-gray-600">
              {fechaInicio.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
              })}{' '}
              - {fechaFin.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="font-medium">Duración</span>
            </div>
            <p className="text-base font-semibold text-gray-900">{duracion}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FileText className="w-4 h-4" />
              <span className="font-medium">Tipo de Sesión</span>
            </div>
            <p className="text-base font-semibold text-gray-900">
              {getTipoSesionLabel(cita.tipo)}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">Estado</span>
            </div>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(
                cita.estado
              )}`}
            >
              {getEstadoLabel(cita.estado)}
            </span>
          </div>
        </div>

        {/* Notas Previas */}
        {cita.notas && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FileText className="w-4 h-4" />
              <span>Notas Previas</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{cita.notas}</p>
            </div>
          </div>
        )}

        {/* Descripción */}
        {cita.descripcion && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FileText className="w-4 h-4" />
              <span>Descripción</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{cita.descripcion}</p>
            </div>
          </div>
        )}

        {/* Ubicación */}
        {cita.ubicacion && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <span>Ubicación</span>
            </div>
            <p className="text-sm text-gray-700">{cita.ubicacion}</p>
          </div>
        )}

        {/* Nota de la sesión actual */}
        {notaActual && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FileText className="w-4 h-4" />
                <span>Nota de Sesión</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMostrarModalNota(true)}
                className="text-xs"
              >
                <Edit2 className="w-3 h-3 mr-1" />
                Editar
              </Button>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-3">
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-1">Qué se trabajó:</p>
                <p className="text-sm text-gray-700">{notaActual.queSeTrabajo}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-1">Cómo se sintió:</p>
                <p className="text-sm text-gray-700">{notaActual.comoSeSintio}</p>
              </div>
              {notaActual.observaciones && (
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-1">Observaciones:</p>
                  <p className="text-sm text-gray-700">{notaActual.observaciones}</p>
                </div>
              )}
              {notaActual.proximosPasos && (
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-1">Próximos pasos:</p>
                  <p className="text-sm text-gray-700">{notaActual.proximosPasos}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Historial de Sesiones Anteriores */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <History className="w-4 h-4" />
              <span>Historial de Sesiones Anteriores</span>
            </div>
          </div>
          {loading ? (
            <div className="text-center py-4 text-gray-500 text-sm">Cargando historial...</div>
          ) : historialSesiones.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {historialSesiones.map((sesion) => {
                const fechaSesion = new Date(sesion.fechaInicio);
                return (
                  <div
                    key={sesion.id}
                    className="p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-gray-900">
                            {fechaSesion.toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                          <span className="text-xs text-gray-500">
                            {fechaSesion.toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              sesion.estado === 'completada'
                                ? 'bg-green-100 text-green-800'
                                : sesion.estado === 'cancelada'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {getEstadoLabel(sesion.estado)}
                          </span>
                          <span className="text-xs text-gray-600">
                            {getTipoSesionLabel(sesion.tipo)}
                          </span>
                          {sesion.asistencia !== undefined && (
                            <span
                              className={`text-xs ${
                                sesion.asistencia ? 'text-green-600' : 'text-red-600'
                              }`}
                            >
                              {sesion.asistencia ? '✓ Asistió' : '✗ No asistió'}
                            </span>
                          )}
                        </div>
                        {sesion.notas && (
                          <p className="text-xs text-gray-600 mt-1">{sesion.notas}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500 text-sm">
              No hay sesiones anteriores registradas
            </div>
          )}
        </div>

        {/* Notas del Cliente */}
        {notasCliente.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FileText className="w-4 h-4" />
                <span>Notas del Cliente</span>
              </div>
            </div>
            <div className="space-y-2">
              <Input
                placeholder="Buscar en notas..."
                value={busquedaNotas}
                onChange={(e) => setBusquedaNotas(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {notasCliente.map((nota) => (
                <div
                  key={nota.id}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-gray-900">
                          {new Date(nota.fechaSesion).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div>
                          <p className="text-xs font-semibold text-gray-700">Qué se trabajó:</p>
                          <p className="text-xs text-gray-600">{nota.queSeTrabajo}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-700">Cómo se sintió:</p>
                          <p className="text-xs text-gray-600">{nota.comoSeSintio}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal para agregar/editar nota */}
      <ModalAgregarNotaSesion
        isOpen={mostrarModalNota}
        onClose={() => {
          setMostrarModalNota(false);
          cargarNotaActual();
          cargarNotasCliente();
        }}
        cita={cita}
        onNotaCreada={() => {
          cargarNotaActual();
          cargarNotasCliente();
        }}
      />

      {/* Modal para cambiar estado */}
      <ModalCambiarEstadoSesion
        isOpen={mostrarModalEstado}
        onClose={() => {
          setMostrarModalEstado(false);
        }}
        cita={cita}
        onEstadoCambiado={(citaActualizada) => {
          // Recargar datos cuando cambia el estado
          cargarNotaActual();
          // Cerrar modal después de actualizar
          setMostrarModalEstado(false);
          // Opcional: cerrar el modal de detalle para refrescar la vista
          onClose();
        }}
      />
    </Modal>
  );
};

