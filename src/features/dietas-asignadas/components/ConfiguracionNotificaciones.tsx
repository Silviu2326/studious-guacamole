import React, { useState, useEffect } from 'react';
import { Modal, Button } from '../../../components/componentsreutilizables';
import { Bell, Mail, Smartphone, MessageSquare, Settings, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { 
  PreferenciasNotificaciones, 
  ConfiguracionNotificacionEvento,
  TipoEventoNotificacion,
  TipoNotificacion
} from '../types';
import {
  getPreferenciasNotificaciones,
  guardarPreferenciasNotificaciones,
  toggleNotificacionEvento,
  toggleNotificacionesGlobales,
} from '../api/preferenciasNotificaciones';
import { useAuth } from '../../../context/AuthContext';

interface ConfiguracionNotificacionesProps {
  onClose?: () => void;
}

const eventosInfo: Record<TipoEventoNotificacion, { label: string; descripcion: string; icono: React.ReactNode }> = {
  'feedback-recibido': {
    label: 'Feedback Recibido',
    descripcion: 'Cuando un cliente envía feedback sobre una comida',
    icono: <MessageSquare className="w-4 h-4" />,
  },
  'ia-detecta-riesgo': {
    label: 'IA Detecta Riesgo',
    descripcion: 'Cuando la IA detecta un riesgo nutricional o de salud',
    icono: <AlertTriangle className="w-4 h-4" />,
  },
  'alerta-sobrecarga': {
    label: 'Alerta de Sobrecarga',
    descripcion: 'Cuando se detecta una sobrecarga nutricional',
    icono: <AlertTriangle className="w-4 h-4" />,
  },
  'nuevo-comentario': {
    label: 'Nuevo Comentario',
    descripcion: 'Cuando un profesional deja un comentario',
    icono: <MessageSquare className="w-4 h-4" />,
  },
  'encuesta-completada': {
    label: 'Encuesta Completada',
    descripcion: 'Cuando un cliente completa una encuesta',
    icono: <CheckCircle2 className="w-4 h-4" />,
  },
  'adherencia-baja': {
    label: 'Adherencia Baja',
    descripcion: 'Cuando se detecta una adherencia baja al plan',
    icono: <AlertTriangle className="w-4 h-4" />,
  },
  'sugerencia-colaborador': {
    label: 'Sugerencia de Colaborador',
    descripcion: 'Cuando un colaborador hace una sugerencia',
    icono: <MessageSquare className="w-4 h-4" />,
  },
  'version-creada': {
    label: 'Versión Creada',
    descripcion: 'Cuando se crea una nueva versión del plan',
    icono: <CheckCircle2 className="w-4 h-4" />,
  },
};

const tiposNotificacion: { tipo: TipoNotificacion; label: string; icono: React.ReactNode }[] = [
  { tipo: 'email', label: 'Email', icono: <Mail className="w-4 h-4" /> },
  { tipo: 'push', label: 'Push', icono: <Smartphone className="w-4 h-4" /> },
  { tipo: 'in-app', label: 'In-App', icono: <Bell className="w-4 h-4" /> },
];

export const ConfiguracionNotificaciones: React.FC<ConfiguracionNotificacionesProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [preferencias, setPreferencias] = useState<PreferenciasNotificaciones | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarPreferencias();
  }, []);

  const cargarPreferencias = async () => {
    if (!user?.id) return;
    
    setCargando(true);
    try {
      const prefs = await getPreferenciasNotificaciones(user.id);
      setPreferencias(prefs);
    } catch (error) {
      console.error('Error cargando preferencias de notificaciones:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleToggleGlobal = async (activado: boolean) => {
    if (!preferencias || !user?.id) return;

    const nuevasPreferencias = await toggleNotificacionesGlobales(user.id, activado);
    setPreferencias(nuevasPreferencias);
  };

  const handleToggleNotificacion = async (
    evento: TipoEventoNotificacion,
    tipo: TipoNotificacion,
    activado: boolean
  ) => {
    if (!preferencias || !user?.id) return;

    const nuevasPreferencias = await toggleNotificacionEvento(user.id, evento, tipo, activado);
    setPreferencias(nuevasPreferencias);
  };

  const handleGuardar = async () => {
    if (!preferencias || !user?.id) return;

    setGuardando(true);
    try {
      await guardarPreferenciasNotificaciones(preferencias);
      alert('Preferencias de notificaciones guardadas correctamente');
      onClose?.();
    } catch (error) {
      console.error('Error guardando preferencias:', error);
      alert('Error al guardar las preferencias. Por favor, intenta de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  const getConfiguracionEvento = (evento: TipoEventoNotificacion): ConfiguracionNotificacionEvento | undefined => {
    return preferencias?.eventos.find(e => e.evento === evento);
  };

  if (cargando) {
    return (
      <div className="p-4 text-center">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-sm text-gray-600">Cargando preferencias...</p>
      </div>
    );
  }

  if (!preferencias) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-600">Error al cargar las preferencias.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Configuración de Notificaciones</h3>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Configura cómo y cuándo recibir notificaciones sobre eventos clave. Podrás enterarte incluso si no estás en el editor.
      </p>

      {/* Toggle Global */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Settings className="w-4 h-4 text-gray-600" />
              <label className="text-sm font-medium text-gray-700">Notificaciones Activas</label>
            </div>
            <p className="text-xs text-gray-600">Activar o desactivar todas las notificaciones</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferencias.notificacionesActivas}
              onChange={(e) => handleToggleGlobal(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {/* Configuración por Evento */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Eventos Clave</h4>
        <div className="space-y-4">
          {(Object.keys(eventosInfo) as TipoEventoNotificacion[]).map((evento) => {
            const config = getConfiguracionEvento(evento);
            const info = eventosInfo[evento];
            
            if (!config) return null;

            return (
              <div key={evento} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-2">
                    <div className="p-1.5 bg-blue-100 text-blue-600 rounded">
                      {info.icono}
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">{info.label}</h5>
                      <p className="text-xs text-gray-600 mt-0.5">{info.descripcion}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3 mt-3">
                  {tiposNotificacion.map((tipo) => (
                    <div key={tipo.tipo} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <div className="text-gray-600">{tipo.icono}</div>
                        <span className="text-xs font-medium text-gray-700">{tipo.label}</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={config[tipo.tipo] && preferencias.notificacionesActivas}
                          onChange={(e) => handleToggleNotificacion(evento, tipo.tipo, e.target.checked)}
                          disabled={!preferencias.notificacionesActivas}
                          className="sr-only peer"
                        />
                        <div className={`w-9 h-5 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${
                          !preferencias.notificacionesActivas
                            ? 'bg-gray-200 cursor-not-allowed'
                            : config[tipo.tipo]
                            ? 'bg-blue-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300'
                            : 'bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300'
                        }`}></div>
                      </label>
                    </div>
                  ))}
                </div>

                {/* Configuración adicional para eventos específicos */}
                {evento === 'feedback-recibido' && config.configuracionAdicional?.soloFeedbackNegativo !== undefined && (
                  <div className="mt-3 pt-3 border-t">
                    <label className="flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={config.configuracionAdicional.soloFeedbackNegativo}
                        onChange={(e) => {
                          const nuevosEventos = preferencias.eventos.map(e =>
                            e.evento === evento
                              ? {
                                  ...e,
                                  configuracionAdicional: {
                                    ...e.configuracionAdicional,
                                    soloFeedbackNegativo: e.target.checked,
                                  },
                                }
                              : e
                          );
                          setPreferencias({ ...preferencias, eventos: nuevosEventos });
                        }}
                        className="rounded"
                      />
                      <span className="text-gray-600">Solo notificar si el feedback es negativo</span>
                    </label>
                  </div>
                )}

                {evento === 'ia-detecta-riesgo' && config.configuracionAdicional?.soloRiesgosAltos !== undefined && (
                  <div className="mt-3 pt-3 border-t">
                    <label className="flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={config.configuracionAdicional.soloRiesgosAltos}
                        onChange={(e) => {
                          const nuevosEventos = preferencias.eventos.map(e =>
                            e.evento === evento
                              ? {
                                  ...e,
                                  configuracionAdicional: {
                                    ...e.configuracionAdicional,
                                    soloRiesgosAltos: e.target.checked,
                                  },
                                }
                              : e
                          );
                          setPreferencias({ ...preferencias, eventos: nuevosEventos });
                        }}
                        className="rounded"
                      />
                      <span className="text-gray-600">Solo notificar riesgos de severidad alta</span>
                    </label>
                  </div>
                )}

                {evento === 'adherencia-baja' && config.configuracionAdicional?.umbralAdherencia !== undefined && (
                  <div className="mt-3 pt-3 border-t">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Umbral de adherencia para notificar (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={config.configuracionAdicional.umbralAdherencia}
                      onChange={(e) => {
                        const nuevosEventos = preferencias.eventos.map(e =>
                          e.evento === evento
                            ? {
                                ...e,
                                configuracionAdicional: {
                                  ...e.configuracionAdicional,
                                  umbralAdherencia: parseInt(e.target.value),
                                },
                              }
                            : e
                        );
                        setPreferencias({ ...preferencias, eventos: nuevosEventos });
                      }}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleGuardar} disabled={guardando}>
          {guardando ? 'Guardando...' : 'Guardar Preferencias'}
        </Button>
      </div>
    </div>
  );
};

