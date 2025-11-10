import React, { useState, useEffect } from 'react';
import { Mail, Bell, Save, Clock, Calendar } from 'lucide-react';
import { Card, Button, Input, Select } from '../../../components/componentsreutilizables';
import { Switch } from '../../../components/componentsreutilizables';
import { ConfiguracionResumenDiario } from '../types';
import {
  getConfiguracionResumenDiario,
  actualizarConfiguracionResumenDiario,
} from '../api/resumenDiario';
import { useAuth } from '../../../context/AuthContext';

export const ConfiguracionResumenDiario: React.FC = () => {
  const { user } = useAuth();
  const [configuracion, setConfiguracion] = useState<ConfiguracionResumenDiario | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    cargarConfiguracion();
  }, []);

  const cargarConfiguracion = async () => {
    setLoading(true);
    try {
      const config = await getConfiguracionResumenDiario(user?.id);
      setConfiguracion(config);
    } catch (error) {
      console.error('Error cargando configuración:', error);
    } finally {
      setLoading(false);
    }
  };

  const guardarConfiguracion = async () => {
    if (!configuracion) return;
    setSaving(true);
    try {
      await actualizarConfiguracionResumenDiario(configuracion);
      alert('Configuración guardada exitosamente');
    } catch (error) {
      console.error('Error guardando configuración:', error);
      alert('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-white shadow-sm">
        <div className="p-6 text-center">Cargando...</div>
      </Card>
    );
  }

  if (!configuracion) {
    return (
      <Card className="bg-white shadow-sm">
        <div className="p-6 text-center">Error al cargar la configuración</div>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Resumen Diario de Sesiones</h3>
            <p className="text-sm text-gray-600 mt-1">
              Recibe un resumen cada noche con las sesiones del día siguiente
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Activar resumen</span>
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
          <div className="space-y-6">
            {/* Canal de envío */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Canal de envío
              </label>
              <Select
                value={configuracion.canal}
                onChange={(e) =>
                  setConfiguracion({
                    ...configuracion,
                    canal: e.target.value as 'email' | 'notificacion' | 'ambos',
                  })
                }
                options={[
                  { value: 'email', label: 'Email' },
                  { value: 'notificacion', label: 'Notificación en app' },
                  { value: 'ambos', label: 'Email y Notificación' },
                ]}
              />
            </div>

            {/* Hora de envío */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora de envío
              </label>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-400" />
                <Input
                  type="time"
                  value={configuracion.horaEnvio}
                  onChange={(e) =>
                    setConfiguracion({
                      ...configuracion,
                      horaEnvio: e.target.value,
                    })
                  }
                  className="w-32"
                />
                <span className="text-sm text-gray-500">
                  (Se enviará cada noche a esta hora)
                </span>
              </div>
            </div>

            {/* Email (si es email o ambos) */}
            {(configuracion.canal === 'email' || configuracion.canal === 'ambos') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email de destino
                </label>
                <Input
                  type="email"
                  value={configuracion.email || user?.email || ''}
                  onChange={(e) =>
                    setConfiguracion({
                      ...configuracion,
                      email: e.target.value,
                    })
                  }
                  placeholder="tu@email.com"
                />
              </div>
            )}

            {/* Opciones de contenido */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Contenido del resumen
              </label>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-700">Incluir horarios</span>
                  </div>
                  <Switch
                    checked={configuracion.incluirHorarios}
                    onChange={(checked) =>
                      setConfiguracion({ ...configuracion, incluirHorarios: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-700">Incluir clientes</span>
                  </div>
                  <Switch
                    checked={configuracion.incluirClientes}
                    onChange={(checked) =>
                      setConfiguracion({ ...configuracion, incluirClientes: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-700">Incluir tipos de sesión</span>
                  </div>
                  <Switch
                    checked={configuracion.incluirTiposSesion}
                    onChange={(checked) =>
                      setConfiguracion({ ...configuracion, incluirTiposSesion: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-700">Incluir notas importantes</span>
                  </div>
                  <Switch
                    checked={configuracion.incluirNotas}
                    onChange={(checked) =>
                      setConfiguracion({ ...configuracion, incluirNotas: checked })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Vista previa */}
            <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Vista previa</h4>
              <p className="text-xs text-gray-600">
                Recibirás un resumen cada noche a las {configuracion.horaEnvio} con las sesiones
                del día siguiente. El resumen incluirá:
              </p>
              <ul className="mt-2 space-y-1 text-xs text-gray-600 list-disc list-inside">
                {configuracion.incluirHorarios && <li>Horarios de las sesiones</li>}
                {configuracion.incluirClientes && <li>Nombres de los clientes</li>}
                {configuracion.incluirTiposSesion && <li>Tipos de sesión</li>}
                {configuracion.incluirNotas && <li>Notas importantes</li>}
              </ul>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

