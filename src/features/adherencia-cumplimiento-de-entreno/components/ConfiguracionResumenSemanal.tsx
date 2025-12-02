import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select, Switch } from '../../../components/componentsreutilizables';
import { Mail, Save, Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import type { SelectOption } from '../../../components/componentsreutilizables';
import {
  obtenerConfiguracionResumenSemanal,
  guardarConfiguracionResumenSemanal,
  generarResumenSemanal,
  enviarResumenSemanal,
  type ConfiguracionResumenSemanal as ConfiguracionResumenSemanalType,
} from '../api/resumenSemanal';
import { useAuth } from '../../../context/AuthContext';

interface Props {
  entrenadorId?: string;
}

export const ConfiguracionResumenSemanal: React.FC<Props> = ({ entrenadorId }) => {
  const { user } = useAuth();
  const trainerId = entrenadorId || user?.id || '';

  const [config, setConfig] = useState<ConfiguracionResumenSemanalType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);

  const diasSemana: SelectOption[] = [
    { value: 'lunes', label: 'Lunes' },
    { value: 'martes', label: 'Martes' },
    { value: 'miercoles', label: 'Miércoles' },
    { value: 'jueves', label: 'Jueves' },
    { value: 'viernes', label: 'Viernes' },
    { value: 'sabado', label: 'Sábado' },
    { value: 'domingo', label: 'Domingo' },
  ];

  useEffect(() => {
    cargarConfiguracion();
  }, [trainerId]);

  const cargarConfiguracion = async () => {
    try {
      setLoading(true);
      const configuracion = await obtenerConfiguracionResumenSemanal(trainerId);
      setConfig(configuracion);
    } catch (error) {
      console.error('Error al cargar configuración:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;

    try {
      setSaving(true);
      setSaved(false);
      await guardarConfiguracionResumenSemanal(config);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error al guardar configuración:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    if (!config || !config.emailDestinatario) {
      alert('Por favor, ingresa un email de destino para probar el resumen.');
      return;
    }

    try {
      setTesting(true);
      const resumen = await generarResumenSemanal(trainerId);
      await enviarResumenSemanal(resumen, config.emailDestinatario);
      alert('Resumen de prueba enviado correctamente. Revisa tu correo.');
    } catch (error) {
      console.error('Error al enviar resumen de prueba:', error);
      alert('Error al enviar resumen de prueba. Por favor, intenta de nuevo.');
    } finally {
      setTesting(false);
    }
  };

  if (loading || !config) {
    return (
      <Card className="bg-white shadow-sm p-6">
        <div className="text-center py-8">Cargando configuración...</div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Mail size={24} className="text-blue-600" />
          Resumen Semanal Automático por Email
        </h3>
        <p className="text-sm text-gray-600 mt-2">
          Configura un resumen semanal automático con los cambios de adherencia y las alertas más críticas
          para revisarlo desde el correo sin tener que entrar diariamente al panel.
        </p>
      </div>

      <Card className="bg-white shadow-sm p-6">
        <div className="space-y-6">
          {/* Activar/Desactivar */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-semibold text-gray-900">Activar Resumen Semanal</h4>
              <p className="text-sm text-gray-600">
                Recibe un resumen automático cada semana con los cambios de adherencia y alertas críticas
              </p>
            </div>
            <Switch
              checked={config.activo}
              onChange={(checked) => setConfig({ ...config, activo: checked })}
            />
          </div>

          {config.activo && (
            <>
              {/* Email de destino */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email de Destino
                </label>
                <Input
                  type="email"
                  value={config.emailDestinatario}
                  onChange={(e) => setConfig({ ...config, emailDestinatario: e.target.value })}
                  placeholder="tu@email.com"
                  leftIcon={<Mail size={18} />}
                />
                <p className="text-xs text-gray-500 mt-1">
                  El resumen se enviará a esta dirección de correo
                </p>
              </div>

              {/* Día de envío */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar size={18} className="text-blue-600" />
                    Día de Envío
                  </label>
                  <Select
                    value={config.diaEnvio}
                    onChange={(e) => setConfig({ ...config, diaEnvio: e.target.value as any })}
                    options={diasSemana}
                  />
                </div>

                {/* Hora de envío */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Clock size={18} className="text-blue-600" />
                    Hora de Envío
                  </label>
                  <Input
                    type="time"
                    value={config.horaEnvio}
                    onChange={(e) => setConfig({ ...config, horaEnvio: e.target.value })}
                  />
                </div>
              </div>

              {/* Opciones de contenido */}
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900">Contenido del Resumen</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Incluir Cambios de Adherencia</p>
                    <p className="text-sm text-gray-600">
                      Resumen de mejoras y empeoramientos en la adherencia de tus clientes
                    </p>
                  </div>
                  <Switch
                    checked={config.incluirCambiosAdherencia}
                    onChange={(checked) => setConfig({ ...config, incluirCambiosAdherencia: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Incluir Alertas Críticas</p>
                    <p className="text-sm text-gray-600">
                      Notificaciones sobre situaciones que requieren atención
                    </p>
                  </div>
                  <Switch
                    checked={config.incluirAlertasCriticas}
                    onChange={(checked) => setConfig({ ...config, incluirAlertasCriticas: checked })}
                  />
                </div>

                {config.incluirAlertasCriticas && (
                  <div className="flex items-center justify-between pl-6 border-l-2 border-blue-200">
                    <div>
                      <p className="font-medium text-gray-900">Solo Alertas de Alta Prioridad</p>
                      <p className="text-sm text-gray-600">
                        Incluir únicamente las alertas más críticas en el resumen
                      </p>
                    </div>
                    <Switch
                      checked={config.soloAlertasAltaPrioridad}
                      onChange={(checked) => setConfig({ ...config, soloAlertasAltaPrioridad: checked })}
                    />
                  </div>
                )}
              </div>

              {/* Información de próximos envíos */}
              {config.proximoEnvio && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Calendar size={20} className="text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-blue-900">Próximo Envío Programado</p>
                      <p className="text-sm text-blue-700">
                        {config.proximoEnvio.toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })} a las {config.horaEnvio}
                      </p>
                      {config.ultimoEnvio && (
                        <p className="text-xs text-blue-600 mt-1">
                          Último envío: {config.ultimoEnvio.toLocaleDateString('es-ES')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <Button
                  variant="ghost"
                  onClick={handleTest}
                  disabled={testing || !config.emailDestinatario}
                  leftIcon={<Mail size={18} />}
                >
                  {testing ? 'Enviando...' : 'Enviar Resumen de Prueba'}
                </Button>
                <div className="flex items-center gap-2">
                  {saved && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle size={18} />
                      <span className="text-sm">Guardado</span>
                    </div>
                  )}
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    disabled={saving || !config.emailDestinatario}
                    leftIcon={<Save size={18} />}
                  >
                    {saving ? 'Guardando...' : 'Guardar Configuración'}
                  </Button>
                </div>
              </div>
            </>
          )}

          {!config.activo && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-yellow-900">Resumen Semanal Desactivado</p>
                  <p className="text-sm text-yellow-700">
                    Activa el resumen semanal para recibir actualizaciones automáticas por correo electrónico.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

