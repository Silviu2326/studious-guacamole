import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, Clock, Shield, Bell, MessageSquare, X, Plus, User, Info, TrendingDown, Users, Zap } from 'lucide-react';
import { Card, Button, Input, Select, Switch, Textarea, Modal } from '../../../components/componentsreutilizables';
import type { ConfiguracionPoliticaCancelacion as ConfiguracionPoliticaCancelacionData, ExcepcionPoliticaCancelacion, TipoCita } from '../types';
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
  const [config, setConfig] = useState<ConfiguracionPoliticaCancelacionData | null>(null);
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

  const updateConfig = (updates: Partial<ConfiguracionPoliticaCancelacionData>) => {
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

  // Opciones rápidas de tiempo mínimo
  const opcionesTiempoRapido = [
    { value: 2, label: '2 horas', desc: 'Cancelación muy corta' },
    { value: 12, label: '12 horas', desc: 'Cancelación corta' },
    { value: 24, label: '24 horas', desc: 'Recomendado (1 día)' },
    { value: 48, label: '48 horas', desc: 'Cancelación media (2 días)' },
    { value: 72, label: '72 horas', desc: 'Cancelación amplia (3 días)' },
  ];

  return (
    <div className="space-y-6">
      {/* Banner informativo sobre el impacto de las políticas */}
      <Card className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-blue-200">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Info className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¿Cómo las políticas de cancelación mejoran tu negocio?
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                Las políticas de cancelación bien configuradas son fundamentales para reducir los no-shows, 
                proteger tus ingresos y mejorar la experiencia tanto para ti como para tus clientes. 
                Al establecer reglas claras, los clientes saben qué esperar y tienden a ser más responsables con sus compromisos.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-start gap-2">
                  <TrendingDown className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Reduce No-Shows</p>
                    <p className="text-xs text-gray-600">Hasta un 40-60% menos de ausencias sin aviso</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Zap className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Protege tus Ingresos</p>
                    <p className="text-xs text-gray-600">Tienes tiempo para rellenar huecos cancelados</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Users className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Mejor Experiencia</p>
                    <p className="text-xs text-gray-600">Clientes más comprometidos y puntuales</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

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
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Tiempo Mínimo de Cancelación (horas)
                  </label>
                  
                  {/* Opciones rápidas */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-3">
                    {opcionesTiempoRapido.map((opcion) => (
                      <button
                        key={opcion.value}
                        type="button"
                        onClick={() => updateConfig({ tiempoMinimoCancelacionHoras: opcion.value })}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          config.tiempoMinimoCancelacionHoras === opcion.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="font-semibold text-sm text-gray-900">{opcion.label}</div>
                        <div className="text-xs text-gray-500 mt-1">{opcion.desc}</div>
                      </button>
                    ))}
                  </div>

                  {/* Input personalizado */}
                  <div className="flex items-center gap-3">
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
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-500 whitespace-nowrap">horas antes</span>
                  </div>
                  
                  <p className="text-xs text-gray-500">
                    Las cancelaciones con menos de esta cantidad de horas antes de la sesión
                    pueden estar sujetas a penalización. <strong>Recomendación:</strong> Un plazo de 24-48 horas 
                    suele ser un buen equilibrio entre flexibilidad para clientes y protección para tu negocio.
                  </p>
                </div>

                {/* Sección: Penalizaciones por No-Show */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    Penalizaciones por No-Show
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Configura cómo se gestionan las ausencias sin aviso. Las penalizaciones ayudan a 
                    educar a los clientes sobre la importancia de cumplir sus compromisos.
                  </p>
                  
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Aplicar Penalización por No-Show
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Activa el sistema de penalizaciones para no-shows. Recomendado para reducir ausencias recurrentes.
                      </p>
                    </div>
                    <Switch
                      checked={config.penalizacionNoShow}
                      onChange={(checked) => updateConfig({ penalizacionNoShow: checked })}
                    />
                  </div>
                </div>

                {config.penalizacionNoShow && (
                  <>
                    {/* Tipo de penalización */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Tipo de Penalización por No-Show
                      </label>
                      <Select
                        value={config.tipoPenalizacion || 'advertencia'}
                        onChange={(e) =>
                          updateConfig({
                            tipoPenalizacion: e.target.value as 'advertencia' | 'cobro' | 'bloqueo',
                          })
                        }
                        options={[
                          { value: 'advertencia', label: 'Advertencia - Solo notificación al cliente' },
                          { value: 'cobro', label: 'Cobro - Cargo automático por la sesión perdida' },
                          { value: 'bloqueo', label: 'Bloqueo - Impide reservar nuevas sesiones hasta regularizar' },
                        ]}
                      />
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-2">
                        <p className="text-xs text-gray-700">
                          <strong>Impacto:</strong> {
                            config.tipoPenalizacion === 'advertencia' 
                              ? 'La advertencia informa al cliente sobre el problema sin consecuencias financieras. Útil para clientes puntuales que tuvieron una emergencia.'
                              : config.tipoPenalizacion === 'cobro'
                              ? 'El cobro protege tus ingresos pero puede afectar la relación con el cliente. Úsalo cuando el tiempo perdido tiene un costo significativo.'
                              : 'El bloqueo es la medida más estricta y efectiva para clientes recurrentes problemáticos. Úsalo cuando otras medidas no funcionan.'
                          }
                        </p>
                      </div>
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

                {/* Sección: Automatizaciones */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    Automatizaciones
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Configura acciones automáticas para ahorrar tiempo y mantener tus registros actualizados.
                  </p>
                  
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Auto-marcar como No-Show
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Marca automáticamente las sesiones como no-show después de un tiempo de espera. 
                        Útil para mantener estadísticas precisas sin intervención manual.
                      </p>
                    </div>
                    <Switch
                      checked={config.autoMarcarNoShow}
                      onChange={(checked) => updateConfig({ autoMarcarNoShow: checked })}
                    />
                  </div>

                  {config.autoMarcarNoShow && (
                    <div className="space-y-2 mt-4">
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
                        Tiempo en minutos que se esperará después de la hora de inicio antes de marcar automáticamente como no-show. 
                        <strong> Recomendación:</strong> 15-30 minutos es un tiempo razonable para dar margen a retrasos menores.
                      </p>
                    </div>
                  )}
                </div>

                {/* Sección: Comunicación de Políticas */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-purple-600" />
                    Comunicación de Políticas a Clientes
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    La comunicación proactiva de tus políticas mejora el cumplimiento. Cuando los clientes 
                    conocen las reglas desde el inicio, tienden a ser más responsables y respetuosos con tu tiempo.
                  </p>
                  
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Bell className="w-4 h-4" />
                        Notificar Política al Crear Sesión
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Envía automáticamente un mensaje al cliente con la política de cancelación al crear una sesión. 
                        <strong className="text-blue-600"> Recomendado para máxima transparencia.</strong>
                      </p>
                    </div>
                    <Switch
                      checked={config.notificarPoliticaAlCrear || false}
                      onChange={(checked) => updateConfig({ notificarPoliticaAlCrear: checked })}
                    />
                  </div>

                  {/* Mensaje predefinido de política */}
                  {config.notificarPoliticaAlCrear && (
                    <div className="space-y-2 mt-4">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Mensaje de Política para Clientes
                      </label>
                      <Textarea
                        value={config.mensajePolitica || ''}
                        onChange={(e) => updateConfig({ mensajePolitica: e.target.value })}
                        placeholder={`Hola! Recordatorio importante: Para cancelar o reprogramar tu sesión, por favor hazlo con al menos ${config.tiempoMinimoCancelacionHoras} horas de anticipación. Las cancelaciones tardías o no asistir sin aviso pueden tener consecuencias. Gracias por tu comprensión!`}
                        rows={4}
                      />
                      <p className="text-xs text-gray-500">
                        Este mensaje se enviará automáticamente al cliente cuando se cree una sesión. 
                        Puedes usar un tono amigable pero profesional para mantener una buena relación.
                      </p>
                    </div>
                  )}
                </div>

                {/* Sección: Penalizaciones por Cancelación Tardía */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-600" />
                    Penalizaciones por Cancelación Tardía
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Las cancelaciones tardías (fuera del plazo mínimo) dificultan rellenar el hueco. 
                    Estas penalizaciones ayudan a incentivar cancelaciones con suficiente anticipación.
                  </p>
                  
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
                    <div className="space-y-2 mt-4">
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
                          { value: 'advertencia', label: 'Advertencia - Solo notificación al cliente' },
                          { value: 'cobro', label: 'Cobro - Cargo por cancelación tardía' },
                          { value: 'bloqueo', label: 'Bloqueo - Impide nuevas reservas hasta regularizar' },
                        ]}
                      />
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-2">
                        <p className="text-xs text-gray-700">
                          <strong>Nota:</strong> Las cancelaciones tardías suelen ser menos graves que los no-shows, 
                          ya que al menos te avisaron. Considera empezar con advertencias y escalar si el problema persiste.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Gestión de excepciones */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-600" />
                        <div>
                          <label className="text-base font-semibold text-gray-900">
                            Excepciones a la Política
                          </label>
                          <p className="text-xs text-gray-600 mt-1">
                            Define excepciones para casos especiales donde la política general no aplica
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setMostrarModalExcepcion(true)}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Agregar Excepción
                      </Button>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-blue-100">
                      <p className="text-xs text-gray-700">
                        <strong>Cuándo usar excepciones:</strong> Las excepciones te permiten ser flexible con 
                        clientes de confianza, situaciones especiales (como emergencias médicas), o tipos de sesión 
                        que requieren políticas diferentes. Úsalas con moderación para mantener la integridad de tu política general.
                      </p>
                    </div>
                  
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

