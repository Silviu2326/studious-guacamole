import React, { useState, useEffect } from 'react';
import { Bell, MessageSquare, Mail, Smartphone, Save, Plus, Trash2, Eye, Zap, Clock, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Card, Button, Input, Select, Badge, Switch } from '../../../components/componentsreutilizables';
import type {
  ConfiguracionRecordatorios as ConfiguracionRecordatoriosData,
  RecordatorioConfiguracion,
  Recordatorio,
} from '../types';
import {
  getConfiguracionRecordatorios,
  saveConfiguracionRecordatorios,
  simularRecordatoriosPendientes,
} from '../api/recordatorios';
import { getCitas } from '../api/calendario';
import { useAuth } from '../../../context/AuthContext';

export const RecordatoriosAutomaticos: React.FC = () => {
  const { user } = useAuth();
  const [configuracion, setConfiguracion] = useState<ConfiguracionRecordatoriosData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [simulacion, setSimulacion] = useState<Recordatorio[]>([]);
  const [cargandoSimulacion, setCargandoSimulacion] = useState(false);
  const [mostrarSimulacion, setMostrarSimulacion] = useState(true);

  useEffect(() => {
    cargarConfiguracion();
  }, []);

  useEffect(() => {
    if (configuracion && mostrarSimulacion) {
      cargarSimulacion();
    }
  }, [configuracion, mostrarSimulacion]);

  const cargarConfiguracion = async () => {
    setLoading(true);
    setError(null);
    try {
      const config = await getConfiguracionRecordatorios(user?.id);
      setConfiguracion(config);
    } catch (error) {
      console.error('Error cargando configuración:', error);
      setError('No se pudo cargar la configuración de recordatorios. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const cargarSimulacion = async () => {
    setCargandoSimulacion(true);
    try {
      const fechaActual = new Date();
      const recordatorios = await simularRecordatoriosPendientes(fechaActual, { userId: user?.id });
      setSimulacion(recordatorios);
    } catch (error) {
      console.error('Error cargando simulación:', error);
    } finally {
      setCargandoSimulacion(false);
    }
  };

  const guardarConfiguracion = async () => {
    if (!configuracion) return;
    setSaving(true);
    try {
      await saveConfiguracionRecordatorios(configuracion.recordatorios, { userId: user?.id });
      await cargarConfiguracion();
      alert('Configuración guardada exitosamente');
    } catch (error) {
      console.error('Error guardando configuración:', error);
      alert('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const agregarRecordatorio = () => {
    if (!configuracion) return;
    const nuevoRecordatorio: RecordatorioConfiguracion = {
      id: `r-${Date.now()}`,
      tiempoAnticipacionHoras: 24,
      activo: true,
      canales: ['whatsapp'],
      orden: configuracion.recordatorios.length + 1,
    };
    setConfiguracion({
      ...configuracion,
      recordatorios: [...configuracion.recordatorios, nuevoRecordatorio],
    });
  };

  const eliminarRecordatorio = (id: string) => {
    if (!configuracion) return;
    setConfiguracion({
      ...configuracion,
      recordatorios: configuracion.recordatorios.filter((r) => r.id !== id),
    });
  };

  const actualizarRecordatorio = (id: string, updates: Partial<RecordatorioConfiguracion>) => {
    if (!configuracion) return;
    setConfiguracion({
      ...configuracion,
      recordatorios: configuracion.recordatorios.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      ),
    });
  };

  const toggleCanal = (recordatorioId: string, canal: 'whatsapp' | 'sms' | 'email') => {
    if (!configuracion) return;
    const recordatorio = configuracion.recordatorios.find((r) => r.id === recordatorioId);
    if (!recordatorio) return;

    const canales = recordatorio.canales.includes(canal)
      ? recordatorio.canales.filter((c) => c !== canal)
      : [...recordatorio.canales, canal];

    actualizarRecordatorio(recordatorioId, { canales });
  };

  const getIconoCanal = (canal: string) => {
    switch (canal) {
      case 'whatsapp':
        return <MessageSquare className="w-4 h-4 text-green-600" />;
      case 'sms':
        return <Smartphone className="w-4 h-4 text-blue-600" />;
      case 'email':
        return <Mail className="w-4 h-4 text-red-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatearOffset = (horas: number): string => {
    if (horas >= 24) {
      const dias = Math.floor(horas / 24);
      return `${dias} ${dias === 1 ? 'día' : 'días'}`;
    }
    return `${horas} ${horas === 1 ? 'hora' : 'horas'}`;
  };

  const obtenerInfoCita = async (citaId: string) => {
    try {
      const fechaInicio = new Date();
      const fechaFin = new Date();
      fechaFin.setDate(fechaFin.getDate() + 7);
      const citas = await getCitas({ fechaInicio, fechaFin });
      return citas.find(c => c.id === citaId);
    } catch (error) {
      console.error('Error obteniendo información de cita:', error);
      return null;
    }
  };

  // Manejo de errores parciales - no rompe toda la página
  if (error && !configuracion) {
    return (
      <Card className="bg-white shadow-sm border-red-200">
        <div className="p-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-red-900 mb-1">
                Error al cargar recordatorios
              </h3>
              <p className="text-sm text-red-700 mb-4">
                {error}
              </p>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={cargarConfiguracion}
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reintentar
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (loading && !configuracion && !error) {
    return (
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-sm text-gray-600">Cargando configuración de recordatorios...</p>
          </div>
        </div>
      </Card>
    );
  }

  if (!configuracion && !loading && !error) {
    return (
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm font-medium text-gray-600 mb-1">No hay configuración disponible</p>
            <p className="text-xs text-gray-500">Configura tus recordatorios automáticos para comenzar.</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Texto explicativo */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Recordatorios Automáticos: Reduce No-Shows y Mejora la Experiencia
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Los recordatorios automáticos son una herramienta poderosa para mantener a tus clientes informados 
                y comprometidos. Al configurar recordatorios estratégicos, puedes:
              </p>
              <ul className="mt-3 space-y-1 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Reducir no-shows hasta en un 40%</strong> al recordar a los clientes sobre sus sesiones próximas</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Mejorar la experiencia del cliente</strong> con comunicación proactiva y profesional</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Aumentar la tasa de confirmación</strong> permitiendo a los clientes confirmar o cancelar fácilmente</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Optimizar tu agenda</strong> al reducir cancelaciones de último momento</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* Configuración principal */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Configuración de Reglas de Recordatorios</h3>
              <p className="text-sm text-gray-600 mt-1">
                Define cuándo y por qué canal se enviarán los recordatorios automáticos
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Activar recordatorios</span>
                <Switch
                  checked={configuracion.activo}
                  onChange={(checked) =>
                    setConfiguracion({ ...configuracion, activo: checked })
                  }
                />
              </div>
              <Button
                variant="primary"
                onClick={guardarConfiguracion}
                disabled={saving}
              >
                <Save className="w-4 h-4 mr-2" />
                Guardar
              </Button>
            </div>
          </div>

          {configuracion.activo && (
            <>
              {/* Lista de recordatorios configurados */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Reglas de Recordatorios
                  </label>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={agregarRecordatorio}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Regla
                  </Button>
                </div>
                <div className="space-y-4">
                  {configuracion.recordatorios.length === 0 ? (
                    <div className="p-6 text-center border-2 border-dashed border-gray-300 rounded-lg">
                      <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">
                        No hay reglas configuradas. Agrega una regla para comenzar a enviar recordatorios automáticos.
                      </p>
                    </div>
                  ) : (
                    configuracion.recordatorios
                      .sort((a, b) => a.orden - b.orden)
                      .map((recordatorio) => (
                        <div
                          key={recordatorio.id}
                          className="p-4 border border-slate-200 rounded-lg bg-slate-50"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                              {/* Offset/Tiempo de anticipación */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Tiempo de anticipación
                                </label>
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="number"
                                    value={recordatorio.tiempoAnticipacionHoras}
                                    onChange={(e) =>
                                      actualizarRecordatorio(recordatorio.id, {
                                        tiempoAnticipacionHoras: parseInt(e.target.value) || 0,
                                      })
                                    }
                                    className="w-24"
                                    min="0"
                                  />
                                  <span className="text-sm text-gray-600">horas antes</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatearOffset(recordatorio.tiempoAnticipacionHoras)} antes de la sesión
                                </p>
                              </div>

                              {/* Estado activo/inactivo */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Estado
                                </label>
                                <div className="flex items-center gap-2">
                                  <Switch
                                    checked={recordatorio.activo}
                                    onChange={(checked) =>
                                      actualizarRecordatorio(recordatorio.id, { activo: checked })
                                    }
                                  />
                                  <span className="text-sm text-gray-600">
                                    {recordatorio.activo ? 'Activo' : 'Inactivo'}
                                  </span>
                                </div>
                              </div>

                              {/* Botón eliminar */}
                              <div className="flex items-end justify-end">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => eliminarRecordatorio(recordatorio.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>

                          {/* Canales de envío */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Canales de envío
                            </label>
                            <div className="flex gap-3">
                              {(['whatsapp', 'sms', 'email'] as const).map((canal) => (
                                <button
                                  key={canal}
                                  type="button"
                                  onClick={() => toggleCanal(recordatorio.id, canal)}
                                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                                    recordatorio.canales.includes(canal)
                                      ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-sm'
                                      : 'bg-white border-slate-200 text-gray-600 hover:bg-slate-50'
                                  }`}
                                >
                                  {getIconoCanal(canal)}
                                  <span className="text-sm font-medium capitalize">{canal}</span>
                                  {recordatorio.canales.includes(canal) && (
                                    <CheckCircle2 className="w-4 h-4" />
                                  )}
                                </button>
                              ))}
                            </div>
                            {recordatorio.canales.length === 0 && (
                              <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                Selecciona al menos un canal para esta regla
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Vista de simulación */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Simulación: Recordatorios de Hoy</h3>
              <p className="text-sm text-gray-600 mt-1">
                Vista previa de los recordatorios que se enviarían hoy según la configuración actual
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setMostrarSimulacion(!mostrarSimulacion);
                }}
              >
                {mostrarSimulacion ? 'Ocultar' : 'Mostrar'} Simulación
              </Button>
              {mostrarSimulacion && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={cargarSimulacion}
                  disabled={cargandoSimulacion}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Actualizar
                </Button>
              )}
            </div>
          </div>

          {mostrarSimulacion && (
            <>
              {cargandoSimulacion ? (
                <div className="p-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="text-sm text-gray-500 mt-2">Calculando recordatorios pendientes...</p>
                </div>
              ) : simulacion.length === 0 ? (
                <div className="p-6 text-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                  <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 font-medium mb-1">
                    No hay recordatorios pendientes para hoy
                  </p>
                  <p className="text-xs text-gray-500">
                    Los recordatorios aparecerán aquí cuando haya sesiones programadas que coincidan con tus reglas configuradas.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-semibold text-blue-900">
                        {simulacion.length} recordatorio{simulacion.length !== 1 ? 's' : ''} pendiente{simulacion.length !== 1 ? 's' : ''} para hoy
                      </span>
                    </div>
                    <Badge color="info">
                      Vista previa
                    </Badge>
                  </div>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {simulacion.map((recordatorio) => (
                      <SimulacionRecordatorioItem
                        key={recordatorio.id}
                        recordatorio={recordatorio}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

// Componente auxiliar para mostrar un item de simulación
const SimulacionRecordatorioItem: React.FC<{ recordatorio: Recordatorio }> = ({ recordatorio }) => {
  const [cita, setCita] = useState<any>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarCita = async () => {
      try {
        const fechaInicio = new Date();
        const fechaFin = new Date();
        fechaFin.setDate(fechaFin.getDate() + 7);
        const citas = await getCitas({ fechaInicio, fechaFin });
        const citaEncontrada = citas.find(c => c.id === recordatorio.citaId);
        setCita(citaEncontrada || null);
      } catch (error) {
        console.error('Error cargando cita:', error);
      } finally {
        setCargando(false);
      }
    };
    cargarCita();
  }, [recordatorio.citaId]);

  const getIconoCanal = (canal: string) => {
    switch (canal) {
      case 'whatsapp':
        return <MessageSquare className="w-4 h-4 text-green-600" />;
      case 'sms':
        return <Smartphone className="w-4 h-4 text-blue-600" />;
      case 'email':
        return <Mail className="w-4 h-4 text-red-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatearOffset = (minutos: number): string => {
    const horas = minutos / 60;
    if (horas >= 24) {
      const dias = Math.floor(horas / 24);
      return `${dias} ${dias === 1 ? 'día' : 'días'}`;
    }
    return `${Math.floor(horas)} ${Math.floor(horas) === 1 ? 'hora' : 'horas'}`;
  };

  if (cargando) {
    return (
      <div className="p-3 border border-slate-200 rounded-lg bg-white">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  const fechaCita = cita ? new Date(cita.fechaInicio) : null;
  const nombreCliente = cita?.cliente?.nombre || cita?.clienteNombre || 'Cliente';
  const tituloSesion = cita?.titulo || 'Sesión';

  return (
    <div className="p-3 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {getIconoCanal(recordatorio.tipo)}
            <span className="text-sm font-semibold text-gray-900 capitalize">{recordatorio.tipo}</span>
            <Badge color={recordatorio.activo ? 'success' : 'warning'} size="sm">
              {recordatorio.activo ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
          <p className="text-sm text-gray-700">
            <strong>{nombreCliente}</strong> - {tituloSesion}
          </p>
          {fechaCita && (
            <p className="text-xs text-gray-500 mt-1">
              Sesión: {fechaCita.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          )}
          <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Recordatorio {formatearOffset(recordatorio.offsetMinutos)} antes
          </p>
        </div>
      </div>
    </div>
  );
};
