import React, { useState, useEffect, useCallback } from 'react';
import { Bell, Clock, User, X, Snooze, Settings, Volume2, VolumeX, CheckCircle2, AlertCircle, Calendar, RotateCcw } from 'lucide-react';
import { Card, Button, Modal, Switch, Input } from '../../../components/componentsreutilizables';
import {
  NotificacionSesion,
  ConfiguracionNotificacionesSesion,
  Cita,
  TipoNotificacionSesion,
} from '../types';
import {
  getNotificacionesSesionPendientes,
  marcarNotificacionComoMostrada,
  marcarNotificacionComoLeida,
  snoozeNotificacion,
  descartarNotificacion,
  getConfiguracionNotificacionesSesion,
  actualizarConfiguracionNotificacionesSesion,
  programarNotificacionesSesiones,
  reproducirSonidoNotificacion,
  mostrarNotificacionPush,
  getContadorNotificacionesNoLeidas,
  estaEnHorarioNoMolestar,
} from '../api/notificacionesSesion';
import { useAuth } from '../../../context/AuthContext';
import { getCitas } from '../api/calendario';

interface NotificacionesSesionProps {
  onVerDetalleSesion?: (citaId: string) => void;
}

export const NotificacionesSesion: React.FC<NotificacionesSesionProps> = ({
  onVerDetalleSesion,
}) => {
  const { user } = useAuth();
  const [notificaciones, setNotificaciones] = useState<NotificacionSesion[]>([]);
  const [contadorNoLeidas, setContadorNoLeidas] = useState(0);
  const [configuracion, setConfiguracion] = useState<ConfiguracionNotificacionesSesion | null>(null);
  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);
  const [mostrarListaNotificaciones, setMostrarListaNotificaciones] = useState(false);
  const [notificacionActual, setNotificacionActual] = useState<NotificacionSesion | null>(null);

  useEffect(() => {
    if (user?.id) {
      cargarConfiguracion();
      cargarNotificaciones();
      cargarContador();
      programarNotificacionesSesiones(user.id);

      // Verificar notificaciones cada minuto
      const interval = setInterval(() => {
        cargarNotificaciones();
        cargarContador();
      }, 60000); // Cada minuto

      return () => clearInterval(interval);
    }
  }, [user?.id]);

  const cargarContador = async () => {
    if (!user?.id) return;
    try {
      const contador = await getContadorNotificacionesNoLeidas(user.id);
      setContadorNoLeidas(contador);
    } catch (error) {
      console.error('Error cargando contador:', error);
    }
  };

  // Verificar notificaciones que deben mostrarse ahora
  useEffect(() => {
    if (notificaciones.length === 0 || !configuracion) return;

    const ahora = new Date();
    const notificacionesParaMostrar = notificaciones.filter((notif) => {
      if (notif.estado !== 'pendiente') return false;
      
      const fechaInicio = new Date(notif.fechaInicio);
      const tiempoRestante = fechaInicio.getTime() - ahora.getTime();
      const minutosRestantes = tiempoRestante / (1000 * 60);

      // Mostrar si está dentro del tiempo de anticipación (con margen de 1 minuto)
      return minutosRestantes <= configuracion.tiempoAnticipacionMinutos && minutosRestantes >= 0;
    });

    if (notificacionesParaMostrar.length > 0) {
      const primeraNotificacion = notificacionesParaMostrar[0];
      mostrarNotificacion(primeraNotificacion);
    }
  }, [notificaciones, configuracion]);

  const cargarConfiguracion = async () => {
    try {
      const config = await getConfiguracionNotificacionesSesion(user?.id);
      setConfiguracion(config);
    } catch (error) {
      console.error('Error cargando configuración:', error);
    }
  };

  const cargarNotificaciones = async () => {
    if (!user?.id) return;
    try {
      const notifs = await getNotificacionesSesionPendientes(user.id, { incluirLeidas: false });
      setNotificaciones(notifs);
      setContadorNoLeidas(notifs.filter(n => n.estado === 'pendiente').length);
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
    }
  };

  const mostrarNotificacion = async (notificacion: NotificacionSesion) => {
    if (!configuracion) return;

    // Verificar horario de no molestar
    if (configuracion.horarioNoMolestar.activo && estaEnHorarioNoMolestar(configuracion.horarioNoMolestar)) {
      // Solo mostrar si es urgente y se permiten urgentes
      if (notificacion.prioridad !== 'urgente' || !configuracion.horarioNoMolestar.permitirUrgentes) {
        return;
      }
    }

    // Verificar si el tipo de notificación está activo
    const configTipo = configuracion.tiposNotificacion.find(t => t.tipo === notificacion.tipoNotificacion);
    if (!configTipo || !configTipo.activo) {
      return;
    }

    setNotificacionActual(notificacion);

    // Reproducir sonido si está activo
    if (configTipo.sonido) {
      reproducirSonidoNotificacion(configTipo.sonidoPersonalizado || 'default');
    }

    // Mostrar notificación push del navegador si está activo
    if (configTipo.push) {
      await mostrarNotificacionPush(notificacion, configuracion);
    }

    // Marcar como mostrada
    await marcarNotificacionComoMostrada(notificacion.id);
  };

  const handleSnooze = async (notificacionId: string) => {
    try {
      await snoozeNotificacion(notificacionId, 5);
      setNotificacionActual(null);
      await cargarNotificaciones();
    } catch (error) {
      console.error('Error snoozeando notificación:', error);
    }
  };

  const handleDescartar = async (notificacionId: string) => {
    try {
      await descartarNotificacion(notificacionId);
      setNotificacionActual(null);
      await cargarNotificaciones();
    } catch (error) {
      console.error('Error descartando notificación:', error);
    }
  };

  const handleVerDetalle = async (citaId: string) => {
    if (notificacionActual) {
      await marcarNotificacionComoLeida(notificacionActual.id);
    }
    if (onVerDetalleSesion) {
      onVerDetalleSesion(citaId);
    }
    setNotificacionActual(null);
    await cargarNotificaciones();
    await cargarContador();
  };

  const handleMarcarComoLeida = async (notificacionId: string) => {
    await marcarNotificacionComoLeida(notificacionId);
    await cargarNotificaciones();
    await cargarContador();
  };

  const guardarConfiguracion = async () => {
    if (!configuracion) return;
    try {
      await actualizarConfiguracionNotificacionesSesion(configuracion);
      setMostrarConfiguracion(false);
      await cargarConfiguracion();
    } catch (error) {
      console.error('Error guardando configuración:', error);
    }
  };

  const getTipoSesionLabel = (tipo: string): string => {
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

  const getIconoTipoNotificacion = (tipo: TipoNotificacionSesion) => {
    switch (tipo) {
      case 'nueva-reserva':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case 'cancelacion':
        return <X className="w-4 h-4 text-red-600" />;
      case 'recordatorio':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'no-show':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'confirmacion':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'reprogramacion':
        return <RotateCcw className="w-4 h-4 text-orange-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTituloTipoNotificacion = (tipo: TipoNotificacionSesion): string => {
    const titulos: Record<TipoNotificacionSesion, string> = {
      'nueva-reserva': 'Nueva reserva',
      'cancelacion': 'Cancelación',
      'recordatorio': 'Recordatorio',
      'no-show': 'No-show',
      'confirmacion': 'Confirmación',
      'reprogramacion': 'Reprogramación',
    };
    return titulos[tipo] || tipo;
  };

  return (
    <>
      {/* Botón de notificaciones en la barra superior */}
      <div className="relative">
        {configuracion?.mostrarBadge && contadorNoLeidas > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center z-10">
            {contadorNoLeidas > 99 ? '99+' : contadorNoLeidas}
          </div>
        )}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMostrarListaNotificaciones(true)}
            className="relative"
            title="Notificaciones"
          >
            <Bell className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMostrarConfiguracion(true)}
            className="relative"
            title="Configuración"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Modal de lista de notificaciones */}
      <Modal
        isOpen={mostrarListaNotificaciones}
        onClose={() => setMostrarListaNotificaciones(false)}
        title="Notificaciones"
        size="md"
      >
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {notificaciones.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay notificaciones pendientes
            </div>
          ) : (
            notificaciones.map((notif) => (
              <div
                key={notif.id}
                className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                  notif.estado === 'pendiente' ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                }`}
                onClick={() => {
                  if (notif.accionUrl && onVerDetalleSesion) {
                    handleVerDetalle(notif.citaId);
                  }
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getIconoTipoNotificacion(notif.tipoNotificacion)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-sm text-gray-900">
                        {getTituloTipoNotificacion(notif.tipoNotificacion)}
                      </h4>
                      {notif.estado === 'pendiente' && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{notif.clienteNombre}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notif.fechaInicio).toLocaleString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    {notif.accionTexto && (
                      <Button
                        variant="primary"
                        size="sm"
                        className="mt-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVerDetalle(notif.citaId);
                        }}
                      >
                        {notif.accionTexto}
                      </Button>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={async (e) => {
                      e.stopPropagation();
                      await handleMarcarComoLeida(notif.id);
                    }}
                    title="Marcar como leída"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>

      {/* Modal de notificación actual */}
      {notificacionActual && (
        <Modal
          isOpen={!!notificacionActual}
          onClose={() => setNotificacionActual(null)}
          title={getTituloTipoNotificacion(notificacionActual.tipoNotificacion)}
          size="md"
          footer={
            <div className="flex gap-3 flex-wrap">
              {notificacionActual.tipoNotificacion === 'recordatorio' && (
                <Button
                  variant="secondary"
                  onClick={() => handleSnooze(notificacionActual.id)}
                >
                  <Snooze className="w-4 h-4 mr-2" />
                  Snooze 5 min
                </Button>
              )}
              {notificacionActual.accionTexto && (
                <Button
                  variant="primary"
                  onClick={() => handleVerDetalle(notificacionActual.citaId)}
                >
                  {notificacionActual.accionTexto}
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={() => handleDescartar(notificacionActual.id)}
              >
                <X className="w-4 h-4 mr-2" />
                Descartar
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              {getIconoTipoNotificacion(notificacionActual.tipoNotificacion)}
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {notificacionActual.clienteNombre}
                </p>
                {notificacionActual.tipoNotificacion === 'recordatorio' && (
                  <p className="text-xs text-gray-500">
                    Sesión en {notificacionActual.tiempoAnticipacionMinutos} minutos
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Tipo:</span>
                <span className="text-sm font-medium text-gray-900">
                  {getTipoSesionLabel(notificacionActual.tipoSesion)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Hora:</span>
                <span className="text-sm font-medium text-gray-900">
                  {new Date(notificacionActual.fechaInicio).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  -{' '}
                  {new Date(notificacionActual.fechaFin).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Prioridad:</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  notificacionActual.prioridad === 'urgente' ? 'bg-red-100 text-red-800' :
                  notificacionActual.prioridad === 'alta' ? 'bg-orange-100 text-orange-800' :
                  notificacionActual.prioridad === 'media' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {notificacionActual.prioridad}
                </span>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de configuración */}
      {configuracion && (
        <Modal
          isOpen={mostrarConfiguracion}
          onClose={() => setMostrarConfiguracion(false)}
          title="Configuración de Notificaciones"
          size="md"
          footer={
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setMostrarConfiguracion(false)}
              >
                Cancelar
              </Button>
              <Button variant="primary" onClick={guardarConfiguracion}>
                Guardar
              </Button>
            </div>
          }
        >
          <div className="space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Activar notificaciones */}
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Activar notificaciones
                </label>
                <p className="text-xs text-gray-500">
                  Recibir notificaciones de sesiones
                </p>
              </div>
              <Switch
                checked={configuracion.activo}
                onChange={(checked) =>
                  setConfiguracion({ ...configuracion, activo: checked })
                }
              />
            </div>

            {/* Mostrar badge */}
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mostrar badge con contador
                </label>
                <p className="text-xs text-gray-500">
                  Mostrar número de notificaciones no leídas
                </p>
              </div>
              <Switch
                checked={configuracion.mostrarBadge}
                onChange={(checked) =>
                  setConfiguracion({ ...configuracion, mostrarBadge: checked })
                }
              />
            </div>

            {/* Tiempo de anticipación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiempo de anticipación (minutos)
              </label>
              <Input
                type="number"
                value={configuracion.tiempoAnticipacionMinutos}
                onChange={(e) =>
                  setConfiguracion({
                    ...configuracion,
                    tiempoAnticipacionMinutos: parseInt(e.target.value) || 10,
                  })
                }
                min="1"
                max="60"
              />
              <p className="text-xs text-gray-500 mt-1">
                Recibirás la notificación esta cantidad de minutos antes de la sesión
              </p>
            </div>

            {/* Configuración por tipo de notificación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Configuración por tipo de notificación
              </label>
              <div className="space-y-4">
                {configuracion.tiposNotificacion.map((tipoConfig, index) => (
                  <div key={tipoConfig.tipo} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getIconoTipoNotificacion(tipoConfig.tipo)}
                        <span className="font-medium text-sm">
                          {getTituloTipoNotificacion(tipoConfig.tipo)}
                        </span>
                      </div>
                      <Switch
                        checked={tipoConfig.activo}
                        onChange={(checked) => {
                          const nuevosTipos = [...configuracion.tiposNotificacion];
                          nuevosTipos[index] = { ...tipoConfig, activo: checked };
                          setConfiguracion({ ...configuracion, tiposNotificacion: nuevosTipos });
                        }}
                      />
                    </div>
                    {tipoConfig.activo && (
                      <div className="ml-6 space-y-2 mt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Notificación push</span>
                          <Switch
                            checked={tipoConfig.push}
                            onChange={(checked) => {
                              const nuevosTipos = [...configuracion.tiposNotificacion];
                              nuevosTipos[index] = { ...tipoConfig, push: checked };
                              setConfiguracion({ ...configuracion, tiposNotificacion: nuevosTipos });
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Sonido</span>
                          <Switch
                            checked={tipoConfig.sonido}
                            onChange={(checked) => {
                              const nuevosTipos = [...configuracion.tiposNotificacion];
                              nuevosTipos[index] = { ...tipoConfig, sonido: checked };
                              setConfiguracion({ ...configuracion, tiposNotificacion: nuevosTipos });
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Vibrar (móvil)</span>
                          <Switch
                            checked={tipoConfig.vibrar}
                            onChange={(checked) => {
                              const nuevosTipos = [...configuracion.tiposNotificacion];
                              nuevosTipos[index] = { ...tipoConfig, vibrar: checked };
                              setConfiguracion({ ...configuracion, tiposNotificacion: nuevosTipos });
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Horario de no molestar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Horario de no molestar
              </label>
              <div className="p-3 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Activar horario de no molestar</span>
                  <Switch
                    checked={configuracion.horarioNoMolestar.activo}
                    onChange={(checked) =>
                      setConfiguracion({
                        ...configuracion,
                        horarioNoMolestar: {
                          ...configuracion.horarioNoMolestar,
                          activo: checked,
                        },
                      })
                    }
                  />
                </div>
                {configuracion.horarioNoMolestar.activo && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Hora inicio</label>
                        <Input
                          type="time"
                          value={configuracion.horarioNoMolestar.horaInicio}
                          onChange={(e) =>
                            setConfiguracion({
                              ...configuracion,
                              horarioNoMolestar: {
                                ...configuracion.horarioNoMolestar,
                                horaInicio: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Hora fin</label>
                        <Input
                          type="time"
                          value={configuracion.horarioNoMolestar.horaFin}
                          onChange={(e) =>
                            setConfiguracion({
                              ...configuracion,
                              horarioNoMolestar: {
                                ...configuracion.horarioNoMolestar,
                                horaFin: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Permitir notificaciones urgentes</span>
                      <Switch
                        checked={configuracion.horarioNoMolestar.permitirUrgentes}
                        onChange={(checked) =>
                          setConfiguracion({
                            ...configuracion,
                            horarioNoMolestar: {
                              ...configuracion.horarioNoMolestar,
                              permitirUrgentes: checked,
                            },
                          })
                        }
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

