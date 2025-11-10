import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, Clock, Shield, Bell, MessageSquare, X, Plus, User } from 'lucide-react';
import { Card, Button, Input, Select, Switch, Textarea, Modal } from '../../../components/componentsreutilizables';
import { ConfiguracionPoliticaCancelacion, ExcepcionPoliticaCancelacion, TipoCita } from '../types';
import {
  getConfiguracionPoliticaCancelacion,
  actualizarConfiguracionPoliticaCancelacion,
  agregarExcepcionPolitica,
  eliminarExcepcionPolitica,
} from '../api/metricasNoShows';
import { useAuth } from '../../../context/AuthContext';
import { ClienteAutocomplete } from './ClienteAutocomplete';

export const ConfiguracionPoliticaCancelacion: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<ConfiguracionPoliticaCancelacion | null>(null);
  const [mostrarModalExcepcion, setMostrarModalExcepcion] = useState(false);
  const [nuevaExcepcion, setNuevaExcepcion] = useState<{
    tipo: 'cliente' | 'tipo-sesion' | 'situacion';
    clienteId?: string;
    clienteNombre?: string;
    tipoSesion?: TipoCita;
    descripcion?: string;
    aplicaPenalizacion: boolean;
    tiempoMinimoHoras?: number;
  }>({
    tipo: 'cliente',
    aplicaPenalizacion: false,
  });

  useEffect(() => {
    cargarConfiguracion();
  }, []);

  const cargarConfiguracion = async () => {
    setLoading(true);
    try {
      const configData = await getConfiguracionPoliticaCancelacion(user?.id);
      setConfig(configData);
    } catch (error) {
      console.error('Error cargando configuración:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;

    setSaving(true);
    try {
      const configActualizada = await actualizarConfiguracionPoliticaCancelacion(
        config,
        user?.id
      );
      setConfig(configActualizada);
      alert('Configuración guardada correctamente');
    } catch (error) {
      console.error('Error guardando configuración:', error);
      alert('Error al guardar la configuración. Por favor, intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (updates: Partial<ConfiguracionPoliticaCancelacion>) => {
    if (!config) return;
    setConfig({ ...config, ...updates });
  };

  if (loading || !config) {
    return (
      <Card>
        <div className="p-6 text-center text-gray-500">Cargando configuración...</div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Política de Cancelación y No-Shows</h2>
          </div>

          <div className="space-y-6">
            {/* Activar/Desactivar política */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Activar Política de Cancelación
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Habilita las políticas de cancelación y no-shows
                </p>
              </div>
              <Switch
                checked={config.activo}
                onChange={(checked) => updateConfig({ activo: checked })}
              />
            </div>

            {config.activo && (
              <>
                {/* Tiempo mínimo de cancelación */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Tiempo Mínimo de Cancelación (horas)
                  </label>
                  <Input
                    type="number"
                    value={config.tiempoMinimoCancelacionHoras}
                    onChange={(e) =>
                      updateConfig({
                        tiempoMinimoCancelacionHoras: parseInt(e.target.value) || 24,
                      })
                    }
                    placeholder="24"
                    min="1"
                  />
                  <p className="text-xs text-gray-500">
                    Las cancelaciones con menos de esta cantidad de horas antes de la sesión
                    pueden estar sujetas a penalización
                  </p>
                </div>

                {/* Penalización por no-show */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Aplicar Penalización por No-Show
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Activa el sistema de penalizaciones para no-shows
                    </p>
                  </div>
                  <Switch
                    checked={config.penalizacionNoShow}
                    onChange={(checked) => updateConfig({ penalizacionNoShow: checked })}
                  />
                </div>

                {config.penalizacionNoShow && (
                  <>
                    {/* Tipo de penalización */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Tipo de Penalización
                      </label>
                      <Select
                        value={config.tipoPenalizacion || 'advertencia'}
                        onChange={(e) =>
                          updateConfig({
                            tipoPenalizacion: e.target.value as 'advertencia' | 'cobro' | 'bloqueo',
                          })
                        }
                        options={[
                          { value: 'advertencia', label: 'Advertencia' },
                          { value: 'cobro', label: 'Cobro' },
                          { value: 'bloqueo', label: 'Bloqueo' },
                        ]}
                      />
                      <p className="text-xs text-gray-500">
                        Tipo de penalización que se aplicará después de exceder el límite de no-shows
                      </p>
                    </div>

                    {/* Máximo no-shows antes de alerta */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Máximo No-Shows Antes de Alerta
                      </label>
                      <Input
                        type="number"
                        value={config.maxNoShowsAntesAlerta}
                        onChange={(e) =>
                          updateConfig({
                            maxNoShowsAntesAlerta: parseInt(e.target.value) || 2,
                          })
                        }
                        placeholder="2"
                        min="1"
                      />
                      <p className="text-xs text-gray-500">
                        Número de no-shows antes de generar una alerta
                      </p>
                    </div>

                    {/* Máximo no-shows antes de penalización */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Máximo No-Shows Antes de Penalización
                      </label>
                      <Input
                        type="number"
                        value={config.maxNoShowsAntesPenalizacion}
                        onChange={(e) =>
                          updateConfig({
                            maxNoShowsAntesPenalizacion: parseInt(e.target.value) || 3,
                          })
                        }
                        placeholder="3"
                        min="1"
                      />
                      <p className="text-xs text-gray-500">
                        Número de no-shows antes de aplicar la penalización
                      </p>
                    </div>
                  </>
                )}

                {/* Auto-marcar no-show */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Auto-marcar como No-Show
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Marca automáticamente las sesiones como no-show después de un tiempo de espera
                    </p>
                  </div>
                  <Switch
                    checked={config.autoMarcarNoShow}
                    onChange={(checked) => updateConfig({ autoMarcarNoShow: checked })}
                  />
                </div>

                {config.autoMarcarNoShow && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Minutos de Espera Antes de Auto-marcar No-Show
                    </label>
                    <Input
                      type="number"
                      value={config.minutosEsperaAutoNoShow}
                      onChange={(e) =>
                        updateConfig({
                          minutosEsperaAutoNoShow: parseInt(e.target.value) || 15,
                        })
                      }
                      placeholder="15"
                      min="1"
                    />
                    <p className="text-xs text-gray-500">
                      Tiempo en minutos que se esperará antes de marcar automáticamente como no-show
                    </p>
                  </div>
                )}

                {/* Notificación de política al crear sesión */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      Notificar Política al Crear Sesión
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Envía automáticamente un mensaje al cliente con la política de cancelación al crear una sesión
                    </p>
                  </div>
                  <Switch
                    checked={config.notificarPoliticaAlCrear || false}
                    onChange={(checked) => updateConfig({ notificarPoliticaAlCrear: checked })}
                  />
                </div>

                {/* Mensaje predefinido de política */}
                {config.notificarPoliticaAlCrear && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Mensaje de Política para Clientes
                    </label>
                    <Textarea
                      value={config.mensajePolitica || ''}
                      onChange={(e) => updateConfig({ mensajePolitica: e.target.value })}
                      placeholder="Recordatorio: Por favor cancela con al menos 24 horas de anticipación para evitar penalizaciones."
                      rows={3}
                    />
                    <p className="text-xs text-gray-500">
                      Este mensaje se enviará automáticamente al cliente cuando se cree una sesión
                    </p>
                  </div>
                )}

                {/* Penalización por cancelación tardía */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Aplicar Penalización por Cancelación Tardía
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Activa penalizaciones para cancelaciones que se realizan con menos tiempo del mínimo requerido
                    </p>
                  </div>
                  <Switch
                    checked={config.aplicarPenalizacionCancelacionTardia || false}
                    onChange={(checked) => updateConfig({ aplicarPenalizacionCancelacionTardia: checked })}
                  />
                </div>

                {config.aplicarPenalizacionCancelacionTardia && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Tipo de Penalización para Cancelación Tardía
                    </label>
                    <Select
                      value={config.tipoPenalizacionCancelacionTardia || 'advertencia'}
                      onChange={(e) =>
                        updateConfig({
                          tipoPenalizacionCancelacionTardia: e.target.value as 'advertencia' | 'cobro' | 'bloqueo',
                        })
                      }
                      options={[
                        { value: 'advertencia', label: 'Advertencia' },
                        { value: 'cobro', label: 'Cobro' },
                        { value: 'bloqueo', label: 'Bloqueo' },
                      ]}
                    />
                    <p className="text-xs text-gray-500">
                      Tipo de penalización que se aplicará por cancelaciones tardías
                    </p>
                  </div>
                )}

                {/* Gestión de excepciones */}
                <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Excepciones a la Política
                    </label>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setMostrarModalExcepcion(true)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Agregar Excepción
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600">
                    Define excepciones para clientes, tipos de sesión o situaciones específicas
                  </p>
                  
                  {config.excepciones && config.excepciones.length > 0 && (
                    <div className="space-y-2 mt-4">
                      {config.excepciones.map((excepcion) => (
                        <div
                          key={excepcion.id}
                          className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-900">
                                {excepcion.tipo === 'cliente' && excepcion.clienteNombre
                                  ? `Cliente: ${excepcion.clienteNombre}`
                                  : excepcion.tipo === 'tipo-sesion'
                                  ? `Tipo de Sesión: ${excepcion.tipoSesion}`
                                  : `Situación: ${excepcion.descripcion || 'General'}`}
                              </span>
                              {!excepcion.activa && (
                                <span className="text-xs text-gray-500">(Inactiva)</span>
                              )}
                            </div>
                            {excepcion.descripcion && (
                              <p className="text-xs text-gray-500 mt-1">{excepcion.descripcion}</p>
                            )}
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                              <span>
                                Penalización: {excepcion.aplicaPenalizacion ? 'No aplica' : 'Aplica'}
                              </span>
                              {excepcion.tiempoMinimoHoras && (
                                <span>Tiempo mínimo: {excepcion.tiempoMinimoHoras}h</span>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={async () => {
                              await eliminarExcepcionPolitica(excepcion.id, user?.id);
                              cargarConfiguracion();
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Botón de guardar */}
            <div className="flex justify-end pt-4 border-t">
              <Button variant="primary" onClick={handleSave} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Guardando...' : 'Guardar Configuración'}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Modal para agregar excepción */}
      <Modal
        isOpen={mostrarModalExcepcion}
        onClose={() => {
          setMostrarModalExcepcion(false);
          setNuevaExcepcion({
            tipo: 'cliente',
            aplicaPenalizacion: false,
          });
        }}
        title="Agregar Excepción a la Política"
        size="md"
        footer={
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                setMostrarModalExcepcion(false);
                setNuevaExcepcion({
                  tipo: 'cliente',
                  aplicaPenalizacion: false,
                });
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={async () => {
                try {
                  await agregarExcepcionPolitica({
                    ...nuevaExcepcion,
                    activa: true,
                  }, user?.id);
                  await cargarConfiguracion();
                  setMostrarModalExcepcion(false);
                  setNuevaExcepcion({
                    tipo: 'cliente',
                    aplicaPenalizacion: false,
                  });
                } catch (error) {
                  console.error('Error agregando excepción:', error);
                  alert('Error al agregar la excepción');
                }
              }}
            >
              Agregar
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Excepción
            </label>
            <Select
              value={nuevaExcepcion.tipo}
              onChange={(e) => setNuevaExcepcion({
                ...nuevaExcepcion,
                tipo: e.target.value as 'cliente' | 'tipo-sesion' | 'situacion',
              })}
              options={[
                { value: 'cliente', label: 'Cliente Específico' },
                { value: 'tipo-sesion', label: 'Tipo de Sesión' },
                { value: 'situacion', label: 'Situación General' },
              ]}
            />
          </div>

          {nuevaExcepcion.tipo === 'cliente' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente
              </label>
              <ClienteAutocomplete
                value={nuevaExcepcion.clienteId || ''}
                onChange={(id, nombre) => {
                  setNuevaExcepcion({
                    ...nuevaExcepcion,
                    clienteId: id || undefined,
                    clienteNombre: nombre || undefined,
                  });
                }}
                label=""
                placeholder="Seleccionar cliente"
                role="entrenador"
                userId={user?.id}
              />
            </div>
          )}

          {nuevaExcepcion.tipo === 'tipo-sesion' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Sesión
              </label>
              <Select
                value={nuevaExcepcion.tipoSesion || ''}
                onChange={(e) => setNuevaExcepcion({
                  ...nuevaExcepcion,
                  tipoSesion: e.target.value as TipoCita,
                })}
                options={[
                  { value: 'sesion-1-1', label: 'Sesión 1:1' },
                  { value: 'videollamada', label: 'Videollamada' },
                  { value: 'evaluacion', label: 'Evaluación' },
                  { value: 'fisioterapia', label: 'Fisioterapia' },
                  { value: 'mantenimiento', label: 'Mantenimiento' },
                  { value: 'otro', label: 'Otro' },
                ]}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción (opcional)
            </label>
            <Textarea
              value={nuevaExcepcion.descripcion || ''}
              onChange={(e) => setNuevaExcepcion({
                ...nuevaExcepcion,
                descripcion: e.target.value,
              })}
              placeholder="Descripción de la excepción..."
              rows={2}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <label className="text-sm font-medium text-gray-700">
                No Aplicar Penalización
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Si está activo, no se aplicará penalización para esta excepción
              </p>
            </div>
            <Switch
              checked={nuevaExcepcion.aplicaPenalizacion}
              onChange={(checked) => setNuevaExcepcion({
                ...nuevaExcepcion,
                aplicaPenalizacion: checked,
              })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiempo Mínimo Personalizado (horas, opcional)
            </label>
            <Input
              type="number"
              value={nuevaExcepcion.tiempoMinimoHoras || ''}
              onChange={(e) => setNuevaExcepcion({
                ...nuevaExcepcion,
                tiempoMinimoHoras: e.target.value ? parseInt(e.target.value) : undefined,
              })}
              placeholder="Dejar vacío para usar el tiempo mínimo general"
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1">
              Si se especifica, este tiempo mínimo se usará en lugar del tiempo mínimo general
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

